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

## ssr.format {ssr-format}

- **Experimental**
- **Depreciada** Apenas saídas de Módulos de ECMAScript serão suportadas na Vite 5.
- **Tipo:** `'esm' | 'cjs'`
- **Predefinido como:** `esm`

Formato de construção para o servidor da SSR. Visto que na versão 3 da Vite a construção da SSR gera Módulo de ECMAScript por padrão. `'cjs'` pode ser selecionado para gerar uma construção em "CJS ou CommonJS", mas não é recomendado. A opção é deixada marcada como experimental para dar aos utilizadores mais tempo para atualizarem para "ESM ou ECMAScript Modulo" (Módulo de ECMAScript). As construções de "CJS" exigem heurísticas de exposição complexas que não estão presentes no formato de Módulo de ECMAScript.
