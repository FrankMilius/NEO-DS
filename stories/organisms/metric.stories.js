// ============================================================
// Metric — Auto-generated from metric-recipe.json
// Version: 2.0.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Organisms/Metric',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**Metric** v2.0.0 (stable)

Container: Flex-Column mit gap. Solid: inverse BG + inverse Text. Subtle: helle BG + primaere Farben.


`,
      },
    },
    status: { type: 'stable' },
  },
  argTypes: {},
};

export const Default = {
  render: () => `<div class="nc-metric">
    <span class="nc-metric__value-row">value-row</span>
    <span class="nc-metric__value">value</span>
  </div>`,
};

export const DefaultSolid = {
  name: 'Default (Solid)',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-metric">
    <span class="nc-metric__value-row">value-row</span>
    <span class="nc-metric__value">value</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Kennzahl mit Label, Value, Trend und Footer auf inversem Hintergrund' },
    },
  },
};

export const SolidvsSubtle = {
  name: 'Solid vs Subtle',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  
</div>`,
  parameters: {
    docs: {
      description: { story: 'Vergleich: inverse (solid) vs helle (subtle) Variante' },
    },
  },
};

export const SizeComparison = {
  name: 'Size Comparison',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-metric">
    <span class="nc-metric__value-row">value-row</span>
    <span class="nc-metric__value">value</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'MD (kompakt) vs LG (Standard) vs XL (Hero)' },
    },
  },
};

export const TrendVariants = {
  name: 'Trend Variants',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-metric">
    <span class="nc-metric__value-row">value-row</span>
    <span class="nc-metric__value">value</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Up (Success), Down (Danger), Neutral — Richtungsindikatoren' },
    },
  },
};

export const SubtleTrends = {
  name: 'Subtle + Trends',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-metric">
    <span class="nc-metric__value-row">value-row</span>
    <span class="nc-metric__value">value</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Helle Variante mit verschiedenen Trend-Richtungen' },
    },
  },
};

export const DashboardGrid = {
  name: 'Dashboard Grid',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-metric">
    <span class="nc-metric__value-row">value-row</span>
    <span class="nc-metric__value">value</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: '4 Metriken nebeneinander — typisches Dashboard-Layout' },
    },
  },
};

export const HeroMetric = {
  name: 'Hero Metric',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-metric">
    <span class="nc-metric__value-row">value-row</span>
    <span class="nc-metric__value">value</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'XL Hero-Kennzahl fuer Marketing-Sektionen' },
    },
  },
};

export const ValueOnly = {
  name: 'Value Only',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-metric">
    <span class="nc-metric__value-row">value-row</span>
    <span class="nc-metric__value">value</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Minimale Variante: nur Wert ohne Label/Trend/Footer' },
    },
  },
};
