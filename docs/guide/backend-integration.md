# Integração de Backend

:::tip Nota
Se quiseres servir a HTML utilizando um backend tradicional (por exemplo, Rails, Laravel) porém utilizar a Vite para servir os recursos, consulte pelas integrações existentes listadas na [Awesome Vite](https://github.com/vitejs/awesome-vite#integrations-with-backends).

Se precisares uma integração personalizada, podes seguir os passos neste guia para a configurares manualmente.
:::

1. Na tua configuração de Vite, configure a entrada e ative o manifesto de construção:

   ```js
   // vite.config.js
   export default defineConfig({
     build: {
       // gera o "manifest.json" no "outDir"
       manifest: true,
       rollupOptions: {
         // sobrescreve a entrada ".html" padrão
         input: '/path/to/main.js'
       }
     }
   })
   ```

   Se não desativaste o ["polyfill" de precarregamento de módulo](/config/build-options.md#build-polyfillmodulepreload), também precisas importar o "polyfill" na tua entrada.

   ```js
   // adiciona no inicio da entrada da tua aplicação
   import 'vite/modulepreload-polyfill'
   ```

2. Para desenvolvimento, injete o seguinte no modelo de HTML do teu servidor (substitua `http://localhost:5173` com a URL local que a Vite está executando):

   ```html
   <!-- if development -->
   <script type="module" src="http://localhost:5173/@vite/client"></script>
   <script type="module" src="http://localhost:5173/main.js"></script>
   ```

   Para servir os recursos apropriadamente, tens duas opções:

   - Certifica-te de que o servidor está configurada para delegar as requisições de recursos estáticos para o servidor da Vite
   - Defina a opção [`server.origin`](/config/server-options.md#server-origin) para que as URLs de recurso geradas sejam resolvidas utilizando a URL do servidor de back-end ao invés de um caminho relativo

   Isto é necessário para recursos tais como imagens carreguem apropriadamente.

   Nota que se estiveres utilizando a React com `@vitejs/plugin-react`, também precisarás adicionar isto antes dos programas acima, já que a extensão não é capaz de modificar a HTML que estás servindo:

   ```html
   <script type="module">
     import RefreshRuntime from 'http://localhost:5173/@react-refresh'
     RefreshRuntime.injectIntoGlobalHook(window)
     window.$RefreshReg$ = () => {}
     window.$RefreshSig$ = () => (type) => type
     window.__vite_plugin_react_preamble_installed__ = true
   </script>
   ```

3. Para produção: depois da execução de `vite build`, um ficheiro `manifest.json` será gerado ao lado de outros ficheiros de recurso. Um exemplo de ficheiro de manifesto se parece com isto:

   ```json
   {
     "main.js": {
       "file": "assets/main.4889e940.js",
       "src": "main.js",
       "isEntry": true,
       "dynamicImports": ["views/foo.js"],
       "css": ["assets/main.b82dbe22.css"],
       "assets": ["assets/asset.0ab0f9cd.png"]
     },
     "views/foo.js": {
       "file": "assets/foo.869aea0d.js",
       "src": "views/foo.js",
       "isDynamicEntry": true,
       "imports": ["_shared.83069a53.js"]
     },
     "_shared.83069a53.js": {
       "file": "assets/shared.83069a53.js"
     }
   }
   ```

   - O manifesto tem uma estrutura `Registo<nome, pedaço>`
   - Para os pedaços de entrada ou entrada dinâmica, a chave é o caminho do recurso relativo da raiz do projeto.
   - Para os pedaços que não são de entrada, a chave é no nome da base do ficheiro gerado prefixado com `_`.
   - Os pedaços conterão informações sobre a sua importação estática ou dinâmica (ambas são chaves que delineiam para o pedaço correspondente no manifesto), e também seus ficheiros de recurso e CSS correspondente (se houver algum).

   Tu podes utilizar este ficheiro para interpretar as ligações ou pré-carregar as diretivas com os nomes de ficheiro baralhado (nota: a sintaxe aqui é para explicação apenas, substitua com a linguagem geradora de modelos de marcação do teu servidor):

   ```html
   <!-- if production -->
   <link rel="stylesheet" href="/assets/{{ manifest['main.js'].css }}" />
   <script type="module" src="/assets/{{ manifest['main.js'].file }}"></script>
   ```
