// Docker-Bildvergleich der Konfig-App (E3, 21.10.2026).
// Bisher von Hand aus LIESMICH: docker run im Playwright-Abbild, Linux-Pakete
// in eigenen Volumes, dann `npm run e2e:visuell` in apps/theme-configurator.
// Die Referenzbilder gibt es nur für Linux (e2e/README.md), deshalb Docker.

const OHNE_FARBE = /\u001b\[[0-9;]*m/g

/** Zusammenfassung der Playwright-Ausgabe; null, wenn keine da ist. */
export function liesErgebnis (text) {
  const t = text.replace(OHNE_FARBE, '')
  const zahl = (wort) => Number(t.match(new RegExp(`^\\s*(\\d+) ${wort}\\b`, 'm'))?.[1] ?? 0)
  const e = { passed: zahl('passed'), failed: zahl('failed'), flaky: zahl('flaky'), skipped: zahl('skipped') }
  return Object.values(e).some(Boolean) ? e : null
}

/** 'mcr.microsoft.com/playwright:v1.64.1-noble' → '1.64.1' */
export function versionAusAbbild (abbild) {
  return abbild.match(/playwright:v(\d+\.\d+\.\d+)/)?.[1] ?? null
}

/** Argumente für `docker`; wurzel ist der Worktree, im Container unter demselben Pfad. */
export function dockerArgumente ({ wurzel, einst, aktualisieren = false }) {
  const ci = (wer) => `npm ci --no-audit --no-fund >/dev/null 2>&1 || { echo "npm ci (${wer}) fehlgeschlagen" >&2; exit 3; }`
  const lauf = 'npm run e2e:visuell' + (aktualisieren ? ' -- --update-snapshots=all' : '')
  return [
    'run', '--rm', '--ipc=host',
    '-v', `${einst.dockerEinhaengen}:${einst.dockerEinhaengen}`,
    '-v', `${einst.dockerVolumes.wurzel}:${wurzel}/node_modules`,
    '-v', `${einst.dockerVolumes.app}:${wurzel}/apps/theme-configurator/node_modules`,
    '-w', wurzel,
    einst.dockerAbbild,
    'bash', '-c', `${ci('Wurzel')}; cd apps/theme-configurator && ${ci('App')}; ${lauf}`,
  ]
}
