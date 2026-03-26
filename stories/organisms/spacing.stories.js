// ============================================================
// Spacing — Auto-generated from spacing-recipe.json
// Version: 1.0.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Organisms/Spacing',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**Spacing** v1.0.0 (stable)

Spacing ist kein gerendertes Element, sondern eine Foundation-Skala.


`,
      },
    },
    status: { type: 'stable' },
  },
  argTypes: {},
};

export const Default = {
  render: () => `<div class="fnd-spacing">
    spacing
  </div>`,
};

export const SemantischeRollen = {
  name: 'Semantische Rollen',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  
</div>`,
  parameters: {
    docs: {
      description: { story: 'Alle semantischen Spacing-Rollen und ihre Zuordnung zur Skala.' },
    },
  },
};
