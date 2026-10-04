export type ChapterNinePortrait = { file: string; folder: "npcs" | "existing"; alt: string };
export type ChapterNineLine = { speaker: string; text: string; portrait?: ChapterNinePortrait };

export type ChapterNineLocation = {
  id: string;
  name: string;
  icon: string;
  scene: string;
  position: { left: number; top: number };
  lines: ChapterNineLine[];
  message: { title: string; body: string; signature: string; avatar: string };
};

export const chapterNineOpening: ChapterNineLine[] = [
  { speaker: "Bianca", text: "啊……好累啊。" },
  { speaker: "Bianca", text: "所以，我现在可以回去了吗？" },
  { speaker: "菲林斯", text: "差不多。", portrait: { folder: "existing", file: "chapter-eight/FLS1.png", alt: "菲林斯" } },
  { speaker: "菲林斯", text: "大的紊乱已经解决了。", portrait: { folder: "existing", file: "chapter-eight/FLS1.png", alt: "菲林斯" } },
  { speaker: "Bianca", text: "“差不多”是什么意思？" },
  { speaker: "菲林斯", text: "蒙德城里还有一点残存的气息。", portrait: { folder: "existing", file: "chapter-eight/FLS1.png", alt: "菲林斯" } },
  { speaker: "菲林斯", text: "不过已经没什么危险了。", portrait: { folder: "existing", file: "chapter-eight/FLS2.png", alt: "菲林斯" } },
  { speaker: "Bianca", text: "……所以还有任务？" },
  { speaker: "菲林斯", text: "不算任务。", portrait: { folder: "existing", file: "chapter-eight/FLS2.png", alt: "菲林斯" } },
  { speaker: "菲林斯", text: "你可以自己到城里逛逛。", portrait: { folder: "existing", file: "chapter-eight/FLS1.png", alt: "菲林斯" } },
  { speaker: "菲林斯", text: "正好看看蒙德。", portrait: { folder: "existing", file: "chapter-eight/FLS1.png", alt: "菲林斯" } },
  { speaker: "Bianca", text: "你不一起去？" },
  { speaker: "菲林斯", text: "没必要。", portrait: { folder: "existing", file: "chapter-eight/FLS2.png", alt: "菲林斯" } },
  { speaker: "菲林斯", text: "现在已经没有危险了。", portrait: { folder: "existing", file: "chapter-eight/FLS2.png", alt: "菲林斯" } },
  { speaker: "菲林斯", text: "你不是还没好好逛过蒙德吗？", portrait: { folder: "existing", file: "chapter-eight/FLS1.png", alt: "菲林斯" } },
  { speaker: "Bianca", text: "……这倒是。" },
  { speaker: "菲林斯", text: "我会在城门上方的城墙等你。", portrait: { folder: "existing", file: "chapter-eight/FLS1.png", alt: "菲林斯" } },
  { speaker: "菲林斯", text: "等你把那些残存的气息都处理完，就来找我。", portrait: { folder: "existing", file: "chapter-eight/FLS1.png", alt: "菲林斯" } },
  { speaker: "Bianca", text: "好吧……" },
  { speaker: "Bianca", text: "那我就先去逛逛。" },
];

const existing = (file: string, alt: string): ChapterNinePortrait => ({ folder: "existing", file, alt });
const npc = (file: string, alt: string): ChapterNinePortrait => ({ folder: "npcs", file, alt });

export const chapterNineLocations: ChapterNineLocation[] = [
  {
    id: "knights", name: "西风骑士团", icon: "xifengqishituan.png", scene: "xifengqishituan1.png", position: { left: 40, top: 62 },
    lines: [
      { speaker: "Bianca", text: "原来骑士团里面长这样。比想象中安静多了。" },
      { speaker: "凯亚", text: "这不是那位刚拿到飞行执照的旅行者吗？", portrait: npc("kaiya1.png", "凯亚") },
      { speaker: "Bianca", text: "为什么连你都知道无证飞行的事……" },
      { speaker: "凯亚", text: "蒙德的消息总是跟风一样快。放心，我不会取笑你的。", portrait: npc("kaiya2.png", "凯亚") },
      { speaker: "Bianca", text: "你已经在笑了吧。" },
      { speaker: "Bianca", text: "等等，公告栏后面好像有一点不自然的光。" },
      { speaker: "Bianca", text: "找到了，是残留的异界回响。" },
    ],
    message: { title: "异世界的信息", body: "愿你每次出发都带着好奇，也总能平安找到回来的路。", signature: "来自现实世界的一封小纸条", avatar: "touxiang1.png" },
  },
  {
    id: "cathedral", name: "西风大教堂", icon: "xifengdajiaotang.png", scene: "xifengdajiaotang1.png", position: { left: 19.5, top: 27.5 },
    lines: [
      { speaker: "Bianca", text: "这里好安静……感觉说话都会不自觉放轻。" },
      { speaker: "Bianca", text: "彩窗投下来的光，好像把时间也照慢了一点。" },
      { speaker: "Bianca", text: "咦？那束光里有一个不属于彩窗的亮点。" },
      { speaker: "Bianca", text: "靠近以后就消散了。看来又找到一条。" },
    ],
    message: { title: "异世界的信息", body: "愿生活偶尔慢下来，让你听见自己真正喜欢的声音。", signature: "一束很远的光", avatar: "touxiang2.png" },
  },
  {
    id: "guild", name: "冒险家协会", icon: "maoxianjiaxiehui.png", scene: "maoxianjiaxiehui1.png", position: { left: 54, top: 77.5 },
    lines: [
      { speaker: "Bianca", text: "这个委托栏也太满了吧。找猫、送信、清理史莱姆……" },
      { speaker: "Bianca", text: "等等，这张“未知来源委托”的对象为什么写着 Bianca？" },
      { speaker: "Bianca", text: "异世界怎么连我的名字都知道啊。" },
      { speaker: "Bianca", text: "纸张背面有一点发光……原来信息藏在这里。" },
    ],
    message: { title: "异世界的信息", body: "今天也许没有攻略，但你一直都有把混乱走成故事的本事。", signature: "匿名委托人", avatar: "touxiang3.png" },
  },
  {
    id: "hotel", name: "歌德大酒店", icon: "gededajiudian.png", scene: "gededajiudian1.png", position: { left: 54, top: 47 },
    lines: [
      { speaker: "Bianca", text: "钟离？你怎么也在这里？" },
      { speaker: "钟离", text: "旅途中适当歇息，也是必要之事。", portrait: existing("chapter-seven/Zhongli2.png", "钟离") },
      { speaker: "Bianca", text: "你看起来倒是完全不着急。" },
      { speaker: "钟离", text: "归途既已临近，更不必扰乱眼前片刻。", portrait: existing("chapter-seven/Zhongli1.png", "钟离") },
      { speaker: "Bianca", text: "……这句话听起来还挺适合写在明信片上。" },
      { speaker: "Bianca", text: "前台铜铃旁边有一圈奇怪的光。又一条信息。" },
    ],
    message: { title: "异世界的信息", body: "走得再远，也别忘了给自己留一张柔软的床和一段安心的休息。", signature: "旅途中的旧友", avatar: "touxiang4.png" },
  },
  {
    id: "fountain", name: "喷泉广场", icon: "penquanguangchang.png", scene: "penquanguangchang1.png", position: { left: 48, top: 49 },
    lines: [
      { speaker: "温迪", text: "累了的话，就在这里坐一会儿吧。", portrait: existing("chapter-seven/Wendi2.png", "温迪") },
      { speaker: "Bianca", text: "可是我还有好几个地方没去。" },
      { speaker: "温迪", text: "风又不会催你。", portrait: existing("chapter-seven/Wendi1.png", "温迪") },
      { speaker: "Bianca", text: "……也是。难得真的能停下来发会儿呆。" },
      { speaker: "Bianca", text: "喷泉里的倒影刚才是不是慢了一拍？" },
      { speaker: "Bianca", text: "碰到水面以后，那道回响就散开了。" },
    ],
    message: { title: "异世界的信息", body: "风不会催你，朋友也不会。按自己的节奏，慢慢走就好。", signature: "顺风寄来的话", avatar: "touxiang5.png" },
  },
  {
    id: "souvenir", name: "荣光之风", icon: "rongguangzhifeng.png", scene: "rongguangzhifeng1.png", position: { left: 68.5, top: 57 },
    lines: [
      { speaker: "Bianca", text: "纪念品店……这种地方最危险了。" },
      { speaker: "Bianca", text: "很容易买一堆完全没必要、但是非常可爱的东西。" },
      { speaker: "Bianca", text: "这个小风车摆件居然会自己转。" },
      { speaker: "Bianca", text: "没有风……那就是残存的异界气息了。" },
    ],
    message: { title: "异世界的信息", body: "可以买没必要的小东西，也可以做没必要但开心的事。快乐本来就很有必要。", signature: "钱包尚未退出群聊", avatar: "touxiang6.png" },
  },
  {
    id: "training", name: "骑士团训练场", icon: "qishituanxunlianchang.png", scene: "qishituanxunlianchang1.png", position: { left: 34, top: 55 },
    lines: [
      { speaker: "安柏", text: "Bianca！要不要顺便再练一次飞行？", portrait: existing("chapter-five/Anbo4.png", "安柏") },
      { speaker: "Bianca", text: "不要。" },
      { speaker: "安柏", text: "拒绝得也太快了吧！", portrait: existing("chapter-five/Anbo2.png", "安柏") },
      { speaker: "Bianca", text: "我已经从坠落、补考一路成长到持证飞行了，今天的额度用完了。" },
      { speaker: "Bianca", text: "训练木桩旁边闪了一下……这也算是成长的纪念吗？" },
      { speaker: "Bianca", text: "好，又收集到一条。" },
    ],
    message: { title: "异世界的信息", body: "成长不一定要很伟大。有时候，只是比上次少摔一点点。", signature: "来自训练场的掌声", avatar: "touxiang7.png" },
  },
  {
    id: "lab", name: "魔法实验室", icon: "mofashiyanshi.png", scene: "mofashiyanshi1.png", position: { left: 61, top: 74.5 },
    lines: [
      { speaker: "Bianca", text: "这里一看就很容易出事。" },
      { speaker: "Bianca", text: "这个装置的读数一直在跳，旁边的元素灯也在闪。" },
      { speaker: "Bianca", text: "这次的异常比前面明显多了……" },
      { speaker: "Bianca", text: "不过在我靠近以后，它正在快速消散。" },
      { speaker: "Bianca", text: "最后一段回响，也收好了。" },
    ],
    message: { title: "异世界的信息", body: "愿所有暂时找不到答案的问题，最后都变成值得讲给朋友听的故事。", signature: "跨越世界的回响", avatar: "touxiang8.png" },
  },
];

export const chapterNineEnding: ChapterNineLine[] = [
  { speaker: "菲林斯", text: "看来，都找到了。", portrait: existing("chapter-eight/FLS1.png", "菲林斯") },
  { speaker: "Bianca", text: "嗯。" },
  { speaker: "Bianca", text: "所以……这次真的可以回去了吧？" },
  { speaker: "菲林斯", text: "可以。", portrait: existing("chapter-eight/FLS2.png", "菲林斯") },
];
