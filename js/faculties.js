(() => {
  const grid = document.querySelector("[data-faculty-grid]");
  const rosterEl = document.querySelector("[data-faculty-roster]");
  const titleEl = document.querySelector("[data-roster-title]");
  const listEl = document.querySelector("[data-roster-list]");
  if (!grid || !window.FACULTIES || !window.CHARACTERS) return;

  const params = new URLSearchParams(location.search);
  let active = params.get("dept") || "";

  const cardHtml = (id) => {
    const c = window.CHARACTERS[id];
    if (!c) return "";
    const img = c.cardImage || c.image;
    const media = img
      ? `<img src="${img}" alt="" width="160" height="160" loading="lazy" />`
      : `<span class="char-card-ph" aria-hidden="true">${c.name.slice(0, 1)}</span>`;
    return `
      <a class="char-card" href="character.html?id=${encodeURIComponent(c.id)}">
        <span class="char-card-media">${media}</span>
        <span class="char-card-body">
          <strong>${c.name}</strong>
          <span>${c.cardRole || c.role}</span>
        </span>
      </a>`;
  };

  const renderFaculties = () => {
    grid.innerHTML = window.FACULTIES.map((f) => {
      const count = (window.FACULTY_ROSTER[f.id] || []).length;
      const current = f.id === active ? ' aria-current="true"' : "";
      return `
        <button type="button" class="module faculty-tile" data-dept="${f.id}"${current}>
          <span class="module-tag">${f.tag}</span>
          <h3>${f.name}</h3>
          <p>${f.blurb}</p>
          <span class="faculty-count">${count} 人</span>
        </button>`;
    }).join("");
  };

  const showRoster = (deptId) => {
    active = deptId;
    const fac = window.FACULTIES.find((f) => f.id === deptId);
    const ids = window.FACULTY_ROSTER[deptId] || [];
    if (!fac) {
      rosterEl.hidden = true;
      return;
    }
    titleEl.textContent = `${fac.name} · 人物`;
    listEl.innerHTML = ids.map(cardHtml).join("") || "<p class=\"muted\">暂无公开人物。</p>";
    rosterEl.hidden = false;
    grid.querySelectorAll("[data-dept]").forEach((btn) => {
      if (btn.getAttribute("data-dept") === deptId) btn.setAttribute("aria-current", "true");
      else btn.removeAttribute("aria-current");
    });
    const url = new URL(location.href);
    url.searchParams.set("dept", deptId);
    history.replaceState(null, "", url);
    rosterEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
  };

  grid.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-dept]");
    if (!btn) return;
    showRoster(btn.getAttribute("data-dept"));
  });

  renderFaculties();
  if (active && window.FACULTY_ROSTER[active]) showRoster(active);
})();
