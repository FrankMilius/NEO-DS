// ============================================================
// FormBlock — Auto-generated from form-block-recipe.json
// Version: 1.0.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Organisms/FormBlock',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**FormBlock** v1.0.0 (stable)

4 Positionierungsvarianten: text-left, text-right, text-top, text-bottom.


`,
      },
    },
    status: { type: 'stable' },
  },
  argTypes: {},
};

export const Default = {
  render: () => `<div class="nc-form-block">
    <span class="nc-form-block__text">form-block</span>
    <span class="nc-form-block__form">form</span>
    <span class="nc-form-block__headline">headline</span>
  </div>`,
};

export const TextLinksDefault = {
  name: 'Text Links (Default)',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-form-block">
    <span class="nc-form-block__text">form-block</span>
    <span class="nc-form-block__form">form</span>
    <span class="nc-form-block__headline">headline</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: '' },
    },
  },
};

export const TextRechts = {
  name: 'Text Rechts',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-form-block">
    <span class="nc-form-block__text">form-block</span>
    <span class="nc-form-block__form">form</span>
    <span class="nc-form-block__headline">headline</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: '' },
    },
  },
};

export const Gestapelt = {
  name: 'Gestapelt',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-form-block">
    <span class="nc-form-block__text">form-block</span>
    <span class="nc-form-block__form">form</span>
    <span class="nc-form-block__headline">headline</span>
  </div>
  <div class="nc-form-block">
    <span class="nc-form-block__text">form-block</span>
    <span class="nc-form-block__form">form</span>
    <span class="nc-form-block__headline">headline</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: '' },
    },
  },
};
