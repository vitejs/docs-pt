# Começar {#getting-started}

<audio id="vite-audio">
  <source src="/vite.mp3" type="audio/mpeg">
</audio>

## Visão de Conjunto {#overview}

Vite (palavra Francesa para "rápido", pronunciado `/vit/`<button style="border:none;padding:3px;border-radius:4px;vertical-align:bottom" id="play-vite-audio" onclick="document.getElementById('vite-audio').play();"><svg style="height:2em;width:2em"><use href="/voice.svg#voice" /></svg></button>, como "veet") é uma ferramenta de construção que se destina a oferecer uma experiência de desenvolvimento mais rápida e leve para projetos de web modernos. Ela consiste em duas partes principais:

- Um servidor de desenvolvimento que oferece [melhorias de funcionalidade ricas](./features) sobre [módulos de ECMAScript nativo](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules), por exemplo [Substituição de Módulo Instantânea (HMR, sigla em Inglês)](./features#substituição-de-módulo-instantânea) extremamente rápida.

- Um comando de construção que empacota o teu código com [Rollup](https://rollupjs.org), pré-configurado para produzir recursos estáticos altamente otimizados para produção.

A Vite é opiniosa e vem com padrões sensíveis fora da caixa, mas também é altamente extensível através de sua [API de Extensão](./api-plugin) e [API de JavaScript](./api-javascript) com suporte a tipagem completa.

Tu podes aprender mais a respeito do fundamento lógico por trás do projeto na secção [Porquê Vite](./why).

## Suporte de Navegador {#browser-support}

O construção padrão mira navegadores que suportam [módulos de ECMAScript nativo](https://caniuse.com/es6-module), [importação dinâmica de módulos de ECMAScript nativo](https://caniuse.com/es6-module-dynamic-import), e [`import.meta`](https://caniuse.com/mdn-javascript_operators_import_meta). Os navegadores legado podem ser suportados através do [@vitejs/plugin-legacy](https://github.com/vitejs/vite/tree/main/packages/plugin-legacy) oficial - consulte a secção [Construindo para Produção](./build) para mais detalhes.

## Experimentando a Vite Online {#trying-vite-online}

Tu podes experimentar a Vite online na [StackBlitz](https://vite.new/). Ele executa a configuração de construção baseada em Vite diretamente no navegador, assim ela é quase idêntica a configuração local mas não exige a instalação de nada na tua máquina. Tu podes navegar para `vite.new/{template}` para selecionar qual abstração utilizar.

As pré-configurações de modelo suportadas são:

|             JavaScript              |                TypeScript                 |
| :---------------------------------: | :---------------------------------------: |
| [vanilla](https://vite.new/vanilla) | [vanilla-ts](https://vite.new/vanilla-ts) |
|     [vue](https://vite.new/vue)     |     [vue-ts](https://vite.new/vue-ts)     |
|   [react](https://vite.new/react)   |   [react-ts](https://vite.new/react-ts)   |
|  [preact](https://vite.new/preact)  |  [preact-ts](https://vite.new/preact-ts)  |
|     [lit](https://vite.new/lit)     |     [lit-ts](https://vite.new/lit-ts)     |
|  [svelte](https://vite.new/svelte)  |  [svelte-ts](https://vite.new/svelte-ts)  |

## Estruturando o Teu Primeiro Projeto de Vite {#scaffolding-your-first-vite-project}

:::tip Nota de Compatibilidade
A Vite requer a versão 14.18+, 16+ da [Node.js](https://nodejs.org/en/). No entanto, alguns modelos exigem uma versão ainda superior da Node.js para funcionarem, atualize caso o teu gestor de pacote alertar acerca disto.
:::

Com o NPM:

```bash
$ npm create vite@latest
```

Com o Yarn:

```bash
$ yarn create vite
```

Com o PNPM:

```bash
$ pnpm create vite
```

Depois siga os prontos!

Tu também podes diretamente especificar o nome de projeto e o modelo que queres utilizar através de opções de linha de comando adicionais. Por exemplo, para gerar um projeto Vite + Vue, execute:

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

Consulte [create-vite](https://github.com/vitejs/vite/tree/main/packages/create-vite) para mais detalhes a respeito de cada modelo suportado: `vanilla`, `vanilla-ts`, `vue`, `vue-ts`, `react`, `react-ts`, `react-swc`, `react-swc-ts`, `preact`, `preact-ts`, `lit`, `lit-ts`, `svelte`, `svelte-ts`.

## Modelos da Comunidade {#community-templates}

A `create-vite` é uma ferramenta para iniciar um projeto rapidamente a partir de um modelo básico para abstrações populares. Consulte a Awesome Vite para [modelos mantidos pela comunidade](https://github.com/vitejs/awesome-vite#templates) que incluam outras ferramentas ou miram abstrações diferentes. Tu podes utilizar uma ferramenta como [degit](https://github.com/Rich-Harris/degit) para gerar o teu projeto com um dos modelos.

```bash
npx degit user/project my-project
cd my-project

npm install
npm run dev
```

Se o projeto utiliza `main` como ramo padrão, sufixe o repositório do projeto com `#main`.

```bash
npx degit user/project#main my-project
```

## `index.html` e a Raiz do Projeto {#index-html-and-project-root}

Uma coisa que podes ter notado é que em um projeto de Vite, `index.html` é a frente e a central no lugar de ser escondido dentro de `public`. Isto é intencional: durante o desenvolvimento a Vite é um servidor, e `index.html` é o ponto de entrada para a tua aplicação.

A Vite trata o `index.html` como código-fonte e parte do módulo gráfico. Ela resolve `<script type="module" src="...">` que faz referência ao teu código-fonte de JavaScript. Mesmo o `<script type="module">` em linha e a CSS referenciada através de `<link href>` também gozam das funcionalidades especificas da Vite. Além disto, as URLs dentro de `index.html` são baseados novamente automaticamente assim não há necessidade para seguradores de locar como `%PUBLIC_URL%`.

Semelhante aos servidores de HTTP estáticos, a Vite tem o conceito de um "diretório raiz" a partir do qual os teus ficheiros são servidos. Tu o verás referenciado como `<root>` por todo o resto da documentação. As URLs absolutas no teu código-fonte serão resolvidas utilizando a raiz de projeto como base, assim podes escrever código como se estivesses trabalhando com um servidor de ficheiro estático normal (exceto que mais poderoso!). A Vite também é capaz de manipular dependências que resolvem para fora das localizações do sistema de ficheiro raiz, o que a torna utilizável mesmo em uma configuração baseada em mono-repositório.

A Vite também suporta [aplicações de várias páginas](./build#aplicação-de-várias-páginas) com vários pontos de entrada `.html`.

#### Especificando Raiz Alternativa {#specifying-alternative-root}

A execução de `vite` inicia o servidor de desenvolvimento utilizando o diretório de trabalho atual como raiz. Tu podes especificar uma raiz alternativa com `vite serve some/sub/dir`.

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
