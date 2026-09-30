<template>
  <template v-if="hasSemanticCategory">
    <!-- ── CATEGORY SPECIMENS (Kategorie selektiert, kein Token) ── -->
    <template v-if="!selectedSemanticToken">
      <div :class="['arena-specimens-grid', `arena-specimens-grid--${store.state.previewMode}`]">

        <!-- ══════ TEXT CATEGORY ══════ -->
        <template v-if="semanticCategory === 'text'">

          <!-- Headings + Body Text -->
          <div class="arena-specimen">
            <span class="arena-specimen__label">Überschriften &amp; Fließtext</span>
            <div class="arena-specimen__pair">
              <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-base'] }">
                <div class="arena-text-specimen">
                  <h2 class="arena-text-h2" :style="{ color: tLight['text-primary'] }">Hauptüberschrift</h2>
                  <h3 class="arena-text-h3" :style="{ color: tLight['text-primary'] }">Unterüberschrift</h3>
                  <p class="arena-text-body" :style="{ color: tLight['text-secondary'] }">Dies ist ein Fließtext mit mittlerem Kontrast. Er wird für Beschreibungen, Artikeltexte und ergänzende Inhalte verwendet.</p>
                  <p class="arena-text-muted" :style="{ color: tLight['text-tertiary'] }">Tertiärer Hinweistext — dezent, für Hilfetexte und Metadaten.</p>
                </div>
              </div>
              <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
                <div class="arena-text-specimen">
                  <h2 class="arena-text-h2" :style="{ color: tDark['text-primary'] }">Hauptüberschrift</h2>
                  <h3 class="arena-text-h3" :style="{ color: tDark['text-primary'] }">Unterüberschrift</h3>
                  <p class="arena-text-body" :style="{ color: tDark['text-secondary'] }">Dies ist ein Fließtext mit mittlerem Kontrast. Er wird für Beschreibungen, Artikeltexte und ergänzende Inhalte verwendet.</p>
                  <p class="arena-text-muted" :style="{ color: tDark['text-tertiary'] }">Tertiärer Hinweistext — dezent, für Hilfetexte und Metadaten.</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Labels + Input -->
          <div class="arena-specimen">
            <span class="arena-specimen__label">Labels &amp; Formulare</span>
            <div class="arena-specimen__pair">
              <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-base'] }">
                <div class="arena-text-specimen">
                  <label class="arena-text-label" :style="{ color: tLight['text-primary'] }">Formular-Label</label>
                  <div class="arena-spec-input" :style="{ borderColor: tLight['border-primary'], color: tLight['text-tertiary'] }">Platzhalter-Text…</div>
                  <span class="arena-text-hint" :style="{ color: tLight['text-tertiary'] }">Hilfetext unter dem Eingabefeld</span>
                  <label class="arena-text-label arena-text-label--disabled" :style="{ color: tLight['text-disabled'] }">Deaktiviertes Label</label>
                </div>
              </div>
              <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
                <div class="arena-text-specimen">
                  <label class="arena-text-label" :style="{ color: tDark['text-primary'] }">Formular-Label</label>
                  <div class="arena-spec-input" :style="{ borderColor: tDark['border-primary'], color: tDark['text-tertiary'] }">Platzhalter-Text…</div>
                  <span class="arena-text-hint" :style="{ color: tDark['text-tertiary'] }">Hilfetext unter dem Eingabefeld</span>
                  <label class="arena-text-label arena-text-label--disabled" :style="{ color: tDark['text-disabled'] }">Deaktiviertes Label</label>
                </div>
              </div>
            </div>
          </div>

          <!-- Links -->
          <div class="arena-specimen">
            <span class="arena-specimen__label">Links</span>
            <div class="arena-specimen__pair">
              <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-base'] }">
                <div class="arena-text-specimen">
                  <p class="arena-text-body" :style="{ color: tLight['text-secondary'] }">
                    Text mit einem <span :style="{ color: tLight['text-link'], textDecoration: 'underline', cursor: 'pointer' }">Standard-Link</span> und einem
                    <span :style="{ color: tLight['text-link-hover'], textDecoration: 'underline', cursor: 'pointer' }">Hover-Link</span> im Fließtext.
                  </p>
                </div>
              </div>
              <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
                <div class="arena-text-specimen">
                  <p class="arena-text-body" :style="{ color: tDark['text-secondary'] }">
                    Text mit einem <span :style="{ color: tDark['text-link'], textDecoration: 'underline', cursor: 'pointer' }">Standard-Link</span> und einem
                    <span :style="{ color: tDark['text-link-hover'], textDecoration: 'underline', cursor: 'pointer' }">Hover-Link</span> im Fließtext.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Interaktive Text-Varianten (alle Button-Varianten + Tabs mit Token-Annotation) -->
          <div class="arena-specimen">
            <span class="arena-specimen__label">Interaktive Text-Varianten</span>
            <div class="arena-specimen__pair">
              <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-base'] }">
                <div class="arena-variant-grid">
                  <div class="arena-variant-item">
                    <button class="arena-spec-btn arena-spec-btn--primary" :style="{ background: tLight['interactive-default'], color: tLight['text-on-interactive'] }">Primary</button>
                    <span class="arena-variant-token">text-on-interactive</span>
                  </div>
                  <div class="arena-variant-item">
                    <button class="arena-spec-btn arena-spec-btn--secondary" :style="{ background: 'transparent', color: tLight['interactive-default'], borderColor: tLight['interactive-default'] }">Secondary</button>
                    <span class="arena-variant-token">interactive-default</span>
                  </div>
                  <div class="arena-variant-item">
                    <button class="arena-spec-btn arena-spec-btn--ghost" :style="{ background: 'transparent', color: tLight['text-primary'] }">Ghost</button>
                    <span class="arena-variant-token">text-primary</span>
                  </div>
                  <div class="arena-variant-item">
                    <button class="arena-spec-btn arena-spec-btn--primary" :style="{ background: tLight['interactive-default'], color: tLight['text-on-interactive'], opacity: 0.5 }">Disabled</button>
                    <span class="arena-variant-token">text-on-interactive</span>
                  </div>
                  <div class="arena-variant-separator"></div>
                  <div class="arena-variant-item">
                    <div class="arena-tab-group">
                      <span class="arena-tab arena-tab--active" :style="{ color: tLight['text-on-interactive'], background: tLight['interactive-default'] }">Active Tab</span>
                      <span class="arena-tab" :style="{ color: tLight['text-secondary'] }">Inactive</span>
                    </div>
                    <span class="arena-variant-token">text-on-interactive / text-secondary</span>
                  </div>
                  <div class="arena-variant-item">
                    <div class="arena-selected-chip" :style="{ background: tLight['interactive-default'], color: tLight['text-on-interactive'] }">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                      Selected
                    </div>
                    <span class="arena-variant-token">text-on-interactive</span>
                  </div>
                </div>
              </div>
              <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
                <div class="arena-variant-grid">
                  <div class="arena-variant-item">
                    <button class="arena-spec-btn arena-spec-btn--primary" :style="{ background: tDark['interactive-default'], color: tDark['text-on-interactive'] }">Primary</button>
                    <span class="arena-variant-token">text-on-interactive</span>
                  </div>
                  <div class="arena-variant-item">
                    <button class="arena-spec-btn arena-spec-btn--secondary" :style="{ background: 'transparent', color: tDark['interactive-default'], borderColor: tDark['interactive-default'] }">Secondary</button>
                    <span class="arena-variant-token">interactive-default</span>
                  </div>
                  <div class="arena-variant-item">
                    <button class="arena-spec-btn arena-spec-btn--ghost" :style="{ background: 'transparent', color: tDark['text-primary'] }">Ghost</button>
                    <span class="arena-variant-token">text-primary</span>
                  </div>
                  <div class="arena-variant-item">
                    <button class="arena-spec-btn arena-spec-btn--primary" :style="{ background: tDark['interactive-default'], color: tDark['text-on-interactive'], opacity: 0.5 }">Disabled</button>
                    <span class="arena-variant-token">text-on-interactive</span>
                  </div>
                  <div class="arena-variant-separator"></div>
                  <div class="arena-variant-item">
                    <div class="arena-tab-group">
                      <span class="arena-tab arena-tab--active" :style="{ color: tDark['text-on-interactive'], background: tDark['interactive-default'] }">Active Tab</span>
                      <span class="arena-tab" :style="{ color: tDark['text-secondary'] }">Inactive</span>
                    </div>
                    <span class="arena-variant-token">text-on-interactive / text-secondary</span>
                  </div>
                  <div class="arena-variant-item">
                    <div class="arena-selected-chip" :style="{ background: tDark['interactive-default'], color: tDark['text-on-interactive'] }">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                      Selected
                    </div>
                    <span class="arena-variant-token">text-on-interactive</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Inverse Text -->
          <div class="arena-specimen">
            <span class="arena-specimen__label">Inverse Text</span>
            <div class="arena-specimen__pair">
              <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-base'] }">
                <div class="arena-text-specimen">
                  <div class="arena-text-inverse-bar" :style="{ background: tLight['background-inverse'], color: tLight['text-inverse'], padding: '8px 12px', borderRadius: '6px', fontSize: '12px' }">Inverse Text auf dunkler Fläche</div>
                </div>
              </div>
              <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
                <div class="arena-text-specimen">
                  <div class="arena-text-inverse-bar" :style="{ background: tDark['background-inverse'], color: tDark['text-inverse'], padding: '8px 12px', borderRadius: '6px', fontSize: '12px' }">Inverse Text auf heller Fläche</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Feedback Text -->
          <div class="arena-specimen">
            <span class="arena-specimen__label">Status-Text</span>
            <div class="arena-specimen__pair">
              <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-base'] }">
                <div class="arena-text-specimen arena-text-specimen--row">
                  <span :style="{ color: tLight['text-success'], fontSize: '13px', fontWeight: 600 }">Erfolg-Meldung</span>
                  <span :style="{ color: tLight['text-danger'], fontSize: '13px', fontWeight: 600 }">Fehler-Meldung</span>
                  <span :style="{ color: tLight['text-warning'], fontSize: '13px', fontWeight: 600 }">Warnung</span>
                  <span :style="{ color: tLight['text-info'], fontSize: '13px', fontWeight: 600 }">Info-Hinweis</span>
                </div>
              </div>
              <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
                <div class="arena-text-specimen arena-text-specimen--row">
                  <span :style="{ color: tDark['text-success'], fontSize: '13px', fontWeight: 600 }">Erfolg-Meldung</span>
                  <span :style="{ color: tDark['text-danger'], fontSize: '13px', fontWeight: 600 }">Fehler-Meldung</span>
                  <span :style="{ color: tDark['text-warning'], fontSize: '13px', fontWeight: 600 }">Warnung</span>
                  <span :style="{ color: tDark['text-info'], fontSize: '13px', fontWeight: 600 }">Info-Hinweis</span>
                </div>
              </div>
            </div>
          </div>

        </template>

        <!-- ══════ BACKGROUND CATEGORY ══════ -->
        <template v-else-if="semanticCategory === 'background'">

          <!-- Base + Secondary + Tertiary -->
          <div class="arena-specimen">
            <span class="arena-specimen__label">Hintergrund-Ebenen</span>
            <div class="arena-specimen__pair">
              <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-base'] }">
                <div class="arena-bg-layers">
                  <div class="arena-bg-layer" :style="{ background: tLight['background-base'], borderColor: tLight['border-secondary'] }">
                    <span :style="{ color: tLight['text-primary'] }">Base</span>
                  </div>
                  <div class="arena-bg-layer" :style="{ background: tLight['background-secondary'], borderColor: tLight['border-secondary'] }">
                    <span :style="{ color: tLight['text-primary'] }">Secondary</span>
                  </div>
                  <div class="arena-bg-layer" :style="{ background: tLight['background-tertiary'], borderColor: tLight['border-secondary'] }">
                    <span :style="{ color: tLight['text-primary'] }">Tertiary</span>
                  </div>
                  <div class="arena-bg-layer" :style="{ background: tLight['background-quaternary'], borderColor: tLight['border-secondary'] }">
                    <span :style="{ color: tLight['text-primary'] }">Quaternary</span>
                  </div>
                </div>
              </div>
              <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
                <div class="arena-bg-layers">
                  <div class="arena-bg-layer" :style="{ background: tDark['background-base'], borderColor: tDark['border-secondary'] }">
                    <span :style="{ color: tDark['text-primary'] }">Base</span>
                  </div>
                  <div class="arena-bg-layer" :style="{ background: tDark['background-secondary'], borderColor: tDark['border-secondary'] }">
                    <span :style="{ color: tDark['text-primary'] }">Secondary</span>
                  </div>
                  <div class="arena-bg-layer" :style="{ background: tDark['background-tertiary'], borderColor: tDark['border-secondary'] }">
                    <span :style="{ color: tDark['text-primary'] }">Tertiary</span>
                  </div>
                  <div class="arena-bg-layer" :style="{ background: tDark['background-quaternary'], borderColor: tDark['border-secondary'] }">
                    <span :style="{ color: tDark['text-primary'] }">Quaternary</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Hover + Active + Disabled -->
          <div class="arena-specimen">
            <span class="arena-specimen__label">Zustands-Hintergründe</span>
            <div class="arena-specimen__pair">
              <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-base'] }">
                <div class="arena-bg-states">
                  <div class="arena-bg-state" :style="{ background: tLight['background-hover'] }"><span :style="{ color: tLight['text-primary'] }">Hover</span></div>
                  <div class="arena-bg-state" :style="{ background: tLight['background-active'] }"><span :style="{ color: tLight['text-primary'] }">Active</span></div>
                  <div class="arena-bg-state" :style="{ background: tLight['background-disabled'] }"><span :style="{ color: tLight['text-disabled'] }">Disabled</span></div>
                  <div class="arena-bg-state" :style="{ background: tLight['background-inverse'] }"><span :style="{ color: tLight['text-inverse'] }">Inverse</span></div>
                </div>
              </div>
              <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
                <div class="arena-bg-states">
                  <div class="arena-bg-state" :style="{ background: tDark['background-hover'] }"><span :style="{ color: tDark['text-primary'] }">Hover</span></div>
                  <div class="arena-bg-state" :style="{ background: tDark['background-active'] }"><span :style="{ color: tDark['text-primary'] }">Active</span></div>
                  <div class="arena-bg-state" :style="{ background: tDark['background-disabled'] }"><span :style="{ color: tDark['text-disabled'] }">Disabled</span></div>
                  <div class="arena-bg-state" :style="{ background: tDark['background-inverse'] }"><span :style="{ color: tDark['text-inverse'] }">Inverse</span></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Accent + Feedback BGs -->
          <div class="arena-specimen">
            <span class="arena-specimen__label">Akzent &amp; Feedback</span>
            <div class="arena-specimen__pair">
              <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-base'] }">
                <div class="arena-bg-states">
                  <div class="arena-bg-state" :style="{ background: tLight['background-accent'] }"><span :style="{ color: tLight['on-accent'] || tLight['text-primary'] }">Accent</span></div>
                  <div class="arena-bg-state" :style="{ background: tLight['background-accent-secondary'] }"><span :style="{ color: tLight['text-primary'] }">Accent 2</span></div>
                  <div class="arena-bg-state" :style="{ background: tLight['background-success'] }"><span :style="{ color: tLight['text-success'] }">Success</span></div>
                  <div class="arena-bg-state" :style="{ background: tLight['background-danger'] }"><span :style="{ color: tLight['text-danger'] }">Danger</span></div>
                  <div class="arena-bg-state" :style="{ background: tLight['background-warning'] }"><span :style="{ color: tLight['text-warning'] }">Warning</span></div>
                  <div class="arena-bg-state" :style="{ background: tLight['background-info'] }"><span :style="{ color: tLight['text-info'] }">Info</span></div>
                </div>
              </div>
              <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
                <div class="arena-bg-states">
                  <div class="arena-bg-state" :style="{ background: tDark['background-accent'] }"><span :style="{ color: tDark['on-accent'] || tDark['text-primary'] }">Accent</span></div>
                  <div class="arena-bg-state" :style="{ background: tDark['background-accent-secondary'] }"><span :style="{ color: tDark['text-primary'] }">Accent 2</span></div>
                  <div class="arena-bg-state" :style="{ background: tDark['background-success'] }"><span :style="{ color: tDark['text-success'] }">Success</span></div>
                  <div class="arena-bg-state" :style="{ background: tDark['background-danger'] }"><span :style="{ color: tDark['text-danger'] }">Danger</span></div>
                  <div class="arena-bg-state" :style="{ background: tDark['background-warning'] }"><span :style="{ color: tDark['text-warning'] }">Warning</span></div>
                  <div class="arena-bg-state" :style="{ background: tDark['background-info'] }"><span :style="{ color: tDark['text-info'] }">Info</span></div>
                </div>
              </div>
            </div>
          </div>

        </template>

        <!-- ══════ BORDER CATEGORY ══════ -->
        <template v-else-if="semanticCategory === 'border'">
          <div class="arena-specimen">
            <span class="arena-specimen__label">Rahmen-Varianten</span>
            <div class="arena-specimen__pair">
              <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-base'] }">
                <div class="arena-border-specimens">
                  <div class="arena-border-box" :style="{ borderColor: tLight['border-primary'] }"><span :style="{ color: tLight['text-primary'] }">Primary</span></div>
                  <div class="arena-border-box" :style="{ borderColor: tLight['border-secondary'] }"><span :style="{ color: tLight['text-primary'] }">Secondary</span></div>
                  <div class="arena-border-box" :style="{ borderColor: tLight['border-strong'] }"><span :style="{ color: tLight['text-primary'] }">Strong</span></div>
                  <div class="arena-border-box" :style="{ borderColor: tLight['border-disabled'], background: tLight['background-disabled'] }"><span :style="{ color: tLight['text-disabled'] }">Disabled</span></div>
                </div>
              </div>
              <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
                <div class="arena-border-specimens">
                  <div class="arena-border-box" :style="{ borderColor: tDark['border-primary'] }"><span :style="{ color: tDark['text-primary'] }">Primary</span></div>
                  <div class="arena-border-box" :style="{ borderColor: tDark['border-secondary'] }"><span :style="{ color: tDark['text-primary'] }">Secondary</span></div>
                  <div class="arena-border-box" :style="{ borderColor: tDark['border-strong'] }"><span :style="{ color: tDark['text-primary'] }">Strong</span></div>
                  <div class="arena-border-box" :style="{ borderColor: tDark['border-disabled'], background: tDark['background-disabled'] }"><span :style="{ color: tDark['text-disabled'] }">Disabled</span></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Feedback Borders -->
          <div class="arena-specimen">
            <span class="arena-specimen__label">Feedback-Rahmen</span>
            <div class="arena-specimen__pair">
              <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-base'] }">
                <div class="arena-border-specimens">
                  <div class="arena-border-box" :style="{ borderColor: tLight['border-success'], background: tLight['background-success'] }"><span :style="{ color: tLight['text-success'] }">Success</span></div>
                  <div class="arena-border-box" :style="{ borderColor: tLight['border-danger'], background: tLight['background-danger'] }"><span :style="{ color: tLight['text-danger'] }">Danger</span></div>
                  <div class="arena-border-box" :style="{ borderColor: tLight['border-warning'], background: tLight['background-warning'] }"><span :style="{ color: tLight['text-warning'] }">Warning</span></div>
                  <div class="arena-border-box" :style="{ borderColor: tLight['border-info'], background: tLight['background-info'] }"><span :style="{ color: tLight['text-info'] }">Info</span></div>
                </div>
              </div>
              <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
                <div class="arena-border-specimens">
                  <div class="arena-border-box" :style="{ borderColor: tDark['border-success'], background: tDark['background-success'] }"><span :style="{ color: tDark['text-success'] }">Success</span></div>
                  <div class="arena-border-box" :style="{ borderColor: tDark['border-danger'], background: tDark['background-danger'] }"><span :style="{ color: tDark['text-danger'] }">Danger</span></div>
                  <div class="arena-border-box" :style="{ borderColor: tDark['border-warning'], background: tDark['background-warning'] }"><span :style="{ color: tDark['text-warning'] }">Warning</span></div>
                  <div class="arena-border-box" :style="{ borderColor: tDark['border-info'], background: tDark['background-info'] }"><span :style="{ color: tDark['text-info'] }">Info</span></div>
                </div>
              </div>
            </div>
          </div>
        </template>

        <!-- ══════ INTERACTIVE CATEGORY ══════ -->
        <template v-else-if="semanticCategory === 'interactive'">
          <div class="arena-specimen">
            <span class="arena-specimen__label">Interaktive Elemente</span>
            <div class="arena-specimen__pair">
              <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-base'] }">
                <div class="arena-text-specimen">
                  <button class="arena-spec-btn arena-spec-btn--primary" :style="{ background: tLight['interactive-default'], color: tLight['text-on-interactive'] }">Default</button>
                  <button class="arena-spec-btn arena-spec-btn--primary" :style="{ background: tLight['interactive-hover'], color: tLight['text-on-interactive'] }">Hover</button>
                  <button class="arena-spec-btn arena-spec-btn--primary" :style="{ background: tLight['interactive-active'], color: tLight['text-on-interactive'] }">Active</button>
                  <div :style="{ display: 'flex', gap: '12px', alignItems: 'center' }">
                    <a :style="{ color: tLight['text-link'], textDecoration: 'underline', fontSize: '13px' }">Link</a>
                    <a :style="{ color: tLight['interactive-visited'], textDecoration: 'underline', fontSize: '13px' }">Visited</a>
                  </div>
                  <div class="arena-focus-demo" :style="{ borderColor: tLight['border-primary'], outlineColor: tLight['interactive-focus'] }">
                    <span :style="{ color: tLight['text-primary'], fontSize: '12px' }">Focus Ring</span>
                  </div>
                </div>
              </div>
              <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
                <div class="arena-text-specimen">
                  <button class="arena-spec-btn arena-spec-btn--primary" :style="{ background: tDark['interactive-default'], color: tDark['text-on-interactive'] }">Default</button>
                  <button class="arena-spec-btn arena-spec-btn--primary" :style="{ background: tDark['interactive-hover'], color: tDark['text-on-interactive'] }">Hover</button>
                  <button class="arena-spec-btn arena-spec-btn--primary" :style="{ background: tDark['interactive-active'], color: tDark['text-on-interactive'] }">Active</button>
                  <div :style="{ display: 'flex', gap: '12px', alignItems: 'center' }">
                    <a :style="{ color: tDark['text-link'], textDecoration: 'underline', fontSize: '13px' }">Link</a>
                    <a :style="{ color: tDark['interactive-visited'], textDecoration: 'underline', fontSize: '13px' }">Visited</a>
                  </div>
                  <div class="arena-focus-demo" :style="{ borderColor: tDark['border-primary'], outlineColor: tDark['interactive-focus'] }">
                    <span :style="{ color: tDark['text-primary'], fontSize: '12px' }">Focus Ring</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>

        <!-- ══════ FEEDBACK CATEGORY ══════ -->
        <template v-else-if="semanticCategory === 'feedback'">
          <div class="arena-specimen">
            <span class="arena-specimen__label">Feedback-Komponenten</span>
            <div class="arena-specimen__pair">
              <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-base'] }">
                <div class="arena-feedback-list">
                  <div class="arena-spec-alert" :style="{ background: tLight['background-info'], borderColor: tLight['border-info'], color: tLight['feedback-info'] }">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg> Info-Hinweis
                  </div>
                  <div class="arena-spec-alert" :style="{ background: tLight['background-success'], borderColor: tLight['border-success'], color: tLight['feedback-success'] }">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12l5 5l10 -10"/></svg> Erfolgsmeldung
                  </div>
                  <div class="arena-spec-alert" :style="{ background: tLight['background-warning'], borderColor: tLight['border-warning'], color: tLight['feedback-warning'] }">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 9v2m0 4v.01"/><path d="M5 19h14a2 2 0 0 0 1.84-2.75l-7.1-12.25a2 2 0 0 0-3.5 0l-7.1 12.25a2 2 0 0 0 1.84 2.75"/></svg> Warnhinweis
                  </div>
                  <div class="arena-spec-alert" :style="{ background: tLight['background-danger'], borderColor: tLight['border-danger'], color: tLight['feedback-danger'] }">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M15 9l-6 6"/><path d="M9 9l6 6"/></svg> Fehlermeldung
                  </div>
                </div>
              </div>
              <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
                <div class="arena-feedback-list">
                  <div class="arena-spec-alert" :style="{ background: tDark['background-info'], borderColor: tDark['border-info'], color: tDark['feedback-info'] }">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg> Info-Hinweis
                  </div>
                  <div class="arena-spec-alert" :style="{ background: tDark['background-success'], borderColor: tDark['border-success'], color: tDark['feedback-success'] }">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12l5 5l10 -10"/></svg> Erfolgsmeldung
                  </div>
                  <div class="arena-spec-alert" :style="{ background: tDark['background-warning'], borderColor: tDark['border-warning'], color: tDark['feedback-warning'] }">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 9v2m0 4v.01"/><path d="M5 19h14a2 2 0 0 0 1.84-2.75l-7.1-12.25a2 2 0 0 0-3.5 0l-7.1 12.25a2 2 0 0 0 1.84 2.75"/></svg> Warnhinweis
                  </div>
                  <div class="arena-spec-alert" :style="{ background: tDark['background-danger'], borderColor: tDark['border-danger'], color: tDark['feedback-danger'] }">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M15 9l-6 6"/><path d="M9 9l6 6"/></svg> Fehlermeldung
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>

        <!-- ══════ LAYER / SURFACE CATEGORY ══════ -->
        <template v-else-if="semanticCategory === 'layer'">
          <div class="arena-specimen">
            <span class="arena-specimen__label">Oberflächen-Ebenen</span>
            <div class="arena-specimen__pair">
              <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-base'] }">
                <div class="arena-layer-stack">
                  <div class="arena-layer-card" :style="{ background: tLight['layer-01'], borderColor: tLight['border-secondary'] }">
                    <span :style="{ color: tLight['on-layer-01'] || tLight['text-primary'] }">Surface 01 — Karte</span>
                    <div class="arena-layer-card arena-layer-card--nested" :style="{ background: tLight['layer-02'], borderColor: tLight['border-secondary'] }">
                      <span :style="{ color: tLight['on-layer-02'] || tLight['text-primary'] }">Surface 02 — Input in Karte</span>
                      <div class="arena-layer-card arena-layer-card--nested" :style="{ background: tLight['layer-03'], borderColor: tLight['border-secondary'] }">
                        <span :style="{ color: tLight['text-primary'] }">Surface 03 — Dropdown</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
                <div class="arena-layer-stack">
                  <div class="arena-layer-card" :style="{ background: tDark['layer-01'], borderColor: tDark['border-secondary'] }">
                    <span :style="{ color: tDark['on-layer-01'] || tDark['text-primary'] }">Surface 01 — Karte</span>
                    <div class="arena-layer-card arena-layer-card--nested" :style="{ background: tDark['layer-02'], borderColor: tDark['border-secondary'] }">
                      <span :style="{ color: tDark['on-layer-02'] || tDark['text-primary'] }">Surface 02 — Input in Karte</span>
                      <div class="arena-layer-card arena-layer-card--nested" :style="{ background: tDark['layer-03'], borderColor: tDark['border-secondary'] }">
                        <span :style="{ color: tDark['text-primary'] }">Surface 03 — Dropdown</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>

        <!-- ══════ ON-COLOR CATEGORY ══════ -->
        <template v-else-if="semanticCategory === 'on-color'">
          <div class="arena-specimen">
            <span class="arena-specimen__label">Text auf farbigen Flächen</span>
            <div class="arena-specimen__pair">
              <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-base'] }">
                <div class="arena-on-color-grid">
                  <div class="arena-on-color-chip" :style="{ background: tLight['background-base'], borderColor: tLight['border-secondary'] }"><span :style="{ color: tLight['on-surface'] }">On Surface</span></div>
                  <div class="arena-on-color-chip" :style="{ background: tLight['layer-01'] }"><span :style="{ color: tLight['on-layer-01'] || tLight['text-primary'] }">On Layer 01</span></div>
                  <div class="arena-on-color-chip" :style="{ background: tLight['layer-02'] }"><span :style="{ color: tLight['on-layer-02'] || tLight['text-primary'] }">On Layer 02</span></div>
                  <div class="arena-on-color-chip" :style="{ background: tLight['background-accent'] }"><span :style="{ color: tLight['on-accent'] }">On Accent</span></div>
                  <div class="arena-on-color-chip" :style="{ background: tLight['background-success'] }"><span :style="{ color: tLight['on-success'] }">On Success</span></div>
                  <div class="arena-on-color-chip" :style="{ background: tLight['background-warning'] }"><span :style="{ color: tLight['on-warning'] }">On Warning</span></div>
                  <div class="arena-on-color-chip" :style="{ background: tLight['background-danger'] }"><span :style="{ color: tLight['on-danger'] }">On Danger</span></div>
                  <div class="arena-on-color-chip" :style="{ background: tLight['background-info'] }"><span :style="{ color: tLight['on-info'] }">On Info</span></div>
                </div>
              </div>
              <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
                <div class="arena-on-color-grid">
                  <div class="arena-on-color-chip" :style="{ background: tDark['background-base'], borderColor: tDark['border-secondary'] }"><span :style="{ color: tDark['on-surface'] }">On Surface</span></div>
                  <div class="arena-on-color-chip" :style="{ background: tDark['layer-01'] }"><span :style="{ color: tDark['on-layer-01'] || tDark['text-primary'] }">On Layer 01</span></div>
                  <div class="arena-on-color-chip" :style="{ background: tDark['layer-02'] }"><span :style="{ color: tDark['on-layer-02'] || tDark['text-primary'] }">On Layer 02</span></div>
                  <div class="arena-on-color-chip" :style="{ background: tDark['background-accent'] }"><span :style="{ color: tDark['on-accent'] }">On Accent</span></div>
                  <div class="arena-on-color-chip" :style="{ background: tDark['background-success'] }"><span :style="{ color: tDark['on-success'] }">On Success</span></div>
                  <div class="arena-on-color-chip" :style="{ background: tDark['background-warning'] }"><span :style="{ color: tDark['on-warning'] }">On Warning</span></div>
                  <div class="arena-on-color-chip" :style="{ background: tDark['background-danger'] }"><span :style="{ color: tDark['on-danger'] }">On Danger</span></div>
                  <div class="arena-on-color-chip" :style="{ background: tDark['background-info'] }"><span :style="{ color: tDark['on-info'] }">On Info</span></div>
                </div>
              </div>
            </div>
          </div>
        </template>

      </div>
    </template>

    <!-- ── TOKEN-DETAIL (Token selektiert) ── -->
    <template v-else>

      <!-- Hero Single Swatch (aktives Theme) -->
      <div class="arena-token-hero">
        <div class="arena-hero-swatch" :style="{ background: activeThemeBg }">
          <div class="arena-hero-swatch__color" :style="{ background: activeThemeTokenValue }">
            <span class="arena-hero-swatch__hex" :style="{ color: contrastColor(activeThemeTokenValue) }">{{ activeThemeTokenValue }}</span>
          </div>
        </div>
        <div class="arena-token-meta">
          <code class="arena-token-name">--fnd-color-{{ selectedSemanticToken.id }}</code>
          <span class="arena-token-mode-badge">{{ activeThemeMode === 'dark' ? 'Dark' : 'Light' }}</span>
          <span v-if="selectedSemanticToken.description" class="arena-token-desc">{{ selectedSemanticToken.description }}</span>
        </div>
      </div>

      <!-- Affected Specimens -->
      <template v-if="activeSpecimens.length">
        <h5 class="arena-sub-heading">Betroffene Komponenten</h5>
        <div :class="['arena-specimens-grid', `arena-specimens-grid--${store.state.previewMode}`]">
          <!-- Re-use same specimen blocks, but only for affected ones -->

          <div v-if="activeSpecimens.includes('buttons')" :class="['arena-specimen', { 'arena-specimen--pulse': highlightedSpecimens.has('buttons') }]">
            <span class="arena-specimen__label">Buttons</span>
            <div class="arena-specimen__pair">
              <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-base'] }">
                <button class="arena-spec-btn arena-spec-btn--primary" :style="{ background: tLight['interactive-default'], color: tLight['text-on-interactive'] }">Primary</button>
                <button class="arena-spec-btn arena-spec-btn--secondary" :style="{ background: 'transparent', color: tLight['interactive-default'], borderColor: tLight['interactive-default'] }">Secondary</button>
                <button class="arena-spec-btn arena-spec-btn--ghost" :style="{ background: 'transparent', color: tLight['text-primary'] }">Ghost</button>
              </div>
              <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
                <button class="arena-spec-btn arena-spec-btn--primary" :style="{ background: tDark['interactive-default'], color: tDark['text-on-interactive'] }">Primary</button>
                <button class="arena-spec-btn arena-spec-btn--secondary" :style="{ background: 'transparent', color: tDark['interactive-default'], borderColor: tDark['interactive-default'] }">Secondary</button>
                <button class="arena-spec-btn arena-spec-btn--ghost" :style="{ background: 'transparent', color: tDark['text-primary'] }">Ghost</button>
              </div>
            </div>
          </div>

          <div v-if="activeSpecimens.includes('input')" :class="['arena-specimen', { 'arena-specimen--pulse': highlightedSpecimens.has('input') }]">
            <span class="arena-specimen__label">Input</span>
            <div class="arena-specimen__pair">
              <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-base'] }">
                <span class="arena-spec-input-label" :style="{ color: tLight['text-primary'] }">Label</span>
                <div class="arena-spec-input" :style="{ background: tLight['background-base'], borderColor: tLight['border-primary'], color: tLight['text-tertiary'] }">Placeholder…</div>
              </div>
              <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
                <span class="arena-spec-input-label" :style="{ color: tDark['text-primary'] }">Label</span>
                <div class="arena-spec-input" :style="{ background: tDark['background-base'], borderColor: tDark['border-primary'], color: tDark['text-tertiary'] }">Placeholder…</div>
              </div>
            </div>
          </div>

          <div v-if="activeSpecimens.includes('badges')" :class="['arena-specimen', { 'arena-specimen--pulse': highlightedSpecimens.has('badges') }]">
            <span class="arena-specimen__label">Badges</span>
            <div class="arena-specimen__pair">
              <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-base'] }">
                <div class="arena-spec-badge-row">
                  <span class="arena-spec-badge" :style="{ background: tLight['background-success'], color: tLight['text-success'] }">Erfolg</span>
                  <span class="arena-spec-badge" :style="{ background: tLight['background-danger'], color: tLight['text-danger'] }">Fehler</span>
                  <span class="arena-spec-badge" :style="{ background: tLight['background-warning'], color: tLight['text-warning'] }">Warnung</span>
                  <span class="arena-spec-badge" :style="{ background: tLight['background-info'], color: tLight['text-info'] }">Info</span>
                </div>
              </div>
              <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
                <div class="arena-spec-badge-row">
                  <span class="arena-spec-badge" :style="{ background: tDark['background-success'], color: tDark['text-success'] }">Erfolg</span>
                  <span class="arena-spec-badge" :style="{ background: tDark['background-danger'], color: tDark['text-danger'] }">Fehler</span>
                  <span class="arena-spec-badge" :style="{ background: tDark['background-warning'], color: tDark['text-warning'] }">Warnung</span>
                  <span class="arena-spec-badge" :style="{ background: tDark['background-info'], color: tDark['text-info'] }">Info</span>
                </div>
              </div>
            </div>
          </div>

          <div v-if="activeSpecimens.includes('alert')" :class="['arena-specimen', { 'arena-specimen--pulse': highlightedSpecimens.has('alert') }]">
            <span class="arena-specimen__label">Alerts</span>
            <div class="arena-specimen__pair">
              <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-base'] }">
                <div class="arena-spec-alert" :style="{ background: tLight['background-success'], borderColor: tLight['border-success'], color: tLight['feedback-success'] }">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12l5 5l10 -10"/></svg> Erfolg
                </div>
                <div class="arena-spec-alert" :style="{ background: tLight['background-danger'], borderColor: tLight['border-danger'], color: tLight['feedback-danger'] }">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 9v2m0 4v.01"/><path d="M5 19h14a2 2 0 0 0 1.84-2.75l-7.1-12.25a2 2 0 0 0-3.5 0l-7.1 12.25a2 2 0 0 0 1.84 2.75"/></svg> Fehler
                </div>
              </div>
              <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
                <div class="arena-spec-alert" :style="{ background: tDark['background-success'], borderColor: tDark['border-success'], color: tDark['feedback-success'] }">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12l5 5l10 -10"/></svg> Erfolg
                </div>
                <div class="arena-spec-alert" :style="{ background: tDark['background-danger'], borderColor: tDark['border-danger'], color: tDark['feedback-danger'] }">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 9v2m0 4v.01"/><path d="M5 19h14a2 2 0 0 0 1.84-2.75l-7.1-12.25a2 2 0 0 0-3.5 0l-7.1 12.25a2 2 0 0 0 1.84 2.75"/></svg> Fehler
                </div>
              </div>
            </div>
          </div>

          <div v-if="activeSpecimens.includes('toggle')" :class="['arena-specimen', { 'arena-specimen--pulse': highlightedSpecimens.has('toggle') }]">
            <span class="arena-specimen__label">Toggle</span>
            <div class="arena-specimen__pair">
              <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-base'] }">
                <div class="arena-spec-toggle-row">
                  <div class="arena-spec-toggle arena-spec-toggle--on" :style="{ background: tLight['interactive-default'] }"><div class="arena-spec-toggle__knob"></div></div>
                  <div class="arena-spec-toggle arena-spec-toggle--off" :style="{ background: tLight['background-tertiary'] }"><div class="arena-spec-toggle__knob"></div></div>
                </div>
              </div>
              <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
                <div class="arena-spec-toggle-row">
                  <div class="arena-spec-toggle arena-spec-toggle--on" :style="{ background: tDark['interactive-default'] }"><div class="arena-spec-toggle__knob"></div></div>
                  <div class="arena-spec-toggle arena-spec-toggle--off" :style="{ background: tDark['background-tertiary'] }"><div class="arena-spec-toggle__knob"></div></div>
                </div>
              </div>
            </div>
          </div>

          <div v-if="activeSpecimens.includes('navigation')" :class="['arena-specimen', { 'arena-specimen--pulse': highlightedSpecimens.has('navigation') }]">
            <span class="arena-specimen__label">Navigation</span>
            <div class="arena-specimen__pair">
              <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-base'] }">
                <div class="arena-spec-link-list">
                  <a class="arena-spec-link" :style="{ color: tLight['text-link'] }">Standard-Link</a>
                  <a class="arena-spec-link arena-spec-link--hover" :style="{ color: tLight['text-link-hover'] }">Hover-Link</a>
                  <a class="arena-spec-link arena-spec-link--visited" :style="{ color: tLight['interactive-visited'] || tLight['text-link'] }">Visited-Link</a>
                </div>
              </div>
              <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
                <div class="arena-spec-link-list">
                  <a class="arena-spec-link" :style="{ color: tDark['text-link'] }">Standard-Link</a>
                  <a class="arena-spec-link arena-spec-link--hover" :style="{ color: tDark['text-link-hover'] }">Hover-Link</a>
                  <a class="arena-spec-link arena-spec-link--visited" :style="{ color: tDark['interactive-visited'] || tDark['text-link'] }">Visited-Link</a>
                </div>
              </div>
            </div>
          </div>

          <div v-if="activeSpecimens.includes('textblock')" :class="['arena-specimen', { 'arena-specimen--pulse': highlightedSpecimens.has('textblock') }]">
            <span class="arena-specimen__label">Text-Block</span>
            <div class="arena-specimen__pair">
              <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-base'] }">
                <div class="arena-spec-text">
                  <span class="arena-spec-text__heading" :style="{ color: tLight['text-primary'] }">Überschrift</span>
                  <span class="arena-spec-text__body" :style="{ color: tLight['text-secondary'] }">Fließtext und Beschreibung</span>
                  <span class="arena-spec-text__muted" :style="{ color: tLight['text-tertiary'] }">Ergänzender Hinweis</span>
                  <span class="arena-spec-text__disabled" :style="{ color: tLight['text-disabled'] }">Deaktiviert</span>
                </div>
              </div>
              <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
                <div class="arena-spec-text">
                  <span class="arena-spec-text__heading" :style="{ color: tDark['text-primary'] }">Überschrift</span>
                  <span class="arena-spec-text__body" :style="{ color: tDark['text-secondary'] }">Fließtext und Beschreibung</span>
                  <span class="arena-spec-text__muted" :style="{ color: tDark['text-tertiary'] }">Ergänzender Hinweis</span>
                  <span class="arena-spec-text__disabled" :style="{ color: tDark['text-disabled'] }">Deaktiviert</span>
                </div>
              </div>
            </div>
          </div>

          <div v-if="activeSpecimens.includes('tablerow')" :class="['arena-specimen', { 'arena-specimen--pulse': highlightedSpecimens.has('tablerow') }]">
            <span class="arena-specimen__label">Table Row</span>
            <div class="arena-specimen__pair">
              <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-base'] }">
                <div class="arena-spec-table">
                  <div class="arena-spec-table__header" :style="{ background: tLight['layer-01'], borderColor: tLight['border-secondary'] }">
                    <span :style="{ color: tLight['text-primary'] }">Spalte A</span>
                    <span :style="{ color: tLight['text-primary'] }">Spalte B</span>
                  </div>
                  <div class="arena-spec-table__row" :style="{ background: tLight['layer-02'], borderColor: tLight['border-secondary'] }">
                    <span :style="{ color: tLight['text-primary'] }">Wert 1</span>
                    <span :style="{ color: tLight['text-secondary'] }">Detail</span>
                  </div>
                </div>
              </div>
              <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
                <div class="arena-spec-table">
                  <div class="arena-spec-table__header" :style="{ background: tDark['layer-01'], borderColor: tDark['border-secondary'] }">
                    <span :style="{ color: tDark['text-primary'] }">Spalte A</span>
                    <span :style="{ color: tDark['text-primary'] }">Spalte B</span>
                  </div>
                  <div class="arena-spec-table__row" :style="{ background: tDark['layer-02'], borderColor: tDark['border-secondary'] }">
                    <span :style="{ color: tDark['text-primary'] }">Wert 1</span>
                    <span :style="{ color: tDark['text-secondary'] }">Detail</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-if="activeSpecimens.includes('codesnippet')" :class="['arena-specimen', { 'arena-specimen--pulse': highlightedSpecimens.has('codesnippet') }]">
            <span class="arena-specimen__label">Code Snippet</span>
            <div class="arena-specimen__pair">
              <div class="arena-specimen__panel arena-specimen__panel--light" :style="{ background: tLight['background-base'] }">
                <div class="arena-spec-code" :style="{ background: tLight['layer-01'], borderColor: tLight['border-secondary'] }">
                  <span :style="{ color: tLight['text-tertiary'] }">// comment</span>
                  <span><span :style="{ color: tLight['text-secondary'] }">const</span> <span :style="{ color: tLight['text-primary'] }">x</span> <span :style="{ color: tLight['text-secondary'] }">=</span> <span :style="{ color: tLight['text-primary'] }">42</span><span :style="{ color: tLight['text-tertiary'] }">;</span></span>
                </div>
              </div>
              <div class="arena-specimen__panel" :style="{ background: tDark['background-base'] }">
                <div class="arena-spec-code" :style="{ background: tDark['layer-01'], borderColor: tDark['border-secondary'] }">
                  <span :style="{ color: tDark['text-tertiary'] }">// comment</span>
                  <span><span :style="{ color: tDark['text-secondary'] }">const</span> <span :style="{ color: tDark['text-primary'] }">x</span> <span :style="{ color: tDark['text-secondary'] }">=</span> <span :style="{ color: tDark['text-primary'] }">42</span><span :style="{ color: tDark['text-tertiary'] }">;</span></span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </template>

      <!-- Empty State -->
      <p v-if="!activeSpecimens.length" class="arena-empty">
        Dieses Token wird nicht direkt in den Specimen-Vorschauen verwendet.
      </p>

      <!-- Component Dependencies -->
      <div v-if="semanticToComponents[selectedSemanticToken.id]?.length" class="arena-component-deps">
        <h5 class="arena-sub-heading">Abhängige Komponenten-Tokens</h5>
        <div class="arena-dep-chips">
          <span v-for="dep in semanticToComponents[selectedSemanticToken.id]" :key="dep.tokenId" class="arena-dep-chip">
            {{ dep.component }} → {{ dep.label }}
          </span>
        </div>
      </div>

    </template>
  </template>
</template>

<script setup>
// Farben-Arena: Specimens je Semantic-Kategorie und Token-Detail.
// Ausgelagert aus LaboratoryPanel.vue (Plan v2, 3.4).
import { useFarbenArena } from './farben-arena.js'

const {
  store, semanticCategory, hasSemanticCategory, selectedSemanticToken, tLight, tDark,
  activeThemeMode, activeThemeTokenValue, activeThemeBg, activeSpecimens,
  semanticToComponents, highlightedSpecimens, contrastColor
} = useFarbenArena()
</script>

<style scoped src="./farben-arena.css"></style>
