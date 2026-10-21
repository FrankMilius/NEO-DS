// Pixelvergleich der Prüfwerkzeuge (E3, 21.10.2026) — ohne Zusatzpaket.
// Chromium dekodiert beide PNGs und zeichnet sie in Streifen auf ein Canvas
// (Canvas-Grenze ~32 767 px Höhe; ganze Seiten werden länger). Gezählt werden
// Pixel mit Graudifferenz > schwelle, wie im bisherigen Python-Auswerter.
// Ungleiche Größe: die nicht gemeinsame Fläche zählt vollständig als abweichend.

const STREIFEN = 4096

async function imBrowser ({ a, b, schwelle, streifen }) {
  const lade = async (b64) => createImageBitmap(await (await fetch(`data:image/png;base64,${b64}`)).blob())
  const [ia, ib] = await Promise.all([lade(a), lade(b)])
  const w = Math.min(ia.width, ib.width)
  const h = Math.min(ia.height, ib.height)
  const ca = new OffscreenCanvas(w, streifen).getContext('2d', { willReadFrequently: true })
  const cb = new OffscreenCanvas(w, streifen).getContext('2d', { willReadFrequently: true })
  let abweichend = 0
  for (let y = 0; y < h; y += streifen) {
    const sh = Math.min(streifen, h - y)
    ca.clearRect(0, 0, w, streifen); cb.clearRect(0, 0, w, streifen)
    ca.drawImage(ia, 0, y, w, sh, 0, 0, w, sh)
    cb.drawImage(ib, 0, y, w, sh, 0, 0, w, sh)
    const da = ca.getImageData(0, 0, w, sh).data
    const db = cb.getImageData(0, 0, w, sh).data
    for (let i = 0; i < da.length; i += 4) {
      const ga = 0.299 * da[i] + 0.587 * da[i + 1] + 0.114 * da[i + 2]
      const gb = 0.299 * db[i] + 0.587 * db[i + 1] + 0.114 * db[i + 2]
      if (Math.abs(ga - gb) > schwelle) abweichend++
    }
  }
  const gemeinsam = w * h
  abweichend += ia.width * ia.height + ib.width * ib.height - 2 * gemeinsam
  return { gleicheGroesse: ia.width === ib.width && ia.height === ib.height, abweichend, breite: ib.width, hoehe: ib.height }
}

export class Vergleicher {
  /** Eigene leere Seite im übergebenen Browser. */
  static async starte (browser) {
    const v = new Vergleicher()
    v.seite = await browser.newPage()
    return v
  }

  /** PNG-Puffer a gegen b → { gleicheGroesse, abweichend, breite, hoehe } (Größe von b). */
  async vergleiche (a, b, { schwelle = 8 } = {}) {
    return this.seite.evaluate(imBrowser, { a: a.toString('base64'), b: b.toString('base64'), schwelle, streifen: STREIFEN })
  }

  async schliesse () { await this.seite.close() }
}
