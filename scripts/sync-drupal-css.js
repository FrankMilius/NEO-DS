#!/usr/bin/env node

/**
 * sync-drupal-css.js
 *
 * DS -> Drupal-Theme-Sync (Single Source of Truth).
 * Kopiert den gebauten Token-/CSS-Output des Design Systems in das Drupal-Theme
 * `neo_fe`, das die CSS statisch via Libraries konsumiert (kein eigener Build).
 *
 * Damit ist DIES der eine dokumentierte Schritt, der DS-Aenderungen ins Theme
 * durchschlagen laesst:
 *
 *   npm run build:drupal        # tokens (separat) + build:css + dieser Sync
 *
 * Quelle:  WEBSITE26/styles.css            (kompiliert via `npm run build:css`)
 *          WEBSITE26/data/design-tokens.css (generiert via `npm run tokens`)
 * Ziel:    <THEME>/css/styles.css
 *          <THEME>/css/design-tokens.css
 *
 * Zielpfad ueberschreibbar via Env NEO_DRUPAL_THEME (Default = Repo-Nachbar).
 *
 * styles.css kommt byte-gleich an, ohne Umschreiben (I09, 05.11.2026). Die
 * Schriften liegen seit neo_fe 92c3116 (13.10.2026) in css/fonts/ — genau
 * dort, wohin url("fonts/…") aus css/styles.css zeigt. Das fruehere
 * Umschreiben auf ../fonts/ zeigte seither ins Leere (404 je Seite); cc865c9
 * reparierte nur die Datei im Theme, 503c76b brachte den Fehler zurueck.
 * Darum prueft der Abgleich vor dem Kopieren, dass jede Schrift-URL auf eine
 * Datei im Theme zeigt, und bricht sonst ab, ohne etwas zu schreiben.
 */

import { copyFileSync, existsSync, readFileSync, statSync } from 'fs';
import { resolve, join } from 'path';
import { pathToFileURL } from 'url';

/**
 * Schrift-URLs (woff2, woff, ttf, otf, eot) in styles.css, die auf keine Datei im
 * Theme-CSS-Ordner zeigen. Nur relative Pfade zaehlen: data:, absolute (/…) und
 * fremde Adressen (https:, //) liefert nicht das Theme aus; Kommentare zaehlen nicht.
 * Abfrage und Fragment (?v=1, #iefix) werden fuer die Dateipruefung abgeschnitten.
 */
export function fehlendeSchriften (css, themeCssOrdner) {
  const ohneKommentare = css.replace(/\/\*[\s\S]*?\*\//g, '');
  const urls = [...ohneKommentare.matchAll(/url\(\s*(["']?)(.*?)\1\s*\)/gi)].map((m) => m[2].trim());
  const schriften = urls.filter((u) => !/^(?:[a-z][a-z0-9+.-]*:|\/)/i.test(u)
    && /\.(?:woff2?|ttf|otf|eot)$/i.test(u.replace(/[?#].*$/, '')));
  return [...new Set(schriften)].filter((u) => {
    const datei = u.replace(/[?#].*$/, '');
    let pfad = datei;
    try { pfad = decodeURIComponent(datei); } catch { /* ungueltige Kodierung: Pfad wie geschrieben pruefen */ }
    return !existsSync(resolve(themeCssOrdner, pfad));
  });
}

/** Gleicht styles.css, design-tokens.css und Vorschau-CSS ab. Schreibt nichts, wenn Quellen oder Schriften fehlen. */
export function abgleichen ({ root, theme }) {
  const pairs = [
    { src: join(root, 'styles.css'), dest: join(theme, 'css', 'styles.css'), label: 'styles.css' },
    { src: join(root, 'data', 'design-tokens.css'), dest: join(theme, 'css', 'design-tokens.css'), label: 'design-tokens.css' },
    // Stile des Medien-Bauteils fuer die Admin-Vorschau (npm run build:shot-vorschau;
    // Restpunkte 09.10.2026, shot-admin) — Library neo_fe/neo-shot-admin.
    { src: join(root, 'shot-vorschau.css'), dest: join(theme, 'css', 'neo-shot-vorschau.css'), label: 'neo-shot-vorschau.css' },
  ];
  const quelleFehlt = pairs.filter((p) => !existsSync(p.src)).map((p) => p.src);
  if (quelleFehlt.length) return { quelleFehlt, fehlend: [], kopiert: [] };
  const fehlend = fehlendeSchriften(readFileSync(pairs[0].src, 'utf8'), join(theme, 'css'));
  if (fehlend.length) return { quelleFehlt: [], fehlend, kopiert: [] };
  for (const { src, dest } of pairs) copyFileSync(src, dest);
  return { quelleFehlt: [], fehlend: [], kopiert: pairs };
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  const ROOT = resolve(import.meta.dirname, '..');
  const THEME = process.env.NEO_DRUPAL_THEME
    || resolve(ROOT, '../DRUPAL11/web/themes/custom/neo_fe');

  if (!existsSync(join(THEME, 'css'))) {
    console.error(`✗ Theme-CSS-Verzeichnis nicht gefunden: ${join(THEME, 'css')}`);
    console.error('  Setze NEO_DRUPAL_THEME auf den neo_fe-Theme-Pfad.');
    process.exit(1);
  }

  const { quelleFehlt, fehlend, kopiert } = abgleichen({ root: ROOT, theme: THEME });
  if (quelleFehlt.length) {
    for (const q of quelleFehlt) console.error(`✗ Quelle fehlt: ${q} — erst "npm run tokens && npm run build:css" ausfuehren.`);
    process.exit(1);
  }
  if (fehlend.length) {
    console.error(`✗ styles.css verweist auf Schriften, die es in ${join(THEME, 'css')} nicht gibt — nichts synchronisiert:`);
    for (const f of fehlend) console.error(`  ${f}`);
    process.exit(1);
  }
  for (const { dest, label } of kopiert) {
    const kb = (statSync(dest).size / 1024).toFixed(1);
    console.log(`✓ ${label} -> ${dest} (${kb} KB)`);
  }
  console.log(`\nFertig. ${kopiert.length} Datei(en) ins Drupal-Theme synchronisiert.`);
  console.log('Hinweis: in Drupal anschliessend "drush cr" (Cache) ausfuehren.');
}
