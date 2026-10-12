'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

// Se a aplicação já fez uma navegação client-side neste documento. Uma carga completa da página
// (entrada direta, recarga) começa sem nenhuma.
let navigatedInApp = false

/** Se houve navegação client-side nesta sessão, isto é, se a entrada anterior do histórico é do site. */
export function hasClientNavigation() {
  return navigatedInApp
}

/** Registra as navegações client-side. Fica num componente presente em todas as rotas. */
export function useTrackClientNavigation() {
  const pathname = usePathname()
  const initialPathname = useRef(pathname)

  useEffect(() => {
    if (pathname !== initialPathname.current) navigatedInApp = true
  }, [pathname])
}
