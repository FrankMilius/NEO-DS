// Jeder in _component-tokens*.scss definierte --nc-shell-*/--nc-bento-grid-*-
// Token muss im Konfigurator einstellbar sein (in einer Untergruppe von
// components.groups in data/design-tokens.json).
//
// Anlass: Am 12.08.2026 (8b04d29c) ersetzte der Aufnahme-Lauf die
// Konfigurator-Eintraege von shell und bento-grid; 15 bzw. 11 tokenIds samt
// Untergruppen verschwanden aus der App, obwohl die Tokens im SCSS blieben.
// Wiederhergestellt am 07.10.2026.
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const wurzel = join(dirname(fileURLToPath(import.meta.url)), '..');
const SETTINGS = join(wurzel, 'scss/scss/00-settings');

// Begruendete Ausnahmen: Token-Name -> Grund. Derzeit keine.
const AUSNAHMEN = {};

const definiert = new Set();
for (const f of readdirSync(SETTINGS).filter((n) => /^_component-tokens.*\.scss$/.test(n))) {
  const text = readFileSync(join(SETTINGS, f), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
  for (const m of text.matchAll(/(--nc-(?:shell|bento-grid)-[a-z0-9-]+)\s*:/g)) definiert.add(m[1].slice(2));
}

const j = JSON.parse(readFileSync(join(wurzel, 'data/design-tokens.json'), 'utf8'));
const imKonfigurator = new Set(j.components.groups.flatMap((g) => (g.subgroups || []).flatMap((s) => s.tokenIds || [])));

describe('Konfigurator: shell- und bento-grid-Tokens sind einstellbar', () => {
  it('findet die Tokens ueberhaupt (Schutz gegen leeren Lauf)', () => {
    expect([...definiert].filter((t) => t.startsWith('nc-shell-')).length).toBeGreaterThan(30);
    expect([...definiert].filter((t) => t.startsWith('nc-bento-grid-')).length).toBeGreaterThan(10);
  });

  it('jeder definierte Token steht in einer Untergruppe (oder in AUSNAHMEN)', () => {
    const fehlend = [...definiert].filter((t) => !imKonfigurator.has(t) && !AUSNAHMEN[t]).sort();
    expect(fehlend).toEqual([]);
  });

  it('Ausnahmen sind nicht veraltet', () => {
    for (const t of Object.keys(AUSNAHMEN)) {
      expect(definiert.has(t) && !imKonfigurator.has(t), `${t} braucht keine Ausnahme mehr`).toBe(true);
    }
  });

  it('die am 12.08.2026 verlorenen Untergruppen sind wieder da', () => {
    const ids = (id) => j.components.groups.find((g) => g.id === id).subgroups.map((s) => s.id);
    expect(ids('shell')).toEqual(expect.arrayContaining(['linkbar', 'sidebars', 'footerbar', 'content']));
    expect(ids('bento-grid')).toEqual(expect.arrayContaining(['layout', 'surface', 'accent']));
  });
});
