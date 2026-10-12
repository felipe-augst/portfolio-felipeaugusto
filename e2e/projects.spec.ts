import type { Locator, Page } from '@playwright/test'
import { PROJECTS } from '@/data/projects'
import type { Project } from '@/types/projects'
import { expect, test } from './fixtures'
import { isPainted } from './paint'

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

// Índices dos cards exibidos no tamanho de layout, sem redução por transformação.
function fullSizeItems(list: Locator) {
  return list
    .getByRole('listitem')
    .evaluateAll((items) =>
      items.flatMap((item, index) =>
        Math.abs(item.getBoundingClientRect().width - (item as HTMLElement).offsetWidth) < 0.5
          ? [index]
          : [],
      ),
    )
}

// A gaveta de tecnologias do card está aberta: o ícone da primeira tecnologia é pintado.
async function expectTechDrawerOpen(item: Locator, project: Project) {
  const technology = project.technologies[0]
  expect(technology, `${project.title} tem tecnologias`).toBeDefined()
  const icon = item.getByRole('img', { name: technology?.name, exact: true })
  await expect.poll(() => isPainted(icon), `gaveta de ${project.title}`).toBe(true)
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

  for (const { route, name, projects } of LISTS) {
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

    test(`${route}: o card centralizado fica em destaque, com a gaveta de tecnologias aberta`, async ({
      page,
    }) => {
      await page.goto(route)
      const list = projectList(page, name)
      const items = list.getByRole('listitem')
      await list.scrollIntoViewIfNeeded()

      for (const index of [0, 1]) {
        const project = projects[index]
        if (!project) throw new Error(`${route} tem menos de ${index + 1} projetos`)
        await items
          .nth(index)
          .evaluate((item) =>
            item.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'instant' }),
          )

        await expect.poll(() => fullSizeItems(list), 'card em destaque').toEqual([index])
        await expectTechDrawerOpen(items.nth(index), project)
      }
    })
  }
})

test.describe('a partir de md', () => {
  test.skip(({ isMobile }) => isMobile, 'layout do perfil desktop')
  test.use({ viewport: { width: 800, height: 900 } })

  for (const { route, name, projects } of LISTS) {
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

    test(`${route}: no grid, nenhum card fica em destaque`, async ({ page }) => {
      await page.goto(route)
      const list = projectList(page, name)
      await list.scrollIntoViewIfNeeded()
      await page.waitForLoadState('networkidle')

      expect(await fullSizeItems(list)).toHaveLength(projects.length)
    })
  }
})

test.describe('sem JavaScript', () => {
  test.use({ javaScriptEnabled: false })

  for (const { route, name, projects } of LISTS) {
    test(`${route}: todos os cards aparecem sem destaque`, async ({ page }) => {
      await page.goto(route)

      expect(await fullSizeItems(projectList(page, name))).toHaveLength(projects.length)
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
