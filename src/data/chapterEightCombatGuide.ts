import {
  ABYSS_MAGE_SKILLS,
  BIANCA_SKILLS,
  ELEMENT_CONFIG,
  UNSW_SKILLS,
  UNSW_STATS,
  UNIVERSITY_SKILLS,
  supportCooldownLength,
} from "./chapterEightBattleConfig";

export type CombatGuideSkill = {
  name: string;
  description: string;
  stats?: Array<{ label: string; value: string | number }>;
};

export type CombatGuideEntry = {
  id: string;
  name: string;
  subtitle?: string;
  icon: string;
  skills: CombatGuideSkill[];
  note?: string;
};

const icon = (filename: string) => `${import.meta.env.BASE_URL}chapter-eight/combat-guide/${filename}`;

export const abyssCombatGuideEntries: CombatGuideEntry[] = [
  {
    id: "bianca",
    name: "Bianca",
    icon: icon("BiancaIcon1.png"),
    skills: [
      { name: "普通攻击", description: "对单个敌人造成基础伤害。适合稳定攻击目标和削减护盾。", stats: [{ label: "HP Damage", value: BIANCA_SKILLS.basicAttack.damage }, { label: "Shield Damage", value: BIANCA_SKILLS.basicAttack.shieldDamage }] },
      { name: "冷笑话", description: "对全部敌人造成伤害，并施加「尴尬」，使敌人的行动顺序稍微延后。", stats: [{ label: "Damage", value: BIANCA_SKILLS.coldJoke.damage }, { label: "Shield Damage", value: BIANCA_SKILLS.coldJoke.shieldDamage }, { label: "Action Delay", value: BIANCA_SKILLS.coldJoke.actionDelay }, { label: "Cooldown", value: BIANCA_SKILLS.coldJoke.cooldown }] },
      { name: "软硬软拒绝", description: "Bianca 的终结技。连续进行「软 → 硬 → 软」三段攻击，其中「硬」造成主要伤害，并使敌人的行动顺序延后。", stats: [{ label: "第一段软 HP / Shield", value: `${BIANCA_SKILLS.softHardSoft.softHit1Damage} / ${BIANCA_SKILLS.softHardSoft.softHit1ShieldDamage}` }, { label: "硬 HP / Shield", value: `${BIANCA_SKILLS.softHardSoft.hardHitDamage} / ${BIANCA_SKILLS.softHardSoft.hardHitShieldDamage}` }, { label: "第二段软 HP / Shield", value: `${BIANCA_SKILLS.softHardSoft.softHit2Damage} / ${BIANCA_SKILLS.softHardSoft.softHit2ShieldDamage}` }, { label: "Action Delay", value: BIANCA_SKILLS.softHardSoft.actionDelay }] },
    ],
  },
  {
    id: "blue", name: "蓝色深渊法师", icon: icon("BlueIcon1.png"),
    skills: [
      { name: "冰晶弹", description: "向 Bianca 发射冰晶，造成直接伤害。", stats: [{ label: "Damage", value: ABYSS_MAGE_SKILLS.blue.iceShard.damage }] },
      { name: "寒气护盾", description: "恢复自身一部分护盾，使其更难被击破。", stats: [{ label: "Shield Gain", value: ABYSS_MAGE_SKILLS.blue.frostShield.shieldGain }] },
    ], note: "火元素对它的冰元素护盾尤其有效。",
  },
  {
    id: "red", name: "红色深渊法师", icon: icon("RedIcon1.png"),
    skills: [
      { name: "小火球", description: "向 Bianca 发射火球，造成基础火焰伤害。", stats: [{ label: "Damage", value: ABYSS_MAGE_SKILLS.red.fireball.damage }] },
      { name: "火焰爆发", description: "威力更高的攻击，会对 Bianca 造成较大的直接伤害。", stats: [{ label: "Damage", value: ABYSS_MAGE_SKILLS.red.flameBurst.damage }] },
    ],
  },
  {
    id: "purple", name: "紫色深渊法师", icon: icon("PurpleIcon1.png"),
    skills: [
      { name: "雷击", description: "以雷电攻击 Bianca，造成直接伤害。", stats: [{ label: "Damage", value: ABYSS_MAGE_SKILLS.purple.lightningStrike.damage }] },
      { name: "麻痹干扰", description: "造成伤害，并使 Bianca 在行动顺序中向后移动一个位置。", stats: [{ label: "Damage", value: ABYSS_MAGE_SKILLS.purple.paralysisInterference.damage }, { label: "Action Delay", value: ABYSS_MAGE_SKILLS.purple.paralysisInterference.actionDelaySlots }] },
    ], note: "如果 Bianca 当前拥有钟离提供的岩盾，可以抵挡一次麻痹造成的行动延后。",
  },
  {
    id: "amber", name: "安柏", subtitle: "火元素支援", icon: icon("AnboIcon1.png"),
    skills: [
      { name: "火元素强化", description: "使 Bianca 下一次攻击附加火元素。" },
      { name: "对冰盾强化", description: "火元素对蓝色深渊法师的冰元素护盾造成更高的护盾伤害。", stats: [{ label: "Multiplier", value: `${ELEMENT_CONFIG.amber.fireVsIceShieldMultiplier}×` }] },
      { name: "燃烧", description: "火元素命中敌人后，使目标进入燃烧状态，在接下来的若干回合持续受到伤害。", stats: [{ label: "Duration", value: ELEMENT_CONFIG.burn.duration }, { label: "Damage per Tick", value: ELEMENT_CONFIG.burn.damagePerTick }] },
      { name: "火 + 风：扩散", description: "处于燃烧状态的敌人再次受到温迪的风元素攻击时，会触发「扩散」，将火焰传播到相邻敌人。" },
    ], note: `燃烧状态可以被风元素作用。支援冷却：${supportCooldownLength.amber} 回合。`,
  },
  {
    id: "venti", name: "温迪", subtitle: "风元素支援", icon: icon("WendiIcon1.png"),
    skills: [
      { name: "风元素强化", description: "使 Bianca 下一次攻击附带风元素效果。" },
      { name: "行动延后", description: "风元素攻击会将敌人的行动顺序向后推动。", stats: [{ label: "Action Delay", value: ELEMENT_CONFIG.venti.actionDelayAmount }] },
      { name: "扩散", description: "如果目标已经处于燃烧状态，风元素会将燃烧传播到一个相邻敌人，并造成额外伤害。", stats: [{ label: "Spread Damage", value: ELEMENT_CONFIG.venti.spreadDamage }, { label: "Cooldown", value: supportCooldownLength.venti }] },
    ], note: "元素反应：火元素 → Burning → 风元素 → Spread。",
  },
  {
    id: "zhongli", name: "钟离", subtitle: "岩元素支援", icon: icon("ZhongliIcon1.png"),
    skills: [
      { name: "岩盾", description: "Bianca 使用钟离支援后会获得岩元素护盾。", stats: [{ label: "Shield Amount", value: ELEMENT_CONFIG.zhongli.shieldAmount }] },
      { name: "伤害吸收", description: "受到攻击时优先消耗护盾，不会立即损失 HP。" },
      { name: "抵抗麻痹", description: "岩盾存在时，可以抵挡一次「麻痹干扰」造成的行动延后。", stats: [{ label: "Paralysis Shield Cost", value: ELEMENT_CONFIG.zhongli.paralysisShieldCost }] },
    ], note: `定位：Defense / Stability / Anti-Paralysis。支援冷却：${supportCooldownLength.zhongli} 回合。`,
  },
];

export const unswCombatGuideEntries: CombatGuideEntry[] = [
  {
    id: "bianca-unsw", name: "Bianca", icon: icon("BiancaIcon2.png"),
    skills: [
      { name: "git push", description: "稳定的基础攻击技能，对 UNSW 造成直接伤害。", stats: [{ label: "Damage", value: UNIVERSITY_SKILLS.xlookup.damage }] },
      { name: "Deadline Rush", description: "以赶 Deadline 的爆发力造成高额伤害，但 Bianca 自己也会受到一定反噬伤害。", stats: [{ label: "Damage", value: UNIVERSITY_SKILLS.deadline.damage }, { label: "Self Damage", value: UNIVERSITY_SKILLS.deadline.selfDamage }] },
      { name: "Extension Request", description: "延后 UNSW 的下一次行动；如果 Presentation 正在准备，会直接取消本次准备。", stats: [{ label: "Damage", value: UNIVERSITY_SKILLS.extension.damage }, { label: "Action Delay", value: UNIVERSITY_SKILLS.extension.actionDelay }, { label: "Cooldown", value: UNIVERSITY_SKILLS.extension.cooldown }] },
      { name: "Group Chat 99+", description: "清除 Groupwork 带来的输出降低效果，并对 UNSW 造成伤害。", stats: [{ label: "Damage", value: UNIVERSITY_SKILLS.groupChat.damage }] },
      { name: "Special Consideration", description: "恢复 Bianca 的生命值，并清除 Deadline Pressure。", stats: [{ label: "Heal", value: UNIVERSITY_SKILLS.consideration.heal }, { label: "Cooldown", value: UNIVERSITY_SKILLS.consideration.cooldown }] },
      { name: "毕业", description: "Bianca 的最终技能，对 UNSW 造成极高伤害。", stats: [{ label: "Damage", value: UNIVERSITY_SKILLS.graduation.damage }] },
    ],
  },
  {
    id: "unsw", name: "UNSW", subtitle: "The University of New South Wales", icon: icon("UNSWIcon1.png"),
    skills: [
      { name: "Assignment", description: "造成基础伤害，并根据 Pressure 层数增加额外伤害。", stats: [{ label: "Base Damage", value: UNSW_SKILLS.assignment.damage }, { label: "Pressure Bonus / Stack", value: UNSW_SKILLS.assignment.pressureBonusPerStack }] },
      { name: "Groupwork", description: "造成伤害并施加 Groupwork，降低 Bianca 下一次攻击的输出。", stats: [{ label: "Damage", value: UNSW_SKILLS.groupwork.damage }, { label: "Player Damage Multiplier", value: UNSW_SKILLS.groupwork.playerDamageMultiplier }] },
      { name: "Presentation", description: "高伤害技能。UNSW 会先准备 Presentation，再发动攻击；可以被 Extension Request 取消准备。", stats: [{ label: "Normal Damage", value: UNSW_SKILLS.presentation.damage }, { label: "Phase 2 Damage", value: UNSW_SKILLS.presentation.phase2Damage }] },
      { name: "Surprise Quiz", description: "快速发动的直接攻击。", stats: [{ label: "Damage", value: UNSW_SKILLS.quiz.damage }] },
      { name: "Rubric Updated", description: "改变当前战斗节奏，并削减 Bianca 的部分能量。", stats: [{ label: "Damage", value: UNSW_SKILLS.rubric.damage }, { label: "Energy Loss", value: UNSW_SKILLS.rubric.energyLoss }] },
      { name: "Final Exam", description: "UNSW 后半阶段的强力攻击。", stats: [{ label: "Damage", value: UNSW_SKILLS.finalExam.damage }] },
      { name: "Course Fee", description: "随机收取学费，并造成收费金额一定比例的伤害。", stats: [{ label: "收费范围", value: `${UNSW_SKILLS.courseFee.minCharge}–${UNSW_SKILLS.courseFee.maxCharge}` }, { label: "伤害比例", value: `${Math.round(UNSW_SKILLS.courseFee.damageRate * 100)}%` }] },
    ], note: `Phase 2 — Week 10：HP 降至 ${Math.round(UNSW_STATS.phase2Threshold * 100)}% 时进入。行动演出速度变为 ${UNSW_STATS.phase2SpeedMultiplier}×，Presentation 伤害提升，并解锁 Final Exam。`,
  },
];
