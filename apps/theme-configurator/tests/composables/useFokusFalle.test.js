/**
 * Fokus-Falle fuer Dialoge (Plan v2, 4.4): Fokus hinein, Tab-Zyklus,
 * Escape, Fokus-Rueckgabe, nur die oberste Falle reagiert.
 */
import { describe, it, expect, vi, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h, ref, nextTick } from 'vue'
import { useFokusFalle, fokussierbareElemente, _aktiveFallen } from '../../src/composables/useFokusFalle.js'

function testDialog ({ beiEscape = vi.fn(), startFokus } = {}) {
  return defineComponent({
    props: { offen: Boolean },
    setup (props) {
      const container = ref(null)
      useFokusFalle(container, () => props.offen, { beiEscape, startFokus })
      return () => props.offen
        ? h('div', { ref: container, role: 'dialog', 'aria-modal': 'true', 'data-test': 'dialog' }, [
            h('button', { id: 'erster' }, 'Eins'),
            h('input', { id: 'feld', 'aria-label': 'Feld' }),
            h('button', { disabled: true }, 'Aus'),
            h('button', { id: 'letzter' }, 'Drei')
          ])
        : null
    }
  })
}

function taste (key, opts = {}) {
  const e = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true, ...opts })
  ;(document.activeElement || document.body).dispatchEvent(e)
  return e
}

const wrappers = []
function montiere (komponente, props) {
  const w = mount(komponente, { props, attachTo: document.body })
  wrappers.push(w)
  return w
}
afterEach(() => { while (wrappers.length) wrappers.pop().unmount(); document.body.innerHTML = '' })

describe('useFokusFalle', () => {
  it('findet nur per Tab erreichbare Elemente', () => {
    const div = document.createElement('div')
    div.innerHTML = '<button>a</button><button disabled>b</button><span tabindex="-1">c</span><a href="#">d</a><div hidden><button>e</button></div><input type="hidden">'
    expect(fokussierbareElemente(div).map(el => el.textContent)).toEqual(['a', 'd'])
  })

  it('setzt den Fokus beim Oeffnen auf das erste Element (oder startFokus)', async () => {
    const w = montiere(testDialog(), { offen: false })
    await w.setProps({ offen: true }); await nextTick()
    expect(document.activeElement.id).toBe('erster')

    const w2 = montiere(testDialog({ startFokus: '#feld' }), { offen: false })
    await w2.setProps({ offen: true }); await nextTick()
    expect(document.activeElement.id).toBe('feld')
  })

  it('haelt Tab und Umschalt+Tab im Dialog (Zyklus)', async () => {
    const w = montiere(testDialog(), { offen: false })
    await w.setProps({ offen: true }); await nextTick()

    document.getElementById('letzter').focus()
    const vor = taste('Tab')
    expect(vor.defaultPrevented).toBe(true)
    expect(document.activeElement.id).toBe('erster')

    const zurueck = taste('Tab', { shiftKey: true })
    expect(zurueck.defaultPrevented).toBe(true)
    expect(document.activeElement.id).toBe('letzter')

    // Mitten im Dialog bleibt Tab dem Browser ueberlassen
    document.getElementById('feld').focus()
    expect(taste('Tab').defaultPrevented).toBe(false)
  })

  it('holt den Fokus zurueck, wenn er ausserhalb liegt', async () => {
    const draussen = document.createElement('button')
    document.body.appendChild(draussen)
    const w = montiere(testDialog(), { offen: false })
    await w.setProps({ offen: true }); await nextTick()
    draussen.focus()
    taste('Tab')
    expect(document.activeElement.id).toBe('erster')
  })

  it('Escape ruft beiEscape auf', async () => {
    const beiEscape = vi.fn()
    const w = montiere(testDialog({ beiEscape }), { offen: false })
    await w.setProps({ offen: true }); await nextTick()
    const e = taste('Escape')
    expect(beiEscape).toHaveBeenCalledTimes(1)
    expect(e.defaultPrevented).toBe(true)
  })

  it('gibt den Fokus beim Schliessen an den Ausloeser zurueck', async () => {
    const ausloeser = document.createElement('button')
    ausloeser.id = 'ausloeser'
    document.body.appendChild(ausloeser)
    ausloeser.focus()

    const w = montiere(testDialog(), { offen: false })
    await w.setProps({ offen: true }); await nextTick()
    expect(document.activeElement.id).toBe('erster')

    await w.setProps({ offen: false }); await nextTick(); await nextTick()
    expect(document.activeElement).toBe(ausloeser)
    expect(_aktiveFallen()).toBe(0)
  })

  it('nur die oberste von zwei offenen Fallen reagiert auf Escape', async () => {
    const unten = vi.fn()
    const oben = vi.fn()
    const w1 = montiere(testDialog({ beiEscape: unten }), { offen: false })
    await w1.setProps({ offen: true }); await nextTick()
    const w2 = montiere(testDialog({ beiEscape: oben }), { offen: false })
    await w2.setProps({ offen: true }); await nextTick()

    taste('Escape')
    expect(oben).toHaveBeenCalledTimes(1)
    expect(unten).not.toHaveBeenCalled()

    await w2.setProps({ offen: false }); await nextTick()
    taste('Escape')
    expect(unten).toHaveBeenCalledTimes(1)
  })

  it('raeumt beim Unmount auf', async () => {
    const w = montiere(testDialog(), { offen: false })
    await w.setProps({ offen: true }); await nextTick()
    expect(_aktiveFallen()).toBe(1)
    wrappers.pop().unmount()
    expect(_aktiveFallen()).toBe(0)
  })
})
