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
  render: () => `<div class="nc-sidebar">
    <span class="nc-sidebar__nav">nav</span>
    <span class="nc-sidebar__item">item</span>
    <span class="nc-sidebar__item-label">item-label</span>
  </div>`,
};

export const DefaultSidebar = {
  name: 'Default Sidebar',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-sidebar">
    <span class="nc-sidebar__nav">nav</span>
    <span class="nc-sidebar__item">item</span>
    <span class="nc-sidebar__item-label">item-label</span>
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
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  
</div>`,
  parameters: {
    docs: {
      description: { story: 'Expanded (260px, Labels sichtbar) vs Collapsed (56px, nur Icons)' },
    },
  },
};

export const ContentVariants = {
  name: 'Content Variants',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-sidebar">
    <span class="nc-sidebar__nav">nav</span>
    <span class="nc-sidebar__item">item</span>
    <span class="nc-sidebar__item-label">item-label</span>
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
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-sidebar">
    <span class="nc-sidebar__nav">nav</span>
    <span class="nc-sidebar__item">item</span>
    <span class="nc-sidebar__item-label">item-label</span>
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
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-sidebar">
    <span class="nc-sidebar__nav">nav</span>
    <span class="nc-sidebar__item">item</span>
    <span class="nc-sidebar__item-label">item-label</span>
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
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-sidebar">
    <span class="nc-sidebar__nav">nav</span>
    <span class="nc-sidebar__item">item</span>
    <span class="nc-sidebar__item-label">item-label</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Mobile-Ansicht: fixed Sidebar mit Backdrop-Overlay' },
    },
  },
};
