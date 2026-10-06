// Vorlage: navigation-orchestration — die Kopfzeile als Komposition aus fuenf
// Ebenen (Recipe anatomy.domNotes), Markup nach den Ebenen des Recipes, nach
// data/markup/navigation-orchestration.html (Doku, dort mit Inline-Stilen —
// hier ohne) und dem Code-Beispiel in docs/navigation-docs.html:
//   1 Shell     div.nc-shell__navbar (reserviert die Zeile, z-index)
//   2 Kopf      header.nc-header (+ .is-scrolled / .is-hidden / .is-mobile-open)
//   3 Menue     nav.nc-nav > .nc-nav__inner > nav.nc-navigation-menu
//   4 Link      a.nc-nav__link in den Werkzeugen (.nc-tools)
//               Die Werkzeuge stehen IN .nc-nav__actions: ab 1200 px ist
//               .nc-nav__inner ein Raster mit drei Spalten (Marke | Menue |
//               Aktionen) — als viertes Kind (wie im Code-Beispiel der Doku)
//               rutschten sie in eine zweite Zeile (gemeldet)
//   5 Atome     .nc-nav__icon + .nc-nav__label (+ .nc-nav__badge)
//   mobil       button.nc-mobile-toggle + div.nc-mobile-panel
//
// Specimens (render.compositionType):
//   nav-orchestration-full     Desktop, Zustaende default/scrolled
//   nav-orchestration-cascade  dieselbe Kopfzeile + Legende der Token-Kette
//                              (Arena-Markup ra-legende, keine DS-Elemente)
//   nav-orchestration-mobile   .nc-header--mobile (Mobil-Lage unabhaengig vom
//                              Fenster, Entscheidung 02.10.2026), Zustaende
//                              default/mobile-open (.is-mobile-open zeigt das
//                              Panel)
//   nav-orchestration-compact  density=compact: .nc-header--compact steht im
//                              Recipe, aber nicht in styles.css → „nicht gebaut"
//   nav-orchestration-z-index  Kopfzeile + Legende der Shell-Schichten
//
// Das Recipe nennt weder keyboard noch events — kein „Ausprobieren". Das
// Oeffnen des Mobil-Panels uebernimmt auf der Website neo-theme.js; ein
// Behavior dafuer gibt es in neo-behaviors nicht (gemeldet).
import { esc } from './_helfer.js'
import { nichtGebaut } from './_layout.js'

const CHEVRON = '<svg viewBox="0 0 12 12" aria-hidden="true"><polyline points="2 4 6 8 10 4"></polyline></svg>'
const GLOCKE = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 5a2 2 0 1 1 4 0a7 7 0 0 1 4 6v3a4 4 0 0 0 2 3h-16a4 4 0 0 0 2-3v-3a7 7 0 0 1 4-6"/><path d="M9 17v1a3 3 0 0 0 6 0v-1"/></svg>'
const LUPE = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="10" cy="10" r="7"/><path d="m21 21-6-6"/></svg>'

const BEREICHE = ['Produkte', 'Lösungen']
const DIREKT = ['Kunden', 'News', 'Über uns']

// Kette der Tokens je Ebene (Recipe orchestration, Specimen token-cascade)
const KASKADE = [
  ['Shell', '--nc-shell-z-navbar', 'Schicht der Navbar-Zeile'],
  ['Navigation', '--nc-nav-height', 'Höhe der Kopfzeile'],
  ['Navigation-Menu', '--nc-nav-menu-item-gap', 'Abstand der Einträge'],
  ['Nav-Molecules', '--nc-nav-mol-link-color', 'Farbe von Link und Hover'],
  ['Nav-Atoms', '--nc-nav-atom-icon-size', '24 px Symbole']
]
// Shell-Schichten von unten nach oben (Recipe, Specimen z-index-governance)
const SCHICHTEN = ['linkbar', 'footerbar', 'navbar', 'sidebar', 'overlay', 'drawer']

function menue () {
  const bereiche = BEREICHE.map((t) => `<li class="nc-navigation-menu__item"><button type="button" class="nc-navigation-menu__trigger" aria-expanded="false"><span>${esc(t)}</span><span class="nc-navigation-menu__trigger-icon">${CHEVRON}</span></button></li>`)
  const direkt = DIREKT.map((t, i) => `<li class="nc-navigation-menu__item"><a class="nc-navigation-menu__link--top" href="#"${i === 0 ? ' aria-current="page"' : ''}>${esc(t)}</a></li>`)
  return `<nav class="nc-navigation-menu" aria-label="Hauptnavigation" data-trigger="hover">
<ul class="nc-navigation-menu__list">
${[...bereiche, ...direkt].join('\n')}
</ul>
</nav>`
}

const werkzeuge = () => `<div class="nc-tools">
<a class="nc-nav__link" href="#" aria-label="Suche"><span class="nc-nav__icon">${LUPE}</span></a>
<a class="nc-nav__link" href="#"><span class="nc-nav__icon">${GLOCKE}</span><span class="nc-nav__label">Meldungen</span><span class="nc-nav__badge" aria-hidden="true"></span></a>
</div>`

function panel () {
  const zeilen = [...BEREICHE, ...DIREKT].map((t) => `<a class="nc-mobile-link" href="#">${esc(t)}</a>`).join('\n')
  return `<div class="nc-mobile-panel" id="__ID__-panel">
<div class="nc-mobile-panel__inner">
<nav class="nc-mobile-links" aria-label="Hauptnavigation (mobil)">
${zeilen}
</nav>
</div>
</div>`
}

function kopf (m, { mobil = false } = {}) {
  const klassen = ['nc-header']
  if (mobil) klassen.push('nc-header--mobile')
  if (m.hat('scrolled')) klassen.push('is-scrolled')
  if (m.hat('hidden')) klassen.push('is-hidden')
  const offen = mobil && m.hat('mobile-open')
  if (offen) klassen.push('is-mobile-open')
  return `<div class="nc-shell__navbar">
<header class="${klassen.join(' ')}">
<nav class="nc-nav" aria-label="Kopfzeile">
<div class="nc-nav__inner">
<a class="nc-brand" href="#">neocosmo</a>
${mobil ? '' : menue()}
${mobil ? werkzeuge() : `<div class="nc-nav__actions">
${werkzeuge()}
<a class="nc-button nc-button--primary" href="#">Demo anfragen</a>
</div>`}
<button type="button" class="nc-mobile-toggle" aria-expanded="${offen}" aria-controls="${m.uid}-panel" aria-label="${offen ? 'Navigation schließen' : 'Navigation öffnen'}"><span class="nc-mobile-toggle__icon" aria-hidden="true"></span></button>
</div>
</nav>
${mobil ? panel().replace('__ID__', m.uid) : ''}
</header>
</div>`
}

const legende = (titel, zeilen) => `<dl class="ra-legende" aria-label="${esc(titel)}">
${zeilen.map(([a, b, c]) => `<div><dt>${esc(a)}</dt><dd><code>${esc(b)}</code>${c ? ` ${esc(c)}` : ''}</dd></div>`).join('\n')}
</dl>`

export default (zelle, m) => {
  const art = m.specimen.render?.compositionType || 'nav-orchestration-full'
  if (m.wert('density') === 'compact') return nichtGebaut(m, ['nc-header--compact'])
  if (art === 'nav-orchestration-mobile') {
    return `<div class="ra-kopf ra-kopf--mobil${m.hat('mobile-open') ? ' ra-kopf--offen' : ''}">\n${kopf(m, { mobil: true })}\n</div>`
  }
  const leiste = `<div class="ra-kopf">\n${kopf(m)}\n</div>`
  if (art === 'nav-orchestration-cascade') {
    return `<div class="ra-stapel ra-stapel--breit">\n${leiste}\n${legende('Token-Kette von der Shell bis zum Symbol', KASKADE)}\n</div>`
  }
  if (art === 'nav-orchestration-z-index') {
    const zeilen = SCHICHTEN.map((s, i) => [`${i + 1}`, `--nc-shell-z-${s}`, s === 'navbar' ? '← die Kopfzeile' : ''])
    return `<div class="ra-stapel ra-stapel--breit">\n${leiste}\n${legende('Schichten der Shell, von unten nach oben', zeilen)}\n</div>`
  }
  return leiste
}

