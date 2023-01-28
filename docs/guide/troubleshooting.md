# Resolução de Problemas {#troubleshooting}

Consulte também o [guia de resolução de problemas da Rollup](https://rollupjs.org/troubleshooting/) para obter mais informações.

Se as sugestões neste documento não funcionarem, tente publicar as questões nas [Discussões da GitHub](https://github.com/vitejs/vite/discussions) ou no canal de `#help` da [Discord do País de Vite (Vite Land)](https://chat.vitejs.dev).

## Interface de Linha de Comando {#cli}

### `Error: Cannot find module 'C:\foo\bar&baz\vite\bin\vite.js'`

O caminho para a pasta do teu projeto talvez inclua `&`, o qual não funciona com o `npm` no Windows ([npm/cmd-shim#45](https://github.com/npm/cmd-shim/issues/45)).

Tu precisarás ou de:

- Mudar para um outro gestor de pacote (por exemplo, `pnpm`, `yarn`)
- Remover o `&` do caminho do teu projeto

## Servidor de Desenvolvimento {#dev-server}

### Requisições são Bloqueada para Sempre {#requests-are-stalled-forever}

Se estiveres utilizando Linux, limites de descritor de ficheiro e limites de `inotify` podem estar causando o problema. Já que a Vite não empacota  a maior parte dos ficheiros, os navegadores podem requisitar muitos ficheiros os quais requerem muitos descritores de ficheiro, ultrapassando o limite.

Para resolver isto:

- Aumente o limite do descritor de ficheiro pelo `ulimit`

  ```shell
  # Consulte o limite atual
  $ ulimit -Sn
  # Mude o limite (temporário)
  $ ulimit -Sn 10000 # Tu podes também precisar mudar o limite manualmente
  # Reinicie o teu navegador
  ```

- Aumente os seguintes limites relacionado com `inotify` pelo `sysctl`

  ```shell
  # Consulte os limites atuais
  $ sysctl fs.inotify
  # Mude os limites (temporário)
  $ sudo sysctl fs.inotify.max_queued_events=16384
  $ sudo sysctl fs.inotify.max_user_instances=8192
  $ sudo sysctl fs.inotify.max_user_watches=524288
  ```

### Requisições de Rede Impedem o Carregamento {#network-requests-stop-loading
}

Quando estiveres a usar um certificado de SSL auto-assinado, o Chrome ignora todas diretivas do armazenamento de recurso de consulta imediata (aka, caching) e recarrega o conteúdo. A Vite depende das diretivas de armazenamento de recurso de consulta imediata.

Para resolver o problema use um certificado de SSL de confiança.

Consulte: [Cache problems](https://helpx.adobe.com/mt/experience-manager/kb/cache-problems-on-chrome-with-SSL-certificate-errors.html), [Chrome issue](https://bugs.chromium.org/p/chromium/issues/detail?id=110649#c8)

#### macOS {#macos}

Tu podes instalar um certificado de confiança através da Interface da Linha de Comando com este comando:

```sh
security add-trusted-cert -d -r trustRoot -k ~/Library/Keychains/login.keychain-db your-cert.cer
```

Ou, importando-o pela aplicação Keychain Access e atualizando a confiança do teu certificado para "Always Trust."

### 431 Campos do Cabeçalho da Requisição Muito Grandes {#431-request-header-fields-too-large}

Quando o servidor ou servidor de websocket recebe um cabeçalho de HTTP grande, a requisição será largada e o seguinte aviso será exibido.

> Server responded with status code 431. See https://vitejs.dev/guide/troubleshooting.html#_431-request-header-fields-too-large.

> (Tradução) O servidor respondeu com o código de estado 431. Consulte https://pt.vitejs.dev/guide/troubleshooting.html#_campos-do-cabeçalho-da-requisição-muito-grandes.

Isto porque a Node.js limita o tamanho do cabeçalho da requisição para mitigar o [CVE-2018-12121](https://www.cve.org/CVERecord?id=CVE-2018-12121).

Para evitar isto, tente reduzir o tamanho do cabeçalho da tua requisição. Por exemplo, se o cookie for longo, elimine-o. Ou podes utilizar a [`--max-http-header-size`](https://nodejs.org/api/cli.html#--max-http-header-sizesize) para mudar o tamanho máximo do cabeçalho.

## Substituição de Módulo Instantânea {#hmr}

### A Vite Deteta uma Mudança de Ficheiro mas a HMR não está a Funcionar {#vite-detects-a-file-change-but-the-hmr-is-not-working}

Tu talvez estejas importando um ficheiro com uma caixa diferente. Por exemplo, `src/foo.js` existe e `src/bar.js` contém:

```js
import './Foo.js' // deveria ser './foo.js'
```

Problema relacionado: [#964](https://github.com/vitejs/vite/issues/964)

### A Vite não Deteta uma Mudança de Ficheiro {#vite-does-not-detect-a-file-change}

Se estiveres executando a Vite com o WSL2, a Vite não consegue observar mudanças de ficheiro em algumas condições. Consulte a [opção `server.watch`](/config/server-options.md#server-watch).

### Um Recarregamento Completo Acontece no Lugar da HMR {#a-full-reload-happens-instead-of-hmr}

Se a HMR não for manipulada pela Vite ou uma extensão, um recarregamento completo acontecerá.

Além disto se houver um laço de dependência, um recarregamento completo acontecerá. Para resolver isto, tente a remoção do laço.

### Alto Número de Atualizações de HMR na Consola {high-number-of-hmr-updates-in-console}

Isto pode ser causado por uma dependência circular. Para resolver isto, tente quebrar o laço.

## Construção {#build}

### O Ficheiro Construído não Funciona por Causa do Erro de CORS {#built-file-does-not-work-because-of-cors-error}

Se o ficheiro HTML de saída foi aberto com o protocolo `file`, os programas (ou scripts se preferires) não executarão com o seguinte erro.

> Access to script at 'file:///foo/bar.js' from origin 'null' has been blocked by CORS policy: Cross origin requests are only supported for protocol schemes: http, data, isolated-app, chrome-extension, chrome, https, chrome-untrusted.

> (Tradução) O acesso ao programa em 'file:///foo/bar.js' a partir da origem 'null' foi bloqueada pela política de CORS: As requisições de origem cruzadas apenas são suportadas para os esquemas de protocolo: http, data, isolated-app, chrome-extension, chrome, https, chrome-untrusted.

> Cross-Origin Request Blocked: The Same Origin Policy disallows reading the remote resource at file:///foo/bar.js. (Reason: CORS request not http).

> (Tradução) Requisição de Origem Cruzada Bloqueada: A Mesma Política de Origem desautoriza a leitura do recurso em file:///foo/bar.js. (Motivo: Requisição de CORS não é de http).

Consulte o [Motivo: Requisição de CORS não é HTTP - HTTP | MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS/Errors/CORSRequestNotHttp) para obter mais informações a respeito do por quê isto acontece.

Tu precisarás acessar o ficheiro com o protocolo de `http`. A maneira mais fácil de alcançar isto é executar o `npx vite preview`.

## Outros {#others}

### Ocorre Erro de Sintaxe / Erro de Tipo {#syntax-error-type-error-happens}

A Vite não consegui manipular e não suporta o código que só executa no modo não restrito (modo desleixado). Isto porque a Vite utiliza Módulo de ECMAScript e sempre é [modo restrito](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode) dentro do Módulo de ECMAScript.

Por exemplo, podes ver estes erros.

> [ERROR] With statements cannot be used with the "esm" output format due to strict mode

> (Tradução) [ERRO] a expressão `with` não pode ser utilizada com o formato de saída "esm" por causa do modo estrito

> TypeError: Cannot create property 'foo' on boolean 'false'

> (Tradução) Erro de Tipo: Não possível criar a propriedade `'foo'` sobre o booleano '`false`'

Se estes códigos são utilizados dentro de dependências, poderias utilizar [`patch-package`](https://github.com/ds300/patch-package) (ou [`yarn patch`](https://yarnpkg.com/cli/patch) ou [`pnpm patch`](https://pnpm.io/cli/patch)) por uma escotilha de saída.
