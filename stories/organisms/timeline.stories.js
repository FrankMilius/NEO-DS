// ============================================================
// Timeline — Auto-generated from timeline-recipe.json
// Version: 2.3.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Organisms/Timeline',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**Timeline** v2.3.0 (stable)

<ol> fuer chronologisch geordnete Eintraege — semantische Reihenfolge.


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
    <code style="font:inherit;font-family:ui-monospace,monospace">data/markup/timeline.html</code>.
  </p>
  <div class="nc-timeline">
    <span class="nc-timeline__item">item</span>
    <span class="nc-timeline__node">node</span>
    <span class="nc-timeline__content">content</span>
    <span class="nc-timeline__title">title</span>
    <span class="">fill</span>
    <span class="">period</span>
    <span class="">badge</span>
    <span class="">phase</span>
    <span class="">lead</span>
    <span class="">list</span>
    <span class="">cta</span>
  </div>
</div>`,
};

export const DefaultTimeline = {
  name: 'Default Timeline',
  render: () => `<div style="border:1px dashed #92500a;border-radius:4px;padding:12px">
  <p style="margin:0 0 10px;font:600 12px/1.4 ui-monospace,monospace;letter-spacing:.08em;text-transform:uppercase;color:#92500a">
    Kein echtes Markup hinterlegt
  </p>
  <p style="margin:0 0 12px;font:400 13px/1.5 system-ui,sans-serif;color:#595c59;max-width:62ch">
    Was hier steht, ist aus der Anatomie des Recipes abgeleitet — die Slots als
    Geschwister, ohne Schachtelung und ohne Zustaende. So sieht das Bauteil
    nicht aus. Echtes Markup gehoert nach
    <code style="font:inherit;font-family:ui-monospace,monospace">data/markup/timeline.html</code>.
  </p>
  <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-timeline">
    <span class="nc-timeline__item">item</span>
    <span class="nc-timeline__node">node</span>
    <span class="nc-timeline__content">content</span>
    <span class="nc-timeline__title">title</span>
    <span class="">fill</span>
    <span class="">period</span>
    <span class="">badge</span>
    <span class="">phase</span>
    <span class="">lead</span>
    <span class="">list</span>
    <span class="">cta</span>
  </div>
</div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Standard-Timeline mit kleinen Punkt-Nodes und Content' },
    },
  },
};

export const VariantComparison = {
  name: 'Variant Comparison',
  render: () => `<div style="border:1px dashed #92500a;border-radius:4px;padding:12px">
  <p style="margin:0 0 10px;font:600 12px/1.4 ui-monospace,monospace;letter-spacing:.08em;text-transform:uppercase;color:#92500a">
    Kein echtes Markup hinterlegt
  </p>
  <p style="margin:0 0 12px;font:400 13px/1.5 system-ui,sans-serif;color:#595c59;max-width:62ch">
    Was hier steht, ist aus der Anatomie des Recipes abgeleitet — die Slots als
    Geschwister, ohne Schachtelung und ohne Zustaende. So sieht das Bauteil
    nicht aus. Echtes Markup gehoert nach
    <code style="font:inherit;font-family:ui-monospace,monospace">data/markup/timeline.html</code>.
  </p>
  <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  
</div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Default, Icon, Connected, Compact im Vergleich' },
    },
  },
};

export const NodeStatusVariants = {
  name: 'Node Status Variants',
  render: () => `<div style="border:1px dashed #92500a;border-radius:4px;padding:12px">
  <p style="margin:0 0 10px;font:600 12px/1.4 ui-monospace,monospace;letter-spacing:.08em;text-transform:uppercase;color:#92500a">
    Kein echtes Markup hinterlegt
  </p>
  <p style="margin:0 0 12px;font:400 13px/1.5 system-ui,sans-serif;color:#595c59;max-width:62ch">
    Was hier steht, ist aus der Anatomie des Recipes abgeleitet — die Slots als
    Geschwister, ohne Schachtelung und ohne Zustaende. So sieht das Bauteil
    nicht aus. Echtes Markup gehoert nach
    <code style="font:inherit;font-family:ui-monospace,monospace">data/markup/timeline.html</code>.
  </p>
  <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-timeline">
    <span class="nc-timeline__item">item</span>
    <span class="nc-timeline__node">node</span>
    <span class="nc-timeline__content">content</span>
    <span class="nc-timeline__title">title</span>
    <span class="">fill</span>
    <span class="">period</span>
    <span class="">badge</span>
    <span class="">phase</span>
    <span class="">lead</span>
    <span class="">list</span>
    <span class="">cta</span>
  </div>
</div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Default, Active, Success, Danger Nodes' },
    },
  },
};

export const IconTimeline = {
  name: 'Icon Timeline',
  render: () => `<div style="border:1px dashed #92500a;border-radius:4px;padding:12px">
  <p style="margin:0 0 10px;font:600 12px/1.4 ui-monospace,monospace;letter-spacing:.08em;text-transform:uppercase;color:#92500a">
    Kein echtes Markup hinterlegt
  </p>
  <p style="margin:0 0 12px;font:400 13px/1.5 system-ui,sans-serif;color:#595c59;max-width:62ch">
    Was hier steht, ist aus der Anatomie des Recipes abgeleitet — die Slots als
    Geschwister, ohne Schachtelung und ohne Zustaende. So sieht das Bauteil
    nicht aus. Echtes Markup gehoert nach
    <code style="font:inherit;font-family:ui-monospace,monospace">data/markup/timeline.html</code>.
  </p>
  <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-timeline">
    <span class="nc-timeline__item">item</span>
    <span class="nc-timeline__node">node</span>
    <span class="nc-timeline__content">content</span>
    <span class="nc-timeline__title">title</span>
    <span class="">fill</span>
    <span class="">period</span>
    <span class="">badge</span>
    <span class="">phase</span>
    <span class="">lead</span>
    <span class="">list</span>
    <span class="">cta</span>
  </div>
</div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Groessere Nodes (32px) mit SVG-Icons — fuer Activity Feeds' },
    },
  },
};

export const ConnectedCards = {
  name: 'Connected Cards',
  render: () => `<div style="border:1px dashed #92500a;border-radius:4px;padding:12px">
  <p style="margin:0 0 10px;font:600 12px/1.4 ui-monospace,monospace;letter-spacing:.08em;text-transform:uppercase;color:#92500a">
    Kein echtes Markup hinterlegt
  </p>
  <p style="margin:0 0 12px;font:400 13px/1.5 system-ui,sans-serif;color:#595c59;max-width:62ch">
    Was hier steht, ist aus der Anatomie des Recipes abgeleitet — die Slots als
    Geschwister, ohne Schachtelung und ohne Zustaende. So sieht das Bauteil
    nicht aus. Echtes Markup gehoert nach
    <code style="font:inherit;font-family:ui-monospace,monospace">data/markup/timeline.html</code>.
  </p>
  <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-timeline">
    <span class="nc-timeline__item">item</span>
    <span class="nc-timeline__node">node</span>
    <span class="nc-timeline__content">content</span>
    <span class="nc-timeline__title">title</span>
    <span class="">fill</span>
    <span class="">period</span>
    <span class="">badge</span>
    <span class="">phase</span>
    <span class="">lead</span>
    <span class="">list</span>
    <span class="">cta</span>
  </div>
</div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Timeline mit Card-Hintergrund fuer den Content-Bereich' },
    },
  },
};

export const ChangelogExample = {
  name: 'Changelog Example',
  render: () => `<div style="border:1px dashed #92500a;border-radius:4px;padding:12px">
  <p style="margin:0 0 10px;font:600 12px/1.4 ui-monospace,monospace;letter-spacing:.08em;text-transform:uppercase;color:#92500a">
    Kein echtes Markup hinterlegt
  </p>
  <p style="margin:0 0 12px;font:400 13px/1.5 system-ui,sans-serif;color:#595c59;max-width:62ch">
    Was hier steht, ist aus der Anatomie des Recipes abgeleitet — die Slots als
    Geschwister, ohne Schachtelung und ohne Zustaende. So sieht das Bauteil
    nicht aus. Echtes Markup gehoert nach
    <code style="font:inherit;font-family:ui-monospace,monospace">data/markup/timeline.html</code>.
  </p>
  <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-timeline">
    <span class="nc-timeline__item">item</span>
    <span class="nc-timeline__node">node</span>
    <span class="nc-timeline__content">content</span>
    <span class="nc-timeline__title">title</span>
    <span class="">fill</span>
    <span class="">period</span>
    <span class="">badge</span>
    <span class="">phase</span>
    <span class="">lead</span>
    <span class="">list</span>
    <span class="">cta</span>
  </div>
</div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Typischer Anwendungsfall: Versions-Changelog mit Datum und Beschreibung' },
    },
  },
};
