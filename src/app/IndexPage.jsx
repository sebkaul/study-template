import { Mermaid } from '../components/Mermaid.jsx'
import { WeightBadge } from '../components/WeightBadge.jsx'
import { useProgress } from './progress.jsx'
import { pageBySlug, pages, pastExams, topics } from './registry.js'
import { pageHref } from './router.js'

// "builds on" graph of the built pages, colored by topic.
function TopicMap() {
  const edges = pages.flatMap((p) => (p.buildsOn ?? []).filter((s) => pageBySlug[s]).map((s) => [s, p.slug]))
  if (edges.length === 0) return null
  const id = (s) => 'n' + s.replace(/[^a-zA-Z0-9]/g, '_')
  const used = [...new Set(edges.flat())]
  const lines = [
    'flowchart LR',
    ...used.map((s) => `  ${id(s)}["${pageBySlug[s].title.replace(/"/g, "'")}"]`),
    ...edges.map(([a, b]) => `  ${id(a)} --> ${id(b)}`),
    ...used.map((s) => `  style ${id(s)} stroke:${pageBySlug[s].topic.color},stroke-width:3px`),
  ]
  return <Mermaid title="How the topics build on each other" chart={lines.join('\n')} />
}

function CheckRow({ checked, onChange, children }) {
  return (
    <li className={checked ? 'checked' : undefined}>
      <label>
        <input type="checkbox" checked={checked} onChange={onChange} />
      </label>
      {children}
    </li>
  )
}

export function IndexPage() {
  const { state, toggleDone, toggleExam } = useProgress()
  const listed = new Set(topics.flatMap((t) => t.pages.map((p) => p.slug)))
  const extra = pages.filter((p) => !listed.has(p.slug))
  const groups = [
    ...topics,
    ...(extra.length ? [{ id: 'other', title: 'Not in 00-index.md', color: '#64748b', pages: extra }] : []),
  ]
  const subSlugs = groups.flatMap((g) => g.pages.map((p) => p.slug))
  const total = subSlugs.length + pastExams.length
  const done = subSlugs.filter((s) => state.done[s]).length + pastExams.filter((e) => state.exams[e.id]).length

  if (groups.length === 0) {
    return (
      <div className="empty">
        <h1>No course map yet</h1>
        <p>Add <code>content/00-index.md</code> and run <code>/build-index</code>, then build pages with <code>/build-page</code>.</p>
      </div>
    )
  }

  return (
    <div className="index">
      <p className="progress-line"><strong>{done} / {total}</strong> done</p>

      <div className="topic-grid">
        {groups.map((t) => (
          <section key={t.id} className="topic-card" style={{ '--topic': t.color }}>
            <header>
              <h2>{t.title}</h2>
              <WeightBadge level={t.weight} note={t.weightNote} />
            </header>
            {t.summary && <p className="muted">{t.summary}</p>}
            <ul className="checklist">
              {t.pages.map(({ slug, title }) => (
                <CheckRow key={slug} checked={!!state.done[slug]} onChange={() => toggleDone(slug)}>
                  {pageBySlug[slug] ? (
                    <a href={pageHref(slug)}>{pageBySlug[slug].title ?? title}</a>
                  ) : (
                    <span className="unbuilt">{title ?? slug} <small>not built yet</small></span>
                  )}
                </CheckRow>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <TopicMap />

      {pastExams.length > 0 && (
        <section className="topic-card exams">
          <header><h2>Past exams</h2></header>
          <ul className="checklist">
            {pastExams.map((e) => (
              <CheckRow key={e.id} checked={!!state.exams[e.id]} onChange={() => toggleExam(e.id)}>
                <span>{e.label}{e.note && <small> · {e.note}</small>}</span>
              </CheckRow>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
