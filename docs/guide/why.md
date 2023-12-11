# Por que Vite? {#why-vite}

## Os Problemas {#the-problems}

Antes dos módulos de ECMAScript estarem disponíveis nos navegadores, os programadores não tinham nenhum mecanismo nativo para produção de código JavaScript que pudesse separar esses códigos em módulos. É por isto que estamos todos familiarizados com o conceito de "empacotamento": utilizando ferramentas que rastreiam, processam e concatenam os nossos módulos de origem em ficheiros que possam ser executados no navegador.

Ao longo do tempo temos visto ferramentas como [webpack](https://webpack.js.org/), [Rollup](https://rollupjs.org) e [Parcel](https://parceljs.org/), que melhoraram grandemente a experiência de programação para os programadores de frontend.

No entanto, à medida que construimos aplicações mais e mais ambiciosas, a quantidade de JavaScript com que estamos lidando também está crescendo dramaticamente. Não é incomum para projetos de larga escala conter milhares de módulos. Nós estamos começando a atingir um engarrafamento de desempenho para o ferramental baseado em JavaScript: o que pode frequentemente custar uma espera exorbitantemente longa (algumas vezes até minutos!) para rodar um servidor de desenvolvimento, e mesmo com a Substituição de Módulo Instantânea (HMR, sigla em Inglês), a edição de ficheiros pode custar alguns segundos para ser refletida no navegador. O ciclo de resposta lento pode afetar grandemente a produtividade e felicidade dos programadores.

A Vite tem por objetivo abordar estes problemas influenciando novos avanços no ecossistema: a disponibilidade dos módulos de ECMAScript nativo no navegador, e o aumento de ferramentas de JavaScript escritas em linguagens que compilam para nativo.

### Início de Servidor Lento {#slow-server-start}

Quando inicializares o servidor de desenvolvimento, uma configuração de construção baseada no empacotador tem que rastrear e construir incansavelmente a tua aplicação inteira antes dela poder ser servida.

A Vite melhora o tempo de inicio de servidor de desenvolvimento ao primeiro dividir os módulos em uma aplicação em duas categorias: **dependências** e **código-fonte**.

- As **Dependências** são na maior parte das vezes JavaScript simples que não mudam com frequência durante o desenvolvimento. Alguns dependências grandes (por exemplo, bibliotecas de componente com centenas de módulos) também são muito caras para processar. As dependências também podem ser entregadas em vários formatos de módulos (por exemplo, ESM ou CommonJS).

  A Vite [pré-empacota as dependências](./dep-pre-bundling) utilizando [esbuild](https://esbuild.github.io/). A `esbuild` é escrita em Go e pré-empacota as dependências 10 a 100 vezes mais rápido do que os empacotadores baseados em JavaScript.

- O **Código-fonte** frequentemente contém JavaScript que não é simples e que precisa de transformação (por exemplo, JSX, CSS ou componentes de Vue ou Svelte), e que serão editados com muita frequência. Além disto, nem todo o código-fonte precisa ser carregado ao mesmo tempo (por exemplo, de separação de código baseada em rota).

  A Vite serve o código-fonte sobre o [Módulo de ECMAScript nativo (ESM)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules). Isto é, deixando essencialmente o navegador assumir parte do trabalho de um empacotador: a Vite só precisa transformar e servir o código-fonte sobre demanda, conforme o navegador for requisitá-lo. O código por trás das importações dinâmicas condicional só é processado se de fato for utilizado na tela atual.

<script setup>
import bundlerSvg from '../images/bundler.svg?raw'
import esmSvg from '../images/esm.svg?raw'
</script>
<svg-image :svg="bundlerSvg" />
<svg-image :svg="esmSvg" />

### Atualizações Lentas {#slow-updates}

Quando um ficheiro é editado em uma configuração de construção baseada no empacotador, é ineficiente reconstruir o pacote inteiro por razões óbvias: a velocidade de atualização degradará linearmente com o tamanho da aplicação.

Em alguns empacotadores, o servidor de desenvolvimento executa o empacotamento em memória para que só precise invalidar parte do seu gráfico de módulo quando um ficheiro mudar, mas ele ainda precisa reconstruir o pacote inteiro e recarregar a página de web. A reconstrução do pacote pode ser cara, e o recarregamento da página liquida o estado atual da aplicação. É por isto que alguns empacotadores suportam a Substituição de Módulo Instantânea (HMR, sigla em Inglês): permitindo um módulo ser "substituir-se de forma instantânea" sem afetar o resto da página. Isto melhora grandemente a experiência de programação - no entanto, na prática descobrimos que mesmo a velocidade de atualização da Substituição de Módulo Instantânea se deteriora significativamente a medida que cresce o tamanho da aplicação.

Na Vite, a Substituição de Módulo Instantânea é realizada sobre o Módulo de ECMAScript (ESM, sigla em Inglês). Quando um ficheiro é editado, a Vite só precisa invalidar precisamente a corrente entre o módulo editado e a sua fronteira de Substituição de Módulo Instantânea (HMR) mais próxima (na maior parte das vezes só o próprio módulo), tornando as atualizações de Substituição de Módulo Instantânea (HMR) consistentemente rápida independentemente do tamanho da tua aplicação.

A Vite também influencia os cabeçalhos de HTTP para acelerar os recarregamentos da página inteira (novamente, deixar o navegador fazer mais trabalha por nós): os requisições do módulo de código-fonte são tornadas condicionais através de `304 Não Modificado`, e as requisições do módulo de dependência são fortemente cacheadas através de `Cache-Control: max-age=31536000,immutable` assim elas não atingem o servidor novamente uma vez cacheadas.

Uma vez que experimentas o quão rápida a Vite é, duvidamos muito que estejas disposto a suportar o desenvolvimento empacotado novamente.

## Por que Empacotar para Produção? {#why-bundle-for-production}

Embora o Módulo de ECMAScript nativo esteja largamente suportado, entregar Módulo de ECMAScript desempacotado em produção ainda é ineficiente (mesmo com a HTTP/2) por causa das viagens de ida e volta na rede adicionais causadas pelas importações encaixadas. Para receber o desempenho de carregamento ideal em produção, ainda é melhor empacotar o teu código com agitação de árvore, carregamento preguiçoso e separação de pedaço comum (para cacheamento melhor).

Garantir resultado ideal e consistência comportamental entre o servidor de desenvolvimento e a construção de produção não é fácil. Isto porque a Vite entrega com um [comando de construção](./build) pré-configurado que realiza várias [otimizações de desempenho](./features#otimizações-de-construção) fora da caixa.

## Por que Não Empacotar com a esbuild? {#why-not-bundle-with-esbuild}

Embora a `esbuild` seja extremamente rápida e seja já um empacotador muito capaz para bibliotecas, algumas das funcionalidades importantes necessárias para o empacotamento de _aplicações_ ainda estão a funcionar em progresso - em particular a separação de código e manipulação de CSS. Por enquanto, a Rollup é mais madura e flexível nestes aspetos. Com isto dito, não descartamos a possibilidade da utilização de `esbuild` para construções de produção quando ele estabilizar estas funcionalidades no futuro.

## Em que a Vite é diferente de X? {#how-is-vite-different-from-x}

Tu podes consultar a secção de [Comparações](./comparisons) para mais detalhes a respeito de como a Vite difere de outras ferramentas semelhantes.
