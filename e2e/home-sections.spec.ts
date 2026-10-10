import { expect, test } from './fixtures'

// Âncoras das seções da home que seguem o espaçamento padrão.
const SECTION_IDS = ['about', 'projects', 'contact']

test.describe('em telas xl', () => {
  test.use({ viewport: { width: 1440, height: 900 } })

  test('as seções da home têm o mesmo espaçamento vertical', async ({ page }) => {
    await page.goto('/')

    const spacing: Record<string, string> = {}
    for (const id of SECTION_IDS) {
      spacing[id] = await page.locator(`#${id}`).evaluate((section) => {
        const { paddingTop, paddingBottom } = getComputedStyle(section)
        return `${paddingTop} ${paddingBottom}`
      })
    }

    expect(new Set(Object.values(spacing)).size, JSON.stringify(spacing)).toBe(1)
  })
})
