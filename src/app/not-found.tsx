import type { Metadata } from 'next'
import { ArrowRight } from 'lucide-react'
import { PageShell } from '@/components/layout/PageShell'
import { Button } from '@/components/ui/Button'

export const metadata: Metadata = {
  title: 'Página não encontrada',
}

export default function NotFound() {
  return (
    <PageShell eyebrow="Erro 404" title="Página não" titleHighlight="encontrada">
      <p className="mb-12 max-w-xl leading-relaxed text-sand-muted">
        O endereço que você acessou não existe ou mudou de lugar.
      </p>
      <Button href="/" trailingIcon={ArrowRight} className="self-start">
        Ir para a página inicial
      </Button>
    </PageShell>
  )
}
