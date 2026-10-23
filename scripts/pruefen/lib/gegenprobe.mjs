// Gegenprobe der Prüfwerkzeuge (E3, 21.10.2026), verallgemeinert aus
// gegenprobe.mjs der Sitzung „Phase 7 Block 1“ (dort fest: --font-ui → Mono,
// font-family). Eine Setzung wird auf :root und den vier Theme-Klassen
// erzwungen; je Bauteil zählt die Messung, bei wie vielen Elementen sich die
// Eigenschaft ändert. 0 von n = „wirkungslos“; 0 von 0 = „nicht geprüft“,
// weil das Bauteil auf keiner Seite vorkam.

export const BAUTEILE = ['.nc-button', '.nc-badge', '.nc-chip', '.nc-tag', '.nc-input', '.nc-select', '.nc-textarea', '.nc-breadcrumb', '.nc-pagination']

const THEMES = ':root,:where(.neo-light-theme,.neo-dark-theme,.customer-light-theme,.customer-dark-theme)'

/** CSS-Regel, die die Deklaration überall erzwingt. */
export function regel (deklaration) {
  const d = deklaration.trim().replace(/;$/, '').replace(/\s*!important$/, '')
  return `${THEMES}{${d} !important}`
}

/** Werte vorher/nachher je Element, Bauteil je Element → { bauteil: [n, geändert] }. */
export function zaehle (vor, nach, zuordnung) {
  const z = {}
  zuordnung.forEach((k, i) => {
    z[k] ??= [0, 0]
    z[k][0]++
    if (vor[i] !== nach[i]) z[k][1]++
  })
  return z
}

/** Ergebnisse aller Seiten zusammenzählen; jedes Bauteil erscheint, auch ohne Vorkommen. */
export function summiere (seiten, bauteile) {
  const s = Object.fromEntries(bauteile.map((b) => [b, [0, 0]]))
  for (const z of seiten) for (const [k, [n, g]] of Object.entries(z)) { s[k][0] += n; s[k][1] += g }
  return s
}

export function urteil ([n, geaendert]) {
  if (n === 0) return 'nicht geprüft'
  return geaendert ? 'wirkt' : 'wirkungslos'
}

export function bericht (summe) {
  const breite = Math.max(8, ...Object.keys(summe).map((k) => k.length))
  const zeilen = [`${'Bauteil'.padEnd(breite)}  ${'Elemente'.padStart(8)}  ${'geändert'.padStart(8)}  Urteil`]
  for (const [k, z] of Object.entries(summe)) zeilen.push(`${k.padEnd(breite)}  ${String(z[0]).padStart(8)}  ${String(z[1]).padStart(8)}  ${urteil(z)}`)
  return zeilen.join('\n')
}

// Läuft in der Seite (page.evaluate) und muss deshalb für sich stehen.
// Jedes Element zählt beim ersten passenden Bauteil; die Setzung wird danach
// wieder entfernt, damit weitere Messungen auf derselben Seite sauber sind.
// Übergänge und Animationen sind während der Messung aus: Sonst liefert
// getComputedStyle direkt nach dem Setzen noch den alten Wert (E10, 22.10.2026).
function imBrowser ({ bauteile, eigenschaft, css }) {
  const still = document.createElement('style')
  still.textContent = '*,*::before,*::after{transition:none !important;animation:none !important}'
  document.head.append(still)
  const el = [...document.querySelectorAll(bauteile.join(','))]
  const zuordnung = el.map((e) => bauteile.find((b) => e.matches(b)))
  const vor = el.map((e) => getComputedStyle(e).getPropertyValue(eigenschaft))
  const st = document.createElement('style')
  st.textContent = css
  document.head.append(st)
  const nach = el.map((e) => getComputedStyle(e).getPropertyValue(eigenschaft))
  st.remove()
  still.remove()
  return { vor, nach, zuordnung }
}

/** Misst auf der geladenen Seite → { bauteil: [n, geändert] }. */
export async function messe (seite, { bauteile, eigenschaft, css }) {
  const { vor, nach, zuordnung } = await seite.evaluate(imBrowser, { bauteile, eigenschaft, css })
  return zaehle(vor, nach, zuordnung)
}
