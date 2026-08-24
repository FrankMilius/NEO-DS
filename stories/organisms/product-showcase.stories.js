// ============================================================
// ProductShowcase — Auto-generated from product-showcase-recipe.json
// Version: 1.0.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Organisms/ProductShowcase',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**ProductShowcase** v1.0.0 (stable)

Root: Display Grid/Flex. Layout horizontal (Options links, Media rechts) oder stacked (Options oben, Media darunter).


`,
      },
    },
    status: { type: 'stable' },
  },
  argTypes: {},
};

export const Default = {
  name: 'Standard',
  render: () => `<div class="nc-product-showcase nc-product-showcase--accordion nc-product-showcase--device nc-product-showcase--sticky nc-product-showcase--media-end" data-neo-device-accordion="aktiv">
<div class="nc-product-showcase__media-panel">
<div class="nc-device">
<div class="nc-device__screen">
<img class="nc-product-showcase__media-item is-active" data-station="0" src="/assets/muster/app-screen.svg" alt="Anmelden wie gewohnt — auch ohne Firmen-E-Mail" loading="eager" decoding="async" width="800" height="1740">
<img class="nc-product-showcase__media-item" data-station="1" src="/assets/muster/app-screen.svg" alt="Drei Fingertipps bis zur wichtigsten Information" loading="lazy" decoding="async" width="800" height="1740">
<img class="nc-product-showcase__media-item" data-station="2" src="/assets/muster/app-screen.svg" alt="Die Spätschicht antwortet, bevor Sie zu Hause sind" loading="lazy" decoding="async" width="800" height="1740">
<img class="nc-product-showcase__media-item" data-station="3" src="/assets/muster/app-screen.svg" alt="Jede Schicht sieht, was für sie zählt" loading="lazy" decoding="async" width="800" height="1740">
<img class="nc-product-showcase__media-item" data-station="4" src="/assets/muster/app-screen.svg" alt="Aus Lesern werden Beteiligte" loading="lazy" decoding="async" width="800" height="1740">
<img class="nc-product-showcase__media-item" data-station="5" src="/assets/muster/app-screen.svg" alt="Push nur, wenn es Sie wirklich betrifft" loading="lazy" decoding="async" width="800" height="1740">
</div>
</div>
</div>
<div class="nc-product-showcase__options">
<div class="nc-product-showcase__option is-active" data-station="0">
<button type="button" class="nc-product-showcase__trigger" id="ds-x-t0" aria-expanded="true" aria-controls="ds-x-p0">
<span class="nc-product-showcase__label">Zugang</span>
<span class="nc-product-showcase__title">Anmelden wie gewohnt — auch ohne Firmen-E-Mail</span>
</button>
<div class="nc-product-showcase__panel" id="ds-x-p0" role="region" aria-labelledby="ds-x-t0">
<div>
<p class="nc-product-showcase__description-text">Wer in der Produktion arbeitet, hat oft gar keine Adresse im Unternehmen. Genau daran scheitern Einführungen — und genau das löst der Zugang über Personalnummer oder Einladungscode.</p>
</div>
</div>
<div class="nc-product-showcase__option-device">
<div class="nc-device nc-device--sm">
<div class="nc-device__screen">
<img src="/assets/muster/app-screen.svg" alt="" loading="lazy" decoding="async" width="800" height="1740">
</div>
</div>
</div>
</div>
<div class="nc-product-showcase__option" data-station="1">
<button type="button" class="nc-product-showcase__trigger" id="ds-x-t1" aria-expanded="false" aria-controls="ds-x-p1">
<span class="nc-product-showcase__label">Orientierung</span>
<span class="nc-product-showcase__title">Drei Fingertipps bis zur wichtigsten Information</span>
</button>
<div class="nc-product-showcase__panel" id="ds-x-p1" role="region" aria-labelledby="ds-x-t1">
<div>
<p class="nc-product-showcase__description-text">Die Startseite zeigt, was heute zählt. Alles andere liegt eine Ebene tiefer und bleibt auffindbar, ohne dass jemand danach suchen muss.</p>
</div>
</div>
<div class="nc-product-showcase__option-device">
<div class="nc-device nc-device--sm">
<div class="nc-device__screen">
<img src="/assets/muster/app-screen.svg" alt="" loading="lazy" decoding="async" width="800" height="1740">
</div>
</div>
</div>
</div>
<div class="nc-product-showcase__option" data-station="2">
<button type="button" class="nc-product-showcase__trigger" id="ds-x-t2" aria-expanded="false" aria-controls="ds-x-p2">
<span class="nc-product-showcase__label">Austausch</span>
<span class="nc-product-showcase__title">Die Spätschicht antwortet, bevor Sie zu Hause sind</span>
</button>
<div class="nc-product-showcase__panel" id="ds-x-p2" role="region" aria-labelledby="ds-x-t2">
<div>
<p class="nc-product-showcase__description-text">Communities, Blogs und das Verzeichnis sind vollständig dabei: lesen, posten, kommentieren — ohne Umweg über den Rechner.</p>
</div>
</div>
<div class="nc-product-showcase__option-device">
<div class="nc-device nc-device--sm">
<div class="nc-device__screen">
<img src="/assets/muster/app-screen.svg" alt="" loading="lazy" decoding="async" width="800" height="1740">
</div>
</div>
</div>
</div>
<div class="nc-product-showcase__option" data-station="3">
<button type="button" class="nc-product-showcase__trigger" id="ds-x-t3" aria-expanded="false" aria-controls="ds-x-p3">
<span class="nc-product-showcase__label">Personalisierung</span>
<span class="nc-product-showcase__title">Jede Schicht sieht, was für sie zählt</span>
</button>
<div class="nc-product-showcase__panel" id="ds-x-p3" role="region" aria-labelledby="ds-x-t3">
<div>
<p class="nc-product-showcase__description-text">Sprache, verlinkte Anwendungen und Abonnements stellt jeder selbst ein. Aus einer App für alle wird eine App für jeden.</p>
</div>
</div>
<div class="nc-product-showcase__option-device">
<div class="nc-device nc-device--sm">
<div class="nc-device__screen">
<img src="/assets/muster/app-screen.svg" alt="" loading="lazy" decoding="async" width="800" height="1740">
</div>
</div>
</div>
</div>
<div class="nc-product-showcase__option" data-station="4">
<button type="button" class="nc-product-showcase__trigger" id="ds-x-t4" aria-expanded="false" aria-controls="ds-x-p4">
<span class="nc-product-showcase__label">Beteiligung</span>
<span class="nc-product-showcase__title">Aus Lesern werden Beteiligte</span>
</button>
<div class="nc-product-showcase__panel" id="ds-x-p4" role="region" aria-labelledby="ds-x-t4">
<div>
<p class="nc-product-showcase__description-text">Likes, Kommentare, Umfragen und Events sind keine Zusatzfunktionen, sondern der Grund, warum jemand die App ein zweites Mal öffnet.</p>
</div>
</div>
<div class="nc-product-showcase__option-device">
<div class="nc-device nc-device--sm">
<div class="nc-device__screen">
<img src="/assets/muster/app-screen.svg" alt="" loading="lazy" decoding="async" width="800" height="1740">
</div>
</div>
</div>
</div>
<div class="nc-product-showcase__option" data-station="5">
<button type="button" class="nc-product-showcase__trigger" id="ds-x-t5" aria-expanded="false" aria-controls="ds-x-p5">
<span class="nc-product-showcase__label">Hinweise</span>
<span class="nc-product-showcase__title">Push nur, wenn es Sie wirklich betrifft</span>
</button>
<div class="nc-product-showcase__panel" id="ds-x-p5" role="region" aria-labelledby="ds-x-t5">
<div>
<p class="nc-product-showcase__description-text">Wichtiges erscheint auf dem Sperrbildschirm, alles Übrige sammelt die Benachrichtigungszentrale. Informiert sein, ohne überflutet zu werden.</p>
</div>
</div>
<div class="nc-product-showcase__option-device">
<div class="nc-device nc-device--sm">
<div class="nc-device__screen">
<img src="/assets/muster/app-screen.svg" alt="" loading="lazy" decoding="async" width="800" height="1740">
</div>
</div>
</div>
</div>
</div>
</div>`,
};
