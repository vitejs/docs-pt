---
outline: [2, 3]
---

# Pré-Empacotamento de Dependência {#dependency-pre-bundling}

Quando executas `vite` pela primeira vez, podes reparar nesta mensagem:

```
Pre-bundling dependencies:
  react
  react-dom
(this will be run only when your dependencies or config have changed)
```

## O Porquê {#the-why}

Isto é a Vite realizando o que chamamos de "pré-empacotamento de dependência". Este processo serve a dois propósitos:

1. **Compatibilidade de CommonJS e UMD:** Durante o desenvolvimento, o desenvolvimento da Vite serve todos códigos como Módulo de ECMAScript nativo. Portanto, a Vite deve converter as dependências que são entregadas como CommonJS ou UMD para Módulo de ECMAScript (ESM, sigla em Inglês) primeiro.

   Quando estiver convertendo as dependências de CommonJS, a Vite realiza analises de importação inteligente para que as importações nomeadas para os módulos de CommonJS funcionarem como esperado mesmo se as exportações forem atribuídas dinamicamente (por exemplo, React):

   ```js
   // funciona como esperado
   import React, { useState } from 'react'
   ```

2. **Desempenho:** a Vite converte as dependências de ESM com muitos módulos internos em um único módulo para melhorar desempenho do carregamento da página subsequente.

   Alguns pacotes entregam as suas construções de módulos de ECMAScript como muitos ficheiros separados importando-se mutuamente. Por exemplo, [o `lodash-es` tem mais de 600 módulos internos](https://unpkg.com/browse/lodash-es/)! Quando fazemos `import { debounce } from 'lodash-es'`, o navegador dispara mais de 600 requisições de HTTP ao mesmo tempo! Embora o servidor não tenha problema em manipulá-los, a grande quantidade de requisições criam uma congestão de rede no lado do navegador, causando que a página carregue visivelmente mais lento.

   Pré-empacotando `lodash-es` em um único módulo, nós agora só precisamos de uma requisição de HTTP!

:::tip NOTA
O pré-empacotamento de dependência só se aplica no modo de desenvolvimento, e utiliza `esbuild` para converter as dependências para ESM. Nas construções de produção, `@rollup/plugin-commonjs` é utilizada no lugar.
:::

## Descoberta de Dependência Automática {#automatic-dependency-discovery}

Se um cache existente não for encontrado, a Vite rastreará o teu código-fonte e descobrir automaticamente as importações de dependência (por exemplo, "importações simples" que esperam ser resolvidas a partir do `node_modules`) e utiliza estas importações encontradas como pontos de entrada para o pré-empacotamento. O pré-empacotamento é realizado com `esbuild` assim é normalmente muito rápido.

Depois do servidor tiver já iniciado, se uma nova importação de dependência for encontrada que não esteja já no cache, a Vite executará novamente o processo de empacotamento de dependência e recarregará a página.

## Mono-repositórios e Dependências Ligadas {#monorepos-and-linked-dependencies}

Em um configuração de mono-repositório, uma dependência pode ser um pacote ligado do mesmo repositório. A Vite deteta dependências que não são resolvidas a partir do `node_modules` e trata a dependência ligada como código-fonte. Ela não tentará empacotar a dependência ligada e analisará a lista de dependência da dependência ligada no lugar.

No entanto, isto requer que a dependência ligada seja exportada como ESM. Se não, podes adicionar a dependência ao [`optimizeDeps.include`](/config/dep-optimization-options.md#optimizedeps-include) e [`build.commonjsOptions.include`](/config/build-options.md#build-commonjsoptions) na tua configuração.

```js
export default defineConfig({
  optimizeDeps: {
    include: ['linked-dep']
  },
  build: {
    commonjsOptions: {
      include: [/linked-dep/, /node_modules/]
    }
  }
})
```

Quando estiveres fazendo mudanças para a dependência ligada, reinicie o servidor de desenvolvimento com a opção de linha de comando `--force` para as mudanças surtirem efeito.

:::warning Duplicação de Cópias da Mesma Dependência
Devido as diferenças na resolução de dependência ligada, dependências transitivas podem deduzir incorretamente, causando problemas quando utilizadas em tempo de execução. Se encontrares este problema, utilize `npm pack` sobre a dependência ligada para corrigir isto.
:::

## Personalizando o Comportamento {#customizing-the-behavior}

As heurísticas da descoberta de dependência padrão podem não sempre ser desejável. Nestes casos onde quiseres explicitamente incluir ou excluir dependências da lista, utilize as [opções de configuração `optimizeDeps`](/config/dep-optimization-options.md).

Um caso de uso normal para `optimizeDeps.include` ou `optimizeDeps.exclude` é quando tens uma importação que não é passível de ser descoberto no código-fonte. Por exemplo, talvez a importação seja criada como um resultado de uma transformação de extensão. Isto significa que a Vite não será capaz de descobrir a importação no exame inicial - ela pode apenas descobri-lo depois do ficheiro ser requisitado pelo navegador e transformado. Isto causará que o servidor empacote novamente imediatamente depois do servidor iniciar.

Ambos `include` e `exclude` podem ser utilizados para lidar com isto. Se a dependência for grande (com muitos módulos internos) ou for CommonJS, então deves incluí-la; Se a dependência for pequena e já for ESM válido, podes excluí-la e deixar o navegador carregá-la diretamente.

## Armazenamento de Disponibilidade Imediata {#caching}

### Disponibilidade Imediata do Sistema de Ficheiro {#file-system-cache}

A Vite cacheia as dependências pré-empacotadas no `node_modules/.vite`. Ela determina se ela precisa executar novamente a etapa de pré-empacotamento baseada em algumas fontes:

- A lista de `dependencies` no teu `package.json`.
- Os "lockfiles" do gestor de pacote, por exemplo `package-lock.json`, `yarn.lock`, ou `pnpm-lock.yaml`.
- Campos relevantes no teu `vite.config.js`, se presentes.

A etapa de pré-empacotamento apenas precisará ser executada novamente quando um dos de cima tiver mudado.

Se por alguma razão quiseres forçar a Vite para empacotar novamente as dependências, podes tanto iniciar o servidor de desenvolvimento com a opção de linha de comando `--force`, ou eliminar manualmente o diretório de cache `node_modules/.vite`.

### Disponibilidade Imediata do Navegador {#browser-cache}

As requisições de dependência resolvidas são fortemente cacheada com os cabeçalhos de HTTP `max-age=31536000,immutable` para melhorar o desempenho do recarregamento da página durante o desenvolvimento. Uma vez cacheada, estas requisições nunca atingirão o servidor de desenvolvimento novamente. Elas são invalidadas automaticamente pela consulta de versão anexada se uma versão diferente estiver instalada (conforme refletida no teu "lockfile" do gestor de pacote). Se quiseres depurar as tuas dependências fazendo edições locais, podes:

1. Desativar temporariamente o cache através da aba de Rede (ou "Network") das tuas ferramentas de programação do navegador;
2. Reiniciar o servidor de desenvolvimento da Vite com a opção de linha de comando `--force` para empacotar novamente as dependências;
3. Recarregar a página.
