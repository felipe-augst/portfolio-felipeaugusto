import { expect, test } from './fixtures'

const ROUTES = ['/', '/stack', '/projects']

for (const route of ROUTES) {
  test(`${route} responde 200 com "Felipe Augusto" no título`, async ({ page }) => {
    const response = await page.goto(route)

    expect(response?.status()).toBe(200)
    await expect(page).toHaveTitle(/Felipe Augusto/)
  })
}
