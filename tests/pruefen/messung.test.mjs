// Messung je Seite: drei Aufnahmen (a vorher, b nachher, c Kontrolle). Unter
// Last malt Chromium große Bilder gelegentlich als leere Fläche (21.10.2026,
// /musterseite-bauteile und /produkte/workplace bei gleicher CSS) — einzeln
// nicht nachstellbar. Deshalb wird eine auffällige Seite einmal frisch
// wiederholt: ein echter Unterschied bleibt, ein Zeichenfehler verschwindet.
import { describe, it, expect } from 'vitest'
import { messeSeite } from '../../scripts/pruefen/lib/messung.mjs'

// Aufnahmen als Zahlen; der Vergleich ist der Betrag der Differenz
const vergleiche = async (x, y) => Math.abs(x - y)
function folge (...durchgaenge) {
  let i = 0
  return async () => durchgaenge[i++]
}

describe('pruefen: Messung je Seite', () => {
  it('unauffällige Seite wird nicht wiederholt', async () => {
    const r = await messeSeite({ nimmAuf: folge({ a: 5, b: 5, c: 5 }), vergleiche })
    expect(r).toEqual({ ab: 0, ac: 0, wiederholt: false, bilder: { a: 5, b: 5, c: 5 } })
  })

  it('Zeichenfehler im ersten Durchgang verschwindet bei der Wiederholung', async () => {
    const r = await messeSeite({ nimmAuf: folge({ a: 5, b: 9, c: 5 }, { a: 5, b: 5, c: 5 }), vergleiche })
    expect(r).toMatchObject({ ab: 0, ac: 0, wiederholt: true })
  })

  it('echter Unterschied bleibt nach der Wiederholung', async () => {
    const r = await messeSeite({ nimmAuf: folge({ a: 5, b: 9, c: 5 }, { a: 5, b: 9, c: 5 }), vergleiche })
    expect(r).toMatchObject({ ab: 4, ac: 0, wiederholt: true, bilder: { b: 9 } })
  })

  it('Rauschen in der Kontrolle löst ebenfalls eine Wiederholung aus', async () => {
    const r = await messeSeite({ nimmAuf: folge({ a: 5, b: 5, c: 7 }, { a: 5, b: 5, c: 5 }), vergleiche })
    expect(r).toMatchObject({ ab: 0, ac: 0, wiederholt: true })
  })
})
