// Vorlage: shot — Medien-Bauteil der Website (Entscheidung 07.10.2026,
// Punkt 3). Das Markup baut DIESELBE Funktion wie auf der Website:
// shotBauen aus neo-behaviors (Website: NeoBehaviors.shotAufbauen in
// neo-theme.js, vorher window.NeoShot.render). Die Vorlage setzt nur die
// Karten-Daten aus den Achsen ein (darstellung → preset, rahmen/schatten →
// frame/shadow, format → ratio).
//
// Zustaende, die das Verhalten erzeugt, entstehen hier auch durch das
// Verhalten: open = Klick auf den ersten Marker (die Erklaerung baut
// shot.js), danach wird das Behavior wieder geloest. hover = Lupe sichtbar
// ueber der Bildmitte (Lage fest, unter dem Zeiger setzt sie das Verhalten).
// „Ausprobieren": unbewegtes Markup, die Arena bindet das Behavior shot.
import { shotBauen, shotAufbauen } from 'neo-behaviors'
import { BILD_SRC } from './_helfer.js'

/** Zweites Bild fuer den Vergleich: dasselbe Motiv, andere Flaeche. */
export const BILD_SRC_2 = BILD_SRC.replace('%23c9ced6', '%239fb7c9').replaceAll('%23aab1bc', '%23587386')

export const KARTEN = {
  none: { focal: { x: 0.32, y: 0.38 }, zoom: 1.6, alt: 'Fokus-Crop' },
  frame: { focal: { x: 0.5, y: 0.45 }, zoom: 1.1, alt: 'Browser-Rahmen', url: 'workplace.neocosmo.de' },
  kenburns: { focal: { x: 0.25, y: 0.3 }, zoom: 1.6, alt: 'Ken-Burns', to: { x: 0.7, y: 0.6, zoom: 1.3 }, dur: 7 },
  lens: { focal: { x: 0.5, y: 0.5 }, alt: 'Lupe', lensSize: 160, lensZoom: 2.5 },
  hotspots: {
    focal: { x: 0.5, y: 0.5 },
    alt: 'Marker',
    hotspots: [
      { x: 0.3, y: 0.32, label: 'Suche', text: 'Volltextsuche über alle Bereiche.', focal: { x: 0.3, y: 0.32, zoom: 2.5 } },
      { x: 0.72, y: 0.6, text: 'Detail ohne Titel — Zoom nach Vorgabe.' }
    ]
  },
  compare: { focal: { x: 0.5, y: 0.5 }, alt: 'Vergleich', src2: BILD_SRC_2, start: 35 }
}

/** Optionen wie die Website sie aus einer Karte baut (neo-theme.js). */
export function optionen (m) {
  const preset = m.wert('darstellung') || 'none'
  const karte = {
    ...KARTEN[preset],
    preset,
    frame: m.wert('rahmen') === 'minimal' ? 'Minimal' : 'Browser',
    shadow: m.wert('schatten') !== 'ohne'
  }
  return {
    src: BILD_SRC,
    alt: karte.alt,
    focal: karte.focal,
    zoom: karte.zoom,
    ratio: m.wert('format') === 'ratio' ? '16/10' : undefined,
    preset,
    params: karte
  }
}

export default (zelle, m) => {
  const huelle = document.createElement('div')
  const opts = optionen(m)
  if (m.ausprobieren || (!m.hat('open') && !m.hat('hover'))) {
    shotBauen(huelle, opts)
    return '\n' + huelle.outerHTML + '\n'
  }
  const loesen = shotAufbauen(huelle, opts)
  if (m.hat('open') && opts.preset === 'hotspots') {
    /** @type {HTMLButtonElement|null} */ (huelle.querySelector('.nc-shot__hotspot'))?.click()
  }
  if (m.hat('hover') && opts.preset === 'lens') {
    const lupe = /** @type {HTMLElement|null} */ (huelle.querySelector('.nc-shot__lens'))
    const gross = /** @type {HTMLElement|null} */ (lupe?.querySelector('img') || null)
    if (lupe && gross) {
      lupe.style.display = 'block'
      lupe.style.left = 'calc(50% - 80px)'
      lupe.style.top = 'calc(50% - 80px)'
      gross.style.width = '1200px'
      gross.style.height = 'auto'
      gross.style.left = '-520px'
      gross.style.top = '-295px'
    }
  }
  huelle.removeAttribute('data-neo-behavior')
  const html = huelle.outerHTML
  loesen()
  return '\n' + html + '\n'
}
