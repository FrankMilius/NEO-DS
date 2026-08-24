// ============================================================
// Tabs — Auto-generated from tabs-recipe.json
// Version: 1.0.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Molecules/Tabs',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**Tabs** v1.0.0 (stable)

Tabs verwenden WAI-ARIA Tabs Pattern (role=tablist/tab/tabpanel).


`,
      },
    },
    status: { type: 'stable' },
  },
  argTypes: {},
};

export const Default = {
  name: 'Standard',
  render: () => `<!-- @quelle: geerntet von Doku /docs/tabs-docs.html -->
<!-- @punkte: 38 -->`,
};

export const Standard = {
  name: 'Standard',
  render: () => `<div class="nc-tabs nc-tabs--line">
<div class="nc-tabs__list" role="tablist" aria-label="Demo Tabs">
<span class="nc-tooltip nc-tooltip--bottom">
<button class="nc-tabs__trigger nc-tabs__trigger--icon-only" role="tab" aria-selected="true" aria-controls="sc-tooltip-line-panel-0" id="sc-tooltip-line-tab-0" tabindex="0" type="button" aria-label="Startseite" aria-describedby="sc-tooltip-line-tooltip-0">
<span class="nc-tabs__trigger-icon">
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
<polyline points="5 12 3 12 12 3 21 12 19 12">
</polyline>
<path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7">
</path>
<path d="M9 21v-6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v6">
</path>
</svg>
</span>
<span class="nc-tabs__trigger-label">Startseite</span>
</button>
<span class="nc-tooltip__content" role="tooltip" id="sc-tooltip-line-tooltip-0">Startseite<span class="nc-tooltip__arrow">
</span>
</span>
</span>
<span class="nc-tooltip nc-tooltip--bottom">
<button class="nc-tabs__trigger nc-tabs__trigger--icon-only" role="tab" aria-selected="false" aria-controls="sc-tooltip-line-panel-1" id="sc-tooltip-line-tab-1" tabindex="-1" type="button" aria-label="Profil" aria-describedby="sc-tooltip-line-tooltip-1">
<span class="nc-tabs__trigger-icon">
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
<circle cx="12" cy="7" r="4">
</circle>
<path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2">
</path>
</svg>
</span>
<span class="nc-tabs__trigger-label">Profil</span>
</button>
<span class="nc-tooltip__content" role="tooltip" id="sc-tooltip-line-tooltip-1">Profil<span class="nc-tooltip__arrow">
</span>
</span>
</span>
<span class="nc-tooltip nc-tooltip--bottom">
<button class="nc-tabs__trigger nc-tabs__trigger--icon-only" role="tab" aria-selected="false" aria-controls="sc-tooltip-line-panel-2" id="sc-tooltip-line-tab-2" tabindex="-1" type="button" aria-label="Suche" aria-describedby="sc-tooltip-line-tooltip-2">
<span class="nc-tabs__trigger-icon">
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
<circle cx="10" cy="10" r="7">
</circle>
<line x1="21" y1="21" x2="15" y2="15">
</line>
</svg>
</span>
<span class="nc-tabs__trigger-label">Suche</span>
</button>
<span class="nc-tooltip__content" role="tooltip" id="sc-tooltip-line-tooltip-2">Suche<span class="nc-tooltip__arrow">
</span>
</span>
</span>
<span class="nc-tooltip nc-tooltip--bottom">
<button class="nc-tabs__trigger nc-tabs__trigger--icon-only" role="tab" aria-selected="false" aria-controls="sc-tooltip-line-panel-3" id="sc-tooltip-line-tab-3" tabindex="-1" type="button" aria-label="Benachrichtigungen" aria-describedby="sc-tooltip-line-tooltip-3">
<span class="nc-tabs__trigger-icon">
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
<path d="M10 5a2 2 0 0 1 4 0c2.34 1.11 3.88 3.41 4 6v3c.15 1.26.89 2.37 2 3H4c1.11-.63 1.85-1.74 2-3v-3c.12-2.59 1.66-4.89 4-6">
</path>
<path d="M9 17v1a3 3 0 0 0 6 0v-1">
</path>
</svg>
</span>
<span class="nc-tabs__trigger-label">Benachrichtigungen</span>
</button>
<span class="nc-tooltip__content" role="tooltip" id="sc-tooltip-line-tooltip-3">Benachrichtigungen<span class="nc-tooltip__arrow">
</span>
</span>
</span>
<span class="nc-tooltip nc-tooltip--bottom">
<button class="nc-tabs__trigger nc-tabs__trigger--icon-only" role="tab" aria-selected="false" aria-controls="sc-tooltip-line-panel-4" id="sc-tooltip-line-tab-4" tabindex="-1" type="button" aria-label="Einstellungen" aria-describedby="sc-tooltip-line-tooltip-4">
<span class="nc-tabs__trigger-icon">
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
<circle cx="14" cy="6" r="2">
</circle>
<line x1="4" y1="6" x2="12" y2="6">
</line>
<line x1="16" y1="6" x2="20" y2="6">
</line>
<circle cx="8" cy="12" r="2">
</circle>
<line x1="4" y1="12" x2="6" y2="12">
</line>
<line x1="10" y1="12" x2="20" y2="12">
</line>
<circle cx="17" cy="18" r="2">
</circle>
<line x1="4" y1="18" x2="15" y2="18">
</line>
<line x1="19" y1="18" x2="20" y2="18">
</line>
</svg>
</span>
<span class="nc-tabs__trigger-label">Einstellungen</span>
</button>
<span class="nc-tooltip__content" role="tooltip" id="sc-tooltip-line-tooltip-4">Einstellungen<span class="nc-tooltip__arrow">
</span>
</span>
</span>
</div>
<div class="nc-tabs__panel is-active" role="tabpanel" id="sc-tooltip-line-panel-0" aria-labelledby="sc-tooltip-line-tab-0">
<p style="padding: var(--fnd-spacing-04); color: var(--fnd-color-text-mid);">Startseite-Panel.</p>
</div>
<div class="nc-tabs__panel" role="tabpanel" id="sc-tooltip-line-panel-1" aria-labelledby="sc-tooltip-line-tab-1">
<p style="padding: var(--fnd-spacing-04); color: var(--fnd-color-text-mid);">Profil-Panel.</p>
</div>
<div class="nc-tabs__panel" role="tabpanel" id="sc-tooltip-line-panel-2" aria-labelledby="sc-tooltip-line-tab-2">
<p style="padding: var(--fnd-spacing-04); color: var(--fnd-color-text-mid);">Such-Panel.</p>
</div>
<div class="nc-tabs__panel" role="tabpanel" id="sc-tooltip-line-panel-3" aria-labelledby="sc-tooltip-line-tab-3">
<p style="padding: var(--fnd-spacing-04); color: var(--fnd-color-text-mid);">Benachrichtigungen-Panel.</p>
</div>
<div class="nc-tabs__panel" role="tabpanel" id="sc-tooltip-line-panel-4" aria-labelledby="sc-tooltip-line-tab-4">
<p style="padding: var(--fnd-spacing-04); color: var(--fnd-color-text-mid);">Einstellungen-Panel.</p>
</div>
</div>`,
};
