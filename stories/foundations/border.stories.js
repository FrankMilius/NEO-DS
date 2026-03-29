// ============================================================
// Border — Foundation Token Showcase
// Border Width Scale + Border Styles
// ============================================================

const BORDER_WIDTHS = [
  { token: '--fnd-border-width-null', label: 'null', value: '0px' },
  { token: '--fnd-border-width-xs', label: 'XS (hairline)', value: '1px' },
  { token: '--fnd-border-width-sm', label: 'SM (default)', value: '2px' },
  { token: '--fnd-border-width-md', label: 'MD', value: '4px' },
  { token: '--fnd-border-width-lg', label: 'LG', value: '6px' },
  { token: '--fnd-border-width-xl', label: 'XL (bold)', value: '8px' },
];

export default {
  title: 'Foundations/Border',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**Border Foundation** — 6-stufige Border-Width Scale + 3 Styles (solid, dashed, dotted).
Token-Prefix: \`--fnd-border-width-{size}\`. Default ist SM (2px).
Semantische Aliases: hairline=XS, thin=XS, light=SM, medium=LG, bold=XL.`,
      },
    },
  },
};

export const BorderWidthScale = {
  name: 'Border Width Scale',
  render: () => `<div style="padding:24px;display:flex;flex-direction:column;gap:16px">
    ${BORDER_WIDTHS.map(b => `
      <div style="display:flex;align-items:center;gap:16px">
        <code style="font-size:var(--fs-xs);color:var(--fnd-color-interactive-default);min-width:220px">${b.token}</code>
        <div style="width:200px;height:48px;border:var(${b.token}) solid var(--fnd-color-border-strong);border-radius:var(--fnd-radius-md);background:var(--fnd-color-layer-01)"></div>
        <span style="font-size:var(--fs-sm);font-weight:var(--fnd-font-weight-semibold);min-width:120px">${b.label}</span>
        <span style="font-size:var(--fs-xs);color:var(--fnd-color-text-tertiary)">${b.value}</span>
      </div>
    `).join('')}
  </div>`,
};

export const BorderStyles = {
  name: 'Border Styles',
  render: () => `<div style="padding:24px;display:flex;gap:24px;flex-wrap:wrap">
    ${['solid', 'dashed', 'dotted'].map(style => `
      <div style="width:200px;height:80px;border:var(--fnd-border-width-sm) ${style} var(--fnd-color-border-strong);border-radius:var(--fnd-radius-md);display:flex;align-items:center;justify-content:center;background:var(--fnd-color-layer-01)">
        <span style="font-weight:var(--fnd-font-weight-semibold)">${style}</span>
      </div>
    `).join('')}
  </div>`,
};
