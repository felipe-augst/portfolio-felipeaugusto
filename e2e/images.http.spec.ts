import { expect, test } from './fixtures'
import { getImagePreloads } from './html'

// Arquivo da imagem de fundo do hero, a imagem LCP da home.
const HERO_IMAGE = '/images/hero/hero_background2.webp'

test('a home faz preload só da imagem de fundo do hero', async ({ request }) => {
  const preloads = getImagePreloads(await (await request.get('/')).text())

  expect(preloads).toHaveLength(1)
  expect(decodeURIComponent(preloads[0] ?? '')).toContain(HERO_IMAGE)
})

for (const route of ['/stack', '/projects']) {
  test(`${route} não faz preload de nenhuma imagem`, async ({ request }) => {
    const preloads = getImagePreloads(await (await request.get(route)).text())

    expect(preloads).toEqual([])
  })
}
