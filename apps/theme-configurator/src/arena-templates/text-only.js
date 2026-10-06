// Vorlage: text-only — Aufbau aus scss/scss/06-molecules/_text-only.scss.
// Das Stylesheet kennt nur die Altklassen .text-only / .text-only-wrapper
// (Grid in > div > div, Absatz mit Wort-Spans, .button-container); die
// Recipe-Klassen nc-text-only* haben keine eigene Regel. Die Wurzel traegt
// deshalb beide (Entscheidungsfall: Recipe auf die Altklassen umstellen oder
// nc-text-only bauen). variant=scroll (has-scroll, ohne CSS): die Woerter
// faerben sich beim Scrollen ein — gezeigt wird der Endzustand (p.visible).
// Plan v3, Phase 4: Rahmen ra-desktop (Raster 1/8 erst ab desktop-up);
// render.compositionType „ohne-knopf": nur der Absatz (Doku
// „Standard-Ansicht"), sonst mit Button-Container.
const SATZ = 'Wir verbinden Menschen, Wissen und Werkzeuge an einem Ort — damit gute Arbeit nicht an Informationssilos scheitert.'

export default (zelle, m) => {
  const scroll = m.wert('variant') === 'scroll'
  const knopf = m.specimen.render?.compositionType !== 'ohne-knopf'
  const woerter = SATZ.split(' ').map((w) => `<span>${w}</span>`).join(' ')
  const klasse = m.klassen.filter((k) => k !== 'has-scroll').join(' ')
  return `<div class="ra-desktop">
<div class="text-only-wrapper">
<div class="${klasse} text-only"${m.attrs}>
<div><div>
<p class="nc-text-only__text${scroll ? ' nc-text-only__scroll-text visible' : ''}">${scroll ? woerter : SATZ}</p>
${knopf ? '<p class="button-container"><a href="#" onclick="return false" class="nc-button nc-button--primary"><span>Mehr erfahren</span></a></p>' : ''}
</div></div>
</div>
</div>
</div>`
}
