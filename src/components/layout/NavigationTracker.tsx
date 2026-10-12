'use client'

import { useTrackClientNavigation } from '@/hooks/use-client-navigation'

// Registra as navegações client-side, para o "Voltar" saber se a entrada anterior do histórico é
// do site. Fica no layout raiz, presente em todas as rotas, e não renderiza nada.
export function NavigationTracker() {
  useTrackClientNavigation()
  return null
}
