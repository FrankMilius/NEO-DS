const DATA_URL = 'data/site-data.json';
const NAV_CONFIG_KEY = 'navConfig';

const createEl = (tag, className, text) => {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (text) el.textContent = text;
  return el;
};

const clone = (value) => JSON.parse(JSON.stringify(value));

const findNavSection = (data) =>
  data.inventory.sections.find((section) => section.type === 'navigation');

const loadStoredConfig = () => {
  const raw = localStorage.getItem(NAV_CONFIG_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch (error) {
    console.warn('Invalid nav config in localStorage.', error);
    return null;
  }
};

const normalizeContent = (baseContent, storedContent) => {
  if (!storedContent) return clone(baseContent);
  const merged = clone(baseContent);
  Object.keys(merged).forEach((lang) => {
    if (!storedContent[lang]) return;
    const baseLang = merged[lang];
    const storedLang = storedContent[lang];
    merged[lang] = {
      ...baseLang,
      ...storedLang,
      cta_primary: {
        ...baseLang.cta_primary,
        ...(storedLang.cta_primary || {})
      },
      cta_secondary: {
        ...baseLang.cta_secondary,
        ...(storedLang.cta_secondary || {})
      },
      links: Array.isArray(storedLang.links) ? storedLang.links : baseLang.links
    };
  });
  return merged;
};

const state = {
  config: null,
  defaultConfig: null
};

const buildField = ({ label, value, path, placeholder }) => {
  const wrap = createEl('div', 'nc-config__field');
  const labelEl = createEl('label', null, label);
  const input = createEl('input');
  input.type = 'text';
  input.value = value ?? '';
  input.placeholder = placeholder || '';
  input.dataset.path = path;
  wrap.append(labelEl, input);
  return wrap;
};

const buildLinkEditor = (lang, link, index) => {
  const card = createEl('div', 'nc-config__card');
  const header = createEl('div', 'nc-config__card-header');
  header.append(
    createEl('h3', null, `Link ${index + 1}`),
    createEl('button', 'button outline', 'Entfernen')
  );
  header.querySelector('button').dataset.action = 'remove-link';
  header.querySelector('button').dataset.lang = lang;
  header.querySelector('button').dataset.index = index;

  card.append(
    header,
    buildField({
      label: 'Label',
      value: link.label,
      path: `${lang}.links.${index}.label`
    }),
    buildField({
      label: 'URL',
      value: link.href,
      path: `${lang}.links.${index}.href`
    }),
    buildField({
      label: 'Beschreibung',
      value: link.description || '',
      path: `${lang}.links.${index}.description`
    })
    ,
    buildField({
      label: 'Mega CTA Label',
      value: link.mega_cta_label || '',
      path: `${lang}.links.${index}.mega_cta_label`,
      placeholder: lang === 'de' ? 'z. B. Alle ansehen' : 'e.g. View all'
    })
  );

  const childrenWrap = createEl('div', 'nc-config__children');
  const childrenHeader = createEl('div', 'nc-config__children-header');
  childrenHeader.append(
    createEl('h4', null, 'Untermenü'),
    createEl('button', 'button secondary', 'Unterpunkt hinzufügen')
  );
  const addChildBtn = childrenHeader.querySelector('button');
  addChildBtn.dataset.action = 'add-child';
  addChildBtn.dataset.lang = lang;
  addChildBtn.dataset.index = index;
  childrenWrap.append(childrenHeader);

  if (Array.isArray(link.children) && link.children.length) {
    link.children.forEach((child, childIndex) => {
      const childCard = createEl('div', 'nc-config__child');
      const childHeader = createEl('div', 'nc-config__child-header');
      childHeader.append(
        createEl('h5', null, `Unterpunkt ${childIndex + 1}`),
        createEl('button', 'button ghost', 'Entfernen')
      );
      const removeChildBtn = childHeader.querySelector('button');
      removeChildBtn.dataset.action = 'remove-child';
      removeChildBtn.dataset.lang = lang;
      removeChildBtn.dataset.index = index;
      removeChildBtn.dataset.childIndex = childIndex;
      childCard.append(
        childHeader,
        buildField({
          label: 'Label',
          value: child.label,
          path: `${lang}.links.${index}.children.${childIndex}.label`
        }),
        buildField({
          label: 'URL',
          value: child.href,
          path: `${lang}.links.${index}.children.${childIndex}.href`
        }),
        buildField({
          label: 'Beschreibung',
          value: child.description || '',
          path: `${lang}.links.${index}.children.${childIndex}.description`
        })
      );
      childrenWrap.appendChild(childCard);
    });
  } else {
    const empty = createEl('p', 'nc-config__empty', 'Kein Untermenü vorhanden.');
    childrenWrap.appendChild(empty);
  }

  card.appendChild(childrenWrap);
  return card;
};

const buildLangSection = (lang, content) => {
  const section = createEl('section', 'nc-config__lang');
  section.appendChild(createEl('h2', null, lang.toUpperCase()));

  const topGrid = createEl('div', 'nc-config__grid');
  topGrid.append(
    buildField({
      label: 'Logo Text',
      value: content.logo_text,
      path: `${lang}.logo_text`
    }),
    buildField({
      label: 'CTA Primary Label',
      value: content.cta_primary?.label || '',
      path: `${lang}.cta_primary.label`
    }),
    buildField({
      label: 'CTA Primary URL',
      value: content.cta_primary?.href || '',
      path: `${lang}.cta_primary.href`
    }),
    buildField({
      label: 'CTA Secondary Label',
      value: content.cta_secondary?.label || '',
      path: `${lang}.cta_secondary.label`
    }),
    buildField({
      label: 'CTA Secondary URL',
      value: content.cta_secondary?.href || '',
      path: `${lang}.cta_secondary.href`
    })
  );
  section.appendChild(topGrid);

  const linksWrap = createEl('div', 'nc-config__links');
  const linksHeader = createEl('div', 'nc-config__links-header');
  linksHeader.append(
    createEl('h3', null, 'Navigation Links'),
    createEl('button', 'button secondary', 'Link hinzufügen')
  );
  const addLinkBtn = linksHeader.querySelector('button');
  addLinkBtn.dataset.action = 'add-link';
  addLinkBtn.dataset.lang = lang;
  linksWrap.appendChild(linksHeader);

  content.links.forEach((link, index) => {
    linksWrap.appendChild(buildLinkEditor(lang, link, index));
  });

  section.appendChild(linksWrap);
  return section;
};

const render = () => {
  const root = document.getElementById('nav-config-root');
  root.innerHTML = '';
  Object.entries(state.config).forEach(([lang, content]) => {
    root.appendChild(buildLangSection(lang, content));
  });
};

const setValueByPath = (obj, path, value) => {
  const parts = path.split('.');
  let target = obj;
  parts.forEach((part, index) => {
    const isLast = index === parts.length - 1;
    if (isLast) {
      target[part] = value;
      return;
    }
    if (!(part in target)) {
      target[part] = {};
    }
    target = target[part];
  });
};

const handleInput = (event) => {
  const input = event.target.closest('input');
  if (!input || !input.dataset.path) return;
  setValueByPath(state.config, input.dataset.path, input.value);
};

const addLink = (lang) => {
  state.config[lang].links.push({
    label: '',
    href: '',
    description: '',
    children: []
  });
  render();
};

const removeLink = (lang, index) => {
  state.config[lang].links.splice(index, 1);
  render();
};

const addChild = (lang, index) => {
  const link = state.config[lang].links[index];
  if (!Array.isArray(link.children)) link.children = [];
  link.children.push({ label: '', href: '', description: '' });
  render();
};

const removeChild = (lang, index, childIndex) => {
  const link = state.config[lang].links[index];
  if (!Array.isArray(link.children)) return;
  link.children.splice(childIndex, 1);
  render();
};

const handleClick = (event) => {
  const button = event.target.closest('button');
  if (!button || !button.dataset.action) return;
  const action = button.dataset.action;
  const lang = button.dataset.lang;
  if (action === 'add-link') addLink(lang);
  if (action === 'remove-link') removeLink(lang, Number(button.dataset.index));
  if (action === 'add-child') addChild(lang, Number(button.dataset.index));
  if (action === 'remove-child') {
    removeChild(lang, Number(button.dataset.index), Number(button.dataset.childIndex));
  }
};

const setStatus = (message) => {
  const status = document.querySelector('.nc-config__status');
  if (status) status.textContent = message;
};

const saveConfig = () => {
  localStorage.setItem(NAV_CONFIG_KEY, JSON.stringify(state.config));
  setStatus('Änderungen gespeichert.');
};

const resetConfig = () => {
  state.config = clone(state.defaultConfig);
  localStorage.removeItem(NAV_CONFIG_KEY);
  render();
  setStatus('Zurückgesetzt auf Standard.');
};

const init = async () => {
  const response = await fetch(DATA_URL);
  const data = await response.json();
  const navSection = findNavSection(data);
  if (!navSection) {
    setStatus('Navigation nicht gefunden.');
    return;
  }
  const stored = loadStoredConfig();
  state.defaultConfig = clone(navSection.content);
  state.config = normalizeContent(navSection.content, stored);

  render();
  document.addEventListener('input', handleInput);
  document.addEventListener('click', handleClick);

  const actions = document.querySelector('.nc-config__actions');
  actions?.addEventListener('click', (event) => {
    const button = event.target.closest('button');
    if (!button) return;
    if (button.dataset.action === 'save') saveConfig();
    if (button.dataset.action === 'reset') resetConfig();
  });
};

init().catch((error) => {
  console.error(error);
  setStatus('Fehler beim Laden der Navigation.');
});
