import type { Metadata } from 'next'
import { Fraunces, DM_Sans, Cinzel } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import '@/app/globals.css'
import { SplashScreen } from '@/components/layout/SplashScreen'
import { Nav } from '@/components/layout/Nav'
import { NavigationTracker } from '@/components/layout/NavigationTracker'
import { PAGES, SITE } from '@/data/site'
import { HEAD_SCRIPT } from '@/lib/head-script'
import { PERSON_JSON_LD, serializeJsonLd } from '@/lib/json-ld'
import { SITE_OPEN_GRAPH } from '@/lib/metadata'

const fraunces = Fraunces({
  variable: '--font-fraunces',
  subsets: ['latin'],
  display: 'swap',
  weight: ['300', '400'],
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
      </head>
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(PERSON_JSON_LD) }}
        />
        <SplashScreen />
        <NavigationTracker />
        <Nav />
        {children}
        {/* Web Vitals reais e visitas, medidos pela Vercel em produção. */}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
