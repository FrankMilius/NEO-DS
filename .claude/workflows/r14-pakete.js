export const meta = {
  name: 'r14-pakete',
  description: 'R14-Pakete: je Paket reparieren (höchstens 2 gleichzeitig), nacheinander prüfen, Widersacher, Bericht — ohne Commit',
  whenToUse: 'Nur über den Skill /pakete-parallel, nachdem npm run pakete:vorbereiten die Paket-Worktrees angelegt hat.',
  phases: [
    { title: 'Reparatur', detail: 'je Paket ein Agent im eigenen Worktree, höchstens 2 gleichzeitig' },
    { title: 'Prüfung', detail: 'nacheinander: e2e:wirkung, Gegenprobe, zuletzt pruefen:alles ohne modul' },
    { title: 'Widersacher', detail: 'je Paket, nur die Behauptung' },
  ],
}

// ==========================================================================
// R14-Pakete parallel (E10, 22.10.2026). Aufruf über /pakete-parallel.
//
// args: { pakete: [{ id, ordner, zweig, zusatz?, zusatzPruefung? }], trocken?: boolean, werkzeug?: string }
//   ordner/zweig wie von `npm run pakete:vorbereiten -- <liste> --nur-zeigen`
//   zusatz / zusatzPruefung: Franks Entscheidungen zu diesem Paket (Nachbesserung)
//   trocken: Agenten planen nur und ändern nichts (Probe des Ablaufs)
//   werkzeug: Worktree, aus dem pruefen:gegenprobe läuft (neuere Fassung als im Paket)
//   nurPruefung: Reparatur überspringen (Pakete sind schon repariert), nur prüfen
//
// Warum die Prüfung nicht parallel läuft: pruefen:bilder teilt Docker-Volumes,
// ci:lokal feste Ports, unter Last brauchte CI 761 s statt 263 s (21.10.2026).
// pruefen:modul ändert Drupal und läuft hier gar nicht — erst beim Übernehmen.
// Kein Agent committet: Der Zweig-Commit „(…, Freigabe ausstehend)“ folgt nach
// Franks Freigabe je Paket (Haltepunkt E6).
// ==========================================================================

const GLEICHZEITIG = 2
const pakete = (args && args.pakete) || []
const trocken = Boolean(args && args.trocken)
const werkzeug = (args && args.werkzeug) || null
const nurPruefung = Boolean(args && args.nurPruefung)
if (!pakete.length) throw new Error('args.pakete fehlt — erst npm run pakete:vorbereiten, dann über /pakete-parallel starten')

const REGELN = `Regeln, die nicht verhandelbar sind:
- Arbeite NUR im Ordner ORDNER. Beginne jeden Bash-Aufruf mit \`cd ORDNER &&\`. Fremde Worktrees, Franks Checkout ~/Sites/WEBSITE26 und DRUPAL11/neo_fe nicht anfassen.
- Nicht committen (auch keinen Commit „anstoßen“, der auf den Hook-Dialog wartet), nicht pushen, keinen Zweig umschalten, kein git stash. \`git add\` nur dort, wo die Prüfung es ausdrücklich verlangt.
- Nie \`npm run pruefen:modul\` und nie \`pruefen:alles\` ohne \`--ohne modul\` — das ändert Drupal.
- Dateien aus „Nicht anfassen“ in STAND.md bleiben unverändert.
- Befehle, die länger als 2 Minuten laufen, im Hintergrund starten und auf das Ende warten.`

const regeln = (p) => REGELN.replaceAll('ORDNER', p.ordner)

// Agenten hängen gern einen Zusatz an („… (geprüft mit …)“); das Muster wird
// nicht durchgesetzt (Trockenlauf 22.10.2026). zweigStimmt vergleicht daher
// das erste Wort.
const ZWEIG = { type: 'string', pattern: '^[^\\s()]+$', description: 'nur die Ausgabe von git branch --show-current im Ordner, ohne Zusatz' }

const REPARATUR = {
  type: 'object',
  properties: {
    zweig: ZWEIG,
    geaendert: { type: 'array', items: { type: 'string' } },
    werte: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          token: { type: 'string' },
          mechanismus: { type: 'string', description: 'Ursache gemessen und wie behoben (bzw. im Trockenlauf: geplant)' },
          standardUnveraendert: { type: 'boolean' },
          eigenschaft: { type: 'string' },
          testwert: { type: 'string', description: 'Wert für die Gegenprobe, sichtbar anders als der Standard' },
        },
        required: ['token', 'mechanismus', 'standardUnveraendert', 'eigenschaft', 'testwert'],
      },
    },
    npmTest: { type: 'string', description: 'Kennzahl von npm test, im Trockenlauf „nicht gelaufen“' },
    offen: { type: 'array', items: { type: 'string' } },
  },
  required: ['zweig', 'geaendert', 'werte', 'npmTest', 'offen'],
}

const PRUEFUNG = {
  type: 'object',
  properties: {
    zweig: ZWEIG,
    haltepunkt: { type: 'boolean', description: 'urteil.haltepunkt aus .pruefen/fertig-*/bericht.json wörtlich; true auch, wenn der Pixelvergleich geänderte oder unklare Seiten nennt' },
    vollstaendig: { type: 'boolean', description: 'true nur, wenn alle Stufen gelaufen sind (Ports frei, e2e:wirkung, Gegenproben, Gate mit Bericht); bei jedem Abbruch false' },
    buehne: {
      type: 'array',
      description: 'je Wert ohne Website-Einsatz die Art aus token-wirkung.json nach --setzen',
      items: {
        type: 'object',
        properties: { token: { type: 'string' }, art: { type: 'string' } },
        required: ['token', 'art'],
      },
    },
    gate: { type: 'string', description: 'Gesamturteil und Kennzahlen aus .pruefen/fertig-*/bericht.md, mit Pfad' },
    pixel: { type: 'string', description: 'Kopfzeilen 1280/390 und Liste geänderter/unklarer Seiten' },
    gegenprobe: {
      type: 'array',
      items: {
        type: 'object',
        properties: { token: { type: 'string' }, urteil: { type: 'string' }, befehl: { type: 'string' } },
        required: ['token', 'urteil', 'befehl'],
      },
    },
    wirkung: { type: 'string', description: 'Ergebnis von wirkung.mjs --pruefen und Zählung ohne-wirkung vorher → nachher' },
    dauer: { type: 'string', description: 'Dauer je Stufe in Sekunden' },
    offen: { type: 'array', items: { type: 'string' } },
  },
  required: ['zweig', 'haltepunkt', 'vollstaendig', 'gate', 'pixel', 'gegenprobe', 'buehne', 'wirkung', 'dauer', 'offen'],
}

const URTEIL = {
  type: 'object',
  properties: {
    widerlegt: { type: 'boolean' },
    befunde: { type: 'array', items: { type: 'string' } },
  },
  required: ['widerlegt', 'befunde'],
}

function reparaturAuftrag (p) {
  const kopf = `Paket ${p.id}, Ordner ${p.ordner}, erwarteter Zweig ${p.zweig}.
Lies zuerst ${p.ordner}/STAND.md: Abschnitte Ziel, Werte, Abnahme, Entscheidungen.
${regeln(p)}`
  if (trocken) {
    return `${kopf}

TROCKENLAUF: Ändere keine Datei und starte keinen Bau. Prüfe nur, dass \`git branch --show-current\` den erwarteten Zweig nennt und \`git status --porcelain\` leer ist. Lies je Wert die Regel, die laut Spalte „verliert gegen“ gewinnt (grep in scss/scss), und beschreibe den Weg, den du gehen würdest. geaendert = [], npmTest = „nicht gelaufen“.`
  }
  return `${kopf}

Aufgabe: Jeder Wert aus „Werte“ soll wirken, der Standard bleibt der heute sichtbare Wert, die Website unverändert.
1. Ursache je Wert messen statt der R13-Spalte zu glauben: \`npm run widerlegen -- --token <name>\` (wer setzt es, wer gewinnt). Prüfe auch, ob neo_fe (neo-overrides.css) den Wert später noch einmal setzt.
2. Beheben wie R14 Paket 1 (git show 8baf23f7): Reihenfolge/Spezifität korrigieren oder eine Kette bilden (die gewinnende Regel liest das Token mit dem bisherigen Wert als Rückfall). Keine fest eingetragenen Werte, Token-Regeln aus .claude/rules/scss-conventions.md.
3. Ändert sich ein Standard in data/design-tokens.json: \`npm run tokens\`. Dann \`npm run build:css\` und \`npm test\`.
4. Je Wert einen Testwert wählen, der sichtbar anders ist (für die Gegenprobe), und die passende CSS-Eigenschaft.
Ist der Standard in STAND.md leer, den heute sichtbaren Wert messen (\`node scripts/messen.js <pfad> <selektor>\`), nicht raten.
Ist ein Wert nicht ohne sichtbare Änderung der Website zu beheben: nicht erzwingen, unter „offen“ mit Begründung nennen.${zusatz(p.zusatz, 'Reparatur')}`
}

// Franks Entscheidungen zu einem Paket gehen den allgemeinen Regeln vor,
// nicht aber den nicht verhandelbaren (REGELN).
function zusatz (text, stufe) {
  return text ? `

Entscheidungen von Frank für diese ${stufe} (gehen der allgemeinen Aufgabe vor; der Worktree enthält schon Änderungen aus dem letzten Lauf — darauf aufbauen, nichts davon ungefragt verwerfen):
${text}` : ''
}

// Gegenprobe aus einem anderen Worktree (neuere Fassung des Werkzeugs), die
// CSS bleibt die des Pakets.
const gegenprobeBefehl = (p) => werkzeug
  ? `npm --prefix ${werkzeug} run pruefen:gegenprobe -- --setze '--<token>: <testwert>' --eigenschaft <eigenschaft> --bauteile '<Selektor des Elements, das die Eigenschaft trägt>' --css ${p.ordner}/styles.css`
  : `npm run pruefen:gegenprobe -- --setze '--<token>: <testwert>' --eigenschaft <eigenschaft> --bauteile '<Selektor des Elements, das die Eigenschaft trägt>' --css styles.css`

function pruefAuftrag (p, rep) {
  const werte = rep.werte.length ? JSON.stringify(rep.werte) : 'keine Angaben (nur Prüfung) — Werte, Eigenschaften und Testwerte aus STAND.md, Abschnitt „Werte“ und „Entscheidungen“, und aus git diff im Ordner ableiten'
  const kopf = `Paket ${p.id}, Ordner ${p.ordner}, erwarteter Zweig ${p.zweig}.
Lies ${p.ordner}/STAND.md (Abnahme). Werte aus der Reparatur: ${werte}
${regeln(p)}`
  if (trocken) {
    return `${kopf}

TROCKENLAUF: Nur \`npm run pruefen:alles -- --ohne modul --nur-zeigen\` ausführen und die Auswahl wiedergeben. Für jeden Wert mit Website-Einsatz (STAND.md, Spalte Website) den Gegenprobe-Befehl hinschreiben, den du ausführen würdest (mit --eigenschaft, --bauteile und --css styles.css), Urteil „nicht gelaufen“. Prüfe, ob die Ports 3100/3101 frei sind (\`lsof -nP -iTCP:3100 -iTCP:3101 -sTCP:LISTEN\`), und nenne das Ergebnis unter „offen“. haltepunkt = false, vollstaendig = false, buehne = [], pixel/wirkung/dauer = „nicht gelaufen“.`
  }
  return `${kopf}

Prüfe dieses Paket — nichts reparieren, nur messen. Zeigt \`git diff main --stat\` (gestagt und ungestagt) keine Änderung, gibt es nichts zu prüfen: vollstaendig = false, unter offen „nichts repariert“, aufhören. Reihenfolge so, dass das Gate zuletzt läuft und den Endstand belegt:
1. Bühne: \`lsof -nP -iTCP:3100 -iTCP:3101 -sTCP:LISTEN\` muss leer sein — sonst misst Playwright den Server eines anderen Ordners (reuseExistingServer). Belegt: nicht beenden, unter „offen“ nennen, vollstaendig = false und aufhören. Dann \`npm run build:css && (cd apps/theme-configurator && npm run build)\` und \`cd apps/theme-configurator && npm run e2e:wirkung\`. Ist \`wirkung.mjs --pruefen\` grün, \`node scripts/wirkung.mjs --setzen\`. Je Wert ohne Website-Einsatz die Art aus src/data/token-wirkung.json unter buehne melden (muss „wirkt“ sein — die Ratsche allein belegt das nicht) und die Zählung ohne-wirkung vorher → nachher.
2. Je Wert mit Website-Einsatz: \`npm run build:css\`, dann \`${gegenprobeBefehl(p)}\`. Ohne --css misst du die alte, ausgelieferte CSS; ohne --bauteile nur Button, Badge, Chip, Tag, Eingabefelder, Breadcrumb und Pagination. Die Zeilen in STAND.md nennen beides nicht — dieser Befehl gilt. Urteil wörtlich aus der Tabelle übernehmen, nicht aus dem Ausgang („nicht geprüft“ ist kein „wirkt“).
3. Vorher alle geänderten Dateien des Pakets stagen (\`git add -- <datei> …\`, einzeln aus \`git status --porcelain\`, ohne STAND.md und .pruefen/): Der CI-Schritt „Generat aktuell“ vergleicht mit dem Index und ist bei ungestagten Token-Änderungen immer rot. Nicht committen. Dann \`npm run pruefen:alles -- --ohne modul\` (bis ~25 min). Bericht .pruefen/fertig-*/bericht.md und bericht.json lesen. Ist urteil.haltepunkt true, steht HALTEPUNKT im Bericht oder nennt der Pixelvergleich eine geänderte oder unklare Seite (auch wenn er mit einem Seitenfehler endete): haltepunkt = true, Seiten, Breiten und Bildpfade unter pixel nennen und SOFORT aufhören. Nichts zurückdrehen, keinen zweiten Lauf, der den Befund überdeckt.
4. Dauer je Stufe festhalten.${zusatz(p.zusatzPruefung, 'Prüfung')}`
}

function behauptung (p, pr) {
  return `Behauptung: Paket ${p.id} im Worktree ${p.ordner} (Zweig ${p.zweig}, nicht committet) ist fertig. Alle Werte aus STAND.md, Abschnitt „Werte“, wirken; der Standard ist unverändert, die Website auch.
Belege: ${pr.gate} · Pixel: ${pr.pixel} · Gegenprobe: ${pr.gegenprobe.map((g) => `${g.token} ${g.urteil}`).join(', ')} · Bühne: ${pr.buehne.map((b) => `${b.token} ${b.art}`).join(', ')} · Wirkung: ${pr.wirkung}
Lies selbst den neuesten Bericht ${p.ordner}/.pruefen/fertig-*/bericht.json (urteil.haltepunkt, urteil.gruen) und vergleiche ihn mit den Belegen; prüfe den Zweig mit git -C.
Versuche das zu widerlegen. Ändere nichts, committe nichts, starte kein pruefen:modul und keine Playwright- oder pruefen:alles-Läufe.`
}

// Zweig-Probe: Ein Agent ohne eigenes Arbeitsverzeichnis kann im falschen
// Ordner landen; dann gilt sein Ergebnis nicht.
function zweigStimmt (p, r, stufe) {
  if (!r) { log(`✗ ${p.id}: ${stufe} ohne Ergebnis`); return false }
  if (r.zweig.trim().split(/\s/)[0] !== p.zweig) { log(`✗ ${p.id}: ${stufe} meldet Zweig „${r.zweig}“ statt ${p.zweig} — verworfen`); return false }
  return true
}

// 1 · Reparatur: höchstens GLEICHZEITIG Agenten
phase('Reparatur')
const reparaturen = []
if (nurPruefung) {
  for (const p of pakete) reparaturen.push({ zweig: p.zweig, geaendert: ['(vorhanden, nur Prüfung)'], werte: [], npmTest: 'nicht gelaufen', offen: [] })
  log('Reparatur übersprungen (nurPruefung)')
}
for (let i = 0; i < (nurPruefung ? 0 : pakete.length); i += GLEICHZEITIG) {
  const gruppe = pakete.slice(i, i + GLEICHZEITIG)
  const r = await parallel(gruppe.map((p) => () =>
    agent(reparaturAuftrag(p), { label: `reparatur:${p.id}`, phase: 'Reparatur', schema: REPARATUR })))
  reparaturen.push(...r)
}

// 2 · Prüfung und 3 · Widersacher: nacheinander, ein Paket nach dem anderen.
// Ein HALTEPUNKT hält den ganzen Lauf an (E6: sofort anhalten, Frank zeigen);
// die übrigen Pakete bleiben repariert, aber ungeprüft.
const ergebnis = []
let angehalten = false
for (let i = 0; i < pakete.length; i++) {
  const p = pakete[i]
  const rep = reparaturen[i]
  const eintrag = { id: p.id, ordner: p.ordner, zweig: p.zweig, reparatur: rep, pruefung: null, widersacher: null, urteil: '' }
  ergebnis.push(eintrag)
  if (angehalten) { eintrag.urteil = 'nicht geprüft — Lauf nach HALTEPUNKT angehalten'; continue }
  if (!zweigStimmt(p, rep, 'Reparatur')) { eintrag.urteil = 'Reparatur ungültig'; continue }
  if (!trocken && !rep.geaendert.length) { eintrag.urteil = 'nichts repariert'; continue }

  phase('Prüfung')
  const pr = await agent(pruefAuftrag(p, rep), { label: `pruefung:${p.id}`, phase: 'Prüfung', schema: PRUEFUNG })
  eintrag.pruefung = pr
  if (!zweigStimmt(p, pr, 'Prüfung')) { eintrag.urteil = 'Prüfung ungültig'; continue }
  if (pr.haltepunkt) {
    eintrag.urteil = 'HALTEPUNKT — Website-Unterschied, Frank die Seiten zeigen'
    log(`■ ${p.id}: HALTEPUNKT — Lauf angehalten`)
    angehalten = true
    continue
  }

  if (trocken) { eintrag.urteil = 'Trockenlauf'; continue }
  if (!pr.vollstaendig) { eintrag.urteil = 'Prüfung abgebrochen — offen lesen'; continue }
  phase('Widersacher')
  const w = await agent(behauptung(p, pr), { label: `widersacher:${p.id}`, phase: 'Widersacher', schema: URTEIL, agentType: 'widersacher' })
  eintrag.widersacher = w
  const offen = rep.offen.length + pr.offen.length
  eintrag.urteil = !w ? 'Widersacher ohne Ergebnis'
    : w.widerlegt ? 'widerlegt — nachbessern'
      : `bereit zur Vorlage (Freigabe ausstehend)${offen ? `, ${offen} offene Punkte` : ''}`
}

for (const e of ergebnis) log(`${e.id}: ${e.urteil}`)
return { trocken, pakete: ergebnis }
