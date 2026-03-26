// ============================================================
// Item — Auto-generated from item-recipe.json
// Version: 2.0.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Organisms/Item',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**Item** v2.0.0 (stable)

Flex-Layout: align-items center (oder flex-start via --align-start), gap spacing-03.


`,
      },
    },
    status: { type: 'stable' },
  },
  argTypes: {},
};

export const Default = {
  render: () => `<div class="nc-item">
    <span class="nc-item__content">content</span>
    <span class="nc-item__title">title</span>
  </div>`,
};

export const Variants = {
  name: 'Variants',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  
</div>`,
  parameters: {
    docs: {
      description: { story: 'Default, Outline, Muted — mit Icon-Media und Description' },
    },
  },
};

export const Sizes = {
  name: 'Sizes',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-item">
    <span class="nc-item__content">content</span>
    <span class="nc-item__title">title</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Default, SM, XS — Groessenskala' },
    },
  },
};

export const Density = {
  name: 'Density',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-item">
    <span class="nc-item__content">content</span>
    <span class="nc-item__title">title</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Compact, Default, Loose — Informationsdichte' },
    },
  },
};

export const MediaTypes = {
  name: 'Media Types',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-item">
    <span class="nc-item__content">content</span>
    <span class="nc-item__title">title</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'None, Icon, Image, Avatar, Thumbnail' },
    },
  },
};

export const InteractiveStates = {
  name: 'Interactive States',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-item">
    <span class="nc-item__content">content</span>
    <span class="nc-item__title">title</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Default, Hover (Accent-Border), Active, Selected, Disabled' },
    },
  },
};

export const Alignment = {
  name: 'Alignment',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-item">
    <span class="nc-item__content">content</span>
    <span class="nc-item__title">title</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Center vs Start — vertikale Ausrichtung bei langem Content' },
    },
  },
};

export const GroupedOutline = {
  name: 'Grouped (Outline)',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-item">
    <span class="nc-item__content">content</span>
    <span class="nc-item__title">title</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'nc-item-group--outline: zusammenhaengende Liste mit Border' },
    },
  },
};

export const SearchResults = {
  name: 'Search Results',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-item">
    <span class="nc-item__content">content</span>
    <span class="nc-item__title">title</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Item mit Highlight-Slot fuer Suchvorschlaege' },
    },
  },
};
