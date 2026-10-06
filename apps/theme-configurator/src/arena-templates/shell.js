// Shell (08-templates/_shell.scss, 07-organisms/_shell.scss, .nc-shell) —
// Plan v3, Phase 3, Block Layout.
//
// Markup nach der Doku (docs/shell-docs.html) und der SCSS-Struktur:
//   .nc-shell[data-layout] > skip-link, (linkbar), header.nc-shell__navbar,
//   .nc-shell__stage > aside.nc-shell__sidebar-left, main.nc-shell__main,
//   aside.nc-shell__sidebar-right; footer.nc-shell__footerbar
// data-layout, data-sidebar-density und data-footerbar-mobile stehen an
// .nc-shell (das DS liest sie an jedem Vorfahren, Recipe: .nc-shell oder
// <body>). Die Zonen tragen Platzhalter (ra-zone) — Inhalt ist nicht
// Gegenstand der Shell.
//
// Rahmen ra-fenster: die Shell fuellt mindestens 100dvh und schaltet ihre
// Spalten ueber die Fensterbreite — der Rahmen ist ein Desktop-Fenster
// (1200 px) im Massstab 1:2,2 (die Miniatur, die das Recipe vorsieht). Er
// scrollt nicht, ist aber Scroll-Container: Navbar und Footerbar kleben
// darin oben und unten. contain macht ihn zum Bezugsrahmen der festen
// Elemente (Skip-Link im Fokus, Drawer, Overlay).
// ra-fenster--mobil: 390 px, fuer Drawer und Footerbar auf Mobil. Diese
// Lage schaltet das DS nur ueber die Fensterbreite (unter lg); der Rahmen
// stellt sie mit denselben Werten dar (wie ra-nav-mobil im Block
// Navigation).
//
// Linkbar: Aufbau wie auf der Website (Symbol + Beschriftung, Trenner,
// Schalter) — Freigabe G1 vom 02.10.2026; die Vorlage zeigt sie nur, am
// Bauteil aendert sie nichts.
import { esc } from './_helfer.js'

const SIDEBARS = {
  dashboard: ['links'],
  docs: ['links', 'rechts'],
  settings: ['links']
}

const SYMBOL_TELEFON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/></svg>'
const SYMBOL_KOFFER = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>'

const zone = (text) => `<div class="ra-zone">${esc(text)}</div>`

function linkbar (uid) {
  return `<div class="nc-shell__linkbar">
<div class="nc-shell__linkbar-left">
<a href="#" onclick="return false"><span class="nc-shell__linkbar-icon" aria-hidden="true">${SYMBOL_TELEFON}</span>Kontakt</a>
<span class="nc-shell__linkbar-separator" aria-hidden="true"></span>
<a href="#" onclick="return false"><span class="nc-shell__linkbar-icon" aria-hidden="true">${SYMBOL_KOFFER}</span>Karriere</a>
</div>
<div class="nc-shell__linkbar-right">
<label class="nc-switch nc-switch--sm"><input type="checkbox" class="nc-switch__input" role="switch" id="${uid}-dunkel"><span class="nc-switch__track"><span class="nc-switch__thumb"></span></span><span class="nc-switch__label">Dunkel</span></label>
<span class="nc-shell__linkbar-separator" aria-hidden="true"></span>
<a href="#" onclick="return false" lang="en">EN</a>
</div>
</div>`
}

/**
 * Eine Shell.
 * @param {object} m Modell
 * @param {{ preset: string, suffix?: string, density?: string, footerMobil?: string, mobil?: boolean, hinweis?: string }} o
 */
function shell (m, o) {
  const uid = m.uid + (o.suffix || '')
  const preset = o.preset
  const seiten = SIDEBARS[preset] || []
  const attrs = [`data-layout="${preset}"`]
  if (o.density && o.density !== 'standard') attrs.push(`data-sidebar-density="${o.density}"`)
  if (o.footerMobil && o.footerMobil !== 'sticky') attrs.push(`data-footerbar-mobile="${o.footerMobil}"`)
  const drawer = m.klassen.includes('nc-shell--sidebar-left-drawer-open')
  // Inhalt: Ausrichtung als Modifier am Content-Body (Recipe contentAlign)
  const bodyKlassen = ['nc-shell__content-body', ...m.klassen.filter((k) => k.startsWith('nc-shell__content-body--'))]
  const blockKlassen = m.klassen.filter((k) => !k.startsWith('nc-shell__content-body--'))

  const teile = [
    `<a class="nc-shell__skip-link" href="#${uid}-inhalt">Zum Inhalt springen</a>`,
    preset === 'landing' ? linkbar(uid) : '',
    `<header class="nc-shell__navbar"><nav class="ra-zone ra-zone--navbar" aria-label="Hauptnavigation">Navbar</nav></header>`,
    `<div class="nc-shell__stage">
${seiten.includes('links') ? `<aside class="nc-shell__sidebar-left" aria-label="Bereichsnavigation">${zone('Sidebar links')}</aside>` : ''}
<main class="nc-shell__main" id="${uid}-inhalt">
${['docs', 'content-page', 'settings'].includes(preset) ? `<div class="nc-shell__content-header">${zone('Seitentitel')}</div>` : ''}
<div class="${bodyKlassen.join(' ')}">${zone(o.hinweis || 'Inhalt')}</div>
</main>
${seiten.includes('rechts') ? `<aside class="nc-shell__sidebar-right" aria-label="Auf dieser Seite">${zone('Sidebar rechts')}</aside>` : ''}
</div>`,
    preset === 'focused' ? '' : `<footer class="nc-shell__footerbar">
<div class="nc-shell__footerbar-left">Build 2.1.0</div>
<div class="nc-shell__footerbar-center">Footerbar</div>
<div class="nc-shell__footerbar-right">Stand 06.10.2026</div>
</footer>`,
    drawer ? '<div class="nc-shell__sidebar-overlay nc-shell__sidebar-overlay--visible" aria-hidden="true"></div>' : ''
  ].filter(Boolean).join('\n')

  const rahmen = o.mobil ? 'ra-fenster ra-fenster--mobil' : 'ra-fenster'
  return `<div class="${rahmen}">
<div class="${blockKlassen.join(' ')}" ${attrs.join(' ')}${m.attrs}>
${teile}
</div>
</div>`
}

export default (zelle, m) => {
  const art = m.specimen.render?.compositionType
  const preset = m.wert('preset') || 'dashboard'
  const density = m.wert('sidebarDensity')
  const sidebar = m.wert('sidebar')
  const footerMobil = m.wert('footerbarMobile')

  // Drawer und Footerbar-Verhalten: nur unter lg, deshalb im Mobil-Fenster
  const mobil = sidebar === 'drawer' || art === 'shell-footerbar-mobile'
  if (art === 'shell-dark-mode') {
    // Hell und dunkel nebeneinander, unabhaengig vom Vorschau-Modus
    return `<div class="ra-reihe">
<div class="neo-light-theme">${shell(m, { preset, density, suffix: '-hell', hinweis: 'neo-light-theme' })}</div>
<div class="neo-dark-theme">${shell(m, { preset, density, suffix: '-dunkel', hinweis: 'neo-dark-theme' })}</div>
</div>`
  }
  const hinweis = art === 'shell-skip-link' ? 'Tab-Taste im Rahmen: der Skip-Link erscheint oben links' : undefined
  return shell(m, { preset, density, footerMobil, mobil, hinweis })
}
