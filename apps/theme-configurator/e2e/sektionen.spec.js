// ==========================================================================
// Smoke je Sektion (Plan v2, 4.2)
// ==========================================================================
// Jede Sektion der Navigation wird per Deep-Link geoeffnet. Erwartet:
//   - die URL bleibt auf der Sektion (der Router kennt sie, kein Rueckfall
//     auf die Startsektion)
//   - Header, Labor und Inspector sind sichtbar, der Labor-Kopf nennt die
//     Sektion
//   - Labor ODER Inspector zeigen Inhalt
//   - keine Error-Boundary, keine Konsolenfehler, kein pageerror
//   - Grundsatz „Bühne = Ausschnitt der echten Website“ (19.10.2026): kein
//     Inhalt ragt aus einem Behälter, der weder scrollt noch abschneidet,
//     und die Seite im Geräterahmen ist nicht breiter als der Rahmen.
//     Bekannte Befunde stehen mit Grund in BEKANNTE_UEBERSTAENDE (Sperrklinke:
//     neue Befunde scheitern, behobene müssen aus der Liste)
// Die Liste kommt aus der Navigation (e2e/hilfen.js), neue Sektionen sind
// automatisch dabei.
// ==========================================================================

import { test, expect, SEKTIONEN, sektionZuPfad, oeffneSektion, unbekannteFehler, warteAufRuhe } from './hilfen.js'

// Prüfung im Browser: liefert Befunde als Text (leer = in Ordnung)
function pruefeUeberstand () {
  const buehne = document.querySelector('#cfg-buehne')
  const funde = []
  const raus = (wurzel, ansicht) => {
    for (const el of wurzel.querySelectorAll('*')) {
      const cs = ansicht.getComputedStyle(el)
      if (cs.position === 'absolute' || cs.position === 'fixed') continue
      const p = el.parentElement
      if (!p || p === wurzel || !wurzel.contains(p) || String(p.className).startsWith('br-')) continue
      const pc = ansicht.getComputedStyle(p)
      if (pc.display === 'contents') continue
      const r = el.getBoundingClientRect(), q = p.getBoundingClientRect()
      if (r.width < 24 || r.height < 8 || q.width < 24 || r.right <= q.right + 6) continue
      // Nur sichtbarer Überstand: kein Vorfahre bis zur Wurzel schneidet ab
      // oder scrollt (Galerien, Laufbänder und Codeblöcke dürfen das)
      let a = p, gefangen = false
      while (a && a !== wurzel) { if (ansicht.getComputedStyle(a).overflowX !== 'visible') { gefangen = true; break } a = a.parentElement }
      if (!gefangen) funde.push(`${String(el.className).slice(0, 40)} +${Math.round(r.right - q.right)} px`)
    }
  }
  raus(buehne, window)
  for (const f of buehne.querySelectorAll('iframe')) {
    const d = f.contentDocument
    if (!d) continue
    raus(d.body, f.contentWindow)
    const breit = d.documentElement.scrollWidth - d.documentElement.clientWidth
    if (breit > 1) funde.push(`Seite im Rahmen ${breit} px zu breit`)
  }
  return funde.slice(0, 5)
}

// Bekannte Befunde (Prüfung 19.10.2026) — nächstes Arbeitspaket. Beheben,
// dann den Eintrag löschen; der Test verlangt das.
const BEKANNTE_UEBERSTAENDE = new Map([
  // Beide im Geräterahmen „Desktop“ (1280 px, mit Bildlaufleiste): Website
  // rechnet mit 100vw o. ä. — mit klassischer Bildlaufleiste (Windows) auch
  // auf der echten Website sichtbar. Änderung am DS → Freigabe-Ablauf.
  ['component-footer', 'Spalten ragen im Rahmen „Desktop“ sichtbar heraus (+15 / +37 px)'],
  ['component-form-actions', 'Seite im Rahmen „Desktop“ 4 px zu breit'],
])

test('Navigation liefert Sektionen', () => {
  // Schutz gegen eine leere Liste — dann liefe der Smoke „gruen" ohne Test
  expect(SEKTIONEN.length).toBeGreaterThan(100)
  expect(SEKTIONEN).toContain('foundation-colors')
})

for (const id of SEKTIONEN) {
  test(`Sektion ${id}`, async ({ page, fehler }) => {
    await oeffneSektion(page, id)
    await warteAufRuhe(page)

    // Router hat die Sektion angenommen
    await expect.poll(() => page.evaluate(() => location.hash.split('?')[0])).toBe('#' + sektionZuPfad(id))

    // Labor-Kopf nennt die Sektion
    await expect(page.locator('.lab-title')).toBeVisible()
    await expect(page.locator('.lab-breadcrumb-leaf')).not.toBeEmpty()
    await expect(page.locator('.error-boundary')).toHaveCount(0)

    const inhalt = await page.evaluate(() => {
      const labor = document.querySelector('.lab-viewport-inner')
      const inspector = document.querySelector('.inspector-panel')
      const kopf = inspector?.querySelector('.inspector-header')?.innerText.length || 0
      return {
        labor: labor ? labor.children.length : 0,
        laborText: (labor?.innerText || '').trim().length,
        inspectorText: (inspector?.innerText || '').trim().length - kopf,
      }
    })
    expect(inhalt.labor + Math.max(0, inhalt.inspectorText), 'Labor oder Inspector zeigt Inhalt').toBeGreaterThan(0)
    if (inhalt.labor === 0) {
      // Sichtbar im Report: Sektionen ohne Arena (Stand 30.09.2026: colors
      // ohne Auswahl, container-intent, content, media-frame, prose)
      test.info().annotations.push({ type: 'leere Arena', description: id })
    }

    // Grundsatz „Bühne = Ausschnitt der echten Website“: nichts ragt aus
    // einem Behälter, der weder scrollt noch abschneidet; im Geräterahmen
    // ist die Seite nicht breiter als der Rahmen.
    const funde = await page.evaluate(pruefeUeberstand)
    if (BEKANNTE_UEBERSTAENDE.has(id)) {
      expect(funde.length, `${id} steht in BEKANNTE_UEBERSTAENDE, ist aber behoben — Eintrag entfernen`).toBeGreaterThan(0)
    } else {
      expect(funde, 'Inhalt ragt aus seinem Behälter bzw. Seite breiter als der Rahmen').toEqual([])
    }

    expect(unbekannteFehler(fehler, id), 'Konsolenfehler/pageerror').toEqual([])
  })
}
