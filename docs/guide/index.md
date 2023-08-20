# Começar {#getting-started}

<audio id="vite-audio">
  <source src="/vite.mp3" type="audio/mpeg">
</audio>

## Visão Geral {#overview}

Vite (palavra francesa para "rápido", pronunciada como `/vit/`<button style="border:none;padding:3px;border-radius:4px;vertical-align:bottom" id="play-vite-audio" onclick="document.getElementById('vite-audio').play();"><svg style="height:2em;width:2em"><use href="/voice.svg#voice" /></svg></button>, como "veet") é uma ferramenta de construção de projetos de frontend que se destina a oferecer uma experiência de desenvolvimento mais rápida e leve para projetos de web modernos. Ela consiste em duas partes principais:

- Um servidor de desenvolvimento que oferece [melhorias de funcionalidade ricas](./features) sobre [módulos de ECMAScript nativo](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules), por exemplo [Substituição de Módulo Instantânea](./features#hot-module-replacement) extremamente rápida.

- Um comando de construção que empacota o nosso código com a [Rollup](https://rollupjs.org), pré-configurado para produzir recursos estáticos altamente otimizados para produção.

A Vite é opiniosa e trás padrões sensíveis fora da caixa. Leia sobre o que é possível fazer no [Guia de Funcionalidade](./features). O suporte para abstrações ou integrações com outras ferramentas é possível através de [Extensões](./using-plugins). A [Seção de Configuração](../config/) explica como adaptar a Vite ao nosso projeto se necessário.

A Vite também é altamente extensível através da sua [API de Extensão](./api-plugin) e [API de JavaScript](./api-javascript) com suporte completo a tipos.

Nós podemos estudar mais a respeito do fundamento lógico por trás do projeto na secção [Porquê Vite](./why).

## Suporte do Navegador {#browser-support}

O construção padrão dirige-se aos navegadores que suportam [módulos de ECMAScript nativo](https://caniuse.com/es6-module), [importação dinâmica de módulos de ECMAScript nativo](https://caniuse.com/es6-module-dynamic-import), e [`import.meta`](https://caniuse.com/mdn-javascript_operators_import_meta). Os navegadores antigos podem ser suportados através do [`@vitejs/plugin-legacy`](https://github.com/vitejs/vite/tree/main/packages/plugin-legacy) oficial - consulte a seção [Construindo para Produção](./build) para mais detalhes.

## Experimentar a Vite Online {#trying-vite-online}

Nós podemos experimentar a Vite online na [StackBlitz](https://vite.new/). Ela executa a configuração de construção baseada em Vite diretamente no navegador, assim é quase idêntica a configuração local mas não exige a instalação de nada na nossa máquina. Nós podemos navegar para `vite.new/{template}` para selecionar a abstração que queremos usar.

As pré-configurações de modelo de projetos suportadas são:

|             JavaScript              |                TypeScript                 |
| :---------------------------------: | :---------------------------------------: |
| [vanilla](https://vite.new/vanilla) | [vanilla-ts](https://vite.new/vanilla-ts) |
|     [vue](https://vite.new/vue)     |     [vue-ts](https://vite.new/vue-ts)     |
|   [react](https://vite.new/react)   |   [react-ts](https://vite.new/react-ts)   |
|  [preact](https://vite.new/preact)  |  [preact-ts](https://vite.new/preact-ts)  |
|     [lit](https://vite.new/lit)     |     [lit-ts](https://vite.new/lit-ts)     |
|  [svelte](https://vite.new/svelte)  |  [svelte-ts](https://vite.new/svelte-ts)  |
|  [solid](https://vite.new/solid)    |  [solid-ts](https://vite.new/solid-ts)    |
|  [qwik](https://vite.new/qwik)      |  [qwik-ts](https://vite.new/qwik-ts)      |

## Estruturando o Teu Primeiro Projeto de Vite {#scaffolding-your-first-vite-project}

:::tip Nota de Compatibilidade
A Vite exige a versão 18+, 20+ da [Node.js](https://nodejs.org/en/). No entanto, alguns modelos de projeto exigem uma versão ainda superior da Node.js para funcionarem, atualize caso o teu gestor de pacote alertar a respeito disto.
:::

::: code-group

```bash [NPM]
$ npm create vite@latest
```

```bash [Yarn]
$ yarn create vite
```

```bash [PNPM]
$ pnpm create vite
```

:::

Depois devemos seguir os prontos!

Nós também podemos diretamente especificar o nome do projeto e o modelo que queremos usar através das opções de linha de comando adicionais. Por exemplo, para gerar um projeto Vite + Vue, executamos:

```bash
# npm 6.x
npm create vite@latest my-vue-app --template vue

# npm 7+, os duplo travessão é necessário:
npm create vite@latest my-vue-app -- --template vue

# yarn
yarn create vite my-vue-app --template vue

# pnpm
pnpm create vite my-vue-app --template vue
```

Consulte [create-vite](https://github.com/vitejs/vite/tree/main/packages/create-vite) por mais detalhes a respeito de cada modelo suportado: `vanilla`, `vanilla-ts`, `vue`, `vue-ts`, `react`, `react-ts`, `react-swc`, `react-swc-ts`, `preact`, `preact-ts`, `lit`, `lit-ts`, `svelte`, `svelte-ts`, `solid`, `solid-ts`, `qwik`, `qwik-ts`.

## Modelos de Projeto da Comunidade {#community-templates}

A `create-vite` é uma ferramenta para iniciar um projeto rapidamente a partir de um modelo de projeto básico para abstrações populares. Consulte a [awesome-vite](https://github.com/vitejs/awesome-vite) por [modelos de projeto mantidos pela comunidade](https://github.com/vitejs/awesome-vite#templates) que incluam outras ferramentas ou dirigem-se à abstrações diferentes. Nós podemos usar uma ferramenta como [degit](https://github.com/Rich-Harris/degit) para gerar o nosso projeto com um dos modelos:

```bash
npx degit user/project my-project
cd my-project

npm install
npm run dev
```

Se o projeto usa `main` como ramo padrão, sufixe o repositório do projeto com `#main`.

```bash
npx degit user/project#main my-project
```

## `index.html` e a Raiz do Projeto {#index-html-and-project-root}

Uma coisa que podemos ter notado é que em um projeto de Vite, `index.html` é a frente e a central no lugar de ser escondido dentro de `public`. Isto é intencional: durante o desenvolvimento a Vite é um servidor, e `index.html` é o ponto de entrada para a tua aplicação.

A Vite trata o `index.html` como código-fonte e parte do módulo gráfico. Ela resolve `<script type="module" src="...">` que faz referência ao teu código-fonte de JavaScript. Mesmo o `<script type="module">` em linha e a CSS referenciada através de `<link href>` também gozam das funcionalidades especificas da Vite. Além disto, as URLs dentro de `index.html` são baseados novamente automaticamente assim não há necessidade para seguradores de locar como `%PUBLIC_URL%`.

Semelhante aos servidores de HTTP estáticos, a Vite tem o conceito dum "diretório raiz" a partir do qual os nossos ficheiros são servidos. Nós os veremos referenciados como `<root>` ao longo do resto da documentação. As URLs absolutas no nosso código-fonte serão resolvidas usando a raiz do projeto como base, assim podemos escrever código como se estivéssemos trabalhando com um servidor de ficheiro estático normal (só que mais poderoso!). A Vite também é capaz de manipular dependências que resolvem para fora das localizações do sistema de ficheiro raiz, o que a torna utilizável mesmo em uma configuração baseada em mono-repositório.

A Vite também suporta [aplicações de várias páginas](./build#multi-page-app) com vários pontos de entrada `.html`.

#### Especificando Raiz Alternativa {#specifying-alternative-root}

A execução de `vite` inicia o servidor de desenvolvimento utilizando o diretório de trabalho atual como raiz. Tu podes especificar uma raiz alternativa com `vite serve some/sub/dir`. Nota que a Vite também resolverá o [seu ficheiro de configuração (por exemplo, `vite.config.js`)](/config/#configuring-vite) dentro da raiz do projeto, então precisarás de movê-lo se a raiz for mudada.

## Interface de Linha de Comando {#command-line-interface}

Em um projeto onde a Vite for instalada, podes utilizar o binário de `vite` nos teus programas (ou scripts em Inglês) de npm, ou executar ela diretamente com `npx vite`. Cá estão os programas de npm padrão dentro de um projeto de Vite estruturado:

<!-- prettier-ignore -->
```json
{
  "scripts": {
    "dev": "vite", // inicia o servidor de desenvolvimento, pseudónimos: `vite dev`, `vite serve`
    "build": "vite build", // constrói para produção
    "preview": "vite preview" // pré-visualiza localmente a construção de produção
  }
}
```

Tu podes especificar opções de linha de comando adicionar como `--port` ou `--https`. Para teres uma lista completa de opções de linha de comando, execute `npx vite --help` no teu projeto.

## Utilizando Consolidações Não Lançadas {#using-unreleased-commits}

Se conseguires esperar por uma novo lançamento para testar as funcionalidades mais recentes, precisarás clonar o [repositório de vite](https://github.com/vitejs/vite) para a tua máquina e então construir e ligá-la tu mesmo ([pnpm](https://pnpm.io/) é necessário):

```bash
git clone https://github.com/vitejs/vite.git
cd vite
pnpm install
cd packages/vite
pnpm run build
pnpm link --global # tu podes utilizar o teu gestor de pacote preferido para esta etapa
```

Então siga para o teu projeto baseado na Vite e execute `pnpm link --global vite` (ou o gestor de pacote que utilizaste para ligar a `vite` globalmente). Agora reinicie o servidor de desenvolvimento para viajares nos limites!

## Comunidade {#community}

Se tiveres questões ou precisas de ajuda, chame a comunidade na [Discord](https://chat.vitejs.dev) e nas [Discussões de GitHub](https://github.com/vitejs/vite/discussions).
