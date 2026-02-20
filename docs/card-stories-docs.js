// Card Stories Docs — Inline-Script extrahiert

(function () {
  const preview   = document.getElementById('stage-preview');
  const codeEl    = document.getElementById('stage-code');
  const themeEl   = document.getElementById('stage-theme');
  const variantEl = document.getElementById('stage-variant');
  const logoEl    = document.getElementById('stage-logo');

  const arrowSvg = `<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>`;
  const imgPlaceholder = `<div style="aspect-ratio:16/9;background:var(--fnd-color-background-tertiary);display:flex;align-items:center;justify-content:center;color:var(--fnd-color-text-mid);" aria-hidden="true"><svg width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg></div>`;

  function buildCard(featured, withLogo) {
    const logoHtml = withLogo ? `<div class="client-logo" style="margin-top:var(--fnd-spacing-04);padding-top:var(--fnd-spacing-04);border-top:1px solid var(--fnd-color-border-low);"><span style="font-size:var(--fnd-typography-body-xs-font-size);color:var(--fnd-color-text-mid);opacity:0.7;">[Client Logo]</span></div>` : '';
    const headingSize = featured ? 'var(--fnd-typography-heading-m-font-size)' : 'var(--fnd-typography-heading-s-font-size)';
    return `<div class="cards stories${featured ? ' featured' : ''}" style="max-width:100%;">
  <ul style="display:grid;gap:var(--fnd-spacing-06);margin:0;padding:0;list-style:none;">
    <li style="background:var(--fnd-color-background-secondary);border-radius:var(--fnd-radius-lg);overflow:hidden;display:flex;flex-direction:column;">
      ${imgPlaceholder}
      <div style="padding:var(--fnd-spacing-06);display:flex;flex-direction:column;flex-grow:1;">
        <p style="font-size:var(--fnd-typography-body-s-font-size);text-transform:uppercase;letter-spacing:0.5px;color:var(--fnd-color-text-mid);margin:0 0 var(--fnd-spacing-02);">Automotive</p>
        <p style="font-size:${headingSize};font-weight:var(--fnd-font-weight-semibold);color:var(--fnd-color-text-high);margin:0 0 var(--fnd-spacing-04);">Wie MegaCorp ihre digitale Plattform modernisierte</p>
        <p style="font-size:var(--fnd-typography-body-l-font-size);color:var(--fnd-color-text-mid);margin:0;flex-grow:1;">Ein Rückblick auf 6 Monate Transformation.</p>
        <div style="margin-top:var(--fnd-spacing-06);">
          <a href="#" onclick="event.preventDefault();" style="font-size:var(--fnd-typography-body-l-font-size);color:var(--fnd-color-text-high);display:inline-flex;align-items:center;gap:var(--fnd-spacing-02);text-decoration:none;">
            Case Study lesen ${arrowSvg}
          </a>
        </div>
        ${logoHtml}
      </div>
    </li>
  </ul>
</div>`;
  }

  function update() {
    const theme    = themeEl.value;
    const featured = variantEl.value === 'featured';
    const withLogo = logoEl.checked;
    const html     = buildCard(featured, withLogo);
    preview.innerHTML = `<div class="${theme}">${html}</div>`;
    codeEl.textContent = `<div class="cards stories${featured ? ' featured' : ''}">
  <ul>
    <li>
      <div class="card-content">
        <picture>
          <img src="/assets/pexels-dkomov-34804018.jpg" alt="Beschreibendes Story-Bild" />
        </picture>
        <div class="content-body">
          <p class="overheadline">Automotive</p>
          <p class="heading">Wie MegaCorp ihre Plattform modernisierte</p>
          <p>Ein Rückblick auf 6 Monate Transformation.</p>
          <div class="button-container">
            <a href="/stories/megacorp">
              Case Study lesen
              <svg class="icon" aria-hidden="true">...</svg>
            </a>
          </div>${withLogo ? `
          <div class="client-logo">
            <img src="/assets/screen-2.svg" alt="MegaCorp Logo" />
          </div>` : ''}
        </div>
      </div>
    </li>
  </ul>
</div>`;
  }

  themeEl.addEventListener('change', update);
  variantEl.addEventListener('change', update);
  logoEl.addEventListener('change', update);
  update();
})();
