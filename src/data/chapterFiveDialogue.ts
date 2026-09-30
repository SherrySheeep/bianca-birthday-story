export type AmberPortrait = 1 | 2 | 3 | 4;
export type ChapterFiveNode = {
  speaker: "安柏" | "Bianca" | "旁白";
  text: string;
  portrait?: AmberPortrait;
  next?: string;
  options?: { label: string; next: string }[];
  finalNarration?: boolean;
};

const line = (speaker: ChapterFiveNode["speaker"], text: string, portrait: AmberPortrait, next: string): ChapterFiveNode => ({ speaker, text, portrait, next });

export const chapterFiveDialogue: Record<string, ChapterFiveNode> = {
  amberOpening: line("安柏", "喂！你没事吧？刚才看你在天上晃来晃去的，吓我一跳！", 3, "biancaOpening"),
  biancaOpening: line("Bianca", "我觉得我更像是从天上掉下来的。", 3, "amberAgree"),
  amberAgree: line("安柏", "……嗯，这点倒是没错。", 1, "amberRealises"),
  amberRealises: {
    speaker: "安柏",
    text: "等等！你该不会根本不会用风之翼吧？",
    portrait: 2,
    options: [
      { label: "不会。", next: "choiceA" },
      { label: "我甚至不知道为什么自己会在天上。", next: "choiceB" },
      { label: "这东西还能先学再飞的吗？", next: "choiceC" },
    ],
  },
  choiceA: line("安柏", "什么？！那你刚才到底是怎么飞起来的？！", 2, "noLicence"),
  choiceB: line("安柏", "啊？！连怎么飞起来的都不知道？！", 2, "noLicence"),
  choiceC: line("安柏", "当然可以啊！你不会连飞行执照都没有吧？！", 2, "noLicence"),
  noLicence: line("安柏", "什么？！没有飞行执照就敢乱飞！", 2, "biancaExplain"),
  biancaExplain: line("Bianca", "不是，我其实——", 2, "amberChampion"),
  amberChampion: line("安柏", "正好！我可是蒙德城的飞行冠军！走走走，我带你去参加飞行考试！", 4, "biancaProtest"),
  biancaProtest: line("Bianca", "等一下！我还没说我要——", 4, "draggedAway"),
  draggedAway: { speaker: "旁白", text: "安柏已经抓住 Bianca 的手，兴致勃勃地往蒙德城跑去。", portrait: 4, finalNarration: true },
};
