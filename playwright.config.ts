import { defineConfig, devices } from '@playwright/test'

const PORT = 3100
const BASE_URL = `http://localhost:${PORT}`
const IS_CI = Boolean(process.env.CI)

// Testes de nível de request (sem navegador) usam o sufixo `.http.spec.ts`.
const HTTP_SPECS = /\.http\.spec\.ts$/

// Chromium completo no headless novo, em vez do headless shell. É o mesmo navegador do Chrome,
// e roda no Windows com Smart App Control, que bloqueia o executável do headless shell.
const CHROMIUM_CHANNEL = 'chromium'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: IS_CI,
  retries: IS_CI ? 2 : 0,
  reporter: IS_CI
    ? [['github'], ['html', { open: 'never' }]]
    : [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'http',
      testMatch: HTTP_SPECS,
    },
    {
      name: 'desktop-chromium',
      testIgnore: HTTP_SPECS,
      use: { ...devices['Desktop Chrome'], channel: CHROMIUM_CHANNEL },
    },
    {
      name: 'mobile-chromium',
      testIgnore: HTTP_SPECS,
      use: { ...devices['Pixel 7'], channel: CHROMIUM_CHANNEL },
    },
  ],
  // Sempre o build de produção, numa porta dedicada. Nunca reaproveita um servidor que já
  // esteja rodando, para a suíte não rodar por engano contra o dev server.
  webServer: {
    command: `npm run build && npm run start -- --port ${PORT}`,
    url: BASE_URL,
    reuseExistingServer: false,
    timeout: 180_000,
  },
})
