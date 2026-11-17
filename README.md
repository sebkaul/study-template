# study-template

The shared shell for my course summary sites (IMAK2008, KP3010, TKP4110, IMAT3012 …). Each subject repo is a copy of this template plus its own content and pages.

**Run the demo:** `npm install && npm run dev`. It includes one demo page that uses every component.

## How the pieces fit

```
Claude web  ──(docs/step1-prompt.md)──▶  content/00-index.md, content/NN-slug.md
Claude Code ──/build-index──▶ src/course.js
            ──/build-page NN──▶ src/pages/NN-slug.jsx   (issue → branch → PR)
study-template ──/sync-template──▶ every subject repo   (paths in template.manifest)
```

| Path | Owner | What |
|---|---|---|
| `src/app/` | template | Index checklist, Review, Mixed practice, Equation sheet, Anki CSV + JSON backup, localStorage progress |
| `src/components/` | template | Blocks, KaTeX math with variable colors, examples, questions, visuals (`Svg`, `Mermaid`, `Plot`) — see `docs/components.md` |
| `.claude/skills/`, `CLAUDE.md`, `docs/`, `scripts/` | template | The workflow |
| `subject.config.js`, `src/course.js`, `src/pages/`, `content/`, `README.md` | subject | Never overwritten by a sync |

## Changing the template
Change it here, push, then run `/sync-template` in each subject repo.

## New subject
```bash
gh repo create sebkaul/<CODE>-summary --public --clone && cd <CODE>-summary
../study-template/scripts/sync-template.sh   # or copy the manifest paths
# write subject.config.js, src/course.js (empty), content/, sources/README.md
```

Stack: React 19 · Vite 8 · KaTeX · Mermaid · Recharts.
