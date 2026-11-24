/**
 * Shot-Vorschau-CSS fuer den Drupal-Admin (Restpunkte 09.10.2026, shot-admin)
 *
 * scripts/baue-shot-vorschau.mjs zieht aus dem gebauten styles.css nur die
 * .nc-shot-Regeln, ihre @keyframes und die (transitiv) gelesenen Tokens.
 * Geprueft: nichts ausserhalb von .nc-shot / :where(.nc-shot-vorschau) — das
 * Admin-Theme bleibt unberuehrt —, alle Tokens aufgeloest, Regeln vollstaendig.
 */
import { describe, it, expect, beforeAll } from 'vitest';
import { resolve } from 'path';
import { shotVorschau, bloecke, teile, deklarationen, HUELLE, kartenflaechenTokens } from '../scripts/baue-shot-vorschau.mjs';
import { vollCss } from './_hilfen/voll-css.mjs';

const ROOT = resolve(import.meta.dirname, '..');
let css = '';
let aus = '';

beforeAll(() => {
  css = vollCss();
  aus = shotVorschau(css);
});

const selektoren = (text) => {
  const out = [];
  for (const b of bloecke(text)) {
    if (b.rumpf === null) continue;
    if (b.kopf.startsWith('@media')) { for (const x of bloecke(b.rumpf)) out.push(...teile(x.kopf)); continue; }
    if (b.kopf.startsWith('@keyframes')) continue;
    out.push(...teile(b.kopf));
  }
  return out;
};

describe('Shot-Vorschau-CSS', () => {
  it('jeder Selektor beginnt mit .nc-shot oder der Huelle :where(.nc-shot-vorschau)', () => {
    const sel = selektoren(aus);
    expect(sel.length).toBeGreaterThan(20);
    for (const s of sel) expect(s, s).toMatch(/^(\.nc-shot(__|--|\[|\s|:|$)|:where\(\.nc-shot-vorschau\))/);
  });

  it('enthaelt alle .nc-shot-Regeln aus styles.css (auch in @media) und die Ping-Animation', () => {
    const imDs = selektoren(css).filter((s) => /^\.nc-shot(?![\w-])|^\.nc-shot(__|--)/.test(s));
    const inAus = new Set(selektoren(aus));
    for (const s of imDs) expect(inAus.has(s), s).toBe(true);
    expect(aus).toMatch(/@keyframes ncShotPing\{/);
    expect(aus).toMatch(/@media\(prefers-reduced-motion: reduce\)\{/);
  });

  it('jedes gelesene Token ist an der Huelle definiert (transitiv, :root-Werte des hellen Themas)', () => {
    const tokenBlock = bloecke(aus).find((b) => b.kopf === `:where(${HUELLE})`);
    const definiert = new Set(deklarationen(tokenBlock.rumpf).map(([n]) => n));
    for (const m of aus.matchAll(/var\((--[\w-]+)(,)?/g)) {
      if (m[2]) continue; // mit Rueckfallwert (z. B. --nc-shot-dur) — setzt das Verhalten
      expect(definiert.has(m[1]), m[1]).toBe(true);
    }
    expect(definiert.has('--nc-shot-accent')).toBe(true);
    expect(definiert.has('--fnd-focus-ring-color')).toBe(true);
  });

  it('Kartenflächen (I18 Phase 11): Flächen-Tokens und ergänzende Paletten ohne Neo Blue/Darkblue an der Huelle', () => {
    const namen = kartenflaechenTokens();
    for (const n of ['--nc-story-gallery-stage-bg-akzent', '--nc-story-gallery-stage-bg-neutral', '--nc-story-gallery-stage-bg-hell', '--nc-story-gallery-stage-bg-dunkel', '--fnd-primitive-coral-100', '--fnd-primitive-dark-orange-950']) expect(namen, n).toContain(n);
    expect(namen.some((n) => /neo-(dark)?blue/.test(n))).toBe(false);
    expect(namen.filter((n) => n.startsWith('--fnd-primitive-')).length).toBe(10 * 11);
    const mit = shotVorschau(css, { zusatz: namen });
    const tokenBlock = bloecke(mit).find((b) => b.kopf === `:where(${HUELLE})`);
    const definiert = new Set(deklarationen(tokenBlock.rumpf).map(([n]) => n));
    for (const n of namen) if (css.includes(`${n}:`)) expect(definiert.has(n), n).toBe(true);
    for (const m of tokenBlock.rumpf.matchAll(/var\((--[\w-]+)(,)?/g)) if (!m[2]) expect(definiert.has(m[1]), m[1]).toBe(true);
  });

  it('bleibt klein (keine Elementstile, kein Reset ausser box-sizing in der Huelle)', () => {
    expect(Buffer.byteLength(aus)).toBeLessThan(12 * 1024);
    expect(aus).not.toMatch(/(^|[},])(html|body|img|button|input|\*)[,{:\s]/m);
  });
});
