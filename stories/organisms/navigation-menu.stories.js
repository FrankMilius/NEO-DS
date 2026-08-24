// ============================================================
// NavigationMenu — Auto-generated from navigation-menu-recipe.json
// Version: 2.0.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Organisms/NavigationMenu',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**NavigationMenu** v2.0.0 (stable)

Radix-UI Pattern: nav > ul > li > trigger/content.


`,
      },
    },
    status: { type: 'stable' },
  },
  argTypes: {},
};

export const Default = {
  name: 'Standard',
  render: () => `<!-- @quelle: geerntet von Doku /docs/navigation-menu-docs.html -->
<!-- @punkte: 38 -->`,
};

export const Standard = {
  name: 'Standard',
  render: () => `<nav class="nc-navigation-menu" aria-label="Hauptnavigation" style="display: flex;">
<ul class="nc-navigation-menu__list" role="menubar">
<li class="nc-navigation-menu__item" role="none">
<button class="nc-navigation-menu__trigger" type="button" role="menuitem" aria-haspopup="true" aria-expanded="false" data-state="closed">
<span>Produkte</span>
<span class="nc-navigation-menu__trigger-icon">
<svg viewBox="0 0 12 12" aria-hidden="true">
<polyline points="2 4 6 8 10 4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
</polyline>
</svg>
</span>
</button>
<div class="nc-navigation-menu__content nc-navigation-menu__content--two-col" data-state="closed" role="menu">
<div class="nc-navigation-menu__content-grid">
<a class="nc-navigation-menu__callout" href="#">
<div class="nc-navigation-menu__callout-title">Produkte</div>
<p class="nc-navigation-menu__callout-desc">Plattform-Bausteine für Intranet, App und Magazin.</p>
</a>
<div class="nc-navigation-menu__content-grid">
<a class="nc-navigation-menu__link" href="#" role="menuitem">
<div class="nc-navigation-menu__link-title">Social Intranet</div>
<p class="nc-navigation-menu__link-desc">News, Communities und Knowledge Hubs.</p>
</a>
<a class="nc-navigation-menu__link" href="#" role="menuitem">
<div class="nc-navigation-menu__link-title">Mitarbeiter App</div>
<p class="nc-navigation-menu__link-desc">Mobile Kommunikation für alle Teams.</p>
</a>
<a class="nc-navigation-menu__link" href="#" role="menuitem">
<div class="nc-navigation-menu__link-title">Magazin</div>
<p class="nc-navigation-menu__link-desc">Editorial Content und Storytelling.</p>
</a>
</div>
</div>
</div>
</li>
<li class="nc-navigation-menu__item" role="none">
<button class="nc-navigation-menu__trigger" type="button" role="menuitem" aria-haspopup="true" aria-expanded="false" data-state="closed">
<span>Services</span>
<span class="nc-navigation-menu__trigger-icon">
<svg viewBox="0 0 12 12" aria-hidden="true">
<polyline points="2 4 6 8 10 4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
</polyline>
</svg>
</span>
</button>
<div class="nc-navigation-menu__content nc-navigation-menu__content--two-col" data-state="closed" role="menu">
<div class="nc-navigation-menu__content-grid">
<a class="nc-navigation-menu__callout" href="#">
<div class="nc-navigation-menu__callout-title">Services</div>
<p class="nc-navigation-menu__callout-desc">Einführung, Support und langfristiger Erfolg.</p>
</a>
<div class="nc-navigation-menu__content-grid">
<a class="nc-navigation-menu__link" href="#" role="menuitem">
<div class="nc-navigation-menu__link-title">Einführungsberatung</div>
<p class="nc-navigation-menu__link-desc">Strategie, Rollout und Enablement.</p>
</a>
<a class="nc-navigation-menu__link" href="#" role="menuitem">
<div class="nc-navigation-menu__link-title">Support</div>
<p class="nc-navigation-menu__link-desc">Schnelle Hilfe mit klaren SLAs.</p>
</a>
<a class="nc-navigation-menu__link" href="#" role="menuitem">
<div class="nc-navigation-menu__link-title">Customer Success</div>
<p class="nc-navigation-menu__link-desc">Adoption, KPIs und Wachstum.</p>
</a>
</div>
</div>
</div>
</li>
<li class="nc-navigation-menu__item" role="none">
<a class="nc-navigation-menu__link--top" href="#" role="menuitem">Kunden</a>
</li>
<li class="nc-navigation-menu__item" role="none">
<a class="nc-navigation-menu__link--top" href="#" role="menuitem">News</a>
</li>
<li class="nc-navigation-menu__item" role="none">
<a class="nc-navigation-menu__link--top" href="#" role="menuitem">Über uns</a>
</li>
</ul>
<div class="nc-navigation-menu__indicator" data-state="hidden">
<div class="nc-navigation-menu__indicator-arrow">
</div>
</div>
<div class="nc-navigation-menu__viewport-wrapper">
<div class="nc-navigation-menu__viewport" data-state="closed">
</div>
</div>
</nav>`,
};
