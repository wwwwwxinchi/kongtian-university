(() => {
  const params = new URLSearchParams(location.search);
  const id = params.get("id");
  const c = id && window.CHARACTERS && window.CHARACTERS[id];

  const nameEl = document.querySelector("[data-char-name]");
  const roleEl = document.querySelector("[data-char-role]");
  const summaryEl = document.querySelector("[data-char-summary]");
  const mediaEl = document.querySelector("[data-char-media]");
  const factsEl = document.querySelector("[data-char-facts]");
  const bodyEl = document.querySelector("[data-char-body]");
  const crumbEl = document.querySelector("[data-char-crumb]");
  const backEl = document.querySelector("[data-char-back]");

  if (!c) {
    if (nameEl) nameEl.textContent = "未找到人物";
    if (bodyEl) {
      bodyEl.innerHTML = '<p>没有这位同学的档案。<a href="faculties.html">返回院系</a></p>';
    }
    return;
  }

  document.title = `${c.name} · 院系 · 空天大学`;
  if (nameEl) nameEl.textContent = c.name;
  if (roleEl) roleEl.textContent = c.role;
  if (summaryEl) summaryEl.textContent = c.summary || "";
  if (crumbEl) crumbEl.textContent = c.name;
  if (backEl) {
    backEl.href = `faculties.html?dept=${encodeURIComponent(c.faculty)}`;
    backEl.textContent = `← ${c.facultyName || "院系"}`;
  }

  if (mediaEl) {
    if (c.image) {
      mediaEl.innerHTML = `<img src="${c.image}" alt="${c.name}" width="360" height="480" />`;
    } else {
      mediaEl.innerHTML = `<div class="char-detail-ph">${c.name.slice(0, 1)}</div><p class="char-detail-ph-note">立绘待补充</p>`;
    }
  }

  if (factsEl) {
    factsEl.innerHTML = (c.facts || [])
      .map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`)
      .join("");
  }

  if (bodyEl) {
    bodyEl.innerHTML = (c.sections || [])
      .map(
        (s) => `
      <section class="char-sec">
        <h2>${s.title}</h2>
        ${s.html}
      </section>`
      )
      .join("");
  }
})();
