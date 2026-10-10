import type { ContactContent } from '@/types/contact'

export const CONTACT = {
  hero: {
    prefix: 'Vamos',
    animatedWords: ['construir', 'criar', 'transformar'],
    suffix: 'algo juntos?',
  },
} as const satisfies ContactContent
