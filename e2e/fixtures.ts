import AxeBuilder from '@axe-core/playwright'
import { test as base } from '@playwright/test'

// Tags WCAG 2.0/2.1 nível A e AA, a meta de docs/agents/standards.md.
const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']

type Fixtures = {
  makeAxeBuilder: () => AxeBuilder
}

// `provide` é o `use` das fixtures do Playwright: com o nome `use`, a regra de hooks do React
// confunde a chamada com o hook `use`.
export const test = base.extend<Fixtures>({
  makeAxeBuilder: async ({ page }, provide) => {
    await provide(() => new AxeBuilder({ page }).withTags(WCAG_TAGS))
  },
})

export { expect } from '@playwright/test'
