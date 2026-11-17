import { rich } from './Tex.jsx'

// Five block kinds, five fixed colors (theme.css). No other accent colors in content.
export const KINDS = {
  intuition: 'Mental model',
  definition: 'Definition',
  equation: 'Equations',
  example: 'Worked example',
  trap: 'Exam trap',
}

/** A page section. kind sets the color; omit kind for neutral sections. */
export function Section({ kind, title, children }) {
  return (
    <section className={`section ${kind ? `kind-${kind}` : 'kind-neutral'}`}>
      <h2>
        {kind && <span className="kind-chip">{KINDS[kind]}</span>}
        {title}
      </h2>
      {children}
    </section>
  )
}

/** A colored card inside a section. */
export function Block({ kind, title, cite, children }) {
  return (
    <div className={`block kind-${kind}`}>
      {title && <div className="block-title">{rich(title)}</div>}
      <div className="block-body">{children}</div>
      {cite && <Cite>{cite}</Cite>}
    </div>
  )
}

/** The "why it works" box. */
export const MentalModel = ({ cite, children }) => (
  <Block kind="intuition" title="Why it works" cite={cite}>{children}</Block>
)

/** A term and its definition. */
export function Def({ term, cite, children }) {
  return (
    <div className="def kind-definition">
      <div className="def-term">{rich(term)}</div>
      <div className="def-body">{rich(children)}</div>
      {cite && <Cite>{cite}</Cite>}
    </div>
  )
}

/** One exam trap. */
export function Trap({ title, cite, children }) {
  return (
    <div className="trap kind-trap">
      {title && <div className="trap-title">{rich(title)}</div>}
      <div>{rich(children)}</div>
      {cite && <Cite>{cite}</Cite>}
    </div>
  )
}

/** Source citation, e.g. "[F3.pdf, p. 12]". Shown exactly as written in content/. */
export const Cite = ({ children }) => <span className="cite">{children}</span>

/** Visible gap: content/*.md says "GAP: …". Never fill it in. */
export function Gap({ children }) {
  return (
    <div className="gap" role="note">
      <strong>GAP</strong> <span>{rich(children)}</span>
    </div>
  )
}

/** Two or more things side by side (stacks on phones). */
export const Columns = ({ children }) => <div className="columns">{children}</div>
