/*! neo-behaviors 0.8.0 — NEO Design System. Gebaut aus packages/neo-behaviors (scripts/baue-behaviors.mjs). Nicht von Hand aendern. */
(() => {
  // packages/neo-behaviors/kern.js
  var GEBUNDEN = /* @__PURE__ */ new WeakMap();
  function bindeAlle(bereich, behaviors) {
    const neu = [];
    for (const b of behaviors) {
      for (const wurzel of finde(bereich, b.selektor)) {
        let liste = GEBUNDEN.get(wurzel);
        if (!liste) {
          liste = /* @__PURE__ */ new Map();
          GEBUNDEN.set(wurzel, liste);
        }
        if (liste.has(b.id)) continue;
        const steuerung = new AbortController();
        liste.set(b.id, steuerung);
        wurzel.setAttribute("data-neo-behavior", [...liste.keys()].join(" "));
        b.binde(wurzel, steuerung.signal);
        neu.push([wurzel, b.id]);
      }
    }
    return () => {
      for (const [w, id] of neu) loese(w, id);
    };
  }
  function loeseAlle(bereich, behaviors) {
    for (const b of behaviors) for (const wurzel of finde(bereich, b.selektor)) loese(wurzel, b.id);
  }
  function loese(wurzel, id) {
    const liste = GEBUNDEN.get(wurzel);
    const steuerung = liste == null ? void 0 : liste.get(id);
    if (!steuerung) return;
    steuerung.abort();
    liste.delete(id);
    if (liste.size) wurzel.setAttribute("data-neo-behavior", [...liste.keys()].join(" "));
    else wurzel.removeAttribute("data-neo-behavior");
  }
  function finde(bereich, selektor) {
    const treffer = [];
    if (bereich instanceof Element && bereich.matches(selektor)) treffer.push(bereich);
    if ("querySelectorAll" in bereich) treffer.push(...bereich.querySelectorAll(selektor));
    return (
      /** @type {HTMLElement[]} */
      treffer
    );
  }
  function sende(el, name, detail) {
    el.dispatchEvent(new CustomEvent(name, { bubbles: true, detail }));
  }
  function nachbar(liste, aktuell, schritt) {
    const bedienbar = liste.filter((e) => !e.hasAttribute("disabled") && e.getAttribute("aria-disabled") !== "true");
    if (!bedienbar.length) return null;
    const i = bedienbar.indexOf(aktuell);
    return bedienbar[(i + schritt + bedienbar.length) % bedienbar.length];
  }
  function ersterBedienbar(liste, vonHinten = false) {
    const bedienbar = liste.filter((e) => !e.hasAttribute("disabled") && e.getAttribute("aria-disabled") !== "true");
    return vonHinten ? bedienbar.at(-1) : bedienbar[0];
  }
  function zielFuerTaste(key, liste, aktuell, richtung = "beide") {
    const vor = richtung === "horizontal" ? ["ArrowRight"] : richtung === "vertikal" ? ["ArrowDown"] : ["ArrowRight", "ArrowDown"];
    const zurueck = richtung === "horizontal" ? ["ArrowLeft"] : richtung === "vertikal" ? ["ArrowUp"] : ["ArrowLeft", "ArrowUp"];
    if (vor.includes(key)) return nachbar(liste, aktuell, 1);
    if (zurueck.includes(key)) return nachbar(liste, aktuell, -1);
    if (key === "Home") return ersterBedienbar(liste) || null;
    if (key === "End") return ersterBedienbar(liste, true) || null;
    return null;
  }
  var FOKUSSIERBAR = 'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]), summary';
  function fokussierbare(bereich) {
    return (
      /** @type {HTMLElement[]} */
      [...bereich.querySelectorAll(FOKUSSIERBAR)].filter((e) => !e.closest("[hidden], [inert]") && e.getAttribute("aria-hidden") !== "true")
    );
  }
  function fokusFalle(e, bereich) {
    if (e.key !== "Tab") return;
    const liste = fokussierbare(bereich);
    if (!liste.length) {
      e.preventDefault();
      return;
    }
    const erstes = liste[0];
    const letztes = liste.at(-1);
    const aktiv = (
      /** @type {HTMLElement|null} */
      bereich.ownerDocument.activeElement
    );
    const drin = aktiv && bereich.contains(aktiv);
    if (e.shiftKey && (aktiv === erstes || !drin)) {
      e.preventDefault();
      letztes.focus();
    } else if (!e.shiftKey && (aktiv === letztes || !drin)) {
      e.preventDefault();
      erstes.focus();
    }
  }
  function gesperrt(el) {
    return !!el && (el.hasAttribute("disabled") || el.getAttribute("aria-disabled") === "true");
  }

  // packages/neo-behaviors/tabs.js
  var tabs = {
    id: "tabs",
    selektor: ".nc-tabs",
    binde(wurzel, signal) {
      const liste = wurzel.querySelector(".nc-tabs__list");
      if (!liste) return;
      const ausloeser = () => (
        /** @type {HTMLElement[]} */
        [...liste.querySelectorAll(".nc-tabs__trigger")]
      );
      const vertikal = liste.getAttribute("aria-orientation") === "vertical" || wurzel.classList.contains("nc-tabs--vertical");
      const manuell = wurzel.dataset.neoTabs === "manuell";
      const aktiviere = (tab) => {
        if (!tab || tab.hasAttribute("disabled") || tab.getAttribute("aria-disabled") === "true") return;
        const alle = ausloeser();
        const vorher = alle.find((t) => t.getAttribute("aria-selected") === "true");
        if (vorher === tab) return;
        for (const t of alle) {
          const an = t === tab;
          t.classList.toggle("is-active", an);
          t.setAttribute("aria-selected", String(an));
          t.tabIndex = an ? 0 : -1;
          const panel = t.getAttribute("aria-controls") && wurzel.querySelector("#" + CSS.escape(t.getAttribute("aria-controls")));
          if (panel) {
            panel.classList.toggle("is-active", an);
            panel.hidden = !an;
          }
        }
        sende(wurzel, "tab-change", { value: tab.id || tab.textContent.trim(), previousValue: vorher ? vorher.id || vorher.textContent.trim() : null });
      };
      liste.addEventListener("click", (e) => {
        const tab = (
          /** @type {HTMLElement} */
          e.target.closest(".nc-tabs__trigger")
        );
        if (tab && liste.contains(tab)) aktiviere(tab);
      }, { signal });
      liste.addEventListener("keydown", (e) => {
        const tab = (
          /** @type {HTMLElement} */
          e.target.closest(".nc-tabs__trigger")
        );
        if (!tab) return;
        const alle = ausloeser();
        const vor = vertikal ? "ArrowDown" : "ArrowRight";
        const zurueck = vertikal ? "ArrowUp" : "ArrowLeft";
        let ziel = null;
        if (e.key === vor) ziel = nachbar(alle, tab, 1);
        else if (e.key === zurueck) ziel = nachbar(alle, tab, -1);
        else if (e.key === "Home") ziel = ersterBedienbar(alle);
        else if (e.key === "End") ziel = ersterBedienbar(alle, true);
        else if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          aktiviere(tab);
          return;
        }
        if (!ziel) return;
        e.preventDefault();
        ziel.focus();
        if (!manuell) aktiviere(ziel);
      }, { signal });
    }
  };

  // packages/neo-behaviors/accordion.js
  var akkordeon = {
    id: "accordion",
    selektor: ".nc-accordion",
    binde(wurzel, signal) {
      const eintraege = () => (
        /** @type {HTMLDetailsElement[]} */
        [...wurzel.querySelectorAll(":scope > .nc-accordion__item, :scope > * > .nc-accordion__item")]
      );
      const koepfe = () => eintraege().map((e) => (
        /** @type {HTMLElement} */
        e.querySelector(".nc-accordion__trigger")
      )).filter(Boolean);
      const einzeln = wurzel.dataset.neoAccordion === "einzeln";
      wurzel.addEventListener("toggle", (e) => {
        var _a;
        const item = (
          /** @type {HTMLDetailsElement} */
          e.target
        );
        if (!((_a = item.classList) == null ? void 0 : _a.contains("nc-accordion__item"))) return;
        if (einzeln && item.open) {
          for (const andere of eintraege()) if (andere !== item && andere.open) andere.open = false;
        }
        sende(wurzel, "accordion-toggle", { itemId: item.id || null, open: item.open });
      }, { signal, capture: true });
      wurzel.addEventListener("click", (e) => {
        var _a, _b;
        const kopf = (
          /** @type {HTMLElement} */
          (_b = (_a = e.target).closest) == null ? void 0 : _b.call(_a, ".nc-accordion__trigger")
        );
        if ((kopf == null ? void 0 : kopf.getAttribute("aria-disabled")) === "true" && wurzel.contains(kopf)) e.preventDefault();
      }, { signal });
      wurzel.addEventListener("keydown", (e) => {
        const kopf = (
          /** @type {HTMLElement} */
          e.target.closest(".nc-accordion__trigger")
        );
        if (!kopf) return;
        const alle = koepfe();
        let ziel = null;
        if (e.key === "ArrowDown") ziel = nachbar(alle, kopf, 1);
        else if (e.key === "ArrowUp") ziel = nachbar(alle, kopf, -1);
        else if (e.key === "Home") ziel = ersterBedienbar(alle);
        else if (e.key === "End") ziel = ersterBedienbar(alle, true);
        if (!ziel) return;
        e.preventDefault();
        ziel.focus();
      }, { signal });
    }
  };

  // packages/neo-behaviors/select.js
  var select = {
    id: "select",
    selektor: ".nc-select-wrapper",
    binde(wurzel, signal) {
      const feld = (
        /** @type {HTMLSelectElement|null} */
        wurzel.querySelector("select.nc-select")
      );
      if (!feld || feld.multiple) return;
      const setze = (offen) => wurzel.classList.toggle("is-open", offen);
      feld.addEventListener("mousedown", () => {
        if (!feld.disabled) setze(!wurzel.classList.contains("is-open"));
      }, { signal });
      feld.addEventListener("keydown", (e) => {
        if (e.key === "Escape" || e.key === "Tab") setze(false);
        else if (e.key === "ArrowDown" && e.altKey || e.key === "F4" || (e.key === " " || e.key === "Enter") && !wurzel.classList.contains("is-open")) setze(true);
      }, { signal });
      feld.addEventListener("change", () => setze(false), { signal });
      feld.addEventListener("blur", () => setze(false), { signal });
    }
  };

  // packages/neo-behaviors/suche.js
  var escHtml = (s) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  var suche = {
    id: "search",
    selektor: ".nc-search",
    binde(wurzel, signal) {
      const feld = (
        /** @type {HTMLInputElement|null} */
        wurzel.querySelector(".nc-search__input")
      );
      const liste = (
        /** @type {HTMLElement|null} */
        wurzel.querySelector(".nc-search__results")
      );
      if (!feld || !liste) return;
      const eintraege = () => (
        /** @type {HTMLElement[]} */
        [...liste.querySelectorAll(".nc-search__item")]
      );
      for (const e of eintraege()) {
        const label = (
          /** @type {HTMLElement} */
          e.querySelector(".nc-search__item-label") || e
        );
        if (!label.dataset.neoText) label.dataset.neoText = label.textContent;
      }
      let leer = (
        /** @type {HTMLElement|null} */
        liste.querySelector(".nc-search__empty")
      );
      if (document.activeElement !== feld) {
        liste.hidden = true;
        feld.setAttribute("aria-expanded", "false");
      }
      const offen = () => !liste.hidden;
      const setze = (an) => {
        if (offen() === an) return;
        liste.hidden = !an;
        feld.setAttribute("aria-expanded", String(an));
        if (!an) markiere(null);
        sende(wurzel, "search-open", { open: an });
      };
      const markiere = (eintrag) => {
        var _a;
        for (const e of eintraege()) e.setAttribute("aria-selected", String(e === eintrag));
        if (eintrag == null ? void 0 : eintrag.id) feld.setAttribute("aria-activedescendant", eintrag.id);
        else feld.removeAttribute("aria-activedescendant");
        (_a = eintrag == null ? void 0 : eintrag.scrollIntoView) == null ? void 0 : _a.call(eintrag, { block: "nearest" });
      };
      const filtere = () => {
        const q = feld.value.trim().toLowerCase();
        let sichtbar = 0;
        for (const e of eintraege()) {
          const label = (
            /** @type {HTMLElement} */
            e.querySelector(".nc-search__item-label") || e
          );
          const text = label.dataset.neoText || "";
          const pos = q ? text.toLowerCase().indexOf(q) : -1;
          const zeigen = !q || pos >= 0;
          e.hidden = !zeigen;
          if (zeigen) sichtbar++;
          if (q && pos >= 0) label.innerHTML = escHtml(text.slice(0, pos)) + '<span class="nc-search__highlight">' + escHtml(text.slice(pos, pos + q.length)) + "</span>" + escHtml(text.slice(pos + q.length));
          else label.textContent = text;
        }
        for (const g2 of liste.querySelectorAll(".nc-search__group")) {
          g2.hidden = ![...g2.querySelectorAll(".nc-search__item")].some((e) => !/** @type {HTMLElement} */
          e.hidden);
        }
        if (!sichtbar && eintraege().length) {
          if (!leer) {
            leer = document.createElement("div");
            leer.className = "nc-search__empty";
            liste.append(leer);
          }
          leer.textContent = `Keine Treffer für „${feld.value.trim()}“`;
          leer.hidden = false;
        } else if (leer && eintraege().length) leer.hidden = true;
        markiere(null);
      };
      feld.addEventListener("focus", () => setze(true), { signal });
      feld.addEventListener("input", () => {
        setze(true);
        filtere();
      }, { signal });
      feld.addEventListener("keydown", (e) => {
        const sichtbare = eintraege().filter((x) => !x.hidden);
        const aktuell = sichtbare.find((x) => x.getAttribute("aria-selected") === "true");
        if (e.key === "Escape") {
          setze(false);
          return;
        }
        if (e.key === "ArrowDown" || e.key === "ArrowUp") {
          e.preventDefault();
          setze(true);
          if (!sichtbare.length) return;
          const i = aktuell ? sichtbare.indexOf(aktuell) : -1;
          const n = e.key === "ArrowDown" ? (i + 1) % sichtbare.length : i < 0 ? sichtbare.length - 1 : (i - 1 + sichtbare.length) % sichtbare.length;
          markiere(sichtbare[n]);
        } else if (e.key === "Enter" && aktuell) {
          e.preventDefault();
          feld.value = /** @type {HTMLElement} */
          (aktuell.querySelector(".nc-search__item-label") || aktuell).dataset.neoText || aktuell.textContent.trim();
          sende(wurzel, "search-select", { value: feld.value });
          setze(false);
        }
      }, { signal });
      liste.addEventListener("mousedown", (e) => e.preventDefault(), { signal });
      liste.addEventListener("click", (e) => {
        const eintrag = (
          /** @type {HTMLElement} */
          e.target.closest(".nc-search__item")
        );
        if (!eintrag) return;
        e.preventDefault();
        feld.value = /** @type {HTMLElement} */
        (eintrag.querySelector(".nc-search__item-label") || eintrag).dataset.neoText || eintrag.textContent.trim();
        sende(wurzel, "search-select", { value: feld.value });
        setze(false);
      }, { signal });
      wurzel.addEventListener("focusout", (e) => {
        if (!wurzel.contains(
          /** @type {Node} */
          e.relatedTarget
        )) setze(false);
      }, { signal });
      const bereich = wurzel.querySelector(".nc-search__scope-trigger");
      const menue = (
        /** @type {HTMLElement|null} */
        wurzel.querySelector(".nc-search__scope-menu")
      );
      if (bereich && menue) {
        bereich.addEventListener("click", () => {
          const an = menue.hidden;
          menue.hidden = !an;
          bereich.setAttribute("aria-expanded", String(an));
        }, { signal });
      }
    }
  };

  // packages/neo-behaviors/segmented-control.js
  var SEGMENT = ".nc-segmented-control__item";
  function setzeIndikator(leiste) {
    const gewaehlt = (
      /** @type {HTMLElement|null} */
      leiste.querySelector(`${SEGMENT}[aria-checked="true"], ${SEGMENT}[aria-pressed="true"]`)
    );
    if (!gewaehlt || !leiste.querySelector(".nc-segmented-control__indicator")) return;
    leiste.style.setProperty("--_indicator-left", `${gewaehlt.offsetLeft}px`);
    leiste.style.setProperty("--_indicator-width", `${gewaehlt.offsetWidth}px`);
  }
  function wertVon(el) {
    return el.dataset.value || el.getAttribute("aria-label") || el.textContent.trim();
  }
  var segmentedControl = {
    id: "segmented-control",
    selektor: ".nc-segmented-control",
    binde(wurzel, signal) {
      const segmente = () => (
        /** @type {HTMLElement[]} */
        [...wurzel.querySelectorAll(SEGMENT)]
      );
      if (!segmente().length) return;
      const attr = (el) => el.getAttribute("role") === "radio" ? "aria-checked" : "aria-pressed";
      const istGewaehlt = (el) => el.getAttribute(attr(el)) === "true";
      const waehle2 = (segment) => {
        var _a;
        if (!segment || gesperrt(segment)) return;
        const alle = segmente();
        const vorher = alle.find(istGewaehlt) || null;
        for (const s of alle) {
          s.setAttribute(attr(s), String(s === segment));
          s.tabIndex = s === segment ? 0 : -1;
        }
        setzeIndikator(wurzel);
        (_a = segment.scrollIntoView) == null ? void 0 : _a.call(segment, { block: "nearest", inline: "nearest" });
        if (vorher !== segment) sende(wurzel, "segment-change", { value: wertVon(segment), previousValue: vorher ? wertVon(vorher) : null });
      };
      const start = segmente().find(istGewaehlt) || segmente().find((s) => !gesperrt(s));
      for (const s of segmente()) s.tabIndex = s === start ? 0 : -1;
      setzeIndikator(wurzel);
      wurzel.addEventListener("click", (e) => {
        const segment = (
          /** @type {HTMLElement} */
          e.target.closest(SEGMENT)
        );
        if (segment && wurzel.contains(segment)) waehle2(segment);
      }, { signal });
      wurzel.addEventListener("keydown", (e) => {
        const segment = (
          /** @type {HTMLElement} */
          e.target.closest(SEGMENT)
        );
        if (!segment) return;
        const ziel = zielFuerTaste(e.key, segmente(), segment);
        if (!ziel) return;
        e.preventDefault();
        ziel.focus();
        waehle2(ziel);
      }, { signal });
      if (typeof ResizeObserver === "function" && wurzel.querySelector(".nc-segmented-control__indicator")) {
        const beobachter = new ResizeObserver(() => setzeIndikator(wurzel));
        beobachter.observe(wurzel);
        signal.addEventListener("abort", () => beobachter.disconnect());
      }
    }
  };

  // packages/neo-behaviors/toggle-group.js
  var KNOPF = ".nc-toggle-group__item";
  var toggleGroup = {
    id: "toggle-group",
    selektor: ".nc-toggle-group",
    binde(wurzel, signal) {
      const knoepfe = () => (
        /** @type {HTMLElement[]} */
        [...wurzel.querySelectorAll(KNOPF)]
      );
      if (!knoepfe().length) return;
      const einzeln = wurzel.getAttribute("role") === "radiogroup" || knoepfe().some((k) => k.getAttribute("role") === "radio");
      const attr = einzeln ? "aria-checked" : "aria-pressed";
      const an = (k) => k.getAttribute(attr) === "true";
      const melde = (knopf) => sende(wurzel, "toggle-change", { value: wertVon(knopf), selected: an(knopf), values: knoepfe().filter(an).map(wertVon) });
      const waehle2 = (knopf) => {
        if (!knopf || gesperrt(knopf)) return;
        if (!einzeln) {
          knopf.setAttribute(attr, String(!an(knopf)));
          melde(knopf);
          return;
        }
        if (an(knopf)) return;
        for (const k of knoepfe()) {
          k.setAttribute(attr, String(k === knopf));
          k.tabIndex = k === knopf ? 0 : -1;
        }
        melde(knopf);
      };
      if (einzeln) {
        const start = knoepfe().find(an) || knoepfe().find((k) => !gesperrt(k));
        for (const k of knoepfe()) k.tabIndex = k === start ? 0 : -1;
      }
      wurzel.addEventListener("click", (e) => {
        const knopf = (
          /** @type {HTMLElement} */
          e.target.closest(KNOPF)
        );
        if (knopf && wurzel.contains(knopf)) waehle2(knopf);
      }, { signal });
      wurzel.addEventListener("keydown", (e) => {
        const knopf = (
          /** @type {HTMLElement} */
          e.target.closest(KNOPF)
        );
        if (!knopf) return;
        const ziel = zielFuerTaste(e.key, knoepfe(), knopf);
        if (!ziel) return;
        e.preventDefault();
        ziel.focus();
        if (einzeln) waehle2(ziel);
      }, { signal });
    }
  };

  // packages/neo-behaviors/switch.js
  var KNOPF2 = 'button[role="switch"]';
  var schalter = {
    id: "switch",
    selektor: ".nc-switch",
    binde(wurzel, signal) {
      if (!wurzel.querySelector(KNOPF2)) return;
      wurzel.addEventListener("click", (e) => {
        const knopf = (
          /** @type {HTMLElement} */
          e.target.closest(KNOPF2)
        );
        if (!knopf || !wurzel.contains(knopf) || gesperrt(knopf)) return;
        const an = knopf.getAttribute("aria-checked") !== "true";
        knopf.setAttribute("aria-checked", String(an));
        sende(wurzel, "switch-change", { checked: an });
      }, { signal });
    }
  };

  // packages/neo-behaviors/rating.js
  var STUFE = ["nc-rating--sentiment-low", "nc-rating--sentiment-mid", "nc-rating--sentiment-high"];
  function stufe(wert) {
    if (wert <= 2) return STUFE[0];
    if (wert < 4) return STUFE[1];
    return STUFE[2];
  }
  var rating = {
    id: "rating",
    selektor: ".nc-rating",
    binde(wurzel, signal) {
      const radios = () => (
        /** @type {HTMLInputElement[]} */
        [...wurzel.querySelectorAll('input.nc-rating__input[type="radio"]')]
      );
      if (!radios().length) return;
      const sterne = () => radios().filter((r) => !r.classList.contains("nc-rating__input--clear")).sort((a, b) => Number(a.value) - Number(b.value));
      const nullRadio = () => radios().find((r) => r.classList.contains("nc-rating__input--clear") || r.value === "0") || null;
      const labelVon = (r) => {
        var _a;
        return (
          /** @type {HTMLElement|null} */
          (r.id ? wurzel.querySelector(`label[for="${CSS.escape(r.id)}"]`) : null) || (((_a = r.nextElementSibling) == null ? void 0 : _a.classList.contains("nc-rating__item")) ? (
            /** @type {HTMLElement} */
            r.nextElementSibling
          ) : null)
        );
      };
      const aktuellerWert = () => {
        var _a;
        return Number(((_a = radios().find((r) => r.checked)) == null ? void 0 : _a.value) || 0);
      };
      let wert = aktuellerWert();
      const zeige = () => {
        var _a;
        const neu = aktuellerWert();
        for (const r of sterne()) (_a = labelVon(r)) == null ? void 0 : _a.classList.toggle("nc-rating__item--active", Number(r.value) <= neu);
        if (wurzel.classList.contains("nc-rating--sentiment")) {
          wurzel.classList.remove(...STUFE);
          if (neu > 0) wurzel.classList.add(stufe(neu));
        }
        const zahl = wurzel.querySelector(".nc-rating__value");
        if (zahl) zahl.textContent = neu.toFixed(1).replace(".", ",");
        if (neu !== wert) {
          const vorher = wert;
          wert = neu;
          sende(wurzel, "rating-change", { value: neu, previousValue: vorher });
        }
      };
      const setze = (ziel) => {
        if (!ziel || ziel.disabled) return;
        ziel.checked = true;
        ziel.focus();
        zeige();
      };
      wurzel.addEventListener("change", zeige, { signal });
      wurzel.addEventListener("keydown", (e) => {
        const feld = (
          /** @type {HTMLElement} */
          e.target
        );
        if (!(feld instanceof HTMLInputElement) || !feld.classList.contains("nc-rating__input") || gesperrt(feld)) return;
        const liste = sterne();
        const jetzt = aktuellerWert();
        const index = liste.findIndex((r) => Number(r.value) === jetzt);
        let ziel = (
          /** @type {HTMLInputElement|null|undefined} */
          void 0
        );
        if (e.key === "ArrowRight" || e.key === "ArrowUp") ziel = liste[Math.min(index + 1, liste.length - 1)];
        else if (e.key === "ArrowLeft" || e.key === "ArrowDown") ziel = index <= 0 ? nullRadio() : liste[index - 1];
        else if (e.key === "Home") ziel = liste[0];
        else if (e.key === "End") ziel = liste.at(-1);
        if (ziel === void 0) return;
        e.preventDefault();
        setze(ziel);
      }, { signal });
      wurzel.addEventListener("click", (e) => {
        const knopf = (
          /** @type {HTMLElement} */
          e.target.closest(".nc-rating__clear")
        );
        if (!knopf || gesperrt(knopf)) return;
        e.preventDefault();
        setze(nullRadio());
      }, { signal });
      zeige();
    }
  };

  // packages/neo-behaviors/input.js
  var eingabe = {
    id: "input",
    selektor: ".nc-input-wrapper",
    binde(wurzel, signal) {
      const feld = (
        /** @type {HTMLInputElement|null} */
        wurzel.querySelector("input.nc-input")
      );
      if (!feld) return;
      const knopf = wurzel.querySelector(".nc-input__clear");
      const rueckfall = !feld.hasAttribute("placeholder");
      const leer = () => {
        if (rueckfall) feld.dataset.empty = String(feld.value === "");
      };
      if (rueckfall) {
        leer();
        feld.addEventListener("input", leer, { signal });
        feld.addEventListener("change", leer, { signal });
      }
      if (knopf) {
        knopf.addEventListener("click", (e) => {
          if (feld.disabled || feld.readOnly) return;
          e.preventDefault();
          const vorher = feld.value;
          feld.value = "";
          feld.dispatchEvent(new Event("input", { bubbles: true }));
          leer();
          feld.focus();
          if (vorher !== "") sende(wurzel, "input-clear", { previousValue: vorher });
        }, { signal });
      }
      signal.addEventListener("abort", () => {
        if (rueckfall) delete feld.dataset.empty;
      });
    }
  };

  // packages/neo-behaviors/dropdown-menu.js
  var EINTRAG = ".nc-dropdown__item";
  var VERWEILEN = 300;
  var dropdownMenu = {
    id: "dropdown-menu",
    selektor: ".nc-dropdown",
    binde(wurzel, signal) {
      const ausloeser = (
        /** @type {HTMLElement|null} */
        wurzel.querySelector(":scope > .nc-dropdown__trigger")
      );
      const menue = (
        /** @type {HTMLElement|null} */
        wurzel.querySelector(":scope > .nc-dropdown__menu")
      );
      if (!ausloeser || !menue) return;
      const dok = wurzel.ownerDocument;
      const eintraege = (m) => (
        /** @type {HTMLElement[]} */
        [...m.querySelectorAll(EINTRAG)].filter((e) => e.closest(".nc-dropdown__menu") === m)
      );
      const untermenue = (eintrag) => (
        /** @type {HTMLElement|null} */
        eintrag.querySelector(":scope > .nc-dropdown__menu")
      );
      const offen = () => !menue.hidden;
      for (const e of wurzel.querySelectorAll(EINTRAG)) e.tabIndex = -1;
      if (!ausloeser.hasAttribute("aria-haspopup")) ausloeser.setAttribute("aria-haspopup", "true");
      ausloeser.setAttribute("aria-expanded", String(offen()));
      const unterZu = (eintrag) => {
        const u = untermenue(eintrag);
        if (!u || u.hidden) return;
        for (const e of eintraege(u)) if (untermenue(e)) unterZu(e);
        u.hidden = true;
        eintrag.setAttribute("aria-expanded", "false");
      };
      const unterAuf = (eintrag, fokus) => {
        var _a;
        const u = untermenue(eintrag);
        if (!u || gesperrt(eintrag)) return;
        const eltern = (
          /** @type {HTMLElement} */
          eintrag.closest(".nc-dropdown__menu")
        );
        for (const e of eintraege(eltern)) if (e !== eintrag) unterZu(e);
        u.hidden = false;
        eintrag.setAttribute("aria-expanded", "true");
        if (fokus) (_a = ersterBedienbar(eintraege(u))) == null ? void 0 : _a.focus();
      };
      const setze = (an, fokus = null) => {
        var _a;
        if (offen() !== an) {
          menue.hidden = !an;
          ausloeser.setAttribute("aria-expanded", String(an));
          if (!an) for (const e of eintraege(menue)) unterZu(e);
          sende(wurzel, "dropdown-toggle", { open: an });
        }
        if (an && fokus) (_a = ersterBedienbar(eintraege(menue), fokus === "letzter")) == null ? void 0 : _a.focus();
      };
      const schliesse = (fokusZurueck) => {
        if (!offen()) return;
        setze(false);
        if (fokusZurueck) ausloeser.focus();
      };
      const loese2 = (eintrag) => {
        if (gesperrt(eintrag)) return;
        if (untermenue(eintrag)) {
          unterAuf(eintrag, true);
          return;
        }
        const rolle = eintrag.getAttribute("role");
        let checked = null;
        if (rolle === "menuitemradio") {
          const gruppe = eintrag.closest('.nc-dropdown__group, [role="group"]') || eintrag.closest(".nc-dropdown__menu");
          for (const e of eintraege(
            /** @type {HTMLElement} */
            eintrag.closest(".nc-dropdown__menu")
          )) {
            if (e.getAttribute("role") !== "menuitemradio" || !gruppe.contains(e)) continue;
            e.setAttribute("aria-checked", String(e === eintrag));
            e.classList.toggle("nc-dropdown__item--checked", e === eintrag);
          }
          checked = true;
        } else if (rolle === "menuitemcheckbox") {
          checked = eintrag.getAttribute("aria-checked") !== "true";
          eintrag.setAttribute("aria-checked", String(checked));
          eintrag.classList.toggle("nc-dropdown__item--checked", checked);
        }
        const label = eintrag.querySelector(".nc-dropdown__item-label") || eintrag;
        sende(wurzel, "dropdown-select", { value: eintrag.dataset.value || label.textContent.trim(), checked });
        if (rolle !== "menuitemcheckbox") schliesse(true);
      };
      ausloeser.addEventListener("click", () => {
        if (gesperrt(ausloeser)) return;
        if (offen()) schliesse(false);
        else setze(true, "erster");
      }, { signal });
      ausloeser.addEventListener("keydown", (e) => {
        if (gesperrt(ausloeser)) return;
        if (e.key === "ArrowDown") {
          e.preventDefault();
          setze(true, "erster");
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          setze(true, "letzter");
        } else if (e.key === "Escape") schliesse(true);
      }, { signal });
      menue.addEventListener("click", (e) => {
        const eintrag = (
          /** @type {HTMLElement} */
          e.target.closest(EINTRAG)
        );
        if (eintrag && menue.contains(eintrag)) loese2(eintrag);
      }, { signal });
      menue.addEventListener("keydown", (e) => {
        const eintrag = (
          /** @type {HTMLElement} */
          e.target.closest(EINTRAG)
        );
        if (!eintrag) return;
        const eigenesMenue = (
          /** @type {HTMLElement} */
          eintrag.closest(".nc-dropdown__menu")
        );
        const elternEintrag = eigenesMenue === menue ? null : (
          /** @type {HTMLElement|null} */
          eigenesMenue.closest(EINTRAG)
        );
        if (e.key === "Escape" || e.key === "ArrowLeft" && elternEintrag) {
          e.preventDefault();
          if (elternEintrag) {
            unterZu(elternEintrag);
            elternEintrag.focus();
          } else schliesse(true);
          return;
        }
        if (e.key === "ArrowRight" && untermenue(eintrag)) {
          e.preventDefault();
          unterAuf(eintrag, true);
          return;
        }
        if (e.key === "Tab") {
          schliesse(false);
          return;
        }
        const ziel = zielFuerTaste(e.key, eintraege(eigenesMenue), eintrag, "vertikal");
        if (!ziel) return;
        e.preventDefault();
        ziel.focus();
      }, { signal });
      let uhr = 0;
      menue.addEventListener("mouseover", (e) => {
        const eintrag = (
          /** @type {HTMLElement} */
          e.target.closest(EINTRAG)
        );
        if (!eintrag) return;
        clearTimeout(uhr);
        uhr = window.setTimeout(() => {
          const eltern = (
            /** @type {HTMLElement} */
            eintrag.closest(".nc-dropdown__menu")
          );
          for (const x of eintraege(eltern)) if (x !== eintrag) unterZu(x);
          if (untermenue(eintrag)) unterAuf(eintrag, false);
        }, VERWEILEN);
      }, { signal });
      signal.addEventListener("abort", () => clearTimeout(uhr));
      dok.addEventListener("click", (e) => {
        if (offen() && !wurzel.contains(
          /** @type {Node} */
          e.target
        )) schliesse(false);
      }, { signal, capture: true });
      wurzel.addEventListener("focusout", (e) => {
        const nach = (
          /** @type {Node|null} */
          e.relatedTarget
        );
        if (nach && !wurzel.contains(nach)) schliesse(false);
      }, { signal });
    }
  };

  // packages/neo-behaviors/popover.js
  var OEFFNEN_NACH = 300;
  var SCHLIESSEN_NACH = 200;
  var popover = {
    id: "popover",
    selektor: ".nc-popover",
    binde(wurzel, signal) {
      const ausloeser = (
        /** @type {HTMLElement|null} */
        wurzel.querySelector(":scope > .nc-popover__trigger")
      );
      const panel = (
        /** @type {HTMLElement|null} */
        wurzel.querySelector(":scope > .nc-popover__panel")
      );
      if (!ausloeser || !panel) return;
      const dok = wurzel.ownerDocument;
      const hover = wurzel.classList.contains("nc-popover--hover-trigger");
      if (hover && !panel.hidden && !wurzel.contains(dok.activeElement)) panel.hidden = true;
      const lichtAus = () => wurzel.dataset.lightDismiss !== "false" && !panel.querySelector("form, input, select, textarea");
      const offen = () => !panel.hidden;
      if (!ausloeser.hasAttribute("aria-haspopup")) ausloeser.setAttribute("aria-haspopup", "dialog");
      ausloeser.setAttribute("aria-expanded", String(offen()));
      wurzel.classList.toggle("is-open", offen());
      const setze = (an, grund) => {
        if (offen() === an) return;
        panel.hidden = !an;
        wurzel.classList.toggle("is-open", an);
        ausloeser.setAttribute("aria-expanded", String(an));
        sende(wurzel, "popover-toggle", { open: an, reason: grund });
        if (an && !hover) {
          const feld = panel.querySelector("input:not([disabled]), select:not([disabled]), textarea:not([disabled])");
          const ziel = (
            /** @type {HTMLElement|null} */
            feld || fokussierbare(panel)[0] || null
          );
          if (ziel) ziel.focus();
          else {
            panel.tabIndex = -1;
            panel.focus();
          }
        }
      };
      const schliesse = (grund, fokusZurueck) => {
        if (!offen()) return;
        const warDrin = panel.contains(dok.activeElement);
        setze(false, grund);
        if (fokusZurueck || warDrin) ausloeser.focus();
      };
      ausloeser.addEventListener("click", () => {
        if (gesperrt(ausloeser)) return;
        if (offen()) schliesse("trigger", false);
        else setze(true, "trigger");
      }, { signal });
      wurzel.addEventListener("keydown", (e) => {
        if (!offen()) return;
        if (e.key === "Escape") {
          e.preventDefault();
          schliesse("escape", true);
          return;
        }
        if (!hover && e.key === "Tab" && panel.contains(
          /** @type {Node} */
          e.target
        )) fokusFalle(e, panel);
      }, { signal });
      panel.addEventListener("click", (e) => {
        if (
          /** @type {HTMLElement} */
          e.target.closest(".nc-popover__close")
        ) schliesse("close-button", true);
      }, { signal });
      dok.addEventListener("click", (e) => {
        if (offen() && lichtAus() && !wurzel.contains(
          /** @type {Node} */
          e.target
        )) schliesse("outside", false);
      }, { signal, capture: true });
      if (hover) {
        let uhr = 0;
        const spaeter = (fn, ms) => {
          clearTimeout(uhr);
          uhr = window.setTimeout(fn, ms);
        };
        wurzel.addEventListener("mouseenter", () => spaeter(() => setze(true, "hover"), OEFFNEN_NACH), { signal });
        wurzel.addEventListener("mouseleave", () => spaeter(() => {
          if (!wurzel.contains(dok.activeElement)) setze(false, "hover");
        }, SCHLIESSEN_NACH), { signal });
        ausloeser.addEventListener("focus", () => {
          clearTimeout(uhr);
          setze(true, "focus");
        }, { signal });
        wurzel.addEventListener("focusout", (e) => {
          const nach = (
            /** @type {Node|null} */
            e.relatedTarget
          );
          if (!nach || !wurzel.contains(nach)) setze(false, "focus");
        }, { signal });
        signal.addEventListener("abort", () => clearTimeout(uhr));
      }
    }
  };

  // packages/neo-behaviors/tooltip.js
  var laufendeNummer = 0;
  var tooltip = {
    id: "tooltip",
    selektor: ".nc-tooltip",
    binde(wurzel, signal) {
      const inhalt = (
        /** @type {HTMLElement|null} */
        wurzel.querySelector(":scope > .nc-tooltip__content")
      );
      if (!inhalt) return;
      const dok = wurzel.ownerDocument;
      const ausloeser = (
        /** @type {HTMLElement|null} */
        [...wurzel.children].find((k) => k !== inhalt) || null
      );
      if (!inhalt.id) inhalt.id = `neo-tooltip-${++laufendeNummer}`;
      if (!inhalt.getAttribute("role")) inhalt.setAttribute("role", "tooltip");
      if (ausloeser) {
        const ids = (ausloeser.getAttribute("aria-describedby") || "").split(/\s+/).filter(Boolean);
        if (!ids.includes(inhalt.id)) ausloeser.setAttribute("aria-describedby", [...ids, inhalt.id].join(" "));
      }
      let maus = false;
      const fokus = () => wurzel.contains(dok.activeElement);
      const freigeben = () => {
        if (!maus && !fokus()) inhalt.hidden = false;
      };
      wurzel.addEventListener("mouseenter", () => {
        maus = true;
      }, { signal });
      wurzel.addEventListener("mouseleave", () => {
        maus = false;
        freigeben();
      }, { signal });
      wurzel.addEventListener("focusout", (e) => {
        const nach = (
          /** @type {Node|null} */
          e.relatedTarget
        );
        if (!nach || !wurzel.contains(nach)) {
          if (!maus) inhalt.hidden = false;
        }
      }, { signal });
      dok.addEventListener("keydown", (e) => {
        if (e.key !== "Escape" || inhalt.hidden || !(maus || fokus())) return;
        inhalt.hidden = true;
        sende(wurzel, "tooltip-dismiss", { reason: "escape" });
      }, { signal });
      signal.addEventListener("abort", () => {
        inhalt.hidden = false;
      });
    }
  };

  // packages/neo-behaviors/_dialog.js
  function dialogBehavior(art) {
    return {
      id: art.id,
      selektor: art.selektor,
      /** @param {HTMLElement} wurzel @param {AbortSignal} signal */
      binde(wurzel, signal) {
        var _a;
        const dialog = (
          /** @type {HTMLDialogElement} */
          wurzel
        );
        if (typeof dialog.showModal !== "function") return;
        const dok = dialog.ownerDocument;
        let zurueck = (
          /** @type {HTMLElement|null} */
          null
        );
        let grund = (
          /** @type {string|null} */
          null
        );
        const oeffne = (ausloeser) => {
          var _a2;
          if (dialog.open) return;
          zurueck = ausloeser;
          dialog.showModal();
          const eigen = (_a2 = art.fokusZiel) == null ? void 0 : _a2.call(art, dialog);
          if (eigen) eigen.focus();
          else {
            const ziel = (
              /** @type {HTMLElement|null} */
              dialog.querySelector("[autofocus]") || fokussierbare(dialog)[0]
            );
            if (ziel && !dialog.contains(dok.activeElement)) ziel.focus();
          }
          sende(dialog, `${art.praefix}-open`, {});
        };
        const schliesse = (warum) => {
          if (!dialog.open) return;
          grund = warum;
          dialog.close();
        };
        dok.addEventListener("click", (e) => {
          var _a2, _b;
          const knopf = (
            /** @type {HTMLElement} */
            (_b = (_a2 = e.target).closest) == null ? void 0 : _b.call(_a2, "[aria-controls]")
          );
          if (!knopf || !dialog.id || knopf.getAttribute("aria-controls") !== dialog.id || dialog.contains(knopf)) return;
          if (knopf.hasAttribute("disabled") || knopf.getAttribute("aria-disabled") === "true") return;
          e.preventDefault();
          oeffne(
            /** @type {HTMLElement} */
            knopf
          );
        }, { signal });
        dialog.addEventListener("keydown", (e) => {
          if (e.key === "Escape") {
            e.preventDefault();
            schliesse("escape");
          } else fokusFalle(e, dialog);
        }, { signal });
        dialog.addEventListener("cancel", (e) => {
          e.preventDefault();
          schliesse("escape");
        }, { signal });
        dialog.addEventListener("click", (e) => {
          const ziel = (
            /** @type {HTMLElement} */
            e.target
          );
          if (ziel === dialog) {
            const r = dialog.getBoundingClientRect();
            const draussen = e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
            if (draussen && art.hintergrundSchliesst(dialog)) schliesse("overlay-click");
            return;
          }
          const warum = art.aktion ? art.aktion(ziel, dialog) : ziel.closest(`${art.schliessen}, [data-action="close"], [data-action="cancel"]`) ? "close-button" : null;
          if (warum) schliesse(warum);
        }, { signal });
        dialog.addEventListener("close", () => {
          const reason = grund || "programmatic";
          sende(dialog, `${art.praefix}-close`, art.schliessDetail ? art.schliessDetail(reason) : { reason });
          grund = null;
          if (zurueck && zurueck.isConnected) zurueck.focus();
          zurueck = null;
        }, { signal });
        (_a = art.scroll) == null ? void 0 : _a.call(art, dialog, signal);
      }
    };
  }

  // packages/neo-behaviors/modal.js
  var modal = dialogBehavior({
    id: "modal",
    selektor: "dialog.nc-modal",
    praefix: "modal",
    schliessen: ".nc-modal__close",
    hintergrundSchliesst: (d) => d.dataset.backdropClose === "true",
    scroll(dialog, signal) {
      const body = dialog.querySelector(".nc-modal__body");
      if (!body || !dialog.classList.contains("nc-modal--scrollable")) return;
      const pruefe = () => {
        dialog.classList.toggle("is-scrolled-top", body.scrollTop > 0);
        dialog.classList.toggle("is-scrolled-bottom", body.scrollTop + body.clientHeight < body.scrollHeight - 1);
      };
      body.addEventListener("scroll", pruefe, { signal, passive: true });
      dialog.addEventListener("modal-open", pruefe, { signal });
    }
  });

  // packages/neo-behaviors/drawer.js
  var drawer = dialogBehavior({
    id: "drawer",
    selektor: "dialog.nc-drawer",
    praefix: "drawer",
    schliessen: ".nc-drawer__close",
    hintergrundSchliesst: () => true,
    scroll(dialog, signal) {
      const inhalt = dialog.querySelector(".nc-drawer__content");
      if (!inhalt) return;
      inhalt.addEventListener("scroll", () => dialog.classList.toggle("is-scrolled", inhalt.scrollTop > 0), { signal, passive: true });
    }
  });

  // packages/neo-behaviors/alert-dialog.js
  var OHNE_KNOPF = ["escape", "programmatic"];
  var alertDialog = dialogBehavior({
    id: "alert-dialog",
    selektor: "dialog.nc-alert-dialog",
    praefix: "alert-dialog",
    schliessen: "[data-action]",
    hintergrundSchliesst: () => false,
    schliessDetail: (reason) => ({ reason, action: OHNE_KNOPF.includes(reason) ? null : reason, open: false }),
    fokusZiel: (dialog) => {
      const bedienbar = fokussierbare(dialog).filter((e) => !gesperrt(e));
      const markiert = bedienbar.find((e) => e.hasAttribute("autofocus"));
      if (markiert) return markiert;
      const abbrechen = (
        /** @type {HTMLElement|null} */
        dialog.querySelector('[data-action="cancel"]')
      );
      return abbrechen && !gesperrt(abbrechen) ? abbrechen : bedienbar[0] || fokussierbare(dialog)[0] || null;
    },
    aktion: (ziel, dialog) => {
      const knopf = (
        /** @type {HTMLElement|null} */
        ziel.closest("[data-action]")
      );
      if (!knopf || !dialog.contains(knopf) || gesperrt(knopf)) return null;
      const wert = knopf.getAttribute("data-action") || null;
      if (wert === "confirm" && dialog.getAttribute("data-close") === "manuell") {
        sende(dialog, "alert-dialog-close", { reason: "confirm", action: "confirm", open: true });
        return null;
      }
      return wert;
    }
  });

  // packages/neo-behaviors/breadcrumb.js
  var EINTRAG2 = ".nc-breadcrumb__dropdown-item";
  var breadcrumb = {
    id: "breadcrumb",
    selektor: ".nc-breadcrumb",
    binde(wurzel, signal) {
      const knopf = (
        /** @type {HTMLElement|null} */
        wurzel.querySelector(".nc-breadcrumb__ellipsis")
      );
      const menue = (
        /** @type {HTMLElement|null} */
        wurzel.querySelector(".nc-breadcrumb__dropdown")
      );
      if (!knopf || !menue) return;
      const dok = wurzel.ownerDocument;
      const huelle = (
        /** @type {HTMLElement} */
        knopf.closest(".nc-breadcrumb__ellipsis-wrap") || knopf.parentElement || wurzel
      );
      const eintraege = () => (
        /** @type {HTMLElement[]} */
        [...menue.querySelectorAll(EINTRAG2)]
      );
      const offen = () => menue.classList.contains("is-open");
      for (const e of eintraege()) e.tabIndex = -1;
      if (!knopf.hasAttribute("aria-haspopup")) knopf.setAttribute("aria-haspopup", "true");
      knopf.setAttribute("aria-expanded", String(offen()));
      const setze = (an, fokus = null) => {
        var _a;
        if (offen() !== an) {
          menue.classList.toggle("is-open", an);
          knopf.setAttribute("aria-expanded", String(an));
          sende(wurzel, "breadcrumb-toggle", { open: an });
        }
        if (an && fokus) (_a = ersterBedienbar(eintraege(), fokus === "letzter")) == null ? void 0 : _a.focus();
      };
      const schliesse = (fokusZurueck) => {
        if (!offen()) return;
        setze(false);
        if (fokusZurueck) knopf.focus();
      };
      knopf.addEventListener("click", () => {
        if (gesperrt(knopf)) return;
        if (offen()) schliesse(false);
        else setze(true, "erster");
      }, { signal });
      knopf.addEventListener("keydown", (e) => {
        if (gesperrt(knopf)) return;
        if (e.key === "ArrowDown") {
          e.preventDefault();
          setze(true, "erster");
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          setze(true, "letzter");
        } else if (e.key === "Escape") schliesse(true);
      }, { signal });
      menue.addEventListener("keydown", (e) => {
        const eintrag = (
          /** @type {HTMLElement} */
          e.target.closest(EINTRAG2)
        );
        if (!eintrag) return;
        if (e.key === "Escape") {
          e.preventDefault();
          schliesse(true);
          return;
        }
        if (e.key === "Tab") {
          schliesse(false);
          return;
        }
        const ziel = zielFuerTaste(e.key, eintraege(), eintrag, "vertikal");
        if (!ziel) return;
        e.preventDefault();
        ziel.focus();
      }, { signal });
      menue.addEventListener("click", (e) => {
        if (
          /** @type {HTMLElement} */
          e.target.closest(EINTRAG2)
        ) schliesse(false);
      }, { signal });
      dok.addEventListener("click", (e) => {
        if (offen() && !huelle.contains(
          /** @type {Node} */
          e.target
        )) schliesse(false);
      }, { signal, capture: true });
      huelle.addEventListener("focusout", (e) => {
        const nach = (
          /** @type {Node|null} */
          e.relatedTarget
        );
        if (nach && !huelle.contains(nach)) schliesse(false);
      }, { signal });
    }
  };

  // packages/neo-behaviors/treeview.js
  var EINTRAG3 = ".nc-treeview__item";
  var AKTION = ".nc-treeview__action";
  var zaehler = 0;
  var NIE_IM_TAB = ".nc-treeview__toggle, .nc-treeview__checkbox, .nc-treeview__link, .nc-treeview__drag-handle";
  var treeview = {
    id: "treeview",
    selektor: ".nc-treeview",
    binde(wurzel, signal) {
      var _a, _b, _c;
      const baum = (
        /** @type {HTMLElement|null} */
        wurzel.querySelector('[role="tree"]') || wurzel.querySelector(".nc-treeview__list")
      );
      if (!baum) return;
      const mehrfach = baum.getAttribute("aria-multiselectable") === "true" || wurzel.classList.contains("nc-treeview--checkboxes");
      const alle = () => (
        /** @type {HTMLElement[]} */
        [...baum.querySelectorAll(EINTRAG3)]
      );
      const zeile = (li) => (
        /** @type {HTMLElement|null} */
        li.querySelector(":scope > .nc-treeview__node")
      );
      const eltern = (li) => {
        var _a2;
        const p = (
          /** @type {HTMLElement|null} */
          ((_a2 = li.parentElement) == null ? void 0 : _a2.closest(EINTRAG3)) || null
        );
        return p && baum.contains(p) ? p : null;
      };
      const kinder = (li) => alle().filter((x) => eltern(x) === li);
      const zweig = (li) => li.hasAttribute("aria-expanded");
      const offen = (li) => li.getAttribute("aria-expanded") === "true";
      const gesperrtE = (li) => gesperrt(li) || li.classList.contains("nc-treeview__item--disabled");
      const sichtbar = (li) => {
        for (let p = eltern(li); p; p = eltern(p)) if (!offen(p)) return false;
        return true;
      };
      const bedienbar = () => alle().filter((li) => sichtbar(li) && !gesperrtE(li) && zeile(li));
      const wertVon2 = (li) => {
        var _a2, _b2;
        return li.dataset.value || (((_b2 = (_a2 = zeile(li)) == null ? void 0 : _a2.querySelector(".nc-treeview__label, .nc-treeview__link")) == null ? void 0 : _b2.textContent) || "").trim();
      };
      const gewaehlt = (li) => li.getAttribute(mehrfach ? "aria-checked" : "aria-selected") === "true";
      const aktionen = (li) => {
        var _a2;
        return (
          /** @type {HTMLElement[]} */
          [...((_a2 = zeile(li)) == null ? void 0 : _a2.querySelectorAll(AKTION)) || []]
        );
      };
      const kinderBox = (li) => (
        /** @type {HTMLElement|null} */
        li.querySelector(":scope > .nc-treeview__children, :scope > .nc-treeview__list")
      );
      const eintragVon = (el) => {
        var _a2;
        return (
          /** @type {HTMLElement|null} */
          ((_a2 = el == null ? void 0 : el.closest) == null ? void 0 : _a2.call(el, EINTRAG3)) || null
        );
      };
      const tabStopp = (li, fokus = false) => {
        for (const x of alle()) {
          x.tabIndex = x === li ? 0 : -1;
          for (const a of aktionen(x)) a.tabIndex = x === li ? 0 : -1;
        }
        if (fokus) li.focus();
      };
      const moegliche = bedienbar();
      const start = moegliche.find((li) => {
        var _a2;
        return li.getAttribute("tabindex") === "0" || ((_a2 = zeile(li)) == null ? void 0 : _a2.getAttribute("tabindex")) === "0";
      }) || moegliche.find(gewaehlt) || moegliche[0];
      for (const li of alle()) {
        (_a = zeile(li)) == null ? void 0 : _a.removeAttribute("tabindex");
        for (const el of ((_b = zeile(li)) == null ? void 0 : _b.querySelectorAll(NIE_IM_TAB)) || []) el.tabIndex = -1;
      }
      if (start) tabStopp(start);
      for (const li of alle()) {
        if (li.hasAttribute("aria-label") || li.hasAttribute("aria-labelledby")) continue;
        const name = (
          /** @type {HTMLElement|null} */
          ((_c = zeile(li)) == null ? void 0 : _c.querySelector(".nc-treeview__label, .nc-treeview__link")) || null
        );
        if (!name) continue;
        if (!name.id) name.id = `nc-treeview-name-${++zaehler}`;
        li.setAttribute("aria-labelledby", name.id);
      }
      if (!mehrfach) {
        for (const li of alle()) if (!li.hasAttribute("aria-selected")) li.setAttribute("aria-selected", "false");
      }
      const klappe = (li, an) => {
        if (!zweig(li) || gesperrtE(li) || offen(li) === an) return;
        li.setAttribute("aria-expanded", String(an));
        if (!an) {
          const box = kinderBox(li);
          const aktiv = wurzel.ownerDocument.activeElement;
          const stopp = alle().find((x) => x.tabIndex === 0);
          if (box && aktiv && box.contains(aktiv)) tabStopp(li, true);
          else if (box && stopp && box.contains(stopp)) tabStopp(li);
        }
        sende(wurzel, "treeview-toggle", { value: wertVon2(li), expanded: an });
      };
      const melde = (li) => sende(wurzel, "treeview-select", { value: wertVon2(li), selected: gewaehlt(li), values: alle().filter(gewaehlt).map(wertVon2) });
      const setzeHaken = (li, wert) => {
        var _a2;
        li.setAttribute("aria-checked", wert);
        const box = (
          /** @type {HTMLInputElement|null} */
          ((_a2 = zeile(li)) == null ? void 0 : _a2.querySelector(".nc-treeview__checkbox")) || null
        );
        if (box) {
          box.checked = wert === "true";
          box.indeterminate = wert === "mixed";
        }
      };
      const hake = (li) => {
        const neu = li.getAttribute("aria-checked") === "true" ? "false" : "true";
        for (const x of [li, ...li.querySelectorAll(EINTRAG3)]) if (!gesperrtE(
          /** @type {HTMLElement} */
          x
        )) setzeHaken(x, neu);
        for (let p = eltern(li); p; p = eltern(p)) {
          const werte = new Set(kinder(p).map((k) => k.getAttribute("aria-checked") || "false"));
          setzeHaken(p, werte.size === 1 ? [...werte][0] : "mixed");
        }
        melde(li);
      };
      const waehle2 = (li) => {
        if (gesperrtE(li)) return;
        if (mehrfach) {
          hake(li);
          return;
        }
        if (gewaehlt(li)) return;
        for (const x of alle()) {
          x.setAttribute("aria-selected", String(x === li));
          x.classList.toggle("nc-treeview__item--selected", x === li);
        }
        melde(li);
      };
      baum.addEventListener("keydown", (e) => {
        var _a2, _b2;
        const ziel0 = (
          /** @type {HTMLElement} */
          e.target
        );
        if ((_a2 = ziel0.closest) == null ? void 0 : _a2.call(ziel0, AKTION)) {
          if (e.key === "Escape") {
            e.preventDefault();
            const li2 = eintragVon(ziel0);
            if (li2) tabStopp(li2, true);
          }
          return;
        }
        if (!((_b2 = ziel0.matches) == null ? void 0 : _b2.call(ziel0, EINTRAG3)) || !baum.contains(ziel0)) return;
        const li = ziel0;
        const z = zeile(li);
        if (!z) return;
        const liste = bedienbar();
        const i = liste.indexOf(li);
        let ziel = null;
        switch (e.key) {
          case "ArrowDown":
            ziel = liste[i + 1] || null;
            break;
          case "ArrowUp":
            ziel = i > 0 ? liste[i - 1] : null;
            break;
          case "Home":
            ziel = liste[0] || null;
            break;
          case "End":
            ziel = liste.at(-1) || null;
            break;
          case "ArrowRight":
            e.preventDefault();
            if (zweig(li) && !offen(li)) klappe(li, true);
            else if (zweig(li)) ziel = kinder(li).find((k) => !gesperrtE(k)) || null;
            break;
          case "ArrowLeft":
            e.preventDefault();
            if (zweig(li) && offen(li)) klappe(li, false);
            else ziel = eltern(li);
            break;
          case "Enter":
          case " ": {
            e.preventDefault();
            waehle2(li);
            const link = (
              /** @type {HTMLElement|null} */
              z.querySelector(".nc-treeview__link")
            );
            if (e.key === "Enter" && link) link.click();
            return;
          }
          default:
            return;
        }
        if (!ziel) return;
        e.preventDefault();
        tabStopp(ziel, true);
      }, { signal });
      baum.addEventListener("click", (e) => {
        const ziel = (
          /** @type {HTMLElement} */
          e.target
        );
        const z = (
          /** @type {HTMLElement|null} */
          ziel.closest(".nc-treeview__node")
        );
        if (!z || !baum.contains(z)) return;
        const li = (
          /** @type {HTMLElement} */
          z.closest(EINTRAG3)
        );
        if (gesperrtE(li)) return;
        if (ziel.closest(".nc-treeview__actions, .nc-treeview__drag-handle")) {
          tabStopp(li);
          return;
        }
        tabStopp(li, true);
        if (ziel.closest(".nc-treeview__toggle")) {
          klappe(li, !offen(li));
          return;
        }
        waehle2(li);
      }, { signal });
      baum.addEventListener("focusin", (e) => {
        const el = (
          /** @type {HTMLElement} */
          e.target
        );
        const li = eintragVon(el);
        if (!li || !baum.contains(li) || li.tabIndex === 0) return;
        if (el === li || el.closest(AKTION)) tabStopp(li);
      }, { signal });
    }
  };

  // packages/neo-behaviors/navigation-menu.js
  var VERWEILEN2 = 150;
  var OBEN = ":scope > .nc-navigation-menu__item > .nc-navigation-menu__trigger, :scope > .nc-navigation-menu__item > .nc-navigation-menu__link--top";
  var LINK = "a[href], button:not([disabled])";
  var laufnummer = 0;
  var navigationMenu = {
    id: "navigation-menu",
    selektor: ".nc-navigation-menu",
    binde(wurzel, signal) {
      const leiste = (
        /** @type {HTMLElement|null} */
        wurzel.querySelector(":scope > .nc-navigation-menu__list")
      );
      if (!leiste) return;
      const dok = wurzel.ownerDocument;
      const zeiger = (
        /** @type {HTMLElement|null} */
        wurzel.querySelector(":scope > .nc-navigation-menu__indicator")
      );
      const perHover = wurzel.dataset.trigger !== "click";
      const oben = () => (
        /** @type {HTMLElement[]} */
        [...leiste.querySelectorAll(OBEN)]
      );
      const istAusloeser = (el) => el.classList.contains("nc-navigation-menu__trigger");
      const ausloeser = () => oben().filter(istAusloeser);
      const panel = (a) => {
        var _a;
        const nachbar2 = (_a = a.parentElement) == null ? void 0 : _a.querySelector(":scope > .nc-navigation-menu__content");
        if (nachbar2) return (
          /** @type {HTMLElement} */
          nachbar2
        );
        const id = a.getAttribute("aria-controls");
        if (!id) return null;
        return (
          /** @type {HTMLElement|null} */
          wurzel.querySelector(`[id="${CSS.escape(id)}"]`) || dok.getElementById(id)
        );
      };
      const name = (a) => {
        var _a;
        return (((_a = a.querySelector("span")) == null ? void 0 : _a.textContent) || a.textContent || "").trim();
      };
      const links = (a) => {
        const p = panel(a);
        return p ? (
          /** @type {HTMLElement[]} */
          [...p.querySelectorAll(LINK)]
        ) : [];
      };
      let offen = (
        /** @type {HTMLElement|null} */
        null
      );
      let uhr = 0;
      for (const a of ausloeser()) {
        const p = panel(a);
        if (!p) continue;
        if (!p.id) p.id = `nc-navigation-menu-panel-${++laufnummer}`;
        a.setAttribute("aria-controls", p.id);
        const auf = a.getAttribute("aria-expanded") === "true" && !offen;
        a.setAttribute("aria-expanded", String(auf));
        p.hidden = !auf;
        if (auf) offen = a;
      }
      const zeigerAuf = (a) => {
        if (!zeiger) return;
        if (!a) {
          zeiger.dataset.state = "hidden";
          return;
        }
        const r = a.getBoundingClientRect();
        const n = wurzel.getBoundingClientRect();
        zeiger.dataset.state = "visible";
        zeiger.style.setProperty("--_indicator-left", `${r.left - n.left + r.width / 2 - 5}px`);
        zeiger.style.setProperty("--_indicator-width", "10px");
      };
      if (offen) zeigerAuf(offen);
      const zu = (a) => {
        a.setAttribute("aria-expanded", "false");
        const p = panel(a);
        if (p) p.hidden = true;
      };
      const oeffne = (a) => {
        const p = panel(a);
        clearTimeout(uhr);
        if (!p || a.hasAttribute("disabled") || offen === a) return;
        const vorher = offen;
        const liste = oben();
        if (vorher) zu(vorher);
        offen = a;
        a.setAttribute("aria-expanded", "true");
        if (vorher) p.dataset.motion = liste.indexOf(vorher) < liste.indexOf(a) ? "from-end" : "from-start";
        else delete p.dataset.motion;
        p.hidden = false;
        zeigerAuf(a);
        sende(wurzel, "navigation-menu-change", { value: name(a), previousValue: vorher ? name(vorher) : null });
      };
      const schliesse = (fokusZurueck = false) => {
        clearTimeout(uhr);
        const a = offen;
        if (!a) return;
        offen = null;
        zu(a);
        zeigerAuf(null);
        sende(wurzel, "navigation-menu-change", { value: null, previousValue: name(a) });
        if (fokusZurueck) a.focus();
      };
      wurzel.addEventListener("keydown", (e) => {
        var _a;
        const el = (
          /** @type {HTMLElement} */
          e.target
        );
        if (e.key === "Escape") {
          if (offen) {
            e.preventDefault();
            schliesse(true);
          }
          return;
        }
        if (oben().includes(el)) {
          if (e.key === "ArrowDown" && istAusloeser(el)) {
            e.preventDefault();
            oeffne(el);
            (_a = links(el)[0]) == null ? void 0 : _a.focus();
            return;
          }
          const ziel = zielFuerTaste(e.key, oben(), el, "horizontal");
          if (!ziel) return;
          e.preventDefault();
          ziel.focus();
          return;
        }
        if (offen) {
          const liste = links(offen);
          if (!liste.includes(el)) return;
          const ziel = zielFuerTaste(e.key, liste, el, "vertikal");
          if (!ziel) return;
          e.preventDefault();
          ziel.focus();
        }
      }, { signal });
      leiste.addEventListener("click", (e) => {
        var _a;
        const ziel = (
          /** @type {HTMLElement} */
          e.target
        );
        const a = (
          /** @type {HTMLElement|null} */
          ziel.closest(".nc-navigation-menu__trigger")
        );
        if (a && leiste.contains(a)) {
          if (offen === a) schliesse();
          else oeffne(a);
          return;
        }
        if (offen && ziel.closest("a[href]") && ((_a = panel(offen)) == null ? void 0 : _a.contains(ziel))) schliesse();
      }, { signal });
      let druck = (
        /** @type {HTMLElement|null} */
        null
      );
      leiste.addEventListener("mousedown", (e) => {
        druck = /** @type {HTMLElement} */
        e.target.closest(".nc-navigation-menu__trigger");
        window.setTimeout(() => {
          druck = null;
        }, 0);
      }, { signal });
      wurzel.addEventListener("focusin", (e) => {
        var _a;
        const el = (
          /** @type {HTMLElement} */
          e.target
        );
        if (!offen || ((_a = offen.parentElement) == null ? void 0 : _a.contains(el)) || druck && druck === el) return;
        schliesse();
      }, { signal });
      wurzel.addEventListener("focusout", (e) => {
        const nach = (
          /** @type {Node|null} */
          e.relatedTarget
        );
        if (offen && nach && !wurzel.contains(nach)) schliesse();
      }, { signal });
      const spaeter = (fn) => {
        clearTimeout(uhr);
        uhr = window.setTimeout(fn, VERWEILEN2);
      };
      if (perHover) {
        for (const a of ausloeser()) {
          const item = (
            /** @type {HTMLElement} */
            a.parentElement
          );
          item.addEventListener("mouseenter", () => spaeter(() => oeffne(a)), { signal });
          item.addEventListener("mouseleave", () => spaeter(() => {
            if (offen === a) schliesse();
          }), { signal });
        }
      }
      signal.addEventListener("abort", () => clearTimeout(uhr));
      dok.addEventListener("click", (e) => {
        if (offen && !wurzel.contains(
          /** @type {Node} */
          e.target
        )) schliesse();
      }, { signal, capture: true });
    }
  };

  // packages/neo-behaviors/toolbar.js
  var BEDIENELEMENT = 'button, a[href], input:not([type="hidden"]), select, textarea, [contenteditable="true"], [role="button"], [role="radio"], [role="checkbox"], [role="switch"]';
  var KEIN_FELD = ["button", "submit", "reset", "checkbox", "radio", "image", "file", "color"];
  function istFeld(el) {
    if (el.tagName === "TEXTAREA" || el.tagName === "SELECT" || el.isContentEditable || el.getAttribute("contenteditable") === "true") return true;
    return el.tagName === "INPUT" && !KEIN_FELD.includes(
      /** @type {HTMLInputElement} */
      el.type
    );
  }
  function beobachteSticky(wurzel, signal) {
    if (!wurzel.classList.contains("nc-toolbar--sticky")) return;
    const fenster = wurzel.ownerDocument.defaultView;
    const IO = fenster == null ? void 0 : fenster.IntersectionObserver;
    if (typeof IO !== "function") return;
    const vorher = wurzel.classList.contains("is-scrolled");
    const oben = parseFloat(fenster.getComputedStyle(wurzel).top) || 0;
    const beobachter = new IO((eintraege) => {
      for (const e of eintraege) {
        const rahmenOben = e.rootBounds ? e.rootBounds.top : oben + 1;
        wurzel.classList.toggle("is-scrolled", e.intersectionRatio < 1 && e.boundingClientRect.top < rahmenOben);
      }
    }, { rootMargin: `-${oben + 1}px 0px 0px 0px`, threshold: [1] });
    beobachter.observe(wurzel);
    signal.addEventListener("abort", () => {
      beobachter.disconnect();
      wurzel.classList.toggle("is-scrolled", vorher);
    });
  }
  var nameVon = (el) => (el.getAttribute("aria-label") || el.textContent || el.getAttribute("placeholder") || el.getAttribute("name") || "").trim();
  var toolbar = {
    id: "toolbar",
    selektor: ".nc-toolbar",
    binde(wurzel, signal) {
      beobachteSticky(wurzel, signal);
      const elemente = () => (
        /** @type {HTMLElement[]} */
        [...wurzel.querySelectorAll(BEDIENELEMENT)].filter((e) => !e.hasAttribute("disabled") && !e.closest('[hidden], [inert], [role="menu"], [role="listbox"], [role="dialog"]') && e.closest(".nc-toolbar") === wurzel)
      );
      if (!elemente().length) return;
      const vorher = new Map(elemente().map((e) => [e, e.getAttribute("tabindex")]));
      let aktuell = (
        /** @type {HTMLElement|null} */
        null
      );
      const tabStopp = (el, melden = true) => {
        for (const e of elemente()) e.tabIndex = e === el ? 0 : -1;
        const alt = aktuell;
        aktuell = el;
        if (melden && alt !== el) sende(wurzel, "toolbar-focus", { value: nameVon(el), previousValue: alt ? nameVon(alt) : null });
      };
      tabStopp(elemente().find((e) => !gesperrt(e)) || elemente()[0], false);
      wurzel.addEventListener("keydown", (e) => {
        const el = (
          /** @type {HTMLElement} */
          e.target
        );
        const liste = elemente();
        if (!liste.includes(el)) return;
        if (istFeld(el)) {
          if (e.key !== "Tab" || e.altKey || e.ctrlKey || e.metaKey) return;
          const bedienbar = liste.filter((x) => x === el || !gesperrt(x));
          const ziel2 = bedienbar[bedienbar.indexOf(el) + (e.shiftKey ? -1 : 1)];
          if (!ziel2) return;
          e.preventDefault();
          tabStopp(ziel2);
          ziel2.focus();
          return;
        }
        const ziel = zielFuerTaste(e.key, liste, el, "horizontal");
        if (!ziel) return;
        e.preventDefault();
        e.stopPropagation();
        tabStopp(ziel);
        ziel.focus();
      }, { signal, capture: true });
      wurzel.addEventListener("focusin", (e) => {
        const el = (
          /** @type {HTMLElement} */
          e.target
        );
        if (el !== aktuell && elemente().includes(el)) tabStopp(el);
      }, { signal });
      wurzel.addEventListener("click", (e) => {
        const el = (
          /** @type {HTMLElement|null} */
          /** @type {HTMLElement} */
          e.target.closest(BEDIENELEMENT)
        );
        if (el && elemente().includes(el)) tabStopp(el);
      }, { signal });
      signal.addEventListener("abort", () => {
        for (const [e, wert] of vorher) {
          if (wert === null) e.removeAttribute("tabindex");
          else e.setAttribute("tabindex", wert);
        }
      });
    }
  };

  // packages/neo-behaviors/sidebar.js
  var UNTER = "button.nc-sidebar__item[aria-controls]";
  var EINKLAPPEN = "Navigation einklappen";
  var AUSKLAPPEN = "Navigation ausklappen";
  var sidebar = {
    id: "sidebar",
    selektor: ".nc-sidebar",
    binde(wurzel, signal) {
      var _a;
      const dok = wurzel.ownerDocument;
      const ziel = (knopf) => (
        /** @type {HTMLElement|null} */
        dok.getElementById(knopf.getAttribute("aria-controls") || "")
      );
      const label = (el) => {
        var _a2;
        return (((_a2 = el.querySelector(".nc-sidebar__item-label")) == null ? void 0 : _a2.textContent) || el.getAttribute("aria-label") || el.textContent || "").trim();
      };
      for (const k of wurzel.querySelectorAll(UNTER)) {
        const panel = ziel(k);
        if (!panel || !wurzel.contains(panel)) continue;
        if (!k.hasAttribute("aria-expanded")) k.setAttribute("aria-expanded", String(!panel.hidden));
        panel.hidden = k.getAttribute("aria-expanded") !== "true";
      }
      const klappe = (k) => {
        const panel = ziel(k);
        if (!panel || gesperrt(k)) return;
        const an = k.getAttribute("aria-expanded") !== "true";
        k.setAttribute("aria-expanded", String(an));
        panel.hidden = !an;
        sende(wurzel, "sidebar-submenu-toggle", { value: label(k), open: an });
      };
      const kopfKnopf = (
        /** @type {HTMLElement|null} */
        wurzel.querySelector(".nc-sidebar__toggle")
      );
      const vonUns = /* @__PURE__ */ new Set();
      const klappeEin = (an) => {
        wurzel.classList.toggle("nc-sidebar--collapsed", an);
        if (kopfKnopf) {
          kopfKnopf.setAttribute("aria-expanded", String(!an));
          kopfKnopf.setAttribute("aria-label", an ? AUSKLAPPEN : EINKLAPPEN);
        }
        if (an) {
          for (const el of wurzel.querySelectorAll(".nc-sidebar__item:not(.nc-sidebar__item--sub)")) {
            if (el.hasAttribute("aria-label")) continue;
            el.setAttribute("aria-label", label(el));
            vonUns.add(el);
          }
        } else {
          for (const el of vonUns) el.removeAttribute("aria-label");
          vonUns.clear();
        }
        sende(wurzel, "sidebar-collapse", { collapsed: an });
      };
      if (kopfKnopf) kopfKnopf.setAttribute("aria-expanded", String(!wurzel.classList.contains("nc-sidebar--collapsed")));
      wurzel.addEventListener("click", (e) => {
        const el = (
          /** @type {HTMLElement} */
          e.target
        );
        const k = (
          /** @type {HTMLElement|null} */
          el.closest(UNTER)
        );
        if (k && wurzel.contains(k) && wurzel.contains(ziel(k))) {
          klappe(k);
          return;
        }
        if (kopfKnopf && el.closest(".nc-sidebar__toggle") === kopfKnopf && !gesperrt(kopfKnopf)) klappeEin(!wurzel.classList.contains("nc-sidebar--collapsed"));
      }, { signal });
      const hinten = (
        /** @type {HTMLElement|null} */
        ((_a = wurzel.parentElement) == null ? void 0 : _a.querySelector(":scope > .nc-sidebar-backdrop")) || null
      );
      const offen = () => wurzel.classList.contains("nc-sidebar--open");
      let oeffner = (
        /** @type {HTMLElement|null} */
        null
      );
      if (hinten) hinten.hidden = !offen();
      const ansicht = dok.defaultView;
      const istOverlay = () => !!hinten && (wurzel.classList.contains("nc-sidebar--overlay") || (ansicht == null ? void 0 : ansicht.getComputedStyle(wurzel).position) === "fixed");
      const vonUnsInert = (
        /** @type {Set<Element>} */
        /* @__PURE__ */ new Set()
      );
      let falle = false;
      const sperreRest = () => {
        for (let el = (
          /** @type {Element} */
          wurzel
        ); el.parentElement && el !== dok.body; el = el.parentElement) {
          for (const g2 of el.parentElement.children) {
            if (g2 === el || g2 === hinten || g2.hasAttribute("inert")) continue;
            g2.setAttribute("inert", "");
            vonUnsInert.add(g2);
          }
        }
      };
      const gibRestFrei = () => {
        for (const g2 of vonUnsInert) g2.removeAttribute("inert");
        vonUnsInert.clear();
      };
      const setze = (an, grund, knopf = null) => {
        if (offen() === an) return;
        wurzel.classList.toggle("nc-sidebar--open", an);
        if (hinten) hinten.hidden = !an;
        if (an) {
          oeffner = knopf;
          oeffner == null ? void 0 : oeffner.setAttribute("aria-expanded", "true");
          falle = istOverlay();
          if (falle) sperreRest();
          const start = (
            /** @type {HTMLElement|null} */
            wurzel.querySelector('[aria-current="page"]') || fokussierbare(wurzel)[0]
          );
          start == null ? void 0 : start.focus();
        } else {
          falle = false;
          gibRestFrei();
          const zurueck = oeffner;
          oeffner = null;
          zurueck == null ? void 0 : zurueck.setAttribute("aria-expanded", "false");
          if (zurueck && (wurzel.contains(dok.activeElement) || grund !== "trigger")) zurueck.focus();
        }
        sende(wurzel, "sidebar-toggle", { open: an, reason: grund });
      };
      signal.addEventListener("abort", gibRestFrei);
      if (wurzel.id) {
        for (const k of dok.querySelectorAll(`[aria-controls="${CSS.escape(wurzel.id)}"]`)) if (!wurzel.contains(k)) k.setAttribute("aria-expanded", String(offen()));
        dok.addEventListener("click", (e) => {
          var _a2, _b;
          const knopf = (
            /** @type {HTMLElement|null} */
            /** @type {HTMLElement} */
            ((_b = (_a2 = e.target).closest) == null ? void 0 : _b.call(_a2, "[aria-controls]")) || null
          );
          if (!knopf || knopf.getAttribute("aria-controls") !== wurzel.id || wurzel.contains(knopf) || gesperrt(knopf)) return;
          e.preventDefault();
          if (offen()) setze(false, "trigger");
          else setze(true, "trigger", knopf);
        }, { signal });
      }
      hinten == null ? void 0 : hinten.addEventListener("click", () => setze(false, "overlay-click"), { signal });
      dok.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && offen()) {
          e.preventDefault();
          setze(false, "escape");
        } else if (falle && offen() && wurzel.isConnected) fokusFalle(e, wurzel);
      }, { signal });
    }
  };

  // packages/neo-behaviors/navigation-tab-mega.js
  var AUSBLENDEN = 200;
  var FOKUS_NACH = 130;
  var OBEN_FREI = 120;
  var SCHWELLE = 8;
  var BURGER_ZU = '<path d="M3 6h18M3 12h18M3 18h18"/>';
  var BURGER_OFFEN = '<path d="M6 6l12 12M18 6L6 18"/>';
  var navigationTabMega = {
    id: "navigation-tab-mega",
    selektor: ".site-header[data-neo-nav]",
    binde(wurzel, signal) {
      var _a, _b;
      const dok = wurzel.ownerDocument;
      const fenster = dok.defaultView || window;
      const perId = (id) => (
        /** @type {HTMLElement|null} */
        id ? dok.getElementById(id) : null
      );
      const ziel = (el) => perId((el == null ? void 0 : el.getAttribute("aria-controls")) || "");
      const uhren = /* @__PURE__ */ new Set();
      const spaeter = (fn, ms) => {
        const u = fenster.setTimeout(() => {
          uhren.delete(u);
          fn();
        }, ms);
        uhren.add(u);
      };
      const fokus = (el) => {
        try {
          el == null ? void 0 : el.focus({ preventScroll: true });
        } catch {
          el == null ? void 0 : el.focus();
        }
      };
      const ausloeser = (
        /** @type {HTMLElement[]} */
        [...wurzel.querySelectorAll(".nav-btn[aria-controls]")].filter((b) => ziel(b))
      );
      const suchKnopf = (
        /** @type {HTMLElement|null} */
        wurzel.querySelector(".search-toggle")
      );
      const band = ziel(suchKnopf);
      const feld = (
        /** @type {HTMLInputElement|null} */
        (band == null ? void 0 : band.querySelector(".search-input")) || null
      );
      const loeschen = (
        /** @type {HTMLElement|null} */
        (band == null ? void 0 : band.querySelector(".search-clear")) || null
      );
      const schliessKnopf = (
        /** @type {HTMLElement|null} */
        (band == null ? void 0 : band.querySelector(".search-close")) || null
      );
      const menues = (
        /** @type {HTMLElement[]} */
        [...wurzel.querySelectorAll("[data-hdr-menu]")].map((m) => {
          const knopf = (
            /** @type {HTMLElement|null} */
            m.querySelector(".hdr-btn")
          );
          const pop = ziel(knopf) || /** @type {HTMLElement|null} */
          m.querySelector(".hdr-pop");
          const art = (pop == null ? void 0 : pop.querySelector("[data-lang]")) ? "sprache" : (pop == null ? void 0 : pop.querySelector("[data-theme-value]")) ? "ansicht" : (knopf == null ? void 0 : knopf.id) || "";
          return { m, knopf, pop, art };
        }).filter((x) => x.knopf && x.pop)
      );
      const burger = (
        /** @type {HTMLElement|null} */
        wurzel.querySelector(".burger")
      );
      const drawer2 = ziel(burger);
      const bereiche = () => drawer2 ? [wurzel, drawer2] : [wurzel];
      let offen = (
        /** @type {HTMLElement|null} */
        null
      );
      const panelName = (b) => {
        var _a2;
        return ((_a2 = ziel(b)) == null ? void 0 : _a2.dataset.panel) || b.dataset.trigger || b.id;
      };
      const oeffnePanel = (b) => {
        if (offen === b) return;
        schliessePanel();
        schliesseSuche();
        schliesseMenues();
        const p = (
          /** @type {HTMLElement} */
          ziel(b)
        );
        p.hidden = false;
        void p.offsetWidth;
        p.classList.add("is-open");
        b.setAttribute("aria-expanded", "true");
        offen = b;
        sende(wurzel, "navigation-tab-mega-panel", { value: panelName(b), open: true });
      };
      const schliessePanel = (fokusZurueck = false) => {
        const b = offen;
        if (!b) return;
        const p = (
          /** @type {HTMLElement} */
          ziel(b)
        );
        p.classList.remove("is-open");
        b.setAttribute("aria-expanded", "false");
        spaeter(() => {
          if (!p.classList.contains("is-open")) p.hidden = true;
        }, AUSBLENDEN);
        offen = null;
        if (fokusZurueck) fokus(b);
        sende(wurzel, "navigation-tab-mega-panel", { value: panelName(b), open: false });
      };
      for (const b of ausloeser) {
        const p = (
          /** @type {HTMLElement} */
          ziel(b)
        );
        if (p.classList.contains("is-open") && !p.hidden && !offen) {
          offen = b;
          b.setAttribute("aria-expanded", "true");
        } else b.setAttribute("aria-expanded", "false");
      }
      const tabsVon = (tab) => {
        var _a2;
        return (
          /** @type {HTMLElement[]} */
          [...((_a2 = tab.closest('[role="tablist"]')) == null ? void 0 : _a2.querySelectorAll('[role="tab"]')) || []]
        );
      };
      const waehleTab = (tab) => {
        const liste2 = tabsVon(tab);
        const vorher = liste2.find((t) => t.getAttribute("aria-selected") === "true") || null;
        for (const t of liste2) {
          const an = t === tab;
          t.setAttribute("aria-selected", String(an));
          t.tabIndex = an ? 0 : -1;
          const tp = ziel(t);
          if (tp) tp.hidden = !an;
        }
        if (vorher !== tab) sende(wurzel, "navigation-tab-mega-tab", { value: tab.id, previousValue: vorher ? vorher.id : null });
      };
      let sucheOffen = !!(band && !band.hidden && band.classList.contains("is-open"));
      if (suchKnopf) suchKnopf.setAttribute("aria-expanded", String(sucheOffen));
      const loeschenAbgleichen = () => {
        if (loeschen && feld) loeschen.hidden = feld.value.length === 0;
      };
      const oeffneSuche = () => {
        if (!band || sucheOffen) return;
        schliessePanel();
        schliesseMenues();
        band.hidden = false;
        void band.offsetWidth;
        band.classList.add("is-open");
        suchKnopf == null ? void 0 : suchKnopf.setAttribute("aria-expanded", "true");
        sucheOffen = true;
        const insFeld = () => {
          if (sucheOffen) fokus(feld);
        };
        insFeld();
        spaeter(insFeld, FOKUS_NACH);
        loeschenAbgleichen();
        sende(wurzel, "navigation-tab-mega-search", { open: true });
      };
      const schliesseSuche = (fokusZurueck = false) => {
        if (!band || !sucheOffen) return;
        band.classList.remove("is-open");
        suchKnopf == null ? void 0 : suchKnopf.setAttribute("aria-expanded", "false");
        spaeter(() => {
          if (!band.classList.contains("is-open")) band.hidden = true;
        }, AUSBLENDEN);
        sucheOffen = false;
        if (fokusZurueck) fokus(suchKnopf);
        sende(wurzel, "navigation-tab-mega-search", { open: false });
      };
      feld == null ? void 0 : feld.addEventListener("input", loeschenAbgleichen, { signal });
      feld == null ? void 0 : feld.addEventListener("change", loeschenAbgleichen, { signal });
      loeschenAbgleichen();
      const menueOffen = (x) => !x.pop.hidden;
      for (const x of menues) x.knopf.setAttribute("aria-expanded", String(menueOffen(x)));
      const schliesseMenue = (x, fokusZurueck = false) => {
        if (!menueOffen(x)) return;
        x.pop.hidden = true;
        x.knopf.setAttribute("aria-expanded", "false");
        if (fokusZurueck) fokus(x.knopf);
        sende(wurzel, "navigation-tab-mega-menu", { value: x.art, open: false });
      };
      function schliesseMenues(ausser = null) {
        for (const x of menues) if (x !== ausser) schliesseMenue(x);
      }
      const optionen = (x) => (
        /** @type {HTMLElement[]} */
        [...x.pop.querySelectorAll(".hdr-opt")]
      );
      const oeffneMenue = (x) => {
        schliesseMenues(x);
        schliessePanel();
        schliesseSuche();
        x.pop.hidden = false;
        x.knopf.setAttribute("aria-expanded", "true");
        fokus(optionen(x)[0]);
        sende(wurzel, "navigation-tab-mega-menu", { value: x.art, open: true });
      };
      const codeEl = (
        /** @type {HTMLElement|null} */
        wurzel.querySelector("[data-lang-code]")
      );
      let sprache = ((codeEl == null ? void 0 : codeEl.textContent) || ((_a = wurzel.closest("[lang]")) == null ? void 0 : _a.getAttribute("lang")) || "de").trim().toLowerCase();
      const setzeSprache = (lc) => {
        var _a2, _b2;
        if (!lc) return;
        const wechsel = lc !== sprache;
        sprache = lc;
        for (const b of bereiche()) {
          for (const x of b.querySelectorAll(".lang-switch button[data-lang]")) x.setAttribute("aria-pressed", String(
            /** @type {HTMLElement} */
            x.dataset.lang === lc
          ));
          for (const x of b.querySelectorAll(".hdr-opt[data-lang]")) x.setAttribute("aria-checked", String(
            /** @type {HTMLElement} */
            x.dataset.lang === lc
          ));
          for (const el of b.querySelectorAll("[data-neo-i18n]")) {
            let texte;
            try {
              texte = JSON.parse(el.getAttribute("data-neo-i18n") || "");
            } catch {
              continue;
            }
            if (!texte || typeof texte !== "object") continue;
            const wert = (_b2 = (_a2 = texte[lc]) != null ? _a2 : texte.de) != null ? _b2 : "";
            const attr = el.getAttribute("data-neo-i18n-attr");
            if (attr) el.setAttribute(attr, wert);
            else el.textContent = wert;
          }
          b.setAttribute("lang", lc);
        }
        if (codeEl) codeEl.textContent = lc.toUpperCase();
        if (wechsel) sende(wurzel, "navigation-tab-mega-language", { value: lc });
      };
      const bildschirme = () => (
        /** @type {HTMLElement[]} */
        drawer2 ? [...drawer2.querySelectorAll(".m-screen")] : []
      );
      const startBild = () => bildschirme().find((s) => s.dataset.screen === "root") || bildschirme()[0];
      let stapel = (
        /** @type {HTMLElement[]} */
        []
      );
      let rufer = (
        /** @type {HTMLElement[]} */
        []
      );
      const drawerOffen = () => !!(drawer2 == null ? void 0 : drawer2.classList.contains("is-open"));
      const sperre = () => {
        if (!drawer2) return;
        drawer2.toggleAttribute("inert", !drawerOffen());
        const oben = stapel.at(-1);
        for (const s of bildschirme()) s.toggleAttribute("inert", s !== oben);
      };
      const zeigeStapel = (melden = true) => {
        const oben = stapel.at(-1);
        for (const s of bildschirme()) {
          s.classList.remove("is-active", "is-prev");
          if (s === oben) s.classList.add("is-active");
          else if (stapel.includes(s)) s.classList.add("is-prev");
        }
        sperre();
        if (melden) sende(wurzel, "navigation-tab-mega-screen", { value: (oben == null ? void 0 : oben.dataset.screen) || "root" });
      };
      if (drawer2) {
        const aktiv = bildschirme().find((s) => s.classList.contains("is-active"));
        const start = startBild();
        stapel = start ? aktiv && aktiv !== start ? [start, aktiv] : [start] : [];
        sperre();
      }
      const zielBild = (zeile) => {
        var _a2;
        const z = ziel(zeile);
        if (z) return z;
        const zeilen = [...((_a2 = startBild()) == null ? void 0 : _a2.querySelectorAll("button.m-row")) || []];
        return bildschirme().filter((s) => s !== startBild())[zeilen.indexOf(zeile)] || null;
      };
      const schiebe = (zeile) => {
        const s = zielBild(zeile);
        if (!s || stapel.includes(s)) return;
        stapel.push(s);
        rufer.push(zeile);
        zeigeStapel();
        fokus(
          /** @type {HTMLElement|null} */
          s.querySelector(".m-back")
        );
      };
      const zurueck = () => {
        if (stapel.length < 2) return;
        stapel.pop();
        const z = rufer.pop();
        zeigeStapel();
        fokus(z);
      };
      const setzeDrawer = (an, grund) => {
        if (!drawer2 || !burger || drawerOffen() === an) return;
        if (!an && drawer2.contains(dok.activeElement)) fokus(burger);
        drawer2.classList.toggle("is-open", an);
        burger.setAttribute("aria-expanded", String(an));
        burger.setAttribute("aria-label", an ? burger.dataset.labelOffen || "Menü schließen" : burger.dataset.labelZu || "Menü öffnen");
        const svg = burger.querySelector("svg");
        if (svg) svg.innerHTML = an ? BURGER_OFFEN : BURGER_ZU;
        if (!an) {
          const start = startBild();
          stapel = start ? [start] : [];
          rufer = [];
          zeigeStapel();
        } else sperre();
        sende(wurzel, "navigation-tab-mega-drawer", { open: an, reason: grund });
      };
      dok.addEventListener("click", (e) => {
        var _a2;
        const t = (
          /** @type {HTMLElement} */
          e.target
        );
        if (!t || !t.closest) return;
        const b = (
          /** @type {HTMLElement|null} */
          t.closest(".nav-btn[aria-controls]")
        );
        if (b && ausloeser.includes(b)) {
          if (offen === b) schliessePanel(true);
          else oeffnePanel(b);
          return;
        }
        if (suchKnopf && t.closest(".search-toggle") === suchKnopf) {
          if (sucheOffen) schliesseSuche(true);
          else oeffneSuche();
          return;
        }
        for (const x of menues) {
          if (t.closest(".hdr-btn") === x.knopf) {
            if (menueOffen(x)) schliesseMenue(x);
            else oeffneMenue(x);
            return;
          }
          const opt = (
            /** @type {HTMLElement|null} */
            t.closest(".hdr-opt")
          );
          if (opt && x.pop.contains(opt)) {
            const wert = opt.dataset.lang || opt.dataset.themeValue || "";
            if (opt.dataset.lang) setzeSprache(opt.dataset.lang);
            sende(wurzel, "navigation-tab-mega-select", { menu: x.art, value: wert });
            schliesseMenue(x, true);
            return;
          }
        }
        if (schliessKnopf && t.closest(".search-close") === schliessKnopf) {
          schliesseSuche(true);
          return;
        }
        if (loeschen && t.closest(".search-clear") === loeschen && feld) {
          feld.value = "";
          loeschenAbgleichen();
          feld.dispatchEvent(new Event("input", { bubbles: true }));
          fokus(feld);
          return;
        }
        const tab = (
          /** @type {HTMLElement|null} */
          t.closest('[role="tab"]')
        );
        if (tab && wurzel.contains(tab)) {
          waehleTab(tab);
          return;
        }
        if (burger && t.closest(".burger") === burger) {
          setzeDrawer(!drawerOffen(), "trigger");
          return;
        }
        if (drawer2 && drawer2.contains(t)) {
          const zeile = (
            /** @type {HTMLElement|null} */
            t.closest("button.m-row")
          );
          if (zeile) {
            schiebe(zeile);
            return;
          }
          if (t.closest(".m-back")) {
            zurueck();
            return;
          }
        }
        const sprachKnopf = (
          /** @type {HTMLElement|null} */
          t.closest(".lang-switch button[data-lang]")
        );
        if (sprachKnopf && bereiche().some((x) => x.contains(sprachKnopf))) {
          setzeSprache(sprachKnopf.dataset.lang || "");
          return;
        }
        if (offen && !((_a2 = ziel(offen)) == null ? void 0 : _a2.contains(t))) schliessePanel();
        if (sucheOffen && band && !band.contains(t)) schliesseSuche();
        for (const x of menues) if (menueOffen(x) && !x.m.contains(t)) schliesseMenue(x);
      }, { signal });
      wurzel.addEventListener("keydown", (e) => {
        const t = (
          /** @type {HTMLElement} */
          e.target
        );
        if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
        const schritt = e.key === "ArrowDown" ? 1 : -1;
        if (t.getAttribute("role") === "tab" && t.closest('[role="tablist"]')) {
          e.preventDefault();
          const n = nachbar(tabsVon(t), t, schritt);
          if (n) {
            waehleTab(n);
            fokus(n);
          }
          return;
        }
        const x = menues.find((m) => m.pop.contains(t));
        if (x) {
          e.preventDefault();
          const liste2 = optionen(x);
          const i = liste2.indexOf(t);
          fokus(liste2[(i + schritt + liste2.length) % liste2.length]);
        }
      }, { signal });
      dok.addEventListener("keydown", (e) => {
        if (e.key !== "Escape") return;
        const x = menues.find(menueOffen);
        if (x) {
          e.preventDefault();
          schliesseMenue(x, true);
          return;
        }
        if (sucheOffen) {
          e.preventDefault();
          schliesseSuche(true);
          return;
        }
        if (offen) {
          e.preventDefault();
          schliessePanel(true);
          return;
        }
        if (drawerOffen()) {
          e.preventDefault();
          setzeDrawer(false, "escape");
        }
      }, { signal });
      const liste = wurzel.querySelector(".nav-list");
      if (liste && !liste.querySelector("[aria-current]")) {
        const norm = (p) => {
          try {
            p = decodeURI(p || "");
          } catch {
          }
          p = p.split("?")[0].split("#")[0];
          return p.length > 1 ? p.replace(/\/+$/, "") : p;
        };
        const hier = norm(wurzel.dataset.neoNavPfad || ((_b = fenster.location) == null ? void 0 : _b.pathname) || "");
        let bester = (
          /** @type {HTMLElement|null} */
          null
        );
        let laenge = -1;
        let seite = false;
        const href = (a) => a.getAttribute("href") || "";
        for (
          const punkt of
          /** @type {HTMLElement[]} */
          [...liste.querySelectorAll(".nav-btn[aria-controls], a.nav-link")]
        ) {
          const p = punkt.classList.contains("nav-btn") ? ziel(punkt) : null;
          const ueber = p == null ? void 0 : p.querySelector(".panel-overview");
          const eigenes = p ? ueber ? norm(href(ueber)) : null : norm(href(punkt));
          const ziele = (p ? [...p.querySelectorAll(".link-grid a, .dropdown-cols a, .panel-overview")].map(href) : [href(punkt)]).map(norm).filter((h) => h && h !== "#");
          for (const z of ziele) {
            let treffer = false;
            let genau = false;
            if (z === hier) {
              treffer = true;
              genau = z === eigenes;
            } else if (z !== "/" && hier.indexOf(z + "/") === 0) treffer = true;
            if (!treffer) continue;
            if (z.length > laenge || z.length === laenge && genau) {
              laenge = z.length;
              bester = punkt;
              seite = genau;
            }
          }
        }
        if (bester) {
          bester.setAttribute("aria-current", seite ? "page" : "true");
          bester.classList.add("is-active");
        }
      }
      if (wurzel.dataset.neoNavAutohide !== "aus") {
        const VERSTECKT = "is-nav-hidden";
        let zuletzt = fenster.scrollY || 0;
        let wartet = false;
        const gesperrt2 = () => wurzel.contains(dok.activeElement) || !!wurzel.querySelector('[aria-expanded="true"], .is-open') || drawerOffen();
        const setze = (an) => {
          if (wurzel.classList.contains(VERSTECKT) === an) return;
          wurzel.classList.toggle(VERSTECKT, an);
          sende(wurzel, "navigation-tab-mega-hidden", { hidden: an });
        };
        const pruefe = () => {
          wartet = false;
          const y = Math.max(0, fenster.scrollY || 0);
          if (dok.documentElement.hasAttribute("data-neo-sprung")) {
            zuletzt = y;
            return;
          }
          if (gesperrt2() || y <= OBEN_FREI) {
            setze(false);
            zuletzt = y;
            return;
          }
          const d = y - zuletzt;
          if (d > SCHWELLE) {
            setze(true);
            zuletzt = y;
          } else if (d < -SCHWELLE) {
            setze(false);
            zuletzt = y;
          }
        };
        const naechsterFrame = (fn) => fenster.requestAnimationFrame ? fenster.requestAnimationFrame(fn) : spaeter(fn, 16);
        fenster.addEventListener("scroll", () => {
          if (!wartet) {
            wartet = true;
            naechsterFrame(pruefe);
          }
        }, { passive: true, signal });
        wurzel.addEventListener("focusin", () => setze(false), { signal });
        wurzel.addEventListener("click", () => naechsterFrame(pruefe), { signal });
        pruefe();
      }
      signal.addEventListener("abort", () => {
        for (const u of uhren) fenster.clearTimeout(u);
        uhren.clear();
        drawer2 == null ? void 0 : drawer2.removeAttribute("inert");
        for (const s of bildschirme()) s.removeAttribute("inert");
      });
    }
  };

  // packages/neo-behaviors/_meldung.js
  function fokusWeiter(el) {
    var _a, _b;
    const dok = el.ownerDocument;
    if (!el.contains(dok.activeElement)) return;
    const liste = fokussierbare(dok.body).filter((e) => !el.contains(e));
    const danach = liste.find((e) => el.compareDocumentPosition(e) & Node.DOCUMENT_POSITION_FOLLOWING);
    const davor = liste.filter((e) => el.compareDocumentPosition(e) & Node.DOCUMENT_POSITION_PRECEDING).at(-1);
    const ziel = danach || davor;
    if (ziel) ziel.focus();
    else (_b = (_a = dok.activeElement) == null ? void 0 : _a.blur) == null ? void 0 : _b.call(_a);
  }
  function animationsDauer(el) {
    var _a;
    const stil = (_a = el.ownerDocument.defaultView) == null ? void 0 : _a.getComputedStyle(el);
    if (!stil || !stil.animationName || stil.animationName === "none") return 0;
    const ms = (t) => (t.trim().endsWith("ms") ? parseFloat(t) : parseFloat(t) * 1e3) || 0;
    const dauern = (stil.animationDuration || "0s").split(",").map(ms);
    const verzug = (stil.animationDelay || "0s").split(",").map(ms);
    return Math.max(0, ...dauern.map((d, i) => d + (verzug[i] || 0)));
  }
  function ausblenden(el, klasse, fertig) {
    el.classList.add(klasse);
    const dauer = animationsDauer(el);
    if (!dauer) {
      fertig();
      return;
    }
    let erledigt = false;
    const einmal = () => {
      if (erledigt) return;
      erledigt = true;
      clearTimeout(notfall);
      el.removeEventListener("animationend", beiEnde);
      fertig();
    };
    const beiEnde = (e) => {
      if (e.target === el) einmal();
    };
    const notfall = setTimeout(einmal, dauer + 100);
    el.addEventListener("animationend", beiEnde);
  }
  function merkeHoehe(el, eigenschaft) {
    const hoehe = el.getBoundingClientRect().height;
    if (hoehe > 0) el.style.setProperty(eigenschaft, `${Math.ceil(hoehe)}px`);
  }

  // packages/neo-behaviors/toast.js
  var MIT_AKTION_MINDESTENS = 1e4;
  var STANDARD_DAUER = 5e3;
  var STEHEND = ".nc-toast--error, .nc-toast--warning";
  var OFFEN = /* @__PURE__ */ new Set();
  function zeitwert(text, ersatz) {
    const t = String(text || "").trim();
    if (!t) return ersatz;
    const zahl = parseFloat(t);
    if (Number.isNaN(zahl)) return ersatz;
    return t.endsWith("ms") || !t.endsWith("s") ? zahl : zahl * 1e3;
  }
  function token(el, name) {
    var _a;
    return ((_a = el.ownerDocument.defaultView) == null ? void 0 : _a.getComputedStyle(el).getPropertyValue(name)) || "";
  }
  function dauerAus(wurzel) {
    if (!wurzel.hasAttribute("data-duration") || wurzel.matches(STEHEND)) return 0;
    const roh = wurzel.getAttribute("data-duration") || "";
    let dauer = roh === "" || roh === "auto" ? zeitwert(token(wurzel, "--nc-toast-auto-dismiss-duration"), STANDARD_DAUER) : zeitwert(roh, 0);
    if (dauer > 0 && wurzel.querySelector(".nc-toast__action")) dauer = Math.max(dauer, MIT_AKTION_MINDESTENS);
    return dauer > 0 ? dauer : 0;
  }
  function aktionsWert(knopf) {
    if (knopf.dataset.action) return knopf.dataset.action;
    if (knopf.hasAttribute("data-undo")) return "undo";
    return (knopf.textContent || "").trim();
  }
  var toast = {
    id: "toast",
    selektor: ".nc-toast",
    /** @param {HTMLElement} wurzel @param {AbortSignal} signal */
    binde(wurzel, signal) {
      var _a;
      const dok = wurzel.ownerDocument;
      const intern = new AbortController();
      signal.addEventListener("abort", () => intern.abort(), { once: true });
      const sig = intern.signal;
      const balken = (
        /** @type {HTMLElement|null} */
        wurzel.querySelector(":scope > .nc-toast__progress")
      );
      const dauer = dauerAus(wurzel);
      let rest = dauer;
      let start = 0;
      let uhr = 0;
      let zu = false;
      const halt = /* @__PURE__ */ new Set();
      OFFEN.add(wurzel);
      const laufe = () => {
        if (!dauer || zu || halt.size || uhr) return;
        start = Date.now();
        uhr = setTimeout(() => schliesse("timeout"), rest);
        if (balken) balken.style.animationPlayState = "";
      };
      const pausiere = () => {
        if (!uhr) return;
        clearTimeout(uhr);
        uhr = 0;
        rest = Math.max(0, rest - (Date.now() - start));
      };
      const halte = (grund, an) => {
        if (an) {
          halt.add(grund);
          pausiere();
        } else {
          halt.delete(grund);
          laufe();
        }
        if (balken && grund === "verborgen") balken.style.animationPlayState = an ? "paused" : "";
      };
      const schliesse = (reason) => {
        if (zu) return;
        zu = true;
        pausiere();
        OFFEN.delete(wurzel);
        sende(wurzel, "toast-dismiss", { reason });
        fokusWeiter(wurzel);
        ausblenden(wurzel, "is-leaving", () => {
          wurzel.remove();
          intern.abort();
        });
      };
      const balkenWeg = Boolean(balken && !dauer && !balken.hidden && wurzel.hasAttribute("data-duration") && wurzel.matches(STEHEND));
      if (balken && balkenWeg) balken.hidden = true;
      if (balken && dauer) {
        balken.style.animationName = "nc-toast-progress";
        balken.style.animationDuration = `${dauer}ms`;
        balken.style.animationTimingFunction = "linear";
        balken.style.animationFillMode = "forwards";
      }
      if (wurzel.classList.contains("is-entering")) {
        ausblenden(wurzel, "is-entering", () => wurzel.classList.remove("is-entering"));
      }
      wurzel.addEventListener("click", (e) => {
        const ziel = (
          /** @type {HTMLElement} */
          e.target
        );
        if (ziel.closest(".nc-toast__close")) {
          schliesse("close");
          return;
        }
        const aktion = (
          /** @type {HTMLElement|null} */
          ziel.closest(".nc-toast__action")
        );
        if (aktion) {
          sende(wurzel, "toast-action", { action: aktionsWert(aktion) });
          schliesse("action");
        }
      }, { signal: sig });
      wurzel.addEventListener("mouseenter", () => halte("maus", true), { signal: sig });
      wurzel.addEventListener("mouseleave", () => halte("maus", false), { signal: sig });
      wurzel.addEventListener("focusin", () => halte("fokus", true), { signal: sig });
      wurzel.addEventListener("focusout", (e) => {
        const nach = (
          /** @type {Node|null} */
          e.relatedTarget
        );
        if (!nach || !wurzel.contains(nach)) halte("fokus", false);
      }, { signal: sig });
      dok.addEventListener("visibilitychange", () => halte("verborgen", dok.visibilityState === "hidden"), { signal: sig });
      dok.addEventListener("keydown", (e) => {
        if (e.key !== "Escape" || zu || e.defaultPrevented) return;
        const aktiv = dok.activeElement;
        const mitFokus = [...OFFEN].find((t) => t.contains(aktiv));
        if (!mitFokus && dok.querySelector("dialog[open]")) return;
        const neuester = [...OFFEN].filter((t) => t.ownerDocument === dok && t.isConnected).at(-1);
        if ((mitFokus || neuester) !== wurzel) return;
        e.preventDefault();
        schliesse("escape");
      }, { signal: sig });
      let wisch = (
        /** @type {{ id: number, x: number, dx: number }|null} */
        null
      );
      const schwelle = () => parseFloat(token(wurzel, "--nc-toast-swipe-threshold")) || 100;
      const wischEnde = () => {
        wurzel.classList.remove("is-swiping");
        wurzel.removeAttribute("aria-busy");
        wurzel.style.removeProperty("--_toast-swipe-opacity");
      };
      wurzel.addEventListener("pointerdown", (e) => {
        if (zu || e.pointerType !== "touch" && e.pointerType !== "pen") return;
        if (
          /** @type {HTMLElement} */
          e.target.closest("button, a, input, select, textarea")
        ) return;
        wisch = { id: e.pointerId, x: e.clientX, dx: 0 };
      }, { signal: sig });
      wurzel.addEventListener("pointermove", (e) => {
        if (!wisch || e.pointerId !== wisch.id) return;
        wisch.dx = e.clientX - wisch.x;
        if (!wurzel.classList.contains("is-swiping")) {
          if (Math.abs(wisch.dx) < 5) return;
          wurzel.classList.add("is-swiping");
          wurzel.setAttribute("aria-busy", "true");
          halte("wischen", true);
        }
        wurzel.style.setProperty("--_toast-swipe-x", `${wisch.dx}px`);
        wurzel.style.setProperty("--_toast-swipe-opacity", String(Math.max(0.2, 1 - Math.abs(wisch.dx) / (schwelle() * 2))));
      }, { signal: sig });
      const loslassen = (e) => {
        if (!wisch || e.pointerId !== wisch.id) return;
        const { dx } = wisch;
        wisch = null;
        if (!wurzel.classList.contains("is-swiping")) return;
        wischEnde();
        if (Math.abs(dx) >= schwelle() && e.type === "pointerup") {
          zu = true;
          pausiere();
          OFFEN.delete(wurzel);
          wurzel.style.setProperty("--_toast-swipe-x", `${Math.sign(dx) * 120}%`);
          sende(wurzel, "toast-dismiss", { reason: "swipe" });
          fokusWeiter(wurzel);
          wurzel.classList.add("is-swipe-out");
          const weg = () => {
            if (wurzel.isConnected) wurzel.remove();
            intern.abort();
          };
          wurzel.addEventListener("transitionend", weg, { once: true });
          setTimeout(weg, 250);
          return;
        }
        wurzel.style.removeProperty("--_toast-swipe-x");
        halte("wischen", false);
      };
      wurzel.addEventListener("pointerup", loslassen, { signal: sig });
      wurzel.addEventListener("pointercancel", loslassen, { signal: sig });
      const toaster = ((_a = wurzel.parentElement) == null ? void 0 : _a.classList.contains("nc-toaster")) ? wurzel.parentElement : null;
      if (toaster) {
        const hoechstens = parseInt(token(toaster, "--nc-toast-max-visible"), 10) || 3;
        const offene = [...toaster.children].filter((k) => OFFEN.has(k));
        for (const alt of offene.slice(0, Math.max(0, offene.length - hoechstens))) {
          alt.dispatchEvent(new CustomEvent("neo-toast-queue"));
        }
      }
      wurzel.addEventListener("neo-toast-queue", () => schliesse("queue"), { signal: sig });
      laufe();
      sig.addEventListener("abort", () => {
        clearTimeout(uhr);
        OFFEN.delete(wurzel);
        if (zu) return;
        wischEnde();
        wurzel.style.removeProperty("--_toast-swipe-x");
        if (balken) {
          if (balkenWeg) balken.hidden = false;
          for (const p of ["animation-name", "animation-duration", "animation-timing-function", "animation-fill-mode", "animation-play-state"]) balken.style.removeProperty(p);
        }
      });
    }
  };

  // packages/neo-behaviors/notification.js
  var PRAEFIX = /^\s*Ungelesen:\s*/i;
  var notification = {
    id: "notification",
    selektor: ".nc-notification",
    /** @param {HTMLElement} wurzel @param {AbortSignal} signal */
    binde(wurzel, signal) {
      let zu = false;
      const gelesen = () => {
        var _a;
        if (!wurzel.classList.contains("nc-notification--unread")) return;
        wurzel.classList.remove("nc-notification--unread");
        (_a = wurzel.querySelector(".nc-notification__unread")) == null ? void 0 : _a.remove();
        const name = wurzel.getAttribute("aria-label");
        if (name && PRAEFIX.test(name)) wurzel.setAttribute("aria-label", name.replace(PRAEFIX, ""));
        sende(wurzel, "notification-read");
      };
      wurzel.addEventListener("click", (e) => {
        const knopf = (
          /** @type {HTMLElement} */
          e.target.closest(".nc-notification__close")
        );
        if (!knopf) {
          gelesen();
          return;
        }
        if (zu || wurzel.classList.contains("nc-notification--permanent")) return;
        zu = true;
        sende(wurzel, "notification-dismiss", { reason: "close" });
        fokusWeiter(wurzel);
        merkeHoehe(wurzel, "--_notification-height");
        ausblenden(wurzel, "is-dismissing", () => wurzel.remove());
      }, { signal });
    }
  };

  // packages/neo-behaviors/alert.js
  var alert = {
    id: "alert",
    selektor: ".nc-alert",
    /** @param {HTMLElement} wurzel @param {AbortSignal} signal */
    binde(wurzel, signal) {
      wurzel.addEventListener("click", (e) => {
        const knopf = (
          /** @type {HTMLElement} */
          e.target.closest(".nc-alert__close")
        );
        if (!knopf || knopf.closest(".nc-alert") !== wurzel) return;
        sende(wurzel, "alert-dismiss", { reason: "close" });
        fokusWeiter(wurzel);
        wurzel.remove();
      }, { signal });
    }
  };

  // packages/neo-behaviors/banner.js
  var SCHLUESSEL = (id) => `neo-banner:${id}`;
  function speicher(dok) {
    var _a;
    try {
      return ((_a = dok.defaultView) == null ? void 0 : _a.localStorage) || null;
    } catch {
      return null;
    }
  }
  var banner = {
    id: "banner",
    selektor: ".nc-banner",
    /** @param {HTMLElement} wurzel @param {AbortSignal} signal */
    binde(wurzel, signal) {
      var _a, _b;
      const dok = wurzel.ownerDocument;
      const id = wurzel.getAttribute("data-banner-id");
      const ablage = id ? speicher(dok) : null;
      try {
        if (ablage && ablage.getItem(SCHLUESSEL(id)) === "geschlossen") {
          wurzel.hidden = true;
          return;
        }
      } catch {
      }
      const eltern = wurzel.matches(".nc-banner--fixed") ? wurzel.parentElement : null;
      const vorher = eltern ? eltern.style.paddingBlockStart : "";
      const basis = eltern ? ((_a = dok.defaultView) == null ? void 0 : _a.getComputedStyle(eltern).paddingBlockStart) || "0px" : "0px";
      const setzePlatz = () => {
        if (eltern) eltern.style.paddingBlockStart = `calc(${basis} + ${Math.ceil(wurzel.getBoundingClientRect().height)}px)`;
      };
      const gibPlatzFrei = () => {
        if (eltern) eltern.style.paddingBlockStart = vorher;
      };
      let beobachter = (
        /** @type {ResizeObserver|null} */
        null
      );
      if (eltern) {
        setzePlatz();
        const RO = (_b = dok.defaultView) == null ? void 0 : _b.ResizeObserver;
        if (RO) {
          beobachter = new RO(setzePlatz);
          beobachter.observe(wurzel);
        }
      }
      let zu = false;
      wurzel.addEventListener("click", (e) => {
        const knopf = (
          /** @type {HTMLElement} */
          e.target.closest(".nc-banner__close")
        );
        if (!knopf || zu) return;
        zu = true;
        try {
          if (ablage) ablage.setItem(SCHLUESSEL(id), "geschlossen");
        } catch {
        }
        sende(wurzel, "banner-dismiss", { reason: "close", id });
        fokusWeiter(wurzel);
        merkeHoehe(wurzel, "--_banner-height");
        beobachter == null ? void 0 : beobachter.disconnect();
        ausblenden(wurzel, "is-dismissing", () => {
          gibPlatzFrei();
          wurzel.remove();
        });
      }, { signal });
      signal.addEventListener("abort", () => {
        beobachter == null ? void 0 : beobachter.disconnect();
        if (!zu) gibPlatzFrei();
      });
    }
  };

  // packages/neo-behaviors/code-snippet.js
  var DAUER = 2e3;
  var NAME = "Code kopieren";
  async function inZwischenablage(text, doc) {
    var _a, _b;
    try {
      const ablage = (_b = (_a = doc.defaultView) == null ? void 0 : _a.navigator) == null ? void 0 : _b.clipboard;
      if (ablage == null ? void 0 : ablage.writeText) {
        await ablage.writeText(text);
        return true;
      }
    } catch {
    }
    try {
      const feld = doc.createElement("textarea");
      feld.value = text;
      feld.setAttribute("readonly", "");
      feld.style.position = "fixed";
      feld.style.opacity = "0";
      doc.body.append(feld);
      feld.select();
      const ok = typeof doc.execCommand === "function" && doc.execCommand("copy");
      feld.remove();
      return !!ok;
    } catch {
      return false;
    }
  }
  var codeSnippet = {
    id: "code-snippet",
    selektor: ".nc-code-snippet:not(.nc-code-snippet--inline)",
    /** @param {HTMLElement} wurzel @param {AbortSignal} signal */
    binde(wurzel, signal) {
      const eigen = (el) => !!el && el.closest(".nc-code-snippet") === wurzel;
      let zeit = (
        /** @type {ReturnType<typeof setTimeout>|undefined} */
        void 0
      );
      signal.addEventListener("abort", () => clearTimeout(zeit));
      wurzel.addEventListener("click", async (e) => {
        const ziel = (
          /** @type {HTMLElement} */
          e.target
        );
        const kopieren = (
          /** @type {HTMLElement|null} */
          ziel.closest(".nc-code-snippet__copy")
        );
        if (kopieren && eigen(kopieren)) {
          const code = wurzel.querySelector(".nc-code-snippet__code");
          const ok = await inZwischenablage((code == null ? void 0 : code.textContent) || "", wurzel.ownerDocument);
          if (signal.aborted) return;
          if (ok) {
            clearTimeout(zeit);
            kopieren.classList.add("nc-code-snippet__copy--success");
            kopieren.setAttribute("aria-label", "Kopiert!");
            zeit = setTimeout(() => {
              kopieren.classList.remove("nc-code-snippet__copy--success");
              kopieren.setAttribute("aria-label", NAME);
            }, DAUER);
          }
          sende(wurzel, "code-snippet-copy", { ok });
          return;
        }
        const mehr2 = (
          /** @type {HTMLElement|null} */
          ziel.closest(".nc-code-snippet__show-more")
        );
        if (mehr2 && eigen(mehr2)) {
          const offen = wurzel.classList.toggle("nc-code-snippet--expanded");
          mehr2.setAttribute("aria-expanded", String(offen));
          const text = mehr2.querySelector(".nc-code-snippet__show-more-label");
          if (text) text.textContent = offen ? "Weniger anzeigen" : "Mehr anzeigen";
          sende(wurzel, "code-snippet-toggle", { expanded: offen });
        }
      }, { signal });
      const mehr = (
        /** @type {HTMLElement|null} */
        wurzel.querySelector(":scope > .nc-code-snippet__show-more")
      );
      const pre = (
        /** @type {HTMLElement|null} */
        wurzel.querySelector(":scope > .nc-code-snippet__pre")
      );
      if (mehr && pre && pre.scrollHeight > 0) {
        const sicht = wurzel.ownerDocument.defaultView;
        const max = parseFloat((sicht == null ? void 0 : sicht.getComputedStyle(wurzel).getPropertyValue("--nc-cs-multi-max-height")) || "") || 240;
        if (pre.scrollHeight <= max && !wurzel.classList.contains("nc-code-snippet--expanded")) {
          mehr.hidden = true;
          signal.addEventListener("abort", () => {
            mehr.hidden = false;
          });
        }
      }
    }
  };

  // packages/neo-behaviors/button.js
  var button = {
    id: "button",
    selektor: ".nc-button--toggle",
    binde(knopf, signal) {
      knopf.addEventListener("click", () => {
        if (gesperrt(knopf)) return;
        const gedrueckt = knopf.getAttribute("aria-pressed") !== "true";
        knopf.setAttribute("aria-pressed", String(gedrueckt));
        sende(knopf, "button-toggle", { pressed: gedrueckt, value: wertVon(knopf) });
      }, { signal });
    }
  };

  // packages/neo-behaviors/shell.js
  var SEITEN = (
    /** @type {const} */
    ["left", "right"]
  );
  var OFFEN2 = (seite) => `nc-shell--sidebar-${seite}-drawer-open`;
  var SICHTBAR = "nc-shell__sidebar-overlay--visible";
  var shell = {
    id: "shell",
    selektor: ".nc-shell",
    binde(wurzel, signal) {
      const dok = wurzel.ownerDocument;
      const ansicht = dok.defaultView;
      const leiste = (seite) => (
        /** @type {HTMLElement|null} */
        wurzel.querySelector(`.nc-shell__sidebar-${seite}`)
      );
      const seiteVon = (el) => SEITEN.find((s) => leiste(s) === el) || null;
      const istMobil = (el) => (ansicht == null ? void 0 : ansicht.getComputedStyle(el).position) === "fixed";
      let overlay = (
        /** @type {HTMLElement|null} */
        wurzel.querySelector(":scope > .nc-shell__sidebar-overlay")
      );
      let eigenesOverlay = false;
      const holeOverlay = () => {
        if (overlay) return overlay;
        overlay = dok.createElement("div");
        overlay.className = "nc-shell__sidebar-overlay";
        overlay.setAttribute("aria-hidden", "true");
        wurzel.append(overlay);
        eigenesOverlay = true;
        overlay.addEventListener("click", () => {
          if (offen) schliesse("overlay-click");
        }, { signal });
        return overlay;
      };
      let offen = null;
      const vonUnsInert = (
        /** @type {Set<Element>} */
        /* @__PURE__ */ new Set()
      );
      const sperreRest = (panel) => {
        for (let el = (
          /** @type {Element} */
          panel
        ); el.parentElement && el !== dok.body; el = el.parentElement) {
          for (const g2 of el.parentElement.children) {
            if (g2 === el || g2 === overlay || g2.hasAttribute("inert")) continue;
            g2.setAttribute("inert", "");
            vonUnsInert.add(g2);
          }
        }
      };
      const gibRestFrei = () => {
        for (const g2 of vonUnsInert) g2.removeAttribute("inert");
        vonUnsInert.clear();
      };
      const knoepfeFuer = (panel) => panel.id ? (
        /** @type {HTMLElement[]} */
        [...dok.querySelectorAll(`[aria-controls="${CSS.escape(panel.id)}"]`)].filter((k) => !panel.contains(k))
      ) : [];
      function oeffne(seite, panel, knopf) {
        if (offen) schliesse("trigger", false);
        wurzel.classList.add(OFFEN2(seite));
        holeOverlay().classList.add(SICHTBAR);
        for (const k of knoepfeFuer(panel)) k.setAttribute("aria-expanded", "true");
        sperreRest(panel);
        const start = fokussierbare(panel)[0];
        const tabindex = !start && !panel.hasAttribute("tabindex");
        if (tabindex) panel.setAttribute("tabindex", "-1");
        offen = { seite, panel, knopf, tabindex };
        (start || panel).focus();
        sende(wurzel, "shell-drawer-toggle", { side: seite, open: true, reason: "trigger" });
      }
      function schliesse(grund, fokusZurueck = true) {
        if (!offen) return;
        const { seite, panel, knopf, tabindex } = offen;
        offen = null;
        wurzel.classList.remove(OFFEN2(seite));
        overlay == null ? void 0 : overlay.classList.remove(SICHTBAR);
        gibRestFrei();
        for (const k of knoepfeFuer(panel)) k.setAttribute("aria-expanded", "false");
        const fokusDrin = panel.contains(dok.activeElement);
        if (tabindex) panel.removeAttribute("tabindex");
        if (fokusZurueck && knopf && (fokusDrin || grund !== "trigger")) knopf.focus();
        sende(wurzel, "shell-drawer-toggle", { side: seite, open: false, reason: grund });
      }
      for (const seite of SEITEN) {
        const panel = leiste(seite);
        if (panel) for (const k of knoepfeFuer(panel)) k.setAttribute("aria-expanded", String(wurzel.classList.contains(OFFEN2(seite))));
      }
      dok.addEventListener("click", (e) => {
        var _a, _b;
        const knopf = (
          /** @type {HTMLElement|null} */
          /** @type {HTMLElement} */
          ((_b = (_a = e.target).closest) == null ? void 0 : _b.call(_a, "[aria-controls]")) || null
        );
        if (!knopf || gesperrt(knopf)) return;
        const panel = dok.getElementById(knopf.getAttribute("aria-controls") || "");
        const seite = panel && wurzel.contains(panel) ? seiteVon(panel) : null;
        if (!panel || !seite || panel.contains(knopf) || !istMobil(panel)) return;
        e.preventDefault();
        if ((offen == null ? void 0 : offen.panel) === panel) schliesse("trigger");
        else oeffne(seite, panel, knopf);
      }, { signal });
      overlay == null ? void 0 : overlay.addEventListener("click", () => {
        if (offen) schliesse("overlay-click");
      }, { signal });
      dok.addEventListener("keydown", (e) => {
        if (!offen) return;
        if (e.key === "Escape") {
          e.preventDefault();
          schliesse("escape");
        } else if (wurzel.isConnected) fokusFalle(e, offen.panel);
      }, { signal });
      ansicht == null ? void 0 : ansicht.addEventListener("resize", () => {
        if (offen && !istMobil(offen.panel)) schliesse("resize");
      }, { signal });
      signal.addEventListener("abort", () => {
        if (offen) {
          wurzel.classList.remove(OFFEN2(offen.seite));
          if (offen.tabindex) offen.panel.removeAttribute("tabindex");
          offen = null;
        }
        gibRestFrei();
        overlay == null ? void 0 : overlay.classList.remove(SICHTBAR);
        if (eigenesOverlay) {
          overlay == null ? void 0 : overlay.remove();
          overlay = null;
        }
      });
    }
  };

  // packages/neo-behaviors/index.js
  var BEHAVIORS = Object.freeze({
    tabs,
    accordion: akkordeon,
    select,
    search: suche,
    "segmented-control": segmentedControl,
    "toggle-group": toggleGroup,
    switch: schalter,
    // vor Toolbar/Gruppen: Umschaltknoepfe sind innere Bauteile
    button,
    rating,
    input: eingabe,
    "dropdown-menu": dropdownMenu,
    popover,
    tooltip,
    modal,
    drawer,
    "alert-dialog": alertDialog,
    breadcrumb,
    treeview,
    "navigation-menu": navigationMenu,
    toolbar,
    sidebar,
    "navigation-tab-mega": navigationTabMega,
    toast,
    notification,
    alert,
    banner,
    "code-snippet": codeSnippet,
    // zuletzt: die Shell ist das aeusserste Bauteil (Drawer der Mobil-Lage)
    shell
  });
  var MIT_VERHALTEN = Object.freeze(Object.keys(BEHAVIORS));
  function anbinden(bereich, nur) {
    return bindeAlle(bereich, waehle(nur));
  }
  function abbinden(bereich, nur) {
    loeseAlle(bereich, waehle(nur));
  }
  function waehle(nur) {
    return Object.keys(BEHAVIORS).filter((id) => !nur || nur.includes(id)).map((id) => BEHAVIORS[id]);
  }

  // packages/neo-behaviors/package.json
  var package_default = {
    name: "neo-behaviors",
    version: "0.8.0",
    private: true,
    description: "Verhalten der NEO-Bauteile (Tabs, Akkordeon, Select, Suche, Formular-Bauteile, Overlays, Navigation) — eine Quelle fuer Drupal, Doku und Theme-Konfigurator",
    type: "module",
    main: "index.js",
    exports: {
      ".": "./index.js"
    }
  };

  // packages/neo-behaviors/drupal.js
  var NeoBehaviors = Object.freeze({ anbinden, abbinden, BEHAVIORS, MIT_VERHALTEN, version: package_default.version });
  var g = (
    /** @type {any} */
    globalThis
  );
  g.NeoBehaviors = NeoBehaviors;
  if (g.Drupal && g.Drupal.behaviors) {
    g.Drupal.behaviors.neoBehaviors = {
      attach(context, settings) {
        const s = settings && settings.neoBehaviors || {};
        if (s.aus) return;
        anbinden(context || document, Array.isArray(s.nur) ? s.nur : void 0);
      },
      detach(context, settings, trigger) {
        if (trigger === "unload") abbinden(context || document);
      }
    };
  }
  var drupal_default = NeoBehaviors;
})();
