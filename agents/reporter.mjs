/**
 * Reporter Agent
 *
 * Aggregiert Ergebnisse aller Agents und erstellt einen konsolidierten Report.
 * Speichert den Report als JSON für das Dashboard.
 */

import { ROOT, log, logPass, logFail, logWarn, logInfo, writeJSON } from './shared.mjs';
import { resolve } from 'path';
import { writeFileSync } from 'fs';

const AGENT = 'Reporter';

export function reporterAgent(agentResults) {
  logInfo(AGENT, 'Aggregating results...\n');

  const allResults = [];
  let totalPass = 0, totalWarn = 0, totalFail = 0;
  let totalDuration = 0;

  // Header
  console.log('╔══════════════════════════════════════════════════════╗');
  console.log('║           AGENT NETWORK PIPELINE REPORT             ║');
  console.log('╚══════════════════════════════════════════════════════╝\n');

  for (const agentResult of agentResults) {
    const { agent, status, results = [], duration = 0 } = agentResult;
    totalDuration += duration;

    const icon = status === 'pass' ? '✅' : status === 'warn' ? '⚠️' : '❌';
    const durationStr = duration > 1000 ? `${(duration / 1000).toFixed(1)}s` : `${duration}ms`;

    console.log(`${icon} ${agent} (${durationStr})`);

    for (const r of results) {
      const rIcon = r.status === 'pass' ? '  ✓' : r.status === 'warn' ? '  ⚡' : '  ✗';
      console.log(`   ${rIcon} ${r.agent}`);

      if (r.status === 'pass') totalPass++;
      else if (r.status === 'warn') totalWarn++;
      else totalFail++;

      allResults.push(r);
    }
    console.log('');
  }

  // Summary
  const overallStatus = totalFail > 0 ? 'fail' : totalWarn > 0 ? 'warn' : 'pass';
  const overallIcon = overallStatus === 'pass' ? '✅' : overallStatus === 'warn' ? '⚠️' : '❌';
  const totalDurationStr = totalDuration > 1000 ? `${(totalDuration / 1000).toFixed(1)}s` : `${totalDuration}ms`;

  console.log('─'.repeat(54));
  console.log(`${overallIcon} Overall: ${totalPass} passed, ${totalWarn} warnings, ${totalFail} failed`);
  console.log(`⏱️  Total duration: ${totalDurationStr}`);
  console.log('─'.repeat(54));

  // Empfehlungen bei Problemen
  if (totalFail > 0) {
    console.log('\n🔧 Empfohlene Maßnahmen:');
    for (const r of allResults.filter(r => r.status === 'fail')) {
      console.log(`   → Fix: ${r.agent}${r.error ? ` — ${r.error.slice(0, 80)}` : ''}`);
    }
  }

  if (totalWarn > 0) {
    console.log('\n💡 Hinweise:');
    for (const r of allResults.filter(r => r.status === 'warn').slice(0, 5)) {
      console.log(`   → Check: ${r.agent}`);
    }
  }

  // Report als JSON speichern
  const report = {
    timestamp: new Date().toISOString(),
    overallStatus,
    summary: { pass: totalPass, warn: totalWarn, fail: totalFail },
    duration: totalDuration,
    agents: agentResults.map(a => ({
      agent: a.agent,
      status: a.status,
      duration: a.duration,
      checks: a.results?.length || 0,
    })),
    details: allResults,
  };

  writeJSON('data/dashboard/last-pipeline-run.json', report);
  logInfo(AGENT, 'Report saved: data/dashboard/last-pipeline-run.json');

  return report;
}
