(() => {
  const root = document.querySelector("[data-wiki-cloud]");
  const preview = document.querySelector("[data-wiki-preview]");
  if (!root || !window.WIKI_CLOUD) return;

  const globe = root.querySelector(".wiki-cloud-globe");
  const words = window.WIKI_CLOUD;
  const palette = ["#123b5a", "#1f6697", "#426ea9", "#665ba2", "#167789", "#8a6426"];
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));
  const tau = Math.PI * 2;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const state = {
    width: 0,
    height: 0,
    radius: 0,
    yaw: 0.38,
    pitch: -0.16,
    targetYaw: null,
    targetPitch: null,
    dragging: false,
    didDrag: false,
    pointerId: null,
    lastX: 0,
    lastY: 0,
    focusedIndex: -1,
    hoveredIndex: -1,
    reduce: reduceMotion.matches,
    lastTime: performance.now(),
  };

  const items = words.map((word, index) => {
    const vertical = 1 - ((index + 0.5) / words.length) * 2;
    const horizontalRadius = Math.sqrt(Math.max(0, 1 - vertical * vertical));
    const angle = index * goldenAngle;
    const link = document.createElement("a");
    link.className = "wiki-cloud-word";
    link.href = `wiki-entry.html?id=${encodeURIComponent(word.id)}`;
    link.textContent = word.text;
    link.style.setProperty("--word-color", palette[index % palette.length]);
    link.dataset.weight = String(word.weight);
    link.dataset.entry = word.id;
    link.setAttribute("aria-label", `读取词条：${word.text}`);
    root.appendChild(link);
    return {
      el: link,
      data: word,
      point: {
        x: Math.cos(angle) * horizontalRadius,
        y: vertical,
        z: Math.sin(angle) * horizontalRadius,
      },
      width: 0,
      height: 0,
      projected: null,
    };
  });

  const renderPreview = (item, index) => {
    if (!preview || !item) return;
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

  const nearestAngle = (current, target) => target + Math.round((current - target) / tau) * tau;
  const bringToFront = (item) => {
    const { x, y, z } = item.point;
    const yaw = Math.atan2(-x, z);
    const depthAfterYaw = Math.max(0.001, Math.hypot(x, z));
    const pitch = Math.atan2(y, depthAfterYaw);
    state.targetYaw = nearestAngle(state.yaw, yaw);
    state.targetPitch = Math.max(-1.05, Math.min(1.05, pitch));
  };

  const setCurrent = (index, source) => {
    if (source === "focus") state.focusedIndex = index;
    if (source === "pointer") state.hoveredIndex = index;
    items.forEach((item, itemIndex) => item.el.classList.toggle("is-current", itemIndex === index));
    renderPreview(items[index], index);
  };

  const clearCurrent = (index, source) => {
    if (source === "focus" && state.focusedIndex === index) state.focusedIndex = -1;
    if (source === "pointer" && state.hoveredIndex === index) state.hoveredIndex = -1;
    const activeIndex = state.focusedIndex >= 0 ? state.focusedIndex : state.hoveredIndex;
    items.forEach((item, itemIndex) => item.el.classList.toggle("is-current", itemIndex === activeIndex));
  };

  items.forEach((item, index) => {
    item.el.addEventListener("pointerenter", () => setCurrent(index, "pointer"));
    item.el.addEventListener("pointerleave", () => clearCurrent(index, "pointer"));
    item.el.addEventListener("focus", () => {
      setCurrent(index, "focus");
      bringToFront(item);
    });
    item.el.addEventListener("blur", () => clearCurrent(index, "focus"));
    item.el.addEventListener("click", (event) => {
      if (state.didDrag) event.preventDefault();
    });
  });

  const measure = () => {
    const rect = root.getBoundingClientRect();
    state.width = rect.width;
    state.height = rect.height;
    state.radius = Math.min(rect.width, rect.height) * (rect.width < 560 ? 0.43 : 0.445);
    items.forEach((item) => {
      const itemRect = item.el.getBoundingClientRect();
      item.width = itemRect.width;
      item.height = itemRect.height;
    });
  };

  const overlaps = (box, accepted) => accepted.some((other) =>
    box.left < other.right && box.right > other.left && box.top < other.bottom && box.bottom > other.top
  );

  const project = () => {
    if (!state.width || !state.height) return;
    const cosY = Math.cos(state.yaw);
    const sinY = Math.sin(state.yaw);
    const cosX = Math.cos(state.pitch);
    const sinX = Math.sin(state.pitch);
    const centerX = state.width / 2;
    const centerY = state.height / 2;

    items.forEach((item, index) => {
      const { x, y, z } = item.point;
      const rotatedX = x * cosY + z * sinY;
      const yawDepth = -x * sinY + z * cosY;
      const rotatedY = y * cosX - yawDepth * sinX;
      const depth = y * sinX + yawDepth * cosX;
      const depthRatio = (depth + 1) / 2;
      const scale = 0.72 + depthRatio * 0.34;
      item.projected = {
        index,
        x: centerX + rotatedX * state.radius,
        y: centerY + rotatedY * state.radius,
        depth,
        scale,
        priority: (index === state.focusedIndex ? 100 : 0) + depthRatio * 10 + item.data.weight,
      };
    });

    const accepted = [];
    const ordered = [...items].sort((a, b) => b.projected.priority - a.projected.priority);
    ordered.forEach((item) => {
      const point = item.projected;
      const padding = state.width < 560 ? 5 : 9;
      const boxWidth = item.width * point.scale + padding * 2;
      const boxHeight = item.height * point.scale + padding * 2;
      const box = {
        left: point.x - boxWidth / 2,
        right: point.x + boxWidth / 2,
        top: point.y - boxHeight / 2,
        bottom: point.y + boxHeight / 2,
      };
      const inFront = point.depth > -0.08;
      const forced = point.index === state.focusedIndex;
      const visible = forced || (inFront && !overlaps(box, accepted));
      if (visible) accepted.push(box);
      const opacity = visible ? Math.max(0.42, 0.48 + point.depth * 0.46) : 0;
      item.el.dataset.occluded = visible ? "false" : "true";
      item.el.style.opacity = point.index === state.focusedIndex ? "1" : opacity.toFixed(3);
      item.el.style.pointerEvents = visible ? "auto" : "none";
      item.el.style.zIndex = String(20 + Math.round((point.depth + 1) * 40));
      item.el.style.transform = `translate3d(${point.x - item.width / 2}px, ${point.y - item.height / 2}px, 0) scale(${point.scale.toFixed(3)})`;
    });

    if (globe) {
      globe.style.transform = `rotate(${(state.yaw * 14).toFixed(2)}deg) scale(${(0.97 + Math.cos(state.pitch) * 0.03).toFixed(3)})`;
    }
  };

  const isInteracting = () => state.dragging || state.focusedIndex >= 0 || root.matches(":hover");
  const tick = (time) => {
    const delta = Math.min(40, time - state.lastTime);
    state.lastTime = time;
    if (state.targetYaw !== null && state.targetPitch !== null) {
      const amount = Math.min(1, delta / 110);
      state.yaw += (state.targetYaw - state.yaw) * amount;
      state.pitch += (state.targetPitch - state.pitch) * amount;
      if (Math.abs(state.targetYaw - state.yaw) < 0.002 && Math.abs(state.targetPitch - state.pitch) < 0.002) {
        state.yaw = state.targetYaw;
        state.pitch = state.targetPitch;
        state.targetYaw = null;
        state.targetPitch = null;
      }
    } else if (!state.reduce && !isInteracting() && !document.hidden) {
      state.yaw += delta * 0.00009;
    }
    project();
    requestAnimationFrame(tick);
  };

  root.addEventListener("pointerdown", (event) => {
    if (event.button !== 0) return;
    state.dragging = true;
    state.didDrag = false;
    state.pointerId = event.pointerId;
    state.lastX = event.clientX;
    state.lastY = event.clientY;
    state.targetYaw = null;
    state.targetPitch = null;
    root.classList.add("is-dragging");
    root.setPointerCapture?.(event.pointerId);
  });

  root.addEventListener("pointermove", (event) => {
    if (!state.dragging || event.pointerId !== state.pointerId) return;
    const deltaX = event.clientX - state.lastX;
    const deltaY = event.clientY - state.lastY;
    if (Math.abs(deltaX) + Math.abs(deltaY) > 2) state.didDrag = true;
    state.yaw += deltaX * 0.006;
    state.pitch = Math.max(-1.05, Math.min(1.05, state.pitch - deltaY * 0.005));
    state.lastX = event.clientX;
    state.lastY = event.clientY;
  });

  const endDrag = (event) => {
    if (!state.dragging || event.pointerId !== state.pointerId) return;
    state.dragging = false;
    state.pointerId = null;
    root.classList.remove("is-dragging");
    root.releasePointerCapture?.(event.pointerId);
    window.setTimeout(() => { state.didDrag = false; }, 0);
  };
  root.addEventListener("pointerup", endDrag);
  root.addEventListener("pointercancel", endDrag);

  root.addEventListener("keydown", (event) => {
    if (event.target !== root || !["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) return;
    event.preventDefault();
    state.targetYaw = null;
    state.targetPitch = null;
    if (event.key === "ArrowLeft") state.yaw -= 0.18;
    if (event.key === "ArrowRight") state.yaw += 0.18;
    if (event.key === "ArrowUp") state.pitch = Math.min(1.05, state.pitch + 0.14);
    if (event.key === "ArrowDown") state.pitch = Math.max(-1.05, state.pitch - 0.14);
  });

  reduceMotion.addEventListener?.("change", (event) => { state.reduce = event.matches; });
  if (typeof ResizeObserver !== "undefined") new ResizeObserver(measure).observe(root);
  else window.addEventListener("resize", measure);
  const start = () => {
    measure();
    renderPreview(items[0], 0);
    project();
    requestAnimationFrame(tick);
  };
  document.fonts?.ready ? document.fonts.ready.then(start) : start();
})();
