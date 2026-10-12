import type { Page } from '@playwright/test'
import { expect, test } from './fixtures'
import { markSplashSeen } from './session'

function menuButton(page: Page) {
  return page.getByRole('button', { name: 'Menu' })
}

function menuDialog(page: Page) {
  return page.getByRole('dialog', { name: 'Menu' })
}

test.beforeEach(async ({ page }) => {
  await markSplashSeen(page)
})

test('o botão Menu abre o menu como diálogo modal, com nome acessível e fundo inerte', async ({
  page,
}) => {
  await page.goto('/')
  await menuButton(page).click()

  const dialog = menuDialog(page)
  await expect(dialog).toBeVisible()
  // `:modal` só vale para o diálogo aberto com showModal().
  expect(await dialog.evaluate((element) => element.matches(':modal'))).toBe(true)

  // Fundo inerte: o botão Menu, atrás do diálogo, não recebe foco.
  await menuButton(page).focus()
  await expect(menuButton(page)).not.toBeFocused()
})
