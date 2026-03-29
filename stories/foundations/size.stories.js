// ============================================================
// Size Scale — Foundation Token Showcase
// Einheitliche Komponentenhoehen (XS–2XL) + Touch Target
// ============================================================

const SIZE_SCALE = [
  { token: '--fnd-size-xs', label: 'XS', value: '24px (1.5rem)', usage: 'Badges, kleine Tags, Inline-Elemente' },
  { token: '--fnd-size-sm', label: 'SM', value: '32px (2rem)', usage: 'Kompakte Buttons, kleine Inputs, Chips' },
  { token: '--fnd-size-md', label: 'MD', value: '40px (2.5rem)', usage: 'Standard Buttons, Inputs, Selects (Default)' },
  { token: '--fnd-size-lg', label: 'LG', value: '48px (3rem)', usage: 'Grosse Buttons, grosse Inputs, Tab-Trigger' },
  { token: '--fnd-size-xl', label: 'XL', value: '64px (4rem)', usage: 'Grosse Avatare, Feature-Icons' },
  { token: '--fnd-size-2xl', label: '2XL', value: '80px (5rem)', usage: 'Hero-Icons, grosse Avatare, Empty States' },
];

export default {
  title: 'Foundations/Size Scale',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**Size Scale Foundation** — Einheitliche Groessen-Skala fuer Komponentenhoehen.
Wiederkehrende Werte (24/32/40/48/64/80px) werden zentral definiert.
Mixin \`surface-size($size)\` mappt diese auf beliebige Surface-Komponenten.
WCAG 2.5.8: \`--fnd-size-touch-target: 44px\` Minimum-Touch-Ziel.`,
      },
    },
  },
};

export const SizeScaleVisual = {
  name: 'Size Scale',
  render: () => `<div style="padding:24px;display:flex;flex-direction:column;gap:16px">
    ${SIZE_SCALE.map(s => `
      <div style="display:flex;align-items:center;gap:16px">
        <code style="font-size:var(--fs-xs);color:var(--fnd-color-interactive-default);min-width:140px">${s.token}</code>
        <div style="width:var(${s.token});height:var(${s.token});background:var(--fnd-color-interactive-default);border-radius:var(--fnd-radius-sm);display:flex;align-items:center;justify-content:center;flex-shrink:0">
          <span style="color:white;font-size:var(--fs-2xs);font-weight:var(--fnd-font-weight-bold)">${s.label}</span>
        </div>
        <div>
          <span style="font-size:var(--fs-sm);font-weight:var(--fnd-font-weight-semibold)">${s.value}</span>
          <span style="font-size:var(--fs-xs);color:var(--fnd-color-text-tertiary);margin-left:8px">${s.usage}</span>
        </div>
      </div>
    `).join('')}
    <div style="display:flex;align-items:center;gap:16px;margin-top:8px;padding-top:16px;border-top:2px dashed var(--fnd-color-feedback-warning)">
      <code style="font-size:var(--fs-xs);color:var(--fnd-color-feedback-warning);min-width:140px">--fnd-size-touch-target</code>
      <div style="width:44px;height:44px;border:2px dashed var(--fnd-color-feedback-warning);border-radius:var(--fnd-radius-sm);display:flex;align-items:center;justify-content:center;flex-shrink:0">
        <span style="font-size:var(--fs-2xs);color:var(--fnd-color-feedback-warning);font-weight:var(--fnd-font-weight-bold)">44</span>
      </div>
      <div>
        <span style="font-size:var(--fs-sm);font-weight:var(--fnd-font-weight-semibold)">44px (2.75rem)</span>
        <span style="font-size:var(--fs-xs);color:var(--fnd-color-feedback-warning);margin-left:8px">WCAG 2.5.8 Minimum</span>
      </div>
    </div>
  </div>`,
};

export const SizeInComponents = {
  name: 'Size in Components',
  render: () => `<div style="padding:24px">
    <p style="font-size:var(--fs-sm);color:var(--fnd-color-text-secondary);margin-bottom:16px">Die Size Scale wird von Buttons, Inputs, Selects, Chips, Tags und anderen Oberflaechenkomponenten geteilt — ueber den <code>surface-size()</code> Mixin.</p>
    <div style="display:flex;gap:16px;flex-wrap:wrap;align-items:end;margin-bottom:24px">
      ${['xs', 'sm', 'md', 'lg'].map(size => `
        <div style="text-align:center">
          <button class="nc-button nc-button--${size === 'md' ? '' : size}" style="${size === 'md' ? '' : ''}"><span class="nc-button__label">${size.toUpperCase()}</span></button>
          <div style="font-size:var(--fs-2xs);color:var(--fnd-color-text-tertiary);margin-top:4px">Button ${size.toUpperCase()}</div>
        </div>
      `).join('')}
    </div>
    <div style="padding:16px;background:var(--fnd-color-layer-01);border-radius:var(--fnd-radius-md);border:1px solid var(--fnd-color-border-secondary)">
      <h4 style="margin-top:0;font-size:var(--fs-sm)">SCSS Mixin</h4>
      <pre style="font-size:var(--fs-xs);color:var(--fnd-color-text-secondary);margin:0"><code>// Mappt standard heights auf beliebige Surface
@include surface-size('sm');  // → height: var(--fnd-size-sm)
@include surface-size('md');  // → height: var(--fnd-size-md)
@include surface-size('lg');  // → height: var(--fnd-size-lg)</code></pre>
    </div>
  </div>`,
};
