// Helfer (keine Vorlage): ein Testimonial so, wie es Drupal ausgibt —
// block--block-content--neo-testimonial.html.twig (neo_fe):
// figure.nc-testimonial > blockquote.__quote, ul.__results,
// figcaption.__author > div.__meta > cite.__name + span.__role, p.__context.
// Die Testimonial-Grid-Vorlage reiht dieselben Figures (Drupal rendert die
// Kinder-Bloecke in das Grid, siehe neo_fe_preprocess_block).

// Weitere Teile, die _testimonial.scss gestaltet (aufgenommen aus
// neo-overrides.css, Plan v3, Phase 4): Avatar (img.__avatar vor den Meta-
// Angaben), Firmenlogo (img.__logo, rechts im Autorenblock), Social-Links
// (__socials > a.__social unter Name/Rolle) und Video (__video mit
// Vorschau-Knopf __video-facade > __video-play, per order oben in der Karte).
const LINKEDIN = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9h4v11H4zM6 4a2 2 0 1 1 0 4 2 2 0 0 1 0-4zM10 9h4v1.5a4 4 0 0 1 6 3.5V20h-4v-5a2 2 0 0 0-4 0v5h-2z"></path></svg>'
const PLAY = '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"></path></svg>'

/**
 * @param {object} t  { zitat, name, rolle, ergebnisse?, kontext?, avatar?, logo?, socials?, video? }
 *                    avatar/logo: Bild-URL; video: Bild-URL der Vorschau
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
  const avatar = t.avatar ? `\n<img class="nc-testimonial__avatar" src="${t.avatar}" alt="">` : ''
  const logo = t.logo ? `\n<img class="nc-testimonial__logo" src="${t.logo}" alt="Firmenlogo">` : ''
  const socials = t.socials ? `\n<span class="nc-testimonial__socials"><a class="nc-testimonial__social" href="#" onclick="return false" aria-label="${t.name} auf LinkedIn">${LINKEDIN}</a></span>` : ''
  const video = t.video
    ? `\n<div class="nc-testimonial__video"><button type="button" class="nc-testimonial__video-facade" aria-label="Video mit ${t.name} abspielen"><span class="nc-testimonial__video-play">${PLAY}</span></button></div>`
    : ''
  return `<figure class="${klasse}"${o.attrs || ''}>${video}
<blockquote class="nc-testimonial__quote">${t.zitat}</blockquote>${ergebnisse}
<figcaption class="nc-testimonial__author">${avatar}
<div class="nc-testimonial__meta">
<cite class="nc-testimonial__name">${t.name}</cite>${rolle}${socials}
</div>${logo}
</figcaption>${kontext}
</figure>`
}
