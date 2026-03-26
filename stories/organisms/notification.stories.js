// ============================================================
// Notification — Auto-generated from notification-recipe.json
// Version: 2.0.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Organisms/Notification',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**Notification** v2.0.0 (stable)

Floating-Card Surface: surface-elevated BG + elevation-overlay Schatten (L2). Gleiche Ebene wie Popover.


`,
      },
    },
    status: { type: 'stable' },
  },
  argTypes: {},
};

export const Default = {
  render: () => `<div class="nc-notification">
    <span class="nc-notification__content">content</span>
    <span class="nc-notification__header">header</span>
    <span class="nc-notification__title">title</span>
  </div>`,
};

export const BasicNotification = {
  name: 'Basic Notification',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-notification">
    <span class="nc-notification__content">content</span>
    <span class="nc-notification__header">header</span>
    <span class="nc-notification__title">title</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Standard News-Alert mit Titel, Body und Meta-Info' },
    },
  },
};

export const WithMediaSlot = {
  name: 'With Media Slot',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-notification">
    <span class="nc-notification__content">content</span>
    <span class="nc-notification__header">header</span>
    <span class="nc-notification__title">title</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Notification mit Thumbnail/Avatar (48×48)' },
    },
  },
};

export const UnreadState = {
  name: 'Unread State',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-notification">
    <span class="nc-notification__content">content</span>
    <span class="nc-notification__header">header</span>
    <span class="nc-notification__title">title</span>
  </div>
  <div class="nc-notification">
    <span class="nc-notification__content">content</span>
    <span class="nc-notification__header">header</span>
    <span class="nc-notification__title">title</span>
  </div>
  <div class="nc-notification">
    <span class="nc-notification__content">content</span>
    <span class="nc-notification__header">header</span>
    <span class="nc-notification__title">title</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Ungelesene Notification mit Dot und subtiler BG-Hervorhebung' },
    },
  },
};

export const PriorityHigh = {
  name: 'Priority High',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-notification">
    <span class="nc-notification__content">content</span>
    <span class="nc-notification__header">header</span>
    <span class="nc-notification__title">title</span>
  </div>
  <div class="nc-notification">
    <span class="nc-notification__content">content</span>
    <span class="nc-notification__header">header</span>
    <span class="nc-notification__title">title</span>
  </div>
  <div class="nc-notification">
    <span class="nc-notification__content">content</span>
    <span class="nc-notification__header">header</span>
    <span class="nc-notification__title">title</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Hohe Prioritaet mit Akzent-Border links' },
    },
  },
};

export const TypeVariants = {
  name: 'Type Variants',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  
</div>`,
  parameters: {
    docs: {
      description: { story: 'Drei Inhaltskategorien mit unterschiedlichen Akzentfarben' },
    },
  },
};

export const WithFooterActions = {
  name: 'With Footer Actions',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-notification">
    <span class="nc-notification__content">content</span>
    <span class="nc-notification__header">header</span>
    <span class="nc-notification__title">title</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Notification mit Action-Links im Footer' },
    },
  },
};

export const PermanentNoClose = {
  name: 'Permanent (No Close)',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-notification">
    <span class="nc-notification__content">content</span>
    <span class="nc-notification__header">header</span>
    <span class="nc-notification__title">title</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Nicht-schliessbare Notification fuer permanente Hinweise' },
    },
  },
};

export const DismissAnimation = {
  name: 'Dismiss Animation',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-notification">
    <span class="nc-notification__content">content</span>
    <span class="nc-notification__header">header</span>
    <span class="nc-notification__title">title</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Hoehen-Collapse beim Schliessen' },
    },
  },
};
