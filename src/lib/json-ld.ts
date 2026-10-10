import { SITE } from '@/data/site'
import { SOCIAL_LINKS } from '@/data/social'
import { CORE_STACK } from '@/data/stack'
import type { SocialPlatform } from '@/types/social'

// Perfis públicos que identificam a pessoa. E-mail e WhatsApp são canais de contato, não perfis.
const PROFILE_PLATFORMS: readonly SocialPlatform[] = ['github', 'linkedin']

export const PERSON_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: SITE.name,
  url: SITE.url,
  // Rota da imagem gerada por `src/app/opengraph-image.tsx`.
  image: new URL('/opengraph-image', SITE.url).href,
  sameAs: SOCIAL_LINKS.filter(({ platform }) => PROFILE_PLATFORMS.includes(platform)).map(
    ({ href }) => href,
  ),
  jobTitle: SITE.role,
  address: {
    '@type': 'PostalAddress',
    addressLocality: SITE.location.city,
    addressRegion: SITE.location.region,
    addressCountry: SITE.location.country,
  },
  knowsAbout: CORE_STACK.map(({ name }) => name),
}

/** Serializa JSON-LD para um `<script>` inline, escapando `<` para nenhum valor fechar a tag. */
export function serializeJsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, '\\u003c')
}
