---
title: A Vite 4.3 foi Lançada!
author:
  name: A Equipa da Vite
date: 2023-04-20
sidebar: false
head:
  - - meta
    - property: og:type
      content: website
  - - meta
    - property: og:title
      content: Anunciando a Vite 4.3
  - - meta
    - property: og:image
      content: https://pt.vite.dev/og-image-announcing-vite4-3.png
  - - meta
    - property: og:url
      content: https://pt.vite.dev/blog/announcing-vite4-3
  - - meta
    - property: og:description
      content: Anúncio do Lançamento da Vite 4.3
  - - meta
    - name: twitter:card
      content: summary_large_image
---

# A Vite 4.3 foi Lançada! {#vite-4-3-is-out}

_20 de Abril de 2023_

![Imagem da Capa do Anúncio da Vite 4.3](/og-image-announcing-vite4-3.png)

Ligações rápidas:

- Documentações: [English](/), [简体中文](https://cn.vite.dev/), [日本語](https://ja.vite.dev/), [Español](https://es.vite.dev/), [Português](https://pt.vite.dev/)
- [Relatório de Mudança da Vite 4.3](https://github.com/vitejs/vite/blob/main/packages/vite/CHANGELOG.md#430-2023-04-20)

## Melhorias do Desempenho {#performance-improvements}

Nesta atualização secundária, concentramos-nos em melhorar o desempenho do servidor de desenvolvimento. A lógica de resolução foi racionalizada, melhorando os caminhos principais e implementando armazenamento de consulta imediata mais inteligente para encontrar o `package.json`, ficheiros de configuração da TypeScript, e URL resolvidas em geral.

Tu podes ler uma apresentação detalhada do trabalho de desempenho feito neste publicação de blogue por um dos colaboradores da Vite: [Como tornamos a Vite 4.3 muitíssimo mais rápida 🚀](https://sun0day.github.io/blog/vite/why-vite4_3-is-faster.html).

Esta corrida resultou em melhorias da velocidade em todos os domínios comparada a Vite 4.2.

Existem melhorias de desempenho conforme medida pela [sapphi-red/performance-compare](https://github.com/sapphi-red/performance-compare), que testa uma aplicação com 1000 componentes de React, tempo frio e quente de inicialização do servidor bem como tempos da substituição de módulo instantânea para um componente de raiz e página:

| **Vite (babel)**   |  Vite 4.2 | Vite 4.3 | Melhoria |
| :----------------- | --------: | -------: | ----------: |
| **inicio frio do desenvolvimento** | 17249.0ms | 5132.4ms |      -70.2% |
| **inicio quente do desenvolvimento** |  6027.8ms | 4536.1ms |      -24.7% |
| **substituição de módulo instantânea da raiz**       |    46.8ms |   26.7ms |      -42.9% |
| **substituição de módulo instantânea da página**       |    27.0ms |   12.9ms |      -52.2% |

| **Vite (swc)**     |  Vite 4.2 | Vite 4.3 | Melhoria |
| :----------------- | --------: | -------: | ----------: |
| **inicio frio do desenvolvimento** | 13552.5ms | 3201.0ms |      -76.4% |
| **inicio quente do desenvolvimento** |  4625.5ms | 2834.4ms |      -38.7% |
| **substituição de módulo instantânea da raiz**       |    30.5ms |   24.0ms |      -21.3% |
| **substituição de módulo instantânea da página**       |    16.9ms |   10.0ms |      -40.8% |

![Comparação do tempo de inicialização da Vite 4.3 vs 4.2](/vite4-3-startup-time.png)

![Comparação do tempo da substituição de módulo instantânea da Vite 4.3 vs 4.2](/vite4-3-hmr-time.png)

Tu podes ler mais informações a respeito do marco de referência nesta [ligação](https://gist.github.com/sapphi-red/25be97327ee64a3c1dce793444afdf6e). Especificações e Versões para este desempenho executam:

- CPU: Ryzen 9 5900X, Memory: DDR4-3600 32GB, SSD: WD Blue SN550 NVME SSD
- Windows 10 Pro 21H2 19044.2846
- Node.js 18.16.0
- Versões da Extensão de Vite e React
  - Vite 4.2 (babel): Vite 4.2.1 + plugin-react 3.1.0
  - Vite 4.3 (babel): Vite 4.3.0 + plugin-react 4.0.0-beta.1
  - Vite 4.2 (swc): Vite 4.2.1 + plugin-react-swc 3.2.0
  - Vite 4.3 (swc): Vite 4.3.0 + plugin-react-swc 3.3.0

Os primeiros a adotar também têm relatado perceber melhoria de tempo de inicialização do desenvolvimento 1.5x-2x em aplicações reais enquanto testam a Vite 4.3 beta. Adoraríamos saber os resultados para as tuas aplicações.

## Perfilamento {#profiling}

Continuaremos a trabalhar no desempenho da Vite. Estamos a trabalhar numa [ferramenta de analise comparativa](https://github.com/vitejs/vite-benchmark) oficial para a Vite que nos permitirá ter métricas de desempenho para cada pedido de atualização do ramo principal do repositório.

E a [`vite-plugin-inspect`](https://github.com/antfu/vite-plugin-inspect) agora tem mais funcionalidades relacionadas ao desempenho para ajudar-te a identificar quais extensões ou intermediários estão a causar congestionamento para as tuas aplicações.

Usar `vite --profile` (e depois pressionando `p`) assim que a página carregar guardará um perfil da CPU da inicialização do servidor de desenvolvimento. Tu podes abri-los numa aplicação como [speedscope](https://www.speedscope.app/) para identificares os problemas de desempenho. E podes partilhar as tuas descobertas com a equipa da Vite numa [Discussão](https://github.com/vitejs/vite/discussions) ou na [Discorda da Vite](https://chat.vite.dev).

## Próximos Passos {#next-steps}

Nós decidimos fazer uma única versão principal de Vite este ano alinhada com o [Fim da Vida da Node.js 16](https://endoflife.date/nodejs) em Setembro, desistindo do suporte para ambas Node.js 14 e 16 nela. Se gostarias de participar, começamos uma [Discussão sobre a Vite 5](https://github.com/vitejs/vite/discussions/12466) para reunir reações antecipadas.
