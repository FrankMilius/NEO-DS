/**
 * @file
 * Erzeugt ein Recipe fuer eine aufgenommene Komponente aus ihrem SCSS-Partial.
 *
 *   npm run recipe -- footer            Vorschau
 *   npm run recipe -- footer --schreiben
 *   npm run recipe -- --alle --schreiben
 *
 * Aus dem Recipe baut `npm run generate:stories` die Storybook-Story. Die
 * Komponenten sind aus dem Drupal-Theme aufgenommen; ihre Anatomie steht
 * deshalb nicht in einer Spezifikation, sondern nur in den Klassennamen des
 * SCSS. Genau die werden hier ausgelesen:
 *
 *   .nc-<name>            -> anatomy.root
 *   .nc-<name>__<slot>    -> anatomy.slots
 *   .nc-<name>--<variante>-> axes
 *   --nc-<name>-*         -> styling.tokens
 *
 * BEWUSST status "draft": die Komponenten sind uebernommen, nicht entworfen.
 * Wer sie fuer verbindlich erklaert, sollte vorher Anatomie und Achsen
 * durchsehen — die Ableitung kann Slots erfinden, die nur Hilfsklassen sind.
 */

import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs';
import { resolve, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const wurzel = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const argv = process.argv.slice(2);
const schreiben = argv.includes('--schreiben');
const alle = argv.includes('--alle');
const einzeln = argv.find((a) => !a.startsWith('--'));

/** Alle Partials, die einen Aufnahme-Abschnitt tragen. */
function aufgenommene() {
  const raus = [];
  for (const ebene of ['04-objects', '05-atoms', '06-molecules', '07-organisms', '10-utilities']) {
    const dir = resolve(wurzel, 'scss/scss', ebene);
    if (!existsSync(dir)) continue;
    for (const f of readdirSync(dir)) {
      if (!f.endsWith('.scss') || f === '_index.scss') continue;
      const p = resolve(dir, f);
      const t = readFileSync(p, 'utf8');
      if (t.includes('>>> aufgenommen:')) raus.push({ name: basename(f, '.scss').slice(1), ebene, pfad: p });
    }
  }
  return raus;
}

const EBENE_KATEGORIE = {
  '04-objects': 'objects', '05-atoms': 'atoms',
  '06-molecules': 'molecules', '07-organisms': 'organisms', '10-utilities': 'utilities',
};

function recipeBauen({ name, ebene, pfad }) {
  const scss = readFileSync(pfad, 'utf8');
  const wurzelKlasse = `nc-${name}`;

  // Slots: __element. Nur die, die wirklich als Selektor vorkommen.
  const slots = [...new Set(
    [...scss.matchAll(new RegExp(`\\.${wurzelKlasse}__([a-z0-9-]+)`, 'g'))].map((m) => m[1]),
  )].sort();

  // Achsen: --modifier am Wurzelelement.
  const modifier = [...new Set(
    [...scss.matchAll(new RegExp(`\\.${wurzelKlasse}--([a-z0-9-]+)`, 'g'))].map((m) => m[1]),
  )].sort();

  // Zustaende, die im SCSS wirklich behandelt werden.
  const zustaende = ['default'];
  for (const [muster, zustand] of [[':hover', 'hover'], [':focus-visible', 'focus'],
    ['[aria-selected', 'selected'], ['[disabled]', 'disabled'], ['.is-active', 'active']]) {
    if (scss.includes(muster)) zustaende.push(zustand);
  }

  const tokens = [...new Set(
    [...scss.matchAll(new RegExp(`--nc-${name}-[a-z0-9-]+`, 'g'))].map((m) => m[0]),
  )].sort();

  return {
    $schema: '../schemas/component-recipe.schema.json',
    meta: {
      schemaVersion: '3.1.0',
      component: name,
      version: '1.0.0',
      status: 'draft',
      tags: ['aufgenommen', EBENE_KATEGORIE[ebene] || 'component'],
      links: { figma: '', storybook: '', docs: '' },
      changelog: [{
        version: '1.0.0',
        changes: [
          'Aus dem Drupal-Theme aufgenommen (neo-overrides.css).',
          'Anatomie aus den Klassennamen des SCSS abgeleitet, nicht spezifiziert.',
          'Status draft: Anatomie und Achsen vor der Freigabe durchsehen.',
        ],
      }],
    },
    anatomy: {
      root: { element: `.${wurzelKlasse}` },
      slots: slots.map((s) => ({
        name: s,
        element: `.${wurzelKlasse}__${s}`,
        // Ohne Spezifikation ist nicht entscheidbar, was Pflicht ist. Alles
        // optional zu melden ist die ehrliche Aussage — der Story-Generator
        // rendert dann die Wurzel, nicht erfundene Pflichtteile.
        optional: true,
      })),
      convenience: [],
      domNotes: [`Aus dem Drupal-Theme uebernommen; Markup siehe templates/block/ im Theme neo_fe.`],
    },
    // Eine Achse braucht IMMER den Wert ohne Modifier.
    //
    // Bis zum 19.08.2026 fehlte er: Die Achse bestand nur aus den gefundenen
    // Modifiern, und `default` zeigte auf den ERSTEN davon. Beides ist falsch —
    // ein Modifier ist nie der Standard, die Abwesenheit eines Modifiers ist es.
    //
    // Bei genau einem Modifier fiel es auf (Achse mit einem Wert, der Test
    // schlug an); bei mehreren blieb es unbemerkt, war aber derselbe Fehler.
    // Drei Recipes trugen ihn still: compare-table, feature-list,
    // testimonial-grid.
    axes: modifier.length ? [{
      name: 'variante',
      values: [
        { value: 'default', modifier: null },
        ...modifier.map((m) => ({ value: m, modifier: `${wurzelKlasse}--${m}` })),
      ],
      default: 'default',
    }] : [],
    states: zustaende,
    a11y: {
      notes: ['Nicht geprueft — die Komponente wurde uebernommen, nicht entworfen.'],
    },
    constraints: [],
    styling: { tokens },
    recipes: [],
    specimens: [{
      id: 'default',
      label: 'Standard',
      description: `${name} wie auf der Website`,
      matrix: { axes: {}, states: ['default'] },
      layout: 'block',
      render: {},
    }],
  };
}

// ---------------------------------------------------------------------------

const liste = alle ? aufgenommene()
  : aufgenommene().filter((k) => k.name === einzeln?.replace(/^nc-/, ''));

if (!liste.length) {
  console.error(einzeln ? `Keine aufgenommene Komponente "${einzeln}"` : 'Keine aufgenommenen Komponenten gefunden');
  process.exit(1);
}

let geschrieben = 0, uebersprungen = 0;
console.log(`\n  ${liste.length} aufgenommene Komponente(n)\n`);
console.log(`  ${'Komponente'.padEnd(24)}${'Ebene'.padEnd(14)}${'Slots'.padStart(6)}${'Achsen'.padStart(8)}${'Tokens'.padStart(8)}`);

for (const k of liste) {
  const r = recipeBauen(k);
  const ziel = resolve(wurzel, `data/${k.name}-recipe.json`);
  const existiert = existsSync(ziel);
  console.log(`  ${k.name.padEnd(24)}${k.ebene.padEnd(14)}${String(r.anatomy.slots.length).padStart(6)}${String(r.axes[0]?.values.length || 0).padStart(8)}${String(r.styling.tokens.length).padStart(8)}${existiert ? '   (Recipe existiert bereits — uebersprungen)' : ''}`);
  if (schreiben) {
    // Vorhandene Recipes NICHT ueberschreiben: die sind von Hand gepflegt und
    // deutlich reicher als eine Ableitung aus Klassennamen.
    if (existiert) { uebersprungen++; continue; }
    writeFileSync(ziel, JSON.stringify(r, null, 2) + '\n');
    geschrieben++;
  }
}

if (schreiben) {
  console.log(`\n  ${geschrieben} Recipes geschrieben, ${uebersprungen} vorhandene unangetastet`);
  console.log(`  Danach: npm run generate:stories`);
} else {
  console.log(`\n  Vorschau. Zum Schreiben: --schreiben`);
}
