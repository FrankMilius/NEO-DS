<template>
  <aside class="laboratory-panel" :style="{ width: panelWidth + 'px', minWidth: panelWidth + 'px' }">
    <!-- Resize handle -->
    <div class="resize-handle" @mousedown="startResize"></div>

    <div class="lab-header">
      <h3 class="lab-title">Theme Arena</h3>
      <div class="theme-toggle" role="radiogroup" aria-label="Theme mode">
        <button
          :class="['toggle-btn', { active: store.state.previewMode === 'light' }]"
          @click="store.setPreviewMode('light')"
          aria-label="Light mode"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="M4.93 4.93l1.41 1.41"/><path d="M17.66 17.66l1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="M6.34 17.66l-1.41 1.41"/><path d="M19.07 4.93l-1.41 1.41"/>
          </svg>
          Light
        </button>
        <button
          :class="['toggle-btn', { active: store.state.previewMode === 'dark' }]"
          @click="store.setPreviewMode('dark')"
          aria-label="Dark mode"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
          </svg>
          Dark
        </button>
      </div>
    </div>

    <div class="lab-viewport" :style="viewportStyle" :class="viewportClass">

      <!-- ═══════════════════════════════════════════════════════════════
           TYPOGRAPHY SHOWCASE (when editing Typography section)
           ═══════════════════════════════════════════════════════════════ -->
      <template v-if="isTypographySection">

        <!-- Hero / Display Heading -->
        <section class="preview-section">
          <span class="preview-label">Display / Hero</span>
          <div class="typo-hero" :style="headingFont">
            <span class="typo-display" :style="{ color: t['text-primary'] }">PIIPE Workplace</span>
            <span class="typo-subtitle" :style="{ color: t['text-secondary'] }">Ein digitaler Arbeitsplatz der alle begeistert</span>
          </div>
        </section>

        <!-- Headings h1–h6 -->
        <section class="preview-section">
          <span class="preview-label">Headings</span>
          <div class="typo-headings" :style="headingFont">
            <h1 class="typo-h1" :style="{ color: t['text-primary'] }">h1 — Menschlich gedacht, digital gemacht</h1>
            <h2 class="typo-h2" :style="{ color: t['text-primary'] }">h2 — Kommunikation &amp; Zusammenarbeit</h2>
            <h3 class="typo-h3" :style="{ color: t['text-primary'] }">h3 — Produktivität steigern von überall</h3>
            <h4 class="typo-h4" :style="{ color: t['text-primary'] }">h4 — Mitarbeitende vernetzen</h4>
            <h5 class="typo-h5" :style="{ color: t['text-secondary'] }">h5 — Personalisierte News &amp; Informationen</h5>
            <h6 class="typo-h6" :style="{ color: t['text-secondary'] }">h6 — Integrierte Business Anwendungen</h6>
          </div>
        </section>

        <!-- Body / Paragraph -->
        <section class="preview-section">
          <span class="preview-label">Body Text</span>
          <div class="typo-body" :style="bodyFont">
            <p class="typo-lead" :style="{ color: t['text-primary'] }">
              Unsere Intranet-Plattform und App PIIPE Workplace vernetzt
              Mitarbeitende mit modernster Technologie. Sie ermöglicht
              effiziente Kommunikation, Zusammenarbeit und schnellen
              Zugang zu relevanten Informationen.
            </p>
            <p class="typo-paragraph" :style="{ color: t['text-secondary'] }">
              PIIPE Workplace bietet personalisierte News, Informationen,
              Wissen und Zugang zu integrierten Business Anwendungen wie
              Office 365, Sharepoint, Teams und weitere Systeme. Ready-to-Run
              und anpassbar an spezifische Prozesse eures Unternehmens.
            </p>
            <p class="typo-small" :style="{ color: t['text-tertiary'] }">
              © 2026 NEOCOSMO GmbH · Impressum · Datenschutz · Alle Rechte vorbehalten.
            </p>
          </div>
        </section>

        <!-- Links -->
        <section class="preview-section">
          <span class="preview-label">Links</span>
          <div class="typo-links" :style="bodyFont">
            <a class="typo-link" :style="{ color: t['text-link'] }">Demo anfordern →</a>
            <a class="typo-link-hover" :style="{ color: t['text-link-hover'] }">Produkte entdecken (hover)</a>
            <a class="typo-link-visited" :style="{ color: t['interactive-visited'] || t['text-link'] }">Kunden &amp; Erfolgsgeschichten (visited)</a>
          </div>
        </section>

        <!-- Text Colors -->
        <section class="preview-section">
          <span class="preview-label">Text Colors</span>
          <div class="typo-colors" :style="bodyFont">
            <div class="color-row">
              <span class="color-dot" :style="{ background: t['text-primary'] }"></span>
              <span :style="{ color: t['text-primary'] }">Primary — Haupttext &amp; Überschriften</span>
            </div>
            <div class="color-row">
              <span class="color-dot" :style="{ background: t['text-secondary'] }"></span>
              <span :style="{ color: t['text-secondary'] }">Secondary — Beschreibungen &amp; Untertitel</span>
            </div>
            <div class="color-row">
              <span class="color-dot" :style="{ background: t['text-tertiary'] }"></span>
              <span :style="{ color: t['text-tertiary'] }">Tertiary — Ergänzende Hinweise</span>
            </div>
            <div class="color-row">
              <span class="color-dot" :style="{ background: t['text-disabled'] }"></span>
              <span :style="{ color: t['text-disabled'] }">Disabled — Inaktive Elemente</span>
            </div>
            <div class="color-row">
              <span class="color-dot" :style="{ background: t['text-inverse'] }"></span>
              <span class="color-row-inverse" :style="{ color: t['text-inverse'], background: t['text-primary'] }">Inverse — Auf dunklem Hintergrund</span>
            </div>
            <div class="color-row">
              <span class="color-dot" :style="{ background: t['text-success'] }"></span>
              <span :style="{ color: t['text-success'] }">Success — Erfolgsmeldungen</span>
            </div>
            <div class="color-row">
              <span class="color-dot" :style="{ background: t['text-danger'] }"></span>
              <span :style="{ color: t['text-danger'] }">Danger — Fehlermeldungen</span>
            </div>
          </div>
        </section>

        <!-- Font Weights -->
        <section class="preview-section">
          <span class="preview-label">Font Weights</span>
          <div class="typo-weights" :style="bodyFont">
            <span class="weight-row" :style="{ fontWeight: 300, color: t['text-primary'] }"><em class="w-num">300</em> Light — Zugang zu relevanten Informationen</span>
            <span class="weight-row" :style="{ fontWeight: 400, color: t['text-primary'] }"><em class="w-num">400</em> Regular — Kommunikation und Zusammenarbeit</span>
            <span class="weight-row" :style="{ fontWeight: 500, color: t['text-primary'] }"><em class="w-num">500</em> Medium — Personalisierte News und Wissen</span>
            <span class="weight-row" :style="{ fontWeight: 600, color: t['text-primary'] }"><em class="w-num">600</em> Semibold — Digital Workplace für alle</span>
            <span class="weight-row" :style="{ fontWeight: 700, color: t['text-primary'] }"><em class="w-num">700</em> Bold — Made for people, made by people</span>
            <span class="weight-row" :style="{ fontWeight: 900, color: t['text-primary'] }"><em class="w-num">900</em> Black — NEOCOSMO</span>
          </div>
        </section>

        <!-- Type Scale -->
        <section class="preview-section">
          <span class="preview-label">Type Scale</span>
          <div class="typo-scale" :style="bodyFont">
            <div class="scale-row" v-for="s in typeSizes" :key="s.name">
              <span class="scale-label" :style="{ color: t['text-tertiary'] }">{{ s.name }}</span>
              <span :style="{ fontSize: s.px + 'px', color: t['text-primary'] }">Entdecke wie wir Herausforderungen in Erfolge verwandelt haben</span>
              <span class="scale-px" :style="{ color: t['text-tertiary'] }">{{ s.px }}px</span>
            </div>
          </div>
        </section>

        <!-- Monospace / Code -->
        <section class="preview-section">
          <span class="preview-label">Monospace / Code</span>
          <div class="typo-code-block" :style="{ background: t['layer-01'], borderColor: t['border-secondary'] }">
            <pre class="typo-pre" :style="monoFont"><code :style="{ color: t['text-primary'] }">--fnd-font-body:    {{ currentBodyFont }};
--fnd-font-heading: {{ currentHeadingFont }};
--fnd-font-mono:    {{ currentMonoFont }};
--fnd-font-weight-regular: 400;
--fnd-font-weight-bold:    700;</code></pre>
          </div>
        </section>

        <!-- Card with Typography (real-world layout) -->
        <section class="preview-section">
          <span class="preview-label">Card Layout</span>
          <div class="typo-card" :style="{ background: t['layer-01'], borderColor: t['border-secondary'] }">
            <span class="typo-card-badge" :style="{ background: t['interactive-default'], color: t['text-on-interactive'] }">Neu</span>
            <h3 class="typo-card-title" :style="{ ...headingFont, color: t['text-primary'] }">Festo modernisiert WeNet und PeopleNet</h3>
            <p class="typo-card-desc" :style="{ ...bodyFont, color: t['text-secondary'] }">
              Mit PIIPE Workplace setzt Festo neue Maßstäbe für die interne Kommunikation und vernetzt
              Tausende Mitarbeitende weltweit auf einer modernen Plattform.
            </p>
            <div class="typo-card-meta" :style="{ color: t['text-tertiary'] }">
              <span :style="bodyFont">18. Februar 2026</span>
              <span :style="bodyFont">·</span>
              <span :style="bodyFont">Customer Success</span>
            </div>
            <a class="typo-card-link" :style="{ color: t['text-link'], ...bodyFont }">Erfolgsgeschichte lesen →</a>
          </div>
        </section>

        <!-- Inline Text Treatments -->
        <section class="preview-section">
          <span class="preview-label">Inline Elements</span>
          <div class="typo-inline" :style="bodyFont">
            <p :style="{ color: t['text-primary'] }">
              Unsere <strong>Intranet-Plattform</strong> bietet <em>personalisierte</em> Zugänge
              und nutzt <code :style="{ ...monoFont, background: t['layer-01'], color: t['text-primary'] }">API-Schnittstellen</code>
              zur Integration. <mark :style="{ background: t['feedback-warning'] + '40', color: t['text-primary'] }">Wichtige Hinweise</mark>
              werden hervorgehoben. Mehr unter
              <a :style="{ color: t['text-link'] }">neocosmo.de</a>.
            </p>
          </div>
        </section>

        <!-- Lists -->
        <section class="preview-section">
          <span class="preview-label">Lists</span>
          <div class="typo-lists" :style="bodyFont">
            <ul class="typo-ul" :style="{ color: t['text-primary'] }">
              <li>Einführungsberatung für euer Unternehmen</li>
              <li>Technischer Support und Schulungen</li>
              <li>Customer Success Management</li>
            </ul>
            <ol class="typo-ol" :style="{ color: t['text-secondary'] }">
              <li>PIIPE Intranet — New Work</li>
              <li>PIIPE App — New Communication</li>
              <li>PIIPE Magazin — New Connection</li>
            </ol>
          </div>
        </section>

        <!-- Blockquote -->
        <section class="preview-section">
          <span class="preview-label">Blockquote</span>
          <blockquote class="typo-blockquote" :style="{ borderColor: t['interactive-default'] }">
            <p :style="{ ...bodyFont, color: t['text-primary'] }">
              „Made for people, made by people. Entdecke, wie wir
              Herausforderungen in Erfolge verwandelt haben — durch
              Kreativität und Teamwork."
            </p>
            <cite :style="{ color: t['text-tertiary'] }">— NEOCOSMO Team</cite>
          </blockquote>
        </section>

        <!-- Feedback Text -->
        <section class="preview-section">
          <span class="preview-label">Feedback Messages</span>
          <div class="typo-feedback">
            <div class="fb-msg" :style="{ background: t['feedback-info'] + '18', borderLeftColor: t['feedback-info'] }">
              <span class="fb-title" :style="{ color: t['feedback-info'] }">Info</span>
              <span :style="{ ...bodyFont, color: t['text-primary'] }">Du möchtest eine unverbindliche Demo oder einen Testzugang?</span>
            </div>
            <div class="fb-msg" :style="{ background: t['feedback-success'] + '18', borderLeftColor: t['feedback-success'] }">
              <span class="fb-title" :style="{ color: t['feedback-success'] }">Erfolg</span>
              <span :style="{ ...bodyFont, color: t['text-primary'] }">Dein Zugang wurde erfolgreich eingerichtet.</span>
            </div>
            <div class="fb-msg" :style="{ background: t['feedback-warning'] + '18', borderLeftColor: t['feedback-warning'] }">
              <span class="fb-title" :style="{ color: t['feedback-warning'] }">Hinweis</span>
              <span :style="{ ...bodyFont, color: t['text-primary'] }">Bitte aktualisiere dein Profil für optimale Ergebnisse.</span>
            </div>
            <div class="fb-msg" :style="{ background: t['feedback-danger'] + '18', borderLeftColor: t['feedback-danger'] }">
              <span class="fb-title" :style="{ color: t['feedback-danger'] }">Fehler</span>
              <span :style="{ ...bodyFont, color: t['text-primary'] }">Die Verbindung zum Server konnte nicht hergestellt werden.</span>
            </div>
          </div>
        </section>

        <!-- Button Labels -->
        <section class="preview-section">
          <span class="preview-label">Buttons &amp; Labels</span>
          <div class="preview-row wrap">
            <button class="prev-btn primary" :style="{ ...btnPrimary, ...bodyFont }">Demo anfordern</button>
            <button class="prev-btn secondary" :style="{ ...btnSecondary, ...bodyFont }">Mehr erfahren</button>
            <button class="prev-btn ghost" :style="{ ...btnGhost, ...bodyFont }">Abbrechen</button>
          </div>
          <div class="preview-row wrap">
            <span class="prev-badge" :style="badgeDefault">50+ Kunden</span>
            <span class="prev-badge" :style="badgeSuccess">Aktiv</span>
            <span class="prev-badge" :style="badgeError">Offline</span>
            <span class="prev-badge" :style="badgeInfo">Neu</span>
          </div>
        </section>

        <!-- Input Labels -->
        <section class="preview-section">
          <span class="preview-label">Form Elements</span>
          <div class="typo-form" :style="bodyFont">
            <div class="form-field">
              <label class="form-label" :style="{ color: t['text-primary'] }">Unternehmensname</label>
              <input class="prev-input" :style="inputStyle" placeholder="z.B. NEOCOSMO GmbH" />
              <span class="form-hint" :style="{ color: t['text-tertiary'] }">Name des Unternehmens für die Registrierung</span>
            </div>
            <div class="form-field">
              <label class="form-label" :style="{ color: t['text-primary'] }">E-Mail-Adresse</label>
              <input class="prev-input error" :style="inputErrorStyle" value="ungueltig@" />
              <span class="form-error" :style="{ color: t['text-danger'] }">Bitte gib eine gültige E-Mail-Adresse ein</span>
            </div>
          </div>
        </section>

      </template>

      <!-- ═══════════════════════════════════════════════════════════════
           DEFAULT ARENA — Theme Preview Magazine (Magazin-Stil)
           ═══════════════════════════════════════════════════════════════ -->
      <template v-else>

        <div class="mag" :style="{ color: t['text-primary'], fontFamily: currentBodyFont, '--mag-heading-font': currentHeadingFont, '--mag-mono-font': currentMonoFont }">

          <!-- ─── SKIP LINK ─── -->
          <a class="mag-skip" href="#mag-content" @click.prevent="scrollToRef('mag-content')"
             :style="{ background: t['interactive-default'], color: t['text-on-interactive'] }">Zum Inhalt springen</a>

          <!-- ─── MASTER HEADER ─── -->
          <header class="mag-header" role="banner" aria-label="Magazin Master-Referenz"
                  :style="{ borderBottomColor: t['border-primary'] }">
            <div class="mag-brand-bar">
              <a href="#" @click.prevent="scrollToTop" :style="{ color: t['text-primary'] }" aria-label="Startseite">
                <strong>THEME PREVIEW MAG</strong>
              </a>
              <nav aria-label="Schnellnavigation">
                <ul class="mag-quicknav">
                  <li><a :style="{ color: t['text-link'] }" href="#mag-views" @click.prevent="scrollToRef('mag-views')">Ansichten</a></li>
                  <li><a :style="{ color: t['text-link'] }" href="#mag-tokens" @click.prevent="scrollToRef('mag-tokens')">UI-Übersicht</a></li>
                  <li><a :style="{ color: t['text-link'] }" href="#mag-forms" @click.prevent="scrollToRef('mag-forms')">Forms</a></li>
                  <li><a :style="{ color: t['text-link'] }" href="#mag-data" @click.prevent="scrollToRef('mag-data')">Data</a></li>
                  <li><a :style="{ color: t['text-link'] }" href="#mag-media" @click.prevent="scrollToRef('mag-media')">Media</a></li>
                </ul>
              </nav>
            </div>

            <!-- VIEW SWITCHER -->
            <section id="mag-views" class="mag-view-switcher" aria-label="Ansichten umschalten">
              <h1 class="mag-main-title" :style="{ color: t['text-primary'] }">Master-Referenzseite (Magazin-Stil)</h1>
              <p class="mag-muted" :style="{ color: t['text-secondary'] }">
                Drei Layout-Varianten als Tabs: <strong :style="{ color: t['text-primary'] }">Feature Story</strong>,
                <strong :style="{ color: t['text-primary'] }">Newsroom</strong>,
                <strong :style="{ color: t['text-primary'] }">Longform</strong>.
                Nutze diese Seite, um Typografie, Farben, States, Spacing, Cards, Tabellen und Form-Komponenten live zu prüfen.
              </p>
              <div class="mag-tabs" role="tablist" aria-label="Ansicht wählen">
                <button v-for="tab in magTabs" :key="tab.id"
                        role="tab"
                        :aria-selected="activeView === tab.id"
                        :class="['mag-tab', { active: activeView === tab.id }]"
                        :style="activeView === tab.id
                          ? { background: t['interactive-default'], color: t['text-on-interactive'], borderColor: t['interactive-default'] }
                          : { background: 'transparent', color: t['text-primary'], borderColor: t['border-primary'] }"
                        @click="activeView = tab.id">{{ tab.label }}</button>
              </div>
              <p class="mag-muted mag-hint" :style="{ color: t['text-tertiary'] }">
                <small>Tipp: Tab/Shift+Tab testen, Fokus-Stile überprüfen.</small>
              </p>
            </section>
          </header>

          <!-- ─── MAIN ─── -->
          <main id="mag-content" role="main" aria-label="Inhalt">

            <!-- ═══ PANEL 1 — FEATURE STORY ═══ -->
            <section v-show="activeView === 'feature'" aria-label="Feature Story Ansicht" class="mag-panel">
              <article aria-labelledby="feature-title">
                <!-- Hero -->
                <header class="mag-hero">
                  <figure class="mag-hero-figure">
                    <img src="https://picsum.photos/1400/700?random=201"
                         alt="Hero-Foto: Sonnenlicht fällt durch große Fenster auf einen langen Holztisch, darauf Skizzen und ein Laptop."
                         class="mag-hero-img" :style="{ borderColor: t['border-secondary'] }" loading="lazy" />
                    <figcaption :style="{ color: t['text-tertiary'] }">Reportage · Design, Produkt &amp; Kultur</figcaption>
                  </figure>
                  <div class="mag-hero-content">
                    <p class="mag-kicker" :style="{ color: t['interactive-default'] }">Titelstory</p>
                    <h2 id="feature-title" class="mag-hero-title" :style="{ color: t['text-primary'] }">Wie moderne Design-Systeme Marken spürbar machen</h2>
                    <p class="mag-subheadline" :style="{ color: t['text-secondary'] }">
                      Zwischen Token, Typografie und Microinteractions: Warum sich gute Interfaces eher wie Magazine anfühlen – und weniger wie Maschinen.
                    </p>
                    <div class="mag-meta-row" :style="{ color: t['text-tertiary'] }">
                      <time datetime="2026-02-19">19. Februar 2026</time>
                      <span aria-hidden="true">·</span>
                      <span>7 Min. Lesezeit</span>
                    </div>
                    <div class="mag-author">
                      <img src="https://i.pravatar.cc/96?img=12" alt="Porträtfoto der Autorin" width="40" height="40"
                           class="mag-avatar" :style="{ borderColor: t['border-secondary'] }" />
                      <div>
                        <p :style="{ color: t['text-primary'] }"><strong>Lea Sommer</strong></p>
                        <p class="mag-muted" :style="{ color: t['text-tertiary'] }">Redaktion · Produktdesign</p>
                      </div>
                      <div class="mag-author-actions">
                        <button type="button" class="mag-btn-sm" :style="magBtnPrimary">Folgen</button>
                        <a href="#mag-comments" @click.prevent="scrollToRef('mag-comments')" :style="{ color: t['text-link'] }">Diskussion</a>
                      </div>
                    </div>
                  </div>
                </header>

                <!-- Two-Column: Article + Sidebar -->
                <section class="mag-two-col" aria-label="Artikel und Sidebar">
                  <div class="mag-article-body">
                    <p :style="{ color: t['text-primary'] }">
                      Magazine leben von Rhythmus: Überschriften, Bilder, Zitate, Zwischenrufe. Genau diesen Rhythmus können Themes testen –
                      von Kontrast über Spacing bis hin zu Link- und Button-Zuständen. Der folgende Text ist bewusst „redaktionell" geschrieben,
                      damit du Typografie, Zeilenlängen und Leseführung realistisch bewerten kannst.
                    </p>
                    <h3 :style="{ color: t['text-primary'] }">Ein Interface ist eine Bühne</h3>
                    <p :style="{ color: t['text-primary'] }">
                      Wenn Abstände zu eng sind, wirkt alles hektisch. Wenn Farben zu laut sind, ermüdet der Blick.
                      Wenn Fokus-Zustände fehlen, verlieren Menschen mit Tastatur-Navigation den Faden.
                    </p>
                    <blockquote class="mag-blockquote" :style="{ borderLeftColor: t['interactive-default'], background: t['layer-01'] }">
                      <p :style="{ color: t['text-primary'] }">„Gutes UI ist nicht nur sichtbar, sondern fühlbar – wie eine Zeitung, die man gerne aufschlägt."</p>
                      <footer :style="{ color: t['text-tertiary'] }">— Aus einem Redaktionsgespräch</footer>
                    </blockquote>
                    <h4 :style="{ color: t['text-primary'] }">Kleine Elemente, große Wirkung</h4>
                    <ul :style="{ color: t['text-primary'] }">
                      <li><strong>Links</strong> müssen als Links erkennbar sein – auch ohne Farbe.</li>
                      <li><strong>Buttons</strong> brauchen klare States: default, hover, active, disabled.</li>
                      <li><strong>Formulare</strong> sollten freundlich erklären, nicht bestrafen.</li>
                    </ul>
                    <p :style="{ color: t['text-primary'] }">
                      Inline-Code: <code class="mag-code" :style="{ background: t['layer-01'], color: t['text-primary'] }">--color-text</code>,
                      <code class="mag-code" :style="{ background: t['layer-01'], color: t['text-primary'] }">--radius-md</code>.
                      Ein <q :style="{ color: t['text-secondary'] }">kurzer Zwischenruf</q> für Quote-Styling.
                      Und ein Link: <a href="#mag-tokens" @click.prevent="scrollToRef('mag-tokens')" :style="{ color: t['text-link'] }">UI-Übersicht ansehen</a>.
                    </p>
                    <aside class="mag-callout" :style="{ background: t['layer-01'], borderLeftColor: t['interactive-default'] }">
                      <h4 :style="{ color: t['text-primary'] }">Redaktionsnotiz</h4>
                      <p :style="{ color: t['text-secondary'] }">
                        Nutze diese Seite für Theme-Checks: Headings, Body, Links, Buttons, Cards, Tabellen, Form-States, Medien und Captions.
                      </p>
                    </aside>
                    <!-- Mini Cards -->
                    <section aria-label="Mini Cards">
                      <h3 :style="{ color: t['text-primary'] }">Mini-Cards</h3>
                      <div class="mag-card-grid" role="list">
                        <article class="mag-card" role="listitem" :style="{ background: t['layer-01'], borderColor: t['border-secondary'] }">
                          <h4 :style="{ color: t['text-primary'] }">Highlight</h4>
                          <p :style="{ color: t['text-secondary'] }">Kurzer Teasertext, um Body, Links und Spacing zu testen.</p>
                          <p><a href="#" :style="{ color: t['text-link'] }">Mehr lesen</a></p>
                        </article>
                        <article class="mag-card" role="listitem" :style="{ background: t['layer-01'], borderColor: t['border-secondary'] }">
                          <h4 :style="{ color: t['text-primary'] }">Zitat des Tages</h4>
                          <p class="mag-muted" :style="{ color: t['text-tertiary'] }">„Details sind nicht Deko, sondern Dramaturgie."</p>
                          <button type="button" class="mag-btn-sm" :style="magBtnSecondary">Speichern</button>
                        </article>
                        <article class="mag-card" role="listitem" :style="{ background: t['layer-01'], borderColor: t['border-secondary'] }">
                          <h4 :style="{ color: t['text-primary'] }">Status</h4>
                          <p :style="{ color: t['text-primary'] }">Theme-Update: <strong>aktiv</strong></p>
                          <p :style="{ color: t['text-tertiary'] }"><small>Letzte Änderung: <time datetime="2026-02-19T08:10">08:10</time></small></p>
                        </article>
                      </div>
                    </section>
                  </div>

                  <!-- SIDEBAR -->
                  <aside class="mag-sidebar" :style="{ borderLeftColor: t['border-secondary'] }">
                    <section>
                      <h3 :style="{ color: t['text-primary'] }">Trending</h3>
                      <ol :style="{ color: t['text-primary'] }">
                        <li><a href="#" :style="{ color: t['text-link'] }">Microinteractions: Warum 120ms oft „richtig" wirken</a></li>
                        <li><a href="#" :style="{ color: t['text-link'] }">Dark Mode: Das Geheimnis liegt in den Kontrasten</a></li>
                        <li><a href="#" :style="{ color: t['text-link'] }">Editorial Cards: Lesefluss statt Kachelwand</a></li>
                      </ol>
                    </section>
                    <section>
                      <h3 :style="{ color: t['text-primary'] }">Tags</h3>
                      <p class="mag-tag-row">
                        <a v-for="tag in ['Design','UX','Accessibility','Systems']" :key="tag" href="#"
                           class="mag-tag" :style="{ background: t['background-secondary'], color: t['text-primary'] }">#{{ tag }}</a>
                      </p>
                    </section>
                    <section>
                      <h3 :style="{ color: t['text-primary'] }">Kurz-KPIs</h3>
                      <dl class="mag-kpi">
                        <div :style="{ borderBottomColor: t['border-secondary'] }"><dt :style="{ color: t['text-secondary'] }">Ø Lesezeit</dt><dd :style="{ color: t['text-primary'] }">6:48</dd></div>
                        <div :style="{ borderBottomColor: t['border-secondary'] }"><dt :style="{ color: t['text-secondary'] }">Returning</dt><dd :style="{ color: t['text-primary'] }">41%</dd></div>
                        <div><dt :style="{ color: t['text-secondary'] }">Opt-In</dt><dd :style="{ color: t['interactive-default'] }">+4,9%</dd></div>
                      </dl>
                    </section>
                  </aside>
                </section>
              </article>
            </section>

            <!-- ═══ PANEL 2 — NEWSROOM ═══ -->
            <section v-show="activeView === 'newsroom'" aria-label="Newsroom Ansicht" class="mag-panel">
              <!-- Top Story -->
              <article aria-labelledby="newsroom-title" class="mag-top-story">
                <figure class="mag-hero-figure">
                  <img src="https://picsum.photos/1400/650?random=202"
                       alt="Foto: Redaktionsteam in einem hellen Raum, Notizen an einer Glaswand."
                       class="mag-hero-img" :style="{ borderColor: t['border-secondary'] }" loading="lazy" />
                  <figcaption :style="{ color: t['text-tertiary'] }">Top Story · Produkt &amp; Technik</figcaption>
                </figure>
                <header class="mag-top-story-header">
                  <h2 id="newsroom-title" class="mag-hero-title" :style="{ color: t['text-primary'] }">Der neue Standard: Themes, die sich wie Marken verhalten</h2>
                  <p class="mag-subheadline" :style="{ color: t['text-secondary'] }">
                    Eine Startseite ist das beste Testfeld für Typografie, Cards, Buttons, Links, Badges, Tabellen und Interaktions-States.
                  </p>
                  <div class="mag-byline">
                    <img src="https://i.pravatar.cc/80?img=7" alt="Avatar des Autors" width="36" height="36"
                         class="mag-avatar" :style="{ borderColor: t['border-secondary'] }" />
                    <div>
                      <p :style="{ color: t['text-primary'] }"><strong>Jonas Richter</strong> <span class="mag-muted" :style="{ color: t['text-tertiary'] }">· Redaktion</span></p>
                      <p class="mag-muted" :style="{ color: t['text-tertiary'] }"><time datetime="2026-02-19">19. Feb 2026</time> · 5 Min</p>
                    </div>
                  </div>
                  <p class="mag-meta-links">
                    <a href="#mag-data" @click.prevent="scrollToRef('mag-data')" :style="{ color: t['text-link'] }">Zu den Kennzahlen</a> ·
                    <a href="#mag-forms" @click.prevent="scrollToRef('mag-forms')" :style="{ color: t['text-link'] }">Zum Formularbereich</a>
                  </p>
                </header>
              </article>

              <!-- Feed -->
              <section aria-label="Artikel Feed">
                <header class="mag-section-header">
                  <h3 :style="{ color: t['text-primary'] }">Neu</h3>
                  <p class="mag-muted" :style="{ color: t['text-secondary'] }">Feed mit Cards, Teasern, Meta, Badges und Bildern.</p>
                </header>
                <div class="mag-feed" role="list">
                  <article v-for="item in feedItems" :key="item.id" role="listitem" class="mag-feed-card"
                           :style="{ borderBottomColor: t['border-secondary'] }">
                    <img :src="item.img" :alt="item.imgAlt" class="mag-feed-img" :style="{ borderColor: t['border-secondary'] }" loading="lazy" />
                    <div>
                      <p class="mag-kicker" :style="{ color: t['interactive-default'] }">{{ item.kicker }}</p>
                      <h4><a href="#" :style="{ color: t['text-primary'] }">{{ item.title }}</a></h4>
                      <p :style="{ color: t['text-secondary'] }">{{ item.desc }}</p>
                      <p class="mag-feed-meta" :style="{ color: t['text-tertiary'] }">
                        <time :datetime="item.date">{{ item.dateLabel }}</time> ·
                        <span v-if="item.series">{{ item.series }} · </span>
                        <span v-for="tag in item.tags" :key="tag" class="mag-badge"
                              :style="{ background: t['background-secondary'], color: t['text-primary'] }">{{ tag }}</span>
                      </p>
                    </div>
                  </article>
                </div>
                <nav aria-label="Feed Pagination" class="mag-pagination"
                     :style="{ borderTopColor: t['border-secondary'] }">
                  <a href="#" :style="{ color: t['text-link'] }">← Zurück</a>
                  <span :style="{ color: t['text-secondary'] }">Seite <strong :style="{ color: t['text-primary'] }">1</strong> / 5</span>
                  <a href="#" :style="{ color: t['text-link'] }">Weiter →</a>
                </nav>
              </section>
            </section>

            <!-- ═══ PANEL 3 — LONGFORM ═══ -->
            <section v-show="activeView === 'longform'" aria-label="Longform Ansicht" class="mag-panel">
              <article aria-labelledby="longform-title">
                <!-- Immersive Hero -->
                <header class="mag-hero mag-immersive">
                  <figure class="mag-hero-figure">
                    <img src="https://picsum.photos/1500/800?random=203"
                         alt="Hero-Foto: Nahaufnahme eines gedruckten Magazins, warmes Licht, hochwertige Papierstruktur."
                         class="mag-hero-img" :style="{ borderColor: t['border-secondary'] }" loading="lazy" />
                    <figcaption :style="{ color: t['text-tertiary'] }">Longform · Gestaltung &amp; Kultur</figcaption>
                  </figure>
                  <div class="mag-hero-content">
                    <p class="mag-kicker" :style="{ color: t['interactive-default'] }">Longform Report</p>
                    <h2 id="longform-title" class="mag-hero-title" :style="{ color: t['text-primary'] }">Die Rückkehr des Editorial Designs im Digitalen</h2>
                    <p class="mag-subheadline" :style="{ color: t['text-secondary'] }">
                      Layout, Typografie und Rhythmus werden wieder wichtiger – und Themes liefern die Bühne.
                    </p>
                    <div class="mag-meta-row" :style="{ color: t['text-tertiary'] }">
                      <time datetime="2026-02-19">19. Februar 2026</time>
                      <span aria-hidden="true">·</span>
                      <span>10 Min Lesezeit</span>
                    </div>
                    <div class="mag-author">
                      <img src="https://i.pravatar.cc/96?img=32" alt="Avatar: Autor" width="40" height="40"
                           class="mag-avatar" :style="{ borderColor: t['border-secondary'] }" />
                      <div>
                        <p :style="{ color: t['text-primary'] }"><strong>Frank Albrecht</strong></p>
                        <p class="mag-muted" :style="{ color: t['text-tertiary'] }">Herausgeber · Studio Journal</p>
                      </div>
                    </div>
                  </div>
                </header>

                <!-- Chapter Nav -->
                <nav class="mag-chapter-nav" :style="{ background: t['layer-01'], borderColor: t['border-secondary'] }">
                  <ul>
                    <li><a href="#lf-1" @click.prevent="scrollToRef('lf-1')" :style="{ color: t['text-link'] }">Kapitel 1</a></li>
                    <li><a href="#lf-2" @click.prevent="scrollToRef('lf-2')" :style="{ color: t['text-link'] }">Kapitel 2</a></li>
                    <li><a href="#lf-3" @click.prevent="scrollToRef('lf-3')" :style="{ color: t['text-link'] }">Kapitel 3</a></li>
                    <li><a href="#mag-data" @click.prevent="scrollToRef('mag-data')" :style="{ color: t['text-link'] }">Fakten</a></li>
                  </ul>
                </nav>

                <!-- Ch. 1 -->
                <section id="lf-1" class="mag-chapter">
                  <h3 :style="{ color: t['text-primary'] }">Kapitel 1: Der Rhythmus von Inhalt</h3>
                  <p :style="{ color: t['text-primary'] }">
                    Eine Reportage braucht Luft: Absätze, Zwischenüberschriften, Bildunterschriften.
                    Hier zeigt sich, ob ein Theme „magazinartig" ist: Zeilenlänge, Abstände, Link-Stil, Fokus, Kontrast.
                  </p>
                  <figure class="mag-figure">
                    <img src="https://picsum.photos/1000/560?random=204"
                         alt="Foto: Skizzen und Marker auf einem Tisch, kreative Atmosphäre."
                         class="mag-content-img" :style="{ borderColor: t['border-secondary'] }" loading="lazy" />
                    <figcaption :style="{ color: t['text-tertiary'] }">Zwischenbild: Captions testen (Größe, Farbe, Spacing).</figcaption>
                  </figure>
                  <blockquote class="mag-blockquote" :style="{ borderLeftColor: t['interactive-default'], background: t['layer-01'] }">
                    <p :style="{ color: t['text-primary'] }">„Lesbarkeit ist ein Feature. Und jedes Feature braucht States."</p>
                    <footer :style="{ color: t['text-tertiary'] }">— Notiz aus einer Design-Review</footer>
                  </blockquote>
                  <p :style="{ color: t['text-primary'] }">
                    Ein Link im Fließtext: <a href="#mag-forms" @click.prevent="scrollToRef('mag-forms')" :style="{ color: t['text-link'] }">zum Formularbereich</a>.
                    Inline-Code: <code class="mag-code" :style="{ background: t['layer-01'], color: t['text-primary'] }">--line-height-body</code>.
                    Und ein <q :style="{ color: t['text-secondary'] }">kurzer Zwischenruf</q>.
                  </p>
                </section>

                <!-- Ch. 2 -->
                <section id="lf-2" class="mag-chapter">
                  <h3 :style="{ color: t['text-primary'] }">Kapitel 2: Komponenten als Erzählmittel</h3>
                  <p :style="{ color: t['text-primary'] }">
                    Cards, Badges und Hinweise sind wie Infokästen in Printmagazinen. Sie müssen ruhig wirken, aber eindeutig sein.
                  </p>
                  <aside class="mag-pull-card" :style="{ background: t['layer-01'], borderColor: t['border-secondary'] }">
                    <h4 :style="{ color: t['text-primary'] }">Infokasten</h4>
                    <p class="mag-muted" :style="{ color: t['text-secondary'] }">Kurzer Kontext, der Layout und Kontrast testet.</p>
                    <ul :style="{ color: t['text-primary'] }">
                      <li>Badge/Tag Stil</li>
                      <li>Button-States</li>
                      <li>Link-Underlines</li>
                    </ul>
                    <p>
                      <span class="mag-badge" :style="{ background: t['background-secondary'], color: t['text-primary'] }">#Editorial</span>
                      <span class="mag-badge" :style="{ background: t['background-secondary'], color: t['text-primary'] }">#Tokens</span>
                    </p>
                    <button type="button" class="mag-btn-sm" :style="magBtnPrimary">Mehr dazu</button>
                  </aside>
                  <details class="mag-details" :style="{ borderColor: t['border-secondary'], background: t['layer-01'] }">
                    <summary class="mag-summary" :style="{ color: t['text-primary'] }">Optional: Hintergrund zur Reportage öffnen</summary>
                    <div class="mag-details-body" :style="{ borderTopColor: t['border-secondary'] }">
                      <p :style="{ color: t['text-secondary'] }">
                        Klapptexte halten den Hauptfluss ruhig und bieten dennoch Tiefe – ideal für Test von Summary/Details-Styles.
                      </p>
                    </div>
                  </details>
                </section>

                <!-- Ch. 3 -->
                <section id="lf-3" class="mag-chapter">
                  <h3 :style="{ color: t['text-primary'] }">Kapitel 3: Medien, die sich einfügen</h3>
                  <p :style="{ color: t['text-primary'] }">Das Theme muss Bilder, Video und Audio tragen, ohne dass Controls oder Captions kollidieren.</p>
                  <video controls class="mag-video" :style="{ borderColor: t['border-secondary'] }">
                    <source src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm" type="video/webm" />
                    Dein Browser unterstützt kein Video-Tag.
                  </video>
                  <audio controls class="mag-audio">
                    <source src="https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3" type="audio/mpeg" />
                    Dein Browser unterstützt kein Audioelement.
                  </audio>
                </section>
              </article>
            </section>

            <!-- ═══════════════════════════════════════════════════════════
                 SHARED SECTIONS (always visible)
                 ═══════════════════════════════════════════════════════════ -->
            <hr class="mag-divider" :style="{ borderColor: t['border-primary'] }" />

            <!-- UI-Übersicht -->
            <section id="mag-tokens" class="mag-shared-section">
              <h2 :style="{ color: t['text-primary'] }">UI-Übersicht (gemeinsam)</h2>
              <p class="mag-muted" :style="{ color: t['text-secondary'] }">
                Diese Sektion bleibt in allen Ansichten gleich: ideal für wiederholbare Theme-Checks (Typo, Buttons, Links, States, Badges).
              </p>
              <section>
                <h3 :style="{ color: t['text-primary'] }">Text, Links, Hervorhebungen</h3>
                <p :style="{ color: t['text-primary'] }">
                  Fließtext mit <strong>Strong</strong>, <em>Emphasis</em>,
                  <a href="#" :style="{ color: t['text-link'] }">Standard-Link</a> und
                  <a href="#" :style="{ color: t['interactive-default'], fontWeight: 700 }">aktiver Link</a>.
                  Auch <mark :style="{ background: t['feedback-warning'] + '40', color: t['text-primary'] }">Markierung</mark>
                  und <code class="mag-code" :style="{ background: t['layer-01'], color: t['text-primary'] }">Inline-Code</code>.
                </p>
                <p class="mag-muted" :style="{ color: t['text-secondary'] }">
                  <small :style="{ color: t['text-tertiary'] }">Kleine Schrift / Secondary: Hinweistext für Kontrast und Lesbarkeit.</small>
                </p>
              </section>
              <section>
                <h3 :style="{ color: t['text-primary'] }">Buttons &amp; States</h3>
                <div class="mag-btn-row" role="group" aria-label="Button Gruppe">
                  <button type="button" class="mag-btn" :style="magBtnPrimary">Primary</button>
                  <button type="button" class="mag-btn" :style="magBtnSecondary">Secondary</button>
                  <button type="button" class="mag-btn" :style="magBtnDisabled" disabled>Disabled</button>
                  <a href="#" role="button" class="mag-btn" :style="magBtnLink">Link-Button</a>
                </div>
                <p class="mag-badge-row">
                  <span class="mag-badge" :style="{ background: t['background-secondary'], color: t['text-primary'] }">Badge</span>
                  <span class="mag-badge" :style="{ background: t['feedback-info'] + '26', color: t['text-primary'] }">New</span>
                  <span class="mag-badge" :style="{ background: t['interactive-default'] + '22', color: t['interactive-default'] }">Trending</span>
                </p>
              </section>
              <section>
                <h3 :style="{ color: t['text-primary'] }">Listen</h3>
                <div class="mag-lists-row">
                  <div>
                    <h4 :style="{ color: t['text-primary'] }">Ungeordnet</h4>
                    <ul :style="{ color: t['text-primary'] }">
                      <li>Spacing &amp; Bullet</li>
                      <li>Link in Liste: <a href="#" :style="{ color: t['text-link'] }">Artikel</a></li>
                      <li><strong>Bold</strong> und <em>Italic</em></li>
                    </ul>
                  </div>
                  <div>
                    <h4 :style="{ color: t['text-primary'] }">Geordnet</h4>
                    <ol :style="{ color: t['text-primary'] }">
                      <li>Hierarchie prüfen</li>
                      <li>Kontrast der Ziffern</li>
                      <li>Line-height testen</li>
                    </ol>
                  </div>
                </div>
              </section>
            </section>

            <!-- Daten & Tabellen -->
            <section id="mag-data" class="mag-shared-section">
              <h2 :style="{ color: t['text-primary'] }">Daten &amp; Tabellen</h2>
              <p class="mag-muted" :style="{ color: t['text-secondary'] }">Alignment, Header-Styling, Zebra-Optionen, Hover-Row, Focus innerhalb interaktiver Zellen.</p>
              <div class="mag-table-wrap">
                <table class="mag-table" :style="{ borderColor: t['border-secondary'] }">
                  <caption :style="{ color: t['text-tertiary'] }">Performance Kennzahlen (Demo) – Q1 2026</caption>
                  <thead>
                    <tr :style="{ background: t['layer-01'] }">
                      <th :style="{ color: t['text-primary'], borderBottomColor: t['border-primary'] }">Kategorie</th>
                      <th :style="{ color: t['text-primary'], borderBottomColor: t['border-primary'] }">Wert</th>
                      <th :style="{ color: t['text-primary'], borderBottomColor: t['border-primary'] }">Trend</th>
                      <th :style="{ color: t['text-primary'], borderBottomColor: t['border-primary'] }">Notiz</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(row, i) in perfData" :key="i"
                        :style="{ background: i % 2 === 1 ? t['layer-01'] : 'transparent' }">
                      <th scope="row" :style="{ color: t['text-primary'], borderBottomColor: t['border-secondary'] }">{{ row.cat }}</th>
                      <td :style="{ color: t['text-primary'], borderBottomColor: t['border-secondary'] }">{{ row.val }}</td>
                      <td :style="{ color: t['interactive-default'], borderBottomColor: t['border-secondary'] }">{{ row.trend }}</td>
                      <td :style="{ color: t['text-secondary'], borderBottomColor: t['border-secondary'] }">{{ row.note }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <section>
                <h3 :style="{ color: t['text-primary'] }">Progress &amp; Meter</h3>
                <div class="mag-progress-group">
                  <label :style="{ color: t['text-primary'] }">Upload-Fortschritt:</label>
                  <div class="mag-progress-track" :style="{ background: t['background-secondary'] }">
                    <div class="mag-progress-bar" :style="{ background: t['interactive-default'], width: '60%' }"></div>
                  </div>
                  <span class="mag-progress-val" :style="{ color: t['text-tertiary'] }">60 %</span>
                </div>
                <div class="mag-progress-group">
                  <label :style="{ color: t['text-primary'] }">Qualitäts-Score:</label>
                  <div class="mag-progress-track" :style="{ background: t['background-secondary'] }">
                    <div class="mag-progress-bar" :style="{ background: t['feedback-success'], width: '78%' }"></div>
                  </div>
                  <span class="mag-progress-val" :style="{ color: t['text-tertiary'] }">0.78</span>
                </div>
                <div class="mag-status" role="status" aria-live="polite"
                     :style="{ background: t['feedback-info'] + '18', borderLeftColor: t['feedback-info'] }">
                  <span :style="{ color: t['text-primary'] }">Status: Theme geladen und bereit</span>
                </div>
              </section>
            </section>

            <!-- Formulare -->
            <section id="mag-forms" class="mag-shared-section">
              <h2 :style="{ color: t['text-primary'] }">Formulare</h2>
              <p class="mag-muted" :style="{ color: t['text-secondary'] }">Labels, Helper-Text, Required, Disabled, Checkbox/Radio, Select, Range.</p>
              <form @submit.prevent aria-describedby="mag-forms-desc">
                <p id="mag-forms-desc" class="mag-muted" :style="{ color: t['text-tertiary'] }">
                  Demo-Formular zur Prüfung von Input-States, Fokus, Fehlermeldungen und Button-Kontrast.
                </p>
                <fieldset class="mag-fieldset" :style="{ borderColor: t['border-primary'] }">
                  <legend :style="{ color: t['text-primary'] }">Newsletter &amp; Feedback</legend>
                  <div class="mag-form-row">
                    <label for="mag-f-name" :style="{ color: t['text-primary'] }">Name</label>
                    <input id="mag-f-name" type="text" class="mag-input" placeholder="z. B. Alex" autocomplete="name" :style="magInputStyle" />
                  </div>
                  <div class="mag-form-row">
                    <label for="mag-f-email" :style="{ color: t['text-primary'] }">E-Mail <span aria-hidden="true" :style="{ color: t['feedback-danger'] }">*</span></label>
                    <input id="mag-f-email" type="email" class="mag-input" required placeholder="dein.name@domain.de" autocomplete="email" :style="magInputStyle" />
                    <p class="mag-muted" :style="{ color: t['text-tertiary'] }"><small>Wir senden max. 1x pro Woche. Kein Spam.</small></p>
                  </div>
                  <div class="mag-form-row">
                    <label for="mag-f-topic" :style="{ color: t['text-primary'] }">Thema</label>
                    <select id="mag-f-topic" class="mag-select" :style="magInputStyle">
                      <option>Lesbarkeit</option>
                      <option>Farbkontrast</option>
                      <option>Navigation</option>
                      <option>Interaktionen</option>
                    </select>
                  </div>
                  <div class="mag-form-row">
                    <label for="mag-f-msg" :style="{ color: t['text-primary'] }">Nachricht</label>
                    <textarea id="mag-f-msg" rows="3" class="mag-textarea" placeholder="Was würdest du verbessern?" :style="magInputStyle"></textarea>
                  </div>
                  <div class="mag-lists-row">
                    <div class="mag-form-row">
                      <p :style="{ color: t['text-primary'] }"><strong>Benachrichtigung</strong></p>
                      <label :style="{ color: t['text-primary'] }"><input type="checkbox" :style="{ accentColor: t['interactive-default'] }" /> Antworten per Mail</label>
                      <label :style="{ color: t['text-primary'] }"><input type="checkbox" :style="{ accentColor: t['interactive-default'] }" /> Wochenrückblick</label>
                    </div>
                    <div class="mag-form-row">
                      <p :style="{ color: t['text-primary'] }"><strong>Format</strong></p>
                      <label :style="{ color: t['text-primary'] }"><input type="radio" name="mag-format" value="short" checked :style="{ accentColor: t['interactive-default'] }" /> Kurz</label>
                      <label :style="{ color: t['text-primary'] }"><input type="radio" name="mag-format" value="long" :style="{ accentColor: t['interactive-default'] }" /> Ausführlich</label>
                    </div>
                  </div>
                  <div class="mag-form-row">
                    <label for="mag-f-range" :style="{ color: t['text-primary'] }">Editorial Score (0–10)</label>
                    <input id="mag-f-range" type="range" min="0" max="10" value="7" :style="{ accentColor: t['interactive-default'] }" />
                    <p class="mag-muted" :style="{ color: t['text-tertiary'] }"><small>0 = technisch · 10 = editorial</small></p>
                  </div>
                  <div class="mag-btn-row">
                    <button type="submit" class="mag-btn" :style="magBtnPrimary">Senden</button>
                    <button type="reset" class="mag-btn" :style="magBtnSecondary">Zurücksetzen</button>
                    <button type="button" class="mag-btn" :style="magBtnDisabled" disabled>Disabled Action</button>
                  </div>
                </fieldset>
              </form>
            </section>

            <!-- Medien -->
            <section id="mag-media" class="mag-shared-section">
              <h2 :style="{ color: t['text-primary'] }">Medien</h2>
              <p class="mag-muted" :style="{ color: t['text-secondary'] }">Bilder, Captions, Video/Audio Controls, Responsive Verhalten.</p>
              <figure class="mag-figure">
                <img src="https://picsum.photos/900/520?random=301" alt="Abstraktes Foto: Farbflächen und Lichtreflexe."
                     class="mag-content-img" :style="{ borderColor: t['border-secondary'] }" loading="lazy" />
                <figcaption :style="{ color: t['text-tertiary'] }">Bild 1: Abstrakte Farbflächen – ideal für Theme-Kontrasttests.</figcaption>
              </figure>
              <figure class="mag-figure">
                <img src="https://picsum.photos/900/520?random=302" alt="Stadtansicht: Fassaden in warmem Abendlicht."
                     class="mag-content-img" :style="{ borderColor: t['border-secondary'] }" loading="lazy" />
                <figcaption :style="{ color: t['text-tertiary'] }">Bild 2: Architektur – gut für Caption, Spacing und Textfarben.</figcaption>
              </figure>
              <video controls class="mag-video" :style="{ borderColor: t['border-secondary'] }">
                <source src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm" type="video/webm" />
                Dein Browser unterstützt kein Video-Tag.
              </video>
              <audio controls class="mag-audio">
                <source src="https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3" type="audio/mpeg" />
                Dein Browser unterstützt kein Audioelement.
              </audio>
            </section>

            <!-- Kommentare -->
            <section id="mag-comments" class="mag-shared-section">
              <h2 :style="{ color: t['text-primary'] }">Kommentare</h2>
              <article v-for="c in comments" :key="c.user" class="mag-comment" :style="{ borderBottomColor: t['border-secondary'] }">
                <header class="mag-comment-header">
                  <img :src="c.avatar" :alt="'Avatar: ' + c.user" width="28" height="28"
                       class="mag-avatar-sm" :style="{ borderColor: t['border-secondary'] }" />
                  <p :style="{ color: t['text-primary'] }"><strong>{{ c.user }}</strong> <span class="mag-muted" :style="{ color: t['text-tertiary'] }">· {{ c.time }}</span></p>
                </header>
                <p :style="{ color: t['text-primary'] }">{{ c.text }}</p>
                <footer class="mag-comment-actions">
                  <button type="button" class="mag-btn-xs" :style="magBtnSecondary">Antworten</button>
                  <button type="button" class="mag-btn-xs" :style="magBtnSecondary">Upvote</button>
                  <button v-if="c.showBookmark" type="button" class="mag-btn-xs" :style="magBtnSecondary" aria-pressed="false">Merken</button>
                </footer>
              </article>
            </section>

          </main>

          <!-- ─── FOOTER ─── -->
          <footer class="mag-footer" role="contentinfo" :style="{ borderTopColor: t['border-primary'] }">
            <p :style="{ color: t['text-tertiary'] }">© 2026 Theme Preview Mag – Master-Demo für Theme-Konfiguration.</p>
            <a href="#" @click.prevent="scrollToTop" :style="{ color: t['text-link'] }">Nach oben</a>
          </footer>

        </div>

      </template>

    </div>
  </aside>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useThemeStore } from '../../stores/theme.js'
import { foundationTokens } from '../../data/tokens.js'

const store = useThemeStore()
const typoTokens = foundationTokens.typography.tokens

// ---------------------------------------------------------------------------
// Is the user editing Typography?
// ---------------------------------------------------------------------------
const isTypographySection = computed(() => {
  return store.state.activeSection === 'foundation-typography'
})

// ---------------------------------------------------------------------------
// Font families from store (reactive to edits)
// ---------------------------------------------------------------------------
const currentBodyFont = computed(() => {
  const f = store.currentFoundation.value?.typography?.['font-body']
  return f || typoTokens['font-body'].value
})

const currentHeadingFont = computed(() => {
  const f = store.currentFoundation.value?.typography?.['font-heading']
  return f || typoTokens['font-heading'].value
})

const currentMonoFont = computed(() => {
  const f = store.currentFoundation.value?.typography?.['font-mono']
  return f || typoTokens['font-mono'].value
})

const headingFont = computed(() => ({
  fontFamily: currentHeadingFont.value
}))

const bodyFont = computed(() => ({
  fontFamily: currentBodyFont.value
}))

const monoFont = computed(() => ({
  fontFamily: currentMonoFont.value
}))

// ---------------------------------------------------------------------------
// Magazine Reference Data
// ---------------------------------------------------------------------------
const activeView = ref('feature')

const magTabs = [
  { id: 'feature', label: 'Feature Story' },
  { id: 'newsroom', label: 'Newsroom' },
  { id: 'longform', label: 'Longform' }
]

const feedItems = [
  {
    id: 1, kicker: 'UX', img: 'https://picsum.photos/640/420?random=211',
    imgAlt: 'Symbolbild: Hände tippen auf Laptop, Detailaufnahme.',
    title: 'Microinteractions, die sich nicht nach „UI" anfühlen',
    desc: 'Kurze Animationen, klare Zustände, weniger Lärm: kleine Details, große Wirkung.',
    date: '2026-02-18', dateLabel: '18. Feb 2026', series: 'Serie: Interface Notes',
    tags: ['#Delight']
  },
  {
    id: 2, kicker: 'Design Systems', img: 'https://picsum.photos/640/420?random=212',
    imgAlt: 'Symbolbild: Nachtstadt mit Lichtern, weiche Unschärfe.',
    title: 'Dark Mode ohne Grauschleier',
    desc: 'Kontrast ist nicht nur Helligkeit: Es geht um Ebenen, Textfarben und Fokus.',
    date: '2026-02-16', dateLabel: '16. Feb 2026', series: null,
    tags: ['#Tokens', '#Contrast']
  },
  {
    id: 3, kicker: 'Editorial', img: 'https://picsum.photos/640/420?random=213',
    imgAlt: 'Symbolbild: Magazinlayout auf Papier, Ansicht von oben.',
    title: 'Cards sind keine Kacheln',
    desc: 'Mit Typo, Spacing und Hierarchie werden Cards zu echten Mini-Geschichten.',
    date: '2026-02-14', dateLabel: '14. Feb 2026', series: null,
    tags: ['#Layout']
  }
]

const perfData = [
  { cat: 'Unique Reader', val: '128.400', trend: '▲ 12%', note: 'Mehr Reichweite durch bessere Lesbarkeit' },
  { cat: 'Ø Lesezeit', val: '6:48', trend: '▲ 9%', note: 'Longform-Layout & klare Typohierarchie' },
  { cat: 'Newsletter Opt-In', val: '3.240', trend: '▲ 5%', note: 'Form-Usability optimiert' }
]

const comments = [
  { user: 'm.hoffmann', avatar: 'https://i.pravatar.cc/64?img=25', time: 'vor 2 Stunden',
    text: 'Das Layout wirkt ruhig. Besonders die Zeilenlänge fühlt sich „magazinartig" an.', showBookmark: true },
  { user: 'studio.reader', avatar: 'https://i.pravatar.cc/64?img=9', time: 'gestern',
    text: 'Bitte prüfe noch den Fokus-Kontrast in der Pagination – da geht oft etwas verloren.', showBookmark: false }
]

// Magazine computed styles
const magBtnPrimary = computed(() => ({
  background: t.value['interactive-default'],
  color: t.value['text-on-interactive'],
  border: '1px solid transparent'
}))

const magBtnSecondary = computed(() => ({
  background: 'transparent',
  color: t.value['interactive-default'],
  border: `1px solid ${t.value['interactive-default']}`
}))

const magBtnDisabled = computed(() => ({
  background: t.value['background-secondary'],
  color: t.value['text-disabled'],
  border: '1px solid transparent',
  cursor: 'not-allowed',
  opacity: 0.6
}))

const magBtnLink = computed(() => ({
  background: 'transparent',
  color: t.value['text-link'],
  border: '1px solid transparent',
  textDecoration: 'underline'
}))

const magInputStyle = computed(() => ({
  background: t.value['background-base'],
  color: t.value['text-primary'],
  borderColor: t.value['border-primary']
}))

function scrollToRef(id) {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function scrollToTop() {
  const viewport = document.querySelector('.lab-viewport')
  if (viewport) viewport.scrollTo({ top: 0, behavior: 'smooth' })
}

// Type scale — DS semantic steps (ratio 1.2, base 14→18px, showing max values)
const typeSizes = [
  { name: 'xs', px: 12.5 }, { name: 'sm', px: 15 }, { name: 'base', px: 18 },
  { name: 'lg', px: 21.6 }, { name: 'xl', px: 25.9 }, { name: '2xl', px: 31.1 },
  { name: '3xl', px: 37.3 }, { name: '4xl', px: 44.8 }, { name: '5xl', px: 53.7 }
]

// ---------------------------------------------------------------------------
// Horizontal Resize
// ---------------------------------------------------------------------------
const MIN_WIDTH = 260
const MAX_WIDTH_RATIO = 0.6 // Max 60% of viewport
const DEFAULT_RATIO = 0.4   // Default 40% of viewport

const panelWidth = ref(Math.round(window.innerWidth * DEFAULT_RATIO))

// Restore persisted width
onMounted(() => {
  try {
    const saved = localStorage.getItem('neo-cfg-arena-width')
    if (saved) {
      const w = parseInt(saved, 10)
      if (w >= MIN_WIDTH && w <= window.innerWidth * MAX_WIDTH_RATIO) {
        panelWidth.value = w
      }
    }
  } catch {}
})

let resizing = false
let startX = 0
let startWidth = 0

function startResize(e) {
  resizing = true
  startX = e.clientX
  startWidth = panelWidth.value
  document.body.style.cursor = 'col-resize'
  document.body.style.userSelect = 'none'
  document.addEventListener('mousemove', onResize)
  document.addEventListener('mouseup', stopResize)
}

function onResize(e) {
  if (!resizing) return
  // Panel is on the right, so dragging LEFT increases width
  const delta = startX - e.clientX
  const maxW = Math.round(window.innerWidth * MAX_WIDTH_RATIO)
  const newWidth = Math.min(maxW, Math.max(MIN_WIDTH, startWidth + delta))
  panelWidth.value = newWidth
}

function stopResize() {
  resizing = false
  document.body.style.cursor = ''
  document.body.style.userSelect = ''
  document.removeEventListener('mousemove', onResize)
  document.removeEventListener('mouseup', stopResize)
  // Persist
  try {
    localStorage.setItem('neo-cfg-arena-width', String(panelWidth.value))
  } catch {}
}

// Respond to window resize
function onWindowResize() {
  const maxW = Math.round(window.innerWidth * MAX_WIDTH_RATIO)
  if (panelWidth.value > maxW) panelWidth.value = maxW
}

onMounted(() => window.addEventListener('resize', onWindowResize))
onUnmounted(() => window.removeEventListener('resize', onWindowResize))

// ---------------------------------------------------------------------------
// Theme tokens — reads directly from store (reactive to theme/mode changes)
// ---------------------------------------------------------------------------
const t = computed(() => {
  return store.state.themes[store.state.activeThemeSet][store.state.previewMode]
})

const viewportStyle = computed(() => ({
  background: t.value['background-base'],
  color: t.value['text-primary']
}))

const viewportClass = computed(() => store.state.previewMode === 'dark' ? 'dark-mode' : 'light-mode')

// Button styles (typography showcase)
const btnPrimary = computed(() => ({
  background: t.value['interactive-default'],
  color: t.value['text-on-interactive'],
  border: '1px solid transparent'
}))

const btnSecondary = computed(() => ({
  background: 'transparent',
  color: t.value['interactive-default'],
  border: `1px solid ${t.value['interactive-default']}`
}))

const btnGhost = computed(() => ({
  background: 'transparent',
  color: t.value['text-primary'],
  border: '1px solid transparent'
}))

const btnSuccess = computed(() => ({
  background: t.value['feedback-success'],
  color: '#ffffff',
  border: '1px solid transparent'
}))

const btnError = computed(() => ({
  background: t.value['feedback-danger'],
  color: '#ffffff',
  border: '1px solid transparent'
}))

const btnWarning = computed(() => ({
  background: t.value['feedback-warning'],
  color: '#000000',
  border: '1px solid transparent'
}))

// Input styles
const inputStyle = computed(() => ({
  background: t.value['background-base'],
  color: t.value['text-primary'],
  borderColor: t.value['border-primary']
}))

const inputErrorStyle = computed(() => ({
  background: t.value['background-base'],
  color: t.value['text-primary'],
  borderColor: t.value['border-danger']
}))

// Badge styles
const badgeDefault = computed(() => ({
  background: t.value['background-secondary'],
  color: t.value['text-primary']
}))

const badgeSuccess = computed(() => ({
  background: t.value['background-success'],
  color: t.value['text-success']
}))

const badgeError = computed(() => ({
  background: t.value['background-danger'],
  color: t.value['text-danger']
}))

const badgeWarning = computed(() => ({
  background: t.value['feedback-warning'] + '26',
  color: t.value['text-primary']
}))

const badgeInfo = computed(() => ({
  background: t.value['feedback-info'] + '26',
  color: t.value['text-primary']
}))

// Card style
const cardStyle = computed(() => ({
  background: t.value['layer-01'],
  borderColor: t.value['border-secondary']
}))

// Switch styles
const switchOff = computed(() => ({
  background: t.value['background-secondary']
}))

const switchOn = computed(() => ({
  background: t.value['interactive-default']
}))
</script>

<style scoped>
.laboratory-panel {
  position: relative;
  display: flex;
  flex-direction: column;
  background: var(--cfg-surface);
  border-left: 1px solid var(--cfg-border);
  overflow-y: auto;
  flex-shrink: 0;
}

/* Resize drag handle on the left edge */
.resize-handle {
  position: absolute;
  top: 0;
  left: -3px;
  width: 6px;
  height: 100%;
  cursor: col-resize;
  z-index: 10;
  transition: background 0.15s;
}

.resize-handle:hover,
.resize-handle:active {
  background: var(--cfg-accent, #009fe3);
  opacity: 0.4;
}

.lab-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid var(--cfg-border);
  flex-shrink: 0;
}

.lab-title {
  font-size: 13px;
  font-weight: 700;
  color: var(--cfg-text);
  margin: 0;
}

.theme-toggle {
  display: flex;
  border-radius: 8px;
  background: var(--cfg-surface-elevated);
  padding: 2px;
  gap: 2px;
}

.toggle-btn {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 4px 10px;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: var(--cfg-text-muted);
  font-size: 11px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
}

.toggle-btn:hover { color: var(--cfg-text); }

.toggle-btn.active {
  background: var(--cfg-surface);
  color: var(--cfg-text);
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
}

.lab-viewport {
  flex: 1;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  border-radius: 0;
  transition: background 0.2s, color 0.2s;
  overflow-y: auto;
}

.preview-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.preview-label {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  opacity: 0.5;
}

.preview-row {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.preview-row.wrap { flex-wrap: wrap; }

/* ═══════════════════════════════════════════════════════════════════
   DEFAULT ARENA: Theme Preview Magazine
   ═══════════════════════════════════════════════════════════════════ */
/* DS token: @include paragraph('l') — 1rem (16px), lh 1.6 (--lh-body) */
.mag {
  font-size: 1rem;
  line-height: 1.6;
}

/* DS: headings get heading font, 1.15 line-height, heading weight */
.mag h1, .mag h2, .mag h3, .mag h4, .mag h5, .mag h6 { margin: 0; font-family: var(--mag-heading-font, inherit); line-height: 1.15; }
.mag p { margin: 0 0 8px; }
.mag ul, .mag ol { margin: 0 0 8px; padding-left: 18px; }
.mag code, .mag pre, .mag kbd, .mag samp { font-family: var(--mag-mono-font, monospace); }
.mag a { text-decoration: underline; cursor: pointer; }
.mag a:hover { opacity: 0.85; }

/* Skip Link — DS token: @include paragraph('s') + semibold */
.mag-skip {
  position: absolute;
  top: -40px;
  left: 8px;
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  text-decoration: none;
  z-index: 100;
  transition: top 0.15s;
}

.mag-skip:focus {
  top: 8px;
}

/* Brand Bar */
.mag-header {
  padding-bottom: 16px;
  border-bottom: 1px solid;
  margin-bottom: 4px;
}

.mag-brand-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 14px;
  flex-wrap: wrap;
}

/* DS token: .nc-eyebrow pattern — 0.75rem, ls 0.2em */
.mag-brand-bar a {
  text-decoration: none;
  font-size: 0.75rem;
  letter-spacing: 0.2em;
}

.mag-quicknav {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}

/* DS token: @include paragraph('s') — 0.75rem (12px) + medium */
.mag-quicknav a {
  font-size: 0.75rem;
  font-weight: 500;
  padding: 2px 6px;
}

/* View Switcher */
.mag-view-switcher { margin-top: 4px; }

/* DS token: @include heading('l') — 2rem (32px), lh 1.15, ls -0.02em */
.mag-main-title {
  font-size: 2rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  margin-bottom: 6px;
}

/* DS token: @include paragraph('s') — 0.75rem (12px) */
.mag-muted { font-size: 0.75rem; }
.mag-hint { margin-top: 6px; }

.mag-tabs {
  display: flex;
  gap: 6px;
  margin-top: 10px;
  flex-wrap: wrap;
}

/* DS token: @include paragraph('s') — 0.75rem (12px) + semibold */
.mag-tab {
  padding: 5px 14px;
  border: 1px solid;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}

.mag-tab:hover { opacity: 0.9; }

/* Panels */
.mag-panel { padding: 4px 0 0; }

/* Hero */
.mag-hero { margin-bottom: 16px; }

.mag-hero-figure {
  margin: 0 0 10px;
}

.mag-hero-img {
  width: 100%;
  height: auto;
  border: 1px solid;
  border-radius: 8px;
  display: block;
}

/* DS token: .nc-eyebrow pattern — 0.75rem (12px), uppercase, ls 0.2em */
.mag-hero-figure figcaption {
  margin-top: 4px;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.2em;
}

.mag-hero-content {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

/* DS token: .nc-eyebrow pattern — 0.75rem (12px), uppercase, ls 0.2em */
.mag-kicker {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  margin: 0;
}

/* DS token: @include heading('xl') — 2.5rem (40px), lh 1.15, ls -0.02em */
.mag-hero-title {
  font-size: 2.5rem;
  font-weight: 700;
  line-height: 1.15;
  letter-spacing: -0.02em;
}

/* DS token: @include paragraph('l') — 1rem (16px), lh 1.6 */
.mag-subheadline {
  font-size: 1rem;
  line-height: 1.6;
}

/* DS token: @include paragraph('s') — 0.75rem (12px) */
.mag-meta-row {
  display: flex;
  gap: 6px;
  font-size: 0.75rem;
  align-items: center;
}

.mag-author {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
  flex-wrap: wrap;
}

/* DS token: @include paragraph('s') — 0.75rem (12px) */
.mag-author p { margin: 0; font-size: 0.75rem; }

.mag-avatar {
  border-radius: 50%;
  border: 1px solid;
  flex-shrink: 0;
}

.mag-avatar-sm {
  border-radius: 50%;
  border: 1px solid;
  flex-shrink: 0;
}

.mag-author-actions {
  display: flex;
  gap: 8px;
  align-items: center;
  margin-left: auto;
}

/* DS token: @include paragraph('s') — 0.75rem (12px) */
.mag-author-actions a {
  font-size: 0.75rem;
}

/* Two-Column Layout */
.mag-two-col {
  display: flex;
  gap: 16px;
}

.mag-article-body {
  flex: 1;
  min-width: 0;
}

/* DS token: h3 = @include heading('l') — 2rem (32px) */
.mag-article-body h3 { font-size: 1.5rem; font-weight: 700; letter-spacing: -0.01em; margin: 14px 0 6px; }
/* DS token: h4 = @include heading('m') — 1.5rem (24px) */
.mag-article-body h4 { font-size: 1.25rem; font-weight: 600; letter-spacing: -0.01em; margin: 10px 0 4px; }

.mag-sidebar {
  width: 160px;
  flex-shrink: 0;
  padding-left: 14px;
  border-left: 1px solid;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

/* DS token: .nc-eyebrow pattern — 0.75rem (12px), uppercase, ls 0.2em */
.mag-sidebar h3 {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  margin-bottom: 4px;
}

/* DS token: @include paragraph('s') — 0.75rem (12px) */
.mag-sidebar ol { padding-left: 16px; font-size: 0.75rem; }
.mag-sidebar ol li { margin-bottom: 4px; }
.mag-sidebar ol a { font-size: 0.75rem; }

/* Tags */
.mag-tag-row { display: flex; flex-wrap: wrap; gap: 4px; }

/* DS token: @include paragraph('s') — 0.75rem (12px) + semibold */
.mag-tag {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  text-decoration: none;
}

/* KPIs */
.mag-kpi {
  margin: 0;
  display: flex;
  flex-direction: column;
}

/* DS token: @include paragraph('s') — 0.75rem (12px) */
.mag-kpi > div {
  display: flex;
  justify-content: space-between;
  padding: 4px 0;
  border-bottom: 1px solid transparent;
  font-size: 0.75rem;
}

.mag-kpi dt { font-weight: 400; }
.mag-kpi dd { margin: 0; font-weight: 700; }

/* Blockquote */
.mag-blockquote {
  margin: 10px 0;
  padding: 10px 14px;
  border-left: 3px solid;
  border-radius: 0 6px 6px 0;
}

/* DS token: blockquote = @include paragraph('l') — 1rem (16px) */
.mag-blockquote p { font-style: italic; font-size: 1rem; margin: 0; }
/* DS token: cite = @include paragraph('s') — 0.75rem (12px) */
.mag-blockquote footer { font-size: 0.75rem; font-style: normal; margin-top: 4px; }

/* Inline Code — DS: font-mono, @include paragraph('s') — 0.75rem */
.mag-code {
  padding: 1px 5px;
  border-radius: 3px;
  font-family: 'DM Mono', monospace;
  font-size: 0.875rem;
}

/* Callout */
.mag-callout {
  padding: 10px 14px;
  border-left: 3px solid;
  border-radius: 0 6px 6px 0;
  margin: 10px 0;
}

/* DS token: h4 = @include heading('xs') — 1rem (16px) */
.mag-callout h4 { font-size: 1rem; font-weight: 600; margin-bottom: 4px; }
/* DS token: @include paragraph('s') — 0.75rem (12px) */
.mag-callout p { font-size: 0.875rem; margin: 0; }

/* Card Grid */
.mag-card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
  gap: 8px;
  margin-top: 8px;
}

.mag-card {
  border: 1px solid;
  border-radius: 8px;
  padding: 10px;
}

/* DS token: h4 = @include heading('xs') — 1rem (16px), card context */
.mag-card h4 { font-size: 0.875rem; font-weight: 700; margin-bottom: 4px; }
/* DS token: @include paragraph('s') — 0.75rem (12px) */
.mag-card p { font-size: 0.75rem; margin-bottom: 4px; }
.mag-card a { font-size: 0.75rem; }

/* Newsroom */
.mag-top-story { margin-bottom: 16px; }

.mag-top-story-header {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.mag-byline {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* DS token: @include paragraph('s') — 0.75rem (12px) */
.mag-byline p { margin: 0; font-size: 0.75rem; }
.mag-meta-links { font-size: 0.75rem; }
.mag-meta-links a { font-size: 0.75rem; }

.mag-section-header {
  margin-bottom: 10px;
}

/* DS token: @include heading('s') — 1.25rem (20px), lh 1.15 */
.mag-section-header h3 {
  font-size: 1.25rem;
  font-weight: 700;
  letter-spacing: -0.01em;
  margin-bottom: 2px;
}

/* Feed */
.mag-feed { display: flex; flex-direction: column; }

.mag-feed-card {
  display: flex;
  gap: 10px;
  padding: 10px 0;
  border-bottom: 1px solid;
}

.mag-feed-img {
  width: 90px;
  height: 60px;
  object-fit: cover;
  border-radius: 6px;
  border: 1px solid;
  flex-shrink: 0;
}

/* DS token: @include heading('xs') — 1rem (16px) */
.mag-feed-card h4 { font-size: 1rem; font-weight: 700; margin-bottom: 2px; }
.mag-feed-card h4 a { text-decoration: none; }
.mag-feed-card h4 a:hover { text-decoration: underline; }
/* DS token: @include paragraph('s') — 0.75rem (12px) */
.mag-feed-card > div p { font-size: 0.75rem; margin-bottom: 3px; }

/* DS token: @include paragraph('s') — 0.75rem (12px) */
.mag-feed-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  align-items: center;
  font-size: 0.75rem;
}

/* Badge — DS token: @include paragraph('s') — 0.75rem (12px) + semibold */
.mag-badge {
  padding: 1px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  white-space: nowrap;
  text-decoration: none;
}

.mag-badge-row { display: flex; gap: 6px; flex-wrap: wrap; }

/* Pagination */
/* DS token: @include paragraph('s') — 0.75rem (12px) */
.mag-pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0;
  margin-top: 4px;
  border-top: 1px solid;
  font-size: 0.75rem;
}

.mag-pagination a { font-size: 0.75rem; }

/* Chapter Nav */
.mag-chapter-nav {
  border: 1px solid;
  border-radius: 8px;
  padding: 8px 14px;
  margin: 12px 0;
}

.mag-chapter-nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

/* DS token: @include paragraph('s') — 0.75rem (12px) + semibold */
.mag-chapter-nav a {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 4px;
}

/* Chapters */
.mag-chapter {
  padding: 8px 0;
}

/* DS token: h3 = @include heading('l') — 2rem (32px), lh 1.15 */
.mag-chapter h3 {
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: -0.01em;
  margin-bottom: 8px;
}

/* Figures */
.mag-figure {
  margin: 10px 0;
}

.mag-content-img {
  width: 100%;
  height: auto;
  border: 1px solid;
  border-radius: 8px;
  display: block;
}

/* DS token: figcaption = @include paragraph('s') — 0.75rem (12px) */
.mag-figure figcaption {
  margin-top: 4px;
  font-size: 0.75rem;
  text-align: center;
}

/* Pull Card (aside) */
.mag-pull-card {
  border: 1px solid;
  border-radius: 8px;
  padding: 12px 14px;
  margin: 10px 0;
}

/* DS token: h4 = @include heading('xs') — 1rem (16px) */
.mag-pull-card h4 { font-size: 1rem; font-weight: 700; margin-bottom: 4px; }
/* DS token: @include paragraph('s') — 0.75rem (12px) */
.mag-pull-card p { font-size: 0.75rem; }
.mag-pull-card ul { font-size: 0.75rem; }

/* Details / Summary */
.mag-details {
  border: 1px solid;
  border-radius: 8px;
  margin: 10px 0;
  overflow: hidden;
}

/* DS token: @include paragraph('m') — 0.875rem (14px) + semibold */
.mag-summary {
  padding: 8px 12px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  list-style: none;
}

.mag-summary::-webkit-details-marker { display: none; }

.mag-summary::before {
  content: '▸';
  display: inline-block;
  margin-right: 6px;
  transition: transform 0.15s;
}

.mag-details[open] .mag-summary::before {
  transform: rotate(90deg);
}

.mag-details-body {
  padding: 8px 12px;
  border-top: 1px solid;
}

/* DS token: @include paragraph('s') — 0.75rem (12px) */
.mag-details-body p { font-size: 0.75rem; margin: 0; }

/* Video / Audio */
.mag-video {
  width: 100%;
  border: 1px solid;
  border-radius: 6px;
  margin: 8px 0;
}

.mag-audio {
  width: 100%;
  margin: 8px 0;
}

/* Shared Sections */
.mag-shared-section {
  padding: 12px 0 0;
}

/* DS token: h2 = @include heading('xl') — 2.5rem (40px) (scaled for preview) */
.mag-shared-section > h2 {
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  margin-bottom: 6px;
}

.mag-shared-section > section {
  margin-top: 12px;
}

/* DS token: h3 = @include heading('m') — 1.5rem (24px) */
.mag-shared-section h3 {
  font-size: 1.25rem;
  font-weight: 700;
  letter-spacing: -0.01em;
  margin-bottom: 6px;
}

/* DS token: h4 = @include heading('xs') — 1rem (16px) */
.mag-shared-section h4 {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 4px;
}

.mag-divider {
  border: none;
  border-top: 2px solid;
  margin: 16px 0 4px;
}

/* Buttons — DS token: @include paragraph('m') — 0.875rem (14px) + semibold */
.mag-btn {
  padding: 6px 14px;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.15s;
  text-decoration: none;
  white-space: nowrap;
}

.mag-btn:hover { opacity: 0.85; }
.mag-btn:disabled { cursor: not-allowed; }

/* DS token: @include paragraph('s') — 0.75rem (12px) + semibold */
.mag-btn-sm {
  padding: 3px 10px;
  border-radius: 5px;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.15s;
}

.mag-btn-sm:hover { opacity: 0.85; }

/* DS token: @include paragraph('s') — 0.75rem (12px) + semibold */
.mag-btn-xs {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.15s;
}

.mag-btn-xs:hover { opacity: 0.85; }

.mag-btn-row {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin: 8px 0;
}

/* Lists layout */
.mag-lists-row {
  display: flex;
  gap: 16px;
}

.mag-lists-row > div { flex: 1; }

/* Table */
.mag-table-wrap {
  overflow-x: auto;
  margin: 8px 0;
}

/* DS token: @include paragraph('s') — 0.75rem (12px) */
.mag-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.75rem;
}

/* DS token: caption = @include paragraph('s') — 0.75rem (12px) */
.mag-table caption {
  text-align: left;
  font-size: 0.75rem;
  font-style: italic;
  margin-bottom: 6px;
}

.mag-table th,
.mag-table td {
  text-align: left;
  padding: 6px 8px;
  border-bottom: 1px solid;
}

/* DS token: .nc-eyebrow pattern — uppercase, ls 0.2em */
.mag-table th {
  font-weight: 700;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.2em;
}

.mag-table th[scope="row"] {
  text-transform: none;
  font-weight: 600;
}

/* Progress */
.mag-progress-group {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 6px 0;
}

/* DS token: @include paragraph('s') — 0.75rem (12px) + semibold */
.mag-progress-group label {
  font-size: 0.75rem;
  font-weight: 600;
  flex-shrink: 0;
  width: 110px;
}

.mag-progress-track {
  flex: 1;
  height: 8px;
  border-radius: 4px;
  overflow: hidden;
}

.mag-progress-bar {
  height: 100%;
  border-radius: 4px;
  transition: width 0.3s ease;
}

/* DS token: @include paragraph('s') + mono font */
.mag-progress-val {
  font-size: 0.75rem;
  font-family: 'DM Mono', monospace;
  white-space: nowrap;
  flex-shrink: 0;
}

/* Status — DS token: @include paragraph('s') — 0.75rem (12px) */
.mag-status {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-left: 3px solid;
  border-radius: 0 6px 6px 0;
  font-size: 0.75rem;
  margin-top: 8px;
}

/* Forms */
.mag-fieldset {
  border: 1px solid;
  border-radius: 10px;
  padding: 12px 14px;
  margin: 0;
}

/* DS token: @include heading('xxs') — 0.875rem (14px) + bold */
.mag-fieldset legend {
  font-size: 0.875rem;
  font-weight: 700;
  padding: 0 6px;
}

.mag-form-row {
  display: flex;
  flex-direction: column;
  gap: 3px;
  margin-bottom: 10px;
}

/* DS token: @include paragraph('s') — 0.75rem (12px) + semibold */
.mag-form-row > label {
  font-size: 0.75rem;
  font-weight: 600;
}

.mag-form-row label:has(input[type="checkbox"]),
.mag-form-row label:has(input[type="radio"]) {
  font-weight: 400;
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
}

/* DS token: @include paragraph('s') — 0.75rem (12px) */
.mag-input,
.mag-textarea,
.mag-select {
  padding: 6px 10px;
  border: 1px solid;
  border-radius: 5px;
  font-size: 0.75rem;
  font-family: inherit;
  outline: none;
  transition: border-color 0.15s;
}

.mag-input:focus,
.mag-textarea:focus,
.mag-select:focus {
  outline: 2px solid currentColor;
  outline-offset: 1px;
}

.mag-textarea {
  resize: vertical;
  min-height: 50px;
}

.mag-select { cursor: pointer; }

.mag-input::placeholder,
.mag-textarea::placeholder {
  opacity: 0.4;
}

/* Comments */
.mag-comment {
  padding: 8px 0;
  border-bottom: 1px solid;
}

.mag-comment:last-child { border-bottom: none; }

.mag-comment-header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 4px;
}

/* DS token: @include paragraph('s') — 0.75rem (12px) */
.mag-comment-header p { font-size: 0.75rem; margin: 0; }
/* DS token: @include paragraph('m') — 0.875rem (14px) */
.mag-comment > p { font-size: 0.875rem; margin: 0 0 6px; }

.mag-comment-actions {
  display: flex;
  gap: 4px;
}

/* Footer */
.mag-footer {
  margin-top: 8px;
  padding-top: 10px;
  border-top: 1px solid;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

/* DS token: @include paragraph('s') — 0.75rem (12px) */
.mag-footer p { font-size: 0.75rem; margin: 0; }
.mag-footer a { font-size: 0.75rem; font-weight: 600; }

/* Button styles used by typography showcase — DS token: @include paragraph('m') + semibold */
.prev-btn {
  padding: 6px 14px;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.15s;
  white-space: nowrap;
}

.prev-btn.sm { padding: 4px 10px; font-size: 0.75rem; }
.prev-btn:hover { opacity: 0.85; }

/* DS token: @include paragraph('m') — 0.875rem (14px) */
.prev-input {
  height: 32px;
  padding: 0 10px;
  border: 1px solid;
  border-radius: 4px;
  font-size: 0.875rem;
  outline: none;
}

.prev-input::placeholder { opacity: 0.5; }

/* DS token: @include paragraph('s') — 0.75rem (12px) + semibold */
.prev-badge {
  padding: 2px 10px;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  white-space: nowrap;
}

/* ═══════════════════════════════════════════════════════════════════
   TYPOGRAPHY SHOWCASE (expanded arena)
   ═══════════════════════════════════════════════════════════════════ */

/* Hero / Display */
.typo-hero {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

/* DS token: @include display('s') — 2rem (32px), lh 1.15, ls -0.02em */
.typo-display {
  font-size: 2rem;
  font-weight: 900;
  line-height: 1.15;
  letter-spacing: -0.02em;
}

/* DS token: @include paragraph('xl') — 1.125rem (18px), lh 1.6 */
.typo-subtitle {
  font-size: 1.125rem;
  font-weight: 400;
  line-height: 1.6;
}

/* Headings */
.typo-headings {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.typo-headings h1,
.typo-headings h2,
.typo-headings h3,
.typo-headings h4,
.typo-headings h5,
.typo-headings h6 {
  margin: 0;
  line-height: 1.15;  /* DS: --lh-heading = 1.15 */
}

/* DS token: @include heading('2xl') — 3rem (48px) */
.typo-h1 { font-size: 3rem; font-weight: 700; letter-spacing: -0.02em; }
/* DS token: @include heading('xl') — 2.5rem (40px) */
.typo-h2 { font-size: 2.5rem; font-weight: 700; letter-spacing: -0.02em; }
/* DS token: @include heading('l') — 2rem (32px) */
.typo-h3 { font-size: 2rem; font-weight: 700; letter-spacing: -0.02em; }
/* DS token: @include heading('m') — 1.5rem (24px) */
.typo-h4 { font-size: 1.5rem; font-weight: 600; letter-spacing: -0.01em; }
/* DS token: @include heading('s') — 1.25rem (20px) */
.typo-h5 { font-size: 1.25rem; font-weight: 600; letter-spacing: -0.01em; }
/* DS token: @include heading('xs') — 1rem (16px) */
.typo-h6 { font-size: 1rem; font-weight: 600; letter-spacing: 0; }

/* Body Text */
.typo-body {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.typo-body p { margin: 0; }
/* DS token: @include paragraph('xl') — 1.125rem (18px), lh 1.6 */
.typo-lead { font-size: 1.125rem; line-height: 1.6; font-weight: 400; }
/* DS token: @include paragraph('l') — 1rem (16px), lh 1.6 */
.typo-paragraph { font-size: 1rem; line-height: 1.6; }
/* DS token: @include paragraph('s') — 0.75rem (12px), lh 1.6 */
.typo-small { font-size: 0.75rem; line-height: 1.6; }

/* Links */
.typo-links {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

/* DS token: @include paragraph('l') for link text */
.typo-link,
.typo-link-hover,
.typo-link-visited {
  font-size: 1rem;
  text-decoration: underline;
  cursor: pointer;
}

.typo-link-hover {
  text-decoration-style: dashed;
}

.typo-link-visited {
  text-decoration-style: dotted;
}

/* Text Colors */
.typo-colors {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

/* DS token: @include paragraph('s') — 0.75rem (12px), lh 1.6 */
.color-row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.75rem;
  line-height: 1.6;
}

.color-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
  border: 1px solid rgba(128,128,128,0.15);
}

.color-row-inverse {
  padding: 2px 8px;
  border-radius: 4px;
}

/* Font Weights */
.typo-weights {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

/* DS token: @include paragraph('l') — 1rem (16px) */
.weight-row {
  font-size: 1rem;
  line-height: 1.6;
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.w-num {
  font-style: normal;
  font-size: 10px;
  font-family: monospace;
  opacity: 0.5;
  width: 28px;
  flex-shrink: 0;
  text-align: right;
}

/* Type Scale */
.typo-scale {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.typo-scale .scale-row {
  display: flex;
  align-items: baseline;
  gap: 10px;
  padding: 4px 0;
}

.scale-label {
  font-size: 9px;
  font-weight: 600;
  text-transform: uppercase;
  width: 28px;
  flex-shrink: 0;
  text-align: right;
  font-family: monospace;
}

.scale-px {
  font-size: 9px;
  font-family: monospace;
  flex-shrink: 0;
  white-space: nowrap;
}

.typo-scale .scale-row span:nth-child(2) {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.2;
}

/* Code Block */
.typo-code-block {
  border: 1px solid;
  border-radius: 8px;
  padding: 12px 14px;
  overflow-x: auto;
}

.typo-pre {
  margin: 0;
  font-size: 11px;
  line-height: 1.6;
  white-space: pre;
}

/* Card Layout */
.typo-card {
  border: 1px solid;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* DS token: .nc-eyebrow pattern — 0.75rem (12px), uppercase, ls 0.2em */
.typo-card-badge {
  align-self: flex-start;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.2em;
}

/* DS token: @include heading('s') — 1.25rem (20px), lh 1.15 */
.typo-card-title {
  font-size: 1.25rem;
  font-weight: 700;
  line-height: 1.15;
  letter-spacing: -0.01em;
  margin: 0;
}

/* DS token: @include paragraph('l') — 1rem (16px), lh 1.6 */
.typo-card-desc {
  font-size: 1rem;
  line-height: 1.6;
  margin: 0;
}

/* DS token: @include paragraph('s') — 0.75rem (12px) */
.typo-card-meta {
  display: flex;
  gap: 6px;
  font-size: 0.75rem;
}

/* DS token: @include paragraph('m') — 0.875rem (14px) + semibold */
.typo-card-link {
  font-size: 0.875rem;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
}

.typo-card-link:hover {
  text-decoration: underline;
}

/* Inline Elements — DS token: @include paragraph('l') — 1rem, lh 1.6 */
.typo-inline p {
  margin: 0;
  font-size: 1rem;
  line-height: 1.6;
}

.typo-inline code {
  padding: 1px 5px;
  border-radius: 4px;
  font-size: 0.875rem;
}

.typo-inline mark {
  padding: 1px 4px;
  border-radius: 3px;
}

.typo-inline a {
  text-decoration: underline;
  cursor: pointer;
}

/* DS token: --fnd-font-weight-semibold (600) */
.typo-inline strong {
  font-weight: 600;
}

/* Lists */
.typo-lists {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* DS token: @include paragraph('l') — 1rem (16px), lh 1.6 */
.typo-ul,
.typo-ol {
  margin: 0;
  padding-left: 20px;
  font-size: 1rem;
  line-height: 1.6;
}

.typo-ul li,
.typo-ol li {
  padding: 1px 0;
}

/* Blockquote */
.typo-blockquote {
  margin: 0;
  padding: 12px 16px;
  border-left: 3px solid;
  border-radius: 0 8px 8px 0;
}

/* DS token: blockquote = @include paragraph('l') — 1rem (16px), lh 1.6 */
.typo-blockquote p {
  margin: 0;
  font-size: 1rem;
  font-style: italic;
  line-height: 1.6;
}

/* DS token: cite = @include paragraph('s') — 0.75rem (12px) */
.typo-blockquote cite {
  display: block;
  margin-top: 6px;
  font-size: 0.75rem;
  font-style: normal;
}

/* Feedback Messages */
.typo-feedback {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.fb-msg {
  padding: 10px 14px;
  border-left: 3px solid;
  border-radius: 0 6px 6px 0;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

/* DS token: .nc-eyebrow pattern — 0.75rem (12px), uppercase, ls 0.2em */
.fb-title {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.2em;
}

/* DS token: @include paragraph('m') — 0.875rem (14px) */
.fb-msg span:last-child {
  font-size: 0.875rem;
  line-height: 1.6;
}

/* Form Elements */
.typo-form {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

/* DS token: @include paragraph('m') — 0.875rem (14px) + semibold */
.form-label {
  font-size: 0.875rem;
  font-weight: 600;
}

/* DS token: @include paragraph('s') — 0.75rem (12px) */
.form-hint {
  font-size: 0.75rem;
}

/* DS token: @include paragraph('s') — 0.75rem (12px) */
.form-error {
  font-size: 0.75rem;
  font-weight: 500;
}
</style>
