#!/usr/bin/env node
// wall-e — UserPromptSubmit hook to track which wall-e mode is active
// Inspects user input for /wall-e commands and writes mode to flag file

const { getDefaultMode, isDeactivationCommand } = require('./wall-e-config');
const { clearMode, setMode, writeHookOutput } = require('./wall-e-runtime');

let input = '';
process.stdin.on('data', chunk => { input += chunk; });
process.stdin.on('end', () => {
  try {
    // Strip UTF-8 BOM some shells prepend when piping (breaks JSON.parse)
    const data = JSON.parse(input.replace(/^\uFEFF/, ''));
    const prompt = (data.prompt || '').trim().toLowerCase();

    // Match /wall-e commands
    if (/^[/@$]wall-e/.test(prompt)) {
      const parts = prompt.split(/\s+/);
      const cmd = parts[0].replace(/^[@$]/, '/');
      const arg = parts[1] || '';

      let mode = null;

      if (cmd === '/wall-e-review' || cmd === '/wall-e:wall-e-review') {
        mode = 'review';
      } else if (cmd === '/wall-e' || cmd === '/wall-e:wall-e') {
        if (arg === 'lite') mode = 'lite';
        else if (arg === 'full') mode = 'full';
        else if (arg === 'ultra') mode = 'ultra';
        else if (arg === 'off') mode = 'off';
        else mode = getDefaultMode();
      }

      if (mode && mode !== 'off') {
        setMode(mode);
        writeHookOutput(
          'UserPromptSubmit',
          mode,
          'WALL-E MODE CHANGED — level: ' + mode,
        );
      } else if (mode === 'off') {
        clearMode();
        writeHookOutput('UserPromptSubmit', 'off', 'WALL-E MODE OFF');
      }
    }

    // Detect deactivation
    if (isDeactivationCommand(prompt)) {
      clearMode();
      writeHookOutput('UserPromptSubmit', 'off', 'WALL-E MODE OFF');
    }
  } catch (e) {
    // Silent fail
  }
});
