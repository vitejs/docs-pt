# Opções de Pré-visualização {#preview-options}

## `preview.host` {#preview-host}

- **Tipo:** `string | boolean`
- **Predefinido como:** [`server.host`](./server-options#server-host)

Especifica quais endereços de IP o servidor deveria ouvir.
Defina isto para `0.0.0.0` ou `true` para ouvir todos endereços, incluindo endereços públicos e privados.

Isto pode ser definido através da interface de linha de comando utilizando `--host 0.0.0.0` ou `--host`.

:::tip NOTA

Existem casos onde outros servidores podem responder no lugar da Vite.
Consulte [`server.host`](./server-options#server-host) para obter mais detalhes.

:::

## `preview.allowedHosts` {#preview-allowedhosts}

- **Tipo:** `string | true`
- **Predefinida como:** [`server.allowedHosts`](./server-options#server-allowedhosts)

Os nomes de hospedeiros que a Vite está autorizada a responder.

Consultar [`server.allowedHosts`](./server-options#server-allowedhosts) por mais detalhes.

## `preview.port` {#preview-port}

- **Tipo:** `number`
- **Predefinido como:** `4173`

Especifica a porta do servidor. Nota que se a porta já está sendo utilizada, a Vite tentará automaticamente o próxima porta disponível assim esta pode não ser a posta em o servidor termina ouvindo.

**Exemplo:**

```js
export default defineConfig({
  server: {
    port: 3030
  },
  preview: {
    port: 8080
  }
})
```

## `preview.strictPort` {#preview-strictPort}

- **Tipo:** `boolean`
- **Predefinido como:** [`server.strictPort`](./server-options#server-strictport)

Define para `true` para sair se a porta já estiver em uso, no lugar de tentar automaticamente a próxima porta disponível.

## `preview.https` {#preview-https}

- **Tipo:** `https.ServerOptions`
- **Predefinido como:** [`server.https`](./server-options#server-https)

Ativa TLS + HTTP/2. Nota que isto despromove para TLS apenas quando a [opção `server.proxy`](./server-options#server-proxy) também for utiliza.

O valor também pode ser um [objeto de opções](https://nodejs.org/api/https.html#https_https_createserver_options_requestlistener) passado para `https.createServer()`.

## `preview.open` {#preview-open}

- **Tipo:** `boolean | string`
- **Predefinido como:** [`server.open`](./server-options#server-open)

Abre automaticamente no navegador na início do servidor. Quando o valor for uma sequência de caracteres, será utilizada como o nome do caminho da URL. Se quiseres abrir o servidor em um navegador especifico de tua escolha, podes definir a variável de ambiente `process.env.BROWSER` para (por exemplo, `firefox`). Tu também podes definir `process.env.BROWSER_ARGS` para passar argumentos adicionais (por exemplo, `--incognito`).

`BROWSER` e `BROWSER_ARGS` também são variáveis de ambiente especiais que podes definir no ficheiro `.env` para configurá-lo. Consulte [o pacote `open`](https://github.com/sindresorhus/open#app) para mais detalhes.

## `preview.proxy` {#preview-proxy}

- **Tipo:** `Record<string, string | ProxyOptions>`
- **Predefinido como:** [`server.proxy`](./server-options#server-proxy)

Configura regras de delegação personalizadas para o servidor de pré-visualização. Espera um objeto de pares `{ chave: opções }`. Se a chave começar com `^`, será interpretada como uma `RegExp` (Expressão Regular). A opção `configure` pode ser utilizada para acessar a instância da delegação.

Utiliza [`http-proxy`](https://github.com/http-party/node-http-proxy). Opções completas [aqui](https://github.com/http-party/node-http-proxy#options).

## `preview.cors` {#preview-cors}

- **Tipo:** `boolean | CorsOptions`
- **Predefinido como:** [`server.cors`](./server-options#server-cors)

Configura o CORS para o servidor de pré-visualização. Isto está ativado por padrão e permite qualquer origem. Passa um [objeto de opções](https://github.com/expressjs/cors#configuration-options) para afinar bem o comportamento ou `false` para desativar.

## `preview.headers` {#preview-headers}

- **Tipo:** `OutgoingHttpHeaders`

Especifica os cabeçalhos da resposta do servidor.
