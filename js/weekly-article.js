(() => {
  const root = document.querySelector("[data-weekly-article]");
  if (!root || !window.WEEKLY_DATA) return;
  const id = new URLSearchParams(location.search).get("id") || "flight-test";
  const article = window.WEEKLY_DATA.articles.find((item) => item.id === id);
  if (!article) {
    root.innerHTML = '<h1>未找到文章</h1><p><a href="weekly.html">返回校园周报</a></p>';
    return;
  }

  const bodies = {
    "flight-test": `
      <p>工程学院航类团队在空天试验区完成新一代场辅助飞行器的首次公开滑行测试。测试当日，空天轴部分路段实施临时交通管制，安全围栏外聚集了不少围观同学。</p>
      <p>项目负责人表示，本次目标不是炫技，而是验证低速工况下的场辅助稳定性与冗余制动。测试数据将回流物理学院与万有能场研究院做交叉复核。</p>
      <h2>校园影响</h2>
      <p>测试窗口内接驳车改线运行。保卫部行政科提前发布了绕行示意图；感知科在场边增设了临时观测岗。</p>
    `,
    "library-summer": `
      <p>中央图书馆宣布暑期延长开放：主馆阅览区至 23:30，夜间学习区继续接受预约。自动灯控与贩卖机补给同步调整。</p>
      <p>馆方提醒：通宵学习可以，但请记得吃饭——校医院那边最近又接收了几例「报告没写完、血糖先写完」的同学。</p>
    `,
    "program-course": `
      <p>工程学院程序设计联合课程本学期面向全校本科开放选课，新增工程实践单元。助教岗仍由高年级同学与提前修完课程的学生分担。</p>
      <p>选课说明里特意写了一句：互测是社交，也是训练。怕也没关系，很少有人能完全躲开。</p>
    `,
    "portal-plan": `
      <p>学生会发布新学期传送阵高峰运行方案：工作日早高峰增开三组短程阵列，并保留步行与接驳车分流。</p>
      <p>北区二号阵列维护窗口仍按周二凌晨执行。导览图会在维护前一晚更新，请勿自行加练意志「硬穿」。</p>
    `,
    "art-exhibition": `
      <p>艺术学院毕业创作展将登陆中央广场，涵盖视觉艺术、公共装置与学生舞台作品。展览周安保由保卫部与学生会联合排班。</p>
      <p>策展团队说，他们想让路过的人也停下几秒——不是为了看懂，而是为了被「生命力」撞一下。</p>
    `,
    "medical-center": `
      <p>医学院与生命科学相关方向共建的联合实验中心投入使用，支持基础医学、生态健康与能场生物效应的规范化观测。</p>
      <p>中心强调：所有涉及人体的观测必须走伦理流程。意志很强，也要吃饭——这句依旧贴在入口告示栏。</p>
    `,
    "field-data": `
      <p>万有能场研究院发布最新扰动观测数据。不同理论团队对同一组结果给出了不同解释，相关讨论将在本周学术会上公开进行。</p>
      <p>研究院重申：能场是常识，不是秘辛；争论被鼓励，把争论写成可复核记录更被鼓励。</p>
    `,
    "field-device": `
      <p>物理学院完成新型场测量装置校准。校准结果将用于下一阶段跨实验室复核，校方不对现有理论作单一结论。</p>
      <p>装置夜间仍会进行无人值守采样。若附近出现异常凉意，请先联系保卫部，不要自行靠近调试。</p>
    `,
    propulsion: `
      <p>工程学院航类实验室开展新一轮推进系统地面试验，重点覆盖低速工况与安全冗余。</p>
      <p>试验区实行分时开放参观。名额有限，加餐传说依旧比成绩单传得快。</p>
    `,
    "library-one-am": `
      <p>凌晨一点的中央图书馆：灯还亮着，键盘声稀稀落落，自动售货机偶尔响一下。</p>
      <p>有人在写 OO 互测反馈，有人在改部刊截稿，有人只是把额头靠在桌上休息五分钟。周报编辑部觉得，这也该被记一笔。</p>
    `,
    "morning-portal": `
      <p>编辑部在四个高峰站点做了一次不太严肃的计时：去上早八之前，传送阵到底要排多久？</p>
      <p>结论因天气、课表与异变预警而浮动。实用建议只有一条——看好导览，早点出门，别把意志浪费在插队上。</p>
    `,
    "club-map": `
      <p>本周六中央广场社团开放日。从飞行器模型社到校园猫观察社，摊位地图已在学生会频道置顶。</p>
      <p>文学创作部会带部刊试读；保卫部感知科也会设志愿咨询台。欢迎把「想加入」说出口。</p>
    `,
    "trial-campus": `
      <p>校园周报试刊号发布。融媒体中心启动校园新闻周度归档计划，记录研究、生活与年轻人的故事。</p>
      <p>试刊阶段欢迎纠错与投稿。社区创作遵循 CC-BY-SA 许可，优质稿件可能进入正式汇编。</p>
    `,
  };

  const body =
    article.body ||
    bodies[article.id] ||
    `<p>${article.summary}</p><p>更多细节仍在采写中。欢迎关注下一期校园周报。</p>`;

  document.title = `${article.title} · 空天大学校园周报`;
  root.innerHTML = `
    <nav class="weekly-breadcrumb"><a href="weekly.html">校园周报</a><span>/</span><span>${article.category}</span></nav>
    <article>
      <header>
        <p class="weekly-section-label">${article.category} · ${article.date}</p>
        <h1>${article.title}</h1>
        <p class="weekly-article-deck">${article.summary}</p>
        <div class="weekly-article-byline">空天大学融媒体中心 · ${article.byline || "校园通讯"}</div>
      </header>
      <div class="weekly-article-body">${body}</div>
    </article>`;
})();
