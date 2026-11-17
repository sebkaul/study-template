---
name: check-equations
description: Check every equation in a content file against the course PDFs in sources/ using pdftotext, and report mismatches without fixing them. Used by /build-page; also callable alone as "/check-equations NN".
argument-hint: <NN or slug>
---

# Check equations in content/$ARGUMENTS*.md

1. If `sources/` has no PDFs (`find -L sources -iname '*.pdf' | head -1` is empty), report "No sources/ PDFs, equations unverified", set every `check` to `{ status: 'unverified' }`, and stop.
2. For each equation in the content file, take its citation `[file, p. N]` and look it up. Cited names often drift from the real file name; `source.py` matches them anyway:
   - `scripts/source.py page "<file>" N --context 1` prints pages N−1…N+1, plus `PATH:` (the real file).
   - Citations without a page (e.g. `[exam.pdf, Ex. 5a]`): `scripts/source.py grep "<file>" "(Ex(ercise)?|Oppgave|Task)\.?\s*5"` finds the pages; then `page` them.
   - Exit 1 (no match): mark `unverified`, with the note "cited file not found in sources/".
   - Exit 2 (ambiguous; candidates printed): pick the one that fits the context (e.g. a solutions file for a worked answer). If it's still unclear, mark `unverified` and list the candidates in the note.
3. Compare:
   - pdftotext mangles math (subscripts on their own lines, fractions split, Greek as Unicode). If the text can't settle it, **Read the PDF page itself** (Read tool on the `PATH:`, `pages: "N"`) and compare visually.
   - Compare structure, signs, exponents, subscripts, constants and units. Notation differences that mean the same (e.g. `0.693` vs `ln 2`) count as **mismatch** with an explanation, not a silent pass.
   - status: `verified` (matches) · `mismatch` (differs; say exactly how) · `unverified` (not found, or the page doesn't contain it).
4. **Never edit content/ and never "correct" the equation.** The page shows the equation exactly as the content file has it, plus the badge and note.
5. Output a table: equation | cited source | status | note. /build-page puts this table in the PR body.
