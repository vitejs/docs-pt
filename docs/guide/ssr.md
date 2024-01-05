# Interpretação do Lado do Servidor {#server-side-rendering}

:::tip NOTA
A Interpretação do Lado do Servidor refere-se especialmente às abstrações de front-end (por exemplo, React, Preact, Vue, e a Svelte) que suportam executar a mesma aplicação na Node.js, pré-interpretando-a a HTML, e finalmente hidratando-a no cliente. Se estivermos procurando por integração com abstrações do lado do servidor tradicionais, consultar o [guia de Integração do Backend](./backend-integration).

O seguinte guia também presume prévia trabalhando com a Interpretação do Lado do Servidor na nossa abstrações de escolha, e apenas focar-se-á sobre os detalhes de integração específicos da Vite.
:::

:::warning API DE BAIXO NÍVEL
Isto é uma API de baixo nível destinada aos autores de biblioteca e abstração. Se o nosso objetivo for criar uma aplicação, devemos consultar primeiro as extensões de Interpretação do Lado do Servidor de nível superior e ferramentas na [seção da Interpretação do Lado do Servidor da Awesome Vite](https://github.com/vitejs/awesome-vite#ssr).
:::

:::tip APOIO
Se tivermos questões, a comunidade é normalmente útil no [canal da `#ssr` da Discord da Vite](https://discord.gg/PkbxgzPhJv).
:::

## Projetos de Exemplo {#example-projects}

A Vite oferece suporte embutido para interpretação do lado do servidor. [`create-vite-extra`](https://github.com/bluwy/create-vite-extra) contém configurações de interpretação do lado do servidor de exemplo que podemos usar como referências para este guia:

- [Vanilla](https://github.com/bluwy/create-vite-extra/tree/master/template-ssr-vanilla)
- [Vue](https://github.com/bluwy/create-vite-extra/tree/master/template-ssr-vue)
- [React](https://github.com/bluwy/create-vite-extra/tree/master/template-ssr-react)
- [Preact](https://github.com/bluwy/create-vite-extra/tree/master/template-ssr-preact)
- [Svelte](https://github.com/bluwy/create-vite-extra/tree/master/template-ssr-svelte)
- [Solid](https://github.com/bluwy/create-vite-extra/tree/master/template-ssr-solid)

Nós também podemos estruturar estes projetos localmente [executando `create-vite`](./#scaffolding-your-first-vite-project) e escolhendo `Others > create-vite-extra` sob a opção de abstração.

## Estrutura da Fonte {#source-structure}

Um aplicação de SSR normal terá a seguinte estrutura de ficheiro de fonte:

```
- index.html
- server.js # o servidor da aplicação principal
- src/
  - main.js          # exporta o código da aplicação agnóstica de ambiente (universal)
  - entry-client.js  # monta a aplicação à um elemento do DOM
  - entry-server.js  # interpreta a aplicação utilizando a API de SSR da abstração
```

O `index.html` precisará referenciar o `entry-client.js` e incluir um segurador de lugar onde a marcação interpretada pelo servidor deve ser injetada:

```html
<div id="app"><!--ssr-outlet--></div>
<script type="module" src="/src/entry-client.js"></script>
```

Tu podes utilizar qualquer segurador de lugar que preferires ao invés de `<!--ssr-outlet-->`, enquanto puder ser substituído precisamente.

## Lógica Condicional {#conditional-logic}

Se precisares de realizar a lógica condicional com base em SSR versus cliente, podes utilizar:

```js
if (import.meta.env.SSR) {
  // ... lógica apenas de servidor
}
```

Isto é estaticamente substituído durante a construção assim permitirá a sacudidura de árvore dos ramos que não são utilizados.

## Configurando o Servidor de Desenvolvimento {#setting-up-the-dev-server}

Quando estiveres construindo uma aplicação de SSR, provavelmente queres ter o controlo total sobre o teu servidor principal e separar a Vite do ambiente de produção. É portanto recomendado utilizar a Vite no modo de intermediário. Aqui está um exemplo com a [express](https://expressjs.com/):

**server.js**

```js{15-18}
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import express from 'express'
import { createServer as createViteServer } from 'vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

async function createServer() {
  const app = express()

  // Cria o servidor de Vite no mode de intermediário e configura o tipo da
  // aplicação como 'custom', desativando a lógica de serviço de HTML
  // própria da Vite assim o servidor pode tomar o controlo.
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'custom'
  })

  // utilize a instância de conexão da vite como intermediário
  // Se utilizares o teu próprio roteador de express ("express.Router()")
  // deves utilizar "router.use"
  app.use(vite.middlewares)

  app.use('*', async (req, res) => {
    // sirva "index.html" - nós lidaremos com isto a seguir
  })

  app.listen(5173)
}

createServer()
```

Aqui a `vite` é uma instância de [ViteDevServer](./api-javascript#vitedevserver). A `vite.middlewares` é uma instância de [Connect](https://github.com/senchalabs/connect) que pode ser utilizada como um intermediário em qualquer abstração de Node.js compatível com a `connect`.

O etapa a seguir é a implementação de um manipulador de `*` para servir o HTML interpretado no servidor:

```js
app.use('*', async (req, res, next) => {
  const url = req.originalUrl

  try {
    // 1. Lê a "index.html"
    let template = fs.readFileSync(
      path.resolve(__dirname, 'index.html'),
      'utf-8'
    )

    // 2. Aplica as transformações de HTML da Vite. Isto injeta o cliente de HMR da Vite,
    //    e também aplica as transformações de HTML das extensões de Vite, por exemplo
    //    preâmbulos globais do "@vitejs/plugin-react"
    template = await vite.transformIndexHtml(url, template)

    // 3. Carrega a entrada do servidor. A "vite.ssrLoadModule" transforma
    //    automaticamente o teu código-fonte de ESM para ser utilizável na Node.js!
    //    Não é necessário o empacotamento, e fornece invalidação eficiente similar a HMR.
    const { render } = await vite.ssrLoadModule('/src/entry-server.js')

    // 4. interpreta a HTML da aplicação. Isto presume que a função `render` exportada do
    //    "entry-server.js" chama as APIs da SSR da abstração apropriada,
    //    por exemplo "ReactDOMServer.renderToString()"
    const appHtml = await render(url)

    // 5. Injeta o HTML interpretado pela aplicação no modelo de marcação
    const html = template.replace(`<!--ssr-outlet-->`, appHtml)

    // 6. Envia o HTML interpretado de volta.
    res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
  } catch (e) {
    // Se um error for capturado, deixa a Vite corrigir o traço da pilha
    // assim mapeia de volta para o teu código-fonte real.
    vite.ssrFixStacktrace(e)
    next(e)
  }
})
```

O programa `dev` no `package.json` também deve ser mudado para utilizar o programa de servidor:

```diff
  "scripts": {
-   "dev": "vite"
+   "dev": "node server"
  }
```

## Construindo para Produção {#building-for-production}

Para entregar um projeto de SSR para produção, precisamos de:

1. Produzir uma construção de cliente como normal;
2. Produzir uma construção de SSR, a qual pode ser diretamente carregada através de `import()` para que não tenhamos que passar pela `ssrLoadModule` da Vite;

Os nossos programas no `package.json` se parecerão com isto:

```json
{
  "scripts": {
    "dev": "node server",
    "build:client": "vite build --outDir dist/client",
    "build:server": "vite build --outDir dist/server --ssr src/entry-server.js "
  }
}
```

Nota que a bandeira `--ssr` a qual indica que isto é uma construção de SSR. Ela também deve especificar a entrada de SSR.

Então, no `server.js` precisamos adicionar alguma lógica especifica de produção verificando `process.env.`<wbr>`NODE_ENV`:

- No lugar de ler o `index.html` da raiz, utilize o `dist/client/index.html` como modelo de marcação, já que ele contém as ligações de recurso corretas para a construção de cliente.

- No lugar de `await vite.ssrLoadModule('/src/entry-server.js')`, utilize `import('./dist/server/entry-server.js')` (este ficheiro é o resultado da construção de SSR).

- Mova a criação e toda utilização do servidor de desenvolvimento da `vite` para trás os ramos condicionais de apenas desenvolvimento, depois adicione os intermediários de serviço de ficheiro estático para servir os ficheiros a partir do `dist/client`.

Consulte os [projetos de exemplo](#example-projects) por uma configuração em funcionamento.

## Gerando Diretivas de Pré-Carregamento {#generating-preload-directives}

O `vite build` suporta a bandeira `--ssrManifest` que gerará o `.vite/ssr-manifest.json` na diretório de saída da construção:

```diff
- "build:client": "vite build --outDir dist/client",
+ "build:client": "vite build --outDir dist/client --ssrManifest",
```

O programa acima agora gerará `dist/client/.vite/ssr-manifest.json` para a construção de cliente (Sim, o manifesto de SSR é gerado a partir da construção de cliente porque queremos mapear os IDs do módulo para os ficheiros do cliente). O manifesto contém mapeamentos de IDs do módulo para os seus pedaços associados e ficheiros de recurso.

Para influenciar o manifesto, as abstrações precisam fornecer uma maneira de coletar os IDs do módulo dos componentes que foram utilizados durante uma chamada do interpretador do servidor.

O `@vitejs/plugin-vue` suporta isto fora da caixa e regista automaticamente os IDs do módulo do componente utilizado para o contexto de SSR de Vue associado:

```js
// src/entry-server.js
const ctx = {}
const html = await vueServerRenderer.renderToString(app, ctx)
// "ctx.modules" é agora um conjunto de IDs de módulo que foram utilizados durante a interpretação
```

No ramo de produção do `server.js` precisamos ler e passar o manifesto para a função `render` exportada pelo `src/entry-server.js`. Isto nos forneceria informação suficiente para interpretar os diretórios de pré-carregamento pelos ficheiros utilizados pelas rotas assíncronas! Consulte a [fonte da demonstração](https://github.com/vitejs/vite-plugin-vue/blob/main/playground/ssr-vue/src/entry-server.js) por um exemplo completo.

## Pré-Interpretação / SSG {#pre-rendering-ssg}

Se as rotas e dos dados necessários para certas rotas forem reconhecidas antes do momento marcado, podemos pré-interpretar estas rotas para HTML estático utilizando a mesma lógica que a SSR de produção. Isto também pode ser considerado de uma forma de Geração de Sítio Estático (SSG, sigla em Inglês). Consulte o [programa de pré-interpretação de demonstração](https://github.com/vitejs/vite-plugin-vue/blob/main/playground/ssr-vue/prerender.js) por exemplo funcionando.

## Os Exteriores da SSR {#ssr-externals}

As dependências são "expostas" a partir do sistema de módulo de transformação de SSR da Vite por padrão quando estiveres executando a SSR. Isto acelera ambos o desenvolvimento e a construção.

Se uma dependência precisa ser transformada pela conduta da Vite, por exemplo, uma vez que as funcionalidades da Vite são utilizadas com seu código não traduzido nelas, elas podem ser adicionadas ao [`ssr.noExternal`](../config/ssr-options.md#ssr-noexternal).

Para as dependências ligadas, não são expostas por padrão para tirarem vantagem da HMR da Vite. Se isto não for desejado, por exemplo, para testar as dependências como se elas não estivessem ligadas, podes adicioná-lo ao [`ssr.external`](../config/ssr-options.md#ssr-external).

:::warning Trabalhando com Pseudónimos
Se tiveres pseudónimos configurados que redirecionam um pacote para um outro, podes querer atribuir pseudónimo aos pacotes do `node_modules` ao  invés de fazê-lo funcionar para as dependências expostas de SSR. Ambos [yarn](https://classic.yarnpkg.com/en/docs/cli/add/#toc-yarn-add-alias) e [pnpm](https://pnpm.io/aliases/) suportam a definição de pseudónimos através do prefixo `npm:`.
:::

## Lógica de Extensão Específica de SSR {#ssr-specific-plugin-logic}

Algumas abstrações tais como Vue ou Svelte compilam os componentes para formatos diferentes baseado no cliente versus SSR. Para suportar transformações condicionais, a Vite passa uma propriedade `ssr` adicional no objeto `options` dos seguintes gatilhos de extensão:

- `resolveId`
- `load`
- `transform`

**Exemplo:**

```js
export function mySSRPlugin() {
  return {
    name: 'my-ssr',
    transform(code, id, options) {
      if (options?.ssr) {
        // realiza a transformação específica de ssr...
      }
    }
  }
}
```

O objeto de opções no `load` e `transform` é opcional, a Rollup não está atualmente utilizando este objeto mas pode estender estes gatilhos com metadados adicionais no futuro.

:::tip NOTA
Antes da Vite 2.7, isto era informado aos gatilhos de extensão com um parâmetro `ssr` posicional no lugar da utilização do objeto `options`. A maioria das abstrações e extensões estão atualizadas mas podes encontrar publicações desatualizadas utilizando a API anterior.
:::

## Alvo da SSR {#ssr-target}

O alvo padrão para a construção de SSR é um ambiente de Node, mas também podes executar o servidor um Operário de Web (Web Worker, em Inglês). A resolução da entrada de pacotes é diferente para cada plataforma. Tu podes configurar o alvo para ser um Operário de Web utilizando a `ssr.target` definida para `'webworker'`.

## Pacote da SSR {#ssr-bundle}

Em alguns casos como executores de `webworker`, podes querer empacotar a tua construção de SSR em um único ficheiro de JavaScript. Tu podes ativar este comportamento definindo a `ssr.noExternal` para `true`. Isto fará duas coisas:

- Trata todas dependências como `noExternal`
- Lança um erro se quaisquer embutidos de Node.js forem importados

## Condições de Resolução da Interpretação do Lado do Servidor {#ssr-resolve-conditions}

Por padrão a resolução da entrada de pacote usará as condições definidas na
[`resolve.conditions`](../config/shared-options#resolve-conditions) para a construção da interpretação no lado do servidor. Nós podemos usar [`ssr.resolve.conditions`](../config/ssr-options#ssr-resolve-conditions) e [`ssr.resolve.externalConditions`](../config/ssr-options#ssr-resolve-externalconditions) para personalizar este comportamento.

## Interface da Linha de Comando da Vite {#vite-cli}

Os comandos de Linha de Comando `$ vite dev` e `$ vite preview` também podem ser utilizados para aplicações de SSR. Tu podes adicionar os teus intermediários de SSR ao servidor de desenvolvimento com [`configureServer`](/guide/api-plugin#configureserver) e ao servidor de pré-visualização com [`configurePreviewServer`](/guide/api-plugin#configurepreviewserver).

:::tip NOTA
Utilize um gatilho de publicação para o teu intermediário de SSR executar _depois_ dos intermediários da Vite.
:::
