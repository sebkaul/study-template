# Study site

A visual, interactive summary site for one NTNU course. The course code and color are in `subject.config.js`, and the course map is in `src/course.js`.
This file is synced from `study-template`, so it's identical in every subject repo.

## Pipeline
1. **Claude web** writes `content/00-index.md` + `content/NN-slug.md` (format: `docs/step1-prompt.md`). The user drops them in.
2. **Claude Code** turns them into pages, only when the user asks:
   - `/build-index`: `content/00-index.md` → `src/course.js`
   - `/build-page NN`: `content/NN-*.md` → `src/pages/NN-*.jsx` (issue → branch → PR)
   - `/check-equations NN`: compares equations against `sources/*.pdf` (part of /build-page)
   - `/sync-template`: pulls shared shell/components/skills from study-template

## Content rules (hard)
- Use **only** what's in `content/*.md`. Don't add, "improve" or fill in. `content/` is read-only for Claude.
- `GAP` in content → `<Gap>` on the page. Never fill it.
- Keep every citation (`[file, p. N]`) and show it on the page.
- Equation mismatches vs `sources/` are **listed** (badge on the equation + PR body), never silently fixed.
- Content language = the content file's language. UI chrome (from `src/app`, `src/components`) is English.

## Visuals are the priority
The user learns from pictures, not text walls. Every page needs:
- ≥ 1 drawing in Concepts (SVG via `Svg`/`Box`/`Arrow`/`Curve`, or `Mermaid`), built from the content's **Visuals** section
- a `Plot` with sliders for each equation the content's Visuals section names as interactive
- `Columns` to put text next to its picture; short text, big visuals
- variable colors (`\va`…`\vf` + `<V c>`) kept consistent across equations, text and plots
Visuals only show what the content says. A picture is a faithful drawing, not new material.

## Colors — one job each
- Subject color: header/nav only (`subject.config.js`).
- Topic color: stripe/tab per topic (`src/course.js`, auto palette).
- Block colors, fixed: intuition green, definition blue, equation purple, exam-trap red, worked-example amber. No other accents.
- Variable colors: `\va`…`\vf` / `<V c="a">`, only for variables.
Never hard-code hex in pages. Use `tone()`, the CSS vars, or a block `kind`.

## Code map
- `src/pages/` — one file per subtopic: `export const meta` + `export default` (sections 2–6 only). **The only place page content goes.**
- `src/components/` — block/visual kit. API: `docs/components.md` (read it before writing a page).
- `src/app/` — shell: index checklist, review, mixed practice, equation sheet, Anki/JSON export, localStorage progress.
- Template-owned (synced; change in study-template, not here): see `template.manifest`.
- Subject-owned: `subject.config.js`, `src/course.js`, `src/pages/`, `content/`, `README.md`.

## Gotchas
- TeX in JSX: use `{String.raw`…`}`. Bare `{…}` in JSX text is JavaScript; plain template literals eat `\f`, `\t`, `\v`.
- Question `id`s are keys for saved grades. Never renumber existing ids when rebuilding a page; append new ones.
- No timers, dates, streaks, percentages or hour tracking anywhere in the UI.
- Use `scripts/screenshot.sh <slug>` and **look** at the result before you call a page done.

## Commands
`npm run dev` · `npm run lint` · `npm run build` · `scripts/screenshot.sh <slug>` · `scripts/extract-sources.sh`

## Git
- Each page goes **issue → `page/<issue#>-<slug>` branch → one commit → PR "Closes #N"**. The user squash-merges. Never merge yourself.
- `/build-index` and `/sync-template` commit straight to `main` (infra, user-approved).
- Don't open issues ahead of time. Only create one when the user asks for a page.
- No co-author trailers and no "Generated with Claude" lines, anywhere.
