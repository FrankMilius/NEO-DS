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
import { definiereMaster, datumsfeldEinsetzen, themeEinsetzen, kreiseEinsetzen, geometrie, STATUS, DIAGRAMM, G, AKZENT, PAPIER, BREITE, HOEHE, x, w } from './pptx-vorlage.mjs';

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

// Natives Diagramm mit den Voreinstellungen des Foliensystems: Farbfolge
// aus dem Tokensatz, Beschriftung am Wert, keine Gitterlinien, keine
// Legende, Flaechen in Papierfarbe. Wer eine Option braucht, ueberschreibt
// sie — die Regel "ein Wert traegt den Akzent" bleibt Sache des Aufrufers.
//
// pptxgenjs schreibt eigene Farben in die Chart-XML und ignoriert das
// Theme; darum kommt die Farbfolge hier noch einmal als chartColors mit.
const diagramm = (s, c, typ, daten, o = {}) => {
  const grund = grundfarbe(c.papier);
  return s.addChart(c.pptx.ChartType[typ], daten, {
    chartColors: DIAGRAMM.farbfolge,
    chartArea: { fill: { color: grund } }, plotArea: { fill: { color: grund } },
    showLegend: false, showTitle: false,
    valAxisHidden: true, valGridLine: { style: 'none' }, catGridLine: { style: 'none' },
    catAxisLineShow: true, catAxisLineColor: DIAGRAMM.achse, catAxisLineSize: 0.75,
    catAxisLabelFontFace: F.info, catAxisLabelFontSize: 11, catAxisLabelColor: DIAGRAMM.beschriftung,
    valAxisLabelFontFace: F.info, valAxisLabelFontSize: 10, valAxisLabelColor: DIAGRAMM.beschriftung,
    showValue: true, dataLabelFontFace: F.info, dataLabelFontSize: 11, dataLabelColor: DIAGRAMM.beschriftung, dataLabelPosition: 'outEnd',
    barGapWidthPct: 60, lineDataSymbol: 'none',
    ...o,
  });
};

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

  // ── Daten (D3–D10, K4, TB4) ─────────────────────────────────────────────
  // paar: [{ kicker, labels, values }, { … }] · max — gleiche Skala ist Pflicht
  D3_DIAGRAMMPAAR(s, f, c) {
    f.paar.forEach((d, i) => {
      const feld = i ? 3.2 : 0;
      MONO(s, d.kicker.toUpperCase(), { x: x(feld), y: INHALT_Y, w: w(2.8), h: 0.26, color: c.zweit });
      diagramm(s, c, 'bar', [{ name: d.kicker, labels: d.labels, values: d.values }],
        { x: x(feld), y: INHALT_Y + 0.4, w: w(2.8), h: INHALT_H - 0.4, barDir: 'col', valAxisMaxVal: f.max, chartColors: [G['400']] });
    });
  },

  // vielfache: [{ kicker, values, akzent? }] · labels · max
  D4_KLEINE_VIELFACHE(s, f, c) {
    const VH = (INHALT_H - 0.3) / 2;
    f.vielfache.forEach((d, i) => {
      const feld = (i % 3) * 2, y = INHALT_Y + Math.floor(i / 3) * (VH + 0.3);
      MONO(s, d.kicker.toUpperCase(), { x: x(feld), y, w: w(2), h: 0.26, color: d.akzent ? c.schrift : c.zweit, bold: !!d.akzent });
      diagramm(s, c, 'line', [{ name: d.kicker, labels: f.labels, values: d.values }],
        { x: x(feld), y: y + 0.3, w: w(2), h: VH - 0.3, valAxisMaxVal: f.max, valAxisMinVal: 0, catAxisHidden: true, showValue: false,
          lineSize: d.akzent ? 2.5 : 1.5, chartColors: [d.akzent ? DIAGRAMM.hervorhebung : G['500']], lineDataSymbol: 'none' });
    });
  },

  // verlauf: { labels, values } · ereignis: { index, name } · max
  D5_VERLAUF_EREIGNIS(s, f, c) {
    const box = { x: x(0), y: INHALT_Y, w: w(6), h: INHALT_H - 0.4 }, lay = { x: 0.02, y: 0.12, w: 0.96, h: 0.78 };
    diagramm(s, c, 'line', [{ name: 'Verlauf', labels: f.verlauf.labels, values: f.verlauf.values }],
      { ...box, layout: lay, valAxisMaxVal: f.max, valAxisMinVal: 0, showValue: false, lineSize: 2.5, chartColors: [G['600']], lineDataSymbol: 'none' });
    const n = f.verlauf.labels.length, px = box.x + lay.x * box.w + (f.ereignis.index + 0.5) / n * lay.w * box.w;
    linie(s, c.pptx, px, box.y + lay.y * box.h - 0.1, 0, lay.h * box.h + 0.1, c.schrift, { width: 1, dashType: 'dash' });
    MONO(s, f.ereignis.name.toUpperCase(), { x: px + 0.08, y: box.y + 0.02, w: 3, h: 0.26, color: c.schrift });
    const ende = f.verlauf.values[n - 1];
    const ey = box.y + lay.y * box.h + (1 - ende / f.max) * lay.h * box.h;
    punkt(s, c.pptx, box.x + lay.x * box.w + (n - 0.5) / n * lay.w * box.w, ey, 0.16, DIAGRAMM.hervorhebung);
    MONO(s, String(ende), { x: box.x + box.w - 0.7, y: ey - 0.36, w: 0.6, h: 0.26, color: c.schrift, align: 'right', bold: true });
  },

  // rang: { labels, values, akzent: index } · anmerkung
  D6_RANGFOLGE(s, f, c) {
    const paare = f.rang.labels.map((l, i) => [l, f.rang.values[i], i === f.rang.akzent]).sort((a, b) => b[1] - a[1]);
    diagramm(s, c, 'bar', [{ name: 'Wert', labels: paare.map((p) => p[0]), values: paare.map((p) => p[1]) }],
      { x: x(0), y: INHALT_Y, w: w(4), h: INHALT_H, barDir: 'bar', catAxisOrientation: 'maxMin', valAxisMaxVal: f.max,
        chartColors: paare.map((p) => (p[2] ? DIAGRAMM.hervorhebung : G['400'])), barGapWidthPct: 45 });
    if (f.anmerkung) TXT(s, f.anmerkung, { x: x(4.4), y: INHALT_Y, w: w(1.6), h: INHALT_H, color: c.zweit, fontSize: 14 });
  },

  // anteile: [[name, wert, akzent?]] — Summe beliebig, wird auf hundert normiert
  D7_ANTEILE(s, f, c) {
    const summe = f.anteile.reduce((a, [, v]) => a + v, 0);
    const box = { x: x(0), y: INHALT_Y + 0.8, w: w(6), h: 1.6 }, lay = { x: 0, y: 0.05, w: 1, h: 0.9 };
    diagramm(s, c, 'bar', f.anteile.map(([name, v]) => ({ name, labels: ['Anteil'], values: [Math.round(v / summe * 1000) / 10] })),
      { ...box, layout: lay, barDir: 'bar', barGrouping: 'percentStacked', catAxisHidden: true, valAxisMaxVal: 100, barGapWidthPct: 10,
        chartColors: f.anteile.map(([, , ak], i) => (ak ? DIAGRAMM.hervorhebung : [G['400'], G['300'], G['200'], G['500']][i % 4])),
        dataLabelColor: G['950'], dataLabelPosition: 'ctr', dataLabelFormatCode: '0" %"' });
    let lauf = 0;
    f.anteile.forEach(([name, v]) => {
      const bx = box.x + lauf / summe * box.w, bw = v / summe * box.w; lauf += v;
      MONO(s, name.toUpperCase(), { x: bx, y: box.y + box.h + 0.1, w: Math.max(bw, 0.9), h: 0.26, color: c.zweit });
    });
    if (f.text) TXT(s, f.text, { x: x(0), y: INHALT_Y + 3.0, w: w(4), h: INHALT_H - 3.0, color: c.zweit, fontSize: 14 });
  },

  // ziele: [[name, ist, ziel, beschriftung]] — auf hundert Prozent Ziel normiert
  D8_ZIELERREICHUNG(s, f, c) {
    const stand = f.ziele.map(([, ist, ziel]) => Math.min(100, Math.round(ist / ziel * 100)));
    const box = { x: x(0), y: INHALT_Y, w: w(5), h: Math.min(INHALT_H, 0.9 * f.ziele.length + 0.4) }, lay = { x: 0.24, y: 0.05, w: 0.66, h: 0.9 };
    diagramm(s, c, 'bar', [
      { name: 'Stand', labels: f.ziele.map((z) => z[0]), values: stand },
      { name: 'Rest', labels: f.ziele.map((z) => z[0]), values: stand.map((v) => 100 - v) },
    ], { ...box, layout: lay, barDir: 'bar', barGrouping: 'stacked', catAxisOrientation: 'maxMin', valAxisMaxVal: 100, valAxisMinVal: 0,
         showValue: false, barGapWidthPct: 55, chartColors: [G['500'], hellesPapier(c.papier)], catAxisLabelFontSize: 12 });
    const px = box.x + (lay.x + lay.w) * box.w;
    linie(s, c.pptx, px, box.y + lay.y * box.h, 0, lay.h * box.h, c.schrift, { width: 1.25 });
    MONO(s, 'ZIEL', { x: px - 0.5, y: box.y + box.h - 0.02, w: 1, h: 0.24, color: c.schrift, align: 'center', fontSize: 9 });
    f.ziele.forEach(([, , , text], i) => {
      const ry = box.y + lay.y * box.h + (i + 0.5) / f.ziele.length * lay.h * box.h;
      MONO(s, text, { x: px + 0.12, y: ry - 0.13, w: box.x + w(6) - px - 0.12, h: 0.26, color: c.schrift, fontSize: 10 });
    });
  },

  // verteilung: { zeilen, spalten, werte[zeile][spalte] } — Graphitleiter, dunkelste Zelle ist der Befund
  D9_VERTEILUNG(s, f, c) {
    const { zeilen, spalten, werte } = f.verteilung;
    const max = Math.max(...werte.flat()), gx = x(0.5), gy = INHALT_Y + 0.35, gw = w(4), gh = Math.min(INHALT_H - 0.35, 0.42 * zeilen.length);
    const cw = gw / spalten.length, ch = gh / zeilen.length;
    const leiter = [hellesPapier(c.papier), G['300'], G['500'], G['700'], G['950']];
    spalten.forEach((sp, j) => MONO(s, sp, { x: gx + j * cw, y: INHALT_Y, w: cw, h: 0.26, color: c.zweit, align: 'center' }));
    zeilen.forEach((z, i) => {
      MONO(s, z, { x: x(0), y: gy + i * ch + ch / 2 - 0.13, w: w(0.5) - 0.05, h: 0.26, color: c.zweit, align: 'right' });
      spalten.forEach((_, j) => {
        const v = werte[i][j];
        if (v == null) return;
        const stufe = Math.min(4, Math.floor(v / max * 4.999));
        flaeche(s, c.pptx, c.pptx.ShapeType.rect, { x: gx + j * cw + 0.03, y: gy + i * ch + 0.03, w: cw - 0.06, h: ch - 0.06 }, leiter[stufe]);
      });
    });
    MONO(s, 'SKALA', { x: x(4.8), y: INHALT_Y, w: w(1.2), h: 0.26, color: c.zweit });
    leiter.forEach((farbe, k) => flaeche(s, c.pptx, c.pptx.ShapeType.rect, { x: x(4.8), y: gy + k * 0.3, w: 0.3, h: 0.24 }, farbe));
    MONO(s, '0', { x: x(4.8) + 0.4, y: gy, w: 1, h: 0.24, color: c.zweit, fontSize: 9 });
    MONO(s, String(max), { x: x(4.8) + 0.4, y: gy + 4 * 0.3, w: 1, h: 0.24, color: c.zweit, fontSize: 9 });
  },

  // steigung: { von, bis, reihen: [[name, wert1, wert2, akzent?]] } · anmerkung
  D10_STEIGUNG(s, f, c) {
    const { von, bis, reihen } = f.steigung;
    const alle = reihen.flatMap((r) => [r[1], r[2]]), min = 0, max = Math.ceil(Math.max(...alle) / 10) * 10;
    const box = { x: x(0.8), y: INHALT_Y, w: w(2.4), h: INHALT_H - 0.4 }, lay = { x: 0.05, y: 0.06, w: 0.9, h: 0.86 };
    diagramm(s, c, 'line', reihen.map(([name, a, b]) => ({ name, labels: [von, bis], values: [a, b] })),
      { ...box, layout: lay, valAxisMaxVal: max, valAxisMinVal: min, showValue: false, catAxisHidden: true, lineDataSymbol: 'circle', lineDataSymbolSize: 7,
        chartColors: reihen.map((r) => (r[3] ? DIAGRAMM.hervorhebung : G['400'])), lineSize: 2 });
    const yVon = (v) => box.y + lay.y * box.h + (1 - (v - min) / (max - min)) * lay.h * box.h;
    const xl = box.x + lay.x * box.w + 0.25 / 2 * lay.w * box.w, xr = box.x + lay.x * box.w + (1 - 0.25 / 2) * lay.w * box.w;
    MONO(s, von.toUpperCase(), { x: xl - 0.8, y: box.y + box.h + 0.05, w: 1.6, h: 0.26, color: c.zweit, align: 'center' });
    MONO(s, bis.toUpperCase(), { x: xr - 0.8, y: box.y + box.h + 0.05, w: 1.6, h: 0.26, color: c.zweit, align: 'center' });
    reihen.forEach(([name, a, b, ak]) => {
      const farbe = ak ? c.schrift : c.zweit;
      TXT(s, `${name} ${a}`, { x: x(0) - 0.05, y: yVon(a) - 0.14, w: xl - x(0) - 0.15, h: 0.3, color: farbe, fontSize: 11, align: 'right', bold: !!ak });
      TXT(s, `${b} ${name}`, { x: xr + 0.15, y: yVon(b) - 0.14, w: x(4.2) - xr - 0.2, h: 0.3, color: farbe, fontSize: 11, bold: !!ak });
    });
    if (f.anmerkung) TXT(s, f.anmerkung, { x: x(4.2), y: INHALT_Y, w: w(1.8), h: INHALT_H, color: c.zweit, fontSize: 14 });
  },

  // zahl · beschriftung · verlauf: [werte] — Endpunkt im Akzent
  K4_ZAHL_VERLAUF(s, f, c) {
    s.addText(f.zahl, { x: x(0), y: INHALT_Y + 0.2, w: w(2), h: 1.4, fontFace: F.marke, fontSize: 64, bold: true, color: c.schrift, charSpacing: -2.4, valign: 'top' });
    MONO(s, f.beschriftung, { x: x(0), y: INHALT_Y + 1.75, w: w(2), h: 0.5, color: c.zweit });
    const v = f.verlauf, n = v.length, max = Math.max(...v) * 1.15, box = { x: x(2.4), y: INHALT_Y + 0.2, w: w(3.6), h: INHALT_H - 0.6 }, lay = { x: 0.02, y: 0.05, w: 0.9, h: 0.9 };
    diagramm(s, c, 'line', [{ name: 'Verlauf', labels: v.map((_, i) => String(i + 1)), values: v }],
      { ...box, layout: lay, valAxisMaxVal: max, valAxisMinVal: 0, catAxisHidden: true, showValue: false, lineSize: 2.5, chartColors: [G['500']], lineDataSymbol: 'none', catAxisLineShow: false });
    const ex = box.x + lay.x * box.w + (n - 0.5) / n * lay.w * box.w, ey = box.y + lay.y * box.h + (1 - v[n - 1] / max) * lay.h * box.h;
    punkt(s, c.pptx, ex, ey, 0.18, DIAGRAMM.hervorhebung);
    s.addText(String(v[n - 1]), { x: ex + 0.15, y: ey - 0.2, w: 0.9, h: 0.4, fontFace: F.marke, fontSize: 16, bold: true, color: c.schrift, valign: 'middle' });
  },

  // vergleich: { kopf: [Merkmal, Empfehlung, Option, Option], zeilen: [[merkmal, true|false|"Wort", …]] }
  TB4_VERGLEICHSTABELLE(s, f, c) {
    const { kopf, zeilen } = f.vergleich, sw = (w(6) - w(2) - STEG) / 3, rh = 0.55;
    kopf.forEach((k, i) => MONO(s, k.toUpperCase(), { x: i ? x(2) + (i - 1) * sw : x(0), y: INHALT_Y, w: i ? sw : w(2), h: 0.26, color: i === 1 ? c.schrift : c.zweit, bold: i === 1, align: i ? 'center' : 'left' }));
    linie(s, c.pptx, x(0), INHALT_Y + 0.3, w(6), 0, c.schrift, { width: 1 });
    zeilen.forEach((z, r) => {
      const y = INHALT_Y + 0.4 + r * rh;
      TXT(s, z[0], { x: x(0), y, w: w(2), h: rh - 0.1, color: c.schrift });
      z.slice(1).forEach((v, i) => {
        if (v === false || v == null) return;
        const cx = x(2) + i * sw;
        if (v === true) s.addText('✓', { x: cx, y: y - 0.04, w: sw, h: rh - 0.1, fontFace: F.marke, fontSize: 18, bold: true, color: c.schrift, align: 'center', valign: 'top' });
        else TXT(s, String(v), { x: cx, y, w: sw, h: rh - 0.1, color: c.zweit, align: 'center', fontSize: 13 });
      });
      linie(s, c.pptx, x(0), y + rh - 0.06, w(6), 0, G['300']);
    });
  },

  // ── Produkt (S3–S7, R3, LG1) ────────────────────────────────────────────
  // Bildplatzhalter bleiben leer — Bildschirmfotos kommen aus dem Produkt,
  // nicht aus dem Beispiel. Die Renderer zeichnen, was UEBER dem Bild liegt.
  // callouts: [[xProzent, yProzent, erklaerung]] — Nummer ist die Erklaerreihenfolge
  S3_FEATURE_CALLOUTS(s, f, c) {
    const bx = x(0), by = INHALT_Y, bw = w(3.6), bh = INHALT_H;
    f.callouts.forEach(([px, py, text], i) => {
      const cx = bx + px / 100 * bw, cy = by + py / 100 * bh;
      punkt(s, c.pptx, cx, cy, 0.36, c.schrift);
      s.addText(String(i + 1), { x: cx - 0.18, y: cy - 0.18, w: 0.36, h: 0.36, fontFace: F.technik, fontSize: 11, bold: true, color: c.dunkel ? G['950'] : G['100'], align: 'center', valign: 'middle' });
      const ly = INHALT_Y + i * 1.0;
      s.addShape(c.pptx.ShapeType.ellipse, { x: x(4), y: ly + 0.03, w: 0.3, h: 0.3, fill: { color: grundfarbe(c.papier) }, line: { color: c.schrift, width: 1 } });
      s.addText(String(i + 1), { x: x(4), y: ly + 0.03, w: 0.3, h: 0.3, fontFace: F.technik, fontSize: 10, color: c.schrift, align: 'center', valign: 'middle' });
      TXT(s, text, { x: x(4) + 0.42, y: ly, w: w(2) - 0.42, h: 0.95, color: c.schrift });
    });
  },

  // funktionen: [[name, satz]] — vier bis sechs
  S4_FUNKTIONSUEBERSICHT(s, f, c) {
    const KH = (INHALT_H - 0.3) / 2;
    f.funktionen.forEach(([name, satz], i) => {
      const feld = (i % 3) * 2, y = INHALT_Y + Math.floor(i / 3) * (KH + 0.3);
      linie(s, c.pptx, x(feld), y, w(2), 0, G['400']);
      s.addShape(c.pptx.ShapeType.ellipse, { x: x(feld), y: y + 0.2, w: 0.4, h: 0.4, fill: { color: grundfarbe(c.papier) }, line: { color: c.schrift, width: 1 } });
      s.addText(name, { x: x(feld), y: y + 0.75, w: w(2), h: 0.4, fontFace: F.marke, fontSize: 17, bold: true, color: c.schrift, valign: 'top' });
      TXT(s, satz, { x: x(feld), y: y + 1.2, w: w(2), h: KH - 1.25, color: c.zweit });
    });
  },

  // rahmen: [xProzent, yProzent, wProzent, hProzent] im kleinen Bild · text
  S5_AUSSCHNITT_ZOOM(s, f, c) {
    const bx = x(0), by = INHALT_Y, bw = w(2), bh = w(2) * 9 / 16, [rx, ry, rw, rh] = f.rahmen;
    s.addShape(c.pptx.ShapeType.rect, { x: bx + rx / 100 * bw, y: by + ry / 100 * bh, w: rw / 100 * bw, h: rh / 100 * bh, fill: { type: 'none' }, line: { color: DIAGRAMM.hervorhebung, width: 2 } });
    linie(s, c.pptx, bx + (rx + rw) / 100 * bw, by + ry / 100 * bh, x(2.4) - bx - (rx + rw) / 100 * bw, INHALT_Y - by - ry / 100 * bh, DIAGRAMM.hervorhebung, { width: 1, dashType: 'dash' });
    TXT(s, f.text, { x: x(0), y: by + bh + 0.3, w: w(2), h: INHALT_H - bh - 0.3, color: c.zweit });
  },

  // demo: { schritte: [..] } — Klickfolge in den Notizen, Rueckfallbild im Platzhalter
  S6_DEMO(s, f, c) {
    MONO(s, 'LIVE', { x: x(0), y: RAND, w: w(4), h: 0.26, color: AKZENT['800'], bold: true });
    MONO(s, 'LIVE-DEMO · RÜCKFALL: BILDSCHIRMFOTO IN DEN NOTIZEN', { x: x(1), y: INHALT_Y + INHALT_H / 2 - 0.3, w: w(4), h: 0.6, color: c.zweit, align: 'center', fontSize: 11 });
    s.addNotes(`Klickfolge:\n${f.demo.schritte.map((t, i) => `${i + 1}. ${t}`).join('\n')}`);
  },

  // geraete: [nameDesktop, nameMobil]
  S7_GERAETE_PAAR(s, f, c) {
    MONO(s, f.geraete[0].toUpperCase(), { x: x(0), y: INHALT_Y, w: w(3.8), h: 0.26, color: c.zweit });
    MONO(s, f.geraete[1].toUpperCase(), { x: x(4.6), y: INHALT_Y - 0.3, w: w(1.4), h: 0.26, color: c.zweit });
  },

  // ebenen: [[name, text]] von oben nach unten; die letzte ist das Fundament
  R3_EBENENMODELL(s, f, c) {
    const n = f.ebenen.length, eh = (INHALT_H - (n - 1) * 0.12) / n;
    f.ebenen.forEach(([name, text], i) => {
      const y = INHALT_Y + i * (eh + 0.12), unten = i === n - 1;
      s.addShape(c.pptx.ShapeType.rect, { x: x(0), y, w: w(3.4), h: eh, fill: { color: unten ? hellesPapier(c.papier) : grundfarbe(c.papier) }, line: { color: G['400'], width: 0.75 } });
      s.addText(name, { x: x(0) + 0.2, y: y + 0.1, w: w(3.4) - 0.4, h: eh - 0.2, fontFace: F.marke, fontSize: 17, bold: true, color: c.schrift, valign: 'middle' });
      TXT(s, text, { x: x(3.8), y: y + 0.05, w: w(2.2), h: eh, color: c.zweit });
    });
  },

  // logos: [name je Platz] — hier Platzhalter mit Namen, im Ernstfall freigegebene Dateien
  LG1_LOGOWAND(s, f, c) {
    f.logos.forEach((name, i) => {
      const lx = x((i % 4) * 1.5), ly = INHALT_Y + 0.4 + Math.floor(i / 4) * 2.0;
      s.addShape(c.pptx.ShapeType.rect, { x: lx, y: ly, w: w(1.5), h: 1.2, fill: { type: 'none' }, line: { color: G['400'], width: 0.75, dashType: 'dash' } });
      MONO(s, name.toUpperCase(), { x: lx, y: ly + 0.47, w: w(1.5), h: 0.26, color: G['600'], align: 'center' });
    });
  },

  // ── Konzept (C3–C9, P3) ─────────────────────────────────────────────────
  // Die Formen stehen im Master (Ring, Stationen, Balken, Baender). Das Deck
  // fuellt die Positionen mit Text; die Geometrie ist dieselbe wie dort.
  // kreislauf: { stationen: [vier], text }
  C3_KREISLAUF(s, f, c) {
    const CX = x(0) + 1.9, CY = INHALT_Y + INHALT_H / 2, D = Math.min(3.4, INHALT_H - 0.6);
    [[0, -1], [1, 0], [0, 1], [-1, 0]].forEach(([dx, dy], i) => {
      const t = f.kreislauf.stationen[i]; if (!t) return;
      MONO(s, t.toUpperCase(), { x: CX + dx * (D / 2 + 0.3) + (dx === 0 ? -0.9 : dx > 0 ? 0 : -1.8), y: CY + dy * (D / 2 + 0.3) - 0.15 + (dy > 0 ? 0.1 : dy < 0 ? -0.15 : 0), w: 1.8, h: 0.3,
        color: c.schrift, align: dx === 0 ? 'center' : dx > 0 ? 'left' : 'right' });
    });
    TXT(s, f.kreislauf.text, { x: x(3.6), y: INHALT_Y, w: w(2.4), h: INHALT_H, color: c.zweit, fontSize: 15 });
  },

  // hierarchie: { wurzel, kinder: [vier], text }
  C4_HIERARCHIE(s, f, c) {
    const kasten = (t, feld, felder, y, fett) => s.addText(t, { x: x(feld), y, w: w(felder), h: 0.6, fontFace: F.marke, fontSize: fett ? 16 : 14, bold: true, color: c.schrift, align: 'center', valign: 'middle' });
    kasten(f.hierarchie.wurzel, 2, 2, INHALT_Y, true);
    f.hierarchie.kinder.forEach((k, i) => kasten(k, i * 1.5, 1.5, INHALT_Y + 1.3, false));
    if (f.hierarchie.text) TXT(s, f.hierarchie.text, { x: x(0), y: INHALT_Y + 2.2, w: w(6), h: INHALT_H - 2.2, color: c.zweit, fontSize: 15 });
  },

  // trichter: [[name, wert]] — vier Stufen, die dritte traegt den Akzent (Master)
  C5_TRICHTER(s, f, c) {
    [4, 3, 2.2, 1.3].forEach((felder, i) => {
      const st = f.trichter[i]; if (!st) return;
      const y = INHALT_Y + i * 0.85;
      s.addText(st[0], { x: x(0) + 0.2, y, w: w(felder) - 0.4, h: 0.6, fontFace: F.marke, fontSize: 16, bold: true, color: G['950'], valign: 'middle' });
      MONO(s, String(st[1]), { x: x(felder + 0.2), y: y + 0.17, w: w(1), h: 0.3, color: c.schrift, fontSize: 12 });
    });
  },

  // nabe: { zentrum, speichen: [sechs], text }
  C6_NABE_SPEICHEN(s, f, c) {
    const CX = x(0) + w(6) / 2 - 1.2, CY = INHALT_Y + INHALT_H / 2, R = Math.min(1.8, INHALT_H / 2 - 0.5);
    s.addText(f.nabe.zentrum, { x: CX - 0.65, y: CY - 0.65, w: 1.3, h: 1.3, fontFace: F.marke, fontSize: 15, bold: true, color: G['950'], align: 'center', valign: 'middle' });
    f.nabe.speichen.forEach((t, i) => {
      const a = -Math.PI / 2 + i * Math.PI / 3, sx = CX + Math.cos(a) * R, sy = CY + Math.sin(a) * R;
      s.addText(t, { x: sx - 0.45, y: sy - 0.45, w: 0.9, h: 0.9, fontFace: F.info, fontSize: 11, color: c.schrift, align: 'center', valign: 'middle' });
    });
    TXT(s, f.nabe.text, { x: x(4.4), y: INHALT_Y, w: w(1.6), h: INHALT_H, color: c.zweit, fontSize: 14 });
  },

  // pyramide: [[name, text]] von oben (Dach) nach unten (Fundament), vier Ebenen
  C7_PYRAMIDE(s, f, c) {
    [1.3, 2.2, 3, 3.8].forEach((felder, i) => {
      const e = f.pyramide[i]; if (!e) return;
      const y = INHALT_Y + i * 0.85;
      s.addText(e[0], { x: x(0) + 0.2, y, w: w(felder) - 0.4, h: 0.6, fontFace: F.marke, fontSize: 16, bold: true, color: c.schrift, valign: 'middle' });
      TXT(s, e[1], { x: x(4.2), y: y + 0.02, w: w(1.8), h: 0.8, color: c.zweit, fontSize: 13 });
    });
  },

  // schnittmenge: { a: name, b: name, schnitt: name, text }
  C8_SCHNITTMENGE(s, f, c) {
    const CY = INHALT_Y + INHALT_H / 2, D = Math.min(3.0, INHALT_H - 0.4), AX = x(0) + D / 2 + 0.3, BX = AX + D * 0.62;
    s.addText(f.schnittmenge.a, { x: AX - D / 2, y: CY - 0.3, w: D * 0.4, h: 0.6, fontFace: F.marke, fontSize: 15, bold: true, color: c.schrift, align: 'center', valign: 'middle' });
    s.addText(f.schnittmenge.b, { x: BX + D / 2 - D * 0.4, y: CY - 0.3, w: D * 0.4, h: 0.6, fontFace: F.marke, fontSize: 15, bold: true, color: c.schrift, align: 'center', valign: 'middle' });
    s.addText(f.schnittmenge.schnitt, { x: (AX + BX) / 2 - 0.6, y: CY - 0.3, w: 1.2, h: 0.6, fontFace: F.marke, fontSize: 15, bold: true, color: AKZENT['800'], align: 'center', valign: 'middle' });
    TXT(s, f.schnittmenge.text, { x: x(4.2), y: INHALT_Y, w: w(1.8), h: INHALT_H, color: c.zweit, fontSize: 14 });
  },

  // transformation: { ist: [kopf, text], mittel, soll: [kopf, text] }
  C9_TRANSFORMATION(s, f, c) {
    const { ist, mittel, soll } = f.transformation;
    const block = ([kopf, text], feld) => {
      s.addText(kopf, { x: x(feld), y: INHALT_Y + 0.6, w: w(2), h: 0.5, fontFace: F.marke, fontSize: 17, bold: true, color: c.schrift, valign: 'top' });
      TXT(s, text, { x: x(feld), y: INHALT_Y + 1.15, w: w(2), h: INHALT_H - 2.1, color: c.zweit });
    };
    block(ist, 0.1); block(soll, 3.9);
    MONO(s, mittel.toUpperCase(), { x: x(2.2), y: INHALT_Y + INHALT_H / 2 - 0.65, w: w(1.6), h: 0.4, color: c.schrift, align: 'center', bold: true });
  },

  // prozess: [[schritt, ergebnis]] — vier Schritte
  P3_PROZESS_ERGEBNIS(s, f, c) {
    f.prozess.forEach(([schritt, erg], i) => {
      if (i > 3) return;
      s.addText(String(i + 1), { x: x(i * 1.5) + w(1.5) / 2 - 0.21, y: INHALT_Y + 0.04, w: 0.42, h: 0.42, fontFace: F.technik, fontSize: 11, bold: true, color: c.dunkel ? G['950'] : G['100'], align: 'center', valign: 'middle' });
      s.addText(schritt, { x: x(i * 1.5), y: INHALT_Y + 0.6, w: w(1.5), h: 0.4, fontFace: F.marke, fontSize: 16, bold: true, color: c.schrift, align: 'center', valign: 'top' });
      TXT(s, erg, { x: x(i * 1.5), y: INHALT_Y + 1.1, w: w(1.5), h: INHALT_H - 1.1, color: c.zweit, fontSize: 13 });
    });
  },

  // ── Bild, Menschen, Anhang (B5–B7, M1–M3, AN1–AN4) ──────────────────────
  // bilder: [unterschrift je Bild, vier] — Bilder bleiben Platzhalter
  B5_BILDRASTER(s, f, c) {
    const RH = (INHALT_H - 0.6) / 2;
    f.bilder.forEach((u, i) => MONO(s, u.toUpperCase(), { x: x((i % 2) * 3), y: INHALT_Y + Math.floor(i / 2) * (RH + 0.3) + RH - 0.26, w: w(2.8), h: 0.26, color: c.zweit }));
  },

  // vorher · nachher (je ein Satz unter dem Bild)
  B6_VORHER_NACHHER(s, f, c) {
    MONO(s, 'VORHER', { x: x(0), y: INHALT_Y, w: w(2.8), h: 0.26, color: c.zweit });
    MONO(s, 'NACHHER', { x: x(3.2), y: INHALT_Y, w: w(2.8), h: 0.26, color: c.schrift, bold: true });
    TXT(s, f.vorher, { x: x(0), y: INHALT_Y + INHALT_H - 0.3, w: w(2.8), h: 0.3, color: c.zweit, fontSize: 12 });
    TXT(s, f.nachher, { x: x(3.2), y: INHALT_Y + INHALT_H - 0.3, w: w(2.8), h: 0.3, color: c.schrift, fontSize: 12 });
  },

  // tafel: [titel, text] — Text nur auf der Tafel
  B7_VOLLBILD_TAFEL(s, f, c) {
    const TY = 4.2;
    s.addText(f.tafel[0], { x: x(0) + 0.3, y: TY + 0.3, w: w(2.6) - 0.6, h: 0.9, fontFace: F.marke, fontSize: 22, bold: true, color: G['950'], charSpacing: -0.5, valign: 'top' });
    TXT(s, f.tafel[1], { x: x(0.13), y: TY + 1.3, w: w(2.4), h: HOEHE - TY - 1.95, color: G['700'], fontSize: 13 });
  },

  // team: [[name, rolle, satz]] — bis vier
  M1_TEAM(s, f, c) {
    f.team.forEach(([name, rolle, satz], i) => {
      if (i > 3) return;
      s.addText(name, { x: x(i * 1.5), y: INHALT_Y + w(1.5), w: w(1.5), h: 0.4, fontFace: F.marke, fontSize: 16, bold: true, color: c.schrift, valign: 'top' });
      MONO(s, rolle.toUpperCase(), { x: x(i * 1.5), y: INHALT_Y + w(1.5) + 0.42, w: w(1.5), h: 0.26, color: c.zweit, fontSize: 9 });
      TXT(s, satz, { x: x(i * 1.5), y: INHALT_Y + w(1.5) + 0.75, w: w(1.5), h: INHALT_H - w(1.5) - 0.75, color: c.zweit, fontSize: 13 });
    });
  },

  // nutzer: { braucht: [..], hindert: [..], zitat }
  M2_NUTZERBILD(s, f, c) {
    const liste = (kicker, punkte, y) => {
      MONO(s, kicker, { x: x(2.4), y, w: w(3.6), h: 0.26, color: c.zweit });
      punkte.forEach((t, i) => {
        linie(s, c.pptx, x(2.4), y + 0.5 + i * 0.4, 0.18, 0, c.schrift, { width: 1.5 });
        TXT(s, t, { x: x(2.4) + 0.3, y: y + 0.35 + i * 0.4, w: w(3.6) - 0.3, h: 0.4, color: c.schrift });
      });
    };
    liste('BRAUCHT', f.nutzer.braucht, INHALT_Y);
    liste('HINDERT', f.nutzer.hindert, INHALT_Y + 1.8);
    s.addText(f.nutzer.zitat, { x: x(2.4), y: INHALT_Y + INHALT_H - 0.9, w: w(3.6), h: 0.9, fontFace: F.marke, fontSize: 18, bold: true, color: c.schrift, lineSpacingMultiple: 1.15, valign: 'bottom' });
  },

  // fall: { ausgangslage, loesung, ergebnis: [zahl, beschriftung] }
  M3_FALLBEISPIEL(s, f, c) {
    [['AUSGANGSLAGE', 0], ['LÖSUNG', 2], ['ERGEBNIS', 4]].forEach(([k, feld]) => MONO(s, k, { x: x(feld), y: INHALT_Y, w: w(2), h: 0.26, color: c.zweit }));
    TXT(s, f.fall.ausgangslage, { x: x(0), y: INHALT_Y + 0.4, w: w(1.8), h: INHALT_H - 0.4, color: c.schrift, fontSize: 15 });
    TXT(s, f.fall.loesung, { x: x(2), y: INHALT_Y + 0.4, w: w(1.8), h: INHALT_H - 0.4, color: c.schrift, fontSize: 15 });
    s.addText(f.fall.ergebnis[0], { x: x(4), y: INHALT_Y + 0.4, w: w(2), h: 1.2, fontFace: F.marke, fontSize: 48, bold: true, color: c.schrift, charSpacing: -1.8, valign: 'top' });
    MONO(s, f.fall.ergebnis[1], { x: x(4), y: INHALT_Y + 1.7, w: w(2), h: 0.6, color: c.zweit, fontSize: 9 });
  },

  // methodik: [[kicker, text] × 4]
  AN1_METHODIK(s, f, c) {
    f.methodik.forEach(([k, text], i) => {
      const feld = (i % 2) * 3.2, y = INHALT_Y + Math.floor(i / 2) * (INHALT_H / 2);
      MONO(s, k.toUpperCase(), { x: x(feld), y, w: w(2.8), h: 0.26, color: c.zweit });
      TXT(s, text, { x: x(feld), y: y + 0.35, w: w(2.8), h: INHALT_H / 2 - 0.5, color: c.schrift, fontSize: 13 });
    });
  },

  // glossar: [[begriff, erklaerung]] — alphabetisch, links und rechts im Wechsel
  AN2_GLOSSAR(s, f, c) {
    const links = f.glossar.filter((_, i) => i % 2 === 0), rechts = f.glossar.filter((_, i) => i % 2 === 1);
    const spalte = (eintraege, feld) => eintraege.forEach(([b, e], i) => {
      const y = INHALT_Y + i * 1.1;
      s.addText(b, { x: x(feld), y, w: w(2.8), h: 0.35, fontFace: F.marke, fontSize: 15, bold: true, color: c.schrift, valign: 'top' });
      TXT(s, e, { x: x(feld), y: y + 0.36, w: w(2.8), h: 0.7, color: c.zweit, fontSize: 12 });
    });
    spalte(links, 0); spalte(rechts, 3.2);
  },

  // quellen: [[nr, folie, quelle]]
  AN3_QUELLEN(s, f, c) {
    [['NR', 0, 0.4], ['FOLIE', 0.4, 0.8], ['QUELLE', 1.2, 4.8]].forEach(([k, feld, felder]) => MONO(s, k, { x: x(feld), y: INHALT_Y, w: w(felder), h: 0.26, color: c.zweit }));
    linie(s, c.pptx, x(0), INHALT_Y + 0.3, w(6), 0, c.schrift, { width: 1 });
    f.quellen.forEach(([nr, folie, quelle], i) => {
      const y = INHALT_Y + 0.42 + i * 0.5;
      MONO(s, nr, { x: x(0), y, w: w(0.4), h: 0.26, color: c.schrift, fontSize: 11 });
      MONO(s, folie, { x: x(0.4), y, w: w(0.8), h: 0.26, color: c.zweit, fontSize: 11 });
      TXT(s, quelle, { x: x(1.2), y: y - 0.03, w: w(4.8), h: 0.45, color: c.schrift, fontSize: 13 });
      linie(s, c.pptx, x(0), y + 0.42, w(6), 0, G['300']);
    });
  },

  // tabelle: { kopf: [..bis sechs], zeilen: [[..]] } — Zahlen rechtsbuendig
  AN4_DETAILTABELLE(s, f, c) {
    const { kopf, zeilen } = f.tabelle, n = kopf.length, cw = w(6) / n, rh = 0.36;
    const zahl = (v) => /^[\d\s.,%€−-]+$/.test(String(v));
    kopf.forEach((k, i) => MONO(s, k.toUpperCase(), { x: x(0) + i * cw, y: INHALT_Y, w: cw, h: 0.26, color: c.zweit, fontSize: 9, align: i && zahl(zeilen[0][i]) ? 'right' : 'left' }));
    linie(s, c.pptx, x(0), INHALT_Y + 0.3, w(6), 0, c.schrift, { width: 1 });
    zeilen.forEach((z, r) => {
      const y = INHALT_Y + 0.38 + r * rh;
      z.forEach((v, i) => s.addText(String(v), { x: x(0) + i * cw, y, w: cw - 0.1, h: rh, fontFace: F.info, fontSize: 11, color: i ? c.zweit : c.schrift, align: i && zahl(v) ? 'right' : 'left', valign: 'top' }));
      linie(s, c.pptx, x(0), y + rh - 0.02, w(6), 0, G['300']);
    });
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
  await kreiseEinsetzen(ziel);
  return { ziel, folien: fall.folien.length, datiert };
}

const nur = process.argv[2];
const zuBauen = nur ? faelle.filter((f) => f.id === nur) : faelle;
if (!zuBauen.length) { console.error(`✗ Kein Fall "${nur}". Vorhanden: ${faelle.map(f => f.id).join(', ')}`); process.exit(1); }

for (const fall of zuBauen) {
  const { ziel, folien, datiert } = await baue(fall);
  console.log(`  ✓ ${String(folien).padStart(2)} Folien, Datumsfeld in ${String(datiert).padStart(2)} XML — ${fall.branche.padEnd(34)} → ${ziel.replace(WURZEL + '/', '')}`);
}
