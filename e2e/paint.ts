import type { Locator } from '@playwright/test'

// Leitura do que o navegador pinta, para os testes de animação e de layout.

/** Opacidade efetiva do elemento: a dele multiplicada pela de todos os ancestrais. */
export function effectiveOpacity(locator: Locator) {
  return locator.evaluate((element) => {
    let opacity = 1
    for (let node: Element | null = element; node; node = node.parentElement) {
      opacity *= Number(getComputedStyle(node).opacity)
    }
    return opacity
  })
}

/** Se o elemento é pintado: visível e não recortado por inteiro por um ancestral com overflow. */
export function isPainted(locator: Locator) {
  return locator.evaluate((element) => {
    if (!element.checkVisibility({ opacityProperty: true, visibilityProperty: true })) return false
    const rect = element.getBoundingClientRect()
    for (let node = element.parentElement; node; node = node.parentElement) {
      if (getComputedStyle(node).overflow === 'visible') continue
      const clip = node.getBoundingClientRect()
      const overlaps =
        rect.top < clip.bottom &&
        rect.bottom > clip.top &&
        rect.left < clip.right &&
        rect.right > clip.left
      if (!overlaps) return false
    }
    return true
  })
}

/** Se o elemento, ou um ancestral, está deslocado por transformação (translate, scale etc.). */
export function isDisplaced(locator: Locator) {
  return locator.evaluate((element) => {
    for (let node: Element | null = element; node; node = node.parentElement) {
      const { transform, translate, scale, rotate } = getComputedStyle(node)
      if ([transform, translate, scale, rotate].some((value) => value !== 'none')) return true
    }
    return false
  })
}
