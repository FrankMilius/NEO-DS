// ============================================================
// Opacity — Foundation Token Showcase
// State Opacities + Content Opacities
// ============================================================

const STATE_OPACITIES = [
  { token: '--fnd-opacity-disabled', label: 'Disabled', value: '0.5', desc: 'Deaktivierte Elemente' },
  { token: '--fnd-opacity-hover', label: 'Hover', value: '0.08', desc: 'Hover-Overlay auf Surfaces' },
  { token: '--fnd-opacity-focus', label: 'Focus', value: '0.12', desc: 'Focus-Overlay' },
  { token: '--fnd-opacity-pressed', label: 'Pressed', value: '0.12', desc: 'Active/Pressed-Zustand' },
  { token: '--fnd-opacity-dragged', label: 'Dragged', value: '0.16', desc: 'Drag-Zustand' },
];

const CONTENT_OPACITIES = [
  { token: '--fnd-opacity-muted', label: 'Muted', value: '0.6' },
  { token: '--fnd-opacity-medium', label: 'Medium', value: '0.7' },
  { token: '--fnd-opacity-high', label: 'High', value: '0.8' },
  { token: '--fnd-opacity-prominent', label: 'Prominent', value: '0.85' },
  { token: '--fnd-opacity-subtle', label: 'Subtle', value: '0.9' },
];

export default {
  title: 'Foundations/Opacity',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**Opacity Foundation** — Semantische Opacity-Tokens fuer konsistente Zustandsdarstellung.
State Opacities werden als Overlay-Opacity verwendet, Content Opacities fuer gedaempfte Inhalte.`,
      },
    },
  },
};

export const StateOpacities = {
  name: 'State Opacities',
  render: () => `<div style="padding:24px;display:flex;flex-direction:column;gap:16px">
    ${STATE_OPACITIES.map(o => `
      <div style="display:flex;align-items:center;gap:16px">
        <code style="font-size:var(--fs-xs);color:var(--fnd-color-interactive-default);min-width:220px">${o.token}</code>
        <div style="position:relative;width:80px;height:48px;background:var(--fnd-color-interactive-default);border-radius:var(--fnd-radius-sm)">
          <div style="position:absolute;inset:0;background:currentColor;opacity:var(${o.token});border-radius:inherit"></div>
        </div>
        <span style="font-size:var(--fs-sm);font-weight:var(--fnd-font-weight-semibold);min-width:80px">${o.label}</span>
        <span style="font-size:var(--fs-xs);color:var(--fnd-color-text-tertiary)">${o.value} — ${o.desc}</span>
      </div>
    `).join('')}
  </div>`,
};

export const ContentOpacities = {
  name: 'Content Opacities',
  render: () => `<div style="padding:24px;display:flex;flex-direction:column;gap:12px">
    ${CONTENT_OPACITIES.map(o => `
      <div style="display:flex;align-items:center;gap:16px">
        <code style="font-size:var(--fs-xs);color:var(--fnd-color-interactive-default);min-width:220px">${o.token}</code>
        <span style="font-size:var(--fs-lg);opacity:var(${o.token})">${o.label} Text Example</span>
        <span style="font-size:var(--fs-xs);color:var(--fnd-color-text-tertiary)">${o.value}</span>
      </div>
    `).join('')}
  </div>`,
};

export const DisabledDemo = {
  name: 'Disabled State',
  render: () => `<div style="padding:24px;display:flex;gap:24px;flex-wrap:wrap">
    <div>
      <p style="font-size:var(--fs-xs);color:var(--fnd-color-text-tertiary);margin-bottom:8px">Enabled</p>
      <button class="nc-button"><span class="nc-button__label">Button</span></button>
    </div>
    <div>
      <p style="font-size:var(--fs-xs);color:var(--fnd-color-text-tertiary);margin-bottom:8px">Disabled (opacity: var(--fnd-opacity-disabled))</p>
      <button class="nc-button" disabled style="opacity:var(--fnd-opacity-disabled);pointer-events:none"><span class="nc-button__label">Button</span></button>
    </div>
  </div>`,
};
