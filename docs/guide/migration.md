# Migração a partir da v3 {#migration-from-v3}

## Rollup 3 {#rollup-3}

A Vite agora está a usar [Rollup 3](https://github.com/vitejs/vite/issues/9870), que permitiu-nos simplificar a manipulação de recurso interno da Vite e tem muitos aprimoramentos. Consulte as [notas de lançamento da Rollup 3](https://github.com/rollup/rollup/releases).

A Rollup 3 é maioritariamente compatível com a Rollup 2. Se estiveres a usar [`rollupOptions`](../config/build-options.md#rollup-options) personalizada no teu projeto e teres problemas, consulte o [Guia de Migração da Rollup](https://rollupjs.org/guide/en/#migration) para atualizar a tua configuração.

## Mudança de Linhas de Bases de Navegador Moderno {#modern-browser-baseline-change}

A construção de navegador moderno agora mira o `safari14` por padrão para compatibilidade de ES2020 mais extensa (movido do `safari13`). Isto significa que construções modernas podem agora usar [`BigInt`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) e que a [aglutinação de operador nulo](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing) já não é mais traduzido. Se precisares suportar navegadores antigos, podes adicionar o [`@vitejs/plugin-legacy`](https://github.com/vitejs/vite/tree/main/packages/plugin-legacy) como de costume.

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

### Construções de Produção por Padrão

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

## Avançado {#advanced-vite-4}

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

## Migração a partir da v2 {#migration-from-v2}

## Suporte de Node.js {#nodejs-support}

A Vite já não suporta a Node.js 12 / 13 / 15, as quais alcançaram sua expectativa de vida. Node.js 14.18+ / 16+ é agora obrigatória.

## Mudança de Linhas de Bases do Navegador Moderno {#modern-browser-baseline-change-of-vite-3}

O pacote de produção presume o suporte para a JavaScript moderno. Por padrão, a Vite tem como alvo navegadores que suportam os [Módulos de ECMAScript nativo](https://caniuse.com/es6-module), [importação dinâmica de Módulo de ECMAScript nativo](https://caniuse.com/es6-module-dynamic-import), e [`import.meta`](https://caniuse.com/mdn-javascript_operators_import_meta):

- Chrome >=87
- Firefox >=78
- Safari >=13
- Edge >=88

Um fração pequena de utilizadores exigirão agora a utilização de [@vitejs/plugin-legacy](https://github.com/vitejs/vite/tree/main/packages/plugin-legacy), que gerará automaticamente pedaços legados e "pollyfills" da funcionalidade da linguagem de ECMAScript correspondente.

## Mudanças de Opções de Configuração {#config-options-changes}

As seguintes opções que já foram depreciadas na v2 têm sido removidas:

- `alias` (troque para [`resolve.alias`](../config/shared-options.md#resolve-alias))
- `dedupe` (troque para [`resolve.dedupe`](../config/shared-options.md#resolve-dedupe))
- `build.base` (troque para [`base`](../config/shared-options.md#base))
- `build.brotliSize` (troque para [`build.reportCompressedSize`](../config/build-options.md#build-reportcompressedsize))
- `build.cleanCssOptions` (Agora a Vite utiliza a esbuild para minificação de CSS)
- `build.polyfillDynamicImport` (utilize o [`@vitejs/plugin-legacy`](https://github.com/vitejs/vite/tree/main/packages/plugin-legacy) para navegadores sem suporte a importação dinâmica)
- `optimizeDeps.keepNames` (troque para [`optimizeDeps.esbuildOptions.keepNames`](../config/dep-optimization-options.md#optimizedeps-esbuildoptions))

## Mudanças de Arquitetura e Opções Legadas {#architecture-changes-and-legacy-options}

Esta secção descreve as maiores mudanças de arquitetura na Vite v3. Para permitir os projetos migrem da v2 em caso de problema de compatibilidade, opções legadas que tem sido adicionadas para regressar para as estratégias da Vite v2.

### Mudanças do Servidor de Desenvolvimento {#dev-server-changes}

A porta do servidor de desenvolvimento padrão da Vita agora é 5173. Tu podes utilizar a [`server.port`](../config/server-options.md#server-port) para defini-la para 3000.

O hospedeiro do servidor de desenvolvimento padrão da Vite agora é `localhost`. Na Vite v2, a Vite estava ouvindo a `127.0.0.1` por padrão. A Node.js abaixo da v17 normalmente resolve `localhost` para `127.0.0.1`, assim para aquelas versões, o hospedeiro não mudará. Para Node.js 17+, podes utilizar a [`server.host`](../config/server-options.md#server-host) para defini-lo para `127.0.0.1` para preservar o mesmo hospedeiro em acordo com a Vite v2.

Nota que a Vite v3 agora imprime o hospedeiro correto. Isto significa que a Vite pode imprimir `127.0.0.1` como hospedeiro de escuta quando `localhost` é utilizado. Tu podes definir [`dns.setDefaultResultOrder('verbatim')`](https://nodejs.org/api/dns.html#dns_dns_setdefaultresultorder_order) para impedir isto. Consulte [`server.host`](../config/server-options.md#server-host) para mais detalhes.

### Mudanças da SSR {#ssr-changes}

A Vite v3 utiliza o Módulo de ECMAScript para a construção da SSR por padrão. Quando estiveres utilizando o Módulo de ECMAScript, as [heurísticas de exposição da SSR](https://vitejs.dev/guide/ssr.html#ssr-externals) já não são necessárias. Por padrão, todas as dependências são expostas. Tu podes utilizar [`ssr.noExternal`](../config/ssr-options.md#ssr-noexternal) para controlar quais dependências para incluir no pacote da SSR.

Se a utilização do Módulo de ECMAScript para Interpretação no Lado do Servidor não for possível no teu projeto, podes definir `legacy.buildSsrCjsExternalHeuristics` para gerar um pacote de CJS utilizando a mesma estratégia de exposição da Vite v2.

Além disto a [`build.rollupOptions.output.inlineDynamicImports`](https://rollupjs.org/guide/en/#outputinlinedynamicimports) agora predefine para `false` quando `ssr.target` for `'node'`. A `inlineDynamicImports` muda a ordem de execução e empacotamento para um único ficheiro não é necessário para construções de node.

## Mudanças Gerais {#general-changes-for-vite-3}

- Extensões de ficheiro de JS na SSR e no modo de biblioteca agora utilizam uma extensão válida (`js`, `mjs`, ou `cjs`) para as entradas de JS de saída e pedaços baseados no seu formato e no tipo de pacote.
- A "Terser" é agora uma dependência opcional. Se estiveres utilizando `build.minify: 'terser'`, precisas instalá-lo.

  ```shell
  npm add -D terser
  ```

### `import.meta.glob`

- [`import.meta.glob` pura](features.md#glob-importa-como) mudada de `{ assert: { type: 'raw' }}` para `{ as: 'raw' }`
- As chaves de `import.meta.glob` são agora relativas ao módulo atual.

  ```diff
  // file: /foo/index.js
  const modules = import.meta.glob('../foo/*.js')

  // transformado:
  const modules = {
  -  '../foo/bar.js': () => {}
  +  './bar.js': () => {}
  }
  ```

- Quando estiveres utilizando um pseudónimo com `import.meta.glob`, as chaves são sempre absolutas.
- O `import.meta.globEager` está agora depreciado. Utilize `import.meta.glob('*', { eager: true })` no lugar dele.

### Suporte ao WebAssembly {#webassembly-support}

A sintaxe `import init from 'example.wasm'` está abandonada para evitar colisão futura com a ["Integração de Módulo de ECMAScript para Wasm"](https://github.com/WebAssembly/esm-integration).
Tu podes utilizar `?init` o qual é semelhante ao comportamento anterior.

```diff
-import init from 'example.wasm'
+import init from 'example.wasm?init'

-init().then((exports) => {
+init().then(({ exports }) => {
  exports.test()
})
```

### Geração de Certificado HTTPS Automática {#automatic-https-certificate-generation}

Um certificado válido é necessário quando estiveres utilizando `https`. Na Vite v2, se nenhum certificado foi configurado, um certificado auto-assinado era automaticamente criado e cacheado.
Desde a Vite v3, recomendados a criação dos teus certificados manualmente. Se ainda quiseres utilizar a geração automática da v2, esta funcionalidade pode ser ativa de volta adicionando [@vitejs/plugin-basic-ssl](https://github.com/vitejs/vite-plugin-basic-ssl) às extensões do projeto.

```js
import basicSsl from '@vitejs/plugin-basic-ssl'

export default {
  plugins: [basicSsl()]
}
```

## Experimental {#experimental}

### Utilizando a otimização de dependências de esbuild em tempo de construção {#using-esbuild-deps-optimization-at-build-time}

Na v3, a Vite permite o uso do esbuild para otimizar dependências durante o tempo de construção. Se ativada, ela remove uma das mais significantes diferenças entre o desenvolvimento e produção presentes na v2. O [`@rollup/plugin-commonjs`](https://github.com/rollup/plugins/tree/master/packages/commonjs) não é mais necessário neste caso já que a esbuild converte apenas dependências de CJS para ESM.

Se quiseres experimentar este estratégia de construção, podes utilizar `optimizeDeps.disabled: false` (o padrão na v3 é `disabled: 'build'`). O `@rollup/plugin-commonjs` pode ser removido passando `build.commonjsOptions: { include: [] }`.

## Avançado {#advanced}

Existem algumas mudanças que só afetam os criadores de extensão ou criadores de ferramenta.

- [[#5868] refactor: remove deprecated api for 3.0](https://github.com/vitejs/vite/pull/5868)
  - `printHttpServerUrls` está removida
  - `server.app`, `server.transformWithEsbuild` estão removidas
  - `import.meta.hot.acceptDeps` está removida
- [[#6901] fix: sequential injection of tags in transformIndexHtml](https://github.com/vitejs/vite/pull/6901)
  - `transformIndexHtml` agora recebe o conteúdo correto modificado pelas extensões anteriores, assim a ordem dos marcadores injetados agora funciona como esperado.
- [[#7995] chore: do not fixStacktrace](https://github.com/vitejs/vite/pull/7995)
  - O valor predefinido da opção `fixStacktrace` da `ssrLoadModule` agora é `false`
- [[#8178] feat!: migrate to ESM](https://github.com/vitejs/vite/pull/8178)
  - `formatPostcssSourceMap` agora é assíncrono
  - `resolvePackageEntry`, `resolvePackageData` não estão mais disponíveis a partir da construção de CJS (a importação dinâmica é necessária para utilizar na CJS)
- [[#8626] refactor: type client maps](https://github.com/vitejs/vite/pull/8626)
  - O tipo da resposta do `import.meta.hot.accept` agora é estrito. Ele agora é `(mod: (Record<string, any> & { [Symbol.toStringTag]: 'Module' }) | undefined) => void` (foi `(mod: any) => void`).

Além disto existem outras mudanças de quebras de compatibilidade as quais apenas afetam poucos utilizadores.

- [[#5018] feat: enable `generatedCode: 'es2015'` for rollup build](https://github.com/vitejs/vite/pull/5018)
  - Tradução do código para ES5 agora é necessário mesmo se o código do utilizador apenas incluir ES5.
- [[#7877] fix: vite client types](https://github.com/vitejs/vite/pull/7877)
  - `/// <reference lib="dom" />` está removida do `vite/client.d.ts`. `{ "lib": ["dom"] }` ou `{ "lib": ["webworker"] }` é necessária no `tsconfig.json`.
- [[#8090] feat: preserve process env vars in lib build](https://github.com/vitejs/vite/pull/8090)
  - `process.env.*` agora é preservado no modo de biblioteca
- [[#8280] feat: non-blocking esbuild optimization at build time](https://github.com/vitejs/vite/pull/8280)
  - A opção `server.force` foi removida em favor da opção `optimizeDeps.force`.
- [[#8550] fix: dont handle sigterm in middleware mode](https://github.com/vitejs/vite/pull/8550)
  - Quando estiveres executando no modo de intermediário, a Vite não mais mata o processo no `SIGTERM`.

## Migração a partir da v1 {#migration-from-v1}

Consulte o [Guia de Migração da v1](https://v2.vitejs.dev/guide/migration.html) na documentação da Vite v2 primeiro para ver as mudanças necessárias para passar a tua aplicação para a Vite v2, e então prosseguir com as mudanças nesta página.
