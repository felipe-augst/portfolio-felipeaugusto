import type { Page } from '@playwright/test'
import { expect, test } from './fixtures'

// Tempo para a tela de boas-vindas alternar o texto, sumir e terminar o fade (3,5 s + 0,7 s), com folga.
const SPLASH_TOTAL_MS = 5_000

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

  // A primeira página da sessão mostra a tela de boas-vindas; a segunda, não. Espera em tempo real:
  // com relógio falso, o tempo pode avançar antes de a hidratação registrar os timers.
  for (const route of ['/', '/stack']) {
    await page.goto(route)
    await page.waitForTimeout(SPLASH_TOTAL_MS)
  }

  expect(nonGetRequests).toEqual([])
})

test('em contexto novo, a tela de boas-vindas aparece e some', async ({ page }) => {
  await page.goto('/')

  await expect(splashScreen(page)).toBeVisible()
  await expect(splashScreen(page)).toBeHidden({ timeout: SPLASH_TOTAL_MS })
})

test('em nova página do mesmo contexto, a tela de boas-vindas nunca fica visível', async ({
  page,
}) => {
  await page.goto('/')
  await expect(splashScreen(page)).toBeHidden({ timeout: SPLASH_TOTAL_MS })

  // A flag fica no sessionStorage, que é da aba: a nova página é uma nova navegação na mesma aba.
  // Confere na hora (isVisible não espera), antes da hidratação, depois do load e depois do tempo
  // que a tela duraria.
  await page.goto('/stack', { waitUntil: 'domcontentloaded' })
  expect(await splashScreen(page).isVisible()).toBe(false)
  await page.waitForLoadState('load')
  expect(await splashScreen(page).isVisible()).toBe(false)
  await page.waitForTimeout(SPLASH_TOTAL_MS)
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
  await expect(splashScreen(page)).toBeHidden({ timeout: SPLASH_TOTAL_MS })
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

test.describe('sem JavaScript', () => {
  test.use({ javaScriptEnabled: false })

  test('a tela de boas-vindas não aparece e o conteúdo fica visível', async ({ page }) => {
    await page.goto('/')

    await expect(splashScreen(page)).toBeHidden()
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  })
})
