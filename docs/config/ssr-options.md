# Opções da Interpretação do Lado do Servidor {#ssr-options}

## `ssr.external` {#ssr-external}

- **Tipo:** `string[] | true`
- **Relacionado aos:** [O Exterior da Interpretação do Lado do Servidor](/guide/ssr#ssr-externals)

Exterioriza as dependências dadas e suas dependências transitivas para a interpretação do lado do servidor. Por padrão, todas as dependências são exteriorizadas exceto para dependências ligadas (para substituição de módulo instantânea). Se preferirmos exteriorizar a dependência ligada, podemos passar o seu nome a esta opção.

Se `true`, todas as dependências, incluindo as dependências ligadas, são exteriorizadas.

Nota que as dependências listadas explicitamente (usando o tipo `string[]`) sempre terão prioridade se também estiverem listadas em `ssr.noExternal` (usando qualquer tipo).

## `ssr.noExternal` {#ssr-noexternal}

- **Tipo:** `string | RegExp | (string | RegExp)[] | true`
- **Relacionado aos:** [O Exterior da Interpretação do Lado do Servidor](/guide/ssr#ssr-externals)

Impedi as dependências listadas de serem exteriorizadas para interpretação do lado do servidor, que serão empacotadas na construção. Por padrão, apenas as dependências ligadas não são exteriorizadas (para substituição de módulo instantânea). Se preferirmos exteriorizar a dependência ligada, podemos passar o seu nome à opção `ssr.external`.

Se `true`, nenhuma dependência é exteriorizada. No entanto, dependências explicitamente listadas em `ssr.external` (usando o tipo `string[]`) podem ter prioridade e ainda assim serem exteriorizadas. Se `ssr.target: 'node'` for definida, os embutidos da Node.js também serão exteriorizados por padrão.

Nota que se ambas `ssr.noExternal: true` e `ssr.external: true` forem configuradas, `ssr.noExternal` tem prioridade e nenhuma dependência é exteriorizada.

## `ssr.target` {#ssr-target}

- **Tipo:** `'node' | 'webworker'`
- **Predefinido como:** `node`

Alvo da construção para o servidor da interpretação do lado do servidor.

## `ssr.resolve.conditions` {#srr-resolve-conditions}

- **Tipo:** `string[]`
- **Relacionada às:** [Condições de Resolução](./shared-options#resolve-conditions)

Predefine para a [`resolve.conditions`](./shared-options#resolve-conditions) de raiz.

Estas condições são usadas na conduta de extensão, e apenas afetam as dependências não são exteriorizadas durante a construção da interpretação do lado do servidor. Usamos `ssr.resolve.externalConditions` para afetar as importações exteriorizadas.

## `ssr.resolve.externalConditions` {#ssr-resolve-externalconditions}

- **Tipo:** `string[]`
- **Predefinido como:** `[]`

Condições usadas durante a importação da interpretação do lado do servidor (incluindo `ssrLoadModule`) das dependências exteriorizadas.
