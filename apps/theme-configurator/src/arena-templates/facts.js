// Vorlage: facts — Markup aus der Doku (docs/facts-docs.html, Beispiel
// „Produktdetails"; data/markup/facts.html gibt es nicht, die Story ist nur
// ein Platzhalter). content=with-title schaltet per slotConfig den Titel ein.
const FAKTEN = [
  ['Material', 'Recyceltes Aluminium, Klasse A'],
  ['Abmessungen', '240 &times; 120 &times; 60 mm'],
  ['Gewicht', '1,4 kg'],
  ['Garantie', '5 Jahre Herstellergarantie']
]

export default (zelle, m) => `
<div class="${m.klasse}"${m.attrs}>
${m.slot('title') ? '<p class="nc-facts-title">Produktdetails</p>' : ''}
<dl class="nc-facts-list">
${FAKTEN.map(([t, d]) => `<dt class="nc-facts-term">${t}</dt>\n<dd class="nc-facts-desc">${d}</dd>`).join('\n')}
</dl>
</div>`
