(() => {
  const profiles = {
    bio: ["生命结构", "校园生态", "能场生物学"],
    finance: ["公共经济", "星际贸易", "校园金融"],
    law: ["公共法", "能场伦理", "规则与秩序"],
    education: ["学习科学", "教师培养", "星海教育"],
    literature: ["文学创作", "叙事研究", "部刊编辑"],
    history: ["星历研究", "校史档案", "文明记忆"],
    physics: ["基础物理", "空间科学", "场论"],
    engineering: ["计算与软件", "机械制造", "航天工程"],
    agriculture: ["生态农业", "分校粮食系统", "植物科学"],
    medicine: ["临床医学", "意志与身体", "校园健康"],
    field: ["万有能场", "觉醒现象", "感知测量"],
    military: ["飞行训练", "协同指挥", "能场防卫"],
    mystic: ["象征学", "直觉研究", "非常规知识"],
    arts: ["视觉艺术", "表演与舞台", "公共创作"],
    arcana: ["罕见技艺", "失落档案", "跨域研究"],
    chemistry: ["化学基础", "先进材料", "星舰材料"],
  };

  const params = new URLSearchParams(location.search);
  const id = params.get("id") || "bio";
  const faculties = window.FACULTIES || [];
  const faculty = faculties.find((item) => item.id === id);
  const get = (selector) => document.querySelector(selector);

  if (!faculty) {
    get("[data-faculty-name]").textContent = "未找到学院";
    get("[data-faculty-blurb]").textContent = "这条学院档案不存在，请返回院系星图重新选择。";
    return;
  }

  const index = faculties.indexOf(faculty);
  const focus = profiles[id] || ["教学", "研究", "校园实践"];
  document.title = `${faculty.name} · 空天大学`;
  get("[data-faculty-crumb]").textContent = faculty.name;
  get("[data-faculty-code]").textContent = `${faculty.tag} · FACULTY ${String(index + 1).padStart(2, "0")}`;
  get("[data-faculty-name]").textContent = faculty.name;
  get("[data-faculty-seal]").innerHTML = `<img src="${faculty.emblem}" alt="" width="120" height="120">`;
  get("[data-faculty-blurb]").textContent = faculty.blurb;
  get("[data-faculty-index]").textContent = `${String(index + 1).padStart(2, "0")} / ${String(faculties.length).padStart(2, "0")}`;
  get("[data-faculty-note]").textContent = `${faculty.name}位于空天大学十六学院环轨的第 ${index + 1} 席。教学与研究从地球校区出发，同时为未来星海分校积累方法、人才与档案。`;
  get("[data-faculty-focus]").innerHTML = focus
    .map((item, itemIndex) => `<span><i>${String(itemIndex + 1).padStart(2, "0")}</i>${item}</span>`)
    .join("");

  const ids = (window.FACULTY_ROSTER && window.FACULTY_ROSTER[id]) || [];
  const people = get("[data-faculty-people]");
  if (!ids.length) {
    people.innerHTML = `<div class="faculty-empty"><span>${faculty.seal}</span><p>公开人物档案仍在整理。学院主页会随世界观设定持续更新。</p></div>`;
    return;
  }

  people.innerHTML = ids.map((characterId) => {
    const character = window.CHARACTERS[characterId];
    const image = character.cardImage || character.image;
    const media = image
      ? `<img src="${image}" alt="" width="160" height="160" loading="lazy" />`
      : `<span class="char-card-ph" aria-hidden="true">${character.name.slice(0, 1)}</span>`;
    return `<a class="char-card" href="character.html?id=${encodeURIComponent(character.id)}">
      <span class="char-card-media">${media}</span>
      <span class="char-card-body"><strong>${character.name}</strong><span>${character.cardRole || character.role}</span></span>
    </a>`;
  }).join("");
})();
