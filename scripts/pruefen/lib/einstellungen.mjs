// Einstellungen der Prüfwerkzeuge (E3, 21.10.2026).
// Pfade zu DRUPAL11, Modul und Theme, DDEV-Adresse sowie Docker-Abbild und
// -Volumes stehen in scripts/pruefen/einstellungen.json — nicht im Code.
// einstellungen.lokal.json daneben (nicht versioniert) überschreibt feldweise.
import { existsSync, readFileSync } from 'node:fs'
import { homedir } from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

export const ORDNER = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

export const PFLICHT = [
  'drupalWurzel', 'modulPfad', 'themePfad', 'ddevUrl', 'e2eKonto', 'cssRoute',
  'dockerAbbild', 'dockerEinhaengen', 'dockerVolumes', 'breiten', 'seitenAusschluss',
]

// dockerEinhaengen: Ordner, der im Container unter demselben Pfad liegt; der
// Worktree muss darin stehen (bisheriger Aufruf hing ganz ~/Sites ein)
const PFADE = ['drupalWurzel', 'modulPfad', 'themePfad', 'dockerEinhaengen']

function lies (datei) {
  return existsSync(datei) ? JSON.parse(readFileSync(datei, 'utf8')) : {}
}

function aufloesen (p) {
  return p === '~' || p.startsWith('~/') ? path.join(homedir(), p.slice(2)) : p
}

/** Zusammengeführte Einstellungen; wirft, wenn ein Pflichtfeld fehlt. */
export function lade ({ ordner = ORDNER } = {}) {
  const e = { ...lies(path.join(ordner, 'einstellungen.json')), ...lies(path.join(ordner, 'einstellungen.lokal.json')) }
  delete e._hinweis
  const fehlt = PFLICHT.filter((f) => e[f] === undefined)
  if (fehlt.length) throw new Error(`Einstellungen in ${ordner}: es fehlt ${fehlt.join(', ')}`)
  for (const f of PFADE) e[f] = aufloesen(e[f])
  return e
}
