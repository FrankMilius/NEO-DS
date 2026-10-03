// Vorlage: navigation-menu — Markup nach scss/scss/07-organisms/
// _navigation-menu.scss und data/markup/navigation-menu.html, WAI-ARIA
// Disclosure-Navigation (Recipe 3.0.0, Entscheidung 03.10.2026):
//   nav.nc-navigation-menu  aria-label, data-trigger="hover|click"
//     ul.nc-navigation-menu__list  (keine Rolle)
//       li.nc-navigation-menu__item
//         button.nc-navigation-menu__trigger  type=button aria-expanded
//           aria-controls + span.__trigger-icon (Chevron)
//         div.nc-navigation-menu__content(--two-col|--mega)#id  [hidden]
//           wenn zu — das Panel liegt im Item direkt nach dem Ausloeser
//           (Tab-Folge: Ausloeser → Panel), offen zeigt es das SCSS unter
//           der Leiste in voller Breite
//       li > a.nc-navigation-menu__link--top  (direkter Link; die aktuelle
//         Seite traegt aria-current="page")
//     div.nc-navigation-menu__indicator  data-state="hidden" (dekorativ)
// Keine Rollen menubar/menu/menuitem/none, kein roving tabindex.
//
// Inhalte (Achse layout, Modifier am CONTENT, nicht an der Wurzel):
//   default  __links-area mit Links (Titel + Beschreibung)
//   two-col  __content-grid: __callouts-area (Callout links) + __links-area
//   mega     __content-grid > __links-area (3 Spalten): __featured ueber
//            die volle Breite, dann __link-group mit __group-kicker
// Achse trigger: data-trigger an der Wurzel.
// Zustaende: open = erster Ausloeser offen (aria-expanded="true", Panel
//   ohne [hidden]); hover/focus nur echt (data-zustand am ersten
//   Ausloeser). Der Indikator braucht seine Lage vom Skript (Custom Property
//   --_indicator-left, gemessen am Ausloeser) — in „Zustaende" zeigt die
//   Arena ihn nicht (bleibt hidden).
// Komposition composition-header: Kopfzeile (navigation) mit Marke,
//   Navigationsmenue, Aktionen und Burger.
//
// Hinweis: das DS blendet .nc-navigation-menu unter 1200 px FENSTERbreite
// aus (@media max-width 1199px) — die Arena zeigt, was das Fenster vorgibt.
// In einer Kopfzeile mit .nc-header--mobile bleibt es auf jeder Breite aus.
// Verhalten: neo-behaviors/navigation-menu.js nach keyboard/events im Recipe
// (Disclosure). In „Ausprobieren" (m.ausprobieren) starten alle Panels zu,
// die Flaeche haelt dem offenen Panel trotzdem den Platz frei.
import { esc } from './_helfer.js'
import { kindModifier } from './_overlay.js'

const CHEVRON = '<svg viewBox="0 0 12 12" aria-hidden="true"><polyline points="2 4 6 8 10 4"></polyline></svg>'

const BEREICHE = [
  {
    titel: 'Produkte',
    text: 'Plattform-Bausteine für Intranet, App und Magazin.',
    mehr: 'Alle Produkte →',
    links: [
      ['Social Intranet', 'News, Communities und Knowledge Hubs.'],
      ['Mitarbeiter App', 'Mobile Kommunikation für alle Teams.'],
      ['Magazin', 'Editorial Content und Storytelling.']
    ]
  },
  {
    titel: 'Services',
    text: 'Einführung, Support und langfristiger Erfolg.',
    mehr: 'Alle Leistungen →',
    links: [
      ['Einführungsberatung', 'Strategie, Rollout und Enablement.'],
      ['Support', 'Schnelle Hilfe mit klaren SLAs.'],
      ['Customer Success', 'Adoption, KPIs und Wachstum.']
    ]
  }
]
const DIREKT = ['Kunden', 'News', 'Über uns']

const GRUPPEN = [
  ['Nach Bereich', [['Kommunikation', 'News und Kampagnen'], ['Zusammenarbeit', 'Communities und Räume']]],
  ['Nach Rolle', [['Interne Kommunikation', 'Reichweite messen'], ['IT', 'Integration und Betrieb']]],
  ['Ressourcen', [['Dokumentation', 'Handbücher und APIs'], ['Webinare', 'Live und auf Abruf']]]
]

const link = ([titel, text]) => `<a class="nc-navigation-menu__link" href="#"><div class="nc-navigation-menu__link-title">${esc(titel)}</div><p class="nc-navigation-menu__link-desc">${esc(text)}</p></a>`

function inhalt (m, bereich, offen, id) {
  const layout = m.wert('layout') || 'default'
  const klassen = ['nc-navigation-menu__content', ...kindModifier(m, 'nc-navigation-menu__content--')].join(' ')
  let innen
  if (layout === 'mega') {
    const gruppen = GRUPPEN.map(([kicker, links]) => `<div class="nc-navigation-menu__link-group"><span class="nc-navigation-menu__group-kicker">${esc(kicker)}</span>${links.map(link).join('')}</div>`).join('\n')
    innen = `<div class="nc-navigation-menu__content-grid">
<div class="nc-navigation-menu__links-area">
<a class="nc-navigation-menu__featured" href="#"><div class="nc-navigation-menu__link-title">Neu: ${esc(bereich.links[0][0])} 2026</div><p class="nc-navigation-menu__link-desc">${esc(bereich.text)}</p></a>
${gruppen}
</div>
</div>`
  } else if (layout === 'two-col') {
    innen = `<div class="nc-navigation-menu__content-grid">
<div class="nc-navigation-menu__callouts-area">
<a class="nc-navigation-menu__callout" href="#"><div class="nc-navigation-menu__callout-title">${esc(bereich.titel)}</div><p class="nc-navigation-menu__callout-desc">${esc(bereich.text)}</p><span class="nc-navigation-menu__link-title">${esc(bereich.mehr)}</span></a>
</div>
<div class="nc-navigation-menu__links-area">
${bereich.links.map(link).join('\n')}
</div>
</div>`
  } else {
    innen = `<div class="nc-navigation-menu__links-area">
${bereich.links.map(link).join('\n')}
</div>`
  }
  return `<div class="${klassen}" id="${id}"${offen ? '' : ' hidden'}>
${innen}
</div>`
}

/** Das Navigationsmenue allein (auch in der Kopfzeile verwendet). */
function menue (m) {
  const auf = m.hat('open') && !m.ausprobieren
  const marke = m.attribute['data-zustand']
  const eintraege = BEREICHE.map((b, i) => {
    const offen = auf && i === 0
    const id = `${m.uid}-panel-${i + 1}`
    const extra = i === 0 && marke ? ` data-zustand="${marke}"` : ''
    return `<li class="nc-navigation-menu__item">
<button type="button" class="nc-navigation-menu__trigger" aria-expanded="${offen}" aria-controls="${id}"${extra}><span>${esc(b.titel)}</span><span class="nc-navigation-menu__trigger-icon">${CHEVRON}</span></button>
${inhalt(m, b, offen, id)}
</li>`
  })
  const direkt = DIREKT.map((t) => `<li class="nc-navigation-menu__item"><a class="nc-navigation-menu__link--top" href="#">${esc(t)}</a></li>`)
  return `<nav class="nc-navigation-menu" aria-label="Hauptnavigation" data-trigger="${m.wert('trigger') || 'hover'}">
<ul class="nc-navigation-menu__list">
${[...eintraege, ...direkt].join('\n')}
</ul>
<div class="nc-navigation-menu__indicator" data-state="hidden"><div class="nc-navigation-menu__indicator-arrow"></div></div>
</nav>`
}

export default (zelle, m) => {
  if (m.specimen.render?.compositionType === 'nav-full-header') {
    // Ausprobieren: Platz unter der Kopfzeile fuer das Panel
    return `<div class="ra-kopf${m.ausprobieren ? ' ra-anker--desktop' : ''}">
<header class="nc-header">
<nav class="nc-nav" aria-label="Kopfzeile">
<div class="nc-nav__inner">
<a class="nc-brand" href="#">neocosmo</a>
${menue(m)}
<div class="nc-nav__actions">
<a class="nc-button nc-button--primary" href="#">Demo anfragen</a>
</div>
<button type="button" class="nc-mobile-toggle" aria-expanded="false" aria-label="Navigation öffnen"><span class="nc-mobile-toggle__icon" aria-hidden="true"></span></button>
</div>
</nav>
</header>
</div>`
  }
  // Offen: das Panel liegt absolut unter der Liste — die Flaeche haelt
  // ihm den Platz in der Zelle frei.
  if (m.hat('open') || m.ausprobieren) return `<div class="ra-anker ra-anker--desktop">\n${menue(m)}\n</div>`
  return `<div class="ra-feld ra-feld--sehr-breit">\n${menue(m)}\n</div>`
}
