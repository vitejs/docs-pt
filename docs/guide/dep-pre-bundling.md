# Pré-Empacotamento de Dependência {#dependency-pre-bundling}

:::tip NOTA
É importante notar que traduzimos o termo **cache** como **armazenamento de consulta imediata**.
:::

Quando executamos a `vite` pela primeira vez, a Vite pré-empacota as dependências do nosso projeto antes de carregar a nossa aplicação localmente. Isto é feito automaticamente e de maneira transparente por padrão.

## O Motivo {#the-why}

Isto é a Vite realizando o que chamamos de "pré-empacotamento de dependência". Este processo serve a dois propósitos:

1. **Compatibilidade de CommonJS e UMD:** Durante o desenvolvimento, o servidor de desenvolvimento da Vite serve todo código como Módulo de ECMAScript nativo. Portanto, primeiro a Vite deve converter as dependências que são entregadas como CommonJS ou UMD em ESM (abreviação no idioma original para Módulo de ECMAScript).

   Quando convertemos as dependências de CommonJS, a Vite realiza a analise de importação inteligente para que as importações nomeadas para os módulos de CommonJS funcionarem como esperado mesmo se as exportações fossem dinamicamente atribuídas (por exemplo, na React):

   ```js
   // funciona como esperado
   import React, { useState } from 'react'
   ```

2. **Desempenho:** a Vite converte as dependências de Módulo de ECMAScript com muitos módulos internos num único módulo para melhorar o desempenho do carregamento da página subsequente.

  Alguns pacotes entregam as suas construções de módulos de ECMAScript como muitos ficheiros separados importando-se mutuamente. Por exemplo, a [`lodash-es` tem mais de 600 módulos internos](https://unpkg.com/browse/lodash-es/)! Quando fazemos `import { debounce } from 'lodash-es'`, o navegador dispara mais de 600+ requisições de HTTP ao mesmo tempo! Embora o servidor não tenha nenhum problema em manipulá-los, a grande quantidade de requisições cria uma congestão de rede no lado do navegador, tornando o carregamento da página notavelmente mais lento.

  Por pré-empacotar a `lodash-es` num único módulo, agora apenas precisamos duma requisição de HTTP!

:::tip NOTA
O pré-empacotamento de dependência apenas aplica-se no modo de desenvolvimento, e usa a `esbuild` para converter as dependências em Módulo de ECMAScript. Nas construções de produção, `@rollup/plugin-commonjs` é usada.
:::

## Descoberta Automática de Dependência {#automatic-dependency-discovery}

Se um armazenamento de consulta imediata (vulgo, *cache*) não for encontrado, a Vite rastejará pelo nosso código-fonte e descobrirá automaticamente as importações de dependência (isto é, "importações simples" que esperam-se serem resolvidas a partir da `node_modules`) e usa estas importações encontradas como pontos de entrada para o pré-empacotamento. O pré-empacotamento é realizado com a `esbuild` então é normalmente muito rápido.

Depois do servidor já tiver iniciado, se uma nova importação de dependência for encontrada que já não esteja presente no armazenamento de consulta imediata, a Vite re-executará o processo de empacotamento de dependência e recarregará a página se necessário.

## Mono-Repositórios e Dependências Ligadas {#monorepos-and-linked-dependencies}

Numa configuração de mono-repositório, uma dependência pode ser um pacote ligado a partir do mesmo repositório. A Vite deteta automaticamente as dependências que não são resolvidas a partir da `node_modules` e trata a dependência ligada como código-fonte. Esta não tentará empacotar a dependência ligada, e analisará a lista de dependência da dependência ligada.

No entanto, isto exige que a dependência ligada seja exportada como Módulo de ECMAScript. Se não, podemos adicionar a dependência à [`optimizeDeps.include`](/config/dep-optimization-options#optimizedeps-include) e [`build.commonjsOptions.include`](/config/build-options#build-commonjsoptions) na nossa configuração:

```js
import { defineConfig } from 'vite'

export default defineConfig({
  optimizeDeps: {
    include: ['linked-dep'],
  },
  build: {
    commonjsOptions: {
      include: [/linked-dep/, /node_modules/],
    },
  },
})
```

Quando fazemos mudanças à dependência ligada, reiniciamos o servidor de desenvolvimento com a opção de linha de comando `--force` para as mudanças surtirem efeito.

## Personalizando o Comportamento {#customizing-the-behavior}

As heurísticas padrão da descoberta de dependência nem sempre são desejáveis. Nos casos onde queremos incluir ou excluir explicitamente as dependências da lista, usamos as [opções de configuração `optimizeDeps`](/config/dep-optimization-options).

Um caso de uso normal para `optimizeDeps.include` ou `optimizeDeps.exclude` é quando temos uma importação que não é diretamente passível de ser descoberta no código-fonte. Por exemplo, talvez a importação é criada como um resultado duma transformação de extensão. Isto significa que a Vite não será capaz de descobrir a importação durante a varredura inicial - esta apenas pode descobri-la depois do ficheiro ser requisitado pelo navegador e transformado. Isto fará com que o servidor re-empacote imediatamente depois do servidor iniciar.

Ambas `include` e `exclude` podem ser usadas para lidar com isto. Se a dependência for grande (com muitos módulos internos) ou for CommonJS, então devemos incluí-la; Se a dependência for pequena e já for Módulo de ECMAScript válido, podemos excluí-la e deixar o navegador carregá-la diretamente.

Nós também podemos personalizar a `esbuild` com a [opção `optimizeDeps.esbuildOptions`](/config/dep-optimization-options#optimizedeps-esbuildoptions). Por exemplo, adicionando uma extensão de `esbuild` para manipular ficheiros especiais nas dependências ou mudando o [`target` da construção](https://esbuild.github.io/api/#target).

## Armazenamento de Consulta Imediata {#caching}

### Armazenamento de Consulta Imediata do Sistema de Ficheiro {#file-system-cache}

A Vite armazena para consulta imediata as dependências pré-empacotadas no `node_modules/.vite`. Esta determina se precisa re-executar a etapa de pré-empacotamento baseada em algumas fontes:

- O conteúdo do ficheiro de fechadura do gestor de pacote, por exemplo `package-lock.json`, `yarn.lock`, `pnpm-lock.yaml` ou `bun.lockb`.
- O tempo de modificação da pasta dos remendos.
- Os campos relevantes no nosso `vite.config.js`, se presente.
- O valor da `NODE_ENV`.

A etapa de pré-empacotamento apenas precisará ser re-executada quando uma das fontes acima for mudada.

Se por alguma razão quisermos forçar a Vite à re-empacotar as dependências, podemos ou iniciar o servidor de desenvolvimento com a opção de linha de comando `--force`, ou eliminar manualmente o diretório de armazenamento de consulta imediata `node_modules/.vite`.

### Armazenamento de Consulta Imediata do Navegador {#browser-cache}

As requisições de dependência resolvidas são fortemente armazenadas para consulta imediata com os cabeçalhos de HTTP `max-age=31536000,immutable` para melhorar o desempenho da recarga da página durante o desenvolvimento. Uma vez armazenada, estas requisições nunca atingirão o servidor novamente. Elas são invalidadas automaticamente pela consulta da versão anexada se uma versão diferente estiver instalada (conforme refletida no ficheiro de fechadura do nosso gestor de pacote). Se quisermos depurar as nossas dependências fazendo edições locais, podemos:

1. Desativar temporariamente o armazenamento de consulta imediata através da aba de Rede da ferramenta de programação do nosso navegador;
2. Reiniciar o servidor de desenvolvimento da Vite com a opção de linha de comando `--force` para re-empacotar as dependências;
3. Recarregar a página.
