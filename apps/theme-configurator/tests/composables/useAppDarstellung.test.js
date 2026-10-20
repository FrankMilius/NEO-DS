/**
 * App-Darstellung Hell · Dunkel · Wie System (Roadmap R03): Vorgabe, Merken,
 * Attribute am Dokument, Systemeinstellung.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { nextTick } from 'vue'

const SCHLUESSEL = 'neo-cfg-app-darstellung'

/** matchMedia-Attrappe mit auslösbarem change-Ereignis */
function systemDunkel (an) {
  const hoerer = []
  const abfrage = { matches: an, addEventListener: (_t, f) => hoerer.push(f) }
  window.matchMedia = vi.fn(() => abfrage)
  return (neu) => { abfrage.matches = neu; hoerer.forEach((f) => f({ matches: neu })) }
}

async function laden () {
  vi.resetModules()
  return import('../../src/composables/useAppDarstellung.js')
}

describe('useAppDarstellung', () => {
  const html = document.documentElement
  let altMatchMedia
  beforeEach(() => { altMatchMedia = window.matchMedia; localStorage.clear(); delete html.dataset.appDarstellung; delete html.dataset.theme })
  afterEach(() => { window.matchMedia = altMatchMedia })

  it('ohne gespeicherte Wahl gilt „Wie System“ und folgt der Systemeinstellung', async () => {
    const umschalten = systemDunkel(true)
    const { useAppDarstellung } = await laden()
    const { wahl, dunkel } = useAppDarstellung()
    expect(wahl.value).toBe('system')
    expect(dunkel.value).toBe(true)
    expect(html.dataset.appDarstellung).toBe('dunkel')
    expect(html.dataset.theme).toBe('dark')
    umschalten(false)
    await nextTick()
    expect(html.dataset.appDarstellung).toBe('hell')
    expect(html.dataset.theme).toBe('light')
  })

  it('merkt die Wahl und setzt keine Theme-Klasse am Dokument', async () => {
    systemDunkel(false)
    const { useAppDarstellung } = await laden()
    const { wahl } = useAppDarstellung()
    wahl.value = 'dunkel'
    await nextTick()
    expect(localStorage.getItem(SCHLUESSEL)).toBe('dunkel')
    expect(html.dataset.appDarstellung).toBe('dunkel')
    expect(html.className).not.toMatch(/neo-(light|dark)-theme/)
  })

  it('liest eine gespeicherte Wahl; Unbekanntes fällt auf „Wie System“ zurück', async () => {
    systemDunkel(true)
    localStorage.setItem(SCHLUESSEL, 'hell')
    let m = await laden()
    expect(m.useAppDarstellung().wahl.value).toBe('hell')
    expect(html.dataset.appDarstellung).toBe('hell')
    localStorage.setItem(SCHLUESSEL, 'lila')
    m = await laden()
    expect(m.useAppDarstellung().wahl.value).toBe('system')
  })

  it('bietet die drei Darstellungen mit deutschen Namen an', async () => {
    systemDunkel(false)
    const { DARSTELLUNGEN } = await laden()
    expect(DARSTELLUNGEN.map((d) => d.label)).toEqual(['Hell', 'Dunkel', 'Wie System'])
  })
})
