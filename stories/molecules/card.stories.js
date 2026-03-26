// ============================================================
// Card — Auto-generated from card-recipe.json
// Version: 3.0.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Molecules/Card',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**Card** v3.0.0 (stable)

Root-Element haengt vom Behavior ab: <article> (static), <a> (navigational-entire), <label> (selectable), <details> (expandable).


`,
      },
    },
    status: { type: 'stable' },
  },
  argTypes: {},
};

export const Default = {
  render: () => `<div class="nc-card">
    <span class="nc-card__content">content</span>
  </div>`,
};

export const InformationalCards = {
  name: 'Informational Cards',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-card">
    <span class="nc-card__content">content</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Statische Inhalts-Cards ohne Interaktion' },
    },
  },
};

export const NavigationalCards = {
  name: 'Navigational Cards',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-card">
    <span class="nc-card__content">content</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Klickbare Link-Cards (entire und partial)' },
    },
  },
};

export const SelectableCards = {
  name: 'Selectable Cards',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-card">
    <span class="nc-card__content">content</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Radio- und Checkbox-Selection via hidden input' },
    },
  },
};

export const ExpandableCard = {
  name: 'Expandable Card',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-card">
    <span class="nc-card__content">content</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Aufklappbare Card via details/summary' },
    },
  },
};

export const ActionCard = {
  name: 'Action Card',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-card">
    <span class="nc-card__content">content</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Card mit Footer-Bereich fuer Aktionen' },
    },
  },
};

export const StatusCards = {
  name: 'Status Cards',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-card">
    <span class="nc-card__content">content</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Alle 4 Status-Level als linker Rand-Indikator' },
    },
  },
};

export const PreviewCards = {
  name: 'Preview Cards',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-card">
    <span class="nc-card__content">content</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Media-fokussierte Cards fuer Events, Stories' },
    },
  },
};

export const SummaryCards = {
  name: 'Summary Cards',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-card">
    <span class="nc-card__content">content</span>
  </div>
  <div class="nc-card">
    <span class="nc-card__content">content</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Personenkarten und Standorte mit rundem Avatar' },
    },
  },
};
