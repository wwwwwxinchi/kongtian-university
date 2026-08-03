(() => {
  const root = document.querySelector("[data-wiki-cloud]");
  if (!root || !window.WIKI_CLOUD) return;

  const words = window.WIKI_CLOUD;
  const colors = [
    "#3b5bdb",
    "#4c6ef5",
    "#5c7cfa",
    "#748ffc",
    "#7048e8",
    "#7950f2",
    "#845ef7",
    "#9775fa",
    "#364fc7",
    "#5f3dc4",
    "#15aabf",
    "#22b8cf",
    "#3bc9db",
    "#228be6",
    "#1c7ed6",
  ];

  const sizeFor = (w) => {
    const map = { 5: 34, 4: 26, 3: 20, 2: 15 };
    return map[w] || 14;
  };

  // Build absolute-positioned links, pack into ellipse (Earth)
  const items = words.map((w, i) => {
    const a = document.createElement("a");
    a.className = "wiki-cloud-word";
    a.href = `wiki-entry.html?id=${encodeURIComponent(w.id)}`;
    a.textContent = w.text;
    a.style.fontSize = `${sizeFor(w.weight)}px`;
    a.style.color = colors[i % colors.length];
    a.style.fontWeight = w.weight >= 4 ? "700" : w.weight >= 3 ? "600" : "500";
    a.setAttribute("data-weight", String(w.weight));
    root.appendChild(a);
    return { el: a, w: 0, h: 0, x: 0, y: 0, weight: w.weight };
  });

  const layout = () => {
    const rect = root.getBoundingClientRect();
    const W = rect.width;
    const H = rect.height;
    const cx = W / 2;
    const cy = H / 2;
    // Earth-like ellipse (slightly wider)
    const rx = W * 0.46;
    const ry = H * 0.44;

    items.forEach((it) => {
      const r = it.el.getBoundingClientRect();
      it.w = r.width;
      it.h = r.height;
    });

    // Sort large words first for better packing
    const order = [...items].sort((a, b) => b.weight - a.weight);
    const placed = [];

    const overlaps = (x, y, w, h) => {
      const pad = 4;
      for (const p of placed) {
        if (
          x - pad < p.x + p.w + pad &&
          x + w + pad > p.x - pad &&
          y - pad < p.y + p.h + pad &&
          y + h + pad > p.y - pad
        ) {
          return true;
        }
      }
      return false;
    };

    const insideEarth = (x, y, w, h) => {
      // check center + corners roughly inside ellipse
      const pts = [
        [x + w / 2, y + h / 2],
        [x, y],
        [x + w, y],
        [x, y + h],
        [x + w, y + h],
      ];
      return pts.every(([px, py]) => {
        const nx = (px - cx) / rx;
        const ny = (py - cy) / ry;
        return nx * nx + ny * ny <= 1.02;
      });
    };

    order.forEach((it, idx) => {
      let found = false;
      // golden-angle spiral from center
      for (let k = 0; k < 900 && !found; k++) {
        const t = k * 0.55 + idx * 0.15;
        const ang = k * 2.399963;
        const rad = Math.min(rx, ry) * Math.sqrt(t / 900) * 1.15;
        const x = cx + Math.cos(ang) * rad * (rx / Math.min(rx, ry)) - it.w / 2;
        const y = cy + Math.sin(ang) * rad * (ry / Math.min(rx, ry)) - it.h / 2;
        if (!insideEarth(x, y, it.w, it.h)) continue;
        if (overlaps(x, y, it.w, it.h)) continue;
        it.x = x;
        it.y = y;
        placed.push(it);
        found = true;
      }
      if (!found) {
        // fallback: push near rim
        const ang = (idx / order.length) * Math.PI * 2;
        it.x = cx + Math.cos(ang) * rx * 0.55 - it.w / 2;
        it.y = cy + Math.sin(ang) * ry * 0.55 - it.h / 2;
        placed.push(it);
      }
      it.el.style.left = `${it.x}px`;
      it.el.style.top = `${it.y}px`;
    });
  };

  // wait fonts
  const run = () => requestAnimationFrame(() => requestAnimationFrame(layout));
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(run);
  } else {
    run();
  }
  window.addEventListener("resize", () => {
    clearTimeout(window.__wikiCloudResize);
    window.__wikiCloudResize = setTimeout(layout, 120);
  });
})();
