// Vorlage: navigation-tab-mega — die Website-Hauptnavigation „V3 Tab-Mega"
// (Drupal-Modul neo_nav, Theme neo_fe). Markup wie im Browser nach dem
// Aufbau durch neo_fe/js/neo-nav.js: die statische Huelle aus
// templates/navigation/neo-nav.html.twig plus das, was das Skript aus
// drupalSettings.neoNav einhaengt (Menuepunkte, Panels, Drawer-Bildschirme).
// Dieselbe Struktur steht in data/markup/navigation-tab-mega.html.
//
//   header.site-header[data-neo-nav] (+ .is-nav-hidden)
//     div.container.header-inner
//       a.brand > span.brand__name
//       nav.primary-nav > ul.nav-list > li > button.nav-btn | a.nav-link
//       div.header-actions > div.hdr-group (Sprache, Erscheinungsbild, Suche)
//                          + button.icon-btn.burger
//     div#panelHost > div.panel (je Menuepunkt mit Unterpunkten)
//     div.search-band
//   div.m-drawer > div.m-viewport > div.m-screen (Start + je Menuepunkt)
//
// Achsen: offen (was geoeffnet ist), teaser (mit/ohne Teaser-Karte),
// teaserFlaeche/teaserKnopf (Modifier am Kind aside.teaser), ausgabe
// (desktop/mobil), drawer (zu/start/unterseite). Zustaende: active (aktueller
// Ast: aria-current + .is-active am Menuepunkt), hidden (.is-nav-hidden am
// Header — setzt in Drupal das Auto-Hide beim Runterscrollen).
//
// Kein Verhalten: neo-behaviors hat fuer dieses Bauteil keins (offener
// Punkt, siehe ADR-005). Offene Zustaende stehen deshalb fest im Markup —
// genau so, wie neo-nav.js sie setzt (hidden weg, .is-open, aria-expanded).
//
// Arena-Rahmen: ra-kopf (Desktop-Breite, schneidet .is-nav-hidden ab),
// ra-kopf--offen (Platz fuer die Panels unter der Leiste) und ra-nav-mobil
// (schmale Buehne; die Mobil-Lage schaltet das Bauteil nur ueber die
// Fensterbreite, siehe RecipeArena.vue).
import { esc } from './_helfer.js'

// --- Inhalte (DE) — Struktur wie neo_nav_get_items() ------------------------
export const NAV = [
  {
    id: 'nav-loesungen',
    type: 'mega',
    href: '/loesungen',
    label: 'Lösungen',
    eyebrow: 'Lösungen nach',
    tabs: [
      {
        id: 'tab-branchen',
        label: 'Branchen',
        links: ['Öffentliche Verwaltung', 'Gesundheitswesen', 'Energie & Versorgung', 'Industrie & Produktion', 'Finanzdienstleistung', 'Handel & Logistik']
      },
      {
        id: 'tab-anwendungsfaelle',
        label: 'Anwendungsfälle',
        links: ['Interne Kommunikation', 'Mitarbeitende ohne Schreibtisch', 'Wissensmanagement', 'Onboarding', 'Zusammenarbeit im Team']
      }
    ],
    teaser: { title: 'Neu: NEO AI', text: 'Antworten aus Ihrem Intranet — in natürlicher Sprache und mit Quellenangabe.', cta: 'Mehr erfahren', href: '/produkte/ai' }
  },
  {
    id: 'nav-produkte',
    type: 'dropdown',
    href: '/produkte',
    label: 'Produkte',
    links: ['Social Intranet', 'Mitarbeiter-App', 'NEO AI', 'Wissensdatenbank', 'Digitale Formulare', 'Team-Räume', 'Integrationen'],
    teaser: { title: 'NEO kostenlos testen', text: '30 Tage, alle Funktionen, ohne Kreditkarte.', cta: 'Testzugang anlegen', href: '/testzugang' }
  },
  {
    // <nolink>: reiner Aufklapper ohne Landingpage — kein Uebersichtslink
    id: 'nav-unternehmen',
    type: 'dropdown',
    href: '',
    label: 'Unternehmen',
    links: ['Über uns', 'Team', 'Karriere', 'Partner', 'Kontakt']
  },
  {
    id: 'nav-inside',
    type: 'dropdown',
    href: '',
    label: 'Inside',
    links: ['Blog', 'Webinare', 'Kundenstimmen', 'Presse']
  },
  { id: 'nav-preise', type: 'link', href: '/editionen-preise', label: 'Editionen & Preise' }
]

// Feste UI-Texte — neo_nav_get_strings()
const T = { overview: 'Zur Übersicht', searchPlaceholder: 'Website durchsuchen …', contact: 'Kontakt', contactHref: '/kontakt', back: 'Zurück' }

// --- Symbole: neo-nav.js bzw. Icon Library (neo_fe_icon, Heroicons) ---------
const SVG_PLUS = '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>'
const SVG_MINUS = '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/></svg>'
const SVG_ARROW = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"/></svg>'
const ICON = {
  globe: '<svg aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418"/></svg>',
  sun: '<svg aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"/></svg>',
  check: '<svg aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5"/></svg>',
  search: '<svg aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"/></svg>'
}
const BURGER_ZU = '<path d="M3 6h18M3 12h18M3 18h18"/>'
const BURGER_OFFEN = '<path d="M6 6l12 12M18 6L6 18"/>'

const pfad = (text) => '/' + text.toLowerCase()
  .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
  .replace(/&/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
const pfeil = () => `<span class="nav-arrow" aria-hidden="true">${SVG_ARROW}</span>`
const attr = (bed, text) => (bed ? ` ${text}` : '')
// ids wie auf der Website; in der Arena mit Praefix je Zelle (m.uid)
const I = (o, name) => (o.uid ? `${o.uid}-${name}` : name)

/** Huelle der Vorlage: welche Teile offen sind, welche Inhalte gelten. */
export function optionen (m) {
  const wert = (a, vorgabe) => m.wert(a) ?? vorgabe
  return {
    uid: m.uid,
    offen: wert('offen', 'keins'),
    teaser: wert('teaser', 'mit') === 'mit',
    teaserKlassen: m.klassen.filter((k) => k.startsWith('teaser--')),
    aktiv: m.hat('active'),
    versteckt: m.hat('hidden'),
    drawer: wert('drawer', 'zu')
  }
}

// --- Teile ------------------------------------------------------------------
// offen=mega oeffnet den ersten Mega-Punkt (Loesungen), offen=dropdown den
// ersten Dropdown-Punkt (Produkte).
const offenerPunkt = (o) => NAV.find((n) => n.type === o.offen) || null

function teaserKarte (t, o) {
  const fassung = o.teaserKlassen.find((k) => k.startsWith('teaser--cta-')) || 'teaser--cta-dark'
  const flaeche = o.teaserKlassen.filter((k) => k.startsWith('teaser--bg-'))
  return `<aside class="${['teaser', fassung, ...flaeche].join(' ')}">
<p class="teaser__title">${esc(t.title)}</p>
<p class="teaser__text">${esc(t.text)}</p>
<a class="teaser__cta" href="${t.href}"><span>${esc(t.cta)}</span>${pfeil()}</a>
</aside>`
}

function uebersicht (item) {
  if (!item.href) return ''
  return `<a class="panel-overview" href="${item.href}"><span>${T.overview}</span>${pfeil()}</a>`
}

const linkLi = (text) => `<li><a href="${pfad(text)}">${esc(text)}</a></li>`

function megaInhalt (item, o) {
  const tabs = item.tabs.map((tab, i) => `<button class="tab" type="button" id="${I(o, `tab-${item.id}-${tab.id}`)}" role="tab" aria-selected="${i === 0}" aria-controls="${I(o, `tabpanel-${item.id}-${tab.id}`)}" tabindex="${i === 0 ? 0 : -1}"><span>${esc(tab.label)}</span><span class="tab__count">(${tab.links.length})</span></button>`).join('\n')
  const panels = item.tabs.map((tab, i) => `<div class="tabpanel" id="${I(o, `tabpanel-${item.id}-${tab.id}`)}" role="tabpanel" aria-labelledby="${I(o, `tab-${item.id}-${tab.id}`)}"${attr(i > 0, 'hidden')}>
<ul class="link-grid">
${tab.links.map(linkLi).join('\n')}
</ul>
</div>`).join('\n')
  const mitTeaser = o.teaser && item.teaser
  return `<div class="mega-grid${mitTeaser ? '' : ' mega-grid--no-teaser'}">
<div class="mega-cat">
${item.eyebrow ? `<p class="mega-cat__eyebrow">${esc(item.eyebrow)}</p>\n` : ''}<div class="tablist" role="tablist" aria-orientation="vertical" aria-label="${esc(item.label)}">
${tabs}
</div>
</div>
<div>
${panels}
${uebersicht(item)}
</div>
${mitTeaser ? teaserKarte(item.teaser, o) : ''}
</div>`
}

function dropdownInhalt (item, o) {
  const liste = `<ul class="dropdown-cols">
${item.links.map(linkLi).join('\n')}
</ul>
${uebersicht(item)}`
  if (!(o.teaser && item.teaser)) return liste
  return `<div class="dropdown-grid">
<div>
${liste}
</div>
${teaserKarte(item.teaser, o)}
</div>`
}

function panel (item, o) {
  const auf = offenerPunkt(o) === item
  return `<div class="panel${auf ? ' is-open' : ''}" id="${I(o, `panel-${item.id}`)}" data-panel="${item.id}" role="region" aria-label="${esc(item.label)}"${attr(!auf, 'hidden')}>
<div class="container"><div class="panel-inner">
${item.type === 'mega' ? megaInhalt(item, o) : dropdownInhalt(item, o)}
</div></div>
</div>`
}

function menuepunkt (item, o) {
  const aktiv = o.aktiv && item.id === 'nav-loesungen'
  if (item.type === 'link') return `<li><a class="nav-link" href="${item.href}">${esc(item.label)}</a></li>`
  const auf = offenerPunkt(o) === item
  return `<li><button class="nav-btn${aktiv ? ' is-active' : ''}" type="button" id="${I(o, `trigger-${item.id}`)}" aria-haspopup="true" aria-expanded="${auf}" aria-controls="${I(o, `panel-${item.id}`)}" data-trigger="${item.id}"${attr(aktiv, 'aria-current="true"')}><span class="nav-btn__label" data-text="${esc(item.label)}"><span>${esc(item.label)}</span></span><span class="nav-btn__pm" aria-hidden="true"><span class="pm-plus">${SVG_PLUS}</span><span class="pm-minus">${SVG_MINUS}</span></span></button></li>`
}

function option (wert, label, an, code = '') {
  const daten = code ? `data-lang="${wert}"` : `data-theme-value="${wert}"`
  return `<button type="button" class="hdr-opt" role="menuitemradio" ${daten} aria-checked="${an}">
<span class="hdr-opt__label">${label}</span>
${code ? `<span class="hdr-opt__code">${code}</span>\n` : ''}<span class="hdr-opt__check" aria-hidden="true">${ICON.check}</span>
</button>`
}

function kopfMenues (o) {
  const sprache = o.offen === 'sprache'
  const ansicht = o.offen === 'ansicht'
  const suche = o.offen === 'suche'
  return `<div class="hdr-group" role="group" aria-label="Ansicht und Suche">
<div class="hdr-menu" data-hdr-menu>
<button type="button" class="hdr-btn" id="${I(o, 'langToggle')}" aria-expanded="${sprache}" aria-haspopup="true" aria-controls="${I(o, 'langPanel')}">
<span class="hdr-btn__icon" aria-hidden="true">${ICON.globe}</span>
<span class="hdr-btn__code" data-lang-code>DE</span>
<span class="visually-hidden">Sprache wählen</span>
</button>
<div class="hdr-pop" id="${I(o, 'langPanel')}"${attr(!sprache, 'hidden')}>
<p class="hdr-pop__title" id="${I(o, 'langPanelTitle')}">Sprache</p>
<ul class="hdr-pop__list" role="menu" aria-labelledby="${I(o, 'langPanelTitle')}">
<li role="none">
${option('de', 'Deutsch', true, 'DE')}
</li>
<li role="none">
${option('en', 'English', false, 'EN')}
</li>
</ul>
</div>
</div>
<div class="hdr-menu" data-hdr-menu>
<button type="button" class="hdr-btn hdr-btn--icon" id="${I(o, 'themeToggle')}" aria-expanded="${ansicht}" aria-haspopup="true" aria-controls="${I(o, 'themePanel')}">
<span class="hdr-btn__icon" data-theme-icon aria-hidden="true">${ICON.sun}</span>
<span class="visually-hidden">Erscheinungsbild wählen</span>
</button>
<div class="hdr-pop" id="${I(o, 'themePanel')}"${attr(!ansicht, 'hidden')}>
<p class="hdr-pop__title" id="${I(o, 'themePanelTitle')}">Erscheinungsbild</p>
<ul class="hdr-pop__list" role="menu" aria-labelledby="${I(o, 'themePanelTitle')}">
<li role="none">
${option('neo-light-theme', 'Hell', false)}
</li>
<li role="none">
${option('neo-dark-theme', 'Dunkel', false)}
</li>
<li role="none" class="hdr-pop__sep">
${option('system', 'Systemeinstellung', true)}
</li>
</ul>
</div>
</div>
<button type="button" class="hdr-btn hdr-btn--icon search-toggle" id="${I(o, 'searchToggle')}" aria-expanded="${suche}" aria-controls="${I(o, 'searchBand')}" aria-label="Suche öffnen">
<span class="hdr-btn__icon" aria-hidden="true">${ICON.search}</span>
</button>
</div>`
}

function suchBand (o) {
  const auf = o.offen === 'suche'
  return `<div class="search-band${auf ? ' is-open' : ''}" id="${I(o, 'searchBand')}" role="region" aria-label="Suche"${attr(!auf, 'hidden')}>
<div class="container">
<form class="search-form" id="${I(o, 'searchForm')}" role="search" action="/" method="get">
<div class="searchbox">
<svg class="searchbox__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
<label for="${I(o, 'searchInput')}" class="visually-hidden">Website durchsuchen</label>
<input type="search" class="search-input" id="${I(o, 'searchInput')}" name="search" autocomplete="off" placeholder="${T.searchPlaceholder}">
<button type="button" class="search-clear" id="${I(o, 'searchClear')}" hidden aria-label="Eingabe löschen">
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true" focusable="false"><path d="M18 6L6 18M6 6l12 12"/></svg>
</button>
<button type="submit" class="search-submit">Suchen</button>
</div>
<button type="button" class="search-close" id="${I(o, 'searchClose')}">
Schließen <kbd class="nc-kbd">Esc</kbd>
</button>
</form>
</div>
</div>`
}

/** Kopfleiste: header.site-header mit Panels und Such-Band. */
export function kopf (o) {
  const drawerAuf = o.drawer !== 'zu'
  return `<header class="site-header${o.versteckt ? ' is-nav-hidden' : ''}" id="${I(o, 'siteHeader')}" data-neo-nav>
<div class="container header-inner">
<a class="brand" href="/" rel="home" aria-label="NEOCOSMO"><span class="brand__name">NEOCOSMO</span></a>
<nav class="primary-nav" aria-label="Hauptnavigation">
<ul class="nav-list" id="${I(o, 'navList')}">
${NAV.map((item) => menuepunkt(item, o)).join('\n')}
</ul>
</nav>
<div class="header-actions">
${kopfMenues(o)}
<button type="button" class="icon-btn burger" id="${I(o, 'burger')}" aria-expanded="${drawerAuf}" aria-controls="${I(o, 'mDrawer')}" aria-label="${drawerAuf ? 'Menü schließen' : 'Menü öffnen'}">
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">${drawerAuf ? BURGER_OFFEN : BURGER_ZU}</svg>
</button>
</div>
</div>
<div id="${I(o, 'panelHost')}">
${NAV.filter((item) => item.type !== 'link').map((item) => panel(item, o)).join('\n')}
</div>
${suchBand(o)}
</header>`
}

function mobilUnterseite (item, aktiv) {
  const links = item.type === 'mega'
    ? item.tabs.map((tab) => `<div class="m-section-title">${esc(tab.label)}</div>\n${tab.links.map((t) => `<a class="m-link" href="${pfad(t)}">${esc(t)}</a>`).join('\n')}`).join('\n')
    : item.links.map((t) => `<a class="m-link" href="${pfad(t)}">${esc(t)}</a>`).join('\n')
  return `<div class="m-screen${aktiv ? ' is-active' : ''}" data-screen="${item.id}">
<button class="m-back" type="button">‹ <span>${T.back}</span></button>
<div class="m-heading">${esc(item.label)}</div>
${links}
${item.href ? `<a class="m-link" href="${item.href}"><span>${T.overview}</span>${pfeil()}</a>\n` : ''}</div>`
}

/** Mobiler Drawer: Push-Navigation mit Start- und Unterseiten. */
export function drawer (o) {
  const unten = o.drawer === 'unterseite'
  const zeilen = NAV.map((item) => (item.type === 'link'
    ? `<a class="m-row" href="${item.href}"><span>${esc(item.label)}</span></a>`
    : `<button class="m-row" type="button"><span>${esc(item.label)}</span><span class="chev" aria-hidden="true">${SVG_PLUS}</span></button>`)).join('\n')
  return `<div class="m-drawer${o.drawer !== 'zu' ? ' is-open' : ''}" id="${I(o, 'mDrawer')}" aria-label="Mobile Navigation">
<div class="m-viewport" id="${I(o, 'mViewport')}">
<div class="m-screen ${unten ? 'is-prev' : 'is-active'}" data-screen="root">
${zeilen}
<div class="m-tools">
<form class="m-search" role="search" action="/" method="get">
<label class="visually-hidden" for="${I(o, 'mSearchInput')}">Website durchsuchen</label>
<input type="search" name="search" id="${I(o, 'mSearchInput')}" placeholder="${T.searchPlaceholder}">
</form>
<div class="lang-switch m-lang" role="group" aria-label="Sprache">
<button type="button" data-lang="de" aria-pressed="true">DE</button>
<button type="button" data-lang="en" aria-pressed="false">EN</button>
</div>
<a class="m-cta" href="${T.contactHref}">${T.contact}</a>
</div>
</div>
${NAV.filter((item) => item.type !== 'link').map((item) => mobilUnterseite(item, unten && item.id === 'nav-loesungen')).join('\n')}
</div>
</div>`
}

export default (zelle, m) => {
  const o = optionen(m)
  const teile = `${kopf(o)}\n${drawer(o)}`
  if (m.wert('ausgabe') === 'mobil') return `<div class="ra-nav-mobil">\n${teile}\n</div>`
  const rahmen = ['ra-kopf', o.offen !== 'keins' ? 'ra-kopf--offen' : ''].filter(Boolean).join(' ')
  return `<div class="${rahmen}">\n${teile}\n</div>`
}
