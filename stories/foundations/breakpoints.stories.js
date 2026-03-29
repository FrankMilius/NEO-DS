// ============================================================
// Breakpoints — Foundation Token Showcase
// Responsive Breakpoints + Container Widths
// ============================================================

const BREAKPOINTS = [
  { name: 'xs', value: '0', desc: 'Mobile (default)' },
  { name: 'sm', value: '768px', desc: 'Tablet Portrait' },
  { name: 'md', value: '960px', desc: 'Tablet Landscape' },
  { name: 'lg', value: '1200px', desc: 'Desktop' },
  { name: 'xl', value: '1600px', desc: 'Large Desktop' },
  { name: 'xxl', value: '1920px', desc: 'Ultra-Wide' },
];

export default {
  title: 'Foundations/Breakpoints',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**Breakpoints Foundation** — 6-stufige responsive Breakpoint Scale.
Verwendung via Mixin: \`@include respond-to('md') { ... }\`.
Mobile-First: XS ist der Ausgangspunkt, hoehere Breakpoints erweitern.`,
      },
    },
  },
};

export const BreakpointScale = {
  name: 'Breakpoint Scale',
  render: () => {
    const maxW = 1920;
    return `<div style="padding:24px">
      <div style="max-width:800px">
        ${BREAKPOINTS.map(bp => {
          const w = bp.value === '0' ? 0 : parseInt(bp.value);
          const pct = (w / maxW) * 100;
          return `
            <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px">
              <code style="font-size:var(--fs-xs);color:var(--fnd-color-interactive-default);min-width:40px;text-align:right">${bp.name}</code>
              <div style="flex:1;position:relative;height:28px">
                <div style="position:absolute;left:${pct}%;right:0;height:100%;background:var(--fnd-color-interactive-default);border-radius:var(--fnd-radius-xs);opacity:0.15"></div>
                <div style="position:absolute;left:${pct}%;top:50%;transform:translateY(-50%);width:2px;height:20px;background:var(--fnd-color-interactive-default)"></div>
              </div>
              <span style="font-size:var(--fs-xs);color:var(--fnd-color-text-tertiary);min-width:60px">${bp.value || '0'}</span>
              <span style="font-size:var(--fs-xs);color:var(--fnd-color-text-secondary);min-width:130px">${bp.desc}</span>
            </div>`;
        }).join('')}
      </div>
      <div style="margin-top:24px;padding:16px;background:var(--fnd-color-layer-01);border-radius:var(--fnd-radius-md);border:1px solid var(--fnd-color-border-secondary)">
        <h4 style="margin-top:0;font-size:var(--fs-sm)">Verwendung</h4>
        <pre style="font-size:var(--fs-xs);color:var(--fnd-color-text-secondary);margin:0"><code>@include respond-to('md') {
  .my-component { flex-direction: row; }
}</code></pre>
      </div>
    </div>`;
  },
};

export const CurrentViewport = {
  name: 'Current Viewport',
  render: () => `<div style="padding:24px">
    <div style="padding:20px;background:var(--fnd-color-layer-01);border-radius:var(--fnd-radius-md);border:1px solid var(--fnd-color-border-secondary)">
      <p style="font-size:var(--fs-sm);color:var(--fnd-color-text-secondary)">Aktuelle Viewport-Breite:</p>
      <p id="vp-width" style="font-size:var(--fs-3xl);font-weight:var(--fnd-font-weight-bold);color:var(--fnd-color-interactive-default);margin:8px 0"></p>
      <p id="vp-bp" style="font-size:var(--fs-lg);color:var(--fnd-color-text-primary)"></p>
    </div>
    <script>
      (function() {
        function update() {
          var w = window.innerWidth;
          document.getElementById('vp-width').textContent = w + 'px';
          var bp = w >= 1920 ? 'XXL' : w >= 1600 ? 'XL' : w >= 1200 ? 'LG' : w >= 960 ? 'MD' : w >= 768 ? 'SM' : 'XS';
          document.getElementById('vp-bp').textContent = 'Breakpoint: ' + bp;
        }
        update();
        window.addEventListener('resize', update);
      })();
    </script>
  </div>`,
  parameters: { docs: { description: { story: 'Live-Anzeige: Viewport-Groesse und aktiver Breakpoint. Fenstergroesse aendern zum Testen.' } } },
};
