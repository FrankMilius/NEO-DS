// ============================================================
// Shadow & Elevation — Foundation Token Showcase
// Shadow Levels, Elevation Stufen, Dark Mode Verhalten
// ============================================================

const SHADOWS = [
  { token: '--fnd-shadow-xs', label: 'XS', desc: 'Subtile Abgrenzung' },
  { token: '--fnd-shadow-sm', label: 'SM', desc: 'Cards, Inputs' },
  { token: '--fnd-shadow-md', label: 'MD', desc: 'Dropdowns, Popovers' },
  { token: '--fnd-shadow-lg', label: 'LG', desc: 'Drawer, Notifications' },
  { token: '--fnd-shadow-xl', label: 'XL', desc: 'Modals, Dialoge' },
];

const ELEVATIONS = [
  { token: '--fnd-elevation-base', label: 'Base', desc: 'Keine Erhebung (Level 0)' },
  { token: '--fnd-elevation-raised', label: 'Raised', desc: 'Cards, Badges' },
  { token: '--fnd-elevation-floating', label: 'Floating', desc: 'Dropdowns, Tooltips' },
  { token: '--fnd-elevation-overlay', label: 'Overlay', desc: 'Drawer, Sidebar' },
  { token: '--fnd-elevation-modal', label: 'Modal', desc: 'Modale Dialoge' },
];

export default {
  title: 'Foundations/Shadow & Elevation',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**Shadow & Elevation Foundation** — 5-stufige Shadow Scale + semantische Elevation Levels.
Shadows sind theme-aware: Im Dark Mode werden Schatten verstaerkt fuer bessere Sichtbarkeit.
Inset-Varianten (\`--fnd-shadow-inset-sm/md\`) fuer gedrueckte Zustaende.`,
      },
    },
  },
};

export const ShadowLevels = {
  name: 'Shadow Levels',
  render: () => `<div style="padding:32px;display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:32px">
    ${SHADOWS.map(s => `
      <div style="padding:24px;background:var(--fnd-color-background-base);border-radius:var(--fnd-radius-lg);box-shadow:var(${s.token});text-align:center">
        <div style="font-weight:var(--fnd-font-weight-semibold);margin-bottom:8px">${s.label}</div>
        <code style="font-size:var(--fs-2xs);color:var(--fnd-color-interactive-default)">${s.token}</code>
        <p style="font-size:var(--fs-xs);color:var(--fnd-color-text-tertiary);margin-top:8px">${s.desc}</p>
      </div>
    `).join('')}
  </div>`,
};

export const ElevationLevels = {
  name: 'Elevation (Semantic)',
  render: () => `<div style="padding:32px;display:flex;flex-direction:column;gap:16px">
    ${ELEVATIONS.map((e, i) => `
      <div style="padding:20px;background:var(--fnd-color-background-base);border-radius:var(--fnd-radius-md);box-shadow:var(${e.token});display:flex;align-items:center;gap:16px;margin-left:${i * 16}px">
        <span style="font-weight:var(--fnd-font-weight-semibold);min-width:80px">${e.label}</span>
        <code style="font-size:var(--fs-xs);color:var(--fnd-color-interactive-default)">${e.token}</code>
        <span style="font-size:var(--fs-xs);color:var(--fnd-color-text-tertiary);margin-left:auto">${e.desc}</span>
      </div>
    `).join('')}
  </div>`,
  parameters: { docs: { description: { story: 'Semantische Elevation Stufen — von flach (Base) bis schwebend (Modal). Einrueckung zeigt die Hierarchie.' } } },
};

export const InsetShadows = {
  name: 'Inset Shadows',
  render: () => `<div style="padding:24px;display:flex;gap:32px;flex-wrap:wrap">
    <div style="width:200px;height:80px;background:var(--fnd-color-layer-01);border-radius:var(--fnd-radius-md);box-shadow:var(--fnd-shadow-inset-sm);display:flex;align-items:center;justify-content:center">
      <div>
        <div style="font-weight:var(--fnd-font-weight-semibold)">Inset SM</div>
        <code style="font-size:var(--fs-2xs);color:var(--fnd-color-interactive-default)">--fnd-shadow-inset-sm</code>
      </div>
    </div>
    <div style="width:200px;height:80px;background:var(--fnd-color-layer-01);border-radius:var(--fnd-radius-md);box-shadow:var(--fnd-shadow-inset-md);display:flex;align-items:center;justify-content:center">
      <div>
        <div style="font-weight:var(--fnd-font-weight-semibold)">Inset MD</div>
        <code style="font-size:var(--fs-2xs);color:var(--fnd-color-interactive-default)">--fnd-shadow-inset-md</code>
      </div>
    </div>
  </div>`,
};
