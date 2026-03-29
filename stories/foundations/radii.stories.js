// ============================================================
// Radii — Foundation Token Showcase
// Border Radius Scale (10 Stufen)
// ============================================================

const RADII = [
  { token: '--fnd-radius-null', label: 'null', value: '0px' },
  { token: '--fnd-radius-xs', label: 'XS', value: '2px' },
  { token: '--fnd-radius-sm', label: 'SM', value: '4px' },
  { token: '--fnd-radius-md', label: 'MD', value: '6px' },
  { token: '--fnd-radius-lg', label: 'LG', value: '8px' },
  { token: '--fnd-radius-xl', label: 'XL', value: '10px' },
  { token: '--fnd-radius-2xl', label: '2XL', value: '12px' },
  { token: '--fnd-radius-3xl', label: '3XL', value: '14px' },
  { token: '--fnd-radius-4xl', label: '4XL', value: '16px' },
  { token: '--fnd-radius-full', label: 'Full', value: '9999px' },
];

export default {
  title: 'Foundations/Radii',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**Radii Foundation** — 10-stufige Border-Radius Scale von Sharp (0px) bis Pill (9999px).
Token-Prefix: \`--fnd-radius-{size}\`. Default ist SM (4px).`,
      },
    },
  },
};

export const RadiusScale = {
  name: 'Radius Scale',
  render: () => `<div style="padding:24px;display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:24px">
    ${RADII.map(r => `
      <div style="text-align:center">
        <div style="width:80px;height:80px;margin:0 auto 12px;background:var(--fnd-color-interactive-default);border-radius:var(${r.token})"></div>
        <div style="font-weight:var(--fnd-font-weight-semibold)">${r.label}</div>
        <code style="font-size:var(--fs-2xs);color:var(--fnd-color-text-secondary)">${r.value}</code>
        <div><code style="font-size:var(--fs-2xs);color:var(--fnd-color-interactive-default)">${r.token}</code></div>
      </div>
    `).join('')}
  </div>`,
};

export const RadiusInContext = {
  name: 'In Context',
  render: () => `<div style="padding:24px;display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:16px">
    ${[
      { r: '--fnd-radius-sm', use: 'Buttons, Inputs, Badges' },
      { r: '--fnd-radius-md', use: 'Cards, Panels' },
      { r: '--fnd-radius-lg', use: 'Modals, Drawers' },
      { r: '--fnd-radius-full', use: 'Chips, Pills, Avatare' },
    ].map(item => `
      <div style="padding:16px;background:var(--fnd-color-layer-01);border-radius:var(${item.r});border:1px solid var(--fnd-color-border-secondary)">
        <code style="font-size:var(--fs-xs);color:var(--fnd-color-interactive-default)">${item.r}</code>
        <p style="font-size:var(--fs-sm);color:var(--fnd-color-text-secondary);margin-top:8px">${item.use}</p>
      </div>
    `).join('')}
  </div>`,
};
