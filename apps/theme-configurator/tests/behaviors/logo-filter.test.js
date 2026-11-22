/**
 * Logo filter (logo wall improvements, 22.11.2026): sector filter of the
 * logo wall. Markup as the website Twig renders it: button group
 * [data-logo-filter] (hidden without script) above the wall, buttons with
 * data-sector and aria-controls.
 */
import { describe, it, expect, afterEach } from 'vitest'
import { anbinden, abbinden, BEHAVIORS, NUR_AUSDRUECKLICH } from 'neo-behaviors'
import { buehne, sammle, passtZumRecipe } from './_helfer.js'

afterEach(() => { document.body.innerHTML = '' })

const logo = (name, sector) => `<div class="nc-logo-pill"${sector ? ` data-sector="${sector}"` : ''}><img alt="${name}" src="x.png"></div>`
const markup = (lang = 'de') => `<section lang="${lang}">
<div class="nc-logo-wall__filter" role="group" aria-label="Logos nach Branche filtern" data-logo-filter hidden>
  <button type="button" class="nc-chip" aria-pressed="true" aria-controls="w1" data-sector="">Alle</button>
  <button type="button" class="nc-chip" aria-pressed="false" aria-controls="w1" data-sector="Verwaltung">Verwaltung</button>
  <button type="button" class="nc-chip" aria-pressed="false" aria-controls="w1" data-sector="Wirtschaft">Wirtschaft</button>
</div>
<div class="nc-logo-wall" id="w1">${logo('A', 'Verwaltung')}${logo('B', 'Wirtschaft')}${logo('C', 'Verwaltung')}${logo('D', '')}</div></section>`

function bau (lang) {
  const b = buehne(markup(lang))
  const wurzel = b.querySelector('[data-logo-filter]')
  const ereignisse = sammle(wurzel, 'logo-filter')
  anbinden(b, ['logo-filter'])
  return { b, wurzel, ereignisse, knoepfe: [...wurzel.querySelectorAll('button')], logos: [...b.querySelectorAll('.nc-logo-pill')] }
}

describe('logo-filter', () => {
  it('website component: nurAusdruecklich, recipe logo-wall', () => {
    expect(NUR_AUSDRUECKLICH).toContain('logo-filter')
    expect(BEHAVIORS['logo-filter'].recipes).toEqual(['logo-wall'])
  })

  it('without binding the group stays hidden', () => {
    const b = buehne(markup())
    expect(b.querySelector('[data-logo-filter]').hidden).toBe(true)
  })

  it('binding shows the group and adds a polite live region', () => {
    const { wurzel } = bau()
    expect(wurzel.hidden).toBe(false)
    expect(wurzel.nextElementSibling.getAttribute('aria-live')).toBe('polite')
  })

  it('a sector hides the others, logos without sector only show under all; event and count', () => {
    const { wurzel, knoepfe, logos, ereignisse } = bau()
    knoepfe[1].click()
    expect(knoepfe.map((k) => k.getAttribute('aria-pressed'))).toEqual(['false', 'true', 'false'])
    expect(logos.map((l) => l.hidden)).toEqual([false, true, false, true])
    expect(wurzel.nextElementSibling.textContent).toBe('2 Logos angezeigt')
    expect(ereignisse.at(-1).detail).toEqual({ sector: 'Verwaltung', count: 2 })
    passtZumRecipe('logo-wall', ereignisse.at(-1))
    knoepfe[0].click()
    expect(logos.every((l) => !l.hidden)).toBe(true)
    expect(ereignisse.at(-1).detail).toEqual({ sector: '', count: 4 })
  })

  it('English text by lang', () => {
    const { knoepfe, wurzel } = bau('en')
    knoepfe[2].click()
    expect(wurzel.nextElementSibling.textContent).toBe('1 logo shown')
  })

  it('unbinding: group hidden, all logos visible, aria-pressed restored, live region removed', () => {
    const { b, wurzel, knoepfe, logos } = bau()
    knoepfe[2].click()
    abbinden(b, ['logo-filter'])
    expect(wurzel.hidden).toBe(true)
    expect(logos.every((l) => !l.hidden)).toBe(true)
    expect(knoepfe.map((k) => k.getAttribute('aria-pressed'))).toEqual(['true', 'false', 'false'])
    expect(b.querySelector('[aria-live]')).toBe(null)
  })

  it('no wall found: nothing bound', () => {
    const b = buehne('<div data-logo-filter hidden><button data-sector="" aria-controls="fehlt">Alle</button></div>')
    anbinden(b, ['logo-filter'])
    expect(b.querySelector('[data-logo-filter]').hidden).toBe(true)
  })
})
