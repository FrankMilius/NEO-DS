/**
 * Theme-Achse in der RecipeArena: Specimens mit theme/surface = inverse/dark
 * erscheinen dunkel. Das DS schaltet dunkle Bereiche ueber die Theme-Klasse
 * am Wrapper (.neo-dark-theme bindet --fnd-color-* lokal neu); Drupal setzt
 * dafuer „neo-dark-theme neo-surface" an den Block-Wrapper. Vordergrund-
 * Varianten (color=inverse, render.bgVariant=dark) bekommen dagegen
 * background-inverse im aktuellen Theme — in .neo-dark-theme kippte inverse.
 */
import { describe, it, expect } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import RecipeArena from '../../src/components/laboratory/RecipeArena.vue'
import { normalisiereRecipe, specimenAnsicht, zellenFlaeche, flaecheKlassen } from '../../src/lib/recipe-arena.js'
import { vorlageFuer } from '../../src/arena-templates/index.js'
import { rohesRecipe } from './_recipes.js'
import { useThemeStore } from '../../src/stores/theme.js'

function zellen (id, specimenId) {
  const r = normalisiereRecipe(rohesRecipe(id))
  const sp = r.specimens.find((s) => s.id === specimenId)
  return specimenAnsicht(sp, r, id, vorlageFuer(id)).zeilen.flatMap((z) => z.zellen)
}

describe('zellenFlaeche', () => {
  it('footer: theme=inverse ist dunkel, theme=light folgt der Vorschau', () => {
    expect(zellen('footer', 'simple-dark').map((z) => z.flaeche)).toEqual(['dunkel'])
    expect(zellen('footer', 'columns-4-dark').every((z) => z.flaeche === 'dunkel')).toBe(true)
    expect(zellen('footer', 'simple-light').map((z) => z.flaeche)).toEqual([null])
    const vergleich = zellen('footer', 'theme-comparison')
    expect(vergleich.map((z) => [z.axisValues.theme, z.flaeche])).toEqual(
      vergleich.map((z) => [z.axisValues.theme, z.axisValues.theme === 'inverse' ? 'dunkel' : null])
    )
  })

  it('surface=dark (app-store) ist dunkel', () => {
    expect(zellenFlaeche({ axisValues: { surface: 'dark' } }, {})).toBe('dunkel')
    expect(zellenFlaeche({ axisValues: { surface: 'light' } }, {})).toBe(null)
  })

  it('Vordergrund inverse: bgVariant=dark und Farbvergleich invers, Komposition nicht', () => {
    expect(zellen('spinner', 'inverse-on-dark').every((z) => z.flaeche === 'invers')).toBe(true)
    expect(zellen('spinner', 'in-button').map((z) => z.flaeche)).toEqual([null, null])
    const farben = zellen('icon', 'color-variants')
    expect(farben.find((z) => z.axisValues.color === 'inverse').flaeche).toBe('invers')
    expect(farben.find((z) => z.axisValues.color === 'primary').flaeche).toBe(null)
  })

  it('Klassen: dunkel = neo-dark-theme + neo-surface, invers ohne Theme-Wechsel', () => {
    expect(flaecheKlassen('dunkel').split(' ')).toEqual(expect.arrayContaining(['neo-dark-theme', 'neo-surface']))
    expect(flaecheKlassen('invers')).not.toContain('neo-dark-theme')
    expect(flaecheKlassen(null)).toBe('')
  })
})

describe('RecipeArena: dunkle Zellen im DOM', () => {
  it('footer „Simple (Dark)" steht in einem neo-dark-theme-Wrapper', async () => {
    const w = mount(RecipeArena, { props: { componentId: 'footer' } })
    for (const bis = Date.now() + 8000; !w.find('.ra-specimen').exists() && Date.now() < bis;) { // Zeitlimit statt Rundenzahl (Last)
      await flushPromises()
      await new Promise((r) => setTimeout(r, 5))
    }
    const dunkel = w.find('.ra-cell[data-specimen-id="simple-dark"] .ra-live-component')
    expect(dunkel.classes()).toEqual(expect.arrayContaining(['neo-dark-theme', 'neo-surface']))
    expect(dunkel.attributes('data-flaeche')).toBe('dunkel')
    expect(dunkel.find('.nc-footer.nc-footer--inverse').exists()).toBe(true)
    const hell = w.find('.ra-cell[data-specimen-id="simple-light"] .ra-live-component')
    expect(hell.classes()).not.toContain('neo-dark-theme')
    expect(hell.attributes('data-flaeche')).toBeUndefined()
    w.unmount()
  })
})

describe('RecipeArena: Split-Modus', () => {
  it('zeigt jede Vorschau hell und dunkel nebeneinander', async () => {
    const store = useThemeStore()
    store.state.previewMode = 'split'
    try {
      const w = mount(RecipeArena, { props: { componentId: 'badge' } })
      for (const bis = Date.now() + 8000; !w.find('.ra-specimen').exists() && Date.now() < bis;) { // Zeitlimit statt Rundenzahl (Last)
        await flushPromises()
        await new Promise((r) => setTimeout(r, 5))
      }
      const erstes = w.find('.ra-specimen')
      const themen = erstes.findAll('.ra-preview').map((p) => p.attributes('data-thema'))
      expect(themen).toEqual(['neo-light-theme', 'neo-dark-theme'])
      const [hell, dunkel] = erstes.findAll('.ra-preview')
      expect(hell.findAll('.ra-cell').length).toBe(dunkel.findAll('.ra-cell').length)
      w.unmount()
    } finally {
      store.state.previewMode = 'light'
    }
  })
})
