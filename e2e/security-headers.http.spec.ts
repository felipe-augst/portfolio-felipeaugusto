import { expect, test } from './fixtures'

// Rotas públicas e uma URL inexistente, que cai na 404.
const ROUTES = ['/', '/stack', '/projects', '/pagina-que-nao-existe']

for (const route of ROUTES) {
  test(`${route} não anuncia o framework no X-Powered-By`, async ({ request }) => {
    const response = await request.get(route)

    expect(response.headers()['x-powered-by']).toBeUndefined()
  })
}
