// Vorlage: text-cta (07-organisms/_text-cta.scss) — Plan v3, Phase 5.
// Markup nach neo_fe/templates/block/block--block-content--neo-text-cta
// .html.twig: <section class="nc-section"><div class="nc-container">
// <div class="nc-text-cta [--card-left]"><div class="nc-text-cta__grid">
// Textspalte (neo_fe:block-header --flush, Punkteliste) und — immer hinter
// dem Text im DOM — die Karte (.nc-card.nc-text-cta__card). Kartenflaeche als
// Instanzwert --mod-card-bg wie field_tc_card_bg in Drupal.
//
// Ohne Karte setzt Drupal nc-text-cta--no-card; das DS kennt den Modifier
// nicht (Entscheidungsfall Phase 5) — die Zelle zeigt „nicht gebaut".
// Seitenbreiter Block mit Container Query: Rahmen ra-desktop.
import { slotAn } from './_bloecke-1.js'
import { nichtGebaut } from './_layout.js'

/** Recipe-Modifier ohne Regel in styles.css (vom Test bewacht). */
export const OHNE_CSS = ['nc-text-cta--no-card']

const ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M8 7V3m8 4V3M3 11h18M5 5h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z"/></svg>'

const PUNKTE = ['Einrichtung in sechs bis zehn Wochen', 'Schulung für Redaktion und Administration', 'Betrieb in deutschen Rechenzentren']

export default (zelle, m) => {
  const fehlend = m.klassen.filter((k) => OHNE_CSS.includes(k))
  if (fehlend.length) return nichtGebaut(m, fehlend)
  const render = m.specimen.render || {}
  const flaeche = render.kartenFlaeche ? ' style="--mod-card-bg: var(--fnd-color-background-tertiary);"' : ''
  return `<div class="ra-desktop">
<section class="nc-section">
<div class="nc-container">
<div class="${m.klasse}"${m.attrs}>
<div class="nc-text-cta__grid">
<div class="nc-text-cta__content">
<div class="nc-section-header nc-section-header--flush">
<span class="nc-section-header__label">Einführung</span>
<h2 class="nc-section-header__title">In wenigen Wochen startklar</h2>
<p class="nc-section-header__subtitle">Wir begleiten Ihr Team von der Entscheidung bis zur ersten Schicht mit der App.</p>
</div>
${slotAn(m, 'list') ? `<ul class="nc-text-cta__list">
${PUNKTE.map((p) => `<li class="nc-text-cta__list-item"><span>${p}</span></li>`).join('\n')}
</ul>` : ''}
</div>
<aside class="nc-text-cta__aside">
<div class="nc-card nc-text-cta__card"${flaeche}>
<div class="nc-card__content">
<span class="nc-text-cta__card-icon">${ICON}</span>
<h3 class="nc-card__title">Termin vereinbaren</h3>
<p class="nc-card__description">30 Minuten, unverbindlich — mit einer Person aus dem Einführungsteam.</p>
<div class="nc-text-cta__card-action">
<a href="#" onclick="return false" class="nc-button nc-button--accent nc-button--lg"><span>Termin wählen</span></a>
</div>
</div>
</div>
</aside>
</div>
</div>
</div>
</section>
</div>`
}
