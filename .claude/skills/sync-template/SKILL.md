---
name: sync-template
description: Pull the shared shell, components, skills and CLAUDE.md from the study-template repo into this subject repo. Use when the user says "/sync-template" or "update from the template".
---

# Sync from study-template

1. `git switch main && git pull --ff-only`. Clean working tree, or stop.
2. `scripts/sync-template.sh` (uses `../study-template` if present, else clones from GitHub). It only touches the paths in `template.manifest`.
3. `git diff --stat`. If `package.json` changed: `npm install`.
4. `npm run lint && npm run build`. If an existing page breaks because a component API changed, fix the **page** (subject-owned) and mention it.
5. Commit to `main` with `chore: sync template (<template short sha>)` and push.
No co-author trailers.
