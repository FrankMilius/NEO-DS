// ============================================================
// Divider — Auto-generated from divider-recipe.json
// Version: 1.0.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Organisms/Divider',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**Divider** v1.0.0 (stable)

Standard: <hr class='nc-divider'>. Nativer role='separator' ist implizit.


`,
      },
    },
    status: { type: 'stable' },
  },
  argTypes: {},
};

export const Default = {
  render: () => `<div class="nc-divider">
    divider
  </div>`,
};

export const HorizontalvsVertical = {
  name: 'Horizontal vs Vertical',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  
</div>`,
  parameters: {
    docs: {
      description: { story: 'Beide Ausrichtungen im Vergleich' },
    },
  },
};

export const VariantsDefaultStrongWithLabel = {
  name: 'Variants — Default / Strong / With Label',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-divider">
    divider
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Alle visuellen Varianten im Vergleich' },
    },
  },
};

export const LineStylesSolidDashedDotted = {
  name: 'Line Styles — Solid / Dashed / Dotted',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-divider">
    divider
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Alle Linien-Stile im Vergleich' },
    },
  },
};

export const SpacingScale = {
  name: 'Spacing Scale',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-divider">
    divider
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Alle Spacing-Varianten im Vergleich' },
    },
  },
};

export const DividerwithLabel = {
  name: 'Divider with Label',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-divider">
    divider
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Label-Variante mit verschiedenen Texten' },
    },
  },
};

export const StrongOrientation = {
  name: 'Strong × Orientation',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  
</div>`,
  parameters: {
    docs: {
      description: { story: 'Strong-Variante in beiden Ausrichtungen' },
    },
  },
};
