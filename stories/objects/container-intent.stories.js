// ============================================================
// ContainerIntent — Auto-generated from container-intent-recipe.json
// Version: 1.1.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Objects/ContainerIntent',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**ContainerIntent** v1.1.0 (stable)

Intent-Container: Breiten nach Inhaltsabsicht (prose 72ch, narrow 768, content 1090, wide 1290, xwide 1536, full 100 %) aus den Foundation-Tokens --fnd-layout-container-*; :root stellt sie als --container-* bereit. Die --fnd-layout-container-* stehen in design-tokens.css (auf der Website eine eigene Datei vor styles.css); styles.css traegt dieselben Werte als Rueckfall in den Aliasen.


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
    <code style="font:inherit;font-family:ui-monospace,monospace">data/markup/container-intent.html</code>.
  </p>
  <div class="container">
    container-intent
  </div>
</div>`,
};

export const Breiten = {
  name: 'Breiten',
  render: () => `<div style="border:1px dashed #92500a;border-radius:4px;padding:12px">
  <p style="margin:0 0 10px;font:600 12px/1.4 ui-monospace,monospace;letter-spacing:.08em;text-transform:uppercase;color:#92500a">
    Kein echtes Markup hinterlegt
  </p>
  <p style="margin:0 0 12px;font:400 13px/1.5 system-ui,sans-serif;color:#595c59;max-width:62ch">
    Was hier steht, ist aus der Anatomie des Recipes abgeleitet — die Slots als
    Geschwister, ohne Schachtelung und ohne Zustaende. So sieht das Bauteil
    nicht aus. Echtes Markup gehoert nach
    <code style="font:inherit;font-family:ui-monospace,monospace">data/markup/container-intent.html</code>.
  </p>
  <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  
</div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Alle sechs Breiten auf einer Desktop-Seite (1600 px, Massstab 1:2,7).' },
    },
  },
};

export const WieaufderWebsite = {
  name: 'Wie auf der Website',
  render: () => `<div style="border:1px dashed #92500a;border-radius:4px;padding:12px">
  <p style="margin:0 0 10px;font:600 12px/1.4 ui-monospace,monospace;letter-spacing:.08em;text-transform:uppercase;color:#92500a">
    Kein echtes Markup hinterlegt
  </p>
  <p style="margin:0 0 12px;font:400 13px/1.5 system-ui,sans-serif;color:#595c59;max-width:62ch">
    Was hier steht, ist aus der Anatomie des Recipes abgeleitet — die Slots als
    Geschwister, ohne Schachtelung und ohne Zustaende. So sieht das Bauteil
    nicht aus. Echtes Markup gehoert nach
    <code style="font:inherit;font-family:ui-monospace,monospace">data/markup/container-intent.html</code>.
  </p>
  <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="container">
    container-intent
  </div>
  <div class="container">
    container-intent
  </div>
</div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Section-Layout der Website: .nc-section > .container.container--content (Vorgabe) und --wide.' },
    },
  },
};
