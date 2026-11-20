// Vorlage: content-feed — Markup aus data/markup/content-feed.html (I11,
// 19.11.2026). Die Achse columns setzt ihre Klasse nicht an die Wurzel,
// sondern an die Liste (.nc-card-grid--cols-*), wie im Drupal-Block; „auto“
// laesst .nc-card-grid nach Mindestbreite auffuellen. lead=featured macht
// die erste Karte gross ueber die ganze Breite.
import { BILD_SRC, SYMBOL } from './_helfer.js'

const PFEIL = '<svg class="nc-card__footer-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M5 12H19"/><path d="M13 18L19 12L13 6"/></svg>'
const PFEIL_EXTERN = '<svg class="nc-card__footer-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M17 7L7 17"/><path d="M8 7H17V16"/></svg>'

// [Titel, Kicker, Text, Fuss, Bild, Datum [iso, Tag, Monat], Meta, extern]
const KARTEN = [
  ['neo AI – statt Suchen gibt es Antworten', 'News · 12.11.2026', 'Mit neo AI bringt NEOCOSMO eine Intranet-KI auf den Markt: sicher, offen und schnell.', 'Weiterlesen', true, null, null, false],
  ['Intranet-Tag 2026: Digitale Souveränität im Betrieb', 'Event · 03.12.2026', 'Vorträge und Gespräche über Intranets, die Organisationen selbst in der Hand behalten.', 'Zum Event', true, ['2026-12-03', '03', 'Dez'], 'Berlin · Vor Ort', false],
  ['Warum ein Intranet offene Schnittstellen braucht', 'Artikel · 05.11.2026', 'Fünf Fragen, die vor der Auswahl einer Plattform beantwortet sein sollten.', 'Weiterlesen', false, null, '4 Min. Lesezeit', false],
  ['NEOCOSMO in Analysten-Ranking top platziert', 'News · 28.10.2026', 'Auszeichnung als einer der innovativsten Anbieter im D/A/CH-Raum.', 'Zum Beitrag', true, null, null, true]
]

const abzeichen = ([iso, tag, monat]) =>
  `<time class="nc-card__date-badge" datetime="${iso}"><span class="nc-card__date-badge-day">${tag}</span><span>${monat}</span></time>`

const karte = ([titel, kicker, text, fuss, bild, datum, meta, extern], gross) => {
  const klassen = ['nc-card', 'nc-card--navigational', 'nc-card--preview']
  if (gross) klassen.push('nc-card--featured')
  return `<a class="${klassen.join(' ')}" href="#"${extern ? ' target="_blank" rel="noopener noreferrer"' : ''}>
${bild ? `<div class="nc-card__media"><img src="${BILD_SRC}" alt="" loading="lazy">${datum ? abzeichen(datum) : ''}</div>` : ''}
<div class="nc-card__content">${!bild && datum ? abzeichen(datum) : ''}<span class="nc-card__kicker">${kicker}</span><h3 class="nc-card__title">${titel}</h3><p class="nc-card__description">${text}</p>${meta ? `<p class="nc-card__meta">${meta}</p>` : ''}</div>
<div class="nc-card__footer"><span class="nc-card__footer-label">${fuss}${extern ? '<span class="u-sr-only"> (öffnet in neuem Tab)</span>' : ''}</span>${extern ? PFEIL_EXTERN : PFEIL}</div>
</a>`
}

// "Load more" in the arena: there is no server page, so the link points to a
// small embedded second page (data: URL, two cards, no further page). In
// "Ausprobieren" the behavior content-feed appends its cards like on the
// website; the feed is taken by class, as the ids differ per cell.
const NAECHSTE_SEITE = 'data:text/html;charset=utf-8,' + encodeURIComponent(`<section class="nc-content-feed"><ul class="nc-content-feed__list">${[
  ['Webinar: neo workplace in 30 Minuten', 'Event · 10.12.2026', 'Live-Vorführung mit Fragerunde.', 'Zum Event', false, ['2026-12-10', '10', 'Dez'], 'Online', false],
  ['Barrierefreiheit im Intranet: die fünf häufigsten Lücken', 'Artikel · 21.10.2026', 'Was Prüfungen nach WCAG 2.2 im Alltag am häufigsten finden.', 'Weiterlesen', false, null, '6 Min. Lesezeit', false]
].map((k) => `<li class="nc-content-feed__item">${karte(k, false)}</li>`).join('')}</ul></section>`)

export default (zelle, m) => {
  const spalten = m.wert('columns') || 'auto'
  const gross = (m.wert('lead') || 'featured') === 'featured'
  const id = `feed-${m.uid}`
  const liste = ['nc-content-feed__list', 'nc-card-grid']
  if (spalten !== 'auto') liste.push(`nc-card-grid--cols-${spalten}`)
  const reiter = ['Alle', 'News', 'Events', 'Artikel']
    .map((n, i) => `<a class="nc-chip${i === 0 ? ' nc-chip--selected' : ''}" href="#"${i === 0 ? ' aria-current="page"' : ''}><span class="nc-chip__label">${n}</span></a>`)
    .join('')
  return `
<section class="${m.basisKlasse}" aria-labelledby="${id}" style="width: 100%;"${m.attrs}>
<div class="nc-content-feed__head"><h2 id="${id}">News &amp; Einblicke</h2><a class="link-with-arrow" href="#">Alle anzeigen ${SYMBOL.pfeil}</a></div>
<nav class="nc-content-feed__filters" aria-label="News &amp; Einblicke filtern">${reiter}</nav>
<ul class="${liste.join(' ')}">
${KARTEN.map((k, i) => `<li class="nc-content-feed__item${gross && i === 0 ? ' nc-content-feed__item--lead' : ''}">${karte(k, gross && i === 0)}</li>`).join('\n')}
</ul>
<div class="nc-content-feed__footer"><a class="nc-button nc-button--secondary" href="${NAECHSTE_SEITE}" data-feed-more>Mehr laden</a></div>
<p class="u-sr-only" role="status" aria-live="polite" data-feed-geladen="{anzahl} weitere Beiträge geladen"></p>
</section>`
}
