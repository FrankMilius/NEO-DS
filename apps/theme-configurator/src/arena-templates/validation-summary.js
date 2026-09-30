// Vorlage: validation-summary — Markup aus data/markup/validation-summary.html.
// content: with-icon (Icon per slotConfig), with-links (Eintraege verlinken
// auf die Felder), text-only.
const KREUZ = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>'
const FEHLER = ['Vorname ist ein Pflichtfeld', 'E-Mail-Adresse ist ungültig', 'Passwort muss mindestens 8 Zeichen lang sein']

export default (zelle, m) => {
  const links = m.wert('content') === 'with-links'
  return `
<div class="${m.klasse}" role="alert"${m.attrs}>
${m.slot('icon') ? `<span class="nc-validation-summary__icon">${KREUZ}</span>` : ''}
<div>
<strong class="nc-validation-summary__title">Es sind ${FEHLER.length} Fehler aufgetreten:</strong>
<ul class="nc-validation-summary__list">
${FEHLER.map((f) => `<li class="nc-validation-summary__item">${links ? `<a href="#" onclick="return false">${f}</a>` : f}</li>`).join('\n')}
</ul>
</div>
</div>`
}
