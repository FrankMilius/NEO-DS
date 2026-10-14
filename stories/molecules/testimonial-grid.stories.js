// ============================================================
// TestimonialGrid — Auto-generated from testimonial-grid-recipe.json
// Version: 1.3.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Molecules/TestimonialGrid',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**TestimonialGrid** v1.3.0 (stable)

Website: block--block-content/inline-block--neo-testimonial-grid.html.twig — <section class="nc-section"><div class="nc-container"> mit neo_fe:block-header (Kicker, Ueberschrift) und dem Raster; ohne referenzierte Testimonials kein Raster.


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
    <code style="font:inherit;font-family:ui-monospace,monospace">data/markup/testimonial-grid.html</code>.
  </p>
  <div class="nc-testimonial-grid">
    testimonial-grid
  </div>
</div>`,
};

export const Raster = {
  name: 'Raster',
  render: () => `<div style="border:1px dashed #92500a;border-radius:4px;padding:12px">
  <p style="margin:0 0 10px;font:600 12px/1.4 ui-monospace,monospace;letter-spacing:.08em;text-transform:uppercase;color:#92500a">
    Kein echtes Markup hinterlegt
  </p>
  <p style="margin:0 0 12px;font:400 13px/1.5 system-ui,sans-serif;color:#595c59;max-width:62ch">
    Was hier steht, ist aus der Anatomie des Recipes abgeleitet — die Slots als
    Geschwister, ohne Schachtelung und ohne Zustaende. So sieht das Bauteil
    nicht aus. Echtes Markup gehoert nach
    <code style="font:inherit;font-family:ui-monospace,monospace">data/markup/testimonial-grid.html</code>.
  </p>
  <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-testimonial-grid">
    testimonial-grid
  </div>
  <div class="nc-testimonial-grid">
    testimonial-grid
  </div>
  <div class="nc-testimonial-grid">
    testimonial-grid
  </div>
</div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Eine, zwei und drei Spalten' },
    },
  },
};

export const Karussell = {
  name: 'Karussell',
  render: () => `<div style="border:1px dashed #92500a;border-radius:4px;padding:12px">
  <p style="margin:0 0 10px;font:600 12px/1.4 ui-monospace,monospace;letter-spacing:.08em;text-transform:uppercase;color:#92500a">
    Kein echtes Markup hinterlegt
  </p>
  <p style="margin:0 0 12px;font:400 13px/1.5 system-ui,sans-serif;color:#595c59;max-width:62ch">
    Was hier steht, ist aus der Anatomie des Recipes abgeleitet — die Slots als
    Geschwister, ohne Schachtelung und ohne Zustaende. So sieht das Bauteil
    nicht aus. Echtes Markup gehoert nach
    <code style="font:inherit;font-family:ui-monospace,monospace">data/markup/testimonial-grid.html</code>.
  </p>
  <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-testimonial-grid">
    testimonial-grid
  </div>
</div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Waagerecht scrollend mit Navigation — Hover/Fokus am Knopf (nur echt), am Anfang ist „Zurück“ gesperrt' },
    },
  },
};
