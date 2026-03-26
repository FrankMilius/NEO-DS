// ============================================================
// Button — Auto-generated from button-recipe.json
// Version: 2.0.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Atoms/Button',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**Button** v2.0.0 (stable)

Buttons muessen immer ein zugaengliches Label haben — entweder sichtbarer Text oder aria-label fuer Icon-Only.


`,
      },
    },
    status: { type: 'stable' },
  },
  argTypes: {},
};

export const Default = {
  render: () => `<button class="nc-button">
    <span class="nc-button__label">button</span>
  </button>`,
};

export const AllVariantsMD = {
  name: 'All Variants — MD',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  
</div>`,
  parameters: {
    docs: {
      description: { story: 'Alle 11 Varianten in Standardgroesse (inkl. Soft + Inverted)' },
    },
  },
};

export const SizeScaleXSSMMDLG = {
  name: 'Size Scale — XS / SM / MD / LG',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <button class="nc-button">
    <span class="nc-button__label">button</span>
  </button>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Primary-Variante in allen 4 Groessen. XS/SM mit Touch-Target.' },
    },
  },
};

export const WithIcon = {
  name: 'With Icon',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  
</div>`,
  parameters: {
    docs: {
      description: { story: 'Alle Varianten mit Leading-Icon' },
    },
  },
};

export const IconOnly = {
  name: 'Icon Only',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <button class="nc-button">
    <span class="nc-button__label">button</span>
  </button>
  <button class="nc-button">
    <span class="nc-button__label">button</span>
  </button>
  <button class="nc-button">
    <span class="nc-button__label">button</span>
  </button>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Primary, Secondary, Ghost — alle Groessen' },
    },
  },
};

export const SoftVariant = {
  name: 'Soft Variant',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <button class="nc-button">
    <span class="nc-button__label">button</span>
  </button>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Soft-Buttons (10% Brand-BG) — alle Groessen, mit und ohne Icon' },
    },
  },
};

export const InvertedVariant = {
  name: 'Inverted Variant',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <button class="nc-button">
    <span class="nc-button__label">button</span>
  </button>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Inverted-Buttons auf dunklem Hintergrund' },
    },
  },
};

export const FullWidth = {
  name: 'Full Width',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <button class="nc-button">
    <span class="nc-button__label">button</span>
  </button>
  <button class="nc-button">
    <span class="nc-button__label">button</span>
  </button>
  <button class="nc-button">
    <span class="nc-button__label">button</span>
  </button>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Buttons mit voller Containerbreite (Mobile, Login, Modal-Footer)' },
    },
  },
};

export const FABFloatingActionButton = {
  name: 'FAB (Floating Action Button)',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <button class="nc-button">
    <span class="nc-button__label">button</span>
  </button>
  <button class="nc-button">
    <span class="nc-button__label">button</span>
  </button>
  <button class="nc-button">
    <span class="nc-button__label">button</span>
  </button>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Rundes Icon-Only-Muster mit Elevation-Shadow fuer primaere Aktionen' },
    },
  },
};
