# Lançamentos {#releases}

Os lançamentos da Vite seguem o [Padrão de Definição de Versão Semântica](https://semver.org/). Podemos ver a versão estável mais recente da Vite na [página do pacote de npm da Vite](https://www.npmjs.com/package/vite).

Um relatório completo de mudanças dos lançamentos passados encontra-se [disponível na GitHub](https://github.com/vitejs/vite/blob/main/packages/vite/CHANGELOG.md).

## Ciclo de Lançamento {#release-cycle}

A Vite não tem um ciclo de lançamento fixo.

- **Remendo**: estes lançamentos são realizados quando necessário (normalmente todas as semanas).
- **Secundários**: estes lançamentos sempre contêm novas funcionalidades e também são realizados quando necessários. Os lançamentos secundários sempre terão uma fase de pré-lançamento beta (normalmente todos os meses).
- **Principais**: estes lançamentos geralmente alinham-se com a [agenda do FIM DA VIDA da Node.js](https://endoflife.date/nodejs), e serão anunciados com antecedência. Estes lançamentos passaram por discussões de longo prazo com o ecossistema, e terão fases de pré-lançamentos alfa e beta (normalmente todos os anos).

Os intervalos de versões da Vite que são suportados pela equipa da Vite são automaticamente determinados por:

- Pela **atual versão secundária** que recebe correções regulares.
- Pela **anterior versão primária** (apenas para suas versões secundárias mais recentes) e a **anterior versão secundária** que recebem correções e remendos de segurança importantes.
- Pela **penúltima versão primária** (apenas para suas versões secundárias mais recentes) e a **penúltima versão secundária** que recebem remendos de segurança.
- Todas as versões anteriores a estas já não são suportadas.

Como um exemplo, se a versão mais recente da Vite estiver na 5.3.10:

- Os remendos regulares são lançados por `vite@5.3`.
- As correções e remendos de segurança importantes são aplicados a `vite@4` e `vite@5.2`.
- Os remendos de segurança também são aplicados a `vite@3`, e `vite@5.1`.
- A `vite@2` e `vite@5.0` já não são suportados. Os utilizadores devem atualizar para receberem atualizações.

Recomendamos atualizar a Vite regularmente. Podemos consultar o [Guia de Migração](/guide/migration) quando atualizarmos para cada versão primária. A equipa da Vite trabalha em estreita colaboração com os principais projetos do ecossistema para garantir a qualidade das novas versões. Testamos as novas versões da Vite antes de as lançarmos através do projeto [`vite-ecosystem-ci`](https://github.com/vitejs/vite-ecosystem-ci). A maioria dos projetos que utilizam a Vite devem ser capazes de oferecer rapidamente suporte ou migrar para novas versões assim que estas forem lançadas.

## Casos Extremos do Padrão da Definição de Versão Semântica {#semantic-versioning-edge-cases}

### Definições de TypeScript {#typescript-definitions}

Nós podemos entregar mudanças incompatíveis às definições de TypeScript entre versões secundárias. Isto porque:

- Algumas vezes a própria TypeScript entrega mudanças incompatíveis entre versões secundárias, e podemos ter de ajustar os tipos para suportarem as versões mais recentes da TypeScript.
- Ocasionalmente podemos precisar de adotar as funcionalidades que apenas estão disponíveis numa versão mais recente da TypeScript, aumentando a versão obrigatória mínima da TypeScript.
- Se estivermos a usar a TypeScript, podemos usar um limite do padrão de definição de versão semântica que fecha a versão secundária atual e atualizar manualmente quando uma nova versão secundária da Vite for lançada.

### `esbuild` {#esbuild}

A [`esbuild`](https://esbuild.github.io/) está na versão pré-1.0.0 e algumas vezes tem uma mudança de rutura que podemos precisar de incluir para ter acesso às funcionalidades mais recentes e melhorias do desempenho. Nós podemos bater a versão da `esbuild` numa versão secundária da Vite.

### Versões Que Não Fazem Parte do Suporte de Longo Prazo da Node.js {#node-js-non-lts-versions}

As versões que não fazem parte do suporte de longo prazo da Node.js (versões numeradas com ímpares) não são testas como parte da integração continua da Vite, mas devem continuar a funcionar antes do [FIM DA SUA EXPECTATIVA DE VIDA](https://endoflife.date/nodejs).

## Pré-Lançamentos {#pre-releases}

Os lançamentos secundários normalmente passam por um número não fixo de lançamentos beta. Os lançamentos principais passarão por uma fase alfa e uma fase beta.

Os pré-lançamentos permitem que os primeiros adotantes e responsáveis do ecossistema fazerem a integração e testes de estabilidade, e fornecer comentários. Não use os pré-lançamentos em produção. Todos os pré-lançamentos são considerados instáveis e podem entregar mudanças de rutura no meio. Sempre devemos colocar as versões exatas quando usamos pré-lançamentos.

## Depreciações {#deprecations}

Nós depreciamos periodicamente funcionalidades que tem sido substituídas por alternativas melhores nos lançamentos secundários. As funcionalidades depreciadas continuarão a funcionar com um aviso de tipo ou um aviso registado. Elas serão removidas no próximo lançamento primário depois de entrarem no estado de depreciado. O [Guia de Migração](/guide/migration) para cada lançamento primário listará estas remoções e documentará um caminho de atualização para as mesmas.

## Funcionalidades Experimentais {#experimental-features}

Algumas funcionalidades são marcadas como experimentais quando lançadas numa versão estável da Vite. As funcionalidades experimentais permitem-nos reunir a experiência no mundo real para influenciar o seu desenho final. O objetivo é permitir que os utilizadores forneçam comentários testando-as em produção. As próprias funcionalidades experimentais são consideradas instáveis, e apenas deveriam ser usadas duma maneira controlada. Estas funcionalidades podem mudar entre versões secundárias, então os utilizadores devem fixar suas versões da Vite quando dependem delas. Nós criaremos [uma discussão da GitHub](https://github.com/vitejs/vite/discussions/categories/feedback?discussions_q=is%3Aopen+label%3Aexperimental+category%3AFeedback) para cada funcionalidade experimental.
