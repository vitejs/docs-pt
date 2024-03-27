import { defineConfig, DefaultTheme } from 'vitepress'
import { buildEnd } from './buildEnd.config'

const ogDescription = 'Ferramental de Frontend de Última Geração'
const ogImage = 'https://pt.vitejs.dev/og-image.png'
const ogTitle = 'Vite'
const ogUrl = 'https://pt.vitejs.dev'

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
      text: 'Documentação da Vite 4',
      link: 'https://v4.vitejs.dev',
    },
    {
      text: 'Documentação da Vite 3',
      link: 'https://v3.vitejs.dev',
    },
    {
      text: 'Documentação da Vite 2',
      link: 'https://v2.vitejs.dev',
    }
  ]

  switch (deployType) {
    case 'main':
    case 'local':
      return [
        {
          text: 'Documentação da Vite 5 (Lançamento)',
          link: 'https://pt.vitejs.dev',
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
  description: 'Ferramental de Frontend de Última Geração',

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }],
    ['link', { rel: 'alternate', type: 'application/rss+xml', href: '/blog.rss'}],
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
    en: { label: 'English', link: 'https://vitejs.dev' },
    zh: { label: '简体中文', link: 'https://cn.vitejs.dev' },
    ja: { label: '日本語', link: 'https://ja.vitejs.dev' },
    es: { label: 'Español', link: 'https://es.vitejs.dev' },
    ko: { label: '한국어', link: 'https://ko.vitejs.dev' },
    de: { label: 'Deutsch', link: 'https://de.vitejs.dev' },
  },

  themeConfig: {
    logo: '/logo.svg',

    editLink: {
      pattern: 'https://github.com/vitejs/docs-pt/edit/main/docs/:path',
      text: 'Sugerir mudanças a esta página',
    },

    socialLinks: [
      { icon: 'mastodon', link: 'https://elk.zone/m.webtoo.ls/@vite' },
      { icon: 'x', link: 'https://x.com/vite_js' },
      { icon: 'discord', link: 'https://chat.vitejs.dev' },
      { icon: 'github', link: 'https://github.com/vitejs/vite' }
    ],

    algolia: {
      appId: '7H67QR5P0A',
      apiKey: 'deaab78bcdfe96b599497d25acc6460e',
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
      copyright: 'Direitos de Autor © 2019-presente Evan You & Colaboradores da Vite',
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
                text: 'X (Twitter)',
                link: 'https://x.com/vite_js'
              },
              {
                text: 'Conversas da Discord',
                link: 'https://chat.vitejs.dev'
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
                text: 'Relatório de Mudança',
                link: 'https://github.com/vitejs/vite/blob/main/packages/vite/CHANGELOG.md'
              },
              {
                text: 'Contribuição',
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
              text: 'Usando Extensões',
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
              text: 'Construindo para Produção',
              link: '/guide/build'
            },
            {
              text: 'Implantação duma Aplicação Estática',
              link: '/guide/static-deploy'
            },
            {
              text: 'Variáveis e Modos de Ambiente',
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
              text: 'Migração da Versão 4',
              link: '/guide/migration'
            }
          ]
        },
        {
          text: 'APIs',
          items: [
            // {
            //   text: 'API de Extensão',
            //   link: '/guide/api-plugin'
            // },
            {
              text: 'API da Substituição de Módulo Instantânea',
              link: '/guide/api-hmr'
            },
            {
              text: 'API de JavaScript',
              link: '/guide/api-javascript'
            },
            {
              text: 'API de Execução da Vite',
              link: '/guide/api-vite-runtime'
            },
            {
              text: 'Referência da Configuração',
              link: '/config/'
            }
          ]
        }
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
      ]
    },
    outline: {
      level: [2, 3],
    }
  },
  transformPageData(pageData) {
    const canonicalURL = `${ogUrl}/${pageData.relativePath}`
      .replace(/\/index\.md$/, '/')
      .replace(/\.md$/, '/')
    pageData.frontmatter.head ??= []
    pageData.frontmatter.head.unshift([
      'link',
      { rel: 'canonical', href: canonicalURL },
    ])
    return pageData
  },
  buildEnd,
})
