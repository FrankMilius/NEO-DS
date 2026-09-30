// Vorlage: device — Markup aus data/markup/device.html. Achsen size/tilt/notch
// wirken nur ueber Modifier am Wurzelelement.
import { BILD_SRC } from './_helfer.js'

export default (zelle, m) => `
<div class="${m.klasse}"${m.attrs}>
<div class="nc-device__screen">
<img src="${BILD_SRC}" alt="App-Ansicht" width="800" height="1740" loading="lazy" decoding="async">
</div>
</div>
`
