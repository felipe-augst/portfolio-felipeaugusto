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

test('com o menu aberto, a página atrás não rola', async ({ page }) => {
  await page.goto('/')
  const viewport = page.viewportSize()
  if (!viewport) throw new Error('perfil sem viewport')
  await page.mouse.move(viewport.width / 2, viewport.height / 2)

  // Com o menu fechado, a roda do mouse rola a página.
  await page.mouse.wheel(0, 600)
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(0)

  await menuButton(page).click()
  await expect(menuDialog(page)).toBeVisible()
  const scrollBefore = await page.evaluate(() => window.scrollY)
  await page.mouse.wheel(0, 600)
  await page.waitForTimeout(500)

  expect(await page.evaluate(() => window.scrollY)).toBe(scrollBefore)
})

test('clicar num item do menu navega e fecha o menu', async ({ page }) => {
  await page.goto('/')
  await menuButton(page).click()

  await menuDialog(page).getByRole('link', { name: 'Sobre' }).click()

  await expect(page).toHaveURL(/\/#about$/)
  await expect(menuDialog(page)).toBeHidden()
})

test('o menu abre e fecha com transição de opacidade', async ({ page }) => {
  // A transição dura menos que o intervalo entre duas leituras da página sob carga. Um script
  // registra o início de cada transição de opacidade do diálogo, aberto ou fechado.
  await page.addInitScript(() => {
    const runs: string[] = []
    Object.assign(window, { dialogOpacityTransitions: runs })
    document.addEventListener('transitionrun', (event) => {
      const target = event.target
      if (event.propertyName !== 'opacity' || !(target instanceof HTMLDialogElement)) return
      runs.push(target.open ? 'abrindo' : 'fechando')
    })
  })
  const transitions = () =>
    page.evaluate(
      () => (window as unknown as { dialogOpacityTransitions: string[] }).dialogOpacityTransitions,
    )

  await page.goto('/')
  await menuButton(page).click()
  await expect.poll(transitions).toEqual(['abrindo'])

  await menuDialog(page).getByRole('button', { name: 'Fechar' }).click()
  await expect.poll(transitions).toEqual(['abrindo', 'fechando'])
})
