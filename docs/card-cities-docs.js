// Card Cities Docs — Inline-Script extrahiert

(function () {
  const preview = document.getElementById('stage-preview');
  const codeEl  = document.getElementById('stage-code');
  const themeEl = document.getElementById('stage-theme');

  function buildHTML() {
    return `<div class="cards cities">
  <ul style="display:grid;grid-template-columns:repeat(2,1fr);gap:var(--fnd-spacing-04);margin:0;padding:0;list-style:none;">
    <li style="background:var(--fnd-color-background-base);border-radius:var(--fnd-radius-lg);padding:var(--fnd-spacing-04);text-align:center;">
      <div class="card-content">
        <div style="width:96px;height:96px;border-radius:50%;background:var(--fnd-color-background-secondary);margin:0 auto;display:flex;align-items:center;justify-content:center;color:var(--fnd-color-text-mid);">
          <svg width="40" height="40" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>
        </div>
        <p class="overheadline" style="font-size:var(--fnd-typography-body-s-font-size);color:var(--fnd-color-text-mid);margin:var(--fnd-spacing-01) 0 0;">Deutschland</p>
        <p class="heading" style="font-size:var(--fnd-typography-body-m-font-size);font-weight:var(--fnd-font-weight-semibold);margin:var(--fnd-spacing-01) 0 var(--fnd-spacing-02);">Berlin</p>
      </div>
    </li>
    <li style="background:var(--fnd-color-background-base);border-radius:var(--fnd-radius-lg);padding:var(--fnd-spacing-04);text-align:center;">
      <div class="card-content">
        <div style="width:96px;height:96px;border-radius:50%;background:var(--fnd-color-background-secondary);margin:0 auto;display:flex;align-items:center;justify-content:center;color:var(--fnd-color-text-mid);">
          <svg width="40" height="40" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>
        </div>
        <p class="overheadline" style="font-size:var(--fnd-typography-body-s-font-size);color:var(--fnd-color-text-mid);margin:var(--fnd-spacing-01) 0 0;">Österreich</p>
        <p class="heading" style="font-size:var(--fnd-typography-body-m-font-size);font-weight:var(--fnd-font-weight-semibold);margin:var(--fnd-spacing-01) 0 var(--fnd-spacing-02);">Wien</p>
      </div>
    </li>
  </ul>
</div>`;
  }

  function update() {
    const theme = themeEl.value;
    const html  = buildHTML();
    preview.innerHTML = `<div class="${theme}" style="width:100%;">${html}</div>`;
    codeEl.textContent = `<div class="cards cities">
  <ul>
    <li>
      <div class="card-content">
        <picture>
          <img src="/assets/eugene-chystiakov-BGYijR3JX-I-unsplash.jpg" alt="Stadtansicht von Berlin" />
        </picture>
        <p class="overheadline">Deutschland</p>
        <p class="heading">Berlin</p>
      </div>
    </li>
  </ul>
</div>`;
  }

  themeEl.addEventListener('change', update);
  update();
})();
