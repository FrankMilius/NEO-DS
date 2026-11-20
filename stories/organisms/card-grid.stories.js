// ============================================================
// CardGrid — Auto-generated from card-grid-recipe.json
// Version: 1.4.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Organisms/CardGrid',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**CardGrid** v1.4.0 (stable)

CSS Grid mit auto-fit oder fester Spaltenanzahl. Karten aus field_cards_json, aufbereitet in includes/neo_card_grid.inc und im Twig gerendert (ohne Skript vollstaendig); Kartenbild alt="", Icons (summary) als SVG aria-hidden.


`,
      },
    },
    status: { type: 'stable' },
  },
  argTypes: {},
};

export const Default = {
  name: 'Standard',
  render: () => `<div class="nc-card-grid nc-card-grid--cols-3 is-revealed" data-pattern="standard" data-animation="reverse-domino" data-neo-behavior="einblenden">
<a class="nc-card nc-card--navigational" href="/inside/blog/aus-piipe-workplace-wird-neo-workplace" style="--card-delay: 0s;">
<div class="nc-card__media">
<img src="/assets/muster/app-screen.svg" alt="" loading="lazy">
</div>
<div class="nc-card__content">
<h3 class="nc-card__title">Aus PIIPE Workplace wird neo workplace</h3>
<p class="nc-card__description">Produktnews · Juli 2026 — Mit dem Einzug von KI und dem funktionalen Ausbau des NEOCOSMO Produktuniversums werden die Namen der NEOCOSMO Produkte unter der Firmendachmarke vereinheitlicht.</p>
</div>
<div class="nc-card__footer">
<span class="nc-card__footer-label">Mehr darüber erfahren</span>
<svg class="nc-card__footer-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
<path d="M5 12H19">
</path>
<path d="M13 18L19 12L13 6">
</path>
</svg>
</div>
</a>
<article class="nc-card nc-card--navigational" style="--card-delay: 0.1s;">
<div class="nc-card__content">
<h3 class="nc-card__title">neo AI - statt Suchen gibt es Antworten</h3>
<p class="nc-card__description">Produktnews · ab Juli 2026 — mit neo AI bringt NEOCOSMO eine spezielle Intranet-KI auf den Markt: sicher, offen, schnell - perfekt für den unternehmensinternen Einsatz.</p>
</div>
</article>
<article class="nc-card nc-card--navigational" style="--card-delay: 0.2s;">
<div class="nc-card__content">
<h3 class="nc-card__title">NEOCOSMO in Analysten-Ranking top platziert</h3>
<p class="nc-card__description">Auszeichnung als einer der innovativsten Anbieter im D/A/CH Raum.</p>
</div>
</article>
<article class="nc-card nc-card--navigational" style="--card-delay: 0.3s;">
<div class="nc-card__content">
<h3 class="nc-card__title">NEOCOSMO und GovTech e.V. vereinbaren eine Zusammenarbeit</h3>
<p class="nc-card__description">Partnerschaft · März 2026 — neo workplace kann künftig über die Deutschlandplattform genutzt werden. Beide Partner machen sich für einen digital souveränen Betrieb von Intranet Lösungen stark.</p>
</div>
</article>
<article class="nc-card nc-card--navigational" style="--card-delay: 0.4s;">
<div class="nc-card__content">
<h3 class="nc-card__title">Open-Source-Intranet</h3>
<p class="nc-card__description">Trend · Juli 2026 — Warum digitale Souveränität nicht nur Unabhängigkeit, sondern auch Zukunft, Flexibilität und Innovation im KI-Zeitalter bedeutet.</p>
</div>
</article>
</div>`,
};

export const Bildereinfrben = {
  name: 'Bilder einfärben',
  render: () => `<!-- @quelle: Twig neo_fe e3c60a0 mit Feld field_cg_medien_ton = gruen (DRUPAL11 626019a), Block 17 „Card Grid — Standard“, zweite Karte medien_ton = aus; Bilder durch die Prod-Vorlage ersetzt (I12, 20.11.2026) -->
<div class="nc-card-grid" data-pattern="standard" data-medien-ton="gruen">
<a class="nc-card nc-card--navigational" href="/produkte/social-intranet">
<div class="nc-card__media">
<img src="/assets/muster/einfuehrung-beratung-konzeption.jpg" alt="" loading="lazy">
</div>
<div class="nc-card__content">
<h3 class="nc-card__title">Social Intranet</h3>
<p class="nc-card__description">Zentraler Hub fuer interne Kommunikation und Wissensaustausch.</p>
</div>
<div class="nc-card__footer">
<span class="nc-card__footer-label">Mehr darüber erfahren</span>
<svg class="nc-card__footer-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
<path d="M5 12H19"/>
<path d="M13 18L19 12L13 6"/>
</svg>
</div>
</a>
<a class="nc-card nc-card--navigational" data-medien-ton="aus" href="/produkte/app">
<div class="nc-card__media">
<img src="/assets/muster/einfuehrung-beratung-konzeption.jpg" alt="" loading="lazy">
</div>
<div class="nc-card__content">
<h3 class="nc-card__title">Mitarbeiter-App</h3>
<p class="nc-card__description">Mobile-first Zugang zu allen Workplace-Funktionen.</p>
</div>
<div class="nc-card__footer">
<span class="nc-card__footer-label">Mehr darüber erfahren</span>
<svg class="nc-card__footer-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
<path d="M5 12H19"/>
<path d="M13 18L19 12L13 6"/>
</svg>
</div>
</a>
<a class="nc-card nc-card--navigational" href="/produkte/dokumente">
<div class="nc-card__media">
<img src="/assets/muster/einfuehrung-beratung-konzeption.jpg" alt="" loading="lazy">
</div>
<div class="nc-card__content">
<h3 class="nc-card__title">Dokumenten-management</h3>
<p class="nc-card__description">Dateien teilen, versionieren und gemeinsam bearbeiten.</p>
</div>
<div class="nc-card__footer">
<span class="nc-card__footer-label">Mehr darüber erfahren</span>
<svg class="nc-card__footer-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
<path d="M5 12H19"/>
<path d="M13 18L19 12L13 6"/>
</svg>
</div>
</a>
</div>`,
};
