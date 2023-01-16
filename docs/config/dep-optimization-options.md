# Opções de Otimização de Dependência {#dep-optimization-options}

- **Relacionado ao:** [Pré-Empacotamento de Dependência](/guide/dep-pre-bundling)

## optimizeDeps.entries {#optimizedeps-entries}

- **Tipo:** `string | string[]`

Por padrão, a Vite rastreará todos os teus ficheiros `.html` para detetar dependências que precisam ser pré-empacotadas (ignorando a `node_modules`, `build.outDir`, `__tests__` e `coverage`). Se `build.rollupOptions.input` for especificado, a Vite rastreará estes pontos de entrada.

Se nenhum destes adequado as tuas necessidades, podes especificar entradas personalizadas utilizando esta opção - o valor deve ser um [padrão `fast-glob`](https://github.com/mrmlnc/fast-glob#basic-syntax) ou um arranjo de padrões que são relativos da raiz do projeto de Vite. Isto sobrescreverá as inferências de entradas padrão. Apenas as pastas `node_modules` e `build.outDir` serão ignoradas por padrão quando a `optimizeDeps.entries` for explicitamente definidas. Se outras pastas precisarem ser ignoradas, podes utilizar um padrão de ignorar como parte da lista de entradas, marcado com um `!` inicial.

## optimizeDeps.exclude {#optimizedeps-exclude}

- **Tipo:** `string[]`

Dependências à excluir do pré-empacotamento.

:::warning CommonJS
As dependências da CommonJS não devem ser excluídas da otimização. Se uma dependência de Módulo de ECMAScript for excluída da otimização, mas tiver uma dependência de CommonJS encaixada, a dependência de CommonJS deve ser adicionada ao `optimizeDeps.include`. Por exemplo:

```js
export default defineConfig({
  optimizeDeps: {
    include: ['esm-dep > cjs-dep']
  }
})
```

:::

## optimizeDeps.include {#optimizedeps-include}

- **Tipo:** `string[]`

Por padrão, pacotes ligados não os que estão dentro do `node_modules` não são pré-empacotados. Utilize esta opção para forçar com que um pacote ligado seja pré-empacotado.

## optimizeDeps.esbuildOptions {#optimizedeps-esbuildoptions}

- **Tipo:** [`EsbuildBuildOptions`](https://esbuild.github.io/api/#simple-options)

Opções para passar para esbuild durante o exame e otimização de dependência.

Certas opções são omitidas visto que a mudança delas não seria compatível com otimização de dependência da Vite.

- `external` também é omitida, utilize a opção `optimizeDeps.exclude` da Vite
- `plugins` são combinadas com a extensão de dependência da Vite

## optimizeDeps.force {#optimizedeps-force}

- **Tipo:** `boolean`

Defina para `true` para forçar o pré-empacotamento de dependência, ignorando as dependências otimizadas cacheadas previamente.
