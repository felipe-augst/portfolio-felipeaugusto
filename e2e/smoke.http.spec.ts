import { expect, test } from './fixtures'

const ROUTES = ['/', '/stack', '/projects']

for (const route of ROUTES) {
  test(`${route} serve HTML com status 200 e "Felipe Augusto" no <title>`, async ({ request }) => {
    const response = await request.get(route)
    const title = (await response.text()).match(/<title>([^<]*)<\/title>/)?.[1]

    expect(response.status()).toBe(200)
    expect(title).toContain('Felipe Augusto')
  })
}
