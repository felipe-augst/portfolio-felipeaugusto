'use client'

import { preload } from 'react-dom'
import type { ComponentProps } from 'react'

type PreloadedImageProps = ComponentProps<'img'> & {
  src: string
  alt: string
}

// `<img>` com preload no `<head>`, como o do `Image` do Next, para a imagem LCP. Fica num
// componente de cliente porque o React transforma todo `<img>` sem `loading="lazy"` de um Server
// Component numa dica de preload no payload RSC, e o prefetch da rota, feito a partir de outra
// página, baixaria a imagem.
export function PreloadedImage({ alt, ...props }: PreloadedImageProps) {
  preload(props.src, {
    as: 'image',
    imageSrcSet: props.srcSet,
    imageSizes: props.sizes,
    fetchPriority: props.fetchPriority,
  })

  // eslint-disable-next-line @next/next/no-img-element
  return <img {...props} alt={alt} />
}
