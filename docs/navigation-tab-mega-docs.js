// Beispiele der Hauptnavigation (I06 Phase 4): Jede Referenz-Fassung aus
// data/markup steht in einem eigenen Rahmen. Der Rahmen hält die Ids getrennt,
// der Drawer (position: fixed) bleibt darin, und mobile Breiten greifen.
(function () {
  const rahmen = [...document.querySelectorAll('iframe[data-nav-fassung]')]
  if (!rahmen.length) return

  const lade = (url) => fetch(url).then((a) => {
    if (!a.ok) throw new Error(url)
    return a.text()
  })

  /** Fassungen als Name → Markup; der Name steht in <!-- @fassung: … --> */
  function fassungen (text) {
    const teile = text.split(/<!--\s*@fassung:\s*([^>]*?)\s*-->/)
    const liste = new Map()
    for (let i = 1; i < teile.length; i += 2) liste.set(teile[i], teile[i + 1])
    return liste
  }

  /** Erste Fassung, die mit dem Namen beginnt; Standard ohne „Zentriert“ davor */
  function finde (liste, name) {
    const treffer = [...liste.keys()].find((k) => k.startsWith(name) || (!name.startsWith('Zentriert') && !k.startsWith('Zentriert') && k.includes(name)))
    return treffer ? liste.get(treffer) : null
  }

  /** Desktop-Fassungen laufen in voller Breite und werden auf die Spalte verkleinert. */
  function passe () {
    for (const r of rahmen) {
      const breite = Number(r.dataset.navBreite)
      if (!breite) continue
      const spalte = r.parentElement.clientWidth
      const faktor = Math.min(1, spalte / breite)
      r.style.width = `${breite}px`
      r.style.transform = `scale(${faktor})`
      r.style.marginBottom = `${-(1 - faktor) * r.height}px`
    }
  }
  passe()
  addEventListener('resize', passe)

  lade('../data/markup/navigation-tab-mega.html').then((text) => {
    const liste = fassungen(text)
    const stile = new URL('../styles.css', location.href).href
    for (const r of rahmen) {
      const markup = finde(liste, r.dataset.navFassung)
      if (!markup) continue
      const dunkel = r.dataset.navThema.includes('dark')
      r.srcdoc = `<!doctype html><html lang="de" class="${r.dataset.navThema}" data-theme="${dunkel ? 'dark' : 'light'}"><head><meta charset="utf-8"><title>${r.title}</title><link rel="stylesheet" href="${stile}"></head><body>${markup}</body></html>`
    }
  }).catch((fehler) => console.error('Beispiele der Hauptnavigation:', fehler))
})()
