# Migração da Versão 3 {#migration-from-v3}

## Rollup 3 {#rollup-3}

A Vite agora está a usar [Rollup 3](https://github.com/vitejs/vite/issues/9870), que permitiu-nos simplificar a manipulação de recurso interno da Vite e tem muitos aprimoramentos. Consulte as [notas de lançamento da Rollup 3](https://github.com/rollup/rollup/releases).

A Rollup 3 é maioritariamente compatível com a Rollup 2. Se estiveres a usar [`rollupOptions`](../config/build-options.md#rollup-options) personalizada no teu projeto e teres problemas, consulte o [Guia de Migração da Rollup](https://rollupjs.org/guide/en/#migration) para atualizar a tua configuração.

## Mudança de Linhas de Bases de Navegador Moderno {#modern-browser-baseline-change}

A construção de navegador moderno agora mira o `safari14` por padrão para compatibilidade de ES2020 mais extensa (movido do `safari13`). Isto significa que construções modernas podem agora usar [`BigInt`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) e que a [aglutinação de operador nulo](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing) já não é mais traduzida. Se precisares suportar navegadores antigos, podes adicionar o [`@vitejs/plugin-legacy`](https://github.com/vitejs/vite/tree/main/packages/plugin-legacy) como de costume.

## Mudanças Gerais {#general-changes}

### Codificação {#encoding}

O conjunto de caracteres padrão da construção agora é `utf8` (consulte [#10753](https://github.com/vitejs/vite/issues/10753) para ter mais detalhes).

### Importação de CSS como uma Sequência de Caracteres {#importing-css-as-a-string}

Na Vite 3, a importação da exportação padrão de um ficheiro `.css` poderia introduzir um duplo carregamento do CSS.

```ts
import cssString from './global.css'
```

Este duplo carregamento poderia ocorrer já que um ficheiro `.css` será emitido e é provável que a sequência de caracteres de CSS também será usada pelo código da aplicação — por exemplo, injetado pela abstração em tempo de execução. A partir da Vite 4, a exportação padrão de `.css` [tem sido depreciada](https://github.com/vitejs/vite/issues/11094). O modificar de sufixo de consulta `?inline` precisa ser usado neste caso, já que este não emite os estilos do `.css` importados

```ts
import stuff from './global.css?inline'
```

### Construções de Produção por Padrão {#production-builds-by-default}

O `vite build` agora sempre construirá para produção independentemente do `--mode` passado. Anteriormente, mudar o `mode` para outro que não seja `production` resultaria em uma construção de desenvolvimento. Se desejas continuar a construir para o desenvolvimento, podes definir `NODE_ENV=development` no ficheiro `.env.{mode}`.

Como parte deste mudança, `vite dev` e `vite build` já não sobreporão o `process.env.`<wbr>`NODE_ENV` se ele já estiver definido. Assim se tiveres definido `process.env.`<wbr>`NODE_ENV = 'development'` antes da construção, ele também construirá para desenvolvimento. Isto dá-te mais controlo quando estiveres a executar várias construções ou servidores de desenvolvimento em paralelo.

Consulte a [documentação de `mode`](https://vitejs.dev/guide/env-and-mode.html#modes) atualizada para mais detalhes.

### Variáveis de Ambiente {#environment-variables}

A Vite agora usa `dotenv` 16 e `dotenv-expand` 9 (anteriormente `dotenv` 14 e `dotenv-expand` 5). Se tiveres um valor que inclui `#`, `` ` ``, precisarás envolvê-los com aspas.

```diff
-VITE_APP=ab#cd`ef
+VITE_APP="ab#cd`ef"
```

Para mais detalhes, consulte o relatório de mudança da [`dotenv`](https://github.com/motdotla/dotenv/blob/master/CHANGELOG.md) e da [`dotenv-expand`](https://github.com/motdotla/dotenv-expand/blob/master/CHANGELOG.md).

## Avançado {#advanced}

Existe algumas mudanças que apenas afetam criadores de extensão e ferramenta.

- [[#11036] feat(client): remove never implemented hot.decline](https://github.com/vitejs/vite/issues/11036)
  - use `hot.invalidate` no lugar daquela
- [[#9669] feat: align object interface for `transformIndexHtml` hook](https://github.com/vitejs/vite/issues/9669)
  - use `order` no lugar de `enforce`

Também existe outras mudanças de quebra compatibilidade que apenas afetam alguns utilizadores.

- [[#11101] feat(ssr)!: remove dedupe and mode support for CJS](https://github.com/vitejs/vite/pull/11101)
  - Tu deves migrar para o modo de Módulo de ECMAScript padrão para SSR, o suporte a SSR de CJS pode ser removido na próxima Vite principal.
- [[#10475] feat: handle static assets in case-sensitive manner](https://github.com/vitejs/vite/pull/10475)
  - O teu projeto não deve depender de um SO que ignora a diferença entre maiúsculas e minúsculas dos nomes de ficheiro.
- [[#10996] fix!: make `NODE_ENV` more predictable](https://github.com/vitejs/vite/pull/10996)
  - Consulte o PR para um explicação sobre esta mudança.
- [[#10903] refactor(types)!: remove facade type files](https://github.com/vitejs/vite/pull/10903)

## Migração da Versão 2 {#migration-from-v2}

Consulte primeiro o [Guia de Migração da Vite 2](https://v3.vitejs.dev/guide/migration.html) na documentação da Vite 3 para veres as mudanças necessárias para migrares a tua aplicação para Vite 3, e depois prosseguir com as mudanças nesta página.

## Migração da Versão 1 {#migration-from-v1}

Consulte o [Guia de Migração da Vite 1](https://v2.vitejs.dev/guide/migration.html) na documentação da Vite v2 primeiro para ver as mudanças necessárias para passar a tua aplicação para a Vite v2, e então prosseguir com as mudanças nesta página.
