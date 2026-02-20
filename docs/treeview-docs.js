// ==========================================================================
// TreeView Docs — Tab Navigation + Staging Area + 4 Showcase Demos
// ==========================================================================

(function () {
  'use strict';

  // -----------------------------------------------------------------------
  // 1. Tab Navigation
  // -----------------------------------------------------------------------

  var tabList = document.querySelector('.docs-tabs__list');
  var triggers = tabList ? tabList.querySelectorAll('.docs-tabs__trigger') : [];
  var panels = document.querySelectorAll('.docs-tabs__panel');

  function activateTab(trigger) {
    triggers.forEach(function (t) { t.setAttribute('aria-selected', 'false'); });
    panels.forEach(function (p) { p.classList.remove('is-active'); });
    trigger.setAttribute('aria-selected', 'true');
    var panelId = trigger.getAttribute('aria-controls');
    var panel = document.getElementById(panelId);
    if (panel) panel.classList.add('is-active');
  }

  triggers.forEach(function (trigger) {
    trigger.addEventListener('click', function () { activateTab(trigger); });
    trigger.addEventListener('keydown', function (e) {
      var index = Array.prototype.indexOf.call(triggers, trigger);
      var nextIndex = -1;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        nextIndex = (index + 1) % triggers.length;
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        nextIndex = (index - 1 + triggers.length) % triggers.length;
      } else if (e.key === 'Home') {
        nextIndex = 0;
      } else if (e.key === 'End') {
        nextIndex = triggers.length - 1;
      }
      if (nextIndex >= 0) {
        e.preventDefault();
        triggers[nextIndex].focus();
        activateTab(triggers[nextIndex]);
      }
    });
  });

  // -----------------------------------------------------------------------
  // 2. SVG Constants (Icons from the design system icon set)
  // -----------------------------------------------------------------------

  var CHEVRON_SVG = '<svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 4 10 8 6 12"/></svg>';

  var FOLDER_SVG = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>';

  var DOCUMENT_SVG = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>';

  var GLOBE_SVG = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>';

  var EXTERNAL_ARROW_SVG = '<svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 3h7v7"/><path d="M13 3L6 10"/></svg>';

  // -----------------------------------------------------------------------
  // 3. Sample Data
  // -----------------------------------------------------------------------

  var TREE_DATA = [
    {
      label: 'Projekte',
      type: 'branch',
      children: [
        { label: 'README.md', type: 'leaf' },
        {
          label: 'src',
          type: 'branch',
          children: [
            { label: 'index.js', type: 'leaf' },
            { label: 'styles.css', type: 'leaf' },
            {
              label: 'components',
              type: 'branch',
              children: [
                { label: 'App.js', type: 'leaf' },
                { label: 'Header.js', type: 'leaf' },
                { label: 'Footer.js', type: 'leaf' }
              ]
            }
          ]
        },
        { label: 'package.json', type: 'leaf' },
        { label: '.gitignore', type: 'leaf' }
      ]
    },
    {
      label: 'Dokumente',
      type: 'branch',
      children: [
        { label: 'Planung.pdf', type: 'leaf' },
        { label: 'Bericht.docx', type: 'leaf' },
        {
          label: 'Archiv',
          type: 'branch',
          children: [
            { label: 'Q1-Report.xlsx', type: 'leaf' },
            { label: 'Q2-Report.xlsx', type: 'leaf' }
          ]
        }
      ]
    },
    { label: 'LICENSE', type: 'leaf' }
  ];

  var LINK_DATA = [
    {
      label: 'Ressourcen',
      type: 'branch',
      children: [
        { label: 'MDN Web Docs', type: 'link', href: 'https://developer.mozilla.org' },
        { label: 'W3C WAI-ARIA Practices', type: 'link', href: 'https://www.w3.org/WAI/ARIA/apg/' },
        {
          label: 'Frameworks',
          type: 'branch',
          children: [
            { label: 'React Docs', type: 'link', href: 'https://react.dev' },
            { label: 'Vue.js', type: 'link', href: 'https://vuejs.org' },
            { label: 'Svelte', type: 'link', href: 'https://svelte.dev' }
          ]
        }
      ]
    },
    {
      label: 'Design Systems',
      type: 'branch',
      children: [
        { label: 'Carbon Design System', type: 'link', href: 'https://carbondesignsystem.com' },
        { label: 'shadcn/ui', type: 'link', href: 'https://ui.shadcn.com' },
        { label: 'Material Design', type: 'link', href: 'https://m3.material.io' }
      ]
    },
    {
      label: 'Tools',
      type: 'branch',
      children: [
        { label: 'GitHub', type: 'link', href: 'https://github.com' },
        { label: 'Figma', type: 'link', href: 'https://www.figma.com' }
      ]
    }
  ];

  // -----------------------------------------------------------------------
  // 4. DOM Helpers
  // -----------------------------------------------------------------------

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }

  // -----------------------------------------------------------------------
  // 5. Tree Builder
  // -----------------------------------------------------------------------

  function buildTree(data, options) {
    options = options || {};
    var nav = el('nav', 'nc-treeview');
    nav.setAttribute('aria-label', 'Dateistruktur');

    var rootList = el('ul', 'nc-treeview__list');
    rootList.setAttribute('role', 'tree');

    data.forEach(function (item, index) {
      rootList.appendChild(buildNode(item, 0, index === 0, options));
    });

    nav.appendChild(rootList);
    return nav;
  }

  function buildNode(item, level, isFirstRoot, options) {
    var li = el('li', 'nc-treeview__item');
    li.setAttribute('role', 'treeitem');
    li.style.setProperty('--_level', level);

    var isBranch = item.children && item.children.length > 0;
    var isLink = item.type === 'link';

    li.classList.add(isBranch ? 'nc-treeview__item--branch' : 'nc-treeview__item--leaf');

    if (isBranch) {
      li.setAttribute('aria-expanded', 'false');
    }

    // Node row
    var node = el('div', 'nc-treeview__node');
    node.setAttribute('tabindex', (isFirstRoot && level === 0) ? '0' : '-1');

    // Toggle (chevron)
    var toggle;
    if (isBranch) {
      toggle = el('button', 'nc-treeview__toggle');
      toggle.type = 'button';
      toggle.setAttribute('tabindex', '-1');
      toggle.setAttribute('aria-hidden', 'true');
    } else {
      toggle = el('span', 'nc-treeview__toggle');
      toggle.setAttribute('aria-hidden', 'true');
    }
    toggle.innerHTML = CHEVRON_SVG;
    node.appendChild(toggle);

    // Icon (optional)
    if (options.icons) {
      var icon = el('span', 'nc-treeview__icon');
      icon.innerHTML = isBranch ? FOLDER_SVG : DOCUMENT_SVG;
      node.appendChild(icon);
    }

    // Link variant
    if (options.links && isLink) {
      var linkIcon = el('span', 'nc-treeview__icon');
      linkIcon.innerHTML = GLOBE_SVG;
      node.appendChild(linkIcon);

      var a = el('a', 'nc-treeview__link');
      a.href = item.href;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.textContent = item.label + ' ';
      var arrowSpan = document.createElement('span');
      arrowSpan.innerHTML = EXTERNAL_ARROW_SVG;
      a.appendChild(arrowSpan.firstChild);
      node.appendChild(a);
    } else {
      // Label
      var label = el('span', 'nc-treeview__label');
      label.textContent = item.label;
      node.appendChild(label);
    }

    li.appendChild(node);

    // Children
    if (isBranch) {
      var childList = el('ul', 'nc-treeview__list');
      childList.setAttribute('role', 'group');
      item.children.forEach(function (child) {
        childList.appendChild(buildNode(child, level + 1, false, options));
      });
      li.appendChild(childList);
    }

    return li;
  }

  // -----------------------------------------------------------------------
  // 6. TreeView Interaction Controller
  // -----------------------------------------------------------------------

  function initTreeView(container) {
    if (!container) return;

    var tree = container.querySelector('[role="tree"]');
    if (!tree) return;

    // --- Click Handler ---
    tree.addEventListener('click', function (e) {
      var node = e.target.closest('.nc-treeview__node');
      if (!node) return;

      var item = node.closest('.nc-treeview__item');
      if (!item || item.classList.contains('nc-treeview__item--disabled')) return;

      // Let external links navigate
      if (e.target.closest('.nc-treeview__link')) return;

      // Toggle expand/collapse for branches
      if (item.classList.contains('nc-treeview__item--branch')) {
        var expanded = item.getAttribute('aria-expanded') === 'true';
        item.setAttribute('aria-expanded', String(!expanded));
      }

      // Selection
      selectNode(tree, item);

      // Focus the node
      focusNode(node);
    });

    // --- Keyboard Navigation (WAI-ARIA TreeView Pattern) ---
    tree.addEventListener('keydown', function (e) {
      var currentNode = document.activeElement;
      if (!currentNode || !currentNode.classList.contains('nc-treeview__node')) return;

      var currentItem = currentNode.closest('.nc-treeview__item');
      if (!currentItem) return;

      var visibleNodes = getVisibleNodes(tree);
      var currentIndex = visibleNodes.indexOf(currentNode);

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          if (currentIndex < visibleNodes.length - 1) {
            focusNode(visibleNodes[currentIndex + 1]);
          }
          break;

        case 'ArrowUp':
          e.preventDefault();
          if (currentIndex > 0) {
            focusNode(visibleNodes[currentIndex - 1]);
          }
          break;

        case 'ArrowRight':
          e.preventDefault();
          if (currentItem.classList.contains('nc-treeview__item--branch')) {
            if (currentItem.getAttribute('aria-expanded') === 'false') {
              currentItem.setAttribute('aria-expanded', 'true');
            } else {
              var firstChild = currentItem.querySelector('.nc-treeview__list > .nc-treeview__item > .nc-treeview__node');
              if (firstChild) focusNode(firstChild);
            }
          }
          break;

        case 'ArrowLeft':
          e.preventDefault();
          if (currentItem.classList.contains('nc-treeview__item--branch') &&
              currentItem.getAttribute('aria-expanded') === 'true') {
            currentItem.setAttribute('aria-expanded', 'false');
          } else {
            var parentGroup = currentItem.closest('.nc-treeview__list[role="group"]');
            if (parentGroup) {
              var parentItem = parentGroup.closest('.nc-treeview__item');
              if (parentItem) {
                var parentNode = parentItem.querySelector(':scope > .nc-treeview__node');
                if (parentNode) focusNode(parentNode);
              }
            }
          }
          break;

        case 'Home':
          e.preventDefault();
          if (visibleNodes.length) focusNode(visibleNodes[0]);
          break;

        case 'End':
          e.preventDefault();
          if (visibleNodes.length) focusNode(visibleNodes[visibleNodes.length - 1]);
          break;

        case 'Enter':
        case ' ':
          e.preventDefault();
          currentNode.click();
          break;
      }
    });
  }

  function getVisibleNodes(tree) {
    var nodes = [];
    var allNodes = tree.querySelectorAll('.nc-treeview__node');
    allNodes.forEach(function (node) {
      var item = node.closest('.nc-treeview__item');
      if (isNodeVisible(item, tree)) {
        nodes.push(node);
      }
    });
    return nodes;
  }

  function isNodeVisible(item, tree) {
    var current = item;
    while (current && current !== tree) {
      var parentGroup = current.parentElement;
      if (parentGroup && parentGroup.getAttribute('role') === 'group') {
        var parentItem = parentGroup.closest('.nc-treeview__item');
        if (parentItem && parentItem.getAttribute('aria-expanded') !== 'true') {
          return false;
        }
      }
      current = current.parentElement;
    }
    return true;
  }

  function focusNode(node) {
    var tree = node.closest('[role="tree"]');
    if (tree) {
      tree.querySelectorAll('.nc-treeview__node[tabindex="0"]').forEach(function (n) {
        n.setAttribute('tabindex', '-1');
      });
    }
    node.setAttribute('tabindex', '0');
    node.focus();
  }

  function selectNode(tree, item) {
    tree.querySelectorAll('.nc-treeview__item').forEach(function (i) {
      i.classList.remove('nc-treeview__item--selected');
      i.setAttribute('aria-selected', 'false');
    });
    item.classList.add('nc-treeview__item--selected');
    item.setAttribute('aria-selected', 'true');
  }

  // -----------------------------------------------------------------------
  // 7. Controlled Expansion
  // -----------------------------------------------------------------------

  function initControlledExpansion(wrapper) {
    var expandBtn = wrapper.querySelector('[data-treeview-expand-all]');
    var collapseBtn = wrapper.querySelector('[data-treeview-collapse-all]');
    var nav = wrapper.querySelector('.nc-treeview');
    if (!nav) return;

    if (expandBtn) {
      expandBtn.addEventListener('click', function () {
        nav.querySelectorAll('.nc-treeview__item--branch').forEach(function (item) {
          item.setAttribute('aria-expanded', 'true');
        });
      });
    }

    if (collapseBtn) {
      collapseBtn.addEventListener('click', function () {
        nav.querySelectorAll('.nc-treeview__item--branch').forEach(function (item) {
          item.setAttribute('aria-expanded', 'false');
        });
      });
    }
  }

  // -----------------------------------------------------------------------
  // 8. Code Snippet Generator
  // -----------------------------------------------------------------------

  function generateCode(variant) {
    if (variant === 'controlled') {
      return '<div class="nc-treeview__controls">\n' +
        '  <button class="nc-button nc-button--outline nc-button--sm"\n' +
        '          data-treeview-expand-all>Alles aufklappen</button>\n' +
        '  <button class="nc-button nc-button--outline nc-button--sm"\n' +
        '          data-treeview-collapse-all>Alles zuklappen</button>\n' +
        '</div>\n' +
        '<nav class="nc-treeview" aria-label="Dateistruktur">\n' +
        '  <ul class="nc-treeview__list" role="tree">\n' +
        '    <li class="nc-treeview__item nc-treeview__item--branch"\n' +
        '        role="treeitem" aria-expanded="false" style="--_level: 0">\n' +
        '      <div class="nc-treeview__node" tabindex="0">\n' +
        '        <button class="nc-treeview__toggle" tabindex="-1" aria-hidden="true">\n' +
        '          <svg viewBox="0 0 16 16"><polyline points="6 4 10 8 6 12"/></svg>\n' +
        '        </button>\n' +
        '        <span class="nc-treeview__label">Ordnername</span>\n' +
        '      </div>\n' +
        '      <ul class="nc-treeview__list" role="group">...</ul>\n' +
        '    </li>\n' +
        '  </ul>\n' +
        '</nav>';
    }

    if (variant === 'icons') {
      return '<nav class="nc-treeview" aria-label="Dateistruktur">\n' +
        '  <ul class="nc-treeview__list" role="tree">\n' +
        '    <li class="nc-treeview__item nc-treeview__item--branch"\n' +
        '        role="treeitem" aria-expanded="false" style="--_level: 0">\n' +
        '      <div class="nc-treeview__node" tabindex="0">\n' +
        '        <button class="nc-treeview__toggle" tabindex="-1" aria-hidden="true">\n' +
        '          <svg viewBox="0 0 16 16"><polyline points="6 4 10 8 6 12"/></svg>\n' +
        '        </button>\n' +
        '        <span class="nc-treeview__icon">\n' +
        '          <svg><!-- folder.svg --></svg>\n' +
        '        </span>\n' +
        '        <span class="nc-treeview__label">Ordnername</span>\n' +
        '      </div>\n' +
        '      <ul class="nc-treeview__list" role="group">\n' +
        '        <li class="nc-treeview__item nc-treeview__item--leaf"\n' +
        '            role="treeitem" style="--_level: 1">\n' +
        '          <div class="nc-treeview__node" tabindex="-1">\n' +
        '            <span class="nc-treeview__toggle" aria-hidden="true">...</span>\n' +
        '            <span class="nc-treeview__icon">\n' +
        '              <svg><!-- document.svg --></svg>\n' +
        '            </span>\n' +
        '            <span class="nc-treeview__label">Dateiname</span>\n' +
        '          </div>\n' +
        '        </li>\n' +
        '      </ul>\n' +
        '    </li>\n' +
        '  </ul>\n' +
        '</nav>';
    }

    if (variant === 'links') {
      return '<nav class="nc-treeview" aria-label="Ressourcen">\n' +
        '  <ul class="nc-treeview__list" role="tree">\n' +
        '    <li class="nc-treeview__item nc-treeview__item--branch"\n' +
        '        role="treeitem" aria-expanded="false" style="--_level: 0">\n' +
        '      <div class="nc-treeview__node" tabindex="0">\n' +
        '        <button class="nc-treeview__toggle" tabindex="-1" aria-hidden="true">\n' +
        '          <svg viewBox="0 0 16 16"><polyline points="6 4 10 8 6 12"/></svg>\n' +
        '        </button>\n' +
        '        <span class="nc-treeview__label">Kategorie</span>\n' +
        '      </div>\n' +
        '      <ul class="nc-treeview__list" role="group">\n' +
        '        <li class="nc-treeview__item nc-treeview__item--leaf"\n' +
        '            role="treeitem" style="--_level: 1">\n' +
        '          <div class="nc-treeview__node" tabindex="-1">\n' +
        '            <span class="nc-treeview__toggle" aria-hidden="true">...</span>\n' +
        '            <span class="nc-treeview__icon">\n' +
        '              <svg><!-- globe.svg --></svg>\n' +
        '            </span>\n' +
        '            <a class="nc-treeview__link" href="https://..."\n' +
        '               target="_blank" rel="noopener noreferrer">\n' +
        '              Linktext\n' +
        '              <svg><!-- external-arrow --></svg>\n' +
        '            </a>\n' +
        '          </div>\n' +
        '        </li>\n' +
        '      </ul>\n' +
        '    </li>\n' +
        '  </ul>\n' +
        '</nav>';
    }

    // default
    return '<nav class="nc-treeview" aria-label="Dateistruktur">\n' +
      '  <ul class="nc-treeview__list" role="tree">\n' +
      '    <li class="nc-treeview__item nc-treeview__item--branch"\n' +
      '        role="treeitem" aria-expanded="false" style="--_level: 0">\n' +
      '      <div class="nc-treeview__node" tabindex="0">\n' +
      '        <button class="nc-treeview__toggle" tabindex="-1" aria-hidden="true">\n' +
      '          <svg viewBox="0 0 16 16"><polyline points="6 4 10 8 6 12"/></svg>\n' +
      '        </button>\n' +
      '        <span class="nc-treeview__label">Ordnername</span>\n' +
      '      </div>\n' +
      '      <ul class="nc-treeview__list" role="group">\n' +
      '        <li class="nc-treeview__item nc-treeview__item--leaf"\n' +
      '            role="treeitem" style="--_level: 1">\n' +
      '          <div class="nc-treeview__node" tabindex="-1">\n' +
      '            <span class="nc-treeview__toggle" aria-hidden="true">\n' +
      '              <svg viewBox="0 0 16 16"><polyline points="6 4 10 8 6 12"/></svg>\n' +
      '            </span>\n' +
      '            <span class="nc-treeview__label">Dateiname</span>\n' +
      '          </div>\n' +
      '        </li>\n' +
      '      </ul>\n' +
      '    </li>\n' +
      '  </ul>\n' +
      '</nav>';
  }

  // -----------------------------------------------------------------------
  // 9. Staging Area
  // -----------------------------------------------------------------------

  var themeSelect   = document.getElementById('stage-theme');
  var variantSelect = document.getElementById('stage-variant');
  var preview       = document.getElementById('stage-preview');
  var codeOutput    = document.getElementById('stage-code');

  if (!preview) return;

  function updateStage() {
    var theme   = themeSelect ? themeSelect.value : 'neo-light-theme';
    var variant = variantSelect ? variantSelect.value : 'default';

    // Apply theme
    var themes = ['neo-light-theme', 'neo-dark-theme', 'customer-light-theme', 'customer-dark-theme'];
    themes.forEach(function (t) { preview.classList.remove(t); });
    preview.classList.add(theme);

    // Clear & rebuild
    preview.innerHTML = '';

    var options = {};
    var data = TREE_DATA;

    if (variant === 'controlled') {
      var wrapper = el('div');
      var controls = el('div', 'nc-treeview__controls');
      var expandBtn = el('button', 'nc-button nc-button--outline nc-button--sm', 'Alles aufklappen');
      expandBtn.type = 'button';
      expandBtn.setAttribute('data-treeview-expand-all', '');
      var collapseBtn = el('button', 'nc-button nc-button--outline nc-button--sm', 'Alles zuklappen');
      collapseBtn.type = 'button';
      collapseBtn.setAttribute('data-treeview-collapse-all', '');
      controls.appendChild(expandBtn);
      controls.appendChild(collapseBtn);
      wrapper.appendChild(controls);
      wrapper.appendChild(buildTree(data, options));
      preview.appendChild(wrapper);
      initTreeView(wrapper.querySelector('.nc-treeview'));
      initControlledExpansion(wrapper);
    } else if (variant === 'icons') {
      options.icons = true;
      var tree = buildTree(data, options);
      preview.appendChild(tree);
      initTreeView(tree);
    } else if (variant === 'links') {
      options.links = true;
      data = LINK_DATA;
      var tree = buildTree(data, options);
      preview.appendChild(tree);
      initTreeView(tree);
    } else {
      var tree = buildTree(data, options);
      preview.appendChild(tree);
      initTreeView(tree);
    }

    // Update code output
    if (codeOutput) {
      codeOutput.textContent = generateCode(variant);
    }
  }

  if (themeSelect) themeSelect.addEventListener('change', updateStage);
  if (variantSelect) variantSelect.addEventListener('change', updateStage);
  updateStage();

  // -----------------------------------------------------------------------
  // 10. Showcase Sections
  // -----------------------------------------------------------------------

  // Showcase 1: Default
  var showcaseDefault = document.getElementById('showcase-default');
  if (showcaseDefault) {
    var tree1 = buildTree(TREE_DATA, {});
    showcaseDefault.appendChild(tree1);
    initTreeView(tree1);
  }

  // Showcase 2: Controlled Expansion
  var showcaseControlled = document.getElementById('showcase-controlled');
  if (showcaseControlled) {
    var wrapper2 = el('div');
    var controls2 = el('div', 'nc-treeview__controls');
    var expandBtn2 = el('button', 'nc-button nc-button--outline nc-button--sm', 'Alles aufklappen');
    expandBtn2.type = 'button';
    expandBtn2.setAttribute('data-treeview-expand-all', '');
    var collapseBtn2 = el('button', 'nc-button nc-button--outline nc-button--sm', 'Alles zuklappen');
    collapseBtn2.type = 'button';
    collapseBtn2.setAttribute('data-treeview-collapse-all', '');
    controls2.appendChild(expandBtn2);
    controls2.appendChild(collapseBtn2);
    wrapper2.appendChild(controls2);
    wrapper2.appendChild(buildTree(TREE_DATA, {}));
    showcaseControlled.appendChild(wrapper2);
    initTreeView(wrapper2.querySelector('.nc-treeview'));
    initControlledExpansion(wrapper2);
  }

  // Showcase 3: With Icons
  var showcaseIcons = document.getElementById('showcase-icons');
  if (showcaseIcons) {
    var tree3 = buildTree(TREE_DATA, { icons: true });
    showcaseIcons.appendChild(tree3);
    initTreeView(tree3);
  }

  // Showcase 4: With Links
  var showcaseLinks = document.getElementById('showcase-links');
  if (showcaseLinks) {
    var tree4 = buildTree(LINK_DATA, { links: true });
    showcaseLinks.appendChild(tree4);
    initTreeView(tree4);
  }

})();
