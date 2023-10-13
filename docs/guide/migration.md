# Migração da Versão 4 {#migration-from-v4}

## Suporte da Node.js {#node-js-support}

A Vite já não suporta a Node.js 14 / 16 / 17 / 19, as quais alcançaram o fim da sua expetativa de vida. A Node.js 18 / 20+ agora é obrigatória.

## Depreciar a API da Node CJS {#deprecate-cjs-node-api}

A API da Node CJS da Vite está depreciada. Quando chamamos `require('vite')`, um aviso de depreciação agora é registado. Nós devemos atualizar os nossos ficheiros ou abstrações para importar a construção de módulo de ECMAScript da Vite.

Num projeto de Vite básico, devemos certificar-nos de que:

1. O conteúdo do ficheiro `vite.config.js` está a usar a sintaxe de módulo de ECMAScript.
2. O ficheiro `package.json` mais próximo tem `"type": "module"`, ou devemos usar a extensão `.mjs`, por exemplo `vite.config.mjs`.

Para outros projetos, existem algumas abordagens gerais:

- **Configurar o ESM como padrão, aderir à CJS se necessário:** Adicionar `"type": "module"` no projeto `package.json`. Todos os ficheiros `*.js` agora são interpretados como módulo ECMAScript e precisa usar a sintaxe da módulo ECMAScript. Nós podemos renomear um ficheiro com a extensão `.cjs` para manter usando CJS.
- **Manter CJS como padrão, aderir à módulo de ECMAScript se necessário:** Se o `package.json` do projeto não tem `"type":"module"`, todos os ficheiros `*.js` são interpretados como CJS. Nós podemos renomear um ficheiro com a extensão `.mjs` para usar módulo de ECMAScript.
- **Importar dinamicamente a Vite:** Se precisarmos de continuar a usar CJS, podemos importar dinamicamente a Vite usando `import('vite')`. Isto exige que o nosso código seja escrito num contexto `async`, mas ainda assim deve ser gerenciável como API da Vite é principalmente assíncrona.

Consulte o [guia de resolução de problemas](https://pt.vitejs.dev/guide/troubleshooting.html#vite-cjs-node-api-deprecated) por mais informação.

## Mudanças Gerais {#general-changes}

### Permitir Caminho Contendo `.` Para Recuar para `index.html` {#allow-path-containing-to-fallback-to-index-html}

Na Vite 4, acessar um caminho contendo `.` não recuava para `index.html` mesmo se `appType` é definido para `'SPA'` (padrão). A partir da Vite 5, recuará para `index.html`.

Nota que o navegador já não mostrará a mensagem de erro de 404 na consola se apontarmos o caminho da imagem para um ficheiro inexistente (por exemplo, `<img src="./file-does-not-exist.png">`).

### Ficheiros de Manifesto Agora São Gerados no Diretório `.vite` Por Padrão {#manifest-files-are-now-generated-in-vite-directory-by-default}

Na Vite 4, os ficheiros de manifesto (`build.manifest`, `build.ssrManifest`) foram gerados na raiz do `build.outDir` por padrão. A partir da Vite 5, estes serão gerados no diretório `.vite` no `build.outDir` por padrão.

### Atalhos da Interface da Linha de Comando Exige Uma Pressão de `Enter` Adicional {#cli-shortcuts-require-an-additional-enter-press}

Os atalhos da interface da linha de comando, como `r` para reiniciar o servidor de desenvolvimento, agora exige uma pressão de `Enter` adicional para acionar o atalho. Por exemplo, `r + Enter` para reiniciar o servidor de desenvolvimento.

Esta mudança impedi a Vite de engolir e controlar atalhos específicos do sistema operacional, permitindo melhor compatibilidade quando combinamos o servidor de desenvolvimento da Vite com outros processos, e evita as [advertências anteriores](https://github.com/vitejs/vite/pull/14342).

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
- [[#5657] fix: return 404 for resources requests outside the base path](https://github.com/vitejs/vite/pull/5657)
  - No passado, a Vite respondia às requisições fora do caminho de base sem `Accept: text/html`, como se fossem requisitadas com o caminho de base. A Vite já não faz isto e responde com 404.

## Migração da Versão 3 {#migration-from-v3}

Consulte primeiro o [Guia de Migração da Versão 3](https://v4.vitejs.dev/guide/migration) na documentação da versão 4 da Vite para veres as mudanças necessárias para portar a nossa aplicação para a versão 4 da Vite, e depois prossiga com as mudanças nesta página.
