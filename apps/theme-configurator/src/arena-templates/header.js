// Vorlage: header — Alt-Header (Franklin-Struktur) aus
// scss/scss/07-organisms/_header.scss und docs/header-docs.html:
// header.header > .nav-wrapper > nav > .nav-brand / .nav-sections
// (ul.main-nav) / .nav-tools; .conversion (optional) mit dem CTA. Die Website
// nutzt inzwischen nc-header (navigation-orchestration) bzw. die
// Hauptnavigation Tab-Mega — dieses Recipe ist die DS-Kopfzeile.
//
// .nav-wrapper und .conversion sind im DS position: fixed. Rahmen
// ra-bildschirm (contain: layout) macht die Zelle zu ihrem Bezugsrahmen —
// bis Phase 4 standen dafuer Inline-Stile (position: relative/static) am
// DS-Element. Darum ra-desktop (Desktop-Seite 1280 px, 1:2,4): die
// Kopfzeile ist fuer die Seitenbreite gebaut, in der Zelle stuende sie
// gequetscht und der Conversion-Knopf laege ueber der Navigation. Zustand
// hidden setzt .nav-hidden (opacity 0, keine Klicks); der Rahmen bleibt
// stehen. Slot conversion per render.slotConfig.
import { slotAn } from './_bloecke-1.js'

const PUNKTE = ['Produkte', 'Lösungen', 'Kunden', 'Unternehmen']

export default (zelle, m) => `
<div class="ra-desktop"><div class="ra-bildschirm ra-bildschirm--voll">
<header class="${m.klasse}"${m.attrs}>
<div class="nav-wrapper${m.hat('hidden') ? ' nav-hidden' : ''}">
<nav aria-label="Hauptnavigation">
<div class="nav-brand"><a href="#" onclick="return false" aria-label="Startseite"><strong>neocosmo</strong></a></div>
<div class="nav-sections"><div class="default-content-wrapper">
<ul class="main-nav">${PUNKTE.map((p, i) => `<li${i === 0 ? ' aria-current="page"' : ''}><a href="#" onclick="return false">${p}</a></li>`).join('')}</ul>
</div></div>
<div class="nav-tools"><div class="default-content-wrapper"><a href="#" onclick="return false" class="search-link" aria-label="Suche">Suche</a></div></div>
</nav>
</div>
${slotAn(m, 'conversion') ? '<div class="conversion"><p class="button-container"><a href="#" onclick="return false" class="nc-button nc-button--accent"><span>Demo anfragen</span></a></p></div>' : ''}
</header>
</div></div>`
