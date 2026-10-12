'use client'

import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'

// Fração do item que precisa aparecer na área de rolagem da lista para ele virar o ativo. Com
// itens de 80% da largura, no máximo um passa disso por vez.
const ACTIVE_RATIO = 0.75

type ActiveItemListProps = {
  label: string
  className?: string
  children: ReactNode
}

// Lista que marca com `data-active` o item que aparece na própria área de rolagem. Os estilos de
// destaque dependem do atributo, então sem JS nenhum item fica em destaque.
export function ActiveItemList({ label, className, children }: ActiveItemListProps) {
  const listRef = useRef<HTMLUListElement>(null)

  useEffect(() => {
    const list = listRef.current
    if (!list) return
    const items = [...list.children]

    const observer = new IntersectionObserver(
      (entries) => {
        const active = entries.find((entry) => entry.intersectionRatio >= ACTIVE_RATIO)?.target
        if (!active) return
        for (const item of items) item.setAttribute('data-active', String(item === active))
      },
      { root: list, threshold: ACTIVE_RATIO },
    )
    for (const item of items) observer.observe(item)

    return () => observer.disconnect()
  }, [])

  return (
    // `role="list"` explícito: o Safari tira a semântica de lista de um <ul> sem marcadores.
    <ul ref={listRef} role="list" aria-label={label} className={className}>
      {children}
    </ul>
  )
}
