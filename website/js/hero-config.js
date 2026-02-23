const DATA_URL = 'website/data/site-data.json';
const HERO_CONFIG_KEY = 'heroConfig';

const createEl = (tag, className, text) => {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (text) el.textContent = text;
  return el;
};

const loadStoredConfig = () => {
  const raw = localStorage.getItem(HERO_CONFIG_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch (error) {
    console.warn('Invalid hero config in localStorage.', error);
    return null;
  }
};

const state = {
  data: null,
  selectedHeroId: null,
  defaultHeroId: null
};

const findHeroSections = (data) =>
  data.inventory.sections.filter((section) => section.type === 'hero');

const getHomeLayoutHeroId = (data) => {
  const home = data.site_blueprint.pages.find((page) => page.id === 'home');
  if (!home) return null;
  return home.layout.find((id) => id.startsWith('hero-')) || null;
};

const render = () => {
  const root = document.getElementById('hero-config-root');
  root.innerHTML = '';

  const field = createEl('div', 'nc-config__field');
  const label = createEl('label', null, 'Hero-Variante (Startseite)');
  const select = createEl('select');
  select.dataset.action = 'select-hero';

  const sections = findHeroSections(state.data);
  sections.forEach((section) => {
    const option = document.createElement('option');
    option.value = section.id;
    option.textContent = `${section.id}${section.id === state.defaultHeroId ? ' (Default)' : ''}`;
    if (section.id === state.selectedHeroId) option.selected = true;
    select.appendChild(option);
  });

  field.append(label, select);
  root.appendChild(field);
};

const setStatus = (msg) => {
  const status = document.querySelector('.nc-config__status');
  if (status) status.textContent = msg;
};

const init = async () => {
  const response = await fetch(DATA_URL);
  state.data = await response.json();

  state.defaultHeroId = getHomeLayoutHeroId(state.data);
  const stored = loadStoredConfig();
  const preferredId = 'hero-primary--content-picture--with-bg-color';
  const hasPreferred = findHeroSections(state.data).some((section) => section.id === preferredId);
  if (hasPreferred) {
    if (stored?.home !== preferredId) {
      state.selectedHeroId = preferredId;
      localStorage.setItem(HERO_CONFIG_KEY, JSON.stringify({ home: preferredId }));
      setStatus('Hero-Variante automatisch auf neue Variante gesetzt.');
    } else {
      state.selectedHeroId = stored.home;
    }
  } else if (stored?.home) {
    state.selectedHeroId = stored.home;
  } else {
    state.selectedHeroId = state.defaultHeroId;
  }

  render();
  if (!stored?.home || stored?.home === state.defaultHeroId) {
    // keep status from auto-apply if it was set
    setStatus(document.querySelector('.nc-config__status')?.textContent || '');
  }
};

document.addEventListener('change', (event) => {
  const select = event.target.closest('select[data-action="select-hero"]');
  if (!select) return;
  state.selectedHeroId = select.value;
});

document.addEventListener('click', (event) => {
  const action = event.target.closest('[data-action]')?.dataset.action;
  if (!action) return;

  if (action === 'save') {
    const payload = { home: state.selectedHeroId };
    localStorage.setItem(HERO_CONFIG_KEY, JSON.stringify(payload));
    setStatus('Gespeichert.');
    return;
  }

  if (action === 'reset') {
    localStorage.removeItem(HERO_CONFIG_KEY);
    state.selectedHeroId = state.defaultHeroId;
    render();
    setStatus('Zurückgesetzt.');
  }
});

init();
