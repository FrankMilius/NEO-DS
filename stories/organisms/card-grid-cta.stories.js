// ============================================================
// CardGridCta — Auto-generated from card-grid-cta-recipe.json
// Version: 1.4.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Organisms/CardGridCta',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**CardGridCta** v1.4.0 (stable)

Hero-artige Teaser-Karten mit BG-Media + Headline + CTA.


`,
      },
    },
    status: { type: 'stable' },
  },
  argTypes: {},
};

export const Default = {
  name: 'Standard',
  render: () => `<div class="nc-card-grid-cta" style="--cgc-columns: 2; --cgc-ratio: 4/3;">
<div class="nc-card-cta" data-theme="dark">
<img class="nc-card-cta__media" src="https://picsum.photos/id/1076/1200/800" alt="" loading="lazy" decoding="async">
<div class="nc-card-cta__overlay">
</div>
<div class="nc-card-cta__content">
<h3 class="nc-card-cta__title" style="max-width: 60%;">Workplace Platform</h3>
<div class="nc-card-cta__actions">
<a href="/produkte/workplace" class="nc-button nc-button--primary" aria-label="Plattform entdecken – Workplace Platform" style="--nc-button-primary-bg: var(--fnd-color-always-light); --nc-button-primary-color: var(--fnd-color-always-dark);">Plattform entdecken</a>
</div>
</div>
</div>
<div class="nc-card-cta" data-theme="dark">
<img class="nc-card-cta__media" src="https://picsum.photos/id/180/1200/800" alt="" loading="lazy" decoding="async">
<div class="nc-card-cta__overlay">
</div>
<div class="nc-card-cta__content">
<h3 class="nc-card-cta__title" style="max-width: 80%;">Analytics &amp; Reporting in Echtzeit</h3>
<div class="nc-card-cta__actions">
<a href="/produkte/analytics" class="nc-button nc-button--ghost" aria-label="Dashboard testen – Analytics &amp; Reporting in Echtzeit" style="--nc-button-ghost-color: var(--fnd-color-always-light); --nc-button-ghost-border: var(--fnd-color-always-light);">Dashboard testen</a>
</div>
</div>
</div>
<div class="nc-card-cta" data-theme="dark">
<img class="nc-card-cta__media" src="https://picsum.photos/id/1073/1200/800" alt="" loading="lazy" decoding="async">
<div class="nc-card-cta__overlay">
</div>
<div class="nc-card-cta__content">
<h3 class="nc-card-cta__title" style="max-width: 60%;">Enterprise Security für Ihr Team</h3>
<div class="nc-card-cta__actions">
<a href="/sicherheit" class="nc-button nc-button--primary" aria-label="Mehr erfahren – Enterprise Security für Ihr Team" style="--nc-button-primary-bg: var(--fnd-color-always-light); --nc-button-primary-color: var(--fnd-color-always-dark);">Mehr erfahren</a>
</div>
</div>
</div>
<div class="nc-card-cta" data-theme="dark">
<img class="nc-card-cta__media" src="https://picsum.photos/id/1069/1200/800" alt="" loading="lazy" decoding="async">
<div class="nc-card-cta__overlay">
</div>
<div class="nc-card-cta__content">
<h3 class="nc-card-cta__title" style="max-width: 80%;">KI-gestützte Workflows</h3>
<div class="nc-card-cta__actions">
<a href="/ki-assistent" class="nc-button nc-button--primary" aria-label="Beta starten – KI-gestützte Workflows" style="--nc-button-primary-bg: var(--fnd-color-always-light); --nc-button-primary-color: var(--fnd-color-always-dark);">Beta starten</a>
</div>
</div>
</div>
<div class="nc-card-cta" data-theme="dark">
<img class="nc-card-cta__media" src="https://picsum.photos/id/119/1200/800" alt="" loading="lazy" decoding="async">
<div class="nc-card-cta__overlay">
</div>
<div class="nc-card-cta__content">
<h3 class="nc-card-cta__title" style="max-width: 100%;">Nahtlose Integrationen</h3>
<div class="nc-card-cta__actions">
<a href="/integrationen" class="nc-button nc-button--ghost" aria-label="Alle Apps – Nahtlose Integrationen" style="--nc-button-ghost-color: var(--fnd-color-always-light); --nc-button-ghost-border: var(--fnd-color-always-light);">Alle Apps</a>
</div>
</div>
</div>
<div class="nc-card-cta" data-theme="dark">
<img class="nc-card-cta__media" src="https://picsum.photos/id/1048/1200/800" alt="" loading="lazy" decoding="async">
<div class="nc-card-cta__overlay">
</div>
<div class="nc-card-cta__content">
<h3 class="nc-card-cta__title" style="max-width: 60%;">Flexibel skalierbar</h3>
<div class="nc-card-cta__actions">
<a href="/preise" class="nc-button nc-button--primary" aria-label="Preise ansehen – Flexibel skalierbar" style="--nc-button-primary-bg: var(--fnd-color-always-light); --nc-button-primary-color: var(--fnd-color-always-dark);">Preise ansehen</a>
</div>
</div>
</div>
</div>`,
};

export const Bildereinfrben = {
  name: 'Bilder einfärben',
  render: () => `<!-- @quelle: die ersten drei Karten der Fassung Standard (Website /musterseite-bauteile), Raster auf drei Spalten, Bilder durch die Prod-Vorlage ersetzt; dazu data-medien-ton am Raster (gruen), zweite Karte „aus“, dritte Karte „forest“ — an den Stellen, an denen das Twig sie nach I14 Phase 4 setzt (Raster aus field_cg_medien_ton, Karte aus medien_ton; noch nicht aus Drupal gemessen) (I14, 21.11.2026) -->
<div class="nc-card-grid-cta" style="--cgc-columns: 3; --cgc-ratio: 4/3;" data-medien-ton="gruen">
<div class="nc-card-cta" data-theme="dark">
<img class="nc-card-cta__media" src="/assets/muster/einfuehrung-beratung-konzeption.jpg" alt="" loading="lazy" decoding="async">
<div class="nc-card-cta__overlay">
</div>
<div class="nc-card-cta__content">
<h3 class="nc-card-cta__title" style="max-width: 60%;">Workplace Platform</h3>
<div class="nc-card-cta__actions">
<a href="/produkte/workplace" class="nc-button nc-button--primary" aria-label="Plattform entdecken – Workplace Platform" style="--nc-button-primary-bg: var(--fnd-color-always-light); --nc-button-primary-color: var(--fnd-color-always-dark);">Plattform entdecken</a>
</div>
</div>
</div>
<div class="nc-card-cta" data-theme="dark" data-medien-ton="aus">
<img class="nc-card-cta__media" src="/assets/muster/einfuehrung-beratung-konzeption.jpg" alt="" loading="lazy" decoding="async">
<div class="nc-card-cta__overlay">
</div>
<div class="nc-card-cta__content">
<h3 class="nc-card-cta__title" style="max-width: 80%;">Analytics &amp; Reporting in Echtzeit</h3>
<div class="nc-card-cta__actions">
<a href="/produkte/analytics" class="nc-button nc-button--ghost" aria-label="Dashboard testen – Analytics &amp; Reporting in Echtzeit" style="--nc-button-ghost-color: var(--fnd-color-always-light); --nc-button-ghost-border: var(--fnd-color-always-light);">Dashboard testen</a>
</div>
</div>
</div>
<div class="nc-card-cta" data-theme="dark" data-medien-ton="forest">
<img class="nc-card-cta__media" src="/assets/muster/einfuehrung-beratung-konzeption.jpg" alt="" loading="lazy" decoding="async">
<div class="nc-card-cta__overlay">
</div>
<div class="nc-card-cta__content">
<h3 class="nc-card-cta__title" style="max-width: 60%;">Enterprise Security für Ihr Team</h3>
<div class="nc-card-cta__actions">
<a href="/sicherheit" class="nc-button nc-button--primary" aria-label="Mehr erfahren – Enterprise Security für Ihr Team" style="--nc-button-primary-bg: var(--fnd-color-always-light); --nc-button-primary-color: var(--fnd-color-always-dark);">Mehr erfahren</a>
</div>
</div>
</div>
</div>`,
};
