// ============================================================
// EmptyState — Auto-generated from empty-state-recipe.json
// Version: 1.0.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Organisms/EmptyState',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**EmptyState** v1.0.0 (stable)

Flex-Column-Container, zentriert (align-items + text-align: center).


`,
      },
    },
    status: { type: 'stable' },
  },
  argTypes: {},
};

export const Default = {
  render: () => `<div class="nc-empty-state">
    <span class="nc-empty-state__title">title</span>
  </div>`,
};

export const FullContent = {
  name: 'Full Content',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-empty-state">
    <span class="nc-empty-state__title">title</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Vollstaendiger Empty-State mit Icon, Title, Description und CTA-Button' },
    },
  },
};

export const ContentVariants = {
  name: 'Content Variants',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-empty-state">
    <span class="nc-empty-state__title">title</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Alle Inhaltskombinationen im Vergleich' },
    },
  },
};

export const DefaultvsCompact = {
  name: 'Default vs Compact',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  
</div>`,
  parameters: {
    docs: {
      description: { story: 'Standard-Groesse vs kompakte Variante' },
    },
  },
};

export const NoSearchResults = {
  name: 'No Search Results',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-empty-state">
    <span class="nc-empty-state__title">title</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Typischer Anwendungsfall: Suche ohne Treffer' },
    },
  },
};

export const OnboardingFirstUse = {
  name: 'Onboarding / First Use',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-empty-state">
    <span class="nc-empty-state__title">title</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Erstnutzung — mit Icon, Erklaerung und CTA zum Anlegen' },
    },
  },
};

export const FullHeightContainer = {
  name: 'Full Height Container',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-empty-state">
    <span class="nc-empty-state__title">title</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Empty-State fuellt den gesamten Container (min-height: 100%)' },
    },
  },
};
