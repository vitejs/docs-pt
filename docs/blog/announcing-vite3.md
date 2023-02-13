---
sidebar: false
head:
  - - meta
    - property: og:type
      content: website
  - - meta
    - property: og:title
      content: Anunciando a Vite 3
  - - meta
    - property: og:image
      content: https://vitejs.dev/og-image-announcing-vite3.png
  - - meta
    - property: og:url
      content: https://vitejs.dev/blog/announcing-vite3
  - - meta
    - property: og:description
      content: Anúncio de Lançamento da Vite 3
  - - meta
    - name: twitter:card
      content: summary_large_image
---

# A Vite 3.0 está Publicada! {#vite-3-is-out}

Em Fevereiro do ano passado, [Evan You](https://twitter.com/youyuxi) lançou a Vite 2. Desde então, sua adoção não tem parado de crescer, alcançando mais de 1 milhão de descarregamentos de npm por semana. Um ecossistema em crescimento desordenado formado rapidamente depois do lançamento. A Vite está alimentando uma renovada corrida de inovação nas abstrações de Web. A [Nuxt 3](https://v3.nuxtjs.org/) usa a Vite por padrão. A [SvelteKit](https://kit.svelte.dev/), [Astro](https://astro.build/), [Hydrogen](https://hydrogen.shopify.dev/), e a [SolidStart](https://docs.solidjs.com/start) são todas construídas com a Vite. A [Lavavel decidiu agora usar a Vite por padrão](https://laravel.com/docs/9.x/vite). A [Vite Ruby](https://vite-ruby.netlify.app/) revela como a Vite pode melhorar a experiência de programação da Rails. A [Vitest](https://vitest.dev) está a fazer grandes progressos como uma alternativa nativa de Vite para a Jest. Vite está por detrás das funcionalidades de testagem de componente da [Cypress](https://docs.cypress.io/guides/component-testing/writing-your-first-component-test) e [Playwright](https://playwright.dev/docs/test-components), a Storybook tem a [Vite como um construtor oficial](https://github.com/storybookjs/builder-vite). E [a lista continua](https://patak.dev/vite/ecosystem.html). Os responsáveis pela maioria destes projetos envolveram-se no melhoramento do próprio núcleo da Vite, trabalhando intimamente com a [equipa](https://vitejs.dev/team) da Vite e outros colaboradores.

![Imagem de Capa do Anúncio da Vite 3](/og-image-announcing-vite3.png)

Hoje, 16 meses desde o lançamento da versão 2 estamos felizes em anunciar o lançamento da Vite 3. Nós decidimos lançar uma nova versão principal de Vite ao menos todos os anos para alinhar com a [EOL da Node.js](https://nodejs.org/en/about/releases/), e ter a oportunidade de revisar a API da Vite regularmente com um curto caminho de migração para os projetos no ecossistema.

Ligações rápidas:

- [Guia de Migração](/guide/migration)
- [Relatório de Mudança](https://github.com/vitejs/vite/blob/main/packages/vite/CHANGELOG.md#300-2022-07-13)

Se és recém-chegado na Vite, recomendamos a leitura do [Guia Porquê Vite](https://vitejs.dev/guide/why.html). Depois consulte [o Guia Começar](https://vitejs.dev/guide/) e o [Guia de Funcionalidades](https://vitejs.dev/guide/features) para veres o que a Vite fornece fora da caixa. Como de costume, as contribuições são bem-vindas na [GitHub](https://github.com/vitejs/vite). Mais de [600 colaboradores](https://github.com/vitejs/vite/graphs/contributors) têm ajudado a melhorar a Vite até aqui. Siga as atualizações na [Twitter](https://twitter.com/vite_js), ou junta-te as discussões com outros utilizadores da Vite no nosso [Servidor de Conversas da Discord](http://chat.vitejs.dev/).

## A Nova Documentação {#new-documentation}

Visite a [vitejs.dev](https://vitejs.dev) para apreciares a nova documentação da versão 3. A Vite agora está a usar a novo tema padrão da [VitePress](https://vitepress.vuejs.org), com um lindo modo escuro entre outras funcionalidades.

[![Primeira página da documentação da Vite](../images/v3-docs.png)](https://vitejs.dev)

Vários projetos no ecossistema já migraram para ela (veja a [Vitest](https://vitest.dev), [vite-plugin-pwa](https://vite-plugin-pwa.netlify.app/), e a própria [VitePress](https://vitepress.vuejs.org/)).

Se precisares de acessar a documentação da Vite 2, ela continua online [v2.vitejs.dev](https://v2.vitejs.dev). Existe também um novo subdomínio [main.vitejs.dev](https://main.vitejs.dev), onde cada envio para o ramo principal da Vite é implementada em produção automaticamente. Isto é útil quando se está a testar versões beta ou contribuir para desenvolvimento do núcleo.

Agora também existe uma tradução Espanhola oficial, que tem sido adicionada às anteriores traduções Chinesa e Japonesa:

- [简体中文](https://cn.vitejs.dev/)
- [日本語](https://ja.vitejs.dev/)
- [Español](https://es.vitejs.dev/)

## Criar Modelos de Partida da Vite {#create-vite-starter-templates}

Os modelos de partida de projeto da [create-vite](/guide/#trying-vite-online) têm sido uma excelente ferramenta para testar rapidamente a Vite com a tua abstração favorita. Na Vite 3, todos os modelos de projeto receberam um novo tema embutido de acordo com a nova documentação. Abra-os online e comece agora a brincar com a Vite 3:

<div class="stackblitz-links">
<a target="_blank" href="https://vite.new"><img width="75" height="75" src="../images/vite.svg" alt="Vite logo"></a>
<a target="_blank" href="https://vite.new/vue"><img width="75" height="75" src="../images/vue.svg" alt="Vue logo"></a>
<a target="_blank" href="https://vite.new/svelte"><img width="60" height="60" src="../images/svelte.svg" alt="Svelte logo"></a>
<a target="_blank" href="https://vite.new/react"><img width="75" height="75" src="../images/react.svg" alt="React logo"></a>
<a target="_blank" href="https://vite.new/preact"><img width="65" height="65" src="../images/preact.svg" alt="Preact logo"></a>
<a target="_blank" href="https://vite.new/lit"><img width="60" height="60" src="../images/lit.svg" alt="Lit logo"></a>
</div>

<style>
.stackblitz-links {
  display: flex;
  width: 100%;
  justify-content: space-around;
  align-items: center;
}
@media screen and (max-width: 550px) {
  .stackblitz-links {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    width: 100%;
    gap: 2rem;
    padding-left: 3rem;
    padding-right: 3rem;
  }
}
.stackblitz-links > a {
  width: 70px;
  height: 70px;
  display: grid;
  align-items: center;
  justify-items: center;
}
.stackblitz-links > a:hover {
  filter: drop-shadow(0 0 0.5em #646cffaa);
}
</style>

O tema agora é partilhado por todos os modelos de projeto. Isto deve ajudar a expressar melhor as possibilidades destes pontos de partida como modelos minimalistas de projeto para começar com a Vite. Para soluções mais completas incluindo impressões sobre a qualidade do código, configuração de testes e outras funcionalidades, existem modelos de projetos oficiais alimentados pela Vite para algumas abstrações como [create-vue](https://github.com/vuejs/create-vue) e [create-svelte](https://github.com/sveltejs/kit). Existe uma lista mantida pela comunidade com modelos de projetos na [Awesome Vite](https://github.com/vitejs/awesome-vite#templates).

## Melhorias de Desenvolvimento {#dev-improvements}

### Interface da Linha de Comando da Vite {#vite-cli}

<pre style="background-color: var(--vp-code-block-bg);padding:2em;border-radius:8px;max-width:100%;overflow-x:auto;">
  <span style="color:lightgreen"><b>VITE</b></span> <span style="color:lightgreen">v3.0.0</span>  <span style="color:gray">ready in <b>320</b> ms</span>

  <span style="color:lightgreen"><b>➜</b></span>  <span style="color:white"><b>Local</b>:</span>   <span style="color:cyan">http://127.0.0.1:5173/</span>
  <span style="color:green"><b>➜</b></span>  <span style="color:gray"><b>Network</b>: use --host to expose</span>
</pre>

Para além dos aprimoramentos estéticos da Interface da Linha de Comando da Vite, notarás que a porta padrão do servidor de desenvolvimento agora é 5173 e o servidor de pré-visualização escuta na 4173. Esta mudança garante que a Vite evitará colisões com outras ferramentas.

### Estratégia Conexão de WebSocket Aperfeiçoada {#improved-websocket-connection-strategy}

Uma dos pontos dolosos da Vite 2 era a configuração do servidor quando estivesse a executar por trás de uma delegação (ou "proxy" em Inglês). A Vite 3 muda o esquema de conexão padrão assim funciona fora da caixa na maioria dos cenários. Todas estas configurações agora são testas como parte da Integração Contínua do Ecossistema da Vite através da [`vite-setup-catalogue`](https://github.com/sapphi-red/vite-setup-catalogue).

### Melhorias da Inicialização Fria {#cold-start-improvements}

Agora a Vite evita o recarregamento completo durante a inicialização fria quando as importações forem injetadas pelas extensões enquanto rastreia os módulos iniciais importados estaticamente ([#8869](https://github.com/vitejs/vite/issues/8869)).

<details>
  <summary><b>Clicar para aprender mais</b></summary>

Na Vite 2.9, ambos o examinador e otimizador eram executados no fundo. No melhor cenário, onde o examinador encontraria cada dependência, nenhum recarregamento era necessário na inicialização fria. Mas se o examinador deixar escapar uma dependência, uma nova fase de otimização e depois um recarregamento eram necessários. A Vite era capaz de evitar alguns destes recarregamentos na versão 2.9, conforme detetamos se os novos pedaços otimizados eram compatíveis com aqueles que o navegador tinha. Mas se houvesse uma dependência em comum, os sub-pedaços poderiam mudar e um recarregamento era exigido para evitar o estado duplicado. Na Vite 3, as dependências otimizadas não são passadas para o navegador até que o rastreamento das importações estáticas esteja terminado. Uma fase de otimização rápida é emitida se houver uma dependência em falta (por exemplo, injetada por uma extensão), e só então, as dependências empacotadas são enviadas. Então, um recarregamento de página já não é necessário ou nestes casos.

</details>

<img style="background-color: var(--vp-code-block-bg);padding:4%;border-radius:8px;" width="100%" height="auto" src="../images/vite-3-cold-start.svg" alt="Dois gráficos comparando estratégia de otimização da Vite 2.9 e Vite 3">

### import.meta.glob

`import.meta.glob` support was rewritten. Read about the new features in the [Glob Import Guide](/guide/features.html#glob-import):

[Multiple Patterns](/guide/features.html#multiple-patterns) can be passed as an array

```js
import.meta.glob(['./dir/*.js', './another/*.js'])
```

[Negative Patterns](/guide/features.html#negative-patterns) are now supported (prefixed with `!`) to ignore some specific files

```js
import.meta.glob(['./dir/*.js', '!**/bar.js'])
```

[Named Imports](/guide/features.html#named-imports) can be specified to improve tree-shaking

```js
import.meta.glob('./dir/*.js', { import: 'setup' })
```

[Custom Queries](/guide/features.html#custom-queries) can be passed to attach metadata

```js
import.meta.glob('./dir/*.js', { query: { custom: 'data' } })
```

[Eager Imports](/guide/features.html#glob-import) is now passed as a flag

```js
import.meta.glob('./dir/*.js', { eager: true })
```

### Aligning WASM Import with Future Standards

The WebAssembly import API has been revised to avoid collisions with future standards and to make it more flexible:

```js
import init from './example.wasm?init'

init().then((instance) => {
  instance.exports.test()
})
```

Learn more in the [WebAssembly guide](/guide/features.html#webassembly)

## Build Improvements

### ESM SSR Build by Default

Most SSR frameworks in the ecosystem were already using ESM builds. So, Vite 3 makes ESM the default format for SSR builds. This allows us to streamline previous [SSR externalization heuristics](https://vitejs.dev/guide/ssr.html#ssr-externals), externalizing dependencies by default.

### Improved Relative Base Support

Vite 3 now properly supports relative base (using `base: ''`), allowing built assets to be deployed to different bases without re-building. This is useful when the base isn't known at build time, for example when deploying to content-addressable networks like [IPFS](https://ipfs.io/).

## Experimental Features

### Built Asset Paths fine-grained Control (Experimental)

There are other deploy scenarios where this isn't enough. For example, if the generated hashed assets need to be deployed to a different CDN from the public files, then finer-grained control is required over path generation at build time. Vite 3 provides an experimental API to modify the built file paths. Check [Build Advanced Base Options](/guide/build.html#advanced-base-options) for more information.

### Esbuild Deps Optimization at Build Time (Experimental)

One of the main differences between dev and build time is how Vite handles dependencies. During build time, [`@rollup/plugin-commonjs`](https://github.com/rollup/plugins/tree/master/packages/commonjs) is used to allow importing CJS only dependencies (like React). When using the dev server, esbuild is used instead to pre-bundle and optimize dependencies, and an inline interop scheme is applied while transforming user code importing CJS deps. During the development of Vite 3, we introduced the changes needed to also allow the use of [esbuild to optimize dependencies during build time](/guide/migration.html#using-esbuild-deps-optimization-at-build-time). [`@rollup/plugin-commonjs`](https://github.com/rollup/plugins/tree/master/packages/commonjs) can then be avoided, making dev and build time work in the same way.

Given that Rollup v3 will be out in the next months, and we're going to follow up with another Vite major, we've decided to make this mode optional to reduce v3 scope and give Vite and the ecosystem more time to work out possible issues with the new CJS interop approach during build time. Frameworks may switch to using esbuild deps optimization during build time by default at their own pace before Vite 4.

### HMR Partial Accept (Experimental)

There is opt-in support for [HMR Partial Accept](https://github.com/vitejs/vite/pull/7324). This feature could unlock finer-grained HMR for framework components that export several bindings in the same module. You can learn more at [the discussion for this proposal](https://github.com/vitejs/vite/discussions/7309).

## Bundle Size Reduction

Vite cares about its publish and install footprint; a fast installation of a new app is a feature. Vite bundles most of its dependencies and tries to use modern lightweight alternatives where possible. Continuing with this ongoing goal, Vite 3 publish size is 30% smaller than v2.

|             | Publish Size | Install Size |
| ----------- | :----------: | :----------: |
| Vite 2.9.14 |    4.38MB    |    19.1MB    |
| Vite 3.0.0  |    3.05MB    |    17.8MB    |
| Reduction   |     -30%     |     -7%      |

In part, this reduction was possible by making some dependencies that most users weren't needing optional. First, [Terser](https://github.com/terser/terser) is no longer installed by default. This dependency was no longer needed since we already made esbuild the default minifier for both JS and CSS in Vite 2. If you use `build.minify: 'terser'`, you'll need to install it (`npm add -D terser`). We also moved [node-forge](https://github.com/digitalbazaar/forge) out of the monorepo, implementing support for automatic https certificate generation as a new plugin: [`@vitejs/plugin-basic-ssl`](/guide/migration.html#automatic-https-certificate-generation). Since this feature only creates untrusted certificates that are not added to the local store, it didn't justify the added size.

## Bug Fixing

A triaging marathon was spearheaded by [@bluwyoo](https://twitter.com/bluwyoo), [@sapphi_red](https://twitter.com/sapphi_red), that recently joined the Vite team. During the past three months, the Vite open issues were reduced from 770 to 400. And this dive was achieved while the newly open PRs were at an all-time high. At the same time, [@haoqunjiang](https://twitter.com/haoqunjiang) had also curated a comprehensive [overview of Vite issues](https://github.com/vitejs/vite/discussions/8232).

[![Graph of open issues and pull requests in Vite](../images/v3-open-issues-and-PRs.png)](https://www.repotrends.com/vitejs/vite)

[![Graph of new issues and pull requests in Vite](../images/v3-new-open-issues-and-PRs.png)](https://www.repotrends.com/vitejs/vite)

## Compatibility Notes

- Vite no longer supports Node.js 12 / 13 / 15, which reached its EOL. Node.js 14.18+ / 16+ is now required.
- Vite is now published as ESM, with a CJS proxy to the ESM entry for compatibility.
- The Modern Browser Baseline now targets browsers which support the [native ES Modules](https://caniuse.com/es6-module), [native ESM dynamic import](https://caniuse.com/es6-module-dynamic-import), and [`import.meta`](https://caniuse.com/mdn-javascript_operators_import_meta) features.
- JS file extensions in SSR and library mode now use a valid extension (`js`, `mjs`, or `cjs`) for output JS entries and chunks based on their format and the package type.

Learn more in the [Migration Guide](/guide/migration).

## Upgrades to Vite Core

While working towards Vite 3, we also improved the contributing experience for collaborators to [Vite Core](https://github.com/vitejs/vite).

- Unit and E2E tests have been migrated to [Vitest](https://vitest.dev), providing a faster and more stable DX. This move also works as dog fooding for an important infrastructure project in the ecosystem.
- VitePress build is now tested as part of CI.
- Vite upgraded to [pnpm 7](https://pnpm.io/), following the rest of the ecosystem.
- Playgrounds have been moved to [`/playgrounds`](https://github.com/vitejs/vite/tree/main/playground) out of packages directory.
- The packages and playgrounds are now `"type": "module"`.
- Plugins are now bundled using [unbuild](https://github.com/unjs/unbuild), and [plugin-vue-jsx](https://github.com/vitejs/vite-plugin-vue/tree/main/packages/plugin-vue-jsx) and [plugin-legacy](https://github.com/vitejs/vite/tree/main/packages/plugin-legacy) were moved to TypeScript.

## The Ecosystem is Ready for v3

We have worked closely with projects in the ecosystem to ensure that frameworks powered by Vite are ready for Vite 3. [vite-ecosystem-ci](https://github.com/vitejs/vite-ecosystem-ci) allows us to run the CI's from the leading players in the ecosystem against Vite's main branch and receive timely reports before introducing a regression. Today's release should soon be compatible with most projects using Vite.

## Acknowledgments

Vite 3 is the result of the aggregate effort of members of the [Vite Team](/team) working together with ecosystem project maintainers and other collaborators to Vite core.

We want to thank everyone that have implemented features, and fixes, given feedback, and have been involved in Vite 3:

- Vite team members [@youyuxi](https://twitter.com/youyuxi), [@patak_dev](https://twitter.com/patak_dev), [@antfu7](https://twitter.com/antfu7), [@bluwyoo](https://twitter.com/bluwyoo), [@sapphi_red](https://twitter.com/sapphi_red), [@haoqunjiang](https://twitter.com/haoqunjiang), [@poyoho](https://github.com/poyoho), [@Shini_92](https://twitter.com/Shini_92), and [@retropragma](https://twitter.com/retropragma).
- [@benmccann](https://github.com/benmccann), [@danielcroe](https://twitter.com/danielcroe), [@brillout](https://twitter.com/brillout), [@sheremet_va](https://twitter.com/sheremet_va), [@userquin](https://twitter.com/userquin), [@enzoinnocenzi](https://twitter.com/enzoinnocenzi), [@maximomussini](https://twitter.com/maximomussini), [@IanVanSchooten](https://twitter.com/IanVanSchooten), the [Astro team](https://astro.build/), and all other maintainers of frameworks and plugins in the ecosystem in that helped shape v3.
- [@dominikg](https://github.com/dominikg) for his work on vite-ecosystem-ci.
- [@ZoltanKochan](https://twitter.com/ZoltanKochan) for his work on [pnpm](https://pnpm.io/), and for his responsiveness when we needed support with it.
- [@rixo](https://github.com/rixo) for HMR Partial Accept support.
- [@KiaKing85](https://twitter.com/KiaKing85) for getting the theme ready for the Vite 3 release, and [@\_brc_dd](https://twitter.com/_brc_dd) for working on the VitePress internals.
- [@CodingWithCego](https://twitter.com/CodingWithCego) for the new Spanish translation, and [@ShenQingchuan](https://twitter.com/ShenQingchuan), [@hiro-lapis](https://github.com/hiro-lapis) and others in the Chinese and Japanese translations teams for keeping the translated docs up to date.

We also want to thank individuals and companies sponsoring the Vite team, and companies investing in Vite development: some of [@antfu7](https://twitter.com/antfu7)'s work on Vite and the ecosystem is part of his job at [Nuxt Labs](https://nuxtlabs.com/), and [StackBlitz](https://stackblitz.com/) hired [@patak_dev](https://twitter.com/patak_dev) to work full time on Vite.

## What's Next

We'll take the following months to ensure a smooth transition for all the projects built on top of Vite. So the first minors will be focused on continuing our triaging efforts with a focus on newly opened issues.

The Rollup team is [working on its next major](https://twitter.com/lukastaegert/status/1544186847399743488), to be released in the following months. Once the Rollup plugins ecosystem has time to update, we'll follow up with a new Vite major. This will give us another opportunity to introduce more significant changes this year, which we could take to stabilize some of the experimental features introduced in this release.

If you are interested in helping improve Vite, the best way to get on board is to help with triaging issues. Join [our Discord](https://chat.vitejs.dev) and look for the `#contributing` channel. Or get involved in our `#docs`, `#help` others, or create plugins. We are just getting started. There are many open ideas to keep improving Vite's DX.
