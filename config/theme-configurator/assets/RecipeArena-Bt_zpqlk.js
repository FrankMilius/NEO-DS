import{l as Y,H as X,I as Q,J as ee,K as te,L as ne,i as E,u as se,x as ae,f as O,a as le,o as f,c as b,F as x,r as S,e as k,t as m,d as y,p as re,b as B,n as ie}from"./index-CVXqdXN8.js";const C={active:"is-active",open:"is-open",expanded:"is-open",selected:"is-selected",pressed:"is-pressed",loading:"is-loading",disabled:"is-disabled"},D={error:"--error",invalid:"--error",disabled:"--disabled",dragging:"--dragging"},oe={disabled:{"aria-disabled":"true"},selected:{"aria-selected":"true"},pressed:{"aria-pressed":"true"},expanded:{"aria-expanded":"true"},open:{"data-state":"open"},loading:{"aria-busy":"true"},error:{"aria-invalid":"true"},invalid:{"aria-invalid":"true"},readonly:{"aria-readonly":"true"}},T=new Set(["hover","focus","focus-visible","focus-within","swiping"]),ce={default:"Standard",hover:"Hover",focus:"Fokus","focus-visible":"Fokus sichtbar",active:"Aktiv",disabled:"Deaktiviert",selected:"Ausgewählt",checked:"Angehakt",indeterminate:"Unbestimmt",open:"Geöffnet",expanded:"Aufgeklappt",loading:"Lädt",pressed:"Gedrückt",readonly:"Schreibgeschützt",error:"Fehler",visible:"Sichtbar",hidden:"Verborgen",filled:"Befüllt","not-empty":"Befüllt",scrolled:"Gescrollt",dismissing:"Schließt",dragging:"Ziehen",swiping:"Wischen",unread:"Ungelesen",skeleton:"Platzhalter","mobile-open":"Mobil geöffnet"};function F(t){return ce[t]||E(t)}function g(t){return String(t??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function L(t){if(!t||typeof t!="string")return{tag:null,klassen:[]};let e=t.split("|")[0].split(",")[0].trim();const n=e.split(/\s*[>+~\s]\s*/).filter(Boolean);e=n[n.length-1]||"",e=e.replace(/::?[\w-]+(\([^)]*\))?/g,"").replace(/\[[^\]]*\]/g,"");const s=e.match(/^[a-z][a-z0-9-]*/i),a=s?s[0].toLowerCase():null,l=(e.match(/\.[\w*-]+/g)||[]).map(o=>o.slice(1)).filter(o=>!o.includes("*"));return{tag:a,klassen:l}}function W(t){return String(t||"").trim().replace(/^\./,"")}function de(t){const e=Array.isArray(t)?t.map(s=>[s?.name||s?.id,s]):Object.entries(t||{}),n={};for(const[s,a]of e){if(!s||!a)continue;let l=a.values||{};if(Array.isArray(l)){const d={};for(const i of l)typeof i=="string"?d[i]={modifier:null,tokenGroups:[]}:i&&(i.value??i.id)!=null&&(d[i.value??i.id]=i);l=d}const o={};for(const[d,i]of Object.entries(l))o[d]={...i||{},modifier:i?.modifier?W(i.modifier):null,tokenGroups:Array.isArray(i?.tokenGroups)?i.tokenGroups:[]};n[s]={...a,values:o}}return n}function ue(t){if(Array.isArray(t))return{supported:t,precedence:t,rules:[]};const e=t||{};return{...e,supported:e.supported||["default"],precedence:e.precedence||e.supported||["default"],rules:(e.rules||[]).filter(n=>n&&typeof n=="object"&&n.state)}}function pe(t,e,n){const s=t.matrix?.axes||t.matrix||{},a={};for(const[o,d]of Object.entries(s)){if(o==="states")continue;const i=e[o];if(!i){n.push(`Specimen „${t.id}": Achse „${o}" fehlt im Recipe`);continue}if(d==="*"){a[o]="*";continue}const u=(Array.isArray(d)?d:[d]).map(String),p=u.filter(r=>r in i.values);for(const r of u)r in i.values||n.push(`Specimen „${t.id}": Wert „${r}" fehlt auf Achse „${o}"`);p.length&&(a[o]=p)}const l=Array.isArray(t.matrix?.states)&&t.matrix.states.length?t.matrix.states:["default"];return{...t,matrix:{axes:a,states:l}}}function _e(t){const e=Y(t),n=[],s=de(e.axes),a=ue(e.states),l=L(e.anatomy?.root?.element);let o=(e.styling?.baseClasses||[]).map(W).filter(Boolean);!o.length&&l.klassen.length&&(o=[l.klassen[0]],n.push("styling.baseClasses fehlt — aus anatomy.root.element abgeleitet"));const d=(Array.isArray(e.anatomy?.slots)?e.anatomy.slots:[]).filter(u=>u&&u.name).map(u=>{const p=L(u.element);return{name:u.name,tag:p.tag,klassen:p.klassen,optional:u.optional===!0||u.optional==null&&u.required===!1}});let i=(e.specimens||[]).map(u=>pe(u,s,n));return i.length||(n.push("keine Specimens — Standard-Specimen ergaenzt"),i=[{id:"standard",label:"Standard",matrix:{axes:{},states:["default"]},layout:"single",render:{}}]),{...e,api:t.api||e.api||null,axes:s,states:a,styling:{...e.styling||{},baseClasses:o,baseTokenGroups:Array.isArray(e.styling?.baseTokenGroups)?e.styling.baseTokenGroups:[],tokenGroups:e.styling?.tokenGroups&&!Array.isArray(e.styling.tokenGroups)?e.styling.tokenGroups:{}},specimens:i,arena:{rootTag:l.tag,slots:d,hinweise:n}}}function fe(t,e){const n=t.matrix?.axes||{};return Object.entries(n).filter(([s,a])=>(a==="*"?Object.keys(e.axes[s]?.values||{}).length:a.length)>1).map(([s])=>s)}function be(t,e){return X(t,e)}function he(t,e){return t.focusTokenGroups?.length?[...t.focusTokenGroups]:Q(t,e.axes,e.styling.baseTokenGroups,e.states.rules)}function ge(t){if(t===!0)return"true";if(t===!1)return"false";const e=String(t);return e.includes("|")?e.split("|")[0]:e}function q(t){return Object.entries(t).map(([e,n])=>n===""?` ${e}`:` ${e}="${g(n)}"`).join("")}function ve(t,e,n){const s=t.render?.label;if(typeof s=="string"&&s.trim()){const l=s.replace(/\{(\w+)\}/g,(o,d)=>d==="state"?F(e.states?.[0]||"default"):e.axisValues?.[d]??"").trim();if(l)return E(l)}return(n.meta?.component||"Bauteil").split("-").map(E).join(" ")}function ke(t,e,n,s){const a=n.styling.baseClasses[0]||s,l=ee(t,n),o=[...new Set(l.filter(Boolean))],d=te(t,n),i=t.resolvedState||{attributes:{},tokenGroups:[]},u=(t.states||["default"]).filter(_=>_!=="default"),p={};for(const _ of u)C[_]&&l.push(C[_]),D[_]&&l.push(a+D[_]),Object.assign(p,oe[_]||{}),T.has(_)&&(p["data-zustand"]=_);for(const[_,v]of Object.entries(i.attributes||{}))p[_.replace(/\?$/,"")]=ge(v);const r=u.includes("disabled")||"disabled"in p;delete p.disabled;const c={...d.slotConfig,...t.slotConfig||{}},h=n.arena?.slots||[],A=_=>{if(c[_]===!1)return!1;if(c[_])return!0;const v=h.find(P=>P.name===_);return v?!v.optional:!1},j=[...new Set([...ne(t,n),...i.tokenGroups||[]])],z=[...new Set(l.filter(Boolean))];return{id:s,uid:`${s}-${e.id}-${t.id||"standard"}`.replace(/[^\w-]+/g,"-"),zelle:t,specimen:e,recipe:n,root:a,klassen:z,klasse:z.join(" "),basisKlasse:o.join(" "),attribute:p,attrs:q(p),attrsOhne:(..._)=>q(Object.fromEntries(Object.entries(p).filter(([v])=>!_.includes(v)))),achsen:t.axisValues||{},wert:_=>t.axisValues?.[_],zustaende:u,hat:_=>u.includes(_),deaktiviert:r,slotConfig:c,slot:A,slotKlasse:_=>h.find(P=>P.name===_)?.klassen?.[0]||`${a}__${_}`,text:ve(e,t,n),renderHint:d.renderHint,elementHint:d.elementHint,templateId:d.templateId,tokenGroups:j,nurInteraktiv:u.filter(_=>T.has(_))}}const Z=new Set(["input","img","hr","br","source"]),me='<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 8v4l2.5 2.5"/></svg>',ye='<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>',$e='<svg viewBox="0 0 160 90" width="160" height="90" role="img" aria-label="Platzhalterbild"><rect width="160" height="90" fill="currentColor" opacity=".12"/><path d="M0 90 55 40l35 30 20-15 50 35z" fill="currentColor" opacity=".2"/></svg>',we={item:["list","group","menu","nav","items","grid","track"],trigger:["list"],option:["panel","list","menu"],link:["list","nav"],"nav-link":["nav"],cell:["row"],fill:["track"],thumb:["track"]},xe=new Set(["item","trigger","option","link","nav-link","cell","card"]);function I(t){const e=t.toLowerCase(),n=(...s)=>s.some(a=>e===a||e.endsWith("-"+a));return n("close","remove","clear","dismiss")?"schliessen":n("icon","arrow","caret","chevron","indicator","spinner","dot","marker","check")?"symbol":n("media","image","picture","thumbnail","img","poster","logo","avatar")?"bild":n("input","field")?"eingabe":n("trigger","action","cta","button","btn","toggle","prev","next","increment","decrement")?"knopf":n("link")?"link":n("separator","divider")?"trenner":n("backdrop","overlay","scrim","track","fill","thumb","progress","bar","mesh","canvas")?"leer":n("actions","footer-actions","cta-area")?"aktionen":n("title","heading","headline","name","kicker","eyebrow")?"titel":n("label","text","value","count","badge","tag","required","shortcut","date","role")?"kurztext":n("description","lead","subtext","hint","note","meta","body","content","answer","quote","error","message","caption","info","details","summary")?"text":"behaelter"}function je(t,e){switch(I(t.name)){case"schliessen":return ye;case"symbol":return me;case"bild":return $e;case"titel":return g(e.text);case"kurztext":return t.name.endsWith("count")?"3":t.name.endsWith("required")?"*":g(e.text);case"text":return"Kurzer Beispieltext für diese Fläche.";case"knopf":return g(e.text);case"link":return"Verweis";case"aktionen":return'<button class="nc-button nc-button--sm" type="button">Aktion</button>';default:return""}}function Se(t){if(t.tag)return t.tag;switch(I(t.name)){case"schliessen":case"knopf":return"button";case"link":return"a";case"eingabe":return"input";case"titel":return"strong";case"text":return"p";case"trenner":case"kurztext":case"symbol":return"span";default:return"div"}}function M(t,e,n,s){const a=e.length?` class="${e.join(" ")}"`:"";return Z.has(t)?`<${t}${a}${n}>`:`<${t}${a}${n}>${s}</${t}>`}const K="data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 16 9%22%3E%3Crect width=%2216%22 height=%229%22 fill=%22%23ccd%22/%3E%3C/svg%3E";function ze(t){const e=String(t.id||"");return/checkbox|switch/.test(e)?"checkbox":/radio/.test(e)?"radio":/range/.test(e)?"range":"text"}function U(t){const e=ze(t);let n=` type="${e}"`;return e==="text"?n+=` placeholder="${g(t.text)}"`:n+=` aria-label="${g(t.text)}"`,(e==="checkbox"||e==="radio")&&(t.hat("checked")||t.hat("selected"))&&(n+=" checked"),t.deaktiviert&&(n+=" disabled"),n}function Oe(t,e,n,s){const a=Se(t);let l="";a==="button"&&(l=' type="button"',I(t.name)==="schliessen"&&(l+=' aria-label="Schließen"')),a==="a"&&(l=' href="#" onclick="return false"'),a==="input"&&(l=U(e)),a==="img"&&(l=` alt="" src="${K}"`);let o=n.length?n.join(""):je(t,e);return s&&!n.length&&o===g(e.text)&&(o=`${g(e.text)} ${s}`),M(a,t.klassen,l,o)}const Me=new Set(["radiogroup","group","region","list","listbox","tablist","menu","toolbar"]);function Te(t){const e=t.recipe,n=(e.arena?.slots||[]).filter(r=>t.slot(r.name)&&(r.klassen.length||r.tag)),s=new Set(n.map(r=>r.name)),a=r=>{for(const h of we[r]||[])if(s.has(h))return h;const c=r.includes("-")?r.slice(0,r.lastIndexOf("-")):null;return c&&s.has(c)?c:null},l=new Map,o=[];for(const r of n){const c=a(r.name);c?(l.has(c)||l.set(c,[]),l.get(c).push(r)):o.push(r)}const d=(r,c=0,h=0)=>{const A=c>4?[]:(l.get(r.name)||[]).flatMap(j=>xe.has(j.name)?[1,2,3].map(z=>d(j,c+1,z)):[d(j,c+1,h)]);return Oe(r,t,A,h)};let i=e.api?.elements?.default?.element||e.arena?.rootTag||"div",u="";if(t.elementHint&&(Me.has(t.elementHint)?u+=` role="${t.elementHint}"`:/^[a-z][a-z0-9]*$/.test(t.elementHint)&&(i=t.elementHint)),i==="button"&&(u+=' type="button"'+(t.deaktiviert?" disabled":"")),i==="a"&&(u+=' href="#" onclick="return false"'),i==="input"&&(u+=U(t)),i==="img"&&(u+=` alt="" src="${K}"`),Z.has(i))return M(i,t.klassen,u+t.attrs,"");if(i==="select")return M("select",t.klassen,u+t.attrs+(t.deaktiviert?" disabled":""),`<option>${g(t.text)}</option>`);const p=o.map(r=>d(r)).join("")||g(t.text);return M(i,t.klassen,u+t.attrs,p)}function Ae(t,e,n,s,a){const l=ke(t,e,n,s);return a?{html:a(t,l),quelle:"vorlage",modell:l}:{html:Te(l),quelle:"heuristik",modell:l}}function Pe(t,e){const n=e.map(a=>t.axisValues?.[a]).filter(Boolean),s=(t.states||[]).filter(a=>a!=="default");for(const a of s)n.push(F(a)+(T.has(a)?" *":""));return n.length?n.join(" · "):"Standard"}function Ee(t,e,n,s){const a=fe(t,e),l=be(t,e).map(p=>{let r;try{r=Ae(p,t,e,n,s)}catch(c){r={html:`<div class="ra-fallback">Vorschau nicht darstellbar: ${g(c.message)}</div>`,quelle:"fehler",fehler:c.message,modell:{tokenGroups:[]}}}return{id:p.id||"standard",label:Pe(p,a),html:r.html,quelle:r.quelle,fehler:r.fehler,tokenGroups:r.modell.tokenGroups,axisValues:p.axisValues,nurInteraktiv:(p.states||[]).some(c=>T.has(c))}}),o=t.layoutConfig?.rowAxis;let d;if(o&&a.includes(o)){const p=new Map;for(const r of l){const c=r.axisValues?.[o]??"_";p.has(c)||p.set(c,{key:c,label:c,zellen:[]}),p.get(c).zellen.push(r)}d=[...p.values()]}else d=[{key:"_",label:null,zellen:l}];const i=String(e.meta?.layer||""),u=["block","stack","column","composition"].includes(t.layout)||i.includes("organism");return{id:t.id,label:t.label||t.id,description:t.description||"",tokenGroups:he(t,e),anordnung:u?"stapel":t.layout==="single"?"einzeln":"reihe",zeilen:d,zellenAnzahl:l.length,nurInteraktiv:l.some(p=>p.nurInteraktiv),achsen:Object.entries(t.matrix?.axes||{}).map(([p,r])=>({name:p,werte:r==="*"?"alle":r.join(", ")}))}}const Ie=(t,e)=>`
<div class="${e.klasse}"${e.attrs}>
<h2 class="nc-section-header__title">Jetzt laden — oder in zwei Minuten ansehen</h2>
<p class="nc-section-header__subtitle">Die neo app gibt es für iOS und Android. Der Zugang läuft über Ihre Organisation; einen Testzugang richten wir auf Anfrage ein.</p>
<p class="nc-app-store__note">iOS 16 und Android 10 oder neuer · Deutsch und Englisch</p>
</div>
`,Be=Object.freeze(Object.defineProperty({__proto__:null,default:Ie},Symbol.toStringTag,{value:"Module"})),$="data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 1600 900%22 width=%22320%22 height=%22180%22%3E%3Crect width=%221600%22 height=%22900%22 fill=%22%23c9ced6%22/%3E%3Cpath d=%22M0 900 560 400l360 300 200-150 480 350z%22 fill=%22%23aab1bc%22/%3E%3Ccircle cx=%221180%22 cy=%22250%22 r=%2290%22 fill=%22%23aab1bc%22/%3E%3C/svg%3E",w={kreis:'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/></svg>',info:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>',fehler:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>',schliessen:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>',pfeil:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>'},Ce=(t,e)=>`
<div class="${e.klasse}"${e.attrs}>
<img class="nc-aspect-ratio__content" src="${$}" alt="${g((e.wert("ratio")||"").replace("-",":"))} Beispiel">
</div>
`,De=Object.freeze(Object.defineProperty({__proto__:null,default:Ce},Symbol.toStringTag,{value:"Module"})),Le=(t,e)=>{const n=e.wert("decorator");if(n==="dot"||n==="pulse")return`<span class="${e.klasse}" aria-label="${g(e.text)}"${e.attrs}></span>`;const s=e.specimen.render?.counterValues?.[0],a=n==="counter"||n==="decorator"?s||"3":g(e.text);return`<span class="${e.klasse}"${e.attrs}>${e.slot("icon")?`<span class="nc-badge__icon">${w.kreis}</span>`:""}<span class="nc-badge__label">${a}</span></span>`},qe=Object.freeze(Object.defineProperty({__proto__:null,default:Le},Symbol.toStringTag,{value:"Module"})),Ge=(t,e)=>`
<div class="${e.klasse}" data-theme="dark"${e.attrs}>
<img class="nc-card-cta__media" src="${$}" alt="" loading="lazy" decoding="async">
<div class="nc-card-cta__overlay"></div>
<div class="nc-card-cta__content">
<h3 class="nc-card-cta__title">Flexibel skalierbar</h3>
<div class="nc-card-cta__actions">
<a href="#" onclick="return false" class="nc-button nc-button--primary" style="--nc-button-primary-bg: var(--fnd-color-always-light); --nc-button-primary-color: var(--fnd-color-always-dark);">Preise ansehen</a>
</div>
</div>
</div>
`,Ne=Object.freeze(Object.defineProperty({__proto__:null,default:Ge},Symbol.toStringTag,{value:"Module"})),G=["Kommunikation","Wissen","Events","Vernetzung","Anwendungen"],Ve=(t,e)=>{const n=e.wert("form")||"leiste";return n==="verzeichnis"?`
<nav class="${e.klasse}" aria-label="Kapitel dieser Seite"${e.attrs}>
<ol class="nc-chapter-toc__list">
${G.map(s=>`<li><a class="nc-chapter-nav__link" href="#" onclick="return false">${s}</a></li>`).join(`
`)}
</ol>
</nav>`:n==="keine"?`<div class="${e.klasse}"${e.attrs}><span class="nc-chapter-anchor" id="${e.uid}-anker">Sprungziel ohne sichtbare Navigation</span></div>`:`
<nav class="${e.klasse}" aria-label="Kapitel dieser Seite"${e.attrs}>
<div class="nc-container nc-chapter-nav__inner">
${G.map((s,a)=>`<a class="nc-chapter-nav__link" href="#" onclick="return false"${a===0?' aria-current="true"':""}>${s}</a>`).join(`
`)}
</div>
</nav>`},He=Object.freeze(Object.defineProperty({__proto__:null,default:Ve},Symbol.toStringTag,{value:"Module"})),Re=[["design","Design"],["development","Development",!0],["marketing","Marketing"]],Fe=(t,e)=>{const n=e.deaktiviert?" disabled":"",s=e.slot("header")?`<div class="nc-checkbox-group__header" id="${e.uid}-label">Interessen</div>`:"",a=e.slot("hint")||e.hat("error")?`<p class="nc-checkbox-group__hint">${e.hat("error")?"Bitte mindestens eine Option wählen.":"Mehrfachauswahl möglich."}</p>`:"",l=s?` aria-labelledby="${e.uid}-label"`:' aria-label="Interessen"';return`
<div class="${e.klasse}" role="group"${l}${e.attrs}>
${s}
${Re.map(([o,d,i])=>`<label class="nc-checkbox">
<input class="nc-checkbox__input" type="checkbox" name="${e.uid}" value="${o}"${i?" checked":""}${n}>
<span class="nc-checkbox__control"></span>
<span class="nc-checkbox__label">${d}</span>
</label>`).join(`
`)}
${a}
</div>`},We=Object.freeze(Object.defineProperty({__proto__:null,default:Fe},Symbol.toStringTag,{value:"Module"})),N='<svg class="nc-tbl-icon nc-tbl-icon--check" width="32" height="32" viewBox="0 0 36 36" fill="none" aria-label="enthalten"><circle cx="18" cy="18" r="18"></circle><path d="M12 18L16 22L24 14" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>',Ze='<span class="nc-compare-table__sort-icon" aria-hidden="true"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m7 15 5 5 5-5M7 9l5-5 5 5"/></svg></span>',Ke=[["News, Newskanäle",!0,!0,"12"],["Inhalts- und Wissensseiten",!0,!0,"48"],["Veranstaltungskalender &amp; Event-Seiten",!1,!0,"1.250"]],Ue=(t,e)=>{const n=e.wert("selection")==="checkbox",s=e.wert("sorting")==="sortable",a=n?'<th scope="col"><input class="nc-compare-table__checkbox" type="checkbox" aria-label="Alle auswählen"></th>':"",l=o=>`<th scope="col"${s?' aria-sort="none"':""}>${o}${s?Ze:""}</th>`;return`
<div class="${e.basisKlasse}"${e.attrsOhne("aria-selected")}>
<table>
<thead>
<tr>${a}${l("Funktion")}${l("Standard")}${l("Premium")}<th scope="col" class="nc-compare-table__numeric">Nutzer</th></tr>
</thead>
<tbody>
<tr class="nc-compare-table__section-row"><th scope="rowgroup" colspan="${n?5:4}"><div class="nc-tbl-cell"><p class="nc-tbl-cell__text">FÜR MITARBEITENDE / ENDNUTZER</p></div></th></tr>
${Ke.map(([o,d,i,u],p)=>{const r=n&&p===0&&e.hat("selected");return`<tr${r?' class="is-selected" aria-selected="true"':""}>
${n?`<td><input class="nc-compare-table__checkbox" type="checkbox" aria-label="Zeile auswählen"${r?" checked":""}></td>`:""}
<th scope="row"><div class="nc-tbl-cell"><p class="nc-tbl-cell__text">${o}</p></div></th>
<td><div class="nc-tbl-cell${d?" nc-tbl-cell--icon":""}">${d?N:""}</div></td>
<td><div class="nc-tbl-cell${i?" nc-tbl-cell--icon":""}">${i?N:""}</div></td>
<td class="nc-compare-table__numeric">${u}</td>
</tr>`}).join(`
`)}
</tbody>
</table>
</div>`},Je=Object.freeze(Object.defineProperty({__proto__:null,default:Ue},Symbol.toStringTag,{value:"Module"})),Ye=(t,e)=>`
<div class="${e.klasse}"${e.attrs}>
<div class="nc-cta__left">
<h2 class="nc-section-title">Jetzt starten</h2>
<p class="nc-lead">Die vollständige Lösung für Ihr digitales Business.</p>
</div>
<div class="nc-cta__mid">
<div class="nc-newsletter-cta">
<p style="color: var(--fnd-color-always-light); font-weight: var(--fnd-font-weight-semibold);">Updates per E-Mail</p>
<div class="nc-cta__form">
<input class="nc-input" type="email" placeholder="ihre@email.de" aria-label="E-Mail-Adresse">
<button class="nc-button nc-button--primary" type="button">Anmelden</button>
</div>
<p class="nc-cta__note" style="color: var(--fnd-color-always-light); font-size: 0.875rem;">Datenschutz gewährleistet.</p>
</div>
</div>
<div class="nc-cta__right">
<div class="nc-demo-cta">
<p class="nc-demo-cta__title" style="color: var(--fnd-color-always-light);">30 Minuten Beratung</p>
<p style="color: var(--fnd-color-always-light); opacity: 0.85; margin: 0;">Sprechen Sie direkt mit einem Experten.</p>
<div class="nc-demo-cta__form">
<button class="nc-button nc-button--outline" type="button" style="color: var(--fnd-color-always-light); border-color: var(--fnd-color-always-light);">Termin buchen</button>
</div>
</div>
</div>
</div>
`,Xe=Object.freeze(Object.defineProperty({__proto__:null,default:Ye},Symbol.toStringTag,{value:"Module"})),Qe=(t,e)=>`
<div class="${e.klasse}"${e.attrs}>
<div class="nc-device__screen">
<img src="${$}" alt="App-Ansicht" width="800" height="1740" loading="lazy" decoding="async">
</div>
</div>
`,et=Object.freeze(Object.defineProperty({__proto__:null,default:Qe},Symbol.toStringTag,{value:"Module"})),tt=(t,e)=>{if(e.wert("variant")==="with-label")return`<div class="nc-divider-label" data-recipe-wurzel="${e.root}" role="separator"${e.attrs}><span>oder</span></div>`;const n=e.wert("orientation")==="vertical";return`<hr class="${e.klasse}"${n?' aria-orientation="vertical"':""}${e.attrs}>`},nt=Object.freeze(Object.defineProperty({__proto__:null,default:tt},Symbol.toStringTag,{value:"Module"})),st=(t,e)=>`
<div class="${e.klasse}"${e.attrs}>
${e.slot("icon")?`<div class="nc-empty-state__icon" aria-hidden="true">
<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="10" cy="10" r="7"></circle><line x1="21" y1="21" x2="15" y2="15"></line></svg>
</div>`:""}
<h3 class="nc-empty-state__title">Keine Ergebnisse gefunden</h3>
${e.slot("description")?'<p class="nc-empty-state__description">Versuche es mit anderen Suchbegriffen oder passe deine Filter an.</p>':""}
${e.slot("actions")?`<div class="nc-empty-state__actions">
<button class="nc-button nc-button--sm" type="button">Filter zurücksetzen</button>
</div>`:""}
</div>
`,at=Object.freeze(Object.defineProperty({__proto__:null,default:st},Symbol.toStringTag,{value:"Module"})),lt=(t,e)=>`
<div class="${e.klasse}"${e.attrs}>
<details class="nc-faq__item" open>
<summary class="nc-faq__question">Dieser Eintrag ist vorgeöffnet</summary>
<p class="nc-faq__answer">Durch das <code>open</code>-Attribut am <code>&lt;details&gt;</code>-Element ist dieser Eintrag beim Laden der Seite bereits sichtbar.</p>
</details>
<details class="nc-faq__item"${e.hat("open")?" open":""}>
<summary class="nc-faq__question">Dieser Eintrag ist geschlossen</summary>
<p class="nc-faq__answer">Klicke auf die Frage, um die Antwort zu sehen.</p>
</details>
</div>
`,rt=Object.freeze(Object.defineProperty({__proto__:null,default:lt},Symbol.toStringTag,{value:"Module"})),it='<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>',ot='<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>',ct=[["Angebot_2026.pdf","1,2 MB",100],["Präsentation.pptx","8,4 MB",45]],dt=(t,e)=>{const n=e.slot("list")?`<ul class="nc-file-upload-list">
${ct.map(([s,a,l])=>`<li class="nc-file-upload-list__item">
<span class="nc-file-upload-list__icon">${ot}</span>
<span class="nc-file-upload-list__name">${s}</span>
<span class="nc-file-upload-list__size">${a}</span>
${e.slot("list-progress")?`<progress class="nc-file-upload-list__progress" max="100" value="${l}">${l} %</progress>`:""}
<button class="nc-file-upload-list__remove" type="button" aria-label="${s} entfernen">${w.schliessen}</button>
</li>`).join(`
`)}
</ul>`:"";return`
<div class="${e.klasse}" role="button" tabindex="${e.deaktiviert?"-1":"0"}"${e.attrs}>
<input class="nc-file-upload__input" type="file" multiple tabindex="-1"${e.deaktiviert?" disabled":""}>
<span class="nc-file-upload__icon">${it}</span>
<span class="nc-file-upload__text">${e.hat("dragging")?"Loslassen zum Hochladen":"Dateien hierher ziehen"}</span>
<span class="nc-file-upload__subtext">oder <span class="nc-file-upload__button">Dateien auswählen</span></span>
</div>
${n}`},ut=Object.freeze(Object.defineProperty({__proto__:null,default:dt},Symbol.toStringTag,{value:"Module"})),pt=(t,e)=>`
<div class="${e.klasse}"${e.attrs}>
${e.wert("alignment")==="spread"?`<button type="button" class="nc-button nc-button--ghost">Zurück</button>
`:""}<button type="button" class="nc-button nc-button--primary">Speichern</button>
<button type="button" class="nc-button nc-button--secondary">Abbrechen</button>
</div>
`,_t=Object.freeze(Object.defineProperty({__proto__:null,default:pt},Symbol.toStringTag,{value:"Module"})),V={error:"Bitte geben Sie eine gültige E-Mail-Adresse ein.",warning:"Diese Adresse wird bereits verwendet.",success:"Die E-Mail-Adresse ist gültig."},ft=(t,e)=>`
<p class="${e.klasse}" role="${e.wert("severity")==="success"?"status":"alert"}" id="${e.uid}"${e.attrs}>
${e.slot("icon")?`<span class="nc-form-error__icon">${w.fehler}</span>`:""}
<span class="nc-form-error__text">${V[e.wert("severity")]||V.error}</span>
</p>
`,bt=Object.freeze(Object.defineProperty({__proto__:null,default:ft},Symbol.toStringTag,{value:"Module"})),ht=(t,e)=>e.wert("content")==="list"?`
<div class="${e.klasse}" id="${e.uid}"${e.attrs}>
<span class="nc-form-hint__text">Das Passwort braucht:</span>
<ul>
<li>mindestens 8 Zeichen</li>
<li>eine Ziffer</li>
<li>ein Sonderzeichen</li>
</ul>
</div>`:`
<p class="${e.klasse}" id="${e.uid}"${e.attrs}>
${e.slot("icon")?`<span class="nc-form-hint__icon">${w.info}</span>`:""}
<span class="nc-form-hint__text">Maximal 500 Zeichen.</span>
${e.slot("link")?'<a class="nc-form-hint__link" href="#" onclick="return false">Mehr erfahren</a>':""}
</p>`,gt=Object.freeze(Object.defineProperty({__proto__:null,default:ht},Symbol.toStringTag,{value:"Module"})),vt=(t,e)=>`
<label class="${e.klasse}" for="${e.uid}-feld"${e.attrs}>
<span class="nc-form-label__text">E-Mail</span>
${e.slot("required")?'<span class="nc-form-label__required" aria-hidden="true">*</span>':""}
${e.slot("optional")?'<span class="nc-form-label__optional">(optional)</span>':""}
${e.slot("info")?`<span class="nc-form-label__info" title="Wir nutzen die Adresse nur für Rückfragen.">${w.info}</span>`:""}
</label>
`,kt=Object.freeze(Object.defineProperty({__proto__:null,default:vt},Symbol.toStringTag,{value:"Module"})),mt=(t,e)=>{const n=e.slot("header")?`<div class="nc-form-section__header">
${e.slot("title")?'<h3 class="nc-form-section__title">Adresse</h3>':""}
${e.slot("description")?'<p class="nc-form-section__description">Ihre aktuelle Lieferadresse.</p>':""}
</div>`:"";return`
<div class="${e.klasse}"${e.attrs}>
${n}
<div class="nc-form-section__content">
<div class="nc-form-field">
<label class="nc-form-label" for="${e.uid}-strasse"><span class="nc-form-label__text">Straße</span></label>
<input class="nc-input" id="${e.uid}-strasse" type="text" placeholder="Musterstraße 1">
</div>
<div class="nc-form-field">
<label class="nc-form-label" for="${e.uid}-stadt"><span class="nc-form-label__text">Stadt</span></label>
<input class="nc-input" id="${e.uid}-stadt" type="text" placeholder="Berlin">
</div>
</div>
</div>`},yt=Object.freeze(Object.defineProperty({__proto__:null,default:mt},Symbol.toStringTag,{value:"Module"})),$t=(t,e)=>{const n=e.deaktiviert?" disabled":"";return`
<form class="${e.klasse}" novalidate onsubmit="return false"${e.attrs}>
<div class="nc-form-field nc-form-field--required">
<label class="nc-form-label" for="${e.uid}-org">
<span class="nc-form-label__text">Organisation</span>
<span class="nc-form-label__required" aria-hidden="true"> *</span>
</label>
<input class="nc-input" type="text" id="${e.uid}-org" placeholder="Ihr Unternehmen / Ihre Institution" required${n}>
</div>
<div class="nc-form-field">
<label class="nc-form-label" for="${e.uid}-mail">
<span class="nc-form-label__text">E-Mail</span>
<span class="nc-form-label__optional"> (optional)</span>
</label>
<input class="nc-input" type="email" id="${e.uid}-mail" placeholder="name@firma.de"${n}>
</div>
<div class="nc-form-field nc-form-field--required">
<label class="nc-form-label" for="${e.uid}-text">
<span class="nc-form-label__text">Worum geht es?</span>
<span class="nc-form-label__required" aria-hidden="true"> *</span>
</label>
<textarea class="nc-textarea" rows="3" id="${e.uid}-text" placeholder="Beschreiben Sie Ihr Vorhaben …" required${n}></textarea>
</div>
<div class="nc-form-block__submission nc-form-field--full-width">
<p class="nc-form-block__hint-text">Antwort in 48h · DSGVO-konform</p>
<button type="submit" class="nc-button nc-button--accent nc-button--lg nc-form-block__submit"${n}>Nachricht senden</button>
</div>
</form>`},wt=Object.freeze(Object.defineProperty({__proto__:null,default:$t},Symbol.toStringTag,{value:"Module"})),xt=(t,e)=>`
<section class="${e.klasse}"${e.attrs}>
<div class="nc-hero-tmob__content">
<div class="nc-hero-tmob__text">
<h2 class="nc-hero-tmob__headline nc-headline--display">Die Zukunft der Zusammenarbeit</h2>
<p class="nc-hero-tmob__subtext">PIIPE Workplace verbindet Teams, Projekte und Wissen in einer einzigen Plattform. Intuitiv, sicher und leistungsstark.</p>
</div>
<div class="nc-hero-tmob__media">
<img src="${$}" alt="Die Zukunft der Zusammenarbeit" decoding="async">
</div>
</div>
</section>
`,jt=Object.freeze(Object.defineProperty({__proto__:null,default:xt},Symbol.toStringTag,{value:"Module"})),St=(t,e)=>`
<section class="${e.klasse}" data-media-mode="expand"${e.attrs}>
<div class="nc-hero-tom__media" style="--tom-expand: 1;">
<img src="${$}" alt="" decoding="async">
<div class="nc-hero-tom__scrim"></div>
</div>
<div class="nc-hero-tom__content">
<div class="nc-hero-tom__copy">
<p class="nc-hero-tom__kicker">PIIPE Workplace</p>
<h2 class="nc-hero-tom__headline nc-headline--display">Und alles läuft einfach.</h2>
<div class="nc-hero-tom__subtext">
<p>PIIPE Workplace ist die leistungsstarke, benutzerfreundliche Plattform, die dein Team zum Team macht. Mit intuitiver Navigation. Automatischen Updates. Integrationen, die einfach funktionieren.</p>
</div>
</div>
</div>
</section>
`,zt=Object.freeze(Object.defineProperty({__proto__:null,default:St},Symbol.toStringTag,{value:"Module"})),Ot=(t,e)=>e.slot("separator")?`<span><kbd class="${e.klasse}"${e.attrs}>Strg</kbd><span class="nc-kbd__separator">+</span><kbd class="${e.klasse}">K</kbd></span>`:`<kbd class="${e.klasse}"${e.attrs}>A</kbd>`,Mt=Object.freeze(Object.defineProperty({__proto__:null,default:Ot},Symbol.toStringTag,{value:"Module"})),Tt=(t,e)=>`<a href="#" onclick="return false" class="${e.klasse}"${e.attrs}>Mehr erfahren ${w.pfeil}</a>`,At=Object.freeze(Object.defineProperty({__proto__:null,default:Tt},Symbol.toStringTag,{value:"Module"})),Pt=(t,e)=>`
<div class="${e.klasse}" aria-hidden="true"${e.attrs}>
<div class="nc-marquee__track">
<span class="nc-marquee__text">Kommunikation — Wissen — Events — Vernetzung — Anwendungen — </span>
<span class="nc-marquee__text">Kommunikation — Wissen — Events — Vernetzung — Anwendungen — </span>
</div>
</div>
`,Et=Object.freeze(Object.defineProperty({__proto__:null,default:Pt},Symbol.toStringTag,{value:"Module"})),It='<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg>',Bt=(t,e)=>{const n=`<span class="${e.klasse}"${e.attrs}>${It}</span>`;switch(e.wert("element")){case"label":return`<span class="nc-nav__link">${n}<span class="nc-nav__label">Startseite</span></span>`;case"badge":return`<span class="nc-nav__link">${n}<span class="nc-nav__badge" aria-label="3 neue Einträge">3</span></span>`;default:return n}},Ct=Object.freeze(Object.defineProperty({__proto__:null,default:Bt},Symbol.toStringTag,{value:"Module"})),H='<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"></polyline></svg>',Dt='<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',Lt=(t,e)=>{const n=e.hat("active")?' aria-current="page"':"";switch(e.wert("element")){case"toggle":return`<button class="nc-nav__toggle ${e.klasse}" type="button" aria-expanded="false" aria-haspopup="true"${e.attrs}>
<span class="nc-nav__label">Produkte</span>${H}
</button>`;case"mobile":return`<div class="nc-nav__item"><a class="${e.klasse}" href="#" onclick="return false"${e.attrs}>Menü</a>
<button class="nc-mobile-toggle" type="button" aria-expanded="false" aria-label="Menü öffnen">${Dt}</button></div>`;case"lang":return`<div class="nc-nav__item"><a class="${e.klasse}" href="#" onclick="return false"${e.attrs}>Sprache</a>
<button class="nc-lang-toggle" type="button" aria-label="Sprache wählen">DE ${H}</button></div>`;default:return`<a class="${e.klasse}" href="#" onclick="return false"${n}${e.attrs}><span class="nc-nav__label">Produkte</span></a>`}},qt=Object.freeze(Object.defineProperty({__proto__:null,default:Lt},Symbol.toStringTag,{value:"Module"})),Gt=(t,e)=>{const n=e.hat("filled")?["7","3","9","1","4","2"]:["7","3","","","",""],s=e.deaktiviert?" disabled":"",a=n.map((l,o)=>{const d=`<input class="nc-otp-input__cell${l?" nc-otp-input__cell--filled":""}" type="text" maxlength="1" inputmode="numeric" pattern="[0-9]*" aria-label="Stelle ${o+1}"${l?` value="${l}"`:""}${s}>`;return o===3&&e.slot("separator")?`<span class="nc-otp-input__separator" aria-hidden="true">–</span>${d}`:d});return`
<div class="${e.klasse}" role="group" aria-label="Bestätigungscode"${e.attrs}>
${a.join(`
`)}
</div>`},Nt=Object.freeze(Object.defineProperty({__proto__:null,default:Gt},Symbol.toStringTag,{value:"Module"})),Vt=(t,e)=>`
<div class="${e.klasse}"${e.attrs}>
<div class="nc-price">€ ${e.wert("variant")==="featured"?"12":"0"}</div>
<ul class="nc-pricing-features">
<li class="nc-pricing-features__item">Feature A</li>
<li class="nc-pricing-features__item">Feature B</li>
</ul>
</div>
`,Ht=Object.freeze(Object.defineProperty({__proto__:null,default:Vt},Symbol.toStringTag,{value:"Module"})),Rt=(t,e)=>{const n=e.wert("mode")==="indeterminate",s=n?"":' aria-valuenow="60" aria-valuemin="0" aria-valuemax="100"';return`
<div class="${e.klasse}" role="progressbar" aria-label="Fortschritt"${s}${e.attrs}>
<div class="nc-progress__fill"${n?"":' style="width: 60%"'}></div>
</div>`},Ft=Object.freeze(Object.defineProperty({__proto__:null,default:Rt},Symbol.toStringTag,{value:"Module"})),Wt=[["rot","Rot",!0],["gruen","Grün"],["blau","Blau"]],Zt=(t,e)=>{const n=e.deaktiviert?" disabled":"",s=e.slot("hint")||e.hat("error")?`<p class="nc-radio-group__hint">${e.hat("error")?"Bitte eine Farbe wählen.":"Eine Option ist Pflicht."}</p>`:"";return`
<div class="${e.klasse}" role="radiogroup" aria-label="Lieblingsfarbe"${e.attrs}>
${Wt.map(([a,l,o])=>`<label class="nc-radio">
<input type="radio" class="nc-radio__input" name="${e.uid}" value="${a}"${o?" checked":""}${n}>
<span class="nc-radio__control"></span>
<span class="nc-radio__label">${l}</span>
</label>`).join(`
`)}
${s}
</div>`},Kt=Object.freeze(Object.defineProperty({__proto__:null,default:Zt},Symbol.toStringTag,{value:"Module"})),Ut=(t,e)=>`
<ul class="${e.klasse}"${e.attrs}>
<li class="nc-security-list__item">Zwei-Faktor-Authentifizierung</li>
<li class="nc-security-list__item">Automatische Sicherheitsupdates</li>
<li class="nc-security-list__item">Penetrationstests durch Dritte</li>
</ul>
`,Jt=Object.freeze(Object.defineProperty({__proto__:null,default:Ut},Symbol.toStringTag,{value:"Module"})),Yt=(t,e)=>`<div class="${e.klasse}" aria-hidden="true"${e.attrs}></div>`,Xt=Object.freeze(Object.defineProperty({__proto__:null,default:Yt},Symbol.toStringTag,{value:"Module"})),Qt=(t,e)=>`<div class="${e.klasse}" role="status" aria-label="Wird geladen"${e.attrs}></div>`,en=Object.freeze(Object.defineProperty({__proto__:null,default:Qt},Symbol.toStringTag,{value:"Module"})),tn=(t,e)=>`<span class="${e.klasse}" role="img" aria-label="Status: ${g(e.wert("variant")||"neutral")}"${e.attrs}></span>`,nn=Object.freeze(Object.defineProperty({__proto__:null,default:tn},Symbol.toStringTag,{value:"Module"})),sn='<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"></line></svg>',an='<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>',ln=(t,e)=>{const n=e.deaktiviert?" disabled":"";return`
<div class="${e.klasse}" role="group" aria-label="Menge"${e.attrs}>
<button class="nc-stepper__decrement" type="button" aria-label="Wert verringern"${n}>${sn}</button>
<input class="nc-stepper__input" type="number" value="5" min="0" max="99" aria-label="Menge"${n}>
<button class="nc-stepper__increment" type="button" aria-label="Wert erhöhen"${n}>${an}</button>
</div>`},rn=Object.freeze(Object.defineProperty({__proto__:null,default:ln},Symbol.toStringTag,{value:"Module"})),on='<svg class="nc-tbl-icon nc-tbl-icon--check" width="32" height="32" viewBox="0 0 36 36" fill="none" aria-label="enthalten"><circle cx="18" cy="18" r="18"></circle><path d="M12 18L16 22L24 14" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>',cn=(t,e)=>e.wert("variante")==="icon"?`<div class="${e.klasse}"${e.attrs}>${on}</div>`:`
<div class="${e.klasse}"${e.attrs}>
<p class="nc-tbl-cell__text">On-Premise<button class="nc-tbl-cell__info-btn" type="button" aria-label="Mehr Informationen">${w.info}</button></p>
<p class="nc-tbl-cell__sub">Betrieb im eigenen Rechenzentrum</p>
</div>`,dn=Object.freeze(Object.defineProperty({__proto__:null,default:cn},Symbol.toStringTag,{value:"Module"})),un=(t,e)=>`
<blockquote class="${e.klasse}"${e.attrs}>
<p class="nc-testimonial__quote">„Exzellente Dokumentation und klare Muster.“</p>
<footer class="nc-testimonial__author">
<div class="nc-testimonial__meta">
<span class="nc-testimonial__name">Pia Weber</span>
<span class="nc-testimonial__role">Product Manager</span>
</div>
</footer>
</blockquote>
`,pn=Object.freeze(Object.defineProperty({__proto__:null,default:un},Symbol.toStringTag,{value:"Module"})),_n=(t,e)=>{switch(e.wert("variant")){case"eyebrow":return`<p class="nc-eyebrow" data-recipe-wurzel="${e.root}"${e.attrs}>Digital Workplace</p>`;case"lead":return`<p class="nc-lead" data-recipe-wurzel="${e.root}"${e.attrs}>Die vollständige Lösung für Ihr digitales Business.</p>`;default:return`<h2 class="${e.klasse}"${e.attrs}>Jetzt starten</h2>`}},fn=Object.freeze(Object.defineProperty({__proto__:null,default:_n},Symbol.toStringTag,{value:"Module"})),bn=(t,e)=>`
<div class="${e.klasse}"${e.attrs}>
<div class="nc-text-media__grid">
<div class="nc-text-media__media">
<img src="${$}" alt="" class="nc-text-media__image nc-media-frame" loading="lazy">
</div>
<div class="nc-text-media__content">
<div class="nc-section-header nc-section-header--flush">
<h2 class="nc-section-header__title">Verpasst? Jetzt als Aufzeichnung ansehen</h2>
<p class="nc-section-header__subtitle">Unser letztes Webinar „Intranet-Relaunch: Erfahrungsbericht Festo“ ist jetzt als Aufzeichnung verfügbar. Erfahren Sie, wie Festo 20.000 Mitarbeitende weltweit auf PIIPE Workplace migriert hat.</p>
</div>
<div class="nc-text-media__cta">
<a href="#" onclick="return false" class="nc-button nc-button--accent nc-button--lg"><span>Aufzeichnung ansehen</span></a>
</div>
</div>
</div>
</div>
`,hn=Object.freeze(Object.defineProperty({__proto__:null,default:bn},Symbol.toStringTag,{value:"Module"})),gn='<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>',R=["Vorname ist ein Pflichtfeld","E-Mail-Adresse ist ungültig","Passwort muss mindestens 8 Zeichen lang sein"],vn=(t,e)=>{const n=e.wert("content")==="with-links";return`
<div class="${e.klasse}" role="alert"${e.attrs}>
${e.slot("icon")?`<span class="nc-validation-summary__icon">${gn}</span>`:""}
<div>
<strong class="nc-validation-summary__title">Es sind ${R.length} Fehler aufgetreten:</strong>
<ul class="nc-validation-summary__list">
${R.map(s=>`<li class="nc-validation-summary__item">${n?`<a href="#" onclick="return false">${s}</a>`:s}</li>`).join(`
`)}
</ul>
</div>
</div>`},kn=Object.freeze(Object.defineProperty({__proto__:null,default:vn},Symbol.toStringTag,{value:"Module"})),mn=(t,e)=>`
<div class="${e.klasse}"${e.attrs}>
<div class="nc-video__media${e.hat("playing")?" is-playing":""}">
<img src="${$}" alt="Video-Vorschaubild">
<button class="nc-video__overlay" type="button" aria-label="Video abspielen">
<span class="nc-video__overlay-icon" aria-hidden="true"></span>
</button>
</div>
<div class="nc-video__content">
<h2 class="nc-video__title">So funktioniert unsere Plattform</h2>
<p class="nc-video__text">In diesem kurzen Video zeigen wir Ihnen, wie Sie in wenigen Minuten starten können und sofort produktiv werden.</p>
<button class="nc-button nc-button--primary" type="button">Jetzt kostenlos starten</button>
</div>
</div>
`,yn=Object.freeze(Object.defineProperty({__proto__:null,default:mn},Symbol.toStringTag,{value:"Module"})),$n=Object.assign({"./app-store.js":Be,"./aspect-ratio.js":De,"./badge.js":qe,"./card-cta.js":Ne,"./chapter-nav.js":He,"./checkbox-group.js":We,"./compare-table.js":Je,"./cta.js":Xe,"./device.js":et,"./divider.js":nt,"./empty-state.js":at,"./faq.js":rt,"./file-upload.js":ut,"./form-actions.js":_t,"./form-error.js":bt,"./form-hint.js":gt,"./form-label.js":kt,"./form-section.js":yt,"./form.js":wt,"./hero-tmob.js":jt,"./hero-tom.js":zt,"./kbd.js":Mt,"./link-with-arrow.js":At,"./marquee.js":Et,"./nav-atoms.js":Ct,"./nav-molecules.js":qt,"./otp-input.js":Nt,"./pricing.js":Ht,"./progress.js":Ft,"./radio-group.js":Kt,"./security-list.js":Jt,"./skeleton.js":Xt,"./spinner.js":en,"./status.js":nn,"./stepper.js":rn,"./tbl-cell.js":dn,"./testimonial.js":pn,"./text-blocks.js":fn,"./text-media.js":hn,"./validation-summary.js":kn,"./video-section.js":yn}),J={};for(const[t,e]of Object.entries($n)){const n=t.slice(2,-3);typeof e.default=="function"&&(J[n]=e.default)}function wn(t){return J[t]||null}const xn=["data-component-id"],jn={class:"arena-category-divider"},Sn={class:"arena-category-label"},zn=["data-specimen-id","data-token-groups"],On={key:0,class:"ra-desc"},Mn={key:0,class:"ra-axis-label"},Tn={class:"ra-cells"},An=["data-specimen-id","data-cell-id","data-token-groups","data-quelle"],Pn=["innerHTML"],En={class:"ra-cell-label"},In={key:1,class:"ra-hinweis"},Bn={key:2,class:"ra-axes"},Cn={key:3,class:"ra-tokens"},Ln={__name:"RecipeArena",props:{componentId:{type:String,required:!0}},setup(t){const e=t,n=se(),{recipe:s}=ae(O(()=>e.componentId)),{isHighlighted:a,highlightStyle:l}=le(e.componentId),o=O(()=>(n.state.previewMode==="split"?"light":n.state.previewMode)==="dark"?"neo-dark-theme":"neo-light-theme"),d=O(()=>s.value?_e(s.value):null),i=O(()=>{const u=d.value;if(!u)return[];const p=wn(e.componentId);return u.specimens.map(r=>Ee(r,u,e.componentId,p))});return(u,p)=>i.value.length?(f(),b("div",{key:0,class:"recipe-arena","data-component-id":t.componentId},[(f(!0),b(x,null,S(i.value,r=>(f(),b(x,{key:r.id},[k("div",jn,[k("span",Sn,m(r.label),1)]),k("div",{class:"arena-specimen ra-specimen","data-specimen-id":r.id,"data-token-groups":r.tokenGroups.join(",")},[r.description?(f(),b("p",On,m(r.description),1)):y("",!0),k("div",{class:re(["ra-preview",[o.value,`ra-preview--${r.anordnung}`]])},[(f(!0),b(x,null,S(r.zeilen,c=>(f(),b("div",{key:c.key,class:"ra-matrix-row"},[c.label?(f(),b("span",Mn,m(c.label),1)):y("",!0),k("div",Tn,[(f(!0),b(x,null,S(c.zellen,h=>(f(),b("figure",{key:h.id,class:"ra-cell","data-specimen-id":r.id,"data-cell-id":h.id,"data-token-groups":h.tokenGroups.join(","),"data-quelle":h.quelle},[k("div",{class:"ra-live-component",innerHTML:h.html},null,8,Pn),B(a)?(f(),b("div",{key:0,class:"ra-highlight",style:ie(B(l))},null,4)):y("",!0),k("figcaption",En,m(h.label),1)],8,An))),128))])]))),128))],2),r.nurInteraktiv?(f(),b("p",In," * Hover und Fokus kennt das Design System nur als Pseudoklasse — die Zelle zeigt den Ruhezustand. Zum Prüfen mit der Maus darüberfahren bzw. per Tab-Taste fokussieren. ")):y("",!0),r.achsen.length?(f(),b("div",Bn,[(f(!0),b(x,null,S(r.achsen,c=>(f(),b("span",{key:c.name,class:"ra-axis-pill"},m(c.name)+": "+m(c.werte),1))),128))])):y("",!0),r.tokenGroups.length?(f(),b("div",Cn,[(f(!0),b(x,null,S(r.tokenGroups,c=>(f(),b("span",{key:c,class:"ra-token-pill"},m(c),1))),128))])):y("",!0)],8,zn)],64))),128))],8,xn)):y("",!0)}};export{Ln as default};
