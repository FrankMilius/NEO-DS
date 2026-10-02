// Vorlage: segmented-control — Markup aus data/markup/segmented-control.html:
// role="radiogroup" mit <button class="nc-segmented-control__item"
// role="radio" aria-checked>. Die Auswahl zeigt das DS ueber aria-checked;
// Umschalten (roving tabindex, Pfeiltasten) uebernimmt neo-behaviors (Arena: Ausprobieren).
//
// Achsen: size und width per Modifier; content waehlt Text, Symbol + Text,
// nur Symbol (mit aria-label) oder Text + Zaehler (__badge);
// indicator=sliding stellt __indicator als erstes Kind in die Leiste —
// einrichten() legt ihn mit setzeIndikator() aus neo-behaviors unter das
// gewaehlte Segment (--_indicator-left/-width).
// Zustaende am Segment: Standard = erstes Segment gewaehlt, selected = das
// zweite; disabled = ganze Leiste aus (disabled-mixed: Standard mit einem
// deaktivierten Segment); hover/focus nur echt.
import { setzeIndikator } from 'neo-behaviors'
import { esc, klassenOhne, FREMDE_ZUSTANDSKLASSEN, NATIVE_ARIA } from './_helfer.js'

const SYMBOL = {
  raster: '<svg class="nc-segmented-control__icon" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>',
  liste: '<svg class="nc-segmented-control__icon" viewBox="0 0 24 24" aria-hidden="true"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>',
  karte: '<svg class="nc-segmented-control__icon" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="8" rx="2"/><rect x="3" y="13" width="18" height="8" rx="2"/></svg>'
}

const SEGMENTE = [['Raster', 'raster', 12], ['Liste', 'liste', 5], ['Karten', 'karte', 0]]
const VIELE = ['Alle', 'Ungelesen', 'Erwähnungen', 'Aufgaben', 'Dateien', 'Termine', 'Archiv', 'Entwürfe']

function segment (m, [text, symbol, zahl], i, gewaehlt, gesperrt) {
  const content = m.wert('content') || 'text'
  const nurSymbol = content === 'icon-only'
  const mitSymbol = nurSymbol || content === 'icon-text' || m.slot('icon')
  const badge = (content === 'text-badge' || m.slot('badge')) && zahl
    ? `<span class="nc-segmented-control__badge">${zahl}<span class="u-sr-only"> neu</span></span>`
    : ''
  const an = i === gewaehlt
  return `<button type="button" class="nc-segmented-control__item" role="radio" aria-checked="${an}" tabindex="${an ? 0 : -1}"${nurSymbol ? ` aria-label="${esc(text)}"` : ''}${gesperrt ? ' aria-disabled="true" disabled' : ''}>${mitSymbol ? SYMBOL[symbol] : ''}${nurSymbol ? '' : `<span>${esc(text)}</span>`}${badge}</button>`
}

export default (zelle, m) => {
  const klasse = klassenOhne(m, ...FREMDE_ZUSTANDSKLASSEN, 'nc-segmented-control--disabled')
  const gewaehlt = m.hat('selected') ? 1 : 0
  const ganzAus = m.deaktiviert
  const einzelnAus = m.specimen.id === 'disabled-mixed' && !ganzAus
  const scroll = m.wert('width') === 'scrollable'
  const liste = scroll ? VIELE.map((t) => [t, null, 0]) : SEGMENTE
  const indikator = m.slot('indicator') ? '<div class="nc-segmented-control__indicator" aria-hidden="true"></div>' : ''
  const leiste = `<div class="${klasse}" role="radiogroup" aria-label="Ansicht"${m.attrsOhne(...NATIVE_ARIA)}>
${indikator}${liste.map((s, i) => segment(m, s, i, gewaehlt, ganzAus || (einzelnAus && i === liste.length - 1))).join('\n')}
</div>`
  // Volle Breite und Scrollen brauchen eine begrenzte Flaeche
  return m.wert('width') === 'full-width' || scroll ? `<div class="ra-feld">${leiste}</div>` : leiste
}

/**
 * Legt den gleitenden Indikator unter das gewaehlte Segment — dieselbe
 * Funktion wie im Behavior (packages/neo-behaviors/segmented-control.js).
 */
export function einrichten (element) {
  for (const leiste of element.querySelectorAll('.nc-segmented-control')) setzeIndikator(leiste)
}
