/**
 * Shared utilities for all agents
 */

import { execSync } from 'child_process';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
export const ROOT = resolve(__dirname, '..');

// ─── Logging ─────────────────────────────────────────────────────────

const COLORS = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  dim: '\x1b[2m',
  bold: '\x1b[1m',
};

export function log(agent, msg, color = 'reset') {
  const c = COLORS[color] || COLORS.reset;
  const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
  console.log(`${COLORS.dim}${timestamp}${COLORS.reset} ${c}[${agent}]${COLORS.reset} ${msg}`);
}

export function logPass(agent, msg) { log(agent, `✅ ${msg}`, 'green'); }
export function logFail(agent, msg) { log(agent, `❌ ${msg}`, 'red'); }
export function logWarn(agent, msg) { log(agent, `⚠️  ${msg}`, 'yellow'); }
export function logInfo(agent, msg) { log(agent, `ℹ️  ${msg}`, 'blue'); }

// ─── Command Execution ──────────────────────────────────────────────

export function run(cmd, opts = {}) {
  const { cwd = ROOT, timeout = 60000, silent = false } = opts;
  try {
    const output = execSync(cmd, { cwd, encoding: 'utf-8', timeout, stdio: silent ? 'pipe' : 'pipe' });
    return { ok: true, output: output.trim(), code: 0 };
  } catch (e) {
    return { ok: false, output: (e.stdout || '') + (e.stderr || ''), code: e.status || 1 };
  }
}

// ─── File Helpers ────────────────────────────────────────────────────

export function readJSON(path) {
  try { return JSON.parse(readFileSync(resolve(ROOT, path), 'utf-8')); }
  catch { return null; }
}

export function writeJSON(path, data) {
  writeFileSync(resolve(ROOT, path), JSON.stringify(data, null, 2));
}

export function fileExists(path) {
  return existsSync(resolve(ROOT, path));
}

// ─── Git Helpers ─────────────────────────────────────────────────────

export function getChangedFiles(since = 'HEAD~1') {
  const { ok, output } = run(`git diff --name-only ${since}`);
  if (!ok) return [];
  return output.split('\n').filter(Boolean);
}

export function getUnstagedChanges() {
  const { ok, output } = run('git diff --name-only');
  if (!ok) return [];
  return output.split('\n').filter(Boolean);
}

// ─── Result Aggregation ─────────────────────────────────────────────

export function createResult(agent, status, details = {}) {
  return {
    agent,
    status, // 'pass' | 'warn' | 'fail'
    timestamp: new Date().toISOString(),
    ...details,
  };
}
