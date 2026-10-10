import type { Metadata } from 'next'
import { Fraunces, DM_Sans, Cinzel } from 'next/font/google'
import './globals.css'
import { cookies } from 'next/headers'
import { Skeleton } from '@/components/layout/Skeleton'
import { Nav } from '@/components/layout/Nav'
import { SITE } from '@/data/site'
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

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: 'Felipe Augusto | Fullstack Developer',
    template: '%s | Felipe Augusto',
  },
  description:
    'Fullstack Developer construindo produtos digitais com React, Next.js, TypeScript e Node.js. Portfolio de projetos em produção com foco em performance, acessibilidade e qualidade de código.',
  keywords: [
    'Fullstack Developer',
    'React',
    'Next.js',
    'TypeScript',
    'Node.js',
    'Portfolio',
    'Felipe Augusto',
    'Desenvolvedor Fullstack',
    'Jundiaí',
  ],
  authors: [{ name: 'Felipe Augusto', url: 'https://devfelipeaugusto.com.br' }],
  creator: 'Felipe Augusto',
  openGraph: {
    ...SITE_OPEN_GRAPH,
    title: 'Felipe Augusto — Fullstack Developer',
    description:
      'Fullstack Developer construindo produtos digitais com React, Next.js, TypeScript e Node.js.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Felipe Augusto — Fullstack Developer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Felipe Augusto — Fullstack Developer',
    description:
      'Fullstack Developer construindo produtos digitais com React, Next.js, TypeScript e Node.js.',
    images: ['/og-image.png'],
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const cookieStore = await cookies()
  const skeletonShown = cookieStore.get('skeleton_shown')?.value === '1'

  return (
    <html
      lang="pt-BR"
      className={`${fraunces.variable} ${dmSans.variable} ${cinzel.variable} h-full antialiased`}
    >
      <head>
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
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Person',
              name: 'Felipe Augusto',
              url: 'https://devfelipeaugusto.com.br',
              image: 'https://devfelipeaugusto.com.br/og-image.png',
              sameAs: [
                'https://github.com/felipe-augst',
                'https://www.linkedin.com/in/felipeaugst/',
              ],
              jobTitle: 'Fullstack Developer',
              address: {
                '@type': 'PostalAddress',
                addressLocality: 'Jundiaí',
                addressRegion: 'SP',
                addressCountry: 'BR',
              },
              knowsAbout: ['React', 'Next.js', 'TypeScript', 'Node.js', 'Fullstack Development'],
            }),
          }}
        />
        <Skeleton initialShown={skeletonShown} />
        <Nav />
        {children}
      </body>
    </html>
  )
}
