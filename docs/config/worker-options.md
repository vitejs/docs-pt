# Opções do Operário {#worker-options}

Opções relacionadas aos Operários da Web (Web Workers, em Inglês).

## worker.format {#worker-format}

- **Tipo:** `'es' | 'iife'`
- **Predefinido como:** `iife`

Formato de saída para pacote do operário.

## worker.plugins {#worker-plugins}

- **Tipo:** [`(Plugin | Plugin[])[]`](./shared-options#plugins)

As extensões de Vite que se aplicam ao pacote do operário. Nota que [`config.plugins`](./shared-options#plugins) apenas aplica-se aos operários em desenvolvimento, deve ser configurado aqui em vez de ser para a construção.

## worker.rollupOptions {#worker-rollupoptions}

- **Tipo:** [`RollupOptions`](https://rollupjs.org/configuration-options/)

Opções de Rollup para construir o pacote do operário.
