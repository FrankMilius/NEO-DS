// Card Team Docs — Inline-Script extrahiert

(function () {
  const preview   = document.getElementById('stage-preview');
  const codeEl    = document.getElementById('stage-code');
  const themeEl   = document.getElementById('stage-theme');
  const variantEl = document.getElementById('stage-variant');
  const socialEl  = document.getElementById('stage-social');

  const personIcon = `<svg width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M20 21a8 8 0 1 0-16 0"/></svg>`;
  const linkedinIcon = `<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" aria-hidden="true"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>`;

  const people = [
    { name: 'Maria Schmitt', role: 'Head of Design' },
    { name: 'Thomas Bauer',  role: 'Frontend Engineer' },
  ];

  function buildCard(person, compact, withSocial) {
    const nameSize = compact ? 'var(--fnd-typography-body-l-font-size)' : 'var(--fnd-typography-heading-xs-font-size)';
    const roleSize = compact ? 'var(--fnd-typography-body-s-font-size)' : 'var(--fnd-typography-body-m-font-size)';
    const imgMb    = compact ? 'var(--fnd-spacing-03)' : 'var(--fnd-spacing-04)';
    const socialHtml = withSocial && !compact ? `<div class="social-links" style="display:flex;justify-content:center;gap:var(--fnd-spacing-02);margin-top:var(--fnd-spacing-03);">
          <a href="#" onclick="event.preventDefault();" aria-label="${person.name} auf LinkedIn" style="display:flex;align-items:center;justify-content:center;width:32px;height:32px;border-radius:var(--fnd-radius-sm);background:var(--fnd-color-background-secondary);color:var(--fnd-color-text-mid);text-decoration:none;">${linkedinIcon}</a>
        </div>` : '';
    return `<li style="text-align:center;">
      <div class="card-content">
        <div style="aspect-ratio:1/1;border-radius:var(--fnd-radius-lg);overflow:hidden;margin-bottom:${imgMb};background:var(--fnd-color-background-secondary);display:flex;align-items:center;justify-content:center;color:var(--fnd-color-text-mid);" aria-hidden="true">${personIcon}</div>
        <p style="font-size:${nameSize};font-weight:var(--fnd-font-weight-semibold);color:var(--fnd-color-text-high);margin:0 0 var(--fnd-spacing-01);">${person.name}</p>
        <p style="font-size:${roleSize};color:var(--fnd-color-text-mid);margin:0 0 var(--fnd-spacing-03);">${person.role}</p>
        ${socialHtml}
      </div>
    </li>`;
  }

  function update() {
    const theme    = themeEl.value;
    const compact  = variantEl.value === 'compact';
    const withSocial = socialEl.checked;
    const cols     = compact ? 'repeat(3,1fr)' : 'repeat(2,1fr)';
    const html = `<div class="cards team${compact ? ' compact' : ''}" style="max-width:100%;">
  <ul style="display:grid;grid-template-columns:${cols};gap:var(--fnd-spacing-04);margin:0;padding:0;list-style:none;">
    ${people.map(p => buildCard(p, compact, withSocial)).join('\n    ')}
  </ul>
</div>`;
    preview.innerHTML = `<div class="${theme}">${html}</div>`;
    codeEl.textContent = `<div class="cards team${compact ? ' compact' : ''}">
  <ul>
    <li>
      <div class="card-content">
        <picture>
          <img src="/assets/avatar-5.jpg" alt="Portrait von Maria Schmitt" />
        </picture>
        <p class="name">Maria Schmitt</p>
        <p class="role">Head of Design</p>${withSocial && !compact ? `
        <div class="social-links">
          <a href="https://linkedin.com/in/mariaschmitt"
             aria-label="Maria Schmitt auf LinkedIn"
             rel="noopener noreferrer" target="_blank">
            <svg class="icon" aria-hidden="true">...</svg>
          </a>
        </div>` : ''}
      </div>
    </li>
  </ul>
</div>`;
  }

  themeEl.addEventListener('change', update);
  variantEl.addEventListener('change', update);
  socialEl.addEventListener('change', update);
  update();
})();
