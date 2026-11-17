import { useMemo, useState } from 'react'
import { CartesianGrid, Legend, Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Diagram, tone } from './Diagram.jsx'
import { T } from './Tex.jsx'

const fmt = (v) => {
  if (v == null || !Number.isFinite(v)) return ''
  const a = Math.abs(v)
  if (a !== 0 && (a < 1e-3 || a >= 1e5)) return v.toExponential(2)
  return Number(v.toPrecision(4)).toString()
}

/**
 * Interactive plot of an equation from the page. Drag the sliders, watch the curve.
 *   x:      { min, max, label, log? }
 *   y:      { label, min?, max?, log? }
 *   params: [{ key, label, min, max, step, value, unit? }]
 *   series: [{ key, label, fn: (x, p) => y, t?: tone }]   (or a single `fn`)
 *   marks:  [{ x?, y?, label }]  reference lines (e.g. a value from the worked example)
 */
export function Plot({ title, cite, caption, x, y = {}, params = [], series, fn, marks = [], samples = 160, height = 300 }) {
  const [vals, setVals] = useState(() => Object.fromEntries(params.map((p) => [p.key, p.value])))
  const lines = useMemo(() => series ?? [{ key: 'y', label: y.label ?? 'y', fn, t: 'topic' }], [series, y.label, fn])

  const data = useMemo(() => {
    const rows = []
    for (let i = 0; i < samples; i++) {
      const f = i / (samples - 1)
      const xv = x.log ? x.min * (x.max / x.min) ** f : x.min + (x.max - x.min) * f
      const row = { x: xv }
      for (const s of lines) {
        const v = s.fn(xv, vals)
        row[s.key] = Number.isFinite(v) && (!y.log || v > 0) ? v : null
      }
      rows.push(row)
    }
    return rows
  }, [x, y.log, lines, vals, samples])

  return (
    <Diagram title={title} cite={cite} caption={caption}>
      {params.length > 0 && (
        <div className="plot-controls">
          {params.map((p) => (
            <label key={p.key}>
              <span className="plot-param">
                <T text={p.label} /> = <strong>{fmt(vals[p.key])}</strong> {p.unit && <T text={p.unit} />}
              </span>
              <input type="range" min={p.min} max={p.max} step={p.step ?? (p.max - p.min) / 100} value={vals[p.key]}
                onChange={(e) => setVals((v) => ({ ...v, [p.key]: Number(e.target.value) }))} />
            </label>
          ))}
        </div>
      )}
      <div className="plot-area">
        <ResponsiveContainer width="100%" height={height}>
          <LineChart data={data} margin={{ top: 16, right: 16, bottom: 24, left: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--line)" />
            <XAxis dataKey="x" type="number" scale={x.log ? 'log' : 'auto'} domain={[x.min, x.max]} tickFormatter={fmt}
              stroke="var(--ink-2)" label={{ value: x.label, position: 'insideBottom', offset: -14, fill: 'var(--ink-2)' }} />
            <YAxis scale={y.log ? 'log' : 'auto'} domain={[y.min ?? 'auto', y.max ?? 'auto']} allowDataOverflow={y.min != null || y.max != null}
              tickFormatter={fmt} stroke="var(--ink-2)" width={64}
              label={{ value: y.label, angle: -90, position: 'insideLeft', fill: 'var(--ink-2)' }} />
            <Tooltip formatter={(v) => fmt(v)} labelFormatter={(v) => `${x.label ?? 'x'} = ${fmt(v)}`}
              contentStyle={{ background: 'var(--surface)', border: '1px solid var(--line)', color: 'var(--ink)' }} />
            {lines.length > 1 && <Legend verticalAlign="top" />}
            {marks.map((m, i) => (
              <ReferenceLine key={i} x={m.x} y={m.y} stroke="var(--ink-2)" strokeDasharray="4 4"
                label={{ value: m.label, fill: 'var(--ink-2)', position: 'insideTopRight', fontSize: 12 }} />
            ))}
            {lines.map((s, i) => (
              <Line key={s.key} dataKey={s.key} name={s.label} dot={false} strokeWidth={2.5} isAnimationActive={false}
                stroke={tone(s.t ?? (i === 0 ? 'topic' : `var-${'abcdef'[i % 6]}`))} connectNulls={false} />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Diagram>
  )
}
