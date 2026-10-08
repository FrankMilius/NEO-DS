// Vorlage: testimonial-grid — wie block--block-content--neo-testimonial-grid
// .html.twig (neo_fe): das Raster enthaelt die Testimonial-Figures; die
// Navigation (nur bei carousel) steht als Geschwister NACH dem Raster, nicht
// darin. variante per Modifier; disabled sperrt „Zurueck" (Anfang des
// Karussells). Plan v3, Phase 4: Navigation nur noch bei carousel (vorher
// immer, weil der Slot nav als Pflicht gilt); Rahmen ra-feld--sehr-breit.
// hover/focus nur echt — data-zustand am Knopf „Weiter". Freigabe (Abschluss
// Plan v3, 08.10.2026): data-testimonial-carousel und data-tc-prev/-next wie
// auf der Website (das Verhalten bleibt in neo-theme.js, hier ungebunden).
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
  const rolle = karussell ? ' data-testimonial-carousel role="group" aria-roledescription="Karussell" aria-label="Testimonials" tabindex="0"' : ''
  return `<div class="ra-feld ra-feld--sehr-breit">
<div class="${m.klassen.filter((k) => k !== 'is-disabled' && k !== 'nc-testimonial-grid--disabled').join(' ')}"${rolle}${m.attrsOhne('aria-disabled', 'data-zustand')}>
${STIMMEN.map(([zitat, name, r]) => testimonialHtml({ zitat, name, rolle: r })).join('\n')}
</div>
${karussell ? `<div class="nc-testimonial-grid__nav">
<button type="button" class="nc-testimonial-grid__btn" data-tc-prev aria-label="Vorherige Testimonials"${m.deaktiviert ? ' disabled' : ''}>${ZURUECK}</button>
<button type="button" class="nc-testimonial-grid__btn" data-tc-next aria-label="Weitere Testimonials"${m.attribute['data-zustand'] ? ` data-zustand="${m.attribute['data-zustand']}"` : ''}>${WEITER}</button>
</div>` : ''}
</div>`
}
