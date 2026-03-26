/**
 * Builder Agent
 *
 * Verantwortlich für: CSS Build, Token Generation, Token Sync, Token Lint
 * Stellt sicher dass der Build-Output aktuell und fehlerfrei ist.
 */

import { ROOT, log, logPass, logFail, logWarn, logInfo, run, createResult } from './shared.mjs';

const AGENT = 'Builder';

export async function builderAgent(changedFiles = []) {
  logInfo(AGENT, 'Starting build pipeline...');
  const results = [];
  const startTime = Date.now();

  // Bestimme was gebaut werden muss
  const hasScss = changedFiles.some(f => f.endsWith('.scss'));
  const hasTokens = changedFiles.some(f => f.includes('design-tokens') || f.includes('component-tokens'));
  const hasRecipes = changedFiles.some(f => f.endsWith('-recipe.json'));
  const buildAll = changedFiles.length === 0; // Kein Filter = alles bauen

  // 1. Token Generation (wenn Token-Quellen geändert)
  if (buildAll || hasTokens) {
    logInfo(AGENT, 'Generating tokens...');
    const r = run('npm run tokens 2>&1', { timeout: 30000 });
    if (r.ok) {
      logPass(AGENT, 'Token generation successful');
      results.push(createResult('tokens:generate', 'pass'));
    } else {
      // Token generation failure ist non-blocking (SCSS kann trotzdem kompilieren)
      logWarn(AGENT, 'Token generation failed (non-blocking)');
      results.push(createResult('tokens:generate', 'warn', { error: r.output.slice(-200) }));
    }
  }

  // 2. CSS Build
  if (buildAll || hasScss || hasTokens) {
    logInfo(AGENT, 'Building CSS...');
    const r = run('npm run build:css 2>&1', { timeout: 30000 });
    if (r.ok) {
      const sizeMatch = run('wc -c < styles.css', { silent: true });
      const sizeKB = sizeMatch.ok ? Math.round(parseInt(sizeMatch.output) / 1024) : '?';
      logPass(AGENT, `CSS build successful (${sizeKB}KB)`);
      results.push(createResult('build:css', 'pass', { sizeKB }));
    } else {
      logFail(AGENT, 'CSS build FAILED');
      results.push(createResult('build:css', 'fail', { error: r.output.slice(-300) }));
      return { agent: AGENT, status: 'fail', results, duration: Date.now() - startTime };
    }
  }

  // 3. Token Sync Check
  if (buildAll || hasScss || hasTokens) {
    logInfo(AGENT, 'Checking token sync...');
    const r = run('npm run tokens:sync:check 2>&1', { timeout: 30000 });
    if (r.ok) {
      logPass(AGENT, 'Tokens in sync');
      results.push(createResult('tokens:sync', 'pass'));
    } else {
      logWarn(AGENT, 'Token drift detected');
      results.push(createResult('tokens:sync', 'warn', { output: r.output.slice(-200) }));
    }
  }

  // 4. Token Lint
  if (buildAll || hasScss) {
    logInfo(AGENT, 'Linting tokens...');
    const r = run('npm run lint:tokens 2>&1', { timeout: 30000 });
    if (r.ok) {
      logPass(AGENT, 'No hardcoded values found');
      results.push(createResult('lint:tokens', 'pass'));
    } else {
      logWarn(AGENT, 'Hardcoded values detected');
      results.push(createResult('lint:tokens', 'warn', { output: r.output.slice(-200) }));
    }
  }

  // 5. Recipe Lint
  if (buildAll || hasRecipes) {
    logInfo(AGENT, 'Linting recipes...');
    const r = run('npm run lint:recipes 2>&1', { timeout: 30000 });
    if (r.ok) {
      logPass(AGENT, 'All recipes valid');
      results.push(createResult('lint:recipes', 'pass'));
    } else {
      logWarn(AGENT, 'Recipe lint issues');
      results.push(createResult('lint:recipes', 'warn', { output: r.output.slice(-200) }));
    }
  }

  const overallStatus = results.some(r => r.status === 'fail') ? 'fail' :
                        results.some(r => r.status === 'warn') ? 'warn' : 'pass';

  return { agent: AGENT, status: overallStatus, results, duration: Date.now() - startTime };
}
