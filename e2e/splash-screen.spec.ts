import { expect, test } from './fixtures'

// Tempo para a tela de boas-vindas alternar o texto, sumir e terminar o fade (3,5 s + 0,7 s), com folga.
const SPLASH_TOTAL_MS = 5_000

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
