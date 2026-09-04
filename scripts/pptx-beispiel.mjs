// ==========================================================================
// Beispielpräsentationen aus der Vorlage erzeugen
// ==========================================================================
// Drei Branchenfälle je 24 Folien plus die vier Erzählbögen des Foliensystems
// (Produkt, Angebot, Projektplan, Auswertung), alle aus dem Master. Der Zweck ist
// nicht die Foliensammlung, sondern der Beleg: Wenn drei Branchen mit
// demselben Satz auskommen, trägt der Satz.
//
//   node scripts/pptx-beispiel.mjs           alle drei Fälle
//   node scripts/pptx-beispiel.mjs polizei   nur einen
//
// Alle Folien tragen die Fußzeile BEISPIEL. Die Unternehmen sind generisch,
// die Zahlen erfunden.
// ==========================================================================

import PptxGenJS from 'pptxgenjs';
import { readFileSync, mkdirSync } from 'fs';
import { resolve, join } from 'path';
import { definiereMaster, datumsfeldEinsetzen, themeEinsetzen, geometrie, STATUS, G, AKZENT, PAPIER, BREITE, HOEHE, x, w } from './pptx-vorlage.mjs';

const WURZEL = resolve(import.meta.dirname, '..');
const { faelle } = JSON.parse(readFileSync(join(WURZEL, 'data/pptx-beispielfaelle.json'), 'utf8'));

const F = { marke: 'Space Grotesk', info: 'Manrope', technik: 'JetBrains Mono' };

// Beispieldecks laufen in der Versandstufe: Sie werden gelesen, nicht
// vorgetragen. Raster und Titelzone kommen aus dem Generator, nicht aus
// einer Kopie — sonst stimmen die Positionen nicht mehr, sobald die
// Titelzone einer Stufe sich aendert.
const STUFE = process.env.PPTX_STUFE || 'versand';
const { RAND, STEG, TITELZONE, INHALT_Y, INHALT_H } = geometrie(STUFE);

// Papier je Folie: Hintergrund setzen statt fünf Master zu bauen (Kapitel 11.10).
const grundfarbe = (p) => (p === 'tief' ? G['950'] : PAPIER[p]['100']);
const tief = (p) => p === 'tief';

// ── Zeichenhilfen für die Renderer ────────────────────────────────────────
const MONO = (s, t, o) => s.addText(t, { fontFace: F.technik, fontSize: 10, charSpacing: 1.5, valign: 'top', ...o });
const TXT = (s, t, o) => s.addText(t, { fontFace: F.info, fontSize: 14, lineSpacingMultiple: 1.3, valign: 'top', ...o });
const linie = (s, pptx, x1, y1, wdt, hgt, farbe, opt = {}) =>
  s.addShape(pptx.ShapeType.line, { x: x1, y: y1, w: wdt, h: hgt, line: { color: farbe, width: 0.75, ...opt } });
const punkt = (s, pptx, cx, cy, d, farbe) =>
  s.addShape(pptx.ShapeType.ellipse, { x: cx - d / 2, y: cy - d / 2, w: d, h: d, fill: { color: farbe }, line: { color: farbe, width: 0 } });
const flaeche = (s, pptx, form, o, farbe) => s.addShape(form, { ...o, fill: { color: farbe }, line: { color: farbe, width: 0 } });
const hellesPapier = (p) => PAPIER[p === 'tief' ? 'graphit' : p]['200'];

// ── Renderer je Layout ────────────────────────────────────────────────────
// Jeder Renderer zeichnet, was vom Inhalt abhaengt und darum nicht im Master
// stehen kann: Balken, Punkte, Zeilen. Datenfelder je Layout stehen in
// data/pptx-beispielfaelle.json; die Feldnamen hier sind die Referenz.
const RENDERER = {
  // monate: [..] · balken: [[name, von, bis, akzent?]] (Monatsindex, Bruch erlaubt)
  // marken: [[index, name]] · heute: index
  L2_ROADMAP(s, f, c) {
    const { pptx, schrift, zweit } = c;
    const gx = x(1), gw = w(5), mw = gw / f.monate.length, y0 = INHALT_Y + 0.5, rh = 0.55;
    f.monate.forEach((m, i) => MONO(s, m.toUpperCase(), { x: gx + i * mw, y: INHALT_Y, w: mw, h: 0.3, color: zweit }));
    linie(s, pptx, gx, INHALT_Y + 0.38, gw, 0, G['400']);
    const hoehe = f.balken.length * rh + (f.marken ? 0.75 : 0.1);
    for (let i = 0; i <= f.monate.length; i++) linie(s, pptx, gx + i * mw, y0, 0, hoehe, G['300']);
    f.balken.forEach(([name, von, bis, akzent], i) => {
      const y = y0 + i * rh;
      TXT(s, name, { x: x(0), y: y + 0.03, w: w(1), h: rh, fontSize: 13, color: schrift });
      flaeche(s, pptx, pptx.ShapeType.rect, { x: gx + von * mw, y: y + 0.12, w: (bis - von) * mw, h: 0.3 }, akzent ? AKZENT['500'] : G['300']);
    });
    if (f.marken) {
      const y = y0 + f.balken.length * rh + 0.12;
      f.marken.forEach(([idx, name]) => {
        const mx = gx + idx * mw;
        flaeche(s, pptx, pptx.ShapeType.diamond, { x: mx - 0.1, y, w: 0.2, h: 0.2 }, schrift);
        MONO(s, name, { x: Math.min(mx - 0.9, BREITE - RAND - 1.8), y: y + 0.24, w: 1.8, h: 0.24, color: zweit, align: 'center', fontSize: 9 });
      });
    }
    if (f.heute != null) {
      const hx = gx + f.heute * mw;
      linie(s, pptx, hx, INHALT_Y, 0, hoehe + 0.5, schrift, { width: 1.25, dashType: 'dash' });
      MONO(s, 'HEUTE', { x: hx + 0.06, y: INHALT_Y + hoehe + 0.5, w: 1, h: 0.24, color: schrift, fontSize: 9 });
    }
  },

  // meilensteine: [[datum, name, kriterium, status]] · status: gruen | gelb | rot
  L3_MEILENSTEINE(s, f, c) {
    const { pptx, schrift, zweit, dunkel } = c, rh = 0.78;
    [['DATUM', 0, 0.8], ['MEILENSTEIN', 0.8, 1.6], ['ABNAHMEKRITERIUM', 2.4, 2.7], ['STATUS', 5.2, 0.8]]
      .forEach(([k, feld, felder]) => MONO(s, k, { x: x(feld), y: INHALT_Y, w: w(felder), h: 0.26, color: zweit }));
    linie(s, pptx, x(0), INHALT_Y + 0.3, w(6), 0, schrift, { width: 1 });
    f.meilensteine.forEach(([datum, name, krit, st], i) => {
      const y = INHALT_Y + 0.4 + i * rh, S = STATUS[dunkel ? 'tief' : 'hell'][st];
      MONO(s, datum, { x: x(0), y: y + 0.04, w: w(0.8), h: 0.26, color: zweit, fontSize: 11 });
      TXT(s, name, { x: x(0.8), y, w: w(1.6) - 0.1, h: rh - 0.1, bold: true, color: schrift });
      TXT(s, krit, { x: x(2.4), y, w: w(2.7), h: rh - 0.1, color: zweit });
      punkt(s, pptx, x(5.2) + 0.08, y + 0.15, 0.16, S.marke);
      MONO(s, S.bedeutung, { x: x(5.2) + 0.24, y: y + 0.02, w: w(0.8) - 0.24, h: 0.26, color: schrift, fontSize: 9 });
      linie(s, pptx, x(0), y + rh - 0.06, w(6), 0, G['300']);
    });
  },

  // phasen: [[name, ergebnis, text, dauer]] — drei bis fünf
  L4_PHASEN_ERGEBNIS(s, f, c) {
    const { pptx, schrift, zweit, papier } = c, n = f.phasen.length;
    const cw = (w(6) - (n - 1) * STEG) / n, fl = hellesPapier(papier);
    f.phasen.forEach(([name, erg, txt, dauer], i) => {
      const cx = x(0) + i * (cw + STEG);
      flaeche(s, pptx, pptx.ShapeType.chevron, { x: cx, y: INHALT_Y, w: cw, h: 0.6 }, fl);
      s.addText(name, { x: cx + 0.25, y: INHALT_Y, w: cw - 0.5, h: 0.6, fontFace: F.marke, fontSize: 14, bold: true, color: G['950'], valign: 'middle' });
      TXT(s, erg, { x: cx, y: INHALT_Y + 0.85, w: cw, h: 0.5, bold: true, color: schrift, fontSize: 15 });
      TXT(s, txt, { x: cx, y: INHALT_Y + 1.4, w: cw, h: 1.6, color: zweit, fontSize: 13 });
      MONO(s, dauer.toUpperCase(), { x: cx, y: INHALT_Y + 3.1, w: cw, h: 0.26, color: zweit });
    });
  },

  // rollen: { kopf: [Aufgabe, Rolle, ...], zeilen: [[aufgabe, V|A|G|I, ...]] } · hinweis
  L5_ROLLEN(s, f, c) {
    const { pptx, schrift, zweit } = c, { kopf, zeilen } = f.rollen;
    const kw = w(2), sw = (w(6) - kw - STEG) / (kopf.length - 1), rh = 0.55;
    kopf.forEach((k, i) => MONO(s, k.toUpperCase(), { x: i ? x(2) + (i - 1) * sw : x(0), y: INHALT_Y, w: i ? sw : kw, h: 0.26, color: zweit, align: i ? 'center' : 'left' }));
    linie(s, pptx, x(0), INHALT_Y + 0.3, w(6), 0, schrift, { width: 1 });
    zeilen.forEach((z, r) => {
      const y = INHALT_Y + 0.4 + r * rh;
      TXT(s, z[0], { x: x(0), y, w: kw, h: rh - 0.1, color: schrift });
      z.slice(1).forEach((v, i) => s.addText(v, { x: x(2) + i * sw, y, w: sw, h: rh - 0.1, fontFace: F.marke, fontSize: 15,
        bold: v === 'V', color: v === 'V' ? schrift : zweit, align: 'center', valign: 'top' }));
      linie(s, pptx, x(0), y + rh - 0.06, w(6), 0, G['300']);
    });
    if (f.hinweis) MONO(s, f.hinweis, { x: x(0), y: INHALT_Y + 0.55 + zeilen.length * rh, w: w(6), h: 0.26, color: zweit, fontSize: 9 });
  },

  // risiken: [[name, massnahme, wahrscheinlichkeit 1–3, auswirkung 1–3]] — Nummer = Reihenfolge
  L6_RISIKEN(s, f, c) {
    const { pptx, schrift, zweit, dunkel, papier } = c;
    const mx = x(0) + 0.35, my = INHALT_Y, ms = Math.min(w(2) - 0.35, INHALT_H - 0.4), cell = ms / 3;
    f.risiken.forEach(([name, mass, wk, aw], i) => {
      const cx = mx + (wk - 0.5) * cell, cy = my + (3 - aw + 0.5) * cell;
      punkt(s, pptx, cx, cy, 0.34, schrift);
      s.addText(String(i + 1), { x: cx - 0.17, y: cy - 0.17, w: 0.34, h: 0.34, fontFace: F.technik, fontSize: 10, bold: true,
        color: dunkel ? G['950'] : G['100'], align: 'center', valign: 'middle' });
      const ly = INHALT_Y + i * 1.05, lx = x(2) + 0.3;
      s.addShape(pptx.ShapeType.ellipse, { x: lx, y: ly + 0.02, w: 0.3, h: 0.3, fill: { color: grundfarbe(papier) }, line: { color: schrift, width: 1 } });
      s.addText(String(i + 1), { x: lx, y: ly + 0.02, w: 0.3, h: 0.3, fontFace: F.technik, fontSize: 10, color: schrift, align: 'center', valign: 'middle' });
      TXT(s, name, { x: lx + 0.42, y: ly, w: w(3.5), h: 0.35, bold: true, color: schrift });
      TXT(s, mass, { x: lx + 0.42, y: ly + 0.36, w: w(3.5), h: 0.6, color: zweit, fontSize: 13 });
    });
  },

  // status: [[gruen|gelb|rot, paket, abweichung, entscheidung]]
  L7_STATUSBERICHT(s, f, c) {
    const { pptx, schrift, zweit, dunkel } = c, rh = 0.85;
    f.status.forEach(([amp, paket, abw, ent], i) => {
      const y = INHALT_Y + 0.4 + i * rh, S = STATUS[dunkel ? 'tief' : 'hell'][amp];
      punkt(s, pptx, x(0) + 0.09, y + 0.14, 0.18, S.marke);
      MONO(s, S.bedeutung, { x: x(0) + 0.28, y: y + 0.01, w: w(1.5) - 0.3, h: 0.26, color: schrift });
      TXT(s, paket, { x: x(1.5), y, w: w(1.3), h: rh - 0.1, bold: true, color: schrift });
      TXT(s, abw, { x: x(2.8), y, w: w(1.8), h: rh - 0.1, color: zweit });
      if (ent) TXT(s, ent, { x: x(4.6), y, w: w(1.4), h: rh - 0.1, color: schrift });
      linie(s, pptx, x(0), y + rh - 0.06, w(6), 0, G['300']);
    });
  },

  // entscheidung: { optionen: [..], zeilen: [[kriterium, wert je Option]] } — erste Option ist die Empfehlung
  L8_ENTSCHEIDUNG(s, f, c) {
    const { pptx, schrift, zweit } = c, { optionen, zeilen } = f.entscheidung, n = optionen.length;
    const kw = w(1.5), ow = (w(6) - kw) / n, rh = 0.62;
    optionen.forEach((o, i) => s.addText(o, { x: x(1.5) + i * ow + 0.15, y: INHALT_Y, w: ow - 0.3, h: 0.5, fontFace: F.marke, fontSize: 15, bold: true, color: schrift, valign: 'top' }));
    linie(s, pptx, x(0), INHALT_Y + 0.55, w(6), 0, schrift, { width: 1 });
    zeilen.forEach((z, r) => {
      const y = INHALT_Y + 0.65 + r * rh, letzte = r === zeilen.length - 1;
      TXT(s, z[0], { x: x(0), y, w: kw, h: rh - 0.1, color: zweit, fontSize: 13 });
      z.slice(1).forEach((v, i) => TXT(s, v, { x: x(1.5) + i * ow + 0.15, y, w: ow - 0.3, h: rh - 0.1, color: schrift, bold: letzte || i === 0 }));
      linie(s, pptx, x(0), y + rh - 0.06, w(6), 0, G['300']);
    });
  },

  // positionen: [[text, betrag]] · summe: [text, betrag] · hinweis
  L9_KONDITIONEN(s, f, c) {
    const { pptx, schrift, zweit } = c, rh = 0.5;
    f.positionen.forEach(([t, b], i) => {
      const y = INHALT_Y + i * rh;
      TXT(s, t, { x: x(0), y, w: w(2.8), h: rh - 0.08, color: schrift });
      s.addText(b, { x: x(2.8), y, w: w(1.2), h: rh - 0.08, fontFace: F.info, fontSize: 14, color: schrift, align: 'right', valign: 'top' });
      linie(s, pptx, x(0), y + rh - 0.04, w(4), 0, G['300']);
    });
    const sy = INHALT_Y + f.positionen.length * rh + 0.1;
    linie(s, pptx, x(0), sy - 0.02, w(4), 0, schrift, { width: 1.25 });
    TXT(s, f.summe[0], { x: x(0), y: sy + 0.06, w: w(2.8), h: 0.5, bold: true, color: schrift, fontSize: 16 });
    s.addText(f.summe[1], { x: x(2.8), y: sy + 0.06, w: w(1.2), h: 0.5, fontFace: F.marke, fontSize: 18, bold: true, color: schrift, align: 'right', valign: 'top' });
    if (f.hinweis) MONO(s, f.hinweis, { x: x(0), y: sy + 0.75, w: w(4), h: 0.6, color: zweit, fontSize: 9 });
  },

  // titel (der Satz) · einsatz (was auf dem Spiel steht)
  X4_BIG_IDEA(s, f, c) {
    TXT(s, f.einsatz, { x: x(0), y: 4.4, w: w(4), h: 1.2, color: c.zweit, fontSize: 16 });
  },

  // begriff · text
  X6_DEFINITION(s, f, c) {
    s.addText(f.begriff, { x: x(0), y: INHALT_Y, w: w(2), h: 1.6, fontFace: F.marke, fontSize: 32, bold: true, color: c.schrift, charSpacing: -0.9, valign: 'top' });
    TXT(s, f.text, { x: x(2.4), y: INHALT_Y + 0.1, w: w(3.6), h: INHALT_H - 0.1, color: c.schrift, fontSize: 16 });
  },

  // zwei: [[kopf, text], [kopf, text]]
  X7_ZWEI_SPALTEN(s, f, c, groesse = 15) {
    f.zwei.forEach(([kopf, text], i) => {
      const feld = i ? 3.2 : 0;
      if (kopf) s.addText(kopf, { x: x(feld), y: INHALT_Y, w: w(2.8), h: 0.45, fontFace: F.marke, fontSize: 17, bold: true, color: c.schrift, valign: 'top' });
      TXT(s, text, { x: x(feld), y: INHALT_Y + 0.55, w: w(2.8), h: INHALT_H - 0.55, color: c.zweit, fontSize: groesse });
    });
  },
  Z5_RECHTLICHES(s, f, c) { RENDERER.X7_ZWEI_SPALTEN(s, f, c, 12); },

  // punkte: [..] — drei bis fuenf, Marke ist eine kurze Haarlinie in Tinte
  X8_LISTE(s, f, c) {
    const rh = Math.min(0.9, (INHALT_H - 0.2) / f.punkte.length);
    f.punkte.forEach((t, i) => {
      const y = INHALT_Y + i * rh;
      linie(s, c.pptx, x(0), y + 0.17, 0.18, 0, c.schrift, { width: 1.5 });
      TXT(s, t, { x: x(0.25), y, w: w(4), h: rh - 0.05, color: c.schrift, fontSize: 16 });
    });
  },

  // empfehlung · gruende: [..] · konsequenz: [zahl, beschriftung]
  X9_ZUSAMMENFASSUNG(s, f, c) {
    s.addText(f.empfehlung, { x: x(0), y: INHALT_Y, w: w(4), h: 0.9, fontFace: F.marke, fontSize: 20, bold: true, color: c.schrift, lineSpacingMultiple: 1.15, valign: 'top' });
    f.gruende.forEach((g, i) => {
      const y = INHALT_Y + 1.1 + i * 0.7;
      linie(s, c.pptx, x(0), y + 0.16, 0.18, 0, c.schrift, { width: 1.5 });
      TXT(s, g, { x: x(0.25), y, w: w(3.75), h: 0.65, color: c.zweit, fontSize: 15 });
    });
    s.addText(f.konsequenz[0], { x: x(4.4), y: INHALT_Y, w: w(1.6), h: 1.2, fontFace: F.marke, fontSize: 40, bold: true, color: c.schrift, charSpacing: -1.4, valign: 'top' });
    MONO(s, f.konsequenz[1], { x: x(4.4), y: INHALT_Y + 1.3, w: w(1.6), h: 0.8, color: c.zweit, fontSize: 9 });
  },

  // punkte: [..] · aktuell: index · papiere: [papiername je Punkt]
  AG2_AGENDA_STAND(s, f, c) {
    const rh = 0.72;
    f.punkte.forEach((t, i) => {
      const y = INHALT_Y + i * rh, ist = i === f.aktuell;
      const papier = f.papiere ? f.papiere[i] : null;
      if (papier) s.addShape(c.pptx.ShapeType.rect, { x: x(0), y: y + 0.06, w: 0.62, h: 0.35,
        fill: { color: PAPIER[papier]['100'] }, line: { color: ist ? c.schrift : G['400'], width: ist ? 1.25 : 0.75 } });
      s.addText(t, { x: x(0.5), y, w: w(4), h: rh - 0.1, fontFace: F.marke, fontSize: 20, bold: ist, color: ist ? c.schrift : c.zweit, valign: 'top' });
    });
  },

  // saetze: [drei Saetze, woertlich aus dem Deck]
  Z2_KERNAUSSAGEN(s, f, c) {
    f.saetze.forEach((t, i) => {
      s.addText(t, { x: x(0), y: INHALT_Y + i * 1.25, w: w(4), h: 1.0, fontFace: F.marke, fontSize: 20, bold: true, color: c.schrift, lineSpacingMultiple: 1.15, valign: 'top' });
      if (i < f.saetze.length - 1) linie(s, c.pptx, x(0), INHALT_Y + i * 1.25 + 1.1, w(4), 0, G['400']);
    });
  },

  // schritte: [[schritt, verantwortlich, termin]]
  Z3_NAECHSTE_SCHRITTE(s, f, c) {
    const { pptx, schrift, zweit } = c, rh = 0.62;
    [['SCHRITT', 0, 3], ['VERANTWORTLICH', 3, 2], ['TERMIN', 5, 1]].forEach(([k, feld, felder]) => MONO(s, k, { x: x(feld), y: INHALT_Y, w: w(felder), h: 0.26, color: zweit, align: feld === 5 ? 'right' : 'left' }));
    linie(s, pptx, x(0), INHALT_Y + 0.3, w(6), 0, schrift, { width: 1 });
    f.schritte.forEach(([was, wer, wann], i) => {
      const y = INHALT_Y + 0.4 + i * rh;
      TXT(s, was, { x: x(0), y, w: w(3) - 0.1, h: rh - 0.1, bold: true, color: schrift, fontSize: 15 });
      TXT(s, wer, { x: x(3), y, w: w(2), h: rh - 0.1, color: zweit });
      MONO(s, wann, { x: x(5), y: y + 0.04, w: w(1), h: 0.26, color: schrift, fontSize: 11, align: 'right' });
      linie(s, pptx, x(0), y + rh - 0.06, w(6), 0, G['300']);
    });
  },

  // liste: [..] — was im Anhang steht
  Z4_ANHANG(s, f, c) {
    MONO(s, f.liste.join('\n'), { x: x(0), y: 4.0, w: w(4), h: 1.8, color: G['400'], fontSize: 11, lineSpacingMultiple: 1.6 });
  },

  // enthalten: [..] · nicht: [..]
  L10_LIEFERUMFANG(s, f, c) {
    const { pptx, schrift, zweit } = c, rh = 0.5, y0 = INHALT_Y + 0.45;
    f.enthalten.forEach((t, i) => {
      const y = y0 + i * rh;
      punkt(s, pptx, x(0) + 0.08, y + 0.15, 0.14, schrift);
      TXT(s, t, { x: x(0) + 0.32, y, w: w(2.8) - 0.32, h: rh, color: schrift });
    });
    f.nicht.forEach((t, i) => {
      const y = y0 + i * rh;
      linie(s, pptx, x(3.2), y + 0.15, 0.16, 0, zweit, { width: 1.25 });
      TXT(s, t, { x: x(3.2) + 0.32, y, w: w(2.8) - 0.32, h: rh, color: zweit });
    });
  },
};

async function baue(fall) {
  const pptx = new PptxGenJS();
  pptx.defineLayout({ name: 'NEO_16x9', width: BREITE, height: HOEHE });
  pptx.layout = 'NEO_16x9';
  pptx.author = 'NEOCOSMO';
  pptx.company = 'NEOCOSMO GmbH';
  pptx.title = `${fall.titel} — Beispiel`;
  pptx.subject = `Beispielpräsentation · ${fall.branche}`;
  definiereMaster(pptx, 'graphit', STUFE);

  fall.folien.forEach((f, i) => {
    const s = pptx.addSlide({ masterName: f.l });
    s.background = { color: grundfarbe(f.p) };
    const schrift = tief(f.p) ? G['100'] : G['950'];
    const zweit = tief(f.p) ? G['400'] : G['700'];

    if (f.kicker) s.addText(f.kicker, { x: x(0), y: RAND, w: w(4), h: 0.26,
      fontFace: F.technik, fontSize: 10, color: tief(f.p) ? G['400'] : G['600'], charSpacing: 2 });

    if (f.titel) {
      const gross = ['T1_TITEL_TIEF', 'T2_SIGNALFELD', 'T4_TITEL_KUNDE', 'X1_STATEMENT', 'X4_BIG_IDEA', 'X5_FRAGE',
                     'A1_ABSCHNITT_TIEF', 'A2_ABSCHNITT_PAPIER', 'Q1_ZITAT', 'Z1_ABSCHLUSS', 'Z4_ANHANG'].includes(f.l);
      const band = f.l === 'A3_ABSCHNITT_BAND';
      s.addText(f.titel, {
        x: x(0), y: band ? 3.2 : (gross ? 2.2 : RAND), w: w(band ? 5 : (gross ? 5 : 5)),
        h: gross ? 2.4 : (band ? 1.1 : TITELZONE - 0.2),
        fontFace: F.marke, fontSize: band ? 32 : (gross ? 38 : 28), bold: true,
        color: band ? G['100'] : (f.l === 'T2_SIGNALFELD' ? G['950'] : schrift),
        charSpacing: gross ? -1.2 : -0.6, lineSpacingMultiple: 1.05, valign: 'top',
      });
    }

    if (f.text) s.addText(f.text, { x: x(f.l.startsWith('S2') || f.l.startsWith('D2') ? 4 : 0),
      y: f.l === 'K1_KPI_EINE' ? 4.3 : INHALT_Y,
      w: w(f.l.startsWith('S2') || f.l.startsWith('D2') ? 2 : 4),
      h: f.l === 'K1_KPI_EINE' ? 0.7 : INHALT_H,
      fontFace: F.info, fontSize: 16, color: zweit, lineSpacingMultiple: 1.45, valign: 'top' });

    if (f.zahl) s.addText(f.zahl, { x: x(0), y: 2.2, w: w(4), h: 1.9,
      fontFace: F.marke, fontSize: 80, bold: true, color: schrift, charSpacing: -3, valign: 'top' });

    if (f.kpi) f.kpi.forEach(([zahl, label], n) => {
      s.addText(zahl, { x: x(n * 2), y: INHALT_Y + 0.3, w: w(2), h: 1.1,
        fontFace: F.marke, fontSize: 44, bold: true, color: schrift, charSpacing: -1.6, valign: 'top' });
      s.addText(label, { x: x(n * 2), y: INHALT_Y + 1.5, w: w(2), h: 0.9,
        fontFace: F.technik, fontSize: 11, color: zweit, charSpacing: 1.5 });
    });

    if (f.spalten) f.spalten.forEach(([kopf, txt], n) => {
      s.addText(kopf, { x: x(n * 2), y: INHALT_Y, w: w(2), h: 0.4,
        fontFace: F.technik, fontSize: 11, color: zweit, charSpacing: 1.5 });
      s.addText(txt, { x: x(n * 2), y: INHALT_Y + 0.5, w: w(2), h: 2.0,
        fontFace: F.info, fontSize: 15, color: schrift, lineSpacingMultiple: 1.4, valign: 'top' });
    });

    if (f.links) s.addText(f.links, { x: x(0) + 0.25, y: INHALT_Y + 0.25, w: w(3) - 0.5, h: INHALT_H - 0.5,
      fontFace: F.info, fontSize: 15, color: schrift, lineSpacingMultiple: 1.4, valign: 'top' });
    if (f.rechts) s.addText(f.rechts, { x: x(3) + 0.25, y: INHALT_Y + 0.25, w: w(3) - 0.5, h: INHALT_H - 0.5,
      fontFace: F.info, fontSize: 15, color: schrift, lineSpacingMultiple: 1.4, valign: 'top' });

    if (f.quelle) s.addText(f.quelle, { x: x(0), y: 5.0, w: w(4), h: 0.5,
      fontFace: F.info, fontSize: 14, color: zweit });
    if (f.kontakt) s.addText(f.kontakt, { x: x(0), y: 3.9, w: w(4), h: 1.0,
      fontFace: F.info, fontSize: 16, color: G['400'] });

    if (RENDERER[f.l]) RENDERER[f.l](s, f, { pptx, schrift, zweit, dunkel: tief(f.p), papier: f.p });

    // Ersatzmarke: Das Layout, das die Folie eigentlich braucht, gibt es
    // im Master noch nicht. Die Marke steht AUF der Folie, nicht nur in den
    // Notizen — ein Ersatzlayout sieht sonst fertig aus. Phasen 3 bis 8 des
    // Plans bringen die Zahl der Marken auf null (npm run pptx:pruefen).
    if (f.soll) {
      const rot = tief(f.p) ? STATUS.tief.rot.text : STATUS.hell.rot.text;
      s.addText(`FEHLT · ${f.soll}`, { x: x(3), y: RAND, w: w(2), h: 0.26,
        fontFace: F.technik, fontSize: 10, bold: true, color: rot, charSpacing: 1.5, align: 'right' });
      s.addNotes(`Ersatz: ${f.l} steht für ${f.soll}. Das Ziel-Layout ist im Katalog des Foliensystems beschrieben und kommt mit einer späteren Phase.`);
    }

    // Copyright, Datum und Seitenzahl liefert der Master. Hier kommt nur die
    // Beispielkennzeichnung dazu — sie steht neben dem Copyright und macht
    // auf jeder Folie sichtbar, dass die Zahlen erfunden sind.
    if (f.l !== 'T2_SIGNALFELD') {
      s.addText('BEISPIEL', { x: x(2.1), y: HOEHE - 0.5, w: w(1), h: 0.24,
        fontFace: F.technik, fontSize: 9, bold: true,
        color: tief(f.p) ? G['400'] : G['700'], charSpacing: 1.5 });
    }
  });

  const ziel = join(WURZEL, `dist/pptx/NEO-Beispiel-${fall.id}.pptx`);
  mkdirSync(join(WURZEL, 'dist/pptx'), { recursive: true });
  await pptx.writeFile({ fileName: ziel });
  const datiert = await datumsfeldEinsetzen(ziel);
  await themeEinsetzen(ziel);
  return { ziel, folien: fall.folien.length, datiert };
}

const nur = process.argv[2];
const zuBauen = nur ? faelle.filter((f) => f.id === nur) : faelle;
if (!zuBauen.length) { console.error(`✗ Kein Fall "${nur}". Vorhanden: ${faelle.map(f => f.id).join(', ')}`); process.exit(1); }

for (const fall of zuBauen) {
  const { ziel, folien, datiert } = await baue(fall);
  console.log(`  ✓ ${String(folien).padStart(2)} Folien, Datumsfeld in ${String(datiert).padStart(2)} XML — ${fall.branche.padEnd(34)} → ${ziel.replace(WURZEL + '/', '')}`);
}
