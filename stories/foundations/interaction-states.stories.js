// ============================================================
// Interaction States — Foundation Pattern Showcase
// Hover, Focus, Active, Disabled, Loading
// ============================================================

export default {
  title: 'Foundations/Interaction States',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**Interaction States** — Konsistente Zustandsdarstellung ueber alle Komponenten.
Verwendet Foundation Tokens: \`--fnd-opacity-*\` fuer States, \`color-mix()\` fuer Hover/Active,
\`@include focus-ring\` fuer Focus-Indikatoren. Dark Mode mischt Richtung \`always-light\`.`,
      },
    },
  },
};

export const ButtonStates = {
  name: 'Button States',
  render: () => `<div style="padding:24px">
    <h3 style="margin-bottom:16px;font-size:var(--fs-base)">Primary Button</h3>
    <div style="display:flex;gap:16px;flex-wrap:wrap;align-items:center;margin-bottom:32px">
      <div style="text-align:center">
        <button class="nc-button"><span class="nc-button__label">Default</span></button>
        <div style="font-size:var(--fs-2xs);color:var(--fnd-color-text-tertiary);margin-top:8px">Default</div>
      </div>
      <div style="text-align:center">
        <button class="nc-button" style="filter:brightness(1.1)"><span class="nc-button__label">Hover</span></button>
        <div style="font-size:var(--fs-2xs);color:var(--fnd-color-text-tertiary);margin-top:8px">:hover</div>
      </div>
      <div style="text-align:center">
        <button class="nc-button" style="outline:2px solid var(--fnd-color-interactive-default);outline-offset:2px"><span class="nc-button__label">Focus</span></button>
        <div style="font-size:var(--fs-2xs);color:var(--fnd-color-text-tertiary);margin-top:8px">:focus-visible</div>
      </div>
      <div style="text-align:center">
        <button class="nc-button" style="filter:brightness(0.9);transform:scale(0.98)"><span class="nc-button__label">Active</span></button>
        <div style="font-size:var(--fs-2xs);color:var(--fnd-color-text-tertiary);margin-top:8px">:active</div>
      </div>
      <div style="text-align:center">
        <button class="nc-button" disabled style="opacity:var(--fnd-opacity-disabled);pointer-events:none"><span class="nc-button__label">Disabled</span></button>
        <div style="font-size:var(--fs-2xs);color:var(--fnd-color-text-tertiary);margin-top:8px">:disabled</div>
      </div>
    </div>
    <h3 style="margin-bottom:16px;font-size:var(--fs-base)">Input States</h3>
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:16px">
      <div>
        <div style="font-size:var(--fs-2xs);color:var(--fnd-color-text-tertiary);margin-bottom:4px">Default</div>
        <input class="nc-input" type="text" value="Default" />
      </div>
      <div>
        <div style="font-size:var(--fs-2xs);color:var(--fnd-color-text-tertiary);margin-bottom:4px">Disabled</div>
        <input class="nc-input" type="text" value="Disabled" disabled />
      </div>
    </div>
  </div>`,
};

export const FocusRingPattern = {
  name: 'Focus Ring',
  render: () => `<div style="padding:24px">
    <p style="font-size:var(--fs-sm);color:var(--fnd-color-text-secondary);margin-bottom:16px">Tab-Taste druecken um den Focus-Ring zu sehen. Alle interaktiven Elemente verwenden \`@include focus-ring\`.</p>
    <div style="display:flex;gap:16px;flex-wrap:wrap;align-items:center">
      <button class="nc-button"><span class="nc-button__label">Button</span></button>
      <a href="#" class="nc-link" style="color:var(--fnd-color-interactive-default)">Link</a>
      <input class="nc-input" type="text" placeholder="Input" style="width:160px" />
      <select class="nc-select" style="width:160px"><option>Select</option></select>
    </div>
    <div style="margin-top:24px;padding:16px;background:var(--fnd-color-layer-01);border-radius:var(--fnd-radius-md);border:1px solid var(--fnd-color-border-secondary)">
      <h4 style="margin-top:0;font-size:var(--fs-sm)">Spezifikation</h4>
      <pre style="font-size:var(--fs-xs);color:var(--fnd-color-text-secondary);margin:0"><code>outline: 2px solid var(--fnd-color-interactive-default);
outline-offset: 2px;
border-radius: inherit;</code></pre>
    </div>
  </div>`,
  parameters: { docs: { description: { story: 'Focus Ring Pattern — WCAG 2.4.7 konform. Sichtbar nur bei Tastatur-Navigation (:focus-visible).' } } },
};

export const ColorMixPattern = {
  name: 'color-mix() Pattern',
  render: () => `<div style="padding:24px">
    <p style="font-size:var(--fs-sm);color:var(--fnd-color-text-secondary);margin-bottom:16px">NEO verwendet \`color-mix(in srgb, base X%, --fnd-state-mix-target)\` statt \`rgba()\` fuer Hover/Active States.</p>
    <div style="display:flex;gap:4px;flex-wrap:wrap">
      ${[100,95,90,85,80,75,70].map(pct => `
        <div style="width:80px;height:60px;background:color-mix(in srgb, var(--fnd-color-interactive-default) ${pct}%, white);border-radius:var(--fnd-radius-sm);display:flex;align-items:center;justify-content:center">
          <span style="font-size:var(--fs-2xs);font-weight:var(--fnd-font-weight-semibold);color:white">${pct}%</span>
        </div>
      `).join('')}
    </div>
    <p style="font-size:var(--fs-xs);color:var(--fnd-color-text-tertiary);margin-top:12px">100% = Default, 85% = Hover, 75% = Active</p>
  </div>`,
};
