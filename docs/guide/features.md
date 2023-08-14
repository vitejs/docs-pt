# Funcionalidades {#features}

No nível mais básico, o desenvolvimento utilizando a Vite não é tão diferente da utilização de um servidor de ficheiro estático. No entanto, a Vite fornece muitas otimizações sobre as importações de ESM nativa para suportar várias funcionalidades que são normalmente vistas em configurações baseada em empacotador.

## Resolução de Dependência de NPM e Pré-Empacotamento {#npm-dependency-resolving-and-pre-bundling}

As importações de ECMAScript nativas não suportam importações simples de módulo com a seguinte:

```js
import { someMethod } from 'my-dep'
```

O exemplo acima lançará um erro no navegador. A Vite detetará tais importações simples de módulo em todos os ficheiros de fonte servidos e realizará o seguinte:

1. [Pré-empacota](./dep-pre-bundling)-os para melhorar a velocidade de carregamento da página e converte módulos CommonJS / UMD para ESM. A etapa de pré-empacotamento é realizada com [esbuild](http://esbuild.github.io/) e torna o tempo de início frio da Vite significativamente mais rápido do que qualquer empacotador baseado em JavaScript.

2. Reescreve as importações para URLs válidas como `/node_modules/.vite/deps/my-dep.js?v=f3sf2ebd` para que o navegador possa importá-los apropriadamente.

**As Dependências são Fortemente Cacheadas**

A Vite cacheia as requisições de dependências através de cabeçalhos de HTTP, então se desejares editar ou depurar localmente uma dependência, siga as etapas [aqui](./dep-pre-bundling#cache-do-navegador).

## Substituição de Módulo Instantânea {#hot-module-replacement}

A Vite fornece uma [API de HMR](./api-hmr) sobre o ESM nativo. As abstrações com compatibilidades de HMR podem influenciar a API para fornecer atualizações precisas e instantâneas sem o recarregamento da página ou sem matar o estado da aplicação. A Vite oferece integrações de HMR de primeira classe para [Componentes de Ficheiro Único de Vue](https://github.com/vitejs/vite-plugin-vue/tree/main/packages/plugin-vue) e [Atualização Rápida de React](https://github.com/vitejs/vite-plugin-react/tree/main/packages/plugin-react). Existem também integrações oficiais para Preact através do [@prefresh/vite](https://github.com/JoviDeCroock/prefresh/tree/main/packages/vite).

Nota que não precisas de manualmente definir estes - quando [criares uma aplicação através de `create-vite`](./), os modelos selecionados já teriam estes pré-configurados para ti.

## TypeScript {#typescript}

A Vite suporta a importação de ficheiros `.ts` fora da caixa.

### Tradução de Código Apenas {#transpile-only}

Nota que a Vite apenas realiza a tradução de código sobre os ficheiros `.ts` e **NÃO** realiza a verificação de tipo. Ela presume que a verificação de tipo está sendo cuidada pela tua IDE e processo de construção.

A razão da Vite não realizar a verificação de tipo como parte do processo de transformação é porque estes dois trabalhos funcionam fundamentalmente de maneiras diferentes. A tradução de código pode funcionar sobre uma base por ficheiro e alinha perfeitamente com modelo de compilação sobre demanda da Vite. Em comparação, a verificação de tipo requer conhecimento do grafo do módulo inteiro. Calçar a verificação de tipo em uma conduta de transformação da Vite inevitavelmente comprometerá os benefícios de velocidade da Vite.

O trabalho da Vite é receber os módulos do teu código-fonte em uma forma que possa executar no navegador o mais rápido possível. Para este fim, recomendamos separar as verificações de analises estáticas da conduta de transformação da Vite. Este princípio aplica-se aos outros verificadores de analises estáticas tais como ESLint.

- Para as construções de produção, podes executar `tsc --noEmit` em adição ao comando de construção `build` da Vite.

- Durante o desenvolvimento, se precisares de mais do que as sugestões da IDE, recomendamos executar `tsc --noEmit --watch` em um processo separado, ou usar [vite-plugin-checker](https://github.com/fi3ework/vite-plugin-checker) se preferires ter erros de tipo diretamente reportados no navegador.

A Vite usa a [esbuild](https://github.com/evanw/esbuild) para traduzir o código de TypeScript para JavaScript o qual é 20~30x mais rápido do que o `tsc` puro, as atualizações de HMR podem refletir no navegador em menos de 50ms.

Use a sintaxe de [Importações e Exportações de Tipo Apenas](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-8.html#type-only-imports-and-export) para evitar potenciais problemas tal como importações de tipo apenas sendo incorretamente empacotada, por exemplo:

```ts
import type { T } from 'only/types'
export type { T }
```

### Opções do Compilador da TypeScript {#typescript-compiler-options}

Alguns campos de configuração sob `compilerOptions` no `tsconfig.json` exige especial atenção.

#### `isolatedModules` {#isolatedmodules}

Deve ser definido para `true`.

É porque `esbuild` só realiza tradução de código sem informação de tipo, ela não suporta certas funcionalidades tais como importações implícitas de apenas tipo, constantes e enumerações.

Tu deves definir `"isolatedModules": true` no teu `tsconfig.json` sob `compilerOptions`, assim a TypeScript alertar-te-á contra as funcionalidades que não funcionam com a tradução de código isolada.

No entanto, algumas bibliotecas (por exemplo, a [`vue`](https://github.com/vuejs/core/issues/1228)) não funciona bem com `"isolatedModules": true`. Tu podes utilizar `"skipLibCheck": true` para suprimir temporariamente os erros até ser corrigido corrente acima.

#### `useDefineForClassFields` {#usedefineforclassfields}

A partir da Vite 2.5.0, o valor padrão será `true` se o alvo de TypeScript for `ESNext` ou `ES2022` ou mais recente. É consistente com o [comportamento da `tsc` 4.3.2 e adiante](https://github.com/microsoft/TypeScript/pull/42663). É também o comportamento de tempo de execução da ECMASCript padrão.

Mas pode ser contra-intuitivo para aqueles chegando de outras linguagens de programação ou versões antigas da TypeScript.
Tu podes ler mais a respeito da transição nas [notas de lançamento da TypeScript 3.7](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html#the-usedefineforclassfields-flag-and-the-declare-property-modifier).

Se estiveres a utilizar uma biblioteca que depende fortemente de campos de classe, por favor seja cuidadoso a respeito da utilização tencionada da biblioteca dela.

Muitas bibliotecas esperam `"useDefineForClassFields": true`, tais como [MobX](https://mobx.js.org/installation.html#use-spec-compliant-transpilation-for-class-properties).

Mas algumas bibliotecas não transitaram para este novo padrão ainda, incluindo [`lit-element`](https://github.com/lit/lit-element/issues/1030). Por favor defina explicitamente `useDefineForClassFields` para `false` nestes casos.

#### Outras Opções do Compilador Afetando o Resultado da Construção {#other-compiler-options-affecting-the-build-result}

- [`extends`](https://www.typescriptlang.org/tsconfig#extends)
- [`importsNotUsedAsValues`](https://www.typescriptlang.org/tsconfig#importsNotUsedAsValues)
- [`preserveValueImports`](https://www.typescriptlang.org/tsconfig#preserveValueImports)
- [`jsxFactory`](https://www.typescriptlang.org/tsconfig#jsxFactory)
- [`jsxFragmentFactory`](https://www.typescriptlang.org/tsconfig#jsxFragmentFactory)

Se a migração da tua base de código para `"isolatedModules": true` for um esforço insuperável, talvez sejas capaz de dar a volta a isto com uma extensão de terceiro tal como [rollup-plugin-friendly-type-imports](https://www.npmjs.com/package/rollup-plugin-friendly-type-imports). No entanto, esta abordagem não é oficialmente suportada pela Vite.

### Tipos de Clientes {#client-types}

Os tipos padrão da Vite são para a sua API de Node.js. Para calçar o ambiente de código do lado do cliente em uma aplicação de Vite, adicione um ficheiro de declaração `d.ts`:

```typescript
/// <reference types="vite/client" />
```

Alternativamente, podes adicionar `vite/client` ao `compilerOptions.types` dentro do teu `tsconfig.json`:

```json
{
  "compilerOptions": {
    "types": ["vite/client"]
  }
}
```

Isto fornecerá os seguintes calçados de tipo:


- Importações de recurso (por exemplo, importação de um ficheiro `.svg`)
- Tipos para [variáveis de ambiente](./env-and-mode#env-variables) injetadas para Vite sobre a `import.meta.env`
- Tipos para a [API de HMR](./api-hmr) sobre a `import.meta.hot`

:::tip Dica
Para sobrepor a tipagem padrão, adicione um ficheiro de declaração de tipo que contém os teus tipos. Então adicione a referência do tipo antes de `vite/client`.

Por exemplo, para fazer a importação padrão de um componente `*.svg` de React:

- `vite-env-override.d.ts` (o ficheiro que contém as tuas tipos):

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

A Vite fornece suporte a Vue de primeira classe:

- Suporte ao Componente de Ficheiro Único de Vue 3 através de [@vitejs/plugin-vue](https://github.com/vitejs/vite-plugin-vue/tree/main/packages/plugin-vue)
- Suporte a Extensão de Sintaxe de JavaScript de Vue 3 através de [@vitejs/plugin-vue-jsx](https://github.com/vitejs/vite-plugin-vue/tree/main/packages/plugin-vue-jsx)
- Suporte ao Componente de Ficheiro Único de Vue 2.7 através de [@vitejs/plugin-vue2](https://github.com/vitejs/vite-plugin-vue2)
- Suporte a Extensão de Sintaxe de JavaScript de Vue 2.7 através de [@vitejs/vite-plugin-vue2-jsx](https://github.com/vitejs/vite-plugin-vue2-jsx)

## JSX {#jsx}

O ficheiros `.jsx` e `.tsx` são também suportados fora da caixa. A tradução de código JSX é também manipulada através da [esbuild](https://esbuild.github.io).

Os utilizadores de Vue devem utilizar a extensão [@vitejs/plugin-vue-jsx](https://github.com/vitejs/vite-plugin-vue/tree/main/packages/plugin-vue-jsx) oficial, a qual fornece funcionalidades especificas incluindo a HMR, resolução de componente global, diretivas e ranhuras.

Se não estiveres a utilizar a JSX com a React ou Vue, Os `jsxFactory` e `jsxFragment` personalizados podem ser configurados utilizando a [opção `esbuild`](/config/shared-options.md#esbuild). Por exemplo para a Preact:

```js
// vite.config.js
import { defineConfig } from 'vite'

export default defineConfig({
  esbuild: {
    jsxFactory: 'h',
    jsxFragment: 'Fragment'
  }
})
```

Mais detalhes na [documentação da esbuild](https://esbuild.github.io/content-types/#jsx).

Tu podes injetar os auxiliares de JSX utilizando `jsxInject` (que é uma opção apenas de Vite) para evitar importações manuais:

```js
// vite.config.js
import { defineConfig } from 'vite'

export default defineConfig({
  esbuild: {
    jsxInject: `import React from 'react'`
  }
})
```

## CSS {#css}

A importação de ficheiros `.css` injetarão o seu conteúdo para a página através de um marcador `<style>` com suporte a HMR. Tu podes também recuperar a CSS processada como uma sequência de caracteres como a exportação padrão do módulo.

### Incorporação e Rebaseamento de `@import` {at-import-inlining-and-rebasing}

A Vite está pré-configurada para suportar a incorporação de `@import` de CSS através de `postcss-import`. Os pseudónimos de Vite são também respeitados pela `@import` de CSS. Além disto, todas referências de `url()` de CSS, mesmo se os ficheiros importados estiverem em diretórios diferentes, são sempre automaticamente rebaseados para garantir a correção.

Os pseudónimos `@import` e o rebaseamento de URL são também suportados para os ficheiros de Sass e Less (consulte [Pré-processadores de CSS](#css-pre-processors)).

### PostCSS {#postcss}

Se o projeto contiver configuração de PostCSS válida (qualquer formato suportado pela [postcss-load-config](https://github.com/postcss/postcss-load-config), por exemplo, `postcss.config.js`), ele será automaticamente aplicado a todas CSS importadas.

### Módulos de CSS {#css-modules}

Qualquer ficheiro de CSS terminando com `.module.css` é considerado um [ficheiro de módulos de CSS](https://github.com/css-modules/css-modules). A importação de tal ficheiro retornará objeto de módulo correspondente:

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

O comportamento de módulos de CSS pode ser configurado através da [opção `css.modules`](/config/shared-options#css-modules).

Se `css.modules.localsConvention` for definido para ativar locais em "camelCase" (por exemplo, `localsConvention: 'camelCaseOnly'`), podes também usar as importações nomeadas:

```js
// .apply-color -> applyColor
import { applyColor } from './example.module.css'
document.getElementById('foo').className = applyColor
```

### Pré-processadores de CSS {#css-pre-processors}

Uma vez que a Vite mira os navegadores modernos apenas, é recomendado utilizar variáveis de CSS nativa com as extensões de PostCSS que implementam os rascunhos de CSSWG (por exemplo, [postcss-nesting](https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-nesting)) e escrever CSS simples em conformidade com os padrões do futuro.

Isto dito, a Vite fornece suporte embutido para os ficheiros `.scss`, `.sass`, `.less`, `.styl` e `.stylus`. Não é necessário instalar extensões especificas de Vite para elas, mas o pré-processador correspondente por si só deve ser instalado:

```bash
# .scss and .sass
npm add -D sass

# .less
npm add -D less

# .styl and .stylus
npm add -D stylus
```

Se estiveres a utilizar componentes de ficheiro único de Vue, este também ativa automaticamente `<style lang="sass">` e outros.

A Vite melhora a resolução de `@import` para a Sass e Less para que os pseudónimos de Vite sejam também respeitados. Além disto, referências de `url()` relativa dentro de ficheiros Sass ou Less importados que estão em diretórios diferentes do ficheiro de raiz são também rebaseados automaticamente para garantir a correção.

Os pseudónimo de `@import` e o rebaseamento de `url` não são suportados para Styles por causa das restrições da sua API.

Tu podes também utilizar os módulos de CSS combinados com os pré-processadores ao adicionar `.module` antes da extensão do ficheiro, por exemplo `style.module.scss`.

### Desativando a injeção de CSS para página {#disabling-css-injection-into-the-page}

A injeção automática de conteúdos de CSS pode ser desligada através da parâmetro de consulta `?inline`. Neste caso, a sequência de caracteres da CSS processada é retornada como exportação padrão do módulo como de costume, mas os estilos não são injetados para página.

```js
import otherStyles from './bar.css?inline' // não será injetado na página
```

:::tip NOTA
As importações padrão e nomeadas de ficheiros de CSS (por exemplo, `import style from './foo.css'`) estão depreciadas desde a Vite 4. Use a consulta `?inline`.
:::

## CSS Relâmpago {#lightning-css}

Desde a versão 4.4 da Vite, existe suporte experimental para [CSS Relâmpago](https://lightningcss.dev/). Tu podes optar por esta opção adicionado [`css.transformer: 'lightningcss'`](../config/shared-options#css-transformer) ao teu ficheiro de configuração e instalar a dependência [`lightningcss`](https://www.npmjs.com/package/lightningcss) opcional:

```bash
npm add -D lightningcss
```

Caso ativada, os ficheiros de CSS serão processados pela CSS Relâmpago ao invés da PostCSS. Para configurá-la, podes passar as opções da CSS Relâmpago para a opção de configuração [`css.lightingcss`](../config/shared-options#css-lightningcss).

Para configurares os Módulos de CSS, usarás [`css.lightningcss.cssModules`](https://lightningcss.dev/css-modules) ao invés de [`css.modules`](../config/shared-options#css-modules) (a qual configura a maneira que a PostCSS lida com os módulos de CSS).

Por padrão, a Vite usa a `esbuild` para minificar a CSS. A CSS Relâmpago também pode ser usada como minificador de CSS com [`build.cssMinify: 'lightningcss'`](../config/build-options#build-cssminify).

:::tip NOTA
Os [pré-processadores de CSS](#css-pre-processors) não são suportados quando usas a CSS relâmpago.
:::

## Recursos Estáticos {#static-assets}

A importação de um recurso estático retornará URL pública resolvida quando ela for servida:

```js
import imgUrl from './img.png'
document.getElementById('hero-img').src = imgUrl
```

Consultas especiais podem modificar como os recursos são carregados:

```js
// Carrega explicitamente os recursos como URL
import assetAsURL from './asset.js?url'
```

```js
// Carrega os recursos como sequências de caracteres
import assetAsString from './shader.glsl?raw'
```

```js
// Carrega os Operários de Web
import Worker from './worker.js?worker'
```

```js
// Os Operários de Web embutidos como sequências de caracteres
// de base64 em tempo de execução
import InlineWorker from './worker.js?worker&inline'
```

Mais detalhes em [Manipulação de Recurso Estático](./assets).

## JSON {#json}

Os ficheiros de JSON podem ser importados diretamente - importações nomeadas são também suportadas:

```js
// importa o objeto inteiro
import json from './example.json'

// importa um campo (field) de raiz como exportação nomeada -
// ajuda com sacudidura de árvore!
import { field } from './example.json'
```

## Importação de Glob {#glob-import}

A Vite suporta a importação de múltiplos módulos do sistema de ficheiro através da função `import.meta.glob` especial:

```js
const modules = import.meta.glob('./dir/*.js')
```

O exemplo de cima será transformado no seguinte:

```js
// código produzido pela vite
const modules = {
  './dir/foo.js': () => import('./dir/foo.js'),
  './dir/bar.js': () => import('./dir/bar.js')
}
```

Tu podes depois iterar sobre as chaves do objeto `modules` para acessar os módulos correspondente:

```js
for (const path in modules) {
  modules[path]().then((mod) => {
    console.log(path, mod)
  })
}
```

Os ficheiros correspondidos são por padrão preguiçosamente carregados através da importação dinâmica e serão divididos em pedaços separados durante a construção. Se preferires importar todos os módulos diretamente (por exemplo, dependendo dos efeitos colaterais nestes módulos para serem aplicados primeiro), podes passar `{ eager: true }` como segundo argumento:


```js
const modules = import.meta.glob('./dir/*.js', { eager: true })
```

O exemplo de cima será transformado no seguinte:

```js
// código produzido pela vite
import * as __glob__0_0 from './dir/foo.js'
import * as __glob__0_1 from './dir/bar.js'
const modules = {
  './dir/foo.js': __glob__0_0,
  './dir/bar.js': __glob__0_1
}
```

### Importação de Glob Como {#glob-import-as}

`import.meta.glob` também suporta a importação de ficheiros como sequências de caracteres (semelhante a [Importação de Recurso como Sequência de Caracteres](guide/assets#importing-asset-as-string)) com a sintaxe de [Reflexão de Importação](https://github.com/tc39/proposal-import-reflection):

```js
const modules = import.meta.glob('./dir/*.js', { as: 'raw', eager: true })
```

O exemplo de cima será transformado no seguinte:

```js
// código produzido pela vite
const modules = {
  './dir/foo.js': 'export default "foo"\n',
  './dir/bar.js': 'export default "bar"\n'
}
```

`{ as: 'url' }` é também suportado para de carregamento de recursos como URLs.

### Padrões Diversificado {#multiple-patterns}

O primeiro argumento pode ser um arranjo de globs, por exemplo:

```js
const modules = import.meta.glob(['./dir/*.js', './another/*.js'])
```

### Padrões Negativos {#negative-patterns}

Os padrões de glob negativo são também suportados (prefixados com `!`). Para ignorar alguns ficheiros do resultado, podes adicionar os padrões glob de exclusão ao primeiro argumento:

```js
const modules = import.meta.glob(['./dir/*.js', '!**/bar.js'])
```

```js
// código produzido pela vite
const modules = {
  './dir/foo.js': () => import('./dir/foo.js')
}
```

#### Importações Nomeadas {#named-imports}

É possível apenas importar partes dos módulos com as opções `import`.

```ts
const modules = import.meta.glob('./dir/*.js', { import: 'setup' })
```

```ts
// código produzido pela vite
const modules = {
  './dir/foo.js': () => import('./dir/foo.js').then((m) => m.setup),
  './dir/bar.js': () => import('./dir/bar.js').then((m) => m.setup)
}
```

Quando combinada com `eager` é até mesmo possível ter a sacudidura de árvore ativada para aqueles módulos.

```ts
const modules = import.meta.glob('./dir/*.js', { import: 'setup', eager: true })
```

```ts
// código produzido pela vite
import { setup as __glob__0_0 } from './dir/foo.js'
import { setup as __glob__0_1 } from './dir/bar.js'
const modules = {
  './dir/foo.js': __glob__0_0,
  './dir/bar.js': __glob__0_1
}
```

Definir `import` como `default` para importar a exportação padrão.

```ts
const modules = import.meta.glob('./dir/*.js', {
  import: 'default',
  eager: true
})
```

```ts
// código produzido pela vite
import __glob__0_0 from './dir/foo.js'
import __glob__0_1 from './dir/bar.js'
const modules = {
  './dir/foo.js': __glob__0_0,
  './dir/bar.js': __glob__0_1
}
```

#### Consultas Personalizadas {#custom-queries}

Tu podes também utilizar a opção `query` para fornecer consultas personalizadas para as importações para outras extensões a consumir.

```ts
const modules = import.meta.glob('./dir/*.js', {
  query: { foo: 'bar', bar: true }
})
```

```ts
// código produzido pela vite
const modules = {
  './dir/foo.js': () =>
    import('./dir/foo.js?foo=bar&bar=true'),
  './dir/bar.js': () =>
    import('./dir/bar.js?foo=bar&bar=true')
}
```

### Advertências de Importação de Glob {#glob-import-caveats}

Nota que:

- Isto é uma funcionalidade apenas para Vite e não é um padrão de Web ou ECMAScript.
- Os padrões glob são tratados como especificadores de importação: eles deve ser tanto relativos (começar com `./`) ou absolutos (começar com `/`, resolvidos como sendo relativos a raiz do projeto) ou um caminho de pseudónimo (consulte a [opção `resolve.alias`](/config/shared-options#resolve-alias)).
- O glob correspondente é feito através de [`fast-glob`](https://github.com/mrmlnc/fast-glob) - consulte a sua documentação por [padrões de glob suportados](https://github.com/mrmlnc/fast-glob#pattern-syntax).
- Tu deves também estar ciente de que todos os argumentos na `import.meta.glob` devem ser **passados como literais**. Tu NÃO podes utilizar as variáveis ou as expressões nelas.

## Importação Dinâmica {#dynamic-import}

Semelhante a [importação de glob](#glob-import), a Vite também suporta importação dinâmica com as variáveis.

```ts
const module = await import(`./dir/${file}.js`)
```

Nota que as variáveis apenas representam os nomes de ficheiro um nível de profundidade. Se `file` for `'foo/bar'`, a importação falharia. Para utilização mais avançada, podes utilizar a funcionalidade de [importação de glob](#glob-import).

## WebAssembly {#webassembly}

Os ficheiros `.wasm` pré-compilados podem ser importados com `?init`.
A exportação padrão será uma função de inicialização que retorna uma promessa da [`WebAssembly.Instance`](https://developer.mozilla.org/en-US/docs/WebAssembly/JavaScript_interface/Instance):

```js
import init from './example.wasm?init'

init().then((instance) => {
  instance.exports.test()
})
```

A função de inicialização também pode receber um `ImportObject` que é passado para [`WebAssembly.instantiate`](https://developer.mozilla.org/en-US/docs/WebAssembly/JavaScript_interface/instantiate) como seu segundo argumento:

```js
init({
  imports: {
    someFunc: () => {
      /* ... */
    }
  }
}).then(() => {
  /* ... */
})
```

Na construção de produção, os ficheiros `.wasm` mas pequenos do que o `assetInlineLimit` serão embutidos como sequências de caracteres de base64. De outro modo, serão tratados como um [recurso estático](./assets) e requisitado sobre demanda.

:::warning NOTA
[Proposta de Integração de Módulo de ECMAScript para WebAssembly](https://github.com/WebAssembly/esm-integration) não é atualmente suportada.
Utilize [`vite-plugin-wasm`](https://github.com/Menci/vite-plugin-wasm) ou outras extensões da comunidade para lidar com isto.
:::

### Acessando o Módulo WebAssembly {#accessing-the-webassembly-module}

Se precisarmos de acesso ao objeto `Module`, por exemplo, para instância-lo várias vezes, usaremos uma [importação de URL explícita](./assets#explicit-url-imports) para resolver o recurso, e depois realizar a instanciação:

```js
import wasmUrl from 'foo.wasm?url'

const main = async () => {
  const responsePromise = fetch(wasmUrl)
  const { module, instance } = await WebAssembly.instantiateStreaming(
    responsePromise,
  )
  /* ... */
}

main()
```

### Requisitando o Módulo na Node.js {#fetching-the-module-in-node-js}

Na interpretação no lado do servidor, a `fetch()` acontecendo como parte da importação `?init`, pode falhar com `TypeError: Invalid URL`. Consulte a questão [Suportar `wasm` na SSR](https://github.com/vitejs/vite/issues/8882).

Cá está uma alternativa, assumindo que a base do projeto é o diretório atual:

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

## Operários de Web {#web-workers}

### Importar com Construtores {#import-with-constructors}

Um programa de operário de web pode ser importado utilizando [`new Worker()`](https://developer.mozilla.org/en-US/docs/Web/API/Worker/Worker) e [`new SharedWorker()`](https://developer.mozilla.org/en-US/docs/Web/API/SharedWorker/SharedWorker). Comparado aos sufixos de operário, esta sintaxe encontra-se mais próxima dos padrões e é a maneira **recomendado** para criar operários.

```ts
const worker = new Worker(new URL('./worker.js', import.meta.url))
```

O construtor operário também aceita opções, que podem ser utilizadas para criar operários de "módulo" (module, em Inglês):

```ts
const worker = new Worker(new URL('./worker.js', import.meta.url), {
  type: 'module'
})
```

### Importar com Sufixos de Consulta {#import-with-query-suffixes}

Um programa operário de web pode ser diretamente importado adicionando `?worker` ou `?sharedworker` para a requisição de importação. A exportação padrão será um construtor de operário personalizado:

```js
import MyWorker from './worker?worker'

const worker = new MyWorker()
```

O programa operário pode também utilizar declarações de `import` no lugar de `importScripts()`. **Nota**: durante o desenvolvimento isto depende do [suporte nativo do navegador](https://caniuse.com/?search=module%20worker), mas para a construção de produção é compilado fora.

Por padrão, o programa operário será emitido como um pedaço separado na construção de produção. Se desejares embutir o operário como sequências de caracteres de base64, adicione a consulta `inline`:

```js
import MyWorker from './worker?worker&inline'
```

Se desejares recuperar o operário como uma URL, adicione a consulta `url`:

```js
import MyWorker from './worker?worker&url'
```

Consulte as [Opções de Operário](/config/worker-options) por detalhes a respeito da configuração do empacotamento de todos operários.

## Otimizações de Construção {#build-optimizations}

> As funcionalidades listadas abaixo são automaticamente aplicadas como parte do processo de construção e não precisam de configuração explícita a menos que queiras desativá-las.

### Separação de Código de CSS {#css-code-splitting}

A Vite extrai automaticamente a CSS utilizada pelos módulos em um pedaço assíncrono e gera um ficheiro separado para ela. O ficheiro de CSS é carregado automaticamente através do marcador `<link>` quando o pedaço assíncrono associado for carregado, e o pedaço assíncrono tem a garantia de apenas ser avaliada depois da CSS for carregada para evitar [FOUC](https://en.wikipedia.org/wiki/Flash_of_unstyled_content#:~:text=A%20flash%20of%20unstyled%20content,before%20all%20information%20is%20retrieved.).

Se preferires ter todas as CSS extraídas em um único ficheiro, podes desativar a separação de código de CSS definindo [`build.cssCodeSplit`](/config/build-options#build-csscodesplit) para `false`.

### Geração de Diretivas de Pré-Carregamento {#preload-directives-generation}

A Vite gera automaticamente as diretivas `<link rel="modulepreload">` para os pedaços de entrada e suas importações direta no HTML construído:

### Otimização de Carregamento de Pedaço Assíncrono {#async-chunk-loading-optimization}

Nas aplicações do mundo real, a Rollup frequentemente gera pedaços "comuns" - código que é partilhado entre dois ou mais pedaços. Combinado com as importações dinâmica, é muito comum ter o seguinte cenário:

<script setup>
import graphSvg from '../images/graph.svg?raw'
</script>
<svg-image :svg="graphSvg" />

Nos cenários não otimizados, quando o pedaço assíncrono `A` é importado, o navegador terá de requisitar e analisar `A` antes de poder compreender que também precisa do pedaço comum `C`. Isto resultada e uma viagem de ida e volta na rede adicional:

```
Entry ---> A ---> C
```

A Vite reescreve automaticamente chamadas de importação dinâmica de separação de código com uma etapa de pré-carregamento para quando `A` for requisitada, `C` é requisitada **em paralelo**:

```
Entry ---> (A + C)
```

É possível para `C` ter mais importações, que resultarão em mais viagens de ida e volta no cenário não otimizado. A otimização da Vite rastreará todas importações diretas para eliminar completamente as viagens de ida e volta independentemente da profundidade da importação.
