// Vorlage: form-actions — Markup aus data/markup/form-actions.html.
// Ausrichtung und Variante kommen als Modifier aus dem Recipe.
export default (zelle, m) => `
<div class="${m.klasse}"${m.attrs}>
${m.wert('alignment') === 'spread' ? '<button type="button" class="nc-button nc-button--ghost">Zurück</button>\n' : ''}<button type="button" class="nc-button nc-button--primary">Speichern</button>
<button type="button" class="nc-button nc-button--secondary">Abbrechen</button>
</div>
`
