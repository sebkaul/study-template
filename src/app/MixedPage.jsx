import { useState } from 'react'
import { QuestionCard } from '../components/Questions.jsx'
import { allQuestions } from './registry.js'

const shuffle = (arr) => {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function MixedPage() {
  const [deck, setDeck] = useState(() => shuffle(allQuestions))
  const [i, setI] = useState(0)
  const restart = () => {
    setDeck(shuffle(allQuestions))
    setI(0)
  }
  if (deck.length === 0) return <div className="empty">No questions yet. They appear as pages are built.</div>
  const q = deck[i]
  return (
    <div className="tool-page">
      <h1>Mixed practice</h1>
      <p className="muted">Questions from every topic, shuffled. The topic is hidden until you reveal the answer.</p>
      <div className="mixed-counter">Card {i + 1} of {deck.length}</div>
      <QuestionCard key={q.uid + i} q={q} graded showTopic="after" />
      <div className="mixed-nav">
        <button type="button" onClick={() => setI((n) => Math.max(0, n - 1))} disabled={i === 0}>← Previous</button>
        {i < deck.length - 1 ? (
          <button type="button" onClick={() => setI((n) => n + 1)}>Next →</button>
        ) : (
          <button type="button" onClick={restart}>Shuffle again</button>
        )}
      </div>
    </div>
  )
}
