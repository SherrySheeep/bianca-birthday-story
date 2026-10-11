export type ChapterSevenScene = "gate" | "walk" | "tavernOutside" | "tavernInside";
export type ChapterSevenCharacter = "amberFriendly" | "amberUrgent" | "venti" | "zhongli";
export type ChapterSevenChoice = {
  label: string;
  responseSpeaker: "安柏" | "旁白";
  response: string;
  continues?: boolean;
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
      { label: "不会还真的像菲林斯说的那样，“被送到了正确的位置”吧？", responseSpeaker: "旁白", response: "命运的选择！", continues: true },
    ],
  },

  walk("不过话说回来，我为什么会掉到这里？"),
  walk("算了。"),
  {
    ...walk("先看看这里有没有什么能问的人吧。"),
    choices: [
      { label: "我要看风车！", responseSpeaker: "旁白", response: "前面的区域以后再来探索吧。" },
      { label: "我要看骑士团！", responseSpeaker: "旁白", response: "建模师表示你饶了我吧。" },
      { label: "我要看酒馆！", responseSpeaker: "旁白", response: "命运的选择！", continues: true },
    ],
  },

  outside("Bianca", "……酒馆？"),
  outside("Bianca", "要不要进去看看……"),
  outside("？？？", "哎呀。"),
  outside("？？？", "这不是刚拿到飞行执照的旅行者吗？"),
  outside("Bianca", "……？"),
  outside("温迪", "别站在门口啦。", "venti", 2),
  outside("温迪", "正好，我们刚刚还在聊你呢。", "venti", 2),
  outside("Bianca", "……聊我？"),
  outside("温迪", "进来就知道啦。", "venti", 2),

  tavern("钟离", "看来，结果已经出来了。", "zhongli", 1),
  tavern("Bianca", "结果？"),
  tavern("温迪", "对呀。", "venti", 2),
  tavern("温迪", "我和这位钟离先生刚刚打了个赌。", "venti", 2),
  tavern("Bianca", "……"),
  tavern("Bianca", "为什么你们会拿我的飞行考试打赌？"),
  tavern("温迪", "因为很有意思嘛。", "venti", 2),
  tavern("钟离", "我只是接受了他的赌约。", "zhongli", 1),
  tavern("Bianca", "这听起来也没有好到哪里去。"),
  tavern("温迪", "我的赌注是——", "venti", 2),
  tavern("温迪", "你肯定能顺利通过飞行考试！", "venti", 2),
  tavern("钟离", "而我的判断是，", "zhongli", 1),
  tavern("钟离", "她会一边抱怨，一边通过考试。", "zhongli", 1),
  tavern("Bianca", "……"),
  tavern("温迪", "所以，怎么样？", "venti", 2),
  tavern("温迪", "飞行考试通过了吗？", "venti", 2),
  tavern("Bianca", "……通过了。"),
  tavern("温迪", "诶？", "venti", 2),
  tavern("温迪", "等等。", "venti", 2),
  tavern("温迪", "那你考试的时候有没有抱怨？", "venti", 2),
  tavern("Bianca", "……"),
  tavern("Bianca", "有。"),
  tavern("钟离", "承让。", "zhongli", 4),
  tavern("温迪", "啊——", "venti", 3),
  tavern("温迪", "怎么连这个都算得这么准啊。", "venti", 3),
  tavern("Bianca", "所以你输了？"),
  tavern("温迪", "……看来是这样。", "venti", 3),
  tavern("钟离", "赌约既成，自当履行。", "zhongli", 1),
  tavern("温迪", "知道啦知道啦。", "venti", 3),
  tavern("温迪", "不就是一顿酒嘛……", "venti", 3),

  tavern("Bianca", "所以……"),
  tavern("Bianca", "你们既然刚刚就在聊我。"),
  tavern("Bianca", "是不是知道我为什么会出现在这里？"),
  tavern("Bianca", "我原本明明在飞机上。"),
  tavern("Bianca", "然后一眨眼，就拿着风之翼从天上往下掉。"),
  tavern("Bianca", "到底发生了什么？"),
  tavern("Bianca", "还有。"),
  tavern("Bianca", "我要怎么回去？"),

  tavern("钟离", "或许，是因为某件不属于这个世界的东西。", "zhongli", 3),
  tavern("Bianca", "不属于这个世界的东西？"),
  tavern("钟离", "有某样来自你原本世界的物品，", "zhongli", 3),
  tavern("钟离", "意外落入了提瓦特。", "zhongli", 3),
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
  tavern("钟离", "或者说——", "zhongli", 3),
  tavern("钟离", "只有你能够将它真正带离这个世界。", "zhongli", 3),
  tavern("Bianca", "所以我掉进这里……"),
  tavern("Bianca", "就是为了帮你们捡东西？"),
  tavern("温迪", "这么说听起来确实有点委屈。", "venti", 2),
  tavern("Bianca", "本来就很委屈吧！"),

  tavern("Bianca", "那我要怎么找到它？"),
  tavern("钟离", "命运自会将不合适的东西排斥于外。", "zhongli", 3),
  tavern("Bianca", "……"),
  tavern("Bianca", "说人话。"),
  tavern("温迪", "……", "venti", 2),
  tavern("钟离", "换言之。", "zhongli", 3),
  tavern("钟离", "当它引起的波动足够明显时，", "zhongli", 3),
  tavern("钟离", "自然会显露踪迹。", "zhongli", 3),
  tavern("Bianca", "所以现在就是……"),
  tavern("Bianca", "等它自己搞出事情？"),
  tavern("温迪", "差不多就是这个意思。", "venti", 2),
  tavern("Bianca", "你们这个解决方案是不是有点被动。"),

  tavern("Bianca", "等等。"),
  tavern("Bianca", "那菲林斯呢？"),
  tavern("温迪", "菲林斯？", "venti", 1),
  tavern("Bianca", "就是那个在机场一直装工作人员的人。"),
  tavern("Bianca", "他明显早就知道我会来这里。"),
  tavern("钟离", "……菲林斯。", "zhongli", 5),
  tavern("温迪", "原来如此。", "venti", 5),
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
  tavern("Bianca", "不会这么巧吧？"),
];
