# Construindo para Produção {#building-for-production}

Quando for o momento de desdobrar a tua aplicação para produção, execute simplesmente o comando `vite build`. Por padrão, ele utiliza `<root>/index.html` como o ponto de entrada da construção, e produz um pacote de aplicação que é adequada para ser servido sobre um serviço de hospedagem estática. Consulte o [Desdobrando um Sítio Estático](static-deploy) por guias a respeito dos serviços populares.

## Compatibilidade de Navegador {#browser-compatibility}

O pacote de produção presume suporte para JavaScript moderno. Por padrão, a Vite mira os navegadores que suportam [módulos de ECMAScript nativo](https://caniuse.com/es6-module), [importação dinâmica de Módulo de ECMAScript nativo](https://caniuse.com/es6-module-dynamic-import), e [`import.meta`](https://caniuse.com/mdn-javascript_operators_import_meta):

- Chrome >=87
- Firefox >=78
- Safari >=13
- Edge >=88

Tu podes especificar alvos personalizados através da [opção de configuração `build.target`](/config/build-options#build-target), onde o alvo inferior é `es2015`.

Nota que por padrão, a Vite apenas manipula transformações de sintaxe e **não cobre "polyfills"**. Tu podes consultar [Polyfill.io](https://polyfill.io/v3/) o qual é um serviço que gera automaticamente pacotes de "polyfill" baseado na sequência de caracteres de "UserAgent" do navegador do utilizador.

Os navegadores legados podem ser suportados através [@vitejs/plugin-legacy](https://github.com/vitejs/vite/tree/main/packages/plugin-legacy), que gerará automaticamente pedaços legados e correspondentes aos "polyfills" da funcionalidade da linguagem de ECMAScript. Os pedaços legados são condicionalmente carregados apenas nos navegadores que não têm suporte nativo ao Módulo de ECMAScript.

## Caminho de Base Pública {#public-base-path}

- Relacionado ao: [Manipulação de Recurso](assets)

Se estiveres desdobrando o teu projeto sob um caminho público encaixado, simplesmente especifique a [opção de configuração `base`](/config/shared-options#base) e todos caminhos de recurso serão sobrescritos por consequência. Esta opção também pode ser especificada como uma bandeira de linha de comando, por exemplo, `vite build --base=/my/public/path/`.

As URLs de recurso importado de JavaScript, referências de `url()` da CSS, e referências de recurso nos teus ficheiros `.html` são todos ajustados automaticamente para respeitar esta opção durante a construção.

A exceção está quando precisares concatenar dinamicamente as URLs. Neste caso, podes utilizar a variável `import.meta.env.BASE_URL` injetada globalmente a qual será o caminho de base pública. Nota que esta variável é substituída estaticamente durante a construção então deve aparecer exatamente como está (por exemplo, `import.meta.env['BASE_URL']` não funcionará).

Para controlo de caminho de base avançado, consulte [Opções de Base Avançada](#advanced-base-options)

## Personalizando a Construção {#customizing-the-build}

A construção pode ser personalizada através de várias [opções de configuração da construção](/config/build-options.md). Especificamente, podes diretamente ajustar as [Opções de Rollup](https://rollupjs.org/configuration-options/) subjacentes através da `build.rollupOptions`:

```js
// vite.config.js
export default defineConfig({
  build: {
    rollupOptions: {
      // https://rollupjs.org/configuration-options/
    }
  }
})
```

Por exemplo, podes especificar várias saídas de Rollup com extensões que apenas são aplicadas durante a construção.

## Estratégia de Fatiamento {#chunking-strategy}

Tu podes configurar como os pedaços são separados utilizando a `build.rollupOptions.output.manualChunks` (consulte a [documentação da Rollup](https://rollupjs.org/configuration-options/#output-manualchunks)). Até a Vite 2.8, a estratégia de fatiamento padrão dividia os pedaços em `index` e `vendor`. É uma boa estratégia para algumas Aplicações de Página Única, mas é difícil fornecer uma solução geral para todos casos de uso alvos da Vite. Desde a Vite 2.9, `manualChunks` já não modificado por padrão. Tu podes continuar a utilizar a estratégia de Separação Ambulante de Pedaço adicionando a `splitVendorChunkPlugin` no teu ficheiro de configuração:

```js
// vite.config.js
import { splitVendorChunkPlugin } from 'vite'
export default defineConfig({
  plugins: [splitVendorChunkPlugin()]
})
```

Esta estratégia também é fornecida como uma fábrica `splitVendorChunk({ cache: SplitVendorChunkCache })`, neste caso a composição com lógica personalizada se faz necessária. A `cache.reset()` precisa ser chamada no `buildStart` para o modo de observação da construção para funcionar corretamente neste caso.

:::warning AVISO
Tu deves usar a forma da função `build.rollupOptions.output.manualChunks` quando usares esta extensão. Se a forma do objeto for usada, a extensão não surtirá nenhum efeito.
:::

## Reconstrução Sobre Mudanças de Ficheiros {#rebuild-on-files-changes}

Tu podes ativar o observador de Rollup com `vite build --watch`. Ou, podes diretamente ajustar a [`WatcherOptions`](https://rollupjs.org/configuration-options/#watch) subjacente através da `build.watch`:

```js
// vite.config.js
export default defineConfig({
  build: {
    watch: {
      // https://rollupjs.org/configuration-options/#watch
    }
  }
})
```

Com a bandeira `--watch` ativada, mudanças para a `vite.config.js`, bem como para quaisquer ficheiros à serem empacotados, acionarão uma reconstrução.

## Aplicação de Várias Páginas {#multi-page-app}

Suponha que tens a seguinte estrutura de código-fonte:

```
├── package.json
├── vite.config.js
├── index.html
├── main.js
└── nested
    ├── index.html
    └── nested.js
```

Durante o desenvolvimento, apenas navegar ou ligar ao `/nested/` - funciona como esperado, tal como para um servidor de ficheiro estático normal.

Durante a construção, tudo que precisas fazer é especificar vários ficheiros `.html` como pontos de entrada:

```js
// vite.config.js
import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        nested: resolve(__dirname, 'nested/index.html')
      }
    }
  }
})
```

Se especificares uma raiz diferente, lembra-te de que `__dirname` ainda será a pasta do teu ficheiro `vite.config.js` quando estiveres resolvendo os caminhos de entrada. Portanto, precisarás adicionar a tua entrada `root` aos argumentos para a `resolve`.

Nota que para os ficheiros de HTML, a Vite ignora o nome dado para a entrada no objeto `rollupOptions.input` e ao invés disto respeita o identificador resolvido da ficheiro quando gera o recurso de HTML na pasta de distribuição. Isto garante uma estrutura consistente com a maneira que o servidor de desenvolvimento funciona.

## Modo de Biblioteca {#library-mode}

Quando estiveres desenvolvendo uma biblioteca orientada a navegador, estás provavelmente gastando a maior parte do tempo sobre a página de teste ou demonstração que importa a tua biblioteca real. Com a Vite, podes utilizar o teu `index.html` para aquele propósito de obter a agradável experiência de programação.

Quando for o momento de empacotar a tua biblioteca para distribuição, utilizar a [opção de configuração `build.lib`](/config/build-options#build-lib). Certifica-te de também expor quaisquer dependências que não quiseres empacotar na tua biblioteca, por exemplo, `vue` ou `react`:

```js
// vite.config.js
import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      // Também poderia ser um diretório ou
      // arranjo de vários pontos de entrada
      entry: resolve(__dirname, 'lib/main.js'),
      name: 'MyLib',
      // as extensões apropriadas serão adicionadas
      fileName: 'my-lib'
    },
    rollupOptions: {
      // certifica-te de expor as dependências que não devem
      // ser empacotadas na tua biblioteca
      external: ['vue'],
      output: {
        // Forneça as variáveis globais para utilizar na
        // construção UMD para as dependências expostas
        globals: {
          vue: 'Vue'
        }
      }
    }
  }
})
```

O ficheiro de entrada conteria exportações que poderiam ser importadas pelos utilizadores do teu pacote:

```js
// lib/main.js
import Foo from './Foo.vue'
import Bar from './Bar.vue'
export { Foo, Bar }
```

A execução de `vite build` com esta configuração utiliza uma programação de Rollup que está orientada para entregar as bibliotecas e produzir dois formatos de pacote: `es` e `umd` (configurável através de `build.lib`):

```
$ vite build
building for production...
dist/my-lib.js      0.08 kB / gzip: 0.07 kB
dist/my-lib.umd.cjs 0.30 kB / gzip: 0.16 kB
```

O `package.json` recomendado para a tua biblioteca:

```json
{
  "name": "my-lib",
  "type": "module",
  "files": ["dist"],
  "main": "./dist/my-lib.umd.cjs",
  "module": "./dist/my-lib.js",
  "exports": {
    ".": {
      "import": "./dist/my-lib.js",
      "require": "./dist/my-lib.umd.cjs"
    }
  }
}
```

Ou, se estiveres expondo vários pontos de entrada:

```json
{
  "name": "my-lib",
  "type": "module",
  "files": ["dist"],
  "main": "./dist/my-lib.cjs",
  "module": "./dist/my-lib.js",
  "exports": {
    ".": {
      "import": "./dist/my-lib.js",
      "require": "./dist/my-lib.cjs"
    },
    "./secondary": {
      "import": "./dist/secondary.js",
      "require": "./dist/secondary.cjs"
    }
  }
}
```

:::tip Extensões de Ficheiro
Se o `package.json` não conter a `"type": "module"`, a Vite gerará extensões de ficheiro diferentes para compatibilidade da Node.js. A `.js` tornar-se-á em `.mjs` e `.cjs` tornar-se-á em `.js`.
:::

:::tip Variáveis de Ambiente
No modo de biblioteca, todas as utilizações de `import.meta.env.*` são substituídas estaticamente quando estiveres construindo para produção. No entanto, as utilizações de `process.env.*` não são, para que os consumidores da tua biblioteca possam mudá-la dinamicamente. Se isto for indesejável, podes utilizar a `define: { 'process.env.`<wbr>`NODE_ENV': '"production"' }` por exemplo para substituí-las estaticamente.
:::

:::warning Uso Avançado
O modo de biblioteca inclui uma simples e opiniosa configuração para bibliotecas orientadas para o navegador e para abstração de JavaScript. Se estivermos a construir bibliotecas que não estão destinadas ao navegador, ou exigem fluxos de construção avançados, podemos usar diretamente a [Rollup](https://rollupjs.org) ou [esbuild](https://esbuild.github.io).
:::

## Opções de Base Avançada {#advanced-base-options}

:::warning Aviso
Esta funcionalidade é experimental. [Faça Comentário](https://github.com/vitejs/vite/discussions/13834).
:::

Para casos de usos avançados, os recursos desdobrados e ficheiros públicos podem estar caminhos diferentes, por exemplo para utilizares diferentes estratégias de cache.
Um utilizador pode escolher desdobrar em três caminhos diferentes:

- Os ficheiros de HTML de entrada gerados (os quais podem ser processados durante a SSR)
- O recursos embaralhados gerados (JS, CSS, e outros tipos de ficheiros como imagens)
- Os [ficheiros públicos](assets#the-public-directory) copiados

Uma única [base](#public-base-path) estática não é o suficiente nestes cenários. A Vite fornece suporte experimental para opções de base avançada durante a construção, utilizando a `experimental.renderBuiltUrl`.

```ts
experimental: {
  renderBuiltUrl(filename: string, { hostType }: { hostType: 'js' | 'css' | 'html' }) {
    if (hostType === 'js') {
      return { runtime: `window.__toCdnUrl(${JSON.stringify(filename)})` }
    } else {
      return { relative: true }
    }
  }
}
```

Se os recursos embaralhados e ficheiros públicos não forem desdobrados juntos, as opções para cada grupo podem ser definidas de maneira independente utilizando a `type` de recurso incluído no segundo parâmetro de `context` dado para função.

```ts
experimental: {
  renderBuiltUrl(filename: string, { hostId, hostType, type }: { hostId: string, hostType: 'js' | 'css' | 'html', type: 'public' | 'asset' }) {
    if (type === 'public') {
      return 'https://www.domain.com/' + filename
    }
    else if (path.extname(hostId) === '.js') {
      return { runtime: `window.__assetsPath(${JSON.stringify(filename)})` }
    }
    else {
      return 'https://cdn.domain.com/assets/' + filename
    }
  }
}
```
