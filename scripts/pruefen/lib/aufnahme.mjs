// Aufnahme der DDEV-Seiten für Pixelvergleich und Gegenprobe (E3, 21.10.2026).
// Übernommen aus vgl.mjs (Sitzung „Phase 7 Block 1“): styles.css des Themes
// wird per Route durch die übergebene CSS ersetzt — die Website selbst bleibt
// unberührt. Animationen aus, Nachlade-Scroll, ganze Seite.

const RUHE = '*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important} video{visibility:hidden}'

/** Eigener Kontext je Breite; setzeCss() gilt ab der nächsten Aufnahme, vorher die ausgelieferte CSS. */
export async function oeffne (browser, einst, breite) {
  const kontext = await browser.newContext({
    baseURL: einst.ddevUrl,
    viewport: { width: breite, height: 900 },
    ignoreHTTPSErrors: true,
    reducedMotion: 'reduce',
  })
  // null = ausgelieferte styles.css unverändert durchlassen
  let css = null
  await kontext.route(new RegExp(einst.cssRoute), (r) => (css === null ? r.continue() : r.fulfill({ body: css, contentType: 'text/css' })))
  const seite = await kontext.newPage()
  return {
    seite,
    setzeCss (neu) { css = neu },
    schliesse: () => kontext.close(),
  }
}

/** Lädt pfad, wartet auf Ruhe und liefert die ganze Seite als PNG-Puffer. */
export async function aufnehmen (seite, pfad) {
  const antwort = await seite.goto(pfad, { waitUntil: 'networkidle', timeout: 30000 })
  if (!antwort || antwort.status() >= 400) throw new Error(`HTTP ${antwort?.status() ?? 'ohne Antwort'}`)
  await seite.addStyleTag({ content: RUHE })
  await seite.evaluate(async (grenze) => {
    // Nachgeladene Bilder sofort anfordern und abwarten — sonst fehlt ein Bild in
    // nur einer der drei Aufnahmen und die Seite gilt als geändert (21.10.2026)
    for (const i of document.images) if (i.loading === 'lazy') i.loading = 'eager'
    for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 30)) }
    window.scrollTo(0, 0)
    const fertig = (i) => (i.complete ? Promise.resolve() : new Promise((r) => { i.addEventListener('load', r, { once: true }); i.addEventListener('error', r, { once: true }) }))
    const alle = Promise.all([...document.images].map((i) => fertig(i).then(() => i.decode?.().catch(() => {}))))
    await Promise.race([alle, new Promise((r) => setTimeout(r, grenze))])
  }, 15000)
  await seite.waitForTimeout(300)
  return seite.screenshot({ fullPage: true, animations: 'disabled' })
}
