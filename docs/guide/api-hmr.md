# API da HMR {#hmr-api}

:::tip NOTA
Esta é a API da HMR do cliente. Para a manipulação da substituição de módulo instantânea nas extensões, consultar a [`handleHotUpdate`](./api-plugin#handlehotupdate).

O manual da API da substituição de módulo instantânea é principalmente destinada aos autores de abstrações e ferramentas. Como um utilizador final, é provável que a substituição de módulo instantânea já esteja resolvida para nós nos modelos de ponto de partida de projetos específicos da abstração.
:::

A Vite expõe o manual da sua API de substituição de módulo instantânea através do objeto especial `import.meta.hot`:

```ts
interface ImportMeta {
  readonly hot?: ViteHotContext
}

type ModuleNamespace = Record<string, any> & {
  [Symbol.toStringTag]: 'Module'
}

interface ViteHotContext {
  readonly data: any

  accept(): void
  accept(cb: (mod: ModuleNamespace | undefined) => void): void
  accept(dep: string, cb: (mod: ModuleNamespace | undefined) => void): void
  accept(
    deps: readonly string[],
    cb: (mods: Array<ModuleNamespace | undefined>) => void,
  ): void

  dispose(cb: (data: any) => void): void
  prune(cb: (data: any) => void): void
  invalidate(message?: string): void

  // `InferCustomEventPayload` fornece os tipos para
  // os eventos embutidos da Vite
  on<T extends string>(
    event: T,
    cb: (payload: InferCustomEventPayload<T>) => void,
  ): void
  off<T extends string>(
    event: T,
    cb: (payload: InferCustomEventPayload<T>) => void,
  ): void
  send<T extends string>(event: T, data?: InferCustomEventPayload<T>): void
}
```

## Guarda Condicional Obrigatória {#required-conditional-guard}

Em primeiro lugar, temos que nos certificar de proteger todos os usos da API de substituição de módulo instantânea com um bloco condicional para o código poder ser agitado em produção:

```js
if (import.meta.hot) {
  // código da HMR
}
```

## Sensor Inteligente para TypeScript {#intellisense-for-typescript}

A Vite fornece definições de tipo para a `import.meta.hot` no [`vite/client.d.ts`](https://github.com/vitejs/vite/blob/main/packages/vite/client.d.ts). Nós podemos criar um `env.d.ts` no diretório `src` para que a TypeScript pegue as definições de tipo:

```ts
/// <reference types="vite/client" />
```

## `hot.accept(cb)` {#hot-accept-cb}

Para um módulo aceitar-se a si mesmo, usamos a `import.meta.hot.accept` com uma função de resposta que recebe o módulo atualizado:

```js
export const count = 1

if (import.meta.hot) {
  import.meta.hot.accept((newModule) => {
    if (newModule) {
      // "newModule" é indefinido quando ocorre "SyntaxError"
      console.log('updated: count is now ', newModule.count)
    }
  })
}
```

Um módulo que "aceita" atualizações instantâneas é considerado um **limite da substituição de módulo instantânea**.

A substituição de módulo instantânea da Vite não troca o módulo originalmente importado: se um módulo do limite da substituição de módulo instantânea reexportar novamente as importações duma dependência, então este é responsável por atualizar reexportações (e estas exportações devem estar usando `let`). Além disto, os importadores acima da cadeia a partir do módulo de limite não serão notificados da mudança. Esta implementação simplificada da substituição de módulo instantânea é o suficiente para a maioria dos casos de uso de desenvolvimento, enquanto permite-nos saltar o trabalho dispendioso de gerar módulos de delegação.

A Vite exige que a chamada para esta função apareça como `import.meta.hot.accept` (sensível a espaços em branco) no código-fonte para o módulo aceitar a atualização. Isto é um requisito da analise estática que a Vite faz para ativar o suporte a substituição de módulo instantânea para um módulo.

## `hot.accept(deps, cb)` {#hot-accept-deps-cb}

Um módulo também pode aceitar atualizações das dependências diretas sem recarregar-se a si mesmo:

```js
import { foo } from './foo.js'

foo()

if (import.meta.hot) {
  import.meta.hot.accept('./foo.js', (newFoo) => {
    // a função de resposta recebe o módulo
    // './foo.js' atualizado
    newFoo?.foo()
  })

  // Também pode aceitar um vetor de
  // módulos de dependência:
  import.meta.hot.accept(
    ['./foo.js', './bar.js'],
    ([newFooModule, newBarModule]) => {
      // A função de resposta recebe um vetor
      // apenas o módulo atualizado não é nulo.
      // Se a atualização não foi bem sucedida
      // (erro de sintaxe por exemplo),
      // o vetor está vazio
    }
  )
}
```

## `hot.dispose(cb)` {#hot-dispose-cb}

Um módulo que se aceita a si mesmo ou um módulo que espera ser aceito por outros pode usar `hot.dispose` para limpar quaisquer efeitos colaterais persistentes criados por sua cópia atualizada:

```js
function setupSideEffect() {}

setupSideEffect()

if (import.meta.hot) {
  import.meta.hot.dispose((data) => {
    // limpar o efeito colateral
 })
}
```

## `hot.prune(cb)` {#hot-prune-cb}

Regista uma função de resposta que chamar-se-á quando o módulo não for mais importado na página. Comparado com a `hot.dispose`, esta pode ser usada se o código-fonte limpa os efeitos colaterais por si só sobre as atualizações e apenas precisamos limpar quando for removida da página. A Vite atualmente usa isto para as importações de ficheiros `.css`:

```js
function setupOrReuseSideEffect() {}

setupOrReuseSideEffect()

if (import.meta.hot) {
  import.meta.hot.prune((data) => {
    // limpar o efeito colateral
  })
}
```

## `hot.data` {#hot-data}

O objeto `import.meta.hot.data` é persistido em diferentes instâncias do mesmo módulo atualizado. Este pode ser usado para passar informações duma versão anterior do módulo para a próxima.

Nota que a reatribuição do próprio `data` não é suportada. Em vez disso, devemos alterar as propriedades do objeto `data` para que as informações adicionados por outros manipuladores sejam preservadas:

```js
// ok
import.meta.hot.data.someValue = 'hello'

// não suportado
import.meta.hot.data = { someValue: 'hello' }
```

## `hot.decline()` {#hot-decline}

Atualmente, isto é um nulo, e existe para compatibilidade com as versões anteriores. Isto poderia mudar no futuro se existir um novo uso para isto. Para indicar que o módulo não é instantaneamente atualizável, usamos `hot.invalidate()`.

## `hot.invalidate()`

Um módulo de auto-aceitação pode aperceber-se de que durante o tempo de execução que não pode lidar com uma atualização de HMR, e assim a atualização precisa ser energicamente propagada para os importadores. Ao chamar `import.meta.hot.invalidate()`, o servidor de HMR invalidará os importadores do chamador, como se o chamador não fosse de auto-aceitação.

Nota que deves sempre chamar `import.meta.hot.accept` mesmo se planeias chamar `invalidate` imediatamente mais tarde, ou então o cliente de HMR não ouvirá as futuras mudanças para o módulo de auto-aceitação. Para comunicar a tua intenção de maneira clara, recomendamos a chamada de `invalidade` dentro da resposta de `accept` desta maneira:

```ts
import.meta.hot.accept(module => {
  // Tu podes utilizar a nova instância do módulo para decidir se invalida.
  if (cannotHandleUpdate(module)) {
    import.meta.hot.invalidate()
    }
})
```

## `hot.on(event, cb)`

Ouve um evento de HMR

Os seguintes eventos de HMR são despachados pela Vite automaticamente:

- `'vite:beforeUpdate'` quando uma atualização estiver para ser aplicada (por exemplo, um módulo será substituído)
- `'vite:beforeFullReload'` quando um recarregamento completo estiver para ocorrer
- `'vite:beforePrune'` quando os módulos que não são mais necessários estiverem para ser  cortados
- `'vite:invalidate'` quando um módulo for invalidado com `import.meta.hot.invalidate()`
- `'vite:error'` quando um erro ocorrer (por exemplo, erro de sintaxe)
- `'vite:ws:disconnect'` quando a conexão de websocket for perdida
- `'vite:ws:connect'` quando a conexão de websocket for reestabelecida

Os eventos de HMR personalizados também podem ser enviados a partir das extensões. Consulta a [handleHotUpdate](./api-plugin#handlehotupdate) para mais detalhes.

## `hot.off(event, cb)`

Remove a função de resposta dos ouvintes de evento.

## `hot.send(event, data)`

Envia os eventos personalizados de volta para o servidor de desenvolvimento da Vite.

Se chamado antes de conectado, o dado será armazenado temporariamente e enviado uma vez que a conexão for estabelecida.

Consulte a [Comunicação Cliente-Servidor](/guide/api-plugin.html#comunicação-cliente-servidor) para mais detalhes.
