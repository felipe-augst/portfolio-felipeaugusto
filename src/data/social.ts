import type { SocialLink } from '@/types/social'

export const SOCIAL_LINKS = [
  {
    platform: 'github',
    label: 'GitHub',
    href: 'https://github.com/felipe-augst',
    icon: '/images/social/github.svg',
  },
  {
    platform: 'linkedin',
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/felipeaugst/',
    icon: '/images/social/linkedin.svg',
  },
  {
    platform: 'email',
    label: 'E-mail',
    href: 'mailto:augusto.felipedev@gmail.com',
    icon: '/images/social/email.svg',
  },
  {
    platform: 'whatsapp',
    label: 'WhatsApp',
    href: 'https://wa.me/5511975059454',
    icon: '/images/social/whatsapp.svg',
  },
] as const satisfies readonly SocialLink[]
