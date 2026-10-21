// Messung je Seite für den Pixelvergleich (E3, 21.10.2026).
// nimmAuf() liefert einen Durchgang { a, b, c } (vorher, nachher, Kontrolle),
// vergleiche(x, y) die Zahl abweichender Pixel. Unter Last malt Chromium große
// Bilder gelegentlich als leere Fläche — einzeln nicht nachstellbar. Eine
// auffällige Seite wird deshalb einmal frisch wiederholt; gilt der zweite
// Durchgang. Ein echter Unterschied bleibt, ein Zeichenfehler verschwindet.

async function durchgang (nimmAuf, vergleiche) {
  const bilder = await nimmAuf()
  return { ab: await vergleiche(bilder.a, bilder.b), ac: await vergleiche(bilder.a, bilder.c), bilder }
}

export async function messeSeite ({ nimmAuf, vergleiche }) {
  const erst = await durchgang(nimmAuf, vergleiche)
  if (!erst.ab && !erst.ac) return { ...erst, wiederholt: false }
  return { ...(await durchgang(nimmAuf, vergleiche)), wiederholt: true }
}
