// UX-34 (19.10.2026): Wirkung einer Paletten-Änderung nachvollziehbar —
// Bühne zeigt Paletten und Website-Ausschnitt, 11 Stufen, Name folgt dem Wert
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { useThemeStore } from '../../src/stores/theme.js'
import FoundationColors from '../../src/components/foundation/FoundationColors.vue'
import FarbenArena from '../../src/components/laboratory/foundation/FarbenArena.vue'
import { palettenName, websiteStufen, paletteSkala, erzeugeSkala, WEBSITE_STUFEN } from '../../src/utils/farbskala.js'
import { primitiveColors } from '../../src/data/tokens.js'

const NEO_AKZENT = primitiveColors.accent.base

describe('farbskala: Namen und Stufen', () => {
  it('der NEO-Name gilt nur für den NEO-Wert', () => {
    expect(palettenName('accent', NEO_AKZENT)).toBe('Akzent · Neo Lime')
    expect(palettenName('accent', '#e06060')).toBe('Akzent · eigene Farbe')
    expect(palettenName('primary', primitiveColors.primary.base)).toBe('Primär · Graphit')
  })
  it('Anzeige: 11 Stufen für NEO-Leiter und erzeugte Skala', () => {
    expect(Object.keys(erzeugeSkala('#e06060'))).toHaveLength(19)
    expect(websiteStufen(erzeugeSkala('#e06060')).map((s) => s.step)).toEqual(WEBSITE_STUFEN)
    expect(websiteStufen(paletteSkala('accent', NEO_AKZENT)).map((s) => s.step)).toEqual(WEBSITE_STUFEN)
  })
})

describe('Farbeditor und Bühne', () => {
  let store, w
  beforeEach(() => {
    localStorage.clear(); store = useThemeStore(); store.resetToDefaults()
    store.state.activeThemeSet = 'neo'; store.state.currentThemeMeta = { id: 'kunde', name: 'Kunde' }
    store.state.colorActiveTab = 'primitives'; store.state.activeSection = 'foundation-colors'
  })
  afterEach(() => { w?.unmount(); w = null; store.state.currentThemeMeta = null })

  it('Karte: Rolle als Name, Herkunft, 11 Stufen — auch nach dem Ändern; Zurücksetzen holt den NEO-Wert', async () => {
    w = mount(FoundationColors)
    const karte = () => w.find('[data-test="markenpalette-accent"]')
    expect(karte().find('.primitive-label').text()).toBe('Akzent')
    expect(karte().find('[data-test="palette-herkunft-accent"]').text()).toBe('Neo Lime (NEO-Standard)')
    expect(karte().findAll('.shade-chip')).toHaveLength(11)
    expect(karte().find('[data-test="palette-zuruecksetzen-accent"]').exists()).toBe(false)

    store.updatePrimitive('accent', '#e06060'); await nextTick()
    expect(karte().find('.primitive-label').text()).toContain('geändert')
    expect(karte().find('[data-test="palette-herkunft-accent"]').text()).toBe(`Eigene Farbe – NEO-Standard: Neo Lime (${NEO_AKZENT})`)
    expect(karte().findAll('.shade-chip')).toHaveLength(11)
    expect(karte().find('input[aria-label="Akzent: HEX-Wert"]').element.value).toBe('#e06060')

    await karte().find('[data-test="palette-zuruecksetzen-accent"]').trigger('click')
    expect(store.currentPrimitives.accent.toLowerCase()).toBe(NEO_AKZENT.toLowerCase())
    expect(store.state.themes.neo.light['background-accent'].toLowerCase()).toBe(NEO_AKZENT.toLowerCase())
  })

  it('Bühne im Reiter Grundfarben: Paletten mit NEO-Vergleich und Website-Ausschnitt, der mitzieht', async () => {
    w = mount(FarbenArena)
    expect(w.find('[data-test="grundfarben-buehne"]').exists()).toBe(true)
    expect(w.findAll('[data-test="grundfarben-palette-accent"] .gb-leiste')).toHaveLength(1)
    const knopf = () => w.findAll('[data-test="grundfarben-website-hell"] .gb-knopf')[1].attributes('style')
    expect(knopf()).toContain('background: #37e93d')

    store.updatePrimitive('accent', '#e06060'); await nextTick()
    const pal = w.find('[data-test="grundfarben-palette-accent"]')
    expect(pal.find('strong').text()).toBe('Akzent · eigene Farbe')
    expect(pal.findAll('.gb-leiste')).toHaveLength(2)
    expect(pal.findAll('.gb-leiste')[0].findAll('li')).toHaveLength(11)
    expect(knopf()).toContain('background: #e06060')
  })
})
