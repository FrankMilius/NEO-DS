// Vorlage: security-list — Markup aus data/markup/security-list.html
// (ul.nc-security-list > li.nc-security-list__item, Text direkt im Item).
// Plan v3, Phase 4: Rahmen ra-feld statt der Inline-Breite der Ernte.
// render.compositionType „mit-symbol": Item mit Symbol (__icon) und Text
// (__text) — gebaut seit der Entscheidung 06.10.2026, Muster aus der Doku:
// eine Zeile oder Titel mit Beschreibung darunter.

// Symbole wie in der Doku (Tabler-Stil, 24px, Strich in currentColor)
const SCHILD = '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>'
const SCHLOSS = '<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>'
const SCHILD_HAKEN = '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/>'
const symbol = (pfade) => `<svg class="nc-security-list__icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${pfade}</svg>`

export default (zelle, m) => {
  if (m.specimen.render?.compositionType === 'mit-symbol') {
    return `<div class="ra-feld">
<ul class="${m.klasse}"${m.attrs}>
<li class="nc-security-list__item">${symbol(SCHILD)}<span class="nc-security-list__text">ISO 27001 zertifiziert</span></li>
<li class="nc-security-list__item">${symbol(SCHLOSS)}<span class="nc-security-list__text"><strong>AES-256 Verschlüsselung</strong><span>Alle Daten im Ruhezustand und bei der Übertragung verschlüsselt</span></span></li>
<li class="nc-security-list__item">${symbol(SCHILD_HAKEN)}<span class="nc-security-list__text">DSGVO-konform</span></li>
</ul>
</div>`
  }
  return `<div class="ra-feld">
<ul class="${m.klasse}"${m.attrs}>
<li class="nc-security-list__item">Zwei-Faktor-Authentifizierung</li>
<li class="nc-security-list__item">Automatische Sicherheitsupdates</li>
<li class="nc-security-list__item">Penetrationstests durch Dritte</li>
</ul>
</div>`
}
