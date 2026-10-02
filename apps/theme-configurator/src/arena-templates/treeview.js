// Vorlage: treeview — Markup aus data/markup/treeview.html und den
// BEM-KLASSEN in scss/scss/06-molecules/_treeview.scss:
//   nav.nc-treeview (+ Modifier)  aria-label
//     ul.nc-treeview__list  role="tree"
//       li.nc-treeview__item.nc-treeview__item--branch|--leaf  role="treeitem"
//         aria-level aria-expanded (Zweige) aria-selected
//         style="--_level: N"  (Einrueckung — DS-Instanzwert laut SCSS)
//         div.nc-treeview__node  tabindex (0 am ersten, sonst -1)
//           button.nc-treeview__drag-handle (draggable)
//           button|span.nc-treeview__toggle (Blatt: span, unsichtbar)
//           input.nc-treeview__checkbox (multiple)
//           span.nc-treeview__icon / span.nc-treeview__label
//           span.nc-treeview__badge / div.nc-treeview__actions
//         div.nc-treeview__children > ul.nc-treeview__list[role=group]
//
// Achsen: variant (bordered/compact/flush), selection=multiple
// (--checkboxes), lines (--lines-solid/-dashed), interaction=draggable
// (--draggable) — alle Modifier an der Wurzel.
// Auswahl single: im Ruhezustand ist „Website-Relaunch.pdf" ausgewaehlt
// (--selected + aria-selected). Zustaende (Specimen states) am Zweig
// „Vorlagen": hover nur echt (data-zustand am Knoten), selected (Auswahl
// wandert dorthin), expanded (aria-expanded="true"), disabled
// (--disabled + aria-disabled).
// multiple: aria-checked am Eintrag (true/false/mixed), die Checkbox zeigt
// dasselbe (checked bzw. indeterminate per einrichten()).
// Slots per render.slotConfig des Specimens: actions, badge, icon.
// drag-drop: --dragging am gezogenen Eintrag, Drop-Anzeigen
// --drop-before/-inside/-after.
// Verhalten: neo-behaviors/treeview.js nach keyboard/events im Recipe
// (Pfeiltasten, Pos1/Ende, Auf-/Zuklappen, Auswahl). Das Markup ist in
// „Zustände" und „Ausprobieren" gleich — der roving tabindex (genau eine
// Zeile mit tabindex="0") steht schon in der Vorlage, wie im DS-Markup.
import { esc } from './_helfer.js'
import { wurzelKlassen } from './_overlay.js'

const CHEVRON = '<svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 4 10 8 6 12"></polyline></svg>'
const ORDNER = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg>'
const DATEI = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><path d="M14 3v6h6"></path></svg>'
const PUNKTE = '<svg viewBox="0 0 24 24"><circle cx="5" cy="12" r="1"></circle><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle></svg>'
const PAPIERKORB = '<svg viewBox="0 0 24 24"><path d="M3 6h18M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6M10 11v6M14 11v6M9 6V4h6v2"></path></svg>'
const GRIFF = '<svg viewBox="0 0 12 12"><circle cx="4" cy="2" r="1"></circle><circle cx="8" cy="2" r="1"></circle><circle cx="4" cy="6" r="1"></circle><circle cx="8" cy="6" r="1"></circle><circle cx="4" cy="10" r="1"></circle><circle cx="8" cy="10" r="1"></circle></svg>'

// Baum: [Text, offen?, Kinder?, Merkmale]
// Merkmale: badge (Zahl), check (true|false|'mixed'), drop, ziehen
const BAUM = [
  ['Dokumente', true, [
    ['Projekte', true, [
      ['Website-Relaunch.pdf', false, null, { auswahl: true, check: true }],
      ['Budget-2026.xlsx', false, null, { check: false, drop: 'after' }]
    ], { badge: 2, check: 'mixed' }],
    ['Vorlagen', false, [
      ['Angebot.docx', false, null, {}],
      ['Protokoll.docx', false, null, {}]
    ], { badge: 2, check: false, ziel: true, drop: 'inside' }],
    ['Notizen.txt', false, null, { check: false, ziehen: true }]
  ], { badge: 3, check: 'mixed' }],
  ['Bilder', false, [
    ['Team.jpg', false, null, {}]
  ], { badge: 1, check: false, drop: 'before' }],
  ['Archiv', false, [
    ['2025', false, null, {}]
  ], { check: false }]
]

// 5 Ebenen fuer deep-hierarchy
const TIEF = [
  ['Organisation', true, [
    ['Bereiche', true, [
      ['Kommunikation', true, [
        ['Redaktion', true, [
          ['Freigaben.md', false, null, { auswahl: true }],
          ['Leitfaden.md', false, null, {}]
        ], {}],
        ['Kampagnen', false, [['Q1', false, null, {}]], {}]
      ], {}],
      ['IT', false, [['Betrieb', false, null, {}]], {}]
    ], {}]
  ], {}],
  ['Standorte', false, [['Berlin', false, null, {}]], {}]
]

function knoten (m, opt, [text, offen, kinder, merk], ebene, zaehler) {
  const zweig = !!kinder
  const ziel = !!merk.ziel
  const zustaende = ziel ? m.zustaende : []
  const auf = zweig && (offen || zustaende.includes('expanded'))
  // single: Auswahl am Ziel, wenn der Zustand es verlangt, sonst Vorgabe
  const auswahl = opt.multiple ? false : (m.hat('selected') ? ziel : !!merk.auswahl)
  const gesperrt = zustaende.includes('disabled')
  const klassen = ['nc-treeview__item', zweig ? 'nc-treeview__item--branch' : 'nc-treeview__item--leaf']
  if (auswahl) klassen.push('nc-treeview__item--selected')
  if (gesperrt) klassen.push('nc-treeview__item--disabled')
  if (opt.ziehen && merk.ziehen) klassen.push('nc-treeview__item--dragging')
  if (opt.ziehen && merk.drop) klassen.push(`nc-treeview__item--drop-${merk.drop}`)

  let attrs = ` role="treeitem" aria-level="${ebene + 1}"`
  if (zweig) attrs += ` aria-expanded="${auf}"`
  if (opt.multiple) attrs += ` aria-checked="${merk.check ?? false}"`
  else attrs += ` aria-selected="${auswahl}"`
  if (gesperrt) attrs += ' aria-disabled="true"'

  const erster = zaehler.n++ === 0
  const markierung = ziel && m.attribute['data-zustand'] ? ` data-zustand="${m.attribute['data-zustand']}"` : ''
  const teile = []
  if (opt.ziehen) teile.push(`<button type="button" class="nc-treeview__drag-handle" tabindex="-1" aria-label="${esc(text)} verschieben">${GRIFF}</button>`)
  teile.push(zweig
    ? `<button class="nc-treeview__toggle" type="button" tabindex="-1" aria-hidden="true">${CHEVRON}</button>`
    : `<span class="nc-treeview__toggle" aria-hidden="true">${CHEVRON}</span>`)
  if (opt.multiple) {
    const wert = merk.check
    teile.push(`<input class="nc-treeview__checkbox" type="checkbox" tabindex="-1" aria-hidden="true"${wert === true ? ' checked' : ''}${wert === 'mixed' ? ' data-unbestimmt' : ''}>`)
  }
  if (opt.icon) teile.push(`<span class="nc-treeview__icon" aria-hidden="true">${zweig ? ORDNER : DATEI}</span>`)
  teile.push(`<span class="nc-treeview__label">${esc(text)}</span>`)
  if (opt.badge && merk.badge) teile.push(`<span class="nc-treeview__badge">${merk.badge}</span>`)
  if (opt.actions) {
    teile.push(`<div class="nc-treeview__actions"><button type="button" class="nc-treeview__action" tabindex="-1" aria-label="Weitere Aktionen für ${esc(text)}">${PUNKTE}</button><button type="button" class="nc-treeview__action" tabindex="-1" aria-label="${esc(text)} löschen">${PAPIERKORB}</button></div>`)
  }
  const unter = zweig
    ? `\n<div class="nc-treeview__children">\n<ul class="nc-treeview__list" role="group">\n${kinder.map((k) => knoten(m, opt, k, ebene + 1, zaehler)).join('\n')}\n</ul>\n</div>`
    : ''
  return `<li class="${klassen.join(' ')}"${attrs} style="--_level: ${ebene};">
<div class="nc-treeview__node" tabindex="${erster ? 0 : -1}"${markierung}>${teile.join('')}</div>${unter}
</li>`
}

export default (zelle, m) => {
  const slots = { ...(m.specimen.render?.slotConfig || {}) }
  const opt = {
    multiple: m.wert('selection') === 'multiple',
    ziehen: m.wert('interaction') === 'draggable',
    icon: !!slots.icon,
    badge: !!slots.badge,
    actions: !!slots.actions
  }
  const baum = m.specimen.id === 'deep-hierarchy' ? TIEF : BAUM
  const zaehler = { n: 0 }
  return `<div class="ra-feld">
<nav class="${wurzelKlassen(m)}" aria-label="Dateistruktur">
<ul class="nc-treeview__list" role="tree" aria-label="Dateistruktur"${opt.multiple ? ' aria-multiselectable="true"' : ''}>
${baum.map((k) => knoten(m, opt, k, 0, zaehler)).join('\n')}
</ul>
</nav>
</div>`
}

/** Eltern im Checkbox-Modus: halb angehakt (DOM-Eigenschaft, kein Attribut). */
export function einrichten (element) {
  for (const box of element.querySelectorAll('.nc-treeview__checkbox[data-unbestimmt]')) box.indeterminate = true
}
