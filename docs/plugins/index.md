# Extensões {#plugins}

:::tip NOTA
A Vite tem por objetivo fornecer suporte fora da caixa para os padrões de desenvolvimento da Web comuns. Antes de procurar por uma extensão compatível com a Vite ou Rollup, consulte o [Guia de Funcionalidades](../guide/features). Muitos casos onde uma extensão seria necessária num projeto de Rollup já são cobertos na Vite.
:::

Consulte o guia [Usando Extensões](../guide/using-plugins) por informações a respeito de como usar as extensões.

## Extensões Oficiais {#official-plugins}

### [`@vitejs/plugin-vue`](https://github.com/vitejs/vite-plugin-vue/tree/main/packages/plugin-vue)

- Fornece suporte para Componentes de Ficheiro Único da Vue 3

### [`@vitejs/plugin-vue-jsx`](https://github.com/vitejs/vite-plugin-vue/tree/main/packages/plugin-vue-jsx)

- Fornece suporte de JSX da Vue 3 (através da [transformação da Babel dedicada](https://github.com/vuejs/jsx-next)).

### [`@vitejs/plugin-vue2`](https://github.com/vitejs/vite-plugin-vue2)

- Fornece suporta aos Componentes de Ficheiro Único da Vue 2.7.

### [`@vitejs/plugin-vue2-jsx`](https://github.com/vitejs/vite-plugin-vue2-jsx)

- Fornece suporte de JSX da Vue 2.7 (através da [transformação da Babel dedicada](https://github.com/vuejs/jsx-vue2/)).

### [`@vitejs/plugin-react`](https://github.com/vitejs/vite-plugin-react/tree/main/packages/plugin-react)

- Usa a `esbuild` e a Babel, alcançando a rápida substituição de módulo instantânea com uma pequena pegada de pacote e a flexibilidade de ser capaz de usar a conduta de transformação da Babel. Sem as extensões adicionais da Babel, apenas a `esbuild` é usada durante as construções.

### [`@vitejs/plugin-react-swc`](https://github.com/vitejs/vite-plugin-react-swc)

- Substitui a Babel pela SWC durante o desenvolvimento. Durante as construções, a SWC e a `esbuild` são usadas quando usamos extensões, de outro modo apenas a `esbuild` é usada. Para projetos grandes não exigem extensões de React não-padronizadas, o arranque refrigerado e a substituição de módulo instantânea podem ser significativamente mais rápidos.

### [`@vitejs/plugin-legacy`](https://github.com/vitejs/vite/tree/main/packages/plugin-legacy)

- Fornece suporte de navegadores legados para a construção de produção.

## Extensões da Comunidade {#community-plugins}

Consulte a [`awesome-vite`](https://github.com/vitejs/awesome-vite#plugins) - também podemos submeter um pedido de atualização de repositório (ou PR) para listar as nossas extensões dentro do repositório.

## Extensões de Rollup {#rollup-plugins}

As [extensões da Vite](../guide/api-plugin) são uma extensão da interface de extensão da Rollup. Consulte a [seção de Compatibilidade de Extensão de Rollup](../guide/api-plugin#rollup-plugin-compatibility) por mais informações.
