// ============================================================
// InputGroup — Auto-generated from input-group-recipe.json
// Version: 2.0.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Molecules/InputGroup',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**InputGroup** v2.0.0 (stable)

Flex-Row Container: display:flex, align-items:center. Prepend | Input | Append.


`,
      },
    },
    status: { type: 'stable' },
  },
  argTypes: {},
};

export const Default = {
  render: () => `<div class="nc-input-group">
    <span class="nc-input">input</span>
  </div>`,
};

export const AllStates = {
  name: 'All States',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-input-group">
    <span class="nc-input">input</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Input-Group in allen Zustaenden: default, hover, focus, disabled, readonly' },
    },
  },
};

export const ContentVariants = {
  name: 'Content Variants',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-input-group">
    <span class="nc-input">input</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Prepend-Only, Append-Only, Both' },
    },
  },
};

export const SizeVariants = {
  name: 'Size Variants',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  
</div>`,
  parameters: {
    docs: {
      description: { story: 'SM, MD, LG' },
    },
  },
};

export const ValidationStates = {
  name: 'Validation States',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-input-group">
    <span class="nc-input">input</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'None vs Error vs Success' },
    },
  },
};

export const URLInput = {
  name: 'URL Input',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-input-group">
    <span class="nc-input">input</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Typisches Pattern: \'https://\' Prefix + URL-Eingabe' },
    },
  },
};

export const SearchwithButton = {
  name: 'Search with Button',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-input-group">
    <span class="nc-input">input</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Suchfeld mit angehaengtem Button — Button bekommt inner-radius (0)' },
    },
  },
};

export const ButtoninAddon = {
  name: 'Button in Addon',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-input-group">
    <span class="nc-input">input</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Button-Addon mit inner-radius Reset — Prepend-Button + Input + Append-Button' },
    },
  },
};

export const ReadonlywithCopyButton = {
  name: 'Readonly with Copy Button',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-input-group">
    <span class="nc-input">input</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Readonly Input mit Copy-Button im Append — typisches API-Key Pattern' },
    },
  },
};
