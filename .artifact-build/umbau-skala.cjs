// Einmaliger Umbau: getrennte Verhaeltnisse je Viewport-Ende + feste Werte unten.
const fs = require('fs');
const P = __dirname + '/../data/design-tokens.json';
const t = JSON.parse(fs.readFileSync(P, 'utf8'));
const typo = t.foundation.typography;

const FEST = {
  '2xs': { min: 12, max: 13 },
  'xs':  { min: 13, max: 15 },
  'sm':  { min: 14, max: 16 },
};

typo.fluid = {
  viewport_min: typo.fluid.viewport_min,
  viewport_max: typo.fluid.viewport_max,
  base_min_px: 16,
  base_max_px: 18,
  ratio_min: 1.15,
  ratio_max: 1.2,
  fixed_steps: FEST,
  _notiz: 'Getrennte Verhaeltnisse je Viewport-Ende (Utopia-Verfahren): unten flacher, '
        + 'oben steiler. Die drei kleinsten Stufen sind feste Werte statt Rechenergebnisse — '
        + 'eine Modulskala liefert dort 13,3 / 11,1 / 9,3 px und damit zwei unbrauchbare Stufen. '
        + 'Reihenfolge: fixed_steps schlaegt die Rechnung, der 12-px-Boden schlaegt beides.',
};

// semantic_sizes_px war eine Kopie der gerechneten Werte und wich vom Kompilat ab.
// Jetzt aus denselben Regeln erzeugt, damit die Doku nicht wieder driftet.
const FLOOR = 12;
const neu = {};
for (const [label, step] of Object.entries(typo.semantic_steps)) {
  if (FEST[label]) { neu[label] = { ...FEST[label] }; continue; }
  const r = (b, ratio) => Math.max(FLOOR, Math.round(b * Math.pow(ratio, step) * 1000) / 1000);
  neu[label] = { min: r(16, 1.15), max: r(18, 1.2) };
}
typo.semantic_sizes_px = neu;

fs.writeFileSync(P, JSON.stringify(t, null, 2) + '\n');

console.log('Stufe   min      max      Spanne');
for (const [k, v] of Object.entries(neu)) {
  console.log(k.padEnd(7) + String(v.min).padStart(7) + String(v.max).padStart(9)
            + '   ' + (v.max / v.min).toFixed(2) + 'x');
}
