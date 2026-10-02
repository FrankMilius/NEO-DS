// @ts-check
/**
 * @file
 * CSS-Variablen fuer die Recipe-Vorschau (Plan v2, 3.5 · 30.09.2026).
 *
 * Die RecipeArena rendert echtes DS-Markup mit den Klassen aus styles.css.
 * Zwei Dinge fehlten dabei:
 *
 * 1. STORE-AENDERUNGEN. Semantik, Foundation, Schriftskala und Komponenten-
 *    Tokens, die ein Admin im Inspector aendert, kamen in der Vorschau nicht
 *    an (die abgeloesten handgeschriebenen Arenen hatten sie per Inline-Style
 *    eingerechnet).
 * 2. BEREICHSWEISES DUNKEL. Das DS deklariert die Komponenten-Tokens auf
 *    :root, z. B. `--nc-footer-surface-bg: var(--fnd-color-background-
 *    secondary)`. var() wird dort aufgeloest — ein `.neo-dark-theme` weiter
 *    unten bindet zwar --fnd-* neu, --nc-footer-* bleibt aber hell. Deshalb
 *    blieb der Footer „Simple (Dark)" hell.
 *
 * Loesung: Am Vorschau-Element werden die :root-Deklarationen der Komponente
 * (Rohtext mit var()) erneut gesetzt, danach die Werte aus dem Store. So
 * werden alle var()-Verweise im Vorschau-Bereich neu aufgeloest — mit den
 * Werten des aktiven Themes und Modus.
 */

import { foundationZeilen } from '../export/foundation-css.js'
import { schriftskalaZeilen } from '../export/type-scale-css.js'

const _deklarationen = new Map()

function sammle(regeln, praefix, ziel) {
  for (const regel of regeln) {
    if (regel.cssRules && !regel.selectorText) {
      // @media, @supports, @layer: hineinschauen
      sammle(regel.cssRules, praefix, ziel)
      continue
    }
    const sel = regel.selectorText
    if (!sel || !sel.split(',').some((s) => s.trim() === ':root')) continue
    const st = regel.style
    for (let i = 0; i < st.length; i++) {
      const name = st[i]
      if (name.startsWith(praefix)) ziel[name] = st.getPropertyValue(name).trim()
    }
  }
}

/**
 * :root-Deklarationen `--nc-<id>-*` (Rohtext, mit var()). Einmal je Komponente
 * aus den geladenen Stylesheets gelesen.
 */
export function komponentenDeklarationen(id, sheets = globalThis.document?.styleSheets) {
  if (_deklarationen.has(id)) return _deklarationen.get(id)
  const ziel = {}
  for (const sheet of sheets || []) {
    let regeln
    try { regeln = sheet.cssRules } catch { continue } // fremde Stylesheets
    if (regeln) sammle(regeln, `--nc-${id}-`, ziel)
  }
  // Nur zwischenspeichern, wenn etwas gefunden wurde (Stylesheets koennen
  // beim ersten Aufruf noch laden).
  if (Object.keys(ziel).length) _deklarationen.set(id, ziel)
  return ziel
}

let _alleRoot = null

/** Alle :root-Deklarationen `--nc-*` (Rohtext), einmal gelesen. */
export function alleKomponentenDeklarationen(sheets = globalThis.document?.styleSheets) {
  if (_alleRoot && sheets === globalThis.document?.styleSheets) return _alleRoot
  const ziel = {}
  for (const sheet of sheets || []) {
    let regeln
    try { regeln = sheet.cssRules } catch { continue }
    if (regeln) sammle(regeln, '--nc-', ziel)
  }
  if (Object.keys(ziel).length && sheets === globalThis.document?.styleSheets) _alleRoot = ziel
  return ziel
}

/** Fuegt die Deklarationen aller per var(--nc-…) erreichten Tokens hinzu (transitiv). */
export function ergaenzeKetten(vars, sheets) {
  const alle = alleKomponentenDeklarationen(sheets)
  const offen = Object.values(vars)
  for (let runde = 0; offen.length && runde < 500; runde++) {
    const wert = offen.shift()
    for (const m of String(wert).matchAll(/var\(\s*(--nc-[\w-]+)/g)) {
      const name = m[1]
      if (name in vars || !(name in alle)) continue
      vars[name] = alle[name]
      offen.push(alle[name])
    }
  }
  return vars
}

/** "  --x: y;" → { '--x': 'y' } */
export function zeilenZuObjekt(zeilen = []) {
  const obj = {}
  for (const z of zeilen) {
    const m = /^\s*(--[\w-]+)\s*:\s*(.+?);?\s*$/.exec(z)
    if (m) obj[m[1]] = m[2]
  }
  return obj
}

/**
 * Alle Variablen fuer ein Vorschau-Element.
 * @param {object} o
 * @param {string} o.id          Komponenten-ID (Recipe)
 * @param {'light'|'dark'} o.modus
 * @param {object} o.state       store.state
 * @param {object} [o.sheets]    fuer Tests
 */
export function vorschauVariablen({ id, modus, state, sheets }) {
  const set = state.activeThemeSet || 'neo'
  const vars = { ...komponentenDeklarationen(id, sheets) }
  // Ketten zu Tokens anderer Komponenten (Plan v3, Komposition): z. B.
  // --nc-search-input-radius: var(--nc-input-radius) oder --nc-badge-
  // success-bg: var(--nc-tag-success-bg). Auch diese Ziele werden hier neu
  // deklariert, sonst gelten sie mit dem auf :root aufgeloesten (hellen)
  // Wert — dunkle Zellen zeigten dann helle Farben.
  ergaenzeKetten(vars, sheets)
  const semantik = state.themes?.[set]?.[modus] || {}
  for (const [rolle, wert] of Object.entries(semantik)) {
    if (wert) vars[`--fnd-color-${rolle}`] = wert
  }
  const fnd = state.foundationOverrides?.[set]
  if (fnd) Object.assign(vars, zeilenZuObjekt(foundationZeilen(fnd).zeilen))
  Object.assign(vars, zeilenZuObjekt(schriftskalaZeilen(state.typeScale?.[set])))
  for (const [token, wert] of Object.entries(state.componentOverrides?.[set] || {})) {
    if (wert !== '' && wert != null) vars[`--${token}`] = wert
  }
  // Store-Werte koennen selbst auf andere Komponenten-Tokens zeigen
  ergaenzeKetten(vars, sheets)
  return vars
}
