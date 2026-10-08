/**
 * Referenzseite (reference-page-recipe.json) in neo-behaviors — Entscheidung
 * Abschluss 08.10.2026, Punkt A (scroll-spy). Ersetzt
 * Drupal.behaviors.neoRefpageToc aus neo_fe/js/neo-theme.js, Muster
 * chapter-nav. Gebunden wird an das Markup, das die Arena im Modus
 * „Ausprobieren" aus dem Recipe baut; jede Taste aus `keyboard` und jedes
 * Ereignis aus `events` wird geprueft. Neu gegenueber neo-theme.js: Seitenende
 * markiert den letzten Abschnitt, Fokus aufs Sprungziel, Ereignis.
 */
import { describe, it, expect, afterEach, vi } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { anbinden, abbinden, BEHAVIORS, NUR_AUSDRUECKLICH } from 'neo-behaviors'
import { buehne, lebendigesMarkup, deckeTastenAb, sammle, passtZumRecipe } from './_helfer.js'

afterEach(() => { document.body.innerHTML = ''; vi.restoreAllMocks(); vi.useRealTimers(); delete window.matchMedia })

// jsdom rechnet kein Layout: Oberkanten der Abschnitte relativ zum Fenster
// werden je Test gesetzt (wie nach einem Scroll), offsetHeight der Kopfzeile
// ebenso.
let oben = {}
const bau = ({ kopf = 0, specimen = 'website' } = {}) => {
  window.history.replaceState(null, '', '/')
  const b = buehne((kopf ? '<header class="site-header" data-neo-nav></header>' : '') + lebendigesMarkup('reference-page', specimen))
  const wurzel = /** @type {HTMLElement} */ (b.querySelector('.nc-refpage'))
  const links = /** @type {HTMLAnchorElement[]} */ ([...wurzel.querySelectorAll('.nc-refpage__toc-link')])
  const ziele = links.map((a) => /** @type {HTMLElement} */ (document.getElementById(a.getAttribute('href').slice(1))))
  oben = Object.fromEntries(ziele.map((z, i) => [z.id, 500 + i * 400]))
  for (const z of ziele) z.getBoundingClientRect = () => ({ top: oben[z.id], bottom: oben[z.id] + 300, left: 0, right: 0, width: 0, height: 300, x: 0, y: oben[z.id], toJSON () {} })
  if (kopf) Object.defineProperty(b.querySelector('.site-header'), 'offsetHeight', { configurable: true, value: kopf })
  anbinden(b, ['reference-page'])
  return { b, wurzel, links, ziele }
}
const scrolle = (stand) => {
  Object.assign(oben, stand)
  window.dispatchEvent(new Event('scroll'))
}
const sofort = () => vi.spyOn(window, 'requestAnimationFrame').mockImplementation((f) => { f(0); return 0 })
const aktuell = (links) => links.filter((a) => a.getAttribute('aria-current') === 'true').map((a) => a.textContent.trim())
const klick = (el) => el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))

describe('Referenzseite (reference-page-recipe.json)', () => {
  it('Website-Bauteil: nurAusdruecklich, steht in NUR_AUSDRUECKLICH; Arena-Markup hat die Verzeichniseintraege und Ziele', () => {
    expect(BEHAVIORS['reference-page'].nurAusdruecklich).toBe(true)
    expect(NUR_AUSDRUECKLICH).toContain('reference-page')
    const { wurzel, links, ziele } = bau()
    expect(wurzel.getAttribute('data-neo-behavior')).toBe('reference-page')
    expect(links.map((a) => a.textContent.trim())).toEqual(['Betrieb', 'Cloud', 'Vor Ort', 'Sicherheit', 'Zugang'])
    expect(ziele.every(Boolean)).toBe(true)
  })

  it('Anfang: der erste Eintrag ist markiert (ueber dem ersten Abschnitt, Seite oben)', () => {
    const { links } = bau()
    expect(aktuell(links)).toEqual(['Betrieb'])
  })

  it('Scroll-Spy: der LETZTE Abschnitt ueber der Linie (24 px ohne Kopfzeile), nicht der oberste sichtbare; Ereignis', () => {
    const { wurzel, links, ziele } = bau()
    const wechsel = sammle(wurzel, 'reference-page-change')
    sofort()
    // „Betrieb" ragt weit nach oben, „Cloud" hat die Linie passiert, „Vor Ort" nicht
    scrolle({ [ziele[0].id]: -900, [ziele[1].id]: 20, [ziele[2].id]: 25 })
    expect(aktuell(links)).toEqual(['Cloud'])
    expect(wechsel.at(-1).detail).toEqual({ value: ziele[1].id, previousValue: ziele[0].id })
    passtZumRecipe('reference-page', wechsel.at(-1))
    scrolle({ [ziele[2].id]: 24 })
    expect(aktuell(links)).toEqual(['Vor Ort'])
    expect(wechsel).toHaveLength(2)
  })

  it('Linie mit Kopfzeile: Hoehe aus .site-header[data-neo-nav] (offsetHeight) + 24, nicht aus dem Token', () => {
    const { links, ziele } = bau({ kopf: 72 })
    sofort()
    // Linie = 72 + 24 = 96
    scrolle({ [ziele[0].id]: -500, [ziele[1].id]: 96 })
    expect(aktuell(links)).toEqual(['Cloud'])
    scrolle({ [ziele[1].id]: 97 })
    expect(aktuell(links)).toEqual(['Betrieb'])
  })

  it('Linie mindestens scroll-margin-top des Abschnitts (Spy und Sprung lesen dieselbe Schwelle)', () => {
    const echt = window.getComputedStyle.bind(window)
    vi.spyOn(window, 'getComputedStyle').mockImplementation((el) => (el.classList?.contains('nc-refpage__section') ? /** @type {any} */ ({ scrollMarginTop: '88px' }) : echt(el)))
    const { links, ziele } = bau({ kopf: 64 })
    sofort()
    // Linie = max(88, 64) + 24 = 112
    scrolle({ [ziele[0].id]: -500, [ziele[1].id]: 112 })
    expect(aktuell(links)).toEqual(['Cloud'])
  })

  it('Seitenende: der letzte Abschnitt ist markiert, auch wenn er die Linie nie erreicht (neu gegenueber neo-theme.js)', () => {
    const { links, ziele } = bau()
    sofort()
    const scrollY = Object.getOwnPropertyDescriptor(window, 'scrollY')
    const hoehe = Object.getOwnPropertyDescriptor(document.body, 'scrollHeight')
    Object.defineProperty(document.body, 'scrollHeight', { configurable: true, value: 3000 })
    try {
      Object.defineProperty(window, 'scrollY', { configurable: true, value: 1000 })
      scrolle({ [ziele[0].id]: -900, [ziele[1].id]: -500, [ziele[2].id]: -100, [ziele[3].id]: 10, [ziele[4].id]: 300 })
      expect(aktuell(links)).toEqual(['Sicherheit'])
      Object.defineProperty(window, 'scrollY', { configurable: true, value: 3000 - window.innerHeight })
      scrolle({})
      expect(aktuell(links)).toEqual(['Zugang'])
    } finally {
      if (scrollY) Object.defineProperty(window, 'scrollY', scrollY); else delete window.scrollY
      if (hoehe) Object.defineProperty(document.body, 'scrollHeight', hoehe); else delete document.body.scrollHeight
    }
  })

  it('Klick markiert sofort, springt mit Versatz, setzt Anker und Fokus aufs Sprungziel; der Spy ruht bis das Scrollen steht', () => {
    vi.useFakeTimers()
    const { links, ziele } = bau({ kopf: 72 })
    const sprung = vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
    sofort()
    links[3].click()
    expect(aktuell(links)).toEqual(['Sicherheit'])
    // Ziel: Oberkante 1700 + scrollY 0 - 72
    expect(sprung).toHaveBeenCalledWith({ top: 1700 - 72, behavior: expect.any(String) })
    expect(window.location.hash).toBe(`#${ziele[3].id}`)
    expect(document.activeElement).toBe(ziele[3])
    expect(ziele[3].getAttribute('tabindex')).toBe('-1')
    // waehrend des Scrollens laeuft die Markierung nicht durch die Abschnitte dazwischen
    scrolle({ [ziele[1].id]: 0, [ziele[2].id]: 50 })
    expect(aktuell(links)).toEqual(['Sicherheit'])
    // Scrollen steht: Spy wertet wieder aus
    scrolle({ [ziele[0].id]: -1700, [ziele[1].id]: -1300, [ziele[2].id]: -900, [ziele[3].id]: 72, [ziele[4].id]: 472 })
    vi.advanceTimersByTime(200)
    expect(aktuell(links)).toEqual(['Sicherheit'])
  })

  it('Klick mit Strg/Cmd oder mittlerer Taste: Browser macht, das Behavior nicht', () => {
    const { links } = bau()
    const sprung = vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
    const e = new MouseEvent('click', { bubbles: true, cancelable: true, ctrlKey: true })
    links[2].dispatchEvent(e)
    expect(e.defaultPrevented).toBe(false)
    expect(sprung).not.toHaveBeenCalled()
    expect(aktuell(links)).toEqual(['Betrieb'])
  })

  it('Sprung-Marke: [data-neo-sprung] an <html>, bis das Scrollen steht; Abbinden nimmt sie mit', () => {
    vi.useFakeTimers()
    const { b, links, ziele } = bau({ kopf: 72 })
    vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
    sofort()
    const html = document.documentElement
    expect(html.hasAttribute('data-neo-sprung')).toBe(false)
    klick(links[4])
    expect(html.getAttribute('data-neo-sprung')).toBe('ja')
    vi.advanceTimersByTime(100)
    scrolle({ [ziele[1].id]: 0 })
    vi.advanceTimersByTime(100)
    expect(html.hasAttribute('data-neo-sprung')).toBe(true)
    vi.advanceTimersByTime(100)
    expect(html.hasAttribute('data-neo-sprung')).toBe(false)
    klick(links[1])
    expect(html.hasAttribute('data-neo-sprung')).toBe(true)
    abbinden(b, ['reference-page'])
    expect(html.hasAttribute('data-neo-sprung')).toBe(false)
  })

  it('Klappzustand: unter 1024 px startet das Verzeichnis zu und schliesst nach dem Sprung, darueber offen; folgt der Fensterbreite', () => {
    let hoerer = null
    const breit = { matches: false, addEventListener: (_t, f) => { hoerer = f } }
    window.matchMedia = vi.fn((q) => (q === '(min-width: 1024px)' ? breit : { matches: false }))
    const { b, wurzel, links } = bau()
    vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
    const details = /** @type {HTMLDetailsElement} */ (wurzel.querySelector('.nc-refpage__toc-disclosure'))
    expect(details.open).toBe(false)
    details.open = true
    links[1].click()
    expect(details.open).toBe(false)
    breit.matches = true
    hoerer()
    expect(details.open).toBe(true)
    links[2].click()
    expect(details.open).toBe(true)
    breit.matches = false
    hoerer()
    expect(details.open).toBe(false)
    // Abbinden: Ausgangszustand aus dem Markup (<details open>)
    abbinden(b, ['reference-page'])
    expect(details.open).toBe(true)
  })

  it('prefers-reduced-motion: Sprung ohne Animation', () => {
    const { links } = bau()
    window.matchMedia = vi.fn().mockReturnValue({ matches: true })
    const sprung = vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
    links[1].click()
    expect(sprung.mock.calls[0][0].behavior).toBe('auto')
  })

  it('Aufruf mit Anker: der Eintrag ist sofort markiert', () => {
    window.history.replaceState(null, '', '/')
    const b = buehne(lebendigesMarkup('reference-page', 'flach'))
    const links = /** @type {HTMLAnchorElement[]} */ ([...b.querySelectorAll('.nc-refpage__toc-link')])
    window.history.replaceState(null, '', links[1].getAttribute('href'))
    anbinden(b, ['reference-page'])
    expect(aktuell(links)).toEqual(['Sicherheit'])
    window.history.replaceState(null, '', '/')
  })

  it('Tasten aus dem Recipe', () => {
    const { links, ziele } = bau()
    vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
    const pruefungen = {
      // Enter auf einem Link loest im Browser den Klick aus
      Enter: () => { links[2].focus(); links[2].click(); expect(aktuell(links)).toEqual(['Vor Ort']); expect(document.activeElement).toBe(ziele[2]) },
      Tab: () => { for (const a of links) expect(a.hasAttribute('tabindex')).toBe(false) }
    }
    deckeTastenAb('reference-page', pruefungen)
    for (const p of Object.values(pruefungen)) p()
  })

  it('Abbinden: aria-current und tabindex wie vorher', () => {
    const { b, links, ziele } = bau()
    vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
    links[4].click()
    abbinden(b, ['reference-page'])
    expect(aktuell(links)).toEqual(['Betrieb'])
    expect(ziele[4].hasAttribute('tabindex')).toBe(false)
    expect(document.querySelector('[data-neo-behavior]')).toBeNull()
  })

  it('Drupal-Datei: bindet nur, wenn drupalSettings.neoBehaviors.nur es nennt', () => {
    const datei = readFileSync(resolve(__dirname, '../../../../packages/neo-behaviors/dist/neo-behaviors.js'), 'utf8')
    globalThis.Drupal = { behaviors: {} }
    try {
      new Function(datei)()
      document.body.innerHTML = lebendigesMarkup('reference-page', 'website')
      const d = globalThis.Drupal.behaviors.neoBehaviors
      expect(globalThis.NeoBehaviors.NUR_AUSDRUECKLICH).toContain('reference-page')
      d.attach(document, {})
      expect(document.querySelector('.nc-refpage').hasAttribute('data-neo-behavior')).toBe(false)
      d.attach(document, { neoBehaviors: { nur: ['reference-page'] } })
      expect(document.querySelector('.nc-refpage').getAttribute('data-neo-behavior')).toBe('reference-page')
      d.detach(document, {}, 'unload')
    } finally {
      delete globalThis.Drupal
      delete globalThis.NeoBehaviors
    }
  })
})
