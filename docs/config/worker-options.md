# Opções do Operário {#worker-options}

Opções relacionadas aos Operários da Web (Web Workers, em Inglês).

## worker.format {#worker-format}

- **Tipo:** `'es' | 'iife'`
- **Predefinido como:** `iife`

Formato de saída para pacote do operário.

## worker.plugins {#worker-plugins}

- **Tipo:** [`(Plugin | Plugin[])[]`](./shared-options#plugins)

As extensões de Vite que se aplicam ao pacote do operário. Nota que [`config.plugins`](./shared-options#plugins) não se aplicam aos operários, deveria de preferência ser configurada aqui.

## worker.rollupOptions {#worker-rollupoptions}

- **Tipo:** [`RollupOptions`](https://rollupjs.org/guide/en/#big-list-of-options)

Opções de Rollup para construir o pacote do operário.
