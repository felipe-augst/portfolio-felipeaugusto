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

// Caminho de uma URL absoluta do site, para pedir o mesmo recurso ao servidor de teste.
function toLocalPath(url: string) {
  const { origin, pathname, search } = new URL(url)
  expect(origin).toBe(SITE_URL)
  return `${pathname}${search}`
}

const PREVIEW_IMAGES = ['og:image', 'twitter:image']

for (const route of ROUTES) {
  test(`${route} declara canonical e og:url da própria rota`, async ({ request }) => {
    const html = await (await request.get(route)).text()

    expect(withoutQuery(getLinkHref(html, 'canonical'))).toBe(`${SITE_URL}${route}`)
    expect(withoutQuery(getMeta(html, 'og:url'))).toBe(`${SITE_URL}${route}`)
  })

  test(`${route} expõe og:image e twitter:image que respondem 200 com imagem`, async ({
    request,
  }) => {
    const html = await (await request.get(route)).text()

    for (const key of PREVIEW_IMAGES) {
      const url = getMeta(html, key)
      expect(url, `${key} ausente`).toBeTruthy()

      const image = await request.get(toLocalPath(String(url)))
      expect(image.status(), `${key}: ${url}`).toBe(200)
      expect(image.headers()['content-type'], `${key}: ${url}`).toMatch(/^image\//)
    }
  })

  test(`${route} descreve a imagem de prévia como Fullstack`, async ({ request }) => {
    const html = await (await request.get(route)).text()

    for (const key of PREVIEW_IMAGES) {
      expect(getMeta(html, `${key}:alt`), `${key}:alt`).toContain('Fullstack')
    }
  })
}
