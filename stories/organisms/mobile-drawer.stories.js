// ============================================================
// MobileDrawer — Auto-generated from mobile-drawer-recipe.json
// Version: 1.0.0 | Status: draft
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Organisms/MobileDrawer',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**MobileDrawer** v1.0.0 (draft)

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
        "1"
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
    <code style="font:inherit;font-family:ui-monospace,monospace">data/markup/mobile-drawer.html</code>.
  </p>
  <div class="nc-mobile-drawer">
    <span class="nc-mobile-drawer__backdrop">backdrop</span>
    <span class="nc-mobile-drawer__backdrop--visible">backdrop--visible</span>
    <span class="nc-mobile-drawer__close">close</span>
    <span class="nc-mobile-drawer__header">header</span>
    <span class="nc-mobile-drawer__link">link</span>
    <span class="nc-mobile-drawer__list">list</span>
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
    <code style="font:inherit;font-family:ui-monospace,monospace">data/markup/mobile-drawer.html</code>.
  </p>
  <div class="nc-mobile-drawer">
    <span class="nc-mobile-drawer__backdrop">backdrop</span>
    <span class="nc-mobile-drawer__backdrop--visible">backdrop--visible</span>
    <span class="nc-mobile-drawer__close">close</span>
    <span class="nc-mobile-drawer__header">header</span>
    <span class="nc-mobile-drawer__link">link</span>
    <span class="nc-mobile-drawer__list">list</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'mobile-drawer wie auf der Website' },
    },
  },
};
