// ============================================================
// Toolbar — Auto-generated from toolbar-recipe.json
// Version: 2.0.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Organisms/Toolbar',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**Toolbar** v2.0.0 (stable)

Root: role='toolbar', aria-label. Flex-Layout, flex-wrap, min-height 48px.


`,
      },
    },
    status: { type: 'stable' },
  },
  argTypes: {},
};

export const Default = {
  name: 'Standard',
  render: () => `<div class="nc-toolbar" role="toolbar" aria-label="Tabellen-Aktionen">
<div class="nc-toolbar__group">
<span class="nc-toolbar__label">3 ausgewählt</span>
</div>
<div class="nc-toolbar__separator" aria-hidden="true">
</div>
<div class="nc-toolbar__group">
<button class="nc-button nc-button--sm nc-button--secondary">Exportieren</button>
<button class="nc-button nc-button--sm nc-button--secondary">Archivieren</button>
</div>
<div class="nc-toolbar__spacer">
</div>
<div class="nc-toolbar__group">
<button class="nc-button nc-button--sm">Alle löschen</button>
</div>
</div>`,
};
