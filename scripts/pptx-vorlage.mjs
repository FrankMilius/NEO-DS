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
//   node scripts/pptx-vorlage.mjs            beide Master schreiben
//   node scripts/pptx-vorlage.mjs vortrag    nur eine Stufe
//
// WARUM .pptx UND NICHT .potx
// pptxgenjs schreibt kein Template-Format. Der letzte Schritt ist einmalig
// von Hand: In PowerPoint oeffnen, "Speichern unter" -> PowerPoint-Vorlage.
// Die Master sind dann vollstaendig enthalten.
//
// WAS NACH DEM SCHREIBEN INS XML KOMMT
// pptxgenjs kennt weder ein Datumsfeld noch Theme-Farben. Beides wird nach
// dem Schreiben im Archiv nachgetragen: datumsfeldEinsetzen() und
// themeEinsetzen(). Das Theme traegt accent1–6 und die Schriften — damit
// bekommt ein Diagramm, das jemand in PowerPoint einfuegt, die Farbfolge
// aus dem Tokensatz, ohne dass jemand daran denken muss.
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
  beige: leiter('neutral-beige'),
  ivory: leiter('ivory'),
  taupe: leiter('neutral-taupe'),
  pearl: leiter('neutral-pearl'),
};
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
    const mitZahl = titel === 'T2_SIGNALFELD'
      ? spez
      : { ...spez, slideNumber: seitenzahl(dunkel) };
    pptx.defineSlideMaster({ title: titel, ...mitZahl });
    gemacht.push(titel);
  };

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
  const monoPlatz = (name, feld, felder, y, h, hinweis) => ({
    placeholder: { options: { name, type: 'body', x: x(feld), y, w: w(felder), h,
      fontFace: F.technik, fontSize: kickerPt, color: G['600'], charSpacing: 1.5, bullet: false }, text: hinweis } });
  const tabellenPlatz = (hinweis, felder = 6) => ({
    placeholder: { options: { name: 'tabelle', type: 'body', x: x(0), y: INHALT_Y + 0.4, w: w(felder), h: INHALT_H - 0.4,
      fontFace: F.info, fontSize: textPt - 3, color: G['800'], lineSpacingMultiple: 1.6, bullet: false }, text: hinweis } });
  const kopfLinie = () => ({ line: { x: x(0), y: INHALT_Y + 0.3, w: w(6), h: 0, line: { color: G['950'], width: 1 } } });

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
  return { ziel, stufe, anzahl: namen.length, namen, datiert, themes };
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
