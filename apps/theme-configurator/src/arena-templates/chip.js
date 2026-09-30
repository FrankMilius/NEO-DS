// Vorlage: chip — Markup aus data/markup/chip.html: immer ein <button> mit
// aria-pressed (R3 in _chip.scss — NICHT aria-selected). Zustand selected
// setzt nc-chip--selected und aria-pressed="true", disabled sperrt den Knopf.
// content: with-icon (__icon), with-avatar (__avatar), with-count (__count,
// Zahl aus render.counts), removable (__remove). Kompositionen chip-group /
// chip-group-scroll reihen vier Chips in nc-chip-group (--scroll).
import { SYMBOL, esc } from './_helfer.js'

const AVATAR_SRC = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 32 32%22%3E%3Crect width=%2232%22 height=%2232%22 fill=%22%231a1a1a%22/%3E%3Ctext x=%2216%22 y=%2221%22 font-family=%22sans-serif%22 font-size=%2213%22 fill=%22%23fff%22 text-anchor=%22middle%22%3EFM%3C/text%3E%3C/svg%3E'

function chip (m, text, { ausgewaehlt, inhalt, zahl }) {
  const klassen = [...m.klassen.filter((k) => k !== 'is-selected' && k !== 'nc-chip--selected')]
  if (ausgewaehlt) klassen.push('nc-chip--selected')
  const vorne = inhalt === 'with-icon'
    ? `<span class="nc-chip__icon">${SYMBOL.kreis}</span>`
    : inhalt === 'with-avatar' ? `<img class="nc-chip__avatar" src="${AVATAR_SRC}" alt="">` : ''
  const hinten = inhalt === 'with-count'
    ? `<span class="nc-chip__count">${zahl}</span>`
    : inhalt === 'removable' ? `<span class="nc-chip__remove" aria-hidden="true">${SYMBOL.schliessen}</span>` : ''
  return `<button class="${klassen.join(' ')}" type="button" aria-pressed="${ausgewaehlt}"${m.deaktiviert ? ' disabled' : ''}${m.attrsOhne('aria-selected', 'aria-pressed')}>${vorne}<span class="nc-chip__label">${esc(text)}</span>${hinten}</button>`
}

export default (zelle, m) => {
  const ausgewaehlt = m.hat('selected')
  const inhalt = m.wert('content')
  const art = m.specimen.render?.compositionType
  if (art === 'chip-group' || art === 'chip-group-scroll') {
    const namen = ['Alle', 'Intranet', 'Mitarbeiter-App', 'KI', 'Integrationen', 'Sicherheit']
    return `<div class="nc-chip-group${art === 'chip-group-scroll' ? ' nc-chip-group--scroll' : ''}" role="group" aria-label="Filter"${art === 'chip-group-scroll' ? ' style="max-width: 320px;"' : ''}>
${namen.map((n, i) => chip(m, n, { ausgewaehlt: ausgewaehlt ? i === 0 : false, inhalt })).join('\n')}
</div>`
  }
  const zahlen = m.specimen.render?.counts || [12]
  return chip(m, inhalt === 'with-avatar' ? 'Frank M.' : m.text, { ausgewaehlt, inhalt, zahl: zahlen[ausgewaehlt ? 1 : 0] ?? zahlen[0] })
}
