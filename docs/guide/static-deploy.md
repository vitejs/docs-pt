# Implantação duma Aplicação Estática {#deploying-a-static-site}

As seguintes orientações são baseadas em algumas suposições partilhadas:

- Nós estamos usando a localização da saída da construção padrão (`dist`). Esta localização [pode ser mudada usando `build.outDir`](/config/build-options#build-outdir), e podemos extrapolar as instruções a partir destas orientações neste caso.
- Nós estamos usando o npm. Nós podemos usar os comandos equivalentes para executar os programas se estivermos usando Yarn ou outros gestores de pacote.
- A Vite é instalada como uma dependência local no nosso projeto, e temos configurado os seguintes programas de npm:

```json
{
  "scripts": {
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

É importante notar que o comando `vite preview` está destinado para pré-visualizar a construção localmente e não está destinado a servir como um servidor de produção.

:::tip NOTA
Estas orientações fornecem instruções para realizar uma implementação estática da nossa aplicação de Vite. A Vite também suporta interpretação do lado do servidor. A interpretação do lado do servidor refere-se às abstrações de front-end que suportam executar a mesma aplicação na Node.js, pré-interpretando-a à HTML, e finalmente hidratando-a no cliente. Consulte o [Guia da Interpretação do Lado do Cliente](./ssr) para aprender sobre esta funcionalidade. Por outro lado, se estivermos procurando pela integração com as abstrações do lado do servidor tradicionais, devemos consultar o [Guia da Integração do Backend](./backend-integration).
:::

## Construindo a Aplicação {#building-the-app}

Nós podemos executar o comando `npm run build` para construir a aplicação:

```bash
$ npm run build
```

Por padrão, a saída da construção será colocada no diretório `dist`. Nós podemos servir esta pasta `dist` em produção em quaisquer plataformas de nossa preferência.

### Testando a Aplicação Localmente {#testing-the-app-locally}

Assim que construirmos a aplicação, podemos testá-la localmente executando o comando `npm run preview`:

```bash
$ npm run build
$ npm run preview
```

O comando `vite preview` iniciará um servidor da Web estático localmente que serve os ficheiros do diretório `dist` na `http://localhost:4173`. É uma maneira fácil de verificar se a construção de produção funciona corretamente no nosso ambiente local.

Nós podemos configurar a porta do servidor passando a opção `--port` como argumento:

```json
{
  "scripts": {
    "preview": "vite preview --port 8080"
  }
}
```

Agora o comando `preview` lançará o servidor na `http://localhost:8080`.

## GitHub Pages  {#github-pages}

1. Definimos a `base` correta no `vite.config.js`.

   Se estivermos implementando na `https://<USERNAME>.github.io/`, ou num domínio personalizado através da GitHub Pages (por exemplo, `www.example.com`), definimos a `base` para `'/'`. Alternativamente, podemos remover `base` da configuração, já que esta predefine para `'/'`.

   Se estivermos implementando na `https://<USERNAME>.github.io/<REPO>/` (por exemplo, o nosso repositório está em `https://github.com/<USERNAME>/<REPO>`), então definimos a `base` para `'/<REPO>/'`.

2. Vamos para a configuração da nossa GitHub Pages na página de definições (ou configurações) do repositório e escolhemos a fonte da implementação como "GitHub Actions", isto levar-nos-á à criar um fluxo de trabalho que constrói e implementa o nosso projeto, um fluxo de trabalho de exemplo que instala as dependências e constrói o projeto usando o npm é fornecido:

   ```yml
   # Fluxo de trabalho simples para implantar
   # conteúdo estático na GitHub Pages
   name: Deploy static content to Pages

   on:
     # Executa sobre as atualizações mirando o ramo padrão
     push:
       branches: ['main']

     # Permite-nos executar este fluxo de trabalho manualmente
     # a partir da aba de Ações (ou `Actions`)
     workflow_dispatch:

   # Define as permissões do GITHUB_TOKEN para permitir
   # a implementação na GitHub Pages
   permissions:
     contents: read
     pages: write
     id-token: write

   # Permitir uma implementação simultânea
   concurrency:
     group: 'pages'
     cancel-in-progress: true

   jobs:
     # Único trabalho de implementação
     # uma vez que apenas estamos implementando
     deploy:
       environment:
         name: github-pages
         url: ${{ steps.deployment.outputs.page_url }}
       runs-on: ubuntu-latest
       steps:
         - name: Checkout
           uses: actions/checkout@v4
         - name: Set up Node
           uses: actions/setup-node@v4
           with:
             node-version: 20
             cache: 'npm'
         - name: Install dependencies
           run: npm ci
         - name: Build
           run: npm run build
         - name: Setup Pages
           uses: actions/configure-pages@v4
         - name: Upload artifact
           uses: actions/upload-pages-artifact@v3
           with:
             # Carregar a pasta de distribuição
             path: './dist'
         - name: Deploy to GitHub Pages
           id: deployment
           uses: actions/deploy-pages@v4
   ```

## GitLab Pages e GitLab CI {#gitlab-pages-and-gitlab-ci}

1. Definimos a `base` correta no `vite.config.js`.

   Se estivermos implementando na `https://<USERNAME or GROUP>.gitlab.io/`, podemos omitir a `base`, já que esta predefine para `'/'`.

   Se estivermos implementando na `https://<USERNAME or GROUP>.gitlab.io/<REPO>/`, por exemplo o nosso repositório está em `https://gitlab.com/<USERNAME>/<REPO>`, então definimos a `base` para `'/<REPO>/'`.

2. Críamos um ficheiro chamado `.gitlab-ci.yml` na raiz do nosso projeto com o conteúdo abaixo. Isto construirá e implementará a nossa aplicação sempre que fizermos mudanças no nosso conteúdo:

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

## Netlify {#netlify}

### Netlify CLI {#netlify-cli}

1. Instalamos a [Interface da Linha de Comando da Netlify](https://cli.netlify.com/).
2. Críamos uma nova aplicação usando `ntl init`.
3. Implantamos usando `ntl deploy`:

```bash
# Instalar a Interface da Linha de Comando da Netlify
$ npm install -g netlify-cli

# Criar uma nova aplicação na Netlify
$ ntl init

# Implementar numa única URL de pré-visualização
$ ntl deploy
```

A interface da linha de comando da Netlify partilhará connosco uma URL de pré-visualização para inspecionar. Quando estivermos pronto para avançarmos para produção, usamos a opção `prod`:

```bash
# Implementar a aplicação em produção
$ ntl deploy --prod
```

### Netlify com a Git {#netlify-with-git}

1. A tua aplicação de Vite está desdobrada!
2. Empurramos o nosso código para um repositório de Git (GitHub, GitLab, BitBucket, Azure DevOps).
3. [Importamos o projeto](https://app.netlify.com/start) na Netlify.
4. Escolhemos o ramo, diretório de saída, e definimos as variáveis de ambiente se aplicável.
5. Clicamos sobre **Implementar (ou _Deploy_)**

Depois do nosso projeto ter sido importado e implementado, todas as atualizações (ou pushes) subsequentes aos outros ramos que não são o de produção juntamente com os pedidos de atualização (ou pull requests) gerarão as [implementações de pré-visualização](https://docs.netlify.com/site-deploys/deploy-previews/), e todas as mudanças feitas ao ramo de produção (comummente “main”) resultarão numa [implementação de produção](https://docs.netlify.com/site-deploys/overview/#definitions).

## Vercel {#vercel}

### Vercel CLI {#vercel-cli}

1. Instalamos a [Interface da Linha de Comando da Vercel](https://vercel.com/cli) e executamos `vercel` para implantar.
2. A Vercel detetará que estamos usando a Vite e ativará as definições (ou configurações) corretas para a nossa implementação.
3. A aplicação está implementada! (por exemplo, [vite-vue-template.vercel.app](https://vite-vue-template.vercel.app/)):

```bash
$ npm i -g vercel
$ vercel init vite
Vercel CLI
> Success! Initialized "vite" example in ~/your-folder.
- To deploy, `cd vite` and run `vercel`.
```

### Vercel com a Git {#vercel-for-git}

1. Empurramos o nosso código ao nosso repositório de Git (GitHub, GitLab, BitBucket).
2. [Importamos o nosso projeto de Vite](https://vercel.com/new) na Vercel.
3. A Vercel detetará que estamos usando a Vite e ativará as definições (ou configurações) corretas para a nossa implementação
4. A nossa aplicação está implementada! (por exemplo, [vite-vue-template.vercel.app](https://vite-vue-template.vercel.app/))

Depois do nosso projeto ter sido importado e implementado, todas as atualizações subsequentes (ou pushes) aos ramos gerarão [implementações de pré-visualização](https://vercel.com/docs/concepts/deployments/environments#preview), e todas as mudanças feitas ao ramo de produção (comummente “main”) resultarão numa [implementação de produção](https://vercel.com/docs/concepts/deployments/environments#production).

Aprenda mais a respeito da [Integração de Git](https://vercel.com/docs/concepts/git) da Vercel.

## Cloudflare Pages {#cloudflare-pages}

### Cloudflare Pages através da Wrangler {#cloudflare-pages-via-wrangler}

1. Instalamos a [Interface da Linha de Comando da Wrangler](https://developers.cloudflare.com/workers/wrangler/get-started/).
2. Autenticamos a Wrangler com a nossa conta da Cloudflare usando `wrangler login`.
3. Executamos o nosso comando de construção.
4. Implantamos usando `npx wrangler pages deploy dist`.

```bash
# Instalar a interface da linha de comando da Wrangler
$ npm install -g wrangler

# Iniciar sessão da conta da Cloudflare
# a partir da interface da linha de comando
$ wrangler login

# Executar o nosso comando de construção
$ npm run build

# Criar nova implementação
$ npx wrangler pages deploy dist
```

Depois dos nossos recursos estiverem carregados, a Wrangler dar-nos-á uma URL de pré-visualização para inspecionar a nossa aplicação. Quando entrarmos no painel de controlo da Cloudflare Pages, veremos o nosso novo projeto.

### Cloudflare Pages com a Git {#cloudflare-pages-with-git}

1. Empurramos o nosso código ao nosso repositório (GitHub, GitLab).
2. Entramos no painel de controlo da Cloudflare e selecionamos a nossa conta em **Página Inicial da Conta (ou _Account Home_)** > **Páginas (ou _Pages_)**.
3. Selecionamos **Criar um novo Projeto (ou _Create a new Project_)** e a opção **Conectar Git (ou _Connect Git_)**.
4. Selecionamos o projeto de Git que queremos implantar e clicamos em **Iniciar configuração (ou _Begin setup_)**.
5. Selecionamos pré-definição (ou pré-configuração) da abstração correspondente nas definições (ou configurações) de construção dependendo da abstração de Vite que selecionamos.
6. Depois guardamos e implementamos!
7. A nossa aplicação está implementada! (por exemplo, `https://<PROJECTNAME>.pages.dev/`)

Depois do nosso projeto ter sido importado e implementado, todas as atualizações subsequentes (pushes) aos ramos gerarão [implementações de pré-visualização](https://developers.cloudflare.com/pages/platform/preview-deployments/) a menos que seja especificado para não o fazer nos nossos [controlos de construção do ramo](https://developers.cloudflare.com/pages/platform/branch-build-controls/). Todas as mudanças ao ramo de produção (comummente “main”) resultarão numa implementação de produção.

Nós também podemos adicionar domínios personalizados e manipular as definições (ou configurações) na Pages. Saiba mais sobre a [Integração de Git da Cloudflare Pages](https://developers.cloudflare.com/pages/get-started/#manage-your-site).

## Google Firebase {#google-firebase}

1. Certificamos-nos de que temos a [`firebase-tools`](https://www.npmjs.com/package/firebase-tools) instalada.

2. Críamos o `firebase.json` e o `.firebaserc` na raiz do nosso projeto com o seguinte conteúdo:

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

3. Depois de executarmos `npm run build`, implementamos usando o comando `firebase deploy`.

## Surge {#surge}

1. Instalamos a [`surge`](https://www.npmjs.com/package/surge), se já não estiver instalada.

2. Executamos `npm run build`.

3. Implantamos à surge digitando `surge dist`.

Nós também podemos implantar para um [domínio personalizado](http://surge.sh/help/adding-a-custom-domain) adicionando `surge dist yourdomain.com`.

## Azure Static Web Apps {#azure-static-web-apps}

Nós podemos implantar rapidamente a nossa aplicação de Vite com o serviço de [Aplicações da Web Estáticas](https://aka.ms/staticwebapps) da Microsoft Azure. Nós precisamos:

- Duma conta da Azure e uma chave de subscrição. Nós podemos criar uma [conta gratuita da Azure nesta ligação](https://azure.microsoft.com/free).
- Que o código da nossa aplicação seja empurrado à [GitHub](https://github.com).
- Da [extensão SWA](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurestaticwebapps) no [Visual Studio Code](https://code.visualstudio.com).

Instalamos a extensão no VS Code e navegamos à raiz da nossa aplicação. Abrimos a extensão **Static Web Apps**, iniciamos a sessão na Azure, clicamos no sinal de '+' para criar uma nova Aplicação de Web Estática. Ser-nos-á pedido que designemos a chave de subscrição a usar.

Seguimos o assistente (ou wizard ou feiticeiro se preferirmos) iniciado pela extensão para darmos um nome à nossa aplicação, escolhemos uma pré-definição (ou pré-configuração) de abstração, e designamos a raiz da aplicação (normalmente `/`) e a localização do ficheiro construído `/dist`. O assistente executará e criará uma ação de GitHub no nosso repositório numa pasta `.github`.

A ação trabalhará para implantar a nossa aplicação (observamos o seu progresso na aba Ações (ou Actions)) e, quando concluída com sucesso, podemos visualizar a nossa aplicação no endereço fornecido na janela de progresso da extensão clicando no botão 'Olhar Aplicação' (ou 'Browse Website') que aparece quando a ação de GitHub é executada.

## Render {#render}

Nós podemos implantar a nossa aplicação de Vite como uma Aplicação Estática na [Render](https://render.com/):

1. Críamos uma [conta da Render](https://dashboard.render.com/register).

2. No [painel de controlo](https://dashboard.render.com/), clicamos no botão **Novo (ou _New_)** e selecionamos **Aplicação Estática (ou _Static Site_)**.

3. Conectamos a nossa conta da GitHub ou GitLab, ou usamos um repositório público.

4. Especificamos um nome de projeto e o ramo:

   - **Comando de Construção (ou _Build Command_)**: `npm run build`
   - **Diretório de Publicação (_Publish Directory_)**: `dist`

5. Clicamos em **Criar Aplicação Estática (_Create Static Site_)**:

   A nossa aplicação deve ser implementada na `https://<PROJECTNAME>.onrender.com/`.

Por padrão, qualquer nova atualização empurrada ao ramo especificado acionará automaticamente uma nova implementação. A [Implementação Automática (ou Auto-Deploy)](https://render.com/docs/deploys#toggling-auto-deploy-for-a-service) pode ser configurada nas definições (ou configurações) deo projeto.

Nós também podemos adicionar um [domínio personalizado](https://render.com/docs/custom-domains) ao nosso projeto.

<!--
  NOTE: The sections below are reserved for more deployment platforms not listed above.
  Feel free to submit a PR that adds a new section with a link to your platform's
  deployment guide, as long as it meets these criteria:
  1. Users should be able to deploy their site for free.
  2. Free tier offerings should host the site indefinitely and are not time-bound.
     Offering a limited number of computation resource or site counts in exchange is fine.
  3. The linked guides should not contain any malicious content.
  The Vite team may change the criteria and audit the current list from time to time.
  If a section is removed, we will ping the original PR authors before doing so.
-->

## Flightcontrol {#flightcontrol}

Implantamos a nossa aplicação estática usando a [Flightcontrol](https://www.flightcontrol.dev/?ref=docs-vite), seguindo estas [instruções](https://www.flightcontrol.dev/docs/reference/examples/vite?ref=docs-vite).

## Hospedagem da AWS Amplify {#aws-amplify-hosting}

Implantamos a nossa aplicação estática usando a [Hospedagem da AWS Amplify](https://aws.amazon.com/amplify/hosting/), seguindo estas [instruções](https://docs.amplify.aws/guides/hosting/vite/q/platform/js/).

## Hospedagem de Aplicação Estática da Kinsta {#kinsta-static-site-hosting}

Implantamos a nossa aplicação estática usando [Kinsta](https://kinsta.com/static-site-hosting/) seguindo estas [instruções](https://kinsta.com/docs/react-vite-example/).

## Hospedagem de Aplicação Estática da xmit {#xmit-static-site-hosting}

Implantamos a nossa aplicação estática usando [xmit](https://xmit.co) seguindo este [guia](https://xmit.dev/posts/vite-quickstart/).
