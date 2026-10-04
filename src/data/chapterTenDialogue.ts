export type ChapterTenLine = { speaker: string; text: string; portrait?: "flins1" | "flins2" | "cindy" | "sherry" };

export const birthdayCakeScene = "birthday-cake-reveal.png";

export const chapterTenWall: ChapterTenLine[] = [
  { speaker: "菲林斯", text: "看来，都找到了。", portrait: "flins1" },
  { speaker: "Bianca", text: "嗯。" },
  { speaker: "Bianca", text: "所以……这次真的可以回去了吧？" },
  { speaker: "菲林斯", text: "可以。", portrait: "flins2" },
  { speaker: "Bianca", text: "终于……" },
  { speaker: "菲林斯", text: "不过，还需要借助一个地方。", portrait: "flins1" },
  { speaker: "Bianca", text: "……不会又是什么考试吧？" },
  { speaker: "菲林斯", text: "传送锚点。", portrait: "flins1" },
  { speaker: "Bianca", text: "哦。" },
  { speaker: "Bianca", text: "这个听起来正常多了。" },
];

export const chapterTenWaypointIdle: ChapterTenLine[] = [
  { speaker: "菲林斯", text: "通常情况下，锚点只会连接提瓦特各处。", portrait: "flins1" },
  { speaker: "菲林斯", text: "不过你和那个东西，本来就不属于这里。", portrait: "flins1" },
  { speaker: "菲林斯", text: "现在你们的气息已经足够稳定。", portrait: "flins1" },
  { speaker: "菲林斯", text: "借助这个锚点，可以打开一次通往你原本世界的路。", portrait: "flins1" },
  { speaker: "Bianca", text: "所以这次不是坐飞机？" },
  { speaker: "菲林斯", text: "你还想再坐一次？", portrait: "flins2" },
  { speaker: "Bianca", text: "……当我没问。" },
];

export const chapterTenWaypointActive: ChapterTenLine[] = [
  { speaker: "菲林斯", text: "准备好了吗？", portrait: "flins1" },
  { speaker: "Bianca", text: "应该吧。" },
  { speaker: "Bianca", text: "这次不会又把我丢到天上吧？" },
  { speaker: "菲林斯", text: "理论上不会。", portrait: "flins2" },
  { speaker: "Bianca", text: "为什么又是“理论上”……" },
  { speaker: "菲林斯", text: "带好那个东西。", portrait: "flins1" },
  { speaker: "菲林斯", text: "别松手。", portrait: "flins1" },
  { speaker: "Bianca", text: "好。" },
];

export const chapterTenKtvWake: ChapterTenLine[] = [
  { speaker: "旁白", text: "包厢里的音乐还在继续。" },
  { speaker: "旁白", text: "屏幕上，张杰的《经过》正放到熟悉的旋律。" },
  { speaker: "旁白", text: "Bianca 缓缓睁开眼睛。" },
  { speaker: "旁白", text: "而此时，时间已经来到了——\n【10月20日】" },
  { speaker: "Bianca", text: "……诶？" },
  { speaker: "Bianca", text: "这里是……" },
  { speaker: "Bianca", text: "KTV？" },
  { speaker: "Bianca", text: "我回来了？" },
  { speaker: "Bianca", text: "等等……" },
  { speaker: "Bianca", text: "我刚刚不是还在蒙德吗？" },
];

export const chapterTenFriends: ChapterTenLine[] = [
  { speaker: "Sherry", text: "你终于回神啦？", portrait: "sherry" },
  { speaker: "Cindy", text: "你刚刚发呆发了好久。", portrait: "cindy" },
  { speaker: "Bianca", text: "……我？" },
  { speaker: "Sherry", text: "怎么了？", portrait: "sherry" },
  { speaker: "Bianca", text: "说来话长……" },
  { speaker: "Bianca", text: "总感觉……我真的去了一个很远的地方。" },
  { speaker: "Cindy", text: "听起来还挺厉害。", portrait: "cindy" },
  { speaker: "Sherry", text: "回来就好啦。", portrait: "sherry" },
];

export const chapterTenHeldItem: ChapterTenLine[] = [
  { speaker: "Bianca", text: "……等等。" },
  { speaker: "Bianca", text: "它怎么也跟着我回来了？" },
  { speaker: "旁白", text: "那个一路被称作“神秘物品”的东西，仍然安静地待在 Bianca 怀里。" },
  { speaker: "旁白", text: "它表面的光芒已经比在提瓦特时柔和了许多。" },
  { speaker: "Bianca", text: "所以你到底是什么啊……" },
  { speaker: "旁白", text: "就在这时，Bianca 仿佛感受到了一丝微弱的呼唤。" },
  { speaker: "Bianca", text: "……你在叫我？" },
];

export const chapterTenTable: ChapterTenLine[] = [
  { speaker: "Bianca", text: "好像……要我做点什么。" },
  { speaker: "Sherry", text: "做什么？", portrait: "sherry" },
  { speaker: "Bianca", text: "不知道。" },
  { speaker: "Bianca", text: "但是感觉不能直接打开。" },
  { speaker: "Cindy", text: "那怎么办？", portrait: "cindy" },
  { speaker: "Bianca", text: "好像……" },
  { speaker: "Bianca", text: "要先完成某种仪式。" },
  { speaker: "Sherry", text: "又来？", portrait: "sherry" },
  { speaker: "Bianca", text: "我也想问。" },
];

export const chapterTenCakeReveal: ChapterTenLine[] = [
  { speaker: "旁白", text: "Bianca 再次睁开眼睛。" },
  { speaker: "Bianca", text: "……诶？" },
  { speaker: "Bianca", text: "蛋糕？！" },
  { speaker: "Sherry", text: "生日快乐呀，Bianca！", portrait: "sherry" },
  { speaker: "Cindy", text: "生日快乐！", portrait: "cindy" },
  { speaker: "Bianca", text: "所以……" },
  { speaker: "Bianca", text: "我折腾了这么久……" },
  { speaker: "Bianca", text: "最后就是为了把蛋糕带回来？" },
  { speaker: "Sherry", text: "这么说好像也没错。", portrait: "sherry" },
  { speaker: "Cindy", text: "总之，生日快乐。", portrait: "cindy" },
  { speaker: "Cindy", text: "希望你今天玩得开心。", portrait: "cindy" },
  { speaker: "Sherry", text: "还有以后也要继续到处旅行、到处玩。", portrait: "sherry" },
  { speaker: "Sherry", text: "不过下次尽量不要真的掉进异世界。", portrait: "sherry" },
  { speaker: "Bianca", text: "这个也不是我能控制的吧……" },
  { speaker: "Sherry", text: "好啦！我们来唱 K 吧！", portrait: "sherry" },
  { speaker: "Cindy", text: "先许愿，先切蛋糕。", portrait: "cindy" },
  { speaker: "Bianca", text: "好啊。" },
];
