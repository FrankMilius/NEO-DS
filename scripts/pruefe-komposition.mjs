#!/usr/bin/env node
// ==========================================================================
// Komposition der Recipes pruefen (Plan v3, Phase 1)
// ==========================================================================
// Ein Bauteil, das aus anderen besteht, erklaert das im Recipe-Feld
// `komposition` (data/recipe-schema.json):
//
//   { "art": "enthaelt", "recipe": "input", "element": ".nc-search__input",
//     "tokens": { "nc-search-input-height": "nc-input-height-md" } }
//   { "art": "teilt",    "recipe": "input", "tokenPraefix": "nc-input-" }
//
// Geprueft wird, dass die Kette haelt:
//   enthaelt  Das Markup (data/markup/<id>.html) traegt die Wurzelklasse des
//             anderen Recipes — mit `element` genau an diesem Element.
//   teilt     Das SCSS des Bauteils nutzt Tokens mit `tokenPraefix`.
//   tokens    Das eigene Token zeigt im Standard per var() auf das andere.
//
// Umgekehrt: Findet das Skript im Markup ein anderes Recipe, das nicht
// erklaert ist, meldet es das als Hinweis (mit --streng als Fehler).
//
//   node scripts/pruefe-komposition.mjs              pruefen (Exit 1 bei Fehler)
//   node scripts/pruefe-komposition.mjs --streng     auch Hinweise sind Fehler
//   node scripts/pruefe-komposition.mjs --eintragen  gefundene `enthaelt` in
//                                                    die Recipes schreiben
//   node scripts/pruefe-komposition.mjs --json       Ergebnis als JSON
// ==========================================================================
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const WURZEL = join(dirname(fileURLToPath(import.meta.url)), '..')
const DATA = join(WURZEL, 'data')
const TOKENS_SCSS = join(WURZEL, 'scss/scss/00-settings/_component-tokens.scss')

// Fundstellen im geernteten Markup, die keine Komposition sind.
export const AUSNAHMEN = {
  'textarea>data-table': 'Ernte von der Data-Table-Seite: die Textarea steht dort in einer Tabelle',
  'tabs>tooltip': 'Ernte enthaelt die Tooltip-Huelle der Doku; die Vorlage laesst sie weg',
  'tab-nav>solution-tabs': 'Tab-Nav ist Teil von Solution-Tabs, nicht umgekehrt',
  'tab-nav>bento-grid': 'Ernte aus Solution-Tabs; gehoert dort hin',
  'tab-nav>expanding-panels': 'Ernte aus Solution-Tabs; gehoert dort hin',
  'navigation-orchestration>navigation': 'Orchestrierung beschreibt das Zusammenspiel, kein eigenes Markup'
}

const lies = (p) => JSON.parse(readFileSync(p, 'utf8'))

export function ladeRecipes () {
  const recipes = {}
  for (const f of readdirSync(DATA).filter((f) => f.endsWith('-recipe.json'))) {
    recipes[f.slice(0, -12)] = { datei: join(DATA, f), daten: lies(join(DATA, f)) }
  }
  return recipes
}

export function wurzelKlasse (recipe) {
  const el = recipe?.anatomy?.root?.element || ''
  const m = /^\.([a-z0-9-]+)$/.exec(el.trim())
  return m ? m[1] : null
}

function markupKlassen (id) {
  const p = join(DATA, 'markup', id + '.html')
  if (!existsSync(p)) return null
  const html = readFileSync(p, 'utf8')
  return [...html.matchAll(/class="([^"]*)"/g)].map((m) => m[1].split(/\s+/).filter(Boolean))
}

function tokenWerte () {
  const werte = {}
  for (const m of readFileSync(TOKENS_SCSS, 'utf8').matchAll(/^\s*--([a-z0-9-]+)\s*:\s*([^;]+);/gm)) {
    if (!(m[1] in werte)) werte[m[1]] = m[2].trim()
  }
  return werte
}

function scssDateien (id) {
  const reg = lies(join(DATA, 'component-registry.json'))
  for (const gruppe of ['components', 'objects', 'templates', 'utilities']) {
    const e = reg[gruppe]?.[id]
    if (e?.paths?.scss?.length) return e.paths.scss.map((p) => join(WURZEL, p))
  }
  return []
}

/** Im Markup gefundene andere Recipes je Recipe-ID. */
export function gefundeneKompositionen (recipes) {
  const wurzeln = {}
  for (const [id, r] of Object.entries(recipes)) {
    const k = wurzelKlasse(r.daten)
    if (k) wurzeln[k] = id
  }
  const gefunden = {}
  for (const id of Object.keys(recipes)) {
    const klassen = markupKlassen(id)
    if (!klassen) continue
    const kinder = new Set()
    for (const liste of klassen) for (const k of liste) if (wurzeln[k] && wurzeln[k] !== id) kinder.add(wurzeln[k])
    const echte = [...kinder].filter((k) => !AUSNAHMEN[`${id}>${k}`]).sort()
    if (echte.length) gefunden[id] = echte
  }
  return gefunden
}

export function pruefe () {
  const recipes = ladeRecipes()
  const werte = tokenWerte()
  const fehler = []
  const hinweise = []
  let erklaert = 0
  for (const [id, r] of Object.entries(recipes)) {
    const liste = r.daten.komposition
    if (liste === undefined) continue
    if (!Array.isArray(liste)) { fehler.push(`${id}: komposition ist keine Liste`); continue }
    for (const k of liste) {
      erklaert++
      const ort = `${id} → ${k.recipe} (${k.art})`
      const anderes = recipes[k.recipe]
      if (!anderes) { fehler.push(`${ort}: Recipe ${k.recipe} gibt es nicht`); continue }
      if (k.recipe === id) { fehler.push(`${ort}: verweist auf sich selbst`); continue }
      if (k.art === 'enthaelt') {
        const klasse = wurzelKlasse(anderes.daten)
        const klassen = markupKlassen(id)
        if (!klasse) fehler.push(`${ort}: ${k.recipe} hat keine Wurzelklasse in anatomy.root.element`)
        else if (!klassen) fehler.push(`${ort}: data/markup/${id}.html fehlt`)
        else if (k.element) {
          const el = k.element.replace(/^\./, '')
          const treffer = klassen.filter((l) => l.includes(el))
          if (!treffer.length) fehler.push(`${ort}: ${k.element} steht nicht im Markup`)
          else if (!treffer.every((l) => l.includes(klasse))) fehler.push(`${ort}: ${k.element} traegt nicht die Klasse ${klasse}`)
        } else if (!klassen.some((l) => l.includes(klasse))) fehler.push(`${ort}: Klasse ${klasse} fehlt im Markup`)
      } else if (k.art === 'teilt') {
        if (!k.tokenPraefix) fehler.push(`${ort}: tokenPraefix fehlt`)
        else {
          const scss = scssDateien(id).filter(existsSync).map((p) => readFileSync(p, 'utf8')).join('\n')
          if (!scss.includes(`var(--${k.tokenPraefix}`)) fehler.push(`${ort}: SCSS nutzt keine --${k.tokenPraefix}*-Tokens`)
        }
      } else fehler.push(`${ort}: unbekannte art`)
      for (const [eigen, quelle] of Object.entries(k.tokens || {})) {
        if (!(eigen in werte)) fehler.push(`${ort}: Token --${eigen} gibt es nicht`)
        else if (!(quelle in werte)) fehler.push(`${ort}: Token --${quelle} gibt es nicht`)
        else if (!werte[eigen].includes(`var(--${quelle}`)) fehler.push(`${ort}: --${eigen} zeigt nicht auf --${quelle} (Wert: ${werte[eigen]})`)
      }
    }
  }
  const gefunden = gefundeneKompositionen(recipes)
  for (const [id, kinder] of Object.entries(gefunden)) {
    const bekannt = new Set((recipes[id].daten.komposition || []).map((k) => k.recipe))
    for (const kind of kinder) if (!bekannt.has(kind)) hinweise.push(`${id} enthaelt ${kind} (im Markup), aber komposition erklaert es nicht`)
  }
  return { fehler, hinweise, erklaert, gefunden }
}

/** Schreibt fehlende `enthaelt`-Eintraege in die Recipes (Text einfuegen, Format bleibt). */
export function eintragen () {
  const recipes = ladeRecipes()
  const gefunden = gefundeneKompositionen(recipes)
  const geaendert = []
  for (const [id, kinder] of Object.entries(gefunden)) {
    const r = recipes[id]
    const vorhanden = r.daten.komposition || []
    const neu = kinder.filter((k) => !vorhanden.some((v) => v.recipe === k)).map((k) => ({ art: 'enthaelt', recipe: k }))
    if (!neu.length) continue
    let text = readFileSync(r.datei, 'utf8')
    if (r.daten.komposition) {
      const daten = JSON.parse(text)
      daten.komposition = [...vorhanden, ...neu]
      text = JSON.stringify(daten, null, 2) + '\n'
    } else {
      const zeilen = neu.map((n) => `    { "art": "enthaelt", "recipe": "${n.recipe}" }`).join(',\n')
      const block = `  "komposition": [\n${zeilen}\n  ],\n`
      const i = text.search(/\n {2}"specimens"\s*:/)
      if (i >= 0) text = text.slice(0, i + 1) + block + text.slice(i + 1)
      else text = text.replace(/\n}\s*$/, `,\n${block.replace(/,\n$/, '\n')}}\n`)
    }
    JSON.parse(text)
    writeFileSync(r.datei, text)
    geaendert.push(`${id}: ${neu.map((n) => n.recipe).join(', ')}`)
  }
  return geaendert
}

const istHaupt = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]
if (istHaupt) {
  if (process.argv.includes('--eintragen')) {
    const g = eintragen()
    console.log(g.length ? g.map((z) => '  + ' + z).join('\n') : '  nichts einzutragen')
    process.exit(0)
  }
  const e = pruefe()
  if (process.argv.includes('--json')) { console.log(JSON.stringify(e, null, 2)); process.exit(e.fehler.length ? 1 : 0) }
  for (const f of e.fehler) console.error('  ✗ ' + f)
  for (const h of e.hinweise) console.log('  · ' + h)
  const streng = process.argv.includes('--streng')
  const kaputt = e.fehler.length || (streng && e.hinweise.length)
  console.log(`  ${kaputt ? '✗' : '✓'} Komposition: ${e.erklaert} Beziehungen erklaert, ${e.fehler.length} Fehler, ${e.hinweise.length} Hinweise`)
  process.exit(kaputt ? 1 : 0)
}
