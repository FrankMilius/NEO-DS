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
import * as sass from 'sass';
import { shotVorschau, bloecke, teile, deklarationen, HUELLE } from '../scripts/baue-shot-vorschau.mjs';

const ROOT = resolve(import.meta.dirname, '..');
let css = '';
let aus = '';

beforeAll(() => {
  css = sass.compile(resolve(ROOT, 'scss/scss/main.scss'), { style: 'compressed' }).css;
  aus = shotVorschau(css);
}, 60000);

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

  it('bleibt klein (keine Elementstile, kein Reset ausser box-sizing in der Huelle)', () => {
    expect(Buffer.byteLength(aus)).toBeLessThan(12 * 1024);
    expect(aus).not.toMatch(/(^|[},])(html|body|img|button|input|\*)[,{:\s]/m);
  });
});
