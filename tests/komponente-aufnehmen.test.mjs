// komponente-aufnehmen: ein weiterer Lauf darf nie Aufgenommenes verlieren.
//
// Anlass: Am 12.08.2026 ersetzte der zweite Aufnahme-Lauf fuer hero-tom
// (8b04d29c, „Nachzuegler“) den markierten Abschnitt durch sechs neue Regeln
// und loeschte damit die Grundgestaltung aus 55058ab9. Aufgefallen erst am
// 06.10.2026. Diese Tests laufen das Skript gegen eine Attrappe in einem
// temporaeren Verzeichnis (--wurzel=…), nie gegen das Repo.
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, appendFileSync, rmSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { abschnittLesen, abschnittPlanen, einheiten, zerlege } from '../scripts/aufnahme-abschnitt.mjs';

const hier = dirname(fileURLToPath(import.meta.url));
const SKRIPT = join(hier, '../scripts/komponente-aufnehmen.js');
const FIXTURE_HERO_TOM = join(hier, 'fixtures/komponente-aufnehmen/hero-tom-55058ab9.scss.txt');

let tmp, ds, ov;

function datei(rel, inhalt) {
  const p = join(ds, rel);
  mkdirSync(dirname(p), { recursive: true });
  writeFileSync(p, inhalt);
  return p;
}

function lauf(komponente, ...flags) {
  const r = spawnSync(process.execPath, [SKRIPT, komponente, `--wurzel=${ds}`, ...flags], { encoding: 'utf8' });
  return { status: r.status, aus: r.stdout + r.stderr };
}

const lies = (rel) => readFileSync(join(ds, rel), 'utf8');
const selektoren = (text, marke, modus = 'regeln') =>
  einheiten(zerlege(abschnittLesen(text, marke).inhalt), modus).map((e) => e.schluessel);

/** Alle Dateien, die ein Lauf beschreiben kann — fuer „nichts geschrieben“. */
function schnappschuss() {
  const s = {};
  for (const rel of [
    'scss/scss/07-organisms/_demo.scss', 'scss/scss/07-organisms/_hero-tom.scss',
    'scss/scss/07-organisms/_index.scss', 'scss/scss/00-settings/_index.scss',
    'scss/scss/00-settings/_component-tokens-aufgenommen.scss', 'data/design-tokens.json',
  ]) s[rel] = existsSync(join(ds, rel)) ? lies(rel) : null;
  s.ov = readFileSync(ov, 'utf8');
  return s;
}

beforeEach(() => {
  tmp = mkdtempSync(join(tmpdir(), 'aufnehmen-'));
  ds = join(tmp, 'ds');
  ov = join(tmp, 'DRUPAL11/web/themes/custom/neo_fe/css/neo-overrides.css');
  mkdirSync(dirname(ov), { recursive: true });
  datei('styles.css', ':root{--fnd-spacing-02:8px;--fnd-spacing-04:16px;--fnd-radius-full:9999px;--fnd-color-text-primary:#000000}');
  datei('scss/scss/07-organisms/_index.scss', "@forward 'footer';\n");
  datei('scss/scss/00-settings/_index.scss', "@forward 'component-tokens';\n");
  datei('data/design-tokens.json', JSON.stringify({ components: { groups: [] } }, null, 2) + '\n');
  datei('data/markup/demo.html', '<div class="nc-demo"></div>\n');
  datei('data/markup/hero-tom.html', '<section class="nc-hero-tom"></section>\n');
});

afterEach(() => rmSync(tmp, { recursive: true, force: true }));

const ERSTER_LAUF = `
.nc-demo { color: #ff0000; padding: 16px; }
.nc-demo__titel { display: block; }
@media (max-width: 768px) { .nc-demo__titel { display: none; } }
`;

describe('komponente-aufnehmen: Abschnitte ergaenzen statt ersetzen', () => {
  it('(1) erster Lauf schreibt Abschnitt, Tokens und Konfig-Eintrag', () => {
    writeFileSync(ov, ERSTER_LAUF);
    const r = lauf('nc-demo', '--anwenden');
    expect(r.status, r.aus).toBe(0);

    const scss = lies('scss/scss/07-organisms/_demo.scss');
    expect(selektoren(scss, 'demo')).toEqual([
      '.nc-demo', '.nc-demo__titel', '@media (max-width: 768px) » .nc-demo__titel',
    ]);
    const tok = lies('scss/scss/00-settings/_component-tokens-aufgenommen.scss');
    expect(selektoren(tok, 'demo', 'deklarationen')).toEqual([':root » --nc-demo-root-color', ':root » --nc-demo-root-padding']);
    const gruppe = JSON.parse(lies('data/design-tokens.json')).components.groups.find((g) => g.id === 'demo');
    expect(gruppe.subgroups[0].tokenIds).toEqual(['nc-demo-root-color', 'nc-demo-root-padding']);
    expect(readFileSync(ov, 'utf8')).not.toMatch(/\.nc-demo[\s_{]/);
  });

  it('(2) zweiter Lauf mit Nachzueglern ergaenzt und behaelt alles', () => {
    writeFileSync(ov, ERSTER_LAUF);
    expect(lauf('nc-demo', '--anwenden').status).toBe(0);
    // Hand-gepflegte Untergruppe im Konfigurator — darf nicht verschwinden.
    const j = JSON.parse(lies('data/design-tokens.json'));
    j.components.groups[0].subgroups.push({ id: 'geometry', label: 'Geometrie', tokenIds: ['nc-demo-max'] });
    writeFileSync(join(ds, 'data/design-tokens.json'), JSON.stringify(j, null, 2) + '\n');

    appendFileSync(ov, '\n.nc-demo--weit .nc-demo__titel { max-inline-size: var(--container-wide); }\n.nc-demo__fuss { gap: 8px; }\n');
    const r = lauf('nc-demo', '--anwenden');
    expect(r.status, r.aus).toBe(0);

    expect(selektoren(lies('scss/scss/07-organisms/_demo.scss'), 'demo')).toEqual([
      '.nc-demo', '.nc-demo__titel', '@media (max-width: 768px) » .nc-demo__titel',
      '.nc-demo--weit .nc-demo__titel', '.nc-demo__fuss',
    ]);
    expect(selektoren(lies('scss/scss/00-settings/_component-tokens-aufgenommen.scss'), 'demo', 'deklarationen')).toEqual([
      ':root » --nc-demo-root-color', ':root » --nc-demo-root-padding', ':root » --nc-demo-fuss-gap',
    ]);
    const g = JSON.parse(lies('data/design-tokens.json')).components.groups.find((x) => x.id === 'demo');
    expect(g.subgroups.map((s) => s.id)).toEqual(['alle', 'geometry']);
    expect(g.subgroups[0].tokenIds).toEqual(['nc-demo-root-color', 'nc-demo-root-padding', 'nc-demo-fuss-gap']);
  });

  it('(3) gleicher Selektor, gleicher Inhalt: keine Dublette', () => {
    writeFileSync(ov, ERSTER_LAUF);
    expect(lauf('nc-demo', '--anwenden').status).toBe(0);
    const vorher = schnappschuss();
    // Dieselben Regeln tauchen im Theme erneut auf (z. B. zurueckgespielt).
    writeFileSync(ov, `/* x */\n.nc-demo__titel {\n  display:   block;\n}\n@media (max-width:768px){.nc-demo__titel{display:none}}\n`);
    const r = lauf('nc-demo', '--anwenden');
    expect(r.status, r.aus).toBe(0);
    const scss = lies('scss/scss/07-organisms/_demo.scss');
    expect(scss).toBe(vorher['scss/scss/07-organisms/_demo.scss']);
    expect(selektoren(scss, 'demo').filter((s) => s === '.nc-demo__titel')).toHaveLength(1);
  });

  it('(4) gleicher Selektor, anderer Inhalt: Abbruch ohne Schreiben', () => {
    writeFileSync(ov, ERSTER_LAUF);
    expect(lauf('nc-demo', '--anwenden').status).toBe(0);
    writeFileSync(ov, '.nc-demo__titel { display: flex; }\n.nc-demo__neu { display: grid; }\n');
    const vorher = schnappschuss();
    const r = lauf('nc-demo', '--anwenden');
    expect(r.status).toBe(1);
    expect(r.aus).toMatch(/KONFLIKT \.nc-demo__titel/);
    expect(r.aus).toMatch(/ABBRUCH — nichts geschrieben/);
    expect(schnappschuss()).toEqual(vorher);
  });

  it('(4b) Token mit anderem Wert ist ebenfalls ein Konflikt', () => {
    writeFileSync(ov, ERSTER_LAUF);
    expect(lauf('nc-demo', '--anwenden').status).toBe(0);
    // SCSS-Regel bleibt gleich (var(--nc-demo-root-padding)), nur der Token-Wert weicht ab.
    writeFileSync(ov, '.nc-demo { color: #ff0000; padding: 23px; }\n');
    const vorher = schnappschuss();
    const r = lauf('nc-demo', '--anwenden');
    expect(r.status).toBe(1);
    expect(r.aus).toMatch(/KONFLIKT :root » --nc-demo-root-padding/);
    expect(schnappschuss()).toEqual(vorher);
  });

  it('(5) --ersetzen ersetzt den Abschnitt ausdruecklich', () => {
    writeFileSync(ov, ERSTER_LAUF);
    expect(lauf('nc-demo', '--anwenden').status).toBe(0);
    writeFileSync(ov, '.nc-demo__titel { display: flex; }\n');
    const r = lauf('nc-demo', '--anwenden', '--ersetzen');
    expect(r.status, r.aus).toBe(0);
    expect(r.aus).toMatch(/- \.nc-demo {3}\(entfaellt durch --ersetzen\)/);
    expect(selektoren(lies('scss/scss/07-organisms/_demo.scss'), 'demo')).toEqual(['.nc-demo__titel']);
    expect(lies('scss/scss/07-organisms/_demo.scss')).toMatch(/display: flex/);
  });

  it('Trockenlauf zeigt, was ergaenzt wuerde, und schreibt nichts', () => {
    writeFileSync(ov, ERSTER_LAUF);
    expect(lauf('nc-demo', '--anwenden').status).toBe(0);
    writeFileSync(ov, '.nc-demo__fuss { gap: 8px; }\n.nc-demo__titel { display: block; }\n');
    const vorher = schnappschuss();
    const r = lauf('nc-demo');
    expect(r.status, r.aus).toBe(0);
    expect(r.aus).toMatch(/TROCKENLAUF/);
    expect(r.aus).toMatch(/_demo\.scss: Abschnitt ergaenzt — 1 neu, 1 schon vorhanden/);
    expect(r.aus).toMatch(/\+ \.nc-demo__fuss/);
    expect(r.aus).toMatch(/\+ :root » --nc-demo-fuss-gap/);
    expect(schnappschuss()).toEqual(vorher);
  });

  it('(6) hero-tom wie am 12.08.2026: Stand 55058ab9 + Nachzuegler aus 8b04d29c → alle Regeln bleiben', () => {
    const stand = readFileSync(FIXTURE_HERO_TOM, 'utf8');
    datei('scss/scss/07-organisms/_hero-tom.scss', stand);
    const vorher = selektoren(stand, 'hero-tom');
    expect(vorher).toHaveLength(17);

    // Die sechs Nachzuegler, wie sie 8b04d29c aus neo-overrides.css holte.
    const NACHZUEGLER = ['prose', 'narrow', 'content', 'wide', 'xwide', 'full'].map((w) =>
      `.nc-hero-tom--cw-${w} .nc-hero-tom__content,\n.nc-hero-tmob--cw-${w} .nc-hero-tmob__content {\n  max-inline-size: var(--container-${w});\n  margin-inline: auto;\n}`).join('\n');
    writeFileSync(ov, NACHZUEGLER + '\n');

    const r = lauf('nc-hero-tom', '--anwenden');
    expect(r.status, r.aus).toBe(0);
    const nachher = selektoren(lies('scss/scss/07-organisms/_hero-tom.scss'), 'hero-tom');
    expect(nachher).toHaveLength(23);
    for (const s of vorher) expect(nachher).toContain(s);
    expect(nachher).toContain('.nc-hero-tom--cw-prose .nc-hero-tom__content,.nc-hero-tmob--cw-prose .nc-hero-tmob__content');
    // Der alte Weg (ersetzen) haette genau die 17 verloren.
    const alt = abschnittPlanen({ text: stand, marke: 'hero-tom', neu: NACHZUEGLER, ersetzen: true });
    expect(alt.verloren).toHaveLength(17);
  });
});

describe('aufnahme-abschnitt: Schutzpruefung und Grenzfaelle', () => {
  it('doppelte Marker brechen ab statt zu raten', () => {
    const t = '/* >>> aufgenommen: x */\n.a{b:c}\n/* <<< aufgenommen: x */\n/* >>> aufgenommen: x */\n/* <<< aufgenommen: x */\n';
    expect(() => abschnittPlanen({ text: t, marke: 'x', neu: '.d{e:f}' })).toThrow(/mehrfach/);
  });

  it('abweichende Regel AUSSERHALB der Marker ist ein Konflikt, gleiche wird nicht gedoppelt', () => {
    const t = '.nc-a { color: red; }\n.nc-a__b { color: blue; }\n\n/* >>> aufgenommen: a */\n.nc-a__c { gap: 0; }\n/* <<< aufgenommen: a */\n';
    const p = abschnittPlanen({ text: t, marke: 'a', neu: '.nc-a { color: red; }\n\n.nc-a__b { color: green; }' });
    expect(p.vorhanden).toEqual(['.nc-a']);
    expect(p.konflikte.map((k) => [k.schluessel, k.ort])).toEqual([['.nc-a__b', 'datei']]);
  });

  it('unausgeglichene Klammern im Abschnitt: Fehler statt stillem Verlust', () => {
    const t = '/* >>> aufgenommen: a */\n.nc-a { color: red;\n/* <<< aufgenommen: a */\n';
    expect(() => abschnittPlanen({ text: t, marke: 'a', neu: '.nc-a__b{x:y}' })).toThrow(/Klammer/);
  });
});
