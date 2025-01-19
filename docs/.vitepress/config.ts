import { defineConfig } from 'vitepress'
import { buildEnd } from './buildEnd.config'
import type { DefaultTheme } from 'vitepress'
import { transformerTwoslash } from '@shikijs/vitepress-twoslash'
import {
  groupIconMdPlugin,
  groupIconVitePlugin,
} from 'vitepress-plugin-group-icons'

const ogDescription = 'Ferramentas de Frontend Modernas'
const ogImage = 'https://pt.vite.dev/og-image.png'
const ogTitle = 'Vite'
const ogUrl = 'https://pt.vite.dev'

// netlify envs
const deployURL = process.env.DEPLOY_PRIME_URL || ''
const commitRef = process.env.COMMIT_REF?.slice(0, 8) || 'dev'

const deployType = (() => {
  switch (deployURL) {
    case 'https://main--vite-docs-pt.netlify.app':
      return 'main'
    case '':
      return 'local'
    default:
      return 'release'
  }
})()

const additionalTitle = ((): string => {
  switch (deployType) {
    case 'main':
      return ' (ramo principal)'
    case 'local':
      return ' (local)'
    case 'release':
      return ''
  }
})()

const versionLinks = ((): DefaultTheme.NavItemWithLink[] => {
  const oldVersions: DefaultTheme.NavItemWithLink[] = [
    {
      text: 'Documentação da Vite 5',
      link: 'https://v5.vite.dev',
    },
    {
      text: 'Documentação da Vite 4',
      link: 'https://v4.vite.dev',
    },
    {
      text: 'Documentação da Vite 3',
      link: 'https://v3.vite.dev',
    },
    {
      text: 'Documentação da Vite 2',
      link: 'https://v2.vite.dev',
    }
  ]

  switch (deployType) {
    case 'main':
    case 'local':
      return [
        {
          text: 'Documentação da Vite 6 (Lançamento)',
          link: 'https://pt.vite.dev',
        },
        ...oldVersions,
      ]
    case 'release':
      return oldVersions
  }
})()

export default defineConfig({
  lang: 'pt-PT',
  title: `Vite${additionalTitle}`,
  description: 'Ferramentas de Frontend Modernas',

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }],
    ['link', { rel: 'alternate', type: 'application/rss+xml', href: '/blog.rss'}],
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    [
      'link',
      {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossorigin: 'true',
      },
    ],
    [
      'link',
      {
        rel: 'preload',
        href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Manrope:wght@600&family=IBM+Plex+Mono:wght@400&display=swap',
        as: 'style',
      },
    ],
    [
      'link',
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Manrope:wght@600&family=IBM+Plex+Mono:wght@400&display=swap',
      },
    ],
    ['link', { rel: 'me', href: 'https://m.webtoo.ls/@vite'}],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: ogTitle }],
    ['meta', { property: 'og:image', content: ogImage }],
    ['meta', { property: 'og:url', content: ogUrl }],
    ['meta', { property: 'og:description', content: ogDescription }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:site', content: '@vite_js' }],
    ['meta', { name: 'theme-color', content: '#646cff' }],
    [
      'script',
      {
        src: 'https://cdn.usefathom.com/script.js',
        'data-site': 'CBDFBSLI',
        'data-spa': 'auto',
        defer: ''
      }
    ]
  ],

  locales: {
    root: { label: 'Português' },
    en: { label: 'English', link: 'https://vite.dev' },
    zh: { label: '简体中文', link: 'https://cn.vite.dev' },
    ja: { label: '日本語', link: 'https://ja.vite.dev' },
    es: { label: 'Español', link: 'https://es.vite.dev' },
    ko: { label: '한국어', link: 'https://ko.vite.dev' },
    de: { label: 'Deutsch', link: 'https://de.vite.dev' },
  },

  themeConfig: {
    logo: '/logo.svg',

    editLink: {
      pattern: 'https://github.com/vitejs/docs-pt/edit/main/docs/:path',
      text: 'Sugerir mudanças para esta página',
    },

    socialLinks: [
      { icon: 'bluesky', link: 'https://bsky.app/profile/vite.dev' },
      { icon: 'mastodon', link: 'https://elk.zone/m.webtoo.ls/@vite' },
      { icon: 'x', link: 'https://x.com/vite_js' },
      { icon: 'discord', link: 'https://chat.vite.dev' },
      { icon: 'github', link: 'https://github.com/vitejs/vite' }
    ],

    algolia: {
      appId: '7H67QR5P0A',
      apiKey: '208bb9c14574939326032b937431014b',
      indexName: 'vitejs',
      searchParameters: {
        facetFilters: ['tags:en', 'tags:pt']
      }
    },

    carbonAds: {
      code: 'CEBIEK3N',
      placement: 'vitejsdev'
    },

    footer: {
      message: `Lançada sob a Licença MIT. (${commitRef})`,
      copyright: 'Direitos de Autor © 2019-presente VoidZero Inc. & Colaboradores da Vite',
    },

    nav: [
      { text: 'Guia', link: '/guide/', activeMatch: '/guide/' },
      { text: 'Configuração', link: '/config/', activeMatch: '/config/' },
      { text: 'Extensões', link: '/plugins/', activeMatch: '/plugins/' },
      {
        text: 'Recursos',
        items: [
          { text: 'Equipa', link: '/team' },
          { text: 'Blogue', link: '/blog'},
          { text: 'Lançamentos', link: '/releases' },
          {
            items: [
              {
                text: 'Bluesky',
                link: 'https://bsky.app/profile/vite.dev',
              },
              {
                text: 'Mastodon',
                link: 'https://elk.zone/m.webtoo.ls/@vite',
              },
              {
                text: 'X (Twitter)',
                link: 'https://x.com/vite_js'
              },
              {
                text: 'Conversas da Discord',
                link: 'https://chat.vite.dev'
              },
              {
                text: 'Awesome Vite',
                link: 'https://github.com/vitejs/awesome-vite'
              },
              {
                text: 'ViteConf',
                link: 'https://viteconf.org',
              },
              {
                text: 'Comunidade da DEV',
                link: 'https://dev.to/t/vite'
              },
              {
                text: 'Registo de Alterações',
                link: 'https://github.com/vitejs/vite/blob/main/packages/vite/CHANGELOG.md'
              },
              {
                text: 'Colaboração',
                link: 'https://github.com/vitejs/vite/blob/main/CONTRIBUTING.md',
              }
            ]
          }
        ]
      },
      {
        text: 'Versões',
        items: versionLinks
      }
    ],

    sidebar: {
      '/guide/': [
        {
          text: 'Guia',
          items: [
            {
              text: 'Por que Vite?',
              link: '/guide/why'
            },
            {
              text: 'Começar',
              link: '/guide/'
            },
            {
              text: 'Funcionalidades',
              link: '/guide/features'
            },
            {
              text: 'Interface da Linha de Comando',
              link: '/guide/cli'
            },
            {
              text: 'Usar Extensões',
              link: '/guide/using-plugins'
            },
            {
              text: 'Pré-Empacotamento de Dependência',
              link: '/guide/dep-pre-bundling'
            },
            {
              text: 'Manipulação de Recurso Estático',
              link: '/guide/assets'
            },
            {
              text: 'Construir para Produção',
              link: '/guide/build'
            },
            {
              text: 'Implantar um Sítio Estático',
              link: '/guide/static-deploy'
            },
            {
              text: 'Variáveis de Ambiente e Modos',
              link: '/guide/env-and-mode'
            },
            {
              text: 'Interpretação do Lado do Servidor',
              link: '/guide/ssr'
            },
            {
              text: 'Integração de Backend',
              link: '/guide/backend-integration'
            },
            {
              text: 'Comparações',
              link: '/guide/comparisons'
            },
            {
              text: 'Resolução de Problemas',
              link: '/guide/troubleshooting'
            },
            {
              text: 'Desempenho',
              link: '/guide/performance'
            },
            {
              text: 'Filosofia',
              link: '/guide/philosophy',
            },
            {
              text: 'Migração da Versão 6',
              link: '/guide/migration'
            },
            {
              text: 'Breaking Changes',
              link: '/changes/',
            },
          ]
        },
        {
          text: 'APIs',
          items: [
            {
              text: 'API de Extensão',
              link: '/guide/api-plugin'
            },
            {
              text: 'API da Substituição de Módulo Instantânea',
              link: '/guide/api-hmr'
            },
            {
              text: 'API de JavaScript',
              link: '/guide/api-javascript'
            },
            {
              text: 'Referência da Configuração',
              link: '/config/'
            }
          ]
        },
        {
          text: 'API do Ambiente',
          items: [
            {
              text: 'Introdução',
              link: '/guide/api-environment',
            },
            {
              text: 'Instâncias do Ambiente',
              link: '/guide/api-environment-instances',
            },
            {
              text: 'Extensões',
              link: '/guide/api-environment-plugins',
            },
            {
              text: 'Abstrações',
              link: '/guide/api-environment-frameworks',
            },
            {
              text: 'Executores',
              link: '/guide/api-environment-runtimes',
            },
          ],
        },
      ],
      '/config/': [
        {
          text: 'Configuração',
          items: [
            {
              text: 'Configurando a Vite',
              link: '/config/'
            },
            {
              text: 'Opções Partilhadas',
              link: '/config/shared-options'
            },
            {
              text: 'Opções do Servidor',
              link: '/config/server-options'
            },
            {
              text: 'Opções da Construção',
              link: '/config/build-options'
            },
            {
              text: 'Opções da Pré-Visualização',
              link: '/config/preview-options'
            },
            {
              text: 'Opções da Otimização de Dependência',
              link: '/config/dep-optimization-options'
            },
            {
              text: 'Opções da Interpretação do Lado do Servidor',
              link: '/config/ssr-options'
            },
            {
              text: 'Opções do Operário',
              link: '/config/worker-options'
            }
          ]
        }
      ],
      '/changes/': [
        {
          text: 'Breaking Changes',
          link: '/changes/',
        },
        {
          text: 'Current',
          items: [],
        },
        {
          text: 'Future',
          items: [
            {
              text: 'this.environment in Hooks',
              link: '/changes/this-environment-in-hooks',
            },
            {
              text: 'HMR hotUpdate Plugin Hook',
              link: '/changes/hotupdate-hook',
            },
            {
              text: 'Move to per-environment APIs',
              link: '/changes/per-environment-apis',
            },
            {
              text: 'SSR using ModuleRunner API',
              link: '/changes/ssr-using-modulerunner',
            },
            {
              text: 'Shared plugins during build',
              link: '/changes/shared-plugins-during-build',
            },
          ],
        },
        {
          text: 'Past',
          items: [],
        },
      ],
    },
    outline: {
      level: [2, 3],
    }
  },
  transformPageData(pageData) {
    const canonicalUrl = `${ogUrl}/${pageData.relativePath}`
      .replace(/\/index\.md$/, '/')
      .replace(/\.md$/, '/')
    pageData.frontmatter.head ??= []
    pageData.frontmatter.head.unshift(
      ['link', { rel: 'canonical', href: canonicalUrl }],
      ['meta', { property: 'og:title', content: pageData.title }],
    )
    return pageData
  },
  markdown: {
    codeTransformers: [transformerTwoslash()],
    config(md) {
      md.use(groupIconMdPlugin)
    },
  },
  vite: {
    plugins: [
      groupIconVitePlugin({
        customIcon: {
          firebase: 'vscode-icons:file-type-firebase',
          '.gitlab-ci.yml': 'vscode-icons:file-type-gitlab',
        },
      }),
    ],
    optimizeDeps: {
      include: [
        '@shikijs/vitepress-twoslash/client',
        'gsap',
        'gsap/dist/ScrollTrigger',
        'gsap/dist/MotionPathPlugin',
      ],
    },
  },
  buildEnd,
})
