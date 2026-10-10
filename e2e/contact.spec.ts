import { expect, test } from './fixtures'

test('o título do contato é lido como a frase completa', async ({ page }) => {
  await page.goto('/')

  const heading = page.locator('#contact').getByRole('heading', { level: 2 })

  await expect(heading).toHaveAccessibleName('Vamos construir algo juntos?')
})
