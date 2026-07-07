---
name: wall-e-help
description: >
  Quick-reference card for all wall-e modes, skills, and commands.
  One-shot display, not a persistent mode. Trigger: /wall-e-help,
  "wall-e help", "what wall-e commands", "how do I use wall-e".
---

# Wall-E Help

Display this reference card when invoked. One-shot, do NOT change mode,
write flag files, or persist anything.

## Levels

| Level | Trigger | What change |
|-------|---------|-------------|
| **Lite** | `/wall-e lite` | Build what's asked, name the lazier alternative in one line. |
| **Full** | `/wall-e` | The ladder enforced: YAGNI → stdlib → native → one line → minimum. Default. |
| **Ultra** | `/wall-e ultra` | YAGNI extremist. Deletion before addition. Challenges requirements before building. |

Level sticks until changed or session end.

## Skills

| Skill | Trigger | What it does |
|-------|---------|--------------|
| **wall-e** | `/wall-e` | Lazy mode itself. Simplest solution that works. |
| **wall-e-review** | `/wall-e-review` | Over-engineering review: `L42: yagni: factory, one product. Inline.` |
| **wall-e-gain** | `/wall-e-gain` | Measured-impact scoreboard: less code, less cost, more speed. |
| **wall-e-help** | `/wall-e-help` | This card. |

Codex uses `@wall-e`, `@wall-e-review`, and `@wall-e-help`; Claude Code
and OpenCode use the slash-command forms above (OpenCode ships `/wall-e` and
`/wall-e-review`).

## Deactivate

Say "stop wall-e" or "normal mode". Resume anytime with `/wall-e`.
`/wall-e off` also works.

## Configure Default Mode

Default mode = `full`, auto-active every session. Change it:

**Environment variable** (highest priority):
```bash
export WALLE_DEFAULT_MODE=ultra
```

**Config file** (`~/.config/wall-e/config.json`, Windows: `%APPDATA%\wall-e\config.json`):
```json
{ "defaultMode": "lite" }
```

Set `"off"` to disable auto-activation on session start, activate manually
with `/wall-e` when wanted.

Resolution: env var > config file > `full`.

## Update

Enable auto-update once: open `/plugin`, go to Marketplaces, pick wall-e, Enable auto-update. Claude Code then pulls new versions at startup (run `/reload-plugins` when it prompts). Manual refresh: `/plugin marketplace update wall-e` then `/reload-plugins`.

If `/plugin` is not recognized, your Claude Code is out of date. Update it (`npm install -g @anthropic-ai/claude-code@latest`, or `brew upgrade claude-code`) and restart. Other hosts use their own update flow.

## More

Full docs + examples: https://github.com/DietrichGebert/ponytail
