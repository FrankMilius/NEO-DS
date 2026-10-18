// @ts-check
// ==========================================================================
// Fehlermeldung am Eingabefeld (Befund UX-03, 15.10.2026)
// ==========================================================================
// Der Store lehnt ungültige Werte ab (token-pruefung.js). Damit das sichtbar
// wird, ohne jeden der vielen Editoren umzubauen, markiert diese Stelle das
// Feld, in dem gerade eingegeben wurde (document.activeElement):
//   - aria-invalid="true" und eine Meldung direkt darunter (role="alert",
//     über aria-describedby verknüpft — Screenreader lesen sie vor),
//   - der letzte gültige Wert steht wieder im Feld.
// Die nächste gültige Eingabe in diesem Feld entfernt die Meldung.
// Ohne fokussiertes Feld (z. B. programmatische Aufrufe) bleibt es bei der
// Ablehnung und einer Konsolenwarnung.
// ==========================================================================

const KLASSE = 'feld-meldung'
let zaehler = 0

function stilEinmal () {
  if (typeof document === 'undefined' || document.getElementById('feld-meldung-stil')) return
  const s = document.createElement('style')
  s.id = 'feld-meldung-stil'
  s.textContent = `.${KLASSE}{display:block;margin:4px 0 0;font-size:12px;line-height:1.4;color:var(--cfg-danger,#b4232a);font-weight:600;white-space:normal}
[aria-invalid="true"]:not([type=checkbox]){border-color:var(--cfg-danger,#b4232a)!important;outline-color:var(--cfg-danger,#b4232a)}`
  document.head.appendChild(s)
}

/**
 * Aktuelles Eingabefeld oder null
 * @returns {HTMLInputElement|null}
 */
function feld (vorgabe = null) {
  if (vorgabe) return /** @type {HTMLInputElement} */ (vorgabe)
  if (typeof document === 'undefined') return null
  const el = document.activeElement
  return el && /^(INPUT|SELECT|TEXTAREA)$/.test(el.tagName) ? /** @type {HTMLInputElement} */ (el) : null
}

/**
 * Ungültige Eingabe melden.
 * @param {string} text  Meldung für das Feld
 * @param {unknown} [letzterWert]  gültiger Wert, der wieder ins Feld kommt
 * @param {Element|null} [element]  Feld (sonst das fokussierte), z. B. bei blur/change
 */
export function meldeUngueltig (text, letzterWert, element = null) {
  const el = feld(/** @type {HTMLInputElement|null} */ (element))
  if (!el) { console.warn('[Eingabe abgelehnt]', text); return }
  stilEinmal()
  el.setAttribute('aria-invalid', 'true')
  let meldung = el.dataset.feldMeldung ? document.getElementById(el.dataset.feldMeldung) : null
  if (!meldung) {
    meldung = document.createElement('span')
    meldung.id = `feld-meldung-${++zaehler}`
    meldung.className = KLASSE
    meldung.setAttribute('role', 'alert')
    el.insertAdjacentElement('afterend', meldung)
    el.dataset.feldMeldung = meldung.id
    const alt = el.getAttribute('aria-describedby')
    el.setAttribute('aria-describedby', alt ? `${alt} ${meldung.id}` : meldung.id)
  }
  meldung.textContent = text
  if (letzterWert !== undefined && letzterWert !== null && el.type !== 'file') {
    el.value = String(letzterWert)
  }
}

/** Gültige Eingabe: Markierung und Meldung am aktuellen (oder übergebenen) Feld entfernen. */
export function meldeGueltig (element = null) {
  const el = feld(/** @type {HTMLInputElement|null} */ (element))
  if (!el || !el.dataset.feldMeldung) return
  document.getElementById(el.dataset.feldMeldung)?.remove()
  const rest = (el.getAttribute('aria-describedby') || '').split(/\s+/).filter(x => x && x !== el.dataset.feldMeldung).join(' ')
  if (rest) el.setAttribute('aria-describedby', rest); else el.removeAttribute('aria-describedby')
  el.removeAttribute('aria-invalid')
  delete el.dataset.feldMeldung
}
