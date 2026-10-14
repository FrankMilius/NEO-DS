// ============================================================
// LogoWall — Auto-generated from logo-wall-recipe.json
// Version: 2.3.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Molecules/LogoWall',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**LogoWall** v2.3.0 (stable)

Root: display:grid (default), display:flex (marquee/cluster). Gap via Token.


`,
      },
    },
    status: { type: 'stable' },
  },
  argTypes: {},
};

export const Default = {
  name: 'Standard',
  render: () => `<div class="nc-logo-wall nc-logo-wall--marquee nc-logo-wall--lg nc-logo-wall--mono nc-logo-wall--boxed" data-layout="marquee" data-neo-behavior="marquee">
<button type="button" class="nc-logo-wall__pause" data-playing="true">
<svg class="nc-logo-wall__pause-icon" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
<path class="nc-logo-wall__pause-pause" d="M4 2.5h3v11H4zM9 2.5h3v11H9z">
</path>
<path class="nc-logo-wall__pause-play" d="M4.5 2.2 13.5 8l-9 5.8z">
</path>
</svg>
<span class="nc-logo-wall__pause-label">Laufband anhalten</span>
</button>
<div class="nc-logo-wall__track">
<div class="nc-logo-pill">
<img class="nc-logo-pill__img" src="/themes/custom/neo_fe/assets/logos/awo_logo.png" alt="AWO" loading="lazy" decoding="async">
</div>
<div class="nc-logo-pill">
<img class="nc-logo-pill__img" src="/themes/custom/neo_fe/assets/logos/dataport_logo.png" alt="Dataport" loading="lazy" decoding="async">
</div>
<div class="nc-logo-pill">
<img class="nc-logo-pill__img" src="/themes/custom/neo_fe/assets/logos/degewo-logo.png" alt="degewo" loading="lazy" decoding="async">
</div>
<div class="nc-logo-pill">
<img class="nc-logo-pill__img" src="/themes/custom/neo_fe/assets/logos/logo_drv.png" alt="Deutsche Rentenversicherung" loading="lazy" decoding="async">
</div>
<div class="nc-logo-pill">
<img class="nc-logo-pill__img" src="/themes/custom/neo_fe/assets/logos/festo_logo.png" alt="Festo" loading="lazy" decoding="async">
</div>
<div class="nc-logo-pill">
<img class="nc-logo-pill__img" src="/themes/custom/neo_fe/assets/logos/logo_hfd.png" alt="Hochschulforum Digitalisierung" loading="lazy" decoding="async">
</div>
<div class="nc-logo-pill">
<img class="nc-logo-pill__img" src="/themes/custom/neo_fe/assets/logos/logo_hs-kempten.png" alt="HS Kempten" loading="lazy" decoding="async">
</div>
<div class="nc-logo-pill">
<img class="nc-logo-pill__img" src="/themes/custom/neo_fe/assets/logos/logo_kvno.png" alt="KVNO" loading="lazy" decoding="async">
</div>
<div class="nc-logo-pill">
<img class="nc-logo-pill__img" src="/themes/custom/neo_fe/assets/logos/logo_lms.png" alt="Landesmedienanstalt Saarland" loading="lazy" decoding="async">
</div>
<div class="nc-logo-pill">
<img class="nc-logo-pill__img" src="/themes/custom/neo_fe/assets/logos/ringier-logo.png" alt="Ringier" loading="lazy" decoding="async">
</div>
<div class="nc-logo-pill">
<img class="nc-logo-pill__img" src="/themes/custom/neo_fe/assets/logos/logo_saarland.png" alt="Saarland" loading="lazy" decoding="async">
</div>
<div class="nc-logo-pill">
<img class="nc-logo-pill__img" src="/themes/custom/neo_fe/assets/logos/uni-saarland_logo.png" alt="Universität des Saarlandes" loading="lazy" decoding="async">
</div>
<div class="nc-logo-pill">
<img class="nc-logo-pill__img" src="/themes/custom/neo_fe/assets/logos/zke_logo.png" alt="ZKE Saarbrücken" loading="lazy" decoding="async">
</div>
<div class="nc-logo-pill" aria-hidden="true">
<img class="nc-logo-pill__img" src="/themes/custom/neo_fe/assets/logos/awo_logo.png" alt="AWO" loading="lazy" decoding="async">
</div>
<div class="nc-logo-pill" aria-hidden="true">
<img class="nc-logo-pill__img" src="/themes/custom/neo_fe/assets/logos/dataport_logo.png" alt="Dataport" loading="lazy" decoding="async">
</div>
<div class="nc-logo-pill" aria-hidden="true">
<img class="nc-logo-pill__img" src="/themes/custom/neo_fe/assets/logos/degewo-logo.png" alt="degewo" loading="lazy" decoding="async">
</div>
<div class="nc-logo-pill" aria-hidden="true">
<img class="nc-logo-pill__img" src="/themes/custom/neo_fe/assets/logos/logo_drv.png" alt="Deutsche Rentenversicherung" loading="lazy" decoding="async">
</div>
<div class="nc-logo-pill" aria-hidden="true">
<img class="nc-logo-pill__img" src="/themes/custom/neo_fe/assets/logos/festo_logo.png" alt="Festo" loading="lazy" decoding="async">
</div>
<div class="nc-logo-pill" aria-hidden="true">
<img class="nc-logo-pill__img" src="/themes/custom/neo_fe/assets/logos/logo_hfd.png" alt="Hochschulforum Digitalisierung" loading="lazy" decoding="async">
</div>
<div class="nc-logo-pill" aria-hidden="true">
<img class="nc-logo-pill__img" src="/themes/custom/neo_fe/assets/logos/logo_hs-kempten.png" alt="HS Kempten" loading="lazy" decoding="async">
</div>
<div class="nc-logo-pill" aria-hidden="true">
<img class="nc-logo-pill__img" src="/themes/custom/neo_fe/assets/logos/logo_kvno.png" alt="KVNO" loading="lazy" decoding="async">
</div>
<div class="nc-logo-pill" aria-hidden="true">
<img class="nc-logo-pill__img" src="/themes/custom/neo_fe/assets/logos/logo_lms.png" alt="Landesmedienanstalt Saarland" loading="lazy" decoding="async">
</div>
<div class="nc-logo-pill" aria-hidden="true">
<img class="nc-logo-pill__img" src="/themes/custom/neo_fe/assets/logos/ringier-logo.png" alt="Ringier" loading="lazy" decoding="async">
</div>
<div class="nc-logo-pill" aria-hidden="true">
<img class="nc-logo-pill__img" src="/themes/custom/neo_fe/assets/logos/logo_saarland.png" alt="Saarland" loading="lazy" decoding="async">
</div>
<div class="nc-logo-pill" aria-hidden="true">
<img class="nc-logo-pill__img" src="/themes/custom/neo_fe/assets/logos/uni-saarland_logo.png" alt="Universität des Saarlandes" loading="lazy" decoding="async">
</div>
<div class="nc-logo-pill" aria-hidden="true">
<img class="nc-logo-pill__img" src="/themes/custom/neo_fe/assets/logos/zke_logo.png" alt="ZKE Saarbrücken" loading="lazy" decoding="async">
</div>
</div>
</div>`,
};
