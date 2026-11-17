import { useState } from 'react'
import { Cite } from './Blocks.jsx'
import { rich } from './Tex.jsx'

// steps: [{ title?, body }]  — body is a string ($math$ ok) or JSX (e.g. a small diagram).

/** Fully worked example: every step shown. */
export function Example({ title, cite, given, steps, result }) {
  return (
    <div className="example kind-example">
      {title && <div className="example-title">{rich(title)}</div>}
      {given && <div className="example-given">{rich(given)}</div>}
      <ol className="steps">
        {steps.map((s, i) => (
          <li key={i}>
            {s.title && <div className="step-title">{rich(s.title)}</div>}
            <div>{rich(s.body)}</div>
          </li>
        ))}
      </ol>
      {result && <div className="example-result">{rich(result)}</div>}
      {cite && <Cite>{cite}</Cite>}
    </div>
  )
}

/**
 * Faded example: steps marked hidden: true stay covered; the reader tries first,
 * then reveals them one at a time, in order.
 */
export function FadedExample({ title, cite, given, steps, result }) {
  const hiddenIdx = steps.map((s, i) => (s.hidden ? i : -1)).filter((i) => i >= 0)
  const [shown, setShown] = useState(0)
  const nextHidden = hiddenIdx[shown]
  const allShown = shown >= hiddenIdx.length
  return (
    <div className="example faded kind-example">
      {title && <div className="example-title">{rich(title)}</div>}
      {given && <div className="example-given">{rich(given)}</div>}
      <ol className="steps">
        {steps.map((s, i) => {
          const covered = s.hidden && hiddenIdx.indexOf(i) >= shown
          return (
            <li key={i} className={covered ? 'covered' : undefined}>
              {s.title && <div className="step-title">{rich(s.title)}</div>}
              {covered ? (
                i === nextHidden ? (
                  <button type="button" className="reveal" onClick={() => setShown((n) => n + 1)}>
                    Try this step, then reveal
                  </button>
                ) : (
                  <div className="covered-note">Hidden until the step above is revealed</div>
                )
              ) : (
                <div>{rich(s.body)}</div>
              )}
            </li>
          )
        })}
      </ol>
      {result && allShown && <div className="example-result">{rich(result)}</div>}
      {cite && <Cite>{cite}</Cite>}
    </div>
  )
}
