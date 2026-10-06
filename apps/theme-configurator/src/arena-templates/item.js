// Vorlage: item — Markup aus data/markup/item.html (geerntet von der Doku)
// und der SCSS-Struktur (scss/scss/06-molecules/_item.scss):
//   div.nc-item[.nc-item--<variant|size|density|align-start>]
//     div.nc-item__media.nc-item__media--<typ>  (Symbol aria-hidden, Bild,
//       Avatar = .nc-avatar, Vorschaubild 16:9)
//     div.nc-item__content > div.nc-item__title + p.nc-item__description
//     div.nc-item__meta     (Tastenkuerzel als nc-kbd, Dropdown)
//
// Die Achse media traegt Element-Modifier (nc-item__media--*): sie gehoeren
// an das Media-Element, nicht an die Wurzel.
//
// Zustaende (interactive-states): nur interaktive Items kennen Hover/Active
// (.nc-item--interactive). Die Zellen stehen als Optionen in einer Listbox —
// so tragen ausgewaehlt (aria-selected + .is-selected) und gesperrt
// (aria-disabled) ihre Bedeutung wie im Recipe (a11y). Hover und Active gibt
// es nur als Pseudoklasse: die Zelle zeigt den Ruhezustand. Kein Verhalten.
//
// Kompositionen: group-outline (nc-item-group--outline, role=list),
// search-integration (Option in einer Listbox, Treffer markiert),
// dropdown-integration (menuitem, Kuerzel per aria-keyshortcuts).
import { esc, BILD_SRC } from './_helfer.js'

const SVG = (pfade) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${pfade}</svg>`
const SYMBOLE = {
  einstellungen: SVG('<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>'),
  dokument: SVG('<path d="M14 3v4a1 1 0 0 0 1 1h4"/><path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z"/>'),
  person: SVG('<circle cx="12" cy="8" r="4"/><path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2"/>'),
  kopieren: SVG('<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8v-2a2 2 0 0 0 -2 -2h-8a2 2 0 0 0 -2 2v8a2 2 0 0 0 2 2h2"/>'),
  loeschen: SVG('<path d="M4 7h16"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12"/><path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3"/>')
}

const LANG = 'Die Einstellungen gelten für alle Arbeitsbereiche, denen Sie angehören. Änderungen an Benachrichtigungen, Sprache und Datenschutz werden sofort übernommen und auf allen Geräten synchronisiert.'

/** Klassen der Wurzel: alles ausser den Media-Modifiern und fremden Zustandsklassen. */
function wurzelKlassen (m, extra = []) {
  const weg = (k) => k.startsWith('nc-item__media--') || ['is-active', 'is-open', 'nc-item--disabled'].includes(k)
  return [...m.klassen.filter((k) => !weg(k)), ...extra].filter((k, i, a) => a.indexOf(k) === i).join(' ')
}

function media (m, symbol = SYMBOLE.einstellungen) {
  const typ = m.wert('media') || 'none'
  if (typ === 'none') return ''
  if (typ === 'icon') return `<div class="nc-item__media nc-item__media--icon" aria-hidden="true">${symbol}</div>`
  if (typ === 'image') return `<div class="nc-item__media nc-item__media--image"><img src="${BILD_SRC}" alt=""></div>`
  if (typ === 'avatar') return '<div class="nc-item__media nc-item__media--avatar"><span class="nc-avatar nc-avatar--sm" aria-hidden="true"><span class="nc-avatar__fallback">BS</span></span></div>'
  return `<div class="nc-item__media nc-item__media--thumbnail"><img src="${BILD_SRC}" alt="Vorschau: Quartalsbericht"></div>`
}

const inhalt = (titel, text) => `<div class="nc-item__content"><div class="nc-item__title">${titel}</div>${text ? `<p class="nc-item__description">${text}</p>` : ''}</div>`

export default (zelle, m) => {
  const sp = m.specimen.id

  if (sp === 'group-outline') {
    const eintraege = [
      [SYMBOLE.einstellungen, 'Einstellungen', 'Konto- und Profil-Einstellungen verwalten.'],
      [SYMBOLE.person, 'Team', 'Mitglieder einladen und Rollen vergeben.'],
      [SYMBOLE.dokument, 'Dokumente', 'Freigaben und Versionen im Blick behalten.']
    ]
    return `<div class="ra-feld ra-feld--breit"><div class="nc-item-group nc-item-group--outline" role="list">
${eintraege.map(([s, t, d]) => `<div class="${wurzelKlassen(m)}" role="listitem"${m.attrs}>${media(m, s)}${inhalt(esc(t), esc(d))}</div>`).join('\n')}
</div></div>`
  }

  if (sp === 'search-integration') {
    const treffer = [['Einstellungen', 'Konto · Profil'], ['Benachrichtigungs-Einstellungen', 'Konto · Kanäle']]
    return `<div class="ra-feld ra-feld--breit"><div role="listbox" aria-label="Suchvorschläge für „Einstellungen“">
${treffer.map(([t, d], i) => `<div class="${wurzelKlassen(m, i === 0 ? ['nc-item--interactive', 'is-selected'] : ['nc-item--interactive'])}" role="option" id="${m.uid}-o${i}" aria-selected="${i === 0}"${m.attrs}>${media(m)}${inhalt(esc(t).replace('Einstellungen', '<mark>Einstellungen</mark>'), esc(d))}</div>`).join('\n')}
</div></div>`
  }

  if (sp === 'dropdown-integration') {
    const punkte = [[SYMBOLE.kopieren, 'Kopieren', 'Strg', 'C'], [SYMBOLE.loeschen, 'Löschen', 'Entf', null]]
    return `<div class="ra-feld"><div role="menu" aria-label="Aktionen">
${punkte.map(([s, t, a, b]) => `<div class="${wurzelKlassen(m, ['nc-item--interactive'])}" role="menuitem" tabindex="-1" aria-keyshortcuts="${b ? `Control+${b}` : 'Delete'}"${m.attrs}>${media(m, s)}${inhalt(esc(t))}<div class="nc-item__meta" aria-hidden="true">${b ? `<span class="nc-kbd-group"><kbd class="nc-kbd">${a}</kbd><span class="nc-kbd__separator">+</span><kbd class="nc-kbd">${b}</kbd></span>` : `<kbd class="nc-kbd">${a}</kbd>`}</div></div>`).join('\n')}
</div></div>`
  }

  if (sp === 'interactive-states') {
    // Optionen einer Listbox: ausgewaehlt per aria-selected + .is-selected,
    // gesperrt per aria-disabled (das Modell setzt es aus dem Zustand)
    const auswahl = m.hat('selected')
    const attrs = m.attrsOhne('aria-selected')
    return `<div class="ra-feld" role="listbox" aria-label="Arbeitsbereich">
<div class="${wurzelKlassen(m, ['nc-item--interactive'])}" role="option" id="${m.uid}-o" aria-selected="${auswahl}"${attrs}>${media(m)}${inhalt('Einstellungen', 'Konto- und Profil-Einstellungen verwalten.')}</div>
</div>`
  }

  // Vergleiche (Variante, Groesse, Dichte, Media, Ausrichtung): Standard-Item
  // der Doku (Symbol, Titel, Beschreibung); bei alignment langer Text, damit
  // start/center sichtbar wird
  const text = sp === 'alignment-comparison' ? LANG : 'Konto- und Profil-Einstellungen verwalten.'
  return `<div class="ra-feld ra-feld--breit"><div class="${wurzelKlassen(m)}"${m.attrs}>${media(m)}${inhalt('Einstellungen', esc(text))}</div></div>`
}
