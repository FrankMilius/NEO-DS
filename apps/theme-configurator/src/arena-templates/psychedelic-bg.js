// Psychedelic Background (.nc-psychedelic-bg) — Plan v3, Phase 3, Block
// Layout.
//
// Canvas-Effekt: gezeichnet wird mit dem vorhandenen Renderer des
// Konfigurators (src/lib/PsychedelicRenderer.js) — keine Neuentwicklung.
// Das DS hat fuer das Bauteil weder SCSS noch Verhalten in neo-behaviors
// („beschrieben, nicht gebaut", Entscheidung 25.08.2026); die Wurzelklasse
// kommt aus der Anatomie. Groesse gibt der Arena-Rahmen ra-effekt (die
// Anatomie: Canvas fuellt den Container absolut).
//
// Je Zelle: Form, Maus-Effekt, Farbmodus und Region aus den Achsen des
// Recipes; die uebrigen Werte (Dichte, Farben …) aus den Voreinstellungen,
// die die bisherige Arena je Muster hatte (data-ra-muster, JSON).
//   Zustände      ein Standbild (erstes Bild des Renderers, keine Animation)
//   Ausprobieren  laufende Animation, Maus-Effekt ueber der Flaeche;
//                 bei prefers-reduced-motion bleibt es beim Standbild
//                 (Recipe a11y: Animation stoppen)
import { esc } from './_helfer.js'
import { PsychedelicRenderer } from '../lib/PsychedelicRenderer.js'

// Werte der bisherigen PsychedelicBgArena.vue (Presets) je Specimen
const VOREINSTELLUNG = {
  'neocon-moire': {
    lineWidth: 1.5, frequency: 0.015, amplitude: 30, speed: 0.8, density: 60, gap: 8, scale: 1,
    mouseRadius: 150, mouseStrength: 0.5, color: '#00a5a5', bgColor: '#e63312', opacity: 1
  },
  'halftone-dots': {
    lineWidth: 1, frequency: 0.008, amplitude: 0, speed: 0.3, density: 60, gap: 12, scale: 1,
    mouseRadius: 180, mouseStrength: 0.8, bgColor: '#f5f5f5', opacity: 1
  },
  'concentric-waves': {
    lineWidth: 1, frequency: 0.01, amplitude: 15, speed: 0.5, density: 60, gap: 10, scale: 1,
    mouseRadius: 200, mouseStrength: 0.6, gradientStart: '#0077b6', gradientEnd: '#90e0ef', bgColor: '#03045e', opacity: 1
  },
  'triangle-mesh': {
    lineWidth: 1.5, frequency: 0.012, amplitude: 20, speed: 0.6, density: 60, gap: 18, scale: 1,
    mouseRadius: 160, mouseStrength: 0.7, palette: ['#ff006e', '#8338ec', '#3a86ff', '#fb5607', '#ffbe0b'], bgColor: '#0a0a0a', opacity: 1
  }
}

export default (zelle, m) => {
  const muster = {
    ...(VOREINSTELLUNG[m.specimen.id] || {}),
    shape: m.wert('shape') || 'lines',
    mouseEffect: m.wert('mouseEffect') || 'none',
    colorMode: m.wert('colorMode') || 'mono',
    region: m.wert('region') || 'full'
  }
  const modus = m.ausprobieren ? 'lebendig' : 'standbild'
  return `<div class="ra-effekt">
<div class="${m.klasse}"${m.attrs} data-ra-muster="${esc(JSON.stringify(muster))}" data-ra-modus="${modus}">
<canvas aria-hidden="true"></canvas>
</div>
</div>`
}

/** „Ausprobieren" ohne neo-behaviors: der Renderer der Arena (siehe oben). */
export const ausprobieren = {
  hinweis: 'Maus über die Fläche — gezeichnet vom Canvas-Renderer des Konfigurators (das DS hat für das Bauteil kein Verhalten).'
}

const reduziert = () => typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Genau ein Bild: start() zeichnet sofort, stop() bricht die Schleife ab.
 * Zeit auf 0, damit jedes Standbild (auch nach Groessenaenderung) gleich ist.
 */
function standbild (renderer) {
  renderer.time = 0
  renderer.start()
  renderer.stop()
}

/**
 * Renderer je Flaeche anlegen. Gibt eine Aufraeum-Funktion zurueck (die
 * RecipeArena ruft sie, bevor sie neu rendert, und beim Verlassen).
 * Ohne ResizeObserver (z. B. jsdom in den Tests) zeichnet der Renderer nicht.
 */
export function einrichten (zelle) {
  if (typeof ResizeObserver === 'undefined') return undefined
  const weg = []
  for (const flaeche of zelle.querySelectorAll('[data-ra-muster]')) {
    const canvas = flaeche.querySelector('canvas')
    if (!canvas || !canvas.getContext('2d')) continue
    let muster
    try { muster = JSON.parse(flaeche.getAttribute('data-ra-muster')) } catch { continue }
    const renderer = new PsychedelicRenderer(canvas, muster)
    if (flaeche.getAttribute('data-ra-modus') === 'lebendig' && !reduziert()) {
      renderer.start()
      weg.push(() => renderer.destroy())
    } else {
      standbild(renderer)
      // Groessenaenderung leert die Zeichenflaeche (der Renderer setzt
      // canvas.width neu) — das Standbild wird danach neu gezeichnet
      const beobachter = new ResizeObserver(() => standbild(renderer))
      beobachter.observe(flaeche)
      weg.push(() => { beobachter.disconnect(); renderer.destroy() })
    }
  }
  return () => weg.forEach((f) => f())
}
