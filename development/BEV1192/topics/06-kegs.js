(function () {
  const { cyl, box, tube, parts, label, hotspot, P, slab, svg, bindHotspots, zoomTo, home, gauge, f1 } = ISO;
  const { h, say } = Guided.UI;
  const lbl = (pt, t, opt) => { const q = P(pt); return label(q[0], q[1], t, opt); };
  const SC = 3.6;
  const SIZES = [
    { id: "half", n: "½ bbl", s: "“full-size”", gal: 15.5, d: 16.1, ht: 23.3, x: 0, f: "The familiar full-size keg." },
    { id: "qt", n: "¼ bbl tall", s: "slim quarter", gal: 7.75, d: 11.1, ht: 23.3, x: 58, f: "Smaller footprint, so more fit per square foot." },
    { id: "pony", n: "¼ bbl short", s: "“pony keg”", gal: 7.75, d: 16.1, ht: 13.9, x: 116, f: "Same footprint as a ½ bbl, so it's an endangered species." },
    { id: "sixth", n: "⅙ bbl", s: "sixtel", gal: 5.17, d: 9.25, ht: 23.3, x: 170, f: "Smallest footprint: more variety in the same space." }
  ];
  const kegAt = (sz, o, opt = {}) => parts.keg(o, { r: (sz.d / 2) * SC, h: sz.ht * SC, ...opt });
  function lineup(sel) {
    // kegs in a row across the screen (along x = −y), each on a soft floor shadow
    let s = "";
    SIZES.forEach((sz) => { const r = (sz.d / 2) * SC + 10; s += cyl([sz.x, -sz.x, -3], [0, 0, 1], r, 2, ["#e6f0fc", "#dbe7f7", "#cfe0f4", "#c1d6ef"], { sw: 1.2, stroke: "#9cc3f0" }); });
    SIZES.forEach((sz) => { s += `<g id="k-${sz.id}">${kegAt(sz, [sz.x, -sz.x, 0])}</g>`; s += lbl([sz.x, -sz.x, -26], sz.n, { fs: 11, bg: sel === sz.id ? "#ff7a2e" : "#fff", fg: sel === sz.id ? "#fff" : "#0b3b7a", stroke: sel === sz.id ? "#e05a10" : "#0b3b7a" }); });
    return s;
  }
  // Sankey keg valve, cross-section (2D). opt.ok = healthy seal
  function valveCut(opt = {}) {
    const I = "#0b3b7a", T = (x, y, t, o = {}) => `<text x="${x}" y="${y}" text-anchor="${o.a || "middle"}" font-family="Inter,system-ui" font-size="${o.fs || 13}" font-weight="${o.w || 700}" fill="${o.c || I}">${t}</text>`;
    let s = `<defs><linearGradient id="vs" x1="0" x2="1"><stop offset="0" stop-color="#f4f8fd"/><stop offset=".5" stop-color="#dbe7f7"/><stop offset="1" stop-color="#b9cfeb"/></linearGradient>
      <clipPath id="kegin"><path d="M60 214 Q60 196 90 192 L250 192 L250 360 L60 360 Z M390 192 L550 192 Q580 196 580 214 L580 360 L390 360 Z M250 300 L390 300 L390 360 L250 360Z"/></clipPath></defs>`;
    // keg top dome + beer inside
    s += `<path d="M40 360 L40 214 Q40 182 90 176 L550 176 Q600 182 600 214 L600 360" fill="#eef4fc" stroke="${I}" stroke-width="2.6"/>`;
    s += `<path d="M52 360 L52 222 Q52 194 96 190 L544 190 Q588 194 588 222 L588 360 Z" fill="#fff"/>`;
    s += `<path d="M52 360 L52 262 L588 262 L588 360 Z" fill="#ffcb52" opacity=".9"/><path d="M52 262 L588 262" stroke="#d8870d" stroke-width="2"/>`;
    s += T(110, 236, "CO₂ headspace", { fs: 12, c: "#2f74d0" }) + T(110, 300, "Beer", { fs: 13, c: "#8a5300" });
    // valve housing (neck) — cut in half: left wall, right wall
    s += `<path d="M262 176 L262 96 L282 96 L282 176 Z M358 176 L358 96 L378 96 L378 176 Z" fill="url(#vs)" stroke="${I}" stroke-width="2.4"/>`;
    s += `<path d="M250 96 h40 M350 96 h40" stroke="${I}" stroke-width="3"/>`;
    for (let i = 0; i < 6; i++) s += `<path d="M262 ${104 + i * 11} l-8 5 M378 ${104 + i * 11} l8 5" stroke="${I}" stroke-width="1.6"/>`;
    // CO2 valve: annular poppet ring at the top (left + right halves)
    s += `<rect x="282" y="100" width="22" height="14" rx="3" fill="#7d8aa3" stroke="${I}" stroke-width="2"/><rect x="336" y="100" width="22" height="14" rx="3" fill="#7d8aa3" stroke="${I}" stroke-width="2"/>`;
    // gas channels down the outside of the spear
    s += `<path d="M293 116 L293 186 M347 116 L347 186" stroke="#18a0fb" stroke-width="4" stroke-dasharray="6 6" class="flow-gas run" fill="none"/>`;
    // inner body + ball valve
    s += `<path d="M304 112 L304 176 L312 186 L312 360 M336 112 L336 176 L328 186 L328 360" fill="none" stroke="${I}" stroke-width="2.4"/>`;
    s += `<path d="M308 116 L332 116 L332 186 L328 190 L328 360 L312 360 L312 190 L308 186 Z" fill="#fff4d6" stroke="none"/>`;
    s += `<path d="M314 230 L314 360 L326 360 L326 230" fill="#ffd27a" stroke="${I}" stroke-width="1.6"/>`; // spear (down tube) carrying beer
    s += `<circle cx="320" cy="142" r="12" fill="#c6dcf5" stroke="${I}" stroke-width="2.2"/><circle cx="316" cy="138" r="3.5" fill="#fff"/>`; // ball
    s += `<path d="M312 156 l16 6 l-16 6 l16 6 l-16 6 l16 6" fill="none" stroke="#7d8aa3" stroke-width="2"/>`; // spring
    // the seal between the ball valve and the CO2 valve (O-ring halves)
    if (opt.ok) s += `<circle cx="306" cy="124" r="5.5" fill="#2a9a6c" stroke="${I}" stroke-width="1.8"/><circle cx="334" cy="124" r="5.5" fill="#2a9a6c" stroke="${I}" stroke-width="1.8"/>`;
    else {
      s += `<circle cx="334" cy="124" r="5.5" fill="#ec5a5f" stroke="${I}" stroke-width="1.8"/><path d="M301 120 a5.5 5.5 0 1 0 9 6" fill="#ec5a5f" stroke="${I}" stroke-width="1.8"/><path d="M309 119 l3 -3 m-1 7 l4 0" stroke="#c7333a" stroke-width="1.8" stroke-linecap="round"/>`;
      // leaking bubbles: from the gas channel, through the chip, up the beer path
      s += `<g class="leak">${[0, .5, 1, 1.5].map((d) => `<circle class="lb" style="animation-delay:${d}s" cx="300" cy="140" r="3.6" fill="#fff" stroke="#18a0fb" stroke-width="1.6"/>`).join("")}</g>`;
    }
    // beer out to the coupler / line, with foam if leaking
    s += `<path d="M320 96 L320 40 Q320 24 340 24 L440 24" fill="none" stroke="${I}" stroke-width="15" stroke-linecap="round"/><path d="M320 96 L320 40 Q320 24 340 24 L440 24" fill="none" stroke="#ffcb52" stroke-width="10" stroke-linecap="round"/>`;
    if (!opt.ok) s += `<g class="foam">${[[320, 70], [320, 50], [334, 25], [356, 24], [380, 25], [404, 23], [426, 25]].map(([x, y], i) => `<circle cx="${x + (i % 2 ? 1.5 : -1.5)}" cy="${y}" r="${3 + (i % 3)}" fill="#fff" stroke="#c6dcf5" stroke-width="1"/>`).join("")}</g>`;
    // labels
    const tag = (x, y, lx, ly, t, o = {}) => `<path d="M${x} ${y} L${lx} ${ly}" stroke="${o.c || I}" stroke-width="1.6" fill="none"/><circle cx="${x}" cy="${y}" r="3.4" fill="${o.c || I}"/>` + label(lx, ly, t, { fs: 12.5, anchor: o.a || (lx < x ? "end" : "start"), fg: o.c || I, stroke: o.c || I, bg: o.bg || "#fff" });
    s += tag(282, 107, 196, 112, "CO₂ valve") + tag(330, 142, 452, 150, "Ball valve (beer)") + tag(320, 300, 452, 316, "Spear (down tube)");
    s += opt.ok ? tag(334, 124, 452, 112, "Seal: intact", { c: "#0f7b56", bg: "#e8f6ef" }) : tag(306, 124, 196, 150, "Damaged seal", { c: "#c7333a", bg: "#fdeceb" }) + label(470, 52, "CO₂ leaks into the beer → foam", { fs: 12.5, bg: "#18a0fb", fg: "#fff", stroke: I });
    s += T(470, 24 + 4, "to the coupler", { fs: 11.5, c: "#56637c", a: "start" });
    return s;
  }
  function floors() {
    let s = slab([-40, -40, -10], [150, 150, 10]) + slab([170, -40, -10], [150, 150, 10]);
    const half = SIZES[0], six = SIZES[3];
    [[0, 0], [70, 0], [0, 70], [70, 70]].forEach(([x, y]) => { s += kegAt(half, [x, y, 0], { h: 40 }); });
    for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) s += kegAt(six, [190 + i * 46, -20 + j * 46, 0], { h: 40 });
    s += lbl([35, 35, -26], "½ bbl kegs", { fs: 11 }) + lbl([245, 35, -26], "⅙ bbl kegs: more variety", { fs: 11 });
    return s;
  }
  // walk-in cooler (cut away) + gas panel + bar with three taps; the pilsner (third) pours foamy
  const BAR_Y = [0, 54, 108];
  function bar(sel) {
    let s = slab([-80, -70, -12], [440, 250, 12]);
    // cooler: floor, back and left walls (front walls cut away)
    s += box([-70, -60, -2], [180, 220, 2], ["#f3f8ff", "#e6f0fc", "#d6e6f9", "#c4daf5"], { sw: 1.4 });
    s += box([-78, -60, 0], [8, 220, 150], "steel") + box([-70, -68, 0], [180, 8, 150], "steel");
    s += ISO.poly([[110, -60, 0], [110, -60, 150], [110, 160, 150], [110, 160, 0]], "none", { sw: 1.4, dash: "6 6" }) + ISO.poly([[-70, 160, 150], [110, 160, 150]], "none", { sw: 1.4, dash: "6 6" });
    // thermometer display on the back wall
    s += box([40, -60, 96], [36, 3, 22], "white", { sw: 1.4 }); const tq = P([58, -57, 107]); s += `<text x="${f1(tq[0])}" y="${f1(tq[1] + 4)}" text-anchor="middle" font-family="Inter,system-ui" font-size="11" font-weight="800" fill="#0f7b56" transform="skewY(30) translate(0 ${f1(-tq[0] * 0.577)})">38°F</text>`;
    // gas panel on the left wall: backboard + three secondaries
    s += box([-70, 10, 100], [2, 110, 50], "white", { sw: 1.4 });
    BAR_Y.forEach((y, i) => { s += box([-68, y + 20, 112], [10, 14, 16], "steel", { sw: 1.3 }) + gauge([-56, y + 27, 136], [1, 0, 0], 8, 0.45); });
    // kegs with couplers
    const K = [[-30, -20], [20, -20], [-4, 60]];
    K.forEach(([x, y], i) => { s += `<g id="bk${i}">${parts.keg([x, y, 0], { r: 24, h: 76 })}${parts.coupler([x, y, 74], { lever: 0.12 })}</g>`; });
    if (sel) { const q = P([-4, 60, 0]); s += `<ellipse cx="${f1(q[0])}" cy="${f1(q[1])}" rx="46" ry="26" fill="none" stroke="#ff7a2e" stroke-width="4" stroke-dasharray="8 6" class="sel-ring"/>`; }
    // beer lines from couplers to the bar wall
    K.forEach(([x, y], i) => { s += tube([[x, y, 116], [x + 10, y, 132], [150, BAR_Y[i], 150], [170, BAR_Y[i], 148]], 2.6, { fill: "#ffcb52", noHi: true }).svg; });
    // bar: wall, counter, glasses, then faucets
    s += box([170, -50, 0], [12, 210, 200], "steel");
    s += box([182, -40, 0], [84, 190, 66], "wood") + box([186, -30, 66], [40, 170, 4], "dark", { sw: 1.3 });
    // back to front: each glass, then the faucet above it, so nearer glasses overlap farther faucets
    BAR_Y.forEach((y, i) => {
      if (i < 2) s += parts.glass([226, y, 70], { fill: 0.82, foam: 4 });
      else { s += parts.glass([226, y, 70], { fill: 0.45, foam: 0 }) + cyl([226, y, 88], [0, 0, 1], 13.5, 26, "white", { sw: 1.4, r1: 16 }) + cyl([226, y, 114], [0, 0, 1], 16, 6, "white", { sw: 1.4, r1: 11 }); const d = P([240, y + 4, 92]); s += `<path d="M${f1(d[0])} ${f1(d[1])} q3 10 0 16" stroke="#fff" stroke-width="5" stroke-linecap="round" fill="none"/><path d="M${f1(d[0])} ${f1(d[1])} q3 10 0 16" stroke="#c6dcf5" stroke-width="1.4" fill="none"/>`; }
      s += parts.faucet([182, y, 148], { handle: 0, handlePal: i === 2 ? "orange" : "blue" });
    });
    s += lbl([20, 160, -6], "Walk-in cooler", { fs: 12 }) + lbl([224, 160, -6], "Bar", { fs: 12 }) + lbl([250, 150, 30], "Pilsner: foamy", { fs: 11.5, bg: "#fff5e0", stroke: "#d8870d", fg: "#9a5b00" });
    if (sel) s += lbl([-4, 60, -24], "Pilsner keg", { fs: 11.5, bg: "#ff7a2e", fg: "#fff", stroke: "#e05a10" });
    return s;
  }

  Guided.start({
    id: "kegs", title: "Kegs",
    hook: "You'll rarely open a keg yourself, but you need to know when one is the problem, because a bad keg can fool you into “fixing” everything else.",
    objectives: ["Recognize the most common keg defect and what to do", "Compare common U.S. keg sizes", "Explain why smaller kegs are becoming common"],
    hero: () => svg(null, lineup(), "Four keg sizes side by side: half barrel, tall quarter, short quarter (pony) and sixth barrel."),
    learn: [
      { title: "The most common keg defect",
        html: "<p>A keg <strong>shouldn't need servicing in the field</strong>. Your job is to spot when one needs maintenance and <strong>send it back to the brewery</strong>.</p><p>The most common defect is a <strong>damaged or chipped seal between the ball valve and the CO₂ valve</strong>. CO₂ bleeds into the beer line and causes foaming, which is easy to <strong>wrongly blame</strong> on a warm keg or low pressure.</p>",
        art: () => svg([20, 6, 600, 362], valveCut(), "Cross-section of a Sankey keg valve on top of a keg. CO2 enters through the outer CO2 valve into the headspace; beer rises through the spear past the central ball valve. The seal between the CO2 valve and the ball valve is chipped, so gas bubbles slip into the beer path and the beer leaving for the coupler is foamy."),
        aside: { html: "<b>Color-coded seals</b> make it easier for breweries to replace them on a regular schedule." } },
      { title: "Keg sizes",
        html: "<p>A barrel (bbl) is <strong>31 gallons</strong>. Common U.S. kegs:</p><ul><li><strong>½ bbl:</strong> 15.5 gal, the familiar “full-size” keg</li><li><strong>¼ bbl:</strong> 7.75 gal, tall or short (“pony”)</li><li><strong>⅙ bbl:</strong> 5.17 gal</li></ul>",
        art: () => svg(null, lineup() + SIZES.map((sz) => lbl([sz.x, -sz.x, sz.ht * SC + 24], `${sz.gal} gal`, { fs: 11, bg: "#0b3b7a", fg: "#fff" })).join(""), "Four kegs with their volumes: 15.5, 7.75, 7.75 and 5.17 gallons. Proportions are approximate.") },
      { title: "Why kegs are getting smaller",
        html: "<p>Customers want variety, so retailers fit more kegs into the same space. <strong>Tall ¼ bbl and ⅙ bbl kegs</strong> fit more per square foot and get replaced more often, so the beer stays fresher.</p><p>The short ¼ bbl <strong>pony keg</strong> is fading. It takes the same floor space as a ½ bbl.</p>",
        art: () => svg(null, floors(), "Two equal floor areas: one holds four half-barrel kegs, the other holds nine sixth-barrel kegs. Illustrative only.") }
    ],
    tryIt: [
      { title: "Compare keg sizes",
        lede: "Tap each keg to compare it.",
        goals: [{ id: "all", text: "Explore all four sizes" }],
        mount(el, ctx) {
          const seen = {};
          const art = svg(null, lineup() + `<rect x="0" y="-190" width="10" height="10" fill="none"/>`, "Interactive keg lineup", { interactive: true });
          const { msg, vis } = Guided.UI.tryLayout(el, art);
          say(msg, "info", "Pick a keg.", "Tap the marker on top of a keg to compare it.");
          function render(sel) {
            const vb = art.getAttribute("viewBox");
            art.innerHTML = lineup(sel) + `<rect x="0" y="-190" width="10" height="10" fill="none"/>` + SIZES.map((sz) => { const q = P([sz.x, -sz.x, sz.ht * SC + 8]); return hotspot(sz.id, q[0], q[1], `${sz.n}, ${sz.s}`, { r: 14 }); }).join("");
            if (vb && art._home) art.setAttribute("viewBox", vb);
            bindHotspots(art, Object.fromEntries(SIZES.map((sz) => [sz.id, () => pick(sz)])));
          }
          function pick(sz) {
            seen[sz.id] = true; if (Object.keys(seen).length === 4) ctx.done("all");
            render(sz.id);
            const pints = Math.floor(sz.gal * 8), q = P([sz.x, -sz.x, 23.3 * SC + 30]);
            Guided.UI.pop(vis, art, q[0], q[1], `<b>${sz.n} · ${sz.s}</b><div class="stats3"><div><strong>${sz.gal}</strong><span>gallons</span></div><div><strong>≈${pints}</strong><span>pints*</span></div><div><strong>${sz.id === "half" || sz.id === "pony" ? "Full" : "Small"}</strong><span>footprint</span></div></div>`);
            say(msg, "info", `${sz.n}:`, `${sz.f} <small style="color:var(--muted)">*16 oz pints: gallons × 128 ÷ 16, zero spillage.</small>`);
            ctx.say(`${sz.n}: ${sz.gal} gallons`);
            art.querySelector(`.hs[data-hs="${sz.id}"]`)?.focus();
          }
          render();
        } },
      { title: "Diagnose the foamy keg",
        lede: "One pilsner pours foamy. Tap the three orange markers to investigate before you fix anything.",
        goals: [{ id: "clues", text: "Check all three clues" }, { id: "call", text: "Make the right call" }],
        mount(el, ctx) {
          const got = {};
          const art = svg(null, bar(true), "Interactive bar: a walk-in cooler with three kegs, a thermometer and a gas panel, and a bar with three taps. The third tap, the pilsner, pours foamy.", { interactive: true, pad: 20 });
          const { msg, side, vis } = Guided.UI.tryLayout(el, art);
          say(msg, "info", "Service call.", "Nothing else has changed. Check the clues first.");
          const CL = { temp: ["Cooler temperature", "At temperature", "The cooler reads 38°F, right where it should be."], reg: ["Pilsner's regulator", "Set correctly", "The pilsner's secondary regulator is at its normal setting."], taps: ["Other taps", "Pouring perfectly", "Every other keg on the same gas pours perfectly."] };
          const list = h("div", { class: "clues" }, h("div", { class: "coach-k" }, "Clues checked"));
          const rows = {}; Object.entries(CL).forEach(([k, c]) => { rows[k] = h("div", { class: "clue" }, h("span", { class: "ci", "aria-hidden": "true" }, "?"), h("span", {}, h("b", {}, c[0]), h("span", { class: "cr" }, "Not checked yet"))); list.append(rows[k]); });
          side.append(list);
          let first = true;
          function render() {
            const vb = art.getAttribute("viewBox");
            art.innerHTML = bar(Object.keys(got).length === 3);
            if (vb && !first) art.setAttribute("viewBox", vb);
            const t = P([58, -58, 107]), r = P([-56, 135, 136]), f = P([226, 27, 118]);
            art.insertAdjacentHTML("beforeend", hotspot("temp", t[0], t[1], "Cooler thermometer", { r: 13, off: got.temp }) + hotspot("reg", r[0], r[1], "The pilsner's regulator gauge", { r: 13, off: got.reg }) + hotspot("taps", f[0], f[1], "The other two taps", { r: 13, off: got.taps }));
            bindHotspots(art, Object.fromEntries(Object.keys(CL).map((k) => [k, () => found(k)])));
            first = false;
          }
          function found(k) {
            got[k] = true; const c = CL[k];
            rows[k].classList.add("ok"); rows[k].querySelector(".ci").textContent = "✓"; rows[k].querySelector(".cr").textContent = c[1];
            const pt = { temp: [58, -58, 120], reg: [-56, 135, 146], taps: [226, 27, 126] }[k], q = P(pt);
            render(); Guided.UI.pop(vis, art, q[0], q[1], `<b>${c[0]}: ${c[1].toLowerCase()}</b>${c[2]}`, { kind: "ok" });
            say(msg, "ok", `${c[0]}: ${c[1].toLowerCase()}.`, `${3 - Object.keys(got).length ? `${3 - Object.keys(got).length} clue${3 - Object.keys(got).length > 1 ? "s" : ""} to go.` : ""}`);
            ctx.say(c[2]);
            if (Object.keys(got).length === 3) { ctx.done("clues"); setTimeout(decide, 900); }
          }
          function decide() {
            Guided.UI.pop(vis, art, 0, 0, null);
            const opts = [["Turn the cooler colder", false, "The cooler is already at temperature."], ["Raise the regulator pressure", false, "The regulator is fine, and so are the other kegs."], ["Suspect the keg's valve seal; send it back", true, "Only this keg foams, so the keg is the problem. A damaged seal bleeds CO₂ into the beer. Don't open it in the field."], ["Open the keg and fix the seal yourself", false, "Kegs shouldn't be serviced in the field."]];
            const fs = h("fieldset", { class: "choices" }, h("legend", { style: "font-size:13.5px;margin-bottom:4px" }, "All three check out. Your call:"));
            opts.forEach(([t, ok, why]) => {
              const inp = h("input", { type: "radio", name: "call" });
              const l = h("label", { class: "choice", style: "font-size:13px;padding:5px 9px;min-height:32px" }, inp, h("span", { class: "mark", "aria-hidden": "true" }), h("span", {}, t));
              inp.addEventListener("change", () => { fs.querySelectorAll(".choice").forEach((x) => x.classList.remove("right", "wrong")); l.classList.add(ok ? "right" : "wrong"); if (!ok) { l.classList.remove("shake-no"); void l.offsetWidth; l.classList.add("shake-no"); } say(msg, ok ? "ok" : "bad", ok ? "Right call." : "Not this one.", why); if (ok) ctx.done("call"); });
              fs.append(l);
            });
            list.classList.add("compact"); side.append(fs);
            say(msg, "info", "All clues in.", "The pilsner keg is circled. Make your call on the right.");
            ctx.refit();
          }
          render();
        } }
    ],
    checks: [
      { q: "About how many gallons does a ⅙ bbl keg hold?",
        art: () => svg(null, slab([-30, -30, -10], [60, 60, 10]) + kegAt(SIZES[3], [0, 0, 0]) + lbl([0, 0, -24], "⅙ bbl"), "A sixth-barrel keg."),
        options: [{ t: "5.17 gallons", ok: true, fb: "31 ÷ 6 ≈ 5.17." }, { t: "7.75 gallons", fb: "That's a ¼ bbl." }, { t: "15.5 gallons", fb: "That's a ½ bbl." }, { t: "6 gallons", fb: "31 ÷ 6 is about 5.17." }] },
      { q: "Why are tall ¼ and ⅙ bbl kegs becoming more common?",
        art: () => svg(null, floors(), "Equal floor areas holding half-barrel and sixth-barrel kegs."),
        options: [
          { t: "More fit in the same space, and they rotate fresh more often", ok: true, fb: "More variety per square foot, and fresher beer." },
          { t: "They hold more beer than a ½ bbl", fb: "They hold less." },
          { t: "They don't need couplers", fb: "They still need couplers." },
          { t: "½ bbl kegs aren't made anymore", fb: "½ bbl is still the familiar full-size keg." }
        ] },
      { q: "What's the most likely cause?", scenario: "One keg foams. The cooler, the regulator and every other keg on the same gas are fine.",
        art: () => svg([20, 6, 600, 362], valveCut(), "Cross-section of a keg valve with a chipped seal between the CO2 valve and the ball valve; gas bubbles leak into the beer path and the beer comes out foamy."),
        options: [
          { t: "A damaged seal between the ball valve and CO₂ valve", ok: true, fb: "The classic defect, often blamed on temperature or pressure." },
          { t: "The cooler is too warm", fb: "The cooler checks out." },
          { t: "The gas pressure is too low", fb: "The regulator is fine, and so are the other kegs." },
          { t: "The faucet is the wrong style", fb: "Faucet style wouldn't make one keg foam." }
        ] }
    ],
    takeaways: [
      "Kegs <strong>aren't serviced in the field</strong>. Spot the problem and send the keg back.",
      "Most common defect: a <strong>damaged ball-valve/CO₂-valve seal</strong>, which causes foam that's easy to blame on temperature or pressure.",
      "<strong>½ bbl 15.5 gal · ¼ bbl 7.75 gal · ⅙ bbl 5.17 gal.</strong> Tall ¼ and ⅙ kegs save space. The pony is fading."
    ]
  });
})();
