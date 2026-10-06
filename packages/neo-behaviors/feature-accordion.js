// @ts-check
// ==========================================================================
// Feature-Akkordeon — nach data/feature-accordion-recipe.json (keyboard,
// events)
// ==========================================================================
// Zweispaltiger Block (Entscheidung 06.10.2026, website-verhalten c):
// links Verweise auf die Kapitel (.nc-feature-accordeon__link, Knoepfe),
// rechts die Kapitel (.nc-feature-accordeon__chapter) mit aufklappbaren
// Eintraegen (<details>, klappt der Browser). Kapitelwechsel, wie ihn die
// Doku beschreibt („.is-active … per JavaScript, wenn gescrollt oder ein
// Kapitel geklickt wird"):
//
//   Klick        (bzw. Enter/Leertaste) auf einen Verweis: markiert ihn
//                sofort (.is-active + aria-current="true"), scrollt sein
//                Kapitel an den Anfang der rechten Spalte — in der
//                zweispaltigen Lage scrollt die Spalte selbst (overflow-y
//                auto), gestapelt die Seite — sanft, ausser bei
//                prefers-reduced-motion, und setzt den Fokus aufs Kapitel
//                (tabindex="-1", ohne Scrollen). Der Spy ruht, bis das
//                Scrollen steht.
//   Spy          Beim Scrollen der rechten Spalte: markiert ist das LETZTE
//                Kapitel, dessen Oberkante den Spaltenanfang (+ 24 px)
//                passiert hat, sonst das erste.
//
// Zuordnung Verweis → Kapitel: aria-controls des Verweises (id des
// Kapitels), sonst die Reihenfolge. Die <details> bleiben nativ (Enter,
// Leertaste, Klick).
//
// Ereignis `feature-accordion-change` { index, previousIndex }.
// ==========================================================================
import { sende } from './kern.js'

const TOLERANZ = 24

export const featureAccordion = {
  id: 'feature-accordion',
  selektor: '.nc-feature-accordeon',
  // Website-Bauteil: in Drupal nur per drupalSettings.neoBehaviors.nur
  nurAusdruecklich: true,
  /** @param {HTMLElement} wurzel @param {AbortSignal} signal */
  binde (wurzel, signal) {
    const dok = wurzel.ownerDocument
    const ansicht = /** @type {Window} */ (dok.defaultView)
    const links = /** @type {HTMLElement[]} */ ([...wurzel.querySelectorAll('.nc-feature-accordeon__link')])
    const alleKapitel = /** @type {HTMLElement[]} */ ([...wurzel.querySelectorAll('.nc-feature-accordeon__chapter')])
    const rechts = /** @type {HTMLElement|null} */ (wurzel.querySelector('.nc-feature-accordeon__right'))
    const kapitelVon = (link, i) => {
      const id = link.getAttribute('aria-controls')
      const nachId = id ? alleKapitel.find((k) => k.id === id) : null
      return nachId || alleKapitel[i] || null
    }
    const paare = links.map((link, i) => ({ link, kapitel: kapitelVon(link, i) })).filter((p) => p.kapitel)
    if (!paare.length || !rechts) return

    const vorher = new Map(links.map((l) => [l, { aktiv: l.classList.contains('is-active'), current: l.getAttribute('aria-current') }]))
    const eigenerTabindex = new Set()
    let aktiv = Math.max(0, paare.findIndex((p) => p.link.classList.contains('is-active')))

    const setze = (i) => paare.forEach((p, j) => {
      p.link.classList.toggle('is-active', j === i)
      if (j === i) p.link.setAttribute('aria-current', 'true')
      else p.link.removeAttribute('aria-current')
    })
    function markiere (i) {
      if (i === aktiv) return
      const davor = aktiv
      aktiv = i
      setze(i)
      sende(wurzel, 'feature-accordion-change', { index: i, previousIndex: davor })
    }
    setze(aktiv)

    const spalteScrollt = () => {
      const oy = ansicht.getComputedStyle(rechts).overflowY
      return (oy === 'auto' || oy === 'scroll') && rechts.scrollHeight > rechts.clientHeight
    }

    let ruht = false
    let uhr = 0
    const ruheBis = () => {
      ansicht.clearTimeout(uhr)
      uhr = ansicht.setTimeout(() => { ruht = false }, 150)
    }
    let laeuft = false
    rechts.addEventListener('scroll', () => {
      if (ruht) { ruheBis(); return }
      if (laeuft) return
      laeuft = true
      ansicht.requestAnimationFrame(() => {
        laeuft = false
        const oben = rechts.getBoundingClientRect().top + TOLERANZ
        let treffer = 0
        paare.forEach((p, i) => { if (p.kapitel.getBoundingClientRect().top - oben <= 0) treffer = i })
        markiere(treffer)
      })
    }, { signal, passive: true })

    wurzel.addEventListener('click', (e) => {
      const link = /** @type {HTMLElement} */ (e.target).closest?.('.nc-feature-accordeon__link')
      const i = paare.findIndex((p) => p.link === link)
      if (i < 0) return
      const { kapitel } = paare[i]
      markiere(i)
      ruht = true
      ruheBis()
      const verhalten = ansicht.matchMedia?.('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
      if (spalteScrollt()) {
        const top = kapitel.getBoundingClientRect().top - rechts.getBoundingClientRect().top + rechts.scrollTop
        if (typeof rechts.scrollTo === 'function') rechts.scrollTo({ top, behavior: verhalten })
        else rechts.scrollTop = top
      } else if (typeof kapitel.scrollIntoView === 'function') {
        kapitel.scrollIntoView({ block: 'start', behavior: verhalten })
      }
      if (!kapitel.hasAttribute('tabindex')) { kapitel.setAttribute('tabindex', '-1'); eigenerTabindex.add(kapitel) }
      kapitel.focus({ preventScroll: true })
    }, { signal })

    signal.addEventListener('abort', () => {
      ansicht.clearTimeout(uhr)
      for (const [l, v] of vorher) {
        l.classList.toggle('is-active', v.aktiv)
        if (v.current === null) l.removeAttribute('aria-current')
        else l.setAttribute('aria-current', v.current)
      }
      for (const k of eigenerTabindex) k.removeAttribute('tabindex')
    })
  }
}
