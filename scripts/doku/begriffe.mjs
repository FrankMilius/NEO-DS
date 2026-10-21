#!/usr/bin/env node
// ==========================================================================
// doku:begriffe — neue Oberflächentexte gegen BEGRIFFE.md prüfen (E7)
//
//   npm run doku:begriffe                 Änderungen gegen main
//        [-- --basis main] [--json]
//
// Je geänderter Datei der Konfig-App (apps/theme-configurator/src, .vue und
// .js; ohne Tests, *.generated.* und arena-templates — das sind Beispieltexte
// der Website) werden die sichtbaren Texte im alten und im neuen Stand
// ausgelesen (lib/texte.mjs, Vue-Compiler und Babel). Geprüft werden nur die
// Texte, die neu dazukommen. Alt = gemeinsamer Vorgänger mit der Basis, neu =
// Arbeitsstand samt nicht committeter und noch nicht aufgenommener Dateien.
//
// Hinweise (kein Urteil — eingeordnet wird vom Agenten „doku“ bzw. von Frank):
//   ersetzt   Wort aus der Spalte „Ersetzt“ (am Wortanfang, ohne Rücksicht auf
//             Groß-/Kleinschreibung: auch Plural und Bindestrich-Wörter);
//             erlaubte Wendungen aus „Neu“ zählen nicht
//   anrede    Du-Anrede statt „Sie“ (Regel 1)
//   umlaut    ae/oe/ue/ss statt Umlaut — nur bekannte Wortstämme (Regel 2)
//
// Ausgang: 0 keine Hinweise · 1 Hinweise · 2 Aufruf, Basis oder Ablauf falsch.
// ==========================================================================
import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync, realpathSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseArgs } from 'node:util'
import { texte } from './lib/texte.mjs'

const WURZEL = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const BEGRIFFE = 'apps/theme-configurator/BEGRIFFE.md'
const QUELLEN = /^apps\/theme-configurator\/src\/.*\.(vue|js)$/
const AUSGENOMMEN = /\.test\.|\/tests?\/|\.generated\.|\/arena-templates\//

/** Tabellenzeilen mit Spalte „Ersetzt“: [ersteSpalte, ersetzt] */
function zeilen (md) {
  const aus = []
  let spalte = -1
  for (const zeile of md.split('\n')) {
    if (!zeile.startsWith('|')) { spalte = -1; continue }
    const zellen = zeile.split('|').slice(1, -1).map((z) => z.trim())
    const i = zellen.indexOf('Ersetzt')
    if (i >= 0) { spalte = i; continue }
    if (spalte < 0 || /^-+$/.test(zellen[0] ?? '')) continue
    aus.push([zellen[0] ?? '', zellen[spalte] ?? ''])
  }
  return aus
}

/** „Ersetzt“-Begriffe: Teile durch , oder ; getrennt, Zitate „…“ als eigene Begriffe, ohne Erläuterungen. */
export function ersetzteBegriffe (md) {
  const begriffe = new Set()
  for (const [, ersetzt] of zeilen(md)) {
    for (const m of ersetzt.matchAll(/„([^“]+)“/g)) begriffe.add(m[1].trim())
    const ohne = ersetzt.replace(/„[^“]*“[^,;]*/g, '').replace(/\([^)]*\)/g, '')
    for (const teil of ohne.split(/[,;]/)) {
      const t = teil.trim()
      if (t && t !== '–' && t.split(/\s+/).length <= 5) begriffe.add(t)
    }
  }
  return [...begriffe].sort((a, b) => b.length - a.length)
}

/** Erlaubte Wendungen: erste Spalte (Neu/Begriff) samt Zitaten darin und Teilen mit „ · “. */
export function erlaubteWendungen (md) {
  const w = new Set()
  for (const [neu] of zeilen(md)) {
    for (const m of neu.matchAll(/„([^“]+)“/g)) w.add(m[1].trim())
    for (const teil of neu.replace(/\*/g, '').replace(/\([^)]*\)/g, '').split(/ · |[,;:]/)) {
      const t = teil.trim()
      if (t && t.length > 2) w.add(t)
    }
  }
  return [...w].sort((a, b) => b.length - a.length)
}

const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
const KEIN_BUCHSTABE = '[^\\p{L}\\p{N}]'
const DU_VERBEN = 'wähle|klicke|gib|öffne|speichere|lösche|gehe|prüfe|trage|lege|füge|nutze|schau|sieh|entferne|setze|aktiviere|starte|ziehe|ändere|bestätige|teste|probiere|achte|beachte|lies|schreibe|kopiere|suche|melde'
const DU = new RegExp(`(?:^|${KEIN_BUCHSTABE})(du|dein(?:e[mnrs]?)?|dir|dich)(?=${KEIN_BUCHSTABE}|$)|(?:^|[.!?:—–]\\s*|bitte\\s+|dann\\s+|zuerst\\s+)(${DU_VERBEN})(?=${KEIN_BUCHSTABE}|$)`, 'iu')
const UMLAUT = /(?:^|[^\p{L}])(\p{L}*(?:fuer|ueber|aender|waehl|koenn|muess|groess|loesch|oeffn|zurueck|naechst|hinzufueg|schliess|hoeh|veraender|gueltig|pruef|schluessel|toen|spaet|frueh|haeuf|staerk|schwaech|zaehl|aehnlich|ausfuehr|einfueg|uebersicht|ueberschr|strass|ausser|massstab|gruess|bestaet|moecht|fuehr|gefaehr|laeng|kuerz|waerm|aeusser|gemaess)\p{L}*)/iu

/**
 * Hinweise für neue Texte.
 * @param {{ datei: string, zeile: number, text: string }[]} neu
 * @param {string[]} begriffe  längste zuerst
 * @param {string[]} erlaubt   längste zuerst
 */
export function pruefe (neu, begriffe, erlaubt = []) {
  const hinweise = []
  const wortRe = (w, f) => new RegExp(`(?<![\\p{L}\\p{N}])${esc(w)}(?![\\p{L}\\p{N}])`, f)
  const erlaubtRe = erlaubt.map((w) => [w, wortRe(w, 'giu')])
  const begriffRe = begriffe.map((b) => [b, new RegExp(`(?<![\\p{L}\\p{N}])${esc(b)}`, 'giu')])
  for (const z of neu) {
    // erlaubte Stellen (ganze Wörter) als Bereiche — sie heben nur Treffer auf,
    // die sie ganz umschließen UND länger sind („Weitere Aktionen“ ⊃ „Weitere“,
    // aber „Theme“ hebt „NEO Theme“ nicht auf)
    const bereiche = []
    for (const [w, re] of erlaubtRe) for (const m of z.text.matchAll(re)) bereiche.push([m.index, m.index + m[0].length, w.length])
    const belegt = []
    for (const [b, re] of begriffRe) {
      for (const m of z.text.matchAll(re)) {
        const von = m.index; const bis = von + m[0].length
        if (bereiche.some(([a, e, l]) => a <= von && bis <= e && l > m[0].length)) continue
        if (belegt.some(([a, e]) => von < e && a < bis)) continue   // längster Begriff zuerst: „Border Radius“ ohne „Border“
        belegt.push([von, bis])
        hinweise.push({ ...z, art: 'ersetzt', begriff: b })
        break
      }
    }
    const du = z.text.match(DU)
    if (du) hinweise.push({ ...z, art: 'anrede', begriff: (du[1] ?? du[2]).trim() })
    const u = z.text.match(UMLAUT)
    if (u) hinweise.push({ ...z, art: 'umlaut', begriff: u[1] })
  }
  return hinweise
}

/** Neue Texte: was im neuen Stand vorkommt, im alten (je Datei) nicht, mit Vielfachheit. */
export function neueTexte (datei, alt, neu) {
  const vorher = new Map()
  for (const t of texte(datei, alt)) vorher.set(t.text, (vorher.get(t.text) ?? 0) + 1)
  const aus = []
  const gesehen = new Set()
  for (const t of texte(datei, neu)) {
    const n = vorher.get(t.text) ?? 0
    if (n > 0) { vorher.set(t.text, n - 1); continue }
    const k = `${t.zeile}\u0000${t.text}`
    if (gesehen.has(k)) continue
    gesehen.add(k)
    aus.push({ datei, zeile: t.zeile, text: t.text })
  }
  return aus
}

export function relevanteDatei (p) {
  return QUELLEN.test(p) && !AUSGENOMMEN.test(p)
}

function main () {
  let a
  try { ({ values: a } = parseArgs({ options: { basis: { type: 'string', default: 'main' }, json: { type: 'boolean', default: false } } })) } catch (f) { console.error(`Aufruf: ${f.message}`); return 2 }
  const git = (...args) => execFileSync('git', ['-C', WURZEL, '-c', 'core.quotePath=false', ...args], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, stdio: ['ignore', 'pipe', 'pipe'] })
  let mb
  try {
    const sha = git('rev-parse', '--verify', '--quiet', '--end-of-options', `${a.basis}^{commit}`).trim()
    mb = git('merge-base', sha, 'HEAD').trim()
  } catch { console.error(`Basis „${a.basis}“ gibt es nicht oder hat keinen gemeinsamen Vorgänger mit HEAD.`); return 2 }
  const geaendert = new Set([
    ...git('diff', '--name-only', '-z', '--no-renames', mb, '--', 'apps/theme-configurator/src').split('\0'),
    ...git('ls-files', '--others', '--exclude-standard', '-z', '--', 'apps/theme-configurator/src').split('\0'),
  ].filter((p) => p && relevanteDatei(p)))
  const neu = []
  for (const p of [...geaendert].sort()) {
    let alt = ''
    try { alt = git('show', `${mb}:${p}`) } catch { /* neue Datei */ }
    const jetzt = existsSync(path.join(WURZEL, p)) ? readFileSync(path.join(WURZEL, p), 'utf8') : ''
    neu.push(...neueTexte(p, alt, jetzt))
  }
  const md = readFileSync(path.join(WURZEL, BEGRIFFE), 'utf8')
  const hinweise = pruefe(neu, ersetzteBegriffe(md), erlaubteWendungen(md))
  if (a.json) { console.log(JSON.stringify({ basis: a.basis, mergeBase: mb, dateien: [...geaendert], neueTexte: neu.length, hinweise }, null, 2)); return hinweise.length ? 1 : 0 }
  console.log(`BEGRIFFE.md-Prüfung · ${geaendert.size} geänderte Datei(en), ${neu.length} neue Texte gegen ${a.basis} (${mb.slice(0, 8)})`)
  for (const h of hinweise) console.log(`  ${h.art.padEnd(8)} ${h.datei}:${h.zeile}  „${h.begriff}“ in „${h.text.slice(0, 90)}“`)
  console.log(hinweise.length ? `${hinweise.length} Hinweis(e) — einordnen: Verstoß, im Zusammenhang richtig oder neuer Begriff für BEGRIFFE.md.` : '✓ keine Hinweise')
  return hinweise.length ? 1 : 0
}

const direktGestartet = (() => { try { return realpathSync(fileURLToPath(import.meta.url)) === realpathSync(process.argv[1]) } catch { return false } })()
if (direktGestartet) {
  let ausgang
  try { ausgang = main() } catch (f) { console.error(`Ablauf gescheitert: ${f.message}`); ausgang = 2 }
  process.exit(ausgang)
}
