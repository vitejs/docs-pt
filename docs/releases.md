# Lançamentos {#releases}

Os lançamentos da Vite seguem o [Versionamento Semântico](https://semver.org/). Tu podes ver a versão estável mais recente da Vite na [página do pacote de npm da Vite](https://www.npmjs.com/package/vite).

Um relatório de mudança completo dos lançamentos passados está [disponível na GitHub](https://github.com/vitejs/vite/blob/main/packages/vite/CHANGELOG.md).

:::tip NOTA
O próximo lançamento principal da Vite acontecerá depois do FIM DE VIDA da Node 16 em Setembro.

Consulte a [discussão a respeito da Vite 5](https://github.com/vitejs/vite/discussions/12466) para mais informações.
:::

## Ciclo de Lançamento {#release-cycle}

A Vite não tem um ciclo de lançamento fixo.

- Lançamentos de **remendo** são lançados quando necessário.
- Lançamentos **secundários** sempre contém novas funcionalidades e também são lançados quando necessários.
- Lançamentos **principais** geralmente alinham-se com a [agenda do FIM DE VIDA da Node.js](https://endoflife.date/nodejs), e serão anunciados com antecedência. Estes lançamentos passaram por uma fase de discussão prévia, e ambas fases de pré-lançamento alfa e beta.

Os anteriores versões principais de Vite continuarão a receber correções e remendos de segurança importantes. Depois disto, apenas receberiam atualizações se houverem razões de segurança. Nós recomendados atualizar a Vite regularmente. Consulte os [Guias de Migração](https://pt.vitejs.dev/guide/migration.html) quando atualizares para cada versão principal.

Os parceiros da equipa da Vite com projetos principais no ecossistema para testar as novas versões de Vite antes de serem lançadas através do [projeto vite-ecosystem-ci]. A maioria dos projetos usando a Vite deveriam ser capazes de rapidamente oferecer suporte ou migrar para as novas versões logo que forem lançadas.

## Casos Extremos de Versionamento Semântico {#semantic-versioning-edge-cases}

### Definições de TypeScript {#typescript-definitions}

Pode ser que entreguemos mudanças incompatíveis com as definições de TypeScript entre versões secundárias. Isto porque:

- Algumas vezes a própria TypeScript entrega mudanças incompatíveis entre versões secundárias, e podemos ter de ajustar os tipos para suportar versões mais novas da TypeScript.
- Ocasionalmente podemos precisar de adotar funcionalidades que apenas estão disponíveis numa versão mais recente da TypeScript, elevando a versão mínima obrigatória de TypeScript.
- Se estiveres a usar a TypeScript, podes usar um limite de versionamento semântico que tranca a atual versão secundária e atualizar manualmente quando uma nova versão secundária da Vite for lançada.

### esbuild {#esbuild}

A [esbuild](https://esbuild.github.io/) está na pré-1.0.0 e algumas vezes tem uma mudança de rutura que podemos precisar de incluir para ter acesso às novas funcionalidades e melhorias de desempenho. Nós podemos bater a versão da esbuild numa versão secundária da Vite.

### Versões Que Não Faz Parte do Suporte de Longo Prazo da Node.js {#node-js-non-lts-versions}

As versões que não fazem parte do suporte de longo prazo da Node.js (numerados com ímpares) não são testas como parte da integração continua da Vite, mas devem continuar a funcionar antes do [FIM DA SUA VIDA](https://endoflife.date/nodejs).

## Pré-Lançamentos {#pre-releases}

Os lançamentos secundários normalmente passam por um número não fixo de lançamentos beta. Os lançamentos principais passarão por uma fase alfa e uma fase beta.

Os pré-lançamentos permitem que os primeiros adotantes e gestores do ecossistema a fazer a integração e testes de estabilidade, e fornecer comentários. Não use os pré-lançamentos em produção. Todos os pré-lançamentos são considerados instáveis e podem entregar mudanças de rutura no meio. Sempre coloque as versões exatas quando usas pré-lançamentos.

## Depreciações {#deprecations}

Nós depreciamos periodicamente funcionalidades que tem sido substituídas por alternativas melhores nos lançamentos secundários. As funcionalidades depreciadas continuarão a funcionar com um aviso de tipo ou registado. Eles serão removidos no próximo lançamento primário depois de entrar no estado de depreciado. O [Guia de Migração](https://vitejs.dev/guide/migration.html) para cada lançamento primário listarão estas remoções e documentarão um caminho de atualizar para elas.

## Funcionalidades Experimentais {experimental-features}

Algumas funcionalidades são marcadas como experimentais quando lançadas numa versão estável da Vite. As funcionalidades experimentais permitem-nos reunir a experiência no mundo real para influenciar o seu desenho final. O objetivo é permitir os utilizadores fornecer comentários testando-as em produção. As próprias funcionalidades experimentais são consideradas instáveis, e apenas deveriam ser usadas de uma maneira controlada. Estas funcionalidades podem entre versões secundárias, então os utilizadores devem alfinetar suas versões de Vite quando dependem delas.
