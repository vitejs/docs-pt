# Manipulação de Recurso Estático {#static-asset-handling}

- Relacionado ao: [Caminho de Base Pública](./build#public-base-path)
- Relacionado a: [opção de configuração `assetsInclude`](/config/shared-options#assetsinclude)

## Importando o Recurso como URL {#importing-asset-as-url}

A importação dum recurso estático retornará a URL pública resolvida quando esta for servida:

```js
import imgUrl from './img.png'
document.getElementById('hero-img').src = imgUrl
```

Por exemplo, a `imgUrl` será `/img.png` durante o desenvolvimento, e torna-se-á `/assets/img.2d8efhg.png` na construção de produção.

O comportamento é semelhante ao `file-loader` da Webpack. A diferença é que a importação pode estar ou usando os caminhos públicos absolutos (baseado na raiz do projeto durante desenvolvimento) ou caminhos relativos.

- As referências de `url()` na CSS são tratadas da mesma maneira.

- Se usamos a extensão de Vue, as referências de recurso nos modelos de marcação dos componentes de ficheiro único da Vue são convertidos automaticamente em importações.

- Os tipos de ficheiro de imagem, media, e fonte comuns são detetados como recursos automaticamente. Nós podemos estender a lista interna usando a [opção `assetsInclude`](/config/shared-options#assetsinclude).

- Os recursos referenciados são incluídos como parte do gráfico de recursos de construção, terão os nomes de ficheiro baralhados com caracteres pseudo-aleatório, e poderão ser processados por extensões para otimização.

- Os recursos mais pequenos em bytes do que a [opção `assetsInlineLimit`](/config/build-options#build-assetsinlinelimit) serão embutidos como URLs de dados de base64.

- Os reservadores de espaço do [armazenamento de ficheiros grandes da Git](https://git-lfs.com/) são excluídos automaticamente da incorporação porque não contêm o conteúdo do ficheiro que representam. Para obter a incorporação, devemos certificar-nos de descarregar o conteúdo do ficheiro através do armazenamento de ficheiro grandes da Git antes da construção.

- A TypeScript, por padrão, não reconhece as importações de recurso estático como módulos válidos. Para corrigir isto, incluímos [`vite/client`](./features#client-types).

### Importações de URL Explicita {#explicit-url-imports}

Os recursos que não estão incluídos na lista interna ou na `assetsInclude`, podem ser explicitamente importados como uma URL usando o sufixo `?url`. Isto é útil, para por exemplo, importar os [Painéis de Trabalho de Pintura da Houdini](https://houdini.how/usage):

```js
import workletURL from 'extra-scalloped-border/worklet.js?url'
CSS.paintWorklet.addModule(workletURL)
```

### Importando Recurso como Sequência de Caracteres {#importing-asset-as-string}

Os recursos podem ser importados como sequências de caracteres usando o sufixo `?raw`:

```js
import shaderString from './shader.glsl?raw'
```

### Importando Programa como um Operário {#importing-script-as-a-worker}

Os programas podem ser importados como operários da Web com o sufixo `?worker` ou `?sharedworker`:

```js
// Separar pedaço na construção de produção
import Worker from './shader.js?worker'
const worker = new Worker()
```

```js
// sharedworker
import SharedWorker from './shader.js?sharedworker'
const sharedWorker = new SharedWorker()
```

```js
// Embutido como sequências de caracteres de base64
import InlineWorker from './shader.js?worker&inline'
```

Consulte a [seção de Operário da Web](./features#web-workers) por mais detalhes.

## O Diretório `public` {#the-public-directory}

Se tivermos recursos que:

- Nunca são referenciados no código-fonte (como por exemplo, `robots.txt`)
- Devem reter o mesmo exato nome de ficheiro (sem os embaralhar com caracteres pseudo-aleatórios)
- ...ou simplesmente não queremos ter de primeiro importar um recurso para apenas obter a sua URL

Então podemos colocar o recurso num diretório `public` especial sob a raiz do nosso projeto. Os recursos neste diretório serão servidos no caminho de raiz `/` durante o desenvolvimento, e copiados para a raiz do diretório de distribuição (abreviado como `dist`) como está.

O diretório é predefinido para `<root>/public`, mas pode ser configurado através da [opção `publicDir`](/config/shared-options#publicdir).

Nota que:

- Nós sempre devemos referenciar os recursos do `public` usando o caminho absoluto da raiz - por exemplo, `public/icon.png` deve ser referenciado no código-fonte como `/icon.png`.
- Os recursos no `public` não podem ser importados a partir do código de JavaScript.

## `new URL(url, import.meta.url)` {#new-url-url-import-meta-url}

[`import.meta.url`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import.meta) é uma funcionalidade do módulo de ECMAScript nativo que expõe a URL do módulo atual. Combinado-o com o [construtor de URL](https://developer.mozilla.org/en-US/docs/Web/API/URL) nativo, podemos obter a URL completa resolvida dum recurso estático usando caminho relativo a partir dum módulo de JavaScript:

```js
const imgUrl = new URL('./img.png', import.meta.url).href

document.getElementById('hero-img').src = imgUrl
```

Isto funciona nativamente nos navegadores modernos - de fatp, a Vite não precisa processar este código durante o desenvolvimento!

Este padrão suporta URLs dinâmicas através dos literais de modelo:

```js
function getImageUrl(name) {
  return new URL(`./dir/${name}.png`, import.meta.url).href
}
```

Durante a construção de produção, a Vite realizará as transformações necessárias para que as URLs continuem a apontar para a localização correta mesmo depois do empacotamento e embaralhação do recurso com caracteres pseudo-aleatórios. No entanto, a sequência de caracteres da URL deve ser estática para poder ser analisada, de outro modo o código será deixado como está, o que pode causar erros de execução se `build.target` não suportar `import.meta.url`:

```js
// A Vite não transformará isto
const imgUrl = new URL(imagePath, import.meta.url).href
```

:::warning NÃO FUNCIONA COM A INTERPRETAÇÃO DO LADO DO SERVIDOR
Este padrão não funciona se estivermos usando a Vite para interpretação do lado do servidor, porque `import.meta.url` tem semânticas diferentes nos navegadores versus a Node.js. O pacote do servidor também não pode determinar antecipadamente a URL do hospedeiro do cliente.
:::
