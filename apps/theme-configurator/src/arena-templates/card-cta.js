// Vorlage: card-cta — Markup aus data/markup/card-cta.html (Website,
// /musterseite-bauteile). Die Inline-Variablen am Knopf stehen so im
// geernteten Markup (heller Knopf auf dunklem Bild).
//
// Achse ton (Recipe 1.1.0, Plan v3, Phase 4): data-theme am Wurzelelement —
// „dunkel" (data-theme="dark", wie auf der Website: heller Titel, dunkler
// Verlauf) oder „hell" (data-theme="light": Titel in text-primary, heller
// Verlauf; Regeln .nc-card-cta[data-theme="light"] in
// 06-molecules/_card-cta.scss). Auf heller Karte bleibt der Knopf beim
// Website-Standard (primary ohne Inline-Farben).
import { BILD_SRC } from './_helfer.js'

const HELL = ' style="--nc-button-primary-bg: var(--fnd-color-always-light); --nc-button-primary-color: var(--fnd-color-always-dark);"'

export default (zelle, m) => {
  const hell = m.wert('ton') === 'hell'
  return `
<div class="${m.klasse}" data-theme="${hell ? 'light' : 'dark'}"${m.attrs}>
<img class="nc-card-cta__media" src="${BILD_SRC}" alt="" loading="lazy" decoding="async">
<div class="nc-card-cta__overlay"></div>
<div class="nc-card-cta__content">
<h3 class="nc-card-cta__title">Flexibel skalierbar</h3>
<div class="nc-card-cta__actions">
<a href="#" onclick="return false" class="nc-button nc-button--primary"${hell ? '' : HELL}>Preise ansehen</a>
</div>
</div>
</div>
`
}
