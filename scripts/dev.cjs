#!/usr/bin/env node
// ==========================================================================
// Dev Orchestrator — Startet alle Watch-Prozesse + Server parallel
// ==========================================================================
// Nutzung:  npm run dev  oder  node scripts/dev.js
// Beendet alle Child-Prozesse sauber bei Ctrl+C.
// ==========================================================================

const { spawn } = require('child_process');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

// ── Prozess-Definitionen ──────────────────────────────────────────────
const processes = [
  { label: 'SCSS',   color: '\x1b[36m', cmd: 'sass',  args: ['scss/scss/main.scss:styles.css', '--watch', '--poll'] },
  { label: 'Site',   color: '\x1b[34m', cmd: 'sass',  args: ['website/scss/main.scss:website/styles.css', '--watch', '--poll'] },
  { label: 'Docs',   color: '\x1b[33m', cmd: 'node',  args: ['scripts/build-docs.js', '--watch'] },
  { label: 'Icons',  color: '\x1b[35m', cmd: 'node',  args: ['scripts/watch-icons.js'] },
  { label: 'Server', color: '\x1b[32m', cmd: 'node',  args: ['scripts/docs-server.js'] },
];

const RESET = '\x1b[0m';
const BOLD  = '\x1b[1m';
const children = [];

// ── Prefixed Output ───────────────────────────────────────────────────
function prefix(proc, stream) {
  const tag = `${proc.color}${BOLD}[${proc.label}]${RESET} `;
  let buffer = '';
  stream.on('data', (data) => {
    buffer += data.toString();
    const lines = buffer.split('\n');
    buffer = lines.pop(); // unvollständige letzte Zeile behalten
    for (const line of lines) {
      if (line.length > 0) {
        process.stdout.write(`${tag}${line}\n`);
      }
    }
  });
  stream.on('end', () => {
    if (buffer.length > 0) {
      process.stdout.write(`${tag}${buffer}\n`);
    }
  });
}

// ── Startup ───────────────────────────────────────────────────────────
console.log(`\n${BOLD}  NEO Design System — Dev Mode${RESET}`);
console.log(`  http://localhost:3000/docs/\n`);

for (const proc of processes) {
  const child = spawn(proc.cmd, proc.args, {
    cwd: ROOT,
    env: { ...process.env, FORCE_COLOR: '1' },
    stdio: ['ignore', 'pipe', 'pipe'],
    // Auf Windows npx/sass als .cmd auflösen
    shell: process.platform === 'win32',
  });

  prefix(proc, child.stdout);
  prefix(proc, child.stderr);

  child.on('error', (err) => {
    console.error(`${proc.color}[${proc.label}]${RESET} Fehler: ${err.message}`);
  });

  child.on('exit', (code, signal) => {
    if (signal !== 'SIGTERM' && signal !== 'SIGINT' && code !== 0 && code !== null) {
      console.error(`${proc.color}[${proc.label}]${RESET} Beendet mit Code ${code}`);
    }
  });

  children.push(child);
}

// ── Graceful Shutdown ─────────────────────────────────────────────────
function shutdown() {
  console.log(`\n${BOLD}  Alle Prozesse werden beendet…${RESET}\n`);
  for (const child of children) {
    child.kill('SIGTERM');
  }
  // Falls SIGTERM nicht reicht, nach 3s SIGKILL
  setTimeout(() => {
    for (const child of children) {
      try { child.kill('SIGKILL'); } catch {}
    }
    process.exit(0);
  }, 3000);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
