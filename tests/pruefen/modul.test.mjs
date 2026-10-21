// Modul-e2e (pruefen:modul): Aufräumen nur der Test-Themes und der Vorschau
// des Testkontos, Checkouts nur prüfen statt umschalten (Entscheidung Frank
// 21.10.2026). „Kundentheme NEU“ bleibt in jedem Fall stehen.
import { describe, it, expect } from 'vitest'
import { waehleZumLoeschen, pruefeZweige, phpListe, phpLoeschen } from '../../scripts/pruefen/lib/modul.mjs'

describe('pruefen: Modul — Aufräumen', () => {
  it('wählt nur Labels mit Präfix „E2E“ oder „UX-Audit“', () => {
    const themes = [
      { id: 'kundentheme_neu', label: 'Kundentheme NEU' },
      { id: 'e2e_anlegen_1', label: 'E2E Anlegen 1' },
      { id: 'ux_audit_3', label: 'UX-Audit 3' },
      { id: 'mein_e2e', label: 'Mein E2E-Theme' },
      { id: 'e2e_klein', label: 'e2e klein' },
    ]
    expect(waehleZumLoeschen(themes).map((t) => t.id)).toEqual(['e2e_anlegen_1', 'ux_audit_3'])
  })

  it('„Kundentheme NEU“ ist hart ausgenommen, auch wenn das Label passen würde', () => {
    expect(waehleZumLoeschen([{ id: 'kundentheme_neu', label: 'E2E Kundentheme NEU' }, { id: 'x', label: 'Kundentheme NEU' }])).toEqual([])
  })

  it('PHP-Liste liest Themes und die Vorschau des Testkontos, ändert nichts', () => {
    const php = phpListe('e2e-tester')
    expect(php).toMatch(/getStorage\("neo_theme"\)/)
    expect(php).toMatch(/user_load_by_name\("e2e-tester"\)/)
    expect(php).not.toMatch(/delete/)
  })

  it('PHP-Löschen prüft das Präfix selbst noch einmal und löscht nur den Schlüssel des Kontos', () => {
    const php = phpLoeschen(['e2e_anlegen_1'], 'e2e-tester')
    expect(php).toMatch(/\["e2e_anlegen_1"\]/)
    expect(php).toMatch(/preg_match\('\/\^\(E2E\|UX-Audit\)\/'/)
    expect(php).toMatch(/kundentheme_neu/)
    expect(php).toMatch(/->delete\(\(string\) \$uid\)/)
    expect(php).not.toMatch(/deleteAll/)
  })

  it('Kontoname mit Anführungszeichen wird abgelehnt', () => {
    expect(() => phpListe('a"b')).toThrow(/Kontoname/)
  })
})

describe('pruefen: Modul — Checkouts', () => {
  const pfade = { drupal: '/D', theme: '/D/web/themes/custom/neo_fe' }

  it('passende Zweige → keine Meldung', () => {
    expect(pruefeZweige({ drupal: 'master', theme: 'master' }, { drupal: 'master', theme: 'master' }, pfade)).toEqual([])
  })

  it('falscher Zweig → Meldung mit Umschaltbefehl, ohne selbst umzuschalten', () => {
    const m = pruefeZweige({ drupal: 'master', theme: 'master' }, { drupal: 'master', theme: 'plan-v4/x' }, pfade)
    expect(m).toEqual(['neo_fe auf master, erwartet plan-v4/x — selbst umschalten: git -C /D/web/themes/custom/neo_fe switch plan-v4/x'])
  })
})
