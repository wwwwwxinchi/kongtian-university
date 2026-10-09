(() => {
  const profiles = {
    bio: {
      focus: ["生命结构", "校园生态", "能场生物学"],
      admit:
        "招收对生命科学、生态与能场生物效应感兴趣的同学。适合愿意在实验室与野外观测之间来回奔走的人。",
      note:
        "生物学院研究生命边界如何在万有能场作用下偏移。地球校区的生态样地与医学院、万有能场研究院常有联合课题。",
    },
    finance: {
      focus: ["公共经济", "星际贸易", "校园金融"],
      admit: "招收关注资源配置、公共财政与未来星际贸易规则的同学。强调可验证的模型，而非口号。",
      note: "金融与经济学院为校园自治与未来分校预算体系提供方法。课程常与律衡学院交叉讨论规则设计。",
    },
    law: {
      focus: ["公共法", "能场伦理", "规则与秩序"],
      admit: "招收希望把「意志改写现实」关进制度笼子的人。需要清晰表达与冷静判断。",
      note: "律衡学院处理能场使用边界、校园安保权限与公共正义。保卫部重大案件常会来这里找依据。",
    },
    education: {
      focus: ["学习科学", "教师培养", "星海教育"],
      admit: "招收对教学设计、成长辅导与跨星知识传递感兴趣的同学。模糊师生边界的校园，更需要会教的人。",
      note: "教育学院研究如何把觉醒、印记与普通学业放在同一套培养框架里，服务百年分校目标。",
    },
    literature: {
      focus: ["文学创作", "叙事研究", "部刊编辑"],
      admit: "招收文字敏感、愿意长期写作的同学。文学创作部在此挂靠活动，部刊是重要出口。",
      note: "文学院相信文字本身可以携带感染力。之吟等创作者的故事，常常从这里写到部刊与更远的读者手里。",
    },
    history: {
      focus: ["星历研究", "校史档案", "文明记忆"],
      admit: "招收愿意整理档案、追问空白的人。星历 1926 建校前后的材料仍在持续归档。",
      note: "历史学院保管校史与星海记忆。老校舍一类「待设定」区域，往往也是他们最想探的地方。",
    },
    physics: {
      focus: ["基础物理", "空间科学", "场论"],
      admit: "招收数理基础扎实、愿意用公式逼近万有能场的同学。与研究院、工程学院共享实验平台。",
      note: "物理学院把「难以捉摸」当成研究起点。场测量装置、扰动数据与多种理论解释在此并行。",
    },
    engineering: {
      focus: ["计算与软件", "机械制造", "航天工程"],
      admit:
        "招收喜欢把构想做成能跑系统的人。含程序设计、制造与航类方向；OO 互测与工坊文化并存。",
      note:
        "工程学院机房与工坊常年亮灯。程旭、田湉、西奥多、星巡等人的日常多半在这里交叉：代码、志愿、建模与加餐传说。",
    },
    agriculture: {
      focus: ["生态农业", "分校粮食系统", "植物科学"],
      admit: "招收关心可持续食物与封闭生态的同学。未来星海分校的餐桌，要从地球校区先算清楚。",
      note: "农学院为地球校区与分校研究可循环的食物与生态。样地夜间有时比教室更热闹。",
    },
    medicine: {
      focus: ["临床医学", "意志与身体", "校园健康"],
      admit: "招收愿意理解身体、意志与能场交界的人。校医院是重要实践点。",
      note: "医学院与校医院紧密协作。幻想过猛、血糖骤降一类个案，会回流成课堂里的真实病例。",
    },
    field: {
      focus: ["万有能场", "觉醒现象", "感知测量"],
      admit: "招收对高概念本身着迷的同学：魔法派与公式派都欢迎，但要能把争论写成可复核记录。部分高风险方向可能限招异能学生，以当年简章为准。",
      note: "万有能场研究院是学校的核心研究枢纽。觉醒、印记与扰动观测从这里进入公开讨论。",
    },
    military: {
      focus: ["飞行训练", "协同指挥", "能场防卫"],
      admit: "招收身体素质与协作意识强的同学。与保卫部战斗科课程交叉，实训强度高；部分飞行/实战专项限招异能学生。",
      note: "军事学院承接飞行与实战训练。端木拓一类战斗科特长生，常在训练场与加餐传说之间被点名。",
    },
    mystic: {
      focus: ["象征学", "直觉研究", "非常规知识"],
      admit: "招收对直觉、象征与尚未编目知识保持耐心的人。需要能区分体验与可公开结论。",
      note: "玄学院收录尚未进入常规学科的路径。它与阿尔卡纳学院相邻，但更强调方法而非收藏。",
    },
    arts: {
      focus: ["视觉艺术", "表演与舞台", "公共创作"],
      admit: "招收以创作感知世界的同学。绘画、舞台与公共装置都在招生范围内。",
      note: "艺术学院把狂暴作画、地下偶像与展览季都看成校园生命力的一种形状。",
    },
    arcana: {
      focus: ["罕见技艺", "失落档案", "跨域研究"],
      admit: "招收能保管秘密、也敢公开提问的人。档案权限分级明确，不适合只想猎奇的报名者。",
      note: "阿尔卡纳学院收藏不宜简单归类的技艺与档案。部分内容只在换届或特批时可见。",
    },
    chemistry: {
      focus: ["化学基础", "先进材料", "星舰材料"],
      admit: "招收喜欢在分子尺度解决问题的同学。材料方向与工程、物理学院共享中试平台。",
      note: "化学与材料学院从分子做到星舰外壳。太空试点学校的硬件底座，很大一块在这里浇筑。",
    },
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
  const profile = profiles[id] || {
    focus: ["教学", "研究", "校园实践"],
    admit: "招生细则仍在整理，欢迎先投递综合意向档案。",
    note: `${faculty.name}位于空天大学十六学院环轨的第 ${index + 1} 席。`,
  };

  document.title = `${faculty.name} · 空天大学`;
  get("[data-faculty-crumb]").textContent = faculty.name;
  get("[data-faculty-code]").textContent = `${faculty.tag} · FACULTY ${String(index + 1).padStart(2, "0")}`;
  get("[data-faculty-name]").textContent = faculty.name;
  get("[data-faculty-seal]").innerHTML = `<img src="${faculty.emblem}" alt="" width="120" height="120">`;
  get("[data-faculty-blurb]").textContent = faculty.blurb;
  get("[data-faculty-index]").textContent = `${String(index + 1).padStart(2, "0")} / ${String(faculties.length).padStart(2, "0")}`;
  get("[data-faculty-note]").textContent = profile.note;
  get("[data-faculty-focus]").innerHTML = profile.focus
    .map((item, itemIndex) => `<span><i>${String(itemIndex + 1).padStart(2, "0")}</i>${item}</span>`)
    .join("");

  const admitEl = get("[data-faculty-admit]");
  if (admitEl) admitEl.textContent = profile.admit;

  const applyLink = get("[data-faculty-apply]");
  if (applyLink) applyLink.href = `https://campus.kongtian.university/`;

  const ids = (window.FACULTY_ROSTER && window.FACULTY_ROSTER[id]) || [];
  const people = get("[data-faculty-people]");
  if (!ids.length) {
    people.innerHTML = `<div class="faculty-empty"><span>${faculty.seal}</span><p>公开人物档案仍在整理。招生请前往校园报名页投递档案。</p><p><a class="text-link" href="https://campus.kongtian.university/" target="_blank" rel="noopener noreferrer">前往官方报名 →</a></p></div>`;
    return;
  }

  people.innerHTML = ids
    .map((characterId) => {
      const character = window.CHARACTERS[characterId];
      if (!character) return "";
      const image = character.cardImage || character.image;
      const media = image
        ? `<img src="${image}" alt="" width="160" height="160" loading="lazy" />`
        : `<span class="char-card-ph" aria-hidden="true">${character.name.slice(0, 1)}</span>`;
      return `<a class="char-card" href="character.html?id=${encodeURIComponent(character.id)}">
      <span class="char-card-media">${media}</span>
      <span class="char-card-body"><strong>${character.name}</strong><span>${character.cardRole || character.role}</span></span>
    </a>`;
    })
    .join("");
})();
