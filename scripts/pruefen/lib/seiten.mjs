// Seitenliste der Prüfwerkzeuge (E3, 21.10.2026).
// Frisch aus der DDEV-Datenbank (path_alias), damit neue Seiten automatisch
// mitgeprüft werden; Formular- und Testseiten fallen über die Muster
// `seitenAusschluss` der Einstellungen heraus (Entscheidung Frank 21.10.2026),
// die Seite /form/contact selbst bleibt drin.
// Eine feste Liste (--seiten <datei>) wird unverändert übernommen.
import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'

// Unveröffentlichte Knoten behalten ihren Alias, antworten aber mit 403
// (21.10.2026: /events/piipe-workplace-funktionen-im-ueberblick) — nicht prüfen
export const SQL = "SELECT a.alias FROM path_alias a WHERE a.status=1 AND a.langcode IN ('de','und') AND NOT EXISTS (SELECT 1 FROM node_field_data n WHERE a.path=CONCAT('/node/',n.nid) AND n.default_langcode=1 AND n.status=0)"

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
