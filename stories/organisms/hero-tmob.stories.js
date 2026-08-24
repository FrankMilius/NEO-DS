// ============================================================
// HeroTmob — Auto-generated from hero-tmob-recipe.json
// Version: 1.0.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Organisms/HeroTmob',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**HeroTmob** v1.0.0 (stable)

Headline + Subtext + Media ueber konfigurierbarem Hintergrund.


`,
      },
    },
    status: { type: 'stable' },
  },
  argTypes: {},
};

export const Default = {
  name: 'Standard',
  render: () => `<section class="nc-hero-tmob" style="min-height: 80svh; background-color: #0a0a1a;" data-neo-hero-tmob="">
<div class="nc-hero-tmob__content">
<div class="nc-hero-tmob__text">
<h2 class="nc-hero-tmob__headline nc-headline--display">Die Zukunft der Zusammenarbeit</h2>
<p class="nc-hero-tmob__subtext">PIIPE Workplace verbindet Teams, Projekte und Wissen in einer einzigen Plattform. Intuitiv, sicher und leistungsstark.</p>
</div>
<div class="nc-hero-tmob__media">
<img src="/themes/custom/neo_fe/assets/piipe-startseite.png" alt="Die Zukunft der Zusammenarbeit" loading="eager" decoding="async">
</div>
</div>
</section>`,
};
