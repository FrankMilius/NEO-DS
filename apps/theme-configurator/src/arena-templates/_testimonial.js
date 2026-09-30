// Helfer (keine Vorlage): ein Testimonial so, wie es Drupal ausgibt —
// block--block-content--neo-testimonial.html.twig (neo_fe):
// figure.nc-testimonial > blockquote.__quote, ul.__results,
// figcaption.__author > div.__meta > cite.__name + span.__role, p.__context.
// Die Testimonial-Grid-Vorlage reiht dieselben Figures (Drupal rendert die
// Kinder-Bloecke in das Grid, siehe neo_fe_preprocess_block).

/**
 * @param {object} t  { zitat, name, rolle, ergebnisse?, kontext? }
 * @param {object} [o] { klasse, attrs, rolleZeigen }
 */
export function testimonialHtml (t, o = {}) {
  const klasse = o.klasse || 'nc-testimonial'
  const ergebnisse = t.ergebnisse?.length
    ? `\n<ul class="nc-testimonial__results" aria-label="Messbare Ergebnisse">${t.ergebnisse.map((r) => `<li class="nc-testimonial__result">${r}</li>`).join('')}</ul>`
    : ''
  const kontext = t.kontext?.length
    ? `\n<p class="nc-testimonial__context">${t.kontext.map((c) => `<span class="nc-testimonial__context-item">${c}</span>`).join('')}</p>`
    : ''
  const rolle = o.rolleZeigen === false ? '' : `\n<span class="nc-testimonial__role">${t.rolle}</span>`
  return `<figure class="${klasse}"${o.attrs || ''}>
<blockquote class="nc-testimonial__quote">${t.zitat}</blockquote>${ergebnisse}
<figcaption class="nc-testimonial__author">
<div class="nc-testimonial__meta">
<cite class="nc-testimonial__name">${t.name}</cite>${rolle}
</div>
</figcaption>${kontext}
</figure>`
}
