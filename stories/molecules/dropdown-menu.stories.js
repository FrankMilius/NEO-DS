// ============================================================
// DropdownMenu — Auto-generated from dropdown-menu-recipe.json
// Version: 2.0.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Molecules/DropdownMenu',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**DropdownMenu** v2.0.0 (stable)

Root: inline-flex Wrapper mit Trigger-Button und Menu-Panel.


`,
      },
    },
    status: { type: 'stable' },
  },
  argTypes: {},
};

export const Default = {
  render: () => `<div class="nc-dropdown">
    <span class="nc-dropdown__trigger">trigger</span>
    <span class="nc-dropdown__menu">menu</span>
    <span class="nc-dropdown__item">item</span>
  </div>`,
};

export const AllStates = {
  name: 'All States',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-dropdown">
    <span class="nc-dropdown__trigger">trigger</span>
    <span class="nc-dropdown__menu">menu</span>
    <span class="nc-dropdown__item">item</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Dropdown-Item in allen Zustaenden: default, hover, active, focus, disabled' },
    },
  },
};

export const PlacementVariants = {
  name: 'Placement Variants',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  
</div>`,
  parameters: {
    docs: {
      description: { story: 'Alle vier Positionierungen: bottom-start, bottom-end, top-start, top-end' },
    },
  },
};

export const ContentVariants = {
  name: 'Content Variants',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-dropdown">
    <span class="nc-dropdown__trigger">trigger</span>
    <span class="nc-dropdown__menu">menu</span>
    <span class="nc-dropdown__item">item</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Plain, With Icons, Grouped, With Shortcuts, With Submenu, With Footer' },
    },
  },
};

export const SingleSelectRadio = {
  name: 'Single Select (Radio)',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-dropdown">
    <span class="nc-dropdown__trigger">trigger</span>
    <span class="nc-dropdown__menu">menu</span>
    <span class="nc-dropdown__item">item</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Radio-Auswahl: Nur ein Item gleichzeitig aktiv. role=\'menuitemradio\', aria-checked.' },
    },
  },
};

export const MultiSelectCheckbox = {
  name: 'Multi Select (Checkbox)',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-dropdown">
    <span class="nc-dropdown__trigger">trigger</span>
    <span class="nc-dropdown__menu">menu</span>
    <span class="nc-dropdown__item">item</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Checkbox-Auswahl: Mehrere Items gleichzeitig aktiv. role=\'menuitemcheckbox\', aria-checked.' },
    },
  },
};

export const SubmenuCascading = {
  name: 'Submenu (Cascading)',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-dropdown">
    <span class="nc-dropdown__trigger">trigger</span>
    <span class="nc-dropdown__menu">menu</span>
    <span class="nc-dropdown__item">item</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Item mit Submenu-Indikator (Chevron rechts). Submenu oeffnet sich bei Hover/ArrowRight.' },
    },
  },
};

export const FooterSlot = {
  name: 'Footer Slot',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-dropdown">
    <span class="nc-dropdown__trigger">trigger</span>
    <span class="nc-dropdown__menu">menu</span>
    <span class="nc-dropdown__item">item</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Permanenter Footer-Bereich am unteren Rand — z.B. \'Alle anzeigen\' Link oder Hilfetext.' },
    },
  },
};

export const DangerItem = {
  name: 'Danger Item',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-dropdown">
    <span class="nc-dropdown__trigger">trigger</span>
    <span class="nc-dropdown__menu">menu</span>
    <span class="nc-dropdown__item">item</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Destruktive Aktion (z.B. Loeschen) mit roter Farbe und eigenem Hover-BG' },
    },
  },
};
