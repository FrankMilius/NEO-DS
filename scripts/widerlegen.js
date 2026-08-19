/**
 * @file
 * Versucht, eine Behauptung ueber die Website zu WIDERLEGEN.
 *
 *   npm run widerlegen -- --token --fnd-color-text-primary
 *   npm run widerlegen -- --klasse .neo-mono-light
 *   npm run widerlegen -- --zustand .nav-link hover textDecorationLine
 *   npm run widerlegen -- --token --fnd-color-border-primary --pfad /node/51
 *
 * WOZU
 * Jede Behauptung in diesem Projekt hat dieselben vier Arten, falsch zu sein.
 * Alle vier sind hier tatsaechlich vorgekommen:
 *
 *   1  QUELLE STATT AUSLIEFERUNG
 *      „Der Wert steht im SCSS." — Ja. Und eine Datei, die spaeter laedt,
 *      ueberschreibt ihn. So ueberlebte die Slate-Palette vier Tage lang eine
 *      Umstellung, die ich als abgeschlossen gemeldet hatte: 39 Token in
 *      neo-overrides.css, mit einem Kommentar, der das sogar ansagte.
 *
 *   2  GELTUNGSBEREICH OHNE TRAEGER
 *      „Die Regel ist gesetzt." — Auf einer Klasse, die auf keiner Seite
 *      vorkommt. Die Element-Stile lagen einen Tag lang auf `.neo-mono-*`,
 *      waehrend die Website unter `.neo-light-theme` laeuft.
 *
 *   3  RUHEZUSTAND STATT ZUSTAND
 *      Der Referenzstand misst, was ohne Zeiger und ohne Fokus gilt. Ein
 *      schwarzer Unterstrich beim Ueberfahren blieb deshalb wochenlang
 *      unbemerkt — bis er im Bildschirmfoto auffiel.
 *
 *   4  MESSARTEFAKT STATT BEFUND
 *      19 „verschwundene" Komponenten waren eine Seite, die einmal leer
 *      zurueckkam. Fast haette ich einen guten Stapel zurueckgenommen.
 *
 * Dieses Werkzeug beantwortet keine dieser Fragen mit „ja". Es sucht nach dem
 * Gegenbeweis und meldet, wenn es keinen findet. Das ist ein Unterschied:
 * Ein Befund, den man zu widerlegen versucht hat, ist mehr wert als einer,
 * den man bestaetigt hat.
 */

import { spawn } from 'node:child_process';

const BASIS = process.env.NEO_BASIS || 'https://piipe-workplace.ddev.site';
const PORT = 9390;
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const argv = process.argv.slice(2);
const art = argv.find((a) => ['--token', '--klasse', '--zustand'].includes(a));
const werte = argv.filter((a) => !a.startsWith('--') || (art === '--token' && a.startsWith('--fnd')) || a.startsWith('--nc') || a.startsWith('--nn'));
const pfadIdx = argv.indexOf('--pfad');
const PFADE = pfadIdx >= 0 ? [argv[pfadIdx + 1]] : ['/', '/node/51'];

if (!art) {
  console.error(`Aufruf:
  npm run widerlegen -- --token <--custom-property>
  npm run widerlegen -- --klasse <.klasse>
  npm run widerlegen -- --zustand <selektor> <hover|focus-visible|active> <eigenschaft>`);
  process.exit(1);
}

const ziel = werte.filter((w) => w !== art && w !== argv[pfadIdx + 1]);

// --streng macht das Werkzeug automatiktauglich.
//
// Bis zum 19.08.2026 endete dieser Lauf IMMER mit 0 — auch dann, wenn er
// etwas widerlegt hatte. Fuer einen Menschen am Bildschirm reicht das, der
// liest den Text. Ein Dirigent kann damit nichts anfangen: Er sieht nur den
// Rueckgabecode und haelt jede Widerlegung fuer einen Erfolg.
//
// Die Vorgabe bleibt 0, damit bestehende Aufrufe unveraendert weiterlaufen.
// Nur mit --streng wird ein Fund zum Fehlschlag. Am Ende steht ausserdem eine
// maschinenlesbare Zeile, damit niemand Fliesstext zerlegen muss.
const streng = argv.includes('--streng');
const befunde = [];
const warten = (ms) => new Promise((r) => setTimeout(r, ms));

// ---------------------------------------------------------------------------

const kind = spawn(CHROME, [
  '--headless=new', `--remote-debugging-port=${PORT}`, '--no-first-run',
  '--disable-gpu', '--ignore-certificate-errors', '--user-data-dir=/tmp/neo-widerlegen',
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
  // 5s: Navigation und Mega-Menue entstehen per JavaScript.
  await warten(5000);
  return { senden, schliessen: () => ws.close() };
}

const auswerten = (r) => r.result?.result?.value;

// ---------------------------------------------------------------------------
// 1. Token: WER GEWINNT, und woher kommt er
// ---------------------------------------------------------------------------

async function tokenPruefen(name, pfad) {
  const s = await sitzung(BASIS + pfad);
  const r = await s.senden('Runtime.evaluate', {
    returnByValue: true,
    expression: `(() => {
      const name = ${JSON.stringify(name)};
      const treffer = [];
      // ALLE Stylesheets in Ladereihenfolge durchgehen. Genau hier lag der
      // Fall, den die Quellsuche nicht finden konnte: Die letzte Datei
      // gewinnt, und sie stand nicht im Design System.
      [...document.styleSheets].forEach((blatt, nr) => {
        const datei = (blatt.href || 'inline').split('/').pop().split('?')[0];
        let regeln;
        try { regeln = blatt.cssRules; } catch (e) { treffer.push({ datei, nr, gesperrt: true }); return; }
        [...regeln].forEach((regel) => {
          if (!regel.style) return;
          const wert = regel.style.getPropertyValue(name);
          if (!wert) return;
          // PHANTOM-TREFFER AUSSCHLIESSEN.
          // Enthaelt eine Regel mit  all: unset  , liefert getPropertyValue fuer
          // JEDE beliebige Custom Property genau diesen Wert zurueck — die
          // Kurzschreibweise deckt sie im CSSOM mit ab. Ergebnis: Ein Token,
          // das es nirgends gibt, meldete fuenf Deklarationen, und das Urteil
          // "KEINE Deklaration" konnte nie zustande kommen.
          // Am 19.08.2026 an .nc-modal__close aufgefallen.
          // Der exakte Test: Steht der Name ueberhaupt in der
          // Deklarationsliste der Regel? Custom Properties erscheinen dort,
          // von einer Kurzschreibweise erfasste Werte nicht.
          // (getPropertyValue('all') haette es auch tun sollen, liefert hier
          // aber nichts — deshalb dieser Weg.)
          let gesetzt = false;
          for (let i = 0; i < regel.style.length; i++) {
            if (regel.style[i] === name) { gesetzt = true; break; }
          }
          if (!gesetzt) return;
          treffer.push({ datei, nr, selektor: regel.selectorText || '?', wert: wert.trim() });
        });
      });
      const c = getComputedStyle(document.documentElement);
      return {
        wirksam: c.getPropertyValue(name).trim(),
        treffer,
        blaetter: [...document.styleSheets].map((b) => (b.href || 'inline').split('/').pop().split('?')[0]),
      };
    })()`,
  });
  s.schliessen();
  return auswerten(r);
}

// ---------------------------------------------------------------------------
// 2. Klasse: GIBT ES DEN TRAEGER
// ---------------------------------------------------------------------------

async function klassePruefen(sel, pfad) {
  const s = await sitzung(BASIS + pfad);
  const r = await s.senden('Runtime.evaluate', {
    returnByValue: true,
    expression: `(() => {
      const sel = ${JSON.stringify(sel)};
      let n = 0;
      try { n = document.querySelectorAll(sel).length; } catch (e) { return { fehler: String(e.message) }; }
      // Wenn es den Traeger nicht gibt, ist die Frage: Welche Klassen tragen
      // Wurzel und Koerper stattdessen? Daran erkennt man den Denkfehler.
      return {
        anzahl: n,
        wurzel: document.documentElement.className || '(keine)',
        koerper: document.body.className.split(/\\s+/).slice(0, 8).join(' ') || '(keine)',
      };
    })()`,
  });
  s.schliessen();
  return auswerten(r);
}

// ---------------------------------------------------------------------------
// 3. Zustand: GILT DIE REGEL AUCH BEIM UEBERFAHREN
// ---------------------------------------------------------------------------

async function zustandPruefen(sel, zustand, eigenschaft, pfad) {
  const s = await sitzung(BASIS + pfad);
  const doc = await s.senden('DOM.getDocument', { depth: -1 });
  const q = await s.senden('DOM.querySelector', { nodeId: doc.result.root.nodeId, selector: sel });
  const nodeId = q.result?.nodeId;
  if (!nodeId) { s.schliessen(); return { fehlt: true }; }

  const raus = {};
  for (const z of [[], [zustand]]) {
    await s.senden('CSS.forcePseudoState', { nodeId, forcedPseudoClasses: z });
    await warten(250);
    const r = await s.senden('Runtime.evaluate', {
      returnByValue: true,
      expression: `(() => {
        const e = document.querySelector(${JSON.stringify(sel)});
        const c = getComputedStyle(e);
        const a = getComputedStyle(e, '::after');
        return {
          eigen: c[${JSON.stringify(eigenschaft)}],
          farbe: c.textDecorationColor,
          nachher: a.content !== 'none' ? (a.height + ' ' + a.backgroundColor + ' ' + a.transform) : '(kein ::after)',
        };
      })()`,
    });
    raus[z.length ? zustand : 'ruhe'] = auswerten(r);
  }
  s.schliessen();
  return raus;
}

// ---------------------------------------------------------------------------

try {
  await bereit();
  console.log(`\nWIDERLEGUNGSVERSUCH  ${art}  ${ziel.join(' ')}`);
  console.log('─'.repeat(78));

  if (art === '--token') {
    const name = ziel[0];
    for (const pfad of PFADE) {
      const d = await tokenPruefen(name, pfad);
      console.log(`\n  ${pfad}`);
      console.log(`  wirksam:  ${d.wirksam || '(leer)'}`);
      if (!d.treffer.length) {
        console.log('  KEINE Deklaration in irgendeinem Stylesheet gefunden.');
        console.log('  → Der Wert kommt nicht aus dem CSS. Vererbung? Tippfehler im Namen?');
        befunde.push({ art: 'WIDERLEGT', ziel: name, pfad, grund: 'keine Deklaration im CSS' });
      } else {
        console.log(`  ${d.treffer.length} Deklaration(en), in Ladereihenfolge — die LETZTE gewinnt:\n`);
        d.treffer.forEach((t, i) => {
          const letzte = i === d.treffer.length - 1;
          console.log(`    ${letzte ? '→' : ' '} ${String(t.nr).padStart(2)}  ${(t.datei || '').padEnd(22)}${(t.selektor || '').slice(0, 26).padEnd(28)}${t.wert || ''}`);
        });
        const quellen = new Set(d.treffer.map((t) => t.datei));
        if (quellen.size > 1) {
          console.log(`\n  ACHTUNG: ${quellen.size} verschiedene Dateien setzen dieses Token.`);
          console.log('  Eine Aenderung an der falschen bleibt wirkungslos.');
          befunde.push({ art: 'VERDAECHTIG', ziel: name, pfad, grund: `${quellen.size} Dateien setzen es` });
        }
      }
    }
  }

  if (art === '--klasse') {
    const sel = ziel[0];
    for (const pfad of PFADE) {
      const d = await klassePruefen(sel, pfad);
      console.log(`\n  ${pfad}`);
      if (d.fehler) { console.log(`  Ungueltiger Selektor: ${d.fehler}`); continue; }
      console.log(`  ${sel}: ${d.anzahl} Vorkommen`);
      if (d.anzahl === 0) {
        console.log('  WIDERLEGT: Es gibt keinen Traeger. Jede Regel auf diesem');
        console.log('  Geltungsbereich ist wirkungslos.');
        befunde.push({ art: 'WIDERLEGT', ziel: sel, pfad, grund: 'kein Traeger im Dokument' });
        console.log(`    <html class="${d.wurzel}">`);
        console.log(`    <body class="${d.koerper}">`);
      }
    }
  }

  if (art === '--zustand') {
    const [sel, zustand, eigenschaft] = ziel;
    for (const pfad of PFADE) {
      const d = await zustandPruefen(sel, zustand || 'hover', eigenschaft || 'color', pfad);
      console.log(`\n  ${pfad}`);
      if (d.fehlt) { console.log(`  ${sel} nicht im Baum.`); continue; }
      for (const [z, v] of Object.entries(d)) {
        console.log(`    ${z.padEnd(14)}${eigenschaft}: ${v.eigen}`);
        console.log(`    ${''.padEnd(14)}Dekorationsfarbe: ${v.farbe}`);
        console.log(`    ${''.padEnd(14)}::after ${v.nachher}`);
      }
    }
  }

  console.log('\n' + '─'.repeat(78));
  if (befunde.length) {
    console.log(`  ${befunde.length} Befund(e):`);
    for (const b of befunde) console.log(`    ${b.art.padEnd(12)}${b.ziel}  ${b.pfad}  — ${b.grund}`);
  } else {
    console.log('  Kein Gegenbeweis ist kein Beweis. Er heisst nur: an DIESEN Stellen');
    console.log('  nicht gescheitert.');
  }
  // Eine Zeile, die sich ohne Fliesstext-Zerlegung auswerten laesst.
  console.log(`\nURTEIL ${befunde.some((b) => b.art === 'WIDERLEGT') ? 'WIDERLEGT'
    : befunde.length ? 'VERDAECHTIG' : 'KEIN-GEGENBEWEIS'} ${befunde.length}\n`);
} finally {
  kind.kill('SIGKILL');
}
process.exit(streng && befunde.length ? 1 : 0);
