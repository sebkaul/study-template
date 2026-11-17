Course PDFs (slides, øvinger, past exams). Everything here except this README is gitignored, so nothing reaches the public repo.

Easiest: symlink your whole course folder, subfolders and all:
```bash
ln -s ~/path/to/course-folder sources/semester
```
`/check-equations` only opens the files and pages that `content/*.md` cites, via `scripts/source.py`. Unrelated files in the folder are never read.

If the folder lives outside this project, allow Claude to read it without prompting by adding this to `.claude/settings.local.json` (not committed):
```json
{ "permissions": { "allow": ["Read(//absolute/path/to/course-folder/**)"] } }
```
