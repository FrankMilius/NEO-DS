// ==========================================================================
// Carousel Docs — Tab Navigation + Staging Area Controller
// ==========================================================================
// Tabs: Benutzung | Style | API | Accessibility
// Staging Area: Theme, Slide-Anzahl, Autoplay
// ==========================================================================

(function () {
  'use strict';

  // -----------------------------------------------------------------------
  // 1. Tab Navigation
  // -----------------------------------------------------------------------

  var tabList = document.querySelector('.docs-tabs__list');
  var triggers = tabList ? tabList.querySelectorAll('.docs-tabs__trigger') : [];
  var panels = document.querySelectorAll('.docs-tabs__panel');

  function activateTab(trigger) {
    triggers.forEach(function (t) { t.setAttribute('aria-selected', 'false'); });
    panels.forEach(function (p) { p.classList.remove('is-active'); });
    trigger.setAttribute('aria-selected', 'true');
    var panelId = trigger.getAttribute('aria-controls');
    var panel = document.getElementById(panelId);
    if (panel) panel.classList.add('is-active');
  }

  triggers.forEach(function (trigger) {
    trigger.addEventListener('click', function () { activateTab(trigger); });
    trigger.addEventListener('keydown', function (e) {
      var index = Array.prototype.indexOf.call(triggers, trigger);
      var nextIndex = -1;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        nextIndex = (index + 1) % triggers.length;
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        nextIndex = (index - 1 + triggers.length) % triggers.length;
      } else if (e.key === 'Home') {
        nextIndex = 0;
      } else if (e.key === 'End') {
        nextIndex = triggers.length - 1;
      }
      if (nextIndex >= 0) {
        e.preventDefault();
        triggers[nextIndex].focus();
        activateTab(triggers[nextIndex]);
      }
    });
  });

  // -----------------------------------------------------------------------
  // 2. SVG Icons
  // -----------------------------------------------------------------------

  var ICON_PREV = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="15 18 9 12 15 6"/></svg>';
  var ICON_NEXT = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="9 18 15 12 9 6"/></svg>';

  // -----------------------------------------------------------------------
  // 3. Slide Content Templates
  // -----------------------------------------------------------------------

  var slideColors = [
    'var(--fnd-color-background-secondary)',
    'var(--fnd-color-background-tertiary)',
    'var(--fnd-color-layer-01)',
    'var(--fnd-color-layer-02)',
    'var(--fnd-color-layer-03)'
  ];

  var slideLabels = [
    'Slide 1 — Social Intranet',
    'Slide 2 — Mitarbeiter App',
    'Slide 3 — Magazin',
    'Slide 4 — Analytics',
    'Slide 5 — Integrationen'
  ];

  // -----------------------------------------------------------------------
  // 4. Carousel Builder
  // -----------------------------------------------------------------------

  function createEl(tag, className) {
    var el = document.createElement(tag);
    if (className) el.className = className;
    return el;
  }

  function buildCarousel(slideCount, autoplay) {
    var carousel = createEl('div', 'carousel');
    var currentIndex = 0;
    var autoplayTimer = null;

    // ---- Slides wrapper ----
    var slidesWrapper = createEl('div', 'carousel-slides-wrapper');
    var slideList = createEl('ul', '');
    slideList.style.cssText = 'margin:0; padding: 0 var(--fnd-spacing-04); list-style:none; display:flex; flex-wrap:nowrap; gap: 16px; transition: transform 300ms ease;';

    for (var i = 0; i < slideCount; i++) {
      var li = document.createElement('li');
      li.style.cssText = 'min-width: 320px; width: 320px; height: 200px; border-radius: var(--fnd-radius-lg); background: ' + slideColors[i % slideColors.length] + '; display: flex; align-items: center; justify-content: center; flex-shrink: 0; border: 1px solid var(--fnd-color-border-low);';
      var label = document.createElement('span');
      label.style.cssText = 'font-size: 0.9rem; color: var(--fnd-color-text-mid); padding: 1rem; text-align: center;';
      label.textContent = slideLabels[i] || 'Slide ' + (i + 1);
      li.appendChild(label);
      slideList.appendChild(li);
    }

    slidesWrapper.appendChild(slideList);
    carousel.appendChild(slidesWrapper);

    // ---- Bottom nav ----
    var bottomNav = createEl('div', 'carousel-bottom-nav-wrapper');
    bottomNav.style.cssText = 'padding-top: var(--fnd-spacing-06); display:flex; align-items:center; justify-content:space-between; padding-inline: var(--fnd-spacing-04);';

    // Progress lines
    var lineWrapper = createEl('div', 'carousel-line-wrapper');
    lineWrapper.setAttribute('aria-hidden', 'true');
    lineWrapper.style.cssText = 'display:flex; gap: var(--fnd-spacing-02); overflow:hidden; height:48px; max-width:172px; align-items:center;';

    var lines = [];
    for (var j = 0; j < slideCount; j++) {
      var line = createEl('span', 'carousel-line');
      line.style.cssText = 'display:inline-block; height:2px; min-width:12px; width:12px; background:var(--fnd-color-border-mid); transition: width 450ms ease, min-width 450ms ease; position:relative; overflow:hidden;';
      lines.push(line);
      lineWrapper.appendChild(line);
    }

    var extraFill = createEl('span', 'line-extra-fill');
    extraFill.style.cssText = 'min-width:200px; display:block;';
    lineWrapper.appendChild(extraFill);

    // Live region
    var liveRegion = createEl('div', 'u-sr-only');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');

    // Navigation buttons
    var navWrapper = createEl('div', 'carousel-navigations-wrapper');
    navWrapper.style.cssText = 'display:flex; gap: var(--fnd-spacing-04);';

    var prevBtn = createEl('button', '');
    prevBtn.type = 'button';
    prevBtn.setAttribute('aria-label', 'Vorheriger Slide');
    prevBtn.innerHTML = '<span class="icon" aria-hidden="true">' + ICON_PREV + '</span>';
    prevBtn.style.cssText = 'background:transparent; border:none; width:32px; height:32px; display:inline-flex; align-items:center; justify-content:center; padding:0; cursor:pointer; color:var(--fnd-color-border-high);';

    var nextBtn = createEl('button', '');
    nextBtn.type = 'button';
    nextBtn.setAttribute('aria-label', 'N\u00e4chster Slide');
    nextBtn.innerHTML = '<span class="icon" aria-hidden="true">' + ICON_NEXT + '</span>';
    nextBtn.style.cssText = prevBtn.style.cssText;

    navWrapper.append(prevBtn, nextBtn);
    bottomNav.append(lineWrapper, liveRegion, navWrapper);
    carousel.appendChild(bottomNav);

    // ---- State update ----
    function updateCarousel() {
      // Move slide list
      var offset = currentIndex * (320 + 16); // slide width + gap
      slideList.style.transform = 'translateX(-' + offset + 'px)';

      // Update lines
      lines.forEach(function (ln, idx) {
        ln.classList.remove('active', 'autoplay');
        ln.style.minWidth = '12px';
        ln.style.width = '12px';
        ln.style.background = 'var(--fnd-color-border-mid)';
        // Remove any pseudo-element animation by resetting
        var before = ln.querySelector('._before');
        if (before) before.remove();

        if (idx === currentIndex) {
          ln.style.minWidth = '112px';
          ln.style.width = '112px';
          if (autoplay) {
            ln.style.background = 'var(--fnd-color-border-mid)';
            // Inject animated fill
            var fill = document.createElement('span');
            fill.className = '_before';
            fill.style.cssText = 'position:absolute; top:0; left:0; height:100%; width:0; background:var(--fnd-color-border-high); animation:carousel-line-progress 4s var(--fnd-motion-ease-informative, ease) forwards;';
            ln.style.position = 'relative';
            ln.appendChild(fill);
          } else {
            ln.style.background = 'var(--fnd-color-border-high)';
          }
        }
      });

      // Update buttons
      prevBtn.disabled = currentIndex === 0;
      nextBtn.disabled = currentIndex === slideCount - 1;
      prevBtn.style.color = currentIndex === 0 ? 'var(--fnd-color-text-state-disabled)' : 'var(--fnd-color-border-high)';
      nextBtn.style.color = currentIndex === slideCount - 1 ? 'var(--fnd-color-text-state-disabled)' : 'var(--fnd-color-border-high)';

      // Announce to screen readers
      liveRegion.textContent = 'Slide ' + (currentIndex + 1) + ' von ' + slideCount;
    }

    function goNext() {
      if (currentIndex < slideCount - 1) {
        currentIndex++;
        updateCarousel();
        if (autoplay) scheduleAutoplay();
      } else if (autoplay) {
        currentIndex = 0;
        updateCarousel();
        scheduleAutoplay();
      }
    }

    function goPrev() {
      if (currentIndex > 0) {
        currentIndex--;
        updateCarousel();
      }
    }

    function scheduleAutoplay() {
      if (autoplayTimer) clearTimeout(autoplayTimer);
      autoplayTimer = setTimeout(goNext, 4200); // slightly more than animation
    }

    prevBtn.addEventListener('click', function () {
      if (autoplayTimer) clearTimeout(autoplayTimer);
      goPrev();
    });
    nextBtn.addEventListener('click', function () {
      if (autoplayTimer) clearTimeout(autoplayTimer);
      goNext();
    });

    if (autoplay) scheduleAutoplay();

    updateCarousel();
    return { el: carousel, destroy: function () { if (autoplayTimer) clearTimeout(autoplayTimer); } };
  }

  // -----------------------------------------------------------------------
  // 5. Staging Area
  // -----------------------------------------------------------------------

  var themeSelect   = document.getElementById('stage-theme');
  var slidesSelect  = document.getElementById('stage-slides');
  var autoplayChk   = document.getElementById('stage-autoplay');
  var preview       = document.getElementById('stage-preview');
  var codeOutput    = document.getElementById('stage-code');

  if (!preview) return;

  var currentCarousel = null;

  function updateStage() {
    var theme      = themeSelect.value;
    var slideCount = parseInt(slidesSelect.value, 10);
    var autoplay   = autoplayChk.checked;

    // Apply theme
    var themes = ['neo-light-theme', 'neo-dark-theme', 'customer-light-theme', 'customer-dark-theme'];
    themes.forEach(function (t) { preview.classList.remove(t); });
    preview.classList.add(theme);

    // Destroy previous carousel
    if (currentCarousel && currentCarousel.destroy) currentCarousel.destroy();
    preview.innerHTML = '';

    currentCarousel = buildCarousel(slideCount, autoplay);
    preview.appendChild(currentCarousel.el);

    // Update code output
    if (codeOutput) {
      var lines = '';
      for (var i = 0; i < slideCount; i++) {
        lines += (i === 0 ? '      <span class="carousel-line active' + (autoplay ? ' autoplay' : '') + '"></span>' : '      <span class="carousel-line"></span>') + '\n';
      }
      codeOutput.textContent =
        '<div class="carousel" role="region" aria-label="Referenz-Karussell">\n\n'
        + '  <div class="carousel-slides-wrapper">\n'
        + '    <ul>\n'
        + Array.from({ length: slideCount }, function (_, i) {
            return '      <li class="carousel-slide-width-4">\n'
              + '        <!-- Slide ' + (i + 1) + ' Inhalt -->\n'
              + '      </li>';
          }).join('\n')
        + '\n    </ul>\n'
        + '  </div>\n\n'
        + '  <div class="carousel-bottom-nav-wrapper">\n'
        + '    <div class="carousel-line-wrapper" aria-hidden="true">\n'
        + lines
        + '      <span class="line-extra-fill"></span>\n'
        + '    </div>\n'
        + '    <div class="carousel-navigations-wrapper">\n'
        + '      <button type="button" aria-label="Vorheriger Slide" disabled>\n'
        + '        <span class="icon" aria-hidden="true"><svg><!-- Pfeil links --></svg></span>\n'
        + '      </button>\n'
        + '      <button type="button" aria-label="N\u00e4chster Slide">\n'
        + '        <span class="icon" aria-hidden="true"><svg><!-- Pfeil rechts --></svg></span>\n'
        + '      </button>\n'
        + '    </div>\n'
        + '  </div>\n\n'
        + '</div>';
    }
  }

  themeSelect.addEventListener('change', updateStage);
  slidesSelect.addEventListener('change', updateStage);
  autoplayChk.addEventListener('change', updateStage);

  // Initial render
  updateStage();

})();
