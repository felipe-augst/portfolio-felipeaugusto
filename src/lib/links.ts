// Esquemas que abrem um app (e-mail, telefone), e não uma página.
const APP_LINK = /^(mailto|tel):/

/** Aviso, em `sr-only` ou no `aria-label`, de que o link abre em nova aba. */
export const NEW_TAB_NOTICE = '(abre em nova aba)'

/** Link que sai do site: página de outra origem, e-mail ou telefone. */
export function isExternalUrl(href: string) {
  return /^https?:/.test(href) || APP_LINK.test(href)
}

/** Se um link externo abre em nova aba. `mailto:` e `tel:` abrem o app na mesma aba. */
export function opensInNewTab(href: string) {
  return !APP_LINK.test(href)
}
