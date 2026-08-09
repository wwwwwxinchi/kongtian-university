(() => {
  const root = document.querySelector("[data-wiki-cloud]");
  const preview = document.querySelector("[data-wiki-preview]");
  if (!root || !window.WIKI_CLOUD) return;

  const rotor = document.createElement("div");
  rotor.className = "wiki-cloud-rotor";
  const globe = root.querySelector(".wiki-cloud-globe");
  const core = root.querySelector(".wiki-field-core");
  if (globe) rotor.appendChild(globe);
  if (core) rotor.appendChild(core);
  root.appendChild(rotor);

  const words = window.WIKI_CLOUD;
  const palette = ["#214f78", "#277eaf", "#4e79b8", "#7166ad", "#177f91", "#9b6f24"];
  const items = words.map((word, index) => {
    const link = document.createElement("a");
    link.className = "wiki-cloud-word";
    link.href = `wiki-entry.html?id=${encodeURIComponent(word.id)}`;
    link.textContent = word.text;
    link.style.setProperty("--word-color", palette[index % palette.length]);
    link.style.setProperty("--word-delay", `${(index % 7) * -0.18}s`);
    link.dataset.weight = String(word.weight);
    link.dataset.entry = word.id;
    link.setAttribute("aria-label", `读取词条：${word.text}`);
    rotor.appendChild(link);
    return { el: link, data: word, w: 0, h: 0, x: 0, y: 0 };
  });

  const renderPreview = (item, index) => {
    if (!preview) return;
    const entry = window.WIKI_ENTRIES && window.WIKI_ENTRIES[item.data.id];
    const summary = entry?.summary || `读取与“${item.data.text}”相关的校园档案。`;
    preview.innerHTML = `
      <p class="orbit-kicker">FIELD INDEX ${String(index + 1).padStart(3, "0")}</p>
      <span class="wiki-preview-weight">能场层级 ${item.data.weight}</span>
      <h2>${item.data.text}</h2>
      <p>${summary}</p>
      <a class="text-link" href="${item.el.href}">读取词条 <span aria-hidden="true">→</span></a>
    `;
  };

  const focusItem = (item, index) => {
    root.classList.add("has-word-focus");
    items.forEach((candidate) => {
      const related = candidate.data.id === item.data.id;
      candidate.el.classList.toggle("is-related", related && candidate !== item);
      candidate.el.classList.toggle("is-muted", !related && candidate !== item);
      candidate.el.classList.toggle("is-current", candidate === item);
    });
    renderPreview(item, index);
  };

  const clearFocus = () => {
    root.classList.remove("has-word-focus");
    items.forEach((item) => item.el.classList.remove("is-related", "is-muted", "is-current"));
  };

  items.forEach((item, index) => {
    item.el.addEventListener("pointerenter", () => focusItem(item, index));
    item.el.addEventListener("focus", () => focusItem(item, index));
    item.el.addEventListener("pointerleave", clearFocus);
    item.el.addEventListener("blur", clearFocus);
  });

  const layout = () => {
    const rect = root.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radiusX = width * 0.455;
    const radiusY = height * 0.435;

    items.forEach((item) => {
      const size = item.el.getBoundingClientRect();
      item.w = size.width;
      item.h = size.height;
    });

    const order = [...items].sort((a, b) => b.data.weight - a.data.weight);
    const placed = [];
    const overlaps = (x, y, w, h) => placed.some((placedItem) => {
      const padding = 7;
      return x - padding < placedItem.x + placedItem.w + padding &&
        x + w + padding > placedItem.x - padding &&
        y - padding < placedItem.y + placedItem.h + padding &&
        y + h + padding > placedItem.y - padding;
    });
    const inside = (x, y, w, h) => [
      [x + w / 2, y + h / 2], [x, y], [x + w, y], [x, y + h], [x + w, y + h],
    ].every(([pointX, pointY]) => {
      const nx = (pointX - centerX) / radiusX;
      const ny = (pointY - centerY) / radiusY;
      return nx * nx + ny * ny <= 1.01;
    });

    order.forEach((item, index) => {
      let found = false;
      for (let step = 0; step < 1100 && !found; step += 1) {
        const progress = step / 1100;
        const angle = step * 2.399963 + index * 0.37;
        const distance = Math.min(radiusX, radiusY) * Math.sqrt(progress) * 1.05;
        const x = centerX + Math.cos(angle) * distance * (radiusX / Math.min(radiusX, radiusY)) - item.w / 2;
        const y = centerY + Math.sin(angle) * distance * (radiusY / Math.min(radiusX, radiusY)) - item.h / 2;
        if (!inside(x, y, item.w, item.h) || overlaps(x, y, item.w, item.h)) continue;
        item.x = x;
        item.y = y;
        placed.push(item);
        found = true;
      }
      if (!found) {
        const angle = (index / order.length) * Math.PI * 2;
        item.x = centerX + Math.cos(angle) * radiusX * 0.62 - item.w / 2;
        item.y = centerY + Math.sin(angle) * radiusY * 0.62 - item.h / 2;
        placed.push(item);
      }
      item.el.style.left = `${item.x}px`;
      item.el.style.top = `${item.y}px`;
    });
  };

  if (window.matchMedia("(hover: hover) and (pointer: fine)").matches && typeof gsap !== "undefined") {
    const movers = items.map((item) => ({
      item,
      x: gsap.quickTo(item.el, "x", { duration: 0.28, ease: "power2.out" }),
      y: gsap.quickTo(item.el, "y", { duration: 0.28, ease: "power2.out" }),
    }));
    root.addEventListener("pointermove", (event) => {
      const rootRect = root.getBoundingClientRect();
      const pointerX = event.clientX - rootRect.left;
      const pointerY = event.clientY - rootRect.top;
      movers.forEach(({ item, x, y }) => {
        const dx = pointerX - (item.x + item.w / 2);
        const dy = pointerY - (item.y + item.h / 2);
        const distance = Math.hypot(dx, dy);
        const pull = Math.max(0, 1 - distance / 150) * 7;
        x(distance ? (dx / distance) * pull : 0);
        y(distance ? (dy / distance) * pull : 0);
      });
    });
    root.addEventListener("pointerleave", () => movers.forEach(({ x, y }) => { x(0); y(0); }));
  }

  const runLayout = () => requestAnimationFrame(() => requestAnimationFrame(layout));
  document.fonts?.ready ? document.fonts.ready.then(runLayout) : runLayout();
  let resizeTimer;
  window.addEventListener("resize", () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(layout, 120);
  });

  renderPreview(items[0], 0);
})();
