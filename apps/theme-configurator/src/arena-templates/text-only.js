// Vorlage: text-only — Aufbau aus scss/scss/06-molecules/_text-only.scss.
// Das Stylesheet kennt nur die Altklassen .text-only / .text-only-wrapper
// (Grid in > div > div, Absatz mit Wort-Spans, .button-container); die
// Recipe-Klassen nc-text-only* haben keine eigene Regel. Die Wurzel traegt
// deshalb beide. variant=scroll (has-scroll): die Woerter faerben sich beim
// Scrollen ein — gezeigt wird der Endzustand (p.visible).
const SATZ = 'Wir verbinden Menschen, Wissen und Werkzeuge an einem Ort — damit gute Arbeit nicht an Informationssilos scheitert.'

export default (zelle, m) => {
  const scroll = m.wert('variant') === 'scroll'
  const woerter = SATZ.split(' ').map((w) => `<span>${w}</span>`).join(' ')
  return `
<div class="text-only-wrapper">
<div class="${m.klasse} text-only"${m.attrs}>
<div><div>
<p class="nc-text-only__text${scroll ? ' nc-text-only__scroll-text visible' : ''}">${scroll ? woerter : SATZ}</p>
<p class="button-container"><a href="#" onclick="return false" class="nc-button nc-button--primary"><span>Mehr erfahren</span></a></p>
</div></div>
</div>
</div>`
}
