import katex from 'katex'
import { useMemo } from 'react'

// Variable colors: write \va{k}, \vb{T} … \vf{x} in TeX, and <V c="a">…</V> in text.
// The same letter gives the same color in the equation and in its explanation.
export const VAR_KEYS = ['a', 'b', 'c', 'd', 'e', 'f']
const MACROS = Object.fromEntries(VAR_KEYS.map((k) => [`\\v${k}`, `\\htmlClass{var-${k}}{#1}`]))

const render = (tex, displayMode) =>
  katex.renderToString(tex, {
    displayMode,
    throwOnError: false,
    strict: 'ignore',
    macros: { ...MACROS },
    trust: (ctx) => ctx.command === '\\htmlClass',
  })

function Katex({ tex, display }) {
  const html = useMemo(() => render(tex, display), [tex, display])
  const Tag = display ? 'div' : 'span'
  return <Tag className={display ? 'tex-display' : 'tex-inline'} dangerouslySetInnerHTML={{ __html: html }} />
}

/** Inline math. Always pass TeX via String.raw: <M>{String.raw`\frac{a}{b}`}</M> */
export const M = ({ tex, children }) => <Katex tex={tex ?? String(children ?? '')} />
/** Display math. */
export const D = ({ tex, children }) => <Katex tex={tex ?? String(children ?? '')} display />

/** A colored word/phrase in running text, matching \va … \vf in equations. */
export const V = ({ c = 'a', children }) => <span className={`var var-${c}`}>{children}</span>

const MATH = /(\$\$[\s\S]+?\$\$|\$[^$\n]+?\$)/g
const BOLD = /(\*\*[^*]+\*\*)/g

/** Text with $inline$, $$display$$ and **bold**, as written in content/*.md. */
export function T({ text, children }) {
  const s = String(text ?? children ?? '')
  return s.split(MATH).map((part, i) => {
    if (part.startsWith('$$')) return <Katex key={i} tex={part.slice(2, -2)} display />
    if (part.startsWith('$') && part.length > 1) return <Katex key={i} tex={part.slice(1, -1)} />
    return part.split(BOLD).map((b, j) =>
      b.startsWith('**') ? <strong key={`${i}-${j}`}>{b.slice(2, -2)}</strong> : b,
    )
  })
}

const isPrim = (x) => typeof x === 'string' || typeof x === 'number'

/** Renders a string (or an array of plain strings/numbers) with <T>; passes JSX through. */
export const rich = (x) => {
  if (isPrim(x)) return <T text={String(x)} />
  if (Array.isArray(x) && x.every(isPrim)) return <T text={x.join('')} />
  return x
}
