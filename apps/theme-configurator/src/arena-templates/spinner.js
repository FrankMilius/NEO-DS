// Vorlage: spinner — Markup aus data/markup/spinner.html
// (<div class="nc-spinner" role="status">). Sonderfall-Arena vorhanden.
export default (zelle, m) => `<div class="${m.klasse}" role="status" aria-label="Wird geladen"${m.attrs}></div>`
