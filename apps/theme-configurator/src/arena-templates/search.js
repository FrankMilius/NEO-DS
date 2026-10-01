// Vorlage: search — Markup aus data/markup/search.html. Das Suchfeld ist
// ein Input (Komposition im Recipe: enthaelt input) und traegt deshalb
// `nc-input nc-search__input`: Rahmen, Hintergrund, Fokus und Zustaende
// kommen vom Input, Hoehe und Radius ueber --nc-search-input-* (zeigen im
// Standard auf die Input-Tokens).
//
// Achsen: width/appearance/animation per Modifier; scope=scoped zeigt den
// Bereichs-Knopf; content steuert Symbole, Gruppen und Tastenkuerzel;
// resultsState zeigt Ergebnisse, leer, laedt, geschlossen, Verlauf, Beliebt.
// Die Ergebnisliste ist im DS absolut positioniert — die Zelle haelt Platz
// frei. Die Befehlspalette (--command) ist im DS ein fixes Overlay; in der
// Arena bleibt sie in ihrer Zelle.
import { esc } from './_helfer.js'

const LUPE = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="10" cy="10" r="7"></circle><line x1="21" y1="21" x2="15" y2="15"></line></svg>'
const DOKUMENT = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6"/></svg>'
const UHR = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>'
const TREND = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m3 17 6-6 4 4 8-8"/><path d="M14 7h7v7"/></svg>'
const CHEVRON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>'

const TREFFER = [
  ['Button', ' — Interaktive Schaltfläche'],
  ['Button', ' Micro — für enge Bereiche'],
  ['Button', ' Tokens — Component-Tokens']
]

function eintrag (m, [treffer, rest], symbol, i) {
  const mitSymbol = m.wert('content') !== 'plain'
  return `<a class="nc-search__item" href="#" role="option" id="${m.uid}-o${i}" aria-selected="false">${mitSymbol ? `<span class="nc-search__item-icon">${symbol}</span>` : ''}<span class="nc-search__item-label"><span class="nc-search__highlight">${treffer}</span>${esc(rest)}</span></a>`
}

function gruppe (titel, inhalt) {
  return `<div class="nc-search__group" role="group" aria-label="${esc(titel)}"><div class="nc-search__group-label">${esc(titel)}</div>${inhalt}</div>`
}

function ergebnisse (m) {
  const stand = m.wert('resultsState') || 'results'
  if (stand === 'closed') return ''
  let inhalt
  if (stand === 'empty') inhalt = '<div class="nc-search__empty">Keine Treffer für „xyzqwerty“</div>'
  else if (stand === 'loading') inhalt = '<div class="nc-search__loading"><span class="nc-spinner nc-spinner--sm" role="status" aria-label="Lädt"></span></div>'
  else if (stand === 'history') inhalt = gruppe('Zuletzt gesucht', ['Datenschutz', 'Urlaubsantrag'].map((t, i) => `<a class="nc-search__item" href="#" role="option" id="${m.uid}-h${i}"><span class="nc-search__item-icon">${UHR}</span><span class="nc-search__item-label">${t}</span></a>`).join(''))
  else if (stand === 'popular') inhalt = gruppe('Beliebt', ['Kantine', 'IT-Support'].map((t, i) => `<a class="nc-search__item" href="#" role="option" id="${m.uid}-p${i}"><span class="nc-search__item-icon">${TREND}</span><span class="nc-search__item-label">${t}</span></a>`).join(''))
  else if (m.wert('content') === 'grouped') inhalt = gruppe('Komponenten', TREFFER.slice(0, 2).map((t, i) => eintrag(m, t, DOKUMENT, i)).join('')) + gruppe('Foundation', eintrag(m, TREFFER[2], DOKUMENT, 2))
  else inhalt = TREFFER.map((t, i) => eintrag(m, t, DOKUMENT, i)).join('')
  return `<div class="nc-search__results" role="listbox" id="${m.uid}-liste" aria-label="Suchergebnisse"${stand === 'loading' ? ' aria-busy="true"' : ''}>${inhalt}</div>`
}

export default (zelle, m) => {
  const stand = m.wert('resultsState') || 'results'
  const befehl = m.specimen.id === 'command-palette'
  const tippen = m.specimen.id === 'type-ahead'
  const offen = stand !== 'closed'
  const wert = stand === 'empty' ? 'xyzqwerty' : (stand === 'history' || stand === 'popular') ? '' : (tippen ? 'But' : 'Button')
  const klasse = m.klasse + (befehl ? ' nc-search--command' : '')
  const bereich = m.wert('scope') === 'scoped'
    ? `<button type="button" class="nc-search__scope-trigger" aria-haspopup="listbox" aria-expanded="false">Alle Bereiche ${CHEVRON}</button>`
    : ''
  const kuerzel = m.wert('content') === 'with-shortcut' ? '<kbd class="nc-search__shortcut">⌘K</kbd>' : ''
  const geist = tippen ? '<span class="nc-search__ghost" aria-hidden="true"><span style="visibility:hidden">But</span>ton</span>' : ''
  // Platz fuer die absolut positionierte Liste; das Overlay bleibt in der Zelle.
  const huelle = befehl
    ? 'position:relative;height:360px;overflow:hidden;border-radius:var(--fnd-radius-md);'
    : `position:relative;${offen ? 'min-height:' + (m.wert('content') === 'grouped' ? 300 : 240) + 'px;' : ''}`
  const stilWurzel = befehl ? ' style="position:absolute;padding-top:48px;"' : ''
  return `<div style="${huelle}">
<div class="${klasse}"${m.attrs}${stilWurzel}>
<div class="nc-search__input-wrapper">
${bereich}<span class="nc-search__icon" aria-hidden="true">${LUPE}</span>
<input class="nc-input nc-search__input" type="search" value="${esc(wert)}" placeholder="Suchen …" aria-label="Suchen" role="combobox" aria-autocomplete="list" aria-expanded="${offen}" aria-controls="${m.uid}-liste">
${geist}${kuerzel}
</div>
${ergebnisse(m)}
</div>
</div>`
}
