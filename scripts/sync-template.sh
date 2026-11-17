#!/usr/bin/env bash
# Copy the shared template into this subject repo. Paths come from template.manifest.
# Uses ../study-template if it exists, otherwise clones github.com/sebkaul/study-template.
# Never touches: subject.config.js, src/course.js, src/pages/, content/, sources/, README.md.
set -euo pipefail
cd "$(git rev-parse --show-toplevel)"   # the repo you run it in, not where the script lives
src="${TEMPLATE_DIR:-../study-template}"
if [[ ! -f "$src/template.manifest" ]]; then
  src=$(mktemp -d)
  git clone -q --depth 1 https://github.com/sebkaul/study-template.git "$src"
fi
[[ "$(realpath "$src")" == "$(realpath .)" ]] && { echo "This is the template itself; nothing to sync."; exit 0; }
echo "Syncing from $src ($(git -C "$src" log -1 --format='%h %s' 2>/dev/null || echo 'no git'))"
while IFS= read -r p; do
  [[ -z "$p" || "$p" == \#* ]] && continue
  rm -rf "./$p"
  mkdir -p "$(dirname "./$p")"
  cp -r "$src/$p" "./$p"
done < "$src/template.manifest"
git status --short
