// ============================================================
// Faq — Auto-generated from faq-recipe.json
// Version: 1.0.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Organisms/Faq',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**Faq** v1.0.0 (stable)

Grid-Container mit FAQ-Items. Item: border, radius-3xl, padding.


`,
      },
    },
    status: { type: 'stable' },
  },
  argTypes: {},
};

export const Default = {
  render: () => `<div class="nc-faq">
    <span class="nc-faq__item">item</span>
    <span class="nc-faq__question">question</span>
    <span class="nc-faq__answer">answer</span>
  </div>`,
};

export const FAQList = {
  name: 'FAQ List',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-faq">
    <span class="nc-faq__item">item</span>
    <span class="nc-faq__question">question</span>
    <span class="nc-faq__answer">answer</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'FAQ-Liste mit aufklappbaren Fragen' },
    },
  },
};
