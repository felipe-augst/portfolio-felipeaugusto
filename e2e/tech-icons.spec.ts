import { PROJECTS } from '@/data/projects'
import { CORE_STACK, TECH_CATEGORIES } from '@/data/technologies'
import type { Technology } from '@/types/technologies'
import { expect, test } from './fixtures'

// Ícones de tecnologia: o texto alternativo é o nome da tecnologia, sem "icon" em inglês, e o
// ícone que fica ao lado do nome visível é decorativo.

test('os ícones de stack do hero têm o nome da tecnologia como texto alternativo', async ({
  page,
}) => {
  await page.goto('/')
  // O bloco de conteúdo do <h1>. O fundo do hero, decorativo, fica fora dele.
  const icons = page.getByRole('heading', { level: 1 }).locator('..').getByRole('img')

  await expect(icons).toHaveCount(CORE_STACK.length)
  for (const [index, technology] of CORE_STACK.entries()) {
    await expect(icons.nth(index)).toHaveAccessibleName(technology.name)
  }
})

test('em /stack, os ícones ficam fora da árvore de acessibilidade, ao lado do nome visível', async ({
  page,
}) => {
  await page.goto('/stack')
  const main = page.getByRole('main')

  await expect(main.getByRole('img')).toHaveCount(0)
  for (const technology of TECH_CATEGORIES.flatMap<Technology>(
    (category) => category.technologies,
  )) {
    await expect(main.getByText(technology.name, { exact: true }).first()).toBeAttached()
  }
})

test('na gaveta de cada card, os ícones têm o nome da tecnologia como texto alternativo', async ({
  page,
}) => {
  await page.goto('/projects')
  const items = page.getByRole('list', { name: 'Todos os projetos' }).getByRole('listitem')

  for (const [index, project] of PROJECTS.entries()) {
    const item = items.nth(index)
    for (const technology of project.technologies) {
      await expect(
        item.getByRole('img', { name: technology.name, exact: true }),
        `${project.title}: ${technology.name}`,
      ).toHaveCount(1)
    }
  }
})
