import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import config from '../../subject.config.js'

// Everything the user ticks or grades lives here, in localStorage only.
// No timers, dates, streaks or percentages — by design.
const KEY = `study:${config.code}:v1`
const EMPTY = { done: {}, exams: {}, grades: {} }

function load() {
  try {
    const raw = window.localStorage.getItem(KEY)
    return raw ? { ...EMPTY, ...JSON.parse(raw) } : EMPTY
  } catch {
    return EMPTY
  }
}

const Ctx = createContext(null)

export function ProgressProvider({ children }) {
  const [state, setState] = useState(load)

  useEffect(() => {
    try {
      window.localStorage.setItem(KEY, JSON.stringify(state))
    } catch {
      /* storage unavailable: progress lives for this tab only */
    }
  }, [state])

  const api = useMemo(() => {
    const flip = (group, id) =>
      setState((s) => ({ ...s, [group]: { ...s[group], [id]: !s[group][id] } }))
    return {
      state,
      toggleDone: (slug) => flip('done', slug),
      toggleExam: (id) => flip('exams', id),
      setGrade: (uid, grade) =>
        setState((s) => ({ ...s, grades: { ...s.grades, [uid]: grade } })),
      replace: (obj) => setState({ ...EMPTY, ...obj }),
    }
  }, [state])

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>
}

export const useProgress = () => useContext(Ctx)
export const GRADES = [
  { id: 'got', label: 'Got it' },
  { id: 'shaky', label: 'Shaky' },
  { id: 'no', label: 'No' },
]
