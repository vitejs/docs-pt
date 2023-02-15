---
sidebar: false
head:
  - - meta
    - property: og:type
      content: website
  - - meta
    - property: og:title
      content: Anunciando a Vite 4
  - - meta
    - property: og:image
      content: https://vitejs.dev/og-image-announcing-vite4.png
  - - meta
    - property: og:url
      content: https://vitejs.dev/blog/announcing-vite4
  - - meta
    - property: og:description
      content: Anúncio do Lançamento da Vite 4
  - - meta
    - name: twitter:card
      content: summary_large_image
---

# A Vite 4 está Publicada!

A Vite 3 [foi lançada](./announcing-vite3.md) a cinco meses atrás. Os descarregamentos do npm por semana foram de 1 milhão para 2.5 milhões desde então. O ecossistema também amadureceu, e contínua a crescer. No [levantamento da Jamstack Conf](https://twitter.com/vite_js/status/1589665610119585793) deste ano, o uso entre a comunidade saltou de 14% para 32% enquanto mantêm uma alta pontuação de satisfação de 9.7. Nós vimos os lançamentos estáveis da [Astro 1.0](https://astro.build/), [Nuxt 3](https://v3.nuxtjs.org/), e outras abstrações alimentadas pela Vite que estão a inovar e colaborar: [SvelteKit](https://kit.svelte.dev/), [Solid Start](https://www.solidjs.com/blog/introducing-solidstart), [Qwik City](https://qwik.builder.io/qwikcity/overview/). A Storybook anunciou o suporte de primeira classe para Vite como uma de suas principais funcionalidades para a [Storybook 7.0](https://storybook.js.org/blog/first-class-vite-support-in-storybook/). A Deno agora [suporta a Vite](https://www.youtube.com/watch?v=Zjojo9wdvmY). A adoção da [Vitest](https://vitest.dev) está explodindo, que representará em breve metade dos descarregamentos de npm da Vite. A Nx também está investindo no ecossistema, e [suporta oficialmente a Vite](https://nx.dev/packages/vite).

[![Ecossistema da Vite 4](/ecosystem-vite4.png)](https://viteconf.org/2022/replay)

De acordo com um mostruário do crescimento que a Vite e os projetos relacionados têm experimentado, o ecossistema da Vite reuniu em 11 Outubro na [ViteConf 2022](https://viteconf.org/2022/replay). Nós vimos representantes das principais abstrações e ferramentas de web a contarem histórias de inovação e colaboração. E em um movimento simbólico, a equipa da Rollup escolheu aquele exato dia para lançar a [Rollup 3](https://rollupjs.org).

Hoje, a [equipa](https://vitejs.dev/team) da Vite com a ajuda dos nossos parceiros do ecossistema, tem o prazer em anunciar o lançamento da Vite 4, alimentada durante momento da construção pela Rollup 3. Temos trabalhado com o ecossistema para garantir um caminho de atualização suave para esta nova versão principal. A Vite agora está a usar a [Rollup 3](https://github.com/vitejs/vite/issues/9870), o que permitiu-nos simplificar a manipulação de recurso interno da Vite e tem muitas melhorias. Consulte as [notas de lançamento da Rollup 3](https://github.com/rollup/rollup/releases/tag/v3.0.0).

![Imagem de Capa do Anúncio da Vite 4](/og-image-announcing-vite4.png)

Ligações rápidas:

- [Documentação](/)
- [Guia de Migração](/guide/migration)
- [Relatório de Mudança](https://github.com/vitejs/vite/blob/main/packages/vite/CHANGELOG.md#400-2022-12-09)

Documentação em outros idiomas:

- [简体中文](https://cn.vitejs.dev/)
- [日本語](https://ja.vitejs.dev/)
- [Español](https://es.vitejs.dev/)

Se começaste a usar a Vite recentemente, sugerimos a leitura do [Guia do Porquê da Vite](https://vitejs.dev/guide/why.html) e consultar [o Começo](https://vitejs.dev/guide/) e [guia de Funcionalidades](https://vitejs.dev/guide/features). Se quiseres envolver-te, contribuições são bem-vindas na [GitHub](https://github.com/vitejs/vite). Quase [700 colaboradores](https://github.com/vitejs/vite/graphs/contributors) têm contribuído com a Vite. Siga as atualizações na [Twitter](https://twitter.com/vite_js) e [Mastodon](https://webtoo.ls/@vite), ou colabore com os outros na nossa [comunidade da Discord](http://chat.vitejs.dev/).

## Começar a brincar com a Vite 4 {#start-playing-with-vite-4}

Use `pnpm create vite` para estruturar um projeto de Vite com a tua abstração preferida, ou abra um modelo de projeto de ponto de partida online para brincar com a Vite 4 usando a [vite.new](https://vite.new).

Tu podes também executar `pnpm create vite-extra` para ter acesso aos modelos de projeto de outras abstrações e executores (Solid, Deno, SSR, e biblioteca para começar). Os modelos de projeto de `create vite-extra` também estão disponíveis quando executas `create vite` sob a opção `Others`.

Nota que os modelos de projeto de ponto de partida da Vite estão destinados a serem usados como uma zona de experimentos para testar a Vite com diferentes abstrações. Quando estiveres a construir o teu próximo projeto, recomendamos consultar os pontos de partida recomendados por cada abstração. Algumas abstrações agora também redirecionam `create vite` para os seus pontos de partida (`create-vue` e `Nuxt 3` para a Vue, e `SvelteKit` para a Svelte).

## Nova extensão de React usando a SWC durante o desenvolvimento {#new-react-plugin-using-swc-during-development}

A [SWC](https://swc.rs/) é agora uma substituição madura para a [Babel](https://babeljs.io/), especialmente no contexto dos projetos de React. A implementação da Atualização Rápida de React da SWC é muito mais rápida do que a de Babel, e para alguns projetos, é agora uma alternativa melhor. A partir da Vite 4, duas extensões estão disponíveis para os projetos de React com diferentes compromissos. Nós acreditamos que ambas abordagens são dignas de serem suportadas, e continuaremos a explorar melhorias para ambas as extensões no futuro.

### @vitejs/plugin-react

[@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react) is a plugin that uses esbuild and Babel, achieving fast HMR with a small package footprint and the flexibility of being able to use the Babel transform pipeline.

### @vitejs/plugin-react-swc (new)

[@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) is a new plugin that uses esbuild during build, but replaces Babel with SWC during development. For big projects that don't require non-standard React extensions, cold start and Hot Module Replacement (HMR) can be significantly faster.

## Browser Compatibility

The modern browser build now targets `safari14` by default for wider ES2020 compatibility. This means that modern builds can now use [`BigInt`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) and that the [nullish coalescing operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing) isn't transpiled anymore. If you need to support older browsers, you can add [`@vitejs/plugin-legacy`](https://github.com/vitejs/vite/tree/main/packages/plugin-legacy) as usual.

## Importing CSS as a String

In Vite 3, importing the default export of a `.css` file could introduce a double loading of CSS.

```ts
import cssString from './global.css'
```

This double loading could occur since a `.css` file will be emitted and it's likely that the CSS string will also be used by the application code — for example, injected by the framework runtime. From Vite 4, the `.css` default export [has been deprecated](https://github.com/vitejs/vite/issues/11094). The `?inline` query suffix modifier needs to be used in this case, as that doesn't emit the imported `.css` styles.

```ts
import stuff from './global.css?inline'
```

Learn more in the [Migration Guide](/guide/migration).

## Environment Variables

Vite now uses `dotenv` 16 and `dotenv-expand` 9 (previously `dotenv` 14 and `dotenv-expand` 5). If you have a value including `#` or `` ` ``, you will need to wrap them with quotes.

```diff
-VITE_APP=ab#cd`ef
+VITE_APP="ab#cd`ef"
```

For more details, see the [`dotenv`](https://github.com/motdotla/dotenv/blob/master/CHANGELOG.md) and [`dotenv-expand` changelog](https://github.com/motdotla/dotenv-expand/blob/master/CHANGELOG.md).

## Other Features

- CLI Shortcuts (press `h` during dev to see them all) ([#11228](https://github.com/vitejs/vite/pull/11228))
- Support for patch-package when pre bundling dependencies ([#10286](https://github.com/vitejs/vite/issues/10286))
- Cleaner build logs output ([#10895](https://github.com/vitejs/vite/issues/10895)) and switch to `kB` to align with browser dev tools ([#10982](https://github.com/vitejs/vite/issues/10982))
- Improved error messages during SSR ([#11156](https://github.com/vitejs/vite/issues/11156))

## Reduced Package Size

Vite cares about its footprint, to speed up installation, especially in the use case of playgrounds for documentation and reproductions. And once more, this major brings improvements in Vite's package size. Vite 4 install size is 23% smaller compared to vite 3.2.5 (14.1 MB vs 18.3 MB).

## Upgrades to Vite Core

[Vite Core](https://github.com/vitejs/vite) and [vite-ecosystem-ci](https://github.com/vitejs/vite-ecosystem-ci) continue to evolve to provide a better experience to maintainers and collaborators and to ensure that Vite development scales to cope with the growth in the ecosystem.

### Framework plugins out of core

[`@vitejs/plugin-vue`](https://github.com/vitejs/vite-plugin-vue) and [`@vitejs/plugin-react`](https://github.com/vitejs/vite-plugin-react) have been part of Vite core monorepo since the first versions of Vite. This helped us to get a close feedback loop when making changes as we were getting both Core and the plugins tested and released together. With [vite-ecosystem-ci](https://github.com/vitejs/vite-ecosystem-ci) we can get this feedback with these plugins developed on independent repositories, so from Vite 4, [they have been moved out of the Vite core monorepo](https://github.com/vitejs/vite/pull/11158). This is meaningful for Vite's framework-agnostic story and will allow us to build independent teams to maintain each of the plugins. If you have bugs to report or features to request, please create issues on the new repositories moving forward: [`vitejs/vite-plugin-vue`](https://github.com/vitejs/vite-plugin-vue) and [`vitejs/vite-plugin-react`](https://github.com/vitejs/vite-plugin-react).

### vite-ecosystem-ci improvements

[vite-ecosystem-ci](https://github.com/vitejs/vite-ecosystem-ci) extends Vite's CI by providing on-demand status reports on the state of the CIs of [most major downstream projects](https://github.com/vitejs/vite-ecosystem-ci/tree/main/tests). We run vite-ecosystem-ci three times a week against Vite's main branch and receive timely reports before introducing a regression. Vite 4 will soon be compatible with most projects using Vite, which already prepared branches with the needed changes and will be releasing them in the next few days. We are also able to run vite-ecosystem-ci on-demand on PRs using `/ecosystem-ci run` in a comment, allowing us to know [the effect of changes](https://github.com/vitejs/vite/pull/11269#issuecomment-1343365064) before they hit main.

## Acknowledgments

Vite 4 wouldn't be possible without uncountable hours of work by Vite contributors, many of them maintainers of downstream projects and plugins, and the efforts of the [Vite Team](/team). All of us have worked together to improve Vite's DX once more, for every framework and app using it. We're grateful to be able to improve a common base for such a vibrant ecosystem.

We're also thankful to individuals and companies sponsoring the Vite team, and companies investing directly in Vite's future: [@antfu7](https://twitter.com/antfu7)'s work on Vite and the ecosystem is part of his job at [Nuxt Labs](https://nuxtlabs.com/), [Astro](https://astro.build) is funding [@bluwyoo](https://twitter.com/bluwyoo)'s' Vite core work, and [StackBlitz](https://stackblitz.com/) hires [@patak_dev](https://twitter.com/patak_dev) to work full time on Vite.

## Next steps

Our immediate focus would be on triaging newly opened issues to avoid disruption by possible regressions. If you would like to get involved and help us improve Vite, we suggest starting with issues triaging. Join [our Discord](https://chat.vitejs.dev) and reach out on the `#contributing` channel. Polish our `#docs` story, and `#help` others. We need to continue to build a helpful and welcoming community for the next wave of users, as Vite's adoption continues to grow.

There are a lot of open fronts to keep improving the DX of everyone that has chosen Vite to power their frameworks and develop their apps. Onwards!
