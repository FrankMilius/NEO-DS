/**
 * neo-behaviors, Block Bausteine (Plan v3, Phase 3): Code-Snippet und der
 * Umschaltknopf des Buttons (Entscheidung 06.10.2026). Gebunden wird an das
 * Markup, das die Arena im Modus „Ausprobieren" aus dem Recipe baut; jede
 * Taste aus `keyboard` wird geprueft, jedes Ereignis gegen `events`. Item und
 * Kennzahl haben kein Behavior; beim Button nur .nc-button--toggle (Enter,
 * Leertaste und click der uebrigen Knoepfe sind nativ).
 */
import { describe, it, expect, afterEach, vi } from 'vitest'
import { anbinden, abbinden, MIT_VERHALTEN } from 'neo-behaviors'
import { lebendigesMarkup, buehne, taste, deckeTastenAb, sammle, passtZumRecipe } from './_helfer.js'

afterEach(() => {
  document.body.innerHTML = ''
  vi.useRealTimers()
  vi.unstubAllGlobals()
  delete navigator.clipboard
})

/** Zwischenablage des Browsers (jsdom hat keine). */
function ablage (fehler = false) {
  const geschrieben = []
  Object.defineProperty(navigator, 'clipboard', {
    configurable: true,
    value: { writeText: async (t) => { if (fehler) throw new Error('verweigert'); geschrieben.push(t) } }
  })
  return geschrieben
}

const warte = () => new Promise((r) => setTimeout(r, 0))

describe('Code-Snippet (code-snippet-recipe.json)', () => {
  function aufbau (specimen = 'multi-collapsed-expanded') {
    const b = buehne(lebendigesMarkup('code-snippet', specimen))
    anbinden(b, ['code-snippet'])
    const s = b.querySelector('.nc-code-snippet')
    return { b, s, kopieren: s.querySelector('.nc-code-snippet__copy'), mehr: s.querySelector('.nc-code-snippet__show-more') }
  }

  it('Item und Kennzahl haben kein Behavior, Code-Snippet und Button (Toggle) schon', () => {
    expect(MIT_VERHALTEN).toContain('code-snippet')
    expect(MIT_VERHALTEN).toContain('button')
    for (const id of ['item', 'metric']) expect(MIT_VERHALTEN).not.toContain(id)
  })

  it('jede Taste aus dem Recipe hat eine Pruefung', () => {
    deckeTastenAb('code-snippet', {
      Enter: 'Enter auf Kopieren bzw. Mehr anzeigen',
      Space: 'Leertaste wie Enter',
      Tab: 'pre, Kopieren und Mehr anzeigen sind per Tab erreichbar'
    })
  })

  it('Kopieren: Code in die Zwischenablage, Erfolg 2 s (Klasse + aria-label), code-snippet-copy { ok: true }', async () => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] })
    const text = ablage()
    const { s, kopieren } = aufbau()
    const ev = sammle(s, 'code-snippet-copy')
    kopieren.click()
    await vi.waitFor(() => expect(ev).toHaveLength(1))
    expect(text).toEqual([s.querySelector('.nc-code-snippet__code').textContent])
    expect(text[0]).toContain('useThemeStore')
    expect(kopieren.classList.contains('nc-code-snippet__copy--success')).toBe(true)
    expect(kopieren.getAttribute('aria-label')).toBe('Kopiert!')
    expect(ev[0].detail).toEqual({ ok: true })
    passtZumRecipe('code-snippet', ev[0])
    vi.advanceTimersByTime(2000)
    expect(kopieren.classList.contains('nc-code-snippet__copy--success')).toBe(false)
    expect(kopieren.getAttribute('aria-label')).toBe('Code kopieren')
  })

  it('Kopieren scheitert: kein Erfolgs-Feedback, code-snippet-copy { ok: false }', async () => {
    ablage(true)
    const { s, kopieren } = aufbau()
    const ev = sammle(s, 'code-snippet-copy')
    kopieren.click()
    await vi.waitFor(() => expect(ev).toHaveLength(1))
    expect(ev[0].detail).toEqual({ ok: false })
    passtZumRecipe('code-snippet', ev[0])
    expect(kopieren.classList.contains('nc-code-snippet__copy--success')).toBe(false)
    expect(kopieren.getAttribute('aria-label')).toBe('Code kopieren')
  })

  it('Enter und Leertaste: Kopieren (nativer Knopf)', async () => {
    const text = ablage()
    const { kopieren } = aufbau('header-comparison')
    taste(kopieren, 'Enter')
    await warte()
    taste(kopieren, 'Space')
    await warte()
    expect(text).toHaveLength(2)
  })

  it('Mehr anzeigen: --expanded, aria-expanded, Text, code-snippet-toggle { expanded } — auch per Enter/Leertaste', () => {
    const { s, mehr } = aufbau()
    const ev = sammle(s, 'code-snippet-toggle')
    expect(mehr.hidden).toBe(false)
    taste(mehr, 'Enter')
    expect(s.classList.contains('nc-code-snippet--expanded')).toBe(true)
    expect(mehr.getAttribute('aria-expanded')).toBe('true')
    expect(mehr.textContent).toBe('Weniger anzeigen')
    taste(mehr, 'Space')
    expect(s.classList.contains('nc-code-snippet--expanded')).toBe(false)
    expect(mehr.getAttribute('aria-expanded')).toBe('false')
    expect(mehr.textContent).toBe('Mehr anzeigen')
    expect(ev.map((e) => e.detail)).toEqual([{ expanded: true }, { expanded: false }])
    for (const e of ev) passtZumRecipe('code-snippet', e)
  })

  it('Tab: pre (scrollbar), Kopieren und Mehr anzeigen sind erreichbar', () => {
    const { s } = aufbau()
    expect(s.querySelector('.nc-code-snippet__pre').getAttribute('tabindex')).toBe('0')
    for (const k of s.querySelectorAll('button')) expect(k.disabled).toBe(false)
  })

  it('Mehr anzeigen verschwindet, wenn der Code in die eingeklappte Hoehe passt', () => {
    const b = buehne(lebendigesMarkup('code-snippet', 'multi-collapsed-expanded'))
    const pre = b.querySelector('.nc-code-snippet__pre')
    Object.defineProperty(pre, 'scrollHeight', { configurable: true, value: 120 })
    anbinden(b, ['code-snippet'])
    const mehr = b.querySelector('.nc-code-snippet__show-more')
    expect(mehr.hidden).toBe(true)
    abbinden(b, ['code-snippet'])
    expect(mehr.hidden).toBe(false)
    Object.defineProperty(pre, 'scrollHeight', { configurable: true, value: 600 })
    anbinden(b, ['code-snippet'])
    expect(mehr.hidden).toBe(false)
  })

  it('Inline-Snippet ohne Verhalten; Abbinden loest die Ereignisse', () => {
    const b = buehne(lebendigesMarkup('code-snippet', 'inline-in-context'))
    anbinden(b, ['code-snippet'])
    expect(b.querySelector('[data-neo-behavior]')).toBeNull()
    const { b: b2, s, mehr } = aufbau()
    abbinden(b2, ['code-snippet'])
    mehr.click()
    expect(s.classList.contains('nc-code-snippet--expanded')).toBe(false)
  })
})

describe('Button: Umschaltknopf (button-recipe.json, Entscheidung 06.10.2026)', () => {
  function aufbau () {
    const b = buehne(lebendigesMarkup('button', 'toggle'))
    anbinden(b, ['button'])
    const knoepfe = /** @type {HTMLButtonElement[]} */ ([...b.querySelectorAll('.nc-button--toggle')])
    return { b, knoepfe }
  }

  it('jede Taste aus dem Recipe hat eine Pruefung', () => {
    deckeTastenAb('button', {
      Enter: 'Enter schaltet aria-pressed (nativer Klick)',
      Space: 'Leertaste schaltet aria-pressed (nativer Klick)'
    })
  })

  it('bindet nur .nc-button--toggle, nicht die uebrigen Knoepfe', () => {
    const { knoepfe } = aufbau()
    expect(knoepfe).toHaveLength(3)
    for (const k of knoepfe) expect(k.getAttribute('data-neo-behavior')).toBe('button')
    const b2 = buehne(lebendigesMarkup('button', 'all-variants') + '<div class="nc-button-group"><button type="button" class="nc-button nc-button--outline" aria-pressed="false">x</button></div>')
    anbinden(b2, ['button'])
    expect(b2.querySelector('[data-neo-behavior]')).toBeNull()
    const ohne = b2.querySelector('[aria-pressed]')
    ohne.click()
    expect(ohne.getAttribute('aria-pressed')).toBe('false')
  })

  it('Klick schaltet aria-pressed um, button-toggle { pressed, value }', () => {
    const { b, knoepfe } = aufbau()
    const [fett, kursiv] = knoepfe
    expect(fett.getAttribute('aria-pressed')).toBe('true')
    expect(kursiv.getAttribute('aria-pressed')).toBe('false')
    const ev = sammle(b, 'button-toggle')
    kursiv.click()
    fett.click()
    expect(kursiv.getAttribute('aria-pressed')).toBe('true')
    expect(fett.getAttribute('aria-pressed')).toBe('false')
    expect(ev.map((e) => e.detail)).toEqual([{ pressed: true, value: 'Italic' }, { pressed: false, value: 'Bold' }])
    for (const e of ev) passtZumRecipe('button', e)
    expect(ev[0].target).toBe(kursiv)
  })

  it('value: data-value vor aria-label vor Beschriftung', () => {
    const b = buehne('<button type="button" class="nc-button nc-button--toggle" aria-pressed="false" data-value="fett" aria-label="Fett">F</button><button type="button" class="nc-button nc-button--toggle nc-button--icon-only" aria-pressed="false" aria-label="Stumm"></button>')
    anbinden(b, ['button'])
    const ev = sammle(b, 'button-toggle')
    for (const k of b.querySelectorAll('button')) k.click()
    expect(ev.map((e) => e.detail.value)).toEqual(['fett', 'Stumm'])
  })

  it('Enter und Leertaste schalten wie ein Klick (nativ)', () => {
    const { knoepfe } = aufbau()
    const k = knoepfe[2]
    taste(k, 'Enter')
    expect(k.getAttribute('aria-pressed')).toBe('true')
    taste(k, 'Space')
    expect(k.getAttribute('aria-pressed')).toBe('false')
  })

  it('gesperrte Knoepfe (disabled, aria-disabled) bleiben unveraendert und melden nichts', () => {
    const b = buehne('<button type="button" class="nc-button nc-button--toggle" aria-pressed="false" aria-disabled="true">A</button><button type="button" class="nc-button nc-button--toggle" aria-pressed="true" disabled>B</button>')
    anbinden(b, ['button'])
    const ev = sammle(b, 'button-toggle')
    const [a, d] = b.querySelectorAll('button')
    a.click()
    d.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    taste(a, 'Enter')
    expect(a.getAttribute('aria-pressed')).toBe('false')
    expect(d.getAttribute('aria-pressed')).toBe('true')
    expect(ev).toHaveLength(0)
  })

  it('Abbinden loest das Umschalten', () => {
    const { b, knoepfe } = aufbau()
    abbinden(b, ['button'])
    knoepfe[1].click()
    expect(knoepfe[1].getAttribute('aria-pressed')).toBe('false')
    expect(knoepfe[1].hasAttribute('data-neo-behavior')).toBe(false)
  })
})
