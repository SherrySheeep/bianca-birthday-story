export type ChapterSevenScene = "gate" | "walk" | "tavernOutside" | "tavernInside";
export type ChapterSevenCharacter = "amberFriendly" | "amberUrgent" | "venti" | "zhongli";
export type ChapterSevenChoice = {
  label: string;
  responseSpeaker: "安柏" | "旁白" | "温迪" | "钟离";
  response: string;
  responseCharacter?: ChapterSevenCharacter;
  responsePortrait?: 1 | 2 | 3 | 4 | 5;
  followUpResponses?: Array<{
    speaker: "安柏" | "旁白" | "温迪" | "钟离";
    text: string;
    character?: ChapterSevenCharacter;
    portrait?: 1 | 2 | 3 | 4 | 5;
  }>;
  continueStory?: boolean;
};

export type ChapterSevenLine = {
  scene: ChapterSevenScene;
  speaker: "安柏" | "Bianca" | "旁白" | "？？？" | "温迪" | "钟离";
  text: string;
  character?: ChapterSevenCharacter;
  portrait?: 1 | 2 | 3 | 4 | 5;
  choices?: ChapterSevenChoice[];
};

const gate = (speaker: ChapterSevenLine["speaker"], text: string, character?: ChapterSevenCharacter, portrait?: ChapterSevenLine["portrait"]): ChapterSevenLine => ({ scene: "gate", speaker, text, character, portrait });
const walk = (text: string): ChapterSevenLine => ({ scene: "walk", speaker: "Bianca", text });
const outside = (speaker: ChapterSevenLine["speaker"], text: string, character?: ChapterSevenCharacter, portrait?: ChapterSevenLine["portrait"]): ChapterSevenLine => ({ scene: "tavernOutside", speaker, text, character, portrait });
const tavern = (speaker: ChapterSevenLine["speaker"], text: string, character?: ChapterSevenCharacter, portrait?: ChapterSevenLine["portrait"]): ChapterSevenLine => ({ scene: "tavernInside", speaker, text, character, portrait });

export const chapterSevenDialogue: ChapterSevenLine[] = [
  gate("安柏", "好啦，既然飞行考试也顺利通过了，我先去巡逻啦。", "amberFriendly", 3),
  gate("安柏", "蒙德城很安全，你可以自己到处逛逛。", "amberFriendly", 3),
  gate("安柏", "那我先走啦，回头见！", "amberFriendly", 4),
  {
    ...gate("Bianca", "好。"),
    choices: [
      { label: "终于没有人拉着我往下一个地方跑了", responseSpeaker: "安柏", response: "嘿！我听到的！" },
      { label: "这里真的是蒙德吗？", responseSpeaker: "旁白", response: "嘿嘿，你猜。" },
      { label: "我的行李……", responseSpeaker: "旁白", response: "行李飞走啦！" },
      { label: "不会还真的像菲林斯说的那样，“被送到了正确的位置”吧？", responseSpeaker: "旁白", response: "命运的选择！", continueStory: true },
    ],
  },

  walk("不过话说回来，我为什么会掉到这里？"),
  walk("算了。"),
  {
    ...walk("先看看这里有没有什么能问的人吧。"),
    choices: [
      { label: "我要看风车！", responseSpeaker: "旁白", response: "前面的区域以后再来探索吧。" },
      { label: "我要看骑士团！", responseSpeaker: "旁白", response: "建模师表示你饶了我吧。" },
      { label: "我要看酒馆！", responseSpeaker: "旁白", response: "命运的选择！", continueStory: true },
    ],
  },

  outside("Bianca", "……酒馆？"),
  outside("Bianca", "要不要进去看看……"),
  outside("？？？", "哎呀。"),
  outside("？？？", "这不是刚拿到飞行执照的旅行者吗？"),
  outside("Bianca", "……？"),
  outside("温迪", "别站在门口啦。", "venti", 2),
  outside("温迪", "正好，我们刚刚还在聊你呢。", "venti", 2),
  outside("钟离", "看来，结果已经出来了。", "zhongli", 1),
  {
    ...outside("Bianca", "……"),
    choices: [
      {
        label: "（看向温迪，温迪冲你灿烂一笑）你们在聊我？你们……是？",
        responseSpeaker: "温迪",
        response: "嘿嘿，进来就知道啦！",
        responseCharacter: "venti",
        responsePortrait: 2,
      },
      {
        label: "（看向旁白，旁白不语，只是一味地自豪）街上碰到了七神之二？提瓦特真是好地方！",
        responseSpeaker: "旁白",
        response: "旁白不语，只是一味地自豪。",
      },
      {
        label: "（看向钟离，钟离淡定地喝了一口茶）结果是什么东西？",
        responseSpeaker: "旁白",
        response: "命运的选择！",
        continueStory: true,
      },
    ],
  },
  tavern("温迪", "嘿嘿。\n我和这位钟离先生刚刚打了个赌。", "venti", 2),
  tavern("Bianca", "……\n为什么你们会拿我的飞行考试打赌？"),
  tavern("温迪", "因为很有意思嘛。", "venti", 2),
  tavern("钟离", "我只是接受了他的赌约。", "zhongli", 1),
  tavern("Bianca", "这听起来也没有好到哪里去。"),
  tavern("温迪", "我的赌注是——", "venti", 2),
  tavern("温迪", "你肯定能顺利通过飞行考试！", "venti", 2),
  tavern("钟离", "而我的判断是，", "zhongli", 1),
  tavern("钟离", "她会一边抱怨，一边通过考试。", "zhongli", 1),
  {
    ...tavern("Bianca", "……"),
    choices: [
      {
        label: "（愤怒模式）为什么你们会拿我的飞行考试打赌啊？？",
        responseSpeaker: "温迪",
        response: "诶嘿，因为很有意思嘛。",
      },
      {
        label: "（无奈模式）两个选择都没有好到哪里去诶。",
        responseSpeaker: "钟离",
        response: "小友此言差矣。",
      },
      {
        label: "（自豪模式）（大声说）伟大的 Bianca 自然是轻松通过！",
        responseSpeaker: "旁白",
        response: "命运的选择！\n毕竟是伟大的B老师呀！",
        continueStory: true,
      },
    ],
  },
  tavern("温迪", "所以，怎么样？\n 飞行考试通过了吗？", "venti", 2),
  tavern("Bianca", "……通过了。"),
  tavern("温迪", "那你考试的时候有没有抱怨？", "venti", 2),
  {
    ...tavern("Bianca", "……"),
    choices: [
      {
        label: "（温迪的胜利！）Bianca 怎么会抱怨呢（来自大C音）",
        responseSpeaker: "温迪",
        response: "啊，怎么这个都算得这么准啊。",
        followUpResponses: [
          { speaker: "钟离", text: "赌约既成，自当履行。拿酒来吧。" },
        ],
        continueStory: true,
      },
      {
        label: "（钟离的胜利！）谁会喜欢考试啊！（来自 Sherry 音）",
        responseSpeaker: "温迪",
        response: "哦，看来今天是往生堂无往不胜的钟离先生罕见的失手时刻了。",
        followUpResponses: [
          { speaker: "钟离", text: "无妨。老板，请来一杯葡萄汁给这位吟游诗人。" },
        ],
        continueStory: true,
      },
    ],
  },

  tavern("Bianca", "酒是个好东西。"),
  tavern("Bianca", "不过还是回归正题！"),
  tavern("旁白", "毕竟游戏要继续的。"),
  tavern("Bianca", "你们既然刚刚就在聊我。"),
  tavern("Bianca", "是不是知道我为什么会出现在这里？"),
  tavern("Bianca", "到底发生了什么？"),

  tavern("钟离", "或许，是因为某件不属于这个世界的东西。", "zhongli", 3),
  tavern("Bianca", "不属于这个世界的东西？"),
  tavern("钟离", "有某样来自你原本世界的物品，\n 意外落入了提瓦特。", "zhongli", 3),
  tavern("温迪", "而且看起来，", "venti", 4),
  tavern("温迪", "它并不太安分。", "venti", 4),
  tavern("Bianca", "……？"),
  tavern("钟离", "世界之间，本有各自的秩序。", "zhongli", 3),
  tavern("钟离", "不属于这里的事物若长久滞留，", "zhongli", 3),
  tavern("钟离", "难免会带来一些影响。", "zhongli", 3),
  tavern("Bianca", "什么影响？"),
  tavern("温迪", "嗯……", "venti", 4),
  tavern("温迪", "麻烦？", "venti", 4),
  tavern("Bianca", "多麻烦？"),
  tavern("温迪", "比普通麻烦……", "venti", 2),
  tavern("温迪", "再麻烦一点？", "venti", 2),
  tavern("Bianca", "你这解释跟没解释一样。"),

  tavern("Bianca", "那为什么是我？"),
  tavern("钟离", "因为那件东西与你有关。", "zhongli", 3),
  tavern("钟离", "或者说——\n 只有你能够将它真正带离这个世界。", "zhongli", 3),
  tavern("Bianca", "所以我掉进这里……"),
  tavern("Bianca", "就是为了帮你们捡东西？"),
  tavern("温迪", "这么说听起来确实有点委屈。", "venti", 2),
  tavern("Bianca", "本来就很委屈吧！"),

  tavern("Bianca", "那我要怎么找到它？"),
  tavern("钟离", "命运自会将不合适的东西排斥于外。", "zhongli", 3),
  tavern("Bianca", "……\n 说人话。"),
  tavern("温迪", "……", "venti", 2),
  tavern("钟离", "换言之。", "zhongli", 3),
  tavern("钟离", "当它引起的波动足够明显时，", "zhongli", 3),
  tavern("钟离", "自然会显露踪迹。", "zhongli", 3),
  tavern("Bianca", "所以现在就是……"),
  tavern("Bianca", "等它自己搞出事情？"),
  tavern("温迪", "差不多就是这个意思。", "venti", 2),
  tavern("Bianca", "你们这个解决方案是不是有点被动。"),

  tavern("Bianca", "等等。\n 那菲林斯呢？"),
  tavern("温迪", "菲林斯？", "venti", 1),
  tavern("Bianca", "就是那个在机场一直装工作人员的人。"),
  tavern("Bianca", "他明显早就知道我会来这里。"),
  tavern("钟离", "……菲林斯。\n 原来如此。", "zhongli", 5),
  tavern("Bianca", "你们认识？"),
  tavern("温迪", "这个嘛……", "venti", 5),

  tavern("安柏", "不好了！", "amberUrgent"),
  tavern("Bianca", "……？"),
  tavern("安柏", "城外出了点状况！", "amberUrgent"),
  tavern("安柏", "有一群深渊法师聚在那里。", "amberUrgent"),
  tavern("安柏", "而且它们好像围着什么东西……", "amberUrgent"),
  tavern("安柏", "一直不肯离开！", "amberUrgent"),
  tavern("钟离", "看来，比预想中更快。", "zhongli", 5),
  tavern("Bianca", "等等。"),
  tavern("Bianca", "不会这么巧吧！？"),
];
