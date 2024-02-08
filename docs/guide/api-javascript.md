# API de JavaScript {#javascript-api}

As APIs de JavaScript da Vite são completamente tipadas, e é recomendado utilizar a TypeScript ou ativar a verificação de tipo de JavaScript no Visual Studio Code para influenciar o sensor inteligente e a validação.

## `createServer` {#createserver}

**Assinatura de Tipo:**

```ts
async function createServer(inlineConfig?: InlineConfig): Promise<ViteDevServer>
```

**Exemplo de Utilização:**

```js
import { fileURLToPath } from 'url'
import { createServer } from 'vite'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

;(async () => {
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
})()
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
  },
  proxy: {
    '/ws': {
      target: 'ws://localhost:3000',
      // Delegando a tomada da Web
      ws: true,
    },
  },
})

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
   * O objeto de configuração da Vite resolvido.
   */
  config: ResolvedConfig
  /**
   * A connect app instance Uma instância da aplicação de conexão
   * - Pode ser utilizada para atribuir intermediários personalizados ao
   *   servidor de desenvolvimento.
   * - Também pode ser utilizado como função manipuladora de um servidor
   *   de http personalizado ou como um intermediário em quaisquer abstrações
   *   de estilo de conexão da Node.js.
   *
   * https://github.com/senchalabs/connect#use-middleware
   */
  middlewares: Connect.Server
  /**
   * Instância do servidor de http da Node.js Nativa
   * Será "null" no modo do intermediário.
   */
  httpServer: http.Server | null
  /**
   * Instância do observador do Chokidar.
   * Se `config.server.watch` for definida para `null`,
   * retorna um emissor de evento noop
   * https://github.com/paulmillr/chokidar#api
   */
  watcher: FSWatcher
  /**
   * Servidor de WebSocket com o método `send(payload)`.
   */
  ws: WebSocketServer
  /**
   * Contentor da extensão da Rollup que pode executar gatilhos da
   * extensão em um dado ficheiro.
   */
  pluginContainer: PluginContainer
  /**
   * Gráfico do módulo que rastreia as relacionamentos de importação,
   * URL para o mapeamento de ficheiro e o estado da HMR.
   */
  moduleGraph: ModuleGraph
  /**
   * As URLs resolvidas que a Vite imprime na Linha de Comando.
   * "null" no modo de intermediário ou antes de `server.listen` ser chamada.
   */
  resolvedUrls: ResolvedServerUrls | null
  /**
   * Resolve, carrega e transforma programaticamente uma URL e
   * obtém o resultado sem ir através de uma conduta de requisição de http.
   */
  transformRequest(
    url: string,
    options?: TransformOptions,
  ): Promise<TransformResult | null>
  /**
   * Aplica as transformações de HTML embutida de Vite e
   * quaisquer transformações de HTML de extensão.
   */
  transformIndexHtml(
    url: string,
    html: string,
    originalUrl?: string,
  ): Promise<string>
  /**
   * Carrega uma dada URL como um módulo instanciado para SSR.
   */
  ssrLoadModule(
    url: string,
    options?: { fixStacktrace?: boolean },
  ): Promise<Record<string, any>>
  /**
   * Corrige o erro de "stacktrace" da ssr.
   */
  ssrFixStacktrace(e: Error): void
  /**
   * Aciona a substituição de módulo instantânea no
   * gráfico de módulo. Nós podemos usar a API
   * `server.moduleGraph` para recuperar o módulo
   * a ser recarregado. Se `hmr` for falso,
   * trata-se duma operação nula.
  */
  reloadModule(module: ModuleNode): Promise<void>
  /**
   * Inicia o servidor.
   */
  listen(port?: number, isRestart?: boolean): Promise<ViteDevServer>
  /**
   * Reinicia o servidor.
   *
   * @param forceOptimize - força o otimizador à reempacotar,
   * o mesmo a opção --force da linha de comando.
   */
  restart(forceOptimize?: boolean): Promise<void>
  /**
   * Terminar o servidor.
   */
  close(): Promise<void>
  /**
   * Vincular os atalhos da interface da linha de comando
  */
  bindCLIShortcuts(options?: BindCLIShortcutsOptions<ViteDevServer>): void
}
```

## `build` {#build}

**Assinatura de Tipo:**

```ts
async function build(
  inlineConfig?: InlineConfig,
): Promise<RollupOutput | RollupOutput[]>
```

**Exemplo de Utilização:**

```js
import path from 'path'
import { fileURLToPath } from 'url'
import { build } from 'vite'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

;(async () => {
  await build({
    root: path.resolve(__dirname, './project'),
    base: '/foo/',
    build: {
      rollupOptions: {
        // ...
      },
    },
  })
})()
```

## `preview` {#preview}

**Assinatura de Tipo:**

```ts
async function preview(inlineConfig?: InlineConfig): Promise<PreviewServer>
```

**Exemplo de Utilização:**

```js
import { preview } from 'vite'
;(async () => {
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
})()
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
   * The resolved urls Vite prints on the CLI.
   * null before server is listening.
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
): Promise<{
  path: string
  config: UserConfig
  dependencies: string[]
} | null>
```

Carrega manualmente um ficheiro de configuração de Vite com a `esbuild`.
