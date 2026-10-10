import { expect, test } from './fixtures'
import { getLinkHref, getMeta } from './html'

// URL de produção: canonical, `og:url` e imagens apontam para ela, e não para o servidor local.
const SITE_URL = 'https://devfelipeaugusto.com.br'

const ROUTES = ['/', '/stack', '/projects']

// Origem + caminho, sem query string. `undefined` passa adiante para o expect acusar a ausência.
function withoutQuery(url: string | undefined) {
  if (url === undefined) return undefined
  const { origin, pathname } = new URL(url)
  return `${origin}${pathname}`
}

for (const route of ROUTES) {
  test(`${route} declara canonical e og:url da própria rota`, async ({ request }) => {
    const html = await (await request.get(route)).text()

    expect(withoutQuery(getLinkHref(html, 'canonical'))).toBe(`${SITE_URL}${route}`)
    expect(withoutQuery(getMeta(html, 'og:url'))).toBe(`${SITE_URL}${route}`)
  })
}
