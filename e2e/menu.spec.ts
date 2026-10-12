import type { Locator } from '@playwright/test'
import { expect, test } from './fixtures'
import { menuButton, menuDialog } from './menu'
import { markSplashSeen } from './session'

// Contorno que o elemento pinta com foco de teclado (`:focus-visible`). Sem mouse antes, o foco
// programático conta como foco de teclado. A leitura espera as transições do elemento, porque a
// cor do contorno também transiciona (`transition-colors`).
async function focusRing(locator: Locator) {
  await locator.focus()
  return locator.evaluate(async (element) => {
    await Promise.all(element.getAnimations().map((animation) => animation.finished))
    const { outlineStyle, outlineColor, outlineWidth, outlineOffset } = getComputedStyle(element)
    return {
      focusVisible: element.matches(':focus-visible'),
      outlineStyle,
      outlineColor,
      outlineWidth,
      outlineOffset,
    }
  })
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
  // Depois do último item, o Tab do diálogo modal nativo passa pela interface do navegador (o
  // documento perde o foco) e volta ao primeiro item. O que não pode é um elemento da página fora
  // do diálogo receber o foco.
  const focusIsOnPageOutsideDialog = () =>
    dialog.evaluate((element) => document.hasFocus() && !element.contains(document.activeElement))

  await button.focus()
  await page.keyboard.press('Enter')

  await expect(dialog).toBeVisible()
  await expect(button).toHaveAttribute('aria-expanded', 'true')
  expect(await focusIsInDialog(), 'foco dentro do diálogo ao abrir').toBe(true)

  // Mais Tabs do que elementos focáveis no diálogo: o foco dá a volta e continua nele.
  const focusableCount = await dialog.locator('a, button').count()
  for (let press = 1; press <= focusableCount + 2; press++) {
    await page.keyboard.press('Tab')
    expect(await focusIsOnPageOutsideDialog(), `foco fora do diálogo depois de ${press} Tab`).toBe(
      false,
    )
  }
  expect(await focusIsInDialog(), 'foco de volta ao diálogo').toBe(true)

  await page.keyboard.press('Escape')

  await expect(dialog).toBeHidden()
  await expect(button).toBeFocused()
  await expect(button).toHaveAttribute('aria-expanded', 'false')
})

test('o cabeçalho e o menu têm o mesmo foco visível dos botões da página', async ({ page }) => {
  await page.goto('/')
  const reference = await focusRing(page.getByRole('link', { name: 'Baixar CV' }).first())
  expect(reference).toMatchObject({ focusVisible: true, outlineStyle: 'solid' })

  const logo = page.getByRole('banner').getByRole('link')
  expect(await focusRing(logo), 'logo').toEqual(reference)
  expect(await focusRing(menuButton(page)), 'botão Menu').toEqual(reference)

  // Aberto pelo teclado, para o foco dentro do diálogo continuar sendo de teclado.
  await page.keyboard.press('Enter')
  const dialog = menuDialog(page)
  await expect(dialog).toBeVisible()
  const controls = await dialog.locator('a, button').all()
  expect(controls.length).toBeGreaterThan(0)
  for (const control of controls) {
    expect(await focusRing(control), (await control.textContent()) ?? '').toEqual(reference)
  }
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
