// ============================================================
// Icon — Auto-generated from icon-recipe.json
// Version: 1.0.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Atoms/Icon',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**Icon** v1.0.0 (stable)

Icon ist ein <span class='icon'> mit inline SVG als Kind-Element.


`,
      },
    },
    status: { type: 'stable' },
  },
  argTypes: {},
};

export const Default = {
  render: () => `<div class="icon">
    icon
  </div>`,
};

export const SizeScaleXSto2XL = {
  name: 'Size Scale — XS to 2XL',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  
</div>`,
  parameters: {
    docs: {
      description: { story: 'Alle 6 Groessen im Vergleich' },
    },
  },
};

export const ColorVariants = {
  name: 'Color Variants',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="icon">
    icon
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Alle 5 semantischen Farben in MD-Groesse' },
    },
  },
};

export const InverseonDarkBackground = {
  name: 'Inverse on Dark Background',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="icon">
    icon
  </div>
  <div class="icon">
    icon
  </div>
  <div class="icon">
    icon
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Inverse-Farbe auf dunklem Hintergrund' },
    },
  },
};

export const InteractiveIconStates = {
  name: 'Interactive Icon States',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="icon">
    icon
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Interactive Icon mit Touch-Target, Hover und Focus' },
    },
  },
};

export const InteractiveAllSizes = {
  name: 'Interactive — All Sizes',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  
</div>`,
  parameters: {
    docs: {
      description: { story: 'Interactive Icons in verschiedenen Groessen — Touch-Target bleibt 44px' },
    },
  },
};

export const IconinText = {
  name: 'Icon in Text',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="icon">
    icon
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Icons inline neben Text-Elementen' },
    },
  },
};
