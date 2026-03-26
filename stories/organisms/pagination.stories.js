// ============================================================
// Pagination — Auto-generated from pagination-recipe.json
// Version: 2.0.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Organisms/Pagination',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**Pagination** v2.0.0 (stable)

Root: <nav aria-label='Seitennavigation'> — landmark fuer Screen Reader.


`,
      },
    },
    status: { type: 'stable' },
  },
  argTypes: {},
};

export const Default = {
  render: () => `<div class="nc-pagination">
    <span class="nc-pagination__prev">prev</span>
    <span class="nc-pagination__list">list</span>
    <span class="nc-pagination__item">item</span>
    <span class="nc-pagination__next">next</span>
  </div>`,
};

export const AppearanceComparison = {
  name: 'Appearance Comparison',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-pagination">
    <span class="nc-pagination__prev">prev</span>
    <span class="nc-pagination__list">list</span>
    <span class="nc-pagination__item">item</span>
    <span class="nc-pagination__next">next</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Default vs Pill vs Outline vs Minimal' },
    },
  },
};

export const SizeComparison = {
  name: 'Size Comparison',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  
</div>`,
  parameters: {
    docs: {
      description: { story: 'MD (32px) vs SM (28px) mit Touch-Target' },
    },
  },
};

export const RaisedShadow = {
  name: 'Raised (Shadow)',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-pagination">
    <span class="nc-pagination__prev">prev</span>
    <span class="nc-pagination__list">list</span>
    <span class="nc-pagination__item">item</span>
    <span class="nc-pagination__next">next</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Aktive Seite mit Schatten — haptisches Feedback' },
    },
  },
};

export const WithActiveIndicator = {
  name: 'With Active Indicator',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-pagination">
    <span class="nc-pagination__prev">prev</span>
    <span class="nc-pagination__list">list</span>
    <span class="nc-pagination__item">item</span>
    <span class="nc-pagination__next">next</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Aktive Seite mit Unterlinie — verbesserte visuelle Erkennbarkeit' },
    },
  },
};

export const WithJumper = {
  name: 'With Jumper',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-pagination">
    <span class="nc-pagination__prev">prev</span>
    <span class="nc-pagination__list">list</span>
    <span class="nc-pagination__item">item</span>
    <span class="nc-pagination__next">next</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Go-to-Page Input fuer schnelle Navigation bei vielen Seiten' },
    },
  },
};

export const MinimalMobile = {
  name: 'Minimal (Mobile)',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-pagination">
    <span class="nc-pagination__prev">prev</span>
    <span class="nc-pagination__list">list</span>
    <span class="nc-pagination__item">item</span>
    <span class="nc-pagination__next">next</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Nur Prev + \'Seite X von Y\' + Next — ideal fuer Mobile und schmale Container' },
    },
  },
};

export const AlignmentVariants = {
  name: 'Alignment Variants',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-pagination">
    <span class="nc-pagination__prev">prev</span>
    <span class="nc-pagination__list">list</span>
    <span class="nc-pagination__item">item</span>
    <span class="nc-pagination__next">next</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Start, Center, End, Between' },
    },
  },
};
