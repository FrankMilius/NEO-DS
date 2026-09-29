<script>
(function(){
  var SIG = {
    lime:    {label:"Lime",     hex:"#37e93d", on:"#161816"},
    green:   {label:"Green",    hex:"#34c759", on:"#161816"},
    blue:    {label:"NEO Blue", hex:"#009ee3", on:"#161816"},
    magenta: {label:"Magenta",  hex:"#e5007d", on:"#161816"}
  };
  var MATRIX = {"lime":{"graphit":{"d":2,"v":"neutral"},"neutral-beige":{"d":62,"v":"ok"},"ivory":{"d":36,"v":"knapp"},"neutral-taupe":{"d":76,"v":"ok"},"neutral-pearl":{"d":53,"v":"neutral"},"neutral-salbei":{"d":2,"v":"raus"}},"green":{"graphit":{"d":2,"v":"neutral"},"neutral-beige":{"d":66,"v":"ok"},"ivory":{"d":41,"v":"knapp"},"neutral-taupe":{"d":80,"v":"ok"},"neutral-pearl":{"d":58,"v":"neutral"},"neutral-salbei":{"d":2,"v":"raus"}},"blue":{"graphit":{"d":93,"v":"neutral"},"neutral-beige":{"d":157,"v":"ok"},"ivory":{"d":131,"v":"ok"},"neutral-taupe":{"d":171,"v":"ok"},"neutral-pearl":{"d":148,"v":"neutral"},"neutral-salbei":{"d":93,"v":"ok"}},"magenta":{"graphit":{"d":147,"v":"neutral"},"neutral-beige":{"d":83,"v":"ok"},"ivory":{"d":108,"v":"ok"},"neutral-taupe":{"d":69,"v":"ok"},"neutral-pearl":{"d":91,"v":"neutral"},"neutral-salbei":{"d":147,"v":"ok"}}};

  var stage = document.getElementById("stage");
  var out   = document.getElementById("verdict");
  if(!stage || !out) return;

  var curSig = "lime", curPap = "graphit";

  function apply(){
    var p = PAPIERE[curPap], s = SIG[curSig];
    Object.keys(p.shades).forEach(function(k){
      stage.style.setProperty("--p" + k, p.shades[k]);
    });
    stage.style.setProperty("--sig", s.hex);
    stage.style.setProperty("--sig-on", s.on);

    var m = MATRIX[curSig][curPap];
    var txt;
    if(m.v === "raus"){
      txt = "<b>" + s.label + " auf " + p.label + " — ausgeschlossen.</b> Farbtonabstand " + m.d
          + "°, unter der Grenze von 30°. Das Signal verschwindet im Grund; genau deshalb ist Salbei aus dem Bereichsdienst genommen.";
    } else if(m.v === "knapp"){
      txt = "<b>" + s.label + " auf " + p.label + " — benutzbar, mit der kleinsten Reserve.</b> Farbtonabstand "
          + m.d + "°. Über der Grenze von 30°, aber der geringste Abstand der fünf Bereichspapiere.";
    } else if(m.v === "neutral"){
      txt = "<b>" + s.label + " auf " + p.label + " — unkritisch.</b> Der Abstand beträgt zwar " + m.d
          + "°, aber die Buntheit dieses Papiers ist zu schwach, um mit dem Signal zu konkurrieren.";
    } else {
      txt = "<b>" + s.label + " auf " + p.label + " — trägt.</b> Farbtonabstand " + m.d
          + "°" + (m.d > 140 ? ", nahezu komplementär: Papier und Signal stützen sich gegenseitig." : ", deutlich über der Grenze von 30°.");
    }
    out.innerHTML = txt;
  }

  function wire(attr, set){
    var btns = document.querySelectorAll("[data-" + attr + "]");
    Array.prototype.forEach.call(btns, function(b){
      b.addEventListener("click", function(){
        Array.prototype.forEach.call(btns, function(o){
          o.classList.remove("is-on");
          o.setAttribute("aria-pressed", "false");
        });
        b.classList.add("is-on");
        b.setAttribute("aria-pressed", "true");
        set(b.getAttribute("data-" + attr));
        apply();
      });
      b.setAttribute("aria-pressed", b.classList.contains("is-on") ? "true" : "false");
    });
  }

  wire("sig", function(v){ curSig = v; });
  wire("pap", function(v){ curPap = v; });
  apply();
})();
</script>
