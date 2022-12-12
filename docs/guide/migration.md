# Migração da v2 {#migration-from-v2}

## Suporte de Node.js {#nodejs-support}

A Vite já não suporta a Node.js 12 / 13 / 15, as quais alcançaram sua expectativa de vida. Node.js 14.18+ / 16+ é agora obrigatória.

## Mudança de Linha de Base do Navegador Moderno {#modern-browser-baseline-change}

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

## Mudanças Gerais {#general-changes}

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

## Migração da v1 {#migration-from-v1}

Consulte o [Guia de Migração da v1](https://v2.vitejs.dev/guide/migration.html) na documentação da Vite v2 primeiro para ver as mudanças necessárias para passar a tua aplicação para a Vite v2, e então prosseguir com as mudanças nesta página.
