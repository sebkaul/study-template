// Collects every page in src/pages/ and joins it with the course map (src/course.js).
// Review, Mixed practice, Equation sheet and Anki export are all built from this,
// so a page only has to fill in its `meta` to show up everywhere.
import course from '../course.js'

const mods = import.meta.glob('../pages/*.jsx', { eager: true })
const basename = (p) => p.split('/').pop().replace(/\.jsx$/, '')

// Topic colors (stripe/tab only). Kept apart from the five block colors in theme.css.
export const TOPIC_PALETTE = [
  '#0891b2', '#db2777', '#65a30d', '#ea580c', '#4f46e5',
  '#0d9488', '#c026d3', '#ca8a04', '#2563eb', '#dc2626',
]

export const topics = (course.topics ?? []).map((t, i) => ({
  ...t,
  color: t.color ?? TOPIC_PALETTE[i % TOPIC_PALETTE.length],
  pages: t.pages ?? [],
}))
export const topicById = Object.fromEntries(topics.map((t) => [t.id, t]))
export const pastExams = course.pastExams ?? []
export const subjectName = course.name ?? ''

const topicOfSlug = (slug, meta) =>
  topics.find((t) => t.pages.some((p) => p.slug === slug)) ??
  topicById[meta.topic] ?? { id: 'other', title: 'Other', color: '#64748b', pages: [] }

export const pages = Object.entries(mods)
  .map(([path, mod]) => {
    const slug = basename(path)
    const meta = mod.meta ?? {}
    return { ...meta, slug, title: meta.title ?? slug, topic: topicOfSlug(slug, meta), Component: mod.default }
  })
  .sort((a, b) => a.slug.localeCompare(b.slug))

export const pageBySlug = Object.fromEntries(pages.map((p) => [p.slug, p]))

// Reading order: as in 00-index.md (course.js), then any page not listed there.
const listed = topics.flatMap((t) => t.pages.map((p) => p.slug))
export const orderedSlugs = [...listed, ...pages.map((p) => p.slug).filter((s) => !listed.includes(s))]
export const builtInOrder = orderedSlugs.filter((s) => pageBySlug[s])

export const titleOf = (slug) =>
  pageBySlug[slug]?.title ?? topics.flatMap((t) => t.pages).find((p) => p.slug === slug)?.title ?? slug

export const allQuestions = builtInOrder.flatMap((slug) => {
  const p = pageBySlug[slug]
  return (p.questions ?? []).map((q) => ({ ...q, uid: `${slug}:${q.id}`, page: p }))
})

export const allEquations = builtInOrder.flatMap((slug) => {
  const p = pageBySlug[slug]
  return (p.equations ?? []).map((eq) => ({ ...eq, page: p }))
})
