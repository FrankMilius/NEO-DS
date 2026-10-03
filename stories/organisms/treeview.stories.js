// ============================================================
// Treeview — Auto-generated from treeview-recipe.json
// Version: 2.1.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Organisms/Treeview',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**Treeview** v2.1.0 (stable)

Hierarchische Baumstruktur mit role=tree und role=treeitem.


`,
      },
    },
    status: { type: 'stable' },
  },
  argTypes: {},
};

export const Default = {
  name: 'Standard',
  render: () => `<nav class="nc-treeview" aria-label="Dateistruktur">
<ul class="nc-treeview__list" role="tree">
<li class="nc-treeview__item nc-treeview__item--branch" role="treeitem" aria-expanded="false" style="--_level: 0;">
<div class="nc-treeview__node" tabindex="0">
<button class="nc-treeview__toggle" type="button" tabindex="-1" aria-hidden="true">
<svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
<polyline points="6 4 10 8 6 12">
</polyline>
</svg>
</button>
<span class="nc-treeview__label">Ressourcen</span>
</div>
<ul class="nc-treeview__list" role="group">
<li class="nc-treeview__item nc-treeview__item--leaf" role="treeitem" style="--_level: 1;">
<div class="nc-treeview__node" tabindex="-1">
<span class="nc-treeview__toggle" aria-hidden="true">
<svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
<polyline points="6 4 10 8 6 12">
</polyline>
</svg>
</span>
<span class="nc-treeview__icon">
<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
<circle cx="12" cy="12" r="10">
</circle>
<line x1="2" y1="12" x2="22" y2="12">
</line>
<path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z">
</path>
</svg>
</span>
<a class="nc-treeview__link" href="https://developer.mozilla.org" target="_blank" rel="noopener noreferrer">MDN Web Docs <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
<path d="M6 3h7v7">
</path>
<path d="M13 3L6 10">
</path>
</svg>
</a>
</div>
</li>
<li class="nc-treeview__item nc-treeview__item--leaf" role="treeitem" style="--_level: 1;">
<div class="nc-treeview__node" tabindex="-1">
<span class="nc-treeview__toggle" aria-hidden="true">
<svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
<polyline points="6 4 10 8 6 12">
</polyline>
</svg>
</span>
<span class="nc-treeview__icon">
<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
<circle cx="12" cy="12" r="10">
</circle>
<line x1="2" y1="12" x2="22" y2="12">
</line>
<path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z">
</path>
</svg>
</span>
<a class="nc-treeview__link" href="https://www.w3.org/WAI/ARIA/apg/" target="_blank" rel="noopener noreferrer">W3C WAI-ARIA Practices <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
<path d="M6 3h7v7">
</path>
<path d="M13 3L6 10">
</path>
</svg>
</a>
</div>
</li>
<li class="nc-treeview__item nc-treeview__item--branch" role="treeitem" aria-expanded="false" style="--_level: 1;">
<div class="nc-treeview__node" tabindex="-1">
<button class="nc-treeview__toggle" type="button" tabindex="-1" aria-hidden="true">
<svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
<polyline points="6 4 10 8 6 12">
</polyline>
</svg>
</button>
<span class="nc-treeview__label">Frameworks</span>
</div>
<ul class="nc-treeview__list" role="group">
<li class="nc-treeview__item nc-treeview__item--leaf" role="treeitem" style="--_level: 2;">
<div class="nc-treeview__node" tabindex="-1">
<span class="nc-treeview__toggle" aria-hidden="true">
<svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
<polyline points="6 4 10 8 6 12">
</polyline>
</svg>
</span>
<span class="nc-treeview__icon">
<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
<circle cx="12" cy="12" r="10">
</circle>
<line x1="2" y1="12" x2="22" y2="12">
</line>
<path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z">
</path>
</svg>
</span>
<a class="nc-treeview__link" href="https://react.dev" target="_blank" rel="noopener noreferrer">React Docs <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
<path d="M6 3h7v7">
</path>
<path d="M13 3L6 10">
</path>
</svg>
</a>
</div>
</li>
<li class="nc-treeview__item nc-treeview__item--leaf" role="treeitem" style="--_level: 2;">
<div class="nc-treeview__node" tabindex="-1">
<span class="nc-treeview__toggle" aria-hidden="true">
<svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
<polyline points="6 4 10 8 6 12">
</polyline>
</svg>
</span>
<span class="nc-treeview__icon">
<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
<circle cx="12" cy="12" r="10">
</circle>
<line x1="2" y1="12" x2="22" y2="12">
</line>
<path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z">
</path>
</svg>
</span>
<a class="nc-treeview__link" href="https://vuejs.org" target="_blank" rel="noopener noreferrer">Vue.js <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
<path d="M6 3h7v7">
</path>
<path d="M13 3L6 10">
</path>
</svg>
</a>
</div>
</li>
<li class="nc-treeview__item nc-treeview__item--leaf" role="treeitem" style="--_level: 2;">
<div class="nc-treeview__node" tabindex="-1">
<span class="nc-treeview__toggle" aria-hidden="true">
<svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
<polyline points="6 4 10 8 6 12">
</polyline>
</svg>
</span>
<span class="nc-treeview__icon">
<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
<circle cx="12" cy="12" r="10">
</circle>
<line x1="2" y1="12" x2="22" y2="12">
</line>
<path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z">
</path>
</svg>
</span>
<a class="nc-treeview__link" href="https://svelte.dev" target="_blank" rel="noopener noreferrer">Svelte <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
<path d="M6 3h7v7">
</path>
<path d="M13 3L6 10">
</path>
</svg>
</a>
</div>
</li>
</ul>
</li>
</ul>
</li>
<li class="nc-treeview__item nc-treeview__item--branch" role="treeitem" aria-expanded="false" style="--_level: 0;">
<div class="nc-treeview__node" tabindex="-1">
<button class="nc-treeview__toggle" type="button" tabindex="-1" aria-hidden="true">
<svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
<polyline points="6 4 10 8 6 12">
</polyline>
</svg>
</button>
<span class="nc-treeview__label">Design Systems</span>
</div>
<ul class="nc-treeview__list" role="group">
<li class="nc-treeview__item nc-treeview__item--leaf" role="treeitem" style="--_level: 1;">
<div class="nc-treeview__node" tabindex="-1">
<span class="nc-treeview__toggle" aria-hidden="true">
<svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
<polyline points="6 4 10 8 6 12">
</polyline>
</svg>
</span>
<span class="nc-treeview__icon">
<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
<circle cx="12" cy="12" r="10">
</circle>
<line x1="2" y1="12" x2="22" y2="12">
</line>
<path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z">
</path>
</svg>
</span>
<a class="nc-treeview__link" href="https://carbondesignsystem.com" target="_blank" rel="noopener noreferrer">Carbon Design System <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
<path d="M6 3h7v7">
</path>
<path d="M13 3L6 10">
</path>
</svg>
</a>
</div>
</li>
<li class="nc-treeview__item nc-treeview__item--leaf" role="treeitem" style="--_level: 1;">
<div class="nc-treeview__node" tabindex="-1">
<span class="nc-treeview__toggle" aria-hidden="true">
<svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
<polyline points="6 4 10 8 6 12">
</polyline>
</svg>
</span>
<span class="nc-treeview__icon">
<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
<circle cx="12" cy="12" r="10">
</circle>
<line x1="2" y1="12" x2="22" y2="12">
</line>
<path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z">
</path>
</svg>
</span>
<a class="nc-treeview__link" href="https://ui.shadcn.com" target="_blank" rel="noopener noreferrer">shadcn/ui <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
<path d="M6 3h7v7">
</path>
<path d="M13 3L6 10">
</path>
</svg>
</a>
</div>
</li>
<li class="nc-treeview__item nc-treeview__item--leaf" role="treeitem" style="--_level: 1;">
<div class="nc-treeview__node" tabindex="-1">
<span class="nc-treeview__toggle" aria-hidden="true">
<svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
<polyline points="6 4 10 8 6 12">
</polyline>
</svg>
</span>
<span class="nc-treeview__icon">
<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
<circle cx="12" cy="12" r="10">
</circle>
<line x1="2" y1="12" x2="22" y2="12">
</line>
<path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z">
</path>
</svg>
</span>
<a class="nc-treeview__link" href="https://m3.material.io" target="_blank" rel="noopener noreferrer">Material Design <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
<path d="M6 3h7v7">
</path>
<path d="M13 3L6 10">
</path>
</svg>
</a>
</div>
</li>
</ul>
</li>
<li class="nc-treeview__item nc-treeview__item--branch" role="treeitem" aria-expanded="false" style="--_level: 0;">
<div class="nc-treeview__node" tabindex="-1">
<button class="nc-treeview__toggle" type="button" tabindex="-1" aria-hidden="true">
<svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
<polyline points="6 4 10 8 6 12">
</polyline>
</svg>
</button>
<span class="nc-treeview__label">Tools</span>
</div>
<ul class="nc-treeview__list" role="group">
<li class="nc-treeview__item nc-treeview__item--leaf" role="treeitem" style="--_level: 1;">
<div class="nc-treeview__node" tabindex="-1">
<span class="nc-treeview__toggle" aria-hidden="true">
<svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
<polyline points="6 4 10 8 6 12">
</polyline>
</svg>
</span>
<span class="nc-treeview__icon">
<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
<circle cx="12" cy="12" r="10">
</circle>
<line x1="2" y1="12" x2="22" y2="12">
</line>
<path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z">
</path>
</svg>
</span>
<a class="nc-treeview__link" href="https://github.com" target="_blank" rel="noopener noreferrer">GitHub <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
<path d="M6 3h7v7">
</path>
<path d="M13 3L6 10">
</path>
</svg>
</a>
</div>
</li>
<li class="nc-treeview__item nc-treeview__item--leaf" role="treeitem" style="--_level: 1;">
<div class="nc-treeview__node" tabindex="-1">
<span class="nc-treeview__toggle" aria-hidden="true">
<svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
<polyline points="6 4 10 8 6 12">
</polyline>
</svg>
</span>
<span class="nc-treeview__icon">
<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
<circle cx="12" cy="12" r="10">
</circle>
<line x1="2" y1="12" x2="22" y2="12">
</line>
<path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z">
</path>
</svg>
</span>
<a class="nc-treeview__link" href="https://www.figma.com" target="_blank" rel="noopener noreferrer">Figma <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
<path d="M6 3h7v7">
</path>
<path d="M13 3L6 10">
</path>
</svg>
</a>
</div>
</li>
</ul>
</li>
</ul>
</nav>`,
};
