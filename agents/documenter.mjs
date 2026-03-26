/**
 * Documenter Agent
 *
 * Verantwortlich für: Storybook Story-Generierung, Dashboard-Metriken,
 * Changelog-Erstellung, Docs-Token-Lint
 */

import { ROOT, log, logPass, logFail, logWarn, logInfo, run, createResult, readJSON, writeJSON, fileExists } from './shared.mjs';

const AGENT = 'Documenter';

export async function documenterAgent(changedFiles = []) {
  logInfo(AGENT, 'Starting documentation pipeline...');
  const results = [];
  const startTime = Date.now();

  const hasRecipes = changedFiles.some(f => f.endsWith('-recipe.json'));
  const hasScss = changedFiles.some(f => f.endsWith('.scss'));
  const runAll = changedFiles.length === 0;

  // 1. Stories regenerieren (wenn Recipes geändert)
  if (runAll || hasRecipes) {
    logInfo(AGENT, 'Regenerating Storybook stories...');
    const r = run('npm run generate:stories 2>&1', { timeout: 30000 });
    if (r.ok) {
      const countMatch = r.output.match(/(\d+) stories generated/);
      const count = countMatch ? countMatch[1] : '?';
      logPass(AGENT, `${count} stories generated`);
      results.push(createResult('stories:generate', 'pass', { count: parseInt(count) || 0 }));
    } else {
      logFail(AGENT, 'Story generation failed');
      results.push(createResult('stories:generate', 'fail', { error: r.output.slice(-200) }));
    }
  }

  // 2. Docs Token Lint
  if (runAll || hasScss) {
    logInfo(AGENT, 'Linting docs tokens...');
    const r = run('npm run lint:docs-tokens 2>&1', { timeout: 30000 });
    if (r.ok) {
      logPass(AGENT, 'Docs token lint passed');
      results.push(createResult('lint:docs-tokens', 'pass'));
    } else {
      logWarn(AGENT, 'Docs token lint issues');
      results.push(createResult('lint:docs-tokens', 'warn', { output: r.output.slice(-200) }));
    }
  }

  // 3. Dashboard Metriken aktualisieren
  if (runAll) {
    logInfo(AGENT, 'Updating dashboard metrics...');
    const r = run('npm run dashboard:snapshot 2>&1', { timeout: 180000 });
    if (r.ok) {
      const scoreMatch = r.output.match(/Overall Score: (\d+)/);
      const score = scoreMatch ? scoreMatch[1] : '?';
      logPass(AGENT, `Dashboard updated (Score: ${score}/100)`);
      results.push(createResult('dashboard', 'pass', { score: parseInt(score) || 0 }));
    } else {
      logWarn(AGENT, 'Dashboard update failed');
      results.push(createResult('dashboard', 'warn', { output: r.output.slice(-200) }));
    }
  }

  // 4. Changelog-Eintrag vorbereiten (basierend auf Changed Files)
  if (changedFiles.length > 0) {
    const changelogEntry = generateChangelogEntry(changedFiles);
    if (changelogEntry) {
      logInfo(AGENT, `Changelog: ${changelogEntry.type} — ${changelogEntry.summary}`);
      results.push(createResult('changelog', 'pass', { entry: changelogEntry }));
    }
  }

  const overallStatus = results.some(r => r.status === 'fail') ? 'fail' :
                        results.some(r => r.status === 'warn') ? 'warn' : 'pass';

  return { agent: AGENT, status: overallStatus, results, duration: Date.now() - startTime };
}

function generateChangelogEntry(changedFiles) {
  const scssFiles = changedFiles.filter(f => f.endsWith('.scss'));
  const recipeFiles = changedFiles.filter(f => f.endsWith('-recipe.json'));
  const tokenFiles = changedFiles.filter(f => f.includes('component-tokens') || f.includes('design-tokens'));

  let type = 'chore';
  let summary = '';

  if (recipeFiles.length > 0) {
    const components = recipeFiles.map(f => f.replace('data/', '').replace('-recipe.json', ''));
    type = 'feat';
    summary = `Recipe update: ${components.join(', ')}`;
  } else if (tokenFiles.length > 0) {
    type = 'feat';
    summary = 'Token system update';
  } else if (scssFiles.length > 0) {
    const components = scssFiles.map(f => f.split('/').pop().replace('.scss', '').replace('_', ''));
    type = 'style';
    summary = `SCSS update: ${components.slice(0, 3).join(', ')}${components.length > 3 ? ` +${components.length - 3}` : ''}`;
  }

  return summary ? { type, summary, files: changedFiles.length, date: new Date().toISOString().split('T')[0] } : null;
}
