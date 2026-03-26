// ============================================================
// Spinner — Auto-generated from spinner-recipe.json
// Version: 1.0.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Atoms/Spinner',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**Spinner** v1.0.0 (stable)

Spinner ist ein <div class='nc-spinner' role='status'> mit ::after Pseudo-Element fuer den rotierenden Ring.


`,
      },
    },
    status: { type: 'stable' },
  },
  argTypes: {},
};

export const Default = {
  render: () => `<div class="nc-spinner">
    spinner
  </div>`,
};

export const SizeScaleXSSMMDLGXL = {
  name: 'Size Scale — XS / SM / MD / LG / XL',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  
</div>`,
  parameters: {
    docs: {
      description: { story: 'Alle 5 Groessen im Vergleich' },
    },
  },
};

export const ColorVariants = {
  name: 'Color Variants',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-spinner">
    spinner
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Alle Farb-Varianten in MD-Groesse' },
    },
  },
};

export const InverseonDarkBackground = {
  name: 'Inverse on Dark Background',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-spinner">
    spinner
  </div>
  <div class="nc-spinner">
    spinner
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Inverse-Variante auf dunklem Hintergrund' },
    },
  },
};

export const SpinnerinButton = {
  name: 'Spinner in Button',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-spinner">
    spinner
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Spinner als Lade-Indikator innerhalb eines Buttons' },
    },
  },
};

export const SpinnerOverlay = {
  name: 'Spinner Overlay',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-spinner">
    spinner
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Spinner zentriert ueber einem Container mit semi-transparentem Overlay' },
    },
  },
};

export const ReducedMotion = {
  name: 'Reduced Motion',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-spinner">
    spinner
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Verhalten bei prefers-reduced-motion' },
    },
  },
};
