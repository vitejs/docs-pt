# Opções da Interpretação do Lado do Servidor {#ssr-options}

## `ssr.external `{#ssr-external}

- **Tipo:** `string[]`
- **Relacionado aos:** [Aspetos Externos da Interpretação do Lado do Servidor](/guide/ssr#ssr-externals)

Força a exposição de dependências para a interpretação do lado do servidor.

## `ssr.noExternal` {#ssr-noexternal}

- **Tipo:** `string | RegExp | (string | RegExp)[] | true`
- **Relacionado aos:** [Aspetos Externos da Interpretação do Lado do Servidor](/guide/ssr#ssr-externals)

Impede as dependências listadas de serem expostas externamente para a interpretação do lado do servidor. Se for `true`, nenhuma dependência é exposta externamente.

## `ssr.target` {#ssr-target}

- **Tipo:** `'node' | 'webworker'`
- **Predefinido como:** `node`

Alvo da construção para o servidor da interpretação do lado do servidor.

## `ssr.resolve.conditions` {#srr-resolve-conditions}

- **Tipo:** `string[]`
- **Relacionada às:** [Condições de Resolução](./shared-options#resolve-conditions)

Predefine para a [`resolve.conditions`](./shared-options#resolve-conditions) de raiz.

Estas condições são usadas na conduta de extensão, e apenas afetam dependências não externalizadas durante a construção da interpretação no lado do servidor. Use `ssr.resolve.externalConditions` para afetar as importações externalizadas.

## `ssr.resolve.externalConditions` {#ssr-resolve-externalconditions}

- **Tipo:** `string[]`
- **Predefinido como:** `[]`

Condições que são usadas durante a importação da interpretação do lado do servidor (incluindo `ssrLoadModule`) das dependências externalizadas.
