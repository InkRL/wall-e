---
name: end-of-session
description: >
  Clean up a coding workspace before handoff, commit, review, or a context
  switch: inspect git status/diff, group and commit or stash real changes,
  update .gitignore, remove temp/generated files, scan for leaked secrets,
  update docs only where behavior changed, run the repo's own checks, and
  leave a short handoff note. Use when the user says "clean up the
  workspace", "end of session", "wrap up", "prepare for handoff", or asks to
  review git status, remove accidental files, or check for secrets before
  committing.
---

# End of Session

Leave the repo in a state someone else — or future you — can pick up cold:
no stray files, no secrets, no mystery diffs.

## Steps

1. **Inspect first.** `git status`, `git diff --stat`, `git diff` (plus the
   `--cached` versions if anything's staged). Know what changed before
   touching anything.
2. **Commit or stash.** Group real changes into coherent commits with
   descriptive messages, not `update`/`fix`/`wip`. Incomplete or unwanted
   work → `git stash push -m "<why>"`, don't commit it half-done.
3. **`.gitignore`.** Add genuine recurring junk you see in `git status`
   (caches, build output, `.env`, editor files). Already tracked but
   shouldn't be → `git rm --cached`, commit that together with the ignore update.
4. **Delete temp files.** `__pycache__/`, `*.pyc`, `.DS_Store`, stray logs,
   swap files, agent scratch dumps — never source, fixtures, lockfiles,
   datasets, or anything code references. Unsure → ask, don't delete.
5. **Secrets scan.** Grep the diff and new files for keys/tokens/passwords/
   private keys. Found one → don't commit or print it, move it to an env
   var, add a placeholder to `.env.example`, flag it for rotation.
6. **Docs.** Update README / `.env.example` / changelog only where behavior,
   setup, commands, or env vars actually changed.
7. **Validate.** Run whatever test/lint/build this repo already has. Report
   real results — don't hide a failure to look done.
8. **Handoff note.** What changed, what's still open, what to check next.

## Guardrails

Never: delete a file you're unsure about without asking, commit or print a
secret, bump dependencies without a reason, mix unrelated changes into one
commit, drop a lockfile without justification, touch files outside the repo
unless asked.

## Boundaries

Acts only on what the inspection step actually found — no speculative
refactors, no dependency upgrades nobody asked for. "stop end-of-session" or
"normal mode" to bail out mid-workflow.
