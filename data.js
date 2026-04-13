(() => {
  const internalDimensions = [
    ["expression_vs_competition", "表达—竞技"],
    ["stage_vs_team", "赛场—队伍"],
    ["initiation_tendency", "开战倾向"],
    ["pressing_intensity", "逼问强度"],
    ["fact_vs_mechanism", "事实—机理"],
    ["reality_vs_setting", "现实—设定"],
    ["self_vs_judge", "自我—裁判"],
    ["judge_vs_performance", "裁判—表现"],
    ["tournament_activity", "赛事活跃"],
    ["daily_argumentativeness", "日常论辩"],
    ["meme_intensity", "整活浓度"],
    ["emotional_heat", "上头程度"],
    ["team_construction", "整队建构"],
    ["solo_vs_coordination", "单兵—配合"],
    ["chain_vs_scene", "链条—场景"],
    ["plain_vs_stylized", "朴素—包装"]
  ].map(([key, label]) => ({ key, label }));

  const displayDimensions = [
    ["competitive_orientation", "竞技导向", "expression_vs_competition", "stage_vs_team"],
    ["pressure_orientation", "压迫倾向", "initiation_tendency", "pressing_intensity"],
    ["reality_anchor", "现实锚点", "fact_vs_mechanism", "reality_vs_setting"],
    ["judge_orientation", "评委导向", "self_vs_judge", "judge_vs_performance"],
    ["debate_immersion", "辩棍浓度", "tournament_activity", "daily_argumentativeness"],
    ["abstraction_orientation", "放飞程度", "meme_intensity", "emotional_heat"],
    ["collaboration_orientation", "协同倾向", "team_construction", "solo_vs_coordination"],
    ["rendering_orientation", "渲染倾向", "chain_vs_scene", "plain_vs_stylized"]
  ].map(([key, label, primary, secondary]) => ({ key, label, primary, secondary }));

  const effectTransforms = {
    attackPressure: { initiation_tendency: 0.7, pressing_intensity: 0.5 },
    defensiveDissection: { initiation_tendency: -0.35, pressing_intensity: -0.65, chain_vs_scene: -0.35 },
    frameworkModeling: { team_construction: 0.45, self_vs_judge: 0.25, chain_vs_scene: -0.25 },
    criterionSensitivity: { self_vs_judge: 0.75, judge_vs_performance: 0.5 },
    evidenceDependence: { fact_vs_mechanism: 0.75, reality_vs_setting: 0.5 },
    logicPurity: { chain_vs_scene: -0.75, fact_vs_mechanism: -0.3 },
    expressionImpact: { chain_vs_scene: 0.65, plain_vs_stylized: 0.35 },
    punchlineImpulse: { plain_vs_stylized: 0.75, meme_intensity: 0.35 },
    impromptuCounter: { initiation_tendency: 0.45, pressing_intensity: 0.25 },
    riskPreference: { expression_vs_competition: 0.7, stage_vs_team: 0.2 },
    teammateRelay: { solo_vs_coordination: 0.75, stage_vs_team: -0.35 },
    battlefieldControl: { team_construction: 0.7, solo_vs_coordination: 0.35 },
    winObsession: { expression_vs_competition: 0.75, stage_vs_team: 0.35 },
    reviewCompulsion: { tournament_activity: 0.7, daily_argumentativeness: 0.35 },
    memeDensity: { meme_intensity: 0.75, daily_argumentativeness: 0.45 },
    emotionSpike: { emotional_heat: 0.8 }
  };

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
    },
    {
      id: "q002",
      text: "赛前讨论到凌晨，大家还在吵核心标准，你最可能先做什么？",
      options: [
        {
          label: "A",
          text: "把所有人的话收成三层框架：定义、标准、比较，不然今晚谁也别睡。",
          effects: { frameworkModeling: 34, battlefieldControl: 20, criterionSensitivity: 18, memeDensity: -8 }
        },
        {
          label: "B",
          text: "先去找判例、论文、统计口径。没有材料支撑的灵感一律先别上桌。",
          effects: { evidenceDependence: 36, reviewCompulsion: 16, logicPurity: 14, expressionImpact: -8 }
        },
        {
          label: "C",
          text: "让大家各讲一分钟，先判断谁的方向能被评委听懂，再决定怎么收。",
          effects: { teammateRelay: 26, criterionSensitivity: 24, battlefieldControl: 18, emotionSpike: -10 }
        },
        {
          label: "D",
          text: "先抛一个能让全队醒过来的暴论。哪怕最后不用，也要把空气搅动起来。",
          effects: { punchlineImpulse: 28, memeDensity: 22, riskPreference: 20, frameworkModeling: -10 }
        }
      ]
    },
    {
      id: "q003",
      text: "队友在场上打出一个明显有坑的点，而且对方已经准备追了，你会：",
      options: [
        {
          label: "A",
          text: "马上接线，把它改造成一个较弱但能站住的版本，先保住队伍战场。",
          effects: { teammateRelay: 36, defensiveDissection: 24, battlefieldControl: 18, attackPressure: -8 }
        },
        {
          label: "B",
          text: "直接转火对方更大的漏洞，用进攻把这个坑从评委注意力里冲掉。",
          effects: { attackPressure: 34, impromptuCounter: 26, riskPreference: 20, teammateRelay: -8 }
        },
        {
          label: "C",
          text: "承认这个点不是主战场，立刻把评委拉回更关键的比较标准。",
          effects: { criterionSensitivity: 34, frameworkModeling: 24, emotionSpike: -14, riskPreference: -8 }
        },
        {
          label: "D",
          text: "赛后一定复盘，但场上先记下来，等对面真的追深了再精准拆弹。",
          effects: { reviewCompulsion: 24, defensiveDissection: 28, logicPurity: 18, emotionSpike: -12 }
        }
      ]
    },
    {
      id: "q004",
      text: "如果你负责结辩，最想把最后三分钟用来做什么？",
      options: [
        {
          label: "A",
          text: "把全场争点重新编号，告诉评委每个点为什么都导向我方。",
          effects: { battlefieldControl: 36, frameworkModeling: 24, criterionSensitivity: 16, memeDensity: -8 }
        },
        {
          label: "B",
          text: "把最重要的价值差异抬出来，让这场比赛看起来像一个时代选择。",
          effects: { expressionImpact: 32, punchlineImpulse: 22, frameworkModeling: 18, evidenceDependence: -8 }
        },
        {
          label: "C",
          text: "补一组对方没处理干净的数据和例子，让他们最后也不能安全落地。",
          effects: { evidenceDependence: 30, attackPressure: 20, reviewCompulsion: 16, expressionImpact: -6 }
        },
        {
          label: "D",
          text: "用一句能被记住的话收尾。赢不赢先放一边，赛后传播点必须有。",
          effects: { punchlineImpulse: 34, memeDensity: 28, expressionImpact: 20, logicPurity: -10 }
        }
      ]
    },
    {
      id: "q005",
      text: "对方质询突然问到你准备稿里没有的一环，你第一反应是：",
      options: [
        {
          label: "A",
          text: "先稳住概念范围，把问题拆成两个小问题，再逐个回应。",
          effects: { defensiveDissection: 34, logicPurity: 26, emotionSpike: -16, riskPreference: -8 }
        },
        {
          label: "B",
          text: "反问对方预设，把问题的危险性倒回他们自己的标准里。",
          effects: { impromptuCounter: 34, attackPressure: 26, criterionSensitivity: 16, riskPreference: 12 }
        },
        {
          label: "C",
          text: "快速看队友反应，能接就让队友接，不能接就先缩小承诺。",
          effects: { teammateRelay: 34, battlefieldControl: 18, defensiveDissection: 16, attackPressure: -8 }
        },
        {
          label: "D",
          text: "先用气势顶住，争取让这个问题看起来没有它听上去那么致命。",
          effects: { expressionImpact: 28, riskPreference: 24, emotionSpike: 20, logicPurity: -12 }
        }
      ]
    },
    {
      id: "q006",
      text: "你最喜欢拿到哪种准备任务？",
      options: [
        {
          label: "A",
          text: "写一辩稿。把定义、标准、框架和论点顺序排得干干净净。",
          effects: { frameworkModeling: 36, logicPurity: 22, riskPreference: -14, punchlineImpulse: -6 }
        },
        {
          label: "B",
          text: "做资料包。案例越多越安心，最好还能按用途贴好标签。",
          effects: { evidenceDependence: 38, reviewCompulsion: 22, teammateRelay: 12, expressionImpact: -8 }
        },
        {
          label: "C",
          text: "模拟自由辩。先把所有可能炸场的问法都拿出来试一遍。",
          effects: { attackPressure: 28, impromptuCounter: 28, riskPreference: 18, emotionSpike: 12 }
        },
        {
          label: "D",
          text: "做评委视角预判。哪些点会被买，哪些点听起来像自嗨，要先分清楚。",
          effects: { criterionSensitivity: 36, battlefieldControl: 20, frameworkModeling: 16, memeDensity: -8 }
        }
      ]
    },
    {
      id: "q007",
      text: "遇到一个很容易煽动情绪的辩题，你会怎么处理？",
      options: [
        {
          label: "A",
          text: "情绪可以有，但必须服务比较。先把价值冲突放进清楚的标准里。",
          effects: { criterionSensitivity: 28, frameworkModeling: 26, expressionImpact: 16, emotionSpike: -10 }
        },
        {
          label: "B",
          text: "找到最能打动人的叙事入口，把评委带进我方的价值现场。",
          effects: { expressionImpact: 36, punchlineImpulse: 18, riskPreference: 10, evidenceDependence: -8 }
        },
        {
          label: "C",
          text: "先查数据，情绪题最怕只剩情绪，必须把现实支点钉住。",
          effects: { evidenceDependence: 34, logicPurity: 20, reviewCompulsion: 12, punchlineImpulse: -8 }
        },
        {
          label: "D",
          text: "直接拆对方煽情里的偷换：感动归感动，比较归比较。",
          effects: { attackPressure: 28, defensiveDissection: 26, logicPurity: 18, expressionImpact: -6 }
        }
      ]
    },
    {
      id: "q008",
      text: "赛前最后一小时，你发现一个核心资料可能有口径问题，你会：",
      options: [
        {
          label: "A",
          text: "立刻停用，宁可少一个例子，也不要让对方抓住把柄。",
          effects: { logicPurity: 34, defensiveDissection: 22, riskPreference: -20, winObsession: 8 }
        },
        {
          label: "B",
          text: "保留，但改成更保守的表述，只支撑小结论，不支撑主结论。",
          effects: { criterionSensitivity: 26, frameworkModeling: 18, defensiveDissection: 18, riskPreference: -6 }
        },
        {
          label: "C",
          text: "继续用。只要对方没查到，它仍然是场上的有效武器。",
          effects: { riskPreference: 34, winObsession: 24, attackPressure: 14, logicPurity: -24 }
        },
        {
          label: "D",
          text: "马上找替代资料，并把这次事故记进赛后复盘清单。",
          effects: { evidenceDependence: 28, reviewCompulsion: 30, teammateRelay: 12, emotionSpike: -8 }
        }
      ]
    },
    {
      id: "q009",
      text: "队伍准备采用一个高风险但可能很亮眼的奇袭打法，你的态度是：",
      options: [
        {
          label: "A",
          text: "可以打，但必须先设计撤退路线。奇袭不是裸奔。",
          effects: { battlefieldControl: 28, riskPreference: 18, criterionSensitivity: 18, emotionSpike: -8 }
        },
        {
          label: "B",
          text: "打，必须打。常规打法赢不了就别装稳了。",
          effects: { riskPreference: 38, winObsession: 28, attackPressure: 20, defensiveDissection: -10 }
        },
        {
          label: "C",
          text: "先问评委能不能买。如果评委不吃，再好看也只是自嗨。",
          effects: { criterionSensitivity: 36, frameworkModeling: 18, riskPreference: -14, punchlineImpulse: -8 }
        },
        {
          label: "D",
          text: "我负责把它包装得像正经战术，至少不要让队友看起来像临时发疯。",
          effects: { teammateRelay: 26, expressionImpact: 24, memeDensity: 14, battlefieldControl: 12 }
        }
      ]
    },
    {
      id: "q010",
      text: "评委点评说“你们回应不够”，但你觉得明明回应了，你会：",
      options: [
        {
          label: "A",
          text: "复盘录像，找出是哪一层回应没有被评委识别出来。",
          effects: { reviewCompulsion: 36, criterionSensitivity: 24, logicPurity: 16, emotionSpike: -8 }
        },
        {
          label: "B",
          text: "下次直接把回应标签打在评委脸上：第一，回应；第二，比较；第三，影响。",
          effects: { frameworkModeling: 28, expressionImpact: 20, battlefieldControl: 18, criterionSensitivity: 14 }
        },
        {
          label: "C",
          text: "先不服三分钟，然后承认可能是表达路径没铺好。",
          effects: { emotionSpike: 24, expressionImpact: 18, reviewCompulsion: 18, logicPurity: 8 }
        },
        {
          label: "D",
          text: "把这条点评转发给全队，提醒大家以后别只在心里回应。",
          effects: { teammateRelay: 28, battlefieldControl: 18, reviewCompulsion: 16, memeDensity: 8 }
        }
      ]
    },
    {
      id: "q011",
      text: "如果让你自由选择上场位置，你最自然的位置是：",
      options: [
        {
          label: "A",
          text: "一辩。给我结构和定义，我来把这场比赛摆正。",
          effects: { frameworkModeling: 34, logicPurity: 18, riskPreference: -12, battlefieldControl: 12 }
        },
        {
          label: "B",
          text: "二辩或质询位。给我对面的人，我来拆。",
          effects: { attackPressure: 34, defensiveDissection: 22, impromptuCounter: 16, emotionSpike: 10 }
        },
        {
          label: "C",
          text: "三辩或自由辩核心。战场乱起来，我反而更清醒。",
          effects: { impromptuCounter: 34, riskPreference: 24, attackPressure: 16, teammateRelay: -8 }
        },
        {
          label: "D",
          text: "四辩。前面打成什么样都行，最后给我三分钟收账。",
          effects: { battlefieldControl: 34, criterionSensitivity: 22, expressionImpact: 20, reviewCompulsion: 10 }
        }
      ]
    },
    {
      id: "q012",
      text: "自由辩突然安静了两秒，空气开始变得尴尬，你会：",
      options: [
        {
          label: "A",
          text: "马上站起来补一问，哪怕不是最优，也不能让节奏死掉。",
          effects: { impromptuCounter: 28, attackPressure: 24, riskPreference: 18, emotionSpike: 12 }
        },
        {
          label: "B",
          text: "把刚才没收束的战场接回来，提醒队友下一轮该往哪打。",
          effects: { teammateRelay: 30, battlefieldControl: 24, defensiveDissection: 14, emotionSpike: -8 }
        },
        {
          label: "C",
          text: "宁可安静一秒，也不乱问。没有目标的问题只是在浪费时间。",
          effects: { logicPurity: 28, criterionSensitivity: 18, riskPreference: -18, punchlineImpulse: -8 }
        },
        {
          label: "D",
          text: "抛一个能把全场注意力拉回来的尖锐表述，先把气口抢回来。",
          effects: { expressionImpact: 30, punchlineImpulse: 24, memeDensity: 16, riskPreference: 10 }
        }
      ]
    },
    {
      id: "q013",
      text: "比赛输了，赛后你最可能先说什么？",
      options: [
        {
          label: "A",
          text: "第二轮质询那里其实就已经崩了，我们逐分钟复盘。",
          effects: { reviewCompulsion: 38, logicPurity: 18, winObsession: 16, memeDensity: -8 }
        },
        {
          label: "B",
          text: "先别互相怪，大家把自己没接住的线列出来。",
          effects: { teammateRelay: 32, battlefieldControl: 20, defensiveDissection: 14, emotionSpike: -12 }
        },
        {
          label: "C",
          text: "这个评委的判准其实能理解，我们没有把比较递到位。",
          effects: { criterionSensitivity: 30, frameworkModeling: 18, reviewCompulsion: 16, emotionSpike: -8 }
        },
        {
          label: "D",
          text: "先让我发个朋友圈阴阳一下，五分钟后回来复盘。",
          effects: { memeDensity: 30, emotionSpike: 22, punchlineImpulse: 18, reviewCompulsion: 8 }
        }
      ]
    },
    {
      id: "q014",
      text: "遇到明显强于自己的对手，你的备赛策略会变成：",
      options: [
        {
          label: "A",
          text: "把他们常用打法扒一遍，准备针对性资料和预设回应。",
          effects: { evidenceDependence: 30, reviewCompulsion: 24, defensiveDissection: 18, winObsession: 14 }
        },
        {
          label: "B",
          text: "赌一套他们没见过的切入角度。常规对轰大概率打不过。",
          effects: { riskPreference: 34, frameworkModeling: 18, attackPressure: 18, winObsession: 18 }
        },
        {
          label: "C",
          text: "压低失误率，所有争点都守住，逼他们自己犯错。",
          effects: { defensiveDissection: 32, logicPurity: 22, emotionSpike: -16, riskPreference: -12 }
        },
        {
          label: "D",
          text: "把表达和价值讲到极致，至少让评委知道我们不是来陪跑的。",
          effects: { expressionImpact: 34, punchlineImpulse: 18, winObsession: 20, evidenceDependence: -6 }
        }
      ]
    },
    {
      id: "q015",
      text: "比赛当天，队友突然开始焦虑，你通常会：",
      options: [
        {
          label: "A",
          text: "把流程、分工和重点再过一遍，用秩序感把大家按回座位。",
          effects: { battlefieldControl: 28, teammateRelay: 24, frameworkModeling: 16, emotionSpike: -12 }
        },
        {
          label: "B",
          text: "提醒大家这场必须拿下，焦虑可以有，但别影响执行。",
          effects: { winObsession: 32, battlefieldControl: 16, expressionImpact: 12, emotionSpike: 8 }
        },
        {
          label: "C",
          text: "讲点烂梗缓一下气氛，让队伍至少先像个人类组织。",
          effects: { memeDensity: 30, teammateRelay: 20, punchlineImpulse: 16, winObsession: -8 }
        },
        {
          label: "D",
          text: "自己找个角落再看一遍资料。别人焦虑的时候，我更想确认底牌。",
          effects: { evidenceDependence: 28, logicPurity: 16, teammateRelay: -10, emotionSpike: -6 }
        }
      ]
    },
    {
      id: "q016",
      text: "赛后如果要发一条总结，你最可能发什么？",
      options: [
        {
          label: "A",
          text: "感谢队友，今天几条线接得很舒服，下次继续补细节。",
          effects: { teammateRelay: 30, reviewCompulsion: 16, expressionImpact: 12, emotionSpike: -8 }
        },
        {
          label: "B",
          text: "今天最关键的问题是判准没有打透，下一场必须重构比较。",
          effects: { criterionSensitivity: 30, frameworkModeling: 22, reviewCompulsion: 18, memeDensity: -8 }
        },
        {
          label: "C",
          text: "附上三张资料截图和一句：别问，问就是还没查完。",
          effects: { evidenceDependence: 30, memeDensity: 18, reviewCompulsion: 18, expressionImpact: 8 }
        },
        {
          label: "D",
          text: "发一条能让同赛区都看懂的抽象短句，懂的都懂。",
          effects: { memeDensity: 36, punchlineImpulse: 24, expressionImpact: 14, logicPurity: -8 }
        }
      ]
    },
    {
      id: "q017",
      text: "拿到一个特别抽象的价值辩题，你最先做的事是：",
      options: [
        {
          label: "A",
          text: "先把关键词定义拆开，防止整场比赛从第一秒开始飘。",
          effects: { frameworkModeling: 32, logicPurity: 24, criterionSensitivity: 16, punchlineImpulse: -8 }
        },
        {
          label: "B",
          text: "找现实场景和具体人群，不然价值讨论很容易变成空中楼阁。",
          effects: { evidenceDependence: 26, expressionImpact: 18, criterionSensitivity: 14, memeDensity: -6 }
        },
        {
          label: "C",
          text: "先写一段能把题目抬起来的开场，让评委知道这不是普通选择题。",
          effects: { expressionImpact: 34, punchlineImpulse: 24, frameworkModeling: 12, evidenceDependence: -8 }
        },
        {
          label: "D",
          text: "直接问：这题到底哪边更容易赢？价值很美，但票很真实。",
          effects: { winObsession: 32, criterionSensitivity: 24, riskPreference: 10, expressionImpact: -8 }
        }
      ]
    },
    {
      id: "q018",
      text: "对方疯狂堆案例，听起来每个都很惨，但比较关系很虚，你会：",
      options: [
        {
          label: "A",
          text: "抓住样本和归因问题，说明案例不是结论的自动提款机。",
          effects: { logicPurity: 34, defensiveDissection: 26, evidenceDependence: 14, expressionImpact: -6 }
        },
        {
          label: "B",
          text: "直接追问比较标准：就算这些都是真的，为什么推出你方更优？",
          effects: { attackPressure: 30, criterionSensitivity: 28, impromptuCounter: 16, emotionSpike: 8 }
        },
        {
          label: "C",
          text: "拿我方更能解释大趋势的数据压回去，让评委看全局不是看眼泪。",
          effects: { evidenceDependence: 34, battlefieldControl: 20, winObsession: 12, punchlineImpulse: -6 }
        },
        {
          label: "D",
          text: "把对方煽情的地方转成一句能记住的反打，先把气势抢回来。",
          effects: { expressionImpact: 30, punchlineImpulse: 24, memeDensity: 14, logicPurity: -8 }
        }
      ]
    },
    {
      id: "q019",
      text: "队友说你的稿子太长，可能念不完，你会：",
      options: [
        {
          label: "A",
          text: "删修辞，保链条。只要逻辑骨架在，肉少一点也能活。",
          effects: { logicPurity: 30, frameworkModeling: 24, expressionImpact: -10, riskPreference: -8 }
        },
        {
          label: "B",
          text: "删资料，保关键例子。不要让评委在数据森林里迷路。",
          effects: { criterionSensitivity: 24, battlefieldControl: 18, evidenceDependence: -10, expressionImpact: 10 }
        },
        {
          label: "C",
          text: "不删，练到能念完。速度也是一种战术。",
          effects: { winObsession: 28, riskPreference: 24, evidenceDependence: 12, teammateRelay: -8 }
        },
        {
          label: "D",
          text: "让队友标出听不懂的地方，先保证他们能接上我的线。",
          effects: { teammateRelay: 34, battlefieldControl: 18, reviewCompulsion: 14, frameworkModeling: 8 }
        }
      ]
    },
    {
      id: "q020",
      text: "自由辩里对方突然开始抓你方一个小失误不放，你会：",
      options: [
        {
          label: "A",
          text: "承认它小，然后立刻问这个小失误如何影响主判准。",
          effects: { criterionSensitivity: 32, defensiveDissection: 24, emotionSpike: -12, riskPreference: -6 }
        },
        {
          label: "B",
          text: "反抓他们更大的不回应，用更高优先级的战场把它盖过去。",
          effects: { attackPressure: 34, battlefieldControl: 20, impromptuCounter: 18, riskPreference: 10 }
        },
        {
          label: "C",
          text: "让队友先接，我负责在下一轮把完整回应补回结构里。",
          effects: { teammateRelay: 30, frameworkModeling: 18, defensiveDissection: 16, emotionSpike: -8 }
        },
        {
          label: "D",
          text: "如果他们要一直追这个点，那就把它变成对方格局太小的证据。",
          effects: { expressionImpact: 28, punchlineImpulse: 20, riskPreference: 16, memeDensity: 12 }
        }
      ]
    },
    {
      id: "q021",
      text: "你正在准备一场你不喜欢的持方，但它明显更好赢，你会：",
      options: [
        {
          label: "A",
          text: "赢比赛和喜欢持方是两回事，先把最优打法做出来。",
          effects: { winObsession: 36, criterionSensitivity: 20, emotionSpike: -8, memeDensity: -8 }
        },
        {
          label: "B",
          text: "尽量找一个我能接受的价值入口，不然表达会没有灵魂。",
          effects: { expressionImpact: 26, frameworkModeling: 20, logicPurity: 14, winObsession: -6 }
        },
        {
          label: "C",
          text: "把自己不舒服的部分列出来，提前做成对方可能攻击的预案。",
          effects: { defensiveDissection: 28, reviewCompulsion: 22, logicPurity: 18, emotionSpike: -8 }
        },
        {
          label: "D",
          text: "边备赛边吐槽，但该找资料找资料，该上价值上价值。",
          effects: { evidenceDependence: 20, memeDensity: 22, teammateRelay: 12, reviewCompulsion: 10 }
        }
      ]
    },
    {
      id: "q022",
      text: "评委在你陈词时突然皱眉，你脑内第一反应是：",
      options: [
        {
          label: "A",
          text: "刚才那句比较可能没递到，下一段要把判准说得更显眼。",
          effects: { criterionSensitivity: 36, expressionImpact: 18, battlefieldControl: 14, emotionSpike: -6 }
        },
        {
          label: "B",
          text: "是不是链条跳了？先补中间环节，不然这段会被判成断言。",
          effects: { logicPurity: 34, frameworkModeling: 18, defensiveDissection: 12, riskPreference: -8 }
        },
        {
          label: "C",
          text: "稳住，不被表情带走。继续按稿走完，场下再复盘。",
          effects: { emotionSpike: -24, riskPreference: -12, reviewCompulsion: 18, battlefieldControl: 10 }
        },
        {
          label: "D",
          text: "提高表达强度，把这段讲得更像一个必须被听见的判断。",
          effects: { expressionImpact: 32, punchlineImpulse: 16, winObsession: 12, riskPreference: 8 }
        }
      ]
    },
    {
      id: "q023",
      text: "新队员问你“辩论到底怎么赢”，你会怎么解释？",
      options: [
        {
          label: "A",
          text: "先讲比较：不是证明自己好，而是证明自己比对方更值得被投。",
          effects: { criterionSensitivity: 34, frameworkModeling: 24, teammateRelay: 16, memeDensity: -6 }
        },
        {
          label: "B",
          text: "先讲论证链：主张、理由、例证、影响，少一个都容易塌。",
          effects: { logicPurity: 34, evidenceDependence: 18, frameworkModeling: 16, punchlineImpulse: -8 }
        },
        {
          label: "C",
          text: "先让他看一轮自由辩。辩论不是念稿，是在现场处理活人。",
          effects: { impromptuCounter: 30, attackPressure: 20, expressionImpact: 16, riskPreference: 10 }
        },
        {
          label: "D",
          text: "告诉他：赢法很多，但别先学会阴阳怪气再学会回应。",
          effects: { teammateRelay: 24, memeDensity: 18, reviewCompulsion: 12, criterionSensitivity: 10 }
        }
      ]
    },
    {
      id: "q024",
      text: "你看到对方在自由辩中连续三次没有正面回答，你会：",
      options: [
        {
          label: "A",
          text: "把三次不回应串成一条线，直接告诉评委这是对方核心义务缺席。",
          effects: { criterionSensitivity: 34, battlefieldControl: 24, attackPressure: 16, winObsession: 10 }
        },
        {
          label: "B",
          text: "继续追到他们回答为止。今天这个洞不填，谁也别走。",
          effects: { attackPressure: 38, impromptuCounter: 20, emotionSpike: 18, riskPreference: 10 }
        },
        {
          label: "C",
          text: "先暂停追问，回头用结辩语言把不回应的影响讲清楚。",
          effects: { battlefieldControl: 30, defensiveDissection: 20, expressionImpact: 12, emotionSpike: -8 }
        },
        {
          label: "D",
          text: "记在稿纸角落：对方疑似进入装死模式。",
          effects: { memeDensity: 26, reviewCompulsion: 18, defensiveDissection: 12, punchlineImpulse: 12 }
        }
      ]
    },
    {
      id: "q025",
      text: "备赛群里突然没人说话了，你会怎么打破沉默？",
      options: [
        {
          label: "A",
          text: "发一版分工表：谁查资料、谁写稿、谁模拟，先让机器重新转起来。",
          effects: { battlefieldControl: 32, teammateRelay: 24, reviewCompulsion: 12, memeDensity: -8 }
        },
        {
          label: "B",
          text: "发一个关键问题：这场我们到底靠哪个比较赢？",
          effects: { frameworkModeling: 30, criterionSensitivity: 24, winObsession: 14, expressionImpact: -6 }
        },
        {
          label: "C",
          text: "丢一个离谱但可能有用的切入点，先把大家从僵尸状态里拽出来。",
          effects: { punchlineImpulse: 28, memeDensity: 22, riskPreference: 18, teammateRelay: 10 }
        },
        {
          label: "D",
          text: "默默开始查资料，等群里复活时直接扔一份半成品。",
          effects: { evidenceDependence: 32, reviewCompulsion: 18, teammateRelay: -8, emotionSpike: -6 }
        }
      ]
    },
    {
      id: "q026",
      text: "对方抛出一个你没听过的新概念，但听起来很高级，你会：",
      options: [
        {
          label: "A",
          text: "先问定义和适用范围。高级词不解释，就先当烟雾弹处理。",
          effects: { attackPressure: 30, logicPurity: 28, defensiveDissection: 18, criterionSensitivity: 10 }
        },
        {
          label: "B",
          text: "把它放回原本比较框架：概念再新，也要回答本题怎么判。",
          effects: { frameworkModeling: 32, criterionSensitivity: 28, battlefieldControl: 16, riskPreference: -8 }
        },
        {
          label: "C",
          text: "先记下来，不急着碰。等确认它真的影响战场再处理。",
          effects: { defensiveDissection: 26, emotionSpike: -18, riskPreference: -12, reviewCompulsion: 10 }
        },
        {
          label: "D",
          text: "现场给它起个外号，方便队友和评委记住我们到底在打什么。",
          effects: { memeDensity: 28, expressionImpact: 22, teammateRelay: 12, punchlineImpulse: 16 }
        }
      ]
    },
    {
      id: "q027",
      text: "你的队伍需要一个人熬夜收束全稿，你的真实状态是：",
      options: [
        {
          label: "A",
          text: "我来吧。大家把材料发我，明早给你们一个能上场的版本。",
          effects: { teammateRelay: 34, battlefieldControl: 24, reviewCompulsion: 20, emotionSpike: -8 }
        },
        {
          label: "B",
          text: "可以，但我要先把框架钉死。没有框架的收稿只是排版。",
          effects: { frameworkModeling: 34, logicPurity: 20, criterionSensitivity: 14, teammateRelay: 8 }
        },
        {
          label: "C",
          text: "我负责资料核验。别让我明天在场上被一个错数据杀死。",
          effects: { evidenceDependence: 36, defensiveDissection: 16, reviewCompulsion: 18, riskPreference: -10 }
        },
        {
          label: "D",
          text: "我负责把难听的句子改成人话，顺便塞几个能活下来的金句。",
          effects: { expressionImpact: 32, punchlineImpulse: 22, teammateRelay: 12, logicPurity: -6 }
        }
      ]
    },
    {
      id: "q028",
      text: "你最不能忍受队友出现哪种情况？",
      options: [
        {
          label: "A",
          text: "不回应。对方问题摆在那，你还在念自己的小作文。",
          effects: { criterionSensitivity: 32, defensiveDissection: 20, emotionSpike: 12, teammateRelay: -8 }
        },
        {
          label: "B",
          text: "逻辑跳步。前提和结论隔着一条银河，还装作已经证明完了。",
          effects: { logicPurity: 36, reviewCompulsion: 16, expressionImpact: -8, memeDensity: 8 }
        },
        {
          label: "C",
          text: "没有资料。全场都靠感觉，像在给评委讲都市传说。",
          effects: { evidenceDependence: 34, winObsession: 12, logicPurity: 12, punchlineImpulse: -6 }
        },
        {
          label: "D",
          text: "完全不接队友。四个人像四个单独报名的灵魂。",
          effects: { teammateRelay: 34, battlefieldControl: 18, emotionSpike: 10, attackPressure: -8 }
        }
      ]
    },
    {
      id: "q029",
      text: "你方优势很大，只要稳住就能赢，但你突然看到一个能爆杀对方的点，你会：",
      options: [
        {
          label: "A",
          text: "不打。稳赢局不要给自己制造新变量。",
          effects: { riskPreference: -32, battlefieldControl: 24, criterionSensitivity: 16, emotionSpike: -12 }
        },
        {
          label: "B",
          text: "打，但只打一层，不恋战。让它变成加分项而不是新战场。",
          effects: { attackPressure: 24, criterionSensitivity: 22, battlefieldControl: 18, riskPreference: 6 }
        },
        {
          label: "C",
          text: "必须打。优势局不补刀，等于给对方写遗嘱的时间。",
          effects: { attackPressure: 36, winObsession: 24, riskPreference: 20, emotionSpike: 14 }
        },
        {
          label: "D",
          text: "留给结辩说，用最体面的方式把对方最后一口气收走。",
          effects: { battlefieldControl: 30, expressionImpact: 22, defensiveDissection: 12, punchlineImpulse: 10 }
        }
      ]
    },
    {
      id: "q030",
      text: "如果要给自己的辩论风格写一句简介，你最接近哪句？",
      options: [
        {
          label: "A",
          text: "我负责让这场比赛有骨架，别让所有人漂在空中。",
          effects: { frameworkModeling: 34, battlefieldControl: 20, logicPurity: 16, memeDensity: -8 }
        },
        {
          label: "B",
          text: "我负责让对方知道：每一个漏洞都会被现场认领。",
          effects: { attackPressure: 36, impromptuCounter: 22, riskPreference: 16, emotionSpike: 8 }
        },
        {
          label: "C",
          text: "我负责让评委相信：我们不是声音大，我们是证据硬。",
          effects: { evidenceDependence: 34, logicPurity: 22, criterionSensitivity: 14, expressionImpact: -6 }
        },
        {
          label: "D",
          text: "我负责让比赛结束后还有人记得这一场到底发生了什么。",
          effects: { expressionImpact: 34, punchlineImpulse: 24, memeDensity: 18, battlefieldControl: 10 }
        }
      ]
    }
  ];

  const personalityTypes = [
    makeType({
      code: "FREE-KILL",
      name: "自由辩查杀者",
      tagline: "对面刚开口，你已经在脑内按下红色警报。",
      profile: { initiation_tendency: 94, pressing_intensity: 90, expression_vs_competition: 78, emotional_heat: 72, solo_vs_coordination: 38 },
      normal: "你像自由辩里的警犬，对方概念刚飘出来，你已经闻到味了。",
      savage: "你不是在质询，你是在给对方论点做当场尸检。"
    }),
    makeType({
      code: "FRAME-ARCH",
      name: "框架建筑师",
      tagline: "你不急着赢一句话，你要先把整场比赛的地基打掉。",
      profile: { team_construction: 88, self_vs_judge: 74, chain_vs_scene: 24, plain_vs_stylized: 34, expression_vs_competition: 70 },
      normal: "你喜欢先画地图再开战，评委只要进了你的框架，就很难全身而退。",
      savage: "你不是在立论，你是在给评委装修一间只能判你赢的样板房。"
    }),
    makeType({
      code: "DATA-ENGINE",
      name: "资料组永动机",
      tagline: "只要还有一篇论文没搜到，你就不算真正睡觉。",
      profile: { fact_vs_mechanism: 95, reality_vs_setting: 86, tournament_activity: 78, chain_vs_scene: 22, expression_vs_competition: 68 },
      normal: "你的资料夹像一个小型数据库，队友说缺例子，你说缺的是检索词。",
      savage: "你不是在备赛，你是在给辩题做法医数据库。"
    }),
    makeType({
      code: "SUMMARY-MORT",
      name: "结辩殡仪馆馆长",
      tagline: "你负责把全场尸体摆整齐，再举行一次有尊严的告别仪式。",
      profile: { team_construction: 90, solo_vs_coordination: 76, self_vs_judge: 72, chain_vs_scene: 72, plain_vs_stylized: 76 },
      normal: "别人打完一地碎片，你上来把它们排成胜负关系。",
      savage: "你一开口，像在给对面论点补办死亡证明。"
    }),
    makeType({
      code: "BRIEF-PRINTER",
      name: "立论打印机",
      tagline: "你的稿子不一定最炸，但通常最像能交给评委的东西。",
      profile: { team_construction: 80, chain_vs_scene: 18, plain_vs_stylized: 28, fact_vs_mechanism: 66, expression_vs_competition: 58 },
      normal: "你的世界里没有临场奇迹，只有赛前写好的第一、第二、第三。",
      savage: "你像一台有感情的打印机，唯一的叛逆是页码偶尔不居中。"
    }),
    makeType({
      code: "QA-ROLLER",
      name: "质询压路机",
      tagline: "你的问题不是一个接一个，是一排接一排。",
      profile: { initiation_tendency: 96, pressing_intensity: 98, emotional_heat: 76, expression_vs_competition: 78, plain_vs_stylized: 64 },
      normal: "你质询时不像在提问，更像在把对方论点按进计时器里。",
      savage: "你一站起来，对面就开始怀念陈词阶段的和平年代。"
    }),
    makeType({
      code: "DEFUSE-EXPERT",
      name: "防守拆弹专家",
      tagline: "队友留下的爆炸物，对方埋下的雷，你都能蹲下来剪线。",
      profile: { initiation_tendency: 28, pressing_intensity: 24, chain_vs_scene: 16, solo_vs_coordination: 72, emotional_heat: 24 },
      normal: "你不一定最抢眼，但你总能把马上爆炸的战场拆成安全模式。",
      savage: "别人负责放火，你负责拿灭火器还要顺手写事故报告。"
    }),
    makeType({
      code: "LOGIC-PURITY",
      name: "逻辑洁癖患者",
      tagline: "链条断了半厘米，你的表情已经替评委扣完分。",
      profile: { chain_vs_scene: 8, fact_vs_mechanism: 24, self_vs_judge: 58, team_construction: 62, meme_intensity: 22 },
      normal: "你听比赛时像在做代码审查，一旦链条断裂就想当场标红。",
      savage: "你不是听不懂对方，你是受不了他们把逻辑当一次性餐具。"
    }),
    makeType({
      code: "JUDGE-WHISPER",
      name: "评委读心术士",
      tagline: "你不是在看对手，你是在看评委到底准备怎么投。",
      profile: { self_vs_judge: 96, judge_vs_performance: 90, team_construction: 66, plain_vs_stylized: 60, expression_vs_competition: 72 },
      normal: "你像在和评委隔空对暗号，每个标准都递到对方笔尖上。",
      savage: "你打比赛像在破解评委 Wi-Fi，密码通常叫判准。"
    }),
    makeType({
      code: "TEAM-NANNY",
      name: "队伍保姆型人格",
      tagline: "队友负责飞，你负责把每一根线都接回地球。",
      profile: { solo_vs_coordination: 96, team_construction: 88, stage_vs_team: 22, tournament_activity: 70, emotional_heat: 34 },
      normal: "你不是没有攻击性，你只是大部分精力都在把队友从悬崖边拉回来。",
      savage: "你打的不是辩论，是四个人格外包给你一个人做售后。"
    }),
    makeType({
      code: "VIBE-CREW",
      name: "赛场气氛组",
      tagline: "观众记住了你，评委也许还在找你的论点。",
      profile: { meme_intensity: 88, plain_vs_stylized: 86, chain_vs_scene: 72, daily_argumentativeness: 74, emotional_heat: 66 },
      normal: "你的发言像自带弹幕，严肃讨论里总能飘出一句能传播的东西。",
      savage: "你有时不是在赢比赛，是在争夺赛后朋友圈最佳截图。"
    }),
    makeType({
      code: "TILT-WAR",
      name: "上头战神",
      tagline: "你燃起来能翻盘，也能把队伍一路带进沟里。",
      profile: { initiation_tendency: 88, pressing_intensity: 76, expression_vs_competition: 86, emotional_heat: 96, solo_vs_coordination: 28 },
      normal: "你一旦上头，战场会立刻升温；至于是热血还是火灾，要看当天手感。",
      savage: "你不是在自由辩，你是在给队伍申请高危作业许可证。"
    }),
    makeType({
      code: "REVIEW-GHOST",
      name: "复盘地缚灵",
      tagline: "比赛结束三天了，你还在第二轮质询里没有出来。",
      profile: { tournament_activity: 96, daily_argumentativeness: 82, chain_vs_scene: 20, fact_vs_mechanism: 72, expression_vs_competition: 76 },
      normal: "别人赛后吃饭，你赛后把每一个没接住的点重新审判一遍。",
      savage: "你的比赛不会结束，只会转入长期精神占用。"
    }),
    makeType({
      code: "SOLO-RAIDER",
      name: "单兵游击队",
      tagline: "你能打，但你的队友经常不知道你已经开到哪里了。",
      profile: { initiation_tendency: 86, expression_vs_competition: 82, solo_vs_coordination: 18, team_construction: 28, emotional_heat: 70 },
      normal: "你经常一个人打出漂亮小战场，然后回头发现队友还在上一张地图。",
      savage: "你不是不合群，你只是把团队赛玩成了单排上分。"
    }),
    makeType({
      code: "VALUE-LIFT",
      name: "价值升华师",
      tagline: "普通论点到你嘴里，会突然背负人类文明的重量。",
      profile: { chain_vs_scene: 86, plain_vs_stylized: 88, self_vs_judge: 66, team_construction: 64, fact_vs_mechanism: 34 },
      normal: "你开口前是一个普通争点，开口后变成文明转向的十字路口。",
      savage: "你不是在升华，你是在给论点临时办理宇宙级户口。"
    }),
    makeType({
      code: "RULE-GUARD",
      name: "程序正义守门员",
      tagline: "跑题、偷定义、不回应、乱比较，都会被你记在小本本上。",
      profile: { self_vs_judge: 88, judge_vs_performance: 82, chain_vs_scene: 18, initiation_tendency: 36, pressing_intensity: 30 },
      normal: "你像赛场上的质检员，对方每一个不回应都逃不过你的出厂检测。",
      savage: "你不是在防守，你是在给对方论证开罚单。"
    }),
    makeType({
      code: "POLICY-GROUND",
      name: "政策题地勤组",
      tagline: "你不相信空中楼阁，所有论点都得先落地。",
      profile: { fact_vs_mechanism: 94, reality_vs_setting: 94, chain_vs_scene: 28, expression_vs_competition: 64, tournament_activity: 68 },
      normal: "你偏现实材料派，喜欢把辩题拉回制度、数据、人群和执行现场。",
      savage: "你听到抽象大词就想掏统计年鉴，像给价值讨论装地基的施工队。"
    }),
    makeType({
      code: "ABSTRACT-IMMORTAL",
      name: "抽象辩题仙人",
      tagline: "现实世界太窄，你更喜欢在概念云层里开战。",
      profile: { fact_vs_mechanism: 18, reality_vs_setting: 14, chain_vs_scene: 72, plain_vs_stylized: 78, meme_intensity: 62 },
      normal: "你更享受设定、哲学和概念推演，现实案例只是你偶尔下凡的工具。",
      savage: "你不是不落地，你是已经在云端给论点办了永久居留。"
    }),
    makeType({
      code: "BALLOT-ORACLE",
      name: "票路算命先生",
      tagline: "你看起来在听对手，其实在计算评委下一秒想投谁。",
      profile: { self_vs_judge: 96, judge_vs_performance: 96, expression_vs_competition: 82, stage_vs_team: 76, emotional_heat: 34 },
      normal: "你是典型裁判脑，打比赛时优先判断什么东西最可能转化成票。",
      savage: "你不是在辩论，你是在给评委脑内弹幕做实时风控。"
    }),
    makeType({
      code: "CLUB-ANCHOR",
      name: "辩论队团魂锚点",
      tagline: "你不只是来赢一场，你还想把整支队伍带回家。",
      profile: { stage_vs_team: 16, solo_vs_coordination: 94, team_construction: 86, tournament_activity: 72, expression_vs_competition: 36 },
      normal: "你很重视队伍共同体和长期配合，胜负重要，但人也要被接住。",
      savage: "你像辩论队的人形胶水，队友裂开了也能被你粘回可参赛状态。"
    }),
    makeType({
      code: "DAILY-DEBATER",
      name: "生活论辩污染源",
      tagline: "你不是在生活里打辩论，是辩论已经开始接管生活。",
      profile: { daily_argumentativeness: 96, tournament_activity: 78, meme_intensity: 74, emotional_heat: 68, stage_vs_team: 64 },
      normal: "你的辩论人格外溢明显，日常聊天也容易自动进入立场、反驳和比较。",
      savage: "朋友只是问你吃什么，你已经开始定义“吃”和“什么”。"
    }),
    makeType({
      code: "COLD-WINNER",
      name: "冷血赢面机器",
      tagline: "你不负责浪漫，你负责把胜率调到最大。",
      profile: { expression_vs_competition: 98, stage_vs_team: 90, self_vs_judge: 84, emotional_heat: 18, meme_intensity: 18 },
      normal: "你更把辩论视为竞技和博弈，会主动牺牲表达偏好来换取更高赢面。",
      savage: "你不是没有感情，你只是把感情从战术面板里关掉了。"
    })
  ];

  window.DBTI_DATA = {
    config: {
      defaultTone: "normal",
      demoMode: true,
      fallbackThreshold: 60
    },
    internalDimensions,
    displayDimensions,
    effectTransforms,
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
