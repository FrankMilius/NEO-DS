/**
 * Prüffälle für die Server-Umsetzung (data/pruefvektoren/speicher-vertrag.json,
 * ADR-002, Anforderung 3): Die Datei ist der gemeinsame Maßstab für App und
 * Drupal-Modul (PHP). Dieser Test spielt jeden Fall gegen die Referenz der App
 * — so fällt auf, wenn sich die App ändert, die Datei aber nicht (oder
 * umgekehrt). Neu erzeugen: npm run drupal:pruefvektoren
 */
import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { kanonischesJson, inhaltsHash, alsEtag } from '../../src/speicher/inhalts-hash.js'
import { abweichungenBerechnen, zusammenfuehren } from '../../src/speicher/abweichungen.js'
import { pruefeKontrast } from '../../src/speicher/kontrast.js'
import { standardDaten } from '../../src/speicher/standard.js'
import { pruefeAbweichungen, MAX_BYTES } from '../../../../scripts/drupal-attrappe.mjs'
import { erzeuge } from '../../../../scripts/erzeuge-pruefvektoren.mjs'

const WURZEL = resolve(__dirname, '../../../..')
const DATEI = resolve(WURZEL, 'data/pruefvektoren/speicher-vertrag.json')
const V = JSON.parse(readFileSync(DATEI, 'utf8'))
const STANDARD = standardDaten(JSON.parse(readFileSync(resolve(WURZEL, V._meta.standard.datei), 'utf8')))
const ohneZeit = (k) => ({ bestanden: k.bestanden, verfahren: k.verfahren, ergebnisse: k.ergebnisse })

describe('Prüfvektoren Speicher-Vertrag 1.0.0', () => {
  it('Datei ist aktuell (Generator erzeugt denselben Inhalt)', async () => {
    expect(JSON.stringify(await erzeuge(), null, 2) + '\n').toBe(readFileSync(DATEI, 'utf8'))
  })

  it('Metadaten: Vertrag, Größenlimit, PHP-Hinweise', () => {
    expect(V._meta.vertrag).toBe('1.0.0')
    expect(V._meta.groesse.maxBytes).toBe(MAX_BYTES)
    expect(V._meta.hinweisePhp.length).toBeGreaterThanOrEqual(4)
  })

  describe('kanonisches JSON und Hash', () => {
    for (const f of V.hash) {
      it(f.name, async () => {
        expect(kanonischesJson(f.eingabe)).toBe(f.kanonisch)
        expect(await inhaltsHash(f.eingabe)).toBe(f.sha256)
      })
    }
    it('ETag', async () => {
      expect(alsEtag(await inhaltsHash(V.etag.eingabe))).toBe(V.etag.etag)
    })
  })

  describe('Abweichungen (Rundreise)', () => {
    for (const f of V.abweichungen.faelle) {
      it(f.name, () => {
        expect(abweichungenBerechnen(f.stand, V.abweichungen.standard)).toEqual(f.erwartet)
        expect(kanonischesJson(zusammenfuehren(V.abweichungen.standard, f.erwartet))).toBe(kanonischesJson(f.stand))
      })
    }
  })

  describe('Zusammenführen mit dem NEO-Standard', () => {
    for (const f of V.zusammenfuehrenMitStandard) {
      it(f.name, async () => {
        expect(await inhaltsHash(zusammenfuehren(STANDARD, f.abweichungen))).toBe(f.ergebnisSha256)
      })
    }
  })

  describe('Kontrast', () => {
    for (const f of V.kontrast) {
      it(f.name, () => expect(ohneZeit(pruefeKontrast(f.themes))).toEqual(f.erwartet))
    }
    it('deckt bestanden und nicht bestanden ab, inkl. Rundungsfalle', () => {
      const werte = V.kontrast.map(f => f.erwartet.bestanden)
      expect(werte).toContain(true)
      expect(werte).toContain(false)
      const falle = V.kontrast.find(f => /ungerundet/.test(f.name))
      expect(falle.erwartet.ergebnisse[0]).toMatchObject({ verhaeltnis: 4.5, bestanden: false })
    })
  })

  describe('Schema', () => {
    for (const f of V.schema) {
      it(f.name, () => expect(pruefeAbweichungen(f.abweichungen).length === 0).toBe(f.gueltig))
    }
  })
})
