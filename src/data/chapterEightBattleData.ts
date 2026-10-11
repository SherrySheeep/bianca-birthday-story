export type AbyssAction = "normal" | "skill" | "ultimate";

export const abyssTutorialSteps: Array<{
  expected: AbyssAction;
  guide: string;
  lines: string[];
  wrong: string;
}> = [
  { expected: "normal", guide: "安柏", lines: ["先从最基础的开始！", "试试普通攻击！"], wrong: "先别急！先试普通攻击！" },
  { expected: "skill", guide: "钟离", lines: ["敌人数量较多。", "此时，可以尝试同时影响多个目标。"], wrong: "此刻，那一招更合适。" },
  { expected: "ultimate", guide: "温迪", lines: ["差不多该试试更厉害的招式了吧？"], wrong: "先试试那招最厉害的吧～" },
  { expected: "normal", guide: "安柏", lines: ["元素支援已经连上了！", "用强化后的攻击结束战斗吧！"], wrong: "就是那个发光的普通攻击！" },
];

export type UniversitySkillId = "xlookup" | "deadline" | "extension" | "groupChat" | "consideration" | "graduation";
export const universitySkills = [
  { id: "xlookup", name: "XLOOKUP", description: "稳定单体伤害", damage: 68, energy: 22 },
  { id: "deadline", name: "Deadline Rush", description: "高伤害，自损 10 HP", damage: 112, energy: 30 },
  { id: "extension", name: "Extension Request", description: "延后行动／打断展示", damage: 25, energy: 18 },
  { id: "groupChat", name: "Group Chat 99+", description: "清除小组作业", damage: 35, energy: 20 },
  { id: "consideration", name: "Special Consideration", description: "恢复 65 HP，冷却 3 回合", damage: 0, energy: 10 },
  { id: "graduation", name: "毕业", description: "终极技能", damage: 230, energy: -100 },
] as const;

export type BossSkillId = "assignment" | "groupwork" | "presentation" | "quiz" | "rubric" | "courseFee" | "finalExam";
export const unswBossSkills: Record<BossSkillId, {
  name: string;
  damage: number;
  dialogueVariants: string[][];
}> = {
  assignment: { name: "ASSIGNMENT", damage: 28, dialogueVariants: [["哈哈哈哈！", "再来一份 Assignment！"], ["还撑得住？", "那再来一份！"], ["Deadline 已经开始倒数了！"]] },
  groupwork: { name: "GROUPWORK", damage: 15, dialogueVariants: [["怕了吧！", "这次——是 Groupwork！"], ["一个人打得很开心？", "那就分组！"]] },
  presentation: { name: "PRESENTATION · Preparing…", damage: 0, dialogueVariants: [["躲什么躲！", "上台 Presentation！"], ["轮到你展示了！"]] },
  quiz: { name: "SURPRISE QUIZ", damage: 19, dialogueVariants: [["准备好了？", "没准备也没用！"], ["接着！突击测验！"]] },
  rubric: { name: "RUBRIC UPDATED", damage: 12, dialogueVariants: [["哈哈哈哈！", "规则——改了！"], ["再看一眼 Rubric 吧！"]] },
  courseFee: { name: "COURSE FEE　-$1,248", damage: 0, dialogueVariants: [["想跑？", "先把学费交了！"]] },
  finalExam: { name: "FINAL EXAM", damage: 55, dialogueVariants: [["还没结束！", "真正的考验现在才开始！"], ["最后一题——不许交白卷！"]] },
};

export const UNSW_MAX_HP = 620;
export const BIANCA_BOSS_MAX_HP = 230;
