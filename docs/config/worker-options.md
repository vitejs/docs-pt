# Opções do Operário {#worker-options}

Opções relacionadas aos Operários da Web.

## `worker.format` {#worker-format}

- **Tipo:** `'es' | 'iife'`
- **Predefinido como:** `iife`

Formato de saída para o pacote do operário.

## `worker.plugins` {#worker-plugins}

- **Tipo:** [`() => (Plugin | Plugin[])[]`](./shared-options#plugins)

As extensões de Vite que aplicam-se ao pacote do operário. Nota que a [`config.plugins`](./shared-options#plugins) apenas aplica-se aos operários em desenvolvimento, deve ser configurado cá em vez de ser para a construção. A função deve retornar novas instâncias da extensão, uma vez que são usadas nas construções do operário da Rollup em paralelo. Então, a modificação das opções do `config.worker` no gatilho `config` não será ignorado.

## `worker.rollupOptions` {#worker-rollupoptions}

- **Tipo:** [`RollupOptions`](https://rollupjs.org/configuration-options/)

Opções de Rollup para construir o pacote do operário.
