// Vorlage: card-grid-cta — Markup aus data/markup/card-grid-cta.html (sechs
// Kacheln; render.kacheln zeigt die ersten n, Standard vier). Die Inline-
// Variablen fuer Knopffarben auf dunklem Bild und die Titelbreiten stehen so
// im geernteten Markup.
//
// Spaltenzahl und Seitenverhaeltnis sind Instanzwerte: Drupal setzt
// --cgc-columns und --cgc-ratio am Block (Website: 2 Spalten, 4/3). Ohne sie
// gelten die Vorgaben aus dem SCSS (3 Spalten; Karten 16/9). Specimens
// (Plan v3, Phase 4): render.instanz { spalten, verhaeltnis } oder null.
import { BILD_SRC, esc } from './_helfer.js'
import { vorgabe, desktop } from './_bloecke-1.js'

const HELL = 'style="--nc-button-primary-bg: var(--fnd-color-always-light); --nc-button-primary-color: var(--fnd-color-always-dark);"'
const GHOST = 'style="--nc-button-ghost-color: var(--fnd-color-always-light); --nc-button-ghost-border: var(--fnd-color-always-light);"'

const KACHELN = [
  ['Workplace Platform', 'Plattform entdecken', 'primary', 60],
  ['Analytics &amp; Reporting in Echtzeit', 'Dashboard testen', 'ghost', 80],
  ['Enterprise Security für Ihr Team', 'Mehr erfahren', 'primary', 60],
  ['KI-gestützte Workflows', 'Beta starten', 'primary', 80],
  ['Nahtlose Integrationen', 'Alle Apps', 'ghost', 100],
  ['Flexibel skalierbar', 'Preise ansehen', 'primary', 60]
]

const vorlage = (zelle, m) => {
  // instanz: null heisst „ohne Instanzwerte" (nicht: Vorgabe nehmen)
  const render = m.specimen.render || {}
  const instanz = 'instanz' in render ? render.instanz : { spalten: 2, verhaeltnis: '4/3' }
  const stil = instanz ? ` style="--cgc-columns: ${esc(instanz.spalten)}; --cgc-ratio: ${esc(instanz.verhaeltnis)};"` : ''
  const anzahl = vorgabe(m, 'kacheln', 4)
  return `
<div class="${m.klasse}"${stil}${m.attrs}>
${KACHELN.slice(0, anzahl).map(([titel, cta, art, breite]) => `<div class="nc-card-cta" data-theme="dark">
<img class="nc-card-cta__media" src="${BILD_SRC}" alt="" loading="lazy" decoding="async">
<div class="nc-card-cta__overlay"></div>
<div class="nc-card-cta__content">
<h3 class="nc-card-cta__title" style="max-width: ${breite}%;">${titel}</h3>
<div class="nc-card-cta__actions"><a href="#" onclick="return false" class="nc-button nc-button--${art}" ${art === 'ghost' ? GHOST : HELL}>${cta}</a></div>
</div>
</div>`).join('\n')}
</div>`
}

// Rahmen ra-desktop: fuer die Seitenbreite gebaut (Plan v3, Phase 4)
export default (zelle, m) => desktop(vorlage(zelle, m))
