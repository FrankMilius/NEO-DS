// ============================================================
// Tag — Auto-generated from tag-recipe.json
// Version: 2.0.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Atoms/Tag',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**Tag** v2.0.0 (stable)

Statischer Tag: <span class='nc-tag'>. Nicht fokussierbar, kein interaktives Element.


`,
      },
    },
    status: { type: 'stable' },
  },
  argTypes: {},
};

export const Default = {
  render: () => `<div class="nc-tag">
    tag
  </div>`,
};

export const AllVariantsMD = {
  name: 'All Variants — MD',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-tag">
    tag
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Alle 7 Farbvarianten in Default-Groesse' },
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

export const InteractiveStates = {
  name: 'Interactive States',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-tag">
    tag
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Interactive Tag in allen Zustaenden' },
    },
  },
};

export const ContentTypes = {
  name: 'Content Types',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-tag">
    tag
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Text-only vs Icon+Text vs Removable' },
    },
  },
};

export const VariantsInteractiveHover = {
  name: 'Variants × Interactive Hover',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-tag">
    tag
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Alle Varianten als Interactive mit Hover-State' },
    },
  },
};

export const RemovableVariants = {
  name: 'Removable × Variants',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-tag">
    tag
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Entfernbare Tags in verschiedenen Varianten' },
    },
  },
};

export const SelectableTagsFilterChips = {
  name: 'Selectable Tags (Filter-Chips)',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-tag">
    tag
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Toggle-Tags mit Selected-State — aria-pressed fuer Filter-Muster' },
    },
  },
};

export const InteractiveShadowHover = {
  name: 'Interactive Shadow Hover',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-tag">
    tag
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Shadow-Indikator auf interaktiven Tags fuer deutlichere Klickbarkeit' },
    },
  },
};
