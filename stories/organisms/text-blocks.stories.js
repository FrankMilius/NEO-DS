// ============================================================
// TextBlocks — Auto-generated from text-blocks-recipe.json
// Version: 1.0.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Organisms/TextBlocks',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**TextBlocks** v1.0.0 (stable)

Text-Primitives: Section-Title (.nc-section-title), Eyebrow (.nc-eyebrow), Lead (.nc-lead).


`,
      },
    },
    status: { type: 'stable' },
  },
  argTypes: {},
};

export const Default = {
  render: () => `<div class="nc-section-title">
    text-blocks
  </div>`,
};

export const TextBlockVariants = {
  name: 'Text Block Variants',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  
</div>`,
  parameters: {
    docs: {
      description: { story: 'Section Title, Eyebrow, Lead' },
    },
  },
};
