(() => {
  const orbit = document.querySelector("[data-faculty-orbit]");
  const preview = document.querySelector("[data-faculty-preview]");
  const rosterEl = document.querySelector("[data-faculty-roster]");
  const titleEl = document.querySelector("[data-roster-title]");
  const listEl = document.querySelector("[data-roster-list]");
  const toggle = document.querySelector("[data-orbit-toggle]");
  if (!orbit || !window.FACULTIES || !window.CHARACTERS) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const params = new URLSearchParams(location.search);
  let activeIndex = Math.max(
    0,
    window.FACULTIES.findIndex((faculty) => faculty.id === params.get("dept"))
  );
  let manuallyPaused = reduceMotion.matches;
  let interacting = false;

  const cardHtml = (id) => {
    const character = window.CHARACTERS[id];
    if (!character) return "";
    const image = character.cardImage || character.image;
    const media = image
      ? `<img src="${image}" alt="" width="160" height="160" loading="lazy" />`
      : `<span class="char-card-ph" aria-hidden="true">${character.name.slice(0, 1)}</span>`;
    return `
      <a class="char-card" href="character.html?id=${encodeURIComponent(character.id)}">
        <span class="char-card-media">${media}</span>
        <span class="char-card-body">
          <strong>${character.name}</strong>
          <span>${character.cardRole || character.role}</span>
        </span>
      </a>`;
  };

  const homepageFor = (faculty) =>
    faculty.url || `faculty.html?id=${encodeURIComponent(faculty.id)}`;

  orbit.innerHTML = `
    <div class="faculty-orbit-ring" aria-label="十六学院环行目录">
      ${window.FACULTIES.map((faculty, index) => {
        const angle = (360 / window.FACULTIES.length) * index;
        return `
          <a class="faculty-orbit-node" href="${homepageFor(faculty)}"
            style="--angle: ${angle}deg; --angle-back: -${angle}deg" data-faculty-id="${faculty.id}"
            aria-label="进入${faculty.name}主页">
            <span class="faculty-medallion" aria-hidden="true">
              <img class="faculty-medallion-image" src="${faculty.emblem}" alt="" width="120" height="120" />
            </span>
          </a>`;
      }).join("")}
    </div>
    <div class="faculty-orbit-core" aria-hidden="true">
      <span class="faculty-core-halo"></span>
      <img src="assets/faculty-emblems/center/university-seal-center-circle.png" alt="" width="5427" height="5427" />
    </div>
    <span class="faculty-orbit-station" aria-hidden="true"><i></i></span>
  `;

  const nodes = Array.from(orbit.querySelectorAll("[data-faculty-id]"));

  const renderPreview = (faculty, index) => {
    if (!faculty || !preview) return;
    const roster = window.FACULTY_ROSTER[faculty.id] || [];
    preview.innerHTML = `
      <p class="orbit-kicker">ORBIT ${String(index + 1).padStart(2, "0")} / ${String(window.FACULTIES.length).padStart(2, "0")}</p>
      <div class="faculty-preview-title">
        <span class="faculty-preview-seal" aria-hidden="true"><img src="${faculty.emblem}" alt="" width="120" height="120" /></span>
        <div><span>${faculty.tag}</span><h2>${faculty.name}</h2></div>
      </div>
      <p>${faculty.blurb}</p>
      <dl class="faculty-preview-meta">
        <div><dt>校区</dt><dd>地球校区</dd></div>
        <div><dt>公开人物</dt><dd>${roster.length || "待录入"}</dd></div>
      </dl>
      <a class="btn btn-solid faculty-home-link" href="${homepageFor(faculty)}">进入学院主页 <span aria-hidden="true">↗</span></a>
    `;

    nodes.forEach((node, nodeIndex) => {
      node.classList.toggle("is-active", nodeIndex === index);
      if (nodeIndex === index) node.setAttribute("aria-current", "true");
      else node.removeAttribute("aria-current");
    });

    if (rosterEl && titleEl && listEl) {
      titleEl.textContent = `${faculty.name} · 在校人物`;
      listEl.innerHTML = roster.length
        ? roster.map(cardHtml).join("")
        : `<div class="faculty-empty"><span>${faculty.seal}</span><p>人物档案仍在整理。进入学院主页查看院系介绍。</p></div>`;
      rosterEl.hidden = false;
    }
  };

  const activate = (index) => {
    activeIndex = (index + window.FACULTIES.length) % window.FACULTIES.length;
    renderPreview(window.FACULTIES[activeIndex], activeIndex);
  };

  nodes.forEach((node, index) => {
    const begin = () => {
      interacting = true;
      orbit.classList.add("is-interacting");
      activate(index);
    };
    const end = () => {
      interacting = orbit.matches(":hover");
      if (!interacting) orbit.classList.remove("is-interacting");
    };
    node.addEventListener("pointerenter", begin);
    node.addEventListener("pointerleave", end);
    node.addEventListener("focus", begin);
    node.addEventListener("blur", end);
  });

  orbit.addEventListener("pointerenter", () => {
    interacting = true;
    orbit.classList.add("is-interacting");
  });
  orbit.addEventListener("pointerleave", () => {
    interacting = false;
    if (!orbit.matches(":focus-within")) orbit.classList.remove("is-interacting");
  });

  const syncPauseButton = () => {
    orbit.classList.toggle("is-paused", manuallyPaused);
    if (!toggle) return;
    toggle.setAttribute("aria-pressed", String(manuallyPaused));
    toggle.innerHTML = manuallyPaused
      ? '<span aria-hidden="true">▶</span> 继续环行'
      : '<span aria-hidden="true">Ⅱ</span> 暂停环行';
  };

  if (toggle) {
    toggle.addEventListener("click", () => {
      manuallyPaused = !manuallyPaused;
      syncPauseButton();
    });
  }

  const advance = window.setInterval(() => {
    if (!manuallyPaused && !interacting && !document.hidden) activate(activeIndex + 1);
  }, 4000);

  window.addEventListener("pagehide", () => window.clearInterval(advance), { once: true });
  reduceMotion.addEventListener?.("change", (event) => {
    if (event.matches) manuallyPaused = true;
    syncPauseButton();
  });

  activate(activeIndex);
  syncPauseButton();
})();
