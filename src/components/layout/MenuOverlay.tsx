'use client'

import { useId, useRef, useState } from 'react'
import type { MouseEvent, ReactNode } from 'react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/cn'

type MenuOverlayProps = {
  // Conteúdo do menu, renderizado no servidor.
  children: ReactNode
}

// Botão Menu e o diálogo modal nativo que ele abre. O <dialog> com showModal() traz a camada
// superior, o fundo inerte, o Escape e a devolução do foco ao botão.
export function MenuOverlay({ children }: MenuOverlayProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [open, setOpen] = useState(false)
  const dialogId = useId()

  function openMenu() {
    dialogRef.current?.showModal()
    setOpen(true)
  }

  // O evento `close` do diálogo atualiza o estado, inclusive no Escape.
  function closeMenu() {
    dialogRef.current?.close()
  }

  // Seguir um link do menu fecha o diálogo. O que abre em nova aba deixa o menu aberto.
  function handleClick(event: MouseEvent<HTMLDialogElement>) {
    const link = event.target instanceof Element ? event.target.closest('a') : null
    if (link && link.target !== '_blank') closeMenu()
  }

  return (
    <>
      <Button
        variant="outline"
        onClick={openMenu}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={dialogId}
      >
        Menu
      </Button>

      <dialog
        ref={dialogRef}
        id={dialogId}
        aria-label="Menu"
        onClose={() => setOpen(false)}
        onClick={handleClick}
        className={cn(
          'fixed inset-0 m-0 size-full max-h-none max-w-none border-0 p-0 backdrop:bg-transparent',
          'bg-bg text-sand open:flex flex-col items-center justify-center gap-5',
          // Fade na abertura e no fechamento: `display` e `overlay` trocam só no fim do fechamento.
          'opacity-0 open:opacity-100 starting:open:opacity-0',
          'transition-[opacity,display,overlay] transition-discrete duration-500',
        )}
      >
        <Button
          variant="outline"
          onClick={closeMenu}
          className="absolute top-7 right-7 md:right-12"
        >
          Fechar
        </Button>
        {children}
      </dialog>
    </>
  )
}
