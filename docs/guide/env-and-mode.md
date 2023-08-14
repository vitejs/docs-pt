# Variáveis de Ambiente e Modos {#env-variables-and-modes}

## Variáveis de Ambiente {#env-variables}

A Vite expõe variáveis de ambiente sobre o objeto especial **`import.meta.env`**. Algumas variáveis embutidas estão disponíveis em todos os casos:

- **`import.meta.env.MODE`**: {sequência de caracteres} o [modo](#modo) em que a aplicação está executando.

- **`import.meta.env.BASE_URL`**: {sequência de caracteres} a url de base a partir da qual a aplicação está sendo servida. Isto é determinado pela [opção de configuração `base`](/config/shared-options#base).

- **`import.meta.env.PROD`**: {booleano} se a aplicação estiver executando em produção.

- **`import.meta.env.DEV`**: {booleano} se a aplicação estiver executando em desenvolvimento (sempre o oposto de `import.meta.env.PROD`)

- **`import.meta.env.SSR`**: {booleano} se a aplicação estiver executando no [servidor](./ssr.md#lógica-condicional).

### Substituição de Produção {#production-replacement}

Durante a produção, estas variáveis de ambiente são **substituídas estaticamente**. É portanto necessário sempre fazer referência a elas utilizando a sequência de caracteres estático completa. Por exemplo, chave de acesso dinâmico como `import.meta.env[key]` não funcionarão.

Isto também substituirá estas sequências de caracteres que aparecem nas sequências de caracteres de JavaScript e das do modelos de marcação de Vue. Isto deve ser um caso raro, mas pode ser não intencional. Tu podes ver erros como `Missing Semicolon` ou neste caso `Unexpected token`, por exemplo quando `"process.env.`<wbr>`NODE_ENV"` é transformada para `""development": "`. Existem maneiras de solucionar este comportamento:

- Para as sequências de caracteres de JavaScript, podes dividir a sequência de caracteres com um espaço de Unicode de largura zero, por exemplo `'import.meta\u200b.env.MODE'`.

- Para os modelos de marcação de Vue ou outro HTML que é compilado para sequências de caracteres de JavaScript, podes utilizar o [marcador `<wbr>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/wbr), por exemplo `import.meta.<wbr>env.MODE`.

## Os Ficheiros `.env` {#env-files}

A Vite utiliza o pacote [dotenv](https://github.com/motdotla/dotenv) para carregar variáveis de ambiente adicionais a partir dos seguintes ficheiros no teu [diretório de ambiente](/config/shared-options.md#envdir):

```
.env                # carregado em todos casos
.env.local          # carregado em todos casos, mas ignorado pelo git
.env.[mode]         # carregado apenas em um modo especificado
.env.[mode].local   # carregado apenas em um modo especificado, mas ignorado pelo git
```

:::tip Prioridades de Carregamento de Ambiente

Um ficheiro de ambiente para um modo especifico (por exemplo, `.env.production`) receberá prioridade mais elevada do que um modo genérico (por exemplo, `.env`)

Além disto, as variáveis de ambiente que já existirem quando a Vite for executada tem a prioridade mais alta e não serão sobrescritas pelos ficheiros `.env`. Por exemplo, quando estiveres executando `VITE_SOME_KEY=123 vite build`.

Os ficheiros `.env` são carregados no início da Vite. Reinicie o servidor depois de fazer mudanças.
:::

As variáveis de ambiente carregadas também são expostas para o teu código-fonte do cliente através de `import.meta.env` como sequências de caracteres.

Para previr a fuga acidental das variáveis de ambiente para o cliente, só as variáveis prefixadas com `VITE_` são expostas para o teu código processado pela Vite. Por exemplo para as seguintes variáveis de ambiente:

```
VITE_SOME_KEY=123
DB_PASSWORD=foobar
```

Só `VITE_SOME_KEY` será exposta como `import.meta.env.VITE_SOME_KEY` para o teu código-fonte do cliente, porém `DB_PASSWORD` não será exposta.

```js
console.log(import.meta.env.VITE_SOME_KEY) // 123
console.log(import.meta.env.DB_PASSWORD) // undefined
```

Se quiseres personalizar o prefixo das variáveis de ambiente consulte a opção [`envPrefix`](/config/shared-options#envprefix).

:::warning NOTAS DE SEGURANÇA

- Os ficheiros `.env.*.local` são apenas para o local e podem conter variáveis sensíveis. Tu deves adicionar `*.local` no teu `.gitignore` para evitar que eles sejam verificados pelo git.

- Já que quaisquer variáveis exposta para o teu código-fonte de Vite terminará no teu pacote de cliente, as variáveis `VITE_*` _não_ devem conter quaisquer informações sensíveis.
:::

### Sensor Inteligente para TypeScript {#intellisense-for-typescript}

Por padrão, a Vite fornece definições de tipo para `import.meta.env` no [`vite/client.d.ts`](https://github.com/vitejs/vite/blob/main/packages/vite/client.d.ts). Embora podes definir mais variáveis de ambiente personalizadas nos ficheiros `.env.[mode]`, podes querer receber o Sensor Inteligente de TypeScript para as variáveis de ambiente definidas para o utilizador que são prefixadas com `VITE_`.

Para alcançar isto, podes criar um ficheiro `env.d.ts` no diretório `src`, e então aumentar o `ImportMetaEnv` desta maneira:

```typescript
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  // mais variáveis de ambiente...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
```

Se o teu código depender dos tipos dos ambientes do navegador tais como [DOM](https://github.com/microsoft/TypeScript/blob/main/lib/lib.dom.d.ts) e [WebWorker](https://github.com/microsoft/TypeScript/blob/main/lib/lib.webworker.d.ts), podes atualizar o campo [lib](https://www.typescriptlang.org/tsconfig#lib) no `tsconfig.json`.

```json
{
  "lib": ["WebWorker"]
}
```

## Substituição de Variáveis de Ambiente no HTML {#html-env-replacement}

A Vite suporta também a substituição de variáveis de ambiente em ficheiro de HTML. Quaisquer propriedades na `import.meta.env` pode ser usada nos ficheiros de HTML com uma sintaxe `%ENV_NAME%` especial:

```html
<h1>Vite is running in %MODE%</h1>
<p>Using data from %VITE_API_URL%</p>
```

Se a variável de ambiente não existir em `import.meta.env`, por exemplo `%NON_EXISTENT%`, será ignorado e não substituído, diferente de `import.meta.env.NON_EXISTENT` na JavaScript onde seria substituída por `undefined`.

## Modos {#modes}

Por padrão, o servidor de desenvolvimento (comando `dev`) executa no modo de `development (desenvolvimento)` e o comando `build` executa no modo de `production (produção)`.

Isto significa que quando estiveres executando `vite build`, ela carregará as variáveis de ambiente a partir de `.env.production` se houver uma:

```
# .env.production
VITE_APP_TITLE=My App
```

Na tua aplicação, podes interpretar o título utilizando `import.meta.env.VITE_APP_TITLE`.

No entanto, é importante entender que o **modo** é um conceito abrange muito mais do que desenvolvimento versus produção. Um exemplo comum é poderes desejar ter um modo de "staging (encenação)" onde deveria haver um comportamento parecido com o de produção, mas com ligeira diferença de variáveis de ambiente de produção.

Tu podes sobrescrever o modo padrão utilizado por um comando passando a bandeira de opção `--mode`. Por exemplo, se quiseres construir a tua aplicação para o modo de encenação hipotético:

```bash
vite build --mode staging
```

E para atingir o comportamento que queremos, precisamos de um ficheiro `.env.staging`:

```
# .env.staging
NODE_ENV=production
VITE_APP_TITLE=My App (staging)
```

Agora a tua aplicação de encenação deve ter o comportamento parecido com o de produção, porém exibir um título diferente do de produção.
