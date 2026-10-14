// ============================================================
// ReferencePage — Auto-generated from reference-page-recipe.json
// Version: 1.3.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Organisms/ReferencePage',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**ReferencePage** v1.3.0 (stable)

Inhaltstyp reference_page: <article> > fuehrende Vollbreite-Sections (refpage_above, z. B. Hero) > <div class="nc-refpage nc-container"> > nav.nc-refpage__toc + .nc-refpage__content. Ohne Verzeichniseintraege rendert Drupal kein .nc-refpage, sondern nur den Inhalt.


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
    <code style="font:inherit;font-family:ui-monospace,monospace">data/markup/reference-page.html</code>.
  </p>
  <div class="nc-refpage">
    <span class="nc-refpage__toc">toc</span>
    <span class="nc-refpage__toc-disclosure">toc-disclosure</span>
    <span class="nc-refpage__toc-summary">toc-summary</span>
    <span class="nc-refpage__toc-chevron">toc-chevron</span>
    <span class="nc-refpage__toc-title">toc-title</span>
    <span class="nc-refpage__toc-list">toc-list</span>
    <span class="nc-refpage__toc-link">toc-link</span>
    <span class="nc-refpage__content">content</span>
  </div>
</div>`,
};

export const Referenzseite = {
  name: 'Referenzseite',
  render: () => `<div style="border:1px dashed #92500a;border-radius:4px;padding:12px">
  <p style="margin:0 0 10px;font:600 12px/1.4 ui-monospace,monospace;letter-spacing:.08em;text-transform:uppercase;color:#92500a">
    Kein echtes Markup hinterlegt
  </p>
  <p style="margin:0 0 12px;font:400 13px/1.5 system-ui,sans-serif;color:#595c59;max-width:62ch">
    Was hier steht, ist aus der Anatomie des Recipes abgeleitet — die Slots als
    Geschwister, ohne Schachtelung und ohne Zustaende. So sieht das Bauteil
    nicht aus. Echtes Markup gehoert nach
    <code style="font:inherit;font-family:ui-monospace,monospace">data/markup/reference-page.html</code>.
  </p>
  <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-refpage">
    <span class="nc-refpage__toc">toc</span>
    <span class="nc-refpage__toc-disclosure">toc-disclosure</span>
    <span class="nc-refpage__toc-summary">toc-summary</span>
    <span class="nc-refpage__toc-chevron">toc-chevron</span>
    <span class="nc-refpage__toc-title">toc-title</span>
    <span class="nc-refpage__toc-list">toc-list</span>
    <span class="nc-refpage__toc-link">toc-link</span>
    <span class="nc-refpage__content">content</span>
  </div>
</div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Verzeichnis mit Unterpunkten (erster Eintrag aktuell) neben zwei Dokumentations-Abschnitten.' },
    },
  },
};

export const OhneUnterpunkte = {
  name: 'Ohne Unterpunkte',
  render: () => `<div style="border:1px dashed #92500a;border-radius:4px;padding:12px">
  <p style="margin:0 0 10px;font:600 12px/1.4 ui-monospace,monospace;letter-spacing:.08em;text-transform:uppercase;color:#92500a">
    Kein echtes Markup hinterlegt
  </p>
  <p style="margin:0 0 12px;font:400 13px/1.5 system-ui,sans-serif;color:#595c59;max-width:62ch">
    Was hier steht, ist aus der Anatomie des Recipes abgeleitet — die Slots als
    Geschwister, ohne Schachtelung und ohne Zustaende. So sieht das Bauteil
    nicht aus. Echtes Markup gehoert nach
    <code style="font:inherit;font-family:ui-monospace,monospace">data/markup/reference-page.html</code>.
  </p>
  <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-refpage">
    <span class="nc-refpage__toc">toc</span>
    <span class="nc-refpage__toc-disclosure">toc-disclosure</span>
    <span class="nc-refpage__toc-summary">toc-summary</span>
    <span class="nc-refpage__toc-chevron">toc-chevron</span>
    <span class="nc-refpage__toc-title">toc-title</span>
    <span class="nc-refpage__toc-list">toc-list</span>
    <span class="nc-refpage__toc-link">toc-link</span>
    <span class="nc-refpage__content">content</span>
  </div>
</div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Flaches Verzeichnis (nur die Kapitel), dieselben Abschnitte.' },
    },
  },
};
