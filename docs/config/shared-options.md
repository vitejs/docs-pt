# Opções Partilhadas {#shared-options}

## root {#root}

- **Tipo:** `string`
- **Predefinido como:** `process.cwd()`

Diretório raiz do projeto (onde o `index.html` está localizado). Pode ser um caminho absoluto, ou um caminho relativo ao atual diretório de trabalho.

Consulte [Raiz do Projeto](/guide/#index-html-and-project-root) para mais detalhes.

## base {#base}

- **Tipo:** `string`
- **Predefinido como:** `/`

O caminho público de base quando servido em desenvolvimento ou produção. Os valores válidos incluem:

- Nome do caminho da URL absoluta, por exemplo `/foo/`
- URL completa, por exemplo `https://foo.com/`
- Sequência de caracteres vazia ou `./` (para o desdobramento embutido)

Consulte [Caminho de Base Pública](/guide/build#public-base-path) para mais detalhes.

## mode {#mode}

- **Tipo:** `string`
- **Predefinido como:** `'development'` para servir, `'production'` para construir

Especificando isto na configuração sobreporá o modo padrão para **ambos servir e construir**. Este valor também pode ser sobreposto através da opção `--mode` de linha de comando.

Consulte [Variáveis de Ambiente e Modos](/guide/env-and-mode) para mais detalhes.

## define {#define}

- **Tipo:** `Record<string, string>`

Define as substituições de constante global. Entradas serão definidas como globais durante o desenvolvimento e substituídos estaticamente durante a construção.

- Começando a partir da versão `2.0.0-beta.70`, os valores de sequência de caracteres serão usados como expressões cruas, assim se definir uma constante de sequência de caracteres, ela precisa ser explicitamente posta entre aspas (por exemplo com `JSON.stringify`).

- Para ser consistente com o [comportamento da esbuild](https://esbuild.github.io/api/#define), expressões devem tanto ser um objeto de JSON (`null`, `boolean`, `number`, `string`, `array`, ou `object`) ou um único identificador.

- Substituições são realizadas apenas quando a correspondência não estiver cercada por outras letras, números, `_` ou `$`.

:::warning Aviso
Um vez que é implementado como substituição de texto direta sem qualquer analise de sintaxe, recomendados o uso de `define` apenas para CONSTANTES.

Por exemplo, `process.env.FOO` e `__APP_VERSION__` são bem apropriadas. Mas `process` ou `global` não deveriam ser colocados nesta opção. Variáveis podem ser calçadas ou preenchidas.
:::

::: tip NOTA
Para os utilizadores de TypeScript, certifiquem-se de adicionar as declarações de tipo no `env.d.ts` ou ficheiro `vite-env.d.ts` para term as verificações de tipo e o sensor inteligente.

Exemplo:

```ts
// vite-env.d.ts
declare const __APP_VERSION__: string
```

:::

::: tip NOTA
Já que o desenvolvimento (dev) e construção (build) implementam `define` de maneira diferente, devemos evitar alguns casos de uso para evitar inconsistência.

Exemplo:

```js
const obj = {
  __NAME__, // Não defina nomes de propriedade abreviada de objeto
  __KEY__: value // Não defina chave de objeto
}
```

:::

## plugins {#plugins}

- **Tipo:** `(Plugin | Plugin[] | Promise<Plugin | Plugin[]>)[]`

Arranjo de extensões a usar. As extensões falsas são ignoras e os arranjos de extensões são aplanados. Se uma promessa for retornada, seria resolvida antes da execução. Consulte [API da Extensão](/guide/api-plugin) por mais detalhes sobre as extensões de Vite.

## publicDir {#publicdir}

- **Tipo:** `string | false`
- **Predefinido como:** `"public"`

Diretório para servir como recursos estáticos simples. Os ficheiros neste diretório são servidos no `/` durante o desenvolvimento e copiados para a raiz do `outDir` durante a construção, e são sempre servidos ou copiados como estão sem transformação. O valor pode ser tanto um caminho do sistema de ficheiro absoluto ou um caminho relativo à raiz do projeto.

Definir `publicDir` como `false` desativa esta funcionalidade.

Consulte [O Diretório `public`](/guide/assets#the-public-directory) por mais detalhes.

## cacheDir {#cachedir}

- **Tipo:** `string`
- **Predefinido como:** `"node_modules/.vite"`

Diretório para guardar ficheiros para consulta imediata. Os ficheiros neste diretório são dependências pré-empacotadas ou outros ficheiros de consulta imediata gerados pela Vite, o que pode melhorar o desempenho. Tu podes usar a opção `--force` ou manualmente eliminar o diretório para regenerar os ficheiros de consulta imediata. O valor pode ser tanto um caminho do sistema de ficheiro absoluto ou um caminho relativo a raiz do projeto. Predefinido para `.vite` quando nenhum `package.json` for detetado.

## resolve.alias {#resolve-alias}

- **Tipo:**
  `Record<string, string> | Array<{ find: string | RegExp, replacement: string, customResolver?: ResolverFunction | ResolverObject }>`

Será passado para `@rollup/plugin-alias` como sua [opções de entradas](https://github.com/rollup/plugins/tree/master/packages/alias#entries). Pode ser tanto um objeto, ou um arranjo de pares `{ find, replacement, customResolver }`.

Quando atribuíres pseudónimos aos caminhos do sistema de ficheiro, use sempre caminhos absolutos. Os valores de pseudónimos relativos serão usados tal como são e não serão resolvidos em caminhos do sistema de ficheiro.

Mais resoluções personalizadas avançadas podem ser alcançado através de [extensões](/guide/api-plugin).

::: warning Usando com SSR
Se tiveres pseudónimos configurados para [dependências expostas da SSR](/guide/ssr.md#ssr-externals), podes desejar atribuir pseudónimo os pacotes do `node_modules`. Ambos [Yarn](https://classic.yarnpkg.com/en/docs/cli/add/#toc-yarn-add-alias) e [pnpm](https://pnpm.js.org/en/aliases) suportam a atribuição pseudónimos através do prefixo `npm:`.
:::

## resolve.dedupe {#resolve-dedupe}

- **Tipo:** `string[]`

Se tiveres copias duplicadas da mesma dependência na tua aplicação (provavelmente devido ao içamento ou pacotes ligados nos mono-repositório), use esta opção para forçar a Vite a sempre resolver dependências listadas à mesma cópia (a partir da raiz do projeto).

:::warning SSR + ESM
Para as construções de SSR, a resolução da duplicação de cópias da mesma dependência não funcionar para saídas da construção de módulos de ECMAScript (ESM, em Inglês) configurados a partir do `build.rollupOptions.output`. Um solução é usar as saídas da construção de CJS até que a ESM ter melhor suporte de extensão para o carregamento de módulo.
:::

## resolve.conditions {#resolve-conditions}

- **Tipo:** `string[]`

Além das condições permitidas quando resolves [Exportações Condicionais](https://nodejs.org/api/packages.html#packages_conditional_exports) de um pacote.

Um pacote com exportações condicionais pode ter o seguinte campo `exports` no seu `package.json`:

```json
{
  "exports": {
    ".": {
      "import": "./index.mjs",
      "require": "./index.js"
    }
  }
}
```

Aqui, `import` e `require` são "condições". As condições podem ser encaixados e devem ser especificados a partir do mais específico até o menos específicos.

A Vite tem uma lista de "condições permitidas" e corresponderá a primeira condição que está na lista permitida. As condições permitidas padrão são: `import`, `module`, `browser`, `default`, e `production/development` baseado no modo atual. A opção de configuração `resolve.conditions` permite a especificação condições permitidas adicionais.

:::warning Resolução de Exportações de Sub-Pasta
A exportação de chaves que terminam com "/" está depreciada pela Node e não funcionam bem. Entre em contato com autor do pacote para o convencer para que de preferência a usar [padrões de sub-pasta `*`](https://nodejs.org/api/packages.html#package-entry-points).
:::

## resolve.mainFields {#resolve-mainfields}

- **Tipo:** `string[]`
- **Predefinido como:** `['module', 'jsnext:main', 'jsnext']`

Lista de campos no `package.json` para experimentar quando estiveres a resolver um ponto de entrada de pacote. Nota que isto recebe prioridade mais baixa do que as exportações condicionais resolvidas a partir do campo `exports`: se um ponto de entrada for resolvido com sucesso a partir do `exports`, o campo principal será ignorado.

## resolve.browserField {#resolve-browserfield}

- **Tipo:** `boolean`
- **Predefinido como:** `true`
- **Deprecated**

Se for ativar a resolução para campo `browser`.

No futuro, o valor padrão do `resolve.mainFields` será `['browser', 'module', 'jsnext:main', 'jsnext']` e esta opção será removida.

## resolve.extensions {#resolve-extensions}

- **Tipo:** `string[]`
- **Predefinido como:** `['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json']`

Lista de extensões de ficheiros para experimentar às importações que omitem as extensões. Nota que **NÃO** recomendado omitir as extensões para tipos de importações personalizadas (por exemplo, `.vue`) já que isto pode interferir com a IDE e o suporte de tipo.

## resolve.preserveSymlinks {#resolve-preservesymlinks}

- **Tipo:** `boolean`
- **Predefinido como:** `false`

A ativação desta definição faz a Vite determinar a identidade de ficheiro pelo caminho do ficheiro original (por exemplo, o caminho sem as seguintes ligações simbólicas) no lugar de caminho do ficheiro verdadeiro (por exemplo, o caminho depois das seguintes ligações simbólicas).

- **Relacionado ao:** [esbuild#preserve-symlinks](https://esbuild.github.io/api/#preserve-symlinks), [webpack#resolve.symlinks](https://webpack.js.org/configuration/resolve/#resolvesymlinks)

## css.modules {#css-modules}

- **Tipo:**
  ```ts
  interface CSSModulesOptions {
    scopeBehaviour?: 'global' | 'local'
    globalModulePaths?: RegExp[]
    generateScopedName?:
      | string
      | ((name: string, filename: string, css: string) => string)
    hashPrefix?: string
    /**
     * default: null
     */
    localsConvention?:
      | 'camelCase'
      | 'camelCaseOnly'
      | 'dashes'
      | 'dashesOnly'
      | null
  }
  ```

Configura o comportamento dos módulos de CSS. As opções são passadas para [postcss-modules](https://github.com/css-modules/postcss-modules).

## css.postcss {#css-postcss}

- **Tipo:** `string | (postcss.ProcessOptions & { plugins?: postcss.AcceptedPlugin[] })`

Incorpora a configuração de PostCSS ou um diretório personalizada a partir do qual procurar a configuração do PostCSS (o padrão é a raiz do projeto).

Para configuração de PostCSS embutida, espera o mesmo formato como `postcss.config.js`. Mas para propriedade `plugins`, apenas [formato de arranjo](https://github.com/postcss/postcss-load-config/blob/main/README.md#array) pode ser usados.

A pesquisa é feita com o uso da [postcss-load-config](https://github.com/postcss/postcss-load-config) e apenas os nomes de ficheiro de configuração suportados são carregados.

Nota se uma configuração embutida for fornecida, a Vite não procurará por outras fontes de configuração de PostCSS.

## css.preprocessorOptions {#css-preprocessoroptions}

- **Tipo:** `Record<string, object>`

Especifica opções para passar os pré-processador de CSS. As extensões de ficheiro são usadas como chaves para as opções. Exemplo:

```js
export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `$injectedColor: orange;`
      },
      styl: {
        additionalData: `$injectedColor ?= orange`
      }
    }
  }
})
```

## css.devSourcemap {#css-devsourcemap}

- **Experimental**
- **Tipo:** `boolean`
- **Predefinido como:** `false`

Se for ativar os mapas de fonte durante o desenvolvimento.

## json.namedExports {#json-namedexports}

- **Tipo:** `boolean`
- **Predefinido como:** `true`

Se for suportar importações nomeadas a partir de ficheiros `.json`.

## json.stringify {#json-stringify}

- **Tipo:** `boolean`
- **Predefinido como:** `false`

Se definido para `true`, o JSON importado será transformado em `export default JSON.parse("...")` o que é significativamente mais otimizado do que literais `Object`, especialmente quando o ficheiro JSON for grande.

A ativação disto desativa as importações nomeadas.

## esbuild {#esbuild}

- **Tipo:** `ESBuildOptions | false`

`ESBuildOptions` estende as [opções de transformação do próprio esbuild](https://esbuild.github.io/api/#transform-api). O caso de uso mais comum é a personalização de JSX:

```js
export default defineConfig({
  esbuild: {
    jsxFactory: 'h',
    jsxFragment: 'Fragment'
  }
})
```

Por padrão, a esbuild é aplicada aos ficheiros `ts`, `jsx`, `tsx`. Tu podes personalizar isto com `esbuild.include` e `esbuild.exclude`, o que pode ser uma expressão regular, um padrão [picomatch](https://github.com/micromatch/picomatch#globbing-features), ou um arranjo de ambos.

Além disto, também podes usar `esbuild.jsxInject` para injetar automaticamente importações auxiliares de JSX para cada ficheiro transformado pelo esbuild:

```js
export default defineConfig({
  esbuild: {
    jsxInject: `import React from 'react'`
  }
})
```

Quando [`build.minify`](./build-options.md#build-minify) for `true`, todas otimizações de minificação são aplicadas por padrão. Para desativar [certos aspetos](https://esbuild.github.io/api/#minify) dele, defina qualquer uma das opções `esbuild.minifyIdentifiers`, `esbuild.minifySyntax`, ou `esbuild.minifyWhitespace` para `false`. Nota que a opção `esbuild.minify` não pode ser usada para sobrepor o `build.minify`.

Defina para `false` para desativar as transformações da esbuild.

## assetsInclude {#assetsinclude}

- **Tipo:** `string | RegExp | (string | RegExp)[]`
- **Related:** [Manipulação de Recurso Estático](/guide/assets)

Especifica [padrões picomatch](https://github.com/micromatch/picomatch#globbing-features) adicionais para ser tratada como recursos estáticos para:

- Eles serem excluídos a partir da conduta de transformação de extensão quando referenciados a partir do HTML ou diretamente requisitados sobre `fetch` ou XHR.

- A importação deles a partir da JS retornará as suas sequências de caracteres de URL resolvidas (isto pode ser sobrescrito se tiveres uma extensão `enforce: 'pre'` para manipular o tipo de recurso de maneira diferente).

A lista de tipo de recurso embutido pode ser encontrada [aqui](https://github.com/vitejs/vite/blob/main/packages/vite/src/node/constants.ts).

**Exemplo:**

```js
export default defineConfig({
  assetsInclude: ['**/*.gltf']
})
```

## logLevel {#loglevel}

- **Tipo:** `'info' | 'warn' | 'error' | 'silent'`

Ajusta verbosidade da saída da consola. O padrão é `'info'`.

## clearScreen {#clearscreen}

- **Tipo:** `boolean`
- **Predefinido como:** `true`

Defina para `false` para impedir que a Vite de limpar o tela do terminal quando registares certas mensagens. Através da linha de comando, use `--clearScreen false`.

## envDir {#envdir}

- **Tipo:** `string`
- **Predefinido como:** `root`

O diretório a partir do qual os ficheiros `.env` são carregados. Pode ser um caminho absoluto, ou um caminho relativo a raiz do projeto.

Consulte [Ficheiros de Configuração do Ambiente](/guide/env-and-mode#env-files) para mais detalhes sobre ficheiros de ambiente.

## envPrefix {#envprefix}

- **Tipo:** `string | string[]`
- **Predefinido como:** `VITE_`

As variáveis de ambiente começando com `envPrefix` serão expostos ao código-fonte do teu cliente através de `import.meta.env`.

:::warning NOTAS DE SEGURANÇA
O `envPrefix` não deve ser definido como `''`, o que exporá todas as tuas variáveis de ambiente e causará fugas inesperadas de informações sensíveis. A Vite lançará um erro quando detetar `''`.
:::

## appType {#apptype}

- **Tipo:** `'spa' | 'mpa' | 'custom'`
- **Predefinido como:** `'spa'`

Se a tua aplicação for uma Aplicação de Página Único (SPA, sigla em Inglês), uma [Aplicação de Várias Páginas (MPA, sigla em Inglês)](../guide/build#multi-page-app), ou Aplicação Personalizada (SSR e abstrações com manipulação de HTML personalizada):


- `'spa'`: inclui intermediário de recuo de SPA e configura [sirv](https://github.com/lukeed/sirv) com `single: true` na pré-visualização
- `'mpa'`: apenas inclui intermediários de HTML aplicações que não são SPA
- `'custom'`: não inclui intermediários de HTML

Aprenda mais no [Guia de SSR](/guide/ssr#vite-cli) da Vite. Relacionado ao [`server.middlewareMode`](./server-options#server-middlewaremode).
