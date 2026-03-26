// ============================================================
// FormLabel — Auto-generated from form-label-recipe.json
// Version: 2.0.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Molecules/FormLabel',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**FormLabel** v2.0.0 (stable)

Semantisch ein <label for='input-id'> Element.


`,
      },
    },
    status: { type: 'stable' },
  },
  argTypes: {},
};

export const Default = {
  render: () => `<div class="nc-form-label">
    <span class="nc-form-label__text">form-label</span>
  </div>`,
};

export const DefaultLabel = {
  name: 'Default Label',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-form-label">
    <span class="nc-form-label__text">form-label</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Standard-Label ohne Indikator, Groesse MD' },
    },
  },
};

export const IndicatorVariants = {
  name: 'Indicator Variants',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  
</div>`,
  parameters: {
    docs: {
      description: { story: 'Alle Indikator-Varianten: none, required (*), optional, info (Tooltip)' },
    },
  },
};

export const SizeHierarchy = {
  name: 'Size / Hierarchy',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-form-label">
    <span class="nc-form-label__text">form-label</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Typografie-Hierarchie: SM (kompakt), MD (Standard), Emphasis (Section-Label)' },
    },
  },
};

export const LayoutVariants = {
  name: 'Layout Variants',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-form-label">
    <span class="nc-form-label__text">form-label</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Block (ueber Input) vs Inline (neben Input)' },
    },
  },
};

export const AllStates = {
  name: 'All States',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-form-label">
    <span class="nc-form-label__text">form-label</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Default vs Disabled (mit Info-Icon)' },
    },
  },
};

export const InfoRequiredCombined = {
  name: 'Info + Required Combined',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-form-label">
    <span class="nc-form-label__text">form-label</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Label mit Required-Indikator UND Info-Tooltip — haeufiger realer Use Case' },
    },
  },
};

export const HitAreaTouchTarget = {
  name: 'Hit Area / Touch Target',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-form-label">
    <span class="nc-form-label__text">form-label</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Vergleich: Standard-Klickbereich vs erweiterter Klickbereich via Padding' },
    },
  },
};

export const WithInputField = {
  name: 'With Input Field',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-form-label">
    <span class="nc-form-label__text">form-label</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Label ueber einem Input-Feld (typischer Anwendungsfall)' },
    },
  },
};
