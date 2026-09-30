// Vorlage: empty-state — Markup aus data/markup/empty-state.html.
// Die content-Achse schaltet per slotConfig icon/description/actions.
export default (zelle, m) => `
<div class="${m.klasse}"${m.attrs}>
${m.slot('icon') ? `<div class="nc-empty-state__icon" aria-hidden="true">
<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="10" cy="10" r="7"></circle><line x1="21" y1="21" x2="15" y2="15"></line></svg>
</div>` : ''}
<h3 class="nc-empty-state__title">Keine Ergebnisse gefunden</h3>
${m.slot('description') ? '<p class="nc-empty-state__description">Versuche es mit anderen Suchbegriffen oder passe deine Filter an.</p>' : ''}
${m.slot('actions') ? `<div class="nc-empty-state__actions">
<button class="nc-button nc-button--sm" type="button">Filter zurücksetzen</button>
</div>` : ''}
</div>
`
