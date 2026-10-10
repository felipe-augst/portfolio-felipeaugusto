import type { Metadata } from 'next'
import { Fraunces, DM_Sans, Cinzel } from 'next/font/google'
import './globals.css'
import { SplashScreen } from '@/components/layout/SplashScreen'
import { Nav } from '@/components/layout/Nav'
import { PAGES, SITE } from '@/data/site'
import { HEAD_SCRIPT } from '@/lib/head-script'
import { PERSON_JSON_LD, serializeJsonLd } from '@/lib/json-ld'
import { SITE_OPEN_GRAPH } from '@/lib/metadata'

const fraunces = Fraunces({
  variable: '--font-fraunces',
  subsets: ['latin'],
  display: 'swap',
  weight: ['300', '400'],
  style: ['normal', 'italic'],
})

const dmSans = DM_Sans({
  variable: '--font-dm-sans',
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500'],
})

const cinzel = Cinzel({
  variable: '--font-cinzel',
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600'],
})

// Padrões do site. Cada página declara os próprios título, descrição, canonical e `og:url`.
export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: PAGES.home.title,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  keywords: [
    SITE.role,
    'React',
    'Next.js',
    'TypeScript',
    'Node.js',
    'Portfolio',
    SITE.name,
    'Desenvolvedor Fullstack',
    SITE.location.city,
  ],
  authors: [{ name: SITE.name, url: SITE.url }],
  creator: SITE.name,
  openGraph: {
    ...SITE_OPEN_GRAPH,
    title: PAGES.home.title,
    description: SITE.description,
  },
  twitter: {
    card: 'summary_large_image',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${fraunces.variable} ${dmSans.variable} ${cinzel.variable} h-full antialiased`}
      // O script do <head> põe atributos no <html> antes da hidratação.
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: HEAD_SCRIPT }} />
        <link
          rel="preload"
          as="image"
          href="/images/hero/hero_background2.webp"
          fetchPriority="high"
        />
      </head>
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(PERSON_JSON_LD) }}
        />
        <SplashScreen />
        <Nav />
        {children}
      </body>
    </html>
  )
}
