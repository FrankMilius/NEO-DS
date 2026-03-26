// ============================================================
// Toast — Auto-generated from toast-recipe.json
// Version: 2.0.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Molecules/Toast',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**Toast** v2.0.0 (stable)

Toast: flex-row, Icon + Content + Action + Close. Border, Shadow, radius.


`,
      },
    },
    status: { type: 'stable' },
  },
  argTypes: {},
};

export const Default = {
  render: () => `<div class="nc-toast">
    <span class="nc-toast__content">content</span>
    <span class="nc-toast__title">title</span>
  </div>`,
};

export const SeverityVariants = {
  name: 'Severity Variants',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  
</div>`,
  parameters: {
    docs: {
      description: { story: 'Default, Success, Warning, Error, Info — jeweils mit Icon-Formsprache' },
    },
  },
};

export const ContentVariants = {
  name: 'Content Variants',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-toast">
    <span class="nc-toast__content">content</span>
    <span class="nc-toast__title">title</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Basic, With Description, With Action, With Undo, With Progress' },
    },
  },
};

export const ToastwithAction = {
  name: 'Toast with Action',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-toast">
    <span class="nc-toast__content">content</span>
    <span class="nc-toast__title">title</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Toast mit Action-Button und Close' },
    },
  },
};

export const ToastwithUndo = {
  name: 'Toast with Undo',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-toast">
    <span class="nc-toast__content">content</span>
    <span class="nc-toast__title">title</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Toast mit Undo-Action-Button — erweiterter Timer oder kein Auto-Dismiss' },
    },
  },
};

export const ToastwithProgress = {
  name: 'Toast with Progress',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-toast">
    <span class="nc-toast__content">content</span>
    <span class="nc-toast__title">title</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Auto-Dismiss Toast mit Fortschrittsbalken — pausiert bei Hover/Focus' },
    },
  },
};

export const StackedToasts = {
  name: 'Stacked Toasts',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-toast">
    <span class="nc-toast__content">content</span>
    <span class="nc-toast__title">title</span>
  </div>
  <div class="nc-toast">
    <span class="nc-toast__content">content</span>
    <span class="nc-toast__title">title</span>
  </div>
  <div class="nc-toast">
    <span class="nc-toast__content">content</span>
    <span class="nc-toast__title">title</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Mehrere Toasts gestapelt im Toaster — max 3 sichtbar' },
    },
  },
};

export const QueueManagement = {
  name: 'Queue Management',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-toast">
    <span class="nc-toast__content">content</span>
    <span class="nc-toast__title">title</span>
  </div>
  <div class="nc-toast">
    <span class="nc-toast__content">content</span>
    <span class="nc-toast__title">title</span>
  </div>
  <div class="nc-toast">
    <span class="nc-toast__content">content</span>
    <span class="nc-toast__title">title</span>
  </div>
  <div class="nc-toast">
    <span class="nc-toast__content">content</span>
    <span class="nc-toast__title">title</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Mehr als max-visible Toasts — aelteste werden ausgeblendet' },
    },
  },
};

export const SwipetoDismiss = {
  name: 'Swipe to Dismiss',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-toast">
    <span class="nc-toast__content">content</span>
    <span class="nc-toast__title">title</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Touch-basiertes Wegwischen (Mobile) — Threshold konfigurierbar' },
    },
  },
};
