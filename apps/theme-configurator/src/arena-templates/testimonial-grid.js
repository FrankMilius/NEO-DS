// Vorlage: testimonial-grid — wie block--block-content--neo-testimonial-grid
// .html.twig (neo_fe): das Raster enthaelt die Testimonial-Figures; die
// Navigation (nur bei carousel) steht als Geschwister NACH dem Raster, nicht
// darin. variante per Modifier; disabled sperrt „Zurueck".
import { testimonialHtml } from './_testimonial.js'

const STIMMEN = [
  ['„Exzellente Dokumentation und klare Muster.“', 'Pia Weber', 'Product Manager'],
  ['„Die Einführung lief schneller als geplant.“', 'Jonas Kramer', 'Leiter Interne Kommunikation'],
  ['„Endlich erreichen wir auch die Produktion.“', 'Aylin Demir', 'HR Business Partnerin']
]

const ZURUECK = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M15 18l-6-6 6-6"></path></svg>'
const WEITER = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M9 6l6 6-6 6"></path></svg>'

export default (zelle, m) => {
  const karussell = m.wert('variante') === 'carousel'
  const rolle = karussell ? ' role="group" aria-roledescription="Karussell" aria-label="Testimonials" tabindex="0"' : ''
  return `
<div class="${m.klasse}"${rolle}${m.attrs}>
${STIMMEN.map(([zitat, name, r]) => testimonialHtml({ zitat, name, rolle: r })).join('\n')}
</div>
${karussell || m.slot('nav') ? `<div class="nc-testimonial-grid__nav">
<button type="button" class="nc-testimonial-grid__btn" aria-label="Vorherige Testimonials"${m.deaktiviert ? ' disabled' : ''}>${ZURUECK}</button>
<button type="button" class="nc-testimonial-grid__btn" aria-label="Weitere Testimonials">${WEITER}</button>
</div>` : ''}`
}
