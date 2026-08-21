// ============================================================
// FormBlock — Auto-generated from form-block-recipe.json
// Version: 1.0.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Organisms/FormBlock',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**FormBlock** v1.0.0 (stable)

4 Positionierungsvarianten: text-left, text-right, text-top, text-bottom.


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
    <code style="font:inherit;font-family:ui-monospace,monospace">data/markup/form-block.html</code>.
  </p>
  <div class="nc-form-block">
    <span class="nc-form-block__text">form-block</span>
    <span class="nc-form-block__form">form</span>
    <span class="nc-form-block__headline">headline</span>
  </div>
</div>`,
};

export const TextLinksDefault = {
  name: 'Text Links (Default)',
  render: () => `<div style="border:1px dashed #92500a;border-radius:4px;padding:12px">
  <p style="margin:0 0 10px;font:600 12px/1.4 ui-monospace,monospace;letter-spacing:.08em;text-transform:uppercase;color:#92500a">
    Kein echtes Markup hinterlegt
  </p>
  <p style="margin:0 0 12px;font:400 13px/1.5 system-ui,sans-serif;color:#595c59;max-width:62ch">
    Was hier steht, ist aus der Anatomie des Recipes abgeleitet — die Slots als
    Geschwister, ohne Schachtelung und ohne Zustaende. So sieht das Bauteil
    nicht aus. Echtes Markup gehoert nach
    <code style="font:inherit;font-family:ui-monospace,monospace">data/markup/form-block.html</code>.
  </p>
  <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-form-block">
    <span class="nc-form-block__text">form-block</span>
    <span class="nc-form-block__form">form</span>
    <span class="nc-form-block__headline">headline</span>
  </div>
</div>
</div>`,
  parameters: {
    docs: {
      description: { story: '' },
    },
  },
};

export const TextRechts = {
  name: 'Text Rechts',
  render: () => `<div style="border:1px dashed #92500a;border-radius:4px;padding:12px">
  <p style="margin:0 0 10px;font:600 12px/1.4 ui-monospace,monospace;letter-spacing:.08em;text-transform:uppercase;color:#92500a">
    Kein echtes Markup hinterlegt
  </p>
  <p style="margin:0 0 12px;font:400 13px/1.5 system-ui,sans-serif;color:#595c59;max-width:62ch">
    Was hier steht, ist aus der Anatomie des Recipes abgeleitet — die Slots als
    Geschwister, ohne Schachtelung und ohne Zustaende. So sieht das Bauteil
    nicht aus. Echtes Markup gehoert nach
    <code style="font:inherit;font-family:ui-monospace,monospace">data/markup/form-block.html</code>.
  </p>
  <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-form-block">
    <span class="nc-form-block__text">form-block</span>
    <span class="nc-form-block__form">form</span>
    <span class="nc-form-block__headline">headline</span>
  </div>
</div>
</div>`,
  parameters: {
    docs: {
      description: { story: '' },
    },
  },
};

export const Gestapelt = {
  name: 'Gestapelt',
  render: () => `<div style="border:1px dashed #92500a;border-radius:4px;padding:12px">
  <p style="margin:0 0 10px;font:600 12px/1.4 ui-monospace,monospace;letter-spacing:.08em;text-transform:uppercase;color:#92500a">
    Kein echtes Markup hinterlegt
  </p>
  <p style="margin:0 0 12px;font:400 13px/1.5 system-ui,sans-serif;color:#595c59;max-width:62ch">
    Was hier steht, ist aus der Anatomie des Recipes abgeleitet — die Slots als
    Geschwister, ohne Schachtelung und ohne Zustaende. So sieht das Bauteil
    nicht aus. Echtes Markup gehoert nach
    <code style="font:inherit;font-family:ui-monospace,monospace">data/markup/form-block.html</code>.
  </p>
  <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-form-block">
    <span class="nc-form-block__text">form-block</span>
    <span class="nc-form-block__form">form</span>
    <span class="nc-form-block__headline">headline</span>
  </div>
  <div class="nc-form-block">
    <span class="nc-form-block__text">form-block</span>
    <span class="nc-form-block__form">form</span>
    <span class="nc-form-block__headline">headline</span>
  </div>
</div>
</div>`,
  parameters: {
    docs: {
      description: { story: '' },
    },
  },
};
