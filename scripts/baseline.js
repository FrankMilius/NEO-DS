/**
 * @file
 * Nimmt einen Referenzstand der LIVE-Website auf: fuer jede NEO-Komponente die
 * berechneten Stile, in beiden Themes und drei Viewport-Breiten.
 *
 * Zweck ist die Migration der Overrides ins Design System. Beim Verschieben
 * einer Regel aus neo-overrides.css (laedt zuletzt, gewinnt bei gleicher
 * Spezifitaet) ins DS verliert sie diesen Vorteil und kann gegen andere
 * DS-Regeln unterliegen. Das ist waehrend der Entwicklung mehrfach passiert und
 * faellt beim blossen Hinsehen nicht auf. Dieser Referenzstand macht es messbar.
 *
 *   npm run baseline:capture -- [name]     nimmt auf   (Vorgabe: "vorher")
 *   npm run baseline:diff -- vorher nachher   vergleicht
 *
 * Voraussetzung: DDEV laeuft, Chrome ist installiert.
 */

import { writeFileSync, readFileSync, mkdirSync, existsSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn, execFileSync } from 'node:child_process';

const wurzel = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const ablage = resolve(wurzel, 'data/baseline');
const BASIS = process.env.NEO_BASIS || 'https://piipe-workplace.ddev.site';
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const PORT = 9333;

const BREITEN = [390, 1024, 1440];
const THEMES = ['neo-light-theme', 'neo-dark-theme'];

/** Was gemessen wird. Bewusst begrenzt: jede Eigenschaft mehr vervielfacht sich
 *  mit Komponenten x Themes x Breiten. Diese 22 decken ab, was bei einer
 *  Regelverschiebung erfahrungsgemaess kippt. */
const EIGENSCHAFTEN = [
  'color', 'backgroundColor', 'borderTopWidth', 'borderTopStyle', 'borderTopColor',
  'borderRadius', 'boxShadow', 'opacity',
  'fontFamily', 'fontSize', 'fontWeight', 'lineHeight', 'letterSpacing', 'textTransform',
  'paddingTop', 'paddingLeft', 'marginTop', 'gap',
  'display', 'gridTemplateColumns', 'aspectRatio', 'transform',
];

// ---------------------------------------------------------------------------

function chromeStarten() {
  const profil = resolve(ablage, '.chrome');
  mkdirSync(profil, { recursive: true });
  const p = spawn(CHROME, [
    '--headless=new', `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${profil}`, '--no-first-run', '--disable-gpu',
  ], { stdio: 'ignore', detached: true });
  p.unref();
  return p;
}

async function warten(ms) { return new Promise((r) => setTimeout(r, ms)); }

async function verbinden() {
  for (let i = 0; i < 30; i++) {
    try {
      const r = await fetch(`http://127.0.0.1:${PORT}/json/version`);
      if (r.ok) return true;
    } catch (e) { /* noch nicht da */ }
    await warten(500);
  }
  throw new Error('Chrome antwortet nicht auf Port ' + PORT);
}

/** Eine CDP-Sitzung auf einem neuen Tab. */
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
  return { senden, schliessen: () => ws.close(), ziel: t };
}

// ---------------------------------------------------------------------------

const AUSDRUCK = (props) => `(() => {
  const P = ${JSON.stringify(props)};
  const raus = {};
  // Je Komponentenklasse die ERSTE Instanz. Alle zu messen blaeht den Stand auf,
  // ohne mehr zu zeigen: Abweichungen treten pro Regel auf, nicht pro Instanz.
  const gesehen = new Set();
  for (const el of document.querySelectorAll('[class*="nc-"]')) {
    for (const k of el.classList) {
      if (!k.startsWith('nc-') || gesehen.has(k)) continue;
      gesehen.add(k);
      const c = getComputedStyle(el);
      const d = {};
      for (const p of P) { const v = c[p]; if (v && v !== 'none' && v !== 'normal' && v !== 'auto') d[p] = v; }
      raus[k] = d;
    }
  }
  return raus;
})()`;

async function seiteMessen(url, props) {
  const s = await sitzung(url);
  const ergebnis = {};
  try {
    await s.senden('Page.enable'); await s.senden('Runtime.enable');
    await s.senden('Page.navigate', { url });
    await warten(3000);
    // Lazy-Inhalte laden erst beim Sichtbarwerden.
    await s.senden('Runtime.evaluate', { expression: 'window.scrollTo(0, document.body.scrollHeight); window.scrollTo(0,0);' });
    await warten(800);

    // Bewegung stilllegen. OHNE das misst man Zwischenstaende laufender
    // Animationen: zwei Laeufe derselben Seite lieferten 23 Scheinabweichungen
    // in 5 Komponenten (Farben um 1-3 Einheiten verschoben, wandernde
    // Schatten). Solches Rauschen wuerde echte Regressionen zudecken.
    //
    // Bewusst per Stylesheet und NICHT ueber prefers-reduced-motion: die
    // Medienabfrage aendert per Entwurf auch Stile, wir wollen aber den
    // normalen Zustand messen — nur eben ohne laufende Uhr.
    await s.senden('Runtime.evaluate', { expression: `(() => {
      const st = document.createElement('style');
      st.textContent = '*,*::before,*::after{animation:none !important;transition:none !important;caret-color:transparent !important}';
      document.head.appendChild(st);
    })()` });
    await warten(400);

    for (const breite of BREITEN) {
      await s.senden('Emulation.setDeviceMetricsOverride', { width: breite, height: 1000, deviceScaleFactor: 1, mobile: breite < 700 });
      for (const theme of THEMES) {
        await s.senden('Runtime.evaluate', {
          expression: `document.documentElement.className='${theme}';document.body.className='${theme}';document.documentElement.setAttribute('data-theme','${theme}');`,
        });
        await warten(350);
        const r = await s.senden('Runtime.evaluate', { expression: AUSDRUCK(props), returnByValue: true });
        ergebnis[`${breite}|${theme}`] = r.result?.result?.value ?? {};
      }
    }
  } finally {
    s.schliessen();
    await fetch(`http://127.0.0.1:${PORT}/json/close/${s.ziel.id}`).catch(() => {});
  }
  return ergebnis;
}

// ---------------------------------------------------------------------------

const name = process.argv[2] || 'vorher';
mkdirSync(ablage, { recursive: true });

const seitenDatei = resolve(ablage, 'seiten.json');
let seiten;
if (existsSync(seitenDatei)) {
  seiten = JSON.parse(readFileSync(seitenDatei, 'utf8'));
} else {
  console.error(`Seitenliste fehlt: ${seitenDatei}\nMit scripts/baseline-seiten.sh erzeugen.`);
  process.exit(1);
}

console.log(`Referenzstand "${name}": ${seiten.length} Seiten x ${BREITEN.length} Breiten x ${THEMES.length} Themes`);
chromeStarten();
await verbinden();

const stand = { name, erzeugt: new Date().toISOString(), basis: BASIS, breiten: BREITEN, themes: THEMES, seiten: {} };
let n = 0;
for (const pfad of seiten) {
  n++;
  process.stdout.write(`\r  ${n}/${seiten.length}  ${pfad}`.padEnd(70));
  // Bis zu drei Versuche. Eine Seite, die einmal langsam ist, liefert sonst
  // ein leeres Ergebnis — und im Vergleich sieht das aus, als waeren all ihre
  // Komponenten verschwunden. Genau so entstanden 19 Phantom-Befunde.
  let ergebnis = null;
  for (let versuch = 1; versuch <= 3; versuch++) {
    try {
      ergebnis = await seiteMessen(BASIS + pfad, EIGENSCHAFTEN);
      const leer = !Object.values(ergebnis).some((v) => v && Object.keys(v).length);
      if (!leer) break;
      if (versuch < 3) { process.stdout.write(`\r  ${pfad}: leer, Versuch ${versuch + 1}`.padEnd(70)); await warten(1500); }
    } catch (e) { ergebnis = { fehler: String(e.message || e) }; }
  }
  stand.seiten[pfad] = ergebnis;
}
console.log('');

// Zusammenfassung ueber alle Seiten: je Komponente der Stand, erster Fund gewinnt.
const komponenten = {};
for (const p of Object.values(stand.seiten)) {
  for (const [kontext, klassen] of Object.entries(p)) {
    if (kontext === 'fehler') continue;
    for (const [k, d] of Object.entries(klassen)) {
      komponenten[k] ??= {};
      komponenten[k][kontext] ??= d;
    }
  }
}
stand.komponenten = komponenten;

// Komprimiert ablegen: der Rohstand ist 17 MB und damit zu gross fuers Repo,
// gzip drueckt ihn auf gut ein Zwanzigstel. Der Vorher-Stand MUSS aufbewahrt
// werden — er laesst sich nach Beginn der Migration nicht mehr herstellen.
const datei = resolve(ablage, `${name}.json.gz`);
writeFileSync(datei, gzipSync(JSON.stringify(stand), { level: 9 }));
try { execFileSync('pkill', ['-f', `remote-debugging-port=${PORT}`]); } catch (e) { /* egal */ }

const anzahl = Object.keys(komponenten).length;
const werte = Object.values(komponenten).reduce((s, k) => s + Object.values(k).reduce((t, d) => t + Object.keys(d).length, 0), 0);
console.log(`\n  ${anzahl} Komponenten, ${werte} gemessene Werte`);
console.log(`  → ${datei.replace(wurzel + '/', '')}`);
