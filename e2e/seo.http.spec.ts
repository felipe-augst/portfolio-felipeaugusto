import { expect, test } from './fixtures'
import { getJsonLdScripts, getLinkHref, getMeta, getTitle } from './html'

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

// URLs de todos os campos `image` de um documento JSON-LD, em qualquer nível. O valor pode ser
// uma URL, um `ImageObject` com `url` ou uma lista deles.
function findImageUrls(node: unknown): string[] {
  if (Array.isArray(node)) return node.flatMap(findImageUrls)
  if (typeof node !== 'object' || node === null) return []
  return Object.entries(node).flatMap(([key, value]) =>
    key === 'image' ? toUrls(value) : findImageUrls(value),
  )
}

function toUrls(image: unknown): string[] {
  if (typeof image === 'string') return [image]
  if (Array.isArray(image)) return image.flatMap(toUrls)
  if (typeof image === 'object' && image !== null && 'url' in image) return toUrls(image.url)
  return []
}

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

  test(`${route} tem JSON-LD parseável com imagens que respondem 200`, async ({ request }) => {
    const html = await (await request.get(route)).text()
    const scripts = getJsonLdScripts(html)
    expect(scripts, 'JSON-LD ausente').not.toHaveLength(0)

    const imageUrls = scripts.map((script) => JSON.parse(script) as unknown).flatMap(findImageUrls)
    expect(imageUrls, 'JSON-LD sem imagem').not.toHaveLength(0)

    for (const url of imageUrls) {
      const image = await request.get(toLocalPath(url))
      expect(image.status(), url).toBe(200)
      expect(image.headers()['content-type'], url).toMatch(/^image\//)
    }
  })
}

test('cada rota tem título e descrição próprios, também na prévia', async ({ request }) => {
  const pages = await Promise.all(ROUTES.map(async (route) => (await request.get(route)).text()))
  const fields = {
    title: pages.map(getTitle),
    description: pages.map((html) => getMeta(html, 'description')),
    'og:title': pages.map((html) => getMeta(html, 'og:title')),
    'og:description': pages.map((html) => getMeta(html, 'og:description')),
  }

  for (const [field, values] of Object.entries(fields)) {
    const declared = values.filter(Boolean)
    expect(declared, `${field} ausente em alguma rota`).toHaveLength(ROUTES.length)
    expect(new Set(declared).size, `${field} repetido: ${declared.join(' / ')}`).toBe(ROUTES.length)
  }
})

test('robots.txt não bloqueia /_next/ nem /api/ e aponta para o sitemap', async ({ request }) => {
  const robots = await (await request.get('/robots.txt')).text()
  const disallowed = robots
    .split('\n')
    .filter((line) => /^disallow:/i.test(line))
    .map((line) => line.slice('disallow:'.length).trim())
    .filter(Boolean)

  // Um caminho fica bloqueado quando começa com alguma regra `Disallow`.
  for (const path of ['/_next/static/chunks/app.js', '/api/']) {
    expect(
      disallowed.filter((rule) => path.startsWith(rule)),
      `regras que bloqueiam ${path}`,
    ).toEqual([])
  }
  expect(robots).toMatch(new RegExp(`^Sitemap: ${SITE_URL}/sitemap\\.xml$`, 'm'))
})

test('sitemap lista /, /stack e /projects com lastModified fixo', async ({ request }) => {
  const sitemap = await (await request.get('/sitemap.xml')).text()
  const locations = [...sitemap.matchAll(/<loc>([^<]*)<\/loc>/g)].map(([, loc]) =>
    withoutQuery(loc),
  )

  expect(locations).toEqual(expect.arrayContaining(ROUTES.map((route) => `${SITE_URL}${route}`)))
  expect(sitemap).toContain('<lastmod>')
  // A data é fixada no build: outra requisição devolve o mesmo documento.
  expect(await (await request.get('/sitemap.xml')).text()).toBe(sitemap)
})

test('a descrição de /stack não diz frontend', async ({ request }) => {
  const html = await (await request.get('/stack')).text()

  expect(getMeta(html, 'description')).toBeTruthy()
  expect(getMeta(html, 'description')).not.toMatch(/front-?end/i)
})
