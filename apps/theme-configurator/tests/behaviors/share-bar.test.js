/**
 * Teilen-Leiste (I15 Phase 3, 22.11.2026): Behavior `share-bar`
 * (packages/neo-behaviors/teilen.js).
 *
 *   - Teilen-Knopf [data-teilen] ruft navigator.share({ title, url }); ohne
 *     Web Share ist er [hidden], LinkedIn und E-Mail bleiben (Links ohne JS).
 *     Abbrechen (AbortError) bleibt still.
 *   - Link kopieren [data-teilen-kopieren] schreibt die Adresse in die
 *     Zwischenablage und meldet es in der Statuszeile (_meldung.js).
 *   - Eine Auswahl von mindestens drei Woertern im Artikeltext
 *     [data-teilen-text] oeffnet nach kurzer Ruhe die Blase
 *     .nc-share-bar__popover mit „Zitat teilen“ und „Link kopieren“
 *     (Adresse mit Text-Fragment #:~:text=). Escape und Klick ausserhalb
 *     schliessen, Fokus zurueck; Tab fuehrt in die Blase.
 *
 * Markup wie die Arena es baut (_blog.js: artikel(), Teilen-Leiste im Kopf);
 * Tasten und Ereignisse aus data/share-bar-recipe.json.
 */
import { describe, it, expect, afterEach, beforeEach, vi } from 'vitest'
import { anbinden, abbinden, BEHAVIORS, NUR_AUSDRUECKLICH, MIT_VERHALTEN } from 'neo-behaviors'
import { artikel } from '../../src/arena-templates/_blog.js'
import { buehne, sammle, passtZumRecipe, taste, deckeTastenAb, lebendigesMarkup } from './_helfer.js'

const ID = 'share-bar'
/** @param {string} t */
const textFragment = (t) => BEHAVIORS[ID].textFragment(t)
const RUHE = 400 // groesser als die Ruhezeit des Behaviors
const URL_ARTIKEL = 'https://example.org/inside/blog/ki-assistenten-im-intranet'

const fertig = () => Promise.resolve().then(() => Promise.resolve())
const klick = (el) => el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, button: 0 }))
const zeiger = (el, typ) => {
  const e = new MouseEvent(typ, { bubbles: true, cancelable: true, button: 0 })
  el.dispatchEvent(e)
  return e
}

/** Web Share und Zwischenablage am navigator setzen (undefined = fehlt) */
function navigatorMit ({ share, writeText } = {}) {
  Object.defineProperty(navigator, 'share', { value: share, configurable: true, writable: true })
  Object.defineProperty(navigator, 'clipboard', { value: writeText ? { writeText } : undefined, configurable: true, writable: true })
}

function bau ({ attrs = ' data-teilen-url="' + URL_ARTIKEL + '" data-teilen-titel="Warum KI-Assistenten scheitern"' } = {}) {
  const b = buehne(artikel({ titelEbene: 2, mitPopover: false, mitBild: false }))
  const leiste = /** @type {HTMLElement} */ (b.querySelector('.nc-share-bar'))
  for (const m of attrs.matchAll(/([\w-]+)="([^"]*)"/g)) leiste.setAttribute(m[1], m[2])
  const ereignisse = {
    teilen: sammle(leiste, 'share-bar-share'),
    kopieren: sammle(leiste, 'share-bar-copy'),
    blase: sammle(leiste, 'share-bar-popover')
  }
  anbinden(b, [ID])
  const text = /** @type {HTMLElement} */ (b.querySelector('[data-teilen-text]'))
  return {
    b,
    leiste,
    text,
    ereignisse,
    teilenKnopf: /** @type {HTMLButtonElement} */ (leiste.querySelector('[data-teilen]')),
    kopierKnopf: /** @type {HTMLButtonElement} */ (leiste.querySelector('[data-teilen-kopieren]')),
    status: () => leiste.querySelector('[role="status"]')?.textContent?.trim(),
    blase: () => /** @type {HTMLElement|null} */ (b.ownerDocument.querySelector('.nc-share-bar__popover'))
  }
}

/** Markiert `stueck` im ersten Textknoten des Elements, der es enthaelt. */
function markiere (el, stueck) {
  const gang = document.createTreeWalker(el, NodeFilter.SHOW_TEXT)
  let knoten
  while ((knoten = gang.nextNode())) {
    const i = knoten.textContent.indexOf(stueck)
    if (i >= 0) {
      const r = document.createRange()
      r.setStart(knoten, i)
      r.setEnd(knoten, i + stueck.length)
      const sel = document.getSelection()
      sel.removeAllRanges()
      sel.addRange(r)
      document.dispatchEvent(new Event('selectionchange'))
      return r
    }
  }
  throw new Error(`nicht gefunden: ${stueck}`)
}

const offen = (blase) => !!blase && !blase.hidden

beforeEach(() => {
  document.body.innerHTML = ''
  vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] })
})
afterEach(() => {
  abbinden(document.body, [ID])
  document.getSelection()?.removeAllRanges()
  document.body.innerHTML = ''
  vi.useRealTimers()
  vi.restoreAllMocks()
  navigatorMit({})
})

describe('share-bar: Teilen-Leiste', () => {
  it('Website-Bauteil: nurAusdruecklich, in NUR_AUSDRUECKLICH und MIT_VERHALTEN', () => {
    expect(BEHAVIORS[ID].nurAusdruecklich).toBe(true)
    expect(NUR_AUSDRUECKLICH).toContain(ID)
    expect(MIT_VERHALTEN).toContain(ID)
  })

  it('Teilen mit Web Share: navigator.share({ title, url }) aus den Attributen der Leiste', async () => {
    const share = vi.fn(async () => {})
    navigatorMit({ share })
    const { teilenKnopf, ereignisse } = bau()
    expect(teilenKnopf.hidden).toBe(false)
    klick(teilenKnopf)
    await fertig()
    expect(share).toHaveBeenCalledWith({ title: 'Warum KI-Assistenten scheitern', url: URL_ARTIKEL })
    expect(ereignisse.teilen.map((e) => e.detail)).toEqual([{ quelle: 'leiste', ok: true }])
    passtZumRecipe(ID, ereignisse.teilen[0])
  })

  it('ohne Attribute: Titel aus document.title, Adresse aus location ohne #', async () => {
    const share = vi.fn(async () => {})
    navigatorMit({ share })
    document.title = 'Blog-Artikel'
    const { teilenKnopf } = bau({ attrs: '' })
    klick(teilenKnopf)
    await fertig()
    expect(share).toHaveBeenCalledWith({ title: 'Blog-Artikel', url: window.location.href.split('#')[0] })
  })

  it('ohne Web Share: Teilen-Knopf [hidden], LinkedIn, E-Mail und Link kopieren bleiben; Abbinden zeigt ihn wieder', () => {
    navigatorMit({})
    const { leiste, teilenKnopf, kopierKnopf, b } = bau()
    expect(teilenKnopf.hidden).toBe(true)
    expect(kopierKnopf.hidden).toBe(false)
    for (const a of leiste.querySelectorAll('a')) expect(a.hidden).toBe(false)
    abbinden(b, [ID])
    expect(teilenKnopf.hidden).toBe(false)
  })

  it('Abbrechen im Teilen-Dialog (AbortError) bleibt still: keine Meldung, ok = false', async () => {
    const share = vi.fn(async () => { throw new DOMException('abgebrochen', 'AbortError') })
    navigatorMit({ share })
    const { teilenKnopf, ereignisse, status } = bau()
    klick(teilenKnopf)
    await fertig()
    await fertig()
    expect(status() || '').toBe('')
    expect(ereignisse.teilen.map((e) => e.detail)).toEqual([{ quelle: 'leiste', ok: false }])
  })

  it('Link kopieren: schreibt die Adresse, meldet „Link kopiert“ (Statuszeile, Knopf-Name 2 s)', async () => {
    const writeText = vi.fn(async () => {})
    navigatorMit({ writeText })
    const { kopierKnopf, ereignisse, status } = bau()
    klick(kopierKnopf)
    await fertig()
    expect(writeText).toHaveBeenCalledWith(URL_ARTIKEL)
    expect(status()).toBe('Link kopiert')
    expect(kopierKnopf.getAttribute('aria-label')).toBe('Link kopiert')
    vi.advanceTimersByTime(2100)
    expect(kopierKnopf.getAttribute('aria-label')).toBe('Link kopieren')
    expect(ereignisse.kopieren.map((e) => e.detail)).toEqual([{ quelle: 'leiste', ok: true }])
    passtZumRecipe(ID, ereignisse.kopieren[0])
  })

  it('Link kopieren schlägt fehl (verweigert oder keine Zwischenablage): „Link konnte nicht kopiert werden. Bitte kopieren Sie die Adresse aus der Adresszeile.“', async () => {
    for (const writeText of [vi.fn(async () => { throw new Error('verweigert') }), undefined]) {
      document.body.innerHTML = ''
      navigatorMit({ writeText })
      const { kopierKnopf, ereignisse, status, b } = bau()
      klick(kopierKnopf)
      await fertig()
      expect(status()).toBe('Link konnte nicht kopiert werden. Bitte kopieren Sie die Adresse aus der Adresszeile.')
      expect(ereignisse.kopieren.map((e) => e.detail)).toEqual([{ quelle: 'leiste', ok: false }])
      abbinden(b, [ID])
    }
  })

  it('Statuszeile ist eine Live-Region (role="status", u-sr-only) in der Leiste', () => {
    const { leiste } = bau()
    const zeile = leiste.querySelector('[role="status"]')
    expect(zeile?.getAttribute('aria-live')).toBe('polite')
    expect(zeile?.classList.contains('u-sr-only')).toBe(true)
  })
})

describe('share-bar: Blase an der Textstelle', () => {
  it('Auswahl ab drei Wörtern im Artikeltext öffnet die Blase erst nach der Ruhezeit', () => {
    const { text, blase, ereignisse } = bau()
    markiere(text, 'Ein Assistent findet nur')
    expect(offen(blase())).toBe(false) // noch in der Ruhezeit
    vi.advanceTimersByTime(RUHE)
    const b = blase()
    expect(offen(b)).toBe(true)
    expect(b?.getAttribute('role')).toBe('group')
    expect(b?.getAttribute('aria-label')).toBe('Textstelle teilen')
    expect([...(b?.querySelectorAll('button') || [])].map((k) => k.textContent)).toEqual(['Zitat teilen', 'Link kopieren'])
    expect(ereignisse.blase.map((e) => e.detail)).toEqual([{ open: true }])
    passtZumRecipe(ID, ereignisse.blase[0])
  })

  it('viele selectionchange in Folge (Umschalt+Pfeil) prüfen nur einmal nach der Ruhe', () => {
    const { text, blase, ereignisse } = bau()
    markiere(text, 'Ein Assistent')
    vi.advanceTimersByTime(100)
    markiere(text, 'Ein Assistent findet')
    vi.advanceTimersByTime(100)
    markiere(text, 'Ein Assistent findet nur')
    expect(offen(blase())).toBe(false)
    vi.advanceTimersByTime(RUHE)
    expect(offen(blase())).toBe(true)
    expect(ereignisse.blase).toHaveLength(1)
  })

  it('weniger als drei Wörter oder Auswahl über den Artikeltext hinaus: keine Blase', () => {
    const { b, text, blase } = bau()
    markiere(text, 'Ein Assistent')
    vi.advanceTimersByTime(RUHE)
    expect(offen(blase())).toBe(false)
    // vom Titel (ausserhalb) bis in den Fliesstext
    const titel = /** @type {Text} */ (b.querySelector('.t-article__title')?.firstChild)
    const absatz = /** @type {Text} */ (text.querySelector('p')?.firstChild)
    const r = document.createRange()
    r.setStart(titel, 0)
    r.setEnd(absatz, 20)
    document.getSelection()?.removeAllRanges()
    document.getSelection()?.addRange(r)
    document.dispatchEvent(new Event('selectionchange'))
    vi.advanceTimersByTime(RUHE)
    expect(offen(blase())).toBe(false)
  })

  it('solange die Maus gedrückt ist, keine Blase; nach dem Loslassen schon', () => {
    const { text, blase } = bau()
    zeiger(text, 'pointerdown')
    markiere(text, 'Ein Assistent findet nur')
    vi.advanceTimersByTime(RUHE)
    expect(offen(blase())).toBe(false)
    zeiger(text, 'pointerup')
    vi.advanceTimersByTime(RUHE)
    expect(offen(blase())).toBe(true)
  })

  it('Link kopieren in der Blase: Adresse mit Text-Fragment #:~:text=', async () => {
    const writeText = vi.fn(async () => {})
    navigatorMit({ writeText })
    const { text, blase, ereignisse } = bau()
    markiere(text, 'Ein Assistent findet nur')
    vi.advanceTimersByTime(RUHE)
    const knopf = /** @type {HTMLButtonElement} */ (blase()?.querySelectorAll('button')[1])
    klick(knopf)
    await fertig()
    expect(writeText).toHaveBeenCalledWith(`${URL_ARTIKEL}#:~:text=Ein%20Assistent%20findet%20nur`)
    expect(knopf.textContent).toBe('Link kopiert')
    expect(ereignisse.kopieren.map((e) => e.detail)).toEqual([{ quelle: 'auswahl', ok: true }])
  })

  it('Text-Fragment: Bindestrich, Komma und & kodiert; lange Stellen als textStart,textEnd', () => {
    expect(textFragment('KI-Assistenten, Inhalte & Technik')).toBe('#:~:text=KI%2DAssistenten%2C%20Inhalte%20%26%20Technik')
    const lang = 'Veraltete Richtlinien, doppelte Seiten und fehlende Zuständigkeiten führen zu Antworten, die überzeugend klingen und trotzdem falsch sind.'
    expect(textFragment(lang)).toBe('#:~:text=Veraltete%20Richtlinien%2C%20doppelte%20Seiten,und%20trotzdem%20falsch%20sind.')
    // ueber Absaetze hinweg immer als Bereich
    expect(textFragment('Ende des ersten\nAnfang des zweiten')).toBe('#:~:text=Ende%20des%20ersten,Anfang%20des%20zweiten')
  })

  it('Zitat teilen mit Web Share: Text in Anführungszeichen, Adresse mit Fragment', async () => {
    const share = vi.fn(async () => {})
    navigatorMit({ share })
    const { text, blase, ereignisse } = bau()
    markiere(text, 'Ein Assistent findet nur')
    vi.advanceTimersByTime(RUHE)
    klick(/** @type {HTMLElement} */ (blase()?.querySelectorAll('button')[0]))
    await fertig()
    expect(share).toHaveBeenCalledWith({
      title: 'Warum KI-Assistenten scheitern',
      text: '„Ein Assistent findet nur“',
      url: `${URL_ARTIKEL}#:~:text=Ein%20Assistent%20findet%20nur`
    })
    expect(ereignisse.teilen.map((e) => e.detail)).toEqual([{ quelle: 'auswahl', ok: true }])
  })

  it('Zitat teilen ohne Web Share: öffnet LinkedIn mit der Adresse samt Fragment', () => {
    navigatorMit({})
    const oeffne = vi.spyOn(BEHAVIORS[ID], 'oeffne').mockImplementation(() => {})
    const { text, blase } = bau()
    markiere(text, 'Ein Assistent findet nur')
    vi.advanceTimersByTime(RUHE)
    klick(/** @type {HTMLElement} */ (blase()?.querySelectorAll('button')[0]))
    expect(oeffne).toHaveBeenCalledTimes(1)
    expect(oeffne.mock.calls[0][1]).toBe('https://www.linkedin.com/sharing/share-offsite/?url=' +
      encodeURIComponent(`${URL_ARTIKEL}#:~:text=Ein%20Assistent%20findet%20nur`))
  })

  it('Tab führt in die Blase, Escape schließt sie, Fokus und Auswahl kommen zurück, die Blase öffnet nicht neu', () => {
    const { text, blase, ereignisse } = bau()
    markiere(text, 'Ein Assistent findet nur')
    vi.advanceTimersByTime(RUHE)
    const tab = taste(document.body, 'Tab')
    expect(tab.defaultPrevented).toBe(true)
    const b = /** @type {HTMLElement} */ (blase())
    expect(document.activeElement).toBe(b.querySelector('button'))
    const esc = taste(/** @type {HTMLElement} */ (document.activeElement), 'Escape')
    expect(esc.defaultPrevented).toBe(true)
    expect(offen(blase())).toBe(false)
    expect(b.contains(document.activeElement)).toBe(false)
    expect(document.getSelection()?.toString()).toBe('Ein Assistent findet nur')
    document.dispatchEvent(new Event('selectionchange'))
    vi.advanceTimersByTime(RUHE)
    expect(offen(blase())).toBe(false)
    expect(ereignisse.blase.map((e) => e.detail)).toEqual([{ open: true }, { open: false }])
  })

  it('nach Escape: dieselbe Stelle neu mit der Maus markiert öffnet die Blase wieder', () => {
    const { text, blase } = bau()
    markiere(text, 'Ein Assistent findet nur')
    vi.advanceTimersByTime(RUHE)
    taste(document.body, 'Escape')
    expect(offen(blase())).toBe(false)
    zeiger(text, 'pointerdown')
    markiere(text, 'Ein Assistent findet nur')
    zeiger(text, 'pointerup')
    vi.advanceTimersByTime(RUHE)
    expect(offen(blase())).toBe(true)
  })

  it('Escape gibt den Fokus an das Element zurück, das ihn vorher hatte', () => {
    const { b, text, blase } = bau()
    const vorher = /** @type {HTMLElement} */ (b.querySelector('.t-article__category'))
    vorher.focus()
    markiere(text, 'Ein Assistent findet nur')
    vi.advanceTimersByTime(RUHE)
    taste(vorher, 'Tab')
    expect(blase()?.contains(document.activeElement)).toBe(true)
    taste(/** @type {HTMLElement} */ (document.activeElement), 'Escape')
    expect(document.activeElement).toBe(vorher)
  })

  it('Klick außerhalb schließt; Drücken in der Blase schließt nicht und behält die Auswahl', () => {
    const { b, text, blase } = bau()
    markiere(text, 'Ein Assistent findet nur')
    vi.advanceTimersByTime(RUHE)
    const innen = zeiger(/** @type {HTMLElement} */ (blase()?.querySelector('button')), 'mousedown')
    expect(innen.defaultPrevented).toBe(true)
    zeiger(/** @type {HTMLElement} */ (blase()?.querySelector('button')), 'pointerdown')
    expect(offen(blase())).toBe(true)
    zeiger(/** @type {HTMLElement} */ (b.querySelector('.t-article__title')), 'pointerdown')
    expect(offen(blase())).toBe(false)
  })

  it('Escape ohne offene Blase bleibt beim Browser', () => {
    bau()
    expect(taste(document.body, 'Escape').defaultPrevented).toBe(false)
    expect(taste(document.body, 'Tab').defaultPrevented).toBe(false)
  })

  it('bleibt im Viewport: am rechten Rand eingerückt, ganz oben unter die Auswahl', () => {
    vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockReturnValue(200)
    vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockReturnValue(40)
    vi.spyOn(document.documentElement, 'clientWidth', 'get').mockReturnValue(390)
    const rechteck = (left, top) => ({ left, top, right: left + 30, bottom: top + 20, width: 30, height: 20, x: left, y: top, toJSON () {} })
    let lage = rechteck(350, 300)
    vi.spyOn(Range.prototype, 'getBoundingClientRect').mockImplementation(() => /** @type {DOMRect} */ (lage))
    const { text, blase } = bau()
    markiere(text, 'Ein Assistent findet nur')
    vi.advanceTimersByTime(RUHE)
    const b = /** @type {HTMLElement} */ (blase())
    const links = parseFloat(b.style.left) - window.scrollX
    expect(b.style.position).toBe('absolute')
    expect(links).toBe(390 - 8 - 200) // mittig waere 265, ragte rechts hinaus
    expect(parseFloat(b.style.top) - window.scrollY).toBe(300 - 40 - 10) // ueber der Auswahl
    // Auswahl ganz oben links: Blase darunter, links eingerueckt
    taste(document.body, 'Escape')
    lage = rechteck(10, 5)
    markiere(text, 'Veraltete Richtlinien, doppelte')
    vi.advanceTimersByTime(RUHE)
    expect(offen(blase())).toBe(true)
    expect(parseFloat(b.style.top) - window.scrollY).toBe(25 + 10)
    expect(parseFloat(b.style.left) - window.scrollX).toBe(8)
  })

  it('jede Taste aus dem Recipe ist geprüft', () => {
    deckeTastenAb(ID, {
      Tab: 'Tab führt in die Blase (Test oben)',
      Enter: 'Knöpfe sind <button>: Klick (Tests oben)',
      Escape: 'Escape schließt (Test oben)',
      'Shift+ArrowRight': 'Auswahl per Tastatur: Ruhezeit (Test oben)'
    })
  })

  it('Abbinden entfernt Blase und Statuszeile, danach keine Blase mehr', () => {
    const { b, text, blase, leiste } = bau()
    markiere(text, 'Ein Assistent findet nur')
    vi.advanceTimersByTime(RUHE)
    expect(blase()).not.toBeNull()
    abbinden(b, [ID])
    expect(blase()).toBeNull()
    expect(leiste.querySelector('[role="status"]')).toBeNull()
    markiere(text, 'Ein Assistent findet nur')
    vi.advanceTimersByTime(RUHE)
    expect(blase()).toBeNull()
  })

  it('Arena „Ausprobieren“: Leiste und Artikeltext, die Auswahl öffnet die Blase', () => {
    for (const sp of ['leiste', 'beschriftet', 'blase']) {
      document.body.innerHTML = ''
      const b = buehne(lebendigesMarkup(ID, sp))
      expect(b.querySelector('article .nc-share-bar [data-teilen]'), sp).not.toBeNull()
      expect(b.querySelector('.nc-share-bar__popover'), sp).toBeNull()
      anbinden(b, [ID])
      markiere(/** @type {HTMLElement} */ (b.querySelector('[data-teilen-text]')), 'Ein Assistent findet nur')
      vi.advanceTimersByTime(RUHE)
      expect(offen(b.querySelector('.nc-share-bar__popover')), sp).toBe(true)
      abbinden(b, [ID])
    }
  })
})
