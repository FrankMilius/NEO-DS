// Vorlage: testimonial-grid — Raster aus nc-testimonial-Bloecken
// (data/markup/testimonial.html) plus Navigation (Slots nav/btn laut
// scss/scss/06-molecules/_testimonial-grid.scss). variante per Modifier;
// die Navigation erscheint nur bei carousel. disabled sperrt „Zurueck".
import { PFEIL_LINKS, PFEIL_RECHTS } from './_helfer.js'

const STIMMEN = [
  ['„Excellente Dokumentation und klare Muster.“', 'Pia Weber', 'Product Manager'],
  ['„Die Einführung lief schneller als geplant.“', 'Jonas Kramer', 'Leiter Interne Kommunikation'],
  ['„Endlich erreichen wir auch die Produktion.“', 'Aylin Demir', 'HR Business Partnerin']
]

export default (zelle, m) => {
  const karussell = m.wert('variante') === 'carousel'
  return `
<div class="${m.klasse}"${m.attrs}>
${STIMMEN.map(([zitat, name, rolle]) => `<blockquote class="nc-testimonial">
<p class="nc-testimonial__quote">${zitat}</p>
<footer class="nc-testimonial__author"><div class="nc-testimonial__meta"><span class="nc-testimonial__name">${name}</span><span class="nc-testimonial__role">${rolle}</span></div></footer>
</blockquote>`).join('\n')}
${karussell || m.slot('nav') ? `<div class="nc-testimonial-grid__nav">
<button type="button" class="nc-testimonial-grid__btn" aria-label="Zurück"${m.deaktiviert ? ' disabled' : ''}>${PFEIL_LINKS}</button>
<button type="button" class="nc-testimonial-grid__btn" aria-label="Weiter">${PFEIL_RECHTS}</button>
</div>` : ''}
</div>`
}
