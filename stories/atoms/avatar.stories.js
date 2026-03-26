// ============================================================
// Avatar — Auto-generated from avatar-recipe.json
// Version: 2.0.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Atoms/Avatar',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**Avatar** v2.0.0 (stable)

Image/Fallback-Pattern: Fallback (z-index:0) immer im DOM, Image (z-index:1) ueberdeckt bei Erfolg.


`,
      },
    },
    status: { type: 'stable' },
  },
  argTypes: {},
};

export const Default = {
  render: () => `<div class="nc-avatar">
    avatar
  </div>`,
};

export const AllSizesImage = {
  name: 'All Sizes — Image',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  
</div>`,
  parameters: {
    docs: {
      description: { story: 'Alle 5 Groessen mit Image-Content' },
    },
  },
};

export const ContentTypesMD = {
  name: 'Content Types — MD',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-avatar">
    avatar
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Image, Initialen, Icon-Fallback und Hash-Color im Vergleich' },
    },
  },
};

export const HashColorFallback = {
  name: 'Hash-Color Fallback',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-avatar">
    avatar
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Dynamische Hintergrundfarben basierend auf Name-Hash — visuell unterscheidbar in Listen' },
    },
  },
};

export const ShapeCirclevsSquareEntity = {
  name: 'Shape — Circle vs Square (Entity)',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  
</div>`,
  parameters: {
    docs: {
      description: { story: 'Person (rund) vs Entity (quadratisch) in allen Groessen' },
    },
  },
};

export const RingModifier = {
  name: 'Ring Modifier',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-avatar">
    avatar
  </div>
  <div class="nc-avatar">
    avatar
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Ring-Border via box-shadow fuer saubere Abgrenzung ohne Layout-Shift' },
    },
  },
};

export const BadgeStatusVariants = {
  name: 'Badge Status Variants',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-avatar">
    avatar
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Alle 5 Badge-Varianten inkl. Verified' },
    },
  },
};

export const BadgeSize = {
  name: 'Badge × Size',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-avatar">
    avatar
  </div>
  <div class="nc-avatar">
    avatar
  </div>
  <div class="nc-avatar">
    avatar
  </div>
  <div class="nc-avatar">
    avatar
  </div>
  <div class="nc-avatar">
    avatar
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Badge-Online in verschiedenen Groessen — Badge-Border-Width sichert Sichtbarkeit' },
    },
  },
};

export const InteractiveStates = {
  name: 'Interactive States',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-avatar">
    avatar
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Hover (scale + shadow), Active (scale down), Focus (ring), Disabled' },
    },
  },
};
