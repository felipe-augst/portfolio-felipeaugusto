import type { Locator, Page } from '@playwright/test'
import { expect, test } from './fixtures'

const TITLE = 'Vamos construir algo juntos?'

// Janela de observação do título: o limite de 5 s do WCAG 2.2.2, com folga.
const OBSERVATION_MS = 6_000
// Intervalo entre as leituras do texto pintado.
const SAMPLE_INTERVAL_MS = 100

function contactTitle(page: Page) {
  return page.getByRole('heading', { level: 2, name: TITLE })
}

// A tela de boas-vindas cobre a página na primeira visita da sessão, e o axe não confere o
// contraste do que está coberto. Ela é decorativa (aria-hidden): o locator usa as saudações.
// Ao terminar, ela pode ficar transparente, oculta ou sair do DOM.
async function waitForSplashToEnd(page: Page) {
  const splash = page.getByText(/^(Bem-vindo ao|Welcome to|Willkommen in) /)
  await expect
    .poll(
      () =>
        splash.evaluateAll((elements) =>
          elements.some((element) =>
            element.checkVisibility({ opacityProperty: true, visibilityProperty: true }),
          ),
        ),
      { timeout: 10_000 },
    )
    .toBe(false)
}

// A parte animada do título fica fora da árvore de acessibilidade.
function animatedPart(title: Locator) {
  return title.locator('[aria-hidden="true"]')
}

// Espera o elemento ficar com opacidade total, somando a dos ancestrais: a animação de entrada
// das seções começa com opacidade 0.
async function expectFullyOpaque(locator: Locator) {
  await expect
    .poll(() =>
      locator.evaluate((element) => {
        let opacity = 1
        for (let node: Element | null = element; node; node = node.parentElement) {
          opacity *= Number(getComputedStyle(node).opacity)
        }
        return opacity
      }),
    )
    .toBe(1)
}

// Texto que o elemento pinta: só os trechos sem `display: none`, `visibility: hidden` ou
// opacidade 0, nele ou num ancestral.
function paintedText(locator: Locator) {
  return locator.evaluate((root) => {
    const parts: string[] = []
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
      const visible = node.parentElement?.checkVisibility({
        opacityProperty: true,
        visibilityProperty: true,
      })
      if (visible) parts.push(node.textContent ?? '')
    }
    return parts.join(' ').replace(/\s+/g, ' ').trim()
  })
}

// Lê o texto pintado a cada SAMPLE_INTERVAL_MS até `untilMs` depois de `start` e devolve os
// instantes, em ms desde `start`, em que ele mudou.
async function watchChanges(locator: Locator, start: number, untilMs: number): Promise<number[]> {
  const changes: number[] = []
  let previous = await paintedText(locator)

  while (Date.now() - start < untilMs) {
    await locator.page().waitForTimeout(SAMPLE_INTERVAL_MS)
    const current = await paintedText(locator)
    if (current !== previous) changes.push(Date.now() - start)
    previous = current
  }

  return changes
}

test('o título do contato é lido como a frase completa', async ({ page }) => {
  await page.goto('/')

  const heading = page.locator('#contact').getByRole('heading', { level: 2 })

  await expect(heading).toHaveAccessibleName(TITLE)
})

test('a palavra visível do título do contato muda só depois que ele aparece e para antes de 6s', async ({
  page,
}) => {
  test.setTimeout(60_000)
  await page.goto('/')
  // O título começa fora da tela. Uma rotação que começasse no carregamento já teria terminado.
  await page.waitForTimeout(OBSERVATION_MS)

  const title = contactTitle(page)
  await title.scrollIntoViewIfNeeded()
  const start = Date.now()
  await expectFullyOpaque(title)
  const changes = await watchChanges(animatedPart(title), start, OBSERVATION_MS + 2_000)

  expect(changes.length, 'a palavra mudou depois que o título apareceu').toBeGreaterThan(0)
  expect(changes.at(-1), `instantes das mudanças: ${changes.join(', ')}`).toBeLessThan(
    OBSERVATION_MS,
  )
})

test('a seção de contato não tem violações de acessibilidade (axe)', async ({
  page,
  makeAxeBuilder,
}) => {
  await page.goto('/')
  await waitForSplashToEnd(page)
  const title = contactTitle(page)
  await title.scrollIntoViewIfNeeded()
  await expectFullyOpaque(title)

  const { violations } = await makeAxeBuilder().include('#contact').analyze()

  expect(violations).toEqual([])
})

test.describe('com movimento reduzido', () => {
  test.use({ reducedMotion: 'reduce' })

  test('a palavra visível do título do contato não muda ao longo de 6s', async ({ page }) => {
    test.setTimeout(60_000)
    await page.goto('/')
    const title = contactTitle(page)
    await title.scrollIntoViewIfNeeded()
    await expectFullyOpaque(title)

    expect(await watchChanges(animatedPart(title), Date.now(), OBSERVATION_MS)).toEqual([])
  })
})
