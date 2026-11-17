import { useEffect } from 'react'
import config from '../../subject.config.js'
import { PageLayout } from '../components/PageLayout.jsx'
import { EquationsPage } from './EquationsPage.jsx'
import { ExportPage } from './ExportPage.jsx'
import { IndexPage } from './IndexPage.jsx'
import { MixedPage } from './MixedPage.jsx'
import { ProgressProvider, useProgress } from './progress.jsx'
import { allQuestions, pageBySlug, subjectName } from './registry.js'
import { href, useRoute } from './router.js'
import { ReviewPage } from './ReviewPage.jsx'

function TopBar({ name }) {
  const { state } = useProgress()
  const toReview = allQuestions.filter((q) => ['shaky', 'no'].includes(state.grades[q.uid])).length
  const links = [
    ['index', 'Index', href()],
    ['review', `Review${toReview ? ` (${toReview})` : ''}`, href('review')],
    ['mixed', 'Mixed practice', href('mixed')],
    ['equations', 'Equation sheet', href('equations')],
    ['export', 'Export', href('export')],
  ]
  return (
    <header className="topbar">
      <a className="brand" href={href()}>
        <span className="brand-code">{config.code}</span>
        {subjectName && <span className="brand-name">{subjectName}</span>}
      </a>
      <nav>
        {links.map(([id, label, to]) => (
          <a key={id} href={to} className={name === id ? 'active' : undefined}>{label}</a>
        ))}
      </nav>
    </header>
  )
}

function View({ name, arg }) {
  if (name === 'p') {
    const page = pageBySlug[arg]
    if (!page) return <div className="empty">No page called “{arg}”. <a href={href()}>Back to index</a></div>
    return <PageLayout page={page}><page.Component /></PageLayout>
  }
  if (name === 'review') return <ReviewPage />
  if (name === 'mixed') return <MixedPage />
  if (name === 'equations') return <EquationsPage />
  if (name === 'export') return <ExportPage />
  return <IndexPage />
}

export default function App() {
  const { name, arg } = useRoute()

  useEffect(() => {
    document.documentElement.style.setProperty('--subject', config.color)
  }, [])

  useEffect(() => {
    const page = name === 'p' && pageBySlug[arg]
    document.title = page ? `${page.title} · ${config.code}` : `${config.code}${subjectName ? ` · ${subjectName}` : ''}`
  }, [name, arg])

  return (
    <ProgressProvider>
      <TopBar name={name} />
      <main className="shell">
        <View name={name} arg={arg} />
      </main>
    </ProgressProvider>
  )
}
