(function () {
  const { cyl, box, tube, parts, label, hotspot, P, slab, grid, svg, bindHotspots, setHot, zoomTo, home, f1 } = ISO;
  const { h, say } = Guided.UI;

  // ---------- shared system scene ----------
  const GAS_PTS = [[0, 62, 172], [4, 92, 150], [55, 132, 118], [138, 132, 146], [170, 112, 163], [170, 96, 163]];
  const BEER_PTS = [[170, 60, 197], [170, 60, 216], [232, 60, 218], [292, 60, 158], [304, 60, 150]];
  function shutoff(open) {
    const xf = ISO.rotX([0, 58, 172], open ? 0 : Math.PI / 2);
    return cyl([0, 50, 172], [0, 1, 0], 4, 12, "steel", { sw: 1.6 }) + box([-2.5, 56, 172], [5, 4, 16], "orange", { xf, sw: 1.6 });
  }
  function system(o = {}) {
    const gas = tube(GAS_PTS, 4.2, { fill: "#eef6ff", opacity: 0.9 }), beer = tube(BEER_PTS, 4.2, { fill: "#eef6ff", opacity: 0.9 });
    return `${grid(170, 60, 7, 40, 0.4)}
      ${slab([-50, -60, -12], [480, 250, 12])}
      ${parts.tank([0, 40, 0])}${parts.regulator([0, 40, 168], { values: [0.72, o.gas ? 0.45 : 0.45] })}
      <g id="reg-valve">${shutoff(!!o.gas)}</g>
      ${gas.svg}<path id="f-gas" d="${gas.d}" class="flow-gas" opacity="${o.gas ? 1 : 0}"/>
      ${parts.keg([170, 60, 0], { ghost: !o.opaque, fill: 0.72 })}
      <path id="f-tube" d="M${P([170, 60, 14]).map(f1).join(" ")} L${P([170, 60, 140]).map(f1).join(" ")}" class="flow-beer" opacity="0"/>
      ${parts.coupler([170, 60, 148], { lever: 0.12 })}
      ${beer.svg}<path d="${beer.d}" stroke="#f6a724" stroke-width="5" fill="none" stroke-linecap="round" opacity=".85"/>
      <path id="f-beer" d="${beer.d}" class="flow-beer" opacity="0"/>
      ${box([300, -50, 0], [16, 210, 200], "steel")}
      ${box([316, -50, 0], [110, 210, 60], "blue")}
      <g id="glass">${parts.glass([360, 60, 60], { fill: o.fill || 0 })}</g>
      <line id="stream" x1="${f1(P([360, 60, 126])[0])}" y1="${f1(P([360, 60, 126])[1])}" x2="${f1(P([360, 60, 64])[0])}" y2="${f1(P([360, 60, 64])[1])}" stroke="#f6a724" stroke-width="5" stroke-dasharray="7 4" opacity="0" class="run2"/>
      <g id="faucet">${parts.faucet([316, 60, 150], { handle: 0 })}</g>`;
  }
  const lbl = (pt, t, opt) => { const q = P(pt); return label(q[0], q[1], t, opt); };
  // side-view story: one pint, before and after oxygen
  function oxStory() {
    const I = "#0b3b7a";
    const glass = `<path d="M150 92 L250 92 L238 300 Q200 310 162 300 Z" fill="#f4f9ff" stroke="${I}" stroke-width="3" stroke-linejoin="round"/>`;
    const beerD = "M155 132 L245 132 L238 296 Q200 305 162 296 Z";
    let s = `<defs><clipPath id="gclip"><path d="M150 92 L250 92 L238 300 Q200 310 162 300 Z"/></clipPath></defs>`;
    s += `<rect x="20" y="318" width="520" height="12" rx="6" fill="#d9e9fc" stroke="${I}" stroke-width="2"/>`;
    s += glass + `<g clip-path="url(#gclip)"><path class="ox-beer" d="${beerD}" stroke="none"/>`;
    // rising carbonation (fresh only)
    [[178, 0], [200, .6], [222, 1.2], [190, 1.8], [212, 2.4]].forEach(([x, d]) => { s += `<circle class="ox-fizz" cx="${x}" cy="290" r="2.6" fill="#fff" style="animation-delay:${d}s"/>`; });
    s += `<rect class="ox-haze" x="150" y="132" width="100" height="175" fill="#7a5a2c"/>`;
    s += `</g><clipPath id="hclip"><path d="M151 92 L249 92 L238 300 Q200 310 162 300 Z M151 30 H249 V93 H151 Z"/></clipPath>`;
    s += `<g clip-path="url(#hclip)"><path class="ox-head" d="M146 136 Q146 104 168 106 Q176 88 196 96 Q212 84 228 98 Q254 96 254 136 Z" fill="#fffdf6" stroke="${I}" stroke-width="2.6" stroke-linejoin="round"/></g>`;
    s += `<path d="M163 110 L170 290" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".7"/>`;
    s += glass.replace('fill="#f4f9ff"', 'fill="none"');
    // oxygen bubbles drifting in
    [[0, 150], [.35, 186], [.7, 222]].forEach(([d, y]) => { s += `<g class="ox-o2" style="animation-delay:${d}s"><g transform="translate(70 ${y})"><circle r="15" fill="#ec5a5f" stroke="${I}" stroke-width="2"/><text y="5" text-anchor="middle" font-family="Inter,system-ui" font-size="13" font-weight="800" fill="#fff">O₂</text></g></g>`; });
    // status pill swaps
    s += `<g class="ox-st1"><rect x="150" y="40" width="100" height="30" rx="15" fill="#fff" stroke="${I}" stroke-width="2"/><text x="200" y="60" text-anchor="middle" font-family="Inter,system-ui" font-size="14" font-weight="800" fill="${I}">Fresh</text></g>`;
    s += `<g class="ox-st2"><rect x="140" y="40" width="120" height="30" rx="15" fill="#8c6a35" stroke="${I}" stroke-width="2"/><text x="200" y="60" text-anchor="middle" font-family="Inter,system-ui" font-size="14" font-weight="800" fill="#fff">Oxidized</text></g>`;
    // "now tastes like" panel
    s += `<g class="ox-panel"><text x="428" y="44" text-anchor="middle" font-family="Inter,system-ui" font-size="13" font-weight="800" letter-spacing=".08em" fill="#c7333a">NOW IT TASTES…</text>`;
    s += `<path d="M262 200 C300 200 300 180 320 180" fill="none" stroke="#c7333a" stroke-width="2.4" stroke-dasharray="5 5"/></g>`;
    const row = (y, d, icon, word) => `<g class="ox-ic" style="animation-delay:${d}s"><rect x="330" y="${y}" width="196" height="76" rx="16" fill="#fff" stroke="#c7333a" stroke-width="2"/>${icon}<text x="408" y="${y + 45}" text-anchor="start" font-family="Inter,system-ui" font-size="17" font-weight="800" fill="#c7333a">${word}</text></g>`;
    const box = (x, y) => `<g transform="translate(${x} ${y})"><path d="M0 18 L26 6 L52 18 L26 30 Z" fill="#f6e2bd" stroke="${I}" stroke-width="2" stroke-linejoin="round"/><path d="M0 18 L0 46 L26 58 L26 30 Z" fill="#e6c48d" stroke="${I}" stroke-width="2" stroke-linejoin="round"/><path d="M26 30 L26 58 L52 46 L52 18 Z" fill="#cfa262" stroke="${I}" stroke-width="2" stroke-linejoin="round"/><path d="M13 12 L39 24" stroke="#a97d42" stroke-width="5"/><path d="M8 28 l6 3 M36 42 l8 -4" stroke="#a97d42" stroke-width="1.6"/></g>`;
    const bread = (x, y) => `<g transform="translate(${x} ${y})"><path d="M2 40 Q-2 12 26 8 Q54 4 58 26 Q60 40 56 46 L6 50 Q2 48 2 40 Z" fill="#e2b984" stroke="${I}" stroke-width="2" stroke-linejoin="round"/><path d="M6 50 L56 46 L56 52 Q30 58 6 56 Z" fill="#c99557" stroke="${I}" stroke-width="2"/><path d="M14 22 l6 4 l5 -5 M30 16 l4 5 l6 -4 M44 24 l4 4" fill="none" stroke="#7a5329" stroke-width="1.8" stroke-linecap="round"/><circle cx="10" cy="62" r="1.8" fill="#9f6f38"/><circle cx="20" cy="64" r="1.4" fill="#9f6f38"/><circle cx="48" cy="62" r="1.6" fill="#9f6f38"/></g>`;
    const vin = (x, y) => `<g transform="translate(${x} ${y})"><rect x="20" y="0" width="12" height="8" rx="2" fill="#ec5a5f" stroke="${I}" stroke-width="2"/><path d="M21 8 L31 8 L31 18 Q42 22 42 32 L42 62 Q42 66 38 66 L14 66 Q10 66 10 62 L10 32 Q10 22 21 18 Z" fill="#bfe0c6" stroke="${I}" stroke-width="2" stroke-linejoin="round"/><rect x="10" y="36" width="32" height="18" fill="#fff" stroke="${I}" stroke-width="1.6"/><path d="M15 45 h22" stroke="#c7333a" stroke-width="2.4"/></g>`;
    s += row(58, 0, box(344, 66), "Cardboard");
    s += row(144, .45, bread(343, 151), "Stale");
    s += row(230, .9, vin(352, 235), "Vinegar");
    return s;
  }
  // shop air compressor: horizontal receiver tank on wheels, motor + pump on top, gauge, coiled hose
  function compressor(o) {
    const at = (q) => ISO.add(o, q);
    let s = "";
    s += cyl(at([4, 8, 0]), [0, 1, 0], 9, 6, "rubber", { sw: 1.6 }) + cyl(at([4, 36, 0]), [0, 1, 0], 9, 6, "rubber", { sw: 1.6 });
    s += box(at([96, 16, 0]), [8, 18, 12], "dark", { sw: 1.4 });
    s += cyl(at([0, 25, 26]), [1, 0, 0], 22, 110, "red");
    s += box(at([18, 12, 46]), [44, 26, 24], "dark") + cyl(at([62, 25, 58]), [1, 0, 0], 9, 14, "steel", { sw: 1.6 });
    s += box(at([76, 16, 46]), [22, 18, 16], "steel", { sw: 1.6 }) + cyl(at([87, 25, 62]), [0, 0, 1], 5, 8, "steel", { sw: 1.4 });
    s += ISO.gauge(at([104, 25, 62]), [1, 0, 0], 8, 0.7);
    s += tube([at([104, 36, 40]), at([118, 50, 30]), at([130, 60, 16]), at([118, 70, 6]), at([100, 60, 4]), at([110, 46, 6]), at([132, 52, 4])], 2.2, { fill: "#ffcd4d", noHi: true }).svg;
    return s;
  }

  Guided.start({
    id: "gas", title: "Gas: The Driving Force",
    hook: "A keg is a sealed steel container. So what actually moves beer from the keg to the glass, and why does the gas you choose change how it tastes?",
    objectives: ["Explain how a pressure differential moves beer", "Identify the gases used to pressurize kegs", "Explain why oxygen and compressed air are never used"],
    hero: () => svg(null, system({ gas: true, fill: 0.6, opaque: true }) + lbl([0, 40, 240], "Gas") + lbl([170, 60, 250], "Keg") + lbl([380, 60, 230], "Glass"), "A draught system: a gas cylinder with a regulator connects to a keg, and a beer line runs to a wall-mounted faucet above a glass."),
    learn: [
      { title: "Pressure moves beer",
        html: "<p>Moving beer from point A to point B takes a <strong>pressure differential</strong>: higher pressure behind the beer than in front of it.</p><p>Draught systems get it by <strong>pressurizing the keg with gas</strong>. Open the faucet, and beer flows toward the lower pressure.</p>",
        art: () => {
          const beer = tube([[0, 0, 147], [0, 0, 175], [70, 0, 175], [120, 0, 120]], 4.2, { fill: "#eef6ff" });
          let s = slab([-80, -70, -10], [260, 150, 10]) + parts.keg([0, 0, 0], { ghost: true, fill: 0.62 });
          [[-22, -14], [18, -22], [-10, 22], [24, 16]].forEach(([x, y]) => { const a = P([x, y, 128]), b = P([x, y, 102]); s += `<path d="M${f1(a[0])} ${f1(a[1])} L${f1(b[0])} ${f1(b[1])}" stroke="#18a0fb" stroke-width="4" stroke-linecap="round" marker-end="url(#ah)"/>`; });
          s += parts.coupler([0, 0, 148], { lever: 0.12 }) + beer.svg + `<path d="${beer.d}" class="flow-beer run"/>` + box([120, -40, 0], [14, 90, 150], "steel") + box([134, -40, 0], [70, 90, 36], "blue") + parts.glass([180, 0, 36], { fill: 0.45 }) + parts.faucet([134, 0, 112]);
          s += lbl([-40, 0, 115], "HIGHER PRESSURE", { bg: "#18a0fb", fg: "#fff", stroke: "#0b3b7a" }) + lbl([200, 0, 150], "LOWER PRESSURE", { bg: "#fff" });
          return svg(null, `<defs><marker id="ah" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#18a0fb"/></marker></defs>` + s, "Gas pushes down on beer inside a keg at higher pressure. Beer flows up the line to the faucet, where pressure is lower.");
        },
        aside: { html: "<b>Pressure differential:</b> a difference in pressure between two points. Fluids move from higher to lower pressure." } },
      { title: "Which gas goes in?",
        html: "<p>Most systems use <strong>CO₂ alone</strong> or a <strong>nitrogen (N₂) and CO₂ blend</strong>.</p><p>The most common blend is <strong>30% CO₂ / 70% N₂</strong>, called “beer gas” or “Guinness gas,” because it's required to serve Guinness. But it isn't necessarily best for other beers. Often 100% CO₂, or a ratio such as 50/50 or 70/30, is preferable.</p>",
        art: () => {
          let s = slab([-60, -60, -10], [300, 140, 10]);
          s += parts.tank([0, 0, 0], { pal: "blue" }) + parts.tank([90, 0, 0], { pal: "deep" }) + parts.tank([180, 0, 0], { pal: "white" });
          const a = P([180, 0, 30]), b = P([180, 0, 150]);
          s += `<g stroke-linecap="round"><line x1="${a[0] - 34}" y1="${b[1]}" x2="${a[0] + 34}" y2="${a[1]}" stroke="#fff" stroke-width="12"/><line x1="${a[0] + 34}" y1="${b[1]}" x2="${a[0] - 34}" y2="${a[1]}" stroke="#fff" stroke-width="12"/><line x1="${a[0] - 34}" y1="${b[1]}" x2="${a[0] + 34}" y2="${a[1]}" stroke="#ec5a5f" stroke-width="7"/><line x1="${a[0] + 34}" y1="${b[1]}" x2="${a[0] - 34}" y2="${a[1]}" stroke="#ec5a5f" stroke-width="7"/></g>`;
          s += lbl([0, 0, -24], "CO₂") + lbl([90, 0, -24], "CO₂ + N₂") + lbl([180, 0, -24], "O₂ / air: never", { bg: "#ec5a5f", fg: "#fff" });
          return svg(null, s, "Three cylinders: CO2, a CO2 and nitrogen blend, and oxygen or compressed air crossed out in red.");
        } },
      { title: "Never oxygen. Never compressed air.",
        html: "<p>Oxygen, or compressed air (which contains oxygen), should <strong>never</strong> be used to dispense beer.</p><p>Oxygen is one of beer's biggest enemies. It causes <strong>stale, cardboard-like</strong> and <strong>vinegar</strong> off-flavors.</p>",
        art: () => svg([20, 20, 530, 320], oxStory(), "A fresh pint of golden beer with a full head. Oxygen bubbles drift into it, the beer turns dull brown and the head collapses. Then a cardboard box, a stale loaf of bread and a vinegar bottle appear: the beer now tastes stale, like cardboard and like vinegar."),
        aside: { type: "warn", html: "<b>On the job:</b> if the CO₂ runs out mid-shift, swap in a fresh cylinder. Never use the shop's air compressor." } }
    ],
    tryIt: [{
      title: "Pour a pint",
      lede: "Tap the orange markers on the system itself.",
      goals: [{ id: "gas", text: "Open the gas" }, { id: "pour", text: "Pour a pint" }, { id: "stop", text: "Cut the gas mid-pour" }],
      mount(el, ctx) {
        let gas = false, tap = false, fill = 0, raf = 0, timer = 0;
        const V = P([-2, 60, 178]), T = P([340, 60, 192]);
        const art = svg(null, system({}) +
          hotspot("valve", V[0], V[1], "Gas shut-off on the regulator. Toggle to open or close the gas.", { hint: "Open the gas", hx: -150 }) +
          hotspot("tap", T[0], T[1], "Faucet tap handle. Toggle to pour.", { hint: "Pull the tap", off: true }), "Interactive draught system", { interactive: true });
        const { msg } = Guided.UI.tryLayout(el, art, { legend: `<span><i style="background:#18a0fb"></i>Gas</span><span><i style="background:#f6a724"></i>Beer</span>` });
        const $ = (s) => art.querySelector(s);
        const hint = (id, txt) => { const g = $(`.hs[data-hs="${id}"] .hs-hint`); if (g) { g.style.display = txt ? "" : "none"; if (txt) { g.querySelector("text").textContent = txt; g.querySelector("rect").setAttribute("width", txt.length * 7.4 + 18); } } };
        function draw() {
          const pouring = gas && tap;
          $("#reg-valve").innerHTML = shutoff(gas);
          $("#f-gas").setAttribute("opacity", gas ? 1 : 0); $("#f-gas").classList.toggle("run", pouring);
          ["#f-beer", "#f-tube"].forEach((id) => { $(id).setAttribute("opacity", pouring ? 1 : 0); $(id).classList.toggle("run", pouring); });
          $("#stream").setAttribute("opacity", pouring ? 1 : 0);
          $("#faucet").innerHTML = parts.faucet([316, 60, 150], { handle: tap ? 0.5 : 0 });
          setHot(art, "tap", gas || tap);
          hint("valve", !gas ? "Open the gas" : tap && !ctx.isDone("stop") && ctx.isDone("pour") ? "Now cut the gas" : null);
          hint("tap", gas && !tap ? "Pull the tap" : null);
          if (!gas && !tap) say(msg, "info", "No pressure yet", "The gas is off. Open the gas shut-off on the regulator.");
          else if (gas && !tap) say(msg, "info", "Pressurized and holding", "Gas pressure is on the keg, and beer fills the line. Nothing moves until the tap opens.");
          else if (pouring) say(msg, "ok", "Pouring", "Pressure in the keg is higher than at the open faucet. That differential pushes the beer to the glass.");
          else say(msg, "warn", "The pour dies", "With no gas pushing, there's no pressure differential, so the beer stops.");
        }
        function loop() {
          if (gas && tap) {
            fill += 0.012;
            if (fill >= 1) { fill = 1; if (!ctx.isDone("pour")) { ctx.done("pour"); home(art, 700); } }
            $("#glass").innerHTML = parts.glass([360, 60, 60], { fill });
            if (fill >= 1) { clearTimeout(timer); timer = setTimeout(() => { fill = 0; $("#glass").innerHTML = parts.glass([360, 60, 60], { fill }); ctx.say("Fresh glass."); draw(); }, 1100); }
          }
          raf = requestAnimationFrame(loop);
        }
        bindHotspots(art, {
          valve() { gas = !gas; if (gas) { ctx.done("gas"); setTimeout(() => home(art, 700), 400); } if (!gas && tap) ctx.done("stop"); ctx.say(gas ? "Gas opened." : "Gas closed."); draw(); },
          tap() { tap = !tap; ctx.say(tap ? "Tap pulled." : "Tap closed."); if (tap) zoomTo(art, "#faucet", 140, 700); else home(art, 600); draw(); }
        });
        art.addEventListener("framed", () => zoomTo(art, "#reg-valve", 120, 0));
        draw(); loop();
        return () => { cancelAnimationFrame(raf); clearTimeout(timer); };
      }
    }],
    checks: [
      { q: "What actually moves beer from the keg to the faucet?",
        art: () => svg(null, slab([-80, -70, -10], [240, 150, 10]) + parts.keg([0, 0, 0]) + parts.coupler([0, 0, 150], { lever: 0.12 }) + box([110, -40, 0], [14, 90, 150], "steel") + parts.faucet([124, 0, 112]), "A keg with a coupler, connected to a faucet."),
        options: [
          { t: "A pressure differential created by gas in the keg", ok: true, fb: "Higher pressure in the keg pushes beer toward the lower pressure at the open faucet." },
          { t: "Gravity pulling beer down from the keg", fb: "Beer travels up and out of the keg. Gas pressure, not gravity, moves it." },
          { t: "A pump inside the faucet", fb: "The faucet is just a valve. The force is gas pressure." },
          { t: "The cold temperature of the cooler", fb: "Temperature matters for quality, but it doesn't move beer." }
        ] },
      { q: "What should you do?", scenario: "The CO₂ cylinder runs empty on a busy Friday. A coworker suggests hooking up the shop's air compressor.",
        art: () => svg(null, slab([-60, -70, -10], [260, 160, 10]) + parts.tank([0, 0, 0], { pal: "white" }) + lbl([0, 0, 196], "Empty CO₂", { bg: "#fff" }) + compressor([80, -30, 0]) + lbl([135, -10, 112], "Air compressor", { bg: "#fdeceb", fg: "#c7333a", stroke: "#c7333a" }), "An empty CO2 cylinder next to a shop air compressor: a red horizontal tank on wheels with a motor, a pressure gauge and a coiled air hose."),
        options: [
          { t: "Don't. Compressed air contains oxygen, which ruins the beer's flavor.", ok: true, fb: "Swap in a fresh cylinder. Never use oxygen or compressed air." },
          { t: "Do it, if the regulator is set to the right pressure", fb: "Pressure isn't the issue. Oxygen damages the beer." },
          { t: "Do it, but only for one night", fb: "Even short oxygen exposure can create off-flavors." },
          { t: "Do it only for light beers", fb: "Oxygen damages every beer." }
        ] },
      { q: "True or false: “beer gas” (30% CO₂ / 70% N₂) is the best choice for most beers.",
        art: () => svg(null, slab([-50, -50, -10], [110, 110, 10]) + parts.tank([0, 0, 0], { pal: "deep" }) + lbl([0, 0, -24], "Beer gas · 30/70"), "A beer gas cylinder."),
        options: [
          { t: "False", ok: true, fb: "It's required for Guinness, but 100% CO₂ or another ratio is often preferable." },
          { t: "True", fb: "The name comes from Guinness. It isn't necessarily best for other beers." }
        ] }
    ],
    takeaways: [
      "Beer moves because of a <strong>pressure differential</strong>: higher gas pressure in the keg than at the open faucet.",
      "Kegs use <strong>CO₂</strong> or a <strong>CO₂/N₂ blend</strong>. “Beer gas” (30/70) is required for Guinness but isn't automatically best.",
      "<strong>Never</strong> oxygen or compressed air: stale, cardboard and vinegar off-flavors."
    ]
  });
})();
