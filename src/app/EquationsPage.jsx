import { EqCard } from '../components/Equation.jsx'
import { allEquations, topics } from './registry.js'
import { pageHref } from './router.js'

export function EquationsPage() {
  if (allEquations.length === 0) return <div className="empty">No equations yet. They appear as pages are built.</div>
  const topicIds = [...new Set(allEquations.map((e) => e.page.topic.id))]
  const order = (id) => {
    const k = topics.findIndex((t) => t.id === id)
    return k < 0 ? 1e9 : k
  }
  topicIds.sort((a, b) => order(a) - order(b))
  return (
    <div className="tool-page">
      <h1>Equation sheet</h1>
      {topicIds.map((tid) => {
        const eqs = allEquations.filter((e) => e.page.topic.id === tid)
        const topic = eqs[0].page.topic
        return (
          <section key={tid} className="eq-topic" style={{ '--topic': topic.color }}>
            <h2>{topic.title}</h2>
            {eqs.map((eq) => (
              <div key={`${eq.page.slug}:${eq.id}`} className="eq-sheet-item">
                <a className="eq-from" href={pageHref(eq.page.slug)}>{eq.page.title}</a>
                <EqCard eq={eq} />
              </div>
            ))}
          </section>
        )
      })}
    </div>
  )
}
