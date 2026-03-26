/**
 * Orchestrator Agent
 *
 * Koordiniert Builder, Tester und Documenter Agents.
 * Kann kontextbezogen (nur geänderte Dateien) oder vollständig laufen.
 *
 * Usage:
 *   node agents/orchestrator.mjs                     # Volle Pipeline
 *   node agents/orchestrator.mjs --changed=file.scss  # Kontextbezogen (einzelne Datei)
 *   node agents/orchestrator.mjs --since=HEAD~1       # Seit letztem Commit
 *   node agents/orchestrator.mjs --quick              # Nur Builder (schnell)
 *   node agents/orchestrator.mjs --full               # Alles inkl. Dashboard
 */

import { log, logInfo, logPass, logFail, getChangedFiles } from './shared.mjs';
import { builderAgent } from './builder.mjs';
import { testerAgent } from './tester.mjs';
import { documenterAgent } from './documenter.mjs';
import { reporterAgent } from './reporter.mjs';

const AGENT = 'Orchestrator';

// ─── CLI Args ────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const changedArg = args.find(a => a.startsWith('--changed='))?.split('=')[1];
const sinceArg = args.find(a => a.startsWith('--since='))?.split('=')[1];
const isQuick = args.includes('--quick');
const isFull = args.includes('--full');

// ─── Determine Changed Files ─────────────────────────────────────────

let changedFiles = [];

if (changedArg) {
  // Einzelne Datei (z.B. vom PostToolUse Hook)
  changedFiles = [changedArg];
  logInfo(AGENT, `Mode: Single file — ${changedArg}`);
} else if (sinceArg) {
  // Seit einem bestimmten Commit
  changedFiles = getChangedFiles(sinceArg);
  logInfo(AGENT, `Mode: Since ${sinceArg} — ${changedFiles.length} files changed`);
} else if (isFull) {
  // Volle Pipeline (leeres Array = alles)
  changedFiles = [];
  logInfo(AGENT, 'Mode: Full pipeline');
} else {
  // Default: Änderungen seit letztem Commit
  changedFiles = getChangedFiles('HEAD~1');
  if (changedFiles.length === 0) {
    // Fallback: Unstaged Changes
    changedFiles = getChangedFiles('HEAD');
  }
  logInfo(AGENT, `Mode: Auto-detect — ${changedFiles.length} files changed`);
}

if (changedFiles.length > 0) {
  const types = {
    scss: changedFiles.filter(f => f.endsWith('.scss')).length,
    recipe: changedFiles.filter(f => f.endsWith('-recipe.json')).length,
    js: changedFiles.filter(f => f.endsWith('.js') || f.endsWith('.mjs')).length,
    vue: changedFiles.filter(f => f.endsWith('.vue')).length,
    other: changedFiles.filter(f => !f.match(/\.(scss|json|js|mjs|vue)$/)).length,
  };
  const summary = Object.entries(types).filter(([, v]) => v > 0).map(([k, v]) => `${v} ${k}`).join(', ');
  logInfo(AGENT, `Files: ${summary}`);
}

// ─── Run Agents ──────────────────────────────────────────────────────

console.log('\n╔══════════════════════════════════════════════════════╗');
console.log('║           NEO AGENT NETWORK — PIPELINE              ║');
console.log('╚══════════════════════════════════════════════════════╝\n');

const startTime = Date.now();
const agentResults = [];

// Phase 1: Builder (immer)
logInfo(AGENT, '─── Phase 1: Build ───');
const buildResult = await builderAgent(changedFiles);
agentResults.push(buildResult);

// Bei Build-Failure: Stoppen (Tester braucht gültigen Build)
if (buildResult.status === 'fail') {
  logFail(AGENT, 'Build failed — skipping Tester and Documenter');
  console.log('');
  reporterAgent(agentResults);
  process.exit(1);
}

// Phase 2: Tester (außer bei --quick)
if (!isQuick) {
  console.log('');
  logInfo(AGENT, '─── Phase 2: Test ───');
  const testResult = await testerAgent(changedFiles);
  agentResults.push(testResult);
}

// Phase 3: Documenter (außer bei --quick)
if (!isQuick) {
  console.log('');
  logInfo(AGENT, '─── Phase 3: Document ───');
  const docResult = await documenterAgent(isFull ? [] : changedFiles);
  agentResults.push(docResult);
}

// Phase 4: Reporter (immer)
console.log('');
logInfo(AGENT, '─── Phase 4: Report ───');
const report = reporterAgent(agentResults);

const totalDuration = Date.now() - startTime;
console.log(`\n🏁 Pipeline completed in ${(totalDuration / 1000).toFixed(1)}s\n`);

// Exit-Code: 0 wenn kein Fail, 1 bei Fail
process.exit(report.overallStatus === 'fail' ? 1 : 0);
