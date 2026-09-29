#!/usr/bin/env node
/**
 * DTCG-Export der Token-Quelle (P1.2, 29.09.2026)
 * ==========================================================================
 *   node scripts/export-dtcg.cjs              schreibt data/design-tokens.dtcg.json
 *   node scripts/export-dtcg.cjs --pruefen    bricht ab, wenn die Datei veraltet ist
 *
 * WAS: data/design-tokens.json im Format der W3C Design Tokens Community
 * Group (Spezifikation 2025.10) — als ZUSAETZLICHES Generat. Die bisherige
 * JSON bleibt die Quelle; 22 Abnehmer lesen sie.
 *
 * 1:1 OHNE UMBENENNUNG: Jeder Pfad der Quelle ist ein Pfad im Export
 * (primitives.neutralleitern.lime.shades.300, semantic.text-primary,
 * components.button.nc-button-accent-bg, foundation.spacing.scale.03).
 * Die Angleichung an Figma-Namen ist ein eigener Schritt (P1.4).
 *
 * VERWEISE WERDEN ALIASE
 *   primitives  alias {…neutralleitern.lime}      -> je Stufe {…lime.shades.N}
 *   semantic    {neutral.N} {accent.N}            -> Graphit- bzw. Lime-Leiter
 *               {system.x.N} {color.x}            -> Systempalette bzw. {semantic.x}
 *   components  ref "text-primary"                -> {semantic.text-primary}
 *               ref "spacing-03", var(--fnd-…)    -> Konfigurator-Foundation (ueber
 *                                                    den geprueften cssVar aus
 *                                                    tokens.generated.js)
 *               var(--nc-…)                       -> anderer Komponenten-Token
 * Was kein einzelner Verweis ist (color-mix, zusammengesetzte Werte), bleibt
 * CSS-Text; bei Farben steht der aufgeloeste Wert in $value und der Ausdruck
 * in $extensions["de.neocosmo"].css.
 *
 * THEMEN: DTCG kennt (noch) keine Modi. $value ist neo-light; die drei anderen
 * Themen stehen in $extensions["de.neocosmo"].modes.
 */
const fs = require('fs');
const path = require('path');

const WURZEL = path.resolve(__dirname, '..');
const QUELLE = path.join(WURZEL, 'data/design-tokens.json');
const ZIEL = path.join(WURZEL, 'data/design-tokens.dtcg.json');
const APP_TOKENS = path.join(WURZEL, 'apps/theme-configurator/src/data/tokens.generated.js');
const NS = 'de.neocosmo';
const PRUEFEN = process.argv.includes('--pruefen');

const src = JSON.parse(fs.readFileSync(QUELLE, 'utf8'));
const bericht = { tokens: 0, aliase: 0, cssText: 0, offen: [], ohneWert: [] };

// ─── Werte ────────────────────────────────────────────────────────────────
const rund = (x) => Math.round(x * 10000) / 10000;
function farbe(s) {
  if (typeof s !== 'string') return null;
  let m = s.trim().match(/^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i);
  if (m) {
    let h = m[1].toLowerCase();
    if (h.length === 3) h = h.split('').map((c) => c + c).join('');
    const k = [0, 2, 4].map((i) => rund(parseInt(h.slice(i, i + 2), 16) / 255));
    const alpha = h.length === 8 ? rund(parseInt(h.slice(6, 8), 16) / 255) : 1;
    return { colorSpace: 'srgb', components: k, alpha, hex: `#${h.slice(0, 6)}` };
  }
  m = s.trim().match(/^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)(?:[\s,/]+([\d.]+%?))?\s*\)$/i);
  if (m) {
    const k = [m[1], m[2], m[3]].map((v) => rund(Number(v) / 255));
    let a = m[4] === undefined ? 1 : m[4].endsWith('%') ? Number(m[4].slice(0, -1)) / 100 : Number(m[4]);
    const hex = '#' + [m[1], m[2], m[3]].map((v) => Math.round(Number(v)).toString(16).padStart(2, '0')).join('');
    return { colorSpace: 'srgb', components: k, alpha: rund(a), hex };
  }
  return null;
}
function literal(v) {
  if (typeof v === 'number') return { $type: 'number', $value: v };
  if (typeof v !== 'string') return null;
  const f = farbe(v);
  if (f) return { $type: 'color', $value: f };
  let m = v.trim().match(/^(-?\d*\.?\d+)(px|rem)$/);
  if (m) return { $type: 'dimension', $value: { value: Number(m[1]), unit: m[2] } };
  m = v.trim().match(/^(\d*\.?\d+)(ms|s)$/);
  if (m) return { $type: 'duration', $value: { value: Number(m[1]), unit: m[2] } };
  return null;
}
const ext = (o) => ({ [NS]: o });
function token(wert, meta = {}) {
  bericht.tokens++;
  const t = {};
  if (typeof wert === 'string' && /^\{[^}]+\}$/.test(wert)) { t.$value = wert; bericht.aliase++; }
  else {
    const l = literal(wert);
    if (l) Object.assign(t, l);
    else { t.$value = wert; if (typeof wert === 'string') bericht.cssText++; }
  }
  const e = Object.fromEntries(Object.entries(meta).filter(([, v]) => v !== undefined && v !== null));
  if (e.description) { t.$description = e.description; delete e.description; }
  if (Object.keys(e).length) t.$extensions = ext(e);
  return t;
}

// ─── Allgemeiner Baum (foundation, sonstige primitives) ───────────────────
function baum(o, meta = {}) {
  const g = {};
  const notizen = {};
  for (const [k, v] of Object.entries(o)) {
    if (k.startsWith('_') || k.startsWith('$')) { notizen[k] = v; continue; }
    if (Array.isArray(v) || typeof v === 'boolean') { notizen[k] = v; continue; }
    if (v && typeof v === 'object') g[k] = baum(v);
    else g[k] = token(v);
  }
  if (Object.keys(notizen).length || Object.keys(meta).length) g.$extensions = ext({ ...meta, ...notizen });
  return g;
}

// ─── Primitives ───────────────────────────────────────────────────────────
const P = src.primitives;
const istPalette = (p) => p && typeof p === 'object' && p.shades && typeof p.shades === 'object';
function palette(gruppe, name, p) {
  const leiter = typeof p.alias === 'string' ? p.alias.replace(/^\{|\}$/g, '') : null;
  const shades = {};
  for (const [st, hex] of Object.entries(p.shades)) {
    shades[st] = leiter ? token(`{${leiter}.shades.${st}}`) : token(hex);
  }
  const g = { shades };
  if (p.base !== undefined) {
    const st = Object.entries(p.shades).find(([, h]) => String(h).toLowerCase() === String(p.base).toLowerCase());
    g.base = st ? token(`{primitives.${gruppe}.${name}.shades.${st[0]}}`) : token(p.base);
  }
  const rest = Object.fromEntries(Object.entries(p).filter(([k]) => !['shades', 'base', 'label', 'alias'].includes(k)));
  g.$description = p.label;
  g.$extensions = ext({ label: p.label, ...(p.alias ? { alias: p.alias } : {}), ...rest });
  return g;
}
const primitives = {};
for (const [gruppe, inhalt] of Object.entries(P)) {
  if (inhalt && typeof inhalt === 'object' && Object.values(inhalt).some(istPalette)) {
    primitives[gruppe] = {};
    for (const [name, p] of Object.entries(inhalt)) {
      primitives[gruppe][name] = istPalette(p) ? palette(gruppe, name, p) : (typeof p === 'object' ? baum(p) : token(p));
    }
  } else if (inhalt && typeof inhalt === 'object') primitives[gruppe] = baum(inhalt);
}

// ─── Verweis-Index (CSS-Name -> Token-Pfad) ───────────────────────────────
async function cssIndex() {
  const idx = new Map();
  const mod = await import(APP_TOKENS);
  for (const [kat, daten] of Object.entries(mod.foundationTokens || {})) {
    for (const [key, t] of Object.entries(daten?.tokens || {})) {
      // Schluessel wie in den Verweisen: ohne "--fnd-" (spacing-03, radius-sm,
      // z-modal); --font-body u. ae. ohne fnd-Praefix bleiben font-body.
      if (t?.cssVar) idx.set(t.cssVar.replace(/^--(fnd-)?/, ''), `foundation._configurator.${kat}.${key}`);
    }
  }
  return idx;
}

// ─── Semantik ─────────────────────────────────────────────────────────────
const SEM = src.semantic;
const THEMEN = Object.keys(SEM.references).filter((k) => !k.startsWith('$'));
const STANDARD = 'neo-light';
const rollen = new Map();
for (const g of SEM.groups) for (const t of g.tokens) rollen.set(t.id, { ...t, gruppe: g.id });

function bruecke(v, thema, rolle) {
  let m;
  if ((m = v.match(/^\{neutral\.(\d+)\}$/))) return `{primitives.neutralleitern.graphit.shades.${m[1]}}`;
  if ((m = v.match(/^\{accent\.(\d+)\}$/))) return `{primitives.neutralleitern.lime.shades.${m[1]}}`;
  if ((m = v.match(/^\{system\.(\w+)\.(\d+)\}$/))) return `{primitives.system.${m[1]}.shades.${m[2]}}`;
  if ((m = v.match(/^\{color\.([a-z0-9-]+)\}$/))) return `{semantic.${m[1]}}`;
  if (/^#/.test(v)) return v;
  return { css: v, wert: SEM.defaults?.[thema]?.[rolle] ?? null };  // color-mix u. a.
}
function semantik() {
  const out = {};
  const alle = new Set([...rollen.keys(), ...Object.keys(SEM.references[STANDARD])]);
  for (const id of alle) {
    const info = rollen.get(id) || {};
    const modes = {};
    let css;
    let std;
    for (const th of THEMEN) {
      const roh = SEM.references[th]?.[id];
      if (roh === undefined) continue;
      const v = bruecke(roh, th, id);
      const wert = typeof v === 'string' ? v : v.wert ?? v.css;
      const darstellung = typeof wert === 'string' && wert.startsWith('{') ? wert : (farbe(wert) ?? wert);
      if (th === STANDARD) { std = wert; if (typeof v !== 'string') css = v.css; }
      else modes[th] = typeof v === 'string' ? darstellung : { $value: darstellung, css: v.css };
    }
    if (std === undefined) {
      // Rollen aus _mono-theme.scss (surface-*, accent-*, elevation-*, focus-*,
      // paper-*): die Quell-JSON fuehrt sie als Rolle, aber OHNE Wert — der
      // steht nur im SCSS. Export als CSS-Text, ausdruecklich markiert.
      bericht.ohneWert.push(id);
      out[id] = token(`var(--${id})`, { description: info.description, label: info.label, group: info.gruppe, wertNurImScss: '_mono-theme.scss' });
      continue;
    }
    out[id] = token(std, { description: info.description, label: info.label, group: info.gruppe, css, modes });
    if (!rollen.has(id)) out[id].$extensions[NS].nurInBruecke = true;
  }
  return out;
}

// ─── Komponenten ──────────────────────────────────────────────────────────
let IDX = new Map();
const semIds = new Set([...rollen.keys(), ...Object.keys(SEM.references[STANDARD])]);

// Zweiter Index: kanonische Foundation-Pfade unter ihrem flachen Namen
// (foundation.motion.duration.150 -> motion-duration-150). Nur verwendet,
// wenn das gebaute CSS diese Variable mit DEMSELBEN Wert fuehrt — sonst
// verbaende der Export einen Verweis mit einem gleichnamigen, aber anderen
// Token.
const GEBAUT = (() => {
  const m = new Map();
  try {
    const css = fs.readFileSync(path.join(WURZEL, 'styles.css'), 'utf8');
    for (const x of css.matchAll(/--fnd-([a-z0-9-]+)\s*:\s*([^;}]+)/g)) if (!m.has(x[1])) m.set(x[1], x[2].trim());
  } catch { /* ohne styles.css kein zweiter Index */ }
  return m;
})();
const FLACH = new Map();
(function flach(o, pfad) {
  for (const [k, v] of Object.entries(o)) {
    if (k.startsWith('_') || k.startsWith('$') || Array.isArray(v)) continue;
    const p = [...pfad, k];
    if (v && typeof v === 'object') flach(v, p);
    else FLACH.set(p.join('-').replace(/_/g, '-'), { pfad: `foundation.${p.join('.')}`, wert: String(v) });
  }
})(src.foundation, []);
const norm = (w) => String(w).replace(/\s+/g, '').toLowerCase();

const zuAlias = (name) => {
  let m;
  if (name.startsWith('color-') && semIds.has(name.slice(6))) return `{semantic.${name.slice(6)}}`;
  if ((m = name.match(/^neutral-(\d+)$/)) && P.neutralleitern.graphit.shades[m[1]]) return `{primitives.neutralleitern.graphit.shades.${m[1]}}`;
  if ((m = name.match(/^accent-(\d+)$/)) && P.neutralleitern.lime.shades[m[1]]) return `{primitives.neutralleitern.lime.shades.${m[1]}}`;
  if (IDX.has(name)) return `{${IDX.get(name)}}`;
  // Wie die SCSS sie ableitet: always-* aus der Foundation-Schwarz/Weiss-Skala
  // (_color-primitives.scss), Border-Aliase ueber foundation.border.width_aliases.
  if (name === 'color-always-dark') return '{primitives.foundation.black.shades.100}';
  if (name === 'color-always-light') return '{primitives.foundation.white.shades.100}';
  if ((m = name.match(/^border-width-([a-z]+)$/)) && src.foundation.border?.width_aliases?.[m[1]]) return `{foundation.border.width.${src.foundation.border.width_aliases[m[1]]}}`;
  const f = FLACH.get(name);
  if (f && GEBAUT.has(name) && norm(GEBAUT.get(name)) === norm(f.wert)) return `{${f.pfad}}`;
  return null;
};
const varAlias = (w) => {
  const m = typeof w === 'string' && w.trim().match(/^var\(--fnd-([a-z0-9-]+)\)$/);
  return m ? zuAlias(m[1]) : null;
};

function komponenten() {
  const out = {};
  const ncPfad = new Map();
  for (const g of src.components.groups) for (const t of g.tokens) ncPfad.set(t.id, `components.${g.id}.${t.id}`);
  for (const g of src.components.groups) {
    const grp = { $description: g.label, $extensions: ext({ label: g.label, icon: g.icon }) };
    for (const t of g.tokens) {
      let wert;
      if (t.ref !== undefined) {
        wert = semIds.has(t.ref) ? `{semantic.${t.ref}}` : zuAlias(t.ref);
        if (!wert) { bericht.offen.push(`${g.id}.${t.id}: ref "${t.ref}"`); wert = `var(--fnd-${t.ref})`; }
      } else {
        wert = t.default;
        const m = typeof wert === 'string' && wert.trim().match(/^var\(--(fnd|nc)-([a-z0-9-]+)\)$/);
        if (m) {
          const a = m[1] === 'nc' ? (ncPfad.has(`nc-${m[2]}`) ? `{${ncPfad.get(`nc-${m[2]}`)}}` : null) : zuAlias(m[2]);
          if (a) wert = a;
          else bericht.offen.push(`${g.id}.${t.id}: ${t.default}`);
        }
      }
      const modes = t.darkDefault !== undefined ? { 'neo-dark': farbe(t.darkDefault) ?? t.darkDefault } : undefined;
      grp[t.id] = token(wert, { label: t.label, cssType: t.type, group: t.group, ref: t.ref, modes });
    }
    out[g.id] = grp;
  }
  return out;
}

// ─── Foundation ───────────────────────────────────────────────────────────
function foundation() {
  const F = src.foundation;
  const out = {};
  for (const [k, v] of Object.entries(F)) {
    if (k === '_configurator') continue;
    out[k] = typeof v === 'object' ? baum(v) : token(v);
  }
  const kon = {};
  const meta = {};
  for (const [kat, d] of Object.entries(F._configurator || {})) {
    if (!d?.tokens) { meta[kat] = d; continue; }
    const g = { $description: d.label, $extensions: ext({ label: d.label, icon: d.icon }) };
    for (const [key, t] of Object.entries(d.tokens)) {
      const zielKey = t.maps_to && F._configurator[t.maps_to]?.tokens?.[t.value] !== undefined
        ? `{foundation._configurator.${t.maps_to}.${t.value}}` : null;
      const { label, value, maps_to, ...rest } = t;
      g[key] = token(zielKey ?? varAlias(value) ?? value, { label, maps_to, ...rest });
    }
    kon[kat] = g;
  }
  kon.$description = 'Foundation, wie sie der Theme-Konfigurator zeigt (Namen nach dem gebauten CSS)';
  kon.$extensions = ext(meta);
  out._configurator = kon;
  return out;
}

// ─── Zusammenbauen ────────────────────────────────────────────────────────
(async () => {
  IDX = await cssIndex();
  const dtcg = {
    $description: 'NEO Design System — DTCG-Export von data/design-tokens.json. Nicht von Hand pflegen: node scripts/export-dtcg.cjs',
    $extensions: ext({ quelle: 'data/design-tokens.json', version: src.$meta?.version, stand: src.$meta?.last_updated, spezifikation: 'DTCG 2025.10', standardThema: STANDARD, themen: THEMEN }),
    primitives,
    semantic: semantik(),
    components: komponenten(),
    foundation: foundation(),
  };
  const text = JSON.stringify(dtcg, null, 2) + '\n';
  const zusammenfassung = `DTCG: ${bericht.tokens} Tokens, ${bericht.aliase} Aliase, ${bericht.cssText} als CSS-Text, ${bericht.offen.length} Verweise offen, ${bericht.ohneWert.length} Rollen nur im SCSS`;
  if (PRUEFEN) {
    const alt = fs.existsSync(ZIEL) ? fs.readFileSync(ZIEL, 'utf8') : '';
    if (alt !== text) { console.error(`  ✗ ${path.relative(WURZEL, ZIEL)} ist veraltet — node scripts/export-dtcg.cjs`); process.exit(1); }
    console.log(`  ✓ ${zusammenfassung} — Datei aktuell`);
    return;
  }
  fs.writeFileSync(ZIEL, text);
  console.log(`  ✓ ${path.relative(WURZEL, ZIEL)} — ${zusammenfassung}`);
  if (bericht.offen.length) {
    if (process.argv.includes('--alle')) {
      console.log('    Offene Verweise (bleiben CSS-Text):');
      for (const o of bericht.offen) console.log('     - ' + o);
    } else console.log('    Liste der offenen Verweise: node scripts/export-dtcg.cjs --alle');
  }
})().catch((e) => { console.error(e); process.exit(1); });
