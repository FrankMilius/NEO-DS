// Doku-Agent (E7): neue Oberflächentexte gegen BEGRIFFE.md. Die Fälle unten
// stammen aus der Widersacher-Prüfung vom 21.10.2026 (übersehene Verstöße und
// Fehlalarme der ersten, zeilenbasierten Fassung).
import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { ersetzteBegriffe, erlaubteWendungen, pruefe, neueTexte, relevanteDatei } from '../../scripts/doku/begriffe.mjs'
import { texteAusVue, texteAusJs, istText } from '../../scripts/doku/lib/texte.mjs'

const md = readFileSync(new URL('../../apps/theme-configurator/BEGRIFFE.md', import.meta.url), 'utf8')
const begriffe = ersetzteBegriffe(md)
const erlaubt = erlaubteWendungen(md)
const nur = (l) => l.map((t) => t.text)
const vue = (vorlage, skript = '') => `<template>\n${vorlage}\n</template>\n<script setup>\n${skript}\n</script>\n`
const hinweis = (text) => pruefe([{ datei: 'x.vue', zeile: 1, text }], begriffe, erlaubt).map((h) => `${h.art}:${h.begriff}`)

describe('BEGRIFFE.md lesen', () => {
  it('„Ersetzt“ samt Zitaten; „Neo / Customer“ bleibt eine Wendung', () => {
    expect(begriffe).toEqual(expect.arrayContaining(['Override', 'Inspector', 'Save', 'Nicht in Drupal gespeichert', 'Neo / Customer']))
    expect(begriffe).not.toContain('Neo')
    expect(begriffe).not.toContain('–')
  })
  it('erlaubte Wendungen aus „Neu“', () => {
    expect(erlaubt).toEqual(expect.arrayContaining(['Weitere Aktionen', 'Weitere Einstellungen']))
  })
})

describe('Texte auslesen (Vue-Compiler, Babel)', () => {
  it('mehrzeiliger Text zwischen Tags', () => {
    expect(nur(texteAusVue(vue('<button>\n  Save\n</button>')))).toContain('Save')
  })
  it('Einzelwort in Zeichenkette im Skript', () => {
    expect(nur(texteAusVue(vue('<p/>', "const label = 'Inspector'\nconst t = { title: 'Save' }")))).toEqual(expect.arrayContaining(['Inspector', 'Save']))
  })
  it('Bindungen sichtbarer Attribute und {{ }} mit Text', () => {
    const t = nur(texteAusVue(vue('<b :title="\'Override zurücksetzen\'" :aria-label="dirty ? \'Save all\' : \'Fertig\'">{{ n }} Overrides</b>')))
    expect(t).toEqual(expect.arrayContaining(['Override zurücksetzen', 'Save all', '… Overrides']))
  })
  it('Template-String und Zeichenkette mit Klammern', () => {
    expect(nur(texteAusJs('const a = `${n} Overrides`; const b = \'Abweichung (Override) entfernen\''))).toEqual(['… Overrides', 'Abweichung (Override) entfernen'])
  })
  it('kein Code zwischen zwei Zeichenketten, keine Schlüssel, Klassen, Pfade, technische Aufrufe', () => {
    const t = nur(texteAusJs("const k = [['Kopieren', 'Strg'], [SYMBOLE.loeschen, 'Löschen']]\nimport x from '../ui/Save.vue'\nel.querySelector('.Save button')\nconst o = { 'Override': 1, cls: 'nc-button nc-button--sm' }"))
    expect(t).toEqual(['Kopieren', 'Strg', 'Löschen'])
  })
  it('eigene Props, @click-Argumente, v-for-Listen, CSS content, keine Doppelmeldung bei {{ }}', () => {
    const q = vue('<Dialog titel="Das Theme wurde geändert" :knopf-text="neu ? \'Anlegen\' : \'Speichern\'" @click="zeige(\'Gespeichert um …\')"><b v-for="a in [\'Muster\', \'Auf der Seite\']">x</b><p>{{ n }} Overrides gefunden</p></Dialog>') + '<style>.x::after { content: \'Bei dieser Breite ausgeblendet\' }</style>'
    const t = nur(texteAusVue(q))
    expect(t).toEqual(expect.arrayContaining(['Das Theme wurde geändert', 'Anlegen', 'Speichern', 'Gespeichert um …', 'Muster', 'Auf der Seite', '… Overrides gefunden', 'Bei dieser Breite ausgeblendet']))
    expect(t.filter((x) => /Overrides/.test(x))).toEqual(['… Overrides gefunden'])
  })
  it('Fehlermeldungen, toast, watch-Rümpfe, setAttribute-Wert — nur das erste Argument technischer Aufrufe fällt weg', () => {
    const t = nur(texteAusJs("throw new Error('NEO-Standard fehlt.')\ntoast.add({ summary: 'Gespeichert', detail: 'Alles da' })\nwatch(x, () => { status.value = 'Wird geladen …' })\nel.setAttribute('aria-label', 'Menü öffnen')\nemit('melde', 'Theme gespeichert')"))
    expect(t).toEqual(expect.arrayContaining(['NEO-Standard fehlt.', 'Gespeichert', 'Alles da', 'Wird geladen …', 'Menü öffnen', 'Theme gespeichert']))
    expect(t).not.toContain('aria-label')
  })
  it('CSS-Zeichenketten sind kein Text', () => {
    expect(istText('color: red')).toBe(false)
    expect(istText('html,body{height:auto!important;overflow:hidden}')).toBe(false)
    expect(istText('(max-width: 1199px)')).toBe(false)
  })
  it('class, id und data-* sind kein Text', () => {
    expect(nur(texteAusVue(vue('<button class="dt-oeffnen dt-oeffnen--neo" data-test="Save">Öffnen</button>')))).toEqual(['Öffnen'])
  })
  it('istText', () => {
    expect(istText('nc-button')).toBe(false)
    expect(istText('--fnd-color')).toBe(false)
    expect(istText('nc-button nc-button--sm')).toBe(false)
    expect(istText(':root, .neo-light-theme, .neo-dark-theme')).toBe(false)
    expect(istText('--fnd-spacing-…: …;')).toBe(false)
    expect(istText('(prefers-color-scheme: dark)')).toBe(false)
    expect(istText('Grid-Gap (…px) ist größer als Container-Padding (…px).')).toBe(true)
    expect(istText('Save')).toBe(true)
    expect(istText('override aktiv')).toBe(true)
  })
})

describe('pruefe', () => {
  it('Plural, Bindestrich-Wort und Kleinschreibung', () => {
    expect(hinweis('3 Overrides')).toEqual(['ersetzt:Override'])
    expect(hinweis('Override-Wert')).toEqual(['ersetzt:Override'])
    expect(hinweis('override aktiv')).toEqual(['ersetzt:Override'])
  })
  it('längster Begriff zuerst, keine doppelte Meldung', () => {
    expect(hinweis('Border Radius')).toEqual(['ersetzt:Border Radius'])
  })
  it('erlaubte Wendungen und gewöhnliches Deutsch', () => {
    expect(hinweis('Weitere Aktionen')).toEqual([])
    expect(hinweis('Weitere Farben hinzufügen')).toEqual(['ersetzt:Weitere'])
    expect(hinweis('Akzent · Neo Lime')).toEqual(['ersetzt:Neo Lime'])   // nur beim NEO-Standard richtig — der Agent ordnet ein
  })
  it('kurze erlaubte Wörter heben längere ersetzte Wendungen nicht auf', () => {
    expect(hinweis('NEO Theme laden')).toEqual(['ersetzt:NEO Theme'])
    expect(hinweis('Component Tokens')).toEqual(['ersetzt:Component Tokens'])
    expect(hinweis('Debug-Rahmen zeigen')).toEqual(['ersetzt:Debug-Rahmen'])
    expect(hinweis('Nicht in Drupal gespeichert')).toEqual(['ersetzt:Nicht in Drupal gespeichert'])
  })
  it('Du-Anrede in allen Schreibungen, auch mit Umlaut', () => {
    expect(hinweis('Du hast es geändert')).toEqual(['anrede:Du'])
    expect(hinweis('Deine Farbe')).toEqual(['anrede:Deine'])
    expect(hinweis('Öffne die Datei')).toEqual(['anrede:Öffne'])
    expect(hinweis('Ändere die Werte dort')).toEqual(['anrede:Ändere'])
    expect(hinweis('Bitte wähle eine Farbe')).toEqual(['anrede:wähle'])
    expect(hinweis('Wählen Sie eine Farbe')).toEqual([])
  })
  it('fehlende Umlaute (bekannte Wortstämme)', () => {
    expect(hinweis('Schluessel fuer Farbtoene')).toEqual(['umlaut:Schluessel'])
    expect(hinweis('ausserhalb der Strasse')).toEqual(['umlaut:ausserhalb'])
    expect(hinweis('neue aktuelle Quelle')).toEqual([])
  })
})

describe('neue Texte und Dateiauswahl', () => {
  it('nur Texte, die im neuen Stand dazukommen — auch in neuen Dateien', () => {
    expect(nur(neueTexte('a.vue', vue('<p>Alt</p>'), vue('<p>Alt</p><p>Save changes</p>')))).toEqual(['Save changes'])
    expect(nur(neueTexte('a.vue', '', vue('<p>Save changes</p>')))).toEqual(['Save changes'])
  })
  it('Bühnentexte, Tests und generierte Dateien zählen nicht', () => {
    expect(relevanteDatei('apps/theme-configurator/src/components/x.vue')).toBe(true)
    expect(relevanteDatei('apps/theme-configurator/src/arena-templates/item.js')).toBe(false)
    expect(relevanteDatei('apps/theme-configurator/src/data/tokens.generated.js')).toBe(false)
    expect(relevanteDatei('apps/theme-configurator/tests/a.test.js')).toBe(false)
  })
})
