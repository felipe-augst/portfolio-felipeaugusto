import { expect, test } from './fixtures'
import { markSplashSeen } from './session'

const ROUTES = ['/', '/stack', '/projects']

// Scripts do Analytics e do Speed Insights da Vercel. No deploy, a Vercel os serve na própria
// origem. No `next start` da suíte, eles respondem 404, mas o pedido mostra que estão montados.
const VERCEL_SCRIPTS = ['/_vercel/insights/script.js', '/_vercel/speed-insights/script.js']

for (const route of ROUTES) {
  test(`${route} carrega os scripts do Analytics e do Speed Insights da Vercel`, async ({
    page,
  }) => {
    const requestedPaths: string[] = []
    page.on('request', (request) => requestedPaths.push(new URL(request.url()).pathname))
    await markSplashSeen(page)

    await page.goto(route)

    await expect.poll(() => requestedPaths).toEqual(expect.arrayContaining(VERCEL_SCRIPTS))
  })
}
