// Bereich Praesentation im Store (Plan v2, 2.5): Verweise aufloesen,
// Abweichungen als Punkt-Pfade, Undo, Export, alte Staende.
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useThemeStore } from '../../src/stores/theme.js'
import { praesentation } from '../../src/data/tokens.js'
import { loeseAuf, kontrast, palettenAuswahl } from '../../src/utils/praes-ref.js'
import { foundationZeilen } from '../../src/export/foundation-css.js'

// Alle Farbverweise des Blocks (ohne Zahlen, Texte, Masse, Papierliste)
function farbVerweise(p) {
  const out = []
  const sammle = (o) => {
    for (const v of Object.values(o)) {
      if (Array.isArray(v)) v.forEach((x) => typeof x === 'string' && out.push(x))
      else if (v && typeof v === 'object') sammle(v)
      else if (typeof v === 'string') out.push(v)
    }
  }
  sammle({ a: p.status.hell, b: p.status.tief, c: p.diagramm, d: p.gruenfamilie.rollen,
    e: p.gruenfamilie.proportion, f: p.welten, g: p.figma.farbe })
  return out
}

describe('praes-ref', () => {
  it('loest alle Farbverweise im Block auf', () => {
    const refs = farbVerweise(praesentation)
    expect(refs.length).toBeGreaterThan(50)
    for (const r of refs) expect(loeseAuf(r), r).toMatch(/^#[0-9a-f]{6}$/i)
  })

  it('Hex bleibt Hex, Listen elementweise, Unbekanntes wird null mit Warnung', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    expect(loeseAuf('#A1C513')).toBe('#A1C513')
    expect(loeseAuf(['forest.800', 'lime.500'])).toEqual(['#0c4146', loeseAuf('lime.500')])
    expect(loeseAuf('gibtsnicht.500')).toBeNull()
    expect(loeseAuf('forest.123')).toBeNull()
    expect(warn).toHaveBeenCalledTimes(2)
    warn.mockRestore()
  })

  it('Kontrast und Palettenauswahl', () => {
    expect(kontrast('#ffffff', '#000000')).toBeCloseTo(21, 5)
    expect(kontrast('#ffffff', 'forest.800')).toBeNull()
    const namen = palettenAuswahl().map((p) => p.name)
    expect(namen).toEqual(expect.arrayContaining(['graphit', 'forest', 'mint', 'lime', 'success', 'pink']))
  })
})

describe('Praesentation im Store', () => {
  let store
  beforeEach(() => {
    store = useThemeStore()
    store.state.activeThemeSet = 'customer'
    store.resetPraesentation()
    store.state.activeThemeSet = 'neo'
    store.resetPraesentation()
  })

  it('ohne Abweichung liefert der Getter die Quelle', () => {
    expect(store.currentPraesentation).toEqual(praesentation)
  })

  it('Override -> Getter -> Wert aendert sich (nur im aktiven Set)', () => {
    store.updatePraesentation('welten.wissen.tief', 'forest.700')
    expect(store.currentPraesentation.welten.wissen.tief).toBe('forest.700')
    expect(store.state.foundationOverrides.neo.praesentation).toEqual({ 'welten.wissen.tief': 'forest.700' })
    store.state.activeThemeSet = 'customer'
    expect(store.currentPraesentation.welten.wissen.tief).toBe('forest.800')
  })

  it('unbekannte Pfade und Gruppen werden abgelehnt, Quellwert loescht die Abweichung', () => {
    store.updatePraesentation('welten.gibtsnicht.tief', 'forest.700')
    store.updatePraesentation('welten.wissen', 'forest.700')
    store.updatePraesentation('diagramm.farbfolge', 'lime.500')
    expect(store.state.foundationOverrides.neo.praesentation ?? {}).toEqual({})
    store.updatePraesentation('dichtestufen.vortrag.text_pt', 24)
    expect(store.currentPraesentation.dichtestufen.vortrag.text_pt).toBe(24)
    store.updatePraesentation('dichtestufen.vortrag.text_pt', 22)
    expect(store.state.foundationOverrides.neo.praesentation).toEqual({})
  })

  it('Farbfolge als ganze Liste (Reihenfolge)', () => {
    const neu = [...praesentation.diagramm.farbfolge].reverse()
    store.updatePraesentation('diagramm.farbfolge', neu)
    expect(store.currentPraesentation.diagramm.farbfolge).toEqual(neu)
    expect(praesentation.diagramm.farbfolge[0]).toBe('graphit.400')
  })

  it('Undo nimmt updatePraesentation zurueck, Redo stellt es wieder her', () => {
    store.state.history = []
    store.state.historyIndex = -1
    store.updatePraesentation('status.hell.rot.text', 'danger.800')
    expect(store.currentPraesentation.status.hell.rot.text).toBe('danger.800')
    store.undo()
    expect(store.currentPraesentation.status.hell.rot.text).toBe('danger.700')
    store.redo()
    expect(store.currentPraesentation.status.hell.rot.text).toBe('danger.800')
  })

  it('resetPraesentation ist ein Undo-Schritt', () => {
    store.updatePraesentation('welten.daten.satt', 'neo-blue.600')
    store.state.history = []
    store.state.historyIndex = -1
    store.resetPraesentation()
    expect(store.currentPraesentation.welten.daten.satt).toBe('neo-blue.500')
    store.undo()
    expect(store.currentPraesentation.welten.daten.satt).toBe('neo-blue.600')
  })

  it('alter Stand ohne praesentation laedt ohne Fehler', () => {
    delete store.state.foundationOverrides.neo.praesentation
    store.saveToStorage()
    store.loadFromStorage()
    expect(store.currentPraesentation.welten.wissen.tief).toBe('forest.800')
    store.updatePraesentation('welten.wissen.tief', 'forest.900')
    expect(store.currentPraesentation.welten.wissen.tief).toBe('forest.900')
  })

  it('wird gespeichert und wieder geladen', () => {
    store.updatePraesentation('welten.menschen.hell', 'mustard.200')
    store.saveToStorage()
    store.state.foundationOverrides.neo.praesentation = {}
    store.loadFromStorage()
    expect(store.currentPraesentation.welten.menschen.hell).toBe('mustard.200')
  })

  it('CSS-Export ohne praesentation und ohne "uebersprungen"-Rauschen, JSON traegt die Abweichung', () => {
    store.updatePraesentation('welten.wissen.tief', 'forest.700')
    const { zeilen, uebersprungen } = foundationZeilen(store.state.foundationOverrides.neo)
    expect(uebersprungen.filter((u) => u.startsWith('praesentation'))).toEqual([])
    expect(zeilen.join('\n')).not.toMatch(/praesentation|forest\.700/)
    expect(store.exportAsCSSVars()).not.toMatch(/praesentation/)
    const json = JSON.parse(store.exportAsJSON())
    expect(json.foundation.praesentation).toEqual({ 'welten.wissen.tief': 'forest.700' })
  })
})
