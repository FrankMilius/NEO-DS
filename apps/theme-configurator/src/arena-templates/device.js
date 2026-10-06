// Vorlage: device — Markup aus data/markup/device.html. Achsen size/tilt/notch
// wirken nur ueber Modifier am Wurzelelement. render.beschriftung (Plan v3,
// Phase 4): Fassung „Mit Beschriftung" — figure.nc-device-figure um den
// Rahmen, figcaption mit Name und Text (Slot caption).
import { vorgabe, SCREEN_SRC } from './_bloecke-1.js'

const rahmen = (m, alt) => `<div class="${m.klasse}"${m.attrs}>
<div class="nc-device__screen">
<img src="${SCREEN_SRC}" alt="${alt}" width="800" height="1740" loading="lazy" decoding="async">
</div>
</div>`

export default (zelle, m) => {
  if (!vorgabe(m, 'beschriftung', false)) return '\n' + rahmen(m, 'App-Ansicht') + '\n'
  return `
<figure class="nc-device-figure">
${rahmen(m, 'Startseite mit Unternehmensnews')}
<figcaption class="nc-device-figure__caption">
<span class="nc-device-figure__name">News</span>
<span class="nc-device-figure__text">Unternehmensnews und Meldungen aus den Bereichen — sortiert nach dem, was für die eigene Rolle zählt.</span>
</figcaption>
</figure>
`
}
