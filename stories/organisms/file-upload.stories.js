// ============================================================
// FileUpload — Auto-generated from file-upload-recipe.json
// Version: 1.0.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Organisms/FileUpload',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**FileUpload** v1.0.0 (stable)

Dropzone: flex-column zentriert, gestrichelte Border (dashed), Hover wechselt Border + BG.


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
    <code style="font:inherit;font-family:ui-monospace,monospace">data/markup/file-upload.html</code>.
  </p>
  <div class="nc-file-upload">
    <span class="nc-file-upload__text">file-upload</span>
    <span class="nc-file-upload__input">input</span>
  </div>
</div>`,
};

export const AllStates = {
  name: 'All States',
  render: () => `<div style="border:1px dashed #92500a;border-radius:4px;padding:12px">
  <p style="margin:0 0 10px;font:600 12px/1.4 ui-monospace,monospace;letter-spacing:.08em;text-transform:uppercase;color:#92500a">
    Kein echtes Markup hinterlegt
  </p>
  <p style="margin:0 0 12px;font:400 13px/1.5 system-ui,sans-serif;color:#595c59;max-width:62ch">
    Was hier steht, ist aus der Anatomie des Recipes abgeleitet — die Slots als
    Geschwister, ohne Schachtelung und ohne Zustaende. So sieht das Bauteil
    nicht aus. Echtes Markup gehoert nach
    <code style="font:inherit;font-family:ui-monospace,monospace">data/markup/file-upload.html</code>.
  </p>
  <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-file-upload">
    <span class="nc-file-upload__text">file-upload</span>
    <span class="nc-file-upload__input">input</span>
  </div>
</div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Dropzone in allen Zustaenden: default, hover, focus, dragging, disabled' },
    },
  },
};

export const VariantComparison = {
  name: 'Variant Comparison',
  render: () => `<div style="border:1px dashed #92500a;border-radius:4px;padding:12px">
  <p style="margin:0 0 10px;font:600 12px/1.4 ui-monospace,monospace;letter-spacing:.08em;text-transform:uppercase;color:#92500a">
    Kein echtes Markup hinterlegt
  </p>
  <p style="margin:0 0 12px;font:400 13px/1.5 system-ui,sans-serif;color:#595c59;max-width:62ch">
    Was hier steht, ist aus der Anatomie des Recipes abgeleitet — die Slots als
    Geschwister, ohne Schachtelung und ohne Zustaende. So sieht das Bauteil
    nicht aus. Echtes Markup gehoert nach
    <code style="font:inherit;font-family:ui-monospace,monospace">data/markup/file-upload.html</code>.
  </p>
  <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  
</div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Default Dropzone vs Compact Variante' },
    },
  },
};

export const WithFileList = {
  name: 'With File List',
  render: () => `<div style="border:1px dashed #92500a;border-radius:4px;padding:12px">
  <p style="margin:0 0 10px;font:600 12px/1.4 ui-monospace,monospace;letter-spacing:.08em;text-transform:uppercase;color:#92500a">
    Kein echtes Markup hinterlegt
  </p>
  <p style="margin:0 0 12px;font:400 13px/1.5 system-ui,sans-serif;color:#595c59;max-width:62ch">
    Was hier steht, ist aus der Anatomie des Recipes abgeleitet — die Slots als
    Geschwister, ohne Schachtelung und ohne Zustaende. So sieht das Bauteil
    nicht aus. Echtes Markup gehoert nach
    <code style="font:inherit;font-family:ui-monospace,monospace">data/markup/file-upload.html</code>.
  </p>
  <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-file-upload">
    <span class="nc-file-upload__text">file-upload</span>
    <span class="nc-file-upload__input">input</span>
  </div>
</div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Dropzone mit angehaengter Dateiliste (hochgeladene Dateien)' },
    },
  },
};

export const WithUploadProgress = {
  name: 'With Upload Progress',
  render: () => `<div style="border:1px dashed #92500a;border-radius:4px;padding:12px">
  <p style="margin:0 0 10px;font:600 12px/1.4 ui-monospace,monospace;letter-spacing:.08em;text-transform:uppercase;color:#92500a">
    Kein echtes Markup hinterlegt
  </p>
  <p style="margin:0 0 12px;font:400 13px/1.5 system-ui,sans-serif;color:#595c59;max-width:62ch">
    Was hier steht, ist aus der Anatomie des Recipes abgeleitet — die Slots als
    Geschwister, ohne Schachtelung und ohne Zustaende. So sieht das Bauteil
    nicht aus. Echtes Markup gehoert nach
    <code style="font:inherit;font-family:ui-monospace,monospace">data/markup/file-upload.html</code>.
  </p>
  <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-file-upload">
    <span class="nc-file-upload__text">file-upload</span>
    <span class="nc-file-upload__input">input</span>
  </div>
</div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Dateiliste mit Upload-Fortschrittsbalken' },
    },
  },
};

export const ErrorStates = {
  name: 'Error States',
  render: () => `<div style="border:1px dashed #92500a;border-radius:4px;padding:12px">
  <p style="margin:0 0 10px;font:600 12px/1.4 ui-monospace,monospace;letter-spacing:.08em;text-transform:uppercase;color:#92500a">
    Kein echtes Markup hinterlegt
  </p>
  <p style="margin:0 0 12px;font:400 13px/1.5 system-ui,sans-serif;color:#595c59;max-width:62ch">
    Was hier steht, ist aus der Anatomie des Recipes abgeleitet — die Slots als
    Geschwister, ohne Schachtelung und ohne Zustaende. So sieht das Bauteil
    nicht aus. Echtes Markup gehoert nach
    <code style="font:inherit;font-family:ui-monospace,monospace">data/markup/file-upload.html</code>.
  </p>
  <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-file-upload">
    <span class="nc-file-upload__text">file-upload</span>
    <span class="nc-file-upload__input">input</span>
  </div>
</div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Dropzone-Error und einzelne Datei-Error im Vergleich' },
    },
  },
};

export const CompactwithList = {
  name: 'Compact with List',
  render: () => `<div style="border:1px dashed #92500a;border-radius:4px;padding:12px">
  <p style="margin:0 0 10px;font:600 12px/1.4 ui-monospace,monospace;letter-spacing:.08em;text-transform:uppercase;color:#92500a">
    Kein echtes Markup hinterlegt
  </p>
  <p style="margin:0 0 12px;font:400 13px/1.5 system-ui,sans-serif;color:#595c59;max-width:62ch">
    Was hier steht, ist aus der Anatomie des Recipes abgeleitet — die Slots als
    Geschwister, ohne Schachtelung und ohne Zustaende. So sieht das Bauteil
    nicht aus. Echtes Markup gehoert nach
    <code style="font:inherit;font-family:ui-monospace,monospace">data/markup/file-upload.html</code>.
  </p>
  <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-file-upload">
    <span class="nc-file-upload__text">file-upload</span>
    <span class="nc-file-upload__input">input</span>
  </div>
</div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Kompakte Variante mit Dateiliste — platzsparend fuer Formulare' },
    },
  },
};
