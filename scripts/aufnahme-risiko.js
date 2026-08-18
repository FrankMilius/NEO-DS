/**
 * @file
 * Prueft eine Komponente VOR der Aufnahme auf die drei Ursachen, die beim
 * letzten Stapellauf zu Regressionen gefuehrt haben.
 *
 *   npm run risiko -- --alle
 *   npm run risiko -- nc-accordion-block
 *
 * 1  EBENEN-DOPPELUNG
 *    Das DS fuehrt die Komponente bereits auf einer ANDEREN Ebene. Legt man
 *    sie tiefer an (Atom statt Molekuel), laedt die alte Datei spaeter und
 *    gewinnt — die Aufnahme bleibt wirkungslos. So geschehen bei form-label,
 *    form-error, form-field und gallery.
 *
 * 2  GETEILTER KLASSENNAME
 *    Dieselbe Klasse wird von einer anderen DS-Komponente gestaltet. Beim
 *    Blocktyp .nc-feature-list und der Merkmalsliste in _pricing.scss war das
 *    der Fall — beide teilten sich sogar die Grundregel.
 *
 * 3  ABHAENGIGKEIT VON DER LADEREIHENFOLGE
 *    Die Regel gewinnt heute nur, weil neo-overrides.css ZULETZT laedt. Nach
 *    dem Umzug ins DS unterliegt sie einer Regel aus einer spaeteren Ebene.
 *    So verlor .nc-section seine Flaechenpolsterung an `padding: 0` aus
 *    _pricing.scss.
 */

import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const wurzel = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OV = resolve(wurzel, '../DRUPAL11/web/themes/custom/neo_fe/css/neo-overrides.css');
const ov = readFileSync(OV, 'utf8');
const ds = readFileSync(resolve(wurzel, 'styles.css'), 'utf8');

const EBENEN = ['04-objects', '05-atoms', '06-molecules', '07-organisms', '10-utilities'];
const stamm = (k) => k.split('__')[0].split('--')[0];
const ohneK = (t) => t.replace(/\/\*[\s\S]*?\*\//g, ' ');

/** In welcher Ebene und Datei behandelt das DS diese Klasse schon? */
function imDs(komp) {
  const raus = [];
  for (const ebene of EBENEN) {
    const dir = resolve(wurzel, 'scss/scss', ebene);
    if (!existsSync(dir)) continue;
    for (const f of readdirSync(dir)) {
      if (!f.endsWith('.scss') || f === '_index.scss') continue;
      const t = readFileSync(resolve(dir, f), 'utf8');
      const treffer = [...ohneK(t).matchAll(new RegExp(`\\.${komp}(?![a-z0-9-])`, 'g'))].length;
      if (treffer) raus.push({ ebene, datei: f, treffer });
    }
  }
  return raus;
}

/** Regeln der Komponente im Theme, mit ihren Eigenschaften. */
function themeRegeln(komp) {
  const raus = [];
  for (const m of ohneK(ov).matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    const sel = m[1].trim();
    if (!sel || sel.startsWith('@')) continue;
    const ks = [...sel.matchAll(/\.(nc-[a-z0-9-]+)/g)].map((x) => stamm(x[1]));
    if (ks[0] !== komp) continue;
    raus.push({ sel, props: [...m[2].matchAll(/([a-z-]+)\s*:/g)].map((x) => x[1]) });
  }
  return raus;
}

/** Setzt eine ANDERE DS-Komponente dieselbe Eigenschaft auf demselben Selektor? */
function reihenfolgeRisiko(komp, regeln) {
  const treffer = [];
  for (const r of regeln) {
    // Nur die Wurzel- und Modifier-Selektoren pruefen; verschachtelte sind
    // spezifisch genug.
    if (!/^\.[a-z0-9-]+$/.test(r.sel)) continue;
    for (const m of ohneK(ds).matchAll(new RegExp(`([^{},]*${r.sel.replace('.', '\\.')}[^{},]*)\\{([^}]*)\\}`, 'g'))) {
      const props = [...m[2].matchAll(/([a-z-]+)\s*:/g)].map((x) => x[1]);
      const gemeinsam = r.props.filter((p) => props.includes(p) ||
        (p.startsWith('padding') && props.includes('padding')) ||
        (p === 'padding' && props.some((q) => q.startsWith('padding'))));
      if (gemeinsam.length) treffer.push({ sel: r.sel, andere: m[1].trim(), props: [...new Set(gemeinsam)] });
    }
  }
  return treffer;
}

// ---------------------------------------------------------------------------

const argv = process.argv.slice(2);
const alle = argv.includes('--alle');
const nurDs = argv.includes('--ds');

/** Doppelungen INNERHALB des Design Systems.
 *
 *  Die Pruefung unten sieht auf die Klebeschicht — sie beantwortet „was
 *  passiert, wenn ich das aus dem Theme aufnehme". Sie sieht NICHT, ob eine
 *  Klasse im DS bereits zweimal gefuehrt wird. Genau das ist aber der Fall,
 *  an dem frueher vier Aufnahmen gescheitert sind, und er besteht im Bestand
 *  weiter: .nc-card und .nc-slider stehen in 05-atoms UND 06-molecules.
 *  Die spaeter geladene Ebene gewinnt, die frueher geladene ist wirkungslos. */
function dsDoppelungen() {
  const EBENEN = ['04-objects', '05-atoms', '06-molecules', '07-organisms'];
  const wo = new Map();
  for (const ebene of EBENEN) {
    const dir = resolve(wurzel, 'scss/scss', ebene);
    if (!existsSync(dir)) continue;
    for (const f of readdirSync(dir)) {
      if (!f.endsWith('.scss') || f === '_index.scss') continue;
      const name = f.slice(1, -5);
      const t = ohneK(readFileSync(resolve(dir, f), 'utf8'));
      // Nur WURZELREGELN zaehlen. Dass zwei Dateien dieselbe Klasse in einem
      // Nachfahren-Selektor erwaehnen, ist normal und harmlos.
      const wurzeln = new Set(
        [...t.matchAll(new RegExp(`^\\.(${name}|nc-${name})(?![a-z0-9-])`, 'gm'))].map((m) => m[0].trim()),
      );
      if (!wurzeln.size) continue;
      if (!wo.has(name)) wo.set(name, []);
      wo.get(name).push({ ebene, wurzeln: [...wurzeln] });
    }
  }
  const raus = [];
  for (const [name, orte] of wo) {
    if (orte.length < 2) continue;
    const gemeinsam = orte[0].wurzeln.filter((s) => orte.every((o) => o.wurzeln.includes(s)));
    if (gemeinsam.length) raus.push({ name, orte: orte.map((o) => o.ebene), gemeinsam });
  }
  return raus;
}

if (nurDs || alle) {
  const d = dsDoppelungen();
  console.log(`\n  DIESELBE WURZELKLASSE AUF ZWEI EBENEN`);
  if (!d.length) console.log('    Keine. Jede Wurzelklasse wird auf genau einer Ebene gefuehrt.');
  for (const x of d) {
    console.log(`    ${x.name.padEnd(20)}${x.orte.join(' + ').padEnd(28)}gemeinsam: ${x.gemeinsam.join(', ')}`);
    console.log(`    ${''.padEnd(20)}${x.orte[x.orte.length - 1]} laedt spaeter und gewinnt.`);
  }
  if (d.length) {
    // Diese Pruefung vergleicht NAMEN, nicht Bausteine. Beides sieht hier
    // gleich aus und will Gegenteiliges:
    //
    //   Doppelung           eine Komponente, zweimal angelegt  -> loeschen
    //   Geteilter Name      zwei Komponenten, gleicher Name    -> umbenennen
    //
    // Am 18.08.2026 stand `slider` hier und sah aus wie `card`. `card` war
    // wirklich doppelt. `slider` waren ein <input type="range"> und ein
    // Karussell — die Loeschung haette eine echte Komponente getroffen.
    console.log(`\n    Bevor etwas geloescht wird: BEIDE Dateien oeffnen und die`);
    console.log(`    Kopfzeilen vergleichen. Beschreiben sie denselben Baustein,`);
    console.log(`    ist es eine Doppelung — dann loeschen. Beschreiben sie`);
    console.log(`    verschiedene, ist es ein geteilter Name — dann umbenennen.`);
  }
  if (nurDs) process.exit(d.length ? 1 : 0);
}
const einzeln = argv.find((a) => !a.startsWith('--'));

let liste;
if (alle) {
  const z = new Set();
  for (const m of ohneK(ov).matchAll(/([^{}]+)\{[^{}]*\}/g)) {
    const sel = m[1].trim();
    if (!sel || sel.startsWith('@')) continue;
    const ks = [...sel.matchAll(/\.(nc-[a-z0-9-]+)/g)].map((x) => stamm(x[1]));
    if (ks.length) z.add(ks[0]);
  }
  liste = [...z].sort();
} else if (einzeln) liste = [einzeln.startsWith('nc-') ? einzeln : `nc-${einzeln}`];
else { console.error('Aufruf: npm run risiko -- <komponente> | --alle'); process.exit(1); }

const sicher = [], pruefen = [];
console.log(`\n  ${'Komponente'.padEnd(24)}${'Regeln'.padStart(7)}   Befund`);
console.log('  ' + '─'.repeat(78));

for (const komp of liste) {
  const regeln = themeRegeln(komp);
  if (!regeln.length) continue;
  const vorhanden = imDs(komp);
  const risiko = reihenfolgeRisiko(komp, regeln);
  const hinweise = [];
  if (vorhanden.length) hinweise.push(`DS-Datei: ${vorhanden.map((v) => `${v.ebene}/${v.datei}`).join(', ')}`);
  if (risiko.length) hinweise.push(`Reihenfolge: ${risiko.slice(0, 2).map((r) => `${r.sel} teilt ${r.props.join('/')} mit ${r.andere.slice(0, 34)}`).join('; ')}`);
  (hinweise.length ? pruefen : sicher).push(komp);
  console.log(`  ${komp.replace('nc-', '').padEnd(24)}${String(regeln.length).padStart(7)}   ${hinweise.length ? hinweise.join('  |  ') : 'unauffaellig'}`);
}

console.log('\n  ' + '─'.repeat(78));
console.log(`  unauffaellig: ${sicher.length}   zu pruefen: ${pruefen.length}`);
if (sicher.length) console.log(`\n  Stapel:  ${sicher.join(' ')}`);
