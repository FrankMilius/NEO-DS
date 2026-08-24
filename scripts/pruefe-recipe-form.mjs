/**
 * Haben alle Recipes dieselbe Form?
 *
 *   node scripts/pruefe-recipe-form.mjs
 *
 * WARUM NEBEN `lint:recipes`
 * Der Recipe-Linter kann seinen Schema-Validator seit dem Wechsel auf ESM nicht
 * laden und faellt auf eine schwaechere Pruefung zurueck (siehe BACKLOG). Er hat
 * keinen einzigen der Formfehler gemeldet, die am 24.08.2026 gefunden wurden:
 *
 *   chapter-nav   `root` als Zeichenkette statt als Objekt — mein eigener
 *                 Fehler vom 20.08. Das Bauteil war damit fuer jede Pruefung
 *                 unsichtbar: null Zeugen in der Verwendungsmessung, kein
 *                 Wurzelselektor fuer die Markup-Ernte, obwohl es live steht.
 *   timeline      sieben Slots mit `selector`/`required` statt
 *                 `element`/`optional` — zwei Konventionen in einer Datei.
 *   vier Recipes  `styling.tokenGroups` als Liste statt als Objekt.
 *
 * Diese Pruefung ist bewusst klein und ohne Schema-Bibliothek: sie soll laufen,
 * auch wenn der grosse Linter wieder klemmt.
 *
 * WAS SIE NICHT BEANSTANDET
 * Ein Slot darf einen ELEMENTNAMEN tragen statt einer Klasse — `canvas` beim
 * psychedelic-bg, `video | iframe` beim Video-Bauteil sind richtig so. Der
 * erste Entwurf dieser Pruefung hat beide faelschlich gemeldet. Angemahnt wird
 * nur, was wie eine Klasse aussieht und den Punkt vergessen hat.
 */

import { readFileSync, readdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DATA = resolve(ROOT, 'data');

// Sieht aus wie eine Design-System-Klasse, der der Punkt fehlt.
const KLASSE_OHNE_PUNKT = /^(nc|fnd|o|u)-[a-z0-9-]/;

const befunde = [];

for (const datei of readdirSync(DATA).filter((f) => f.endsWith('-recipe.json')).sort()) {
  const name = datei.replace(/-recipe\.json$/, '');
  const melden = (was) => befunde.push({ name, was });

  let r;
  try {
    r = JSON.parse(readFileSync(resolve(DATA, datei), 'utf8'));
  } catch (e) {
    melden(`ist kein gueltiges JSON (${e.message.slice(0, 60)})`);
    continue;
  }

  // Der Story-Generator sucht die Markup-Datei ueber meta.component, nicht
  // ueber den Dateinamen. Weichen beide ab, bleibt ein Bauteil ohne Markup,
  // obwohl die Datei danebenliegt — genau so verschwand chapter-nav.
  const gemeldet = r.meta?.component ?? r.name;
  if (gemeldet && gemeldet !== name) melden(`meta.component ist "${gemeldet}", die Datei heisst "${name}"`);

  const a = r.anatomy;
  if (!a) { melden('hat keine anatomy'); continue; }

  if (typeof a.root === 'string') melden('anatomy.root ist eine Zeichenkette, erwartet wird { element: "…" }');
  else if (!a.root?.element) melden('anatomy.root.element fehlt');

  for (const [i, s] of (a.slots ?? []).entries()) {
    if (!s.element && s.selector) melden(`Slot ${i} ("${s.name ?? '?'}") nutzt selector/required statt element/optional`);
    else if (!s.element) melden(`Slot ${i} ("${s.name ?? '?'}") hat kein element`);
    else if (KLASSE_OHNE_PUNKT.test(s.element)) melden(`Slot ${i}: "${s.element}" sieht aus wie eine Klasse ohne Punkt`);
  }

  const tg = r.styling?.tokenGroups;
  if (Array.isArray(tg)) melden('styling.tokenGroups ist eine Liste, erwartet wird ein Objekt');
  else if (tg === null) melden('styling.tokenGroups ist null');
}

const dateien = readdirSync(DATA).filter((f) => f.endsWith('-recipe.json')).length;

console.log('\n  RECIPE-FORM');
console.log('  ' + '─'.repeat(76));
if (!befunde.length) {
  console.log(`  ✓ alle ${dateien} Recipes haben dieselbe Form.\n`);
  process.exit(0);
}
for (const b of befunde) console.log(`  ${b.name.padEnd(22)} ${b.was}`);
console.log('  ' + '─'.repeat(76));
console.log(`  ✗ ${befunde.length} Formfehler in ${new Set(befunde.map((b) => b.name)).size} von ${dateien} Recipes.\n`);
process.exit(1);
