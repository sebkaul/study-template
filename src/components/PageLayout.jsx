import { useProgress } from '../app/progress.jsx'
import { builtInOrder, pageBySlug, titleOf } from '../app/registry.js'
import { pageHref } from '../app/router.js'
import { Gap, Section } from './Blocks.jsx'
import { PageCtx } from './PageContext.js'
import { QuestionList } from './Questions.jsx'
import { WeightBadge } from './WeightBadge.jsx'

const withUid = (page, kind) =>
  (page.questions ?? []).filter((q) => (q.kind ?? 'test') === kind).map((q) => ({ ...q, uid: `${page.slug}:${q.id}`, page }))

const LinkList = ({ slugs }) =>
  slugs?.length ? (
    <ul className="link-list">
      {slugs.map((s) => (
        <li key={s} style={{ '--topic': pageBySlug[s]?.topic.color }}>
          {pageBySlug[s] ? <a href={pageHref(s)}>{titleOf(s)}</a> : <span className="unbuilt">{titleOf(s)}</span>}
        </li>
      ))}
    </ul>
  ) : <p className="muted">—</p>

/**
 * Fixed page shape. The page component supplies sections 2–6; this adds
 * 1 Pretest, 7 Test yourself, 8 Exam weight + links, sources, 9 Done.
 */
export function PageLayout({ page, children }) {
  const { state, toggleDone } = useProgress()
  const pretest = withUid(page, 'pretest')
  const test = withUid(page, 'test')
  const i = builtInOrder.indexOf(page.slug)
  const prev = builtInOrder[i - 1]
  const next = builtInOrder[i + 1]

  return (
    <PageCtx.Provider value={page}>
      <article className="page" style={{ '--topic': page.topic.color }}>
        <header className="page-head">
          <div className="eyebrow">{page.topic.title}</div>
          <h1>{page.title}</h1>
          <WeightBadge level={page.examWeight?.level} note={page.examWeight?.note} />
        </header>

        <Section title="Pretest">
          <p className="muted">Guess before you read. Wrong guesses make the page stick better.</p>
          {pretest.length ? <QuestionList items={pretest} /> : <Gap>No pretest questions in the content file.</Gap>}
        </Section>

        {children}

        <Section title="Test yourself">
          {test.length ? <QuestionList items={test} graded /> : <Gap>No test questions in the content file.</Gap>}
        </Section>

        <Section title="Where this fits">
          <div className="fits">
            <div>
              <h3>Exam weight</h3>
              {page.examWeight?.level ? (
                <WeightBadge level={page.examWeight.level} note={page.examWeight.note} />
              ) : <Gap>No exam weight in the content file.</Gap>}
              {page.examTasks?.length > 0 && (
                <ul className="exam-tasks">{page.examTasks.map((t, k) => <li key={k}>{t}</li>)}</ul>
              )}
            </div>
            <div><h3>Builds on</h3><LinkList slugs={page.buildsOn} /></div>
            <div><h3>Used in</h3><LinkList slugs={page.usedIn} /></div>
          </div>
        </Section>

        {page.sources?.length > 0 && (
          <Section title="Sources">
            <ul className="sources">{page.sources.map((s, k) => <li key={k}>{s}</li>)}</ul>
          </Section>
        )}

        <label className={`done-box${state.done[page.slug] ? ' checked' : ''}`}>
          <input type="checkbox" checked={!!state.done[page.slug]} onChange={() => toggleDone(page.slug)} />
          Done with this page
        </label>

        <nav className="page-nav">
          {prev ? <a href={pageHref(prev)}>← {titleOf(prev)}</a> : <span />}
          {next ? <a href={pageHref(next)}>{titleOf(next)} →</a> : <span />}
        </nav>
      </article>
    </PageCtx.Provider>
  )
}
