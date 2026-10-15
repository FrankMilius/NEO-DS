// @ts-check
// ==========================================================================
// Suche der Sidebar (Befund UX-12, Usability-Audit 15.10.2026)
// ==========================================================================
// Vorher hieß das Feld „Search tokens…“, verglich aber nur die Namen der
// Bereiche: „primary“, „radius“ oder „Farbe“ ergaben eine leere Sidebar ohne
// Hinweis. Jetzt durchsucht es je Bereich
//   - Namen und Kennung (Button, button),
//   - die Tokens des Bereichs (--nc-button-…, --fnd-radius-…, Farbrollen),
//   - deutsche Begriffe (Farbe → Color, Knopf → Button, Abstand → Spacing).
// suchTreffer() liefert für einen Bereich null (kein Treffer) oder den Grund.
// ==========================================================================

import { componentTokenGroups, foundationTokens, semanticDefaults } from '../data/tokens.js'

/** Foundation-Bereich → Kategorien in foundationTokens */
const FOUNDATION_KATEGORIEN = {
  spacing: ['spacing'],
  sizes: ['size'],
  typography: ['typography', 'tracking'],
  radius: ['radius'],
  border: ['border'],
  focus: ['focus'],
  media: ['media'],
  shadows: ['shadow', 'elevation'],
  'opacity-zindex-motion': ['opacity', 'zindex', 'motion']
}

/** Deutsche Begriffe → Kennungen der Bereiche */
const BEGRIFFE = {
  farbe: ['colors'], farben: ['colors'], farbrolle: ['colors'],
  schrift: ['typography'], schriften: ['typography'], typografie: ['typography'], schriftart: ['typography'],
  abstand: ['spacing'], abstände: ['spacing'], 'außenabstand': ['spacing'], innenabstand: ['spacing'],
  größe: ['sizes'], größen: ['sizes'],
  ecke: ['radius'], ecken: ['radius'], rundung: ['radius'],
  rahmen: ['border'], linie: ['border'], kontur: ['border'],
  fokus: ['focus'], fokusring: ['focus'],
  schatten: ['shadows'], höhe: ['shadows'],
  deckkraft: ['opacity-zindex-motion'], transparenz: ['opacity-zindex-motion'], ebene: ['opacity-zindex-motion'], bewegung: ['opacity-zindex-motion'], animation: ['opacity-zindex-motion'],
  seitenverhältnis: ['media', 'aspect-ratio'], bild: ['media'],
  symbol: ['icons', 'icon'], symbole: ['icons', 'icon'],
  knopf: ['button'], schaltfläche: ['button'],
  karte: ['card'], kachel: ['card'],
  eingabe: ['input'], eingabefeld: ['input'], feld: ['input', 'form-field'], formular: ['form'],
  auswahl: ['select'], kontrollkästchen: ['checkbox'], optionsfeld: ['radio'], schalter: ['switch'],
  fenster: ['modal'], dialogfenster: ['modal'],
  menü: ['navigation-menu', 'dropdown-menu'],
  tabelle: ['data-table', 'compare-table'],
  hinweis: ['alert', 'notification'], meldung: ['alert', 'toast', 'notification'],
  fortschritt: ['progress'], reiter: ['tabs'], kopfzeile: ['header'], fußzeile: ['footer'],
  akkordeon: ['accordion'], brotkrumen: ['breadcrumb'], seitenzahlen: ['pagination']
}

let _index = null
/** Je Bereich-Kennung die durchsuchbaren Token-Namen (einmal gebaut) */
function tokenIndex () {
  if (_index) return _index
  _index = new Map()
  for (const g of componentTokenGroups || []) {
    _index.set(g.id, (g.tokens || []).map(t => `--${t.id}`))
  }
  for (const [bereich, kategorien] of Object.entries(FOUNDATION_KATEGORIEN)) {
    const namen = []
    for (const k of kategorien) {
      for (const [key, t] of Object.entries(foundationTokens?.[k]?.tokens || {})) {
        namen.push(t?.cssVar || `--fnd-${k}-${key}`)
      }
    }
    _index.set(bereich, namen)
  }
  const farben = Object.keys(semanticDefaults?.['neo-light'] || {})
  _index.set('colors', farben.map(k => `--fnd-color-${k}`))
  return _index
}

/**
 * Trifft die Suche diesen Bereich?
 * @param {{ id: string, label: string }} item
 * @param {string} anfrage
 * @returns {null | { grund: string | null }}  grund: warum (null = Name passt)
 */
export function suchTreffer (item, anfrage) {
  const q = String(anfrage || '').trim().toLowerCase()
  if (!q) return { grund: null }
  if (item.label.toLowerCase().includes(q) || item.id.toLowerCase().includes(q)) return { grund: null }
  for (const [begriff, ids] of Object.entries(BEGRIFFE)) {
    if (begriff.startsWith(q) && q.length >= 3 && ids.includes(item.id)) return { grund: `Begriff „${begriff}“` }
  }
  if (q.length < 2) return null
  const token = (tokenIndex().get(item.id) || []).find(n => n.toLowerCase().includes(q))
  return token ? { grund: `Token ${token}` } : null
}
