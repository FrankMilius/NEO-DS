/**
 * @file
 * Markierte Aufnahme-Abschnitte ERGAENZEN statt ersetzen.
 *
 * Genutzt von scripts/komponente-aufnehmen.js (SCSS-Partial und
 * Token-Datei) und von der Verlustpruefung ueber die Git-Historie.
 *
 * ANLASS (06.10.2026)
 * Bis dahin ersetzte ein zweiter Aufnahme-Lauf alles zwischen
 *   / * >>> aufgenommen: <marke> * /  …  / * <<< aufgenommen: <marke> * /
 * durch das, was der Lauf gerade im Theme fand. Ein zweiter Lauf findet aber
 * nur noch die NACHZUEGLER — die Regeln des ersten Laufs hat der erste Lauf im
 * Theme schon entfernt. So verschwanden am 12.08.2026 (8b04d29c) rund 20
 * Regeln von hero-tom aus dem DS; aufgefallen am 06.10.2026, als der Hero auf
 * der Website ungestaltet war.
 *
 * REGELN DIESES MODULS
 * - Einheit ist eine Regel (Selektor im @-Kontext) bzw. im Modus
 *   „deklarationen“ (Token-Datei) eine Eigenschaft (`:root » --name`).
 * - Neue Einheiten werden an den vorhandenen Abschnitt ANGEHAENGT.
 * - Gleiche Einheit mit gleichem Inhalt: wird nicht doppelt geschrieben.
 *   Das gilt auch fuer Regeln AUSSERHALB der Marker in derselben Datei (etwa
 *   von Hand wiederhergestellte, wie bei hero-tom seit 06.10.2026).
 * - Gleiche Einheit mit anderem Inhalt: KONFLIKT — der Aufrufer bricht ab,
 *   ohne zu schreiben. Nur `ersetzen: true` ersetzt den Abschnitt bewusst.
 * - Schutzpruefung: Jede Einheit, die vorher im Abschnitt stand, muss nachher
 *   mindestens so oft darin stehen. Sonst Fehler (ausser bei `ersetzen`).
 */

const KOMMENTAR_RE = /\/\*[\s\S]*?\*\//g;

/** Kommentare (auch SCSS-Zeilenkommentare) und String-Inhalte durch Leerzeichen
 *  bzw. Platzhalter ersetzen — gleiche Laenge, damit Positionen stimmen. */
function maskieren(text) {
  const out = text.split('');
  let i = 0;
  while (i < text.length) {
    const c = text[i];
    if (c === '/' && text[i + 1] === '*') {
      const e = text.indexOf('*/', i + 2);
      const ende = e < 0 ? text.length : e + 2;
      for (let k = i; k < ende; k++) if (out[k] !== '\n') out[k] = ' ';
      i = ende; continue;
    }
    // `//` ist nur dann ein Zeilenkommentar, wenn davor Anfang, Leerraum oder
    // ein Satzzeichen der Struktur steht — nicht in `url(//cdn…)` oder `http://`.
    if (c === '/' && text[i + 1] === '/' && (i === 0 || /[\s;{}]/.test(text[i - 1]))) {
      const e = text.indexOf('\n', i);
      const ende = e < 0 ? text.length : e;
      for (let k = i; k < ende; k++) out[k] = ' ';
      i = ende; continue;
    }
    if (c === '"' || c === "'") {
      let k = i + 1;
      while (k < text.length && text[k] !== c && text[k] !== '\n') { if (text[k] === '\\') k++; k++; }
      for (let m = i + 1; m < k && m < text.length; m++) if (/[{};]/.test(out[m])) out[m] = '_';
      i = k + 1; continue;
    }
    // SCSS-Interpolation #{…} enthaelt Klammern, die keine Bloecke sind.
    if (c === '#' && text[i + 1] === '{') {
      const e = text.indexOf('}', i);
      const ende = e < 0 ? text.length : e + 1;
      for (let k = i; k < ende; k++) out[k] = '_';
      i = ende; continue;
    }
    i++;
  }
  return out.join('');
}

/** Zerlegt CSS/SCSS in Bloecke und Deklarationen, mit Positionen im Original.
 *  Wirft bei unausgeglichenen Klammern. */
export function zerlege(text) {
  const m = maskieren(text);
  const ohneKommentar = text.replace(KOMMENTAR_RE, (x) => x.replace(/[^\n]/g, ' '));
  const wurzel = { art: 'wurzel', kinder: [] };
  const stapel = [wurzel];
  let seg = 0;
  const anweisung = (bis) => {
    const roh = m.slice(seg, bis);
    if (!roh.trim()) return;
    const start = seg + roh.search(/\S/);
    const quelle = ohneKommentar.slice(start, bis).replace(/\/\/[^\n]*/g, (x, o, s) => (o === 0 || /[\s;{}]/.test(s[o - 1]) ? '' : x));
    const doppel = quelle.indexOf(':');
    const oben = stapel[stapel.length - 1];
    if (doppel > 0 && oben.art === 'block') {
      oben.kinder.push({ art: 'dekl', name: quelle.slice(0, doppel).trim(), wert: quelle.slice(doppel + 1).trim(), start, end: bis + (m[bis] === ';' ? 1 : 0) });
    } else {
      oben.kinder.push({ art: 'anweisung', text: quelle.trim(), start, end: bis + 1 });
    }
  };
  for (let i = 0; i < m.length; i++) {
    const c = m[i];
    if (c === '{') {
      const roh = m.slice(seg, i);
      const start = seg + Math.max(0, roh.search(/\S/));
      const prelude = text.slice(start, i).replace(KOMMENTAR_RE, ' ').trim();
      const knoten = { art: 'block', prelude, start, kinder: [] };
      stapel[stapel.length - 1].kinder.push(knoten);
      stapel.push(knoten);
      seg = i + 1;
    } else if (c === ';') {
      anweisung(i);
      seg = i + 1;
    } else if (c === '}') {
      anweisung(i);
      if (stapel.length < 2) throw new Error(`Unausgeglichene Klammer "}" an Position ${i}`);
      stapel.pop().end = i + 1;
      seg = i + 1;
    }
  }
  if (stapel.length > 1) throw new Error(`Unausgeglichene Klammer: Block „${stapel[stapel.length - 1].prelude}“ wird nicht geschlossen`);
  return wurzel.kinder;
}

const normSel = (s) => s.replace(/\s+/g, ' ').replace(/\s*([,>+~])\s*/g, '$1').trim();
const normAt = (s) => s.replace(/\s+/g, ' ').replace(/\(\s+/g, '(').replace(/\s+\)/g, ')').replace(/\s*:\s*/g, ': ').trim();
const normWert = (s) => s.replace(/\s+/g, ' ').replace(/\s*!\s*important$/i, ' !important').trim();
const istAt = (k) => k.art === 'block' && k.prelude.startsWith('@');

function normRumpf(knoten) {
  return knoten.kinder.map((k) => {
    if (k.art === 'dekl') return `${k.name}:${normWert(k.wert)}`;
    if (k.art === 'block') return `${istAt(k) ? normAt(k.prelude) : normSel(k.prelude)}{${normRumpf(k)}}`;
    return normWert(k.text);
  }).join(';');
}

/** Einheiten (Schluessel + normalisierter Inhalt) eines zerlegten Textes.
 *  modus „regeln“: je Regel (Selektor im @-Kontext), Inhalt = Rumpf.
 *  modus „deklarationen“: je Eigenschaft einer Regel, Inhalt = Wert. */
export function einheiten(knoten, modus = 'regeln', pfad = []) {
  const r = [];
  for (const k of knoten) {
    if (k.art !== 'block') continue;
    if (istAt(k)) { r.push(...einheiten(k.kinder, modus, [...pfad, normAt(k.prelude)])); continue; }
    const sel = normSel(k.prelude);
    if (modus === 'regeln') {
      r.push({ schluessel: [...pfad, sel].join(' » '), inhalt: normRumpf(k), knoten: k });
    } else {
      for (const d of k.kinder) {
        if (d.art === 'dekl') r.push({ schluessel: [...pfad, sel, d.name].join(' » '), inhalt: normWert(d.wert), knoten: d });
      }
      r.push(...einheiten(k.kinder.filter((x) => x.art === 'block'), modus, [...pfad, sel]));
    }
  }
  return r;
}

const zaehlen = (liste) => {
  const z = new Map();
  for (const e of liste) z.set(e.schluessel, (z.get(e.schluessel) || 0) + 1);
  return z;
};

const marken = (marke) => ({ auf: `/* >>> aufgenommen: ${marke} */`, zu: `/* <<< aufgenommen: ${marke} */` });

/** Liefert den Inhalt des Abschnitts `marke` oder null. Wirft bei doppelten
 *  oder vertauschten Markern. */
export function abschnittLesen(text, marke) {
  const { auf, zu } = marken(marke);
  const i = text.indexOf(auf), j = text.indexOf(zu);
  if (i < 0 && j < 0) return null;
  if (i < 0 || j < 0 || j < i) throw new Error(`Marker fuer „${marke}“ unvollstaendig oder vertauscht`);
  if (text.indexOf(auf, i + 1) >= 0 || text.indexOf(zu, j + 1) >= 0) throw new Error(`Abschnitt „${marke}“ steht mehrfach in der Datei`);
  return { inhalt: text.slice(i + auf.length, j).replace(/^\n/, '').replace(/\n$/, ''), i, j: j + zu.length };
}

/** Zeilenweise Spanne: fuehrender Einzug und Zeilenrest (Leerraum oder
 *  Zeilenkommentar wie `// eigener Wert`) gehoeren dazu. */
function zeilenSpanne(text, a, b) {
  let s = a;
  while (s > 0 && /[ \t]/.test(text[s - 1])) s--;
  const amZeilenanfang = s === 0 || text[s - 1] === '\n';
  if (!amZeilenanfang) s = a;
  let e = b;
  const rest = /^[ \t]*(\/\/[^\n]*)?(\n|$)/.exec(text.slice(b));
  if (rest && amZeilenanfang) e = b + rest[0].length;
  return [s, e];
}

/**
 * Plant die Aenderung eines Aufnahme-Abschnitts.
 *
 * @param {object} o
 * @param {string|null} o.text     Dateiinhalt (null = Datei fehlt)
 * @param {string} o.marke         Name hinter „aufgenommen:“
 * @param {string} o.neu           Inhalt, den der aktuelle Lauf schreiben will
 * @param {'regeln'|'deklarationen'} [o.modus]
 * @param {boolean} [o.ersetzen]   Abschnitt bewusst ersetzen (alter Weg)
 * @param {string} [o.vermerk]     Kommentarzeile vor ergaenzten Teilen
 * @returns {{text: string, geaendert: boolean, neuAngelegt: boolean,
 *   ergaenzt: string[], vorhanden: string[], konflikte: {schluessel: string, alt: string[], neu: string, ort: string}[],
 *   verloren: string[], warnungen: string[]}}
 */
export function abschnittPlanen({ text, marke, neu, modus = 'regeln', ersetzen = false, vermerk }) {
  const { auf, zu } = marken(marke);
  const t = text ?? '';
  const warnungen = [];
  const vorhandenAbschnitt = abschnittLesen(t, marke);
  const altInhalt = vorhandenAbschnitt ? vorhandenAbschnitt.inhalt : null;

  const altE = altInhalt === null ? [] : einheiten(zerlege(altInhalt), modus);
  let aussenE = [];
  try {
    const aussen = vorhandenAbschnitt ? t.slice(0, vorhandenAbschnitt.i) + t.slice(vorhandenAbschnitt.j) : t;
    aussenE = einheiten(zerlege(aussen), modus);
  } catch (e) {
    warnungen.push(`Datei ausserhalb des Abschnitts nicht lesbar (${e.message}) — Dubletten dort werden nicht erkannt`);
  }
  const bekannt = new Map();
  for (const [liste, ort] of [[altE, 'abschnitt'], [aussenE, 'datei']]) {
    for (const e of liste) {
      if (!bekannt.has(e.schluessel)) bekannt.set(e.schluessel, []);
      bekannt.get(e.schluessel).push({ inhalt: e.inhalt, ort });
    }
  }

  const ergaenzt = [], vorhanden = [], konflikte = [];
  let neuerInhalt;
  if (ersetzen || altInhalt === null) {
    neuerInhalt = neu.trim();
    // Auch beim ersten Lauf: identische Regeln ausserhalb der Marker nicht
    // doppeln, abweichende melden (sie wuerden sie still ueberschreiben).
    if (!ersetzen && aussenE.length) {
      neuerInhalt = filtern(neu, modus, bekannt, ergaenzt, vorhanden, konflikte).trim();
    } else {
      for (const e of einheiten(zerlege(neu), modus)) ergaenzt.push(e.schluessel);
    }
  } else {
    const teile = filtern(neu, modus, bekannt, ergaenzt, vorhanden, konflikte).trim();
    neuerInhalt = altInhalt.replace(/\s+$/, '');
    if (teile) neuerInhalt += `\n\n${vermerk ? vermerk + '\n' : ''}${teile}`;
  }

  // Schutzpruefung: nichts, was im Abschnitt stand, darf fehlen.
  const nachherZ = zaehlen(einheiten(zerlege(neuerInhalt), modus));
  const verloren = [...zaehlen(altE)].filter(([s, n]) => (nachherZ.get(s) || 0) < n).map(([s]) => s);

  const block = `${auf}\n${neuerInhalt}\n${zu}`;
  let ergebnis;
  if (vorhandenAbschnitt) ergebnis = t.slice(0, vorhandenAbschnitt.i) + block + t.slice(vorhandenAbschnitt.j);
  else ergebnis = t.replace(/\s*$/, '') + `\n\n${block}\n`;
  if (!t.trim() && !vorhandenAbschnitt) ergebnis = `${block}\n`;

  return {
    text: ergebnis,
    geaendert: ergebnis !== t,
    neuAngelegt: !vorhandenAbschnitt,
    ergaenzt, vorhanden, konflikte, verloren, warnungen,
  };
}

/** Entfernt aus `neu` alle Einheiten, die schon bekannt sind (gleich: still,
 *  abweichend: als Konflikt). Gibt den verbleibenden Text zurueck. */
function filtern(neu, modus, bekannt, ergaenzt, vorhanden, konflikte) {
  const knoten = zerlege(neu);
  const teile = [];
  for (const k of knoten) {
    if (k.art !== 'block') continue;
    const eigene = einheiten([k], modus);
    const raus = [];
    let bleibt = 0;
    for (const e of eigene) {
      const treffer = bekannt.get(e.schluessel);
      if (!treffer) { bleibt++; ergaenzt.push(e.schluessel); continue; }
      if (treffer.some((x) => x.inhalt === e.inhalt)) { vorhanden.push(e.schluessel); raus.push(e.knoten); continue; }
      konflikte.push({ schluessel: e.schluessel, alt: treffer.map((x) => x.inhalt), neu: e.inhalt, ort: treffer[0].ort });
      raus.push(e.knoten);
    }
    if (!bleibt) continue;
    let s = neu.slice(k.start, k.end);
    const spannen = raus.map((r) => zeilenSpanne(neu, r.start, r.end))
      .map(([a, b]) => [a - k.start, b - k.start])
      .sort((x, y) => y[0] - x[0]);
    for (const [a, b] of spannen) s = s.slice(0, Math.max(0, a)) + s.slice(b);
    // Leere @-Huellen, die nach dem Herausnehmen bleiben, entfernen.
    let vorher;
    do { vorher = s; s = s.replace(/@[a-z-]+[^{}]*\{\s*\}/g, ''); } while (s !== vorher);
    teile.push(s.trim());
  }
  return teile.join('\n\n');
}

/** Lesbare Meldung fuer Konflikte und Verluste. */
export function planMelden(datei, marke, plan) {
  const z = [];
  for (const k of plan.konflikte) {
    z.push(`    KONFLIKT ${k.schluessel}`);
    z.push(`      vorhanden (${k.ort === 'abschnitt' ? 'im Abschnitt' : 'ausserhalb der Marker'}): ${k.alt.join('  |  ')}`);
    z.push(`      neu:       ${k.neu}`);
  }
  for (const v of plan.verloren) z.push(`    WUERDE FEHLEN ${v}`);
  for (const w of plan.warnungen) z.push(`    Hinweis: ${w}`);
  return z.length ? [`  ${datei} (Abschnitt „${marke}“)`, ...z].join('\n') : '';
}
