import type { Page } from '@playwright/test'
import { expect, test } from './fixtures'
import { menuButton, menuDialog } from './menu'
import { markSplashSeen } from './session'

// Itens do menu e a seção da home de cada um.
const MENU_ITEMS = [
  { name: 'Sobre', href: '/#about', sectionId: 'about' },
  { name: 'Projetos', href: '/#projects', sectionId: 'projects' },
  { name: 'Contato', href: '/#contact', sectionId: 'contact' },
]

declare global {
  interface Window {
    navigationMarker?: boolean
  }
}

function logo(page: Page) {
  return page.getByRole('banner').getByRole('link', { name: 'Felipe.DEV' })
}

// Marca a janela: a marca só sobrevive a navegações sem recarregar a página.
async function markWindow(page: Page) {
  await page.evaluate(() => {
    window.navigationMarker = true
  })
}

function windowWasKept(page: Page) {
  return page.evaluate(() => window.navigationMarker === true)
}

test.beforeEach(async ({ page }) => {
  await markSplashSeen(page)
})

test('os itens do menu apontam para as seções da home por caminho absoluto, e o logo para a home', async ({
  page,
}) => {
  await page.goto('/stack')
  await expect(logo(page)).toHaveAttribute('href', '/')

  await menuButton(page).click()
  for (const { name, href } of MENU_ITEMS) {
    await expect(menuDialog(page).getByRole('link', { name })).toHaveAttribute('href', href)
  }
})

for (const { name, sectionId } of MENU_ITEMS) {
  test(`a partir de /stack, "${name}" no menu leva à seção da home sem recarregar a página`, async ({
    page,
  }) => {
    await page.goto('/stack')
    await markWindow(page)

    await menuButton(page).click()
    await menuDialog(page).getByRole('link', { name }).click()

    await expect(page).toHaveURL(new RegExp(`/#${sectionId}$`))
    await expect(menuDialog(page)).toBeHidden()
    await expect(page.locator(`#${sectionId}`)).toBeInViewport()
    expect(await windowWasKept(page), 'sem recarregar a página').toBe(true)
  })
}

test('a partir de /stack, o logo leva à home sem recarregar a página', async ({ page }) => {
  await page.goto('/stack')
  await markWindow(page)

  await logo(page).click()

  await expect(page).toHaveURL(/\/$/)
  await expect(page.getByRole('heading', { level: 1, name: 'Felipe Augusto' })).toBeVisible()
  expect(await windowWasKept(page), 'sem recarregar a página').toBe(true)
})
