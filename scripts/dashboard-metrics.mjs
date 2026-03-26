/**
 * Quality Dashboard — KPI Metrics Calculator
 *
 * Berechnet alle Design-System-KPIs und speichert sie als JSON.
 * Wird von der Dashboard-UI und dem /dashboard Skill konsumiert.
 *
 * Usage:
 *   node scripts/dashboard-metrics.mjs              # Berechne + speichere
 *   node scripts/dashboard-metrics.mjs --snapshot    # + History-Snapshot
 *   node scripts/dashboard-metrics.mjs --json        # Nur JSON ausgeben (stdout)
 */

import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const DATA_DIR = resolve(ROOT, 'data');
const DASHBOARD_DIR = resolve(DATA_DIR, 'dashboard');
const HISTORY_DIR = resolve(DASHBOARD_DIR, 'history');
const METRICS_PATH = resolve(DASHBOARD_DIR, 'metrics.json');

const args = process.argv.slice(2);
const jsonOnly = args.includes('--json');
const snapshot = args.includes('--snapshot');

function log(msg) { if (!jsonOnly) console.log(msg); }

// ─── 1. Token Coverage ──────────────────────────────────────────────

function calcTokenCoverage() {
  log('  📊 Token Coverage...');
  try {
    const result = execSync('npm run lint:tokens 2>&1', { cwd: ROOT, encoding: 'utf-8', timeout: 30000 });
    const violations = (result.match(/hardcoded/gi) || []).length;
    const lines = result.split('\n').filter(l => l.includes('❌') || l.includes('⚠'));
    return {
      score: violations === 0 ? 100 : Math.max(0, 100 - violations * 2),
      violations,
      details: lines.slice(0, 10),
      status: violations === 0 ? 'pass' : violations <= 5 ? 'warn' : 'fail',
    };
  } catch (e) {
    const output = e.stdout || e.message || '';
    const violationLines = output.split('\n').filter(l => l.includes('❌') || l.includes('⚠') || l.includes('hardcoded'));
    return {
      score: Math.max(0, 100 - violationLines.length * 2),
      violations: violationLines.length,
      details: violationLines.slice(0, 10),
      status: violationLines.length === 0 ? 'pass' : 'warn',
    };
  }
}

// ─── 2. Recipe Completeness ─────────────────────────────────────────

function calcRecipeCompleteness() {
  log('  📊 Recipe Completeness...');
  const files = readdirSync(DATA_DIR).filter(f => f.endsWith('-recipe.json'));
  const requiredFields = ['anatomy', 'axes', 'specimens', 'styling'];
  const recommendedFields = ['a11y', 'states', 'constraints'];
  let totalRequired = 0, presentRequired = 0;
  let totalRecommended = 0, presentRecommended = 0;
  const incomplete = [];

  for (const f of files) {
    try {
      const data = JSON.parse(readFileSync(resolve(DATA_DIR, f), 'utf-8'));
      for (const field of requiredFields) {
        totalRequired++;
        if (data[field]) presentRequired++;
        else incomplete.push(`${f}: missing ${field}`);
      }
      for (const field of recommendedFields) {
        totalRecommended++;
        if (data[field]) presentRecommended++;
      }
    } catch { /* skip invalid */ }
  }

  const requiredScore = totalRequired > 0 ? Math.round((presentRequired / totalRequired) * 100) : 0;
  const recommendedScore = totalRecommended > 0 ? Math.round((presentRecommended / totalRecommended) * 100) : 0;

  return {
    total: files.length,
    requiredScore,
    recommendedScore,
    score: Math.round((requiredScore * 0.7 + recommendedScore * 0.3)),
    incomplete: incomplete.slice(0, 10),
    status: requiredScore >= 90 ? 'pass' : requiredScore >= 70 ? 'warn' : 'fail',
  };
}

// ─── 3. Test Coverage ───────────────────────────────────────────────

function calcTestCoverage() {
  log('  📊 Test Coverage...');
  try {
    const result = execSync('npx vitest run 2>&1', { cwd: ROOT, encoding: 'utf-8', timeout: 120000 });
    const passMatch = result.match(/(\d+) passed/);
    const failMatch = result.match(/(\d+) failed/);
    const passed = passMatch ? parseInt(passMatch[1]) : 0;
    const failed = failMatch ? parseInt(failMatch[1]) : 0;
    const total = passed + failed;

    return {
      passed,
      failed,
      total,
      score: total > 0 ? Math.round((passed / total) * 100) : 0,
      status: failed === 0 ? 'pass' : 'fail',
    };
  } catch (e) {
    const output = e.stdout || '';
    const passMatch = output.match(/(\d+) passed/);
    const failMatch = output.match(/(\d+) failed/);
    return {
      passed: passMatch ? parseInt(passMatch[1]) : 0,
      failed: failMatch ? parseInt(failMatch[1]) : 0,
      total: 0,
      score: 0,
      status: 'fail',
    };
  }
}

// ─── 4. Build Health ────────────────────────────────────────────────

function calcBuildHealth() {
  log('  📊 Build Health...');
  try {
    execSync('npm run build:css 2>&1', { cwd: ROOT, encoding: 'utf-8', timeout: 30000 });
    const cssPath = resolve(ROOT, 'styles.css');
    const stats = statSync(cssPath);
    const sizeKB = Math.round(stats.size / 1024);

    return {
      cssSize: sizeKB,
      cssSizeFormatted: `${sizeKB}KB`,
      buildSuccess: true,
      score: 100,
      status: 'pass',
    };
  } catch (e) {
    return {
      cssSize: 0,
      cssSizeFormatted: '0KB',
      buildSuccess: false,
      error: (e.message || '').slice(0, 200),
      score: 0,
      status: 'fail',
    };
  }
}

// ─── 5. Documentation Coverage ──────────────────────────────────────

function calcDocsCoverage() {
  log('  📊 Documentation Coverage...');
  const recipes = readdirSync(DATA_DIR).filter(f => f.endsWith('-recipe.json'));
  const storiesDir = resolve(ROOT, 'stories');

  let withStory = 0;
  if (existsSync(storiesDir)) {
    const allStories = [];
    for (const layer of ['atoms', 'molecules', 'organisms']) {
      const dir = resolve(storiesDir, layer);
      if (existsSync(dir)) {
        allStories.push(...readdirSync(dir).filter(f => f.endsWith('.stories.js')));
      }
    }

    for (const recipe of recipes) {
      const componentName = recipe.replace('-recipe.json', '');
      if (allStories.some(s => s.includes(componentName))) withStory++;
    }
  }

  const score = recipes.length > 0 ? Math.round((withStory / recipes.length) * 100) : 0;

  return {
    totalRecipes: recipes.length,
    withStory,
    withoutStory: recipes.length - withStory,
    score,
    status: score >= 90 ? 'pass' : score >= 70 ? 'warn' : 'fail',
  };
}

// ─── 6. Component Maturity ──────────────────────────────────────────

function calcComponentMaturity() {
  log('  📊 Component Maturity...');
  const recipes = readdirSync(DATA_DIR).filter(f => f.endsWith('-recipe.json'));
  const maturity = { stable: 0, beta: 0, alpha: 0, unknown: 0 };

  for (const f of recipes) {
    try {
      const data = JSON.parse(readFileSync(resolve(DATA_DIR, f), 'utf-8'));
      const status = data.meta?.status || 'unknown';
      maturity[status] = (maturity[status] || 0) + 1;
    } catch { maturity.unknown++; }
  }

  const total = recipes.length;
  const stablePercent = total > 0 ? Math.round((maturity.stable / total) * 100) : 0;

  return {
    ...maturity,
    total,
    score: stablePercent,
    status: stablePercent >= 80 ? 'pass' : stablePercent >= 50 ? 'warn' : 'fail',
  };
}

// ─── 7. Token Sync ──────────────────────────────────────────────────

function calcTokenSync() {
  log('  📊 Token Sync...');
  try {
    execSync('npm run tokens:sync:check 2>&1', { cwd: ROOT, encoding: 'utf-8', timeout: 30000 });
    return { inSync: true, drift: 0, score: 100, status: 'pass' };
  } catch (e) {
    const output = e.stdout || e.message || '';
    const driftMatch = output.match(/(\d+)\s*(missing|drift|fehlt)/i);
    const drift = driftMatch ? parseInt(driftMatch[1]) : 1;
    return { inSync: false, drift, score: Math.max(0, 100 - drift * 5), status: 'fail' };
  }
}

// ─── 8. Bundle Size Trend ───────────────────────────────────────────

function calcBundleSizeTrend() {
  log('  📊 Bundle Size Trend...');
  const cssPath = resolve(ROOT, 'styles.css');
  const currentSize = existsSync(cssPath) ? Math.round(statSync(cssPath).size / 1024) : 0;

  // Lade vorheriges Metrics-File für Trend
  let previousSize = null;
  if (existsSync(METRICS_PATH)) {
    try {
      const prev = JSON.parse(readFileSync(METRICS_PATH, 'utf-8'));
      previousSize = prev.buildHealth?.cssSize || null;
    } catch { /* ignore */ }
  }

  const delta = previousSize !== null ? currentSize - previousSize : 0;
  const deltaPercent = previousSize ? Math.round((delta / previousSize) * 100) : 0;

  return {
    current: currentSize,
    previous: previousSize,
    delta,
    deltaPercent,
    trend: delta > 10 ? 'growing' : delta < -10 ? 'shrinking' : 'stable',
    status: Math.abs(deltaPercent) <= 5 ? 'pass' : 'warn',
  };
}

// ─── 9. Pipeline Sync (Drupal) ──────────────────────────────────────

function calcPipelineSync() {
  log('  📊 Pipeline Sync...');
  try {
    const result = execSync('npm run pipeline:check 2>&1', { cwd: ROOT, encoding: 'utf-8', timeout: 30000 });
    const issues = (result.match(/❌|FAIL|ERROR/gi) || []).length;
    return { score: issues === 0 ? 100 : Math.max(0, 100 - issues * 10), issues, status: issues === 0 ? 'pass' : 'fail' };
  } catch (e) {
    return { score: 50, issues: -1, status: 'warn', error: 'Pipeline check failed' };
  }
}

// ─── 10. Evaluations Count ──────────────────────────────────────────

function calcEvaluations() {
  const evalsDir = resolve(DATA_DIR, 'evaluations');
  if (!existsSync(evalsDir)) return { total: 0, components: [] };
  const files = readdirSync(evalsDir).filter(f => f.endsWith('.md'));
  const components = files.map(f => f.replace(/-evaluation-.*\.md$/, ''));
  return { total: files.length, components: [...new Set(components)] };
}

// ─── Main ────────────────────────────────────────────────────────────

log('╔══════════════════════════════════════╗');
log('║     QUALITY DASHBOARD METRICS        ║');
log('╚══════════════════════════════════════╝\n');

const startTime = Date.now();

const metrics = {
  timestamp: new Date().toISOString(),
  date: new Date().toISOString().split('T')[0],
  tokenCoverage: calcTokenCoverage(),
  recipeCompleteness: calcRecipeCompleteness(),
  testCoverage: calcTestCoverage(),
  buildHealth: calcBuildHealth(),
  docsCoverage: calcDocsCoverage(),
  componentMaturity: calcComponentMaturity(),
  tokenSync: calcTokenSync(),
  bundleSizeTrend: calcBundleSizeTrend(),
  pipelineSync: calcPipelineSync(),
  evaluations: calcEvaluations(),
};

// Overall Score (gewichtet)
const weights = {
  testCoverage: 0.20,
  buildHealth: 0.15,
  tokenSync: 0.15,
  tokenCoverage: 0.15,
  recipeCompleteness: 0.10,
  docsCoverage: 0.10,
  componentMaturity: 0.10,
  pipelineSync: 0.05,
};

metrics.overallScore = Math.round(
  Object.entries(weights).reduce((sum, [key, weight]) => {
    return sum + (metrics[key]?.score || 0) * weight;
  }, 0)
);

metrics.overallStatus =
  metrics.overallScore >= 90 ? 'excellent' :
  metrics.overallScore >= 75 ? 'good' :
  metrics.overallScore >= 60 ? 'acceptable' : 'needs-work';

metrics.duration = `${((Date.now() - startTime) / 1000).toFixed(1)}s`;

// Speichern
writeFileSync(METRICS_PATH, JSON.stringify(metrics, null, 2));

// History Snapshot
if (snapshot) {
  const snapshotPath = resolve(HISTORY_DIR, `${metrics.date}.json`);
  writeFileSync(snapshotPath, JSON.stringify(metrics, null, 2));
  log(`\n💾 Snapshot: data/dashboard/history/${metrics.date}.json`);
}

// Output
if (jsonOnly) {
  console.log(JSON.stringify(metrics));
} else {
  const icon = (status) => status === 'pass' ? '✅' : status === 'warn' ? '⚠️' : '❌';

  log(`\n${'─'.repeat(50)}`);
  log(`  Overall Score: ${metrics.overallScore}/100 (${metrics.overallStatus})`);
  log(`${'─'.repeat(50)}`);
  log(`  ${icon(metrics.testCoverage.status)} Test Coverage:      ${metrics.testCoverage.passed}/${metrics.testCoverage.total} passed (${metrics.testCoverage.score}%)`);
  log(`  ${icon(metrics.buildHealth.status)} Build Health:       ${metrics.buildHealth.cssSizeFormatted} CSS`);
  log(`  ${icon(metrics.tokenSync.status)} Token Sync:         ${metrics.tokenSync.inSync ? 'In sync' : `${metrics.tokenSync.drift} drift`}`);
  log(`  ${icon(metrics.tokenCoverage.status)} Token Coverage:     ${metrics.tokenCoverage.score}% (${metrics.tokenCoverage.violations} violations)`);
  log(`  ${icon(metrics.recipeCompleteness.status)} Recipe Completeness: ${metrics.recipeCompleteness.score}% (${metrics.recipeCompleteness.total} recipes)`);
  log(`  ${icon(metrics.docsCoverage.status)} Docs Coverage:      ${metrics.docsCoverage.withStory}/${metrics.docsCoverage.totalRecipes} with stories (${metrics.docsCoverage.score}%)`);
  log(`  ${icon(metrics.componentMaturity.status)} Component Maturity: ${metrics.componentMaturity.stable} stable, ${metrics.componentMaturity.beta} beta, ${metrics.componentMaturity.alpha} alpha`);
  log(`  ${icon(metrics.pipelineSync.status)} Pipeline Sync:      ${metrics.pipelineSync.score}%`);
  log(`  📦 Bundle Size:        ${metrics.bundleSizeTrend.current}KB (${metrics.bundleSizeTrend.trend}${metrics.bundleSizeTrend.delta !== 0 ? `, ${metrics.bundleSizeTrend.delta > 0 ? '+' : ''}${metrics.bundleSizeTrend.delta}KB` : ''})`);
  log(`  📝 Evaluations:        ${metrics.evaluations.total} (${metrics.evaluations.components.join(', ') || 'none'})`);
  log(`${'─'.repeat(50)}`);
  log(`  ⏱️  Duration: ${metrics.duration}`);
  log(`  💾 Saved: data/dashboard/metrics.json\n`);
}
