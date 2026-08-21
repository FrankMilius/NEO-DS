// ============================================================
// Sidebar — Auto-generated from sidebar-recipe.json
// Version: 1.0.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Organisms/Sidebar',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**Sidebar** v1.0.0 (stable)

Root: <nav aria-label='Seitennavigation'>. Flex-column, volle Hoehe, border-right.


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
    <code style="font:inherit;font-family:ui-monospace,monospace">data/markup/sidebar.html</code>.
  </p>
  <div class="nc-sidebar">
    <span class="nc-sidebar__nav">nav</span>
    <span class="nc-sidebar__item">item</span>
    <span class="nc-sidebar__item-label">item-label</span>
  </div>
</div>`,
};

export const DefaultSidebar = {
  name: 'Default Sidebar',
  render: () => `<div style="border:1px dashed #92500a;border-radius:4px;padding:12px">
  <p style="margin:0 0 10px;font:600 12px/1.4 ui-monospace,monospace;letter-spacing:.08em;text-transform:uppercase;color:#92500a">
    Kein echtes Markup hinterlegt
  </p>
  <p style="margin:0 0 12px;font:400 13px/1.5 system-ui,sans-serif;color:#595c59;max-width:62ch">
    Was hier steht, ist aus der Anatomie des Recipes abgeleitet — die Slots als
    Geschwister, ohne Schachtelung und ohne Zustaende. So sieht das Bauteil
    nicht aus. Echtes Markup gehoert nach
    <code style="font:inherit;font-family:ui-monospace,monospace">data/markup/sidebar.html</code>.
  </p>
  <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-sidebar">
    <span class="nc-sidebar__nav">nav</span>
    <span class="nc-sidebar__item">item</span>
    <span class="nc-sidebar__item-label">item-label</span>
  </div>
</div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Expanded Sidebar mit flacher Item-Liste und aktivem Item' },
    },
  },
};

export const ExpandedvsCollapsed = {
  name: 'Expanded vs Collapsed',
  render: () => `<div style="border:1px dashed #92500a;border-radius:4px;padding:12px">
  <p style="margin:0 0 10px;font:600 12px/1.4 ui-monospace,monospace;letter-spacing:.08em;text-transform:uppercase;color:#92500a">
    Kein echtes Markup hinterlegt
  </p>
  <p style="margin:0 0 12px;font:400 13px/1.5 system-ui,sans-serif;color:#595c59;max-width:62ch">
    Was hier steht, ist aus der Anatomie des Recipes abgeleitet — die Slots als
    Geschwister, ohne Schachtelung und ohne Zustaende. So sieht das Bauteil
    nicht aus. Echtes Markup gehoert nach
    <code style="font:inherit;font-family:ui-monospace,monospace">data/markup/sidebar.html</code>.
  </p>
  <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  
</div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Expanded (260px, Labels sichtbar) vs Collapsed (56px, nur Icons)' },
    },
  },
};

export const ContentVariants = {
  name: 'Content Variants',
  render: () => `<div style="border:1px dashed #92500a;border-radius:4px;padding:12px">
  <p style="margin:0 0 10px;font:600 12px/1.4 ui-monospace,monospace;letter-spacing:.08em;text-transform:uppercase;color:#92500a">
    Kein echtes Markup hinterlegt
  </p>
  <p style="margin:0 0 12px;font:400 13px/1.5 system-ui,sans-serif;color:#595c59;max-width:62ch">
    Was hier steht, ist aus der Anatomie des Recipes abgeleitet — die Slots als
    Geschwister, ohne Schachtelung und ohne Zustaende. So sieht das Bauteil
    nicht aus. Echtes Markup gehoert nach
    <code style="font:inherit;font-family:ui-monospace,monospace">data/markup/sidebar.html</code>.
  </p>
  <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-sidebar">
    <span class="nc-sidebar__nav">nav</span>
    <span class="nc-sidebar__item">item</span>
    <span class="nc-sidebar__item-label">item-label</span>
  </div>
</div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Flat, Grouped, Nested, With Badges, Full' },
    },
  },
};

export const NestedSubmenu = {
  name: 'Nested Submenu',
  render: () => `<div style="border:1px dashed #92500a;border-radius:4px;padding:12px">
  <p style="margin:0 0 10px;font:600 12px/1.4 ui-monospace,monospace;letter-spacing:.08em;text-transform:uppercase;color:#92500a">
    Kein echtes Markup hinterlegt
  </p>
  <p style="margin:0 0 12px;font:400 13px/1.5 system-ui,sans-serif;color:#595c59;max-width:62ch">
    Was hier steht, ist aus der Anatomie des Recipes abgeleitet — die Slots als
    Geschwister, ohne Schachtelung und ohne Zustaende. So sieht das Bauteil
    nicht aus. Echtes Markup gehoert nach
    <code style="font:inherit;font-family:ui-monospace,monospace">data/markup/sidebar.html</code>.
  </p>
  <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-sidebar">
    <span class="nc-sidebar__nav">nav</span>
    <span class="nc-sidebar__item">item</span>
    <span class="nc-sidebar__item-label">item-label</span>
  </div>
</div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Sidebar mit aufklappbaren Sub-Menus und Chevron-Rotation' },
    },
  },
};

export const FullSidebar = {
  name: 'Full Sidebar',
  render: () => `<div style="border:1px dashed #92500a;border-radius:4px;padding:12px">
  <p style="margin:0 0 10px;font:600 12px/1.4 ui-monospace,monospace;letter-spacing:.08em;text-transform:uppercase;color:#92500a">
    Kein echtes Markup hinterlegt
  </p>
  <p style="margin:0 0 12px;font:400 13px/1.5 system-ui,sans-serif;color:#595c59;max-width:62ch">
    Was hier steht, ist aus der Anatomie des Recipes abgeleitet — die Slots als
    Geschwister, ohne Schachtelung und ohne Zustaende. So sieht das Bauteil
    nicht aus. Echtes Markup gehoert nach
    <code style="font:inherit;font-family:ui-monospace,monospace">data/markup/sidebar.html</code>.
  </p>
  <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-sidebar">
    <span class="nc-sidebar__nav">nav</span>
    <span class="nc-sidebar__item">item</span>
    <span class="nc-sidebar__item-label">item-label</span>
  </div>
</div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Komplette Sidebar: Header (Logo + Toggle), Gruppen, Badges, Sub-Menus, Footer' },
    },
  },
};

export const MobileOverlay = {
  name: 'Mobile Overlay',
  render: () => `<div style="border:1px dashed #92500a;border-radius:4px;padding:12px">
  <p style="margin:0 0 10px;font:600 12px/1.4 ui-monospace,monospace;letter-spacing:.08em;text-transform:uppercase;color:#92500a">
    Kein echtes Markup hinterlegt
  </p>
  <p style="margin:0 0 12px;font:400 13px/1.5 system-ui,sans-serif;color:#595c59;max-width:62ch">
    Was hier steht, ist aus der Anatomie des Recipes abgeleitet — die Slots als
    Geschwister, ohne Schachtelung und ohne Zustaende. So sieht das Bauteil
    nicht aus. Echtes Markup gehoert nach
    <code style="font:inherit;font-family:ui-monospace,monospace">data/markup/sidebar.html</code>.
  </p>
  <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-sidebar">
    <span class="nc-sidebar__nav">nav</span>
    <span class="nc-sidebar__item">item</span>
    <span class="nc-sidebar__item-label">item-label</span>
  </div>
</div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Mobile-Ansicht: fixed Sidebar mit Backdrop-Overlay' },
    },
  },
};
