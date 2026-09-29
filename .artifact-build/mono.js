<script>
(function(){
  var D = MONO;
  var spec = document.getElementById("spec"), strip = document.getElementById("ladders");
  if(!spec || !strip) return;

  var ORDER = ["graphit","neutral-beige","ivory","neutral-taupe","neutral-pearl","neutral-salbei","neutral-blau"];
  var HINT = {graphit:"Voreinstellung",  "neutral-beige":"Lösung und Anwendung", ivory:"Menschen und Geschichten",
              "neutral-taupe":"Unternehmen", "neutral-pearl":"Zahlen und Konditionen",
              "neutral-salbei":"Reserve", "neutral-blau":"Reserve"};
  var STEPS = ["50","100","200","300","400","500","600","700","800","900","950"];

  // n = Neutralstufe, a = Akzentstufe, sonst wörtlich
  var SPEC = {
    light:{
      "surface-stage":"n100","surface-card":"#ffffff","surface-base":"#ffffff","surface-01":"n50",
      "surface-02":"n100","surface-03":"n200","surface-sunken":"n100",
      "text-primary":"n950","text-secondary":"n700","text-tertiary":"n600","text-inverse":"n50","text-disabled":"n500",
      "border-subtle":"n200","border-control":"n500","border-emphasis":"n950",
      "interactive-default":"n900","interactive-on":"n50","interactive-quiet-hover":"n100",
      "accent-surface":"a500","accent-on":"#000000","accent-line":"a700","accent-underline":"a500","accent-text":"a800",
      "feedback-success":"#00717a","feedback-warning":"#92500a","feedback-danger":"#a31f1f","feedback-info":"#2563eb",
      "focus-inner":"n950","focus-outer":"n50",
      "elev-1":"0 1px 2px rgb(0 0 0 / .07)","elev-2":"0 6px 16px rgb(0 0 0 / .13)","elev-3":"0 18px 40px rgb(0 0 0 / .18)",
      "elev-1-s":"#ffffff","elev-2-s":"#ffffff","elev-3-s":"#ffffff"
    },
    dark:{
      "surface-stage":"n950","surface-card":"n900","surface-base":"n950","surface-01":"n900",
      "surface-02":"n800","surface-03":"n700","surface-sunken":"#000000",
      "text-primary":"n100","text-secondary":"n400","text-tertiary":"n500","text-inverse":"n950","text-disabled":"n600",
      "border-subtle":"n800","border-control":"n600","border-emphasis":"n50",
      "interactive-default":"n100","interactive-on":"n950","interactive-quiet-hover":"n800",
      "accent-surface":"a500","accent-on":"#000000","accent-line":"a600","accent-underline":"a500","accent-text":"a500",
      "feedback-success":"#0098a4","feedback-warning":"#e0a94e","feedback-danger":"#f08a8a","feedback-info":"#60a5fa",
      "focus-inner":"n950","focus-outer":"n50",
      "elev-1":"none","elev-2":"none","elev-3":"0 18px 40px rgb(0 0 0 / .55)",
      "elev-1-s":"n900","elev-2-s":"n800","elev-3-s":"n700"
    }
  };

  var curLad = "graphit", curMode = "light";

  function val(token, shades){
    if(token.charAt(0) === "n") return shades[token.slice(1)];
    if(token.charAt(0) === "a") return D.accent[token.slice(1)];
    return token;
  }

  function apply(){
    var shades = D.leitern[curLad].shades, s = SPEC[curMode];
    Object.keys(s).forEach(function(k){
      spec.style.setProperty("--" + k, val(s[k], shades));
    });
    spec.style.colorScheme = curMode;
  }

  function buildStrip(){
    var h = "";
    ORDER.forEach(function(key){
      var l = D.leitern[key];
      h += '<div class="lrow"><p class="lname">' + l.label + '<em>' + HINT[key] + '</em></p><div class="lsteps">';
      STEPS.forEach(function(st){
        h += '<span class="lstep" style="background:' + l.shades[st] + '" title="' + l.label + ' ' + st + ' · ' + l.shades[st] + '"></span>';
      });
      h += '</div></div>';
    });
    strip.innerHTML = h;
  }

  function wire(attr, set){
    var btns = document.querySelectorAll("[data-" + attr + "]");
    Array.prototype.forEach.call(btns, function(b){
      b.setAttribute("aria-pressed", b.classList.contains("is-on") ? "true" : "false");
      b.addEventListener("click", function(){
        Array.prototype.forEach.call(btns, function(o){
          o.classList.remove("is-on"); o.setAttribute("aria-pressed", "false");
        });
        b.classList.add("is-on"); b.setAttribute("aria-pressed", "true");
        set(b.getAttribute("data-" + attr));
        apply();
      });
    });
  }

  wire("lad", function(v){ curLad = v; });
  wire("mode", function(v){ curMode = v; });
  buildStrip();
  apply();
})();
</script>
