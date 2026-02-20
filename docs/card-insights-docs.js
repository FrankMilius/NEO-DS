// Card Insights Docs — Inline-Script extrahiert

(function () {
  const preview   = document.getElementById('stage-preview');
  const codeEl    = document.getElementById('stage-code');
  const themeEl   = document.getElementById('stage-theme');
  const variantEl = document.getElementById('stage-variant');

  function update() {
    const theme   = themeEl.value;
    const variant = variantEl.value;
    const withBg  = variant === 'with-background';
    const bgStyle = withBg
      ? 'background:var(--fnd-color-background-secondary);border-radius:var(--fnd-radius-lg);overflow:hidden;transition:background-color var(--fnd-motion-duration-200) ease;'
      : '';
    const labelBgStyle = withBg
      ? 'background:var(--fnd-color-background-secondary);padding-inline:var(--fnd-spacing-06);'
      : '';
    const innerPad = withBg ? 'padding-inline:var(--fnd-spacing-05);' : '';

    const html = `<div class="cards insights${withBg ? ' with-background' : ''}" style="max-width:360px;">
  <ul style="margin:0;padding:0;list-style:none;">
    <li>
      <div class="labels-container" style="display:flex;gap:var(--fnd-spacing-02);padding:16px 0;${labelBgStyle}">
        <span class="label" style="display:inline-flex;padding:2px var(--fnd-spacing-02);border-radius:var(--fnd-radius-sm);border:1px solid var(--fnd-color-border-secondary);font-size:var(--fnd-typography-body-xs-font-size);background:inherit;">Design Systems</span>
      </div>
      <div class="card-content" style="display:flex;flex-direction:column;${bgStyle}">
        <div style="aspect-ratio:3/2;background:var(--fnd-color-background-tertiary);display:flex;align-items:center;justify-content:center;color:var(--fnd-color-text-mid);" aria-hidden="true">
          <svg width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>
        </div>
        <p style="font-size:var(--fnd-typography-heading-xs-font-size);font-weight:var(--fnd-font-weight-semibold);margin:var(--fnd-spacing-04) 0 var(--fnd-spacing-03);${innerPad}">Token-Migration: Von Hardcoded zu semantischen Tokens</p>
        <p style="font-size:var(--fnd-typography-body-l-font-size);color:var(--fnd-color-text-mid);margin:0 0 var(--fnd-spacing-04);${innerPad}">Eine schrittweise Anleitung zur Migration.</p>
        <div style="${innerPad}padding-bottom:var(--fnd-spacing-06);">
          <a href="#" onclick="event.preventDefault();" style="font-size:var(--fnd-typography-body-l-font-size);color:var(--fnd-color-text-high);display:inline-flex;align-items:center;gap:var(--fnd-spacing-02);text-decoration:none;">
            Artikel lesen
            <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </a>
        </div>
      </div>
    </li>
  </ul>
</div>`;
    preview.innerHTML = `<div class="${theme}">${html}</div>`;
    codeEl.textContent = `<div class="cards insights${withBg ? ' with-background' : ''}">
  <ul>
    <li>
      <div class="labels-container">
        <span class="label">Design Systems</span>
      </div>
      <div class="card-content">
        <picture>
          <img src="/assets/ai-picture.jpg" alt="Bildschirm mit Token-Dokumentation" />
        </picture>
        <p class="heading">Token-Migration in 5 Schritten</p>
        <p>Von Hardcoded-Werten zu semantischen Tokens.</p>
        <div class="button-container">
          <a href="/insights/token-migration">
            Artikel lesen
            <svg class="icon" aria-hidden="true">...</svg>
          </a>
        </div>
      </div>
    </li>
  </ul>
</div>`;
  }

  themeEl.addEventListener('change', update);
  variantEl.addEventListener('change', update);
  update();
})();
