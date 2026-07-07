#!/usr/bin/env node
// Regression coverage for the Devin CLI hook adapter (.devin/hooks.v1.json).
//
// Devin's hooks.v1.json is documented as "Claude Code compatible" but with two
// real differences from hooks/claude-codex-hooks.json: the hooks map is the
// entire file (no top-level "hooks" wrapper key), and there is no
// commandWindows fallback, so `command` must run unmodified under any shell.
// This also covers the isDevin branch in hooks/wall-e-runtime.js, which wraps
// SessionStart/UserPromptSubmit output in hookSpecificOutput (Devin's docs
// don't show raw stdout as additionalContext the way native Claude does).

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const root = path.join(__dirname, '..');
const HOOKS_JSON = '.devin/hooks.v1.json';
// No commandWindows fallback exists for Devin, so a command must be plain
// enough to run the same way under bash, PowerShell, and cmd.exe alike.
const SHELL_SYNTAX = /[$%;&|]/;
const HOOK_SCRIPT = /hooks[\\/]([\w.-]+\.(?:js|mjs|cjs))/;

function loadDevinHooks() {
  return JSON.parse(fs.readFileSync(path.join(root, HOOKS_JSON), 'utf8'));
}

function devinCommands(config) {
  return Object.values(config)
    .flat()
    .flatMap((entry) => entry.hooks)
    .map((h) => h.command)
    .filter(Boolean);
}

test('.devin/hooks.v1.json has no wrapper "hooks" key', () => {
  const config = loadDevinHooks();
  assert.equal(config.hooks, undefined, 'the hooks map must be the top-level object, not nested under "hooks"');
  assert.ok(Array.isArray(config.SessionStart), 'expected a top-level SessionStart entry');
  assert.ok(Array.isArray(config.UserPromptSubmit), 'expected a top-level UserPromptSubmit entry');
});

test('Devin hook commands are shell-syntax-free', () => {
  const commands = devinCommands(loadDevinHooks());
  assert.ok(commands.length > 0, 'expected at least one command hook');
  for (const cmd of commands) {
    assert.doesNotMatch(cmd, SHELL_SYNTAX, `command relies on shell syntax Devin has no Windows fallback for: ${cmd}`);
  }
});

test('every Devin hook command points at a script that ships in hooks/', () => {
  const commands = devinCommands(loadDevinHooks());
  for (const cmd of commands) {
    const match = cmd.match(HOOK_SCRIPT);
    assert.ok(match, `cannot find a hooks/ script in command: ${cmd}`);
    assert.ok(fs.existsSync(path.join(root, 'hooks', match[1])), `command references a missing hook script: ${match[1]}`);
  }
});

// --- Runtime behavior under Devin's env (DEVIN_PROJECT_DIR) ---

function run(script, env, input = '') {
  return spawnSync(process.execPath, [path.join(root, 'hooks', script)], {
    env: { ...process.env, ...env },
    input,
    encoding: 'utf8',
  });
}

// Keep the base env clean: a leaked PLUGIN_DATA/COPILOT_PLUGIN_DATA from the
// dev or CI shell would steer isDevin's detection into the wrong branch.
delete process.env.CLAUDE_CONFIG_DIR;
delete process.env.PLUGIN_DATA;
delete process.env.COPILOT_PLUGIN_DATA;
delete process.env.DEVIN_PROJECT_DIR;

function withTempHome(fn) {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'wall-e-devin-'));
  try {
    const home = path.join(temp, 'home');
    fs.mkdirSync(home, { recursive: true });
    fn(home);
  } finally {
    fs.rmSync(temp, { recursive: true, force: true });
  }
}

test('wall-e-activate.js wraps context in hookSpecificOutput for Devin and writes state under ~/.config/devin', () => {
  withTempHome((home) => {
    const result = run('wall-e-activate.js', {
      HOME: home,
      USERPROFILE: home,
      DEVIN_PROJECT_DIR: root,
      WALLE_DEFAULT_MODE: 'ultra',
    });
    assert.equal(result.status, 0, result.stderr);

    const statePath = path.join(home, '.config', 'devin', '.wall-e-active');
    assert.equal(fs.readFileSync(statePath, 'utf8'), 'ultra');

    const output = JSON.parse(result.stdout);
    assert.equal(output.hookSpecificOutput.hookEventName, 'SessionStart');
    assert.match(output.hookSpecificOutput.additionalContext, /WALL-E MODE ACTIVE — level: ultra/);
  });
});

test('wall-e-activate.js stays silent for Devin when mode is off', () => {
  withTempHome((home) => {
    const result = run('wall-e-activate.js', {
      HOME: home,
      USERPROFILE: home,
      DEVIN_PROJECT_DIR: root,
      WALLE_DEFAULT_MODE: 'off',
    });
    assert.equal(result.status, 0, result.stderr);
    assert.equal(result.stdout, '', 'off mode must not inject additionalContext for Devin');
    assert.equal(fs.existsSync(path.join(home, '.config', 'devin', '.wall-e-active')), false);
  });
});

test('wall-e-mode-tracker.js tracks @wall-e mode switches for Devin', () => {
  withTempHome((home) => {
    const env = { HOME: home, USERPROFILE: home, DEVIN_PROJECT_DIR: root };

    let result = run('wall-e-mode-tracker.js', env, JSON.stringify({ prompt: '@wall-e lite' }));
    assert.equal(result.status, 0, result.stderr);
    const statePath = path.join(home, '.config', 'devin', '.wall-e-active');
    assert.equal(fs.readFileSync(statePath, 'utf8'), 'lite');
    let output = JSON.parse(result.stdout);
    assert.equal(output.hookSpecificOutput.hookEventName, 'UserPromptSubmit');
    assert.match(output.hookSpecificOutput.additionalContext, /WALL-E MODE CHANGED — level: lite/);

    result = run('wall-e-mode-tracker.js', env, JSON.stringify({ prompt: 'normal mode' }));
    assert.equal(result.status, 0, result.stderr);
    assert.equal(fs.existsSync(statePath), false);
    output = JSON.parse(result.stdout);
    assert.match(output.hookSpecificOutput.additionalContext, /WALL-E MODE OFF/);
  });
});
