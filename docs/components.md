# Component reference

Import everything from `../components`. The page file only writes **sections 2–6**.
`PageLayout` adds the rest automatically from `meta`: header, 1 Pretest, 7 Test yourself,
8 Exam weight + builds on/used in, sources, and 9 Done.

## Page file shape — `src/pages/NN-slug.jsx`

```jsx
import { Section, MentalModel, Def, Eq, Example, FadedExample, Trap, Gap, Diagram, Svg, Box, Arrow, Plot, Mermaid, M, V, T } from '../components'

export const meta = {
  title, topic,                                   // topic = id from src/course.js
  examWeight: { level: 'high'|'medium'|'low', note },
  examTasks: ['H2023 task 3: …'],
  buildsOn: ['NN-slug'], usedIn: ['NN-slug'],
  sources: ['[file, p. 3–7]'],
  questions: [
    { id: 'p1', kind: 'pretest', q: '…', a: '…' },  // 2–3
    { id: 't1', q: '…', a: '…' },                   // 3–5, kind defaults to 'test'
  ],
  equations: [{
    id, label,
    tex: String.raw`\va{k} = \vb{A}\,e^{-\vc{E_a}/R\vd{T}}`,
    vars: [{ sym: String.raw`\va{k}`, desc: 'rate constant', unit: String.raw`\mathrm{s^{-1}}` }],
    note, cite,
    check: { status: 'verified'|'mismatch'|'unverified', note },  // from /check-equations
  }],
}

export default function Page() {
  return (<>
    <Section kind="intuition" title="…">  <MentalModel cite>…</MentalModel> </Section>
    <Section kind="definition" title="…"> <Def term cite>…</Def> + ≥1 visual </Section>
    <Section kind="equation" title="…">   <Eq id="…" /> + <Plot> where it fits </Section>
    <Section kind="example" title="…">    <Example …/> <FadedExample …/> </Section>
    <Section kind="trap" title="…">       <Trap title cite>…</Trap> </Section>
  </>)
}
```

## ⚠ TeX in JSX — the one gotcha
- **Never** put `{` `}` TeX straight into JSX text: `<Trap>$\log_{10}$</Trap>` breaks, because `{10}` is a JS expression.
- Wrap it: `<Trap>{String.raw`$\log_{10} x$`}</Trap>`, `<M>{String.raw`\frac{a}{b}`}</M>`.
- In `meta` and props, use `String.raw` for any TeX, or double the backslashes in a normal string (`'$\\ln 2$'`).
  Plain template literals break `\f`, `\t`, `\n`, `\v` (e.g. `\frac` becomes a form-feed + "rac").

## Text and math
| Component | Use |
|---|---|
| `<T text="… $x$ … **bold**" />` | Text with inline/display math (the same syntax as content/*.md) |
| `<M>{String.raw`…`}</M>` / `<D>…</D>` | Inline / display math |
| `<V c="a">rate constant</V>` | Colored word, matching `\va{…}` in TeX. Letters a–f |

**Variable colors:** in each page, give each key variable one letter (`\va`…`\vf`) and use it everywhere the variable appears: equations, legends, `<V>` in the text and plot labels. Same variable, same color throughout the page.

## Blocks (five fixed kinds — never other accent colors)
`Section kind` = `intuition` (green) · `definition` (blue) · `equation` (purple) · `example` (amber) · `trap` (red). Omit `kind` for neutral.
`<Block kind title cite>`, `<MentalModel cite>`, `<Def term cite>`, `<Trap title cite>`, `<Gap>…</Gap>`, `<Cite>`, `<Columns>` (side by side, stacks on phones).

## Equations
`<Eq id="…" />` renders `meta.equations[id]` with its symbol table, cite and check badge. Equations also appear on the Equation sheet automatically.

## Examples
`<Example title given steps={[{ title, body }]} result cite />`: all steps shown.
`<FadedExample … steps={[{ body, hidden: true }]} />`: hidden steps are revealed one by one. Mark the content file's **(try)** steps as `hidden`.

## Visuals — the priority
| Component | Use for |
|---|---|
| `<Diagram title caption cite>` | Frame for any visual (always use it, for the caption + source) |
| `<Svg w h label>` + `Box`, `Arrow`, `Label`, `Axes`, `Curve` | Hand-drawn: process schematics, reactors, cross-sections, sketched curves, free-body-style drawings |
| `<Mermaid chart="flowchart LR …" />` | Flowcharts, process chains, decision trees, state diagrams |
| `<Plot x y params fn / series marks />` | Interactive equation plots with sliders |

SVG `t` (tone) prop: `'topic'`, `'ink'`, `'muted'`, a block kind, or `'var-a'`…`'var-f'`. Never hard-code hex colors.
Use a raw `<svg>` with your own shapes when the helpers aren't enough, but keep `style={{ stroke: tone('…') }}` for the colors.
