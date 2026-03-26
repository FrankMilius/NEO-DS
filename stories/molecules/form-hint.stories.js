// ============================================================
// FormHint — Auto-generated from form-hint-recipe.json
// Version: 2.0.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Molecules/FormHint',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**FormHint** v2.0.0 (stable)

Flexbox-Layout: Icon + Text nebeneinander, align-items: flex-start.


`,
      },
    },
    status: { type: 'stable' },
  },
  argTypes: {},
};

export const Default = {
  render: () => `<div class="nc-form-hint">
    <span class="nc-form-hint__text">form-hint</span>
  </div>`,
};

export const TextOnly = {
  name: 'Text Only',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-form-hint">
    <span class="nc-form-hint__text">form-hint</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Hint nur mit Text (Standard)' },
    },
  },
};

export const WithIcon = {
  name: 'With Icon',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-form-hint">
    <span class="nc-form-hint__text">form-hint</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Hint mit Info-Icon und Text' },
    },
  },
};

export const DefaultvsMuted = {
  name: 'Default vs Muted',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-form-hint">
    <span class="nc-form-hint__text">form-hint</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Vergleich der Farbvarianten: Standard (sekundaer) vs Muted (tertiaer/dezent)' },
    },
  },
};

export const WithLink = {
  name: 'With Link',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-form-hint">
    <span class="nc-form-hint__text">form-hint</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Hint mit interaktivem Link (\'Mehr erfahren\', \'Passwort vergessen?\')' },
    },
  },
};

export const RequirementsList = {
  name: 'Requirements List',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-form-hint">
    <span class="nc-form-hint__text">form-hint</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Hint als Anforderungsliste (z.B. Passwort-Regeln)' },
    },
  },
};

export const ContentVariants = {
  name: 'Content Variants',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  
</div>`,
  parameters: {
    docs: {
      description: { story: 'Alle Content-Varianten im Vergleich: text-only, with-icon, with-link, list' },
    },
  },
};

export const BelowInputField = {
  name: 'Below Input Field',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-form-hint">
    <span class="nc-form-hint__text">form-hint</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Hint unterhalb eines Input-Feldes (typischer Anwendungsfall)' },
    },
  },
};

export const MultiLineHint = {
  name: 'Multi-Line Hint',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-form-hint">
    <span class="nc-form-hint__text">form-hint</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Hint mit langem Text (mehrzeilig)' },
    },
  },
};
