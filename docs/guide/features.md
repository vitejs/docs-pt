# Funcionalidades {#features}

No nível mais básico, o desenvolvimento usando a Vite não é diferente de usar um servidor de ficheiro estático. No entanto, a Vite fornece muitas otimizações sobre as importações nativas de Módulo de ECMAScript para suportar várias funcionalidades que são normalmente vistas nas configurações baseadas em empacotador.

## Resolução de Dependência de NPM e Pré-Empacotamento {#npm-dependency-resolving-and-pre-bundling}

As importações nativas da ECMAScript não suportam importações simples de módulo como o seguinte:

```js
import { someMethod } from 'my-dep'
```

O exemplo acima acionará um erro no navegador. A Vite detetará tais importações simples de módulo em todos os ficheiros do código-fonte servido e realizará o seguinte:

1. [Pré-empacotará](./dep-pre-bundling) os módulos para melhorar a velocidade do carregamento da página e converterá os módulos de CommonJS ou UMD em Módulo de ECMAScript. A etapa de pré-empacotamento é realizada com a [`esbuild`](http://esbuild.github.io/) e torna a inicialização fria da Vite significativamente mais rápida do que qualquer empacotador baseado na JavaScript.

2. Reescreverá as importações para URLs válidas como `/node_modules/.vite/deps/my-dep.js?v=f3sf2ebd` para que o navegador possa importá-los corretamente.

**As Dependências são Fortemente Armazenadas para Consulta Imediata**

A Vite armazena para consulta imediata as requisições de dependência através dos cabeçalhos de HTTP, assim se desejarmos editar ou depurar uma dependência localmente, devemos seguir os passos que estão [nesta ligação](./dep-pre-bundling#browser-cache).

## Substituição de Módulo Instantânea {#hot-module-replacement}

A Vite fornece uma [API de Substituição de Módulo Instantânea](./api-hmr) sobre o Módulo de ECMAScript nativo. As abstrações com as capacidades de substituição de módulo instantânea podem influenciar a API para fornecer atualizações precisas e instantâneas sem recarregar a página ou desperdiçar o estado da aplicação. A Vite fornece integrações de substituição de módulo instantânea de primeiro partido para os [Componentes de Ficheiro Único da Vue](https://github.com/vitejs/vite-plugin-vue/tree/main/packages/plugin-vue) e as [Atualizações Rápidas da React](https://github.com/vitejs/vite-plugin-react/tree/main/packages/plugin-react). Também existem integrações oficiais para a Preact através da [`@prefresh/vite`](https://github.com/JoviDeCroock/prefresh/tree/main/packages/vite).

Nota que não precisamos de as definir manualmente - quando [críamos uma aplicação através da `create-vite`](./), os modelos de projetos selecionados já teriam estes pré-configurados para nós.

## TypeScript {#typescript}

A Vite suporta a importação de ficheiros `.ts` fora da caixa.

### Apenas Tradução de Código {#transpile-only}

Nota que a Vite apenas realiza a tradução do código sobre os ficheiros `.ts` e **NÃO** realiza a verificação de tipo. Esta supõe que a verificação de tipo está sendo realizada pelo nosso ambiente de desenvolvimento integrado e processo de construção.

A motivo pela qual a Vite não realiza verificação de tipo como parte do processo de transformação é porque as duas tarefas funcionam fundamentalmente de maneiras diferentes. A tradução de código pode aperfeiçoar uma base por ficheiro e alinhar-se perfeitamente com modelo de compilação sob demanda da Vite. Comparativamente, a verificação de tipo exige conhecimento do gráfico de módulo inteiro. A introdução da verificação de tipo na conduta de transformação da Vite comprometerá inevitavelmente as vantagens de velocidade da Vite.

O trabalho da Vite é receber os módulos do nosso código-fonte duma maneira que possa executar no navegador o mais rápido possível. Para este fim, recomendamos separar as verificações da analise estática da conduta de transformação da Vite. Este princípio aplica-se às outras verificações da analise estática, como a ESLint.

- Para as construções de produção, podemos executar a `tsc --noEmit` em adição ao comando de construção da Vite.

- Durante o desenvolvimento, se precisarmos de mais do que as sugestões do ambiente de desenvolvimento integrado, recomendamos executar `tsc --noEmit --watch` num processo separado, ou usar [`vite-plugin-checker`](https://github.com/fi3ework/vite-plugin-checker) se preferirmos ter erros de tipo diretamente reportados no navegador.

A Vite usa a [`esbuild`](https://github.com/evanw/esbuild) para traduzir o código de TypeScript em JavaScript que é 20~30 vezes mais rápida do que a simples `tsc`, as atualizações da substituição de módulo instantânea podem refletir-se no navegador em menos de 50ms.

Usamos a sintaxe de [importações e exportações exclusivamente por tipo](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-8.html#type-only-imports-and-export) para evitar potenciais problemas como importações exclusivamente por tipo sendo incorretamente empacotadas, por exemplo:

```ts
import type { T } from 'only/types'
export type { T }
```

### Opções do Compilador da TypeScript {#typescript-compiler-options}

Alguns campos de configuração sob `compilerOptions` no `tsconfig.json` exigem atenção especial.

#### `isolatedModules` {#isolatedmodules}

- [Documentação da TypeScript](https://www.typescriptlang.org/tsconfig#isolatedModules)

Deve ser definida para `true`.

Isto porque a `esbuild` apenas realiza a tradução de código sem a informação do tipo, esta não suporta certas funcionalidades como enumerações constantes e importações exclusivamente por tipo implícitas.

Nós devemos definir `"isolatedModules": true` no nosso `tsconfig.json` sob a `compilerOptions`, para que a TypeScript avise-nos sobre as funcionalidade que não funcionam com a tradução de código isolada.

No entanto, algumas bibliotecas (por exemplo, a [`vue`](https://github.com/vuejs/core/issues/1228)) não funcionam bem com `"isolatedModules": true`. Nós podemos usar `"skipLibCheck": true` para suprimir temporariamente os erros até serem corrigidos corrente acima.

#### `useDefineForClassFields` {#usedefineforclassfields}

- [Documentação da TypeScript](https://www.typescriptlang.org/tsconfig#useDefineForClassFields)

Desde a Vite 2.5.0, o valor padrão será `true` se o alvo da TypeScript for a `ESNext` ou `ES2022` ou mais recente. Isto é consiste com o [comportamento da `tsc` 4.3.2 e adiante](https://github.com/microsoft/TypeScript/pull/42663). É também o comportamento de execução da ECMAScript padrão.

Os outros alvos da TypeScript predefinirão para `false`.

Mas pode ser contra-intuitivo para aqueles que vêm de outras linguagens de programação ou de versões mais antigas da TypeScript. Nós podemos ler mais sobre a transição nas [notas de lançamento da TypeScript 3.7](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html#the-usedefineforclassfields-flag-and-the-declare-property-modifier).

Se estivermos usando uma biblioteca que depende fortemente de campos da classe, temos que ter cuidado com o uso que a biblioteca tenciona dar-lhes.

Muitas bibliotecas esperam `"useDefineForClassFields": true`, tais como a [MobX](https://mobx.js.org/installation.html#use-spec-compliant-transpilation-for-class-properties).

Mas algumas bibliotecas ainda não fizeram a transição para este novo padrão, incluindo a [`lit-element`](https://github.com/lit/lit-element/issues/1030). Temos que definir explicitamente `useDefineForClassFields` para `false` nestes casos.

#### `target` {#target}

- [Documentação da TypeScript](https://www.typescriptlang.org/tsconfig#target)

A Vite não traduz o código da TypeScript com o valor de `target` configurado por padrão, seguindo o mesmo comportamento que a `esbuild`.

A opção [`esbuild.target`](/config/shared-options#esbuild) pode ser usada, a qual predefine para `esnext` para tradução de código minimalista. Nas construções, a opção [`build.target`](/config/build-options#build-target) tem maior prioridade e também pode ser definida se necessário.

:::warning `useDefineForClassFields`
Se `target` não for `ESNext` ou `ES2022` ou mais recente, ou se não existir nenhum ficheiro `tsconfig.json`, `useDefineForClassFields` predefinirá para `false` o que pode ser problemático com o valor padrão de `esbuild.target` de `esnext`. Esta pode traduzir o código para [blocos de inicialização estática](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Static_initialization_blocks#browser_compatibility) que pode não ser suportado no nosso navegador.

Como tal, é recomendado definir `target` para `ESNext` ou `ES2022` ou mais recente, ou definir `useDefineForClassFields` para `true` explicitamente quando configuramos o `tsconfig.json`.
:::

#### Outras Opções do Compilador que Afetam o Resultado da Construção {#other-compiler-options-affecting-the-build-result}

- [`extends`](https://www.typescriptlang.org/tsconfig#extends)
- [`importsNotUsedAsValues`](https://www.typescriptlang.org/tsconfig#importsNotUsedAsValues)
- [`preserveValueImports`](https://www.typescriptlang.org/tsconfig#preserveValueImports)
- [`verbatimModuleSyntax`](https://www.typescriptlang.org/tsconfig#verbatimModuleSyntax)
- [`jsx`](https://www.typescriptlang.org/tsconfig#jsx)
- [`jsxFactory`](https://www.typescriptlang.org/tsconfig#jsxFactory)
- [`jsxFragmentFactory`](https://www.typescriptlang.org/tsconfig#jsxFragmentFactory)
- [`jsxImportSource`](https://www.typescriptlang.org/tsconfig#jsxImportSource)
- [`experimentalDecorators`](https://www.typescriptlang.org/tsconfig#experimentalDecorators)
- [`alwaysStrict`](https://www.typescriptlang.org/tsconfig#alwaysStrict)

:::tip `skipLibCheck`
Os modelos de projeto iniciais da Vite têm `"skipLibCheck": "true"` por padrão para evitar dependências de verificação de tipo, uma vez que podem escolher apenas suportar versões e configurações específicas de TypeScript. Nós podemos aprender mais em [`vuejs/vue-cli#5688`](https://github.com/vuejs/vue-cli/pull/5688).
:::

### Tipos de Clientes {#client-types}

Os tipos padrão da Vite são para a sua API de Node.js. Para ajustar o ambiente de código do lado do cliente numa aplicação de Vite, adicionamos um ficheiro de declaração `d.ts`:

```typescript
/// <reference types="vite/client" />
```

Alternativamente, podemos adicionar `vite/client` à `compilerOptions.types` dentro do nosso `tsconfig.json`:

```json
{
  "compilerOptions": {
    "types": ["vite/client"]
  }
}
```

Isto fornecerá os seguintes ajustes de tipo:

- Importações de recurso (por exemplo, importação dum ficheiro `.svg`)
- Tipos para as [variáveis de ambiente](./env-and-mode#env-variables) injetadas pela Vite sobre a `import.meta.env`
- Tipos para a [API de Substituição de Módulo Instantânea](./api-hmr) sobre a `import.meta.hot`

:::tip DICA
Para sobrepor a tipificação padrão, adicionamos um ficheiro de declaração de tipo que contém as nossas tipificações. Então, adicionamos a referência de tipo antes de `vite/client`.

Por exemplo, para fazer a importação padrão dum componente `*.svg` de React:

- `vite-env-override.d.ts` (o ficheiro que contém as nossas tipificações):

 ```ts
  declare module '*.svg' {
    const content: React.FC<React.SVGProps<SVGElement>>
    export default content
  }
  ```

- O ficheiro contendo a referência para `vite/client`:

  ```ts
  /// <reference types="./vite-env-override.d.ts" />
  /// <reference types="vite/client" />
  ```

:::

## Vue {#vue}

A Vite fornece suporte de Vue de primeira classe:

- Suporte de Componente de Ficheiro Único de Vue 3 através de [`@vitejs/plugin-vue`](https://github.com/vitejs/vite-plugin-vue/tree/main/packages/plugin-vue)
- Suporte de Extensão de Sintaxe de JavaScript de Vue 3 através de [`@vitejs/plugin-vue-jsx`](https://github.com/vitejs/vite-plugin-vue/tree/main/packages/plugin-vue-jsx)
- Suporte de Componente de Ficheiro Único de Vue 2.7 através de [`@vitejs/plugin-vue2`](https://github.com/vitejs/vite-plugin-vue2)
- Suporte de Extensão de Sintaxe de JavaScript de Vue 2.7 através de [`@vitejs/plugin-vue2-jsx`](https://github.com/vitejs/vite-plugin-vue2-jsx)

## JSX {#jsx}

O ficheiros `.jsx` e `.tsx` também são suportados fora da caixa. A tradução de código de JSX também é manipulada através da [`esbuild`](https://esbuild.github.io).

Os utilizadores da Vue devem usar a extensão [`@vitejs/plugin-vue-jsx`](https://github.com/vitejs/vite-plugin-vue/tree/main/packages/plugin-vue-jsx) oficial, a qual fornece funcionalidades especificas incluindo a substituição de módulo instantânea, resolução de componente global, diretivas e ranhuras.

Se não estivermos usando a JSX com a React ou Vue, `jsxFactory` e `jsxFragment` personalizados podem ser configurados usando a [opção `esbuild`](/config/shared-options#esbuild). Por exemplo, para a Preact:

```js
// vite.config.js
import { defineConfig } from 'vite'

export default defineConfig({
  esbuild: {
    jsxFactory: 'h',
    jsxFragment: 'Fragment',
  },
})
```

Mais detalhes na [documentação da esbuild](https://esbuild.github.io/content-types/#jsx).

Nós podemos injetar os auxiliares de JSX usando `jsxInject` (que é uma opção apenas de Vite) para evitar as importações manuais:

```js
// vite.config.js
import { defineConfig } from 'vite'

export default defineConfig({
  esbuild: {
    jsxInject: `import React from 'react'`,
  },
})
```

## CSS {#css}

A importação de ficheiros `.css` injetará o seu conteúdo para a página através dum marcador `<style>` com suporte a substituição de módulo instantânea.

### Incorporação e Rebaseamento de `@import` {at-import-inlining-and-rebasing}

A Vite está pré-configurada para suportar a incorporação de `@import` de CSS através de `postcss-import`. Os pseudónimos de Vite também são respeitados para `@import` de CSS. Além disto, todas referências de `url()` de CSS, mesmo se os ficheiros importados estiverem em diretórios diferentes, são sempre automaticamente rebaseados para garantir a correção.

Os pseudónimos `@import` e o rebaseamento de URL também são suportados para os ficheiros de Sass e Less (consulte [Pré-processadores de CSS](#css-pre-processors)).

### PostCSS {#postcss}

Se o projeto contiver configuração de PostCSS válida (qualquer formato suportado por [`postcss-load-config`](https://github.com/postcss/postcss-load-config), por exemplo, `postcss.config.js`), será automaticamente aplicado a todas as CSS importadas.

Nota que a minimização de CSS será executada depois da PostCSS e usará a opção [`build.cssTarget`](/config/build-options#build-csstarget).

### Módulos de CSS {#css-modules}

Qualquer ficheiro de CSS terminando com `.module.css` é considerado um [ficheiro dos módulos de CSS](https://github.com/css-modules/css-modules). A importação de tal ficheiro retornará o objeto do módulo correspondente:

```css
/* example.module.css */
.red {
  color: red;
}
```

```js
import classes from './example.module.css'
document.getElementById('foo').className = classes.red
```

O comportamento dos módulos de CSS pode ser configurado através da [opção `css.modules`](/config/shared-options#css-modules).

Se `css.modules.localsConvention` for definido para ativar locais de `camelCase` (por exemplo, `localsConvention: 'camelCaseOnly'`), também podemos usar as importações nomeadas:

```js
// .apply-color -> applyColor
import { applyColor } from './example.module.css'
document.getElementById('foo').className = applyColor
```

### Pré-processadores de CSS {#css-pre-processors}

Uma vez que a Vite dirige-se apenas aos navegadores modernos, é recomendado usar as variáveis de CSS nativa com as extensões de PostCSS que implementam os rascunhos do Grupo de Trabalho da CSS (por exemplo, [`postcss-nesting`](https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-nesting)) e escrever CSS simples e em conformidade com os futuros padrões.

Com isto dito, a Vite fornece suporte embutido para os ficheiros `.scss`, `.sass`, `.less`, `.styl` e `.stylus`. Não existe necessidade de instalar extensões específicas de Vite para estes, mas o próprio pré-processador correspondente deve estar instalado:

```bash
# .scss e .sass
npm add -D sass

# .less
npm add -D less

# .styl e .stylus
npm add -D stylus
```

Se estivermos usando os componentes de ficheiro único da Vue, isto também ativa automaticamente `<style lang="sass">` e outros.

A Vite melhora a resolução de `@import` para Sass e Less para que os pseudónimos da Vite também sejam respeitados. Além disto, as referências da `url()` relativa dentro dos ficheiros de Sass ou Less importados que estão em diretórios diferentes a partir do ficheiro de raiz também são rebaseados automaticamente para garantir a correção.

O pseudónimo de `@import` e o rebaseamento da URL não são suportados para a Stylus por causa das restrições da sua API.

Nós também podemos usar os módulos de CSS combinados com os pré-processadores anexando `.module` à extensão do ficheiro, por exemplo, `style.module.scss`.

### Desativando a Injeção de CSS na Página {#disabling-css-injection-into-the-page}

A injeção automática dos conteúdos da CSS pode ser desligada através do parâmetro de consulta `?inline`. Neste caso, a sequência de caracteres da CSS processada é retornada como exportação padrão do modulo como de costume, mas os estilos não são injetados na página:

```js
import './foo.css' // será injetado na página
import otherStyles from './bar.css?inline' // não será injetado
```

:::tip NOTA
As importações padrão e nomeadas de ficheiros de CSS (por exemplo, `import style from './foo.css'`) foram removidas desde a Vite 5. Use a consulta `?inline`.
:::

## CSS Relâmpago {#lightning-css}

Desde a versão 4.4 da Vite, existe suporte experimental para a [CSS Relâmpago](https://lightningcss.dev/). Nós podemos optar por testa opção adicionando [`css.transformer: 'lightningcss'`](../config/shared-options#css-transformer) ao nosso ficheiro de configuração e instalar a dependência opcional [`lightningcss`](https://www.npmjs.com/package/lightningcss):

```bash
npm add -D lightningcss
```

Se for ativada, os ficheiros de CSS serão processados pela CSS Relâmpago no lugar da PostCSS. Para configurá-la, podemos passar as opções da CSS Relâmpago à opção de configuração [`css.lightingcss`](../config/shared-options#css-lightningcss).

Para configurar os Módulos de CSS, usaremos a [`css.lightningcss.cssModules`](https://lightningcss.dev/css-modules.html) no lugar da [`css.modules`](/config/shared-options#css-modules) (que configura a maneira que a PostCSS manipula os módulos de CSS).

Por padrão, a Vite usa a `esbuild` para minimizar a CSS. A CSS Relâmpago também pode ser usada como minimizadora de CSS com a [`build.cssMinify: 'lightningcss'`](../config/build-options#build-cssminify).

:::tip NOTA
Os [pré-processadores de CSS](#css-pre-processors) não são suportados quando usamos a CSS relâmpago.
:::

## Recursos Estáticos {#static-assets}

A importação dum recurso estático retornará a URL pública resolvida quando esta for servida:

```js
import imgUrl from './img.png'
document.getElementById('hero-img').src = imgUrl
```

As consultas especiais podem modificar como os recursos são carregados:

```js
// Carregar explicitamente os recursos como URL
import assetAsURL from './asset.js?url'
```

```js
// Carregar os recursos como sequências de caracteres
import assetAsString from './shader.glsl?raw'
```

```js
// Carregar os Operadores da Web
import Worker from './worker.js?worker'
```

```js
// Operadores da Web embutidos como sequências
// de caracteres de base64 no momento da construção
import InlineWorker from './worker.js?worker&inline'
```

Mais detalhes na [Manipulação de Recurso Estático](/guide/assets).

## JSON {#json}

Os ficheiros de JSON podem ser importados diretamente - importações nomeadas também são suportadas:

```js
// importar o objeto inteiro
import json from './example.json'
// importar um campo de raiz como exportação nomeada -
// ajuda com agitação da árvore!
import { field } from './example.json'
```

## Importação de Globo {#glob-import}

A Vite suporta a importação de vários módulos a partir do sistema de ficheiro através da função especial `import.meta.glob`:

```js
const modules = import.meta.glob('./dir/*.js')
```

O código acima será transformado no seguinte:

```js
// código produzido pela vite
const modules = {
  './dir/foo.js': () => import('./dir/foo.js'),
  './dir/bar.js': () => import('./dir/bar.js'),
}
```

Nós podemos então iterar sobre as chaves do objeto `modules` para acessar os módulos correspondentes:

```js
for (const path in modules) {
  modules[path]().then((mod) => {
    console.log(path, mod)
  })
}
```

Os ficheiros correspondidos são por padrão carregados preguiçosamente através da importação dinâmica e serão divididos em pedaços separados durante a construção. Se preferirmos importar todos os módulos diretamente (por exemplo, dependendo dos efeitos colaterais nestes módulos para serem aplicados primeiro), podemos passar `{ eager: true }` como segundo argumento:

```js
const modules = import.meta.glob('./dir/*.js', { eager: true })
```

O código acima será transformado no seguinte:

```js
// código produzido pela vite
import * as __glob__0_0 from './dir/foo.js'
import * as __glob__0_1 from './dir/bar.js'
const modules = {
  './dir/foo.js': __glob__0_0,
  './dir/bar.js': __glob__0_1,
}
```

### Importação de Globo Como {#glob-import-as}

A `import.meta.glob` também suporta a importação de ficheiros como sequências de caracteres (semelhante a [Importação de Recurso como Sequência de Caracteres](/guide/assets#importing-asset-as-string)) com a sintaxe de [Reflexão de Importação](https://github.com/tc39/proposal-import-reflection):

```js
const modules = import.meta.glob('./dir/*.js', { as: 'raw', eager: true })
```

O código acima será transformado no seguinte:

```js
// código produzido pela vite
const modules = {
  './dir/foo.js': 'export default "foo"\n',
  './dir/bar.js': 'export default "bar"\n',
}
```

`{ as: 'url' }` também é suportado para carregar os recursos como URLs.

### Padrões Múltiplos {#multiple-patterns}

O primeiro argumento pode ser um vetor de globos, por exemplo:

```js
const modules = import.meta.glob(['./dir/*.js', './another/*.js'])
```

### Padrões Negativos {#negative-patterns}

Os padrões de globo negativo também são suportados (prefixados por `!`). Para ignorar alguns ficheiros a partir do resultado, podemos adicionar padrões de globo de exclusão ao primeiro argumento:

```js
const modules = import.meta.glob(['./dir/*.js', '!**/bar.js'])
```

```js
// código produzido pela vite
const modules = {
  './dir/foo.js': () => import('./dir/foo.js'),
}
```

#### Importações Nomeadas {#named-imports}

É possível importar apenas as partes dos módulos com as opções de `import`:

```ts
const modules = import.meta.glob('./dir/*.js', { import: 'setup' })
```

```ts
// código produzido pela vite
const modules = {
  './dir/foo.js': () => import('./dir/foo.js').then((m) => m.setup),
  './dir/bar.js': () => import('./dir/bar.js').then((m) => m.setup),
}
```

Quando combinada com `eager` é possível até mesmo ter a agitação da árvore ativada para estes módulos:

```ts
const modules = import.meta.glob('./dir/*.js', {
  import: 'setup',
  eager: true,
})
```

```ts
// código produzido pela vite
import { setup as __glob__0_0 } from './dir/foo.js'
import { setup as __glob__0_1 } from './dir/bar.js'
const modules = {
  './dir/foo.js': __glob__0_0,
  './dir/bar.js': __glob__0_1,
}
```

Definimos `import` como `default` para importarmos a exportação padrão:

```ts
const modules = import.meta.glob('./dir/*.js', {
  import: 'default',
  eager: true,
})
```

```ts
// código produzido pela vite
import __glob__0_0 from './dir/foo.js'
import __glob__0_1 from './dir/bar.js'
const modules = {
  './dir/foo.js': __glob__0_0,
  './dir/bar.js': __glob__0_1,
}
```

#### Consultas Personalizadas {#custom-queries}

Nós também podemos usar a opção `query` para fornecer consultas personalizadas às importações para as outras extensões consumirem:

```ts
const modules = import.meta.glob('./dir/*.js', {
  query: { foo: 'bar', bar: true },
})
```

```ts
// código produzido pela vite
const modules = {
  './dir/foo.js': () => import('./dir/foo.js?foo=bar&bar=true'),
  './dir/bar.js': () => import('./dir/bar.js?foo=bar&bar=true'),
}
```

### Advertências sobre a Importação de Globos {#glob-import-caveats}

Nota que:

- Isto é uma funcionalidade exclusiva da Vite e não é um padrão da Web ou ECMAScript.
- Os padrões de globos são tratados como especificadores de importação: estes devem ser relativos (começam com `/`) ou absolutos (começam com `/`, resolvidos em relação à raiz do projeto) ou um caminho de pseudónimo (consultar a [opção `resolve.alias`](/config/shared-options#resolve-alias)).
- A correspondência do globo é feita através da [`fast-glob`](https://github.com/mrmlnc/fast-glob) - consultar a documentação por [padrões de globos suportados](https://github.com/mrmlnc/fast-glob#pattern-syntax).
- Nós também devemos estar cientes de que todos os argumentos na `import.meta.glob` devem ser **passados como literais**. Nós NÃO podemos usar variáveis ou expressões nelas.

## Importação Dinâmica {#dynamic-import}

Semelhante à [importação de globo](#glob-import), a Vite também suporta a importação dinâmica com variáveis:

```ts
const module = await import(`./dir/${file}.js`)
```

Nota que as variáveis apenas representa nomes de ficheiros a um nível de profundidade. Se `file` for `'foo/bar'`, a importação falharia. Para uso mais avançado, podemos usar a [importação de globo](#glob-import).

## WebAssembly {#webassembly}

Os ficheiros `.wasm` pré-compilados podem ser importados com `?init`. A exportação padrão será uma função de inicialização que retorna uma promessa da [`WebAssembly.Instance`](https://developer.mozilla.org/en-US/docs/WebAssembly/JavaScript_interface/Instance):

```js
import init from './example.wasm?init'

init().then((instance) => {
  instance.exports.test()
})
```

A função de inicialização também pode receber um `importObject` que é passado para [`WebAssembly.instantiate`](https://developer.mozilla.org/en-US/docs/WebAssembly/JavaScript_interface/instantiate) como seu segundo argumento:

```js
init({
  imports: {
    someFunc: () => {
      /* ... */
    },
  },
}).then(() => {
  /* ... */
})
```

Na construção de produção, os ficheiros `.wasm` mais pequenos do que o `assetInlineLimit` serão embutidos como sequências de caracteres de base64. De outro modo, serão tratados como [recurso estático](./assets) e requisitados sob demanda.

:::tip NOTA
[Proposta de Integração do Módulo de ECMAScript para a WebAssembly](https://github.com/WebAssembly/esm-integration) não é atualmente suportada. Use [`vite-plugin-wasm`](https://github.com/Menci/vite-plugin-wasm) ou outras extensões da comunidade para lidar com isto.
:::

### Acessando o Módulo de WebAssembly {#accessing-the-webassembly-module}

Se precisarmos de acesso ao objeto `Module`, por exemplo, para o instanciar várias vezes, usamos uma [importação explícita de URL](/guide/assets#explicit-url-imports) para resolver o recurso, e depois executamos a instanciação:

```js
import wasmUrl from 'foo.wasm?url'

const main = async () => {
  const responsePromise = fetch(wasmUrl)
  const { module, instance } =
    await WebAssembly.instantiateStreaming(responsePromise)
  /* ... */
}

main()
```

### Requisitando o Módulo na Node.js {#fetching-the-module-in-node-js}

Na interpretação do lado do servidor, a `fetch()` acontecendo como parte da importação `?init`, pode falhar com `TypeError: Invalid URL`. Consultar a questão [Suportar `wasm` na Interpretação do Lado do Servidor](https://github.com/vitejs/vite/issues/8882).

Eis uma alternativa, assumindo que a base do projeto é o diretório atual:

```js
import wasmUrl from 'foo.wasm?url'
import { readFile } from 'node:fs/promises'

const main = async () => {
  const resolvedUrl = (await import('./test/boot.test.wasm?url')).default
  const buffer = await readFile('.' + resolvedUrl)
  const { instance } = await WebAssembly.instantiate(buffer, {
    /* ... */
  })
  /* ... */
}

main()
```

## Operários da Web {#web-workers}

### Importações com Construtores {#import-with-constructors}

Um programa de operário da Web pode ser importado usando [`new Worker()`](https://developer.mozilla.org/en-US/docs/Web/API/Worker/Worker) e [`new SharedWorker()`](https://developer.mozilla.org/en-US/docs/Web/API/SharedWorker/SharedWorker). Comparado aos sufixos do operário, esta sintaxe aproxima-se mais dos padrões e é a maneira **recomendada** para criar os operários:

```ts
const worker = new Worker(new URL('./worker.js', import.meta.url))
```

O construtor do operário também aceita opções, que podem ser usadas para criar operários de "módulo":

```ts
const worker = new Worker(new URL('./worker.js', import.meta.url), {
  type: 'module',
})
```

A deteção do operário apenas funcionará se o construtor `new URL()` for usado diretamente dentro da declaração `new Worker()`. Adicionalmente, todos os parâmetros de opções devem ser valores estáticos (isto é, literais de sequência de caracteres).

### Importações com Sufixos de Consulta {#import-with-query-suffixes}

Um programa de operário da Web pode ser importado diretamente adicionando `?worker` ou `?sharedworker` à requisição da importação. A exportação padrão será um construtor personalizado de operário:

```js
import MyWorker from './worker?worker'

const worker = new MyWorker()
```

O programa do operário também pode usar declarações de `import` no lugar da `importScripts()`. **Nota**: durante o desenvolvimento isto depende do [suporte nativo do navegador](https://caniuse.com/?search=module%20worker), mas para a construção de produção é compilado ao longe.

Por padrão, o programa do operário será emitido como um pedaço separado na construção de produção. Se desejamos embutir o operário como sequências de caracteres de base64, adicionamos a consulta `inline`:

```js
import MyWorker from './worker?worker&inline'
```

Se desejamos recuperar o operário como uma URL, adicionamos a consulta `url`:

```js
import MyWorker from './worker?worker&url'
```

Consultar as [Opções do Operário](/config/worker-options) por detalhes sobre a configuração do empacotamento de todos os operários.

## Otimizações da Construção {#build-optimizations}

> As funcionalidades listadas abaixo são aplicadas automaticamente como parte do processo de construção e não existe necessidade para configuração explícita a menos que queiramos desativá-las.

### Separação de Código de CSS {#css-code-splitting}

A Vite extrai automaticamente a CSS usada pelos módulos num pedaço assíncrono e gera um ficheiro separado para esta. O ficheiro da CSS é carregado automaticamente através dum marcador `<link>` quando o pedaço assíncrono associado for carregado, e o pedaço assíncrono tiver a garantia de ser apenas avaliado depois da CSS for carregada para evitar a [Intermitência do Conteúdo Não Estilizado](https://en.wikipedia.org/wiki/Flash_of_unstyled_content#:~:text=A%20flash%20of%20unstyled%20content,before%20all%20information%20is%20retrieved.).

Se preferirmos ter todas as CSS extraídas num único ficheiro, podemos desativar a separação do código de CSS definindo a [`build.cssCodeSplit`](/config/build-options#build-csscodesplit) para `false`.

### Geração de Diretivas de Pré-Carregamento {#preload-directives-generation}

A Vite gera automaticamente as diretivas `<link rel="modulepreload">` para os pedaços de entrada e suas importações diretas no HTML construído.

### Otimização do Carregamento do Pedaço Assíncrono {#async-chunk-loading-optimization}

Nas aplicações do mundo real, a Rollup muitas vezes gera os pedaços "comuns" - o código que é partilhado entre dois ou mais outros pedaços. Combinado com as importações dinâmicas, é muito comum ter o seguinte cenário:

<script setup>
import graphSvg from '../images/graph.svg?raw'
</script>
<svg-image :svg="graphSvg" />

Nos cenários não otimizados, quando o pedaço assíncrono `A` for importado, o navegador precisará requisitar e analisar sintaticamente a `A` antes de poder compreender que também precisa do pedaço comum `C`. Isto resulta numa viagem adicional de ida e volta na rede:

```
Entry ---> A ---> C
```

A Vite reescreve automaticamente as chamadas de importação dinâmica da separação de código com uma etapa de pré-carregamento para que quando `A` for requisitado, `C` seja requisitado **em paralelo**:

```
Entry ---> (A + C)
```

É possível para `C` ter importações adicionais, que resultarão em mais viagens de ida e volta no cenário não otimizado. A otimização da Vite rastreará todas as importações diretas para eliminar completamente as viagens de ida e volta independentemente da profundidade da importação.
