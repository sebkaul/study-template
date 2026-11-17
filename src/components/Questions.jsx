import { useState } from 'react'
import { GRADES, useProgress } from '../app/progress.jsx'
import { pageHref } from '../app/router.js'
import { T } from './Tex.jsx'

export function GradeButtons({ uid }) {
  const { state, setGrade } = useProgress()
  const current = state.grades[uid]
  return (
    <div className="grades" role="group" aria-label="How well did you know this?">
      {GRADES.map((g) => (
        <button
          key={g.id}
          type="button"
          className={`grade grade-${g.id}${current === g.id ? ' active' : ''}`}
          aria-pressed={current === g.id}
          onClick={() => setGrade(uid, g.id)}
        >
          {g.label}
        </button>
      ))}
    </div>
  )
}

/**
 * One question; answer hidden until revealed.
 * graded: show got it / shaky / no.  showTopic: 'always' | 'after' | undefined.
 */
export function QuestionCard({ q, graded, showTopic }) {
  const [open, setOpen] = useState(false)
  const topicLabel = q.page && (
    <a className="q-topic" href={pageHref(q.page.slug)} style={{ '--topic': q.page.topic.color }}>
      {q.page.topic.title} · {q.page.title}
    </a>
  )
  return (
    <div className="q-card">
      {showTopic === 'always' && topicLabel}
      <div className="q-text"><T text={q.q} /></div>
      {open ? (
        <>
          <div className="q-answer"><T text={q.a} /></div>
          {showTopic === 'after' && topicLabel}
        </>
      ) : (
        <button type="button" className="reveal" onClick={() => setOpen(true)}>Show answer</button>
      )}
      {graded && open && <GradeButtons uid={q.uid} />}
    </div>
  )
}

export function QuestionList({ items, graded }) {
  return (
    <div className="q-list">
      {items.map((q) => <QuestionCard key={q.uid} q={q} graded={graded} />)}
    </div>
  )
}
