/**
 * @file
 * Misst berechnete Stile einzelner Selektoren auf einer Seite.
 *
 *   node scripts/messen.js /node/1 ".site-header" ".panel" ".nav-btn"
 *   node scripts/messen.js /node/1 --oeffnen ".panel"     Menue vorher aufklappen
 *
 * Fuer Rueckfragen wie „welche Farbe hat die Kopfleiste wirklich" — der
 * Referenzstand deckt nur `.nc-*`-Klassen ab, und der Kopfbereich benutzt
 * eigene Namen.
 *
 * Aufbau wie scripts/baseline.js: eigener Chrome auf einem eigenen Port, damit
 * ein laufender Browser des Benutzers unberuehrt bleibt.
 */

import { spawn } from 'node:child_process';

const BASIS = process.env.NEO_BASIS || 'https://piipe-workplace.ddev.site';
const PORT = 9355;
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const argv = process.argv.slice(2);
const pfad = argv.find((a) => a.startsWith('/')) || '/';
const oeffnen = argv.includes('--oeffnen');
const selektoren = argv.filter((a) => !a.startsWith('/') && !a.startsWith('--'));

if (!selektoren.length) {
  console.error('Aufruf: node scripts/messen.js <pfad> [--oeffnen] <selektor> …');
  process.exit(1);
}

const EIGENSCHAFTEN = [
  'backgroundColor', 'color', 'boxShadow', 'borderBottomColor', 'borderBottomWidth',
  'borderTopColor', 'borderTopWidth', 'backdropFilter', 'fontSize', 'fontWeight',
  'paddingTop', 'paddingBottom', 'position', 'zIndex',
];

const warten = (ms) => new Promise((r) => setTimeout(r, ms));

const kind = spawn(CHROME, [
  '--headless=new', `--remote-debugging-port=${PORT}`, '--no-first-run',
  '--disable-gpu', '--hide-scrollbars', '--ignore-certificate-errors',
  '--user-data-dir=/tmp/neo-messen',
], { stdio: 'ignore', detached: false });

async function bereit() {
  for (let i = 0; i < 40; i++) {
    try { if ((await fetch(`http://127.0.0.1:${PORT}/json/version`)).ok) return; }
    catch (e) { /* noch nicht */ }
    await warten(400);
  }
  throw new Error('Chrome antwortet nicht');
}

try {
  await bereit();
  const url = BASIS + pfad;
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

  await senden('Page.enable', {});
  await senden('Runtime.enable', {});
  await senden('Emulation.setDeviceMetricsOverride',
    { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
  // 5s statt 3,5: Die Hauptnavigation wird per JavaScript aufgebaut und war
  // bei 3,5s regelmaessig noch nicht im Baum — die Messung meldete dann
  // „nicht im Baum" fuer Elemente, die es sehr wohl gibt.
  await warten(5000);

  if (oeffnen) {
    // Das Mega-Menue oeffnen. Ohne das ist `.panel` nicht im Baum.
    await senden('Runtime.evaluate', { expression:
      `(document.querySelector('.nav-btn[aria-expanded], .nav-btn') || {}).click?.()` });
    await warten(900);
  }

  const r = await senden('Runtime.evaluate', {
    returnByValue: true,
    expression: `(() => {
      const S = ${JSON.stringify(selektoren)};
      const P = ${JSON.stringify(EIGENSCHAFTEN)};
      return S.map((sel) => {
        const el = document.querySelector(sel);
        if (!el) return { sel, fehlt: true };
        const c = getComputedStyle(el);
        const d = {};
        for (const p of P) { const v = c[p]; if (v && v !== 'none' && v !== 'normal') d[p] = v; }
        return { sel, d };
      });
    })()`,
  });

  const werte = r.result?.result?.value || [];
  console.log(`\n  ${pfad}  ${oeffnen ? '(Menue offen)' : ''}\n`);
  for (const e of werte) {
    if (e.fehlt) { console.log(`  ${e.sel}\n      nicht im Baum\n`); continue; }
    console.log(`  ${e.sel}`);
    for (const [k, v] of Object.entries(e.d)) console.log(`      ${k.padEnd(20)}${v}`);
    console.log('');
  }
  ws.close();
} finally {
  kind.kill('SIGKILL');
}
process.exit(0);
