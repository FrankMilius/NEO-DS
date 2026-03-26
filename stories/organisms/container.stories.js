// ============================================================
// Container — Auto-generated from container-recipe.json
// Version: 2.0.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Organisms/Container',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**Container** v2.0.0 (stable)

Container zentriert Inhalt horizontal und begrenzt die maximale Breite.


`,
      },
    },
    status: { type: 'stable' },
  },
  argTypes: {},
};

export const Default = {
  render: () => `<div class="nc-container">
    <span class="nc-container > *">content</span>
  </div>`,
};

export const BreitenVarianten = {
  name: 'Breiten-Varianten',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  
</div>`,
  parameters: {
    docs: {
      description: { story: 'Alle Container-Breiten im Vergleich.' },
    },
  },
};

export const VerticalSpacing = {
  name: 'Vertical Spacing',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  
</div>`,
  parameters: {
    docs: {
      description: { story: 'Vertikales Padding in drei Stufen.' },
    },
  },
};

export const Alignment = {
  name: 'Alignment',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  
</div>`,
  parameters: {
    docs: {
      description: { story: 'Horizontale Ausrichtung: zentriert, links, rechts.' },
    },
  },
};

export const Surface = {
  name: 'Surface',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  
</div>`,
  parameters: {
    docs: {
      description: { story: 'Transparenter vs. Surface-Container.' },
    },
  },
};
