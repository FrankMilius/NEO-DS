// ============================================================
// AccordionBlock — Auto-generated from accordion-block-recipe.json
// Version: 1.2.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Organisms/AccordionBlock',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**AccordionBlock** v1.2.0 (stable)

Website-Block neo_accordion: <section class="nc-section nc-accordion-block nc-accordion-block--{ratio}"> > .nc-container.nc-accordion-block__inner > __text + __accordion. Die inline_block-Fassung bindet das block_content-Template ein (keine Kopie).


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
    <code style="font:inherit;font-family:ui-monospace,monospace">data/markup/accordion-block.html</code>.
  </p>
  <div class="nc-accordion-block">
    <span class="nc-accordion-block__inner">inner</span>
    <span class="nc-accordion-block__text">accordion-block</span>
    <span class="nc-accordion-block__accordion">accordion</span>
  </div>
</div>`,
};

export const Verhaeltnis = {
  name: 'Verhaeltnis',
  render: () => `<div style="border:1px dashed #92500a;border-radius:4px;padding:12px">
  <p style="margin:0 0 10px;font:600 12px/1.4 ui-monospace,monospace;letter-spacing:.08em;text-transform:uppercase;color:#92500a">
    Kein echtes Markup hinterlegt
  </p>
  <p style="margin:0 0 12px;font:400 13px/1.5 system-ui,sans-serif;color:#595c59;max-width:62ch">
    Was hier steht, ist aus der Anatomie des Recipes abgeleitet — die Slots als
    Geschwister, ohne Schachtelung und ohne Zustaende. So sieht das Bauteil
    nicht aus. Echtes Markup gehoert nach
    <code style="font:inherit;font-family:ui-monospace,monospace">data/markup/accordion-block.html</code>.
  </p>
  <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  
</div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'zwei-drittel (Vorgabe), halb und voll.' },
    },
  },
};

export const MitAlleaufklappen = {
  name: 'Mit „Alle aufklappen"',
  render: () => `<div style="border:1px dashed #92500a;border-radius:4px;padding:12px">
  <p style="margin:0 0 10px;font:600 12px/1.4 ui-monospace,monospace;letter-spacing:.08em;text-transform:uppercase;color:#92500a">
    Kein echtes Markup hinterlegt
  </p>
  <p style="margin:0 0 12px;font:400 13px/1.5 system-ui,sans-serif;color:#595c59;max-width:62ch">
    Was hier steht, ist aus der Anatomie des Recipes abgeleitet — die Slots als
    Geschwister, ohne Schachtelung und ohne Zustaende. So sieht das Bauteil
    nicht aus. Echtes Markup gehoert nach
    <code style="font:inherit;font-family:ui-monospace,monospace">data/markup/accordion-block.html</code>.
  </p>
  <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-accordion-block">
    <span class="nc-accordion-block__inner">inner</span>
    <span class="nc-accordion-block__text">accordion-block</span>
    <span class="nc-accordion-block__accordion">accordion</span>
  </div>
</div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Wie auf der Website mit dem Schalter field_acc_expand_all (Variante separated, spacious).' },
    },
  },
};
