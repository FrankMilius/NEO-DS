// Vorlage: data-table — Markup aus data/markup/data-table.html und der
// Doku-Seite (docs/content/data-table.html): <div class="nc-data-table"> >
// __scroll-container > <table class="nc-data-table__table"> mit __thead/
// __tbody, Zeilen __row, Zellen __th/__td und Spaltentypen (--user mit
// Avatar, --status mit Badge, --numeric, --date).
//
// Achsen: density/variant/content/feature per Modifier aus dem Recipe
// (m.basisKlasse). feature sortable: Kopf mit __sort-button (aria-sort);
// selectable/selection checkbox: __checkbox-cell mit nc-checkbox, Toolbar und
// Batch-Leiste (hidden, solange nichts gewaehlt ist); selection radio:
// __radio-cell mit nc-radio; expandable: __expand-button + Detailzeile
// __row--expand (erste offen).
// Zustaende (Recipe states): selected = zwei Zeilen aria-selected mit
// angehaktem Feld und sichtbarer Batch-Leiste; loading = --loading mit
// Skeleton-Zeilen; error = --error mit __error; empty = __empty; hover nur
// echt (data-zustand an der ersten Zeile).
//
// Ohne Verhalten: das Recipe nennt weder keyboard noch events (sortieren,
// waehlen und aufklappen macht in der Doku js/data-table.js). Die Arena zeigt
// nur „Zustände".
//
// Sortierte Spalte: das DS blendet die Richtungs-Symbole
// ([data-dt-sort-icon=asc|desc]) aus, bis das JS sie zeigt. Die Vorlage setzt
// fuer die sortierte Spalte nur das aufsteigende Symbol ohne JS-Haken.
import { esc } from './_helfer.js'

const PERSONEN = [
  ['Maria Schmidt', 'maria@example.com', 'MS', 'Aktiv', 'success', '12.450,00 €', '2025-11-15', '15.11.2025', 'Admin'],
  ['Thomas Müller', 'thomas@example.com', 'TM', 'Ausstehend', 'warning', '8.120,50 €', '2025-12-02', '02.12.2025', 'Editor'],
  ['Lisa Weber', 'lisa@example.com', 'LW', 'Inaktiv', 'error', '1.980,00 €', '2026-01-20', '20.01.2026', 'Viewer'],
  ['Jonas Klein', 'jonas@example.com', 'JK', 'Aktiv', 'success', '23.700,00 €', '2026-02-11', '11.02.2026', 'Admin']
]

const SORT_NEUTRAL = '<svg class="nc-data-table__sort-icon" data-dt-sort-icon="none" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><path d="M3 9l4-4l4 4m-4-4v14"></path><path d="M21 15l-4 4l-4-4m4 4v-14"></path></svg>'
const SORT_AUF = '<svg class="nc-data-table__sort-icon nc-data-table__sort-icon--active" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><path d="M8 9l4-4l4 4m-4-4v14"></path></svg>'
const AUFKLAPPEN = '<svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M6 4l4 4-4 4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>'
const LEER = '<svg class="nc-data-table__empty-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" fill="none" stroke="currentColor" stroke-width="1.5"></path></svg>'
const MEHR = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 12a1 1 0 1 0 2 0a1 1 0 1 0-2 0"></path><path d="M11 19a1 1 0 1 0 2 0a1 1 0 1 0-2 0"></path><path d="M11 5a1 1 0 1 0 2 0a1 1 0 1 0-2 0"></path></svg>'

const SPALTEN = [
  { id: 'user', label: 'Benutzer', klasse: '' },
  { id: 'status', label: 'Status', klasse: ' nc-data-table__th--status' },
  { id: 'revenue', label: 'Umsatz', klasse: ' nc-data-table__th--numeric' },
  { id: 'date', label: 'Erstellt', klasse: ' nc-data-table__th--date' }
]

function zellen (p, mitLabel) {
  const [name, mail, kuerzel, status, ton, umsatz, iso, datum] = p
  const l = (t) => (mitLabel ? ` data-label="${t}"` : '')
  return `<td class="nc-data-table__td nc-data-table__td--user"${l('Benutzer')}><div class="nc-data-table__user-info"><span class="nc-avatar nc-avatar--sm"><span class="nc-avatar__fallback">${kuerzel}</span></span><div class="nc-data-table__user-text"><span class="nc-data-table__user-name">${esc(name)}</span><span class="nc-data-table__user-email">${mail}</span></div></div></td>
<td class="nc-data-table__td nc-data-table__td--status"${l('Status')}><span class="nc-badge nc-badge--${ton} nc-badge--sm">${status}</span></td>
<td class="nc-data-table__td nc-data-table__td--numeric"${l('Umsatz')}>${umsatz.replace(' ', '&nbsp;')}</td>
<td class="nc-data-table__td nc-data-table__td--date"${l('Erstellt')}><time datetime="${iso}">${datum}</time></td>`
}

function kopf (m, { auswahl, radio, aufklappbar, sortierbar, aktionen }) {
  const th = (s, i) => {
    if (!sortierbar) return `<th class="nc-data-table__th${s.klasse}" scope="col">${s.label}</th>`
    const sortiert = i === 0
    return `<th class="nc-data-table__th${s.klasse}" scope="col" aria-sort="${sortiert ? 'ascending' : 'none'}"><button class="nc-data-table__sort-button" type="button"><span>${s.label}</span>${sortiert ? SORT_AUF : SORT_NEUTRAL}</button></th>`
  }
  return `<thead class="nc-data-table__thead">
<tr class="nc-data-table__row">
${auswahl ? `<th class="nc-data-table__th nc-data-table__checkbox-cell" scope="col"><label class="nc-checkbox nc-checkbox--sm"><input class="nc-checkbox__input" type="checkbox" aria-label="Alle auswählen"><span class="nc-checkbox__control"></span></label></th>\n` : ''}${radio ? '<th class="nc-data-table__th nc-data-table__radio-cell" scope="col"><span class="u-sr-only">Auswahl</span></th>\n' : ''}${aufklappbar ? '<th class="nc-data-table__th nc-data-table__expand-cell" scope="col"><span class="u-sr-only">Details</span></th>\n' : ''}${SPALTEN.map(th).join('\n')}
${aktionen ? '<th class="nc-data-table__th nc-data-table__action-cell" scope="col"><span class="u-sr-only">Aktionen</span></th>\n' : ''}</tr>
</thead>`
}

function koerper (m, art) {
  const spalten = SPALTEN.length + (art.auswahl ? 1 : 0) + (art.radio ? 1 : 0) + (art.aufklappbar ? 1 : 0) + (art.aktionen ? 1 : 0)
  if (m.hat('loading')) {
    const bar = (typ) => `<td class="nc-data-table__td"><div class="nc-data-table__skeleton-bar${typ ? ` nc-data-table__skeleton-bar--${typ}` : ''}"></div></td>`
    return `<tbody class="nc-data-table__tbody">
${[1, 2, 3, 4].map(() => `<tr class="nc-data-table__row nc-data-table__skeleton-row" aria-hidden="true">${bar('avatar')}${bar('text')}${bar('numeric')}${bar('text')}</tr>`).join('\n')}
</tbody>`
  }
  if (m.hat('error')) {
    return `<tbody class="nc-data-table__tbody"><tr class="nc-data-table__row"><td class="nc-data-table__td" colspan="${spalten}"><div class="nc-data-table__error" role="alert"><span>Fehler beim Laden der Daten. Bitte erneut versuchen.</span><button class="nc-button nc-button--sm nc-button--outline" type="button">Erneut laden</button></div></td></tr></tbody>`
  }
  if (m.hat('empty')) {
    return `<tbody class="nc-data-table__tbody"><tr class="nc-data-table__row"><td class="nc-data-table__td" colspan="${spalten}"><div class="nc-data-table__empty">${LEER}<span class="nc-data-table__empty-title">Keine Daten vorhanden</span><span>Versuche eine andere Suche oder erstelle einen neuen Eintrag.</span></div></td></tr></tbody>`
  }
  const gewaehlt = (i) => art.gewaehlt && i < 2
  const zeilen = PERSONEN.map((p, i) => {
    const id = `${m.uid}-z${i + 1}`
    const zustand = i === 0 && m.attribute['data-zustand'] ? ` data-zustand="${m.attribute['data-zustand']}"` : ''
    const sel = art.auswahl || art.radio ? ` aria-selected="${gewaehlt(i) || (art.radio && i === 1)}"` : ''
    let html = `<tr class="nc-data-table__row" id="${id}"${sel}${zustand}>
${art.auswahl ? `<td class="nc-data-table__td nc-data-table__checkbox-cell"><label class="nc-checkbox nc-checkbox--sm"><input class="nc-checkbox__input" type="checkbox" aria-label="${esc(p[0])} auswählen"${gewaehlt(i) ? ' checked' : ''}><span class="nc-checkbox__control"></span></label></td>\n` : ''}${art.radio ? `<td class="nc-data-table__td nc-data-table__radio-cell"><label class="nc-radio nc-radio--sm"><input class="nc-radio__input" type="radio" name="${m.uid}-wahl" aria-label="${esc(p[0])} auswählen"${i === 1 ? ' checked' : ''}><span class="nc-radio__control"></span></label></td>\n` : ''}${art.aufklappbar ? `<td class="nc-data-table__td nc-data-table__expand-cell"><button class="nc-data-table__expand-button" type="button" aria-expanded="${i === 0}" aria-controls="${id}-details" aria-label="Details zu ${esc(p[0])}">${AUFKLAPPEN}</button></td>\n` : ''}${zellen(p, art.stapel)}
${art.aktionen ? `<td class="nc-data-table__td nc-data-table__action-cell"><button class="nc-data-table__action-menu" type="button" aria-label="Weitere Aktionen für ${esc(p[0])}">${MEHR}</button></td>\n` : ''}</tr>`
    if (art.aufklappbar) {
      html += `\n<tr class="nc-data-table__row nc-data-table__row--expand" id="${id}-details"${i === 0 ? '' : ' hidden'}><td class="nc-data-table__td" colspan="${spalten}"><div class="nc-data-table__expand-panel"><p><strong>Abteilung:</strong> IT · <strong>Standort:</strong> Berlin · <strong>Seit:</strong> 2019</p></div></td></tr>`
    }
    return html
  })
  if (art.lang) {
    zeilen[0] = zeilen[0].replace('<span class="nc-data-table__user-name">Maria Schmidt</span>', '<span class="nc-data-table__user-name">Maria Schmidt-Hohenstein, Leitung Digitale Kommunikation und Intranet</span>')
  }
  return `<tbody class="nc-data-table__tbody">
${zeilen.join('\n')}
</tbody>`
}

function batchLeiste (gewaehlt) {
  return `<div class="nc-data-table__batch-bar" aria-live="polite"${gewaehlt ? '' : ' hidden'}>
<span class="nc-data-table__batch-count">${gewaehlt ? '2 Einträge ausgewählt' : '0 Einträge ausgewählt'}</span>
<button class="nc-data-table__batch-clear" type="button">Auswahl aufheben</button>
<div class="nc-data-table__batch-actions">
<button class="nc-button nc-button--sm nc-button--ghost" type="button">Exportieren</button>
<button class="nc-button nc-button--sm nc-button--error" type="button">Löschen</button>
</div>
</div>`
}

function werkzeuge (m, { suche }) {
  return `<div class="nc-data-table__toolbar" role="toolbar" aria-label="Tabellen-Aktionen">
${suche ? `<div class="nc-data-table__search"><label class="u-sr-only" for="${m.uid}-suche">Suche</label><input class="nc-input nc-input--sm" type="search" id="${m.uid}-suche" placeholder="Suche …" autocomplete="off"></div>\n` : ''}<div class="nc-data-table__toolbar-actions">
<button class="nc-button nc-button--sm nc-button--primary" type="button">Hinzufügen</button>
</div>
</div>`
}

function seiten (m) {
  return `<div class="nc-data-table__pagination" role="navigation" aria-label="Tabellen-Navigation">
<div class="nc-data-table__rows-per-page"><label for="${m.uid}-zeilen">Zeilen pro Seite:</label><select class="nc-select nc-select--sm nc-data-table__rows-select" id="${m.uid}-zeilen"><option selected>10</option><option>25</option><option>50</option></select></div>
<span class="nc-data-table__page-info">1–4 von 4</span>
<div class="nc-data-table__page-buttons">
<button class="nc-button nc-button--sm nc-button--ghost" type="button" aria-label="Vorherige Seite" disabled>‹</button>
<button class="nc-button nc-button--sm nc-button--ghost" type="button" aria-label="Nächste Seite" disabled>›</button>
</div>
</div>`
}

export default (zelle, m) => {
  const typ = m.specimen.render?.compositionType
  const auswahl = m.wert('feature') === 'selectable' || m.wert('selection') === 'checkbox'
  const art = {
    auswahl,
    radio: m.wert('selection') === 'radio',
    aufklappbar: m.wert('feature') === 'expandable',
    sortierbar: m.wert('feature') === 'sortable',
    aktionen: typ === 'dt-sticky-cols',
    stapel: typ === 'dt-stacked',
    lang: typ === 'dt-wrap',
    // Auswahl sichtbar: Zustand selected, und im Specimen „selectable", das
    // Zaehler und „Auswahl aufheben" zeigen soll
    gewaehlt: auswahl && (m.hat('selected') || typ === 'dt-selectable' || typ === 'dt-full')
  }
  const extra = []
  if (m.hat('loading')) extra.push('nc-data-table--loading')
  if (m.hat('error')) extra.push('nc-data-table--error')
  if (typ === 'dt-stacked') extra.push('nc-data-table--stacked')
  if (typ === 'dt-sticky-cols') extra.push('nc-data-table--sticky-col-start', 'nc-data-table--sticky-col-end')
  const klasse = [m.basisKlasse, ...extra].join(' ')
  const titel = typ === 'dt-full'
    ? `<div class="nc-data-table__title-bar"><h3 class="nc-data-table__title">Benutzer</h3><p class="nc-data-table__description">Alle Konten mit Rolle, Status und Umsatz.</p></div>\n`
    : ''
  const leiste = art.auswahl ? `${werkzeuge(m, { suche: typ === 'dt-full' })}\n${batchLeiste(art.gewaehlt)}\n` : ''
  // Feste Spaltenbreiten (Inhalt, kein Stil des DS): erst sie lassen die
  // Tabelle breiter werden als den Rahmen — sonst gaebe es nichts zu scrollen.
  const breiten = typ === 'dt-sticky-cols'
    ? '<colgroup><col style="width: 260px"><col style="width: 160px"><col style="width: 180px"><col style="width: 180px"><col style="width: 64px"></colgroup>\n'
    : ''
  return `<div class="${klasse}"${m.hat('loading') ? ' aria-busy="true"' : ''}>
${titel}${leiste}<div class="nc-data-table__scroll-container">
<table class="nc-data-table__table">
<caption class="u-sr-only">Benutzerkonten</caption>
${breiten}${kopf(m, art)}
${koerper(m, art)}
</table>
</div>${typ === 'dt-full' ? '\n' + seiten(m) : ''}
</div>`
}
