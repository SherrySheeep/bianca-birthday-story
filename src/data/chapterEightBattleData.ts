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
  { id: "xlookup", name: "git push", description: "稳定单体伤害", damage: UNIVERSITY_SKILLS.xlookup.damage, energy: UNIVERSITY_SKILLS.xlookup.energyGain },
  { id: "deadline", name: "Deadline Rush", description: "高伤害，消耗自身 HP", damage: UNIVERSITY_SKILLS.deadline.damage, energy: UNIVERSITY_SKILLS.deadline.energyGain },
  { id: "extension", name: "Extension Request", description: "延后行动／打断展示", damage: UNIVERSITY_SKILLS.extension.damage, energy: UNIVERSITY_SKILLS.extension.energyGain },
  { id: "groupChat", name: "Group Chat 99+", description: "清除小组作业", damage: UNIVERSITY_SKILLS.groupChat.damage, energy: UNIVERSITY_SKILLS.groupChat.energyGain },
  { id: "consideration", name: "Special Consideration", description: "恢复 HP，并进入冷却", damage: UNIVERSITY_SKILLS.consideration.damage, energy: UNIVERSITY_SKILLS.consideration.energyGain },
  { id: "graduation", name: "毕业", description: "终极技能", damage: UNIVERSITY_SKILLS.graduation.damage, energy: -UNIVERSITY_SKILLS.graduation.energyCost },
] as const;

export type BossSkillId = "assignment" | "groupwork" | "presentation" | "quiz" | "rubric" | "courseFee" | "finalExam";
export const unswBossSkills: Record<BossSkillId, {
  name: string;
  damage: number;
  dialogueVariants: string[][];
}> = {
  assignment: { name: "ASSIGNMENT", damage: UNSW_SKILLS.assignment.damage, dialogueVariants: [["哈哈哈哈！", "再来一份 Assignment！"], ["还撑得住？", "那再来一份！"], ["Deadline 已经开始倒数了！"]] },
  groupwork: { name: "GROUPWORK", damage: UNSW_SKILLS.groupwork.damage, dialogueVariants: [["怕了吧！", "这次——是 Groupwork！"], ["一个人打得很开心？", "那就分组！"]] },
  presentation: { name: "PRESENTATION · Preparing…", damage: UNSW_SKILLS.presentation.damage, dialogueVariants: [["躲什么躲！", "上台 Presentation！"], ["轮到你展示了！"]] },
  quiz: { name: "SURPRISE QUIZ", damage: UNSW_SKILLS.quiz.damage, dialogueVariants: [["准备好了？", "没准备也没用！"], ["接着！突击测验！"]] },
  rubric: { name: "RUBRIC UPDATED", damage: UNSW_SKILLS.rubric.damage, dialogueVariants: [["哈哈哈哈！", "规则——改了！"], ["再看一眼 Rubric 吧！"]] },
  courseFee: { name: "COURSE FEE", damage: 0, dialogueVariants: [["想跑？", "先把学费交了！"]] },
  finalExam: { name: "FINAL EXAM", damage: UNSW_SKILLS.finalExam.damage, dialogueVariants: [["还没结束！", "真正的考验现在才开始！"], ["最后一题——不许交白卷！"]] },
};

export const UNSW_MAX_HP = UNSW_STATS.maxHp;
export const BIANCA_BOSS_MAX_HP = BIANCA_STATS.unswMaxHp;
import { BIANCA_STATS, UNSW_SKILLS, UNSW_STATS, UNIVERSITY_SKILLS } from "./chapterEightBattleConfig";

