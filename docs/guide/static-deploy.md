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

1. Instala a [Linha de Comando da Netlify](https://cli.netlify.com/).
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

### Netlify with Git

1. Push your code to a git repository (GitHub, GitLab, BitBucket, Azure DevOps).
2. [Import the project](https://app.netlify.com/start) to Netlify.
3. Choose the branch, output directory, and set up environment variables if applicable.
4. Click on **Deploy**.
5. Your Vite app is deployed!

After your project has been imported and deployed, all subsequent pushes to branches other than the production branch along with pull requests will generate [Preview Deployments](https://docs.netlify.com/site-deploys/deploy-previews/), and all changes made to the Production Branch (commonly “main”) will result in a [Production Deployment](https://docs.netlify.com/site-deploys/overview/#definitions).

## Vercel

### Vercel CLI

1. Install the [Vercel CLI](https://vercel.com/cli) and run `vercel` to deploy.
2. Vercel will detect that you are using Vite and will enable the correct settings for your deployment.
3. Your application is deployed! (e.g. [vite-vue-template.vercel.app](https://vite-vue-template.vercel.app/))

```bash
$ npm i -g vercel
$ vercel init vite
Vercel CLI
> Success! Initialized "vite" example in ~/your-folder.
- To deploy, `cd vite` and run `vercel`.
```

### Vercel for Git

1. Push your code to your git repository (GitHub, GitLab, Bitbucket).
2. [Import your Vite project](https://vercel.com/new) into Vercel.
3. Vercel will detect that you are using Vite and will enable the correct settings for your deployment.
4. Your application is deployed! (e.g. [vite-vue-template.vercel.app](https://vite-vue-template.vercel.app/))

After your project has been imported and deployed, all subsequent pushes to branches will generate [Preview Deployments](https://vercel.com/docs/concepts/deployments/environments#preview), and all changes made to the Production Branch (commonly “main”) will result in a [Production Deployment](https://vercel.com/docs/concepts/deployments/environments#production).

Learn more about Vercel’s [Git Integration](https://vercel.com/docs/concepts/git).

## Cloudflare Pages

### Cloudflare Pages via Wrangler

1. Install [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/get-started/).
2. Authenticate Wrangler with your Cloudflare account using `wrangler login`.
3. Run your build command.
4. Deploy using `npx wrangler pages publish dist`.

```bash
# Install Wrangler CLI
$ npm install -g wrangler

# Login to Cloudflare account from CLI
$ wrangler login

# Run your build command
$ npm run build

# Create new deployment
$ npx wrangler pages publish dist
```

After your assets are uploaded, Wrangler will give you a preview URL to inspect your site. When you log into the Cloudflare Pages dashboard, you will see your new project.

### Cloudflare Pages with Git

1. Push your code to your git repository (GitHub, GitLab).
2. Log in to the Cloudflare dashboard and select your account in **Account Home** > **Pages**.
3. Select **Create a new Project** and the **Connect Git** option.
4. Select the git project you want to deploy and click **Begin setup**
5. Select the corresponding framework preset in the build setting depending on the Vite framework you have selected.
6. Then save and deploy!
7. Your application is deployed! (e.g `https://<PROJECTNAME>.pages.dev/`)

After your project has been imported and deployed, all subsequent pushes to branches will generate [Preview Deployments](https://developers.cloudflare.com/pages/platform/preview-deployments/) unless specified not to in your [branch build controls](https://developers.cloudflare.com/pages/platform/branch-build-controls/). All changes to the Production Branch (commonly “main”) will result in a Production Deployment.

You can also add custom domains and handle custom build settings on Pages. Learn more about [Cloudflare Pages Git Integration](https://developers.cloudflare.com/pages/get-started/#manage-your-site).

## Google Firebase

1. Make sure you have [firebase-tools](https://www.npmjs.com/package/firebase-tools) installed.

2. Create `firebase.json` and `.firebaserc` at the root of your project with the following content:

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

3. After running `npm run build`, deploy using the command `firebase deploy`.

## Surge

1. First install [surge](https://www.npmjs.com/package/surge), if you haven’t already.

2. Run `npm run build`.

3. Deploy to surge by typing `surge dist`.

You can also deploy to a [custom domain](http://surge.sh/help/adding-a-custom-domain) by adding `surge dist yourdomain.com`.

## Azure Static Web Apps

You can quickly deploy your Vite app with Microsoft Azure [Static Web Apps](https://aka.ms/staticwebapps) service. You need:

- An Azure account and a subscription key. You can create a [free Azure account here](https://azure.microsoft.com/free).
- Your app code pushed to [GitHub](https://github.com).
- The [SWA Extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurestaticwebapps) in [Visual Studio Code](https://code.visualstudio.com).

Install the extension in VS Code and navigate to your app root. Open the Static Web Apps extension, sign in to Azure, and click the '+' sign to create a new Static Web App. You will be prompted to designate which subscription key to use.

Follow the wizard started by the extension to give your app a name, choose a framework preset, and designate the app root (usually `/`) and built file location `/dist`. The wizard will run and will create a GitHub action in your repo in a `.github` folder.

The action will work to deploy your app (watch its progress in your repo's Actions tab) and, when successfully completed, you can view your app in the address provided in the extension's progress window by clicking the 'Browse Website' button that appears when the GitHub action has run.

## Render

You can deploy your Vite app as a Static Site on [Render](https://render.com/).

1. Create a [Render account](https://dashboard.render.com/register).

2. In the [Dashboard](https://dashboard.render.com/), click the **New** button and select **Static Site**.

3. Connect your GitHub/GitLab account or use a public repository.

4. Specify a project name and branch.

   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`

5. Click **Create Static Site**.

   Your app should be deployed at `https://<PROJECTNAME>.onrender.com/`.

By default, any new commit pushed to the specified branch will automatically trigger a new deployment. [Auto-Deploy](https://render.com/docs/deploys#toggling-auto-deploy-for-a-service) can be configured in the project settings.

You can also add a [custom domain](https://render.com/docs/custom-domains) to your project.
