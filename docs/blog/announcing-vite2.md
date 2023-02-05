---
sidebar: false
---

# Anunciando a Vite 2.0 {#announcing-vite-2}

<p style="text-align:center">
  <img src="/logo.svg" style="height:200px">
</p>

Hoje estamos entusiasmados em anunciar o lançamento oficial da Vite 2.0!

Vite (palavra Francesa para "rápido", pronunciado `/vit/`, como "veet") é um novo tipo de ferramenta para o desenvolvimento web do frontend. Pense na combinação de um servidor de desenvolvimento pré-configurado + empacotador, mas mais magro e mais rápido. Ela influencia o suporte de [módulos de ECMAScript nativo](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) do navegador e ferramentas escritas em linguagens que compilam para nativo como [esbuild](https://esbuild.github.io/) para entregar uma experiência de programação moderna e elegante.

Para ter ideia do quanto a Vite é rápida, consulte [esta comparação em vídeo](https://twitter.com/amasad/status/1355379680275128321) da inicialização de uma aplicação de React na Repl.it usando Vite versus a `create-react-app` (CRA).

Se já ouviste falar da Vite antes e gostarias de aprender mais sobre ela, consulte [o fundamento lógico por trás do projeto](https://vitejs.dev/guide/why.html). Se estiveres interessado em como a Vite se difere de outras ferramentas similares, consulte as [comparações](https://vitejs.dev/guide/comparisons.html).

## O Que Existe de Novo na 2.0 {#whats-new-in-2.0}

Desde que decidimos refatorar completamente o interior antes da 1.0 sair da RC, esta é de fato o primeiro lançamento estável da Vite. Dito isto, a Vite 2.0 trás consigo muitas consideráveis melhorias sobre a anterior encarnação:

### Núcleo Agnóstico de Abstração {#framework-agnostic-core}

A ideia original da Vite começou como um [protótipo experimental que serve componentes de Vue de ficheiro único sobre o módulo de ECMAScript nativo](https://github.com/vuejs/vue-dev-server). A Vite 1 foi uma continuação daquela ideia com um HMR implementado por cima.

A Vite 2.0 junta o que aprendemos ao longo do caminho e é redesenhada desde o zero com uma arquitetura interna mais robusta. Agora ela é complemente agnóstica de abstração, e todo suporte específico de abstração é delegado às extensões. Agora existem [modelos de projetos oficiais para Vue, React, Preact, Lit](https://github.com/vitejs/vite/tree/main/packages/create-vite), e esforços em andamento para a integração da Svelte.

### New Plugin Format and API

Inspired by [WMR](https://github.com/preactjs/wmr), the new plugin system extends Rollup's plugin interface and is [compatible with many Rollup plugins](https://vite-rollup-plugins.patak.dev/) out of the box. Plugins can use Rollup-compatible hooks, with additional Vite-specific hooks and properties to adjust Vite-only behavior (e.g. differentiating dev vs. build or custom handling of HMR).

The [programmatic API](https://vitejs.dev/guide/api-javascript.html) has also been greatly improved to facilitate higher level tools / frameworks built on top of Vite.

### esbuild Powered Dep Pre-Bundling

Since Vite is a native ESM dev server, it pre-bundles dependencies to reduce the number browser requests and handle CommonJS to ESM conversion. Previously Vite did this using Rollup, and in 2.0 it now uses `esbuild` which results in 10-100x faster dependency pre-bundling. As a reference, cold-booting a test app with heavy dependencies like React Material UI previously took 28 seconds on an M1-powered MacBook Pro and now takes ~1.5 seconds. Expect similar improvements if you are switching from a traditional bundler based setup.

### First-class CSS Support

Vite treats CSS as a first-class citizen of the module graph and supports the following out of the box:

- **Resolver enhancement**: `@import` and `url()` paths in CSS are enhanced with Vite's resolver to respect aliases and npm dependencies.
- **URL rebasing**: `url()` paths are automatically rebased regardless of where the file is imported from.
- **CSS code splitting**: a code-split JS chunk also emits a corresponding CSS file, which is automatically loaded in parallel with the JS chunk when requested.

### Server-Side Rendering (SSR) Support

Vite 2.0 ships with [experimental SSR support](https://vitejs.dev/guide/ssr.html). Vite provides APIs to efficiently load and update ESM-based source code in Node.js during development (almost like server-side HMR), and automatically externalizes CommonJS-compatible dependencies to improve development and SSR build speed. The production server can be completely decoupled from Vite, and the same setup can be easily adapted to perform pre-rendering / SSG.

Vite SSR is provided as a low-level feature and we are expecting to see higher level frameworks leveraging it under the hood.

### Opt-in Legacy Browser Support

Vite targets modern browsers with native ESM support by default, but you can also opt-in to support legacy browsers via the official [@vitejs/plugin-legacy](https://github.com/vitejs/vite/tree/main/packages/plugin-legacy). The plugin automatically generates dual modern/legacy bundles, and delivers the right bundle based on browser feature detection, ensuring more efficient code in modern browsers that support them.

## Give it a Try!

That was a lot of features, but getting started with Vite is simple! You can spin up a Vite-powered app literally in a minute, starting with the following command (make sure you have Node.js >=12):

```bash
npm init @vitejs/app
```

Then, check out [the guide](https://vitejs.dev/guide/) to see what Vite provides out of the box. You can also check out the source code on [GitHub](https://github.com/vitejs/vite), follow updates on [Twitter](https://twitter.com/vite_js), or join discussions with other Vite users on our [Discord chat server](http://chat.vitejs.dev/).
