#!/usr/bin/env bash
# Build, serve and screenshot pages so Claude can look at its own visuals.
# Usage: scripts/screenshot.sh <slug|route> [outdir]
#   slug  → #/p/<slug>     route starting with '#' or '' → used as is (e.g. '' = index, '#/equations')
# Writes <outdir>/<name>-desktop.png (1200 wide, full length) and -phone.png (390 wide).
set -euo pipefail
cd "$(dirname "$0")/.."
target="${1:-}"
out="${2:-.cache/shots}"
mkdir -p "$out"
if [[ -z "$target" || "$target" == \#* ]]; then route="$target"; name=$(echo "${target:-index}" | tr -c 'a-zA-Z0-9-\n' '_'); else route="#/p/$target"; name="$target"; fi
browser=$(command -v chromium || command -v google-chrome-stable || command -v chromium-browser || true)
[[ -z "$browser" ]] && { echo "No chromium found"; exit 1; }

npm run build --silent >/dev/null
port=$(( 4300 + RANDOM % 500 ))
npx vite preview --port "$port" --strictPort >/dev/null 2>&1 &
server=$!
trap 'kill $server 2>/dev/null || true' EXIT
for _ in $(seq 1 40); do curl -s "localhost:$port" >/dev/null && break; sleep 0.25; done

shot() { "$browser" --headless=new --disable-gpu --no-sandbox --hide-scrollbars --virtual-time-budget=8000 \
  --window-size="$1" --screenshot="$2" "http://localhost:$port/$route" >/dev/null 2>&1; }
shot 1200,6000 "$out/$name-desktop.png"
shot 390,9000 "$out/$name-phone.png"
# Trim the empty bottom so the images stay readable.
python3 - "$out/$name-desktop.png" "$out/$name-phone.png" <<'PY' 2>/dev/null || true
import sys
from PIL import Image, ImageChops
for p in sys.argv[1:]:
    im = Image.open(p).convert('RGB')
    bg = Image.new('RGB', im.size, im.getpixel((im.width - 1, im.height - 1)))
    box = ImageChops.difference(im, bg).getbbox()
    if box: im.crop((0, 0, im.width, min(im.height, box[3] + 40))).save(p)
PY
echo "$out/$name-desktop.png"
echo "$out/$name-phone.png"
