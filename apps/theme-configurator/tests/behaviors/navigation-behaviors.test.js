/**
 * neo-behaviors, Block Navigation (Plan v3, Entscheidung 02.10.2026):
 * Breadcrumb, Treeview, Navigationsmenue, Toolbar, Sidebar. Gebunden wird
 * an genau das Markup, das die Arena im Modus „Ausprobieren" aus dem Recipe
 * baut (src/arena-templates, m.ausprobieren); jede Taste aus `keyboard` wird
 * geprueft, jedes Ereignis gegen `events`.
 */
import { describe, it, expect, afterEach, vi } from 'vitest'
import { anbinden, abbinden } from 'neo-behaviors'
import { lebendigesMarkup, zellenMarkup, zelleMit, buehne, taste, tastenAus, deckeTastenAb, sammle, passtZumRecipe } from './_helfer.js'

afterEach(() => { document.body.innerHTML = ''; vi.useRealTimers() })

const aktiv = () => document.activeElement

// ---------------------------------------------------------------------------
describe('Breadcrumb (breadcrumb-recipe.json)', () => {
  function aufbau (specimen = 'truncated') {
    const b = buehne(`<button type="button" id="draussen">draussen</button>\n${lebendigesMarkup('breadcrumb', specimen)}`)
    anbinden(b)
    const wurzel = b.querySelector('.nc-breadcrumb')
    const knopf = wurzel.querySelector('.nc-breadcrumb__ellipsis')
    const menue = wurzel.querySelector('.nc-breadcrumb__dropdown')
    return { b, wurzel, knopf, menue, eintraege: [...menue.querySelectorAll('.nc-breadcrumb__dropdown-item')] }
  }
  const istOffen = (d) => d.menue.classList.contains('is-open')

  it('Ausprobieren startet zu, auch beim Specimen „Dropdown Open"', () => {
    const d = aufbau('truncated-dropdown')
    expect(istOffen(d)).toBe(false)
    expect(d.knopf.getAttribute('aria-expanded')).toBe('false')
    expect(d.eintraege.every((e) => e.tabIndex === -1)).toBe(true)
  })

  it('Klick oeffnet (.is-open, aria-expanded), Fokus auf den ersten Eintrag; breadcrumb-toggle wie im Recipe', () => {
    const d = aufbau()
    const ev = sammle(d.wurzel, 'breadcrumb-toggle')
    d.knopf.click()
    expect(istOffen(d)).toBe(true)
    expect(d.knopf.getAttribute('aria-expanded')).toBe('true')
    expect(aktiv()).toBe(d.eintraege[0])
    d.knopf.click()
    expect(istOffen(d)).toBe(false)
    expect(ev.map((e) => e.detail)).toEqual([{ open: true }, { open: false }])
    for (const e of ev) passtZumRecipe('breadcrumb', e)
  })

  it('Klick ausserhalb und Klick auf einen Eintrag schliessen', () => {
    const d = aufbau()
    d.knopf.click()
    document.getElementById('draussen').click()
    expect(istOffen(d)).toBe(false)
    d.knopf.click()
    d.eintraege[1].click()
    expect(istOffen(d)).toBe(false)
  })

  it('Fokus verlaesst die Ellipsis → zu', () => {
    const d = aufbau()
    d.knopf.click()
    d.eintraege[0].dispatchEvent(new FocusEvent('focusout', { bubbles: true, relatedTarget: document.getElementById('draussen') }))
    expect(istOffen(d)).toBe(false)
  })

  it('volle Pfade ohne Ellipsis: nichts gebunden', () => {
    const b = buehne(lebendigesMarkup('breadcrumb', 'default-full'))
    expect(() => anbinden(b)).not.toThrow()
    expect(b.querySelector('.nc-breadcrumb__dropdown')).toBeNull()
  })

  describe('Tasten aus dem Recipe', () => {
    const offen = () => { const d = aufbau(); d.knopf.click(); return d }
    const pruefungen = {
      Enter: () => {
        const d = aufbau(); d.knopf.focus(); taste(d.knopf, 'Enter')
        expect(istOffen(d)).toBe(true); expect(aktiv()).toBe(d.eintraege[0])
        taste(d.knopf, 'Enter'); expect(istOffen(d)).toBe(false)
      },
      Space: () => { const d = aufbau(); taste(d.knopf, 'Space'); expect(istOffen(d)).toBe(true); expect(aktiv()).toBe(d.eintraege[0]) },
      ArrowDown: () => {
        const d = aufbau(); taste(d.knopf, 'ArrowDown'); expect(istOffen(d)).toBe(true); expect(aktiv()).toBe(d.eintraege[0])
        taste(d.eintraege[0], 'ArrowDown'); expect(aktiv()).toBe(d.eintraege[1])
        taste(d.eintraege[1], 'ArrowDown'); taste(d.eintraege[2], 'ArrowDown'); expect(aktiv()).toBe(d.eintraege[0]) // rundum
      },
      ArrowUp: () => {
        const d = aufbau(); taste(d.knopf, 'ArrowUp'); expect(istOffen(d)).toBe(true); expect(aktiv()).toBe(d.eintraege[2])
        taste(d.eintraege[2], 'ArrowUp'); expect(aktiv()).toBe(d.eintraege[1])
      },
      Home: () => { const d = offen(); d.eintraege[2].focus(); taste(d.eintraege[2], 'Home'); expect(aktiv()).toBe(d.eintraege[0]) },
      End: () => { const d = offen(); taste(d.eintraege[0], 'End'); expect(aktiv()).toBe(d.eintraege[2]) },
      Escape: () => {
        const d = offen(); const e = taste(d.eintraege[0], 'Escape')
        expect(istOffen(d)).toBe(false); expect(aktiv()).toBe(d.knopf); expect(e.defaultPrevented).toBe(true)
      },
      Tab: () => { const d = offen(); const e = taste(d.eintraege[0], 'Tab'); expect(istOffen(d)).toBe(false); expect(e.defaultPrevented).toBe(false) }
    }
    it('jede Taste hat eine Pruefung', () => deckeTastenAb('breadcrumb', pruefungen))
    for (const t of tastenAus('breadcrumb')) it(t, () => pruefungen[t]())
  })
})

// ---------------------------------------------------------------------------
describe('Treeview (treeview-recipe.json)', () => {
  const ITEM = '.nc-treeview__item'
  function aufbau (html = lebendigesMarkup('treeview', 'states')) {
    const b = buehne(html)
    anbinden(b)
    const wurzel = b.querySelector('.nc-treeview')
    const li = (text) => [...b.querySelectorAll(ITEM)].find((x) => x.querySelector(':scope > .nc-treeview__node .nc-treeview__label').textContent === text)
    const zeile = (text) => li(text).querySelector(':scope > .nc-treeview__node')
    return { b, wurzel, li, zeile }
  }
  const stopps = (b) => [...b.querySelectorAll('.nc-treeview__node')].filter((z) => z.tabIndex === 0)

  it('roving tabindex: genau eine Zeile im Tab-Fluss, Fokus per Klick wird Tab-Stopp', () => {
    const t = aufbau()
    expect(stopps(t.b)).toEqual([t.zeile('Dokumente')])
    t.zeile('Notizen.txt').click()
    expect(stopps(t.b)).toEqual([t.zeile('Notizen.txt')])
    expect(aktiv()).toBe(t.zeile('Notizen.txt'))
  })

  it('Klick waehlt (single): aria-selected + --selected wandern; treeview-select wie im Recipe', () => {
    const t = aufbau()
    const ev = sammle(t.wurzel, 'treeview-select')
    t.zeile('Budget-2026.xlsx').click()
    expect(t.li('Budget-2026.xlsx').getAttribute('aria-selected')).toBe('true')
    expect(t.li('Budget-2026.xlsx').classList.contains('nc-treeview__item--selected')).toBe(true)
    expect(t.li('Website-Relaunch.pdf').getAttribute('aria-selected')).toBe('false')
    expect(t.li('Website-Relaunch.pdf').classList.contains('nc-treeview__item--selected')).toBe(false)
    expect(t.b.querySelectorAll('[aria-selected="true"]').length).toBe(1)
    expect(ev.map((e) => e.detail)).toEqual([{ value: 'Budget-2026.xlsx', selected: true, values: ['Budget-2026.xlsx'] }])
    passtZumRecipe('treeview', ev[0])
    t.zeile('Budget-2026.xlsx').click()
    expect(ev).toHaveLength(1) // schon gewaehlt
  })

  it('Chevron klappt nur, waehlt nicht; treeview-toggle wie im Recipe', () => {
    const t = aufbau()
    const ev = sammle(t.wurzel, 'treeview-toggle')
    const auswahl = sammle(t.wurzel, 'treeview-select')
    t.zeile('Vorlagen').querySelector('.nc-treeview__toggle').click()
    expect(t.li('Vorlagen').getAttribute('aria-expanded')).toBe('true')
    t.zeile('Vorlagen').querySelector('.nc-treeview__toggle').click()
    expect(t.li('Vorlagen').getAttribute('aria-expanded')).toBe('false')
    expect(ev.map((e) => e.detail)).toEqual([{ value: 'Vorlagen', expanded: true }, { value: 'Vorlagen', expanded: false }])
    passtZumRecipe('treeview', ev[0])
    expect(auswahl).toHaveLength(0)
  })

  it('Zuklappen mit dem Fokus im Ast holt den Fokus auf den Zweig', () => {
    const t = aufbau()
    t.zeile('Budget-2026.xlsx').focus()
    t.zeile('Projekte').querySelector('.nc-treeview__toggle').click()
    expect(t.li('Projekte').getAttribute('aria-expanded')).toBe('false')
    expect(stopps(t.b)).toEqual([t.zeile('Projekte')])
  })

  it('gesperrter Eintrag: wird uebersprungen, nicht gewaehlt, nicht geklappt', () => {
    const t = aufbau(zelleMit('treeview', 'states', (h) => h.includes('nc-treeview__item--disabled')))
    expect(t.li('Vorlagen').getAttribute('aria-disabled')).toBe('true')
    taste(t.zeile('Budget-2026.xlsx'), 'ArrowDown')
    expect(aktiv()).toBe(t.zeile('Notizen.txt'))
    t.zeile('Vorlagen').click()
    expect(t.li('Vorlagen').getAttribute('aria-selected')).toBe('false')
    expect(t.li('Vorlagen').getAttribute('aria-expanded')).toBe('false')
  })

  it('Checkbox-Modus: Anhaken schaltet Nachfahren, Eltern werden mixed/true; Checkbox folgt', () => {
    const t = aufbau(lebendigesMarkup('treeview', 'checkbox-mode'))
    const ev = sammle(t.wurzel, 'treeview-select')
    const box = (text) => t.zeile(text).querySelector('.nc-treeview__checkbox')
    // Projekte ist mixed (Website an, Budget aus): Budget anhaken → Projekte true
    t.zeile('Budget-2026.xlsx').click()
    expect(t.li('Budget-2026.xlsx').getAttribute('aria-checked')).toBe('true')
    expect(t.li('Projekte').getAttribute('aria-checked')).toBe('true')
    expect(box('Projekte').checked).toBe(true)
    expect(box('Projekte').indeterminate).toBe(false)
    expect(t.li('Dokumente').getAttribute('aria-checked')).toBe('mixed')
    expect(box('Dokumente').indeterminate).toBe(true)
    // Zweig abhaken → alle Nachfahren aus
    t.zeile('Projekte').click()
    expect(['Projekte', 'Website-Relaunch.pdf', 'Budget-2026.xlsx'].map((x) => t.li(x).getAttribute('aria-checked'))).toEqual(['false', 'false', 'false'])
    expect(t.li('Dokumente').getAttribute('aria-checked')).toBe('false')
    // Klick direkt auf die Checkbox hakt ebenfalls an
    box('Notizen.txt').click()
    expect(t.li('Notizen.txt').getAttribute('aria-checked')).toBe('true')
    expect(box('Notizen.txt').checked).toBe(true)
    expect(ev.at(-1).detail).toEqual({ value: 'Notizen.txt', selected: true, values: ['Notizen.txt'] })
    for (const e of ev) passtZumRecipe('treeview', e)
    expect(t.b.querySelector('[aria-selected]')).toBeNull()
  })

  describe('Tasten aus dem Recipe', () => {
    const pruefungen = {
      ArrowDown: () => {
        const t = aufbau(); t.zeile('Dokumente').focus()
        taste(t.zeile('Dokumente'), 'ArrowDown'); expect(aktiv()).toBe(t.zeile('Projekte'))
        taste(t.zeile('Notizen.txt'), 'ArrowDown'); expect(aktiv()).toBe(t.zeile('Bilder')) // Vorlagen zu: Kinder uebersprungen
        taste(t.zeile('Archiv'), 'ArrowDown'); expect(aktiv()).toBe(t.zeile('Bilder')) // kein Rundum
        expect(stopps(t.b)).toEqual([t.zeile('Bilder')])
      },
      ArrowUp: () => {
        const t = aufbau(); taste(t.zeile('Projekte'), 'ArrowUp'); expect(aktiv()).toBe(t.zeile('Dokumente'))
        const e = taste(t.zeile('Dokumente'), 'ArrowUp'); expect(e.defaultPrevented).toBe(false)
      },
      ArrowRight: () => {
        const t = aufbau(); const ev = sammle(t.wurzel, 'treeview-toggle')
        t.zeile('Vorlagen').focus(); taste(t.zeile('Vorlagen'), 'ArrowRight')
        expect(t.li('Vorlagen').getAttribute('aria-expanded')).toBe('true'); expect(aktiv()).toBe(t.zeile('Vorlagen'))
        taste(t.zeile('Vorlagen'), 'ArrowRight'); expect(aktiv()).toBe(t.zeile('Angebot.docx'))
        taste(t.zeile('Angebot.docx'), 'ArrowRight'); expect(aktiv()).toBe(t.zeile('Angebot.docx')) // Blatt
        expect(ev).toHaveLength(1)
      },
      ArrowLeft: () => {
        const t = aufbau()
        taste(t.zeile('Budget-2026.xlsx'), 'ArrowLeft'); expect(aktiv()).toBe(t.zeile('Projekte'))
        taste(t.zeile('Projekte'), 'ArrowLeft'); expect(t.li('Projekte').getAttribute('aria-expanded')).toBe('false')
        taste(t.zeile('Projekte'), 'ArrowLeft'); expect(aktiv()).toBe(t.zeile('Dokumente'))
      },
      Home: () => { const t = aufbau(); taste(t.zeile('Archiv'), 'Home'); expect(aktiv()).toBe(t.zeile('Dokumente')) },
      End: () => {
        const t = aufbau(); taste(t.zeile('Dokumente'), 'End'); expect(aktiv()).toBe(t.zeile('Archiv'))
        taste(t.zeile('Archiv'), 'ArrowRight'); taste(t.zeile('Archiv'), 'Home'); taste(t.zeile('Dokumente'), 'End'); expect(aktiv()).toBe(t.zeile('2025'))
      },
      Enter: () => {
        const t = aufbau(); const ev = sammle(t.wurzel, 'treeview-select')
        const e = taste(t.zeile('Notizen.txt'), 'Enter')
        expect(e.defaultPrevented).toBe(true); expect(t.li('Notizen.txt').getAttribute('aria-selected')).toBe('true'); expect(ev).toHaveLength(1)
      },
      Space: () => {
        const t = aufbau(lebendigesMarkup('treeview', 'checkbox-mode'))
        taste(t.zeile('Archiv'), 'Space'); expect(t.li('Archiv').getAttribute('aria-checked')).toBe('true')
        expect(t.li('2025').getAttribute('aria-checked')).toBe('true')
      },
      Tab: () => {
        const t = aufbau(); const e = taste(t.zeile('Dokumente'), 'Tab')
        expect(e.defaultPrevented).toBe(false); expect(stopps(t.b)).toHaveLength(1)
      }
    }
    it('jede Taste hat eine Pruefung', () => deckeTastenAb('treeview', pruefungen))
    for (const t of tastenAus('treeview')) it(t, () => pruefungen[t]())
  })
})

// ---------------------------------------------------------------------------
describe('Navigationsmenue (navigation-menu-recipe.json)', () => {
  function aufbau (specimen = 'default-dropdown') {
    const b = buehne(`${lebendigesMarkup('navigation-menu', specimen)}\n<button type="button" id="draussen">draussen</button>`)
    anbinden(b)
    const wurzel = b.querySelector('.nc-navigation-menu')
    const oben = [...wurzel.querySelectorAll('.nc-navigation-menu__list > .nc-navigation-menu__item > :first-child')]
    const [produkte, services] = oben
    const huelle = wurzel.querySelector('.nc-navigation-menu__viewport-wrapper')
    const sicht = wurzel.querySelector('.nc-navigation-menu__viewport')
    const panel = () => [...sicht.querySelectorAll('[role="menuitem"]')]
    return { b, wurzel, oben, produkte, services, huelle, sicht, panel }
  }
  const offenIst = (n, a) => a.dataset.state === 'open' && a.getAttribute('aria-expanded') === 'true' && n.huelle.dataset.state === 'open' && n.sicht.dataset.state === 'open'
  const zu = (n) => n.huelle.dataset.state === 'closed' && n.sicht.children.length === 0 && n.oben.every((a) => a.dataset.state !== 'open')

  it('Ausprobieren startet zu (auch „Geöffnet"); Vorlagen im Item inert; eine Tab-Station', () => {
    const n = aufbau('mega-menu')
    expect(zu(n)).toBe(true)
    for (const v of n.wurzel.querySelectorAll('.nc-navigation-menu__item > .nc-navigation-menu__content')) expect(v.hasAttribute('inert')).toBe(true)
    expect(n.oben.map((a) => a.tabIndex)).toEqual([0, -1, -1, -1, -1])
  })

  it('Klick oeffnet: Kopie im Viewport (nicht inert), data-state/aria-expanded, Indikator; navigation-menu-change wie im Recipe', () => {
    const n = aufbau()
    const ev = sammle(n.wurzel, 'navigation-menu-change')
    n.produkte.click()
    expect(offenIst(n, n.produkte)).toBe(true)
    const kopie = n.sicht.querySelector(':scope > .nc-navigation-menu__content')
    expect(kopie.dataset.state).toBe('open')
    expect(kopie.hasAttribute('inert')).toBe(false)
    expect(n.panel().length).toBe(3)
    expect(n.panel().every((e) => e.tabIndex === -1)).toBe(true)
    expect(n.wurzel.querySelector('.nc-navigation-menu__indicator').dataset.state).toBe('visible')
    n.services.click()
    expect(offenIst(n, n.services)).toBe(true)
    expect(n.produkte.dataset.state).toBe('closed')
    expect(n.sicht.querySelector('.nc-navigation-menu__content').dataset.motion).toBe('from-end')
    n.services.click()
    expect(zu(n)).toBe(true)
    expect(n.wurzel.querySelector('.nc-navigation-menu__indicator').dataset.state).toBe('hidden')
    expect(ev.map((e) => e.detail)).toEqual([
      { value: 'Produkte', previousValue: null },
      { value: 'Services', previousValue: 'Produkte' },
      { value: null, previousValue: 'Services' }
    ])
    for (const e of ev) passtZumRecipe('navigation-menu', e)
  })

  it('Klick ausserhalb und Fokusverlust schliessen', () => {
    const n = aufbau()
    n.produkte.click()
    document.getElementById('draussen').click()
    expect(zu(n)).toBe(true)
    n.produkte.click()
    n.produkte.dispatchEvent(new FocusEvent('focusout', { bubbles: true, relatedTarget: document.getElementById('draussen') }))
    expect(zu(n)).toBe(true)
  })

  it('data-trigger="hover": oeffnet nach 150 ms, Viewport haelt offen, schliesst 150 ms nach Verlassen', () => {
    vi.useFakeTimers()
    const n = aufbau()
    expect(n.wurzel.dataset.trigger).toBe('hover')
    const item = n.produkte.parentElement
    item.dispatchEvent(new MouseEvent('mouseenter'))
    vi.advanceTimersByTime(149)
    expect(zu(n)).toBe(true)
    vi.advanceTimersByTime(1)
    expect(offenIst(n, n.produkte)).toBe(true)
    item.dispatchEvent(new MouseEvent('mouseleave'))
    n.huelle.dispatchEvent(new MouseEvent('mouseenter'))
    vi.advanceTimersByTime(500)
    expect(offenIst(n, n.produkte)).toBe(true)
    n.huelle.dispatchEvent(new MouseEvent('mouseleave'))
    vi.advanceTimersByTime(150)
    expect(zu(n)).toBe(true)
  })

  it('data-trigger="click": Verweilen oeffnet nicht', () => {
    vi.useFakeTimers()
    const b = buehne(lebendigesMarkup('navigation-menu', 'default-dropdown').replace('data-trigger="hover"', 'data-trigger="click"'))
    anbinden(b)
    b.querySelector('.nc-navigation-menu__item').dispatchEvent(new MouseEvent('mouseenter'))
    vi.advanceTimersByTime(500)
    expect(b.querySelector('.nc-navigation-menu__trigger').dataset.state).toBe('closed')
  })

  describe('Tasten aus dem Recipe', () => {
    const pruefungen = {
      ArrowRight: () => {
        const n = aufbau(); n.produkte.focus()
        taste(n.produkte, 'ArrowRight'); expect(aktiv()).toBe(n.services); expect(n.oben.map((a) => a.tabIndex)).toEqual([-1, 0, -1, -1, -1])
        taste(n.oben[4], 'ArrowRight'); expect(aktiv()).toBe(n.produkte) // rundum
        // Panel offen: folgt dem Fokus; aus dem Panel heraus zum naechsten Eintrag
        taste(n.produkte, 'ArrowDown'); taste(aktiv(), 'ArrowRight')
        expect(aktiv()).toBe(n.services); expect(offenIst(n, n.services)).toBe(true)
        taste(n.services, 'ArrowRight'); expect(aktiv()).toBe(n.oben[2]); expect(zu(n)).toBe(true)
      },
      ArrowLeft: () => {
        const n = aufbau(); taste(n.produkte, 'ArrowLeft'); expect(aktiv()).toBe(n.oben[4])
        taste(n.services, 'ArrowDown'); taste(aktiv(), 'ArrowLeft'); expect(aktiv()).toBe(n.produkte); expect(offenIst(n, n.produkte)).toBe(true)
      },
      ArrowDown: () => {
        const n = aufbau(); taste(n.produkte, 'ArrowDown')
        expect(offenIst(n, n.produkte)).toBe(true); expect(aktiv()).toBe(n.panel()[0])
        taste(n.panel()[0], 'ArrowDown'); expect(aktiv()).toBe(n.panel()[1])
        taste(n.panel()[1], 'ArrowDown'); taste(n.panel()[2], 'ArrowDown'); expect(aktiv()).toBe(n.panel()[0]) // rundum
      },
      ArrowUp: () => {
        const n = aufbau(); taste(n.produkte, 'ArrowUp'); expect(aktiv()).toBe(n.panel()[2])
        taste(n.panel()[2], 'ArrowUp'); expect(aktiv()).toBe(n.panel()[1])
      },
      Home: () => {
        const n = aufbau(); taste(n.oben[3], 'Home'); expect(aktiv()).toBe(n.produkte)
        taste(n.produkte, 'ArrowDown'); taste(n.panel()[0], 'End'); taste(n.panel()[2], 'Home'); expect(aktiv()).toBe(n.panel()[0])
      },
      End: () => {
        const n = aufbau(); taste(n.produkte, 'End'); expect(aktiv()).toBe(n.oben[4])
        taste(n.produkte, 'ArrowDown'); taste(n.panel()[0], 'End'); expect(aktiv()).toBe(n.panel()[2])
      },
      Enter: () => {
        const n = aufbau(); const e = taste(n.produkte, 'Enter')
        expect(e.defaultPrevented).toBe(true); expect(offenIst(n, n.produkte)).toBe(true); expect(aktiv()).toBe(n.panel()[0])
      },
      Space: () => { const n = aufbau(); taste(n.services, 'Space'); expect(offenIst(n, n.services)).toBe(true); expect(aktiv()).toBe(n.panel()[0]) },
      Escape: () => {
        const n = aufbau(); taste(n.produkte, 'ArrowDown'); taste(n.panel()[1], 'Escape')
        expect(zu(n)).toBe(true); expect(aktiv()).toBe(n.produkte)
        n.produkte.click(); taste(n.produkte, 'Escape'); expect(zu(n)).toBe(true)
      },
      Tab: () => {
        const n = aufbau(); taste(n.produkte, 'ArrowDown'); const e = taste(n.panel()[0], 'Tab')
        expect(zu(n)).toBe(true); expect(e.defaultPrevented).toBe(false)
      }
    }
    it('jede Taste hat eine Pruefung', () => deckeTastenAb('navigation-menu', pruefungen))
    for (const t of tastenAus('navigation-menu')) it(t, () => pruefungen[t]())
  })
})

// ---------------------------------------------------------------------------
describe('Toolbar (toolbar-recipe.json)', () => {
  const STEUER = 'button, input'
  function aufbau (specimen = 'content-variants', html = lebendigesMarkup('toolbar', specimen)) {
    const b = buehne(`<button type="button" id="davor">davor</button>\n${html}\n<button type="button" id="danach">danach</button>`)
    anbinden(b)
    const wurzel = b.querySelector('.nc-toolbar')
    return { b, wurzel, el: [...wurzel.querySelectorAll(STEUER)] }
  }
  const stopps = (t) => t.el.filter((e) => e.tabIndex === 0)

  it('eine Tab-Station: Ausprobieren-Markup kommt mit roving tabindex, das Behavior fuehrt ihn', () => {
    const t = aufbau()
    expect(t.el.map((e) => e.getAttribute('tabindex'))).toEqual(['0', '-1', '-1', '-1'])
    expect(stopps(t)).toEqual([t.el[0]])
  })

  it('Markup ohne tabindex (wie in „Zustände"): Behavior setzt den roving tabindex, Loesen stellt ihn zurueck', () => {
    const t = aufbau(null, zellenMarkup('toolbar', 'content-variants'))
    expect(t.el.map((e) => e.tabIndex)).toEqual([0, -1, -1, -1])
    abbinden(t.b)
    expect(t.el.some((e) => e.hasAttribute('tabindex'))).toBe(false)
  })

  it('Klick und Fokus verschieben die Tab-Station; toolbar-focus wie im Recipe', () => {
    const t = aufbau()
    const ev = sammle(t.wurzel, 'toolbar-focus')
    t.el[2].click()
    expect(stopps(t)).toEqual([t.el[2]])
    t.el[3].focus()
    expect(stopps(t)).toEqual([t.el[3]])
    expect(ev.map((e) => e.detail)).toEqual([
      { value: 'Exportieren', previousValue: 'Neu' },
      { value: 'Archivieren', previousValue: 'Exportieren' }
    ])
    for (const e of ev) passtZumRecipe('toolbar', e)
  })

  it('Eingabefeld: Pfeiltasten, Pos1 und Ende bleiben im Feld', () => {
    const t = aufbau('table-toolbar')
    const feld = t.wurzel.querySelector('input')
    feld.focus()
    expect(stopps(t)).toEqual([feld])
    for (const k of ['ArrowLeft', 'ArrowRight', 'Home', 'End']) {
      const e = taste(feld, k)
      expect(e.defaultPrevented, k).toBe(false)
      expect(aktiv()).toBe(feld)
    }
  })

  it('Eingabefeld am Rand: Tab verlaesst die Leiste', () => {
    const t = aufbau(null, '<div class="nc-toolbar" role="toolbar" aria-label="Test"><div class="nc-toolbar__group"><button type="button" class="nc-button">A</button><input class="nc-input" type="text" aria-label="Feld"></div></div>')
    const feld = t.wurzel.querySelector('input')
    feld.focus()
    expect(taste(feld, 'Tab').defaultPrevented).toBe(false)
    expect(taste(feld, 'Shift+Tab').defaultPrevented).toBe(true)
    expect(aktiv()).toBe(t.el[0])
  })

  it('eingebettete Toggle-Groups: Pfeile laufen flach durch, waehlen nicht; Klick waehlt (Toggle-Group), eine Tab-Station bleibt', () => {
    const t = aufbau('editor-toolbar')
    const radios = [...t.wurzel.querySelectorAll('[role="radio"]')]
    const vor = radios.map((r) => r.getAttribute('aria-checked'))
    expect(t.wurzel.querySelector('.nc-toggle-group').getAttribute('data-neo-behavior')).toBe('toggle-group')
    radios[0].focus()
    taste(radios[0], 'ArrowRight')
    expect(aktiv()).toBe(radios[1])
    expect(radios.map((r) => r.getAttribute('aria-checked'))).toEqual(vor)
    radios[2].click()
    expect(radios[2].getAttribute('aria-checked')).toBe('true')
    expect(stopps(t)).toEqual([radios[2]])
    // Mehrfachauswahl (aria-pressed): Leertaste schaltet ueber die Toggle-Group
    const fett = t.wurzel.querySelector('[aria-pressed]')
    taste(fett, 'Space')
    expect(fett.getAttribute('aria-pressed')).toBe('false')
  })

  describe('Tasten aus dem Recipe', () => {
    const pruefungen = {
      ArrowRight: () => {
        const t = aufbau(); t.el[0].focus()
        taste(t.el[0], 'ArrowRight'); expect(aktiv()).toBe(t.el[1]); expect(stopps(t)).toEqual([t.el[1]])
        taste(t.el[3], 'ArrowRight'); expect(aktiv()).toBe(t.el[0]) // rundum
      },
      ArrowLeft: () => { const t = aufbau(); taste(t.el[0], 'ArrowLeft'); expect(aktiv()).toBe(t.el[3]) },
      Home: () => { const t = aufbau(); taste(t.el[2], 'Home'); expect(aktiv()).toBe(t.el[0]) },
      End: () => { const t = aufbau(); taste(t.el[0], 'End'); expect(aktiv()).toBe(t.el[3]); expect(stopps(t)).toEqual([t.el[3]]) },
      Tab: () => {
        const t = aufbau(); expect(taste(t.el[1], 'Tab').defaultPrevented).toBe(false)
        const tab = aufbau('table-toolbar'); const feld = tab.wurzel.querySelector('input'); feld.focus()
        const e = taste(feld, 'Tab'); expect(e.defaultPrevented).toBe(true)
        expect(aktiv().textContent).toBe('Exportieren'); expect(stopps(tab)).toEqual([aktiv()])
      },
      'Shift+Tab': () => {
        const t = aufbau(); expect(taste(t.el[1], 'Shift+Tab').defaultPrevented).toBe(false)
        const tab = aufbau('table-toolbar'); const feld = tab.wurzel.querySelector('input'); feld.focus()
        taste(feld, 'Shift+Tab'); expect(aktiv().textContent).toBe('Filter')
      }
    }
    it('jede Taste hat eine Pruefung', () => deckeTastenAb('toolbar', pruefungen))
    for (const t of tastenAus('toolbar')) it(t, () => pruefungen[t]())
  })

  describe('Sticky: .is-scrolled solange angeheftet (IntersectionObserver)', () => {
    // Gemockter IntersectionObserver: merkt sich Beobachter und Optionen
    let beobachter
    class IOAttrappe {
      constructor (rueckruf, optionen) { this.rueckruf = rueckruf; this.optionen = optionen; this.ziele = []; this.getrennt = false; beobachter.push(this) }
      observe (el) { this.ziele.push(el) }
      unobserve () {}
      disconnect () { this.getrennt = true }
      melde (ratio, oben, rahmenOben = 1) { this.rueckruf([{ target: this.ziele[0], intersectionRatio: ratio, boundingClientRect: { top: oben }, rootBounds: { top: rahmenOben } }], this) }
    }
    const sticky = (html = lebendigesMarkup('toolbar', 'sticky-scrolled')) => {
      beobachter = []
      vi.stubGlobal('IntersectionObserver', IOAttrappe)
      return aufbau(null, html)
    }
    afterEach(() => vi.unstubAllGlobals())

    it('Ausprobieren-Markup der Sticky-Specimen ist nc-toolbar--sticky', () => {
      const t = sticky()
      expect(t.wurzel.classList.contains('nc-toolbar--sticky')).toBe(true)
    })

    it('angeheftet (Oberkante ueber dem um 1px verkleinerten Rahmen) setzt die Klasse, sonst nicht', () => {
      const t = sticky()
      expect(beobachter).toHaveLength(1)
      const io = beobachter[0]
      expect(io.ziele).toEqual([t.wurzel])
      expect(io.optionen).toMatchObject({ rootMargin: '-1px 0px 0px 0px', threshold: [1] })
      io.melde(1, 40)
      expect(t.wurzel.classList.contains('is-scrolled')).toBe(false)
      io.melde(0.98, 0)
      expect(t.wurzel.classList.contains('is-scrolled')).toBe(true)
      // Unten angeschnitten (Leiste ragt unten aus dem Fenster): nicht angeheftet
      io.melde(0.5, 600)
      expect(t.wurzel.classList.contains('is-scrolled')).toBe(false)
    })

    it('Abbinden trennt den Beobachter und raeumt die Klasse auf', () => {
      const t = sticky()
      beobachter[0].melde(0.9, 0)
      expect(t.wurzel.classList.contains('is-scrolled')).toBe(true)
      abbinden(t.b)
      expect(beobachter[0].getrennt).toBe(true)
      expect(t.wurzel.classList.contains('is-scrolled')).toBe(false)
    })

    it('ohne Sticky-Modifier kein Beobachter; ohne IntersectionObserver nichts', () => {
      sticky(lebendigesMarkup('toolbar', 'content-variants'))
      expect(beobachter).toHaveLength(0)
      document.body.innerHTML = ''
      vi.stubGlobal('IntersectionObserver', undefined)
      const t = aufbau(null, lebendigesMarkup('toolbar', 'sticky-scrolled'))
      expect(t.wurzel.classList.contains('is-scrolled')).toBe(false)
      expect(stopps(t)).toHaveLength(1) // Tastatur arbeitet trotzdem
    })
  })
})

// ---------------------------------------------------------------------------
describe('Sidebar (sidebar-recipe.json)', () => {
  function aufbau (specimen) {
    const b = buehne(lebendigesMarkup('sidebar', specimen))
    anbinden(b)
    const wurzel = b.querySelector('.nc-sidebar')
    return { b, wurzel }
  }
  const unter = (s) => s.wurzel.querySelector('button.nc-sidebar__item[aria-controls]')
  const panel = (s) => document.getElementById(unter(s).getAttribute('aria-controls'))

  it('Untermenue: Klick klappt zu und auf ([hidden], aria-expanded); sidebar-submenu-toggle wie im Recipe', () => {
    const s = aufbau('nested-submenu')
    const ev = sammle(s.wurzel, 'sidebar-submenu-toggle')
    expect(panel(s).hidden).toBe(false)
    unter(s).click()
    expect(unter(s).getAttribute('aria-expanded')).toBe('false')
    expect(panel(s).hidden).toBe(true)
    unter(s).click()
    expect(panel(s).hidden).toBe(false)
    expect(ev.map((e) => e.detail)).toEqual([{ value: 'Einstellungen', open: false }, { value: 'Einstellungen', open: true }])
    for (const e of ev) passtZumRecipe('sidebar', e)
  })

  it('Einklappen: --collapsed, aria-expanded/-label am Knopf, Eintraege bekommen aria-label; sidebar-collapse', () => {
    const s = aufbau('full-sidebar')
    const knopf = s.wurzel.querySelector('.nc-sidebar__toggle')
    const ev = sammle(s.wurzel, 'sidebar-collapse')
    const eintrag = s.wurzel.querySelector('.nc-sidebar__nav a.nc-sidebar__item')
    expect(knopf.getAttribute('aria-expanded')).toBe('true')
    knopf.click()
    expect(s.wurzel.classList.contains('nc-sidebar--collapsed')).toBe(true)
    expect(knopf.getAttribute('aria-expanded')).toBe('false')
    expect(knopf.getAttribute('aria-label')).toBe('Navigation ausklappen')
    expect(eintrag.getAttribute('aria-label')).toBe('Dashboard')
    knopf.click()
    expect(s.wurzel.classList.contains('nc-sidebar--collapsed')).toBe(false)
    expect(knopf.getAttribute('aria-label')).toBe('Navigation einklappen')
    expect(eintrag.hasAttribute('aria-label')).toBe(false)
    expect(ev.map((e) => e.detail)).toEqual([{ collapsed: true }, { collapsed: false }])
    for (const e of ev) passtZumRecipe('sidebar', e)
  })

  it('Mobil-Lage: startet zu, Knopf oeffnet (Fokus in die Sidebar), Backdrop schliesst; sidebar-toggle', () => {
    const s = aufbau('mobile-overlay')
    const knopf = s.b.querySelector('button[aria-controls]')
    const hinten = s.b.querySelector('.nc-sidebar-backdrop')
    const ev = sammle(s.wurzel, 'sidebar-toggle')
    expect(s.wurzel.classList.contains('nc-sidebar--open')).toBe(false)
    expect(hinten.hidden).toBe(true)
    knopf.click()
    expect(s.wurzel.classList.contains('nc-sidebar--open')).toBe(true)
    expect(hinten.hidden).toBe(false)
    expect(knopf.getAttribute('aria-expanded')).toBe('true')
    expect(aktiv()).toBe(s.wurzel.querySelector('[aria-current="page"]'))
    hinten.click()
    expect(s.wurzel.classList.contains('nc-sidebar--open')).toBe(false)
    expect(hinten.hidden).toBe(true)
    expect(aktiv()).toBe(knopf)
    expect(ev.map((e) => e.detail)).toEqual([{ open: true, reason: 'trigger' }, { open: false, reason: 'overlay-click' }])
    for (const e of ev) passtZumRecipe('sidebar', e)
  })

  describe('Tasten aus dem Recipe', () => {
    const pruefungen = {
      Enter: () => {
        const s = aufbau('nested-submenu'); taste(unter(s), 'Enter'); expect(panel(s).hidden).toBe(true)
        const v = aufbau('full-sidebar'); taste(v.wurzel.querySelector('.nc-sidebar__toggle'), 'Enter'); expect(v.wurzel.classList.contains('nc-sidebar--collapsed')).toBe(true)
      },
      Space: () => { const s = aufbau('nested-submenu'); taste(unter(s), 'Space'); expect(unter(s).getAttribute('aria-expanded')).toBe('false') },
      Escape: () => {
        const s = aufbau('mobile-overlay'); const knopf = s.b.querySelector('button[aria-controls]'); const ev = sammle(s.wurzel, 'sidebar-toggle')
        taste(knopf, 'Enter'); expect(s.wurzel.classList.contains('nc-sidebar--open')).toBe(true)
        const e = taste(aktiv(), 'Escape')
        expect(e.defaultPrevented).toBe(true); expect(s.wurzel.classList.contains('nc-sidebar--open')).toBe(false); expect(aktiv()).toBe(knopf)
        expect(ev.at(-1).detail).toEqual({ open: false, reason: 'escape' })
        expect(taste(knopf, 'Escape').defaultPrevented).toBe(false) // zu: Escape bleibt frei
      }
    }
    it('jede Taste hat eine Pruefung', () => deckeTastenAb('sidebar', pruefungen))
    for (const t of tastenAus('sidebar')) it(t, () => pruefungen[t]())
  })
})
