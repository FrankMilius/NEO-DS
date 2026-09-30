<template>
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

<script setup>
// Theme Preview Mag — Standard-Vorschau fuer Sektionen ohne eigene Arena
// (Templates, Utilities, Typografie). Ausgelagert aus LaboratoryPanel.vue
// (Plan v2, 3.4) — Markup, Logik und Styles unveraendert.
import { ref, computed } from 'vue'
import { useThemeStore } from '../../../stores/theme.js'
import { foundationTokens } from '../../../data/tokens.js'
import { magTabs, feedItems, perfData, comments } from './magazin-daten.js'

const store = useThemeStore()
const typoTokens = foundationTokens.typography.tokens

// Theme tokens — reads directly from store (reactive to theme/mode changes)
const t = computed(() => {
  const mode = store.state.previewMode === 'split' ? 'light' : store.state.previewMode
  return store.state.themes[store.state.activeThemeSet][mode]
})

const currentBodyFont = computed(() => {
  const f = store.currentFoundation?.typography?.['font-body']
  return f || typoTokens['font-body'].value
})

const currentHeadingFont = computed(() => {
  const f = store.currentFoundation?.typography?.['font-heading']
  return f || typoTokens['font-heading'].value
})

const currentMonoFont = computed(() => {
  const f = store.currentFoundation?.typography?.['font-mono']
  return f || typoTokens['font-mono'].value
})

const activeView = ref('feature')

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
</script>

<style scoped src="./magazin-layout.css"></style>
<style scoped src="./magazin-elemente.css"></style>
