# Variáveis e Modos de Ambiente {#env-variables-and-modes}

## Variáveis de Ambiente {#env-variables}

A Vite expõe as variáveis de ambiente sobre o objeto especial **`import.meta.env`**, as quais são substituídas estaticamente em tempo de construção. Algumas variáveis embutidas estão disponíveis em todos os casos:

- **`import.meta.env.MODE`**: `{string}` o [modo](#modes) no qual a aplicação executa.

- **`import.meta.env.BASE_URL`**: `{string}` a URL de base a partir da qual a aplicação é servida. Isto é determinado pela [opção de configuração `base`](/config/shared-options#base).

- **`import.meta.env.PROD`**: `{boolean}` se a aplicação executa em produção (executa o servidor de desenvolvimento com `NODE_ENV='production'` ou executa uma aplicação construída com `NODE_ENV='production'`).

- **`import.meta.env.DEV`**: `{boolean}` se a aplicação executa em desenvolvimento (sempre o oposto de `import.meta.env.PROD`)

- **`import.meta.env.SSR`**: `{boolean}` se a aplicação executa no [servidor](./ssr#conditional-logic).

## Os Ficheiros `.env` {#env-files}

A Vite usa o pacote [`dotenv`](https://github.com/motdotla/dotenv) para carregar as variáveis de ambiente adicionais a partir dos seguintes ficheiros no [diretório do nosso ambiente](/config/shared-options#envdir):

```
.env                # carregado em todos os casos
.env.local          # carregado em todos os casos, mas ignorado pelo git
.env.[mode]         # carregado apenas no modo especificado
.env.[mode].local   # carregado apenas no modo especificado, mas ignorado pelo git
```

:::tip PRIORIDADES DE CARREGAMENTO DO AMBIENTE

Um ficheiro de ambiente para um modo específico (por exemplo, `.env.production`) receberá prioridade superior à um genérico (por exemplo, `.env`).

Além disto, as variáveis de ambiente que já existiam quando a Vite for executada têm a prioridade muito superior e não serão sobrescritas pelos ficheiros `.env`. Por exemplo, quando executamos `VITE_SOME_KEY=123 vite build`.

Os ficheiros `.env` são carregados durante a inicialização da Vite. Reinicia o servidor depois de fazermos mudanças.
:::

As variáveis de ambiente carregadas também são expostas ao nosso código-fonte do nosso cliente através de `import.meta.env` como sequências de caracteres.

Para evitar que acidentalmente vazemos as variáveis de ambiente para o cliente, apenas as variáveis prefixadas com `VITE_` são expostas ao nosso código processado pela Vite. Por exemplo, para as seguintes variáveis de ambiente:

```[.env]
VITE_SOME_KEY=123
DB_PASSWORD=foobar
```

Apenas `VITE_SOME_KEY` será exposta como `import.meta.env.VITE_SOME_KEY` ao código-fonte do nosso cliente, mas `DB_PASSWORD` não será exposta:

```js
console.log(import.meta.env.VITE_SOME_KEY) // "123"
console.log(import.meta.env.DB_PASSWORD) // undefined
```

:::tip ANALISE SINTÁTICA DA VARIÁVEL DE AMBIENTE

Conforme mostrado acima, `VITE_SOME_KEY` é um número mas retorna uma sequência de caracteres quando analisada sintaticamente. O mesmo também aconteceria para as variáveis de ambiente booleanas. Temos que certificar-nos de converter ao tipo desejado quando a usa-mos no nosso código.
:::

Além disto, a Vite usa [`dotenv-expand`](https://github.com/motdotla/dotenv-expand) para expandir as variáveis fora da caixa. Para saber mais sobre a sintaxe, consulte a [sua documentação](https://github.com/motdotla/dotenv-expand#what-rules-does-the-expansion-engine-follow).

Nota que se quisermos usar `$` dentro do valor da nossa variável, temos de escapa-lo com `\`:

```[.env]
KEY=123
NEW_KEY1=test$foo   # test
NEW_KEY2=test\$foo  # test$foo
NEW_KEY3=test$KEY   # test123
```

Se quisermos personalizar o prefixo das variáveis de ambiente, temos que consultar a opção [`envPrefix`](/config/shared-options#envprefix).

:::warning NOTAS DE SEGURANÇA

- Os ficheiros `.env.*.local` estão restritos ao local e podem conter variáveis sensíveis. Nós devemos adicionar `*.local` no nosso `.gitignore` para evitar que sejam verificados pela Git.

- Uma vez que quaisquer variáveis expostas ao nosso código-fonte de Vite terminarão no pacote do nosso cliente, as variáveis `VITE_*` _não_ devem conter quaisquer informação sensíveis.
:::

### Sensor Inteligente para TypeScript {#intellisense-for-typescript}

Por padrão, a Vite fornece definições de tipo para `import.meta.env` no [`vite/client.d.ts`](https://github.com/vitejs/vite/blob/main/packages/vite/client.d.ts). Embora possamos definir mais variáveis de ambiente personalizadas nos ficheiros `.env.[mode]`, talvez queiramos receber o Sensor Inteligente de TypeScript para as variáveis de ambiente definidas pelo utilizador que são prefixadas com `VITE_`.

Para alcançar isto, podemos criar um ficheiro `vite-env.d.ts` no diretório `src`, depois aumentar a `ImportMetaEnv` da seguinte maneira:

```typescript [vite-env.d.ts]
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  // mais variáveis de ambiente...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
```

Se o nosso código depender dos tipos dos ambientes do navegador tais como [`DOM`](https://github.com/microsoft/TypeScript/blob/main/src/lib/dom.generated.d.ts) e [`WebWorker`](https://github.com/microsoft/TypeScript/blob/main/src/lib/webworker.generated.d.ts), podemos atualizar o campo [`lib`](https://www.typescriptlang.org/tsconfig#lib) no `tsconfig.json`:

```json [tsconfig.json]
{
  "lib": ["WebWorker"]
}
```

:::warning IMPORTAÇÕES QUEBRARÃO O AUMENTO DE TIPO

Se o aumento da `ImportMetaEnv` não funcionar, temos que certificar-nos de que não temos quaisquer declaração `import` no `vite-env.d.ts`. Consultar a [documentação da TypeScript](https://www.typescriptlang.org/docs/handbook/2/modules.html#how-javascript-modules-are-defined) por mais informação.
:::

## Substituição de Variável de Ambiente de HTML {#html-env-replacement}

A Vite também suporta a substituição de variáveis de ambiente nos ficheiros de HTML. Quaisquer propriedades no `import.meta.env` pode ser usada nos ficheiros de HTML com a sintaxe especial `%ENV_NAME%`:

```html
<h1>Vite is running in %MODE%</h1>
<p>Using data from %VITE_API_URL%</p>
```

Se o ambiente não existir no `import.meta.env`, por exemplo, `%NON_EXISTENT%`, este será ignorado e não substituído, diferente de `import.meta.env.NON_EXISTENT` na JavaScript onde é substituída por `undefined`.

Partindo do principio de que a Vite é usada por muitas abstrações, intencionalmente não é opinativa sobre substituições complexas como as condicionais. A Vite pode ser estendida usando [uma extensão do terreno do utilizador existente](https://github.com/vitejs/awesome-vite#transformers) ou uma extensão personalizada que implementa o [gatilho `transformIndexHtml`](./api-plugin#transformindexhtml).

## Modos {#modes}

Por padrão, o servidor de desenvolvimento (comando `dev`) executa dentro do modo de `development` (_desenvolvimento_ em Português) e o comando `build` executa dentro do modo de `production` (_produção_ em Português).

Isto significa que quando executamos `vite build`, esta carregará as variáveis de ambiente a partir do `.env.production` se existir um:

```
# .env.production
VITE_APP_TITLE=My App
```

Na nossa aplicação, podemos desenhar o título usando `import.meta.env.VITE_APP_TITLE`.

Em alguns casos, talvez queiramos executar `vite build` com um modo diferente para desenhar um título diferente. Nós podemos sobrescrever o modo padrão usado por um comando passando a opção `--mode`. Por exemplo, se quisermos construir a nossa aplicação para um modo de encenação:

```sh
vite build --mode staging
```

E críamos um ficheiro `.env.staging`:

```
# .env.staging
VITE_APP_TITLE=My App (staging)
```

Como o `vite build` executa uma construção de produção por padrão, também podemos mudar isto e executar um ambiente de desenvolvimento usando um modo e configuração de ficheiro `.env` diferente:

```
# .env.testing
NODE_ENV=development
```

## `NODE_ENV` e Modos {#node-env-and-modes}

É importante notar que a `NODE_ENV` (`process.env.NODE_ENV`) e os modos são dois conceitos diferentes. Eis como os diferentes comandos afetam a `NODE_ENV` e modo:

| Comando                                              | `NODE_ENV`        | Modo            |
| ---------------------------------------------------- | --------------- | --------------- |
| `vite build`                                         | `"production"`  | `"production"`  |
| `vite build --mode development`                      | `"production"`  | `"development"` |
| `NODE_ENV=development vite build`                    | `"development"` | `"production"`  |
| `NODE_ENV=development vite build --mode development` | `"development"` | `"development"` |

Os diferentes valores da `NODE_ENV` e do modo também se refletem sobre as suas propriedades de `import.meta.env` correspondentes:

| Comando                | `import.meta.env.PROD` | `import.meta.env.DEV` |
| ---------------------- | ---------------------- | --------------------- |
| `NODE_ENV=production`  | `true`                 | `false`               |
| `NODE_ENV=development` | `false`                | `true`                |
| `NODE_ENV=other`       | `false`                | `true`                |
| Command              | `import.meta.env.MODE` |
| -------------------- | ---------------------- |
| `--mode production`  | `"production"`         |
| `--mode development` | `"development"`        |
| `--mode staging`     | `"staging"`            |

:::tip `NODE_ENV` nos ficheiros `.env`
`NODE_ENV=...` pode ser definida no comando, e também no nosso ficheiro `.env`. Se a `NODE_ENV` for especificada num ficheiro `.env.[mode]`, o modo pode ser usado para controlar o seu valor. No entanto, tanto a `NODE_ENV` como os modos permanecem como dois conceitos diferentes.

O principal benefício da `NODE_ENV=...` no comando é que ela permite que a Vite detete o valor antecipadamente. Isto também permite-nos ler a `process.env.NODE_ENV` na nossa configuração da Vite, já que Vite só pode carregar os ficheiros de variáveis de ambiente quando a configuração for avaliada.
:::
