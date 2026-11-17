#!/usr/bin/env bash
# Extract sources/**/*.pdf to .cache/sources/<name>.txt, one "=== PAGE N ===" marker per page.
# Only re-extracts PDFs that changed.
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p .cache/sources
shopt -s nullglob nocaseglob globstar
for pdf in sources/**/*.pdf; do
  name=$(basename "${pdf%.*}")
  out=".cache/sources/$name.txt"
  [[ -f "$out" && "$out" -nt "$pdf" ]] && continue
  pages=$(pdfinfo "$pdf" 2>/dev/null | awk '/^Pages:/ {print $2}')
  : > "$out"
  for ((p = 1; p <= ${pages:-0}; p++)); do
    echo "=== PAGE $p ===" >> "$out"
    pdftotext -layout -f "$p" -l "$p" "$pdf" - >> "$out" 2>/dev/null || true
  done
  echo "extracted $pdf ($pages pages) → $out"
done
ls .cache/sources
