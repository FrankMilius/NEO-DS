// ============================================================
// Alert — Auto-generated from alert-recipe.json
// Version: 2.0.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Organisms/Alert',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**Alert** v2.0.0 (stable)

Alert ist ein <div class='nc-alert' role='alert|status'>.


`,
      },
    },
    status: { type: 'stable' },
  },
  argTypes: {},
};

export const Default = {
  render: () => `<div class="nc-alert">
    <span class="nc-alert__content">content</span>
  </div>`,
};

export const AllVariants = {
  name: 'All Variants',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  
</div>`,
  parameters: {
    docs: {
      description: { story: 'Alle 4 semantischen Varianten mit Titel + Beschreibung' },
    },
  },
};

export const ContentCompositions = {
  name: 'Content Compositions',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-alert">
    <span class="nc-alert__content">content</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Verschiedene Inhalts-Kombinationen der Info-Variante' },
    },
  },
};

export const DismissibleVariants = {
  name: 'Dismissible Variants',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  
</div>`,
  parameters: {
    docs: {
      description: { story: 'Alle Varianten mit Close-Button' },
    },
  },
};

export const WithActionButton = {
  name: 'With Action Button',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  
</div>`,
  parameters: {
    docs: {
      description: { story: 'Alle Varianten mit Action-Button' },
    },
  },
};

export const TitleOnlyCompact = {
  name: 'Title Only — Compact',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  
</div>`,
  parameters: {
    docs: {
      description: { story: 'Minimale Form: nur Titel, alle Varianten' },
    },
  },
};

export const DangerRoleAlertDetail = {
  name: 'Danger — Role Alert Detail',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-alert">
    <span class="nc-alert__content">content</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Danger-Variante in allen Content-Kompositionen (role=\'alert\')' },
    },
  },
};

export const ProgressiveDisclosure = {
  name: 'Progressive Disclosure',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-alert">
    <span class="nc-alert__content">content</span>
  </div>
  <div class="nc-alert">
    <span class="nc-alert__content">content</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Alert mit Details-Toggle fuer lange Fehlermeldungen' },
    },
  },
};

export const InlineFeedback = {
  name: 'Inline Feedback',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  
</div>`,
  parameters: {
    docs: {
      description: { story: 'Inline-Variante ohne Hintergrund — subtiles Feedback an Eingabefeldern' },
    },
  },
};
