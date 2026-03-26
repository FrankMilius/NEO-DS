// ============================================================
// Accordion — Auto-generated from accordion-recipe.json
// Version: 3.0.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Molecules/Accordion',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**Accordion** v3.0.0 (stable)

Natives <details>/<summary> oder ARIA-Pattern (role='region').


`,
      },
    },
    status: { type: 'stable' },
  },
  argTypes: {},
};

export const Default = {
  render: () => `<div class="nc-accordion">
    <span class="nc-accordion__item">item</span>
    <span class="nc-accordion__trigger">trigger</span>
    <span class="nc-accordion__content">content</span>
    <span class="nc-accordion__content-inner">content-inner</span>
  </div>`,
};

export const AllStates = {
  name: 'All States',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-accordion">
    <span class="nc-accordion__item">item</span>
    <span class="nc-accordion__trigger">trigger</span>
    <span class="nc-accordion__content">content</span>
    <span class="nc-accordion__content-inner">content-inner</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Accordion-Item in allen Zustaenden' },
    },
  },
};

export const VariantComparison = {
  name: 'Variant Comparison',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  
</div>`,
  parameters: {
    docs: {
      description: { story: 'Alle 7 Varianten im Vergleich' },
    },
  },
};

export const NestedHierarchy = {
  name: 'Nested Hierarchy',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-accordion">
    <span class="nc-accordion__item">item</span>
    <span class="nc-accordion__trigger">trigger</span>
    <span class="nc-accordion__content">content</span>
    <span class="nc-accordion__content-inner">content-inner</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Hierarchisches Accordion mit 2 Ebenen (z.B. Kategorie > Unterkategorie).' },
    },
  },
};

export const SelectionCheckable = {
  name: 'Selection (Checkable)',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-accordion">
    <span class="nc-accordion__item">item</span>
    <span class="nc-accordion__trigger">trigger</span>
    <span class="nc-accordion__content">content</span>
    <span class="nc-accordion__content-inner">content-inner</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Accordion mit Checkbox im Trigger. Auswahl bleibt bei geschlossenem Item sichtbar.' },
    },
  },
};

export const ActionableHeader = {
  name: 'Actionable Header',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-accordion">
    <span class="nc-accordion__item">item</span>
    <span class="nc-accordion__trigger">trigger</span>
    <span class="nc-accordion__content">content</span>
    <span class="nc-accordion__content-inner">content-inner</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Trigger mit Badge und Action-Button im Suffix-Slot.' },
    },
  },
};

export const StickyTrigger = {
  name: 'Sticky Trigger',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-accordion">
    <span class="nc-accordion__item">item</span>
    <span class="nc-accordion__trigger">trigger</span>
    <span class="nc-accordion__content">content</span>
    <span class="nc-accordion__content-inner">content-inner</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Trigger bleibt bei langem Content am oberen Rand sichtbar.' },
    },
  },
};

export const DensityComparison = {
  name: 'Density Comparison',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-accordion">
    <span class="nc-accordion__item">item</span>
    <span class="nc-accordion__trigger">trigger</span>
    <span class="nc-accordion__content">content</span>
    <span class="nc-accordion__content-inner">content-inner</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Default vs Compact vs Spacious' },
    },
  },
};

export const FAQPattern = {
  name: 'FAQ Pattern',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-accordion">
    <span class="nc-accordion__item">item</span>
    <span class="nc-accordion__trigger">trigger</span>
    <span class="nc-accordion__content">content</span>
    <span class="nc-accordion__content-inner">content-inner</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Typischer FAQ-Anwendungsfall' },
    },
  },
};
