import { Cite, Gap } from './Blocks.jsx'
import { D, M, T } from './Tex.jsx'
import { usePage } from './PageContext.js'

/** Renders meta.equations[id] for the current page. */
export function Eq({ id }) {
  const page = usePage()
  const eq = page?.equations?.find((e) => e.id === id)
  if (!eq) return <Gap>Equation “{id}” is not in this page’s meta.equations.</Gap>
  return <EqCard eq={eq} />
}

const CHECK_LABEL = { verified: 'Checked against source', mismatch: 'Differs from source', unverified: 'Not checked against source' }

export function EqCard({ eq }) {
  const check = eq.check?.status
  return (
    <div className="eq-card kind-equation">
      <div className="eq-head">
        <span className="eq-label">{eq.label}</span>
        {check && <span className={`eq-check eq-check-${check}`}>{CHECK_LABEL[check]}</span>}
      </div>
      <D tex={eq.tex} />
      {eq.vars?.length > 0 && (
        <table className="eq-vars">
          <tbody>
            {eq.vars.map((v, i) => (
              <tr key={i}>
                <td className="eq-sym"><M tex={v.sym} /></td>
                <td><T text={v.desc} /></td>
                <td className="eq-unit">{v.unit ? <M tex={v.unit} /> : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {eq.note && <p className="eq-note"><T text={eq.note} /></p>}
      {check === 'mismatch' && eq.check.note && (
        <div className="eq-mismatch"><strong>Source check:</strong> <T text={eq.check.note} /></div>
      )}
      {eq.cite && <Cite>{eq.cite}</Cite>}
    </div>
  )
}
