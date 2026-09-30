// Vorlage: compare-table — Markup aus data/markup/compare-table.html
// (gekürzt auf drei Zeilen). Achsen selection/sorting schalten Checkbox-Spalte
// und Sortier-Symbol ein; Zustand „selected" markiert die erste Datenzeile
// (is-selected an der Zeile, nicht an der Tabelle).
const HAKEN = '<svg class="nc-tbl-icon nc-tbl-icon--check" width="32" height="32" viewBox="0 0 36 36" fill="none" aria-label="enthalten"><circle cx="18" cy="18" r="18"></circle><path d="M12 18L16 22L24 14" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>'
const SORT = '<span class="nc-compare-table__sort-icon" aria-hidden="true"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m7 15 5 5 5-5M7 9l5-5 5 5"/></svg></span>'

const ZEILEN = [
  ['News, Newskanäle', true, true, '12'],
  ['Inhalts- und Wissensseiten', true, true, '48'],
  ['Veranstaltungskalender &amp; Event-Seiten', false, true, '1.250']
]

export default (zelle, m) => {
  const auswahl = m.wert('selection') === 'checkbox'
  const sortierbar = m.wert('sorting') === 'sortable'
  const kopfAuswahl = auswahl ? `<th scope="col"><input class="nc-compare-table__checkbox" type="checkbox" aria-label="Alle auswählen"></th>` : ''
  const kopf = (text) => `<th scope="col"${sortierbar ? ' aria-sort="none"' : ''}>${text}${sortierbar ? SORT : ''}</th>`
  return `
<div class="${m.basisKlasse}"${m.attrsOhne('aria-selected')}>
<table>
<thead>
<tr>${kopfAuswahl}${kopf('Funktion')}${kopf('Standard')}${kopf('Premium')}<th scope="col" class="nc-compare-table__numeric">Nutzer</th></tr>
</thead>
<tbody>
<tr class="nc-compare-table__section-row"><th scope="rowgroup" colspan="${auswahl ? 5 : 4}"><div class="nc-tbl-cell"><p class="nc-tbl-cell__text">FÜR MITARBEITENDE / ENDNUTZER</p></div></th></tr>
${ZEILEN.map(([text, std, prem, zahl], i) => {
  const gewaehlt = auswahl && i === 0 && m.hat('selected')
  return `<tr${gewaehlt ? ' class="is-selected" aria-selected="true"' : ''}>
${auswahl ? `<td><input class="nc-compare-table__checkbox" type="checkbox" aria-label="Zeile auswählen"${gewaehlt ? ' checked' : ''}></td>` : ''}
<th scope="row"><div class="nc-tbl-cell"><p class="nc-tbl-cell__text">${text}</p></div></th>
<td><div class="nc-tbl-cell${std ? ' nc-tbl-cell--icon' : ''}">${std ? HAKEN : ''}</div></td>
<td><div class="nc-tbl-cell${prem ? ' nc-tbl-cell--icon' : ''}">${prem ? HAKEN : ''}</div></td>
<td class="nc-compare-table__numeric">${zahl}</td>
</tr>`
}).join('\n')}
</tbody>
</table>
</div>`
}
