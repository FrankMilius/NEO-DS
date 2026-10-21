// Nächtliche Wirkungsprüfung (E8, 21.10.2026): Ausgabe der Ratsche
// (apps/theme-configurator/scripts/wirkung.mjs --pruefen) lesen.
// Getestet in tests/routinen/wirkung.test.mjs.

/**
 * @param {string} text  gesamte Ausgabe von `npm run e2e:wirkung`
 * @param {number} code  Rückgabewert des Laufs
 * @returns {{ urteil: 'gut'|'schlechter'|'abgebrochen', zeile: string|null, anzahl: number, schlechter: string[], besser: number }}
 */
export function ratsche (text, code) {
  const t = String(text)
  const zeile = t.match(/^Wirkungsprüfung: .*$/m)?.[0] ?? null
  const s = t.match(/✗ (\d+) Token\(s\) schlechter[^\n]*\n?((?:[ \t]+.*\n?)*)/)
  const schlechter = s ? s[2].split('\n').map((x) => x.trim()).filter(Boolean) : []
  // Zahl aus der Kopfzeile der Ratsche, nicht aus der Liste (Einrückung könnte sich ändern)
  const anzahl = s ? Number(s[1]) : 0
  const besser = Number(t.match(/Besser geworden \((\d+)\)/)?.[1] ?? 0)
  let urteil = 'abgebrochen'
  if (s) urteil = 'schlechter'
  else if (code === 0 && /✓ nichts schlechter/.test(t)) urteil = 'gut'
  return { urteil, zeile, anzahl, schlechter, besser }
}

/** Letzte Zeilen einer langen Ausgabe für den Bericht. */
export function schwanz (text, n = 30) {
  return String(text).trimEnd().split('\n').slice(-n).join('\n')
}
