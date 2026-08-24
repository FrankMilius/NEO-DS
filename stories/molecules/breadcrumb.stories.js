// ============================================================
// Breadcrumb — Auto-generated from breadcrumb-recipe.json
// Version: 2.0.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Molecules/Breadcrumb',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**Breadcrumb** v2.0.0 (stable)

Wrapper ist <nav class='nc-breadcrumb' aria-label='Breadcrumb'>.


`,
      },
    },
    status: { type: 'stable' },
  },
  argTypes: {},
};

export const Default = {
  name: 'Standard',
  render: () => `<nav class="nc-breadcrumb" aria-label="Breadcrumb" data-breadcrumb-truncated="" data-breadcrumb-hidden-items="[{&quot;label&quot;:&quot;Dashboard&quot;,&quot;href&quot;:&quot;#&quot;},{&quot;label&quot;:&quot;Einstellungen&quot;,&quot;href&quot;:&quot;#&quot;},{&quot;label&quot;:&quot;Benutzer&quot;,&quot;href&quot;:&quot;#&quot;}]">
<ol class="nc-breadcrumb__list">
<li class="nc-breadcrumb__item">
<a class="nc-breadcrumb__link" href="#">Home</a>
<span class="nc-breadcrumb__separator" aria-hidden="true">
<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
<polyline points="9 18 15 12 9 6">
</polyline>
</svg>
</span>
</li>
<li class="nc-breadcrumb__item nc-breadcrumb__ellipsis-wrap">
<button class="nc-breadcrumb__ellipsis" aria-label="Versteckte Seiten anzeigen" aria-haspopup="true" aria-expanded="false">
<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
<circle cx="5" cy="12" r="2">
</circle>
<circle cx="12" cy="12" r="2">
</circle>
<circle cx="19" cy="12" r="2">
</circle>
</svg>
</button>
<ul class="nc-breadcrumb__dropdown" role="menu">
<li role="none">
<a class="nc-breadcrumb__dropdown-item" role="menuitem" tabindex="-1" href="#">Dashboard</a>
</li>
<li role="none">
<a class="nc-breadcrumb__dropdown-item" role="menuitem" tabindex="-1" href="#">Einstellungen</a>
</li>
<li role="none">
<a class="nc-breadcrumb__dropdown-item" role="menuitem" tabindex="-1" href="#">Benutzer</a>
</li>
</ul>
<span class="nc-breadcrumb__separator" aria-hidden="true">
<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
<polyline points="9 18 15 12 9 6">
</polyline>
</svg>
</span>
</li>
<li class="nc-breadcrumb__item">
<a class="nc-breadcrumb__link" href="#">Verwaltung</a>
<span class="nc-breadcrumb__separator" aria-hidden="true">
<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
<polyline points="9 18 15 12 9 6">
</polyline>
</svg>
</span>
</li>
<li class="nc-breadcrumb__item">
<span class="nc-breadcrumb__page" aria-current="page">Profil</span>
</li>
</ol>
</nav>`,
};
