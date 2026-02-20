// Color Docs — Inline-Script extrahiert

(function() {
  // ---- Theme Switcher ----
  const switcher = document.getElementById('theme-switcher');
  const themes = ['neo-light-theme', 'neo-dark-theme', 'customer-light-theme', 'customer-dark-theme',
                  'light-base-theme', 'dark-base-theme', 'light-secondary-theme', 'dark-secondary-theme'];

  if (switcher) {
    switcher.addEventListener('click', function(e) {
      const btn = e.target.closest('.docs__theme-btn');
      if (!btn) return;
      const theme = btn.dataset.theme;
      themes.forEach(t => document.body.classList.remove(t));
      document.body.classList.add(theme);
      switcher.querySelectorAll('.docs__theme-btn').forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      // Re-render semantic tokens to show updated values
      setTimeout(renderSemanticTokens, 50);
    });
  }

  // ---- Shade Scale Rendering ----
  const steps10 = [100,200,300,400,500,600,700,800,900,950];

  const palettes = {
    // Main Palettes
    primary:    ['--fnd-primitive-primary-', steps10],
    secondary:  ['--fnd-primitive-secondary-', steps10],
    accent:     ['--fnd-primitive-accent-', steps10],
    // Neutral
    neutral:    ['--fnd-primitive-neutral-', steps10],
    // System Palettes
    info:       ['--fnd-primitive-info-', steps10],
    success:    ['--fnd-primitive-success-', steps10],
    warning:    ['--fnd-primitive-warning-', steps10],
    danger:     ['--fnd-primitive-danger-', steps10],
    // Supporting Palettes
    beige:      ['--fnd-primitive-beige-', steps10],
    chartreuse: ['--fnd-primitive-chartreuse-', steps10],
    pink:       ['--fnd-primitive-pink-', steps10],
    aqua:       ['--fnd-primitive-aqua-', steps10],
    cyan:       ['--fnd-primitive-cyan-', steps10],
    burgundy:   ['--fnd-primitive-burgundy-', steps10],
    coral:       ['--fnd-primitive-coral-', steps10],
    mustard:     ['--fnd-primitive-mustard-', steps10]
  };

  function renderScales() {
    const root = getComputedStyle(document.documentElement);
    Object.entries(palettes).forEach(([name, [prefix, steps]]) => {
      const container = document.getElementById('scale-' + name);
      if (!container) return;
      container.innerHTML = '';
      steps.forEach(step => {
        const varName = prefix + step;
        const color = root.getPropertyValue(varName).trim();
        const el = document.createElement('div');
        el.className = 'docs__shade-step';
        el.style.backgroundColor = 'var(' + varName + ')';
        // Text color: light on dark, dark on light
        const isLight = step < 500 || (name === 'neutral' && step < 600);
        el.style.color = isLight ? '#000' : '#fff';
        el.innerHTML = '<span>' + step + '</span>';
        container.appendChild(el);
      });
    });
  }

  // ---- Foundation Transparency Rendering ----
  function renderFoundation() {
    const steps = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

    ['black', 'white'].forEach(color => {
      const container = document.getElementById('foundation-' + color);
      if (!container) return;
      // Keep the checkerboard background, add steps
      container.innerHTML = '';
      steps.forEach(pct => {
        const el = document.createElement('div');
        el.className = 'docs__foundation-step';
        el.style.backgroundColor = 'var(--fnd-primitive-' + color + '-' + pct + ')';
        el.style.color = color === 'black' ? (pct > 50 ? '#fff' : '#000') : (pct > 50 ? '#000' : '#fff');
        el.textContent = pct + '%';
        container.appendChild(el);
      });
    });
  }

  // ---- Semantic Token Rendering ----
  const semanticTokens = {
    text: [
      { token: 'text-primary',        alias: 'text-high' },
      { token: 'text-secondary',       alias: 'text-mid' },
      { token: 'text-tertiary',        alias: 'text-low' },
      { token: 'text-inverse',         alias: null },
      { token: 'text-disabled',        alias: 'text-state-disabled' },
      { token: 'text-on-interactive',  alias: null },
      { token: 'text-difference',      alias: null },
      { token: 'text-link',            alias: null },
      { token: 'text-link-hover',      alias: null },
      { token: 'text-transparency-mid', alias: null },
      { token: 'text-transparency-low', alias: null },
      { token: 'text-success',         alias: 'semantic-text-success' },
      { token: 'text-danger',          alias: 'semantic-text-danger' }
    ],
    background: [
      { token: 'background-base',             alias: null },
      { token: 'background-secondary',        alias: null },
      { token: 'background-tertiary',         alias: null },
      { token: 'background-quaternary',       alias: null },
      { token: 'background-quinary',          alias: null },
      { token: 'background-inverse',          alias: null },
      { token: 'background-disabled',         alias: 'background-state-disabled' },
      { token: 'background-hover',            alias: null },
      { token: 'background-active',           alias: null },
      { token: 'background-overlay',          alias: null },
      { token: 'background-accent',           alias: 'background-accent-green' },
      { token: 'background-accent-secondary', alias: null },
      { token: 'background-transparency-mid', alias: null },
      { token: 'background-transparency-low', alias: null },
      { token: 'background-success',          alias: 'semantic-background-success' },
      { token: 'background-danger',           alias: 'semantic-background-danger' }
    ],
    border: [
      { token: 'border-primary',   alias: 'border-mid' },
      { token: 'border-secondary', alias: 'border-low' },
      { token: 'border-strong',    alias: 'border-high' },
      { token: 'border-mid-dark',  alias: null },
      { token: 'border-inverse',   alias: null },
      { token: 'border-disabled',  alias: 'border-state-disabled' },
      { token: 'border-success',   alias: 'semantic-border-success' },
      { token: 'border-danger',    alias: 'semantic-border-danger' }
    ],
    interactive: [
      { token: 'interactive-default', alias: null },
      { token: 'interactive-hover',   alias: null },
      { token: 'interactive-active',  alias: null },
      { token: 'interactive-visited', alias: null },
      { token: 'interactive-focus',   alias: null }
    ],
    feedback: [
      { token: 'feedback-info',    alias: null },
      { token: 'feedback-success', alias: null },
      { token: 'feedback-warning', alias: null },
      { token: 'feedback-danger',  alias: null }
    ]
  };

  function renderSemanticTokens() {
    const bodyStyle = getComputedStyle(document.body);

    Object.entries(semanticTokens).forEach(([group, tokens]) => {
      const container = document.getElementById('semantic-' + group);
      if (!container) return;
      // Preserve the h3 title
      const title = container.querySelector('.docs__semantic-group-title');
      container.innerHTML = '';
      if (title) container.appendChild(title);

      tokens.forEach(({ token, alias }) => {
        const varName = '--fnd-color-' + token;
        const computedValue = bodyStyle.getPropertyValue(varName).trim();

        const row = document.createElement('div');
        row.className = 'docs__semantic-row';

        // Color preview
        const preview = document.createElement('div');
        preview.className = 'docs__semantic-preview';
        preview.style.backgroundColor = 'var(' + varName + ')';
        row.appendChild(preview);

        // Token name
        const nameEl = document.createElement('div');
        nameEl.className = 'docs__semantic-token-name';
        nameEl.textContent = varName;
        row.appendChild(nameEl);

        // Computed value
        const valueEl = document.createElement('div');
        valueEl.className = 'docs__semantic-value';
        valueEl.textContent = computedValue || '—';
        row.appendChild(valueEl);

        // Alias (deprecated)
        const aliasEl = document.createElement('div');
        aliasEl.className = 'docs__semantic-alias';
        aliasEl.textContent = alias ? '← ' + alias : '';
        row.appendChild(aliasEl);

        container.appendChild(row);
      });
    });
  }

  // ---- Viewport Info ----
  const bps = [
    { name: 'xxl', min: 1920 },
    { name: 'xl',  min: 1600 },
    { name: 'lg',  min: 1200 },
    { name: 'md',  min: 960 },
    { name: 'sm',  min: 768 },
    { name: 'xs',  min: 0 }
  ];

  function updateViewport() {
    const w = window.innerWidth;
    const active = bps.find(bp => w >= bp.min) || bps[bps.length - 1];
    const el = document.getElementById('viewport-info');
    if (el) el.textContent = w + 'px \u2014 ' + active.name;
  }

  // ---- Init ----
  renderScales();
  renderFoundation();
  renderSemanticTokens();
  updateViewport();
  window.addEventListener('resize', updateViewport);
})();
