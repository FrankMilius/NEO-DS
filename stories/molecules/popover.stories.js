// ============================================================
// Popover — Auto-generated from popover-recipe.json
// Version: 2.0.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Molecules/Popover',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**Popover** v2.0.0 (stable)

Root: inline-flex Wrapper mit Trigger und Panel.


`,
      },
    },
    status: { type: 'stable' },
  },
  argTypes: {},
};

export const Default = {
  render: () => `<div class="nc-popover">
    <span class="nc-popover__trigger">trigger</span>
    <span class="nc-popover__panel">panel</span>
    <span class="nc-popover__body">body</span>
  </div>`,
};

export const DefaultPopover = {
  name: 'Default Popover',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-popover">
    <span class="nc-popover__trigger">trigger</span>
    <span class="nc-popover__panel">panel</span>
    <span class="nc-popover__body">body</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Einfaches Popover mit Body-Inhalt, bottom-Positionierung' },
    },
  },
};

export const PlacementVariants = {
  name: 'Placement Variants',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-popover">
    <span class="nc-popover__trigger">trigger</span>
    <span class="nc-popover__panel">panel</span>
    <span class="nc-popover__body">body</span>
  </div>
  <div class="nc-popover">
    <span class="nc-popover__trigger">trigger</span>
    <span class="nc-popover__panel">panel</span>
    <span class="nc-popover__body">body</span>
  </div>
  <div class="nc-popover">
    <span class="nc-popover__trigger">trigger</span>
    <span class="nc-popover__panel">panel</span>
    <span class="nc-popover__body">body</span>
  </div>
  <div class="nc-popover">
    <span class="nc-popover__trigger">trigger</span>
    <span class="nc-popover__panel">panel</span>
    <span class="nc-popover__body">body</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Bottom, Top, Left, Right Positionierungen' },
    },
  },
};

export const ContentVariants = {
  name: 'Content Variants',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-popover">
    <span class="nc-popover__trigger">trigger</span>
    <span class="nc-popover__panel">panel</span>
    <span class="nc-popover__body">body</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Body-Only, With Header, With Footer, Full (Header+Body+Footer), With Arrow' },
    },
  },
};

export const WithArrow = {
  name: 'With Arrow',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-popover">
    <span class="nc-popover__trigger">trigger</span>
    <span class="nc-popover__panel">panel</span>
    <span class="nc-popover__body">body</span>
  </div>
  <div class="nc-popover">
    <span class="nc-popover__trigger">trigger</span>
    <span class="nc-popover__panel">panel</span>
    <span class="nc-popover__body">body</span>
  </div>
  <div class="nc-popover">
    <span class="nc-popover__trigger">trigger</span>
    <span class="nc-popover__panel">panel</span>
    <span class="nc-popover__body">body</span>
  </div>
  <div class="nc-popover">
    <span class="nc-popover__trigger">trigger</span>
    <span class="nc-popover__panel">panel</span>
    <span class="nc-popover__body">body</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Popover mit dekorativem Pfeil, der auf den Trigger zeigt. Optional — Select/Dropdown haben keinen Pfeil.' },
    },
  },
};

export const FullPopover = {
  name: 'Full Popover',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-popover">
    <span class="nc-popover__trigger">trigger</span>
    <span class="nc-popover__panel">panel</span>
    <span class="nc-popover__body">body</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Komplettes Popover mit Header (Titel + Close), Body und Footer (Aktions-Buttons)' },
    },
  },
};

export const AlignmentVariants = {
  name: 'Alignment Variants',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-popover">
    <span class="nc-popover__trigger">trigger</span>
    <span class="nc-popover__panel">panel</span>
    <span class="nc-popover__body">body</span>
  </div>
  <div class="nc-popover">
    <span class="nc-popover__trigger">trigger</span>
    <span class="nc-popover__panel">panel</span>
    <span class="nc-popover__body">body</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Bottom-Start und Bottom-End Ausrichtung fuer nicht-zentrierte Panels' },
    },
  },
};

export const InlineFilterPopover = {
  name: 'Inline Filter Popover',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-popover">
    <span class="nc-popover__trigger">trigger</span>
    <span class="nc-popover__panel">panel</span>
    <span class="nc-popover__body">body</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Mini-Editor/Filter-Popover mit Formularfeldern. Testet Typografie-Dichte im kleinen Panel.' },
    },
  },
};

export const LightDismiss = {
  name: 'Light Dismiss',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-popover">
    <span class="nc-popover__trigger">trigger</span>
    <span class="nc-popover__panel">panel</span>
    <span class="nc-popover__body">body</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Popover mit Light-Dismiss: Klick ausserhalb oder Scroll des Eltern-Containers schliesst. Nicht fuer Formulare.' },
    },
  },
};
