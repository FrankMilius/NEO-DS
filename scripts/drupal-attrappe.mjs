#!/usr/bin/env node
// ==========================================================================
// Drupal-Attrappe für den Theme-Konfigurator (Plan v2, 2.6 — ADR-002)
// ==========================================================================
// Ein kleiner Node-Server (nur Builtins), der den Vertrag
// docs/api/theme-konfigurator.openapi.yaml (1.0.0) im Speicher nachbildet.
// Zweck: den Drupal-Betrieb der App lokal ausprobieren, E2E-Tests
// (e2e/drupal.spec.js) und eine lauffähige Referenz für die Drupal-Entwicklung.
//
//   npm run drupal:attrappe                       (Wurzel, Port 3200)
//   node scripts/drupal-attrappe.mjs --port 3200 --rechte ansehen,bearbeiten \
//        --datei /tmp/themes.json --csrf-token geheim
//
// Danach http://127.0.0.1:3200/ öffnen (Einstieg mit Rechte-Auswahl).
// Die App muss gebaut sein (npm run config:build bzw. npx vite build).
//
// Was die Attrappe prüft — genau wie der Vertrag es verlangt:
//   ETag        = "<SHA-256 des kanonischen JSON von { meta: { name, version },
//                 abweichungen }>" — berechnet mit src/speicher/inhalts-hash.js
//   If-Match    fehlt → 428, passt nicht → 412 (mit aktuellerEtag)
//   409         aktives Theme löschen, nie veröffentlichtes Theme aktivieren
//   422         Schemafehler (ThemeAbweichungen) und Kontrast-Tor beim
//               Veröffentlichen: Standard + Abweichungen zusammenführen
//               (abweichungen.js), prüfen mit kontrast.js / data/kontrast-paare.json
//   413         Anfrage > 1 MB (1 048 576 Bytes)
//   403         Recht fehlt (x-neo-recht) oder X-CSRF-Token falsch
//
// Rechte simulieren (Vorrang von oben nach unten):
//   1. Kopfzeile  X-Neo-Rechte: ansehen,bearbeiten   (Werkzeuge, curl)
//   2. Cookie     neo_attrappe_rechte                (setzt die Einstiegsseite
//                 /konfigurator?rechte=… — wie eine Drupal-Sitzung)
//   3. Startparameter --rechte (Vorgabe: alle drei)
//
// Nicht nachgebildet: Anmeldung (jede Anfrage gilt als angemeldet),
// Ablage der CSS-Datei im Dateisystem (nur im Speicher, Export liefert sie),
// Cache-Invalidierung.
// ==========================================================================

import http from 'node:http'
import { createHash, randomBytes } from 'node:crypto'
import { existsSync, readFileSync, writeFileSync, statSync } from 'node:fs'
import { dirname, extname, join, relative, resolve, sep } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { inhaltsHash, alsEtag } from '../apps/theme-configurator/src/speicher/inhalts-hash.js'
import { zusammenfuehren } from '../apps/theme-configurator/src/speicher/abweichungen.js'
import { standardDaten, standardVersion } from '../apps/theme-configurator/src/speicher/standard.js'
import { pruefeKontrast } from '../apps/theme-configurator/src/speicher/kontrast.js'
import { THEME_DATA_KEYS } from '../apps/theme-configurator/src/stores/theme/theme-schluessel.js'

const WURZEL = resolve(dirname(fileURLToPath(import.meta.url)), '..')

/** Basis-Pfad der Schnittstelle (servers[0].url im Vertrag). */
export const BASIS = '/api/neo-theme-konfigurator/v1'
export const RECHTE = ['ansehen', 'bearbeiten', 'veroeffentlichen']
export const MAX_BYTES = 1024 * 1024
export const RECHTE_COOKIE = 'neo_attrappe_rechte'
const PROBLEM = 'https://neo-workplace.example/probleme/'
const CSS_PFAD_AKTIV = 'public://neo-theme/theme.css'

const MIME = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.gif': 'image/gif',
  '.woff': 'font/woff', '.woff2': 'font/woff2', '.ttf': 'font/ttf', '.ico': 'image/x-icon',
}

const kopie = (v) => JSON.parse(JSON.stringify(v))
const istObjekt = (v) => v !== null && typeof v === 'object' && !Array.isArray(v)

/** Rechte-Liste aus Text ('alle' | 'ansehen,bearbeiten' | 'keine'). */
export function leseRechte(text, vorgabe = RECHTE) {
  if (text === undefined || text === null) return [...vorgabe]
  const t = String(text).trim()
  if (t === 'alle') return [...RECHTE]
  if (t === '' || t === 'keine') return []
  const liste = t.split(',').map(r => r.trim())
  return RECHTE.filter(r => liste.includes(r))
}

/** Maschinenname aus dem Anzeigenamen (^[a-z0-9_]+$). */
export function maschinenname(name) {
  const basis = String(name || 'theme').toLowerCase()
    .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '')
  return basis || 'theme'
}

/**
 * Schema ThemeAbweichungen (vereinfachte, aber vertragstreue Prüfung):
 * nur bekannte Schlüssel, je Schlüssel nur die Sets neo/customer,
 * activeThemeSet ∈ {neo, customer}.
 * @returns {string[]} Fundstellen (leer = gültig)
 */
export function pruefeAbweichungen(abw) {
  if (!istObjekt(abw)) return ['abweichungen: muss ein Objekt sein']
  const fehler = []
  for (const [k, v] of Object.entries(abw)) {
    if (k === 'activeThemeSet') {
      if (!['neo', 'customer'].includes(v)) fehler.push('abweichungen.activeThemeSet: erlaubt sind neo, customer')
      continue
    }
    if (!THEME_DATA_KEYS.includes(k)) { fehler.push(`abweichungen.${k}: unbekannter Schlüssel`); continue }
    if (!istObjekt(v)) { fehler.push(`abweichungen.${k}: muss ein Objekt sein`); continue }
    for (const s of Object.keys(v)) {
      if (!['neo', 'customer'].includes(s)) fehler.push(`abweichungen.${k}.${s}: erlaubt sind nur die Sets neo, customer`)
    }
  }
  return fehler
}

/** Fehlerkörper nach RFC 9457. */
function problem(status, art, title, extra = {}) {
  return { status, body: { type: PROBLEM + art, title, status, ...extra }, typ: 'application/problem+json' }
}

/**
 * Die Attrappe als reine Logik (ohne HTTP), damit Tests sie direkt treiben können.
 * @param {object} o
 * @param {object} [o.standard]   Inhalt von neo-theme-defaults.json
 * @param {string[]} [o.rechte]   Vorgabe-Rechte
 * @param {string} [o.csrfToken]
 * @param {string} [o.datei]      JSON-Datei zum Persistieren (optional)
 */
export function erzeugeZustand(o = {}) {
  const standard = o.standard ?? JSON.parse(readFileSync(join(WURZEL, 'data/neo-theme-defaults/neo-theme-defaults.json'), 'utf8'))
  const standardVoll = standardDaten(standard)
  const csrfToken = o.csrfToken || randomBytes(16).toString('hex')
  const vorgabeRechte = o.rechte ? [...o.rechte] : [...RECHTE]
  /** @type {Map<string, { meta: object, abweichungen: object, standardVersion: string|null, css: object|null }>} */
  const themes = new Map()
  let aktivId = null
  let uhr = o.uhr || (() => new Date().toISOString())

  if (o.datei && existsSync(o.datei)) {
    const d = JSON.parse(readFileSync(o.datei, 'utf8'))
    for (const t of d.themes || []) themes.set(t.meta.id, t)
    aktivId = d.aktivId ?? null
  }
  function sichern() {
    if (!o.datei) return
    writeFileSync(o.datei, JSON.stringify({ aktivId, themes: [...themes.values()] }, null, 2))
  }

  const hashVon = (t) => inhaltsHash({ meta: { name: t.meta.name, version: t.meta.version }, abweichungen: t.abweichungen })

  async function metaAus(t) {
    return { ...kopie(t.meta), hash: await hashVon(t), aktiv: t.meta.id === aktivId }
  }
  async function dokument(t) {
    return { meta: await metaAus(t), abweichungen: kopie(t.abweichungen), standardVersion: t.standardVersion ?? null }
  }
  async function liste() {
    const metas = []
    for (const t of themes.values()) metas.push(await metaAus(t))
    return { themes: metas }
  }

  function koerperPruefen(body) {
    if (!istObjekt(body)) return ['Körper: JSON-Objekt erwartet']
    const f = []
    if (!istObjekt(body.meta)) f.push('meta: fehlt')
    else {
      if (typeof body.meta.name !== 'string' || !body.meta.name.trim()) f.push('meta.name: Pflichtfeld')
      if (typeof body.meta.version !== 'string' || !body.meta.version.trim()) f.push('meta.version: Pflichtfeld')
    }
    f.push(...pruefeAbweichungen(body.abweichungen))
    return f
  }

  /** If-Match gegen den aktuellen Inhalts-Hash; null = in Ordnung. */
  async function ifMatch(t, kopf) {
    if (!kopf) return problem(428, 'if-match-fehlt', 'If-Match fehlt', { detail: 'Ändernde Aufrufe brauchen If-Match mit dem ETag des Stands, auf dem die Änderung beruht.' })
    const aktuell = alsEtag(await hashVon(t))
    const genannt = kopf.split(',').map(s => s.trim())
    if (!genannt.includes(aktuell) && !genannt.includes('*')) {
      return { ...problem(412, 'veraltet', 'Das Theme wurde inzwischen geändert', { detail: 'Jemand anderes hat dieses Theme inzwischen gespeichert. Bitte neu laden und entscheiden, welcher Stand gilt.', aktuellerEtag: aktuell }), etag: aktuell }
    }
    return null
  }

  /**
   * Eine API-Anfrage bearbeiten.
   * @param {{ methode: string, pfad: string, query: URLSearchParams, kopf: (n: string) => string|undefined, koerper: string|null, rechte: string[] }} a
   * @returns {Promise<{ status: number, body?: any, typ?: string, etag?: string, headers?: object }>}
   */
  async function bearbeite(a) {
    const { methode, pfad, query, kopf, rechte } = a
    const recht = (r) => rechte.includes(r) ? null : problem(403, 'recht-fehlt', 'Keine Berechtigung', { detail: `Dir fehlt das Recht „${r}“.`, recht: r })
    const csrf = () => (kopf('x-csrf-token') === csrfToken ? null : problem(403, 'csrf', 'CSRF-Token ungültig', { detail: 'Das Sicherheits-Token (X-CSRF-Token) fehlt oder ist ungültig. Bitte die Seite neu laden.' }))
    const groesse = () => (a.koerper !== null && Buffer.byteLength(a.koerper, 'utf8') > MAX_BYTES
      ? problem(413, 'zu-gross', 'Anfrage zu groß', { detail: 'Das Theme ist zu groß (höchstens 1 MB).' }) : null)
    const json = () => {
      try { return { wert: a.koerper ? JSON.parse(a.koerper) : undefined } } catch { return { fehler: problem(400, 'json', 'Ungültiges JSON', { detail: 'Der Körper ist kein gültiges JSON.' }) } }
    }
    const schreibend = (r) => recht(r) || csrf() || groesse()

    if (pfad === '/neo-standard' && methode === 'GET') {
      return recht('ansehen') || { status: 200, body: standard, etag: alsEtag(standardVersion(standard) ?? 'ohne-version') }
    }

    if (pfad === '/themes') {
      if (methode === 'GET') return recht('ansehen') || { status: 200, body: await liste() }
      if (methode === 'POST') {
        const f = schreibend('bearbeiten'); if (f) return f
        const j = json(); if (j.fehler) return j.fehler
        const fund = koerperPruefen(j.wert)
        if (fund.length) return problem(422, 'ungueltig', 'Daten abgelehnt', { detail: fund.join('; '), fehler: fund })
        let id = maschinenname(j.wert.meta.name)
        for (let i = 2; themes.has(id); i++) id = `${maschinenname(j.wert.meta.name)}_${i}`
        const jetzt = uhr()
        const t = {
          meta: { id, name: j.wert.meta.name, version: j.wert.meta.version, createdAt: jetzt, updatedAt: jetzt, status: 'entwurf', veroeffentlichtAm: null, geaendertVon: 'Attrappe' },
          abweichungen: kopie(j.wert.abweichungen),
          standardVersion: j.wert.standardVersion ?? null,
          css: null,
        }
        themes.set(id, t); sichern()
        const dok = await dokument(t)
        return { status: 201, body: dok, etag: alsEtag(dok.meta.hash), headers: { Location: `${BASIS}/themes/${id}` } }
      }
      return problem(405, 'methode', 'Methode nicht erlaubt')
    }

    const m = pfad.match(/^\/themes\/([^/]+)(?:\/(aktivieren|veroeffentlichen|export))?$/)
    if (!m) return problem(404, 'nicht-gefunden', 'Nicht gefunden')
    const id = decodeURIComponent(m[1])
    const aktion = m[2] || null
    const t = themes.get(id)

    if (!aktion) {
      if (methode === 'GET') {
        const f = recht('ansehen'); if (f) return f
        if (!t) return problem(404, 'nicht-gefunden', 'Theme nicht gefunden')
        const dok = await dokument(t)
        return { status: 200, body: dok, etag: alsEtag(dok.meta.hash) }
      }
      if (methode === 'PUT') {
        const f = schreibend('bearbeiten'); if (f) return f
        if (!t) return problem(404, 'nicht-gefunden', 'Theme nicht gefunden')
        const v = await ifMatch(t, kopf('if-match')); if (v) return v
        const j = json(); if (j.fehler) return j.fehler
        const fund = koerperPruefen(j.wert)
        if (fund.length) return problem(422, 'ungueltig', 'Daten abgelehnt', { detail: fund.join('; '), fehler: fund })
        const alterHash = await hashVon(t)
        t.meta.name = j.wert.meta.name
        t.meta.version = j.wert.meta.version
        t.abweichungen = kopie(j.wert.abweichungen)
        t.standardVersion = j.wert.standardVersion ?? null
        if (alterHash !== await hashVon(t)) {
          t.meta.updatedAt = uhr()
          if (t.meta.status === 'veroeffentlicht') t.meta.status = 'geaendert-seit-veroeffentlichung'
        }
        sichern()
        const dok = await dokument(t)
        return { status: 200, body: dok, etag: alsEtag(dok.meta.hash) }
      }
      if (methode === 'DELETE') {
        const f = recht('bearbeiten') || csrf(); if (f) return f
        if (!t) return problem(404, 'nicht-gefunden', 'Theme nicht gefunden')
        const v = await ifMatch(t, kopf('if-match')); if (v) return v
        if (id === aktivId) return problem(409, 'konflikt', 'Aktives Theme', { detail: 'Das aktive Theme kann nicht gelöscht werden. Bitte zuerst ein anderes Theme aktivieren.' })
        themes.delete(id); sichern()
        return { status: 204 }
      }
      return problem(405, 'methode', 'Methode nicht erlaubt')
    }

    if (aktion === 'export') {
      if (methode !== 'GET') return problem(405, 'methode', 'Methode nicht erlaubt')
      const f = recht('ansehen'); if (f) return f
      if (!t) return problem(404, 'nicht-gefunden', 'Theme nicht gefunden')
      const format = query.get('format')
      if (format === 'abweichungen') return { status: 200, body: await dokument(t) }
      if (format === 'css') {
        if (!t.css) return problem(404, 'nicht-gefunden', 'Noch nicht veröffentlicht', { detail: 'Dieses Theme wurde noch nie veröffentlicht.' })
        return { status: 200, body: t.css.inhalt, typ: 'text/css; charset=utf-8' }
      }
      return problem(400, 'format', 'Unbekanntes Format', { detail: 'format: erlaubt sind css, abweichungen' })
    }

    if (methode !== 'POST') return problem(405, 'methode', 'Methode nicht erlaubt')

    if (aktion === 'aktivieren') {
      const f = recht('veroeffentlichen') || csrf(); if (f) return f
      if (!t) return problem(404, 'nicht-gefunden', 'Theme nicht gefunden')
      if (!t.css) return problem(409, 'konflikt', 'Nicht veröffentlicht', { detail: 'Nur ein veröffentlichtes Theme kann aktiviert werden.' })
      aktivId = id; sichern()
      return { status: 200, body: await liste() }
    }

    // veroeffentlichen
    const f = schreibend('veroeffentlichen'); if (f) return f
    if (!t) return problem(404, 'nicht-gefunden', 'Theme nicht gefunden')
    const v = await ifMatch(t, kopf('if-match')); if (v) return v
    const j = json(); if (j.fehler) return j.fehler
    const b = j.wert
    const fund = []
    if (!istObjekt(b)) fund.push('Körper: JSON-Objekt erwartet')
    else {
      if (typeof b.css !== 'string' || !b.css) fund.push('css: Pflichtfeld')
      if (!istObjekt(b.kontrast) || typeof b.kontrast.bestanden !== 'boolean' || !Array.isArray(b.kontrast.ergebnisse)) fund.push('kontrast: KontrastErgebnis erwartet')
    }
    if (fund.length) return problem(422, 'ungueltig', 'Daten abgelehnt', { detail: fund.join('; '), fehler: fund })
    // Kontrast-Tor: verbindlich auf dem gespeicherten Stand, nicht dem Ergebnis der App
    const daten = zusammenfuehren(standardVoll, t.abweichungen)
    const set = daten.activeThemeSet || 'customer'
    const kontrast = pruefeKontrast(daten.themes?.[set])
    if (!kontrast.bestanden) {
      const befunde = kontrast.ergebnisse.filter(e => e.bestanden !== true)
        .map(e => `${e.modus}: ${e.vordergrund} auf ${e.hintergrund} ${e.verhaeltnis ?? '–'}:1 (mind. ${e.mindestens}:1)`)
      return problem(422, 'kontrast', 'Kontrastprüfung nicht bestanden', { detail: `Die Kontrastprüfung des Servers ist nicht bestanden (Set ${set}).`, fehler: befunde, kontrast })
    }
    const version = String((t.css?.version ? Number(t.css.version) : 0) + 1)
    const jetzt = uhr()
    t.css = { inhalt: b.css, version, hash: createHash('sha256').update(b.css, 'utf8').digest('hex'), veroeffentlichtAm: jetzt }
    t.meta.status = 'veroeffentlicht'
    t.meta.veroeffentlichtAm = jetzt
    sichern()
    const meta = await metaAus(t)
    const aktiv = id === aktivId
    return {
      status: 200,
      etag: alsEtag(meta.hash),
      body: {
        meta,
        css: {
          pfad: aktiv ? CSS_PFAD_AKTIV : `public://neo-theme/${id}/theme-v${version}.css`,
          url: `${BASIS}/themes/${encodeURIComponent(id)}/export?format=css&v=${version}`,
          version,
          hash: t.css.hash,
          ausgeliefert: aktiv,
        },
      },
    }
  }

  return {
    bearbeite,
    csrfToken,
    vorgabeRechte,
    standard,
    get aktivId() { return aktivId },
    themes,
    /** Nur für Tests: Uhr ersetzen. */
    setzeUhr(f) { uhr = f },
  }
}

function leseCookie(kopf, name) {
  for (const teil of String(kopf || '').split(';')) {
    const [k, ...rest] = teil.trim().split('=')
    if (k === name) return decodeURIComponent(rest.join('='))
  }
  return undefined
}

const esc = (s) => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]))

function startseite(z) {
  const link = (r, text) => `<li><a href="/konfigurator?rechte=${r}">${esc(text)}</a> <code>${esc(r)}</code></li>`
  return `<!doctype html><html lang="de"><head><meta charset="utf-8"><title>Drupal-Attrappe – Theme-Konfigurator</title>
<meta name="viewport" content="width=device-width, initial-scale=1"></head>
<body style="font:16px/1.5 system-ui,sans-serif;margin:3rem auto;max-width:44rem;padding:0 1rem">
<h1>Drupal-Attrappe</h1>
<p>Bildet den Vertrag <code>docs/api/theme-konfigurator.openapi.yaml</code> (1.0.0) im Speicher nach.
Die App startet im Drupal-Betrieb (<code>window.NEO_KONFIGURATOR.speicher = 'drupal'</code>).</p>
<h2>Konfigurator öffnen mit Rechten …</h2>
<ul>${link('ansehen,bearbeiten,veroeffentlichen', 'alle Rechte')}${link('ansehen,bearbeiten', 'ohne Veröffentlichen')}${link('ansehen', 'nur ansehen')}</ul>
<p>Schnittstelle: <code>${BASIS}</code> · CSRF-Token: <code>GET /session/token</code> · Themes: ${z.themes.size}</p>
</body></html>`
}

function einstieg(z, rechte) {
  const pfad = join(WURZEL, 'config/theme-config.html')
  if (!existsSync(pfad)) return null
  const konfig = { speicher: 'drupal', basisUrl: BASIS, csrfToken: z.csrfToken, rechte }
  const skript = `<script>window.NEO_KONFIGURATOR = ${JSON.stringify(konfig).replace(/</g, '\\u003c')};</script>`
  return readFileSync(pfad, 'utf8')
    .replace('<html lang="en">', '<html lang="de">')
    .replace('<script type="module"', `${skript}\n  <script type="module"`)
}

/**
 * HTTP-Server erzeugen (nicht gestartet).
 * @param {object} o  wie erzeugeZustand, dazu nichts weiter
 */
export function erzeugeAttrappe(o = {}) {
  const z = erzeugeZustand(o)

  const server = http.createServer(async (req, res) => {
    const url = new URL(req.url, 'http://attrappe')
    const pfad = url.pathname
    const senden = (status, body, headers = {}) => {
      res.writeHead(status, { 'Cache-Control': 'no-store', ...headers })
      res.end(body)
    }
    const rechte = req.headers['x-neo-rechte'] !== undefined
      ? leseRechte(req.headers['x-neo-rechte'])
      : leseRechte(leseCookie(req.headers.cookie, RECHTE_COOKIE), z.vorgabeRechte)

    try {
      if (pfad === '/session/token' && req.method === 'GET') return senden(200, z.csrfToken, { 'Content-Type': 'text/plain; charset=utf-8' })

      if (pfad === BASIS || pfad.startsWith(BASIS + '/')) {
        // Körper lesen, bei mehr als 1 MB abbrechen (413)
        let koerper = null
        if (!['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
          const teile = []
          let n = 0
          let zuGross = false
          for await (const c of req) {
            n += c.length
            if (n > MAX_BYTES) { zuGross = true; break }
            teile.push(c)
          }
          koerper = zuGross ? 'x'.repeat(MAX_BYTES + 1) : Buffer.concat(teile).toString('utf8')
        }
        const erg = await z.bearbeite({
          methode: req.method,
          pfad: pfad.slice(BASIS.length) || '/',
          query: url.searchParams,
          kopf: (n) => req.headers[n.toLowerCase()],
          koerper,
          rechte,
        })
        const headers = { ...(erg.headers || {}) }
        if (erg.etag) headers.ETag = erg.etag
        if (erg.status === 204) return senden(204, undefined, headers)
        const istText = typeof erg.body === 'string'
        headers['Content-Type'] = erg.typ || (istText ? 'text/plain; charset=utf-8' : 'application/json; charset=utf-8')
        return senden(erg.status, istText ? erg.body : JSON.stringify(erg.body), headers)
      }

      if (req.method !== 'GET' && req.method !== 'HEAD') return senden(405, 'Methode nicht erlaubt', { 'Content-Type': 'text/plain; charset=utf-8' })

      if (pfad === '/') return senden(200, startseite(z), { 'Content-Type': 'text/html; charset=utf-8' })

      if (pfad === '/konfigurator') {
        const r = url.searchParams.has('rechte') ? leseRechte(url.searchParams.get('rechte')) : rechte
        const html = einstieg(z, r)
        if (!html) {
          return senden(503, '<!doctype html><meta charset="utf-8"><title>Konfigurator nicht gebaut</title><p>Erst bauen: <code>npm run config:build</code></p>', { 'Content-Type': 'text/html; charset=utf-8' })
        }
        return senden(200, html, {
          'Content-Type': 'text/html; charset=utf-8',
          'Set-Cookie': `${RECHTE_COOKIE}=${encodeURIComponent(r.join(',') || 'keine')}; Path=/; SameSite=Lax`,
        })
      }

      // Statische Dateien aus der Wurzel (gebautes Bundle, data/, fonts/ …)
      const datei = resolve(WURZEL, '.' + decodeURIComponent(pfad))
      const teile = relative(WURZEL, datei).split(sep)
      if (!datei.startsWith(WURZEL + sep) || teile.some(t => t.startsWith('.') || t === 'node_modules')) return senden(403, 'Verboten')
      if (!existsSync(datei) || !statSync(datei).isFile()) return senden(404, 'Nicht gefunden: ' + pfad, { 'Content-Type': 'text/plain; charset=utf-8' })
      return senden(200, readFileSync(datei), { 'Content-Type': MIME[extname(datei).toLowerCase()] || 'application/octet-stream' })
    } catch (e) {
      console.error('[attrappe]', e)
      return senden(500, JSON.stringify({ type: PROBLEM + 'server', title: 'Serverfehler', status: 500, detail: String(e?.message || e) }), { 'Content-Type': 'application/problem+json' })
    }
  })
  server.zustand = z
  return server
}

function leseArgumente(argv) {
  const o = {}
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    const wert = () => argv[++i]
    if (a === '--port') o.port = Number(wert())
    else if (a === '--host') o.host = wert()
    else if (a === '--rechte') o.rechte = leseRechte(wert())
    else if (a === '--datei') o.datei = resolve(wert())
    else if (a === '--csrf-token') o.csrfToken = wert()
    else if (a === '--hilfe' || a === '-h') o.hilfe = true
    else throw new Error(`Unbekannter Parameter: ${a}`)
  }
  return o
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  let o
  try { o = leseArgumente(process.argv.slice(2)) } catch (e) { console.error(e.message); process.exit(2) }
  if (o.hilfe) {
    console.log('node scripts/drupal-attrappe.mjs [--port 3200] [--host 127.0.0.1] [--rechte alle|ansehen,bearbeiten,…] [--datei themes.json] [--csrf-token …]')
    process.exit(0)
  }
  const port = o.port ?? Number(process.env.PORT || 3200)
  const host = o.host || process.env.HOST || '127.0.0.1'
  const server = erzeugeAttrappe(o)
  server.listen(port, host, () => {
    const z = server.zustand
    console.log(`\n  Drupal-Attrappe (Vertrag 1.0.0)\n  http://${host}:${server.address().port}/  → Einstieg mit Rechte-Auswahl`)
    console.log(`  Schnittstelle: ${BASIS}`)
    console.log(`  Rechte (Vorgabe): ${z.vorgabeRechte.join(', ') || 'keine'} · CSRF-Token: ${z.csrfToken}`)
    if (o.datei) console.log(`  Datei: ${o.datei}`)
    if (!existsSync(join(WURZEL, 'config/theme-config.html'))) console.log('  Hinweis: App noch nicht gebaut — npm run config:build')
    console.log('')
  })
}
