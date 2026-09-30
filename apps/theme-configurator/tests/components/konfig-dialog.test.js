/**
 * Dialog-Grundlage und Bestaetigungen statt alert/confirm (Plan v2, 4.4)
 */
import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { nextTick } from 'vue'
import KonfigDialog from '../../src/components/ui/KonfigDialog.vue'
import KonfigBestaetigung from '../../src/components/ui/KonfigBestaetigung.vue'
import { bestaetigen, hinweisen, _zuruecksetzen } from '../../src/composables/useBestaetigung.js'
import SidebarNav from '../../src/components/layout/SidebarNav.vue'
import { useThemeStore } from '../../src/stores/theme.js'

const wrappers = []
function montiere (k, opts = {}) {
  const w = mount(k, { attachTo: document.body, ...opts })
  wrappers.push(w)
  return w
}
const esc = () => (document.activeElement || document.body).dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }))

beforeEach(() => _zuruecksetzen())
afterEach(() => { while (wrappers.length) wrappers.pop().unmount(); _zuruecksetzen(); document.body.innerHTML = '' })

describe('KonfigDialog', () => {
  it('ist ein beschrifteter modaler Dialog', async () => {
    const w = montiere(KonfigDialog, { props: { offen: true, titel: 'Theme löschen', beschreibung: 'Wirklich?' }, slots: { fuss: '<button>OK</button>' } })
    await nextTick()
    const d = w.find('[role="dialog"]')
    expect(d.attributes('aria-modal')).toBe('true')
    const titelId = d.attributes('aria-labelledby')
    expect(w.find(`#${titelId}`).text()).toBe('Theme löschen')
    expect(w.find(`#${d.attributes('aria-describedby')}`).text()).toBe('Wirklich?')
    expect(w.find('.konfig-dialog__schliessen').attributes('aria-label')).toBe('Dialog schließen')
  })

  it('Escape, Schliessen-Knopf und Hintergrund melden „schliessen“', async () => {
    const w = montiere(KonfigDialog, { props: { offen: false, titel: 'X' } })
    await w.setProps({ offen: true }); await nextTick()
    esc()
    await w.find('.konfig-dialog__schliessen').trigger('click')
    await w.find('[data-test="konfig-dialog-hintergrund"]').trigger('click')
    expect(w.emitted('schliessen')).toHaveLength(3)
  })

  it('setzt den Fokus beim Oeffnen hinein und danach zurueck', async () => {
    const ausloeser = document.createElement('button')
    document.body.appendChild(ausloeser)
    ausloeser.focus()
    const w = montiere(KonfigDialog, { props: { offen: false, titel: 'X' } })
    await w.setProps({ offen: true }); await nextTick()
    expect(w.element.parentElement.querySelector('.konfig-dialog').contains(document.activeElement)).toBe(true)
    await w.setProps({ offen: false }); await nextTick(); await nextTick()
    expect(document.activeElement).toBe(ausloeser)
  })
})

describe('bestaetigen() / hinweisen() ersetzen confirm/alert', () => {
  it('liefert true bei „Bestätigen“', async () => {
    const w = montiere(KonfigBestaetigung)
    const ergebnis = bestaetigen({ titel: 'Branch löschen?', text: 'Endgültig.', bestaetigenText: 'Löschen' })
    await flushPromises()
    expect(w.find('[role="alertdialog"]').exists()).toBe(true)
    expect(w.text()).toContain('Branch löschen?')
    expect(w.find('[data-test="bestaetigung-ok"]').text()).toBe('Löschen')
    await w.find('[data-test="bestaetigung-ok"]').trigger('click')
    await expect(ergebnis).resolves.toBe(true)
    await flushPromises()
    expect(w.find('[role="alertdialog"]').exists()).toBe(false)
  })

  it('liefert false bei „Abbrechen“ und bei Escape', async () => {
    const w = montiere(KonfigBestaetigung)
    const a = bestaetigen({ titel: 'A' })
    await flushPromises()
    await w.find('[data-test="bestaetigung-abbrechen"]').trigger('click')
    await expect(a).resolves.toBe(false)

    const b = bestaetigen({ titel: 'B' })
    await flushPromises(); await nextTick()
    esc()
    await expect(b).resolves.toBe(false)
  })

  it('Startfokus: „Abbrechen“ bei gefährlichen Aktionen, sonst „Bestätigen“', async () => {
    const w = montiere(KonfigBestaetigung)
    bestaetigen({ titel: 'Gefahr', gefaehrlich: true })
    await flushPromises(); await nextTick()
    expect(document.activeElement.dataset.test).toBe('bestaetigung-abbrechen')
    await w.find('[data-test="bestaetigung-abbrechen"]').trigger('click')
    await flushPromises(); await nextTick()

    bestaetigen({ titel: 'Harmlos' })
    await flushPromises(); await nextTick()
    expect(document.activeElement.dataset.test).toBe('bestaetigung-ok')
  })

  it('hinweisen() zeigt nur „OK“ und wird danach erfüllt', async () => {
    const w = montiere(KonfigBestaetigung)
    const h = hinweisen({ titel: 'Speichern fehlgeschlagen', text: 'Netzwerkfehler' })
    await flushPromises()
    expect(w.find('[data-test="bestaetigung-abbrechen"]').exists()).toBe(false)
    expect(w.text()).toContain('Netzwerkfehler')
    await w.find('[data-test="bestaetigung-ok"]').trigger('click')
    await expect(h).resolves.toBeUndefined()
  })

  it('zeigt mehrere Anfragen nacheinander', async () => {
    const w = montiere(KonfigBestaetigung)
    const eins = bestaetigen({ titel: 'Eins' })
    const zwei = bestaetigen({ titel: 'Zwei' })
    await flushPromises()
    expect(w.text()).toContain('Eins')
    await w.find('[data-test="bestaetigung-ok"]').trigger('click')
    await flushPromises()
    expect(w.text()).toContain('Zwei')
    await w.find('[data-test="bestaetigung-abbrechen"]').trigger('click')
    await expect(eins).resolves.toBe(true)
    await expect(zwei).resolves.toBe(false)
  })

  it('SidebarNav: „Reset to Defaults“ setzt nur nach Bestätigung zurück', async () => {
    const confirmSpy = vi.fn(() => true)
    const vorher = window.confirm
    window.confirm = confirmSpy
    const store = useThemeStore()
    const reset = vi.spyOn(store, 'resetToDefaults').mockImplementation(() => {})
    const host = montiere(KonfigBestaetigung)
    const nav = montiere(SidebarNav)

    await nav.find('.btn-reset').trigger('click')
    await flushPromises()
    await host.find('[data-test="bestaetigung-abbrechen"]').trigger('click')
    await flushPromises()
    expect(reset).not.toHaveBeenCalled()

    await nav.find('.btn-reset').trigger('click')
    await flushPromises()
    await host.find('[data-test="bestaetigung-ok"]').trigger('click')
    await flushPromises()
    expect(reset).toHaveBeenCalledTimes(1)
    expect(confirmSpy).not.toHaveBeenCalled()
    window.confirm = vorher
  })
})
