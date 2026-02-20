// Card Testimonials Docs — Inline-Script extrahiert

(function () {
  const preview   = document.getElementById('stage-preview');
  const codeEl    = document.getElementById('stage-code');
  const themeEl   = document.getElementById('stage-theme');
  const variantEl = document.getElementById('stage-variant');
  const logoEl    = document.getElementById('stage-logo');

  const personIconSm = `<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M20 21a8 8 0 1 0-16 0"/></svg>`;
  const playIconLg   = `<svg width="64" height="64" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8" fill="currentColor" stroke="none"/></svg>`;

  function buildStandard(withLogo) {
    const logoHtml = withLogo ? `<div class="company-logo" style="margin-top:var(--fnd-spacing-04);"><span style="font-size:var(--fnd-typography-body-xs-font-size);color:var(--fnd-color-text-mid);opacity:0.6;">[Firmen-Logo]</span></div>` : '';
    return `<div class="cards testimonials" style="max-width:400px;">
  <ul style="margin:0;padding:0;list-style:none;">
    <li style="background:var(--fnd-color-background-secondary);border-radius:var(--fnd-radius-lg);padding:var(--fnd-spacing-06);display:flex;flex-direction:column;">
      <div class="card-content" style="display:flex;flex-direction:column;flex:1;">
        <span style="font-size:3rem;color:var(--fnd-color-text-low);line-height:1;margin-bottom:var(--fnd-spacing-04);display:block;">&ldquo;</span>
        <blockquote style="font-size:var(--fnd-typography-heading-xs-font-size);color:var(--fnd-color-text-high);margin:0 0 var(--fnd-spacing-06);flex-grow:1;line-height:1.5;">
          <p style="margin:0;">"Das Design System hat unsere Entwicklungsgeschwindigkeit um 40% gesteigert."</p>
        </blockquote>
        <div class="author" style="display:flex;align-items:center;gap:var(--fnd-spacing-04);margin-top:auto;">
          <div style="width:48px;height:48px;border-radius:50%;overflow:hidden;flex-shrink:0;background:var(--fnd-color-background-tertiary);display:flex;align-items:center;justify-content:center;color:var(--fnd-color-text-mid);" aria-hidden="true">${personIconSm}</div>
          <div class="author-info">
            <p class="name" style="font-size:var(--fnd-typography-body-l-font-size);font-weight:var(--fnd-font-weight-medium);color:var(--fnd-color-text-high);margin:0;">Maria Schmitt</p>
            <p class="role" style="font-size:var(--fnd-typography-body-m-font-size);color:var(--fnd-color-text-mid);margin:0;">CTO, TechCorp AG</p>
          </div>
        </div>
        ${logoHtml}
      </div>
    </li>
  </ul>
</div>`;
  }

  function buildVideo() {
    return `<div class="cards testimonials with-video" style="max-width:400px;">
  <ul style="margin:0;padding:0;list-style:none;">
    <li style="background:var(--fnd-color-background-secondary);border-radius:var(--fnd-radius-lg);overflow:hidden;">
      <div class="card-content" style="display:flex;flex-direction:column;">
        <div class="video-wrap" style="aspect-ratio:16/9;background:var(--fnd-color-background-tertiary);display:flex;align-items:center;justify-content:center;color:var(--fnd-color-text-mid);" role="img" aria-label="Video-Testimonial von Jonas Weber">${playIconLg}</div>
        <div class="quote-section" style="padding:var(--fnd-spacing-06);">
          <blockquote style="font-size:var(--fnd-typography-heading-xs-font-size);color:var(--fnd-color-text-high);margin:0 0 var(--fnd-spacing-06);line-height:1.5;">
            <p style="margin:0;">"Wie wir das Design System in 3 Wochen eingeführt haben."</p>
          </blockquote>
          <div style="display:flex;align-items:center;gap:var(--fnd-spacing-04);">
            <div style="width:48px;height:48px;border-radius:50%;background:var(--fnd-color-background-tertiary);display:flex;align-items:center;justify-content:center;color:var(--fnd-color-text-mid);" aria-hidden="true">${personIconSm}</div>
            <div>
              <p style="font-size:var(--fnd-typography-body-l-font-size);font-weight:var(--fnd-font-weight-medium);color:var(--fnd-color-text-high);margin:0;">Jonas Weber</p>
              <p style="font-size:var(--fnd-typography-body-m-font-size);color:var(--fnd-color-text-mid);margin:0;">Engineering Manager</p>
            </div>
          </div>
        </div>
      </div>
    </li>
  </ul>
</div>`;
  }

  function update() {
    const theme   = themeEl.value;
    const variant = variantEl.value;
    const withLogo = logoEl.checked;
    const isVideo = variant === 'video';
    const html = isVideo ? buildVideo() : buildStandard(withLogo);
    preview.innerHTML = `<div class="${theme}">${html}</div>`;

    if (isVideo) {
      codeEl.textContent = `<div class="cards testimonials with-video">
  <ul>
    <li>
      <div class="card-content">
        <picture>
          <img src="/assets/pexels-cottonbro-4629624.jpg"
               alt="Video-Testimonial von Jonas Weber: Design System Einführung in 3 Wochen" />
        </picture>
        <div class="quote-section">
          <blockquote class="quote">
            <p>"Wie wir das Design System in 3 Wochen eingeführt haben."</p>
          </blockquote>
          <div class="author">
            <picture>
              <img src="/assets/avatar-3.jpg" alt="Portrait von Jonas Weber" />
            </picture>
            <div class="author-info">
              <p class="name">Jonas Weber</p>
              <p class="role">Engineering Manager</p>
            </div>
          </div>
        </div>
      </div>
    </li>
  </ul>
</div>`;
    } else {
      codeEl.textContent = `<div class="cards testimonials">
  <ul>
    <li>
      <div class="card-content">
        <!-- Anführungszeichen via CSS ::before -->
        <blockquote class="quote">
          <p>"Das Design System hat unsere Geschwindigkeit um 40% gesteigert."</p>
        </blockquote>
        <div class="author">
          <picture>
            <img src="/assets/avatar-4.jpg" alt="Portrait von Maria Schmitt" />
          </picture>
          <div class="author-info">
            <p class="name">Maria Schmitt</p>
            <p class="role">CTO, TechCorp AG</p>
          </div>
        </div>${withLogo ? `
        <div class="company-logo">
          <img src="/assets/screen-3.svg" alt="TechCorp Logo" />
        </div>` : ''}
      </div>
    </li>
  </ul>
</div>`;
    }
  }

  themeEl.addEventListener('change', update);
  variantEl.addEventListener('change', update);
  logoEl.addEventListener('change', update);
  update();
})();
