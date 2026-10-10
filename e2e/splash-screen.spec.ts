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

test.describe('sem JavaScript', () => {
  test.use({ javaScriptEnabled: false })

  test('a tela de boas-vindas não aparece e o conteúdo fica visível', async ({ page }) => {
    await page.goto('/')

    await expect(splashScreen(page)).toBeHidden()
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  })
})
