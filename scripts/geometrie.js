/**
 * @file
 * Misst die LAGE von Elementen, nicht ihre Stile.
 *
 *   node scripts/geometrie.js /node/1 ".nc-hero__media" ".nc-hero__content"
 *   node scripts/geometrie.js /node/1 --breite 1440 ".nc-hero__media"
 *
 * WOFUER
 * `messen.js` liest berechnete Stile. Fuer Fragen wie „reicht das Bild wirklich
 * bis zum Bildschirmrand" hilft das nicht: Die Antwort steht in keiner
 * einzelnen Eigenschaft, sondern im Verhaeltnis von Rechteck zu Viewport.
 *
 * Der Anlass war die Split-Variante des Heroes. Ihr Ueberstand wird aus zwei
 * Groessen gerechnet (eigenes Container-Padding plus die halbe ungenutzte
 * Containerbreite). Ob die Rechnung stimmt, sieht man erst am Ergebnis —
 * und ein Fehler faellt sonst nur jemandem auf, der genau hinsieht.
 *
 * Ausgegeben werden Abstaende zum Viewport-Rand. 0 heisst buendig.
 */

import { execFileSync, spawn } from 'node:child_process';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const argv = process.argv.slice(2);
const pfad = argv.find((a) => a.startsWith('/')) || '/node/1';
const breiteArg = argv.indexOf('--breite');
const BREITE = breiteArg >= 0 ? +argv[breiteArg + 1] : 1440;
const selektoren = argv.filter((a, i) => !a.startsWith('-') && !a.startsWith('/') && argv[i - 1] !== '--breite');

if (!selektoren.length) {
  console.log('\n  Aufruf: node scripts/geometrie.js <pfad> [--breite 1440] <selektor> …\n');
  process.exit(1);
}

const BASIS = 'https://piipe-workplace.ddev.site';
const PORT = 9223;
const profil = mkdtempSync(join(tmpdir(), 'geo-'));

const chrome = spawn(
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  [`--remote-debugging-port=${PORT}`, `--user-data-dir=${profil}`, '--headless=new',
    '--ignore-certificate-errors', '--no-first-run', '--no-default-browser-check',
    `--window-size=${BREITE},900`],
  { stdio: 'ignore', detached: true },
);

const warten = (ms) => new Promise((r) => setTimeout(r, ms));

async function ziel() {
  for (let i = 0; i < 40; i++) {
    try {
      const t = JSON.parse(execFileSync('curl', ['-s', `http://127.0.0.1:${PORT}/json/list`], { encoding: 'utf8' }));
      const seite = t.find((x) => x.type === 'page');
      if (seite) return seite.webSocketDebuggerUrl;
    } catch { /* noch nicht da */ }
    await warten(250);
  }
  throw new Error('Chrome antwortet nicht.');
}

const url = await ziel();
const ws = new WebSocket(url);
let id = 0;
const offen = new Map();

ws.addEventListener('message', (e) => {
  const m = JSON.parse(e.data);
  if (m.id && offen.has(m.id)) { offen.get(m.id)(m); offen.delete(m.id); }
});
await new Promise((r) => ws.addEventListener('open', r));

const senden = (methode, params = {}) => new Promise((r) => {
  const n = ++id;
  offen.set(n, r);
  ws.send(JSON.stringify({ id: n, method: methode, params }));
});

await senden('Page.enable');
await senden('Emulation.setDeviceMetricsOverride', { width: BREITE, height: 900, deviceScaleFactor: 1, mobile: false });
await senden('Page.navigate', { url: BASIS + pfad });
await warten(4000);

const r = await senden('Runtime.evaluate', {
  returnByValue: true,
  expression: `(() => {
    const S = ${JSON.stringify(selektoren)};
    const vw = document.documentElement.clientWidth;
    return { vw, treffer: S.map((sel) => {
      const el = document.querySelector(sel);
      if (!el) return { sel, fehlt: true };
      const b = el.getBoundingClientRect();
      return {
        sel,
        links: Math.round(b.left),
        rechts: Math.round(vw - b.right),
        breite: Math.round(b.width),
        hoehe: Math.round(b.height),
        radius: getComputedStyle(el).borderRadius,
      };
    })};
  })()`,
});

const { vw, treffer } = r.result?.result?.value || { vw: 0, treffer: [] };

console.log(`\n  ${pfad}   Viewport ${vw}px\n`);
console.log(`  ${'Selektor'.padEnd(42)}${'links'.padStart(7)}${'rechts'.padStart(8)}${'breite'.padStart(8)}${'hoehe'.padStart(7)}  Radius`);
console.log('  ' + '─'.repeat(84));
for (const t of treffer) {
  if (t.fehlt) { console.log(`  ${t.sel.padEnd(42)}   nicht im Baum`); continue; }
  const buendig = (n) => (n === 0 ? '  0 ✓' : String(n).padStart(5));
  console.log(`  ${t.sel.padEnd(42)}${buendig(t.links).padStart(7)}${buendig(t.rechts).padStart(8)}${String(t.breite).padStart(8)}${String(t.hoehe).padStart(7)}  ${t.radius}`);
}
console.log('\n  0 bedeutet buendig mit dem Viewport-Rand.\n');

ws.close();
try { process.kill(-chrome.pid); } catch { /* schon weg */ }
process.exit(0);
