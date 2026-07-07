#!/usr/bin/env node
// wall-e — Claude Code SubagentStart hook
//
// SessionStart context is parent-thread only and never reaches subagents, so
// without this every Task-spawned agent runs wall-e-unaware (issue #252).
// When wall-e mode is active, inject the same ruleset into each subagent.

const { getWallEInstructions } = require('./wall-e-instructions');
const { readMode, writeHookOutput } = require('./wall-e-runtime');

const mode = readMode();

// Absent flag or off → wall-e isn't active; inject nothing.
if (!mode || mode === 'off') {
  process.exit(0);
}

try {
  writeHookOutput('SubagentStart', mode, getWallEInstructions(mode));
} catch (e) {
  // Silent fail — a stdout error at hook exit must not surface as a hook failure.
}
