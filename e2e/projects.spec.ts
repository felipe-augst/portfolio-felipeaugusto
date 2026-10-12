import type { Locator, Page } from '@playwright/test'
import { PROJECTS } from '@/data/projects'
import { expect, test } from './fixtures'

// Listas de projetos: os destaques da home e a página com todos os projetos.
const LISTS = [
  {
    route: '/',
    name: 'Projetos em destaque',
    projects: PROJECTS.filter((project) => project.featured),
  },
  { route: '/projects', name: 'Todos os projetos', projects: PROJECTS },
]

// Scripts do Next. Sem eles, a página fica como o HTML servido, sem hidratação.
const NEXT_SCRIPTS = /\/_next\/static\/.+\.js(\?.*)?$/

function projectList(page: Page, name: string) {
  return page.getByRole('list', { name })
}

// Posição de layout de cada card da lista, sem transformações.
function itemPositions(list: Locator) {
  return list.getByRole('listitem').evaluateAll((items) =>
    items.map((item) => ({
      top: (item as HTMLElement).offsetTop,
      left: (item as HTMLElement).offsetLeft,
    })),
  )
}

// Distância, em px, entre o centro da lista e o centro do card mais próximo dele.
function centeredItemOffset(list: Locator) {
  return list.evaluate((element) => {
    const box = element.getBoundingClientRect()
    const center = box.left + box.width / 2
    return Math.min(
      ...[...element.children].map((item) => {
        const rect = item.getBoundingClientRect()
        return Math.abs(rect.left + rect.width / 2 - center)
      }),
    )
  })
}

// Altura de layout da seção de projetos da home, depois de as fontes carregarem.
async function projectsSectionHeight(page: Page) {
  await page.evaluate(() => document.fonts.ready)
  return page.locator('#projects').evaluate((section) => (section as HTMLElement).offsetHeight)
}

for (const { route, name, projects } of LISTS) {
  test(`${route}: os projetos formam uma lista com nome acessível`, async ({ page }) => {
    await page.goto(route)

    const items = projectList(page, name).getByRole('listitem')

    await expect(items).toHaveCount(projects.length)
    for (const [index, project] of projects.entries()) {
      await expect(
        items.nth(index).getByRole('heading', { name: project.title, exact: true }),
      ).toBeAttached()
    }
  })
}

test.describe('em telas estreitas', () => {
  test.skip(({ isMobile }) => !isMobile, 'layout do perfil mobile')

  for (const { route, name } of LISTS) {
    test(`${route}: os cards ficam numa fileira que desliza na horizontal e encaixa um card no centro`, async ({
      page,
    }) => {
      await page.goto(route)
      const list = projectList(page, name)

      const positions = await itemPositions(list)
      expect(new Set(positions.map(({ top }) => top)).size, 'cards na mesma fileira').toBe(1)

      const itemWidth = await list
        .getByRole('listitem')
        .first()
        .evaluate((item) => (item as HTMLElement).offsetWidth)
      await list.evaluate(
        (element, distance) => element.scrollBy({ left: distance, behavior: 'instant' }),
        itemWidth * 0.6,
      )

      await expect.poll(() => centeredItemOffset(list)).toBeLessThan(2)
    })
  }
})

test.describe('a partir de md', () => {
  test.skip(({ isMobile }) => isMobile, 'layout do perfil desktop')
  test.use({ viewport: { width: 800, height: 900 } })

  for (const { route, name } of LISTS) {
    test(`${route}: os cards formam um grid, sem rolagem horizontal`, async ({ page }) => {
      await page.goto(route)
      const list = projectList(page, name)

      const positions = await itemPositions(list)
      expect(new Set(positions.map(({ left }) => left)).size, 'colunas').toBeGreaterThan(1)
      expect(new Set(positions.map(({ top }) => top)).size, 'fileiras').toBeGreaterThan(1)
      expect(
        await list.evaluate((element) => element.scrollWidth - element.clientWidth),
      ).toBeLessThanOrEqual(0)
    })
  }
})

test('a seção de projetos da home tem a mesma altura no HTML servido e depois da hidratação', async ({
  page,
}) => {
  await page.route(NEXT_SCRIPTS, (route) => route.abort())
  await page.goto('/')
  const servedHeight = await projectsSectionHeight(page)

  await page.unrouteAll()
  await page.reload()
  await page.waitForLoadState('networkidle')

  expect(await projectsSectionHeight(page)).toBe(servedHeight)
})
