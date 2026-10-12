import type { Page } from '@playwright/test'
import { expect, test } from './fixtures'

// Arquivo da imagem de fundo do hero, pedido direto ou pelo otimizador (`/_next/image?url=`).
const HERO_IMAGE = '/images/hero/hero_background2.webp'

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
