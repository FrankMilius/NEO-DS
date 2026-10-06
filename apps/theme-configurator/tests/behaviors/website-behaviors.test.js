/**
 * Website-Bauteile aus dem Drupal-Theme in neo-behaviors (Entscheidung
 * 06.10.2026): overlay-verhalten (mobile-drawer, table-info-modal),
 * multiselect-verhalten, website-verhalten (chapter-nav, expanding-panels,
 * feature-accordion). Gebunden wird an das Markup, das die Arena im Modus
 * „Ausprobieren" aus dem Recipe baut; jede Taste aus `keyboard` und jedes
 * Ereignis aus `events` wird geprueft. Soll ist das heutige Verhalten in
 * neo_fe/js/neo-theme.js, mit den Verbesserungen fuer Barrierefreiheit.
 */
import { describe, it, expect, afterEach } from 'vitest'
import { anbinden, abbinden, BEHAVIORS, NUR_AUSDRUECKLICH } from 'neo-behaviors'
import { buehne, lebendigesMarkup, taste, deckeTastenAb, sammle, passtZumRecipe } from './_helfer.js'

afterEach(() => { document.body.innerHTML = ''; document.body.className = '' })

const klick = (el) => el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))

describe('Website-Bauteile: nur ausdruecklich in Drupal', () => {
  it('jedes Website-Bauteil traegt nurAusdruecklich und steht in NUR_AUSDRUECKLICH', () => {
    for (const id of ['mobile-drawer']) {
      expect(BEHAVIORS[id].nurAusdruecklich, id).toBe(true)
      expect(NUR_AUSDRUECKLICH).toContain(id)
    }
    expect(NUR_AUSDRUECKLICH).not.toContain('tabs')
  })
})

describe('Mobile-Drawer (mobile-drawer-recipe.json)', () => {
  const bau = () => {
    const b = buehne(lebendigesMarkup('mobile-drawer', 'zustand'))
    anbinden(b, ['mobile-drawer'])
    return {
      b,
      knopf: /** @type {HTMLButtonElement} */ (b.querySelector('[aria-controls]')),
      drawer: /** @type {HTMLElement} */ (b.querySelector('.nc-mobile-drawer')),
      hinten: /** @type {HTMLElement} */ (b.querySelector('.nc-mobile-drawer__backdrop'))
    }
  }

  it('geschlossen: inert, aria-hidden, Knopf aria-expanded=false; Rolle dialog + aria-modal', () => {
    const { knopf, drawer } = bau()
    expect(drawer.hasAttribute('inert')).toBe(true)
    expect(drawer.getAttribute('aria-hidden')).toBe('true')
    expect(drawer.getAttribute('role')).toBe('dialog')
    expect(drawer.getAttribute('aria-modal')).toBe('true')
    expect(knopf.getAttribute('aria-expanded')).toBe('false')
  })

  it('Knopf oeffnet: Klassen wie neo-theme.js, Fokus in den Drawer, Rest inert, body.u-no-scroll; Ereignis', () => {
    const { b, knopf, drawer, hinten } = bau()
    const auf = sammle(drawer, 'mobile-drawer-open')
    knopf.focus(); klick(knopf)
    expect(drawer.classList.contains('nc-mobile-drawer--open')).toBe(true)
    expect(hinten.classList.contains('nc-mobile-drawer__backdrop--visible')).toBe(true)
    expect(drawer.getAttribute('aria-hidden')).toBe('false')
    expect(drawer.hasAttribute('inert')).toBe(false)
    expect(knopf.getAttribute('aria-expanded')).toBe('true')
    expect(document.body.classList.contains('u-no-scroll')).toBe(true)
    expect(document.activeElement).toBe(drawer.querySelector('.nc-mobile-drawer__close'))
    expect(knopf.hasAttribute('inert')).toBe(true)
    expect(hinten.hasAttribute('inert')).toBe(false)
    expect(auf).toHaveLength(1)
    passtZumRecipe('mobile-drawer', auf[0])
    expect(b.querySelector('.ra-buehne').hasAttribute('inert')).toBe(false)
  })

  it('Escape, Schliessen-Knopf und Backdrop schliessen; Fokus zurueck, Rest frei; Ereignis mit reason', () => {
    const { knopf, drawer, hinten } = bau()
    const zu = sammle(drawer, 'mobile-drawer-close')
    for (const [schliesse, grund] of [
      [() => taste(drawer.querySelector('.nc-mobile-drawer__link'), 'Escape'), 'escape'],
      [() => klick(drawer.querySelector('.nc-mobile-drawer__close')), 'close-button'],
      [() => klick(hinten), 'overlay-click']
    ]) {
      knopf.focus(); klick(knopf)
      schliesse()
      expect(drawer.classList.contains('nc-mobile-drawer--open'), grund).toBe(false)
      expect(hinten.classList.contains('nc-mobile-drawer__backdrop--visible')).toBe(false)
      expect(drawer.hasAttribute('inert')).toBe(true)
      expect(knopf.hasAttribute('inert')).toBe(false)
      expect(document.body.classList.contains('u-no-scroll')).toBe(false)
      expect(document.activeElement).toBe(knopf)
      expect(zu.at(-1).detail.reason).toBe(grund)
      passtZumRecipe('mobile-drawer', zu.at(-1))
    }
  })

  it('Tasten aus dem Recipe', () => {
    const { knopf, drawer } = bau()
    const pruefungen = {
      Enter: () => { taste(knopf, 'Enter'); expect(drawer.classList.contains('nc-mobile-drawer--open')).toBe(true); klick(knopf) },
      Space: () => { taste(knopf, 'Space'); expect(drawer.classList.contains('nc-mobile-drawer--open')).toBe(true) },
      Tab: () => {
        const liste = [...drawer.querySelectorAll('button, a[href]')]
        liste.at(-1).focus()
        const e = taste(liste.at(-1), 'Tab')
        expect(e.defaultPrevented).toBe(true)
        expect(document.activeElement).toBe(liste[0])
      },
      'Shift+Tab': () => {
        const liste = [...drawer.querySelectorAll('button, a[href]')]
        liste[0].focus()
        taste(liste[0], 'Shift+Tab')
        expect(document.activeElement).toBe(liste.at(-1))
      },
      Escape: () => { taste(document.activeElement, 'Escape'); expect(drawer.classList.contains('nc-mobile-drawer--open')).toBe(false) }
    }
    deckeTastenAb('mobile-drawer', pruefungen)
    for (const p of ['Enter', 'Space', 'Tab', 'Shift+Tab', 'Escape']) pruefungen[p]()
  })

  it('zweiter Klick auf den Knopf schliesst (Umschalter); Abbinden stellt den Ausgangszustand her', () => {
    const { b, knopf, drawer } = bau()
    klick(knopf)
    const zu = sammle(drawer, 'mobile-drawer-close')
    // der Knopf ist inert — programmatisch geklickt (z. B. zweiter Umschalter im Header)
    klick(knopf)
    expect(zu.at(-1).detail.reason).toBe('trigger')
    klick(knopf)
    abbinden(b, ['mobile-drawer'])
    expect(knopf.hasAttribute('inert')).toBe(false)
    expect(drawer.hasAttribute('inert')).toBe(false)
    expect(drawer.hasAttribute('role')).toBe(false)
    expect(drawer.getAttribute('aria-hidden')).toBe('true')
    expect(document.body.classList.contains('u-no-scroll')).toBe(false)
  })
})
