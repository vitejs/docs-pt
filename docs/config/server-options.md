# Opções do Servidor {#server-options}

## `server.host` {#server-host}

- **Tipo:** `string | boolean`
- **Predefinido como:** `'localhost'`

Especifica quais endereços de IP o servidor deveria ouvir. Defina isto como `0.0.0.0` ou `true` para ouvir todos endereços, incluindo os endereços privados e públicos.

Iso pode ser definido através da interface da linha de comando usando `--host 0.0.0.0` ou `--host`.

:::tip NOTA

Há casos onde outros servidores podem responder no lugar da Vite.

O primeiro caso é quando `localhost` é usado. A Node.js na versão 17 reordena o resultado dos endereços resolvidos pelo sistema de nomes de domínios (DNS) por padrão. Quando acessamos o `localhost`, os navegadores usam o sistema de nomes de domínios para resolver o endereço e esse endereço pode ser diferente do endereço que a Vite está ouvindo. A Vite imprime o endereço resolvido quando este é diferente.

Nós podemos definir [`dns.setDefaultResultOrder('verbatim')`](https://nodejs.org/api/dns.html#dns_dns_setdefaultresultorder_order) para desativar o comportamento de reordenação. A Vite então imprimirá o endereço como `localhost`.

```js
// vite.config.js
import { defineConfig } from 'vite'
import dns from 'dns'

dns.setDefaultResultOrder('verbatim')

export default defineConfig({
  // omitir
})
```

O segundo caso é quando são usados hospedeiros universais (por exemplo, `0.0.0.0`). Isto deve-se ao fato de os servidores que ouvem os hospedeiros que não são de carácter universal terem prioridade sobre os que ouvem em hospedeiros de carácter universal.

:::

:::tip Acessar o Servidor no Subsistema de Windows para Linux 2 a partir da Nossa Rede Local

Quando executamos a Vite no Subsistema de Windows para Linux versão 2, não é suficiente definir `host: true` para acessar o servidor a partir da nossa rede local. Consultar [o documento do Subsistema de Windows para Linux](https://learn.microsoft.com/en-us/windows/wsl/networking#accessing-a-wsl-2-distribution-from-your-local-area-network-lan) por mais detalhes.

:::

## `server.port` {#server-port}

- **Tipo:** `number`
- **Predefinido como:** `5173`

Especifica a porta do servidor. Nota que se a porta estiver já sendo utilizada, a Vite tentará automaticamente a próxima porta disponível então esta pode não ser a porta real que o servidor termina ouvindo.

## `server.strictPort` {#server-strictPort}

- **Tipo:** `boolean`

Defina para `true` para sair se a porta já estiver em uso, ao invés de tentar a próxima porta disponível automaticamente.

## `server.https` {#server-https}

- **Tipo:** `https.ServerOptions`

Ativa a TLS + HTTP/2. Nota que isto despromove para TLS apenas quando a [opção `server.proxy`](#server-proxy) também estiver sendo utilizada.

O valor também pode ser um [objeto de opções](https://nodejs.org/api/https.html#https_https_createserver_options_requestlistener) passados para `https.createServer()`.

Um certificado válido é necessário. Para uma configuração básica, podes adicionar [@vitejs/plugin-basic-ssl](https://github.com/vitejs/vite-plugin-basic-ssl) às extensões do projeto, o que automaticamente criará e cacheará um certificado auto-assinado. Mas nós recomendamos a criação do teu próprio certificado.

## `server.open` {#server-open}

- **Tipo:** `boolean | string`

Abre automaticamente a aplicação no navegador sobre o início do servidor. Quando o valor é uma sequência de caracteres, ele será utilizado como nome do caminho da URL. Se quiseres abrir o servidor em um navegador especifico que gostas, podes definir a `process.env.BROWSER` (por exemplo, `firefox`). Tu também podes definir `process.env.BROWSER_ARGS` para passar argumentos adicionais (por exemplo, `--incognito`).

`BROWSER` e `BROWSER_ARGS` também são variáveis de ambiente especiais que podes definir no ficheiro `.env` para configurá-lo. Consulte [o pacote `open`](https://github.com/sindresorhus/open#app) para mais detalhes.

**Exemplo:**

```js
export default defineConfig({
  server: {
    open: '/docs/index.html'
  }
})
```

## `server.proxy` {#server-proxy}

- **Tipo:** `Record<string, string | ProxyOptions>`

Configura regras de delegação personalizadas para o servidor de desenvolvimento. Espera um objeto de pares `{ chave: opções }`. Se a chave começar com `^`, ela será interpretada como uma `RegExp` (Expressão Regular). A opção `configure` pode ser utilizada para acessar a instância de delegação.

Estende a [`http-proxy`](https://github.com/http-party/node-http-proxy#options). As opções adicionais [estão aqui](https://github.com/vitejs/vite/blob/main/packages/vite/src/node/server/middlewares/proxy.ts#L13).

Em alguns casos, podes também querer configurar o servidor de desenvolvimento subjacente (por exemplo, para adicionar intermediários personalizados para aplicação [`connect`](https://github.com/senchalabs/connect) interna). Para fazer isto, precisas escrever a tua própria [extensão](/guide/using-plugins) e utilizar a função [configureServer](/guide/api-plugin#configureserver).

**Exemplo:**

```js
export default defineConfig({
  server: {
    proxy: {
      // abreviação de sequência de caracteres
      '/foo': 'http://localhost:4567',
      // com opções
      '/api': {
        target: 'http://jsonplaceholder.typicode.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      },
      // com RegEx (Expressões Regulares)
      '^/fallback/.*': {
        target: 'http://jsonplaceholder.typicode.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/fallback/, '')
      },
      // Utilizando a instância de delegação
      '/api': {
        target: 'http://jsonplaceholder.typicode.com',
        changeOrigin: true,
        configure: (proxy, options) => {
          // a delegação será uma instância de 'http-proxy'
        }
      },
      // Delegando websockets ou socket.io
      '/socket.io': {
        target: 'ws://localhost:5173',
        ws: true
      }
    }
  }
})
```

## `server.cors` {#server-cors}

- **Tipo:** `boolean | CorsOptions`

Configura o CORS para o servidor de desenvolvimento. Isto é ativado por padrão e permite qualquer origem. Passa um [objeto de opções](https://github.com/expressjs/cors#configuration-options) para aperfeiçoar o comportamento ou `false` para desativar.

## `server.headers` {#server-headers}

- **Tipo:** `OutgoingHttpHeaders`

Especifica os cabeçalhos da resposta do servidor.

## `server.hmr` {#server-hmr}

- **Tipo:** `boolean | { protocol?: string, host?: string, port?: number, path?: string, timeout?: number, overlay?: boolean, clientPort?: number, server?: Server }`

Desativa ou configura a conexão da HMR (nos casos onde a websocket da HMR deve utilizar um endereço diferente do servidor de http).

Defina `server.hmr.overlay` para `false` para desativar o cobertura de erro do servidor.

A `protocol` define o protocolo de tomada da Web usado para a conexão da substituição de módulo instantânea: `ws` (tomada da Web) ou `wss` (tomada da Web segura).

A `clientPort` é uma opção avançada que sobrepõe a porta apenas no lado do cliente, permitindo-te servir o websocket sobre uma porta diferente da que o código do cliente procura.

Quando `server.hmr.server` é definida, a Vite processará as requisições da conexão da HMR através do servidor fornecido. Se não for no modo intermediário, a Vite tentará processar as requisições da conexão da HMR através do servidor existente. Isto pode ser útil quando estiveres utilizando certificados auto-assinados ou quando quiseres expor a Vite sobre uma rede em uma única porta.

Consulte [`vite-setup-catalogue`](https://github.com/sapphi-red/vite-setup-catalogue) para alguns exemplos.

:::tip NOTA

Com a configuração padrão, as delegações reversas na frente da Vite são esperadas para suportarem a delegação de WebSocket. Se o cliente da HMR da Vite falhar ao conectar o WebSocket, o cliente recuará para conectar a WebSocket diretamente ao servidor da HMR da Vite contornando as delegações reversas:

```
Direct websocket connection fallback. Check out https://vitejs.dev/config/server-options.html#server-hmr to remove the previous connection error.
```

O erro que aparece no Navegador quando o retrocesso acontece pode ser ignorado. Para evitar o erro ao diretamente contornar as delegações reversas, poderias tanto:


- configurar a delegação reversa para delegar também a WebSocket
- definir [`server.strictPort = true`](#server-strictport) e definir `server.hmr.clientPort` para o mesmo valor com `server.port`
- definir `server.hmr.port` para um valor diferente de [`server.port`](#server-port)

:::

## `server.warmup` {#server-warmup}

- **Tipo:** `{ clientFiles?: string[], ssrFiles?: string[] }`

Aquece os ficheiros para transformar e armazenar para consulta imediata os resultados antecipadamente. Isto melhora o carregamento inicial da página durante a inicialização do servidor e evitar as cascatas de transformação.

Os `clientFiles` são ficheiros que são usados apenas no cliente, enquanto os `ssrFiles` são ficheiros que são usados apenas na interpretação do lado do servidor. Eles aceitam um vetor de caminhos de ficheiros ou padrões de [`fast-glob`](https://github.com/mrmlnc/fast-glob) relativos à `root`.

Nós devemos certificar-nos de apenas adicionar os ficheiros que são frequentemente usados para não sobrecarregar o servidor de desenvolvimento da Vite durante a inicialização.

```js
export default defineConfig({
  server: {
    warmup: {
      clientFiles: [ './src/components/*.vue', './src/utils/big-file.js'],
      ssrFiles: ['./src/server/modules/*.js'],
    },
  },
})
```

## `server.watch` {#server-watch}

- **Tipo:** `object | null`

Opções do observador do sistema de ficheiro para passar ao [`chokidar`](https://github.com/paulmillr/chokidar#api).

O observador do servidor da Vite observa o `root` e ignora os diretórios `.git/`, `node_modules/`, e os diretórios `cacheDir` e `build.outDir` da Vite por padrão. Quando atualizamos um ficheiro observado, a Vite aplicará substituição de módulo instantânea e atualizar a página apenas se necessário.

Se definida para `null`, nenhum ficheiro será observado. `server.watcher` fornecerá um emissor de evento compatível, mas chamar `add` ou `unwatch` não terá nenhum efeito.

:::warning Observando os Ficheiros no `node_modules`

Atualmente não é possível observar ficheiros e pacotes no `node_modules`. Para mais progressos e soluções alternativas, podemos seguir a [questão #8619](https://github.com/vitejs/vite/issues/8619).

:::

:::warning Utilizando a Vite sobre o Subsistema de Windows para Linux 2

Quando estiveres executando a Vite sobre o WSL2, a observação do sistema de ficheiro não funciona quando um ficheiro é editado pelas aplicações do Windows (sem processo WSL2). Isto é devido a [uma limitação do WSL2](https://github.com/microsoft/WSL/issues/4739). Isto também se aplica à execução sobre Docker com um backend de WSL2.

Para corrigir isto, poderias tanto:

- **Recomendado**: Utilizar aplicações de WSL2 para editar os teus ficheiros.
  - Também é recomendado mover a pasta do projeto para fora de um sistema de ficheiro do Windows. A remoção deste custo geral melhorará o desempenho.
- Definir `{ usePolling: true }`.
  - Nota que [`usePolling` leva para alta utilização da CPU](https://github.com/paulmillr/chokidar#performance).

:::

## `server.middlewareMode` {#server-middlewaremode}

- **Tipo:** `boolean`
- **Predefinido como:** `false`

Cria um servidor de Vite no modo intermediário.

- **Relacionado ao:** [`appType`](./shared-options#apptype), [Interpretação do Lado do Servidor - Configurando o Servidor de Desenvolvimento](/guide/ssr#setting-up-the-dev-server)

- **Exemplo:**

```js
import express from 'express'
import { createServer as createViteServer } from 'vite'

async function createServer() {
  const app = express()

  // Cria um servidor de Vite no modo intermediário.
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'custom' // não inclui os intermediários de manipulação de HTML padrão da Vite
  })
  // Utiliza instância de conexão da Vite como intermediário
  app.use(vite.middlewares)

  app.use('*', async (req, res) => {
    // Já que `appType` é `'custom'`, deve servir a resposta aqui.
    // Nota: se `appType` for `'spa'` ou `'mpa'`, a Vite inclui os intermediários para manipular as
    // requisições de HTML e 404s assim os intermediários do utilizador
    // devem ser adicionados antes dos intermediários da Vite para ter efeito
  })
}

createServer()
```

## `server.fs.strict` {#server-fs-strict}

- **Tipo:** `boolean`
- **Predefinido como:** `true` (ativado por padrão desde a Vite 2.7)

Restringe o serviço de ficheiros fora da raiz do espaço de trabalho.

## `server.fs.allow` {#server-fs-allow}

- **Tipo:** `string[]`

Restringe os ficheiros que poderiam ser servidos através de `/@fs/`. Quando `server.fs.strict` é definido para `true`, o acesso dos ficheiros fora desta lista de diretório que não são importados de um ficheiro permitido resultará em um 403.

Tanto os diretórios e ficheiros podem ser fornecidos.

A Vite procurará pela raiz do potencial espaço de trabalho e o utilizará como padrão. Um espaço de trabalho válido atende as seguintes condições, caso contrário retrocederá para a [raiz do projeto](/guide/#index-html-and-project-root):

- contém o campo `workspaces` no `package.json`
- contém um dos seguintes ficheiro
  - `lerna.json`
  - `pnpm-workspace.yaml`

Aceita um caminho para especificar a raiz do espaço de trabalho personalizado. Poderia ser um caminho absoluto ou um caminho relativo para [raiz do projeto](/guide/#index-html-and-project-root). Por exemplo:

```js
export default defineConfig({
  server: {
    fs: {
      // Permite o serviço de ficheiros de um nível de cima para a raiz do projeto
      allow: ['..']
    }
  }
})
```

Quando `server.fs.allow` for especificado, o deteção automática da raiz do espaço de trabalho será desativada. Para estender o comportamento original, uma utilitário `searchForWorkspaceRoot` é exposto:

```js
import { defineConfig, searchForWorkspaceRoot } from 'vite'

export default defineConfig({
  server: {
    fs: {
      allow: [
        // procure pela raiz do espaço de trabalho
        searchForWorkspaceRoot(process.cwd()),
        // as tuas regras personalizadas
        '/path/to/custom/allow_directory',
        '/path/to/custom/allow_file.demo',
      ]
    }
  }
})
```

## `server.fs.deny` {#server-fs-deny}

- **Tipo:** `string[]`
- **Predefinido como:** `['.env', '.env.*', '*.{crt,pem}']`

Lista de bloqueio para ficheiros sensíveis sendo restringidos de serem servidos pelo servidor de desenvolvimento da Vite. Isto terá uma prioridade superior a [`server.fs.allow`](#server-fs-allow). [Os padrões `picomatch`](https://github.com/micromatch/picomatch#globbing-features) são suportados.

## `server.origin` {#server-origin}

- **Tipo:** `string`

Define a origem das URLs do recurso gerado durante o desenvolvimento.

```js
export default defineConfig({
  server: {
    origin: 'http://127.0.0.1:8080'
  }
})
```

## `server.sourcemapIgnoreList` {#server-sourcemapignorelist}

* **Tipo**: `false | (sourcePath: string, sourcemapPath: string) => boolean`
* **Predefinido como**: `(sourcePath) => sourcePath.includes('nodes_modules')`

Se deve ou não ignorar ficheiros de código-fonte no mapa do código-fonte do servidor, usado para povoar a [extensão `x_google_ignoreList` do mapa do código-fonte](https://developer.chrome.com/articles/x-google-ignore-list/).

A `server.sourcemapIgnoreList` é o equivalente de [`build.rollupOptions.output.sourcemapIgnoreList`](https://rollupjs.org/configuration-options/#output-sourcemapignorelist) para o servidor de desenvolvimento. Uma diferença entre as duas opções de configuração é que a função de Rollup é chamada com um caminho relativo para `sourcePath` enquanto `server.sourcemapIgnoreList` é chamada com um caminho absoluto. Durante o desenvolvimento, a maioria dos módulos têm o mapa e o código-fonte no mesmo diretório, assim o caminho relativo para `sourcePath` é o próprio nome do ficheiro. Nestes casos, os caminhos absolutos tornam-o conveniente o seu uso.

Por padrão, ela exclui todos os caminhos contendo `node_modules`. Tu podes passar `false` para desligar este comportamento, ou, para controlar completamente, uma função que recebe o caminho do código-fonte e o caminho do mapa do código-fonte e que retorna se deve ignorar o caminho do código-fonte:

```js
export default defineConfig({
  server: {
    // Isto é o valor padrão, e adicionará todos os ficheiros com
    // `node_modules` nos seus caminhos para lista de ignorância.
    sourcemapIgnoreList(sourcePath, sourcemapPath) {
      return sourcePath.includes('node_modules')
    },
  },
})
```

:::tip Nota
[`server.sourcemapIgnoreList`](#server-sourcemapignorelist) e [`build.rollupOptions.output.sourcemapIgnoreList`](https://rollupjs.org/configuration-options/#output-sourcemapignorelist) precisam ser definidas de maneira independente. `server.sourcemapIgnoreList` é uma configuração exclusiva do servidor e não recebe o seu valor padrão das opções definidas da rollup.
:::
