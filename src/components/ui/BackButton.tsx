'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { hasClientNavigation } from '@/hooks/use-client-navigation'

type BackButtonProps = {
  fallbackHref?: string
  label?: string
  className?: string
}

export function BackButton({ fallbackHref = '/', label = 'Voltar', className }: BackButtonProps) {
  const router = useRouter()

  // O histórico só serve quando a entrada anterior é do site. Na entrada direta (buscador, link
  // compartilhado), ela é de outro site, e "Voltar" vai para o fallback.
  const handleClick = () => {
    if (hasClientNavigation()) {
      router.back()
    } else {
      router.push(fallbackHref)
    }
  }

  return (
    <Button variant="ghost" leadingIcon={ArrowLeft} onClick={handleClick} className={className}>
      {label}
    </Button>
  )
}
