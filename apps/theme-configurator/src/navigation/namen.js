// @ts-check
/**
 * @file
 * Eine Quelle für alle Bereichs- und Komponentennamen (Block 5e, 19.10.2026;
 * Befunde UX-52, UX-53, UX-56; Begriffe nach BEGRIFFE.md).
 *
 * Seitenleiste (navigation-builder.js), Breadcrumb der Bühne und Kopf der
 * Einstellungen (sektionen.js, InspectorPanel) und der Seitentitel lesen
 * hier. Vorher hatte jede Stelle ihre eigene Schreibweise: „Radii“ in der
 * Seitenleiste, „Border Radius“ im Kopf, drei Namen für Schatten.
 */

/** Foundation-Bereiche: Sektions-ID → Name und Kurzbeschreibung (Info-Knopf) */
export const BEREICHE = Object.freeze({
  'foundation-grid': { name: 'Raster', info: 'Spaltenzahl, Abstände zwischen den Spalten und Breakpoints des Seitenrasters.' },
  'foundation-colors': { name: 'Farben', info: 'Grundfarben (Paletten) und Farbrollen für Hell und Dunkel.' },
  'foundation-surfaces': { name: 'Flächen', info: 'Flächen 01 bis 03 für Hell und Dunkel: Ebenen, die Inhalte voneinander abheben.' },
  'foundation-spacing': { name: 'Abstände', info: 'Abstandsskala auf Basis von 4 px; ab Stufe 06 fluid.' },
  'foundation-size': { name: 'Größen', info: 'Größenskala für Bedienelemente und Touch-Ziele.' },
  'foundation-typography': { name: 'Typografie', info: 'Schriften, Schriftstärken und Schriftgrößen.' },
  'foundation-radius': { name: 'Eckenradien', info: 'Skala der Eckenradien von eckig bis rund.' },
  'foundation-border': { name: 'Rahmen', info: 'Rahmenbreiten und Rahmenstile.' },
  'foundation-focus': { name: 'Fokusring', info: 'Farbe, Breite, Abstand und Stil des Fokusrings.' },
  'foundation-media': { name: 'Seitenverhältnisse', info: 'Seitenverhältnisse für Bilder, Videos und eingebettete Inhalte.' },
  'foundation-elements': { name: 'HTML-Elemente', info: 'Grundstile von Text, Überschriften, Links, Knöpfen und Formularen.' },
  'foundation-icons': { name: 'Icons', info: 'Icon-Bibliotheken, Strichstärke und Größen.' },
  'foundation-themes': { name: 'Themes', info: 'Die vier Kombinationen aus Variante (NEO · Kunde) und Modus (Hell · Dunkel).' },
  'foundation-shadows': { name: 'Schatten', info: 'Schattenstufen und ihre Zuordnung zu Ebenen.' },
  'foundation-opacity': { name: 'Deckkraft, Ebenen und Bewegung', info: 'Deckkraft, Stapelebenen und Bewegung (Dauer und Kurven).' },
  'foundation-praesentation': { name: 'Präsentation', info: 'Folien-Grammatik: Welten, Grünfamilie, Statusampel, Diagrammfarben und Dichtestufen für PowerPoint und Figma Slides.' },
  // Nicht in der Navigation, aber aus älteren Ständen erreichbar
  'foundation-motion': { name: 'Bewegung', info: 'Bewegungskurven und Dauer.' },
})

/** Ebenen der Seitenleiste (Entscheidung E4) */
export const EBENEN = Object.freeze({
  foundation: 'Grundlagen',
  objects: 'Objekte',
  atoms: 'Atome',
  molecules: 'Moleküle',
  organisms: 'Organismen',
  patterns: 'Muster',
  templates: 'Seitenvorlagen',
  utilities: 'Hilfsklassen',
})

/** Untergruppen der Komponenten (Gruppennamen sind keine Komponentennamen → deutsch) */
export const UNTERGRUPPEN = Object.freeze({
  Actions: 'Aktionen',
  Content: 'Inhalte',
  Controls: 'Bedienelemente',
  'Data Display': 'Datenanzeige',
  Feedback: 'Rückmeldung',
  'Form Inputs': 'Formularfelder',
  'Form Structure': 'Formularaufbau',
  Layout: 'Layout',
  'Loading & Progress': 'Laden und Fortschritt',
  Navigation: 'Navigation',
  'Search & Toolbar': 'Suche und Werkzeugleiste',
  'Typography & Layout': 'Text und Layout',
})

// Kürzel in Kennungen → ausgeschrieben (Entscheidung E5: englische Namen wie
// im Design System, aber ohne Kürzel). Akronyme bleiben in Großbuchstaben.
const WOERTER = Object.freeze({
  tbl: 'Table',
  nav: 'Navigation',
  kbd: 'Keyboard Key',
  otp: 'OTP',
  cta: 'CTA',
  faq: 'FAQ',
  tom: 'TOM',
  tmob: 'TMOB',
  bg: 'Background',
})

/**
 * Anzeigename einer Komponente aus ihrer Kennung:
 * tbl-cell → „Table Cell“, text-cta → „Text CTA“, link-with-arrow → „Link with Arrow“.
 * @param {string} id
 */
export function komponentenName (id) {
  return String(id || '')
    .split('-')
    .filter(Boolean)
    .map((w, i) => WOERTER[w] ?? (i > 0 && w === 'with' ? 'with' : w.charAt(0).toUpperCase() + w.slice(1)))
    .join(' ')
}

/**
 * Name eines Bereichs für Breadcrumb, Kopf der Einstellungen und Seitentitel.
 * @param {string} sektionId
 */
export function bereichsName (sektionId) {
  const id = String(sektionId || '')
  if (BEREICHE[id]) return BEREICHE[id].name
  if (id === 'template-content-templates') return 'Seitenvorlagen'
  const m = id.match(/^(component|template|module|utility)-(.+)$/)
  return m ? komponentenName(m[2]) : ''
}

/** Seitentitel des Browsers (WCAG 2.4.2, Befund UX-56) */
export function seitenTitel (sektionId) {
  const name = bereichsName(sektionId)
  return name ? `${name} – Theme-Konfigurator` : 'Theme-Konfigurator'
}
