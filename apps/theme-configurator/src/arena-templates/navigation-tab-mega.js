// Vorlage: navigation-tab-mega — die Website-Hauptnavigation „V3 Tab-Mega"
// (Drupal-Modul neo_nav, Theme neo_fe). Markup wie es
// templates/navigation/neo-nav.html.twig serverseitig rendert (Menuepunkte,
// Panels, Drawer-Bildschirme; bis 03.10.2026 baute neo-nav.js dasselbe im
// Browser aus drupalSettings.neoNav). Dieselbe Struktur steht in
// data/markup/navigation-tab-mega.html.
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
// Achsen: variante (standard | zentriert, I06), offen (was geoeffnet ist), teaser (mit/ohne Teaser-Karte),
// teaserFlaeche/teaserKnopf (Modifier am Kind aside.teaser), ausgabe
// (desktop/mobil), drawer (zu/start/unterseite). Zustaende: active (aktueller
// Ast: aria-current + .is-active am Menuepunkt), hidden (.is-nav-hidden am
// Header — setzt in Drupal das Auto-Hide beim Runterscrollen).
//
// Verhalten: neo-behaviors `navigation-tab-mega` (Entscheidung 03.10.2026,
// loest neo-nav.js ab). In „Zustände" stehen offene Zustaende fest im Markup
// (hidden weg, .is-open, aria-expanded); in „Ausprobieren" (m.ausprobieren)
// startet alles zu, das Behavior oeffnet. Dort ist das Auto-Hide
// abgeschaltet (data-neo-nav-autohide="aus"), sonst verschwaende die Leiste
// beim Scrollen des Konfigurators.
//
// Sprache: jede uebersetzbare Beschriftung traegt beide Fassungen in
// data-neo-i18n (JSON {de, en}; mit data-neo-i18n-attr fuer ein Attribut) —
// genau so rendert neo-nav.html.twig sie; das Behavior beschriftet beim
// Sprachwechsel daraus neu.
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

// Englische Fassungen (Uebersetzung der Menue-Links bzw. neo_nav_get_strings());
// was fehlt, faellt wie im Modul auf Deutsch zurueck.
export const EN = {
  'Lösungen': 'Solutions',
  'Lösungen nach': 'Solutions by',
  Branchen: 'Industries',
  'Anwendungsfälle': 'Use cases',
  Produkte: 'Products',
  Unternehmen: 'Company',
  'Editionen & Preise': 'Editions & pricing',
  'Öffentliche Verwaltung': 'Public sector',
  Gesundheitswesen: 'Healthcare',
  'Interne Kommunikation': 'Internal communication',
  'Über uns': 'About us',
  Karriere: 'Careers',
  'Neu: NEO AI': 'New: NEO AI',
  'Mehr erfahren': 'Learn more',
  'NEO kostenlos testen': 'Try NEO for free',
  'Testzugang anlegen': 'Create trial account',
  [T.overview]: 'View overview',
  [T.searchPlaceholder]: 'Search the website …',
  [T.contact]: 'Contact',
  [T.back]: 'Back'
}

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
// --- Variante „zentriert“ (I06): Icon und Erklaersatz je Eintrag ----------
// In Drupal kommen beide aus Feldern am Menuepunkt (Icon als Tabler-Name,
// Erklaersatz uebersetzbar). Hier eine Auswahl, damit die Arena beides zeigt:
// Eintraege mit Icon und Satz, mit nur einem von beiden und ohne.
// SVG-Inhalte aus @tabler/icons (outline), Strich 1,5 wie im DS.
const TABLER = {
  'building-bank': '<path d="M3 21l18 0"/><path d="M3 10l18 0"/><path d="M5 6l7 -3l7 3"/><path d="M4 10l0 11"/><path d="M20 10l0 11"/><path d="M8 14l0 3"/><path d="M12 14l0 3"/><path d="M16 14l0 3"/>',
  'heart-rate-monitor': '<path d="M3 5a1 1 0 0 1 1 -1h16a1 1 0 0 1 1 1v10a1 1 0 0 1 -1 1h-16a1 1 0 0 1 -1 -1l0 -10"/><path d="M7 20h10"/><path d="M9 16v4"/><path d="M15 16v4"/><path d="M7 10h2l2 3l2 -6l1 3h3"/>',
  bolt: '<path d="M13 3l0 7l6 0l-8 11l0 -7l-6 0l8 -11"/>',
  'building-factory-2': '<path d="M3 21h18"/><path d="M5 21v-12l5 4v-4l5 4h4"/><path d="M19 21v-8l-1.436 -9.574a.5 .5 0 0 0 -.495 -.426h-1.145a.5 .5 0 0 0 -.494 .418l-1.43 8.582"/><path d="M9 17h1"/><path d="M14 17h1"/>',
  coins: '<path d="M9 14c0 1.657 2.686 3 6 3s6 -1.343 6 -3s-2.686 -3 -6 -3s-6 1.343 -6 3"/><path d="M9 14v4c0 1.656 2.686 3 6 3s6 -1.344 6 -3v-4"/><path d="M3 6c0 1.072 1.144 2.062 3 2.598s4.144 .536 6 0c1.856 -.536 3 -1.526 3 -2.598c0 -1.072 -1.144 -2.062 -3 -2.598s-4.144 -.536 -6 0c-1.856 .536 -3 1.526 -3 2.598"/><path d="M3 6v10c0 .888 .772 1.45 2 2"/><path d="M3 11c0 .888 .772 1.45 2 2"/>',
  truck: '<path d="M5 17a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"/><path d="M15 17a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"/><path d="M5 17h-2v-11a1 1 0 0 1 1 -1h9v12m-4 0h6m4 0h2v-6h-8m0 -5h5l3 5"/>',
  speakerphone: '<path d="M18 8a3 3 0 0 1 0 6"/><path d="M10 8v11a1 1 0 0 1 -1 1h-1a1 1 0 0 1 -1 -1v-5"/><path d="M12 8l4.524 -3.77a.9 .9 0 0 1 1.476 .692v12.156a.9 .9 0 0 1 -1.476 .692l-4.524 -3.77h-8a1 1 0 0 1 -1 -1v-4a1 1 0 0 1 1 -1h8"/>',
  'device-mobile': '<path d="M6 5a2 2 0 0 1 2 -2h8a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-8a2 2 0 0 1 -2 -2v-14"/><path d="M11 4h2"/><path d="M12 17v.01"/>',
  books: '<path d="M5 5a1 1 0 0 1 1 -1h2a1 1 0 0 1 1 1v14a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1l0 -14"/><path d="M9 5a1 1 0 0 1 1 -1h2a1 1 0 0 1 1 1v14a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1l0 -14"/><path d="M5 8h4"/><path d="M9 16h4"/><path d="M13.803 4.56l2.184 -.53c.562 -.135 1.133 .19 1.282 .732l3.695 13.418a1.02 1.02 0 0 1 -.634 1.219l-.133 .041l-2.184 .53c-.562 .135 -1.133 -.19 -1.282 -.732l-3.695 -13.418a1.02 1.02 0 0 1 .634 -1.219l.133 -.041"/><path d="M14 9l4 -1"/><path d="M16 16l3.923 -.98"/>',
  'user-plus': '<path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0"/><path d="M16 19h6"/><path d="M19 16v6"/><path d="M6 21v-2a4 4 0 0 1 4 -4h4"/>',
  'users-group': '<path d="M10 13a2 2 0 1 0 4 0a2 2 0 0 0 -4 0"/><path d="M8 21v-1a2 2 0 0 1 2 -2h4a2 2 0 0 1 2 2v1"/><path d="M15 5a2 2 0 1 0 4 0a2 2 0 0 0 -4 0"/><path d="M17 10h2a2 2 0 0 1 2 2v1"/><path d="M5 5a2 2 0 1 0 4 0a2 2 0 0 0 -4 0"/><path d="M3 13v-1a2 2 0 0 1 2 -2h2"/>',
  messages: '<path d="M21 14l-3 -3h-7a1 1 0 0 1 -1 -1v-6a1 1 0 0 1 1 -1h9a1 1 0 0 1 1 1v10"/><path d="M14 15v2a1 1 0 0 1 -1 1h-7l-3 3v-10a1 1 0 0 1 1 -1h2"/>',
  sparkles: '<path d="M16 18a2 2 0 0 1 2 2a2 2 0 0 1 2 -2a2 2 0 0 1 -2 -2a2 2 0 0 1 -2 2m0 -12a2 2 0 0 1 2 2a2 2 0 0 1 2 -2a2 2 0 0 1 -2 -2a2 2 0 0 1 -2 2m-7 12a6 6 0 0 1 6 -6a6 6 0 0 1 -6 -6a6 6 0 0 1 -6 6a6 6 0 0 1 6 6"/>',
  book: '<path d="M3 19a9 9 0 0 1 9 0a9 9 0 0 1 9 0"/><path d="M3 6a9 9 0 0 1 9 0a9 9 0 0 1 9 0"/><path d="M3 6l0 13"/><path d="M12 6l0 13"/><path d="M21 6l0 13"/>',
  forms: '<path d="M12 3a3 3 0 0 0 -3 3v12a3 3 0 0 0 3 3"/><path d="M6 3a3 3 0 0 1 3 3v12a3 3 0 0 1 -3 3"/><path d="M13 7h7a1 1 0 0 1 1 1v8a1 1 0 0 1 -1 1h-7"/><path d="M5 7h-1a1 1 0 0 0 -1 1v8a1 1 0 0 0 1 1h1"/><path d="M17 12h.01"/><path d="M13 12h.01"/>',
  'plug-connected': '<path d="M7 12l5 5l-1.5 1.5a3.536 3.536 0 1 1 -5 -5l1.5 -1.5"/><path d="M17 12l-5 -5l1.5 -1.5a3.536 3.536 0 1 1 5 5l-1.5 1.5"/><path d="M3 21l2.5 -2.5"/><path d="M18.5 5.5l2.5 -2.5"/><path d="M10 11l-2 2"/><path d="M13 14l-2 2"/>'
}
const tabler = (name) => `<svg aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${TABLER[name]}</svg>`

export const ZUSATZ = {
  'Öffentliche Verwaltung': { icon: 'building-bank', desc: 'Bürgernah informieren, sicher zusammenarbeiten.' },
  Gesundheitswesen: { icon: 'heart-rate-monitor', desc: 'Schichtteams und Stationen auf einem Stand.' },
  'Energie & Versorgung': { icon: 'bolt' },
  'Industrie & Produktion': { icon: 'building-factory-2', desc: 'Auch für die Halle, nicht nur fürs Büro.' },
  Finanzdienstleistung: { icon: 'coins' },
  'Handel & Logistik': { icon: 'truck' },
  'Interne Kommunikation': { icon: 'speakerphone', desc: 'News, Kampagnen und Umfragen an einem Ort.' },
  'Mitarbeitende ohne Schreibtisch': { icon: 'device-mobile', desc: 'Per App erreichbar, ohne Firmen-E-Mail.' },
  Wissensmanagement: { icon: 'books' },
  Onboarding: { icon: 'user-plus' },
  'Zusammenarbeit im Team': { icon: 'users-group' },
  'Social Intranet': { icon: 'messages', desc: 'Das digitale Zuhause Ihrer Organisation.' },
  'Mitarbeiter-App': { icon: 'device-mobile', desc: 'Alle erreichen, auch unterwegs.' },
  'NEO AI': { icon: 'sparkles', desc: 'Antworten aus Ihrem Intranet.' },
  Wissensdatenbank: { icon: 'book' },
  'Digitale Formulare': { icon: 'forms' },
  Integrationen: { icon: 'plug-connected' },
  // nur Erklaersatz, ohne Icon
  Karriere: { desc: 'Offene Stellen und wie wir arbeiten.' }
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
// beide Sprachfassungen fuer das Behavior (Text bzw. Attribut)
const tr = (de, attr = '') => ` data-neo-i18n="${esc(JSON.stringify({ de, en: EN[de] || de }))}"${attr ? ` data-neo-i18n-attr="${attr}"` : ''}`

/** Huelle der Vorlage: welche Teile offen sind, welche Inhalte gelten. */
export function optionen (m) {
  const wert = (a, vorgabe) => m.wert(a) ?? vorgabe
  const live = !!m.ausprobieren
  return {
    uid: m.uid,
    live,
    zentriert: wert('variante', 'standard') === 'zentriert',
    offen: live ? 'keins' : wert('offen', 'keins'),
    teaser: wert('teaser', 'mit') === 'mit',
    teaserKlassen: m.klassen.filter((k) => k.startsWith('teaser--')),
    teaserMedium: wert('teaserMedium', 'keins'),
    aktiv: m.hat('active'),
    versteckt: m.hat('hidden'),
    drawer: live ? 'zu' : wert('drawer', 'zu')
  }
}

// --- Teile ------------------------------------------------------------------
// offen=mega oeffnet den ersten Mega-Punkt (Loesungen), offen=dropdown den
// ersten Dropdown-Punkt (Produkte).
const offenerPunkt = (o) => NAV.find((n) => n.type === o.offen) || null

// Medium oberhalb des Textes (I06 Phase 4b, nur zentriert). Video startet nie
// von selbst: keine Bewegung ohne Zutun (WCAG 2.2.2), Steuerelemente sichtbar.
const TEASER_BILD = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 16 9%22%3E%3Crect width=%2216%22 height=%229%22 fill=%22%23afb2af%22/%3E%3C/svg%3E'
function teaserMedium (o) {
  if (o.teaserMedium === 'bild') return `<div class="teaser__medium"><img src="${TEASER_BILD}" alt="" width="16" height="9"></div>\n`
  if (o.teaserMedium === 'video') return `<div class="teaser__medium"><video controls muted playsinline preload="none" poster="${TEASER_BILD}" aria-label="Video zum Teaser"></video></div>\n`
  return ''
}

function teaserKarte (t, o) {
  const fassung = o.teaserKlassen.find((k) => k.startsWith('teaser--cta-')) || 'teaser--cta-dark'
  const flaeche = o.teaserKlassen.filter((k) => k.startsWith('teaser--bg-'))
  const buendig = o.zentriert && o.teaserKlassen.includes('teaser--buendig') ? ['teaser--buendig'] : []
  return `<aside class="${['teaser', fassung, ...flaeche, ...buendig].join(' ')}">
${o.zentriert ? teaserMedium(o) : ''}<p class="teaser__title"${tr(t.title)}>${esc(t.title)}</p>
<p class="teaser__text"${tr(t.text)}>${esc(t.text)}</p>
<a class="teaser__cta" href="${t.href}"><span${tr(t.cta)}>${esc(t.cta)}</span>${pfeil()}</a>
</aside>`
}

function uebersicht (item) {
  if (!item.href) return ''
  return `<a class="panel-overview" href="${item.href}"><span${tr(T.overview)}>${T.overview}</span>${pfeil()}</a>`
}

const linkLi = (text) => `<li><a href="${pfad(text)}"${tr(text)}>${esc(text)}</a></li>`

function megaInhalt (item, o) {
  const tabs = item.tabs.map((tab, i) => `<button class="tab" type="button" id="${I(o, `tab-${item.id}-${tab.id}`)}" role="tab" aria-selected="${i === 0}" aria-controls="${I(o, `tabpanel-${item.id}-${tab.id}`)}" tabindex="${i === 0 ? 0 : -1}"><span${tr(tab.label)}>${esc(tab.label)}</span><span class="tab__count">(${tab.links.length})</span></button>`).join('\n')
  const panels = item.tabs.map((tab, i) => `<div class="tabpanel" id="${I(o, `tabpanel-${item.id}-${tab.id}`)}" role="tabpanel" aria-labelledby="${I(o, `tab-${item.id}-${tab.id}`)}"${attr(i > 0, 'hidden')}>
<ul class="link-grid">
${tab.links.map(linkLi).join('\n')}
</ul>
</div>`).join('\n')
  const mitTeaser = o.teaser && item.teaser
  return `<div class="mega-grid${mitTeaser ? '' : ' mega-grid--no-teaser'}">
<div class="mega-cat">
${item.eyebrow ? `<p class="mega-cat__eyebrow"${tr(item.eyebrow)}>${esc(item.eyebrow)}</p>\n` : ''}<div class="tablist" role="tablist" aria-orientation="vertical" aria-label="${esc(item.label)}"${tr(item.label, 'aria-label')}>
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

// --- Variante „zentriert“ ---------------------------------------------------
// Eintrag mit optionalem Icon und Erklaersatz. data-neo-i18n an Label und
// Satz (nicht am Link): das Behavior ersetzt textContent und wuerde sonst
// Icon und Satz loeschen.
function eintragInnen (text) {
  const z = ZUSATZ[text] || {}
  return `${z.icon ? `<span class="nav-eintrag__ico" aria-hidden="true">${tabler(z.icon)}</span>` : ''}<span class="nav-eintrag__text"><span class="nav-eintrag__label"${tr(text)}>${esc(text)}</span>${z.desc ? `<span class="nav-eintrag__desc"${tr(z.desc)}>${esc(z.desc)}</span>` : ''}</span>`
}
const eintragLi = (text) => `<li><a class="nav-eintrag" href="${pfad(text)}">${eintragInnen(text)}</a></li>`

function megaInhaltZentriert (item, o) {
  const mitTeaser = o.teaser && item.teaser
  const gruppen = item.tabs.map((tab) => `<div class="mega-gruppe">
<p class="mega-gruppe__eyebrow" id="${I(o, `gruppe-${item.id}-${tab.id}`)}"${tr(tab.label)}>${esc(tab.label)}</p>
<ul class="nav-eintraege" aria-labelledby="${I(o, `gruppe-${item.id}-${tab.id}`)}">
${tab.links.map(eintragLi).join('\n')}
</ul>
</div>`).join('\n')
  const fuss = uebersicht(item)
  return `<div class="mega-gruppen${mitTeaser ? '' : ' mega-gruppen--no-teaser'}">
<div class="mega-gruppen__liste">
${gruppen}
</div>
${mitTeaser ? teaserKarte(item.teaser, o) + '\n' : ''}${fuss ? `<div class="mega-gruppen__fuss">\n${fuss}\n</div>\n` : ''}</div>`
}

function dropdownInhaltZentriert (item, o) {
  const eintraege = `<ul class="nav-eintraege nav-eintraege--spalten">
${item.links.map(eintragLi).join('\n')}
</ul>`
  const liste = `${eintraege}
${uebersicht(item)}`
  if (!(o.teaser && item.teaser)) return liste
  // Bündig: Der Teaser endet mit dem letzten Link, der Übersichtslink rückt darunter.
  if (o.teaserKlassen.includes('teaser--buendig')) {
    return `<div class="dropdown-grid">
<div>
${eintraege}
</div>
${teaserKarte(item.teaser, o)}
<div class="mega-gruppen__fuss">
${uebersicht(item)}
</div>
</div>`
  }
  return `<div class="dropdown-grid">
<div>
${liste}
</div>
${teaserKarte(item.teaser, o)}
</div>`
}

function panel (item, o) {
  const auf = offenerPunkt(o) === item
  return `<div class="panel${auf ? ' is-open' : ''}" id="${I(o, `panel-${item.id}`)}" data-panel="${item.id}" role="region" aria-label="${esc(item.label)}"${tr(item.label, 'aria-label')}${attr(!auf, 'hidden')}>
<div class="container"><div class="panel-inner">
${o.zentriert
  ? (item.type === 'mega' ? megaInhaltZentriert(item, o) : dropdownInhaltZentriert(item, o))
  : (item.type === 'mega' ? megaInhalt(item, o) : dropdownInhalt(item, o))}
</div></div>
</div>`
}

function menuepunkt (item, o) {
  const aktiv = o.aktiv && item.id === 'nav-loesungen'
  if (item.type === 'link') return `<li><a class="nav-link" href="${item.href}"${tr(item.label)}>${esc(item.label)}</a></li>`
  const auf = offenerPunkt(o) === item
  return `<li><button class="nav-btn${aktiv ? ' is-active' : ''}" type="button" id="${I(o, `trigger-${item.id}`)}" aria-haspopup="true" aria-expanded="${auf}" aria-controls="${I(o, `panel-${item.id}`)}" data-trigger="${item.id}"${attr(aktiv, 'aria-current="true"')}><span class="nav-btn__label" data-text="${esc(item.label)}"${tr(item.label, 'data-text')}><span${tr(item.label)}>${esc(item.label)}</span></span><span class="nav-btn__pm" aria-hidden="true"><span class="pm-plus">${SVG_PLUS}</span><span class="pm-minus">${SVG_MINUS}</span></span></button></li>`
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
<input type="search" class="search-input" id="${I(o, 'searchInput')}" name="search" autocomplete="off" placeholder="${T.searchPlaceholder}"${tr(T.searchPlaceholder, 'placeholder')}>
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
  return `<header class="site-header${o.versteckt ? ' is-nav-hidden' : ''}" id="${I(o, 'siteHeader')}" data-neo-nav${o.zentriert ? ' data-nav-variante="zentriert"' : ''}${o.live ? ' data-neo-nav-autohide="aus"' : ''}>
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

function mobilUnterseite (item, aktiv, o) {
  const mLink = o.zentriert
    ? (t) => `<a class="m-link m-link--eintrag" href="${pfad(t)}">${eintragInnen(t)}</a>`
    : (t) => `<a class="m-link" href="${pfad(t)}"${tr(t)}>${esc(t)}</a>`
  const links = item.type === 'mega'
    ? item.tabs.map((tab) => `<div class="m-section-title"${tr(tab.label)}>${esc(tab.label)}</div>\n${tab.links.map(mLink).join('\n')}`).join('\n')
    : item.links.map(mLink).join('\n')
  return `<div class="m-screen${aktiv ? ' is-active' : ''}" id="${I(o, `m-screen-${item.id}`)}" data-screen="${item.id}">
<button class="m-back" type="button">‹ <span${tr(T.back)}>${T.back}</span></button>
<div class="m-heading"${tr(item.label)}>${esc(item.label)}</div>
${links}
${item.href ? `<a class="m-link" href="${item.href}"><span${tr(T.overview)}>${T.overview}</span>${pfeil()}</a>\n` : ''}</div>`
}

/** Mobiler Drawer: Push-Navigation mit Start- und Unterseiten. */
export function drawer (o) {
  const unten = o.drawer === 'unterseite'
  const zeilen = NAV.map((item) => (item.type === 'link'
    ? `<a class="m-row" href="${item.href}"><span${tr(item.label)}>${esc(item.label)}</span></a>`
    : `<button class="m-row" type="button" aria-controls="${I(o, `m-screen-${item.id}`)}"><span${tr(item.label)}>${esc(item.label)}</span><span class="chev" aria-hidden="true">${SVG_PLUS}</span></button>`)).join('\n')
  return `<div class="m-drawer${o.drawer !== 'zu' ? ' is-open' : ''}" id="${I(o, 'mDrawer')}"${o.zentriert ? ' data-nav-variante="zentriert"' : ''} aria-label="Mobile Navigation">
<div class="m-viewport" id="${I(o, 'mViewport')}">
<div class="m-screen ${unten ? 'is-prev' : 'is-active'}" data-screen="root">
${zeilen}
<div class="m-tools">
<form class="m-search" role="search" action="/" method="get">
<label class="visually-hidden" for="${I(o, 'mSearchInput')}">Website durchsuchen</label>
<input type="search" name="search" id="${I(o, 'mSearchInput')}" placeholder="${T.searchPlaceholder}"${tr(T.searchPlaceholder, 'placeholder')}>
</form>
<div class="lang-switch m-lang" role="group" aria-label="Sprache">
<button type="button" data-lang="de" aria-pressed="true">DE</button>
<button type="button" data-lang="en" aria-pressed="false">EN</button>
</div>
<a class="m-cta" href="${T.contactHref}"${tr(T.contact)}>${T.contact}</a>
</div>
</div>
${NAV.filter((item) => item.type !== 'link').map((item) => mobilUnterseite(item, unten && item.id === 'nav-loesungen', o)).join('\n')}
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
