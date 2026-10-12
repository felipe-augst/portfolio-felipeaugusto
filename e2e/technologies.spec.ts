import type { Locator } from '@playwright/test'
import { expect, test } from './fixtures'

// Tecnologias de cada categoria, pelo nome da categoria e em ordem alfabética. A categoria é um
// título, e as tecnologias são os itens da lista que leva o nome desse título.
async function technologiesByCategory(scope: Locator, headingLevel: number) {
  const categories: Record<string, string[]> = {}
  for (const title of await scope.getByRole('heading', { level: headingLevel }).allTextContents()) {
    const items = scope.getByRole('list', { name: title, exact: true }).getByRole('listitem')
    categories[title] = (await items.allTextContents()).map((name) => name.trim()).sort()
  }
  return categories
}

test('a seção Sobre e /stack listam as mesmas tecnologias em cada categoria', async ({ page }) => {
  await page.goto('/')
  // A âncora da seção, a mesma do item "Sobre" do menu.
  const about = await technologiesByCategory(page.locator('#about'), 3)

  await page.goto('/stack')
  const stack = await technologiesByCategory(page.getByRole('main'), 2)

  expect(Object.keys(about), 'categorias, na ordem').toEqual(Object.keys(stack))
  expect(Object.keys(stack).length, 'categorias em /stack').toBeGreaterThan(0)
  for (const [category, technologies] of Object.entries(stack)) {
    expect(technologies.length, `tecnologias de ${category} em /stack`).toBeGreaterThan(0)
  }
  expect(about).toEqual(stack)
})
