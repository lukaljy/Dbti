(() => {
  const internalDimensions = [
    ["attackPressure", "攻击压迫"],
    ["defensiveDissection", "防守拆解"],
    ["frameworkModeling", "框架建模"],
    ["criterionSensitivity", "判准敏感"],
    ["evidenceDependence", "资料依赖"],
    ["logicPurity", "逻辑洁癖"],
    ["expressionImpact", "表达感染"],
    ["punchlineImpulse", "金句冲动"],
    ["impromptuCounter", "即兴反打"],
    ["riskPreference", "风险偏好"],
    ["teammateRelay", "队友接线"],
    ["battlefieldControl", "战场统筹"],
    ["winObsession", "胜负欲"],
    ["reviewCompulsion", "复盘强迫"],
    ["memeDensity", "整活浓度"],
    ["emotionSpike", "上头指数"]
  ].map(([key, label]) => ({ key, label }));

  const displayDimensions = [
    ["attackDefense", "攻防风格", "attackPressure", "defensiveDissection"],
    ["structureControl", "结构控制", "frameworkModeling", "criterionSensitivity"],
    ["argumentStyle", "论证方式", "logicPurity", "evidenceDependence"],
    ["expressionTension", "表达张力", "expressionImpact", "punchlineImpulse"],
    ["liveCombat", "临场能力", "impromptuCounter", "riskPreference"],
    ["teamwork", "团队协作", "teammateRelay", "battlefieldControl"],
    ["competitiveIntensity", "竞技强度", "winObsession", "reviewCompulsion"],
    ["debateNoise", "人格噪声", "memeDensity", "emotionSpike"]
  ].map(([key, label, primary, secondary]) => ({ key, label, primary, secondary }));

  const makeProfile = (overrides) => {
    const profile = Object.fromEntries(internalDimensions.map((dimension) => [dimension.key, 50]));
    return { ...profile, ...overrides };
  };

  const makeType = ({ code, name, tagline, profile, normal, savage }) => ({
    code,
    name,
    tagline,
    profile: makeProfile(profile),
    copy: {
      mild: `你测出了 DBTI 人格：${name}。这类人格在赛场上有明确的风格倾向，但仍需要结合具体辩题和队友配置判断。`,
      normal,
      savage
    },
    share: {
      mild: `我测出了 DBTI 人格：${name}。`,
      normal: `我的 DBTI 是${name}，${tagline}`,
      savage: `我的 DBTI 是${name}。${savage}`
    }
  });

  const questions = [
    {
      id: "q001",
      text: "自由辩刚开始，对方一辩抛出一个你觉得明显偷换概念的定义，你会：",
      options: [
        {
          label: "A",
          text: "立刻站起来追问，先把定义钉死，再顺手把对面整条线拎起来抖一抖。",
          effects: { attackPressure: 36, impromptuCounter: 24, riskPreference: 16, emotionSpike: 12 }
        },
        {
          label: "B",
          text: "先记下来，等对方链条走完再拆。现在急着打，容易把自己也炸进去。",
          effects: { defensiveDissection: 34, logicPurity: 22, teammateRelay: 14, emotionSpike: -18 }
        },
        {
          label: "C",
          text: "把它放回评委最该看的判准里处理：这不是定义问题，这是比较标准问题。",
          effects: { frameworkModeling: 32, criterionSensitivity: 28, battlefieldControl: 18, riskPreference: -10 }
        },
        {
          label: "D",
          text: "翻资料夹，找出三个案例、两篇论文和一个赛后复盘，证明这不是第一次有人这么偷。",
          effects: { evidenceDependence: 36, reviewCompulsion: 24, logicPurity: 16, expressionImpact: -8 }
        }
      ]
    }
  ];

  const personalityTypes = [
    makeType({
      code: "FREE-KILL",
      name: "自由辩查杀者",
      tagline: "对面刚开口，你已经在脑内按下红色警报。",
      profile: { attackPressure: 92, impromptuCounter: 88, riskPreference: 72, emotionSpike: 64 },
      normal: "你像自由辩里的警犬，对方概念刚飘出来，你已经闻到味了。",
      savage: "你不是在质询，你是在给对方论点做当场尸检。"
    }),
    makeType({
      code: "FRAME-ARCH",
      name: "框架建筑师",
      tagline: "你不急着赢一句话，你要先把整场比赛的地基打掉。",
      profile: { frameworkModeling: 94, criterionSensitivity: 86, battlefieldControl: 78, logicPurity: 72 },
      normal: "你喜欢先画地图再开战，评委只要进了你的框架，就很难全身而退。",
      savage: "你不是在立论，你是在给评委装修一间只能判你赢的样板房。"
    }),
    makeType({
      code: "DATA-ENGINE",
      name: "资料组永动机",
      tagline: "只要还有一篇论文没搜到，你就不算真正睡觉。",
      profile: { evidenceDependence: 96, reviewCompulsion: 82, logicPurity: 72, winObsession: 66 },
      normal: "你的资料夹像一个小型数据库，队友说缺例子，你说缺的是检索词。",
      savage: "你不是在备赛，你是在给辩题做法医数据库。"
    }),
    makeType({
      code: "SUMMARY-MORT",
      name: "结辩殡仪馆馆长",
      tagline: "你负责把全场尸体摆整齐，再举行一次有尊严的告别仪式。",
      profile: { battlefieldControl: 92, expressionImpact: 82, frameworkModeling: 78, defensiveDissection: 74 },
      normal: "别人打完一地碎片，你上来把它们排成胜负关系。",
      savage: "你一开口，像在给对面论点补办死亡证明。"
    }),
    makeType({
      code: "BRIEF-PRINTER",
      name: "立论打印机",
      tagline: "你的稿子不一定最炸，但通常最像能交给评委的东西。",
      profile: { frameworkModeling: 86, logicPurity: 78, evidenceDependence: 66, riskPreference: 24 },
      normal: "你的世界里没有临场奇迹，只有赛前写好的第一、第二、第三。",
      savage: "你像一台有感情的打印机，唯一的叛逆是页码偶尔不居中。"
    }),
    makeType({
      code: "QA-ROLLER",
      name: "质询压路机",
      tagline: "你的问题不是一个接一个，是一排接一排。",
      profile: { attackPressure: 98, riskPreference: 76, expressionImpact: 70, emotionSpike: 70 },
      normal: "你质询时不像在提问，更像在把对方论点按进计时器里。",
      savage: "你一站起来，对面就开始怀念陈词阶段的和平年代。"
    }),
    makeType({
      code: "DEFUSE-EXPERT",
      name: "防守拆弹专家",
      tagline: "队友留下的爆炸物，对方埋下的雷，你都能蹲下来剪线。",
      profile: { defensiveDissection: 96, logicPurity: 80, teammateRelay: 72, emotionSpike: 24 },
      normal: "你不一定最抢眼，但你总能把马上爆炸的战场拆成安全模式。",
      savage: "别人负责放火，你负责拿灭火器还要顺手写事故报告。"
    }),
    makeType({
      code: "LOGIC-PURITY",
      name: "逻辑洁癖患者",
      tagline: "链条断了半厘米，你的表情已经替评委扣完分。",
      profile: { logicPurity: 98, frameworkModeling: 74, criterionSensitivity: 68, memeDensity: 24 },
      normal: "你听比赛时像在做代码审查，一旦链条断裂就想当场标红。",
      savage: "你不是听不懂对方，你是受不了他们把逻辑当一次性餐具。"
    }),
    makeType({
      code: "JUDGE-WHISPER",
      name: "评委读心术士",
      tagline: "你不是在看对手，你是在看评委到底准备怎么投。",
      profile: { criterionSensitivity: 96, frameworkModeling: 78, expressionImpact: 66, battlefieldControl: 64 },
      normal: "你像在和评委隔空对暗号，每个标准都递到对方笔尖上。",
      savage: "你打比赛像在破解评委 Wi-Fi，密码通常叫判准。"
    }),
    makeType({
      code: "TEAM-NANNY",
      name: "队伍保姆型人格",
      tagline: "队友负责飞，你负责把每一根线都接回地球。",
      profile: { teammateRelay: 98, battlefieldControl: 76, defensiveDissection: 70, reviewCompulsion: 66 },
      normal: "你不是没有攻击性，你只是大部分精力都在把队友从悬崖边拉回来。",
      savage: "你打的不是辩论，是四个人格外包给你一个人做售后。"
    }),
    makeType({
      code: "VIBE-CREW",
      name: "赛场气氛组",
      tagline: "观众记住了你，评委也许还在找你的论点。",
      profile: { expressionImpact: 88, memeDensity: 86, punchlineImpulse: 84, attackPressure: 58 },
      normal: "你的发言像自带弹幕，严肃讨论里总能飘出一句能传播的东西。",
      savage: "你有时不是在赢比赛，是在争夺赛后朋友圈最佳截图。"
    }),
    makeType({
      code: "TILT-WAR",
      name: "上头战神",
      tagline: "你燃起来能翻盘，也能把队伍一路带进沟里。",
      profile: { attackPressure: 88, riskPreference: 94, emotionSpike: 96, impromptuCounter: 84 },
      normal: "你一旦上头，战场会立刻升温；至于是热血还是火灾，要看当天手感。",
      savage: "你不是在自由辩，你是在给队伍申请高危作业许可证。"
    }),
    makeType({
      code: "REVIEW-GHOST",
      name: "复盘地缚灵",
      tagline: "比赛结束三天了，你还在第二轮质询里没有出来。",
      profile: { reviewCompulsion: 98, logicPurity: 76, evidenceDependence: 72, winObsession: 74 },
      normal: "别人赛后吃饭，你赛后把每一个没接住的点重新审判一遍。",
      savage: "你的比赛不会结束，只会转入长期精神占用。"
    }),
    makeType({
      code: "SOLO-RAIDER",
      name: "单兵游击队",
      tagline: "你能打，但你的队友经常不知道你已经开到哪里了。",
      profile: { impromptuCounter: 92, attackPressure: 78, riskPreference: 80, teammateRelay: 22 },
      normal: "你经常一个人打出漂亮小战场，然后回头发现队友还在上一张地图。",
      savage: "你不是不合群，你只是把团队赛玩成了单排上分。"
    }),
    makeType({
      code: "VALUE-LIFT",
      name: "价值升华师",
      tagline: "普通论点到你嘴里，会突然背负人类文明的重量。",
      profile: { expressionImpact: 92, frameworkModeling: 82, punchlineImpulse: 76, criterionSensitivity: 70 },
      normal: "你开口前是一个普通争点，开口后变成文明转向的十字路口。",
      savage: "你不是在升华，你是在给论点临时办理宇宙级户口。"
    }),
    makeType({
      code: "RULE-GUARD",
      name: "程序正义守门员",
      tagline: "跑题、偷定义、不回应、乱比较，都会被你记在小本本上。",
      profile: { criterionSensitivity: 92, defensiveDissection: 88, logicPurity: 78, riskPreference: 24 },
      normal: "你像赛场上的质检员，对方每一个不回应都逃不过你的出厂检测。",
      savage: "你不是在防守，你是在给对方论证开罚单。"
    })
  ];

  window.DBTI_DATA = {
    config: {
      defaultTone: "normal",
      demoMode: true,
      fallbackThreshold: 60,
      displayPrimaryWeight: 0.65
    },
    internalDimensions,
    displayDimensions,
    questions,
    personalityTypes,
    fallbackType: {
      code: "DEADLOCK",
      name: "流局人格",
      tagline: "系统无法稳定归票，建议重开一轮。",
      copy: {
        mild: "你的作答画像和当前人格库都不太贴近，系统暂时无法稳定归类。",
        normal: "你的赛场画像像一场流局：每个评委都想投，但没人知道该投给谁。",
        savage: "你不是某种人格，你是把人格库打到需要加赛的存在。"
      },
      share: {
        mild: "我测出了 DBTI 人格：流局人格。",
        normal: "我的 DBTI 是流局人格，系统无法稳定归票。",
        savage: "我的 DBTI 是流局人格，人格库请求重开。"
      }
    }
  };
})();
