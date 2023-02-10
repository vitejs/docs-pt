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

### Novo Formato de Extensão e API {#new-plugin-format-and-api}

Inspirada pela [WMR](https://github.com/preactjs/wmr), o novo sistema de extensão estende a interface de extensão da Rollup e é [compatível com muitas extensões de Rollup](https://vite-rollup-plugins.patak.dev/) fora da caixa. As extensões podem usar gatilhos compatíveis com a Rollup, com gatilhos específicos de Vite adicionais e propriedades para ajustar apenas o comportamento da Vite (por exemplo, a diferenciação entre o desenvolvimento e construção ou a manipulação personalizada da HMR).

A [API programática](https://vitejs.dev/guide/api-javascript.html) também tem sido grandemente aprimorada para facilitar ferramentas ou abstrações de mais alto nível construídas sobre a Vite.

### Pré-Empacotamento de Dependência Alimentado pela esbuild {#esbuild-powered-dep-pre-bundling}

Já que a Vite é um servidor de desenvolvimento de módulo de ECMAScript nativo, ela pré-empacota as dependências para reduzir o número de requisições do navegador e lida com a conversão de CommonJS para ESM. Anteriormente a Vite fazia isto usando a Rollup, e agora na versão 2.0 usa a `esbuild` o que resulta num pré-empacotamento de dependência 10 à 100 vezes mais rápido. Como referência, iniciar completamente uma aplicação de teste com dependências pesadas como a React Material UI anteriormente levava 28 segundos em um MackBook Pro alimentado pelo processador M1 e agora leva mais ou menos 1.5 segundos. Espere melhorias similares se estiveres a mudar de uma configuração baseada em um empacotador tradicional.

### Suporte de CSS de Primeira Classe {#first-class-css-support}

A Vite trata a CSS como cidadão de primeira classe do gráfico de módulo e suporta fora da caixa os seguintes:

- **Otimização do Resolvedor**: Os caminhos de `@import` e `url()` na CSS são otimizados com resolvedor da Vite para respeitas os pseudónimos e dependências do npm.
- **Rebaseamento da URL**: os caminhos de `url()` são automaticamente rebaseados independentemente de onde o ficheiro é importado.
- **Separação de código de CSS**: um pedaço de JavaScript da separação de código também emite um ficheiro de CSS correspondente, o qual é carregado automaticamente em paralelo com o pedaço de JavaScript quando requisitado.

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
