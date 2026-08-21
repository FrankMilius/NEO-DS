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
  render: () => `<div style="border:1px dashed #92500a;border-radius:4px;padding:12px">
  <p style="margin:0 0 10px;font:600 12px/1.4 ui-monospace,monospace;letter-spacing:.08em;text-transform:uppercase;color:#92500a">
    Kein echtes Markup hinterlegt
  </p>
  <p style="margin:0 0 12px;font:400 13px/1.5 system-ui,sans-serif;color:#595c59;max-width:62ch">
    Was hier steht, ist aus der Anatomie des Recipes abgeleitet — die Slots als
    Geschwister, ohne Schachtelung und ohne Zustaende. So sieht das Bauteil
    nicht aus. Echtes Markup gehoert nach
    <code style="font:inherit;font-family:ui-monospace,monospace">data/markup/navigation-orchestration.html</code>.
  </p>
  <div class="nc-header">
    <span class="nc-shell__navbar">shell-slot</span>
    <span class="nc-header">header</span>
    <span class="nc-nav__inner">nav-inner</span>
    <span class="nc-brand">brand</span>
  </div>
</div>`,
};

export const FullHeaderComposition = {
  name: 'Full Header Composition',
  render: () => `<div style="border:1px dashed #92500a;border-radius:4px;padding:12px">
  <p style="margin:0 0 10px;font:600 12px/1.4 ui-monospace,monospace;letter-spacing:.08em;text-transform:uppercase;color:#92500a">
    Kein echtes Markup hinterlegt
  </p>
  <p style="margin:0 0 12px;font:400 13px/1.5 system-ui,sans-serif;color:#595c59;max-width:62ch">
    Was hier steht, ist aus der Anatomie des Recipes abgeleitet — die Slots als
    Geschwister, ohne Schachtelung und ohne Zustaende. So sieht das Bauteil
    nicht aus. Echtes Markup gehoert nach
    <code style="font:inherit;font-family:ui-monospace,monospace">data/markup/navigation-orchestration.html</code>.
  </p>
  <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-header">
    <span class="nc-shell__navbar">shell-slot</span>
    <span class="nc-header">header</span>
    <span class="nc-nav__inner">nav-inner</span>
    <span class="nc-brand">brand</span>
  </div>
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
  render: () => `<div style="border:1px dashed #92500a;border-radius:4px;padding:12px">
  <p style="margin:0 0 10px;font:600 12px/1.4 ui-monospace,monospace;letter-spacing:.08em;text-transform:uppercase;color:#92500a">
    Kein echtes Markup hinterlegt
  </p>
  <p style="margin:0 0 12px;font:400 13px/1.5 system-ui,sans-serif;color:#595c59;max-width:62ch">
    Was hier steht, ist aus der Anatomie des Recipes abgeleitet — die Slots als
    Geschwister, ohne Schachtelung und ohne Zustaende. So sieht das Bauteil
    nicht aus. Echtes Markup gehoert nach
    <code style="font:inherit;font-family:ui-monospace,monospace">data/markup/navigation-orchestration.html</code>.
  </p>
  <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-header">
    <span class="nc-shell__navbar">shell-slot</span>
    <span class="nc-header">header</span>
    <span class="nc-nav__inner">nav-inner</span>
    <span class="nc-brand">brand</span>
  </div>
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
  render: () => `<div style="border:1px dashed #92500a;border-radius:4px;padding:12px">
  <p style="margin:0 0 10px;font:600 12px/1.4 ui-monospace,monospace;letter-spacing:.08em;text-transform:uppercase;color:#92500a">
    Kein echtes Markup hinterlegt
  </p>
  <p style="margin:0 0 12px;font:400 13px/1.5 system-ui,sans-serif;color:#595c59;max-width:62ch">
    Was hier steht, ist aus der Anatomie des Recipes abgeleitet — die Slots als
    Geschwister, ohne Schachtelung und ohne Zustaende. So sieht das Bauteil
    nicht aus. Echtes Markup gehoert nach
    <code style="font:inherit;font-family:ui-monospace,monospace">data/markup/navigation-orchestration.html</code>.
  </p>
  <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-header">
    <span class="nc-shell__navbar">shell-slot</span>
    <span class="nc-header">header</span>
    <span class="nc-nav__inner">nav-inner</span>
    <span class="nc-brand">brand</span>
  </div>
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
  render: () => `<div style="border:1px dashed #92500a;border-radius:4px;padding:12px">
  <p style="margin:0 0 10px;font:600 12px/1.4 ui-monospace,monospace;letter-spacing:.08em;text-transform:uppercase;color:#92500a">
    Kein echtes Markup hinterlegt
  </p>
  <p style="margin:0 0 12px;font:400 13px/1.5 system-ui,sans-serif;color:#595c59;max-width:62ch">
    Was hier steht, ist aus der Anatomie des Recipes abgeleitet — die Slots als
    Geschwister, ohne Schachtelung und ohne Zustaende. So sieht das Bauteil
    nicht aus. Echtes Markup gehoert nach
    <code style="font:inherit;font-family:ui-monospace,monospace">data/markup/navigation-orchestration.html</code>.
  </p>
  <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-header">
    <span class="nc-shell__navbar">shell-slot</span>
    <span class="nc-header">header</span>
    <span class="nc-nav__inner">nav-inner</span>
    <span class="nc-brand">brand</span>
  </div>
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
  render: () => `<div style="border:1px dashed #92500a;border-radius:4px;padding:12px">
  <p style="margin:0 0 10px;font:600 12px/1.4 ui-monospace,monospace;letter-spacing:.08em;text-transform:uppercase;color:#92500a">
    Kein echtes Markup hinterlegt
  </p>
  <p style="margin:0 0 12px;font:400 13px/1.5 system-ui,sans-serif;color:#595c59;max-width:62ch">
    Was hier steht, ist aus der Anatomie des Recipes abgeleitet — die Slots als
    Geschwister, ohne Schachtelung und ohne Zustaende. So sieht das Bauteil
    nicht aus. Echtes Markup gehoert nach
    <code style="font:inherit;font-family:ui-monospace,monospace">data/markup/navigation-orchestration.html</code>.
  </p>
  <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-header">
    <span class="nc-shell__navbar">shell-slot</span>
    <span class="nc-header">header</span>
    <span class="nc-nav__inner">nav-inner</span>
    <span class="nc-brand">brand</span>
  </div>
</div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Shell-Z-Schichten: Linkbar < Footerbar < Navbar < Sidebar < Overlay < Drawer' },
    },
  },
};
