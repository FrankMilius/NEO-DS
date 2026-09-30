// Vorlage: question — Markup aus data/markup/question.html (zwei Laufzeilen,
// Laufanimation angehalten wie in der Ernte). variant=with-text setzt den
// Modifier und stellt den Knoepfen einen Absatz voran (question-paragraphs).
const ICON = '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"></path></svg>'

const ZEILEN = [
  ['Wie können wir effizienter werden?', 'Was wäre wenn alles möglich ist?', '0'],
  ['Welche Lösung passt zu uns?', 'Wie wachsen wir nachhaltig?', '-20%']
]

export default (zelle, m) => {
  const mitText = m.wert('variant') === 'with-text'
  return `
<section class="${m.klasse}"${m.attrs}>
${ZEILEN.map(([a, b, x]) => `<hr>
<div class="question-text-row" style="animation: none; transform: translateX(${x});" aria-hidden="true">
<span class="question-text">${a} ${ICON} ${b} ${ICON} ${a} ${ICON} ${b} ${ICON}</span>
</div>`).join('\n')}
<hr>
<div class="question-action-section${mitText ? ' with-text' : ''}">
${mitText ? '<div class="question-text-container question-paragraphs"><p>Gute Fragen verdienen gute Antworten. Wir zeigen Ihnen, wie andere Organisationen sie gefunden haben.</p></div>' : ''}
<div class="question-buttons">
<button class="nc-button nc-button--primary" type="button">Demo vereinbaren</button>
<button class="nc-button nc-button--outline" type="button">Mehr erfahren</button>
</div>
</div>
<hr>
</section>`
}
