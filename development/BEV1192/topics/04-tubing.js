(function () {
  const { cyl, box, tube, parts, label, P, slab, svg, f1 } = ISO;
  const { h, say, dnd } = Guided.UI;
  const lbl = (pt, t, opt) => { const q = P(pt); return label(q[0], q[1], t, opt); };
  const dashed = (pts, id) => `<path ${id ? `id="${id}"` : ""} d="${ISO.smoothD(pts.map(P))}" fill="none" stroke="#2f74d0" stroke-width="3" stroke-dasharray="6 6" stroke-linecap="round" opacity=".8"/>`;

  // ----- system diorama: gas run, direct-draw beer run, long-draw beer run -----
  const RUN = {
    gas: [[-50, 52, 172], [-40, 70, 150], [-10, 70, 110], [20, 40, 95], [40, 40, 74]],
    direct: [[40, 40, 74], [40, 40, 92], [40, 40, 110], [40, 40, 128]],
    long: [[230, -50, 92], [230, -50, 120], [290, -10, 128], [342, 50, 130], [346, 70, 122], [346, 70, 104]]
  };
  function diorama(st = {}) {
    let s = slab([-100, -110, -12], [490, 250, 12]);
    // left: kegerator (direct draw)
    s += parts.tank([-50, 40, 0]) + parts.regulator([-50, 40, 168], { values: [0.7, 0.3] });
    s += parts.keg([40, 40, 0], { r: 30, h: 70, ghost: false }) + parts.coupler([40, 40, 62], { lever: 0.12 });
    s += st.gas ? tube(RUN.gas, 3.6, { fill: "#eef6ff" }).svg : dashed(RUN.gas);
    s += st.direct ? tube(RUN.direct, 3, { fill: "#f6a724" }).svg : dashed(RUN.direct);
    s += box([0, 0, 0], [80, 80, 128], "steel", { opacity: 0.18 });
    s += cyl([40, 40, 128], [0, 0, 1], 7, 36, "steel") + parts.faucet([47, 40, 158], { handle: 0 });
    // right: walk-in cooler at the back, bar counter at the front (long draw)
    s += box([190, -90, 0], [80, 80, 92], "steel");
    s += st.long ? tube(RUN.long, 3.2, { fill: "#f6a724" }).svg : dashed(RUN.long);
    s += box([320, 20, 0], [48, 110, 70], "blue");
    s += cyl([346, 70, 70], [0, 0, 1], 7, 34, "steel") + parts.faucet([353, 70, 100], { handle: 0 });
    s += lbl([-50, 40, -30], "Gas", { fs: 11 }) + lbl([40, 40, -30], "Kegerator", { fs: 11 }) + lbl([230, -50, 118], "Walk-in cooler", { fs: 11 }) + lbl([344, 76, -20], "Bar", { fs: 11 });
    return s;
  }
  // ----- side view: direct draw (left) vs long draw (right). st.gas/direct/long fill each run; opt.labels names the tubing -----
  const I = "#0b3b7a";
  const pipe = (d, col, w, opt = {}) => `<path d="${d}" fill="none" stroke="${I}" stroke-width="${w + 3.4}" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="${col}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"${opt.cls ? ` class="${opt.cls}"` : ""}/>`;
  const empty = (d, w) => `<path d="${d}" fill="none" stroke="#ff7a2e" stroke-width="${w}" stroke-dasharray="2 9" stroke-linecap="round" opacity=".9"/>`;
  const keg2d = (x, y, w, hh) => `<g><rect x="${x}" y="${y + 6}" width="${w}" height="${hh - 6}" rx="${w * 0.16}" fill="#e8f1fc" stroke="${I}" stroke-width="2.4"/><rect x="${x + 4}" y="${y}" width="${w - 8}" height="12" rx="4" fill="#c6dcf5" stroke="${I}" stroke-width="2"/><rect x="${x + w * 0.22}" y="${y + 2}" width="${w * 0.14}" height="7" rx="2" fill="${I}"/><rect x="${x + w * 0.64}" y="${y + 2}" width="${w * 0.14}" height="7" rx="2" fill="${I}"/>${[0.3, 0.72].map((k) => `<rect x="${x - 2}" y="${y + hh * k}" width="${w + 4}" height="6" rx="3" fill="#d6e6f9" stroke="${I}" stroke-width="1.8"/>`).join("")}<rect x="${x + 4}" y="${y + hh - 8}" width="${w - 8}" height="8" rx="3" fill="#c6dcf5" stroke="${I}" stroke-width="1.8"/></g>`;
  const coupler2d = (cx, y) => `<g><rect x="${cx - 13}" y="${y - 6}" width="26" height="10" rx="3" fill="#dbe7f7" stroke="${I}" stroke-width="2"/><rect x="${cx - 8}" y="${y - 22}" width="16" height="17" rx="3" fill="#eef4fc" stroke="${I}" stroke-width="2"/><path d="M${cx + 8} ${y - 14} l22 -4" stroke="${I}" stroke-width="6" stroke-linecap="round"/><path d="M${cx + 8} ${y - 14} l22 -4" stroke="#3b4660" stroke-width="3" stroke-linecap="round"/></g>`;
  const cyl2d = (x, y, w, hh, col) => `<g><rect x="${x}" y="${y + 14}" width="${w}" height="${hh - 14}" rx="${w / 2.4}" fill="${col || "#77abe9"}" stroke="${I}" stroke-width="2.2"/><rect x="${x + w * 0.32}" y="${y + 4}" width="${w * 0.36}" height="12" rx="2" fill="#eecb72" stroke="${I}" stroke-width="1.8"/><rect x="${x + w * 0.12}" y="${y - 2}" width="${w * 0.76}" height="7" rx="3" fill="#56637c" stroke="${I}" stroke-width="1.6"/><rect x="${x + w - 2}" y="${y + 2}" width="14" height="12" rx="2" fill="#eef4fc" stroke="${I}" stroke-width="1.6"/><circle cx="${x + w + 18}" cy="${y + 2}" r="8" fill="#fff" stroke="${I}" stroke-width="1.8"/></g>`;
  const faucet2d = (x, y, dir = 1) => `<g><rect x="${x}" y="${y - 7}" width="${30 * dir}" height="14" rx="6" fill="#eef4fc" stroke="${I}" stroke-width="2.2" transform="${dir < 0 ? `translate(${2 * x} 0) scale(-1 1) translate(${-2 * x} 0)` : ""}"/><rect x="${x + 22 * dir - 4}" y="${y + 6}" width="9" height="14" rx="3" fill="#eef4fc" stroke="${I}" stroke-width="2"/><rect x="${x + 10 * dir - 5}" y="${y - 40}" width="10" height="34" rx="4" fill="#ff7a2e" stroke="${I}" stroke-width="2"/></g>`;
  const glass2d = (x, y, gh = 40) => `<path d="M${x} ${y} l26 0 l-3 ${gh} l-20 0 z" fill="#ffcb52" stroke="${I}" stroke-width="2" stroke-linejoin="round"/><path d="M${x} ${y} l26 0 l-1 8 l-24 0z" fill="#fff" stroke="${I}" stroke-width="1.6"/>`;
  const DRAW = {
    gas: "M108 232 C 108 212 120 200 150 200 L 176 200",            // direct-draw regulator → coupler
    direct: "M196 222 L196 196 L196 92 L208 92",                   // coupler → up the tower → faucet
    long: "M498 220 L498 96 L790 96 L790 186 L804 186",
    lgas: "M422 248 C 422 226 440 214 466 214 L 480 214"                // walk-in keg → ceiling → across → down to the bar faucet
  };
  function sideView(st = {}, opt = {}) {
    let s = `<rect x="0" y="0" width="900" height="390" fill="none"/>`;
    // ground
    s += `<rect x="16" y="342" width="300" height="10" rx="5" fill="#d9e9fc" stroke="${I}" stroke-width="2"/><rect x="356" y="342" width="528" height="10" rx="5" fill="#d9e9fc" stroke="${I}" stroke-width="2"/>`;
    const D = opt.only !== "long", L = opt.only !== "direct";
    // ---- DIRECT DRAW ----
    if (D) {
    s += `<text x="166" y="28" text-anchor="middle" font-family="Inter,system-ui" font-size="17" font-weight="800" fill="${I}">DIRECT DRAW</text><text x="166" y="47" text-anchor="middle" font-family="Inter,system-ui" font-size="13" font-weight="600" fill="#56637c">Keg sits right under the faucet</text>`;
    s += `<rect x="70" y="150" width="200" height="192" rx="10" fill="#f4f8fd" stroke="${I}" stroke-width="2.6"/><rect x="80" y="160" width="180" height="172" rx="6" fill="#e3eefb" stroke="${I}" stroke-width="1.6" stroke-dasharray="4 4"/>`;
    s += `<text x="170" y="370" text-anchor="middle" font-family="Inter,system-ui" font-size="12.5" font-weight="700" fill="#56637c">Kegerator (cut-away)</text>`;
    s += cyl2d(90, 236, 30, 96, "#77abe9") + keg2d(156, 222, 80, 110) + coupler2d(196, 224);
    s += `<rect x="186" y="76" width="20" height="74" rx="4" fill="#eef4fc" stroke="${I}" stroke-width="2.4"/><rect x="172" y="146" width="48" height="6" rx="3" fill="#c6dcf5" stroke="${I}" stroke-width="1.8"/>`;
    // glass centred under the spout and drawn first, so the spout reads as above it
    s += `<rect x="208" y="140" width="44" height="8" rx="3" fill="#c6dcf5" stroke="${I}" stroke-width="1.6"/>` + glass2d(215.5, 114, 26) + faucet2d(206, 92);
    }
    // ---- LONG DRAW ----
    if (L) {
    s += `<text x="620" y="28" text-anchor="middle" font-family="Inter,system-ui" font-size="17" font-weight="800" fill="${I}">LONG DRAW</text><text x="620" y="47" text-anchor="middle" font-family="Inter,system-ui" font-size="13" font-weight="600" fill="#56637c">Kegs in a cooler, far from the bar</text>`;
    s += `<rect x="380" y="120" width="170" height="222" rx="6" fill="#eef5fe" stroke="${I}" stroke-width="2.6"/><rect x="386" y="126" width="158" height="210" rx="4" fill="none" stroke="#9cc3f0" stroke-width="5"/>`;
    s += `<text x="465" y="370" text-anchor="middle" font-family="Inter,system-ui" font-size="12.5" font-weight="700" fill="#56637c">Walk-in cooler</text>`;
    s += `<g transform="translate(400 140)"><path d="M0 -9 V9 M-8 -4.5 L8 4.5 M-8 4.5 L8 -4.5" stroke="#2f74d0" stroke-width="2.4" stroke-linecap="round"/></g>`;
    s += cyl2d(396, 246, 26, 86, "#77abe9") + keg2d(456, 232, 74, 100) + coupler2d(493, 234);
    s += (st.lgas || !opt.lgasRun) ? pipe(DRAW.lgas, "#eef6ff", 5) : empty(DRAW.lgas, 5);
    // building wall between cooler and bar room
    s += `<rect x="600" y="88" width="14" height="254" fill="#dbe7f7" stroke="${I}" stroke-width="2"/>`;
    // bar: counter + back panel with faucets
    s += `<rect x="770" y="178" width="12" height="70" rx="3" fill="#eef4fc" stroke="${I}" stroke-width="2.2"/>`;
    s += glass2d(791.5, 210) + faucet2d(782, 186);
    s += `<rect x="700" y="252" width="184" height="16" rx="4" fill="#e2b984" stroke="${I}" stroke-width="2.4"/><rect x="712" y="268" width="160" height="74" fill="#c99557" stroke="${I}" stroke-width="2.4"/>`;
    s += `<text x="792" y="370" text-anchor="middle" font-family="Inter,system-ui" font-size="12.5" font-weight="700" fill="#56637c">Bar</text>`;
    // distance arrow
    s += `<g opacity=".85"><path d="M506 74 L782 74" stroke="#56637c" stroke-width="1.8" stroke-dasharray="5 4"/><path d="M506 74 l8 -5 v10z M782 74 l-8 -5 v10z" fill="#56637c"/><rect x="590" y="62" width="110" height="22" rx="11" fill="#fff" stroke="#56637c" stroke-width="1.4"/><text x="645" y="77.5" text-anchor="middle" font-family="Inter,system-ui" font-size="12" font-weight="700" fill="#56637c">long distance</text></g>`;
    }
    // runs
    if (D) {
      s += st.gas ? pipe(DRAW.gas, opt.gasCol || "#eef6ff", 5) : empty(DRAW.gas, 5);
      s += st.direct ? pipe(DRAW.direct, "#f6a724", 4) + `<path d="${DRAW.direct}" class="flow-beer run" fill="none"/>` : empty(DRAW.direct, 5);
      s += coupler2d(196, 224);
    }
    if (L) {
      s += st.long ? pipe(DRAW.long, "#f6a724", 7) + `<path d="${DRAW.long}" fill="none" stroke="#fff" stroke-width="1.4" stroke-dasharray="1 7" opacity=".9"/><path d="${DRAW.long}" class="flow-beer run" fill="none"/>` : empty(DRAW.long, 7);
      s += coupler2d(493, 234);
    }
    if (opt.labels) {
      const tag = (x, y, t, anchor) => label(x, y, t, { fs: 12, anchor: anchor || "middle" });
      s += tag(112, 186, "Gas: 5/16″ vinyl", "end") + tag(214, 196, "Beer: 3/16″ vinyl", "start") + tag(694, 112, "Beer: nylon-barrier polyethylene");
    }
    return s;
  }
  const tubeIcon = (outer, inner, barrier) => `<svg viewBox="0 0 54 34" aria-hidden="true"><ellipse cx="27" cy="17" rx="${outer}" ry="${outer * 0.8}" fill="${barrier ? "#e8f1fc" : "#d6e8fb"}" stroke="#0b3b7a" stroke-width="2"/>${barrier ? `<ellipse cx="27" cy="17" rx="${inner + 3}" ry="${(inner + 3) * 0.8}" fill="#b9cff8" stroke="#2f74d0" stroke-width="1.5"/>` : ""}<ellipse cx="27" cy="17" rx="${inner}" ry="${inner * 0.8}" fill="#fff" stroke="#0b3b7a" stroke-width="1.5"/></svg>`;
  const lineIcon = (c, clear) => `<svg viewBox="0 0 54 34" aria-hidden="true"><path d="M6 24 C 18 4, 36 30, 48 10" fill="none" stroke="#0b3b7a" stroke-width="10" stroke-linecap="round"/><path d="M6 24 C 18 4, 36 30, 48 10" fill="none" stroke="${c}" stroke-width="6.5" stroke-linecap="round" ${clear ? 'stroke-opacity=".9"' : ""}/></svg>`;
  const TOK = { gas: { id: "g", label: "5/16\" colored vinyl", icon: tubeIcon(14, 8) }, thin: { id: "b", label: "3/16\" vinyl", icon: tubeIcon(10, 4.5) }, nyl: { id: "n", label: "Polyethylene, nylon barrier", icon: tubeIcon(14, 7, true) } };
  const TRY = {
    direct: { title: "Direct draw: run the tubing", lede: "Drag the right tube onto each dashed run in the kegerator. One tube doesn't belong here.",
      vb: [0, 10, 330, 372], alt: "Side view of a cut-away direct-draw kegerator: CO2 cylinder, keg, tower and faucet. Two empty runs are marked by dashed orange lines: the gas line from the regulator to the coupler, and the short beer line from the coupler up the tower to the faucet.",
      zones: [{ id: "gas", label: "Gas line", box: [96, 186, 86, 54], cls: "zl-left" }, { id: "direct", label: "Kegerator beer line", box: [184, 80, 30, 134], cls: "zl-right" }],
      tokens: [{ ...TOK.gas, zone: "gas" }, { ...TOK.thin, zone: "direct" }, { ...TOK.nyl, zone: null }],
      fb: { gas: "Gas runs from the regulator to the coupler in 5/16\" vinyl.", direct: "In direct draw the keg is right under the faucet, so a short 3/16\" vinyl line is common." },
      done: ["Direct draw done", "Nylon-barrier polyethylene stays in the tray: it's built for long-draw runs."] },
    long: { title: "Long draw: run the tubing", lede: "Now the long-draw system. Drag the right tube onto each dashed run. One tube doesn't belong here.",
      vb: [356, 10, 544, 372], alt: "Side view of a long-draw system: a CO2 cylinder and keg in a walk-in cooler, a wall, and a bar faucet far away. Two empty runs are marked by dashed orange lines: the gas line in the walk-in, and the long beer line up to the ceiling, across and down to the bar faucet.",
      zones: [{ id: "lgas", label: "Walk-in gas line", box: [412, 202, 76, 52], cls: "zl-top" }, { id: "long", label: "Long-draw beer line", box: [520, 84, 280, 26], cls: "zl-bottom" }],
      tokens: [{ ...TOK.gas, zone: "lgas" }, { ...TOK.thin, zone: null }, { ...TOK.nyl, zone: "long" }],
      fb: { lgas: "Gas lines in a long-draw system are still 5/16\" vinyl.", long: "Long-draw runs cover a long distance, often in nylon-barrier polyethylene." },
      done: ["Long draw done", "3/16\" vinyl stays in the tray: it's the short direct-draw beer line."] } };
  function tubeTry(k) {
    const T = TRY[k], opt = { only: k, lgasRun: k === "long" };
    return { title: T.title, lede: T.lede, goals: [{ id: k, text: "Place both tubes" }],
      mount(el, ctx) {
        const st = {};
        const art = svg(T.vb, sideView(st, opt), T.alt, { interactive: true });
        const board = dnd({ art, trayLabel: "Tubing", say: ctx.say, hideFilled: true, intro: ["Two empty runs", "The dashed orange lines need tubing. Drag a tube onto each run."],
          zones: T.zones, tokens: T.tokens,
          onResult(t, z, ok) {
            const msg = board._msg;
            if (ok) { st[z.id] = true; const vb = art.getAttribute("viewBox"); art.innerHTML = sideView(st, opt); art.setAttribute("viewBox", vb); say(msg, "ok", "Correct.", T.fb[z.id]); }
            else if (!t.zone) say(msg, "bad", "Not in this system.", k === "direct" ? "Nylon-barrier polyethylene is for long runs. A kegerator's lines are short." : "3/16\" vinyl is for short direct-draw runs, not a long run to the bar.");
            else say(msg, "bad", "Not that run.", "Think about what flows there (gas or beer) and how far it has to go.");
          },
          onDone: () => { say(board._msg, "ok", T.done[0], T.done[1]); ctx.done(k); } });
        el.append(board);
      } };
  }

  // ----- three cylinders with gas-line color zones -----
  const MIX = [{ id: "co2", n: "100% CO₂", pal: "blue", c: "#eef6ff" }, { id: "fifty", n: "50/50 blend", pal: "deep", c: "#3b82e6" }, { id: "seventy", n: "70/30 blend", pal: "white", c: "#e15a4f" }];
  const hosePts = (x) => [[x, 12, 172], [x, 30, 150], [x + 10, 60, 120], [x + 10, 70, 60], [x + 10, 64, 20]];
  function tanks(st = {}) {
    let s = slab([-50, -40, -12], [320, 140, 12]);
    MIX.forEach((m, i) => {
      const x = i * 110;
      s += parts.tank([x, 0, 0], { pal: m.pal }) + parts.regulator([x, 0, 168], { values: [0.7, 0.4] });
      s += st[m.id] ? tube(hosePts(x), 3.8, { fill: m.c }).svg : dashed(hosePts(x));
      s += lbl([x, 0, -28], m.n, { fs: 11.5 });
    });
    return s;
  }

  function beerInLine() {
    let s = `<rect x="20" y="300" width="580" height="10" rx="5" fill="#d9e9fc" stroke="${I}" stroke-width="2"/>`;
    // CO2 cylinder + regulator (side view)
    s += `<rect x="60" y="120" width="70" height="180" rx="26" fill="#77abe9" stroke="${I}" stroke-width="2.6"/><rect x="72" y="134" width="12" height="150" rx="6" fill="#a9ccf3" opacity=".8"/>`;
    s += `<rect x="86" y="100" width="18" height="22" rx="3" fill="#eecb72" stroke="${I}" stroke-width="2.2"/>`;
    s += `<rect x="78" y="70" width="36" height="32" rx="6" fill="#eef4fc" stroke="${I}" stroke-width="2.4"/>`; // regulator body
    s += `<circle cx="78" cy="58" r="15" fill="#fff" stroke="${I}" stroke-width="2.4"/><path d="M78 58 l7 -8" stroke="#c7333a" stroke-width="2.4" stroke-linecap="round"/><circle cx="114" cy="58" r="15" fill="#fff" stroke="${I}" stroke-width="2.4"/><path d="M114 58 l-2 -10" stroke="#c7333a" stroke-width="2.4" stroke-linecap="round"/>`;
    s += `<rect x="114" y="80" width="22" height="12" rx="3" fill="#dbe7f7" stroke="${I}" stroke-width="2"/>`; // outlet + barb
    // keg + coupler with a gas inlet on its left side
    s += keg2d(420, 160, 130, 140);
    s += `<rect x="462" y="128" width="46" height="36" rx="6" fill="#eef4fc" stroke="${I}" stroke-width="2.4"/><rect x="456" y="158" width="58" height="10" rx="4" fill="#dbe7f7" stroke="${I}" stroke-width="2"/>`;
    s += `<path d="M508 140 l40 -6" stroke="${I}" stroke-width="9" stroke-linecap="round"/><path d="M508 140 l40 -6" stroke="#3b4660" stroke-width="5" stroke-linecap="round"/>`;
    s += `<rect x="440" y="140" width="24" height="12" rx="3" fill="#ffab70" stroke="${I}" stroke-width="2"/>`; // gas inlet with check valve
    s += `<rect x="478" y="104" width="14" height="26" rx="3" fill="#dbe7f7" stroke="${I}" stroke-width="2"/><path d="M485 104 C 485 80 520 70 560 70" fill="none" stroke="${I}" stroke-width="10" stroke-linecap="round"/><path d="M485 104 C 485 80 520 70 560 70" fill="none" stroke="#f6a724" stroke-width="6" stroke-linecap="round"/>`;
    // the clear gas line: regulator outlet → coupler gas inlet, with beer pushed back into the last stretch
    const line = "M136 86 C 220 86 260 146 330 146 L440 146";
    s += pipe(line, "#eef6ff", 9);
    s += `<path d="M352 146 L440 146" stroke="#f6a724" stroke-width="6.5" stroke-linecap="butt"/>` + [366, 384, 404, 424].map((x, i) => `<circle cx="${x}" cy="${145 + (i % 2)}" r="2" fill="#fff"/>`).join("");
    s += `<path d="M352 146 L440 146" stroke="#fff" stroke-width="1.4" stroke-dasharray="1 9" opacity=".8"/>`;
    // magnifier
    const cx = 370, cy = 52;
    s += `<g aria-hidden="true"><line x1="392" y1="140" x2="${cx + 8}" y2="${cy + 44}" stroke="#ff7a2e" stroke-width="2.5"/><circle cx="392" cy="146" r="16" fill="none" stroke="#ff7a2e" stroke-width="2.5"/><circle cx="${cx}" cy="${cy}" r="46" fill="#fff" stroke="#ff7a2e" stroke-width="4"/>
      <clipPath id="lp"><circle cx="${cx}" cy="${cy}" r="42"/></clipPath><g clip-path="url(#lp)"><rect x="${cx - 70}" y="${cy - 16}" width="140" height="32" rx="16" fill="#eef6ff" stroke="${I}" stroke-width="3"/><rect x="${cx - 6}" y="${cy - 11}" width="80" height="22" fill="#f6a724"/>${[0, 14, 30, 44].map((d) => `<circle cx="${cx + 4 + d}" cy="${cy - 2 + (d % 3)}" r="3" fill="#fff" opacity=".85"/>`).join("")}</g></g>`;
    s += label(95, 326, "CO₂ + regulator", { fs: 12.5 }) + label(485, 326, "Keg + coupler", { fs: 12.5 }) + label(270, 210, "Beer visible in a clear gas line", { fs: 12.5, bg: "#fff5e0", fg: "#9a5b00", stroke: "#d8870d" });
    return s;
  }


  Guided.start({
    id: "tubing", title: "Tubing",
    hook: "Tubing looks simple, but the wrong line can't do the job, and the right one can warn you about a problem before a customer tastes it.",
    objectives: ["Match gas and beer tubing to the job each one does", "Read gas-line color codes", "Explain why clear gas lines matter"],
    hero: () => svg([0, 10, 900, 372], sideView({ gas: true, direct: true, long: true }), "Side view. Left, direct draw: a cut-away kegerator with a CO2 cylinder and a keg right under the tower and faucet on top; a short beer line runs straight up. Right, long draw: kegs in a walk-in cooler; a long beer line runs up to the ceiling, across a long distance through the wall, and down to a faucet at the bar."),
    learn: [
      { title: "Gas lines",
        html: "<p>Gas usually travels from the regulator to the keg coupler through <strong>colored 5/16\" vinyl tubing</strong>.</p><p>Lines can be <strong>color-coded</strong> to match the gas they carry, for example <strong>red</strong> for 70/30, <strong>blue</strong> for 50/50 and <strong>clear</strong> for 100% CO₂.</p>",
        art: () => svg(null, tanks({ co2: true, fifty: true, seventy: true }), "Three cylinders with color-coded gas lines: clear for 100% CO2, blue for a 50/50 blend, red for a 70/30 blend.") },
      { title: "Why clear gas lines matter",
        html: "<p>Gas lines should ideally be <strong>transparent</strong>, so you can see any beer backing up into the gas system.</p><p>Beer in a gas line is a warning sign: something is letting beer flow the wrong way.</p>",
        art: () => svg([20, 0, 590, 340], beerInLine(), "Side view: a CO2 cylinder with a regulator on top. A clear gas line runs from the regulator outlet to the gas inlet on the side of a coupler on a keg. Near the coupler, beer has been pushed back into the clear line; a magnifier shows the beer and bubbles inside it."),
        aside: { html: "<b>On the job:</b> glance at the gas lines during opening checks. Beer where only gas belongs is easy to spot." } },
      { title: "Beer lines",
        html: "<p><strong>Direct-draw</strong> systems keep kegs close to the faucets, and commonly use <strong>3/16\" vinyl</strong> beer line.</p><p><strong>Long-draw</strong> systems move beer over long distances, often through <strong>polyethylene with a nylon barrier</strong> (1/4\"–3/8\").</p><p>Whatever the type, the tubing <strong>must be made for beer</strong>.</p>",
        art: () => svg([-24, 10, 924, 372], sideView({ gas: true, direct: true, long: true }, { labels: true }), "Side view. Left, direct draw: a cut-away kegerator with a CO2 cylinder and a keg right under the tower and faucet on top; a short beer line runs straight up. Right, long draw: kegs in a walk-in cooler; a long beer line runs up to the ceiling, across a long distance through the wall, and down to a faucet at the bar.") }
    ],
    tryIt: [
      tubeTry("direct"),
      tubeTry("long"),
      { title: "Color-code the gas lines",
        lede: "Drag each colored line to the cylinder whose gas it carries.",
        goals: [{ id: "colors", text: "Connect all three lines" }],
        mount(el, ctx) {
          const st = {};
          const art = svg(null, tanks(st), "Three cylinders with empty gas-line runs", { interactive: true });
          const board = dnd({ art, trayLabel: "Gas lines", say: ctx.say, hideFilled: true, intro: ["Match the code.", "Each blend gets its own line color. Drag each line to its cylinder."],
            zones: MIX.map((m, i) => ({ id: m.id, label: m.n, world: hosePts(i * 110) })),
            tokens: [{ id: "clear", label: "Clear line", icon: lineIcon("#eef6ff", true), zone: "co2" }, { id: "blue", label: "Blue line", icon: lineIcon("#3b82e6"), zone: "fifty" }, { id: "red", label: "Red line", icon: lineIcon("#e15a4f"), zone: "seventy" }],
            onResult(t, z, ok) {
              const msg = board._msg;
              if (ok) { st[z.id] = true; const vb = art.getAttribute("viewBox"); art.innerHTML = tanks(st); art.setAttribute("viewBox", vb); say(msg, "ok", "Connected.", `${t.label} for ${z.label}.`); }
              else say(msg, "bad", "Not that one.", "Red is 70/30, blue is 50/50, clear is 100% CO₂.");
            },
            onDone: () => ctx.done("colors") });
          el.append(board);
        } }
    ],
    checks: [
      { q: "What does this tell you?", scenario: "During opening checks you spot beer inside the clear gas line next to a keg.",
        art: () => svg([20, 0, 590, 340], beerInLine(), "Beer pushed back into a clear gas line near the coupler."),
        options: [
          { t: "Beer is backing up into the gas system. Inspect the coupler's check valve.", ok: true, fb: "Beer doesn't belong in a gas line. Spotting it is why clear lines are preferred." },
          { t: "This is normal; gas lines often hold beer", fb: "Gas lines should hold only gas." },
          { t: "The line is the wrong color", fb: "Clear is the code for 100% CO₂. The issue is backflow." },
          { t: "The beer line is too short", fb: "This is the gas line. Beer here means backflow." }
        ] },
      { q: "Why are transparent gas lines preferred?",
        art: () => svg(null, tanks({ co2: true }), "A cylinder with a clear gas line."),
        options: [
          { t: "You can see if beer backs up into the gas system", ok: true, fb: "Visibility is the point." },
          { t: "Clear vinyl handles more pressure", fb: "The reason is visibility." },
          { t: "You can see how much gas is left", fb: "Gas is invisible. Transparency is for spotting beer." },
          { t: "Colored lines can't carry CO₂", fb: "Colored lines are fine and help with color-coding." }
        ] },
      { q: "Kegs in a walk-in cooler feed a bar across the building. What tubing usually makes that long run?",
        art: () => svg([0, 10, 900, 372], sideView({ gas: true, direct: true, long: true }), "Side view. Left, direct draw: a cut-away kegerator with a CO2 cylinder and a keg right under the tower and faucet on top; a short beer line runs straight up. Right, long draw: kegs in a walk-in cooler; a long beer line runs up to the ceiling, across a long distance through the wall, and down to a faucet at the bar."),
        options: [
          { t: "Polyethylene with a nylon barrier, 1/4\"–3/8\"", ok: true, fb: "Barrier tubing is common for long-draw runs." },
          { t: "3/16\" vinyl", fb: "That's common for short direct-draw runs." },
          { t: "5/16\" colored vinyl", fb: "That's used for gas lines." },
          { t: "Any hose rated for water", fb: "All tubing must be made for beer." }
        ] }
    ],
    takeaways: [
      "<strong>Gas lines:</strong> usually 5/16\" colored vinyl, color-coded by gas (for example red 70/30, blue 50/50, clear 100% CO₂).",
      "<strong>Clear gas lines</strong> let you spot beer backing up into the gas system.",
      "<strong>Beer lines:</strong> 3/16\" vinyl for direct draw, nylon-barrier polyethylene for long draw. All must be made for beer."
    ]
  });
})();
