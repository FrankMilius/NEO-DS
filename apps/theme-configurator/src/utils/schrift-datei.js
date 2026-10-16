// @ts-check
// Vorschlag für Familie, Gewicht und Stil aus dem Namen einer Schriftdatei
// (Testlauf 16.10.2026, E9): „Kundenschrift-BoldItalic.woff2“ → Kundenschrift, 700, kursiv.

/** @type {Array<[string, number]>} */
const GEWICHT_WOERTER = [['extralight', 200], ['ultralight', 200], ['semibold', 600], ['demibold', 600], ['extrabold', 800], ['ultrabold', 800], ['thin', 100], ['hairline', 100], ['light', 300], ['regular', 400], ['book', 400], ['normal', 400], ['medium', 500], ['bold', 700], ['black', 900], ['heavy', 900]]
/**
 * @param {string} name
 * @returns {{ familie: string, gewicht: number, stil: 'normal'|'italic' }}
 */
export function vorschlagAusDateiname (name) {
  const teile = String(name || '').replace(/\.[^.]+$/, '').split(/[-_ ]+/).filter(Boolean)
  let stil = /** @type {'normal'|'italic'} */ ('normal')
  let gewicht = 400
  // Von hinten: „Italic“, „BoldItalic“, „Light Italic“, „600“
  for (let n = 0; n < 2 && teile.length > 1; n++) {
    let wort = teile[teile.length - 1].toLowerCase()
    if (/italic|oblique/.test(wort)) { stil = 'italic'; wort = wort.replace(/italic|oblique/, '') }
    const treffer = GEWICHT_WOERTER.find(([w]) => wort === w)
    if (treffer) gewicht = treffer[1]
    else if (/^\d{3}$/.test(wort)) gewicht = Number(wort)
    else if (wort) break
    teile.pop()
  }
  return { familie: teile.join(' ').replace(/[^A-Za-z0-9 _-]/g, '').slice(0, 60), gewicht, stil }
}
