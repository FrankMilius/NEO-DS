/**
 * @file
 * Prueft Kontrast und Sichtbarkeit in den ZUSTAENDEN — Ueberfahren, Fokus,
 * Geoeffnet — auf denen der Referenzstand blind ist.
 *
 *   npm run zustand
 *   npm run zustand -- /node/51 /node/69
 *   npm run zustand -- --alle          auch die bestandenen zeigen
 *
 * WARUM NICHT IM REFERENZSTAND
 * Der misst 322 Bauteile auf 71 Seiten. Dieselbe Messung noch einmal je
 * Zustand waere das Vierfache an Laufzeit fuer einen Bruchteil an Erkenntnis:
 * Ein Ueberschriftenblock hat keinen Ueberfahren-Zustand. Geprueft wird
 * deshalb nur, was BEDIENBAR ist — dort sitzen die Zustaende, und dort sassen
 * auch alle Fehler, die der Referenzstand uebersehen hat:
 *
 *   - ein schwarzer Unterstrich beim Ueberfahren in der Hauptnavigation,
 *     wochenlang unbemerkt, weil er im Ruhezustand nicht existiert
 *   - eine Kante, die nur bei Fokus erscheint und deren Farbe nie geprueft war
 *
 * WAS GEPRUEFT WIRD
 *   Schriftfarbe gegen Flaeche          je Zustand, 4,5:1 bzw. 3:1
 *   text-decoration-color               Unterstrichfarbe, nur berichtet
 *   ::after / ::before als Kante        Hoehe, Farbe, transform
 *   Fokusanzeige                        muss sich vom Ruhezustand UNTERSCHEIDEN
 *
 * GRENZE
 * `aria-expanded` laesst sich nicht ueber CSS erzwingen — der geoeffnete
 * Zustand wird durch einen echten Klick hergestellt und nur dort geprueft, wo
 * ein Element ihn traegt.
 */

import { spawn } from 'node:child_process';

const BASIS = process.env.NEO_BASIS || 'https://piipe-workplace.ddev.site';
const PORT = 9394;
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const argv = process.argv.slice(2);
const alle = argv.includes('--alle');
const PFADE = argv.filter((a) => a.startsWith('/'));
if (!PFADE.length) PFADE.push('/', '/node/51', '/node/69');

/** Was gilt als bedienbar. Bewusst eng: Jeder Eintrag kostet Laufzeit, und
 *  ein Element ohne Zustand liefert nur Rauschen. */
const BEDIENBAR = [
  'a[href]', 'button', 'input', 'select', 'textarea', 'summary',
  '[role="button"]', '[role="tab"]', '[role="menuitem"]', '[tabindex]:not([tabindex="-1"])',
];

const ZUSTAENDE = ['hover', 'focus-visible', 'active'];

const warten = (ms) => new Promise((r) => setTimeout(r, ms));

function kanaele(c) {
  if (!c) return null;
  const m = /rgba?\(([^)]+)\)/.exec(c);
  if (!m) return null;
  const t = m[1].split(/[,\s/]+/).filter(Boolean).map(Number);
  if (t.length < 3 || t.some(Number.isNaN)) return null;
  return { r: t[0], g: t[1], b: t[2], a: t.length > 3 ? t[3] : 1 };
}
function leucht({ r, g, b }) {
  const f = (x) => { x /= 255; return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4; };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}
function kontrast(a, b) {
  const [x, y] = [leucht(a), leucht(b)].sort((p, q) => q - p);
  return Math.round(((x + 0.05) / (y + 0.05)) * 100) / 100;
}
function grenze(px, gew) {
  const g = parseInt(gew, 10) || 400;
  const p = parseFloat(px) || 16;
  return (p >= 24 || (p >= 18.66 && g >= 700)) ? 3.0 : 4.5;
}

// ---------------------------------------------------------------------------

const kind = spawn(CHROME, [
  '--headless=new', `--remote-debugging-port=${PORT}`, '--no-first-run',
  '--disable-gpu', '--ignore-certificate-errors', '--user-data-dir=/tmp/neo-zustand',
], { stdio: 'ignore' });

async function bereit() {
  for (let i = 0; i < 50; i++) {
    try { if ((await fetch(`http://127.0.0.1:${PORT}/json/version`)).ok) return; }
    catch (e) { /* noch nicht */ }
    await warten(500);
  }
  throw new Error('Chrome antwortet nicht');
}

async function sitzung(url) {
  const t = await (await fetch(`http://127.0.0.1:${PORT}/json/new?${encodeURIComponent(url)}`, { method: 'PUT' })).json();
  const ws = new WebSocket(t.webSocketDebuggerUrl);
  let id = 0; const offen = new Map();
  ws.onmessage = (e) => {
    const m = JSON.parse(e.data);
    if (m.id && offen.has(m.id)) { offen.get(m.id)(m); offen.delete(m.id); }
  };
  await new Promise((r) => (ws.onopen = r));
  const senden = (method, params) => new Promise((res) => {
    const n = ++id; offen.set(n, res);
    ws.send(JSON.stringify({ id: n, method, params }));
  });
  await senden('DOM.enable', {});
  await senden('CSS.enable', {});
  await senden('Runtime.enable', {});
  await senden('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
  await warten(5000);
  return { senden, schliessen: () => ws.close() };
}

/** Ein Element in einem Zustand ablesen. Die Werte kommen aus DEM Browser,
 *  nicht aus einer Regel — nur so faellt auf, wenn eine spaetere Regel
 *  gewinnt, an die niemand gedacht hat. */
const ABLESEN = (sel) => `(() => {
  const e = document.querySelectorAll(${JSON.stringify(sel)})[0];
  if (!e) return null;
  // UNSICHTBARES NICHT MESSEN. Ein eingeklapptes Suchfeld (0x0) hat keinen
  // Fokusring — und zwar zu Recht. Ohne diese Sperre meldet die Pruefung
  // „keine Fokusanzeige" fuer Elemente, die gar nicht da sind. Genau das ist
  // beim ersten Lauf passiert.
  const b = e.getBoundingClientRect();
  if (b.width < 1 || b.height < 1) return { unsichtbar: true };
  const c = getComputedStyle(e);
  if (c.visibility === 'hidden' || c.display === 'none' || parseFloat(c.opacity) === 0) {
    return { unsichtbar: true };
  }
  const nach = getComputedStyle(e, '::after');
  // Flaeche suchen: das naechste Elternteil mit deckender Fuellung.
  let p = e, bg = null;
  while (p && !bg) {
    const b = getComputedStyle(p).backgroundColor;
    if (b && !/rgba\\(0, 0, 0, 0\\)/.test(b)) bg = b;
    p = p.parentElement;
  }
  return {
    farbe: c.color, grund: bg || 'rgb(255, 255, 255)',
    px: c.fontSize, gewicht: c.fontWeight,
    strich: c.textDecorationLine, strichFarbe: c.textDecorationColor,
    umriss: c.outlineWidth + ' ' + c.outlineStyle + ' ' + c.outlineColor,
    schatten: c.boxShadow === 'none' ? '' : c.boxShadow,
    kante: nach.content !== 'none'
      ? [nach.height, nach.backgroundColor, nach.transform].join(' ') : '',
  };
})()`;

// ---------------------------------------------------------------------------

const befunde = [];
const bestanden = [];
let unsichtbar = 0;

try {
  await bereit();
  for (const pfad of PFADE) {
    const s = await sitzung(BASIS + pfad);

    // Kandidaten einsammeln: je Selektorform die ersten Vertreter mit
    // UNTERSCHIEDLICHER Klasse — sonst misst man zwanzigmal denselben Knopf.
    const r = await s.senden('Runtime.evaluate', {
      returnByValue: true,
      expression: `(() => {
        const raus = [];
        const gesehen = new Set();
        for (const form of ${JSON.stringify(BEDIENABLE_PLATZHALTER())}) {
          for (const e of document.querySelectorAll(form)) {
            const k = [...e.classList].filter((x) => !/^is-|^js-/.test(x)).slice(0, 2).join('.');
            const schl = form + '|' + k;
            if (gesehen.has(schl)) continue;
            gesehen.add(schl);
            raus.push(k ? form + '.' + k : form);
            if (raus.length > 40) return raus;
          }
        }
        return raus;
      })()`,
    });
    const kandidaten = r.result?.result?.value || [];

    const doc = await s.senden('DOM.getDocument', { depth: -1 });
    for (const sel of kandidaten) {
      let nodeId;
      try {
        const q = await s.senden('DOM.querySelector', { nodeId: doc.result.root.nodeId, selector: sel });
        nodeId = q.result?.nodeId;
      } catch (e) { continue; }
      if (!nodeId) continue;

      const messwerte = {};
      for (const z of [[], ...ZUSTAENDE.map((x) => [x])]) {
        await s.senden('CSS.forcePseudoState', { nodeId, forcedPseudoClasses: z });
        const m = await s.senden('Runtime.evaluate', { returnByValue: true, expression: ABLESEN(sel) });
        messwerte[z.length ? z[0] : 'ruhe'] = m.result?.result?.value;
      }
      await s.senden('CSS.forcePseudoState', { nodeId, forcedPseudoClasses: [] });

      const ruhe = messwerte.ruhe;
      if (!ruhe || ruhe.unsichtbar) { unsichtbar++; continue; }

      for (const [zustand, w] of Object.entries(messwerte)) {
        if (!w || w.unsichtbar) continue;
        const vg = kanaele(w.farbe), hg = kanaele(w.grund);
        if (!vg || !hg || hg.a < 0.95) continue;
        const k = kontrast(vg, hg);
        const soll = grenze(w.px, w.gewicht);
        const eintrag = { pfad, sel, zustand, k, soll, farbe: w.farbe, grund: w.grund, strichFarbe: w.strichFarbe, kante: w.kante };
        if (k < soll) befunde.push(eintrag); else bestanden.push(eintrag);
      }

      // Der Fokus muss sich vom Ruhezustand UNTERSCHEIDEN. Ein Ring, den es
      // nur auf dem Papier gibt, ist keiner.
      const f = messwerte['focus-visible'];
      if (f && ruhe) {
        const gleich = f.umriss === ruhe.umriss && f.schatten === ruhe.schatten
                    && f.kante === ruhe.kante && f.farbe === ruhe.farbe;
        if (gleich) befunde.push({ pfad, sel, zustand: 'focus-visible', kein: true });
      }
    }
    s.schliessen();
  }
} finally {
  kind.kill('SIGKILL');
}

// ---------------------------------------------------------------------------

console.log(`\nZUSTANDSPRUEFUNG  ${PFADE.join('  ')}`);
console.log('─'.repeat(80));
console.log(`  ${bestanden.length + befunde.length} Messungen ueber ${PFADE.length} Seite(n), Zustaende: ruhe, ${ZUSTAENDE.join(', ')}`);
if (unsichtbar) console.log(`  ${unsichtbar} Element(e) uebersprungen: nicht sichtbar (eingeklappt, verborgen oder 0x0).`);

const kontrastfehler = befunde.filter((b) => !b.kein);
const ohneFokus = befunde.filter((b) => b.kein);

if (kontrastfehler.length) {
  console.log(`\n  ${kontrastfehler.length} Kontrastverstoss/-verstoesse in Zustaenden:\n`);
  console.log(`  ${'Element'.padEnd(38)}${'Zustand'.padEnd(15)}${'Schrift'.padEnd(20)}${'ist'.padStart(6)}${'soll'.padStart(6)}`);
  for (const b of kontrastfehler) {
    console.log(`  ${b.sel.slice(0, 36).padEnd(38)}${b.zustand.padEnd(15)}${b.farbe.padEnd(20)}${String(b.k).padStart(6)}${String(b.soll).padStart(6)}`);
  }
}

if (ohneFokus.length) {
  console.log(`\n  ${ohneFokus.length} Element(e) ohne erkennbare Fokusanzeige:\n`);
  for (const b of ohneFokus) console.log(`    ${b.sel}   (${b.pfad})`);
  console.log('\n  Fokus und Ruhe sehen identisch aus — WCAG 2.4.7 verlangt einen Unterschied.');
}

if (alle) {
  console.log(`\n  Alle Messungen:\n`);
  for (const b of [...bestanden].sort((a, c) => a.k - c.k).slice(0, 40)) {
    console.log(`    ${b.sel.slice(0, 34).padEnd(36)}${b.zustand.padEnd(15)}${String(b.k).padStart(6)}   Strich ${b.strichFarbe}${b.kante ? '   Kante ' + b.kante : ''}`);
  }
}

console.log('\n' + '─'.repeat(80));
if (!befunde.length) console.log('  KEIN VERSTOSS in den geprueften Zustaenden.');
else console.log('  Zustaende sind im Referenzstand nicht enthalten — hier gefundene');
console.log('');
process.exit(befunde.length ? 1 : 0);

function BEDIENABLE_PLATZHALTER() { return BEDIENBAR; }
