// Routinen (E8): Auswertung des Wartungsberichts.
import { describe, it, expect } from 'vitest'
import { sicherung, worktrees, dependabot, ciZustand, composerAudit, einzeilig, handlungsbedarf } from '../../scripts/routinen/lib/wartung.mjs'

const TAG = 86400000

describe('sicherung', () => {
  it('aktuell, veraltet, fehlt, gepusht', () => {
    expect(sicherung([
      { repo: 'DRUPAL11', master: 'a', buendel: 'a', lesbar: true },
      { repo: 'neo_fe', master: 'b', buendel: 'c', lesbar: true },
      { repo: 'x', master: 'd', buendel: null },
      { repo: 'y', master: 'e', buendel: 'f', gepusht: true },
      { repo: 'z', master: 'g', buendel: null, gepusht: true },
    ]).map((s) => s.status)).toEqual(['aktuell', 'veraltet', 'fehlt', 'gepusht', 'gepusht'])
  })
  it('abgeschnittenes Bündel mit passendem Kopf ist beschädigt, nicht aktuell', () => {
    expect(sicherung([{ repo: 'a', master: 'h', buendel: 'h', lesbar: false }])[0].status).toBe('beschädigt')
  })
  it('master nicht lesbar ist kein „aktuell“', () => {
    expect(sicherung([{ repo: 'a', master: null, buendel: null }])[0].status).toBe('master nicht lesbar')
  })
})

describe('worktrees', () => {
  const jetzt = 100 * TAG
  it('erledigt nur ohne STAND.md, in der Basis und ohne Offenes; sonst nach Alter', () => {
    const w = worktrees([
      { pfad: 'a', zweig: 'x', inBasis: true, offen: 0, letzterCommit: 99 * TAG },
      { pfad: 'b', zweig: 'y', inBasis: true, offen: 2, letzterCommit: 99 * TAG },
      { pfad: 'c', zweig: 'z', inBasis: false, offen: 0, letzterCommit: 80 * TAG },
      { pfad: 'd', zweig: 'q', inBasis: false, offen: 0, letzterCommit: 98 * TAG },
      { pfad: 'e', zweig: 'r', fehlt: true },
      { pfad: 'f', zweig: 's', inBasis: true, offen: 0, stand_md: true, letzterCommit: 99 * TAG },
      { pfad: 'g', zweig: 't', fehler: 'kaputt' },
      { pfad: 'h', zweig: 'u', inBasis: true, offen: 0, stand_md: true, eigeneCommits: false, letzterCommit: 99 * TAG },
      { pfad: 'i', zweig: 'v', inBasis: true, offen: 0, stand_md: true, eigeneCommits: true, letzterCommit: 99 * TAG },
    ], jetzt)
    expect(w.map((x) => x.status)).toEqual(['erledigt — kann weg', 'in Arbeit', 'liegt seit 20 Tagen', 'in Arbeit', 'Ordner fehlt — git worktree prune',
      'erledigt — STAND.md erst sichern', 'nicht lesbar: kaputt', 'in Arbeit', 'erledigt — STAND.md erst sichern'])
  })
})

describe('dependabot', () => {
  it('CI-Zustand zusammengefasst; Unbekanntes gilt als rot', () => {
    const d = dependabot([
      { number: 9, title: 'Bump', statusCheckRollup: [{ conclusion: 'SUCCESS' }, { conclusion: 'FAILURE' }] },
      { number: 10, title: 'Bump', statusCheckRollup: [{ status: 'IN_PROGRESS' }] },
      { number: 11, title: 'Bump', statusCheckRollup: [{ conclusion: 'SUCCESS' }, { conclusion: 'SKIPPED' }] },
      { number: 12, title: 'Bump', createdAt: '1970-01-03T00:00:00Z' },
      { number: 13, title: 'Bump', statusCheckRollup: [{ conclusion: 'ACTION_REQUIRED' }] },
      { number: 14, title: 'Bump', statusCheckRollup: [{ conclusion: 'STALE' }] },
    ], 5 * TAG)
    expect(d.map((x) => x.ci)).toEqual(['rot', 'läuft', 'grün', 'ohne CI', 'rot', 'rot'])
    expect(d[3].alterTage).toBe(3)
  })
})

describe('ciZustand', () => {
  const l = (tag, conclusion, status = 'completed') => ({ status, conclusion, headSha: `sha${tag}0000000`, createdAt: new Date(tag * TAG).toISOString(), url: `u${tag}` })
  it('neuester abgeschlossener Lauf zählt; rote Strecke ab dem ersten roten Lauf', () => {
    const c = ciZustand([{ ablauf: 'B', laeufe: [l(2, 'failure'), l(3, 'success')] }, { ablauf: 'A', laeufe: [l(1, 'success'), l(2, 'failure'), l(3, 'failure')] }], 5 * TAG)
    expect(c.map((x) => [x.ablauf, x.ergebnis, x.seitTage, x.mindestens])).toEqual([['A', 'rot', 3, false], ['B', 'grün', null, false]])
    expect(c[0]).toMatchObject({ sha: 'sha30000', url: 'u3' })
  })
  it('übersprungene und abgebrochene zählen nicht; laufender Lauf wird vermerkt', () => {
    expect(ciZustand([{ ablauf: 'A', laeufe: [l(1, 'failure'), l(2, 'cancelled'), l(3, 'skipped'), l(4, '', 'in_progress')] }], 5 * TAG)[0]).toMatchObject({ ergebnis: 'rot', laeuft: true, seitTage: 4 })
  })
  it('falsche Ruhe ausgeschlossen: nur abgebrochen, keine Läufe, stale, leeres Ergebnis → unklar; deaktiviert', () => {
    const c = ciZustand([
      { ablauf: 'a', laeufe: [l(1, 'cancelled')] },
      { ablauf: 'b', laeufe: [] },
      { ablauf: 'c', laeufe: [l(1, 'failure'), l(2, 'stale')] },
      { ablauf: 'd', laeufe: [l(1, null)] },
      { ablauf: 'e', aktiv: false, laeufe: [l(1, 'success')] },
    ])
    expect(c.map((x) => x.ergebnis)).toEqual(['unklar', 'unklar', 'unklar', 'unklar', 'deaktiviert'])
  })
  it('rote Strecke über alle abgefragten Läufe = „mindestens“', () => {
    const laeufe = Array.from({ length: 20 }, (_, i) => l(i + 1, 'failure'))
    expect(ciZustand([{ ablauf: 'A', laeufe }], 30 * TAG, 20)[0]).toMatchObject({ ergebnis: 'rot', seitTage: 29, mindestens: true })
  })
})

describe('composerAudit', () => {
  it('leere Liste, Vorspann vor dem JSON, Warnungen je Paket', () => {
    expect(composerAudit('Hinweis vom Hook\n{"advisories":[],"abandoned":[]}')).toEqual({ warnungen: [], verwaist: [] })
    const a = composerAudit('{"advisories":{"drupal/core":[{"title":"XSS","cve":"CVE-1","affectedVersions":"<11.2.4","link":"u"}]},"abandoned":{"x/y":null}}')
    expect(a.warnungen).toEqual([{ paket: 'drupal/core', titel: 'XSS', cve: 'CVE-1', betroffen: '<11.2.4', link: 'u' }])
    expect(a.verwaist).toEqual(['x/y'])
    expect(composerAudit('kaputt').fehler).toBe('keine JSON-Ausgabe')
  })
  it('geschweifte Klammer im Vorspann (PHP-Hinweis mit {closure})', () => {
    expect(composerAudit('Deprecated: {closure}(): foo in x.php\n{\n  "advisories": [],\n  "abandoned": []\n}\n')).toEqual({ warnungen: [], verwaist: [] })
  })
  it('Text nach dem JSON (PHP-Warnung am Ende)', () => {
    expect(composerAudit('{\n  "advisories": [],\n  "abandoned": []\n}\nWarning: foo in bar.php\n')).toEqual({ warnungen: [], verwaist: [] })
  })
})

describe('einzeilig', () => {
  it('Zeilenumbrüche weg, gekürzt', () => {
    expect(einzeilig('a\n  b\n')).toBe('a b')
    expect(einzeilig('x'.repeat(200), 10)).toBe('xxxxxxxxx…')
  })
})

describe('handlungsbedarf', () => {
  it('nur, was Frank tun sollte', () => {
    expect(handlungsbedarf({
      sicherung: [{ repo: 'neo_fe', status: 'veraltet' }, { repo: 'DRUPAL11', status: 'aktuell' }, { repo: 'x', status: 'gepusht' }, { repo: 'y', status: 'beschädigt' }],
      dependabot: [{ ci: 'rot', alterTage: 30 }, { ci: 'grün', alterTage: 3 }, { ci: 'grün', alterTage: 20 }],
      audit: { warnungen: [], verwaist: [] },
      worktrees: [{ status: 'erledigt — kann weg' }, { status: 'erledigt — STAND.md erst sichern' }, { status: 'in Arbeit' }],
      ungepusht: [{ repo: 'WEBSITE26', anzahl: 12 }, { repo: 'neo_fe', anzahl: 3 }, { repo: 'DRUPAL11', fehler: 'kein Repository' }],
      letzteWirkung: 0,
    })).toEqual([
      'Sicherung neo_fe veraltet', 'Sicherung y beschädigt', '1 Dependabot-PR mit roter CI', '1 Dependabot-PR seit über 14 Tagen offen',
      '2 Worktree(s) zum Aufräumen oder Nachsehen', 'WEBSITE26: 12 Commits nicht gepusht', 'DRUPAL11: Ungepushtes nicht prüfbar (kein Repository)',
    ])
    expect(handlungsbedarf({ audit: { warnungen: [] }, letzteWirkung: 1 })).toEqual([])
  })
  it('Nachtprüfung ausgefallen oder nie gelaufen', () => {
    expect(handlungsbedarf({ letzteWirkung: 3 })).toEqual(['Nächtliche Wirkungsprüfung seit 3 Tagen ohne Bericht'])
    expect(handlungsbedarf({ letzteWirkung: null })).toEqual(['Nächtliche Wirkungsprüfung: noch kein Bericht'])
  })
  it('rote CI ist Handlungsbedarf, grüne nicht', () => {
    expect(handlungsbedarf({ ci: [{ ablauf: 'Theme-Konfigurator', ergebnis: 'rot', seitTage: 7 }, { ablauf: 'X', ergebnis: 'grün', seitTage: null }, { ablauf: 'Y', ergebnis: 'rot', seitTage: 9, mindestens: true }, { ablauf: 'Z', ergebnis: 'unklar' }, { ablauf: 'W', ergebnis: 'deaktiviert' }] })).toEqual(['CI rot: Theme-Konfigurator (seit 7 T.)', 'CI rot: Y (seit mindestens 9 T.)', 'CI unklar: Z (kein auswertbarer Lauf)', 'CI-Ablauf deaktiviert: W'])
  })
})
