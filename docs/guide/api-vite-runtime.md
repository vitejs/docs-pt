# API de Execução da Vite {#vite-runtime-api}

:::warning API de Baixo Nível
Esta API foi introduzida na Vite 5.1 como uma funcionalidade experimental. Esta foi adicionada para [recolher comentários](https://github.com/vitejs/vite/discussions/15774). Provavelmente haverão mudanças significativas na Vite 5.2, então temos que certificar-nos de fixar a versão da Vite em `~5.1.0` quando a usámos. Esta é uma API de baixo nível destinada aos autores de bibliotecas e abstrações. Se o nosso objetivo é criar uma aplicação, devemos certificar-nos de consultar primeiro as extensões e ferramentas de alto nível da interpretação do lado do servidor na [seção da Interpretação do Lado do Servidor da Awesome Vite](https://github.com/vitejs/awesome-vite#ssr).
:::

A "Execução da Vite" é uma ferramenta que permite executar qualquer código, processando-o primeiro com as extensões da Vite. Esta é diferente de `server.ssrLoadModule` porque a implementação da execução é dissociada do servidor. Isto permite os autores de bibliotecas e abstrações implementarem sua própria camadas de comunicação entre o servidor e a execução.

Um dos objetivos desta funcionalidade é fornecer uma API personalizável para processar e executar o código. A Vite fornece ferramentas suficientes para usar a Execução da Vite fora da caixa, mas os utilizadores podem desenvolvê-lo se suas necessidades não corresponderem à implementação embutida da Vite.

Todas as APIs podem ser importadas de `vite/runtime` a menos que seja indicado o contrário.

## `ViteRuntime` {#viteruntime}

**Assinatura de Tipo:**

```ts
export class ViteRuntime {
  constructor(
    public options: ViteRuntimeOptions,
    public runner: ViteModuleRunner,
    private debug?: ViteRuntimeDebugger,
  ) {}
  /**
   * Localizador uniforme de recurso a executar. Aceita o caminho do ficheiro, caminho do servidor,
   * ou identificador relativo à raiz.
   */
  public async executeUrl<T = any>(url: string): Promise<T>
  /**
   * Localizador uniforme de recurso de ponto de entrada a executar. Aceita o caminho do ficheiro,
   * caminho do servidor ou identificador relativo à raiz. No caso duma recarga completa acionada
   * pela substituição de módulo instantânea, este é o módulo que será recarregado. Se este método
   * for chamado várias vezes, todos os pontos de entrada serão recarregados um de cada vez.
   */
  public async executeEntrypoint<T = any>(url: string): Promise<T>
  /**
   * Limpa todas as memórias, incluindo os ouvintes da substituição de módulo
   * instantânea.
   */
  public clearCache(): void
  /**
   * Limpa todas as memórias, remove todos ouvintes da substituição de módulo
   * instantânea, e redefine o suporte do mapa de código-fonte. Este método não
   * interrompe a conexão da substituição de módulo instantânea.
   */
  public async destroy(): Promise<void>
  /**
   * Retorna `true` se a execução foi destruída pela chamada do método `destroy()`.
   */
  public isDestroyed(): boolean
}
```

:::tip Uso Avançado
Se estivermos apenas migrando de `server.ssrLoadModule` e queremos suportar a substituição de módulo instantânea, precisamos considerar a [`createViteRuntime`](#createviteruntime).
:::

A classe `ViteRuntime` requer as opções `root` e `fetchModule` quando inicializada. A Vite expõe `ssrFetchModule` sobre a instância [`server`](/guide/api-javascript) para facilitar a integração com a interpretação do lado do servidor da Vite. A Vite também exporta `fetchModule` a partir do seu principal ponto de entrada - esta não faz nenhuma suposição sobre como o código está sendo executado, ao contrário de `ssrFetchModule` que espera que o código seja executado usando `new Function`. Isto pode ser visto nos mapas do código-fonte que estas funções retornam.

O executor na `ViteRuntime` é responsável pela execução do código. A Vite exporta `ESModulesRunner` fora da caixa, este usa `new AsyncFunction` para executar o código. Nós podemos fornecer a nossa própria implementação se a nossa execução da JavaScript não suportar avaliação insegura.

Os dois principais métodos que a execução expõe são `executeUrl` e `executeEntrypoint`. A única diferença entre eles é que todos os módulos executados por `executeEntrypoint` serão executados novamente se a substituição de módulo instantânea acionar o evento `full-reload`. Precisamos estar cientes de que a execução da Vite não atualiza o objeto `exports` quando isto acontece (esta o substitui), precisaríamos executar a `executeUrl` ou obter o módulo do `moduleCache` novamente se dependêssemos de ter o objeto `exports` mais recente.

**Exemplo de Uso:**

```js
import { ViteRuntime, ESModulesRunner } from 'vite/runtime'
import { root, fetchModule } from './rpc-implementation.js'

const runtime = new ViteRuntime(
  {
    root,
    fetchModule,
    // também podemos fornecer `hmr.connection` para
    // suportar a substituição de módulo instantânea
  },
  new ESModulesRunner(),
)

await runtime.executeEntrypoint('/src/entry-point.js')
```

## `ViteRuntimeOptions` {#viteruntimeoptions}

```ts
export interface ViteRuntimeOptions {
  /**
   * Root of the project
   */
  root: string
  /**
   * A method to get the information about the module.
   * For SSR, Vite exposes `server.ssrFetchModule` function that you can use here.
   * For other runtime use cases, Vite also exposes `fetchModule` from its main entry point.
   */
  fetchModule: FetchFunction
  /**
   * Configure how source maps are resolved. Prefers `node` if `process.setSourceMapsEnabled` is available.
   * Otherwise it will use `prepareStackTrace` by default which overrides `Error.prepareStackTrace` method.
   * You can provide an object to configure how file contents and source maps are resolved for files that were not processed by Vite.
   */
  sourcemapInterceptor?:
    | false
    | 'node'
    | 'prepareStackTrace'
    | InterceptorOptions
  /**
   * Disable HMR or configure HMR options.
   */
  hmr?:
    | false
    | {
        /**
         * Configure how HMR communicates between the client and the server.
         */
        connection: HMRRuntimeConnection
        /**
         * Configure HMR logger.
         */
        logger?: false | HMRLogger
      }
  /**
   * Custom module cache. If not provided, it creates a separate module cache for each ViteRuntime instance.
   */
  moduleCache?: ModuleCacheMap
}
```

## `ViteModuleRunner` {#vitemodulerunner}

**Assinatura de Tipo:**

```ts
export interface ViteModuleRunner {
  /**
   * Run code that was transformed by Vite.
   * @param context Function context
   * @param code Transformed code
   * @param id ID that was used to fetch the module
   */
  runViteModule(
    context: ViteRuntimeModuleContext,
    code: string,
    id: string,
  ): Promise<any>
  /**
   * Run externalized module.
   * @param file File URL to the external module
   */
  runExternalModule(file: string): Promise<any>
}
```

A Vite exporta o `ESModulesRunner` que implementa esta interface por padrão. Esta usa `new AsyncFunction` para executar o código, então se o código tiver um mapa de código fonte incorporado, este deve conter um [deslocamento de 2 linhas](https://tc39.es/ecma262/#sec-createdynamicfunction) para acomodar as novas linhas adicionadas. Isto é feito automaticamente pela `server.ssrFetchModule`. Se a implementação do nosso executor não tiver esta restrição, devemos usar `fetchModule` (exportado da `vite`) diretamente.

## `HMRRuntimeConnection` {#hmrruntimeconnection}

**Assinatura do Tipo:**

```ts
export interface HMRRuntimeConnection {
  /**
   * Checked before sending messages to the client.
   */
  isReady(): boolean
  /**
   * Send message to the client.
   */
  send(message: string): void
  /**
   * Configure how HMR is handled when this connection triggers an update.
   * This method expects that connection will start listening for HMR updates and call this callback when it's received.
   */
  onUpdate(callback: (payload: HMRPayload) => void): void
}
```

Esta interface define como a comunicação da substituição de módulo instantânea é estabelecida. A Vite exporta o `ServerHMRConnector` do ponto de entrada principal para suportar a substituição de módulo instantânea durante a interpretação do lado do servidor da Vite. Os métodos `isReady` e `send` são normalmente chamados quando o evento personalizado é acionado (como, `import.meta.hot.send("my-event")`).

O `onUpdate` é chamado apenas uma vez quando a nova execução é iniciada. Este passa um método que deve ser chamado quando a conexão aciona o evento de substituição de módulo instantânea. A implementação depende do tipo de conexão (por exemplo, pode ser `WebSocket`/`EventEmitter`/`MessageChannel`), mas normalmente é algo neste sentido:

```js
function onUpdate(callback) {
  this.connection.on('hmr', (event) => callback(event.data))
}
```

A função de resposta é enfileirada e aguardará que a atualização atual seja resolvida antes de passar a próxima atualização. Ao contrário da implementação do navegador, as atualizações da substituição de módulo instantânea na execução da Vite esperam até que todos os ouvintes (como `vite:beforeUpdate`/`vite:beforeFullReload`) sejam finalizados antes de atualizar os módulos.

## `createViteRuntime` {#createviteruntime}

**Type Signature:**

```ts
async function createViteRuntime(
  server: ViteDevServer,
  options?: MainThreadRuntimeOptions,
): Promise<ViteRuntime>
```

**Example Usage:**

```js
import { createServer } from 'vite'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

;(async () => {
  const server = await createServer({
    root: __dirname,
  })
  await server.listen()

  const runtime = await createViteRuntime(server)
  await runtime.executeEntrypoint('/src/entry-point.js')
})()
```

This method serves as an easy replacement for `server.ssrLoadModule`. Unlike `ssrLoadModule`, `createViteRuntime` provides HMR support out of the box. You can pass down [`options`](#mainthreadruntimeoptions) to customize how SSR runtime behaves to suit your needs.

## `MainThreadRuntimeOptions` {#mainthreadruntimeoptions}

```ts
export interface MainThreadRuntimeOptions
  extends Omit<ViteRuntimeOptions, 'root' | 'fetchModule' | 'hmr'> {
  /**
   * Disable HMR or configure HMR logger.
   */
  hmr?:
    | false
    | {
        logger?: false | HMRLogger
      }
  /**
   * Provide a custom module runner. This controls how the code is executed.
   */
  runner?: ViteModuleRunner
}
```
