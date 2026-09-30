// ==========================================================================
// Strenger Leser fuer eine YAML-Teilmenge (nur fuer Tests, keine Abhaengigkeit)
// ==========================================================================
// Genug fuer docs/api/*.openapi.yaml: Block-Mappings und -Sequenzen,
// Sequenz-Eintraege als Mapping ("- a: b"), Block-Literale (|, |-),
// einfache Flow-Folgen [a, b], leere {} / [], Skalare in '…' / "…" / plain.
// Alles andere (Tabs, Anker, Kommentare hinter Werten, ": " in plain-Werten,
// unerwartete Einrueckung, doppelte Schluessel) wird als Fehler abgelehnt —
// lieber zu streng als eine kaputte Datei durchwinken. Abgeglichen mit
// PyYAML (safe_load) am 30.09.2026.
// ==========================================================================

export function leseYamlTeilmenge(text) {
  const zeilen = text.replace(/\r\n/g, '\n').split('\n')
  let i = 0
  const fehler = (msg) => { throw new Error(`YAML Zeile ${i + 1}: ${msg}`) }
  const istLeer = (s) => /^\s*(#.*)?$/.test(s)
  const einzug = (s) => s.match(/^ */)[0].length
  const weiter = () => { while (i < zeilen.length && istLeer(zeilen[i])) i++ }

  for (const [n, z] of zeilen.entries()) if (z.includes('\t')) { i = n; fehler('Tabulator') }

  function skalar(roh) {
    const t = roh.trim()
    if (t === '' || t === '~' || t === 'null') return null
    if (t.startsWith("'")) {
      if (!/^'(?:[^']|'')*'$/.test(t)) fehler(`Anfuehrung: ${t}`)
      return t.slice(1, -1).replace(/''/g, "'")
    }
    if (t.startsWith('"')) return JSON.parse(t)
    if (t === '{}') return {}
    if (t.startsWith('[')) {
      if (!t.endsWith(']')) fehler(`Flow-Folge: ${t}`)
      const innen = t.slice(1, -1).trim()
      return innen ? innen.split(',').map(skalar) : []
    }
    if (t === 'true') return true
    if (t === 'false') return false
    if (/^-?\d+(\.\d+)?$/.test(t)) return Number(t)
    if (/^[\]{}&*!|>%@`#]/.test(t)) fehler(`Indikator am Anfang: ${t}`)
    if (/: |:$/.test(t)) fehler(`": " in plain-Wert: ${t}`)
    if (/ #/.test(t)) fehler(`Kommentar hinter Wert: ${t}`)
    return t
  }

  function blockLiteral(elternEinzug, kopf) {
    const zeilenAus = []
    while (i < zeilen.length && (istLeer(zeilen[i]) || einzug(zeilen[i]) > elternEinzug)) {
      zeilenAus.push(zeilen[i]); i++
    }
    while (zeilenAus.length && zeilenAus[zeilenAus.length - 1].trim() === '') zeilenAus.pop()
    const min = Math.min(...zeilenAus.filter(z => z.trim()).map(einzug))
    const inhalt = zeilenAus.map(z => z.slice(min)).join('\n')
    return kopf === '|-' ? inhalt : inhalt + '\n'
  }

  const SCHLUESSEL = /^(?:'((?:[^']|'')*)'|"([^"]*)"|([^'"\s][^:]*?)):(?:\s+(.*))?$/

  function block(e) {
    weiter()
    if (i >= zeilen.length) return null
    return zeilen[i].slice(e).startsWith('-') ? sequenz(e) : mapping(e)
  }

  function mapping(e) {
    const obj = {}
    while (true) {
      weiter()
      if (i >= zeilen.length) break
      const z = zeilen[i], n = einzug(z)
      if (n < e) break
      if (n > e) fehler('unerwartete Einrueckung')
      const inhalt = z.slice(e)
      if (inhalt.startsWith('- ') || inhalt === '-') break
      const m = inhalt.match(SCHLUESSEL)
      if (!m) fehler(`kein Schluessel: ${inhalt}`)
      const key = m[1] !== undefined ? m[1].replace(/''/g, "'") : (m[2] ?? m[3])
      if (Object.prototype.hasOwnProperty.call(obj, key)) fehler(`doppelter Schluessel ${key}`)
      const rest = (m[4] ?? '').trim()
      i++
      if (rest === '|' || rest === '|-') obj[key] = blockLiteral(e, rest)
      else if (rest !== '') obj[key] = skalar(rest)
      else {
        weiter()
        if (i >= zeilen.length) { obj[key] = null; continue }
        const kn = einzug(zeilen[i])
        if (kn > e) obj[key] = block(kn)
        else if (kn === e && zeilen[i].slice(e).startsWith('- ')) obj[key] = sequenz(e)
        else obj[key] = null
      }
    }
    return obj
  }

  function sequenz(e) {
    const arr = []
    while (true) {
      weiter()
      if (i >= zeilen.length) break
      const z = zeilen[i], n = einzug(z)
      if (n < e) break
      if (n > e) fehler('unerwartete Einrueckung in Sequenz')
      const inhalt = z.slice(e)
      if (!(inhalt.startsWith('- ') || inhalt === '-')) break
      const wert = inhalt.slice(2)
      if (SCHLUESSEL.test(wert) && !/^['"[{]/.test(wert.trim()) || /^'[^']*':/.test(wert)) {
        zeilen[i] = ' '.repeat(e + 2) + wert
        arr.push(mapping(e + 2))
      } else {
        arr.push(skalar(wert)); i++
      }
    }
    return arr
  }

  const erg = block(0)
  weiter()
  if (i < zeilen.length) fehler('Rest nicht gelesen')
  return erg
}
