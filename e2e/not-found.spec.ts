import { expect, test } from './fixtures'

const MISSING_ROUTE = '/pagina-que-nao-existe'

test('URL inexistente responde 404 com conteúdo em pt-BR e link para a home', async ({ page }) => {
  const response = await page.goto(MISSING_ROUTE)

  expect(response?.status()).toBe(404)
  await expect(page).toHaveTitle(/^Página não encontrada/)

  const main = page.getByRole('main')
  await expect(main.getByRole('heading', { level: 1, name: 'Página não encontrada' })).toBeVisible()
  await expect(main.getByRole('link', { name: 'Ir para a página inicial' })).toHaveAttribute(
    'href',
    '/',
  )
})
