import type { Locator, Page } from '@playwright/test'
import { PROJECTS } from '@/data/projects'
import type { Project } from '@/types/projects'
import { expect, test } from './fixtures'
import { effectiveOpacity, isPainted } from './paint'
import { markSplashSeen } from './session'

// Limite de Tabs para o foco chegar a um elemento da página.
const MAX_TABS = 40

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

// Ícone da primeira tecnologia do projeto, na gaveta de tecnologias do card.
function techDrawerIcon(item: Locator, project: Project) {
  const technology = project.technologies[0]
  expect(technology, `${project.title} tem tecnologias`).toBeDefined()
  return item.getByRole('img', { name: technology?.name, exact: true })
}

// A gaveta de tecnologias do card está aberta: o ícone da primeira tecnologia é pintado.
async function expectTechDrawerOpen(item: Locator, project: Project) {
  const icon = techDrawerIcon(item, project)
  await expect.poll(() => isPainted(icon), `gaveta de ${project.title}`).toBe(true)
}

// Rola até a lista e espera a entrada da seção terminar, para a lista ficar com opacidade total.
async function revealList(list: Locator) {
  await list.scrollIntoViewIfNeeded()
  await expect.poll(() => effectiveOpacity(list)).toBe(1)
}

// Se o texto do elemento passa da altura dele, como numa descrição cortada pelo clamp.
function overflows(locator: Locator) {
  return locator.evaluate((element) => element.scrollHeight - element.clientHeight > 1)
}

// Confere o "Ler mais" de cada card: ele só existe quando a descrição transborda e, nesse caso,
// controla a descrição e alterna `aria-expanded`. Devolve quantos cards transbordam.
async function checkReadMore(page: Page, list: Locator, projects: readonly Project[]) {
  // Com a rede ociosa, a página já hidratou e mediu as descrições.
  await page.waitForLoadState('networkidle')
  const items = list.getByRole('listitem')
  let overflowing = 0

  for (const [index, project] of projects.entries()) {
    const item = items.nth(index)
    const description = item.getByText(project.description, { exact: true })
    const button = item.getByRole('button', { name: 'Ler mais' })

    if (!(await overflows(description))) {
      await expect(button, `${project.title} sem transbordo`).toHaveCount(0)
      continue
    }
    overflowing++
    const id = await description.getAttribute('id')
    expect(id, `id da descrição de ${project.title}`).toBeTruthy()
    await expect(button).toHaveAttribute('aria-controls', id ?? '')
    await expect(button).toHaveAttribute('aria-expanded', 'false')

    await button.click()
    await expect(button).toHaveAttribute('aria-expanded', 'true')
    expect(await overflows(description), `${project.title} expandida`).toBe(false)

    await button.click()
    await expect(button).toHaveAttribute('aria-expanded', 'false')
    expect(await overflows(description), `${project.title} recolhida`).toBe(true)
  }

  return overflowing
}

// Aperta Tab até o foco chegar ao elemento.
async function tabTo(page: Page, target: Locator) {
  for (let tab = 0; tab < MAX_TABS; tab++) {
    await page.keyboard.press('Tab')
    if (await target.evaluate((element) => element === document.activeElement)) return
  }
  throw new Error(`o foco não chegou ao elemento em ${MAX_TABS} Tabs`)
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

  test(`${route}: "Ler mais" só existe nos cards cuja descrição transborda e alterna aria-expanded`, async ({
    page,
  }) => {
    await markSplashSeen(page)
    await page.goto(route)

    const overflowing = await checkReadMore(page, projectList(page, name), projects)

    test.info().annotations.push({
      type: 'transbordo',
      description: `${overflowing} de ${projects.length} cards`,
    })
  })
}

// Com cards largos, parte das descrições cabe no clamp e parte não.
test.describe('com cards largos', () => {
  test.skip(({ isMobile }) => isMobile, 'viewport do perfil desktop')
  test.use({ viewport: { width: 1200, height: 900 } })

  for (const { route, name, projects } of LISTS) {
    test(`${route}: "Ler mais" só existe nos cards cuja descrição transborda`, async ({ page }) => {
      await markSplashSeen(page)
      await page.goto(route)

      const overflowing = await checkReadMore(page, projectList(page, name), projects)

      test.info().annotations.push({
        type: 'transbordo',
        description: `${overflowing} de ${projects.length} cards`,
      })
    })
  }
})

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

test.describe('em dispositivos sem hover', () => {
  test.skip(({ isMobile }) => !isMobile, 'o perfil mobile é touch, sem hover')

  for (const { route, name, projects } of LISTS) {
    test(`${route}: a gaveta de tecnologias de todos os cards fica visível sem interação com eles`, async ({
      page,
    }) => {
      await page.goto(route)
      const list = projectList(page, name)
      const items = list.getByRole('listitem')
      await revealList(list)

      // Fora da área de rolagem da lista, o card fica recortado: conta só o recorte do próprio card.
      for (const [index, project] of projects.entries()) {
        const item = items.nth(index)
        await expect
          .poll(() => isPainted(techDrawerIcon(item, project), item), project.title)
          .toBe(true)
      }
    })
  }
})

test.describe('em dispositivos com hover', () => {
  test.skip(({ isMobile }) => isMobile, 'o perfil desktop tem mouse')

  for (const { route, name, projects } of LISTS) {
    test(`${route}: a gaveta de tecnologias começa fechada e abre quando um link do card recebe foco pelo teclado`, async ({
      page,
    }) => {
      await markSplashSeen(page)
      await page.goto(route)
      const list = projectList(page, name)
      const item = list.getByRole('listitem').first()
      const project = projects[0]
      if (!project) throw new Error(`${route} não tem projetos`)
      const icon = techDrawerIcon(item, project)
      await revealList(list)
      expect(await isPainted(icon), 'gaveta antes do foco').toBe(false)

      await tabTo(page, item.getByRole('link').first())

      await expect.poll(() => isPainted(icon), 'gaveta com foco no link').toBe(true)
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

    test(`${route}: a gaveta de tecnologias abre com o mouse sobre o card`, async ({ page }) => {
      await markSplashSeen(page)
      await page.goto(route)
      const list = projectList(page, name)
      const item = list.getByRole('listitem').first()
      const project = projects[0]
      if (!project) throw new Error(`${route} não tem projetos`)
      const icon = techDrawerIcon(item, project)
      await revealList(list)
      expect(await isPainted(icon), 'gaveta antes do hover').toBe(false)

      await item.hover()

      await expect.poll(() => isPainted(icon), 'gaveta com hover').toBe(true)
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

    test(`${route}: as descrições aparecem inteiras, sem "Ler mais"`, async ({ page }) => {
      await page.goto(route)
      const list = projectList(page, name)
      const items = list.getByRole('listitem')

      await expect(list.getByRole('button', { name: 'Ler mais' })).toHaveCount(0)
      for (const [index, project] of projects.entries()) {
        const description = items.nth(index).getByText(project.description, { exact: true })
        expect(await overflows(description), project.title).toBe(false)
      }
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
