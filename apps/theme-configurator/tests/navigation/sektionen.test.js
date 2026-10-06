// Sektions-Registry (Plan v2, 3.4): jede Navigations-Sektion hat eine
// Labor-Komponente und eine Inspector-Zuordnung — keine faellt durch.
import { describe, it, expect } from 'vitest'
import { NAVIGATIONS_SEKTIONEN, START_SEKTION, istNavigationsSektion } from '../../src/navigation/sektions-ids.js'
import { SEKTIONEN, LABOR, sektionAufloesen } from '../../src/navigation/sektionen.js'
import { navigationTree } from '../../src/data/navigation-builder.js'

function alleSektionenAusBaum (knoten, ziel = []) {
  for (const k of knoten) {
    if (k.section) ziel.push(k.section)
    if (k.children) alleSektionenAusBaum(k.children, ziel)
  }
  return ziel
}

describe('Sektions-IDs', () => {
  it('sammelt jede Sektion des Navigationsbaums', () => {
    const ausBaum = new Set(alleSektionenAusBaum(navigationTree))
    expect(new Set(NAVIGATIONS_SEKTIONEN)).toEqual(ausBaum)
    expect(NAVIGATIONS_SEKTIONEN.length).toBeGreaterThan(50)
  })

  it('Startsektion ist eine Navigations-Sektion', () => {
    expect(istNavigationsSektion(START_SEKTION)).toBe(true)
    expect(istNavigationsSektion('foundation-gibtsnicht')).toBe(false)
    expect(istNavigationsSektion(undefined)).toBe(false)
  })
})

describe('Registry', () => {
  it('deckt jede Navigations-Sektion ab (Labor-Komponente + Inspector-Liste + Label)', () => {
    const ohne = []
    for (const id of NAVIGATIONS_SEKTIONEN) {
      const e = SEKTIONEN.get(id)
      if (!e || !e.labor || !Array.isArray(e.inspector) || typeof e.label !== 'string') ohne.push(id)
      else for (const b of e.inspector) if (!b.komponente) ohne.push(id + ' (Inspector-Block)')
    }
    expect(ohne).toEqual([])
    expect(SEKTIONEN.size).toBe(NAVIGATIONS_SEKTIONEN.length)
  })

  it('Foundation-Sektionen haben eigene Labor-Komponenten (keine faellt auf die Magazin-Vorschau)', () => {
    const foundation = NAVIGATIONS_SEKTIONEN.filter((id) => id.startsWith('foundation-'))
    expect(foundation.length).toBe(16)
    for (const id of foundation) {
      expect(SEKTIONEN.get(id).labor, id).not.toBe(LABOR.magazin)
      expect(SEKTIONEN.get(id).label, id).not.toBe('')
    }
  })

  it('Inspector leer nur dort, wo es bisher auch leer war (Icons, Utilities)', () => {
    const leer = NAVIGATIONS_SEKTIONEN.filter((id) => SEKTIONEN.get(id).inspector.length === 0)
    for (const id of leer) expect(id === 'foundation-icons' || id.startsWith('utility-'), id).toBe(true)
  })

  it('Komponenten-Sektionen: Buehne im Labor, ComponentEditor mit ID im Inspector', () => {
    const e = sektionAufloesen('component-code-snippet')
    expect(e.labor).toBe(LABOR.komponente)
    expect(e.label).toBe('Code Snippet')
    expect(e.inspector[0].props).toEqual({ componentId: 'code-snippet' })
    expect(e.schluessel).toBe('component')
  })

  it('component-grid ist eine Komponente wie jede andere (Plan v3, Phase 3, Block Layout); foundation-grid behaelt die Grid-Buehne', () => {
    const a = sektionAufloesen('component-grid')
    const b = sektionAufloesen('foundation-grid')
    expect(a.labor).toBe(LABOR.komponente)
    expect(a.inspector[0].props).toEqual({ componentId: 'grid' })
    expect(a.schluessel).toBe('component')
    expect(b.labor).toBe(LABOR.grid)
    expect(b.schluessel).toBe('grid')
  })

  it('Typografie und Opacity bringen mehrere Inspector-Bloecke mit', () => {
    expect(sektionAufloesen('foundation-typography').inspector).toHaveLength(2)
    expect(sektionAufloesen('foundation-opacity').inspector.map((b) => b.props.category))
      .toEqual(['opacity', 'zindex', 'motion'])
  })

  it('unbekannte oder leere IDs liefern einen Eintrag ohne Fehler (Magazin, leerer Inspector)', () => {
    for (const id of ['gibtsnicht', 'foo-bar', '', undefined, null]) {
      const e = sektionAufloesen(id)
      expect(e.labor).toBe(LABOR.magazin)
      expect(e.inspector).toEqual([])
    }
  })

  it('Template- und Modul-Sektionen: Magazin im Labor, Platzhalter im Inspector', () => {
    expect(sektionAufloesen('template-dashboard').inspector[0].props).toEqual({ templateId: 'dashboard' })
    expect(sektionAufloesen('module-header').inspector[0].props).toEqual({ moduleId: 'header' })
    expect(sektionAufloesen('template-dashboard').labor).toBe(LABOR.magazin)
  })
})
