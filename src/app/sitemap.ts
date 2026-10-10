import type { MetadataRoute } from 'next'
import { PAGES, SITE } from '@/data/site'

// Avaliada uma única vez, quando o sitemap é gerado no build.
const BUILD_DATE = new Date()

export default function sitemap(): MetadataRoute.Sitemap {
  return Object.values(PAGES).map(({ path }) => ({
    url: new URL(path, SITE.url).href,
    lastModified: BUILD_DATE,
    changeFrequency: 'monthly',
    priority: path === PAGES.home.path ? 1 : 0.8,
  }))
}
