// ==========================================================================
// Beispielpräsentationen aus der Vorlage erzeugen
// ==========================================================================
// Drei Fälle, je 24 Folien, alle aus denselben 35 Layouts. Der Zweck ist
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
import { definiereMaster, datumsfeldEinsetzen, themeEinsetzen, geometrie, G, AKZENT, PAPIER, BREITE, HOEHE, x, w } from './pptx-vorlage.mjs';

const WURZEL = resolve(import.meta.dirname, '..');
const { faelle } = JSON.parse(readFileSync(join(WURZEL, 'data/pptx-beispielfaelle.json'), 'utf8'));

const F = { marke: 'Space Grotesk', info: 'Manrope', technik: 'JetBrains Mono' };

// Beispieldecks laufen in der Versandstufe: Sie werden gelesen, nicht
// vorgetragen. Raster und Titelzone kommen aus dem Generator, nicht aus
// einer Kopie — sonst stimmen die Positionen nicht mehr, sobald die
// Titelzone einer Stufe sich aendert.
const STUFE = process.env.PPTX_STUFE || 'versand';
const { RAND, TITELZONE, INHALT_Y, INHALT_H } = geometrie(STUFE);

// Papier je Folie: Hintergrund setzen statt fünf Master zu bauen (Kapitel 11.10).
const grundfarbe = (p) => (p === 'tief' ? G['950'] : PAPIER[p]['100']);
const tief = (p) => p === 'tief';

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
      const gross = ['T1_TITEL_TIEF', 'T2_SIGNALFELD', 'T4_TITEL_KUNDE', 'X1_STATEMENT',
                     'A1_ABSCHNITT_TIEF', 'A2_ABSCHNITT_PAPIER', 'Q1_ZITAT', 'Z1_ABSCHLUSS'].includes(f.l);
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
