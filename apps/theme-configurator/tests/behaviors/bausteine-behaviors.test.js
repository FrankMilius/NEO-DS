/**
 * neo-behaviors, Block Bausteine (Plan v3, Phase 3): Code-Snippet. Gebunden
 * wird an das Markup, das die Arena im Modus „Ausprobieren" aus dem Recipe
 * baut; jede Taste aus `keyboard` wird geprueft, jedes Ereignis gegen
 * `events`. Button, Item und Kennzahl haben kein Behavior (Button: Enter,
 * Leertaste und click sind nativ).
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

  it('Button, Item und Kennzahl haben kein Behavior, das Code-Snippet schon', () => {
    expect(MIT_VERHALTEN).toContain('code-snippet')
    for (const id of ['button', 'item', 'metric']) expect(MIT_VERHALTEN).not.toContain(id)
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
