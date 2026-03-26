// ============================================================
// AlertDialog — Auto-generated from alert-dialog-recipe.json
// Version: 2.0.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Organisms/AlertDialog',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**AlertDialog** v2.0.0 (stable)

Root: natives <dialog> Element. showModal() fuer modale Anzeige.


`,
      },
    },
    status: { type: 'stable' },
  },
  argTypes: {},
};

export const Default = {
  render: () => `<div class="nc-alert-dialog">
    <span class="nc-alert-dialog__header">header</span>
    <span class="nc-alert-dialog__title">title</span>
    <span class="nc-alert-dialog__footer">footer</span>
  </div>`,
};

export const DefaultAlertDialog = {
  name: 'Default Alert Dialog',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-alert-dialog">
    <span class="nc-alert-dialog__header">header</span>
    <span class="nc-alert-dialog__title">title</span>
    <span class="nc-alert-dialog__footer">footer</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Neutraler Bestaetigungsdialog mit Title, Description und Buttons' },
    },
  },
};

export const DestructiveAlertDialog = {
  name: 'Destructive Alert Dialog',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-alert-dialog">
    <span class="nc-alert-dialog__header">header</span>
    <span class="nc-alert-dialog__title">title</span>
    <span class="nc-alert-dialog__footer">footer</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Loeschen-Bestaetigungsdialog mit Danger-Button und Icon' },
    },
  },
};

export const IntentComparison = {
  name: 'Intent Comparison',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  
</div>`,
  parameters: {
    docs: {
      description: { story: 'Default vs Destructive (mit Icon)' },
    },
  },
};

export const ContentVariants = {
  name: 'Content Variants',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-alert-dialog">
    <span class="nc-alert-dialog__header">header</span>
    <span class="nc-alert-dialog__title">title</span>
    <span class="nc-alert-dialog__footer">footer</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'With Description vs Title Only vs With Icon' },
    },
  },
};

export const DestructivewithIcon = {
  name: 'Destructive with Icon',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-alert-dialog">
    <span class="nc-alert-dialog__header">header</span>
    <span class="nc-alert-dialog__title">title</span>
    <span class="nc-alert-dialog__footer">footer</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Destructive-Dialog mit prominentem Warn-Icon — maximale visuelle Dringlichkeit' },
    },
  },
};

export const SessionTimeout = {
  name: 'Session Timeout',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-alert-dialog">
    <span class="nc-alert-dialog__header">header</span>
    <span class="nc-alert-dialog__title">title</span>
    <span class="nc-alert-dialog__footer">footer</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Typisches Pattern: Sitzung abgelaufen, Verlaengern oder Abmelden' },
    },
  },
};

export const UnsavedChanges = {
  name: 'Unsaved Changes',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-alert-dialog">
    <span class="nc-alert-dialog__header">header</span>
    <span class="nc-alert-dialog__title">title</span>
    <span class="nc-alert-dialog__footer">footer</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Aenderungen verwerfen Dialog mit 3 Buttons' },
    },
  },
};
