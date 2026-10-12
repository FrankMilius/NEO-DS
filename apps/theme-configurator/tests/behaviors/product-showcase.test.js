/**
 * Product-Showcase (Plan v4, Phase 6a, 12.10.2026, Entscheidung E8 = a):
 * ein Behavior product-showcase mit zwei Modi — Tabs (Website-Block
 * neo_product_showcase; vorher Auswahl und Tastatur in
 * Drupal.behaviors.neoProductShowcase) und Stationen (Geraete-Strecke
 * neo_device_scroll; vorher js/neo-device-scroll.js). Gebunden wird an Markup
 * wie aus neo_fe (Tabs: so, wie neoProductShowcase die Optionen aus JSON
 * baut; Stationen: das Twig) und an das Markup der Arena. Jede Taste aus
 * `keyboard` und jedes Ereignis aus `events` wird geprueft.
 */
import { describe, it, expect, afterEach, vi } from 'vitest'
import { anbinden, abbinden, BEHAVIORS, NUR_AUSDRUECKLICH } from 'neo-behaviors'
import { buehne, zelleMit, taste, deckeTastenAb, sammle, passtZumRecipe } from './_helfer.js'

afterEach(() => {
  document.body.innerHTML = ''
  vi.unstubAllGlobals()
  delete window.matchMedia
})

const klick = (el) => el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))

describe('product-showcase: Website-Bauteil', () => {
  it('nurAusdruecklich und in NUR_AUSDRUECKLICH (Drupal bindet nur per nur)', () => {
    expect(BEHAVIORS['product-showcase'].nurAusdruecklich).toBe(true)
    expect(NUR_AUSDRUECKLICH).toContain('product-showcase')
  })
})

// ---------------------------------------------------------------------------
// Modus Tabs
// ---------------------------------------------------------------------------

/** Markup wie neo_fe nach neoProductShowcase (Optionen aus JSON gebaut) */
function tabsMarkup ({ ohneBild = -1, ohneText = -1 } = {}) {
  const n = [0, 1, 2]
  return `<div class="nc-product-showcase" id="nc-ps-21" data-product-showcase>
<div class="nc-product-showcase__options" role="tablist" aria-label="Optionen">
<span class="nc-product-showcase__label">Wählen</span>
${n.map((i) => `<div class="nc-product-showcase__option-group"><button class="nc-product-showcase__option" aria-selected="${i === 0}" data-station="${i}"><span class="nc-product-showcase__option-indicator" style="background-color: red;"></span><span class="nc-product-showcase__option-text">Option ${i + 1}</span></button>
<div class="nc-product-showcase__description${i === 0 ? ' is-open' : ''}">${i === ohneText ? '' : `<p class="nc-product-showcase__description-text">Text ${i + 1}</p>`}</div></div>`).join('\n')}
</div>
<div class="nc-product-showcase__media-panel" role="tabpanel">
${n.filter((i) => i !== ohneBild).map((i) => `<img class="nc-product-showcase__media-item${i === 0 ? ' is-active' : ''}" data-station="${i}" src="b${i}.png" alt="Option ${i + 1}">`).join('\n')}
</div>
</div>`
}

function bauTabs (html = tabsMarkup()) {
  const b = buehne(html)
  anbinden(b, ['product-showcase'])
  const wurzel = /** @type {HTMLElement} */ (b.querySelector('.nc-product-showcase'))
  return {
    b,
    wurzel,
    liste: /** @type {HTMLElement} */ (wurzel.querySelector('.nc-product-showcase__options')),
    optionen: /** @type {HTMLElement[]} */ ([...wurzel.querySelectorAll('.nc-product-showcase__option')]),
    panele: /** @type {HTMLElement[]} */ ([...wurzel.querySelectorAll('.nc-product-showcase__description')]),
    medien: /** @type {HTMLElement[]} */ ([...wurzel.querySelectorAll('.nc-product-showcase__media-item')])
  }
}
const gewaehlt = (optionen) => optionen.findIndex((o) => o.getAttribute('aria-selected') === 'true')
const aktivesMedium = (medien) => medien.findIndex((m) => m.classList.contains('is-active'))

describe('product-showcase, Modus Tabs', () => {
  it('Tabs-Muster: role=tab, aria-controls auf das Medien-Panel (tabpanel), wandernder tabindex', () => {
    const { wurzel, liste, optionen, panele } = bauTabs()
    const medienPanel = /** @type {HTMLElement} */ (wurzel.querySelector('.nc-product-showcase__media-panel'))
    expect(wurzel.getAttribute('data-neo-behavior')).toBe('product-showcase')
    expect(liste.getAttribute('role')).toBe('tablist')
    expect(medienPanel.id).toBe('nc-ps-21-medien')
    expect(medienPanel.getAttribute('role')).toBe('tabpanel')
    expect(medienPanel.getAttribute('aria-labelledby')).toBe(optionen[0].id)
    optionen.forEach((o, i) => {
      expect(o.getAttribute('role')).toBe('tab')
      expect(o.id).toBe(`nc-ps-21-tab-${i}`)
      expect(o.getAttribute('aria-controls')).toBe(medienPanel.id)
      expect(document.getElementById(o.getAttribute('aria-describedby'))).toBe(panele[i])
    })
    expect(optionen.map((o) => o.tabIndex)).toEqual([0, -1, -1])
    expect(panele.map((p) => p.hidden)).toEqual([false, true, true])
  })

  it('Beschreibung in der Tableiste: ohne Rolle (kein region/tabpanel als Kind der tablist), ohne aria-hidden', () => {
    const html = tabsMarkup().replaceAll('class="nc-product-showcase__description', 'role="region" aria-hidden="true" class="nc-product-showcase__description')
    const { panele, optionen, wurzel } = bauTabs(html)
    expect(panele.every((p) => !p.hasAttribute('role') && !p.hasAttribute('aria-hidden'))).toBe(true)
    klick(optionen[2])
    expect(wurzel.querySelector('.nc-product-showcase__media-panel').getAttribute('aria-labelledby')).toBe(optionen[2].id)
  })

  it('Option ohne Text: kein aria-describedby', () => {
    const { optionen } = bauTabs(tabsMarkup({ ohneText: 1 }))
    expect(optionen.map((o) => o.hasAttribute('aria-describedby'))).toEqual([true, false, true])
  })

  it('Klick waehlt: Beschreibung offen, Medium nach data-station, Text neu eingesetzt (Animation)', () => {
    const { optionen, panele, medien } = bauTabs()
    const textVorher = panele[1].querySelector('p')
    klick(optionen[1])
    expect(gewaehlt(optionen)).toBe(1)
    expect(optionen.map((o) => o.tabIndex)).toEqual([-1, 0, -1])
    expect(panele.map((p) => p.classList.contains('is-open'))).toEqual([false, true, false])
    expect(panele.map((p) => p.hidden)).toEqual([true, false, true])
    expect(aktivesMedium(medien)).toBe(1)
    expect(panele[1].querySelector('p')).not.toBe(textVorher)
    expect(panele[1].querySelector('p')?.textContent).toBe('Text 2')
  })

  it('Option ohne Bild: die Medien der anderen bleiben richtig zugeordnet (data-station)', () => {
    const { optionen, medien } = bauTabs(tabsMarkup({ ohneBild: 1 }))
    klick(optionen[2])
    expect(medien.map((m) => m.dataset.station)).toEqual(['0', '2'])
    expect(aktivesMedium(medien)).toBe(1)
    klick(optionen[1])
    expect(aktivesMedium(medien)).toBe(-1)
  })

  it('jede Taste aus keyboard', () => {
    deckeTastenAb('product-showcase', {
      Tab: () => {
        const { wurzel, optionen } = bauTabs()
        const folge = [...wurzel.querySelectorAll('button')].filter((e) => e.tabIndex >= 0)
        expect(folge).toEqual([optionen[0]])
      },
      ArrowDown: () => {
        const { optionen } = bauTabs()
        taste(optionen[0], 'ArrowDown')
        expect(gewaehlt(optionen)).toBe(1); expect(document.activeElement).toBe(optionen[1])
        taste(optionen[1], 'ArrowDown'); taste(optionen[2], 'ArrowDown')
        expect(gewaehlt(optionen)).toBe(0) // rundum
      },
      ArrowRight: () => {
        const { optionen } = bauTabs()
        const e = taste(optionen[0], 'ArrowRight')
        expect(e.defaultPrevented).toBe(true)
        expect(gewaehlt(optionen)).toBe(1)
      },
      ArrowUp: () => {
        const { optionen } = bauTabs()
        taste(optionen[0], 'ArrowUp')
        expect(gewaehlt(optionen)).toBe(2); expect(document.activeElement).toBe(optionen[2])
      },
      ArrowLeft: () => {
        const { optionen } = bauTabs()
        taste(optionen[0], 'ArrowLeft')
        expect(gewaehlt(optionen)).toBe(2)
      },
      Home: () => {
        const { optionen } = bauTabs()
        klick(optionen[2]); taste(optionen[2], 'Home')
        expect(gewaehlt(optionen)).toBe(0); expect(document.activeElement).toBe(optionen[0])
      },
      End: () => {
        const { optionen } = bauTabs()
        taste(optionen[0], 'End')
        expect(gewaehlt(optionen)).toBe(2); expect(document.activeElement).toBe(optionen[2])
      },
      Enter: () => {
        const { optionen } = bauTabs()
        taste(optionen[1], 'Enter')
        expect(gewaehlt(optionen)).toBe(1)
      },
      Space: () => {
        const { optionen } = bauTabs()
        taste(optionen[2], 'Space')
        expect(gewaehlt(optionen)).toBe(2)
      }
    })
  })

  it('Ereignis product-showcase-change wie im Recipe, genau einmal je Wechsel', () => {
    const { wurzel, optionen } = bauTabs()
    const liste = sammle(wurzel, 'product-showcase-change')
    klick(optionen[0])
    klick(optionen[2]); taste(optionen[2], 'Home')
    expect(liste.map((e) => [e.detail.index, e.detail.previousIndex])).toEqual([[2, 0], [0, 2]])
    for (const e of liste) passtZumRecipe('product-showcase', e)
  })

  it('ohne Optionen bindet es nichts (das Theme baut sie erst aus JSON und bindet danach neu)', () => {
    const b = buehne('<div class="nc-product-showcase"><div class="nc-product-showcase__options" role="tablist"></div><div class="nc-product-showcase__media-panel" role="tabpanel"></div></div>')
    anbinden(b, ['product-showcase'])
    const liste = /** @type {HTMLElement} */ (b.querySelector('.nc-product-showcase__options'))
    liste.innerHTML = '<div class="nc-product-showcase__option-group"><button class="nc-product-showcase__option" aria-selected="true">A</button><div class="nc-product-showcase__description is-open"></div></div><div class="nc-product-showcase__option-group"><button class="nc-product-showcase__option" aria-selected="false">B</button><div class="nc-product-showcase__description"></div></div>'
    abbinden(b, ['product-showcase']); anbinden(b, ['product-showcase'])
    const o = [...liste.querySelectorAll('button')]
    klick(o[1])
    expect(o[1].getAttribute('aria-selected')).toBe('true')
    expect(o[1].getAttribute('role')).toBe('tab')
  })

  it('abbinden stellt die Attribute her (role, aria-controls, aria-describedby, hidden) und loest die Ereignisse', () => {
    const { b, optionen, panele } = bauTabs()
    abbinden(b, ['product-showcase'])
    expect(optionen[0].hasAttribute('role')).toBe(false)
    expect(optionen[0].hasAttribute('aria-controls')).toBe(false)
    expect(optionen[0].hasAttribute('aria-describedby')).toBe(false)
    expect(panele.map((p) => p.hidden)).toEqual([false, false, false])
    klick(optionen[1])
    expect(gewaehlt(optionen)).toBe(0)
  })

  it('Arena (Ausprobieren, Optionsgruppen): aria-pressed weicht aria-selected', () => {
    const b = buehne(zelleMit('product-showcase', 'horizontal-slide', (h) => h.includes('nc-product-showcase__option-group')))
    anbinden(b, ['product-showcase'])
    const optionen = [...b.querySelectorAll('.nc-product-showcase__option')]
    expect(optionen.every((o) => !o.hasAttribute('aria-pressed') && o.getAttribute('role') === 'tab')).toBe(true)
    klick(optionen[1])
    expect(optionen.map((o) => o.classList.contains('is-active'))).toEqual([false, true, false])
  })
})

// ---------------------------------------------------------------------------
// Modus Stationen (Geraete-Strecke)
// ---------------------------------------------------------------------------

/** Markup wie block--block-content--neo-device-scroll.html.twig */
function stationenMarkup () {
  const b = 'ds-9'
  const n = [0, 1, 2]
  return `<div class="nc-product-showcase nc-product-showcase--accordion nc-product-showcase--device nc-product-showcase--sticky" data-neo-device-accordion>
<div class="nc-product-showcase__media-panel"><div class="nc-device"><div class="nc-device__screen">
${n.map((i) => `<img class="nc-product-showcase__media-item${i === 0 ? ' is-active' : ''}" data-station="${i}" src="s${i}.png" alt="Station ${i + 1}">`).join('\n')}
</div></div></div>
<div class="nc-product-showcase__options">
${n.map((i) => `<div class="nc-product-showcase__option${i === 0 ? ' is-active' : ''}" data-station="${i}">
<button type="button" class="nc-product-showcase__trigger" id="${b}-t${i}" aria-expanded="${i === 0}" aria-controls="${b}-p${i}"><span class="nc-product-showcase__label">L${i}</span><span class="nc-product-showcase__title">Titel ${i + 1}</span></button>
<div class="nc-product-showcase__panel" id="${b}-p${i}" role="region" aria-labelledby="${b}-t${i}"><div><p class="nc-product-showcase__description-text">Text ${i + 1}</p></div></div>
<div class="nc-product-showcase__option-device"><div class="nc-device nc-device--sm"><div class="nc-device__screen"><img src="s${i}.png" alt=""></div></div></div>
</div>`).join('\n')}
</div>
</div>`
}

/** IntersectionObserver-Attrappe: Callback abrufbar */
let beobachtet = null
class Sicht {
  constructor (cb, opt) { this.cb = cb; this.opt = opt; beobachtet = this; this.ziele = [] }
  observe (el) { this.ziele.push(el) }
  disconnect () { this.ziele = [] }
}

function bauStationen ({ quer = false } = {}) {
  vi.stubGlobal('IntersectionObserver', Sicht)
  const b = buehne(stationenMarkup())
  const wurzel = /** @type {HTMLElement} */ (b.querySelector('.nc-product-showcase'))
  const streifen = /** @type {HTMLElement} */ (wurzel.querySelector('.nc-product-showcase__options'))
  streifen.style.display = 'flex'
  streifen.style.flexDirection = quer ? 'row' : 'column'
  const aufrufe = []
  streifen.scrollTo = (o) => { aufrufe.push(o) }
  anbinden(b, ['product-showcase'])
  return {
    b,
    wurzel,
    streifen,
    aufrufe,
    stationen: /** @type {HTMLElement[]} */ ([...wurzel.querySelectorAll('.nc-product-showcase__option')]),
    knoepfe: /** @type {HTMLElement[]} */ ([...wurzel.querySelectorAll('.nc-product-showcase__trigger')]),
    screens: /** @type {HTMLElement[]} */ ([...wurzel.querySelectorAll('.nc-product-showcase__media-panel .nc-product-showcase__media-item')])
  }
}
const offen = (stationen) => stationen.findIndex((s) => s.classList.contains('is-active'))

describe('product-showcase, Modus Stationen (Geraete-Strecke)', () => {
  it('uebernimmt: data-neo-device-accordion=aktiv, genau eine Station offen, laengs aria-expanded', () => {
    const { wurzel, knoepfe, screens } = bauStationen()
    expect(wurzel.getAttribute('data-neo-device-accordion')).toBe('aktiv')
    expect(knoepfe.map((k) => k.getAttribute('aria-expanded'))).toEqual(['true', 'false', 'false'])
    expect(knoepfe.some((k) => k.hasAttribute('aria-current'))).toBe(false)
    expect(aktivesMedium(screens)).toBe(0)
  })

  it('Klick oeffnet und wechselt den Screen; ein Klick auf die offene schliesst sie nicht', () => {
    const { stationen, knoepfe, screens } = bauStationen()
    klick(knoepfe[2])
    expect(offen(stationen)).toBe(2)
    expect(aktivesMedium(screens)).toBe(2)
    expect(knoepfe.map((k) => k.getAttribute('aria-expanded'))).toEqual(['false', 'false', 'true'])
    klick(knoepfe[2])
    expect(offen(stationen)).toBe(2)
  })

  it('quer: aria-current statt aria-expanded; Klick zieht die Karte heran (weich nach CSS, reduziert sofort)', () => {
    const { knoepfe, aufrufe } = bauStationen({ quer: true })
    expect(knoepfe.map((k) => k.getAttribute('aria-current'))).toEqual(['true', null, null])
    expect(knoepfe.some((k) => k.hasAttribute('aria-expanded'))).toBe(false)
    klick(knoepfe[1])
    expect(knoepfe.map((k) => k.getAttribute('aria-current'))).toEqual([null, 'true', null])
    expect(aufrufe.at(-1)?.behavior).toBe('auto')
    document.body.innerHTML = ''
    window.matchMedia = (q) => ({ matches: /reduce/.test(q), media: q, addEventListener () {}, removeEventListener () {} })
    const r = bauStationen({ quer: true })
    klick(r.knoepfe[2])
    expect(r.aufrufe.at(-1)?.behavior).toBe('instant')
  })

  it('quer gewischt = gewaehlt (Anteil > 60 % im Streifen), laengs nicht', () => {
    const q = bauStationen({ quer: true })
    expect(beobachtet.opt.root).toBe(q.streifen)
    const liste = sammle(q.wurzel, 'product-showcase-change')
    beobachtet.cb([{ target: q.stationen[1], isIntersecting: true, intersectionRatio: 0.5 }])
    expect(offen(q.stationen)).toBe(0)
    beobachtet.cb([{ target: q.stationen[0], isIntersecting: true, intersectionRatio: 0.3 }, { target: q.stationen[1], isIntersecting: true, intersectionRatio: 0.9 }])
    expect(offen(q.stationen)).toBe(1)
    expect(aktivesMedium(q.screens)).toBe(1)
    expect(liste.map((e) => [e.detail.index, e.detail.previousIndex])).toEqual([[1, 0]])
    document.body.innerHTML = ''
    const l = bauStationen()
    beobachtet.cb([{ target: l.stationen[2], isIntersecting: true, intersectionRatio: 1 }])
    expect(offen(l.stationen)).toBe(0)
  })

  it('jede Taste aus keyboard', () => {
    deckeTastenAb('product-showcase', {
      Tab: () => {
        const { wurzel, knoepfe } = bauStationen()
        expect([...wurzel.querySelectorAll('button')].filter((e) => e.tabIndex >= 0)).toEqual(knoepfe)
      },
      ArrowDown: () => {
        const { stationen, knoepfe } = bauStationen()
        taste(knoepfe[0], 'ArrowDown')
        expect(offen(stationen)).toBe(1); expect(document.activeElement).toBe(knoepfe[1])
        taste(knoepfe[1], 'ArrowDown'); taste(knoepfe[2], 'ArrowDown')
        expect(offen(stationen)).toBe(2) // ohne Umlauf
      },
      ArrowRight: () => {
        const { stationen, knoepfe } = bauStationen({ quer: true })
        taste(knoepfe[0], 'ArrowRight')
        expect(offen(stationen)).toBe(1)
      },
      ArrowUp: () => {
        const { stationen, knoepfe } = bauStationen()
        const e = taste(knoepfe[0], 'ArrowUp')
        expect(e.defaultPrevented).toBe(false) // am Anfang ohne Wirkung
        klick(knoepfe[2]); taste(knoepfe[2], 'ArrowUp')
        expect(offen(stationen)).toBe(1); expect(document.activeElement).toBe(knoepfe[1])
      },
      ArrowLeft: () => {
        const { stationen, knoepfe } = bauStationen({ quer: true })
        klick(knoepfe[1]); taste(knoepfe[1], 'ArrowLeft')
        expect(offen(stationen)).toBe(0)
      },
      Home: () => {
        const { stationen, knoepfe } = bauStationen()
        klick(knoepfe[2]); taste(knoepfe[2], 'Home')
        expect(offen(stationen)).toBe(0); expect(document.activeElement).toBe(knoepfe[0])
      },
      End: () => {
        const { stationen, knoepfe } = bauStationen()
        taste(knoepfe[0], 'End')
        expect(offen(stationen)).toBe(2); expect(document.activeElement).toBe(knoepfe[2])
      },
      Enter: () => {
        const { stationen, knoepfe } = bauStationen()
        taste(knoepfe[1], 'Enter')
        expect(offen(stationen)).toBe(1)
        taste(knoepfe[1], 'Enter')
        expect(offen(stationen)).toBe(1) // die offene bleibt offen
      },
      Space: () => {
        const { stationen, knoepfe } = bauStationen()
        taste(knoepfe[2], 'Space')
        expect(offen(stationen)).toBe(2)
      }
    })
  })

  it('Ereignis wie im Recipe; abbinden stellt den Zustand ohne Skript her (Attribut weg)', () => {
    const { b, wurzel, knoepfe } = bauStationen()
    const liste = sammle(wurzel, 'product-showcase-change')
    taste(knoepfe[0], 'End')
    expect(liste).toHaveLength(1)
    passtZumRecipe('product-showcase', liste[0])
    abbinden(b, ['product-showcase'])
    expect(wurzel.getAttribute('data-neo-device-accordion')).toBe('')
    klick(knoepfe[0])
    expect(liste).toHaveLength(1)
  })
})
