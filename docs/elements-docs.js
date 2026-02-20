// Elements Docs — Inline-Script extrahiert

(() => {
  'use strict';

  // -- Breakpoints (matching _breakpoints.scss) -----------------------
  const BREAKPOINTS = [
    { id: 'xs',  min: 0 },
    { id: 'sm',  min: 576 },
    { id: 'md',  min: 768 },
    { id: 'lg',  min: 1024 },
    { id: 'xl',  min: 1280 },
    { id: 'xxl', min: 1440 }
  ];

  // -- Elements -------------------------------------------------------
  const vpWidth   = document.getElementById('vp-width');
  const vpInfo    = document.getElementById('viewport-info');
  const bpChips   = document.querySelectorAll('.responsive-bar__bp');
  const liveSlots = document.querySelectorAll('[data-live-size]');

  // -- Token reference table -----------------------------------------
  const TOKEN_MAP = [
    { el: 'h1', tag: '&lt;h1&gt;',  mixin: "heading('2xl')", token: '--fnd-typography-heading-2xl-font-size', fluid: '--fs-5xl (41.8→53.7px)' },
    { el: 'h2', tag: '&lt;h2&gt;',  mixin: "heading('xl')",  token: '--fnd-typography-heading-xl-font-size',  fluid: '--fs-4xl (34.8→44.8px)' },
    { el: 'h3', tag: '&lt;h3&gt;',  mixin: "heading('l')",   token: '--fnd-typography-heading-l-font-size',   fluid: '--fs-3xl (29.0→37.3px)' },
    { el: 'h4', tag: '&lt;h4&gt;',  mixin: "heading('m')",   token: '--fnd-typography-heading-m-font-size',   fluid: '--fs-2xl (24.2→31.1px)' },
    { el: 'h5', tag: '&lt;h5&gt;',  mixin: "heading('s')",   token: '--fnd-typography-heading-s-font-size',   fluid: '--fs-xl (20.2→25.9px)' },
    { el: 'h6', tag: '&lt;h6&gt;',  mixin: "heading('xs')",  token: '--fnd-typography-heading-xs-font-size',  fluid: '--fs-lg (16.8→21.6px)' },
    { el: 'p',  tag: '&lt;p&gt;',   mixin: "paragraph('l')", token: '--fnd-typography-paragraph-l-font-size', fluid: '--fs-base (14.0→18.0px)' },
    { el: 'small', tag: '&lt;small&gt;', mixin: "paragraph('s')", token: '--fnd-typography-paragraph-s-font-size', fluid: '--fs-xs (9.7→12.5px)' },
    { el: 'blockquote', tag: '&lt;blockquote&gt;', mixin: "paragraph('l')", token: '--fnd-typography-paragraph-l-font-size', fluid: '--fs-base (14.0→18.0px)' },
    { el: 'cite', tag: '&lt;cite&gt;', mixin: "paragraph('s')", token: '--fnd-typography-paragraph-s-font-size', fluid: '--fs-xs (9.7→12.5px)' },
    { el: 'figcaption', tag: '&lt;figcaption&gt;', mixin: "paragraph('s')", token: '--fnd-typography-paragraph-s-font-size', fluid: '--fs-xs (9.7→12.5px)' }
  ];

  const tbody = document.querySelector('#token-ref-table tbody');
  TOKEN_MAP.forEach(item => {
    const tr = document.createElement('tr');
    tr.innerHTML =
      `<td>${item.tag}</td>` +
      `<td><code>${item.mixin}</code></td>` +
      `<td><code>${item.token}</code></td>` +
      `<td><code>${item.fluid}</code></td>` +
      `<td class="computed" data-token-el="${item.el}">—</td>`;
    tbody.appendChild(tr);
  });

  // -- Helper: get computed font-size --------------------------------
  const getComputedSize = (selector) => {
    const el = document.querySelector(`.specimen__preview ${selector}`);
    if (!el) return '—';
    return parseFloat(getComputedStyle(el).fontSize).toFixed(1) + 'px';
  };

  // -- Update all live values ----------------------------------------
  const update = () => {
    const w = window.innerWidth;

    // Viewport number
    vpWidth.textContent = w;
    vpInfo.textContent = w + ' px';

    // Active breakpoint chips
    let activeBp = 'xs';
    BREAKPOINTS.forEach(bp => {
      if (w >= bp.min) activeBp = bp.id;
    });
    bpChips.forEach(chip => {
      chip.classList.toggle('is-active', chip.dataset.bp === activeBp);
    });

    // Live font-size in specimen headers
    liveSlots.forEach(slot => {
      const tag = slot.dataset.liveSize;
      const size = getComputedSize(tag);
      slot.textContent = size;
    });

    // Computed column in token table
    document.querySelectorAll('[data-token-el]').forEach(cell => {
      const tag = cell.dataset.tokenEl;
      cell.textContent = getComputedSize(tag);
    });
  };

  // -- Init -----------------------------------------------------------
  update();
  let ticking = false;
  window.addEventListener('resize', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        update();
        ticking = false;
      });
      ticking = true;
    }
  });
})();
