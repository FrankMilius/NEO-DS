// ============================================================
// Testimonial — Auto-generated from testimonial-recipe.json
// Version: 1.0.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Organisms/Testimonial',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**Testimonial** v1.0.0 (stable)

Card: background-secondary, radius-sm, padding-05, grid gap 1.25rem, scroll-snap-align.


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
    <code style="font:inherit;font-family:ui-monospace,monospace">data/markup/testimonial.html</code>.
  </p>
  <div class="nc-testimonial">
    <span class="nc-testimonial__quote">quote</span>
    <span class="nc-testimonial__author">author</span>
    <span class="nc-testimonial__name">name</span>
  </div>
</div>`,
};

export const Testimonial = {
  name: 'Testimonial',
  render: () => `<div style="border:1px dashed #92500a;border-radius:4px;padding:12px">
  <p style="margin:0 0 10px;font:600 12px/1.4 ui-monospace,monospace;letter-spacing:.08em;text-transform:uppercase;color:#92500a">
    Kein echtes Markup hinterlegt
  </p>
  <p style="margin:0 0 12px;font:400 13px/1.5 system-ui,sans-serif;color:#595c59;max-width:62ch">
    Was hier steht, ist aus der Anatomie des Recipes abgeleitet — die Slots als
    Geschwister, ohne Schachtelung und ohne Zustaende. So sieht das Bauteil
    nicht aus. Echtes Markup gehoert nach
    <code style="font:inherit;font-family:ui-monospace,monospace">data/markup/testimonial.html</code>.
  </p>
  <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-testimonial">
    <span class="nc-testimonial__quote">quote</span>
    <span class="nc-testimonial__author">author</span>
    <span class="nc-testimonial__name">name</span>
  </div>
</div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Zitat-Karte mit Autor und Rolle' },
    },
  },
};
