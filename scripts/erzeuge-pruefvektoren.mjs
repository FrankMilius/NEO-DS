#!/usr/bin/env node
// ==========================================================================
// Prüffälle für die serverseitige Umsetzung (Drupal/PHP) – Plan v2, 2.6
// ==========================================================================
// Erzeugt data/pruefvektoren/speicher-vertrag.json aus der Referenz-Logik der
// App (apps/theme-configurator/src/speicher/*.js). Die PHP-Umsetzung im
// Drupal-Modul liest dieselbe Datei in ihren Tests (z. B. PHPUnit-
// DataProvider) und muss für jeden Fall dasselbe Ergebnis liefern:
//   1. kanonisches JSON + Inhalts-Hash (ETag)
//   2. Abweichungen berechnen / mit dem Standard zusammenführen
//   3. Kontrastprüfung (data/kontrast-paare.json)
//   4. Schema-Prüfung ThemeAbweichungen + Größenlimit
//
//   node scripts/erzeuge-pruefvektoren.mjs            schreiben
//   node scripts/erzeuge-pruefvektoren.mjs --pruefen  nur vergleichen (Exit 1 bei Drift)
// ==========================================================================
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { kanonischesJson, inhaltsHash, alsEtag } from '../apps/theme-configurator/src/speicher/inhalts-hash.js'
import { abweichungenBerechnen, zusammenfuehren, ENTFERNT } from '../apps/theme-configurator/src/speicher/abweichungen.js'
import { pruefeKontrast } from '../apps/theme-configurator/src/speicher/kontrast.js'
import { standardDaten, standardVersion } from '../apps/theme-configurator/src/speicher/standard.js'
import { pruefeAbweichungen, MAX_BYTES } from './drupal-attrappe.mjs'

const WURZEL = join(dirname(fileURLToPath(import.meta.url)), '..')
const ZIEL = join(WURZEL, 'data/pruefvektoren/speicher-vertrag.json')
const STANDARD_PFAD = 'data/neo-theme-defaults/neo-theme-defaults.json'
const STANDARD = JSON.parse(readFileSync(join(WURZEL, STANDARD_PFAD), 'utf8'))
const kopie = (x) => JSON.parse(JSON.stringify(x))
const ohneZeit = (k) => ({ bestanden: k.bestanden, verfahren: k.verfahren, ergebnisse: k.ergebnisse })

export async function erzeuge () {
  // --- 1. Kanonisches JSON und Hash -----------------------------------------
  const hashEingaben = [
    { name: 'Schlüsselreihenfolge egal', eingabe: { b: 1, a: { d: 2, c: 3 } } },
    { name: 'Listen behalten ihre Reihenfolge', eingabe: { liste: [3, 1, 2] } },
    { name: 'leeres Objekt bleibt Objekt (PHP: nicht als Array dekodieren)', eingabe: { leer: {}, liste: [] } },
    { name: 'Unicode und Schrägstrich unmaskiert', eingabe: { name: 'Grün/Blau – Kunde ä', pfad: '/a/b' } },
    { name: 'Zahlen: ganze Zahl, Dezimal, negativ', eingabe: { a: 1, b: 1.5, c: 0.1, d: -2, e: 100 } },
    { name: 'null, true, false', eingabe: { n: null, t: true, f: false } },
    { name: 'Escapes in Zeichenketten', eingabe: { s: 'Zeile 1\nZeile "2"\t\\' } },
  ]
  const hash = []
  for (const h of hashEingaben) hash.push({ ...h, kanonisch: kanonischesJson(h.eingabe), sha256: await inhaltsHash(h.eingabe) })
  const etagEingabe = { meta: { name: 'ACME Corporate', version: '1.0.0' }, abweichungen: { activeThemeSet: 'customer', themes: { customer: { light: { 'background-accent': '#0055aa' } } } } }
  const etag = { name: 'ETag eines Themes = Hash über { meta: { name, version }, abweichungen }', eingabe: etagEingabe, kanonisch: kanonischesJson(etagEingabe), etag: alsEtag(await inhaltsHash(etagEingabe)) }

  // --- 2. Abweichungen ---------------------------------------------------------
  const S = {
    activeThemeSet: 'neo',
    themes: { neo: { light: { 'text-primary': '#000000', 'background-base': '#ffffff' }, dark: { 'text-primary': '#ffffff' } },
              customer: { light: { 'text-primary': '#000000', 'background-base': '#ffffff' }, dark: { 'text-primary': '#ffffff' } } },
    foundationOverrides: { customer: { radius: { sm: '4px', md: '6px' }, spacing: { '01': '4px' } } },
    componentOverrides: { customer: {} },
    customFonts: { customer: ['Manrope'] },
  }
  const faelle = [
    ['unverändert ergibt leere Abweichung', (x) => x],
    ['ein Wert geändert', (x) => { x.themes.customer.light['background-base'] = '#fafafa'; return x }],
    ['verschachtelter Wert geändert', (x) => { x.foundationOverrides.customer.radius.md = '8px'; return x }],
    ['neuer Schlüssel hinzugefügt', (x) => { x.componentOverrides.customer['nc-button-radius'] = '12px'; return x }],
    ['Schlüssel entfernt ($entfernt)', (x) => { delete x.foundationOverrides.customer.spacing; return x }],
    ['Liste wird als Ganzes ersetzt', (x) => { x.customFonts.customer = ['Manrope', 'Inter']; return x }],
    ['aktives Set geändert', (x) => { x.activeThemeSet = 'customer'; return x }],
    ['Typwechsel Objekt → Wert', (x) => { x.foundationOverrides.customer.radius = 'none'; return x }],
  ]
  const abweichungen = faelle.map(([name, f]) => {
    const stand = f(kopie(S))
    const abw = abweichungenBerechnen(stand, S)
    const zurueck = zusammenfuehren(S, abw)
    if (kanonischesJson(zurueck) !== kanonischesJson(stand)) throw new Error('Rundreise verletzt: ' + name)
    return { name, stand, erwartet: abw }
  })

  // Zusammenführen mit dem echten NEO-Standard: Ergebnis als Hash (kompakt, streng)
  const voll = standardDaten(STANDARD)
  const echt = []
  for (const [name, abw] of [
    ['leere Abweichung = Standard', {}],
    ['Kundenfarbe im hellen Modus', { activeThemeSet: 'customer', themes: { customer: { light: { 'background-accent': '#0055aa' } } } }],
    ['entfernter Schlüssel (Radius md im Set customer)', { foundationOverrides: { customer: { radius: { md: { [ENTFERNT]: true } } } } }],
  ]) {
    const daten = zusammenfuehren(voll, abw)
    echt.push({ name, abweichungen: abw, ergebnisSha256: await inhaltsHash(daten), auszug: { activeThemeSet: daten.activeThemeSet ?? null, 'themes.customer.light.background-accent': daten.themes?.customer?.light?.['background-accent'], 'foundationOverrides.customer.radius.md': daten.foundationOverrides?.customer?.radius?.md ?? null } })
  }

  // --- 3. Kontrast -------------------------------------------------------------
  const set = (abw) => { const d = zusammenfuehren(voll, abw); return d.themes[d.activeThemeSet || 'customer'] }
  const kontrastFaelle = [
    ['NEO-Standard (Set customer) besteht', set({ activeThemeSet: 'customer' })],
    ['weiße Schrift auf Fehler/Erfolg fällt durch (3,35:1)', set({ activeThemeSet: 'customer', themes: { customer: { light: { 'on-danger': '#ffffff', 'on-success': '#ffffff' } } } })],
    ['kurze Hex-Schreibweise #000 wird zu #000000 erweitert und bewertet', set({ activeThemeSet: 'customer', themes: { customer: { light: { 'text-primary': '#000' } } } })],
    ['nicht bewertbarer Wert (rgba) ergibt null und gilt als nicht bestanden', { light: { 'text-primary': 'rgba(0, 0, 0, 0.9)', 'background-base': '#ffffff' }, dark: {} }],
    ['knapp über 4,5:1 besteht (#767676 auf #ffffff = 4,54)', { light: { 'text-primary': '#767676', 'background-base': '#ffffff' }, dark: {} }],
    ['knapp unter 4,5:1 fällt durch (#777777 auf #ffffff = 4,48)', { light: { 'text-primary': '#777777', 'background-base': '#ffffff' }, dark: {} }],
    ['ungerundet vergleichen: 4,4995 zeigt 4.5, fällt aber durch', { light: { 'text-primary': '#767676', 'background-base': '#ffffef' }, dark: {} }],
    ['fehlende Rollen werden übersprungen', { light: { 'text-primary': '#000000', 'background-base': '#ffffff' }, dark: {} }],
  ]
  const kontrast = kontrastFaelle.map(([name, themes]) => ({ name, themes, erwartet: ohneZeit(pruefeKontrast(themes)) }))

  // --- 4. Schema und Größe ----------------------------------------------------
  const schemaFaelle = [
    ['leer ist gültig', {}],
    ['bekannte Schlüssel, Sets neo/customer', { activeThemeSet: 'customer', themes: { customer: { light: { 'text-primary': '#111111' } } }, typeScale: { neo: { base_max_px: 19 } } }],
    ['unbekannter Schlüssel', { unbekannt: { customer: {} } }],
    ['unbekanntes Set', { themes: { kunde: {} } }],
    ['activeThemeSet ungültig', { activeThemeSet: 'dark' }],
    ['Wert statt Objekt', { themes: 'blau' }],
    ['kein Objekt', ['a']],
  ]
  const schema = schemaFaelle.map(([name, abw]) => { const f = pruefeAbweichungen(abw); return { name, abweichungen: abw, gueltig: f.length === 0, fundstellen: f } })

  return {
    _meta: {
      beschreibung: 'Prüffälle für die Server-Umsetzung des Speicher-Vertrags 1.0.0 (ADR-002). Jede Umsetzung (PHP im Drupal-Modul) muss für jeden Fall dasselbe Ergebnis liefern wie die Referenz in apps/theme-configurator/src/speicher/. Erzeugt von scripts/erzeuge-pruefvektoren.mjs – nicht von Hand ändern.',
      vertrag: '1.0.0',
      referenz: {
        kanonischesJson: 'apps/theme-configurator/src/speicher/inhalts-hash.js',
        abweichungen: 'apps/theme-configurator/src/speicher/abweichungen.js',
        kontrast: 'apps/theme-configurator/src/speicher/kontrast.js + data/kontrast-paare.json',
        schema: 'docs/api/theme-konfigurator.openapi.yaml#/components/schemas/ThemeAbweichungen (Referenzprüfung: scripts/drupal-attrappe.mjs pruefeAbweichungen)',
      },
      hinweisePhp: [
        'JSON als Objekte dekodieren (json_decode($s, false)) oder leere Objekte gesondert behandeln – sonst wird {} zu [] und Hash und Abweichungen stimmen nicht.',
        'Kanonisch: Objektschlüssel rekursiv nach Codepunkten sortiert (strcmp), Listen unverändert, keine Leerzeichen, json_encode mit JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES.',
        'Zahlen wie JavaScript ausgeben: ganze Zahlen ohne Nachkommastellen (1 statt 1.0), sonst kürzeste Darstellung (serialize_precision = -1). Im Vertrag kommen nur Zeichenketten, Wahrheitswerte und kleine Zahlen vor.',
        'Kontrast: Verhältnis ungerundet mit „mindestens“ vergleichen; im Ergebnis auf 2 Nachkommastellen runden (kaufmännisch). Bewertbar sind Hex-Werte mit 6 Stellen und die Kurzform mit 3 Stellen (#abc = #aabbcc); alles andere (rgba, var(), color-mix …) ergibt verhaeltnis = null und bestanden = null, das Gesamtergebnis ist dann nicht bestanden. Rollen, die im Set fehlen, werden übersprungen; ohne ein einziges geprüftes Paar ist das Gesamtergebnis nicht bestanden.',
        'Schema: die Fundstellen-Texte sind Beispiele der Referenz; verbindlich ist gueltig (true/false).',
      ],
      groesse: { maxBytes: MAX_BYTES, status: 413, gemessen: 'Länge des Anfragekörpers in Bytes (UTF-8)' },
      standard: { datei: STANDARD_PFAD, version: standardVersion(STANDARD) },
    },
    hash,
    etag,
    abweichungen: { standard: S, faelle: abweichungen },
    zusammenfuehrenMitStandard: echt,
    kontrast,
    schema,
  }
}

const istHaupt = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]
if (istHaupt) {
  const text = JSON.stringify(await erzeuge(), null, 2) + '\n'
  if (process.argv.includes('--pruefen')) {
    const alt = existsSync(ZIEL) ? readFileSync(ZIEL, 'utf8') : ''
    if (alt !== text) { console.error('  ✗ data/pruefvektoren/speicher-vertrag.json ist veraltet — node scripts/erzeuge-pruefvektoren.mjs'); process.exit(1) }
    console.log('  ✓ Prüffälle aktuell.')
  } else {
    writeFileSync(ZIEL, text)
    const d = JSON.parse(text)
    console.log(`  ✓ Prüffälle geschrieben: ${d.hash.length} Hash, ${d.abweichungen.faelle.length} Abweichungen, ${d.zusammenfuehrenMitStandard.length} Zusammenführen, ${d.kontrast.length} Kontrast, ${d.schema.length} Schema`)
  }
}
