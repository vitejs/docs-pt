# Opções da SSR {#ssr-options}

## `ssr.external `{#ssr-external}

- **Tipo:** `string[]`
- **Relacionado ao:** [Aspetos Externos da SSR](/guide/ssr#ssr-externals)

Força a exposição de dependências para a SSR.

## `ssr.noExternal` {#ssr-noexternal}

- **Tipo:** `string | RegExp | (string | RegExp)[] | true`
- **Relacionado ao:** [Aspetos Externos da SSR](/guide/ssr#ssr-externals)

Impede as dependências listadas de serem expostas externamente para a SSR. Se for `true`, nenhuma dependência é exposta externamente.

## `ssr.target` {#ssr-target}

- **Tipo:** `'node' | 'webworker'`
- **Predefinido como:** `node`

Alvo da construção para o servidor da SSR.

## `ssr.resolve.conditions` {#srr-resolve-conditions}

- **Tipo:** `string[]`
- **Relacionada:** [Resolver Condições](./shared-options#resolve-conditions)

Predefine para a [`resolve.conditions`](./shared-options#resolve-conditions) de raiz.

Estas condições são usadas na conduta de extensão, e apenas afetam dependências não externalizadas durante a construção da interpretação no lado do servidor. Use `ssr.resolve.externalConditions` para afetar as importações externalizadas.

## `ssr.resolve.externalConditions` {#ssr-resolve-externalconditions}

- **Tipo:** `string[]`
- **Predefinido como:** `[]`

Condições que são usadas durante a importação da interpretação do lado do servidor (incluindo `ssrLoadModule`) das dependências externalizadas.
