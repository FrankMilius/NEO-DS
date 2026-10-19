// Frank, 19.10.2026: Die Bühne zeigt immer nur das geöffnete Theme. Ein
// Kunden-Theme liegt in der Variante „neo“; die Variante „Kunde“ gibt es nur
// lokal (E3). Vorher stand das Kunden-Theme unter „NEO“ und unveränderte
// Standardwerte unter „Customer“.
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'

const betrieb = vi.hoisted(() => ({ art: 'lokal' }))
vi.mock('../../src/speicher/index.js', async (orig) => ({ ...(await orig()), speicher: () => ({ art: betrieb.art, faehigkeiten: {} }) }))

const { useThemeStore } = await import('../../src/stores/theme.js')
const { useVorschauKombinationen } = await import('../../src/composables/useVorschauKombinationen.js')
const ThemesBuehne = (await import('../../src/components/laboratory/foundation/ThemesBuehne.vue')).default

let store, w
const lies = () => { let r; mount({ setup () { r = useVorschauKombinationen(); return () => null } }); return r }
beforeEach(() => { store = useThemeStore(); store.resetToDefaults(); store.state.activeThemeSet = 'neo'; store.state.currentThemeMeta = { id: 'kundentheme_neu', name: 'Kundentheme NEU' } })
afterEach(() => { w?.unmount(); w = null; betrieb.art = 'lokal'; store.state.currentThemeMeta = null })

describe('Drupal: nur das geöffnete Theme, Hell und Dunkel', () => {
  it('zwei Kombinationen aus der Variante neo, beschriftet mit dem Theme-Namen', () => {
    betrieb.art = 'drupal'
    const k = lies()
    expect(k.variantenSichtbar).toBe(false)
    expect(k.alle.value.map((x) => [x.klasse, x.label])).toEqual([
      ['neo-light-theme', 'Kundentheme NEU · Hell'],
      ['neo-dark-theme', 'Kundentheme NEU · Dunkel'],
    ])
    expect(k.fuerModus('matrix')).toHaveLength(2)
  })
  it('Themes-Bühne zeigt keine Variante „Kunde“ mit Standardwerten', () => {
    betrieb.art = 'drupal'
    store.state.themes.neo.light['interactive-default'] = '#123456'
    w = mount(ThemesBuehne)
    const felder = w.findAll('[data-test^="website-ausschnitt-"]')
    expect(felder.map((f) => f.attributes('data-test'))).toEqual(['website-ausschnitt-neo-light', 'website-ausschnitt-neo-dark'])
    expect(felder[0].attributes('style')).toContain('#123456')
    expect(w.text()).toContain('Kundentheme NEU · Hell')
    expect(w.text()).not.toMatch(/Customer|Kunde · /)
  })
})

describe('Lokal: beide Varianten des geöffneten Themes', () => {
  it('vier Kombinationen, beschriftet mit Theme, Variante und Modus', () => {
    const k = lies()
    expect(k.alle.value.map((x) => x.label)).toEqual([
      'Kundentheme NEU · NEO · Hell', 'Kundentheme NEU · NEO · Dunkel',
      'Kundentheme NEU · Kunde · Hell', 'Kundentheme NEU · Kunde · Dunkel',
    ])
    store.state.activeThemeSet = 'customer'
    expect(k.fuerModus('split').map((x) => x.klasse)).toEqual(['customer-light-theme', 'customer-dark-theme'])
  })
  it('ohne geöffnetes Theme: NEO · Hell …', () => {
    store.state.currentThemeMeta = null
    expect(lies().fuerModus('light')[0].label).toBe('NEO · Hell')
  })
})
