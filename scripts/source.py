#!/usr/bin/env python3
"""Look up cited course PDFs in sources/ and read pages on demand.

sources/ may contain symlinks to whole course folders with subfolders.
Cited names from Claude web often drift from the real file name (dropped '&',
'( )', doubled spaces), so names are compared after normalizing.

  scripts/source.py find "<cited name>"
  scripts/source.py page "<cited name>" N [--context K]
  scripts/source.py grep "<cited name>" "<regex>"

Exit codes: 0 ok · 1 no match · 2 ambiguous (candidates printed) · 3 pdftotext missing
"""
import argparse
import os
import re
import shutil
import subprocess
import sys
import unicodedata
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent / 'sources'


def norm(name: str) -> str:
    stem = re.sub(r'\.pdf$', '', name.strip(), flags=re.I)
    s = unicodedata.normalize('NFKD', stem.casefold())
    s = s.replace('ø', 'o').replace('æ', 'ae')
    return ''.join(c for c in s if c.isalnum() and not unicodedata.combining(c))


def all_pdfs():
    for dirpath, _dirs, files in os.walk(ROOT, followlinks=True):
        for f in files:
            if f.lower().endswith('.pdf'):
                yield Path(dirpath) / f


def find(cited: str):
    want = norm(Path(cited).name)
    pdfs = list(all_pdfs())
    exact = [p for p in pdfs if norm(p.name) == want]
    if exact:
        return exact
    # Fallback: one name contains the other (e.g. a shortened citation).
    return [p for p in pdfs if want and (want in norm(p.name) or norm(p.name) in want)]


def resolve(cited: str) -> Path:
    hits = find(cited)
    if not hits:
        print(f'NO MATCH for "{cited}" in {ROOT}', file=sys.stderr)
        sys.exit(1)
    if len(hits) > 1:
        print(f'AMBIGUOUS "{cited}":', file=sys.stderr)
        for h in hits:
            print(f'  {h.relative_to(ROOT)}', file=sys.stderr)
        sys.exit(2)
    return hits[0]


def page_count(pdf: Path) -> int:
    out = subprocess.run(['pdfinfo', str(pdf)], capture_output=True, text=True).stdout
    m = re.search(r'^Pages:\s+(\d+)', out, re.M)
    return int(m.group(1)) if m else 0


def page_text(pdf: Path, n: int) -> str:
    return subprocess.run(['pdftotext', '-layout', '-f', str(n), '-l', str(n), str(pdf), '-'],
                          capture_output=True, text=True).stdout


def main():
    if not shutil.which('pdftotext'):
        print('pdftotext not installed (poppler)', file=sys.stderr)
        sys.exit(3)
    ap = argparse.ArgumentParser()
    sub = ap.add_subparsers(dest='cmd', required=True)
    f = sub.add_parser('find'); f.add_argument('name')
    p = sub.add_parser('page'); p.add_argument('name'); p.add_argument('n', type=int)
    p.add_argument('--context', type=int, default=0)
    g = sub.add_parser('grep'); g.add_argument('name'); g.add_argument('regex')
    a = ap.parse_args()

    if a.cmd == 'find':
        hits = find(a.name)
        for h in hits:
            print(h.relative_to(ROOT))
        sys.exit(0 if len(hits) == 1 else (1 if not hits else 2))

    pdf = resolve(a.name)
    total = page_count(pdf)
    print(f'FILE: {pdf.relative_to(ROOT)}  ({total} pages)')
    print(f'PATH: {pdf.resolve()}')  # real location, for Read + permission rules
    if a.cmd == 'page':
        for n in range(max(1, a.n - a.context), min(total, a.n + a.context) + 1):
            print(f'=== PAGE {n} ===')
            print(page_text(pdf, n))
    else:
        rx = re.compile(a.regex, re.I)
        found = False
        for n in range(1, total + 1):
            lines = [l for l in page_text(pdf, n).splitlines() if rx.search(l)]
            if lines:
                found = True
                print(f'=== PAGE {n} ===')
                print('\n'.join(l.strip() for l in lines))
        sys.exit(0 if found else 1)


if __name__ == '__main__':
    main()
