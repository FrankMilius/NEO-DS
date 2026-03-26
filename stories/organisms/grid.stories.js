// ============================================================
// Grid — Auto-generated from grid-recipe.json
// Version: 2.0.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Organisms/Grid',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**Grid** v2.0.0 (stable)

12-Spalten-Grid basierend auf CSS Grid.


`,
      },
    },
    status: { type: 'stable' },
  },
  argTypes: {},
};

export const Default = {
  render: () => `<div class="o-grid">
    <span class="o-col-*">column</span>
  </div>`,
};

export const GapVarianten = {
  name: 'Gap-Varianten',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  
</div>`,
  parameters: {
    docs: {
      description: { story: 'Alle Gap-Groessen im Vergleich.' },
    },
  },
};

export const LayoutModi = {
  name: 'Layout-Modi',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  
</div>`,
  parameters: {
    docs: {
      description: { story: 'Fixed vs. Auto-fit Grid.' },
    },
  },
};

export const FlowVarianten = {
  name: 'Flow-Varianten',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  
</div>`,
  parameters: {
    docs: {
      description: { story: 'Platzierungsverhalten: row, column, dense.' },
    },
  },
};

export const Alignment = {
  name: 'Alignment',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  
</div>`,
  parameters: {
    docs: {
      description: { story: 'Vertikale Ausrichtungs-Varianten.' },
    },
  },
};

export const MobileSpalten = {
  name: 'Mobile Spalten',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  
</div>`,
  parameters: {
    docs: {
      description: { story: 'Spaltenraster auf Mobile-Viewports.' },
    },
  },
};

export const Subgrid = {
  name: 'Subgrid',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  
</div>`,
  parameters: {
    docs: {
      description: { story: 'Verschachteltes Raster mit Eltern-Uebernahme.' },
    },
  },
};

export const ResponsiveMatrix = {
  name: 'Responsive Matrix',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  
</div>`,
  parameters: {
    docs: {
      description: { story: 'Grid-Verhalten ueber alle Breakpoints: Mobile, Tablet, Desktop.' },
    },
  },
};
