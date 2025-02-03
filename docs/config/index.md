---
title: Configurando a Vite
---

# Configurando a Vite {#configuring-vite}

Quando executamos a `vite` a partir da linha de comando, a Vite tentará resolver automaticamente um ficheiro de configuração chamado `vite.config.js` dentro da [raiz do projeto](/guide/#index-html-and-project-root) (outras extensões de JavaScript e TypeScript também são suportadas).

O ficheiro de configuração mais elementar parece-se com isto:

```js [vite.config.js]
export default {
  // opções de configuração
}
```

Nota que a Vite suporta o uso da sintaxe de módulos de ECMAScript no ficheiro de configuração mesmo se o projeto não estiver a usar o módulo de ECMAScript da Node nativo, por exemplo, `"type": "module"` no `package.json`. Neste caso, o ficheiro de configuração é pré-processado automaticamente antes de carregar.

Nós também podemos especificar explicitamente um ficheiro de configuração à usar com a opção da interface da linha de comando `--config` (resolvido relativamente ao `cwd`):

```bash
vite --config my-config.js
```

:::tip EMPACOTAMENTO DA CONFIGURAÇÃO
Por predefinição, a Vite usa a `esbuild` para empacotar a configuração num ficheiro temporário. Isto pode causar problemas ao importar ficheiros de TypeScript (`.ts`) em um mono-repositório. Se encontrarmos qualquer problema com esta abordagem, podemos especificar `--configLoader=runner` para usar o módulo executor — este não criará uma configuração temporária e transformará quaisquer ficheiros imediatamente. Notemos que o módulo executor não suporta CJS (CommonJS) em ficheiros de configuração, mas os pacotes de CJS externos devem funcionar como habitualmente.
:::

## Configuração do Sensor Inteligente {#config-intellisense}

Uma vez que a Vite disponibiliza-se com tipos de TypeScript, podemos influenciar o sensor inteligente do nosso ambiente de desenvolvimento integrado com sugestões de tipo da `jsdoc`:

```js
/** @type {import('vite').UserConfig} */
export default {
  // ...
}
```

Alternativamente, podemos usar a auxiliar `defineConfig` que deve fornecer sensor inteligente sem a necessidade de anotações de `jsdoc`:

```js
import { defineConfig } from 'vite'

export default defineConfig({
  // ...
})
```

A Vite também suporta diretamente os ficheiros de configuração de TypeScript. Nós também podemos usar o `vite.config.ts` com a auxiliar `defineConfig`.

## Configuração Condicional {#conditional-config}

Se a configuração precisa determinar condicionalmente as opções baseadas no comando (`serve` ou `build`), no [modo](/guide/env-and-mode) a ser usado, ou se for uma construção da interpretação do lado do servidor (`isSsrBuild`), ou é uma pré-visualização da construção (`isPreview`), esta pode exportar uma função:

```js
import { defineConfig } from 'vite'

export default defineConfig(({ command, mode, ssrBuild }) => {
  if (command === 'serve') {
    return {
      // configuração específica do desenvolvimento
    }
  } else {
    // command === 'build'
    return {
      // configuração específica da construção
    }
  }
})
```

É importante notar que na API da Vite o valor de `command` é `serve` durante o desenvolvimento (na interface da linha de comando [`vite`](/guide/cli#vite), `vite dev`, e `vite serve` são pseudónimos), e `build` quando construímos para produção ([`vite build`](/guide/cli#vite-build)).

A `isSsrBuild` e `isPreview` são opções opcionais condicionais para diferenciar os tipos de comandos `build` e `serve` respetivamente. Algumas ferramentas que carregam a configuração da Vite não suportam estas opções e passarão `undefined`. Por isto, é recomendado usar comparação explícita contra `true` e `false`.

## Configuração Assíncrona {#async-config}

Se a configuração precisar de chamar funções assíncronas, pode exportar uma função assíncrona. E esta função assíncrona também pode ser passada através da `defineConfig` para o suporte de sensor inteligente melhorado:

```js
import { defineConfig } from 'vite'

export default defineConfig(async ({ command, mode }) => {
  const data = await asyncFunction()
  return {
    // configuração de vite
  }
})
```

## Usando Variáveis de Ambiente na Configuração {#using-environment-variables-in-config}

As variáveis de ambiente podem ser obtidas a partir de `process.env` como de costume.

Nota que a Vite não carrega os ficheiros `.env` por padrão visto que os ficheiros à carregar apenas podem ser determinados depois de avaliar a configuração da Vite, por exemplo, as opções `root` e `envDir` afetam o comportamento do carregamento. No entanto, podemos usar a auxiliar `loadEnv` exportada para carregar o ficheiro `.env` especifico se necessário:

```js twoslash
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  // Carregar o ficheiro de ambiente baseado no `mode` no
  // diretório de trabalho atual.
  // Definir o terceiro parâmetro para '' para carregar todos os
  // ambientes apesar do prefixo `VITE_`
  const env = loadEnv(mode, process.cwd(), '')
  return {
    // configuração de vite
    define: {
      __APP_ENV__: JSON.stringify(env.APP_ENV),
    }
  }
})
```
