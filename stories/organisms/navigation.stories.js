// ============================================================
// Navigation — Auto-generated from navigation-recipe.json
// Version: 2.0.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Organisms/Navigation',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**Navigation** v2.0.0 (stable)

nc-header: sticky top, backdrop-filter blur, bg-base 90% opacity, border-bottom.


`,
      },
    },
    status: { type: 'stable' },
  },
  argTypes: {},
};

export const Default = {
  name: 'Standard',
  render: () => `<!-- @quelle: geerntet von Doku /docs/navigation-docs.html -->
<!-- @punkte: 38 -->`,
};

export const Standard = {
  name: 'Standard',
  render: () => `<header class="nc-header" style="position: relative;">
<nav class="nc-nav" aria-label="Hauptnavigation">
<div class="nc-nav__inner">
<a class="nc-brand" href="#">markenname</a>
<ul class="nc-nav__list" style="display: flex;">
<li class="nc-nav__item">
<button class="nc-nav__link" type="button" aria-haspopup="true" aria-expanded="false" style="display: inline-flex; align-items: center; gap: 4px; cursor: pointer; background: none; border-width: medium; border-style: none; border-color: currentcolor; border-image: none; font: inherit; padding: 4px 8px; border-radius: var(--fnd-radius-md); color: var(--fnd-color-text-high);">
<span>Produkte</span>
<span class="nc-nav__chevron">
<svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
<polyline points="2 4 6 8 10 4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
</polyline>
</svg>
</span>
</button>
<div class="nc-mega" style="z-index: 100;">
<div class="nc-mega__inner">
<div class="nc-mega__meta">
<span class="nc-mega__eyebrow">Produktbereich</span>
<strong>Produkte</strong>
<p>Plattform-Bausteine für Intranet, App und Magazin.</p>
</div>
<div style="display: flex; flex-direction: column; gap: 8px;">
<a href="#" style="display: block; padding: 8px 12px; border-radius: var(--fnd-radius-md); text-decoration: none; color: var(--fnd-color-text-high);">Social Intranet<p style="margin: 2px 0px 0px; font-size: 0.85rem; color: var(--fnd-color-text-mid);">News, Communities und Knowledge Hubs.</p>
</a>
<a href="#" style="display: block; padding: 8px 12px; border-radius: var(--fnd-radius-md); text-decoration: none; color: var(--fnd-color-text-high);">Mitarbeiter App<p style="margin: 2px 0px 0px; font-size: 0.85rem; color: var(--fnd-color-text-mid);">Mobile Kommunikation für alle Teams.</p>
</a>
<a href="#" style="display: block; padding: 8px 12px; border-radius: var(--fnd-radius-md); text-decoration: none; color: var(--fnd-color-text-high);">Magazin<p style="margin: 2px 0px 0px; font-size: 0.85rem; color: var(--fnd-color-text-mid);">Editorial Content und Storytelling.</p>
</a>
</div>
</div>
</div>
</li>
<li class="nc-nav__item">
<button class="nc-nav__link" type="button" aria-haspopup="true" aria-expanded="false" style="display: inline-flex; align-items: center; gap: 4px; cursor: pointer; background: none; border-width: medium; border-style: none; border-color: currentcolor; border-image: none; font: inherit; padding: 4px 8px; border-radius: var(--fnd-radius-md); color: var(--fnd-color-text-high);">
<span>Services</span>
<span class="nc-nav__chevron">
<svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
<polyline points="2 4 6 8 10 4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
</polyline>
</svg>
</span>
</button>
<div class="nc-mega" style="z-index: 100;">
<div class="nc-mega__inner">
<div class="nc-mega__meta">
<span class="nc-mega__eyebrow">Produktbereich</span>
<strong>Services</strong>
<p>Einführung, Support und langfristiger Erfolg.</p>
</div>
<div style="display: flex; flex-direction: column; gap: 8px;">
<a href="#" style="display: block; padding: 8px 12px; border-radius: var(--fnd-radius-md); text-decoration: none; color: var(--fnd-color-text-high);">Einführungsberatung<p style="margin: 2px 0px 0px; font-size: 0.85rem; color: var(--fnd-color-text-mid);">Strategie, Rollout und Enablement.</p>
</a>
<a href="#" style="display: block; padding: 8px 12px; border-radius: var(--fnd-radius-md); text-decoration: none; color: var(--fnd-color-text-high);">Support<p style="margin: 2px 0px 0px; font-size: 0.85rem; color: var(--fnd-color-text-mid);">Schnelle Hilfe mit klaren SLAs.</p>
</a>
<a href="#" style="display: block; padding: 8px 12px; border-radius: var(--fnd-radius-md); text-decoration: none; color: var(--fnd-color-text-high);">Customer Success<p style="margin: 2px 0px 0px; font-size: 0.85rem; color: var(--fnd-color-text-mid);">Adoption, KPIs und Wachstum.</p>
</a>
</div>
</div>
</div>
</li>
<li class="nc-nav__item">
<a href="#" style="padding: 4px 8px; border-radius: var(--fnd-radius-md); text-decoration: none; color: var(--fnd-color-text-high);">Kunden</a>
</li>
<li class="nc-nav__item">
<a href="#" style="padding: 4px 8px; border-radius: var(--fnd-radius-md); text-decoration: none; color: var(--fnd-color-text-high);">News</a>
</li>
<li class="nc-nav__item">
<a href="#" style="padding: 4px 8px; border-radius: var(--fnd-radius-md); text-decoration: none; color: var(--fnd-color-text-high);">Über uns</a>
</li>
</ul>
<div class="nc-tools" style="display: flex;">
<button type="button" aria-label="Suche öffnen" style="background: none; border-width: medium; border-style: none; border-color: currentcolor; border-image: none; cursor: pointer; padding: 6px; border-radius: var(--fnd-radius-md); color: var(--fnd-color-text-high);">
<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
<circle cx="11" cy="11" r="8">
</circle>
<line x1="21" y1="21" x2="16.65" y2="16.65">
</line>
</svg>
</button>
</div>
<button class="nc-mobile-toggle" type="button" aria-label="Navigation öffnen" style="background: none; border-width: medium; border-style: none; border-color: currentcolor; border-image: none; cursor: pointer; color: var(--fnd-color-text-high);">
<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
<line x1="3" y1="6" x2="21" y2="6">
</line>
<line x1="3" y1="12" x2="21" y2="12">
</line>
<line x1="3" y1="18" x2="21" y2="18">
</line>
</svg>
</button>
</div>
</nav>
</header>`,
};
