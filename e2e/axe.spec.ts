import { expect, test } from './fixtures'
import { menuButton, menuDialog } from './menu'
import { effectiveOpacity } from './paint'
import { markSplashSeen } from './session'

// Rotas com o shell de página ou com as seções compartilhadas, e a 404.
const ROUTES = ['/', '/stack', '/projects', '/pagina-que-nao-existe']

for (const route of ROUTES) {
  test(`${route} não tem violações de acessibilidade (axe)`, async ({ page, makeAxeBuilder }) => {
    await page.goto(route)
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()

    const { violations } = await makeAxeBuilder().analyze()

    expect(violations).toEqual([])
  })

  test(`${route} com o menu aberto não tem violações de acessibilidade (axe)`, async ({
    page,
    makeAxeBuilder,
  }) => {
    // Sem a tela de boas-vindas por cima do botão Menu.
    await markSplashSeen(page)
    await page.goto(route)
    await menuButton(page).click()
    const dialog = menuDialog(page)
    await expect(dialog).toBeVisible()
    // No meio do fade-in, o texto do menu ainda não tem o contraste final.
    await expect.poll(() => effectiveOpacity(dialog)).toBe(1)

    const { violations } = await makeAxeBuilder().analyze()

    expect(violations).toEqual([])
  })
}
