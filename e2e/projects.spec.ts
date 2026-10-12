import type { Page } from '@playwright/test'
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
