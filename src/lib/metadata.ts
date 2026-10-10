import type { Metadata } from 'next'
import { SITE } from '@/data/site'
import type { PageSeo } from '@/types/site'

// O merge de metadados entre layout e página é raso: o `openGraph` da página substitui o do
// layout inteiro. Por isso cada página repete os padrões do site junto com os próprios campos.
export const SITE_OPEN_GRAPH = {
  type: 'website',
  locale: SITE.locale,
  siteName: SITE.name,
} as const satisfies Metadata['openGraph']

/**
 * Metadados próprios de uma rota. Caminhos relativos resolvem contra o `metadataBase` do layout.
 * O Next preenche título, descrição e imagem do Twitter a partir do `openGraph`.
 */
export function buildPageMetadata({ path, title, description }: PageSeo): Metadata {
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: path },
    openGraph: { ...SITE_OPEN_GRAPH, url: path, title, description },
  }
}
