# Integração de Backend {#backend-integration}

:::tip NOTA
Se quisermos servir o HTML usando um backend tradicional (por exemplo, Rails, Laravel, Django) porém usar a Vite para servir os recursos, devemos consultar as integrações existentes listadas no [Awesome Vite](https://github.com/vitejs/awesome-vite#integrations-with-backends).

Se precisarmos duma integração personalizada, podemos seguir os passos neste guia para configurá-la manualmente.
:::

1. Na nossa configuração de Vite, configuramos uma entrada e ativamos o manifeste de construção:

   ```js
   // vite.config.js
   export default defineConfig({
     build: {
       // gera `.vite/manifest.json` no diretório de saída
       manifest: true,
       rollupOptions: {
         // sobrescreve a entrada de `.html` padrão
         input: '/path/to/main.js',
       },
     },
   })
   ```

   Se não tivermos desativado o [preenchimento de lacuna da funcionalidade de pré-carregamento de módulo](/config/build-options#build-polyfillmodulepreload), também precisamos importar o preenchimento de lacuna na nossa entrada:

   ```js
   // adicionar no inicio da entrada da nossa aplicação
   import 'vite/modulepreload-polyfill'
   ```

2. Para o desenvolvimento, injetamos o seguinte no modelo de marcação de HTML do nosso servidor (substituímos `http://localhost:5173` pela URL local em que a Vite está ser executada):

   ```html
   <!-- if development -->
   <script type="module" src="http://localhost:5173/@vite/client"></script>
   <script type="module" src="http://localhost:5173/main.js"></script>
   ```

   No sentido de servir corretamente os recursos, temos duas opções:

   - Certificar-nos de que o servidor está configurado para delegar as requisições de recursos estáticos ao servidor da Vite.
   - Definir a opção [`server.origin`](/config/server-options.md#server-origin) para que as URLs dos recursos gerados sejam resolvidas usando a URL do servidor de backend ao invés dum caminho relativo.

   Isto é necessário para que recursos como imagens sejam carregados corretamente.

   Nota que se estivermos a usar a React com `@vitejs/plugin-react`, também precisaremos adicionar isto antes dos programas acima, já que a extensão não capaz de modificar o HTML que estivermos a servir (substituímos `http://localhost:5173` pela URL local em que a Vite está ser executada):

   ```html
   <script type="module">
     import RefreshRuntime from 'http://localhost:5173/@react-refresh'
     RefreshRuntime.injectIntoGlobalHook(window)
     window.$RefreshReg$ = () => {}
     window.$RefreshSig$ = () => (type) => type
     window.__vite_plugin_react_preamble_installed__ = true
   </script>
   ```

3. Para a produção: depois de executar `vite build`, um ficheiro `.vite/manifest.json` será gerado ao lado dos outros ficheiros de recurso. Um ficheiro de manifesto de exemplo se parece com isto:

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

   - O manifesto tem uma estrutura de `Record<name, chunk>` (ou `Registo<nome, pedaço>`)
   - Para a entrada ou pedaços de entrada dinâmica, a chave é o caminho de origem relativo a partir da raiz do projeto.
   - Para os pedaços que não forem de entrada, a chave é nome da base do ficheiro gerado prefixado com `_`.
   - Os pedaços conterão informação sobre as suas importações estáticas e dinâmicas (ambas são chaves que mapeiam para o pedaço correspondente no manifesto), e também os seus ficheiros de CSS e recursos correspondentes (se existirem).

   Nós podemos usar este ficheiro para desenhar as ligações ou pré-carregar as diretivas com nomes de ficheiros compostos por caracteres pseudo-aleatórios (nota: a sintaxe aqui é apenas para explicação, porque iremos substituir pela linguagem de modelação de marcação de hipertexto do servidor):

   ```html
   <!-- if production -->
   <link rel="stylesheet" href="/assets/{{ manifest['main.js'].css }}" />
   <script type="module" src="/assets/{{ manifest['main.js'].file }}"></script>
   ```
