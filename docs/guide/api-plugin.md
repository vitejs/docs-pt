# API de Extensão {#plugin-api}

As extensões de Vite estendem a bem desenha interface de extensão da Rollup com algumas opções adicionais específicas da Vite. Como resultado, podes escrever uma extensão de Vite uma vez e tê-la a funcionar para ambos desenvolvimento e construção.

**É recomendado passar primeiro pela [documentação de extensão da Rollup](https://rollupjs.org/plugin-development/) antes de ler as seções abaixo.**

## Produzindo uma Extensão {#authoring-a-plugin}

A Vite esforça-se em oferecer padrões estabelecidos fora da caixa, assim antes de criares uma nova extensão certifica-te de verificar o [Guia de Funcionalidades](/guide/features) para ver se a funcionalidade que pretendes adicionar já está implementada. Além disto revise as extensões disponíveis na comunidade, ambos na forma de uma [extensão compatível com a Rollup](https://github.com/rollup/awesome) e [extensões especificas para Vite](https://github.com/vitejs/awesome-vite#plugins).

Quando estiveres a criar uma extensão, podes incorporá-la no teu `vite.config.js`. Não existe necessidade de criar um novo pacote para isto. Uma vez que veres que uma extensão foi útil nos teus projetos, considere partilhá-la para ajudar os outros [no ecossistema](https://chat.vitejs.dev).

:::tip Dica
Quando estiveres a aprender, depurar, ou escrever extensões, sugerimos incluir a [vite-plugin-inspect](https://github.com/antfu/vite-plugin-inspect) no teu projeto. Isto permite-te inspecionar o estado intermediário de extensões de Vite. Depois da instalação, podes visitar `localhost:5173/__inspect/` para inspecionar as pilhas de módulos e transformação do teu projeto. Consulte instruções de instalação na [documentação da vite-plugin-inspect](https://github.com/antfu/vite-plugin-inspect).
![vite-plugin-inspect](/images/vite-plugin-inspect.png)
:::

## Convenções {#conventions}

Se a extensão não usar gatilhos específicos da Vite e pode ser implementada como uma [extensão compatível com a Rollup](#rollup-plugin-compatibility), então é recomendado usar as [convenções de nomeação de extensão da Rollup](https://rollupjs.org/plugin-development/#conventions).

- As extensões de Rollup devem ter um nome claro com o prefixo `rollup-plugin-`.
- Incluir as palavras-chaves `rollup-plugin` e `vite-plugin` no `package.json`.

Isto expõe a extensão para ser também usada em projetos puros baseados na Rollup ou WMR

Para extensões apenas de Vite

- As extensões de Vite devem ter um nome claro com o prefixo `vite-plugin-`.
- Incluir a palavra-chave `vite-plugin` no `package.json`.
- Incluir uma seção na documentação da extensão detalhando o porquê que ela apenas uma extensão de Vite (por exemplo, ela usa gatilhos de extensão específico de Vite).

Se a tua extensão apenas funcionará para uma abstração em particular, o nome da abstração de ser incluído como parte do prefixo.

- O prefixo `vite-plugin-vue-` para Extensões de Vue
- O prefixo `vite-plugin-react-` para Extensões de React
- O prefixo `vite-plugin-svelte-` para Extensões de Svelte

Consulte também a [Convenção de Módulos Virtuais](#virtual-modules-convention).

## Configuração de Extensões {#plugins-config}

Os utilizadores adicionarão as extensões ao `devDependencies` projeto e configurá-los com o uso de o arranjo de opções `plugins`.

```js
// vite.config.js
import vitePlugin from 'vite-plugin-feature'
import rollupPlugin from 'rollup-plugin-feature'

export default defineConfig({
  plugins: [vitePlugin(), rollupPlugin()]
})
```

As extensões que retornam falso serão ignoradas, o que pode ser usado para ativar ou desativar facilmente as extensões.

O `plugins` também aceita programas incluindo várias extensões como um único elemento. Isto é útil para funcionalidades complexas (como integração de abstração) que são implementados com uso de várias extensões. O arranjo será aplanada para uma dimensão internamente.

```js
// framework-plugin
import frameworkRefresh from 'vite-plugin-framework-refresh'
import frameworkDevtools from 'vite-plugin-framework-devtools'

export default function framework(config) {
  return [frameworkRefresh(config), frameworkDevTools(config)]
}
```

```js
// vite.config.js
import { defineConfig } from 'vite'
import framework from 'vite-plugin-framework'

export default defineConfig({
  plugins: [framework()]
})
```

## Exemplos Simples {#simple-examples}

:::tip Dica
É convenção comum para escrever uma extensão Vite/Rollup como uma função de fabricação que retorna o objeto da extensão verdadeira. A função pode aceitar as opções que permitem os utilizadores personalizar o comportamento da extensão.
:::

### Transformação Personalizada de Tipos de Ficheiro {#transforming-custom-file-types}

```js
const fileRegex = /\.(my-file-ext)$/

export default function myPlugin() {
  return {
    name: 'transform-file',

    transform(src, id) {
      if (fileRegex.test(id)) {
        return {
          code: compileFileToJS(src),
          map: null // fornece o mapa do código-fonte se disponível
        }
      }
    }
  }
}
```

### Importação de um Ficheiro Virtual {#importing-a-virtual-file}

Consulte o exemplo na [próxima seção](#virtual-modules-convention).

## Convenção de Módulos Virtuais {#virtual-modules-convention}

Os módulos virtuais são um esquema útil que permitem-te passar a informação em tempo de execução para os ficheiros de código-fonte com uso da sintaxe normal de importação de Módulo de ECMAScript.

```js
export default function myPlugin() {
  const virtualModuleId = 'virtual:my-module'
  const resolvedVirtualModuleId = '\0' + virtualModuleId

  return {
    name: 'my-plugin', // obrigatório, aparecerá nos avisos e erros
    resolveId(id) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId
      }
    },
    load(id) {
      if (id === resolvedVirtualModuleId) {
        return `export const msg = "from virtual module"`
      }
    }
  }
}
```

O que permite a importação de módulo em JavaScript:

```js
import { msg } from 'virtual:my-module'

console.log(msg)
```

Os módulos virtuais na Vite (e Rollup) são prefixados com `virtual:` para o caminho de reconhecimento do utilizador por convenção. Se possível o nome da extensão deve ser usada como um nome de espaço reservado para evitar colisões com outras extensões no ecossistema. Por exemplo, uma `vite-plugin-posts` poderia pedir que os utilizadores importem um `virtual:posts` ou ous módulos virtuais `virtual:posts/helpers` para receber informação em tempo de execução. Internamente, as extensões que usam os módulos virtuais devem prefixar o identificador do módulo com `\0` enquanto resolve o identificador, uma convenção a partir do ecossistema de rollup. Isto evita que outras extensões de tentar processar o identificador (como a resolução de nó), e funcionalidades do núcleo tais como o mapas de código-fonte que podem usar esta informação para diferenciar módulos virtuais dos ficheiros regulares. `\0` não é um carácter permitido em URLs de importação então temos que substituí-los durante as analises de importação. Um identificador virtual `\0{id}` acaba codificada como `/@id/__x00__{id}` durante o desenvolvimento no navegador. O identificador será descodificado de volta antes de entrar na conduta de extensões, assim isto não é visto pelo código dos gatilhos das extensões.

Nota que os módulos diretamente derivados de um ficheiro real, como no caso de um módulo de programa (`script` em Inglês) em um Componente de Ficheiro Único (como um `.vue` ou `.svelte`) não precisa seguir esta convenção. Os Componentes de Ficheiros Únicos geralmente geram um conjunto de sub-módulos quando processados mas o código nestes podem ser mapeados de volta para sistema de ficheiro. Usar `\0` para estes sub-módulos preveniria os mapas de código-fonte de funcionarem corretamente.

## Gatilhos Universais {#universal-hooks}

Durante o desenvolvimento, o servidor de desenvolvimento da Vite cria um contentor de extensão que invocam os [Gatilhos da Construção de Rollup](https://rollupjs.org/plugin-development/#build-hooks) da mesma maneira que a Rollup faz.

Os seguintes gatilhos são chamados um vez sobre a inicialização do servidor:

- [`options`](https://rollupjs.org/plugin-development/#options)
- [`buildStart`](https://rollupjs.org/plugin-development/#buildstart)

Os seguintes gatilhos são chamados em cada requisição de módulo externa:

- [`resolveId`](https://rollupjs.org/plugin-development/#resolveid)
- [`load`](https://rollupjs.org/plugin-development/#load)
- [`transform`](https://rollupjs.org/plugin-development/#transform)

Os seguintes gatilhos são chamados quando o servidor é fechado:

- [`buildEnd`](https://rollupjs.org/plugin-development/#buildend)
- [`closeBundle`](https://rollupjs.org/plugin-development/#closebundle)

Nota que o gatilho [`moduleParsed`](https://rollupjs.org/plugin-development/#moduleparsed) **não** é chamado durante o desenvolvimento, porque a Vite evita completamente as analises de AST para obter melhor desempenho.

Os [Gatilhos da Geração da Saída](https://rollupjs.org/plugin-development/#output-generation-hooks) (exceto `closeBundle`) **não** são chamadas durante o desenvolvimento, Tu podes pensar do servidor de desenvolvimento da Vite como apenas chamando o `rollup.rollup()` sem chamar o `bundle.generate()`.

## Gatilhos Específicos de Vite {#vite-specific-hooks}

As extensões de Vite também podem fornecer gatilhos que servem aos propósitos específicos da Vite. Estes gatilhos são ignorados pela Rollup.

### `config`

- **Tipo:** `(config: UserConfig, env: { mode: string, command: string }) => UserConfig | null | void`
- **Natureza:** `async`, `sequential`

  Modifica a configuração da Vite antes dela ser resolvida. O gatilho recebe a configuração crua do utilizador (opções da Interface da Linha de Comando combinados com o ficheiro de configuração) e o atual ambiente de configuração que expõe o `mode` e `command` a ser usado. Isto pode retornar um objeto de configuração parcial que será profundamente combinada com a configuração existente, ou mudar diretamente a configuração (se a combinação padrão não poder alcançar o resultado desejado).

  **Exemplo:**

  ```js
  // retornar a configuração parcial (recomendado)
  const partialConfigPlugin = () => ({
    name: 'return-partial',
    config: () => ({
      resolve: {
        alias: {
          foo: 'bar'
        }
      }
    })
  })

  // mudar a configuração diretamente (usar apenas quando a combinação não funcionar)
  const mutateConfigPlugin = () => ({
    name: 'mutate-config',
    config(config, { command }) {
      if (command === 'build') {
        config.root = 'foo'
      }
    }
  })
  ```

  :::warning Nota
  As extensões do utilizador são resolvidas antes da execução deste gatilho então injetar outras extensões dentro do gatilho `config` não surtirá efeito.
  :::

### `configResolved`

- **Tipo:** `(config: ResolvedConfig) => void | Promise<void>`
- **Natureza:** `async`, `parallel`

  Chamado depois a configuração da Vite ser resolvida. Use este gatilho para ler e armazenar o resultado da configuração resolvida. Ele também útil quando a extensão precisar fazer alguma coisa diferente baseada no comando a ser executado.

  **Exemplo:**

  ```js
  const examplePlugin = () => {
    let config

    return {
      name: 'read-config',

      configResolved(resolvedConfig) {
        // armazenar a configuração resolvida
        config = resolvedConfig
      },

      // usar a configuração armazenada em outros gatilhos
      transform(code, id) {
        if (config.command === 'serve') {
          // dev: extensão invocada pelo servidor de desenvolvimento
        } else {
          // build: extensão invocada pela Rollup
        }
      }
    }
  }
  ```

  Nota que o valor do `command` é `serve` no desenvolvimento (na interface da linha de comando `vite`, `vite dev`, e `vite serve` são pseudónimos).

### `configureServer`

- **Tipo:** `(server: ViteDevServer) => (() => void) | void | Promise<(() => void) | void>`
- **Natureza:** `async`, `sequential`
- **Consultar também:** [ViteDevServer](./api-javascript#vitedevserver)

  Gatilho para configurar o servidor de desenvolvimento. O caso mais comum é adicionar intermediários personalizados para a aplicação [connect](https://github.com/senchalabs/connect) interno:

  ```js
  const myPlugin = () => ({
    name: 'configure-server',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        // manipulador de requisição personalizado...
      })
    }
  })
  ```

  **Injetar o Intermediário de Correio**

  O gatilho `configureServer` é chamado antes dos intermediários internos serem instalados, assim os intermediários personalizados executarão antes dos intermediários internos por padrão. Se quiseres injetar um intermediário **depois** dos intermediários internos, podes retornar uma função de `configureServer`, que será chamado depois dos intermediários internos serem instalados:

  ```js
  const myPlugin = () => ({
    name: 'configure-server',
    configureServer(server) {
      /*
        retornar um gatilho de publicação que é chamado depois dos
        intermediários internos serem instalados
      */
      return () => {
        server.middlewares.use((req, res, next) => {
          // manipulador da requisição personalizado...
        })
      }
    }
  })
  ```

  **Armazenar o Acesso ao Servidor**

  Nestes casos, outros gatilhos de extensão podem precisar do acesso à instância do servidor de desenvolvimento (por exemplo, acessar o servidor de tomada de web ou (web socket server, em Inglês), o observador do sistema de ficheiro, ou o grafo de módulo). Este gatilho também pode ser usado para armazenar a instância do servidor para acesso em outros gatilhos:

  ```js
  const myPlugin = () => {
    let server
    return {
      name: 'configure-server',
      configureServer(_server) {
        server = _server
      },
      transform(code, id) {
        if (server) {
          // usar o servidor...
        }
      }
    }
  }
  ```

  Nota que `configureServer` não é chamado quando estiveres a executar a construção de produção assim os outros dos teus gatilhos precisaram proteger-se contra a sua ausência.

### `configurePreviewServer`

- **Tipo:** `(server: { middlewares: Connect.Server, httpServer: http.Server }) => (() => void) | void | Promise<(() => void) | void>`
- **Natureza:** `async`, `sequential`

  O mesmo que [`configureServer`](/guide/api-plugin.html#configureserver) porém para o servidor de pré-visualização. Ele fornece o servidor [connect](https://github.com/senchalabs/connect) e o [servidor de http](https://nodejs.org/api/http.html) subjacente. Similarmente ao `configureServer`, o gatilho `configurePreviewServer` é chamado antes dos outros intermediários serem instalados. Se quiseres injetar um intermediário **depois** dos outros intermediários, podes retornar uma função de `configurePreviewServer`, que será chamado depois dos intermediários internos serem instalados:

  ```js
  const myPlugin = () => ({
    name: 'configure-preview-server',
    configurePreviewServer(server) {
      /*
        retornar um gatilho de publicação que é chamado depois dos
        outros intermediários internos serem instalados
      */
      return () => {
        server.middlewares.use((req, res, next) => {
          // manipulador da requisição personalizado...
        })
      }
    }
  })
  ```

### `transformIndexHtml`

- **Tipo:** `IndexHtmlTransformHook | { order?: 'pre' | 'post', handler: IndexHtmlTransformHook }`
- **Natureza:** `async`, `sequential`

  Gatilho dedicado para transformação dos ficheiros de ponto de entrada de HTML tais como `index.html`. O gatilho recebe a sequência de caracteres de HTML atual e um contexto de transformação. O contexto expõe a instância [`ViteDevServer`](./api-javascript#vitedevserver) durante o desenvolvimento, e expõe o pacote de saída da Rollup durante a construção.

  O gatilho pode ser assíncronos e podem retornar um dos seguintes:

  - Sequência de caracteres de HTML transformado
  - Um arranjo de objetos descritores de marcador (`{ tag, attrs, children }`) para injetar para o HTML existente. Cada marcador também pode especificar onde ele deve ser injetado (o padrão é anexar no inicio do `<head>`)
  - Um objeto contendo ambos como `{ html, tags }`

  **Exemplo Básico:**

  ```js
  const htmlPlugin = () => {
    return {
      name: 'html-transform',
      transformIndexHtml(html) {
        return html.replace(
          /<title>(.*?)<\/title>/,
          `<title>Title replaced!</title>`
        )
      }
    }
  }
  ```

  **Assinatura Completa do Gatilho:**

  ```ts
  type IndexHtmlTransformHook = (
    html: string,
    ctx: {
      path: string
      filename: string
      server?: ViteDevServer
      bundle?: import('rollup').OutputBundle
      chunk?: import('rollup').OutputChunk
    }
  ) =>
    | IndexHtmlTransformResult
    | void
    | Promise<IndexHtmlTransformResult | void>

  type IndexHtmlTransformResult =
    | string
    | HtmlTagDescriptor[]
    | {
        html: string
        tags: HtmlTagDescriptor[]
      }

  interface HtmlTagDescriptor {
    tag: string
    attrs?: Record<string, string | boolean>
    children?: string | HtmlTagDescriptor[]
    /**
     * default: 'head-prepend'
     */
    injectTo?: 'head' | 'body' | 'head-prepend' | 'body-prepend'
  }
  ```

### `handleHotUpdate`

- **Tipo:** `(ctx: HmrContext) => Array<ModuleNode> | void | Promise<Array<ModuleNode> | void>`

  Realizar a manipulação da atualização instantânea ou (HMR, sigla em Inglês) personalizada. O gatilho recebe o objeto de contexto com o seguinte assinatura:

  ```ts
  interface HmrContext {
    file: string
    timestamp: number
    modules: Array<ModuleNode>
    read: () => string | Promise<string>
    server: ViteDevServer
  }
  ```

  - `modules` é um arranjo de módulos que são afetados pelo ficheiro modificado. É um arranjo uma vez que um único ficheiro pode mapear para vários módulos servidos (por exemplo, Componentes de Ficheiro Único de Vue).

  - `read` é uma função de leitura assíncrona que retorna o conteúdo do ficheiro. Isto é fornecido uma vez que em alguns sistemas, a função de resposta a mudança do ficheiro pode disparar muito rápido antes do editor terminar de atualizar o ficheiro e direcionar o `fs.readFile` retornará conteúdo vazio. A função de leitura passada normaliza este comportamento.

  O gatilho pode escolher:

  - Filtrar e reduzir a lista de módulo afetado para a atualização de módulo instantânea ou (HMR, sigla em Inglês) ser mais precisa.

  - Retornar um arranjo vazio e realizar a manipulação completa da atualização de módulo instantânea personalizada enviando eventos personalizados para o cliente:

    ```js
    handleHotUpdate({ server }) {
      server.ws.send({
        type: 'custom',
        event: 'special-update',
        data: {}
      })
      return []
    }
    ```

    O código do cliente deve registar o manipulador correspondente usando a [API HMR](./api-hmr) (isto poderia ser injetado pelo mesmo gatilho `transform` da extensão):

    ```js
    if (import.meta.hot) {
      import.meta.hot.on('special-update', (data) => {
        // realizar a atualização personalizada
      })
    }
    ```

## Ordenamento da Extensão {#plugin-ordering}

A extensão da Vite podem adicionalmente especificar uma propriedade `enforce` (similar aos dos carregadores de webpack) para ajustar a ordem da sua aplicação. O valor de `enforce` pode ser ou `"pre"` ou `"post"`. As extensões resolvidas estarão na seguinte ordem:

- Pseudónimos
- Extensões do utilizador com `enforce: 'pre'`
- Extensões do núcleo da Vite
- Extensões do utilizador sem o valor de `enforce`
- Extensões de construção da Vite
- Extensões do utilizador com `enforce: 'post'`
- Extensões de construção da publicação de Vite (minificar, manifestar, reportagem)

## Aplicação Condicional {#application-conditional}

Por padrão as extensões são invocadas para ambos servir e construir. Nestes casos onde uma extensão precisa ser condicionalmente aplicada apenas durante o servir ou construir, use a propriedade `apply` para apenas invocá-los durante o `'build'` ou `'serve'`:

```js
function myPlugin() {
  return {
    name: 'build-only',
    apply: 'build' // ou 'serve'
  }
}
```

Uma função também pode ser usada para conseguir um controle mais preciso:

```js
apply(config, { command }) {
  // aplicar apenas na construção mas não para SSR
  return command === 'build' && !config.build.ssr
}
```

## Compatibilidade de Extensão de Rollup {#rollup-plugin-compatibility}

Um número considerável de extensões da Rollup funcionará diretamente como uma extensão de Vite (por exemplo, `@rollup/plugin-alias` ou `@rollup/plugin-json`), mas não todas elas, já que alguns gatilhos de extensão não fazem sentido em um contexto de servidor de desenvolvimento desempacotado.

Em geral, enquanto uma extensão de Rollup cumprir os seguintes critérios então ela deve apenas funcionar como uma extensão de Vite:

- Ela não usa o gatilho [`moduleParsed`](https://rollupjs.org/guide/en/#moduleparsed).
- Ela não tem forte acoplamento entre gatilhos da fase de empacotamento e fase de saída.

Se a extensão de Rollup apenas fazer sentido para a fase de construção, então ela pode ser especificada sob `build.rollupOptions.plugins`. Ela funcionará da mesma maneira que uma extensão de Vite com `enforce: 'post'` e `apply: 'build'`.

Tu também podes aumentar uma extensão de Rollup existente com as propriedades exclusivas de Vite:

```js
// vite.config.js
import example from 'rollup-plugin-example'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    {
      ...example(),
      enforce: 'post',
      apply: 'build'
    }
  ]
})
```

Consulte as [Extensões de Rollup de Vite](https://vite-rollup-plugins.patak.dev) para teres acesso a uma lista de extensões de Rollup oficial compatíveis com instruções de uso.

## Normalização do Caminho {#path-normalization}

A Vite normaliza caminhos enquanto resolve os identificadores para usar os separadores POSIX ( / ) enquanto preserva o volume no Windows. Por outro lado, a Rollup preserva os caminhos resolvidos intocáveis por padrão, assim os identificadores resolvidos têm separadores de Win32 ( \\ ) no Windows. No entanto, as extensões de Rollup usam uma [função utilitária `normalizePath`](https://github.com/rollup/plugins/tree/master/packages/pluginutils#normalizepath) de `@rollup/pluginutils` internamente, que converte os separadores para POSIX antes da realização de comparações. Isto significa que quando estas extensões são usadas na Vite, no padrão de configuração `include` e `exclude` e outros caminhos similares contra comparações de identificadores resolvidos funcionam corretamente.

Então, para extensões de Vite, quando estiveres a comparar os caminhos contra dos identificadores resolvidos é importante primeiro normalizar os caminhos para usarem separadores POSIX. Uma função utilitária `normalizePath` equivalente é exposta a partir do módulo `vite`.

```js
import { normalizePath } from 'vite'

normalizePath('foo\\bar') // 'foo/bar'
normalizePath('foo/bar') // 'foo/bar'
```

## Filtragem, padrão `include`/`exclude` {#filtering-include-exclude-pattern}

A Vite expõe a função [`createFilter` do `@rollup/pluginutils`](https://github.com/rollup/plugins/tree/master/packages/pluginutils#createfilter) para encorajar extensões específicas de Vite e integrações a usar o padrão de filtragem `include`/`exclude` padrão, que também é usado no próprio núcleo da Vite.

## Comunicação Cliente-Servidor {#client-server-communication}

Desde a Vite 2.9, fornecemos alguns utilitários para extensões para ajudar a manipular a comunicação com os clientes.

### Servidor ao Cliente {#server-to-client}

No lado da extensão, poderíamos usar o `server.ws.send` para difundir os eventos para todos os clientes:

```js
// vite.config.js
export default defineConfig({
  plugins: [
    {
      // ...
      configureServer(server) {
        server.ws.send('my:greetings', { msg: 'hello' })
      }
    }
  ]
})
```

:::tip NOTA
Nós recomendação **sempre prefixar** os nomes do teu evento para evitar colisões com outras extensões.
:::

No lado do cliente, use o [`hot.on`](/guide/api-hmr.html#hot-on-event-cb) para ouvir os eventos:

```ts
// lado do cliente
if (import.meta.hot) {
  import.meta.hot.on('my:greetings', (data) => {
    console.log(data.msg) // hello
  })
}
```

### Cliente ao Servidor {#client-to-server}

Para enviar os eventos do cliente para o servidor, podemos usar o [`hot.send`](/guide/api-hmr.html#hot-send-event-payload):

```ts
// lado do cliente
if (import.meta.hot) {
  import.meta.hot.send('my:from-client', { msg: 'Hey!' })
}
```

Depois use `server.ws.on` e oiça os eventos no lado do servidor:

```js
// vite.config.js
export default defineConfig({
  plugins: [
    {
      // ...
      configureServer(server) {
        server.ws.on('my:from-client', (data, client) => {
          console.log('Message from client:', data.msg) // Hey!
          // responder apenas ao cliente (se necessário)
          client.send('my:ack', { msg: 'Hi! I got your message!' })
        })
      }
    }
  ]
})
```

### TypeScript para Eventos Personalizados {#typescript-for-custom-events}

É possível para atribuir tipos aos eventos personalizados estendendo a interface `CustomEventMap`:

```ts
// events.d.ts
import 'vite/types/customEvent'

declare module 'vite/types/customEvent' {
  interface CustomEventMap {
    'custom:foo': { msg: string }
    // 'event-key': payload
  }
}
```
