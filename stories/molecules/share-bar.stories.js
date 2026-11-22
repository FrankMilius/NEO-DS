// ============================================================
// ShareBar — Auto-generated from share-bar-recipe.json
// Version: 1.0.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Molecules/ShareBar',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**ShareBar** v1.0.0 (stable)

Leiste mit Haarlinien oben und unten und Icon-Buttons zum Teilen eines Artikels: Teilen (Web Share), LinkedIn, E-Mail, Link kopieren. Dazu die Blase __popover fuer eine markierte Textstelle („Zitat teilen“, „Link kopieren“).


`,
      },
    },
    status: { type: 'stable' },
  },
  argTypes: {},
};

export const Default = {
  name: 'Leiste (nur Symbole)',
  render: () => `<div class="nc-share-bar" role="group" aria-label="Artikel teilen"><div class="nc-share-bar__actions"><button class="nc-button nc-button--ghost nc-button--icon-only nc-button--sm" type="button" aria-label="Teilen"><span class="nc-button__icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M3 12a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"/><path d="M15 6a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"/><path d="M15 18a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"/><path d="M8.7 10.7l6.6 -3.4"/><path d="M8.7 13.3l6.6 3.4"/></svg></span></button><a class="nc-button nc-button--ghost nc-button--icon-only nc-button--sm" href="https://www.linkedin.com/sharing/share-offsite/?url=https%3A%2F%2Fexample.org%2Finside%2Fblog%2Fki-assistenten-im-intranet" aria-label="Auf LinkedIn teilen (öffnet in neuem Tab)" target="_blank" rel="noopener noreferrer"><span class="nc-button__icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M8 11v5"/><path d="M8 8v.01"/><path d="M12 16v-5"/><path d="M16 16v-3a2 2 0 1 0 -4 0"/><path d="M3 7a4 4 0 0 1 4 -4h10a4 4 0 0 1 4 4v10a4 4 0 0 1 -4 4h-10a4 4 0 0 1 -4 -4l0 -10"/></svg></span></a><a class="nc-button nc-button--ghost nc-button--icon-only nc-button--sm" href="mailto:?subject=Warum%20KI-Assistenten%20im%20Intranet%20scheitern%20und%20wie%20es%20besser%20geht&amp;body=https%3A%2F%2Fexample.org%2Finside%2Fblog%2Fki-assistenten-im-intranet" aria-label="Per E-Mail teilen"><span class="nc-button__icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M3 7a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-10"/><path d="M3 7l9 6l9 -6"/></svg></span></a><button class="nc-button nc-button--ghost nc-button--icon-only nc-button--sm" type="button" aria-label="Link kopieren"><span class="nc-button__icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M9 15l6 -6"/><path d="M11 6l.463 -.536a5 5 0 0 1 7.071 7.072l-.534 .464"/><path d="M13 18l-.397 .534a5.068 5.068 0 0 1 -7.127 0a4.972 4.972 0 0 1 0 -7.071l.524 -.463"/></svg></span></button></div></div>`,
};

export const MitBeschriftung = {
  name: 'Mit Beschriftung',
  render: () => `<div class="nc-share-bar" role="group" aria-label="Artikel teilen"><span class="nc-share-bar__label" aria-hidden="true">Teilen</span><div class="nc-share-bar__actions"><button class="nc-button nc-button--ghost nc-button--icon-only nc-button--sm" type="button" aria-label="Teilen"><span class="nc-button__icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M3 12a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"/><path d="M15 6a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"/><path d="M15 18a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"/><path d="M8.7 10.7l6.6 -3.4"/><path d="M8.7 13.3l6.6 3.4"/></svg></span></button><a class="nc-button nc-button--ghost nc-button--icon-only nc-button--sm" href="https://www.linkedin.com/sharing/share-offsite/?url=https%3A%2F%2Fexample.org%2Finside%2Fblog%2Fki-assistenten-im-intranet" aria-label="Auf LinkedIn teilen (öffnet in neuem Tab)" target="_blank" rel="noopener noreferrer"><span class="nc-button__icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M8 11v5"/><path d="M8 8v.01"/><path d="M12 16v-5"/><path d="M16 16v-3a2 2 0 1 0 -4 0"/><path d="M3 7a4 4 0 0 1 4 -4h10a4 4 0 0 1 4 4v10a4 4 0 0 1 -4 4h-10a4 4 0 0 1 -4 -4l0 -10"/></svg></span></a><a class="nc-button nc-button--ghost nc-button--icon-only nc-button--sm" href="mailto:?subject=Warum%20KI-Assistenten%20im%20Intranet%20scheitern%20und%20wie%20es%20besser%20geht&amp;body=https%3A%2F%2Fexample.org%2Finside%2Fblog%2Fki-assistenten-im-intranet" aria-label="Per E-Mail teilen"><span class="nc-button__icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M3 7a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-10"/><path d="M3 7l9 6l9 -6"/></svg></span></a><button class="nc-button nc-button--ghost nc-button--icon-only nc-button--sm" type="button" aria-label="Link kopieren"><span class="nc-button__icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M9 15l6 -6"/><path d="M11 6l.463 -.536a5 5 0 0 1 7.071 7.072l-.534 .464"/><path d="M13 18l-.397 .534a5.068 5.068 0 0 1 -7.127 0a4.972 4.972 0 0 1 0 -7.071l.524 -.463"/></svg></span></button></div></div>`,
};

export const BlaseanderTextstelle = {
  name: 'Blase an der Textstelle',
  render: () => `<div style="display: grid; justify-items: center; gap: var(--fnd-spacing-03); padding-block-start: var(--fnd-spacing-04);"><div class="nc-share-bar__popover" role="group" aria-label="Textstelle teilen"><button class="nc-button nc-button--ghost nc-button--xs" type="button">Zitat teilen</button><button class="nc-button nc-button--ghost nc-button--xs" type="button">Link kopieren</button></div><p style="margin: 0;"><mark>Ein Assistent findet nur, was jemand vorher sauber aufgeschrieben hat.</mark></p></div>`,
};
