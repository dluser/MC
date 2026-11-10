(function () {
  const { cyl, box, parts, label, hotspot, hsCallout, P, slab, svg, bindHotspots, tween, add, f1, zoomTo, home } = ISO;
  const { h, say, dnd } = Guided.UI;
  const lbl = (pt, t, opt) => { const q = P(pt); return label(q[0], q[1], t, opt); };
  const W = [0, 0, 120]; // faucet wall point

  // ----- exploded standard faucet (part names from the lecture's slide 12) -----
  const KS = 2.6;
  const PARTS = [
    { n: 8, name: "Faucet coupling washer", washer: true, at: [12, 0, 120], ex: [-4, 30, -18], draw: (o) => cyl(o, [1, 0, 0], 8.5, 2.2, "dark", { hole: 4.5, holeFill: "#e8f1fc", sw: 1.6 }), co: [-70, 40] },
    { n: 7, name: "Faucet body", at: [16, 0, 120], ex: [0, 0, 0], draw: (o) => cyl(o, [1, 0, 0], 10, 36, "steel") + cyl(add(o, [28, 0, -2]), [0, 0, -1], 5.5, 18, "steel", { sw: 1.8 }), co: [-40, 110], anchor: [30, 0, -16] },
    { n: 9, name: "Faucet shaft", at: [20, 0, 120], ex: [50, 0, 0], hide: true, draw: (o) => cyl(o, [1, 0, 0], 2.4, 30, "steel", { sw: 1.4 }), co: [-10, 90], anchor: [15, 0, 0] },
    { n: 10, name: "Faucet seat washer", washer: true, at: [50, 0, 120], ex: [66, 0, 0], hide: true, draw: (o) => cyl(o, [1, 0, 0], 4.2, 2, "dark", { sw: 1.4 }), co: [36, 92] },
    { n: 11, name: "Faucet shaft nut", at: [47, 0, 120], ex: [80, 0, 0], hide: true, draw: (o) => cyl(o, [1, 0, 0], 4.8, 4, "steel", { n: 6, sw: 1.4 }), co: [80, 70] },
    { n: 6, name: "Faucet lever", at: [24, 0, 112], ex: [0, 0, 12], hide: true, draw: (o) => cyl(o, [0, 0, 1], 2, 16, "steel", { sw: 1.4 }) + (() => { const q = P(o); return `<circle cx="${f1(q[0])}" cy="${f1(q[1])}" r="4" fill="#c6dcf5" stroke="#0b3b7a" stroke-width="${1.6 / KS}"/>`; })(), co: [-110, 30], anchor: [0, 0, 8] },
    { n: 5, name: "Ball washer", washer: true, at: [24, 0, 129], ex: [0, 0, 20], draw: (o) => cyl(o, [0, 0, 1], 5.6, 1.6, "dark", { hole: 2.6, holeFill: "#e8f1fc", sw: 1.4 }), co: [-110, -4] },
    { n: 4, name: "Friction washer", washer: true, at: [24, 0, 130.6], ex: [0, 0, 30], draw: (o) => cyl(o, [0, 0, 1], 6.6, 1.6, "dark", { hole: 2.8, holeFill: "#e8f1fc", sw: 1.4 }), co: [-110, -38] },
    { n: 3, name: "Faucet bonnet", at: [24, 0, 126], ex: [0, 0, 40], draw: (o) => cyl(o, [0, 0, 1], 6, 7, "steel", { n: 6, sw: 1.6 }), co: [100, 10] },
    { n: 2, name: "Faucet collar", at: [24, 0, 133], ex: [0, 0, 52], draw: (o) => cyl(o, [0, 0, 1], 7.5, 4, "steel", { sw: 1.6 }), co: [100, -24] },
    { n: 1, name: "Tap handle", at: [24, 0, 137], ex: [0, 0, 66], draw: (o) => cyl(o, [0, 0, 1], 4, 10, "steel", { sw: 1.4 }) + cyl(add(o, [0, 0, 10]), [0, 0, 1], 7, 44, "orange", { r1: 8.5 }), co: [100, -60], anchor: [0, 0, 34] }
  ];
  const sc = (q) => [q[0] * KS, q[1] * KS];
  function faucetX(t, opt = {}) {
    ISO.setSW(1 / KS * 1.15);
    let g = box([-8, -22, 96], [8, 44, 48], "steel") + cyl(W, [1, 0, 0], 6, 14, "steel", { sw: 1.8 });
    PARTS.forEach((p) => { if (p.hide && t < 0.05) return; const o = add(add(W, [p.at[0], p.at[1], p.at[2] - 120]), p.ex.map((v) => v * t)); g += `<g data-part="${p.n}">${p.draw(o)}</g>`; });
    const as = add(W, [110, -46, -26]);
    if (t > 0.9) g += cyl(as, [1, 0, 0], 2.4, 30, "steel", { sw: 1.4 }) + cyl(add(as, [27, 0, 0]), [1, 0, 0], 4.8, 4, "steel", { n: 6, sw: 1.4 }) + cyl(add(as, [31, 0, 0]), [1, 0, 0], 4.2, 2, "dark", { sw: 1.4 });
    ISO.setSW(1);
    let s = `<g class="fx-all"><g transform="scale(${KS})">${g}</g></g>`;
    if (t > 0.9 && !opt.noCallouts) {
      PARTS.forEach((p) => { const o = add(add(W, [p.at[0], p.at[1], p.at[2] - 120]), p.ex); const a = sc(P(add(o, p.anchor || [0, 0, 0]))); s += hsCallout("p" + p.n, a, [a[0] + p.co[0] * 1.9, a[1] + p.co[1] * 1.9], p.n, `Part ${p.n}: ${p.name}`, { k: 1.9, tip: `${p.n} · ${p.name}` }); });
      const a = sc(P(add(as, [16, 0, 0]))); s += hsCallout("p12", a, [a[0] + 110, a[1] + 76], 12, "Part 12: faucet shaft assembly", { k: 1.9, tip: "12 · Faucet shaft assembly" });
    }
    return s;
  }
  const NAMES = Object.fromEntries(PARTS.map((p) => [p.n, p.name])); NAMES[12] = "Faucet shaft assembly (shaft, nut and seat washer together)";

  function wall2(opt = {}) {
    const k = 1.7; ISO.setSW(1 / k * 1.1);
    let g = slab([-30, -110, -12], [150, 220, 12]) + box([-14, -110, 0], [14, 220, 170], "steel");
    g += box([0, -110, 0], [110, 220, 60], "wood") + box([4, -100, 60], [50, 200, 3], "dark", { sw: 1.2 });
    g += parts.faucet([0, -55, 120], { handle: 0 }) + parts.faucet([0, 55, 120], { ventless: true, handle: 0 });
    ISO.setSW(1);
    let s = `<g transform="scale(${k})">${g}</g>`;
    if (!opt.noLabels) {
      const a = P([20, -55, 190]), b = P([20, 55, 190]);
      s += label(a[0] * k, a[1] * k, "Standard", { fs: 15 }) + label(b[0] * k, b[1] * k, "Ventless", { fs: 15 });
      if (opt.diff) {
        const v = P([45, -48.8, 126.2]), sp = P([62, 55, 96]);
        s += `<path d="M${f1(v[0] * k)} ${f1(v[1] * k)} L${f1(v[0] * k + 70)} ${f1(v[1] * k - 40)}" stroke="#0b3b7a" stroke-width="1.6"/><circle cx="${f1(v[0] * k)}" cy="${f1(v[1] * k)}" r="10" fill="none" stroke="#ff7a2e" stroke-width="2.6"/>` + label(v[0] * k + 72, v[1] * k - 40, "Vent holes", { fs: 13, anchor: "start" });
        s += `<path d="M${f1(sp[0] * k)} ${f1(sp[1] * k)} L${f1(sp[0] * k - 50)} ${f1(sp[1] * k + 50)}" stroke="#0b3b7a" stroke-width="1.6"/><circle cx="${f1(sp[0] * k)}" cy="${f1(sp[1] * k)}" r="10" fill="none" stroke="#ff7a2e" stroke-width="2.6"/>` + label(sp[0] * k - 52, sp[1] * k + 50, "No vent holes · long smooth spout", { fs: 13, anchor: "end" });
      }
    }
    return s;
  }
  // overview: a bar wall with stainless faucets, the middle one pouring
  function barWall() {
    const k = 1.5; ISO.setSW(1 / k * 1.1);
    let g = slab([-30, -150, -12], [150, 300, 12]) + box([-14, -150, 0], [14, 300, 196], "steel");
    g += box([-13, -120, 152], [1, 240, 3], "dark", { sw: 1 }); // tap rail
    g += box([0, -150, 0], [110, 300, 60], "wood") + box([4, -136, 60], [52, 272, 3], "dark", { sw: 1.2 });
    // glasses first: each sits under its spout, so the faucet is drawn over the glass rim
    // back to front: glass (if any), then its faucet
    [-90, 0, 90].forEach((y, i) => { if (i) g += parts.glass([44, y, 63], { fill: [0, 0.6, 0.9][i] }); g += parts.faucet([0, y, 144], { handle: i === 1 ? 0.5 : 0, handlePal: ["orange", "blue", "orange"][i] }); });
    ISO.setSW(1);
    const a = P([44, 0, 120]), b = P([44, 0, 118]), c = P([44, 0, 76]); // spout bottom is 24 below the faucet axis
    let s = `<g transform="scale(${k})">${g}<line x1="${f1(a[0])}" y1="${f1(a[1])}" x2="${f1(b[0])}" y2="${f1(c[1])}" stroke="#f6a724" stroke-width="4" stroke-dasharray="6 3" class="run2"/></g>`;
    const q = P([20, -90, 222]); s += label(q[0] * k, q[1] * k, "Stainless steel", { fs: 13 });
    const r = P([44, 0, 30]); s += label(r[0] * k + 60, r[1] * k + 10, "“the beer” → “a beer”", { fs: 13, bg: "#e7f6ef", fg: "#0f7b56", stroke: "#2a9a6c" });
    return s;
  }
  const chromeLoupe = (cx, cy) => `<g aria-hidden="true"><circle cx="${cx}" cy="${cy}" r="50" fill="#fff" stroke="#ff7a2e" stroke-width="4"/><clipPath id="clp"><circle cx="${cx}" cy="${cy}" r="46"/></clipPath><g clip-path="url(#clp)"><rect x="${cx - 60}" y="${cy - 60}" width="120" height="120" fill="#e8f1fc"/><path d="M${cx - 60} ${cy - 22} L${cx + 60} ${cy - 46}" stroke="#fff" stroke-width="10" opacity=".8"/><path d="M${cx - 26} ${cy - 10} q22 -18 46 -2 q18 14 6 34 q-14 18 -38 10 q-24 -10 -14 -42z" fill="#d7a93f" stroke="#8a5300" stroke-width="2.5"/>${[[-10, 4, 6], [10, 10, 5], [2, 22, 4], [16, -4, 3.5]].map(([x, y, r]) => `<circle cx="${cx + x}" cy="${cy + y}" r="${r}" fill="#8a5300"/>`).join("")}<circle cx="${cx - 9}" cy="${cy + 3}" r="2" fill="#2a9a6c"/><circle cx="${cx + 11}" cy="${cy + 9}" r="2" fill="#2a9a6c"/></g></g>`;

  Guided.start({
    id: "faucets", title: "Faucets",
    hook: "The faucet is the last thing the beer touches before the glass. Its material and style decide what customers taste, and how much work cleaning will be.",
    objectives: ["Explain why faucets should be stainless steel", "Name the parts of a standard faucet", "Compare standard and ventless faucets"],
    hero: () => svg(null, barWall(), "A bar wall with three stainless steel faucets above a drip tray. The middle faucet is open and pouring beer into a glass: where “the beer” becomes “a beer.”"),
    learn: [
      { title: "Where “the beer” becomes “a beer”",
        html: "<p>The faucet is the point where <strong>“the beer” becomes “a beer.”</strong> Pull the tap handle and the beer pours into the glass.</p><p>It attaches to a <strong>shank</strong> through the cooler wall, or to a <strong>draft tower</strong> on the bar top.</p>",
        art: () => { let s = slab([-40, -60, -12], [150, 120, 12]) + box([-14, -60, 0], [14, 120, 196], "steel") + box([0, -60, 0], [110, 120, 60], "blue"); const a = P([44, 0, 118]), b = P([44, 0, 116]); s += parts.glass([44, 0, 60], { fill: 0.55 }) + `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${P([44, 0, 64])[1]}" stroke="#f6a724" stroke-width="5" stroke-dasharray="7 4" class="run2"/>` + parts.faucet([0, 0, 142], { handle: 0.5 }) + lbl([-10, 0, 200], "“the beer”", { fs: 11 }) + lbl([60, 0, 40], "“a beer”", { fs: 11, bg: "#e7f6ef", fg: "#0f7b56", stroke: "#2a9a6c" }); return svg(null, s, "A wall-mounted faucet pouring beer into a glass."); } },
      { title: "Stainless steel, again",
        html: "<p><strong>Stainless steel</strong> is the recommended material for faucets.</p><p>Older faucets were <strong>chrome-plated brass</strong>. Once the chrome chips, the brass corrodes, which causes a <strong>metallic off-flavor</strong> and leaves pits where <strong>microorganisms</strong> can hide.</p>",
        art: () => svg([20, 14, 610, 360], ISO.corrosion(), "Two cross-sections. Left, stainless steel: solid metal all the way through. Right, chrome-plated brass: a thin chrome coat has a chip; a corrosion pit grows into the brass underneath, giving a metallic off-flavor, and microbes hide in the pit.") },
      { title: "Two main styles",
        html: "<ul><li><strong>Standard</strong> faucets are simpler and easier to clean, but they hold on to more gunk.</li><li><strong>Ventless</strong> faucets expose less beer to air, but they're more difficult to clean and prone to leaks.</li></ul><p>Neither is “best.” It's a trade-off.</p>",
        art: () => svg(null, wall2({ diff: true }), "A standard faucet and a ventless faucet side by side above a bar counter. The standard faucet has small vent holes on its body; the ventless faucet has no vent holes and a longer, smooth, tapered spout.") }
    ],
    tryIt: [
      { title: "Inside a standard faucet",
        lede: "Tap the faucet to take it apart, then tap the numbers to name each part.",
        goals: [{ id: "explode", text: "Take it apart" }, { id: "washers", text: "Find all four washers" }],
        mount(el, ctx) {
          let t = 0; const found = {};
          const art = svg(null, faucetX(1), "Interactive exploded faucet", { interactive: true });
          const { msg, side } = Guided.UI.tryLayout(el, art);
          const counter = h("div", { class: "say", html: "<b>Washers found: 0 of 4</b>Washers are thin rings. Look for them in the stack." });
          side.append(counter);
          say(msg, "info", "Start here", "Tap the faucet on the drawing to take it apart.");
          art.addEventListener("framed", () => draw(true));
          function draw(first) {
            const vb = art.getAttribute("viewBox");
            art.innerHTML = faucetX(t) + (t < 0.05 ? (() => { const q = sc(P([30, 0, 128])); return hotspot("open", q[0], q[1], "Take the faucet apart", { r: 30, hint: "Take it apart" }); })() : "");
            if (vb) art.setAttribute("viewBox", vb);
            art.querySelectorAll(".hsc").forEach((g) => { const n = +g.dataset.hs.slice(1); if (found[n]) g.classList.add("find"); });
            bindHotspots(art, Object.assign({ open() { home(art, 1000); tween(1100, (e) => { t = e; draw(); }, () => { t = 1; draw(); ctx.done("explode"); say(msg, "ok", "Taken apart", "Twelve parts. Tap any number to name it."); art.querySelector(".hsc")?.focus(); }); } },
              Object.fromEntries([...PARTS.map((p) => p.n), 12].map((n) => ["p" + n, (g) => {
                art.querySelectorAll(".hsc").forEach((x) => x.classList.remove("sel")); g.classList.add("sel");
                const p = PARTS.find((x) => x.n === n), isW = p && p.washer;
                say(msg, isW ? "ok" : "info", `${n} · ${NAMES[n]}`, isW ? "That's a washer." : "");
                if (isW) { found[n] = true; g.classList.add("find"); const c = Object.keys(found).length; counter.innerHTML = `<b>Washers found: ${c} of 4</b>${Object.keys(found).map((k) => NAMES[k]).join(", ")}`; if (c === 4) ctx.done("washers"); }
                ctx.say(`${n}: ${NAMES[n]}`);
              }]))));
          }
          // start assembled: frame on the exploded layout, then collapse
          requestAnimationFrame(() => requestAnimationFrame(() => { t = 0; draw(); requestAnimationFrame(() => zoomTo(art, ".fx-all", 40, 0)); }));
        } },
      { title: "Sort the trade-offs",
        lede: "Drag each trait onto the faucet style it describes.",
        goals: [{ id: "sorted", text: "Sort all six traits" }],
        mount(el, ctx) {
          const art = svg(null, wall2(), "Standard and ventless faucets", { interactive: true });
          const T = [["Simpler design", "std"], ["Easier to clean", "std"], ["Holds on to more gunk", "std"], ["Exposes less beer to air", "vent"], ["More difficult to clean", "vent"], ["Prone to leaks", "vent"]];
          let n = 0;
          const board = dnd({ art, trayLabel: "Traits", say: ctx.say, intro: ["Standard or ventless?", "Six traits, two styles. Drag each trait onto the faucet it describes."],
            zones: [{ id: "vent", label: "Ventless", multi: true, cls: "multi", x: 3, y: 52, w: 45, h: 45 }, { id: "std", label: "Standard", multi: true, cls: "multi", x: 52, y: 52, w: 45, h: 45 }],
            tokens: Guided.UI.shuffle(T).map(([t, z], i) => ({ id: "t" + i, label: t, zone: z })),
            onResult(t, z, ok) { const msg = board._msg; if (ok) { n++; say(msg, "ok", `${n} of 6 sorted`, n === 6 ? "Standard trades more gunk for easy cleaning. Ventless trades harder cleaning and leaks for less air exposure." : `${t.label}: ${z.label}.`); } else say(msg, "bad", "Not that one", "Ventless means less air but more upkeep. Standard means simpler but gunkier."); },
            onDone: () => ctx.done("sorted") });
          el.append(board);
        } }
    ],
    checks: [
      { q: "Which faucet style is simpler and easier to clean, but holds on to more gunk?",
        art: () => svg(null, wall2({ noLabels: true }), "Two faucet styles."),
        options: [{ t: "Standard", ok: true, fb: "That's the standard faucet's trade-off." }, { t: "Ventless", fb: "Ventless faucets are harder to clean and prone to leaks." }] },
      { q: "A bar owner wants to minimize how much beer is exposed to air at the faucet. Which style fits, and what's the trade-off?",
        art: () => svg(null, wall2({ noLabels: true }), "A standard faucet and a ventless faucet above a bar counter."),
        options: [
          { t: "Ventless: less air exposure, but harder to clean and prone to leaks", ok: true, fb: "That's the ventless trade-off." },
          { t: "Standard: less air exposure, but holds more gunk", fb: "It's ventless that exposes less beer to air." },
          { t: "Ventless, with no downsides", fb: "Ventless faucets are harder to clean and prone to leaks." },
          { t: "Either; both expose the same amount", fb: "The styles differ here." }
        ] },
      { q: "What's the most likely cause?", scenario: "Customers say a beer tastes metallic. The faucets are decades old, and their chrome is chipped.",
        art: () => svg([20, 14, 610, 360], ISO.corrosion(), "Cross-sections of solid stainless steel and of chipped chrome-plated brass with a corrosion pit and microbes."),
        options: [
          { t: "Chipped chrome-plated brass is corroding. Replace it with stainless.", ok: true, fb: "Exposed brass causes metallic flavors and harbors microorganisms." },
          { t: "The gas pressure is too high", fb: "Pressure affects the pour, not this flavor." },
          { t: "The keg is a Sankey S", fb: "Coupler type affects fit, not flavor." },
          { t: "Metallic flavor is normal", fb: "It isn't. It points to corroding brass." }
        ] }
    ],
    takeaways: [
      "The faucet is where <strong>“the beer” becomes “a beer”</strong>, the last part to touch it.",
      "Use <strong>stainless steel</strong>. Chipped chrome-plated brass tastes metallic and harbors microorganisms.",
      "<strong>Standard:</strong> simpler and easier to clean, but gunkier. <strong>Ventless:</strong> less air exposure, but harder to clean and prone to leaks."
    ]
  });
})();
