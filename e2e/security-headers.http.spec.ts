import { expect, test } from './fixtures'

// Rotas públicas e uma URL inexistente, que cai na 404.
const ROUTES = ['/', '/stack', '/projects', '/pagina-que-nao-existe']

// Headers de valor fixo que protegem o visitante contra MIME sniffing e clickjacking.
const SECURITY_HEADERS = {
  'x-content-type-options': 'nosniff',
  'referrer-policy': 'strict-origin-when-cross-origin',
  'x-frame-options': 'DENY',
}

// Recursos que a Permissions-Policy nega a todas as origens, inclusive a do site.
const DENIED_FEATURES = ['camera', 'microphone', 'geolocation']

// Lista de origens de cada recurso da Permissions-Policy (`camera=()` dá `camera` → `()`).
function parsePermissionsPolicy(header = '') {
  return new Map(
    header.split(',').map((directive) => {
      const [feature = '', allowlist] = directive.trim().split('=')
      return [feature, allowlist]
    }),
  )
}

for (const route of ROUTES) {
  test(`${route} não anuncia o framework no X-Powered-By`, async ({ request }) => {
    const response = await request.get(route)

    expect(response.headers()['x-powered-by']).toBeUndefined()
  })

  test(`${route} envia nosniff, Referrer-Policy, X-Frame-Options e Permissions-Policy`, async ({
    request,
  }) => {
    const headers = (await request.get(route)).headers()

    expect(headers).toMatchObject(SECURITY_HEADERS)

    const permissions = parsePermissionsPolicy(headers['permissions-policy'])
    for (const feature of DENIED_FEATURES) {
      expect(permissions.get(feature), `Permissions-Policy: ${feature}`).toBe('()')
    }
  })
}
