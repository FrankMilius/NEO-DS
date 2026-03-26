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
  },
  decorators: [
    (story, context) => {
      const theme = context.globals.theme || 'neo-light-theme';
      const wrapper = document.createElement('div');
      wrapper.classList.add(theme);
      wrapper.style.padding = 'var(--fnd-spacing-06)';
      wrapper.innerHTML = story();
      return wrapper;
    },
  ],
};

export default preview;
