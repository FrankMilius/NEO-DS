// ============================================================
// Device — Auto-generated from device-recipe.json
// Version: 1.0.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Atoms/Device',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**Device** v1.0.0 (stable)

Das Seitenverhaeltnis 1206/2622 ist das gemessene Mass der vorhandenen App-Screenshots (iPhone 17), nicht ein gerundeter Geraetewert. Wo Rahmen und Bild uebereinstimmen, hat object-fit nichts zu tun.


`,
      },
    },
    status: { type: 'stable' },
  },
  argTypes: {},
};

export const Default = {
  name: 'Standard',
  render: () => `<!-- @quelle: von Hand -->`,
};

export const Standard = {
  name: 'Standard',
  render: () => `<div class="nc-device">
  <div class="nc-device__screen">
    <img src="/assets/muster/app-screen.svg" alt="App-Ansicht"
         width="800" height="1740" loading="lazy" decoding="async" />
  </div>
</div>`,
};

export const Klein = {
  name: 'Klein',
  render: () => `<div class="nc-device nc-device--sm">
  <div class="nc-device__screen">
    <img src="/assets/muster/app-screen.svg" alt="App-Ansicht"
         width="800" height="1740" loading="lazy" decoding="async" />
  </div>
</div>`,
};

export const MitBeschriftung = {
  name: 'Mit Beschriftung',
  render: () => `<figure class="nc-device-figure">
  <div class="nc-device">
    <div class="nc-device__screen">
      <img src="/assets/muster/app-screen.svg" alt="Startseite mit Unternehmensnews"
           width="800" height="1740" loading="lazy" decoding="async" />
    </div>
  </div>
  <figcaption class="nc-device-figure__caption">
    <span class="nc-device-figure__name">News</span>
    <span class="nc-device-figure__text">Unternehmensnews und Meldungen aus den Bereichen — sortiert nach dem, was für die eigene Rolle zählt.</span>
  </figcaption>
</figure>`,
};
