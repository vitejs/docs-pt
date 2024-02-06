# Opções de Otimização de Dependência {#dep-optimization-options}

- **Relacionado ao:** [Pré-Empacotamento de Dependência](/guide/dep-pre-bundling)

## `optimizeDeps.entries` {#optimizedeps-entries}

- **Tipo:** `string | string[]`

Por padrão, a Vite rastreará todos os teus ficheiros `.html` para detetar dependências que precisam ser pré-empacotadas (ignorando a `node_modules`, `build.outDir`, `__tests__` e `coverage`). Se `build.rollupOptions.input` for especificado, a Vite rastreará estes pontos de entrada.

Se nenhum destes adequado as tuas necessidades, podes especificar entradas personalizadas utilizando esta opção - o valor deve ser um [padrão `fast-glob`](https://github.com/mrmlnc/fast-glob#basic-syntax) ou um arranjo de padrões que são relativos da raiz do projeto de Vite. Isto sobrescreverá as inferências de entradas padrão. Apenas as pastas `node_modules` e `build.outDir` serão ignoradas por padrão quando a `optimizeDeps.entries` for explicitamente definidas. Se outras pastas precisarem ser ignoradas, podes utilizar um padrão de ignorar como parte da lista de entradas, marcado com um `!` inicial.

## `optimizeDeps.exclude` {#optimizedeps-exclude}

- **Tipo:** `string[]`

Dependências à excluir do pré-empacotamento.

:::warning Aviso sobre a CommonJS
As dependências da CommonJS não devem ser excluídas da otimização. Se uma dependência de Módulo de ECMAScript for excluída da otimização, mas tiver uma dependência de CommonJS encaixada, a dependência de CommonJS deve ser adicionada ao `optimizeDeps.include`. Por exemplo:

```js
export default defineConfig({
  optimizeDeps: {
    include: ['esm-dep > cjs-dep']
  }
})
```

:::

## `optimizeDeps.include` {#optimizedeps-include}

- **Tipo:** `string[]`

Por padrão, pacotes ligados que não estão dentro da `node_modules` não são pré-empacotados. Utilize esta opção para forçar com que um pacote ligado seja pré-empacotado.

**Experimental:** Se estiveres a usar uma biblioteca com muitas importações profundas, podes também especificar um padrão global final para pré-empacotar todas as importações de uma vez. Isto evitará pré-empacotar constantemente sempre que uma importação profunda for usada. Por exemplo:

```js
export default defineConfig({
  otimizeDeps: {
    include: ['my-lib/components/**/*.vue'],
  },
})
```

## `optimizeDeps.esbuildOptions` {#optimizedeps-esbuildoptions}

- **Tipo:** [`EsbuildBuildOptions`](https://esbuild.github.io/api/#simple-options)

Opções para passar para esbuild durante o exame e otimização de dependência.

Certas opções são omitidas visto que a mudança delas não seria compatível com otimização de dependência da Vite.

- `external` também é omitida, utilize a opção `optimizeDeps.exclude` da Vite
- `plugins` são combinadas com a extensão de dependência da Vite

## `optimizeDeps.force` {#optimizedeps-force}

- **Tipo:** `boolean`

Defina como `true` para forçar o pré-empacotamento de dependência, ignorando as dependências otimizadas previamente armazenadas para consulta imediata.

## `optimizeDeps.holdUntilCrawlEnd` {#optimizedeps-holduntilcrawlend}

- **Experimental**
- **Tipo:** `boolean`
- **Predefinido como:** `true`

Quando ativado, segurará os primeiros resultados das dependências otimizadas até que todas as importações estáticas serem rastreadas na inicialização fria. Isto evita a necessidade de recarregar a página inteira quando são descobertas novas dependências e estas acionam a geração de novos pedaços comuns. Se todas as dependências forem encontradas pelo verificador mais aquelas explicitamente definidas na `include`, é melhor desativar esta opção para deixar o navegador processar mais requisições em paralelo.

## `optimizeDeps.disabled` {#optimizedeps-disabled}

- **Depreciada**
- **Experimental:** [Comentar](https://github.com/vitejs/vite/discussions/13839)
- **Tipo:** `boolean | 'build' | 'dev'`
- **Predefinido como:** `'build'`

Esta opção está depreciada. Na Vite 5.1, o pré-empacotamento das dependências durante a construção não foi removida. Definir `optimizeDeps.disabled` para `true` ou `'dev'` desativa o otimizador, e configurada para `false` ou `'build'` deixa o otimizador durante o desenvolvimento ativado.

Para desativar o otimizador completamente, usamos `optimizeDeps.noDiscovery: true` para não permitir a descoberta automática de dependências e deixar `optimizeDeps.include` indefinido ou vazio.

:::warning AVISO
A otimização de dependências durante o momento da construção foi uma funcionalidade **experimental**. Os projetos que experimentaram esta estratégia também removeram `@rollup/plugin-commonjs` utilizando `build.commonjsOptions: { include: [] }`. Se fizermos isso, um aviso nos guiará a reativá-lo para suportar apenas pacotes CJS durante o empacotamento.
:::

## `optimizeDeps.needsInterop` {#optimizedeps-needsinterop}

- **Experimental**
- **Tipo:** `string[]`

Força a interoperação de Módulo de ECMAScript quando estiver a importar estas dependências. A Vite é capaz de detetar apropriadamente quando uma dependência precisa interoperar, assim esta opção geralmente não é necessária. No entanto, combinações diferentes de dependências poderia fazer algumas delas serem pré-empacotadas de maneira diferente. Adicionar estes pacotes ao `needsInterop` pode acelerar o arranque a frio evitando recarregamentos da página inteira. Receberás um aviso se este for o caso para uma das tuas dependências, sugerindo adicionar o nome do pacote para este arranjo na tua configuração.
