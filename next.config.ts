import type { NextConfig } from 'next'

// Headers de segurança de todas as rotas. O HSTS fica a cargo da Vercel, que já o envia.
const SECURITY_HEADERS = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  { key: 'X-Frame-Options', value: 'DENY' },
]

const nextConfig: NextConfig = {
  // Sem o header `X-Powered-By: Next.js`, que anuncia o framework.
  poweredByHeader: false,
  headers() {
    return [{ source: '/:path*', headers: SECURITY_HEADERS }]
  },
}

export default nextConfig
