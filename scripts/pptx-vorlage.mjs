// ==========================================================================
// PowerPoint-Vorlage aus dem Tokensatz erzeugen
// ==========================================================================
// Erzeugt den Master als .pptx — in ZWEI Dichtestufen, je eine Datei:
//
//   NEO-Master-Vortrag.pptx   projiziert, Sprecher anwesend, Titelzone 40 mm
//   NEO-Master-Versand.pptx   gelesen ohne Sprecher, Titelzone 32 mm
//
// Gleiche Layouts, gleiche Namen, andere Groessen. Raster, Groessen,
// Statusfarben und Diagrammfarbfolge stammen aus
// data/design-tokens.json → foundation.praesentation. Die Vorlage aendert
// sich damit mit den Tokens statt mit jemandes Gedaechtnis.
//
//   npm run pptx:vorlage                     beide Master schreiben
//   node scripts/pptx-vorlage.mjs vortrag    nur eine Stufe
//   npm run pptx:beispiel                    sieben Beispieldecks daraus
//   npm run pptx:pruefen                     Pruefschranke (Layouts, Zonen,
//                                            Theme, Kontraste, Ersatzmarken)
//   npm run pptx                             alles drei nacheinander
//
// DIE 91 LAYOUTS, in zehn Familien (Katalog: .artifact-build/foliensystem.html)
//   Rahmen    T1 T2 T3 T4 · AG1 AG2 · A1 A2 A3 · Z1 Z2 Z3 Z4 Z5 Z6
//   Aussage   X1 X4 X5 X6 · Q1 · K1
//   Text      X2 X3 X7 X8 X9
//   Bild      B1 B2 B3 B4 B5 B6 B7 · V1
//   Produkt   S1 S2 S3 S4 S5 S6 S7 · G1 · R1 R3 · LG1
//   Konzept   C1 C2 C3 C4 C5 C6 C7 C8 C9 · P1 P2 P3
//   Daten     K2 K3 K4 · D1 D2 D3 D4 D5 D6 D7 D8 D9 D10 · TB1 TB2 TB3 TB4
//   Plan      L1 L2 L3 L4 L5 L6 L7 L8 L9 L10
//   Menschen  M1 M2 M3
//   Anhang    AN1 AN2 AN3 AN4
// Namensschema KUERZEL_NAME, deutsch. Die Reihenfolge im Master ist die
// Reihenfolge der def()-Aufrufe unten; PowerPoint zeigt sie so im Layoutmenue.
//
// WARUM .pptx UND NICHT .potx
// pptxgenjs schreibt kein Template-Format. Der letzte Schritt ist einmalig
// von Hand: In PowerPoint oeffnen, "Speichern unter" -> PowerPoint-Vorlage.
// Die Master sind dann vollstaendig enthalten.
//
// WAS NACH DEM SCHREIBEN INS XML KOMMT
// pptxgenjs kennt weder ein Datumsfeld noch Theme-Farben noch Kreise in
// Master-Definitionen. Alles drei wird nach dem Schreiben im Archiv
// nachgetragen: datumsfeldEinsetzen(), themeEinsetzen(), kreiseEinsetzen().
// Das Theme traegt accent1–6 und die Schriften — damit bekommt ein
// Diagramm, das jemand in PowerPoint einfuegt, die Farbfolge aus dem
// Tokensatz, ohne dass jemand daran denken muss.
//
// WAS IM MASTER STEHT UND WAS DAS DECK ZEICHNET
// Der Master gibt Titel, Platzhalter, Haarlinien und feste Formen. Alles,
// was von der Anzahl der Inhalte abhaengt (Monate, Zeilen, Optionen,
// Diagrammwerte), zeichnet das Deck — die Renderer je Layout stehen in
// pptx-beispiel.mjs und nennen ihre Datenfelder als Kommentar.
// ==========================================================================

import PptxGenJS from 'pptxgenjs';
import { readFileSync, mkdirSync } from 'fs';
import { resolve, dirname, join } from 'path';

const WURZEL = resolve(import.meta.dirname, '..');
const tokens = JSON.parse(readFileSync(join(WURZEL, 'data/design-tokens.json'), 'utf8'));
const PRAES = tokens.foundation.praesentation;
if (!PRAES) throw new Error('foundation.praesentation fehlt in data/design-tokens.json');

// ── Farben aus dem Tokensatz, ohne Raute (pptxgenjs-Konvention) ───────────
const roh = tokens.primitives.neutralleitern;
const ohne = (h) => String(h).replace('#', '').toUpperCase();
const leiter = (name) => Object.fromEntries(
  Object.entries(roh[name].shades).map(([stufe, wert]) => [stufe, ohne(wert)])
);

export const G = leiter('graphit');
export const PAPIER = {
  graphit: G,
  beige: leiter('beige'),
  ivory: leiter('ivory'),
  taupe: leiter('warm-taupe'),
  pearl: leiter('pearl-white'),
  mint: leiter('mint'),
};
export const FOREST = leiter('forest');
export const AKZENT = leiter('lime');
export const EBENE = {
  menschen: 'F39100', wissen: 'A1C513', systeme: 'E5007D', daten: '009EE3',
};

// Verweise wie "success.600", "graphit.400" oder "lime.500" aufloesen.
// Graphit und Lime liegen in eigenen Leitern, Gruen/Gelb/Rot in
// primitives.system — die Schreibweise im Tokensatz ist fuer alle gleich.
export function farbe(ref) {
  const [palette, stufe] = String(ref).split('.');
  if (palette === 'graphit') return G[stufe];
  if (palette === 'lime') return AKZENT[stufe];
  if (PAPIER[palette]) return PAPIER[palette][stufe];
  if (roh[palette]) return ohne(roh[palette].shades[stufe]);
  const sys = tokens.primitives.system[palette];
  if (!sys) throw new Error(`Unbekannte Palette in foundation.praesentation: ${ref}`);
  return ohne(sys.shades[stufe]);
}

// Statusfarben je Grund, aufgeloest: STATUS.hell.gruen.marke → 'RRGGBB'
export const STATUS = Object.fromEntries(['hell', 'tief'].map((grund) => [
  grund,
  Object.fromEntries(Object.entries(PRAES.status[grund]).map(([name, s]) => [
    name, { marke: farbe(s.marke), text: farbe(s.text), bedeutung: PRAES.status.bedeutung[name] },
  ])),
]));

export const DIAGRAMM = {
  farbfolge: PRAES.diagramm.farbfolge.map(farbe),
  hervorhebung: farbe(PRAES.diagramm.hervorhebung),
  achse: farbe(PRAES.diagramm.achse),
  beschriftung: farbe(PRAES.diagramm.beschriftung),
};

// ── Schriften aus foundation.typography.fonts ─────────────────────────────
const F = {
  marke: 'Space Grotesk',
  info: 'Manrope',
  technik: 'JetBrains Mono',
};

// ── Raster ────────────────────────────────────────────────────────────────
// 16:9 = 13,333 x 7,5 Zoll. Raster aus Kapitel 08.3, Millimeter aus dem
// Tokensatz in Zoll umgerechnet:
//   Rand 16 mm = 0,630"   Steg 8 mm = 0,315"   Feld 44,45 mm = 1,750"
const ZOLL = (mm) => mm / 25.4;
export const BREITE = PRAES.format.breite_zoll, HOEHE = PRAES.format.hoehe_zoll;
const RAND = ZOLL(PRAES.raster_mm.rand);
const STEG = ZOLL(PRAES.raster_mm.steg);
const FELD = ZOLL(PRAES.raster_mm.feld);
export const x = (feld) => RAND + feld * (FELD + STEG);
export const w = (felder) => felder * FELD + (felder - 1) * STEG;

export const STUFEN = Object.keys(PRAES.dichtestufen);

// Was sich mit der Dichtestufe aendert: Titelzone und Schriftgrade.
// Alles andere (Rand, Steg, Feld) ist in beiden Stufen gleich.
export function geometrie(stufe = 'versand') {
  const s = PRAES.dichtestufen[stufe];
  if (!s) throw new Error(`Unbekannte Dichtestufe "${stufe}". Vorhanden: ${STUFEN.join(', ')}`);
  const TITELZONE = ZOLL(s.titelzone_mm);
  const INHALT_Y = RAND + TITELZONE;
  return {
    stufe, label: s.label, dateiname: s.dateiname,
    RAND, STEG, FELD, TITELZONE, INHALT_Y, INHALT_H: HOEHE - INHALT_Y - RAND,
    titelPt: s.titel_pt, textPt: s.text_pt, kickerPt: s.kicker_pt, fussPt: s.fuss_pt,
  };
}

// ── Wiederkehrende Bausteine ──────────────────────────────────────────────
// Eine Fabrik je Dichtestufe: Die Bausteine kennen Titelzone und Schriftgrad
// ihrer Stufe, die Layouts darunter bleiben fuer beide Stufen gleich.
export const COPYRIGHT = '© NEOCOSMO GmbH';

// FARBE JE GRUND, nicht eine fuer beide. Nachgerechnet am 26.08.2026:
//   Graphit 600 erreicht auf hell nur 4,18 und auf tief 3,83 — beides unter
//   der AA-Schwelle von 4,5 fuer Text dieser Groesse. Eine einzige Stufe
//   fuer beide Gruende gibt es nicht.
//   Auf hell traegt Graphit 700 (6,07), auf tief Graphit 400 (8,34).
const FUSSFARBE = { hell: G['700'], tief: G['400'] };

export function bausteine(stufe = 'versand') {
  const Z = geometrie(stufe);
  const { TITELZONE, INHALT_Y, INHALT_H, titelPt, textPt, kickerPt, fussPt } = Z;

  const kicker = (t, farbe = G['600']) => ({
    text: {
      text: t,
      options: { x: x(0), y: RAND, w: w(4), h: 0.26, fontFace: F.technik, fontSize: kickerPt,
                 color: farbe, charSpacing: 2, bold: false },
    },
  });

  // Fusszeile: Copyright links, Datum und Seitenzahl rechts.
  //
  // SEITENZAHL ist ein echtes Feld — pptxgenjs erzeugt ueber `slideNumber`
  // ein <a:fld type="slidenum">, das PowerPoint selbst fortzaehlt.
  //
  // DATUM kann pptxgenjs nicht: Die API kennt keinen Feldtyp. Der Platzhalter
  // {{DATUM}} wird deshalb nach dem Schreiben im XML gegen ein
  // <a:fld type="datetime1"> getauscht — siehe datumsfeldEinsetzen() unten.
  //
  // Das Copyright traegt bewusst KEINE Jahreszahl. Ein festes Jahr ist in
  // zwoelf Monaten falsch, und ein Feld dafuer gibt es nicht.
  const fusszeile = (dunkel = false) => {
    const farbe = dunkel ? FUSSFARBE.tief : FUSSFARBE.hell;
    return [
      { text: { text: COPYRIGHT, options: { x: x(0), y: HOEHE - 0.5, w: w(3), h: 0.24,
          fontFace: F.technik, fontSize: fussPt, color: farbe, charSpacing: 1.5 } } },
      { text: { text: '{{DATUM}}', options: { x: x(3.6), y: HOEHE - 0.5, w: w(1.4), h: 0.24,
          fontFace: F.technik, fontSize: fussPt, color: farbe, charSpacing: 1.2, align: 'right', lang: 'de-DE' } } },
    ];
  };

  // Seitenzahl als echtes Feld, rechts aussen, auf derselben Grundlinie.
  const seitenzahl = (dunkel = false) => ({
    x: BREITE - RAND - 0.55, y: HOEHE - 0.5, w: 0.55, h: 0.24,
    fontFace: F.technik, fontSize: fussPt, color: dunkel ? FUSSFARBE.tief : FUSSFARBE.hell, align: 'right',
  });

  const ueberschrift = (farbe = G['950'], felder = 5, feld = 0) => ({
    placeholder: {
      options: { name: 'titel', type: 'title', x: x(feld), y: RAND, w: w(felder), h: TITELZONE - 0.2,
                 fontFace: F.marke, fontSize: titelPt, bold: true, color: farbe,
                 charSpacing: -0.6, valign: 'top' },
      text: 'Folienüberschrift',
    },
  });

  const koerper = (feld, felder, y = INHALT_Y, h = INHALT_H, name = 'inhalt') => ({
    placeholder: {
      options: { name, type: 'body', x: x(feld), y, w: w(felder), h,
                 fontFace: F.info, fontSize: textPt, color: G['800'], lineSpacingMultiple: 1.45,
                 valign: 'top', bullet: false },
      text: 'Fließtext',
    },
  });

  const bildplatz = (feld, felder, y = INHALT_Y, h = INHALT_H) => ({
    placeholder: {
      options: { name: 'bild', type: 'pic', x: x(feld), y, w: w(felder), h,
                 line: { color: G['400'], width: 1 } },
      text: 'Bild',
    },
  });

  return { ...Z, kicker, fusszeile, seitenzahl, ueberschrift, koerper, bildplatz, F };
}

// ── Master-Definitionen ───────────────────────────────────────────────────
// Jeder Eintrag wird zu einem Layout. Reihenfolge = Reihenfolge im Master.
export function definiereMaster(pptx, papier = 'graphit', stufe = 'versand') {
  const P = PAPIER[papier];
  const GRUND = P['100'];
  const TIEF = G['950'];
  const gemacht = [];
  const H = bausteine(stufe);
  const { kicker, fusszeile, seitenzahl, ueberschrift, koerper, bildplatz,
          TITELZONE, INHALT_Y, INHALT_H, titelPt, textPt, kickerPt } = H;

  const def = (titel, spez) => {
    const dunkel = spez.background?.color === TIEF;
    // Seitenzahl ueberall ausser auf dem Signalfeld — dort gilt "eine
    // Aussage, sonst nichts" aus Kapitel 04.6.
    // ... und auf der Pause: Die schwarze Folie vor der Demo ist keine Seite.
    const mitZahl = ['T2_SIGNALFELD', 'Z6_PAUSE'].includes(titel)
      ? spez
      : { ...spez, slideNumber: seitenzahl(dunkel) };
    pptx.defineSlideMaster({ title: titel, ...mitZahl });
    gemacht.push(titel);
  };

  // Gemeinsame Platzhalter fuer Tabellen- und Listenlayouts (Familien L, X, Z).
  const monoPlatz = (name, feld, felder, y, h, hinweis) => ({
    placeholder: { options: { name, type: 'body', x: x(feld), y, w: w(felder), h,
      fontFace: F.technik, fontSize: kickerPt, color: G['600'], charSpacing: 1.5, bullet: false }, text: hinweis } });
  const tabellenPlatz = (hinweis, felder = 6) => ({
    placeholder: { options: { name: 'tabelle', type: 'body', x: x(0), y: INHALT_Y + 0.4, w: w(felder), h: INHALT_H - 0.4,
      fontFace: F.info, fontSize: textPt - 3, color: G['800'], lineSpacingMultiple: 1.6, bullet: false }, text: hinweis } });
  const kopfLinie = () => ({ line: { x: x(0), y: INHALT_Y + 0.3, w: w(6), h: 0, line: { color: G['950'], width: 1 } } });
  const bildRahmen = (name, feld, felder, y, h, hinweis = 'Bildschirmfoto') => ({
    placeholder: { options: { name, type: 'pic', x: x(feld), y, w: w(felder), h, line: { color: G['400'], width: 1 } }, text: hinweis } });

  // ── Titel (4) ───────────────────────────────────────────────────────────
  def('T1_TITEL_TIEF', {
    background: { color: TIEF },
    objects: [
      kicker('Intelligent Workplace', G['400']),
      { placeholder: { options: { name: 'titel', type: 'title', x: x(0), y: 2.1, w: w(5), h: 2.4,
          fontFace: F.marke, fontSize: 48, bold: true, color: G['100'], charSpacing: -1.4,
          lineSpacingMultiple: 1.0, valign: 'top' }, text: 'Die Aussage' } },
      ...fusszeile(true),
    ],
  });

  def('T2_SIGNALFELD', {
    background: { color: AKZENT['500'] },
    objects: [
      { placeholder: { options: { name: 'titel', type: 'title', x: x(0), y: 2.1, w: w(5), h: 2.4,
          fontFace: F.marke, fontSize: 48, bold: true, color: G['950'], charSpacing: -1.4,
          lineSpacingMultiple: 1.0, valign: 'top' }, text: 'Eine Aussage, sonst nichts' } },
    ],
  });

  def('T3_TITEL_BILD', {
    background: { color: TIEF },
    objects: [
      { placeholder: { options: { name: 'bild', type: 'pic', x: 0, y: 0, w: 5.6, h: HOEHE },
          text: 'Bild' } },
      kicker('Kundenstory', G['400']),
      { placeholder: { options: { name: 'titel', type: 'title', x: 6.3, y: 2.3, w: 6.3, h: 2.0,
          fontFace: F.marke, fontSize: 34, bold: true, color: G['100'], charSpacing: -1.0,
          valign: 'top' }, text: 'Name des Kunden' } },
    ],
  });

  def('T4_TITEL_KUNDE', {
    background: { color: TIEF },
    objects: [
      { placeholder: { options: { name: 'logo', type: 'pic', x: x(0), y: RAND, w: 1.6, h: 0.6 },
          text: 'Kundenlogo' } },
      kicker('Angebot', G['400']),
      { placeholder: { options: { name: 'titel', type: 'title', x: x(0), y: 2.6, w: w(5), h: 2.0,
          fontFace: F.marke, fontSize: 38, bold: true, color: G['100'], charSpacing: -1.1,
          valign: 'top' }, text: 'Vorhaben in einem Satz' } },
      ...fusszeile(true),
    ],
  });

  // ── Agenda (1) ──────────────────────────────────────────────────────────
  def('AG1_AGENDA', {
    background: { color: GRUND },
    objects: [ueberschrift(), koerper(0, 4), ...fusszeile()],
  });

  // ── Abschnitt (3) ───────────────────────────────────────────────────────
  def('A1_ABSCHNITT_TIEF', {
    background: { color: TIEF },
    objects: [
      kicker('03', AKZENT['500']),
      { placeholder: { options: { name: 'titel', type: 'title', x: x(0), y: 2.6, w: w(4), h: 1.6,
          fontFace: F.marke, fontSize: 40, bold: true, color: G['100'], charSpacing: -1.2,
          valign: 'top' }, text: 'Abschnittstitel' } },
      ...fusszeile(true)
    ],
  });

  def('A2_ABSCHNITT_PAPIER', {
    background: { color: GRUND },
    objects: [
      kicker('04 · Bereich'),
      { placeholder: { options: { name: 'titel', type: 'title', x: x(0), y: 2.6, w: w(4), h: 1.6,
          fontFace: F.marke, fontSize: 40, bold: true, color: G['950'], charSpacing: -1.2,
          valign: 'top' }, text: 'Abschnittstitel' } },
      ...fusszeile()
    ],
  });

  def('A3_ABSCHNITT_BAND', {
    background: { color: GRUND },
    objects: [
      { rect: { x: 0, y: 2.85, w: BREITE, h: 1.8, fill: { color: TIEF } } },
      { placeholder: { options: { name: 'titel', type: 'title', x: x(0), y: 3.2, w: w(5), h: 1.1,
          fontFace: F.marke, fontSize: 32, bold: true, color: G['100'], charSpacing: -0.9,
          valign: 'middle' }, text: 'Abschnittstitel' } },
      ...fusszeile()
    ],
  });

  // ── Text (3) ────────────────────────────────────────────────────────────
  def('X1_STATEMENT', {
    background: { color: GRUND },
    objects: [
      { placeholder: { options: { name: 'titel', type: 'title', x: x(0), y: 2.2, w: w(5), h: 2.4,
          fontFace: F.marke, fontSize: 36, bold: true, color: G['950'], charSpacing: -1.1,
          lineSpacingMultiple: 1.05, valign: 'top' }, text: 'Ein Satz, sonst nichts' } },
      ...fusszeile(),
    ],
  });

  def('X2_FLIESSTEXT', {
    background: { color: GRUND },
    objects: [ueberschrift(), koerper(0, 4), ...fusszeile()],
  });

  def('X3_ZWISCHENUEBERSCHRIFTEN', {
    background: { color: GRUND },
    objects: [
      ueberschrift(),
      koerper(0, 2, INHALT_Y, INHALT_H, 'block1'),
      koerper(2, 2, INHALT_Y, INHALT_H, 'block2'),
      koerper(4, 2, INHALT_Y, INHALT_H, 'block3'),
      ...fusszeile(),
    ],
  });

  // ── Aussage und Text (6) — Familien X des Foliensystems ────────────────
  // Kicker sind hier Platzhalter, keine festen Texte: Ein fester Text im
  // Master steht sonst auf jeder Folie unter dem Text des Decks.
  const kickerPlatz = (hinweis, farbe = G['600']) => ({
    placeholder: { options: { name: 'kicker', type: 'body', x: x(0), y: RAND, w: w(4), h: 0.26,
      fontFace: F.technik, fontSize: kickerPt, color: farbe, charSpacing: 2, bullet: false }, text: hinweis } });
  const grosserSatz = (hinweis, y = 2.2, h = 2.4, felder = 5, farbe = G['950']) => ({
    placeholder: { options: { name: 'titel', type: 'title', x: x(0), y, w: w(felder), h,
      fontFace: F.marke, fontSize: 36, bold: true, color: farbe, charSpacing: -1.1,
      lineSpacingMultiple: 1.05, valign: 'top' }, text: hinweis } });

  // X4 Big Idea: der eine Satz des Decks, darunter, was auf dem Spiel steht.
  def('X4_BIG_IDEA', {
    background: { color: GRUND },
    objects: [
      kickerPlatz('WORUM ES GEHT'),
      grosserSatz('Standpunkt in einem Satz', 2.0, 2.2, 4),
      koerper(0, 4, 4.4, 1.2, 'einsatz'),
      ...fusszeile(),
    ],
  });

  // X5 Frage: die Antwort kommt auf der naechsten Folie, nie auf dieser.
  def('X5_FRAGE', {
    background: { color: GRUND },
    objects: [kickerPlatz('ÜBERGANG'), grosserSatz('Offene Frage?', 2.2, 2.4, 4), ...fusszeile()],
  });

  // X6 Definition: Begriff links gross, Erklaerung rechts. Hoechstens eine je Deck.
  def('X6_DEFINITION', {
    background: { color: GRUND },
    objects: [
      kickerPlatz('BEGRIFF'),
      { placeholder: { options: { name: 'begriff', type: 'title', x: x(0), y: INHALT_Y, w: w(2), h: 1.6,
          fontFace: F.marke, fontSize: 32, bold: true, color: G['950'], charSpacing: -0.9, valign: 'top' }, text: 'Begriff' } },
      koerper(2.4, 3.6, INHALT_Y + 0.1, INHALT_H - 0.1, 'erklaerung'),
      ...fusszeile(),
    ],
  });

  // X7 Zwei Spalten: Ergaenzung, kein Gegensatz (dafuer C1).
  const spaltenKopf = (name, feld, felder, hinweis) => ({
    placeholder: { options: { name, type: 'body', x: x(feld), y: INHALT_Y, w: w(felder), h: 0.45,
      fontFace: F.marke, fontSize: textPt + 1, bold: true, color: G['950'], bullet: false }, text: hinweis } });
  def('X7_ZWEI_SPALTEN', {
    background: { color: GRUND },
    objects: [
      ueberschrift(),
      spaltenKopf('kopf1', 0, 2.8, 'Zwischenüberschrift'), koerper(0, 2.8, INHALT_Y + 0.55, INHALT_H - 0.55, 'text1'),
      spaltenKopf('kopf2', 3.2, 2.8, 'Zwischenüberschrift'), koerper(3.2, 2.8, INHALT_Y + 0.55, INHALT_H - 0.55, 'text2'),
      ...fusszeile(),
    ],
  });

  // X8 Liste: drei bis fuenf Punkte, je hoechstens zwei Zeilen, Marke statt
  // Aufzaehlungszeichen. Die Marken zeichnet das Deck.
  def('X8_LISTE', {
    background: { color: GRUND },
    objects: [ueberschrift(), koerper(0.25, 4, INHALT_Y, INHALT_H, 'punkte'), ...fusszeile()],
  });

  // X9 Zusammenfassung: Antwort zuerst — Empfehlung, drei Gruende, Konsequenz
  // als Zahl oder Termin rechts. Folie zwei in Angebot und Auswertung.
  def('X9_ZUSAMMENFASSUNG', {
    background: { color: GRUND },
    objects: [
      ueberschrift(),
      { placeholder: { options: { name: 'empfehlung', type: 'body', x: x(0), y: INHALT_Y, w: w(4), h: 0.9,
          fontFace: F.marke, fontSize: textPt + 3, bold: true, color: G['950'], lineSpacingMultiple: 1.15, valign: 'top', bullet: false },
          text: 'Empfehlung in einem Satz' } },
      koerper(0, 4, INHALT_Y + 1.05, INHALT_H - 1.05, 'gruende'),
      { placeholder: { options: { name: 'zahl', type: 'body', x: x(4.4), y: INHALT_Y, w: w(1.6), h: 1.2,
          fontFace: F.marke, fontSize: 40, bold: true, color: G['950'], charSpacing: -1.4, valign: 'top', bullet: false }, text: '00' } },
      monoPlatz('konsequenz', 4.4, 1.6, INHALT_Y + 1.3, 0.8, 'WAS DARAUS FOLGT'),
      ...fusszeile(),
    ],
  });

  // ── Text + Bild (4) ─────────────────────────────────────────────────────
  def('B1_BILD_RECHTS', {
    background: { color: GRUND },
    objects: [ueberschrift(), koerper(0, 3), bildplatz(3, 3), ...fusszeile()],
  });

  def('B2_BILD_LINKS', {
    background: { color: GRUND },
    objects: [
      { placeholder: { options: { name: 'titel', type: 'title', x: x(3), y: RAND, w: w(3), h: TITELZONE - 0.2,
          fontFace: F.marke, fontSize: titelPt - 2, bold: true, color: G['950'], charSpacing: -0.6, valign: 'top' },
          text: 'Folienüberschrift' } },
      bildplatz(0, 3), koerper(3, 3), ...fusszeile(),
    ],
  });

  def('B3_BILD_ANGESCHNITTEN', {
    background: { color: GRUND },
    objects: [
      { placeholder: { options: { name: 'bild', type: 'pic', x: 0, y: 0, w: BREITE, h: 3.9 }, text: 'Bild' } },
      { placeholder: { options: { name: 'titel', type: 'title', x: x(0), y: 4.25, w: w(4), h: 0.8,
          fontFace: F.marke, fontSize: titelPt - 4, bold: true, color: G['950'], charSpacing: -0.6, valign: 'top' },
          text: 'Folienüberschrift' } },
      koerper(0, 4, 5.15, 1.6),
      ...fusszeile(),
    ],
  });

  def('B4_BILD_AUSSCHNITT', {
    background: { color: GRUND },
    objects: [
      ueberschrift(),
      { placeholder: { options: { name: 'bild', type: 'pic', x: x(0), y: INHALT_Y, w: w(2), h: w(2),
          line: { color: G['400'], width: 1 } }, text: 'Bild 1∶1' } },
      koerper(2, 4),
      ...fusszeile(),
    ],
  });

  // ── Bild (3) — B5 bis B7 des Foliensystems ─────────────────────────────
  // B5 Bildraster: vier Bilder gleich gross, gleiche Bildsprache, je eine Unterschrift.
  const RASTER_H = (INHALT_H - 0.6) / 2;
  def('B5_BILDRASTER', {
    background: { color: GRUND },
    objects: [
      ueberschrift(),
      ...[0, 1, 2, 3].flatMap((i) => {
        const feld = (i % 2) * 3, y = INHALT_Y + Math.floor(i / 2) * (RASTER_H + 0.3);
        return [bildRahmen(`bild${i + 1}`, feld, 2.8, y, RASTER_H - 0.3, 'Bild'), monoPlatz(`unterschrift${i + 1}`, feld, 2.8, y + RASTER_H - 0.26, 0.26, 'BILDUNTERSCHRIFT')];
      }),
      ...fusszeile(),
    ],
  });

  // B6 Vorher und Nachher: gleicher Ausschnitt, gleiches Licht — sonst
  // vergleicht das Publikum die Fotografie, nicht den Zustand.
  def('B6_VORHER_NACHHER', {
    background: { color: GRUND },
    objects: [
      ueberschrift(),
      monoPlatz('kicker1', 0, 2.8, INHALT_Y, 0.26, 'VORHER'), bildRahmen('vorher', 0, 2.8, INHALT_Y + 0.35, INHALT_H - 0.7, 'Vorher'),
      monoPlatz('kicker2', 3.2, 2.8, INHALT_Y, 0.26, 'NACHHER'), bildRahmen('nachher', 3.2, 2.8, INHALT_Y + 0.35, INHALT_H - 0.7, 'Nachher'),
      koerper(0, 2.8, INHALT_Y + INHALT_H - 0.3, 0.3, 'text1'), koerper(3.2, 2.8, INHALT_Y + INHALT_H - 0.3, 0.3, 'text2'),
      ...fusszeile(),
    ],
  });

  // B7 Vollbild mit Tafel: Text liegt auf einer Tafel in Papierfarbe, nie auf dem Bild.
  const TAFEL_Y = 4.2;
  def('B7_VOLLBILD_TAFEL', {
    background: { color: GRUND },
    objects: [
      { placeholder: { options: { name: 'bild', type: 'pic', x: 0, y: 0, w: BREITE, h: HOEHE }, text: 'Bild' } },
      { rect: { x: x(0), y: TAFEL_Y, w: w(2.6), h: HOEHE - TAFEL_Y, fill: { color: GRUND }, line: { color: GRUND, width: 0 } } },
      { placeholder: { options: { name: 'titel', type: 'title', x: x(0) + 0.3, y: TAFEL_Y + 0.3, w: w(2.6) - 0.6, h: 0.9,
          fontFace: F.marke, fontSize: titelPt - 8, bold: true, color: G['950'], charSpacing: -0.5, valign: 'top' }, text: 'Aussage auf der Tafel' } },
      koerper(0.13, 2.4, TAFEL_Y + 1.3, HOEHE - TAFEL_Y - 1.95),
      ...fusszeile(),
    ],
  });

  // ── Vollbild und Zitat (2) ──────────────────────────────────────────────
  def('V1_VOLLBILD', {
    background: { color: GRUND },
    objects: [
      { placeholder: { options: { name: 'bild', type: 'pic', x: 0, y: 0, w: BREITE, h: HOEHE }, text: 'Bild' } },
      { rect: { x: x(0), y: 4.7, w: w(3), h: 1.5, fill: { color: 'FFFFFF' },
                line: { color: G['400'], width: 1 } } },
      { placeholder: { options: { name: 'titel', type: 'title', x: x(0) + 0.3, y: 4.95, w: w(3) - 0.6, h: 1.0,
          fontFace: F.marke, fontSize: 22, bold: true, color: G['950'], charSpacing: -0.5, valign: 'top' },
          text: 'Aussage auf eigener Fläche' } },
    ],
  });

  def('Q1_ZITAT', {
    background: { color: GRUND },
    objects: [
      { placeholder: { options: { name: 'titel', type: 'title', x: x(0), y: 2.0, w: w(5), h: 2.6,
          fontFace: F.marke, fontSize: 30, bold: true, color: G['950'], charSpacing: -0.9,
          lineSpacingMultiple: 1.15, valign: 'top' }, text: '„Zitat des Kunden."' } },
      { placeholder: { options: { name: 'quelle', type: 'body', x: x(0), y: 5.0, w: w(4), h: 0.5,
          fontFace: F.info, fontSize: textPt - 3, color: G['700'] }, text: 'Rolle · Unternehmen' } },
      ...fusszeile(),
    ],
  });

  // ── KPI (3) ─────────────────────────────────────────────────────────────
  def('K1_KPI_EINE', {
    background: { color: GRUND },
    objects: [
      kicker('Kennzahl'),
      { placeholder: { options: { name: 'zahl', type: 'body', x: x(0), y: 2.2, w: w(4), h: 1.9,
          fontFace: F.marke, fontSize: 88, bold: true, color: G['950'], charSpacing: -3.0, valign: 'top' },
          text: '−67 %' } },
      { placeholder: { options: { name: 'inhalt', type: 'body', x: x(0), y: 4.3, w: w(4), h: 0.7,
          fontFace: F.info, fontSize: textPt, color: G['700'] }, text: 'Was die Zahl bedeutet' } },
      ...fusszeile(),
    ],
  });

  const kpiFeld = (feld, felder, n) => ([
    { placeholder: { options: { name: `zahl${n}`, type: 'body', x: x(feld), y: INHALT_Y + 0.3, w: w(felder), h: 1.1,
        fontFace: F.marke, fontSize: 44, bold: true, color: G['950'], charSpacing: -1.6, valign: 'top' },
        text: '00' } },
    { placeholder: { options: { name: `text${n}`, type: 'body', x: x(feld), y: INHALT_Y + 1.5, w: w(felder), h: 0.9,
        fontFace: F.technik, fontSize: kickerPt + 1, color: G['600'], charSpacing: 1.5 }, text: 'BESCHRIFTUNG' } },
  ]);

  def('K2_KPI_DREI', {
    background: { color: GRUND },
    objects: [ueberschrift(), ...kpiFeld(0, 2, 1), ...kpiFeld(2, 2, 2), ...kpiFeld(4, 2, 3), ...fusszeile()],
  });

  def('K3_KPI_VIER', {
    background: { color: GRUND },
    objects: [
      ueberschrift(),
      ...kpiFeld(0, 1.5, 1), ...kpiFeld(1.5, 1.5, 2), ...kpiFeld(3, 1.5, 3), ...kpiFeld(4.5, 1.5, 4),
      ...fusszeile(),
    ],
  });

  // K4 Zahl mit Verlauf: Kennzahl links, Miniaturverlauf rechts ohne Achsen —
  // die Zahl setzt den Massstab, der Endpunkt traegt den Akzent.
  def('K4_ZAHL_VERLAUF', {
    background: { color: GRUND },
    objects: [
      ueberschrift(),
      { placeholder: { options: { name: 'zahl', type: 'body', x: x(0), y: INHALT_Y + 0.2, w: w(2), h: 1.4,
          fontFace: F.marke, fontSize: 64, bold: true, color: G['950'], charSpacing: -2.4, valign: 'top', bullet: false }, text: '00 %' } },
      monoPlatz('beschriftung', 0, 2, INHALT_Y + 1.75, 0.5, 'KENNZAHL · VERÄNDERUNG'),
      { placeholder: { options: { name: 'diagramm', type: 'chart', x: x(2.4), y: INHALT_Y + 0.2, w: w(3.6), h: INHALT_H - 0.6 }, text: 'Verlauf ohne Achsen' } },
      ...fusszeile(),
    ],
  });

  // ── Vergleich (2) ───────────────────────────────────────────────────────
  def('C1_VERGLEICH', {
    background: { color: GRUND },
    objects: [
      ueberschrift(),
      { rect: { x: x(0), y: INHALT_Y, w: w(3), h: INHALT_H, fill: { color: 'FFFFFF' },
                line: { color: G['400'], width: 1 } } },
      { rect: { x: x(3), y: INHALT_Y, w: w(3), h: INHALT_H, fill: { color: 'FFFFFF' },
                line: { color: G['400'], width: 1 } } },
      koerper(0, 3, INHALT_Y + 0.3, INHALT_H - 0.6, 'links'),
      koerper(3, 3, INHALT_Y + 0.3, INHALT_H - 0.6, 'rechts'),
      ...fusszeile(),
    ],
  });

  def('C2_MATRIX', {
    background: { color: GRUND },
    objects: [
      ueberschrift(),
      { placeholder: { options: { name: 'tabelle', type: 'body', x: x(0), y: INHALT_Y, w: w(6), h: INHALT_H },
          text: 'Matrix — Zeilen, Spalten, genau eine Signalzelle' } },
      ...fusszeile(),
    ],
  });

  // ── Konzept (8) — C3 bis C9 und P3 des Foliensystems ───────────────────
  // Duartes vier abstrakte Formen: Fluss (C3, P3), Struktur (C4, C7, C9),
  // Cluster (C8), Strahlen (C6), dazu der Trichter (C5). pptxgenjs kennt in
  // Mastern nur Rechtecke; Kreise entstehen nach dem Schreiben im XML
  // (kreiseEinsetzen), markiert ueber die Layoutnamen in KREIS_LAYOUTS.
  const kreis = (cx, cy, d, fill, linie = G['400']) => ({
    rect: { x: cx - d / 2, y: cy - d / 2, w: d, h: d, fill: fill ? { color: fill } : { type: 'none' }, line: { color: linie, width: fill ? 0 : 1 } } });
  const rahmenPlatz = (name, feld, felder, y, h, hinweis, fill = null) => ({
    placeholder: { options: { name, type: 'body', x: x(feld), y, w: w(felder), h,
      fontFace: F.marke, fontSize: textPt, bold: true, color: G['950'], align: 'center', valign: 'middle', bullet: false,
      fill: fill ? { color: fill } : undefined, line: { color: G['400'], width: 0.75 } }, text: hinweis } });

  // C3 Kreislauf: Ring mit vier Stationen, Text rechts. Nur fuer echte Wiederholung.
  const R_CX = x(0) + 1.9, R_CY = INHALT_Y + INHALT_H / 2, R_D = Math.min(3.4, INHALT_H - 0.6);
  def('C3_KREISLAUF', {
    background: { color: GRUND },
    objects: [
      ueberschrift(),
      kreis(R_CX, R_CY, R_D, null),
      ...[[0, -1], [1, 0], [0, 1], [-1, 0]].map(([dx, dy]) => kreis(R_CX + dx * R_D / 2, R_CY + dy * R_D / 2, 0.42, G['950'])),
      ...[[0, -1, 'oben'], [1, 0, 'rechts'], [0, 1, 'unten'], [-1, 0, 'links']].map(([dx, dy, n], i) => ({
        placeholder: { options: { name: `station${i + 1}`, type: 'body', x: R_CX + dx * (R_D / 2 + 0.3) + (dx === 0 ? -0.9 : dx > 0 ? 0 : -1.8), y: R_CY + dy * (R_D / 2 + 0.3) - 0.15 + (dy > 0 ? 0.1 : dy < 0 ? -0.15 : 0), w: 1.8, h: 0.3,
          fontFace: F.technik, fontSize: kickerPt, color: G['700'], charSpacing: 1.5, align: dx === 0 ? 'center' : dx > 0 ? 'left' : 'right', bullet: false }, text: `STATION ${i + 1}` } })),
      koerper(3.6, 2.4, INHALT_Y, INHALT_H, 'text'),
      ...fusszeile(),
    ],
  });

  // C4 Hierarchie: Wurzel oben, Kinder darunter, hoechstens drei Ebenen.
  def('C4_HIERARCHIE', {
    background: { color: GRUND },
    objects: [
      ueberschrift(),
      rahmenPlatz('wurzel', 2, 2, INHALT_Y, 0.6, 'Wurzel', P['200']),
      { line: { x: x(3) - STEG / 2, y: INHALT_Y + 0.6, w: 0, h: 0.4, line: { color: G['400'], width: 0.75 } } },
      { line: { x: x(0) + w(1.5) / 2, y: INHALT_Y + 1.0, w: w(6) - w(1.5), h: 0, line: { color: G['400'], width: 0.75 } } },
      ...[0, 1, 2, 3].flatMap((i) => ([
        { line: { x: x(i * 1.5) + w(1.5) / 2, y: INHALT_Y + 1.0, w: 0, h: 0.3, line: { color: G['400'], width: 0.75 } } },
        rahmenPlatz(`kind${i + 1}`, i * 1.5, 1.5, INHALT_Y + 1.3, 0.6, 'Kind'),
      ])),
      koerper(0, 6, INHALT_Y + 2.2, INHALT_H - 2.2, 'text'),
      ...fusszeile(),
    ],
  });

  // C5 Trichter: linksbuendige Balken abnehmender Laenge, Wert rechts am Balken.
  def('C5_TRICHTER', {
    background: { color: GRUND },
    objects: [
      ueberschrift(),
      ...[4, 3, 2.2, 1.3].flatMap((felder, i) => {
        const y = INHALT_Y + i * 0.85;
        return [
          { rect: { x: x(0), y, w: w(felder), h: 0.6, fill: { color: i === 2 ? AKZENT['500'] : P['300'] }, line: { color: P['300'], width: 0 } } },
          { placeholder: { options: { name: `stufe${i + 1}`, type: 'body', x: x(0) + 0.2, y, w: w(felder) - 0.4, h: 0.6,
              fontFace: F.marke, fontSize: textPt, bold: true, color: G['950'], valign: 'middle', bullet: false }, text: `Stufe ${i + 1}` } },
          monoPlatz(`wert${i + 1}`, felder + 0.2, 1, y + 0.17, 0.3, '0 000'),
        ];
      }),
      ...fusszeile(),
    ],
  });

  // C6 Nabe und Speichen: Zentrum mit Umfeld, hoechstens acht Speichen.
  const N_CX = x(0) + w(6) / 2 - 1.2, N_CY = INHALT_Y + INHALT_H / 2, N_R = Math.min(1.8, INHALT_H / 2 - 0.5);
  def('C6_NABE_SPEICHEN', {
    background: { color: GRUND },
    objects: [
      ueberschrift(),
      ...[0, 1, 2, 3, 4, 5].flatMap((i) => {
        const a = -Math.PI / 2 + i * Math.PI / 3, sx = N_CX + Math.cos(a) * N_R, sy = N_CY + Math.sin(a) * N_R;
        return [
          { line: { x: N_CX, y: N_CY, w: sx - N_CX, h: sy - N_CY, line: { color: G['400'], width: 0.75 }, flipV: sy < N_CY } },
          kreis(sx, sy, 0.9, GRUND),
          { placeholder: { options: { name: `speiche${i + 1}`, type: 'body', x: sx - 0.45, y: sy - 0.45, w: 0.9, h: 0.9,
              fontFace: F.info, fontSize: kickerPt + 1, color: G['950'], align: 'center', valign: 'middle', bullet: false }, text: 'Speiche' } },
        ];
      }),
      kreis(N_CX, N_CY, 1.3, P['200']),
      { placeholder: { options: { name: 'nabe', type: 'body', x: N_CX - 0.65, y: N_CY - 0.65, w: 1.3, h: 1.3,
          fontFace: F.marke, fontSize: textPt, bold: true, color: G['950'], align: 'center', valign: 'middle', bullet: false }, text: 'Nabe' } },
      koerper(4.4, 1.6, INHALT_Y, INHALT_H, 'text'),
      ...fusszeile(),
    ],
  });

  // C7 Pyramide: Ebenen abnehmender Breite, linksbuendig, oben das Dach.
  def('C7_PYRAMIDE', {
    background: { color: GRUND },
    objects: [
      ueberschrift(),
      ...[1.3, 2.2, 3, 3.8].flatMap((felder, i) => {
        const y = INHALT_Y + i * 0.85;
        return [
          { rect: { x: x(0), y, w: w(felder), h: 0.6, fill: { color: i === 0 ? P['300'] : GRUND }, line: { color: G['400'], width: 0.75 } } },
          { placeholder: { options: { name: `ebene${i + 1}`, type: 'body', x: x(0) + 0.2, y, w: w(felder) - 0.4, h: 0.6,
              fontFace: F.marke, fontSize: textPt, bold: true, color: G['950'], valign: 'middle', bullet: false }, text: i === 0 ? 'Dach' : 'Ebene' } },
          koerper(4.2, 1.8, y, 0.8, `text${i + 1}`),
        ];
      }),
      ...fusszeile(),
    ],
  });

  // C8 Schnittmenge: zwei Kreise, Beschriftung aussen, Schnittmenge ist die Aussage.
  const S_CY = INHALT_Y + INHALT_H / 2, S_D = Math.min(3.0, INHALT_H - 0.4), S_AX = x(0) + S_D / 2 + 0.3, S_BX = S_AX + S_D * 0.62;
  def('C8_SCHNITTMENGE', {
    background: { color: GRUND },
    objects: [
      ueberschrift(),
      kreis(S_AX, S_CY, S_D, null), kreis(S_BX, S_CY, S_D, null),
      { placeholder: { options: { name: 'menge1', type: 'body', x: S_AX - S_D / 2, y: S_CY - 0.3, w: S_D * 0.4, h: 0.6,
          fontFace: F.marke, fontSize: textPt, bold: true, color: G['950'], align: 'center', valign: 'middle', bullet: false }, text: 'Menge A' } },
      { placeholder: { options: { name: 'menge2', type: 'body', x: S_BX + S_D / 2 - S_D * 0.4, y: S_CY - 0.3, w: S_D * 0.4, h: 0.6,
          fontFace: F.marke, fontSize: textPt, bold: true, color: G['950'], align: 'center', valign: 'middle', bullet: false }, text: 'Menge B' } },
      { placeholder: { options: { name: 'schnitt', type: 'body', x: (S_AX + S_BX) / 2 - 0.6, y: S_CY - 0.3, w: 1.2, h: 0.6,
          fontFace: F.marke, fontSize: textPt, bold: true, color: AKZENT['800'], align: 'center', valign: 'middle', bullet: false }, text: 'Schnitt' } },
      koerper(4.2, 1.8, INHALT_Y, INHALT_H, 'text'),
      ...fusszeile(),
    ],
  });

  // C9 Transformation: Ist links (Haarlinie), Soll rechts (gefuellt), das Mittel
  // steht AUF dem Pfeil. Ohne Mittel ist es ein Wunsch.
  def('C9_TRANSFORMATION', {
    background: { color: GRUND },
    objects: [
      ueberschrift(),
      { rect: { x: x(0), y: INHALT_Y + 0.4, w: w(2.2), h: INHALT_H - 1.2, fill: { type: 'none' }, line: { color: G['400'], width: 0.75 } } },
      { rect: { x: x(3.8), y: INHALT_Y + 0.4, w: w(2.2), h: INHALT_H - 1.2, fill: { color: P['200'] }, line: { color: P['200'], width: 0 } } },
      { line: { x: x(2.2) + 0.25, y: INHALT_Y + INHALT_H / 2 - 0.2, w: x(3.8) - x(2.2) - 0.5, h: 0, line: { color: G['950'], width: 1.5, endArrowType: 'triangle' } } },
      monoPlatz('mittel', 2.2, 1.6, INHALT_Y + INHALT_H / 2 - 0.65, 0.4, 'WOMIT'),
      koerper(0.1, 2, INHALT_Y + 0.6, INHALT_H - 1.6, 'ist'),
      koerper(3.9, 2, INHALT_Y + 0.6, INHALT_H - 1.6, 'soll'),
      ...fusszeile(),
    ],
  });

  // P3 Prozess mit Ergebnis: Schritte oben, je Schritt eine Spalte gleicher Breite.
  def('P3_PROZESS_ERGEBNIS', {
    background: { color: GRUND },
    objects: [
      ueberschrift(),
      { line: { x: x(0) + w(1.5) / 2, y: INHALT_Y + 0.25, w: w(6) - w(1.5), h: 0, line: { color: G['400'], width: 0.75 } } },
      ...[0, 1, 2, 3].flatMap((i) => ([
        kreis(x(i * 1.5) + w(1.5) / 2, INHALT_Y + 0.25, 0.42, G['950']),
        { placeholder: { options: { name: `schritt${i + 1}`, type: 'body', x: x(i * 1.5), y: INHALT_Y + 0.6, w: w(1.5), h: 0.4,
            fontFace: F.marke, fontSize: textPt, bold: true, color: G['950'], align: 'center', bullet: false }, text: `Schritt ${i + 1}` } },
        koerper(i * 1.5, 1.5, INHALT_Y + 1.1, INHALT_H - 1.1, `text${i + 1}`),
      ])),
      ...fusszeile(),
    ],
  });

  // ── Timeline, Prozess, Architektur (4) ──────────────────────────────────
  def('L1_TIMELINE', {
    background: { color: GRUND },
    objects: [
      ueberschrift(),
      { line: { x: x(0), y: 4.1, w: w(6), h: 0, line: { color: G['400'], width: 1 } } },
      { placeholder: { options: { name: 'inhalt', type: 'body', x: x(0), y: 4.3, w: w(6), h: 1.2,
          fontFace: F.technik, fontSize: kickerPt + 1, color: G['700'], charSpacing: 1.2 },
          text: 'Höchstens fünf Marken, eine im Signal' } },
      ...fusszeile(),
    ],
  });

  // ── Plan (9) — Familie L des Foliensystems ─────────────────────────────
  // Was vom Inhalt abhaengt (Anzahl Monate, Zeilen, Optionen), zeichnet das
  // Deck; der Master gibt Titel, Spalten, Haarlinien und Platzhalter. Die
  // Beispieldecks (pptx-beispiel.mjs) zeigen je Layout, wie das aussieht.
  // L2 Roadmap: Namen links ein Feld, Balken ueber fuenf Felder, Monatsleiste
  // oben. Die Zeitachse ist linear — ein Monat ist so breit wie ein Monat.
  def('L2_ROADMAP', {
    background: { color: GRUND },
    objects: [
      ueberschrift(),
      monoPlatz('monate', 1, 5, INHALT_Y, 0.3, 'JAN · FEB · MÄR · APR · MAI · JUN'),
      { line: { x: x(1), y: INHALT_Y + 0.38, w: w(5), h: 0, line: { color: G['400'], width: 0.75 } } },
      koerper(0, 1, INHALT_Y + 0.5, INHALT_H - 0.5, 'zeilen'),
      ...fusszeile(),
    ],
  });

  // L3 Meilensteine: Datum, Name, Abnahmekriterium, Statusmarke. Ein
  // Meilenstein ohne Kriterium ist nur ein Datum.
  def('L3_MEILENSTEINE', {
    background: { color: GRUND },
    objects: [
      ueberschrift(),
      monoPlatz('kopf', 0, 6, INHALT_Y, 0.26, 'DATUM · MEILENSTEIN · ABNAHMEKRITERIUM · STATUS'),
      kopfLinie(),
      tabellenPlatz('Je Zeile ein Meilenstein, höchstens sechs'),
      ...fusszeile(),
    ],
  });

  // L4 Phasen mit Ergebnis: Phasenleiste oben, darunter je Phase eine
  // Spalte gleicher Breite. Das Ergebnis ist ein Substantiv, keine Taetigkeit.
  def('L4_PHASEN_ERGEBNIS', {
    background: { color: GRUND },
    objects: [
      ueberschrift(),
      ...[0, 1, 2, 3].map((i) => ({ rect: { x: x(i * 1.5), y: INHALT_Y, w: w(1.5), h: 0.6,
        fill: { color: P['200'] }, line: { color: P['200'], width: 0 } } })),
      ...[0, 1, 2, 3].map((i) => koerper(i * 1.5, 1.5, INHALT_Y + 0.85, INHALT_H - 0.85, `phase${i + 1}`)),
      ...fusszeile(),
    ],
  });

  // L5 Rollen: Aufgaben als Zeilen, Rollen als Spalten, je Zeile genau
  // ein V. Zwei Verantwortliche sind keiner.
  def('L5_ROLLEN', {
    background: { color: GRUND },
    objects: [
      ueberschrift(),
      monoPlatz('kopf', 0, 6, INHALT_Y, 0.26, 'AUFGABE · ROLLE · ROLLE · ROLLE'),
      kopfLinie(),
      tabellenPlatz('V verantwortlich · A arbeitet · G gefragt · I informiert'),
      ...fusszeile(),
    ],
  });

  // L6 Risiken: Matrix drei mal drei links, kritisches Feld auf hellerem
  // Papier, Liste rechts. Nummer verbindet Punkt und Zeile.
  const M_X = x(0) + 0.35, M_S = Math.min(w(2) - 0.35, INHALT_H - 0.4), M_C = M_S / 3;
  def('L6_RISIKEN', {
    background: { color: GRUND },
    objects: [
      ueberschrift(),
      { rect: { x: M_X + 2 * M_C, y: INHALT_Y, w: M_C, h: M_C, fill: { color: P['200'] }, line: { color: P['200'], width: 0 } } },
      ...[0, 1, 2, 3].map((i) => ({ line: { x: M_X, y: INHALT_Y + i * M_C, w: M_S, h: 0, line: { color: G['400'], width: 0.75 } } })),
      ...[0, 1, 2, 3].map((i) => ({ line: { x: M_X + i * M_C, y: INHALT_Y, w: 0, h: M_S, line: { color: G['400'], width: 0.75 } } })),
      { text: { text: 'WAHRSCHEINLICHKEIT →', options: { x: M_X, y: INHALT_Y + M_S + 0.06, w: M_S, h: 0.26,
          fontFace: F.technik, fontSize: kickerPt - 1, color: G['600'], charSpacing: 1.5 } } },
      { text: { text: 'AUSWIRKUNG ↑', options: { x: M_X - 0.73, y: INHALT_Y + M_S / 2 - 0.13, w: 1.1, h: 0.26, rotate: 270,
          fontFace: F.technik, fontSize: kickerPt - 1, color: G['600'], charSpacing: 1.5 } } },
      koerper(2, 4, INHALT_Y, INHALT_H, 'liste'),
      ...fusszeile(),
    ],
  });

  // L7 Statusbericht: Ampel aus dem Tokensatz, Farbe UND Wort. Die Legende
  // steht im Master, damit die Bedeutung nicht je Deck neu erfunden wird.
  def('L7_STATUSBERICHT', {
    background: { color: GRUND },
    objects: [
      ueberschrift(),
      monoPlatz('kopf', 0, 6, INHALT_Y, 0.26, 'STATUS · ARBEITSPAKET · ABWEICHUNG · ENTSCHEIDUNG'),
      kopfLinie(),
      tabellenPlatz('Je Zeile ein Arbeitspaket. Rot heißt: Entscheidung nötig, und sie steht in der Zeile'),
      ...Object.entries(STATUS.hell).flatMap(([name, st], i) => ([
        { rect: { x: x(0) + i * 2.1, y: HOEHE - 0.93, w: 0.14, h: 0.14, fill: { color: st.marke }, line: { color: st.marke, width: 0 } } },
        { text: { text: st.bedeutung, options: { x: x(0) + i * 2.1 + 0.22, y: HOEHE - 1.0, w: 1.8, h: 0.28,
            fontFace: F.technik, fontSize: kickerPt - 1, color: G['700'], charSpacing: 1 } } },
      ])),
      ...fusszeile(),
    ],
  });

  // L8 Entscheidung: Kriterien links, Optionen als Spalten. Die empfohlene
  // Option steht IMMER in der ersten Spalte auf hellerem Papier — Antwort
  // zuerst, wie in der Zusammenfassung.
  def('L8_ENTSCHEIDUNG', {
    background: { color: GRUND },
    objects: [
      ueberschrift(),
      { rect: { x: x(1.5), y: INHALT_Y - 0.35, w: (w(6) - w(1.5)) / 3, h: INHALT_H + 0.35,
          fill: { color: P['200'] }, line: { color: P['200'], width: 0 } } },
      { text: { text: 'EMPFEHLUNG', options: { x: x(1.5) + 0.15, y: INHALT_Y - 0.3, w: 2, h: 0.24,
          fontFace: F.technik, fontSize: kickerPt - 1, color: G['950'], charSpacing: 1.5, bold: true } } },
      tabellenPlatz('Kriterien als Zeilen, Optionen als Spalten, letzte Zeile ist die Konsequenz'),
      ...fusszeile(),
    ],
  });

  // L9 Konditionen: Positionen ueber vier Felder, Betraege rechtsbuendig,
  // eine Summe. Optionen stehen darunter, nicht in der Summe.
  def('L9_KONDITIONEN', {
    background: { color: GRUND },
    objects: [
      ueberschrift(),
      tabellenPlatz('Position · Betrag, Summe in der letzten Zeile', 4),
      monoPlatz('hinweis', 0, 4, HOEHE - 1.05, 0.4, 'Beträge netto · Laufzeit · Gültigkeit'),
      ...fusszeile(),
    ],
  });

  // L10 Lieferumfang: Enthalten links, nicht enthalten rechts, Haarlinie
  // dazwischen. Die rechte Spalte ist Schutz fuer beide Seiten — immer fuellen.
  def('L10_LIEFERUMFANG', {
    background: { color: GRUND },
    objects: [
      ueberschrift(),
      { text: { text: 'ENTHALTEN', options: { x: x(0), y: INHALT_Y, w: w(2.8), h: 0.26,
          fontFace: F.technik, fontSize: kickerPt, color: G['600'], charSpacing: 2 } } },
      { text: { text: 'NICHT ENTHALTEN', options: { x: x(3.2), y: INHALT_Y, w: w(2.8), h: 0.26,
          fontFace: F.technik, fontSize: kickerPt, color: G['600'], charSpacing: 2 } } },
      { line: { x: x(3) + 0.05, y: INHALT_Y, w: 0, h: INHALT_H, line: { color: G['400'], width: 0.75 } } },
      koerper(0, 2.8, INHALT_Y + 0.45, INHALT_H - 0.45, 'links'),
      koerper(3.2, 2.8, INHALT_Y + 0.45, INHALT_H - 0.45, 'rechts'),
      ...fusszeile(),
    ],
  });

  def('P1_PROZESS_WAAGERECHT', {
    background: { color: GRUND },
    objects: [
      ueberschrift(),
      { placeholder: { options: { name: 'inhalt', type: 'body', x: x(0), y: INHALT_Y, w: w(6), h: INHALT_H },
          text: 'Höchstens fünf Schritte · Richtungsdreieck im Abstand' } },
      ...fusszeile(),
    ],
  });

  def('P2_PROZESS_SENKRECHT', {
    background: { color: GRUND },
    objects: [
      ueberschrift(),
      { placeholder: { options: { name: 'inhalt', type: 'body', x: x(0), y: INHALT_Y, w: w(4), h: INHALT_H },
          text: 'Schritte untereinander' } },
      ...fusszeile(),
    ],
  });

  def('R1_ARCHITEKTUR', {
    background: { color: GRUND },
    objects: [
      ueberschrift(),
      { rect: { x: x(0), y: INHALT_Y, w: w(6), h: INHALT_H, fill: { color: P['200'] },
                line: { color: G['400'], width: 1 } } },
      { placeholder: { options: { name: 'inhalt', type: 'body', x: x(0) + 0.3, y: INHALT_Y + 0.3,
          w: w(6) - 0.6, h: INHALT_H - 0.6 }, text: 'Enthaltensein · höchstens drei Ebenen' } },
      ...fusszeile(),
    ],
  });

  // ── Screenshot und Gerät (3) ────────────────────────────────────────────
  def('S1_SCREENSHOT', {
    background: { color: GRUND },
    objects: [
      { placeholder: { options: { name: 'bild', type: 'pic', x: x(0), y: RAND, w: w(6), h: HOEHE - 2 * RAND,
          line: { color: G['400'], width: 1 } }, text: 'Bildschirmfoto' } },
    ],
  });

  def('S2_SCREENSHOT_TEXT', {
    background: { color: GRUND },
    objects: [
      ueberschrift(),
      { placeholder: { options: { name: 'bild', type: 'pic', x: x(0), y: INHALT_Y, w: w(4), h: INHALT_H,
          line: { color: G['400'], width: 1 } }, text: 'Bildschirmfoto' } },
      koerper(4, 2),
      ...fusszeile(),
    ],
  });

  def('G1_GERAET', {
    background: { color: GRUND },
    objects: [
      ueberschrift(),
      { placeholder: { options: { name: 'bild', type: 'pic', x: 4.6, y: INHALT_Y, w: 4.1, h: INHALT_H },
          text: 'Gerät · kein Schatten' } },
      ...fusszeile(),
    ],
  });

  // ── Produkt (7) — S3 bis S7, R3, LG1 des Foliensystems ─────────────────

  // S3 Feature mit Callouts: die tragende Produktfolie. Marker sind Formen
  // des Decks UEBER dem Bild — sie liegen nicht im Bildplatzhalter, sonst
  // verschwinden sie, sobald jemand das Bild einfuegt. Nummer = Erklaerreihenfolge.
  def('S3_FEATURE_CALLOUTS', {
    background: { color: GRUND },
    objects: [ueberschrift(), bildRahmen('bild', 0, 3.6, INHALT_Y, INHALT_H), koerper(4, 2, INHALT_Y, INHALT_H, 'erklaerungen'), ...fusszeile()],
  });

  // S4 Funktionsuebersicht: sechs Kacheln, Haarlinie oben statt Kasten, ein Satz je Kachel.
  const KACHEL_H = (INHALT_H - 0.3) / 2;
  def('S4_FUNKTIONSUEBERSICHT', {
    background: { color: GRUND },
    objects: [
      ueberschrift(),
      ...[0, 1, 2, 3, 4, 5].flatMap((i) => {
        const feld = (i % 3) * 2, y = INHALT_Y + Math.floor(i / 3) * (KACHEL_H + 0.3);
        return [
          { line: { x: x(feld), y, w: w(2), h: 0, line: { color: G['400'], width: 0.75 } } },
          { placeholder: { options: { name: `icon${i + 1}`, type: 'pic', x: x(feld), y: y + 0.2, w: 0.4, h: 0.4 }, text: '' } },
          { placeholder: { options: { name: `name${i + 1}`, type: 'body', x: x(feld), y: y + 0.75, w: w(2), h: 0.4,
              fontFace: F.marke, fontSize: textPt + 1, bold: true, color: G['950'], bullet: false }, text: 'Funktion' } },
          koerper(feld, 2, y + 1.2, KACHEL_H - 1.25, `text${i + 1}`),
        ];
      }),
      ...fusszeile(),
    ],
  });

  // S5 Ausschnitt-Zoom: Bildschirm klein mit Rahmen, Ausschnitt gross in Originalaufloesung.
  def('S5_AUSSCHNITT_ZOOM', {
    background: { color: GRUND },
    objects: [
      ueberschrift(),
      bildRahmen('uebersicht', 0, 2, INHALT_Y, w(2) * 9 / 16, 'Bildschirm ganz'),
      koerper(0, 2, INHALT_Y + w(2) * 9 / 16 + 0.3, INHALT_H - w(2) * 9 / 16 - 0.3),
      bildRahmen('ausschnitt', 2.4, 3.6, INHALT_Y, INHALT_H, 'Ausschnitt in Originalauflösung'),
      ...fusszeile(),
    ],
  });

  // S6 Demo: Platzhalter fuer die Live-Demo. Was gezeigt wird, steht als Satz
  // im Titel, die Klickfolge in den Notizen — ein Ausfall kostet die Aussage nicht.
  def('S6_DEMO', {
    background: { color: GRUND },
    objects: [
      kickerPlatz('LIVE', AKZENT['800']),
      ueberschrift(),
      { rect: { x: x(0), y: INHALT_Y, w: w(6), h: INHALT_H, fill: { color: GRUND }, line: { color: G['400'], width: 1, dashType: 'dash' } } },
      { placeholder: { options: { name: 'hinweis', type: 'body', x: x(1), y: INHALT_Y + INHALT_H / 2 - 0.3, w: w(4), h: 0.6,
          fontFace: F.technik, fontSize: kickerPt + 1, color: G['600'], charSpacing: 1.5, align: 'center', bullet: false },
          text: 'LIVE-DEMO · RÜCKFALL: BILDSCHIRMFOTO IN DEN NOTIZEN' } },
      ...fusszeile(),
    ],
  });

  // S7 Geraete-Paar: derselbe Inhalt auf Desktop und Mobilgeraet, gleiche Grundlinie.
  def('S7_GERAETE_PAAR', {
    background: { color: GRUND },
    objects: [
      ueberschrift(),
      bildRahmen('desktop', 0, 3.8, INHALT_Y + 0.4, INHALT_H - 0.4, 'Desktop'),
      bildRahmen('mobil', 4.6, 1.1, INHALT_Y, INHALT_H, 'Mobil'),
      ...fusszeile(),
    ],
  });

  // R3 Ebenenmodell: Baender von unten nach oben, unten das Fundament (gefuellt).
  const EBENE_H = (INHALT_H - 3 * 0.12) / 4;
  def('R3_EBENENMODELL', {
    background: { color: GRUND },
    objects: [
      ueberschrift(),
      ...[0, 1, 2, 3].flatMap((i) => {
        const y = INHALT_Y + i * (EBENE_H + 0.12), unten = i === 3;
        return [
          { rect: { x: x(0), y, w: w(3.4), h: EBENE_H, fill: { color: unten ? P['200'] : GRUND }, line: { color: G['400'], width: 0.75 } } },
          { placeholder: { options: { name: `ebene${i + 1}`, type: 'body', x: x(0) + 0.2, y: y + 0.1, w: w(3.4) - 0.4, h: EBENE_H - 0.2,
              fontFace: F.marke, fontSize: textPt + 1, bold: true, color: G['950'], valign: 'middle', bullet: false }, text: unten ? 'Fundament' : 'Ebene' } },
          koerper(3.8, 2.2, y + 0.05, EBENE_H, `text${i + 1}`),
        ];
      }),
      ...fusszeile(),
    ],
  });

  // LG1 Logowand: acht Logos gleich hoch, einfarbig. Nur freigegebene.
  def('LG1_LOGOWAND', {
    background: { color: GRUND },
    objects: [
      ueberschrift(),
      ...[0, 1, 2, 3, 4, 5, 6, 7].map((i) => ({
        placeholder: { options: { name: `logo${i + 1}`, type: 'pic', x: x((i % 4) * 1.5), y: INHALT_Y + 0.4 + Math.floor(i / 4) * 2.0, w: w(1.5), h: 1.2 }, text: 'Logo' } })),
      ...fusszeile(),
    ],
  });

  // ── Diagramme (2) ───────────────────────────────────────────────────────
  def('D1_DIAGRAMM', {
    background: { color: GRUND },
    objects: [
      ueberschrift(),
      { placeholder: { options: { name: 'diagramm', type: 'chart', x: x(0), y: INHALT_Y, w: w(6), h: INHALT_H },
          text: 'Diagramm' } },
      ...fusszeile(),
    ],
  });

  def('D2_DIAGRAMM_TEXT', {
    background: { color: GRUND },
    objects: [
      ueberschrift(),
      { placeholder: { options: { name: 'diagramm', type: 'chart', x: x(0), y: INHALT_Y, w: w(4), h: INHALT_H },
          text: 'Diagramm' } },
      koerper(4, 2),
      ...fusszeile(),
    ],
  });

  // ── Daten (8) — D3 bis D10 des Foliensystems ───────────────────────────
  // Je Vergleichstyp nach Zelazny eine Form. Der Master gibt Platz und
  // Kicker; die Diagramme selbst sind native Chart-Objekte, die das Deck
  // mit der Farbfolge aus dem Tokensatz anlegt (pptx-beispiel.mjs, diagramm()).
  const diagrammPlatz = (name, feld, felder, y = INHALT_Y, h = INHALT_H) => ({
    placeholder: { options: { name, type: 'chart', x: x(feld), y, w: w(felder), h }, text: 'Diagramm' } });

  // D3 Diagrammpaar: zwei Diagramme, EINE Skala. Sonst ist es D4.
  def('D3_DIAGRAMMPAAR', {
    background: { color: GRUND },
    objects: [
      ueberschrift(),
      monoPlatz('kicker1', 0, 2.8, INHALT_Y, 0.26, 'ZEITRAUM A'), diagrammPlatz('diagramm1', 0, 2.8, INHALT_Y + 0.4, INHALT_H - 0.4),
      monoPlatz('kicker2', 3.2, 2.8, INHALT_Y, 0.26, 'ZEITRAUM B'), diagrammPlatz('diagramm2', 3.2, 2.8, INHALT_Y + 0.4, INHALT_H - 0.4),
      ...fusszeile(),
    ],
  });

  // D4 Kleine Vielfache: sechs Diagramme gleicher Form und Skala, eines im Akzent.
  const VIEL_H = (INHALT_H - 0.3) / 2;
  def('D4_KLEINE_VIELFACHE', {
    background: { color: GRUND },
    objects: [
      ueberschrift(),
      ...[0, 1, 2, 3, 4, 5].flatMap((i) => {
        const feld = (i % 3) * 2, y = INHALT_Y + Math.floor(i / 3) * (VIEL_H + 0.3);
        return [monoPlatz(`kicker${i + 1}`, feld, 2, y, 0.26, 'GRUPPE'), diagrammPlatz(`diagramm${i + 1}`, feld, 2, y + 0.3, VIEL_H - 0.3)];
      }),
      ...fusszeile(),
    ],
  });

  // D5 Verlauf mit Ereignis: eine Linie, EIN markierter Zeitpunkt.
  def('D5_VERLAUF_EREIGNIS', {
    background: { color: GRUND },
    objects: [ueberschrift(), diagrammPlatz('diagramm', 0, 6), ...fusszeile()],
  });

  // D6 Rangfolge: waagerechte Balken, sortiert, einer im Akzent, Wert am Balken.
  def('D6_RANGFOLGE', {
    background: { color: GRUND },
    objects: [ueberschrift(), diagrammPlatz('diagramm', 0, 4), koerper(4.4, 1.6, INHALT_Y, INHALT_H, 'anmerkung'), ...fusszeile()],
  });

  // D7 Anteile: gestapelter Balken statt Kuchen, Beschriftung unter dem Segment.
  def('D7_ANTEILE', {
    background: { color: GRUND },
    objects: [ueberschrift(), diagrammPlatz('diagramm', 0, 6, INHALT_Y + 0.8, 1.6), koerper(0, 6, INHALT_Y + 3.0, INHALT_H - 3.0, 'beschriftung'), ...fusszeile()],
  });

  // D8 Zielerreichung: Balken auf hundert Prozent Ziel normiert, Ziel als Haarlinie.
  def('D8_ZIELERREICHUNG', {
    background: { color: GRUND },
    objects: [ueberschrift(), diagrammPlatz('diagramm', 0, 5), ...fusszeile()],
  });

  // D9 Verteilung: Zellenraster, eine Farbleiter, Skala rechts. Kein natives
  // Diagramm — PowerPoint kennt keine Heatmap; das Deck zeichnet Zellen.
  def('D9_VERTEILUNG', {
    background: { color: GRUND },
    objects: [
      ueberschrift(),
      monoPlatz('spalten', 0.5, 4, INHALT_Y, 0.26, 'SPALTEN · Z. B. STUNDEN'),
      koerper(0.5, 4, INHALT_Y + 0.35, INHALT_H - 0.35, 'zellen'),
      monoPlatz('skala', 4.8, 1.2, INHALT_Y, 0.26, 'SKALA'),
      ...fusszeile(),
    ],
  });

  // D10 Steigung: zwei Zeitpunkte, eine Linie je Gruppe, Namen an beiden Enden.
  def('D10_STEIGUNG', {
    background: { color: GRUND },
    objects: [ueberschrift(), diagrammPlatz('diagramm', 0.8, 2.4), koerper(4.2, 1.8, INHALT_Y, INHALT_H, 'anmerkung'), ...fusszeile()],
  });

  // ── Tabellen (3) ────────────────────────────────────────────────────────
  def('TB1_TABELLE', {
    background: { color: GRUND },
    objects: [
      ueberschrift(),
      { placeholder: { options: { name: 'tabelle', type: 'body', x: x(0), y: INHALT_Y, w: w(6), h: INHALT_H },
          text: 'Tabelle — höchstens sieben Zeilen' } },
      ...fusszeile(),
    ],
  });

  def('TB2_TABELLE_TEXT', {
    background: { color: GRUND },
    objects: [
      ueberschrift(),
      { placeholder: { options: { name: 'tabelle', type: 'body', x: x(0), y: INHALT_Y, w: w(4), h: INHALT_H },
          text: 'Tabelle' } },
      koerper(4, 2),
      ...fusszeile(),
    ],
  });

  // Editions- und Preistabelle mit hervorgehobener Spalte. Anders als
  // TB1/TB2, weil hier eine Spalte die Empfehlung traegt — das ist der
  // haeufigste Tabellenfall im Vertrieb und der einzige, in dem eine
  // Signalflaeche in einer Tabelle zulaessig ist.
  def('TB3_EDITIONSTABELLE', {
    background: { color: GRUND },
    objects: [
      ueberschrift(),
      { rect: { x: x(2), y: INHALT_Y - 0.14, w: w(2), h: INHALT_H + 0.28,
                fill: { color: P['200'] }, line: { color: AKZENT['500'], width: 1.5 } } },
      { placeholder: { options: { name: 'tabelle', type: 'body', x: x(0), y: INHALT_Y, w: w(6), h: INHALT_H },
          text: 'Editionen — eine Spalte hervorgehoben' } },
      ...fusszeile(),
    ],
  });

  // TB4 Vergleichstabelle: Merkmale gegen Optionen, Haken in Tinte, Fehlen als
  // Leerzelle, teilweise als Wort. Die empfohlene Option steht wie in L8 in
  // der ersten Spalte auf hellerem Papier. Die Tabelle wertet nicht, sie zeigt.
  const TB4_SW = (w(6) - w(2) - STEG) / 3;
  def('TB4_VERGLEICHSTABELLE', {
    background: { color: GRUND },
    objects: [
      ueberschrift(),
      { rect: { x: x(2), y: INHALT_Y - 0.14, w: TB4_SW, h: INHALT_H + 0.28, fill: { color: P['200'] }, line: { color: P['200'], width: 0 } } },
      monoPlatz('kopf', 0, 6, INHALT_Y, 0.26, 'MERKMAL · EMPFEHLUNG · OPTION · OPTION'),
      kopfLinie(),
      tabellenPlatz('Haken in Tinte, leere Zelle heißt nein, teilweise als Wort'),
      ...fusszeile(),
    ],
  });

  // ── Abschluss (1) ───────────────────────────────────────────────────────
  def('Z1_ABSCHLUSS', {
    background: { color: TIEF },
    objects: [
      { placeholder: { options: { name: 'titel', type: 'title', x: x(0), y: 2.2, w: w(4), h: 1.4,
          fontFace: F.marke, fontSize: 34, bold: true, color: G['100'], charSpacing: -1.0, valign: 'top' },
          text: 'Sprechen wir über Ihren Fall.' } },
      { placeholder: { options: { name: 'kontakt', type: 'body', x: x(0), y: 3.9, w: w(4), h: 1.0,
          fontFace: F.info, fontSize: textPt - 1, color: G['400'] }, text: 'Name · E-Mail' } },
      { rect: { x: 9.6, y: 4.6, w: 2.4, h: 1.4, fill: { color: AKZENT['500'] } } },
      ...fusszeile(true)
    ],
  });

  // ── Rahmen (6) — AG2 und Z2 bis Z6 des Foliensystems ───────────────────
  // AG2 Agenda mit Stand: Agenda wiederholt, aktueller Punkt in Tinte. Die
  // Papiermuster je Punkt zeichnet das Deck.
  def('AG2_AGENDA_STAND', {
    background: { color: GRUND },
    objects: [kickerPlatz('WO WIR SIND'), koerper(0.5, 4, INHALT_Y, INHALT_H, 'punkte'), ...fusszeile()],
  });

  // Z2 Kernaussagen: drei Saetze, woertlich aus dem Deck wiederholt.
  def('Z2_KERNAUSSAGEN', {
    background: { color: GRUND },
    objects: [
      ueberschrift(),
      ...[0, 1, 2].flatMap((i) => ([
        { placeholder: { options: { name: `satz${i + 1}`, type: 'body', x: x(0), y: INHALT_Y + i * 1.25, w: w(4), h: 1.0,
            fontFace: F.marke, fontSize: textPt + 3, bold: true, color: G['950'], lineSpacingMultiple: 1.15, valign: 'top', bullet: false },
            text: `Kernaussage ${i + 1}` } },
        ...(i < 2 ? [{ line: { x: x(0), y: INHALT_Y + i * 1.25 + 1.1, w: w(4), h: 0, line: { color: G['400'], width: 0.75 } } }] : []),
      ])),
      ...fusszeile(),
    ],
  });

  // Z3 Naechste Schritte: wer, was, bis wann. Ohne Name und Datum ist es kein Schritt.
  def('Z3_NAECHSTE_SCHRITTE', {
    background: { color: GRUND },
    objects: [
      ueberschrift(),
      monoPlatz('kopf', 0, 6, INHALT_Y, 0.26, 'SCHRITT · VERANTWORTLICH · TERMIN'),
      kopfLinie(),
      tabellenPlatz('Drei bis fünf Zeilen, jede mit Name und Datum'),
      ...fusszeile(),
    ],
  });

  // Z4 Anhang-Trenner: trennt Pflicht von Kuer. Ohne ihn gibt es keinen
  // Anhang, sondern ein zu langes Deck.
  def('Z4_ANHANG', {
    background: { color: TIEF },
    objects: [
      { placeholder: { options: { name: 'titel', type: 'title', x: x(0), y: 2.6, w: w(4), h: 1.2,
          fontFace: F.marke, fontSize: 40, bold: true, color: G['100'], charSpacing: -1.2, valign: 'top' }, text: 'Anhang' } },
      { placeholder: { options: { name: 'liste', type: 'body', x: x(0), y: 4.0, w: w(4), h: 1.8,
          fontFace: F.technik, fontSize: kickerPt + 1, color: G['400'], charSpacing: 1.5, lineSpacingMultiple: 1.6, bullet: false },
          text: 'Was im Anhang steht, je Zeile' } },
      ...fusszeile(true),
    ],
  });

  // Z5 Rechtliches: zwei Textspalten in Versandgroesse, Text aus freigegebener Quelle.
  def('Z5_RECHTLICHES', {
    background: { color: GRUND },
    objects: [
      ueberschrift(),
      spaltenKopf('kopf1', 0, 2.8, 'Vertraulichkeit'), koerper(0, 2.8, INHALT_Y + 0.55, INHALT_H - 0.55, 'text1'),
      spaltenKopf('kopf2', 3.2, 2.8, 'Gültigkeit'), koerper(3.2, 2.8, INHALT_Y + 0.55, INHALT_H - 0.55, 'text2'),
      ...fusszeile(),
    ],
  });

  // Z6 Pause: schwarz, leer, ohne Fusszeile — der Bildschirmwechsel vor der
  // Demo passiert hier, nicht auf einer Inhaltsfolie.
  def('Z6_PAUSE', { background: { color: TIEF }, objects: [] });

  // ── Menschen (3) — M1 bis M3 des Foliensystems ─────────────────────────
  // M1 Team: Rolle im Projekt, nicht Titel im Unternehmen. Bilder gleicher Ausschnitt.
  def('M1_TEAM', {
    background: { color: GRUND },
    objects: [
      ueberschrift(),
      ...[0, 1, 2, 3].flatMap((i) => ([
        { placeholder: { options: { name: `bild${i + 1}`, type: 'pic', x: x(i * 1.5), y: INHALT_Y, w: w(1.5) - 0.2, h: w(1.5) - 0.2, line: { color: G['400'], width: 1 } }, text: 'Bild 1∶1' } },
        { placeholder: { options: { name: `name${i + 1}`, type: 'body', x: x(i * 1.5), y: INHALT_Y + w(1.5), w: w(1.5), h: 0.4,
            fontFace: F.marke, fontSize: textPt, bold: true, color: G['950'], bullet: false }, text: 'Name' } },
        monoPlatz(`rolle${i + 1}`, i * 1.5, 1.5, INHALT_Y + w(1.5) + 0.42, 0.26, 'ROLLE IM PROJEKT'),
        koerper(i * 1.5, 1.5, INHALT_Y + w(1.5) + 0.75, INHALT_H - w(1.5) - 0.75, `satz${i + 1}`),
      ])),
      ...fusszeile(),
    ],
  });

  // M2 Nutzerbild: eine Rolle beim Kunden, was sie braucht, was sie hindert,
  // ein echtes Zitat. Keine erfundene Person mit Namen.
  def('M2_NUTZERBILD', {
    background: { color: GRUND },
    objects: [
      ueberschrift(),
      bildRahmen('bild', 0, 2, INHALT_Y, INHALT_H, 'Bild'),
      monoPlatz('kicker1', 2.4, 3.6, INHALT_Y, 0.26, 'BRAUCHT'), koerper(2.4, 3.6, INHALT_Y + 0.35, 1.3, 'braucht'),
      monoPlatz('kicker2', 2.4, 3.6, INHALT_Y + 1.8, 0.26, 'HINDERT'), koerper(2.4, 3.6, INHALT_Y + 2.15, 1.3, 'hindert'),
      { placeholder: { options: { name: 'zitat', type: 'body', x: x(2.4), y: INHALT_Y + INHALT_H - 0.9, w: w(3.6), h: 0.9,
          fontFace: F.marke, fontSize: textPt + 1, bold: true, color: G['950'], lineSpacingMultiple: 1.15, valign: 'bottom', bullet: false }, text: '„Zitat aus dem Gespräch."' } },
      ...fusszeile(),
    ],
  });

  // M3 Fallbeispiel: Ausgangslage, Loesung, Ergebnis. Das Ergebnis ist eine
  // Zahl mit Zeitraum — ohne Zahl ist es ein Zitat und gehoert in Q1.
  def('M3_FALLBEISPIEL', {
    background: { color: GRUND },
    objects: [
      ueberschrift(),
      monoPlatz('kicker1', 0, 2, INHALT_Y, 0.26, 'AUSGANGSLAGE'), koerper(0, 1.8, INHALT_Y + 0.4, INHALT_H - 0.4, 'ausgangslage'),
      monoPlatz('kicker2', 2, 2, INHALT_Y, 0.26, 'LÖSUNG'), koerper(2, 1.8, INHALT_Y + 0.4, INHALT_H - 0.4, 'loesung'),
      monoPlatz('kicker3', 4, 2, INHALT_Y, 0.26, 'ERGEBNIS'),
      { placeholder: { options: { name: 'zahl', type: 'body', x: x(4), y: INHALT_Y + 0.4, w: w(2), h: 1.2,
          fontFace: F.marke, fontSize: 48, bold: true, color: G['950'], charSpacing: -1.8, valign: 'top', bullet: false }, text: '00 %' } },
      monoPlatz('beschriftung', 4, 2, INHALT_Y + 1.7, 0.6, 'WAS DIE ZAHL MISST · ZEITRAUM'),
      ...fusszeile(),
    ],
  });

  // ── Anhang (4) — AN1 bis AN4, nur Versandstufe ─────────────────────────
  // AN1 Methodik: Datenbasis, Zeitraum, Definitionen, Ausschluesse. Pflicht in jeder Auswertung.
  def('AN1_METHODIK', {
    background: { color: GRUND },
    objects: [
      ueberschrift(),
      ...[['DATENBASIS', 0, 0], ['ZEITRAUM', 3.2, 0], ['DEFINITIONEN', 0, 1], ['AUSSCHLÜSSE', 3.2, 1]].flatMap(([k, feld, zeile], i) => {
        const y = INHALT_Y + zeile * (INHALT_H / 2);
        return [monoPlatz(`kicker${i + 1}`, feld, 2.8, y, 0.26, k), koerper(feld, 2.8, y + 0.35, INHALT_H / 2 - 0.5, `text${i + 1}`)];
      }),
      ...fusszeile(),
    ],
  });

  // AN2 Glossar: Begriff fett, Erklaerung ein Satz, alphabetisch, zwei Spalten.
  def('AN2_GLOSSAR', {
    background: { color: GRUND },
    objects: [ueberschrift(), koerper(0, 2.8, INHALT_Y, INHALT_H, 'links'), koerper(3.2, 2.8, INHALT_Y, INHALT_H, 'rechts'), ...fusszeile()],
  });

  // AN3 Quellen: Nummer, Folie, Quelle — die Nummern sind die Fussnoten des Decks.
  def('AN3_QUELLEN', {
    background: { color: GRUND },
    objects: [
      ueberschrift(),
      monoPlatz('kopf', 0, 6, INHALT_Y, 0.26, 'NR · FOLIE · QUELLE'),
      kopfLinie(),
      { placeholder: { options: { name: 'quellen', type: 'body', x: x(0), y: INHALT_Y + 0.4, w: w(5), h: INHALT_H - 0.4,
          fontFace: F.technik, fontSize: kickerPt + 1, color: G['800'], charSpacing: 0.5, lineSpacingMultiple: 1.7, bullet: false }, text: 'Je Zeile eine Quelle' } },
      ...fusszeile(),
    ],
  });

  // AN4 Detailtabelle: bis sechs Spalten und zwoelf Zeilen in Versandgroesse.
  // Im Vortrag wird sie nicht gezeigt, sondern angekuendigt.
  def('AN4_DETAILTABELLE', {
    background: { color: GRUND },
    objects: [
      ueberschrift(),
      monoPlatz('kopf', 0, 6, INHALT_Y, 0.26, 'SPALTE · SPALTE · SPALTE · SPALTE · SPALTE · SPALTE'),
      kopfLinie(),
      { placeholder: { options: { name: 'tabelle', type: 'body', x: x(0), y: INHALT_Y + 0.4, w: w(6), h: INHALT_H - 0.4,
          fontFace: F.info, fontSize: 11, color: G['800'], lineSpacingMultiple: 1.5, bullet: false }, text: 'Bis zwölf Zeilen, Zahlen rechtsbündig' } },
      ...fusszeile(),
    ],
  });

  return gemacht;
}

// ── Archiv nachbearbeiten ─────────────────────────────────────────────────
async function imArchiv(datei, arbeit) {
  const { readFile, writeFile } = await import('fs/promises');
  const JSZip = (await import('jszip')).default;
  const zip = await JSZip.loadAsync(await readFile(datei));
  const ergebnis = await arbeit(zip);
  await writeFile(datei, await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' }));
  return ergebnis;
}

// ── Datumsfeld nachtragen ─────────────────────────────────────────────────
// pptxgenjs kennt keinen Feldtyp fuer das Datum. Der Platzhalter {{DATUM}}
// wird deshalb im geschriebenen Archiv gegen ein <a:fld type="datetime1">
// getauscht. PowerPoint aktualisiert es danach beim Oeffnen selbst.
//
// datetime1 rendert nach der Sprache des Laufs — mit lang="de-DE" also
// TT.MM.JJJJ. Der Text im Feld ist nur der Stand beim Erzeugen; PowerPoint
// ueberschreibt ihn.
export async function datumsfeldEinsetzen(datei) {
  return imArchiv(datei, async (zip) => {
    const heute = new Date().toLocaleDateString('de-DE');
    const FELD_ID = '{3F2504E0-4F89-11D3-9A0C-0305E82C3301}';
    let getauscht = 0;

    for (const pfad of Object.keys(zip.files)) {
      if (!/^ppt\/(slideLayouts|slideMasters|slides)\/[^/]+\.xml$/.test(pfad)) continue;
      let xml = await zip.file(pfad).async('string');
      if (!xml.includes('{{DATUM}}')) continue;

      // Den ganzen Run ersetzen, damit die Formatierung erhalten bleibt.
      xml = xml.replace(
        /<a:r>(<a:rPr[^>]*\/>|<a:rPr[^>]*>[\s\S]*?<\/a:rPr>)<a:t>\{\{DATUM\}\}<\/a:t><\/a:r>/g,
        (_, rPr) => `<a:fld id="${FELD_ID}" type="datetime1">${rPr}<a:t>${heute}</a:t></a:fld>`
      );
      // Rueckfall, falls der Run anders geschnitten ist
      xml = xml.replace(/<a:t>\{\{DATUM\}\}<\/a:t>/g, `<a:t>${heute}</a:t>`);

      zip.file(pfad, xml);
      getauscht++;
    }
    return getauscht;
  });
}

// ── Theme nachtragen: Diagrammfarben und Schriften ────────────────────────
// pptxgenjs schreibt ein festes theme1.xml (Office-Standard, accent1 blau).
// Ein Diagramm, das jemand in PowerPoint einfuegt, nimmt seine Reihenfarben
// aus accent1–6 — genau dort muss die Farbfolge aus dem Tokensatz stehen,
// sonst ist die Regel "ein Wert traegt den Akzent" Disziplin statt Standard.
// Dasselbe fuer die Schriften: majorFont fuer Ueberschriften, minorFont
// fuer alles andere, damit Diagrammbeschriftungen nicht in Calibri fallen.
export async function themeEinsetzen(datei) {
  return imArchiv(datei, async (zip) => {
    const pfade = Object.keys(zip.files).filter((p) => /^ppt\/theme\/theme\d+\.xml$/.test(p));
    let gesetzt = 0;
    for (const pfad of pfade) {
      let xml = await zip.file(pfad).async('string');
      DIAGRAMM.farbfolge.forEach((farbe, i) => {
        xml = xml.replace(
          new RegExp(`(<a:accent${i + 1}>\\s*<a:srgbClr val=")[0-9A-Fa-f]{6}(")`),
          `$1${farbe}$2`
        );
      });
      xml = xml.replace(/(<a:majorFont>\s*<a:latin typeface=")[^"]*(")/, `$1${F.marke}$2`);
      xml = xml.replace(/(<a:minorFont>\s*<a:latin typeface=")[^"]*(")/, `$1${F.info}$2`);
      zip.file(pfad, xml);
      gesetzt++;
    }
    return gesetzt;
  });
}

// ── Kreise nachtragen ─────────────────────────────────────────────────────
// Master-Definitionen kennen nur Rechtecke. In den Konzept-Layouts stehen
// Ring, Stationen, Nabe und Speichen deshalb zuerst als Rechteck im XML und
// werden hier zur Ellipse: jede Form ohne Platzhalter und ohne Text in den
// genannten Layouts. Linien sind p:cxnSp und bleiben unberuehrt.
export const KREIS_LAYOUTS = ['C3_KREISLAUF', 'C6_NABE_SPEICHEN', 'C8_SCHNITTMENGE', 'P3_PROZESS_ERGEBNIS'];
export async function kreiseEinsetzen(datei) {
  return imArchiv(datei, async (zip) => {
    let getauscht = 0;
    for (const pfad of Object.keys(zip.files)) {
      if (!/^ppt\/slideLayouts\/slideLayout\d+\.xml$/.test(pfad)) continue;
      let xml = await zip.file(pfad).async('string');
      const name = (xml.match(/<p:cSld name="([^"]+)"/) || [])[1];
      if (!KREIS_LAYOUTS.includes(name)) continue;
      xml = xml.replace(/<p:sp>[\s\S]*?<\/p:sp>/g, (block) => {
        if (/<p:ph\b/.test(block) || /<a:t>[^<]+<\/a:t>/.test(block)) return block;
        if (!block.includes('prst="rect"')) return block;
        getauscht++;
        return block.replace('prst="rect"', 'prst="ellipse"');
      });
      zip.file(pfad, xml);
    }
    return getauscht;
  });
}

// ── Ausführung ────────────────────────────────────────────────────────────
export async function baueVorlage(ziel, stufe = 'versand') {
  const Z = geometrie(stufe);
  const pptx = new PptxGenJS();
  pptx.defineLayout({ name: 'NEO_16x9', width: BREITE, height: HOEHE });
  pptx.layout = 'NEO_16x9';
  pptx.author = 'NEOCOSMO';
  pptx.company = 'NEOCOSMO GmbH';
  pptx.title = `NEO Master · ${Z.label}`;
  pptx.subject = 'Foliensatz-Vorlage aus dem NEO Design System';

  const namen = definiereMaster(pptx, 'graphit', stufe);

  // Eine Übersichtsfolie je Layout, damit die Vorlage prüfbar ist.
  for (const n of namen) {
    const s = pptx.addSlide({ masterName: n });
    s.addText(`${n} · ${Z.label}`, { x: 0.2, y: HOEHE - 0.34, w: 5, h: 0.24,
                   fontFace: F.technik, fontSize: 8, color: G['500'], charSpacing: 1 });
  }

  mkdirSync(dirname(ziel), { recursive: true });
  await pptx.writeFile({ fileName: ziel });
  const datiert = await datumsfeldEinsetzen(ziel);
  const themes = await themeEinsetzen(ziel);
  const kreise = await kreiseEinsetzen(ziel);
  return { ziel, stufe, anzahl: namen.length, namen, datiert, themes, kreise };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const nur = process.argv[2];
  const stufen = nur ? [nur] : STUFEN;
  (async () => {
    let namen = [];
    for (const stufe of stufen) {
      const Z = geometrie(stufe);
      const ziel = join(WURZEL, `dist/pptx/${Z.dateiname}.pptx`);
      const r = await baueVorlage(ziel, stufe);
      namen = r.namen;
      console.log(`\n  ${r.anzahl} Layouts · ${Z.label} (Titelzone ${PRAES.dichtestufen[stufe].titelzone_mm} mm, Text ${Z.textPt} pt) → ${ziel.replace(WURZEL + '/', '')}`);
      console.log(`  Datumsfeld in ${r.datiert} XML-Dateien, Theme in ${r.themes} Datei(en): accent1–6 = ${DIAGRAMM.farbfolge.join(' ')}`);
    }
    console.log('');
    namen.forEach((n, i) => console.log(`    ${String(i + 1).padStart(2)}  ${n}`));
    console.log('\n  Letzter Schritt von Hand: in PowerPoint öffnen,');
    console.log('  "Speichern unter" → PowerPoint-Vorlage (.potx).\n');
  })().catch((e) => { console.error('✗', e.message); process.exit(1); });
}
