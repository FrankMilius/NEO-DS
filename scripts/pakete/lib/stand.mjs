// Paketliste und STAND.md je Paket (E10, 22.10.2026).
// pruefeListe: Fehler der Liste, bevor ein Worktree entsteht.
// fuelle:      füllt die STAND.md, die punkt-starten.sh aus der Vorlage
//              geschrieben hat. Haltepunkte, Nicht anfassen und offene Fragen
//              bleiben unverändert — sie gehören der Vorlage bzw. Frank.
import { homedir } from 'node:os'
import path from 'node:path'

const PUNKT = /^[A-Z][0-9]+$/
const KENNUNG = /^[a-z0-9][a-z0-9-]*$/

/** Worktree-Ordner und Zweig — dieselbe Regel wie punkt-starten.sh */
export function ziel (liste, paket) {
  const p = liste.punkt.toLowerCase()
  return {
    ordner: path.join(homedir(), 'Sites/_worktrees', `WEBSITE26-${p}-${paket.id}`),
    zweig: `punkt/${p}-${paket.id}`,
  }
}

/** Fehler der Liste als Sätze; leer = in Ordnung. wirkung: tokens aus token-wirkung.json */
export function pruefeListe (liste, wirkung) {
  const f = []
  if (!PUNKT.test(liste.punkt || '')) f.push(`Punkt „${liste.punkt}“ hat nicht die Form R14`)
  if (!liste.pakete?.length) f.push('Liste ohne Pakete')
  const ids = new Set(); const tokens = new Set()
  for (const p of liste.pakete || []) {
    if (!KENNUNG.test(p.id || '')) f.push(`Kennung „${p.id}“: nur Kleinbuchstaben, Ziffern, Bindestrich`)
    if (ids.has(p.id)) f.push(`Paket ${p.id} doppelt`)
    ids.add(p.id)
    if (!p.werte?.length) f.push(`Paket ${p.id} hat keine Werte`)
    for (const w of p.werte || []) {
      if (tokens.has(w.token)) f.push(`${w.token} doppelt (zuletzt in ${p.id})`)
      tokens.add(w.token)
      if (!(w.token in wirkung)) f.push(`${w.token} unbekannt (nicht in token-wirkung.json)`)
      else if (wirkung[w.token] === 'wirkt') f.push(`${w.token} wirkt schon — nichts zu reparieren`)
    }
  }
  return f
}

const zelle = (s) => String(s).replace(/\|/g, '/')

function abschnitte (paket, liste, { basis }) {
  const n = paket.werte.length
  const web = paket.werte.filter((w) => w.website.length)
  const buehne = paket.werte.filter((w) => !w.website.length)
  const werte = [
    '| Token | Eigenschaft | verliert gegen (R13) | Maßnahme | Website |',
    '|---|---|---|---|---|',
    ...paket.werte.map((w) => `| ${w.token} | ${w.eigenschaft} | \`${zelle(w.detail)}\` | ${w.massnahme} | ${w.website.join(', ') || '—'} |`),
  ].join('\n')
  const abnahme = [
    '- `npm run pruefen:alles -- --ohne modul` Ausgang 0, kein HALTEPUNKT (Pixel 0 auf allen Seiten, 1280 und 390 px)',
    ...web.map((w) => `- \`npm run pruefen:gegenprobe -- --setze '--${w.token}: <Testwert>' --eigenschaft ${w.eigenschaft}\` → wirkt`),
    ...(buehne.length ? [`- Bühne (\`npm run e2e:wirkung\`, Website trägt sie nicht) → wirkt: ${buehne.map((w) => w.token).join(', ')}`] : []),
    `- \`node apps/theme-configurator/scripts/wirkung.mjs --pruefen\` ohne Verschlechterung; nach \`--setzen\` ohne-wirkung um ${n} weniger`,
    '- Widersacher ohne offene Befunde',
  ].join('\n')
  return {
    Ziel: `Die ${n} überdeckten Werte „${paket.titel}“ wirken; Standard und Website bleiben unverändert. ${liste.regel}`,
    [`Werte (${n})`]: werte,
    'Abnahme — fertig, wenn': abnahme,
    'Website darf sich ändern': 'nein — Pixel 0 auf allen Seiten der frischen Liste (1280 und 390 px). Abweichung = sofort anhalten (E6).',
    'Entscheidungen (Frank)': liste.entscheidungen.map((e) => `- ${e}`).join('\n'),
    Stand: `Nur angelegt (${basis}) von \`npm run pakete:vorbereiten\`. Noch nichts repariert.`,
    'Nächster Schritt': liste.naechsterSchritt,
  }
}

/** Ersetzt den Inhalt der benannten Abschnitte; „Werte“ kommt neu nach „Ziel“. */
export function fuelle (vorlage, paket, liste, kontext) {
  const neu = abschnitte(paket, liste, kontext)
  const teile = vorlage.split(/^(?=## )/m)
  const kopf = (t) => t.slice(3).split('\n')[0].trim()
  for (const k of Object.keys(neu)) {
    if (!k.startsWith('Werte') && !teile.some((t) => t.startsWith('## ') && kopf(t) === k)) {
      throw new Error(`STAND.md: Abschnitt „${k}“ fehlt in der Vorlage`)
    }
  }
  const aus = []
  for (const t of teile) {
    const k = t.startsWith('## ') ? kopf(t) : null
    if (k && k in neu) aus.push(`## ${k}\n${neu[k]}\n\n`)
    else aus.push(t)
    if (k === 'Ziel') {
      const w = Object.keys(neu).find((x) => x.startsWith('Werte'))
      aus.push(`## ${w}\n${neu[w]}\n\n`)
    }
  }
  return aus.join('').replace(/\n+$/, '\n')
}
