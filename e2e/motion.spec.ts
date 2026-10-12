import type { Locator, Page } from '@playwright/test'
import { expect, test } from './fixtures'
import { effectiveOpacity, isDisplaced } from './paint'

// Seções da home: o hero, que traz o <h1>, e as seções com âncora.
function homeSections(page: Page) {
  return [
    {
      name: 'hero',
      locator: page.locator('section').filter({ has: page.getByRole('heading', { level: 1 }) }),
    },
    ...['about', 'projects', 'contact'].map((id) => ({
      name: id,
      locator: page.locator(`#${id}`),
    })),
  ]
}

// Ícones de stack do hero: as imagens do bloco de conteúdo do <h1>. O fundo do hero fica fora dele.
function heroStackIcons(page: Page) {
  return page.getByRole('heading', { level: 1 }).locator('..').getByRole('img')
}

// Atraso, em ms, da animação CSS de entrada (finita) de cada elemento, nele ou num ancestral.
// `null` quando não há animação CSS.
function cssEntranceDelays(locator: Locator) {
  return locator.evaluateAll((elements) =>
    elements.map((element) => {
      for (let node: Element | null = element; node; node = node.parentElement) {
        const entrance = node
          .getAnimations()
          .find(
            (animation) =>
              animation instanceof CSSAnimation &&
              animation.effect?.getTiming().iterations !== Infinity,
          )
        if (entrance) return Number(entrance.effect?.getTiming().delay)
      }
      return null
    }),
  )
}

// Animações da página em execução com iterações infinitas, identificadas pelo nome.
function runningInfiniteAnimations(page: Page) {
  return page.evaluate(() =>
    document
      .getAnimations()
      .filter(
        (animation) =>
          animation.playState === 'running' &&
          animation.effect?.getComputedTiming().iterations === Infinity,
      )
      .map((animation) =>
        animation instanceof CSSAnimation ? animation.animationName : animation.id || '(sem nome)',
      ),
  )
}

test('as seções abaixo da dobra começam ocultas e ficam visíveis ao rolar até elas', async ({
  page,
}) => {
  await page.goto('/')
  const viewport = page.viewportSize()
  if (!viewport) throw new Error('o perfil não define viewport')

  const belowTheFold = []
  for (const section of homeSections(page)) {
    const box = await section.locator.boundingBox()
    if (box && box.y >= viewport.height) belowTheFold.push(section)
  }
  expect(belowTheFold.length, 'alguma seção começa abaixo da dobra').toBeGreaterThan(0)

  for (const { name, locator } of belowTheFold) {
    expect(await effectiveOpacity(locator), `${name} antes de rolar`).toBe(0)
  }
  for (const { name, locator } of belowTheFold) {
    await locator.scrollIntoViewIfNeeded()
    await expect.poll(() => effectiveOpacity(locator), { message: name }).toBe(1)
  }
})

test('os ícones de stack do hero entram em sequência por CSS e ficam visíveis', async ({
  page,
}) => {
  await page.goto('/')
  const icons = heroStackIcons(page)

  const delays = await cssEntranceDelays(icons)
  expect(delays.length, 'ícones de stack no hero').toBeGreaterThan(1)
  expect(delays, 'cada ícone tem animação CSS de entrada').not.toContain(null)
  const increasing = delays.every(
    (delay, index) => index === 0 || (delay ?? 0) > (delays[index - 1] ?? Infinity),
  )
  expect(increasing, `atrasos: ${delays.join(', ')}`).toBe(true)

  for (const icon of await icons.all()) {
    await expect.poll(() => effectiveOpacity(icon)).toBe(1)
  }
})

test.describe('com movimento reduzido', () => {
  test.use({ reducedMotion: 'reduce' })

  test('todas as seções da home ficam visíveis e sem deslocamento, sem precisar rolar', async ({
    page,
  }) => {
    await page.goto('/')

    for (const { name, locator } of homeSections(page)) {
      expect(await effectiveOpacity(locator), name).toBe(1)
      expect(await isDisplaced(locator), name).toBe(false)
    }
  })

  test('os ícones de stack do hero aparecem visíveis e sem deslocamento desde o início', async ({
    page,
  }) => {
    await page.goto('/')
    const icons = heroStackIcons(page)

    await expect(icons).not.toHaveCount(0)
    for (const icon of await icons.all()) {
      expect(await effectiveOpacity(icon)).toBe(1)
      expect(await isDisplaced(icon)).toBe(false)
    }
  })

  test('nenhuma animação com iterações infinitas fica em execução na home', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()

    expect(await runningInfiniteAnimations(page)).toEqual([])
  })

  // Os dois testes a seguir injetam CSS novo, de fora do site, para conferir o reset global.
  test('o reset global para animações infinitas de qualquer CSS', async ({ page }) => {
    await page.goto('/')
    await page.addStyleTag({
      content: `
        @keyframes probe { to { opacity: 0.5 } }
        #motion-probe { animation: probe 1s linear infinite }
      `,
    })
    await page.evaluate(() => {
      const probe = document.createElement('div')
      probe.id = 'motion-probe'
      document.body.append(probe)
    })

    expect(await runningInfiniteAnimations(page)).toEqual([])
  })

  test('o reset global torna instantânea a rolagem suave de qualquer CSS', async ({ page }) => {
    await page.goto('/')
    await page.addStyleTag({ content: 'html { scroll-behavior: smooth }' })

    // Com rolagem suave, a posição só chega ao destino depois de alguns quadros.
    const scrollY = await page.evaluate(() => {
      window.scrollTo({ top: 500 })
      return window.scrollY
    })

    expect(scrollY).toBe(500)
  })
})

test.describe('sem JavaScript', () => {
  test.use({ javaScriptEnabled: false })

  test('todas as seções da home ficam com opacidade visível', async ({ page }) => {
    await page.goto('/')

    for (const { name, locator } of homeSections(page)) {
      expect(await effectiveOpacity(locator), name).toBe(1)
    }
  })

  test('os ícones de stack do hero ficam visíveis', async ({ page }) => {
    await page.goto('/')
    const icons = heroStackIcons(page)

    await expect(icons).not.toHaveCount(0)
    for (const icon of await icons.all()) {
      expect(await effectiveOpacity(icon)).toBe(1)
    }
  })
})
