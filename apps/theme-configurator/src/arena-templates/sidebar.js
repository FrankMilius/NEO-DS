// Vorlage: sidebar — Markup nach der STRUKTUR in scss/scss/07-organisms/
// _sidebar.scss, dem Slot-Beispiel in docs/sidebar-docs.html (Submenue) und
// data/markup/sidebar.html (Symbole):
//   nav.nc-sidebar (+ --collapsed)  aria-label="Seitennavigation"
//     div.nc-sidebar__header > a.nc-sidebar__logo + button.nc-sidebar__toggle
//     div.nc-sidebar__nav
//       div.nc-sidebar__group > span.__group-label + a.nc-sidebar__item …
//       a.nc-sidebar__item (aria-current="page" = aktiv)
//         span.__item-icon + span.__item-label (+ span.__item-badge)
//       div.nc-sidebar__submenu
//         button.nc-sidebar__item[aria-expanded][aria-controls] + __item-chevron
//         div.nc-sidebar__submenu-items > a.nc-sidebar__item.nc-sidebar__item--sub
//     div.nc-sidebar__footer
//
// Achsen: variant=collapsed als Modifier an der Wurzel (Labels aus, Eintraege
// mit aria-label); content waehlt flat, grouped, nested, with-badges, full.
// Zustaende (Specimen default) am zweiten Eintrag: hover/focus nur echt
// (data-zustand), active = aktuelle Seite (aria-current) — sonst ist der
// erste Eintrag die aktuelle Seite.
// Die Leiste ist im DS 100 % hoch (Footer unten per margin-top:auto): die
// Arena gibt ihr einen Rahmen mit fester Hoehe (ra-spalte).
// mobile-overlay: Overlay-Zustand (--open + .nc-sidebar-backdrop) im
// Arena-Rahmen ra-buehne ra-buehne--mobil. Das DS schaltet die Mobil-Lage
// nur ueber die Fensterbreite (< md) — die Arena stellt sie im Rahmen mit
// den Werten des DS dar (siehe RecipeArena.vue).
// Verhalten (Submenue auf/zu, Einklappen, Mobil schliessen): kein Behavior
// in neo-behaviors, keine keyboard/events im Recipe — nur „Zustände".
import { esc } from './_helfer.js'
import { wurzelKlassen } from './_overlay.js'

const SVG = (inhalt) => `<svg viewBox="0 0 24 24">${inhalt}</svg>`
const SYMBOLE = {
  start: SVG('<path d="M5 12H3l9-9 9 9h-2"></path><path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7"></path><path d="M9 21v-6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v6"></path>'),
  suche: SVG('<circle cx="10" cy="10" r="7"></circle><path d="m21 21-6-6"></path>'),
  glocke: SVG('<path d="M10 5a2 2 0 1 1 4 0 7 7 0 0 1 4 6v3a4 4 0 0 0 2 3H4a4 4 0 0 0 2-3v-3a7 7 0 0 1 4-6"></path><path d="M9 17v1a3 3 0 0 0 6 0v-1"></path>'),
  personen: SVG('<circle cx="9" cy="7" r="4"></circle><path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path><path d="M21 21v-2a4 4 0 0 0-3-3.85"></path>'),
  zahnrad: SVG('<circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path>'),
  info: SVG('<circle cx="12" cy="12" r="9"></circle><path d="M12 9h.01"></path><path d="M11 12h1v4h1"></path>'),
  abmelden: SVG('<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><path d="m16 17 5-5-5-5"></path><path d="M21 12H9"></path>'),
  // Logo: __logo gestaltet kein SVG — Groesse und Strich am Element (wie
  // die Symbole in data/markup/sidebar.html als eigenstaendige Grafik)
  logo: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="4"></rect><path d="M8 12h8M12 8v8"></path></svg>'
}
const CHEVRON = SVG('<path d="m9 6 6 6-6 6"></path>')
const EINKLAPPEN = SVG('<path d="m15 18-6-6 6-6"></path>')

/**
 * Ein Eintrag. opt: { aktuell, zustand, badge, sub }
 */
function eintrag (m, text, symbol, opt = {}) {
  const klassen = ['nc-sidebar__item', opt.sub ? 'nc-sidebar__item--sub' : ''].filter(Boolean).join(' ')
  let attrs = ''
  if (opt.aktuell) attrs += ' aria-current="page"'
  if (opt.zustand) attrs += ` data-zustand="${opt.zustand}"`
  if (m.wert('variant') === 'collapsed' && !opt.sub) attrs += ` aria-label="${esc(text)}${opt.badge ? `, ${opt.badge} neu` : ''}"`
  const icon = opt.sub ? '' : `<span class="nc-sidebar__item-icon" aria-hidden="true">${SYMBOLE[symbol]}</span>`
  const badge = opt.badge ? `<span class="nc-sidebar__item-badge">${opt.badge}</span>` : ''
  return `<a class="${klassen}" href="#"${attrs}>${icon}<span class="nc-sidebar__item-label">${esc(text)}</span>${badge}</a>`
}

function untermenue (m, id) {
  const kinder = ['Profil', 'Sicherheit', 'Integrationen'].map((t) => eintrag(m, t, null, { sub: true })).join('\n')
  const zu = m.wert('variant') === 'collapsed' ? ' aria-label="Einstellungen"' : ''
  return `<div class="nc-sidebar__submenu">
<button type="button" class="nc-sidebar__item" aria-expanded="true" aria-controls="${id}"${zu}><span class="nc-sidebar__item-icon" aria-hidden="true">${SYMBOLE.zahnrad}</span><span class="nc-sidebar__item-label">Einstellungen</span><span class="nc-sidebar__item-chevron" aria-hidden="true">${CHEVRON}</span></button>
<div class="nc-sidebar__submenu-items" id="${id}">
${kinder}
</div>
</div>`
}

const gruppe = (titel, inhalt) => `<div class="nc-sidebar__group">
<span class="nc-sidebar__group-label">${esc(titel)}</span>
${inhalt}
</div>`

function navigation (m) {
  const content = m.wert('content') || 'flat'
  const zustand = m.attribute['data-zustand']
  const aktivZweiter = m.hat('active')
  const badges = content === 'with-badges' || content === 'full'
  const erste = [
    eintrag(m, 'Dashboard', 'start', { aktuell: !aktivZweiter }),
    eintrag(m, 'Suche', 'suche', { aktuell: aktivZweiter, zustand }),
    eintrag(m, 'Benachrichtigungen', 'glocke', { badge: badges ? 3 : 0 })
  ].join('\n')
  const zweite = eintrag(m, 'Benutzer', 'personen', { badge: badges ? 12 : 0 })
  if (content === 'grouped' || content === 'full') {
    const verwaltung = content === 'full' ? `${zweite}\n${untermenue(m, `${m.uid}-einstellungen`)}` : `${zweite}\n${eintrag(m, 'Einstellungen', 'zahnrad')}`
    return [gruppe('Allgemein', erste), gruppe('Verwaltung', verwaltung), gruppe('System', eintrag(m, 'Über', 'info'))].join('\n')
  }
  if (content === 'nested') return `${erste}\n${zweite}\n${untermenue(m, `${m.uid}-einstellungen`)}`
  return `${erste}\n${zweite}`
}

function leiste (m, extra = []) {
  const voll = (m.wert('content') || 'flat') === 'full'
  const eingeklappt = m.wert('variant') === 'collapsed'
  const kopf = voll
    ? `<div class="nc-sidebar__header">
<a class="nc-sidebar__logo" href="#" aria-label="MyApp, Startseite">${SYMBOLE.logo}<span>MyApp</span></a>
<button type="button" class="nc-sidebar__toggle" aria-label="${eingeklappt ? 'Navigation ausklappen' : 'Navigation einklappen'}" aria-expanded="${!eingeklappt}">${EINKLAPPEN}</button>
</div>\n`
    : ''
  const fuss = voll ? `\n<div class="nc-sidebar__footer">\n${eintrag(m, 'Abmelden', 'abmelden')}\n</div>` : ''
  const klassen = [wurzelKlassen(m), ...extra].join(' ')
  return `<nav class="${klassen}" aria-label="Seitennavigation">
${kopf}<div class="nc-sidebar__nav">
${navigation(m)}
</div>${fuss}
</nav>`
}

export default (zelle, m) => {
  if (m.specimen.render?.compositionType === 'sidebar-mobile') {
    return `<div class="ra-buehne ra-buehne--mobil">
<div class="nc-sidebar-backdrop"></div>
${leiste(m, ['nc-sidebar--open'])}
</div>`
  }
  const hoch = (m.wert('content') || 'flat') === 'full'
  return `<div class="ra-spalte${hoch ? ' ra-spalte--hoch' : ''}">
${leiste(m)}
</div>`
}
