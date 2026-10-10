import { expect, test } from './fixtures'
import { countTags } from './html'

// Rotas públicas e uma URL inexistente, que cai na 404.
const ROUTES = ['/', '/stack', '/projects', '/pagina-que-nao-existe']

for (const route of ROUTES) {
  test(`${route} tem exatamente um <main> e um <h1>`, async ({ request }) => {
    const html = await (await request.get(route)).text()

    expect(countTags(html, 'main'), '<main>').toBe(1)
    expect(countTags(html, 'h1'), '<h1>').toBe(1)
  })
}
