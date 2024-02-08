---
title: A Vite 4.0 foi Publicada!
author:
  name: A Equipa da Vite
date: 2022-12-09
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
      content: https://pt.vitejs.dev/og-image-announcing-vite4.png
  - - meta
    - property: og:url
      content: https://pt.vitejs.dev/blog/announcing-vite4
  - - meta
    - property: og:description
      content: Anúncio do Lançamento da Vite 4
  - - meta
    - name: twitter:card
      content: summary_large_image
---

# A Vite 4.0 foi Publicada! {#vite-4-0-is-out}

_9 de Dezembro de 2022_ - Consultar o [anúncio da Vite 5.0](./announcing-vite5)

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

### @vitejs/plugin-react {#vitejs-plugin-react}

A [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react) é uma extensão que usa a esbuild e a Babel, alcançando HMR rápida com uma pegada de pacote pequena e a flexibilidade de ser capaz de usar a conduta de transformação da Babel.

### @vitejs/plugin-react-swc (new) {#vitejs-plugin-react-swc}

A [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) é a nova extensão que usa a esbuild durante a construção, mas substitui a Babel pela SWC durante o desenvolvimento. Para projetos grandes que não exigem extensões de React não padronizadas, inicialização fria e a Substituição de Módulo Instantânea (HMR, sigla em Inglês) podem ser significativamente mais rápidos.

## Compatibilidade do Navegador {#browser-compatibility}

A construção do navegador moderno agora aponta para `safari14` por padrão para compatibilidade de ES2020 mais ampla. Isto significa que as construções modernas podem agora usar [`BigInt`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) e que a [aglutinação de operador nulo](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing) já não é traduzida. Se precisas de suportar navegadores mais antigos, podes adicionar a [`@vitejs/plugin-legacy`](https://github.com/vitejs/vite/tree/main/packages/plugin-legacy) como de costume.

## Importando CSS como uma Sequência de Caracteres {#importing-css-as-a-string}

Na Vite 3, importar a exportação padrão de um ficheiro `.css` poderia introduzir um duplo carregamento de CSS.

```ts
import cssString from './global.css'
```

Este carregamento duplo poderia ocorrer já que um ficheiro `.css` será emitido e é provável que a sequência de caracteres de CSS será também usada pelo código da aplicação — por exemplo, injetado pela execução da abstração. Desde a Vite 4, a exportação padrão de `.css` [tem sido depreciada](https://github.com/vitejs/vite/issues/11094). O modificador de sufixo de consulta `?inline` precisa ser usado neste caso, já que este não emite os estilos de `.css` importados.

```ts
import stuff from './global.css?inline'
```

Aprenda mais no [Guia de Migração](/guide/migration).

## Variáveis de Ambiente {#environment-variables}

Agora a Vite usa `dotenv` 16 e `dotenv-expand` 9 (anteriormente usava `dotenv` 14 e `dotenv-expand` 5). Se tens um valor que inclui `#` ou `` ` ``, precisarás envolvê-los com aspas.

```diff
-VITE_APP=ab#cd`ef
+VITE_APP="ab#cd`ef"
```

Para mais detalhes, consulta a [`dotenv`](https://github.com/motdotla/dotenv/blob/master/CHANGELOG.md) e a [`dotenv-expand` changelog](https://github.com/motdotla/dotenv-expand/blob/master/CHANGELOG.md).

## Outras Funcionalidades {#other-features}

- Atalhos da Interface da Linha de Comando (pressione `h` durante o desenvolvimento para vê-los a todos) ([#11228](https://github.com/vitejs/vite/pull/11228))
- Suporte para pacote de remendo quando estiveres a pré-empacotar as dependências ([#10286](https://github.com/vitejs/vite/issues/10286))
- Limpador da saída de registos de construção ([#10895](https://github.com/vitejs/vite/issues/10895)) e interruptor para `KB` para alinhar com as ferramentas de programação do navegador ([#10982](https://github.com/vitejs/vite/issues/10982))
- Mensagens de erros melhoradas durante a SSR ([#11156](https://github.com/vitejs/vite/issues/11156))

## Tamanho de Pacote Reduzido {#reduced-package-size}

A Vite cuida da sua pegada, para acelerar a instalação, especialmente no caso de uso de zonas de experimentos para documentação e reproduções. E uma vez mais, esta versão principal trás melhorias no tamanho do pacote da Vite. O tamanho da instalação da Vite 4 é 23% mais pequena comparada ao da Vite 3.2.5 (14.1 MB vs 18.3 MB).

## Atualizações para Núcleo da Vite {#upgrades-to-vite-core}

O [Núcleo da Vite](https://github.com/vitejs/vite) e a [vite-ecosystem-ci](https://github.com/vitejs/vite-ecosystem-ci) continuam a evoluir para fornecer uma experiência melhor para os responsáveis e colaboradores e garantir que desenvolvimento da Vite escale até lidar com o crescimento no ecossistema.

### Extensões de Abstração fora do Núcleo {#framework-plugins-out-of-core}

[`@vitejs/plugin-vue`](https://github.com/vitejs/vite-plugin-vue) e [`@vitejs/plugin-react`](https://github.com/vitejs/vite-plugin-react) têm feito parte do mono-repositório do núcleo da Vite desde as primeiras versões da Vite. Isto ajudou-nos receber um laço de reações detalhadas quando fazíamos mudanças enquanto tínhamos tanto o Núcleo e as extensões testadas e lançadas juntas. Com a [vite-ecosystem-ci](https://github.com/vitejs/vite-ecosystem-ci) podemos receber estas reações com estas extensões desenvolvidas em repositórios independentes, então desde a Vite 4, [eles têm sido movidas para fora do mono-repositório do núcleo da Vite](https://github.com/vitejs/vite/pull/11158). Isto é significativo para a história agnóstica de abstração da Vite e permitirá construir equipas independentes para manter cada uma das extensões. Se tiveres bugs para reportar ou funcionalidades à pedir, crie as questões nos novos repositórios fazendo-os avançar: [`vitejs/vite-plugin-vue`](https://github.com/vitejs/vite-plugin-vue) e [`vitejs/vite-plugin-react`](https://github.com/vitejs/vite-plugin-react).

### Melhorias na `vite-ecosystem-ci` {#vite-ecosystem-ci-improvements}

A [vite-ecosystem-ci](https://github.com/vitejs/vite-ecosystem-ci) estende a integração contínua da Vite fornecendo relatórios de estado sobre demanda a respeito do estado das integrações contínuas das [os principais projetos a favor da corrente](https://github.com/vitejs/vite-ecosystem-ci/tree/main/tests). Nós executamos a `vite-ecosystem-ci` três vezes por semana contara o ramo principal da Vite e recebemos relatórios oportunos antes da introdução de uma regressão. A Vite 4 em breve será compatível com a maioria dos projetos usando a Vite, os quais já preparam ramos com as mudanças necessárias e serão os lançarão nos próximos dias. Nós também somos capazes de executar a `vite-ecosystem-ci` sobre demanda nos pedidos de atualização do repositório usando o `/ecosystem-ci run` em um comentário, permitindo-nos saber [os efeitos das mudanças](https://github.com/vitejs/vite/pull/11269#issuecomment-1343365064) antes de atirem o ramo principal.

## Agradecimentos {#acknowledgments}

A Vite 4 não seria possível sem as incontáveis horas de trabalho dos colaboradores da Vite, muitos deles responsáveis de projetos e extensões a favor da corrente, e os esforços da [Equipa da Vite](/team). Todos temos trabalhado juntos para melhorar a Experiência de Programação da Vite mais uma vez, para todas abstrações e aplicações usá-la. Somos gratos por sermos capazes de melhorar uma base comum para um ecossistema tão dinâmico.

We're also thankful to individuals and companies sponsoring the Vite team, and companies investing directly in Vite's future: [@antfu7](https://twitter.com/antfu7)'s work on Vite and the ecosystem is part of his job at [Nuxt Labs](https://nuxtlabs.com/), [Astro](https://astro.build) is funding [@bluwyoo](https://twitter.com/bluwyoo)'s' Vite core work, and [StackBlitz](https://stackblitz.com/) hires [@patak_dev](https://twitter.com/patak_dev) to work full time on Vite.

## Próximos Passos {#next-steps}

Nosso foco imediato estaria sobre a triagem das questões abertas recentemente para evitar a interrupção por possíveis regressões. Se gostarias de envolver-te e ajudar-nos a melhorar a Vite, sugerimos começar com a triagem de problemas. Junta-te à [nossa Discord](https://chat.vitejs.dev) e contacte-nos na canal `#contributing`. Polir a história da nossa `#docs`, e ajudar os outros no `#help`. Nós precisamos continuar a construir uma comunidade prestável e acolhedora para próxima onde de utilizadores, a medida que a adoção da Vite continua a crescer.

Existem muita frentes abertas para continuar a melhorar a Experiência de Programação de todos que escolheram a Vite para alimentar as suas abstrações e programar suas aplicações. Para diante!
