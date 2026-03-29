// ============================================================
// Motion — Foundation Token Showcase
// Keyframes, Easing, Duration, Reduced Motion
// ============================================================

const ANIMATIONS = [
  { name: 'fade-in', desc: 'Einblenden (opacity 0→1)' },
  { name: 'fade-out', desc: 'Ausblenden (opacity 1→0)' },
  { name: 'slide-up', desc: 'Von unten einschieben' },
  { name: 'slide-down', desc: 'Von oben einschieben' },
  { name: 'slide-left', desc: 'Von rechts einschieben' },
  { name: 'slide-right', desc: 'Von links einschieben' },
  { name: 'scale-up', desc: 'Vergroessern (0.95→1)' },
  { name: 'scale-down', desc: 'Verkleinern (1→0.95)' },
  { name: 'spin', desc: 'Rotation 360°' },
  { name: 'bounce', desc: 'Huepfbewegung' },
  { name: 'pulse', desc: 'Pulsieren (Skalierung)' },
  { name: 'shake', desc: 'Schuetteln (horizontal)' },
];

export default {
  title: 'Foundations/Motion',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**Motion Foundation** — 12 Keyframe-Animationen + Easing/Duration Tokens.
Alle Animationen respektieren \`prefers-reduced-motion: reduce\` automatisch.
Easing: \`--fnd-ease-{type}\`, Duration: \`--fnd-duration-{speed}\`.`,
      },
    },
  },
};

export const KeyframeAnimations = {
  name: 'Keyframe Animations',
  render: () => `<style>
    .motion-demo { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 24px; padding: 24px; }
    .motion-card { text-align: center; padding: 16px; background: var(--fnd-color-layer-01); border-radius: var(--fnd-radius-md); border: 1px solid var(--fnd-color-border-secondary); cursor: pointer; }
    .motion-card:hover .motion-box { animation-play-state: running; }
    .motion-box { width: 48px; height: 48px; margin: 0 auto 12px; background: var(--fnd-color-interactive-default); border-radius: var(--fnd-radius-sm); animation-duration: 1s; animation-iteration-count: infinite; animation-play-state: paused; animation-timing-function: ease-in-out; }
  </style>
  <p style="padding:24px 24px 0;font-size:var(--fs-sm);color:var(--fnd-color-text-secondary)">Hover ueber eine Karte um die Animation zu starten.</p>
  <div class="motion-demo">
    ${ANIMATIONS.map(a => `
      <div class="motion-card">
        <div class="motion-box" style="animation-name:${a.name}"></div>
        <div style="font-weight:var(--fnd-font-weight-semibold);font-size:var(--fs-sm)">${a.name}</div>
        <div style="font-size:var(--fs-2xs);color:var(--fnd-color-text-tertiary)">${a.desc}</div>
      </div>
    `).join('')}
  </div>`,
};

export const EasingFunctions = {
  name: 'Easing Functions',
  render: () => {
    const easings = [
      { name: 'linear', token: '--fnd-ease-linear' },
      { name: 'in', token: '--fnd-ease-in' },
      { name: 'out', token: '--fnd-ease-out' },
      { name: 'in-out', token: '--fnd-ease-in-out' },
      { name: 'spring', token: '--fnd-ease-spring' },
    ];
    return `<style>
      .easing-row { display:flex; align-items:center; gap:16px; padding:12px 0; border-bottom:1px solid var(--fnd-color-border-secondary); }
      .easing-bar { height:8px; width:0; background:var(--fnd-color-interactive-default); border-radius:var(--fnd-radius-full); }
      .easing-row:hover .easing-bar { width:100%; }
    </style>
    <div style="padding:24px">
      <p style="font-size:var(--fs-sm);color:var(--fnd-color-text-secondary);margin-bottom:16px">Hover ueber eine Zeile um das Easing zu sehen.</p>
      ${easings.map(e => `
        <div class="easing-row">
          <code style="font-size:var(--fs-xs);color:var(--fnd-color-interactive-default);min-width:160px">${e.token}</code>
          <div style="flex:1"><div class="easing-bar" style="transition:width 1s var(${e.token}, ease)"></div></div>
          <span style="font-size:var(--fs-xs);color:var(--fnd-color-text-tertiary);min-width:60px">${e.name}</span>
        </div>
      `).join('')}
    </div>`;
  },
};

export const DurationScale = {
  name: 'Duration Scale',
  render: () => {
    const durations = [
      { token: '--fnd-duration-instant', label: 'Instant', value: '100ms' },
      { token: '--fnd-duration-fast', label: 'Fast', value: '150ms' },
      { token: '--fnd-duration-normal', label: 'Normal', value: '200ms' },
      { token: '--fnd-duration-slow', label: 'Slow', value: '300ms' },
      { token: '--fnd-duration-slower', label: 'Slower', value: '500ms' },
    ];
    return `<div style="padding:24px;display:flex;flex-direction:column;gap:12px">
      ${durations.map(d => `
        <div style="display:flex;align-items:center;gap:16px;padding:8px 0;border-bottom:1px solid var(--fnd-color-border-secondary)">
          <code style="font-size:var(--fs-xs);color:var(--fnd-color-interactive-default);min-width:200px">${d.token}</code>
          <div style="width:60px;height:24px;background:var(--fnd-color-interactive-default);border-radius:var(--fnd-radius-sm);opacity:0.3;transition:opacity var(${d.token}) ease" onmouseenter="this.style.opacity=1" onmouseleave="this.style.opacity=0.3"></div>
          <span style="font-size:var(--fs-xs);color:var(--fnd-color-text-tertiary)">${d.label} (${d.value})</span>
        </div>
      `).join('')}
    </div>`;
  },
};
