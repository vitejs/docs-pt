# API de JavaScript {#javascript-api}

As APIs de JavaScript da Vite são completamente tipadas, e é recomendado utilizar a TypeScript ou ativar a verificação de tipo de JavaScript no Visual Studio Code para influenciar o sensor inteligente e a validação.

## `createServer` {#createserver}

**Assinatura de Tipo:**

```ts
async function createServer(inlineConfig?: InlineConfig): Promise<ViteDevServer>
```

**Exemplo de Utilização:**

```ts
import { fileURLToPath } from 'node:url'
import { createServer } from 'vite'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

const server = await createServer({
  // quaisquer opções válidas de configuração do utilizador,
  // mais `mode` e `configFile`
  configFile: false,
  root: __dirname,
  server: {
    port: 1337,
  },
})
await server.listen()

server.printUrls()
server.bindCLIShortcuts({ print: true })
```

:::tip NOTA
Quando usamos `createServer` e `build` no mesmo processo da Node.js, ambas funções dependem da `process.env.NODE_ENV` para funcionarem corretamente, que também dependem da opção de configuração `mode`. Para evitar comportamento conflituosos, definimos `process.env.NODE_ENV` ou a `mode` das duas APIs como `development`. Caso contrário, é possível gerar um processo filho para executar as APIs separadamente.
:::

:::tip NOTA
Quando usamos o [modo intermediário](/config/server-options#server-middlewaremode) combinado com a [configuração da delegação para tomada da Web](/config/server-options#server-proxy), o servidor de HTTP pai deve ser fornecido em `middlewareMode` para ligar a delegação corretamente:

<details>
<summary>Exemplo</summary>

```ts
import http from 'http'
import { createServer } from 'vite'

const parentServer = http.createServer() // or express, koa, etc.

const vite = await createServer({
  server: {
    // Ativar o modo intermediário
    middlewareMode: {
      // Fornecer o servidor de HTTP pai para
      // tomada da Web (WebSocket)
      server: parentServer,
    },
    proxy: {
      '/ws': {
        target: 'ws://localhost:3000',
        // Delegando a tomada da Web
        ws: true,
      },
    },
  },
})

// @noErrors: 2339
parentServer.use(vite.middlewares)
```

</details>

:::

## `InlineConfig` {#inlineconfig}

A interface `InlineConfig` estende o `UserConfig` com propriedades adicionais:

- `configFile`: especifica o ficheiro de configuração à utilizar. Se não for definido, a Vite tentará automaticamente resolver aquele a partir da raiz do projeto. Defina para `false` para desativar a resolução automática.
- `envFile`: defina para `false` para desativar os ficheiros `.env`.

## `ResolvedConfig` {#resolvedconfig}

A interface `ResolvedConfig` tem todas as mesmas propriedade de uma `UserConfig`, exceto que a maioria das propriedades são resolvidas e não definidas. Ela também contém serviços como:

- `config.assetsInclude`: Uma função para verificar se um `id` é considerado um recurso.
- `config.logger`: O objeto do registador interno da Vite.

## `ViteDevServer` {#vitedevserver}

```ts
interface ViteDevServer {
  /**
   * The resolved Vite config object.
   */
  config: ResolvedConfig
  /**
   * A connect app instance
   * - Can be used to attach custom middlewares to the dev server.
   * - Can also be used as the handler function of a custom http server
   *   or as a middleware in any connect-style Node.js frameworks.
   *
   * https://github.com/senchalabs/connect#use-middleware
   */
  middlewares: Connect.Server
  /**
   * Native Node http server instance.
   * Will be null in middleware mode.
   */
  httpServer: http.Server | null
  /**
   * Chokidar watcher instance. If `config.server.watch` is set to `null`,
   * it will not watch any files and calling `add` will have no effect.
   * https://github.com/paulmillr/chokidar#getting-started
   */
  watcher: FSWatcher
  /**
   * Web socket server with `send(payload)` method.
   */
  ws: WebSocketServer
  /**
   * Rollup plugin container that can run plugin hooks on a given file.
   */
  pluginContainer: PluginContainer
  /**
   * Module graph that tracks the import relationships, url to file mapping
   * and hmr state.
   */
  moduleGraph: ModuleGraph
  /**
   * The resolved urls Vite prints on the CLI (URL-encoded). Returns `null`
   * in middleware mode or if the server is not listening on any port.
   */
  resolvedUrls: ResolvedServerUrls | null
  /**
   * Programmatically resolve, load and transform a URL and get the result
   * without going through the http request pipeline.
   */
  transformRequest(
    url: string,
    options?: TransformOptions,
  ): Promise<TransformResult | null>
  /**
   * Apply Vite built-in HTML transforms and any plugin HTML transforms.
   */
  transformIndexHtml(
    url: string,
    html: string,
    originalUrl?: string,
  ): Promise<string>
  /**
   * Load a given URL as an instantiated module for SSR.
   */
  ssrLoadModule(
    url: string,
    options?: { fixStacktrace?: boolean },
  ): Promise<Record<string, any>>
  /**
   * Fix ssr error stacktrace.
   */
  ssrFixStacktrace(e: Error): void
  /**
   * Triggers HMR for a module in the module graph. You can use the `server.moduleGraph`
   * API to retrieve the module to be reloaded. If `hmr` is false, this is a no-op.
   */
  reloadModule(module: ModuleNode): Promise<void>
  /**
   * Start the server.
   */
  listen(port?: number, isRestart?: boolean): Promise<ViteDevServer>
  /**
   * Restart the server.
   *
   * @param forceOptimize - force the optimizer to re-bundle, same as --force cli flag
   */
  restart(forceOptimize?: boolean): Promise<void>
  /**
   * Stop the server.
   */
  close(): Promise<void>
  /**
   * Bind CLI shortcuts
   */
  bindCLIShortcuts(options?: BindCLIShortcutsOptions<ViteDevServer>): void
  /**
   * Calling `await server.waitForRequestsIdle(id)` will wait until all static imports
   * are processed. If called from a load or transform plugin hook, the id needs to be
   * passed as a parameter to avoid deadlocks. Calling this function after the first
   * static imports section of the module graph has been processed will resolve immediately.
   * @experimental
   */
  waitForRequestsIdle: (ignoredId?: string) => Promise<void>
}
```

:::info INFORMAÇÃO
`waitForRequestsIdle` is meant to be used as a escape hatch to improve DX for features that can't be implemented following the on-demand nature of the Vite dev server. It can be used during startup by tools like Tailwind to delay generating the app CSS classes until the app code has been seen, avoiding flashes of style changes. When this function is used in a load or transform hook, and the default HTTP1 server is used, one of the six http channels will be blocked until the server processes all static imports. Vite's dependency optimizer currently uses this function to avoid full-page reloads on missing dependencies by delaying loading of pre-bundled dependencies until all imported dependencies have been collected from static imported sources. Vite may switch to a different strategy in a future major release, setting `optimizeDeps.crawlUntilStaticImports: false` by default to avoid the performance hit in large applications during cold start.
:::

## `build` {#build}

**Assinatura de Tipo:**

```ts
async function build(
  inlineConfig?: InlineConfig,
): Promise<RollupOutput | RollupOutput[]>
```

**Exemplo de Utilização:**

```ts twoslash [vite.config.js]
// @errors: 2307
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { build } from 'vite'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

await build({
  root: path.resolve(__dirname, './project'),
  base: '/foo/',
  build: {
    rollupOptions: {
      // ...
    },
  },
})
```

## `preview` {#preview}

**Assinatura de Tipo:**

```ts
async function preview(inlineConfig?: InlineConfig): Promise<PreviewServer>
```

**Exemplo de Utilização:**

```ts twoslash
// @errors: 2307
import { preview } from 'vite'

const previewServer = await preview({
  // quaisquer opções de configuração válidas do utilizador,
  // mais `mode` e `configFile`
  preview: {
    port: 8080,
    open: true,
  },
})

previewServer.printUrls()
previewServer.bindCLIShortcuts({ print: true })
```

## `PreviewServer` {#previewserver}

```ts
interface PreviewServer {
  /**
   * The resolved vite config object
   */
  config: ResolvedConfig
  /**
   * A connect app instance.
   * - Can be used to attach custom middlewares to the preview server.
   * - Can also be used as the handler function of a custom http server
   *   or as a middleware in any connect-style Node.js frameworks
   *
   * https://github.com/senchalabs/connect#use-middleware
   */
  middlewares: Connect.Server
  /**
   * native Node http server instance
   */
  httpServer: http.Server
  /**
   * The resolved urls Vite prints on the CLI (URL-encoded). Returns `null`
   * if the server is not listening on any port.
   */
  resolvedUrls: ResolvedServerUrls | null
  /**
   * Print server urls
   */
  printUrls(): void
  /**
   * Bind CLI shortcuts
   */
  bindCLIShortcuts(options?: BindCLIShortcutsOptions<PreviewServer>): void
}
```

## `resolveConfig` {#resolveconfig}

**Assinatura de Tipo:**

```ts
async function resolveConfig(
  inlineConfig: InlineConfig,
  command: 'build' | 'serve',
  defaultMode = 'development',
  defaultNodeEnv = 'development',
  isPreview = false,
): Promise<ResolvedConfig>
```

O valor de `command` é `serve` em desenvolvimento e pré-visualização, e `build` em construção.

## `mergeConfig` {#mergeconfig}

**Assinatura de Tipo:**

```ts
function mergeConfig(
  defaults: Record<string, any>,
  overrides: Record<string, any>,
  isRoot = true,
): Record<string, any>
```

Combina profundamente duas configurações de Vite. `isRoot` representa o nível dentro da configuração de Vite que está sendo combinada. Por exemplo, defina para `false` se estiveres combinando duas opções de `build`.

:::tip NOTA
`mergeConfig` aceita apenas configuração na forma de objeto. Se tiveres uma configuração na forma de função de resposta, deves chamá-la antes de passar para `mergeConfig`.

Tu podes usar a auxiliar `defineConfig` para combinar uma configuração na forma de função de resposta com uma outra configuração:

```ts
import {
  defineConfig,
  mergeConfig,
  type UserConfigFnObject,
  type UserConfig,
} from 'vite'
declare const configAsCallback: UserConfigFnObject
declare const configAsObject: UserConfig

// ---cut---
export default defineConfig((configEnv) =>
  mergeConfig(configAsCallback(configEnv), configAsObject),
)
```

:::

## `searchForWorkspaceRoot` {#searchforworkspaceroot}

**Assinatura de Tipo:**

```ts
function searchForWorkspaceRoot(
  current: string,
  root = searchForPackageRoot(current),
): string
```

**Relacionado ao:** [`server.fs.allow`](/config/server-options#server-fs-allow)

Procura pela raiz do potencial espaço de trabalho se cumprir as seguintes condições, caso contrário recuaria para o `root`:

- contém o campo `workspaces` no `package.json`
- contém um dos seguintes ficheiros
  - `lerna.json`
  - `pnpm-workspace.yaml`

## `loadEnv` {#loadenv}

**Assinatura de Tipo:**

```ts
function loadEnv(
  mode: string,
  envDir: string,
  prefixes: string | string[] = 'VITE_',
): Record<string, string>
```

**Relacionado ao:** [Ficheiros `.env`](./env-and-mode#env-files)

Carrega os ficheiros `.env` dentro de `envDir` por padrão, só as variáveis de ambiente prefixadas com a `VITE_` são carregadas, a menos que `prefixes` seja modificada.

## `normalizePath` {#normalizepath}

**Assinatura de Tipo:**

```ts
function normalizePath(id: string): string
```

**Relacionado ao:** [Normalização do Caminho](./api-plugin#path-normalization)

Normaliza um caminho para operar internamente entre as extensões de Vite.

## `transformWithEsbuild` {#transformwithesbuild}

**Assinatura de Tipo:**

```ts
async function transformWithEsbuild(
  code: string,
  filename: string,
  options?: EsbuildTransformOptions,
  inMap?: object,
): Promise<ESBuildTransformResult>
```

Transforma a JavaScript ou TypeScript com a `esbuild`. Útil para extensões que preferem harmonização com transformação da `esbuild` interna da Vite.

## `loadConfigFromFile` {#loadconfigfromfile}

**Assinatura de Tipo:**

```ts
async function loadConfigFromFile(
  configEnv: ConfigEnv,
  configFile?: string,
  configRoot: string = process.cwd(),
  logLevel?: LogLevel,
  customLogger?: Logger,
): Promise<{
  path: string
  config: UserConfig
  dependencies: string[]
} | null>
```

Carrega manualmente um ficheiro de configuração de Vite com a `esbuild`.

## `preprocessCSS` {#preprocesscss}

- **Experimental:** [Dar Opinião](https://github.com/vitejs/vite/discussions/13815)

**Assinatura do Tipo:**

```ts
async function preprocessCSS(
  code: string,
  filename: string,
  config: ResolvedConfig,
): Promise<PreprocessCSSResult>
interface PreprocessCSSResult {
  code: string
  map?: SourceMapInput
  modules?: Record<string, string>
  deps?: Set<string>
}
```

Pré-processa os ficheiros `.css`, `.scss`, `.sass`, `.less`, `.styl` e `.stylus` para CSS simples para poderem ser utilizados em navegadores ou analisados por outras ferramentas. Semelhante ao [suporte de pré-processamento de CSS embutido](/guide/features#css-pre-processors), o pré-processador correspondente deve ser instalado se usado.

O pré-processador utilizado é inferido a partir da extensão do `filename`. Se o `filename` terminar com `module.{ext}`, este é inferido como um [módulo de CSS](https://github.com/css-modules/css-modules) e o resultado retornado incluirá um objeto de `modules` mapeando os nomes originais das classes para os transformados.

Notemos que o pré-processamento não resolverá os endereços de localização de recurso em `url()` ou `image-set()`.
