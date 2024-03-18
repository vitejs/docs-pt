# Opções de Otimização de Dependência {#dep-optimization-options}

- **Relacionado ao:** [Pré-Empacotamento de Dependência](/guide/dep-pre-bundling)

## `optimizeDeps.entries` {#optimizedeps-entries}

- **Tipo:** `string | string[]`

Por padrão, a Vite rastreará todos os nossos ficheiros `.html` para detetar as dependências que precisam ser pré-empacotadas (ignorando a `node_modules`, `build.outDir`, `__tests__` e `coverage`). Se a `build.rollupOptions.input` for especificada, a Vite rastreará estes pontos de entrada.

Se nenhuma destas opções se adequar às nossas necessidades, podemos especificar entradas personalizadas usando esta opção - o valor deve ser um [padrão `fast-glob`](https://github.com/mrmlnc/fast-glob#basic-syntax) ou um vetor de padrões que são relativos à raiz do projeto da Vite. Isto sobrescreverá a inferência das entradas padrão. Só as pastas `node_modules` e `build.outDir` serão ignoradas por padrão quando `optimizeDeps.entries` for explicitamente definida. Se as outras pastas precisarem de ser ignoradas, podemos usar um padrão de ignorar como parte da lista de entradas, marcada com uma `!` inicial.

## `optimizeDeps.exclude` {#optimizedeps-exclude}

- **Tipo:** `string[]`

Dependências a excluir do pré-empacotamento.

:::warning CommonJS
As dependências de CommonJS não devem ser excluídas da otimização. Se uma dependência de Módulo de ECMAScript for excluída da otimização, mas tem uma dependência de CommonJS encaixada, a dependência de CommonJS devem ser adicionadas a `optimizeDeps.include`. Exemplo:

```js twoslash
import { defineConfig } from 'vite'
// ---cut---
export default defineConfig({
  optimizeDeps: {
    include: ['esm-dep > cjs-dep'],
  },
})
```

:::

## `optimizeDeps.include` {#optimizedeps-include}

- **Tipo:** `string[]`

Por padrão, os pacotes ligados que não estão dentro da `node_modules` não são pré-empacotados. Usamos esta opção para forçar um pacote ligado a ser pré-empacotado.

**Experimental:** Se estivermos usando uma biblioteca com muitas importações profundas, também podemos especificar um padrão de globo à direita para pré-empacotar todas as importações de uma só vez. Isto evitará o pré-empacotamento constante sempre que uma nova importação profunda for usada. [Comentar nas Discussões](https://github.com/vitejs/vite/discussions/15833). Por exemplo:

```js twoslash
import { defineConfig } from 'vite'
// ---cut---
export default defineConfig({
  optimizeDeps: {
    include: ['my-lib/components/**/*.vue'],
  },
})
```

## `optimizeDeps.esbuildOptions` {#optimizedeps-esbuildoptions}

- **Tipo:** [`Omit`](https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys)`<`[`EsbuildBuildOptions`](https://esbuild.github.io/api/#simple-options)`,
| 'bundle'
| 'entryPoints'
| 'external'
| 'write'
| 'watch'
| 'outdir'
| 'outfile'
| 'outbase'
| 'outExtension'
| 'metafile'>`

Opções a passar à `esbuild` durante a verificação e otimização de dependência.

Certas opções estão omitidas porque a sua alteração não seria compatível com a otimização de dependência da Vite.

- `external` também está omitida, usamos a opção `optimizeDeps.exclude` da Vite
- `plugins` são combinadas com a extensão de dependência da Vite

## `optimizeDeps.force` {#optimizedeps-force}

- **Tipo:** `boolean`

Defina como `true` para forçar o pré-empacotamento de dependência, ignorando as dependências otimizadas previamente armazenadas para consulta imediata.

## `optimizeDeps.holdUntilCrawlEnd` {#optimizedeps-holduntilcrawlend}

- **Experimental:** [Comentar nas Discussões](https://github.com/vitejs/vite/discussions/15834)
- **Tipo:** `boolean`
- **Predefinido como:** `true`

Quando ativado, segurará os primeiros resultados das dependências otimizadas até que todas as importações estáticas serem rastreadas na inicialização fria. Isto evita a necessidade de recarregar a página inteira quando são descobertas novas dependências e estas acionam a geração de novos pedaços comuns. Se todas as dependências forem encontradas pelo verificador mais aquelas explicitamente definidas na `include`, é melhor desativar esta opção para deixar o navegador processar mais requisições em paralelo.

## `optimizeDeps.disabled` {#optimizedeps-disabled}

- **Depreciada**
- **Experimental:** [Comentar](https://github.com/vitejs/vite/discussions/13839)
- **Tipo:** `boolean | 'build' | 'dev'`
- **Predefinido como:** `'build'`

Esta opção foi depreciada. Na Vite 5.1, o pré-empacotamento das dependências durante a construção foi removido. Definir `optimizeDeps.disabled` como `true` ou `'dev'` desativa o otimizador, e configurada como `false` ou `'build'` deixa o otimizador durante o desenvolvimento ativado.

Para desativar completamente o otimizador, usamos `optimizeDeps.noDiscovery: true`  para não permitir a descoberta automática de dependências e deixar `optimizeDeps.include` indefinido ou vazio.

:::warning AVISO
A otimização de dependências durante a construção era uma funcionalidade **experimental**. Os projetos que experimentaram esta estratégia também removeram `@rollup/plugin-commonjs` usando `build.commonjsOptions: { include: [] }`. Se o fizermos, um aviso guiar-nos-á para o reativarmos para suportar apenas pacotes de CommonJS durante o empacotamento.
:::

## `optimizeDeps.needsInterop` {#optimizedeps-needsinterop}

- **Experimental**
- **Tipo:** `string[]`

Força a interoperabilidade do Módulo de ECMAScript ao importar estas dependências. A Vite é capaz de detetar corretamente quando uma dependência precisa de interoperabilidade, portanto, esta opção geralmente não é necessária. No entanto, diferentes combinações de dependências poderiam fazer algumas destas serem pré-empacotadas de maneira diferente. Adicionar estes pacotes ao `needsInterop` pode acelerar a inicialização fria, evitando recargas de página inteira. Receberemos um aviso se este for o caso duma das nossas dependências, sugerindo que adicionemos o nome do pacote a este vetor na nossa configuração.
