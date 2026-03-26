// ============================================================
// Question — Auto-generated from question-recipe.json
// Version: 1.0.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Organisms/Question',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**Question** v1.0.0 (stable)

Marquee-Lauftext: alternierend links/rechts scrollend (marquee/marquee-reverse).


`,
      },
    },
    status: { type: 'stable' },
  },
  argTypes: {},
};

export const Default = {
  render: () => `<div class="question">
    <span class="question-text-row">text-row</span>
    <span class="question-text">question</span>
  </div>`,
};

export const QuestionVariants = {
  name: 'Question Variants',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  
</div>`,
  parameters: {
    docs: {
      description: { story: 'Default vs With-Text' },
    },
  },
};
