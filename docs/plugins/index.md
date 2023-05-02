# Extensões {#plugins}

:::tip NOTA
A Vite tem por objetivo fornecer suporte fora da caixa para os padrões comum de desenvolvimento de web. Antes de procurares por uma extensão compatível com a Vite ou Rollup, consulte o [Guia de Funcionalidades](../guide/features.md). Muitos casos onde uma extensão seria necessária em um projeto de Rollup já são cobertos na Vite.
:::

Consulte [Utilizando Extensões](../guide/using-plugins) para obter informações a respeito de como utilizar as extensões.

## Extensões Oficiais {#official-plugins}

### [@vitejs/plugin-vue](https://github.com/vitejs/vite-plugin-vue/tree/main/packages/plugin-vue)

- Fornece suporte para Componentes de Ficheiro Único de Vue 3

### [@vitejs/plugin-vue-jsx](https://github.com/vitejs/vite-plugin-vue/tree/main/packages/plugin-vue-jsx)

- Fornece suporte a JSX de Vue 3 (através da [opção `transform` de Babel dedicada](https://github.com/vuejs/jsx-next)).

### [@vitejs/plugin-vue2](https://github.com/vitejs/vite-plugin-vue2)

- Fornece suporta aos Componentes de Ficheiro Único da Vue 2.7.

### [@vitejs/plugin-vue2-jsx](https://github.com/vitejs/vite-plugin-vue2-jsx)

- Fornece suporte a Extensão de Sintaxe de JavaScript de Vue 2.7 (através da [transformação de babel dedicada](https://github.com/vuejs/jsx-vue2/)).

### [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/tree/main/packages/plugin-react)

- Usa a esbuild e Babel, alcançando HMR rápida com uma pegada de pacote pequena e a flexibilidade de ser capaz de usar a conduta de transformação da Babel. Sem as extensões adicionais da Babel, apenas a esbuild é usada durante as construções.

### [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc)

- Substitui a Babel pela SWC durante o desenvolvimento. Durante as construções, a SWC mais a esbuild são usadas quando estiveres a usar extensões, de outro modo apenas a esbuild é usada. Para projetos grandes não exige extensões de React não-padronizadas, inicio refrigerado e Substituição de Módulo Instantânea (HMR, sigla em Inglês) pode ser significativamente mais rápido.

### [@vitejs/plugin-legacy](https://github.com/vitejs/vite/tree/main/packages/plugin-legacy)

- Fornece suporte de navegadores legados para a construção de produção.

## Extensões da Comunidade {#community-plugins}

Consulte a [awesome-vite](https://github.com/vitejs/awesome-vite#plugins) - também podes submeter uma PR para listar as tuas extensões lá.

## Extensões de Rollup {#rollup-plugins}

As [extensões de Vite](../guide/api-plugin) são uma extensão da interface de extensão da Rollup. Consulte a [seção de Compatibilidade de Extensão de Rollup](../guide/api-plugin#rollup-plugin-compatibility) para obter mais informações.
