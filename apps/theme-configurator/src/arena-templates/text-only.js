// Vorlage: text-only — Aufbau aus scss/scss/06-molecules/_text-only.scss.
// Das Recipe fuehrt seit der Entscheidung 06.10.2026 die gebauten Klassen:
// .text-only-wrapper > .text-only > div > div (Raster ab desktop-up), Absatz
// mit Wort-Spans, .button-container. variant=scroll hat keinen Modifier:
// die Woerter faerben sich beim Scrollen ein — gezeigt wird der Endzustand
// (p.visible). Plan v3, Phase 4: Rahmen ra-desktop (Raster 1/8 erst ab
// desktop-up); render.compositionType „ohne-knopf": nur der Absatz (Doku
// „Standard-Ansicht"), sonst mit Button-Container.
const SATZ = 'Wir verbinden Menschen, Wissen und Werkzeuge an einem Ort — damit gute Arbeit nicht an Informationssilos scheitert.'

export default (zelle, m) => {
  const scroll = m.wert('variant') === 'scroll'
  const knopf = m.specimen.render?.compositionType !== 'ohne-knopf'
  const woerter = SATZ.split(' ').map((w) => `<span>${w}</span>`).join(' ')
  return `<div class="ra-desktop">
<div class="text-only-wrapper">
<div class="${m.klasse}"${m.attrs}>
<div><div>
<p${scroll ? ' class="visible"' : ''}>${scroll ? woerter : SATZ}</p>
${knopf ? '<p class="button-container"><a href="#" onclick="return false" class="nc-button nc-button--primary"><span>Mehr erfahren</span></a></p>' : ''}
</div></div>
</div>
</div>
</div>`
}
