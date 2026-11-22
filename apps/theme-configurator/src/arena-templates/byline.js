// Vorlage: byline — Markup aus _blog.js (wie data/markup/byline.html, I15
// Phase 1, 22.11.2026). Das Foto ist ein .nc-avatar mit Initialen-Fallback;
// photo=initials laesst das Bild weg. size=sm setzt .nc-byline--sm (Karten).
import { byline } from './_blog.js'

export default (zelle, m) => byline({
  klasse: m.klasse,
  foto: (m.wert('photo') || 'image') === 'image',
  attrs: m.attrs
})
