/**
 * Hero Wortwechsel (I19 Phase 2, 24.11.2026): Behavior hero-wortwechsel aus
 * neo-behaviors (Recipe hero, Variante wortwechsel). Markup: das Beispiel der
 * Musterseite (docs/content/hero.html, Marke hero-wortwechsel:beispiel) —
 * dieselbe Quelle wie npm run pruefen:hero-ww. Jedes Ereignis wird gegen
 * `events` im Recipe geprueft.
 */
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, it, expect, afterEach, beforeEach, vi } from 'vitest'
import { anbinden, abbinden, BEHAVIORS, NUR_AUSDRUECKLICH } from 'neo-behaviors'
import { buehne, sammle, passtZumRecipe } from './_helfer.js'

const DOKU = resolve(import.meta.dirname, '../../../../docs/content/hero.html')
const BEISPIEL = readFileSync(DOKU, 'utf8').match(/<!-- hero-wortwechsel:beispiel -->([\s\S]*?)<!-- \/hero-wortwechsel:beispiel -->/)[1]

let breit = true
let reduziert = false
beforeEach(() => {
  vi.useFakeTimers()
  breit = true; reduziert = false
  window.matchMedia = vi.fn((q) => ({
    matches: (q === '(prefers-reduced-motion: reduce)' && reduziert) || (q === '(min-width: 960px)' && breit),
    addEventListener () {}, removeEventListener () {}
  }))
})
afterEach(() => {
  abbinden(document.body, ['hero-wortwechsel'])
  document.body.innerHTML = ''
  vi.useRealTimers()
  vi.restoreAllMocks()
  delete window.matchMedia
})

function bau ({ dauer = '2s', html = BEISPIEL } = {}) {
  const b = buehne(html)
  const wurzel = /** @type {HTMLElement} */ (b.querySelector('.nc-hero--wortwechsel'))
  if (dauer) wurzel.style.setProperty('--nc-hero-ww-duration', dauer)
  const wechsel = sammle(wurzel, 'hero-wortwechsel-change')
  const takt = sammle(wurzel, 'hero-wortwechsel-autoplay')
  anbinden(b, ['hero-wortwechsel'])
  const q = (s) => [...wurzel.querySelectorAll(s)]
  return {
    b, wurzel, wechsel, takt,
    worte: () => q('.nc-hero__ww-word'),
    webs: () => q('.nc-hero__ww-web > img'),
    apps: () => q('.nc-hero__ww-phone > img'),
    segmente: () => q('.nc-hero__ww-seg'),
    knopf: /** @type {HTMLButtonElement} */ (wurzel.querySelector('.nc-hero__ww-pause')),
    buehneEl: /** @type {HTMLElement} */ (wurzel.querySelector('.nc-hero__ww-stage')),
    aktiv: () => q('.nc-hero__ww-word').findIndex((w) => w.classList.contains('is-on'))
  }
}

describe('hero-wortwechsel: Website-Bauteil', () => {
  it('nurAusdruecklich, Soll im Recipe hero', () => {
    expect(BEHAVIORS['hero-wortwechsel'].nurAusdruecklich).toBe(true)
    expect(NUR_AUSDRUECKLICH).toContain('hero-wortwechsel')
    expect(BEHAVIORS['hero-wortwechsel'].recipes).toEqual(['hero'])
  })

  it('Binden: is-ready zeigt die Laufleiste, Woerter in Buchstaben zerlegt (Trennstelle bleibt)', () => {
    const { wurzel, worte } = bau()
    expect(wurzel.classList.contains('is-ready')).toBe(true)
    const w = worte()[2]
    expect(w.querySelectorAll('.nc-hero__ww-letter').length).toBe('zusammen-arbeiten'.length)
    expect(w.querySelector('.nc-hero__ww-break .nc-hero__ww-letter')?.textContent).toBe('-')
    expect(w.textContent).toBe('zusammen-arbeiten')
    const zahlen = [...w.querySelectorAll('.nc-hero__ww-letter')].map((l) => l.style.getPropertyValue('--i'))
    expect(zahlen.slice(0, 3)).toEqual(['0', '1', '2'])
  })
})

describe('hero-wortwechsel: Takt', () => {
  it('wechselt nach Ablauf der Dauer zum naechsten Claim: Wort, Web, App, Ton, Segmente, Name', () => {
    const { wurzel, wechsel, worte, webs, apps, segmente, buehneEl, aktiv } = bau()
    expect(aktiv()).toBe(0)
    vi.advanceTimersByTime(1999)
    expect(aktiv()).toBe(0)
    vi.advanceTimersByTime(1)
    expect(aktiv()).toBe(1)
    expect(worte()[0].classList.contains('is-off')).toBe(true)
    expect(webs().map((i) => i.classList.contains('is-on'))).toEqual([false, true, false, false, false, false])
    // Claim 2 hat kein App-Bild
    expect(buehneEl.classList.contains('has-app')).toBe(false)
    expect(apps().some((i) => i.classList.contains('is-on'))).toBe(false)
    expect(wurzel.dataset.tone).toBe('blue')
    expect(segmente().map((s) => s.getAttribute('aria-current'))).toEqual([null, 'true', null, null, null, null])
    expect(segmente().map((s) => s.classList.contains('is-done'))).toEqual([true, false, false, false, false, false])
    expect(wurzel.querySelector('[data-ww-current]').textContent).toBe('informieren')
    expect(buehneEl.getAttribute('aria-label')).toBe('Übersicht der Corporate News')
    expect(wechsel).toHaveLength(1)
    expect(wechsel[0].detail).toEqual({ index: 1, previousIndex: 0 })
    passtZumRecipe('hero', wechsel[0])
    // Claim 3 mit App, Trennstelle, danach rundum
    vi.advanceTimersByTime(2000)
    expect(aktiv()).toBe(2)
    expect(buehneEl.classList.contains('has-app')).toBe(true)
    expect(apps().find((i) => i.classList.contains('is-on'))?.dataset.wwIndex).toBe('2')
    expect(buehneEl.getAttribute('aria-label')).toBe('Communities und Gruppen, davor die App')
    expect(wurzel.querySelector('[data-ww-current]').textContent).toBe('zusammenarbeiten')
    vi.advanceTimersByTime(2000 * 4)
    expect(aktiv()).toBe(0)
  })

  it('Segment waehlt den Claim und startet den Takt neu', () => {
    const { segmente, aktiv, wechsel } = bau()
    vi.advanceTimersByTime(1500)
    segmente()[4].click()
    expect(aktiv()).toBe(4)
    expect(wechsel.at(-1).detail).toEqual({ index: 4, previousIndex: 0 })
    vi.advanceTimersByTime(1999)
    expect(aktiv()).toBe(4)
    vi.advanceTimersByTime(1)
    expect(aktiv()).toBe(5)
  })

  it('Klick auf das aktive Segment startet Takt und Fortschritt neu (Widersacher Phase 2)', () => {
    const { segmente, aktiv, wechsel } = bau()
    vi.advanceTimersByTime(1500)
    const vorher = segmente()[0].querySelector('i')
    segmente()[0].click()
    expect(aktiv()).toBe(0)
    expect(wechsel).toHaveLength(0)
    // neues <i>: die Fortschritts-Animation laeuft von vorn
    expect(segmente()[0].querySelector('i')).not.toBe(vorher)
    expect(segmente()[0].getAttribute('aria-current')).toBe('true')
    vi.advanceTimersByTime(1999)
    expect(aktiv()).toBe(0)
    vi.advanceTimersByTime(1)
    expect(aktiv()).toBe(1)
  })

  it('Pause haelt an (Restzeit), Knopf wechselt Symbol und Namen, Fortsetzen laeuft weiter', () => {
    const { wurzel, knopf, aktiv, takt } = bau()
    expect(knopf.getAttribute('aria-label')).toBe('Wechsel anhalten')
    vi.advanceTimersByTime(1500)
    knopf.click()
    expect(wurzel.classList.contains('is-paused')).toBe(true)
    expect(knopf.getAttribute('aria-label')).toBe('Wechsel fortsetzen')
    expect(knopf.querySelector('svg')?.dataset.symbol).toBe('play')
    expect(takt.at(-1).detail).toEqual({ playing: false, reason: 'knopf' })
    passtZumRecipe('hero', takt.at(-1))
    vi.advanceTimersByTime(10000)
    expect(aktiv()).toBe(0)
    knopf.click()
    expect(wurzel.classList.contains('is-paused')).toBe(false)
    expect(knopf.getAttribute('aria-label')).toBe('Wechsel anhalten')
    expect(knopf.querySelector('svg')?.dataset.symbol).toBe('pause')
    expect(takt.at(-1).detail).toEqual({ playing: true, reason: 'knopf' })
    vi.advanceTimersByTime(499)
    expect(aktiv()).toBe(0)
    vi.advanceTimersByTime(1)
    expect(aktiv()).toBe(1)
  })

  it('englisch nach lang', () => {
    const { knopf } = bau({ html: `<div lang="en">${BEISPIEL}</div>` })
    expect(knopf.getAttribute('aria-label')).toBe('Pause word change')
  })

  it('reduzierte Bewegung: kein Takt, Knopf heisst „Naechster Claim“ und schaltet weiter', () => {
    reduziert = true
    const { knopf, aktiv, wechsel, takt } = bau()
    expect(knopf.getAttribute('aria-label')).toBe('Nächster Claim')
    expect(knopf.querySelector('svg')?.dataset.symbol).toBe('next')
    vi.advanceTimersByTime(60000)
    expect(aktiv()).toBe(0)
    knopf.click()
    expect(aktiv()).toBe(1)
    expect(wechsel.at(-1).detail).toEqual({ index: 1, previousIndex: 0 })
    expect(takt).toHaveLength(0)
  })

  it('Abbinden stellt das Markup von vorher her und loest Takt und Lauscher', () => {
    const b = buehne(BEISPIEL)
    const vorher = b.innerHTML
    anbinden(b, ['hero-wortwechsel'])
    vi.advanceTimersByTime(4000)
    abbinden(b, ['hero-wortwechsel'])
    expect(b.innerHTML).toBe(vorher)
    vi.advanceTimersByTime(10000)
    expect(b.innerHTML).toBe(vorher)
    b.querySelector('.nc-hero__ww-pause').click()
    expect(b.innerHTML).toBe(vorher)
  })
})

describe('hero-wortwechsel: Layout (nebeneinander ab 960 px)', () => {
  /** Masse fuer Text, Buehne, Hero und Kopfzeile stellen */
  function masse ({ text, buehne: s, hero, heroOben = 1, kopf = 65, fenster }) {
    const kopfEl = document.createElement('header')
    kopfEl.className = 'site-header'
    document.body.prepend(kopfEl)
    kopfEl.getBoundingClientRect = () => /** @type {any} */ ({ top: 0, bottom: kopf, height: kopf })
    Object.defineProperty(window, 'innerHeight', { configurable: true, value: fenster })
    const proto = HTMLElement.prototype.getBoundingClientRect
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function () {
      if (this.classList.contains('nc-hero__content')) return /** @type {any} */ ({ top: 0, height: text })
      if (this.classList.contains('nc-hero__ww-stage')) return /** @type {any} */ ({ top: 0, height: s })
      if (this.classList.contains('nc-hero--wortwechsel')) return /** @type {any} */ ({ top: heroOben, height: hero, bottom: heroOben + hero })
      return proto.call(this)
    })
  }
  const wert = (w, n) => w.style.getPropertyValue(n)

  it('Rahmen-Ausgleich: Text hoeher als die Buehne → halbe Differenz', () => {
    masse({ text: 430, buehne: 400, hero: 900, fenster: 768 })
    const { wurzel } = bau()
    expect(wert(wurzel, '--_ww-ausgleich')).toBe('15px')
  })

  it('kein Ausgleich, wenn die Buehne hoeher ist', () => {
    masse({ text: 300, buehne: 400, hero: 900, fenster: 768 })
    const { wurzel } = bau()
    expect(wert(wurzel, '--_ww-ausgleich')).toBe('0px')
  })

  it('Fuellen: Rest unter 100 px → halber Rest oben und unten, sonst nicht', () => {
    // sichtbar 780 − 64 = 716, Fenster unter der Kopfzeile 800 − 65 = 735 → 19 px Rest
    masse({ text: 300, buehne: 400, hero: 780, fenster: 800 })
    const { wurzel } = bau()
    expect(wert(wurzel, '--_ww-fuell')).toBe('9.5px')
  })

  it('Fuellen nicht bei viel Rest (Hero nach Inhalt)', () => {
    masse({ text: 300, buehne: 400, hero: 780, fenster: 1000 })
    const { wurzel } = bau()
    expect(wert(wurzel, '--_ww-fuell')).toBe('0px')
  })

  it('unter 960 px: keine Werte, Groessenaenderung misst neu', () => {
    breit = false
    masse({ text: 430, buehne: 400, hero: 780, fenster: 800 })
    const { wurzel } = bau()
    expect(wert(wurzel, '--_ww-ausgleich')).toBe('')
    expect(wert(wurzel, '--_ww-fuell')).toBe('')
    breit = true
    window.dispatchEvent(new Event('resize'))
    vi.runOnlyPendingTimers()
    expect(wert(wurzel, '--_ww-ausgleich')).toBe('15px')
  })
})
