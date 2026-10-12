import { getImageProps } from 'next/image'
import type { ImageProps } from 'next/image'
import { PreloadedImage } from '@/components/ui/PreloadedImage'

// Sem placeholder, que precisaria de JS para sair, e sem eventos, que não existem no servidor. O
// carregamento é preguiçoso, exceto com `preload`.
type ServerImageProps = Omit<
  ImageProps,
  | 'placeholder'
  | 'blurDataURL'
  | 'priority'
  | 'loading'
  | 'onLoad'
  | 'onLoadingComplete'
  | 'onError'
>

// Imagem do `next/image` montada no servidor com `getImageProps`: o `<img>` sai pronto no HTML,
// com `srcSet`, `sizes` e carregamento preguiçoso, e não hidrata. O componente `Image` do Next é
// uma ilha de cliente e custava cerca de 5 kB no JS da home. Com `preload`, a imagem ganha um
// `<link rel="preload">` no `<head>` e é desenhada pela ilha `PreloadedImage`.
export function ServerImage({ alt, preload = false, ...props }: ServerImageProps) {
  const { props: img } = getImageProps({ ...props, alt, preload })

  if (preload) return <PreloadedImage {...img} alt={alt} />

  // eslint-disable-next-line @next/next/no-img-element
  return <img {...img} alt={alt} />
}
