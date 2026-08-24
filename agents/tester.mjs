/**
 * Tester Agent
 *
 * Verantwortlich für: Unit Tests (Vitest), Pipeline Guard, Fragment Lint
 * Kontextbezogen: Führt nur relevante Tests aus basierend auf geänderten Dateien.
 */

import { ROOT, log, logPass, logFail, logWarn, logInfo, run, createResult } from './shared.mjs';

const AGENT = 'Tester';

export async function testerAgent(changedFiles = []) {
  logInfo(AGENT, 'Starting test suite...');
  const results = [];
  const startTime = Date.now();

  const hasScss = changedFiles.some(f => f.endsWith('.scss'));
  const hasRecipes = changedFiles.some(f => f.endsWith('-recipe.json'));
  const hasJs = changedFiles.some(f => f.endsWith('.js') || f.endsWith('.mjs'));
  const hasVue = changedFiles.some(f => f.endsWith('.vue'));
  const runAll = changedFiles.length === 0;

  // 1. Unit Tests (Vitest)
  if (runAll || hasScss || hasRecipes) {
    logInfo(AGENT, 'Running unit tests (Vitest)...');
    const r = run('npx vitest run 2>&1', { timeout: 120000 });
    const passMatch = r.output.match(/(\d+) passed/);
    const failMatch = r.output.match(/(\d+) failed/);
    const passed = passMatch ? parseInt(passMatch[1]) : 0;
    const failed = failMatch ? parseInt(failMatch[1]) : 0;

    if (failed === 0 && passed > 0) {
      logPass(AGENT, `Unit tests: ${passed}/${passed + failed} passed`);
      results.push(createResult('vitest', 'pass', { passed, failed }));
    } else if (failed > 0) {
      logFail(AGENT, `Unit tests: ${failed} FAILED (${passed} passed)`);
      results.push(createResult('vitest', 'fail', { passed, failed, output: r.output.slice(-500) }));
    } else {
      logWarn(AGENT, 'No unit tests executed');
      results.push(createResult('vitest', 'warn', { note: 'No tests found' }));
    }
  }

  // Ein Werkzeug, das ABSTUERZT, ist nie eine Warnung.
  //
  // Der Pipeline-Waechter brach wochenlang mit einem Stacktrace ab — CommonJS
  // in einem ESM-Paket, Abbruch in Zeile 21. Hier wurde das als `warn`
  // verbucht, die Leitung blieb gruen, und dahinter lagen 236 Tokens, die kein
  // Kundendesign erreichen konnte. Ein Waechter, dessen Scheitern eine Warnung
  // ist, ist kein Waechter.
  //
  // Unterschieden wird darum zweierlei:
  //   Das Werkzeug LIEF und hat etwas gefunden  -> warn (Befund, behebbar)
  //   Das Werkzeug LIEF NICHT                   -> fail (blind, nicht behebbar,
  //                                                weil niemand weiss, was fehlt)
  const abgestuerzt = (ausgabe) => /(\bError:|ReferenceError|SyntaxError|ERR_[A-Z_]+|is not defined|Cannot find module|^\s+at\s)/m.test(ausgabe || '');

  // 2. Pipeline Guard
  if (runAll || hasScss || hasRecipes || hasJs) {
    logInfo(AGENT, 'Running pipeline guard...');
    const r = run('npm run pipeline:check 2>&1', { timeout: 30000 });
    if (r.ok) {
      logPass(AGENT, 'Pipeline guard passed');
      results.push(createResult('pipeline:guard', 'pass'));
    } else {
      // Der Waechter selbst: hier ist auch ein Befund ein fail. Er meldet
      // fehlende Tokens — und was er nicht meldet, weil er nicht laeuft, faellt
      // sonst niemandem auf.
      logFail(AGENT, 'Pipeline guard failed');
      results.push(createResult('pipeline:guard', 'fail', { output: r.output.slice(-400) }));
    }
  }

  // 3. Fragment Lint (HTML Docs)
  if (runAll || hasJs) {
    logInfo(AGENT, 'Linting fragments...');
    const r = run('npm run lint:fragments 2>&1', { timeout: 30000 });
    if (r.ok) {
      logPass(AGENT, 'Fragment lint passed');
      results.push(createResult('lint:fragments', 'pass'));
    } else if (abgestuerzt(r.output)) {
      logFail(AGENT, 'Fragment lint konnte nicht laufen');
      results.push(createResult('lint:fragments', 'fail', { output: r.output.slice(-400) }));
    } else {
      logWarn(AGENT, 'Fragment lint issues');
      results.push(createResult('lint:fragments', 'warn', { output: r.output.slice(-200) }));
    }
  }

  // 4. Script Lint
  if (runAll || hasJs) {
    logInfo(AGENT, 'Linting scripts...');
    const r = run('npm run lint:docs-scripts 2>&1', { timeout: 30000 });
    if (r.ok) {
      logPass(AGENT, 'Script lint passed');
      results.push(createResult('lint:scripts', 'pass'));
    } else if (abgestuerzt(r.output)) {
      logFail(AGENT, 'Script lint konnte nicht laufen');
      results.push(createResult('lint:scripts', 'fail', { output: r.output.slice(-400) }));
    } else {
      logWarn(AGENT, 'Script lint issues');
      results.push(createResult('lint:scripts', 'warn', { output: r.output.slice(-200) }));
    }
  }

  // 5. Vue Component Tests (wenn Vue-Dateien geändert)
  if (hasVue) {
    logInfo(AGENT, 'Running Vue component tests...');
    const r = run('cd apps/theme-configurator && npm run test 2>&1', { timeout: 60000 });
    if (r.ok) {
      logPass(AGENT, 'Vue component tests passed');
      results.push(createResult('vue:test', 'pass'));
    } else {
      logWarn(AGENT, 'Vue tests failed or not configured');
      results.push(createResult('vue:test', 'warn', { output: r.output.slice(-200) }));
    }
  }

  const overallStatus = results.some(r => r.status === 'fail') ? 'fail' :
                        results.some(r => r.status === 'warn') ? 'warn' : 'pass';

  return { agent: AGENT, status: overallStatus, results, duration: Date.now() - startTime };
}
