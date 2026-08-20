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
  render: () => `<div class="nc-chapternav">
    <span class="nc-chapternav__inner">Leiste, quer scrollbar</span>
    <span class="nc-chapternav__link">Kapitelverweis</span>
    <span class="nc-chapter-anchor">Sprungziel am Block</span>
  </div>`,
};
