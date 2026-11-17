// Exam weight as dots, never a percentage. note: text from 00-index.md, e.g. "task 2 on 4 of 5 exams".
const LEVELS = { high: 3, medium: 2, low: 1 }
const NAMES = { high: 'High exam weight', medium: 'Medium exam weight', low: 'Low exam weight' }

export function WeightBadge({ level, note }) {
  if (!level) return null
  const n = LEVELS[level] ?? 0
  return (
    <span className={`weight weight-${level}`} title={note ?? NAMES[level]}>
      <span className="weight-dots" aria-hidden="true">{'●'.repeat(n)}{'○'.repeat(3 - n)}</span>
      <span className="weight-text">{NAMES[level]}{note ? ` · ${note}` : ''}</span>
    </span>
  )
}
