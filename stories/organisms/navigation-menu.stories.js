// ============================================================
// NavigationMenu — Auto-generated from navigation-menu-recipe.json
// Version: 2.0.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Organisms/NavigationMenu',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**NavigationMenu** v2.0.0 (stable)

Radix-UI Pattern: nav > ul > li > trigger/content.


`,
      },
    },
    status: { type: 'stable' },
  },
  argTypes: {},
};

export const Default = {
  render: () => `<div class="nc-navigation-menu">
    <span class="nc-navigation-menu__list">list</span>
    <span class="nc-navigation-menu__item">item</span>
  </div>`,
};

export const DefaultDropdown = {
  name: 'Default Dropdown',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-navigation-menu">
    <span class="nc-navigation-menu__list">list</span>
    <span class="nc-navigation-menu__item">item</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Einfaches Dropdown mit Links-Liste' },
    },
  },
};

export const TwoColumnwithCallout = {
  name: 'Two-Column with Callout',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-navigation-menu">
    <span class="nc-navigation-menu__list">list</span>
    <span class="nc-navigation-menu__item">item</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Zwei Spalten: Callout links, Links rechts' },
    },
  },
};

export const MegaMenu = {
  name: 'Mega Menu',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-navigation-menu">
    <span class="nc-navigation-menu__list">list</span>
    <span class="nc-navigation-menu__item">item</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Grid-Layout mit Featured Item und mehreren Spalten' },
    },
  },
};

export const IndicatorStates = {
  name: 'Indicator States',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-navigation-menu">
    <span class="nc-navigation-menu__list">list</span>
    <span class="nc-navigation-menu__item">item</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Indicator-Unterstrich: Default, Hover, Active' },
    },
  },
};

export const FullHeaderComposition = {
  name: 'Full Header Composition',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-navigation-menu">
    <span class="nc-navigation-menu__list">list</span>
    <span class="nc-navigation-menu__item">item</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Navigation + NavigationMenu + Brand + Actions — komplette Shell' },
    },
  },
};
