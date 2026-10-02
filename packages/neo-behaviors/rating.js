// @ts-check
// ==========================================================================
// Rating — nach data/rating-recipe.json (keyboard, events)
// ==========================================================================
// Interaktiv (role="radiogroup"): je Stern ein verstecktes Radio
// (.nc-rating__input) mit <label class="nc-rating__item">, davor das
// Null-Radio (.nc-rating__input--clear). Klick auf einen Stern waehlt
// nativ; das Behavior faerbt danach bis zum Wert ein (__item--active),
// setzt bei --sentiment die Stufe (--sentiment-low/-mid/-high) und die
// Zahl in __value. Die Hover-Vorschau (Kaskade bis zum Stern unter der
// Maus) macht das CSS des DS, hier ist nichts zu tun.
//
// Tastatur (einheitlich, auch wo Browser Radios anders fuehren): rechts/hoch
// erhoehen, links/runter verringern (bis 0 = Null-Radio), Pos1 = 1, Ende =
// hoechster Wert. Der Reset-Knopf (.nc-rating__clear) setzt auf 0.
// Readonly (role="img") und gesperrte Felder: nichts zu tun.
//
// Ereignis `rating-change` { value, previousValue } (Zahlen).
// ==========================================================================
import { sende, gesperrt } from './kern.js'

const STUFE = ['nc-rating--sentiment-low', 'nc-rating--sentiment-mid', 'nc-rating--sentiment-high']

function stufe (wert) {
  if (wert <= 2) return STUFE[0]
  if (wert < 4) return STUFE[1]
  return STUFE[2]
}

export const rating = {
  id: 'rating',
  selektor: '.nc-rating',
  binde (wurzel, signal) {
    const radios = () => /** @type {HTMLInputElement[]} */ ([...wurzel.querySelectorAll('input.nc-rating__input[type="radio"]')])
    if (!radios().length) return // readonly
    const sterne = () => radios().filter((r) => !r.classList.contains('nc-rating__input--clear')).sort((a, b) => Number(a.value) - Number(b.value))
    const nullRadio = () => radios().find((r) => r.classList.contains('nc-rating__input--clear') || r.value === '0') || null
    const labelVon = (r) => /** @type {HTMLElement|null} */ (r.id ? wurzel.querySelector(`label[for="${CSS.escape(r.id)}"]`) : null) || (r.nextElementSibling?.classList.contains('nc-rating__item') ? /** @type {HTMLElement} */ (r.nextElementSibling) : null)
    const aktuellerWert = () => Number(radios().find((r) => r.checked)?.value || 0)
    let wert = aktuellerWert()

    const zeige = () => {
      const neu = aktuellerWert()
      for (const r of sterne()) labelVon(r)?.classList.toggle('nc-rating__item--active', Number(r.value) <= neu)
      if (wurzel.classList.contains('nc-rating--sentiment')) {
        wurzel.classList.remove(...STUFE)
        if (neu > 0) wurzel.classList.add(stufe(neu))
      }
      const zahl = wurzel.querySelector('.nc-rating__value')
      if (zahl) zahl.textContent = neu.toFixed(1).replace('.', ',')
      if (neu !== wert) {
        const vorher = wert
        wert = neu
        sende(wurzel, 'rating-change', { value: neu, previousValue: vorher })
      }
    }

    const setze = (ziel) => {
      if (!ziel || ziel.disabled) return
      ziel.checked = true
      ziel.focus()
      zeige()
    }

    wurzel.addEventListener('change', zeige, { signal })

    wurzel.addEventListener('keydown', (e) => {
      const feld = /** @type {HTMLElement} */ (e.target)
      if (!(feld instanceof HTMLInputElement) || !feld.classList.contains('nc-rating__input') || gesperrt(feld)) return
      const liste = sterne()
      const jetzt = aktuellerWert()
      const index = liste.findIndex((r) => Number(r.value) === jetzt) // -1 = 0 Sterne
      let ziel = /** @type {HTMLInputElement|null|undefined} */ (undefined)
      if (e.key === 'ArrowRight' || e.key === 'ArrowUp') ziel = liste[Math.min(index + 1, liste.length - 1)]
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') ziel = index <= 0 ? nullRadio() : liste[index - 1]
      else if (e.key === 'Home') ziel = liste[0]
      else if (e.key === 'End') ziel = liste.at(-1)
      if (ziel === undefined) return
      e.preventDefault()
      setze(ziel)
    }, { signal })

    wurzel.addEventListener('click', (e) => {
      const knopf = /** @type {HTMLElement} */ (e.target).closest('.nc-rating__clear')
      if (!knopf || gesperrt(knopf)) return
      e.preventDefault()
      setze(nullRadio())
    }, { signal })

    zeige()
  }
}
