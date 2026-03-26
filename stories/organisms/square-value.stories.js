// ============================================================
// SquareValue — Auto-generated from square-value-recipe.json
// Version: 1.0.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Organisms/SquareValue',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**SquareValue** v1.0.0 (stable)

3D-Wuerfel: transform-style preserve-3d, rotateX/rotateY fuer Flaechen.


`,
      },
    },
    status: { type: 'stable' },
  },
  argTypes: {},
};

export const Default = {
  render: () => `<div class="square-value">
    <span class="square-value-wrapper">wrapper</span>
    <span class="square-wrapper">square-wrapper</span>
    <span class="square-block">square-block</span>
  </div>`,
};

export const Orientations = {
  name: 'Orientations',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  
</div>`,
  parameters: {
    docs: {
      description: { story: 'Horizontal vs Vertical Varianten' },
    },
  },
};

export const ContentTypes = {
  name: 'Content Types',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="square-value">
    <span class="square-value-wrapper">wrapper</span>
    <span class="square-wrapper">square-wrapper</span>
    <span class="square-block">square-block</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Text, Bild, Video' },
    },
  },
};
