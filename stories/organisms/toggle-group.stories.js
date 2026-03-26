// ============================================================
// ToggleGroup — Auto-generated from toggle-group-recipe.json
// Version: 2.0.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Organisms/ToggleGroup',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**ToggleGroup** v2.0.0 (stable)

Container ist ein <div class='nc-toggle-group'>.


`,
      },
    },
    status: { type: 'stable' },
  },
  argTypes: {},
};

export const Default = {
  render: () => `<div class="nc-toggle-group">
    <span class="nc-toggle-group__item">item</span>
  </div>`,
};

export const AllStatesMDSingle = {
  name: 'All States — MD, Single',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-toggle-group">
    <span class="nc-toggle-group__item">item</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Toggle Group mit Items in allen Zustaenden (Single-Select)' },
    },
  },
};

export const SizeScaleSMMDLG = {
  name: 'Size Scale — SM / MD / LG',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  
</div>`,
  parameters: {
    docs: {
      description: { story: 'Alle 3 Groessen im Vergleich' },
    },
  },
};

export const FilledvsOutlinevsSoft = {
  name: 'Filled vs Outline vs Soft',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-toggle-group">
    <span class="nc-toggle-group__item">item</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Alle 3 visuellen Varianten im Vergleich' },
    },
  },
};

export const BGvsUnderlineIndicator = {
  name: 'BG vs Underline Indicator',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-toggle-group">
    <span class="nc-toggle-group__item">item</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Background-Wechsel vs Underline als Selektions-Indikator' },
    },
  },
};

export const SinglevsMultiple = {
  name: 'Single vs Multiple',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-toggle-group">
    <span class="nc-toggle-group__item">item</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Radio-Pattern (genau 1) vs Toggle-Pattern (0–n)' },
    },
  },
};

export const EqualWidth = {
  name: 'Equal Width',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-toggle-group">
    <span class="nc-toggle-group__item">item</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Auto (natuerliche Breite) vs Equal (alle gleich breit)' },
    },
  },
};

export const ContentTypes = {
  name: 'Content Types',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-toggle-group">
    <span class="nc-toggle-group__item">item</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Text-only vs Icon+Text vs Icon-only' },
    },
  },
};

export const ToolbarPattern = {
  name: 'Toolbar Pattern',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-toggle-group">
    <span class="nc-toggle-group__item">item</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Multi-Select Icon-Only Toolbar (Text-Formatting, Alignment)' },
    },
  },
};
