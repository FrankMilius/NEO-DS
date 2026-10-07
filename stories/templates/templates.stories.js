// ============================================================
// Templates — Page Layout Showcase
// Alle 6 Seiten-Templates als Wireframe-Vorschau
// (content-page und form-page am 07.10.2026 stillgelegt -> Shell-Presets
// data-layout="content-page" bzw. "focused")
// ============================================================

const TEMPLATES = [
  {
    id: 'dashboard',
    name: 'Dashboard',
    class: 't-dashboard',
    desc: 'App-Layout mit Sidebar, Metric-Cards und Content-Bereich.',
    layout: `
      <div style="display:grid;grid-template-columns:80px 1fr;grid-template-rows:40px 1fr;height:300px;border:1px solid var(--fnd-color-border-secondary);border-radius:var(--fnd-radius-md);overflow:hidden">
        <div style="grid-column:1/-1;background:var(--fnd-color-layer-01);border-bottom:1px solid var(--fnd-color-border-secondary);display:flex;align-items:center;padding:0 12px;font-size:var(--fs-2xs);color:var(--fnd-color-text-secondary)">Header</div>
        <div style="background:var(--fnd-color-layer-02);border-right:1px solid var(--fnd-color-border-secondary);padding:8px;font-size:var(--fs-2xs);color:var(--fnd-color-text-tertiary)">Sidebar</div>
        <div style="padding:12px;display:grid;grid-template-columns:repeat(3,1fr);grid-template-rows:60px 1fr;gap:8px">
          <div style="background:var(--fnd-color-layer-01);border-radius:var(--fnd-radius-sm);border:1px solid var(--fnd-color-border-secondary);display:flex;align-items:center;justify-content:center;font-size:var(--fs-2xs);color:var(--fnd-color-text-tertiary)">Metric</div>
          <div style="background:var(--fnd-color-layer-01);border-radius:var(--fnd-radius-sm);border:1px solid var(--fnd-color-border-secondary);display:flex;align-items:center;justify-content:center;font-size:var(--fs-2xs);color:var(--fnd-color-text-tertiary)">Metric</div>
          <div style="background:var(--fnd-color-layer-01);border-radius:var(--fnd-radius-sm);border:1px solid var(--fnd-color-border-secondary);display:flex;align-items:center;justify-content:center;font-size:var(--fs-2xs);color:var(--fnd-color-text-tertiary)">Metric</div>
          <div style="grid-column:1/-1;background:var(--fnd-color-layer-01);border-radius:var(--fnd-radius-sm);border:1px solid var(--fnd-color-border-secondary);display:flex;align-items:center;justify-content:center;font-size:var(--fs-2xs);color:var(--fnd-color-text-tertiary)">Content Area</div>
        </div>
      </div>`,
  },
  {
    id: 'home-hero',
    name: 'Home Hero',
    class: 't-home-hero',
    desc: 'Landing Page mit Hero-Bereich und Content-Sektionen.',
    layout: `
      <div style="display:flex;flex-direction:column;height:300px;border:1px solid var(--fnd-color-border-secondary);border-radius:var(--fnd-radius-md);overflow:hidden">
        <div style="height:40px;background:var(--fnd-color-layer-01);border-bottom:1px solid var(--fnd-color-border-secondary);display:flex;align-items:center;padding:0 12px;font-size:var(--fs-2xs);color:var(--fnd-color-text-secondary)">Navigation</div>
        <div style="height:120px;background:color-mix(in srgb, var(--fnd-color-interactive-default) 10%, transparent);display:flex;align-items:center;justify-content:center;font-size:var(--fs-sm);color:var(--fnd-color-interactive-default);font-weight:var(--fnd-font-weight-semibold)">Hero Section</div>
        <div style="flex:1;padding:12px;display:grid;grid-template-columns:repeat(3,1fr);gap:8px">
          <div style="background:var(--fnd-color-layer-01);border-radius:var(--fnd-radius-sm);border:1px solid var(--fnd-color-border-secondary)"></div>
          <div style="background:var(--fnd-color-layer-01);border-radius:var(--fnd-radius-sm);border:1px solid var(--fnd-color-border-secondary)"></div>
          <div style="background:var(--fnd-color-layer-01);border-radius:var(--fnd-radius-sm);border:1px solid var(--fnd-color-border-secondary)"></div>
        </div>
      </div>`,
  },
  {
    id: 'home-basic',
    name: 'Home Basic',
    class: 't-home-basic',
    desc: 'Einfache Landing Page ohne Hero.',
    layout: `
      <div style="display:flex;flex-direction:column;height:300px;border:1px solid var(--fnd-color-border-secondary);border-radius:var(--fnd-radius-md);overflow:hidden">
        <div style="height:40px;background:var(--fnd-color-layer-01);border-bottom:1px solid var(--fnd-color-border-secondary);display:flex;align-items:center;padding:0 12px;font-size:var(--fs-2xs);color:var(--fnd-color-text-secondary)">Navigation</div>
        <div style="flex:1;padding:16px;display:flex;flex-direction:column;gap:12px">
          <div style="height:24px;width:50%;background:var(--fnd-color-text-primary);border-radius:2px;opacity:0.15"></div>
          <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px;flex:1">
            <div style="background:var(--fnd-color-layer-01);border-radius:var(--fnd-radius-sm);border:1px solid var(--fnd-color-border-secondary)"></div>
            <div style="background:var(--fnd-color-layer-01);border-radius:var(--fnd-radius-sm);border:1px solid var(--fnd-color-border-secondary)"></div>
          </div>
        </div>
      </div>`,
  },
  {
    id: 'settings-page',
    name: 'Settings Page',
    class: 't-settings-page',
    desc: 'Einstellungsseite mit Navigations-Tabs und Form-Sektionen.',
    layout: `
      <div style="display:flex;flex-direction:column;height:300px;border:1px solid var(--fnd-color-border-secondary);border-radius:var(--fnd-radius-md);overflow:hidden">
        <div style="height:40px;background:var(--fnd-color-layer-01);border-bottom:1px solid var(--fnd-color-border-secondary);display:flex;align-items:center;padding:0 12px;font-size:var(--fs-2xs);color:var(--fnd-color-text-secondary)">Header</div>
        <div style="display:flex;flex:1">
          <div style="width:120px;background:var(--fnd-color-layer-01);border-right:1px solid var(--fnd-color-border-secondary);padding:8px;display:flex;flex-direction:column;gap:4px">
            <div style="height:24px;background:var(--fnd-color-interactive-default);border-radius:var(--fnd-radius-sm);opacity:0.15"></div>
            <div style="height:24px;border-radius:var(--fnd-radius-sm)"></div>
            <div style="height:24px;border-radius:var(--fnd-radius-sm)"></div>
          </div>
          <div style="flex:1;padding:12px;display:flex;flex-direction:column;gap:8px">
            <div style="height:16px;width:40%;background:var(--fnd-color-text-primary);border-radius:2px;opacity:0.15"></div>
            <div style="height:28px;background:var(--fnd-color-background-base);border:1px solid var(--fnd-color-border-secondary);border-radius:var(--fnd-radius-sm)"></div>
            <div style="height:28px;background:var(--fnd-color-background-base);border:1px solid var(--fnd-color-border-secondary);border-radius:var(--fnd-radius-sm)"></div>
          </div>
        </div>
      </div>`,
  },
  {
    id: 'error-page',
    name: 'Error Page',
    class: 't-error-page',
    desc: 'Fehlerseite (404, 500) mit zentrierter Nachricht.',
    layout: `
      <div style="display:flex;flex-direction:column;height:300px;border:1px solid var(--fnd-color-border-secondary);border-radius:var(--fnd-radius-md);overflow:hidden">
        <div style="height:40px;background:var(--fnd-color-layer-01);border-bottom:1px solid var(--fnd-color-border-secondary);display:flex;align-items:center;padding:0 12px;font-size:var(--fs-2xs);color:var(--fnd-color-text-secondary)">Header</div>
        <div style="flex:1;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:8px">
          <div style="font-size:var(--fs-4xl);font-weight:var(--fnd-font-weight-bold);color:var(--fnd-color-text-tertiary)">404</div>
          <div style="font-size:var(--fs-sm);color:var(--fnd-color-text-secondary)">Seite nicht gefunden</div>
          <div style="height:32px;width:120px;background:var(--fnd-color-interactive-default);border-radius:var(--fnd-radius-sm);margin-top:8px"></div>
        </div>
      </div>`,
  },
  {
    id: 'shell',
    name: 'Shell (data-layout)',
    class: 'nc-shell',
    desc: 'Neues Shell-System mit data-layout Presets. Ersetzt die .t-* Klassen.',
    layout: `
      <div style="display:grid;grid-template-rows:40px 1fr 32px;height:300px;border:1px solid var(--fnd-color-border-secondary);border-radius:var(--fnd-radius-md);overflow:hidden">
        <div style="background:var(--fnd-color-layer-01);border-bottom:1px solid var(--fnd-color-border-secondary);display:flex;align-items:center;padding:0 12px;font-size:var(--fs-2xs);color:var(--fnd-color-text-secondary)">nc-shell__header</div>
        <div style="display:flex">
          <div style="flex:1;padding:12px;display:flex;align-items:center;justify-content:center;font-size:var(--fs-xs);color:var(--fnd-color-text-tertiary)">nc-shell__main</div>
        </div>
        <div style="background:var(--fnd-color-layer-01);border-top:1px solid var(--fnd-color-border-secondary);display:flex;align-items:center;padding:0 12px;font-size:var(--fs-2xs);color:var(--fnd-color-text-tertiary)">nc-shell__footer</div>
      </div>`,
  },
];

export default {
  title: 'Templates/Page Layouts',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**Page Templates** — 5 vordefinierte Seiten-Layouts + Shell-System.
Artikel- und Formularseiten laufen ueber die Shell-Presets \`data-layout="content-page"\` bzw. \`data-layout="focused"\`.
Templates definieren die Grundstruktur einer Seite (Grid, Bereiche, Proportionen).
Migration: \`.t-*\` Klassen werden durch \`data-layout\` Presets auf dem Shell-System ersetzt.`,
      },
    },
  },
};

// Helper: Story fuer einzelnes Template
function makeStory(tmpl) {
  return {
    name: tmpl.name,
    render: () => `<div style="padding:24px;max-width:500px">
      <h3 style="margin-bottom:8px;font-size:var(--fs-base)">${tmpl.name}</h3>
      <p style="font-size:var(--fs-sm);color:var(--fnd-color-text-secondary);margin-bottom:16px">${tmpl.desc}</p>
      <code style="font-size:var(--fs-2xs);color:var(--fnd-color-interactive-default);display:block;margin-bottom:12px">.${tmpl.class}</code>
      ${tmpl.layout}
    </div>`,
  };
}

export const Dashboard = makeStory(TEMPLATES[0]);
export const HomeHero = makeStory(TEMPLATES[1]);
export const HomeBasic = makeStory(TEMPLATES[2]);
export const SettingsPage = makeStory(TEMPLATES[3]);
export const ErrorPage = makeStory(TEMPLATES[4]);
export const Shell = makeStory(TEMPLATES[5]);

export const AllTemplates = {
  name: 'All Templates Overview',
  render: () => `<div style="padding:24px;display:grid;grid-template-columns:repeat(auto-fill,minmax(360px,1fr));gap:24px">
    ${TEMPLATES.map(t => `
      <div>
        <h3 style="margin-bottom:4px;font-size:var(--fs-sm)">${t.name}</h3>
        <p style="font-size:var(--fs-xs);color:var(--fnd-color-text-secondary);margin-bottom:8px">${t.desc}</p>
        <code style="font-size:var(--fs-2xs);color:var(--fnd-color-interactive-default);display:block;margin-bottom:8px">.${t.class}</code>
        ${t.layout}
      </div>
    `).join('')}
  </div>`,
  parameters: { docs: { description: { story: 'Uebersicht aller 6 Seiten-Templates als Wireframe.' } } },
};
