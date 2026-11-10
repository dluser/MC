(function () {
  const { cyl, box, tube, parts, label, hotspot, callout, P, slab, svg, bindHotspots, gauge, line, f1 } = ISO;
  const { h, say } = Guided.UI;
  const lbl = (pt, t, opt) => { const q = P(pt); return label(q[0], q[1], t, opt); };
  const PRODUCTS = [{ id: "ale", name: "English-style ale", short: "Ale", t: 8, y: 0 }, { id: "pils", name: "Domestic pilsner", short: "Pilsner", t: 12, y: 75 }, { id: "wheat", name: "Imported wheat beer", short: "Wheat", t: 14, y: 150 }];

  // layout: panel wall at the back (x = WX plane), cylinder in front of it
  const WX = -40, TK = [56, -80], SX = WX + 6, SZ = 160, MZ = 124;
  function primary(psi) { return parts.tank([TK[0], TK[1], 0]) + parts.regulator([TK[0], TK[1], 168], { values: [0.72, psi / 60] }).replace('class="knob"', 'class="knob" style="display:none"') + cyl([TK[0] + 10, TK[1], 180], [1, 0, 0], 7, 12, "orange", { sw: 1.8 }); }
  function secondary(y, psi, z = SZ, x0 = SX) {
    return cyl([x0 + 8, y, MZ + 3], [0, 0, 1], 2.6, z - 14 - MZ - 3, "steel", { sw: 1.3 }) + // stub from the manifold
      box([x0, y - 11, z - 14], [16, 22, 26], "steel") + cyl([x0 + 8, y, z + 12], [0, 0, 1], 2.5, 6, "steel", { sw: 1.4 }) + gauge([x0 + 22, y, z + 28], [1, 0, 0], 12.5, psi / 60) +
      cyl([x0 + 16, y, z - 4], [1, 0, 0], 6.5, 10, "orange", { sw: 1.8 }) + cyl([x0 + 8, y + 11, z - 1], [0, 1, 0], 2.8, 12, "steel", { sw: 1.3 }) + // outlet to the keg
      ISO.tube([[x0 + 8, y + 23, z - 1], [x0 + 8, y + 32, z - 6], [x0 + 8, y + 34, z - 40]], 2.4, { fill: "#cfe6ff", noHi: true }).svg;
  }
  function panelScene(o = {}) {
    const sec = o.sec || { ale: 0, pils: 0, wheat: 0 }, p = o.primary != null ? o.primary : 20;
    let s = slab([WX - 20, -130, -12], [150, 350, 12]);
    s += box([WX - 10, -120, 0], [10, 330, 216], "steel"); // wall (behind everything)
    s += box([WX, -24, 104], [3, 228, 120], ["#ffffff", "#f7faff", "#eef4fc", "#e3edf9"], { sw: 1.4 }); // backboard
    s += ISO.tube([[SX + 8, -10, MZ], [SX + 8, 196, MZ]], 3.4, { fill: "#cfe6ff" }).svg; // manifold
    PRODUCTS.forEach((pr) => { const a = Math.min(sec[pr.id], p); s += `<g id="g-${pr.id}">${secondary(pr.y, a)}</g>`; });
    s += ISO.tube([[TK[0] - 4, TK[1] + 12, 176], [TK[0] - 20, TK[1] + 40, 150], [SX + 14, -24, MZ + 6], [SX + 8, -10, MZ]], 3.4, { fill: "#cfe6ff" }).svg; // feed from primary to manifold
    s += `<g id="g-primary">${primary(p)}</g>`;
    if (!o.noRead) { PRODUCTS.forEach((pr) => { s += `<g id="l-${pr.id}">${secReadout(pr, Math.min(sec[pr.id], p), sec[pr.id] > p)}</g>`; }); s += `<g id="l-primary">${primReadout(p)}</g>`; }
    else PRODUCTS.forEach((pr) => { const q = P([SX + 14, pr.y, SZ + 62]); s += label(q[0], q[1], pr.short, { fs: 11.5 }); });
    return s;
  }
  function secReadout(pr, a, cap) { const q = P([SX + 14, pr.y, SZ + 62]); const ok = a === pr.t && !cap; return label(q[0], q[1], `${pr.short} ${a}/${pr.t}`, { bg: cap ? "#fff5e0" : ok ? "#e7f6ef" : "#fff", stroke: cap ? "#d8870d" : ok ? "#2a9a6c" : "#0b3b7a", fg: ok ? "#0f7b56" : "#0b3b7a", fs: 11.5 }); }
  function primReadout(p) { const q = P([TK[0], TK[1], 248]); const ok = p === 35; return label(q[0], q[1], `Primary ${p}/35 psi`, { bg: ok ? "#e7f6ef" : "#fff", stroke: ok ? "#2a9a6c" : "#0b3b7a", fg: ok ? "#0f7b56" : "#0b3b7a", fs: 11.5 }); }
  function knob(id, pt, aria, val) { const q = P(pt); return `<g class="knobctl" data-k="${id}" role="slider" tabindex="0" aria-label="${aria}" aria-valuemin="0" aria-valuemax="60" aria-valuenow="${val}" aria-valuetext="${val} psi" transform="translate(${f1(q[0])} ${f1(q[1])})"><circle r="24" fill="transparent"/><circle class="hs-ring" r="14"/><circle class="hs-ring2" r="14"/><path d="M-5 -19 l5 -6 l5 6 M-5 19 l5 6 l5 -6" fill="none" stroke="#ff7a2e" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></g>`; }
  // numbered callouts that reveal their part name on hover / focus / tap
  function tipCallouts(el) {
    const all = () => el.querySelectorAll(".hsc");
    el.addEventListener("click", (e) => { const g = e.target.closest(".hsc"); if (!g) return; const on = !g.classList.contains("sel"); all().forEach((q) => q.classList.remove("sel")); g.classList.toggle("sel", on); g.classList.add("seen"); });
    el.addEventListener("keydown", (e) => { const g = e.target.closest(".hsc"); if (g && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); g.dispatchEvent(new MouseEvent("click", { bubbles: true })); } });
    el.addEventListener("pointerover", (e) => { const g = e.target.closest(".hsc"); if (g && g.parentNode.lastElementChild !== g) g.parentNode.append(g); });
    return el;
  }

  // elevation scene: coast, mesa city, high-desert town, with mountains behind
  function terrain() {
    let s = slab([-20, -20, -12], [420, 160, 12], { pal: ["#f4e6cc", "#e9d3ab", "#d9bd8c", "#c4a26e"] });
    // mountains (behind)
    const peak = (x, y, h, w) => { const A = [x, y, h], k = 0.28;
      const fy = [[x - w, y + w, 0], [x + w, y + w, 0], A], fx = [[x + w, y - w, 0], [x + w, y + w, 0], A];
      const cap = (f) => [f[0].map((v, i) => A[i] + (v - A[i]) * k), f[1].map((v, i) => A[i] + (v - A[i]) * k), A];
      return ISO.poly(fy, "#cdb48a", { sw: 1.5 }) + ISO.poly(fx, "#b3986c", { sw: 1.5 }) + ISO.poly(cap(fy), "#ffffff", { sw: 1.2 }) + ISO.poly(cap(fx), "#e6eef8", { sw: 1.2 }); };
    // sea level: water + beach + bar
    s += box([0, 0, 0], [110, 120, 6], ["#cfe7ff", "#a9d2fb", "#77abe9", "#4686d8"]);
    for (let i = 0; i < 3; i++) { const a = P([16 + i * 30, 30 + i * 22, 6.5]); s += `<path d="M${f1(a[0])} ${f1(a[1])} q5 -4 10 0 q5 4 10 0" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round"/>`; }
    s += box([70, 70, 6], [30, 30, 24], "white", { sw: 1.4 }) + box([68, 68, 30], [34, 34, 3], "orange", { sw: 1.2 });
    // Albuquerque mesa with buildings
    s += box([140, 0, 0], [110, 120, 60], ["#f1dcb6", "#e2c38e", "#cfa66a", "#b5884f"]);
    s += box([160, 30, 60], [26, 26, 46], "white", { sw: 1.3 }) + box([196, 26, 60], [22, 30, 30], "white", { sw: 1.3 }) + box([200, 70, 60], [34, 26, 22], ["#f6dfc0", "#e9c896", "#d5a96c", "#b98a52"], { sw: 1.3 });
    // Santa Fe: higher, adobe buildings
    s += box([280, 0, 0], [100, 120, 86], ["#f1dcb6", "#e2c38e", "#cfa66a", "#b5884f"]);
    s += box([300, 34, 86], [36, 30, 24], ["#f2c79c", "#e3ab76", "#c98a52", "#a96f3c"], { sw: 1.3 }) + box([342, 40, 86], [24, 26, 18], ["#f2c79c", "#e3ab76", "#c98a52", "#a96f3c"], { sw: 1.3 });
    return s;
  }
  const SPOTS = [{ id: 0, n: "Sea level", pt: [55, 60, 6], ft: 0, lp: [-6, 120, 0], an: "end" }, { id: 5000, n: "Albuquerque", pt: [195, 60, 60], ft: 5000, lp: [190, 30, 150], an: "middle" }, { id: 7000, n: "Santa Fe", pt: [330, 60, 86], ft: 7000, lp: [400, 40, 120], an: "start" }];
  const spotLabel = (sp, text, opt = {}) => { const a = P(sp.pt), L = P(sp.lp); return `<path d="M${f1(a[0])} ${f1(a[1])} L${f1(L[0])} ${f1(L[1])}" stroke="#0b3b7a" stroke-width="1.4" stroke-dasharray="3 3" fill="none"/><circle cx="${f1(a[0])}" cy="${f1(a[1])}" r="3.4" fill="#0b3b7a" stroke="#fff" stroke-width="1.4"/>` + label(L[0], L[1], text, { fs: 11.5, anchor: sp.an, ...opt }); };

  Guided.start({
    id: "regulators", title: "Regulators",
    hook: "Gas leaves the cylinder at far too high a pressure to pour beer. Regulators tame it, so one cylinder can serve beers that each need a different pressure.",
    objectives: ["Explain what a regulator does", "Tell primary from secondary regulators", "Set dispensing pressures for several products", "Explain why CO₂ and nitrogen regulators differ"],
    hero: () => svg(null, panelScene({ primary: 35, sec: { ale: 8, pils: 12, wheat: 14 } }), "A CO2 cylinder with a primary regulator feeding three secondary regulators on a wall panel."),
    learn: [
      { title: "Tame that beast",
        html: "<p>A regulator <strong>reduces gas pressure to the right dispensing pressure</strong>. Its design is fairly simple: a spring, a diaphragm and a small seat work together to hold the outlet pressure steady.</p><p>Hover over a numbered marker to see what it is. Click or tap a marker to keep its label on; click it again to hide it.</p>",
        art: () => {
          let s = cyl([0, 0, -60], [0, 0, 1], 28, 50, "blue", { noCap: true }) + cyl([0, 0, -10], [0, 0, 1], 28, 18, "blue", { r1: 13 }) + cyl([0, 0, 8], [0, 0, 1], 9, 5, "dark", { sw: 1.6 }) + cyl([0, 0, 13], [0, 0, 1], 6, 7, "brass", { sw: 1.6 }) + box([-6, -6, 20], [12, 12, 10], "brass", { sw: 1.6 }) + cyl([0, 0, 30], [0, 0, 1], 9, 8, "steel", { n: 6 });
          s += parts.regulator([0, 0, 38], { values: [0.75, 0.42] }).replace('class="knob"', 'class="knob" style="display:none"') + cyl([10, 0, 50], [1, 0, 0], 7, 12, "orange");
          s += cyl([0, 10, 42], [0, 1, 0], 3.5, 12, "steel", { sw: 1.4 }) + box([-2.5, 20, 42], [5, 4, 15], "orange", { sw: 1.4 });
          const hc = ISO.hsCallout;
          s += hc("c1", [-4, 14, 78], [-62, -92], 1, "1: Cylinder (tank) pressure gauge", { tip: "Cylinder (tank) pressure gauge", side: "left", k: 0.62 }) + hc("c2", [18, -4, 78], [62, -96], 2, "2: Dispensing pressure gauge", { tip: "Dispensing pressure gauge", side: "right", k: 0.62 }) +
            hc("c3", [22, 0, 50], [70, -20], 3, "3: Adjustment knob", { tip: "Adjustment knob", side: "right", k: 0.62 }) + hc("c4", [0, 24, 50], [-66, -8], 4, "4: Gas shut-off", { tip: "Gas shut-off", side: "left", k: 0.62 }) + hc("c5", [6, 6, 34], [42, 58], 5, "5: Inlet nut, connects to the cylinder", { tip: "Inlet nut (to the cylinder)", side: "left", k: 0.62 });
          return svg(null, s, "A primary regulator with five numbered parts. Hover over a number to see its name; click a number to keep its label on.", { interactive: true });
        } },
      { title: "Primary vs. secondary",
        html: "<p>A <strong>primary</strong> regulator attaches <strong>directly to the gas source</strong> and has <strong>two gauges</strong>.</p><p>A <strong>secondary</strong> regulator reduces pressure further down the line and has <strong>one gauge</strong>. Secondaries let one system serve beers at different pressures, for example a 35 psi primary feeding 8, 12 and 14 psi secondaries.</p>",
        art: () => svg(null, panelScene({ primary: 35, sec: { ale: 8, pils: 12, wheat: 14 }, noRead: true }) + lbl([TK[0], TK[1], 250], "Primary · 2 gauges", { bg: "#0b3b7a", fg: "#fff" }) + lbl([SX, 75, 40], "Secondaries · 1 gauge each", { bg: "#fff" }), "A CO2 cylinder in front of a wall panel. Its primary regulator, with two gauges, feeds a manifold on the wall, which supplies three single-gauge secondary regulators.") },
      { title: "CO₂ and nitrogen fittings differ",
        html: "<p>CO₂ and nitrogen cylinders use different Compressed Gas Association (CGA) fittings, so their regulators aren't interchangeable.</p><ul><li><strong>CO₂, CGA 320:</strong> the regulator's nut fits <em>outside</em> the valve nipple.</li><li><strong>Nitrogen, CGA 580</strong> (shared with argon and helium): the regulator's fitting goes <em>inside</em> the nipple.</li></ul>",
        art: () => {
          let s = slab([-36, -30, -10], [222, 100, 10]);
          s += cyl([0, 0, 0], [0, 0, 1], 24, 30, "blue") + box([-12, -12, 30], [24, 24, 28], "steel") + cyl([0, 12, 44], [0, 1, 0], 6.5, 14, "steel", { sw: 1.6 });
          for (let i = 0; i < 4; i++) s += line([-6, 15 + i * 3, 38], [6, 15 + i * 3, 50], { sw: 1.2 });
          s += cyl([0, 46, 44], [0, 1, 0], 10, 12, "orange", { hole: 6.5, n: 6 }) + line([0, 28, 44], [0, 44, 44], { dash: "3 4", sw: 1.6 });
          s += cyl([150, 0, 0], [0, 0, 1], 24, 30, "deep") + box([138, -12, 30], [24, 24, 28], "steel") + cyl([150, 12, 44], [0, 1, 0], 8, 10, "steel", { hole: 4.5, holeFill: "#0b3b7a" });
          s += cyl([150, 40, 44], [0, 1, 0], 4, 18, "orange", { sw: 1.6 }) + line([150, 24, 44], [150, 38, 44], { dash: "3 4", sw: 1.6 });
          s += lbl([0, 20, -34], "CO₂ · CGA 320 · fits OUTSIDE", { fs: 11 }) + lbl([150, 20, -34], "N₂ · CGA 580 · fits INSIDE", { fs: 11 });
          return svg(null, s, "Two cylinder valves. Left, CO2 CGA 320: the regulator nut slides over the outside of the threaded nipple. Right, nitrogen CGA 580: the regulator stem threads into the inside of the opening.");
        } },
      { title: "Gauge pressure and altitude",
        html: "<p>A gauge shows <strong>gauge pressure</strong>: the keg's <strong>absolute pressure</strong> minus the <strong>atmospheric pressure</strong> around it.</p><p>Atmospheric pressure drops about <strong>1 psi per 2,000 ft</strong> of elevation. So the same gauge reading puts less total pressure on a keg in Albuquerque than at sea level.</p>",
        art: () => svg(null, terrain() + SPOTS.map((sp) => spotLabel(sp, `${sp.n} · ≈${(14.7 - sp.ft / 2000).toFixed(1)} psi`, { bg: sp.ft ? "#fff" : "#0b3b7a", fg: sp.ft ? "#0b3b7a" : "#fff" })).join(""), "Elevation steps from sea level at about 14.7 psi of atmospheric pressure, to Albuquerque at about 12.2 psi and Santa Fe at about 11.2 psi."),
        aside: { html: "<b>Gauge pressure</b> = absolute pressure − atmospheric pressure." } }
    ],
    tryIt: [{
      title: "Balance a three-beer system",
      lede: "Drag an orange knob up or down, or click it and use the arrow keys. Set the primary first.",
      goals: [{ id: "p", text: "Primary 35 psi" }, ...PRODUCTS.map((p) => ({ id: p.id, text: `${p.short} ${p.t} psi` }))],
      mount(el, ctx) {
        const V = { primary: 20, ale: 0, pils: 0, wheat: 0 };
        const art = svg(null, panelScene({ primary: V.primary, sec: V, noRead: true }) + knob("primary", [TK[0] + 22, TK[1], 180], "Primary regulator adjustment knob", V.primary) + PRODUCTS.map((pr) => knob(pr.id, [SX + 26, pr.y, SZ - 4], `${pr.name} secondary regulator knob`, 0)).join(""), "Interactive gas panel", { interactive: true });
        const { msg, side } = Guided.UI.tryLayout(el, art);
        const table = h("div", { class: "rtable", "aria-live": "off" }); side.prepend(table);
        const $ = (s) => art.querySelector(s);
        function draw() {
          const p = V.primary;
          $("#g-primary").innerHTML = primary(p);
          let all = p === 35, cap = false;
          if (p === 35) ctx.done("p");
          PRODUCTS.forEach((pr) => { const a = Math.min(V[pr.id], p), c = V[pr.id] > p; $(`#g-${pr.id}`).innerHTML = secondary(pr.y, a); if (a === pr.t && !c && p === 35) ctx.done(pr.id); if (a !== pr.t || c) all = false; if (c) cap = true; });
          art.querySelectorAll(".knobctl").forEach((k) => { const v = V[k.dataset.k]; k.setAttribute("aria-valuenow", v); k.setAttribute("aria-valuetext", `${v} psi`); });
          table.innerHTML = [["Primary", p, 35, false], ...PRODUCTS.map((pr) => [pr.short, Math.min(V[pr.id], p), pr.t, V[pr.id] > p])].map(([n, a, t, c]) => `<div class="rrow ${a === t && !c ? "ok" : c ? "cap" : ""}"><span>${n}</span><b>${a} <small>/ ${t} psi</small></b></div>`).join("");
          if (all) say(msg, "ok", "System balanced", "One 35 psi primary feeds three secondaries, each at its beer's pressure.");
          else if (cap) say(msg, "warn", "A secondary can only reduce pressure", "It can't deliver more than the primary supplies.");
          else say(msg, "info", p === 35 ? "Supply set" : "Start with the primary", p === 35 ? "Now dial each secondary to its beer's target." : "Drag the primary regulator's knob to 35 psi.");
        }
        art.querySelectorAll(".knobctl").forEach((k) => {
          const id = k.dataset.k; let y0 = null, v0 = 0;
          const set = (v) => { V[id] = Math.max(0, Math.min(60, Math.round(v))); draw(); };
          k.addEventListener("pointerdown", (e) => { y0 = e.clientY; v0 = V[id]; k.setPointerCapture(e.pointerId); e.preventDefault(); k.focus({ preventScroll: true }); });
          k.addEventListener("pointermove", (e) => { if (y0 == null) return; set(v0 + (y0 - e.clientY) / 4); });
          const up = () => { if (y0 != null) ctx.say(`${id === "primary" ? "Primary" : PRODUCTS.find((p) => p.id === id).short} at ${V[id]} psi`); y0 = null; };
          k.addEventListener("pointerup", up); k.addEventListener("pointercancel", up);
          k.addEventListener("wheel", (e) => { e.preventDefault(); set(V[id] + (e.deltaY < 0 ? 1 : -1)); }, { passive: false });
          k.addEventListener("keydown", (e) => { const d = { ArrowUp: 1, ArrowRight: 1, ArrowDown: -1, ArrowLeft: -1, PageUp: 5, PageDown: -5 }[e.key]; if (d) { e.preventDefault(); set(V[id] + d); } if (e.key === "Home") set(0); if (e.key === "End") set(60); });
          k.style.touchAction = "none"; k.style.cursor = "ns-resize";
        });
        draw();
      }
    }, {
      title: "Altitude check",
      lede: "Tap each location to compare how gauge readings change with elevation.",
      goals: [{ id: "sea", text: "Visit sea level" }, { id: "abq", text: "Visit Albuquerque" }],
      mount(el, ctx) {
        const art = svg(null, terrain() + SPOTS.map((sp) => { const q = P(sp.pt); return hotspot("s" + sp.id, q[0], q[1] - 20, `${sp.n}, about ${sp.ft.toLocaleString()} feet`, { r: 16, hint: sp.n }); }).join(""), "Interactive elevation map", { interactive: true });
        const { msg: card } = Guided.UI.tryLayout(el, art); say(card, "info", "Pick a location", "Tap a marker on the map.");
        const handlers = {};
        SPOTS.forEach((sp) => { handlers["s" + sp.id] = () => {
          const d = sp.ft / 2000, atm = 14.7 - d;
          if (sp.ft === 0) ctx.done("sea"); if (sp.ft === 5000) ctx.done("abq");
          say(card, sp.ft ? "warn" : "info", `${sp.n}${sp.ft ? ` · ≈${sp.ft.toLocaleString()} ft` : ""} · atmosphere ≈${atm.toFixed(1)} psi.`, `To match sea-level settings: ${PRODUCTS.map((p) => `${p.short} ${p.t} → <strong>≈${(p.t + d).toFixed(1)} psi</strong>`).join(" · ")}`);
          art.querySelectorAll(".hs").forEach((g) => g.classList.toggle("picked", g.dataset.hs === "s" + sp.id));
          ctx.refit();
        }; });
        bindHotspots(art, handlers);
      }
    }],
    checks: [
      { q: "This regulator on a wall panel has one gauge. What is it?",
        art: () => svg(null, box([WX - 10, -40, 90], [10, 80, 110], "steel") + box([WX, -30, 104], [3, 60, 96], ["#ffffff", "#f7faff", "#eef4fc", "#e3edf9"], { sw: 1.4 }) + ISO.tube([[SX + 8, -30, MZ], [SX + 8, 30, MZ]], 3.4, { fill: "#cfe6ff" }).svg + secondary(0, 12), "A single-gauge regulator mounted on a wall panel."),
        options: [
          { t: "A secondary regulator", ok: true, fb: "Secondaries have one gauge. Primaries have two." },
          { t: "A primary regulator", fb: "Primaries attach to the gas source and have two gauges." },
          { t: "A broken regulator missing a gauge", fb: "One gauge is normal for a secondary." },
          { t: "A nitrogen-only regulator", fb: "Gauge count tells you primary vs. secondary, not the gas." }
        ] },
      { q: "Why won't it connect?", scenario: "A bar gets its first nitrogen cylinder, but the CO₂ regulator won't connect.",
        art: () => svg(null, slab([-40, -40, -10], [160, 90, 10]) + parts.tank([0, 0, 0], { pal: "deep" }) + lbl([-10, 70, 70], "N₂ cylinder") + parts.regulator([80, 10, 40], { values: [0.7, 0.4] }) + cyl([80, 10, 30], [0, 0, 1], 9, 10, "steel", { n: 6 }) + lbl([110, -10, 0], "CO₂ regulator") + (() => { const q = P([40, 4, 120]); return `<g><circle cx="${f1(q[0])}" cy="${f1(q[1])}" r="15" fill="#ec5a5f" stroke="#0b3b7a" stroke-width="2"/><path d="M${f1(q[0] - 5)} ${f1(q[1] - 5)} l10 10 M${f1(q[0] + 5)} ${f1(q[1] - 5)} l-10 10" stroke="#fff" stroke-width="3.2" stroke-linecap="round"/></g>`; })(), "A nitrogen cylinder next to a CO2 regulator that won't connect, marked with a red X."),
        options: [
          { t: "CO₂ and nitrogen use different CGA fittings (320 vs. 580)", ok: true, fb: "Each gas needs a regulator with the matching fitting." },
          { t: "The cylinder is overfilled", fb: "Fill level doesn't change the connection." },
          { t: "The regulator must be set higher first", fb: "Settings don't affect the physical fitting." },
          { t: "Nitrogen cylinders must lie on their side", fb: "Cylinders always stay upright." }
        ] },
      { q: "Why does a bar serving three beers use secondary regulators?",
        art: () => svg(null, panelScene({ primary: 35, sec: { ale: 8, pils: 12, wheat: 14 } }), "A gas panel with one primary and three secondaries."),
        options: [
          { t: "To serve products at different pressures from one gas source", ok: true, fb: "Each secondary reduces the primary's pressure for its product." },
          { t: "To raise pressure above the primary", fb: "Secondaries only reduce pressure." },
          { t: "Because each beer needs its own cylinder", fb: "Secondaries let products share one source." },
          { t: "To filter the gas", fb: "Regulators control pressure, not purity." }
        ] },
      { q: "A regulator's gauge shows…",
        art: () => svg(null, gauge([0, 0, 0], [0, 1, 0], 40, 0.2, { nw: 4 }), "A pressure gauge."),
        options: [
          { t: "Absolute pressure in the keg minus atmospheric pressure", ok: true, fb: "That's gauge pressure, which is why elevation matters." },
          { t: "Total (absolute) pressure in the keg", fb: "Gauges read relative to the surrounding air." },
          { t: "How much gas is left", fb: "The dispensing gauge shows pressure relative to the atmosphere." },
          { t: "The gas temperature", fb: "Gauges show pressure." }
        ] }
    ],
    takeaways: [
      "Regulators <strong>reduce</strong> gas pressure to the right dispensing pressure.",
      "<strong>Primary:</strong> on the gas source, two gauges. <strong>Secondary:</strong> downstream, one gauge, for different products.",
      "CO₂ uses <strong>CGA 320</strong>, nitrogen <strong>CGA 580</strong>, so their regulators aren't interchangeable.",
      "Gauges read <strong>gauge pressure</strong>. Atmospheric pressure drops about 1 psi per 2,000 ft."
    ]
  });
})();
