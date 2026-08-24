// ============================================================
// Progress — Auto-generated from progress-recipe.json
// Version: 1.0.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Organisms/Progress',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**Progress** v1.0.0 (stable)

Progress ist ein <div class='nc-progress' role='progressbar' aria-valuenow='X' aria-valuemin='0' aria-valuemax='100'>.


`,
      },
    },
    status: { type: 'stable' },
  },
  argTypes: {},
};

export const Default = {
  name: 'Standard',
  render: () => `<div class="nc-progress nc-progress--indeterminate" role="progressbar" aria-label="Wird geladen">
<div class="nc-progress__fill">
</div>
</div>`,
};
