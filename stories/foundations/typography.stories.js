// ============================================================
// Typography — Foundation Token Showcase
// Fluid Type Scale, Font Weights, Prose Settings
// ============================================================

const FLUID_SCALE = [
  { name: '--fs-2xs', label: '2XS' },
  { name: '--fs-xs', label: 'XS' },
  { name: '--fs-sm', label: 'SM' },
  { name: '--fs-base', label: 'Base' },
  { name: '--fs-lg', label: 'LG' },
  { name: '--fs-xl', label: 'XL' },
  { name: '--fs-2xl', label: '2XL' },
  { name: '--fs-3xl', label: '3XL' },
  { name: '--fs-4xl', label: '4XL' },
  { name: '--fs-5xl', label: '5XL' },
  { name: '--fs-6xl', label: '6XL' },
  { name: '--fs-7xl', label: '7XL' },
  { name: '--fs-8xl', label: '8XL' },
  { name: '--fs-9xl', label: '9XL' },
];

const FONT_WEIGHTS = [
  { token: '--fnd-font-weight-light', label: 'Light', value: '300' },
  { token: '--fnd-font-weight-regular', label: 'Regular', value: '400' },
  { token: '--fnd-font-weight-medium', label: 'Medium', value: '500' },
  { token: '--fnd-font-weight-semibold', label: 'Semibold', value: '600' },
  { token: '--fnd-font-weight-bold', label: 'Bold', value: '700' },
  { token: '--fnd-font-weight-black', label: 'Black', value: '900' },
];

export default {
  title: 'Foundations/Typography',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**Typography Foundation** — Fluid Type Scale via \`clamp()\`, Ratio 1.2, Base 14–18px.
Token-Prefix: \`--fs-{size}\` fuer Font Sizes, \`--fnd-font-weight-{name}\` fuer Gewichte.`,
      },
    },
  },
};

export const FluidTypeScale = {
  name: 'Fluid Type Scale',
  render: () => `<div style="padding:24px;display:flex;flex-direction:column;gap:16px">
    ${FLUID_SCALE.map(s => `
      <div style="display:flex;align-items:baseline;gap:16px;border-bottom:1px solid var(--fnd-color-border-secondary);padding-bottom:12px">
        <code style="font-size:var(--fs-xs);color:var(--fnd-color-interactive-default);min-width:100px">${s.name}</code>
        <span style="font-size:var(${s.name});font-weight:var(--fnd-font-weight-semibold);color:var(--fnd-color-text-primary)">The quick brown fox — ${s.label}</span>
      </div>
    `).join('')}
  </div>`,
  parameters: { docs: { description: { story: 'Alle 14 Stufen der Fluid Type Scale (2XS–9XL). Skaliert via clamp() zwischen 320px und 1400px Viewport.' } } },
};

export const FontWeights = {
  name: 'Font Weights',
  render: () => `<div style="padding:24px;display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:24px">
    ${FONT_WEIGHTS.map(w => `
      <div style="padding:16px;background:var(--fnd-color-layer-01);border-radius:var(--fnd-radius-md);border:1px solid var(--fnd-color-border-secondary)">
        <div style="font-size:var(--fs-2xl);font-weight:var(${w.token});margin-bottom:8px;color:var(--fnd-color-text-primary)">Aa Bb Cc 123</div>
        <code style="font-size:var(--fs-xs);color:var(--fnd-color-interactive-default)">${w.token}</code>
        <span style="font-size:var(--fs-xs);color:var(--fnd-color-text-tertiary);margin-left:8px">${w.label} (${w.value})</span>
      </div>
    `).join('')}
  </div>`,
  parameters: { docs: { description: { story: 'Alle 6 Font-Weight Tokens. Keine numerischen Werte in Komponenten — immer Token verwenden.' } } },
};

export const HeadingHierarchy = {
  name: 'Heading Hierarchy',
  render: () => `<div style="padding:24px;display:flex;flex-direction:column;gap:12px">
    <h1 style="margin:0">h1 — Hauptueberschrift</h1>
    <h2 style="margin:0">h2 — Unterueberschrift</h2>
    <h3 style="margin:0">h3 — Abschnittstitel</h3>
    <h4 style="margin:0">h4 — Gruppenheading</h4>
    <h5 style="margin:0">h5 — Label/Subtitle</h5>
    <h6 style="margin:0">h6 — Caption/Overline</h6>
    <p style="margin:0;max-width:var(--fnd-prose-max-width)">Fliesstext — Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.</p>
  </div>`,
  parameters: { docs: { description: { story: 'HTML Heading Hierarchie h1–h6 mit Fliesstext. Alle Groessen sind fluid.' } } },
};

export const ProseMaxWidth = {
  name: 'Prose Max Width',
  render: () => `<div style="padding:24px">
    <div style="max-width:var(--fnd-prose-max-width);background:var(--fnd-color-layer-01);padding:24px;border-radius:var(--fnd-radius-md);border:1px solid var(--fnd-color-border-secondary)">
      <h3 style="margin-top:0">Prose Container</h3>
      <p>Fliesstext wird auf <code>--fnd-prose-max-width</code> begrenzt fuer optimale Leserlichkeit (ca. 65–75 Zeichen pro Zeile). Dies entspricht typografischen Best Practices fuer Bildschirmlesung.</p>
      <p>Ein zweiter Absatz demonstriert den natuerlichen Textfluss. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nunc id aliquam tincidunt, nisl nunc tincidunt urna.</p>
    </div>
  </div>`,
};
