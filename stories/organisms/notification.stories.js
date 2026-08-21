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
  render: () => `<div style="border:1px dashed #92500a;border-radius:4px;padding:12px">
  <p style="margin:0 0 10px;font:600 12px/1.4 ui-monospace,monospace;letter-spacing:.08em;text-transform:uppercase;color:#92500a">
    Kein echtes Markup hinterlegt
  </p>
  <p style="margin:0 0 12px;font:400 13px/1.5 system-ui,sans-serif;color:#595c59;max-width:62ch">
    Was hier steht, ist aus der Anatomie des Recipes abgeleitet — die Slots als
    Geschwister, ohne Schachtelung und ohne Zustaende. So sieht das Bauteil
    nicht aus. Echtes Markup gehoert nach
    <code style="font:inherit;font-family:ui-monospace,monospace">data/markup/notification.html</code>.
  </p>
  <div class="nc-notification">
    <span class="nc-notification__content">content</span>
    <span class="nc-notification__header">header</span>
    <span class="nc-notification__title">title</span>
  </div>
</div>`,
};

export const BasicNotification = {
  name: 'Basic Notification',
  render: () => `<div style="border:1px dashed #92500a;border-radius:4px;padding:12px">
  <p style="margin:0 0 10px;font:600 12px/1.4 ui-monospace,monospace;letter-spacing:.08em;text-transform:uppercase;color:#92500a">
    Kein echtes Markup hinterlegt
  </p>
  <p style="margin:0 0 12px;font:400 13px/1.5 system-ui,sans-serif;color:#595c59;max-width:62ch">
    Was hier steht, ist aus der Anatomie des Recipes abgeleitet — die Slots als
    Geschwister, ohne Schachtelung und ohne Zustaende. So sieht das Bauteil
    nicht aus. Echtes Markup gehoert nach
    <code style="font:inherit;font-family:ui-monospace,monospace">data/markup/notification.html</code>.
  </p>
  <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-notification">
    <span class="nc-notification__content">content</span>
    <span class="nc-notification__header">header</span>
    <span class="nc-notification__title">title</span>
  </div>
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
  render: () => `<div style="border:1px dashed #92500a;border-radius:4px;padding:12px">
  <p style="margin:0 0 10px;font:600 12px/1.4 ui-monospace,monospace;letter-spacing:.08em;text-transform:uppercase;color:#92500a">
    Kein echtes Markup hinterlegt
  </p>
  <p style="margin:0 0 12px;font:400 13px/1.5 system-ui,sans-serif;color:#595c59;max-width:62ch">
    Was hier steht, ist aus der Anatomie des Recipes abgeleitet — die Slots als
    Geschwister, ohne Schachtelung und ohne Zustaende. So sieht das Bauteil
    nicht aus. Echtes Markup gehoert nach
    <code style="font:inherit;font-family:ui-monospace,monospace">data/markup/notification.html</code>.
  </p>
  <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-notification">
    <span class="nc-notification__content">content</span>
    <span class="nc-notification__header">header</span>
    <span class="nc-notification__title">title</span>
  </div>
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
  render: () => `<div style="border:1px dashed #92500a;border-radius:4px;padding:12px">
  <p style="margin:0 0 10px;font:600 12px/1.4 ui-monospace,monospace;letter-spacing:.08em;text-transform:uppercase;color:#92500a">
    Kein echtes Markup hinterlegt
  </p>
  <p style="margin:0 0 12px;font:400 13px/1.5 system-ui,sans-serif;color:#595c59;max-width:62ch">
    Was hier steht, ist aus der Anatomie des Recipes abgeleitet — die Slots als
    Geschwister, ohne Schachtelung und ohne Zustaende. So sieht das Bauteil
    nicht aus. Echtes Markup gehoert nach
    <code style="font:inherit;font-family:ui-monospace,monospace">data/markup/notification.html</code>.
  </p>
  <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
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
  render: () => `<div style="border:1px dashed #92500a;border-radius:4px;padding:12px">
  <p style="margin:0 0 10px;font:600 12px/1.4 ui-monospace,monospace;letter-spacing:.08em;text-transform:uppercase;color:#92500a">
    Kein echtes Markup hinterlegt
  </p>
  <p style="margin:0 0 12px;font:400 13px/1.5 system-ui,sans-serif;color:#595c59;max-width:62ch">
    Was hier steht, ist aus der Anatomie des Recipes abgeleitet — die Slots als
    Geschwister, ohne Schachtelung und ohne Zustaende. So sieht das Bauteil
    nicht aus. Echtes Markup gehoert nach
    <code style="font:inherit;font-family:ui-monospace,monospace">data/markup/notification.html</code>.
  </p>
  <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
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
  render: () => `<div style="border:1px dashed #92500a;border-radius:4px;padding:12px">
  <p style="margin:0 0 10px;font:600 12px/1.4 ui-monospace,monospace;letter-spacing:.08em;text-transform:uppercase;color:#92500a">
    Kein echtes Markup hinterlegt
  </p>
  <p style="margin:0 0 12px;font:400 13px/1.5 system-ui,sans-serif;color:#595c59;max-width:62ch">
    Was hier steht, ist aus der Anatomie des Recipes abgeleitet — die Slots als
    Geschwister, ohne Schachtelung und ohne Zustaende. So sieht das Bauteil
    nicht aus. Echtes Markup gehoert nach
    <code style="font:inherit;font-family:ui-monospace,monospace">data/markup/notification.html</code>.
  </p>
  <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  
</div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Drei Inhaltskategorien mit unterschiedlichen Akzentfarben' },
    },
  },
};

export const WithFooterActions = {
  name: 'With Footer Actions',
  render: () => `<div style="border:1px dashed #92500a;border-radius:4px;padding:12px">
  <p style="margin:0 0 10px;font:600 12px/1.4 ui-monospace,monospace;letter-spacing:.08em;text-transform:uppercase;color:#92500a">
    Kein echtes Markup hinterlegt
  </p>
  <p style="margin:0 0 12px;font:400 13px/1.5 system-ui,sans-serif;color:#595c59;max-width:62ch">
    Was hier steht, ist aus der Anatomie des Recipes abgeleitet — die Slots als
    Geschwister, ohne Schachtelung und ohne Zustaende. So sieht das Bauteil
    nicht aus. Echtes Markup gehoert nach
    <code style="font:inherit;font-family:ui-monospace,monospace">data/markup/notification.html</code>.
  </p>
  <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-notification">
    <span class="nc-notification__content">content</span>
    <span class="nc-notification__header">header</span>
    <span class="nc-notification__title">title</span>
  </div>
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
  render: () => `<div style="border:1px dashed #92500a;border-radius:4px;padding:12px">
  <p style="margin:0 0 10px;font:600 12px/1.4 ui-monospace,monospace;letter-spacing:.08em;text-transform:uppercase;color:#92500a">
    Kein echtes Markup hinterlegt
  </p>
  <p style="margin:0 0 12px;font:400 13px/1.5 system-ui,sans-serif;color:#595c59;max-width:62ch">
    Was hier steht, ist aus der Anatomie des Recipes abgeleitet — die Slots als
    Geschwister, ohne Schachtelung und ohne Zustaende. So sieht das Bauteil
    nicht aus. Echtes Markup gehoert nach
    <code style="font:inherit;font-family:ui-monospace,monospace">data/markup/notification.html</code>.
  </p>
  <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-notification">
    <span class="nc-notification__content">content</span>
    <span class="nc-notification__header">header</span>
    <span class="nc-notification__title">title</span>
  </div>
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
  render: () => `<div style="border:1px dashed #92500a;border-radius:4px;padding:12px">
  <p style="margin:0 0 10px;font:600 12px/1.4 ui-monospace,monospace;letter-spacing:.08em;text-transform:uppercase;color:#92500a">
    Kein echtes Markup hinterlegt
  </p>
  <p style="margin:0 0 12px;font:400 13px/1.5 system-ui,sans-serif;color:#595c59;max-width:62ch">
    Was hier steht, ist aus der Anatomie des Recipes abgeleitet — die Slots als
    Geschwister, ohne Schachtelung und ohne Zustaende. So sieht das Bauteil
    nicht aus. Echtes Markup gehoert nach
    <code style="font:inherit;font-family:ui-monospace,monospace">data/markup/notification.html</code>.
  </p>
  <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-notification">
    <span class="nc-notification__content">content</span>
    <span class="nc-notification__header">header</span>
    <span class="nc-notification__title">title</span>
  </div>
</div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Hoehen-Collapse beim Schliessen' },
    },
  },
};
