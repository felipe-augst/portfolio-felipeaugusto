export type SocialPlatform = 'github' | 'linkedin' | 'email' | 'whatsapp'

export type SocialLink = {
  platform: SocialPlatform
  label: string
  href: string
  // Caminho do ícone em `public/`.
  icon: string
}
