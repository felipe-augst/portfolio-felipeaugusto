import type { NextConfig } from 'next'

const IS_DEV = process.env.NODE_ENV === 'development'

// CSP só em report-only: o navegador aponta as violações no console, sem bloquear nada. O
// `'unsafe-inline'` do `script-src` cobre os scripts inline do Next, que mudam a cada build e não
// cabem num hash; com um hash na diretiva, o navegador ignoraria o `'unsafe-inline'`. Em dev, o
// React usa `eval` para reconstruir as pilhas de erro do servidor, e o Analytics e o Speed Insights
// da Vercel carregam os scripts de depuração de outra origem. Em produção, os dois carregam de
// `/_vercel/...` e enviam os dados para lá, na mesma origem.
const DEV_SCRIPT_SOURCES = ["'unsafe-eval'", 'https://va.vercel-scripts.com']

const CSP_DIRECTIVES = {
  'default-src': ["'self'"],
  'script-src': ["'self'", "'unsafe-inline'", ...(IS_DEV ? DEV_SCRIPT_SOURCES : [])],
  'style-src': ["'self'", "'unsafe-inline'"],
  'object-src': ["'none'"],
  'base-uri': ["'self'"],
  'form-action': ["'self'"],
  'frame-ancestors': ["'none'"],
}

const CSP = Object.entries(CSP_DIRECTIVES)
  .map(([directive, sources]) => [directive, ...sources].join(' '))
  .join('; ')

// Headers de segurança de todas as rotas. O HSTS fica a cargo da Vercel, que já o envia.
const SECURITY_HEADERS = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Content-Security-Policy-Report-Only', value: CSP },
]

const nextConfig: NextConfig = {
  // Sem o header `X-Powered-By: Next.js`, que anuncia o framework.
  poweredByHeader: false,
  headers() {
    return [{ source: '/:path*', headers: SECURITY_HEADERS }]
  },
}

export default nextConfig
