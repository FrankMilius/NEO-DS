/**
 * neo-behaviors, Block Navigation (Plan v3, Entscheidung 02.10.2026):
 * Breadcrumb, Treeview, Navigationsmenue, Toolbar, Sidebar. Gebunden wird
 * an genau das Markup, das die Arena im Modus „Ausprobieren" aus dem Recipe
 * baut (src/arena-templates, m.ausprobieren); jede Taste aus `keyboard` wird
 * geprueft, jedes Ereignis gegen `events`.
 */
import { describe, it, expect, afterEach, vi } from 'vitest'
import { anbinden } from 'neo-behaviors'
import { lebendigesMarkup, zelleMit, buehne, taste, tastenAus, deckeTastenAb, sammle, passtZumRecipe } from './_helfer.js'

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
