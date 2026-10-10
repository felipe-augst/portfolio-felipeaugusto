import type { SocialLink, SocialPlatform } from '@/types/social'

export const SOCIAL_LINKS = [
  {
    platform: 'github',
    label: 'GitHub',
    href: 'https://github.com/felipe-augst',
  },
  {
    platform: 'linkedin',
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/felipeaugst/',
  },
  {
    platform: 'email',
    label: 'E-mail',
    href: 'mailto:augusto.felipedev@gmail.com',
  },
  {
    platform: 'whatsapp',
    label: 'WhatsApp',
    href: 'https://wa.me/5511975059454',
  },
] as const satisfies readonly SocialLink[]

export const SOCIAL_ICONS: Record<SocialPlatform, string> = {
  github: '/images/social/github.svg',
  linkedin: '/images/social/linkedin.svg',
  email: '/images/social/email.svg',
  whatsapp: '/images/social/whatsapp.svg',
} as const
