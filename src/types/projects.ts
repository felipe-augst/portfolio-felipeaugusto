import type { IconTechnology } from '@/types/technologies'

export type ProjectCategory = 'frontend' | 'backend' | 'fullstack'

export type Project = {
  id: string
  title: string
  description: string
  image: string
  category: ProjectCategory
  technologies: readonly IconTechnology[]
  links: {
    github?: string
    live?: string
    apiDocs?: string
  }
  featured: boolean
}
