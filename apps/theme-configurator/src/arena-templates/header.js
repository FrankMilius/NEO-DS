// Vorlage: header — Alt-Header (Franklin-Struktur) aus
// scss/scss/07-organisms/_header.scss und docs/header-docs.html:
// header.header > .nav-wrapper > nav > .nav-brand / .nav-sections
// (ul.main-nav) / .nav-tools; .conversion (optional) mit dem CTA. Die Website
// nutzt inzwischen nc-header (navigation-orchestration). .nav-wrapper und
// .conversion sind im DS position: fixed — in der Zelle stehen sie inline
// relativ, sonst klebten sie am Fenster. hidden setzt .nav-hidden (opacity 0).
import { an } from './_helfer.js'

const PUNKTE = ['Produkte', 'Lösungen', 'Kunden', 'Unternehmen']

export default (zelle, m) => `
<header class="${m.klasse}"${m.attrs} style="min-height: 72px;">
<div class="nav-wrapper${m.hat('hidden') ? ' nav-hidden' : ''}" style="position: relative;">
<nav aria-label="Hauptnavigation">
<div class="nav-brand"><a href="#" onclick="return false" aria-label="Startseite"><strong>neocosmo</strong></a></div>
<div class="nav-sections"><div class="default-content-wrapper">
<ul class="main-nav">${PUNKTE.map((p, i) => `<li${i === 0 ? ' aria-current="page"' : ''}><a href="#" onclick="return false">${p}</a></li>`).join('')}</ul>
</div></div>
<div class="nav-tools"><div class="default-content-wrapper"><a href="#" onclick="return false" class="search-link" aria-label="Suche">Suche</a></div></div>
</nav>
</div>
${an(m, 'conversion') && !m.hat('hidden') ? '<div class="conversion" style="position: static; margin-top: 8px;"><p class="button-container"><a href="#" onclick="return false" class="nc-button nc-button--accent"><span>Demo anfragen</span></a></p></div>' : ''}
</header>`
