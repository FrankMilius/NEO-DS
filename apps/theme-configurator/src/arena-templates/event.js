// Vorlage: event — Markup aus data/markup/event.html (Hero mit Tags und
// Meta, Agenda, ein verwandtes Event). Das Recipe hat keine Achsen; optionale
// Slots bleiben sichtbar, solange ein Specimen sie nicht abschaltet.
import { an } from './_helfer.js'

const KALENDER = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2"></rect><path d="M16 2v4M8 2v4M3 10h18"></path></svg>'
const UHR = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><path d="M12 6v6l4 2"></path></svg>'
const ORT = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>'
const PFEIL = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"></path></svg>'

export default (zelle, m) => `
<article class="${m.klasse}"${m.attrs}>
<section class="nc-event__hero">
<div class="nc-event__hero-content nc-container">
${an(m, 'tags') ? `<div class="nc-event__tags">
<span class="nc-event__tag nc-event__tag--type">Konferenz</span>
<span class="nc-event__tag nc-event__tag--format">Hybrid</span>
<span class="nc-event__tag nc-event__tag--lang">Deutsch &amp; English</span>
</div>` : ''}
<h2 class="nc-event__title"><span>Digital Workplace Summit 2026</span></h2>
${an(m, 'subtitle') ? '<p class="nc-event__subtitle">Die Konferenz für den digitalen Arbeitsplatz</p>' : ''}
${an(m, 'meta') ? `<div class="nc-event__meta">
<div class="nc-event__meta-item">${KALENDER}<span>20.05.2026</span></div>
<div class="nc-event__meta-item">${UHR}<span>09:00 – 17:00 Uhr</span></div>
<div class="nc-event__meta-item">${ORT}<span>Congresshalle Saarbrücken</span></div>
</div>` : ''}
<div class="nc-event__cta"><a href="#" onclick="return false" class="nc-button nc-button--accent nc-button--lg"><span>Ticket sichern</span></a></div>
</div>
</section>
<section class="nc-section nc-section--muted">
<div class="nc-container">
<h2 class="nc-event__section-title">Agenda</h2>
<div class="nc-event__agenda u-prose">
<h4>Tag 1: Strategie</h4>
<p>Keynotes, Panels, Strategy Sessions</p>
<h4>Tag 2: Praxis</h4>
<p>Workshops, Hands-on Labs, Roundtables</p>
</div>
</div>
</section>
${an(m, 'related-grid') ? `<section class="nc-section">
<div class="nc-container">
<h2 class="nc-event__section-title">Weitere Events</h2>
<div class="nc-event__related-grid">
<a href="#" onclick="return false" class="nc-card nc-card--navigational nc-event__related-card">
<div class="nc-card__content">
<span class="nc-card__kicker">Konferenz</span>
<h3 class="nc-card__title">NEO Partner Day 2026</h3>
<p class="nc-card__meta">08.07.2026</p>
</div>
<div class="nc-card__footer"><span class="nc-card__footer-label">Mehr erfahren</span><span class="nc-card__footer-icon">${PFEIL}</span></div>
</a>
</div>
</div>
</section>` : ''}
</article>`
