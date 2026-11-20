/**
 * Content Feed (I11 Phase 2, 19.11.2026): "Load more" without leaving the page.
 * Without JavaScript the button is a plain link to the next page
 * (?seite=2); with the behavior the cards of that page are appended to the
 * list, focus moves to the first new card and a status line announces how
 * many arrived. Markup as in data/markup/content-feed.html; keys and events
 * come from data/content-feed-recipe.json.
 */
import { describe, it, expect, afterEach, beforeEach, vi } from 'vitest'
import { anbinden, abbinden, BEHAVIORS, NUR_AUSDRUECKLICH } from 'neo-behaviors'
import { buehne, sammle, passtZumRecipe } from './_helfer.js'

const ID = 'content-feed'

const karte = (n) => `<li class="nc-content-feed__item"><a class="nc-card nc-card--navigational nc-card--preview" href="/beitrag-${n}"><div class="nc-card__content"><h3 class="nc-card__title">Beitrag ${n}</h3></div></a></li>`

/** Feed page as the server renders it; `weiter` = href of the next page or null */
const feed = (von, bis, weiter, id = 'feed-alle') => `<section class="nc-content-feed" id="${id}" aria-labelledby="${id}-h">
<h2 id="${id}-h">Alle Beiträge</h2>
<ul class="nc-content-feed__list nc-card-grid nc-card-grid--cols-4">${Array.from({ length: bis - von + 1 }, (_, i) => karte(von + i)).join('')}</ul>
${weiter ? `<div class="nc-content-feed__footer"><a class="nc-button nc-button--secondary" href="${weiter}" data-feed-more>Mehr laden</a></div>` : ''}
<p class="u-sr-only" role="status" aria-live="polite" data-feed-geladen="{anzahl} weitere Beiträge geladen"></p>
</section>`

const seite = (inhalt) => `<!doctype html><html><body><main>${inhalt}</main></body></html>`

/** fetch stub: answers per URL, records calls; `haelt` keeps the answer pending */
function server (antworten, { haelt = false } = {}) {
  const s = { aufrufe: [], freigeben: () => {} }
  const warte = haelt ? new Promise((resolve) => { s.freigeben = resolve }) : Promise.resolve()
  vi.stubGlobal('fetch', vi.fn(async (url) => {
    s.aufrufe.push(String(url))
    await warte
    const a = antworten[String(url)]
    if (a instanceof Error) throw a
    if (a === undefined) return { ok: false, status: 404, text: async () => '' }
    return { ok: true, status: 200, text: async () => a }
  }))
  return s
}

const klick = (el, init = {}) => el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, button: 0, ...init }))
const fertig = () => new Promise((resolve) => setTimeout(resolve, 0))

function bau (html = feed(1, 4, '/aktuelles?seite=2')) {
  const b = buehne(html)
  const wurzel = /** @type {HTMLElement} */ (b.querySelector('.nc-content-feed'))
  const ereignisse = sammle(wurzel, 'content-feed-mehr')
  anbinden(b, [ID])
  return { b, wurzel, ereignisse, link: /** @type {HTMLAnchorElement} */ (wurzel.querySelector('[data-feed-more]')) }
}

beforeEach(() => { document.body.innerHTML = '' })
afterEach(() => {
  abbinden(document.body, [ID])
  document.body.innerHTML = ''
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

describe('content-feed: „Mehr laden“ ohne Seitenwechsel', () => {
  it('Website-Bauteil: nurAusdruecklich, in NUR_AUSDRUECKLICH', () => {
    expect(BEHAVIORS[ID].nurAusdruecklich).toBe(true)
    expect(NUR_AUSDRUECKLICH).toContain(ID)
  })

  it('hängt die Karten der nächsten Seite an, fokussiert die erste neue, meldet die Zahl', async () => {
    const s = server({ '/aktuelles?seite=2': seite(feed(5, 6, '/aktuelles?seite=3')) })
    const { wurzel, ereignisse, link } = bau()
    const ok = klick(link)
    expect(ok).toBe(false) // default prevented: no page change
    await fertig()
    expect(s.aufrufe).toEqual(['/aktuelles?seite=2'])
    const titel = [...wurzel.querySelectorAll('.nc-card__title')].map((t) => t.textContent)
    expect(titel).toEqual(['Beitrag 1', 'Beitrag 2', 'Beitrag 3', 'Beitrag 4', 'Beitrag 5', 'Beitrag 6'])
    expect(document.activeElement?.getAttribute('href')).toBe('/beitrag-5')
    expect(link.getAttribute('href')).toBe('/aktuelles?seite=3')
    expect(link.hasAttribute('aria-disabled')).toBe(false)
    expect(wurzel.querySelector('[role="status"]')?.textContent).toBe('2 weitere Beiträge geladen')
    expect(ereignisse).toHaveLength(1)
    expect(ereignisse[0].detail).toEqual({ anzahl: 2, ende: false })
    passtZumRecipe(ID, ereignisse[0])
  })

  it('letzte Seite: der Fuß mit „Mehr laden“ entfällt, ende = true', async () => {
    server({ '/aktuelles?seite=2': seite(feed(5, 5, null)) })
    const { wurzel, ereignisse, link } = bau()
    klick(link)
    await fertig()
    expect(wurzel.querySelector('[data-feed-more]')).toBeNull()
    expect(wurzel.querySelector('.nc-content-feed__footer')).toBeNull()
    expect(document.activeElement?.getAttribute('href')).toBe('/beitrag-5')
    expect(ereignisse[0].detail).toEqual({ anzahl: 1, ende: true })
  })

  it('nimmt aus der Antwort den Feed mit derselben id', async () => {
    server({ '/aktuelles?seite=2': seite(feed(90, 91, null, 'anderer') + feed(5, 5, null)) })
    const { wurzel, link } = bau()
    klick(link)
    await fertig()
    expect([...wurzel.querySelectorAll('.nc-card__title')].pop()?.textContent).toBe('Beitrag 5')
    expect(wurzel.querySelectorAll('.nc-content-feed__item')).toHaveLength(5)
  })

  it('während des Ladens: gesperrt (aria-disabled, aria-busy), ein zweiter Klick lädt nicht doppelt', async () => {
    const s = server({ '/aktuelles?seite=2': seite(feed(5, 6, null)) }, { haelt: true })
    const { wurzel, link } = bau()
    klick(link)
    expect(link.getAttribute('aria-disabled')).toBe('true')
    expect(wurzel.querySelector('.nc-content-feed__list')?.getAttribute('aria-busy')).toBe('true')
    expect(klick(link)).toBe(false)
    s.freigeben()
    await fertig()
    await fertig()
    expect(s.aufrufe).toHaveLength(1)
    expect(wurzel.querySelectorAll('.nc-content-feed__item')).toHaveLength(6)
    expect(wurzel.querySelector('.nc-content-feed__list')?.hasAttribute('aria-busy')).toBe(false)
  })

  it('Fehler (Netz, 404, Seite ohne Karten): wechselt zur Seite wie ohne JavaScript', async () => {
    const weiter = vi.spyOn(BEHAVIORS[ID], 'navigiere').mockImplementation(() => {})
    for (const antwort of [new Error('offline'), undefined, seite('<p>leer</p>')]) {
      document.body.innerHTML = ''
      server({ '/aktuelles?seite=2': antwort })
      const { wurzel, link } = bau()
      klick(link)
      await fertig()
      expect(wurzel.querySelectorAll('.nc-content-feed__item')).toHaveLength(4)
      abbinden(document.body, [ID])
    }
    expect(weiter.mock.calls.map((c) => c[1])).toEqual(['/aktuelles?seite=2', '/aktuelles?seite=2', '/aktuelles?seite=2'])
  })

  it('Klick mit Strg, Cmd, Umschalt oder mittlerer Taste bleibt beim Browser (neuer Tab)', () => {
    const s = server({})
    const { link } = bau()
    for (const init of [{ ctrlKey: true }, { metaKey: true }, { shiftKey: true }, { button: 1 }]) {
      expect(klick(link, init)).toBe(true)
    }
    expect(s.aufrufe).toHaveLength(0)
  })

  it('Link ohne Ziel (nur #…, z. B. in Doku-Beispielen) bleibt beim Browser: kein Laden, kein Seitenwechsel', () => {
    const s = server({})
    const weiter = vi.spyOn(BEHAVIORS[ID], 'navigiere').mockImplementation(() => {})
    const { link } = bau(feed(1, 4, '#'))
    expect(klick(link)).toBe(true)
    expect(s.aufrufe).toHaveLength(0)
    expect(weiter).not.toHaveBeenCalled()
  })

  it('ohne „Mehr laden“ (Startseite) und nach dem Abbinden: nichts abgefangen', () => {
    const s = server({})
    const { b } = bau(feed(1, 3, null))
    expect(b.querySelector('.nc-content-feed')?.getAttribute('data-neo-behavior')).toContain(ID)
    document.body.innerHTML = ''
    const { link } = bau()
    abbinden(document.body, [ID])
    expect(klick(link)).toBe(true)
    expect(s.aufrufe).toHaveLength(0)
  })
})
