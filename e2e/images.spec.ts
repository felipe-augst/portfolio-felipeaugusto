import type { Locator, Page } from '@playwright/test'
import { expect, test } from './fixtures'

// Arquivo da imagem de fundo do hero, pedido direto ou pelo otimizador (`/_next/image?url=`).
const HERO_IMAGE = '/images/hero/hero_background2.webp'

// Listas de projetos: os destaques da home e a página com todos os projetos.
const PROJECT_LISTS = [
  { route: '/', name: 'Projetos em destaque' },
  { route: '/projects', name: 'Todos os projetos' },
]

// "~2×" a largura exibida × DPR, com 10% de folga para o degrau entre as larguras do srcset.
const MAX_OVERSIZE = 2.2

// Para cada imagem raster (não SVG) dos cards visíveis: largura intrínseca do arquivo carregado
// dividida pela largura exibida em pixels do dispositivo.
function visibleCardImageOversize(list: Locator) {
  return list.evaluate(async (element) => {
    const visibleItems = [...element.children].filter((item) => {
      const rect = item.getBoundingClientRect()
      return rect.right > 0 && rect.left < innerWidth && rect.bottom > 0 && rect.top < innerHeight
    })
    const images = visibleItems
      .flatMap((item) => [...item.querySelectorAll('img')])
      .filter((img) => !new URL(img.currentSrc || img.src).pathname.endsWith('.svg'))

    return Promise.all(
      images.map(async (img) => {
        await img.decode()
        // Um <img> sem srcset reporta a largura real do arquivo, sem a correção de densidade.
        const file = new Image()
        file.src = img.currentSrc
        await file.decode()
        const displayed = img.offsetWidth * devicePixelRatio
        return {
          image: decodeURIComponent(img.currentSrc),
          oversize: Number((file.naturalWidth / displayed).toFixed(2)),
        }
      }),
    )
  })
}

// Abre a rota e devolve as requisições da imagem do hero feitas até a rede ficar ociosa.
async function heroImageRequests(page: Page, route: string) {
  const requests: string[] = []
  page.on('request', (request) => {
    if (decodeURIComponent(request.url()).includes(HERO_IMAGE)) requests.push(request.url())
  })

  await page.goto(route)
  await page.waitForLoadState('networkidle')

  return requests
}

test('a home requisita a imagem do hero uma única vez', async ({ page }) => {
  expect(await heroImageRequests(page, '/')).toHaveLength(1)
})

for (const route of ['/stack', '/projects']) {
  test(`${route} não requisita a imagem do hero`, async ({ page }) => {
    expect(await heroImageRequests(page, route)).toEqual([])
  })
}

for (const { route, name } of PROJECT_LISTS) {
  test(`${route}: a imagem de cada card visível tem no máximo ~2× a largura exibida`, async ({
    page,
  }) => {
    await page.goto(route)
    const list = page.getByRole('list', { name })
    await list.scrollIntoViewIfNeeded()

    const images = await visibleCardImageOversize(list)

    expect(images).not.toEqual([])
    for (const { image, oversize } of images) {
      expect(oversize, image).toBeLessThanOrEqual(MAX_OVERSIZE)
    }
  })
}
