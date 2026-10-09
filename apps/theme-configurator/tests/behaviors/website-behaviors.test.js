/**
 * Website-Bauteile aus dem Drupal-Theme in neo-behaviors (Entscheidung
 * 06.10.2026): overlay-verhalten (mobile-drawer, table-info-modal),
 * multiselect-verhalten, website-verhalten (chapter-nav, expanding-panels,
 * feature-accordion). Gebunden wird an das Markup, das die Arena im Modus
 * „Ausprobieren" aus dem Recipe baut; jede Taste aus `keyboard` und jedes
 * Ereignis aus `events` wird geprueft. Soll ist das heutige Verhalten in
 * neo_fe/js/neo-theme.js, mit den Verbesserungen fuer Barrierefreiheit.
 */
import { describe, it, expect, afterEach, vi } from 'vitest'
import { anbinden, abbinden, BEHAVIORS, NUR_AUSDRUECKLICH } from 'neo-behaviors'
import { buehne, lebendigesMarkup, taste, deckeTastenAb, sammle, passtZumRecipe } from './_helfer.js'

afterEach(() => { document.body.innerHTML = ''; document.body.className = '' })

const klick = (el) => el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))

describe('Website-Bauteile: nur ausdruecklich in Drupal', () => {
  it('jedes Website-Bauteil traegt nurAusdruecklich und steht in NUR_AUSDRUECKLICH', () => {
    for (const id of ['mobile-drawer', 'table-info-modal', 'multiselect', 'chapter-nav', 'expanding-panels', 'feature-accordion']) {
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

describe('Multiselect (multiselect-recipe.json)', () => {
  const bau = (specimen = 'default') => {
    const b = buehne(lebendigesMarkup('multiselect', specimen))
    anbinden(b, ['multiselect'])
    const feld = /** @type {HTMLElement} */ (b.querySelector('.nc-multiselect'))
    return {
      b,
      feld,
      knopf: /** @type {HTMLButtonElement} */ (feld.querySelector('.nc-multiselect__trigger')),
      panel: /** @type {HTMLElement} */ (feld.querySelector('.nc-multiselect__panel')),
      boxen: /** @type {HTMLInputElement[]} */ ([...feld.querySelectorAll('input[type="checkbox"]')]),
      wert: () => /** @type {HTMLElement} */ (feld.querySelector('.nc-multiselect__value'))
    }
  }
  const waehle = (box) => { box.checked = !box.checked; box.dispatchEvent(new Event('change', { bubbles: true })) }

  it('geschlossen: Panel [hidden], aria-expanded=false, aria-controls aufs Panel', () => {
    const { feld, knopf, panel } = bau()
    expect(panel.hidden).toBe(true)
    // DS-SCSS ohne .nc-multiselect__panel[hidden]: display: flex gewaenne —
    // das Behavior blendet inline aus
    expect(panel.style.display).toBe('none')
    expect(knopf.getAttribute('aria-expanded')).toBe('false')
    expect(knopf.getAttribute('aria-controls')).toBe(panel.id)
    expect(feld.classList.contains('is-open')).toBe(false)
  })

  it('Klick schaltet: .is-open, aria-expanded, Panel sichtbar; zweiter Klick schliesst', () => {
    const { feld, knopf, panel } = bau()
    klick(knopf)
    expect(panel.hidden).toBe(false)
    expect(panel.style.display).toBe('')
    expect(feld.classList.contains('is-open')).toBe(true)
    expect(knopf.getAttribute('aria-expanded')).toBe('true')
    klick(knopf)
    expect(panel.hidden).toBe(true)
    expect(panel.style.display).toBe('none')
    expect(feld.classList.contains('is-open')).toBe(false)
  })

  it('Zusammenfassung wie die Website: zwei Namen, dann „<n> ausgewählt“, leer der Platzhalter; Ereignis mit values', () => {
    const { feld, knopf, boxen, wert } = bau('leer')
    expect(wert().textContent).toBe('Bitte wählen')
    const ereignisse = sammle(feld, 'multiselect-change')
    klick(knopf)
    waehle(boxen[1])
    expect(wert().textContent).toBe('Wissensmanagement')
    expect(wert().classList.contains('nc-multiselect__value--empty')).toBe(false)
    waehle(boxen[3])
    expect(wert().textContent).toBe('Wissensmanagement, Intranet-KI')
    waehle(boxen[0])
    expect(wert().textContent).toBe('3 ausgewählt')
    expect(ereignisse.at(-1).detail.values).toEqual(['0', '1', '3'])
    passtZumRecipe('multiselect', ereignisse.at(-1))
    for (const b of [boxen[0], boxen[1], boxen[3]]) waehle(b)
    expect(wert().textContent).toBe('Bitte wählen')
    expect(wert().classList.contains('nc-multiselect__value--empty')).toBe(true)
    expect(ereignisse.at(-1).detail.values).toEqual([])
  })

  // Restpunkte 09.10.2026 (multiselect-sprache): vorher fest deutsch
  describe('Sprache der Texte im Knopf', () => {
    const KLEIN = (attr = '', knopfAttr = '') => `<div class="nc-form-field nc-multiselect"${attr}><button type="button" class="nc-multiselect__trigger" aria-expanded="false"${knopfAttr}><span class="nc-multiselect__value nc-multiselect__value--empty"></span></button><div class="nc-multiselect__panel" role="group" hidden>${['a', 'b', 'c'].map((v) => `<label class="nc-checkbox nc-multiselect__option"><input type="checkbox" class="nc-checkbox__input" value="${v}"><span class="nc-checkbox__label">${v.toUpperCase()}</span></label>`).join('')}</div></div>`
    const texte = (markup) => {
      const b = buehne(markup)
      anbinden(b, ['multiselect'])
      const feld = /** @type {HTMLElement} */ (b.querySelector('.nc-multiselect'))
      const wert = () => /** @type {HTMLElement} */ (feld.querySelector('.nc-multiselect__value')).textContent
      const leer = wert()
      for (const box of feld.querySelectorAll('input')) waehle(/** @type {HTMLInputElement} */ (box))
      return [leer, wert()]
    }
    afterEach(() => document.documentElement.removeAttribute('lang'))

    it('ohne lang und mit de/de-CH deutsch, mit en englisch, andere Sprachen englisch', () => {
      expect(texte(KLEIN())).toEqual(['Bitte wählen…', '3 ausgewählt'])
      for (const [lang, erwartet] of [['de', ['Bitte wählen…', '3 ausgewählt']], ['de-CH', ['Bitte wählen…', '3 ausgewählt']], ['en', ['Please select…', '3 selected']], ['en-GB', ['Please select…', '3 selected']], ['fr', ['Please select…', '3 selected']]]) {
        document.body.innerHTML = ''
        document.documentElement.setAttribute('lang', lang)
        expect(texte(KLEIN()), lang).toEqual(erwartet)
      }
    })

    it('lang am Feld (oder Vorfahren) schlaegt html lang', () => {
      document.documentElement.setAttribute('lang', 'de')
      expect(texte(`<div lang="en">${KLEIN()}</div>`)).toEqual(['Please select…', '3 selected'])
      document.body.innerHTML = ''
      document.documentElement.setAttribute('lang', 'en')
      expect(texte(KLEIN(' lang="de"'))).toEqual(['Bitte wählen…', '3 ausgewählt'])
    })

    it('Texte am Bauteil ueberschreibbar: data-count-text (@count) und data-placeholder am Feld oder Knopf', () => {
      document.documentElement.setAttribute('lang', 'en')
      expect(texte(KLEIN(' data-count-text="@count gewählt" data-placeholder="Auswählen"'))).toEqual(['Auswählen', '3 gewählt'])
      document.body.innerHTML = ''
      expect(texte(KLEIN('', ' data-count-text="@count options" data-placeholder="Choose"'))).toEqual(['Choose', '3 options'])
    })
  })

  it('Klick ausserhalb und Fokus aus dem Feld schliessen', () => {
    const { knopf, panel, boxen } = bau()
    const draussen = document.createElement('button')
    document.body.append(draussen)
    klick(knopf)
    klick(draussen)
    expect(panel.hidden).toBe(true)
    klick(knopf)
    boxen.at(-1).focus()
    boxen.at(-1).dispatchEvent(new FocusEvent('focusout', { bubbles: true, relatedTarget: draussen }))
    expect(panel.hidden).toBe(true)
  })

  it('Tasten aus dem Recipe', () => {
    const { knopf, panel, boxen, feld } = bau()
    const pruefungen = {
      Enter: () => {
        taste(knopf, 'Enter')
        expect(panel.hidden).toBe(false)
        expect(document.activeElement).toBe(boxen[0])
      },
      ArrowDown: () => {
        taste(boxen[0], 'ArrowDown'); expect(document.activeElement).toBe(boxen[1])
        taste(boxen.at(-1), 'ArrowDown'); expect(document.activeElement).toBe(boxen[0])
      },
      ArrowUp: () => { taste(boxen[0], 'ArrowUp'); expect(document.activeElement).toBe(boxen.at(-1)) },
      Home: () => { taste(boxen[2], 'Home'); expect(document.activeElement).toBe(boxen[0]) },
      End: () => { taste(boxen[0], 'End'); expect(document.activeElement).toBe(boxen.at(-1)) },
      Escape: () => {
        taste(boxen[1], 'Escape')
        expect(panel.hidden).toBe(true)
        expect(document.activeElement).toBe(knopf)
      },
      Space: () => {
        const e = taste(knopf, 'Space')
        expect(e.defaultPrevented).toBe(true)
        expect(panel.hidden).toBe(false)
        expect(document.activeElement).toBe(boxen[0])
      },
      Tab: () => {
        const weiter = document.createElement('button')
        feld.after(weiter)
        boxen.at(-1).dispatchEvent(new FocusEvent('focusout', { bubbles: true, relatedTarget: weiter }))
        expect(panel.hidden).toBe(true)
      }
    }
    deckeTastenAb('multiselect', pruefungen)
    for (const p of ['Enter', 'ArrowDown', 'ArrowUp', 'Home', 'End', 'Escape', 'Space', 'Tab']) pruefungen[p]()
    // Pfeil runter auf dem geschlossenen Knopf oeffnet ebenfalls
    taste(knopf, 'ArrowDown')
    expect(panel.hidden).toBe(false)
    expect(document.activeElement).toBe(boxen[0])
  })

  it('Abbinden: aria-controls, Panel-id und Inline-display wie vorher', () => {
    const b = buehne(`<div class="nc-form-field nc-multiselect"><button type="button" class="nc-multiselect__trigger" aria-expanded="false"><span class="nc-multiselect__value nc-multiselect__value--empty">Bitte wählen…</span></button><div class="nc-multiselect__panel" role="group" hidden><label class="nc-checkbox nc-multiselect__option"><input type="checkbox" class="nc-checkbox__input" value="a"><span class="nc-checkbox__label">A</span></label></div></div>`)
    anbinden(b, ['multiselect'])
    const knopf = b.querySelector('.nc-multiselect__trigger')
    const panel = b.querySelector('.nc-multiselect__panel')
    expect(knopf.getAttribute('aria-controls')).toBe(panel.id)
    expect(panel.style.display).toBe('none')
    abbinden(b, ['multiselect'])
    expect(knopf.hasAttribute('aria-controls')).toBe(false)
    expect(panel.hasAttribute('id')).toBe(false)
    expect(panel.style.display).toBe('')
  })
})

describe('Kapitelnavigation (chapter-nav-recipe.json)', () => {
  // jsdom rechnet kein Layout: Oberkanten der Kapitel relativ zum Fenster
  // werden je Test gesetzt (wie nach einem Scroll), offsetHeight der Leiste
  // und der Kopfzeile ebenso.
  let oben = {}
  const bau = ({ kopf = 0 } = {}) => {
    window.history.replaceState(null, '', '/')
    const b = buehne((kopf ? `<header class="site-header" data-neo-nav></header>` : '') + lebendigesMarkup('chapter-nav', 'formen'))
    const nav = /** @type {HTMLElement} */ (b.querySelector('.nc-chapter-nav'))
    const links = /** @type {HTMLAnchorElement[]} */ ([...nav.querySelectorAll('.nc-chapter-nav__link')])
    const ziele = links.map((a) => /** @type {HTMLElement} */ (document.getElementById(a.getAttribute('href').slice(1))))
    oben = Object.fromEntries(ziele.map((z, i) => [z.id, 500 + i * 400]))
    for (const z of ziele) z.getBoundingClientRect = () => ({ top: oben[z.id], bottom: oben[z.id] + 300, left: 0, right: 0, width: 0, height: 300, x: 0, y: oben[z.id], toJSON () {} })
    Object.defineProperty(nav, 'offsetHeight', { configurable: true, value: 56 })
    if (kopf) Object.defineProperty(b.querySelector('.site-header'), 'offsetHeight', { configurable: true, value: kopf })
    anbinden(b, ['chapter-nav'])
    return { b, nav, links, ziele }
  }
  const scrolle = (stand) => {
    Object.assign(oben, stand)
    window.dispatchEvent(new Event('scroll'))
  }
  const aktuell = (links) => links.filter((a) => a.getAttribute('aria-current') === 'true').map((a) => a.textContent)

  afterEach(() => { vi.restoreAllMocks(); vi.useRealTimers() })

  it('Anfang: das erste Kapitel ist markiert (ueber dem ersten Abschnitt, Seite oben)', () => {
    const { links } = bau()
    expect(aktuell(links)).toEqual(['Kommunikation'])
  })

  it('Scroll-Spy: das LETZTE Kapitel ueber der Linie (Leiste 56 px + 24), nicht das oberste sichtbare; Ereignis', async () => {
    const { nav, links, ziele } = bau()
    const wechsel = sammle(nav, 'chapter-nav-change')
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((f) => { f(0); return 0 })
    // Wissen hat die Linie (80 px) passiert, Events noch nicht; Kommunikation ragt weit nach oben
    scrolle({ [ziele[0].id]: -900, [ziele[1].id]: 70, [ziele[2].id]: 81 })
    expect(aktuell(links)).toEqual(['Wissen'])
    expect(wechsel.at(-1).detail).toEqual({ value: ziele[1].id, previousValue: ziele[0].id })
    passtZumRecipe('chapter-nav', wechsel.at(-1))
    scrolle({ [ziele[2].id]: 80 })
    expect(aktuell(links)).toEqual(['Events'])
  })

  it('Linie mit Kopfzeile: Hoehe aus .site-header[data-neo-nav] (offsetHeight) + Leiste', () => {
    const { links, ziele } = bau({ kopf: 72 })
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((f) => { f(0); return 0 })
    // Linie = 72 + 56 + 24 = 152
    scrolle({ [ziele[0].id]: -500, [ziele[1].id]: 150 })
    expect(aktuell(links)).toEqual(['Wissen'])
    scrolle({ [ziele[1].id]: 153 })
    expect(aktuell(links)).toEqual(['Kommunikation'])
  })

  it('Klick markiert sofort, springt mit Versatz, setzt Anker und Fokus; der Spy ruht bis das Scrollen steht', () => {
    vi.useFakeTimers()
    const { links, ziele } = bau({ kopf: 72 })
    const sprung = vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((f) => { f(0); return 0 })
    links[3].click()
    expect(aktuell(links)).toEqual(['Vernetzung'])
    // Ziel: Oberkante 1700 + scrollY 0 - (72 + 56)
    expect(sprung).toHaveBeenCalledWith({ top: 1700 - 128, behavior: expect.any(String) })
    expect(window.location.hash).toBe(`#${ziele[3].id}`)
    expect(document.activeElement).toBe(ziele[3])
    expect(ziele[3].getAttribute('tabindex')).toBe('-1')
    // waehrend des Scrollens laeuft die Markierung nicht durch die Kapitel dazwischen
    scrolle({ [ziele[1].id]: 0, [ziele[2].id]: 400 })
    expect(aktuell(links)).toEqual(['Vernetzung'])
    // Scrollen steht: Spy wertet wieder aus
    scrolle({ [ziele[0].id]: -1700, [ziele[1].id]: -1300, [ziele[2].id]: -900, [ziele[3].id]: 128, [ziele[4].id]: 528 })
    vi.advanceTimersByTime(200)
    expect(aktuell(links)).toEqual(['Vernetzung'])
  })

  it('Sprung-Marke: [data-neo-sprung] an <html>, bis das Scrollen steht (Auto-Hide der Hauptnavigation ruht)', () => {
    vi.useFakeTimers()
    const { b, links, ziele } = bau({ kopf: 72 })
    vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((f) => { f(0); return 0 })
    const html = document.documentElement
    expect(html.hasAttribute('data-neo-sprung')).toBe(false)
    links[3].click()
    expect(html.getAttribute('data-neo-sprung')).toBe('ja')
    // jedes Scroll-Ereignis schiebt das Ende hinaus
    vi.advanceTimersByTime(100)
    scrolle({ [ziele[1].id]: 0 })
    vi.advanceTimersByTime(100)
    expect(html.hasAttribute('data-neo-sprung')).toBe(true)
    vi.advanceTimersByTime(100)
    expect(html.hasAttribute('data-neo-sprung')).toBe(false)
    // Abbinden waehrend eines Sprungs nimmt die Marke mit
    links[1].click()
    expect(html.hasAttribute('data-neo-sprung')).toBe(true)
    abbinden(b, ['chapter-nav'])
    expect(html.hasAttribute('data-neo-sprung')).toBe(false)
    expect(ziele.length).toBe(5)
  })

  it('Seitenende: das letzte Kapitel ist markiert, auch wenn es die Linie nie erreicht', () => {
    const { links, ziele } = bau()
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((f) => { f(0); return 0 })
    const scrollY = Object.getOwnPropertyDescriptor(window, 'scrollY')
    const hoehe = Object.getOwnPropertyDescriptor(document.body, 'scrollHeight')
    Object.defineProperty(document.body, 'scrollHeight', { configurable: true, value: 3000 })
    try {
      Object.defineProperty(window, 'scrollY', { configurable: true, value: 1000 })
      scrolle({ [ziele[0].id]: -900, [ziele[1].id]: -500, [ziele[2].id]: 40, [ziele[3].id]: 300, [ziele[4].id]: 600 })
      expect(aktuell(links)).toEqual(['Events'])
      Object.defineProperty(window, 'scrollY', { configurable: true, value: 3000 - window.innerHeight })
      scrolle({})
      expect(aktuell(links)).toEqual(['Anwendungen'])
    } finally {
      if (scrollY) Object.defineProperty(window, 'scrollY', scrollY); else delete window.scrollY
      if (hoehe) Object.defineProperty(document.body, 'scrollHeight', hoehe); else delete document.body.scrollHeight
    }
  })

  it('Klick nahe dem Seitenende: das angesprungene Kapitel bleibt markiert, bis wieder gescrollt wird (Entscheidung Abschluss 2, wie reference-page)', () => {
    vi.useFakeTimers()
    const { links, ziele } = bau({ kopf: 72 })
    vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((f) => { f(0); return 0 })
    const scrollY = Object.getOwnPropertyDescriptor(window, 'scrollY')
    const hoehe = Object.getOwnPropertyDescriptor(document.body, 'scrollHeight')
    Object.defineProperty(document.body, 'scrollHeight', { configurable: true, value: 3000 })
    try {
      // vorletztes Kapitel: Sprung endet am Seitenende, „Vernetzung" erreicht
      // die Linie (72 + 56 + 24 = 152) nicht — die Seitenende-Regel haette
      // „Anwendungen" markiert
      links[3].click()
      Object.defineProperty(window, 'scrollY', { configurable: true, value: 3000 - window.innerHeight })
      scrolle({ [ziele[0].id]: -900, [ziele[1].id]: -500, [ziele[2].id]: 100, [ziele[3].id]: 250, [ziele[4].id]: 550 })
      vi.advanceTimersByTime(200)
      expect(aktuell(links)).toEqual(['Vernetzung'])
      // naechstes Scrollen der Leserin: die Regeln gelten wieder
      scrolle({})
      expect(aktuell(links)).toEqual(['Anwendungen'])

      // letztes Kapitel knapp vor dem Seitenende (Rest > 4 px): „letztes ueber
      // der Linie" haette „Events" markiert
      Object.defineProperty(window, 'scrollY', { configurable: true, value: 1000 })
      scrolle({ [ziele[0].id]: -900, [ziele[1].id]: -500, [ziele[2].id]: 40, [ziele[3].id]: 300, [ziele[4].id]: 600 })
      expect(aktuell(links)).toEqual(['Events'])
      links[4].click()
      Object.defineProperty(window, 'scrollY', { configurable: true, value: 3000 - window.innerHeight - 20 })
      scrolle({ [ziele[2].id]: 120, [ziele[3].id]: 300, [ziele[4].id]: 500 })
      vi.advanceTimersByTime(200)
      expect(aktuell(links)).toEqual(['Anwendungen'])
      scrolle({})
      expect(aktuell(links)).toEqual(['Events'])
    } finally {
      if (scrollY) Object.defineProperty(window, 'scrollY', scrollY); else delete window.scrollY
      if (hoehe) Object.defineProperty(document.body, 'scrollHeight', hoehe); else delete document.body.scrollHeight
    }
  })

  it('prefers-reduced-motion: Sprung ohne Animation', () => {
    const { links } = bau()
    window.matchMedia = vi.fn().mockReturnValue({ matches: true })
    const sprung = vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
    links[1].click()
    expect(sprung.mock.calls[0][0].behavior).toBe('auto')
    delete window.matchMedia
  })

  it('Tasten aus dem Recipe', () => {
    const { links, ziele } = bau()
    vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
    const pruefungen = {
      // Enter auf einem Link loest im Browser den Klick aus
      Enter: () => { links[2].focus(); links[2].click(); expect(aktuell(links)).toEqual(['Events']); expect(document.activeElement).toBe(ziele[2]) },
      Tab: () => { for (const a of links) expect(a.hasAttribute('tabindex')).toBe(false) }
    }
    deckeTastenAb('chapter-nav', pruefungen)
    for (const p of Object.values(pruefungen)) p()
  })

  it('Abbinden: aria-current und tabindex wie vorher', () => {
    const { b, links, ziele } = bau()
    vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
    links[4].click()
    abbinden(b, ['chapter-nav'])
    expect(aktuell(links)).toEqual(['Kommunikation'])
    expect(ziele[4].hasAttribute('tabindex')).toBe(false)
  })
})

describe('Expanding Panels (expanding-panels-recipe.json)', () => {
  const bau = () => {
    const b = buehne(lebendigesMarkup('expanding-panels', 'default'))
    const wurzel = /** @type {HTMLElement} */ (b.querySelector('.nc-expanding-panels'))
    const panels = /** @type {HTMLButtonElement[]} */ ([...wurzel.querySelectorAll('.nc-expanding-panels__panel')])
    const vorher = panels.map((p) => p.getAttribute('aria-expanded'))
    anbinden(b, ['expanding-panels'])
    return { b, wurzel, panels, vorher }
  }
  const offen = (panels) => panels.map((p) => p.getAttribute('aria-expanded') === 'true')

  it('beim Binden das erste Panel offen, wenn keines offen ist (wie die Website)', () => {
    const { panels, vorher } = bau()
    expect(vorher.every((v) => v === 'false')).toBe(true)
    expect(offen(panels)).toEqual([true, false, false, false])
  })

  it('Single-Open per Klick; ein offenes bleibt offen; Ereignis', () => {
    const { wurzel, panels } = bau()
    const wechsel = sammle(wurzel, 'expanding-panels-change')
    panels[2].click()
    expect(offen(panels)).toEqual([false, false, true, false])
    expect(wechsel[0].detail).toEqual({ index: 2, previousIndex: 0 })
    passtZumRecipe('expanding-panels', wechsel[0])
    panels[2].click()
    expect(offen(panels)).toEqual([false, false, true, false])
    expect(wechsel).toHaveLength(1)
  })

  it('Tasten aus dem Recipe', () => {
    const { panels } = bau()
    const pruefungen = {
      Enter: () => { taste(panels[1], 'Enter'); expect(offen(panels)).toEqual([false, true, false, false]) },
      Space: () => { taste(panels[3], 'Space'); expect(offen(panels)).toEqual([false, false, false, true]) },
      ArrowRight: () => { taste(panels[3], 'ArrowRight'); expect(offen(panels)).toEqual([true, false, false, false]); expect(document.activeElement).toBe(panels[0]) },
      ArrowDown: () => { taste(panels[0], 'ArrowDown'); expect(offen(panels)).toEqual([false, true, false, false]); expect(document.activeElement).toBe(panels[1]) },
      ArrowLeft: () => { taste(panels[0], 'ArrowLeft'); expect(offen(panels)).toEqual([false, false, false, true]); expect(document.activeElement).toBe(panels[3]) },
      ArrowUp: () => { taste(panels[3], 'ArrowUp'); expect(offen(panels)).toEqual([false, false, true, false]); expect(document.activeElement).toBe(panels[2]) },
      Home: () => { taste(panels[2], 'Home'); expect(offen(panels)).toEqual([true, false, false, false]) },
      End: () => { taste(panels[0], 'End'); expect(offen(panels)).toEqual([false, false, false, true]); expect(document.activeElement).toBe(panels[3]) }
    }
    deckeTastenAb('expanding-panels', pruefungen)
    for (const p of Object.values(pruefungen)) p()
  })

  it('gesperrtes Panel wird uebersprungen; Abbinden stellt aria-expanded wieder her', () => {
    const { b, panels, vorher } = bau()
    panels[1].setAttribute('aria-disabled', 'true')
    taste(panels[0], 'ArrowRight')
    expect(offen(panels)).toEqual([false, false, true, false])
    panels[1].click()
    expect(offen(panels)).toEqual([false, false, true, false])
    abbinden(b, ['expanding-panels'])
    expect(panels.map((p) => p.getAttribute('aria-expanded'))).toEqual(vorher)
  })

  it('Website-Markup (geerntet, erstes Panel offen) bleibt beim Binden unveraendert', () => {
    const b = buehne(`<div class="nc-expanding-panels" role="group"><button type="button" class="nc-expanding-panels__panel" aria-expanded="false">A</button><button type="button" class="nc-expanding-panels__panel" aria-expanded="true">B</button></div>`)
    anbinden(b, ['expanding-panels'])
    expect(offen([...b.querySelectorAll('.nc-expanding-panels__panel')])).toEqual([false, true])
  })
})

describe('Feature-Akkordeon (feature-accordion-recipe.json)', () => {
  // jsdom ohne Layout: Spalte und Kapitel bekommen Kanten je Test; die
  // rechte Spalte gilt als scrollend (overflow-y aus dem SCSS, hier inline)
  let kanten = {}
  const bau = ({ spalte = true } = {}) => {
    const b = buehne(lebendigesMarkup('feature-accordion', 'default'))
    const wurzel = /** @type {HTMLElement} */ (b.querySelector('.nc-feature-accordeon'))
    const rechts = /** @type {HTMLElement} */ (wurzel.querySelector('.nc-feature-accordeon__right'))
    const links = /** @type {HTMLButtonElement[]} */ ([...wurzel.querySelectorAll('.nc-feature-accordeon__link')])
    const kapitel = /** @type {HTMLElement[]} */ ([...wurzel.querySelectorAll('.nc-feature-accordeon__chapter')])
    if (spalte) {
      rechts.style.overflowY = 'auto'
      Object.defineProperty(rechts, 'scrollHeight', { configurable: true, value: 1200 })
      Object.defineProperty(rechts, 'clientHeight', { configurable: true, value: 500 })
    }
    kanten = { rechts: 100, k0: 100, k1: 500, k2: 900 }
    const rect = (top) => ({ top, bottom: top + 300, left: 0, right: 0, width: 0, height: 300, x: 0, y: top, toJSON () {} })
    rechts.getBoundingClientRect = () => rect(kanten.rechts)
    kapitel.forEach((k, i) => { k.getBoundingClientRect = () => rect(kanten[`k${i}`]) })
    anbinden(b, ['feature-accordion'])
    return { b, wurzel, rechts, links, kapitel }
  }
  const aktiv = (links) => links.map((l) => l.classList.contains('is-active') && l.getAttribute('aria-current') === 'true')

  afterEach(() => { vi.restoreAllMocks(); vi.useRealTimers() })

  it('drei Kapitel in „Ausprobieren“; der aktive Link traegt is-active und aria-current', () => {
    const { links, kapitel } = bau()
    expect(kapitel).toHaveLength(3)
    expect(aktiv(links)).toEqual([true, false, false])
  })

  it('Klick wechselt das Kapitel: markiert, scrollt die rechte Spalte, Fokus aufs Kapitel; Ereignis', () => {
    const { wurzel, rechts, links, kapitel } = bau()
    const wechsel = sammle(wurzel, 'feature-accordion-change')
    rechts.scrollTo = vi.fn()
    links[2].click()
    expect(aktiv(links)).toEqual([false, false, true])
    expect(rechts.scrollTo).toHaveBeenCalledWith({ top: 800, behavior: expect.any(String) })
    expect(document.activeElement).toBe(kapitel[2])
    expect(wechsel[0].detail).toEqual({ index: 2, previousIndex: 0 })
    passtZumRecipe('feature-accordion', wechsel[0])
  })

  it('gestapelt (Spalte scrollt nicht): das Kapitel scrollt in der Seite', () => {
    const { links, kapitel } = bau({ spalte: false })
    kapitel[1].scrollIntoView = vi.fn()
    links[1].click()
    expect(kapitel[1].scrollIntoView).toHaveBeenCalledWith({ block: 'start', behavior: expect.any(String) })
  })

  it('Scroll-Spy der rechten Spalte: das letzte Kapitel ueber ihrem Anfang; ruht waehrend des Sprungs', () => {
    vi.useFakeTimers()
    const { rechts, links } = bau()
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((f) => { f(0); return 0 })
    Object.assign(kanten, { k0: -300, k1: 110, k2: 500 })
    rechts.dispatchEvent(new Event('scroll'))
    expect(aktiv(links)).toEqual([false, true, false])
    rechts.scrollTo = vi.fn()
    links[2].click()
    Object.assign(kanten, { k1: -100, k2: 300 })
    rechts.dispatchEvent(new Event('scroll'))
    expect(aktiv(links)).toEqual([false, false, true])
    vi.advanceTimersByTime(200)
    Object.assign(kanten, { k0: 100, k1: 500, k2: 900 })
    rechts.dispatchEvent(new Event('scroll'))
    expect(aktiv(links)).toEqual([true, false, false])
  })

  it('Tasten aus dem Recipe', () => {
    const { rechts, links, kapitel, wurzel } = bau()
    rechts.scrollTo = vi.fn()
    const summary = /** @type {HTMLElement} */ (wurzel.querySelector('.nc-feature-accordeon__item-summary'))
    const pruefungen = {
      Enter: () => { taste(links[1], 'Enter'); expect(aktiv(links)).toEqual([false, true, false]); expect(document.activeElement).toBe(kapitel[1]) },
      Space: () => { taste(links[0], 'Space'); expect(aktiv(links)).toEqual([true, false, false]) },
      // Tab: Links bleiben Knoepfe in der Tab-Folge, die Eintraege natives <summary>
      Tab: () => { for (const l of links) expect(l.hasAttribute('tabindex')).toBe(false); expect(summary.tagName).toBe('SUMMARY') }
    }
    deckeTastenAb('feature-accordion', pruefungen)
    for (const p of Object.values(pruefungen)) p()
  })

  it('Zuordnung per aria-controls; Abbinden stellt is-active, aria-current und tabindex wieder her', () => {
    const { b, rechts, links, kapitel } = bau()
    rechts.scrollTo = vi.fn()
    links[1].click()
    abbinden(b, ['feature-accordion'])
    expect(links.map((l) => l.classList.contains('is-active'))).toEqual([true, false, false])
    expect(links.some((l) => l.hasAttribute('aria-current'))).toBe(false)
    expect(kapitel[1].hasAttribute('tabindex')).toBe(false)
    kapitel[2].id = 'k-drei'
    links[0].setAttribute('aria-controls', 'k-drei')
    anbinden(b, ['feature-accordion'])
    links[0].click()
    expect(document.activeElement).toBe(kapitel[2])
  })
})
