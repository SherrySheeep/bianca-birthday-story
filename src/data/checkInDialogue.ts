export type CheckInPortrait = 1 | 2 | 3 | 4;
export type CheckInOption = { label: string; next: string };
export type CheckInNode = {
  speaker?: "菲林斯" | "Bianca" | "旁白" | "系统";
  text: string;
  portrait?: CheckInPortrait;
  options?: CheckInOption[];
  next?: string;
  systemTag?: boolean;
  completed?: boolean;
};

const n = (speaker: CheckInNode["speaker"], text: string, portrait: CheckInPortrait, next: string): CheckInNode => ({ speaker, text, portrait, next });
const q = (text: string, portrait: CheckInPortrait, options: CheckInOption[]): CheckInNode => ({ speaker: "菲林斯", text, portrait, options });

export const checkInStartNode = "opening";
export const checkInDialogue: Record<string, CheckInNode> = {
  opening: { speaker: "菲林斯", text: "下午好。护照和机票，请。", portrait: 1, options: [{ label: "给。（交出护照）", next: "handover" }] },
  handover: n("旁白", "Bianca 把护照和机票递了过去。", 1, "recognise"),
  recognise: n("菲林斯", "……Bianca。\n悉尼出发。\n又要旅行？", 1, "q1"),
  q1: q("那么，例行问题。\n这次出行的主要目的是什么？", 1, [
    { label: "回国看看家人。", next: "q1a" }, { label: "吃饭、逛街、买东西。", next: "q1b" }, { label: "出去玩啊，不然呢？", next: "q1c" },
  ]),
  q1a: n("菲林斯", "很标准的回答。\n至少听起来不像是临时起意。", 1, "q2"),
  q1b: n("菲林斯", "……非常诚实。\n我开始替你的行李额度担心了。", 2, "q2"),
  q1c: n("菲林斯", "理直气壮。\n看来这趟旅程不需要什么更深刻的理由。", 2, "q2"),
  q2: q("嗯……\n系统显示，你今年的出行记录似乎不少。\n\n经常旅行？", 1, [
    { label: "还好吧，也就到处跑跑。", next: "q2a1" }, { label: "今年确实飞得有点多。", next: "q2b1" }, { label: "我都回国两次了。", next: "q2c1" },
  ]),
  q2a1: n("菲林斯", "“也就到处跑跑。”\n真是很有旅行者风范的说法。", 2, "q2a2"),
  q2a2: n("菲林斯", "……我是说，旅客。", 4, "q3"),
  q2b1: n("菲林斯", "旅行者吗？\n……有意思。", 3, "q2b2"),
  q2b2: n("菲林斯", "咳。\n我的意思是，常旅客。\n航空公司的说法而已。", 4, "q3"),
  q2c1: n("菲林斯", "两次？\n看来“返程”这种东西对你而言，已经快成为固定节目了。", 3, "q2c2"),
  q2c2: n("菲林斯", "……倒也符合旅行者的习惯。", 3, "q2c3"),
  q2c3: n("Bianca", "什么？", 3, "q2c4"),
  q2c4: n("菲林斯", "我说，符合经常旅行的人的习惯。\n请不要在意。", 4, "q3"),
  q3: q("最后一项常规确认。\n\n如果只能随身保留一样东西，你会选什么？", 1, [
    { label: "护照。", next: "q3a1" }, { label: "手机。", next: "q3b1" }, { label: "钱包。", next: "q3c1" },
  ]),
  q3a1: n("菲林斯", "理智的选择。\n没有它，有些“世界”确实进不去。", 3, "q3a2"),
  q3a2: n("菲林斯", "……我是说，国家。", 4, "strange1"),
  q3b1: n("菲林斯", "可以理解。\n地图、付款、联系朋友……\n现代人的第二条命。", 1, "q3b2"),
  q3b2: n("菲林斯", "不过有些地方，可没有信号。", 3, "q3b3"),
  q3b3: n("Bianca", "什么地方？", 3, "q3b4"),
  q3b4: n("菲林斯", "偏远地区。\n很常见。", 4, "strange1"),
  q3c1: n("菲林斯", "我本来还想说你很务实。\n但结合你刚才的“购物”回答……\n我只能祝它好运。", 2, "strange1"),
  strange1: n("菲林斯", "……奇怪。", 3, "strange2"),
  strange2: n("Bianca", "怎么了？", 3, "strange3"),
  strange3: n("菲林斯", "没什么。\n系统只是……\n识别到了一项不常见的旅客标签。", 3, "travelerTag"),
  travelerTag: { speaker: "系统", text: "", portrait: 3, systemTag: true, next: "strange4" },
  strange4: n("菲林斯", "旅行者吗？\n有意思。", 3, "strange5"),
  strange5: n("菲林斯", "……频繁旅行者。\n系统翻译偶尔不太准确。", 4, "q4"),
  q4: q("还有一个问题。\n\n假如——我只是说假如——\n你的航班最终抵达的地方，和机票上写的不一样。\n\n你会怎么做？", 3, [
    { label: "先下飞机再说。", next: "q4a1" }, { label: "先看看那里有什么好玩的。", next: "q4b1" }, { label: "那我要投诉航空公司。", next: "q4c1" },
  ]),
  q4a1: n("菲林斯", "很好。", 2, "q4a2"),
  q4a2: n("菲林斯", "能活……咳，能顺利旅行的人，通常都很会随机应变。", 4, "q5"),
  q4b1: n("菲林斯", "哦？\n这种心态倒是很适合旅行者。", 2, "q4b2"),
  q4b2: n("菲林斯", "……游客。", 4, "q5"),
  q4c1: n("菲林斯", "合理。", 1, "q4c2"),
  q4c2: n("菲林斯", "不过如果那里没有航空公司呢？", 3, "q4c3"),
  q4c3: n("Bianca", "啥？", 3, "q4c4"),
  q4c4: n("菲林斯", "……我的意思是，\n如果是代码共享航班。", 4, "q5"),
  q5: q("最后一个问题。\n\n你相信这个世界之外，\n还有别的世界吗？", 3, [
    { label: "你们值机现在还问这个？", next: "q5a1" }, { label: "不信。", next: "q5b1" }, { label: "为什么不信？", next: "q5c1" },
  ]),
  q5a1: n("菲林斯", "……", 4, "q5a2"),
  q5a2: n("菲林斯", "新增流程。", 4, "ending1"),
  q5b1: n("菲林斯", "是吗。\n通常旅行者在第一次跨越世界之前，也不会相信。", 3, "q5b2"),
  q5b2: n("Bianca", "什么叫第一次？", 3, "q5b3"),
  q5b3: n("菲林斯", "第一次……国际旅行。\n口误。", 4, "ending1"),
  q5c1: n("菲林斯", "不错。", 3, "q5c2"),
  q5c2: n("菲林斯", "那么希望你抵达之后，也还能这么回答。", 3, "q5c3"),
  q5c3: n("Bianca", "抵达哪里？", 3, "q5c4"),
  q5c4: n("菲林斯", "中国。\n……当然是中国。", 4, "ending1"),
  ending1: n("菲林斯", "好了。\n\n行李已经托运。\n登机牌收好。\n\n接下来去安检，然后前往登机口。", 1, "ending2"),
  ending2: n("菲林斯", "祝你旅途愉快，旅行者。", 3, "ending3"),
  ending3: n("Bianca", "嗯？", 3, "ending4"),
  ending4: n("菲林斯", "……旅客。\n我说的是旅客。", 4, "complete"),
  complete: { speaker: "旁白", text: "此时的B老师并没有察觉到任何异样。", portrait: 4, completed: true },
};
