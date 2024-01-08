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

Vite fornece suporte embutido para interpretação do lado do servidor (SSR, sigla em Inglês). A [`create-vite-extra`](https://github.com/bluwy/create-vite-extra) contém configurações de Interpretação do Lado do Servidor de exemplo que podemos usar como referência para este guia:

- [Vanilla](https://github.com/bluwy/create-vite-extra/tree/master/template-ssr-vanilla)
- [Vue](https://github.com/bluwy/create-vite-extra/tree/master/template-ssr-vue)
- [React](https://github.com/bluwy/create-vite-extra/tree/master/template-ssr-react)
- [Preact](https://github.com/bluwy/create-vite-extra/tree/master/template-ssr-preact)
- [Svelte](https://github.com/bluwy/create-vite-extra/tree/master/template-ssr-svelte)
- [Solid](https://github.com/bluwy/create-vite-extra/tree/master/template-ssr-solid)

Nós também podemos estruturar estes projetos localmente [executando `create-vite`](./index#scaffolding-your-first-vite-project) e escolher `Others > create-vite-extra` sob a opção de abstração.

## Estrutura do Código-Fonte {#source-structure}

Uma aplicação de Interpretação do Lado do Servidor normal terá a seguinte estrutura de ficheiro de código-fonte:

```
- index.html
- server.js # servidor da aplicação principal
- src/
  - main.js          # exporta o código da aplicação agnóstica de ambiente (universal)
  - entry-client.js  # monta a aplicação a um elemento do DOM
  - entry-server.js  # interpreta a aplicação usando a API da Interpretação do Lado do Servidor da abstração
```

O `index.html` precisará referenciar o `entry-client.js` e incluir um marcador de posição onde a marcação interpretada pelo servidor deveria ser injetada:

```html
<div id="app"><!--ssr-outlet--></div>
<script type="module" src="/src/entry-client.js"></script>
```

Nós podemos usar qualquer marcador de posição que preferirmos no lugar de `<!--ssr-outlet-->`, desde que este possa ser substituído precisamente.

## Lógica Condicional {#conditional-logic}

Se precisarmos de realizar a lógica condicional baseada na Interpretação do Lado do Servidor vs. cliente, podemos usar:

```js
if (import.meta.env.SSR) {
  // ... apenas a lógica do servidor
}
```

Isto é substituído estaticamente durante a construção, assim esta permitirá a agitação da árvore dos ramos não usados.

## Configurando o Servidor de Desenvolvimento {#setting-up-the-dev-server}

Quando construirmos uma aplicação de Interpretação do Lado do Servidor, provavelmente queremos ter controlo total sobre o nosso servidor principal e dissociar a Vite do ambiente de produção. É portanto recomendado usar a Vite no modo intermediário. Eis um exemplo com a [express](https://expressjs.com/):

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

  // Criar servidor da Vite no modo intermediário e
  // configurar o tipo da aplicação como 'custom',
  // desativando a lógica de serviço de HTML da própria
  // Vite, assim o servidor pai pode assumir o controlo
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'custom'
  })

  // Usar a instância conectar da vite como intermediário.
  // Se usarmos o nosso próprio roteador da express (
  // `express.Router()`), deveríamos usar `router.use`
  // Quando o servidor reiniciar (por exemplo, depois do
  // utilizador modificar `vite.config.js`), `vite.middlewares`
  // continua a ser a mesma referência (com uma nova pilha
  // interna da Vite e intermediários injetados pela extensão).
  // O seguinte é válido mesmo depois de reiniciar.
  app.use(vite.middlewares)

  app.use('*', async (req, res) => {
    // servir `index.html` - abordaremos isto mais tarde
  })

  app.listen(5173)
}

createServer()
```

Neste exemplo a `vite` é uma instância de [`ViteDevServer`](./api-javascript#vitedevserver). A `vite.middlewares` é uma instância de [`Connect`](https://github.com/senchalabs/connect) que pode ser usada como um intermediário em qualquer abstração de Node.js compatível com a `connect`.

A próxima etapa está implementando o manipulador `*` para servir o HTML interpretado pelo servidor:

```js
app.use('*', async (req, res, next) => {
  const url = req.originalUrl

  try {
    // 1. Ler o `index.html`
    let template = fs.readFileSync(
      path.resolve(__dirname, 'index.html'),
      'utf-8',
    )

    // 2. Aplicar as transformações de HTML da Vite.
    // Isto injeta o cliente da substituição de módulo
    // instantânea da Vite, e também aplica as
    // transformações a partir das extensões da Vite,
    // por exemplo, os preâmbulos globais de
    // `@vitejs/plugin-react`
    template = await vite.transformIndexHtml(url, template)

    // 3. Carregar a entrada do servidor. `ssrLoadModule`
    // transforma automaticamente o código-fonte do módulo
    // de ECMAScript para ser usável na Node.js! Não existe
    // nenhum empacotamento obrigatório, e fornece
    // invalidação eficiente semelhante à substituição de
    // módulo instantânea.
    const { render } = await vite.ssrLoadModule('/src/entry-server.js')

    // 4. Interpretar o HTML da aplicação. Isto presume que
    // a função `render` exportada do `entry-server.js` chama
    // as APIs da Interpretação do Lado do Servidor corretas,
    // por exemplo, `ReactDOMServer.renderToString()`
    const appHtml = await render(url)

    // 5. Injetar o HTML interpretado pela aplicação no modelo.
    const html = template.replace('<!--ssr-outlet-->', appHtml)

    // 6. Enviar o HTML interpretado de volta.
    res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
  } catch(e) {
    // Se um erro for capturado, permitir a Vite corrigir o vestígio
    // da pilha, assim esta mapeia de volta ao nosso código-fonte.
    vite.ssrFixStackTrace(e)
    next(e)
  }
})
```

O programa `dev` no `package.json` também deve ser alterado para usar o programa do servidor:

```diff
  "scripts": {
-   "dev": "vite"
+   "dev": "node server"
  }
```

## Construindo para Produção {#building-for-production}

Para entregar um projeto de Interpretação do Lado do Servidor para produção, precisamos:

1. Produzir uma construção do cliente como normal;
2. Produzir uma construção da Interpretação do Lado do Servidor, que pode ser diretamente carregada através da `import()` para que não tenhamos passar pela `ssrLoadModule` da Vite;

Os nossos programas no `package.json` parecer-se-ão com isto:

```json
{
  "scripts": {
    "dev": "node server",
    "build:client": "vite build --outDir dist/client",
    "build:server": "vite build --outDir dist/server --ssr src/entry-server.js"
  }
}
```

Nota que a opção `--ssr`, a qual indica que isto é uma construção da Interpretação do Lado do Servidor. Esta também deve especificar a entrada da Interpretação do Lado do Servidor.

Depois, no `server.js` precisamos adicionar alguma lógica específica de produção verificando `process.env.NODE_ENV`:

- Ao invés de ler o `index.html` da raiz, usamos o `dist/client/index.html` como modelo de marcação, já que este contém as ligações corretas do recurso à construção do cliente.

- Ao invés de `await vite.ssrLoadModule('/src/entry-server.js')`, usamos `import('./dist/server/entry-server.js')` (este ficheiro é o resultado da construção da Interpretação do Lado do Servidor).

- Movemos a criação e todo uso do servidor de desenvolvimento da `vite` atrás dos ramos condicionais exclusivos de desenvolvimento, depois adicionamos intermediários de serviço de ficheiro estático para servir os ficheiros a partir da `dist/client`.

Consultar os [projetos de exemplo](#example-projects) por uma configuração que funciona.

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
