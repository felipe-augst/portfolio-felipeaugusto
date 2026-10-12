export type Technology = {
  name: string
  // Caminho do ícone em `public/`. Sem ícone, a tecnologia aparece só pelo nome.
  icon?: string
}

// Tecnologia com ícone, a única que cabe onde só o ícone aparece (hero e gaveta do card).
export type IconTechnology = Required<Technology>

export type TechCategory = {
  title: string
  technologies: readonly Technology[]
}
