/* Guided Learning Widget engine v2
   Intro → Learn → Try it → Check → Summary. Every screen fits its container (no scrollbars).
   One primary action, always in the same place (bottom right). */
(function () {
  "use strict";
  const BASE = (document.currentScript && document.currentScript.src.replace(/[^/]+$/, "")) || "../shared/";
  const h = (tag, attrs, ...kids) => {
    const e = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs || {})) {
      if (v == null || v === false) continue;
      if (k === "class") e.className = v; else if (k === "html") e.innerHTML = v;
      else if (k.startsWith("on")) e.addEventListener(k.slice(2), v); else e.setAttribute(k, v === true ? "" : v);
    }
    kids.flat().forEach((c) => c != null && c !== false && e.append(c.nodeType ? c : document.createTextNode(c)));
    return e;
  };
  const toNode = (x) => { if (!x) return null; if (typeof x === "function") x = x(); if (x.nodeType) return x; const t = document.createElement("template"); t.innerHTML = String(x).trim(); return t.content.firstElementChild; };
  const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const FS_ICON = `<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M2 6V2h4M10 2h4v4M14 10v4h-4M6 14H2v-4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  const FS_EXIT = `<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M6 2v4H2M14 6h-4V2M10 14v-4h4M2 10h4v4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

  function logo(name, alt) {
    const ph = h("span", { class: "ph", "aria-hidden": "true" }, alt.split(" ")[0] === "Central" ? "CNM logo" : "IDEA Studio logo");
    const first = { "cnm-logo": "svg", "idea-studio-logo": "png" }[name] || "svg", other = first === "svg" ? "png" : "svg";
    const img = h("img", { src: `${BASE}logos/${name}.${first}`, alt });
    img.addEventListener("error", () => { if (img.src.endsWith("." + first)) img.src = `${BASE}logos/${name}.${other}`; else img.replaceWith(ph); });
    return img;
  }

  function start(L) {
    const steps = [{ kind: "intro", phase: 0 }];
    L.learn.forEach((c, i) => steps.push({ kind: "learn", phase: 0, data: c, i }));
    L.tryIt.forEach((c, i) => steps.push({ kind: "try", phase: 1, data: c, i }));
    L.checks.forEach((c, i) => steps.push({ kind: "check", phase: 2, data: c, i }));
    steps.push({ kind: "summary", phase: 2 });
    const PH = [{ n: "Learn", kind: "learn", total: L.learn.length }, { n: "Try it", kind: "try", total: L.tryIt.length }, { n: "Check", kind: "check", total: L.checks.length }];

    const KEY = "g2-" + L.id;
    let S = { step: 0, max: 0, goals: {}, ans: {} };
    try { const raw = localStorage.getItem(KEY); if (raw) S = Object.assign(S, JSON.parse(raw)); } catch (e) {}
    const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} };
    if (S.step >= steps.length) S.step = 0;

    document.title = L.title;
    const live = h("div", { class: "vh", "aria-live": "polite" });
    const say = (m) => { live.textContent = ""; setTimeout(() => (live.textContent = m), 40); };
    const phaseEls = PH.map((p, i) => {
      const b = h("button", { type: "button" }, p.n);
      b.addEventListener("click", () => { const first = steps.findIndex((s) => s.kind === p.kind); if (first <= S.max) go(first); });
      const el = h("div", { class: "phase" }, h("div", { class: "pl" }, b, h("span", { class: "pc", "aria-hidden": "true" })), h("div", { class: "track", "aria-hidden": "true" }, h("div", { class: "fill" })));
      el._b = b; return el;
    });
    const fsBtn = h("button", { class: "iconbtn", type: "button", html: `${FS_ICON}<span class="t">Full screen</span>`, "aria-label": "Enter full screen" });
    const top = h("header", { class: "top" }, h("div", { class: "top-row" }, h("h1", {}, L.title), fsBtn), h("nav", { class: "phases", "aria-label": "Lesson progress" }, ...phaseEls));
    const stage = h("main", { class: "stage" });
    const back = h("button", { class: "btn ghost", type: "button" }, "← Back");
    const brand = h("div", { class: "brand" }, logo("cnm-logo", "Central New Mexico Community College"), h("span", { class: "sep", "aria-hidden": "true" }), logo("idea-studio-logo", "IDEA Studio"));
    const next = h("button", { class: "btn primary", type: "button", id: "fnext" }, "Continue");
    const app = h("div", { class: "app" }, top, stage, h("footer", { class: "bottom" }, back, brand, next), live);
    document.body.append(app);

    // full screen (falls back to a new tab where the embed doesn't allow it)
    const fsEl = () => document.fullscreenElement || document.webkitFullscreenElement;
    fsBtn.addEventListener("click", async () => {
      if (fsEl()) { (document.exitFullscreen || document.webkitExitFullscreen).call(document); return; }
      const el = document.documentElement, req = el.requestFullscreen || el.webkitRequestFullscreen;
      const can = document.fullscreenEnabled || document.webkitFullscreenEnabled;
      if (req && can) { try { await req.call(el); return; } catch (e) {} }
      window.open(location.href, "_blank", "noopener");
    });
    const fsSync = () => { const on = !!fsEl(); fsBtn.innerHTML = `${on ? FS_EXIT : FS_ICON}<span class="t">${on ? "Exit full screen" : "Full screen"}</span>`; fsBtn.setAttribute("aria-label", on ? "Exit full screen" : "Enter full screen"); };
    document.addEventListener("fullscreenchange", fsSync); document.addEventListener("webkitfullscreenchange", fsSync);

    let onNext = () => go(S.step + 1);
    next.addEventListener("click", () => onNext());
    back.addEventListener("click", () => go(S.step - 1));
    let inlineBtn = null;
    function setNext(label, enabled, fn, style) {
      next.textContent = label; next.disabled = !enabled; next.className = "btn " + (style || "primary"); onNext = fn || (() => go(S.step + 1));
      if (inlineBtn) { inlineBtn.textContent = label; inlineBtn.disabled = !enabled; inlineBtn.className = "btn " + (style || "primary"); }
    }
    // keyboard: arrow keys move between screens (not while using a control that needs arrows)
    document.addEventListener("keydown", (e) => {
      if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      const t = e.target;
      if (t.closest && t.closest('input, textarea, select, [role="slider"], .knobctl, [role="tab"], .drag-el, .visual.zoomed')) return;
      if (e.key === "ArrowRight" && !next.disabled) { e.preventDefault(); next.click(); }
      if (e.key === "ArrowLeft" && !back.disabled) { e.preventDefault(); back.click(); }
    });

    function updateTop() {
      const s = steps[S.step];
      PH.forEach((p, i) => {
        const idxs = steps.map((x, j) => (x.kind === p.kind ? j : -1)).filter((j) => j >= 0);
        const lastIdx = idxs[idxs.length - 1];
        const past = S.step > lastIdx || (p.kind === "check" && s.kind === "summary");
        const cur = s.kind === p.kind ? s.i + 1 : past ? p.total : 0;
        const pct = past ? 100 : Math.round((cur / p.total) * 100);
        phaseEls[i].querySelector(".fill").style.width = pct + "%";
        phaseEls[i].classList.toggle("active", s.phase === i);
        phaseEls[i].classList.toggle("complete", past);
        phaseEls[i].querySelector(".pc").textContent = past ? "✓" : `${cur}/${p.total}`;
        phaseEls[i]._b.disabled = idxs[0] > S.max;
        phaseEls[i]._b.setAttribute("aria-label", `${p.n}: ${past ? "complete" : s.kind === p.kind ? `${cur} of ${p.total}` : "not started"}`);
        if (s.phase === i) phaseEls[i]._b.setAttribute("aria-current", "step"); else phaseEls[i]._b.removeAttribute("aria-current");
      });
      back.disabled = S.step === 0;
    }

    // ---- fit-to-container (no scrollbars) ----
    let curEl = null;
    function fit() {
      if (!curEl) return;
      const W = stage.clientWidth, H = stage.clientHeight;
      Object.assign(curEl.style, { transform: "", width: "", height: "", inset: "" });
      let s = 1;
      for (let k = 0; k < 4; k++) {
        const over = curEl.scrollHeight - curEl.clientHeight;
        if (over <= 1) break;
        s = Math.max(0.6, s * (curEl.clientHeight / curEl.scrollHeight) * 0.99);
        Object.assign(curEl.style, { inset: "0 auto auto 0", width: W / s + "px", height: H / s + "px", transform: `scale(${s})`, transformOrigin: "0 0" });
      }
      curEl.classList.toggle("fitted", s < 1);
    }
    new ResizeObserver(() => requestAnimationFrame(fit)).observe(stage);
    let fitT = 0; const mo = new MutationObserver((ms) => { if (ms.every((m) => m.target.closest && m.target.closest("svg"))) return; clearTimeout(fitT); fitT = setTimeout(fit, 30); });

    function go(i, initial) {
      i = Math.max(0, Math.min(steps.length - 1, i));
      if (curEl && curEl._cleanup) curEl._cleanup();
      inlineBtn = null; app.classList.remove("inline-next");
      S.step = i; S.max = Math.max(S.max, i); save();
      stage.innerHTML = "";
      const s = steps[i];
      curEl = ({ intro, learn, try: tryIt, check, summary })[s.kind](s);
      stage.append(curEl);
      mo.disconnect(); mo.observe(curEl, { childList: true, subtree: true, characterData: true, attributeFilter: ["class", "hidden"] });
      updateTop();
      requestAnimationFrame(() => { fit(); setTimeout(fit, 60); });
      if (!initial) { const h2 = curEl.querySelector("h2"); if (h2) { h2.tabIndex = -1; h2.focus({ preventScroll: true }); } }
    }
    const kick = (cls, t) => h("div", { class: "kicker " + cls }, h("i", { "aria-hidden": "true" }), t);
    const visual = (art, opt = {}) => { const v = h("div", { class: "visual" }); const n = toNode(art); if (n) v.append(n); if (opt.zoom && n) addZoom(v); return v; };
    // learner-controlled zoom: + / − / reset buttons, drag (or arrow keys) to pan, ctrl/⌘ + wheel or pinch to zoom
    function addZoom(v) {
      const svg = v.querySelector("svg.iso"); if (!svg) return;
      let z = 1, cx = null, cy = null;
      const ZS = [1, 1.5, 2.25, 3.25];
      const bIn = h("button", { type: "button", class: "zb", "aria-label": "Zoom in", html: "+" }), bOut = h("button", { type: "button", class: "zb", "aria-label": "Zoom out", html: "−" }), bRe = h("button", { type: "button", class: "zb zr", "aria-label": "Reset zoom", title: "Reset zoom", html: "↺" });
      const hint = h("span", { class: "zhint", "aria-hidden": "true" }, "Drag to look around");
      const ctl = h("div", { class: "zoomctl", role: "group", "aria-label": "Image zoom" }, bIn, bOut, bRe); v.append(ctl, hint);
      v.tabIndex = 0; v.setAttribute("role", "group"); v.setAttribute("aria-label", "Illustration. Use the zoom buttons to look closer; when zoomed in, drag or use the arrow keys to look around.");
      const H = () => svg._home;
      function apply() {
        const Hm = H(); if (!Hm) return;
        const w = Hm[2] / z, hh = Hm[3] / z;
        if (cx == null) { cx = Hm[0] + Hm[2] / 2; cy = Hm[1] + Hm[3] / 2; }
        cx = Math.max(Hm[0] + w / 2, Math.min(Hm[0] + Hm[2] - w / 2, cx)); cy = Math.max(Hm[1] + hh / 2, Math.min(Hm[1] + Hm[3] - hh / 2, cy));
        svg.setAttribute("viewBox", [cx - w / 2, cy - hh / 2, w, hh].map((q) => q.toFixed(1)).join(" "));
        v.classList.toggle("zoomed", z > 1); bOut.disabled = z <= 1; bIn.disabled = z >= ZS[ZS.length - 1]; bRe.hidden = z <= 1;
        const t = v.querySelector(".ctip:not(.pin)"); if (t) t.classList.remove("on"); refreshPins(v);
      }
      const step = (d) => { const i = ZS.findIndex((q) => q >= z - 0.01); z = ZS[Math.max(0, Math.min(ZS.length - 1, i + d))]; apply(); say(z > 1 ? `Zoomed in ${Math.round(z * 100)}%.` : "Zoom reset."); };
      bIn.addEventListener("click", () => step(1)); bOut.addEventListener("click", () => step(-1)); bRe.addEventListener("click", () => { z = 1; cx = cy = null; apply(); say("Zoom reset."); });
      const unit = () => { const Hm = H(), r = svg.getBoundingClientRect(); return Math.max((Hm[2] / z) / r.width, (Hm[3] / z) / r.height); };
      svg.addEventListener("pointerdown", (e) => {
        if (z <= 1 || e.button > 0 || e.target.closest(".hsc, .hs, .knobctl, #tank")) return;
        e.preventDefault(); window.getSelection && window.getSelection().removeAllRanges();
        const x0 = e.clientX, y0 = e.clientY, c0 = [cx, cy], u = unit(); svg.setPointerCapture(e.pointerId); v.classList.add("panning");
        const mv = (ev) => { cx = c0[0] - (ev.clientX - x0) * u; cy = c0[1] - (ev.clientY - y0) * u; apply(); };
        const up = () => { svg.removeEventListener("pointermove", mv); svg.removeEventListener("pointerup", up); svg.removeEventListener("pointercancel", up); v.classList.remove("panning"); };
        svg.addEventListener("pointermove", mv); svg.addEventListener("pointerup", up); svg.addEventListener("pointercancel", up);
      });
      v.addEventListener("wheel", (e) => { if (!(e.ctrlKey || e.metaKey)) return; e.preventDefault(); step(e.deltaY < 0 ? 1 : -1); }, { passive: false });
      v.addEventListener("keydown", (e) => {
        if (e.target !== v) return;
        if (e.key === "+" || e.key === "=") { e.preventDefault(); step(1); return; }
        if (e.key === "-" || e.key === "_") { e.preventDefault(); step(-1); return; }
        if (e.key === "0") { e.preventDefault(); z = 1; cx = cy = null; apply(); return; }
        if (z <= 1) return;
        const d = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }[e.key]; if (!d) return;
        e.preventDefault(); e.stopPropagation(); const Hm = H(); cx += d[0] * Hm[2] / z * 0.15; cy += d[1] * Hm[3] / z * 0.15; apply();
      });
      svg.addEventListener("framed", () => { z = 1; cx = cy = null; apply(); });
      apply();
    }

    function intro() {
      setNext(S.max > 0 ? "Continue" : "Start", true);
      const playChecks = () => { if (!curEl) return; const lis = curEl.querySelectorAll(".objlist li"); lis.forEach((li, i) => setTimeout(() => li.classList.add("on"), 350 + i * 420)); };
      setTimeout(playChecks, 50);
      // replay the check-off every ~7 s while the overview is on screen
      const loop = setInterval(() => {
        const lis = curEl && curEl.querySelectorAll(".objlist li"); if (!lis || !lis.length || !lis[0].isConnected) { clearInterval(loop); return; }
        lis.forEach((li) => li.classList.remove("on")); setTimeout(playChecks, 250);
      }, 7000);
      const resume = S.max > 1 ? h("button", { class: "linkish", type: "button", onclick: () => go(S.max) }, "Resume where you left off") : null;
      const el = h("section", { class: "step" }, kick("", "Overview"), h("h2", {}, L.title), h("div", { class: "intro" },
        visual(L.hero, { zoom: true }),
        h("div", { class: "txt" },
          h("div", { class: "txt-a" }, h("p", { class: "hook" }, L.hook), h("div", { class: "flowline", "aria-label": "Lesson path" }, h("span", {}, `Learn (${L.learn.length})`), h("i", {}, "→"), h("span", {}, "Try it"), h("i", {}, "→"), h("span", {}, `Check (${L.checks.length})`)), resume ? h("p", { style: "margin:8px 0 0" }, resume) : null),
          h("div", { class: "obj" }, h("h3", {}, "You'll be able to"), h("ul", { class: "objlist" }, ...L.objectives.map((o) => h("li", { html: `<svg class="ck" viewBox="0 0 18 18" aria-hidden="true"><rect x="1" y="1" width="16" height="16" rx="5"/><path class="tick" d="M5 9.4l2.7 2.7L13.2 6.4" pathLength="20"/></svg>` + `<span>${o}</span>` })))))));
      el._cleanup = () => clearInterval(loop);
      return el;
    }

    function learn(s) {
      const c = s.data; setNext("Continue", true);
      const el = h("section", { class: "step" }, kick("", `Learn · ${s.i + 1} of ${L.learn.length}`), h("h2", {}, c.title), h("div", { class: "learn" },
        visual(c.art, { zoom: true }),
        h("div", { class: "txt" + (c.aside ? " has-aside" : "") }, h("div", { class: "prose", html: c.html }),
          c.aside ? h("div", { class: "aside " + (c.aside.type || "") }, h("span", { class: "ic", "aria-hidden": "true" }, c.aside.type === "warn" ? "!" : "i"), h("p", { html: c.aside.html })) : null)));
      if (c.after) setTimeout(() => c.after(el), 30);
      return el;
    }

    function tryIt(s) {
      const c = s.data, goals = c.goals || [];
      const done = (S.goals[s.i] = S.goals[s.i] || {});
      const list = h("ul", { class: "goals", "aria-label": "Goals" }, h("li", { class: "gl", "aria-hidden": "true" }, "Goals"));
      const items = goals.map((g) => { const li = h("li", { html: `<svg class="ck" viewBox="0 0 18 18" aria-hidden="true"><rect x="1" y="1" width="16" height="16" rx="5"/><path class="tick" d="M5 9.4l2.7 2.7L13.2 6.4" pathLength="20"/></svg>` + `<span>${g.text}</span><span class="vh gs"></span>` }); list.append(li); return li; });
      let override = null;
      const refresh = () => {
        let all = true;
        goals.forEach((g, k) => { const d = !!done[g.id]; items[k].classList.toggle("done", d); items[k].querySelector(".gs").textContent = d ? " (done)" : " (to do)"; if (!d) all = false; });
        if (override) setNext(override.label, override.enabled !== false, override.fn, override.style || "accent");
        else setNext(all ? "Continue" : "Complete the goals", all, null, all ? "accent" : "primary");
        return all;
      };
      const ctx = {
        done(id) { if (done[id]) return; done[id] = true; save(); const g = goals.find((x) => x.id === id); if (g) say(`Goal complete: ${g.text}`); refresh(); },
        isDone: (id) => !!done[id], say,
        primary(cfg) { override = cfg; refresh(); },
        refit: () => requestAnimationFrame(fit)
      };
      const body = h("div", { style: "flex:1;min-height:0;display:flex;flex-direction:column" });
      const el = h("section", { class: "step" }, kick("k-try", `Try it${L.tryIt.length > 1 ? ` · ${s.i + 1} of ${L.tryIt.length}` : ""}`), h("h2", {}, c.title), c.lede ? h("p", { class: "lede", html: c.lede }) : null, goals.length ? list : null, body);
      const cleanup = c.mount(body, ctx);
      el._cleanup = typeof cleanup === "function" ? cleanup : null;
      refresh();
      return el;
    }

    function check(s) {
      const c = s.data, n = s.i, total = L.checks.length;
      const rec = (S.ans[n] = S.ans[n] || { tries: 0 });
      const opts = c._o || (c._o = shuffle(c.options));
      const dots = h("div", { class: "qdots", "aria-hidden": "true" }, ...L.checks.map((_, k) => h("i", { class: k === n ? "cur" : S.ans[k] && S.ans[k].done ? (S.ans[k].first ? "ok" : "no") : "" })));
      const fs = h("fieldset", { class: "choices" }, h("legend", { html: c.q }));
      const labels = opts.map((o, k) => {
        const inp = h("input", { type: "radio", name: "q" + n, value: String(k) });
        const lab = h("label", { class: "choice" }, inp, h("span", { class: "mark", "aria-hidden": "true" }), h("span", { html: o.t }));
        inp.addEventListener("change", () => { if (rec.done || lab.classList.contains("locked")) return; clearWrong(); setNext("Check answer", true, check, "accent"); });
        fs.append(lab); return lab;
      });
      const fb = h("div", { class: "fb", role: "status", "aria-live": "polite" });
      const lockAll = () => labels.forEach((l) => { l.classList.add("locked"); l.querySelector("input").disabled = true; });
      const nextLabel = n === total - 1 ? "See results" : "Next question";
      function clearWrong() {
        labels.forEach((l) => { if (l.classList.contains("wrong")) { l.classList.remove("wrong"); l.classList.add("dim"); l.querySelector("input").checked = false; } l.classList.remove("shake-no"); });
        if (fb.querySelector(".say.bad")) fb.innerHTML = "";
      }
      function check() {
        const sel = fs.querySelector("input:checked"); if (!sel) return;
        const k = +sel.value, o = opts[k]; rec.tries++;
        if (o.ok) {
          labels[k].classList.add("right"); if (rec.tries === 1) rec.first = true; rec.done = true; save(); lockAll();
          labels.forEach((l, j) => { if (!opts[j].ok) l.classList.add("dim"); });
          fb.innerHTML = `<div class="say ok"><b>${rec.tries === 1 ? "Correct" : "That's it"}</b>${o.fb || ""}</div>`;
          setNext(nextLabel, true, null, "primary"); (inlineBtn || next).focus();
        } else if (rec.tries < 2) {
          // only the wrong pick locks: learners can pick another answer right away, or press Try again
          labels[k].classList.add("wrong", "shake-no", "locked"); sel.disabled = true;
          fb.innerHTML = `<div class="say bad"><b>Not quite</b>${o.fb || ""} Pick another answer.</div>`;
          setNext("Try again", true, () => { clearWrong(); setNext("Check answer", false, check, "accent"); labels.find((l) => !l.classList.contains("locked")).querySelector("input").focus(); }, "retry");
          save(); (inlineBtn || next).focus();
        } else {
          labels[k].classList.add("wrong"); const rk = opts.findIndex((x) => x.ok); labels[rk].classList.add("right");
          rec.done = true; save(); lockAll();
          fb.innerHTML = `<div class="say info"><b>The answer: ${opts[rk].t}</b>${opts[rk].fb || ""}</div>`;
          setNext(nextLabel, true, null, "primary"); (inlineBtn || next).focus();
        }
        requestAnimationFrame(fit);
      }
      if (rec.done) { const rk = opts.findIndex((x) => x.ok); labels[rk].classList.add("right"); lockAll(); labels.forEach((l, j) => { if (j !== rk) l.classList.add("dim"); }); fb.innerHTML = `<div class="say ok"><b>Answered</b>${opts[rk].fb || ""}</div>`; setNext(nextLabel, true); }
      else setNext("Check answer", false, check, "accent");
      inlineBtn = h("button", { type: "button", class: next.className }, next.textContent);
      inlineBtn.disabled = next.disabled; inlineBtn.addEventListener("click", () => onNext());
      app.classList.add("inline-next");
      const col = h("div", { class: "qcol" }, c.scenario ? h("p", { class: "scenario", html: c.scenario }) : null, fs, h("div", { class: "qact" }, fb, inlineBtn));
      return h("section", { class: "step" }, h("div", { class: "qhead" }, kick("k-check", `Check · ${n + 1} of ${total}`), dots), h("h2", { class: "vh" }, `Question ${n + 1} of ${total}`),
        h("div", { class: "qgrid" + (c.art ? " has-vis" : "") }, c.art ? visual(c.art, { zoom: true }) : null, col));
    }

    function summary() {
      const total = L.checks.length, first = L.checks.filter((_, k) => S.ans[k] && S.ans[k].first).length, pct = first / total;
      const R = 38, C = 2 * Math.PI * R;
      const msg = pct === 1 ? "Perfect. You've got this topic down." : pct >= 0.67 ? "Solid work. Review anything that took a second try." : "Good start. Revisit the reads, then retake the check.";
      setNext("Finish", true, () => { say("Topic complete."); next.disabled = true; next.textContent = "Completed ✓"; if (fsEl()) { try { (document.exitFullscreen || document.webkitExitFullscreen).call(document); } catch (e) {} } try { window.parent.postMessage({ type: "guided-complete", id: L.id, score: first, total }, "*"); } catch (e) {} });
      return h("section", { class: "step" }, h("div", { class: "sum" },
        h("div", {}, kick("k-done", "Topic complete"), h("h2", {}, "Nice work."),
          h("div", { class: "score" }, toNode(`<svg class="ring" viewBox="0 0 92 92" aria-hidden="true"><circle cx="46" cy="46" r="${R}" fill="none" stroke="#e8eff9" stroke-width="10"/><circle cx="46" cy="46" r="${R}" fill="none" stroke="${pct >= .67 ? "#0f7b56" : "#f6a724"}" stroke-width="10" stroke-linecap="round" stroke-dasharray="${C * pct} ${C}" transform="rotate(-90 46 46)"/><text x="46" y="52" text-anchor="middle" font-size="19" font-weight="800" fill="#0c1a30" font-family="Inter,system-ui">${Math.round(pct * 100)}%</text></svg>`),
            h("div", {}, h("div", { class: "big" }, `${first} of ${total} first try`), h("div", { class: "sm" }, msg))),
          h("div", { class: "row-btns" },
            h("button", { class: "btn", type: "button", onclick: () => { S.ans = {}; L.checks.forEach((c) => delete c._o); save(); go(steps.findIndex((x) => x.kind === "check")); } }, "Retake check"),
            h("button", { class: "btn", type: "button", onclick: () => go(1) }, "Review"))),
        h("div", {}, h("div", { class: "kicker", style: "color:var(--muted)" }, "Key takeaways"), h("ol", { class: "take" }, ...L.takeaways.map((t, k) => h("li", {}, h("span", { class: "n", "aria-hidden": "true" }, k + 1), h("span", { html: t })))))));
    }

    go(S.step, true);
  }

  // ---------- drag & drop (pointer, touch, keyboard) ----------
  function dnd(cfg) {
    // cfg: { ar, art (svg node), zones:[{id,x,y,w,h,label}], tokens:[{id,label,icon,zone}], onResult(tok, zone, ok), trayLabel }
    const scene = h("div", { class: "scene", style: `--ar:${cfg.ar}` });
    scene.append(cfg.art);
    const main = h("div", { class: "dnd" }, h("div", { class: "scene-wrap" }, scene));
    const tray = h("div", { class: "tray", role: "group", "aria-label": cfg.trayLabel || "Items to place" }, h("div", { class: "tl" }, cfg.trayLabel || "Drag onto the picture"));
    main.append(tray);
    const caption = h("div", { class: "caption info", role: "status", "aria-live": "polite" });
    const wrap = h("div", { class: "frame dnd-frame" }, caption, main);
    wrap._msg = caption;
    if (cfg.intro) UI.say(caption, "info", cfg.intro[0], cfg.intro[1]);
    let sel = null, suppress = false;
    const zoneEls = cfg.zones.map((z) => {
      const b = h("button", { class: "zone" + (z.cls ? " " + z.cls : ""), type: "button", "aria-label": `Drop zone: ${z.label}`, style: z.world || z.box ? "" : `left:${z.x}%;top:${z.y}%;width:${z.w}%;height:${z.h}%` }, z.show === false ? null : h("span", { class: "zl" }, z.label));
      b._z = z; b.addEventListener("click", () => { if (sel) attempt(sel, b); else cfg.onZone && cfg.onZone(z); }); scene.append(b); return b;
    });
    const tokEls = cfg.tokens.map((t) => {
      const b = h("button", { class: "tok", type: "button", "aria-pressed": "false", html: `${t.icon || ""}<span>${t.label}</span>` });
      b._t = t;
      b.addEventListener("click", () => { if (suppress) { suppress = false; return; } if (sel === b) return clear(); clear(); sel = b; b.setAttribute("aria-pressed", "true"); zoneEls.forEach((z) => !z.classList.contains("filled") && z.classList.add("ready")); cfg.say && cfg.say(`${t.label} selected. Choose where it goes.`); });
      let st = null, ghost = null, over = null;
      b.addEventListener("pointerdown", (e) => { if (e.button > 0) return; st = { x: e.clientX, y: e.clientY }; b.setPointerCapture(e.pointerId); });
      b.addEventListener("pointermove", (e) => {
        if (!st) return;
        if (!ghost && Math.hypot(e.clientX - st.x, e.clientY - st.y) > 6) { ghost = b.cloneNode(true); ghost.classList.add("dnd-ghost"); ghost.style.width = b.offsetWidth + "px"; document.body.append(ghost); zoneEls.forEach((z) => !z.classList.contains("filled") && z.classList.add("ready")); }
        if (ghost) { ghost.style.left = e.clientX + "px"; ghost.style.top = e.clientY + "px"; const z = document.elementFromPoint(e.clientX, e.clientY)?.closest(".zone"); if (over && over !== z) over.classList.remove("over"); over = z; if (z) z.classList.add("over"); }
      });
      const end = (e) => {
        if (ghost) { suppress = true; ghost.remove(); ghost = null; const z = document.elementFromPoint(e.clientX, e.clientY)?.closest(".zone"); zoneEls.forEach((x) => x.classList.remove("over", "ready")); if (z) attempt(b, z); setTimeout(() => (suppress = false), 50); }
        st = null; over = null;
      };
      b.addEventListener("pointerup", end); b.addEventListener("pointercancel", end);
      tray.append(b); return b;
    });
    function clear() { if (sel) sel.setAttribute("aria-pressed", "false"); sel = null; zoneEls.forEach((z) => z.classList.remove("ready")); }
    function attempt(tb, zb) {
      if (zb.classList.contains("filled")) return;
      const t = tb._t, z = zb._z;
      clear();
      if (cfg.free) { cfg.onResult && cfg.onResult(t, z, true); return; }
      const ok = t.zone === z.id;
      if (ok) {
        tb.classList.add("placed");
        if (z.multi) { zb.querySelector(".zl")?.remove(); let lst = zb.querySelector(".zlist"); if (!lst) { lst = h("span", { class: "zlist" }); zb.prepend(h("span", { class: "zt" }, z.label), lst); } lst.append(h("span", { class: "zchip" }, t.label)); zb.classList.add("has"); }
        else { zb.classList.add("filled"); zb.innerHTML = `<span class="tok">${t.icon || ""}<span>${t.label}</span></span>`; zb.setAttribute("aria-label", `${z.label}: ${t.label}, correct`); if (cfg.hideFilled) { zb.style.visibility = "hidden"; zb.tabIndex = -1; } }
      } else { zb.classList.remove("shake"); void zb.offsetWidth; zb.classList.add("shake"); tb.classList.remove("shake-no"); void tb.offsetWidth; tb.classList.add("shake-no"); tb.focus(); }
      cfg.onResult && cfg.onResult(t, z, ok);
      if (ok && tokEls.every((x) => !x._t.zone || x.classList.contains("placed"))) { tokEls.forEach((x) => { if (!x._t.zone) { x.disabled = true; x.classList.add("spare"); } }); cfg.onDone && cfg.onDone(); }
    }
    const place = () => {
      const vb = cfg.art._home; if (!vb) return;
      scene.style.setProperty("--ar", vb[2] / vb[3]);
      zoneEls.forEach((b) => { const z = b._z;
        if (z.box) { const [x, y, w, hh] = z.box; Object.assign(b.style, { left: ((x - vb[0]) / vb[2]) * 100 + "%", top: ((y - vb[1]) / vb[3]) * 100 + "%", width: (w / vb[2]) * 100 + "%", height: (hh / vb[3]) * 100 + "%" }); return; }
        if (!z.world) return; const pts = z.world.map(ISO.P); const xs = pts.map((q) => q[0]), ys = pts.map((q) => q[1]);
        const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
        Object.assign(b.style, { left: ((x0 - vb[0]) / vb[2]) * 100 + "%", top: ((y0 - vb[1]) / vb[3]) * 100 + "%", width: ((x1 - x0) / vb[2]) * 100 + "%", height: ((y1 - y0) / vb[3]) * 100 + "%" }); });
    };
    cfg.art.addEventListener("framed", place); place();
    wrap._tokens = tokEls; wrap._zones = zoneEls;
    return wrap;
  }

  function tryLayout(el, art, opt = {}) {
    const vis = h("div", { class: "visual" }, art);
    if (opt.legend) vis.append(h("div", { class: "vlegend", "aria-hidden": "true", html: opt.legend }));
    const msg = h("div", { class: "caption info", role: "status", "aria-live": "polite" });
    const side = h("div", { class: "frame-side" });
    const main = h("div", { class: "frame-main" }, vis, side);
    el.append(h("div", { class: "frame" }, msg, main)); // feedback sits at the top of the frame, right under the instructions
    return { vis, msg, side };
  }
  function pop(vis, svg, x, y, html, opt = {}) {
    let p = vis.querySelector(".pop");
    if (!html) { if (p) p.remove(); return; }
    if (!p) { p = h("div", { class: "pop", role: "status", "aria-live": "polite" }); vis.append(p); }
    p.innerHTML = html; p.className = "pop" + (opt.kind ? " " + opt.kind : "");
    const place = () => {
      const m = svg.getScreenCTM(); if (!m) return;
      const pt = new DOMPoint(x, y).matrixTransform(m), r = vis.getBoundingClientRect();
      let left = pt.x - r.left, top = pt.y - r.top;
      const w = p.offsetWidth, hh = p.offsetHeight;
      const below = top - hh - 16 < 6;
      p.classList.toggle("below", below);
      const lx = Math.max(8, Math.min(r.width - w - 8, left - w / 2));
      p.style.left = lx + "px"; p.style.top = (below ? top + 16 : top - hh - 16) + "px";
      p.style.setProperty("--ax", (left - lx) + "px");
    };
    place(); requestAnimationFrame(place);
    p.classList.remove("in"); void p.offsetWidth; p.classList.add("in");
    return p;
  }
  // callout tips: any .hsc[data-tip] shows an HTML label beside its marker on hover / focus.
  // Clicking (or Enter/Space on) a free callout pins its label on; clicking again unpins it. Several can be pinned at once.
  // Bound callouts (g._bound, e.g. the faucet parts game) manage their own selection and stay hover-only.
  const rectsHit = (a, b) => a.l < b.l + b.w && b.l < a.l + a.w && a.t < b.t + b.h && b.t < a.t + a.h;
  function placeTip(t, g) {
    const vis = g.closest(".visual"); if (!vis) return false;
    const c = g.querySelector(".hsc-c"), m = c && c.getScreenCTM(); if (!m) return false;
    const r = +c.getAttribute("r"), pt = new DOMPoint(+c.getAttribute("cx"), +c.getAttribute("cy")).matrixTransform(m), vr = vis.getBoundingClientRect();
    const rad = r * m.a, w = t.offsetWidth, hh = t.offsetHeight, cx = pt.x - vr.left, cy = pt.y - vr.top;
    const sr = g.ownerSVGElement.getBoundingClientRect();
    const inView = pt.x >= sr.left && pt.x <= sr.right && pt.y >= sr.top && pt.y <= sr.bottom;
    t.classList.toggle("off", !inView); if (!inView) return true;
    const others = [...vis.querySelectorAll(".ctip.pin.on")].filter((o) => o !== t && !o.classList.contains("off")).map((o) => ({ l: o.offsetLeft, t: o.offsetTop, w: o.offsetWidth, h: o.offsetHeight }));
    const fit = (l, tp) => ({ l: Math.max(8, Math.min(vr.width - w - 8, l)), t: Math.max(6, Math.min(vr.height - hh - 6, tp)), w, h: hh });
    const cands = [fit(cx + rad + 10, cy - hh / 2), fit(cx - rad - 10 - w, cy - hh / 2), fit(cx - w / 2, cy + rad + 8), fit(cx - w / 2, cy - rad - 8 - hh)];
    // avoid other pinned labels, every marker, and every leader line in this picture
    const svgEl = g.ownerSVGElement, toV = (M, x, y) => { const p = new DOMPoint(x, y).matrixTransform(M); return [p.x - vr.left, p.y - vr.top]; };
    const segs = [], dots = [];
    svgEl.querySelectorAll(".hsc").forEach((o) => {
      const pth = o.querySelector("path"), cc = o.querySelector(".hsc-c");
      if (cc) { const M2 = cc.getScreenCTM(); if (M2) { const [x, y] = toV(M2, +cc.getAttribute("cx"), +cc.getAttribute("cy")); dots.push({ l: x - rad - 3, t: y - rad - 3, w: 2 * rad + 6, h: 2 * rad + 6 }); } }
      if (pth) { const M2 = pth.getScreenCTM(), nums = (pth.getAttribute("d").match(/-?[\d.]+/g) || []).map(Number); const pts = []; for (let i = 0; i + 1 < nums.length; i += 2) pts.push(toV(M2, nums[i], nums[i + 1])); for (let i = 0; i + 1 < pts.length; i++) segs.push([pts[i], pts[i + 1]]); }
    });
    const segHit = (q, [a, b]) => { const x0 = Math.min(a[0], b[0]), x1 = Math.max(a[0], b[0]), y0 = Math.min(a[1], b[1]), y1 = Math.max(a[1], b[1]); return x1 >= q.l - 2 && x0 <= q.l + q.w + 2 && y1 >= q.t - 2 && y0 <= q.t + q.h + 2; };
    const score = (q) => others.filter((o) => rectsHit(q, o)).length * 100 + dots.filter((d) => rectsHit(q, d)).length * 10 + segs.filter((sg) => segHit(q, sg)).length;
    const extra = [fit(cx + rad + 10, cy - hh - 4), fit(cx + rad + 10, cy + 4), fit(cx - rad - 10 - w, cy - hh - 4), fit(cx - rad - 10 - w, cy + 4)];
    const all = cands.concat(extra), q = all.reduce((best, c) => (score(c) < score(best) ? c : best), all[0]);
    t.style.left = q.l + "px"; t.style.top = q.t + "px"; return true;
  }
  function showTip(g) {
    const vis = g.closest(".visual"); if (!vis || !g.ownerSVGElement) return;
    if (g._pin) return; // already showing as a pinned label
    let t = vis.querySelector(".ctip:not(.pin)"); if (!t) { t = document.createElement("div"); t.className = "ctip"; t.setAttribute("aria-hidden", "true"); vis.append(t); }
    t.textContent = g.dataset.tip; t.classList.add("on"); t._for = g; placeTip(t, g);
  }
  function hideTip(g) { const vis = g.closest(".visual"); const t = vis && vis.querySelector(".ctip:not(.pin)"); if (!t) return; const sel = g._bound && vis.querySelector(".hsc.sel[data-tip]"); if (sel) showTip(sel); else t.classList.remove("on"); }
  function pinTip(g, on) {
    const vis = g.closest(".visual"); if (!vis) return;
    if (on && !g._pin) { const t = document.createElement("div"); t.className = "ctip pin on"; t.setAttribute("aria-hidden", "true"); t.textContent = g.dataset.tip; t._for = g; vis.append(t); g._pin = t; placeTip(t, g); const hv = vis.querySelector(".ctip:not(.pin)"); if (hv && hv._for === g) hv.classList.remove("on"); }
    if (!on && g._pin) { g._pin.remove(); g._pin = null; }
    g.classList.toggle("pinned", !!on); g.setAttribute("aria-pressed", on ? "true" : "false");
  }
  function refreshPins(vis) { vis.querySelectorAll(".ctip.pin").forEach((t) => placeTip(t, t._for)); }
  window.addEventListener("resize", () => document.querySelectorAll(".visual").forEach(refreshPins));
  document.addEventListener("pointerover", (e) => { const g = e.target.closest && e.target.closest(".hsc[data-tip]"); if (g) { showTip(g); g.classList.add("seen"); } });
  document.addEventListener("pointerout", (e) => { const g = e.target.closest && e.target.closest(".hsc[data-tip]"); if (g && !g.contains(e.relatedTarget)) hideTip(g); });
  document.addEventListener("focusin", (e) => { const g = e.target.closest && e.target.closest(".hsc[data-tip]"); if (g) { showTip(g); if (e.target.matches(":focus-visible")) g.classList.add("seen"); } });
  document.addEventListener("focusout", (e) => { const g = e.target.closest && e.target.closest(".hsc[data-tip]"); if (g) hideTip(g); });
  document.addEventListener("click", (e) => { const g = e.target.closest && e.target.closest(".hsc[data-tip]"); if (!g) return; if (g._bound) { if (g.classList.contains("sel")) showTip(g); return; } g.classList.add("seen"); pinTip(g, !g._pin); if (!g._pin) showTip(g); });
  document.addEventListener("keydown", (e) => { const g = e.target.closest && e.target.closest(".hsc[data-tip]"); if (g && !g._bound && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); g.dispatchEvent(new MouseEvent("click", { bubbles: true })); } });
  const UI = { h, toNode, shuffle, dnd, tryLayout, pop, showTip, say(el, kind, title, body) {
      const cap = el.classList.contains("caption");
      el.className = (cap ? "caption " : "say ") + (kind || "");
      el.innerHTML = cap ? `<span class="cap-ic" aria-hidden="true">${{ ok: "✓", bad: "!", warn: "!", info: "i" }[kind] || "i"}</span><div><b>${title}</b> ${body || ""}</div>` : `<b>${title}</b>${body || ""}`;
      if (cap) { void el.offsetWidth; el.classList.add("flash"); }
    } };
  window.Guided = { start, UI };
})();
