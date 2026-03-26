// ============================================================
// Modal — Auto-generated from modal-recipe.json
// Version: 2.0.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Organisms/Modal',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**Modal** v2.0.0 (stable)

Root: natives <dialog> Element. showModal() fuer modale Anzeige.


`,
      },
    },
    status: { type: 'stable' },
  },
  argTypes: {},
};

export const Default = {
  render: () => `<div class="nc-modal">
    <span class="nc-modal__body">body</span>
  </div>`,
};

export const DefaultModal = {
  name: 'Default Modal',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-modal">
    <span class="nc-modal__body">body</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Standard Modal mit Header, Body und Footer (md, default intent)' },
    },
  },
};

export const SizeVariants = {
  name: 'Size Variants',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  
</div>`,
  parameters: {
    docs: {
      description: { story: 'SM (400px), MD (560px), LG (720px), Full (100%)' },
    },
  },
};

export const ContentVariants = {
  name: 'Content Variants',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-modal">
    <span class="nc-modal__body">body</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Simple, With Header, With Footer, Full, Scrollable' },
    },
  },
};

export const ScrollableBody = {
  name: 'Scrollable Body',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-modal">
    <span class="nc-modal__body">body</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Langer Inhalt scrollt im Body. Header und Footer bleiben sticky. Scroll-Borders erscheinen dynamisch.' },
    },
  },
};

export const DangerConfirmation = {
  name: 'Danger Confirmation',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-modal">
    <span class="nc-modal__body">body</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Destruktive Bestaetigung mit rotem Header-Icon und roter primaerer Action.' },
    },
  },
};

export const ModalwithForm = {
  name: 'Modal with Form',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-modal">
    <span class="nc-modal__body">body</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Modal mit eingebettetem Formular' },
    },
  },
};

export const MobileBottomSheet = {
  name: 'Mobile Bottom-Sheet',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-modal">
    <span class="nc-modal__body">body</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Responsive Transformation: Modal wird auf Mobile zum Bottom-Sheet (volle Breite, von unten).' },
    },
  },
};

export const BackdropClose = {
  name: 'Backdrop Close',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-modal">
    <span class="nc-modal__body">body</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Klick auf Backdrop schliesst Modal. Optional via data-backdrop-close=\'true\'.' },
    },
  },
};
