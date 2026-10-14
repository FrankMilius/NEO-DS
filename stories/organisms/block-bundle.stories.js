// ============================================================
// BlockBundle — Auto-generated from block-bundle-recipe.json
// Version: 1.1.1 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Organisms/BlockBundle',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**BlockBundle** v1.1.1 (stable)

Website-Block neo_block_bundle: <section class="nc-section nc-block-bundle"> mit optionalem Kopf (.nc-container.nc-block-bundle__header) und optional den vorgerenderten Kind-Bloecken in __items. block_content- und inline_block-Template sind Volltext-Kopien.


`,
      },
    },
    status: { type: 'stable' },
  },
  argTypes: {},
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
    <code style="font:inherit;font-family:ui-monospace,monospace">data/markup/block-bundle.html</code>.
  </p>
  <div class="nc-block-bundle">
    block-bundle
  </div>
</div>`,
};

export const MitKopf = {
  name: 'Mit Kopf',
  render: () => `<div style="border:1px dashed #92500a;border-radius:4px;padding:12px">
  <p style="margin:0 0 10px;font:600 12px/1.4 ui-monospace,monospace;letter-spacing:.08em;text-transform:uppercase;color:#92500a">
    Kein echtes Markup hinterlegt
  </p>
  <p style="margin:0 0 12px;font:400 13px/1.5 system-ui,sans-serif;color:#595c59;max-width:62ch">
    Was hier steht, ist aus der Anatomie des Recipes abgeleitet — die Slots als
    Geschwister, ohne Schachtelung und ohne Zustaende. So sieht das Bauteil
    nicht aus. Echtes Markup gehoert nach
    <code style="font:inherit;font-family:ui-monospace,monospace">data/markup/block-bundle.html</code>.
  </p>
  <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-block-bundle">
    block-bundle
  </div>
</div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Kicker, Ueberschrift, Lead und Text ueber zwei gebuendelten Bloecken.' },
    },
  },
};

export const OhneKopf = {
  name: 'Ohne Kopf',
  render: () => `<div style="border:1px dashed #92500a;border-radius:4px;padding:12px">
  <p style="margin:0 0 10px;font:600 12px/1.4 ui-monospace,monospace;letter-spacing:.08em;text-transform:uppercase;color:#92500a">
    Kein echtes Markup hinterlegt
  </p>
  <p style="margin:0 0 12px;font:400 13px/1.5 system-ui,sans-serif;color:#595c59;max-width:62ch">
    Was hier steht, ist aus der Anatomie des Recipes abgeleitet — die Slots als
    Geschwister, ohne Schachtelung und ohne Zustaende. So sieht das Bauteil
    nicht aus. Echtes Markup gehoert nach
    <code style="font:inherit;font-family:ui-monospace,monospace">data/markup/block-bundle.html</code>.
  </p>
  <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-block-bundle">
    block-bundle
  </div>
</div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Nur die gebuendelten Bloecke (Kopf-Felder leer).' },
    },
  },
};

export const NurKopf = {
  name: 'Nur Kopf',
  render: () => `<div style="border:1px dashed #92500a;border-radius:4px;padding:12px">
  <p style="margin:0 0 10px;font:600 12px/1.4 ui-monospace,monospace;letter-spacing:.08em;text-transform:uppercase;color:#92500a">
    Kein echtes Markup hinterlegt
  </p>
  <p style="margin:0 0 12px;font:400 13px/1.5 system-ui,sans-serif;color:#595c59;max-width:62ch">
    Was hier steht, ist aus der Anatomie des Recipes abgeleitet — die Slots als
    Geschwister, ohne Schachtelung und ohne Zustaende. So sieht das Bauteil
    nicht aus. Echtes Markup gehoert nach
    <code style="font:inherit;font-family:ui-monospace,monospace">data/markup/block-bundle.html</code>.
  </p>
  <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-block-bundle">
    block-bundle
  </div>
</div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Ohne referenzierte Bloecke — so nutzt die Website das Buendel als Kapitelueberschrift (node 49).' },
    },
  },
};
