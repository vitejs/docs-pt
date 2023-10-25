# Migração da Versão 4 {#migration-from-v4}

## Suporte da Node.js {#node-js-support}

A Vite já não suporta a Node.js 14 / 16 / 17 / 19, as quais alcançaram o fim da sua expetativa de vida. A Node.js 18 / 20+ agora é obrigatória.

## Rollup 4 {#rollup-4}

A Vite agora usa Rollup 4 que também vem com suas mudanças de rutura, em particular:

- As asserções de importação (propriedade `assertions`) foram renomeada para importar atributos (propriedade `attributes`).
- As extensão da bolota já não são suportados.
- Para extensões da Vite, a opção `skipSelf` de `this.resolve` agora é `true` por padrão.
- Para extensão da Vite, `this.parse` agora apenas suportam a opção `allowReturnOutsideFunction` por agora.

Leia as mudanças de rutura completa nas [notas de lançamento do Rollup](https://github.com/rollup/rollup/releases/tag/v4.0.0) por mudanças relacionadas à construção no `build.rollupOptions`.

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

Na Vite 4, `worker.plugins` aceitava uma vetor de extensões (`(Plugin | Plugin[])[]`). Desde a Vite 5, precisa de ser configurada como uma função que retorna um vetor de extensões (`() => (Plugin | Plugin[])[]`). Esta mudança é necessária para que as construções dos operários paralelas sejam executadas de maneira mais consistente e previsível.

### Permitir Caminho Contendo `.` Para Recuar para `index.html` {#allow-path-containing-to-fallback-to-index-html}

Na Vite 4, acessar um caminho contendo `.` não recuava para `index.html` mesmo se `appType` é definido para `'SPA'` (padrão). A partir da Vite 5, recuará para `index.html`.

Nota que o navegador já não mostrará a mensagem de erro de 404 na consola se apontarmos o caminho da imagem para um ficheiro inexistente (por exemplo, `<img src="./file-does-not-exist.png">`).

### Ficheiros de Manifesto Agora São Gerados no Diretório `.vite` Por Padrão {#manifest-files-are-now-generated-in-vite-directory-by-default}

Na Vite 4, os ficheiros de manifesto (`build.manifest`, `build.ssrManifest`) foram gerados na raiz do `build.outDir` por padrão. A partir da Vite 5, estes serão gerados no diretório `.vite` no `build.outDir` por padrão.

### Atalhos da Interface da Linha de Comando Exige Uma Pressão de `Enter` Adicional {#cli-shortcuts-require-an-additional-enter-press}

Os atalhos da interface da linha de comando, como `r` para reiniciar o servidor de desenvolvimento, agora exige uma pressão de `Enter` adicional para acionar o atalho. Por exemplo, `r + Enter` para reiniciar o servidor de desenvolvimento.

Esta mudança impedi a Vite de engolir e controlar atalhos específicos do sistema operacional, permitindo melhor compatibilidade quando combinamos o servidor de desenvolvimento da Vite com outros processos, e evita as [advertências anteriores](https://github.com/vitejs/vite/pull/14342).

### Remover a opção `--https` e `http: true` {#remove-https-flag-and-http-true}

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

## Avançado {#advanced}

Existe algumas mudanças que apenas afetam os criadores de extensão e ferramenta.

- [[#14119] refactor!: merge `PreviewServerForHook` into `PreviewServer` type](https://github.com/vitejs/vite/pull/14119)

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

## Migração da Versão 3 {#migration-from-v3}

Consulte primeiro o [Guia de Migração da Versão 3](https://v4.vitejs.dev/guide/migration) na documentação da versão 4 da Vite para veres as mudanças necessárias para portar a nossa aplicação para a versão 4 da Vite, e depois prossiga com as mudanças nesta página.
