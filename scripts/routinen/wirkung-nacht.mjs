#!/usr/bin/env node
// ==========================================================================
// Nächtliche Wirkungsprüfung (Agenten-Landkarte E8, 21.10.2026)
// ==========================================================================
// Prüft den lokalen Stand von main (auch Ungepushtes) mit der Ratsche aus
// R12 (apps/theme-configurator: npm run e2e:wirkung). Läuft in einem eigenen,
// festen Worktree mit abgehängtem Kopf — Franks Checkout bleibt unberührt.
// Nur Bericht: schreibt nichts fest (kein --setzen), committet nichts.
//
//   node scripts/routinen/wirkung-nacht.mjs [--quelle ~/Sites/WEBSITE26]
//        [--zweig main] [--ordner ~/Sites/_worktrees/WEBSITE26-routine]
//        [--berichte ~/Sites/_berichte]
//
// Rückgabe: 0 gut · 1 Ratsche rot (Token schlechter) · 2 Lauf abgebrochen
// Bericht:  <berichte>/wirkung-JJJJ-MM-TT.md, letzte Zeile der Ausgabe ist
//           „HANDLUNGSBEDARF: …“ oder „HANDLUNGSBEDARF: keiner“.
// ==========================================================================
import { spawnSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { parseArgs } from 'node:util'
import { ratsche, schwanz } from './lib/wirkung.mjs'

const HEIM = os.homedir()
let opt
try {
  opt = parseArgs({
    options: {
      quelle: { type: 'string', default: path.join(HEIM, 'Sites/WEBSITE26') },
      zweig: { type: 'string', default: 'main' },
      ordner: { type: 'string', default: path.join(HEIM, 'Sites/_worktrees/WEBSITE26-routine') },
      berichte: { type: 'string', default: path.join(HEIM, 'Sites/_berichte') },
    },
  }).values
} catch (e) {
  console.error(`✗ ${e.message}`)
  console.log(`HANDLUNGSBEDARF: Wirkungsprüfung nicht gestartet: ${e.message}`)
  process.exit(2)
}

const APP = path.join(opt.ordner, 'apps/theme-configurator')
const protokoll = []
const beginn = Date.now()

/** Befehl ausführen, Ausgabe sammeln; wirft bei Rückgabe ≠ 0 (außer erlaubt). */
// Zeitlimit: ein hängendes npm ci oder Playwright darf den Bericht nicht verhindern
function lauf (befehl, args, { cwd = opt.ordner, env = {}, erlaubt = false, timeout = 30 * 60_000 } = {}) {
  const r = spawnSync(befehl, args, { cwd, env: { ...process.env, ...env }, encoding: 'utf8', maxBuffer: 256 * 1024 * 1024, timeout, killSignal: 'SIGKILL' })
  if (r.error?.code === 'ETIMEDOUT') r.error.message = `Zeitlimit ${timeout / 60_000} min überschritten`
  const text = `${r.stdout ?? ''}${r.stderr ?? ''}`
  protokoll.push(`$ ${befehl} ${args.join(' ')}  (${cwd}) → ${r.status ?? r.error?.code}`)
  // Zeitlimit beendet nur den direkten Kindprozess — Reste wegräumen und immer abbrechen
  if (r.error?.code === 'ETIMEDOUT') {
    aufraeumen()
    throw Object.assign(new Error(`${befehl} ${args.join(' ')}: ${r.error.message}`), { ausgabe: text })
  }
  if (r.status !== 0 && !erlaubt) {
    const f = new Error(`${befehl} ${args.join(' ')} → ${r.status ?? r.error?.message}`)
    f.ausgabe = text || r.error?.message || ''
    throw f
  }
  return { code: r.status, text }
}
const PORTS = ['3190', '3191']
/**
 * Reste eines abgebrochenen Laufs beenden: nur Prozesse, die im Routine-Ordner
 * laufen (Befehlszeile oder Arbeitsordner) — z. B. Docs-Server und Attrappe auf
 * den eigenen Ports, die sonst jeden Folgelauf blockieren (CI=1: keine Wiederverwendung).
 */
function aufraeumen () {
  const eigen = (pid) => {
    const r = spawnSync('lsof', ['-a', '-p', pid, '-d', 'cwd', '-Fn'], { encoding: 'utf8' })
    const ordner = (r.stdout ?? '').split('\n').find((z) => z.startsWith('n'))?.slice(1) ?? ''
    return ordner === opt.ordner || ordner.startsWith(opt.ordner + path.sep)
  }
  const pids = new Set()
  for (const port of PORTS) {
    const r = spawnSync('lsof', ['-t', `-iTCP:${port}`, '-sTCP:LISTEN'], { encoding: 'utf8' })
    for (const pid of (r.stdout ?? '').split('\n').filter(Boolean)) if (eigen(pid)) pids.add(pid)
  }
  // Programme aus dem Ordner (z. B. …/node_modules/.bin/playwright); nie dieser Lauf oder sein Aufrufer
  const p = spawnSync('pgrep', ['-f', opt.ordner + path.sep], { encoding: 'utf8' })
  for (const pid of (p.stdout ?? '').split('\n').filter(Boolean)) if (![process.pid, process.ppid].includes(Number(pid))) pids.add(pid)
  for (const pid of pids) { try { process.kill(Number(pid), 'SIGKILL') } catch {} }
  if (pids.size) protokoll.push(`aufgeräumt: ${pids.size} Prozess(e) aus einem früheren oder abgebrochenen Lauf`)
}

// git immer mit -C; Arbeitsordner = Quelle, weil der Routine-Ordner anfangs fehlt
const git = (...a) => lauf('git', a, { cwd: opt.quelle }).text.trim()
const hash = (datei) => existsSync(datei) ? createHash('sha256').update(readFileSync(datei)).digest('hex') : 'fehlt'

function vorbereiten () {
  const ziel = git('-C', opt.quelle, 'rev-parse', '--verify', '--end-of-options', `${opt.zweig}^{commit}`)
  if (!existsSync(opt.ordner)) {
    lauf('git', ['-C', opt.quelle, 'worktree', 'add', '--detach', opt.ordner, ziel], { cwd: opt.quelle })
  } else {
    const schmutz = git('-C', opt.ordner, 'status', '--porcelain')
    if (schmutz) throw Object.assign(new Error('Routine-Worktree hat Änderungen — nicht verworfen, bitte ansehen'), { ausgabe: schmutz })
    git('-C', opt.ordner, 'switch', '--quiet', '--detach', ziel)
  }
  // Abhängigkeiten nur neu, wenn sich die Sperrdatei geändert hat
  const standDatei = path.resolve(opt.ordner, git('-C', opt.ordner, 'rev-parse', '--git-path', 'routine-stand.json'))
  const alt = existsSync(standDatei) ? JSON.parse(readFileSync(standDatei, 'utf8')) : {}
  // Node-Version gehört dazu: nach einem Wechsel müssen native Module neu gebaut werden
  const neu = { node: process.version, wurzel: hash(path.join(opt.ordner, 'package-lock.json')), app: hash(path.join(APP, 'package-lock.json')) }
  if (alt.node !== neu.node || alt.wurzel !== neu.wurzel || !existsSync(path.join(opt.ordner, 'node_modules'))) lauf('npm', ['ci', '--no-audit', '--no-fund'])
  if (alt.node !== neu.node || alt.app !== neu.app || !existsSync(path.join(APP, 'node_modules'))) {
    lauf('npm', ['ci', '--no-audit', '--no-fund'], { cwd: APP })
    // passender Browser zur (evtl. neuen) Playwright-Version
    lauf('npx', ['playwright', 'install', 'chromium'], { cwd: APP })
  }
  writeFileSync(standDatei, JSON.stringify(neu) + '\n')
  return ziel
}

// Auffangnetz: auch bei einem unerwarteten Fehler endet die Ausgabe mit HANDLUNGSBEDARF
process.on('uncaughtException', (e) => {
  console.error(e)
  console.log(`HANDLUNGSBEDARF: Wirkungsprüfung unerwartet abgebrochen: ${String(e?.message ?? e).replace(/\s+/g, ' ').slice(0, 160)}`)
  process.exit(2)
})

let ziel = null; let r = null; let fehler = null; let ausgabe = ''
try {
  aufraeumen()
  ziel = vorbereiten()
  lauf('npm', ['run', 'build:css'])
  lauf('npm', ['run', 'config:build'])
  // CI=1: eigene Server statt fremder auf demselben Port, Wiederholung wie in der CI
  const e = lauf('npm', ['run', 'e2e:wirkung'], { cwd: APP, env: { CI: '1', E2E_PORT: '3190', E2E_DRUPAL_PORT: '3191' }, erlaubt: true })
  ausgabe = e.text
  r = ratsche(e.text, e.code)
} catch (e) {
  fehler = e.message
  ausgabe = e.ausgabe ?? ''
}

const urteil = fehler ? 'abgebrochen' : r.urteil
const datum = new Date().toLocaleDateString('sv-SE')
let kopf = '—'
try { if (ziel) kopf = git('-C', opt.quelle, 'log', '-1', '--format=%h %s', ziel) } catch {}
const bedarf = urteil === 'gut' ? 'keiner'
  : urteil === 'schlechter' ? `${r.anzahl} Token(s) schlechter als festgeschrieben`
    : `Wirkungsprüfung abgebrochen${fehler ? `: ${fehler.replace(/\s+/g, ' ').slice(0, 160)}` : ''}`

const bericht = [
  `# Wirkungsprüfung ${datum}`,
  '',
  `- Stand: ${opt.zweig} ${kopf}`,
  `- Urteil: **${urteil}**${r?.zeile ? ` — ${r.zeile}` : ''}`,
  `- Dauer: ${Math.round((Date.now() - beginn) / 1000)} s · Last: ${os.loadavg()[0].toFixed(1)}`,
  r?.besser ? `- Besser geworden: ${r.besser} Token(s) — festschreiben mit \`node scripts/wirkung.mjs --setzen\` (apps/theme-configurator), nur nach Franks OK` : null,
  '',
  r?.schlechter.length ? `## Schlechter\n\n${r.schlechter.map((s) => `- \`${s}\``).join('\n')}\n` : null,
  urteil === 'gut' ? null : `## Ausgabe (Ende)\n\n\`\`\`\n${schwanz(ausgabe, 40)}\n\`\`\`\n`,
  `## Schritte\n\n${protokoll.map((p) => `- \`${p}\``).join('\n')}`,
  '',
  `HANDLUNGSBEDARF: ${bedarf}`,
].filter((z) => z !== null).join('\n') + '\n'

mkdirSync(opt.berichte, { recursive: true })
const datei = path.join(opt.berichte, `wirkung-${datum}.md`)
writeFileSync(datei, bericht)
console.log(`Bericht: ${datei}`)
console.log(`Urteil: ${urteil}${r?.zeile ? ` — ${r.zeile}` : ''}`)
console.log(`HANDLUNGSBEDARF: ${bedarf}`)
process.exit(urteil === 'gut' ? 0 : urteil === 'schlechter' ? 1 : 2)
