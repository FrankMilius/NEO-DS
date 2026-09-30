import{l as _e,H as pe,I as he,J as be,K as ve,L as fe,i as K,u as ge,x as ke,f as E,a as $e,o as f,c as g,F as x,r as A,e as w,t as S,d as j,p as me,b as F,n as ye}from"./index-DCo5Wpm-.js";const G={active:"is-active",open:"is-open",expanded:"is-open",selected:"is-selected",pressed:"is-pressed",loading:"is-loading",disabled:"is-disabled"},q={error:"--error",invalid:"--error",disabled:"--disabled",dragging:"--dragging"},we={disabled:{"aria-disabled":"true"},selected:{"aria-selected":"true"},pressed:{"aria-pressed":"true"},expanded:{"aria-expanded":"true"},open:{"data-state":"open"},loading:{"aria-busy":"true"},error:{"aria-invalid":"true"},invalid:{"aria-invalid":"true"},readonly:{"aria-readonly":"true"}},B=new Set(["hover","focus","focus-visible","focus-within","swiping"]),Se={default:"Standard",hover:"Hover",focus:"Fokus","focus-visible":"Fokus sichtbar",active:"Aktiv",disabled:"Deaktiviert",selected:"Ausgewählt",checked:"Angehakt",indeterminate:"Unbestimmt",open:"Geöffnet",expanded:"Aufgeklappt",loading:"Lädt",pressed:"Gedrückt",readonly:"Schreibgeschützt",error:"Fehler",visible:"Sichtbar",hidden:"Verborgen",filled:"Befüllt","not-empty":"Befüllt",scrolled:"Gescrollt",dismissing:"Schließt",dragging:"Ziehen",swiping:"Wischen",unread:"Ungelesen",skeleton:"Platzhalter","mobile-open":"Mobil geöffnet"};function re(t){return Se[t]||K(t)}function k(t){return String(t??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function V(t){if(!t||typeof t!="string")return{tag:null,klassen:[]};let e=t.split("|")[0].split(",")[0].trim();const n=e.split(/\s*[>+~\s]\s*/).filter(Boolean);e=n[n.length-1]||"",e=e.replace(/::?[\w-]+(\([^)]*\))?/g,"").replace(/\[[^\]]*\]/g,"");const a=e.match(/^[a-z][a-z0-9-]*/i),s=a?a[0].toLowerCase():null,r=(e.match(/\.[\w*-]+/g)||[]).map(o=>o.slice(1)).filter(o=>!o.includes("*"));return{tag:s,klassen:r}}function le(t){return String(t||"").trim().replace(/^\./,"")}function je(t){const e=Array.isArray(t)?t.map(a=>[a?.name||a?.id,a]):Object.entries(t||{}),n={};for(const[a,s]of e){if(!a||!s)continue;let r=s.values||{};if(Array.isArray(r)){const i={};for(const l of r)typeof l=="string"?i[l]={modifier:null,tokenGroups:[]}:l&&(l.value??l.id)!=null&&(i[l.value??l.id]=l);r=i}const o={};for(const[i,l]of Object.entries(r))o[i]={...l||{},modifier:l?.modifier?le(l.modifier):null,tokenGroups:Array.isArray(l?.tokenGroups)?l.tokenGroups:[]};n[a]={...s,values:o}}return n}function xe(t){if(Array.isArray(t))return{supported:t,precedence:t,rules:[]};const e=t||{};return{...e,supported:e.supported||["default"],precedence:e.precedence||e.supported||["default"],rules:(e.rules||[]).filter(n=>n&&typeof n=="object"&&n.state)}}function ze(t,e,n){const a=t.matrix?.axes||t.matrix||{},s={};for(const[o,i]of Object.entries(a)){if(o==="states")continue;const l=e[o];if(!l){n.push(`Specimen „${t.id}": Achse „${o}" fehlt im Recipe`);continue}if(i==="*"){s[o]="*";continue}const d=(Array.isArray(i)?i:[i]).map(String),_=d.filter(c=>c in l.values);for(const c of d)c in l.values||n.push(`Specimen „${t.id}": Wert „${c}" fehlt auf Achse „${o}"`);_.length&&(s[o]=_)}const r=Array.isArray(t.matrix?.states)&&t.matrix.states.length?t.matrix.states:["default"];return{...t,matrix:{axes:s,states:r}}}function Oe(t){const e=_e(t),n=[],a=je(e.axes),s=xe(e.states),r=V(e.anatomy?.root?.element);let o=(e.styling?.baseClasses||[]).map(le).filter(Boolean);!o.length&&r.klassen.length&&(o=[r.klassen[0]],n.push("styling.baseClasses fehlt — aus anatomy.root.element abgeleitet"));const i=(Array.isArray(e.anatomy?.slots)?e.anatomy.slots:[]).filter(d=>d&&d.name).map(d=>{const _=V(d.element);return{name:d.name,tag:_.tag,klassen:_.klassen,optional:d.optional===!0||d.optional==null&&d.required===!1}});let l=(e.specimens||[]).map(d=>ze(d,a,n));return l.length||(n.push("keine Specimens — Standard-Specimen ergaenzt"),l=[{id:"standard",label:"Standard",matrix:{axes:{},states:["default"]},layout:"single",render:{}}]),{...e,api:t.api||e.api||null,axes:a,states:s,styling:{...e.styling||{},baseClasses:o,baseTokenGroups:Array.isArray(e.styling?.baseTokenGroups)?e.styling.baseTokenGroups:[],tokenGroups:e.styling?.tokenGroups&&!Array.isArray(e.styling.tokenGroups)?e.styling.tokenGroups:{}},specimens:l,arena:{rootTag:r.tag,slots:i,hinweise:n}}}function Me(t,e){const n=t.matrix?.axes||{};return Object.entries(n).filter(([a,s])=>(s==="*"?Object.keys(e.axes[a]?.values||{}).length:s.length)>1).map(([a])=>a)}function Ae(t,e){return pe(t,e)}function Pe(t,e){return t.focusTokenGroups?.length?[...t.focusTokenGroups]:he(t,e.axes,e.styling.baseTokenGroups,e.states.rules)}function Ee(t){if(t===!0)return"true";if(t===!1)return"false";const e=String(t);return e.includes("|")?e.split("|")[0]:e}function H(t){return Object.entries(t).map(([e,n])=>n===""?` ${e}`:` ${e}="${k(n)}"`).join("")}function Te(t,e,n){const a=t.render?.label;if(typeof a=="string"&&a.trim()){const r=a.replace(/\{(\w+)\}/g,(o,i)=>i==="state"?re(e.states?.[0]||"default"):e.axisValues?.[i]??"").trim();if(r)return K(r)}return(n.meta?.component||"Bauteil").split("-").map(K).join(" ")}function Ie(t,e,n,a){const s=n.styling.baseClasses[0]||a,r=be(t,n),o=[...new Set(r.filter(Boolean))],i=ve(t,n),l=t.resolvedState||{attributes:{},tokenGroups:[]},d=(t.states||["default"]).filter(b=>b!=="default"),_={};for(const b of d)G[b]&&r.push(G[b]),q[b]&&r.push(s+q[b]),Object.assign(_,we[b]||{}),B.has(b)&&(_["data-zustand"]=b);for(const[b,y]of Object.entries(l.attributes||{}))_[b.replace(/\?$/,"")]=Ee(y);const c=d.includes("disabled")||"disabled"in _;delete _.disabled;const u={...i.slotConfig,...t.slotConfig||{}},h=n.arena?.slots||[],M=b=>{if(u[b]===!1)return!1;if(u[b])return!0;const y=h.find(N=>N.name===b);return y?!y.optional:!1},m=[...new Set([...fe(t,n),...l.tokenGroups||[]])],P=[...new Set(r.filter(Boolean))];return{id:a,uid:`${a}-${e.id}-${t.id||"standard"}`.replace(/[^\w-]+/g,"-"),zelle:t,specimen:e,recipe:n,root:s,klassen:P,klasse:P.join(" "),basisKlasse:o.join(" "),attribute:_,attrs:H(_),attrsOhne:(...b)=>H(Object.fromEntries(Object.entries(_).filter(([y])=>!b.includes(y)))),achsen:t.axisValues||{},wert:b=>t.axisValues?.[b],zustaende:d,hat:b=>d.includes(b),deaktiviert:c,slotConfig:u,slot:M,slotKlasse:b=>h.find(N=>N.name===b)?.klassen?.[0]||`${s}__${b}`,text:Te(e,t,n),renderHint:i.renderHint,elementHint:i.elementHint,templateId:i.templateId,tokenGroups:m,nurInteraktiv:d.filter(b=>B.has(b))}}const W=new Set(["input","img","hr","br","source"]),Be='<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 8v4l2.5 2.5"/></svg>',Ce='<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>',Ne='<svg viewBox="0 0 160 90" width="160" height="90" role="img" aria-label="Platzhalterbild"><rect width="160" height="90" fill="currentColor" opacity=".12"/><path d="M0 90 55 40l35 30 20-15 50 35z" fill="currentColor" opacity=".2"/></svg>',De={item:["list","group","menu","nav","items","grid","track"],trigger:["list"],option:["panel","list","menu"],link:["list","nav"],"nav-link":["nav"],cell:["row"],fill:["track"],thumb:["track"]},Le=new Set(["item","trigger","option","link","nav-link","cell","card"]);function C(t){const e=t.toLowerCase(),n=(...a)=>a.some(s=>e===s||e.endsWith("-"+s));return n("close","remove","clear","dismiss")?"schliessen":n("icon","arrow","caret","chevron","indicator","spinner","dot","marker","check")?"symbol":n("media","image","picture","thumbnail","img","poster","logo","avatar")?"bild":n("input","field")?"eingabe":n("trigger","action","cta","button","btn","toggle","prev","next","increment","decrement")?"knopf":n("link")?"link":n("separator","divider")?"trenner":n("backdrop","overlay","scrim","track","fill","thumb","progress","bar","mesh","canvas")?"leer":n("actions","footer-actions","cta-area")?"aktionen":n("title","heading","headline","name","kicker","eyebrow")?"titel":n("label","text","value","count","badge","tag","required","shortcut","date","role")?"kurztext":n("description","lead","subtext","hint","note","meta","body","content","answer","quote","error","message","caption","info","details","summary")?"text":"behaelter"}function Ke(t,e){switch(C(t.name)){case"schliessen":return Ce;case"symbol":return Be;case"bild":return Ne;case"titel":return k(e.text);case"kurztext":return t.name.endsWith("count")?"3":t.name.endsWith("required")?"*":k(e.text);case"text":return"Kurzer Beispieltext für diese Fläche.";case"knopf":return k(e.text);case"link":return"Verweis";case"aktionen":return'<button class="nc-button nc-button--sm" type="button">Aktion</button>';default:return""}}function We(t){if(t.tag)return t.tag;switch(C(t.name)){case"schliessen":case"knopf":return"button";case"link":return"a";case"eingabe":return"input";case"titel":return"strong";case"text":return"p";case"trenner":case"kurztext":case"symbol":return"span";default:return"div"}}function I(t,e,n,a){const s=e.length?` class="${e.join(" ")}"`:"";return W.has(t)?`<${t}${s}${n}>`:`<${t}${s}${n}>${a}</${t}>`}const ie="data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 16 9%22%3E%3Crect width=%2216%22 height=%229%22 fill=%22%23ccd%22/%3E%3C/svg%3E";function Fe(t){const e=String(t.id||"");return/checkbox|switch/.test(e)?"checkbox":/radio/.test(e)?"radio":/range/.test(e)?"range":"text"}function oe(t){const e=Fe(t);let n=` type="${e}"`;return e==="text"?n+=` placeholder="${k(t.text)}"`:n+=` aria-label="${k(t.text)}"`,(e==="checkbox"||e==="radio")&&(t.hat("checked")||t.hat("selected"))&&(n+=" checked"),t.deaktiviert&&(n+=" disabled"),n}function Ge(t){return`<span class="ra-slot-name" aria-hidden="true">${k(t)}</span>`}function qe(t,e,n,a){const s=We(t);let r="";s==="button"&&(r=' type="button"',C(t.name)==="schliessen"&&(r+=' aria-label="Schließen"')),s==="a"&&(r=' href="#" onclick="return false"'),s==="input"&&(r=oe(e)),s==="img"&&(r=` alt="" src="${ie}"`);let o=n.length?n.join(""):Ke(t,e);return a&&!n.length&&o===k(e.text)&&(o=`${k(e.text)} ${a}`),!o&&!n.length&&C(t.name)==="behaelter"&&!W.has(s)&&(o=Ge(t.name)),I(s,t.klassen,r,o)}const Ve=new Set(["radiogroup","group","region","list","listbox","tablist","menu","toolbar"]);function He(t){const e=t.recipe,n=(e.arena?.slots||[]).filter(c=>t.slot(c.name)&&(c.klassen.length||c.tag)),a=new Set(n.map(c=>c.name)),s=c=>{for(const h of De[c]||[])if(a.has(h))return h;const u=c.includes("-")?c.slice(0,c.lastIndexOf("-")):null;return u&&a.has(u)?u:null},r=new Map,o=[];for(const c of n){const u=s(c.name);u?(r.has(u)||r.set(u,[]),r.get(u).push(c)):o.push(c)}const i=(c,u=0,h=0)=>{const M=u>4?[]:(r.get(c.name)||[]).flatMap(m=>Le.has(m.name)?[1,2,3].map(P=>i(m,u+1,P)):[i(m,u+1,h)]);return qe(c,t,M,h)};let l=e.api?.elements?.default?.element||e.arena?.rootTag||"div",d="";if(t.elementHint&&(Ve.has(t.elementHint)?d+=` role="${t.elementHint}"`:/^[a-z][a-z0-9]*$/.test(t.elementHint)&&(l=t.elementHint)),l==="button"&&(d+=' type="button"'+(t.deaktiviert?" disabled":"")),l==="a"&&(d+=' href="#" onclick="return false"'),l==="input"&&(d+=oe(t)),l==="img"&&(d+=` alt="" src="${ie}"`),W.has(l))return I(l,t.klassen,d+t.attrs,"");if(l==="select")return I("select",t.klassen,d+t.attrs+(t.deaktiviert?" disabled":""),`<option>${k(t.text)}</option>`);const _=o.map(c=>i(c)).join("")||k(t.text);return I(l,t.klassen,d+t.attrs,_)}function Re(t,e,n,a,s){const r=Ie(t,e,n,a);return s?{html:s(t,r),quelle:"vorlage",modell:r}:{html:He(r),quelle:"heuristik",modell:r}}function Ze(t,e){const n=e.map(s=>t.axisValues?.[s]).filter(Boolean),a=(t.states||[]).filter(s=>s!=="default");for(const s of a)n.push(re(s)+(B.has(s)?" *":""));return n.length?n.join(" · "):"Standard"}function Ue(t,e,n,a){const s=Me(t,e),r=Ae(t,e).map(_=>{let c;try{c=Re(_,t,e,n,a)}catch(u){c={html:`<div class="ra-fallback">Vorschau nicht darstellbar: ${k(u.message)}</div>`,quelle:"fehler",fehler:u.message,modell:{tokenGroups:[]}}}return{id:_.id||"standard",label:Ze(_,s),html:c.html,quelle:c.quelle,fehler:c.fehler,tokenGroups:c.modell.tokenGroups,axisValues:_.axisValues,nurInteraktiv:(_.states||[]).some(u=>B.has(u))}}),o=t.layoutConfig?.rowAxis;let i;if(o&&s.includes(o)){const _=new Map;for(const c of r){const u=c.axisValues?.[o]??"_";_.has(u)||_.set(u,{key:u,label:u,zellen:[]}),_.get(u).zellen.push(c)}i=[..._.values()]}else i=[{key:"_",label:null,zellen:r}];const l=String(e.meta?.layer||""),d=["block","stack","column","composition"].includes(t.layout)||l.includes("organism");return{id:t.id,label:t.label||t.id,description:t.description||"",tokenGroups:Pe(t,e),anordnung:d?"stapel":t.layout==="single"?"einzeln":"reihe",zeilen:i,zellenAnzahl:r.length,nurInteraktiv:r.some(_=>_.nurInteraktiv),achsen:Object.entries(t.matrix?.axes||{}).map(([_,c])=>({name:_,werte:c==="*"?"alle":c.join(", ")}))}}const Je=(t,e)=>`
<div class="${e.klasse}"${e.attrs}>
<h2 class="nc-section-header__title">Jetzt laden — oder in zwei Minuten ansehen</h2>
<p class="nc-section-header__subtitle">Die neo app gibt es für iOS und Android. Der Zugang läuft über Ihre Organisation; einen Testzugang richten wir auf Anfrage ein.</p>
<p class="nc-app-store__note">iOS 16 und Android 10 oder neuer · Deutsch und Englisch</p>
</div>
`,Qe=Object.freeze(Object.defineProperty({__proto__:null,default:Je},Symbol.toStringTag,{value:"Module"})),v="data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 1600 900%22 width=%22320%22 height=%22180%22%3E%3Crect width=%221600%22 height=%22900%22 fill=%22%23c9ced6%22/%3E%3Cpath d=%22M0 900 560 400l360 300 200-150 480 350z%22 fill=%22%23aab1bc%22/%3E%3Ccircle cx=%221180%22 cy=%22250%22 r=%2290%22 fill=%22%23aab1bc%22/%3E%3C/svg%3E",$={kreis:'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/></svg>',info:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>',fehler:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>',schliessen:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>',pfeil:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>'},p=(t,e)=>t.slotConfig?.[e]!==!1,ce='<svg viewBox="0 0 36 36" fill="none" aria-hidden="true" focusable="false"><circle cx="18" cy="18" r="18" fill="#AEF359"></circle><path d="M12 18L16 22L24 14" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>',z='<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 18l-6-6 6-6"/></svg>',O='<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 18l6-6-6-6"/></svg>',Xe=(t,e)=>`
<div class="${e.klasse}"${e.attrs}>
<img class="nc-aspect-ratio__content" src="${v}" alt="${k((e.wert("ratio")||"").replace("-",":"))} Beispiel">
</div>
`,Ye=Object.freeze(Object.defineProperty({__proto__:null,default:Xe},Symbol.toStringTag,{value:"Module"})),et=(t,e)=>{const n=e.wert("decorator");if(n==="dot"||n==="pulse")return`<span class="${e.klasse}" aria-label="${k(e.text)}"${e.attrs}></span>`;const a=e.specimen.render?.counterValues?.[0],s=n==="counter"||n==="decorator"?a||"3":k(e.text);return`<span class="${e.klasse}"${e.attrs}>${e.slot("icon")?`<span class="nc-badge__icon">${$.kreis}</span>`:""}<span class="nc-badge__label">${s}</span></span>`},tt=Object.freeze(Object.defineProperty({__proto__:null,default:et},Symbol.toStringTag,{value:"Module"})),nt={code:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="22" height="22"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12 12 0 0 0-6 0C7.2 1.6 6.1 1.9 6.1 1.9a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4.7 8.3c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V20"></path></svg>',wolke:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="22" height="22"><path d="M17.5 19a4.5 4.5 0 0 0 .4-9A6 6 0 0 0 6.2 8.4 4.5 4.5 0 0 0 6.5 19h11Z"></path></svg>',ki:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="22" height="22"><circle cx="12" cy="12" r="3"></circle><path d="M12 2v4M12 18v4M2 12h4M18 12h4"></path></svg>',person:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="22" height="22"><circle cx="12" cy="5" r="2"></circle><path d="M4 9h16M12 9v5M12 14l-4 7M12 14l4 7"></path></svg>'},at=[{mod:" nc-bento-grid__cell--lg",icon:"code",badge:"GPL · MIT",titel:"100 % Open Source",text:"Volle Transparenz, kein Vendor-Lock-in. Auditierbarer Code, aktive Community, digitale Souveränität."},{mod:"",icon:"wolke",titel:"Cloud &amp; On-Prem",text:"Flexible Betriebsmodelle für jede Compliance-Anforderung."},{mod:"",icon:"ki",titel:"KI-nativ",text:"KI in Entwicklung &amp; Betrieb – von Anfang an mitgedacht."},{mod:" nc-bento-grid__cell--wide",icon:"person",titel:"Barrierefrei",text:"WCAG-konform nach BITV 2.0 – Zugänglichkeit als Standard, nicht als Feature."}],st=(t,e)=>{const n=e.wert("animation")==="reveal";return`
<div class="${e.klasse}${n?" is-revealed":""}"${n?' data-animation="reveal"':""}${e.attrs}>
${at.map((a,s)=>`<article class="nc-bento-grid__cell${a.mod}">
${s===0&&p(e,"mesh")?'<span class="nc-bento-grid__mesh" aria-hidden="true"></span>':""}${a.badge&&p(e,"badge")?`<span class="nc-bento-grid__badge">${a.badge}</span>`:""}${p(e,"icon")?`<span class="nc-bento-grid__icon" aria-hidden="true">${nt[a.icon]}</span>`:""}
<h3 class="nc-bento-grid__title">${a.titel}</h3>
${p(e,"text")?`<p class="nc-bento-grid__text">${a.text}</p>`:""}
</article>`).join(`
`)}
</div>`},rt=Object.freeze(Object.defineProperty({__proto__:null,default:st},Symbol.toStringTag,{value:"Module"})),lt=(t,e)=>`
<div class="${e.klasse}" data-theme="dark"${e.attrs}>
<img class="nc-card-cta__media" src="${v}" alt="" loading="lazy" decoding="async">
<div class="nc-card-cta__overlay"></div>
<div class="nc-card-cta__content">
<h3 class="nc-card-cta__title">Flexibel skalierbar</h3>
<div class="nc-card-cta__actions">
<a href="#" onclick="return false" class="nc-button nc-button--primary" style="--nc-button-primary-bg: var(--fnd-color-always-light); --nc-button-primary-color: var(--fnd-color-always-dark);">Preise ansehen</a>
</div>
</div>
</div>
`,it=Object.freeze(Object.defineProperty({__proto__:null,default:lt},Symbol.toStringTag,{value:"Module"})),ot='style="--nc-button-primary-bg: var(--fnd-color-always-light); --nc-button-primary-color: var(--fnd-color-always-dark);"',ct='style="--nc-button-ghost-color: var(--fnd-color-always-light); --nc-button-ghost-border: var(--fnd-color-always-light);"',dt=[["Workplace Platform","Plattform entdecken","primary",60],["Analytics &amp; Reporting in Echtzeit","Dashboard testen","ghost",80],["Enterprise Security für Ihr Team","Mehr erfahren","primary",60],["Nahtlose Integrationen","Alle Apps","ghost",100]],ut=(t,e)=>`
<div class="${e.klasse}" style="--cgc-columns: 2; --cgc-ratio: 4/3;"${e.attrs}>
${dt.map(([n,a,s,r])=>`<div class="nc-card-cta" data-theme="dark">
<img class="nc-card-cta__media" src="${v}" alt="" loading="lazy" decoding="async">
<div class="nc-card-cta__overlay"></div>
<div class="nc-card-cta__content">
<h3 class="nc-card-cta__title" style="max-width: ${r}%;">${n}</h3>
<div class="nc-card-cta__actions"><a href="#" onclick="return false" class="nc-button nc-button--${s}" ${s==="ghost"?ct:ot}>${a}</a></div>
</div>
</div>`).join(`
`)}
</div>`,_t=Object.freeze(Object.defineProperty({__proto__:null,default:ut},Symbol.toStringTag,{value:"Module"})),pt=[["Aus PIIPE Workplace wird neo workplace","Produktnews · Juli 2026 — Mit dem Einzug von KI und dem funktionalen Ausbau des NEOCOSMO Produktuniversums werden die Namen der NEOCOSMO Produkte unter der Firmendachmarke vereinheitlicht."],["neo AI - statt Suchen gibt es Antworten","Produktnews · ab Juli 2026 — mit neo AI bringt NEOCOSMO eine spezielle Intranet-KI auf den Markt: sicher, offen, schnell."],["NEOCOSMO in Analysten-Ranking top platziert","Auszeichnung als einer der innovativsten Anbieter im D/A/CH Raum."]],ht=(t,e)=>{const n=e.wert("pattern")||"standard",a=e.wert("animation")==="reverse-domino",s=([r,o],i)=>{const l=n==="preview"||n==="horizontal"||i===0,d=["nc-card","nc-card--navigational"];return n==="preview"&&d.push("nc-card--preview"),n==="featured"&&i===0&&d.push("nc-card--featured"),n==="horizontal"&&d.push("nc-card--square-media"),`<article class="${d.join(" ")}"${a?` style="--card-delay: ${i/10}s;"`:""}>
${l?`<div class="nc-card__media"><img src="${v}" alt="" loading="lazy"></div>`:""}
<div class="nc-card__content">
<h3 class="nc-card__title">${r}</h3>
<p class="nc-card__description">${o}</p>
</div>
<div class="nc-card__footer"><span class="nc-card__footer-label">Mehr darüber erfahren</span><span class="nc-card__footer-icon">${$.pfeil}</span></div>
</article>`};return`
<div class="${e.klasse} nc-card-grid--cols-3${a?" is-revealed":""}" data-pattern="${n}"${a?' data-animation="reverse-domino"':""}${e.attrs}>
${pt.map(s).join(`
`)}
</div>`},bt=Object.freeze(Object.defineProperty({__proto__:null,default:ht},Symbol.toStringTag,{value:"Module"})),vt=[["News","Unternehmensnews und Meldungen aus den Bereichen — sortiert nach dem, was für die eigene Rolle zählt."],["Mitarbeiterservices","Urlaubsantrag, Gehaltsnachweis, Krankmeldung: drei Fingertipps entfernt."],["Event-Kalender","Betriebsversammlung, Schulung, Sommerfest — mit Zusage direkt aus der App."]],ft=(t,e)=>{const n=e.wert("media")==="media",a=([s,r])=>n?`<figure class="nc-device-figure">
<div class="nc-device"><div class="nc-device__screen"><img src="${v}" alt="" decoding="async"></div></div>
<figcaption class="nc-device-figure__caption"><span class="nc-device-figure__name">${s}</span><span class="nc-device-figure__text">${r}</span></figcaption>
</figure>`:`<article class="nc-card"><div class="nc-card__content"><h3 class="nc-card__title">${s}</h3><p class="nc-card__description">${r}</p></div></article>`;return`
<div class="${e.klasse}"${e.attrs}>
<div class="nc-carousel__track${n?" nc-carousel__track--media":""}" tabindex="0" role="group" aria-label="Ansichten, waagerecht scrollbar">
${vt.map(a).join(`
`)}
</div>
${p(e,"controls")?`<div class="nc-carousel__controls">
<button type="button" class="nc-gallery__paddle nc-gallery__paddle--prev" aria-label="Zurück">${z}</button>
<button type="button" class="nc-gallery__paddle nc-gallery__paddle--next" aria-label="Weiter">${O}</button>
</div>`:""}
</div>`},gt=Object.freeze(Object.defineProperty({__proto__:null,default:ft},Symbol.toStringTag,{value:"Module"})),R=["Kommunikation","Wissen","Events","Vernetzung","Anwendungen"],kt=(t,e)=>{const n=e.wert("form")||"leiste";return n==="verzeichnis"?`
<nav class="${e.klasse}" aria-label="Kapitel dieser Seite"${e.attrs}>
<ol class="nc-chapter-toc__list">
${R.map(a=>`<li><a class="nc-chapter-nav__link" href="#" onclick="return false">${a}</a></li>`).join(`
`)}
</ol>
</nav>`:n==="keine"?`<div class="${e.klasse}"${e.attrs}><span class="nc-chapter-anchor" id="${e.uid}-anker">Sprungziel ohne sichtbare Navigation</span></div>`:`
<nav class="${e.klasse}" aria-label="Kapitel dieser Seite"${e.attrs}>
<div class="nc-container nc-chapter-nav__inner">
${R.map((a,s)=>`<a class="nc-chapter-nav__link" href="#" onclick="return false"${s===0?' aria-current="true"':""}>${a}</a>`).join(`
`)}
</div>
</nav>`},$t=Object.freeze(Object.defineProperty({__proto__:null,default:kt},Symbol.toStringTag,{value:"Module"})),mt=[["design","Design"],["development","Development",!0],["marketing","Marketing"]],yt=(t,e)=>{const n=e.deaktiviert?" disabled":"",a=e.slot("header")?`<div class="nc-checkbox-group__header" id="${e.uid}-label">Interessen</div>`:"",s=e.slot("hint")||e.hat("error")?`<p class="nc-checkbox-group__hint">${e.hat("error")?"Bitte mindestens eine Option wählen.":"Mehrfachauswahl möglich."}</p>`:"",r=a?` aria-labelledby="${e.uid}-label"`:' aria-label="Interessen"';return`
<div class="${e.klasse}" role="group"${r}${e.attrs}>
${a}
${mt.map(([o,i,l])=>`<label class="nc-checkbox">
<input class="nc-checkbox__input" type="checkbox" name="${e.uid}" value="${o}"${l?" checked":""}${n}>
<span class="nc-checkbox__control"></span>
<span class="nc-checkbox__label">${i}</span>
</label>`).join(`
`)}
${s}
</div>`},wt=Object.freeze(Object.defineProperty({__proto__:null,default:yt},Symbol.toStringTag,{value:"Module"})),Z='<svg class="nc-tbl-icon nc-tbl-icon--check" width="32" height="32" viewBox="0 0 36 36" fill="none" aria-label="enthalten"><circle cx="18" cy="18" r="18"></circle><path d="M12 18L16 22L24 14" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>',St='<span class="nc-compare-table__sort-icon" aria-hidden="true"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m7 15 5 5 5-5M7 9l5-5 5 5"/></svg></span>',jt=[["News, Newskanäle",!0,!0,"12"],["Inhalts- und Wissensseiten",!0,!0,"48"],["Veranstaltungskalender &amp; Event-Seiten",!1,!0,"1.250"]],xt=(t,e)=>{const n=e.wert("selection")==="checkbox",a=e.wert("sorting")==="sortable",s=n?'<th scope="col"><input class="nc-compare-table__checkbox" type="checkbox" aria-label="Alle auswählen"></th>':"",r=o=>`<th scope="col"${a?' aria-sort="none"':""}>${o}${a?St:""}</th>`;return`
<div class="${e.basisKlasse}"${e.attrsOhne("aria-selected")}>
<table>
<thead>
<tr>${s}${r("Funktion")}${r("Standard")}${r("Premium")}<th scope="col" class="nc-compare-table__numeric">Nutzer</th></tr>
</thead>
<tbody>
<tr class="nc-compare-table__section-row"><th scope="rowgroup" colspan="${n?5:4}"><div class="nc-tbl-cell"><p class="nc-tbl-cell__text">FÜR MITARBEITENDE / ENDNUTZER</p></div></th></tr>
${jt.map(([o,i,l,d],_)=>{const c=n&&_===0&&e.hat("selected");return`<tr${c?' class="is-selected" aria-selected="true"':""}>
${n?`<td><input class="nc-compare-table__checkbox" type="checkbox" aria-label="Zeile auswählen"${c?" checked":""}></td>`:""}
<th scope="row"><div class="nc-tbl-cell"><p class="nc-tbl-cell__text">${o}</p></div></th>
<td><div class="nc-tbl-cell${i?" nc-tbl-cell--icon":""}">${i?Z:""}</div></td>
<td><div class="nc-tbl-cell${l?" nc-tbl-cell--icon":""}">${l?Z:""}</div></td>
<td class="nc-compare-table__numeric">${d}</td>
</tr>`}).join(`
`)}
</tbody>
</table>
</div>`},zt=Object.freeze(Object.defineProperty({__proto__:null,default:xt},Symbol.toStringTag,{value:"Module"})),Ot=(t,e)=>`
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
`,Mt=Object.freeze(Object.defineProperty({__proto__:null,default:Ot},Symbol.toStringTag,{value:"Module"})),At=(t,e)=>`
<div class="${e.klasse}"${e.attrs}>
<div class="nc-device__screen">
<img src="${v}" alt="App-Ansicht" width="800" height="1740" loading="lazy" decoding="async">
</div>
</div>
`,Pt=Object.freeze(Object.defineProperty({__proto__:null,default:At},Symbol.toStringTag,{value:"Module"})),Et=(t,e)=>{if(e.wert("variant")==="with-label")return`<div class="nc-divider-label" data-recipe-wurzel="${e.root}" role="separator"${e.attrs}><span>oder</span></div>`;const n=e.wert("orientation")==="vertical";return`<hr class="${e.klasse}"${n?' aria-orientation="vertical"':""}${e.attrs}>`},Tt=Object.freeze(Object.defineProperty({__proto__:null,default:Et},Symbol.toStringTag,{value:"Module"})),It=(t,e)=>`
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
`,Bt=Object.freeze(Object.defineProperty({__proto__:null,default:It},Symbol.toStringTag,{value:"Module"})),Ct='<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2"></rect><path d="M16 2v4M8 2v4M3 10h18"></path></svg>',Nt='<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><path d="M12 6v6l4 2"></path></svg>',Dt='<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>',Lt='<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"></path></svg>',Kt=(t,e)=>`
<article class="${e.klasse}"${e.attrs}>
<section class="nc-event__hero">
<div class="nc-event__hero-content nc-container">
${p(e,"tags")?`<div class="nc-event__tags">
<span class="nc-event__tag nc-event__tag--type">Konferenz</span>
<span class="nc-event__tag nc-event__tag--format">Hybrid</span>
<span class="nc-event__tag nc-event__tag--lang">Deutsch &amp; English</span>
</div>`:""}
<h2 class="nc-event__title"><span>Digital Workplace Summit 2026</span></h2>
${p(e,"subtitle")?'<p class="nc-event__subtitle">Die Konferenz für den digitalen Arbeitsplatz</p>':""}
${p(e,"meta")?`<div class="nc-event__meta">
<div class="nc-event__meta-item">${Ct}<span>20.05.2026</span></div>
<div class="nc-event__meta-item">${Nt}<span>09:00 – 17:00 Uhr</span></div>
<div class="nc-event__meta-item">${Dt}<span>Congresshalle Saarbrücken</span></div>
</div>`:""}
<div class="nc-event__cta"><a href="#" onclick="return false" class="nc-button nc-button--accent nc-button--lg"><span>Ticket sichern</span></a></div>
</div>
</section>
<section class="nc-section nc-section--muted">
<div class="nc-container">
<h2 class="nc-event__section-title">Agenda</h2>
<div class="nc-event__agenda u-prose">
<h4>Tag 1: Strategie</h4>
<p>Keynotes, Panels, Strategy Sessions</p>
<h4>Tag 2: Praxis</h4>
<p>Workshops, Hands-on Labs, Roundtables</p>
</div>
</div>
</section>
${p(e,"related-grid")?`<section class="nc-section">
<div class="nc-container">
<h2 class="nc-event__section-title">Weitere Events</h2>
<div class="nc-event__related-grid">
<a href="#" onclick="return false" class="nc-card nc-card--navigational nc-event__related-card">
<div class="nc-card__content">
<span class="nc-card__kicker">Konferenz</span>
<h3 class="nc-card__title">NEO Partner Day 2026</h3>
<p class="nc-card__meta">08.07.2026</p>
</div>
<div class="nc-card__footer"><span class="nc-card__footer-label">Mehr erfahren</span><span class="nc-card__footer-icon">${Lt}</span></div>
</a>
</div>
</div>
</section>`:""}
</article>`,Wt=Object.freeze(Object.defineProperty({__proto__:null,default:Kt},Symbol.toStringTag,{value:"Module"})),Ft='<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"></circle><path d="m20 20-3.5-3.5"></path></svg>',U=[["Konferenz","Digital Workplace Summit 2026","20.05.2026","Congresshalle Saarbrücken"],["Konferenz","NEO Partner Day 2026","08.07.2026","Saarbrücken"],["Webinar","Intranet-Relaunch: Erfahrungsbericht Festo","15.09.2026","Online"]],Gt=(t,e)=>`
<div class="${e.klasse}"${e.attrs}>
${p(e,"filter-bar")?`<div class="nc-events__filter-bar">
<div class="nc-events__search"><div class="nc-events__search-wrapper">
<span class="nc-events__search-icon">${Ft}</span>
<input class="nc-events__search-input" type="search" placeholder="Events durchsuchen" aria-label="Events durchsuchen">
</div></div>
<select class="nc-events__filter-select" aria-label="Eventart"><option>Alle Formate</option><option>Konferenz</option><option>Webinar</option></select>
</div>`:""}
${p(e,"results-count")?`<p class="nc-events__results-count">${U.length} Veranstaltungen</p>`:""}
<div class="nc-events__grid">
${U.map(([n,a,s,r])=>`<a href="#" onclick="return false" class="nc-events__card">
<div class="nc-events__card-header">
${p(e,"card-type")?`<span class="nc-events__card-type">${n}</span>`:""}
<h3 class="nc-events__card-title">${a}</h3>
</div>
<div class="nc-events__card-meta"><span class="nc-events__card-meta-item">${s}</span><span class="nc-events__card-meta-item">${r}</span></div>
<div class="nc-events__card-footer">Mehr erfahren</div>
</a>`).join(`
`)}
</div>
${p(e,"load-more")?'<div class="nc-events__load-more"><button type="button" class="nc-button nc-button--outline">Mehr laden</button></div>':""}
</div>`,qt=Object.freeze(Object.defineProperty({__proto__:null,default:Gt},Symbol.toStringTag,{value:"Module"})),Vt=[["01","Open Source","GPL / MIT","100 % Open Source","Transparenter, auditierbarer Code ohne Vendor-Lock-in. Digitale Souveränität für Unternehmen und öffentliche Hand."],["02","Cloud &amp; On-Prem","Betriebsmodelle","Cloud &amp; On-Prem","SaaS, Private Cloud oder eigenes Rechenzentrum – Sie entscheiden, wo Ihre Daten liegen."],["03","KI-nativ","Entwicklung &amp; Betrieb","KI-nativ","KI-gestützte Workflows in Produktentwicklung und Plattformbetrieb – nicht nachgerüstet, sondern eingebaut."],["04","Barrierefrei","WCAG 2.1 AA","Barrierefrei","WCAG-konform und BITV-ready – Zugänglichkeit als Qualitätsmerkmal des gesamten Produkts."]],Ht=(t,e)=>{const n=e.hat("open");return`
<div class="${e.klasse}" role="group" aria-label="Warum neo workplace?"${e.attrsOhne("aria-expanded","data-state")}>
${Vt.map(([a,s,r,o,i],l)=>`<button type="button" class="nc-expanding-panels__panel" aria-expanded="${n&&l===0}">
${p(e,"bg")?'<span class="nc-expanding-panels__bg" aria-hidden="true"></span>':""}
${p(e,"num")?`<span class="nc-expanding-panels__num">${a}</span>`:""}
<span class="nc-expanding-panels__label">${s}</span>
<span class="nc-expanding-panels__body">
<span class="nc-expanding-panels__chip">${r}</span>
<span class="nc-expanding-panels__title" role="heading" aria-level="3">${o}</span>
<span class="nc-expanding-panels__text">${i}</span>
</span>
</button>`).join(`
`)}
</div>`},Rt=Object.freeze(Object.defineProperty({__proto__:null,default:Ht},Symbol.toStringTag,{value:"Module"})),Zt=[["Material","Recyceltes Aluminium, Klasse A"],["Abmessungen","240 &times; 120 &times; 60 mm"],["Gewicht","1,4 kg"],["Garantie","5 Jahre Herstellergarantie"]],Ut=(t,e)=>`
<div class="${e.klasse}"${e.attrs}>
${e.slot("title")?'<p class="nc-facts-title">Produktdetails</p>':""}
<dl class="nc-facts-list">
${Zt.map(([n,a])=>`<dt class="nc-facts-term">${n}</dt>
<dd class="nc-facts-desc">${a}</dd>`).join(`
`)}
</dl>
</div>`,Jt=Object.freeze(Object.defineProperty({__proto__:null,default:Ut},Symbol.toStringTag,{value:"Module"})),D=[["Dashboard","PIIPE Workplace Dashboard mit Projektübersicht","Das zentrale Dashboard gibt dir den Überblick über alle laufenden Projekte, offene Aufgaben und Team-Aktivitäten."],["Zusammenarbeit","Team-Zusammenarbeit am Arbeitsplatz","Arbeite mit deinem Team in Echtzeit an Dokumenten, Aufgaben und Projekten."],["Community","PIIPE Community und Wissensaustausch","Interne Foren und Wissensdatenbanken fördern den Austausch über Abteilungsgrenzen hinweg."]],Qt=(t,e)=>{const n=e.uid,a=e.wert("navigation")==="paddles";return`
<div class="${e.klasse}" aria-label="Eine Plattform für alles"${e.attrs}>
<div class="nc-fade-gallery__viewport">
${D.map(([,s],r)=>`<div class="nc-fade-gallery__media${r===0?" is-active":""}" role="tabpanel" id="${n}-p${r}" aria-labelledby="${n}-t${r}"${r?' aria-hidden="true"':""}><img src="${v}" alt="${s}" decoding="async"></div>`).join(`
`)}
</div>
<div class="nc-fade-gallery__nav-row">
${a?`<div class="nc-gallery__controls">
<button type="button" class="nc-gallery__paddle nc-gallery__paddle--prev" aria-label="Vorherige Ansicht">${z}</button>
<button type="button" class="nc-gallery__paddle nc-gallery__paddle--next" aria-label="Nächste Ansicht">${O}</button>
</div>`:""}
<div class="nc-fade-gallery__tabs" role="tablist">
${D.map(([s],r)=>`<button type="button" class="nc-fade-gallery__tab" role="tab" id="${n}-t${r}" aria-controls="${n}-p${r}" aria-selected="${r===0}" tabindex="${r===0?0:-1}">${s}</button>`).join(`
`)}
</div>
</div>
<div class="nc-fade-gallery__caption" aria-live="polite">
${D.map(([,,s],r)=>`<p class="nc-fade-gallery__desc${r===0?" is-visible":""}"${r?" hidden":""}>${s}</p>`).join(`
`)}
</div>
</div>`},Xt=Object.freeze(Object.defineProperty({__proto__:null,default:Qt},Symbol.toStringTag,{value:"Module"})),Yt=(t,e)=>`
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
`,en=Object.freeze(Object.defineProperty({__proto__:null,default:Yt},Symbol.toStringTag,{value:"Module"})),tn=[["Echtzeit-Dashboard","Verfolgen Sie alle wichtigen KPIs in Echtzeit auf einem übersichtlichen Dashboard.",["Live-Daten-Aktualisierung","Anpassbare Widgets","Export als PDF oder CSV"]],["Benutzerdefinierte Berichte","Erstellen Sie individuelle Berichte und Analysen nach Ihren eigenen Kriterien.",[]],["Prognosen &amp; Trends","KI-gestützte Vorhersagen helfen Ihnen, zukünftige Entwicklungen zu antizipieren.",[]]],nn=(t,e)=>{const n=a=>a===0||a===1&&e.hat("open");return`
<div class="${e.klasse}"${e.attrs}>
<div class="nc-feature-accordeon__left">
${p(e,"title")?'<h2 class="nc-feature-accordeon__title">Alle Features im Überblick</h2>':""}
<p class="nc-feature-accordeon__lead">Entdecken Sie den vollständigen Funktionsumfang unserer Plattform.</p>
<ul class="nc-feature-accordeon__links" role="list">
<li><button class="nc-feature-accordeon__link is-active" type="button">Analytics &amp; Reporting</button></li>
<li><button class="nc-feature-accordeon__link" type="button">Integrationen</button></li>
<li><button class="nc-feature-accordeon__link" type="button">Automatisierung</button></li>
</ul>
</div>
<div class="nc-feature-accordeon__right">
<div class="nc-feature-accordeon__chapter">
<h3 class="nc-feature-accordeon__chapter-title">Analytics &amp; Reporting</h3>
<div class="nc-feature-accordeon__chapter-items">
${tn.map(([a,s,r],o)=>`<details class="nc-feature-accordeon__item"${n(o)?" open":""}>
<summary class="nc-feature-accordeon__item-summary">${a}</summary>
<div class="nc-feature-accordeon__item-body">
<p class="nc-feature-accordeon__item-text">${s}</p>
${r.length?`<ul class="nc-feature-accordeon__item-list">${r.map(i=>`<li class="nc-feature-accordeon__item-list-entry">${i}</li>`).join("")}</ul>`:""}
</div>
</details>`).join(`
`)}
</div>
</div>
</div>
</div>`},an=Object.freeze(Object.defineProperty({__proto__:null,default:nn},Symbol.toStringTag,{value:"Module"})),sn=["Anmeldung mit Benutzername/E-Mail und Passwort","Firmenaccount-Login z.B. via Microsoft-Kennung (Entra ID) / LDAP","SAML 2.0 / OpenID Connect für unternehmensweites Single-Sign-On","Kopplung an bestehende Nutzerkonten von neo workplace"],rn=(t,e)=>{const n=e.wert("variante")||"default",a=["with-media","media-left","media-right"].includes(n),s=n.startsWith("media-")?" nc-feature-list--with-media":"";return`
<section class="nc-section ${e.klasse}${s}"${e.attrs}>
<div class="nc-container nc-feature-list__inner">
${a?`<div class="nc-feature-list__media nc-feature-list__media--device"><div class="nc-device"><div class="nc-device__screen"><img src="${v}" alt="Login" loading="lazy" decoding="async"></div></div></div>`:""}
<div class="nc-feature-list__content">
<div class="nc-section-header nc-section-header--flush">
<span class="nc-section-header__label">Authentifizierung und Login</span>
<h2 class="nc-section-header__title">Sicherer Zugang für jeden Mitarbeitenden</h2>
<p class="nc-section-header__subtitle">Verschiedene Login-Verfahren ermöglichen eine einfache Integration in Ihre bestehende IT-Infrastruktur.</p>
</div>
<div class="nc-feature-list__items-host">
<ul class="nc-feature-list__items">
${sn.map(r=>`<li class="nc-feature-list__item"><span class="nc-feature-list__icon">${ce}</span><span class="nc-feature-list__item-text">${r}</span></li>`).join(`
`)}
</ul>
</div>
<div class="nc-feature-list__cta"><a href="#" onclick="return false" class="nc-button nc-button--primary">Mehr zur Sicherheit</a></div>
</div>
</div>
</section>`},ln=Object.freeze(Object.defineProperty({__proto__:null,default:rn},Symbol.toStringTag,{value:"Module"})),on='<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>',cn='<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>',dn=[["Angebot_2026.pdf","1,2 MB",100],["Präsentation.pptx","8,4 MB",45]],un=(t,e)=>{const n=e.slot("list")?`<ul class="nc-file-upload-list">
${dn.map(([a,s,r])=>`<li class="nc-file-upload-list__item">
<span class="nc-file-upload-list__icon">${cn}</span>
<span class="nc-file-upload-list__name">${a}</span>
<span class="nc-file-upload-list__size">${s}</span>
${e.slot("list-progress")?`<progress class="nc-file-upload-list__progress" max="100" value="${r}">${r} %</progress>`:""}
<button class="nc-file-upload-list__remove" type="button" aria-label="${a} entfernen">${$.schliessen}</button>
</li>`).join(`
`)}
</ul>`:"";return`
<div class="${e.klasse}" role="button" tabindex="${e.deaktiviert?"-1":"0"}"${e.attrs}>
<input class="nc-file-upload__input" type="file" multiple tabindex="-1"${e.deaktiviert?" disabled":""}>
<span class="nc-file-upload__icon">${on}</span>
<span class="nc-file-upload__text">${e.hat("dragging")?"Loslassen zum Hochladen":"Dateien hierher ziehen"}</span>
<span class="nc-file-upload__subtext">oder <span class="nc-file-upload__button">Dateien auswählen</span></span>
</div>
${n}`},_n=Object.freeze(Object.defineProperty({__proto__:null,default:un},Symbol.toStringTag,{value:"Module"})),pn=[["Produkte",["neo workplace","neo workplace App","neo magazine","neo AI"]],["Lösungen",["Lösungen im Überblick","Integrationen","Technologie &amp; Sicherheit","Editionen &amp; Preise"]],["Unternehmen",["Über NEOCOSMO","Kunden","News","Karriere"]],["Inside",["Support-Portal","Dokumentation","Innovation Blog","App Store"]]],hn='<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 11v5"></path><path d="M8 8v.01"></path><path d="M12 16v-5"></path><path d="M16 16v-3a2 2 0 1 0-4 0"></path><path d="M3 7a4 4 0 014-4h10a4 4 0 014 4v10a4 4 0 01-4 4H7a4 4 0 01-4-4z"></path></svg>',bn='<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 7a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z"></path><path d="M3 7l9 6 9-6"></path></svg>',vn=(t,e)=>{const n=Number(e.wert("columns"))||3,a=p(e,"columns")?`
<nav class="nc-footer__nav" aria-label="Footer Navigation">
<div class="nc-footer__columns">
${pn.slice(0,n).map(([o,i])=>`<div class="nc-footer__column">
<h3 class="nc-footer__heading">${o}</h3>
<ul class="nc-footer__links">${i.map(l=>`<li><a class="nc-footer__link" href="#" onclick="return false">${l}</a></li>`).join("")}</ul>
</div>`).join(`
`)}
</div>
</nav>`:"",s=p(e,"newsletter")?`
<div class="nc-footer__newsletter">
<h3 class="nc-footer__heading">Newsletter</h3>
<p class="nc-footer__newsletter-text">Neuigkeiten zu Produkten, Releases und Veranstaltungen — etwa monatlich.</p>
<form class="nc-footer__newsletter-form" novalidate onsubmit="return false">
<label class="nc-sr-only" for="${e.uid}-nl">E-Mail-Adresse</label>
<input class="nc-input nc-footer__newsletter-input" type="email" id="${e.uid}-nl" placeholder="name@firma.de">
<button type="button" class="nc-button nc-button--accent">Abonnieren</button>
</form>
</div>`:"",r=e.slot("cta-area")?`
<div class="nc-footer__cta">
<p class="nc-footer__cta-kicker">Bereit?</p>
<p class="nc-footer__cta-headline">Lassen Sie uns über Ihren digitalen Arbeitsplatz sprechen.</p>
<a href="#" onclick="return false" class="nc-button nc-button--accent nc-button--lg">Demo vereinbaren</a>
</div>
<div class="nc-footer__separator" aria-hidden="true"></div>`:"";return`
<footer class="${e.klasse}" aria-label="Fußzeile"${e.attrs}>
<div class="nc-footer__inner nc-container">${r}
<div class="nc-footer__main">
<div class="nc-footer__brand">
<div class="nc-footer__contact">
<h3 class="nc-footer__heading">Kontakt</h3>
<address class="nc-footer__address">NEOCOSMO GmbH<br>Science Park 2<br>66123 Saarbrücken</address>
<a class="nc-footer__contact-link" href="#" onclick="return false">welcome@neocosmo.de</a>
</div>
</div>${a}${s}
</div>
${p(e,"separator")?'<div class="nc-footer__separator" aria-hidden="true"></div>':""}
<div class="nc-footer__bottom">
${p(e,"social-links")?`<div class="nc-footer__social">
<a class="nc-footer__social-link" href="#" onclick="return false" aria-label="LinkedIn">${hn}</a>
<a class="nc-footer__social-link" href="#" onclick="return false" aria-label="Mail">${bn}</a>
</div>`:""}
<div class="nc-footer__legal">
<span class="nc-footer__copyright">© 2026. neocosmo GmbH. Alle Rechte vorbehalten.</span>
<nav class="nc-footer__legal-links" aria-label="Rechtliches">
<a href="#" onclick="return false">Impressum</a>
<a href="#" onclick="return false">Datenschutz</a>
<a href="#" onclick="return false">Barrierefreiheit</a>
</nav>
</div>
</div>
</div>
</footer>`},fn=Object.freeze(Object.defineProperty({__proto__:null,default:vn},Symbol.toStringTag,{value:"Module"})),gn=(t,e)=>`
<div class="${e.klasse}"${e.attrs}>
${e.wert("alignment")==="spread"?`<button type="button" class="nc-button nc-button--ghost">Zurück</button>
`:""}<button type="button" class="nc-button nc-button--primary">Speichern</button>
<button type="button" class="nc-button nc-button--secondary">Abbrechen</button>
</div>
`,kn=Object.freeze(Object.defineProperty({__proto__:null,default:gn},Symbol.toStringTag,{value:"Module"})),$n=(t,e)=>{const n=a=>`${e.uid}-${a}`;return`
<div class="${e.klasse}" data-layout="${e.wert("position")||"text-left"}"${e.attrs}>
<div class="nc-form-block__text">
<div class="nc-section-header nc-section-header--flush">
<h2 class="nc-section-header__title nc-form-block__headline">Nachricht senden</h2>
${p(e,"subtext")?'<p class="nc-section-header__subtitle nc-form-block__subtext">Erzählen Sie uns von Ihrem Vorhaben – wir melden uns persönlich.</p>':""}
</div>
</div>
<div class="nc-form-block__form">
<form class="nc-form nc-form--two-column" novalidate onsubmit="return false">
<div class="nc-form-field nc-form-field--required">
<label class="nc-form-label" for="${n("org")}"><span class="nc-form-label__text">Organisation</span><span class="nc-form-label__required" aria-hidden="true"> *</span></label>
<input class="nc-input" type="text" id="${n("org")}" placeholder="Ihr Unternehmen / Ihre Institution">
</div>
<div class="nc-form-field">
<label class="nc-form-label" for="${n("thema")}"><span class="nc-form-label__text">Thema</span><span class="nc-form-label__optional"> (optional)</span></label>
<select class="nc-select" id="${n("thema")}"><option>Bitte wählen …</option><option>Demo</option><option>Preise</option></select>
</div>
<div class="nc-form-field nc-form-field--required nc-form-field--full-width">
<label class="nc-form-label" for="${n("msg")}"><span class="nc-form-label__text">Worum geht es?</span><span class="nc-form-label__required" aria-hidden="true"> *</span></label>
<textarea class="nc-textarea" rows="4" id="${n("msg")}" placeholder="Beschreiben Sie Ihr Vorhaben …"></textarea>
</div>
${p(e,"submission")?`<div class="nc-form-block__submission nc-form-field--full-width">
${p(e,"hint-text")?'<p class="nc-form-block__hint-text">Antwort in 48h · DSGVO-konform</p>':""}
<button type="button" class="nc-button nc-button--accent nc-button--lg nc-form-block__submit">Nachricht senden</button>
</div>`:""}
</form>
</div>
</div>`},mn=Object.freeze(Object.defineProperty({__proto__:null,default:$n},Symbol.toStringTag,{value:"Module"})),J={error:"Bitte geben Sie eine gültige E-Mail-Adresse ein.",warning:"Diese Adresse wird bereits verwendet.",success:"Die E-Mail-Adresse ist gültig."},yn=(t,e)=>`
<p class="${e.klasse}" role="${e.wert("severity")==="success"?"status":"alert"}" id="${e.uid}"${e.attrs}>
${e.slot("icon")?`<span class="nc-form-error__icon">${$.fehler}</span>`:""}
<span class="nc-form-error__text">${J[e.wert("severity")]||J.error}</span>
</p>
`,wn=Object.freeze(Object.defineProperty({__proto__:null,default:yn},Symbol.toStringTag,{value:"Module"})),Sn=(t,e)=>e.wert("content")==="list"?`
<div class="${e.klasse}" id="${e.uid}"${e.attrs}>
<span class="nc-form-hint__text">Das Passwort braucht:</span>
<ul>
<li>mindestens 8 Zeichen</li>
<li>eine Ziffer</li>
<li>ein Sonderzeichen</li>
</ul>
</div>`:`
<p class="${e.klasse}" id="${e.uid}"${e.attrs}>
${e.slot("icon")?`<span class="nc-form-hint__icon">${$.info}</span>`:""}
<span class="nc-form-hint__text">Maximal 500 Zeichen.</span>
${e.slot("link")?'<a class="nc-form-hint__link" href="#" onclick="return false">Mehr erfahren</a>':""}
</p>`,jn=Object.freeze(Object.defineProperty({__proto__:null,default:Sn},Symbol.toStringTag,{value:"Module"})),xn=(t,e)=>`
<label class="${e.klasse}" for="${e.uid}-feld"${e.attrs}>
<span class="nc-form-label__text">E-Mail</span>
${e.slot("required")?'<span class="nc-form-label__required" aria-hidden="true">*</span>':""}
${e.slot("optional")?'<span class="nc-form-label__optional">(optional)</span>':""}
${e.slot("info")?`<span class="nc-form-label__info" title="Wir nutzen die Adresse nur für Rückfragen.">${$.info}</span>`:""}
</label>
`,zn=Object.freeze(Object.defineProperty({__proto__:null,default:xn},Symbol.toStringTag,{value:"Module"})),On=(t,e)=>{const n=e.slot("header")?`<div class="nc-form-section__header">
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
</div>`},Mn=Object.freeze(Object.defineProperty({__proto__:null,default:On},Symbol.toStringTag,{value:"Module"})),An=(t,e)=>{const n=e.deaktiviert?" disabled":"";return`
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
</form>`},Pn=Object.freeze(Object.defineProperty({__proto__:null,default:An},Symbol.toStringTag,{value:"Module"})),Q=[["SaaS Platform","PIIPE Workplace","Die intelligente Arbeitsplatz-Plattform für moderne Teams.","Jetzt starten"],["Neu","Analytics Dashboard","Echtzeit-Einblicke in Team-Performance und Projektfortschritt.","Dashboard entdecken"],["Security","Enterprise Security","ISO 27001 zertifiziert. Ende-zu-Ende-Verschlüsselung. DSGVO-konform.","Mehr erfahren"]],En='<svg class="nc-gallery__autoplay-pause" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>',Tn=(t,e)=>{const n=e.wert("navStyle")==="thumbnails",a=e.wert("height")==="viewport"?' style="--mod-gallery-height: 26rem;"':"";return`
<div class="${e.klasse}" role="group" aria-roledescription="Karussell" aria-label="Bild-Galerie"${a}${e.attrs}>
<div class="nc-gallery__track">
${Q.map(([s,r,o,i],l)=>`<div class="nc-gallery__slide${l===0?" is-active":""}" role="tabpanel" aria-roledescription="Slide" aria-label="${r}"${l?' aria-hidden="true"':""} data-slide-theme="dark">
<div class="nc-gallery__slide-bg"><img src="${v}" alt="" decoding="async"></div>
${p(e,"slide-overlay")?'<div class="nc-gallery__slide-overlay"></div>':""}
<div class="nc-gallery__slide-stage">
<div class="nc-gallery__slide-content">
<span class="nc-gallery__slide-tag">${s}</span>
<h3 class="nc-gallery__slide-title">${r}</h3>
<p class="nc-gallery__slide-description">${o}</p>
<div class="nc-gallery__slide-actions"><a class="nc-button nc-button--primary nc-button--lg" href="#" onclick="return false">${i}</a></div>
</div>
</div>
</div>`).join(`
`)}
</div>
${p(e,"controls")?`<div class="nc-gallery__controls">
<button class="nc-gallery__paddle nc-gallery__paddle--prev" type="button" aria-label="Vorheriger Slide">${z}</button>
<button class="nc-gallery__paddle nc-gallery__paddle--next" type="button" aria-label="Nächster Slide">${O}</button>
<nav class="nc-gallery__nav" role="tablist" aria-label="Slide-Navigation">
${Q.map(([,s],r)=>`<button class="nc-gallery__nav-dot${r===0?" is-active":""}" type="button" role="tab" aria-selected="${r===0}" aria-label="${s}">${n?`<img src="${v}" alt="">`:""}</button>`).join(`
`)}
</nav>
<button class="nc-gallery__autoplay" type="button" aria-label="Galerie pausieren">${En}</button>
</div>`:""}
</div>`},In=Object.freeze(Object.defineProperty({__proto__:null,default:Tn},Symbol.toStringTag,{value:"Module"})),Bn=(t,e)=>`
<section class="${e.klasse}"${e.attrs}>
<div class="nc-hero-tmob__content">
<div class="nc-hero-tmob__text">
<h2 class="nc-hero-tmob__headline nc-headline--display">Die Zukunft der Zusammenarbeit</h2>
<p class="nc-hero-tmob__subtext">PIIPE Workplace verbindet Teams, Projekte und Wissen in einer einzigen Plattform. Intuitiv, sicher und leistungsstark.</p>
</div>
<div class="nc-hero-tmob__media">
<img src="${v}" alt="Die Zukunft der Zusammenarbeit" decoding="async">
</div>
</div>
</section>
`,Cn=Object.freeze(Object.defineProperty({__proto__:null,default:Bn},Symbol.toStringTag,{value:"Module"})),Nn=(t,e)=>`
<section class="${e.klasse}" data-media-mode="expand"${e.attrs}>
<div class="nc-hero-tom__media" style="--tom-expand: 1;">
<img src="${v}" alt="" decoding="async">
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
`,Dn=Object.freeze(Object.defineProperty({__proto__:null,default:Nn},Symbol.toStringTag,{value:"Module"})),X='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9z"/></svg>',Ln=(t,e)=>{const a=e.wert("interactive")==="interactive"?`<button type="button" class="${e.klasse}" aria-label="Favorit"${e.attrs}>${X}</button>`:`<span class="${e.klasse}"${e.attrs}>${X}</span>`;return e.specimen.id==="in-context"?`<p style="display: inline-flex; align-items: center; gap: var(--fnd-spacing-02); margin: 0;">${a}<span>Als Favorit markiert</span></p>`:e.wert("color")==="inverse"?`<div style="background: var(--fnd-color-always-dark); padding: var(--fnd-spacing-03); border-radius: var(--fnd-radius-md); display: inline-flex;">${a}</div>`:a},Kn=Object.freeze(Object.defineProperty({__proto__:null,default:Ln},Symbol.toStringTag,{value:"Module"})),Wn=(t,e)=>e.slot("separator")?`<span><kbd class="${e.klasse}"${e.attrs}>Strg</kbd><span class="nc-kbd__separator">+</span><kbd class="${e.klasse}">K</kbd></span>`:`<kbd class="${e.klasse}"${e.attrs}>A</kbd>`,Fn=Object.freeze(Object.defineProperty({__proto__:null,default:Wn},Symbol.toStringTag,{value:"Module"})),Gn=(t,e)=>`<a href="#" onclick="return false" class="${e.klasse}"${e.attrs}>Mehr erfahren ${$.pfeil}</a>`,qn=Object.freeze(Object.defineProperty({__proto__:null,default:Gn},Symbol.toStringTag,{value:"Module"})),Y=["AWO","Dataport","degewo","Deutsche Rentenversicherung","Festo","KVNO"],Vn=(t,e)=>{const n=e.wert("layout")||"grid",a=e.wert("animation")==="fadein",s=(i,l)=>`<div class="nc-logo-pill${a?" is-visible":""}" aria-label="${i}"${l?' aria-hidden="true"':""}><img class="nc-logo-pill__img" src="${v}" alt="${l?"":i}" loading="lazy" decoding="async"></div>`,r=Y.map(i=>s(i,!1)).join(`
`),o=n==="marquee"?`<div class="nc-logo-wall__track">
${r}
${Y.map(i=>s(i,!0)).join(`
`)}
</div>`:r;return`
<div class="${e.klasse}" data-layout="${n}" aria-label="Unsere Kunden"${e.attrs}>
${o}
</div>`},Hn=Object.freeze(Object.defineProperty({__proto__:null,default:Vn},Symbol.toStringTag,{value:"Module"})),Rn=(t,e)=>`
<div class="${e.klasse}" aria-hidden="true"${e.attrs}>
<div class="nc-marquee__track">
<span class="nc-marquee__text">Kommunikation — Wissen — Events — Vernetzung — Anwendungen — </span>
<span class="nc-marquee__text">Kommunikation — Wissen — Events — Vernetzung — Anwendungen — </span>
</div>
</div>
`,Zn=Object.freeze(Object.defineProperty({__proto__:null,default:Rn},Symbol.toStringTag,{value:"Module"})),Un='<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg>',Jn=(t,e)=>{const n=`<span class="${e.klasse}"${e.attrs}>${Un}</span>`;switch(e.wert("element")){case"label":return`<span class="nc-nav__link">${n}<span class="nc-nav__label">Startseite</span></span>`;case"badge":return`<span class="nc-nav__link">${n}<span class="nc-nav__badge" aria-label="3 neue Einträge">3</span></span>`;default:return n}},Qn=Object.freeze(Object.defineProperty({__proto__:null,default:Jn},Symbol.toStringTag,{value:"Module"})),ee='<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"></polyline></svg>',Xn='<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',Yn=(t,e)=>{const n=e.hat("active")?' aria-current="page"':"";switch(e.wert("element")){case"toggle":return`<button class="nc-nav__toggle ${e.klasse}" type="button" aria-expanded="false" aria-haspopup="true"${e.attrs}>
<span class="nc-nav__label">Produkte</span>${ee}
</button>`;case"mobile":return`<div class="nc-nav__item"><a class="${e.klasse}" href="#" onclick="return false"${e.attrs}>Menü</a>
<button class="nc-mobile-toggle" type="button" aria-expanded="false" aria-label="Menü öffnen">${Xn}</button></div>`;case"lang":return`<div class="nc-nav__item"><a class="${e.klasse}" href="#" onclick="return false"${e.attrs}>Sprache</a>
<button class="nc-lang-toggle" type="button" aria-label="Sprache wählen">DE ${ee}</button></div>`;default:return`<a class="${e.klasse}" href="#" onclick="return false"${n}${e.attrs}><span class="nc-nav__label">Produkte</span></a>`}},ea=Object.freeze(Object.defineProperty({__proto__:null,default:Yn},Symbol.toStringTag,{value:"Module"})),ta=(t,e)=>`
<article class="${e.klasse}"${e.attrs}>
<header class="nc-news__hero">
${p(e,"hero-media")?`<div class="nc-news__hero-media"><img src="${v}" alt="" decoding="async" style="width: 100%; height: 100%; object-fit: cover;"></div>`:""}
${p(e,"hero-overlay")?'<div class="nc-news__hero-overlay" aria-hidden="true"></div>':""}
<div class="nc-news__hero-inner nc-container">
<div class="nc-news__eyebrow">
${p(e,"kicker")?'<span class="nc-news__kicker">Produktnews</span>':""}
<time class="nc-news__date" datetime="2026-07-01">Juli 2026</time>
</div>
${p(e,"title")?'<h2 class="nc-news__title">Aus PIIPE Workplace wird neo workplace</h2>':""}
${p(e,"lead")?'<p class="nc-news__lead">Mit dem Einzug von KI und dem funktionalen Ausbau des NEOCOSMO Produktuniversums werden die Namen der Produkte unter der Firmendachmarke vereinheitlicht.</p>':""}
<div class="nc-news__hero-cta"><a href="#" onclick="return false" class="nc-button nc-button--accent">Weiterlesen</a></div>
</div>
</header>
<div class="nc-news__body nc-container u-prose">
<p>neo AI – statt Suchen gibt es Antworten: sicher, offen, schnell. Perfekt für den unternehmensinternen Einsatz.</p>
</div>
<footer class="nc-news__footer nc-container">
<a href="#" onclick="return false">Alle News</a>
<a href="#" onclick="return false">Pressekontakt</a>
</footer>
</article>`,na=Object.freeze(Object.defineProperty({__proto__:null,default:ta},Symbol.toStringTag,{value:"Module"})),aa=(t,e)=>{const n=e.hat("filled")?["7","3","9","1","4","2"]:["7","3","","","",""],a=e.deaktiviert?" disabled":"",s=n.map((r,o)=>{const i=`<input class="nc-otp-input__cell${r?" nc-otp-input__cell--filled":""}" type="text" maxlength="1" inputmode="numeric" pattern="[0-9]*" aria-label="Stelle ${o+1}"${r?` value="${r}"`:""}${a}>`;return o===3&&e.slot("separator")?`<span class="nc-otp-input__separator" aria-hidden="true">–</span>${i}`:i});return`
<div class="${e.klasse}" role="group" aria-label="Bestätigungscode"${e.attrs}>
${s.join(`
`)}
</div>`},sa=Object.freeze(Object.defineProperty({__proto__:null,default:aa},Symbol.toStringTag,{value:"Module"})),ra=(t,e)=>`
<div class="${e.klasse}"${e.attrs}>
<div class="nc-price">€ ${e.wert("variant")==="featured"?"12":"0"}</div>
<ul class="nc-pricing-features">
<li class="nc-pricing-features__item">Feature A</li>
<li class="nc-pricing-features__item">Feature B</li>
</ul>
</div>
`,la=Object.freeze(Object.defineProperty({__proto__:null,default:ra},Symbol.toStringTag,{value:"Module"})),te=[["Zugang","Anmelden wie gewohnt — auch ohne Firmen-E-Mail","Wer in der Produktion arbeitet, hat oft gar keine Adresse im Unternehmen. Der Zugang über Personalnummer oder Einladungscode löst genau das.","var(--fnd-color-accent, #aef359)"],["Orientierung","Drei Fingertipps bis zur wichtigsten Information","Die Startseite zeigt, was heute zählt. Alles andere liegt eine Ebene tiefer und bleibt auffindbar.","var(--fnd-color-text-info, #3b82f6)"],["Austausch","Die Spätschicht antwortet, bevor Sie zu Hause sind","Communities, Blogs und das Verzeichnis sind vollständig dabei: lesen, posten, kommentieren.","var(--fnd-color-text-warning, #f59e0b)"]],ia=(t,e)=>{const n=e.wert("interaktion")==="accordion",a=e.slot("option-indicator")||e.wert("optionStyle")==="indicator",s=e.wert("mediaFrame")==="device",r=te.map(([,d],_)=>`<img class="nc-product-showcase__media-item${_===0?" is-active":""}" src="${v}" alt="${d}" decoding="async">`).join(`
`),o=s?`<div class="nc-device"><div class="nc-device__screen">
${r}
</div></div>`:r,i=d=>a?`<span class="nc-product-showcase__option-indicator" style="background-color: ${d};" aria-hidden="true"></span>`:"",l=te.map(([d,_,c,u],h)=>n?`<div class="nc-product-showcase__option${h===0?" is-active":""}">
<button type="button" class="nc-product-showcase__trigger" id="${e.uid}-t${h}" aria-expanded="${h===0}" aria-controls="${e.uid}-p${h}">${i(u)}
<span class="nc-product-showcase__label">${d}</span>
<span class="nc-product-showcase__title">${_}</span>
</button>
<div class="nc-product-showcase__panel" id="${e.uid}-p${h}" role="region" aria-labelledby="${e.uid}-t${h}"><div><p class="nc-product-showcase__description-text">${c}</p></div></div>
</div>`:`<div class="nc-product-showcase__option-group">
<button type="button" class="nc-product-showcase__option${h===0?" is-active":""}" aria-pressed="${h===0}">${i(u)}<span class="nc-product-showcase__title">${_}</span></button>
${h===0?`<div class="nc-product-showcase__description"><p class="nc-product-showcase__description-text">${c}</p></div>`:""}
</div>`).join(`
`);return`
<div class="${e.klasse}"${e.attrs}>
<div class="nc-product-showcase__media-panel">
${o}
</div>
<div class="nc-product-showcase__options">
${l}
</div>
</div>`},oa=Object.freeze(Object.defineProperty({__proto__:null,default:ia},Symbol.toStringTag,{value:"Module"})),ca=(t,e)=>{const n=e.wert("mode")==="indeterminate",a=n?"":' aria-valuenow="60" aria-valuemin="0" aria-valuemax="100"';return`
<div class="${e.klasse}" role="progressbar" aria-label="Fortschritt"${a}${e.attrs}>
<div class="nc-progress__fill"${n?"":' style="width: 60%"'}></div>
</div>`},da=Object.freeze(Object.defineProperty({__proto__:null,default:ca},Symbol.toStringTag,{value:"Module"})),T='<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"></path></svg>',ua=[["Wie können wir effizienter werden?","Was wäre wenn alles möglich ist?","0"],["Welche Lösung passt zu uns?","Wie wachsen wir nachhaltig?","-20%"]],_a=(t,e)=>{const n=e.wert("variant")==="with-text";return`
<section class="${e.klasse}"${e.attrs}>
${ua.map(([a,s,r])=>`<hr>
<div class="question-text-row" style="animation: none; transform: translateX(${r});" aria-hidden="true">
<span class="question-text">${a} ${T} ${s} ${T} ${a} ${T} ${s} ${T}</span>
</div>`).join(`
`)}
<hr>
<div class="question-action-section${n?" with-text":""}">
${n?'<div class="question-text-container question-paragraphs"><p>Gute Fragen verdienen gute Antworten. Wir zeigen Ihnen, wie andere Organisationen sie gefunden haben.</p></div>':""}
<div class="question-buttons">
<button class="nc-button nc-button--primary" type="button">Demo vereinbaren</button>
<button class="nc-button nc-button--outline" type="button">Mehr erfahren</button>
</div>
</div>
<hr>
</section>`},pa=Object.freeze(Object.defineProperty({__proto__:null,default:_a},Symbol.toStringTag,{value:"Module"})),ha=[["rot","Rot",!0],["gruen","Grün"],["blau","Blau"]],ba=(t,e)=>{const n=e.deaktiviert?" disabled":"",a=e.slot("hint")||e.hat("error")?`<p class="nc-radio-group__hint">${e.hat("error")?"Bitte eine Farbe wählen.":"Eine Option ist Pflicht."}</p>`:"";return`
<div class="${e.klasse}" role="radiogroup" aria-label="Lieblingsfarbe"${e.attrs}>
${ha.map(([s,r,o])=>`<label class="nc-radio">
<input type="radio" class="nc-radio__input" name="${e.uid}" value="${s}"${o?" checked":""}${n}>
<span class="nc-radio__control"></span>
<span class="nc-radio__label">${r}</span>
</label>`).join(`
`)}
${a}
</div>`},va=Object.freeze(Object.defineProperty({__proto__:null,default:ba},Symbol.toStringTag,{value:"Module"})),fa=(t,e)=>`
<ul class="${e.klasse}"${e.attrs}>
<li class="nc-security-list__item">Zwei-Faktor-Authentifizierung</li>
<li class="nc-security-list__item">Automatische Sicherheitsupdates</li>
<li class="nc-security-list__item">Penetrationstests durch Dritte</li>
</ul>
`,ga=Object.freeze(Object.defineProperty({__proto__:null,default:fa},Symbol.toStringTag,{value:"Module"})),ka=(t,e)=>`<div class="${e.klasse}" aria-hidden="true"${e.attrs}></div>`,$a=Object.freeze(Object.defineProperty({__proto__:null,default:ka},Symbol.toStringTag,{value:"Module"})),ne=[["neo workplace","Social Intranet und Mitarbeitendenportal","Das soziale Herzstück für Ihre digitale Arbeitswelt. Informationen fließen, Teams arbeiten zusammen, und Ihr Wissen ist auf Knopfdruck verfügbar.",["Personalisierter News-Feed und Newskanäle","Wissens- und Inhaltsseiten","Vernetzung und Zusammenarbeit"]],["neo app","Die Mitarbeiter-App","Alle erreichen — auch ohne Schreibtisch. Informationen, Services und Austausch in einer App.",["Push-Benachrichtigungen","Login ohne Firmen-E-Mail","Offline lesen"]],["neo AI","Die Intranet-KI","Statt Suchen gibt es Antworten: sicher, offen, schnell — perfekt für den unternehmensinternen Einsatz.",["Antworten mit Quellen","Datenschutzkonform","Eigene Wissensbasis"]]];function de(t,e,n){const a=t.uid,[,s,r,o]=ne[n.aktiv];return`
<div class="${e}"${n.autoplay?` data-autoplay="${n.autoplay}"`:""}${t.attrsOhne("aria-selected")}>
<div class="nc-solution-tabs__tablist" role="tablist">
${ne.map(([i],l)=>`<button class="nc-solution-tabs__tab${l===n.aktiv?" is-active":""}" type="button" role="tab" id="${a}-t${l}" aria-controls="${a}-p${l}" aria-selected="${l===n.aktiv}" tabindex="${l===n.aktiv?0:-1}">${i}${n.fortschritt?`<span class="nc-solution-tabs__progress" aria-hidden="true"${l===n.aktiv?' style="--progress: 0.4;"':""}></span>`:""}</button>`).join(`
`)}
</div>
<div class="nc-solution-tabs__panel nc-tab-nav__panel is-active" role="tabpanel" id="${a}-p${n.aktiv}" aria-labelledby="${a}-t${n.aktiv}">
<div class="nc-tab-nav__panel-body">
<h3 class="nc-solution-tabs__panel-title">${s}</h3>
<p class="nc-solution-tabs__panel-text">${r}</p>
${n.features?`<div class="nc-tab-nav__module">
<ul class="nc-feature-list__items">
${o.map(i=>`<li class="nc-feature-list__item"><span class="nc-feature-list__icon">${ce}</span><span class="nc-feature-list__item-text">${i}</span></li>`).join(`
`)}
</ul>
</div>`:""}
${n.cta?'<a href="#" onclick="return false" class="nc-button nc-button--accent nc-button--lg nc-solution-tabs__cta"><span>Mehr erfahren</span></a>':""}
</div>
</div>
</div>`}const ma=(t,e)=>de(e,`${e.basisKlasse} nc-tab-nav`,{aktiv:e.hat("active")?1:0,autoplay:e.wert("autoplay"),fortschritt:e.wert("autoplay")==="on"&&p(e,"progress"),features:p(e,"features"),cta:p(e,"cta")}),ya=Object.freeze(Object.defineProperty({__proto__:null,default:ma},Symbol.toStringTag,{value:"Module"})),wa=(t,e)=>`<div class="${e.klasse}" role="status" aria-label="Wird geladen"${e.attrs}></div>`,Sa=Object.freeze(Object.defineProperty({__proto__:null,default:wa},Symbol.toStringTag,{value:"Module"})),ja=(t,e)=>{const n=e.wert("variant"),a=n&&n!=="default"?` ${n}-square`:"",s=n==="white"?' style="background: var(--fnd-color-always-dark); color: var(--fnd-color-always-light); padding: var(--fnd-spacing-02) var(--fnd-spacing-03);"':"";return`<span class="${e.klasse}${a}"${s}${e.attrs}>Aktive Nutzer</span>`},xa=Object.freeze(Object.defineProperty({__proto__:null,default:ja},Symbol.toStringTag,{value:"Module"})),za=(t,e)=>`<span class="${e.klasse}" role="img" aria-label="Status: ${k(e.wert("variant")||"neutral")}"${e.attrs}></span>`,Oa=Object.freeze(Object.defineProperty({__proto__:null,default:za},Symbol.toStringTag,{value:"Module"})),Ma='<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"></line></svg>',Aa='<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>',Pa=(t,e)=>{const n=e.deaktiviert?" disabled":"";return`
<div class="${e.klasse}" role="group" aria-label="Menge"${e.attrs}>
<button class="nc-stepper__decrement" type="button" aria-label="Wert verringern"${n}>${Ma}</button>
<input class="nc-stepper__input" type="number" value="5" min="0" max="99" aria-label="Menge"${n}>
<button class="nc-stepper__increment" type="button" aria-label="Wert erhöhen"${n}>${Aa}</button>
</div>`},Ea=Object.freeze(Object.defineProperty({__proto__:null,default:Pa},Symbol.toStringTag,{value:"Module"})),Ta=(t,e)=>`
<div class="${e.klasse} nc-story-gallery--nav-below" style="--sg-card-height: 320px;" role="group" aria-roledescription="Galerie" aria-label="Screenshot-System"${e.attrs}>
<div class="nc-story-gallery__scroll" tabindex="0">
<ul class="nc-story-gallery__track" role="list">
<li class="nc-story-gallery__card" style="--sg-card-ratio-w: 4; --sg-card-ratio-h: 3;">
<div class="nc-story-gallery__media nc-shot" data-nc-shot="none"><img src="${v}" alt="Fokus-Crop" class="nc-shot__img" style="object-position: 32% 38%; transform-origin: 32% 38%; transform: scale(1.6);"></div>
<div class="nc-story-gallery__caption"><h3 class="nc-story-gallery__title">Fokus-Crop</h3><p class="nc-story-gallery__desc">Ein Master-Bild, Ausschnitt per Fokuspunkt + Zoom.</p></div>
</li>
<li class="nc-story-gallery__card" style="--sg-card-ratio-w: 16; --sg-card-ratio-h: 10;">
<div class="nc-story-gallery__media nc-shot" data-nc-shot="frame">
<div class="nc-shot__frame nc-shot--shadow">
<div class="nc-shot__chrome-bar"><span class="nc-shot__chrome-dot"></span><span class="nc-shot__chrome-dot"></span><span class="nc-shot__chrome-dot"></span><span class="nc-shot__chrome-url">workplace.neocosmo.de</span></div>
<div class="nc-shot__viewport"><img src="${v}" alt="Device-Frame" class="nc-shot__img"></div>
</div>
</div>
<div class="nc-story-gallery__caption"><h3 class="nc-story-gallery__title">Device-Frame</h3><p class="nc-story-gallery__desc">Derselbe Screenshot im Browser-Rahmen.</p></div>
</li>
<li class="nc-story-gallery__card" style="--sg-card-ratio-w: 4; --sg-card-ratio-h: 3;">
<div class="nc-story-gallery__media nc-shot" data-nc-shot="hotspots">
<img src="${v}" alt="Hotspots" class="nc-shot__img">
<button type="button" class="nc-shot__hotspot" aria-label="Detail 1" style="left: 30%; top: 32%;"></button>
<button type="button" class="nc-shot__hotspot" aria-label="Detail 2" style="left: 70%; top: 60%;"></button>
</div>
<div class="nc-story-gallery__caption"><h3 class="nc-story-gallery__title">Hotspots</h3><p class="nc-story-gallery__desc">Annotationen mit Detail-Zoom.</p></div>
</li>
</ul>
</div>
<div class="nc-story-gallery__footer">
<div class="nc-story-gallery__paddles--below">
<button type="button" class="nc-story-gallery__paddle" aria-label="Zurück">${z}</button>
<button type="button" class="nc-story-gallery__paddle" aria-label="Weiter">${O}</button>
</div>
</div>
</div>`,Ia=Object.freeze(Object.defineProperty({__proto__:null,default:Ta},Symbol.toStringTag,{value:"Module"})),Ba=(t,e)=>de(e,`nc-solution-tabs ${e.basisKlasse}`,{aktiv:e.hat("active")?1:0,fortschritt:!1,features:!0,cta:!0}),Ca=Object.freeze(Object.defineProperty({__proto__:null,default:Ba},Symbol.toStringTag,{value:"Module"})),Na='<svg class="nc-tbl-icon nc-tbl-icon--check" width="32" height="32" viewBox="0 0 36 36" fill="none" aria-label="enthalten"><circle cx="18" cy="18" r="18" fill="#AEF359"></circle><path d="M12 18L16 22L24 14" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>',Da='<svg class="nc-tbl-icon nc-tbl-icon--dash" width="32" height="32" viewBox="0 0 36 36" fill="none" aria-label="nicht enthalten"><path d="M11 18H25" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>',La=[["News, Newskanäle",!0,!0],["Inhalts- und Wissensseiten",!0,!0],["Veranstaltungskalender &amp; Event-Seiten",!0,!0],["Mitarbeiterverzeichnis &amp; Nutzerprofile",!1,!0],["Personalisierte Toolbar &amp; Schnellzugriff",!1,!0]],ae=t=>`<td><div class="nc-tbl-cell nc-tbl-cell--icon">${t?Na:Da}</div></td>`,Ka=(t,e)=>`
<div class="${e.klasse}"${e.attrs}>
<div class="nc-compare-table nc-compare-table--striped nc-compare-table--full-width">
<table>
<thead><tr><th scope="col">Funktion</th><th scope="col">Standard</th><th scope="col">Premium</th></tr></thead>
<tbody>
<tr class="nc-compare-table__section-row"><th scope="rowgroup" colspan="3"><div class="nc-tbl-cell"><p class="nc-tbl-cell__text">FÜR MITARBEITENDE / ENDNUTZER</p></div></th></tr>
${La.map(([n,a,s])=>`<tr><th scope="row"><div class="nc-tbl-cell"><p class="nc-tbl-cell__text">${n}</p></div></th>${ae(a)}${ae(s)}</tr>`).join(`
`)}
</tbody>
</table>
</div>
</div>`,Wa=Object.freeze(Object.defineProperty({__proto__:null,default:Ka},Symbol.toStringTag,{value:"Module"})),Fa={haus:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 10.5 12 3l9 7.5V21H3z"></path></svg>',person:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="4"></circle><path d="M4 21a8 8 0 0 1 16 0"></path></svg>',lupe:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7"></circle><path d="m20 20-3.5-3.5"></path></svg>',glocke:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path></svg>'},L=[["Startseite","haus"],["Profil","person"],["Suche","lupe"],["Benachrichtigungen","glocke"]],Ga=(t,e)=>{const n=e.uid,a=e.hat("active")?1:0,s=e.wert("overflow")==="scrollable",r=e.wert("orientation")==="vertical";return`
<div class="${e.basisKlasse}"${e.attrsOhne("aria-disabled","aria-selected")}>
<div class="nc-tabs__list" role="tablist" aria-label="Demo Tabs"${r?' aria-orientation="vertical"':""}>
${s&&p(e,"scroll-btn")?`<button type="button" class="nc-tabs__scroll-btn nc-tabs__scroll-btn--prev" aria-label="Nach links">${z}</button>`:""}
${L.map(([o,i],l)=>{const d=e.deaktiviert&&l===L.length-1;return`<button class="nc-tabs__trigger${l===a?" is-active":""}" role="tab" type="button" id="${n}-t${l}" aria-controls="${n}-p${l}" aria-selected="${l===a}" tabindex="${l===a?0:-1}"${d?' aria-disabled="true" disabled':""}>
<span class="nc-tabs__trigger-icon">${Fa[i]}</span><span class="nc-tabs__trigger-label">${o}</span></button>`}).join(`
`)}
${s&&p(e,"scroll-btn")?`<button type="button" class="nc-tabs__scroll-btn nc-tabs__scroll-btn--next" aria-label="Nach rechts">${O}</button>`:""}
</div>
${L.map(([o],i)=>`<div class="nc-tabs__panel${i===a?" is-active":""}" role="tabpanel" id="${n}-p${i}" aria-labelledby="${n}-t${i}"${i===a?"":" hidden"}><p style="padding: var(--fnd-spacing-04); color: var(--fnd-color-text-mid);">${o}-Panel.</p></div>`).join(`
`)}
</div>`},qa=Object.freeze(Object.defineProperty({__proto__:null,default:Ga},Symbol.toStringTag,{value:"Module"})),Va='<svg class="nc-tbl-icon nc-tbl-icon--check" width="32" height="32" viewBox="0 0 36 36" fill="none" aria-label="enthalten"><circle cx="18" cy="18" r="18"></circle><path d="M12 18L16 22L24 14" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>',Ha=(t,e)=>e.wert("variante")==="icon"?`<div class="${e.klasse}"${e.attrs}>${Va}</div>`:`
<div class="${e.klasse}"${e.attrs}>
<p class="nc-tbl-cell__text">On-Premise<button class="nc-tbl-cell__info-btn" type="button" aria-label="Mehr Informationen">${$.info}</button></p>
<p class="nc-tbl-cell__sub">Betrieb im eigenen Rechenzentrum</p>
</div>`,Ra=Object.freeze(Object.defineProperty({__proto__:null,default:Ha},Symbol.toStringTag,{value:"Module"})),Za=[["„Excellente Dokumentation und klare Muster.“","Pia Weber","Product Manager"],["„Die Einführung lief schneller als geplant.“","Jonas Kramer","Leiter Interne Kommunikation"],["„Endlich erreichen wir auch die Produktion.“","Aylin Demir","HR Business Partnerin"]],Ua=(t,e)=>{const n=e.wert("variante")==="carousel";return`
<div class="${e.klasse}"${e.attrs}>
${Za.map(([a,s,r])=>`<blockquote class="nc-testimonial">
<p class="nc-testimonial__quote">${a}</p>
<footer class="nc-testimonial__author"><div class="nc-testimonial__meta"><span class="nc-testimonial__name">${s}</span><span class="nc-testimonial__role">${r}</span></div></footer>
</blockquote>`).join(`
`)}
${n||e.slot("nav")?`<div class="nc-testimonial-grid__nav">
<button type="button" class="nc-testimonial-grid__btn" aria-label="Zurück"${e.deaktiviert?" disabled":""}>${z}</button>
<button type="button" class="nc-testimonial-grid__btn" aria-label="Weiter">${O}</button>
</div>`:""}
</div>`},Ja=Object.freeze(Object.defineProperty({__proto__:null,default:Ua},Symbol.toStringTag,{value:"Module"})),Qa=(t,e)=>`
<blockquote class="${e.klasse}"${e.attrs}>
<p class="nc-testimonial__quote">„Exzellente Dokumentation und klare Muster.“</p>
<footer class="nc-testimonial__author">
<div class="nc-testimonial__meta">
<span class="nc-testimonial__name">Pia Weber</span>
<span class="nc-testimonial__role">Product Manager</span>
</div>
</footer>
</blockquote>
`,Xa=Object.freeze(Object.defineProperty({__proto__:null,default:Qa},Symbol.toStringTag,{value:"Module"})),Ya=(t,e)=>{switch(e.wert("variant")){case"eyebrow":return`<p class="nc-eyebrow" data-recipe-wurzel="${e.root}"${e.attrs}>Digital Workplace</p>`;case"lead":return`<p class="nc-lead" data-recipe-wurzel="${e.root}"${e.attrs}>Die vollständige Lösung für Ihr digitales Business.</p>`;default:return`<h2 class="${e.klasse}"${e.attrs}>Jetzt starten</h2>`}},es=Object.freeze(Object.defineProperty({__proto__:null,default:Ya},Symbol.toStringTag,{value:"Module"})),ts=(t,e)=>`
<div class="${e.klasse}"${e.attrs}>
<div class="nc-text-media__grid">
<div class="nc-text-media__media">
<img src="${v}" alt="" class="nc-text-media__image nc-media-frame" loading="lazy">
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
`,ns=Object.freeze(Object.defineProperty({__proto__:null,default:ts},Symbol.toStringTag,{value:"Module"})),as=['<svg aria-hidden="true" focusable="false" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"></path></svg>','<svg aria-hidden="true" focusable="false" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"></path><path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2M12 19v2M3 12h2M19 12h2"></path></svg>','<svg aria-hidden="true" focusable="false" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941"></path></svg>'],ss=[["Woche 1–2","danger","Gemeinsam","Phase 1","Planung","Wir lernen uns kennen — und hören genau hin.",["Kick-off-Workshop","Bedarfsanalyse &amp; IT-Infrastruktur-Klärung"],"Beratung anfragen"],["Woche 3–5","info","NEOCOSMO","Phase 2","Aufbau","Wir bauen — Sie arbeiten weiter.",["Konfiguration Standardsystem &amp; Anpassung","Corporate-Design-Anpassung"],"Leistungen ansehen"],["Ab Monat 3","accent","Kunde","Phase 3","Betrieb &amp; Ausbau","Wir bleiben dabei — auch danach.",["Redaktions- &amp; Kundensupport","Kundenspezifische Erweiterungen"],"Support kontaktieren"]],rs=(t,e)=>{const n=e.wert("variant")||"default",a=e.wert("nodeStatus"),s=`nc-timeline__node${a&&a!=="default"?` nc-timeline__node--${a}`:""}`,r=n==="compact";return`
<ol class="${e.klasse}" aria-label="In drei Schritten zur produktiven Plattform"${e.attrs}>
${ss.map(([o,i,l,d,_,c,u,h],M)=>`<li class="nc-timeline__item is-visible">
<div class="${s}">${n==="icon"?as[M]:""}</div>
<div class="nc-timeline__content">
<div class="nc-timeline__meta">
${p(e,"period")?`<span class="nc-timeline__period">${o}</span>`:""}
${p(e,"badge")?`<span class="nc-timeline__badge nc-timeline__badge--${i}">${l}</span>`:""}
</div>
${p(e,"phase")?`<p class="nc-timeline__phase">${d}</p>`:""}
<h3 class="nc-timeline__title">${_}</h3>
${p(e,"lead")?`<p class="nc-timeline__lead">${c}</p>`:""}
${!r&&p(e,"list")?`<ul class="nc-timeline__list">${u.map(m=>`<li>${m}</li>`).join("")}</ul>`:""}
${!r&&p(e,"cta")?`<div class="nc-timeline__cta"><a href="#" onclick="return false" class="nc-button nc-button--primary"><span>${h}</span></a></div>`:""}
</div>
</li>`).join(`
`)}
</ol>`},ls=Object.freeze(Object.defineProperty({__proto__:null,default:rs},Symbol.toStringTag,{value:"Module"})),is='<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>',se=["Vorname ist ein Pflichtfeld","E-Mail-Adresse ist ungültig","Passwort muss mindestens 8 Zeichen lang sein"],os=(t,e)=>{const n=e.wert("content")==="with-links";return`
<div class="${e.klasse}" role="alert"${e.attrs}>
${e.slot("icon")?`<span class="nc-validation-summary__icon">${is}</span>`:""}
<div>
<strong class="nc-validation-summary__title">Es sind ${se.length} Fehler aufgetreten:</strong>
<ul class="nc-validation-summary__list">
${se.map(a=>`<li class="nc-validation-summary__item">${n?`<a href="#" onclick="return false">${a}</a>`:a}</li>`).join(`
`)}
</ul>
</div>
</div>`},cs=Object.freeze(Object.defineProperty({__proto__:null,default:os},Symbol.toStringTag,{value:"Module"})),ds=(t,e)=>`
<div class="${e.klasse}"${e.attrs}>
<div class="nc-video__media${e.hat("playing")?" is-playing":""}">
<img src="${v}" alt="Video-Vorschaubild">
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
`,us=Object.freeze(Object.defineProperty({__proto__:null,default:ds},Symbol.toStringTag,{value:"Module"})),_s=(t,e)=>{const n=e.wert("behavior")==="autoplay",a=n||e.hat("playing");return`
<div class="${e.klasse}"${e.attrs}>
<video poster="${v}" muted playsinline preload="none"${n?" loop":""} aria-label="Produktvideo" style="width: 100%; display: block;"></video>
${!a&&p(e,"play-sign")?'<span class="play-sign" aria-hidden="true"></span>':""}
${!n&&p(e,"open-button")?'<button type="button" class="open-button" aria-label="Video abspielen"></button>':""}
</div>`},ps=Object.freeze(Object.defineProperty({__proto__:null,default:_s},Symbol.toStringTag,{value:"Module"})),hs=Object.assign({"./app-store.js":Qe,"./aspect-ratio.js":Ye,"./badge.js":tt,"./bento-grid.js":rt,"./card-cta.js":it,"./card-grid-cta.js":_t,"./card-grid.js":bt,"./carousel.js":gt,"./chapter-nav.js":$t,"./checkbox-group.js":wt,"./compare-table.js":zt,"./cta.js":Mt,"./device.js":Pt,"./divider.js":Tt,"./empty-state.js":Bt,"./event.js":Wt,"./events.js":qt,"./expanding-panels.js":Rt,"./facts.js":Jt,"./fade-gallery.js":Xt,"./faq.js":en,"./feature-accordion.js":an,"./feature-list.js":ln,"./file-upload.js":_n,"./footer.js":fn,"./form-actions.js":kn,"./form-block.js":mn,"./form-error.js":wn,"./form-hint.js":jn,"./form-label.js":zn,"./form-section.js":Mn,"./form.js":Pn,"./gallery.js":In,"./hero-tmob.js":Cn,"./hero-tom.js":Dn,"./icon.js":Kn,"./kbd.js":Fn,"./link-with-arrow.js":qn,"./logo-wall.js":Hn,"./marquee.js":Zn,"./nav-atoms.js":Qn,"./nav-molecules.js":ea,"./news.js":na,"./otp-input.js":sa,"./pricing.js":la,"./product-showcase.js":oa,"./progress.js":da,"./question.js":pa,"./radio-group.js":va,"./security-list.js":ga,"./skeleton.js":$a,"./solution-tabs.js":ya,"./spinner.js":Sa,"./square.js":xa,"./status.js":Oa,"./stepper.js":Ea,"./story-gallery.js":Ia,"./tab-nav.js":Ca,"./table-block.js":Wa,"./tabs.js":qa,"./tbl-cell.js":Ra,"./testimonial-grid.js":Ja,"./testimonial.js":Xa,"./text-blocks.js":es,"./text-media.js":ns,"./timeline.js":ls,"./validation-summary.js":cs,"./video-section.js":us,"./video.js":ps}),ue={};for(const[t,e]of Object.entries(hs)){const n=t.slice(2,-3);typeof e.default=="function"&&(ue[n]=e.default)}function bs(t){return ue[t]||null}const vs=["data-component-id"],fs={class:"arena-category-divider"},gs={class:"arena-category-label"},ks=["data-specimen-id","data-token-groups"],$s={key:0,class:"ra-desc"},ms={key:0,class:"ra-axis-label"},ys={class:"ra-cells"},ws=["data-specimen-id","data-cell-id","data-token-groups","data-quelle"],Ss=["innerHTML"],js={class:"ra-cell-label"},xs={key:1,class:"ra-hinweis"},zs={key:2,class:"ra-axes"},Os={key:3,class:"ra-tokens"},As={__name:"RecipeArena",props:{componentId:{type:String,required:!0}},setup(t){const e=t,n=ge(),{recipe:a}=ke(E(()=>e.componentId)),{isHighlighted:s,highlightStyle:r}=$e(e.componentId),o=E(()=>(n.state.previewMode==="split"?"light":n.state.previewMode)==="dark"?"neo-dark-theme":"neo-light-theme"),i=E(()=>a.value?Oe(a.value):null),l=E(()=>{const d=i.value;if(!d)return[];const _=bs(e.componentId);return d.specimens.map(c=>Ue(c,d,e.componentId,_))});return(d,_)=>l.value.length?(f(),g("div",{key:0,class:"recipe-arena","data-component-id":t.componentId},[(f(!0),g(x,null,A(l.value,c=>(f(),g(x,{key:c.id},[w("div",fs,[w("span",gs,S(c.label),1)]),w("div",{class:"arena-specimen ra-specimen","data-specimen-id":c.id,"data-token-groups":c.tokenGroups.join(",")},[c.description?(f(),g("p",$s,S(c.description),1)):j("",!0),w("div",{class:me(["ra-preview",[o.value,`ra-preview--${c.anordnung}`]])},[(f(!0),g(x,null,A(c.zeilen,u=>(f(),g("div",{key:u.key,class:"ra-matrix-row"},[u.label?(f(),g("span",ms,S(u.label),1)):j("",!0),w("div",ys,[(f(!0),g(x,null,A(u.zellen,h=>(f(),g("figure",{key:h.id,class:"ra-cell","data-specimen-id":c.id,"data-cell-id":h.id,"data-token-groups":h.tokenGroups.join(","),"data-quelle":h.quelle},[w("div",{class:"ra-live-component",innerHTML:h.html},null,8,Ss),F(s)?(f(),g("div",{key:0,class:"ra-highlight",style:ye(F(r))},null,4)):j("",!0),w("figcaption",js,S(h.label),1)],8,ws))),128))])]))),128))],2),c.nurInteraktiv?(f(),g("p",xs," * Hover und Fokus kennt das Design System nur als Pseudoklasse — die Zelle zeigt den Ruhezustand. Zum Prüfen mit der Maus darüberfahren bzw. per Tab-Taste fokussieren. ")):j("",!0),c.achsen.length?(f(),g("div",zs,[(f(!0),g(x,null,A(c.achsen,u=>(f(),g("span",{key:u.name,class:"ra-axis-pill"},S(u.name)+": "+S(u.werte),1))),128))])):j("",!0),c.tokenGroups.length?(f(),g("div",Os,[(f(!0),g(x,null,A(c.tokenGroups,u=>(f(),g("span",{key:u,class:"ra-token-pill"},S(u),1))),128))])):j("",!0)],8,ks)],64))),128))],8,vs)):j("",!0)}};export{As as default};
