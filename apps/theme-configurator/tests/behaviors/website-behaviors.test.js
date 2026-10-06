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
    for (const id of ['mobile-drawer', 'table-info-modal']) {
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

describe('Tabellen-Info-Modal (table-info-modal-recipe.json)', () => {
  const bau = () => {
    const b = buehne(lebendigesMarkup('table-info-modal', 'zustand'))
    anbinden(b, ['table-info-modal'])
    return {
      b,
      knopf: /** @type {HTMLButtonElement} */ (b.querySelector('.nc-tbl-cell__info-btn')),
      dialog: /** @type {HTMLElement} */ (b.querySelector('.nc-table-info-modal'))
    }
  }

  it('Info-Knopf oeffnet: Text aus data-info als Absaetze (Text, kein HTML), Name vom Knopf, Fokus auf Schliessen', () => {
    const { knopf, dialog } = bau()
    expect(dialog.hasAttribute('inert')).toBe(true)
    knopf.setAttribute('data-info', knopf.getAttribute('data-info') + '\n<img src=x onerror=alert(1)>')
    const auf = sammle(dialog, 'table-info-modal-open')
    knopf.focus(); klick(knopf)
    expect(dialog.classList.contains('is-open')).toBe(true)
    expect(dialog.getAttribute('aria-hidden')).toBe('false')
    const absaetze = dialog.querySelectorAll('.nc-table-info-modal__body > p')
    expect(absaetze).toHaveLength(3)
    expect(dialog.querySelector('.nc-table-info-modal__body img')).toBeNull()
    expect(absaetze[2].textContent).toBe('<img src=x onerror=alert(1)>')
    expect(dialog.getAttribute('aria-label')).toBe('Mehr Informationen zu Single Sign-on')
    expect(document.activeElement).toBe(dialog.querySelector('.nc-table-info-modal__close'))
    expect(knopf.closest('.nc-tbl-cell').hasAttribute('inert')).toBe(true)
    passtZumRecipe('table-info-modal', auf[0])
  })

  it('Escape, Schliessen-Knopf und Backdrop schliessen; Fokus zurueck zum Info-Knopf', () => {
    const { knopf, dialog } = bau()
    const zu = sammle(dialog, 'table-info-modal-close')
    for (const [schliesse, grund] of [
      [() => taste(dialog.querySelector('.nc-table-info-modal__close'), 'Escape'), 'escape'],
      [() => klick(dialog.querySelector('.nc-table-info-modal__close')), 'close-button'],
      [() => klick(dialog.querySelector('.nc-table-info-modal__backdrop')), 'overlay-click']
    ]) {
      knopf.focus(); klick(knopf)
      schliesse()
      expect(dialog.classList.contains('is-open'), grund).toBe(false)
      expect(dialog.hasAttribute('inert')).toBe(true)
      expect(document.activeElement).toBe(knopf)
      expect(zu.at(-1).detail.reason).toBe(grund)
      passtZumRecipe('table-info-modal', zu.at(-1))
    }
  })

  it('Tasten aus dem Recipe', () => {
    const { knopf, dialog } = bau()
    const offen = () => dialog.classList.contains('is-open')
    const pruefungen = {
      Enter: () => { taste(knopf, 'Enter'); expect(offen()).toBe(true); taste(document.activeElement, 'Escape') },
      Space: () => { taste(knopf, 'Space'); expect(offen()).toBe(true) },
      Tab: () => {
        // einziges Element: Tab bleibt auf dem Schliessen-Knopf
        const zu = dialog.querySelector('.nc-table-info-modal__close')
        expect(taste(zu, 'Tab').defaultPrevented).toBe(true)
        expect(document.activeElement).toBe(zu)
      },
      'Shift+Tab': () => {
        const zu = dialog.querySelector('.nc-table-info-modal__close')
        expect(taste(zu, 'Shift+Tab').defaultPrevented).toBe(true)
        expect(document.activeElement).toBe(zu)
      },
      Escape: () => { taste(document.activeElement, 'Escape'); expect(offen()).toBe(false); expect(document.activeElement).toBe(knopf) }
    }
    deckeTastenAb('table-info-modal', pruefungen)
    for (const p of ['Enter', 'Space', 'Tab', 'Shift+Tab', 'Escape']) pruefungen[p]()
  })

  it('Website-Markup (geerntet): Backdrop und Knopf mit data-modal-close schliessen', () => {
    const b = buehne(`<button type="button" class="nc-tbl-cell__info-btn" aria-label="Mehr Informationen" aria-controls="tm" data-info="Text">i</button>
<div class="nc-table-info-modal" id="tm" data-table-modal="" aria-hidden="true" role="dialog">
<div class="nc-table-info-modal__backdrop" data-modal-close=""></div>
<div class="nc-table-info-modal__content"><button class="nc-table-info-modal__close" data-modal-close="" aria-label="Schliessen">x</button><div class="nc-table-info-modal__body"></div></div>
</div>`)
    anbinden(b, ['table-info-modal'])
    const dialog = b.querySelector('.nc-table-info-modal')
    const zu = sammle(dialog, 'table-info-modal-close')
    klick(b.querySelector('.nc-tbl-cell__info-btn'))
    expect(dialog.querySelector('.nc-table-info-modal__body').textContent).toBe('Text')
    klick(dialog.querySelector('.nc-table-info-modal__backdrop'))
    expect(zu[0].detail.reason).toBe('overlay-click')
  })
})
