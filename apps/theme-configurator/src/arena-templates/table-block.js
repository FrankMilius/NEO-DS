// Vorlage: table-block — Markup aus data/markup/table-block.html: ein
// Vergleichstabellen-Block (nc-compare-table) um eine Editionsmatrix,
// gekuerzt auf eine Rubrik mit fuenf Zeilen.
const HAKEN = '<svg class="nc-tbl-icon nc-tbl-icon--check" width="32" height="32" viewBox="0 0 36 36" fill="none" aria-label="enthalten"><circle cx="18" cy="18" r="18" fill="#AEF359"></circle><path d="M12 18L16 22L24 14" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>'
const STRICH = '<svg class="nc-tbl-icon nc-tbl-icon--dash" width="32" height="32" viewBox="0 0 36 36" fill="none" aria-label="nicht enthalten"><path d="M11 18H25" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>'

const ZEILEN = [
  ['News, Newskanäle', true, true],
  ['Inhalts- und Wissensseiten', true, true],
  ['Veranstaltungskalender &amp; Event-Seiten', true, true],
  ['Mitarbeiterverzeichnis &amp; Nutzerprofile', false, true],
  ['Personalisierte Toolbar &amp; Schnellzugriff', false, true]
]

const zelle = (an) => `<td><div class="nc-tbl-cell nc-tbl-cell--icon">${an ? HAKEN : STRICH}</div></td>`

export default (_zelle, m) => `
<div class="${m.klasse}"${m.attrs}>
<div class="nc-compare-table nc-compare-table--striped nc-compare-table--full-width">
<table>
<thead><tr><th scope="col">Funktion</th><th scope="col">Standard</th><th scope="col">Premium</th></tr></thead>
<tbody>
<tr class="nc-compare-table__section-row"><th scope="rowgroup" colspan="3"><div class="nc-tbl-cell"><p class="nc-tbl-cell__text">FÜR MITARBEITENDE / ENDNUTZER</p></div></th></tr>
${ZEILEN.map(([text, std, prem]) => `<tr><th scope="row"><div class="nc-tbl-cell"><p class="nc-tbl-cell__text">${text}</p></div></th>${zelle(std)}${zelle(prem)}</tr>`).join('\n')}
</tbody>
</table>
</div>
</div>`
