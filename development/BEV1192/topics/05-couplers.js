(function () {
  const { cyl, box, tube, parts, label, hotspot, callout, P, slab, svg, bindHotspots, setHot, zoomTo, home, tween, f1 } = ISO;
  const { h, say } = Guided.UI;
  const lbl = (pt, t, opt) => { const q = P(pt); return label(q[0], q[1], t, opt); };
  const K = [160, 40, 0], C = [160, 40, 148];
  const GAS = [[0, 62, 172], [6, 96, 150], [70, 130, 140], [140, 104, 164], [160, 86, 163], [160, 72, 163]];
  const BEER = [[160, 40, 197], [160, 40, 214], [230, 40, 218], [300, 40, 190], [330, 40, 150]];
  function loupe(cx, cy, inner) { return `<g aria-hidden="true"><circle cx="${cx}" cy="${cy}" r="52" fill="#fff" stroke="#ff7a2e" stroke-width="4"/><clipPath id="lp${cx | 0}"><circle cx="${cx}" cy="${cy}" r="48"/></clipPath><g clip-path="url(#lp${cx | 0})">${inner}</g><circle cx="${cx + 38}" cy="${cy - 38}" r="13" fill="#ff7a2e" stroke="#0b3b7a" stroke-width="2"/><circle cx="${cx + 36}" cy="${cy - 40}" r="5" fill="none" stroke="#fff" stroke-width="2.2"/><line x1="${cx + 40}" y1="${cy - 36}" x2="${cx + 44}" y2="${cy - 32}" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/></g>`; }
  const chromeLoupe = (cx, cy) => loupe(cx, cy, `<rect x="${cx - 60}" y="${cy - 60}" width="120" height="120" fill="#e8f1fc"/><path d="M${cx - 60} ${cy - 20} L${cx + 60} ${cy - 44}" stroke="#fff" stroke-width="10" opacity=".8"/><path d="M${cx - 26} ${cy - 10} q22 -18 46 -2 q18 14 6 34 q-14 18 -38 10 q-24 -10 -14 -42z" fill="#d7a93f" stroke="#8a5300" stroke-width="2.5"/>${[[-10, 4, 6], [10, 10, 5], [2, 22, 4], [16, -4, 3.5]].map(([x, y, r]) => `<circle cx="${cx + x}" cy="${cy + y}" r="${r}" fill="#8a5300"/>`).join("")}<circle cx="${cx - 9}" cy="${cy + 3}" r="2" fill="#2a9a6c"/><circle cx="${cx + 11}" cy="${cy + 9}" r="2" fill="#2a9a6c"/>`);

  const I = "#0b3b7a", T = (x, y, t, o = {}) => `<text x="${x}" y="${y}" text-anchor="${o.a || "middle"}" font-family="Inter,system-ui" font-size="${o.fs || 13}" font-weight="${o.w || 700}" fill="${o.c || I}">${t}</text>`;
  // side view of a coupler on a keg, with where the Thomas valve and the beer washer sit, plus enlarged details
  function partsDetail(opt = {}) {
    let s = `<defs><linearGradient id="stl" x1="0" x2="1"><stop offset="0" stop-color="#f7faff"/><stop offset=".45" stop-color="#dbe7f7"/><stop offset="1" stop-color="#b9cfeb"/></linearGradient>
      <linearGradient id="rub" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#5c6679"/><stop offset="1" stop-color="#272e3b"/></linearGradient></defs>`;
    // --- centre: coupler on keg (side view) ---
    s += `<path d="M232 346 Q232 326 252 324 L388 324 Q408 326 408 346" fill="#e8f1fc" stroke="${I}" stroke-width="2.4"/>`; // keg top dome
    s += `<rect x="292" y="300" width="56" height="26" rx="4" fill="url(#stl)" stroke="${I}" stroke-width="2.2"/>`; // keg valve
    s += `<rect x="284" y="210" width="72" height="92" rx="10" fill="url(#stl)" stroke="${I}" stroke-width="2.6"/>`; // body
    s += `<rect x="278" y="288" width="84" height="16" rx="6" fill="url(#stl)" stroke="${I}" stroke-width="2.2"/>`; // collar
    s += `<path d="M356 236 L410 236 Q424 236 428 250 L436 276" fill="none" stroke="${I}" stroke-width="12" stroke-linecap="round"/><path d="M356 236 L410 236 Q424 236 428 250 L436 276" fill="none" stroke="#dbe7f7" stroke-width="7" stroke-linecap="round"/><path d="M431 262 L440 292" stroke="${I}" stroke-width="15" stroke-linecap="round"/><path d="M431 262 L440 292" stroke="#3b4660" stroke-width="10" stroke-linecap="round"/>`; // lever + grip
    s += `<circle cx="348" cy="270" r="6" fill="#ec5a5f" stroke="${I}" stroke-width="1.8"/>`; // relief valve
    // gas inlet arm with check valve (left)
    s += `<rect x="238" y="248" width="48" height="16" rx="3" fill="url(#stl)" stroke="${I}" stroke-width="2.2"/>`;
    s += `<path id="tv-loc" d="M232 244 h18 l5 6 v12 l-5 6 h-18 l-5 -6 v-12z" fill="#ffab70" stroke="${I}" stroke-width="2.2"/>`; // hex body
    s += `<path d="M227 256 L196 256" stroke="${I}" stroke-width="12" stroke-linecap="round"/><path d="M227 256 L196 256" stroke="#eef6ff" stroke-width="7" stroke-linecap="round"/>`; // barb + gas line
    s += `<path d="M196 256 C 176 256 170 300 146 304" fill="none" stroke="${I}" stroke-width="10.4" stroke-linecap="round"/><path d="M196 256 C 176 256 170 300 146 304" fill="none" stroke="#eef6ff" stroke-width="7" stroke-linecap="round"/>`;
    // beer outlet on top: washer, nut, tailpiece, beer line
    s += `<rect x="304" y="198" width="32" height="12" rx="3" fill="url(#stl)" stroke="${I}" stroke-width="2"/>`;
    s += `<rect id="bw-loc" x="300" y="190" width="40" height="8" rx="4" fill="url(#rub)" stroke="${I}" stroke-width="1.8"/>`;
    s += `<path d="M298 168 h44 v22 h-44z" fill="url(#stl)" stroke="${I}" stroke-width="2.2"/><path d="M310 168 v22 M330 168 v22" stroke="${I}" stroke-width="1.2" opacity=".5"/>`; // hex nut
    s += `<rect x="312" y="132" width="16" height="38" rx="3" fill="url(#stl)" stroke="${I}" stroke-width="2"/>`; // tailpiece
    s += `<path d="M320 132 C 320 100 340 92 368 92" fill="none" stroke="${I}" stroke-width="10.4" stroke-linecap="round"/><path d="M320 132 C 320 100 340 92 368 92" fill="none" stroke="#ffcb52" stroke-width="7" stroke-linecap="round"/>`;
    s += T(320, 372, "Coupler on a keg", { fs: 12.5, c: "#56637c" });
    s += T(146, 326, "Gas in", { fs: 12, c: "#2f74d0" }) + T(380, 84, "Beer out", { fs: 12, c: "#b5852a", a: "start" });
    // --- left detail: Thomas (check) valve, cut away ---
    s += `<path d="M232 256 C 200 230 190 210 172 200" fill="none" stroke="${I}" stroke-width="1.6" stroke-dasharray="4 4"/><circle cx="232" cy="256" r="4" fill="${I}"/>`;
    s += `<g class="tv"><rect x="20" y="118" width="200" height="150" rx="18" fill="#fff" stroke="#ff7a2e" stroke-width="2.6"/>`;
    s += T(120, 146, "Thomas (check) valve", { fs: 14, w: 800 }) + T(120, 164, "on the gas inlet", { fs: 12, c: "#56637c", w: 600 });
    s += `<path d="M40 210 h24 M176 210 h24" stroke="${I}" stroke-width="16" stroke-linecap="round"/><path d="M40 210 h24 M176 210 h24" stroke="#eef6ff" stroke-width="10" stroke-linecap="round"/>`;
    s += `<path d="M64 186 h112 v48 h-112z" fill="#ffd7b8" stroke="${I}" stroke-width="2.4"/><path d="M70 198 h100 v24 h-100z" fill="#fff" stroke="${I}" stroke-width="1.6"/>`; // housing + bore (cut)
    s += `<path d="M92 198 v6 l6 6 l-6 6 v6" fill="none" stroke="${I}" stroke-width="2.6" stroke-linejoin="round"/>`; // seat
    s += `<g class="tv-ball"><circle cx="106" cy="210" r="9" fill="#56637c" stroke="${I}" stroke-width="2"/><circle cx="103" cy="207" r="3" fill="#fff" opacity=".7"/>`;
    s += `<path class="tv-spring" d="M115 210 l5 -8 l6 16 l6 -16 l6 16 l6 -16 l6 16 l6 -16 l4 8" fill="none" stroke="#7d8aa3" stroke-width="2.2" stroke-linejoin="round"/></g>`;
    s += `<g class="tv-gas"><path d="M34 248 h70" stroke="#18a0fb" stroke-width="4" stroke-linecap="round"/><path d="M110 248 l-10 -6 v12z" fill="#18a0fb"/></g>` + T(72, 262, "gas passes ✓", { fs: 11.5, c: "#0f7b56" });
    s += `<g class="tv-beer"><path d="M206 176 h-58" stroke="#f6a724" stroke-width="4" stroke-linecap="round"/><path d="M142 176 l10 -6 v12z" fill="#f6a724"/><g transform="translate(128 176)"><circle r="8" fill="#ec5a5f"/><path d="M-3.5 -3.5 l7 7 M3.5 -3.5 l-7 7" stroke="#fff" stroke-width="2.2" stroke-linecap="round"/></g></g>` + T(176, 262, "beer back ✕", { fs: 11.5, c: "#c7333a" });
    s += `</g>`;
    // --- right detail: beer washer, exploded stack ---
    s += `<path d="M340 194 C 400 196 440 180 480 176" fill="none" stroke="${I}" stroke-width="1.6" stroke-dasharray="4 4"/><circle cx="340" cy="194" r="4" fill="${I}"/>`;
    s += `<g class="bw" transform="translate(50 0)"><rect x="430" y="96" width="206" height="214" rx="18" fill="#fff" stroke="#2f74d0" stroke-width="2.6"/>`;
    s += T(528, 124, "Beer washer", { fs: 14, w: 800 }) + T(528, 142, "a rubber gasket", { fs: 12, c: "#56637c", w: 600 });
    s += `<path d="M528 156 V296" stroke="#9cc3f0" stroke-width="1.6" stroke-dasharray="4 4"/>`;
    s += `<rect x="520" y="156" width="16" height="34" rx="3" fill="url(#stl)" stroke="${I}" stroke-width="2"/><path d="M516 160 h24 M516 170 h24 M516 180 h24" stroke="${I}" stroke-width="1.4"/>` + T(548, 176, "tailpiece", { fs: 11.5, a: "start", c: "#56637c" });
    s += `<path d="M506 198 h44 v18 h-44z" fill="url(#stl)" stroke="${I}" stroke-width="2"/>` + T(558, 212, "nut", { fs: 11.5, a: "start", c: "#56637c" });
    s += `<g class="bw-ring"><ellipse cx="528" cy="242" rx="34" ry="11" fill="#272e3b" stroke="${I}" stroke-width="2"/><ellipse cx="528" cy="236" rx="34" ry="11" fill="url(#rub)" stroke="${I}" stroke-width="2"/><ellipse cx="528" cy="236" rx="15" ry="5" fill="#fff" stroke="${I}" stroke-width="1.8"/><path d="M500 232 q12 -6 26 -6" stroke="#8a94a6" stroke-width="2" fill="none" stroke-linecap="round"/></g>`;
    s += `<path d="M565 238 h8" stroke="#2f74d0" stroke-width="2"/>` + T(577, 242, "washer", { fs: 12, a: "start", c: "#2f74d0", w: 800 });
    s += `<path d="M506 266 h44 v24 h-44z" fill="url(#stl)" stroke="${I}" stroke-width="2"/><path d="M506 272 h44 M506 278 h44 M506 284 h44" stroke="${I}" stroke-width="1.2" opacity=".6"/>` + T(558, 284, "coupler", { fs: 11.5, a: "start", c: "#56637c" });
    s += `</g>`;
    if (!opt.noNeq) s += `<g><rect x="250" y="20" width="140" height="34" rx="17" fill="#fdeceb" stroke="#c7333a" stroke-width="2"/>${T(320, 42, "Not interchangeable", { fs: 13, c: "#c7333a", w: 800 })}</g>`;
    return s;
  }
  const corrosion = ISO.corrosion;

  function scene(S, lever, cvOff, opaque, noLabels) {
    const gas = tube(GAS, 4.2, { fill: "#eef6ff", opacity: 0.9 }), beer = tube(BEER, 4.2, { fill: "#eef6ff", opacity: 0.9 });
    const back = ISO.smoothD(GAS.slice().reverse().map(P));
    let s = slab([-46, -30, -12], [396, 130, 12]);
    s += parts.tank([0, 40, 0]) + parts.regulator([0, 40, 168], { values: [S.gas ? 0.72 : 0.05, 0.4] });
    s += gas.svg + `<path id="f-gas" d="${gas.d}" class="flow-gas${S.engaged && S.gas ? " run" : ""}" opacity="${S.gas ? 1 : 0}"/>`;
    s += `<path id="backfill" d="${back}" pathLength="100" fill="none" stroke="#f6a724" stroke-width="5.5" stroke-linecap="round" stroke-dasharray="100 100" stroke-dashoffset="100" style="transition:stroke-dashoffset 2.6s cubic-bezier(.2,.7,.2,1)"/>`;
    s += parts.keg(K, { ghost: !opaque, fill: 0.7 });
    if (!opaque) s += `<path d="M${P([160, 40, 14]).map(f1).join(" ")} L${P([160, 40, 146]).map(f1).join(" ")}" class="flow-beer${S.engaged && S.gas ? " run" : ""}" opacity="${S.engaged && S.gas ? 1 : 0}"/>`;
    s += `<g id="coupler">${parts.coupler(C, { lever, check: false })}</g>`;
    s += `<g id="cv" style="transition:transform .7s, opacity .7s;${cvOff ? "opacity:0;transform:translate(-40px,30px)" : ""}">${cyl([160, 62, 163], [0, 1, 0], 7.5, 9, "orange", { n: 6, sw: 1.8 })}</g>`;
    s += beer.svg + (S.engaged ? `<path d="${beer.d}" stroke="#f6a724" stroke-width="5" fill="none" stroke-linecap="round" opacity=".85"/>` : "") + `<path d="${beer.d}" class="flow-beer${S.engaged && S.gas ? " run" : ""}" opacity="${S.engaged && S.gas ? 1 : 0}"/>`;
    if (!noLabels) s += lbl([0, 40, -28], "CO₂", { fs: 11 }) + lbl([160, 40, -28], "Keg", { fs: 11 }) + lbl([330, 40, 128], "To faucet", { fs: 11 });
    s += `<g id="seat" opacity="0">${lbl([160, 92, 196], "Check ball seated ✓", { bg: "#e7f6ef", fg: "#0f7b56", stroke: "#2a9a6c", fs: 11 })}</g>`;
    return s;
  }

  Guided.start({
    id: "couplers", title: "Couplers",
    hook: "The coupler is where the keg meets the system. Get the wrong one, or reassemble it with the wrong part, and beer ends up where it doesn't belong.",
    objectives: ["Describe the three jobs of a coupler", "Explain why the coupler must match the keg", "Explain what the check (Thomas) valve prevents", "Explain why stainless steel is preferred"],
    hero: () => svg(null, scene({ engaged: true, gas: true, check: true }, 0.12, false, true), "A gas cylinder feeding a coupler on a keg, with a beer line running to the faucet."),
    learn: [
      { title: "What a coupler does",
        html: "<p>The coupler is the <strong>connection between the keg and the draught system</strong>. It has three jobs:</p><p><strong>1</strong> Pushes <strong>gas into</strong> the keg<br><strong>2</strong> Dispenses <strong>beer out</strong> of the keg<br><strong>3</strong> Has a <strong>pressure relief valve</strong> that bursts at 50 psi</p><p>Hover over a number on the picture to see its label. Click a number to keep its label on.</p>",
        art: () => {
          let s = slab([-60, -60, -10], [120, 120, 10]) + cyl([0, 0, 0], [0, 0, 1], 40, 16, "steel", { hole: 30, holeFill: "#dfeafa" }) + cyl([0, 0, 0], [0, 0, 1], 9, 20, "steel");
          s += parts.coupler([0, 0, 20], { lever: 0.12 }) + cyl([-8, 8, 47], [0, 0, 1], 3, 6, "red", { sw: 1.6 });
          s += tube([[0, 31, 35], [0, 60, 35], [0, 90, 20]], 3.6, { fill: "#eef6ff" }).svg + tube([[0, 0, 68], [0, 0, 86], [40, 0, 96]], 3.6, { fill: "#f6a724" }).svg;
          s += ISO.hsCallout("j1", [0, 74, 28], [-64, 66], 1, "1: Gas goes in here", { tip: "Gas in", k: 0.8 }) + ISO.hsCallout("j2", [0, 0, 80], [60, -70], 2, "2: Beer comes out here", { tip: "Beer out", k: 0.8 }) + ISO.hsCallout("j3", [-8, 8, 52], [-80, -50], 3, "3: Pressure relief valve, bursts at 50 psi", { tip: "Pressure relief valve (50 psi)", k: 0.8 });
          return svg(null, s, "A coupler on a keg valve with three numbered markers: 1 the gas line entering from the side, 2 the beer line leaving from the top, 3 a small pressure relief valve. Hover over a number to see its name; click a number to keep its label on.", { interactive: true });
        } },
      { title: "Match the coupler to the keg",
        html: "<p>Some brands still use couplers that differ from the U.S. standard.</p><p>The U.S. standard is the <strong>Sankey D</strong>. It looks almost identical to the <strong>Sankey S</strong>, but the S is <strong>not compatible</strong> with Sankey D kegs.</p>",
        art: () => {
          let s = slab([-60, -60, -10], [260, 120, 10]);
          [0, 140].forEach((x, i) => { s += cyl([x, 0, 0], [0, 0, 1], 9, 14, "steel") + parts.coupler([x, 0, 14], { lever: -0.6 }); s += lbl([x, 0, -26], i ? "Sankey S" : "Sankey D · U.S. standard", { fs: 11, bg: i ? "#fdeceb" : "#fff", fg: i ? "#c7333a" : "#0b3b7a", stroke: i ? "#c7333a" : "#0b3b7a" }); });
          const q = P([70, 0, 40]); s += `<text x="${q[0]}" y="${q[1] + 10}" text-anchor="middle" font-family="Inter" font-size="34" font-weight="800" fill="#ec5a5f" stroke="#fff" stroke-width="5" paint-order="stroke">≠</text>`;
          return svg(null, s, "Two nearly identical couplers, Sankey D and Sankey S, with a not-equal sign between them.");
        },
        aside: { html: "<b>On the job:</b> always verify the coupler required for the brand before you tap." } },
      { title: "Thomas valve vs. beer washer",
        html: "<p>The <strong>Thomas valve</strong> is a check valve. It <strong>prevents beer from traveling back into the CO₂ system</strong>.</p><p>The <strong>beer washer</strong> is a gasket between the probe and the beer dispensing tailpiece.</p><p>They are <strong>not interchangeable</strong>.</p>",
        art: () => svg([10, 10, 694, 372], partsDetail(), "A coupler on a keg, seen from the side. On its gas inlet sits the Thomas valve, enlarged on the left as a cut-away: a ball held against a seat by a spring, so gas can pass toward the keg but beer pushing back is blocked. On top, between the coupler and the beer tailpiece, sits the beer washer, enlarged on the right as a black rubber ring in an exploded stack: tailpiece, nut, washer, coupler. A tag says they are not interchangeable.") },
      { title: "Stainless steel only",
        html: "<p>Stainless steel is recommended for couplers and every metal part that touches beer.</p><p>Older couplers were <strong>chrome-plated brass</strong>. The smallest chip lets the brass corrode, which causes a <strong>metallic off-flavor</strong>, and the pits give <strong>microorganisms</strong> places to hide.</p>",
        art: () => svg([20, 14, 610, 360], corrosion(), "Two cross-sections. Left, stainless steel: solid metal all the way through, with beer droplets on top and a green check mark. Right, chrome-plated brass: a thin chrome coat has a chip; underneath it a corrosion pit grows into the brass, giving a metallic off-flavor, and microbes hide inside the pit.") }
    ],
    tryIt: [{
      title: "Why the check valve matters",
      lede: "Predict, then watch.",
      goals: [{ id: "tap", text: "Tap the keg" }, { id: "protect", text: "Lose gas, valve in" }, { id: "back", text: "Lose gas, valve out" }],
      mount(el, ctx) {
        const S = { engaged: false, gas: true, check: true };
        let lever = -1, phase = 0, predicted = null, cvOff = false;
        const art = svg(null, "", "Interactive coupler on a keg", { interactive: true, pad: 30 });
        const { msg, side } = Guided.UI.tryLayout(el, art, { legend: `<span><i style="background:#18a0fb"></i>Gas</span><span><i style="background:#f6a724"></i>Beer</span>` });
        const coach = h("div", { class: "coach" }); side.prepend(coach);
        const leverPt = () => P([216, 40, lever > 0 ? 160 : 205]);
        function render() {
          const vb = art.getAttribute("viewBox");
          art.innerHTML = scene(S, lever, cvOff, false, phase > 0);
          const L = P([212, 40, 166]), V = P([0, 40, 185]), CV = P([160, 66, 163]);
          art.insertAdjacentHTML("beforeend",
            hotspot("lever", L[0], L[1], "Coupler lever. Pull down to tap the keg.", { r: 15, off: !(phase === 0 && !S.engaged), hint: "Pull the lever" }) +
            hotspot("valve", V[0], V[1] - 6, "Cylinder valve. Close it to cut the gas.", { r: 14, off: !((phase === 1 || (phase === 2 && !S.check)) && predicted != null && S.gas), hint: "Close the cylinder", hx: -150 }) +
            hotspot("check", CV[0], CV[1], "Check valve. Remove it.", { r: 13, off: !(phase === 2 && predicted != null && S.check), hint: "Remove the check valve" }));
          if (vb && art._home) art.setAttribute("viewBox", vb);
          bindHotspots(art, handlers);
          if (!S.engaged || S.gas || S.check) { const b = art.querySelector("#backfill"); if (b) b.style.strokeDashoffset = 100; }
        }
        const handlers = {
          lever() {
            tween(650, (e) => { lever = -1 + e * 1.12; art.querySelector("#coupler").innerHTML = parts.coupler(C, { lever, check: false }); }, () => {
              S.engaged = true; render(); ctx.done("tap");
              say(msg, "ok", "Tapped and pouring", "The probe opens the keg valve. Gas fills the headspace and pushes beer up the down tube and out the beer line.");
              ctx.primary({ label: "Next situation", fn: () => { phase = 1; predicted = null; ctx.primary(null); renderCoach(); render(); } });
            });
          },
          valve() {
            S.gas = false; render();
            if (phase === 1) {
              art.querySelector("#seat").setAttribute("opacity", 1);
              ctx.done("protect"); markPrediction();
              say(msg, "ok", "The check ball seats", "Keg pressure tries to push back up the gas line, but the check (Thomas) valve blocks it. The gas system stays clean.");
              ctx.primary({ label: "Next situation", fn: () => { phase = 2; predicted = null; Object.assign(S, { gas: true, check: true }); cvOff = false; ctx.primary(null); renderCoach(); render(); } });
            } else {
              requestAnimationFrame(() => requestAnimationFrame(() => { const b = art.querySelector("#backfill"); if (b) b.style.strokeDashoffset = 28; }));
              ctx.done("back"); markPrediction();
              say(msg, "bad", "Backflow", "Beer pushes back up the gas line toward the regulator. A clear gas line lets you spot it. Reinstall the correct part, because the beer washer isn't a substitute.");
              ctx.primary(null);
            }
          },
          check() { cvOff = true; S.check = false; render(); say(msg, "warn", "Check valve removed", "Now close the cylinder valve to simulate the gas running out."); }
        };
        const P2 = [null,
          { t: "The CO₂ runs out", b: "Mid-shift, the cylinder runs empty. The check valve is installed.", q: "What happens in the gas line?", o: [["Beer backs up into the gas line", false], ["Nothing. The check valve blocks it.", true], ["The keg loses all its pressure instantly", false]] },
          { t: "A missing part", b: "A tech reassembles the coupler without its check valve. Later, the gas runs out again.", q: "What happens this time?", o: [["Beer pushes back up the gas line", true], ["Nothing. The coupler still blocks it.", false], ["The beer pours faster", false]] }];
        let labs = [];
        function markPrediction() { const P = P2[phase]; labs.forEach((l, i) => { l.classList.add("locked"); l.querySelector("input").disabled = true; if (P.o[i][1]) l.classList.add("right"); else if (i === predicted) l.classList.add("wrong"); }); }
        function renderCoach() {
          coach.innerHTML = ""; labs = [];
          if (phase === 0) { say(msg, "info", "Situation 1 of 3: Tap the keg.", "The gas is on. Pull the coupler lever down on the drawing."); return; }
          const P = P2[phase];
          const fs = h("fieldset", { class: "choices" }, h("legend", { style: "font-size:14.5px;margin-bottom:6px" }, P.q));
          P.o.forEach(([t], i) => { const inp = h("input", { type: "radio", name: "pr" + phase, value: String(i) }); const l = h("label", { class: "choice", style: "font-size:13.5px;padding:8px 10px;min-height:40px" }, inp, h("span", { class: "mark", "aria-hidden": "true" }), h("span", {}, t)); inp.addEventListener("change", () => { if (predicted == null) { predicted = i; labs.forEach((q) => { q.classList.add("locked"); q.querySelector("input").disabled = true; }); render(); say(msg, "info", `Situation ${phase + 1} of 3: ${P.t}.`, phase === 1 ? "Prediction in. Now close the cylinder valve on the drawing to find out." : "Prediction in. Now remove the check valve on the drawing, then close the cylinder valve."); } }); labs.push(l); fs.append(l); });
          coach.append(fs);
          say(msg, "info", `Situation ${phase + 1} of 3: ${P.t}.`, P.b);
        }
        art.innerHTML = scene(S, lever, false); renderCoach();
        requestAnimationFrame(() => { render(); });
      }
    }],
    checks: [
      { q: "What does the Thomas valve (check valve) in a coupler do?",
        art: () => svg(null, slab([-50, -50, -10], [100, 100, 10]) + cyl([0, 0, 0], [0, 0, 1], 9, 14, "steel") + parts.coupler([0, 0, 14], { lever: 0.12 }), "A coupler with its orange check valve on the gas inlet."),
        options: [
          { t: "Prevents beer from traveling back into the CO₂ system", ok: true, fb: "It's a one-way valve that protects the gas system." },
          { t: "Seals between the probe and the beer tailpiece", fb: "That's the beer washer." },
          { t: "Bursts to relieve pressure above 50 psi", fb: "That's the pressure relief valve." },
          { t: "Sets the dispensing pressure", fb: "Regulators set pressure." }
        ] },
      { q: "Is this a good fix?", scenario: "A bartender loses the beer washer while cleaning and swaps in a spare Thomas valve because “they're about the same size.”",
        art: () => svg([10, 80, 694, 300], partsDetail({ noNeq: true }), "A coupler with its Thomas valve on the gas inlet and its beer washer between the coupler and the beer tailpiece, each shown enlarged."),
        options: [
          { t: "No. They are not interchangeable.", ok: true, fb: "Each part does a different job. Use the correct part." },
          { t: "Yes, any small part that fits works", fb: "These parts do different jobs." },
          { t: "Yes, if the coupler is stainless", fb: "Material isn't the issue." },
          { t: "Only on a Sankey S", fb: "Coupler type doesn't change this." }
        ] },
      { q: "Why is stainless steel preferred over chrome-plated brass?",
        art: () => svg([20, 14, 610, 360], corrosion(), "Cross-sections of solid stainless steel and of chipped chrome-plated brass with a corrosion pit and microbes."),
        options: [
          { t: "Chipped chrome exposes brass that corrodes, tastes metallic and harbors microorganisms", ok: true, fb: "The chrome barrier only works while it's perfect." },
          { t: "Stainless steel is lighter", fb: "It's about corrosion, flavor and sanitation." },
          { t: "Chrome is too shiny to clean", fb: "The issue is exposed brass." },
          { t: "Brass doesn't fit Sankey D kegs", fb: "Fit isn't the issue." }
        ] }
    ],
    takeaways: [
      "A coupler pushes <strong>gas in</strong>, lets <strong>beer out</strong>, and has a <strong>relief valve</strong> that bursts at 50 psi.",
      "<strong>Sankey D</strong> is the U.S. standard. Sankey S looks alike but isn't D-compatible, so verify per brand.",
      "The <strong>Thomas (check) valve</strong> stops beer from backing into the gas system. The beer washer is not a substitute.",
      "Use <strong>stainless steel</strong>. Chipped chrome-plated brass corrodes and harbors microorganisms."
    ]
  });
})();
