import type { ReactNode } from 'react'
import { BackButton } from '@/components/ui/BackButton'
import { SectionEyebrow } from '@/components/ui/SectionEyebrow'
import { SectionHeading } from '@/components/ui/SectionHeading'

type PageShellProps = {
  eyebrow: string
  title: string
  titleHighlight?: string
  children: ReactNode
}

// Estrutura das páginas fora da home: a região principal, o único `<h1>` da rota e o "Voltar".
export function PageShell({ eyebrow, title, titleHighlight, children }: PageShellProps) {
  return (
    <main className="relative flex min-h-screen flex-col items-center overflow-hidden bg-bg px-6 py-16 md:px-12">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-linear-to-t from-bg-2 to-transparent"
      />

      <div className="relative z-10 mt-15 flex w-full max-w-5xl flex-col items-start md:mt-20">
        <BackButton className="mb-12" />
        <SectionEyebrow className="mb-4">{eyebrow}</SectionEyebrow>
        <SectionHeading as="h1" title={title} highlight={titleHighlight} className="mb-16" />
        {children}
      </div>
    </main>
  )
}
