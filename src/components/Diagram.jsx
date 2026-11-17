import { Cite } from './Blocks.jsx'
import { rich } from './Tex.jsx'

/** Frame for any visual: title, the drawing, caption and source. */
export function Diagram({ title, cite, caption, children }) {
  return (
    <figure className="diagram">
      {title && <div className="diagram-title">{rich(title)}</div>}
      <div className="diagram-body">{children}</div>
      {(caption || cite) && (
        <figcaption>
          {caption && rich(caption)} {cite && <Cite>{cite}</Cite>}
        </figcaption>
      )}
    </figure>
  )
}

// ---- Hand-drawn SVG helpers ------------------------------------------------
// tone: 'topic' | 'ink' | 'muted' | a block kind ('intuition', 'definition',
// 'equation', 'example', 'trap') | a variable ('var-a' … 'var-f').
export const tone = (t = 'ink') =>
  t === 'topic' ? 'var(--topic)' : t.startsWith('var-') ? `var(--${t})` : `var(--c-${t})`

/** Responsive SVG canvas. Draw in a w×h coordinate system; it scales to the column width. */
export function Svg({ w = 600, h = 300, label, children }) {
  return (
    <svg className="svg" viewBox={`0 0 ${w} ${h}`} role="img" aria-label={label} style={{ maxWidth: w }}>
      {children}
    </svg>
  )
}

export function Box({ x, y, w = 120, h = 48, label, sub, t = 'topic', fill = true, rx = 10 }) {
  const c = tone(t)
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={rx}
        style={{ stroke: c, fill: fill ? `color-mix(in srgb, ${c} 14%, var(--bg))` : 'none', strokeWidth: 2 }} />
      <text x={x + w / 2} y={y + h / 2 + (sub ? -4 : 5)} textAnchor="middle" className="svg-label">{label}</text>
      {sub && <text x={x + w / 2} y={y + h / 2 + 14} textAnchor="middle" className="svg-sub">{sub}</text>}
    </g>
  )
}

export function Arrow({ x1, y1, x2, y2, label, t = 'ink', dashed, head = 10 }) {
  const c = tone(t)
  const a = Math.atan2(y2 - y1, x2 - x1)
  const p = (da) => `${x2 - head * Math.cos(a + da)},${y2 - head * Math.sin(a + da)}`
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2 - (head / 2) * Math.cos(a)} y2={y2 - (head / 2) * Math.sin(a)}
        style={{ stroke: c, strokeWidth: 2, strokeDasharray: dashed ? '6 5' : undefined }} />
      <polygon points={`${x2},${y2} ${p(0.45)} ${p(-0.45)}`} style={{ fill: c }} />
      {label && (
        <text x={(x1 + x2) / 2} y={(y1 + y2) / 2 - 8} textAnchor="middle" className="svg-sub">{label}</text>
      )}
    </g>
  )
}

export function Label({ x, y, children, t = 'ink', anchor = 'middle', size }) {
  return (
    <text x={x} y={y} textAnchor={anchor} className="svg-label" style={{ fill: tone(t), fontSize: size }}>
      {children}
    </text>
  )
}

/** Simple axes for sketched (non-data) curves. Origin bottom-left at (x, y+h). */
export function Axes({ x = 50, y = 20, w = 500, h = 220, xLabel, yLabel }) {
  return (
    <g>
      <Arrow x1={x} y1={y + h} x2={x + w} y2={y + h} />
      <Arrow x1={x} y1={y + h} x2={x} y2={y} />
      {xLabel && <Label x={x + w} y={y + h + 22} anchor="end">{xLabel}</Label>}
      {yLabel && <Label x={x + 8} y={y + 4} anchor="start">{yLabel}</Label>}
    </g>
  )
}

/** A smooth curve through points [[x,y], …] (Catmull-Rom spline). */
export function Curve({ points, t = 'topic', dashed, width = 2.5 }) {
  if (points.length < 2) return null
  const P = (i) => points[Math.max(0, Math.min(points.length - 1, i))]
  let d = `M${points[0][0]},${points[0][1]}`
  for (let i = 0; i < points.length - 1; i++) {
    const [p0, p1, p2, p3] = [P(i - 1), P(i), P(i + 1), P(i + 2)]
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6]
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6]
    d += ` C${c1[0]},${c1[1]} ${c2[0]},${c2[1]} ${p2[0]},${p2[1]}`
  }
  return <path d={d} style={{ stroke: tone(t), fill: 'none', strokeWidth: width, strokeDasharray: dashed ? '6 5' : undefined }} />
}
