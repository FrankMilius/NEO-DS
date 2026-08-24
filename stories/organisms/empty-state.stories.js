// ============================================================
// EmptyState — Auto-generated from empty-state-recipe.json
// Version: 1.0.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Organisms/EmptyState',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**EmptyState** v1.0.0 (stable)

Flex-Column-Container, zentriert (align-items + text-align: center).


`,
      },
    },
    status: { type: 'stable' },
  },
  argTypes: {},
};

export const Default = {
  name: 'Standard',
  render: () => `<div class="nc-empty-state">
<div class="nc-empty-state__icon" aria-hidden="true">
<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
<circle cx="10" cy="10" r="7">
</circle>
<line x1="21" y1="21" x2="15" y2="15">
</line>
</svg>
</div>
<h3 class="nc-empty-state__title">Keine Ergebnisse gefunden</h3>
<p class="nc-empty-state__description">Versuche es mit anderen Suchbegriffen oder passe deine Filter an.</p>
<div class="nc-empty-state__actions">
<button class="nc-button nc-button--sm">Filter zurücksetzen</button>
</div>
</div>`,
};
