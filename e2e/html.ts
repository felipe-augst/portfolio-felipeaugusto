// Leitura dos metadados do HTML servido, para os testes de nível de request.

const ENTITIES: Record<string, string> = {
  '&amp;': '&',
  '&quot;': '"',
  '&#x27;': "'",
  '&#39;': "'",
  '&lt;': '<',
  '&gt;': '>',
}

function decodeEntities(value: string) {
  return value.replace(/&(?:amp|quot|#x27|#39|lt|gt);/g, (entity) => ENTITIES[entity] ?? entity)
}

function findTags(html: string, tagName: string) {
  return html.match(new RegExp(`<${tagName}\\b[^>]*>`, 'g')) ?? []
}

// Nomes de atributo HTML não diferenciam maiúsculas (o React escreve `imageSrcSet`).
function getAttribute(tag: string, name: string) {
  const value = tag.match(new RegExp(`\\s${name}="([^"]*)"`, 'i'))?.[1]
  return value === undefined ? undefined : decodeEntities(value)
}

/** Quantidade de tags de abertura `tagName` (por exemplo, `main`). */
export function countTags(html: string, tagName: string) {
  return findTags(html, tagName).length
}

/** Texto do `<title>`. */
export function getTitle(html: string) {
  const title = html.match(/<title>([^<]*)<\/title>/)?.[1]
  return title === undefined ? undefined : decodeEntities(title)
}

/** `content` da `<meta>` cujo `property` ou `name` é `key` (por exemplo, `og:url`). */
export function getMeta(html: string, key: string) {
  const tag = findTags(html, 'meta').find(
    (meta) => getAttribute(meta, 'property') === key || getAttribute(meta, 'name') === key,
  )
  return tag && getAttribute(tag, 'content')
}

/** Conteúdo bruto de cada `<script type="application/ld+json">`. */
export function getJsonLdScripts(html: string) {
  return [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(
    ([, content]) => content ?? '',
  )
}

/** Texto de cada título (`<h1>` a `<h6>`), sem as tags internas. */
export function getHeadings(html: string) {
  return [...html.matchAll(/<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/g)].map(([, , content]) =>
    decodeEntities((content ?? '').replace(/<[^>]*>/g, ''))
      .replace(/\s+/g, ' ')
      .trim(),
  )
}

/** Destino de cada `<link rel="preload" as="image">`: o `href` ou o `imagesrcset`. */
export function getImagePreloads(html: string) {
  return findTags(html, 'link')
    .filter(
      (link) => getAttribute(link, 'rel') === 'preload' && getAttribute(link, 'as') === 'image',
    )
    .map((link) => getAttribute(link, 'href') ?? getAttribute(link, 'imagesrcset') ?? '')
}

/** `href` do `<link>` com o `rel` informado (por exemplo, `canonical`). */
export function getLinkHref(html: string, rel: string) {
  const tag = findTags(html, 'link').find((link) => getAttribute(link, 'rel') === rel)
  return tag && getAttribute(tag, 'href')
}
