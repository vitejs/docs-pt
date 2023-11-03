# Migração da Versão 4 {#migration-from-v4}

## Suporte da Node.js {#node-js-support}

A Vite já não suporta a Node.js 14 / 16 / 17 / 19, as quais alcançaram o fim da sua expetativa de vida. A Node.js 18 / 20+ agora é obrigatória.

## Rollup 4 {#rollup-4}

A Vite agora usa Rollup 4 que também vem com suas mudanças de rutura, em particular:

- As asserções de importação (propriedade `assertions`) foram renomeada para importar atributos (propriedade `attributes`).
- As extensão da bolota já não são suportados.
- Para extensões da Vite, a opção `skipSelf` de `this.resolve` agora é `true` por padrão.
- Para extensão da Vite, `this.parse` agora apenas suportam a opção `allowReturnOutsideFunction` por agora.

Leia as mudanças de rutura completa nas [notas de lançamento do Rollup](https://github.com/rollup/rollup/releases/tag/v4.0.0) por mudanças relacionadas à construção no [`build.rollupOptions`](/config/build-options#build-rollupoptions).

## Depreciação da API da Node de CJS {#deprecate-cjs-node-api}

A API da Node de CJS da Vite está depreciada. Quando chamamos `require('vite')`, um aviso de depreciação agora é registado. Nós devemos atualizar os nossos ficheiros ou abstrações para importar a construção de módulo de ECMAScript da Vite.

Num projeto de Vite básico, devemos certificar-nos de que:

1. O conteúdo do ficheiro `vite.config.js` está a usar a sintaxe de módulo de ECMAScript.
2. O ficheiro `package.json` mais próximo tem `"type": "module"`, ou devemos usar a extensão `.mjs`, por exemplo `vite.config.mjs`.

Para outros projetos, existem algumas abordagens gerais:

- **Configurar o ESM como padrão, aderir à CJS se necessário:** Adicionar `"type": "module"` no projeto `package.json`. Todos os ficheiros `*.js` agora são interpretados como módulo ECMAScript e precisa usar a sintaxe da módulo ECMAScript. Nós podemos renomear um ficheiro com a extensão `.cjs` para manter usando CJS.
- **Manter CJS como padrão, aderir à módulo de ECMAScript se necessário:** Se o `package.json` do projeto não tem `"type":"module"`, todos os ficheiros `*.js` são interpretados como CJS. Nós podemos renomear um ficheiro com a extensão `.mjs` para usar módulo de ECMAScript.
- **Importar dinamicamente a Vite:** Se precisarmos de continuar a usar CJS, podemos importar dinamicamente a Vite usando `import('vite')`. Isto exige que o nosso código seja escrito num contexto `async`, mas ainda assim deve ser gerenciável como API da Vite é principalmente assíncrona.

Consulte o [guia de resolução de problemas](/guide/troubleshooting#vite-cjs-node-api-deprecated) por mais informação.

### Retrabalhar a Estratégia de Substituição de `define` e `import.meta.env` {#rework-define-import-meta-env-replacement-strategy}

Na Vite 4, as funcionalidades [`define`](/config/shared-options#define) e [`import.meta.env`](/guide/env-and-mode#env-variables) usam diferentes estratégias de substituição no desenvolvimento e na construção:

- No desenvolvimento, ambas funcionalidades são injetadas como variáveis globais ao `globalThis` e `import.meta` respetivamente.
- Na construção, ambas funcionalidades são estaticamente substituídas por uma expressão regular.

Isto resulta num inconsistência de desenvolvimento e construção quando tentamos acessar as variáveis, e algumas vezes até levava a construção à falhar. Por exemplo:

```js
// vite.config.js
export default defineConfig({
  define: {
    __APP_VERSION__: JSON.stringify('1.0.0'),
  },
})
```

```js
const data = { __APP_VERSION__ }
// dev: { __APP_VERSION__: "1.0.0" } ✅
// build: { "1.0.0" } ❌

const docs = 'I like import.meta.env.MODE'
// dev: "I like import.meta.env.MODE" ✅
// build: "I like "production"" ❌
```

A Vite 5 corrige isto usando a `esbuild` para lidar com as substituições nas construções, alinhando com o comportamento do desenvolvimento.

Esta mudança não deve afetar a maioria das configurações, uma vez que já é documentado que os valores de `define` seguem a sintaxe da `esbuild`:

> Para ser consistente com o comportamento da `esbuild`, expressões devem ou ser um objeto de JSON (`null`, `boolean`, `number`, `string`, `array`, ou `object`) ou um único identificador.

No entanto, se preferirmos continuar à estaticamente substituir os valores diretamente, podemos usar [`@rollup/plugin-replace`](https://github.com/rollup/plugins/tree/master/packages/replace).

## Mudanças Gerais {#general-changes}

### O Valor dos Módulos Expostos da Interpretação do Lado do Servidor agora Corresponde à Produção {#ssr-externalized-modules-value-now-matches-production}

Na Vite 4, os módulos expostos da interpretação do lado do servidor são embrulhados com `.default` e a manipulação de `__esModule` para melhor interoperabilidade, mas não corresponde o comportamento de produção quando carregado pelo ambiente de execução (por exemplo, Node.js), causando incoerências difíceis de detetar. Por padrão, todas as dependências diretas do projeto são expostas pela interpretação do lado do servidor.

A Vite 5 agora remove o `.default` e a manipulação de `.__esModule` para corresponder o comportamento de produção. Em prática, isto não deve afetar as dependências empacotadas apropriadamente, mas se encontrarmos novos problemas carregando módulos, podemos tentar estas alterações:

```js
// Antes:
import { foo } from 'bar'

// Depois:
import _bar from 'bar'
const { foo } = _bar
```

```js
// Antes:
import foo from 'bar'

// Depois:
import * as _foo from 'bar'
const foo = _foo.default
```

Nota que estas mudanças correspondem o comportamento da Node.js, então podemos também executar as importações na Node.js para testar. Se preferirmos permanecer com o comportamento anterior, podemos definir `legacy.proxySsrExternalModules` para `true`.

### `worker.plugins` agora é uma Função {#worker-plugins-is-now-a-function}

Na Vite 4, [`worker.plugins`](/config/worker-options#worker-plugins) aceitava uma vetor de extensões (`(Plugin | Plugin[])[]`). Desde a Vite 5, precisa de ser configurada como uma função que retorna um vetor de extensões (`() => (Plugin | Plugin[])[]`). Esta mudança é necessária para que as construções dos operários paralelas sejam executadas de maneira mais consistente e previsível.

### Permitir Caminho Contendo `.` Para Recuar para `index.html` {#allow-path-containing-to-fallback-to-index-html}

Na Vite 4, acessar um caminho contendo `.` não recuava para `index.html` mesmo se [`appType`](/config/shared-options#apptype) for definida para `'SPA'` (padrão). A partir da Vite 5, recuará para `index.html`.

Nota que o navegador já não mostrará a mensagem de erro de 404 na consola se apontarmos o caminho da imagem para um ficheiro inexistente (por exemplo, `<img src="./file-does-not-exist.png">`).

### Alinhar o Comportamento Serviço de HTML do Desenvolvimento e Pré-visualização {#align-dev-and-preview-html-serving-behaviour}

Na Vite 4, os servidores de desenvolvimento e pré-visualização servem o HTML baseado na sua estrutura de diretório e na barra final de maneira diferente. Isto causa inconsistências quando testamos a nossa aplicação construída. A Vite 5 refaz este comportamento à um único comportamento como de baixo, dado a seguinte estrutura de ficheiro:

```
├── index.html
├── file.html
└── dir
    └── index.html
```


| Requisição           | Antes (desenvolvimento)                 | Antes (pré-visualização)  | Depois (desenvolvimento & pré-visualização)        |
| ----------------- | ---------------------------- | ----------------- | ---------------------------- |
| `/dir/index.html` | `/dir/index.html`            | `/dir/index.html` | `/dir/index.html`            |
| `/dir`            | `/index.html` (retrocesso de SPA) | `/dir/index.html` | `/dir.html` (retrocesso de SPA)   |
| `/dir/`           | `/dir/index.html`            | `/dir/index.html` | `/dir/index.html`            |
| `/file.html`      | `/file.html`                 | `/file.html`      | `/file.html`                 |
| `/file`           | `/index.html` (retrocesso de SPA) | `/file.html`      | `/file.html`                 |
| `/file/`          | `/index.html` (retrocesso de SPA) | `/file.html`      | `/index.html` (retrocesso de SPA) |

### Ficheiros de Manifesto Agora São Gerados no Diretório `.vite` Por Padrão {#manifest-files-are-now-generated-in-vite-directory-by-default}

Na Vite 4, os ficheiros de manifesto ([`build.manifest`](/config/build-options#build-manifest), [`build.ssrManifest`](/config/build-options#build-ssrmanifest)) foram gerados na raiz do [`build.outDir`](/config/build-options#build-outdir) por padrão. A partir da Vite 5, estes serão gerados no diretório `.vite` no `build.outDir` por padrão.

### Atalhos da Interface da Linha de Comando Exigem Uma Pressão de `Enter` Adicional {#cli-shortcuts-require-an-additional-enter-press}

Os atalhos da interface da linha de comando, como `r` para reiniciar o servidor de desenvolvimento, agora exige uma pressão de `Enter` adicional para acionar o atalho. Por exemplo, `r + Enter` para reiniciar o servidor de desenvolvimento.

Esta mudança impedi a Vite de engolir e controlar atalhos específicos do sistema operacional, permitindo melhor compatibilidade quando combinamos o servidor de desenvolvimento da Vite com outros processos, e evita as [advertências anteriores](https://github.com/vitejs/vite/pull/14342).

### Atualizar o Comportamentos da TypeScript de `experimentalDecorators` e `useDefineForClassFields` {#update-experimentaldecorators-and-usedefineforclassfields-typescript-behaviour}

A Vite 5 usa a `esbuild` 0.19 e remove a camada de compatibilidade para `esbuild` 0.18, a qual muda como [`experimentalDecorators`](https://www.typescriptlang.org/tsconfig#experimentalDecorators) e [`useDefineForClassFields`](https://www.typescriptlang.org/tsconfig#useDefineForClassFields) são manipuladas.

- **`experimentalDecorators` não é ativada por padrão**

  Nós precisamos definir `compilerOptions.experimentalDecorators` para `true` no `tsconfig.json` para usarmos os decoradores.

- **`useDefineForClassFields` predefini-se dependendo do valor de `target` da TypeScript**

  Se `target` não for `ESNext` ou `ES2022` ou mais recente, ou se não existir nenhum ficheiro `tsconfig.json`, `useDefineForClassFields` pré-definirá para `false` o que pode ser problemático com valor de `esbuild.target` padrão de `esnext`. Esta pode traduzir o código para [blocos de inicialização estática](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Static_initialization_blocks#browser_compatibility) que podem não ser suportadas no nosso navegador.

  Como tal, é recomendado definir `target` para `ESNext` ou `ES2022` ou mais recente, ou definir `useDefineForClassFields` para `true` explicitamente quando configuramos `tsconfig.json`.

```jsonc
{
  "compilerOptions": {
    // Definir `true` se usarmos decoradores
    "experimentalDecorators": true,
    // Definir `true` se vermos erros de analise no navegador
    "useDefineForClassFields": true
  }
}
```

### Remover a Opção `--https` e `http: true` {#remove-https-flag-and-http-true}

A opção `--https` define `http: true`. Esta configuração foi concebida para ser usada em conjunto com a funcionalidade de geração de certificação de https automática que [foi abandonado na Vite 3](https://v3.vitejs.dev/guide/migration.html#automatic-https-certificate-generation). Esta configuração já não faz sentido, uma vez que fará a Vite iniciar um servidor de HTTPs sem um certificado. Ambos [`@vitejs/plugin-basic-ssl`](https://github.com/vitejs/vite-plugin-basic-ssl) e [`vite-plugin-mkcert`](https://github.com/liuweiGL/vite-plugin-mkcert) definem a definição de `https` apesar do valor `https`, assim podemos apenas remover `--https` e `https: true`.

### Remover as APIs `resolvePackageEntry` e `resolvePackageData` {#remove-resolvepackageentry-and-resolvepackagedata-apis}

As APIs `resolvePackageEntry` e `resolvePackageData` foram removidas uma vez que expunham os interiores da Vite e bloqueavam potenciais otimizações da Vite 4.3 no passado. Estas APIs podem ser substituídas por pacotes de terceiros, por exemplo:

- `resolvePackageEntry`: [`import.meta.resolve`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import.meta/resolve) ou o pacote [`import-meta-resolve`](https://github.com/wooorm/import-meta-resolve).
- `resolvePackageData`: O mesmo que o de cima, e rastreie o diretório do pacote para obter o `package.json` da raiz. Ou use o pacote [`vitefu`](https://github.com/svitejs/vitefu) da comunidade.

```js
import { resolve } from 'import-meta-env'
import { findDepPkgJsonPath } from 'vitefu'
import fs from 'node:fs'

const pkg = 'my-lib'
const basedir = process.cwd()

// `resolvePackageEntry`:
const packageEntry = resolve(pkg, basedir)

// `resolvePackageData`:
const packageJsonPath = findDepPkgJsonPath(pkg, basedir)
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'))
```

## APIs Depreciadas Removida {#removed-deprecated-apis}

- As exportações padrão de ficheiros de CSS (por exemplo, `import style from './foo.css'`): Usamos a consulta `?inline`.
- `import.meta.globEager`: Usamos `import.meta.glob('*', { eager: true })`.
- `ssr.format: 'cjs'` e `legacy.buildSsrCjsExternalHeuristics` ([#13816](https://github.com/vitejs/vite/discussions/13816))
- `server.middlewareMode: 'ssr'` e `server.middlewareMode: 'html'`: Usamos [`appType`](/config/shared-options.md#apptype) + [`server.middlewareMode: true`](/config/server-options.md#server-middlewaremode) ao invés de ([#8452](https://github.com/vitejs/vite/pull/8452))

## Avançado {#advanced}

Existe algumas mudanças que apenas afetam os criadores de extensão e ferramenta.

- [[#14119] refactor!: merge `PreviewServerForHook` into `PreviewServer` type](https://github.com/vitejs/vite/pull/14119)
  - O gatilho `configurePreviewServer` agora aceita o tipo `PreviewServer` ao invés do tipo `PreviewServerForHook`.
- [[#14818] refactor(preview)!: use base middleware](https://github.com/vitejs/vite/pull/14818)
  - Os intermediários adicionados a partir da função retornada na `configurePreviewServer` agora não tem acesso à `base` quando comparamos o valor `req.url`. Isto alinha o comportamento com o servidor de desenvolvimento. Nós podemos consultar a `base` a partir do gatilho `configResolved` se necessário.

Além disto, existem outras mudanças de rutura que apenas afetam alguns utilizadores.

- [[#14098] fix!: avoid rewriting this (reverts #5312)](https://github.com/vitejs/vite/pull/14098)
  - `this` de alto nível foi reescrito ao `globalThis` por padrão quando construímos. Este comportamento agora foi removido.
- [[#14231] feat!: add extension to internal virtual modules](https://github.com/vitejs/vite/pull/14231)
  - O identificador dos módulos virtuais internos agora tem uma extensão (`.js`).
- [[#14583] refactor!: remove exporting internal APIs](https://github.com/vitejs/vite/pull/14583)
  - APIs internas exportadas removidas acidentalmente: `isDepsOptimizerEnabled` e `getDepOptimizationConfig`
  - Tipos internos exportados removidos: `DepOptimizationResult`, `DepOptimizationProcessing`, e `DepsOptimizer`
  - Tipo de `ResolveWorkerOptions` renomeado para `ResolvedWorkerOptions`
- [[#5657] fix: return 404 for resources requests outside the base path](https://github.com/vitejs/vite/pull/5657)
  - No passado, a Vite respondia às requisições fora do caminho de base sem `Accept: text/html`, como se fossem requisitadas com o caminho de base. A Vite já não faz isto e responde com 404.
- [[#14723] fix(resolve)!: remove special .mjs handling](https://github.com/vitejs/vite/pull/14723)
  - No passado, quando campo `"exports"` duma biblioteca mapeava para um ficheiro `.mjs`, a Vite ainda tentava corresponder os campos `"browser"` e `"module"` para corrigir a compatibilidade com certas bibliotecas. Este comportamento agora foi removido para alinhar-se com o algoritmo de resolução de exportações.
- [[#14733] feat(resolve)!: remove `resolve.browserField`](https://github.com/vitejs/vite/pull/14733)
  - `resolve.browserField` foi depreciada desde a Vite 3 em favor duma predefinição atualizada de `['browser', 'module', 'jsnext:main', 'jsnext']` para [`resolve.mainFields`](/config/shared-options#resolve-mainfields).

## Migração da Versão 3 {#migration-from-v3}

Consulte primeiro o [Guia de Migração da Versão 3](https://v4.vitejs.dev/guide/migration) na documentação da versão 4 da Vite para veres as mudanças necessárias para portar a nossa aplicação para a versão 4 da Vite, e depois prossiga com as mudanças nesta página.
