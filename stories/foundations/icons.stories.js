// ============================================================
// Icons — Foundation Token Showcase
// Tabler Icons System, Sizes, Stroke Width
// ============================================================

// Repraesentative Icons aus verschiedenen Kategorien
const SAMPLE_ICONS = [
  { name: 'home', path: 'M6.906 3.774c.29-.214.655-.33 1.094-.33.44 0 .804.116 1.094.33l4.5 3.32c.35.257.575.574.674.917.1.343.15.756.15 1.236V14a2 2 0 0 1-2 2H3.582a2 2 0 0 1-2-2V9.247c0-.48.05-.893.15-1.236.1-.343.325-.66.674-.917l4.5-3.32Z' },
  { name: 'search', path: '' },
  { name: 'user', path: '' },
  { name: 'settings', path: '' },
  { name: 'bell', path: '' },
  { name: 'mail', path: '' },
  { name: 'heart', path: '' },
  { name: 'star', path: '' },
];

export default {
  title: 'Foundations/Icons',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**Icon Foundation** — Tabler Icons (\`@tabler/icons\` npm Package).
53 Kategorien, 5266+ Icons. Standard: 24px, stroke-width 1.5, currentColor.
Update-Flow: \`npm update @tabler/icons && npm run icons:sync && npm run icons\`.`,
      },
    },
  },
};

export const IconSpecs = {
  name: 'Icon Specifications',
  render: () => `<div style="padding:24px">
    <div class="nc-data-table nc-data-table--static nc-data-table--striped" style="max-width:600px">
      <table class="nc-data-table__table">
        <thead><tr><th>Eigenschaft</th><th>Wert</th></tr></thead>
        <tbody>
          <tr><td>Quelle</td><td><code>@tabler/icons</code> (npm)</td></tr>
          <tr><td>Kategorien</td><td>53</td></tr>
          <tr><td>Anzahl Icons</td><td>5266+</td></tr>
          <tr><td>Standardgroesse</td><td>24 × 24 px</td></tr>
          <tr><td>Stroke Width</td><td>1.5</td></tr>
          <tr><td>Farbe</td><td><code>currentColor</code> (erbt)</td></tr>
          <tr><td>ViewBox</td><td>0 0 24 24</td></tr>
          <tr><td>Fill</td><td><code>none</code> (Outline-Style)</td></tr>
        </tbody>
      </table>
    </div>
  </div>`,
};

export const IconSizes = {
  name: 'Icon Sizes',
  render: () => {
    const sizes = [
      { label: 'XS', size: '16', usage: 'Inline-Icons, Badges' },
      { label: 'SM', size: '20', usage: 'Buttons, Inputs, Kompakt' },
      { label: 'MD', size: '24', usage: 'Standard (Default)' },
      { label: 'LG', size: '32', usage: 'Feature-Icons, Hervorhebungen' },
      { label: 'XL', size: '48', usage: 'Hero-Icons, Empty States' },
    ];
    return `<div style="padding:24px;display:flex;gap:32px;flex-wrap:wrap;align-items:end">
      ${sizes.map(s => `
        <div style="text-align:center">
          <div style="margin-bottom:12px">
            <svg width="${s.size}" height="${s.size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="color:var(--fnd-color-text-primary)">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
          </div>
          <div style="font-weight:var(--fnd-font-weight-semibold);font-size:var(--fs-sm)">${s.label}</div>
          <div style="font-size:var(--fs-2xs);color:var(--fnd-color-text-tertiary)">${s.size}px</div>
          <div style="font-size:var(--fs-2xs);color:var(--fnd-color-text-secondary);margin-top:4px">${s.usage}</div>
        </div>
      `).join('')}
    </div>`;
  },
};

export const StrokeWidths = {
  name: 'Stroke Widths',
  render: () => {
    const strokes = [1, 1.25, 1.5, 2, 2.5];
    return `<div style="padding:24px;display:flex;gap:32px;flex-wrap:wrap;align-items:end">
      ${strokes.map(sw => `
        <div style="text-align:center">
          <div style="margin-bottom:12px">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" style="color:var(--fnd-color-text-primary)">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </div>
          <div style="font-weight:var(--fnd-font-weight-semibold);font-size:var(--fs-sm)">${sw}</div>
          <div style="font-size:var(--fs-2xs);color:var(--fnd-color-text-tertiary)">${sw === 1.5 ? 'Standard' : ''}</div>
        </div>
      `).join('')}
    </div>`;
  },
  parameters: { docs: { description: { story: 'Vergleich verschiedener Stroke Widths. Standard ist 1.5 — duennere/dickere Varianten nur fuer spezielle Faelle.' } } },
};

export const IconWithColor = {
  name: 'Color Inheritance',
  render: () => {
    const colors = [
      { name: 'text-primary', token: '--fnd-color-text-primary' },
      { name: 'text-secondary', token: '--fnd-color-text-secondary' },
      { name: 'interactive', token: '--fnd-color-interactive-default' },
      { name: 'success', token: '--fnd-color-feedback-success' },
      { name: 'warning', token: '--fnd-color-feedback-warning' },
      { name: 'danger', token: '--fnd-color-feedback-danger' },
    ];
    return `<div style="padding:24px">
      <p style="font-size:var(--fs-sm);color:var(--fnd-color-text-secondary);margin-bottom:16px">Icons erben ihre Farbe via <code>currentColor</code> vom Eltern-Element.</p>
      <div style="display:flex;gap:24px;flex-wrap:wrap">
        ${colors.map(c => `
          <div style="text-align:center;color:var(${c.token})">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572"/>
            </svg>
            <div style="font-size:var(--fs-2xs);margin-top:4px">${c.name}</div>
          </div>
        `).join('')}
      </div>
    </div>`;
  },
};
