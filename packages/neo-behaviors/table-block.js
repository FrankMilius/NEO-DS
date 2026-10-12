// @ts-check
// ==========================================================================
// Tabellen-Block — nach data/table-block-recipe.json (keyboard, events)
// ==========================================================================
// Website-Bauteil (Plan v4, Phase 5, 12.10.2026). Die Tabelle rendert neo_fe
// serverseitig (Twig, Preprocess _neo_fe_tbl_aufbereiten); bis dahin baute
// Drupal.behaviors.neoTable (neo_fe/js/neo-theme.js) sie aus dem JSON und
// hing dieses Verhalten an. Hier bleibt nur, was ein Dokument allein nicht
// kann:
//
//   Scroll-Grenze  data-scroll-bp (px) an der Wurzel: Fenster schmaler als
//                  die Grenze → data-scroll-active="true" (das DS schaltet
//                  die Tabelle auf max-content, die erste Spalte bricht um),
//                  sonst "false"; ohne/0 immer "false".
//   Scroll-Region  laeuft die Wurzel tatsaechlich waagerecht ueber
//                  (scrollWidth > clientWidth + 1), wird sie per Tastatur
//                  erreichbar und benannt: role="region", aria-label (Titel
//                  des Blockkopfs .nc-section-header__title der Section,
//                  sonst data-scroll-label, sonst „Tabelle"/„Table" nach
//                  lang) und tabindex="0" (WCAG 2.1.1; Chrome macht
//                  Scroller selbst fokussierbar, Safari/Firefox nicht). Ohne
//                  Ueberlauf nichts davon — kein leerer Tab-Halt, keine
//                  ueberzaehlige Landmarke.
//   Schatten       .is-scrolled, solange scrollLeft > 5 (die feste erste
//                  Spalte zeigt dann ihren Schatten).
//   Messen         beim Binden sofort, danach gedrosselt (ein Durchlauf je
//                  Bild, requestAnimationFrame): ResizeObserver an Wurzel und
//                  Tabelle (Webfont, Inhalt) und Fenster-resize (die Grenze
//                  haengt am Fenster, nicht am Block — der Block ist auf
//                  1440 px begrenzt). neoTable lauschte ungedrosselt.
//
// Abbinden nimmt alles zurueck, was das Behavior gesetzt hat.
//
// Ereignis: `table-block-change` { scrollActive, overflow } — wenn sich
// Scroll-Modus oder Ueberlauf nach dem Binden aendern.
// ==========================================================================
import { sende } from './kern.js'

export const TABELLE_TEXTE = {
  de: { region: 'Tabelle' },
  en: { region: 'Table' }
}

const tabellenUmgebung = /** @type {any} */ (globalThis)

/** Sprache am naechsten [lang] (wie gallery.js spracheVon; eigene Kopie, damit
 * das Bundle die uebrigen Module nicht umsortiert) @param {Element} el */
const tabellenSprache = (el) => {
  const lang = (el.closest('[lang]')?.getAttribute('lang') || '').trim().toLowerCase()
  return !lang || lang === 'de' || lang.startsWith('de-') ? 'de' : 'en'
}

export const tableBlock = {
  id: 'table-block',
  selektor: '.nc-table-block',
  // Website-Bauteil: in Drupal nur per drupalSettings.neoBehaviors.nur
  nurAusdruecklich: true,
  /** @param {HTMLElement} wurzel @param {AbortSignal} signal */
  binde (wurzel, signal) {
    const ansicht = wurzel.ownerDocument.defaultView
    const tabelle = wurzel.querySelector('table')
    const vorher = {
      scrollActive: wurzel.getAttribute('data-scroll-active'),
      role: wurzel.getAttribute('role'),
      ariaLabel: wurzel.getAttribute('aria-label'),
      tabindex: wurzel.getAttribute('tabindex')
    }
    // Eine Region, die schon im Markup steht, bleibt (nur eigene zuruecknehmen)
    const regionImMarkup = vorher.role === 'region'
    const grenze = parseInt(wurzel.dataset.scrollBp || '', 10) || 0

    const name = () => {
      const titel = wurzel.closest('.nc-section')?.querySelector('.nc-section-header__title')
      return titel?.textContent?.replace(/\s+/g, ' ').trim() || wurzel.dataset.scrollLabel || TABELLE_TEXTE[tabellenSprache(wurzel)].region
    }

    /** @type {{ scrollActive: boolean, overflow: boolean } | null} */
    let stand = null
    let region = false

    const pruefe = () => {
      const scrollActive = grenze > 0 && (ansicht?.innerWidth ?? Infinity) < grenze
      wurzel.setAttribute('data-scroll-active', String(scrollActive))
      // nach dem Umschalten messen: data-scroll-active aendert die Breite
      const overflow = wurzel.scrollWidth > wurzel.clientWidth + 1
      if (overflow && !regionImMarkup) {
        wurzel.setAttribute('role', 'region')
        wurzel.setAttribute('aria-label', name())
        wurzel.setAttribute('tabindex', '0')
        region = true
      } else if (!overflow && region) {
        wurzel.removeAttribute('role')
        wurzel.removeAttribute('aria-label')
        wurzel.removeAttribute('tabindex')
        region = false
      }
      const neu = { scrollActive, overflow }
      const geaendert = stand && (stand.scrollActive !== scrollActive || stand.overflow !== overflow)
      stand = neu
      if (geaendert) sende(wurzel, 'table-block-change', neu)
    }

    // Drosseln: hoechstens ein Durchlauf je Bild
    const bild = typeof tabellenUmgebung.requestAnimationFrame === 'function'
      ? (/** @type {() => void} */ f) => tabellenUmgebung.requestAnimationFrame(f)
      : (/** @type {() => void} */ f) => tabellenUmgebung.setTimeout(f, 16)
    const storniere = typeof tabellenUmgebung.cancelAnimationFrame === 'function'
      ? (/** @type {number} */ n) => tabellenUmgebung.cancelAnimationFrame(n)
      : (/** @type {number} */ n) => tabellenUmgebung.clearTimeout(n)
    let geplant = 0
    const planen = () => {
      if (geplant) return
      geplant = bild(() => { geplant = 0; pruefe() })
    }

    pruefe()
    ansicht?.addEventListener('resize', planen, { signal })
    /** @type {ResizeObserver|null} */
    let beobachter = null
    if (typeof tabellenUmgebung.ResizeObserver === 'function') {
      beobachter = new tabellenUmgebung.ResizeObserver(planen)
      beobachter?.observe(wurzel)
      if (tabelle) beobachter?.observe(tabelle)
    }

    wurzel.addEventListener('scroll', () => {
      wurzel.classList.toggle('is-scrolled', wurzel.scrollLeft > 5)
    }, { passive: true, signal })

    signal.addEventListener('abort', () => {
      if (geplant) storniere(geplant)
      geplant = 0
      beobachter?.disconnect()
      wurzel.classList.remove('is-scrolled')
      if (vorher.scrollActive === null) wurzel.removeAttribute('data-scroll-active')
      else wurzel.setAttribute('data-scroll-active', vorher.scrollActive)
      if (region) {
        for (const [attr, wert] of /** @type {Array<[string, string|null]>} */ ([['role', vorher.role], ['aria-label', vorher.ariaLabel], ['tabindex', vorher.tabindex]])) {
          if (wert === null) wurzel.removeAttribute(attr)
          else wurzel.setAttribute(attr, wert)
        }
      }
    })
  }
}
