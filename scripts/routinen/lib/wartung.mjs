// Wartungsbericht (E8, 21.10.2026): reine Auswertung ohne Seiteneffekte,
// getestet in tests/routinen/wartung.test.mjs. Das Einsammeln (git, gh,
// composer) steht in ../wartung.mjs.

const TAG = 86400000

/**
 * Sicherung: Ist jedes Bündel auf dem Stand von master und lesbar? Liegt
 * master schon auf dem entfernten Repository, braucht es kein Bündel („gepusht“).
 * @param {{ repo: string, master: string|null, buendel: string|null, lesbar?: boolean, gepusht?: boolean }[]} staende
 *   buendel = Hash von refs/heads/master im Bündel; lesbar = Probe-Übernahme gelang
 */
export function sicherung (staende) {
  return staende.map((s) => {
    let status
    if (!s.master) status = 'master nicht lesbar'
    else if (s.buendel && s.lesbar === false && !s.gepusht) status = 'beschädigt'
    else if (s.buendel && s.buendel === s.master) status = 'aktuell'
    else if (s.gepusht) status = 'gepusht'
    else status = s.buendel ? 'veraltet' : 'fehlt'
    return { ...s, status }
  })
}

/**
 * Worktrees einordnen. „erledigt“, wenn der Zweig in der Basis steckt und
 * nichts offen ist. Ein frisch angelegter Punkt steht ebenfalls auf der Basis —
 * er hat aber noch keine eigenen Commits (Reflog des Zweigs nur „Created from“).
 * Liegt noch eine STAND.md (unversioniert), heißt es „erst sichern“.
 * @param {{ pfad: string, zweig: string|null, letzterCommit?: number, inBasis?: boolean, offen?: number, stand_md?: boolean, eigeneCommits?: boolean, fehlt?: boolean, fehler?: string }[]} liste
 * @param {number} jetzt  ms seit Epoche
 */
export function worktrees (liste, jetzt, tage = 7) {
  return liste.map((w) => {
    if (w.fehlt) return { ...w, alterTage: null, status: 'Ordner fehlt — git worktree prune' }
    if (w.fehler) return { ...w, alterTage: null, status: `nicht lesbar: ${w.fehler}` }
    const alterTage = Math.floor((jetzt - w.letzterCommit) / TAG)
    let status = 'in Arbeit'
    if (w.inBasis && w.offen === 0 && w.eigeneCommits !== false) status = w.stand_md ? 'erledigt — STAND.md erst sichern' : 'erledigt — kann weg'
    else if (alterTage > tage) status = `liegt seit ${alterTage} Tagen`
    return { ...w, alterTage, status }
  })
}

const GRUEN = /^(SUCCESS|SKIPPED|NEUTRAL)$/
const LAEUFT = /^(PENDING|IN_PROGRESS|QUEUED|EXPECTED|WAITING|REQUESTED)$/

/** Dependabot-Pull-Requests mit zusammengefasstem CI-Zustand. Alles, was weder grün noch laufend ist, gilt als rot. */
export function dependabot (prs, jetzt = Date.now()) {
  return prs.map((p) => {
    const zustaende = (p.statusCheckRollup ?? []).map((c) => String(c.conclusion || c.state || c.status || 'UNBEKANNT').toUpperCase())
    const ci = !zustaende.length ? 'ohne CI'
      : zustaende.some((z) => !GRUEN.test(z) && !LAEUFT.test(z)) ? 'rot'
        : zustaende.some((z) => LAEUFT.test(z)) ? 'läuft' : 'grün'
    return { nummer: p.number, titel: p.title, url: p.url, ci, alterTage: p.createdAt ? Math.floor((jetzt - Date.parse(p.createdAt)) / TAG) : null }
  })
}

const CI_ROT = /^(FAILURE|TIMED_OUT|STARTUP_FAILURE|ACTION_REQUIRED)$/
const CI_UEBERGEHEN = /^(SKIPPED|CANCELLED|NEUTRAL)$/

/**
 * CI-Zustand je GitHub-Ablauf. Eingabe je Ablauf: { ablauf, aktiv, laeufe, ohneZweig }
 * (laeufe aus gh run list --workflow … --json status,conclusion,headSha,createdAt,url).
 * Maßgeblich ist der neueste abgeschlossene Lauf; übersprungene und abgebrochene
 * (z. B. von einem neueren Push abgelöste) zählen nicht. Grün nur bei SUCCESS —
 * alles Unbekannte (stale, leer, keine Läufe) heißt „unklar“ und ist Handlungsbedarf.
 * „seitTage“ = Alter des ersten Laufs der roten Strecke; „mindestens“, wenn die
 * Strecke bis an das Ende der abgefragten Läufe reicht.
 */
export function ciZustand (ablaeufe, jetzt = Date.now(), limit = 20) {
  return ablaeufe.map(({ ablauf, aktiv = true, laeufe = [], ohneZweig = false }) => {
    const leer = { ablauf, ohneZweig, laeuft: false, sha: null, seitTage: null, mindestens: false, url: null }
    if (!aktiv) return { ...leer, ergebnis: 'deaktiviert' }
    const liste = [...laeufe].sort((x, y) => Date.parse(y.createdAt) - Date.parse(x.createdAt))
    const laeuft = liste.length > 0 && liste[0].status !== 'completed'
    const fertig = liste.filter((l) => l.status === 'completed' && !CI_UEBERGEHEN.test(String(l.conclusion ?? '').toUpperCase()))
    if (!fertig.length) return { ...leer, laeuft, ergebnis: 'unklar' }
    const art = (l) => { const c = String(l.conclusion ?? '').toUpperCase(); return c === 'SUCCESS' ? 'grün' : CI_ROT.test(c) ? 'rot' : 'unklar' }
    const neu = fertig[0]
    const basis = { ...leer, laeuft, sha: String(neu.headSha ?? '').slice(0, 8) || null, url: neu.url ?? null }
    if (art(neu) !== 'rot') return { ...basis, ergebnis: art(neu) }
    let n = 0
    while (n < fertig.length && art(fertig[n]) === 'rot') n++
    const erster = fertig[n - 1]
    return { ...basis, ergebnis: 'rot', seitTage: Math.floor((jetzt - Date.parse(erster.createdAt)) / TAG), mindestens: n === fertig.length && liste.length >= limit }
  }).sort((x, y) => x.ablauf.localeCompare(y.ablauf))
}

/** Ausgabe von `composer audit --format=json`; Vorspann (Hinweise, Warnungen) davor wird übersprungen. */
export function composerAudit (text) {
  const t = String(text)
  let d = null
  // Anfang: Zeile mit „{“; Ende: Zeile mit „}“ — Text davor und danach (Hinweise, Warnungen) fällt weg
  const enden = [...t.matchAll(/^\}[ \t]*$/gm)].map((m) => m.index + 1).reverse()
  suche: for (const m of t.matchAll(/^\{/gm)) {
    for (const e of [t.length, ...enden]) {
      if (e <= m.index) continue
      try { d = JSON.parse(t.slice(m.index, e)); break suche } catch {}
    }
  }
  if (!d) return { fehler: /\{/.test(t) ? 'JSON nicht lesbar' : 'keine JSON-Ausgabe' }
  const adv = d.advisories && !Array.isArray(d.advisories) ? Object.entries(d.advisories).flatMap(([paket, l]) => (Array.isArray(l) ? l : Object.values(l)).map((a) => ({ paket, titel: a.title, cve: a.cve, betroffen: a.affectedVersions, link: a.link }))) : []
  const verwaist = Object.keys(d.abandoned ?? {})
  return { warnungen: adv, verwaist }
}

/** Mehrzeilige Fehlertexte auf eine Zeile bringen (die letzte Ausgabezeile muss HANDLUNGSBEDARF sein). */
export function einzeilig (text, max = 160) {
  const t = String(text ?? '').replace(/\s+/g, ' ').trim()
  return t.length > max ? t.slice(0, max - 1) + '…' : t
}

/**
 * Handlungsbedarf aus allen Teilen: kurze Liste für Benachrichtigung und Kopf.
 * letzteWirkung = Alter des neuesten Nachtberichts in Tagen (null = keiner).
 */
export function handlungsbedarf ({ sicherung = [], worktrees = [], dependabot = [], audit = {}, ungepusht = [], letzteWirkung = 0, depAlter = 14, ci = [] }) {
  const p = []
  for (const c of ci) {
    if (c.ergebnis === 'rot') p.push(`CI rot: ${c.ablauf}${c.seitTage !== null ? ` (seit ${c.mindestens ? 'mindestens ' : ''}${c.seitTage} T.)` : ''}`)
    else if (c.ergebnis === 'unklar') p.push(`CI unklar: ${c.ablauf} (kein auswertbarer Lauf)`)
    else if (c.ergebnis === 'deaktiviert') p.push(`CI-Ablauf deaktiviert: ${c.ablauf}`)
  }
  for (const s of sicherung) if (!['aktuell', 'gepusht'].includes(s.status)) p.push(`Sicherung ${s.repo} ${s.status}`)
  if (audit.fehler) p.push(`Drupal-Sicherheit nicht prüfbar: ${audit.fehler}`)
  if (audit.warnungen?.length) p.push(`${audit.warnungen.length} Drupal-Sicherheitswarnung(en)`)
  const rot = dependabot.filter((d) => d.ci === 'rot')
  if (rot.length) p.push(`${rot.length} Dependabot-PR mit roter CI`)
  const alt = dependabot.filter((d) => d.ci !== 'rot' && d.alterTage > depAlter)
  if (alt.length) p.push(`${alt.length} Dependabot-PR seit über ${depAlter} Tagen offen`)
  const weg = worktrees.filter((w) => w.status.startsWith('erledigt') || w.fehlt || w.fehler)
  if (weg.length) p.push(`${weg.length} Worktree(s) zum Aufräumen oder Nachsehen`)
  for (const u of ungepusht) {
    if (u.fehler) p.push(`${u.repo}: Ungepushtes nicht prüfbar (${u.fehler})`)
    else if (u.anzahl >= 10) p.push(`${u.repo}: ${u.anzahl} Commits nicht gepusht`)
  }
  if (letzteWirkung === null) p.push('Nächtliche Wirkungsprüfung: noch kein Bericht')
  else if (letzteWirkung > 2) p.push(`Nächtliche Wirkungsprüfung seit ${letzteWirkung} Tagen ohne Bericht`)
  return p
}
