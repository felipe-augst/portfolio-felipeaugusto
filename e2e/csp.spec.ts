import type { Page } from '@playwright/test'
import { expect, test } from './fixtures'
import { markSplashSeen } from './session'

// Script de outra origem, servido pelo próprio teste.
const EXTERNAL_SCRIPT = 'https://scripts.example/rastreador.js'

// Mensagens que o navegador escreve no console ao encontrar uma violação da CSP.
function collectCspViolations(page: Page) {
  const violations: string[] = []
  page.on('console', (message) => {
    if (message.text().includes('Content Security Policy')) violations.push(message.text())
  })
  return violations
}

test('um script de outra origem aparece como violação da CSP no console e roda mesmo assim', async ({
  page,
}) => {
  await page.route(EXTERNAL_SCRIPT, (route) =>
    route.fulfill({ contentType: 'text/javascript', body: 'window.externalScriptRan = true' }),
  )
  const violations = collectCspViolations(page)
  await markSplashSeen(page)
  await page.goto('/')

  await page.evaluate((src) => {
    const script = document.createElement('script')
    script.src = src
    document.head.append(script)
  }, EXTERNAL_SCRIPT)

  // Em report-only, a CSP só aponta a violação: o script carrega e roda.
  await expect.poll(() => page.evaluate(() => 'externalScriptRan' in window)).toBe(true)
  await expect.poll(() => violations.some((text) => text.includes(EXTERNAL_SCRIPT))).toBe(true)
})
