# Opções de Construção {#build-options}

## build.target {#build-target}

- **Tipo:** `string | string[]`
- **Predefinido como:** `'modules'`
- **Relacionado ao:** [Compatibilidade de Navegador](/guide/build#browser-compatibility)

Alvo da compatibilidade de navegador para o pacote final. O valor padrão é um valor especial de Vite, `'modules'`, que aponta navegadores com [Módulos de ECMAScript nativo](https://caniuse.com/es6-module), [importação dinâmica de Módulo de ECMAScript nativo](https://caniuse.com/es6-module-dynamic-import), e suporte ao [`import.meta`](https://caniuse.com/mdn-javascript_operators_import_meta). A Vite substituirá `'modules'` por `['es2020', 'edge88', 'firefox78', 'chrome87', 'safari14']`

Um outro valor especial é `'esnext'` - que presume o suporte de importações dinâmicas nativa e traduzirá o código o menos possível:


- Se a opção [`build.minify`](#build-minify) for `'terser'` e a versão de Terser instalada estiver abaixo de 5.16.0, `'esnext'` será forçada até `'es2021'`.
- Em outros casos, ele não realizará nenhuma tradução de código.

A transformação é realizada com `esbuild` e o valor deve ser uma [opção `target` da `esbuild`](https://esbuild.github.io/api/#target) válida. Os alvos personalizados pode ser tanto uma versão de ECMAScript (por exemplo, `es2015`), um navegador com aversão (por exemplo, `chrome58`), ou um arranjo de várias sequências de caracteres de alvos.

Nota que a construção falhará se o código conter funcionalidades que não podem ser traduzidas com segurança pelo esbuild. Consulte a [documentação do esbuild](https://esbuild.github.io/content-types/#javascript) por mais detalhes.

## build.modulePreload {#build-modulepreload}

- **Tipo:** `boolean | { polyfill?: boolean, resolveDependencies?: ResolveModulePreloadDependenciesFn }`
- **Predefinido como:** `{ polyfill: true }`

Por padrão, um ["polyfill" de pré-carregamento de módulo](https://guybedford.com/es-module-preloading-integrity#modulepreload-polyfill) é automaticamente injetado. O "polyfill" é injetado automaticamente no módulo de delegação de cada entrada `index.html`. Se a construção for configurada para usar uma entrada personalizada de não HTML através de `build.rollupOptions.input`, então é necessário importar manualmente o "polyfill" na tua entrada personalizada:

```js
import 'vite/modulepreload-polyfill'
```

Nota: o "polyfill" **não** aplica-se ao [Modo de Biblioteca](/guide/build#modo-de-biblioteca). Se precisares suportar os navegadores sem importação dinâmica nativa, deves provavelmente evitar usá-lo na tua biblioteca.

O "polyfill" pode ser desativado usando `{ polyfill: false }`.

A lista de pedaços de pré-carregamento para cada importação dinâmica é calculada pela Vite. Por padrão, um caminho absoluto incluindo a `base` será usado quando carregamos estas dependências. Se a `base` for relativa (`''` ou `'./'`), `import.meta.url` é usado em tempo de execução para evitar caminhos absolutos que dependem da base desdobrada final.

Existe suporte experimenta para o controlo refinado sobre a lista de dependências e seus caminhos usando a função `resolveDependencies`. Ela espera uma função de tipo `ResolveModulePreloadDependenciesFn`:

```ts
type ResolveModulePreloadDependenciesFn = (
  url: string,
  deps: string[],
  context: {
    importer: string
  }
) => (string | { runtime?: string })[]
```

A função `resolveDependencies` será chamada para cada importação dinâmica com uma lista dos pedaços sobre os quais ele depende, e será também chamado para cada pedaço importado nos ficheiros de HTML entrada. Um novo arranjo de dependências pode ser retornado com estes filtrados ou mais dependências injetadas, e seus caminhos modificados. Os caminhos de `deps` são relativos ao `build.outDir`. O retorno de um caminho relativo para o `hostId` para `hostType === 'js'` é permitido, naquele caso que `new URL(dep, import.meta.url)` é usado para obter um caminho absoluto quando injetamos este módulo pré-carregado no cabeçalho da HTML.

```js
modulePreload: {
  resolveDependencies: (filename, deps, { hostId, hostType }) => {
    return deps.filter(condition)
  }
}
```

Os caminhos de dependência resolvida podem ser ainda modificados usando [`experimental.renderBuiltUrl`](../guide/build.md#opções-de-base-avançada).

## build.polyfillModulePreload {#build-polyfillmodulepreload}

- **Tipo:** `boolean`
- **Predefinido como:** `true`
- **Depreciado** use `build.modulePreload.polyfill`

Caso precisares injetar automaticamente um ["polyfill" de pré-carregamento de módulo](https://guybedford.com/es-module-preloading-integrity#modulepreload-polyfill).

## build.outDir {#build-outdir}

- **Tipo:** `string`
- **Predefinido como:** `dist`

Especifica o diretório de saída (relativo à [raiz do projeto](/guide/#index-html-e-a-raiz-do-projeto)).

## build.assetsDir {#build-assetsdir}

- **Tipo:** `string`
- **Predefinido como:** `assets`

Especifica o diretório para encaixar os recursos gerados sob (relativo ao `build.outDir`. Isto não é usado no [Modo de Biblioteca](/guide/build#library-mode)).

## build.assetsInlineLimit {#build-assetsinlinelimit}

- **Tipo:** `number`
- **Predefinido como:** `4096` (4kb)

Recursos importados ou referenciados que são menores do que este limiar serão embutidos como URLs de base64 para evitar requisições de http adicionais. Defina para `0` para desativar completamente este processo de embutir.

Os seguradores de lugares do Sistema de Ficheiro Grande de Git (Git LFS, em Inglês) são automaticamente excluídos do processo de embutir porque eles não contém o conteúdo do ficheiro que eles representam.

:::tip Nota
Se especificares `build.lib`, `build.assetsInlineLimit` será ignorado e os recursos serão sempre embutidos, independentemente do tamanho de ficheiro ou de ser um segurador de lugar de Sistema de Ficheiro Grande de Git (Git LFS, em Inglês).
:::

## build.cssCodeSplit {#build-csscodesplit}

- **Tipo:** `boolean`
- **Predefinido como:** `true`

Ativa ou desativa a separação de código de CSS. Quando ativada, a CSS importada nos pedaços assíncronos serão preservados como pedaços e trazidos juntos quando o pedaço for requisitado.

Se desativada, todas CSS no projeto inteiro serão extraídas em um único ficheiro de CSS.

:::tip Nota
Se especificares `build.lib`, `build.cssCodeSplit` será `false` como padrão.
:::

## build.cssTarget {#build-csstarget}

- **Tipo:** `string | string[]`
- **Predefinido como:** o mesmo que [`build.target`](#build-target)

Esta opção permite os utilizadores definir um alvo de navegador diferente para a minificação de CSS daquela usada para a tradução de código de JavaScript.

Ela deve apenas ser usada quando estiveres mirando um navegador fora dos padrão. Um exemplo é o Android WeChat WebView, que suporta a maior parte das funcionalidades de JavaScript moderno mais não a [notação de cor hexadecimal `#RGBA` em CSS](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value#rgb_colors). Nestes casos, precisas definir `build.cssTarget` para `chrome61` para impedir a Vite de transformar as cores `rgba()` em notações hexadecimal `#RGBA`.

## build.cssMinify {#build-cssminify}

- **Tipo:**
- **Predefinido como:** o mesmo que [`build.minify`](#build-minify)

Esta opção permite os utilizadores sobrepor a especificamente a minificação de CSS no lugar de padronizar para `build.minify`, assim podes configurar a minificação para código de JavaScript e CSS separadamente. A Vite usa a `esbuild` por padrão para minificar a CSS. Defina a opção para `'lightningcss'` para usar a [CSS relâmpago](https://lightningcss.dev/minification.html). Caso selecionada, pode ser configurada usando [`css.lightningcss`](./shared-options.md#css-lightningcss).

## build.sourcemap {#build-sourcemap}

- **Tipo:** `boolean | 'inline' | 'hidden'`
- **Predefinido como:** `false`

Gera os mapas da fonte de produção. Se for `true`, um ficheiro de mapa de fonte separado será criado. Se for `'inline'`, o mapa de fonte será anexado ao ficheiro de saída resultante como uma URI de dados. O `'hidden'` funciona de maneira parecida que `true` exceto que os comentários de mapa de fonte correspondente nos ficheiros empacotadas são suprimidos.

## build.rollupOptions {#build-rollupoptions}

- **Tipo:** [`RollupOptions`](https://rollupjs.org/configuration-options/)

Personaliza diretamente o pacote de Rollup subjacente. Isto é o mesmo que as opções que podem ser exportadas a partir de um ficheiro de configuração de Rollup e serão combinados com as opções internas da Vite. Consulte a [documentação das opções de Rollup](https://rollupjs.org/configuration-options/) para mais detalhes.

## build.commonjsOptions {#build-commonjsoptions}

- **Tipo:** [`RollupCommonJSOptions`](https://github.com/rollup/plugins/tree/master/packages/commonjs#options)

Opções para passar ao [@rollup/plugin-commonjs](https://github.com/rollup/plugins/tree/master/packages/commonjs).

## build.dynamicImportVarsOptions {#build-dynamicimportvarsoptions}

- **Tipo:** [`RollupDynamicImportVarsOptions`](https://github.com/rollup/plugins/tree/master/packages/dynamic-import-vars#options)
- **Relacionado ao:** [Importação Dinâmica](/guide/features#dynamic-import)

Opções para passar ao [@rollup/plugin-dynamic-import-vars](https://github.com/rollup/plugins/tree/master/packages/dynamic-import-vars).

## build.lib {#build-lib}

- **Tipo:** `{ entry: string | string[] | { [entryAlias: string]: string }, name?: string, formats?: ('es' | 'cjs' | 'umd' | 'iife')[], fileName?: string | ((format: ModuleFormat, entryName: string) => string) }`
- **Relacionado ao:** [Modo de Biblioteca](/guide/build#library-mode)

Constrói como uma biblioteca. `entry` é obrigatório visto que a biblioteca não pode usar a HTML como entrada. `name` é a variável global exposta e é obrigatória quando `formats` inclui `'umd'` ou `'iife'`. Os valores predefinidos de `formats` são `['es', 'umd']`. `fileName` é o nome da saída de ficheiro do pacote, o valor predefinido de `fileName` é a opção de nome do `package.json`, ele também pode ser definido como função recebendo o `format` e `entryAlias` como argumentos.

## build.manifest {#build-manifest}

- **Tipo:** `boolean | string`
- **Predefinido como:** `false`
- **Relacionado ao:** [Integração de Backend](/guide/backend-integration)

Quando definido para `true`, a construção também gerará um ficheiro `manifest.json` que contém um mapeamento de nomes de ficheiros de recurso não embaralhado para as suas versões embaralhadas, as quais podem então ser usadas por uma abstração de servidor para interpretar as ligações de recurso correta. Quando o valor é uma sequência de caracteres, será usada como nome do ficheiro de manifesto.

## build.ssrManifest {#build-ssrmanifest}

- **Tipo:** `boolean | string`
- **Predefinido como:** `false`
- **Relacionado ao:** [Server-Side Rendering](/guide/ssr)

Quando definido para `true`, a construção também gerará um manifesto de SSR para a determinação de ligações de estilo e diretivas de pré-carregamento de recurso em produção. Quando o valor for uma sequência de caracteres, será usada como nome do ficheiro de manifesto.

## build.ssr {#build-ssr}

- **Tipo:** `boolean | string`
- **Predefinido como:** `false`
- **Relacionado ao:** [Interpretação no Lado do Servidor](/guide/ssr)

Produz a construção orientada pela SSR. O valor pode ser uma sequência de caracteres para diretamente especificar a entrada da SSR, ou `true`, o qual exige a especificação da entrada de SSR através de `rollupOptions.input`.

## build.minify {#build-minify}

- **Tipo:** `boolean | 'terser' | 'esbuild'`
- **Predefinido como:** `'esbuild'`

Define para `false` para desativar a minificação, ou especifique o minificador a usar. O padrão é [esbuild](https://github.com/evanw/esbuild) o qual é 20 ~ 40x mais rápido do que o terser e apenas 1 ~ 2% pior em compressão. [Pontos de Referências](https://github.com/privatenumber/minification-benchmarks).

Nota que a opção `build.minify` não minifica espaços em branco quando usamos o formato `'es'` no modo de biblioteca, porque remove as anotações puras e quebra a sacudidura de árvore.

Terser deve ser instalado quando estiver definido para `'terser'`.

```sh
npm add -D terser
```

## build.terserOptions {#build-terseroptions}

- **Tipo:** `TerserOptions`

[Opções de minificação](https://terser.org/docs/api-reference#minify-options) adicionais para passar ao Terser.

## build.write {#build-write}

- **Tipo:** `boolean`
- **Predefinido como:** `true`

Defina para `false` para desativar a escrita do pacote no disco. Isto é na maior parte das vezes usada nas [chamadas de `build()` programáticas](/guide/api-javascript#build) onde mais adiante o processamento posterior do pacote é necessário antes da escrita em disco.

## build.emptyOutDir {#build-emptyoutdir}

- **Tipo:** `boolean`
- **Predefinido como:** `true` se `outDir` estiver dentro do `root`

Por padrão, a Vite esvaziará o `outDir` na construção se estiver dentro da raiz do projeto. Ele emitirá um aviso se `outDir` está fora da raiz para evitar remover acidentalmente ficheiros importantes. Tu podes definir explicitamente esta opção para suprimir o aviso. Isto também está disponível através da linha de comando como `--emptyOutDir`.

## build.reportCompressedSize {#build-reportcompressedsize}

- **Tipo:** `boolean`
- **Predefinido como:** `true`

Ativa e desativa a reportagem do tamanho compactado em GZip. A compactação de ficheiros de saída grande pode ser lento, assim a desativação disto pode aumentar o desempenho da construção para projetos grandes.

## build.chunkSizeWarningLimit {#build-chunksizewarninglimit}

- **Tipo:** `number`
- **Predefinido como:** `500`

Limite para avisos do tamanho do pedaço (em kbs).

## build.watch {#build-watch}

- **Tipo:** [`WatcherOptions`](https://rollupjs.org/configuration-options/#watch)`| null`
- **Predefinido como:** `null`

Defina para `{}` para ativar o observador de Rollup. Isto é na maior parte das vezes usado nos casos que envolve extensões de apenas construção ou processos de integrações.

::: warning Usando a Vite no Subsistema de Windows para Linux (WSL, sigla em Inglês) 2

Há casos que o sistema de ficheiro observando não funciona com WSL2.
Consulte [`server.watch`](./server-options.md#server-watch) para mais detalhes.

:::
