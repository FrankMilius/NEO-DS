/**
 * @file
 * Prueft die Skill-Ebene: Ist alles versioniert, geladen und benannt?
 *
 *   npm run skills
 *   npm run skills -- --streng     Rueckgabecode 1 auch bei Warnungen
 *
 * WARUM ES DIESE PRUEFUNG GIBT
 * Am 18.08.2026 stellte sich heraus: `.claude/` war vollstaendig
 * gitignoriert. Vierzehn Skills, mehrere Regelwerke und drei frisch gebaute
 * Agenten-Rollen lagen ausschliesslich auf EINER Maschine — unversioniert,
 * fuer niemanden sonst sichtbar, bei Plattenschaden weg.
 *
 * Der Fehler war doppelt getarnt: `git status` meldete „clean" und
 * `git commit` sagte „nothing to commit". Beides klingt nach Erfolg. Erst die
 * Abfrage des REMOTE-Stands zeigte es:
 *
 *   git show origin/main:.claude/skills/atomic-design/SKILL.md
 *   fatal: path exists on disk, but not in 'origin/main'
 *
 * Diese Pruefung stellt dieselbe Frage automatisch — fuer jede Datei, bei
 * jedem Lauf, damit ein neuer Skill nicht wieder still liegenbleibt.
 *
 * SIE PRUEFT DREI DINGE
 *   1  Versioniert   kennt git die Datei ueberhaupt?
 *   2  Ladbar        liegt sie als <name>/SKILL.md, nicht als loses <name>.md?
 *   3  Auffindbar    hat sie Frontmatter mit name und description?
 *
 * Der zweite Punkt ist der unauffaelligste und war hier zweimal die Ursache:
 * `.claude/skills/commit.md` trug 42 gute Zeilen, wurde aber nicht geladen —
 * geladen wurde ein Sechs-Zeiler aus `commit/SKILL.md`.
 */

import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const wurzel = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const streng = process.argv.includes('--streng');
const BASIS = resolve(wurzel, '.claude');

const gitDateien = new Set(
  execFileSync('git', ['-C', wurzel, 'ls-files', '.claude'], { encoding: 'utf8' })
    .split('\n').filter(Boolean),
);

const befunde = [];
const gut = [];

/** Frontmatter lesen. Ohne name und description findet Claude Code einen
 *  Skill nur, wenn jemand ihn ausdruecklich beim Namen ruft — die
 *  Beschreibung ist das, woran er sich selbst meldet. */
function frontmatter(pfad) {
  const t = readFileSync(pfad, 'utf8');
  if (!t.startsWith('---')) return null;
  const ende = t.indexOf('\n---', 3);
  if (ende < 0) return null;
  const kopf = t.slice(3, ende);
  const holen = (feld) => (new RegExp(`^${feld}:\\s*(.+)$`, 'm').exec(kopf) || [])[1];
  return { name: holen('name'), description: holen('description') };
}

function pruefen(bereich, unterordner) {
  const dir = resolve(BASIS, unterordner);
  if (!existsSync(dir)) return;

  for (const eintrag of readdirSync(dir)) {
    const p = resolve(dir, eintrag);
    const istOrdner = statSync(p).isDirectory();

    // -- Lose .md-Dateien im Skill-Verzeichnis ------------------------------
    if (!istOrdner) {
      if (!eintrag.endsWith('.md')) continue;
      const name = eintrag.slice(0, -3);
      const alsOrdner = existsSync(resolve(dir, name, 'SKILL.md'));
      befunde.push({
        art: 'nicht ladbar',
        datei: `${unterordner}/${eintrag}`,
        text: alsOrdner
          ? `Es gibt AUSSERDEM ${name}/SKILL.md — geladen wird die im Ordner, diese Datei ist tot.`
          : `Als loses ${eintrag} wird sie nicht geladen. Nach ${name}/SKILL.md verschieben.`,
      });
      continue;
    }

    // -- Ordner: SKILL.md erwartet -----------------------------------------
    const skill = resolve(p, 'SKILL.md');
    const rel = `.claude/${unterordner}/${eintrag}/SKILL.md`;
    if (!existsSync(skill)) {
      // Reine Beiwerk-Ordner (references o.ae.) sind in Ordnung.
      const mds = readdirSync(p).filter((f) => f.endsWith('.md'));
      if (mds.length) {
        befunde.push({
          art: 'ohne SKILL.md', datei: `${unterordner}/${eintrag}`,
          text: `${mds.length} Markdown-Datei(en), aber keine SKILL.md — wird nicht als Skill geladen.`,
        });
      }
      continue;
    }

    const fm = frontmatter(skill);
    const versioniert = gitDateien.has(rel);
    const zeilen = readFileSync(skill, 'utf8').split('\n').length;

    if (!versioniert) {
      befunde.push({ art: 'unversioniert', datei: rel, text: 'Liegt nur auf dieser Maschine. git kennt sie nicht.' });
    }
    if (!fm) {
      befunde.push({ art: 'ohne Frontmatter', datei: rel, text: 'Ohne name und description meldet sich der Skill nicht von selbst.' });
    } else if (!fm.name || !fm.description) {
      befunde.push({ art: 'Frontmatter unvollstaendig', datei: rel, text: `name: ${fm.name || 'FEHLT'}, description: ${fm.description ? 'da' : 'FEHLT'}` });
    } else if (fm.name !== eintrag) {
      befunde.push({ art: 'Name weicht ab', datei: rel, text: `Frontmatter sagt "${fm.name}", der Ordner heisst "${eintrag}".` });
    }

    if (versioniert && fm?.name && fm?.description) {
      gut.push({ name: eintrag, bereich, zeilen });
    }
  }
}

// Agenten liegen flach, nicht in Ordnern.
function agentenPruefen() {
  const dir = resolve(BASIS, 'agents');
  if (!existsSync(dir)) return;
  for (const f of readdirSync(dir)) {
    if (!f.endsWith('.md')) continue;
    const rel = `.claude/agents/${f}`;
    const fm = frontmatter(resolve(dir, f));
    if (!gitDateien.has(rel)) befunde.push({ art: 'unversioniert', datei: rel, text: 'Liegt nur auf dieser Maschine.' });
    if (!fm?.name || !fm?.description) befunde.push({ art: 'Frontmatter unvollstaendig', datei: rel, text: 'name und description sind Pflicht.' });
    else gut.push({ name: fm.name, bereich: 'Agent', zeilen: readFileSync(resolve(dir, f), 'utf8').split('\n').length });
  }
}

function regelnPruefen() {
  const dir = resolve(BASIS, 'rules');
  if (!existsSync(dir)) return;
  for (const f of readdirSync(dir)) {
    if (!f.endsWith('.md')) continue;
    const rel = `.claude/rules/${f}`;
    if (!gitDateien.has(rel)) befunde.push({ art: 'unversioniert', datei: rel, text: 'Liegt nur auf dieser Maschine.' });
    else gut.push({ name: f.slice(0, -3), bereich: 'Regel', zeilen: readFileSync(resolve(dir, f), 'utf8').split('\n').length });
  }
}

pruefen('Skill', 'skills');
agentenPruefen();
regelnPruefen();

// ---------------------------------------------------------------------------

console.log(`\nSKILL-EBENE`);
console.log('─'.repeat(76));
const nachBereich = gut.reduce((m, g) => ((m[g.bereich] = (m[g.bereich] || 0) + 1), m), {});
console.log(`  ${Object.entries(nachBereich).map(([b, n]) => `${n} ${b}${n === 1 ? '' : b === 'Regel' ? 'n' : 's'}`).join(', ') || 'nichts gefunden'} — versioniert und vollstaendig`);

const schwer = befunde.filter((b) => b.art === 'unversioniert');
const rest = befunde.filter((b) => b.art !== 'unversioniert');

if (schwer.length) {
  console.log(`\n  UNVERSIONIERT — ${schwer.length} Datei(en) liegen nur hier:\n`);
  for (const b of schwer) console.log(`    ${b.datei}`);
  console.log(`\n  Pruefen, ob .gitignore sie ausschliesst:  git check-ignore -v <datei>`);
}

if (rest.length) {
  console.log(`\n  ${rest.length} weitere(r) Befund(e):\n`);
  for (const b of rest) {
    console.log(`    ${b.art.toUpperCase().padEnd(28)}${b.datei}`);
    console.log(`    ${''.padEnd(28)}${b.text}`);
  }
}

console.log('\n' + '─'.repeat(76));
if (!befunde.length) console.log('  Alles versioniert, ladbar und benannt.');
else if (schwer.length) console.log('  Unversionierte Dateien sind der ernste Fall: Sie sind bei einem');
else console.log('  Keine unversionierten Dateien. Die uebrigen Befunde kosten Wirkung,');
if (schwer.length) console.log('  Rechnerwechsel weg und fuer niemanden sonst sichtbar.');
else if (befunde.length) console.log('  nicht Bestand — ein nicht geladener Skill tut einfach nichts.');
console.log('');

process.exit(schwer.length || (streng && befunde.length) ? 1 : 0);
