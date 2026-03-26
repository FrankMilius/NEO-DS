// ============================================================
// Drawer — Auto-generated from drawer-recipe.json
// Version: 2.0.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Organisms/Drawer',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**Drawer** v2.0.0 (stable)

Natives <dialog> mit showModal(). Slide-in von 4 Richtungen mit Spring-Animation.


`,
      },
    },
    status: { type: 'stable' },
  },
  argTypes: {},
};

export const Default = {
  render: () => `<div class="nc-drawer">
    <span class="nc-drawer__content">content</span>
  </div>`,
};

export const BottomSheetDefault = {
  name: 'Bottom Sheet (Default)',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-drawer">
    <span class="nc-drawer__content">content</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Standard Bottom-Sheet mit Handle, Header, Content und Footer' },
    },
  },
};

export const AllDirections = {
  name: 'All Directions',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  
</div>`,
  parameters: {
    docs: {
      description: { story: 'Alle 4 Richtungen: bottom, top, left, right' },
    },
  },
};

export const SidePanelRight = {
  name: 'Side Panel (Right)',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-drawer">
    <span class="nc-drawer__content">content</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Seitliches Panel von rechts — Navigation, Settings, Details' },
    },
  },
};

export const ScrolledContent = {
  name: 'Scrolled Content',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-drawer">
    <span class="nc-drawer__content">content</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Lange Liste — sticky Header/Footer mit Scroll-Border' },
    },
  },
};

export const WithFormContent = {
  name: 'With Form Content',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-drawer">
    <span class="nc-drawer__content">content</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Drawer mit Formularinhalt — Footer mit Action-Buttons' },
    },
  },
};

export const LightDismiss = {
  name: 'Light Dismiss',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-drawer">
    <span class="nc-drawer__content">content</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Klick auf Backdrop schliesst Drawer — Overlay mit Cursor-Pointer' },
    },
  },
};
