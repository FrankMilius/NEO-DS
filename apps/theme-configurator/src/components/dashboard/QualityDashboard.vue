<template>
  <div class="quality-dashboard">
    <header class="qd-header">
      <div class="qd-header__title">
        <h2>Quality Dashboard</h2>
        <span class="qd-header__badge" :class="`qd-badge--${metrics?.overallStatus || 'loading'}`">
          {{ metrics?.overallScore ?? '...' }}/100
        </span>
      </div>
      <div class="qd-header__actions">
        <button class="qd-btn qd-btn--secondary" @click="refresh" :disabled="loading">
          {{ loading ? 'Calculating...' : 'Refresh' }}
        </button>
        <span class="qd-header__timestamp" v-if="metrics?.timestamp">
          {{ new Date(metrics.timestamp).toLocaleString('de-DE') }}
        </span>
      </div>
    </header>

    <div class="qd-grid" v-if="metrics">
      <!-- Row 1: Primary KPIs -->
      <div class="qd-card" :class="`qd-card--${metrics.testCoverage.status}`">
        <div class="qd-card__icon">{{ statusIcon(metrics.testCoverage.status) }}</div>
        <div class="qd-card__content">
          <div class="qd-card__value">{{ metrics.testCoverage.passed }}/{{ metrics.testCoverage.total }}</div>
          <div class="qd-card__label">Tests Passed</div>
        </div>
        <div class="qd-card__score">{{ metrics.testCoverage.score }}%</div>
      </div>

      <div class="qd-card" :class="`qd-card--${metrics.buildHealth.status}`">
        <div class="qd-card__icon">{{ statusIcon(metrics.buildHealth.status) }}</div>
        <div class="qd-card__content">
          <div class="qd-card__value">{{ metrics.buildHealth.cssSizeFormatted }}</div>
          <div class="qd-card__label">CSS Build</div>
        </div>
        <div class="qd-card__score">{{ metrics.buildHealth.score }}%</div>
      </div>

      <div class="qd-card" :class="`qd-card--${metrics.tokenSync.status}`">
        <div class="qd-card__icon">{{ statusIcon(metrics.tokenSync.status) }}</div>
        <div class="qd-card__content">
          <div class="qd-card__value">{{ metrics.tokenSync.inSync ? 'Sync' : `${metrics.tokenSync.drift} Drift` }}</div>
          <div class="qd-card__label">Token Sync</div>
        </div>
        <div class="qd-card__score">{{ metrics.tokenSync.score }}%</div>
      </div>

      <div class="qd-card" :class="`qd-card--${metrics.tokenCoverage.status}`">
        <div class="qd-card__icon">{{ statusIcon(metrics.tokenCoverage.status) }}</div>
        <div class="qd-card__content">
          <div class="qd-card__value">{{ metrics.tokenCoverage.violations }} Violations</div>
          <div class="qd-card__label">Token Coverage</div>
        </div>
        <div class="qd-card__score">{{ metrics.tokenCoverage.score }}%</div>
      </div>

      <!-- Row 2: Secondary KPIs -->
      <div class="qd-card" :class="`qd-card--${metrics.recipeCompleteness.status}`">
        <div class="qd-card__icon">{{ statusIcon(metrics.recipeCompleteness.status) }}</div>
        <div class="qd-card__content">
          <div class="qd-card__value">{{ metrics.recipeCompleteness.total }} Recipes</div>
          <div class="qd-card__label">Recipe Completeness</div>
        </div>
        <div class="qd-card__score">{{ metrics.recipeCompleteness.score }}%</div>
      </div>

      <div class="qd-card" :class="`qd-card--${metrics.docsCoverage.status}`">
        <div class="qd-card__icon">{{ statusIcon(metrics.docsCoverage.status) }}</div>
        <div class="qd-card__content">
          <div class="qd-card__value">{{ metrics.docsCoverage.withStory }}/{{ metrics.docsCoverage.totalRecipes }}</div>
          <div class="qd-card__label">Storybook Stories</div>
        </div>
        <div class="qd-card__score">{{ metrics.docsCoverage.score }}%</div>
      </div>

      <div class="qd-card" :class="`qd-card--${metrics.componentMaturity.status}`">
        <div class="qd-card__icon">{{ statusIcon(metrics.componentMaturity.status) }}</div>
        <div class="qd-card__content">
          <div class="qd-card__value">{{ metrics.componentMaturity.stable }} Stable</div>
          <div class="qd-card__label">Component Maturity</div>
          <div class="qd-card__detail">
            {{ metrics.componentMaturity.beta }} beta, {{ metrics.componentMaturity.alpha }} alpha
          </div>
        </div>
        <div class="qd-card__score">{{ metrics.componentMaturity.score }}%</div>
      </div>

      <div class="qd-card" :class="`qd-card--${metrics.pipelineSync.status}`">
        <div class="qd-card__icon">{{ statusIcon(metrics.pipelineSync.status) }}</div>
        <div class="qd-card__content">
          <div class="qd-card__value">Pipeline</div>
          <div class="qd-card__label">Drupal Sync</div>
        </div>
        <div class="qd-card__score">{{ metrics.pipelineSync.score }}%</div>
      </div>
    </div>

    <!-- Bundle Size + Evaluations -->
    <div class="qd-row" v-if="metrics">
      <div class="qd-info-card">
        <div class="qd-info-card__label">Bundle Size</div>
        <div class="qd-info-card__value">
          {{ metrics.bundleSizeTrend.current }}KB
          <span class="qd-trend" :class="`qd-trend--${metrics.bundleSizeTrend.trend}`">
            {{ metrics.bundleSizeTrend.trend === 'growing' ? '↑' : metrics.bundleSizeTrend.trend === 'shrinking' ? '↓' : '→' }}
            {{ metrics.bundleSizeTrend.delta !== 0 ? `${metrics.bundleSizeTrend.delta > 0 ? '+' : ''}${metrics.bundleSizeTrend.delta}KB` : 'stable' }}
          </span>
        </div>
      </div>
      <div class="qd-info-card">
        <div class="qd-info-card__label">Component Evaluations</div>
        <div class="qd-info-card__value">
          {{ metrics.evaluations.total }} completed
          <span class="qd-info-card__detail" v-if="metrics.evaluations.components.length">
            ({{ metrics.evaluations.components.join(', ') }})
          </span>
        </div>
      </div>
      <div class="qd-info-card">
        <div class="qd-info-card__label">Calculation Time</div>
        <div class="qd-info-card__value">{{ metrics.duration }}</div>
      </div>
    </div>

    <!-- Loading State -->
    <div class="qd-loading" v-if="loading && !metrics">
      Calculating metrics...
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const metrics = ref(null);
const loading = ref(false);

async function loadMetrics() {
  try {
    const res = await fetch('/api/dashboard-metrics');
    if (res.ok) {
      metrics.value = await res.json();
    }
  } catch {
    // Fallback: statische Datei laden
    try {
      const res = await fetch('/data/dashboard/metrics.json');
      if (res.ok) metrics.value = await res.json();
    } catch { /* ignore */ }
  }
}

async function refresh() {
  loading.value = true;
  // In dev: Rufe die CLI auf (über den docs-server Proxy)
  try {
    const res = await fetch('/api/dashboard-refresh', { method: 'POST' });
    if (res.ok) {
      metrics.value = await res.json();
    } else {
      await loadMetrics();
    }
  } catch {
    await loadMetrics();
  }
  loading.value = false;
}

function statusIcon(status) {
  return status === 'pass' ? '✅' : status === 'warn' ? '⚠️' : '❌';
}

onMounted(loadMetrics);
</script>

<style scoped>
.quality-dashboard {
  padding: var(--fnd-spacing-06);
  max-width: 1200px;
}

.qd-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--fnd-spacing-06);
  flex-wrap: wrap;
  gap: var(--fnd-spacing-04);
}

.qd-header__title {
  display: flex;
  align-items: center;
  gap: var(--fnd-spacing-03);
}

.qd-header__title h2 {
  font-size: var(--fs-xl);
  font-weight: var(--fnd-font-weight-bold);
  margin: 0;
}

.qd-header__badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: var(--fs-sm);
  font-weight: var(--fnd-font-weight-semibold);
}

.qd-badge--excellent { background: #d4edda; color: #155724; }
.qd-badge--good { background: #d1ecf1; color: #0c5460; }
.qd-badge--acceptable { background: #fff3cd; color: #856404; }
.qd-badge--needs-work { background: #f8d7da; color: #721c24; }
.qd-badge--loading { background: #e2e3e5; color: #383d41; }

.qd-header__actions {
  display: flex;
  align-items: center;
  gap: var(--fnd-spacing-03);
}

.qd-header__timestamp {
  font-size: var(--fs-xs);
  color: var(--fnd-color-text-tertiary);
}

.qd-btn {
  padding: 6px 16px;
  border-radius: 6px;
  font-size: var(--fs-sm);
  cursor: pointer;
  border: 1px solid var(--fnd-color-border-primary);
  background: var(--fnd-color-background-base);
}

.qd-btn:hover { background: var(--fnd-color-background-secondary); }
.qd-btn:disabled { opacity: 0.5; cursor: not-allowed; }

.qd-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--fnd-spacing-04);
  margin-bottom: var(--fnd-spacing-06);
}

@media (max-width: 960px) {
  .qd-grid { grid-template-columns: repeat(2, 1fr); }
}

.qd-card {
  display: flex;
  align-items: center;
  gap: var(--fnd-spacing-03);
  padding: var(--fnd-spacing-04);
  border-radius: 8px;
  background: var(--fnd-color-background-base);
  border: 1px solid var(--fnd-color-border-secondary);
}

.qd-card--pass { border-left: 3px solid #28a745; }
.qd-card--warn { border-left: 3px solid #ffc107; }
.qd-card--fail { border-left: 3px solid #dc3545; }

.qd-card__icon { font-size: 1.2rem; flex-shrink: 0; }
.qd-card__content { flex: 1; min-width: 0; }
.qd-card__value { font-weight: var(--fnd-font-weight-semibold); font-size: var(--fs-base); }
.qd-card__label { font-size: var(--fs-xs); color: var(--fnd-color-text-tertiary); }
.qd-card__detail { font-size: var(--fs-2xs); color: var(--fnd-color-text-tertiary); }
.qd-card__score { font-size: var(--fs-lg); font-weight: var(--fnd-font-weight-bold); color: var(--fnd-color-text-secondary); flex-shrink: 0; }

.qd-row {
  display: flex;
  gap: var(--fnd-spacing-04);
  flex-wrap: wrap;
}

.qd-info-card {
  flex: 1;
  min-width: 200px;
  padding: var(--fnd-spacing-04);
  border-radius: 8px;
  background: var(--fnd-color-background-secondary);
}

.qd-info-card__label { font-size: var(--fs-xs); color: var(--fnd-color-text-tertiary); margin-bottom: 4px; }
.qd-info-card__value { font-weight: var(--fnd-font-weight-semibold); }
.qd-info-card__detail { font-size: var(--fs-xs); color: var(--fnd-color-text-tertiary); }

.qd-trend--growing { color: #dc3545; }
.qd-trend--shrinking { color: #28a745; }
.qd-trend--stable { color: var(--fnd-color-text-tertiary); }

.qd-loading {
  text-align: center;
  padding: var(--fnd-spacing-10);
  color: var(--fnd-color-text-tertiary);
}
</style>
