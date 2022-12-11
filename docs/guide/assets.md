# Manipulação de Recurso Estático {#static-asset-handling}

- Relacionado ao: [Caminho de Base Pública](./build#public-base-path)
- Relacionado a: [opção de configuração `assetsInclude`](/config/shared-options.md#assetsinclude)

## Importando o Recurso como URL {#importing-asset-as-url}

A importação de um recurso estático retornará a URL pública resolvida quando ele é servido:

```js
import imgUrl from './img.png'
document.getElementById('hero-img').src = imgUrl
```

Por exemplo, a `imgUrl` será `/img.png` durante o desenvolvimento, e torna-se `/assets/img.2d8efhg.png` na construção de produção.

O comportamento é semelhante ao `file-loader` do webpack. A diferença é que a importação pode estar ou utilizando os caminhos públicos absoluto (baseado no raiz do projeto durante desenvolvimento) ou caminhos relativos.

- As referências de `url()` na CSS são tratadas da mesma maneira.

- Se estiveres utilizando a extensão de Vue, as referências de recurso nos modelos de marcação de Componentes de Ficheiro Único de Vue são convertidos automaticamente em importações.

- Os tipos de ficheiro de imagem, media, e fonte são detetados como recursos automaticamente. Tu podes estender a lista interna utilizando a [opção `assetsInclude`](/config/shared-options.md#assetsinclude).

- Os recursos referenciados são incluídos como parte do gráfico de recursos de construção, terão os nomes de ficheiros baralhados, e poderão ser processados pelas extensões para otimização.

- Recursos mais pequenos em bytes do que a [opção `assetsInlineLimit`](/config/build-options.md#build-assetsinlinelimit) estarão embutidos como URLs de dados em base64.

- Os seguradores de lugar do Armazenamento de Ficheiros Grandes de Git (Git LFS) são excluídos automaticamente do embutido porque eles não contém o conteúdo do ficheiro que eles representam. Para receber o embutido, certifica-te de descarregar os conteúdos do ficheiro através do Armazenamento de Ficheiros Grandes de Git (Git LFS) antes da construção.

### Importações de URL Explicita {#explicit-url-imports}

Os recursos que não estão incluídos na lista interna ou na `assetsInclude`, podem ser explicitamente importados como uma URL utilizando o sufixo `?url`. Isto é útil, por exemplo, para importar os [Houdini Paint Worklets](https://houdini.how/usage).

```js
import workletURL from 'extra-scalloped-border/worklet.js?url'
CSS.paintWorklet.addModule(workletURL)
```

### Importando o Recurso como Sequência de Caracteres {#importing-asset-as-string}

Os recursos podem ser importados como sequências de caracteres utilizando o sufixo `?raw`.

```js
import shaderString from './shader.glsl?raw'
```

### Importando o Programa como um Operário {#importing-script-as-a-worker}

Os programas (ou scripts se preferir) podem ser importados como operários da web com o sufixo `?worker` ou `?sharedworker`.

```js
// Pedaço separado na construção de produção
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

Consulte [secção de Operário de Web](./features.md#operários-da-web) para mais detalhes.

## O Diretório `public` {#the-public-directory}

Se tiveres recursos que:

- Nunca são referenciados no código-fonte (por exemplo, `robots.txt`)
- Devem manter o mesmo exato nome de ficheiro (sem embaralhar)
- ...ou simplesmente não queres ter que importar um recurso primeiro só para receber a sua URL

Então podes colocar o recurso em um diretório `public` especial sob a tua raiz de projeto. Os recursos neste diretório serão servidos no caminho de raiz `/` durante o desenvolvimento, e copiados para a raiz do diretório `dist` como está.

O diretório é predefinido para `<root>/public`, mas pode ser configurado através da [opção `publicDir`](/config/shared-options.md#publicdir).

Nota que:

- Tu deves sempre faz referência aos recursos de `public` utilizando o caminho absoluto de raiz - por exemplo, `public/icon.png` deve ser referenciado no código-fonte como `/icon.png`.
- Os recursos no `public` não podem ser importados a partir da JavaScript.

## new URL(url, import.meta.url) {#new-url}

A [`import.meta.url`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import.meta) é uma funcionalidade de Módulo de ECMAScript nativo que expõe a URL do módulo atual. Ao combiná-la com o [construtor de URL](https://developer.mozilla.org/en-US/docs/Web/API/URL) nativo, podemos obter a URL resolvida completa de um recurso estático utilizando o caminho relativo a partir de um módulo de JavaScript:

```js
const imgUrl = new URL('./img.png', import.meta.url).href

document.getElementById('hero-img').src = imgUrl
```

Isto funciona de maneira nativa nos navegadores - de fato, a Vite não precisa de todo processar este código durante o desenvolvimento!

Este padrão suporta URLs dinâmicas através dos literais de modelo:

```js
function getImageUrl(name) {
  return new URL(`./dir/${name}.png`, import.meta.url).href
}
```

Durante a construção de produção, a Vite realizará as transformações necessárias para que as URLs continuarem a apontar para a localização correta mesmo depois do empacotamento e do embaralhar de recurso. No entanto a sequência de caracteres de URL deve ser estática assim ela pode ser analisada, de outro modo o código será deixado como está, o que pode causar erros em tempo de execução se `build.target` não suportar o `import.meta.url`:

```js
// A Vite não transformará isto
const imgUrl = new URL(imagePath, import.meta.url).href
```

::: warning Não funciona com a SSR
Este padrão não funciona se estiveres utilizando a Vite para Interpretação no Lado do Servidor, porque `import.meta.url` tem semânticas diferentes nos navegadores versus Node.js. O pacote de servidor também não consegue determinar a URL de hospedeiro do cliente antes da hora marcada.
:::
