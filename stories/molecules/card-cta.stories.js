// ============================================================
// CardCta — Auto-generated from card-cta-recipe.json
// Version: 1.0.0 | Status: draft
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Molecules/CardCta',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**CardCta** v1.0.0 (draft)

Aus dem Drupal-Theme uebernommen; Markup siehe templates/block/ im Theme neo_fe.


`,
      },
    },
    status: { type: 'draft' },
  },
  argTypes: {},
};

export const Default = {
  name: 'Standard',
  render: () => `<!-- @quelle: geerntet von /musterseite-bauteile -->`,
};

export const Standard = {
  name: 'Standard',
  render: () => `<div class="nc-card-cta" data-theme="dark">
<img class="nc-card-cta__media" src="https://picsum.photos/id/1048/1200/800" alt="" loading="lazy" decoding="async">
<div class="nc-card-cta__overlay">
</div>
<div class="nc-card-cta__content">
<h3 class="nc-card-cta__title" style="max-width: 60%;">Flexibel skalierbar</h3>
<div class="nc-card-cta__actions">
<a href="/preise" class="nc-button nc-button--primary nc-button--md" aria-label="Preise ansehen – Flexibel skalierbar" style="--nc-button-primary-bg: var(--fnd-color-always-light); --nc-button-primary-color: var(--fnd-color-always-dark);">Preise ansehen</a>
</div>
</div>
</div>`,
};
