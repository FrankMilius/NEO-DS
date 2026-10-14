// ============================================================
// MobileDrawer — Auto-generated from mobile-drawer-recipe.json
// Version: 1.3.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Organisms/MobileDrawer',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**MobileDrawer** v1.3.0 (stable)

Markup nach den BEM-Klassen des SCSS (kein geerntetes Markup, das Bauteil laeuft auf der Website nicht): div.nc-mobile-drawer__backdrop als Geschwister vor aside.nc-mobile-drawer (id, aria-label); darin __header (__title, __close) und nav.__nav > ul.__list > li > a.__link (+ ul.__sublist > li > a.__sublink).


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
    <code style="font:inherit;font-family:ui-monospace,monospace">data/markup/mobile-drawer.html</code>.
  </p>
  <div class="nc-mobile-drawer">
    <span class="nc-mobile-drawer__backdrop">backdrop</span>
    <span class="nc-mobile-drawer__header">header</span>
    <span class="nc-mobile-drawer__close">close</span>
    <span class="nc-mobile-drawer__nav">nav</span>
    <span class="nc-mobile-drawer__list">list</span>
    <span class="nc-mobile-drawer__link">link</span>
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
  <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-mobile-drawer">
    <span class="nc-mobile-drawer__backdrop">backdrop</span>
    <span class="nc-mobile-drawer__header">header</span>
    <span class="nc-mobile-drawer__close">close</span>
    <span class="nc-mobile-drawer__nav">nav</span>
    <span class="nc-mobile-drawer__list">list</span>
    <span class="nc-mobile-drawer__link">link</span>
  </div>
</div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'mobile-drawer offen, wie auf der Website nach dem Burger.' },
    },
  },
};

export const Geschlossenundoffen = {
  name: 'Geschlossen und offen',
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
  <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  
</div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Geschlossen ist der Drawer aus dem Bild geschoben (translateX(100%)), der Backdrop unsichtbar; offen --open und __backdrop--visible.' },
    },
  },
};

export const MitUnterpunkten = {
  name: 'Mit Unterpunkten',
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
  <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-mobile-drawer">
    <span class="nc-mobile-drawer__backdrop">backdrop</span>
    <span class="nc-mobile-drawer__header">header</span>
    <span class="nc-mobile-drawer__close">close</span>
    <span class="nc-mobile-drawer__nav">nav</span>
    <span class="nc-mobile-drawer__list">list</span>
    <span class="nc-mobile-drawer__link">link</span>
  </div>
</div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Unterliste (__sublist, __sublink) mit aktuellem Ast.' },
    },
  },
};

export const Hover = {
  name: 'Hover',
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
  <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-mobile-drawer">
    <span class="nc-mobile-drawer__backdrop">backdrop</span>
    <span class="nc-mobile-drawer__header">header</span>
    <span class="nc-mobile-drawer__close">close</span>
    <span class="nc-mobile-drawer__nav">nav</span>
    <span class="nc-mobile-drawer__list">list</span>
    <span class="nc-mobile-drawer__link">link</span>
  </div>
</div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Hover an Link und Schliessen-Knopf (nur interaktiv).' },
    },
  },
};
