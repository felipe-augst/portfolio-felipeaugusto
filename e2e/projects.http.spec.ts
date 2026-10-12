import { PROJECTS } from '@/data/projects'
import { expect, test } from './fixtures'
import { getHeadings } from './html'

const FEATURED_TITLES = PROJECTS.filter((project) => project.featured).map(
  (project) => project.title,
)
const ALL_TITLES = PROJECTS.map((project) => project.title)

test('o HTML da home traz os títulos dos projetos em destaque', async ({ request }) => {
  const headings = getHeadings(await (await request.get('/')).text())

  expect(FEATURED_TITLES).not.toEqual([])
  for (const title of FEATURED_TITLES) expect(headings).toContain(title)
})

test('o HTML de /projects traz os títulos de todos os projetos', async ({ request }) => {
  const headings = getHeadings(await (await request.get('/projects')).text())

  for (const title of ALL_TITLES) expect(headings).toContain(title)
})
