// @ts-check
// ==========================================================================
// Sichere CSS-Werte und sichere CSS-Ausgabe (Befund UX-02, 15.10.2026)
// ==========================================================================
// Die App schreibt Eingaben der Nutzer als Werte von CSS-Variablen in das
// veröffentlichte CSS bzw. in das CSS der Website-Vorschau. Ein Wert wie
//   Arial; } body { display: none } :root {
// verließ dabei den Block und machte die Website leer. Drei Schutzschichten:
//   1. Eingabe: pruefeFontStack() / istSichererCssWert() am Feld und im Store.
//   2. Ausgabe: bereinigeCss() lässt nur die Grammatik der App durch —
//      Kommentare, @import von fonts.googleapis.com und Blöcke, die nur
//      eigene Eigenschaften (--name: wert;) setzen.
//   3. Server: dieselbe Grammatik prüft Drupal beim Veröffentlichen und bei
//      der Vorschau (Vertrag::pruefeCss, Attrappe: pruefeCss).
// ==========================================================================

/** Zeichen, die einen Wert aus seinem Block oder Kommentar ausbrechen lassen. */
// eslint-disable-next-line no-control-regex -- Steuerzeichen sind genau das Ziel
export const CSS_VERBOTEN = /[{};<>\\]|\/\*|\*\/|[\u0000-\u001f\u007f]/

/** Text mit Zeichen, die aus dem CSS-Block ausbrechen? (andere Typen: nein) */
export function istUnsichererText (wert) {
  return typeof wert === 'string' && CSS_VERBOTEN.test(wert)
}

/** Darf dieser Wert als Wert einer CSS-Variable ausgegeben werden? */
export function istSichererCssWert (wert) {
  if (typeof wert === 'number') return Number.isFinite(wert)
  if (typeof wert !== 'string') return false
  return !CSS_VERBOTEN.test(wert)
}

const NAME_UNGEQUOTET = /^[\p{L}\p{N} _.-]+$/u
const NAME_GEQUOTET = /^(["'])[\p{L}\p{N} _.,&()+-]+\1$/u

/**
 * Font-Stack prüfen: kommagetrennte Schriftnamen, ungequotet (Buchstaben,
 * Ziffern, Leerzeichen, . _ -) oder in Anführungszeichen.
 * @param {string} wert
 * @returns {string|null}  Fehlermeldung für das Feld, null = in Ordnung
 */
export function pruefeFontStack (wert) {
  const text = String(wert ?? '').trim()
  if (!text) return 'Bitte mindestens eine Schrift angeben.'
  if (!istSichererCssWert(text)) return 'Nicht erlaubt: { } ; < > \\ und Kommentare. Erlaubt sind Schriftnamen, durch Kommas getrennt.'
  const teile = text.split(',').map(s => s.trim())
  if (teile.some(t => !t)) return 'Leerer Eintrag zwischen zwei Kommas.'
  const falsch = teile.find(t => !NAME_UNGEQUOTET.test(t) && !NAME_GEQUOTET.test(t))
  if (falsch) return `„${falsch}“ ist kein gültiger Schriftname. Namen mit Sonderzeichen in Anführungszeichen setzen.`
  return null
}

const KOMMENTAR = /^\s*\/\*[\s\S]*?\*\/\s*$/
const IMPORT = /^@import url\("https:\/\/fonts\.googleapis\.com\/[^"\\\s<>]*"\);$/
const SELEKTOR = /^[A-Za-z0-9_.:#\-\s,()[\]=*>+~]+\{$/
const DEKLARATION = /^\s*(--[A-Za-z0-9_-]+)\s*:\s*(.*?);\s*$/

/** Genau ein Kommentar über die ganze Zeile, ohne Markup? */
function sichererKommentar (t) {
  return KOMMENTAR.test(t) && t.indexOf('*/') === t.length - 2 && t.lastIndexOf('/*') === 0 && !/[<>]/.test(t)
}

/** Kommentartext entschärfen (kein vorzeitiges Ende, kein Markup). */
function kommentar (text) {
  // eslint-disable-next-line no-control-regex -- Steuerzeichen entfernen
  return '/* ' + String(text).replace(/\*\//g, '* /').replace(/\/\*/g, '/ *').replace(/[<>\u0000-\u001f]/g, ' ') + ' */'
}

/**
 * CSS der App auf ihre eigene Grammatik beschränken. Was nicht passt,
 * entfällt; ungültige Deklarationen werden zu einem Kommentar.
 * Eingabe ist zeilenweise, wie exportAsCSSVars sie erzeugt.
 * @param {string} css
 * @returns {{ css: string, entfernt: string[] }}
 */
export function bereinigeCss (css) {
  const aus = []
  const entfernt = []
  let imBlock = false
  let blockVerworfen = false
  for (const roh of String(css ?? '').split('\n')) {
    const zeile = roh.replace(/\s+$/, '')
    const t = zeile.trim()
    if (!t) { aus.push(''); continue }
    if (!imBlock) {
      if (t.startsWith('/*')) {
        if (sichererKommentar(t)) aus.push(t)
        else { entfernt.push('Kommentar'); aus.push(kommentar(t.replace(/^\/\*|\*\/$/g, ''))) }
        continue
      }
      if (t.startsWith('@import')) {
        if (IMPORT.test(t)) aus.push(t); else entfernt.push('@import (nur fonts.googleapis.com)')
        continue
      }
      if (t.endsWith('{')) {
        imBlock = true
        blockVerworfen = !SELEKTOR.test(t)
        if (blockVerworfen) entfernt.push(`Block „${t.slice(0, 40)}“`); else aus.push(t)
        continue
      }
      entfernt.push(`Zeile „${t.slice(0, 40)}“`)
      continue
    }
    // im Block
    if (t === '}') { if (!blockVerworfen) aus.push('}'); imBlock = false; continue }
    if (blockVerworfen) continue
    if (t.startsWith('/*')) {
      if (sichererKommentar(t)) aus.push('  ' + t)
      else { entfernt.push('Kommentar'); aus.push('  ' + kommentar(t.replace(/^\/\*|\*\/$/g, ''))) }
      continue
    }
    const m = t.match(DEKLARATION)
    if (m && istSichererCssWert(m[2]) && m[2] !== '') { aus.push(`  ${m[1]}: ${m[2]};`); continue }
    entfernt.push(m ? m[1] : `Deklaration „${t.slice(0, 40)}“`)
    aus.push('  ' + kommentar(m ? `entfernt: ${m[1]} (ungültiger Wert)` : 'entfernt: Deklaration ohne eigene Eigenschaft'))
  }
  if (imBlock && !blockVerworfen) aus.push('}')
  return { css: aus.join('\n'), entfernt }
}

const SELEKTOR_TEXT = /^[A-Za-z0-9_.:#\-\s,()[\]=*>+~"']+$/
// eslint-disable-next-line no-control-regex -- Steuerzeichen sind genau das Ziel
const STEUERZEICHEN = /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/

/**
 * Strenge Prüfung (Server-Gegenstück: Vertrag::pruefeCss in Drupal,
 * Attrappe): unabhängig von der Schreibweise. Erlaubt sind nur Kommentare
 * (ohne < >), Import-Regeln für fonts.googleapis.com und Blöcke
 * „Selektor { --name: wert; … }“ — also nur eigene Eigenschaften, keine
 * Eigenschaft wie display, die die Seite verändert. Liefert die
 * Fundstellen, leer = in Ordnung.
 * @param {string} css
 * @returns {string[]}
 */
export function pruefeCss (css) {
  const fehler = []
  let s = String(css ?? '')
  const kommentare = s.match(/\/\*[\s\S]*?\*\//g) || []
  if (kommentare.some(k => /[<>]/.test(k))) fehler.push('Kommentar mit < oder >')
  s = s.replace(/\/\*[\s\S]*?\*\//g, ' ')
  if (s.includes('/*') || s.includes('*/')) fehler.push('Kommentar nicht geschlossen')
  if (STEUERZEICHEN.test(s)) fehler.push('Steuerzeichen')
  let i = 0
  while (i < s.length) {
    while (i < s.length && /\s/.test(s[i])) i++
    if (i >= s.length) break
    const rest = s.slice(i)
    if (rest.startsWith('@')) {
      const m = rest.match(/^@import\s+url\("https:\/\/fonts\.googleapis\.com\/[^"\\\s<>]*"\)\s*;/)
      if (!m) { fehler.push('@-Regel (erlaubt: @import von fonts.googleapis.com)'); break }
      i += m[0].length
      continue
    }
    const auf = rest.indexOf('{')
    if (auf < 0) { fehler.push(`Text außerhalb eines Blocks: „${rest.trim().slice(0, 40)}“`); break }
    const selektor = rest.slice(0, auf).trim()
    if (!selektor || !SELEKTOR_TEXT.test(selektor)) fehler.push(`Selektor „${selektor.slice(0, 40)}“`)
    const zu = rest.indexOf('}', auf)
    if (zu < 0) { fehler.push('Block nicht geschlossen'); break }
    const koerper = rest.slice(auf + 1, zu)
    if (koerper.includes('{')) fehler.push('verschachtelter Block')
    for (const teil of koerper.split(';')) {
      const d = teil.trim()
      if (!d) continue
      const m = d.match(/^(--[A-Za-z0-9_-]+)\s*:\s*([\s\S]+)$/)
      if (!m) fehler.push(`Deklaration „${d.slice(0, 40)}“ (nur eigene Eigenschaften --name)`)
      else if (/[<>\\{}]/.test(m[2])) fehler.push(`Wert von ${m[1]}`)
    }
    i += zu + 1
  }
  return fehler
}
