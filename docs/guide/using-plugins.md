# Usando Extensões {#using-plugins}

A Vite pode ser estendida usando extensões, que são baseadas na interface de extensão bem desenhadas da Rollup com algumas opções adicionais específicas para Vite. Isto significa que os utilizadores da Vite podem confiar no ecossistema maduro de extensões de Rollup, enquanto também são capazes de estender o servidor de desenvolvimento e a funcionalidade da interpretação do lado do servidor conforme necessário.

## Adicionando uma Extensão {#adding-a-plugin}

Para usar uma extensão, esta precisa ser adicionada à `devDependencies` do projeto e incluída no vetor de `plugins` no ficheiro de configuração `vite.config.js`. Por exemplo, para fornecer suporte aos navegadores antigos, o pacote [`@vitejs/plugin-legacy`](https://github.com/vitejs/vite/tree/main/packages/plugin-legacy) oficial pode ser usado:

```
$ npm add -D @vitejs/plugin-legacy
```

```js
// vite.config.js
import legacy from '@vitejs/plugin-legacy'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    legacy({
      targets: ['defaults', 'not IE 11'],
    }),
  ],
})
```

O `plugins` também aceita predefinições incluindo várias extensões como um único elemento. Isto é útil para funcionalidades complexas (como integração de abstração) que são implementadas usando várias extensões. O vetor será simplificado (ou aplanado) internamente.

As extensões falsas serão ignoradas, as quais podem ser usadas para ativar e desativar facilmente as extensões.

## Encontrando Extensões {#finding-plugins}

:::tip NOTA
A Vite tem por objetivo fornecer suporte fora da caixa para os padrões de desenvolvimento da Web comuns. Antes de procurarmos por uma extensão compatível com a Vite ou com a Rollup, devemos consultar o [Guia de Funcionalidades](../guide/features). Muitos casos onde uma extensão seria necessária num projeto de Rollup já são cobertos pela Vite.
:::

Consulte a [seção de Extensões](../plugins/) por informação sobre a extensões oficiais. As extensões da comunidade são listadas no [`awesome-vite`](https://github.com/vitejs/awesome-vite#plugins).

Nós também podemos encontrar extensões que seguem as [convenções recomendadas](./api-plugin#conventions) usando um [`npm search` por `vite-plugin`](https://www.npmjs.com/search?q=vite-plugin&ranking=popularity) para extensões de Vite ou um [`npm search` por `rollup-plugin`](https://www.npmjs.com/search?q=rollup-plugin&ranking=popularity) para extensões de Rollup.

## Forçando o Ordenamento de Extensão {#enforcing-plugin-ordering}

Para compatibilidade com algumas extensões de Rollup, pode ser necessário forçar a ordem da extensão ou apenas aplicar durante a construção. Isto deve ser um detalhe de implementação para extensões de Vite. Nós podemos forçar a posição duma extensão com o modificador `enforce`:

- `pre`: invoca a extensão antes das extensões principais da Vite
- `default`: invoca a extensão depois das extensões principais da Vite
- `post`: invoca a extensão depois das extensões de construção da Vite

```js
// vite.config.js
import image from '@rollup/plugin-image'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    {
      ...image(),
      enforce: 'pre',
    },
  ],
})
```

Consulte o [Guia da API de Extensões](./api-plugin.md#plugin-ordering) por informação detalhada.

## Aplicação Condicional {#conditional-application}

Por padrão, as extensões são invocadas por ambos comandos `serve` e `build`. Nos casos onde uma extensão precisa ser condicionalmente aplicada apenas durante a execução do comando `serve` ou `build`, usamos a propriedade `apply` para apenas invocá-las durante o `'build'` ou `'serve'`;

```js
// vite.config.js
import typescript2 from 'rollup-plugin-typescript2'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    {
      ...typescript2(),
      apply: 'build',
    },
  ],
})
```

## Construindo Extensões {#building-plugins}

Consulte o [Guia da API de Extensões](./api-plugin) pela documentação sobre a criação de extensões.
