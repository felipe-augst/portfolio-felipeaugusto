import type { Response } from '@playwright/test'
import { expect, test } from './fixtures'

// Meta de docs/agents/standards.md para o JS inicial da home, em bytes (kB, como no DevTools).
const JS_BUDGET_BYTES = 150_000

function isJavaScript(response: Response) {
  return response.headers()['content-type']?.includes('javascript') ?? false
}

test('o JS transferido ao carregar a home cabe no orçamento de 150 KB', async ({ page }) => {
  const scripts: Response[] = []
  page.on('response', (response) => {
    if (isJavaScript(response)) scripts.push(response)
  })

  // Primeira visita, sem cache, até a rede ficar ociosa: inclui o que carrega depois da hidratação.
  await page.goto('/')
  await page.waitForLoadState('networkidle')

  // Tamanho do corpo como chegou pela rede, ainda comprimido.
  const sizes = await Promise.all(
    scripts.map(async (response) => ({
      path: new URL(response.url()).pathname,
      bytes: (await response.request().sizes()).responseBodySize,
    })),
  )
  const total = sizes.reduce((sum, { bytes }) => sum + bytes, 0)

  expect(total, JSON.stringify(sizes, null, 2)).toBeLessThanOrEqual(JS_BUDGET_BYTES)
})
