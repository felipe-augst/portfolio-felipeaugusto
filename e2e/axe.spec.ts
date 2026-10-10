import { expect, test } from './fixtures'

// Rotas com o shell de página ou com as seções compartilhadas, e a 404.
const ROUTES = ['/', '/stack', '/projects', '/pagina-que-nao-existe']

for (const route of ROUTES) {
  test(`${route} não tem violações de acessibilidade (axe)`, async ({ page, makeAxeBuilder }) => {
    await page.goto(route)
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()

    const { violations } = await makeAxeBuilder().analyze()

    expect(violations).toEqual([])
  })
}
