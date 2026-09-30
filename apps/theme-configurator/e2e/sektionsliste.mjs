// Gibt die Sektions-IDs der Navigation samt Hash-Pfad als JSON aus (fuer e2e/hilfen.js).
// Eigener Prozess: navigation-builder.js importiert JSON ohne Import-
// Attribut; Vites runnerImport loest das wie im Build auf — innerhalb des
// Playwright-Loaders klappt das nicht, deshalb hier getrennt.
import { runnerImport } from 'vite'

const lade = (datei) =>
  runnerImport(new URL(datei, import.meta.url).pathname, { configFile: false, logLevel: 'silent' }).then((r) => r.module)

const ids = await lade('../src/navigation/sektions-ids.js')
// Der Hash-Router importiert ebenfalls sektions-ids.js — auch er nur hier
const router = await lade('../src/navigation/hash-router.js')

process.stdout.write(JSON.stringify({
  start: ids.START_SEKTION,
  sektionen: ids.NAVIGATIONS_SEKTIONEN.map((id) => ({ id, pfad: router.sektionZuPfad(id) })),
}))
