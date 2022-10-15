# Desdobrando um Sítio Estático

Os seguintes guias são baseados em algumas suposições partilhadas:

- Tu estás utilizando a localização da saída da construção padrão (`dist`). Esta localização [pode ser mudada utilizando `build.outDir`](/config/build-options.md#build-outdir), e podes extrapolar as instruções destes guias neste caso.
- Tu estás utilizando o npm. Tu podes utilizar comandos equivalentes para executar os programas se estiveres utilizando o Yarn ou outro gestor de pacote.
- A Vite está instalada como uma dependência local no teu projeto, e configuraste os seguintes programas de npm:

```json
{
  "scripts": {
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

É importante notar que `vite preview` está destinado para a pré-visualização da construção localmente e não destinada como servidor de produção.

:::tip NOTA
Estes guias fornecem instruções para realização de um desdobramento estático do teu sítio de Vite. A Vite também suporta a Interpretação no Lado do Servidor (SSR, sigla em Inglês). A SSR refere-se as abstrações de front-end que suportam a execução da mesma aplicação em Node.js, pré-interpretando-a para HTML, e finalmente hidratando-a no cliente. Consulte o [Guia da SSR](./ssr) para aprender a respeito desta funcionalidade. Por outro lado, se estiveres procurando pela integração com abstrações de lado do servidor tradicionais, consulte o [Guia da Integração de Backend](./backend-integration).
:::

## Construindo a Aplicação

Tu podes executar o comando `npm run build` para construir a aplicação.

```bash
$ npm run build
```

Por padrão, a saída da construção será colocada no `dist`. Tu podes desdobrar esta pasta `dist` para quaisquer plataformas de tua preferência.

### Testando a Aplicação Localmente

Um vez que construiste a aplicação, podes testá-la localmente executando o comando `npm run preview`.

```bash
$ npm run build
$ npm run preview
```

O comando `vite preview` iniciará um servidor de web estático local que serve os ficheiros do `dist` no `http://localhost:4173`. É uma maneira fácil para verificar se a construção de produção parece bem no teu ambiente local.

Tu podes configurar a porta do servidor passando a bandeira `--port` como um argumento.

```json
{
  "scripts": {
    "preview": "vite preview --port 8080"
  }
}
```

Agora o comando `preview` lançará o servidor no `http://localhost:8080`.

## GitHub Pages

1. Defina a `base` correta no `vite.config.js`.

   Se estiveres desdobrando para `https://<USERNAME>.github.io/`, podes omitir a `base` porque ela padroniza para `'/'`.

   Se estiveres desdobrando para `https://<USERNAME>.github.io/<REPO>/`, por exemplo o teu repositório está em `https://github.com/<USERNAME>/<REPO>`, então defina a `base` para `'/<REPO>/'`.

2. Dentro do teu projeto, crie `deploy.sh` com o seguinte conteúdo (com as linhas destacadas apropriadamente descomentada), e execute-o para desdobrar:

   ```bash{16,24,27}
   #!/usr/bin/env sh

   # abortar em caso de erros
   set -e

   # construir
   npm run build

   # navegar para o diretório de saída da construção
   cd dist

   # colocar .nojekull para contornar o processamento do Jekyll
   echo > .nojekyll

   # Se estiveres desdobrando para um domínio personalizado
   # echo 'www.example.com' > CNAME

   git init
   git checkout -b main
   git add -A
   git commit -m 'deploy'

   # Se estiveres desdobrando para https://<USERNAME>.github.io
   # git push -f git@github.com:<USERNAME>/<USERNAME>.github.io.git main

   # Se estiveres desdobrando para https://<USERNAME>.github.io/<REPO>
   # git push -f git@github.com:<USERNAME>/<REPO>.git main:gh-pages

   cd -
   ```

::: tip
Tu também podes executar o programa acima na tua configuração do CI para ativar o desdobramento automático em cada empurrão.
:::

## GitLab Pages e GitLab CI

2. Defina a `base` correta no `vite.config.js`.

   Se estiveres desdobrando para `https://<USERNAME or GROUP>.gitlab.io/`, podes omitir a `base` porque ela padroniza para `'/'`.

   Se estiveres desdobrando para `https://<USERNAME or GROUP>.gitlab.io/<REPO>/`, por exemplo o teu repositório está em `https://gitlab.com/<USERNAME>/<REPO>`, então defina a `base` para `'/<REPO>/'`.

2. Cria um ficheiro chamado `.gitlab-ci.yml` na raiz do teu projeto com o conteúdo abaixo. Isto construirá e desdobrará o teu sítio sempre que fizeres mudanças ao teu conteúdo:

   ```yaml
   image: node:16.5.0
   pages:
     stage: deploy
     cache:
       key:
         files:
           - package-lock.json
         prefix: npm
       paths:
         - node_modules/
     script:
       - npm install
       - npm run build
       - cp -a dist/. public/
     artifacts:
       paths:
         - public
     rules:
       - if: $CI_COMMIT_BRANCH == $CI_DEFAULT_BRANCH
   ```

## Netlify

### Netlify CLI

1. Instale a [Linha de Comando da Netlify](https://cli.netlify.com/).
2. Cria um novo sítio utilizando o `ntl init`.
3. Desdobra utilizando `ntl deploy`.

```bash
# Instalar a Linha de Comando da Netlify
$ npm install -g netlify-cli

# Criar um novo sítio na Netlify
$ ntl init

# Desdobrar para uma URL de pré-visualização única.
$ ntl deploy
```

A Linha de Comando da Netlify partilhará contigo uma URL de pré-visualização para inspecionar. Quando estiveres pronto para avançar para produção, utilize a bandeira `prod`:

```bash
# Desdobrar o sítio para produção
$ ntl deploy --prod
```

### Netlify com Git

1. Empurre o teu código para um repositório de git (GitHub, GitLab, BitBucket, Azure DevOps).
2. [Importe o projeto](https://app.netlify.com/start) para a Netlify.
3. Escolha o ramo, diretório de saída, e configure as variáveis de ambiente se aplicável.
4. Clique sobre **Deploy (Desdobrar)**
5. A tua aplicação de Vite está desdobrada!

Após o teu projeto ter sido importado e desdobrado, todos os empurrões subsequentes para outros ramos que não o ramo de produção juntamente com requisições de puxão ("pull requests") gerarão os [Desdobramentos de Pré-Visualização](https://docs.netlify.com/site-deploys/deploy-previews/), e todas as mudanças feitas para o Ramo de Produção (comummente “main”) resultará num [Desdobramento de Produção](https://docs.netlify.com/site-deploys/overview/#definitions).

## Vercel

### Vercel CLI

1. Instale a [Linha de Comando da Vercel](https://vercel.com/cli) e execute `vercel` para desdobrar.
2. A Vercel detetará que estás utilizando a Vite e ativará as definições corretas para o teu desdobramento.
3. A tua aplicação está desdobrada! (por exemplo, [vite-vue-template.vercel.app](https://vite-vue-template.vercel.app/)).

```bash
$ npm i -g vercel
$ vercel init vite
Vercel CLI
> Success! Initialized "vite" example in ~/your-folder.
- To deploy, `cd vite` and run `vercel`.
```

### Vercel com Git

1. Empurre o teu código para o teu repositório de git (GitHub, GitLab, Bitbucket).
2. [Importe o teu projeto de Vite](https://vercel.com/new) para a Vercel.
3. A Vercel detetará que estás utilizando a Vite e ativará as definições corretas para o teu desdobramento.
4. A tua aplicação está desdobrada! (por exemplo, [vite-vue-template.vercel.app](https://vite-vue-template.vercel.app/))

Após o teu projeto ter sido importado e desdobrado, todos os empurrões subsequentes para outros ramos que não o ramo de produção juntamente com requisições de puxão ("pull requests") gerarão os [Desdobramentos de Pré-Visualização](https://vercel.com/docs/concepts/deployments/environments#preview), e todas as mudanças feitas para o Ramo de Produção (comummente “main”) resultará num [Desdobramento de Produção](https://vercel.com/docs/concepts/deployments/environments#production).

Aprenda mais a respeito da [Integração de Git](https://vercel.com/docs/concepts/git) da Vercel.

## Cloudflare Pages

### Cloudflare Pages via Wrangler

1. Instale a [Linha de Comando Wrangler](https://developers.cloudflare.com/workers/wrangler/get-started/).
2. Autentica a Wrangler com a tua conta da Cloudflare utilizando `wrangler login`.
3. Executa o teu comando de construção.
4. Desdobra utilizando `npx wrangler pages publish dist`.

```bash
# Instalar a Linha de Comando Wrangler
$ npm install -g wrangler

# Iniciar sessão da conta da Cloudflare
# a partir da Linha de Comando
$ wrangler login

# Executar o teu comando de construção
$ npm run build

# Criar novo desdobramento
$ npx wrangler pages publish dist
```

Após os teus recursos serem carregados, a Wrangler dar-te-á uma URL de pré-visualização para inspecionar o teu sítio. Quando entrares no painel de controlo da Cloudflare Pages, verás o teu novo projeto.

### Cloudflare Pages com Git

1. Empurre o teu código para o teu repositório (GitHub, GitLab).
2. Entre no painel de controlo da Cloudflare e selecione a tua conta em **Account Home (Casa da Conta)** > **Pages (Páginas)**.
3. Selecione **Create a new Project (Criar um novo Projeto)** e a opção **Connect Git (Conectar a Git)**.
4. Selecione o projeto de git que queres desdobrar e clique em **Begin setup (Iniciar a configuração)**.
5. Selecione a configuração da abstração correspondente nas definições da construção dependendo da abstração de Vite que selecionaste.
6. Depois guarde e desdobre!
7. A tua aplicação está desdobrada! (por exemplo, `https://<PROJECTNAME>.pages.dev/`)

Após o teu projeto ter sido importado e desdobrado, todos os empurrões subsequentes para os ramos gerarão [Desdobramentos de Pré-Visualização](https://developers.cloudflare.com/pages/platform/preview-deployments/) a menos que seja especificado para não o fazer nos teus [controlos da construção do ramo](https://developers.cloudflare.com/pages/platform/branch-build-controls/). Todas as mudanças para o Ramo de Produção (comummente “main”) resultarão em um Desdobramento de Produção.

Tu também podes adicionar domínios personalizados e manipular as definições da construção personalizada na Pages. Aprenda mais a respeito da [Integração de Git da Cloudflare Pages](https://developers.cloudflare.com/pages/get-started/#manage-your-site).

## Google Firebase

1. Certifica-te de que tens a [firebase-tools](https://www.npmjs.com/package/firebase-tools) instalada.

2. Crie o `firebase.json` e o `.firebaserc` na raiz do teu projeto com o seguinte conteúdo:

   `firebase.json`:

   ```json
   {
     "hosting": {
       "public": "dist",
       "ignore": [],
       "rewrites": [
         {
           "source": "**",
           "destination": "/index.html"
         }
       ]
     }
   }
   ```

   `.firebaserc`:

   ```js
   {
     "projects": {
       "default": "<YOUR_FIREBASE_ID>"
     }
   }
   ```

3. Após executares `npm run build`, desdobre utilizando o comando `firebase deploy`.

## Surge

1. Primeiro instale a [surge](https://www.npmjs.com/package/surge), se já não a tiveres instalada.

2. Execute `npm run build`.

3. Desdobre para surge digitando `surge dist`.

Tu também podes desdobrar para um [domínio personalizado](http://surge.sh/help/adding-a-custom-domain) adicionado `surge dist yourdomain.com`.

## Azure Static Web Apps

Tu podes desdobrar rapidamente a tua aplicação de Vite com o serviço de [Aplicações de Web Estáticas](https://aka.ms/staticwebapps) da Microsoft Azure. Tu precisas:

- De uma conta Azure e de uma chave de subscrição. Tu podes criar uma [conta Azure gratuita aqui](https://azure.microsoft.com/free).
- Que o código da tua aplicação seja empurrado para [GitHub](https://github.com).
- Da [Extensão SWA](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurestaticwebapps) no [Visual Studio Code](https://code.visualstudio.com).

Instale a extensão no VS Code e navegar para a raiz da tua aplicação. Abrir a extensão Static Web Apps, registar-se na Azure, e clicar no sinal '+' para criar uma nova Aplicação de Web Estática. Tu serás levado a designar qual chave de subscrição utilizar.

Siga o assistente ("wizard" ou "feiticeiro" se preferires) iniciado pela extensão para dares um nome a tua aplicação, escolher uma configuração de abstração, e designar a raiz da aplicação (normalmente `/`) e a localização do ficheiro construído `/dist`. O assistente ("wizard" ou "feiticeiro" se preferires) executará e criará uma ação de GitHub no teu repositório numa pasta `.github`.

A ação trabalhará para desdobrar a tua aplicação (observe o seu progresso na aba Ações (Actions, em Inglês) do teu repositório) e, quando terminada com sucesso, podes visualizar a tua aplicação no endereço fornecido na janela de progresso da extensão clicando no botão 'Olhar o Sítio (Browse Website, em Inglês)' que aparece quando a ação de GitHub executa.

## Render

Tu podes desdobrar a tua aplicação de Vite como um Sítio Estático na [Render](https://render.com/).

1. Crie uma [conta Render](https://dashboard.render.com/register).

2. No [Painel de Controlo](https://dashboard.render.com/), clique no botão **Novo (New, em Inglês)** e selecione o **Sítio Estático (Static Site, em Inglês)**.

3. Conecte a tua conta GitHub/GitLab ou utilize um repositório público.

4. Especifique um nome de projeto e o ramo.

   - **Comando de Construção (Build Command, em Inglês)**: `npm run build`
   - **Diretório de Publicação (Publish Directory, em Inglês)**: `dist`

5. Clique em **Criar Sítio Estático (Create Static Site, em Inglês)**

   A tua aplicação deveria ser desdobrada em `https://<PROJECTNAME>.onrender.com/`.

Por padrão, qualquer nova consolidação empurrada para o ramo especificado acionará automaticamente um novo desdobramento.
O [Desdobrar Automaticamente (Auto-Deploy, em Inglês)](https://render.com/docs/deploys#toggling-auto-deploy-for-a-service) pode ser configurado nas definições do projeto.

Tu também podes adicionar um [domínio personalizado](https://render.com/docs/custom-domains) ao teu projeto.
