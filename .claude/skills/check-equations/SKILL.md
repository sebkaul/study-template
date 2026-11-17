---
name: check-equations
description: Check every equation in a content file against the course PDFs in sources/ using pdftotext, and report mismatches without fixing them. Used by /build-page; also callable alone as "/check-equations NN".
argument-hint: <NN or slug>
---

# Check equations in content/$ARGUMENTS*.md

1. If `sources/` has no PDFs, report "No sources/ PDFs, equations unverified", set every `check` to `{ status: 'unverified' }`, and stop.
2. `scripts/extract-sources.sh` (cached; it only re-extracts changed PDFs).
3. For each equation in the content file:
   - Take its citation `[file, p. N]`. Open `.cache/sources/<file>.txt` and jump to `=== PAGE N ===` (also look at N±1).
   - pdftotext mangles math (subscripts on their own lines, fractions split, Greek as Unicode). If the text can't settle it, **Read the PDF page itself** (Read tool, `pages: "N"`) and compare visually.
   - Compare structure, signs, exponents, subscripts, constants and units. Notation differences that mean the same (e.g. `0.693` vs `ln 2`) count as **mismatch** with an explanation, not a silent pass.
   - status: `verified` (matches) · `mismatch` (differs; say exactly how) · `unverified` (no citation, or the page doesn't contain it).
4. **Never edit content/ and never "correct" the equation.** The page shows the equation exactly as the content file has it, plus the badge and note.
5. Output a table: equation | cited source | status | note. /build-page puts this table in the PR body.
