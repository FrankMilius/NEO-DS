// Vorlage: security-list — Markup aus data/markup/security-list.html
// (ul.nc-security-list > li.nc-security-list__item, Text direkt im Item).
// Plan v3, Phase 4: Rahmen ra-feld statt der Inline-Breite der Ernte.
// render.compositionType „mit-symbol": die Anatomie fuehrt __icon und __text
// (optional), styles.css kennt beide nicht — die Doku baut das Muster mit
// Inline-Gestaltung nach. Die Zelle zeigt „nicht gebaut" (Mechanismus aus
// _layout.js) statt Klassen ohne Wirkung; bauen oder streichen ist ein
// Entscheidungsfall.
import { nichtGebaut } from './_layout.js'

export const NICHT_GEBAUT_SLOTS = ['nc-security-list__icon', 'nc-security-list__text']

export default (zelle, m) => {
  if (m.specimen.render?.compositionType === 'mit-symbol') return nichtGebaut(m, NICHT_GEBAUT_SLOTS)
  return `<div class="ra-feld">
<ul class="${m.klasse}"${m.attrs}>
<li class="nc-security-list__item">Zwei-Faktor-Authentifizierung</li>
<li class="nc-security-list__item">Automatische Sicherheitsupdates</li>
<li class="nc-security-list__item">Penetrationstests durch Dritte</li>
</ul>
</div>`
}
