// ============================================================
// News — Auto-generated from news-recipe.json
// Version: 1.2.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Organisms/News',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**News** v1.2.0 (stable)

Website: node--news--full.html.twig rendert <article class="node node--type-news nc-news"> mit Hero (<header>), Textbereich und optionaler Fusszeile; Werte aus content.field_* und neo_fe_preprocess_node (news.hero_bg_url, focus_x/_y, zoom, hero_width, content_width).


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
    <code style="font:inherit;font-family:ui-monospace,monospace">data/markup/news.html</code>.
  </p>
  <div class="nc-news">
    <span class="nc-news__hero">hero</span>
    <span class="nc-news__hero-inner">hero-inner</span>
    <span class="nc-news__eyebrow">eyebrow</span>
    <span class="nc-news__title">title</span>
    <span class="nc-news__body">body</span>
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
    <code style="font:inherit;font-family:ui-monospace,monospace">data/markup/news.html</code>.
  </p>
  <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-news">
    <span class="nc-news__hero">hero</span>
    <span class="nc-news__hero-inner">hero-inner</span>
    <span class="nc-news__eyebrow">eyebrow</span>
    <span class="nc-news__title">title</span>
    <span class="nc-news__body">body</span>
  </div>
</div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'news wie auf der Website mit Titelbild: Hero mit --has-media und neo-dark-theme, Verlauf, Dachzeile, Titel, Zusammenfassung, Knopf; Textbereich und Fusszeile.' },
    },
  },
};

export const OhneBild = {
  name: 'Ohne Bild',
  render: () => `<div style="border:1px dashed #92500a;border-radius:4px;padding:12px">
  <p style="margin:0 0 10px;font:600 12px/1.4 ui-monospace,monospace;letter-spacing:.08em;text-transform:uppercase;color:#92500a">
    Kein echtes Markup hinterlegt
  </p>
  <p style="margin:0 0 12px;font:400 13px/1.5 system-ui,sans-serif;color:#595c59;max-width:62ch">
    Was hier steht, ist aus der Anatomie des Recipes abgeleitet — die Slots als
    Geschwister, ohne Schachtelung und ohne Zustaende. So sieht das Bauteil
    nicht aus. Echtes Markup gehoert nach
    <code style="font:inherit;font-family:ui-monospace,monospace">data/markup/news.html</code>.
  </p>
  <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-news">
    <span class="nc-news__hero">hero</span>
    <span class="nc-news__hero-inner">hero-inner</span>
    <span class="nc-news__eyebrow">eyebrow</span>
    <span class="nc-news__title">title</span>
    <span class="nc-news__body">body</span>
  </div>
</div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Hero ohne Titelbild und Verlauf — folgt dem Seitenthema (background-base).' },
    },
  },
};
