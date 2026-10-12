import { expect, test } from './fixtures'

// Rotas com o shell de página ou com as seções da home, e a 404.
const ROUTES = ['/', '/stack', '/projects', '/pagina-que-nao-existe']

test('nenhuma fonte é declarada em estilo itálico', async ({ page }) => {
  await page.goto('/')

  const italicFaces = await page.evaluate(() =>
    [...document.fonts]
      .filter((face) => face.style !== 'normal')
      .map((face) => `${face.family} ${face.weight} ${face.style}`),
  )

  expect(italicFaces).toEqual([])
})

for (const route of ROUTES) {
  test(`${route}: todo texto usa um peso e um estilo declarados na própria fonte`, async ({
    page,
  }) => {
    await page.goto(route)

    // Texto cuja fonte principal tem @font-face, mas nenhuma face com o peso e o estilo pedidos:
    // o navegador troca por outro peso ou sintetiza o negrito e o itálico.
    const mismatches = await page.evaluate(() => {
      const faces = [...document.fonts]
      const hasFace = (family: string, weight: number, style: string) =>
        faces.some((face) => {
          if (face.family !== family || face.style !== style) return false
          const [min = 0, max = min] = face.weight.split(' ').map(Number)
          return weight >= min && weight <= max
        })

      const textElements = [...document.body.querySelectorAll('*')].filter(
        (element) =>
          !['SCRIPT', 'STYLE', 'NOSCRIPT'].includes(element.tagName) &&
          [...element.childNodes].some(
            (node) => node.nodeType === Node.TEXT_NODE && node.textContent?.trim(),
          ),
      )

      const found = new Set<string>()
      for (const element of textElements) {
        const style = getComputedStyle(element)
        const family =
          style.fontFamily
            .split(',')[0]
            ?.trim()
            .replace(/^["']|["']$/g, '') ?? ''
        if (!faces.some((face) => face.family === family)) continue
        if (!hasFace(family, Number(style.fontWeight), style.fontStyle)) {
          found.add(`${family} ${style.fontWeight} ${style.fontStyle}`)
        }
      }
      return [...found]
    })

    expect(mismatches).toEqual([])
  })
}
