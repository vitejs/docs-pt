# Comparações {#comparisons}

## WMR {#wmr}

A [WMR](https://github.com/preactjs/wmr) criada pela equipa da Preact fornece um conjunto de funcionalidade semelhante, e o suporte da Vite 2.0 para a interface de extensão da Rollup é inspirada por ela.

A WMR é desenhada principalmente para projetos de [Preact](https://preactjs.com/), e oferece mais funcionalidades integradas tais como a pré-interpretação. Em termos de escopo, está mais perto de uma meta abstração de Preact, com a mesma ênfase no tamanho compacto conforme a própria Preact. Se estiveres utilizando a Preact, a WMR é a que provavelmente oferecerá uma experiência mais refinada.

## @web/dev-server {#web-dev-server}

O [@web/dev-server](https://modern-web.dev/docs/dev-server/overview/) (anteriormente `es-dev-server`) é um grande projeto e a configuração de servidor baseada na Koa da Vite 1.0 foi inspirada por ele.

O `@web/dev-server` é um pouco de baixo nível em termos de escopo. Ele não fornece integrações de abstração oficiais, e exige que se defina manualmente uma configuração de Rollup para a construção de produção.

No geral, a Vite é uma ferramenta mais opiniosa de alto nível que tem por objetivo fornecer um fluxo de trabalho mais fora da caixa. Com isto dito, o projeto aglutinador da `@web` contém várias outras ferramentas excelentes que também podem beneficiar os utilizadores de Vite.

## Snowpack {#snowpack}

A [Snowpack](https://www.snowpack.dev/) também foi um servidor de desenvolvimento de ECMAScript nativo sem empacotamento, muito semelhante em escopo a Vite. O projeto não está mais sendo mantido. A equipa da Snowpack está agora trabalhando sobre a [Astro](https://astro.build/), um construtor de sítio estático alimentado pela Vite.

À parte dos diferentes detalhes de implementação, os dois projetos partilharam muito em termos de vantagens técnicas sobre ferramental tradicional. A dependência da Vite de pré-empacotamento também é inspirada pela Snowpack v1 (agora [`esinstall`](https://github.com/snowpackjs/snowpack/tree/main/esinstall)). Algumas das principais diferenças entre os dois projetos estão listadas no [Guia de Comparações da Versão 2](https://v2.vite.dev/guide/comparisons).
