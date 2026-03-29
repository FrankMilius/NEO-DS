// ============================================================
// Spacing — Foundation Token Showcase
// 13-stufige Scale auf 4px-Basegrid, teilweise fluid
// ============================================================

const SPACING_STEPS = [
  { token: '--fnd-spacing-01', label: '01', desc: '4px', type: 'static' },
  { token: '--fnd-spacing-02', label: '02', desc: '8px', type: 'static' },
  { token: '--fnd-spacing-03', label: '03', desc: '12px', type: 'static' },
  { token: '--fnd-spacing-04', label: '04', desc: '16px', type: 'static' },
  { token: '--fnd-spacing-05', label: '05', desc: '20px', type: 'static' },
  { token: '--fnd-spacing-06', label: '06', desc: '24px → fluid', type: 'fluid' },
  { token: '--fnd-spacing-07', label: '07', desc: '28px → fluid', type: 'fluid' },
  { token: '--fnd-spacing-08', label: '08', desc: '32px → fluid', type: 'fluid' },
  { token: '--fnd-spacing-09', label: '09', desc: '40px → fluid', type: 'fluid' },
  { token: '--fnd-spacing-10', label: '10', desc: '48px → fluid', type: 'fluid' },
  { token: '--fnd-spacing-11', label: '11', desc: '64px → fluid', type: 'fluid' },
  { token: '--fnd-spacing-12', label: '12', desc: '80px → fluid', type: 'fluid' },
  { token: '--fnd-spacing-13', label: '13', desc: '96px → fluid', type: 'fluid' },
];

export default {
  title: 'Foundations/Spacing',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**Spacing Foundation** — 13-stufige Scale auf dem 4px-Basegrid.
Stufen 01–05 sind statisch, Stufen 06–13 skalieren fluid mit \`clamp()\` zwischen 320px und 1400px Viewport.
Token-Prefix: \`--fnd-spacing-{01-13}\`.`,
      },
    },
  },
};

export const SpacingScale = {
  name: 'Spacing Scale',
  render: () => `<div style="padding:24px;display:flex;flex-direction:column;gap:8px">
    ${SPACING_STEPS.map(s => `
      <div style="display:flex;align-items:center;gap:16px">
        <code style="font-size:var(--fs-xs);color:var(--fnd-color-interactive-default);min-width:160px">${s.token}</code>
        <div style="height:24px;width:var(${s.token});background:${s.type === 'fluid' ? 'var(--fnd-color-interactive-default)' : 'var(--fnd-color-feedback-info)'};border-radius:var(--fnd-radius-xs);transition:width 0.3s ease"></div>
        <span style="font-size:var(--fs-xs);color:var(--fnd-color-text-tertiary);min-width:100px">${s.desc}</span>
        ${s.type === 'fluid' ? '<span style="font-size:var(--fs-2xs);color:var(--fnd-color-feedback-warning);background:color-mix(in srgb, var(--fnd-color-feedback-warning) 10%, transparent);padding:2px 6px;border-radius:var(--fnd-radius-xs)">fluid</span>' : '<span style="font-size:var(--fs-2xs);color:var(--fnd-color-feedback-info);background:color-mix(in srgb, var(--fnd-color-feedback-info) 10%, transparent);padding:2px 6px;border-radius:var(--fnd-radius-xs)">static</span>'}
      </div>
    `).join('')}
    <p style="font-size:var(--fs-xs);color:var(--fnd-color-text-tertiary);margin-top:16px">Viewport-Breite aendern um den Fluid-Effekt bei Stufen 06–13 zu sehen.</p>
  </div>`,
};

export const SpacingUsage = {
  name: 'Usage Patterns',
  render: () => `<div style="padding:24px;display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:24px">
    <div style="background:var(--fnd-color-layer-01);border-radius:var(--fnd-radius-md);border:1px solid var(--fnd-color-border-secondary)">
      <div style="padding:var(--fnd-spacing-02);background:color-mix(in srgb, var(--fnd-color-interactive-default) 8%, transparent);border-radius:var(--fnd-radius-md) var(--fnd-radius-md) 0 0">
        <code style="font-size:var(--fs-xs)">padding: var(--fnd-spacing-02)</code>
      </div>
      <div style="padding:var(--fnd-spacing-02)">Compact / Dense</div>
    </div>
    <div style="background:var(--fnd-color-layer-01);border-radius:var(--fnd-radius-md);border:1px solid var(--fnd-color-border-secondary)">
      <div style="padding:var(--fnd-spacing-04);background:color-mix(in srgb, var(--fnd-color-interactive-default) 8%, transparent);border-radius:var(--fnd-radius-md) var(--fnd-radius-md) 0 0">
        <code style="font-size:var(--fs-xs)">padding: var(--fnd-spacing-04)</code>
      </div>
      <div style="padding:var(--fnd-spacing-04)">Default / Comfortable</div>
    </div>
    <div style="background:var(--fnd-color-layer-01);border-radius:var(--fnd-radius-md);border:1px solid var(--fnd-color-border-secondary)">
      <div style="padding:var(--fnd-spacing-08);background:color-mix(in srgb, var(--fnd-color-interactive-default) 8%, transparent);border-radius:var(--fnd-radius-md) var(--fnd-radius-md) 0 0">
        <code style="font-size:var(--fs-xs)">padding: var(--fnd-spacing-08)</code>
      </div>
      <div style="padding:var(--fnd-spacing-08)">Spacious / Section</div>
    </div>
  </div>`,
};
