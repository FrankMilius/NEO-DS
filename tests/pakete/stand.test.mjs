// Paketliste und STAND.md je Paket (scripts/pakete/, E10): Aus der Liste
// entsteht je Paket eine ausgefüllte Übergabedatei. Haltepunkte und
// Nicht-anfassen-Liste der Vorlage bleiben wörtlich; eine fehlerhafte Liste
// bricht ab, bevor ein Worktree entsteht.
import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { homedir } from 'node:os'
import path from 'node:path'
import { fuelle, pruefeListe, ziel } from '../../scripts/pakete/lib/stand.mjs'

const VORLAGE = `# STAND — R14 · paket-2a

| | |
|---|---|
| Zweig | punkt/r14-paket-2a |

## Ziel
<!-- Ein Satz: was danach gilt (aus der Roadmap). -->

## Abnahme — fertig, wenn
<!-- Messbar: Befehl und erwartete Ausgabe. -->

## Website darf sich ändern
<!-- ja / nein. -->

## Haltepunkte (E6)
- vor dem Zweig-Commit „(…, Freigabe ausstehend)“
- sobald der Pixelvergleich Website-Unterschiede zeigt
<!-- weitere nur auf Franks Wunsch -->

## Nicht anfassen
- \`data/theme-overrides.css\`, \`website/data/custom-theme.json\`
- Drupal-Konfiguration nur auf ausdrücklichen Wunsch; nie pushen

## Entscheidungen (Frank)
<!-- Datum — Entscheidung — Begründung -->

## Offene Fragen an Frank
<!-- Je Frage: was hängt davon ab -->

## Stand
<!-- Was gilt jetzt. -->

## Nächster Schritt
<!-- Genau einer. -->
`

const wert = (token, website = []) => ({
  token, komponente: 'form-label', standard: 'var(--x)', eigenschaft: 'color',
  massnahme: 'beheben (Reihenfolge/Spezifität)', detail: `.a { color } verliert gegen: .b { color: red }`, website,
})

const liste = {
  punkt: 'R14',
  regel: 'Standard = heute sichtbarer Wert.',
  entscheidungen: ['22.10.2026 — Paketschnitt (Frank)'],
  naechsterSchritt: 'Reparatur über den Workflow.',
  pakete: [
    { id: 'paket-2a', titel: 'Formularfelder', werte: [wert('nc-a-color', ['Block „Form“']), wert('nc-b-color')] },
    { id: 'paket-2b', titel: 'Button', werte: [wert('nc-c-color')] },
  ],
}
const bekannt = { 'nc-a-color': 'ohne-wirkung', 'nc-b-color': 'ohne-wirkung', 'nc-c-color': 'ohne-wirkung' }

describe('pakete: STAND.md je Paket', () => {
  const text = fuelle(VORLAGE, liste.pakete[0], liste, { basis: 'main a8d39a90' })

  it('schreibt je Token eine Zeile mit Ursache und Website-Einsatz', () => {
    expect(text).toMatch(/## Werte \(2\)/)
    expect(text).toMatch(/\| nc-a-color \| color \| `\.a \{ color \} verliert gegen: \.b \{ color: red \}` \| beheben \(Reihenfolge\/Spezifität\) \| Block „Form“ \|/)
    expect(text).toMatch(/\| nc-b-color \| color \|.*\| — \|/)
  })

  it('Abnahme trennt Gegenprobe auf der Website und Bühne', () => {
    const abnahme = text.split('## Abnahme')[1].split('\n## ')[0]
    expect(abnahme).toMatch(/pruefen:gegenprobe.*--nc-a-color/)
    expect(abnahme).toMatch(/e2e:wirkung.*nc-b-color/)
    expect(abnahme).not.toMatch(/gegenprobe.*--nc-b-color/)
    expect(abnahme).toMatch(/ohne-wirkung.*um 2/)
  })

  it('nennt Haltepunkte E6 und Nicht-anfassen-Liste wörtlich', () => {
    const block = (t, k) => t.split(`## ${k}`)[1].split('\n## ')[0]
    expect(block(text, 'Haltepunkte (E6)')).toBe(block(VORLAGE, 'Haltepunkte (E6)'))
    expect(block(text, 'Nicht anfassen')).toBe(block(VORLAGE, 'Nicht anfassen'))
  })

  it('füllt Ziel, Website, Entscheidungen, Stand und nächsten Schritt; keine Platzhalter mehr außer bei offenen Fragen', () => {
    expect(text).toMatch(/## Ziel\nDie 2 überdeckten Werte „Formularfelder“ wirken/)
    expect(text).toMatch(/## Website darf sich ändern\nnein/)
    expect(text).toMatch(/- 22\.10\.2026 — Paketschnitt \(Frank\)/)
    expect(text).toMatch(/## Stand\nNur angelegt \(main a8d39a90\)/)
    expect(text).toMatch(/## Nächster Schritt\nReparatur über den Workflow\./)
    const ohneFragen = text.replace(/## Offene Fragen an Frank\n<!--[^]*?-->/, '')
    expect(ohneFragen).not.toMatch(/<!-- (Ein Satz|Messbar|ja \/ nein|Datum|Was gilt|Genau einer)/)
  })

  it('bricht ab, wenn ein Abschnitt der Vorlage fehlt', () => {
    expect(() => fuelle(VORLAGE.replace('## Stand', '## Anders'), liste.pakete[0], liste, { basis: 'x' })).toThrow(/Stand/)
  })
})

describe('pakete: Liste prüfen', () => {
  it('eine gültige Liste hat keine Fehler', () => {
    expect(pruefeListe(liste, bekannt)).toEqual([])
  })

  it('doppeltes Token über Pakete hinweg', () => {
    const l = structuredClone(liste); l.pakete[1].werte.push(wert('nc-a-color'))
    expect(pruefeListe(l, bekannt).join('\n')).toMatch(/nc-a-color.*doppelt/)
  })

  it('unbekanntes Token (nicht in token-wirkung.json)', () => {
    const l = structuredClone(liste); l.pakete[1].werte.push(wert('nc-gibt-es-nicht'))
    expect(pruefeListe(l, bekannt).join('\n')).toMatch(/nc-gibt-es-nicht.*unbekannt/)
  })

  it('Token wirkt schon — Paket hätte nichts zu tun', () => {
    expect(pruefeListe(liste, { ...bekannt, 'nc-c-color': 'wirkt' }).join('\n')).toMatch(/nc-c-color.*wirkt schon/)
  })

  it('ungültige oder doppelte Paket-Kennung, leeres Paket, Punkt ohne Form', () => {
    const l = structuredClone(liste)
    l.punkt = 'r14'
    l.pakete[1].id = 'Paket 2b'
    l.pakete.push({ id: 'paket-2a', titel: 'x', werte: [] })
    const f = pruefeListe(l, bekannt).join('\n')
    expect(f).toMatch(/Punkt „r14“/)
    expect(f).toMatch(/Kennung „Paket 2b“/)
    expect(f).toMatch(/paket-2a.*doppelt/)
    expect(f).toMatch(/keine Werte/)
  })

  it('Zielordner und Zweig wie punkt-starten.sh', () => {
    expect(ziel(liste, liste.pakete[0])).toEqual({
      ordner: path.join(homedir(), 'Sites/_worktrees/WEBSITE26-r14-paket-2a'),
      zweig: 'punkt/r14-paket-2a',
    })
  })

  // Aufbau und Existenz der Tokens, nicht ihr heutiger Wirkungsstand: Nach
  // der Übernahme von 2a/2b (23.10.2026) wirken 15 der 17 Werte — „wirkt
  // schon“ sperrt dann zu Recht ein neues Anlegen, macht die Liste aber nicht
  // ungültig.
  it('die versionierte Probelauf-Liste ist gültig: 2 Pakete, 17 bekannte Werte', () => {
    const l = JSON.parse(readFileSync(new URL('../../scripts/pakete/r14-probelauf.json', import.meta.url), 'utf8'))
    const ids = Object.keys(JSON.parse(readFileSync(new URL('../../apps/theme-configurator/src/data/token-wirkung.json', import.meta.url), 'utf8')).tokens)
    expect(pruefeListe(l, Object.fromEntries(ids.map((id) => [id, 'ohne-wirkung'])))).toEqual([])
    expect(l.pakete.map((p) => p.werte.length)).toEqual([7, 10])
  })
})
