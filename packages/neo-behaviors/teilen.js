// @ts-check
// ==========================================================================
// Teilen-Leiste — nach data/share-bar-recipe.json (I15 Phase 3, 22.11.2026)
// ==========================================================================
// Recipe-ID share-bar (Behaviors tragen die Recipe-ID; der Plan nennt die
// Datei teilen.js). Website-Bauteil: in Drupal nur per nur.
//
// Leiste .nc-share-bar (Markup data/markup/share-bar.html):
//   [data-teilen]           Teilen ueber navigator.share({ title, url }).
//                           Ohne Web Share ist der Knopf [hidden] — LinkedIn
//                           und E-Mail sind Links und bleiben (auch ohne JS).
//                           Abbrechen im Teilen-Dialog (AbortError) bleibt
//                           still.
//   [data-teilen-kopieren]  schreibt die Adresse per
//                           navigator.clipboard.writeText; Meldung in der
//                           Statuszeile (role="status", _meldung.js) und
//                           als Name des Knopfs fuer 2 s.
//   Titel und Adresse: data-teilen-titel / data-teilen-url an der Leiste,
//   sonst document.title und location ohne #.
//
// Textstelle teilen: Der Artikeltext [data-teilen-text] liegt im selben
// <article> (oder [data-teilen-bereich]) wie die Leiste. Eine Auswahl von
// mindestens drei Woertern ganz darin oeffnet nach einer Ruhezeit (RUHE ms
// ohne selectionchange, Maus losgelassen — auch Umschalt+Pfeil mit
// Caret-Browsing) die Blase .nc-share-bar__popover direkt nach dem
// Artikeltext:
//   „Zitat teilen“   navigator.share({ title, text: „Auswahl“, url mit
//                    Text-Fragment }); ohne Web Share LinkedIn mit dieser
//                    Adresse (neuer Tab).
//   „Link kopieren“  Adresse mit #:~:text=… (lange Stellen und solche ueber
//                    mehrere Absaetze als textStart,textEnd).
// Die Blase steht absolut an der Auswahl (darueber, ganz oben darunter),
// waagerecht im Viewport gehalten (8 px Rand). Tab fuehrt in die Blase
// (role="group", aria-label), Escape und Klick ausserhalb schliessen; der
// Fokus geht an das Element davor zurueck, sonst bleibt die Auswahl stehen
// und die Blase oeffnet fuer sie nicht erneut.
//
// Ereignisse an der Leiste: share-bar-share { quelle, ok },
// share-bar-copy { quelle, ok } (quelle: leiste | auswahl),
// share-bar-popover { open }. Abbinden entfernt Blase und Statuszeile.
// ==========================================================================
import { sende } from './kern.js'
import { statuszeile, ansagen } from './_meldung.js'

const RUHE = 300
const RAND = 8
const ABSTAND = 10 // Spitze der Blase plus Luft
const DAUER = 2000
const MIN_WOERTER = 3
const KURZ = 80 // laengere Stellen als textStart,textEnd
const RANDWOERTER = 4

const TEXT = {
  kopieren: 'Link kopieren',
  kopiert: 'Link kopiert',
  fehler: 'Link konnte nicht kopiert werden. Bitte kopieren Sie die Adresse aus der Adresszeile.',
  zitat: 'Zitat teilen',
  blase: 'Textstelle teilen'
}

const BELEGT = new WeakSet() // Artikeltexte mit Blase (eine Leiste je Text)

/** Kodierung fuer Text-Fragmente: zusaetzlich - (und , & sind ohnehin kodiert) */
const kodiere = (s) => encodeURIComponent(s).replace(/-/g, '%2D')

/**
 * Text-Fragment fuer eine Stelle: #:~:text=<stelle> bzw. bei langen
 * Stellen und Stellen ueber Absaetze hinweg #:~:text=<anfang>,<ende>.
 * @param {string} roh ausgewaehlter Text (Zeilenumbruch = Absatzgrenze)
 */
export function textFragment (roh) {
  const text = roh.replace(/\s+/g, ' ').trim()
  const woerter = text.split(' ')
  const absaetze = /\n/.test(roh.trim())
  if ((!absaetze && text.length <= KURZ) || woerter.length < 2) return `#:~:text=${kodiere(text)}`
  const n = woerter.length >= 2 * RANDWOERTER ? RANDWOERTER : Math.ceil(woerter.length / 2)
  const anfang = woerter.slice(0, n).join(' ')
  const ende = woerter.slice(woerter.length >= 2 * RANDWOERTER ? -n : n).join(' ')
  return `#:~:text=${kodiere(anfang)},${kodiere(ende)}`
}

const linkedin = (url) => `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`

export const teilen = {
  id: 'share-bar',
  selektor: '.nc-share-bar',
  // Website-Bauteil: in Drupal nur per drupalSettings.neoBehaviors.nur
  nurAusdruecklich: true,
  textFragment,

  /**
   * LinkedIn in neuem Tab (ohne Web Share). Eigene Methode, damit Tests sie
   * ersetzen koennen.
   * @param {Window} ansicht @param {string} url
   */
  oeffne (ansicht, url) {
    ansicht.open(url, '_blank', 'noopener,noreferrer')
  },

  /** @param {HTMLElement} wurzel @param {AbortSignal} signal */
  binde (wurzel, signal) {
    const dok = wurzel.ownerDocument
    const ansicht = /** @type {Window} */ (dok.defaultView || window)
    const nav = /** @type {any} */ (ansicht.navigator || {})
    const kannTeilen = () => typeof nav.share === 'function'
    const titel = () => wurzel.getAttribute('data-teilen-titel') || dok.title
    const adresse = () => wurzel.getAttribute('data-teilen-url') || ansicht.location.href.split('#')[0]
    const zeile = statuszeile(wurzel, signal)
    const uhren = new Set()
    const spaeter = (fn, ms) => { const t = setTimeout(() => { uhren.delete(t); fn() }, ms); uhren.add(t); return t }
    signal.addEventListener('abort', () => { for (const t of uhren) clearTimeout(t) })

    // -- Teilen-Knopf: ohne Web Share ausgeblendet --------------------------
    const teilenKnopf = /** @type {HTMLElement|null} */ (wurzel.querySelector('[data-teilen]'))
    if (teilenKnopf) {
      const vorher = teilenKnopf.hidden
      teilenKnopf.hidden = !kannTeilen()
      signal.addEventListener('abort', () => { teilenKnopf.hidden = vorher })
    }

    /** @param {object} daten @param {string} quelle */
    const teile = async (daten, quelle) => {
      let ok = false
      try {
        await nav.share(daten)
        ok = true
      } catch {
        // AbortError: Nutzer hat abgebrochen — still. Andere Fehler
        // (NotAllowedError ohne Nutzergeste) ebenfalls ohne Meldung.
      }
      if (!signal.aborted) sende(wurzel, 'share-bar-share', { quelle, ok })
    }

    /**
     * @param {string} url @param {string} quelle
     * @param {(ok: boolean) => void} [zeigen] sichtbare Rueckmeldung am Knopf
     */
    const kopiere = async (url, quelle, zeigen) => {
      let ok = false
      try {
        if (typeof nav.clipboard?.writeText === 'function') {
          await nav.clipboard.writeText(url)
          ok = true
        }
      } catch { /* verweigert oder unsicherer Kontext */ }
      if (signal.aborted) return
      ansagen(zeile, ok ? TEXT.kopiert : TEXT.fehler)
      zeigen?.(ok)
      sende(wurzel, 'share-bar-copy', { quelle, ok })
    }

    wurzel.addEventListener('click', (e) => {
      const ziel = /** @type {Element} */ (e.target)
      const knopf = /** @type {HTMLElement|null} */ (ziel.closest?.('[data-teilen], [data-teilen-kopieren]'))
      if (!knopf || !wurzel.contains(knopf)) return
      if (knopf.hasAttribute('data-teilen')) {
        if (kannTeilen()) void teile({ title: titel(), url: adresse() }, 'leiste')
        return
      }
      void kopiere(adresse(), 'leiste', (ok) => {
        if (!ok) return
        knopf.setAttribute('aria-label', TEXT.kopiert)
        spaeter(() => knopf.setAttribute('aria-label', TEXT.kopieren), DAUER)
      })
    }, { signal })

    // -- Blase an der Textstelle -------------------------------------------
    const bereich = wurzel.closest('[data-teilen-bereich], article')
    const text = /** @type {HTMLElement|null} */ (bereich?.querySelector('[data-teilen-text]') || null)
    if (!text || BELEGT.has(text)) return
    BELEGT.add(text)
    signal.addEventListener('abort', () => BELEGT.delete(text))

    /** @type {HTMLElement|null} */
    let blase = null
    /** @type {{ text: string, roh: string, range: Range } | null} */
    let auswahl = null
    /** @type {Range|null} geschlossene Auswahl: oeffnet nicht erneut */
    let gesperrt = null
    /** @type {HTMLElement|null} */
    let rueck = null
    let maus = false
    let warte = /** @type {ReturnType<typeof setTimeout>|undefined} */ (undefined)
    signal.addEventListener('abort', () => { clearTimeout(warte); blase?.remove() })

    const offen = () => !!blase && !blase.hidden
    const fragmentAdresse = () => adresse() + textFragment(auswahl?.roh || '')
    const gleich = (a, b) => a.startContainer === b.startContainer && a.startOffset === b.startOffset &&
      a.endContainer === b.endContainer && a.endOffset === b.endOffset

    const baue = () => {
      const el = dok.createElement('div')
      el.className = 'nc-share-bar__popover'
      el.setAttribute('role', 'group')
      el.setAttribute('aria-label', TEXT.blase)
      el.hidden = true
      const knopf = (inhalt, attr) => {
        const k = dok.createElement('button')
        k.type = 'button'
        k.className = 'nc-button nc-button--ghost nc-button--xs'
        k.setAttribute(attr, '')
        k.textContent = inhalt
        return k
      }
      el.append(knopf(TEXT.zitat, 'data-teilen-zitat'), knopf(TEXT.kopieren, 'data-teilen-link'))
      // Druecken in der Blase behaelt Auswahl und Fokus
      el.addEventListener('mousedown', (e) => e.preventDefault())
      el.addEventListener('click', (e) => {
        const k = /** @type {Element} */ (e.target).closest?.('button')
        if (!k || !auswahl) return
        if (k.hasAttribute('data-teilen-zitat')) {
          const url = fragmentAdresse()
          if (kannTeilen()) void teile({ title: titel(), text: `„${auswahl.text}“`, url }, 'auswahl')
          else {
            teilen.oeffne(ansicht, linkedin(url))
            sende(wurzel, 'share-bar-share', { quelle: 'auswahl', ok: true })
          }
          return
        }
        void kopiere(fragmentAdresse(), 'auswahl', (ok) => {
          if (!ok) return
          k.textContent = TEXT.kopiert
          spaeter(() => { k.textContent = TEXT.kopieren }, DAUER)
        })
      })
      el.addEventListener('focusout', (e) => {
        const neu = /** @type {Node|null} */ (e.relatedTarget)
        if (neu && !el.contains(neu)) schliesse()
      })
      text.after(el)
      return el
    }

    /** Lage an der Auswahl: darueber mittig, ganz oben darunter; im Viewport. */
    const setze = (range) => {
      if (!blase) return
      blase.style.position = 'absolute'
      blase.style.margin = '0'
      const r = range.getBoundingClientRect()
      const breite = blase.offsetWidth
      const hoehe = blase.offsetHeight
      const sicht = dok.documentElement.clientWidth || ansicht.innerWidth
      let oben = r.top - hoehe - ABSTAND
      if (oben < RAND) oben = r.bottom + ABSTAND
      const mitte = r.left + r.width / 2
      const links = Math.max(RAND, Math.min(mitte - breite / 2, sicht - breite - RAND))
      // in Koordinaten des Bezugselements umrechnen
      const bezug = /** @type {HTMLElement|null} */ (blase.offsetParent)
      let dx = ansicht.scrollX
      let dy = ansicht.scrollY
      if (bezug && bezug !== dok.body && bezug !== dok.documentElement) {
        const b = bezug.getBoundingClientRect()
        dx = bezug.scrollLeft - b.left - bezug.clientLeft
        dy = bezug.scrollTop - b.top - bezug.clientTop
      }
      blase.style.left = `${Math.round(links + dx)}px`
      blase.style.top = `${Math.round(oben + dy)}px`
    }

    const oeffne = () => {
      if (!auswahl) return
      if (!blase) blase = baue()
      const neu = blase.hidden
      if (neu) {
        const link = blase.querySelector('[data-teilen-link]')
        if (link) link.textContent = TEXT.kopieren
      }
      blase.hidden = false
      setze(auswahl.range)
      if (neu) sende(wurzel, 'share-bar-popover', { open: true })
    }

    /** @param {{ zurueck?: boolean }} [o] zurueck: Fokus an das Element davor, sonst Auswahl wiederherstellen */
    const schliesse = ({ zurueck = false } = {}) => {
      if (!blase || blase.hidden) return
      const drin = blase.contains(dok.activeElement)
      blase.hidden = true
      if (zurueck && auswahl) {
        gesperrt = auswahl.range.cloneRange()
        if (drin) {
          if (rueck && rueck.isConnected && rueck !== dok.body) rueck.focus()
          else {
            const aktiv = /** @type {HTMLElement|null} */ (dok.activeElement)
            aktiv?.blur?.()
            const sel = dok.getSelection()
            sel?.removeAllRanges()
            sel?.addRange(gesperrt.cloneRange())
          }
        }
      }
      rueck = null
      sende(wurzel, 'share-bar-popover', { open: false })
    }

    const pruefe = () => {
      if (maus || signal.aborted) return
      if (blase && blase.contains(dok.activeElement)) return
      const sel = dok.getSelection()
      if (!sel || !sel.rangeCount || sel.isCollapsed) { gesperrt = null; schliesse(); return }
      const range = sel.getRangeAt(0)
      if (!text.contains(range.startContainer) || !text.contains(range.endContainer)) { schliesse(); return }
      const roh = sel.toString()
      const sauber = roh.replace(/\s+/g, ' ').trim()
      if (sauber.split(' ').filter(Boolean).length < MIN_WOERTER) { schliesse(); return }
      if (gesperrt && gleich(gesperrt, range)) return
      gesperrt = null
      auswahl = { text: sauber, roh, range: range.cloneRange() }
      oeffne()
    }

    const plane = () => {
      clearTimeout(warte)
      warte = setTimeout(pruefe, RUHE)
    }

    dok.addEventListener('selectionchange', plane, { signal })
    dok.addEventListener('pointerdown', (e) => {
      const ziel = /** @type {Node} */ (e.target)
      if (offen() && blase && !blase.contains(ziel)) schliesse()
      // Neues Markieren mit der Maus: auch dieselbe Stelle oeffnet wieder
      if (/** @type {MouseEvent} */ (e).button === 0) { maus = true; gesperrt = null }
    }, { signal, capture: true })
    dok.addEventListener('pointerup', () => {
      if (!maus) return
      maus = false
      plane()
    }, { signal, capture: true })
    dok.addEventListener('pointercancel', () => { maus = false }, { signal })

    dok.addEventListener('keydown', (e) => {
      if (!offen() || !blase) return
      if (e.key === 'Escape') {
        e.preventDefault()
        schliesse({ zurueck: true })
        return
      }
      if (e.key === 'Tab' && !e.shiftKey && !e.altKey && !e.ctrlKey && !e.metaKey && !blase.contains(dok.activeElement)) {
        e.preventDefault()
        const aktiv = /** @type {HTMLElement|null} */ (dok.activeElement)
        rueck = aktiv && aktiv !== dok.body ? aktiv : null
        const erster = /** @type {HTMLElement|null} */ (blase.querySelector('button'))
        erster?.focus()
      }
    }, { signal })

    ansicht.addEventListener('resize', () => { if (offen() && auswahl) setze(auswahl.range) }, { signal })
  }
}
