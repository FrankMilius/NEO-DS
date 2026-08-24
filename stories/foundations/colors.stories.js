// ============================================================
// Colors — Foundation Token Showcase
// Farb-Primitiven, Semantische Farben, Theme-Vergleich
// ============================================================

import registry from '../../data/design-tokens.json';

// Die Paletten kommen aus der Registry, nicht aus einer Liste hier.
//
// Bis zum 24.08.2026 stand hier eine gepflegte Aufzaehlung — und sie war nach
// der Umstellung auf Graphit sofort falsch: "Primary (Neo Darkblue)" zeigte
// weiter auf eine Palette, die inzwischen Graphit ist. Dritte Stelle heute mit
// demselben Muster. Die Registry entsteht ihrerseits aus den SCSS-Quellen
// (scripts/primitives-aus-quelle.cjs), also gibt es genau eine Wahrheit.
const GRUPPENTITEL = {
  brand: 'Marke',
  neutralleitern: 'Neutralleitern (OKLCH, stufengleich im Kontrast)',
  supporting: 'Supporting Palettes',
  system: 'Rueckmeldungen',
};

const PALETTES = Object.entries(registry.primitives)
  .filter(([gruppe]) => gruppe in GRUPPENTITEL)
  .flatMap(([gruppe, paletten]) =>
    Object.entries(paletten).map(([name, p]) => ({
      gruppe: GRUPPENTITEL[gruppe],
      name: p.label ?? name,
      prefix: name,
      shades: Object.keys(p.shades ?? {}).map(Number).sort((a, b) => a - b),
    })),
  );
// Die Rollen werden gegen styles.css geprueft: Ein Token, das es nicht gibt,
// ergibt `background: var(--gibt-es-nicht)` — das ist ungueltig, und das Feld
// bleibt leer. Genau so sahen die Paletten aus, weil sie
// `--fnd-color-primary-500` abfragten. Im System heissen die Paletten
// `--fnd-primitive-*`; `--fnd-color-*` sind die Rollen.
const SEMANTIC_ROLES = [
  { label: 'Text', tokens: ['text-primary', 'text-secondary', 'text-tertiary', 'text-inverse'] },
  { label: 'Background', tokens: ['background-base', 'background-secondary', 'background-tertiary', 'background-accent', 'background-inverse'] },
  { label: 'Surface', tokens: ['surface-elevated', 'layer-01', 'layer-02', 'layer-03'] },
  { label: 'Border', tokens: ['border-strong', 'border-primary', 'border-secondary', 'border-hairline'] },
  { label: 'Interactive', tokens: ['interactive-default', 'interactive-hover', 'interactive-active'] },
  { label: 'Feedback', tokens: ['feedback-success', 'feedback-warning', 'feedback-danger', 'feedback-info'] },
];

function renderPalette(palette) {
  return palette.shades.map(shade => `
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:4px">
      <div style="width:48px;height:48px;border-radius:var(--fnd-radius-md);background:var(--fnd-primitive-${palette.prefix}-${shade});border:1px solid var(--fnd-color-border-secondary)"></div>
      <code style="font-size:var(--fs-xs);color:var(--fnd-color-text-secondary);min-width:200px">--fnd-primitive-${palette.prefix}-${shade}</code>
      <span style="font-size:var(--fs-xs);color:var(--fnd-color-text-tertiary)">${shade}</span>
    </div>
  `).join('');
}

function renderSemantic(group) {
  return group.tokens.map(token => `
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:8px">
      <div style="width:48px;height:48px;border-radius:var(--fnd-radius-md);background:var(--fnd-color-${token});border:1px solid var(--fnd-color-border-secondary)"></div>
      <code style="font-size:var(--fs-xs);color:var(--fnd-color-text-secondary)">--fnd-color-${token}</code>
    </div>
  `).join('');
}

export default {
  title: 'Foundations/Colors',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**Color Foundation** — 3-Layer Token Architektur:
1. **Primitives** (\`--fnd-color-{palette}-{shade}\`): Rohe Farbpaletten, Shade-Scale 100–950
2. **Semantic** (\`--fnd-color-{role}\`): Theme-aware Zuordnungen (text-primary, interactive-default, feedback-success)
3. **Component** (\`--nc-{component}-{property}\`): Komponentenspezifische Token-Overrides`,
      },
    },
  },
};

export const Primitives = {
  name: 'Color Primitives',
  render: () => `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:32px;padding:24px">
    ${PALETTES.map(p => `
      <div>
        <h3 style="margin-bottom:12px;font-size:var(--fs-base);font-weight:var(--fnd-font-weight-semibold)">${p.name}</h3>
        ${renderPalette(p)}
      </div>
    `).join('')}
  </div>`,
  parameters: { docs: { description: { story: 'Alle Farbpaletten mit Shade-Scale 100–950.' } } },
};

export const SemanticTokens = {
  name: 'Semantic Tokens',
  render: () => `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:32px;padding:24px">
    ${SEMANTIC_ROLES.map(group => `
      <div>
        <h3 style="margin-bottom:12px;font-size:var(--fs-base);font-weight:var(--fnd-font-weight-semibold)">${group.label}</h3>
        ${renderSemantic(group)}
      </div>
    `).join('')}
  </div>`,
  parameters: { docs: { description: { story: 'Semantische Farb-Tokens die sich pro Theme aendern.' } } },
};

export const ThemeComparison = {
  name: 'Theme Comparison',
  render: () => {
    const tokens = ['background-base', 'surface-elevated', 'text-primary', 'text-secondary', 'border-primary', 'interactive-default', 'feedback-success', 'feedback-danger'];
    const row = (token) => `
      <div style="display:contents">
        <code style="font-size:var(--fs-xs);padding:8px">${token}</code>
        <div style="padding:8px"><div style="width:40px;height:40px;border-radius:var(--fnd-radius-sm);background:var(--fnd-color-${token});border:1px solid #ccc"></div></div>
      </div>`;
    return `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;padding:24px">
        <div class="neo-light-theme" style="padding:24px;background:var(--fnd-color-background-base);border-radius:var(--fnd-radius-lg);border:1px solid var(--fnd-color-border-secondary)">
          <h3 style="margin-bottom:16px;color:var(--fnd-color-text-primary)">Light Theme</h3>
          <div style="display:grid;grid-template-columns:1fr auto;gap:4px;align-items:center">
            ${tokens.map(row).join('')}
          </div>
        </div>
        <div class="neo-dark-theme" style="padding:24px;background:var(--fnd-color-background-base);border-radius:var(--fnd-radius-lg);border:1px solid var(--fnd-color-border-secondary)">
          <h3 style="margin-bottom:16px;color:var(--fnd-color-text-primary)">Dark Theme</h3>
          <div style="display:grid;grid-template-columns:1fr auto;gap:4px;align-items:center">
            ${tokens.map(row).join('')}
          </div>
        </div>
      </div>`;
  },
  parameters: { docs: { description: { story: 'Light vs. Dark Theme Vergleich der semantischen Tokens.' } } },
};
