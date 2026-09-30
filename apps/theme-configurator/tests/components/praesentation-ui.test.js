// Bereich Praesentation in der Oberflaeche (Plan v2, 2.5): Navigation,
// Inspector und Buehne haengen am selben Getter.
import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { useThemeStore } from '../../src/stores/theme.js'
import { navigationTree } from '../../src/data/tokens.js'
import { loeseAuf } from '../../src/utils/praes-ref.js'
import PraesentationLab from '../../src/components/foundation/PraesentationLab.vue'
import PraesentationInspector from '../../src/components/foundation/PraesentationInspector.vue'

let store
beforeEach(() => {
  store = useThemeStore()
  store.state.activeThemeSet = 'neo'
  store.resetPraesentation()
})

describe('Navigation', () => {
  it('Foundation hat den Punkt "Präsentation"', () => {
    const foundation = navigationTree.find((g) => g.children?.some((c) => c.section === 'foundation-grid'))
    const punkt = foundation.children.find((c) => c.section === 'foundation-praesentation')
    expect(punkt?.label).toBe('Präsentation')
  })
})

describe('PraesentationLab', () => {
  it('rendert die Buehne 1920 x 1080 mit Farben aus dem Getter', () => {
    const w = mount(PraesentationLab)
    const buehne = w.get('[data-test="buehne"]')
    const stil = buehne.attributes('style')
    expect(stil).toContain('width: 1920px')
    expect(stil).toContain('height: 1080px')
    expect(stil).toMatch(/scale\(/)
    expect(stil.toLowerCase()).toContain(loeseAuf('mint.100').toLowerCase()) // Wissen hell
    w.unmount()
  })

  it('zeigt eine geaenderte Farbe sofort als Style', async () => {
    const w = mount(PraesentationLab)
    const neu = loeseAuf('mustard.200').toLowerCase()
    expect(w.get('[data-test="buehne"]').attributes('style').toLowerCase()).not.toContain(neu)
    store.updatePraesentation('welten.wissen.hell', 'mustard.200')
    await nextTick()
    expect(w.get('[data-test="buehne"]').attributes('style').toLowerCase()).toContain(neu)
    w.unmount()
  })

  it('Diagrammfolie nutzt die Farbfolge, Raster und Zonen lassen sich zuschalten', async () => {
    const w = mount(PraesentationLab)
    await w.findAll('.pl-knopf').find((b) => b.text() === 'Balkendiagramm').trigger('click')
    expect(w.findAll('.pl-balken')).toHaveLength(6)
    store.updatePraesentation('diagramm.farbfolge', ['lime.500', 'graphit.300', 'graphit.200', 'graphit.400', 'graphit.600', 'graphit.700'])
    await nextTick()
    expect(w.get('[data-test="buehne"]').attributes('style').toLowerCase()).toContain(`--p-reihe-1: ${loeseAuf('lime.500').toLowerCase()}`)
    expect(w.find('[data-test="raster"]').exists()).toBe(false)
    const [raster, zonen] = w.findAll('.pl-check input')
    await raster.setValue(true)
    await zonen.setValue(true)
    expect(w.findAll('.pl-raster-feld')).toHaveLength(6)
    expect(w.findAll('.pl-zone').length).toBe(6)
    w.unmount()
  })

  it('Dichtestufe setzt px = pt x 2', async () => {
    const w = mount(PraesentationLab)
    expect(w.get('[data-test="buehne"]').attributes('style')).toContain('--p-titel-px: 72px')
    await w.findAll('.pl-knopf').find((b) => b.text() === 'Versand').trigger('click')
    expect(w.get('[data-test="buehne"]').attributes('style')).toContain('--p-titel-px: 60px')
    w.unmount()
  })
})

describe('PraesentationInspector', () => {
  it('Farbwahl schreibt einen Verweis in den Store, Zuruecksetzen raeumt auf', async () => {
    const w = mount(PraesentationInspector)
    // erste Farbwahl = Welt Menschen, hell -> Stufe waehlen
    const stufe = w.findAll('select.pf-select--stufe')[0]
    await stufe.setValue('200')
    expect(store.currentPraesentation.welten.menschen.hell).toBe('mustard.200')
    const reset = w.get('.pi-reset')
    expect(reset.attributes('disabled')).toBeUndefined()
    await reset.trigger('click')
    expect(store.currentPraesentation.welten.menschen.hell).toBe('mustard.100')
    w.unmount()
  })

  it('zeigt Kontrastwerte und verschiebt die Farbfolge', async () => {
    const w = mount(PraesentationInspector)
    expect(w.get('[data-test="kontrast-hell-rot-text"]').text()).toMatch(/\d+,\d{2} : 1/)
    await w.findAll('.pi-pfeil')[1].trigger('click') // Reihe 1 nach unten
    expect(store.currentPraesentation.diagramm.farbfolge.slice(0, 2)).toEqual(['graphit.300', 'graphit.400'])
    w.unmount()
  })
})
