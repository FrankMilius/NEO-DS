// Vorlage: text-blocks — Markup aus data/markup/text-blocks.html und
// _text-blocks.scss: section-title, eyebrow und lead sind eigene Klassen
// (nc-section-title / nc-eyebrow / nc-lead). data-recipe-wurzel markiert
// eyebrow/lead als Wurzel dieses Recipes. Plan v3, Phase 4:
// render.compositionType „kombination": Eyebrow, Abschnittstitel und Lead
// zusammen (Doku „Kombinierte Verwendung"), „typskala": dieselbe Kombination
// mit --type-scale 0.85 aus der Umgebung (Rahmen ra-typskala — Titel und
// Lead multiplizieren damit, die Eyebrow nicht).
const KOMBINATION = (m) => `<div class="ra-feld ra-feld--breit">
<p class="nc-eyebrow">Unsere Plattform</p>
<h2 class="${m.klasse}"${m.attrs}>Arbeiten neu gedacht</h2>
<p class="nc-lead">Mit unserer integrierten Lösung verbinden Sie Kommunikation, Wissen und Zusammenarbeit auf einer Plattform.</p>
</div>`

export default (zelle, m) => {
  switch (m.specimen.render?.compositionType) {
    case 'kombination':
      return KOMBINATION(m)
    case 'typskala':
      return `<div class="ra-typskala">${KOMBINATION(m)}</div>`
  }
  switch (m.wert('variant')) {
    case 'eyebrow':
      return `<p class="nc-eyebrow" data-recipe-wurzel="${m.root}"${m.attrs}>Digital Workplace</p>`
    case 'lead':
      return `<p class="nc-lead" data-recipe-wurzel="${m.root}"${m.attrs}>Die vollständige Lösung für Ihr digitales Business.</p>`
    default:
      return `<h2 class="${m.klasse}"${m.attrs}>Jetzt starten</h2>`
  }
}
