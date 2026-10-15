// @ts-check
// ==========================================================================
// Google-Schriften prüfen (Befund UX-14, Usability-Audit 15.10.2026)
// ==========================================================================
// Vorher wurde eine Schrift ohne passende Adresse angenommen: Die Website
// lud sie nie und fiel still auf die Ersatzschrift zurück, während der
// Konfigurator sie zeigte (weil er sie selbst geladen hatte). Jetzt:
//   - Ohne Adresse baut die App sie aus der ersten Schrift des Font-Stacks.
//   - Adresse und Font-Stack müssen dieselbe Familie nennen.
//   - Nach dem Laden prüft die App, ob Google die Familie wirklich liefert,
//     und markiert die Schrift sonst als „nicht ladbar“.
// ==========================================================================

/** Erste Familie eines Font-Stacks, ohne Anführungszeichen */
export function ersteFamilie (stack) {
  return String(stack || '').split(',')[0].trim().replace(/^['"]|['"]$/g, '')
}

/**
 * Familiennamen aus einer Google-Fonts-Adresse (css und css2, auch mehrere).
 * @param {string} url
 * @returns {string[]}
 */
export function familienAusUrl (url) {
  let u
  try { u = new URL(String(url || '').trim()) } catch { return [] }
  const roh = u.searchParams.getAll('family')
  // css (v1) erlaubt mehrere Familien mit „|“ in einem Parameter
  return roh.flatMap(f => f.split('|')).map(f => f.split(':')[0].replace(/\+/g, ' ').trim()).filter(Boolean)
}

/**
 * Adresse für eine Familie bauen. Ohne Achsenangabe liefert Google nur die
 * Stärke 400 — das gibt es für jede Familie, andere Stärken nicht immer.
 * @param {string} familie
 */
export function baueGoogleUrl (familie) {
  const name = String(familie || '').trim().replace(/\s+/g, '+')
  return `https://fonts.googleapis.com/css2?family=${encodeURIComponent(name).replace(/%2B/g, '+')}&display=swap`
}

/**
 * Passen Adresse und Font-Stack zusammen?
 * @param {string} stack @param {string} url
 * @returns {string|null}  Meldung oder null
 */
export function pruefeFamilieZurUrl (stack, url) {
  const familien = familienAusUrl(url)
  const erste = ersteFamilie(stack)
  if (!url || !erste) return null
  if (!familien.length) return 'Die Adresse nennt keine Schrift (Parameter family=…).'
  const gleich = (a, b) => a.toLowerCase() === b.toLowerCase()
  if (familien.some(f => gleich(f, erste))) return null
  return `Die Adresse lädt „${familien.join('“, „')}“, der Font-Stack beginnt aber mit „${erste}“. Beide müssen dieselbe Schrift nennen.`
}

/**
 * Lädt Google die Familie wirklich? Wartet auf das Stylesheet und fragt dann
 * document.fonts. Ohne Browser-Schnittstellen (Tests): 'unbekannt'.
 * @param {HTMLLinkElement} link @param {string} familie
 * @returns {Promise<'ok'|'fehler'|'unbekannt'>}
 */
export function pruefeLadbarkeit (link, familie) {
  return new Promise((fertig) => {
    let erledigt = false
    const ende = (/** @type {'ok'|'fehler'|'unbekannt'} */ e) => { if (!erledigt) { erledigt = true; fertig(e) } }
    link.addEventListener('error', () => ende('fehler'), { once: true })
    link.addEventListener('load', () => {
      const fonts = typeof document !== 'undefined' ? document.fonts : null
      if (!fonts?.load) return ende('unbekannt')
      fonts.load(`16px "${familie}"`).then(l => ende(l.length ? 'ok' : 'fehler'), () => ende('fehler'))
    }, { once: true })
  })
}
