#!/usr/bin/env node
// ==========================================================================
// Wöchentlicher Wartungsbericht (Agenten-Landkarte E8, 21.10.2026)
// ==========================================================================
// Nur lesen, nur berichten:
//   Sicherung     Bündel in ~/Sites/_sicherung gegen master von DRUPAL11/neo_fe
//   Ungepusht     Commits je Repository, die nur lokal liegen
//   Worktrees     erledigt / liegt / in Arbeit (alle drei Repositorys)
//   CI            Zustand der GitHub-Abläufe auf main (gh run list)
//   Dependabot    offene Pull-Requests auf GitHub mit CI-Zustand (gh)
//   Drupal        Sicherheitswarnungen aus composer.lock (`composer audit
//                 --locked` auf dem Mac — bewusst NICHT `ddev composer`: das
//                 löst den Theme-Schutz aus und braucht laufendes ddev)
//
//   node scripts/routinen/wartung.mjs [--berichte ~/Sites/_berichte]
//
// Rückgabe: 0 kein Handlungsbedarf · 1 Handlungsbedarf
// Bericht:  <berichte>/wartung-JJJJ-MM-TT.md, letzte Zeile der Ausgabe ist
//           „HANDLUNGSBEDARF: …“ oder „HANDLUNGSBEDARF: keiner“.
// ==========================================================================
import { spawnSync } from 'node:child_process'
import { existsSync, mkdirSync, mkdtempSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { parseArgs } from 'node:util'
import { sicherung, worktrees, dependabot, ciZustand, composerAudit, einzeilig, handlungsbedarf } from './lib/wartung.mjs'

// Auffangnetz: auch bei einem unerwarteten Fehler endet die Ausgabe mit HANDLUNGSBEDARF
process.on('uncaughtException', (e) => {
  console.error(e)
  console.log(`HANDLUNGSBEDARF: Wartungsbericht unerwartet abgebrochen: ${String(e?.message ?? e).replace(/\s+/g, ' ').slice(0, 160)}`)
  process.exit(2)
})

const HEIM = os.homedir()
let opt
try {
  opt = parseArgs({ options: { berichte: { type: 'string', default: path.join(HEIM, 'Sites/_berichte') } } }).values
} catch (e) {
  console.error(`✗ ${e.message}`)
  console.log(`HANDLUNGSBEDARF: Wartungsbericht nicht gestartet: ${e.message}`)
  process.exit(2)
}

const SITES = path.join(HEIM, 'Sites')
const SICHERUNG = path.join(SITES, '_sicherung')
const REPOS = [
  { repo: 'WEBSITE26', pfad: path.join(SITES, 'WEBSITE26'), basis: 'main', github: 'FrankMilius/NEO-DS' },
  { repo: 'DRUPAL11', pfad: path.join(SITES, 'DRUPAL11'), basis: 'master', buendel: true },
  { repo: 'neo_fe', pfad: path.join(SITES, 'DRUPAL11/web/themes/custom/neo_fe'), basis: 'master', buendel: true },
]
// Fester Worktree der nächtlichen Wirkungsprüfung — kein Aufräumkandidat
const ROUTINE = path.join(SITES, '_worktrees/WEBSITE26-routine')

// Zeitlimit je Befehl: ein hängendes gh/composer/git darf den Bericht nicht verhindern
function cmd (befehl, args, cwd, timeout = 120_000) {
  const r = spawnSync(befehl, args, { cwd, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, timeout })
  const err = r.error?.code === 'ETIMEDOUT' ? `Zeitlimit ${timeout / 1000} s überschritten` : (r.stderr ?? '').trim() || r.error?.message || ''
  return { code: r.status, out: (r.stdout ?? '').trim(), err: einzeilig(err) }
}
const git = (cwd, ...a) => { const r = cmd('git', a, cwd); return r.code === 0 ? r.out : null }

// --- Sicherung -------------------------------------------------------------
function neuestesBuendel (repo) {
  const l = existsSync(SICHERUNG) ? readdirSync(SICHERUNG).filter((f) => f.startsWith(`${repo}-master-`) && f.endsWith('.bundle')).sort() : []
  return l.length ? path.join(SICHERUNG, l.at(-1)) : null
}
// Probe-Übernahme in ein leeres Repository: `bundle list-heads` und `bundle
// verify` lesen nur den Kopf und halten ein abgeschnittenes Bündel für gut
function lesbar (datei, zweig) {
  const tmp = mkdtempSync(path.join(os.tmpdir(), 'neo-buendel-'))
  try {
    return cmd('git', ['init', '--quiet', '--bare', tmp], tmp).code === 0 &&
      cmd('git', ['-C', tmp, 'fetch', '--quiet', datei, zweig], tmp, 300_000).code === 0
  } finally { rmSync(tmp, { recursive: true, force: true }) }
}
const staende = REPOS.filter((r) => r.buendel).map((r) => {
  const datei = neuestesBuendel(r.repo)
  const master = git(r.pfad, 'rev-parse', '--verify', `${r.basis}^{commit}`)
  const kopf = datei ? git(r.pfad, 'bundle', 'list-heads', datei, `refs/heads/${r.basis}`) : null
  const buendel = kopf?.split(/\s+/)[0] || null
  const gepusht = Boolean(master && git(r.pfad, 'branch', '-r', '--contains', master))
  return { repo: r.repo, master, buendel, datei, gepusht, lesbar: buendel ? lesbar(datei, r.basis) : undefined }
})

// --- Ungepusht -------------------------------------------------------------
// „kein entfernter Zweig“ nur, wenn wirklich keiner eingerichtet ist; jeder
// andere Fehler (Repository weg, Zweig weg) wird Handlungsbedarf
const ungepusht = REPOS.map((r) => {
  if (!existsSync(r.pfad)) return { repo: r.repo, fehler: 'Ordner fehlt' }
  // Upstream eingerichtet? Über die Konfiguration, nicht über den (evtl. übersetzten) Fehlertext
  if (cmd('git', ['config', '--get', `branch.${r.basis}.merge`], r.pfad).code === 1) return { repo: r.repo, anzahl: null }
  const oben = cmd('git', ['rev-parse', '--abbrev-ref', `${r.basis}@{upstream}`], r.pfad)
  if (oben.code !== 0) return { repo: r.repo, fehler: oben.err || 'git rev-parse scheitert' }
  const n = cmd('git', ['rev-list', '--count', `${oben.out}..${r.basis}`], r.pfad)
  return n.code === 0 ? { repo: r.repo, anzahl: Number(n.out) } : { repo: r.repo, fehler: n.err || 'git rev-list scheitert' }
})

// --- Worktrees -------------------------------------------------------------
function liste (r) {
  const roh = git(r.pfad, 'worktree', 'list', '--porcelain')
  if (roh === null) return [{ repo: r.repo, pfad: r.pfad, zweig: null, fehler: 'git worktree list scheitert' }]
  return roh.split('\n\n').map((b) => Object.fromEntries(b.split('\n').filter(Boolean).map((z) => { const i = z.indexOf(' '); return i < 0 ? [z, true] : [z.slice(0, i), z.slice(i + 1)] })))
    .filter((w) => w.worktree && path.resolve(w.worktree) !== path.resolve(r.pfad) && path.resolve(w.worktree) !== ROUTINE)
    .map((w) => {
      const zweig = w.branch?.replace('refs/heads/', '') ?? null
      if (!existsSync(w.worktree)) return { repo: r.repo, pfad: w.worktree, zweig, fehlt: true }
      return {
        repo: r.repo,
        pfad: w.worktree,
        zweig,
        letzterCommit: Number(git(w.worktree, 'log', '-1', '--format=%ct') ?? 0) * 1000,
        inBasis: cmd('git', ['merge-base', '--is-ancestor', 'HEAD', r.basis], w.worktree).code === 0,
        offen: (git(w.worktree, 'status', '--porcelain') ?? '').split('\n').filter(Boolean).length,
        // frisch angelegt = Reflog des Zweigs hat nur den Eintrag „Created from“
        eigeneCommits: zweig ? (git(r.pfad, 'reflog', 'show', '--format=%gs', `refs/heads/${zweig}`) ?? 'x\ny').split('\n').filter(Boolean).length > 1 : true,
        stand_md: existsSync(path.join(w.worktree, 'STAND.md')),
      }
    })
}
const wts = worktrees(REPOS.flatMap(liste), Date.now())

// --- Dependabot ------------------------------------------------------------
const gh = cmd('gh', ['pr', 'list', '--repo', REPOS[0].github, '--author', 'app/dependabot', '--state', 'open', '--json', 'number,title,url,statusCheckRollup,createdAt'], REPOS[0].pfad)
let deps = []; let depsFehler = null
try { deps = dependabot(JSON.parse(gh.out)) } catch { depsFehler = gh.err || 'gh lieferte kein JSON' }
if (gh.code !== 0 && !depsFehler) depsFehler = gh.err || `gh endete mit ${gh.code}`

// --- CI ------------------------------------------------------------------------
// Je Ablauf einzeln abfragen (ein gemeinsames Fenster würde selten laufende
// Abläufe mit Pfadfilter still verlieren). Ohne Läufe auf main (z. B. Release
// über Tags, Liste NUR_TAGS): ohne Zweig-Filter. Leere Ablaufliste = nicht prüfbar.
const RUN_FELDER = 'status,conclusion,headSha,createdAt,url'
// Abläufe, die nur bei Tags laufen — nur sie werden ohne Zweig-Filter bewertet;
// jeder andere ohne Lauf auf main gilt als „unklar“ (nicht fremde Zweige bewerten)
const NUR_TAGS = new Set(['Release Theme-Konfigurator'])
const CI_LIMIT = 20
let ci = []; let ciFehler = null
const ghAbl = cmd('gh', ['workflow', 'list', '--repo', REPOS[0].github, '--all', '--json', 'name,id,state'], REPOS[0].pfad)
let abl = null
try { abl = JSON.parse(ghAbl.out) } catch { ciFehler = ghAbl.err || 'gh workflow list: Antwort nicht lesbar' }
if (!ciFehler && (!Array.isArray(abl) || !abl.length)) ciFehler = ghAbl.err || 'gh workflow list: keine Abläufe'
if (!ciFehler) {
  const eingaben = []
  for (const a of abl) {
    const lauf = (zweig) => {
      const r = cmd('gh', ['run', 'list', '--repo', REPOS[0].github, '--workflow', String(a.id), ...(zweig ? ['--branch', 'main'] : []), '--limit', String(CI_LIMIT), '--json', RUN_FELDER], REPOS[0].pfad)
      if (r.code !== 0) throw new Error(r.err || `gh run list endete mit ${r.code}`)
      const d = JSON.parse(r.out)
      if (!Array.isArray(d)) throw new Error('gh run list: Antwort ist keine Liste')
      return d
    }
    try {
      let laeufe = lauf(true); let ohneZweig = false
      if (!laeufe.length && NUR_TAGS.has(a.name)) { laeufe = lauf(false); ohneZweig = true }
      eingaben.push({ ablauf: a.name, aktiv: a.state === 'active', laeufe, ohneZweig })
    } catch (e) { ciFehler = einzeilig(`${a.name}: ${e.message}`); break }
  }
  if (!ciFehler) ci = ciZustand(eingaben, Date.now(), CI_LIMIT)
}

// --- Drupal-Sicherheit -----------------------------------------------------
const c = cmd('composer', ['audit', '--locked', '--format=json', '--no-interaction'], REPOS[1].pfad)
const audit = composerAudit(c.out || c.err)
if (audit.fehler && c.err) audit.fehler = einzeilig(`${audit.fehler} — ${c.err}`)

// --- Läuft die Nachtprüfung? -------------------------------------------------
const wirkungen = existsSync(opt.berichte) ? readdirSync(opt.berichte).filter((f) => /^wirkung-\d{4}-\d\d-\d\d\.md$/.test(f)) : []
const letzteWirkung = wirkungen.length
  ? Math.floor((Date.now() - Math.max(...wirkungen.map((f) => statSync(path.join(opt.berichte, f)).mtimeMs))) / 86400000)
  : null

// --- Bericht ---------------------------------------------------------------
const bedarf = handlungsbedarf({ sicherung: sicherung(staende), worktrees: wts, dependabot: deps, audit, ungepusht, letzteWirkung, ci })
if (ciFehler) bedarf.push(`CI nicht prüfbar: ${ciFehler}`)
if (depsFehler) bedarf.push(`Dependabot nicht prüfbar: ${depsFehler}`)
const datum = new Date().toLocaleDateString('sv-SE')
const kurz = (h) => h ? h.slice(0, 8) : '—'
const zeilen = [
  `# Wartungsbericht ${datum}`,
  '',
  bedarf.length ? `## Handlungsbedarf\n\n${bedarf.map((b) => `- ${b}`).join('\n')}\n` : '## Handlungsbedarf\n\nkeiner\n',
  '## Sicherung (~/Sites/_sicherung)\n',
  '| Repository | master | Bündel | Zustand |', '|---|---|---|---|',
  ...sicherung(staende).map((s) => `| ${s.repo} | ${kurz(s.master)} | ${s.datei ? `${path.basename(s.datei)} (${kurz(s.buendel)})` : '—'} | ${s.status} |`),
  '',
  '## Nicht gepusht\n',
  ...ungepusht.map((u) => `- ${u.repo}: ${u.fehler ? `nicht prüfbar: ${u.fehler}` : u.anzahl === null ? 'kein entfernter Zweig eingerichtet' : `${u.anzahl} Commit(s)`}`),
  '',
  `Letzter Bericht der nächtlichen Wirkungsprüfung: ${letzteWirkung === null ? 'keiner' : `vor ${letzteWirkung} Tag(en)`}`,
  '',
  '## Worktrees\n',
  wts.length ? ['| Repository | Ordner | Zweig | letzter Commit | offen | STAND.md | Zustand |', '|---|---|---|---|---|---|---|',
    ...wts.map((w) => `| ${w.repo} | ${path.basename(w.pfad)} | ${w.zweig ?? '(abgehängt)'} | ${w.alterTage === null ? '—' : `vor ${w.alterTage} T.`} | ${w.offen ?? '—'} | ${w.stand_md ? 'ja' : '—'} | ${w.status} |`)].join('\n') : 'keine',
  '',
  '## CI (GitHub, je Ablauf)\n',
  ciFehler ? `nicht prüfbar: ${ciFehler}` : ci.length ? ci.map((c) => `- ${c.ablauf}: ${c.ergebnis}${c.sha ? ` (${c.sha})` : ''}${c.seitTage !== null ? `, rot seit ${c.mindestens ? 'mindestens ' : ''}${c.seitTage} T.` : ''}${c.ohneZweig ? ' — Läufe ohne main (z. B. Tags)' : ''}${c.laeuft ? ' — neuer Lauf läuft' : ''}${c.url ? ` — ${c.url}` : ''}`).join('\n') : 'keine Läufe',
  '',
  '## Dependabot (GitHub)\n',
  depsFehler ? `nicht prüfbar: ${depsFehler}` : deps.length ? deps.map((d) => `- #${d.nummer} ${d.titel} — CI ${d.ci}${d.alterTage !== null ? `, seit ${d.alterTage} T.` : ''} — ${d.url}`).join('\n') : 'keine offenen',
  '',
  '## Drupal-Sicherheit (composer audit --locked)\n',
  audit.fehler ? `nicht prüfbar: ${audit.fehler}` : audit.warnungen.length ? audit.warnungen.map((w) => `- ${w.paket}: ${w.titel}${w.cve ? ` (${w.cve})` : ''} — betroffen ${w.betroffen} — ${w.link}`).join('\n') : 'keine Warnungen',
  audit.verwaist?.length ? `\nNicht mehr gepflegt: ${audit.verwaist.join(', ')}` : '',
  '',
  `HANDLUNGSBEDARF: ${bedarf.length ? bedarf.join(' · ') : 'keiner'}`,
]
mkdirSync(opt.berichte, { recursive: true })
const datei = path.join(opt.berichte, `wartung-${datum}.md`)
writeFileSync(datei, zeilen.join('\n') + '\n')
console.log(`Bericht: ${datei}`)
console.log(`HANDLUNGSBEDARF: ${bedarf.length ? bedarf.join(' · ') : 'keiner'}`)
process.exit(bedarf.length ? 1 : 0)
