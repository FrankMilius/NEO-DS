// Fertig-Gate: welche Prüfungen eine Änderung braucht (E4, 21.10.2026).
// Reine Funktionen ohne Seiteneffekte, getestet in tests/pruefen/auswahl.test.mjs.
//
// Grundsatz: lieber eine Prüfung zu viel als eine zu wenig. Was die Website
// sichtbar ändern kann (SCSS, Token), bekommt den Pixelvergleich; was die
// Konfig-App betrifft, CI mit e2e, Bildvergleich und Modul-e2e.

/** Alle Prüfungen in der Reihenfolge, in der der Bericht sie nennt. */
export const PRUEFUNGEN = ['test', 'ci', 'bilder', 'pixel', 'modul']

// CSS-wirksam: Quellen, Token-Generator, Abhängigkeiten (Sass-Version), Bau selbst
const CSS = /^(scss\/|data\/design-tokens\.json$|data\/[^/]+-recipe\.json$|scripts\/generate-tokens[^/]*$|package-lock\.json$|styles\.css$)/
const APP = /^(apps\/theme-configurator\/|packages\/)/
// Reiner Text: *.md in jedem Ordner (auch unter scss/), dazu .claude/, docs/, specs/
const NUR_TEXT = /^(\.claude\/|docs\/|specs\/)|\.md$/

/**
 * Prüfungen für eine Liste geänderter Pfade (relativ zur Wurzel).
 * @param {string[]} dateien
 * @param {{ alle?: boolean, ohne?: string[] }} [o]
 * @returns {{ pruefungen: string[], gruende: Record<string, string> }}
 */
export function waehle (dateien, { alle = false, ohne = [] } = {}) {
  if (ohne.includes('test')) throw new Error('npm test läuft immer und lässt sich nicht abwählen.')
  const gruende = { test: 'immer' }
  const text = (d) => /\.md$/.test(d) || (NUR_TEXT.test(d) && !CSS.test(d))
  const css = dateien.filter((d) => CSS.test(d) && !text(d))
  const app = dateien.filter((d) => APP.test(d) && !text(d))
  const sonst = dateien.filter((d) => !CSS.test(d) && !APP.test(d) && !text(d))
  if (alle) {
    for (const p of PRUEFUNGEN) gruende[p] = '--alle'
  } else {
    const beispiel = (l) => `${l[0]}${l.length > 1 ? ` (+${l.length - 1})` : ''}`
    if (css.length || app.length || sonst.length) {
      const l = [...css, ...app, ...sonst]
      gruende.ci = beispiel(l)
    }
    if (css.length || app.length) gruende.bilder = beispiel([...css, ...app])
    if (css.length) gruende.pixel = beispiel(css)
    if (app.length || css.length) gruende.modul = beispiel([...app, ...css])
  }
  for (const p of ohne) delete gruende[p]
  return { pruefungen: PRUEFUNGEN.filter((p) => p in gruende), gruende }
}

/**
 * Kennzahl aus der Ausgabe einer Prüfung — die Zahl, die in den Bericht und
 * in den Commit-Rumpf gehört. null, wenn nichts Erkennbares dasteht.
 * @param {string} pruefung
 * @param {string} text
 * @returns {string|null}
 */
export function kennzahl (pruefung, text) {
  const t = String(text).replace(/\x1b\[[0-9;]*m/g, '')
  const letzte = (re) => { let m, r = null; const g = new RegExp(re.source, re.flags.includes('g') ? re.flags : re.flags + 'g'); while ((m = g.exec(t))) r = m; return r }
  switch (pruefung) {
    case 'test': {
      const m = letzte(/Tests\s+(\d+ passed[^\n]*)/)
      return m ? `Tests ${m[1].trim()}` : null
    }
    case 'ci': {
      const rot = letzte(/✗ \[(\w+)\] „([^“]+)“ fehlgeschlagen/)
      if (rot) {
        const t2 = letzte(/Tests\s+(\d+ failed[^\n]*)/) || letzte(/^\s*(\d+ failed[^\n]*)/m)
        return `rot in [${rot[1]}] „${rot[2]}“${t2 ? ` — ${t2[1].trim()}` : ''}`
      }
      const m = letzte(/✓ (\d+ Schritte[^\n]*)/) || letzte(/(\d+ passed[^\n]*)/)
      return m ? m[1].trim() : null
    }
    case 'bilder':
    case 'modul': {
      // Zusammenfassung der Prüfwerkzeuge (E3): „27 passed, 0 failed · Dauer …“
      const e3 = letzte(/(\d+ passed, \d+ failed[^\n]*)/)
      if (e3) return e3[1].trim()
      // sonst Playwright-Zeilen: failed und flaky nie verschlucken
      const teile = ['failed', 'flaky', 'skipped', 'passed'].map((w) => letzte(new RegExp(`^\\s*(\\d+ ${w}[^\\n]*)`, 'm'))).filter(Boolean).map((m) => m[1].trim())
      return teile.length ? teile.join(' · ') : null
    }
    case 'pixel': {
      const z = [...t.matchAll(/^(\d+) Seiten mit Unterschied: (\d+) von (\d+)/gm)].map((m) => `${m[1]}: ${m[2]} von ${m[3]}`)
      const unklar = [...t.matchAll(/^\s+unklar\s/gm)].length
      return z.length ? `Seiten mit Unterschied ${z.join(' · ')}${unklar ? ` · unklar ${unklar}` : ''}` : null
    }
    default: return null
  }
}

/**
 * Gesamturteil aus den Ausgängen. pixel mit Ausgang 1 ist der Haltepunkt
 * „Website-Unterschiede“ (E6), nicht bloß ein Fehler.
 * @param {Record<string, { ausgang: number|null }>} ergebnisse
 */
export function urteil (ergebnisse) {
  const rot = Object.entries(ergebnisse).filter(([, e]) => e.ausgang !== 0).map(([p]) => p)
  // Haltepunkt nach Befund, nicht nach Ausgang: pixel.mjs endet mit 2, sobald
  // eine Seite einen Fehler hat — Unterschiede auf anderen Seiten zählen trotzdem.
  const k = ergebnisse.pixel?.kennzahl ?? ''
  const haltepunkt = ergebnisse.pixel?.ausgang === 1 || /: [1-9]\d* von /.test(k) || /unklar [1-9]/.test(k)
  return { gruen: rot.length === 0, rot, haltepunkt }
}
