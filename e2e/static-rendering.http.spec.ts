import { expect, test } from './fixtures'

const ROUTES = ['/', '/stack', '/projects']

for (const route of ROUTES) {
  test(`${route} serve HTML cacheável pela CDN, sem private nem no-store no Cache-Control`, async ({
    request,
  }) => {
    const response = await request.get(route)

    expect(response.status()).toBe(200)
    expect(response.headers()['cache-control']).not.toMatch(/private|no-store/)
  })
}
