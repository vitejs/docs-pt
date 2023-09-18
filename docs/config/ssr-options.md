# Opções da SSR {#ssr-options}

## ssr.external {ssr-external}

- **Tipo:** `string[]`
- **Relacionado ao:** [Aspetos Externos da SSR](/guide/ssr#ssr-externals)

Força a exposição de dependências para a SSR.

## ssr.noExternal {ssr-noExternal}

- **Tipo:** `string | RegExp | (string | RegExp)[] | true`
- **Relacionado ao:** [Aspetos Externos da SSR](/guide/ssr#ssr-externals)

Impede as dependências listadas de serem expostas externamente para a SSR. Se for `true`, nenhuma dependência é exposta externamente.

## ssr.target {ssr-target}

- **Tipo:** `'node' | 'webworker'`
- **Predefinido como:** `node`

Alvo da construção para o servidor da SSR.

