#!/usr/bin/env node
// ==========================================================================
// Shot-Vorschau-CSS fuer den Drupal-Admin (Restpunkte 09.10.2026, shot-admin)
// ==========================================================================
// Die Live-Vorschau des Shot-Editors in neo_fe (js/neo-shot-editor.js) baut
// das Medien-Bauteil per NeoBehaviors.shotAufbauen — im Admin-Theme (Claro)
// ist styles.css aber nicht geladen, die Vorschau stand ohne Stile (Bild in
// voller Groesse, kein Rahmen, Marker unsichtbar). styles.css dort zu laden,
// wuerde das Admin-Theme verstellen (Reset, Elementstile, Schriften).
//
// Dieses Skript zieht aus dem GEBAUTEN styles.css genau das, was .nc-shot
// braucht — nichts von Hand kopiert:
//   - jede Regel, deren Selektoren alle mit .nc-shot beginnen (auch in
//     @media), bei gemischten Listen nur diese Selektoren;
//   - die @keyframes, die diese Regeln per animation nennen;
//   - die Custom Properties, die diese Regeln (transitiv) per var() lesen,
//     mit ihren :root-Werten (helles Theme — der Admin ist hell), gebunden an
//     :where(.nc-shot-vorschau) — die Vorschau-Huelle traegt diese Klasse;
//   - box-sizing wie im Reset des DS, nur innerhalb der Huelle.
// Jeder Selektor der Ausgabe beginnt mit .nc-shot bzw. :where(.nc-shot-
// vorschau) — am Admin-Theme aendert sich nichts.
//
//   npm run build:css && npm run build:shot-vorschau   → shot-vorschau.css
//   npm run sync:drupal  kopiert sie nach <neo_fe>/css/neo-shot-vorschau.css
// ==========================================================================

import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const WURZEL = resolve(dirname(fileURLToPath(import.meta.url)), '..')
export const HUELLE = '.nc-shot-vorschau'

/**
 * Zerlegt (komprimiertes) CSS in Bloecke der obersten Ebene:
 * { kopf, rumpf } — kopf ist Selektor bzw. @-Regel, rumpf der Inhalt.
 * Anfuehrungszeichen und Kommentare werden beachtet.
 * @param {string} css
 */
export function bloecke (css) {
  const out = []
  let i = 0
  let start = 0
  while (i < css.length) {
    const c = css[i]
    if (c === '"' || c === "'") { i = ende(css, i); continue }
    if (c === '/' && css[i + 1] === '*') { const e = css.indexOf('*/', i + 2); i = e < 0 ? css.length : e + 2; start = start === i ? i : start; continue }
    if (c === ';' ) { // @charset, @import, @layer x;
      out.push({ kopf: css.slice(start, i).trim(), rumpf: null }); i++; start = i; continue
    }
    if (c === '{') {
      let tiefe = 1
      let j = i + 1
      while (j < css.length && tiefe) {
        const d = css[j]
        if (d === '"' || d === "'") { j = ende(css, j); continue }
        if (d === '{') tiefe++
        else if (d === '}') tiefe--
        j++
      }
      out.push({ kopf: css.slice(start, i).replace(/\/\*[\s\S]*?\*\//g, '').trim(), rumpf: css.slice(i + 1, j - 1) })
      i = j; start = j; continue
    }
    i++
  }
  return out.filter((b) => b.kopf || b.rumpf)
}

function ende (s, i) {
  const q = s[i]
  let j = i + 1
  while (j < s.length && s[j] !== q) j += s[j] === '\\' ? 2 : 1
  return j + 1
}

/** Teilt eine Liste an Kommas der obersten Ebene (nicht in Klammern). */
export function teile (liste, trenner = ',') {
  const out = []
  let tiefe = 0
  let start = 0
  for (let i = 0; i < liste.length; i++) {
    const c = liste[i]
    if (c === '"' || c === "'") { i = ende(liste, i) - 1; continue }
    if (c === '(' || c === '[') tiefe++
    else if (c === ')' || c === ']') tiefe--
    else if (c === trenner && !tiefe) { out.push(liste.slice(start, i)); start = i + 1 }
  }
  out.push(liste.slice(start))
  return out.map((s) => s.trim()).filter(Boolean)
}

/** Deklarationen eines Rumpfs als [name, wert]. */
export function deklarationen (rumpf) {
  return teile(rumpf, ';').map((d) => {
    const k = d.indexOf(':')
    return [d.slice(0, k).trim(), d.slice(k + 1).trim()]
  }).filter(([n]) => n)
}

const istShot = (sel) => /^\.nc-shot(?![\w-])|^\.nc-shot(__|--)/.test(sel)

/**
 * @param {string} css gebautes styles.css
 * @returns {string} Vorschau-CSS
 */
export function shotVorschau (css) {
  const alle = bloecke(css)
  /** @type {string[]} */
  const regeln = []
  const genutzt = new Set()
  const animationen = new Set()

  const nimmRegel = (b) => {
    const sel = teile(b.kopf).filter(istShot)
    if (!sel.length) return null
    for (const m of b.rumpf.matchAll(/var\((--[\w-]+)/g)) genutzt.add(m[1])
    for (const [n, w] of deklarationen(b.rumpf)) {
      if (n === 'animation' || n === 'animation-name') for (const t of w.split(/[\s,]+/)) animationen.add(t)
    }
    return `${sel.join(',')}{${b.rumpf}}`
  }

  for (const b of alle) {
    if (b.rumpf === null) continue
    if (b.kopf.startsWith('@media') || b.kopf.startsWith('@supports')) {
      const innen = bloecke(b.rumpf).filter((x) => x.rumpf !== null && !x.kopf.startsWith('@')).map(nimmRegel).filter(Boolean)
      if (innen.length) regeln.push(`${b.kopf}{${innen.join('')}}`)
    } else if (!b.kopf.startsWith('@')) {
      const r = nimmRegel(b)
      if (r) regeln.push(r)
    }
  }

  const frames = alle.filter((b) => /^@(-webkit-)?keyframes\s/.test(b.kopf) && animationen.has(b.kopf.split(/\s+/)[1]))
    .map((b) => `${b.kopf}{${b.rumpf}}`)

  // :root-Werte (nur reine :root-Regeln der obersten Ebene; spaetere gewinnen)
  const wurzel = new Map()
  for (const b of alle) {
    if (b.rumpf === null || b.kopf.startsWith('@')) continue
    if (!teile(b.kopf).includes(':root')) continue
    for (const [n, w] of deklarationen(b.rumpf)) if (n.startsWith('--')) wurzel.set(n, w)
  }
  // transitiv aufloesen
  const offen = [...genutzt]
  const tokens = new Map()
  while (offen.length) {
    const n = /** @type {string} */ (offen.pop())
    if (tokens.has(n) || !wurzel.has(n)) continue
    const w = /** @type {string} */ (wurzel.get(n))
    tokens.set(n, w)
    for (const m of w.matchAll(/var\((--[\w-]+)/g)) offen.push(m[1])
  }
  const tokenRegel = `:where(${HUELLE}){${[...tokens].sort(([a], [b]) => a.localeCompare(b)).map(([n, w]) => `${n}:${w}`).join(';')}}`
  const boxRegel = `:where(${HUELLE}),:where(${HUELLE}) *,:where(${HUELLE}) *::before,:where(${HUELLE}) *::after{box-sizing:border-box}`

  return [
    '/* Erzeugt von WEBSITE26 scripts/baue-shot-vorschau.mjs aus styles.css — nicht von Hand aendern.',
    '   Stile des Medien-Bauteils .nc-shot fuer die Admin-Vorschau (neo_fe js/neo-shot-editor.js);',
    `   Huelle ${HUELLE} traegt die Tokens. Restpunkte 09.10.2026, shot-admin. */`,
    tokenRegel,
    boxRegel,
    ...regeln,
    ...frames
  ].join('\n') + '\n'
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const quelle = resolve(WURZEL, 'styles.css')
  if (!existsSync(quelle)) {
    console.error('✗ styles.css fehlt — zuerst npm run build:css')
    process.exit(1)
  }
  const ziel = resolve(WURZEL, 'shot-vorschau.css')
  const css = shotVorschau(readFileSync(quelle, 'utf8'))
  writeFileSync(ziel, css)
  console.log(`  ✓ shot-vorschau.css (${(Buffer.byteLength(css) / 1024).toFixed(1)} KB) aus styles.css`)
}
