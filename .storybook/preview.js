// NEO Design System — Storybook Preview Configuration
// Lädt das kompilierte CSS und definiert globale Decorators

import '../styles.css';

/** @type { import('@storybook/html').Preview } */
const preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: 'var(--fnd-color-background-base, #ffffff)' },
        { name: 'dark', value: '#0a0a0a' },
        { name: 'neutral', value: '#f5f5f5' },
      ],
    },
    viewport: {
      viewports: {
        mobile: { name: 'Mobile', styles: { width: '375px', height: '812px' } },
        tablet: { name: 'Tablet', styles: { width: '768px', height: '1024px' } },
        desktop: { name: 'Desktop', styles: { width: '1280px', height: '800px' } },
        wide: { name: 'Wide', styles: { width: '1600px', height: '900px' } },
      },
    },
    a11y: {
      config: {
        rules: [
          { id: 'color-contrast', enabled: true },
          { id: 'label', enabled: true },
        ],
      },
    },
    layout: 'padded',
  },
  globalTypes: {
    theme: {
      description: 'NEO Theme',
      defaultValue: 'neo-light-theme',
      toolbar: {
        title: 'Theme',
        icon: 'paintbrush',
        items: [
          { value: 'neo-light-theme', title: 'NEO Light' },
          { value: 'neo-dark-theme', title: 'NEO Dark' },
          { value: 'customer-light-theme', title: 'Customer Light' },
          { value: 'customer-dark-theme', title: 'Customer Dark' },
        ],
        dynamicTitle: true,
      },
    },
    // Container-Breiten-Toggle: stellt eine Komponente in einem schmalen/breiten
    // Container dar (bzw. beide im Vergleich), um Container-Query-Reflow sichtbar
    // zu testen — unabhaengig vom Viewport. Werte = Intent-Container-Tiers.
    containerWidth: {
      description: 'Container width (für @container-Reflow)',
      defaultValue: 'full',
      toolbar: {
        title: 'Container',
        icon: 'sidebaralt',
        items: [
          { value: 'full', title: 'Full width' },
          { value: 'prose', title: 'Prose (72ch)' },
          { value: 'narrow', title: 'Narrow (768px)' },
          { value: 'content', title: 'Content (1090px)' },
          { value: 'wide', title: 'Wide (1290px)' },
          { value: 'xwide', title: 'XWide (1536px)' },
          { value: 'compare', title: '↔ Compare narrow + wide' },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (story, context) => {
      const theme = context.globals.theme || 'neo-light-theme';
      const width = context.globals.containerWidth || 'full';
      const html = story();

      const wrapper = document.createElement('div');
      wrapper.classList.add(theme);
      wrapper.style.padding = 'var(--fnd-spacing-06)';

      // Vergleichsmodus: dieselbe Komponente schmal UND breit nebeneinander,
      // damit der Container-Query-Reflow direkt sichtbar ist.
      if (width === 'compare') {
        wrapper.style.display = 'grid';
        wrapper.style.gridTemplateColumns = '360px minmax(0, 1fr)';
        wrapper.style.gap = 'var(--fnd-spacing-08)';
        wrapper.style.alignItems = 'start';
        const col = (label, w) =>
          `<div style="min-width:0;${w ? `max-width:${w};` : ''}">
             <div style="font:600 12px/1.4 var(--font-body,sans-serif);color:var(--fnd-color-text-secondary,#666);margin-block-end:8px;text-transform:uppercase;letter-spacing:.06em;">${label}</div>
             ${html}
           </div>`;
        wrapper.innerHTML = col('Narrow ~360px', '') + col('Wide', '');
        return wrapper;
      }

      // Einzelbreite: bewusst auf den Intent-Container-Tier begrenzt.
      const map = {
        full: '100%',
        prose: 'var(--container-prose, 72ch)',
        narrow: 'var(--container-narrow, 768px)',
        content: 'var(--container-content, 1090px)',
        wide: 'var(--container-wide, 1290px)',
        xwide: 'var(--container-xwide, 1536px)',
      };
      const inner = document.createElement('div');
      inner.style.maxWidth = map[width] || '100%';
      inner.style.marginInline = 'auto';
      inner.innerHTML = html;
      wrapper.appendChild(inner);
      return wrapper;
    },
  ],
};

export default preview;
