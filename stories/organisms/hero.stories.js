// ============================================================
// Hero — Auto-generated from hero-recipe.json
// Version: 2.0.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Organisms/Hero',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**Hero** v2.0.0 (stable)

Grid: 2-Spalten ab 768px (split: 50/50 buendig). Content: text-inverse, gap 1rem.


`,
      },
    },
    status: { type: 'stable' },
  },
  argTypes: {},
};

export const Default = {
  render: () => `<div class="nc-hero">
    <span class="nc-hero__content">content</span>
  </div>`,
};

export const HeroVariants = {
  name: 'Hero Variants',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  
</div>`,
  parameters: {
    docs: {
      description: { story: 'Alle Varianten: Picture, Card, Split, Product' },
    },
  },
};

export const Alignment = {
  name: 'Alignment',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-hero">
    <span class="nc-hero__content">content</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Start vs Center Ausrichtung' },
    },
  },
};

export const FullFeaturedHero = {
  name: 'Full Featured Hero',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-hero">
    <span class="nc-hero__content">content</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Picture-Variante mit Badge, Breadcrumb, Highlights und Actions' },
    },
  },
};

export const ProductHero = {
  name: 'Product Hero',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-hero">
    <span class="nc-hero__content">content</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'E-Commerce Hero mit Metric (Preis) und Warenkorb-CTA' },
    },
  },
};

export const Flaechen = {
  name: 'Flaechen',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  
</div>`,
  parameters: {
    docs: {
      description: { story: 'Dunkel, getoent und hell. Jede Flaeche setzt Grund UND Schrift — sie sind ein Paar, kein Paar von Einstellungen.' },
    },
  },
};

export const HervorhebunginderUeberschrift = {
  name: 'Hervorhebung in der Ueberschrift',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  
</div>`,
  parameters: {
    docs: {
      description: { story: 'Balken gegen Tinte, je Flaeche. Der Balken laesst die Schriftfarbe unangetastet, die Tinte ersetzt sie.' },
    },
  },
};

export const FussBadgesundKennzahlen = {
  name: 'Fuss: Badges und Kennzahlen',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  
</div>`,
  parameters: {
    docs: {
      description: { story: 'Badge-Zeile oben gegen unten, mit Kennzahlen-Raster.' },
    },
  },
};

export const PositiondesMediums = {
  name: 'Position des Mediums',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  
</div>`,
  parameters: {
    docs: {
      description: { story: 'Medium rechts gegen links. Der Inhalt steht im Markup immer zuerst.' },
    },
  },
};
