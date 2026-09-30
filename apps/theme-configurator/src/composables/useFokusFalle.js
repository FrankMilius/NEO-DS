/**
 * useFokusFalle — Fokus-Management fuer modale Dialoge (Plan v2, 4.4)
 *
 * Solange `aktiv` wahr ist:
 *  - Fokus wandert beim Oeffnen in den Dialog (startFokus-Selektor, [autofocus],
 *    erstes fokussierbares Element oder der Container selbst),
 *  - Tab / Umschalt+Tab bleiben im Container (Zyklus),
 *  - Escape ruft `beiEscape` auf (nur der oberste offene Dialog reagiert),
 *  - beim Schliessen kehrt der Fokus zum ausloesenden Element zurueck.
 *
 * Mehrere Fallen stapeln sich: nur die zuletzt aktivierte behandelt Tasten.
 */
import { watch, nextTick, onBeforeUnmount, toValue } from 'vue'

export const FOKUSSIERBAR_SELEKTOR = [
  'a[href]',
  'area[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'iframe',
  'summary',
  '[contenteditable="true"]',
  '[tabindex]:not([tabindex="-1"])'
].join(',')

/** Alle per Tab erreichbaren Elemente im Container, in DOM-Reihenfolge. */
export function fokussierbareElemente (container) {
  if (!container) return []
  return Array.from(container.querySelectorAll(FOKUSSIERBAR_SELEKTOR)).filter((el) =>
    !el.closest('[hidden], [inert], [aria-hidden="true"]') && el.tabIndex !== -1
  )
}

// Offene Fallen, die oberste zuletzt
const stapel = []

/** Nur fuer Tests: Anzahl aktiver Fallen. */
export function _aktiveFallen () { return stapel.length }

/**
 * @param {import('vue').Ref<HTMLElement|null>|(() => HTMLElement|null)} containerRef
 * @param {import('vue').Ref<boolean>|(() => boolean)} aktiv
 * @param {{ beiEscape?: (e: KeyboardEvent) => void, startFokus?: string, fokusZurueck?: boolean }} [optionen]
 */
export function useFokusFalle (containerRef, aktiv, optionen = {}) {
  const { beiEscape, startFokus, fokusZurueck = true } = optionen
  let ausloeser = null
  const eintrag = {}

  function container () { return toValue(containerRef) }

  function onKeydown (e) {
    if (stapel[stapel.length - 1] !== eintrag) return
    const c = container()
    if (!c) return

    if (e.key === 'Escape' || e.key === 'Esc') {
      if (beiEscape) {
        e.preventDefault()
        e.stopPropagation()
        beiEscape(e)
      }
      return
    }
    if (e.key !== 'Tab') return

    const elemente = fokussierbareElemente(c)
    if (elemente.length === 0) {
      e.preventDefault()
      c.focus()
      return
    }
    const erstes = elemente[0]
    const letztes = elemente[elemente.length - 1]
    const aktuell = document.activeElement
    const drin = c.contains(aktuell)
    if (e.shiftKey) {
      if (!drin || aktuell === erstes || aktuell === c) {
        e.preventDefault()
        letztes.focus()
      }
    } else if (!drin || aktuell === letztes) {
      e.preventDefault()
      erstes.focus()
    }
  }

  function fokusHinein () {
    const c = container()
    if (!c) return
    if (c.contains(document.activeElement) && document.activeElement !== c) return
    const ziel =
      (startFokus && c.querySelector(startFokus)) ||
      c.querySelector('[autofocus]') ||
      fokussierbareElemente(c)[0] ||
      c
    if (ziel === c && !c.hasAttribute('tabindex')) c.setAttribute('tabindex', '-1')
    ziel.focus()
  }

  function aktivieren () {
    if (stapel.includes(eintrag)) return
    const aktuell = document.activeElement
    ausloeser = aktuell && aktuell !== document.body ? aktuell : null
    stapel.push(eintrag)
    document.addEventListener('keydown', onKeydown)
    nextTick(fokusHinein)
  }

  function deaktivieren () {
    const i = stapel.indexOf(eintrag)
    if (i === -1) return
    stapel.splice(i, 1)
    document.removeEventListener('keydown', onKeydown)
    const ziel = ausloeser
    ausloeser = null
    if (fokusZurueck && ziel && typeof ziel.focus === 'function') {
      nextTick(() => { if (ziel.isConnected) ziel.focus() })
    }
  }

  watch(() => !!toValue(aktiv), (an) => (an ? aktivieren() : deaktivieren()), { immediate: true })
  onBeforeUnmount(deaktivieren)

  return {
    fokusHinein,
    elemente: () => fokussierbareElemente(container())
  }
}
