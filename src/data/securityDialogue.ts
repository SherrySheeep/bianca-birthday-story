export type SecurityPortrait = 1 | 2 | 3;
export type SecurityNode = {
  speaker: "Bianca" | "菲林斯" | "旁白";
  text: string;
  portrait?: SecurityPortrait;
  next?: string;
  options?: { label: string; next: string }[];
  completed?: boolean;
};

const line = (speaker: SecurityNode["speaker"], text: string, portrait: SecurityPortrait, next: string): SecurityNode => ({ speaker, text, portrait, next });

export const securityDialogue: Record<string, SecurityNode> = {
  start: line("Bianca", "不好意思……", 1, "staff1"),
  staff1: line("菲林斯", "嗯？\n有什么问题吗，旅客？", 1, "bianca1"),
  bianca1: line("Bianca", "我的行李刚刚进去以后……\n不见了。", 1, "normal"),
  normal: line("菲林斯", "哦。\n正常现象。", 2, "normalQuestion"),
  normalQuestion: line("Bianca", "……正常？", 2, "technology"),
  technology: {
    speaker: "菲林斯",
    text: "当然。\n这是机场最近投入使用的新型行李处理技术。",
    portrait: 1,
    options: [
      { label: "什么新技术能把箱子直接变没？", next: "optionA1" },
      { label: "我刚刚明明看到它闪了一下。", next: "optionB1" },
      { label: "你确定我的箱子还在这个机场？", next: "optionC1" },
    ],
  },
  optionA1: line("菲林斯", "空间优化技术。\n减少传送带占用，提高运输效率。", 3, "optionA2"),
  optionA2: line("菲林斯", "很先进吧？", 2, "common1"),
  optionB1: line("菲林斯", "扫描光。\n最新型号功率比较……活泼。", 3, "optionB2"),
  optionB2: line("Bianca", "功率还能活泼？", 3, "optionB3"),
  optionB3: line("菲林斯", "新科技嘛。", 2, "common1"),
  optionC1: line("菲林斯", "……", 3, "optionC2"),
  optionC2: line("菲林斯", "从某种意义上来说。", 3, "optionC3"),
  optionC3: line("菲林斯", "当然。", 2, "common1"),
  common1: line("菲林斯", "不必担心。\n你的行李已经完成检查。\n系统确认没有危险物品。\n现在它已经被……", 1, "common2"),
  common2: line("菲林斯", "传送到了正确的位置。", 3, "common3"),
  common3: line("菲林斯", "……送到了正确的位置。", 3, "common4"),
  common4: line("菲林斯", "会直接出现在飞机的行李舱。", 1, "bianca2"),
  bianca2: line("Bianca", "现在机场已经这么先进了？", 1, "staff2"),
  staff2: line("菲林斯", "科技总是在进步。\n普通旅客不知道也很正常。", 3, "professional"),
  professional: line("菲林斯", "请相信专业人士。", 2, "bianca3"),
  bianca3: line("Bianca", "那为什么别人行李还是正常从机器里出来？", 2, "silence"),
  silence: line("菲林斯", "……", 3, "sample"),
  sample: line("菲林斯", "抽样测试。", 3, "bianca4"),
  bianca4: line("Bianca", "刚好抽到我？", 3, "lucky"),
  lucky: line("菲林斯", "看来你今天运气不错。\n旅行者。", 2, "bianca5"),
  bianca5: line("Bianca", "又是旅行者？", 2, "shortFor"),
  shortFor: line("菲林斯", "常旅行的旅客。\n简称。", 3, "ending1"),
  ending1: line("菲林斯", "好了。\n你的行李已经安全抵达该去的地方。", 1, "ending2"),
  ending2: line("菲林斯", "至于你……\n也很快了。", 3, "bianca6"),
  bianca6: line("Bianca", "什么？", 3, "ending3"),
  ending3: line("菲林斯", "我说——", 3, "ending4"),
  ending4: line("菲林斯", "你也该去登机口了。", 2, "complete"),
  complete: { speaker: "旁白", text: "B老师对现代航空技术产生了一些错误的认识。", portrait: 2, completed: true },
};
