// ============================================================
// Textarea — Auto-generated from textarea-recipe.json
// Version: 2.0.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Atoms/Textarea',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**Textarea** v2.0.0 (stable)

Textarea ist ein natives <textarea class='nc-textarea'>. Kein JS fuer Basis-Funktion noetig.


`,
      },
    },
    status: { type: 'stable' },
  },
  argTypes: {},
};

export const Default = {
  render: () => `<div class="nc-textarea">
    textarea
  </div>`,
};

export const AllStatesMD = {
  name: 'All States — MD',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-textarea">
    textarea
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Textarea in allen interaktiven Zustaenden' },
    },
  },
};

export const VariantComparison = {
  name: 'Variant Comparison',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  
</div>`,
  parameters: {
    docs: {
      description: { story: 'Outlined vs Filled vs Borderless — alle 3 Varianten im Vergleich' },
    },
  },
};

export const SizeScaleSMMDLG = {
  name: 'Size Scale — SM / MD / LG',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-textarea">
    textarea
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Alle 3 Groessen im Vergleich' },
    },
  },
};

export const ValidationStates = {
  name: 'Validation States',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-textarea">
    textarea
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Error und Success im Vergleich zu Default' },
    },
  },
};

export const ResizeVariants = {
  name: 'Resize Variants',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-textarea">
    textarea
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Default (vertical) vs Autosize vs No-Resize' },
    },
  },
};

export const WithCharacterCounter = {
  name: 'With Character Counter',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-textarea">
    textarea
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Textarea mit Zeichenzaehler (normal und Limit erreicht)' },
    },
  },
};

export const WithPlaceholder = {
  name: 'With Placeholder',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-textarea">
    textarea
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Textarea mit Placeholder-Text in verschiedenen Groessen' },
    },
  },
};

export const WithActionsToolbar = {
  name: 'With Actions Toolbar',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-textarea">
    textarea
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Textarea mit Actions-Leiste (Copy, Clear, AI-Assist Buttons)' },
    },
  },
};
