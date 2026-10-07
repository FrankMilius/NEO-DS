// Vorlage: media-frame (04-objects/_media-frame.scss) — Plan v3, Phase 5.
// Website: die Klasse sitzt direkt am Bild (text-media:
// img.nc-text-media__image.nc-media-frame, data/markup/text-media.html);
// als Rahmen um <img>/<picture>/<video> fuellt das Kind ihn ohne Luecke.
// .nc-surface-muted ist die zweite, kombinierbare Ebene derselben Datei
// (Slot `surface`, steht aussen).
import { slotAn } from './_bloecke-1.js'
import { BILD_SRC } from './_helfer.js'

const BILD = `<img src="${BILD_SRC}" alt="Produkt-Screenshot" width="320" height="180">`

export default (zelle, m) => {
  if (m.specimen.render?.amBild) {
    return `<img src="${BILD_SRC}" alt="Produkt-Screenshot" width="320" height="180" class="${m.klasse}"${m.attrs}>`
  }
  const rahmen = `<figure class="${m.klasse}"${m.attrs}>
${BILD}
</figure>`
  if (slotAn(m, 'surface')) {
    return `<div class="nc-surface-muted">
${rahmen}
</div>`
  }
  return rahmen
}
