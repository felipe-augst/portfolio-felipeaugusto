import { Hero } from '@/components/sections/Hero'
import { About } from '@/components/sections/About'
import { Contact } from '@/components/sections/Contact'
import { Footer } from '@/components/layout/Footer'
import { FeaturedProjects } from '@/components/sections/FeaturedProjects'
import { RevealOnScroll } from '@/components/ui/RevealOnScroll'
import { PAGES } from '@/data/site'
import { buildPageMetadata } from '@/lib/metadata'

export const metadata = buildPageMetadata(PAGES.home)

export default function Home() {
  return (
    <>
      <main>
        <Hero />
        <RevealOnScroll delayMs={100}>
          <About />
        </RevealOnScroll>
        <RevealOnScroll delayMs={200}>
          <FeaturedProjects />
        </RevealOnScroll>
        <RevealOnScroll delayMs={300}>
          <Contact />
        </RevealOnScroll>
      </main>
      <Footer />
    </>
  )
}
