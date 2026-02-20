// Card Links Docs — Inline-Script extrahiert

(function () {
  const preview = document.getElementById('stage-preview');
  const codeEl  = document.getElementById('stage-code');
  const themeEl = document.getElementById('stage-theme');

  const iconSvg = `<svg width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`;
  const arrowSvg = `<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>`;

  function buildCard(title, desc, linkText) {
    return `<li style="background:var(--fnd-color-background-secondary);border-radius:var(--fnd-radius-lg);padding:var(--fnd-spacing-05);">
      <div class="card-content" style="display:flex;flex-direction:column;height:100%;">
        <div style="width:48px;height:48px;margin-bottom:var(--fnd-spacing-04);color:var(--fnd-color-text-high);">${iconSvg}</div>
        <p style="font-size:var(--fnd-typography-heading-xs-font-size);font-weight:var(--fnd-font-weight-semibold);margin:0 0 var(--fnd-spacing-02);">${title}</p>
        <p style="font-size:var(--fnd-typography-body-m-font-size);color:var(--fnd-color-text-mid);margin:0;flex-grow:1;">${desc}</p>
        <div class="button-container" style="margin-top:var(--fnd-spacing-04);">
          <a href="#" onclick="event.preventDefault();" style="font-size:var(--fnd-typography-body-l-font-size);color:var(--fnd-color-text-high);display:inline-flex;align-items:center;gap:var(--fnd-spacing-02);text-decoration:none;">
            ${linkText} ${arrowSvg}
          </a>
        </div>
      </div>
    </li>`;
  }

  function update() {
    const theme = themeEl.value;
    const html = `<div class="cards links" style="max-width:100%;">
  <ul style="display:grid;grid-template-columns:repeat(2,1fr);gap:var(--fnd-spacing-04);margin:0;padding:0;list-style:none;">
    ${buildCard('Dokumentation', 'Technische Anleitungen und API-Referenzen.', 'Zur Dokumentation')}
    ${buildCard('Support', 'Direkter Kontakt zum Support-Team.', 'Support kontaktieren')}
  </ul>
</div>`;
    preview.innerHTML = `<div class="${theme}">${html}</div>`;
    codeEl.textContent = `<div class="cards links">
  <ul>
    <li>
      <div class="card-content">
        <svg class="icon" aria-hidden="true" width="48" height="48">...</svg>
        <p class="heading">Dokumentation</p>
        <p>Technische Anleitungen und API-Referenzen.</p>
        <div class="button-container">
          <a href="/docs">
            Zur Dokumentation
            <svg class="icon" aria-hidden="true" width="20" height="20">...</svg>
          </a>
        </div>
      </div>
    </li>
  </ul>
</div>`;
  }

  themeEl.addEventListener('change', update);
  update();
})();
