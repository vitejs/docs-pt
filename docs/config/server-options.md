# Opções do Servidor {#server-options}

## server.host {#server-host}

- **Tipo:** `string | boolean`
- **Predefinido como:** `'localhost'`

Especifica quais endereços de IP o servidor deveria ouvir.
Defina isto para `0.0.0.0` ou `true` para ouvir todos endereços, incluindo os endereços privados e públicos.

Iso pode definido através da Linha de Comando utilizando `--host 0.0.0.0` ou `--host`.

:::tip NOTA

Existem casos onde outros servidores podem responder no lugar da Vite.

O primeiro caso é quando `localhost` é usado. A Node.js abaixo da v17 reorganiza o resultado dos endereços de DNS resolvidos por padrão. Quando estiveres acessando o `localhost`, os navegadores utilizam o DNS para resolver o endereço e aquele endereço pode diferir do endereço que a Vita está ouvindo. A Vite imprime o endereço resolvido quando ele difere.

Tu podes definir o [`dns.setDefaultResultOrder('verbatim')`](https://nodejs.org/api/dns.html#dns_dns_setdefaultresultorder_order) para desativar o comportamento de reorganização. A Vite imprimirá então o endereço como `localhost`.

```js
// vite.config.js
import { defineConfig } from 'vite'
import dns from 'dns'

dns.setDefaultResultOrder('verbatim')

export default defineConfig({
  // omitir
})
```

O segundo caso é quando os hospedeiros do cartão selvagem (ou "wildcard") (por exemplo, `0.0.0.0`) são utilizados. Isto é porque os servidores ouvindo hospedeiros sem cartão selvagem ficam com a prioridade sobre aqueles ouvindo hospedeiros com cartão selvagem.

:::

## server.port {#server-port}

- **Tipo:** `number`
- **Predefinido como:** `5173`

Especifica a porta do servidor. Nota que se a porta estiver já sendo utilizada, a Vite tentará automaticamente a próxima porta disponível então esta pode não ser a porta real que o servidor termina ouvindo.

## server.strictPort {#server-strictPort}

- **Tipo:** `boolean`

Defina para `true` para sair se a porta já estiver em uso, ao invés de tentar a próxima porta disponível automaticamente.

## server.https {#server-https}

- **Tipo:** `boolean | https.ServerOptions`

Ativa a TLS + HTTP/2. Nota que isto despromove para TLS apenas quando a [opção `server.proxy`](#server-proxy) também estiver sendo utilizada.

O valor também pode ser um [objeto de opções](https://nodejs.org/api/https.html#https_https_createserver_options_requestlistener) passados para `https.createServer()`.

Um certificado válido é necessário. Para uma configuração básica, podes adicionar [@vitejs/plugin-basic-ssl](https://github.com/vitejs/vite-plugin-basic-ssl) às extensões do projeto, o que automaticamente criará e cacheará um certificado auto-assinado. Mas nós recomendamos a criação do teu próprio certificado.

## server.open {#server-open}

- **Tipo:** `boolean | string`

Abre automaticamente a aplicação no navegador sobre o início do servidor. Quando o valor é uma sequência de caracteres, ele será utilizado como nome do caminho da URL. Se quiseres abrir o servidor em um navegador especifico que gostas, podes definir a `process.env.BROWSER` (por exemplo, `firefox`). Consulte [o pacote `open`](https://github.com/sindresorhus/open#app) para mais detalhes.

**Exemplo:**

```js
export default defineConfig({
  server: {
    open: '/docs/index.html'
  }
})
```

## server.proxy {#server-proxy}

- **Tipo:** `Record<string, string | ProxyOptions>`

Configura regras de delegação personalizadas para o servidor de desenvolvimento. Espera um objeto de pares `{ chave: opções }`. Se a chave começar com `^`, ela será interpretada como uma `RegExp` (Expressão Regular). A opção `configure` pode ser utilizada para acessar a instância de delegação.

Utiliza o [`http-proxy`](https://github.com/http-party/node-http-proxy). Opções completas [aqui](https://github.com/http-party/node-http-proxy#options).

Em alguns casos, podes também querer configurar o servidor de desenvolvimento subjacente (por exemplo, para adicionar intermediários personalizados para aplicação [connect](https://github.com/senchalabs/connect) interna). Para fazer isto, precisas escrever a tua própria [extensão](/guide/using-plugins.html) e utilizar a função [configureServer](/guide/api-plugin.html#configureserver).

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

## server.cors {#server-cors}

- **Tipo:** `boolean | CorsOptions`

Configura o CORS para o servidor de desenvolvimento. Isto é ativado por padrão e permite qualquer origem. Passa um [objeto de opções](https://github.com/expressjs/cors) para aperfeiçoar o comportamento ou `false` para desativar.

## server.headers {#server-headers}

- **Tipo:** `OutgoingHttpHeaders`

Especifica os cabeçalhos da resposta do servidor.

## server.hmr {#server-hmr}

- **Tipo:** `boolean | { protocol?: string, host?: string, port?: number, path?: string, timeout?: number, overlay?: boolean, clientPort?: number, server?: Server }`

Desativa ou configura a conexão da HMR (nos casos onde a websocket da HMR deve utilizar um endereço diferente do servidor de http).

Defina `server.hmr.overlay` para `false` para desativar o cobertura de erro do servidor.

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

## server.watch {#server-watch}

- **Tipo:** `object`

Opções do observador do sistema de ficheiro para passar para o [chokidar](https://github.com/paulmillr/chokidar#api).

O observador do servidor da Vite ignora os diretórios `.git/` e `node_modules/` por padrão. Se quiseres observar o pacote dentro de `node_modules/`, podes passar um padrão de "glob" negado para `server.watch.ignored`. Que é:

```js
export default defineConfig({
  server: {
    watch: {
      ignored: ['!**/node_modules/your-package-name/**']
    }
  },
  // O pacote observado deve ser excluído da otimização,
  // para ele possa aparecer no gráfico de dependência e acionar o recarregamento instantâneo.
  optimizeDeps: {
    exclude: ['your-package-name']
  }
})
```

:::warning Utilizando a Vite sobre o Subsistema de Windows para Linux (WSL, sigla em Inglês) 2

Quando estiveres executando a Vite sobre o WSL2, a observação do sistema de ficheiro não funciona quando um ficheiro é editado pelas aplicações do Windows (sem processo WSL2). Isto é devido a [uma limitação do WSL2](https://github.com/microsoft/WSL/issues/4739). Isto também se aplica à execução sobre Docker com um backend de WSL2.

Para corrigir isto, poderias tanto:

- **Recomendado**: Utilizar aplicações de WSL2 para editar os teus ficheiros.
  - Também é recomendado mover a pasta do projeto para fora de um sistema de ficheiro do Windows. A remoção deste custo geral melhorará o desempenho.
- Definir `{ usePolling: true }`.
  - Nota que [`usePolling` leva para alta utilização da CPU](https://github.com/paulmillr/chokidar#performance).

:::

## server.middlewareMode {#server-middlewareMode}

- **Tipo:** `boolean`
- **Predefinido como:** `false`

Cria um servidor de Vite no modo intermediário.

- **Relacionado ao:** [appType](./shared-options#apptype), [SSR - Configurando o Servidor de Desenvolvimento](/guide/ssr#setting-up-the-dev-server)

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

## server.base {#server-base}

- **Tipo:** `string | undefined`

Adiciona no principio esta pasta às requisições, para utilizar quando estiver delegando a Vite como uma subpasta. Deve começar e terminar com o carácter `/`.

## server.fs.strict {#server-fs-strict}

- **Tipo:** `boolean`
- **Predefinido como:** `true` (ativado por padrão desde a Vite 2.7)

Restringe o serviço de ficheiros fora da raiz do espaço de trabalho.

## server.fs.allow {#server-fs-allow}

- **Tipo:** `string[]`

Restringe os ficheiros que poderiam ser servidos através de `/@fs/`. Quando `server.fs.strict` é definido para `true`, o acesso dos ficheiros fora desta lista de diretório que não são importados de um ficheiro permitido resultará em um 403.

A Vite procurará pela raiz do potencial espaço de trabalho e o utilizará como padrão. Um espaço de trabalho válido atende as seguintes condições, caso contrário retrocederá para a [raiz do projeto](/guide/#index-html-e-a-raiz-do-projeto):

- contém o campo `workspaces` no `package.json`
- contém um dos seguintes ficheiro
  - `lerna.json`
  - `pnpm-workspace.yaml`

Aceita um caminho para especificar a raiz do espaço de trabalho personalizado. Poderia ser um caminho absoluto ou um caminho relativo para [raiz do projeto](/guide/#index-html-e-a-raiz-do-projeto). Por exemplo:

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
        '/path/to/custom/allow'
      ]
    }
  }
})
```

## server.fs.deny {#server-fs-deny}

- **Tipo:** `string[]`
- **Predefinido como:** `['.env', '.env.*', '*.{pem,crt}']`

Lista de bloqueio para ficheiros sensíveis sendo restringidos de serem servidos pelo servidor de desenvolvimento da Vite. Isto terá uma prioridade superior a [`server.fs.allow`](#server-fs-allow). [Os padrões picomatch](https://github.com/micromatch/picomatch#globbing-features) são suportados.

## server.origin {#server-origin}

- **Tipo:** `string`

Define a origem as URLs do recurso gerado durante o desenvolvimento.

```js
export default defineConfig({
  server: {
    origin: 'http://127.0.0.1:8080'
  }
})
```
