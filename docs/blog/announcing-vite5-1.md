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

A importação de ficheiros de CSS como URLs funciona agora de maneira fiável e correta. Este era o último obstáculo que faltava na mudança da Remix para a Vite. Consultar ([#15259](https://github.com/vitejs/vite/issues/15259)).

### `build.assetsInlineLimit` agora suporta uma função retorno de chamada {#build-assetsinlinelimit-now-supports-a-callback}

Os utilizadores podem agora [fornecer uma função de retorno de chamada](/config/build-options#build-assetsinlinelimit) que retorna um booleano para ativar ou desativar a incorporação para recursos específicos. Se `undefined` for retornado, a lógica padrão aplica-se. Consultar ([#15366](https://github.com/vitejs/vite/issues/15366)).

### Substituição de módulo instantânea melhorada para importação circular {#improved-hmr-for-circular-import}

Na Vite 5.0, os módulos aceites dentro das importações circulares acionavam sempre uma recarga da página inteira, mesmo que pudessem ser manipulados sem problemas no cliente. Esta situação é agora flexibilizada para permitir que a substituição de módulo instantânea seja aplicada sem uma recarga completa da página, mas se ocorrer algum erro durante a substituição de módulo instantânea, a página será recarregada. Consultar ([#15118](https://github.com/vitejs/vite/issues/15118)).

### Suportar `ssr.external: true` para exteriorizar todos os pacotes da interpretação do lado do servidor {#support-ssr-external-true-to-externalize-all-ssr-packages}

Historicamente, a Vite exteriorizar todos os pacotes, exceto os pacotes ligados. Esta nova opção pode ser usada para forçar a exteriorização de todos os pacotes, incluindo também os pacotes ligados. Isto é útil em testes dentro de mono-repositórios onde queremos emular o caso habitual de todos os pacotes exteriorizados, ou quando usamos `ssrLoadModule` para carregar um ficheiro arbitrário e queremos sempre pacotes externos já que não nos preocupamos com a substituição de módulo de instantânea. Consultar ([#10939](https://github.com/vitejs/vite/issues/10939)).

### Expõe o método `close` no servidor de pré-visualização {#expose-close-method-in-the-preview-server}

O servidor de pré-visualização agora expõe um método `close`, que desmontará corretamente o servidor incluindo todas as conexões de tomadas abertas. Consultar ([#15630](https://github.com/vitejs/vite/issues/15630)).

### Melhorias de Desempenho {#performance-improvements}

A Vita continua a ficar mais rápida a cada lançamento, e a Vite 5.1 está repleto de melhorias de desempenho. Medimos o tempo de carregamento de 10K módulos (árvore de 25 níveis de profundidade) usando [vite-dev-server-perf](https://github.com/yyx990803/vite-dev-server-perf) para todas as versões menores da Vite 4.0. Trata-se duma boa referência para medir o efeito da abordagem sem pacotes da Vite. Cada módulo é um pequeno ficheiro de TypeScript com um contador e importações para outros ficheiros na árvore, o que significa que é necessário medir o tempo que demora a fazer as requisições em módulos separados. Na Vite 4.0, o carregamento de 10k módulos demorava 8 segundos num M1 MAX. Na Vite 4.3, fizemos um grande avanço quando nos concentrámos no desempenho e conseguimos carregá-los em 6,35 segundos. Na Vite 5.1, conseguimos dar mais um salto de desempenho. A Vite está agora a servir os 10k módulos em 5,35 segundos.

![Progressão do tempo de carregamento de 10k módulos da Vite](/vite5-1-10K-modules-loading-time.png)

Os resultados deste comparativo são executados no Puppeteer desgovernado e são uma boa maneira de comparar versões. No entanto, não representam o tempo vivido pelos utilizadores. Quando executamos os mesmos 10K módulos numa janela anónima no Chrome, temos:

| 10K Módulos           | Vite 5.0 | Vite 5.1 |
| --------------------- | :------: | :------: |
| Tempo de carregamento          |  2892ms  |  2765ms  |
| Tempo de carregamento (em memória transitória) |  2778ms  |  2477ms  |
| Recarga completa           |  2003ms  |  1878ms  |
| Recarga completa (em memória transitória)  |  1682ms  |  1604ms  |

### Executa pré-processadores de CSS nas linhas de processamento {#run-css-preprocessors-in-threads}

A Vite agora tem suporte opcional para executar os pré-processadores de CSS em linhas de processamento. Nós podemos ativá-la usando [`css.preprocessorMaxWorkers: true`](/config/shared-options#css-preprocessormaxworkers). Para um projeto de Vuetify 2, o tempo de inicialização do desenvolvimento foi reduzido em 40% com esta funcionalidade ativada. Existe uma [comparação de desempenho para outros configurações no pedido de atualização de repositório](https://github.com/vitejs/vite/pull/13584#issuecomment-1678827918). Consultar ([#13584](https://github.com/vitejs/vite/issues/13584)). [Opinar](https://github.com/vitejs/vite/discussions/15835).

### Novas opções para melhorar inicializações frias do servidor {#new-options-to-improve-server-cold-starts}

Nós podemos definir `optimizeDeps.holdUntilCrawlEnd: false` para alternar para uma nova estratégia de otimização de dependência que pode ajudar em grandes projetos. Estamos a considerar mudar para esta estratégia por padrão no futuro. [Opinar](https://github.com/vitejs/vite/discussions/15834). Consultar ([#15244](https://github.com/vitejs/vite/issues/15244)).

### Resolução mais rápida com verificações provisionadas {#faster-resolving-with-cached-checks}

A otimização de `fs.cachedChecks` agora é ativada por padrão. No Windows, `tryFsResolve` foi ~14x mais rápido com este, e a resolução de identificadores em geral teve uma velocidade ~5x maior triângulo comparativo. Consultar ([#15704](https://github.com/vitejs/vite/issues/15704)).

### Melhorias de desempenho interno {#internal-performance-improvements}

O servidor de desenvolvimento teve vários ganhos incrementais de desempenho. Um novo intermediário para curto-circuito no 304 ([#15586](https://github.com/vitejs/vite/issues/15586)). Evitámos `parseRequest` nos caminhos quentes ([#15617](https://github.com/vitejs/vite/issues/15617)). A Rollup é agora corretamente carregada preguiçosamente ([#15621](https://github.com/vitejs/vite/issues/15621)).

## Depreciações {#deprecations}

Continuamos a reduzir a superfície da interface de programação de aplicação da Vite sempre que possível para tornar o projeto sustentável a longo prazo.

### Opção `as` na `import.meta.glob` depreciada {#deprecated-as-option-in-import-meta-glob}

A norma passou aos [Atributos de Importação](https://github.com/tc39/proposal-import-attributes), mas não planeamos substituir `as` por uma nova opção neste altura. Em vez disto, recomenda-se que o utilizador mude para `query`. Consultar ([#14420](https://github.com/vitejs/vite/issues/14420)).

### Pré-empacotamento de tempo de construção experimental removido {#removed-experimental-build-time-pre-bundling}

O pré-empacotamento do tempo de construção, uma funcionalidade experimental adicionada na Vite 3, foi removida. Com a Rollup 4 a mudar o seu analisador sintático para nativo e a Rolldown a ser trabalhada, tanto a história do desempenho como a da inconsistência entre o desenvolvimento e a construção para esta funcionalidade já não são válidas. Queremos continuar a melhorar a consistência entre o desenvolvimento e compilação, e concluímos que usar a Rolldown para o “pré-empacotamento durante o desenvolvimento” e “construções de produção” é a melhor aposta para o futuro. A Rolldon também pode implementar o armazenamento transitório duma maneira que é muito mais eficiente durante a construção do que o pré-empacotamento de dependências. Consultar ([#15184](https://github.com/vitejs/vite/issues/15184)).

## Participar {#get-involved}

Estamos gratos aos [900 colaboradores do núcleo da Vite](https://github.com/vitejs/vite/graphs/contributors), e aos responsáveis de extensões, integrações, ferramentas e traduções que continuam a impulsionar o ecossistema. Se gosta da Vite, o convidamos a participar e a ajudar-nos. Consultar o nosso [Guia de Colaboração](https://github.com/vitejs/vite/blob/main/CONTRIBUTING.md), começar a fazer [triagem de problemas](https://github.com/vitejs/vite/issues), [revisar os PRs](https://github.com/vitejs/vite/pulls), responder perguntas nas [Discussões da GitHub](https://github.com/vitejs/vite/discussions) e a ajudar outras pessoas da comunidade na [Vite Land](https://chat.vitejs.dev).

## Agradecimentos {#acknowledgments}

A Vite 5.1 é possível graças à nossa comunidade de colaboradores, aos responsáveis do ecossistema e à [Equipa da Vite](/team). Uma saudação aos indivíduos e empresas que patrocinam o desenvolvimento da Vite. [StackBlitz](https://stackblitz.com/), [Nuxt Labs](https://nuxtlabs.com/), e [Astro](https://astro.build) por contratarem membros da equipa da Vite. E também aos patrocinadores no [GitHub Sponsors da Vite](https://github.com/sponsors/vitejs), [Open Collective da Vite](https://opencollective.com/vite), e [GitHub Sponsors do Evan You](https://github.com/sponsors/yyx990803).
