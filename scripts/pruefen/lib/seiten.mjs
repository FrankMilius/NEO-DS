// Seitenliste der Prüfwerkzeuge (E3, 21.10.2026).
// Frisch aus der DDEV-Datenbank (path_alias), damit neue Seiten automatisch
// mitgeprüft werden; Formular- und Testseiten fallen über die Muster
// `seitenAusschluss` der Einstellungen heraus (Entscheidung Frank 21.10.2026),
// die Seite /form/contact selbst bleibt drin.
// Eine feste Liste (--seiten <datei>) wird unverändert übernommen.
import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'

export const SQL = "SELECT alias FROM path_alias WHERE status=1 AND langcode IN ('de','und')"

const zeilen = (t) => t.split('\n').map((z) => z.trim()).filter(Boolean)

/** Entfernt Pfade, auf die eines der Muster passt; Ergebnis sortiert, ohne Dubletten. */
export function filtere (liste, ausschluss) {
  const muster = ausschluss.map((m) => new RegExp(m))
  return [...new Set(liste)].filter((s) => !muster.some((m) => m.test(s))).sort()
}

const ausfuehrenStandard = (befehl, argumente, opt) => execFileSync(befehl, argumente, { ...opt, encoding: 'utf8' })

/** Seitenpfade aus Datei oder DDEV-Datenbank. */
export function seiten (einst, { datei, ausfuehren = ausfuehrenStandard } = {}) {
  if (datei) return zeilen(readFileSync(datei, 'utf8'))
  const text = ausfuehren('ddev', ['drush', 'sqlq', SQL], { cwd: einst.drupalWurzel })
  // Die Startseite hat keinen Alias und fehlte sonst in der Liste
  return filtere(['/', ...zeilen(text)], einst.seitenAusschluss)
}
