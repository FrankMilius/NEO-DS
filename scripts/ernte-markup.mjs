/**
 * Erntet echtes Bauteil-Markup von der laufenden Website.
 *
 *   node scripts/ernte-markup.mjs                  alle Bauteile
 *   node scripts/ernte-markup.mjs accordion hero   nur diese
 *   node scripts/ernte-markup.mjs --trocken        nur zeigen, nichts schreiben
 *
 * WARUM VON DER WEBSITE UND NICHT AUS DEM RECIPE
 * Markup aus Klassennamen abzuleiten liefert etwas, das nach Bauteil aussieht
 * und keines ist — genau das stand bis zum 21.08.2026 in allen 131 Stories.
 * Die Blockvorlagen im Theme dagegen erzeugen das Markup, das auf der Website
 * laeuft und das ich vermessen habe. Das ist die einzige Quelle, die
 * nachweislich stimmt.
 *
 * WARUM KEINE SEITENKARTE VON HAND
 * Eine gepflegte Liste "Bauteil X steht auf Seite Y" veraltet beim ersten
 * Umbau einer Seite, ohne dass es jemand merkt. Stattdessen liefert jedes
 * Recipe seinen Wurzelselektor; das Skript sucht ihn auf allen
 * veroeffentlichten Seiten und nimmt die reichhaltigste Fundstelle.
 *
 * WAS "REICHHALTIG" HEISST
 * Ein Block, bei dem der Redakteur die Haelfte der Felder leer gelassen hat,
 * liefert ein Zitat ohne Urheber oder eine Text-Medien-Sektion ohne Medium.
 * Echt, aber als Story eine Ruine. Bewertet wird darum, wie viel vom Bauteil
 * tatsaechlich zu sehen ist: Pflichtbereiche aus der Anatomie zaehlen
 * zehnfach, jeder weitere sichtbare BEM-Bereich einfach.
 *
 * WAS BEIM ERNTEN WEGFAELLT
 * Drupal haengt an jeden Block Verwaltungsdaten: Kontextmenues, Cache-Marken,
 * Bearbeitungs-Kennungen. In Storybook sind sie sinnlos und verdecken den
 * Aufbau. Ebenso die Bildwege — /sites/default/files gibt es dort nicht.
 *
 * DIE BESSERE FUNDSTELLE GEWINNT, AUCH UEBER LAEUFE HINWEG
 * Die Doku-Seiten liefern fuer manches Bauteil eine duerftige Fassung, die die
 * Website deutlich besser zeigt: die Feature List kam aus der Preistabelle mit
 * 11 Punkten, von /produkte/app mit 63. Wer die Quellen der Reihe nach laufen
 * laesst, wuerde das Gute mit dem Schlechten ueberschreiben. Darum steht die
 * Punktzahl in der Datei, und ein Lauf ersetzt nur, was er verbessert.
 *
 * VON HAND GESCHRIEBENES BLEIBT UNANGETASTET
 * Eine Markup-Datei mit der Marke `@quelle: von Hand` ueberschreibt das
 * Skript nicht. Manches Bauteil steht auf keiner Seite und wurde bewusst
 * von Hand gestellt.
 */

import { execFileSync, spawn } from 'node:child_process';
import { mkdtempSync, writeFileSync, readFileSync, readdirSync, existsSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DATA = resolve(ROOT, 'data');
const ZIEL = resolve(DATA, 'markup');
// Zwei Quellen, dieselbe Technik.
//
// Die Website zeigt die Bauteile im Einsatz — das ist die bessere Quelle,
// weil dort echte Inhalte drinstehen. Fuer alles, was auf keiner Seite
// vorkommt, bleiben die Doku-Seiten: die rendern ihre Beispiele live, teils
// per JS, und liefern damit ebenfalls fertiges Markup statt einer Ableitung
// aus Klassennamen.
const QUELLEN = {
  website: { basis: 'https://piipe-workplace.ddev.site', liste: '.seiten.txt' },
  doku:    { basis: 'http://localhost:3000',             liste: '.doku-seiten.txt' },
};
const VON_HAND = '@quelle: von Hand';

// Bauteile, die kein eigenes Story-Markup bekommen — die Begruendung je
// Bauteil steht in data/geruest-bauteile.json. Die Liste liegt dort und nicht
// hier, weil der Story-Generator sie ebenfalls braucht: er darf sie nicht als
// Luecke zaehlen. Zwei Listen fuer dieselbe Frage wuerden driften.
const ZU_GENERISCH = new Set(
  Object.keys(JSON.parse(readFileSync(resolve(DATA, 'geruest-bauteile.json'), 'utf8')).bauteile),
);

// Obergrenze fuer eine Story. Darueber ist nicht mehr das Bauteil zu sehen,
// sondern eine Datenmenge — der Leser scrollt an der Aussage vorbei.
const MAX_ZEICHEN = 24000;

const argv = process.argv.slice(2);
const trocken = argv.includes('--trocken');
const erzwingen = argv.includes('--erzwingen');
const quelleName = (argv.find((a) => a.startsWith('--quelle=')) ?? '--quelle=website').split('=')[1];
const QUELLE = QUELLEN[quelleName];
if (!QUELLE) {
  console.error(`  Unbekannte Quelle "${quelleName}". Moeglich: ${Object.keys(QUELLEN).join(', ')}`);
  process.exit(1);
}
const BASIS = QUELLE.basis;
const nur = argv.filter((a) => !a.startsWith('--'));

// ─── Bauteile aus den Recipes ────────────────────────────────────────
const bauteile = [];
for (const datei of readdirSync(DATA).filter((f) => f.endsWith('-recipe.json')).sort()) {
  const name = datei.replace(/-recipe\.json$/, '');
  if (nur.length && !nur.includes(name)) continue;
  if (ZU_GENERISCH.has(name)) continue;

  let r;
  try { r = JSON.parse(readFileSync(resolve(DATA, datei), 'utf8')); } catch { continue; }
  const wurzel = r.anatomy?.root?.element;
  if (!wurzel) continue;

  const pflicht = (r.anatomy?.slots ?? [])
    .filter((s) => !s.optional && s.element)
    .map((s) => String(s.element).replace(/^\./, ''));

  const vorhanden = resolve(ZIEL, `${name}.html`);
  let bestand = -1;
  if (existsSync(vorhanden)) {
    const da = readFileSync(vorhanden, 'utf8');
    if (da.includes(VON_HAND)) continue;
    const marke = da.match(/@punkte:\s*(\d+)/)?.[1];
    // Ohne Marke NICHT auf -1 fallen. Eine fehlende Note ist keine Note Null.
    //
    // Am 25.08.2026 hat ein Lauf table-block.html von 992 auf 115 Zeilen
    // gestutzt — von 172 Zellen und fuenf .nc-tbl-info-icon auf 16 Zellen und
    // keins. Der Bestand war deutlich reichhaltiger, wurde aber ungeprueft
    // ueberschrieben, weil er aus der Zeit VOR der Bewertung stammte und
    // deshalb keine Marke trug.
    //
    // Das ist die typische Luecke einer nachtraeglich eingebauten Absicherung:
    // Sie schuetzt alles ausser dem Altbestand, den sie schuetzen sollte. Also
    // wird der Bestand jetzt nach derselben Formel benotet wie ein Fund.
    bestand = marke !== undefined ? Number(marke) : punkteAusHtml(da, pflicht);
  }

  bauteile.push({ name, wurzel, bestand, pflicht });
}

const seiten = readFileSync(resolve(ZIEL, QUELLE.liste), 'utf8').split('\n').filter(Boolean);
console.log(`\n  Quelle: ${quelleName} (${BASIS})`);
console.log(`  ${bauteile.length} Bauteile werden auf ${seiten.length} Seiten gesucht.\n`);

// ─── Browser ─────────────────────────────────────────────────────────
const PORT = 9761;
const profil = mkdtempSync(join(tmpdir(), 'ernte-'));
const chrome = spawn(
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  [`--remote-debugging-port=${PORT}`, `--user-data-dir=${profil}`, '--headless=new',
   '--ignore-certificate-errors', '--no-first-run', '--no-default-browser-check',
   '--window-size=1440,1000'],
  { stdio: 'ignore', detached: true },
);
const warten = (ms) => new Promise((r) => setTimeout(r, ms));

async function zielAdresse() {
  for (let i = 0; i < 40; i++) {
    try {
      const t = JSON.parse(execFileSync('curl', ['-s', `http://127.0.0.1:${PORT}/json/list`], { encoding: 'utf8' }));
      const s = t.find((x) => x.type === 'page');
      if (s) return s.webSocketDebuggerUrl;
    } catch { /* Chrome faehrt noch hoch */ }
    await warten(250);
  }
  throw new Error('Chrome antwortet nicht.');
}

const ws = new WebSocket(await zielAdresse());
let lfd = 0;
const offen = new Map();
ws.addEventListener('message', (e) => {
  const m = JSON.parse(e.data);
  if (m.id && offen.has(m.id)) { offen.get(m.id)(m); offen.delete(m.id); }
});
await new Promise((r) => ws.addEventListener('open', r));
const senden = (m, p = {}) => new Promise((r) => {
  const n = ++lfd; offen.set(n, r); ws.send(JSON.stringify({ id: n, method: m, params: p }));
});
const js = async (a) => (await senden('Runtime.evaluate',
  { returnByValue: true, awaitPromise: true, expression: a })).result?.result?.value;

await senden('Page.enable');
await senden('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false });

// ─── Im Browser: bewerten und saeubern ───────────────────────────────
// Wird auf jeder Seite einmal eingespielt, damit die Definitionen bei
// beiden Durchgaengen zur Verfuegung stehen.
/**
 * Die Benotung — EINMAL geschrieben, an zwei Orten ausgefuehrt.
 *
 * Pflichtbereiche zaehlen zehnfach, jeder weitere sichtbare BEM-Bereich
 * einfach. So gewinnt der Block, bei dem am meisten ausgefuellt ist.
 *
 * Gebraucht wird sie im Browser (fuer einen Fund) und hier in Node (fuer den
 * Bestand auf der Platte). Zwei Fassungen derselben Formel waeren genau die
 * Sorte Dublette, die still auseinanderlaeuft — und ein Vergleich zwischen
 * zwei verschiedenen Massstaeben ist kein Vergleich. Deshalb steht sie hier
 * als echte Funktion und wird ueber `toString()` in die Seite geschickt.
 */
function punkteAusHtml(html, pflicht) {
  let punkte = 0;
  for (const p of pflicht) {
    if (new RegExp('class="[^"]*\\b' + p + '\\b').test(html)) punkte += 10;
  }
  const bereiche = new Set();
  for (const m of html.matchAll(/\bnc-[a-z0-9-]+__[a-z0-9-]+/g)) bereiche.add(m[0]);
  return punkte + bereiche.size;
}

const WERKZEUG = `
window.__ernte = {
  // Manche Bauteile blenden ihre Inhalte beim Scrollen ein: die Timeline
  // setzt \`.is-visible\` je Eintrag, erst dann steht deren Inhalt nicht mehr
  // auf opacity 0. Wer das Markup abgreift, ohne das Bauteil einmal
  // durchgescrollt zu haben, erntet ein leeres Geruest — in Storybook war
  // die Timeline darum nur eine Linie mit einem Symbol.
  // Also: einmal in Schritten durch das Bauteil scrollen und den Beobachtern
  // Zeit lassen, bevor abgegriffen wird.
  async durchscrollen(el) {
    const ruhe = (ms) => new Promise((r) => setTimeout(r, ms));
    const hoehe = el.getBoundingClientRect().height;
    const oben = window.scrollY + el.getBoundingClientRect().top;
    for (let y = 0; y <= hoehe + window.innerHeight; y += Math.floor(window.innerHeight / 2)) {
      window.scrollTo({ top: oben + y - window.innerHeight / 2, behavior: 'instant' });
      await ruhe(120);
    }
    el.scrollIntoView({ block: 'center', behavior: 'instant' });
    await ruhe(600);
  },

  // ZU GROSSES AUSDUENNEN, STATT ES WEGZUWERFEN.
  //
  // Die Vergleichstabelle der Editionen bringt 29 kB — als Story sieht man
  // darin nicht das Bauteil, sondern eine Datenmenge. Weggeworfen hatte sie
  // aber gar keine Story. Eine Tabelle mit vier Zeilen zeigt denselben Aufbau
  // wie eine mit vierzig; die Wiederholung traegt keine Aussage mehr.
  //
  // Ausgeduennt wird immer die groesste Gruppe gleichartiger Geschwister, und
  // dass etwas fehlt, steht als Kommentar im Markup. Stillschweigend kuerzen
  // waere schlimmer als wegwerfen: die Story sahe vollstaendig aus.
  ausduennen(k, behalten) {
    let gruppe = null;
    let groesse = 0;
    for (const eltern of k.querySelectorAll('*')) {
      const kinder = [...eltern.children];
      if (kinder.length <= behalten + 1) continue;
      const nach = new Map();
      for (const kind of kinder) {
        const kennung = kind.tagName + '.' + kind.className;
        if (!nach.has(kennung)) nach.set(kennung, []);
        nach.get(kennung).push(kind);
      }
      for (const [, gleiche] of nach) {
        if (gleiche.length > groesse) { groesse = gleiche.length; gruppe = gleiche; }
      }
    }
    if (!gruppe || groesse <= behalten) return false;

    const weg = gruppe.slice(behalten);
    const eltern = weg[0].parentNode;
    for (const x of weg) x.remove();
    eltern.appendChild(k.ownerDocument.createComment(
      ' gekuerzt: ' + weg.length + ' weitere gleichartige Eintraege, siehe data/markup/LIESMICH.md '));
    return true;
  },

  saeubern(el) {
    const k = el.cloneNode(true);
    this.saeubern2(k);
    return k.outerHTML;
  },

  saeubern2(k) {
    // Ein zugeklapptes Akkordeon zeigt in der Doku nur seine Kopfzeilen —
    // der Inhaltsbereich, um den es geht, bleibt unsichtbar. Der erste
    // Eintrag wird darum aufgeklappt. Das ist ein echter Zustand des
    // Bauteils, kein erfundener.
    const ersteKlappe = k.querySelector('details');
    if (ersteKlappe) ersteKlappe.setAttribute('open', '');
    k.querySelectorAll('[data-contextual-id], .contextual, .contextual-region, .skip-link').forEach((x) => x.remove());
    const putzen = (x) => [...x.attributes].forEach((a) => {
      if (/^data-(drupal|contextual|quickedit|history|big-pipe|once)/.test(a.name)) x.removeAttribute(a.name);
      if (a.name === 'class' && !a.value.trim()) x.removeAttribute('class');
    });
    putzen(k);
    k.querySelectorAll('*').forEach(putzen);
  },

  // Die Formel steht in Node (punkteAusHtml) und wird hier hineingereicht —
  // siehe den Kommentar dort. Diese Fassung packt nur das outerHTML aus.
  punkteAusHtml: ${punkteAusHtml.toString()},

  bewerten(el, name, pflicht) {
    return this.punkteAusHtml(el.outerHTML, pflicht);
  },
};
`;

// ─── Durchgang 1: suchen und bewerten ────────────────────────────────
const besten = new Map(); // name → { punkte, seite, nr, groesse }

for (const [i, seite] of seiten.entries()) {
  await senden('Page.navigate', { url: BASIS + seite });
  await warten(3500);
  await js(WERKZEUG);

  const treffer = await js(`(() => {
    const bauteile = ${JSON.stringify(bauteile)};
    const raus = [];
    for (const b of bauteile) {
      let els;
      try { els = document.querySelectorAll(b.wurzel); } catch { continue; }
      els.forEach((el, nr) => {
        const punkte = window.__ernte.bewerten(el, b.name, b.pflicht);
        raus.push({ name: b.name, nr, punkte, groesse: el.outerHTML.length });
      });
    }
    return raus;
  })()`) ?? [];

  for (const t of treffer) {
    const alt = besten.get(t.name);
    // Bei gleicher Punktzahl gewinnt das kleinere Markup — es ist eher das
    // Bauteil selbst als ein Wrapper, der es mit enthaelt.
    const besser = !alt || t.punkte > alt.punkte || (t.punkte === alt.punkte && t.groesse < alt.groesse);
    if (besser) besten.set(t.name, { punkte: t.punkte, seite, nr: t.nr, groesse: t.groesse });
  }

  process.stdout.write(`\r  Seite ${String(i + 1).padStart(2)}/${seiten.length}  ${besten.size} Bauteile gefunden   `);
}
console.log('\n');

// ─── Durchgang 2: die Sieger holen ───────────────────────────────────
const proSeite = new Map();
for (const [name, b] of besten) {
  if (!proSeite.has(b.seite)) proSeite.set(b.seite, []);
  proSeite.get(b.seite).push([name, b]);
}

const bericht = [];
const gekuerzt = [];
if (!existsSync(ZIEL)) mkdirSync(ZIEL, { recursive: true });

for (const [seite, eintraege] of proSeite) {
  await senden('Page.navigate', { url: BASIS + seite });
  await warten(3500);
  await js(WERKZEUG);

  for (const [name, b] of eintraege) {
    const bauteil = bauteile.find((x) => x.name === name);
    const roh = await js(`(async () => {
      const els = document.querySelectorAll(${JSON.stringify(bauteil.wurzel)});
      const el = els[${b.nr}];
      if (!el) return null;
      await window.__ernte.durchscrollen(el);
      return window.__ernte.saeubern(el);
    })()`);
    if (!roh) { bericht.push({ name, stand: 'verschwunden', seite }); continue; }

    let markup = roh;
    if (roh.length > MAX_ZEICHEN) {
      const duenner = await js(`(() => {
        const els = document.querySelectorAll(${JSON.stringify(bauteil.wurzel)});
        const el = els[${b.nr}];
        if (!el) return null;
        const k = el.cloneNode(true);
        window.__ernte.saeubern2(k);
        for (let i = 0; i < 12; i++) {
          if (k.outerHTML.length <= ${MAX_ZEICHEN}) break;
          if (!window.__ernte.ausduennen(k, 4)) break;
        }
        return k.outerHTML;
      })()`);
      if (!duenner || duenner.length > MAX_ZEICHEN) {
        bericht.push({ name, stand: 'zu gross', seite, punkte: b.punkte, zeichen: roh.length });
        continue;
      }
      markup = duenner;
      gekuerzt.push(name);
    }

    // Bildwege ersetzen: /sites/default/files gibt es in Storybook nicht.
    markup = markup
      .replace(/(src|href)="\/sites\/default\/files\/[^"]*\.(?:png|jpe?g|webp|avif|svg)"/gi,
               (_m, attr) => `${attr}="/assets/muster/app-screen.svg"`)
      .replace(/\s*srcset="[^"]*"/gi, '')
      .replace(/[ \t]{2,}/g, ' ')
      .replace(/>\s*</g, '>\n<');

    // GLEICHSTAND HEISST BEHALTEN, nicht ersetzen.
    //
    // Vorher stand hier `>`, ein Fund mit derselben Note verdraengte also den
    // Bestand. Am 25.08.2026 kostete das table-block.html 880 Zeilen: 2 Punkte
    // gegen 2 Punkte, und aus 172 Tabellenzellen mit fuenf .nc-tbl-info-icon
    // wurden 16 Zellen ohne ein einziges.
    //
    // Schuld daran ist auch eine Blindstelle der Formel: Sie zaehlt nur
    // Bereiche in `__`-Schreibweise. `nc-tbl-cell` und `nc-tbl-info-icon`
    // heissen mit einfachem Bindestrich und sind fuer sie unsichtbar — bei
    // zehn Bauteilen sieht sie ueberhaupt nichts (siehe BACKLOG).
    //
    // Solange die Formel nicht schaerfer ist, ist „gleich benotet" kein Grund
    // zu tauschen. Wer nicht unterscheiden kann, soll nichts wegwerfen.
    if (bauteil.bestand >= b.punkte && !erzwingen) {
      bericht.push({ name, stand: `behalten (${bauteil.bestand})`, seite, punkte: b.punkte, zeichen: markup.length });
      continue;
    }

    bericht.push({ name, stand: 'geerntet', seite, punkte: b.punkte, zeichen: markup.length });
    if (!trocken) {
      writeFileSync(resolve(ZIEL, `${name}.html`),
        `<!-- @quelle: geerntet von ${quelleName === 'doku' ? 'Doku' : 'Website'} ${seite} -->\n`
        + `<!-- @punkte: ${b.punkte} -->\n`
        + `<!-- @fassung: Standard -->\n${markup}\n`);
    }
  }
}

bericht.sort((a, b) => a.name.localeCompare(b.name));
console.log('  MARKUP GEERNTET');
console.log('  ' + '─'.repeat(74));
for (const b of bericht) {
  const marke = b.stand === 'geerntet' ? '  ' : '! ';
  const wo = b.stand === 'geerntet' ? b.seite : `${b.stand} — ${b.seite}`;
  console.log(`  ${marke}${b.name.padEnd(20)} ${String(b.punkte ?? '').padStart(4)} Pkt  ${String(b.zeichen ?? '').padStart(6)} Z   ${wo}`);
}
console.log('  ' + '─'.repeat(74));
const ok = bericht.filter((b) => b.stand === 'geerntet').length;
const gross = bericht.filter((b) => b.stand === 'zu gross');
const behalten = bericht.filter((b) => b.stand.startsWith('behalten')).length;
console.log(`  ${ok} Bauteile geschrieben${trocken ? '  (trocken — nichts geschrieben)' : ''}`);
if (behalten) console.log(`  ${behalten} behalten, weil die vorhandene Fassung mehr zeigt`);
if (gekuerzt.length) {
  console.log(`  ausgeduennt, weil ueber ${MAX_ZEICHEN} Zeichen: ${gekuerzt.join(', ')}`);
}
if (gross.length) {
  console.log(`  auch ausgeduennt zu gross, darum verworfen: ${gross.map((g) => g.name).join(', ')}`);
}
console.log(`  ohne Fundstelle: ${bauteile.length - besten.size}\n`);

ws.close();
try { process.kill(-chrome.pid); } catch { /* schon weg */ }
process.exit(0);
