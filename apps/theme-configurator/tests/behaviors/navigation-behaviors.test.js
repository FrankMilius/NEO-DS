/**
 * neo-behaviors, Block Navigation (Plan v3, Entscheidung 02.10.2026):
 * Breadcrumb, Treeview, Navigationsmenue, Toolbar, Sidebar. Gebunden wird
 * an genau das Markup, das die Arena im Modus „Ausprobieren" aus dem Recipe
 * baut (src/arena-templates, m.ausprobieren); jede Taste aus `keyboard` wird
 * geprueft, jedes Ereignis gegen `events`.
 */
import { describe, it, expect, afterEach, vi } from 'vitest'
import { anbinden } from 'neo-behaviors'
import { lebendigesMarkup, buehne, taste, tastenAus, deckeTastenAb, sammle, passtZumRecipe } from './_helfer.js'

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
