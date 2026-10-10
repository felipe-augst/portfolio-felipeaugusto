import type { Page } from '@playwright/test'
import { expect, test } from './fixtures'

// A tela de boas-vindas dura 3,5 s mais 0,7 s de fade, contados da hidratação.
const SPLASH_DURATION_MS = 5_000
// Limite para a tela sumir: a duração mais a hidratação, com folga para máquina lenta (CI).
const SPLASH_HIDE_TIMEOUT_MS = 10_000

// A tela é decorativa (aria-hidden), sem papel nem nome acessível: o locator usa as saudações.
function splashScreen(page: Page) {
  return page.getByText(/^(Bem-vindo ao|Welcome to|Willkommen in) /)
}

test('nenhuma requisição além de GET acontece durante ou depois do carregamento', async ({
  page,
}) => {
  const nonGetRequests: string[] = []
  page.on('request', (request) => {
    if (request.method() !== 'GET') nonGetRequests.push(`${request.method()} ${request.url()}`)
  })

  // A primeira página da sessão mostra a tela de boas-vindas; a segunda, não. Espera em tempo real
  // o tempo da tela: com relógio falso, o tempo pode avançar antes de a hidratação registrar os timers.
  await page.goto('/')
  await expect(splashScreen(page)).toBeHidden({ timeout: SPLASH_HIDE_TIMEOUT_MS })
  await page.goto('/stack')
  await page.waitForTimeout(SPLASH_DURATION_MS)

  expect(nonGetRequests).toEqual([])
})

test('em contexto novo, a tela de boas-vindas aparece e some', async ({ page }) => {
  await page.goto('/')

  await expect(splashScreen(page)).toBeVisible()
  await expect(splashScreen(page)).toBeHidden({ timeout: SPLASH_HIDE_TIMEOUT_MS })
})

test('em nova página do mesmo contexto, a tela de boas-vindas nunca fica visível', async ({
  page,
}) => {
  await page.goto('/')
  await expect(splashScreen(page)).toBeHidden({ timeout: SPLASH_HIDE_TIMEOUT_MS })

  // A flag fica no sessionStorage, que é da aba: a nova página é uma nova navegação na mesma aba.
  // Confere na hora (isVisible não espera), antes da hidratação, depois do load e depois do tempo
  // que a tela duraria.
  await page.goto('/stack', { waitUntil: 'domcontentloaded' })
  expect(await splashScreen(page).isVisible()).toBe(false)
  await page.waitForLoadState('load')
  expect(await splashScreen(page).isVisible()).toBe(false)
  await page.waitForTimeout(SPLASH_DURATION_MS)
  expect(await splashScreen(page).isVisible()).toBe(false)
})

test('com storage indisponível, a tela de boas-vindas aparece e a página não quebra', async ({
  page,
}) => {
  const pageErrors: Error[] = []
  page.on('pageerror', (error) => pageErrors.push(error))
  // Como no modo privado com storage bloqueado: acessar o sessionStorage lança exceção.
  await page.addInitScript(() => {
    Object.defineProperty(window, 'sessionStorage', {
      get() {
        throw new DOMException('Storage bloqueado', 'SecurityError')
      },
    })
  })

  await page.goto('/')

  await expect(splashScreen(page)).toBeVisible()
  await expect(splashScreen(page)).toBeHidden({ timeout: SPLASH_HIDE_TIMEOUT_MS })
  expect(pageErrors).toEqual([])
})

test('toda página marca o elemento raiz como "JS disponível" antes da hidratação', async ({
  page,
}) => {
  // Na segunda página a tela já foi vista, e o marcador continua valendo.
  for (const route of ['/', '/stack']) {
    await page.goto(route, { waitUntil: 'domcontentloaded' })
    expect(await page.locator('html').getAttribute('data-js')).not.toBeNull()
  }
})

test('com movimento reduzido, a tela de boas-vindas não alterna o texto nem anima a varredura', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  const splash = splashScreen(page)
  await expect(splash).toBeVisible()

  const runningAnimations = await splash.evaluate((greeting) =>
    (greeting.closest('[aria-hidden="true"]')?.getAnimations({ subtree: true }) ?? [])
      .filter((animation) => animation.playState === 'running')
      .map((animation) => (animation as CSSAnimation).animationName),
  )
  expect(runningAnimations).toEqual([])

  // Coleta as saudações exibidas até a tela sumir: sem movimento, fica sempre a primeira.
  const greetings = new Set<string | null>()
  while (await splash.isVisible()) {
    greetings.add(await splash.textContent())
    await page.waitForTimeout(200)
  }
  expect([...greetings]).toEqual(['Bem-vindo ao meu portfólio'])
})

// As rotas sem a tela ficam com o e2e/axe.spec.ts.
test('com a tela de boas-vindas visível, a home não tem violações de acessibilidade', async ({
  page,
  makeAxeBuilder,
}) => {
  await page.goto('/')
  await expect(splashScreen(page)).toBeVisible()

  const { violations } = await makeAxeBuilder().analyze()

  expect(violations).toEqual([])
})

test.describe('sem JavaScript', () => {
  test.use({ javaScriptEnabled: false })

  test('a tela de boas-vindas não aparece e o conteúdo fica visível', async ({ page }) => {
    await page.goto('/')

    await expect(splashScreen(page)).toBeHidden()
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  })
})
