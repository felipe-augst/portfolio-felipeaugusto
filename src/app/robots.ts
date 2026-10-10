import type { MetadataRoute } from 'next'
import { SITE } from '@/data/site'

// Libera o site inteiro: os buscadores precisam de `/_next/` para renderizar a página.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
    sitemap: new URL('/sitemap.xml', SITE.url).href,
    host: SITE.url,
  }
}
