---
title: Configurando a Vite
---

# Configurando a Vite {#configuring-vite}

Quando estiveres executando a `vite` a partir da linha de comando, a Vite tentará automaticamente resolver um ficheiro de configuração nomeado como `vite.config.js` dentro da [raiz do projeto](/guide/#index-html-e-a-raiz-do-projeto).

O ficheiro de configuração mais básico se parece com isto:

```js
// vite.config.js
export default {
  // opções de configuração
}
```

Nota que a Vite suporta a utilização da sintaxe de módulos de ECMAScript no ficheiro de configuração mesmo se o projeto não estiver utilizando o Módulo de ECMAScript de Node nativo, por exemplo, `type: "module"` no `package.json`. Neste caso, o ficheiro de configuração é pré-processado automaticamente antes do carregamento.

Tu também podes explicitamente especificar um ficheiro de configuração para utilizar com a opção de interface de linha de comando `--config` (resolvido relativamente ao `cwd`):

```bash
vite --config my-config.js
```

## Configurar o Sensor Inteligente {#config-intellisense}

Visto que a Vite disponibiliza tipagens de TypeScript, podes influenciar o sensor inteligente da tua IDE com as sugestões de tipo da `jsdoc`:

```js
/** @type {import('vite').UserConfig} */
export default {
  // ...
}
```

Alternativamente, podes utilizar o auxiliar `defineConfig` o qual deveria fornecer um sensor inteligente sem a necessidade de anotações de `jsdoc`:

```js
import { defineConfig } from 'vite'

export default defineConfig({
  // ...
})
```

A Vite também suporta de maneira direta os ficheiros de configuração de TypeScript. Tu também podes utilizar `vite.config.ts` com o auxiliar `defineConfig`.

## Configuração Condicional {#conditional-config}

Se a configuração precisar determinar condicionalmente opções baseada no comando (`dev`, `serve` ou `build`), no [modo](/guide/env-and-mode) sendo utilizado, ou se for uma construção de SSR (`ssrBuild`), ela pode de preferência exportar uma função:

```js
export default defineConfig(({ command, mode, ssrBuild }) => {
  if (command === 'serve') {
    return {
      // configuração especifica de desenvolvimento ('dev')
    }
  } else {
    // command === 'build'
    return {
      // configuração especifica de construção ('build')
    }
  }
})
```

É importante notar que na API da Vite o valor de `command` é `serve` durante o desenvolvimento (na interface de linha de comando `vite`, `vite dev`, e `vite serve` são pseudónimos), e `build` quando estiveres construindo para produção (`vite build`).

A `ssrBuild` é experimental. Ela só está disponível durante a construção ao invés de uma bandeira `ssr` mais geral porque, durante o desenvolvimento, a configuração é partilhada pelo único servidor manipulando as requisições SSR e as que não são SSR. O valor poderia ser `undefined` para as ferramentas que não têm comandos separados para a construção de navegador e SSR, assim utiliza comparação explicita contra `true` e `false`.

## Configuração Assíncrona {#async-config}

Se a configuração precisar chamar funções assíncronas, pode de preferência exportar uma função assíncrona. E esta função assíncrona também pode ser passada através de `defineConfig` para suporte de sensor inteligente melhorado:

```js
export default defineConfig(async ({ command, mode }) => {
  const data = await asyncFunction()
  return {
    // configuração de vite
  }
})
```

## Usando Variáveis de Ambiente na Configuração {#using-environment-variables-in-config}

As variáveis de ambiente podem ser obtidas a partir de `process.env` como de costume.

Nota que a Vite não carrega os ficheiros `.env` por padrão visto que o carregamento dos ficheiros só pode ser determinado depois da avaliação da configuração de Vite, por exemplo, as opções `root` e `envDir` afetam o comportamento de carregamento. No entanto, podes utilizar o auxiliar `loadEnv` exportado para carregar o ficheiro `.env` especifico se necessário.

```js
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ command, mode }) => {
  /*
    Carrega o ficheiro de variáveis de ambiente ("env")
    com base no modo (`mode`) no diretório de trabalho atual.
  */
  /*
    Define o terceiro parâmetro para ('')
    para carregar todas as variáveis de ambiente ("env")
    independentemente do prefixo `VITE_`.
  */
  const env = loadEnv(mode, process.cwd(), '')
  return {
    // configurações de vite
    define: {
      __APP_ENV__: JSON.stringify(env.APP_ENV),
    }
  }
})
```
