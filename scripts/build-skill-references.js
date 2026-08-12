/**
 * @file
 * Erzeugt die Referenzdateien des Skills `neo-design-system` aus der ECHTEN
 * Token-Quelle.
 *
 * Warum generiert und nicht von Hand gepflegt:
 * Das DS fuehrt 536 --fnd-* und rund 2400 --nc-* Tokens ueber 115 Komponenten.
 * Eine handgeschriebene Kopie ist am Tag ihrer Entstehung unvollstaendig und
 * altert danach unsichtbar. Genau dieser Fehler ist im Bestand mehrfach
 * belegt: der Kopfkommentar in _logo-wall.scss nannte Groessen (120/160/220px),
 * die es in den Tokens NIE gab.
 *
 * Aufruf:  npm run skill:build
 * Ausgabe: skill/neo-design-system/
 */

import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync, statSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { resolve, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const wurzel = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const ziel = resolve(wurzel, 'skill/neo-design-system');

// ---------------------------------------------------------------------------
// Hilfen
// ---------------------------------------------------------------------------

/** Sammelt die Rumpfe ALLER Bloecke, deren Selektorliste `passt` erfuellt.
 *
 *  Bewusst ein eigener Mini-Parser statt indexOf(':root{'):
 *  - design-tokens.css schreibt `:root {` MIT Leerzeichen,
 *  - styles.css ist minifiziert und enthaelt MEHRERE :root-Bloecke
 *    (ein Partial je Token-Gruppe), die alle eingesammelt werden muessen.
 *  Eine naive Suche traf davon genau einen — und lieferte 2 Tokens statt 500.
 *
 *  @-Regeln (@media, @supports, @font-face) werden uebersprungen: ihre
 *  verschachtelten Bloecke wuerden die Klammerzaehlung sonst verwirren.
 */
function bloecke(css, passt) {
  const raus = [];
  let i = 0, selStart = 0;
  while (i < css.length) {
    const z = css[i];
    if (z === '{') {
      const sel = css.slice(selStart, i).trim();
      // Klammerpaar suchen
      let tiefe = 1, j = i + 1;
      while (j < css.length && tiefe > 0) {
        if (css[j] === '{') tiefe++;
        else if (css[j] === '}') tiefe--;
        j++;
      }
      if (!sel.startsWith('@') && passt(sel)) raus.push(css.slice(i + 1, j - 1));
      // Bei @-Regeln in den Rumpf HINEIN laufen, sonst dahinter weiter.
      i = sel.startsWith('@') ? i + 1 : j;
      selStart = i;
      continue;
    }
    if (z === '}') { selStart = i + 1; }
    i++;
  }
  return raus;
}

/** Alle Custom Properties aus allen passenden Bloecken, spaetere gewinnen. */
function sammle(css, passt) {
  const karte = new Map();
  for (const rumpf of bloecke(css, passt)) {
    for (const [n, v] of properties(rumpf)) karte.set(n, v);
  }
  return karte;
}

const istRoot = (sel) => sel.split(',').some((s) => s.trim() === ':root');
const istDunkel = (sel) => sel.split(',').some((s) => {
  const t = s.trim();
  return t === '.neo-dark-theme' || t === '[data-theme=neo-dark-theme]' || t === '[data-theme="neo-dark-theme"]';
});

/** Zerlegt einen Blockrumpf in [name, wert]-Paare der Custom Properties. */
function properties(rumpf) {
  const raus = [];
  // Werte koennen Kommas und Klammern enthalten (clamp, color-mix) — deshalb
  // klammertief splitten statt naiv an ';'.
  let puffer = '', tiefe = 0;
  for (const z of rumpf) {
    if (z === '(') tiefe++;
    if (z === ')') tiefe--;
    if (z === ';' && tiefe === 0) { raus.push(puffer); puffer = ''; continue; }
    puffer += z;
  }
  if (puffer.trim()) raus.push(puffer);
  return raus
    .map((d) => { const k = d.indexOf(':'); return k < 0 ? null : [d.slice(0, k).trim(), d.slice(k + 1).trim()]; })
    .filter((p) => p && p[0].startsWith('--'));
}

const gruppen = [
  ['Schriftfamilien',        (n) => n.startsWith('--font-')],
  ['Fluide Schriftgroessen', (n) => n.startsWith('--fs-') || n === '--fluid-bp'],
  ['Zeilenhoehen',           (n) => n.startsWith('--lh-')],
  ['Container-Breiten',      (n) => n.startsWith('--container-')],
  ['Typografie (Foundation)',(n) => n.startsWith('--fnd-typography-')],
  ['Farben',                 (n) => n.startsWith('--fnd-color-')],
  ['Abstaende',              (n) => n.startsWith('--fnd-spacing-')],
  ['Radien',                 (n) => n.startsWith('--fnd-radi')],
  ['Rahmen',                 (n) => n.startsWith('--fnd-border-')],
  ['Bewegung',               (n) => n.startsWith('--fnd-motion-')],
  ['Deckkraft / Zustaende',  (n) => n.startsWith('--fnd-opacity-') || n.startsWith('--fnd-state-')],
  ['Fokus / Barrierefreiheit',(n) => n.startsWith('--fnd-focus') || n.startsWith('--fnd-a11y')],
  ['Layout / Breakpoints',   (n) => n.startsWith('--fnd-layout-') || n.startsWith('--fnd-bp') || n.startsWith('--fnd-breakpoints') || n.startsWith('--fnd-media-')],
  ['Schatten / Elevation',   (n) => n.startsWith('--fnd-shadow') || n.startsWith('--fnd-elevation')],
  ['Ebenen (z-index)',       (n) => n.startsWith('--fnd-z')],
  ['Icons',                  (n) => n.startsWith('--fnd-icons-')],
  ['Laufweite',              (n) => n.startsWith('--fnd-tracking-')],
];

/** Was in einer Artefakt-Referenz nichts zu suchen hat.
 *  --fnd--configurator-*  Beschriftungen der Konfigurator-Oberflaeche (249
 *                         Stueck). Reine Werkzeug-Metadaten. Der doppelte
 *                         Bindestrich ist zudem ein Fehler im Token-Generator.
 *  --fnd-primitive-*      Rohpalette (234 Stueck). Fuer Artefakte zaehlen die
 *                         SEMANTISCHEN Tokens; wer die Rohwerte nimmt, umgeht
 *                         die Theme-Umschaltung. */
const istRauschen = (n) => n.startsWith('--fnd--configurator') || n.startsWith('--fnd-primitive-');

function schreibeGruppiert(paare, eingerueckt = '  ') {
  const rest = new Map(paare);
  let out = '';
  for (const [titel, passt] of gruppen) {
    const treffer = [...rest].filter(([n]) => passt(n));
    if (!treffer.length) continue;
    out += `\n${eingerueckt}/* ── ${titel} ${'─'.repeat(Math.max(2, 58 - titel.length))} */\n`;
    for (const [n, v] of treffer) { out += `${eingerueckt}${n}: ${v};\n`; rest.delete(n); }
  }
  const uebrig = [...rest];
  if (uebrig.length) {
    out += `\n${eingerueckt}/* ── Weitere ─────────────────────────────────────────────── */\n`;
    for (const [n, v] of uebrig) out += `${eingerueckt}${n}: ${v};\n`;
  }
  return out;
}

// ---------------------------------------------------------------------------
// 1. tokens.css
// ---------------------------------------------------------------------------

function baueTokens() {
  const styles = readFileSync(resolve(wurzel, 'styles.css'), 'utf8');
  const fnd = readFileSync(resolve(wurzel, 'data/design-tokens.css'), 'utf8');

  const ausStyles = [...sammle(styles, istRoot)]
    .filter(([n]) => /^--(font|fs|lh|container|fluid-bp)/.test(n));
  // Foundation aus BEIDEN Quellen: design-tokens.css ist die generierte Basis,
  // styles.css ergaenzt sie um das, was erst im SCSS entsteht.
  const fndKarte = sammle(fnd, istRoot);
  for (const [n, v] of sammle(styles, istRoot)) if (n.startsWith('--fnd-') && !fndKarte.has(n)) fndKarte.set(n, v);
  const ausFnd = [...fndKarte].filter(([n]) => n.startsWith('--fnd-') && !istRauschen(n));

  // Dark Theme: nur die Farbumschaltung ist fuer Artefakte relevant.
  const dunkel = [...sammle(styles, istDunkel)].filter(([n]) => n.startsWith('--fnd-color-'));

  const commit = execFileSync('git', ['rev-parse', '--short', 'HEAD'], { cwd: wurzel }).toString().trim();

  let out = `/* =========================================================================
   NEO Design System — Token-Referenz fuer Artefakte
   =========================================================================
   GENERIERT von scripts/build-skill-references.js. NICHT VON HAND AENDERN —
   die naechste Generierung ueberschreibt jede Bearbeitung. Aenderungen
   gehoeren in die SCSS-Quelle unter scss/scss/00-settings/.

   @source   WEBSITE26 @ ${commit} — scss/scss/00-settings/ + data/design-tokens.css
   @updated  ${new Date().toISOString().slice(0, 10)}
   @umfang   ${ausStyles.length + ausFnd.length} Tokens (Foundation + Typo-Skala),
             ${dunkel.length} davon im Dark Theme umgeschaltet.

   NICHT enthalten sind die rund 2400 komponentenspezifischen --nc-* Tokens.
   Fuer Artefakte zaehlt die Foundation; die Komponenten-Ebene steht in
   references/components.md.

   VERWENDUNG IM ARTEFAKT
   Artefakte laufen unter strikter CSP: keine externen Requests, auch keine
   Schriften. Dieser Block muss daher INLINE ins Artefakt. Die Hausschriften
   liegen als base64 unter assets/fonts/ — siehe assets/artifact-template.html.

   ACHTUNG: --fnd-elevation-* NICHT ungeprueft uebernehmen
   Im Design System stimmen die Werte (--fnd-shadow-xs: 0 1px 2px rgba(...)).
   Auf der Website nicht: die vom Theme-Konfigurator erzeugte
   theme-overrides.css setzt --fnd-elevation-base auf das WORT "xs" statt auf
   einen Schattenwert und laedt nach styles.css. Ein Artefakt mit
   box-shadow: var(--fnd-elevation-base) sieht deshalb anders aus als die
   Website — dort kommt gar kein Schatten an. Bis das behoben ist, im Artefakt
   die --fnd-shadow-* Werte direkt verwenden.
   ========================================================================= */

:root {
${schreibeGruppiert(ausStyles).trimStart()}
${schreibeGruppiert(ausFnd).trimStart()}}
`;

  if (dunkel.length) {
    out += `
/* Dark Theme — die Klasse liegt auf <html> UND <body>.
   Im Artefakt reicht sie auf dem Wurzelelement. */
.neo-dark-theme,
[data-theme="neo-dark-theme"] {
${schreibeGruppiert(dunkel).trimStart()}}
`;
  }

  mkdirSync(resolve(ziel, 'references'), { recursive: true });
  writeFileSync(resolve(ziel, 'references/tokens.css'), out);
  return { anzahl: ausStyles.length + ausFnd.length, dunkel: dunkel.length };
}

// ---------------------------------------------------------------------------
// 2. components.md
// ---------------------------------------------------------------------------

function baueKomponenten() {
  const ebenen = [
    ['04-objects', 'Objekte (Layout-Traeger)'],
    ['05-atoms', 'Atome'],
    ['06-molecules', 'Molekuele'],
    ['07-organisms', 'Organismen'],
  ];
  const commit = execFileSync('git', ['rev-parse', '--short', 'HEAD'], { cwd: wurzel }).toString().trim();

  let md = `# NEO Design System — Komponenten

GENERIERT von \`scripts/build-skill-references.js\` aus \`scss/scss/\`.
Nicht von Hand aendern. Quelle: WEBSITE26 @ ${commit}

Aufgefuehrt sind die BEM-Wurzelklassen je Komponente. Modifier (\`--variante\`)
und Elemente (\`__teil\`) sind zusammengefasst, damit die Liste lesbar bleibt.

`;
  let gesamt = 0;
  for (const [ordner, titel] of ebenen) {
    const pfad = resolve(wurzel, 'scss/scss', ordner);
    if (!existsSync(pfad)) continue;
    const dateien = readdirSync(pfad).filter((f) => f.startsWith('_') && f.endsWith('.scss') && f !== '_index.scss').sort();
    md += `\n## ${titel}\n\n| Komponente | Wurzelklassen | Modifier |\n|---|---|---|\n`;
    for (const f of dateien) {
      const inhalt = readFileSync(resolve(pfad, f), 'utf8');
      const klassen = new Set(), modifier = new Set();
      for (const m of inhalt.matchAll(/\.(nc-[a-z0-9-]+)/g)) {
        const k = m[1];
        if (k.includes('--')) modifier.add('--' + k.split('--').slice(1).join('--'));
        else if (!k.includes('__')) klassen.add('.' + k);
      }
      if (!klassen.size && !modifier.size) continue;
      gesamt++;
      const name = basename(f, '.scss').slice(1);
      const kl = [...klassen].sort().slice(0, 4).join(' ');
      const mo = [...modifier].sort().slice(0, 6).join(' ') || '–';
      md += `| \`${name}\` | \`${kl}\` | ${mo === '–' ? '–' : '`' + mo + '`'} |\n`;
    }
  }
  md += `\n---\n\n${gesamt} Komponenten erfasst.\n`;
  writeFileSync(resolve(ziel, 'references/components.md'), md);
  return gesamt;
}

// ---------------------------------------------------------------------------
// 3. Schriften als base64 (subgesetzt)
// ---------------------------------------------------------------------------

const SCHRIFTEN = [
  ['manrope',        'manrope-var-latin.woff2',        'Manrope',        '200 800'],
  ['spacegrotesk',   'spacegrotesk-var-latin.woff2',   'Space Grotesk',  '300 700'],
  ['jetbrainsmono',  'jetbrainsmono-var-latin.woff2',  'JetBrains Mono', '100 800'],
];

// Latin-1 Kernbereich + deutsche Umlaute + typografische Zeichen. Reicht fuer
// Vergleichs- und Vorschauartefakte; die Variable-Achse bleibt erhalten.
const ZEICHEN = [
  'U+0020-007E', 'U+00A0', 'U+00C4', 'U+00D6', 'U+00DC', 'U+00E4', 'U+00F6',
  'U+00FC', 'U+00DF', 'U+2013', 'U+2014', 'U+2018-201E', 'U+2026', 'U+00B7',
  'U+2192', 'U+00A9', 'U+00AE', 'U+20AC',
].join(',');

function baueSchriften() {
  const raus = resolve(ziel, 'assets/fonts');
  mkdirSync(raus, { recursive: true });
  const bericht = [];
  for (const [slug, datei, familie, gewicht] of SCHRIFTEN) {
    const quelle = resolve(wurzel, 'fonts', datei);
    if (!existsSync(quelle)) { bericht.push(`${familie}: Quelle fehlt`); continue; }
    const tmp = resolve(raus, `.${slug}.subset.woff2`);
    execFileSync('python3', [
      '-m', 'fontTools.subset', quelle,
      `--unicodes=${ZEICHEN}`,
      '--layout-features=kern,liga,calt,tnum',
      '--flavor=woff2', `--output-file=${tmp}`,
    ], { cwd: wurzel });
    const b64 = readFileSync(tmp).toString('base64');
    writeFileSync(resolve(raus, `${slug}.base64.txt`), b64);
    execFileSync('rm', [tmp]);
    bericht.push(`${familie} ${gewicht}: ${(statSync(quelle).size / 1024).toFixed(1)} KB → base64 ${(b64.length / 1024).toFixed(0)} KB`);
  }
  writeFileSync(resolve(raus, 'README.md'), `# Hausschriften als base64

GENERIERT. Subgesetzt auf Latin + deutsche Umlaute + typografische Zeichen,
Variable-Achse (Gewicht) bleibt erhalten.

Artefakte duerfen keine externen Requests stellen — Schriften muessen als
\`data:\`-URI eingebettet werden. Einsatz im Artefakt:

\`\`\`css
@font-face {
  font-family: 'Manrope';
  font-weight: 200 800;
  font-display: swap;
  src: url(data:font/woff2;base64,<INHALT VON manrope.base64.txt>) format('woff2');
}
\`\`\`

NUR einbetten, was das Artefakt wirklich braucht: jede Familie kostet rund
20 KB base64 im Dokument. Fuer Layout-, Farb- und Abstandsvergleiche genuegen
die Systemschriften aus dem Fallback-Stack.

${bericht.map((z) => '- ' + z).join('\n')}
`);
  return bericht;
}

// ---------------------------------------------------------------------------
// 4. artifact-template.html
// ---------------------------------------------------------------------------

function baueTemplate() {
  mkdirSync(resolve(ziel, 'assets'), { recursive: true });
  const html = `<!--
  NEO Design System — Artefakt-Geruest
  GENERIERT von scripts/build-skill-references.js.

  REGELN FUER ARTEFAKTE
  1. Kein <!doctype>, <html>, <head>, <body> — das Geruest wird beim
     Veroeffentlichen darumgelegt. Hier steht nur Seiteninhalt.
  2. Strikte CSP: keine externen Stylesheets, Skripte, Schriften oder Bilder.
     Alles inline oder als data:-URI.
  3. Der Token-Block aus references/tokens.css gehoert INLINE in <style>.
     Nur die Gruppen uebernehmen, die das Artefakt braucht.
  4. Beide Themes bedienen: prefers-color-scheme als Vorgabe UND
     :root[data-theme="..."] als Override, damit der Umschalter greift.
  5. Breite Inhalte (Tabellen, Code) in einen eigenen overflow-x-Container —
     die Seite selbst darf nie waagerecht scrollen.
-->

<style>
  /* ── 1. Schriften (nur einbetten, was gebraucht wird) ───────────────────
     Inhalt von assets/fonts/<familie>.base64.txt einsetzen. Weglassen, wenn
     das Artefakt keine Schriftfrage klaert — dann greift der Fallback-Stack.

  @font-face {
    font-family: 'Manrope';
    font-weight: 200 800;
    font-display: swap;
    src: url(data:font/woff2;base64,HIER) format('woff2');
  }
  */

  /* ── 2. Tokens ──────────────────────────────────────────────────────────
     Aus references/tokens.css hierher kopieren. */
  :root {
    /* --font-body, --font-heading, --font-mono, --fs-*, --fnd-color-* ... */
  }

  /* ── 3. Grundlayout ─────────────────────────────────────────────────── */
  .neo-artefakt {
    font-family: var(--font-body, system-ui, sans-serif);
    font-size: var(--fs-base, 1rem);
    line-height: var(--lh-body, 1.6);
    color: var(--fnd-color-text-primary, #0f1419);
    background: var(--fnd-color-background-base, #fff);
    padding: clamp(1rem, 4vw, 2.5rem);
  }

  .neo-artefakt h1,
  .neo-artefakt h2,
  .neo-artefakt h3 {
    font-family: var(--font-heading, var(--font-body, system-ui));
    letter-spacing: -0.01em;
  }

  .neo-artefakt code,
  .neo-artefakt kbd {
    font-family: var(--font-mono, ui-monospace, monospace);
  }

  /* Breites scrollt in sich, nicht die Seite. */
  .neo-scroll { overflow-x: auto; max-width: 100%; }
  .neo-artefakt img { max-width: 100%; height: auto; }

  /* ── 4. Dark Theme ──────────────────────────────────────────────────── */
  @media (prefers-color-scheme: dark) {
    :root { /* Dark-Block aus tokens.css */ }
  }
  :root[data-theme="dark"] { /* derselbe Block — der Umschalter muss gewinnen */ }
  :root[data-theme="light"] { /* Light-Block, damit auch zurueckgeschaltet wird */ }
</style>

<div class="neo-artefakt">
  <h1>Titel</h1>
  <p>Inhalt.</p>
</div>
`;
  writeFileSync(resolve(ziel, 'assets/artifact-template.html'), html);
}

// ---------------------------------------------------------------------------

mkdirSync(ziel, { recursive: true });
const t = baueTokens();
const k = baueKomponenten();
const s = baueSchriften();
baueTemplate();

console.log('Skill-Referenzen erzeugt in skill/neo-design-system/');
console.log(`  references/tokens.css      ${t.anzahl} Tokens, ${t.dunkel} Dark-Theme-Umschaltungen`);
console.log(`  references/components.md   ${k} Komponenten`);
console.log(`  assets/artifact-template.html`);
s.forEach((z) => console.log(`  assets/fonts/             ${z}`));
