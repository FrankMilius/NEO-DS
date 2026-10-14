// ============================================================
// Gallery — Auto-generated from gallery-recipe.json
// Version: 1.2.1 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Organisms/Gallery',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**Gallery** v1.2.1 (stable)

Website-only: die Paddles tragen neben .nc-gallery__paddle die Haken .nc-gallery__paddle--prev/--next (Markup der Website, data-gallery-prev/-next) — kein CSS im DS.


`,
      },
    },
    status: { type: 'stable' },
  },
  argTypes: {},
};

export const Default = {
  name: 'Standard',
  render: () => `<div class="nc-gallery nc-gallery--lines nc-gallery--svh" id="nc-gal-23" data-autoplay="on" aria-label="Bild-Galerie" role="group" aria-roledescription="Karussell" data-neo-behavior="gallery">
<div class="nc-gallery__track" style="transform: translate3d(0%, 0px, 0px);" aria-live="off">
<div class="nc-gallery__slide is-active" role="tabpanel" aria-roledescription="Slide" aria-label="PIIPE Workplace" data-slide-theme="dark" id="nc-gal-23-slide-0">
<div class="nc-gallery__slide-bg">
<img src="https://picsum.photos/id/1076/2400/1350" alt="" loading="eager" decoding="async">
</div>
<div class="nc-gallery__slide-overlay">
</div>
<div class="nc-gallery__slide-stage">
<div class="nc-gallery__slide-content">
<span class="nc-gallery__slide-tag">SaaS Platform</span>
<h3 class="nc-gallery__slide-title">PIIPE Workplace</h3>
<p class="nc-gallery__slide-description">Die intelligente Arbeitsplatz-Plattform für moderne Teams.</p>
<div class="nc-gallery__slide-actions">
<a class="nc-button nc-button--primary nc-button--lg" href="/produkte/workplace" aria-label="Jetzt starten – PIIPE Workplace">Jetzt starten</a>
</div>
</div>
</div>
</div>
<div class="nc-gallery__slide" role="tabpanel" aria-roledescription="Slide" aria-label="Analytics Dashboard" aria-hidden="true" data-slide-theme="dark" id="nc-gal-23-slide-1" inert="">
<div class="nc-gallery__slide-bg">
<img src="https://picsum.photos/id/180/2400/1350" alt="" loading="lazy" decoding="async">
</div>
<div class="nc-gallery__slide-overlay">
</div>
<div class="nc-gallery__slide-stage">
<div class="nc-gallery__slide-content">
<span class="nc-gallery__slide-tag">Neu</span>
<h3 class="nc-gallery__slide-title">Analytics Dashboard</h3>
<p class="nc-gallery__slide-description">Echtzeit-Einblicke in Team-Performance und Projektfortschritt.</p>
<div class="nc-gallery__slide-actions">
<a class="nc-button nc-button--primary nc-button--lg" href="/produkte/analytics" aria-label="Dashboard entdecken – Analytics Dashboard">Dashboard entdecken</a>
</div>
</div>
</div>
</div>
<div class="nc-gallery__slide" role="tabpanel" aria-roledescription="Slide" aria-label="Enterprise Security" aria-hidden="true" data-slide-theme="dark" id="nc-gal-23-slide-2" inert="">
<div class="nc-gallery__slide-bg">
<img src="https://picsum.photos/id/1073/2400/1350" alt="" loading="lazy" decoding="async">
</div>
<div class="nc-gallery__slide-overlay">
</div>
<div class="nc-gallery__slide-stage">
<div class="nc-gallery__slide-content">
<span class="nc-gallery__slide-tag">Security</span>
<h3 class="nc-gallery__slide-title">Enterprise Security</h3>
<p class="nc-gallery__slide-description">ISO 27001 zertifiziert. Ende-zu-Ende-Verschlüsselung. DSGVO-konform.</p>
<div class="nc-gallery__slide-actions">
<a class="nc-button nc-button--primary nc-button--lg" href="/sicherheit" aria-label="Mehr erfahren – Enterprise Security">Mehr erfahren</a>
</div>
</div>
</div>
</div>
<div class="nc-gallery__slide" role="tabpanel" aria-roledescription="Slide" aria-label="200+ Integrationen" aria-hidden="true" data-slide-theme="dark" id="nc-gal-23-slide-3" inert="">
<div class="nc-gallery__slide-bg">
<img src="https://picsum.photos/id/119/2400/1350" alt="" loading="lazy" decoding="async">
</div>
<div class="nc-gallery__slide-overlay">
</div>
<div class="nc-gallery__slide-stage">
<div class="nc-gallery__slide-content">
<span class="nc-gallery__slide-tag">Apps</span>
<h3 class="nc-gallery__slide-title">200+ Integrationen</h3>
<p class="nc-gallery__slide-description">Nahtlose Verbindung zu Slack, Microsoft 365, Google Workspace und mehr.</p>
<div class="nc-gallery__slide-actions">
<a class="nc-button nc-button--primary nc-button--lg" href="/integrationen" aria-label="Alle Integrationen – 200+ Integrationen">Alle Integrationen</a>
</div>
</div>
</div>
</div>
<div class="nc-gallery__slide" role="tabpanel" aria-roledescription="Slide" aria-label="Für Teams jeder Größe" aria-hidden="true" data-slide-theme="dark" id="nc-gal-23-slide-4" inert="">
<div class="nc-gallery__slide-bg">
<img src="https://picsum.photos/id/1048/2400/1350" alt="" loading="lazy" decoding="async">
</div>
<div class="nc-gallery__slide-overlay">
</div>
<div class="nc-gallery__slide-stage">
<div class="nc-gallery__slide-content">
<span class="nc-gallery__slide-tag">Flexibel</span>
<h3 class="nc-gallery__slide-title">Für Teams jeder Größe</h3>
<p class="nc-gallery__slide-description">Vom Startup bis zum Konzern — ab 5 Nutzer kostenlos.</p>
<div class="nc-gallery__slide-actions">
<a class="nc-button nc-button--primary nc-button--lg" href="/preise" aria-label="Preise ansehen – Für Teams jeder Größe">Preise ansehen</a>
</div>
</div>
</div>
</div>
<div class="nc-gallery__slide" role="tabpanel" aria-roledescription="Slide" aria-label="KI-Assistent" aria-hidden="true" data-slide-theme="dark" id="nc-gal-23-slide-5" inert="">
<div class="nc-gallery__slide-bg">
<img src="https://picsum.photos/id/1069/2400/1350" alt="" loading="lazy" decoding="async">
</div>
<div class="nc-gallery__slide-overlay">
</div>
<div class="nc-gallery__slide-stage">
<div class="nc-gallery__slide-content">
<span class="nc-gallery__slide-tag">Beta</span>
<h3 class="nc-gallery__slide-title">KI-Assistent</h3>
<p class="nc-gallery__slide-description">Intelligente Vorschläge, automatische Zusammenfassungen und smarte Workflows.</p>
<div class="nc-gallery__slide-actions">
<a class="nc-button nc-button--primary nc-button--lg" href="/ki-assistent" aria-label="Beta testen – KI-Assistent">Beta testen</a>
</div>
</div>
</div>
</div>
</div>
<div class="nc-gallery__controls">
<button type="button" class="nc-gallery__paddle nc-gallery__paddle--prev" aria-label="Vorheriger Slide" data-gallery-prev="">
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
<path d="M15 6l-6 6 6 6">
</path>
</svg>
</button>
<button type="button" class="nc-gallery__paddle nc-gallery__paddle--next" aria-label="Naechster Slide" data-gallery-next="">
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
<path d="M9 6l6 6-6 6">
</path>
</svg>
</button>
</div>
<nav class="nc-gallery__nav" role="tablist" aria-label="Slide-Navigation">
<button type="button" class="nc-gallery__nav-dot is-active" role="tab" aria-selected="true" aria-label="PIIPE Workplace" data-index="0" id="nc-gal-23-tab-0" aria-controls="nc-gal-23-slide-0" tabindex="0">
</button>
<button type="button" class="nc-gallery__nav-dot" role="tab" aria-selected="false" aria-label="Analytics Dashboard" data-index="1" id="nc-gal-23-tab-1" aria-controls="nc-gal-23-slide-1" tabindex="-1">
</button>
<button type="button" class="nc-gallery__nav-dot" role="tab" aria-selected="false" aria-label="Enterprise Security" data-index="2" id="nc-gal-23-tab-2" aria-controls="nc-gal-23-slide-2" tabindex="-1">
</button>
<button type="button" class="nc-gallery__nav-dot" role="tab" aria-selected="false" aria-label="200+ Integrationen" data-index="3" id="nc-gal-23-tab-3" aria-controls="nc-gal-23-slide-3" tabindex="-1">
</button>
<button type="button" class="nc-gallery__nav-dot" role="tab" aria-selected="false" aria-label="Für Teams jeder Größe" data-index="4" id="nc-gal-23-tab-4" aria-controls="nc-gal-23-slide-4" tabindex="-1">
</button>
<button type="button" class="nc-gallery__nav-dot" role="tab" aria-selected="false" aria-label="KI-Assistent" data-index="5" id="nc-gal-23-tab-5" aria-controls="nc-gal-23-slide-5" tabindex="-1">
</button>
</nav>
<button type="button" class="nc-gallery__autoplay" aria-label="Galerie pausieren" data-playing="true" data-gallery-autoplay="">
<svg class="nc-gallery__autoplay-pause" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
<rect x="6" y="4" width="4" height="16" rx="1">
</rect>
<rect x="14" y="4" width="4" height="16" rx="1">
</rect>
</svg>
<svg class="nc-gallery__autoplay-play" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
<polygon points="6,4 20,12 6,20">
</polygon>
</svg>
</button>
</div>`,
};
