export type SiteConfig = {
  url: string
  name: string
  role: string
  description: string
  locale: string
  location: {
    city: string
    region: string
    country: string
  }
  cv: {
    path: string
    downloadName: string
  }
  availability: {
    available: boolean
    label: string
  }
}

export type PageSeo = {
  path: string
  title: string
  description: string
}
