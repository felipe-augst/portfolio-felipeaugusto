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

test('o botão Menu declara que abre um diálogo, qual diálogo controla e se está expandido', async ({
  page,
}) => {
  await page.goto('/')
  const button = menuButton(page)

  await expect(button).toHaveAttribute('aria-haspopup', 'dialog')
  await expect(button).toHaveAttribute('aria-expanded', 'false')
  const controls = await button.getAttribute('aria-controls')
  expect(controls, 'aria-controls').toBeTruthy()

  await button.click()

  await expect(menuDialog(page)).toHaveAttribute('id', controls ?? '')
  await expect(button).toHaveAttribute('aria-expanded', 'true')
})

test('pelo teclado, o foco entra no menu, fica preso nele e volta ao botão Menu com Escape', async ({
  page,
}) => {
  await page.goto('/')
  const button = menuButton(page)
  const dialog = menuDialog(page)
  const focusIsInDialog = () =>
    dialog.evaluate((element) => element.contains(document.activeElement))

  await button.focus()
  await page.keyboard.press('Enter')

  await expect(dialog).toBeVisible()
  await expect(button).toHaveAttribute('aria-expanded', 'true')
  expect(await focusIsInDialog(), 'foco dentro do diálogo ao abrir').toBe(true)

  // Mais Tabs do que elementos focáveis no diálogo: o foco dá a volta sem sair dele.
  const focusableCount = await dialog.locator('a, button').count()
  for (let press = 1; press <= focusableCount + 2; press++) {
    await page.keyboard.press('Tab')
    expect(await focusIsInDialog(), `foco dentro do diálogo depois de ${press} Tab`).toBe(true)
  }

  await page.keyboard.press('Escape')

  await expect(dialog).toBeHidden()
  await expect(button).toBeFocused()
  await expect(button).toHaveAttribute('aria-expanded', 'false')
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
