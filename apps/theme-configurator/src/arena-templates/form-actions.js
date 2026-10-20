// Vorlage: form-actions — Markup aus data/markup/form-actions.html.
// Ausrichtung und Variante kommen als Modifier aus dem Recipe.
// Sticky (R10, 20.10.2026): Die Leiste zieht sich mit negativem Rand um
// spacing-04 in den Innenabstand des Formulars (_form-actions.scss). Ohne
// Formular mit diesem Innenabstand ragte sie 2 × 16 px aus der Zelle — auf
// der Website steht sie immer in einem solchen Formular.
export default (zelle, m) => {
  const leiste = `
<div class="${m.klasse}"${m.attrs}>
${m.wert('alignment') === 'spread' ? '<button type="button" class="nc-button nc-button--ghost">Zurück</button>\n' : ''}<button type="button" class="nc-button nc-button--primary">Speichern</button>
<button type="button" class="nc-button nc-button--secondary">Abbrechen</button>
</div>
`
  return m.wert('variant') === 'sticky'
    ? `<div style="padding-inline: var(--fnd-spacing-04);">${leiste}</div>`
    : leiste
}
