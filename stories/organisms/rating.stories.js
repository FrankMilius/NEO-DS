// ============================================================
// Rating — Auto-generated from rating-recipe.json
// Version: 2.0.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Organisms/Rating',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**Rating** v2.0.0 (stable)

Interaktiv: <div class='nc-rating' role='radiogroup' aria-label='Bewertung'> mit versteckten Radio-Inputs + Labels.


`,
      },
    },
    status: { type: 'stable' },
  },
  argTypes: {},
};

export const Default = {
  render: () => `<div class="nc-rating">
    <span class="nc-rating__item">item</span>
  </div>`,
};

export const InteractiveStates = {
  name: 'Interactive States',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-rating">
    <span class="nc-rating__item">item</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Interaktives Rating in allen Zustaenden: Default, Hover (staggered), Active (bounce), Focus, Disabled' },
    },
  },
};

export const HoverKaskadeStaggered = {
  name: 'Hover-Kaskade (Staggered)',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-rating">
    <span class="nc-rating__item">item</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Sterne leuchten mit 30ms Versatz nacheinander auf — von links nach rechts. Klick loest Bounce-Animation aus.' },
    },
  },
};

export const ClearResetZeroState = {
  name: 'Clear/Reset (Zero State)',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-rating">
    <span class="nc-rating__item">item</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Zuruecksetzen auf 0 Sterne via versteckten Clear-Input (value=0) oder sichtbaren Reset-Button.' },
    },
  },
};

export const IconTypes = {
  name: 'Icon Types',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-rating">
    <span class="nc-rating__item">item</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Symbol-Varianz: Star (Standard), Heart (Favoriten), Thumb (Zustimmung), Smiley (Zufriedenheit)' },
    },
  },
};

export const SentimentFarbskala = {
  name: 'Sentiment-Farbskala',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-rating">
    <span class="nc-rating__item">item</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Dynamische Farbgebung: 1-2 Sterne = Rot (Danger), 3 Sterne = Gelb (Warning), 4-5 Sterne = Gruen (Success)' },
    },
  },
};

export const SizeScaleSMMDLG = {
  name: 'Size Scale — SM / MD / LG',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  
</div>`,
  parameters: {
    docs: {
      description: { story: 'Alle 3 Groessen mit Touch-Target Visualisierung' },
    },
  },
};

export const DisplayOptions = {
  name: 'Display Options',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-rating">
    <span class="nc-rating__item">item</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Stars-only, mit Wert, mit Wert + Anzahl, Compact/Pill' },
    },
  },
};

export const HalfStarValuesReadonly = {
  name: 'Half Star Values (Readonly)',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-rating">
    <span class="nc-rating__item">item</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Verschiedene Bewertungswerte mit halben Sternen (2.5, 3.5, 4.5) — nur im Readonly-Modus' },
    },
  },
};
