// ============================================================
// ChapterNav — Auto-generated from chapter-nav-recipe.json
// Version: 1.0.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Organisms/ChapterNav',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**ChapterNav** v1.0.0 (stable)

Kapitelleiste und Verzeichnis fuer lange Inhaltsseiten. Zwei Bauteile, die zusammengehoeren: Das Verzeichnis traegt ohne Skript und im Druck, die Leiste traegt beim Scrollen.


`,
      },
    },
    status: { type: 'stable' },
  },
  argTypes: {},
};

export const Default = {
  name: 'Standard',
  render: () => `<nav class="nc-chapternav" data-neo-chapternav="" aria-label="Kapitel dieser Seite" data-cn-init="1">
<div class="nc-container nc-chapternav__inner">
<a class="nc-chapternav__link" href="#kommunikation" data-chapter="kommunikation" aria-current="true">Kommunikation</a>
<a class="nc-chapternav__link" href="#wissen" data-chapter="wissen">Wissen</a>
<a class="nc-chapternav__link" href="#events" data-chapter="events">Events</a>
<a class="nc-chapternav__link" href="#vernetzung" data-chapter="vernetzung">Vernetzung</a>
<a class="nc-chapternav__link" href="#anwendungen" data-chapter="anwendungen">Anwendungen</a>
</div>
</nav>`,
};
