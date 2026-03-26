// ============================================================
// NavigationOrchestration — Auto-generated from navigation-orchestration-recipe.json
// Version: 1.0.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Organisms/NavigationOrchestration',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**NavigationOrchestration** v1.0.0 (stable)

Ebene 1 — Shell: .nc-shell__navbar Slot reserviert die Grid-Row. nc-shell-z-navbar bestimmt den Z-Index.


`,
      },
    },
    status: { type: 'stable' },
  },
  argTypes: {},
};

export const Default = {
  render: () => `<div class="nc-header">
    <span class="nc-shell__navbar">shell-slot</span>
    <span class="nc-header">header</span>
    <span class="nc-nav__inner">nav-inner</span>
    <span class="nc-brand">brand</span>
  </div>`,
};

export const FullHeaderComposition = {
  name: 'Full Header Composition',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-header">
    <span class="nc-shell__navbar">shell-slot</span>
    <span class="nc-header">header</span>
    <span class="nc-nav__inner">nav-inner</span>
    <span class="nc-brand">brand</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: '5-Ebenen-Komposition: Shell-Slot → Header → Menu → Links → Icons' },
    },
  },
};

export const TokenCascadeVisualization = {
  name: 'Token Cascade Visualization',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-header">
    <span class="nc-shell__navbar">shell-slot</span>
    <span class="nc-header">header</span>
    <span class="nc-nav__inner">nav-inner</span>
    <span class="nc-brand">brand</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Zeigt den Datenfluss: Shell-Z → Nav-Height → Mol-Hover → Atom-Icon' },
    },
  },
};

export const MobileHandoff = {
  name: 'Mobile Handoff',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-header">
    <span class="nc-shell__navbar">shell-slot</span>
    <span class="nc-header">header</span>
    <span class="nc-nav__inner">nav-inner</span>
    <span class="nc-brand">brand</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Desktop-Menu → Hamburger → Drawer mit vertikalen Links' },
    },
  },
};

export const CompactDensity = {
  name: 'Compact Density',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-header">
    <span class="nc-shell__navbar">shell-slot</span>
    <span class="nc-header">header</span>
    <span class="nc-nav__inner">nav-inner</span>
    <span class="nc-brand">brand</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Reduzierte Hoehe fuer Dashboard-Layouts' },
    },
  },
};

export const ZIndexGovernance = {
  name: 'Z-Index Governance',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-header">
    <span class="nc-shell__navbar">shell-slot</span>
    <span class="nc-header">header</span>
    <span class="nc-nav__inner">nav-inner</span>
    <span class="nc-brand">brand</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Shell-Z-Schichten: Linkbar < Footerbar < Navbar < Sidebar < Overlay < Drawer' },
    },
  },
};
