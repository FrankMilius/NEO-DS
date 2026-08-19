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
import { widersacherAgent } from './widersacher.mjs';
import { reporterAgent } from './reporter.mjs';

const AGENT = 'Orchestrator';

// ─── CLI Args ────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const changedArg = args.find(a => a.startsWith('--changed='))?.split('=')[1];
const sinceArg = args.find(a => a.startsWith('--since='))?.split('=')[1];
const isQuick = args.includes('--quick');
const isFull = args.includes('--full');
// --widersacher erzwingt Phase 3.5 auch ohne Befund. Fuer den Fall, dass
// jemand eine Fertigmeldung pruefen lassen will, obwohl die Pipeline
// zufrieden ist — und das ist genau die Lage, in der die teuersten Fehler
// dieses Projekts entstanden sind.
const widersacherErzwingen = args.includes('--widersacher');

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

// Phase 3.5: Widersacher
//
// Laeuft nur, wenn Phase 1-3 etwas gemeldet haben — oder auf ausdrueckliche
// Anforderung. Er prueft nicht den Code, sondern die Schlussfolgerung: Haelt
// die Behauptung, die in einem Befund steckt, auch in der AUSLIEFERUNG?
//
// Bis zum 19.08.2026 stand diese Phase nur im Skill, nicht im Ablauf. Der
// Text beschrieb sie ueber zwanzig Zeilen, der Dirigent kannte sie nicht —
// dieselbe Luecke zwischen Zusage und Wirklichkeit, die wir gerade im Recipe
// des Heroes aufgeraeumt haben.
let widersacherResult = null;
if (!isQuick) {
  console.log('');
  logInfo(AGENT, '─── Phase 3.5: Widerlegen ───');
  widersacherResult = await widersacherAgent(agentResults, { immer: widersacherErzwingen });
  agentResults.push(widersacherResult);
}

// Phase 4: Reporter (immer)
console.log('');
logInfo(AGENT, '─── Phase 4: Report ───');
const report = reporterAgent(agentResults);

const totalDuration = Date.now() - startTime;

// Die Sperre. Sie ist der Grund, warum es Phase 3.5 gibt: Ein Lauf, der eine
// widerlegte Behauptung enthaelt, darf nicht wie ein gelungener aussehen.
if (widersacherResult?.gesperrt) {
  console.log('\n' + '━'.repeat(54));
  console.log('  GESPERRT — der Widersacher hat eine Behauptung widerlegt.');
  console.log('  Nichts gilt als fertig und nichts wird zurueckgenommen,');
  console.log('  bevor neu gemessen wurde.');
  console.log('━'.repeat(54));
}

console.log(`\n🏁 Pipeline completed in ${(totalDuration / 1000).toFixed(1)}s\n`);

// Exit-Code: 0 wenn kein Fail, 1 bei Fail oder Sperre
process.exit(report.overallStatus === 'fail' || widersacherResult?.gesperrt ? 1 : 0);
