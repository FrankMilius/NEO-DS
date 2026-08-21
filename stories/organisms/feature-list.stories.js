// ============================================================
// FeatureList — Auto-generated from feature-list-recipe.json
// Version: 1.0.0 | Status: draft
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Organisms/FeatureList',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**FeatureList** v1.0.0 (draft)

Aus dem Drupal-Theme uebernommen; Markup siehe templates/block/ im Theme neo_fe.


`,
      },
    },
    status: { type: 'draft' },
  },
  argTypes: {
    "unknown": {
      "control": {
        "type": "select"
      },
      "options": [
        "0",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6"
      ],
      "description": ""
    }
  },
};

export const Default = {
  render: () => `<div style="border:1px dashed #92500a;border-radius:4px;padding:12px">
  <p style="margin:0 0 10px;font:600 12px/1.4 ui-monospace,monospace;letter-spacing:.08em;text-transform:uppercase;color:#92500a">
    Kein echtes Markup hinterlegt
  </p>
  <p style="margin:0 0 12px;font:400 13px/1.5 system-ui,sans-serif;color:#595c59;max-width:62ch">
    Was hier steht, ist aus der Anatomie des Recipes abgeleitet — die Slots als
    Geschwister, ohne Schachtelung und ohne Zustaende. So sieht das Bauteil
    nicht aus. Echtes Markup gehoert nach
    <code style="font:inherit;font-family:ui-monospace,monospace">data/markup/feature-list.html</code>.
  </p>
  <div class="nc-feature-list">
    <span class="nc-feature-list__content">content</span>
    <span class="nc-feature-list__cta">cta</span>
    <span class="nc-feature-list__icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/></svg></span>
    <span class="nc-feature-list__inner">inner</span>
    <span class="nc-feature-list__item">item</span>
    <span class="nc-feature-list__item-text">item-text</span>
  </div>
</div>`,
};

export const Standard = {
  name: 'Standard',
  render: () => `<div style="border:1px dashed #92500a;border-radius:4px;padding:12px">
  <p style="margin:0 0 10px;font:600 12px/1.4 ui-monospace,monospace;letter-spacing:.08em;text-transform:uppercase;color:#92500a">
    Kein echtes Markup hinterlegt
  </p>
  <p style="margin:0 0 12px;font:400 13px/1.5 system-ui,sans-serif;color:#595c59;max-width:62ch">
    Was hier steht, ist aus der Anatomie des Recipes abgeleitet — die Slots als
    Geschwister, ohne Schachtelung und ohne Zustaende. So sieht das Bauteil
    nicht aus. Echtes Markup gehoert nach
    <code style="font:inherit;font-family:ui-monospace,monospace">data/markup/feature-list.html</code>.
  </p>
  <div class="nc-feature-list">
    <span class="nc-feature-list__content">content</span>
    <span class="nc-feature-list__cta">cta</span>
    <span class="nc-feature-list__icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/></svg></span>
    <span class="nc-feature-list__inner">inner</span>
    <span class="nc-feature-list__item">item</span>
    <span class="nc-feature-list__item-text">item-text</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'feature-list wie auf der Website' },
    },
  },
};
