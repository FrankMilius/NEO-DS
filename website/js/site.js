const DATA_URL = 'website/data/site-data.json';
const HERO_CONFIG_KEY = 'heroConfig';
const NAV_CONFIG_KEY = 'navConfig';
const THEME_KEY = 'appTheme';

const THEMES = [
  {
    id: 'neo-light-theme',
    label: { de: 'Neo Light', en: 'Neo Light' },
    bg: '#ffffff',
    bgSecondary: '#f5f5f5',
    text: '#000000',
    accent: '#009fe3'
  },
  {
    id: 'neo-dark-theme',
    label: { de: 'Neo Dark', en: 'Neo Dark' },
    bg: '#1d1d1d',
    bgSecondary: '#333333',
    text: '#ffffff',
    accent: '#009fe3'
  },
  {
    id: 'customer-light-theme',
    label: { de: 'Customer Light', en: 'Customer Light' },
    bg: '#f5f5f5',
    bgSecondary: '#e5e5e5',
    text: '#000000',
    accent: '#002049'
  },
  {
    id: 'customer-dark-theme',
    label: { de: 'Customer Dark', en: 'Customer Dark' },
    bg: '#000000',
    bgSecondary: '#1d1d1d',
    text: '#f5f5f5',
    accent: '#002049'
  }
];

// Migration: alte Theme-IDs → kanonische Namen
const THEME_MIGRATION = {
  'light-base-theme': 'neo-light-theme',
  'dark-base-theme': 'neo-dark-theme',
  'light-secondary-theme': 'customer-light-theme',
  'dark-secondary-theme': 'customer-dark-theme'
};

const _migrateThemeId = (id) => THEME_MIGRATION[id] || id;

const state = {
  lang: localStorage.getItem('lang') || 'de',
  page: document.body.dataset.page || 'home',
  theme: _migrateThemeId(localStorage.getItem(THEME_KEY) || 'neo-light-theme')
};

const setLang = (lang) => {
  state.lang = lang;
  localStorage.setItem('lang', lang);
};

const createEl = (tag, className, text) => {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (text) el.textContent = text;
  return el;
};

const clone = (value) => JSON.parse(JSON.stringify(value));

const loadNavConfig = () => {
  const raw = localStorage.getItem(NAV_CONFIG_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch (error) {
    console.warn('Invalid nav config in localStorage.', error);
    return null;
  }
};

const applyNavConfig = (data) => {
  const navSection = data.inventory.sections.find((section) => section.type === 'navigation');
  if (!navSection) return data;
  const stored = loadNavConfig();
  if (!stored) return data;
  const merged = clone(navSection.content);
  Object.keys(merged).forEach((lang) => {
    if (!stored[lang]) return;
    const baseLang = merged[lang];
    const storedLang = stored[lang];
    merged[lang] = {
      ...baseLang,
      ...storedLang,
      cta_primary: {
        ...baseLang.cta_primary,
        ...(storedLang.cta_primary || {})
      },
      cta_secondary: {
        ...baseLang.cta_secondary,
        ...(storedLang.cta_secondary || {})
      },
      links: Array.isArray(storedLang.links) ? storedLang.links : baseLang.links
    };
  });
  navSection.content = merged;
  return data;
};

const loadHeroConfig = () => {
  const raw = localStorage.getItem(HERO_CONFIG_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch (error) {
    console.warn('Invalid hero config in localStorage.', error);
    return null;
  }
};

const applyHeroConfig = (data) => {
  const stored = loadHeroConfig();
  if (!stored?.home) return data;
  const heroIds = new Set(
    data.inventory.sections.filter((section) => section.type === 'hero').map((section) => section.id)
  );
  if (!heroIds.has(stored.home)) return data;

  const home = data.site_blueprint.pages.find((page) => page.id === 'home');
  if (!home) return data;

  home.layout = home.layout.map((id) => (id.startsWith('hero-') ? stored.home : id));
  return data;
};

const getPageHref = (pageId) => {
  if (pageId === 'home') return 'index.html';
  return `${pageId.replace(/_/g, '-')}.html`;
};

const buildSectionShell = (section, lang) => {
  const el = document.createElement('section');
  el.className = `section section--${section.type}`;
  el.id = section.id;
  el.dataset.sectionType = section.type;
  if (section.ai_metadata?.keywords?.[lang]) {
    el.dataset.aiKeywords = section.ai_metadata.keywords[lang].join(', ');
  }
  return el;
};

// ---------------------------------------------------------------------------
// NavigationMenu Component (shadcn-inspired)
// ---------------------------------------------------------------------------

const CHEVRON_SVG = `<svg viewBox="0 0 12 12" aria-hidden="true"><polyline points="2 4 6 8 10 4"/></svg>`;

const buildNavigationMenu = (links, lang) => {
  const menuNav = createEl('nav', 'nc-navigation-menu');
  menuNav.setAttribute('aria-label', lang === 'de' ? 'Hauptnavigation' : 'Main navigation');

  const list = createEl('ul', 'nc-navigation-menu__list');
  list.setAttribute('role', 'menubar');

  // Viewport: gemeinsamer Container für alle Content-Panels
  const viewportWrapper = createEl('div', 'nc-navigation-menu__viewport-wrapper');
  const viewport = createEl('div', 'nc-navigation-menu__viewport');
  viewport.dataset.state = 'closed';
  viewportWrapper.appendChild(viewport);

  // Indicator (Pfeil-Dreieck)
  const indicator = createEl('div', 'nc-navigation-menu__indicator');
  indicator.dataset.state = 'hidden';
  const indicatorArrow = createEl('div', 'nc-navigation-menu__indicator-arrow');
  indicator.appendChild(indicatorArrow);

  let activeItem = null;
  let closeTimeout = null;

  const openItem = (item, content, trigger) => {
    if (closeTimeout) {
      clearTimeout(closeTimeout);
      closeTimeout = null;
    }

    // Bestimme Richtung für Motion-Animation
    const items = Array.from(list.children);
    const prevIndex = activeItem ? items.indexOf(activeItem) : -1;
    const nextIndex = items.indexOf(item);

    // Vorheriges Panel schließen
    if (activeItem && activeItem !== item) {
      const prevContent = activeItem.querySelector('.nc-navigation-menu__content');
      const prevTrigger = activeItem.querySelector('.nc-navigation-menu__trigger');
      if (prevContent) {
        prevContent.dataset.state = 'closed';
        prevContent.dataset.motion = prevIndex < nextIndex ? 'to-start' : 'to-end';
      }
      if (prevTrigger) prevTrigger.dataset.state = 'closed';
    }

    // Neues Panel öffnen
    activeItem = item;
    trigger.dataset.state = 'open';
    content.dataset.state = 'open';
    content.dataset.motion = prevIndex >= 0
      ? (prevIndex < nextIndex ? 'from-end' : 'from-start')
      : '';

    // Viewport anpassen
    viewport.dataset.state = 'open';
    viewport.innerHTML = '';
    viewport.appendChild(content.cloneNode(true));

    // Viewport-Breite anpassen
    const contentWidth = content.offsetWidth || 500;
    viewport.style.width = contentWidth + 'px';

    // Indicator positionieren
    const triggerRect = trigger.getBoundingClientRect();
    const navRect = menuNav.getBoundingClientRect();
    indicator.dataset.state = 'visible';
    indicator.style.left = (triggerRect.left - navRect.left + triggerRect.width / 2 - 5) + 'px';
    indicator.style.width = '10px';
  };

  const closeAll = () => {
    if (activeItem) {
      const prevContent = activeItem.querySelector('.nc-navigation-menu__content');
      const prevTrigger = activeItem.querySelector('.nc-navigation-menu__trigger');
      if (prevContent) prevContent.dataset.state = 'closed';
      if (prevTrigger) prevTrigger.dataset.state = 'closed';
    }
    activeItem = null;
    viewport.dataset.state = 'closed';
    indicator.dataset.state = 'hidden';
  };

  const scheduleClose = () => {
    closeTimeout = setTimeout(closeAll, 150);
  };

  const cancelClose = () => {
    if (closeTimeout) {
      clearTimeout(closeTimeout);
      closeTimeout = null;
    }
  };

  links.forEach((link) => {
    const li = createEl('li', 'nc-navigation-menu__item');
    li.setAttribute('role', 'none');

    if (link.children && link.children.length) {
      // Trigger-Button
      const trigger = createEl('button', 'nc-navigation-menu__trigger');
      trigger.type = 'button';
      trigger.setAttribute('role', 'menuitem');
      trigger.setAttribute('aria-haspopup', 'true');
      trigger.setAttribute('aria-expanded', 'false');
      trigger.dataset.state = 'closed';

      const labelSpan = createEl('span', '', link.label);
      const chevron = createEl('span', 'nc-navigation-menu__trigger-icon');
      chevron.innerHTML = CHEVRON_SVG;
      trigger.append(labelSpan, chevron);

      // Content-Panel
      const content = createEl('div', 'nc-navigation-menu__content nc-navigation-menu__content--two-col');
      content.dataset.state = 'closed';
      content.setAttribute('role', 'menu');

      const contentGrid = createEl('div', 'nc-navigation-menu__content-grid');

      // Callout (linke Spalte)
      const megaCtaLabel = (() => {
        if (link.mega_cta_label) return link.mega_cta_label;
        if (lang === 'de') {
          if (link.href?.includes('products')) return 'Alle Produkte →';
          if (link.href?.includes('services')) return 'Alle Leistungen →';
          return 'Alle ansehen →';
        }
        return 'View all →';
      })();

      const callout = createEl('a', 'nc-navigation-menu__callout');
      callout.href = link.href;
      const calloutTitle = createEl('div', 'nc-navigation-menu__callout-title', link.label);
      const calloutDesc = createEl('p', 'nc-navigation-menu__callout-desc', link.description || '');
      const calloutCta = createEl('span', 'nc-navigation-menu__link-title', megaCtaLabel);
      callout.append(calloutTitle, calloutDesc, calloutCta);

      // Links (rechte Spalte)
      const linksGrid = createEl('div', 'nc-navigation-menu__content-grid');
      link.children.forEach((child) => {
        const childLink = createEl('a', 'nc-navigation-menu__link');
        childLink.href = child.href;
        childLink.setAttribute('role', 'menuitem');
        const title = createEl('div', 'nc-navigation-menu__link-title', child.label);
        childLink.appendChild(title);
        if (child.description) {
          const desc = createEl('p', 'nc-navigation-menu__link-desc', child.description);
          childLink.appendChild(desc);
        }
        linksGrid.appendChild(childLink);
      });

      contentGrid.append(callout, linksGrid);
      content.appendChild(contentGrid);

      // Hover-Interaktion
      li.addEventListener('mouseenter', () => openItem(li, content, trigger));
      li.addEventListener('mouseleave', scheduleClose);

      // Keyboard
      trigger.addEventListener('click', () => {
        if (trigger.dataset.state === 'open') {
          closeAll();
        } else {
          openItem(li, content, trigger);
        }
      });
      trigger.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          closeAll();
          trigger.focus();
        }
      });

      li.append(trigger, content);
    } else {
      // Direkter Link (kein Dropdown)
      const a = createEl('a', 'nc-navigation-menu__link--top');
      a.href = link.href;
      a.setAttribute('role', 'menuitem');
      a.textContent = link.label;
      li.appendChild(a);
    }

    list.appendChild(li);
  });

  // Viewport hover hält Menü offen
  viewportWrapper.addEventListener('mouseenter', cancelClose);
  viewportWrapper.addEventListener('mouseleave', scheduleClose);

  // Click outside schließt
  document.addEventListener('click', (event) => {
    if (!menuNav.contains(event.target)) {
      closeAll();
    }
  });

  menuNav.append(list, indicator, viewportWrapper);
  return menuNav;
};

// ---------------------------------------------------------------------------
// renderNavigation (nutzt buildNavigationMenu)
// ---------------------------------------------------------------------------

const renderNavigation = (section, lang) => {
  const content = section.content[lang];
  const header = createEl('header', 'nc-header');
  header.setAttribute('role', 'banner');

  const nav = createEl('nav', 'nc-nav');
  nav.setAttribute('aria-label', lang === 'de' ? 'Hauptnavigation' : 'Main navigation');

  const navInner = createEl('div', 'nc-nav__inner');

  const brand = createEl('a', 'nc-brand', content.logo_text);
  brand.href = 'index.html';

  // shadcn-NavigationMenu statt alter nc-nav__list
  const navigationMenu = buildNavigationMenu(content.links, lang);

  const actions = createEl('div', 'nc-nav__actions');
  const primary = createEl('a', 'nc-button nc-button--accent', content.cta_primary.label);
  primary.href = content.cta_primary.href;

  const tools = createEl('div', 'nc-tools');

  const mobileToggle = createEl('button', 'nc-button nc-button--ghost nc-mobile-toggle');
  mobileToggle.type = 'button';
  mobileToggle.setAttribute('aria-expanded', 'false');
  mobileToggle.setAttribute('aria-label', lang === 'de' ? 'Menü öffnen' : 'Open menu');
  mobileToggle.innerHTML = `
    <span class="nc-mobile-toggle__icon" aria-hidden="true"></span>
    <span class="u-sr-only">${lang === 'de' ? 'Menü' : 'Menu'}</span>
  `;

  const searchButton = createEl('button', 'nc-button nc-button--icon-only nc-search-toggle');
  searchButton.type = 'button';
  searchButton.setAttribute('aria-expanded', 'false');
  searchButton.setAttribute('aria-controls', 'search-panel');
  searchButton.setAttribute('aria-label', lang === 'de' ? 'Suche öffnen' : 'Open search');
  searchButton.innerHTML = `
    <svg class="nc-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" stroke-width="2"></circle>
      <line x1="16.5" y1="16.5" x2="21" y2="21" stroke="currentColor" stroke-width="2" stroke-linecap="round"></line>
    </svg>
  `;

  const langToggle = createEl('div', 'nc-lang-toggle');
  const deButton = createEl('button', 'nc-lang-toggle__button', 'DE');
  const enButton = createEl('button', 'nc-lang-toggle__button', 'EN');
  deButton.type = 'button';
  enButton.type = 'button';
  deButton.dataset.lang = 'de';
  enButton.dataset.lang = 'en';
  if (lang === 'de') deButton.classList.add('is-active');
  if (lang === 'en') enButton.classList.add('is-active');

  langToggle.append(deButton, enButton);
  tools.append(searchButton, langToggle, primary);
  actions.append(tools);
  navInner.append(brand, navigationMenu, actions, mobileToggle);
  nav.append(navInner);
  header.appendChild(nav);

  const searchPanel = createEl('div', 'nc-search-panel');
  searchPanel.id = 'search-panel';
  searchPanel.setAttribute('aria-hidden', 'true');
  searchPanel.dataset.searchSurface = 'true';
  searchPanel.innerHTML = `
    <div class="nc-container">
      <div class="nc-search-panel__inner">
        <label class="u-sr-only" for="site-search">${lang === 'de' ? 'Suche' : 'Search'}</label>
        <div class="nc-search-panel__top">
          <input id="site-search" type="search" placeholder="${lang === 'de'
            ? 'Suche nach Themen, Features, Kunden...'
            : 'Search topics, features, customers...'}" autocomplete="off" />
          <button class="nc-search-panel__close" type="button" aria-label="${lang === 'de' ? 'Suche schließen' : 'Close search'}">×</button>
        </div>
        <div class="nc-search__meta">
          <span class="nc-search__hint">${lang === 'de' ? 'Mindestens 3 Zeichen' : 'At least 3 characters'}</span>
        </div>
        <div class="nc-search__results" role="listbox" aria-live="polite"></div>
      </div>
    </div>
  `;
  header.appendChild(searchPanel);

  const mobilePanel = createEl('div', 'nc-mobile-panel');
  mobilePanel.setAttribute('aria-hidden', 'true');
  mobilePanel.innerHTML = `
    <div class="nc-container">
      <div class="nc-mobile-panel__inner" data-search-surface="true">
        <label class="u-sr-only" for="mobile-search">${lang === 'de' ? 'Suche' : 'Search'}</label>
        <div class="nc-search-panel__top">
          <input id="mobile-search" type="search" placeholder="${lang === 'de'
            ? 'Suche in Neocosmo...'
            : 'Search Neocosmo...'}" autocomplete="off" />
          <button class="nc-search-panel__close" type="button" aria-label="${lang === 'de' ? 'Suche schließen' : 'Close search'}">×</button>
        </div>
        <div class="nc-search__results" role="listbox" aria-live="polite"></div>
        <div class="nc-mobile-links"></div>
      </div>
    </div>
  `;
  header.appendChild(mobilePanel);

  const mobileLinks = mobilePanel.querySelector('.nc-mobile-links');
  content.links.forEach((link) => {
    const item = createEl('div', 'nc-mobile-item');
    if (link.children && link.children.length) {
      const toggle = createEl('button', 'nc-mobile-toggle-link', link.label);
      toggle.type = 'button';
      toggle.innerHTML = `<span>${link.label}</span><span class="nc-nav__icon">+</span>`;
      const list = createEl('div', 'nc-mobile-submenu');
      link.children.forEach((child) => {
        const childLink = createEl('a', 'nc-mobile-submenu__link', child.label);
        childLink.href = child.href;
        list.appendChild(childLink);
      });
      toggle.addEventListener('click', () => {
        const isOpen = item.classList.toggle('is-open');
        const iconEl = toggle.querySelector('.nc-nav__icon');
        if (iconEl) iconEl.textContent = isOpen ? '-' : '+';
      });
      item.append(toggle, list);
    } else {
      const linkEl = createEl('a', 'nc-mobile-link', link.label);
      linkEl.href = link.href;
      item.appendChild(linkEl);
    }
    mobileLinks.appendChild(item);
  });

  searchButton.addEventListener('click', () => {
    const isOpen = header.classList.toggle('is-search-open');
    searchButton.setAttribute('aria-expanded', String(isOpen));
    searchPanel.setAttribute('aria-hidden', String(!isOpen));
    if (isOpen) {
      const input = searchPanel.querySelector('#site-search');
      input?.focus();
    }
  });

  mobileToggle.addEventListener('click', () => {
    const isOpen = header.classList.toggle('is-mobile-open');
    mobileToggle.setAttribute('aria-expanded', String(isOpen));
    mobilePanel.setAttribute('aria-hidden', String(!isOpen));
  });

  const closeSearchPanel = () => {
    header.classList.remove('is-search-open');
    searchButton.setAttribute('aria-expanded', 'false');
    searchPanel.setAttribute('aria-hidden', 'true');
  };

  searchPanel.addEventListener('click', (event) => {
    if (event.target === searchPanel) {
      closeSearchPanel();
    }
  });

  searchPanel.querySelector('.nc-search-panel__inner')?.addEventListener('click', (event) => {
    const button = event.target.closest('.nc-search-panel__close');
    if (!button) return;
    const input = searchPanel.querySelector('input[type="search"]');
    if (!input) return;
    if (button.dataset.mode === 'reset') {
      input.value = '';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.focus();
      return;
    }
    closeSearchPanel();
  });

  mobilePanel.querySelector('.nc-mobile-panel__inner')?.addEventListener('click', (event) => {
    const button = event.target.closest('.nc-search-panel__close');
    if (!button) return;
    const input = mobilePanel.querySelector('input[type="search"]');
    if (!input) return;
    if (button.dataset.mode === 'reset') {
      input.value = '';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.focus();
    } else {
      input.value = '';
      input.dispatchEvent(new Event('input', { bubbles: true }));
    }
  });

  return header;
};

const renderHero = (section, lang) => {
  const content = section.content[lang];
  const shell = buildSectionShell(section, lang);
  const wrap = createEl('div', 'nc-container nc-hero');

  const text = createEl('div', 'nc-hero__content');
  const eyebrow = createEl('p', 'nc-eyebrow', content.eyebrow);
  const title = createEl('h1', 'nc-hero__title', content.title);
  const lead = createEl('p', 'nc-lead', content.lead);
  const actions = createEl('div', 'nc-button-group');
  const primary = createEl('a', 'nc-button nc-button--accent', content.cta_primary.label);
  primary.href = content.cta_primary.href;
  const secondary = createEl('a', 'nc-button nc-button--outline', content.cta_secondary.label);
  secondary.href = content.cta_secondary.href;
  actions.append(primary, secondary);

  text.append(eyebrow, title, lead, actions);

  const media = createEl('div', 'nc-hero__media');
  if (section.id === 'hero-primary--content-left--bg-picture') {
    const spacer = createEl('div', 'nc-hero__media-spacer');
    media.appendChild(spacer);
  } else if (content.picture?.src) {
    const picture = createEl('div', 'nc-hero__picture');
    const img = document.createElement('img');
    img.src = content.picture.src;
    img.alt = content.picture.alt || '';
    picture.appendChild(img);
    media.appendChild(picture);
  } else {
    const mediaCard = createEl('div', 'nc-hero__card');
    mediaCard.innerHTML = `
      <div class="nc-hero__metric">
        <span class="nc-hero__metric-value">48%</span>
        <span class="nc-hero__metric-label">${lang === 'de' ? 'höhere Adoption' : 'higher adoption'}</span>
      </div>
      <div class="nc-hero__metric">
        <span class="nc-hero__metric-value">3x</span>
        <span class="nc-hero__metric-label">${lang === 'de' ? 'schnellere Insights' : 'faster insights'}</span>
      </div>
      <div class="nc-hero__pulse"></div>
    `;
    media.appendChild(mediaCard);
  }

  wrap.append(text, media);
  shell.appendChild(wrap);
  return shell;
};

const renderVideoSection = (section, lang) => {
  const content = section.content[lang];
  const shell = buildSectionShell(section, lang);
  const wrap = createEl('div', 'nc-container');
  const grid = createEl('div', 'nc-video');

  const media = createEl('div', 'nc-video__media');
  if (content.video?.src) {
    const video = document.createElement('video');
    video.src = content.video.src;
    video.controls = false;
    video.playsInline = true;
    video.preload = 'metadata';
    if (content.video.poster) video.poster = content.video.poster;
    if (content.video.title) {
      video.setAttribute('aria-label', content.video.title);
      video.setAttribute('title', content.video.title);
    }
    const overlay = createEl('button', 'nc-video__overlay');
    overlay.type = 'button';
    overlay.setAttribute('aria-label', lang === 'de' ? 'Video abspielen' : 'Play video');
    overlay.innerHTML = `
      <span class="nc-video__overlay-icon" aria-hidden="true"></span>
      <span class="u-sr-only">${lang === 'de' ? 'Video abspielen' : 'Play video'}</span>
    `;

    const playVideo = () => {
      video.play().catch(() => {});
      video.controls = true;
      media.classList.add('is-playing');
    };

    overlay.addEventListener('click', playVideo);
    video.addEventListener('play', () => media.classList.add('is-playing'));
    video.addEventListener('pause', () => media.classList.remove('is-playing'));
    video.addEventListener('ended', () => media.classList.remove('is-playing'));

    media.append(overlay, video);
  }

  const text = createEl('div', 'nc-video__content');
  const title = createEl('h2', 'nc-video__title', content.title);
  const lead = createEl('p', 'nc-lead nc-video__text', content.text);
  const cta = createEl('a', 'nc-button nc-button--accent', content.cta.label);
  cta.href = content.cta.href;

  text.append(title, lead, cta);
  grid.append(media, text);
  wrap.appendChild(grid);
  shell.appendChild(wrap);
  return shell;
};

const renderLogoWall = (section, lang) => {
  const content = section.content[lang];
  const shell = buildSectionShell(section, lang);
  const wrap = createEl('div', 'nc-container');
  const title = createEl('h2', 'nc-section-title', content.title);
  const list = createEl('div', 'nc-logo-wall');
  content.logos.forEach((logo) => {
    const badge = createEl('div', 'nc-logo-pill', logo);
    list.appendChild(badge);
  });
  wrap.append(title, list);
  shell.appendChild(wrap);
  return shell;
};

const renderFeatureGrid = (section, lang, className) => {
  const content = section.content[lang];
  const shell = buildSectionShell(section, lang);
  const wrap = createEl('div', 'nc-container');
  const title = createEl('h2', 'nc-section-title', content.title);
  const grid = createEl('div', className);
  content.items.forEach((item, index) => {
    const card = createEl('article', 'nc-card');
    const body = createEl('div', 'nc-card__content');
    const cardTitle = createEl('h3', 'nc-card__title', item.title);
    const text = createEl('p', 'nc-card__description', item.text);
    body.append(cardTitle, text);

    if (item.image?.src) {
      const media = createEl('div', 'nc-card__media');
      const img = document.createElement('img');
      img.src = item.image.src;
      img.alt = item.image.alt || item.title;
      img.loading = index === 0 ? 'eager' : 'lazy';
      img.decoding = 'async';
      media.appendChild(img);
      card.append(media, body);
    } else {
      card.appendChild(body);
    }
    grid.appendChild(card);
  });
  wrap.append(title, grid);
  shell.appendChild(wrap);
  return shell;
};

const renderMetrics = (section, lang) => {
  const content = section.content[lang];
  const shell = buildSectionShell(section, lang);
  const wrap = createEl('div', 'nc-container');
  const title = createEl('h2', 'nc-section-title', content.title);
  const grid = createEl('div', 'nc-metric-grid');
  content.items.forEach((item) => {
    const card = createEl('div', 'nc-metric');
    const value = createEl('div', 'nc-metric__value', item.value);
    const label = createEl('div', 'nc-metric__label', item.label);
    card.append(value, label);
    grid.appendChild(card);
  });
  wrap.append(title, grid);
  shell.appendChild(wrap);
  return shell;
};

const renderFacts = (section, lang) => {
  const content = section.content[lang];
  const shell = buildSectionShell(section, lang);
  const wrap = createEl('div', 'nc-container');
  const title = createEl('h2', 'nc-section-title', content.title);
  const grid = createEl('div', 'nc-facts-grid');

  content.sections.forEach((group) => {
    const block = createEl('div', 'nc-facts-block');
    const heading = createEl('h3', 'nc-facts-title', group.title);
    const list = createEl('dl', 'nc-facts-list');
    group.items.forEach((item) => {
      const term = createEl('dt', 'nc-facts-term', item.term);
      const desc = createEl('dd', 'nc-facts-desc', item.description);
      list.append(term, desc);
    });
    block.append(heading, list);
    grid.appendChild(block);
  });

  wrap.append(title, grid);
  shell.appendChild(wrap);
  return shell;
};

const renderMediaGallery = (section, lang) => {
  const content = section.content[lang];
  const shell = buildSectionShell(section, lang);
  const wrap = createEl('div', 'nc-container');
  const title = createEl('h2', 'nc-section-title', content.title);
  const slider = createEl('div', 'nc-slider nc-slider--media');
  slider.dataset.slider = 'media_gallery';
  slider.tabIndex = 0;
  const track = createEl('div', 'nc-slider__track nc-slider__track--media');
  content.items.forEach((item, index) => {
    const card = createEl('figure', 'nc-media-card');
    const caption = createEl('figcaption', 'nc-media-card__caption');
    const captionTitle = createEl('h3', 'nc-card__title', item.title);
    const captionText = createEl('p', 'nc-card__description', item.text);
    caption.append(captionTitle, captionText);
    const img = document.createElement('img');
    img.src = item.image;
    img.alt = item.title;
    img.loading = index === 0 ? 'eager' : 'lazy';
    img.decoding = 'async';
    card.append(caption, img);
    track.appendChild(card);
  });
  const controls = createEl('div', 'nc-slider__controls');
  const prev = createEl('button', 'nc-button nc-button--icon-only', '‹');
  prev.type = 'button';
  prev.dataset.action = 'prev';
  prev.setAttribute('aria-label', lang === 'de' ? 'Vorheriges Highlight' : 'Previous highlight');
  const next = createEl('button', 'nc-button nc-button--icon-only', '›');
  next.type = 'button';
  next.dataset.action = 'next';
  next.setAttribute('aria-label', lang === 'de' ? 'Nächstes Highlight' : 'Next highlight');
  controls.append(prev, next);

  slider.append(track, controls);
  wrap.append(title, slider);
  shell.appendChild(wrap);
  return shell;
};

const renderUseCases = (section, lang) => {
  return renderFeatureGrid(section, lang, 'nc-card-grid');
};

const renderNews = (section, lang) => {
  return renderFeatureGrid(section, lang, 'nc-card-grid');
};

const renderTestimonials = (section, lang) => {
  const content = section.content[lang];
  const shell = buildSectionShell(section, lang);
  const wrap = createEl('div', 'nc-container');
  const title = createEl('h2', 'nc-section-title', content.title);
  const slider = createEl('div', 'nc-slider');
  slider.dataset.slider = 'testimonials';
  slider.tabIndex = 0;
  const track = createEl('div', 'nc-slider__track');
  content.items.forEach((item) => {
    const card = createEl('article', 'nc-testimonial');
    const quote = createEl('p', 'nc-testimonial__quote', `“${item.quote}”`);
    const author = createEl('div', 'nc-testimonial__author');
    const avatar = createEl('div', 'nc-avatar');
    if (item.avatar) {
      const img = document.createElement('img');
      img.src = item.avatar;
      img.alt = item.name;
      img.loading = 'lazy';
      img.decoding = 'async';
      avatar.appendChild(img);
    } else {
      avatar.textContent = item.name
        .split(' ')
        .map((chunk) => chunk[0])
        .join('');
    }
    const meta = createEl('div', 'nc-testimonial__meta');
    const name = createEl('div', 'nc-testimonial__name', item.name);
    const role = createEl('div', 'nc-testimonial__role', `${item.role} · ${item.company}`);
    meta.append(name, role);
    author.append(avatar, meta);
    card.append(quote, author);
    track.appendChild(card);
  });

  const controls = createEl('div', 'nc-slider__controls');
  const prev = createEl('button', 'nc-button nc-button--icon-only', '‹');
  prev.type = 'button';
  prev.dataset.action = 'prev';
  prev.setAttribute('aria-label', lang === 'de' ? 'Vorheriges Testimonial' : 'Previous testimonial');
  const next = createEl('button', 'nc-button nc-button--icon-only', '›');
  next.type = 'button';
  next.dataset.action = 'next';
  next.setAttribute('aria-label', lang === 'de' ? 'Nächstes Testimonial' : 'Next testimonial');
  controls.append(prev, next);

  slider.append(track, controls);
  wrap.append(title, slider);
  shell.appendChild(wrap);
  return shell;
};

const renderPricing = (section, lang) => {
  const content = section.content[lang];
  const shell = buildSectionShell(section, lang);
  const wrap = createEl('div', 'nc-container');
  const title = createEl('h2', 'nc-section-title', content.title);
  const subtitle = createEl('p', 'nc-lead', content.subtitle);
  const grid = createEl('div', 'nc-pricing-grid');
  content.plans.forEach((plan, index) => {
    const card = createEl('article', 'nc-pricing-card');
    if (index === 1) card.classList.add('is-featured');
    const name = createEl('h3', 'nc-card__title', plan.name);
    const price = createEl('p', 'nc-price', plan.price);
    const desc = createEl('p', 'nc-card__description', plan.description);
    const list = createEl('ul', 'nc-feature-list');
    plan.features.forEach((feature) => {
      list.appendChild(createEl('li', 'nc-feature-list__item', feature));
    });
    const cta = createEl('a', 'nc-button nc-button--secondary', plan.cta.label);
    cta.href = plan.cta.href;
    card.append(name, price, desc, list, cta);
    grid.appendChild(card);
  });
  wrap.append(title, subtitle, grid);
  shell.appendChild(wrap);
  return shell;
};

const renderComparison = (section, lang) => {
  const content = section.content[lang];
  const shell = buildSectionShell(section, lang);
  const wrap = createEl('div', 'nc-container');
  const title = createEl('h2', 'nc-section-title', content.title);
  const tableWrap = createEl('div', 'nc-data-table nc-data-table--static nc-data-table--striped');
  const table = createEl('table', 'nc-data-table__table');
  const thead = document.createElement('thead');
  const headRow = document.createElement('tr');
  headRow.appendChild(createEl('th', '', lang === 'de' ? 'Feature' : 'Feature'));
  content.tiers.forEach((tier) => headRow.appendChild(createEl('th', '', tier)));
  thead.appendChild(headRow);

  const tbody = document.createElement('tbody');
  content.rows.forEach((row) => {
    const tr = document.createElement('tr');
    tr.appendChild(createEl('td', '', row.feature));
    row.values.forEach((value) => tr.appendChild(createEl('td', '', value)));
    tbody.appendChild(tr);
  });

  table.append(thead, tbody);
  tableWrap.appendChild(table);
  wrap.append(title, tableWrap);
  shell.appendChild(wrap);
  return shell;
};

const renderFeatureAccordeon = (section, lang) => {
  const content = section.content[lang];
  const shell = buildSectionShell(section, lang);
  const wrap = createEl('div', 'nc-container');
  const layout = createEl('div', 'nc-feature-accordeon');

  const left = createEl('div', 'nc-feature-accordeon__left');
  const title = createEl('h2', 'nc-feature-accordeon__title', content.title);
  const lead = createEl('p', 'nc-feature-accordeon__lead', content.lead);
  const chapterNav = createEl('nav', 'nc-feature-accordeon__nav');
  chapterNav.setAttribute('aria-label', lang === 'de' ? 'Kapitel-Navigation' : 'Chapter navigation');
  const chapterList = createEl('ul', 'nc-feature-accordeon__links');

  const right = createEl('div', 'nc-feature-accordeon__right');
  right.setAttribute('role', 'region');
  right.setAttribute('aria-label', lang === 'de' ? 'Feature-Details' : 'Feature details');
  right.tabIndex = 0;

  const chapterAnchors = [];
  const navLinks = [];

  const setActiveChapter = (chapterId) => {
    navLinks.forEach((link) => {
      link.classList.toggle('is-active', link.dataset.target === chapterId);
    });
  };

  content.chapters.forEach((chapter, chapterIndex) => {
    const chapterId = `${section.id}-chapter-${chapterIndex + 1}`;
    chapterAnchors.push(chapterId);

    const navItem = createEl('li', 'nc-feature-accordeon__link-item');
    const navButton = createEl('button', 'nc-feature-accordeon__link', chapter.title);
    navButton.type = 'button';
    navButton.dataset.target = chapterId;
    navButton.setAttribute('aria-controls', chapterId);
    if (chapterIndex === 0) navButton.classList.add('is-active');
    navLinks.push(navButton);
    navItem.appendChild(navButton);
    chapterList.appendChild(navItem);

    const chapterSection = createEl('section', 'nc-feature-accordeon__chapter');
    chapterSection.id = chapterId;
    const chapterTitle = createEl('h3', 'nc-feature-accordeon__chapter-title', chapter.title);
    const chapterItems = createEl('div', 'nc-feature-accordeon__chapter-items');

    chapter.items.forEach((item, itemIndex) => {
      const details = document.createElement('details');
      details.className = 'nc-feature-accordeon__item';
      if (item.open || (!chapterIndex && !itemIndex)) details.open = true;

      const summary = createEl('summary', 'nc-feature-accordeon__item-summary', item.title);
      const body = createEl('div', 'nc-feature-accordeon__item-body');
      if (item.text) {
        body.appendChild(createEl('p', 'nc-feature-accordeon__item-text', item.text));
      }
      if (Array.isArray(item.bullets) && item.bullets.length) {
        const bulletList = createEl('ul', 'nc-feature-accordeon__item-list');
        item.bullets.forEach((bullet) => {
          bulletList.appendChild(createEl('li', 'nc-feature-accordeon__item-list-entry', bullet));
        });
        body.appendChild(bulletList);
      }
      details.append(summary, body);
      chapterItems.appendChild(details);
    });

    chapterSection.append(chapterTitle, chapterItems);
    right.appendChild(chapterSection);
  });

  chapterNav.appendChild(chapterList);
  left.append(title, lead, chapterNav);

  const jumpToChapter = (chapterId) => {
    const chapter = right.querySelector(`#${chapterId}`);
    if (!chapter) return;
    const top = chapter.offsetTop - right.offsetTop + right.scrollTop;
    right.scrollTo({ top, behavior: 'smooth' });
    setActiveChapter(chapterId);
  };

  chapterList.addEventListener('click', (event) => {
    const button = event.target.closest('.nc-feature-accordeon__link');
    if (!button) return;
    jumpToChapter(button.dataset.target);
  });

  right.addEventListener('scroll', () => {
    if (!chapterAnchors.length) return;
    const offset = right.scrollTop + 24;
    let current = chapterAnchors[0];
    chapterAnchors.forEach((chapterId) => {
      const chapter = right.querySelector(`#${chapterId}`);
      if (chapter && chapter.offsetTop <= offset) current = chapterId;
    });
    setActiveChapter(current);
  });

  layout.append(left, right);
  wrap.appendChild(layout);
  shell.appendChild(wrap);
  return shell;
};

const renderFaq = (section, lang) => {
  const content = section.content[lang];
  const shell = buildSectionShell(section, lang);
  const wrap = createEl('div', 'nc-container');
  const title = createEl('h2', 'nc-section-title', content.title);
  const list = createEl('div', 'nc-faq');
  content.items.forEach((item) => {
    const details = document.createElement('details');
    details.className = 'nc-faq__item';
    const summary = createEl('summary', 'nc-faq__question', item.question);
    const answer = createEl('p', 'nc-faq__answer', item.answer);
    details.append(summary, answer);
    list.appendChild(details);
  });
  wrap.append(title, list);
  shell.appendChild(wrap);
  return shell;
};

const renderSecurity = (section, lang) => {
  const content = section.content[lang];
  const shell = buildSectionShell(section, lang);
  const wrap = createEl('div', 'nc-container');
  const title = createEl('h2', 'nc-section-title', content.title);
  const list = createEl('ul', 'nc-security-list');
  content.items.forEach((item) => list.appendChild(createEl('li', 'nc-security-list__item', item)));
  wrap.append(title, list);
  shell.appendChild(wrap);
  return shell;
};

const renderCTA = (section, lang, site) => {
  const content = section.content[lang];
  const shell = buildSectionShell(section, lang);
  const wrap = createEl('div', 'nc-container nc-cta');

  const left = createEl('div', 'nc-cta__left');
  const title = createEl('div', 'nc-section-title', content.title);
  const text = createEl('div', 'nc-lead', content.text);
  left.append(title, text);

  const form = createEl('form', 'nc-cta__form');
  form.setAttribute('aria-label', lang === 'de' ? 'Newsletter Anmeldung' : 'Newsletter sign-up');
  form.innerHTML = `
    <label class="u-sr-only" for="email">${content.placeholder}</label>
    <input id="email" name="email" type="email" placeholder="${content.placeholder}" required />
    <button class="nc-button nc-button--accent" type="submit">${content.button}</button>
  `;
  const note = createEl('small', 'nc-cta__note', content.note);

  const mid = createEl('div', 'nc-cta__mid');
  const right = createEl('div', 'nc-cta__right');

  const demo = createEl('div', 'nc-demo-cta');
  const demoTitle = createEl('div', 'nc-demo-cta__title', lang === 'de' ? 'Demo anfragen' : 'Book a demo');
  const demoText = createEl(
    'div',
    'nc-demo-cta__text',
    lang === 'de'
      ? 'Wir zeigen dir die Plattform in 30 Minuten.'
      : 'Get a 30-minute walkthrough tailored to your team.'
  );
  const demoForm = createEl('form', 'nc-demo-cta__form');
  demoForm.setAttribute('aria-label', lang === 'de' ? 'Demo Anfrage' : 'Demo request');
  demoForm.innerHTML = `
    <label for="demo-email">${lang === 'de' ? 'Geschäftliche E-Mail-Adresse *' : 'Business email address *'}</label>
    <input id="demo-email" name="email" type="email" required />
    <label for="demo-firstname">${lang === 'de' ? 'Vorname *' : 'First name *'}</label>
    <input id="demo-firstname" name="first_name" type="text" required />
    <label for="demo-lastname">${lang === 'de' ? 'Nachname *' : 'Last name *'}</label>
    <input id="demo-lastname" name="last_name" type="text" required />
    <label for="demo-company">${lang === 'de' ? 'Name des Unternehmens *' : 'Company name *'}</label>
    <input id="demo-company" name="company" type="text" required />
    <label for="demo-topic">${
      lang === 'de' ? 'Welches Thema ist für dich relevant' : 'Which topic is relevant for you'
    }</label>
    <select id="demo-topic" name="topic">
      <option value="offer">${lang === 'de' ? 'Angebot anfordern' : 'Request an offer'}</option>
      <option value="demo">${lang === 'de' ? 'Demo vereinbaren' : 'Schedule a demo'}</option>
      <option value="support">${lang === 'de' ? 'Technischer Support' : 'Technical support'}</option>
    </select>
    <button class="nc-button nc-button--accent" type="submit">${lang === 'de' ? 'Demo anfragen' : 'Book a demo'}</button>
  `;
  demo.append(demoTitle, demoText, demoForm);
  mid.append(demo);

  const newsletter = createEl('div', 'nc-newsletter-cta');
  newsletter.append(form, note);
  right.append(newsletter);

  wrap.append(left, mid, right);
  shell.appendChild(wrap);
  return shell;
};

const renderMarquee = (section, lang) => {
  const content = section.content[lang];
  const shell = buildSectionShell(section, lang);
  const wrap = createEl('div', 'nc-container');
  const marquee = createEl('div', 'nc-marquee');
  marquee.dataset.marquee = 'true';
  marquee.dataset.speed = String(content.speed || 60);
  marquee.setAttribute('aria-label', lang === 'de' ? 'Kundenbanner' : 'Customer banner');

  const track = createEl('div', 'nc-marquee__track');
  const text = createEl('span', 'nc-marquee__text', content.text);
  const clone = createEl('span', 'nc-marquee__text', content.text);
  clone.setAttribute('aria-hidden', 'true');

  track.append(text, clone);
  marquee.appendChild(track);
  wrap.appendChild(marquee);
  shell.appendChild(wrap);
  return shell;
};

const renderFooter = (section, lang, site) => {
  const content = section.content[lang];
  const shell = buildSectionShell(section, lang);
  const wrap = createEl('div', 'nc-container nc-footer');
  const brand = createEl('div', 'nc-footer__brand');
  const brandTitle = createEl('strong', 'nc-footer__title', site.brand.name[lang]);
  const brandTagline = createEl('p', 'nc-footer__tagline', site.brand.tagline[lang]);
  const contact = createEl('p', 'nc-footer__contact', `${site.brand.location[lang]} · ${site.brand.email}`);
  brand.append(brandTitle, brandTagline, contact);

  const columns = createEl('div', 'nc-footer__columns');
  content.columns.forEach((col) => {
    const group = createEl('div', 'nc-footer__column');
    const heading = createEl('h3', 'nc-footer__heading', col.title);
    const list = createEl('ul', 'nc-footer__links');
    col.links.forEach((link) => {
      const li = createEl('li', 'nc-footer__item');
      const a = createEl('a', '', link.label);
      a.href = link.href;
      li.appendChild(a);
      list.appendChild(li);
    });
    group.append(heading, list);
    columns.appendChild(group);
  });

  const social = createEl('div', 'nc-footer__social');
  const socialTitle = createEl('span', 'nc-footer__heading', lang === 'de' ? 'Social' : 'Social');
  const socialList = createEl('div', 'nc-footer__social-list');
  site.social.forEach((item) => {
    const link = createEl('a', 'nc-footer__social-link', item.label);
    link.href = item.href;
    socialList.appendChild(link);
  });
  social.append(socialTitle, socialList);

  const bottom = createEl('div', 'nc-footer__bottom', content.footer_note);
  wrap.append(brand, columns, social, bottom);
  shell.appendChild(wrap);
  return shell;
};

const renderSection = (section, lang, site) => {
  switch (section.type) {
    case 'navigation':
      return renderNavigation(section, lang);
    case 'hero':
      return renderHero(section, lang);
    case 'video-section':
      return renderVideoSection(section, lang);
    case 'marquee':
      return renderMarquee(section, lang);
    case 'trust':
      if (section.id === 'social_proof_logos') return renderLogoWall(section, lang);
      return renderSecurity(section, lang);
    case 'features':
      return renderFeatureGrid(section, lang, 'nc-card-grid');
    case 'benefits':
      return renderFeatureGrid(section, lang, 'nc-card-grid');
    case 'metrics':
      return renderMetrics(section, lang);
    case 'facts':
      return renderFacts(section, lang);
    case 'media_gallery':
      return renderMediaGallery(section, lang);
    case 'content_blocks':
      return renderUseCases(section, lang);
    case 'news':
      return renderNews(section, lang);
    case 'testimonials':
      return renderTestimonials(section, lang);
    case 'pricing':
      return renderPricing(section, lang);
    case 'comparison_table':
      return renderComparison(section, lang);
    case 'feature_accordeon':
      return renderFeatureAccordeon(section, lang);
    case 'faq':
      return renderFaq(section, lang);
    case 'cta':
      return renderCTA(section, lang, site);
    case 'footer':
      return renderFooter(section, lang, site);
    default:
      return buildSectionShell(section, lang);
  }
};

const extractStrings = (value, out = []) => {
  if (typeof value === 'string') {
    out.push(value);
    return out;
  }
  if (Array.isArray(value)) {
    value.forEach((item) => extractStrings(item, out));
    return out;
  }
  if (value && typeof value === 'object') {
    Object.values(value).forEach((item) => extractStrings(item, out));
  }
  return out;
};

const buildSearchIndex = (data, lang) => {
  const sectionToPages = new Map();
  data.site_blueprint.pages.forEach((page) => {
    page.layout.forEach((sectionId) => {
      if (!sectionToPages.has(sectionId)) sectionToPages.set(sectionId, new Set());
      sectionToPages.get(sectionId).add(page.id);
    });
  });

  const baseIndex = data.inventory.sections.flatMap((section) => {
    const content = section.content?.[lang];
    if (!content) return [];
    const strings = extractStrings(content);
    const text = strings.join(' ').replace(/\s+/g, ' ').trim();
    const title = content.title || content.eyebrow || section.id.replace(/_/g, ' ');
    const pages = Array.from(sectionToPages.get(section.id) || []);
    if (!pages.length) return [];
    return pages.map((pageId) => ({
      sectionId: section.id,
      pageId,
      title,
      text
    }));
  });

  const liveTerms = ['Workplace', 'Mitarbeiter-App', 'Communities', 'Vorstands-Blog', 'Newsletter'];
  const liveIndex = liveTerms.map((term) => ({
    sectionId: 'main',
    pageId: 'home',
    title: term,
    text: term
  }));

  return [...liveIndex, ...baseIndex];
};

const scoreEntry = (entry, tokens) => {
  const haystack = `${entry.title} ${entry.text}`.toLowerCase();
  let score = 0;
  tokens.forEach((token) => {
    const re = new RegExp(token, 'g');
    const matches = haystack.match(re);
    if (matches) score += matches.length * (entry.title.toLowerCase().includes(token) ? 3 : 1);
  });
  return score;
};

const buildSnippet = (text, token) => {
  const index = text.toLowerCase().indexOf(token);
  if (index === -1) return text.slice(0, 140) + '…';
  const start = Math.max(0, index - 40);
  const end = Math.min(text.length, index + 100);
  return (start > 0 ? '…' : '') + text.slice(start, end) + (end < text.length ? '…' : '');
};

const renderSearchResults = (container, results, lang, query) => {
  container.innerHTML = '';
  if (!query) return;
  if (!results.length) {
    const empty = createEl('div', 'nc-search__empty', lang === 'de' ? 'Keine Treffer' : 'No results');
    container.appendChild(empty);
    return;
  }

  results.forEach((item, idx) => {
    const link = createEl('a', 'nc-search__result');
    link.setAttribute('role', 'option');
    link.setAttribute('data-index', String(idx));
    link.href = `${getPageHref(item.pageId)}#${item.sectionId}`;
    const title = createEl('strong', 'nc-search__title', item.title);
    const snippet = createEl('span', 'nc-search__snippet', buildSnippet(item.text, query.toLowerCase()));
    link.append(title, snippet);
    container.appendChild(link);
  });
};

const setupSearch = (data, lang) => {
  const surfaces = Array.from(document.querySelectorAll('[data-search-surface="true"]'));
  if (!surfaces.length) return;
  const index = buildSearchIndex(data, lang);

  const updateCloseButton = (panel, input) => {
    const button = panel.querySelector('.nc-search-panel__close');
    if (!button) return;
    const hasValue = input.value.trim().length > 0;
    if (hasValue) {
      button.textContent = '↺';
      button.dataset.mode = 'reset';
      button.setAttribute('aria-label', lang === 'de' ? 'Suche zurücksetzen' : 'Reset search');
    } else {
      button.textContent = '×';
      button.dataset.mode = 'close';
      button.setAttribute('aria-label', lang === 'de' ? 'Suche schließen' : 'Close search');
    }
  };

  const initSurface = (panel) => {
    const input = panel.querySelector('input[type=\"search\"]');
    const results = panel.querySelector('.nc-search__results');
    if (!input || !results) return;

    const update = (value) => {
      const query = value.trim().toLowerCase();
      if (query.length < 3) {
        results.innerHTML = '';
        results.classList.remove('is-open');
        updateCloseButton(panel, input);
        return;
      }
      const tokens = query.split(/\s+/).filter(Boolean);
      const matches = index
        .map((entry) => ({ entry, score: scoreEntry(entry, tokens) }))
        .filter((item) => item.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 5)
        .map((item) => item.entry);

      renderSearchResults(results, matches, lang, query);
      results.classList.toggle('is-open', matches.length > 0);
      updateCloseButton(panel, input);
    };

    input.addEventListener('input', (event) => update(event.target.value));
    input.addEventListener('focus', (event) => update(event.target.value));
    updateCloseButton(panel, input);
  };

  surfaces.forEach(initSurface);
};

const buildJsonLd = (data, lang, pageId) => {
  const brand = data.site.brand;
  const pageName = pageId.replace(/_/g, ' ');
  const pageSlug = pageId === 'home' ? '' : pageId.replace(/_/g, '-');
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "name": brand.name[lang],
        "url": brand.domain,
        "email": brand.email,
        "telephone": brand.phone,
        "address": {
          "@type": "PostalAddress",
          "addressLocality": brand.location[lang]
        }
      },
      {
        "@type": "WebSite",
        "name": brand.name[lang],
        "url": brand.domain,
        "inLanguage": lang,
        "potentialAction": {
          "@type": "SearchAction",
          "target": `${brand.domain}/?q={search_term_string}`,
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "SoftwareApplication",
        "name": `${brand.name[lang]} Platform`,
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "Web",
        "description": lang === 'de'
          ? "Social Intranet und digitale Bildungsplattform mit AI-Integration."
          : "Social intranet and digital learning platform with AI integration.",
        "offers": {
          "@type": "Offer",
          "priceCurrency": "EUR",
          "price": "1200",
          "availability": "https://schema.org/InStock"
        }
      },
      {
        "@type": "WebPage",
        "name": `${brand.name[lang]} ${pageName}`,
        "url": pageSlug ? `${brand.domain}/${pageSlug}.html` : `${brand.domain}/`,
        "inLanguage": lang
      }
    ]
  };
};

const attachJsonLd = (data, lang, pageId) => {
  const existing = document.querySelector('script[data-jsonld="true"]');
  if (existing) existing.remove();
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.dataset.jsonld = 'true';
  script.textContent = JSON.stringify(buildJsonLd(data, lang, pageId));
  document.head.appendChild(script);
};

const setupLangToggle = (data) => {
  document.querySelectorAll('.nc-lang-toggle__button').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (btn.dataset.lang === state.lang) return;
      setLang(btn.dataset.lang);
      renderApp(data);
    });
  });
};

const setupSlider = () => {
  document.querySelectorAll('[data-slider]').forEach((slider) => {
    const track = slider.querySelector('.nc-slider__track');
    if (!track) return;
    const cards = Array.from(track.children);
    if (!cards.length) return;
    let index = 0;

    const update = () => {
      const offset = cards[index].offsetLeft;
      track.scrollTo({ left: offset, behavior: 'smooth' });
    };

    const move = (dir) => {
      if (dir === 'next') {
        index = (index + 1) % cards.length;
      } else {
        index = (index - 1 + cards.length) % cards.length;
      }
      update();
    };

    slider.querySelectorAll('[data-action]').forEach((btn) => {
      btn.addEventListener('click', () => move(btn.dataset.action));
    });

    slider.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        move('next');
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        move('prev');
      }
    });
  });
};

const setupMarquee = () => {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelectorAll('[data-marquee="true"]').forEach((marquee) => {
    const track = marquee.querySelector('.nc-marquee__track');
    if (!track) return;

    if (prefersReduced) {
      marquee.classList.add('is-static');
      track.style.transform = 'translateX(0)';
      return;
    }

    let offset = 0;
    let last = null;
    const speed = Number(marquee.dataset.speed) || 60;

    const step = (time) => {
      if (!last) last = time;
      const delta = (time - last) / 1000;
      last = time;
      const trackWidth = track.scrollWidth / 2;
      offset -= speed * delta;
      if (trackWidth > 0 && -offset >= trackWidth) {
        offset += trackWidth;
      }
      track.style.transform = `translateX(${offset}px)`;
      marquee._raf = requestAnimationFrame(step);
    };

    marquee._raf = requestAnimationFrame(step);
  });
};

const setupButtonMicroInteractions = () => {
  if (document.body.dataset.buttonMicroInit === 'true') return;
  document.body.dataset.buttonMicroInit = 'true';

  document.addEventListener('pointerdown', (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;

    const button = target.closest(
      '.nc-button--micro-a, .nc-button--micro-b, .nc-button--micro-c'
    );
    if (!button) return;
    if (button.matches(':disabled, [aria-disabled="true"], [data-loading="true"]')) return;

    const rect = button.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const size = Math.max(rect.width, rect.height) * 1.2;

    button.style.setProperty('--nc-ripple-x', `${x}px`);
    button.style.setProperty('--nc-ripple-y', `${y}px`);
    button.style.setProperty('--nc-ripple-size', `${size}px`);

    button.classList.remove('is-rippling');
    // Reflow forces animation restart for repeated clicks.
    void button.offsetWidth;
    button.classList.add('is-rippling');

    if (button._rippleTimeout) {
      clearTimeout(button._rippleTimeout);
    }

    button._rippleTimeout = setTimeout(() => {
      button.classList.remove('is-rippling');
    }, 560);
  });
};

// ---------------------------------------------------------------------------
// Theme Switcher
// ---------------------------------------------------------------------------

const applyTheme = (themeId) => {
  const validIds = THEMES.map((t) => t.id);
  if (!validIds.includes(themeId)) return;
  state.theme = themeId;
  localStorage.setItem(THEME_KEY, themeId);
  // Remove deprecated theme classes
  const deprecatedIds = ['light-base-theme', 'dark-base-theme', 'light-secondary-theme', 'dark-secondary-theme'];
  deprecatedIds.forEach((id) => document.body.classList.remove(id));
  // Remove all canonical theme classes, apply new one
  validIds.forEach((id) => document.body.classList.remove(id));
  document.body.classList.add(themeId);
  // Set data-theme on <html> for prefers-color-scheme opt-out
  const isDark = themeId.includes('dark');
  document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  // Update active state in modal if open
  document.querySelectorAll('.theme-switcher__option').forEach((btn) => {
    btn.classList.toggle('is-active', btn.dataset.theme === themeId);
  });
};

const createThemePreview = (theme) => {
  const preview = createEl('div', 'theme-switcher__preview');
  preview.style.backgroundColor = theme.bg;

  const header = createEl('div', 'theme-switcher__preview-header');
  header.style.backgroundColor = theme.bgSecondary;
  const dot = createEl('div', 'theme-switcher__preview-dot');
  dot.style.backgroundColor = theme.accent;
  const bar = createEl('div', 'theme-switcher__preview-bar');
  bar.style.backgroundColor = theme.text;
  header.append(dot, bar);

  const body = createEl('div', 'theme-switcher__preview-body');
  for (let i = 0; i < 3; i++) {
    const line = createEl('div', 'theme-switcher__preview-line');
    line.style.backgroundColor = theme.text;
    body.appendChild(line);
  }

  preview.append(header, body);
  return preview;
};

const setupThemeSwitcher = (lang) => {
  // Remove existing FAB + modal (e.g. on re-render)
  document.querySelector('.theme-switcher-fab')?.remove();
  document.querySelector('.theme-switcher-modal')?.remove();

  // FAB Button
  const fab = createEl('button', 'theme-switcher-fab');
  fab.type = 'button';
  fab.setAttribute('aria-label', lang === 'de' ? 'Theme wechseln' : 'Switch theme');
  fab.innerHTML = `
    <svg class="theme-switcher-fab__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="5"/>
      <line x1="12" y1="1" x2="12" y2="3"/>
      <line x1="12" y1="21" x2="12" y2="23"/>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="1" y1="12" x2="3" y2="12"/>
      <line x1="21" y1="12" x2="23" y2="12"/>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>
  `;

  // Modal Dialog
  const dialog = document.createElement('dialog');
  dialog.className = 'theme-switcher-modal';

  const headerEl = createEl('div', 'theme-switcher__header');
  const title = createEl('h2', 'theme-switcher__title', lang === 'de' ? 'Theme wählen' : 'Choose Theme');

  const closeBtn = createEl('button', 'theme-switcher__close');
  closeBtn.type = 'button';
  closeBtn.setAttribute('aria-label', lang === 'de' ? 'Schließen' : 'Close');
  closeBtn.innerHTML = `
    <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <line x1="18" y1="6" x2="6" y2="18"/>
      <line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  `;
  headerEl.append(title, closeBtn);

  const content = createEl('div', 'theme-switcher__content');
  const label = createEl('div', 'theme-switcher__label', lang === 'de' ? 'Verfügbare Themes' : 'Available Themes');
  const grid = createEl('div', 'theme-switcher__grid');

  THEMES.forEach((theme) => {
    const btn = createEl('button', 'theme-switcher__option');
    btn.type = 'button';
    btn.dataset.theme = theme.id;
    if (theme.id === state.theme) btn.classList.add('is-active');

    const preview = createThemePreview(theme);
    const optionLabel = createEl('span', 'theme-switcher__option-label', theme.label[lang]);
    btn.append(preview, optionLabel);

    btn.addEventListener('click', () => {
      applyTheme(theme.id);
    });

    grid.appendChild(btn);
  });

  content.append(label, grid);
  dialog.append(headerEl, content);

  // Events
  fab.addEventListener('click', () => {
    dialog.showModal();
  });

  closeBtn.addEventListener('click', () => {
    dialog.close();
  });

  dialog.addEventListener('click', (event) => {
    // Close on backdrop click
    if (event.target === dialog) {
      dialog.close();
    }
  });

  dialog.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      dialog.close();
    }
  });

  document.body.appendChild(fab);
  document.body.appendChild(dialog);
};

const renderApp = (data) => {
  const app = document.getElementById('app');
  app.innerHTML = '';
  document.documentElement.lang = state.lang;

  const page = data.site_blueprint.pages.find((p) => p.id === state.page) || data.site_blueprint.pages[0];
  const sectionMap = Object.fromEntries(data.inventory.sections.map((s) => [s.id, s]));

  const main = document.createElement('main');
  main.id = 'main';

  let header = null;
  let footer = null;

  page.layout.forEach((sectionId) => {
    const section = sectionMap[sectionId];
    if (!section) return;
    const element = renderSection(section, state.lang, data.site);
    if (section.type === 'navigation') {
      header = element;
    } else if (section.type === 'footer') {
      footer = element;
    } else {
      main.appendChild(element);
    }
  });

  if (header) app.appendChild(header);
  app.appendChild(main);
  if (footer) app.appendChild(footer);

  attachJsonLd(data, state.lang, page.id);
  setupLangToggle(data);
  setupSearch(data, state.lang);
  setupSlider();
  setupMarquee();
  setupButtonMicroInteractions();
  setupThemeSwitcher(state.lang);
  applyTheme(state.theme);
};

const init = async () => {
  const response = await fetch(DATA_URL);
  const data = await response.json();
  renderApp(applyHeroConfig(applyNavConfig(data)));
};

init().catch((error) => {
  const app = document.getElementById('app');
  if (app) {
    app.textContent = 'Fehler beim Laden der Inhalte.';
  }
  console.error(error);
});
