---
name: wall-e-gain
description: >
  Show wall-e's measured impact as a compact scoreboard: less code, less
  cost, more speed, from the agentic benchmark medians. One-shot display, not a
  per-repo number. Trigger: /wall-e-gain,
  "wall-e gain", "what does wall-e save", "show wall-e impact",
  "wall-e scoreboard".
---

# Wall-E Gain

Display this scoreboard when invoked. One-shot: do NOT change mode, write flag
files, or persist anything.

The figures are the published agentic benchmark medians (12 feature tasks on a
real FastAPI + React repo, Haiku 4.5, n=4). They are measured, not computed from
the current repo. Source: `README.md` and `assets/benchmark-agentic.svg`.

## Scoreboard

Render plain ASCII bars. The bar length shows the measured percentage; the label
carries the exact figure:

```
  wall-e gain       agentic benchmark · 12 tasks · Haiku 4.5

  Lines of code   no-skill  ████████████████████  100%
                  wall-e    █████████▌··········   46%   ▼ 54%
  Tokens          no-skill  ████████████████████  100%
                  wall-e    ███████████████▌····   78%   ▼ 22%
  Cost            no-skill  ████████████████████  100%
                  wall-e    ████████████████····   80%   ▼ 20%
  Time            no-skill  ████████████████████  100%
                  wall-e    █████████████▌······   73%   ▼ 27%
  Safety          wall-e    ████████████████████  100%

  This repo:  /wall-e-debt  (shortcuts you deferred)
              /wall-e-audit (what's still cuttable)
```

## Honesty boundary

These are benchmark medians, not this repo. NEVER print a per-repo savings
number ("you saved X lines/tokens here"): the unbuilt version was never
written, so there is no real baseline to subtract from in a live repo. The
only real per-repo figures come from `/wall-e-debt` (a counted ledger), and
this card points there instead of inventing one.

## Boundaries

One-shot display. Edits nothing, changes no mode.
"stop wall-e" or "normal mode": revert.
