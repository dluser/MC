/* ISO: isometric technical-illustration toolkit.
   Shapes are defined in 3D (x right-back, y left-back, z up), projected to 30° isometric,
   cel-shaded from a fixed light, outlined in navy line art. Parts can be re-rendered with new
   parameters (lever angles, explode offsets) for animation. Camera pans/zooms via viewBox. */
(function () {
  "use strict";
  const C = 0.8660254, S = 0.5;
  const INK = "#0b3b7a";
  const PAL = {
    steel: ["#ffffff", "#e8f1fc", "#c6dcf5", "#9dc0ea"],
    blue: ["#d9e9fc", "#aecdf3", "#77abe9", "#4686d8"],
    deep: ["#6c9ad6", "#4a7cc2", "#335fa3", "#24467e"],
    orange: ["#ffd7b8", "#ffab70", "#ff7a2e", "#e05a10"],
    beer: ["#ffe9ab", "#ffcb52", "#f6a724", "#d8870d"],
    dark: ["#7d8aa3", "#56637c", "#3b4660", "#283247"],
    white: ["#ffffff", "#f7faff", "#ebf2fc", "#dbe7f7"],
    red: ["#ffd0d0", "#ff9a9a", "#ec5a5f", "#c7333a"],
    green: ["#d4f5e5", "#9fe3c4", "#4fc493", "#2a9a6c"],
    brass: ["#fbe7b0", "#eecb72", "#d7a93f", "#b5852a"],
    glass: ["#ffffff", "#f4f9ff", "#e6f1fd", "#d6e7fb"],
    kraft: ["#f6e2bd", "#e6c48d", "#cfa262", "#a97d42"],
    stale: ["#eee2c6", "#d8c49a", "#b9a173", "#8c7650"],
    rubber: ["#8a94a6", "#5c6679", "#3f4859", "#272e3b"],
    wood: ["#f4dbb4", "#e2b984", "#c99557", "#9f6f38"],
    bottle: ["#e3f3e6", "#bfe0c6", "#8cc29a", "#5e9a6e"]
  };
  const norm = (a) => { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };
  const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
  const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
  const mul = (a, k) => [a[0] * k, a[1] * k, a[2] * k];
  const L = norm([-0.25, 0.55, 0.8]);
  const VIEW = norm([1, 1, 1]);
  const f1 = (n) => Math.round(n * 10) / 10;
  let SWK = 1;

  const P = (p) => [(p[0] - p[1]) * C, (p[0] + p[1]) * S - p[2]];
  const tone = (pal, n) => { const b = dot(n, L); return b > 0.62 ? pal[0] : b > 0.3 ? pal[1] : b > -0.3 ? pal[2] : pal[3]; };
  const pal = (p) => (typeof p === "string" ? PAL[p] : p);
  const dpoly = (pts) => "M" + pts.map((q) => f1(q[0]) + " " + f1(q[1])).join("L") + "Z";
  function smoothD(pts) {
    if (pts.length < 3) return "M" + pts.map((q) => f1(q[0]) + " " + f1(q[1])).join("L");
    let d = `M${f1(pts[0][0])} ${f1(pts[0][1])}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
      d += `C${f1(p1[0] + (p2[0] - p0[0]) / 6)} ${f1(p1[1] + (p2[1] - p0[1]) / 6)} ${f1(p2[0] - (p3[0] - p1[0]) / 6)} ${f1(p2[1] - (p3[1] - p1[1]) / 6)} ${f1(p2[0])} ${f1(p2[1])}`;
    }
    return d;
  }
  function hull(pts) {
    const p = pts.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    const cr = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
    const lo = [], up = [];
    for (const q of p) { while (lo.length >= 2 && cr(lo[lo.length - 2], lo[lo.length - 1], q) <= 0) lo.pop(); lo.push(q); }
    for (let i = p.length - 1; i >= 0; i--) { const q = p[i]; while (up.length >= 2 && cr(up[up.length - 2], up[up.length - 1], q) <= 0) up.pop(); up.push(q); }
    up.pop(); lo.pop(); return lo.concat(up);
  }
  function basis(a) { a = norm(a); const t = Math.abs(a[2]) < 0.9 ? [0, 0, 1] : [1, 0, 0]; const u = norm(cross(a, t)); const v = cross(a, u); return [a, u, v]; }

  // ---------- primitives ----------
  function cyl(o, a, r, h, p, opt = {}) {
    p = pal(p); const [A, u, v] = basis(a); const r1 = opt.r1 != null ? opt.r1 : r, N = opt.n || 44;
    const top = add(o, mul(A, h));
    const ring = (c, R) => { const out = []; for (let i = 0; i < N; i++) { const t = (i / N) * 2 * Math.PI; out.push(add(c, add(mul(u, R * Math.cos(t)), mul(v, R * Math.sin(t))))); } return out; };
    const R0 = ring(o, r).map(P), R1 = ring(top, r1).map(P);
    const sw = (opt.sw != null ? opt.sw : 2) * SWK, st = opt.stroke || INK, op = opt.opacity != null ? opt.opacity : 1;
    const fop = op < 1 ? ` fill-opacity="${op}"` : "";
    let s = `<path d="${dpoly(hull(R0.concat(R1)))}" fill="${p[2]}"${fop}/>`;
    // shaded bands on the visible side
    const tones = [];
    for (let i = 0; i < N; i++) { const t = (i / N) * 2 * Math.PI; const n = add(mul(u, Math.cos(t)), mul(v, Math.sin(t))); tones.push(dot(n, VIEW) > -0.05 ? tone(p, n) : null); }
    let start = tones.findIndex((t, i) => t !== null && tones[(i - 1 + N) % N] !== tones[i]);
    if (start < 0) start = 0;
    for (let k = 0; k < N;) {
      const i = (start + k) % N, tn = tones[i];
      let j = k; while (j + 1 < N && tones[(start + j + 1) % N] === tn) j++;
      if (tn) {
        const idx = []; for (let m = k; m <= j + 1; m++) idx.push((start + m) % N);
        const poly = idx.map((q) => R0[q]).concat(idx.slice().reverse().map((q) => R1[q]));
        s += `<path d="${dpoly(poly)}" fill="${tn}"${fop}/>`;
      }
      k = j + 1;
    }
    // visible cap
    const capTop = dot(A, VIEW) > 0;
    const capN = capTop ? A : mul(A, -1), capR = capTop ? R1 : R0;
    const cp = opt.capPal ? pal(opt.capPal) : p;
    if (!opt.noCap) s += `<path d="${dpoly(capR)}" fill="${tone(cp, capN)}"${fop} stroke="${st}" stroke-width="${sw}" stroke-linejoin="round"/>`;
    if (opt.hole) { const H = ring(capTop ? top : o, opt.hole).map(P); s += `<path d="${dpoly(H)}" fill="${opt.holeFill || p[3]}" stroke="${st}" stroke-width="${sw * 0.8}"/>`; }
    if (opt.noCap) { // outline only the silhouette sides + the lower visible rim, so stacked segments read as one surface
      const sides = []; for (let i = 0; i < N; i++) { const t = (i / N) * 2 * Math.PI; const n = add(mul(u, Math.cos(t)), mul(v, Math.sin(t))); sides.push(dot(n, VIEW) > -0.05); }
      const iL = [...Array(N).keys()].filter((i) => sides[i] && !sides[(i - 1 + N) % N])[0], iR = [...Array(N).keys()].filter((i) => sides[i] && !sides[(i + 1) % N])[0];
      if (iL != null && iR != null) s += `<path d="M${f1(R0[iL][0])} ${f1(R0[iL][1])} L${f1(R1[iL][0])} ${f1(R1[iL][1])} M${f1(R0[iR][0])} ${f1(R0[iR][1])} L${f1(R1[iR][0])} ${f1(R1[iR][1])}" stroke="${st}" stroke-width="${sw}" fill="none"/>`;
      if (opt.rim) { const idx = []; for (let k = iL; ; k = (k + 1) % N) { idx.push(k); if (k === iR) break; } s += `<path d="M${idx.map((q) => f1(R0[q][0]) + " " + f1(R0[q][1])).join(" L")}" stroke="${st}" stroke-width="${sw * 0.7}" fill="none" stroke-opacity=".55"/>`; }
    } else s += `<path d="${dpoly(hull(R0.concat(R1)))}" fill="none" stroke="${st}" stroke-width="${sw}" stroke-linejoin="round"/>`;
    return `<g${opt.cls ? ` class="${opt.cls}"` : ""}${opt.attrs ? " " + opt.attrs : ""}>${s}</g>`;
  }
  function box(o, size, p, opt = {}) {
    p = pal(p); const [w, d, h] = size; const xf = opt.xf || ((q) => q);
    const v = [[0, 0, 0], [w, 0, 0], [w, d, 0], [0, d, 0], [0, 0, h], [w, 0, h], [w, d, h], [0, d, h]].map((q) => xf(add(o, q)));
    const faces = [[4, 5, 6, 7], [0, 3, 2, 1], [1, 2, 6, 5], [0, 4, 7, 3], [3, 7, 6, 2], [0, 1, 5, 4]];
    const sw = (opt.sw != null ? opt.sw : 2) * SWK, fop = opt.opacity != null && opt.opacity < 1 ? ` fill-opacity="${opt.opacity}"` : "";
    let s = "";
    faces.forEach((F) => {
      const n = norm(cross(sub(v[F[1]], v[F[0]]), sub(v[F[3]], v[F[0]])));
      if (dot(n, VIEW) <= 0.001) return;
      s += `<path d="${dpoly(F.map((i) => P(v[i])))}" fill="${opt.fill || tone(p, n)}"${fop} stroke="${opt.stroke || INK}" stroke-width="${sw}" stroke-linejoin="round"/>`;
    });
    return `<g${opt.cls ? ` class="${opt.cls}"` : ""}>${s}</g>`;
  }
  function tube(pts3, r, opt = {}) {
    const d = smoothD(pts3.map(P));
    const fill = opt.fill || "#eef6ff", op = opt.opacity != null ? opt.opacity : 1;
    const svg = `<path d="${d}" fill="none" stroke="${opt.stroke || INK}" stroke-width="${2 * r + 3.4}" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="${d}" fill="none" stroke="${fill}" stroke-opacity="${op}" stroke-width="${2 * r}" stroke-linecap="round" stroke-linejoin="round"/>
      ${opt.noHi ? "" : `<path d="${d}" fill="none" stroke="#fff" stroke-opacity=".75" stroke-width="${Math.max(1.2, r * 0.42)}" stroke-linecap="round" transform="translate(${f1(-r * 0.25)} ${f1(-r * 0.45)})"/>`}`;
    return { svg, d };
  }
  function poly(pts3, fill, opt = {}) { return `<path d="${dpoly(pts3.map(P))}" fill="${fill}" ${opt.op ? `fill-opacity="${opt.op}"` : ""} stroke="${opt.stroke || INK}" stroke-width="${opt.sw != null ? opt.sw : 2}" stroke-linejoin="round" ${opt.dash ? `stroke-dasharray="${opt.dash}"` : ""}/>`; }
  function line(a, b, opt = {}) { const A = P(a), B = P(b); return `<line x1="${f1(A[0])}" y1="${f1(A[1])}" x2="${f1(B[0])}" y2="${f1(B[1])}" stroke="${opt.stroke || INK}" stroke-width="${opt.sw || 1.5}" ${opt.dash ? `stroke-dasharray="${opt.dash}"` : ""} stroke-linecap="round" ${opt.op ? `opacity="${opt.op}"` : ""}/>`; }
  function grid(cx, cy, n, step, op) {
    let s = '<g class="bggrid" aria-hidden="true">'; const e = n * step;
    for (let i = -n; i <= n; i++) { s += line([i * step + cx, -e + cy, 0], [i * step + cx, e + cy, 0], { stroke: "#9cc3f0", sw: 1, op: op || 0.35, dash: "2 6" }); s += line([-e + cx, i * step + cy, 0], [e + cx, i * step + cy, 0], { stroke: "#9cc3f0", sw: 1, op: op || 0.35, dash: "2 6" }); }
    return s + "</g>";
  }
  function slab(o, size, opt = {}) { return box(o, size, opt.pal || "blue", { sw: 2 }); }
  function rotY(pivot, ang) { const c = Math.cos(ang), s = Math.sin(ang); return (q) => { const d = sub(q, pivot); return add(pivot, [c * d[0] + s * d[2], d[1], -s * d[0] + c * d[2]]); }; }
  function rotX(pivot, ang) { const c = Math.cos(ang), s = Math.sin(ang); return (q) => { const d = sub(q, pivot); return add(pivot, [d[0], c * d[1] - s * d[2], s * d[1] + c * d[2]]); }; }

  // ---------- annotation ----------
  function callout(anchor3, at2, n, opt = {}) {
    const A = Array.isArray(anchor3) && anchor3.length === 3 ? P(anchor3) : anchor3;
    return `<g class="callout" aria-hidden="true"><path d="M${f1(A[0])} ${f1(A[1])} L${f1(at2[0])} ${f1(A[1])} L${f1(at2[0])} ${f1(at2[1])}" fill="none" stroke="${INK}" stroke-width="1.6"/>
      <circle cx="${f1(A[0])}" cy="${f1(A[1])}" r="3.6" fill="${INK}" stroke="#fff" stroke-width="1.5"/>
      <circle cx="${f1(at2[0])}" cy="${f1(at2[1])}" r="${opt.r || 12}" fill="#fff" stroke="${INK}" stroke-width="2"/>
      <text x="${f1(at2[0])}" y="${f1(at2[1]) + 4.6}" text-anchor="middle" font-family="Inter,system-ui" font-size="${opt.fs || 13}" font-weight="700" fill="${INK}">${n}</text></g>`;
  }
  function label(x, y, text, opt = {}) {
    const fs = opt.fs || 12.5, w = text.length * fs * 0.58 + 18, h = fs + 12;
    const bg = opt.bg || "#ffffff", fg = opt.fg || INK, x0 = opt.anchor === "start" ? x : opt.anchor === "end" ? x - w : x - w / 2;
    return `<g class="lbl" aria-hidden="true"${opt.id ? ` id="${opt.id}"` : ""}><rect x="${f1(x0)}" y="${f1(y - h / 2)}" width="${f1(w)}" height="${h}" rx="${h / 2}" fill="${bg}" stroke="${opt.stroke || INK}" stroke-width="${opt.sw != null ? opt.sw : 1.6}"/><text x="${f1(x0 + w / 2)}" y="${f1(y + fs * 0.36)}" text-anchor="middle" font-family="Inter,system-ui" font-size="${fs}" font-weight="700" fill="${fg}">${text}</text></g>`;
  }
  function hotspot(id, x, y, aria, opt = {}) {
    const r = opt.r || 20;
    return `<g class="hs${opt.off ? " off" : ""}" data-hs="${id}" tabindex="0" role="button" aria-label="${aria}" transform="translate(${f1(x)} ${f1(y)})">
      <circle class="hs-hit" r="${r + 14}" fill="transparent"/><circle class="hs-ring" r="${r}"/><circle class="hs-ring2" r="${r}"/><circle class="hs-core" r="5"/>
      ${opt.hint ? `<g class="hs-hint"><rect x="${opt.hx || r + 8}" y="-13" width="${opt.hint.length * 7.4 + 18}" height="26" rx="13"/><text x="${(opt.hx || r + 8) + 9}" y="4.5">${opt.hint}</text></g>` : ""}</g>`;
  }
  function gauge(c, a, r, frac, opt = {}) {
    const [A] = basis(a); const w0 = sub([0, 0, 1], mul(A, dot([0, 0, 1], A))); const w = norm(Math.hypot(...w0) < 0.1 ? [0, -1, 0] : w0); const rt = cross(A, w);
    let s = cyl(sub(c, mul(A, 4)), A, r + 2.5, 4, "steel", { capPal: "white", sw: 1.8 });
    const at = (ang, k) => P(add(c, add(mul(rt, Math.sin(ang) * r * k), mul(w, Math.cos(ang) * r * k))));
    for (let i = 0; i <= 6; i++) { const ang = ((-135 + i * 45) * Math.PI) / 180; const p1 = at(ang, 0.68), p2 = at(ang, 0.86); s += `<line x1="${f1(p1[0])}" y1="${f1(p1[1])}" x2="${f1(p2[0])}" y2="${f1(p2[1])}" stroke="${INK}" stroke-width="1.4"/>`; }
    const ang = ((-135 + 270 * Math.max(0, Math.min(1, frac))) * Math.PI) / 180; const hub = at(0, 0), tip = at(ang, 0.78);
    s += `<line class="needle" x1="${f1(hub[0])}" y1="${f1(hub[1])}" x2="${f1(tip[0])}" y2="${f1(tip[1])}" stroke="#e5484d" stroke-width="${opt.nw || 2.4}" stroke-linecap="round"/><circle cx="${f1(hub[0])}" cy="${f1(hub[1])}" r="2.4" fill="${INK}"/>`;
    return s;
  }

  // ---------- components ----------
  const parts = {};
  // a dark slot cut into a cylinder wall (axis z): angle t (rad), half-width dt, z range
  function slot(c, r, t, dt, z0, z1, fill) {
    const pts = []; const n = 6;
    for (let i = 0; i <= n; i++) { const a = t - dt + (2 * dt * i) / n; pts.push(add(c, [r * Math.cos(a), r * Math.sin(a), z0])); }
    for (let i = n; i >= 0; i--) { const a = t - dt + (2 * dt * i) / n; pts.push(add(c, [r * Math.cos(a), r * Math.sin(a), z1])); }
    return `<path d="${smoothClosed(pts.map(P))}" fill="${fill || "#24467e"}" stroke="${INK}" stroke-width="${1.4 * SWK}"/>`;
  }
  function smoothClosed(p2) { return "M" + p2.map((q) => f1(q[0]) + " " + f1(q[1])).join(" L") + " Z"; }
  parts.tank = (o, opt = {}) => {
    const r = opt.r || 26, h = opt.h || 150, p = opt.pal || "blue";
    let s = cyl(o, [0, 0, 1], r + 1.5, 7, "dark", { sw: 1.8 }); // foot ring
    s += cyl(add(o, [0, 0, 5]), [0, 0, 1], r, h - 21, p);
    s += cyl(add(o, [0, 0, h - 16]), [0, 0, 1], r, 14, p, { r1: r * 0.55 });
    s += cyl(add(o, [0, 0, h - 4]), [0, 0, 1], 9, 5, "dark", { sw: 1.6 }); // neck collar
    s += cyl(add(o, [0, 0, h - 2]), [0, 0, 1], 6.5, 9, "brass", { sw: 1.6 });
    s += box(add(o, [-6, -6, h + 6]), [12, 12, 9], "brass", { sw: 1.8 });
    s += cyl(add(o, [0, 0, h + 15]), [0, 0, 1], 2.6, 3, "brass", { sw: 1.2 });
    s += cyl(add(o, [0, 0, h + 17]), [0, 0, 1], 12, 3.5, "dark", { sw: 1.6, hole: 8, holeFill: PAL.dark[0] }); // handwheel
    const c = add(o, [0, 0, h + 20.5]);
    for (let i = 0; i < 3; i++) { const a = (i * 2 * Math.PI) / 3 + 0.3; s += line(c, add(c, [8 * Math.cos(a), 8 * Math.sin(a), 0]), { sw: 2.4, stroke: PAL.dark[3] }); }
    s += cyl(c, [0, 0, 1], 3, 1.5, "dark", { sw: 1.2 });
    return s;
  };
  parts.tankSide = (o, opt = {}) => { // lying along +x
    // lying down, the lit upper face would read as near-white; shift the ramp one step darker so it matches an upright cylinder
    const r = opt.r || 24, h = opt.h || 140, p = opt.pal || ["#aecdf3", "#77abe9", "#5b97df", "#3b78c9"];
    return cyl(add(o, [0, 0, r]), [1, 0, 0], r + 1.5, 7, "dark", { sw: 1.8 }) + cyl(add(o, [6, 0, r]), [1, 0, 0], r, h - 20, p) +
      cyl(add(o, [h - 14, 0, r]), [1, 0, 0], r, 14, p, { r1: r * 0.55 }) + cyl(add(o, [h, 0, r]), [1, 0, 0], 8, 5, "dark", { sw: 1.6 }) +
      cyl(add(o, [h + 4, 0, r]), [1, 0, 0], 6, 12, "brass", { sw: 1.6 });
  };
  // Sankey keg drawn as a surface of revolution: one smooth silhouette + front-facing details, so it stays clean at any size.
  // In isometric view a horizontal circle of radius r at height z projects to an ellipse rx = 1.2247r, ry = 0.7071r centred at (0, −z).
  let KEGID = 0;
  parts.keg = (o, opt = {}) => {
    const r = opt.r || 58, h = opt.h || 150, ghost = !!opt.ghost, pal = PAL[opt.pal || "steel"] || PAL.steel;
    const KX = 1.2247, KY = 0.7071, O = P(o), id = "kg" + (++KEGID), sw = 2 * SWK;
    const sk = Math.max(8, h * 0.075), ch = Math.max(11, h * 0.1), rc = r * 0.94, bulge = r * 1.035;
    // profile r(z), bottom → top
    const prof = [];
    const N = 72, ringH = Math.max(3, h * 0.035), bump = Math.max(1, r * 0.035);
    const zr = [sk + (h - sk - ch) * 0.22, sk + (h - sk - ch) * 0.78];
    for (let i = 0; i <= N; i++) {
      const z = (h * i) / N; let rr;
      if (z <= sk) rr = rc;
      else if (z >= h - ch) rr = rc;
      else { const zb = sk + h * 0.03, zt = h - ch - h * 0.03;
        if (z < zb) rr = rc + (r - rc) * ((z - sk) / (zb - sk));
        else if (z > zt) rr = r + (rc - r) * ((z - zt) / (h - ch - zt));
        else { const k = (z - zb) / (zt - zb); rr = r + (bulge - r) * Math.sin(Math.PI * k); } }
      zr.forEach((q) => { const d = Math.abs(z - q) / (ringH / 2); if (d < 1) rr += bump * Math.sqrt(1 - d * d); });
      prof.push([rr, z]);
    }
    const X = (rr) => rr * KX, pt = (x, y) => `${f1(O[0] + x)} ${f1(O[1] + y)}`;
    const sil = (pp) => { const b = pp[0], t = pp[pp.length - 1];
      let d = `M${pt(-X(b[0]), -b[1])}`; pp.forEach(([rr, z]) => { d += ` L${pt(-X(rr), -z)}`; });
      d += ` A${f1(X(t[0]))} ${f1(KY * t[0])} 0 0 1 ${pt(X(t[0]), -t[1])}`;
      for (let i = pp.length - 1; i >= 0; i--) d += ` L${pt(X(pp[i][0]), -pp[i][1])}`;
      d += ` A${f1(X(b[0]))} ${f1(KY * b[0])} 0 0 1 ${pt(-X(b[0]), -b[1])} Z`; return d; };
    const front = (rr, z, extra = "") => `<path d="M${pt(-X(rr), -z)} A${f1(X(rr))} ${f1(KY * rr)} 0 0 0 ${pt(X(rr), -z)}" fill="none" ${extra}/>`;
    const ell = (rr, z, fill, extra = "") => `<ellipse cx="${f1(O[0])}" cy="${f1(O[1] - z)}" rx="${f1(X(rr))}" ry="${f1(KY * rr)}" fill="${fill}" ${extra}/>`;
    const rAt = (z) => { for (let i = 1; i < prof.length; i++) if (prof[i][1] >= z) { const a = prof[i - 1], b = prof[i], k = (z - a[1]) / (b[1] - a[1] || 1); return a[0] + (b[0] - a[0]) * k; } return rc; };
    const grad = (gid, cols, op = 1) => `<linearGradient id="${gid}" gradientUnits="userSpaceOnUse" x1="${f1(O[0] - X(bulge))}" y1="0" x2="${f1(O[0] + X(bulge))}" y2="0"><stop offset="0" stop-color="${cols[1]}" stop-opacity="${op}"/><stop offset=".2" stop-color="${cols[0]}" stop-opacity="${op}"/><stop offset=".48" stop-color="${cols[1]}" stop-opacity="${op}"/><stop offset=".8" stop-color="${cols[2]}" stop-opacity="${op}"/><stop offset="1" stop-color="${cols[3]}" stop-opacity="${op}"/></linearGradient>`;
    const st = `stroke="${INK}" stroke-width="${f1(sw)}" stroke-linejoin="round"`;
    let s = `<defs>${grad(id, pal, ghost ? 0.28 : 1)}${ghost ? grad(id + "b", PAL.beer) : ""}</defs>`;
    s += `<path d="${sil(prof)}" fill="url(#${id})" stroke="none"/>`;
    if (ghost) {
      const fz = sk + 2 + (h - sk - ch - 6) * (opt.fill != null ? opt.fill : 0.7);
      const bp = prof.filter(([, z]) => z >= sk + 2 && z <= fz).map(([rr, z]) => [rr * 0.95, z]); bp.unshift([rAt(sk + 2) * 0.95, sk + 2]); bp.push([rAt(fz) * 0.95, fz]);
      s += `<path d="${sil(bp)}" fill="url(#${id}b)" stroke="${PAL.beer[3]}" stroke-width="${f1(sw * 0.6)}"/>` + ell(rAt(fz) * 0.95, fz, PAL.beer[0], `stroke="${PAL.beer[3]}" stroke-width="${f1(sw * 0.6)}"`);
      if (opt.tube !== false) { const a = [O[0], O[1] - (sk + 3)], b = [O[0], O[1] - (h - 4)]; s += `<path d="M${f1(a[0])} ${f1(a[1])} L${f1(b[0])} ${f1(b[1])}" stroke="${INK}" stroke-width="${f1(7 * SWK)}" stroke-linecap="round"/><path d="M${f1(a[0])} ${f1(a[1])} L${f1(b[0])} ${f1(b[1])}" stroke="#e8f1fc" stroke-width="${f1(4 * SWK)}" stroke-linecap="round"/>`; }
    }
    // rolling rings, chime edges
    zr.forEach((z) => { [z - ringH / 2, z + ringH / 2].forEach((q) => { s += front(rAt(q), q, `stroke="${INK}" stroke-width="${f1(sw * 0.8)}"`); }); s += front(rAt(z), z, `stroke="${ghost ? "#fff" : pal[0]}" stroke-width="${f1(Math.max(1, ringH * 0.45))}" stroke-opacity=".9"`); });
    s += front(rc, sk, `stroke="${INK}" stroke-width="${f1(sw * 0.7)}" stroke-opacity=".7"`) + front(rc, h - ch, `stroke="${INK}" stroke-width="${f1(sw * 0.7)}" stroke-opacity=".7"`);
    // handle slot on the bottom skirt and on the top chime (front)
    if (!ghost && opt.slots !== false) {
      const slotD = (rr, z0, z1, tc, dt) => { const a = [], b = []; for (let i = 0; i <= 8; i++) { const t = tc - dt + (2 * dt * i) / 8; const x = (Math.cos(t) - Math.sin(t)) * 0.866 * rr, y = (Math.cos(t) + Math.sin(t)) * 0.5 * rr; a.push(pt(x, y - z0)); b.push(pt(x, y - z1)); } return `M${a.join(" L")} L${b.reverse().join(" L")} Z`; };
      s += `<path d="${slotD(rc, h - ch * 0.78, h - ch * 0.32, Math.PI / 4, 0.42)}" fill="#24467e" ${st}/>`;
      s += `<path d="${slotD(rc, sk * 0.28, sk * 0.72, Math.PI / 4 + 0.75, 0.3)}" fill="#24467e" ${st}/>`;
    }
    // outline
    s += `<path d="${sil(prof)}" fill="none" ${st}/>`;
    // top: chime rim, recessed dome, valve
    s += ell(rc, h, ghost ? "rgba(255,255,255,.35)" : pal[0], st) + ell(rc * 0.84, h, ghost ? "rgba(220,234,250,.5)" : pal[1], `stroke="${INK}" stroke-width="${f1(sw * 0.8)}"`);
    if (opt.valve !== false) {
      const vr = Math.max(4, r * 0.17), vz = h - ch * 0.55;
      s += cyl(add(o, [0, 0, vz]), [0, 0, 1], vr, ch * 0.55 + 2, "steel", { sw: 1.5, n: 24 }) + cyl(add(o, [0, 0, h + 2]), [0, 0, 1], vr * 0.75, 2.5, "steel", { sw: 1.3, hole: vr * 0.38, holeFill: PAL.dark[2] });
    }
    return `<g class="keg">${s}</g>`;
  };
  parts.coupler = (o, opt = {}) => {
    const ang = opt.lever != null ? opt.lever : -1.0; // radians; -1 up, 0.12 down
    let s = cyl(o, [0, 0, 1], 17, 5, "steel", { sw: 1.8 }) + cyl(add(o, [0, 0, 5]), [0, 0, 1], 14, 22, "steel");
    // gas port toward +y, check valve
    s += cyl(add(o, [0, 10, 15]), [0, 1, 0], 4.2, 14, "steel", { sw: 1.6 });
    if (opt.check !== false) s += cyl(add(o, [0, 22, 15]), [0, 1, 0], 7.5, 9, "orange", { n: 6, sw: 1.8, cls: "part-check" });
    s += cyl(add(o, [0, 0, 27]), [0, 0, 1], 9, 5, "steel", { n: 6, sw: 1.6 }) + cyl(add(o, [0, 0, 32]), [0, 0, 1], 5, 16, "steel", { sw: 1.6 });
    const pv = add(o, [14, 0, 20]), xf = rotY(pv, ang);
    s += box(add(pv, [0, -3, -2.5]), [42, 6, 5], "steel", { xf, sw: 1.8 });
    const g0 = xf(add(pv, [30, 0, 0])), g1 = xf(add(pv, [52, 0, 0]));
    s += cyl(g0, sub(g1, g0), 5, 22, "dark", { sw: 1.8 });
    s += cyl(add(pv, [0, -5, 0]), [0, 1, 0], 4.5, 10, "steel", { sw: 1.6 });
    return s;
  };
  // rear-sealing faucet; o = wall point; faucet projects along +x. opt.ventless → no vent holes, longer smooth spout
  parts.faucet = (o, opt = {}) => {
    const ang = opt.handle || 0, p = opt.pal || "steel";
    const vl = !!opt.ventless, len = vl ? 40 : 34;
    // spout first, so the body hides where it joins the underside
    let spout = vl ? cyl(add(o, [20 + len - 6, 0, -2]), [0.22, 0, -1], 5.2, 28, p, { sw: 1.8, r1: 3.6 }) : cyl(add(o, [20 + len - 8, 0, -2]), [0, 0, -1], 5.5, 22, p, { sw: 1.8, r1: 5 });
    let s = spout + cyl(o, [1, 0, 0], 12, 3, "steel", { sw: 1.6 }); // flange / escutcheon on the wall
    s += cyl(add(o, [3, 0, 0]), [1, 0, 0], 5.5, 10, "steel", { sw: 1.6 }); // shank
    s += cyl(add(o, [12, 0, 0]), [1, 0, 0], 9.5, 8, "steel", { sw: 1.8, n: 6 }); // coupling nut (hex)
    s += cyl(add(o, [20, 0, 0]), [1, 0, 0], 9.5, len, p, { sw: 2, r1: vl ? 8 : 9.5 }); // body
    s += cyl(add(o, [20 + len, 0, 0]), [1, 0, 0], vl ? 6.5 : 8, 3, p, { sw: 1.6 }); // front cap
    if (!vl) {
      // vent holes on the visible side of the body
      [0, 7].forEach((dx) => { const c = P(add(o, [20 + len - 16 + dx, 6.2, 6.2])); s += `<ellipse cx="${f1(c[0])}" cy="${f1(c[1])}" rx="${f1(1.9 * SWK + 0.4)}" ry="${f1(1.3 * SWK + 0.3)}" fill="${INK}" class="vent"/>`; });
    }
    // bonnet + collar on top, lever and handle
    s += cyl(add(o, [27, 0, 7]), [0, 0, 1], 7.5, 5, "steel", { sw: 1.6, n: 6 }) + cyl(add(o, [27, 0, 12]), [0, 0, 1], 6, 4, "steel", { sw: 1.4 });
    const pv = add(o, [27, 0, 15]), xf = rotY(pv, -ang);
    const b0 = xf(pv), b1 = xf(add(pv, [0, 0, 56]));
    s += cyl(b0, sub(b1, b0), 3.8, 10, "steel", { sw: 1.5 }) + cyl(xf(add(pv, [0, 0, 9])), sub(b1, b0), 5.5, 4, "steel", { sw: 1.4, n: 6 });
    s += cyl(xf(add(pv, [0, 0, 13])), sub(b1, b0), 7, 44, opt.handlePal || "orange", { sw: 2, r1: 9 });
    return s;
  };
  parts.glass = (o, opt = {}) => {
    const fill = Math.max(0, Math.min(1, opt.fill || 0)), h = 44;
    let s = "";
    const bp = opt.beer || "beer", foam = opt.foam != null ? opt.foam : 3;
    if (fill > 0.01) { s += cyl(add(o, [0, 0, 2]), [0, 0, 1], 10.5, (h - 4) * fill, bp, { r1: 10.5 + 4 * fill, sw: 1.2 }); if (fill > 0.2 && foam > 0) s += cyl(add(o, [0, 0, 2 + (h - 4) * fill]), [0, 0, 1], 10.5 + 4 * fill, foam, "white", { sw: 1 }); }
    s += cyl(o, [0, 0, 1], 11.5, h, "glass", { r1: 15.5, opacity: 0.38, sw: 1.8 });
    return s;
  };
  parts.person = (o, pose) => {
    const p = "deep"; let s = "";
    const crouch = pose === "crouch", hand = pose === "hand" || crouch;
    const z0 = crouch ? -14 : 0;
    s += cyl(add(o, [0, -6, 0]), [0, 0, 1], 5, 40 + z0, p, { sw: 1.6 }) + cyl(add(o, [0, 6, 0]), [0, 0, 1], 5, 40 + z0, p, { sw: 1.6 });
    s += cyl(add(o, [0, 0, 38 + z0]), [0, 0, 1], 12, 36, p, { r1: 13, sw: 1.8 });
    const hd = P(add(o, [0, 0, 88 + z0]));
    s += `<circle cx="${f1(hd[0])}" cy="${f1(hd[1])}" r="11" fill="${PAL.deep[1]}" stroke="${INK}" stroke-width="1.8"/>`;
    if (hand) { const a = P(add(o, [4, 10, 70 + z0])), b = P(add(o, [2, 6, 88 + z0])); s += `<line x1="${f1(a[0])}" y1="${f1(a[1])}" x2="${f1(b[0])}" y2="${f1(b[1])}" stroke="${INK}" stroke-width="8" stroke-linecap="round"/><line x1="${f1(a[0])}" y1="${f1(a[1])}" x2="${f1(b[0])}" y2="${f1(b[1])}" stroke="${PAL.deep[1]}" stroke-width="5" stroke-linecap="round"/>`; }
    return s;
  };
  parts.regulator = (o, opt = {}) => { // o = inlet point on top of tank valve; body above
    const v = opt.values || [0.7, 0.45], gN = opt.gauges || 2;
    let s = box(add(o, [-10, -10, 0]), [20, 20, 24], "steel");
    if (gN === 2) { s += cyl(add(o, [-4, 4, 26]), [0, 0, 1], 3, 6, "steel", { sw: 1.4 }) + gauge(add(o, [-4, 14, 40]), [0, 1, 0], 12, v[0]) ; s += cyl(add(o, [6, -4, 26]), [0, 0, 1], 3, 6, "steel", { sw: 1.4 }) + gauge(add(o, [18, -4, 40]), [1, 0, 0], 12, v[1]); }
    else s += cyl(add(o, [0, 0, 24]), [0, 0, 1], 3, 6, "steel", { sw: 1.4 }) + gauge(add(o, [0, 10, 40]), [0, 1, 0], 13, v[0]);
    s += cyl(add(o, [10, 0, 12]), [1, 0, 0], 6, 10, "dark", { sw: 1.6, cls: "knob" });
    return s;
  };

  // ---------- camera ----------
  const reduced = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
  function camera(svg, vb, ms) {
    const cur = svg.viewBox.baseVal, from = [cur.x, cur.y, cur.width, cur.height];
    const set = (q) => svg.setAttribute("viewBox", q.map(f1).join(" "));
    if (reduced() || !ms) { set(vb); return; }
    const t0 = performance.now(); cancelAnimationFrame(svg._cam);
    const tick = (now) => { const k = Math.min(1, (now - t0) / ms), e = 1 - Math.pow(1 - k, 3); set(from.map((a, i) => a + (vb[i] - a) * e)); if (k < 1) svg._cam = requestAnimationFrame(tick); };
    svg._cam = requestAnimationFrame(tick);
  }
  function tween(ms, fn, done) {
    if (reduced() || !ms) { fn(1); done && done(); return; }
    const t0 = performance.now();
    const tick = (now) => { const k = Math.min(1, (now - t0) / ms), e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2; fn(e); if (k < 1) requestAnimationFrame(tick); else done && done(); };
    requestAnimationFrame(tick);
  }
  function svg(vb, inner, aria, opt = {}) {
    const t = document.createElement("template");
    t.innerHTML = `<svg viewBox="${(vb || [0, 0, 100, 100]).join(" ")}" ${opt.interactive ? `role="group"` : `role="img"`} aria-label="${aria}" preserveAspectRatio="xMidYMid meet" class="iso">${inner}</svg>`;
    const el = t.content.firstElementChild;
    el._home = vb;
    if (!vb) { // auto-frame once attached
      const tryFit = () => { if (!el.isConnected) return requestAnimationFrame(tryFit); const b = bbox(el, opt.fitSel); const pad = opt.pad != null ? opt.pad : 14; el._home = [b.x - pad, b.y - pad, b.width + pad * 2, b.height + pad * 2]; el.setAttribute("viewBox", el._home.map(f1).join(" ")); el.dispatchEvent(new Event("framed")); };
      requestAnimationFrame(tryFit);
    }
    return el;
  }
  function bbox(el, sel) {
    if (sel) { try { return el.querySelector(sel).getBBox(); } catch (e) {} }
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    const take = (c) => { if (c.classList.contains("bggrid") || c.tagName === "defs" || c.classList.contains("hs") || c.classList.contains("nofit") || c.classList.contains("hsc-tip")) return;
      if (c.querySelector && c.querySelector(".hsc-tip")) { [...c.children].forEach(take); return; }
      try { const b = c.getBBox(); if (!b.width && !b.height) return;
        let pts = [[b.x, b.y], [b.x + b.width, b.y], [b.x, b.y + b.height], [b.x + b.width, b.y + b.height]];
        const tl = c.transform && c.transform.baseVal; const tm = tl && tl.numberOfItems ? tl.consolidate().matrix : null;
        if (tm) pts = pts.map(([x, y]) => [tm.a * x + tm.c * y + tm.e, tm.b * x + tm.d * y + tm.f]);
        pts.forEach(([x, y]) => { x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y); }); } catch (e) {} };
    [...el.children].forEach(take);
    return isFinite(x0) ? { x: x0, y: y0, width: x1 - x0, height: y1 - y0 } : { x: 0, y: 0, width: 100, height: 100 };
  }
  function zoomTo(svg, sel, pad, ms, aspect) {
    const t = typeof sel === "string" ? svg.querySelector(sel) : sel; if (!t) return;
    const b = t.getBBox(); pad = pad != null ? pad : 30;
    let vb = [b.x - pad, b.y - pad, b.width + pad * 2, b.height + pad * 2];
    const home = svg._home; if (home) { const ar = home[2] / home[3]; if (vb[2] / vb[3] < ar) { const w = vb[3] * ar; vb[0] -= (w - vb[2]) / 2; vb[2] = w; } else { const hh = vb[2] / ar; vb[1] -= (hh - vb[3]) / 2; vb[3] = hh; } }
    camera(svg, vb, ms == null ? 800 : ms);
  }
  const home = (svg, ms) => svg._home && camera(svg, svg._home, ms == null ? 800 : ms);
  function hsCallout(id, anchor3, at2, n, aria, o = {}) {
    const A = anchor3.length === 3 ? P(anchor3) : anchor3, k = o.k || 1;
    return `<g class="hsc" data-hs="${id}" tabindex="0" role="button" aria-label="${aria}"${o.tip ? ` data-tip="${o.tip}"` : ""}>${o.tip ? `<circle class="hsc-ring" cx="${f1(at2[0])}" cy="${f1(at2[1])}" r="${f1(13 * k)}"/>` : ""}<path d="M${f1(A[0])} ${f1(A[1])} L${f1(at2[0])} ${f1(A[1])} L${f1(at2[0])} ${f1(at2[1])}" fill="none" stroke="${INK}" stroke-width="${1.6 * k}"/>
      <circle cx="${f1(A[0])}" cy="${f1(A[1])}" r="${3.6 * k}" fill="${INK}" stroke="#fff" stroke-width="${1.5 * k}"/>
      <circle class="hsc-hit" cx="${f1(at2[0])}" cy="${f1(at2[1])}" r="${22 * k}" fill="transparent"/>
      <circle class="hsc-c" cx="${f1(at2[0])}" cy="${f1(at2[1])}" r="${13 * k}" style="stroke-width:${2 * k}px"/>
      <text x="${f1(at2[0])}" y="${f1(at2[1]) + 4.6 * k}" text-anchor="middle" font-family="Inter,system-ui" font-size="${13 * k}" font-weight="700">${n}</text></g>`;
  }
  function tipLabel(at2, text, k, side) {
    const fs = 13 * k, w = text.length * fs * 0.56 + 20 * k, hh = fs + 13 * k, gap = 20 * k;
    const x0 = side === "left" ? at2[0] - gap - w : side === "up" ? at2[0] - w / 2 : side === "down" ? at2[0] - w / 2 : at2[0] + gap;
    const y0 = side === "up" ? at2[1] - gap - hh : side === "down" ? at2[1] + gap : at2[1] - hh / 2;
    return `<g class="hsc-tip" aria-hidden="true"><rect x="${f1(x0)}" y="${f1(y0)}" width="${f1(w)}" height="${f1(hh)}" rx="${f1(hh / 2)}"/><text x="${f1(x0 + w / 2)}" y="${f1(y0 + hh / 2 + fs * 0.36)}" text-anchor="middle" font-size="${f1(fs)}">${text}</text></g>`;
  }
  function bindHotspots(root, handlers) {
    root.querySelectorAll(".hs, .hsc").forEach((g) => {
      if (g._bound) return; g._bound = true;
      const fire = () => { if (g.classList.contains("off")) return; const fn = handlers[g.dataset.hs]; if (fn) fn(g); };
      g.addEventListener("click", fire);
      if (g.classList.contains("hsc") && g.querySelector(".hsc-tip")) g.addEventListener("pointerenter", () => { if (g.parentNode.lastElementChild !== g) g.parentNode.append(g); });
      g.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); fire(); } });
    });
  }
  function setHot(root, id, on) { const g = root.querySelector(`.hs[data-hs="${id}"]`); if (!g) return; g.classList.toggle("off", !on); g.setAttribute("tabindex", on ? "0" : "-1"); g.setAttribute("aria-hidden", on ? "false" : "true"); }

  // ---------- shared 2D scenes ----------
  const TXT = (x, y, t, o = {}) => `<text x="${x}" y="${y}" text-anchor="${o.a || "middle"}" font-family="Inter,system-ui" font-size="${o.fs || 13}" font-weight="${o.w || 700}" fill="${o.c || INK}">${t}</text>`;
  // cross-section: solid stainless vs chipped chrome-plated brass
  function corrosion(opt = {}) {
    const I = INK, T = TXT;
    let s = `<defs><linearGradient id="ss" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#f4f8fd"/><stop offset="1" stop-color="#b9cfeb"/></linearGradient>
      <linearGradient id="br" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#f2d27c"/><stop offset="1" stop-color="#c79a3c"/></linearGradient>
      <linearGradient id="cr" x1="0" x2="1"><stop offset="0" stop-color="#ffffff"/><stop offset=".5" stop-color="#cfd8e4"/><stop offset="1" stop-color="#f4f8fd"/></linearGradient></defs>`;
    // stainless
    s += T(160, 40, "Stainless steel", { fs: 16, w: 800 }) + T(160, 60, "solid all the way through", { fs: 12.5, c: "#56637c", w: 600 });
    s += `<rect x="40" y="130" width="240" height="160" rx="6" fill="url(#ss)" stroke="${I}" stroke-width="2.6"/>`;
    for (let i = 0; i < 7; i++) s += `<path d="M50 ${150 + i * 20} h220" stroke="#9cc3f0" stroke-width="1" opacity=".6"/>`;
    [[90, 122], [150, 124], [214, 121]].forEach(([x, y]) => { s += `<ellipse cx="${x}" cy="${y}" rx="10" ry="6" fill="#ffcb52" stroke="${I}" stroke-width="1.6"/>`; });
    s += `<g transform="translate(160 214)"><circle r="20" fill="#2a9a6c" stroke="${I}" stroke-width="2"/><path d="M-8 0 l5 6 l11 -12" stroke="#fff" stroke-width="3.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/></g>`;
    s += T(160, 322, "Nothing underneath to corrode", { fs: 12.5, c: "#0f7b56" });
    // chrome-plated brass
    s += T(480, 40, "Chrome-plated brass", { fs: 16, w: 800 }) + T(480, 60, "a thin coat over brass", { fs: 12.5, c: "#56637c", w: 600 });
    s += `<rect x="360" y="142" width="240" height="148" rx="6" fill="url(#br)" stroke="${I}" stroke-width="2.6"/>`;
    s += `<path d="M360 130 h96 l6 12 h-102z M600 130 h-106 l-6 12 h112z" fill="url(#cr)" stroke="${I}" stroke-width="2"/>`; // chrome with a chip
    s += `<path d="M362 130 h94 M494 130 h104" stroke="${I}" stroke-width="2.6"/>`;
    s += `<g class="pit"><path d="M456 142 C 450 168 452 196 470 206 C 488 214 500 194 496 170 C 494 156 494 148 488 142 Z" fill="#5e7a52" stroke="#3d4f33" stroke-width="2"/><path d="M462 160 c6 10 18 14 26 4" fill="none" stroke="#88a86f" stroke-width="2" opacity=".8"/></g>`;
    s += `<g class="mic">${[[468, 172, 0], [482, 186, 20], [474, 196, 50], [486, 164, 80]].map(([x, y, r]) => `<rect x="${x - 6}" y="${y - 2.5}" width="12" height="5" rx="2.5" fill="#9fe3c4" stroke="#1d6b4a" stroke-width="1.2" transform="rotate(${r} ${x} ${y})"/>`).join("")}</g>`;
    [[400, 122], [544, 124]].forEach(([x, y]) => { s += `<ellipse cx="${x}" cy="${y}" rx="10" ry="6" fill="#ffcb52" stroke="${I}" stroke-width="1.6"/>`; });
    s += `<ellipse class="drip" cx="476" cy="122" rx="9" ry="6" fill="#ffcb52" stroke="${I}" stroke-width="1.6"/>`;
    // labels
    const tag = (x, y, lx, ly, t, c) => `<path d="M${x} ${y} L${lx} ${ly}" stroke="${c || I}" stroke-width="1.6"/><circle cx="${x}" cy="${y}" r="3.4" fill="${c || I}"/>` + label(lx, ly, t, { fs: 12, anchor: lx > x ? "start" : "end", fg: c || I, stroke: c || I });
    s += tag(420, 136, 400, 92, "Chrome plating") + tag(476, 138, 540, 92, "Chip", "#c7333a");
    const down = (x, y, ly, t, c) => `<path d="M${x} ${y} L${x} ${ly - 12}" stroke="${c}" stroke-width="1.6"/><circle cx="${x}" cy="${y}" r="3.4" fill="${c}"/>` + label(x, ly, t, { fs: 12, fg: c, stroke: c });
    s += `<path d="M466 200 L466 306" stroke="#8a5300" stroke-width="1.6"/><circle cx="466" cy="200" r="3.4" fill="#8a5300"/>` + label(586, 318, "Brass corrodes → metallic off-flavor", { fs: 12, anchor: "end", fg: "#8a5300", stroke: "#8a5300" }) +
      `<path d="M490 180 H604 V352 H592" stroke="#1d6b4a" stroke-width="1.6" fill="none"/><circle cx="490" cy="180" r="3.4" fill="#1d6b4a"/>` + label(592, 352, "Microbes hide in the pits", { fs: 12, anchor: "end", fg: "#1d6b4a", stroke: "#1d6b4a" });
    return s;
  }

  window.ISO = { corrosion, setSW: (k) => { SWK = k; }, slot, tipLabel, bbox, zoomTo, home, hsCallout, P, cyl, box, tube, poly, line, grid, slab, callout, label, hotspot, gauge, parts, camera, tween, svg, bindHotspots, setHot, rotY, rotX, add, sub, mul, PAL, INK, smoothD, f1 };
})();
