import { useEffect, useId, useState } from 'react'
import { Diagram } from './Diagram.jsx'

/** Flowcharts, process chains, state diagrams. Mermaid loads only on pages that use it. */
export function Mermaid({ chart, title, cite, caption }) {
  const id = 'mmd' + useId().replace(/[^a-zA-Z0-9]/g, '')
  const [svg, setSvg] = useState('')
  const [err, setErr] = useState(null)
  useEffect(() => {
    let alive = true
    const dark = window.matchMedia?.('(prefers-color-scheme: dark)').matches
    import('mermaid')
      .then(async ({ default: mermaid }) => {
        mermaid.initialize({ startOnLoad: false, theme: dark ? 'dark' : 'neutral', securityLevel: 'strict' })
        const out = await mermaid.render(id, chart)
        if (alive) setSvg(out.svg)
      })
      .catch((e) => alive && setErr(String(e?.message ?? e)))
    return () => {
      alive = false
    }
  }, [chart, id])
  return (
    <Diagram title={title} cite={cite} caption={caption}>
      {err ? <pre className="mermaid-error">{err}</pre> : <div className="mermaid" dangerouslySetInnerHTML={{ __html: svg }} />}
    </Diagram>
  )
}
