// ============================================================
// Search — Auto-generated from search-recipe.json
// Version: 3.0.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Organisms/Search',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**Search** v3.0.0 (stable)

Root: role='combobox', aria-haspopup='listbox', aria-expanded='true|false', data-state='closed|open'.


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
    <code style="font:inherit;font-family:ui-monospace,monospace">data/markup/search.html</code>.
  </p>
  <div class="nc-search">
    <span class="nc-search__input-wrapper">input-wrapper</span>
    <span class="nc-search__icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/></svg></span>
    <span class="nc-search__input">input</span>
    <span class="nc-search__results">results</span>
    <span class="nc-search__item">item</span>
    <span class="nc-search__item-label">item-label</span>
  </div>
</div>`,
};

export const DefaultSearch = {
  name: 'Default Search',
  render: () => `<div style="border:1px dashed #92500a;border-radius:4px;padding:12px">
  <p style="margin:0 0 10px;font:600 12px/1.4 ui-monospace,monospace;letter-spacing:.08em;text-transform:uppercase;color:#92500a">
    Kein echtes Markup hinterlegt
  </p>
  <p style="margin:0 0 12px;font:400 13px/1.5 system-ui,sans-serif;color:#595c59;max-width:62ch">
    Was hier steht, ist aus der Anatomie des Recipes abgeleitet — die Slots als
    Geschwister, ohne Schachtelung und ohne Zustaende. So sieht das Bauteil
    nicht aus. Echtes Markup gehoert nach
    <code style="font:inherit;font-family:ui-monospace,monospace">data/markup/search.html</code>.
  </p>
  <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-search">
    <span class="nc-search__input-wrapper">input-wrapper</span>
    <span class="nc-search__icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/></svg></span>
    <span class="nc-search__input">input</span>
    <span class="nc-search__results">results</span>
    <span class="nc-search__item">item</span>
    <span class="nc-search__item-label">item-label</span>
  </div>
</div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Standard-Suchfeld mit einfacher Ergebnisliste und Clear-Trigger' },
    },
  },
};

export const ScopedSearch = {
  name: 'Scoped Search',
  render: () => `<div style="border:1px dashed #92500a;border-radius:4px;padding:12px">
  <p style="margin:0 0 10px;font:600 12px/1.4 ui-monospace,monospace;letter-spacing:.08em;text-transform:uppercase;color:#92500a">
    Kein echtes Markup hinterlegt
  </p>
  <p style="margin:0 0 12px;font:400 13px/1.5 system-ui,sans-serif;color:#595c59;max-width:62ch">
    Was hier steht, ist aus der Anatomie des Recipes abgeleitet — die Slots als
    Geschwister, ohne Schachtelung und ohne Zustaende. So sieht das Bauteil
    nicht aus. Echtes Markup gehoert nach
    <code style="font:inherit;font-family:ui-monospace,monospace">data/markup/search.html</code>.
  </p>
  <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-search">
    <span class="nc-search__input-wrapper">input-wrapper</span>
    <span class="nc-search__icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/></svg></span>
    <span class="nc-search__input">input</span>
    <span class="nc-search__results">results</span>
    <span class="nc-search__item">item</span>
    <span class="nc-search__item-label">item-label</span>
  </div>
</div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Suchfeld mit Bereichsfilter (Scope-Trigger + Scope-Menu)' },
    },
  },
};

export const CommandPalette = {
  name: 'Command Palette',
  render: () => `<div style="border:1px dashed #92500a;border-radius:4px;padding:12px">
  <p style="margin:0 0 10px;font:600 12px/1.4 ui-monospace,monospace;letter-spacing:.08em;text-transform:uppercase;color:#92500a">
    Kein echtes Markup hinterlegt
  </p>
  <p style="margin:0 0 12px;font:400 13px/1.5 system-ui,sans-serif;color:#595c59;max-width:62ch">
    Was hier steht, ist aus der Anatomie des Recipes abgeleitet — die Slots als
    Geschwister, ohne Schachtelung und ohne Zustaende. So sieht das Bauteil
    nicht aus. Echtes Markup gehoert nach
    <code style="font:inherit;font-family:ui-monospace,monospace">data/markup/search.html</code>.
  </p>
  <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-search">
    <span class="nc-search__input-wrapper">input-wrapper</span>
    <span class="nc-search__icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/></svg></span>
    <span class="nc-search__input">input</span>
    <span class="nc-search__results">results</span>
    <span class="nc-search__item">item</span>
    <span class="nc-search__item-label">item-label</span>
  </div>
</div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Modales Overlay (Cmd+K) — zentriert, grouped, mit Backdrop' },
    },
  },
};

export const MinimalHeader = {
  name: 'Minimal (Header)',
  render: () => `<div style="border:1px dashed #92500a;border-radius:4px;padding:12px">
  <p style="margin:0 0 10px;font:600 12px/1.4 ui-monospace,monospace;letter-spacing:.08em;text-transform:uppercase;color:#92500a">
    Kein echtes Markup hinterlegt
  </p>
  <p style="margin:0 0 12px;font:400 13px/1.5 system-ui,sans-serif;color:#595c59;max-width:62ch">
    Was hier steht, ist aus der Anatomie des Recipes abgeleitet — die Slots als
    Geschwister, ohne Schachtelung und ohne Zustaende. So sieht das Bauteil
    nicht aus. Echtes Markup gehoert nach
    <code style="font:inherit;font-family:ui-monospace,monospace">data/markup/search.html</code>.
  </p>
  <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-search">
    <span class="nc-search__input-wrapper">input-wrapper</span>
    <span class="nc-search__icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/></svg></span>
    <span class="nc-search__input">input</span>
    <span class="nc-search__results">results</span>
    <span class="nc-search__item">item</span>
    <span class="nc-search__item-label">item-label</span>
  </div>
</div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Transparenter Header-Search mit Expand-Animation' },
    },
  },
};

export const XLHero = {
  name: 'XL (Hero)',
  render: () => `<div style="border:1px dashed #92500a;border-radius:4px;padding:12px">
  <p style="margin:0 0 10px;font:600 12px/1.4 ui-monospace,monospace;letter-spacing:.08em;text-transform:uppercase;color:#92500a">
    Kein echtes Markup hinterlegt
  </p>
  <p style="margin:0 0 12px;font:400 13px/1.5 system-ui,sans-serif;color:#595c59;max-width:62ch">
    Was hier steht, ist aus der Anatomie des Recipes abgeleitet — die Slots als
    Geschwister, ohne Schachtelung und ohne Zustaende. So sieht das Bauteil
    nicht aus. Echtes Markup gehoert nach
    <code style="font:inherit;font-family:ui-monospace,monospace">data/markup/search.html</code>.
  </p>
  <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-search">
    <span class="nc-search__input-wrapper">input-wrapper</span>
    <span class="nc-search__icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/></svg></span>
    <span class="nc-search__input">input</span>
    <span class="nc-search__results">results</span>
    <span class="nc-search__item">item</span>
    <span class="nc-search__item-label">item-label</span>
  </div>
</div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Hero-Suchfeld mit 64px Hoehe, breiter Darstellung' },
    },
  },
};

export const TypeAhead = {
  name: 'Type-Ahead',
  render: () => `<div style="border:1px dashed #92500a;border-radius:4px;padding:12px">
  <p style="margin:0 0 10px;font:600 12px/1.4 ui-monospace,monospace;letter-spacing:.08em;text-transform:uppercase;color:#92500a">
    Kein echtes Markup hinterlegt
  </p>
  <p style="margin:0 0 12px;font:400 13px/1.5 system-ui,sans-serif;color:#595c59;max-width:62ch">
    Was hier steht, ist aus der Anatomie des Recipes abgeleitet — die Slots als
    Geschwister, ohne Schachtelung und ohne Zustaende. So sieht das Bauteil
    nicht aus. Echtes Markup gehoert nach
    <code style="font:inherit;font-family:ui-monospace,monospace">data/markup/search.html</code>.
  </p>
  <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-search">
    <span class="nc-search__input-wrapper">input-wrapper</span>
    <span class="nc-search__icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/></svg></span>
    <span class="nc-search__input">input</span>
    <span class="nc-search__results">results</span>
    <span class="nc-search__item">item</span>
    <span class="nc-search__item-label">item-label</span>
  </div>
</div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Ghost-Text Vorschlag waehrend der Eingabe, ArrowRight uebernimmt' },
    },
  },
};

export const HistoryFirst = {
  name: 'History-First',
  render: () => `<div style="border:1px dashed #92500a;border-radius:4px;padding:12px">
  <p style="margin:0 0 10px;font:600 12px/1.4 ui-monospace,monospace;letter-spacing:.08em;text-transform:uppercase;color:#92500a">
    Kein echtes Markup hinterlegt
  </p>
  <p style="margin:0 0 12px;font:400 13px/1.5 system-ui,sans-serif;color:#595c59;max-width:62ch">
    Was hier steht, ist aus der Anatomie des Recipes abgeleitet — die Slots als
    Geschwister, ohne Schachtelung und ohne Zustaende. So sieht das Bauteil
    nicht aus. Echtes Markup gehoert nach
    <code style="font:inherit;font-family:ui-monospace,monospace">data/markup/search.html</code>.
  </p>
  <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-search">
    <span class="nc-search__input-wrapper">input-wrapper</span>
    <span class="nc-search__icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/></svg></span>
    <span class="nc-search__input">input</span>
    <span class="nc-search__results">results</span>
    <span class="nc-search__item">item</span>
    <span class="nc-search__item-label">item-label</span>
  </div>
</div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Letzte Suchanfragen bei leerem Input, Beliebte als Fallback' },
    },
  },
};

export const AnimationVariants = {
  name: 'Animation Variants',
  render: () => `<div style="border:1px dashed #92500a;border-radius:4px;padding:12px">
  <p style="margin:0 0 10px;font:600 12px/1.4 ui-monospace,monospace;letter-spacing:.08em;text-transform:uppercase;color:#92500a">
    Kein echtes Markup hinterlegt
  </p>
  <p style="margin:0 0 12px;font:400 13px/1.5 system-ui,sans-serif;color:#595c59;max-width:62ch">
    Was hier steht, ist aus der Anatomie des Recipes abgeleitet — die Slots als
    Geschwister, ohne Schachtelung und ohne Zustaende. So sieht das Bauteil
    nicht aus. Echtes Markup gehoert nach
    <code style="font:inherit;font-family:ui-monospace,monospace">data/markup/search.html</code>.
  </p>
  <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-search">
    <span class="nc-search__input-wrapper">input-wrapper</span>
    <span class="nc-search__icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/></svg></span>
    <span class="nc-search__input">input</span>
    <span class="nc-search__results">results</span>
    <span class="nc-search__item">item</span>
    <span class="nc-search__item-label">item-label</span>
  </div>
</div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'slide-down vs fade vs expand — Results-Panel Animationen' },
    },
  },
};
