# Guia de Contribuição de Vite {#vite-contributing-guide}

Olá! Estamos muito excitados que estejas interessado em contribuir com a Vite. Antes da submissão da tua contribuição, certifica-te de tirar um momento para ler através do seguinte guia. Nós também sugerimos-te ler a [Filosofia do Projeto](https://pt.vite.dev/guide/philosophy) na nossa documentação.

## Configuração de Repositório {$repo-setup}

O repositório da Vite é um mono-repositório utilizando os espaços de trabalho da pnpm. O gestor de pacote utilizado para instalar e ligar as dependências deve ser [pnpm](https://pnpm.io/).

Para programar e testar o pacote `vite` principal:

1. Execute `pnpm i` na pasta de raiz da Vite

2. Execute `pnpm run build` na pasta de raiz da Vite

3. Se estiveres programando a própria Vite, podes ir para `packages/vite` e executar `pnpm run dev` para reconstruir a Vite automaticamente sempre mudares o seu código.

Tu podes alternativamente utilizar o [Ambiente de Desenvolvimento de Docker da Vite.js](https://github.com/nystudio107/vitejs-docker-dev) por uma configuração de Docker em contentor para o desenvolvimento da Vite.js.

> A Vite utiliza a pnpm v7. Se estiveres trabalhando sobre vários projetos com versões diferentes do pnpm, é recomendado ativar a [Corepack](https://github.com/nodejs/corepack) executando `corepack enable`.

## Depurando {#debugging}

Se quiseres utilizar ponto de quebra e explorar a execução do código, podes utilizar a funcionalidade ["Executar e Depurar"](https://code.visualstudio.com/docs/editor/debugging) do Visual Studio Code (ou VSCode).

1. Adiciona uma declaração `debugger` onde queres parar a execução do código.

2. Clique sobre o ícone "Executar e Depurar" (ou "Run and Debug", em Inglês) na barra de atividade do editor.

3. Clique sobre o botão "Terminal de Depuração de JavaScript" (ou "JavaScript Debug Terminal").

4. Ele abrirá um terminal, depois vá para `playground/xxx` e execute `pnpm run dev`.

5. A execução parará e utilizarás a [Barra de Ferramenta de Depuração](https://code.visualstudio.com/docs/editor/debugging#_debug-actions) para continuares, passe por cima, reinicie o processo...

### Depurando erros nos testes de Vitest utilizando a Playwright (Chromium) {#debugging-errors-in-vitest-tests-using-playwright-chromium}

Alguns erros são mascarados e escondidos por causa das camadas de abstração e da natureza de caixa de areia adicionada pela Vitest, Playwright, e Chromium. Para ver o que realmente existe de errado e os conteúdos da consola das ferramentas do programador naquelas instâncias, siga esta configuração:

1. Adicionar uma declaração `debugger` ao `playground/vitestSetup.ts` -> gatilho `afterAll`. Isto pausará a execução antes dos testes pararem e a instância de navegador da Playwright sair.

1. Executar os testes com o comando de programa (ou script em Inglês) `debug-serve` que ativará a depuração remota: `pnpm run debug-serve resolve`.

1. Esperar pela ferramenta de programação inspetor abrir o teu navegador e o depurador para atribuir.

1. No painel de recursos na coluna da direita, clique o botão tocar (play, em Inglês) para resumir a execução e permitir os testes executarem o que abrirá uma instância de Chromium.

1. Focar-se na instância de Chromium, podes abrir as ferramentas de programação do navegador e inspecionar a consola lá para encontrar os problemas subjacentes.

1. Para fechar tudo, apenas pare o anterior processo de teste no teu terminal.

## Testando a Vite contra pacotes externos {#testing-vite-against-external-packages}

Tu podes desejar testar a tua cópia da Vite modificada localmente contra um outro pacote que é construído com a Vite. Para pnpm, depois da construção da Vite, podes usar [`pnpm.overrides`](https://pnpm.io/package_json#pnpmoverrides). Por favor notar que `pnpm.overrides` deve ser especificada no `package.json` de raiz e deves primeiro listar o pacote como uma dependência no `package.json` de raiz:

```json
{
  "dependencies": {
    "vite": "^2.0.0"
  },
  "pnpm": {
    "overrides": {
      "vite": "link:../path/to/vite/packages/vite"
    }
  }
}
```

E ré-execute `pnpm install` para ligar o pacote.

## Executando Testes {#running-tests}

### Testes de Integração {#integration-tests}

Cada pacote sob `playground/` contém um diretório `__tests__`. Os testes são executados usando [Vitest](https://vitest.dev/) + [Playwright](https://playwright.dev/) com as integrações personalizadas para escrita de testes simples. A configuração detalhada está dentro dos ficheiros `vitest.config.e2e.js` e `playground/vitest*`.

Antes da execução dos testes, certifica-te de que a [Vite foi construída](#repo-setup). No Windows, podes querer [ativar o Modo de Programador](https://docs.microsoft.com/en-us/windows/apps/get-started/enable-your-device-for-development) para solucionar [problemas com a criação de ligação simbólica para não administradores](https://github.com/vitejs/vite/issues/7390). Além disto podes querer [definir `core.symlinks` de git para `true` para solucionar problemas com ligações simbólicas no git](https://github.com/vitejs/vite/issues/5242).

Cada teste de integração pode ser executado sob o modo de servidor de desenvolvimento ou modo de construção.

- `pnpm test` por padrão executa todos testes de integração em ambos modo de serviço e construção, e também os testes unitários.

- `pnpm run test-serve` executa os testes apenas sob o modo de serviço.

- `pnpm run test-build` executa os testes apenas sob o modo de construção.

- Tu também podes usar `pnpm run test-serve [match]` ou `pnpm run test-build [match]` para executar os testes em uma pacote de teste especifico, por exemplo `pnpm run test-serve asset` executará os testes para ambos `playground/asset` e `vite/src/node/__tests__/asset` sob o modo de serviço e `vite/src/node/__tests__/**/*` apenas executará no modo de serviço.

  - Nota que a correspondência de pacote não está disponível para o programa `pnpm test`, o qual sempre executa os testes.

### Testes Unitário {#unit-tests}

Para além dos testes sob `playground/` para testes de integração, os pacotes podem contém testes unitário sob os seus diretório `playground/`. Os testes unitários são alimentados pelo [Vitest](https://vitest.dev/). A configuração detalhada está dentro dos ficheiros `vitest.config.ts`.

- `pnpm run test-unit` executa testes unitários sob cada pacote.

- Tu também podes usar `pnpm run test-unit [match]` para executar os testes relacionados.

### Ambiente de Teste e Auxiliares {#test-env-and-helpers}

Dentro dos testes de experimentos, podes importar o objeto `page` do `~utils`, a qual é uma instância de [`Page`](https://playwright.dev/docs/api/class-page) da Playwright que já tem navegado para a página servida da atual zona de experimentos. Assim escrever um teste é tão simples quanto:

```js
import { page } from '~utils'

test('should work', async () => {
  expect(await page.textContent('.foo')).toMatch('foo')
})
```

Alguns auxiliares de teste comum, por exemplo, `testDir`, `isBuild` ou `editFile` também estão disponíveis nos utilitários. O código-fonte está localizado no `playground/test-utils.ts`.

Nota: O ambiente de construção de teste usa um [conjunto padrão de configuração de Vite diferente](https://github.com/vitejs/vite/blob/main/playground/vitestSetup.ts#L102-L122) para ignorar a tradução de código durante os testes para torná-lo mais rápido. Isto pode produzir um resultado diferente comparado a construção de produção padrão.

### Estendendo o Conjunto de Teste {#extending-the-test-suite}

Para adicionar novos testes, deves encontrar uma zona de testes relacionada a correção ou funcionalidade (ou criar uma nova). Como exemplo, o carregamento de recursos estáticos são testados na [zona de testes dos recursos](https://github.com/vitejs/vite/tree/main/playground/assets). Nesta aplicação de Vite, existe um teste para importações `?raw`, com [uma seção definida no `index.html` para ela](https://github.com/vitejs/vite/blob/main/playground/assets/index.html#L121):

```html
<h2>?raw import</h2>
<code class="raw"></code>
```

Isto será modificado [com o resultado de uma importação de ficheiro](https://github.com/vitejs/vite/blob/main/playground/assets/index.html#L151):

```js
import rawSvg from './nested/fragment.svg?raw'
text('.raw', rawSvg)
```

Onde o utilitário `text` é definido como:

```js
function text(el, text) {
  document.querySelector(el).textContent = text
}
```

Nos [testes da especificação](https://github.com/vitejs/vite/blob/main/playground/assets/__tests__/assets.spec.ts#L180), as modificações para o DOM listado acima são usadas para testar esta funcionalidade:

```js
test('?raw import', async () => {
  expect(await page.textContent('.raw')).toMatch('SVG')
})
```

## Nota sobre as Dependências de Teste {#note-on-test-dependencies}

Em muitos casos de teste precisamos simular dependências com o uso dos protocolos `link:` e `file:`. O `pnpm` trata o `link` como ligações simbólicas e `file:` como ligações que não são simbólicas. Para testar as dependências como se elas fossem copiadas para `node_modules`, use o protocolo `file:`, em outros casos deves usar o protocolo `link:`.

## Relatório da Depuração {#debug-logging}

Tu podes definir a variável de ambiente `DEBUG` para ligar os relatórios da depuração. Por exemplo `DEBUG="vite:resolve"`. Para ver todos os relatório da depuração podes definir `DEBUG="vite:*"`, mas esteja avisado de que será muito ruidoso. Tu podes executar `grep -r "createDebugger('vite:" packages/vite/src/` para ver uma lista de possibilidades de depuração disponíveis.

## Diretrizes de Pedido de Atualização de Repositório {#pull-request-guidelines}

- Confirme um ramo do tópico a partir de um ramo da base, por exemplo `main`, e combine de volta contra aquele ramo.

- Se estiveres a adicionar uma nova funcionalidade:

  - Adicione o caso de teste em acompanhamento.
  - Forneça uma razão convincente para adicionar esta funcionalidade. Idealmente, deves abrir um tema de sugestão primeiro e tê-lo aprovado antes de trabalhar sobre ele.

- Se estiveres a corrigir um problema:

  - Se estiveres a resolver um problema especial, adicione `(fix #xxxx[,#xxxx])` (#xxxx é o identificador do problema) no título do teu pedido de atualização de repositório para um melhor relatório de lançamento, por exemplo `fix: update entities encoding/decoding (fix #3899)`.
  - Forneça uma descrição detalhada do problema no pedido de atualização de repositório (PR, sigla em Inglês). Demonstração ao vivo de preferência.
  - Adicione cobertura de teste apropriada se aplicável.

- Está bem ter várias pequenas consolidações (commits, em Inglês) na medida que trabalhas sobre o pedido de atualização de repositório - a GitHub pode espremê-las automaticamente antes da combinação.

- Certifica-te de que os testes passam!

- As mensagens de consolidação devem seguir a [convenção de mensagem de consolidação](./.github/commit-convention.md) para que os relatórios de mudança pode ser automaticamente geradas. As mensagens de consolidação são automaticamente validadas antes de consolidar (com a invocação de [Gatilhos de Git](https://git-scm.com/docs/githooks) através do [yorkie](https://github.com/yyx990803/yorkie)).

- Não precisas preocupar-te a respeito do estilo de código enquanto tens instalado as dependências de desenvolvimento - os ficheiros modificados são automaticamente formatados com o Prettier durante a consolidação (pela invocação de [Gatilhos de Git](https://git-scm.com/docs/githooks) através do [yorkie](https://github.com/yyx990803/yorkie)).

## Diretrizes de Manutenção {#maintenance-guidelines}

> A seção seguinte é na sua maioria para os preservadores que tem acesso de consolidação, mas a sua leitura é útil para o caso de quereres fazer contribuições não triviais para a base de código.

### Fluxo de Triagem de Problema {#issue-triaging-workflow}

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="./.github/issue-workflow-dark.png">
  <img src="./.github/issue-workflow.png">
</picture>

### Fluxo de Revisão de Pedido de Atualização de Repositório {#pull-request-review-workflow}

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="./.github/pr-workflow-dark.png">
  <img src="./.github/pr-workflow.png">
</picture>

## Notas sobre as Dependências {#notes-on-dependencies}

A Vite tem por objetivo ser leve, e isto inclue estar ciente do número de dependências de `npm` e do tamanho delas.

Nós usamos a `rollup` para pré-empacotar a maior parte das dependências antes da publicação! Portanto a maior parte das dependências, até as usadas no código da `src`, devem ser adicionadas sob a `devDependencies` por padrão. Isto também cria um número de restrições que precisamos estar cientes deles na base de código:

### Utilização da `require()` {#usage-of-require}

Em alguns casos nós intencionalmente importamos de maneira preguiçosa algumas dependências para melhorar o desempenho da inicialização. No entanto, nota que não podemos simplesmente usar as chamadas `require('somedep')` já que estes são ignorados nos ficheiros de Módulo de ECMAScript então a dependência não serão incluídas no pacote, e a dependência de fato nem estará quando for publicada já que estão nas `devDependencies`.

No lugar desta, use `(await import('somedep')).default`.

### Pense antes de adicionar uma dependência {#think-before-adding-a-dependency}

A maioria das dependências devem ser adicionadas ao `devDependencies` mesmo se forem necessárias no momento da execução. Algumas exceções são:

- Pacotes de tipos. Por exemplo: `@types/*`.
- As dependências que não podem ser empacotadas apropriadamente por causa dos ficheiros binários. Por exemplo: `esbuild`.
- As dependências que entregam os seus próprios tipos e os seu tipo é usado nos tipos públicos da própria vite. Por exemplo: `rollup`.

Evite dependências que têm amplas dependências transitivas que resultam em tamanho inchado comparado a funcionalidade que ela fornece. Por exemplo, o próprio `http-proxy` mais o `@types/http-proxy` está um pouco acima de 1MB em tamanho, mas `http-proxy-middleware` chega a uma tonelada de dependências que faz dela 7MB(!) quando um intermediário personalizado minimalista em cima do `http-proxy` apenas exige que umas poucas linhas de código.

### Assegurar o suporte de tipo {#ensure-type-support}

A Vite tem por objetivo ser completamente usável como dependência em um projeto de TypeScript (por exemplo, ela deve fornecer as tipagens apropriadas para VitePress), e também no `vite.config.ts`. Isto significa que tecnicamente uma dependência cujos tipos que são expostos precisam fazer parte das `dependencies` ao invés das `devDependencies`. No entanto, isto quem dizer que não seremos capazes de empacota-lá.

Para dar a volta a isto, embutiremos alguns tipos destas dependências no `packages/vite/src/dep-types`. Desta maneira podemos continuar a expor a tipagem exceto empacotar o código-fonte da dependência.

Use `pnpm run check-dist-types` para verificar se os tipos empacotados não dependem de tipos nas `devDependencies`. Se estiveres a adicionar as `dependencies`, certifica-te de configurar `tsconfig.check.json`.

### Pense antes de adicionar mais uma outra opção {#think-before-adding-yet-another-option}

Nós já temos muitas opções de configuração, e devemos evitar a correção de um problema com a adição de mais uma outra opção. Antes de adicionar uma opção, tente pensar a respeito de:

- Se o problema é realmente digno de tratamento
- Se o problema pode ser corrigido com um padrão mais inteligente
- Se o problema tem solução com uso das opções existentes
- Se o problema pode ser tratado com uma extensão

## Contribuição com a tradução da documentação {#docs-translation-contribution}

Se gostarias de começar uma tradução no teu idioma, és convidado a contribuir! Faça a gentileza de juntar-te ao [canal `#translations` na Vite Land](https://chat.vite.dev) para discutir e coordenar com os outros.

A documentação em Inglês está fixada no repositório principal da Vite, para permitir os colaboradores trabalharem sobre a documentação, testes e implementação na mesma PR. As traduções são feitas copiando o repositório principal.

### Como começar um repositório de tradução {#how-to-start-a-translation-repo}

1. Para receberes todos os ficheiros da documentação, precisas primeiro clonar este repositório na tua conta pessoal.
2. Manter todos os ficheiros no `docs/` e eliminar todo o resto.

   - Tu deves configurar a tua página de tradução baseada em todos os ficheiros na pasta `docs/` como um projeto de VitePress. (isto dito, p `package.json` é necessário).

   - Atualizar o histórico da git com a eliminação da pasta `.git` e então `git init`

3. Traduza a documentação.

   - Durante este estágio, podes estar a traduzir os documentos e sincronizar as atualizações ao mesmo tempo, mas não se preocupe com isto, é muito comum na contribuição com a tradução.

4. Envie as tuas consolidações para o teu repositório da GitHub. Tu podes configurar também uma pré-visualização da Netlify.
5. Use a ferramenta [Ryu-cho](https://github.com/vuejs-translations/ryu-cho) para configurar uma Ação de GitHub, rastreie automaticamente a atualização da documentação em Inglês depois.

Nós recomendamos conversar com os outros na Vite Land assim encontras mais colaboradores para o teu idioma para partilhar o trabalho de manutenção. Uma vez feita a tradução, comunique-a para equipa da Vite assim o repositório será movido para organização `vitejs` oficial na GitHub.
