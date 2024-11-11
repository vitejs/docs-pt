# Filosofia do Projeto {#project-philosophy}

## Núcleo Extensível Simples {#lean-extendable-core}

A Vite não tenciona cobrir todo caso de uso para todos os utilizadores. A Vite tem por objetivo suportar os padrões mais comuns para construir aplicações de Web fora da caixa, mas o [núcleo da Vite](https://github.com/vitejs/vite) deve permanecer simples com uma superfície de API pequena para manter o projeto sustentável a longo prazo. Este objetivo é possível graças ao [sistema de extensão baseado na rollup da Vite](./api-plugin.md). Funcionalidades que podem ser implementadas como extensões externas normalmente não serão adicionadas ao núcleo da Vite. [vite-plugin-pwa](https://vite-pwa-org.netlify.app/) é um excelente exemplo do que pode ser alcançado fora do núcleo da Vite, existem muitas [extensões bem mantidas](https://github.com/vitejs/awesome-vite#plugins) para cobrir as tuas necessidades. A Vite trabalha em estreita colaboração com o projeto Rollup para garantir que as extensões podem ser usadas em ambos projetos de Rollup simples e Vite o máximo possível, tentando empurrar extensões necessárias para a API de Extensão a montante, sempre que possível.

## Empurrando a Web Moderna {#pushing-the-modern-web}

A Vite fornece funcionalidades opiniosas que empurram a escrita de código moderno. Por exemplo:

- O código-fonte apenas pode ser escrito em Módulo de ECMAScript, onde dependências que não usam Módulo de ECMAScript precisam ser [pré-empacotados como Módulo de ECMAScript](./dep-pre-bundling) para funcionarem.
- Os operários da Web são encorajados a ser escritos com a [sintaxe `new Worker`](./features#web-workers) para seguirem os padrões modernos.
- Os módulos da Node.js não podem ser usados no navegador.

Quando adicionas novas funcionalidades, estes padrões são seguidos para criar uma API preparada para o futuro, o que pode nem sempre ser compatível com outras ferramentas de construção.

## Uma Abordagem Pragmática do Desempenho {#a-pragmatic-approach-to-performance}

A Vite tem estado concentrada no desempenho desde as suas [origens](./why.md). A sua arquitetura de servidor de desenvolvimento permite a substituição de módulo instantânea que permanence rápida à medida que os projetos crescem. A Vite usa ferramentas nativas como [esbuild](https://esbuild.github.io/) e [SWC](https://github.com/vitejs/vite-plugin-react-swc) para implementar tarefas intensas mas mantém o resto do código em JavaScript para equilibrar a velocidade com a flexibilidade. Quando necessário, extensões de abstração explorarão a [Babel](https://babeljs.io/) para compilar o código do utilizador. E durante o tempo de construção a Vite atualmente usa [Rollup](https://rollupjs.org/) onde o tamanho do pacote e ter acesso à um ecossistema vasto de extensões forem mais importantes do que velocidade pura. A Vite continuará a evoluir internamente, usando novas bibliotecas a medida que aparecerem para melhor a experiência de programação enquanto mantém a sua API estável.

## Construindo Abstrações Sobre a Vite {#building-frameworks-on-top-of-vite}

Embora a Vite possa ser usada pelos utilizadores diretamente, brilha como uma ferramenta para criar abstrações. O núcleo da Vite é agnóstica em relação a abstração, mas existem extensões polidas para cada abstração de interface de utilizador. Sua [API de JavaScript](./api-javascript) permite que os autores de abstração de aplicação usem funcionalidades da Vite para criar experiências personalizadas para os seus utilizadores. A Vite inclui suporte para [primitivos de Interpretação no Lado do Servidor](./ssr), normalmente presente em ferramentas de alto nível mas fundamental para construção de abstrações de Web modernas. E as extensões de Vite completam a imagem oferecendo uma maneira de partilhar entre abstrações. A Vite é também uma excelente ajuste quando pareada com [Abstrações de Backend](./backend-integration) como [Ruby](https://vite-ruby.netlify.app/) e [Laravel](https://laravel.com/docs/10.x/vite).

## Um Ecossistema Ativo {#an-active-ecosystem}

A evolução da Vite é uma cooperação entre abstração e responsáveis pela manutenção de extensão, utilizadores, e a equipa da Vite. Nós encorajamos a participação ativa no desenvolvimento do núcleo da Vite assim que um projeto adotar a Vite. Nós trabalhamos em estreita colaboração com os principais projetos no ecossistema para minimizar regressões em cada lançamento, auxiliados por ferramentas como [vite-ecosystem-ci](https://github.com/vitejs/vite-ecosystem-ci). Ela permite-nos executar a integração contínua da maioria dos projetos usando a Vite nos pedidos de atualização do repositório selecionados e dá-nos um estado mais claro de como o ecossistema reagiria à um lançamento. Nós esforçamos-nos para corrigir as regressões antes delas atingirem os utilizadores e permitir que os projetos atualizem para as próximas versões assim que forem lançados. Se estiveres a trabalhar com a Vite, convidamos-te a juntares-te a [Discord da Vite](https://chat.vite.dev) e a participar no projeto também.
