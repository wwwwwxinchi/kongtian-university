(() => {
  const params = new URLSearchParams(location.search);
  const id = params.get("id") || "kongtian";
  const entry = window.WIKI_ENTRIES && window.WIKI_ENTRIES[id];

  const titleEl = document.querySelector("[data-wiki-title]");
  const summaryEl = document.querySelector("[data-wiki-summary]");
  const bodyEl = document.querySelector("[data-wiki-body]");
  const tocEl = document.querySelector("[data-wiki-toc]");
  const boxEl = document.querySelector("[data-wiki-infobox]");
  const crumbEl = document.querySelector("[data-wiki-crumb]");

  const renderNav = () => {
    if (!tocEl || !window.WIKI_NAV) return;

    const hrefFor = (entryId) =>
      `wiki-entry.html?id=${encodeURIComponent(entryId)}`;

    const renderNode = (node, depth) => {
      const kids = node.children || [];
      const hasKids = kids.length > 0;
      const isEntry = Boolean(node.id);
      const isCurrent = isEntry && node.id === id;

      const sub = hasKids
        ? `<ol class="wiki-toc-sub"${isCurrent ? "" : " hidden"}>${kids
            .map((c) => renderNode(c, depth + 1))
            .join("")}</ol>`
        : "";

      const toggle = hasKids
        ? `<button type="button" class="wiki-toc-toggle" aria-expanded="${
            isCurrent ? "true" : "false"
          }" aria-label="展开 ${node.label}">${isCurrent ? "▾" : "▸"}</button>`
        : `<span class="wiki-toc-dot">·</span>`;

      const label = isEntry
        ? `<a href="${hrefFor(node.id)}"${
            isCurrent ? ' aria-current="page"' : ""
          }>${node.label}</a>`
        : `<span class="wiki-toc-group">${node.label}</span>`;

      return `<li class="wiki-toc-item${isCurrent ? " is-current" : ""}" data-depth="${depth}">
        <div class="wiki-toc-row">
          ${toggle}
          ${label}
        </div>
        ${sub}
      </li>`;
    };

    tocEl.innerHTML = `
      <h2>百科导航</h2>
      <p class="wiki-nav-cloud"><a href="wiki.html">← 返回词云</a></p>
      <ol class="wiki-toc-root">${window.WIKI_NAV.map((n) =>
        renderNode(n, 0)
      ).join("")}</ol>
    `;

    tocEl.addEventListener("click", (e) => {
      const btn = e.target.closest(".wiki-toc-toggle");
      if (!btn) return;
      const li = btn.closest(".wiki-toc-item");
      const sub = li && li.querySelector(":scope > .wiki-toc-sub");
      if (!sub) return;
      const open = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", String(!open));
      btn.textContent = open ? "▸" : "▾";
      sub.hidden = open;
    });

    // 展开通往当前词条的路径
    const current = tocEl.querySelector(".wiki-toc-item.is-current");
    if (current) {
      let parent = current.parentElement;
      while (parent && parent !== tocEl) {
        if (parent.classList && parent.classList.contains("wiki-toc-sub")) {
          parent.hidden = false;
          const item = parent.closest(".wiki-toc-item");
          const btn = item && item.querySelector(":scope > .wiki-toc-row .wiki-toc-toggle");
          if (btn) {
            btn.setAttribute("aria-expanded", "true");
            btn.textContent = "▾";
          }
        }
        parent = parent.parentElement;
      }
    }
  };

  if (!entry) {
    if (titleEl) titleEl.textContent = "未找到条目";
    if (bodyEl) {
      bodyEl.innerHTML =
        '<p>没有这条词条。<a href="wiki.html">返回词云</a></p>';
    }
    renderNav();
    return;
  }

  document.title = `${entry.title} · 校园维基百科`;
  if (titleEl) titleEl.textContent = entry.title;
  if (summaryEl) summaryEl.textContent = entry.summary || "";
  if (crumbEl) crumbEl.textContent = entry.title;

  if (boxEl) {
    if (id === "kongtian") {
      boxEl.hidden = false;
      boxEl.className = "wiki-emblem";
      boxEl.innerHTML = `
        <img src="assets/emblem.webp" alt="空天大学校徽" width="160" height="160" />
        <p>校徽</p>
      `;
    } else {
      boxEl.remove();
    }
  }

  if (bodyEl) {
    bodyEl.innerHTML = (entry.sections || [])
      .map(
        (s) => `
      <section class="wiki-sec" id="${s.id}">
        <h2>${s.title}</h2>
        ${s.html}
      </section>`
      )
      .join("");
  }

  renderNav();
})();
