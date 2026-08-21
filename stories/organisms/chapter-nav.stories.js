// ============================================================
// Chapternav — Auto-generated from chapternav-recipe.json
// Version: 1.0.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Organisms/Chapternav',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**Chapternav** v1.0.0 (stable)

Kapitelleiste und Verzeichnis fuer lange Inhaltsseiten. Zwei Bauteile, die zusammengehoeren: Das Verzeichnis traegt ohne Skript und im Druck, die Leiste traegt beim Scrollen.


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
    <code style="font:inherit;font-family:ui-monospace,monospace">data/markup/chapternav.html</code>.
  </p>
  <div class="nc-chapternav">
    <span class="nc-chapternav__inner">Leiste, quer scrollbar</span>
    <span class="nc-chapternav__link">Kapitelverweis</span>
    <span class="nc-chapter-anchor">Sprungziel am Block</span>
  </div>
</div>`,
};
