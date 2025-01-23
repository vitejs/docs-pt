# Interpretação do Lado do Servidor {#server-side-rendering}

:::tip NOTA
A Interpretação do Lado do Servidor refere-se especialmente às abstrações de front-end (por exemplo, React, Preact, Vue, e a Svelte) que suportam executar a mesma aplicação na Node.js, pré-interpretando-a a HTML, e finalmente hidratando-a no cliente. Se estivermos procurando por integração com abstrações do lado do servidor tradicionais, consultar o [guia de Integração do Backend](./backend-integration).

O seguinte guia também presume prévia trabalhando com a Interpretação do Lado do Servidor na nossa abstrações de escolha, e apenas focar-se-á sobre os detalhes de integração específicos da Vite.
:::

:::warning API DE BAIXO NÍVEL
Isto é uma API de baixo nível destinada aos autores de biblioteca e abstração. Se o nosso objetivo for criar uma aplicação, devemos consultar primeiro as extensões de Interpretação do Lado do Servidor de nível superior e ferramentas na [secção da Interpretação do Lado do Servidor da Awesome Vite](https://github.com/vitejs/awesome-vite#ssr).

Atualmente, a Vite está trabalhando uma API de interpretação do lado do servidor melhorada com a [API de Ambiente](https://github.com/vitejs/vite/discussions/16358). Consultar a hiperligação por mais detalhes.
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
import 'vite/client'

if (import.meta.env.SSR) {
  // ... apenas a lógica do servidor
}
```

Isto é substituído estaticamente durante a construção, assim esta permitirá a agitação da árvore dos ramos não usados.

## Configurando o Servidor de Desenvolvimento {#setting-up-the-dev-server}

Quando construirmos uma aplicação de Interpretação do Lado do Servidor, provavelmente queremos ter controlo total sobre o nosso servidor principal e dissociar a Vite do ambiente de produção. É portanto recomendado usar a Vite no modo intermediário. Eis um exemplo com a [express](https://expressjs.com/) (v4):

```js{15-18} twoslash [server.js]
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
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
  // interna da Vite e intermediários injetados por extensões).
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

```js twoslash [server.js]
// @noErrors
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

/** @type {import('express').Express} */
var app
/** @type {import('vite').ViteDevServer}  */
var vite


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

```diff [package.json]
  "scripts": {
-   "dev": "vite"
+   "dev": "node server"
  }
```

## Construindo para Produção {#building-for-production}

Para entregar um projeto de Interpretação do Lado do Servidor para produção, precisamos:

1. Produzir uma construção do cliente como normal;
2. Produzir uma construção da Interpretação do Lado do Servidor, que pode ser diretamente carregada através da `import()` para que não tenhamos que passar pela `ssrLoadModule` da Vite;

Os nossos programas no `package.json` parecer-se-ão com isto:

```json [package.json]
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

O `vite build` suporta a opção `--ssrManifest` que gerará o `.vite/ssr-manifest.json` no diretório de saída da construção:

```diff
- "build:client": "vite build --outDir dist/client",
+ "build:client": "vite build --outDir dist/client --ssrManifest",
```

O programa acima agora gerará o `dist/client/.vite/ssr-manifest.json` para a construção do cliente (Sim, o manifesto da Interpretação do Lado do Servidor é gerado a partir da construção do cliente porque queremos mapear os identificadores do módulo aos ficheiros do cliente). O manifesto contém os mapeamentos dos identificadores do módulos aos seus pedaços associados e ficheiros de recurso.

Para influenciar o manifesto, as abstrações precisam fornecer uma maneira reunir os identificadores do módulo dos componentes que foram usados durante a chamada de interpretação do servidor.

A `@vitejs/plugin-vue` suporta isto fora da caixa e regista automaticamente os identificadores do módulo do componente usados no contexto da Interpretação do Lado do Servidor da Vue associado:

```js [src/entry-server.js]
const ctx = {}
const html = await vueServerRenderer.renderToString(app, ctx)
// `ctx.modules` agora é um conjunto de identificadores do
// módulo que foram usados durante a interpretação
```

No ramo da produção do `server.js` precisamos ler e passar o manifesto à função `render` exportada pelo `src/entry-server.js`. Isto forneceria-nos informação suficiente para interpretar as diretivas de pré-carregamento para os ficheiros usados pelas rotas assíncronas! Consultar o [código-fonte da demonstração](https://github.com/vitejs/vite-plugin-vue/blob/main/playground/ssr-vue/src/entry-server.js) por um exemplo completo. Nós também podemos usar esta informação para as [Sugestões Prematuras 103](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/103).

## Pré-Interpretação ou Geração de Aplicação Estática {#pre-rendering-ssg}

Se as rotas e os dados necessários para certas rotas forem reconhecidas antes do tempo, podemos pré-interpretar estas rotas em HTML estático usando a mesma lógica que a Interpretação do Lado do Servidor de produção. Isto também pode ser considerado uma forma de Geração de Aplicação Estática (SSG, sigla em Inglês). Consultar o [programa da pré-interpretação de demonstração](https://github.com/vitejs/vite-plugin-vue/blob/main/playground/ssr-vue/prerender.js) por exemplo que funciona.

## Os Exteriores da Interpretação do Lado do Servidor {#ssr-externals}

As dependências são "expostas" a partir do sistema de módulo de transformação da Interpretação do Lado do Servidor da Vite por padrão quando executamos a Interpretação do Lado do Servidor. Isto acelera ambos desenvolvimento e construção.

Se uma dependência precisar ser transformada pela conduta da Vite, por exemplo, uma vez que as funcionalidades da Vite são usadas sem serem traduzidas nestas, estas podem ser adicionadas à [`ssr.noExternal`](../config/ssr-options#ssr-noexternal).

Para as dependências ligadas, estas não são expostas por padrão para aproveitarem-se da Substituição de Módulo Instantânea da Vite. Se isto não for desejado, por exemplo, para testar as dependências como se estas não estivessem ligadas, podemos adicionar à [`ssr.external`](../config/ssr-options#ssr-external).

:::warning TRABALHANDO COM PSEUDÓNIMOS
Se tivermos pseudónimos configurados que redirecionam um pacote a um outro, podemos querer atribuir um pseudónimo aos pacotes da `node_modules` ao invés de fazê-la funcionar para as dependências expostas da Interpretação do Lado do Servidor. Ambas [Yarn](https://classic.yarnpkg.com/en/docs/cli/add/#toc-yarn-add-alias) e [pnpm](https://pnpm.io/aliases/) suportam a definição de pseudónimos através do prefixo `npm:`.
:::

## Lógica de Extensão Específica da Interpretação do Lado do Servidor {#ssr-specific-plugin-logic}

Algumas abstrações tais como a Vue ou a Svelte compilam os componentes para diferentes formatos baseado no cliente vs. a Interpretação do Lado do Servidor. Para suportar transformações condicionais, a Vite passa uma propriedade `ssr` adicional no objeto `options` das seguintes funções gatilhos de extensão:

- `resolveId`
- `load`
- `transform`

**Exemplo:**

```js
/** @type {() => import('vite').Plugin} */

export function mySSRPlugin() {
  return {
    name: 'my-ssr',
    transform(code, id, options) {
      if (options?.ssr) {
        // realizar transformação específica da
        // interpretação do lado do servidor...
      }
    },
  }
}
```

O objeto de opções na `load` e `transform` é opcional, a `rollup` atualmente não está usando este objeto mas pode estender estas funções gatilhos com metadados adicionais no futuro.

:::tip NOTA
Antes da Vite 2.7, isto era informado às funções gatilhos de extensão com um parâmetro `ssr` posicional ao invés de usar o objeto `options`. Todas as principais abstrações e extensão estão atualizadas mas podemos encontrar publicações desatualizadas usando a API anterior.
:::

## Alvo da Interpretação do Lado do Servidor {#ssr-target}

O alvo padrão para a construção da Interpretação do Lado do Servidor é um ambiente da `node`, mas também podemos executar o servidor num Operário da Web. A resolução da entrada dos pacotes é diferente para cada plataforma. Nós podemos configurar o alvo para ser um Operário da Web usando a `ssr.target` definida para `'webworker'`.

## Pacote da Interpretação do Lado do Servidor {#ssr-bundle}

Em alguns casos como as execuções do `webworker`, podemos querer empacotar a nossa construção da Interpretação do Lado do Servidor num único ficheiro de JavaScript. Nós podemos ativar este comportamento definindo `ssr.noExternal` a `true`. Isto fará duas coisas:

- Tratar todas as dependências como `noExternal`
- Lançar um erro se quaisquer funcionalidades embutidas da Node.js forem importadas

## Condições de Resolução da Interpretação do Lado do Servidor {#ssr-resolve-conditions}

Por padrão a resolução da entrada de pacote usará as condições definidas na
[`resolve.conditions`](../config/shared-options#resolve-conditions) para a construção da Interpretação do Lado do Servidor. Nós podemos usar [`ssr.resolve.conditions`](../config/ssr-options#ssr-resolve-conditions) e [`ssr.resolve.externalConditions`](../config/ssr-options#ssr-resolve-externalconditions) para personalizar este comportamento.

## Interface da Linha de Comando da Vite {#vite-cli}

Os comandos da Interface da Linha de Comando `$ vite dev` e `$ vite preview` também podem ser usados para as aplicações de Interpretação do Lado do Servidor. Nós podemos adicionar os nossos intermediários da Interpretação do Lado do Servidor ao servidor de desenvolvimento com [`configureServer`](/guide/api-plugin#configureserver) e ao servidor de pré-visualização com [`configurePreviewServer`](/guide/api-plugin#configurepreviewserver).

:::tip NOTA
Nós usamos uma função gatilho de publicação para que o nosso intermediário da Interpretação do Lado do Servidor execute _depois_ dos intermediários da Vite.
:::
