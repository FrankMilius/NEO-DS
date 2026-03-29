// ============================================================
// Layout — Foundation Token Showcase
// Z-Index Scale, Content Width, Media Ratios, Nav Height
// ============================================================

const Z_INDEX_SCALE = [
  { token: '--fnd-z-base', value: '0', desc: 'Standard-Fluss' },
  { token: '--fnd-z-dropdown', value: '10', desc: 'Dropdowns, Tooltips' },
  { token: '--fnd-z-sticky', value: '20', desc: 'Sticky Elements' },
  { token: '--fnd-z-fixed', value: '50', desc: 'Fixed Positionen' },
  { token: '--fnd-z-header', value: '100', desc: 'Header/Navigation' },
  { token: '--fnd-z-sidebar', value: '200', desc: 'Sidebar-Overlay' },
  { token: '--fnd-z-drawer', value: '300', desc: 'Drawer/Panels' },
  { token: '--fnd-z-notification', value: '400', desc: 'Benachrichtigungen' },
  { token: '--fnd-z-toast', value: '500', desc: 'Toast Messages' },
  { token: '--fnd-z-skip-link', value: '9999', desc: 'Skip-to-Content Link' },
];

const MEDIA_RATIOS = [
  { name: '1:1', token: '--fnd-media-ratio-1-1' },
  { name: '4:3', token: '--fnd-media-ratio-4-3' },
  { name: '3:2', token: '--fnd-media-ratio-3-2' },
  { name: '16:9', token: '--fnd-media-ratio-16-9' },
  { name: '2:1', token: '--fnd-media-ratio-2-1' },
  { name: '9:16', token: '--fnd-media-ratio-9-16' },
];

export default {
  title: 'Foundations/Layout',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**Layout Foundation** — Z-Index Scale, Content Width Constraints, Media Ratios, Navigation Heights.
Z-Index: \`--fnd-z-{layer}\` — semantische Schichtung statt magischer Zahlen.
Content-Width: \`--fnd-content-max-width\` (1440px), \`--fnd-content-wide-max-width\` (1600px).`,
      },
    },
  },
};

export const ZIndexScale = {
  name: 'Z-Index Scale',
  render: () => `<div style="padding:24px">
    <div style="position:relative;height:${Z_INDEX_SCALE.length * 44 + 40}px">
      ${Z_INDEX_SCALE.map((z, i) => {
        const width = 90 - i * 5;
        return `
          <div style="position:absolute;top:${i * 44}px;left:${i * 12}px;right:${100 - width}%;padding:10px 16px;background:color-mix(in srgb, var(--fnd-color-interactive-default) ${15 + i * 8}%, var(--fnd-color-background-base));border:1px solid var(--fnd-color-border-secondary);border-radius:var(--fnd-radius-sm);display:flex;justify-content:space-between;align-items:center">
            <div>
              <code style="font-size:var(--fs-xs);color:var(--fnd-color-interactive-default)">${z.token}</code>
              <span style="font-size:var(--fs-xs);color:var(--fnd-color-text-tertiary);margin-left:12px">${z.desc}</span>
            </div>
            <span style="font-size:var(--fs-sm);font-weight:var(--fnd-font-weight-bold);color:var(--fnd-color-text-primary)">${z.value}</span>
          </div>`;
      }).join('')}
    </div>
  </div>`,
  parameters: { docs: { description: { story: 'Semantische Z-Index Schichtung — nie hardcoded Zahlen verwenden, immer Tokens.' } } },
};

export const ContentWidth = {
  name: 'Content Width',
  render: () => `<div style="padding:24px">
    <div style="max-width:100%;overflow-x:auto">
      <div style="position:relative;height:120px;min-width:600px">
        <div style="position:absolute;left:0;right:0;height:30px;top:0;background:color-mix(in srgb, var(--fnd-color-feedback-info) 10%, transparent);border:1px dashed var(--fnd-color-feedback-info);border-radius:var(--fnd-radius-sm);display:flex;align-items:center;padding:0 12px">
          <code style="font-size:var(--fs-2xs);color:var(--fnd-color-feedback-info)">Viewport (100%)</code>
        </div>
        <div style="position:absolute;left:5%;right:5%;height:30px;top:40px;background:color-mix(in srgb, var(--fnd-color-interactive-default) 10%, transparent);border:1px dashed var(--fnd-color-interactive-default);border-radius:var(--fnd-radius-sm);display:flex;align-items:center;padding:0 12px">
          <code style="font-size:var(--fs-2xs);color:var(--fnd-color-interactive-default)">--fnd-content-wide-max-width: 1600px</code>
        </div>
        <div style="position:absolute;left:10%;right:10%;height:30px;top:80px;background:color-mix(in srgb, var(--fnd-color-feedback-success) 15%, transparent);border:1px solid var(--fnd-color-feedback-success);border-radius:var(--fnd-radius-sm);display:flex;align-items:center;padding:0 12px">
          <code style="font-size:var(--fs-2xs);color:var(--fnd-color-feedback-success)">--fnd-content-max-width: 1440px</code>
        </div>
      </div>
    </div>
  </div>`,
};

export const MediaRatios = {
  name: 'Media Ratios',
  render: () => `<div style="padding:24px;display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:16px">
    ${MEDIA_RATIOS.map(r => `
      <div style="text-align:center">
        <div style="aspect-ratio:var(${r.token});background:var(--fnd-color-layer-01);border:1px solid var(--fnd-color-border-secondary);border-radius:var(--fnd-radius-md);display:flex;align-items:center;justify-content:center;margin-bottom:8px">
          <span style="font-size:var(--fs-lg);font-weight:var(--fnd-font-weight-bold);color:var(--fnd-color-text-secondary)">${r.name}</span>
        </div>
        <code style="font-size:var(--fs-2xs);color:var(--fnd-color-interactive-default)">${r.token}</code>
      </div>
    `).join('')}
  </div>`,
  parameters: { docs: { description: { story: 'Vordefinierte Media Aspect Ratios. Verwendet in .nc-aspect-ratio, Hero-Hintergruende, Card-Media.' } } },
};

export const NavigationHeight = {
  name: 'Navigation Height',
  render: () => `<div style="padding:24px">
    <div style="display:flex;gap:32px;flex-wrap:wrap">
      <div style="text-align:center">
        <div style="width:200px;height:var(--nav-height);background:var(--fnd-color-layer-01);border:1px solid var(--fnd-color-border-secondary);border-radius:var(--fnd-radius-md);display:flex;align-items:center;justify-content:center">
          <span style="font-weight:var(--fnd-font-weight-semibold)">Nav Bar</span>
        </div>
        <code style="font-size:var(--fs-xs);color:var(--fnd-color-interactive-default);margin-top:8px;display:block">--nav-height</code>
        <span style="font-size:var(--fs-2xs);color:var(--fnd-color-text-tertiary)">Mobile: 56px / Desktop: 64px</span>
      </div>
    </div>
  </div>`,
};
