import { Feed } from 'feed'
import path from 'node:path'
import { writeFileSync } from 'node:fs'
import type { SiteConfig } from 'vitepress'
import { createContentLoader } from 'vitepress'


const SITE_URL = 'https://pt.vite.dev'
const BLOG_URL = `${SITE_URL}/blog`

export const buildEnd = async (config: SiteConfig): Promise<void> => {
  const feed = new Feed({
    title: 'Vite',
    description: 'Ferramentas de Frontend Modernas',
    id: BLOG_URL,
    link: BLOG_URL,
    language: 'pt',
    image: 'https://pt.vite.dev/og-image.png',
    favicon: 'https://pt.vite.dev/logo.svg',
    copyright: 'Direitos de Autor © 2019-presente VoidZero Inc. & Colaboradores da Vite',
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
      link: `${SITE_URL}${url}`,
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
