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

Nós podemos aprender mais a respeito do fundamento lógico por trás do projeto na seção [Por quê Vite](./why).

## Suporte do Navegador {#browser-support}

O construção padrão dirige-se aos navegadores que suportam [módulos de ECMAScript nativo](https://caniuse.com/es6-module), [importação dinâmica de módulos de ECMAScript nativo](https://caniuse.com/es6-module-dynamic-import), e [`import.meta`](https://caniuse.com/mdn-javascript_operators_import_meta). Os navegadores antigos podem ser suportados através do [`@vitejs/plugin-legacy`](https://github.com/vitejs/vite/tree/main/packages/plugin-legacy) oficial - consulte a seção [Construindo para Produção](./build) por mais detalhes.

## Experimentando a Vite Online {#trying-vite-online}

Nós podemos experimentar a Vite online na [StackBlitz](https://vite.new/). Esta executa a configuração de construção baseada em Vite diretamente no navegador, assim é quase idêntica a configuração local mas não exige a instalação de nada na nossa máquina. Nós podemos navegar para `vite.new/{template}` para selecionar a abstração que queremos usar.

As pré-configurações de modelo de projeto suportadas são:

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

## Estruturando o Nosso Primeiro Projeto de Vite {#scaffolding-your-first-vite-project}

:::tip NOTA DE COMPATIBILIDADE
A Vite exige a versão 18+, 20+ da [Node.js](https://nodejs.org/en/). No entanto, alguns modelos de projeto exigem uma versão superior da Node.js para funcionarem, devemos atualizar se for o nosso gestor de pacote avisar sobre isto.
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

```bash [Bun]
$ bun create vite
```

:::

Depois seguimos as instruções!

Nós também podemos especificar diretamente o nome do projeto e o modelo que queremos usar através das opções adicionais da linha de comando. Por exemplo, para gerar um projeto Vite + Vue, executamos:

::: code-group

```bash [NPM]
# npm 7+, o travessão duplo adicional é necessário:
$ npm create vite@latest my-vue-app -- --template vue
```

```bash [Yarn]
$ yarn create vite my-vue-app --template vue
```

```bash [PNPM]
$ pnpm create vite my-vue-app --template vue
```

```bash [Bun]
$ bun create vite my-vue-app --template vue
```

:::

Consultar a [`create-vite`](https://github.com/vitejs/vite/tree/main/packages/create-vite) por mais detalhes sobre modelo de projeto suportado: `vanilla`, `vanilla-ts`, `vue`, `vue-ts`, `react`, `react-ts`, `react-swc`, `react-swc-ts`, `preact`, `preact-ts`, `lit`, `lit-ts`, `svelte`, `svelte-ts`, `solid`, `solid-ts`, `qwik`, `qwik-ts`.

Nós podemos usar `.` para o nome do projeto para estruturar o projeto no diretório atual.

## Modelos de Projeto da Comunidade {#community-templates}

A `create-vite` é uma ferramenta que permite começar rapidamente um projeto a partir dum modelo de projeto básico para abstrações populares. Consultar a Awesome Vite por [modelos de projeto mantidos pela comunidade](https://github.com/vitejs/awesome-vite#templates) que incluem outras ferramentas ou se destinam a abstrações diferentes.

Para um modelo de projeto em `https://github.com/user/project`, podemos testá-lo ao vivo usando `https://github.stackblitz.com/user/project` (adicionando `.stackblitz` após `github` ao URL do projeto).

Também podemos usar uma ferramenta como [`degit`](https://github.com/Rich-Harris/degit) para estruturar o nosso projeto com um dos modelos de projeto. Assumindo que o projeto está na GitHub e usa `main` como ramo padrão, podemos usar uma cópia local usando:

```bash
npx degit user/project#main my-project
cd my-project

npm install
npm run dev
```

## Instalação Manual {#manual-installation}

No nosso projeto, podemos instalar a interface da linha de comando da `vite` usando:

```bash [NPM]
$ npm install -D vite
```

```bash [Yarn]
$ yarn add -D vite
```

```bash [PNPM]
$ pnpm add -D vite
```

```bash [Bun]
$ bun add -D vite
```

:::

E criar um ficheiro `index.html` como este:


```html
<p>Hello Vite!</p>
```

Depois, executar a interface da linha de comando da `vite` no nosso terminal:

::: code-group
```bash [NPM]
$ npx vite
```

```bash [Yarn]
$ yarn vite
```
```bash [PNPM]
$ pnpm vite
```
```bash [Bun]
$ bunx vite
```
:::

O `index.html` será servido no `http://localhost:5173`.

## `index.html` e a Raiz do Projeto {#index-html-and-project-root}

Uma coisa que podemos ter notado é que num projeto de Vite, `index.html` é a frente e a central no lugar de ser escondido dentro de `public`. Isto é intencional: durante o desenvolvimento a Vite é um servidor, e `index.html` é o ponto de entrada para a nossa aplicação.

A Vite trata o `index.html` como código-fonte e parte do gráfico do módulo. Ela resolve `<script type="module" src="...">` que referencia o nosso código-fonte de JavaScript. Mesmo o `<script type="module">` em linha e a CSS referenciada através de `<link href>` também gozam das funcionalidades específicas da Vite. Além disto, as URLs dentro de `index.html` são rebaseadas automaticamente, assim não há necessidade para reservadores de espaço `%PUBLIC_URL%` especiais.

Semelhante aos servidores de HTTP estáticos, a Vite tem o conceito dum "diretório raiz" a partir do qual os nossos ficheiros são servidos. Nós os veremos referenciados como `<root>` ao longo da documentação. As URLs absolutas no nosso código-fonte serão resolvidas usando a raiz do projeto como base, assim podemos escrever código como se estivéssemos trabalhando com um servidor de ficheiro estático normal (apenas mais poderoso!). A Vite também é capaz de manipular dependências que resolvem para fora das localizações do sistema de ficheiro raiz, o que a torna utilizável mesmo numa configuração baseada em mono-repositório.

A Vite também suporta [aplicações de várias páginas](./build#multi-page-app) com vários pontos de entrada de `.html`.

#### Especificando Raiz Alternativa {#specifying-alternative-root}

A execução de `vite` inicia o servidor de desenvolvimento usando o diretório de trabalho atual como raiz. Nós podemos especificar uma raiz alternativa com `vite serve some/sub/dir`. Nota que a Vite também resolverá o [seu ficheiro de configuração (por exemplo, `vite.config.js`)](/config/#configuring-vite) dentro da raiz do projeto, então precisaremos movê-lo se a raiz for mudada.

## Interface da Linha de Comando {#command-line-interface}

Num projeto onde a Vite estiver instalada, podemos usar o binário `vite` nos nossos programas de npm, ou executá-la diretamente com `npx vite`. Eis os programas de npm padrão num projeto de Vite estruturado:

<!-- prettier-ignore -->
```json [package.json]
{
  "scripts": {
    "dev": "vite", // iniciar o servidor de desenvolvimento, pseudónimos: `vite dev`, `vite serve`
    "build": "vite build", // construir para produção
    "preview": "vite preview" // pré-visualizar localmente a construção de produção
  }
}
```

Nós podemos especificar opções da interface da linha de comando adicionais como `--port` ou `--open`. Para uma lista completa de opções da interface da linha de comando, executamos `npx vite --help` no nosso projeto.

Saiba mais sobre a [Interface da Linha de Comando](./cli)

## Usando Consolidações Não Lançadas {#using-unreleased-commits}

Se não podemos esperar por um novo lançamento para testar as funcionalidades mais recentes, precisaremos de clonar o [repositório da `vite`](https://github.com/vitejs/vite) para a nossa máquina e depois construir e ligá-lo nós mesmos ([pnpm](https://pnpm.io/) é obrigatório):

```bash
git clone https://github.com/vitejs/vite.git
cd vite
pnpm install
cd packages/vite
pnpm run build
pnpm link --global # usamos o nosso gestor de pacote neste passo
```

Depois seguimos para o nosso projeto baseado de Vite e executamos `pnpm link --global vite` (ou o gestor de pacote que usamos para ligar `vite` globalmente). Agora reiniciamos o servidor de desenvolvimento para andarmos nos limites!

## Comunidade {#community}

Se tivermos questões ou precisarmos de ajuda, podemos entrar em contacto com a comunidade na [Discord](https://chat.vite.dev) e nas [Discussões da GitHub](https://github.com/vitejs/vite/discussions).
