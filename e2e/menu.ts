import type { Page } from '@playwright/test'

// Localizadores do menu do cabeçalho, compartilhados pelos testes.

export function menuButton(page: Page) {
  return page.getByRole('button', { name: 'Menu' })
}

export function menuDialog(page: Page) {
  return page.getByRole('dialog', { name: 'Menu' })
}
