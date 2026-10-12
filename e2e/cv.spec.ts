import type { Page } from '@playwright/test'
import { expect, test } from './fixtures'

// Links "Baixar CV" da home: o do hero, no bloco de conteúdo do <h1>, e o do contato, na âncora
// da seção (a mesma do item "Contato" do menu).
const CV_LINKS = {
  hero: (page: Page) =>
    page.getByRole('heading', { level: 1 }).locator('..').getByRole('link', { name: 'Baixar CV' }),
  contato: (page: Page) => page.locator('#contact').getByRole('link', { name: 'Baixar CV' }),
}

for (const [section, cvLink] of Object.entries(CV_LINKS)) {
  test(`o "Baixar CV" do ${section} responde 200 com o PDF do currículo`, async ({ page }) => {
    await page.goto('/')
    const link = cvLink(page)
    await expect(link).toHaveCount(1)

    const response = await page.request.get((await link.getAttribute('href')) ?? '')

    expect(response.status()).toBe(200)
    expect(response.headers()['content-type']).toBe('application/pdf')
    // Todo arquivo PDF começa com essa assinatura.
    expect((await response.body()).subarray(0, 5).toString()).toBe('%PDF-')
  })
}
