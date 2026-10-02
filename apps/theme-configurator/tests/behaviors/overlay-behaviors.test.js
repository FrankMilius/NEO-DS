/**
 * neo-behaviors, Overlays (Plan v3, Phase 2): Dropdown-Menue, Popover,
 * Tooltip, Modal, Drawer. Diese Bauteile haben noch handgeschriebene
 * Vue-Arenen (useArenaResolver SONDERFAELLE, Inline-Stile ohne DS-Klassen)
 * — getestet wird deshalb gegen DS-Markup nach SCSS-Struktur und Recipe
 * (anatomy, domNotes). „Ausprobieren" in der Arena folgt mit Phase 3.
 */
import { describe, it, expect, afterEach, vi } from 'vitest'
import { anbinden } from 'neo-behaviors'
import { rohesRecipe } from '../arena/_recipes.js'
import { buehne, taste, tastenAus, deckeTastenAb, sammle, passtZumRecipe } from './_helfer.js'

afterEach(() => { document.body.innerHTML = ''; vi.useRealTimers() })

const aktiv = () => document.activeElement

// ---------------------------------------------------------------------------
// Dropdown-Menue — Struktur aus scss/scss/06-molecules/_dropdown-menu.scss
// ---------------------------------------------------------------------------
const DROPDOWN = `<button type="button" id="davor">davor</button>
<div class="nc-dropdown">
  <button type="button" class="nc-button nc-dropdown__trigger" aria-haspopup="true" aria-expanded="false">Aktionen</button>
  <div class="nc-dropdown__menu" role="menu" hidden>
    <button type="button" class="nc-dropdown__item" role="menuitem"><span class="nc-dropdown__item-label">Bearbeiten</span></button>
    <button type="button" class="nc-dropdown__item" role="menuitem" aria-disabled="true"><span class="nc-dropdown__item-label">Gesperrt</span></button>
    <div class="nc-dropdown__item nc-dropdown__item--has-submenu" role="menuitem" aria-haspopup="menu" aria-expanded="false" tabindex="-1">
      <span class="nc-dropdown__item-label">Verschieben</span><span class="nc-dropdown__submenu-indicator"></span>
      <div class="nc-dropdown__menu" role="menu" hidden>
        <button type="button" class="nc-dropdown__item" role="menuitem"><span class="nc-dropdown__item-label">Archiv</span></button>
        <button type="button" class="nc-dropdown__item" role="menuitem"><span class="nc-dropdown__item-label">Papierkorb</span></button>
      </div>
    </div>
    <hr class="nc-dropdown__separator">
    <button type="button" class="nc-dropdown__item nc-dropdown__item--danger" role="menuitem"><span class="nc-dropdown__item-label">Löschen</span></button>
  </div>
</div>
<button type="button" id="danach">danach</button>`

const DROPDOWN_AUSWAHL = `<div class="nc-dropdown nc-dropdown--checkable">
  <button type="button" class="nc-dropdown__trigger" aria-haspopup="true" aria-expanded="false">Ansicht</button>
  <div class="nc-dropdown__menu" role="menu" hidden>
    <div class="nc-dropdown__group" role="group">
      <button type="button" class="nc-dropdown__item nc-dropdown__item--checked" role="menuitemradio" aria-checked="true" data-value="raster"><span class="nc-dropdown__item-check"></span><span class="nc-dropdown__item-label">Raster</span></button>
      <button type="button" class="nc-dropdown__item" role="menuitemradio" aria-checked="false" data-value="liste"><span class="nc-dropdown__item-check"></span><span class="nc-dropdown__item-label">Liste</span></button>
    </div>
    <hr class="nc-dropdown__separator">
    <button type="button" class="nc-dropdown__item" role="menuitemcheckbox" aria-checked="false" data-value="vorschau"><span class="nc-dropdown__item-check"></span><span class="nc-dropdown__item-label">Vorschau</span></button>
  </div>
</div>`

describe('Dropdown-Menue (dropdown-menu-recipe.json)', () => {
  function aufbau (html = DROPDOWN) {
    const b = buehne(html)
    anbinden(b)
    const wurzel = b.querySelector('.nc-dropdown')
    const ausloeser = wurzel.querySelector('.nc-dropdown__trigger')
    const menue = wurzel.querySelector(':scope > .nc-dropdown__menu')
    const oben = [...menue.querySelectorAll('.nc-dropdown__item')].filter((e) => e.closest('.nc-dropdown__menu') === menue)
    const unter = menue.querySelector('.nc-dropdown__item--has-submenu .nc-dropdown__menu')
    return { b, wurzel, ausloeser, menue, oben, unter }
  }

  it('Ausloeser oeffnet/schliesst (aria-expanded, [hidden]), Fokus auf den ersten Eintrag; dropdown-toggle wie im Recipe', () => {
    const d = aufbau()
    const ev = sammle(d.wurzel, 'dropdown-toggle')
    d.ausloeser.click()
    expect(d.menue.hidden).toBe(false)
    expect(d.ausloeser.getAttribute('aria-expanded')).toBe('true')
    expect(aktiv()).toBe(d.oben[0])
    expect(d.oben.every((e) => e.tabIndex === -1)).toBe(true)
    d.ausloeser.click()
    expect(d.menue.hidden).toBe(true)
    expect(ev.map((e) => e.detail.open)).toEqual([true, false])
    passtZumRecipe('dropdown-menu', ev[0])
  })

  it('Eintrag ausloesen schliesst, Fokus zurueck, dropdown-select { value, checked: null }', () => {
    const d = aufbau()
    const ev = sammle(d.wurzel, 'dropdown-select')
    d.ausloeser.click()
    d.oben[0].click()
    expect(d.menue.hidden).toBe(true)
    expect(aktiv()).toBe(d.ausloeser)
    expect(ev[0].detail).toEqual({ value: 'Bearbeiten', checked: null })
    passtZumRecipe('dropdown-menu', ev[0])
    d.ausloeser.click()
    d.oben[1].click() // gesperrt
    expect(ev).toHaveLength(1)
    expect(d.menue.hidden).toBe(false)
  })

  it('menuitemradio: genau einer je Gruppe; menuitemcheckbox schaltet, Menue bleibt offen', () => {
    const d = aufbau(DROPDOWN_AUSWAHL)
    const ev = sammle(d.wurzel, 'dropdown-select')
    const [raster, liste, vorschau] = d.oben
    d.ausloeser.click()
    liste.click()
    expect(liste.getAttribute('aria-checked')).toBe('true')
    expect(liste.classList.contains('nc-dropdown__item--checked')).toBe(true)
    expect(raster.getAttribute('aria-checked')).toBe('false')
    expect(raster.classList.contains('nc-dropdown__item--checked')).toBe(false)
    expect(d.menue.hidden).toBe(true)
    d.ausloeser.click()
    vorschau.click()
    expect(vorschau.getAttribute('aria-checked')).toBe('true')
    expect(d.menue.hidden).toBe(false)
    expect(ev.map((e) => e.detail)).toEqual([{ value: 'liste', checked: true }, { value: 'vorschau', checked: true }])
    for (const e of ev) passtZumRecipe('dropdown-menu', e)
  })

  it('Klick ausserhalb schliesst', () => {
    const d = aufbau()
    d.ausloeser.click()
    document.getElementById('danach').click()
    expect(d.menue.hidden).toBe(true)
  })

  it('Untermenue oeffnet nach 300 ms Verweilen', () => {
    vi.useFakeTimers()
    const d = aufbau()
    d.ausloeser.click()
    d.oben[2].dispatchEvent(new MouseEvent('mouseover', { bubbles: true }))
    vi.advanceTimersByTime(299)
    expect(d.unter.hidden).toBe(true)
    vi.advanceTimersByTime(1)
    expect(d.unter.hidden).toBe(false)
    expect(d.oben[2].getAttribute('aria-expanded')).toBe('true')
  })

  describe('Tasten aus dem Recipe', () => {
    const offen = () => { const d = aufbau(); d.ausloeser.click(); return d }
    const pruefungen = {
      Enter: () => {
        const d = aufbau(); d.ausloeser.focus(); taste(d.ausloeser, 'Enter')
        expect(d.menue.hidden).toBe(false); expect(aktiv()).toBe(d.oben[0])
        const ev = sammle(d.wurzel, 'dropdown-select'); taste(d.oben[0], 'Enter')
        expect(ev).toHaveLength(1); expect(d.menue.hidden).toBe(true)
      },
      Space: () => {
        const d = aufbau(); taste(d.ausloeser, 'Space'); expect(d.menue.hidden).toBe(false)
        taste(d.oben.at(-1), 'Space'); expect(d.menue.hidden).toBe(true)
      },
      ArrowDown: () => {
        const d = aufbau(); taste(d.ausloeser, 'ArrowDown'); expect(aktiv()).toBe(d.oben[0])
        taste(d.oben[0], 'ArrowDown'); expect(aktiv()).toBe(d.oben[2]) // gesperrter Eintrag uebersprungen
        taste(d.oben[2], 'ArrowDown'); taste(d.oben[3], 'ArrowDown'); expect(aktiv()).toBe(d.oben[0]) // rundum
      },
      ArrowUp: () => {
        const d = aufbau(); taste(d.ausloeser, 'ArrowUp'); expect(d.menue.hidden).toBe(false); expect(aktiv()).toBe(d.oben.at(-1))
        taste(d.oben.at(-1), 'ArrowUp'); expect(aktiv()).toBe(d.oben[2])
      },
      Home: () => { const d = offen(); d.oben[3].focus(); taste(d.oben[3], 'Home'); expect(aktiv()).toBe(d.oben[0]) },
      End: () => { const d = offen(); taste(d.oben[0], 'End'); expect(aktiv()).toBe(d.oben[3]) },
      ArrowRight: () => {
        const d = offen(); d.oben[2].focus(); taste(d.oben[2], 'ArrowRight')
        expect(d.unter.hidden).toBe(false); expect(d.oben[2].getAttribute('aria-expanded')).toBe('true')
        expect(aktiv()).toBe(d.unter.querySelector('.nc-dropdown__item'))
      },
      ArrowLeft: () => {
        const d = offen(); taste(d.oben[2], 'ArrowRight'); taste(aktiv(), 'ArrowLeft')
        expect(d.unter.hidden).toBe(true); expect(aktiv()).toBe(d.oben[2]); expect(d.menue.hidden).toBe(false)
      },
      Escape: () => {
        const d = offen(); taste(d.oben[2], 'ArrowRight')
        taste(aktiv(), 'Escape'); expect(d.unter.hidden).toBe(true); expect(aktiv()).toBe(d.oben[2])
        taste(d.oben[2], 'Escape'); expect(d.menue.hidden).toBe(true); expect(aktiv()).toBe(d.ausloeser)
      },
      Tab: () => { const d = offen(); const e = taste(d.oben[0], 'Tab'); expect(d.menue.hidden).toBe(true); expect(e.defaultPrevented).toBe(false) }
    }
    it('jede Taste hat eine Pruefung', () => deckeTastenAb('dropdown-menu', pruefungen))
    for (const t of tastenAus('dropdown-menu')) it(t, () => pruefungen[t]())
  })
})

// ---------------------------------------------------------------------------
// Popover — Struktur aus scss/scss/06-molecules/_popover.scss
// ---------------------------------------------------------------------------
const popoverHtml = ({ hover = false, form = false, ohneHidden = false } = {}) => `<button type="button" id="draussen">draussen</button>
<div class="nc-popover${hover ? ' nc-popover--hover-trigger' : ''}">
  <button type="button" class="nc-button nc-popover__trigger" aria-haspopup="dialog" aria-expanded="false">Einstellungen</button>
  <div class="nc-popover__panel" role="dialog" aria-labelledby="pt"${ohneHidden ? '' : ' hidden'}>
    <div class="nc-popover__arrow" aria-hidden="true"></div>
    <div class="nc-popover__header"><span id="pt">Einstellungen</span><button type="button" class="nc-popover__close" aria-label="Schließen">×</button></div>
    <div class="nc-popover__body">${form ? '<label>Name <input class="nc-input" type="text"></label>' : '<p>Inhalt</p>'}</div>
    <div class="nc-popover__footer"><button type="button" class="nc-button nc-button--sm">Speichern</button></div>
  </div>
</div>`

describe('Popover (popover-recipe.json)', () => {
  function aufbau (opt) {
    const b = buehne(popoverHtml(opt))
    anbinden(b)
    const wurzel = b.querySelector('.nc-popover')
    return { b, wurzel, ausloeser: wurzel.querySelector('.nc-popover__trigger'), panel: wurzel.querySelector('.nc-popover__panel'), schliessen: wurzel.querySelector('.nc-popover__close'), speichern: wurzel.querySelector('.nc-popover__footer button') }
  }

  it('Klick oeffnet, Fokus ins Panel; Schliessen-Knopf schliesst, Fokus zurueck; popover-toggle wie im Recipe', () => {
    const p = aufbau()
    const ev = sammle(p.wurzel, 'popover-toggle')
    p.ausloeser.click()
    expect(p.panel.hidden).toBe(false)
    expect(p.ausloeser.getAttribute('aria-expanded')).toBe('true')
    expect(aktiv()).toBe(p.schliessen)
    p.schliessen.click()
    expect(p.panel.hidden).toBe(true)
    expect(aktiv()).toBe(p.ausloeser)
    expect(ev.map((e) => e.detail)).toEqual([{ open: true, reason: 'trigger' }, { open: false, reason: 'close-button' }])
    passtZumRecipe('popover', ev[0])
  })

  it('Light Dismiss: Klick ausserhalb schliesst — nicht bei Formularen', () => {
    const p = aufbau()
    p.ausloeser.click()
    document.getElementById('draussen').click()
    expect(p.panel.hidden).toBe(true)
    document.body.innerHTML = ''
    const f = aufbau({ form: true })
    f.ausloeser.click()
    expect(aktiv()).toBe(f.panel.querySelector('input')) // Formular: erstes Feld
    document.getElementById('draussen').click()
    expect(f.panel.hidden).toBe(false)
  })

  it('Hover-Modus: oeffnet nach 300 ms, schliesst 200 ms nach Verlassen; Fokus oeffnet sofort', () => {
    vi.useFakeTimers()
    const p = aufbau({ hover: true })
    p.wurzel.dispatchEvent(new MouseEvent('mouseenter'))
    vi.advanceTimersByTime(299)
    expect(p.panel.hidden).toBe(true)
    vi.advanceTimersByTime(1)
    expect(p.panel.hidden).toBe(false)
    p.wurzel.dispatchEvent(new MouseEvent('mouseleave'))
    vi.advanceTimersByTime(200)
    expect(p.panel.hidden).toBe(true)
    p.ausloeser.focus()
    expect(p.panel.hidden).toBe(false)
  })

  it('Hover-Modus ohne [hidden] im Markup (CSS-Rueckfall): beim Binden schliesst JS das Panel', () => {
    const p = aufbau({ hover: true, ohneHidden: true })
    expect(p.panel.hidden).toBe(true)
    expect(p.ausloeser.getAttribute('aria-expanded')).toBe('false')
    expect(p.wurzel.getAttribute('data-neo-behavior')).toContain('popover')
  })

  describe('Tasten aus dem Recipe', () => {
    const pruefungen = {
      Enter: () => { const p = aufbau(); taste(p.ausloeser, 'Enter'); expect(p.panel.hidden).toBe(false) },
      Space: () => { const p = aufbau(); taste(p.ausloeser, 'Space'); expect(p.panel.hidden).toBe(false); p.ausloeser.focus(); taste(p.ausloeser, 'Space'); expect(p.panel.hidden).toBe(true) },
      Escape: () => { const p = aufbau(); p.ausloeser.click(); taste(aktiv(), 'Escape'); expect(p.panel.hidden).toBe(true); expect(aktiv()).toBe(p.ausloeser) },
      Tab: () => { const p = aufbau(); p.ausloeser.click(); p.speichern.focus(); const e = taste(p.speichern, 'Tab'); expect(e.defaultPrevented).toBe(true); expect(aktiv()).toBe(p.schliessen) },
      'Shift+Tab': () => { const p = aufbau(); p.ausloeser.click(); taste(p.schliessen, 'Shift+Tab'); expect(aktiv()).toBe(p.speichern) }
    }
    it('jede Taste hat eine Pruefung', () => deckeTastenAb('popover', pruefungen))
    for (const t of tastenAus('popover')) it(t, () => pruefungen[t]())
  })
})

// ---------------------------------------------------------------------------
// Tooltip — Markup aus data/markup/tooltip.html (vereinfacht)
// ---------------------------------------------------------------------------
describe('Tooltip (tooltip-recipe.json)', () => {
  function aufbau (mitBeschreibung = true) {
    const b = buehne(`<span class="nc-tooltip nc-tooltip--bottom">
      <button type="button" class="nc-button"${mitBeschreibung ? ' aria-describedby="tt-1"' : ''}>Suche</button>
      <span class="nc-tooltip__content" role="tooltip" id="tt-1">Suche öffnen<span class="nc-tooltip__arrow"></span></span>
    </span><button type="button" id="weiter">weiter</button>`)
    anbinden(b)
    const wurzel = b.querySelector('.nc-tooltip')
    return { b, wurzel, ausloeser: wurzel.querySelector('button'), inhalt: wurzel.querySelector('.nc-tooltip__content') }
  }

  it('ergaenzt aria-describedby, wenn es fehlt', () => {
    const t = aufbau(false)
    expect(t.ausloeser.getAttribute('aria-describedby')).toBe('tt-1')
  })

  describe('Tasten aus dem Recipe', () => {
    const pruefungen = {
      Escape: () => {
        const t = aufbau()
        const ev = sammle(t.wurzel, 'tooltip-dismiss')
        t.ausloeser.focus()
        taste(t.ausloeser, 'Escape')
        expect(t.inhalt.hidden).toBe(true)
        expect(ev).toHaveLength(1)
        passtZumRecipe('tooltip', ev[0])
        // erst wenn Fokus und Maus weg sind, darf er wieder erscheinen
        t.wurzel.dispatchEvent(new MouseEvent('mouseleave'))
        expect(t.inhalt.hidden).toBe(true)
        document.getElementById('weiter').focus()
        expect(t.inhalt.hidden).toBe(false)
        // Hover statt Fokus
        t.wurzel.dispatchEvent(new MouseEvent('mouseenter'))
        taste(document.body, 'Escape')
        expect(t.inhalt.hidden).toBe(true)
        t.wurzel.dispatchEvent(new MouseEvent('mouseleave'))
        expect(t.inhalt.hidden).toBe(false)
      },
      Tab: () => {
        // Anzeigen bei Fokus macht das CSS (:focus-within); das Behavior haelt die Verknuepfung
        const t = aufbau()
        expect(t.inhalt.getAttribute('role')).toBe('tooltip')
        expect(t.ausloeser.getAttribute('aria-describedby')).toBe(t.inhalt.id)
        expect(t.inhalt.hidden).toBe(false)
      }
    }
    it('jede Taste hat eine Pruefung', () => deckeTastenAb('tooltip', pruefungen))
    for (const t of tastenAus('tooltip')) it(t, () => pruefungen[t]())
  })
})

// ---------------------------------------------------------------------------
// Modal und Drawer — natives <dialog> (modal-recipe.json, drawer-recipe.json)
// ---------------------------------------------------------------------------
const DIALOGE = {
  modal: (extra = '') => `<button type="button" id="oeffner" aria-haspopup="dialog" aria-controls="dlg">Öffnen</button>
<dialog class="nc-modal nc-modal--scrollable" id="dlg" aria-labelledby="dlg-t"${extra}>
  <div class="nc-modal__header"><h2 class="nc-modal__title" id="dlg-t">Titel</h2><button type="button" class="nc-modal__close" aria-label="Schließen">×</button></div>
  <div class="nc-modal__body"><p>Inhalt</p></div>
  <div class="nc-modal__footer"><button type="button" class="nc-button" data-action="cancel">Abbrechen</button><button type="button" class="nc-button nc-button--primary" data-action="confirm">OK</button></div>
</dialog>`,
  drawer: (extra = '') => `<button type="button" id="oeffner" aria-haspopup="dialog" aria-controls="dlg">Öffnen</button>
<dialog class="nc-drawer nc-drawer--right" id="dlg" aria-labelledby="dlg-t"${extra}>
  <div class="nc-drawer__handle" aria-hidden="true"></div>
  <div class="nc-drawer__header"><h2 class="nc-drawer__title" id="dlg-t">Filter</h2></div>
  <div class="nc-drawer__content"><p>Inhalt</p></div>
  <div class="nc-drawer__footer"><button type="button" class="nc-button">Anwenden</button></div>
  <button type="button" class="nc-drawer__close" aria-label="Schließen">×</button>
</dialog>`
}

for (const id of ['modal', 'drawer']) {
  describe(`${id[0].toUpperCase() + id.slice(1)} (${id}-recipe.json)`, () => {
    function aufbau (extra) {
      const b = buehne(DIALOGE[id](extra))
      anbinden(b)
      const dialog = b.querySelector('dialog')
      const fokussierbar = [...dialog.querySelectorAll('button')]
      return { b, dialog, oeffner: b.querySelector('#oeffner'), erstes: fokussierbar[0], letztes: fokussierbar.at(-1), schliessen: dialog.querySelector(`.nc-${id}__close`) }
    }
    const offen = (extra) => { const d = aufbau(extra); d.oeffner.focus(); d.oeffner.click(); return d }

    it(`Ausloeser (aria-controls) oeffnet per showModal, Fokus hinein; ${id}-open/-close wie im Recipe, Fokus zurueck`, () => {
      const d = aufbau()
      const auf = sammle(d.dialog, `${id}-open`)
      const zu = sammle(d.dialog, `${id}-close`)
      d.oeffner.focus()
      d.oeffner.click()
      expect(d.dialog.open).toBe(true)
      expect(d.dialog.contains(aktiv())).toBe(true)
      expect(auf).toHaveLength(1)
      passtZumRecipe(id, auf[0])
      d.schliessen.click()
      expect(d.dialog.open).toBe(false)
      expect(zu.map((e) => e.detail)).toEqual([{ reason: 'close-button' }])
      passtZumRecipe(id, zu[0])
      expect(aktiv()).toBe(d.oeffner)
    })

    it('Klick auf den Hintergrund', () => {
      const klickDraussen = (dlg) => dlg.dispatchEvent(new MouseEvent('click', { bubbles: true, clientX: 5, clientY: 5 }))
      const d = offen()
      const zu = sammle(d.dialog, `${id}-close`)
      klickDraussen(d.dialog)
      if (id === 'drawer') {
        expect(d.dialog.open).toBe(false) // Light Dismiss immer
        expect(zu[0].detail.reason).toBe('overlay-click')
      } else {
        expect(d.dialog.open).toBe(true) // Modal nur mit data-backdrop-close="true"
        document.body.innerHTML = ''
        const m = offen(' data-backdrop-close="true"')
        klickDraussen(m.dialog)
        expect(m.dialog.open).toBe(false)
      }
    })

    it('Schliessen ohne Behavior-Weg (dialog.close()) meldet reason programmatic', () => {
      const d = offen()
      const zu = sammle(d.dialog, `${id}-close`)
      d.dialog.close()
      expect(zu[0].detail.reason).toBe('programmatic')
    })

    describe('Tasten aus dem Recipe', () => {
      const pruefungen = {
        Escape: () => {
          const d = offen()
          const zu = sammle(d.dialog, `${id}-close`)
          taste(aktiv(), 'Escape')
          expect(d.dialog.open).toBe(false)
          expect(zu[0].detail.reason).toBe('escape')
          expect(aktiv()).toBe(d.oeffner)
        },
        Tab: () => { const d = offen(); d.letztes.focus(); const e = taste(d.letztes, 'Tab'); expect(e.defaultPrevented).toBe(true); expect(aktiv()).toBe(d.erstes) },
        'Shift+Tab': () => { const d = offen(); d.erstes.focus(); taste(d.erstes, 'Shift+Tab'); expect(aktiv()).toBe(d.letztes) }
      }
      it('jede Taste hat eine Pruefung', () => deckeTastenAb(id, pruefungen))
      for (const t of tastenAus(id)) it(t, () => pruefungen[t]())
    })
  })
}

it('Modal und Drawer: Recipe-Ereignisse decken die Gruende ab', () => {
  for (const id of ['modal', 'drawer']) expect(rohesRecipe(id).events[`${id}-close`].note).toMatch(/escape.*overlay-click.*close-button.*programmatic/)
})

// ---------------------------------------------------------------------------
describe('Overlay-Behaviors: anbinden/abbinden', () => {
  const FAELLE = [
    ['dropdown-menu', DROPDOWN, (b) => b.querySelector('.nc-dropdown__trigger').click(), 'dropdown-toggle'],
    ['popover', popoverHtml(), (b) => b.querySelector('.nc-popover__trigger').click(), 'popover-toggle'],
    ['modal', DIALOGE.modal(), (b) => { b.querySelector('#oeffner').click(); b.querySelector('dialog').close() }, 'modal-open'],
    ['drawer', DIALOGE.drawer(), (b) => { b.querySelector('#oeffner').click(); b.querySelector('dialog').close() }, 'drawer-open'],
    ['tooltip', '<span class="nc-tooltip"><button type="button">x</button><span class="nc-tooltip__content">y</span></span>', (b) => { b.querySelector('button').focus(); taste(b.querySelector('button'), 'Escape'); b.querySelector('button').blur(); b.querySelector('.nc-tooltip__content').hidden = false }, 'tooltip-dismiss']
  ]
  for (const [id, html, tu, name] of FAELLE) {
    it(`${id}: doppelt gebunden wirkt einfach, nach dem Aufraeumen nicht mehr`, () => {
      const b = buehne(html)
      const ev = sammle(b, name)
      const aufraeumen = anbinden(b, [id])
      anbinden(b, [id])
      tu(b)
      expect(ev).toHaveLength(1)
      aufraeumen()
      expect(b.querySelector('[data-neo-behavior]')).toBeNull()
      tu(b)
      expect(ev).toHaveLength(1)
    })
  }
})
