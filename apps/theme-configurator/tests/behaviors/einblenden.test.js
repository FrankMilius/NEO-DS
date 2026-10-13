/**
 * Einblenden (Plan v4, Phase 6b, 12.10.2026): Hilfs-Behavior einblenden aus
 * neo-behaviors fuer card-grid (reverse-domino), bento-grid (reveal) und
 * logo-wall (fadein) — vorher dreimal derselbe IntersectionObserver in
 * neo_fe/js/neo-theme.js (NeoCardGrid.render, NeoBento.maybeReveal — seit Phase 7 Twig,
 * neoLogoWall). Markup wie das Twig der Website plus der Aufbau aus JSON.
 * Tasten und Ereignisse stehen in den Recipes der Traeger.
 */
import { describe, it, expect, afterEach, beforeEach, vi } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { anbinden, abbinden, BEHAVIORS, NUR_AUSDRUECKLICH, EINBLENDEN_RECIPES } from 'neo-behaviors'
import { WURZEL } from '../arena/_recipes.js'
import { buehne, taste, deckeTastenAb, sammle, passtZumRecipe } from './_helfer.js'

beforeEach(() => {
  // happy-dom bringt einen Beobachter mit, der nie meldet: Tests mit Sicht
  // stubben ihn selbst, sonst gilt „kein Beobachter"
  vi.stubGlobal('IntersectionObserver', undefined)
})
afterEach(() => {
  abbinden(document.body, ['einblenden'])
  document.body.innerHTML = ''
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
  delete window.matchMedia
})

const reduziert = () => { window.matchMedia = vi.fn((q) => ({ matches: q === '(prefers-reduced-motion: reduce)' })) }

/** Beobachter, dessen Rueckruf der Test ausloest */
function beobachter () {
  const b = { rueckruf: null, beobachtet: [], getrennt: 0, opt: null, anzahl: 0 }
  vi.stubGlobal('IntersectionObserver', class {
    constructor (cb, opt) { b.rueckruf = cb; b.opt = opt; b.anzahl++ }
    observe (el) { b.beobachtet.push(el) }
    disconnect () { b.getrennt++ }
  })
  return b
}

const karte = (n) => `<article class="nc-card"><div class="nc-card__content"><h3 class="nc-card__title">Karte ${n}</h3></div></article>`
const kachel = (n) => `<a class="nc-bento-grid__cell" href="/k${n}"><h3 class="nc-bento-grid__title">Kachel ${n}</h3></a>`
const pille = (n) => `<a class="nc-logo-pill" href="https://example.org/${n}" target="_blank" rel="noopener noreferrer"><img class="nc-logo-pill__img" src="l.svg" alt="Firma ${n}"></a>`
const MARKUP = {
  'card-grid': (n = 4) => `<div class="nc-card-grid nc-card-grid--cols-3" data-pattern="standard" data-animation="reverse-domino">${Array.from({ length: n }, (_, i) => karte(i)).join('')}</div>`,
  'bento-grid': (n = 3) => `<div class="nc-bento-grid" data-animation="reveal">${Array.from({ length: n }, (_, i) => kachel(i)).join('')}</div>`,
  'logo-wall': (n = 5) => `<div class="nc-logo-wall nc-logo-wall--fadein" data-layout="grid">${Array.from({ length: n }, (_, i) => pille(i)).join('')}</div>`
}

function bau (id, n) {
  const b = buehne(MARKUP[id](n))
  const wurzel = /** @type {HTMLElement} */ (b.firstElementChild)
  const ereignisse = sammle(wurzel, 'einblenden')
  anbinden(b, ['einblenden'])
  return { b, wurzel, ereignisse }
}

describe('einblenden: Hilfs-Behavior der Website', () => {
  it('nurAusdruecklich, in NUR_AUSDRUECKLICH; Soll in den Recipes der Traeger', () => {
    expect(BEHAVIORS.einblenden.nurAusdruecklich).toBe(true)
    expect(NUR_AUSDRUECKLICH).toContain('einblenden')
    expect(EINBLENDEN_RECIPES).toEqual(['card-grid', 'bento-grid', 'logo-wall'])
  })

  it('bindet an reverse-domino, reveal und fadein — nicht ohne Animation und nicht am Laufband', () => {
    const b = buehne(`${MARKUP['card-grid']()}${MARKUP['bento-grid']()}${MARKUP['logo-wall']()}
<div class="nc-card-grid" data-pattern="standard">${karte(9)}</div>
<div class="nc-logo-wall nc-logo-wall--marquee nc-logo-wall--fadein" data-layout="marquee"><div class="nc-logo-wall__track">${pille(1)}</div></div>`)
    anbinden(b, ['einblenden'])
    expect([...b.querySelectorAll('[data-neo-behavior~="einblenden"]')].map((e) => e.className.split(' ')[0] + (e.classList.contains('nc-logo-wall--marquee') ? '--marquee' : '')))
      .toEqual(['nc-card-grid', 'nc-bento-grid', 'nc-logo-wall'])
  })

  it('SCSS: versteckt nur unter gebundenem einblenden (ohne Skript nichts versteckt), reduzierte Bewegung sofort sichtbar', () => {
    const lies = (f) => readFileSync(resolve(WURZEL, 'scss/scss', f), 'utf8')
    const karten = lies('06-molecules/_card.scss')
    expect(karten).toMatch(/&\[data-animation="reverse-domino"\]\[data-neo-behavior~='einblenden'\] > \.nc-card \{\s*opacity: 0;/)
    expect(karten).not.toMatch(/&\[data-animation="reverse-domino"\] > \.nc-card \{\s*opacity: 0;/)
    const bento = lies('07-organisms/_bento-grid.scss')
    expect(bento).toMatch(/\.nc-bento-grid\[data-animation="reveal"\]\[data-neo-behavior~='einblenden'\] \.nc-bento-grid__cell \{\s*opacity: 0;/)
    expect(bento).not.toMatch(/\.nc-bento-grid\[data-animation="reveal"\] \.nc-bento-grid__cell \{\s*opacity: 0;/)
    const logos = lies('06-molecules/_logo-wall.scss')
    expect(logos).toMatch(/&\[data-neo-behavior~='einblenden'\] \.nc-logo-pill \{\s*opacity: 0;/)
    expect(logos).toMatch(/@media \(prefers-reduced-motion: reduce\) \{\s*&\[data-neo-behavior~='einblenden'\] \.nc-logo-pill \{\s*opacity: 1;/)
  })

  for (const id of EINBLENDEN_RECIPES) {
    describe(id, () => {
      it('reduzierte Bewegung: sofort eingeblendet, ohne Staffelung, Ereignis reason reduzierte-bewegung', () => {
        reduziert()
        const b = beobachter()
        const { wurzel, ereignisse } = bau(id)
        expect(wurzel.classList.contains('is-revealed')).toBe(true)
        expect(b.anzahl).toBe(0)
        expect(wurzel.querySelector('[style]')).toBeNull()
        expect(ereignisse.map((e) => e.detail)).toEqual([{ reason: 'reduzierte-bewegung' }])
        passtZumRecipe(id, ereignisse[0])
      })

      it('ohne IntersectionObserver: sofort eingeblendet (reason ohne-beobachter)', () => {
        const { wurzel, ereignisse } = bau(id)
        expect(wurzel.classList.contains('is-revealed')).toBe(true)
        expect(ereignisse[0].detail).toEqual({ reason: 'ohne-beobachter' })
      })

      it('mit Beobachter: wartet (threshold 0.15), blendet beim Sichtbarwerden einmal ein, trennt; Ereignis reason sicht', () => {
        const b = beobachter()
        const { wurzel, ereignisse } = bau(id)
        expect(b.beobachtet).toEqual([wurzel])
        expect(b.opt).toEqual({ threshold: 0.15 })
        expect(wurzel.classList.contains('is-revealed')).toBe(false)
        b.rueckruf([{ target: wurzel, isIntersecting: false }])
        expect(wurzel.classList.contains('is-revealed')).toBe(false)
        b.rueckruf([{ target: wurzel, isIntersecting: true }])
        expect(wurzel.classList.contains('is-revealed')).toBe(true)
        expect(b.getrennt).toBe(1)
        expect(ereignisse.map((e) => e.detail)).toEqual([{ reason: 'sicht' }])
        passtZumRecipe(id, ereignisse[0])
      })

      it('Tasten aus dem Recipe: Tab — keine eigene Bedienung', () => {
        const pruefungen = {
          Tab: () => {
            beobachter()
            const { wurzel } = bau(id)
            const link = wurzel.querySelector('a') || document.body
            expect(taste(link, 'Tab').defaultPrevented).toBe(false)
          }
        }
        deckeTastenAb(id, pruefungen)
        for (const p of Object.values(pruefungen)) { p(); abbinden(document.body, ['einblenden']); document.body.innerHTML = '' }
      })
    })
  }

  it('card-grid: Staffelung --card-delay = i × 0,1 s (wie NeoCardGrid.render)', () => {
    const b = beobachter()
    const { wurzel } = bau('card-grid', 4)
    b.rueckruf([{ target: wurzel, isIntersecting: true }])
    expect([...wurzel.children].map((k) => k.style.getPropertyValue('--card-delay'))).toEqual(['0s', '0.1s', '0.2s', '0.3s'])
  })

  it('logo-wall: is-visible je Pille, transition-delay = i × --nc-logo-wall-fadein-delay-step (Vorgabe 0,08 s; ms verstanden)', () => {
    const b = beobachter()
    const { wurzel } = bau('logo-wall', 4)
    b.rueckruf([{ target: wurzel, isIntersecting: true }])
    const pillen = [...wurzel.querySelectorAll('.nc-logo-pill')]
    expect(pillen.every((p) => p.classList.contains('is-visible'))).toBe(true)
    expect(pillen.map((p) => p.style.transitionDelay)).toEqual(['0s', '0.08s', '0.16s', '0.24s'])
    abbinden(document.body, ['einblenden'])
    document.body.innerHTML = ''
    const b2 = beobachter()
    const zwei = buehne(MARKUP['logo-wall'](3))
    zwei.firstElementChild.style.setProperty('--nc-logo-wall-fadein-delay-step', '120ms')
    anbinden(zwei, ['einblenden'])
    b2.rueckruf([{ target: zwei.firstElementChild, isIntersecting: true }])
    expect([...zwei.querySelectorAll('.nc-logo-pill')].map((p) => p.style.transitionDelay)).toEqual(['0s', '0.12s', '0.24s'])
  })

  it('bento-grid: ohne Staffelung (wie vorher NeoBento.maybeReveal)', () => {
    const b = beobachter()
    const { wurzel } = bau('bento-grid')
    b.rueckruf([{ target: wurzel, isIntersecting: true }])
    expect(wurzel.querySelector('[style]')).toBeNull()
  })

  it('leere Wurzel (Aufbau aus JSON danach): wartet auf die ersten Glieder, dann beobachtet', async () => {
    const b = beobachter()
    const buehne1 = buehne('<div class="nc-logo-wall nc-logo-wall--fadein" data-layout="grid"></div>')
    const wand = buehne1.firstElementChild
    anbinden(buehne1, ['einblenden'])
    expect(b.anzahl).toBe(0)
    wand.insertAdjacentHTML('beforeend', pille(1) + pille(2))
    await new Promise((r) => setTimeout(r, 0))
    expect(b.beobachtet).toEqual([wand])
    b.rueckruf([{ target: wand, isIntersecting: true }])
    expect([...wand.children].every((p) => p.classList.contains('is-visible'))).toBe(true)
  })

  it('erneutes Binden nach dem Aufbau (Theme: abbinden + anbinden): schon eingeblendet → neue Glieder sofort sichtbar, kein Ereignis', () => {
    const b = beobachter()
    const { b: buehne1, wurzel, ereignisse } = bau('logo-wall', 2)
    b.rueckruf([{ target: wurzel, isIntersecting: true }])
    wurzel.insertAdjacentHTML('beforeend', pille(7))
    abbinden(buehne1, ['einblenden'])
    expect(wurzel.hasAttribute('data-neo-behavior')).toBe(false)
    anbinden(buehne1, ['einblenden'])
    expect(wurzel.lastElementChild.classList.contains('is-visible')).toBe(true)
    expect(ereignisse).toHaveLength(1)
  })

  it('Abbinden vor dem Sichtbarwerden: Beobachter getrennt, nichts versteckt (data-neo-behavior weg)', () => {
    const b = beobachter()
    const { b: buehne1, wurzel } = bau('card-grid')
    abbinden(buehne1, ['einblenden'])
    expect(b.getrennt).toBe(1)
    expect(wurzel.hasAttribute('data-neo-behavior')).toBe(false)
    expect(wurzel.classList.contains('is-revealed')).toBe(false)
  })
})
