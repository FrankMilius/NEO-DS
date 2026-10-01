#!/usr/bin/env node
// ==========================================================================
// Prüfwerkzeug: Kunden-Themes gegen einen (neuen) NEO-Standard prüfen
// (Plan v2, 2.6 — ADR-002, Folge 3)
// ==========================================================================
// Kunden-Themes speichern nur Abweichungen vom NEO-Standard; ein neuer
// Standard wirkt automatisch auf alle (Entscheidung Frage 9b). Bevor ein
// neuer Standard ausgerollt wird, prüft dieses Werkzeug jedes Kunden-Theme:
// Standard + Abweichungen zusammenführen, Kontrast-Tor (data/kontrast-paare.json)
// für das ausgelieferte Theme-Set rechnen, Befunde ausgeben.
//
// Aufruf:
//   node scripts/pruefe-kunden-themes.mjs [--standard <datei>] [--json] <datei|ordner> …
//
//   --standard  Standard-Datei im Format von neo-theme-defaults.json
//               (Vorgabe: data/neo-theme-defaults/neo-theme-defaults.json)
//   --json      Ergebnis als JSON statt Text
//   Eingaben    *.json-Dateien oder Ordner (nicht rekursiv) mit Abweichungen —
//               entweder der Export GET /themes/{id}/export?format=abweichungen
//               ({ meta, abweichungen, … }) oder die blanken Abweichungen.
//
// Exit-Code: 0 = alle bestanden, 1 = mindestens ein Befund, 2 = Aufruf-/Lesefehler.
// ==========================================================================

import { readFileSync, readdirSync, statSync } from 'node:fs'
import { basename, dirname, join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { zusammenfuehren } from '../apps/theme-configurator/src/speicher/abweichungen.js'
import { standardDaten, standardVersion } from '../apps/theme-configurator/src/speicher/standard.js'
import { pruefeKontrast } from '../apps/theme-configurator/src/speicher/kontrast.js'

const WURZEL = resolve(dirname(fileURLToPath(import.meta.url)), '..')
export const STANDARD_VORGABE = join(WURZEL, 'data/neo-theme-defaults/neo-theme-defaults.json')

/**
 * Kern ohne Dateisystem (auch für Tests).
 * @param {object} standardDatei  Inhalt der Standard-Datei
 * @param {Array<{ name: string, inhalt: object }>} themes
 * @returns {{ standardVersion: string|null, bestanden: boolean, themes: Array<{ name, set, bestanden, befunde }> }}
 */
export function pruefeKundenThemes(standardDatei, themes) {
  const standard = standardDaten(standardDatei)
  const ergebnisse = themes.map(({ name, inhalt }) => {
    const abweichungen = inhalt?.abweichungen ?? inhalt ?? {}
    const daten = zusammenfuehren(standard, abweichungen)
    const set = daten.activeThemeSet || 'customer'
    const kontrast = pruefeKontrast(daten.themes?.[set])
    const befunde = kontrast.ergebnisse.filter(e => e.bestanden !== true)
    if (!kontrast.ergebnisse.length) befunde.push({ modus: '-', vordergrund: '-', hintergrund: '-', verhaeltnis: null, mindestens: null, bestanden: null })
    return { name: inhalt?.meta?.name || name, set, bestanden: kontrast.bestanden, befunde }
  })
  return { standardVersion: standardVersion(standardDatei), bestanden: ergebnisse.every(e => e.bestanden), themes: ergebnisse }
}

const zahl = (n) => (n === null || n === undefined ? '–' : String(n).replace('.', ','))
const MODUS = { light: 'hell', dark: 'dunkel' }

export function alsText(erg) {
  const zeilen = [`NEO-Standard ${erg.standardVersion ?? '(ohne Version)'} — ${erg.themes.length} Kunden-Theme(s)`]
  for (const t of erg.themes) {
    zeilen.push(`${t.bestanden ? '✓' : '✗'} ${t.name} (Set ${t.set}): ${t.bestanden ? 'bestanden' : `${t.befunde.length} Befund(e)`}`)
    for (const b of t.befunde) {
      zeilen.push(b.vordergrund === '-'
        ? '    keine bewertbaren Farbpaare'
        : `    ${MODUS[b.modus] || b.modus}: ${b.vordergrund} auf ${b.hintergrund} ${zahl(b.verhaeltnis)}:1 (mind. ${zahl(b.mindestens)}:1)`)
    }
  }
  zeilen.push(erg.bestanden ? 'Ergebnis: alle bestanden.' : 'Ergebnis: Befunde — Standard nicht ausrollen, bevor sie geklärt sind.')
  return zeilen.join('\n')
}

function leseEingaben(pfade) {
  const dateien = []
  for (const p of pfade) {
    const abs = resolve(p)
    if (statSync(abs).isDirectory()) {
      for (const f of readdirSync(abs).filter(f => f.endsWith('.json')).sort()) dateien.push(join(abs, f))
    } else dateien.push(abs)
  }
  return dateien.map(d => ({ name: basename(d).replace(/(\.abweichungen)?\.json$/, ''), inhalt: JSON.parse(readFileSync(d, 'utf8')) }))
}

function main(argv) {
  let standardPfad = STANDARD_VORGABE, json = false
  const eingaben = []
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--standard') standardPfad = argv[++i]
    else if (argv[i] === '--json') json = true
    else if (argv[i] === '--hilfe' || argv[i] === '-h') { console.log('node scripts/pruefe-kunden-themes.mjs [--standard <datei>] [--json] <datei|ordner> …'); return 0 }
    else eingaben.push(argv[i])
  }
  if (!standardPfad || !eingaben.length) {
    console.error('Aufruf: node scripts/pruefe-kunden-themes.mjs [--standard <datei>] [--json] <datei|ordner> …')
    return 2
  }
  let erg
  try {
    const themes = leseEingaben(eingaben)
    if (!themes.length) { console.error('Keine Kunden-Themes gefunden.'); return 2 }
    erg = pruefeKundenThemes(JSON.parse(readFileSync(resolve(standardPfad), 'utf8')), themes)
  } catch (e) {
    console.error(`Fehler: ${e.message}`)
    return 2
  }
  console.log(json ? JSON.stringify(erg, null, 2) : alsText(erg))
  return erg.bestanden ? 0 : 1
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  process.exitCode = main(process.argv.slice(2))
}
