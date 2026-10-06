// Vorlage: button — Markup aus data/markup/button.html (geerntet von der
// Doku) und der SCSS-Struktur (scss/scss/05-atoms/_button.scss):
//   button.nc-button[.nc-button--<variant|size|…>]  type="button"
//     span.nc-button__icon   (aria-hidden; with-icon, icon-only, fab)
//     span.nc-button__label  (fehlt bei icon-only/fab — dann aria-label)
//     span.nc-button__spinner (nur loading)
//   a.nc-button             composition=link (api.elements.link)
//   div.nc-button-group     composition=group/toggle (Wrapper aus dem Recipe)
//
// Zustaende: loading → .nc-button--loading + aria-busy (das SCSS zeichnet
// den Spinner nur mit dem Modifier, siehe button-loading), disabled → natives
// disabled bzw. aria-disabled am Link, pressed → aria-pressed nur in der
// Toggle-Gruppe (Regel onlyWhen composition=toggle). Zustandsklassen, die das
// DS am Button nicht kennt (is-loading, is-pressed, is-disabled …), bleiben
// weg. Hover/Fokus nur als Pseudoklasse (Zelle zeigt den Ruhezustand).
//
// Kein Verhalten in neo-behaviors: Enter/Leertaste und click sind nativ.
import { esc, klassenOhne } from './_helfer.js'

const SVG = (pfade) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${pfade}</svg>`
const PLUS = SVG('<path d="M12 5v14"/><path d="M5 12h14"/>')
const HAKEN = SVG('<path d="M5 12l5 5l10 -10"/>')
const FORMAT = {
  Bold: SVG('<path d="M7 5h6a3.5 3.5 0 0 1 0 7h-6z"/><path d="M13 12h1a3.5 3.5 0 0 1 0 7h-7v-7"/>'),
  Italic: SVG('<path d="M11 5l6 0"/><path d="M7 19l6 0"/><path d="M14 5l-4 14"/>'),
  Underline: SVG('<path d="M7 5v5a5 5 0 0 0 10 0v-5"/><path d="M5 19h14"/>')
}

// Klassen aus der Zustandsmatrix, die es am Button nicht gibt
const FREMD = ['is-loading', 'is-pressed', 'is-disabled', 'is-active', 'is-selected', 'is-open', 'nc-button--disabled']

const symbol = (svg) => `<span class="nc-button__icon" aria-hidden="true">${svg}</span>`

/** Ein Button. `o.text` Beschriftung, `o.svg` Symbol, `o.pressed` true/false/undefined. */
function knopf (m, o) {
  const komposition = m.wert('composition') || 'single'
  const laedt = m.hat('loading')
  const klassen = [klassenOhne(m, ...FREMD)]
  if (laedt) klassen.push('nc-button--loading')
  const nurSymbol = m.wert('pattern') === 'icon-only' || komposition === 'fab'
  const mitSymbol = nurSymbol || m.wert('pattern') === 'with-icon'

  // aria-pressed gehoert nur zum Toggle (State-Regel onlyWhen); die Vorlage
  // setzt es je Knopf selbst
  let attrs = m.attrsOhne('aria-pressed')
  if (o.pressed !== undefined) attrs += ` aria-pressed="${o.pressed}"`
  if (nurSymbol) attrs += ` aria-label="${esc(o.text)}"`

  const innen = [
    mitSymbol ? symbol(o.svg || (nurSymbol ? PLUS : HAKEN)) : '',
    nurSymbol ? '' : `<span class="nc-button__label">${esc(o.text)}</span>`,
    laedt ? '<span class="nc-button__spinner" aria-hidden="true"></span>' : ''
  ].join('')

  if (komposition === 'link') {
    return `<a class="${klassen.join(' ')}" href="#" onclick="return false"${attrs}>${innen}</a>`
  }
  // Loading hat Vorrang vor disabled: aria-disabled (Regel), kein natives
  // disabled — der Spinner bleibt die primaere Information
  const nativ = m.deaktiviert && !laedt ? ' disabled' : ''
  return `<button type="button" class="${klassen.join(' ')}"${nativ}${attrs}>${innen}</button>`
}

/** Wrapper der Komposition aus dem Recipe (axes.composition.values.*.wrapper). */
function gruppe (m, inhalt) {
  const w = m.recipe.axes?.composition?.values?.[m.wert('composition')]?.wrapper || {}
  const attrs = Object.entries(w.attributes || {}).map(([k, v]) => ` ${k}="${esc(v)}"`).join('')
  return `<div class="${esc(w.className || 'nc-button-group')}"${attrs}>${inhalt}</div>`
}

export default (zelle, m) => {
  const render = m.specimen.render || {}
  const komposition = m.wert('composition') || 'single'

  if (komposition === 'group') {
    const labels = render.groupLabels || ['Links', 'Mitte', 'Rechts']
    return gruppe(m, labels.map((text) => knopf(m, { text })).join(''))
  }

  if (komposition === 'toggle') {
    // Erster Knopf gedrueckt (Zustand pressed), die anderen nicht — die
    // Gruppe zeigt beide Werte von aria-pressed nebeneinander
    const labels = render.toggleLabels || ['Bold', 'Italic', 'Underline']
    return gruppe(m, labels.map((text, i) => knopf(m, {
      text,
      svg: FORMAT[text],
      pressed: m.hat('pressed') ? i === 0 : false
    })).join(''))
  }

  if (komposition === 'fab') return knopf(m, { text: 'Neu anlegen', svg: PLUS })
  if (m.wert('pattern') === 'icon-only') return knopf(m, { text: `Hinzufügen (${m.wert('variant')}, ${m.wert('size')})`, svg: PLUS })
  return knopf(m, { text: m.text })
}
