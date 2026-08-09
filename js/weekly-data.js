/** Local editorial data layer. Replace this object with Supabase queries later. */
window.WEEKLY_DATA = {
  issues: [
    { id: "001", label: "第 001 期", dateLabel: "2026 年 8 月", publishedAt: "2026-08-09", description: "记录发生在校园里的研究、生活与年轻人的故事。" },
    { id: "000", label: "试刊号", dateLabel: "2026 年 7 月", publishedAt: "2026-07-26", description: "校园周报编辑部试刊记录。" },
  ],
  articles: [
    { id: "flight-test", issueId: "001", category: "头条", date: "2026-08-09", title: "空天试验区新一代场辅助飞行器完成首次公开滑行测试", summary: "工程学院航类团队近日完成新型场辅助飞行器阶段性测试。测试期间，空天轴部分区域实施临时交通管制，大量学生在安全区域观看了试验过程。", featured: true },
    { id: "library-summer", issueId: "001", category: "校园新闻", date: "2026-08-08", title: "中央图书馆暑期延长开放时间", summary: "主馆阅览区开放至 23:30，夜间学习区继续提供预约席位。" },
    { id: "program-course", issueId: "001", category: "校园新闻", date: "2026-08-07", title: "计算机学院程序设计联合课程开放选课", summary: "跨院联合课程新增工程实践单元，面向全校本科生开放。" },
    { id: "portal-plan", issueId: "001", category: "校园新闻", date: "2026-08-07", title: "学生会发布新学期传送阵高峰运行方案", summary: "工作日早高峰将增开三组短程阵列，并保留步行与接驳车分流方案。" },
    { id: "art-exhibition", issueId: "001", category: "校园新闻", date: "2026-08-06", title: "艺术学院毕业创作展将在中央广场举行", summary: "展览涵盖视觉艺术、公共装置与学生舞台作品。" },
    { id: "medical-center", issueId: "001", category: "校园新闻", date: "2026-08-05", title: "医学院与生命科学学院联合实验中心投入使用", summary: "新中心将支持基础医学、生态健康与能场生物效应的规范化观测。" },
    { id: "field-data", issueId: "001", category: "科研动态", date: "2026-08-08", title: "万有能场研究院发布最新扰动观测数据", summary: "不同理论团队对同一组实验数据给出了不同解释，相关结果将在本周学术讨论会上公开交流。" },
    { id: "field-device", issueId: "001", category: "科研动态", date: "2026-08-06", title: "物理学院完成新型场测量装置校准", summary: "校准结果将用于下一阶段跨实验室复核，不对现有理论作单一结论。" },
    { id: "propulsion", issueId: "001", category: "科研动态", date: "2026-08-04", title: "工程学院航类实验室开展新一轮推进系统测试", summary: "团队围绕低速工况与安全冗余完成多组地面试验。" },
    { id: "library-one-am", issueId: "001", category: "校园生活", date: "2026-08-08", title: "凌晨一点的中央图书馆", summary: "夜间学习区的灯光、自动售货机，以及仍然没写完的报告。" },
    { id: "morning-portal", issueId: "001", category: "校园生活", date: "2026-08-07", title: "去上早八之前，传送阵到底要排多久？", summary: "编辑部在四个高峰站点做了一次不太严肃、但足够实用的计时。" },
    { id: "club-map", issueId: "001", category: "校园生活", date: "2026-08-05", title: "本周社团开放日地图", summary: "从飞行器模型到校园猫观察社，中央广场本周六见。" },
    { id: "trial-campus", issueId: "000", category: "校园新闻", date: "2026-07-26", title: "校园周报试刊号发布", summary: "融媒体中心启动校园新闻周度归档计划。", featured: true },
  ],
  events: [
    { day: "周一", date: "08.10", title: "工程学院公开讲座", note: "航空楼 A201" },
    { day: "周三", date: "08.12", title: "空天试验区飞行测试", note: "部分道路临时管制" },
    { day: "周五", date: "08.14", title: "艺术学院学生展览开幕", note: "中央广场东侧" },
    { day: "周六", date: "08.15", title: "中央广场社团开放日", note: "10:00—18:00" },
  ],
  notices: [
    { id: "road", title: "校园道路调整", text: "空天轴东段周三 13:00—17:00 实施临时交通管制。" },
    { id: "portal", title: "传送阵维护", text: "北区二号阵列将在周二凌晨进行例行维护。" },
    { id: "library", title: "图书馆开放时间", text: "暑期主馆阅览区延长开放至 23:30。" },
    { id: "old-campus", title: "老校区封闭改造提醒", text: "老校区目前仍处于封闭改造状态，请勿翻越围栏或进入施工区域。" },
  ],
};
