import { useRef, useState } from 'react'
import config from '../../subject.config.js'
import { useProgress } from './progress.jsx'
import { allQuestions } from './registry.js'

const download = (name, text, type) => {
  const url = URL.createObjectURL(new Blob([text], { type }))
  const a = Object.assign(document.createElement('a'), { href: url, download: name })
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

// $…$ → \(…\), $$…$$ → \[…\] (Anki's MathJax); drop the site-only color macros.
const toAnki = (s = '') =>
  String(s)
    .replace(/\\v[a-f]\{/g, '{')
    .replace(/\$\$([\s\S]+?)\$\$/g, '\\[$1\\]')
    .replace(/\$([^$\n]+?)\$/g, '\\($1\\)')
    .replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>')
    .replace(/\n/g, '<br>')
const field = (s) => `"${s.replace(/"/g, '""')}"`
const tag = (s) => String(s).replace(/\s+/g, '_')

export function buildAnkiCsv() {
  const head = ['#separator:Semicolon', '#html:true', '#tags column:3']
  const rows = allQuestions.map((q) =>
    [field(toAnki(q.q)), field(toAnki(q.a)), field(`${config.code}::${tag(q.page.topic.id)} ${tag(q.page.slug)}`)].join(';'),
  )
  return [...head, ...rows].join('\n') + '\n'
}

export function ExportPage() {
  const { state, replace } = useProgress()
  const file = useRef(null)
  const [msg, setMsg] = useState('')

  const importJson = async (e) => {
    const f = e.target.files?.[0]
    if (!f) return
    try {
      const data = JSON.parse(await f.text())
      if (typeof data !== 'object' || !data) throw new Error('not an object')
      if (window.confirm('Replace your current checkboxes and grades with this file?')) {
        replace({ done: data.done ?? {}, exams: data.exams ?? {}, grades: data.grades ?? {} })
        setMsg('Imported.')
      }
    } catch (err) {
      setMsg(`Could not read that file: ${err.message}`)
    } finally {
      e.target.value = ''
    }
  }

  return (
    <div className="tool-page">
      <h1>Export</h1>
      <section className="section kind-neutral">
        <h2>Anki deck</h2>
        <p className="muted">All {allQuestions.length} questions as <code>front;back;tags</code>. Math is converted for Anki’s MathJax.</p>
        <button type="button" onClick={() => download(`${config.code}-anki.csv`, buildAnkiCsv(), 'text/csv')} disabled={!allQuestions.length}>
          Download CSV
        </button>
      </section>
      <section className="section kind-neutral">
        <h2>Progress backup</h2>
        <p className="muted">Checkboxes and grades are saved in this browser only. Move them between devices with a JSON file.</p>
        <div className="row">
          <button type="button" onClick={() => download(`${config.code}-progress.json`, JSON.stringify(state, null, 2), 'application/json')}>
            Export JSON
          </button>
          <button type="button" onClick={() => file.current?.click()}>Import JSON</button>
          <input ref={file} type="file" accept="application/json,.json" hidden onChange={importJson} />
        </div>
        {msg && <p>{msg}</p>}
      </section>
    </div>
  )
}
