import { expect, test } from './fixtures'
import { getImagePreloads, getImages } from './html'

// Arquivo da imagem de fundo do hero, a imagem LCP da home.
const HERO_IMAGE = '/images/hero/hero_background2.webp'

test('a home faz preload só da imagem de fundo do hero', async ({ request }) => {
  const preloads = getImagePreloads(await (await request.get('/')).text())

  expect(preloads).toHaveLength(1)
  expect(decodeURIComponent(preloads[0] ?? '')).toContain(HERO_IMAGE)
})

test('a imagem de fundo do hero é decorativa, com alt vazio', async ({ request }) => {
  const heroImages = getImages(await (await request.get('/')).text()).filter(({ src }) =>
    src.includes(HERO_IMAGE),
  )

  expect(heroImages).toEqual([{ src: expect.any(String), alt: '' }])
})

for (const route of ['/stack', '/projects']) {
  test(`${route} não faz preload de nenhuma imagem`, async ({ request }) => {
    const preloads = getImagePreloads(await (await request.get(route)).text())

    expect(preloads).toEqual([])
  })
}
