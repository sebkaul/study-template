// TEMPLATE DEMO — reference page showing every component. Not synced to subject repos.
import {
  Arrow, Axes, Box, Columns, Curve, D, Def, Diagram, Eq, Example, FadedExample, Gap, Label,
  M, MentalModel, Mermaid, Plot, Section, Svg, T, Trap, V,
} from '../components'

export const meta = {
  title: 'First-order process (demo)',
  topic: 'demo',
  examWeight: { level: 'high', note: 'DEMO' },
  examTasks: ['Demo exam, task 1'],
  buildsOn: [],
  usedIn: ['02-demo-unbuilt'],
  sources: ['[demo.pdf, p. 1–2]'],
  questions: [
    { id: 'p1', kind: 'pretest', q: 'If you double the starting amount, does the half-life change?', a: 'No — for a first-order process $t_{1/2}$ does not depend on $C_0$.' },
    { id: 'p2', kind: 'pretest', q: 'What shape does $\\ln C$ vs $t$ have?', a: 'A straight line with slope $-k$.' },
    { id: 't1', q: 'Write the half-life of a first-order process.', a: '$$t_{1/2} = \\frac{\\ln 2}{k}$$' },
    { id: 't2', q: 'What are the units of $k$ for a first-order process?', a: '$\\mathrm{s^{-1}}$ (inverse time).' },
    { id: 't3', q: 'After three half-lives, what fraction is left?', a: '$(1/2)^3 = 1/8$.' },
  ],
  equations: [
    {
      id: 'decay',
      label: 'First-order decay',
      tex: String.raw`\va{C}(\vc{t}) = \vd{C_0}\, e^{-\vb{k}\vc{t}}`,
      vars: [
        { sym: String.raw`\va{C}`, desc: 'concentration at time $t$', unit: String.raw`\mathrm{mol\,L^{-1}}` },
        { sym: String.raw`\vd{C_0}`, desc: 'starting concentration', unit: String.raw`\mathrm{mol\,L^{-1}}` },
        { sym: String.raw`\vb{k}`, desc: 'rate constant', unit: String.raw`\mathrm{s^{-1}}` },
        { sym: String.raw`\vc{t}`, desc: 'time', unit: String.raw`\mathrm{s}` },
      ],
      cite: '[demo.pdf, p. 1]',
      check: { status: 'verified' },
    },
    {
      id: 'half',
      label: 'Half-life',
      tex: String.raw`t_{1/2} = \frac{\ln 2}{\vb{k}}`,
      vars: [{ sym: String.raw`\vb{k}`, desc: 'rate constant', unit: String.raw`\mathrm{s^{-1}}` }],
      cite: '[demo.pdf, p. 2]',
      check: { status: 'mismatch', note: 'Demo of a flagged mismatch: source writes $0.693/k$. Same value, shown as written in content.' },
    },
  ],
}

export default function Page() {
  return (
    <>
      <Section kind="intuition" title="Why it works">
        <MentalModel cite="[demo.pdf, p. 1]">
          <p>
            The <V c="b">rate</V> at which stuff disappears is proportional to how much <V c="a">stuff</V> is left.
            Less left → slower loss, so the curve flattens but never hits zero.
          </p>
        </MentalModel>
      </Section>

      <Section kind="definition" title="Concepts and definitions">
        <Columns>
          <div>
            <Def term="Rate constant $k$" cite="[demo.pdf, p. 1]">How fast the process runs; larger <M>k</M> means faster decay.</Def>
            <Def term="Half-life" cite="[demo.pdf, p. 2]">Time for the amount to fall to half. Constant for first order.</Def>
          </div>
          <Diagram title="Each half-life halves what is left" cite="[demo.pdf, p. 2, fig. 1]">
            <Svg w={420} h={240} label="Decay curve with half-life steps">
              <Axes x={40} y={16} w={360} h={180} xLabel="t" yLabel="C" />
              <Curve points={[[40, 26], [85, 72], [130, 111], [175, 135], [220, 153], [310, 175], [400, 185]]} />
              <Arrow x1={130} y1={196} x2={130} y2={115} t="muted" dashed />
              <Label x={130} y={218} t="muted">t½</Label>
              <Label x={220} y={218} t="muted">2·t½</Label>
              <Box x={250} y={30} w={140} h={44} label="C₀ → C₀/2" t="topic" />
            </Svg>
          </Diagram>
        </Columns>
        <Mermaid title="What controls the rate" cite="[demo.pdf, p. 1]"
          chart={`flowchart LR\n  A[Amount left C] --> R[Rate = k·C]\n  K[Rate constant k] --> R\n  R --> D[C decreases]\n  D --> A`} />
      </Section>

      <Section kind="equation" title="Equations">
        <Eq id="decay" />
        <p>
          Read it as: <V c="a">what is left</V> = <V c="d">what you started with</V> × a factor that shrinks with
          <V c="c"> time</V>, faster for bigger <V c="b">k</V>.
        </p>
        <Plot
          title="Drag k and watch the curve"
          caption="Illustrative range around the worked example’s values."
          cite="[demo.pdf, p. 1]"
          x={{ min: 0, max: 60, label: 't (s)' }}
          y={{ label: 'C (mol/L)', min: 0 }}
          params={[
            { key: 'k', label: '$k$', min: 0.01, max: 0.3, step: 0.01, value: 0.1, unit: '$\\mathrm{s^{-1}}$' },
            { key: 'C0', label: '$C_0$', min: 0.5, max: 2, step: 0.1, value: 1, unit: 'mol/L' },
          ]}
          fn={(t, p) => p.C0 * Math.exp(-p.k * t)}
          marks={[{ x: Math.LN2 / 0.1, label: 't½ at k = 0.1' }]}
        />
        <Eq id="half" />
      </Section>

      <Section kind="example" title="Worked example">
        <Example
          title="How much is left after 20 s?"
          cite="[demo.pdf, p. 2, ex. 1]"
          given={<T text="$C_0 = 1.0\,\mathrm{mol\,L^{-1}}$, $k = 0.10\,\mathrm{s^{-1}}$, $t = 20\,\mathrm{s}$" />}
          steps={[
            { title: 'Pick the equation', body: 'First order, so $C = C_0 e^{-kt}$.' },
            { title: 'Insert', body: '$C = 1.0 \\cdot e^{-0.10 \\cdot 20} = e^{-2}$' },
            { title: 'Evaluate', body: '$C \\approx 0.135\\,\\mathrm{mol\\,L^{-1}}$' },
          ]}
          result="About 14 % of the start amount is left."
        />
        <FadedExample
          title="Your turn: after 30 s?"
          cite="[demo.pdf, p. 2, ex. 2]"
          given="Same $C_0$ and $k$, now $t = 30\,\mathrm{s}$."
          steps={[
            { title: 'Pick the equation', body: '$C = C_0 e^{-kt}$' },
            { title: 'Insert', body: '$C = 1.0 \\cdot e^{-3}$', hidden: true },
            { title: 'Evaluate', body: '$C \\approx 0.050\\,\\mathrm{mol\\,L^{-1}}$', hidden: true },
          ]}
        />
      </Section>

      <Section kind="trap" title="Exam traps">
        <Trap title="Mixing log bases" cite="[demo.pdf, p. 2]">{String.raw`$\ln 2$, not $\log_{10} 2$.`}</Trap>
        <Trap title="Units of $k$">Minutes vs seconds — convert before inserting.</Trap>
        <Gap>not in files: second-order comparison.</Gap>
      </Section>

      <Section title="Display math check">
        <D>{String.raw`\frac{d\va{C}}{d\vc{t}} = -\vb{k}\,\va{C}`}</D>
      </Section>
    </>
  )
}
