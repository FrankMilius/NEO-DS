// Card Events Docs — Inline-Script extrahiert

(function () {
  const preview  = document.getElementById('stage-preview');
  const codeEl   = document.getElementById('stage-code');
  const themeEl  = document.getElementById('stage-theme');
  const mediaEl  = document.getElementById('stage-media');
  const labelsEl = document.getElementById('stage-labels');

  function buildCard(withMedia, withLabels) {
    const labels = withLabels
      ? `<div class="labels-container" style="display:flex;gap:var(--fnd-spacing-02);margin-bottom:var(--fnd-spacing-03);">
      <span class="label" style="display:inline-flex;padding:2px var(--fnd-spacing-02);border-radius:var(--fnd-radius-sm);border:1px solid var(--fnd-color-border-secondary);font-size:var(--fnd-typography-body-xs-font-size);">Konferenz</span>
      <span class="label" style="display:inline-flex;padding:2px var(--fnd-spacing-02);border-radius:var(--fnd-radius-sm);border:1px solid var(--fnd-color-border-secondary);font-size:var(--fnd-typography-body-xs-font-size);">Hybrid</span>
    </div>` : '';
    const media = withMedia
      ? `<div style="aspect-ratio:16/9;background:var(--fnd-color-background-tertiary);display:flex;align-items:center;justify-content:center;color:var(--fnd-color-text-mid);margin:0 calc(var(--fnd-spacing-06)*-1) var(--fnd-spacing-06);" aria-hidden="true"><svg width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg></div>` : '';
    return `<div class="cards events" style="max-width:360px;">
  <ul style="margin:0;padding:0;list-style:none;">
    <li style="padding:var(--fnd-spacing-04) var(--fnd-spacing-06);background:var(--fnd-color-background-secondary);border-radius:var(--fnd-radius-lg);display:flex;flex-direction:column;">
      ${labels}
      <div class="card-content" style="display:flex;flex-direction:column;flex:1;">
        ${media}
        <p style="font-size:var(--fnd-typography-heading-xs-font-size);font-weight:var(--fnd-font-weight-semibold);margin:0 0 var(--fnd-spacing-04);">Design Systems Conference 2026</p>
        <p style="font-size:var(--fnd-typography-body-l-font-size);color:var(--fnd-color-text-mid);margin:0 0 var(--fnd-spacing-05);display:flex;align-items:center;gap:var(--fnd-spacing-02);">
          <time datetime="2026-09-12">12. September 2026</time> &bull; Berlin
        </p>
        <div class="button-container" style="margin-top:auto;">
          <a href="#" onclick="event.preventDefault();" style="display:inline-flex;align-items:center;padding:var(--fnd-spacing-02) var(--fnd-spacing-04);background:var(--fnd-color-background-base);border-radius:var(--fnd-radius-md);text-decoration:none;color:var(--fnd-color-text-primary);">Jetzt anmelden</a>
        </div>
      </div>
    </li>
  </ul>
</div>`;
  }

  function update() {
    const theme     = themeEl.value;
    const withMedia = mediaEl.checked;
    const withLabels = labelsEl.checked;
    const html = buildCard(withMedia, withLabels);
    preview.innerHTML = `<div class="${theme}">${html}</div>`;
    codeEl.textContent = `<div class="cards events">
  <ul>
    <li>${withLabels ? `
      <div class="labels-container">
        <span class="label">Konferenz</span>
      </div>` : ''}
      <div class="card-content">${withMedia ? `
        <picture>
          <img src="/assets/kaleidico-3V8xo5Gbusk-unsplash.jpg" alt="Konferenzsaal" />
        </picture>` : ''}
        <p class="heading">Design Systems Conference 2026</p>
        <p>
          <span>
            <time datetime="2026-09-12">12. September 2026</time>
            &bull; Berlin
          </span>
        </p>
        <div class="button-container">
          <a href="/events/conf-2026">Jetzt anmelden</a>
        </div>
      </div>
    </li>
  </ul>
</div>`;
  }

  themeEl.addEventListener('change', update);
  mediaEl.addEventListener('change', update);
  labelsEl.addEventListener('change', update);
  update();
})();
