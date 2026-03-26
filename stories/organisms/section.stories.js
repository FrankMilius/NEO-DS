// ============================================================
// Section — Auto-generated from section-recipe.json
// Version: 2.0.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Organisms/Section',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**Section** v2.0.0 (stable)

Section ist der Orchestrator: setzt Block-Padding, enthaelt Container, konfiguriert Grid.


`,
      },
    },
    status: { type: 'stable' },
  },
  argTypes: {},
};

export const Default = {
  render: () => `<div class="section">
    <span class="nc-container">container</span>
    <span class="nc-container > *">content</span>
  </div>`,
};

export const DichteVarianten = {
  name: 'Dichte-Varianten',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  
</div>`,
  parameters: {
    docs: {
      description: { story: 'Compact, Default und Spacious im Vergleich.' },
    },
  },
};

export const OberflaechenVarianten = {
  name: 'Oberflaechen-Varianten',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  
</div>`,
  parameters: {
    docs: {
      description: { story: 'Alle Section-Hintergruende.' },
    },
  },
};

export const DividerVarianten = {
  name: 'Divider-Varianten',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  
</div>`,
  parameters: {
    docs: {
      description: { story: 'Trennlinien-Positionen: top, bottom, both.' },
    },
  },
};

export const EdgeShapes = {
  name: 'Edge Shapes',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  
</div>`,
  parameters: {
    docs: {
      description: { story: 'Kantenformen: straight, slanted, curved.' },
    },
  },
};

export const DichteOberflaeche = {
  name: 'Dichte × Oberflaeche',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  
</div>`,
  parameters: {
    docs: {
      description: { story: 'Vollstaendige Matrix aller Kombinationen — zeigt ob z.B. compact auf accent zu gedraengt wirkt.' },
    },
  },
};

export const OberflaecheDivider = {
  name: 'Oberflaeche × Divider',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  
</div>`,
  parameters: {
    docs: {
      description: { story: 'Welche Divider-Kombinationen auf welchen Surfaces sinnvoll sind.' },
    },
  },
};
