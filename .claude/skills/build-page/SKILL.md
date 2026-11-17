---
name: build-page
description: Build one study page from content/NN-*.md into src/pages/NN-*.jsx, with a GitHub issue, branch, equation check, visuals, screenshot review and a PR. Use when the user says "build page NN", "/build-page NN", or asks to make the page for a content file.
argument-hint: <NN or slug>
---

# Build page $ARGUMENTS

Follow these steps in order. Ask questions only if something blocks you.

## 0. Preflight
- `git switch main && git pull --ff-only`. The working tree must be clean. If it isn't, stop and tell the user.
- Find `content/$ARGUMENTS*.md` (NN prefix or full slug). Exactly one match, or stop.
- `src/course.js` must list this slug. If not, tell the user to run `/build-index` first (or ask if the index is outdated).
- If `src/pages/<slug>.jsx` already exists, this is a **rebuild**: keep the existing question `id`s.

## 1. Read
- The whole content file. Map its sections to the page: frontmatter → `meta`, Pretest → `questions` (kind `pretest`, ids `p1…`), Test yourself → `questions` (ids `t1…`), Equations → `meta.equations`, Past exam tasks → `meta.examTasks`, Sources → `meta.sources`.
- `docs/components.md` (the component API and the TeX gotcha).
- At most **one** existing page in `src/pages/` (the most recent), for consistency. Don't read them all.

## 2. Issue + branch
```bash
gh issue create --title "Page NN: <title>" --body "Build \`src/pages/<slug>.jsx\` from \`content/<file>\`."
git switch -c page/<issue#>-<slug>
```

## 3. Check equations
Run the `/check-equations` procedure for this file. Put each result into the equation's `check` field. Keep the table for the PR body.

## 4. Plan the visuals (before writing code)
Go through the content's **Visuals** section and decide each one's component:
- process / apparatus / cross-section / sketched curve → `Svg` + `Box` / `Arrow` / `Label` / `Axes` / `Curve` (or raw shapes)
- flow / sequence / decision / cause → effect → `Mermaid`
- equation with a parameter to vary → `Plot` with sliders (defaults and ranges from the content's values; say so in the caption)

Minimum: one drawing in Concepts, plus every visual the content lists. If the content has no Visuals section, draw the main concept faithfully from the definitions and say in the PR that the content had no visual specs.

## 5. Write `src/pages/<slug>.jsx`
- Write only sections 2–6, in this order: `intuition` → `definition` (+ visuals) → `equation` (+ plots) → `example` (Example, then FadedExample with **(try)** steps `hidden`) → `trap`. `PageLayout` adds pretest, test yourself, weight, links, sources and done from `meta`.
- Pick variable colors once for the page (`\va`…`\vf`) and use them in equations, `vars`, `<V>` text and plot labels.
- Put text next to its visual with `<Columns>`. Keep prose short.
- Every `GAP` → `<Gap>`. Every citation is kept.
- TeX: `String.raw` everywhere; never bare `{}` TeX in JSX text.
- Use only content from the file. Don't add facts, examples or "helpful context".

## 6. Verify
- `npm run lint` and `npm run build` must both pass with no warnings from your file.
- `scripts/screenshot.sh <slug>`, then **Read both PNGs** (desktop + phone). Fix overlaps, clipped labels, unreadable diagrams, broken math (red KaTeX text), and anything that scrolls sideways on the phone. Repeat until it looks right.
- Self-check: every content section is on the page · every citation is shown · every GAP is visible · no invented content · visuals present · variable colors consistent.

## 7. Commit + PR
One commit for the page:
```bash
git add src/pages/<slug>.jsx
git commit -m "feat(page): NN <title>"
git push -u origin HEAD
gh pr create --title "Page NN: <title>" --body "<body>"
```
PR body: a one-line summary · the visuals (list) · the equation check table (equation | status | note) · GAPs shown · anything in the content that was unclear · `Closes #<issue>`.
No co-author trailers and no "Generated with" lines. Don't merge. Report the PR URL to the user.
