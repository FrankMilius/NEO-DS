// Vorlage: dropdown-menu — Markup nach der STRUKTUR in
// scss/scss/06-molecules/_dropdown-menu.scss und den Recipe-domNotes (ein
// geerntetes data/markup/dropdown-menu.html gibt es nicht):
//   div.nc-dropdown
//     button.nc-button.nc-dropdown__trigger  aria-haspopup="true" aria-expanded
//     div.nc-dropdown__menu.nc-dropdown__menu--<placement>  role="menu"
//       div.nc-dropdown__group (role="group") > span.nc-dropdown__group-label
//       button.nc-dropdown__item  role="menuitem|menuitemradio|menuitemcheckbox"
//         span.__item-check / __item-icon / __item-label / __item-shortcut /
//         __submenu-indicator
//       hr.nc-dropdown__separator, div.nc-dropdown__footer
// Das Verhalten (Pfeiltasten, Untermenue, Auswahl, Escape, Light Dismiss)
// kommt aus neo-behaviors (dropdown-menu.js).
//
// Achsen:
//   placement      Modifier am MENUE (nicht an der Wurzel). bottom-start hat
//                  im Recipe keinen Modifier; das SCSS kennt aber
//                  __menu--bottom-start — ohne Lageklasse saesse das Menue
//                  auf dem Ausloeser. Die Vorlage setzt sie deshalb immer.
//   selectionMode  single/multiple: nc-dropdown--checkable, Eintraege als
//                  menuitemradio bzw. menuitemcheckbox mit __item-check
//   content        plain, with-icons, grouped (Gruppen mit Label und
//                  Trenner), with-shortcuts, with-submenu (Eintrag mit
//                  aria-haspopup="menu" und verschachteltem Menue),
//                  with-footer (__footer)
//   itemVariant    danger: der letzte Eintrag („Löschen") traegt
//                  __item--danger (und bei danger-item den Zustand)
// Zustaende (am ersten Eintrag): disabled = aria-disabled="true";
//   checked = Auswahl (single: zweiter Eintrag, multiple: erster und
//   dritter), Standard ohne Auswahl; hover/active/focus nur echt
//   (data-zustand am Eintrag).
// „Zustände": Menue offen (aria-expanded="true", ohne [hidden]), beim
//   Specimen with-submenu auch das Untermenue. „Ausprobieren": geschlossen.
// Specimens: all-states, placement-variants, content-variants,
//   checkable-single, checkable-multiple, with-submenu, with-footer,
//   danger-item, grouped-with-danger, full-featured.
import { esc } from './_helfer.js'
import { offen, wurzelKlassen } from './_overlay.js'

const SVG = (inhalt) => `<svg viewBox="0 0 24 24" aria-hidden="true">${inhalt}</svg>`
const SYMBOLE = {
  bearbeiten: SVG('<path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4z"/>'),
  kopieren: SVG('<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>'),
  teilen: SVG('<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4"/>'),
  archiv: SVG('<path d="M21 8v13H3V8M1 3h22v5H1zM10 12h4"/>'),
  loeschen: SVG('<path d="M3 6h18M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6M10 11v6M14 11v6M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>')
}
const HAKEN = SVG('<polyline points="20 6 9 17 4 12"/>')
const PFEIL = SVG('<polyline points="9 18 15 12 9 6"/>')

// [Text, Symbol, Kuerzel]
const AKTIONEN = [
  ['Bearbeiten', 'bearbeiten', 'Strg+E'],
  ['Duplizieren', 'kopieren', 'Strg+D'],
  ['Teilen', 'teilen', 'Strg+U'],
  ['Archivieren', 'archiv', 'Strg+A']
]
const LOESCHEN = ['Löschen', 'loeschen', 'Entf']
const ANSICHTEN = [['Raster', 'raster'], ['Liste', 'liste'], ['Karten', 'karten']]
const UNTER = ['Archiv', 'Projekte', 'Papierkorb']

function eintrag (m, [text, symbol, kuerzel], opt = {}) {
  const content = m.wert('content')
  const klassen = ['nc-dropdown__item']
  if (opt.gefahr) klassen.push('nc-dropdown__item--danger')
  if (opt.gewaehlt) klassen.push('nc-dropdown__item--checked')
  if (opt.unter) klassen.push('nc-dropdown__item--has-submenu')
  const rolle = opt.rolle || 'menuitem'
  let attrs = ` role="${rolle}" tabindex="-1"`
  if (rolle !== 'menuitem') attrs += ` aria-checked="${!!opt.gewaehlt}"`
  if (opt.wert) attrs += ` data-value="${esc(opt.wert)}"`
  if (opt.gesperrt) attrs += ' aria-disabled="true"'
  if (opt.zustand) attrs += ` data-zustand="${opt.zustand}"`
  const check = rolle !== 'menuitem' ? `<span class="nc-dropdown__item-check">${HAKEN}</span>` : ''
  const icon = (content === 'with-icons' || m.slot('item-icon')) && SYMBOLE[symbol] ? `<span class="nc-dropdown__item-icon">${SYMBOLE[symbol]}</span>` : ''
  const kurz = (content === 'with-shortcuts' || opt.kuerzel) && kuerzel ? `<span class="nc-dropdown__item-shortcut">${esc(kuerzel)}</span>` : ''
  const label = `<span class="nc-dropdown__item-label">${esc(text)}</span>`
  if (opt.unter) {
    // Eintrag mit Untermenue: das verschachtelte Menue steht IM Eintrag
    // (SCSS: .nc-dropdown__item--has-submenu > .nc-dropdown__menu)
    const auf = opt.unterOffen
    const kinder = UNTER.map((t) => `<button type="button" class="nc-dropdown__item" role="menuitem" tabindex="-1"><span class="nc-dropdown__item-label">${esc(t)}</span></button>`).join('')
    return `<div class="${klassen.join(' ')}" role="menuitem" tabindex="-1" aria-haspopup="menu" aria-expanded="${auf}">${label}<span class="nc-dropdown__submenu-indicator">${PFEIL}</span>
<div class="nc-dropdown__menu" role="menu" aria-label="${esc(text)}"${auf ? '' : ' hidden'}>${kinder}</div></div>`
  }
  return `<button type="button" class="${klassen.join(' ')}"${attrs}>${check}${icon}${label}${kurz}</button>`
}

const gruppe = (id, titel, inhalt) => `<div class="nc-dropdown__group" role="group" aria-labelledby="${id}"><span class="nc-dropdown__group-label" id="${id}">${esc(titel)}</span>${inhalt}</div>`
const TRENNER = '<hr class="nc-dropdown__separator">'

function eintraege (m) {
  const content = m.wert('content') || 'plain'
  const modus = m.wert('selectionMode') || 'none'
  const sp = m.specimen.id
  const gefahr = m.wert('itemVariant') === 'danger'
  // Zustand gehoert an den ersten Eintrag
  const erster = { gesperrt: m.deaktiviert, zustand: m.attribute['data-zustand'] }

  if (sp === 'full-featured') {
    const auswahl = ANSICHTEN.map(([t, s], i) => eintrag(m, [t, s], { rolle: 'menuitemradio', gewaehlt: i === 0, wert: s }))
    return gruppe(`${m.uid}-g1`, 'Ansicht', auswahl.join('')) + TRENNER +
      gruppe(`${m.uid}-g2`, 'Aktionen', [eintrag(m, AKTIONEN[1], { kuerzel: true }), eintrag(m, AKTIONEN[2], { kuerzel: true }), eintrag(m, LOESCHEN, { gefahr: true, kuerzel: true })].join(''))
  }
  if (modus !== 'none') {
    const radio = modus === 'single'
    const gewaehlt = m.hat('checked') ? (radio ? [1] : [0, 2]) : []
    const liste = radio ? ANSICHTEN : [['Vorschau anzeigen', 'bearbeiten'], ['Kommentare anzeigen', 'teilen'], ['Archivierte anzeigen', 'archiv']]
    return liste.map(([t, s], i) => eintrag(m, [t, s], { rolle: radio ? 'menuitemradio' : 'menuitemcheckbox', gewaehlt: gewaehlt.includes(i), wert: s, ...(i ? {} : erster) })).join('')
  }
  if (content === 'grouped') {
    return gruppe(`${m.uid}-g1`, 'Datei', [eintrag(m, AKTIONEN[0], erster), eintrag(m, AKTIONEN[1]), eintrag(m, AKTIONEN[2])].join('')) + TRENNER +
      gruppe(`${m.uid}-g2`, 'Verwalten', [eintrag(m, AKTIONEN[3]), eintrag(m, LOESCHEN, { gefahr: true })].join(''))
  }
  if (content === 'with-submenu') {
    const unterOffen = offen(m) && (sp === 'with-submenu' || sp === 'content-variants')
    return [eintrag(m, AKTIONEN[0], erster), eintrag(m, ['Verschieben nach'], { unter: true, unterOffen }), eintrag(m, AKTIONEN[2])].join('')
  }
  // danger-item: der Zustand (hover) gehoert an den Gefahr-Eintrag
  const liste = AKTIONEN.map((a, i) => eintrag(m, a, i || gefahr ? {} : erster))
  if (gefahr) liste.push(eintrag(m, LOESCHEN, { gefahr: true, ...erster }))
  return liste.join('')
}

export default (zelle, m) => {
  const auf = offen(m)
  const lage = m.wert('placement') || 'bottom-start'
  const oben = lage.startsWith('top')
  const ende = lage.endsWith('end')
  const content = m.wert('content') || 'plain'
  const fuss = content === 'with-footer' || m.slot('footer')
    ? `<div class="nc-dropdown__footer"><button type="button" class="nc-button nc-button--ghost nc-button--sm">Alle Aktionen anzeigen</button></div>`
    : ''
  const breit = content === 'with-submenu'
  const hoch = content === 'grouped' || content === 'with-footer' || m.specimen.id === 'full-featured'
  const anker = ['ra-anker', hoch ? 'ra-anker--hoch' : '', breit ? 'ra-anker--breit' : '', oben ? 'ra-anker--oben' : '', ende ? 'ra-anker--ende' : ''].filter(Boolean).join(' ')

  return `<div class="${anker}">
<div class="${wurzelKlassen(m)}">
<button type="button" class="nc-button nc-button--secondary nc-dropdown__trigger" id="${m.uid}-ausloeser" aria-haspopup="true" aria-expanded="${auf}" aria-controls="${m.uid}-menue">Aktionen</button>
<div class="nc-dropdown__menu nc-dropdown__menu--${lage}" id="${m.uid}-menue" role="menu" aria-labelledby="${m.uid}-ausloeser"${auf ? '' : ' hidden'}>
${eintraege(m)}${fuss}
</div>
</div>
</div>`
}
