import { expect, test } from './fixtures'

// CLS "≈ 0": a meta é 0, com folga só para arredondamento.
const MAX_CLS = 0.001
// Limite para a tela de boas-vindas sumir, com as trocas de idioma e o fade.
const SPLASH_HIDE_TIMEOUT_MS = 10_000
// Seções da home, percorridas de cima para baixo depois do carregamento.
const SECTION_IDS = ['about', 'projects', 'contact']

type LayoutShift = PerformanceEntry & {
  value: number
  hadRecentInput: boolean
  sources: { node: Node | null }[]
}

declare global {
  interface Window {
    layoutShifts: { value: number; nodes: string[] }[]
  }
}

test('a home não tem deslocamento de layout (CLS ≈ 0)', async ({ page }) => {
  // Registra os deslocamentos desde o início do carregamento, como o CLS do navegador.
  await page.addInitScript(() => {
    window.layoutShifts = []
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries() as LayoutShift[]) {
        if (entry.hadRecentInput) continue
        window.layoutShifts.push({
          value: entry.value,
          nodes: entry.sources.map(({ node }) =>
            node instanceof Element ? node.outerHTML.slice(0, 120) : String(node),
          ),
        })
      }
    }).observe({ type: 'layout-shift', buffered: true })
  })

  await page.goto('/')
  await expect(page.getByText(/^(Bem-vindo ao|Welcome to|Willkommen in) /)).toBeHidden({
    timeout: SPLASH_HIDE_TIMEOUT_MS,
  })
  for (const id of SECTION_IDS) {
    await page.locator(`#${id}`).scrollIntoViewIfNeeded()
    await page.waitForTimeout(1_000)
  }

  const shifts = await page.evaluate(() => window.layoutShifts)
  const cls = shifts.reduce((total, { value }) => total + value, 0)

  expect(cls, JSON.stringify(shifts, null, 2)).toBeLessThan(MAX_CLS)
})
