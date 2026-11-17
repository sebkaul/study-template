import { useState } from 'react'
import { QuestionCard } from '../components/Questions.jsx'
import { useProgress } from './progress.jsx'
import { allQuestions } from './registry.js'

export function ReviewPage() {
  const { state } = useProgress()
  // Snapshot on open, so re-grading a card doesn't make it jump away mid-review.
  const [items] = useState(() => allQuestions.filter((q) => ['shaky', 'no'].includes(state.grades[q.uid])))
  return (
    <div className="tool-page">
      <h1>Review</h1>
      <p className="muted">Every question you marked shaky or no. Re-grade as you go; the list refreshes next time you open it.</p>
      {items.length === 0 ? (
        <div className="empty">Nothing to review. Questions you mark shaky or no will show up here.</div>
      ) : (
        <div className="q-list">{items.map((q) => <QuestionCard key={q.uid} q={q} graded showTopic="always" />)}</div>
      )}
    </div>
  )
}
