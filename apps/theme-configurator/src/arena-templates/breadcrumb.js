// Vorlage: breadcrumb — Markup aus data/markup/breadcrumb.html und der
// STRUKTUR in scss/scss/06-molecules/_breadcrumb.scss:
//   nav.nc-breadcrumb  aria-label="Breadcrumb"
//     ol.nc-breadcrumb__list
//       li.nc-breadcrumb__item
//         a.nc-breadcrumb__link  (+ span.__home-icon bzw. span.__back-icon)
//         span.nc-breadcrumb__separator  aria-hidden (Chevron, „/" oder leer)
//       li.nc-breadcrumb__item.nc-breadcrumb__ellipsis-wrap      (truncated)
//         button.nc-breadcrumb__ellipsis  aria-haspopup aria-expanded
//         ul.nc-breadcrumb__dropdown role="menu" (.is-open = sichtbar)
//           li[role=none] > a.nc-breadcrumb__dropdown-item[role=menuitem]
//       li.nc-breadcrumb__item > span.nc-breadcrumb__page[aria-current=page]
//
// Achsen:
//   size/appearance/variant  Modifier an der Wurzel (--sm, --ghost,
//                            --back-link)
//   separator                chevron (SVG), slash („/"); dot, square,
//                            custom: Modifier am SEPARATOR (nicht an der
//                            Wurzel), das Zeichen malt ::before
//   content                  home-icon: Haus-SVG statt „Home", der Link
//                            traegt aria-label="Home"
//   variant=truncated        Home + Ellipsis-Dropdown + letzte zwei Ebenen
//   variant=back-link        nur „← Eltern-Seite" mit aria-label
// Zustaende: hover/focus nur echt (data-zustand am ersten Link); open =
//   Dropdown der Ellipsis offen (.is-open, aria-expanded="true") — nur in
//   „Zustände"; in „Ausprobieren" (m.ausprobieren) startet es zu und das
//   Behavior (neo-behaviors/breadcrumb.js) klappt es auf.
// Kompositionen (render.compositionType): breadcrumb-long (langer Pfad,
//   bricht im schmalen Feld um), breadcrumb-minimal (Home + Seite).
// Verhalten: neo-behaviors/breadcrumb.js nach keyboard/events im Recipe
//   (Ellipsis-Menue auf/zu, Pfeiltasten, Escape, Tab, Klick ausserhalb).
import { esc } from './_helfer.js'
import { wurzelKlassen, kindModifier } from './_overlay.js'

const CHEVRON = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>'
const PUNKTE = '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true"><circle cx="5" cy="12" r="2"></circle><circle cx="12" cy="12" r="2"></circle><circle cx="19" cy="12" r="2"></circle></svg>'
const HAUS = '<svg viewBox="0 0 24 24"><path d="M3 10.5 12 3l9 7.5"></path><path d="M5 9.5V20a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V9.5"></path></svg>'
const ZURUECK = '<svg viewBox="0 0 24 24"><path d="M19 12H5"></path><path d="m12 19-7-7 7-7"></path></svg>'

const PFAD = ['Home', 'Produkte', 'Plattform', 'Social Intranet']
const LANG = ['Home', 'Produkte', 'Plattform', 'Module', 'Kommunikation', 'News und Redaktion', 'Freigabe-Workflows', 'Einstellungen']
const VERSTECKT = ['Produkte', 'Plattform', 'Module']

function trenner (m) {
  const art = m.wert('separator') || 'chevron'
  const klassen = ['nc-breadcrumb__separator', ...kindModifier(m, 'nc-breadcrumb__separator--')].join(' ')
  const inhalt = art === 'chevron' ? CHEVRON : art === 'slash' ? '/' : ''
  return `<span class="${klassen}" aria-hidden="true">${inhalt}</span>`
}

/** Link einer Ebene; die erste Ebene ist Home (Text oder Haus-Symbol). */
function link (m, text, erster) {
  const zustand = erster && m.attribute['data-zustand'] ? ` data-zustand="${m.attribute['data-zustand']}"` : ''
  if (erster && m.wert('content') === 'home-icon') {
    return `<a class="nc-breadcrumb__link" href="#" aria-label="Home"${zustand}><span class="nc-breadcrumb__home-icon" aria-hidden="true">${HAUS}</span></a>`
  }
  return `<a class="nc-breadcrumb__link" href="#"${zustand}>${esc(text)}</a>`
}

const ebene = (m, text, erster) => `<li class="nc-breadcrumb__item">
${link(m, text, erster)}
${trenner(m)}
</li>`

const seite = (text) => `<li class="nc-breadcrumb__item">
<span class="nc-breadcrumb__page" aria-current="page">${esc(text)}</span>
</li>`

/** Dropdown offen: fest in „Zustände", in „Ausprobieren" oeffnet das Behavior. */
const offen = (m) => m.hat('open') && !m.ausprobieren

function ellipsis (m) {
  const auf = offen(m)
  const eintraege = VERSTECKT.map((t) => `<li role="none"><a class="nc-breadcrumb__dropdown-item" role="menuitem" tabindex="-1" href="#">${esc(t)}</a></li>`).join('\n')
  return `<li class="nc-breadcrumb__item nc-breadcrumb__ellipsis-wrap">
<button type="button" class="nc-breadcrumb__ellipsis" aria-label="Weitere Seiten anzeigen" aria-haspopup="true" aria-expanded="${auf}" aria-controls="${m.uid}-ebenen">${PUNKTE}</button>
<ul class="nc-breadcrumb__dropdown${auf ? ' is-open' : ''}" id="${m.uid}-ebenen" role="menu" aria-label="Weitere Seiten">
${eintraege}
</ul>
${trenner(m)}
</li>`
}

function liste (m) {
  const variante = m.wert('variant') || 'full'
  const art = m.specimen.render?.compositionType
  if (variante === 'back-link') {
    return `<li class="nc-breadcrumb__item">
<a class="nc-breadcrumb__link" href="#" aria-label="Zurück zu Plattform"><span class="nc-breadcrumb__back-icon" aria-hidden="true">${ZURUECK}</span>Plattform</a>
</li>`
  }
  if (variante === 'truncated') {
    return [ebene(m, 'Home', true), ellipsis(m), ebene(m, 'Kommunikation'), seite('Social Intranet')].join('\n')
  }
  const pfad = art === 'breadcrumb-long' ? LANG : art === 'breadcrumb-minimal' ? ['Home', 'Kontakt'] : PFAD
  return [...pfad.slice(0, -1).map((t, i) => ebene(m, t, i === 0)), seite(pfad.at(-1))].join('\n')
}

export default (zelle, m) => {
  const nav = `<nav class="${wurzelKlassen(m)}" aria-label="Breadcrumb">
<ol class="nc-breadcrumb__list">
${liste(m)}
</ol>
</nav>`
  // Offenes Dropdown liegt absolut unter der Ellipsis — die Flaeche haelt
  // ihm den Platz in der Zelle frei (in „Ausprobieren" fuer jede gekuerzte
  // Fassung, das Behavior oeffnet dort). Der lange Pfad bricht im Feld um.
  if (offen(m) || (m.ausprobieren && m.wert('variant') === 'truncated')) return `<div class="ra-anker">\n${nav}\n</div>`
  if (m.specimen.render?.compositionType === 'breadcrumb-long') return `<div class="ra-feld">\n${nav}\n</div>`
  return nav
}
