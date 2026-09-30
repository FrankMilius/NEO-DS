/**
 * Form-Bausteine ohne eigene Arena werden ueber die RecipeArena aus ihrem
 * Recipe dargestellt (Entscheidung 29.09.2026: keine neuen Einzel-Arenen,
 * datengetrieben statt 9 weiterer Vue-Dateien). Der Test sichert, dass jede
 * Form-Seite in der Konfig-App tatsaechlich Specimens mit Markup rendert.
 */
import { describe, it, expect } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import RecipeArena from '../../src/components/laboratory/RecipeArena.vue'
import { hasArena } from '../../src/composables/useArenaResolver.js'

const FORM_BAUSTEINE = [
  'form', 'form-section', 'form-label', 'form-hint', 'form-error',
  'form-actions', 'form-block', 'checkbox-group', 'radio-group', 'fieldset'
]

describe('Form-Bausteine in der Konfig-App', () => {
  for (const id of FORM_BAUSTEINE) {
    it(`${id}: rendert Specimens aus dem Recipe`, async () => {
      if (hasArena(id)) return // eigene Arena vorhanden (z. B. fieldset)
      const w = mount(RecipeArena, { props: { componentId: id } })
      for (let i = 0; i < 20 && !w.find('.ra-specimen').exists(); i++) {
        await flushPromises()
        await new Promise((r) => setTimeout(r, 10))
      }
      const specimens = w.findAll('.ra-specimen')
      expect(specimens.length, `${id}: keine Specimens`).toBeGreaterThan(0)
      expect(w.findAll('.ra-cell').length, `${id}: keine Zellen`).toBeGreaterThan(0)
      expect(w.html()).toContain(`nc-${id}`)
    })
  }
})
