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

Para um módulo aceitar-se, utilize a `import.meta.hot.accept` com uma resposta que receba o módulo atualizado:

```js
export const count = 1

if (import.meta.hot) {
  import.meta.hot.accept((newModule) => {
    if (newModule) {
      // "newModule" é "não definido" quando "SyntaxError" aconteceu
      console.log('updated: count is now ', newModule.count)
    }
  })
}
```

Um módulo que "aceita" atualizações instantâneas é considerado uma **fronteira de HMR**.

A HMR da Vite na realidade não troca o módulo originalmente importado: se um módulo de fronteira de HMR reexportar as importações de uma dependência, então é responsável para atualização destas reexportações (e estas exportações devem estar a usar `let`). Além disto, os importadores ao longo da cadeia do módulo de fronteira não serão notificados da mudança. Esta implementação simplificada da HMR é suficiente para a maioria dos casos de uso de desenvolvimento, enquanto permite-nos ignorar o trabalho dispendioso da geração de módulos de delegação.

A Vite exige que a chamada para esta função apareça como `import.meta.hot.accept(` (sensível aos espaços em branco) no código-fonte em ordem para módulo aceitar atualizar. Este é um requisito da analise estática que a Vite faz para ativar o suporte da HMR para um módulo.

## `hot.accept(deps, cb)`

Um módulo também pode aceitar atualizações de dependências diretas sem recarregar-se a si mesmo:

```js
import { foo } from './foo.js'

foo()

if (import.meta.hot) {
  import.meta.hot.accept('./foo.js', (newFoo) => {
    // a resposta recebe o módulo './foo.js' atualizado
    newFoo?.foo()
  })

  // Também pode aceitar um arranjo de módulos de dependência:
  import.meta.hot.accept(
    ['./foo.js', './bar.js'],
    ([newFooModule, newBarModule]) => {
      // a resposta recebe os módulos atualizados num Arranjo (ou Array)
    }
  )
}
```

## `hot.dispose(cb)`

Um módulo de auto-aceitação ou um módulo que espera ser aceitado por outros pode utilizar `hot.dispose` para limpar quaisquer efeitos colaterais persistente criado pela sua cópia atualizada:

```js
function setupSideEffect() {}

setupSideEffect()

if (import.meta.hot) {
  import.meta.hot.dispose((data) => {
    // limpar o efeito colateral
  })
}
```

## `hot.prune(cb)`

Regista uma função de resposta que chamará quando o módulo já não for importado na página. Comparado à `hot.dispose`, esta pode ser usada se o código-fonte limpar os efeitos colaterais sozinho sobre as atualizações e apenas precisamos limpar quando for removida da página. A Vite atualmente usa isto para importações de `.css`:

```js
function setupOrReuseSideEffect() {}

setupOrReuseSideEffect()

if (import.meta.hot) {
  import.meta.hot.prune((data) => {
    // limpar o efeito colateral
  })
}
```

## `hot.data`

O objeto `import.meta.hot.data` é persistido através de diferentes instâncias do mesmo módulo atualizado. Ele pode ser utilizado para transmitir informação de uma versão anterior do módulo para a próxima.

Nota que a re-atribuição de `data` em si não é suportada. No lugar disto, devemos modificar as propriedades do objeto `data`, assim as informações adicionadas a partir dos outros manipuladores são preservadas:

```js
// ok
import.meta.hot.data.someValue = 'hello'

// não suportado
import.meta.hot.data = { someValue: 'hello' }
```

## `hot.decline()`

A chamada de `import.meta.hot.decline()` indica que este módulo não atualizável de maneira instantânea, e que o navegador deve realizar um recarregamento completo se este módulo for encontrado enquanto estiver propagando as atualizações de HMR,

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
