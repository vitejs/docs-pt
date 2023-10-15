# Opções de Otimização de Dependência {#dep-optimization-options}

- **Relacionado ao:** [Pré-Empacotamento de Dependência](/guide/dep-pre-bundling)

## optimizeDeps.entries {#optimizedeps-entries}

- **Tipo:** `string | string[]`

Por padrão, a Vite rastreará todos os teus ficheiros `.html` para detetar dependências que precisam ser pré-empacotadas (ignorando a `node_modules`, `build.outDir`, `__tests__` e `coverage`). Se `build.rollupOptions.input` for especificado, a Vite rastreará estes pontos de entrada.

Se nenhum destes adequado as tuas necessidades, podes especificar entradas personalizadas utilizando esta opção - o valor deve ser um [padrão `fast-glob`](https://github.com/mrmlnc/fast-glob#basic-syntax) ou um arranjo de padrões que são relativos da raiz do projeto de Vite. Isto sobrescreverá as inferências de entradas padrão. Apenas as pastas `node_modules` e `build.outDir` serão ignoradas por padrão quando a `optimizeDeps.entries` for explicitamente definidas. Se outras pastas precisarem ser ignoradas, podes utilizar um padrão de ignorar como parte da lista de entradas, marcado com um `!` inicial.

## optimizeDeps.exclude {#optimizedeps-exclude}

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

## optimizeDeps.include {#optimizedeps-include}

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

## optimizeDeps.esbuildOptions {#optimizedeps-esbuildoptions}

- **Tipo:** [`EsbuildBuildOptions`](https://esbuild.github.io/api/#simple-options)

Opções para passar para esbuild durante o exame e otimização de dependência.

Certas opções são omitidas visto que a mudança delas não seria compatível com otimização de dependência da Vite.

- `external` também é omitida, utilize a opção `optimizeDeps.exclude` da Vite
- `plugins` são combinadas com a extensão de dependência da Vite

## optimizeDeps.force {#optimizedeps-force}

- **Tipo:** `boolean`

Defina para `true` para forçar o pré-empacotamento de dependência, ignorando as dependências otimizadas cacheadas previamente.

## optimizeDeps.disabled {#optimizedeps-disabled}

- **Experimental:** [Comente](https://github.com/vitejs/vite/discussions/13839)
- **Tipo:** `boolean | 'build' | 'dev'`
- **Predefinido como:** `'build'`

Desativa as otimizações de dependências, `true` desativa o otimizador durante a construção e desenvolvimento. Passe `'build'` ou `'dev'` para apenas desativar o otimizador em um dos modos. A otimização de dependência está desligada por padrão apenas no desenvolvimento.

:::warning AVISO
A otimização de dependências no modo de construção é **experimental**. Se ativada, remove uma das diferenças mais significativas entre o desenvolvimento e produção. O [`@rollup/plugin-commonjs`](https://github.com/rollup/plugins/tree/master/packages/commonjs) já não é necessário neste caso já que a esbuild converte dependências que estão apenas CJS para ESM.

Se quiseres testar esta estratégia de construção, podes usar `optimizeDeps.disabled: false`. `@rollup/plugin-commonjs` pode ser removido passando `build.commonjsOptions: { include: [] }`.
:::

## optimizeDeps.needsInterop {#optimizedeps-needsinterop}

- **Experimental**
- **Tipo:** `string[]`

Força a interoperação de Módulo de ECMAScript quando estiver a importar estas dependências. A Vite é capaz de detetar apropriadamente quando uma dependência precisa interoperar, assim esta opção geralmente não é necessária. No entanto, combinações diferentes de dependências poderia fazer algumas delas serem pré-empacotadas de maneira diferente. Adicionar estes pacotes ao `needsInterop` pode acelerar o arranque a frio evitando recarregamentos da página inteira. Receberás um aviso se este for o caso para uma das tuas dependências, sugerindo adicionar o nome do pacote para este arranjo na tua configuração.
