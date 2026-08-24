/**
 * Ersetzt veraltete Klassennamen in den Doku-Seiten.
 *
 *   node scripts/korrigiere-doku-klassen.mjs --trocken
 *   node scripts/korrigiere-doku-klassen.mjs
 *
 * WARUM ES DAS BRAUCHT
 * `npm run lint:klassen` hat am 24.08.2026 in 25 der 115 Doku-Seiten Klassen
 * gefunden, die in styles.css nicht vorkommen. Eine Klasse, die es im
 * Stylesheet nicht gibt, gestaltet nichts — das Beispiel sieht nur so aus, als
 * zeige es das Bauteil. Genau so sind die veralteten Seiten entstanden.
 *
 * WARUM NUR DIESE ZUORDNUNGEN
 * Hier steht ausschliesslich, was eindeutig ist: eine Umbenennung, bei der die
 * neue Klasse nachweislich im Stylesheet steht, oder ein Modifikator, den es
 * nie gab. Alles Uneindeutige — ein dokumentierter Unterbereich, den das
 * Bauteil gar nicht hat — bleibt liegen und wird berichtet. Das ist eine
 * inhaltliche Frage und keine Ersetzung.
 *
 * DAS SKRIPT SCHREIBT NICHTS UNGEPRUEFT
 * Vor jeder Ersetzung wird nachgesehen, ob das Ziel in styles.css existiert.
 * Fehlt es, bricht der Lauf ab — sonst tauscht man einen falschen Namen gegen
 * den naechsten.
 */

import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { klassenLesen } from './klassen-im-stylesheet.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DOKU = resolve(ROOT, 'docs');

// alt -> neu. Leerer Wert heisst: Klasse entfernen.
const ZUORDNUNG = {
  // Das Bauteil heisst .nc-button. `nc-btn` steht auf fuenf Doku-Seiten und
  // gestaltet dort nichts.
  'nc-btn': 'nc-button',
  'nc-btn--primary': 'nc-button--primary',
  'nc-btn--secondary': 'nc-button--secondary',

  // Umbenennung vom 19.08.2026: slider -> range. Die Doku-Seite kannte den
  // alten Namen noch. (Der SEITENNAME ist weiterhin slider-docs.html — die
  // Umbenennung ist in Spec, Registry und Manifest unvollstaendig geblieben
  // und gehoert als eigene Aufgabe zu Ende gebracht, nicht hier nebenbei.)
  'nc-slider': 'nc-range',
  'nc-slider__input': 'nc-range__input',
  'nc-slider__labels': 'nc-range__labels',
  'nc-slider__label-min': 'nc-range__label-min',
  'nc-slider__label-max': 'nc-range__label-max',
  'nc-slider__output': 'nc-range__output',
  'nc-slider--disabled': 'nc-range--disabled',
  'nc-slider--error': 'nc-range--error',

  // Umbenennung vom 18.08.2026, Commit 8422d30 "Dashboard-Attrappe heisst
  // mockup, nicht card". Die Zuordnung ist nicht geraten, sie steht im Diff
  // jener Aenderung — die Doku-Seite kannte nur die alten Namen weiter.
  'nc-hero__card': 'nc-hero__mockup',
  'nc-hero__metric': 'nc-hero__mockup-tile',
  'nc-hero__metric-value': 'nc-hero__mockup-value',
  'nc-hero__metric-label': 'nc-hero__mockup-label',
  'nc-hero__pulse': 'nc-hero__mockup-pulse',

  // Der Sprunglink gehoert zum Seitengeruest und heisst darum
  // .nc-shell__skip-link — die Website setzt ihn genau so ein. Die
  // Vorlagenseiten trugen den blanken Namen.
  'nc-skip-link': 'nc-shell__skip-link',

  // MD ist die Vorgabegroesse und braucht keinen Modifikator. Wer die Zeile
  // liest, denkt, hier werde eine Groesse gesetzt.
  'nc-button--md': '',

  // Bereiche, die das Bauteil nicht hat: kein Stylesheet gestaltet sie, kein
  // Skript sucht sie. Sie stehen im Beispiel und versprechen dem Entwickler
  // eine Struktur, die es nicht gibt. Das Element bleibt, nur die leere Zusage
  // fällt weg — an der Darstellung aendert das nichts.
  'nc-banner__text': '',
  'nc-popover__title': '',
  'nc-search__item-desc': '',
  'nc-search__item-title': '',
  'nc-sidebar__brand': '',
  'nc-sidebar__item--has-submenu': '',
};

// ─── Ziele gegenpruefen ──────────────────────────────────────────────
const bekannt = klassenLesen();

const fehlend = Object.values(ZUORDNUNG).filter((z) => z && !bekannt.has(z));
if (fehlend.length) {
  console.error(`\n  Abbruch: Zielklassen fehlen in styles.css: ${fehlend.join(', ')}\n`);
  process.exit(1);
}

// Vor dem ENTFERNEN nachsehen, ob die Klasse wirklich niemandem dient.
//
// Sieben der Fundstellen waren keine toten Klassen, sondern Zugriffspunkte fuer
// JavaScript — `nc-rating__star` wird von rating-docs.js gesucht. Wer die
// entfernt, zerlegt die Demo, und zwar lautlos: die Seite sieht gleich aus und
// tut nichts mehr. Darum prueft das Skript das selbst, statt sich auf eine
// Durchsicht von Hand zu verlassen.
const zuEntfernen = Object.entries(ZUORDNUNG).filter(([, z]) => z === '').map(([a]) => a);
if (zuEntfernen.length) {
  const stellen = [
    ...glob(resolve(ROOT, 'docs'), /\.js$/),
    ...glob(resolve(ROOT, 'js'), /\.js$/),
  ].map((f) => readFileSync(f, 'utf8'));

  const benutzt = zuEntfernen.filter((k) => stellen.some((c) => c.includes(k)));
  if (benutzt.length) {
    console.error('\n  Abbruch: diese Klassen sollen entfernt werden, werden aber von');
    console.error(`  JavaScript gesucht: ${benutzt.join(', ')}`);
    console.error('  Sie sind Zugriffspunkte, keine Gestaltung. Entweder als `js-…`');
    console.error('  benennen oder stehen lassen — aber nicht stillschweigend loeschen.\n');
    process.exit(1);
  }
}

function glob(verzeichnis, muster) {
  const raus = [];
  for (const e of readdirSync(verzeichnis, { withFileTypes: true })) {
    const pfad = resolve(verzeichnis, e.name);
    if (e.isDirectory()) raus.push(...glob(pfad, muster));
    else if (muster.test(e.name)) raus.push(pfad);
  }
  return raus;
}

// ─── Ersetzen ────────────────────────────────────────────────────────
const trocken = process.argv.includes('--trocken');
// Laengste zuerst, sonst frisst `nc-btn` den Anfang von `nc-btn--primary`.
const reihenfolge = Object.keys(ZUORDNUNG).sort((a, b) => b.length - a.length);

const bericht = [];
for (const datei of readdirSync(DOKU).filter((f) => f.endsWith('.html')).sort()) {
  const pfad = resolve(DOKU, datei);
  const vorher = readFileSync(pfad, 'utf8');

  const zaehler = {};
  // Nur innerhalb von class="…" ersetzen. Im Fliesstext der Doku kann derselbe
  // Name als Beispiel stehen — dort waere eine Ersetzung eine Faelschung der
  // Aussage, nicht eine Korrektur.
  const nachher = vorher.replace(/class="([^"]*)"/g, (ganz, wert) => {
    const neu = wert.split(/\s+/).filter(Boolean).map((k) => {
      for (const alt of reihenfolge) {
        if (k !== alt) continue;
        zaehler[alt] = (zaehler[alt] ?? 0) + 1;
        return ZUORDNUNG[alt];
      }
      return k;
    }).filter(Boolean);
    return `class="${neu.join(' ')}"`;
  });

  const summe = Object.values(zaehler).reduce((a, b) => a + b, 0);
  if (!summe) continue;

  bericht.push({ datei, summe, zaehler });
  if (!trocken) writeFileSync(pfad, nachher);
}

console.log('\n  VERALTETE KLASSEN IN DEN DOKU-SEITEN');
console.log('  ' + '─'.repeat(70));
for (const b of bericht) {
  const teile = Object.entries(b.zaehler)
    .map(([a, n]) => `${a}→${ZUORDNUNG[a] || '(entfernt)'} ×${n}`)
    .join(', ');
  console.log(`  ${b.datei.padEnd(30)} ${String(b.summe).padStart(3)}  ${teile}`);
}
console.log('  ' + '─'.repeat(70));
const summe = bericht.reduce((s, b) => s + b.summe, 0);
console.log(`  ${summe} Ersetzungen in ${bericht.length} Dateien${trocken ? '  (trocken)' : ''}\n`);
