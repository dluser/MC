(function () {
  const { cyl, box, parts, label, hotspot, P, slab, grid, svg, bindHotspots, f1 } = ISO;
  const { h, say, dnd } = Guided.UI;
  const lbl = (pt, t, opt) => { const q = P(pt); return label(q[0], q[1], t, opt); };
  const badge = (pt, ok) => { const q = P(pt); return `<g aria-hidden="true"><circle cx="${f1(q[0])}" cy="${f1(q[1])}" r="15" fill="${ok ? "#2a9a6c" : "#ec5a5f"}" stroke="#0b3b7a" stroke-width="2"/>${ok ? `<path d="M${q[0] - 6} ${q[1]} l4 5 l8 -10" stroke="#fff" stroke-width="3.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>` : `<path d="M${q[0] - 5} ${q[1] - 5} l10 10 M${q[0] + 5} ${q[1] - 5} l-10 10" stroke="#fff" stroke-width="3.2" stroke-linecap="round"/>`}</g>`; };
  const gasPuff = (pt) => { const q = P(pt); return `<g class="fx-vent" aria-hidden="true">${[0, 1, 2].map((i) => `<circle style="animation-delay:${i * .45}s" cx="${f1(q[0] + 6)}" cy="${f1(q[1] - 4)}" r="9" fill="#fff" stroke="#9cc3f0" stroke-width="1.6"/>`).join("")}</g>`; };
  const discTag = () => { const a = P([6, 0, 158]); return label(a[0] + 66, a[1] + 14, "Safety disc", { fs: 12, anchor: "start" }) + `<path d="M${f1(a[0] + 3)} ${f1(a[1])} L${f1(a[0] + 40)} ${f1(a[1] + 14)} L${f1(a[0] + 66)} ${f1(a[1] + 14)}" stroke="#0b3b7a" stroke-width="1.6" fill="none"/><circle cx="${f1(a[0] + 3)}" cy="${f1(a[1])}" r="3.6" fill="#0b3b7a" stroke="#fff" stroke-width="1.5"/>`; };
  const spray = (pt) => { const q = P(pt); return `<g class="fx-spray" aria-hidden="true"><g stroke="#18a0fb" stroke-width="4" fill="none" stroke-linecap="round"><path d="M${f1(q[0] + 6)} ${f1(q[1])} q14 -8 22 -24"/><path d="M${f1(q[0] + 8)} ${f1(q[1] + 6)} q20 0 30 -10"/><path d="M${f1(q[0] + 6)} ${f1(q[1] + 12)} q16 8 26 6"/></g>${[[30, -28], [40, -6], [34, 20], [46, 10], [24, -16]].map(([dx, dy], i) => `<path class="drop" style="animation-delay:${i * .2}s" d="M${f1(q[0] + dx)} ${f1(q[1] + dy - 5)} q3.5 5 0 8 q-3.5 -3 0 -8z" fill="#7cc4ff" stroke="#0b3b7a" stroke-width="1"/>`).join("")}</g>`; };
  const LEVELS = [
    { v: "≈0.04%", sev: "Normal air", c: "#0f7b56", fog: 0, sx: "No symptoms. This is roughly the CO₂ level of normal outdoor air.", pose: "ok", pills: ["Breathing normally"] },
    { v: "2–3%", sev: "Caution", c: "#9a5b00", fog: 14, sx: "Shortness of breath, deep breathing.", pose: "breath", pills: ["Short of breath", "Deep breathing"] },
    { v: "5%", sev: "Warning", c: "#9a5b00", fog: 28, sx: "Breathing becomes heavy, sweating, pulse quickens.", pose: "sweat", pills: ["Heavy breathing", "Sweating", "Faster pulse"] },
    { v: "7.5%", sev: "Danger", c: "#c7333a", fog: 44, sx: "Headaches, dizziness, restlessness, breathlessness, increased heart rate and blood pressure, visual distortion.", pose: "dizzy", pills: ["Headache", "Dizziness", "Visual distortion", "Racing heart"] },
    { v: "10%", sev: "Severe danger", c: "#c7333a", fog: 62, sx: "Impaired hearing, nausea, vomiting, loss of consciousness.", pose: "kneel", pills: ["Nausea, vomiting", "Impaired hearing", "Losing consciousness"] },
    { v: "30%", sev: "Deadly", c: "#8e1d22", fog: 100, sx: "Coma, convulsions, death.", pose: "down", pills: ["Coma", "Convulsions", "Death"] }
  ];
  const SKIN = ["#fde3cf", "#f5c9a8", "#e3a982", "#c4865f"], SHIRT = "blue", PANTS = "deep";
  // brewery worker. o = point between the feet. pose: ok | breath | sweat | dizzy | kneel | down
  function worker(o, pose) {
    const A = (q) => ISO.add(o, q);
    const arm = (a, b, c) => ISO.tube([A(a), A(b), A(c)], 3.6, { fill: PAL_SHIRT, noHi: true }).svg;
    let s = "", head;
    if (pose === "down") {
      s += cyl(A([-30, 0, 6]), [1, 0, 0], 6, 30, PANTS, { sw: 1.6 }) + cyl(A([-30, 10, 6]), [1, 0, 0], 6, 30, PANTS, { sw: 1.6 });
      s += cyl(A([0, 5, 10]), [1, 0, 0], 12, 34, SHIRT, { sw: 1.8 });
      s += arm([10, 18, 8], [22, 26, 4], [30, 30, 3]);
      head = P(A([46, 5, 10]));
    } else if (pose === "kneel") {
      s += cyl(A([-14, -6, 4]), [1, 0, 0], 5.5, 16, PANTS, { sw: 1.6 }) + cyl(A([-14, 6, 4]), [1, 0, 0], 5.5, 16, PANTS, { sw: 1.6 });
      s += cyl(A([2, -6, 4]), [0, 0, 1], 5.5, 22, PANTS, { sw: 1.6 }) + cyl(A([2, 6, 4]), [0, 0, 1], 5.5, 22, PANTS, { sw: 1.6 });
      s += cyl(A([6, 0, 24]), [0.45, 0, 1], 12, 32, SHIRT, { r1: 13, sw: 1.8 });
      s += arm([20, 12, 50], [30, 16, 26], [34, 18, 2]) + arm([20, -12, 50], [26, -10, 40], [30, 0, 62]);
      head = P(A([26, 0, 70]));
    } else {
      const dz = 0;
      s += box(A([-3, -10, 0]), [13, 7, 5], "rubber", { sw: 1.4 }) + box(A([-3, 3, 0]), [13, 7, 5], "rubber", { sw: 1.4 });
      s += cyl(A([0, -6, 4]), [0, 0, 1], 5.2, 38, PANTS, { sw: 1.6 }) + cyl(A([0, 6, 4]), [0, 0, 1], 5.2, 38, PANTS, { sw: 1.6 });
      s += cyl(A([0, 0, 40]), [0, 0, 1], 12, 34, SHIRT, { r1: 13.5, sw: 1.8 });
      s += ISO.poly([A([12.5, -7, 44]), A([12.5, 7, 44]), A([13.5, 7, 70]), A([13.5, -7, 70])], ISO.PAL.dark[1], { sw: 1.4 }); // apron bib
      if (pose === "dizzy") s += arm([0, -14, 70], [6, -18, 50], [6, -14, 36]) + arm([0, 14, 70], [12, 18, 82], [6, 8, 92]);
      else if (pose === "sweat") s += arm([0, -14, 70], [8, -18, 52], [12, -12, 46]) + arm([0, 14, 70], [8, 18, 52], [12, 12, 46]);
      else s += arm([0, -14, 70], [3, -17, 52], [4, -16, 36]) + arm([0, 14, 70], [3, 17, 52], [4, 16, 36]);
      head = P(A([0, 0, 88 + dz]));
    }
    s += `<circle cx="${f1(head[0])}" cy="${f1(head[1])}" r="11" fill="${pose === "kneel" ? "#d9e7c4" : SKIN[1]}" stroke="#0b3b7a" stroke-width="1.8"/>`;
    s += `<path d="M${f1(head[0] - 11)} ${f1(head[1] - 1)} A11 11 0 0 1 ${f1(head[0] + 11)} ${f1(head[1] - 1)} Q${f1(head[0])} ${f1(head[1] - 6)} ${f1(head[0] - 11)} ${f1(head[1] - 1)} Z" fill="#5b3b24" stroke="#0b3b7a" stroke-width="1.6"/>`;
    // symptom effects
    const [hx, hy] = head;
    const breath = (n) => [0, 1, 2].slice(0, n).map((i) => `<path class="fx-breath" style="animation-delay:${i * 0.35}s" d="M${f1(hx + 14)} ${f1(hy + 4 + i * 5)} q8 -4 16 0" fill="none" stroke="#5b8fd6" stroke-width="2.2" stroke-linecap="round"/>`).join("");
    if (pose === "breath") s += breath(2);
    if (pose === "sweat") s += breath(3) + [[-12, -2, 0], [12, -4, 0.5], [-8, 6, 1]].map(([dx, dy, d]) => `<path class="fx-sweat" style="animation-delay:${d}s" d="M${f1(hx + dx)} ${f1(hy + dy - 5)} q3 5 0 7 q-3 -2 0 -7z" fill="#7cc4ff" stroke="#0b3b7a" stroke-width="1"/>`).join("");
    if (pose === "dizzy") s += `<g class="fx-dizzy" transform="translate(${f1(hx)} ${f1(hy - 22)})"><ellipse rx="17" ry="5.5" fill="none" stroke="#9a5b00" stroke-width="1.8" stroke-dasharray="4 3"/>${[0, 2.1, 4.2].map((a) => `<path transform="translate(${f1(17 * Math.cos(a))} ${f1(5.5 * Math.sin(a))})" d="M0 -4.5 L1.3 -1.3 L4.5 0 L1.3 1.3 L0 4.5 L-1.3 1.3 L-4.5 0 L-1.3 -1.3Z" fill="#f6a724" stroke="#0b3b7a" stroke-width=".8"/>`).join("")}</g>`;
    if (pose === "kneel") s += `<path class="fx-breath" d="M${f1(hx + 13)} ${f1(hy + 6)} q5 -4 10 0 q5 4 10 0" fill="none" stroke="#4f9a3a" stroke-width="2.4" stroke-linecap="round"/><path class="fx-breath" style="animation-delay:.4s" d="M${f1(hx + 13)} ${f1(hy + 13)} q5 -4 10 0 q5 4 10 0" fill="none" stroke="#4f9a3a" stroke-width="2.4" stroke-linecap="round"/>`;
    if (pose === "down") s += `<circle class="fx-alert" cx="${f1(hx - 30)}" cy="${f1(hy - 4)}" r="44" fill="none" stroke="#c7333a" stroke-width="3"/>`;
    return `<g class="worker${pose === "dizzy" ? " sway" : ""}">${s}</g>`;
  }
  const PAL_SHIRT = ISO.PAL.blue[1];
  // CO2 leaking from a valve: hissing lines
  const hiss = (pt) => { const q = P(pt); return `<g class="fx-hiss" aria-hidden="true">${[0, 1, 2].map((i) => `<path style="animation-delay:${i * 0.25}s" d="M${f1(q[0] + 6)} ${f1(q[1] - 2 + i * 5)} q10 -5 20 0 q10 5 20 0" fill="none" stroke="#9cc3f0" stroke-width="2.4" stroke-linecap="round"/>`).join("")}</g>`; };
  // keg cellar. opt.bare hides the meter and symptom pills (used in the check)
  function cellar(lv, door, opt = {}) {
    const L = LEVELS[lv];
    let s = slab([0, 0, -10], [270, 210, 10], { pal: ["#eef2f7", "#dfe6ef", "#cdd7e3", "#b6c3d3"] });
    s += box([-8, 0, 0], [8, 210, 124], "steel") + box([0, -8, 0], [270, 8, 124], "steel");
    // door frame on the back wall
    s += ISO.poly([[176, -1, 0], [176, -1, 108], [234, -1, 108], [234, -1, 0]], "#cfe0f4", { sw: 1.8 });
    if (door) {
      s += ISO.poly([[180, -1, 0], [180, -1, 104], [230, -1, 104], [230, -1, 0]], "#ffffff", { sw: 1.2 }); // daylight
      s += ISO.poly([[180, 0, 0], [180, 0, 104], [186, 48, 104], [186, 48, 0]], "#9dc0ea", { sw: 1.8 });
      s += `<g class="fx-air">${[0, 1, 2].map((i) => { const a = P([205, 14 + i * 10, 30 + i * 18]); return `<path style="animation-delay:${i * .3}s" d="M${f1(a[0])} ${f1(a[1])} q-12 8 -26 6 q-12 -2 -22 6" fill="none" stroke="#2a9a6c" stroke-width="3" stroke-linecap="round"/>`; }).join("")}</g>`;
    } else {
      s += ISO.poly([[180, -1, 0], [180, -1, 104], [230, -1, 104], [230, -1, 0]], "#9dc0ea", { sw: 1.8 });
      const k = P([222, -1, 52]); s += `<circle cx="${f1(k[0])}" cy="${f1(k[1])}" r="3" fill="#0b3b7a"/>`;
    }
    // CO2 cylinders chained to the wall, with gas lines up the wall
    [[22, 40], [22, 84]].forEach(([x, y]) => { s += parts.tank([x, y, 0], { r: 16, h: 96 }); s += ISO.line([x - 16, y - 14, 70], [x - 16, y + 14, 70], { sw: 2.2, stroke: "#5c6679" }); });
    s += ISO.tube([[22, 40, 118], [22, 40, 130], [0, 40, 130], [0, 140, 130], [0, 140, 76]], 2.6, { fill: "#cfe6ff" }).svg;
    // kegs
    [[60, 150], [104, 166]].forEach(([x, y]) => { s += parts.keg([x, y, 0], { r: 22, h: 58 }); });
    s += parts.keg([60, 150, 58], { r: 22, h: 58 });
    if (lv > 0 && !door) s += hiss([22, 40, 116]);
    s += worker([176, 132, 0], L.pose);
    if (L.fog) s += `<g class="fog">${box([0, 0, 0], [270, 210, L.fog], ["#cfe2fb", "#b5d1f5", "#9cc0ee", "#86afe6"], { opacity: 0.38, sw: 0 })}</g>`;
    if (!opt.bare) {
      // level bar under the cellar
      const m0 = P([0, 210, 0]), m1 = P([270, 210, 0]);
      const bx0 = m0[0] - 10, by = m1[1] + 40, seg = 72;
      s += `<g class="meter" aria-hidden="true"><text x="${f1(bx0)}" y="${f1(by - 12)}" font-family="Inter,system-ui" font-size="12" font-weight="800" fill="#56637c" letter-spacing=".06em">CO₂ IN THE AIR</text>`;
      LEVELS.forEach((q, i) => { const x = bx0 + i * (seg + 6), on = i === lv; s += `<rect x="${f1(x)}" y="${f1(by)}" width="${seg}" height="30" rx="9" fill="${on ? q.c : i < lv ? "#eef2f7" : "#fff"}" stroke="${on ? "#0b3b7a" : "#cdd7e3"}" stroke-width="${on ? 2.2 : 1.2}"/><text x="${f1(x + seg / 2)}" y="${f1(by + 20)}" text-anchor="middle" font-family="Inter,system-ui" font-size="13.5" font-weight="800" fill="${on ? "#fff" : "#56637c"}">${q.v}</text>`; });
      s += `</g>`;
      // symptom pills beside the worker (left out of the leak activity, where the info bar gives the handout's full symptom list)
      if (!opt.noPills) {
      const rc = P([270, 0, 60]), hp0 = P([176, 132, 100]);
      const hp = opt.pillsRight ? [rc[0] + 20, rc[1] + 74] : [hp0[0] + 46, hp0[1] - 40];
      if (opt.pillsRight) s += `<text x="${f1(hp[0])}" y="${f1(hp[1] - 24)}" font-family="Inter,system-ui" font-size="12" font-weight="800" fill="#56637c" letter-spacing=".06em">THE WORKER FEELS</text>`;
      L.pills.forEach((t, i) => { s += `<g class="pill-in" style="animation-delay:${i * .18}s">${label(hp[0], hp[1] + i * 30, t, { bg: i === 0 && lv === 0 ? "#e8f6ef" : "#fdeceb", fg: lv === 0 ? "#0f7b56" : "#c7333a", stroke: lv === 0 ? "#0f7b56" : "#c7333a", anchor: "start", fs: 12.5 })}</g>`; });
      s += `<rect class="frame-keep" x="${f1(hp[0])}" y="${f1(hp[1] - 30)}" width="180" height="130" fill="none"/>`;
      }
    }
    return s;
  }

  // ---------- storage floor plan ----------
  const ZONES = {
    cool: { o: [0, 0], label: "Cool storeroom", p: 0.25, k: "ok", t: "Normal pressure. A cool storage area is the right place.", c: [62, 74] },
    warm: { o: [176, 0], label: "Warm back room", p: 0.5, k: "warn", t: "Pressure rises as the room warms. Keep cylinders away from heat.", c: [58, 80] },
    boiler: { o: [0, 146], label: "Boiler room", p: 0.88, k: "bad", t: "High heat drives pressure up. The safety disc may rupture and vent the cylinder.", c: [104, 70] },
    van: { o: [176, 146], label: "Delivery van, hot day", p: 1, k: "bad", t: "A closed vehicle gets extremely hot. Pressure can climb until the safety disc ruptures. Never store a cylinder in a vehicle.", c: [56, 70] }
  };
  const GRID = { cool: [0, 0], warm: [1, 0], boiler: [0, 1], van: [1, 1] };
  const tankPos = (k) => { const z = ZONES[k]; return [z.o[0] + z.c[0], z.o[1] + z.c[1], k === "van" ? 14 : 0]; };
  const heat = (pt, n = 3) => { const q = P(pt); return `<g class="fx-heat" aria-hidden="true">${[...Array(n)].map((_, i) => `<path style="animation-delay:${i * .5}s" d="M${f1(q[0] - 20 + i * 20)} ${f1(q[1])} q-6 -8 0 -16 q6 -8 0 -16" fill="none" stroke="#ff7a2e" stroke-width="2.6" stroke-linecap="round"/>`).join("")}</g>`; };
  function tankSvg(k, up, hot, live) {
    const c = tankPos(k), z = ZONES[k];
    const body = up ? parts.tank(c, { r: 16, h: 96 }) : parts.tankSide([c[0] - 56, c[1], c[2]], { r: 15, h: 88 });
    let fx = "";
    if (z.p > 0.8) fx = up ? `<g class="fx-vent">${[0, 1, 2].map((i) => { const q = P([c[0], c[1], 118 + c[2]]); return `<circle style="animation-delay:${i * .4}s" cx="${f1(q[0] + 4)}" cy="${f1(q[1] - 6)}" r="8" fill="#fff" stroke="#9cc3f0" stroke-width="1.6"/>`; }).join("")}</g>` : spray([c[0] + 46, c[1], 16 + c[2]]);
    const a11y = live ? ` tabindex="0" role="button" aria-label="Spare CO₂ cylinder, ${up ? "upright" : "on its side"}, in the ${z.label.toLowerCase()}. Drag it to another room, or use the arrow keys. Press Enter to ${up ? "tip it over" : "stand it up"}."` : "";
    return `<g id="tank" class="${live ? "drag-el" : ""}${hot ? " hot" : ""}${z.p > 0.8 ? " danger" : ""}"${a11y}>${body}${fx}</g>`;
  }
  function storage(at, up, opt = {}) {
    let s = slab([-14, -14, -14], [380, 316, 12], { pal: "steel" });
    const room = (k, inner) => { const [x, y] = ZONES[k].o; return inner(x, y); };
    // zone highlights (for dragging)
    Object.keys(ZONES).forEach((k) => { const [x, y] = ZONES[k].o; s += `<g class="zhl" data-z="${k}">${ISO.poly([[x + 4, y + 4, 0.5], [x + 162, y + 4, 0.5], [x + 162, y + 132, 0.5], [x + 4, y + 132, 0.5]], "#2f74d0", { sw: 0, op: 0.18 })}</g>`; });
    const draw = { cool(x, y) {
        let r = box([x, y, -2], [166, 136, 2], ["#f3f8ff", "#e6f0fc", "#d6e6f9", "#c4daf5"], { sw: 1.4 });
        r += box([x - 6, y, 0], [6, 136, 60], "steel", { sw: 1.4 }) + box([x, y - 6, 0], [166, 6, 60], "steel", { sw: 1.4 });
        // wire shelving with boxes
        r += [0, 1, 2].map((i) => box([x + 96, y + 4, 4 + i * 26], [60, 20, 3], "steel", { sw: 1.2 })).join("") + [[96, 4], [153, 4], [96, 21], [153, 21]].map(([dx, dy]) => box([x + dx, y + dy, 0], [3, 3, 60], "dark", { sw: 0.8 })).join("");
        r += box([x + 104, y + 6, 7], [20, 16, 14], "kraft", { sw: 1.2 }) + box([x + 128, y + 6, 33], [22, 16, 16], "kraft", { sw: 1.2 }) + box([x + 104, y + 6, 33], [16, 16, 12], "white", { sw: 1.2 });
        r += parts.keg([x + 26, y + 30, 0], { r: 17, h: 46, slots: false }) + parts.keg([x + 30, y + 100, 0], { r: 17, h: 46, slots: false });
        return r;
      },
      warm(x, y) {
        let r = box([x, y, -2], [166, 136, 2], ["#fffaf2", "#fff2df", "#ffe7c9", "#ffdcb3"], { sw: 1.4 });
        r += box([x, y - 6, 0], [166, 6, 60], "steel", { sw: 1.4 });
        // sunny window on the back wall
        r += ISO.poly([[x + 20, y - 0.5, 20], [x + 70, y - 0.5, 20], [x + 70, y - 0.5, 54], [x + 20, y - 0.5, 54]], "#fff4cc", { sw: 1.6 }) + ISO.line([x + 45, y - 0.5, 20], [x + 45, y - 0.5, 54], { sw: 1.4 });
        const sun = P([x + 45, y - 0.5, 46]); r += `<circle cx="${f1(sun[0])}" cy="${f1(sun[1])}" r="6" fill="#f6a724"/>`;
        // radiator
        r += box([x + 104, y + 2, 0], [44, 12, 34], "white", { sw: 1.4 }) + [0, 1, 2, 3, 4].map((i) => ISO.line([x + 110 + i * 8, y + 14, 4], [x + 110 + i * 8, y + 14, 30], { sw: 1.3 })).join("");
        r += heat([x + 126, y + 14, 42], 2);
        r += box([x + 120, y + 70, 0], [30, 26, 22], "kraft", { sw: 1.3 }) + box([x + 124, y + 74, 22], [22, 20, 16], "kraft", { sw: 1.3 });
        return r;
      },
      boiler(x, y) {
        let r = box([x, y, -2], [166, 136, 2], ["#fff4ec", "#ffe7d9", "#ffd9c4", "#ffc9ad"], { sw: 1.4 });
        r += box([x - 6, y, 0], [6, 136, 60], "steel", { sw: 1.4 });
        // boiler: tall cylinder with a burner window, flue and pipes
        const bx = x + 30, by = y + 34;
        r += ISO.tube([[bx, by, 60], [x + 2, by, 60]], 3, { fill: "#ffd7b8" }).svg + ISO.tube([[bx, by + 10, 30], [x + 2, by + 10, 30]], 3, { fill: "#cfe6ff" }).svg;
        r += cyl([bx, by, 0], [0, 0, 1], 22, 76, "dark") + cyl([bx, by, 76], [0, 0, 1], 22, 8, "dark", { r1: 10 }) + cyl([bx, by, 84], [0, 0, 1], 6, 24, "steel", { sw: 1.6 });
        r += ISO.poly([[bx + 16, by + 15, 10], [bx + 16, by + 15, 28], [bx + 8, by + 20, 28], [bx + 8, by + 20, 10]], "#ffab70", { sw: 1.6 });
        const fl = P([bx + 12, by + 18, 15]); r += `<path class="fx-flame" d="M${f1(fl[0] - 4)} ${f1(fl[1] + 6)} q-2 -8 4 -14 q6 6 4 14 z" fill="#ff7a2e" stroke="#e05a10" stroke-width="1"/>`;
        r += ISO.gauge([bx + 6, by + 22, 52], [0.3, 1, 0], 6, 0.82);
        r += heat([bx, by, 118], 3);
        return r;
      },
      van(x, y) {
        let r = box([x, y, -2], [166, 136, 2], ["#9aa3b2", "#7e889a", "#646e80", "#4c5566"], { sw: 1.4 });
        r += ISO.poly([[x + 8, y + 128, 0.4], [x + 158, y + 128, 0.4], [x + 158, y + 131, 0.4], [x + 8, y + 131, 0.4]], "#fff", { sw: 0 });
        // sun
        const sp = P([x + 150, y + 10, 150]); r += `<g class="fx-sun"><circle cx="${f1(sp[0])}" cy="${f1(sp[1])}" r="13" fill="#ffcb52" stroke="#e05a10" stroke-width="1.6"/>${[...Array(8)].map((_, i) => { const a = i * Math.PI / 4; return `<line x1="${f1(sp[0] + 17 * Math.cos(a))}" y1="${f1(sp[1] + 17 * Math.sin(a))}" x2="${f1(sp[0] + 24 * Math.cos(a))}" y2="${f1(sp[1] + 24 * Math.sin(a))}" stroke="#f6a724" stroke-width="2.6" stroke-linecap="round"/>`; }).join("")}</g>`;
        // wheels (far side first)
        r += cyl([x + 34, y + 36, 11], [0, 1, 0], 11, 6, "rubber", { sw: 1.6 }) + cyl([x + 128, y + 36, 11], [0, 1, 0], 11, 6, "rubber", { sw: 1.6 });
        r += box([x + 14, y + 40, 8], [140, 60, 8], "dark", { sw: 1.4 }); // chassis
        return r;
      },
      vanBody(x, y) {
        // cargo box (cut-away roof so the cylinder shows), cab, hood
        let r = ISO.poly([[x + 14, y + 40, 16], [x + 106, y + 40, 16], [x + 106, y + 40, 78], [x + 14, y + 40, 78]], "#e8f1fc", { sw: 1.6 }); // far wall
        r += ISO.poly([[x + 14, y + 40, 16], [x + 14, y + 100, 16], [x + 14, y + 100, 78], [x + 14, y + 40, 78]], "#dbe7f7", { sw: 1.6 }); // back wall
        return r;
      },
      vanFront(x, y) {
        let r = "";
        r += box([x + 106, y + 40, 16], [32, 60, 58], "white") + box([x + 138, y + 40, 16], [20, 60, 26], "white");
        r += ISO.poly([[x + 138.5, y + 44, 44], [x + 138.5, y + 96, 44], [x + 132, y + 96, 72], [x + 132, y + 44, 72]], "#9dc0ea", { sw: 1.6 }); // windshield
        r += ISO.poly([[x + 112, y + 100.5, 48], [x + 132, y + 100.5, 48], [x + 132, y + 100.5, 68], [x + 112, y + 100.5, 68]], "#9dc0ea", { sw: 1.4 }); // side window
        r += ISO.poly([[x + 14, y + 100, 16], [x + 106, y + 100, 16], [x + 106, y + 100, 46], [x + 14, y + 100, 46]], "#ffffff", { sw: 1.6, op: 0.96 }); // near wall (half height, cut away)
        r += ISO.poly([[x + 14, y + 100.5, 30], [x + 106, y + 100.5, 30], [x + 106, y + 100.5, 36], [x + 14, y + 100.5, 36]], "#ff7a2e", { sw: 0 }); // stripe
        const cut = [[x + 14, y + 100, 46], [x + 106, y + 100, 46]].map(P); r += `<path d="M${f1(cut[0][0])} ${f1(cut[0][1])} L${f1(cut[1][0])} ${f1(cut[1][1])}" stroke="#0b3b7a" stroke-width="2" stroke-dasharray="5 4"/>`;
        r += cyl([x + 34, y + 100, 11], [0, 1, 0], 11, 6, "rubber", { sw: 1.6, hole: 4.5, holeFill: "#c6dcf5" }) + cyl([x + 128, y + 100, 11], [0, 1, 0], 11, 6, "rubber", { sw: 1.6, hole: 4.5, holeFill: "#c6dcf5" });
        r += heat([x + 60, y + 70, 100], 3);
        return r;
      } };
    const wall = (o, sz) => box(o, sz, ["#ffffff", "#eef4fc", "#dbe7f7", "#c6dcf5"], { sw: 1.4 });
    s += room("cool", draw.cool); if (at === "cool") s += tankSvg("cool", up, opt.hot, opt.live);
    s += wall([166, 0, 0], [8, 140, 28]) + wall([0, 136, 0], [166, 8, 28]); // partitions
    s += room("warm", draw.warm); if (at === "warm") s += tankSvg("warm", up, opt.hot, opt.live);
    s += room("boiler", draw.boiler); if (at === "boiler") s += tankSvg("boiler", up, opt.hot, opt.live);
    s += wall([166, 144, 0], [8, 138, 28]) + wall([174, 136, 0], [168, 8, 28]); // exterior walls along the lot
    s += room("van", draw.van) + room("van", draw.vanBody); if (at === "van") s += tankSvg("van", up, opt.hot, opt.live); s += room("van", draw.vanFront);
    // labels last so nothing covers them
    const SPOT = { cool: { a: [12, 40, 62], to: [-34, -44], anchor: "end" }, warm: { a: [150, 10, 60], to: [44, -26], anchor: "start" }, boiler: { a: [6, 110, 62], to: [-36, -12], anchor: "end" }, van: { a: [150, 128, 0], to: [34, 24], anchor: "start" } };
    Object.entries(ZONES).forEach(([k, z]) => {
      const sp = SPOT[k], [x, y] = z.o, A = P([x + sp.a[0], y + sp.a[1], sp.a[2]]), L = [A[0] + sp.to[0], A[1] + sp.to[1]];
      const hot = k === "boiler" || k === "van";
      s += `<path d="M${f1(A[0])} ${f1(A[1])} L${f1(L[0])} ${f1(L[1])}" stroke="#0b3b7a" stroke-width="1.4" stroke-dasharray="3 3" fill="none"/><circle cx="${f1(A[0])}" cy="${f1(A[1])}" r="3.4" fill="#0b3b7a" stroke="#fff" stroke-width="1.4"/>`;
      s += label(L[0] + (sp.anchor === "start" ? -4 : sp.anchor === "end" ? 4 : 0), L[1], z.label, { anchor: sp.anchor, fs: 13, bg: hot ? "#fdeceb" : k === "warm" ? "#fff6e8" : "#fff", fg: hot ? "#c7333a" : k === "warm" ? "#9a5b00" : "#0b3b7a", stroke: hot ? "#c7333a" : k === "warm" ? "#9a5b00" : "#0b3b7a" });
    });
    return s;
  }
  const gaugeSvg = (p) => { const a = (-130 + p * 260) * Math.PI / 180; const x = 27 + 17 * Math.sin(a), y = 30 - 17 * Math.cos(a); return `<svg viewBox="0 0 54 54" aria-hidden="true"><circle cx="27" cy="30" r="22" fill="#fff" stroke="#0b3b7a" stroke-width="3"/><path d="M11 44 A 22 22 0 1 1 43 44" fill="none" stroke="url(#hg)" stroke-width="4"/><defs><linearGradient id="hg"><stop offset="0" stop-color="#2a9a6c"/><stop offset=".55" stop-color="#f6a724"/><stop offset="1" stop-color="#ec5a5f"/></linearGradient></defs><line x1="27" y1="30" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}" stroke="#0c1a30" stroke-width="3" stroke-linecap="round"/><circle cx="27" cy="30" r="3" fill="#0c1a30"/></svg>`; };

  // Learn 1: side view. Thermometer on its stand + a cut-away cylinder; heat cycles up and down
  function heatStory() {
    const I = "#0b3b7a";
    let s = `<defs><clipPath id="cyclip"><path d="M300 104 Q300 76 330 70 L330 58 L370 58 L370 70 Q400 76 400 104 L400 300 Q400 310 390 310 L310 310 Q300 310 300 300 Z"/></clipPath>
      <linearGradient id="merc" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#c7333a"/><stop offset="1" stop-color="#ec5a5f"/></linearGradient></defs>`;
    s += `<rect x="40" y="318" width="190" height="12" rx="6" fill="#d9e9fc" stroke="${I}" stroke-width="2"/><rect x="280" y="310" width="140" height="10" rx="5" fill="#d9e9fc" stroke="${I}" stroke-width="2"/>`;
    // thermometer: base, stem, scale, bulb
    s += `<path d="M76 318 L84 300 L136 300 L144 318 Z" fill="#c6dcf5" stroke="${I}" stroke-width="2.4" stroke-linejoin="round"/>`;
    s += `<rect x="96" y="60" width="28" height="238" rx="14" fill="#fff" stroke="${I}" stroke-width="2.6"/>`;
    for (let i = 0; i <= 8; i++) { const y = 84 + i * 22; s += `<line x1="${i % 2 ? 126 : 124}" y1="${y}" x2="136" y2="${y}" stroke="${I}" stroke-width="1.6"/>`; }
    s += `<text x="142" y="90" font-family="Inter,system-ui" font-size="13" font-weight="800" fill="#c7333a">HOT</text><text x="142" y="258" font-family="Inter,system-ui" font-size="13" font-weight="800" fill="#2f74d0">COOL</text>`;
    s += `<rect class="ht-merc" x="104" y="84" width="12" height="200" rx="6" fill="url(#merc)"/>`;
    s += `<circle cx="110" cy="282" r="20" fill="#ec5a5f" stroke="${I}" stroke-width="2.6"/><circle cx="104" cy="276" r="5" fill="#fff" opacity=".6"/>`;
    // cylinder body (side view) with valve and gauge
    s += `<path d="M300 104 Q300 76 330 70 L330 58 L370 58 L370 70 Q400 76 400 104 L400 300 Q400 310 390 310 L310 310 Q300 310 300 300 Z" fill="#eef5fe" stroke="${I}" stroke-width="3"/>`;
    s += `<g clip-path="url(#cyclip)">`;
    const mols = [[318, 120], [352, 108], [384, 132], [330, 160], [372, 176], [312, 206], [352, 222], [388, 214], [326, 258], [366, 270], [392, 290], [316, 296], [346, 150], [362, 244]];
    s += `<g class="ht-cool">` + mols.map(([x, y], i) => `<g class="mol" style="animation-delay:${(-i * 0.37).toFixed(2)}s;--mx:${(i % 2 ? 1 : -1) * (4 + (i % 4))}px;--my:${(i % 3 - 1) * 5}px"><circle cx="${x}" cy="${y}" r="6.5" fill="#77abe9" stroke="${I}" stroke-width="1.4"/></g>`).join("") + `</g>`;
    s += `<g class="ht-hot">` + mols.map(([x, y], i) => `<g class="mol fast" style="animation-delay:${(-i * 0.13).toFixed(2)}s;--mx:${(i % 2 ? 1 : -1) * (12 + (i % 4) * 4)}px;--my:${((i % 3) - 1) * 16 || 10}px"><circle cx="${x}" cy="${y}" r="6.5" fill="#ec5a5f" stroke="${I}" stroke-width="1.4"/></g>`).join("") + `</g>`;
    s += `</g>`;
    s += `<path d="M300 104 Q300 76 330 70 L330 58 L370 58 L370 70 Q400 76 400 104 L400 300 Q400 310 390 310 L310 310 Q300 310 300 300 Z" fill="none" stroke="${I}" stroke-width="3"/>`;
    s += `<rect x="336" y="38" width="28" height="20" rx="3" fill="#eecb72" stroke="${I}" stroke-width="2"/><rect x="326" y="28" width="48" height="10" rx="4" fill="#56637c" stroke="${I}" stroke-width="2"/>`;
    s += `<line x1="364" y1="48" x2="392" y2="48" stroke="${I}" stroke-width="5"/><circle cx="416" cy="48" r="24" fill="#fff" stroke="${I}" stroke-width="2.6"/><path d="M398 62 A22 22 0 1 1 434 62" fill="none" stroke="url(#hg2)" stroke-width="4"/>`;
    s += `<defs><linearGradient id="hg2"><stop offset="0" stop-color="#2a9a6c"/><stop offset=".55" stop-color="#f6a724"/><stop offset="1" stop-color="#ec5a5f"/></linearGradient></defs>`;
    s += `<g class="ht-needle" style="transform-origin:416px 48px"><line x1="416" y1="48" x2="416" y2="30" stroke="#0c1a30" stroke-width="3" stroke-linecap="round"/></g><circle cx="416" cy="48" r="3.4" fill="#0c1a30"/>`;
    // outward pressure arrows
    [[290, 200, -1, 0], [410, 200, 1, 0], [290, 140, -1, 0], [410, 140, 1, 0], [290, 260, -1, 0], [410, 260, 1, 0]].forEach(([x, y, dx]) => { s += `<g class="ht-arrow" style="transform-origin:${x}px ${y}px"><path d="M${x} ${y} l${dx * 26} 0" stroke="#ec5a5f" stroke-width="5" stroke-linecap="round"/><path d="M${x + dx * 32} ${y} l${-dx * 10} -7 l0 14 z" fill="#ec5a5f"/></g>`; });
    s += `<g class="ht-cool"><rect x="186" y="164" width="90" height="30" rx="15" fill="#fff" stroke="${I}" stroke-width="2"/><text x="231" y="184" text-anchor="middle" font-family="Inter,system-ui" font-size="13" font-weight="800" fill="${I}">Cool: calm</text></g>`;
    s += `<g class="ht-hot"><rect x="176" y="164" width="110" height="30" rx="15" fill="#ec5a5f" stroke="${I}" stroke-width="2"/><text x="231" y="184" text-anchor="middle" font-family="Inter,system-ui" font-size="13" font-weight="800" fill="#fff">Hot: pressure ↑</text></g>`;
    s += `<text x="350" y="344" text-anchor="middle" font-family="Inter,system-ui" font-size="13" font-weight="700" fill="#56637c">Gas molecules inside the cylinder</text>`;
    return s;
  }

  Guided.start({
    id: "safety", title: "Gas Safety",
    hook: "Compressed gas cylinders can become missiles, and CO₂ can kill in an enclosed cellar. Both dangers are avoidable if you know what to watch for.",
    objectives: ["Explain how temperature affects cylinder pressure", "Store cylinders safely: cool and upright", "Recognize CO₂ exposure symptoms as levels rise"],
    hero: () => svg(null, storage("van", true), "A building floor plan with a cool storeroom, a warm back room with a radiator, a boiler room, and a delivery van parked outside in the sun with a spare CO2 cylinder inside."),
    learn: [
      { title: "Heat raises pressure",
        html: "<p>The pressure of a confined gas is directly related to its temperature: <strong>the hotter it gets, the higher the pressure</strong>.</p><p>So cylinders should <strong>never</strong> be stored somewhere hot, like inside a car or in a boiler room.</p>",
        art: () => svg([20, 14, 520, 344], heatStory(), "A thermometer on its stand beside a cut-away gas cylinder. As the thermometer rises from cool to hot, the gas molecules inside move faster, the cylinder's pressure gauge climbs into the red, and arrows push outward on the cylinder walls. Then it cools and calms again.") },
      { title: "The safety disc: keep cylinders upright",
        html: "<p>Each cylinder has a <strong>safety disc</strong> that ruptures and vents the cylinder before pressure can cause an explosion.</p><p>Always store cylinders <strong>upright</strong>. On its side, the disc can vent <strong>liquefied gas</strong>, which is hazardous.</p>",
        art: () => svg(null, slab([-80, -50, -10], [250, 210, 10]) + parts.tank([0, 0, 0]) + gasPuff([0, 0, 176]) + lbl([0, 0, 212], "Upright: vents gas", { bg: "#e8f6ef", fg: "#0f7b56", stroke: "#0f7b56" }) + badge([-40, 0, 120], true) + parts.tankSide([-30, 100, 0], { r: 22 }) + spray([126, 100, 22]) + badge([40, 100, 76], false) + lbl([20, 230, -10], "On its side: vents liquid", { bg: "#fdeceb", fg: "#c7333a", stroke: "#c7333a" }) + discTag(), "An upright cylinder venting gas from its safety disc, marked correct, and a cylinder lying on its side spraying liquid CO2, marked wrong.") },
      { title: "CO₂ is toxic at high levels",
        html: "<p>CO₂ is heavier than air, so it collects in low spaces like cellars. As it rises, so do the symptoms:</p><ul><li><strong>2–3%:</strong> shortness of breath</li><li><strong>5%:</strong> heavy breathing, sweating</li><li><strong>7.5%:</strong> headache, dizziness, visual distortion</li><li><strong>10%:</strong> nausea, loss of consciousness</li><li><strong>30%:</strong> coma, convulsions, death</li></ul>",
        art: () => {
          const el = svg(null, cellar(1, false), "A keg cellar with two CO2 cylinders, kegs and a worker. The view cycles through rising CO2 levels: at 2 to 3 percent the worker is short of breath; at 5 percent breathing is heavy and they sweat; at 7.5 percent they hold their head, dizzy; at 10 percent they kneel, nauseous; at 30 percent they collapse. A meter beside the cellar shows each level.");
          let lv = 1;
          const tick = setInterval(() => {
            if (!el.isConnected) { if (el._seen) clearInterval(tick); return; }
            el._seen = true; lv = lv >= 5 ? 1 : lv + 1;
            const vb = el.getAttribute("viewBox"); el.innerHTML = cellar(lv, false); el.setAttribute("viewBox", vb);
          }, 2600);
          return el;
        },
        aside: { type: "warn", html: "<b>Lake Nyos, 1986:</b> a volcanic lake released a CO₂ cloud that killed 1,700 people and 3,500 livestock. Brewery workers still die from CO₂ every year, and every death is avoidable." } }
    ],
    tryIt: [
      { title: "Store the spare cylinder",
        lede: "The spare cylinder just arrived in the delivery van. Drag it into a room. Tap it to tip it over or stand it up.",
        goals: [{ id: "safe", text: "Find a safe spot" }, { id: "heat", text: "See what heat does" }, { id: "side", text: "Lay it on its side" }],
        mount(el, ctx) {
          let at = "van", up = true, moved = false;
          const art = svg(null, storage(at, up, { live: true }), "Interactive floor plan. The spare CO2 cylinder can be dragged between the four areas.", { interactive: true });
          const { vis, msg } = Guided.UI.tryLayout(el, art);
          const hud = h("div", { class: "hud", html: gaugeSvg(ZONES.van.p) + "<span>Pressure<br>Danger</span>" }); vis.append(hud);
          say(msg, "warn", "Just delivered, in a hot van", "Drag the cylinder out of the van and into the room where it should be stored.");
          const centre = (k) => { const c = tankPos(k); return P([c[0], c[1], c[2]]); };
          function nearest(X, Y) { // screen (svg) point on the floor → world x,y → room containing it, else the closest room
            const wx = (X / 0.866 + 2 * Y) / 2, wy = (2 * Y - X / 0.866) / 2;
            let best = null, bd = Infinity;
            Object.keys(ZONES).forEach((k) => { const [ox, oy] = ZONES[k].o; const dx = Math.max(ox - wx, 0, wx - (ox + 166)), dy = Math.max(oy - wy, 0, wy - (oy + 136)); const d = Math.hypot(dx, dy) + (dx || dy ? 0 : -1e6 + Math.hypot(wx - ox - 83, wy - oy - 68)); if (d < bd) { bd = d; best = k; } });
            return best; }
          function render(focus) {
            const vb = art.getAttribute("viewBox"); art.innerHTML = storage(at, up, { hot: ZONES[at].p > 0.45, live: true }); if (vb) art.setAttribute("viewBox", vb);
            if (!moved) { const q = centre(at); art.insertAdjacentHTML("beforeend", `<g class="hs nofit drag-hint" aria-hidden="true" transform="translate(${f1(q[0])} ${f1(q[1] - 50)})"><circle class="hs-ring" r="30"/><circle class="hs-ring2" r="30"/><g class="hs-hint"><rect x="38" y="-13" width="86" height="26" rx="13"/><text x="47" y="4.5">Drag me</text></g></g>`); }
            if (focus) art.querySelector("#tank")?.focus();
          }
          function report() {
            const z = ZONES[at];
            hud.innerHTML = gaugeSvg(z.p) + `<span>Pressure<br>${z.p > 0.8 ? "Danger" : z.p > 0.45 ? "Rising" : "Normal"}</span>`;
            let kind = z.k, body = z.t;
            if (!up) { kind = "bad"; body += " <b>On its side,</b> the safety disc could vent liquefied gas. Always store cylinders upright."; }
            say(msg, kind, `${z.label} · ${up ? "upright" : "on its side"}`, body);
            if (at === "cool" && up) ctx.done("safe");
            if (moved && (at === "boiler" || at === "van")) ctx.done("heat");
            if (!up) ctx.done("side");
          }
          function place(k) { const changed = k !== at; at = k; moved = true; render(true); report(); ctx.say(`Cylinder ${changed ? "moved to" : "still in"} the ${ZONES[k].label.toLowerCase()}.`); }
          function flip() { up = !up; render(true); report(); ctx.say(up ? "Cylinder upright." : "Cylinder on its side."); }
          art.addEventListener("pointerdown", (e) => {
            const t = e.target.closest("#tank"); if (!t) return;
            e.preventDefault(); t.focus({ preventScroll: true });
            const m = art.getScreenCTM().inverse(), p0 = new DOMPoint(e.clientX, e.clientY).matrixTransform(m), tp = tankPos(at), base = P([tp[0], tp[1], 0]);
            let dragging = false, over = null;
            art.setPointerCapture(e.pointerId); art.classList.add("grabbing");
            const move = (ev) => {
              const p = new DOMPoint(ev.clientX, ev.clientY).matrixTransform(m), dx = p.x - p0.x, dy = p.y - p0.y;
              if (!dragging && Math.hypot(dx, dy) > 5) { dragging = true; art.querySelector(".drag-hint")?.remove(); art.append(art.querySelector("#tank")); art.querySelector("#tank").classList.add("lifted"); }
              if (!dragging) return;
              art.querySelector("#tank").setAttribute("transform", `translate(${f1(dx)} ${f1(dy)})`);
              const k = nearest(base[0] + dx, base[1] + dy);
              if (k !== over) { over = k; art.querySelectorAll(".zhl").forEach((g) => g.classList.toggle("on", g.dataset.z === k)); }
            };
            const end = (ev) => {
              art.removeEventListener("pointermove", move); art.removeEventListener("pointerup", end); art.removeEventListener("pointercancel", end); art.classList.remove("grabbing");
              if (!dragging) { flip(); return; }
              const p = new DOMPoint(ev.clientX, ev.clientY).matrixTransform(m);
              place(nearest(base[0] + p.x - p0.x, base[1] + p.y - p0.y));
            };
            art.addEventListener("pointermove", move); art.addEventListener("pointerup", end); art.addEventListener("pointercancel", end);
          });
          art.addEventListener("keydown", (e) => {
            if (!e.target.closest("#tank")) return;
            if (e.key === "Enter" || e.key === " ") { e.preventDefault(); flip(); return; }
            const d = { ArrowRight: [1, 0], ArrowLeft: [-1, 0], ArrowDown: [0, 1], ArrowUp: [0, -1] }[e.key]; if (!d) return;
            e.preventDefault(); const g = GRID[at], nx = Math.max(0, Math.min(1, g[0] + d[0])), ny = Math.max(0, Math.min(1, g[1] + d[1]));
            const k = Object.keys(GRID).find((q) => GRID[q][0] === nx && GRID[q][1] === ny); place(k);
          });
          render(false);
        } },
      { title: "A leak in the cellar",
        lede: "Tap the leaking valve to let CO₂ build up, and watch what happens to the worker. Then open the door.",
        goals: [{ id: "dizzy", text: "Reach the dizziness level" }, { id: "deadly", text: "Reach the deadly level" }, { id: "vent", text: "Ventilate the cellar" }],
        mount(el, ctx) {
          let lv = 0, door = false;
          const art = svg(null, cellar(5, false, { noPills: true }), "Interactive keg cellar. A worker stands beside two CO2 cylinders; a meter shows the CO2 level.", { interactive: true });
          const { msg } = Guided.UI.tryLayout(el, art);
          let first = true;
          function render() {
            const vb = art.getAttribute("viewBox");
            art.innerHTML = cellar(lv, door, { noPills: true });
            if (vb && !first) art.setAttribute("viewBox", vb);
            const v = P([22, 40, 116]), d = P([205, -1, 60]);
            art.insertAdjacentHTML("beforeend", hotspot("leak", v[0], v[1], "Leaking cylinder valve. Tap to let more CO2 leak.", { r: 15, hint: lv < 5 ? "Let it leak" : null, hx: -120 }) + hotspot("door", d[0], d[1], "Cellar door. Tap to open it and ventilate.", { r: 16, off: lv < 3 && !door, hint: lv >= 3 && !door ? "Open the door" : null }));
            if (lv >= 5) art.querySelector('.hs[data-hs="leak"]').classList.add("off");
            bindHotspots(art, {
              leak() { lv = Math.min(5, lv + 1); door = false; if (lv === 3) ctx.done("dizzy"); if (lv === 5) ctx.done("deadly"); ctx.say(`CO₂ now ${LEVELS[lv].v}. ${LEVELS[lv].sx}`); render(); art.querySelector('.hs:not(.off)')?.focus(); },
              door() { door = true; const was = lv; lv = 0; if (was >= 3) ctx.done("vent"); ctx.say("Door open. Fresh air is clearing the CO₂."); render(); }
            });
            const L = LEVELS[lv];
            say(msg, door ? "ok" : lv === 0 ? "info" : lv < 3 ? "warn" : "bad", door ? "Door open: fresh air is clearing the CO₂" : `${L.v} CO₂ · ${L.sev}`, door ? "In a real leak: leave, ventilate, and don't re-enter until it's safe." : L.sx);
            first = false;
          }
          // frame on the widest state first, then show normal air
          art.addEventListener("framed", () => { lv = 0; render(); }, { once: true });
          render();
        } }
    ],
    checks: [
      { q: "Why must compressed gas cylinders be stored upright?",
        art: () => svg(null, slab([-40, -40, -10], [250, 180, 10]) + parts.tankSide([20, 80, 0], { r: 22 }) + spray([176, 80, 22]), "A cylinder lying on its side, spraying liquid from its valve."),
        options: [
          { t: "On its side, a ruptured safety disc can vent liquefied gas", ok: true, fb: "Upright keeps the disc venting gas, not liquid." },
          { t: "Cylinders hold more gas upright", fb: "Position doesn't change the contents." },
          { t: "Upright cylinders stay colder", fb: "Temperature depends on location, not position." },
          { t: "The regulator only reads correctly upright", fb: "It's about the safety disc." }
        ] },
      { q: "Roughly what CO₂ level could they be exposed to?", scenario: "A coworker in the keg cellar suddenly has a headache, feels dizzy and says their vision seems off.",
        art: () => svg(null, cellar(3, false, { bare: true }), "A worker in a keg cellar holding their head, dizzy, while CO2 collects near the floor."),
        options: [
          { t: "About 7.5%, so get them to fresh air now", ok: true, fb: "Headache, dizziness and visual distortion match about 7.5%." },
          { t: "About 2–3%, nothing to worry about", fb: "2–3% causes shortness of breath. These symptoms point higher." },
          { t: "Normal air, so it's probably not CO₂", fb: "In a keg cellar, treat these as possible CO₂ exposure." },
          { t: "About 30%", fb: "30% causes coma and death. These match about 7.5%." }
        ] },
      { q: "Which storage choice is safe?",
        art: () => svg(null, storage(null, true), "The storage floor plan: a cool storeroom, a warm back room, a boiler room and a delivery van in the sun."),
        options: [
          { t: "Upright, in a cool storeroom", ok: true, fb: "Cool and upright is the rule." },
          { t: "Upright, next to the boiler", fb: "Upright is right, but heat raises pressure." },
          { t: "On its side, in a cool room", fb: "Cool is right, but on its side the disc could vent liquid." },
          { t: "In the delivery van until needed", fb: "Vehicles get very hot. Never store cylinders there." }
        ] }
    ],
    takeaways: [
      "<strong>Heat raises pressure</strong> in a cylinder. Never store one in a hot vehicle or a boiler room.",
      "The <strong>safety disc</strong> vents over-pressure. Store cylinders <strong>upright</strong> so it can't vent liquid.",
      "CO₂ collects low. <strong>Headache and dizziness (≈7.5%)</strong> mean get to fresh air now. 30% can kill."
    ]
  });
})();
