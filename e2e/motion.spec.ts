import type { Page } from '@playwright/test'
import { expect, test } from './fixtures'
import { effectiveOpacity } from './paint'

// Seções da home: o hero, que traz o <h1>, e as seções com âncora.
function homeSections(page: Page) {
  return [
    {
      name: 'hero',
      locator: page.locator('section').filter({ has: page.getByRole('heading', { level: 1 }) }),
    },
    ...['about', 'projects', 'contact'].map((id) => ({
      name: id,
      locator: page.locator(`#${id}`),
    })),
  ]
}

test('as seções abaixo da dobra começam ocultas e ficam visíveis ao rolar até elas', async ({
  page,
}) => {
  await page.goto('/')
  const viewport = page.viewportSize()
  if (!viewport) throw new Error('o perfil não define viewport')

  const belowTheFold = []
  for (const section of homeSections(page)) {
    const box = await section.locator.boundingBox()
    if (box && box.y >= viewport.height) belowTheFold.push(section)
  }
  expect(belowTheFold.length, 'alguma seção começa abaixo da dobra').toBeGreaterThan(0)

  for (const { name, locator } of belowTheFold) {
    expect(await effectiveOpacity(locator), `${name} antes de rolar`).toBe(0)
  }
  for (const { name, locator } of belowTheFold) {
    await locator.scrollIntoViewIfNeeded()
    await expect.poll(() => effectiveOpacity(locator), { message: name }).toBe(1)
  }
})

test.describe('sem JavaScript', () => {
  test.use({ javaScriptEnabled: false })

  test('todas as seções da home ficam com opacidade visível', async ({ page }) => {
    await page.goto('/')

    for (const { name, locator } of homeSections(page)) {
      expect(await effectiveOpacity(locator), name).toBe(1)
    }
  })
})
