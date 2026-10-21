// Urteil und Bericht des Pixelvergleichs. Je Seite drei Aufnahmen: a (vorher),
// b (nachher), c (Kontrolle = vorher noch einmal). ab = Unterschied, ac =
// Rauschen. Eine Seite gilt als geändert, wenn ab > 0 und ab > 2 × ac —
// sonst ist der Unterschied nicht vom Rauschen derselben Seite zu trennen.
import { describe, it, expect } from 'vitest'
import { urteil, bericht, FAKTOR } from '../../scripts/pruefen/lib/pixel-bericht.mjs'

describe('pruefen: Urteil je Seite', () => {
  it('kein Unterschied → unverändert', () => expect(urteil({ ab: 0, ac: 0 })).toBe('unverändert'))
  it('Unterschied ohne Rauschen → geändert', () => expect(urteil({ ab: 1, ac: 0 })).toBe('geändert'))
  it('Unterschied nicht deutlich über dem Rauschen → unklar', () => expect(urteil({ ab: 200, ac: 100 })).toBe('unklar'))
  it('Unterschied deutlich über dem Rauschen → geändert', () => expect(urteil({ ab: 201, ac: 100 })).toBe('geändert'))
  it('nur Rauschen → unverändert', () => expect(urteil({ ab: 0, ac: 50 })).toBe('unverändert'))
  it('Faktor steht als Zahl bereit, damit der Bericht ihn nennt', () => expect(FAKTOR).toBe(2))
})

describe('pruefen: Bericht je Breite', () => {
  const ergebnisse = [
    { seite: '/', ab: 0, ac: 0 },
    { seite: '/preise', ab: 5000, ac: 0 },
    { seite: '/events', ab: 300, ac: 200 },
    { seite: '/kaputt', fehler: 'Timeout 30000ms' },
  ]

  it('Kopfzeile zählt geänderte von geprüften Seiten, Fehlerseiten nicht', () => {
    expect(bericht(1280, ergebnisse).split('\n')[0]).toBe('1280 Seiten mit Unterschied: 1 von 3')
  })

  it('nennt jede auffällige Seite mit Unterschied und Rauschen, unauffällige nicht', () => {
    const t = bericht(1280, ergebnisse)
    expect(t).toMatch(/geändert\s+\/preise\s+Unterschied 5000 · Rauschen 0/)
    expect(t).toMatch(/unklar\s+\/events\s+Unterschied 300 · Rauschen 200/)
    expect(t).not.toMatch(/ \/\s/)
  })

  it('nennt, wie viele Seiten wiederholt wurden und welche danach unauffällig waren', () => {
    const t = bericht(390, [{ seite: '/a', ab: 0, ac: 0, wiederholt: true }, { seite: '/b', ab: 10, ac: 0, wiederholt: true }, { seite: '/c', ab: 0, ac: 0 }])
    expect(t).toMatch(/wiederholt: 2 Seiten, danach unauffällig: \/a/)
  })

  it('nennt Fehlerseiten ausdrücklich, statt sie zu verschlucken', () => {
    expect(bericht(1280, ergebnisse)).toMatch(/Fehler: 1 Seite nicht geprüft[\s\S]*\/kaputt\s+Timeout 30000ms/)
  })
})
