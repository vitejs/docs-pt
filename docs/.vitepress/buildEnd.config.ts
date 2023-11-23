import path from 'path'
import { writeFileSync } from 'fs'
import { Feed } from 'feed'
import { createContentLoader, type SiteConfig } from 'vitepress'


const SITE_URL = 'https://pt.vitejs.dev'
const BLOG_URL = `${SITE_URL}/blog`

export const buildEnd = async (config: SiteConfig) => {
  const feed = new Feed({
    title: 'Vite',
    description: 'Ferramental de Frontend de Nova Geração',
    id: BLOG_URL,
    link: BLOG_URL,
    language: 'pt',
    image: 'https://pt.vitejs.dev/og-image.png',
    favicon: 'https://pt.vitejs.dev/logo.svg',
    copyright: 'Direitos de Autor © 2019-present Evan You & Colaboradores da Vite',
  })

  const posts = await createContentLoader('blog/*.md', {
    excerpt: true,
    render: true,
  }).load()

  posts.sort(
    (a, b) =>
      +new Date(b.frontmatter.date as string) -
      +new Date(a.frontmatter.date as string),
  )

  for (const { url, excerpt, frontmatter, html } of posts) {
    feed.addItem({
      title: frontmatter.title,
      id: `${SITE_URL}${url}`,
      description: excerpt,
      content: html,
      author: [
        {
          name: frontmatter.author.name,
        },
      ],
      date: frontmatter.date,
    })
  }

  writeFileSync(path.join(config.outDir, 'blog.rss'), feed.rss2())
}
