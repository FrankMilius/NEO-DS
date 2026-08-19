/**
 * Widersacher — Phase 3.5
 *
 * Die einzige Phase, die nicht prueft, ob der Code laeuft, sondern ob die
 * SCHLUSSFOLGERUNG traegt. Sie bestaetigt nichts; sie versucht zu widerlegen.
 *
 * WARUM ES SIE GIBT
 * Die Phasen davor finden Fehler im Code. Sie finden keine Fehler im Urteil.
 * Genau dort lagen die teuersten dieses Projekts:
 *   - eine als abgeschlossen gemeldete Palettenumstellung, die zur Haelfte
 *     wirkungslos war (39 Token in neo-overrides.css, das spaeter laedt)
 *   - Element-Stile auf .neo-mono-*, waehrend die Website .neo-light-theme traegt
 *   - 19 „verschwundene" Komponenten, die eine einmal leer zurueckgekommene
 *     Seite waren
 *
 * WAS SIE PRUEFT
 * Meldet eine fruehere Phase einen Befund ueber ein Token, dann lautet die
 * darin steckende Behauptung: „Dieses Token existiert und wirkt." Genau die
 * laesst sich widerlegen — mit `npm run widerlegen -- --token`, das nicht in
 * die Quelle sieht, sondern in die AUSLIEFERUNG.
 *
 * WAS SIE NICHT TUT
 * Sie erfindet keine Behauptungen. Findet sie in den Befunden nichts
 * Pruefbares, meldet sie das und haelt niemanden auf. Eine Phase, die immer
 * etwas zu sagen hat, wird ignoriert.
 */

import { logPass, logFail, logWarn, logInfo, run, createResult, fileExists } from './shared.mjs';

const AGENT = 'Widersacher';

// Hoechstens so viele Behauptungen je Lauf. Jede kostet einen Browserstart
// und rund fuenf Sekunden; zwanzig Befunde wuerden die Pipeline von zwei
// Sekunden auf zwei Minuten dehnen, und niemand liesse sie dann noch laufen.
const HOECHSTENS = 4;

/**
 * Zieht pruefbare Behauptungen aus den Befunden der frueheren Phasen.
 *
 * Bewusst eng: Nur Token-Namen, und nur solche, die wie ein Token dieses
 * Projekts aussehen. Lieber nichts zu pruefen finden als etwas Erfundenes.
 */
function behauptungenFinden(phasen) {
  const gefunden = new Map();

  for (const phase of phasen) {
    for (const ergebnis of phase.results || []) {
      if (ergebnis.status === 'pass') continue;
      const text = `${ergebnis.output || ''} ${ergebnis.error || ''}`;
      for (const m of text.matchAll(/--?(nc|fnd|nn)-[a-z0-9-]{3,}/g)) {
        const name = m[0].startsWith('--') ? m[0] : `--${m[0]}`;
        if (!gefunden.has(name)) {
          gefunden.set(name, { art: '--token', ziel: name, quelle: ergebnis.agent });
        }
      }
    }
  }
  return [...gefunden.values()];
}

/** Laeuft die Website? Ohne sie misst das Werkzeug nichts und meldet
 *  faelschlich „keine Deklaration gefunden" — ein Fehlurteil waere schlimmer
 *  als eine ehrliche Fehlanzeige. */
function seiteErreichbar() {
  const basis = process.env.NEO_BASIS || 'https://piipe-workplace.ddev.site';
  const r = run(`curl -s -o /dev/null -w "%{http_code}" --insecure --max-time 8 ${basis}/`, { timeout: 12000, silent: true });
  return r.ok && /^(200|30\d)$/.test(r.output.trim());
}

export async function widersacherAgent(phasen, optionen = {}) {
  const start = Date.now();
  const ergebnisse = [];

  // ── 1 · Laeuft ueberhaupt etwas an? ──────────────────────────────────
  const hatBefunde = phasen.some((p) => p.status === 'warn' || p.status === 'fail');
  if (!hatBefunde && !optionen.immer) {
    logInfo(AGENT, 'Keine Befunde in Phase 1–3 — nichts zu widerlegen.');
    return {
      agent: AGENT, status: 'pass', uebersprungen: true,
      grund: 'keine Befunde',
      results: [createResult('widersacher', 'pass', { hinweis: 'nicht gelaufen — keine Befunde' })],
      duration: Date.now() - start,
    };
  }

  // ── 2 · Was laesst sich widerlegen? ──────────────────────────────────
  const alle = behauptungenFinden(phasen);
  if (!alle.length) {
    logInfo(AGENT, 'Befunde vorhanden, aber keine pruefbare Behauptung darin.');
    return {
      agent: AGENT, status: 'pass', uebersprungen: true,
      grund: 'nichts Pruefbares',
      results: [createResult('widersacher', 'pass', { hinweis: 'Befunde ohne Token-Bezug' })],
      duration: Date.now() - start,
    };
  }

  const behauptungen = alle.slice(0, HOECHSTENS);
  // Eine stille Deckelung liest sich wie Vollstaendigkeit. Deshalb wird
  // ausgesprochen, was liegen bleibt.
  if (alle.length > behauptungen.length) {
    logWarn(AGENT, `${alle.length} Behauptungen gefunden, ${behauptungen.length} geprueft — ${alle.length - behauptungen.length} nicht angesehen.`);
  }

  // ── 3 · Voraussetzung ────────────────────────────────────────────────
  //
  // Auf einem Bauserver gibt es keine laufende Website — und es kann keine
  // geben. Eine Warnung, die dort bei JEDEM Lauf erscheint und nie behebbar
  // ist, ist Rauschen; sie wuerde genauso ignoriert wie der Test, der eine
  // Woche lang rot war. Deshalb wird hier ausdruecklich uebersprungen statt
  // gewarnt, mit Nennung des Grundes.
  if (process.env.CI && !optionen.auchImCI) {
    logInfo(AGENT, 'Bauserver ohne laufende Website — Phase uebersprungen.');
    return {
      agent: AGENT, status: 'pass', uebersprungen: true,
      grund: 'CI ohne Website',
      results: [createResult('widersacher', 'pass', {
        hinweis: 'Auf dem Bauserver nicht durchfuehrbar. Die Widerlegung gehoert an den Arbeitsplatz, wo die Website laeuft.',
      })],
      duration: Date.now() - start,
    };
  }

  if (!seiteErreichbar()) {
    logWarn(AGENT, 'Website nicht erreichbar — Widerlegung nicht durchfuehrbar.');
    return {
      agent: AGENT, status: 'warn',
      results: [createResult('widersacher', 'warn', {
        error: 'Website nicht erreichbar (ddev start?). Die Behauptungen bleiben ungeprueft — das ist KEINE Entlastung.',
      })],
      duration: Date.now() - start,
    };
  }

  // ── 4 · Widerlegen ───────────────────────────────────────────────────
  logInfo(AGENT, `${behauptungen.length} Behauptung(en) auf dem Pruefstand.`);
  let widerlegt = 0;
  let verdaechtig = 0;

  for (const b of behauptungen) {
    const r = run(`npm run widerlegen -- ${b.art} ${b.ziel} --streng --pfad / 2>&1`, { timeout: 90000, silent: true });
    const urteil = (/^URTEIL (\S+)/m.exec(r.output) || [])[1] || 'UNKLAR';

    if (urteil === 'WIDERLEGT') {
      widerlegt++;
      logFail(AGENT, `WIDERLEGT: ${b.ziel} (aus ${b.quelle})`);
      ergebnisse.push(createResult(`widerlegt:${b.ziel}`, 'fail', {
        error: `Die Behauptung haelt in der Auslieferung nicht. Quelle des Befunds: ${b.quelle}.`,
      }));
    } else if (urteil === 'VERDAECHTIG') {
      verdaechtig++;
      logWarn(AGENT, `VERDAECHTIG: ${b.ziel} — mehrere Dateien setzen es`);
      ergebnisse.push(createResult(`verdaechtig:${b.ziel}`, 'warn', {
        error: 'Mehr als eine Datei setzt dieses Token. Eine Aenderung an der falschen bleibt wirkungslos.',
      }));
    } else {
      logPass(AGENT, `kein Gegenbeweis: ${b.ziel}`);
      ergebnisse.push(createResult(`kein-gegenbeweis:${b.ziel}`, 'pass'));
    }
  }

  // ── 5 · Urteil ───────────────────────────────────────────────────────
  const status = widerlegt ? 'fail' : verdaechtig ? 'warn' : 'pass';

  if (widerlegt) {
    logFail(AGENT, `SPERRE: ${widerlegt} Behauptung(en) widerlegt. Nichts gilt als fertig, bevor neu gemessen wurde.`);
  } else if (verdaechtig) {
    logWarn(AGENT, `${verdaechtig} verdaechtig — Gegenprobe empfohlen, bevor etwas als erledigt gilt.`);
  } else {
    logPass(AGENT, 'Kein Gegenbeweis. Das ist kein Beweis — nur: hier nicht gescheitert.');
  }

  return { agent: AGENT, status, results: ergebnisse, gesperrt: widerlegt > 0, duration: Date.now() - start };
}
