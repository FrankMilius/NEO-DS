// Medien einfärben (I12): Duoton per CSS — Graustufen, Schwarzpunkt, dann
// Multiplizieren mit einem Ton (Weiß wird zum Ton, Schwarz bleibt Schwarz).
//
// Schwarzpunkt bp: Helligkeit bp wird schwarz, 1 bleibt 1, dazwischen linear.
// CSS hat dafür keine eigene Funktion; brightness(h) und danach contrast(k)
// ergeben zusammen x ↦ (x·h − 0.5)·k + 0.5. Aus 0.3 ↦ 0 und 1 ↦ 1 folgt
//   k = 2·(1/(1−bp) − 0.5)   und   h = 1/((1−bp)·k).
// Der Vergleich läuft in Chromium, damit er die echte Filter- und Mischlogik
// misst, die später die Website rendert.

export function filterParameter (bp) {
  if (!Number.isFinite(bp) || bp < 0 || bp >= 1) {
    throw new Error(`Schwarzpunkt muss zwischen 0 und unter 1 liegen, nicht ${bp}`)
  }
  const kontrast = 2 * (1 / (1 - bp) - 0.5)
  const helligkeit = 1 / ((1 - bp) * kontrast)
  return { helligkeit, kontrast }
}

export function filterKette (bp) {
  const { helligkeit, kontrast } = filterParameter(bp)
  return `grayscale(1) brightness(${helligkeit}) contrast(${kontrast})`
}

// Mittlere absolute Abweichung je Farbkanal (R, G, B) zweier RGBA-Folgen
export function mittlereAbweichung (a, b) {
  if (a.length !== b.length || a.length % 4) throw new Error('Pixeldaten ungleich lang')
  const summe = [0, 0, 0]
  for (let i = 0; i < a.length; i += 4) {
    summe[0] += Math.abs(a[i] - b[i])
    summe[1] += Math.abs(a[i + 1] - b[i + 1])
    summe[2] += Math.abs(a[i + 2] - b[i + 2])
  }
  const n = a.length / 4
  return summe.map((s) => s / n)
}

// Rendert das Original eingefärbt als DOM (wie auf der Website), nimmt es
// verlustfrei als PNG auf und vergleicht es im Browser mit der Vorlage.
// original, vorlage: Daten-URLs. Ergebnis: { breite, hoehe, gleicheGroesse, abweichung: [r,g,b] | null }
export async function vergleicheMitVorlage (seite, { original, vorlage, ton, schwarzpunkt }) {
  const [breite, hoehe] = await masseVon(seite, original)
  await seite.setViewportSize({ width: breite, height: hoehe })
  await seite.setContent(`<style>
    html,body{margin:0;background:#fff}
    #f{display:inline-block;line-height:0;background-color:${ton};isolation:isolate}
    #f img{display:block;filter:${filterKette(schwarzpunkt)};mix-blend-mode:multiply}
  </style><div id="f"><img src="${original}" width="${breite}" height="${hoehe}" alt=""></div>`)
  return aufnehmenUndVergleichen(seite, vorlage)
}

// Wie oben, aber mit dem echten Stylesheet des Design Systems: Grid und Karte
// tragen data-medien-ton (Karte schlägt Grid). gridTon/karteTon: Wert oder null.
// Rundung und Rahmen der Karte werden abgeschaltet, damit nur das Bild zählt.
export async function vergleicheMitStylesheet (seite, { css, original, vorlage, gridTon = null, karteTon = null }) {
  const [breite, hoehe] = await masseVon(seite, original)
  const attr = (ton) => (ton ? ` data-medien-ton="${ton}"` : '')
  await seite.setViewportSize({ width: breite + 40, height: hoehe + 40 })
  await seite.setContent(`<style>${css}</style><style>
    html,body{margin:0;background:#fff}
    .nc-card-grid{display:block}
    .nc-card{border:0;border-radius:0;box-shadow:none}
  </style><div class="nc-card-grid"${attr(gridTon)}><article class="nc-card"${attr(karteTon)}>
    <div class="nc-card__media" id="f" style="width:${breite}px;height:${hoehe}px;aspect-ratio:auto">
      <img src="${original}" alt=""></div></article></div>`)
  return aufnehmenUndVergleichen(seite, vorlage)
}

async function masseVon (seite, src) {
  return seite.evaluate(async (s) => {
    const i = new Image(); i.src = s; await i.decode()
    return [i.naturalWidth, i.naturalHeight]
  }, src)
}

async function aufnehmenUndVergleichen (seite, vorlage) {
  await seite.locator('#f img').evaluate((i) => i.decode())
  const png = await seite.locator('#f').screenshot({ animations: 'disabled', scale: 'css' })
  const roh = `data:image/png;base64,${png.toString('base64')}`

  // Ausgewertet wird im Browser (dieselbe Funktion, als Quelltext übergeben):
  // Millionen Pixel als JSON zurückzuholen kostet sonst eine halbe Minute
  const r = await seite.evaluate(async ([aufnahme, ziel, rechne]) => {
    const abweichung = (0, eval)(`(${rechne})`)
    async function pixel (src) {
      const i = new Image(); i.src = src; await i.decode()
      const c = document.createElement('canvas'); c.width = i.naturalWidth; c.height = i.naturalHeight
      const x = c.getContext('2d', { willReadFrequently: true }); x.drawImage(i, 0, 0)
      return { b: c.width, h: c.height, d: x.getImageData(0, 0, c.width, c.height).data }
    }
    const a = await pixel(aufnahme)
    const v = await pixel(ziel)
    const gleich = a.b === v.b && a.h === v.h
    return { gleicheGroesse: gleich, b: a.b, h: a.h, abweichung: gleich ? abweichung(a.d, v.d) : null }
  }, [roh, vorlage, mittlereAbweichung.toString()])

  return { breite: r.b, hoehe: r.h, gleicheGroesse: r.gleicheGroesse, abweichung: r.abweichung }
}
