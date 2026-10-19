// Block 5e (19.10.2026): Sprache der Oberfläche nach BEGRIFFE.md — der Test
// hält, was der Block erreicht hat (UX-20, UX-25, UX-52, UX-53, UX-56).
import { describe, it, expect } from 'vitest'
import { resolve } from 'node:path'
import { vueDateien, sichtbareTexte, skriptDateien, skriptSaetze, ERSATZ, DU, ERSETZT } from './sichtbare-texte.js'
import { navigationTree } from '../../src/data/navigation-builder.js'
import { bereichsName, komponentenName, seitenTitel } from '../../src/navigation/namen.js'
import { sektionAufloesen } from '../../src/navigation/sektionen.js'

const SRC = resolve(__dirname, '../../src')
// Beispielinhalte der Website-Vorschau sind Website-Text, keine Bedienung
const AUSGENOMMEN = ['MagazinVorschau.vue']
const TEXTE = vueDateien(SRC).filter((p) => !AUSGENOMMEN.some((a) => p.endsWith(a))).flatMap((p) => sichtbareTexte(p, SRC))
const fund = (t) => `${t.datei}:${t.zeile} „${t.text.slice(0, 80)}“`

describe('Sichtbare Texte', () => {
  it('genug Texte erfasst (Plausibilität des Extraktors)', () => {
    expect(TEXTE.length).toBeGreaterThan(1000)
  })
  it('keine Ersatzschreibung statt Umlaut („fuer“, „Abstaende“ …)', () => {
    expect(TEXTE.filter((t) => ERSATZ.test(t.text)).map(fund)).toEqual([])
  })
  it('Anrede „Sie“ — keine Du-Formen', () => {
    expect(TEXTE.filter((t) => DU.test(t.text)).map(fund)).toEqual([])
  })
  it('keine Begriffe, die BEGRIFFE.md ersetzt hat', () => {
    expect(TEXTE.filter((t) => ERSETZT.some(([re]) => re.test(t.text))).map(fund)).toEqual([])
  })
})

describe('Meldungen aus Skripten', () => {
  // Beispielinhalte (Arena-Vorlagen, Magazin) sind Website-Text; generierte Daten bleiben außen vor
  const SAETZE = skriptDateien(SRC)
    .filter((p) => !/arena-templates|magazin-daten|MagazinVorschau|generated/.test(p))
    .flatMap((p) => skriptSaetze(p, SRC))
  it('Anrede „Sie“ auch in Dialogen und Fehlermeldungen', () => {
    expect(SAETZE.filter((t) => DU.test(t.text)).map(fund)).toEqual([])
  })
  it('keine Ersatzschreibung in Meldungen', () => {
    expect(SAETZE.filter((t) => ERSATZ.test(t.text)).map(fund)).toEqual([])
  })
})

describe('Navigation (UX-52, UX-53)', () => {
  const eintraege = []
  const lauf = (k) => { for (const n of k) { if (n.section) eintraege.push(n); if (n.children) lauf(n.children) } }
  lauf(navigationTree)

  it('Ebenen deutsch (Entscheidung E4)', () => {
    expect(navigationTree.map((g) => g.label)).toEqual(expect.arrayContaining(['Grundlagen', 'Objekte', 'Atome', 'Moleküle', 'Organismen']))
  })
  it('jeder Bereich genau einmal', () => {
    const doppelt = eintraege.map((e) => e.section).filter((s, i, a) => a.indexOf(s) !== i)
    expect(doppelt).toEqual([])
  })
  it('keine Kürzel in Komponentennamen (Entscheidung E5)', () => {
    expect(eintraege.filter((e) => /\b(Tbl|Nav|Kbd|Otp|Cta|Faq)\b/.test(e.label)).map((e) => e.label)).toEqual([])
    expect(komponentenName('tbl-cell')).toBe('Table Cell')
    expect(komponentenName('card-grid-cta')).toBe('Card Grid CTA')
    expect(komponentenName('link-with-arrow')).toBe('Link with Arrow')
  })
  it('Seitenleiste, Breadcrumb und Seitentitel tragen denselben Namen', () => {
    for (const id of ['foundation-radius', 'foundation-shadows', 'component-tbl-cell']) {
      const name = bereichsName(id)
      expect(eintraege.find((e) => e.section === id)?.label, id).toBe(name)
      expect(sektionAufloesen(id).label, id).toBe(name)
      expect(seitenTitel(id)).toBe(`${name} – Theme-Konfigurator`)
    }
    expect(bereichsName('foundation-radius')).toBe('Eckenradien')
    expect(bereichsName('foundation-shadows')).toBe('Schatten')
  })
})
