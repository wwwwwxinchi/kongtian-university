/** 院系与人物：摘自《绘空事 主线世界观搭建》 */
window.FACULTIES = [
  {
    id: "cs",
    tag: "CS",
    name: "计算机学院",
    blurb: "学习氛围极其浓郁。OO 互测常挂在嘴边。",
  },
  {
    id: "flight",
    tag: "Flight",
    name: "飞行学院",
    blurb: "实训多，与战斗科课程常有交叉。",
  },
  {
    id: "me",
    tag: "ME",
    name: "机械工程学院",
    blurb: "工坊灯火通明。手作与建模并不互相排斥。",
  },
  {
    id: "arts",
    tag: "Arts",
    name: "人文学院",
    blurb: "文学创作、美术与更多以文字和画面立人的地方。",
  },
];

window.CHARACTERS = {
  zhiyin: {
    id: "zhiyin",
    name: "之吟",
    faculty: "arts",
    facultyName: "人文学院",
    role: "在读学生 · 文学创作部",
    cardRole: "人文学院 · 文学创作部",
    image: "assets/chars/zhiyin.webp",
    cardImage: "assets/chars/zhiyin-card.webp",
    gender: "—",
    summary: "经常出现在校医院。文笔极佳，是文学创作部的一员。外表柔弱，内心很强。",
    facts: [
      ["所属", "人文学院 · 文学创作部"],
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
    faculty: "cs",
    facultyName: "计算机学院",
    role: "文学创作部干事",
    cardRole: "计算机学院 · 文学创作部干事",
    image: null,
    cardImage: null,
    summary:
      "这个世界神明一般的存在。可以随心所欲操纵万有能场改变、重塑世界。热爱学生们的生命力，一直作为观众温柔地注视每一个人。",
    facts: [
      ["所属", "计算机学院"],
      ["身份", "文学创作部干事（自第一届文学部创立起）"],
      ["能力", "操纵万有能场，改变、重塑世界"],
    ],
    sections: [
      {
        title: "简介",
        html: `
          <p>池水冶挂在计算机学院名下，却更常以文学创作部干事的身份被人看见。</p>
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
    faculty: "cs",
    facultyName: "计算机学院",
    role: "在读学生",
    cardRole: "计算机学院学生",
    image: "assets/chars/tiantian.webp",
    cardImage: "assets/chars/tiantian2-card.webp",
    summary:
      "和计院普通学生不同：极其活泼天真，高能量 ENFP。头上的小啾啾似乎对她很重要。常去做保卫部相关志愿。",
    facts: [
      ["所属", "计算机学院"],
      ["性格", "高能量 ENFP"],
      ["志愿", "保卫部侦察 / 感知相关志愿"],
      ["特征", "头上的小啾啾"],
    ],
    sections: [
      {
        title: "简介",
        html: `
          <p>田湉就读于计算机学院。和学院里许多埋头写代码的同学不同，田子休极其活泼天真，是高能量的 ENFP，快乐小狗。</p>
          <p>有很多计算机学院的男生暗恋她。头上的小啾啾似乎对她很重要。</p>
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
    faculty: "cs",
    facultyName: "计算机学院",
    role: "大二学生 · 程序设计助教",
    cardRole: "计算机学院大二 · 助教",
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
      ["所属", "计算机学院大二 · 大一程序设计助教"],
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
    faculty: "cs",
    facultyName: "计算机学院",
    role: "留学生 · 在读",
    cardRole: "计算机学院 · 留学生",
    image: null,
    cardImage: null,
    gender: "男",
    age: "18",
    height: "188cm",
    summary:
      "阳光大金毛。金发，中法混血，以留学生身份进入计算机学院。运气极佳。",
    facts: [
      ["性别", "男"],
      ["年龄", "18"],
      ["身高", "188cm"],
      ["所属", "计算机学院 · 留学生"],
      ["技能", "运气极佳"],
      ["印记", "腹肌上"],
    ],
    sections: [
      {
        title: "简介",
        html: `
          <p>西奥多，男，18 岁，身高 188cm。阳光大金毛，看起来懒洋洋的，上课经常摸鱼。很聪明但懒得学——「成绩这种东西，差不多就好啦」。</p>
          <p>金发，中法混血，以留学生的身份被录取进计算机学院。</p>
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
    faculty: "me",
    facultyName: "机械工程学院",
    role: "在读学生",
    cardRole: "机械工程学院学生",
    image: "assets/chars/xingxun.webp",
    cardImage: "assets/chars/xingxun-card.webp",
    summary: "机械工程学院。技能偏向 3D 自动建模，手却更精巧。很擅长跳舞。ENTP。",
    facts: [
      ["所属", "机械工程学院"],
      ["性格", "ENTP"],
      ["技能", "3D 自动建模；手工比打印更好"],
      ["印记", "齿轮 · 手腕上"],
      ["其他", "很擅长跳舞"],
    ],
    sections: [
      {
        title: "简介",
        html: `
          <p>星巡就读于机械工程学院。技能是 3D 自动建模，但现在都不会用建模软件——手很精巧，手工制作的比 3D 打印的好。</p>
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
    faculty: "flight",
    facultyName: "飞行学院",
    role: "战斗科特长生",
    cardRole: "飞行学院 · 战斗科特长生",
    image: "assets/chars/duanmutuo.webp",
    cardImage: "assets/chars/duanmutuo-card.webp",
    gender: "男",
    age: "18",
    height: "185cm",
    summary: "身体很壮。飞行学院，战斗科特长生。很能吃，很会做饭。",
    facts: [
      ["性别", "男"],
      ["年龄", "18"],
      ["身高", "185（青年体型）"],
      ["所属", "飞行学院 · 战斗科特长生"],
      ["技能", "增益 buff：血条升高、攻击力增强"],
      ["印记", "肱二头肌"],
    ],
    sections: [
      {
        title: "简介",
        html: `
          <p>端木拓，男，18 岁，身高 185，青年体型。身体很壮。</p>
          <p>战斗科特长生，飞行学院。很能吃，很会做饭。</p>
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
    facultyName: "人文学院",
    role: "美术系学生",
    cardRole: "人文学院 · 美术系学生",
    image: "assets/chars/yangyang.webp",
    cardImage: "assets/chars/yangyang-card.webp",
    age: "20",
    summary:
      "美术系学生。头发是画笔，可变形。进入狂暴模式后绘画能力超群。印记：眼影。",
    facts: [
      ["年龄", "20"],
      ["所属", "人文学院 · 美术系"],
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
    faculty: "cs",
    facultyName: "计算机学院",
    role: "在读学生",
    cardRole: "计算机学院学生",
    image: "assets/chars/zelie.webp",
    cardImage: "assets/chars/zelie-card.webp",
    summary: "中法相关人脉中的「傲娇大小姐」。西奥多的堂亲。",
    facts: [
      ["所属", "计算机学院"],
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
    facultyName: "人文学院",
    role: "在读学生 · 地下偶像",
    cardRole: "人文学院 · 地下偶像",
    image: "assets/chars/diu.webp",
    cardImage: "assets/chars/diu-card.webp",
    summary: "地下偶像。和之吟是超级好朋友。有自己的粉丝与物料。",
    facts: [
      ["所属", "人文学院"],
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
  cs: ["chengxu", "tiantian", "theodore", "chishuiye", "zelie"],
  flight: ["duanmutuo"],
  me: ["xingxun"],
  arts: ["zhiyin", "yangyang", "diu"],
};
