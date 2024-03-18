# API da HMR {#hmr-api}

:::tip NOTA
Esta é a API da HMR do cliente. Para a manipulação da substituição de módulo instantânea nas extensões, consultar a [`handleHotUpdate`](./api-plugin#handlehotupdate).

O manual da API da substituição de módulo instantânea é principalmente destinada aos autores de abstrações e ferramentas. Como um utilizador final, é provável que a substituição de módulo instantânea já esteja resolvida para nós nos modelos de ponto de partida de projetos específicos da abstração.
:::

A Vite expõe o manual da sua API de substituição de módulo instantânea através do objeto especial `import.meta.hot`:

```ts twoslash
import type { ModuleNamespace } from 'vite/types/hot.d.ts'
import type { InferCustomEventPayload } from 'vite/types/customEvent.d.ts'

// ---cut---
interface ImportMeta {
  readonly hot?: ViteHotContext
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

```js twoslash
import 'vite/client'
// ---cut---
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

```js twoslash
// @filename: /foo.d.ts
export declare const foo: () => void

// @filename: /example.js
import 'vite/client'
// ---cut---
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

```js twoslash
import 'vite/client'
// ---cut---
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

```js twoslash
import 'vite/client'
// ---cut---
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

```js twoslash
import 'vite/client'
// ---cut---
// ok
import.meta.hot.data.someValue = 'hello'

// não suportado
import.meta.hot.data = { someValue: 'hello' }
```

## `hot.decline()` {#hot-decline}

Atualmente, isto é um nulo, e existe para compatibilidade com as versões anteriores. Isto poderia mudar no futuro se existir um novo uso para isto. Para indicar que o módulo não é instantaneamente atualizável, usamos `hot.invalidate()`.

## `hot.invalidate(message?: string)` {#hot-invalidate-message-string}

Um módulo que aceita-se a si mesmo pode aperceber-se, durante a execução, de que não consegue lidar com uma atualização da substituição de módulo instantânea, pelo que a atualização tem que ser propagada à força aos importadores. Ao chamar `import.meta.hot.invalidate()`, o servidor da substituição de módulo instantânea invalidará os importadores do chamador, como se o chamador não se aceitasse a si mesmo. Isto registará uma mensagem na consola do navegador e no terminal. Nós podemos passar uma mensagem para dar algum contexto sobre o motivo da invalidação.

Nota que devemos sempre chamar `import.meta.hot.accept` mesmo se planeamos chamar `invalidate` imediatamente depois, ou então o cliente da substituição de módulo instantânea não ouvirá futuras mudanças no módulo de auto-aceitação. Para comunicar a nossa intenção claramente, recomendamos chamar `invalidate` dento da função de resposta de `accept` desta maneira:

```js twoslash
import 'vite/client'
// ---cut---
import.meta.hot.accept((module) => {
  // Podemos usar a nova instância do módulo para
  // decidir se a invalidação deve ser efetuada.
  if (cannotHandleUpdate(module)) {
    import.meta.hot.invalidate()
  }
})
```

## `hot.on(event, cb)` {#hot-on-event-cb}

Ouve um evento de substituição de módulo instantânea

Os seguintes eventos da substituição de módulo instantânea são despachados pela Vite automaticamente:

- `'vite:beforeUpdate'` quando uma atualização está prestes a ser aplicada (por exemplo, um módulo será substituído)
- `'vite:afterUpdate'` quando uma atualização acaba de ser aplicada (por exemplo, um módulo foi substituído)
- `'vite:beforeFullReload'` quando uma recarga completa está prestes a ocorrer
- `'vite:beforePrune'` quando os módulos que já não são necessários estão prestes a ser eliminados
- `'vite:invalidate'` quando um módulo é invalidado com `import.meta.hot.invalidate()`
- `'vite:error'` quando ocorre um erro (por exemplo, erro de sintaxe)
- `'vite:ws:disconnect'` quando a conexão da tomada da Web é perdida (tomada da Web, são os "WebSocket")
- `'vite:ws:connect'` quando a conexão da tomada da Web é re(estabelecida)

Os eventos personalizados da substituição de módulo instantânea também podem ser enviados a partir das extensões. Consultar o [`handleHotUpdate`](./api-plugin#handlehotupdate) por mais detalhes.

## `hot.off(event, cb)` {#hot-off-event-cb}

Remove a função de resposta dos ouvintes de evento.

## `hot.send(event, data)` {#hot-send-event-data}

Envia os eventos personalizados de volta ao servidor de desenvolvimento da Vite.

Se chamada antes da conexão, o dado será amortecido e enviado assim que a conexão for estabelecida.

Consultar a [Comunicação cliente-servidor](/guide/api-plugin#client-server-communication) por mais detalhes.

## Leitura Complementar {#further-reading}

Se quisermos saber mais sobre como usar a API da HMR e como funciona nos bastidores. Nós podemos consultar estes recursos:

- [Hot Module Replacement is Easy](https://bjornlu.com/blog/hot-module-replacement-is-easy)
