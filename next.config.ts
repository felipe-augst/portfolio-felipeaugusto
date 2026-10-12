import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Sem o header `X-Powered-By: Next.js`, que anuncia o framework.
  poweredByHeader: false,
}

export default nextConfig
