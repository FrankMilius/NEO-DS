// Vorlage: card — Markup aus data/markup/card.html (geerntet von der Website:
// <a class="nc-card nc-card--navigational"> mit __content (Dachzeile, Titel,
// Meta) und __footer (Label + Pfeil)) und der Anatomie des Recipes.
//
// Das Wurzel-Element folgt dem Verhalten (Recipe domNotes): <article>
// (static, action), <a> (navigational), <label> mit verstecktem
// <input class="nc-card__input"> (selectable), <details> (expandable).
// Achsen pattern/statusLevel/context per Modifier aus dem Recipe
// (m.basisKlasse — Zustaende haengt das DS nicht als Klasse an die Karte).
// Zustaende: selected = angehaktes Feld (:has(:checked)), open = [open],
// disabled = aria-disabled an der Wurzel bzw. disabled am Feld, skeleton =
// nc-card--skeleton mit aria-hidden; hover/focus-visible nur echt
// (data-zustand).
//
// render.variants: navigational zeigt entire (ganze Flaeche) und partial
// (Link im Titel), selectable Radio und Checkbox — je Zelle nebeneinander.
// Kompositionen: context-comparison (Kontext-Achse), surface-comparison
// (dieselbe Karte auf den Section-Flaechen base/muted/accent),
// anwendungen (Muster aus der frueheren Arena: Schnellzugriff, Zitat, Tarif,
// Kennzahl, Galerie).
import { BILD_SRC, esc } from './_helfer.js'

const PFEIL = '<span class="nc-card__footer-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg></span>'
const KALENDER = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>'
const CHEVRON = '<svg class="nc-card__expand-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"></polyline></svg>'
const PLUS = '<svg class="nc-card__icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M12 2v20M2 12h20"></path></svg>'

const STATUS = {
  success: ['Erfolgreich', 'Alle Tests bestanden'],
  warning: ['Warnung', 'Zwei Tests instabil'],
  danger: ['Fehler', 'Build abgebrochen'],
  info: ['Hinweis', 'Neue Version verfügbar']
}

const medium = (alt = '') => `<div class="nc-card__media"><img src="${BILD_SRC}" alt="${alt}"></div>`

/** Zustand der Zelle als Attribute an der Wurzel (ohne Klassen). */
function zustand (m, { mitDisabled = true } = {}) {
  let a = ''
  if (m.attribute['data-zustand']) a += ` data-zustand="${m.attribute['data-zustand']}"`
  if (m.attribute['aria-hidden']) a += ' aria-hidden="true"'
  if (mitDisabled && m.deaktiviert) a += ' aria-disabled="true"'
  return a
}

const klasse = (m, ...extra) => [m.basisKlasse, ...extra].filter(Boolean).join(' ')

function inhalt (m, { titel, text, kicker = '', meta = '', titelTag = 'h3', titelLink = false }) {
  const t = titelLink
    ? `<${titelTag} class="nc-card__title"><a class="nc-card__title-link" href="#" onclick="return false">${titel}</a></${titelTag}>`
    : `<${titelTag} class="nc-card__title">${titel}</${titelTag}>`
  return `<div class="nc-card__content">
${kicker ? `<span class="nc-card__kicker">${kicker}</span>\n` : ''}${t}
${text ? `<p class="nc-card__description">${text}</p>\n` : ''}${meta ? `<p class="nc-card__meta">${meta}</p>\n` : ''}</div>`
}

const fussLink = '<div class="nc-card__footer"><span class="nc-card__footer-label">Mehr erfahren</span>' + PFEIL + '</div>'

/** Navigierende Karte (ganze Flaeche) wie auf der Website. */
function linkKarte (m, { extra = '', mitMedium = false, kicker = 'Konferenz', titel = 'NEO Partner Day 2026', text = '' } = {}) {
  return `<a href="#" onclick="return false" class="${klasse(m, extra)}"${zustand(m)}>
${mitMedium ? medium() + '\n' : ''}${inhalt(m, { kicker, titel, text, meta: `${KALENDER} 08.07.2026` })}
${fussLink}
</a>`
}

function auswahlKarte (m, art, nr, { an = false, kicker = '', titel, text, fuss = '' }) {
  const name = art === 'radio' ? `${m.uid}-plan` : `${m.uid}-funktion-${nr}`
  return `<label class="${klasse(m)}"${zustand(m, { mitDisabled: false })}>
<input class="nc-card__input" type="${art}" name="${name}" value="${nr}"${an ? ' checked' : ''}${m.deaktiviert ? ' disabled' : ''}>
<div class="nc-card__content">
${kicker ? `<span class="nc-card__kicker">${kicker}</span>\n` : ''}<span class="nc-card__title">${titel}</span>
<span class="nc-card__description">${text}</span>
</div>${fuss}
</label>`
}

const feld = (html, breit = false) => `<div class="ra-feld${breit ? ' ra-feld--breit' : ''}">${html}</div>`
const reihe = (...teile) => `<div class="ra-reihe ra-reihe--oben">${teile.join('')}</div>`

function navigational (m) {
  const varianten = m.specimen.render?.variants || ['entire']
  return reihe(...varianten.map((v) => feld(v === 'partial'
    ? `<article class="${klasse(m).replace('nc-card--navigational', '').trim()}"${zustand(m)}>
${inhalt(m, { kicker: 'Webinar', titel: 'Partieller Link', text: 'Nur der Titel ist verlinkt.', titelLink: true })}
</article>`
    : linkKarte(m, { text: 'Die ganze Fläche ist klickbar.' }))))
}

function anwendungen (m) {
  const basis = m.basisKlasse
  return reihe(
    feld(`<a href="#" onclick="return false" class="${basis} nc-card--action nc-card--navigational">
<div class="nc-card__content">
${PLUS}
<h3 class="nc-card__title">Feature entdecken</h3>
<p class="nc-card__description">Kurze Beschreibung des Features</p>
</div>
</a>`),
    feld(`<article class="${basis}">
<div class="nc-card__content">
<p class="nc-card__description">„Mit NEO haben wir unsere interne Kommunikation neu aufgestellt.“</p>
<p class="nc-card__meta">Anna Müller · CTO</p>
</div>
</article>`),
    feld(`<label class="${basis} nc-card--selectable">
<input class="nc-card__input" type="radio" name="${m.uid}-tarif" value="pro" checked>
<div class="nc-card__content">
<span class="nc-card__kicker">Empfohlen</span>
<span class="nc-card__title">Pro</span>
<span class="nc-card__description">50 GB, Priority Support, API-Zugang</span>
</div>
<div class="nc-card__footer"><span class="nc-card__meta">29 € / Monat</span></div>
</label>`),
    feld(`<article class="${basis} nc-card--status nc-card--status-success">
<div class="nc-card__content">
<span class="nc-card__kicker">Umsatz Q1</span>
<h3 class="nc-card__title">1,2 Mio. €</h3>
<p class="nc-card__meta">+12 % zum Vorjahr</p>
</div>
</article>`),
    feld(`<a href="#" onclick="return false" class="${basis} nc-card--navigational" aria-label="Galerie: Bild 1">
${medium()}
</a>`)
  )
}

export default (zelle, m) => {
  const typ = m.specimen.render?.compositionType
  const verhalten = m.wert('behavior')
  const pattern = m.wert('pattern')

  if (typ === 'anwendungen') return anwendungen(m)
  if (m.hat('skeleton')) {
    return feld(`<article class="${klasse(m, 'nc-card--skeleton')}"${zustand(m)}>
${pattern === 'preview' ? '<div class="nc-card__media"></div>\n' : ''}<div class="nc-card__content">
<span class="nc-card__kicker">&nbsp;</span>
<h3 class="nc-card__title">&nbsp;</h3>
<p class="nc-card__description">&nbsp;</p>
<p class="nc-card__meta">&nbsp;</p>
</div>
</article>`)
  }
  if (typ === 'surface-comparison') {
    const flaechen = m.specimen.render?.surfaces || ['base']
    return reihe(...flaechen.map((f) => `<div class="section${f === 'base' ? '' : ` section--${f}`} ra-flaechen-probe">${feld(linkKarte(m, { mitMedium: true, kicker: 'Webinar', titel: 'Cloud-Migration ohne Stillstand', text: 'So ziehen Sie Ihre Infrastruktur sicher um.' }))}</div>`))
  }
  if (typ === 'context-comparison') return feld(linkKarte(m, { text: 'Dieselbe Karte im jeweiligen Raster-Kontext.' }), m.wert('context') === 'display')

  switch (verhalten) {
    case 'navigational':
      if (pattern === 'preview' || pattern === 'featured') {
        return feld(linkKarte(m, { mitMedium: true, kicker: pattern === 'featured' ? 'Kundenstory' : 'Webinar', titel: pattern === 'featured' ? 'Festo modernisiert WeNet und PeopleNet' : 'Cloud-Migration ohne Stillstand', text: 'So ziehen Sie Ihre Infrastruktur sicher um.' }), pattern === 'featured')
      }
      if (pattern === 'summary') {
        return feld(`<a href="#" onclick="return false" class="${klasse(m)}"${zustand(m)}>
${medium()}
${inhalt(m, { titel: 'Berlin', text: '42 Mitarbeitende' })}
</a>`)
      }
      if (m.specimen.render?.variants) return navigational(m)
      return feld(linkKarte(m, { text: 'Die ganze Fläche ist klickbar.' }))
    case 'selectable': {
      const gewaehlt = m.hat('selected')
      const varianten = m.specimen.render?.variants || ['radio']
      return reihe(...varianten.map((art, i) => feld(art === 'checkbox'
        ? auswahlKarte(m, 'checkbox', i + 1, { an: gewaehlt, titel: 'Analytics', text: 'Auswertungen &amp; Reports' })
        : auswahlKarte(m, 'radio', i + 1, { an: gewaehlt, titel: 'Basic', text: '5 GB Speicher' }))))
    }
    case 'expandable':
      return feld(`<details class="${klasse(m)}"${m.hat('open') ? ' open' : ''}${zustand(m)}>
<summary class="nc-card__summary">
<span class="nc-card__title">Wie lange dauert die Einführung?</span>
${CHEVRON}
</summary>
<div class="nc-card__details-content">
<p>Von der Entscheidung bis zum Start typischerweise sechs bis zehn Wochen.</p>
</div>
</details>`)
    case 'action':
      return feld(`<article class="${klasse(m)}"${zustand(m)}>
${inhalt(m, { titel: 'Benutzer einladen', text: 'Sende eine Einladung per E-Mail.' })}
<div class="nc-card__footer">
<button type="button" class="nc-button nc-button--outline nc-button--sm nc-card__footer-action"${m.deaktiviert ? ' disabled' : ''}>Abbrechen</button>
<button type="button" class="nc-button nc-button--sm nc-card__footer-action"${m.deaktiviert ? ' disabled' : ''}>Einladen</button>
</div>
</article>`)
    default: {
      if (pattern === 'status') {
        const [titel, text] = STATUS[m.wert('statusLevel')] || STATUS.info
        return feld(`<article class="${klasse(m)}" aria-label="Status: ${esc(titel)}"${zustand(m)}>
${inhalt(m, { kicker: 'Build #1284', titel, text })}
</article>`)
      }
      if (pattern === 'summary') {
        return feld(`<article class="${klasse(m)}"${zustand(m)}>
${medium('Anna Müller')}
${inhalt(m, { titel: 'Anna Müller', text: 'Lead Developer' })}
</article>`)
      }
      return feld(`<article class="${klasse(m)}"${zustand(m)}>
${inhalt(m, { titel: 'Projektstatus', text: 'Aktuelle Informationen zum Sprint.' })}
</article>`)
    }
  }
}
