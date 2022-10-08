# Utilizando Extensões

A Vite pode ser estendida com a utilização de extensões, as quais são baseadas na bem desenhada interface de extensão da Rollup com algumas opções adicionais especificas de Vite. Isto significa que os utilizadores de Vite podem confiar no ecossistema maduro de extensões de Rollup, ao passo que são capazes de estender o servidor de desenvolvimento e a funcionalidade de interpretação no lado do servidor (SSR) conforme necessário.

## Adicionando uma Extensão

Para utilizar uma extensão, ela precisa ser adicionada ao `devDependencies` do projeto e incluída no arranjo de `plugins` no ficheiro de configuração `vite.config.js`. Por exemplo, para fornecer suporte para navegadores legados, o [`@vitejs/plugin-legacy`](https://github.com/vitejs/vite/tree/main/packages/plugin-legacy) oficial pode ser utilizado:

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
      targets: ['defaults', 'not IE 11']
    })
  ]
})
```

Os `plugins` também aceita programações incluindo várias extensões como um único elemento. Isto é útil para funcionalidades complexas (como integração de abstração) que são implementadas utilizando várias extensões. O arranjo será aplanado internamente.

As extensões falsas (ou "falsy") serão ignoradas, as quais podem ser utilizadas para ativar e desativar facilmente as extensões.

## Encontrando Extensões

:::tip NOTA
A Vite tem por objetivo fornecer suporte fora da caixa para padrões de desenvolvimento de web comuns. Antes de procurares por uma extensão compatível com a com a Vite ou com a Rollup, consulte o [Guia de Funcionalidades](../guide/features.md). Muitos casos onde uma extensão seria necessária em um projeto de Rollup já são cobridas pela Vite.
:::

Consulta a [secção de Extensões](../plugins/) para obter informações a respeito das extensões oficiais. As extensões da comunidade são listadas na [awesome-vite](https://github.com/vitejs/awesome-vite#plugins). Para extensões compatíveis de Rollup, consulte [Extensões de Rollup de Vite](https://vite-rollup-plugins.patak.dev) para obter uma lista de extensões de Rollup oficiais compatíveis com as instruções de utilização ou a [secção Compatibilidade de Extensão de Rollup](../guide/api-plugin#rollup-plugin-compatibility) no caso de não estar listada lá.

Tu também podes encontrar extensões que sigam as [convenções recomendadas](./api-plugin.md#conventions) utilizando um comando [`npm search` para `vite-plugin`](https://www.npmjs.com/search?q=vite-plugin&ranking=popularity) para extensões de Vite ou um [`npm search` para `rollup-plugin`](https://www.npmjs.com/search?q=rollup-plugin&ranking=popularity) para extensões de Rollup.

## Forçando a Ordem de Extensão

Para compatibilidade com algumas extensões de Rollup, talvez seja necessário forçar a ordem da extensão ou apenas aplicar no momento da construção. Isto deve ser um detalhe de implementação para extensões de Vite. Tu podes forçar a posição de uma extensão com o modificador `enforce`:

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
      enforce: 'pre'
    }
  ]
})
```

Consulte o [Guia da API de Extensões](./api-plugin.md#ordenamento-de-extensões) para obter informações detalhadas, e esteja atento ao rótulo `enforce` e instruções de utilização para as extensões populares na listagem de compatibilidade de [Extensões de Rollup de Vite](https://vite-rollup-plugins.patak.dev).

## Aplicação Condicional

Por padrão, as extensões são invocadas para ambos servir (`serve`) e construir (`build`). Nos casos onde uma extensão precisa ser condicionalmente aplicada apenas durante o servir (`serve`) ou construir (`build`), utilize a propriedade `apply` para os invocar apenas durante `'build'` ou `'serve'`:

```js
// vite.config.js
import typescript2 from 'rollup-plugin-typescript2'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    {
      ...typescript2(),
      apply: 'build'
    }
  ]
})
```

## Construindo Extensões

Consulte o [Guia da API de Extensões](./api-plugin.md) para obter a documentação a respeito da criação de extensões.
