/**
 * @file
 * Sammelt die Rohdaten der Arbeitsbilanz. Rechnet, erzaehlt nicht.
 *
 * Getrennt von der Ausgabe (bilanz-html.js), damit die Zahlen pruefbar
 * bleiben: `node scripts/bilanz-daten.js --json` gibt alles roh aus.
 *
 * DREI QUELLEN
 *   git       was getan wurde        — vollstaendig, nachpruefbar
 *   Transkripte  was es gekostet hat — Token je Sitzung, mit Modell
 *   Bestand   was daraus geworden ist — Zaehlungen und Pruefwerkzeuge
 *
 * WARUM NICHT EIN SPRACHMODELL DEN BERICHT SCHREIBT
 * Ein erzaehlter Bericht ist jede Woche anders formuliert und damit ueber
 * Wochen nicht vergleichbar. Er kostet ausserdem genau das, was er messen
 * soll. Diese Bilanz ist deterministisch: gleiche Woche, gleiche Zahlen.
 */

import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gunzipSync } from 'node:zlib';

const wurzel = resolve(dirname(fileURLToPath(import.meta.url)), '..');

export const REPOS = [
  { name: 'Design System', pfad: wurzel },
  { name: 'Theme', pfad: '/Users/frank.milius/Sites/DRUPAL11/web/themes/custom/neo_fe' },
  { name: 'Site', pfad: '/Users/frank.milius/Sites/DRUPAL11' },
];

// ---------------------------------------------------------------------------
// Domaenen — der Reportinggegenstand
// ---------------------------------------------------------------------------
// Reihenfolge entscheidet: die erste zutreffende Regel gewinnt. Deshalb steht
// das Besondere oben und das Allgemeine unten. `.claude/**/*.md` ist Skill,
// nicht Dokumentation; `scripts/*.js` ist Messstand, nicht Design System.

export const DOMAENEN = [
  {
    id: 'skills', name: 'Agenten & Skills',
    was: 'Wie ich arbeite — Skills, Agentenrollen, Regelwerke.',
    test: (p) => p.startsWith('.claude/') || p.startsWith('skill/'),
  },
  {
    id: 'messstand', name: 'Messstände & Werkzeuge',
    was: 'Womit Behauptungen belegt werden — Prüfskripte und Referenzstände.',
    test: (p) => p.startsWith('scripts/') || p.startsWith('data/baseline/'),
  },
  {
    id: 'storybook', name: 'Storybook',
    was: 'Die begehbare Bauteilbibliothek.',
    test: (p) => p.startsWith('stories/') || p.startsWith('.storybook/'),
  },
  {
    id: 'konfig', name: 'Konfig-App',
    was: 'Womit ein Kundendesign eingestellt wird, ohne Code anzufassen.',
    // config/theme-configurator/ ist die GEBAUTE App. Ohne diese Zeile landen
    // ihre ~300 Dateien in "Sonstiges" und verzerren jede Verteilung.
    // *Arena-<hash>.js sind Build-Ausgaben der Konfig-App, die im
    // Wurzelverzeichnis gelandet sind. Sie gehoeren dort nicht hin (siehe
    // Befund "verirrte Build-Artefakte"), zaehlen aber zur Konfig-App.
    test: (p) => p.startsWith('apps/') || p.startsWith('config/theme-config')
      || /(^|\/)design-tokens\.(json|css)$/.test(p)
      || /^[A-Z][A-Za-z]*Arena-[A-Za-z0-9_-]{8}\.js$/.test(p),
  },
  {
    id: 'ds', name: 'Design System',
    was: 'Die Quelle der Wahrheit — SCSS, Token, ITCSS-Ebenen.',
    test: (p) => p.startsWith('scss/') || p.startsWith('components/'),
  },
  {
    id: 'doku', name: 'Dokumentation',
    was: 'Recipes und begründende Texte.',
    test: (p) => p.endsWith('.md') || p.startsWith('docs/') || /data\/.*-recipe\.json$/.test(p),
  },
  {
    id: 'theme', name: 'Theme',
    was: 'Was die Website davon tatsächlich zeigt — Twig, JS, Theme-CSS.',
    test: (p, repo) => repo === 'Theme',
  },
  {
    id: 'site', name: 'Drupal-Site',
    was: 'Konfiguration, Blocktypen, Abhängigkeiten.',
    test: (p, repo) => repo === 'Site',
  },
  {
    id: 'sonst', name: 'Projektgerüst',
    was: 'Build, Abhängigkeiten, Ignorierlisten — trägt kein Interface.',
    test: () => true,
  },
];

export function domaeneFuer(pfad, repo) {
  return DOMAENEN.find((d) => d.test(pfad, repo)) || DOMAENEN[DOMAENEN.length - 1];
}

// ---------------------------------------------------------------------------
// Hilfsmittel
// ---------------------------------------------------------------------------

function git(pfad, args) {
  try {
    return execFileSync('git', ['-C', pfad, ...args], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  } catch {
    return '';
  }
}

/** Ein Werkzeug laufen lassen, ohne dass sein Scheitern die Bilanz kippt.
 *  Ein nicht ermittelbarer Wert ist ein Befund, kein Absturz. */
function werkzeug(befehl, args) {
  try {
    return { ok: true, text: execFileSync(befehl, args, { encoding: 'utf8', cwd: wurzel, timeout: 180000, stdio: ['ignore', 'pipe', 'pipe'] }) };
  } catch (e) {
    return { ok: false, text: (e.stdout || '') + (e.stderr || ''), fehler: e.message };
  }
}

const tag = (d) => d.toISOString().slice(0, 10);

// ---------------------------------------------------------------------------
// 1 · Git — was getan wurde
// ---------------------------------------------------------------------------

export function aktivitaet(von, bis) {
  const commits = [];

  for (const repo of REPOS) {
    if (!existsSync(resolve(repo.pfad, '.git'))) continue;
    const roh = git(repo.pfad, [
      'log', `--since=${von}`, `--until=${bis}`, '--no-merges',
      '--numstat', '--date=iso-strict',
      '--pretty=format:%x00%H%x1f%ad%x1f%an%x1f%s%x1f%b%x1e',
    ]);
    if (!roh.trim()) continue;

    for (const block of roh.split('\x00').slice(1)) {
      const [kopf, dateienRoh = ''] = block.split('\x1e');
      const [hash, datum, autor, betreff, rumpf] = kopf.split('\x1f');
      const dateien = [];
      for (const z of dateienRoh.split('\n')) {
        const m = /^(\d+|-)\t(\d+|-)\t(.+)$/.exec(z.trim());
        if (!m) continue;
        const pfad = m[3].includes('=>') ? m[3].replace(/.*\{.*=> (.*)\}/, '$1') : m[3];
        dateien.push({
          pfad,
          plus: m[1] === '-' ? 0 : +m[1],
          minus: m[2] === '-' ? 0 : +m[2],
          binaer: m[1] === '-',
          domaene: domaeneFuer(pfad, repo.name).id,
        });
      }
      commits.push({
        repo: repo.name, hash: hash.slice(0, 7), datum, autor,
        betreff, rumpf: (rumpf || '').trim(), dateien,
      });
    }
  }

  commits.sort((a, b) => (a.datum < b.datum ? 1 : -1));
  return commits;
}

// ---------------------------------------------------------------------------
// 2 · Transkripte — was es gekostet hat
// ---------------------------------------------------------------------------
// Kosten entstehen je Sitzung, Arbeit faellt je Domaene an. Die Bruecke ist
// eine SCHAETZUNG: Der Betrag einer Sitzung wird auf die Domaenen verteilt,
// die sie angefasst hat — gewichtet nach der Zahl der Beruehrungen.
//
// Das ist ehrlich genug fuer eine Groessenordnung und falsch genug, dass man
// es nicht auf zwei Nachkommastellen lesen darf. Die Bilanz sagt das dazu.

export function preise() {
  const p = JSON.parse(readFileSync(resolve(wurzel, 'data/claude-preise.json'), 'utf8'));
  return p;
}

function kostenFuer(u, modell, tarife) {
  const t = tarife.modelle[modell] || tarife.modelle._unbekannt;
  const M = 1e6;
  return (
    ((u.input_tokens || 0) * t.input +
      (u.output_tokens || 0) * t.output +
      (u.cache_creation_input_tokens || 0) * t.cache_write +
      (u.cache_read_input_tokens || 0) * t.cache_read) / M
  );
}

export function nutzung(von, bis) {
  const tarife = preise();
  const basis = resolve(process.env.HOME, '.claude/projects');
  const sitzungen = [];
  if (!existsSync(basis)) return { sitzungen, tarife };

  for (const projekt of readdirSync(basis)) {
    const dir = resolve(basis, projekt);
    if (!statSync(dir).isDirectory()) continue;

    for (const datei of readdirSync(dir).filter((f) => f.endsWith('.jsonl'))) {
      const s = {
        projekt, datei: datei.replace('.jsonl', ''),
        von: null, bis: null, modelle: {},
        input: 0, output: 0, cacheWrite: 0, cacheRead: 0,
        kosten: 0, nachrichten: 0, werkzeuge: 0,
        pfade: {},
      };

      let inhalt;
      try { inhalt = readFileSync(resolve(dir, datei), 'utf8'); } catch { continue; }

      // Dasselbe Modellergebnis steht mehrfach im Transkript — je Inhaltsblock
      // eine Zeile, mit IDENTISCHEM usage-Block und identischer message.id.
      // Ungefiltert zaehlt eine Antwort bis zu achtmal: In der Sitzung vom
      // 18.08.2026 waren 4260 von 7511 Eintraegen Dubletten und blaehten die
      // Kosten um 2,2 Mrd Cache-Token auf — rund die Haelfte zu viel.
      const gezaehlt = new Set();

      for (const zeile of inhalt.split('\n')) {
        if (!zeile) continue;
        let d;
        try { d = JSON.parse(zeile); } catch { continue; }

        const zeit = d.timestamp;
        if (zeit) {
          if (!s.von || zeit < s.von) s.von = zeit;
          if (!s.bis || zeit > s.bis) s.bis = zeit;
        }

        const m = d.message;
        if (!m || typeof m !== 'object') continue;

        if (m.usage && !gezaehlt.has(m.id || Symbol())) {
          if (m.id) gezaehlt.add(m.id);
          const u = m.usage;
          const modell = m.model || '_unbekannt';
          s.modelle[modell] = (s.modelle[modell] || 0) + 1;
          s.input += u.input_tokens || 0;
          s.output += u.output_tokens || 0;
          s.cacheWrite += u.cache_creation_input_tokens || 0;
          s.cacheRead += u.cache_read_input_tokens || 0;
          s.kosten += kostenFuer(u, modell, tarife);
          s.nachrichten += 1;
        }

        if (Array.isArray(m.content)) {
          for (const c of m.content) {
            if (c && c.type === 'tool_use') {
              s.werkzeuge += 1;
              const p = c.input && (c.input.file_path || c.input.notebook_path);
              if (p) s.pfade[p] = (s.pfade[p] || 0) + 1;
            }
          }
        }
      }

      if (!s.bis) continue;
      const t = s.bis.slice(0, 10);
      if (t < von || t > bis) continue;
      sitzungen.push(s);
    }
  }

  sitzungen.sort((a, b) => (a.bis < b.bis ? 1 : -1));
  return { sitzungen, tarife };
}

/** Kosten je Domaene. Zwei Signale, absichtlich kombiniert:
 *  1. Dateipfade aus Werkzeugaufrufen der Sitzung (genau, aber lueckenhaft —
 *     der meiste Weg laeuft ueber Bash und hinterlaesst keinen Pfad)
 *  2. Commits im Zeitfenster der Sitzung (vollstaendig, aber unscharf)
 *  Faellt beides aus, gilt die Sitzung als nicht zuordenbar. */
export function kostenJeDomaene(sitzungen, commits) {
  const summe = {};
  let unzuordenbar = 0;

  for (const s of sitzungen) {
    const gewicht = {};

    for (const [p, n] of Object.entries(s.pfade)) {
      const rel = p.replace(/^.*?\/Sites\/(WEBSITE26|DRUPAL11)\//, '');
      const repo = p.includes('/neo_fe/') ? 'Theme' : p.includes('/DRUPAL11/') ? 'Site' : 'Design System';
      const d = domaeneFuer(rel.replace(/^web\/themes\/custom\/neo_fe\//, ''), repo).id;
      gewicht[d] = (gewicht[d] || 0) + n;
    }

    if (s.von && s.bis) {
      for (const c of commits) {
        if (c.datum >= s.von && c.datum <= s.bis) {
          for (const f of c.dateien) gewicht[f.domaene] = (gewicht[f.domaene] || 0) + 1;
        }
      }
    }

    const gesamt = Object.values(gewicht).reduce((a, b) => a + b, 0);
    if (!gesamt) { unzuordenbar += s.kosten; continue; }
    for (const [d, g] of Object.entries(gewicht)) {
      summe[d] = (summe[d] || 0) + (s.kosten * g) / gesamt;
    }
  }

  return { summe, unzuordenbar };
}

// ---------------------------------------------------------------------------
// 3 · Bestand — was daraus geworden ist
// ---------------------------------------------------------------------------

const zaehle = (glob) => { try { return glob(); } catch { return null; } };

function dateienUnter(dir, filter) {
  const out = [];
  const gehe = (d) => {
    let e; try { e = readdirSync(d, { withFileTypes: true }); } catch { return; }
    for (const x of e) {
      if (x.name === 'node_modules' || x.name.startsWith('.')) continue;
      const p = resolve(d, x.name);
      if (x.isDirectory()) gehe(p); else if (filter(x.name, p)) out.push(p);
    }
  };
  gehe(dir);
  return out;
}

export function bestand() {
  const T = REPOS[1].pfad;
  const S = REPOS[2].pfad;

  const komponenten = dateienUnter(resolve(wurzel, 'scss/scss'), (n, p) =>
    n.startsWith('_') && n.endsWith('.scss') && n !== '_index.scss' && /0[5-9]-/.test(p));
  const recipes = zaehle(() => readdirSync(resolve(wurzel, 'data')).filter((f) => f.endsWith('-recipe.json')));
  const stories = dateienUnter(resolve(wurzel, 'stories'), (n) => n.endsWith('.stories.js'));
  const vue = dateienUnter(resolve(wurzel, 'apps/theme-configurator/src'), (n) => n.endsWith('.vue'));

  let konfigGruppen = null;
  try { konfigGruppen = JSON.parse(readFileSync(resolve(wurzel, 'data/design-tokens.json'), 'utf8')).components.groups.length; } catch { /* egal */ }

  const namen = (l) => new Set(l.map((p) => p.split('/').pop().replace(/^_/, '').replace(/\.stories\.js$|\.scss$/, '')));
  const kNamen = namen(komponenten);
  const sNamen = namen(stories);
  const rNamen = new Set((recipes || []).map((f) => f.replace('-recipe.json', '')));

  // Ebenenverteilung des Design Systems
  const ebenen = {};
  for (const p of komponenten) {
    const m = /\/(\d\d-[a-z]+)\//.exec(p);
    if (m) ebenen[m[1]] = (ebenen[m[1]] || 0) + 1;
  }

  return {
    ds: {
      komponenten: komponenten.length,
      ebenen,
      ohneRecipe: [...kNamen].filter((n) => !rNamen.has(n)).length,
      ohneStory: [...kNamen].filter((n) => !sNamen.has(n)).length,
    },
    konfig: { gruppen: konfigGruppen, vueKomponenten: vue.length },
    storybook: { stories: stories.length },
    doku: {
      recipes: (recipes || []).length,
      markdown: dateienUnter(wurzel, (n, p) => n.endsWith('.md') && !p.includes('/node_modules/') && !p.includes('/.claude/')).length,
    },
    messstand: {
      skripte: zaehle(() => readdirSync(resolve(wurzel, 'scripts')).filter((f) => f.endsWith('.js')).length),
      referenzstaende: zaehle(() => readdirSync(resolve(wurzel, 'data/baseline')).filter((f) => f.endsWith('.json.gz')).length),
    },
    theme: {
      templates: dateienUnter(resolve(T, 'templates'), (n) => n.endsWith('.twig')).length,
      js: dateienUnter(resolve(T, 'js'), (n) => n.endsWith('.js')).length,
      css: dateienUnter(resolve(T, 'css'), (n) => n.endsWith('.css')).length,
    },
    site: {
      configExporte: zaehle(() => readdirSync(resolve(S, 'config/sync')).filter((f) => f.endsWith('.yml')).length),
    },
    skills: {
      skills: zaehle(() => readdirSync(resolve(wurzel, '.claude/skills'), { withFileTypes: true })
        .filter((d) => d.isDirectory() && existsSync(resolve(wurzel, '.claude/skills', d.name, 'SKILL.md'))).length),
      agenten: zaehle(() => readdirSync(resolve(wurzel, '.claude/agents')).filter((f) => f.endsWith('.md')).length),
      regeln: zaehle(() => readdirSync(resolve(wurzel, '.claude/rules')).filter((f) => f.endsWith('.md')).length),
    },
  };
}

// ---------------------------------------------------------------------------
// 4 · Befunde — was offen ist
// ---------------------------------------------------------------------------

export function befunde() {
  const out = [];

  const risiko = werkzeug('npm', ['run', '--silent', 'risiko', '--', '--ds']);
  const doppel = (risiko.text.match(/^\s{4}\S+\s+0\d-\w+ \+ 0\d-\w+/gm) || []).length;
  out.push({
    id: 'doppelungen', domaene: 'ds', titel: 'Wurzelklassen auf zwei Ebenen',
    wert: risiko.ok || risiko.text ? doppel : null,
    gut: doppel === 0,
    text: doppel === 0 ? 'Jede Wurzelklasse wird auf genau einer Ebene geführt.'
      : `${doppel} Klasse(n) doppelt geführt. Vor jeder Löschung beide Kopfzeilen vergleichen.`,
  });

  const skills = werkzeug('npm', ['run', '--silent', 'skills']);
  const unversioniert = /UNVERSIONIERT — (\d+)/.exec(skills.text);
  const weitere = /(\d+) weitere\(r\) Befund/.exec(skills.text);
  out.push({
    id: 'skillebene', domaene: 'skills', titel: 'Skills unversioniert oder nicht ladbar',
    wert: (unversioniert ? +unversioniert[1] : 0) + (weitere ? +weitere[1] : 0),
    gut: !unversioniert && !weitere,
    text: unversioniert ? `${unversioniert[1]} Datei(en) liegen nur auf dieser Maschine.`
      : weitere ? `${weitere[1]} Skill(s) werden nicht geladen.` : 'Alles versioniert, ladbar und benannt.',
  });

  // Build-Ausgaben, die im Wurzelverzeichnis gelandet sind statt in dist/.
  // Sie werden mitversioniert, veralten still und tauchen in jeder Suche auf.
  let verirrt = 0;
  try {
    verirrt = readdirSync(wurzel).filter((f) => /Arena-[A-Za-z0-9_-]{8}\.js$/.test(f)).length;
  } catch { /* egal */ }
  out.push({
    id: 'verirrt', domaene: 'konfig', titel: 'Build-Artefakte im Wurzelverzeichnis',
    wert: verirrt, gut: verirrt === 0,
    text: verirrt === 0 ? 'Keine. Build-Ausgaben liegen, wo sie hingehören.'
      : `${verirrt} gebaute Konfig-App-Dateien liegen versioniert im Wurzelverzeichnis statt in dist/.`,
  });

  return out;
}

/** Bauteile, die es gibt, die aber auf keiner gemessenen Seite vorkommen.
 *  Totes Gewicht — genau der Fall des Card-Atoms. */
export function ungenutzt() {
  const dir = resolve(wurzel, 'data/baseline');
  let neuester = null;
  try {
    const f = readdirSync(dir).filter((x) => x.endsWith('.json.gz') && x !== 'vorher.json.gz');
    neuester = f.map((x) => ({ x, t: statSync(resolve(dir, x)).mtimeMs })).sort((a, b) => b.t - a.t)[0];
  } catch { return null; }
  if (!neuester) return null;

  let gemessen;
  try {
    gemessen = new Set(Object.keys(JSON.parse(gunzipSync(readFileSync(resolve(dir, neuester.x))).toString()).komponenten || {}));
  } catch { return null; }

  const klassen = new Set();
  for (const p of dateienUnter(resolve(wurzel, 'scss/scss'), (n, q) => n.endsWith('.scss') && /0[5-9]-/.test(q))) {
    for (const m of readFileSync(p, 'utf8').matchAll(/^\.(nc-[a-z0-9-]+)\s*\{/gm)) klassen.add(m[1]);
  }

  const tot = [...klassen].filter((k) => !gemessen.has(k));
  return { stand: neuester.x.replace('.json.gz', ''), gesamt: klassen.size, ungenutzt: tot.length, beispiele: tot.slice(0, 12) };
}

// ---------------------------------------------------------------------------
// 5 · Abgeleitete Masse
// ---------------------------------------------------------------------------

const NACHARBEIT = /\b(fix|bug|korrekt|rueckbau|rückbau|revert|nachtrag|repariert|behoben|falsch)/i;

/** Wie viel der Woche war Nacharbeit an frischer eigener Arbeit?
 *  Zwei unabhaengige Signale, beide noetig fuer ein Urteil:
 *  - Betreff spricht von Korrektur
 *  - der Commit fasst Dateien an, die in den 14 Tagen davor schon geaendert wurden */
export function nacharbeit(commits, von) {
  const grenze = new Date(new Date(von).getTime() - 14 * 864e5).toISOString();
  const frueher = new Map();
  for (const repo of REPOS) {
    const roh = git(repo.pfad, ['log', `--since=${grenze.slice(0, 10)}`, `--until=${von}`, '--name-only', '--pretty=format:']);
    for (const p of roh.split('\n').map((x) => x.trim()).filter(Boolean)) frueher.set(`${repo.name}:${p}`, true);
  }

  let korrektur = 0, aufFrischem = 0;
  for (const c of commits) {
    if (NACHARBEIT.test(c.betreff)) korrektur += 1;
    if (c.dateien.some((f) => frueher.has(`${c.repo}:${f.pfad}`))) aufFrischem += 1;
  }
  return {
    commits: commits.length,
    korrektur,
    aufFrischem,
    quote: commits.length ? Math.round((korrektur / commits.length) * 100) : 0,
  };
}

/** Die Gesamtstrecke: Wurde jede beruehrte Komponente auf allen vier
 *  Stationen bedient? Genau die Regel, die du gesetzt hast. */
export function gesamtstrecke(commits) {
  const beruehrt = new Set();
  for (const c of commits) {
    for (const f of c.dateien) {
      const m = /scss\/scss\/0[5-9]-[a-z]+\/_([a-z0-9-]+)\.scss$/.exec(f.pfad);
      if (m && m[1] !== 'index') beruehrt.add(m[1]);
    }
  }
  if (!beruehrt.size) return { beruehrt: 0, vollstaendig: 0, luecken: [] };

  let konfig = new Set();
  try {
    konfig = new Set(JSON.parse(readFileSync(resolve(wurzel, 'data/design-tokens.json'), 'utf8')).components.groups.map((g) => g.id));
  } catch { /* egal */ }

  const luecken = [];
  let vollstaendig = 0;
  for (const k of beruehrt) {
    const fehlt = [];
    if (!existsSync(resolve(wurzel, `data/${k}-recipe.json`))) fehlt.push('Recipe');
    if (!dateienUnter(resolve(wurzel, 'stories'), (n) => n === `${k}.stories.js`).length) fehlt.push('Story');
    if (konfig.size && !konfig.has(k)) fehlt.push('Konfig-App');
    if (fehlt.length) luecken.push({ komponente: k, fehlt }); else vollstaendig += 1;
  }
  return { beruehrt: beruehrt.size, vollstaendig, luecken: luecken.sort((a, b) => b.fehlt.length - a.fehlt.length) };
}

// ---------------------------------------------------------------------------
// Zusammenfuehren
// ---------------------------------------------------------------------------

export function bilanz({ von, bis }) {
  const commits = aktivitaet(von, bis);
  const { sitzungen, tarife } = nutzung(von, bis);
  const kosten = kostenJeDomaene(sitzungen, commits);

  const jeDomaene = {};
  for (const d of DOMAENEN) {
    jeDomaene[d.id] = {
      name: d.name, was: d.was,
      commits: 0, dateien: new Set(), plus: 0, minus: 0,
      kosten: kosten.summe[d.id] || 0,
    };
  }
  for (const c of commits) {
    const drin = new Set();
    for (const f of c.dateien) {
      const z = jeDomaene[f.domaene];
      z.dateien.add(`${c.repo}:${f.pfad}`);
      z.plus += f.plus; z.minus += f.minus;
      drin.add(f.domaene);
    }
    for (const d of drin) jeDomaene[d].commits += 1;
  }
  for (const z of Object.values(jeDomaene)) z.dateien = z.dateien.size;

  return {
    zeitraum: { von, bis },
    erzeugt: new Date().toISOString(),
    commits,
    jeDomaene,
    bestand: bestand(),
    befunde: befunde(),
    ungenutzt: ungenutzt(),
    nacharbeit: nacharbeit(commits, von),
    gesamtstrecke: gesamtstrecke(commits),
    kosten: {
      gesamt: sitzungen.reduce((a, s) => a + s.kosten, 0),
      unzuordenbar: kosten.unzuordenbar,
      sitzungen: sitzungen.length,
      abonnement: tarife.abonnement,
      waehrung: tarife.waehrung,
      token: {
        input: sitzungen.reduce((a, s) => a + s.input, 0),
        output: sitzungen.reduce((a, s) => a + s.output, 0),
        cacheWrite: sitzungen.reduce((a, s) => a + s.cacheWrite, 0),
        cacheRead: sitzungen.reduce((a, s) => a + s.cacheRead, 0),
      },
      modelle: sitzungen.reduce((m, s) => {
        for (const [k, n] of Object.entries(s.modelle)) m[k] = (m[k] || 0) + n;
        return m;
      }, {}),
    },
  };
}

export { tag, wurzel };

// Direktaufruf: Rohdaten ausgeben.
if (process.argv[1] && process.argv[1].endsWith('bilanz-daten.js')) {
  const argv = process.argv.slice(2);
  const arg = (n, s) => { const i = argv.indexOf(n); return i >= 0 ? argv[i + 1] : s; };
  const bis = arg('--bis', tag(new Date()));
  const von = arg('--von', tag(new Date(new Date(bis).getTime() - 6 * 864e5)));
  console.log(JSON.stringify(bilanz({ von, bis }), null, 2));
}
