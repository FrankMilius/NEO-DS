// ============================================================
// ExpandingPanels — Auto-generated from expanding-panels-recipe.json
// Version: 1.0.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Organisms/ExpandingPanels',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**ExpandingPanels** v1.0.0 (stable)

Root .nc-expanding-panels: display:flex, gap, feste Hoehe (--nc-expanding-panels-height).


`,
      },
    },
    status: { type: 'stable' },
  },
  argTypes: {},
};

export const Default = {
  name: 'Standard',
  render: () => `<!-- @quelle: geerntet von Website /musterseite-bauteile -->
<!-- @punkte: 38 -->`,
};

export const Standard = {
  name: 'Standard',
  render: () => `<div class="nc-expanding-panels" data-xpanels="" role="group" aria-label="Warum neo workplace?" data-xpanels-init="1">
<button type="button" class="nc-expanding-panels__panel" aria-expanded="true">
<span class="nc-expanding-panels__bg" aria-hidden="true">
</span>
<span class="nc-expanding-panels__num">01</span>
<span class="nc-expanding-panels__label">Open Source</span>
<span class="nc-expanding-panels__body">
<span class="nc-expanding-panels__chip">GPL / MIT</span>
<h3 class="nc-expanding-panels__title">100 % Open Source</h3>
<p class="nc-expanding-panels__text">Transparenter, auditierbarer Code ohne Vendor-Lock-in. Digitale Souveränität für Unternehmen und öffentliche Hand.</p>
</span>
</button>
<button type="button" class="nc-expanding-panels__panel" aria-expanded="false">
<span class="nc-expanding-panels__bg" aria-hidden="true">
</span>
<span class="nc-expanding-panels__num">02</span>
<span class="nc-expanding-panels__label">Cloud &amp; On-Prem</span>
<span class="nc-expanding-panels__body">
<span class="nc-expanding-panels__chip">Betriebsmodelle</span>
<h3 class="nc-expanding-panels__title">Cloud &amp; On-Prem</h3>
<p class="nc-expanding-panels__text">SaaS, Private Cloud oder eigenes Rechenzentrum – Sie entscheiden, wo Ihre Daten liegen.</p>
</span>
</button>
<button type="button" class="nc-expanding-panels__panel" aria-expanded="false">
<span class="nc-expanding-panels__bg" aria-hidden="true">
</span>
<span class="nc-expanding-panels__num">03</span>
<span class="nc-expanding-panels__label">KI-nativ</span>
<span class="nc-expanding-panels__body">
<span class="nc-expanding-panels__chip">Entwicklung &amp; Betrieb</span>
<h3 class="nc-expanding-panels__title">KI-nativ</h3>
<p class="nc-expanding-panels__text">KI-gestützte Workflows in Produktentwicklung und Plattformbetrieb – nicht nachgerüstet, sondern eingebaut.</p>
</span>
</button>
<button type="button" class="nc-expanding-panels__panel" aria-expanded="false">
<span class="nc-expanding-panels__bg" aria-hidden="true">
</span>
<span class="nc-expanding-panels__num">04</span>
<span class="nc-expanding-panels__label">Barrierefrei</span>
<span class="nc-expanding-panels__body">
<span class="nc-expanding-panels__chip">WCAG 2.1 AA</span>
<h3 class="nc-expanding-panels__title">Barrierefrei</h3>
<p class="nc-expanding-panels__text">WCAG-konform und BITV-ready – Zugänglichkeit als Qualitätsmerkmal des gesamten Produkts.</p>
</span>
</button>
</div>`,
};
