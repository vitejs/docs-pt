---
title: A Vite 5.1 está disponível!
author:
  name: The Vite Team
date: 2024-02-08
sidebar: false
head:
  - - meta
    - property: og:type
      content: website
  - - meta
    - property: og:title
      content: Anúncio da Vite 5.1
  - - meta
    - property: og:image
      content: https://vitejs.dev/og-image-announcing-vite5-1.png
  - - meta
    - property: og:url
      content: https://vitejs.dev/blog/announcing-vite5-1
  - - meta
    - property: og:description
      content: Anúncio do Lançamento da Vite 5.1
  - - meta
    - name: twitter:card
      content: summary_large_image
---

# A Vite 5.1 está disponível {#vite-5-1-is-out}

_8 de Fevereiro de 2024_

![Imagem de Capa do Anúncio da Vite 5.1](/og-image-announcing-vite5-1.png)

A Vite 5 [foi lançada](./announcing-vite5.md) em Novembro passado, e representou um outro grande salto para a Vite e o ecossistema. Há algumas semanas, comemoramos 10 milhões de descargas semanais da npm e 900 colaboradores ao repositório da Vite. Hoje, temos o prazer de anunciar o lançamento da Vite 5.1.

Hiperligações rápidas: [Documentação](/), [Registo de Alterações](https://github.com/vitejs/vite/blob/main/packages/vite/CHANGELOG.md#510-2024-02-08)

Documentação em outros idiomas: [简体中文](https://cn.vitejs.dev/), [日本語](https://ja.vitejs.dev/), [Español](https://es.vitejs.dev/), [Português](https://pt.vitejs.dev/), [한국어](https://ko.vitejs.dev/), [Deutsch](https://de.vitejs.dev/)

Nós podemos experimentar a Vite 5.1 online na StackBlitz: [vanilla](https://vite.new/vanilla-ts), [vue](https://vite.new/vue-ts), [react](https://vite.new/react-ts), [preact](https://vite.new/preact-ts), [lit](https://vite.new/lit-ts), [svelte](https://vite.new/svelte-ts), [solid](https://vite.new/solid-ts), [qwik](https://vite.new/qwik-ts).

Para os que forem novos na Vite, sugere-se primeiramente a leitura dos guias [Começar](/guide/) e [Funcionalidades](/guide/features).

Para atualizar-nos, seguimos a [X](https://x.com/vite_js) ou [Mastodon](https://webtoo.ls/@vite).

## Interface de Programação de Execução da Vite {#vite-runtime-api}

A Vite 5.1 adiciona suporte experimental para uma nova interface de programação do tempo de execução da Vite. Esta permite executar qualquer código processando-o primeiro com as extensões da Vite. É diferente de `server.ssrLoadModule` porque a implementação do tempo de execução é separada do servidor. Isto permite que os autores de bibliotecas e abstrações implementem a sua própria camada de comunicação entre o servidor e o tempo de execução. Esta nova interface de programação destina-se a substituir as atuais primitivas da interpretação do lado do servidor da Vite quando estiver estável.

A nova interface de programação traz muitos benefícios:

- Suporte à substituição de módulo instantânea durante a interpretação do lado do servidor.
- É separada do servidor, pelo que não existe limite ao número de clientes que podem usar um único servidor
- Cada cliente tem a sua própria memória transitória de módulos (podemos até comunicar com esta da maneira que quisermos - usando canais de mensagens/chamada de busca/chamada direta de função/tomada da Web).
- Não depende de nenhuma interface de programação embutida da Node/Deno, pelo que pode ser executada em qualquer ambiente.
- É fácil de integrar com ferramentas que têm o seu próprio mecanismo para executar código (podemos fornecer um executor para usar `eval` ao invés de `new AsyncFunction`, por exemplo).

A ideia inicial [foi proposto por Pooya Parsa](https://github.com/nuxt/vite/pull/201) e implementada por [Anthony Fu](https://github.com/antfu) como o pacote [vite-node](https://github.com/vitest-dev/vitest/tree/main/packages/vite-node#readme) para [alimentar a interpretação do lado do servidor de desenvolvimento da Nuxt 3](https://antfu.me/posts/dev-ssr-on-nuxt) e mais tarde também usada como base para [Vitest](https://vitest.dev). Portanto, a ideia geral do [vite-node](https://github.com/vitest-dev/vitest/tree/main/packages/vite-node#readme) foi testada em batalha por algum tempo. Esta é uma nova iteração da interface da programação por [Vladimir Sheremet](https://github.com/sheremet-va), que já havia re-implementado o [vite-node](https://github.com/vitest-dev/vitest/tree/main/packages/vite-node#readme) na [Vitest](https://vitest.dev) e aproveitou os aprendizados para tornar a interface de programação ainda mais poderosa e flexível ao adicioná-la ao Núcleo da Vite. O pedido de atualização de repositório esteve um ano em preparação, podemos ver a evolução e as discussões com os responsáveis do ecossistema [neste hiperligação](https://github.com/vitejs/vite/issues/12165).

Nós podemos ler mais no [guia da interface de programação da execução da Vite](/guide/api-vite-runtime) e [dar a nossa opinião](https://github.com/vitejs/vite/discussions/15774).

## Funcionalidades {#features}

### Suporte Melhorado para `.css?url` {#improved-support-for-css-url}

Import CSS files as URLs now works reliably and correctly. This was the last remaining hurdle in Remix's move to Vite. See ([#15259](https://github.com/vitejs/vite/issues/15259)).

### `build.assetsInlineLimit` agora suporta uma função retorno de chamada {#build-assetsinlinelimit-now-supports-a-callback}

Users can now [provide a callback](/config/build-options.html#build-assetsinlinelimit) that returns a boolean to opt-in or opt-out of inlining for specific assets. If `undefined` is returned, the defalt logic applies. See ([#15366](https://github.com/vitejs/vite/issues/15366)).

### "HMR" Melhorada para Importação Circular {#improved-hmr-for-circular-import}

In Vite 5.0, accepted modules within circular imports always triggered a full page reload even if they can be handled fine in the client. This is now relaxed to allow HMR to apply without a full page reload, but if any error happens during HMR, the page will be reloaded. See ([#15118](https://github.com/vitejs/vite/issues/15118)).

### Suportar `ssr.external: true` para exteriorizar todos os pacotes da "SSR" {#support-ssr-external-true-to-externalize-all-ssr-packages}

Historically, Vite externalizes all packages except for linked packages. This new option can be used to force externalize all packages including linked packages too. This is handy in tests within monorepos where we want to emulate the usual case of all packages externalized, or when using `ssrLoadModule` to load an arbitrary file and we want to always external packages as we don't care about HMR. See ([#10939](https://github.com/vitejs/vite/issues/10939)).

### Expõe o método `close` no servidor de pré-visualização {#expose-close-method-in-the-preview-server}

The preview server now exposes a `close` method, which will properly teardown the server including all opened socket connections. See ([#15630](https://github.com/vitejs/vite/issues/15630)).

### Melhorias de Desempenho {#performance-improvements}

Vite keeps getting faster with each release, and Vite 5.1 is packed with performance improvements. We measured the loading time for 10K modules (25 level deep tree) using [vite-dev-server-perf](https://github.com/yyx990803/vite-dev-server-perf) for all minor versions from Vite 4.0. This is a good benchmark to meassure the effect of Vite's bundle-less approach. Each module is a small TypeScript file with a counter and imports to other files in the tree, so this mostly meassuring the time it takes to do the requests a separate modules. In Vite 4.0, loading 10K modules took 8 seconds on a M1 MAX. We had a breakthrough in [Vite 4.3 were we focused on performance](./announcing-vite4-3.md), and we were able to load them in 6.35 seconds. In Vite 5.1, we managed to do another performance leap. Vite is now serving the 10K modules in 5.35 seconds.

![Vite 10K Modules Loading time progression](/vite5-1-10K-modules-loading-time.png)

The results of this benchmark run on Headless Puppeteer and are a good way to compare versions. They don't represent the time as experienced by users though. When running the same 10K modules in an Incognito window is Chrome, we have:

| 10K Modules           | Vite 5.0 | Vite 5.1 |
| --------------------- | :------: | :------: |
| Loading time          |  2892ms  |  2765ms  |
| Loading time (cached) |  2778ms  |  2477ms  |
| Full reload           |  2003ms  |  1878ms  |
| Full reload (cached)  |  1682ms  |  1604ms  |

### Executa pré-processadores de CSS nas linhas de processamento {#run-css-preprocessors-in-threads}

Vite now has opt-in support for running CSS preprocessors in threads. You can enable it using [`css.preprocessorMaxWorkers: true`](/config/shared-options.html#css-preprocessormaxworkers). For a Vuetify 2 project, dev startup time was reduced by 40% with this feature enabled. There is [performance comparison for others setups in the PR](https://github.com/vitejs/vite/pull/13584#issuecomment-1678827918). See ([#13584](https://github.com/vitejs/vite/issues/13584)). [Give Feedback](https://github.com/vitejs/vite/discussions/15835).

### Novas opções para melhorar inicializações frias do servidor {#new-options-to-improve-server-cold-starts}

You can set `optimizeDeps.holdUntilCrawlEnd: false` to switch to a new strategy for deps optimization that may help in big projects. We're considering switching to this strategy by default in the future. [Give Feedback](https://github.com/vitejs/vite/discussions/15834). ([#15244](https://github.com/vitejs/vite/issues/15244))

### Resolução mais rápida com verificações provisionadas {#faster-resolving-with-cached-checks}

The `fs.cachedChecks` optimization is now enabled by default. In Windows, `tryFsResolve` was ~14x faster with it, and resolving ids overall got a ~5x speed up in the triangle benchmark. ([#15704](https://github.com/vitejs/vite/issues/15704))

### Melhorias de desempenho interno {#internal-performance-improvements}

The dev server had several incremental performance gains. A new middleware to short-circuit on 304 ([#15586](https://github.com/vitejs/vite/issues/15586)). We avoided `parseRequest` in hot paths ([#15617](https://github.com/vitejs/vite/issues/15617)). Rollup is now properly lazy loaded ([#15621](https://github.com/vitejs/vite/issues/15621))

## Depreciações {#deprecations}

We continue to reduce Vite's API surface where possible to make the project manintainable long term.

### Opção `as` na `import.meta.glob` depreciada {#deprecated-as-option-in-import-meta-glob}

The standard moved to [Import Attributes](https://github.com/tc39/proposal-import-attributes), but we don't plan to replace `as` with a new option at this point. Instead, it is recommended that the user switches to `query`. See ([#14420](https://github.com/vitejs/vite/issues/14420)).

### Pré-empacotamento de tempo de construção experimental removido {#removed-experimental-build-time-pre-bundling}

Build-time pre-bundling, an experimental feature added in Vite 3, is removed. With Rollup 4 switching its parser to native, and Rolldown being worked on, both the performance and the dev-vs-build inconsistency story for this feature are no longer valid. We want to continue improving dev/build consistency, and have concluded that using Rolldown for "prebundling during dev" and "production builds" is the better bet moving forward. Rolldown may also implement caching in a way that is a lot more efficient during build than deps prebundling. See ([#15184](https://github.com/vitejs/vite/issues/15184)).

## Participar {#get-involved}

We are grateful to the [900 contributors to Vite Core](https://github.com/vitejs/vite/graphs/contributors), and the maintainers of plugins, integrations, tools, and translations that keeps pushing the ecosystem forward. If you're enjoying Vite, we invite you to participate and help us. Check out our [Contributing Guide](https://github.com/vitejs/vite/blob/main/CONTRIBUTING.md), and jump into [triaging issues](https://github.com/vitejs/vite/issues), [reviewing PRs](https://github.com/vitejs/vite/pulls), answering questions at [GitHub Discussions](https://github.com/vitejs/vite/discussions) and helping others in the community in [Vite Land](https://chat.vitejs.dev).

## Agradecimentos {#acknowledgments}

Vite 5.1 is possible thanks to our community of contributors, maintainers in the ecosystem, and the [Vite Team](/team). A shoutout the individuals and companies sponsoring Vite development. [StackBlitz](https://stackblitz.com/), [Nuxt Labs](https://nuxtlabs.com/), and [Astro](https://astro.build) for hiring Vite team members. And also to the sponsors on [Vite's GitHub Sponsors](https://github.com/sponsors/vitejs), [Vite's Open Collective](https://opencollective.com/vite), and [Evan You's GitHub Sponsors](https://github.com/sponsors/yyx990803).
