---
title: A Vite 5.0 foi Publicada!
author:
  name: A Equipa da Vite
date: 2023-11-16
sidebar: false
head:
  - - meta
    - property: og:type
      content: website
  - - meta
    - property: og:title
      content: Anunciando a Vite 5
  - - meta
    - property: og:image
      content: https://pt.vite.dev/og-image-announcing-vite5.png
  - - meta
    - property: og:url
      content: https://pt.vite.dev/blog/announcing-vite5
  - - meta
    - property: og:description
      content: Anúncio do Lançamento da Vite 5
  - - meta
    - name: twitter:card
      content: summary_large_image
---

# A Vite 5.0 foi Lançada! {#vite-5-0-is-out}

_16 de Novembro de 2023_

![Imagem da Capa do Anúncio da Vite 5](/og-image-announcing-vite5.png)

A Vite 4 [foi lançada](./announcing-vite4.md) a quase um ano atrás, e serviu como uma base sólida para o ecossistema. Os descarregamentos de npm por semana saltaram de 2.5 milhões a 7.5 milhões, conforme os projetos continuarem construindo sobre uma infraestrutura partilhada. As abstrações continuaram a inovar, e sobre a [Astro](https://astro.build/), [Nuxt](https://nuxt.com/), [SvelteKit](https://kit.svelte.dev/), [Solid Start](https://www.solidjs.com/blog/introducing-solidstart), [Qwik City](https://qwik.builder.io/qwikcity/overview/), e entree outras, vimos novas abstrações juntando-se e tornando o ecossistema mais forte. [RedwoodJS](https://redwoodjs.com/) e [Remix](https://remix.run/) mudando para Vite pavimenta o caminho para mais adoção no ecossistema da React. [Vitest](https://vitest.dev) continuou crescendo em ritmo ainda mais rápido do que a Vite. A sua equipa tem sido muito dedicada e [lançará em breve a Vitest 1.0](https://github.com/vitest-dev/vitest/issues/3596). A história da Vite quando usada com outras ferramentas tais como [Storybook](https://storybook.js.org), [Nx](https://nx.dev), e [Playwright](https://playwright.dev) continuou crescendo, e o mesmo aplica-se aos ambientes, com o desenvolvimento da Vite trabalhando em ambas [Deno](https://deno.com) e [Bun](https://bun.sh).

Nós tivemos a segunda edição da [ViteConf](https://viteconf.org/23/replay) um mês atrás, hospedada pela [StackBlitz](https://stackblitz.com). Tal como no ano passado, a maioria dos projetos no ecossistema juntaram-se para partilhar ideias e conectaram-se para continuarem expandindo os comuns. Também estamos vendo novos pedaços a complementarem o cinto de ferramenta de meta-abstração como [Volar](https://volarjs.dev/) e [Nitro](https://nitro.unjs.io/). A equipa da Rollup lançou [Rollup 4](https://rollupjs.org) naquele mesmo dia, uma tradição que o Lukas começou no ano passado.

Seis meses atrás, a Vite 4.3 [foi lançada](./announcing-vite4.md). Este lançamento melhorou significativamente o desempenho do servidor de desenvolvimento. No entanto, ainda existe espaço amplo para melhoria. Na ViteConf, [Evan You apresentou o plano de longo-prazo da Vite para funcionar sobre a Rolldown](https://www.youtube.com/watch?v=hrdwQHoAp0M), uma portabilidade de Rust da Rollup com APIs compatíveis. Uma vez que esta estiver pronta, tencionamos usá-la no Núcleo da Vite para assumir as tarefas de ambas Rollup e esbuild. Isto significará um aumento no desempenho da construção (e mais adiante também no desempenho do desenvolvimento conforme movemos as partes sensíveis ao desempenho da própria Vite para a Rust), e uma grande redução de inconsistências entre o desenvolvimento e construção. A Rolldown está atualmente nos primeiros estágios e a equipa está preparando-se para tornar aberta a base de código antes do final do ano. Fique atento!

Hoje, marcamos um outro grande marco no caminho da Vite. A [equipa](/team) da Vite, os [colaboradores](https://github.com/vitejs/vite/graphs/contributors), e os parceiros do ecossistema, estão entusiasmados em anunciar o lançamento da Vite 5. A Vite agora está usando a [Rollup 4](https://github.com/vitejs/vite/pull/14508), o que já representa um grande aumento no desempenho da construção. E também existem novas opções para melhorar o nosso perfil de desempenho do servidor de desenvolvimento.

A Vite 5 foca-se em limpar a API (removendo funcionalidades depreciadas) e aperfeiçoar várias funcionalidades fechando os problemas antigos, por exemplo mudar `define` para usar as substituições da árvore de sintaxe abstrata correta ao invés de expressões regulares. Nós também continuámos a marcar passos para garantir o futuro da Vite  (Node.js 18+ agora é obrigatória, e [a API da Node de CommonJS foi depreciada](/guide/migration#deprecate-cjs-node-api)).

Ligações rápidas:

- [Documentação](/)
- [Guia de Migração](/guide/migration)
- [Relatório de Mudança](https://github.com/vitejs/vite/blob/main/packages/vite/CHANGELOG.md#500-2023-11-16)

Documentações em outros idiomas:

- [简体中文](https://cn.vite.dev/)
- [日本語](https://ja.vite.dev/)
- [Español](https://es.vite.dev/)
- [Português](https://pt.vite.dev/)
- [한국어](https://ko.vite.dev/)
- [Deutsch](https://de.vite.dev/) (tradução nova!)

Se formos novo a Vite, sugerimos ler primeiro os guias [Começar](/guide/) e [Funcionalidades](/guide/features).

Nós apreciamos os mais de [850 colaboradores ao Núcleo da Vite](https://github.com/vitejs/vite/graphs/contributors), e os responsáveis e colaboradores das extensões, integrações, ferramentas, e traduções da Vite que ajudaram-nos a chegar onde estamos. Nós encorajamos-te a envolver-se e continuar a melhorar a Vite connosco. É possível aprender mais no nosso [Guia de Contribuição](https://github.com/vitejs/vite/blob/main/CONTRIBUTING.md). Para começar, recomendamos [fazer a triagem de questões](https://github.com/vitejs/vite/issues), [revisar os pedidos de atualização do repositório](https://github.com/vitejs/vite/pulls), enviar pedidos de atualização do repositório de testes que estiverem falhando baseados nas questões abertas, e ajudar outros nas [Discussões](https://github.com/vitejs/vite/discussions) e no [fórum de ajuda](https://discord.com/channels/804011606160703521/1019670660856942652) da Vite Land. É possível aprender muito ao longo do caminho e ter um caminho suave para mais contribuições ao projeto. Se houverem dúvidas, é possível juntar-se a nossa [comunidade da Discord](http://chat.vite.dev/) e dizer um oi no [canal `#contributing`](https://discord.com/channels/804011606160703521/804439875226173480).

Mantenha-se atualizado, siga-nos na [X](https://twitter.com/vite_js) ou [Mastodon](https://webtoo.ls/@vite).

## Começar com a Vite 5 {#quick-start-with-vite-5}

Nós usamos `pnpm create vite` para estruturar um projeto de Vite com a nossa abstração preferida, abrimos um modelo de projeto iniciado na rede para brincar com a Vite usando [vite.new](https://vite.new). Nós também podemos executar `pnpm create vite-extra` para obter acesso aos modelos de outras abstrações e execuções (pontos de partida de Solid, Deno, interpretação do lado do servidor, e biblioteca). Os modelos de `create vite-extra` também estão disponíveis quando executamos `create vite` sob a opção `Others`.

Nota que os modelos de ponto de partida da Vite estão destinados a serem usados como uma zona de testes para testar a Vite com diferentes abstrações. Quando construirmos o nosso próximo projeto, recomendamos alcançar os pontos de partida recomendados por cada abstração. Algumas abstrações agora também redirecionam `create vite` aos seus pontos de partida (`create-vue` e `Nuxt 3` para Vue, e `SvelteKit` para Svelte).

## Suporte da Node.js {#node-js-support}

A Vite já não suporta Node.js 14 / 16 / 17 / 19, as quais alcançaram a sua expetativa de vida. A Node.js 18 / 20+ agora é obrigatória.

## Desempenho {#performance}

Sobre as melhorias de desempenho de construção da Rollup 4, existe um novo guia para ajudar-nos a identificar e corrigir problemas de desempenho comuns em [https://pt.vite.dev/guide/performance](/guide/performance).

A Vite 5 também introduz [`server.warmup`](/guide/performance#warm-up-frequently-used-files), uma nova funcionalidade para melhorar o tempo de inicialização. Esta permite-nos definir uma lista de módulos que deveriam ser pré-transformadas logo que o servidor começar. Quando usamos [`--open` ou `server.open`](/config/server-options#server-open), a Vite também aquecerá automaticamente o ponto de entrada da nossa aplicação ou a URL fornecida a abrir.

## Mudanças Principais {#main-changes}

- [A Vite agora é alimentada pela Rollup 4](/guide/migration#rollup-4)
- [A API da Node de CommonJS foi depreciada](/guide/migration#deprecate-cjs-node-api)
- [Reformular a estratégia de substituição de `define` e `import.meta.env.*`](/guide/migration#rework-define-and-import-meta-env-replacement-strategy)
- [O valor dos módulos exteriorizados da interpretação do lado do servidor agora corresponde a produção](/guide/migration#ssr-externalized-modules-value-now-matches-production)
- [`worker.plugins` agora é uma função](/guide/migration#worker-plugins-is-now-a-function)
- [Permitir caminho que contém `.` retroceder a `index.html`](/guide/migration#allow-path-containing-to-fallback-to-index-html)
- [Alinhar o comportamento de serviço de HTML da pré-visualização e desenvolvimento](/guide/migration#align-dev-and-preview-html-serving-behaviour)
- [Os ficheiros de manifesto agora são gerados no diretório `.vite` por padrão](/guide/migration#manifest-files-are-now-generated-in-vite-directory-by-default)
- [Os atalhos da interface da linha de comando exigem uma pressão de `Enter` adicional](/guide/migration#cli-shortcuts-require-an-additional-enter-press)
- [Atualizar o comportamento da TypeScript de `experimentalDecorators` e `useDefineForClassFields`](/guide/migration#update-experimentaldecorators-and-usedefineforclassfields-typescript-behaviour)
- [Remover a opção `--https` e `https: true`](/guide/migration#remove-https-flag-and-https-true)
- [Remover as APIs `resolvePackageEntry` e `resolvePackageData`](/guide/migration#remove-resolvepackageentry-and-resolvepackagedata-apis)
- [Remove as APIs depreciadas anteriormente](/guide/migration#removed-deprecated-apis)
- [Ler mais sobre mudanças avançadas que afetam os autores de extensão e ferramenta](/guide/migration#advanced)

## Migrando para Vite 5 {#migrating-to-vite-5}

Nós temos trabalhado com os parceiros do ecossistema para garantir uma migração suave para esta nova atualização principal. Novamente, a [`vite-ecosystem-ci`](https://www.youtube.com/watch?v=7L4I4lDzO48) tem sido decisiva para ajudar-nos a fazer mudanças mais ousadas enquanto evitamos regressões. Nós estamos radiantes em ver outros ecossistemas a adotarem esquemas semelhantes para melhorar a colaboração entre os seus projetos e responsáveis a jusante.

Para maioria dos projetos, a atualização para Vite 5 deve ser simples. Mas aconselhamos revisar o [Guia de Migração detalhado] antes de atualizar.

Uma quebra de baixo nível com a lista completa de mudanças ao núcleo da Vite pode ser encontrado no [Relatório de Mudança da Vite 5](https://github.com/vitejs/vite/blob/main/packages/vite/CHANGELOG.md#500-2023-11-16).

## Agradecimentos {#acknowledgments}

A Vite 5 é o resultado de longas horas de trabalho da nossa comunidade de colaboradores, responsáveis a jusante, autores de extensões, e a [Equipa da Vite](/team). Um grande grito ao [Bjorn Lu](https://twitter.com/bluwyoo) por liderar o processo de lançamento para esta atualização principal.

Nós também somos gratos aos indivíduos e empresas patrocinando o desenvolvimento da Vite. [StackBlitz](https://stackblitz.com/), [Nuxt Labs](https://nuxtlabs.com/), e [Astro](https://astro.build) continuam a investir na Vite contratando os membros da equipa da Vite. Um grito aos patrocinadores na [GitHub Sponsors da Vite](https://github.com/sponsors/vitejs), [Open Collective da Vite](https://opencollective.com/vite), e [GitHub Sponsors do Evan You](https://github.com/sponsors/yyx990803). Uma menção especial à [Remix](https://remix.run/) por tornar-se um patrocinador de Ouro e por contribuir de volta depois de mudar para Vite.
