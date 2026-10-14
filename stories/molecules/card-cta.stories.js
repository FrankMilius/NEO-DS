// ============================================================
// CardCta — Auto-generated from card-cta-recipe.json
// Version: 1.5.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Molecules/CardCta',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**CardCta** v1.5.0 (stable)

Das Twig (block--block-content--neo-card-grid-cta.html.twig, aufbereitet in includes/neo_card_grid_cta.inc) rendert die Karten aus dem JSON-Feld field_cgc_cards in das Raster .nc-card-grid-cta (Recipe card-grid-cta) — <div class="nc-card-cta" data-theme="dark|light"> mit __media, __overlay, __content > __title + __actions.


`,
      },
    },
    status: { type: 'stable' },
  },
  argTypes: {},
};

export const Default = {
  name: 'Standard',
  render: () => `<div class="nc-card-cta" data-theme="dark">
<img class="nc-card-cta__media" src="https://picsum.photos/id/1048/1200/800" alt="" loading="lazy" decoding="async">
<div class="nc-card-cta__overlay">
</div>
<div class="nc-card-cta__content">
<h3 class="nc-card-cta__title" style="max-width: 60%;">Flexibel skalierbar</h3>
<div class="nc-card-cta__actions">
<a href="/preise" class="nc-button nc-button--primary" aria-label="Preise ansehen – Flexibel skalierbar" style="--nc-button-primary-bg: var(--fnd-color-always-light); --nc-button-primary-color: var(--fnd-color-always-dark);">Preise ansehen</a>
</div>
</div>
</div>`,
};
