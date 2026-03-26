// ============================================================
// Label — Auto-generated from label-recipe.json
// Version: 2.0.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Atoms/Label',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**Label** v2.0.0 (stable)

Inline-flex Element mit static-surface-base Mixin.


`,
      },
    },
    status: { type: 'stable' },
  },
  argTypes: {},
};

export const Default = {
  render: () => `<div class="nc-label">
    <span class="nc-label__icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/></svg></span>
    <span class="nc-label__text">label</span>
    <span class="nc-label__remove">remove</span>
  </div>`,
};

export const VariantComparisonSubtle = {
  name: 'Variant Comparison (Subtle)',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  
</div>`,
  parameters: {
    docs: {
      description: { story: 'Alle 6 Farbvarianten in Standard-Emphasis (subtle, Pastellton-BG)' },
    },
  },
};

export const EmphasisVariant = {
  name: 'Emphasis × Variant',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  
</div>`,
  parameters: {
    docs: {
      description: { story: 'Subtle vs. Solid vs. Outline fuer jede Variante' },
    },
  },
};

export const SizeComparison = {
  name: 'Size Comparison',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  
</div>`,
  parameters: {
    docs: {
      description: { story: 'XS (dichte Listen), SM (Standard), MD (Header-Kontext)' },
    },
  },
};

export const ShapeRoundedvsPill = {
  name: 'Shape: Rounded vs. Pill',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  
</div>`,
  parameters: {
    docs: {
      description: { story: 'Rounded (System-Radius) vs. Pill (abgerundet) bei verschiedenen Varianten' },
    },
  },
};

export const LabelsmitIcons = {
  name: 'Labels mit Icons',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-label">
    <span class="nc-label__icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/></svg></span>
    <span class="nc-label__text">label</span>
    <span class="nc-label__remove">remove</span>
  </div>
  <div class="nc-label">
    <span class="nc-label__icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/></svg></span>
    <span class="nc-label__text">label</span>
    <span class="nc-label__remove">remove</span>
  </div>
  <div class="nc-label">
    <span class="nc-label__icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/></svg></span>
    <span class="nc-label__text">label</span>
    <span class="nc-label__remove">remove</span>
  </div>
  <div class="nc-label">
    <span class="nc-label__icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/></svg></span>
    <span class="nc-label__text">label</span>
    <span class="nc-label__remove">remove</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Icon-Slot fuer beschleunigte Scanbarkeit (Check, Warn, Info etc.)' },
    },
  },
};

export const InteractiveLabelsFilterTags = {
  name: 'Interactive Labels (Filter-Tags)',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-label">
    <span class="nc-label__icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/></svg></span>
    <span class="nc-label__text">label</span>
    <span class="nc-label__remove">remove</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Hover-Zustaende und Remove-Button fuer Filter-Tags' },
    },
  },
};

export const ContainerGruppenLayout = {
  name: 'Container (Gruppen-Layout)',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  
</div>`,
  parameters: {
    docs: {
      description: { story: 'Labels in flex-wrap Container mit gap — sauberes Umbrechen bei Platzmangel' },
    },
  },
};
