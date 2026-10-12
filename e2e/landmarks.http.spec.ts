import { expect, test } from './fixtures'
import { countTags, getHeadingOutline } from './html'

// Rotas públicas e uma URL inexistente, que cai na 404.
const ROUTES = ['/', '/stack', '/projects', '/pagina-que-nao-existe']

for (const route of ROUTES) {
  test(`${route} tem exatamente um <main> e um <h1>`, async ({ request }) => {
    const html = await (await request.get(route)).text()

    expect(countTags(html, 'main'), '<main>').toBe(1)
    expect(countTags(html, 'h1'), '<h1>').toBe(1)
  })

  test(`${route}: os títulos seguem em ordem, sem pular nível`, async ({ request }) => {
    const outline = getHeadingOutline(await (await request.get(route)).text())

    // Cada título desce no máximo um nível em relação ao anterior.
    const skips = outline.filter(({ level }, index) => level > (outline[index - 1]?.level ?? 0) + 1)

    expect(outline[0]?.level, 'primeiro título').toBe(1)
    expect(skips).toEqual([])
  })
}
