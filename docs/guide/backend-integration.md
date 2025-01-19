# Integração de Backend {#backend-integration}

:::tip NOTA
Se quisermos servir o HTML usando um backend tradicional (por exemplo, Rails, Laravel, Django) porém usar a Vite para servir os recursos, devemos consultar as integrações existentes listadas no [Awesome Vite](https://github.com/vitejs/awesome-vite#integrations-with-backends).

Se precisarmos duma integração personalizada, podemos seguir os passos neste guia para configurá-la manualmente.
:::

1. Na nossa configuração de Vite, configuramos uma entrada e ativamos o manifeste de construção:

   ```js twoslash [vite.config.js]
   import { defineConfig } from 'vite'
   // ---cut---
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
   <!-- se for em desenvolvimento -->
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

  ```json [.vite/manifest.json]
   {
     "_shared-B7PI925R.js": {
       "file": "assets/shared-B7PI925R.js",
       "name": "shared",
       "css": ["assets/shared-ChJ_j-JJ.css"]
     },
      "_shared-ChJ_j-JJ.css": {
       "file": "assets/shared-ChJ_j-JJ.css",
       "src": "_shared-ChJ_j-JJ.css"
     },
     "baz.js": {
       "file": "assets/baz-B2H3sXNv.js",
       "name": "baz",
       "src": "baz.js",
       "isDynamicEntry": true
     },
     "views/bar.js": {
       "file": "assets/bar-gkvgaI9m.js",
       "name": "bar",
       "src": "views/bar.js",
       "isEntry": true,
       "imports": ["_shared-B7PI925R.js"],
       "dynamicImports": ["baz.js"]
     },
     "views/foo.js": {
       "file": "assets/foo-BRBmoGS9.js",
       "name": "foo",
       "src": "views/foo.js",
       "isEntry": true,
       "imports": ["_shared-B7PI925R.js"],
       "css": ["assets/foo-5UjPuW-k.css"]
     }
   }
   ```

   - O manifesto tem uma estrutura de `Record<name, chunk>`
   - Para a entrada ou pedaços de entrada dinâmica, a chave é o caminho de origem relativo a partir da raiz do projeto.
   - Para os pedaços que não forem de entrada, a chave é nome da base do ficheiro gerado prefixado com `_`.
   - Para o ficheiro de folha de estilo gerado quando [`build.cssCodeSplit`](/config/build-options#build-csscodesplit) for `false`, a chave é `style.css`.
   - Os pedaços conterão informação sobre as suas importações estáticas e dinâmicas (ambas são chaves que mapeiam para o pedaço correspondente no manifesto), e também os seus ficheiros de CSS e recursos correspondentes (se existirem).

4. Nós podemos usar este ficheiro para desenhar as ligações ou pré-carregar as diretivas com nomes de ficheiros compostos por caracteres pseudo-aleatórios.

  Eis um exemplo de modelo de marcação de HTML para desenhar as ligações corretamente. A sintaxe aqui é apenas para explicação, substitua com a nossa linguagem de modelo de marcação de servidor. A função `importedChunks` é uma função ilustrativa e não é fornecida pela Vite:

  ```html
   <!-- se for em produção -->

   <!-- para o cssFile do manifest[name].css -->
   <link rel="stylesheet" href="/{{ cssFile }}" />

   <!-- para o pedaço de importedChunks(manifest, name) -->
   <!-- para o cssFile de chunk.css -->
   <link rel="stylesheet" href="/{{ cssFile }}" />

   <script type="module" src="/{{ manifest[name].file }}"></script>

   <!-- para o pedaço de importedChunks(manifest, name) -->
   <link rel="modulepreload" href="/{{ chunk.file }}" />
   ```

   Especificamente, um backend que gera HTML deve incluir os seguintes marcadores, dado um ficheiro de manifesto e um ponto de entrada:

   - Um marcador `<link rel="stylesheet">` para cada ficheiro na lista `css` do ponto de entrado do pedaço.
   - Segue recursivamente todos os pedaços na lista `imports` do ponto de entrada e inclui um marcador `<link rel="stylesheet">` para cada ficheiro de CSS de cada pedaço importado.
   - Um marcador para a chave `file` do pedaço de ponto de entrada (`<script type="module">` para JavaScript, ou `<link rel="stylesheet">` para CSS).
   - Opcionalmente, o marcador `<link rel="modulepreload">` para o `file` de cada pedaço de JavaScript importado, novamente seguindo recursivamente as importações a partir do pedaço de ponto de entrada.

   Seguindo o exemplo de manifesto acima, para o ponto de entrada `views/foo.js` as seguintes marcadores devem ser incluídos em produção:

   ```html
   <link rel="stylesheet" href="assets/foo-5UjPuW-k.css" />
   <link rel="stylesheet" href="assets/shared-ChJ_j-JJ.css" />
   <script type="module" src="assets/foo-BRBmoGS9.js"></script>
   <!-- opcional -->
   <link rel="modulepreload" href="assets/shared-B7PI925R.js" />
   ```

  Enquanto o seguinte deve ser incluído para o ponto de entrada `views/bar.js`:

  ```html
  <link rel="stylesheet" href="assets/shared-ChJ_j-JJ.css" />
  <script type="module" src="assets/bar-gkvgaI9m.js"></script>
  <!-- opcional -->
  <link rel="modulepreload" href="assets/shared-B7PI925R.js" />
  ```

::: details Pseudo-Implementação da `importedChunks`

Um exemplo de pseudo-implementação de `importedChunks` em TypeScript (Isto não precisará ser adaptada a nossa linguagem de programação e linguagem de modelagem de marcação de hipertexto):

```ts
   import type { Manifest, ManifestChunk } from 'vite'
   export default function importedChunks(
     manifest: Manifest,
     name: string,
   ): ManifestChunk[] {
     const seen = new Set<string>()
     function getImportedChunks(chunk: ManifestChunk): ManifestChunk[] {
       const chunks: ManifestChunk[] = []
       for (const file of chunk.imports ?? []) {
         const importee = manifest[file]
         if (seen.has(file)) {
           continue
         }
         seen.add(file)
         chunks.push(...getImportedChunks(importee))
         chunks.push(importee)
       }
       return chunks
     }
     return getImportedChunks(manifest[name])
   }
```
:::
