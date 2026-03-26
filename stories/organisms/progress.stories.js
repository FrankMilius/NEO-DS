// ============================================================
// Progress — Auto-generated from progress-recipe.json
// Version: 1.0.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Organisms/Progress',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**Progress** v1.0.0 (stable)

Progress ist ein <div class='nc-progress' role='progressbar' aria-valuenow='X' aria-valuemin='0' aria-valuemax='100'>.


`,
      },
    },
    status: { type: 'stable' },
  },
  argTypes: {},
};

export const Default = {
  render: () => `<div class="nc-progress">
    <span class="nc-progress__fill">fill</span>
  </div>`,
};

export const SizeScaleXSSMMDLG = {
  name: 'Size Scale — XS / SM / MD / LG',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  
</div>`,
  parameters: {
    docs: {
      description: { story: 'Alle 4 Hoehen im Vergleich bei 60% Fortschritt' },
    },
  },
};

export const FeedbackColorVariants = {
  name: 'Feedback Color Variants',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-progress">
    <span class="nc-progress__fill">fill</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Alle 5 Farbvarianten in SM-Groesse' },
    },
  },
};

export const DeterminatevsIndeterminate = {
  name: 'Determinate vs Indeterminate',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-progress">
    <span class="nc-progress__fill">fill</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Fester Fortschritt vs endlose Animation' },
    },
  },
};

export const WithLabelValue = {
  name: 'With Label + Value',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-progress">
    <span class="nc-progress__fill">fill</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Progress im Labeled-Wrapper mit Titel und Prozentwert' },
    },
  },
};

export const FeedbackColorsSizes = {
  name: 'Feedback Colors × Sizes',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-progress">
    <span class="nc-progress__fill">fill</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Farbvarianten in MD-Groesse fuer bessere Sichtbarkeit' },
    },
  },
};

export const ReducedMotion = {
  name: 'Reduced Motion',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-progress">
    <span class="nc-progress__fill">fill</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Verhalten bei prefers-reduced-motion (Indeterminate + Determinate)' },
    },
  },
};
