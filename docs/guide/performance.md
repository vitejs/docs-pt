# Desempenho {#performance}

Embora a Vite seja rápida por padrão, problemas de desempenho podem infiltrarem-se a medida que os requisitos do projeto aumentam. Este guia tem por objetivo ajudar-nos a identificar e corrigir problemas comuns de desempenho, tais como:

- Lentidão na inicialização do servidor
- Lentidão no carregamento da página
- Lentidão durante a construção do projeto

## Revisar Nossa Configuração do Navegador {#review-your-browser-setup}

Algumas extensões do navegador podem interferir com as requisições e desacelerar os tempos de inicialização e recarga de aplicações de grande porte, especialmente quando se usa as ferramentas de programação do navegador. Nós recomendamos criar um perfil exclusivo de desenvolvimento sem extensões, ou mudar para o modo de navegação anónima, enquanto usamos o servidor de desenvolvimento da Vite nestes casos. O modo de navegação anónima também deve ser mais rápido do que perfil normal sem as extensões.

O servidor de desenvolvimento da Vite faz o armazenamento rígido das dependências pré-empacotadas para consulta imediata e implementa respostas de 304 rápidas para o código-fonte. Desativar o armazenamento de consulta imediata enquanto as ferramentas de programação do navegador estão abertas pode ter um grande impacto nos tempos de inicialização e de renovação da página inteira. Precisamos verificar se a opção **Disable Cache** não está ativada enquanto trabalhamos com o servidor da Vite.

## Auditar as Extensões de Vite Configuradas {#audit-configured-vite-plugins}

O interior e extensões oficiais da Vite estão otimizadas para fazer a quantidade minima de trabalho possível enquanto fornecem compatibilidade com um ecossistema mais amplo. Por exemplo, as transformações de código usam expressões regulares no desenvolvimento, mas fazem uma analise sintática completa na construção para garantir correctitude.

No entanto, o desempenho das extensões da comunidade está fora do controlo da Vite, o que pode afetar a experiência de programação. Eis algumas que podemos estar atento quando usamos extensões de Vite adicionais:

1. As grandes dependências que apenas são usadas em certos casos devem ser dinamicamente importadas para reduzir o tempo da inicialização da Node.js. Re-implementações de exemplo: [`vite-plugin-react#212`](https://github.com/vitejs/vite-plugin-react/pull/212) e [`vite-plugin-pwa#224`](https://github.com/vite-pwa/vite-plugin-pwa/pull/244).

2. Os gatilhos `buildStart`, `config`, e `configResolved` não devem executar operações extensas e longas. Estes gatilhos são aguardados durante a inicialização do servidor de desenvolvimento, o que atrasa quando podemos acessar a aplicação no navegador.

3. Os gatilhos `resolveId`, `load`, e `transform` pode fazer alguns ficheiros carregarem mais lento do que outros. Embora inevitável algumas vezes, ainda vale a pena verificar por possíveis áreas à otimizar. Por exemplo, verificar se o `code` contém uma palavra-chave específica, ou o `id` corresponde à uma extensão específica, antes de fazer a transformação completa:

   Quanto mais tempo demorar para transformar um ficheiro, mais significativo a cascata de requisição será quando carregarmos a aplicação no navegador.

   Nós podemos inspecionar a duração do tempo que demora para transformar um ficheiro  usando `vite --debug plugin-transform` ou [`vite-plugin-inspect]`(https://github.com/antfu/vite-plugin-inspect). Nota que, uma vez que as operações assíncronas tendem a fornecer tempos imprecisos, devemos tratar os números como uma estimativa grosseira, mas ainda deve revelar as operações mais extensas.

:::tip Perfilamento
Nós podemos executar `vite --profile`, visitar a aplicação, e pressionar `p + enter` no nosso terminal para registar um `.cpuprofile`. Uma ferramenta como [`speedscope`](https://www.speedscope.app) pode então ser usada para inspecionar o perfil e identificar os gargalos. Nós também podemos [partilhar os perfis](https://chat.vitejs.dev) com a equipa da Vite para ajudá-los a identificarem os problemas de desempenho.
:::

## Reduzir as Operações de Resolução {#reduce-resolve-operations}

A resolução dos caminhos da importação pode ser uma operação extensiva quando alcançamos muitas vezes o pior caso. Por exemplo a Vite suporta a "suposição" dos caminhos da importação com a opção [`resolve.extensions`](/config/shared-options#resolve-extensions), que predefine para `['.mjs', '.js', '.mts', '.ts', '.jsx', '.tsx', '.json']`.

Quando tentamos importar `./Component.jsx` com `import './Component'`, a Vite executará estas etapas para resolvê-la:

1. Verificar se `./Component` existe, não.
2. Verificar se `./Component.mjs` existe, não.
3. Verificar se `./Component.js` existe, não.
4. Verificar se `./Component.mts` existe, não.
5. Verificar se `./Component.ts` existe, não.
6. Verificar se `./Component.jsx` existe, sim!

Como mostrado, um total de 6 verificações do sistema de ficheiro é necessário para resolver um caminho de importação. Quanto mais implícitas forem as importações que tivermos, mais tempo adiciona-se para resolver os caminhos.

Por isso, é normalmente melhor ser explícito com os nossos caminhos de importação, por exemplo `import './Component.jsx'`. Nós também podemos limitar a lista para `resolve.extensions` para reduzir as verificações do sistema de ficheiro geral, mas também precisamos de certificar-nos de que funciona para os ficheiros no `node_modeles`.

Se formos autores de extensão, devemos certificar-nos de apenas chamar [`this.resolve`](https://rollupjs.org/plugin-development/#this-resolve) quando precisamos reduzir o número de verificações de cima.

:::tip TypeScript
Se estivermos a usar a TypeScript, podemos ativar `"moduleResolution": "bundler"` e `"allowImportingTsExtensions": true` na `compilerOptions` do nosso `tsconfig.json` para usarmos extensões `.ts` e `tsx` diretamente no nosso código.
:::

## Evitar Ficheiros Embarricados {#avoid-barrel-files}

Os ficheiros embarricados são ficheiros que re-exportam as APIs dos outros ficheiros no mesmo diretório. Por exemplo:

```js
// src/utils/index.js
export * from './color.js'
export * from './dom.js'
export * from './slash.js'
```

Quando apenas importamos uma API individual, por exemplo `import { slash } from './utils.js'`, todos os ficheiros que neste ficheiro de embarricamento precisam de ser trazidos e transformados, uma vez que podem conter a API `slash` e também podem conter efeitos colaterais que executam durante a inicialização. Isto significa que estamos a carregar mais ficheiros do que o necessário no carregamento inicial da página, resultando num carregamento de página mais lento.

Se possível, devemos evitar ficheiros embarricados e importar as APIs individuais diretamente, por exemplo `import { slash } from './utils/slash.js'`. Nós podemos ler o [problema #8237](https://github.com/vitejs/vite/issues/8237) por mais informação.

## Aquecer os Ficheiros Usado Frequentemente {#warm-up-frequently-used-files}

O servidor de desenvolvimento da Vite apenas transforma os ficheiros conforme requisitado pelo navegador, o que o permite iniciar rapidamente e apenas aplicar transformações para os ficheiros usados. Também pode pré-transformar ficheiros se antecipar-se, certos ficheiros serão requisitados em breve. No entanto, as cascatas de requisição ainda podem acontecer se alguns ficheiros demorarem mais para transformar do que outros. Por exemplo:

Dado um gráfico de importação onde o ficheiro da esquerda importa o ficheiro da direita:

```
main.js -> BigComponent.vue -> big-utils.js -> large-data.json
```

O relação da importação apenas pode ser conhecida depois do ficheiro ser transformado. Se `BigComponent` demorar algum tempo à transformar, `big-utils.js` tem de aguardar pela sua vez, e assim por diante. Isto causa uma cascata interna mesmo com a pré-transformação embutida.

A Vite permite-nos aquecer ficheiros que sabemos que são usados frequentemente, por exemplo `big-utils.js`, usando a opção [`server.warmup`](/config/server-options#server-warmup). Desta maneira `big-utils.js` estará pronto e armazenado para consulta imediata para ser servido imediatamente quando requisitado.

Nós podemos encontrar os ficheiros que são frequentemente usados executando `vite --debug transform` e inspecionar os registos:

```bash
vite:transform 28.72ms /@vite/client +1ms
vite:transform 62.95ms /src/components/BigComponent.vue +1ms
vite:transform 102.54ms /src/utils/big-utils.js +1ms
```

```js
export default defineConfig({
  server: {
    warmup: {
      clientFiles: [
        './src/components/BigComponent.vue',
        './src/utils/big-utils.js',
      ],
    },
  },
})
```

Nota que apenas podemos aquecer os ficheiros que são frequentemente usados para não sobrecarregar o servidor de desenvolvimento da Vite durante a inicialização. Consulte a opção [`server.warmup`](/config/server-options#server-warmup) por mais informação.

O uso de [`--open` ou `server.open`](/config/server-options#server-open) também fornece um aumento de desempenho, uma vez que a Vite aquecerá automaticamente o ponto de entrada da nossa aplicação ou a URL fornecida à abrir.

# Usar Ferramentas Mais Pequenas ou Nativas {#use-lesser-or-native-tooling}

Manter a Vite rápida com uma base de código em crescimento é reduzir a quantidade de trabalho para os ficheiros de código-fonte (JS/TS/CSS).

Exemplos de como fazer menos trabalho:

- Usar a CSS ao invés de Sass/Less/Stylus quando possível (o encaixamento pode ser manipulado por PostCSS)
- Não transformar os SVG em componentes de abstrações de interface (React, Vue, etc). No lugar disto, as importamos como sequências de caracteres ou URLS.
- Quando usarmos `@vitejs/plugin-react`, evitamos configurar as opções da Babel, para que ela pule a transformação durante a compilação (apenas a `esbuild` será usada).

Exemplos de uso de ferramentas nativas:

Usar ferramentas nativas acarreta frequentemente um tamanho de instalação maior e, como tal, não é o padrão ao começar um novo projeto de Vite. Mas pode valer a pena o custo para aplicação maiores.

- Teste o suporte experimental para [LightningCSS](https://github.com/vitejs/vite/discussions/13835)
- Use [`@vitejs/plugin-react-swc`](https://github.com/vitejs/vite-plugin-react-swc) no lugar de `@vitejs/plugin-react`.
