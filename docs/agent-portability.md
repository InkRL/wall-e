# Agent Portability

Wall-E is an agent-portable skill distribution. The skills in `skills/` hold
the core behavior; host-specific files are adapters that make that behavior easy
to load in a given agent.

## Supported Adapters

| Host | Files | Notes |
|------|-------|-------|
| Claude Code | `.claude-plugin/plugin.json`, `commands/`, `hooks/claude-codex-hooks.json`, `hooks/` | Full plugin install with session activation, mode tracking, commands, and statusline support. |
| Codex | `.codex-plugin/plugin.json`, `hooks/claude-codex-hooks.json`, `hooks/`, `skills/` | Plugin install with lifecycle hooks for activation and mode tracking. |
| GitHub Copilot CLI | `.github/plugin/`, `AGENTS.md`, `.github/copilot-instructions.md` | Plugin-supported (`copilot plugin marketplace add InkRL/wall-e` + `copilot plugin install wall-e@wall-e`). Fallback instruction mode from `AGENTS.md` or `.github/copilot-instructions.md`. |
| Devin CLI | `AGENTS.md`, `.devin/hooks.v1.json`, `hooks/` | Reads `AGENTS.md` from repo root. From a checkout, `.devin/hooks.v1.json` adds session activation and mode tracking. |
| Generic agents | `AGENTS.md` or `skills/*/SKILL.md` | Copy the compact rule file or load the skill files directly. |

## Adapter Rule

Keep adapters thin. When a host supports skills or hooks, point it at the
existing `skills/` and `hooks/` files. When a host only supports project
instructions, keep its copied rule text aligned with `AGENTS.md`.
