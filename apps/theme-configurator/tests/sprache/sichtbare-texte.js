// Sichtbare Texte aus Vue-Templates (Block 5e, 19.10.2026): Textknoten und
// die Attribute, die Menschen lesen (title, aria-label, placeholder, alt,
// label). Kommentare, <script>, <style> und Mustache-Ausdrücke entfallen;
// statische Teile von Template-Strings in :aria-label/:title bleiben.
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'

export function vueDateien (ordner) {
  const aus = []
  for (const name of readdirSync(ordner)) {
    const p = join(ordner, name)
    if (statSync(p).isDirectory()) aus.push(...vueDateien(p))
    else if (name.endsWith('.vue')) aus.push(p)
  }
  return aus
}

function templateTeil (quelle) {
  const start = quelle.indexOf('<template')
  const ende = quelle.lastIndexOf('</template>')
  return start < 0 || ende < 0 ? '' : quelle.slice(start, ende)
}

const ATTRIBUTE = /\s:?(?:title|aria-label|placeholder|alt|label|aria-description)=("([^"]*)"|'([^']*)')/g

/** @returns {Array<{ datei: string, zeile: number, text: string }>} */
export function sichtbareTexte (pfad, wurzel) {
  const roh = templateTeil(readFileSync(pfad, 'utf8'))
  const ohneKommentare = roh.replace(/<!--[\s\S]*?-->/g, (m) => m.replace(/[^\n]/g, ' '))
  const aus = []
  const zeileVon = (i) => ohneKommentare.slice(0, i).split('\n').length
  // Textknoten zwischen Tags
  for (const m of ohneKommentare.matchAll(/>([^<>]+)</g)) {
    const text = m[1].replace(/\{\{[\s\S]*?\}\}/g, ' ').replace(/\s+/g, ' ').trim()
    if (text && /[A-Za-zÄÖÜäöüß]{2}/.test(text)) aus.push({ datei: relative(wurzel, pfad), zeile: zeileVon(m.index), text })
  }
  // Attribute
  for (const m of ohneKommentare.matchAll(ATTRIBUTE)) {
    let text = m[2] ?? m[3] ?? ''
    if (m[0].includes(':')) {
      // gebundenes Attribut: nur Zeichenketten-Literale und statische Teile von Template-Strings
      const teile = [...text.matchAll(/'([^']*)'|`([^`]*)`/g)].map((t) => (t[1] ?? t[2] ?? '').replace(/\$\{[^}]*\}/g, ' '))
      text = teile.join(' ')
    }
    text = text.replace(/\s+/g, ' ').trim()
    if (text && /[A-Za-zÄÖÜäöüß]{2}/.test(text)) aus.push({ datei: relative(wurzel, pfad), zeile: zeileVon(m.index), text })
  }
  return aus
}

/** Ersatzschreibung statt Umlaut, als ganze deutsche Wörter (Auswahl der Fundstellen). */
export const ERSATZ = /\b(fuer|ueber|Ueber|koennen|koennte|muessen|moeglich|Moeglich|waehlen|Waehlen|aendern|Aendern|geaendert|Aenderung|Aenderungen|Abstaende|Abstaenden|Groesse|Groessen|groesser|Hoehe|Breite?n? ?fuer|Schluessel|zurueck|Zurueck|naechste|naechsten|spaeter|Spaeter|gueltig|ungueltig|Schriftgroesse|Oberflaeche|Flaeche|Flaechen|Eintraege|Vorschlaege|hinzufuegen|Hinzufuegen|loeschen|Loeschen|oeffnen|Oeffnen|schliessen|Schliessen|aussen|Aussen|Zusaetzliche|zusaetzlich|benoetigt|ausgewaehlt|Ausgewaehlt|verfuegbar|Verfuegbar|Hintergruende|Ueberschrift|Ueberschriften|grundsaetzlich|Kontrastverhaeltnis|Verhaeltnis|Seitenverhaeltnis|Seitenverhaeltnisse|Tastenkuerzel|Kuerzel)\b/

/** Du-Formen in der Ansprache (Anrede „Sie“, BEGRIFFE.md). */
export const DU = /\b(du|Du|dir|Dir|dich|dein|deine|deinen|deinem|deiner|Dein|Deine|wähle|Wähle|ändere|Ändere|klicke|Klicke|prüfe|Prüfe|speichere|Speichere|öffne|Öffne|lade|Lade|füge|Füge|nutze|Nutze|siehst|kannst|musst|hast|bist|willst|möchtest)\b/

/** Begriffe, die laut BEGRIFFE.md ersetzt sind (in sichtbaren Texten). */
export const ERSETZT = [
  [/\bNEO Theme\b|\bNeo Theme\b|\bNEO-Theme\b|\bStandard-Theme\b/, 'NEO-Standard'],
  [/\bReset to Defaults\b|\bWerkseinstellung(en)?\b/, 'Auf NEO-Standard zurücksetzen'],
  [/\bInspector\b/, 'Einstellungen'],
  [/\bTheme Arena\b|\bLaboratory\b/, 'Bühne'],
  [/\bPrimitive Colors\b/, 'Grundfarben'],
  [/\bSemantic Colors\b/, 'Farbrollen'],
  [/\bSync Geometry\b/, 'Geometrie für Hell und Dunkel gleich'],
  [/\bShow All\b|\bFiltered\b/, 'Alle zeigen / Gefiltert'],
  [/\bmodified\b/, 'geändert'],
  [/^(New|Save|Export|Merge|Undo|Redo|Reset|Cancel|Delete|Close|Apply|Add|Remove|Edit|Search)$/, 'deutsche Aktion'],
  [/\bExport JSON\b/, 'Exportieren (ein Einstieg)'],
  [/\bPosition & Layout\b|\bEffects & States\b|^Fill$|^Advanced$/, 'Abschnittsnamen der Einstellungen'],
  [/\bTbl\b/, 'ausgeschriebener Komponentenname'],
]

/**
 * Meldungen aus Skripten: Zeichenketten mit mindestens zwei Leerzeichen
 * (Sätze), ohne Kommentarzeilen und ohne ${…}-Platzhalter.
 * @returns {Array<{ datei: string, zeile: number, text: string }>}
 */
export function skriptSaetze (pfad, wurzel) {
  let code = readFileSync(pfad, 'utf8')
  if (pfad.endsWith('.vue')) code = (code.match(/<script[^>]*>([\s\S]*?)<\/script>/) || ['', ''])[1]
  const aus = []
  code.split('\n').forEach((zeile, i) => {
    const z = zeile.trim()
    if (z.startsWith('//') || z.startsWith('*') || z.startsWith('/*')) return
    for (const m of zeile.matchAll(/'([^'\n]*)'|`([^`]*)`/g)) {
      const text = (m[1] ?? m[2] ?? '').replace(/\$\{[^}]*\}/g, ' ')
      if ((text.match(/ /g) || []).length >= 2) aus.push({ datei: relative(wurzel, pfad), zeile: i + 1, text })
    }
  })
  return aus
}

export function skriptDateien (ordner) {
  const aus = []
  for (const name of readdirSync(ordner)) {
    const p = join(ordner, name)
    if (statSync(p).isDirectory()) aus.push(...skriptDateien(p))
    else if (/\.(js|vue)$/.test(name)) aus.push(p)
  }
  return aus
}
