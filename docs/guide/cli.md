# Interface da Linha de Comando {#command-line-interface}

## Servidor de Desenvolvimento {#dev-server}

### `vite` {#vite}

Inicia o servidor de desenvolvimento da Vite no diretório atual.

#### Uso {#vite-usage}

```bash
vite [root]
```

#### Opções {#vite-options}

| Opções                   | Descrições                                                        |
| ------------------------ | ----------------------------------------------------------------- |
| `--host [host]`          | Especificar o nome do hospedeiro (`string`)                       |
| `--port <port>`          | Especificar a porta (`number`)                                    |
| `--https`                | Usar o TLS + HTTP/2 (`boolean`)                                   |
| `--open [path]`          | Abrir o navegador na inicialização (`boolean \| string`)          |
| `--cors`                 | Ativar o CORS (`boolean`)                                         |
| `--strictPort`           | Sair se a porta especificada já estiver em uso (`boolean`)        |
| `--force`                | Forçar o otimizador a ignorar o cache e re-empacotar (`boolean`)  |
| `-c, --config <file>`    | Usar o ficheiro de configuração especificado (`string`)           |
| `--base <path>`          | Caminho de base pública (default: `/`) (`string`)                 |
| `-l, --logLevel <level>` | Informação \| aviso \| erro \| silencioso (`string`)              |
| `--clearScreen`          | Permitir/desativar a limpeza da tela quando estiver a fazer o registo em diário (`boolean`)               |
| `-d, --debug [feat]`     | Exibir os registos da depuração (`string \| boolean`)             |
| `-f, --filter <filter>`  | Filtrar os registos da depuração (`string`)                       |
| `-m, --mode <mode>`      | Definir o modo do ambiente (`string`)                            |
| `-h, --help`             | Exibir as opções disponíveis na Interface da Linha de Comando     |
| `-v, --version`          | Exibir o número da versão                                         |

## Construção {#build}

### `vite build` {#vite-build}

Constrói a aplicação para produção.

#### Uso {#vite-build-usage}

```bash
vite build [root]
```

#### Opções {#vite-build-options}

| Opções                         | Descrições                                                          |
| ------------------------------ | ------------------------------------------------------------------- |
| `--target <target>`            | Transformar o código do alvo (predefinido: `"modules"`) (`string`)      |
| `--outDir <dir>`               | Diretório de saída (predefinido: `dist`) (`string`)                     |
| `--assetsDir <dir>`            | Diretório sob `outDir` para colocar os recursos (predefinido: `"assets"`) (`string`) |
| `--assetsInlineLimit <number>` | Entrada do recurso estático de base64 incorporado em bytes (predefinido: `4096`) (`number`) |
| `--ssr [entry]`                | Construir a entrada especificada para interpretação no lado do servidor (`string`)          |
| `--sourcemap`                  | Produzir os mapas do código-fonte para construção (predefinido: `false`) (`boolean`)         |
| `--minify [minifier]`          | Ativar/desativar a minificação, ou especificar o minificador a usar (predefinido: `"esbuild"`) (`boolean \| "terser" \| "esbuild"`) |
| `--manifest [name]`            | Emitir o JSON do manifesto da construção (`boolean \| string`)      |
| `--ssrManifest [name]`         | Emitir o JSON do manifesto da interpretação no lado do servidor (`boolean \| string`)                        |
| `--force`                      | Forçar o otimizador a ignorar o cache e re-empacotar (experimental)(`boolean`) |
| `--emptyOutDir`                | Forçar a limpeza do `outDir` quando estiver fora da raiz (`boolean`)            |
| `-w, --watch`                  | Reconstruir quando os módulos tiver sido modificado no disco (`boolean`) |
| `-c, --config <file>`          | Usar o ficheiro de configuração especificado (`string`)             |
| `--base <path>`                | Caminho de base pública (predefinido: `/`) (`string`)               |
| `-l, --logLevel <level>`       | Informação \| aviso \| erro \| silencioso (`string`)                |
| `--clearScreen`                | Permitir/desativar a limpeza da tela quando estiver a fazer o registo em diário (`boolean`)                 |
| `-d, --debug [feat]`           | Exibir os registos da depuração (`string \| boolean`)               |
| `-f, --filter <filter>`        | Filtrar os registos da depuração (`string`)                         |
| `-m, --mode <mode>`            | Definir o modo do ambiente (`string`)                               |
| `-h, --help`                   | Exibir as opções disponíveis na Interface da Linha de Comando       |

## Outros {#others}

### `vite optimize` {#vite-optimize}

Pré-empacota as dependências.

#### Uso {#vite-optimize-usage}

```bash
vite optimize [root]
```

#### Opções {#vite-optimize-options}

| Opções                   | Descrições                                                        |
| ------------------------ | ----------------------------------------------------------------- |
| `--force`                | Forçar o otimizador a ignorar o cache e re-empacotar  (`boolean`) |
| `-c, --config <file>`    | Usar o ficheiro de configuração especificado  (`string`)          |
| `--base <path>`          | Caminho de base pública (predefinido: `/`) (`string`)             |
| `-l, --logLevel <level>` | Informação \| aviso \| erro \| silencioso (`string`)              |
| `--clearScreen`          | Permitir/desativar a limpeza da tela quando estiver a fazer o registo em diário (`boolean`)               |
| `-d, --debug [feat]`     | Exibir os registos da depuração (`string \| boolean`)                             |
| `-f, --filter <filter>`  | Filtrar os registos da depuração (`string`)                                      |
| `-m, --mode <mode>`      | Definir o modo do ambiente (`string`)                                           |
| `-h, --help`             | Exibir as opções disponíveis na Interface da Linha de Comando                                     |

### `vite preview` {#vite-preview}

Pré-visualiza localmente a construção de produção.

#### Uso {#vite-preview-usage}

```bash
vite preview [root]
```

#### Opções {#vite-preview-options}

| Opções                   | Descrições                                           |
| ------------------------ | ---------------------------------------------------- |
| `--host [host]`          | Especificar o nome do hospedeiro (`string`)                          |
| `--port <port>`          | Especificar a porta (`number`)                              |
| `--strictPort`           | Sair se a porta especificada já estiver em uso (`boolean`) |
| `--https`                | Usar o TLS + HTTP/2 (`boolean`)                         |
| `--open [path]`          | Abrir o navegador na inicialização (`boolean \| string`)        |
| `--outDir <dir>`         | Diretório de saída (predefinido: `dist`)(`string`)         |
| `-c, --config <file>`    | Usar o ficheiro de configuração especificado (`string`)                 |
| `--base <path>`          | Caminho de base pública (predefinido: `/`) (`string`)           |
| `-l, --logLevel <level>` | Informação \| aviso \| erro \| silencioso (`string`)           |
| `--clearScreen`          | Permitir/desativar a limpeza da tela quando estiver a fazer o registo em diário (`boolean`)  |
| `-d, --debug [feat]`     | Exibir os registos da depuração (`string \| boolean`)                |
| `-f, --filter <filter>`  | Filtrar os registos da depuração (`string`)                         |
| `-m, --mode <mode>`      | Definir o modo do ambiente (`string`)                              |
| `-h, --help`             | Exibir as opções disponíveis na Interface da Linha de Comando                        |
