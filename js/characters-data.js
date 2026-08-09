/** 院系与人物：摘自《绘空事 主线世界观搭建》 */
window.FACULTIES = [
  {
    id: "bio",
    tag: "BIO",
    seal: "生",
    emblem: "assets/faculty-emblems/web/01-bio.png",
    name: "生物学院",
    blurb: "研究生命、生态与能场作用下的生物边界。",
  },
  {
    id: "finance",
    tag: "FEC",
    seal: "经",
    emblem: "assets/faculty-emblems/web/02-finance.png",
    name: "金融与经济学院",
    blurb: "记录星际贸易、公共财政与校园经济的运行规律。",
  },
  {
    id: "law",
    tag: "LAW",
    seal: "律",
    emblem: "assets/faculty-emblems/web/03-law.png",
    name: "律衡学院",
    blurb: "在规则、正义与复杂现实之间寻找可执行的平衡。",
  },
  {
    id: "education",
    tag: "EDU",
    seal: "育",
    emblem: "assets/faculty-emblems/web/04-education.png",
    name: "教育学院",
    blurb: "研究学习、成长，以及知识如何在星海间传递。",
  },
  {
    id: "literature",
    tag: "LIT",
    seal: "文",
    emblem: "assets/faculty-emblems/web/05-literature.png",
    name: "文学院",
    blurb: "文字在这里被保存、重写，也被赋予改变现实的力量。",
  },
  {
    id: "history",
    tag: "HIS",
    seal: "史",
    emblem: "assets/faculty-emblems/web/06-history.png",
    name: "历史学院",
    blurb: "整理星历以来的记忆，也追问档案没有写下的部分。",
  },
  {
    id: "physics",
    tag: "PHY",
    seal: "理",
    emblem: "assets/faculty-emblems/web/07-physics.png",
    name: "物理学院",
    blurb: "从基础规律出发，描述宇宙与万有能场的尺度。",
  },
  {
    id: "engineering",
    tag: "ENG",
    seal: "工",
    emblem: "assets/faculty-emblems/web/08-engineering.png",
    name: "工程学院",
    blurb: "机房与工坊常年亮灯，让构想成为能够运行的现实。",
  },
  {
    id: "agriculture",
    tag: "AGR",
    seal: "农",
    emblem: "assets/faculty-emblems/web/09-agriculture.png",
    name: "农学院",
    blurb: "为地球校区与未来分校研究可持续的食物与生态。",
  },
  {
    id: "medicine",
    tag: "MED",
    seal: "医",
    emblem: "assets/faculty-emblems/web/10-medicine.png",
    name: "医学院",
    blurb: "理解身体、意志和能场之间细微而真实的联系。",
  },
  {
    id: "field",
    tag: "UFR",
    seal: "场",
    emblem: "assets/faculty-emblems/web/11-field.png",
    name: "万有能场研究院",
    blurb: "研究本校最核心、也最难以被完全定义的高维现象。",
  },
  {
    id: "military",
    tag: "MIL",
    seal: "武",
    emblem: "assets/faculty-emblems/web/12-military.png",
    name: "军事学院",
    blurb: "飞行、协同与实战训练在此交汇，并与保卫部密切协作。",
  },
  {
    id: "mystic",
    tag: "XUA",
    seal: "玄",
    emblem: "assets/faculty-emblems/web/13-mystic.png",
    name: "玄学院",
    blurb: "研究直觉、象征与尚未进入常规学科体系的知识。",
  },
  {
    id: "arts",
    tag: "ART",
    seal: "艺",
    emblem: "assets/faculty-emblems/web/14-arts.png",
    name: "艺术学院",
    blurb: "绘画、表演与创作在这里成为感知世界的另一种方式。",
  },
  {
    id: "arcana",
    tag: "ARC",
    seal: "秘",
    emblem: "assets/faculty-emblems/web/15-arcana.png",
    name: "阿尔卡纳学院",
    blurb: "收藏罕见技艺、失落知识与不宜被简单归类的档案。",
  },
  {
    id: "chemistry",
    tag: "CME",
    seal: "化",
    emblem: "assets/faculty-emblems/web/16-chemistry.png",
    name: "化学与材料学院",
    blurb: "从分子到星舰材料，研究物质如何被重新组织。",
  },
];

window.CHARACTERS = {
  zhiyin: {
    id: "zhiyin",
    name: "之吟",
    faculty: "literature",
    facultyName: "文学院",
    role: "在读学生 · 文学创作部",
    cardRole: "文学院 · 文学创作部",
    image: "assets/chars/zhiyin.webp",
    cardImage: "assets/chars/zhiyin-card.webp",
    gender: "—",
    summary: "经常出现在校医院。文笔极佳，是文学创作部的一员。外表柔弱，内心很强。",
    facts: [
      ["所属", "文学院 · 文学创作部"],
      ["印记", "手心"],
      ["技能", "写出的文字极具感染力"],
      ["常出入", "校医院"],
    ],
    sections: [
      {
        title: "简介",
        html: `
          <p>之吟经常出现在校医院，身体没那么好。原生家庭比较悲惨。</p>
          <p>似乎因为会突然陷入幻想，消耗大量血糖而导致昏迷。医生常说：意志很强，也要吃饭。</p>
        `,
      },
      {
        title: "性格与能力",
        html: `
          <p>外表柔弱，实则内心很强大。很喜欢病房外的那一株青绿色的松树。</p>
          <p>文笔极佳，是文学创作部的一员。技能：写出的文字极具感染力。</p>
          <p>印记在手心。</p>
        `,
      },
    ],
  },

  chishuiye: {
    id: "chishuiye",
    name: "池水冶",
    faculty: "engineering",
    facultyName: "工程学院",
    role: "文学创作部干事",
    cardRole: "工程学院 · 文学创作部干事",
    image: null,
    cardImage: null,
    summary:
      "这个世界神明一般的存在。可以随心所欲操纵万有能场改变、重塑世界。热爱学生们的生命力，一直作为观众温柔地注视每一个人。",
    facts: [
      ["所属", "工程学院"],
      ["身份", "文学创作部干事（自第一届文学部创立起）"],
      ["能力", "操纵万有能场，改变、重塑世界"],
    ],
    sections: [
      {
        title: "简介",
        html: `
          <p>池水冶挂在工程学院名下，却更常以文学创作部干事的身份被人看见。</p>
          <p>从空天大学第一届文学部创立开始，便一直作为干事活跃着。大家都认为他是个老师；只有每一届的文学创作部部长知道他的真实身份——这个真相像核武器密码箱一样，只在部长换届时传递。</p>
        `,
      },
      {
        title: "能力与态度",
        html: `
          <p>他是这个世界神明一般的存在，可以随心所欲操纵万有能场改变、重塑世界。</p>
          <p>热爱着空天大学中学生们的生命力，一直作为观众，温柔地、默默地注视着每一个人。拥有强大的生命力却不滥用。</p>
        `,
      },
    ],
  },

  tiantian: {
    id: "tiantian",
    name: "田湉",
    faculty: "engineering",
    facultyName: "工程学院",
    role: "在读学生",
    cardRole: "工程学院学生",
    image: "assets/chars/tiantian.webp",
    cardImage: "assets/chars/tiantian2-card.webp",
    summary:
      "和计院普通学生不同：极其活泼天真，高能量 ENFP。头上的小啾啾似乎对她很重要。常去做保卫部相关志愿。",
    facts: [
      ["所属", "工程学院"],
      ["性格", "高能量 ENFP"],
      ["志愿", "保卫部侦察 / 感知相关志愿"],
      ["特征", "头上的小啾啾"],
    ],
    sections: [
      {
        title: "简介",
        html: `
          <p>田湉就读于工程学院。和学院里许多埋头写代码的同学不同，田子休极其活泼天真，是高能量的 ENFP，快乐小狗。</p>
          <p>有很多工程学院的男生暗恋她。头上的小啾啾似乎对她很重要。</p>
        `,
      },
      {
        title: "校园生活",
        html: `
          <p>经常去做保卫部侦察科的志愿工作，乐此不疲。</p>
          <p>和程旭之间，有人用「冤家」来形容两人的关系。</p>
        `,
      },
    ],
  },

  chengxu: {
    id: "chengxu",
    name: "程旭",
    faculty: "engineering",
    facultyName: "工程学院",
    role: "大二学生 · 程序设计助教",
    cardRole: "工程学院大二 · 助教",
    image: "assets/chars/chengxu.webp",
    cardImage: "assets/chars/chengxu-card.webp",
    gender: "男",
    age: "16",
    height: "160cm",
    alias: "ctrl V",
    summary:
      "15 岁被大学提前录取。表面高冷，其实是语言交流有障碍。能打开「黑窗口」与人对话。",
    facts: [
      ["网名", "ctrl V"],
      ["性别", "男"],
      ["年龄", "16"],
      ["身高", "160（正太体型）"],
      ["所属", "工程学院大二 · 大一程序设计助教"],
      ["印记", "致敬底特律变人风格的界面感造型"],
    ],
    sections: [
      {
        title: "简介",
        html: `
          <p>程旭，网名 ctrl V。男，16 岁，身高 160，正太体型。</p>
          <p>母语是 C 语言，计算机语言全精通。父母都是计算机科学家；双亲精神力太高，导致他出生时与语言有关的脑区变异，母语产生了奇妙的变化。</p>
          <p>15 岁就被大学提前录取。现在大二，已经修完大学四年的全部课程，担任大一程序设计的助教。</p>
        `,
      },
      {
        title: "性格与外观",
        html: `
          <p>表面高冷，没有人见过他开口说话，但其实是因为语言交流有障碍，正在和留学生一起上语言班，补习中文。</p>
          <p>内里其实有隐藏的话痨属性。喜欢一些奇怪的动物（变色龙等冷血动物），认为它们很可爱。</p>
          <p>外观：看起来高冷 / 社恐的小男孩，穿卫衣，身上或许会有小动物挂饰。</p>
        `,
      },
      {
        title: "特殊能力：黑窗口",
        html: `
          <p>能在现实世界打开一个类似于编程界面的「黑窗口」，在里面运行程序，产物有几率变成实体。</p>
          <p>平常靠这个和别人对话：黑窗口里 <code>printf("要说的话")</code>，三次元头顶会显示气泡。</p>
        `,
      },
    ],
  },

  theodore: {
    id: "theodore",
    name: "西奥多",
    faculty: "engineering",
    facultyName: "工程学院",
    role: "留学生 · 在读",
    cardRole: "工程学院 · 留学生",
    image: null,
    cardImage: null,
    gender: "男",
    age: "18",
    height: "188cm",
    summary:
      "阳光大金毛。金发，中法混血，以留学生身份进入工程学院。运气极佳。",
    facts: [
      ["性别", "男"],
      ["年龄", "18"],
      ["身高", "188cm"],
      ["所属", "工程学院 · 留学生"],
      ["技能", "运气极佳"],
      ["印记", "腹肌上"],
    ],
    sections: [
      {
        title: "简介",
        html: `
          <p>西奥多，男，18 岁，身高 188cm。阳光大金毛，看起来懒洋洋的，上课经常摸鱼。很聪明但懒得学——「成绩这种东西，差不多就好啦」。</p>
          <p>金发，中法混血，以留学生的身份被录取进工程学院。</p>
        `,
      },
      {
        title: "校园生活",
        html: `
          <p>留学生大一都要上语言班，因此虽然中文算他半个母语，他还是得去「补习中文」。</p>
          <p>因为性格好、脸帅且擅长各种运动，在年级里小有名气，人缘很好。或许有隐藏的腹黑属性。</p>
          <p>与程旭之间有人称作「社会主义兄弟情」。技能：运气极佳。印记在腹肌上。</p>
        `,
      },
    ],
  },

  xingxun: {
    id: "xingxun",
    name: "星巡",
    faculty: "engineering",
    facultyName: "工程学院",
    role: "在读学生",
    cardRole: "工程学院学生",
    image: "assets/chars/xingxun.webp",
    cardImage: "assets/chars/xingxun-card.webp",
    summary: "工程学院。技能偏向 3D 自动建模，手却更精巧。很擅长跳舞。ENTP。",
    facts: [
      ["所属", "工程学院"],
      ["性格", "ENTP"],
      ["技能", "3D 自动建模；手工比打印更好"],
      ["印记", "齿轮 · 手腕上"],
      ["其他", "很擅长跳舞"],
    ],
    sections: [
      {
        title: "简介",
        html: `
          <p>星巡就读于工程学院。技能是 3D 自动建模，但现在都不会用建模软件——手很精巧，手工制作的比 3D 打印的好。</p>
          <p>小时候非常喜欢拼积木。很擅长跳舞。ENTP。</p>
        `,
      },
      {
        title: "印记",
        html: `<p>印记是齿轮，在手腕上。</p>`,
      },
    ],
  },

  duanmutuo: {
    id: "duanmutuo",
    name: "端木拓",
    faculty: "military",
    facultyName: "军事学院",
    role: "战斗科特长生",
    cardRole: "军事学院 · 飞行方向",
    image: "assets/chars/duanmutuo.webp",
    cardImage: "assets/chars/duanmutuo-card.webp",
    gender: "男",
    age: "18",
    height: "185cm",
    summary: "身体很壮。军事学院飞行方向，战斗科特长生。很能吃，很会做饭。",
    facts: [
      ["性别", "男"],
      ["年龄", "18"],
      ["身高", "185（青年体型）"],
      ["所属", "军事学院 · 飞行方向 · 战斗科特长生"],
      ["技能", "增益 buff：血条升高、攻击力增强"],
      ["印记", "肱二头肌"],
    ],
    sections: [
      {
        title: "简介",
        html: `
          <p>端木拓，男，18 岁，身高 185，青年体型。身体很壮。</p>
          <p>战斗科特长生，军事学院飞行方向。很能吃，很会做饭。</p>
        `,
      },
      {
        title: "能力",
        html: `
          <p>技能：增益 buff——血条升高、攻击力增强。</p>
          <p>印记在肱二头肌。</p>
        `,
      },
    ],
  },

  yangyang: {
    id: "yangyang",
    name: "杨阳青梅",
    faculty: "arts",
    facultyName: "艺术学院",
    role: "美术系学生",
    cardRole: "艺术学院 · 美术系学生",
    image: "assets/chars/yangyang.webp",
    cardImage: "assets/chars/yangyang-card.webp",
    age: "20",
    summary:
      "美术系学生。头发是画笔，可变形。进入狂暴模式后绘画能力超群。印记：眼影。",
    facts: [
      ["年龄", "20"],
      ["所属", "艺术学院 · 美术系"],
      ["技能", "狂暴：进入后绘画能力超群；头发可作为画笔"],
      ["印记", "眼影"],
      ["执念", "对清华美院有一定执念，复读一年依旧来到空天"],
    ],
    sections: [
      {
        title: "简介",
        html: `
          <p>杨阳青梅，20 岁，美术系学生。对清华美院有一定执念，复读一年依旧来到这里。</p>
          <p>头发是画笔，可变形（不同笔）。涂鸦前或许伴随「破坏」，再进入涂鸦。</p>
        `,
      },
      {
        title: "能力与印记",
        html: `
          <p>技能：狂暴——进入狂暴模式后绘画能力超群。</p>
          <p>印记：眼影。</p>
        `,
      },
    ],
  },

  zelie: {
    id: "zelie",
    name: "泽莉",
    faculty: "engineering",
    facultyName: "工程学院",
    role: "在读学生",
    cardRole: "工程学院学生",
    image: "assets/chars/zelie.webp",
    cardImage: "assets/chars/zelie-card.webp",
    summary: "中法相关人脉中的「傲娇大小姐」。西奥多的堂亲。",
    facts: [
      ["所属", "工程学院"],
      ["关系", "西奥多的堂亲"],
      ["印象", "傲娇大小姐"],
    ],
    sections: [
      {
        title: "简介",
        html: `
          <p>泽莉（Zelie）。人际关系图里标着西奥多的堂亲，也被称作傲娇大小姐。</p>
          <p>更细的设定仍在补充。校园里能看见她与中法留学生圈子有往来。</p>
        `,
      },
    ],
  },

  diu: {
    id: "diu",
    name: "地偶",
    faculty: "arts",
    facultyName: "艺术学院",
    role: "在读学生 · 地下偶像",
    cardRole: "艺术学院 · 地下偶像",
    image: "assets/chars/diu.webp",
    cardImage: "assets/chars/diu-card.webp",
    summary: "地下偶像。和之吟是超级好朋友。有自己的粉丝与物料。",
    facts: [
      ["所属", "艺术学院"],
      ["身份", "地下偶像"],
      ["关系", "与之吟：真心换真心的超级好朋友"],
    ],
    sections: [
      {
        title: "简介",
        html: `
          <p>地偶在校园内外以地下偶像活动。物料包括小卡片、吧唧、贴纸、挂件、雨伞、书签等。</p>
          <p>与之吟是超级好朋友。也是泽莉的超级粉丝之一。</p>
        `,
      },
    ],
  },
};

window.FACULTY_ROSTER = {
  bio: [],
  finance: [],
  law: [],
  education: [],
  literature: ["zhiyin"],
  history: [],
  physics: [],
  engineering: ["chengxu", "tiantian", "theodore", "chishuiye", "zelie", "xingxun"],
  agriculture: [],
  medicine: [],
  field: [],
  military: ["duanmutuo"],
  mystic: [],
  arts: ["yangyang", "diu"],
  arcana: [],
  chemistry: [],
};
