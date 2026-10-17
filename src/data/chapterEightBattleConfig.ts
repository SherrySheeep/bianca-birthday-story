// Chapter 8 的战斗平衡统一放在这里。修改后重新 build / 部署即可。
export const BIANCA_STATS = {
  // 深渊法师战最大 HP、初始护盾，以及 UNSW Boss 战最大 HP。
  maxHp: 180,
  startingShield: 0,
  unswMaxHp: 230,
} as const;

export const BIANCA_SKILLS = {
  basicAttack: { damage: 20, shieldDamage: 18 },
  coldJoke: {
    damage: 22,
    shieldDamage: 19,
    actionDelay: 1,
    cooldown: 1,
  },
  softHardSoft: {
    // 三段伤害可分别修改。
    softHit1Damage: 8,
    softHit1ShieldDamage: 5,
    hardHitDamage: 10,
    hardHitShieldDamage: 8,
    softHit2Damage: 8,
    softHit2ShieldDamage: 5,
    actionDelay: 1,
  },
} as const;

export const ABYSS_MAGE_STATS = {
  blue: { maxHp: 100, maxShield: 70 },
  red: { maxHp: 120, maxShield: 55 },
  purple: { maxHp: 105, maxShield: 60 },
} as const;

export const ABYSS_MAGE_SKILLS = {
  blue: {
    iceShard: { damage: 8 },
    frostShield: { shieldGain: 18 },
  },
  red: {
    fireball: { damage: 11 },
    flameBurst: { damage: 16 },
  },
  purple: {
    lightningStrike: { damage: 7 },
    paralysisInterference: { damage: 7, actionDelaySlots: 1 },
  },
  resonance: { shieldGain: 10 },
} as const;

export const ELEMENT_CONFIG = {
  // 仪式前伤害倍率：0.10 = 正常伤害的 10%。
  tutorialDamageMultiplier: 0.50,
  burn: { duration: 2, damagePerTick: 8 },
  amber: { cooldown: 2, fireVsIceShieldMultiplier: 2 },
  venti: { cooldown: 2, actionDelayAmount: 1, spreadDamage: 7 },
  zhongli: {
    cooldown: 3,
    shieldAmount: 80,
    paralysisShieldCost: 12,
    blocksParalysisDelay: true,
  },
  break: { actionDelayAmount: 1 },
} as const;

export const ENERGY_CONFIG = {
  maxEnergy: 100,
  basicAttackGain: 25,
  coldJokeGain: 30,
  enemyTurnGain: 12,
  ultimateCost: 100,
} as const;

export const DAMAGE_RULES = {
  // 护盾伤害溢出后转化为 HP 伤害的比例；1 = 剩余伤害全部穿透到 HP。
  shieldOverflowToHpRatio: 1,
  // 连续失败两次后的隐形减伤保护。
  retryAssistIncomingDamageMultiplier: 0.82,
} as const;

export const UNSW_STATS = {
  maxHp: 620,
  phase2Threshold: 0.5,
  phase2SpeedMultiplier: 1.18,
} as const;

export const UNSW_SKILLS = {
  assignment: { damage: 28 },
  groupwork: { damage: 15, playerDamageMultiplier: 0.7 },
  presentation: { damage: 40, phase2Damage: 47 },
  quiz: { damage: 19 },
  rubric: { damage: 12, energyLoss: 18 },
  finalExam: { damage: 52 },
  // Course Fee 会在这个金额区间内随机收费，伤害为收费金额 × damageRate（向上取整）。
  courseFee: { minCharge: 1000, maxCharge: 2500, damageRate: 0.012 },
  // 一回合 = Bianca 行动一次 + UNSW 行动一次。新 Pressure 从下一轮开始结算，共持续 3 个完整回合。
  pressure: { damagePerStack: 3, maxStacks: 5, durationTurns: 3 },
} as const;

export const UNIVERSITY_SKILLS = {
  // energyCost 是施放时先消耗的能量；命中后仍会获得 energyGain。
  xlookup: { damage: 56, energyCost: 0, energyGain: 22 },
  deadline: { damage: 82, energyCost: 8, energyGain: 0, selfDamage: 10 },
  extension: { damage: 30, energyCost: 10, energyGain: 0, actionDelay: 1, cooldown: 1 },
  groupChat: { damage: 35, energyCost: 12, energyGain: 0 },
  consideration: { damage: 0, energyCost: 20, energyGain: 0, heal: 85, cooldown: 2 },
  graduation: { damage: 200, energyCost: 100 },
} as const;

// Bianca 在 UNSW 战败后重新挑战时使用的隐藏补偿数值。
export const UNSW_RETRY_ASSIST = {
  bossStartingHp: 310,
  playerStartingEnergy: 75,
  playerDamageMultiplier: 1.1,
  gitPushEnergyGain: 30,
} as const;

// Phase 2 台词与无法击杀 UNSW 时的弹幕都集中在这里，之后可以直接增删文字。
export const UNSW_BATTLE_COPY = {
  phase2Intro: [
    { speaker: "UNSW", text: "哈哈哈哈哈！" },
    { speaker: "UNSW", text: "你以为快结束了？" },
    { speaker: "UNSW", text: "现在才 Week 10！" },
    { speaker: "Bianca", text: "可恶啊……" },
    { speaker: "Bianca", text: "啊啊啊啊啊受不了了我要毕业！！！" },
    { speaker: "系统", text: "系统提示：终结技「毕业」已解锁。" },
  ],
  graduationReady: [
    { speaker: "Bianca", text: "可恶，我感受到了周身涌动的力量！" },
    { speaker: "Bianca", text: "我！要！毕！业！" },
  ],
  graduationLockedTaunt: "哟，assignment 没写完就要毕业？",
  survivalTaunts: [
    "就这？有本事毕业啊！",
    "哈哈哈就不让你毕业！",
    "只要你的 zid 还没有过期，你就别想逃出去！",
  ],
  biancaReply: "让我毕业！",
} as const;

export const BATTLE_TIMING = {
  dialogueLead: 800,
  projectile: 400,
  hit: 650,
  aoeStagger: 100,
  actionRecover: 380,
  // 每句自动 battle dialogue 的停留时间；想加长台词主要改这里。
  dialogueLine: 1600,
} as const;

export type ChapterEightSupport = "amber" | "venti" | "zhongli";

export const supportCooldownLength: Record<ChapterEightSupport, number> = {
  amber: ELEMENT_CONFIG.amber.cooldown,
  venti: ELEMENT_CONFIG.venti.cooldown,
  zhongli: ELEMENT_CONFIG.zhongli.cooldown,
};

// 兼容现有视觉层读取；平衡数值优先从上面的分组配置修改。
export const chapterEightBattleConfig = {
  timing: BATTLE_TIMING,
  burnDuration: ELEMENT_CONFIG.burn.duration,
  burnDamage: ELEMENT_CONFIG.burn.damagePerTick,
  amberCooldown: ELEMENT_CONFIG.amber.cooldown,
  ventiCooldown: ELEMENT_CONFIG.venti.cooldown,
  zhongliCooldown: ELEMENT_CONFIG.zhongli.cooldown,
  geoShieldAmount: ELEMENT_CONFIG.zhongli.shieldAmount,
  geoShieldParalysisCost: ELEMENT_CONFIG.zhongli.paralysisShieldCost,
  fireVsIceShieldMultiplier: ELEMENT_CONFIG.amber.fireVsIceShieldMultiplier,
  swirlDamage: ELEMENT_CONFIG.venti.spreadDamage,
  coldJokeDelayAmount: BIANCA_SKILLS.coldJoke.actionDelay,
  ventiDelayAmount: ELEMENT_CONFIG.venti.actionDelayAmount,
} as const;
