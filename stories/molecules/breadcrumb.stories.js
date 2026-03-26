// ============================================================
// Breadcrumb — Auto-generated from breadcrumb-recipe.json
// Version: 2.0.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Molecules/Breadcrumb',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**Breadcrumb** v2.0.0 (stable)

Wrapper ist <nav class='nc-breadcrumb' aria-label='Breadcrumb'>.


`,
      },
    },
    status: { type: 'stable' },
  },
  argTypes: {},
};

export const Default = {
  render: () => `<div class="nc-breadcrumb">
    <span class="nc-breadcrumb__list">list</span>
    <span class="nc-breadcrumb__item">item</span>
    <span class="nc-breadcrumb__link">link</span>
  </div>`,
};

export const FullPathChevron = {
  name: 'Full Path — Chevron',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-breadcrumb">
    <span class="nc-breadcrumb__list">list</span>
    <span class="nc-breadcrumb__item">item</span>
    <span class="nc-breadcrumb__link">link</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Vollstaendiger Breadcrumb-Pfad mit Chevron-Separatoren' },
    },
  },
};

export const SeparatorVarianten = {
  name: 'Separator-Varianten',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-breadcrumb">
    <span class="nc-breadcrumb__list">list</span>
    <span class="nc-breadcrumb__item">item</span>
    <span class="nc-breadcrumb__link">link</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Vergleich aller 5 Separator-Typen mit reduzierter Opacity' },
    },
  },
};

export const SizeSMMD = {
  name: 'Size — SM / MD',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  
</div>`,
  parameters: {
    docs: {
      description: { story: 'SM fuer Admin/Sidebar, MD fuer Haupt-Content' },
    },
  },
};

export const GhostAppearance = {
  name: 'Ghost Appearance',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-breadcrumb">
    <span class="nc-breadcrumb__list">list</span>
    <span class="nc-breadcrumb__item">item</span>
    <span class="nc-breadcrumb__link">link</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Dezente Links wie normaler Text — erst bei Hover interaktiv. Fuer minimalistische Artikel-Seiten.' },
    },
  },
};

export const HomeIcon = {
  name: 'Home Icon',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-breadcrumb">
    <span class="nc-breadcrumb__list">list</span>
    <span class="nc-breadcrumb__item">item</span>
    <span class="nc-breadcrumb__link">link</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Haus-SVG statt \'Home\'-Text — platzsparend und international verstaendlich' },
    },
  },
};

export const SmartTruncation = {
  name: 'Smart Truncation',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-breadcrumb">
    <span class="nc-breadcrumb__list">list</span>
    <span class="nc-breadcrumb__item">item</span>
    <span class="nc-breadcrumb__link">link</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Home + letzte 2 Items sichtbar. Mittlere Ebenen im Ellipsis-Dropdown.' },
    },
  },
};

export const TruncationDropdownOpen = {
  name: 'Truncation — Dropdown Open',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-breadcrumb">
    <span class="nc-breadcrumb__list">list</span>
    <span class="nc-breadcrumb__item">item</span>
    <span class="nc-breadcrumb__link">link</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Ellipsis-Dropdown zeigt versteckte Ebenen. Nutzt nc-dropdown-* Tokens fuer Kohaerenz mit Navigation-Menu.' },
    },
  },
};

export const BackLinkMobile = {
  name: 'Back-Link (Mobile)',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-breadcrumb">
    <span class="nc-breadcrumb__list">list</span>
    <span class="nc-breadcrumb__item">item</span>
    <span class="nc-breadcrumb__link">link</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Mobile-First: Nur \'← Parent\' Link statt vollem Pfad. Maximale Platzersparnis.' },
    },
  },
};
