/**
 * @file
 * Erstellt die Arbeitsbilanz und legt sie als HTML-Seite ab.
 *
 *   npm run bilanz                      letzte 7 Tage
 *   npm run bilanz -- --wochen 4        letzte 4 Wochen
 *   npm run bilanz -- --von 2026-08-01 --bis 2026-08-18
 *   npm run bilanz -- --mail            zusaetzlich Mail an den Besitzer
 *   npm run bilanz -- --oeffnen         Seite gleich im Browser zeigen
 *
 * DER MAILWEG
 * Auf diesem Rechner laeuft kein MTA — `mail` und `sendmail` wuerden still
 * in einer Queue haengen, die niemand leert. Verschickt wird deshalb ueber
 * Mail.app (AppleScript). Das setzt voraus, dass Mail.app eingerichtet ist;
 * beim ersten Lauf fragt macOS einmalig nach der Automatisierungs-Erlaubnis.
 *
 * Schlaegt der Versand fehl, ist die Seite trotzdem geschrieben. Der Bericht
 * ist das Ergebnis, die Mail nur die Benachrichtigung — sie darf ihn nicht
 * mit sich reissen.
 */

import { execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { bilanz, tag, wurzel } from './bilanz-daten.js';
import { schreiben } from './bilanz-html.js';

const argv = process.argv.slice(2);
const arg = (n, s) => { const i = argv.indexOf(n); return i >= 0 ? argv[i + 1] : s; };
const hat = (n) => argv.includes(n);

const EMPFAENGER = arg('--an', process.env.BILANZ_MAIL || 'frank@neocosmo.de');

const bis = arg('--bis', tag(new Date()));
const wochen = +arg('--wochen', 1);
const von = arg('--von', tag(new Date(new Date(bis).getTime() - (wochen * 7 - 1) * 864e5)));

console.log(`\nARBEITSBILANZ  ${von} bis ${bis}`);
console.log('─'.repeat(76));
process.stdout.write('  Erhebe Git, Transkripte und Bestand … ');

const daten = bilanz({ von, bis });
console.log('fertig.');

const ordner = resolve(wurzel, 'data/bilanz');
mkdirSync(ordner, { recursive: true });
const name = `bilanz-${von}_${bis}`;
const seite = resolve(ordner, `${name}.html`);
schreiben(daten, seite);
writeFileSync(resolve(ordner, `${name}.json`), JSON.stringify(daten, null, 2));

// ---------------------------------------------------------------------------

const offen = daten.befunde.filter((b) => !b.gut);
const g = daten.gesamtstrecke;

console.log(`\n  ${daten.commits.length} Commits über ${new Set(daten.commits.map((c) => c.repo)).size} Repositories`);
console.log(`  ${g.vollstaendig} von ${g.beruehrt} berührten Komponenten auf ganzer Strecke`);
console.log(`  Nacharbeitsquote ${daten.nacharbeit.quote} %`);
console.log(`  Verbrauch $${daten.kosten.gesamt.toFixed(2)}${daten.kosten.abonnement ? ' (Rechenwert, Abonnement)' : ''}`);
if (offen.length) {
  console.log(`\n  ${offen.length} offene(r) Befund(e):`);
  for (const b of offen) console.log(`    ${b.titel}: ${b.text}`);
}
console.log(`\n  → ${seite}`);

// ---------------------------------------------------------------------------
// Mail
// ---------------------------------------------------------------------------

/** AppleScript-Zeichenkette. Anfuehrungszeichen und Rueckwaertsschraegstriche
 *  muessen entkommen werden, sonst bricht das Skript an einem Commit-Betreff
 *  mit Anfuehrungszeichen ab. */
const as = (s) => String(s).replace(/\\/g, '\\\\').replace(/"/g, '\\"');

function mailen() {
  const zeilen = [
    `Die Arbeitsbilanz für ${von} bis ${bis} liegt bereit.`,
    '',
    `${daten.commits.length} Commits über ${new Set(daten.commits.map((c) => c.repo)).size} Repositories.`,
    `${g.vollstaendig} von ${g.beruehrt} berührten Komponenten sind auf der ganzen Strecke bedient.`,
    `Nacharbeitsquote ${daten.nacharbeit.quote} Prozent.`,
    `Verbrauch $${daten.kosten.gesamt.toFixed(2)}${daten.kosten.abonnement ? ' (Rechenwert — Abonnement, kein Ausgabeposten).' : '.'}`,
    '',
    offen.length ? `Offen: ${offen.map((b) => b.titel).join('; ')}.` : 'Keine offenen Befunde.',
    '',
    'Die vollständige Bilanz hängt an dieser Mail und liegt unter:',
    seite,
  ].join('\n');

  const skript = `
tell application "Mail"
  set neu to make new outgoing message with properties {subject:"Arbeitsbilanz ${as(von)} bis ${as(bis)}", content:"${as(zeilen)}", visible:false}
  tell neu
    make new to recipient at end of to recipients with properties {address:"${as(EMPFAENGER)}"}
    tell content
      make new attachment with properties {file name:(POSIX file "${as(seite)}")} at after last paragraph
    end tell
  end tell
  delay 1
  send neu
end tell`;

  try {
    execFileSync('osascript', ['-e', skript], { encoding: 'utf8', timeout: 60000 });
    console.log(`  ✓ Mail an ${EMPFAENGER} verschickt.`);
    return true;
  } catch (err) {
    console.log(`\n  Mailversand fehlgeschlagen — die Bilanz selbst ist unversehrt geschrieben.`);
    console.log(`  Grund: ${String(err.stderr || err.message).trim().split('\n')[0]}`);
    console.log(`  Häufigste Ursache: Mail.app läuft nicht, oder die Automatisierung`);
    console.log(`  ist unter Systemeinstellungen › Datenschutz › Automatisierung nicht erlaubt.`);
    return false;
  }
}

if (hat('--mail')) mailen();
if (hat('--oeffnen')) { try { execFileSync('open', [seite]); } catch { /* egal */ } }

console.log('');
