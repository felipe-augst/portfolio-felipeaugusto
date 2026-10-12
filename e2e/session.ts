import type { Page } from '@playwright/test'
import { SPLASH_SEEN_KEY } from '@/lib/head-script'

/**
 * Faz a página abrir como numa sessão em que a tela de boas-vindas já foi vista, para que ela
 * não cubra a página. Vale para todas as navegações da página.
 */
export async function markSplashSeen(page: Page) {
  await page.addInitScript((key) => sessionStorage.setItem(key, '1'), SPLASH_SEEN_KEY)
}
