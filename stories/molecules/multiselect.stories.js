// ============================================================
// Multiselect — Auto-generated from multiselect-recipe.json
// Version: 1.2.0 | Status: draft
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Molecules/Multiselect',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**Multiselect** v1.2.0 (draft)

Feld-Wrapper: .nc-form-field.nc-multiselect (position relative) mit .nc-form-label, Knopf .nc-multiselect__trigger (aria-haspopup, aria-expanded) und Panel .nc-multiselect__panel (absolut unter dem Feld: inset-block-start calc(100% + spacing-01); neo-theme.js setzt die Lage zusaetzlich inline).


`,
      },
    },
    status: { type: 'draft' },
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
    <code style="font:inherit;font-family:ui-monospace,monospace">data/markup/multiselect.html</code>.
  </p>
  <div class="nc-multiselect">
    <span class="nc-multiselect__caret">caret</span>
    <span class="nc-multiselect__option">option</span>
    <span class="nc-multiselect__panel">panel</span>
    <span class="nc-multiselect__trigger">trigger</span>
    <span class="nc-multiselect__value">value</span>
    <span class="nc-multiselect__value--empty">value--empty</span>
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
    <code style="font:inherit;font-family:ui-monospace,monospace">data/markup/multiselect.html</code>.
  </p>
  <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-multiselect">
    <span class="nc-multiselect__caret">caret</span>
    <span class="nc-multiselect__option">option</span>
    <span class="nc-multiselect__panel">panel</span>
    <span class="nc-multiselect__trigger">trigger</span>
    <span class="nc-multiselect__value">value</span>
    <span class="nc-multiselect__value--empty">value--empty</span>
  </div>
</div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'multiselect wie auf der Website — mit Auswahl, geschlossen und geoeffnet' },
    },
  },
};

export const Zustände = {
  name: 'Zustände',
  render: () => `<div style="border:1px dashed #92500a;border-radius:4px;padding:12px">
  <p style="margin:0 0 10px;font:600 12px/1.4 ui-monospace,monospace;letter-spacing:.08em;text-transform:uppercase;color:#92500a">
    Kein echtes Markup hinterlegt
  </p>
  <p style="margin:0 0 12px;font:400 13px/1.5 system-ui,sans-serif;color:#595c59;max-width:62ch">
    Was hier steht, ist aus der Anatomie des Recipes abgeleitet — die Slots als
    Geschwister, ohne Schachtelung und ohne Zustaende. So sieht das Bauteil
    nicht aus. Echtes Markup gehoert nach
    <code style="font:inherit;font-family:ui-monospace,monospace">data/markup/multiselect.html</code>.
  </p>
  <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-multiselect">
    <span class="nc-multiselect__caret">caret</span>
    <span class="nc-multiselect__option">option</span>
    <span class="nc-multiselect__panel">panel</span>
    <span class="nc-multiselect__trigger">trigger</span>
    <span class="nc-multiselect__value">value</span>
    <span class="nc-multiselect__value--empty">value--empty</span>
  </div>
</div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Hover und Fokus am Knopf (nur echt), Fehler mit nc-form-field--invalid und Meldung' },
    },
  },
};

export const OhneAuswahl = {
  name: 'Ohne Auswahl',
  render: () => `<div style="border:1px dashed #92500a;border-radius:4px;padding:12px">
  <p style="margin:0 0 10px;font:600 12px/1.4 ui-monospace,monospace;letter-spacing:.08em;text-transform:uppercase;color:#92500a">
    Kein echtes Markup hinterlegt
  </p>
  <p style="margin:0 0 12px;font:400 13px/1.5 system-ui,sans-serif;color:#595c59;max-width:62ch">
    Was hier steht, ist aus der Anatomie des Recipes abgeleitet — die Slots als
    Geschwister, ohne Schachtelung und ohne Zustaende. So sieht das Bauteil
    nicht aus. Echtes Markup gehoert nach
    <code style="font:inherit;font-family:ui-monospace,monospace">data/markup/multiselect.html</code>.
  </p>
  <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-multiselect">
    <span class="nc-multiselect__caret">caret</span>
    <span class="nc-multiselect__option">option</span>
    <span class="nc-multiselect__panel">panel</span>
    <span class="nc-multiselect__trigger">trigger</span>
    <span class="nc-multiselect__value">value</span>
    <span class="nc-multiselect__value--empty">value--empty</span>
  </div>
</div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Platzhalter nc-multiselect__value--empty im Knopf, Panel ohne Haken' },
    },
  },
};
