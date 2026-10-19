#!/usr/bin/env node
// ==========================================================================
// Website-Einsatz der Bauteile (Roadmap V02, 19.10.2026)
// ==========================================================================
// Beantwortet im Konfigurator die Frage „Wo wirkt eine Änderung an diesem
// Bauteil auf der Website?“. Quelle sind die Twig-Templates des
// Website-Themes neo_fe (DRUPAL11) und die Blocktypen aus config/sync —
// beides wird nur GELESEN.
//
// Für jedes Recipe (data/*-recipe.json) wird die Basisklasse (styling.
// baseClasses, sonst nc-<id>) als ganzes Wort in den Templates gesucht.
// Fundstellen werden in Orte übersetzt: Blocktyp (Bezeichnung aus
// block_content.type.*.yml), Seitenrahmen, Inhaltstyp, Navigation.
//
// GitHub-CI kennt DRUPAL11 nicht. Das Ergebnis wird deshalb als Datei
// committet und nur lokal neu erzeugt:
//
//   node scripts/website-einsatz.mjs [--neo-fe <pfad>] [--config <pfad>]
//
// Ausgabe: apps/theme-configurator/src/data/website-einsatz.generated.js
// ==========================================================================

import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from 'node:fs'
import { join, relative, basename, dirname } from 'node:path'
import { execFileSync } from 'node:child_process'
import { homedir } from 'node:os'
import { fileURLToPath } from 'node:url'

const WURZEL = join(dirname(fileURLToPath(import.meta.url)), '..')
const arg = (name, standard) => {
  const i = process.argv.indexOf(name)
  return i > 0 && process.argv[i + 1] ? process.argv[i + 1] : standard
}
const NEO_FE = arg('--neo-fe', join(homedir(), 'Sites/DRUPAL11/web/themes/custom/neo_fe'))
const CONFIG = arg('--config', join(homedir(), 'Sites/DRUPAL11/config/sync'))
const ZIEL = join(WURZEL, 'apps/theme-configurator/src/data/website-einsatz.generated.js')

if (!existsSync(NEO_FE)) {
  console.error(`neo_fe nicht gefunden: ${NEO_FE} (--neo-fe angeben)`)
  process.exit(1)
}

/** Alle Twig-Dateien unter templates/ und components/ */
function twigDateien (ordner) {
  const aus = []
  if (!existsSync(ordner)) return aus
  for (const name of readdirSync(ordner)) {
    const pfad = join(ordner, name)
    if (statSync(pfad).isDirectory()) aus.push(...twigDateien(pfad))
    else if (name.endsWith('.twig')) aus.push(pfad)
  }
  return aus
}
const DATEIEN = [...twigDateien(join(NEO_FE, 'templates')), ...twigDateien(join(NEO_FE, 'components'))]
  .map((pfad) => ({ pfad, rel: relative(NEO_FE, pfad), text: readFileSync(pfad, 'utf8') }))

/** Blocktypen: neo_hero → „Hero“ (Bezeichnung ohne „NEO “) */
const BLOCKTYPEN = {}
if (existsSync(CONFIG)) {
  for (const name of readdirSync(CONFIG)) {
    const m = name.match(/^block_content\.type\.(.+)\.yml$/)
    if (!m) continue
    const label = readFileSync(join(CONFIG, name), 'utf8').match(/^label:\s*'?(.*?)'?\s*$/m)?.[1]
    if (label) BLOCKTYPEN[m[1]] = label.replace(/^NEO\s+/, '')
  }
}

/** Längster Blocktyp, dessen Kennung den Namen anführt: neo-card-grid-cards → neo_card_grid */
function blocktypZu (name) {
  const kandidat = name.replace(/-/g, '_')
  return Object.keys(BLOCKTYPEN).filter((t) => kandidat === t || kandidat.startsWith(t + '_')).sort((a, b) => b.length - a.length)[0] || null
}

const gross = (s) => s.charAt(0).toUpperCase() + s.slice(1)

/** Datei → Ort { schluessel, ort } */
function ortFuer (rel) {
  const datei = basename(rel).replace(/\.html\.twig$|\.twig$/, '')
  let m = datei.match(/^block--(?:block-content|inline-block)--(.+)$/)
  if (m) {
    const typ = blocktypZu(m[1])
    if (typ) return { schluessel: `block:${typ}`, ort: `Block „${BLOCKTYPEN[typ]}“` }
  }
  if (rel.startsWith('templates/block/')) {
    const typ = blocktypZu(datei)
    if (typ) return { schluessel: `block:${typ}`, ort: `Block „${BLOCKTYPEN[typ]}“` }
  }
  if (rel.startsWith('components/')) {
    const komponente = rel.split('/')[1]
    const typ = blocktypZu(komponente)
    if (typ) return { schluessel: `block:${typ}`, ort: `Block „${BLOCKTYPEN[typ]}“` }
    return { schluessel: `baustein:${komponente}`, ort: `Website-Baustein „${komponente}“` }
  }
  if (datei === 'page') return { schluessel: 'seite', ort: 'Seitenrahmen (jede Seite)' }
  if (datei === 'node') return { schluessel: 'node', ort: 'Inhalte (Standardansicht)' }
  m = datei.match(/^node--([^-]+(?:-[^-]+)*?)--(full|teaser|card)$/)
  if (m) return { schluessel: `node:${m[1]}:${m[2]}`, ort: `Inhaltstyp „${gross(m[1])}“ (${m[2] === 'full' ? 'Vollansicht' : 'Anrisse'})` }
  if (rel.startsWith('templates/navigation/')) return { schluessel: `nav:${datei}`, ort: `Navigation (${datei})` }
  if (rel.startsWith('templates/layout')) return { schluessel: `layout:${datei}`, ort: `Layout „${datei}“` }
  return { schluessel: `datei:${rel}`, ort: `Template ${datei}` }
}

const alsKlasse = (s) => String(s || '').trim().replace(/^\./, '').split(/[\s.]/)[0]

/** Basisklassen eines Recipes */
function basisklassen (id, recipe) {
  const klassen = new Set()
  for (const k of recipe?.styling?.baseClasses || []) {
    const c = alsKlasse(k)
    if (/^[a-z][\w-]*$/.test(c)) klassen.add(c)
  }
  if (!klassen.size) klassen.add(`nc-${id}`)
  return [...klassen]
}

const wortRegex = (klasse) => new RegExp(`(?<![\\w-])${klasse.replace(/[-]/g, '\\-')}(?![\\w-])`)

const einsatz = {}
const rezepte = readdirSync(join(WURZEL, 'data')).filter((f) => f.endsWith('-recipe.json')).sort()
for (const datei of rezepte) {
  const id = datei.slice(0, -'-recipe.json'.length)
  let recipe = null
  try { recipe = JSON.parse(readFileSync(join(WURZEL, 'data', datei), 'utf8')) } catch { continue }
  const muster = basisklassen(id, recipe).map(wortRegex)
  const orte = new Map()
  for (const d of DATEIEN) {
    if (!muster.some((re) => re.test(d.text))) continue
    const o = ortFuer(d.rel)
    if (!orte.has(o.schluessel)) orte.set(o.schluessel, { ort: o.ort, dateien: [] })
    orte.get(o.schluessel).dateien.push(d.rel)
  }
  if (orte.size) {
    einsatz[id] = [...orte.values()]
      .map((o) => ({ ort: o.ort, dateien: o.dateien.sort() }))
      .sort((a, b) => a.ort.localeCompare(b.ort, 'de'))
  }
}

let stand = ''
try { stand = execFileSync('git', ['-C', NEO_FE, 'log', '-1', '--format=%h %cs'], { encoding: 'utf8' }).trim() } catch {}

const kopf = `// AUTO-GENERATED by scripts/website-einsatz.mjs — DO NOT EDIT DIRECTLY.
// Quelle: Twig-Templates von neo_fe (${stand || 'Stand unbekannt'}) und Blocktypen aus DRUPAL11 config/sync.
// Neu erzeugen: node scripts/website-einsatz.mjs (nur lokal, GitHub-CI kennt DRUPAL11 nicht).
`
const inhalt = `${kopf}
/** Stand der Quelle (neo_fe-Commit und Datum) */
export const WEBSITE_EINSATZ_STAND = ${JSON.stringify(stand)}

/**
 * Bauteil-ID (Recipe) → Orte auf der Website, an denen ein Template die
 * Basisklasse verwendet.
 * @type {Record<string, Array<{ ort: string, dateien: string[] }>>}
 */
export const WEBSITE_EINSATZ = ${JSON.stringify(einsatz, null, 2)}
`
writeFileSync(ZIEL, inhalt)
console.log(`Website-Einsatz: ${Object.keys(einsatz).length} von ${rezepte.length} Bauteilen auf der Website gefunden (${DATEIEN.length} Templates, ${Object.keys(BLOCKTYPEN).length} Blocktypen) → ${relative(WURZEL, ZIEL)}`)
