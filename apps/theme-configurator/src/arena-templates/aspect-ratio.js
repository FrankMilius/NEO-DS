// Vorlage: aspect-ratio — Markup aus data/markup/aspect-ratio.html.
// Specimen „eigenes-verhaeltnis" (Plan v3, Phase 4): das SCSS nennt als API
// ein eigenes Verhaeltnis ueber die Komponenten-Variable am Element
// (`style="--nc-aspect-ratio-ratio: 21 / 9"`, 04-objects/_aspect-ratio.scss,
// Kopf „CUSTOM RATIO") — Instanzwert wie in Drupal; er ueberschreibt das
// Preset am selben Element (die Matrix verlangt einen Achsenwert).
import { BILD_SRC, esc } from './_helfer.js'
import { vorgabe } from './_bloecke-1.js'

export default (zelle, m) => {
  const eigenes = vorgabe(m, 'eigenesVerhaeltnis', null)
  const name = eigenes ? eigenes.replace(/\s*\/\s*/, ':') : (m.wert('ratio') || '').replace('-', ':')
  const stil = eigenes ? ` style="--nc-aspect-ratio-ratio: ${esc(eigenes)};"` : ''
  return `
<div class="${m.klasse}"${stil}${m.attrs}>
<img class="nc-aspect-ratio__content" src="${BILD_SRC}" alt="${esc(name)} Beispiel">
</div>
`
}
